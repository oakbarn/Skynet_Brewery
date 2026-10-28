#!/usr/bin/env python3
# Skynet Pi GPIO - makes a Raspberry Pi's own GPIO pins an Interface of the Brain, like an Arduino Mega (docs/DEVICE_PROTOCOL.md)
# MIT License Granted - Copyright (c) OakBarn Brewery 2026
#
# Runs as a service on the Pi (the Brain itself, or a second Pi out at the brew stand). The panel connects to it on TCP port 4100,
# so on the Devices page it is an Interface with Board "Raspberry Pi" and Type "Ethernet": address 127.0.0.1 on the Brain itself,
# or the other Pi's address.
#
# Unlike the Mega sketch there are no pin lists to edit: a pin becomes an output, PWM output, input or flow meter when the panel
# first uses it. Pins are GPIO (BCM) numbers 2-27. Output pins are remembered (pins.json) and set OFF at start-up, before the
# panel connects.
#
# Safety: if the panel goes quiet for the lost link delay (CFG WD, default 10 s), every output is turned OFF.
#
# Needs Raspberry Pi OS (Bookworm or newer) with python3-lgpio. RTD / thermocouple boards also need python3-spidev and SPI
# turned on; DS18B20 probes need 1-Wire turned on (GPIO 4); the ADS1115 needs I2C turned on. install.sh does all of that.
# Not supported: stepper motors (a Pi can't time steps exactly; put the motor on a Mega or ESP32), analog pins (a Pi has none;
# use an ADS1115).

import argparse
import glob
import json
import os
import socket
import sys
import threading
import time

FIRMWARE = 'pi-0.1'
HERE = os.path.dirname(os.path.abspath(__file__))
PI_PINS = range(2, 28)                                  # GPIO 2-27 (0 and 1 are the HAT ID EEPROM)
SPI_BUS_PINS = {7, 8, 9, 10, 11}                        # CE1, CE0, MISO, MOSI, SCLK
I2C_PINS = {2, 3}
DEFAULTS = {
    'name': socket.gethostname().upper()[:16] or 'PI1',
    'listen': '0.0.0.0',                                # 127.0.0.1 = only the panel on this same Pi may connect
    'port': 4100,
    'relay_active_low': True,                           # most relay boards switch ON with LOW (same as the Mega sketch)
    'pwm_hz': 490,                                      # PWM frequency, the same as a Mega's PWM pins
    'onewire_pin': 4,                                   # DS18B20 data pin (raspi-config's 1-Wire setting uses GPIO 4)
    'tc_chip': 'max31856',                              # thermocouple boards: max31856 (any type) or max31855 (type K only)
    'ads1115': 'auto',                                  # auto = use it when one answers at I2C address 0x48; off = never
    'ads_channels': [0, 1, 2, 3],
    'hx711': {},                                        # load cells: {"DT pin": SCK pin}, e.g. {"5": 6}; the panel names a scale by DT
    'pins': [],                                         # empty = GPIO 2-27 may be used; or only these, e.g. [17, 22, 23, 27]
}


def log(*a):
    print(*a, file=sys.stderr, flush=True)


# ---------------------------------------------------------------- pins
class LgpioPins:
    """The real pins, through lgpio (works on every Pi, the Pi 5 included)."""

    def __init__(self):
        import lgpio
        self.lg = lgpio
        self.h = None
        for chip in (0, 4):                             # the 40-pin header: chip 0, or chip 4 on a Pi 5 with an older kernel
            try:
                h = lgpio.gpiochip_open(chip)
                if any(isinstance(x, str) and x.startswith(('pinctrl-rp1', 'pinctrl-bcm')) for x in lgpio.gpio_get_chip_info(h)):
                    self.h = h
                    break
                lgpio.gpiochip_close(h)
            except Exception:
                pass
        if self.h is None:
            self.h = lgpio.gpiochip_open(0)
        self.callbacks = {}

    def output(self, pin, level):
        self.lg.gpio_claim_output(self.h, pin, level)

    def write(self, pin, level):
        self.lg.gpio_write(self.h, pin, level)

    def pwm(self, pin, hz, percent):
        self.lg.tx_pwm(self.h, pin, hz if percent > 0 else 0, percent)

    def input(self, pin, pullup):
        self.lg.gpio_claim_input(self.h, pin, self.lg.SET_PULL_UP if pullup else self.lg.SET_PULL_NONE)

    def read(self, pin):
        return self.lg.gpio_read(self.h, pin)

    def count(self, pin, on_pulse):
        self.lg.gpio_claim_alert(self.h, pin, self.lg.FALLING_EDGE, self.lg.SET_PULL_UP)
        self.callbacks[pin] = self.lg.callback(self.h, pin, self.lg.FALLING_EDGE, lambda chip, gpio, level, tick: on_pulse(gpio))

    def free(self, pin):
        if pin in self.callbacks:
            self.callbacks.pop(pin).cancel()
        self.lg.gpio_free(self.h, pin)


class FakePins:
    """No hardware: for trying the program on any computer (--fake). Every write is logged; inputs come from --fake-inputs."""

    def __init__(self, inputs_file=None):
        self.levels, self.inputs_file = {}, inputs_file

    def output(self, pin, level):
        self.write(pin, level)

    def write(self, pin, level):
        self.levels[pin] = level
        log(f'pin {pin} = {level}')

    def pwm(self, pin, hz, percent):
        log(f'pin {pin} pwm {percent:g}%')

    def input(self, pin, pullup):
        pass

    def read(self, pin):
        try:
            with open(self.inputs_file) as f:
                return int(json.load(f).get(str(pin), 1))
        except Exception:
            return 1

    def count(self, pin, on_pulse):
        pass

    def free(self, pin):
        pass


# ---------------------------------------------------------------- SPI boards (MAX31865, MAX31856, MAX31855), chip-select on any free pin
class Spi:
    def __init__(self, pins):
        import spidev
        self.pins, self.dev = pins, spidev.SpiDev()
        self.dev.open(0, 0)
        try:
            self.dev.no_cs = True                       # the chip-select is our own pin, not CE0
        except Exception:
            pass
        self.dev.max_speed_hz = 500000
        self.lock = threading.Lock()

    def xfer(self, cs, data, mode):
        with self.lock:
            self.dev.mode = mode
            self.pins.write(cs, 0)
            try:
                return self.dev.xfer2(list(data))
            finally:
                self.pins.write(cs, 1)


class Max31865:                                         # PT100 / PT1000: reports the 15-bit RTD reading, like Adafruit's readRTD()
    def __init__(self, spi, cs, wires):
        self.spi, self.cs = spi, cs
        self.setup(wires)

    def setup(self, wires):
        self.cfg = 0xC0 | (0x10 if int(wires) == 3 else 0)   # bias on, auto convert, 3-wire or 2/4-wire, 60 Hz filter
        self.spi.xfer(self.cs, [0x80, self.cfg | 0x02], 1)  # and clear any fault

    def read(self):
        r = self.spi.xfer(self.cs, [0x01, 0, 0], 1)
        raw = (r[1] << 8) | r[2]
        if raw & 1:                                     # fault bit: open or shorted probe
            self.spi.xfer(self.cs, [0x80, self.cfg | 0x02], 1)
            return None
        return raw >> 1


class Max31856:                                         # thermocouple, any type
    TYPES = {'B': 0, 'E': 1, 'J': 2, 'K': 3, 'N': 4, 'R': 5, 'S': 6, 'T': 7}

    def __init__(self, spi, cs, kind):
        self.spi, self.cs = spi, cs
        self.setup(kind)

    def setup(self, kind):
        if kind not in self.TYPES:
            raise ValueError(f'thermocouple type {kind} is not B, E, J, K, N, R, S or T')
        self.spi.xfer(self.cs, [0x80, 0x90], 1)         # CR0: convert all the time, open-probe check on
        self.spi.xfer(self.cs, [0x81, self.TYPES[kind]], 1)   # CR1: the type, no averaging

    def read(self):
        r = self.spi.xfer(self.cs, [0x0C, 0, 0, 0, 0], 1)
        if r[4]:                                        # fault status register: open probe, over/under voltage, out of range
            return None
        v = (r[1] << 16) | (r[2] << 8) | r[3]
        if v & 0x800000:
            v -= 1 << 24
        return (v >> 5) * 0.0078125


class Max31855:                                         # thermocouple, type K only
    def __init__(self, spi, cs, kind):
        self.spi, self.cs = spi, cs
        self.setup(kind)

    def setup(self, kind):
        if kind != 'K':
            raise ValueError('MAX31855 boards are type K only')

    def read(self):
        r = self.spi.xfer(self.cs, [0, 0, 0, 0], 0)
        v = (r[0] << 24) | (r[1] << 16) | (r[2] << 8) | r[3]
        if v & 0x10000:
            return None
        t = v >> 18
        if t & 0x2000:
            t -= 1 << 14
        return t * 0.25


# ---------------------------------------------------------------- ADS1115 (I2C, 16-bit analog board) and HX711 (load cells)
class Ads1115:
    def __init__(self, lg, addr=0x48):
        self.lg, self.h = lg, lg.i2c_open(1, addr)
        lg.i2c_read_byte_data(self.h, 0x01)             # raises when nothing answers

    def read(self, ch):
        cfg = 0x8000 | ((4 + ch) << 12) | 0x0100 | (4 << 5) | 0x0003   # single shot, channel to GND, +-6.144 V, 128 per second
        self.lg.i2c_write_i2c_block_data(self.h, 0x01, [cfg >> 8, cfg & 0xFF])
        time.sleep(0.009)
        n, d = self.lg.i2c_read_i2c_block_data(self.h, 0x00, 2)
        v = (d[0] << 8) | d[1]
        return v - 65536 if v & 0x8000 else v


class Hx711:
    def __init__(self, pins, dt, sck):
        self.pins, self.dt, self.sck = pins, dt, sck
        pins.input(dt, False)
        pins.output(sck, 0)

    def read(self):
        if self.pins.read(self.dt):                     # not ready
            return None
        v = 0
        for _ in range(24):
            self.pins.write(self.sck, 1)
            self.pins.write(self.sck, 0)
            v = (v << 1) | self.pins.read(self.dt)
        self.pins.write(self.sck, 1)                    # 25th pulse: channel A, gain 128 next time
        self.pins.write(self.sck, 0)
        return v - (1 << 24) if v & 0x800000 else v


# ---------------------------------------------------------------- the board
class Board:
    def __init__(self, settings, pins, fake=False):
        self.s, self.pins, self.fake = settings, pins, fake
        self.allowed = set(settings['pins'] or PI_PINS)
        self.blocked = {}                               # pin -> what uses it (SPI, I2C, 1-Wire)
        if not fake:
            if os.path.exists('/dev/spidev0.0'):
                self.blocked.update({p: 'SPI (RTD and thermocouple boards)' for p in SPI_BUS_PINS})
            if os.path.exists('/dev/i2c-1'):
                self.blocked.update({p: 'I2C (ADS1115)' for p in I2C_PINS})
            if glob.glob('/sys/bus/w1/devices/w1_bus_master*'):
                self.blocked[int(settings['onewire_pin'])] = '1-Wire (DS18B20 probes)'
        self.outs, self.pwms, self.aos, self.ins, self.flows = {}, {}, {}, {}, {}
        self.rtds, self.tcs, self.hx = {}, {}, {}
        self.spi = self.ads = None
        self.lock = threading.RLock()
        self.watchdog_s, self.last_rx, self.tripped = 10.0, time.monotonic(), False
        self.state_file = os.path.join(HERE, 'pins.json')
        self.temps = {}                                 # DS18B20 ROM id -> deg F
        self._start_up()

    # ---- start-up: remembered outputs OFF before anything else
    def _start_up(self):
        try:
            with open(self.state_file) as f:
                saved = json.load(f)
        except Exception:
            saved = {}
        for pin in saved.get('outputs', []):
            self._claim_out(int(pin), save=False)
        for pin in saved.get('pwm', []):
            self._claim_pwm(int(pin), save=False)
        for dt, sck in (self.s['hx711'] or {}).items():
            try:
                self.hx[int(dt)] = [Hx711(self.pins, int(dt), int(sck)), 0, 0]
            except Exception as e:
                log(f'HX711 on DT {dt}: {e}')
        if str(self.s['ads1115']).lower() != 'off' and not self.fake:
            try:
                self.ads = Ads1115(self.pins.lg)
            except Exception:
                if str(self.s['ads1115']).lower() == 'on':
                    log('ADS1115 not found on I2C')

    def _save(self):
        try:
            with open(self.state_file, 'w') as f:
                json.dump({'outputs': sorted(self.outs), 'pwm': sorted(set(self.pwms) | set(self.aos))}, f)
        except Exception as e:
            log(f'could not save {self.state_file}: {e}')

    def _off_level(self):
        return 1 if self.s['relay_active_low'] else 0

    def check_pin(self, pin, what):
        """None when the pin may be used for this, otherwise the ERR text."""
        if pin not in PI_PINS:
            return f'pin {pin} is not a Raspberry Pi GPIO pin (use GPIO 2-27)'
        if pin not in self.allowed:
            return f'pin {pin} is not in this Pi\'s "pins" list (settings.json)'
        if pin in self.blocked:
            return f'pin {pin} is used by {self.blocked[pin]}'
        for kind, used in (('an output', self.outs), ('a PWM output', self.pwms), ('an analog output', self.aos), ('an input', self.ins),
                           ('a flow meter', self.flows), ('an RTD or thermocouple chip-select', {**self.rtds, **self.tcs}),
                           ('a load cell', {p: 1 for dt, h in self.hx.items() for p in (dt, h[0].sck)})):
            if pin in used and kind != what:
                return f'pin {pin} is already {kind}'
        return None

    def _claim_out(self, pin, save=True):
        if pin in self.outs:
            return
        self.pins.output(pin, self._off_level())
        self.outs[pin] = 0
        if save:
            self._save()

    def _claim_pwm(self, pin, save=True):
        if pin in self.pwms or pin in self.aos:
            return
        self.pins.output(pin, 0)
        self.pwms[pin] = 0
        if save:
            self._save()

    # ---- outputs
    def do(self, pin, on):
        err = self.check_pin(pin, 'an output')
        if err:
            return f'ERR {err}'
        self._claim_out(pin)
        self.outs[pin] = 1 if on else 0
        self.pins.write(pin, self._off_level() ^ (1 if on else 0))
        return f'DO {pin} {self.outs[pin]}'

    def pwm(self, pin, value, ao=False):
        err = self.check_pin(pin, 'an analog output' if ao else 'a PWM output')
        if err:
            return f'ERR {err}'
        top = 1000 if ao else 255
        value = max(0, min(top, value))
        if ao and pin not in self.aos:
            self.pins.output(pin, 0)
            self.aos[pin] = 0
            self._save()
        elif not ao:
            self._claim_pwm(pin)
        (self.aos if ao else self.pwms)[pin] = value
        self.pins.pwm(pin, self.s['pwm_hz'], round(value * 100 / top, 2))
        return f'{"AO" if ao else "PWM"} {pin} {value}'

    def all_off(self):
        with self.lock:
            for pin in self.outs:
                self.outs[pin] = 0
                self.pins.write(pin, self._off_level())
            for d in (self.pwms, self.aos):
                for pin in d:
                    d[pin] = 0
                    self.pins.pwm(pin, self.s['pwm_hz'], 0)

    # ---- inputs
    def cfg_di(self, pin, pull, debounce):
        err = self.check_pin(pin, 'an input')
        if err:
            return f'ERR {err}'
        self.pins.input(pin, pull != 'NOPULL')
        old = self.ins.get(pin)
        self.ins[pin] = {'debounce': max(0, min(5000, debounce)) / 1000, 'last': old['last'] if old else None, 'cand': None, 'since': 0}
        return None

    def cfg_flow(self, pin):
        err = self.check_pin(pin, 'a flow meter')
        if err:
            return f'ERR {err}'
        if pin not in self.flows:
            self.flows[pin] = 0
            self.pins.count(pin, self._pulse)
        return None

    def _pulse(self, pin):
        self.flows[pin] = self.flows.get(pin, 0) + 1

    def poll_inputs(self):
        """Every 10 ms: debounced inputs. Returns the DI lines to send (1 = the input is ON, pulled to GND, as on the Mega)."""
        out, now = [], time.monotonic()
        for pin, st in self.ins.items():
            v = 0 if self.pins.read(pin) else 1
            if v == st['last']:
                st['cand'] = None
                continue
            if v != st['cand']:
                st['cand'], st['since'] = v, now
            if now - st['since'] >= st['debounce']:
                st['last'], st['cand'] = v, None
                out.append(f'DI {pin} {v}')
        return out

    def report_inputs(self):
        out = []
        for pin, st in self.ins.items():
            st['last'] = 0 if self.pins.read(pin) else 1
            out.append(f'DI {pin} {st["last"]}')
        return out

    # ---- SPI probes
    def _spi(self):
        if self.spi is None:
            self.spi = Spi(self.pins)
        return self.spi

    def cfg_spi(self, kind, cs, setting):
        table = self.rtds if kind == 'RTD' else self.tcs
        if cs in table:
            try:
                table[cs].setup(setting)
            except Exception as e:
                return f'ERR {kind} {cs}: {e}'
            return None
        err = self.check_pin(cs, 'an RTD or thermocouple chip-select')
        if err:
            return f'ERR {err}'
        try:
            spi = self._spi()
            self.pins.output(cs, 1)
            chip = Max31865 if kind == 'RTD' else Max31855 if str(self.s['tc_chip']).lower() == 'max31855' else Max31856
            table[cs] = chip(spi, cs, setting)
        except Exception as e:
            return f'ERR {kind} {cs}: {e} (is SPI turned on? run install.sh)'
        return None

    # ---- every second: flow counts, RTD, thermocouples, load cells, ADS1115 (run off the main loop: these take time)
    def read_fast(self):
        out = [f'P {pin} {n}' for pin, n in list(self.flows.items())]
        for cs, chip in list(self.rtds.items()):
            try:
                v = chip.read()
            except Exception:
                v = None
            out.append(f'RTD {cs} {"NAN" if v is None else v}')
        for cs, chip in list(self.tcs.items()):
            try:
                v = chip.read()
            except Exception:
                v = None
            out.append(f'TC {cs} {"NAN" if v is None else f"{v:.2f}"}')
        for dt, h in self.hx.items():
            if h[2]:
                out.append(f'W {dt} {round(h[1] / h[2])}')
                h[1] = h[2] = 0
        if self.ads:
            for ch in self.s['ads_channels']:
                try:
                    out.append(f'ADS {ch} {max(0, self.ads.read(int(ch)))}')
                except Exception as e:
                    out.append(f'ERR ADS1115: {e}')
                    break
        return out

    def sample_scales(self):
        for h in self.hx.values():
            try:
                v = h[0].read()
            except Exception:
                v = None
            if v is not None:
                h[1] += v
                h[2] += 1

    # ---- DS18B20 probes through the Linux 1-Wire driver (each read takes about 0.75 s, so a thread of their own)
    def read_probes(self):
        found = {}
        for d in glob.glob('/sys/bus/w1/devices/*-*'):
            if os.path.basename(d).split('-')[0] not in ('28', '10', '22', '3b', '42'):
                continue
            try:
                with open(os.path.join(d, 'id'), 'rb') as f:
                    rom = f.read(8).hex().upper()       # the same 16 hex digits the Mega reports
                c = None
                if os.path.exists(os.path.join(d, 'temperature')):
                    with open(os.path.join(d, 'temperature')) as f:
                        c = int(f.read().strip()) / 1000
                else:
                    with open(os.path.join(d, 'w1_slave')) as f:
                        txt = f.read()
                    if 'YES' in txt and 't=' in txt:
                        c = int(txt.rsplit('t=', 1)[1]) / 1000
                if c is not None and c > -60:
                    found[rom] = c * 9 / 5 + 32
            except Exception:
                pass
        self.temps = found


# ---------------------------------------------------------------- the link to the panel
class Server:
    def __init__(self, board, host, port):
        self.b, self.conn = board, None
        self.send_lock = threading.Lock()
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((host, port))
        self.sock.listen(2)
        log(f'Skynet Pi GPIO {FIRMWARE} "{board.s["name"]}" listening on {host}:{port}')

    def send(self, *lines):
        with self.send_lock:
            c = self.conn
            if not c or not lines:
                return
            try:
                c.sendall(('\n'.join(lines) + '\n').encode())
            except OSError:
                pass

    def accept_loop(self):
        while True:
            c, addr = self.sock.accept()
            c.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            old, self.conn = self.conn, c               # a new panel connection replaces the old one
            if old:
                try:
                    old.close()
                except OSError:
                    pass
            log(f'panel connected from {addr[0]}')
            threading.Thread(target=self.read_loop, args=(c,), daemon=True).start()

    def read_loop(self, c):
        buf = b''
        while True:
            try:
                data = c.recv(4096)
            except OSError:
                data = b''
            if not data:
                break
            buf += data
            while b'\n' in buf:
                line, buf = buf.split(b'\n', 1)
                self.handle(line.decode(errors='replace').strip())
        if self.conn is c:
            self.conn = None
            log('panel disconnected')

    def handle(self, cmd):
        if not cmd:
            return
        b = self.b
        with b.lock:
            b.last_rx = time.monotonic()
            if b.tripped:
                b.tripped = False
                self.send('ERR watchdog cleared')
            p = cmd.split()
            op = p[0].upper()
            num = lambda i: int(float(p[i])) if len(p) > i else 0
            try:
                if op == 'PING':
                    return
                if op == 'HELLO':
                    self.send(f'HELLO {b.s["name"]} {FIRMWARE}', *b.report_inputs())
                    threading.Thread(target=lambda: self.send(*b.read_fast()), daemon=True).start()
                    return
                if op == 'DO':
                    self.send(b.do(num(1), num(2) == 1))
                    return
                if op in ('PWM', 'AO'):
                    self.send(b.pwm(num(1), num(2), ao=op == 'AO'))
                    return
                if op == 'CFG' and len(p) >= 3:
                    kind = p[1].upper()
                    if kind == 'WD':
                        b.watchdog_s = max(3, min(600, num(2)))
                        return
                    if kind == 'DI':
                        r = b.cfg_di(num(2), p[3].upper() if len(p) > 3 else 'PULLUP', num(4) if len(p) > 4 else 20)
                    elif kind == 'FLOW':
                        r = b.cfg_flow(num(2))
                    elif kind in ('RTD', 'TC'):
                        r = b.cfg_spi(kind, num(2), p[3].upper() if len(p) > 3 else ('3' if kind == 'RTD' else 'K'))
                    elif kind in ('STEP', 'STEP4', 'HOME'):
                        r = 'ERR stepper motors can\'t run on a Raspberry Pi\'s own pins: put the motor on a Mega or ESP32'
                    else:
                        r = f'ERR CFG {kind}: not known to the Pi program'
                    if r:
                        self.send(r)
                    return
                if op in ('GO', 'RUN', 'STOP', 'ZERO', 'HOME', 'EN'):
                    self.send('ERR stepper motors can\'t run on a Raspberry Pi\'s own pins: put the motor on a Mega or ESP32')
                    return
                self.send(f'ERR unknown command: {cmd}')
            except (ValueError, IndexError):
                self.send(f'ERR bad command: {cmd}')


def main():
    ap = argparse.ArgumentParser(description='Skynet Pi GPIO: a Raspberry Pi\'s own pins as an Interface of the Skynet Brain')
    ap.add_argument('--settings', default=os.path.join(HERE, 'settings.json'), help='settings file (optional)')
    ap.add_argument('--port', type=int, help='TCP port (default 4100)')
    ap.add_argument('--listen', help='address to listen on (default 0.0.0.0)')
    ap.add_argument('--fake', action='store_true', help='no hardware: log pin changes instead (for trying it on any computer)')
    ap.add_argument('--fake-inputs', help='with --fake: a JSON file {"pin": 0 or 1} read as the input levels')
    a = ap.parse_args()

    s = dict(DEFAULTS)
    if os.path.exists(a.settings):
        with open(a.settings) as f:
            s.update(json.load(f))
    if a.port:
        s['port'] = a.port
    if a.listen:
        s['listen'] = a.listen

    pins = FakePins(a.fake_inputs) if a.fake else LgpioPins()
    board = Board(s, pins, fake=a.fake)
    if a.fake:
        board.state_file = os.devnull
    server = Server(board, s['listen'], int(s['port']))
    threading.Thread(target=server.accept_loop, daemon=True).start()

    def probes_loop():
        while True:
            board.read_probes()
            lines = [f'T {rom} {f:.2f}' for rom, f in board.temps.items()]
            server.send(*lines)
            time.sleep(1 if lines else 5)

    def fast_loop():
        while True:
            t = time.monotonic()
            while time.monotonic() - t < 1:
                board.sample_scales()
                time.sleep(0.1)
            server.send(*board.read_fast())

    if not a.fake:
        threading.Thread(target=probes_loop, daemon=True).start()
    threading.Thread(target=fast_loop, daemon=True).start()

    last_all = time.monotonic()
    while True:                                         # main loop: watchdog and inputs, every 10 ms
        time.sleep(0.01)
        with board.lock:
            if not board.tripped and time.monotonic() - board.last_rx > board.watchdog_s:
                board.tripped = True
                board.all_off()
                log(f'lost link: no word from the panel for {board.watchdog_s:g} s, all outputs OFF')
            lines = board.poll_inputs()
            if time.monotonic() - last_all >= 3:        # every input every few seconds, as the protocol asks
                last_all = time.monotonic()
                lines = board.report_inputs()
        server.send(*lines)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
