# Device protocol (boards over USB, Ethernet or WiFi)

Both use the same plain-text protocol: one command per line, ending with a newline (`\n`), fields separated by spaces.

- **Mega over USB:** 115200 baud.
- **Ethernet:** TCP port 4100. A Mega with a W5500 / W5100 Ethernet shield (`USE_ETHERNET 1` in the Mega sketch), or an ESP32 board with an Ethernet jack running the bridge sketch with `USE_ETHERNET 1`. Add it on the Devices page as **Board on Ethernet** with its IP address.
- **ESP32 over WiFi:** TCP port 4100. The ESP32 can bridge to a Mega on its second serial port. The included sketch does this.

USB and Ethernet are preferred over WiFi for anything that heats or pumps. On every link, the board turns all outputs off if it hears nothing for 10 seconds.

## Server → device

| Line | Meaning |
|---|---|
| `HELLO` | Sent after connecting. The device answers `HELLO <name> <firmware>` and reports all its inputs. |
| `PING` | Sent every 2 seconds. **If the device hears nothing for 10 seconds it must turn every output OFF** (safety if the PC, cable or WiFi fails). |
| `DO <pin> <0\|1>` | Set a digital output. The device answers with the same line to confirm. |
| `PWM <pin> <0-255>` | Set a PWM output (pwmOut elements show 0-100 %; also PID elements with "PWM output" on). The device answers with the same line. |
| `AO <pin> <0-1000>` | Set an analog output, in tenths of a percent of full scale (0 = 0 V / 4 mA, 1000 = 10 V / 20 mA). The Mega drives a PWM-to-0-10 V or 4-20 mA module from a PWM pin. |
| `CFG DI <pin> <PULLUP\|NOPULL> <ms>` | Input pull-up on or off, and debounce: a new level must hold this many ms before the board reports it (default 20). |
| `CFG RTD <cs> <2\|3\|4>` | PT100 / PT1000 probe wires on the MAX31865 board at chip-select pin `cs`. |
| `CFG TC <cs> <K\|J\|T\|N\|E\|R\|S\|B>` | Thermocouple type on the MAX31856 board at chip-select pin `cs` (MAX31855 boards are K only). |
| `CFG STEP …`, `GO`, `RUN`, `STOP`, `ZERO`, `HOME`, `EN` | Stepper motors: see **Stepper motors** below. |

After every reconnect the server sends the `CFG` lines and then the state of every output, so the hardware matches the screen and the panel's settings.

## Device → server

| Line | Meaning |
|---|---|
| `HELLO <name> <firmware>` | Answer to HELLO, shown on the Devices page. |
| `DO <pin> <0\|1>` | Confirms an output state. |
| `DI <pin> <0\|1>` | Digital input. Send it on every change, and all inputs every few seconds. |
| `A <n> <raw>` | Analog input (0-1023), `n` = 0 for A0, 1 for A1 … Sent every second. |
| `RTD <cs> <raw\|NAN>` | PT100 / PT1000: the MAX31865's 15-bit reading (0-32767). `NAN` = probe fault. Every second. |
| `TC <cs> <°C\|NAN>` | Thermocouple temperature in °C from a MAX31856 or MAX31855 board. `NAN` = open or shorted probe. Every second. |
| `ADS <ch> <raw>` | ADS1115 16-bit analog board, channel 0-3 (0-32767 = 0-6.144 V). Every second. |
| `P <pin> <count>` | Flow meter: pulses counted since the device started. Every second. |
| `W <dt> <raw>` | HX711 load-cell board, by its DT pin: average raw count since the last report. Every second. |
| `T <romid> <°F>` | OneWire temperature, by the probe's 16-hex-digit ROM id. |
| `SP <step pin> <steps> <0\|1> <0\|1>` | Stepper position in steps, moving, homed. Every 0.2 s while moving, every second when still. |
| `SH <step pin> <1\|0>` | Stepper homing finished: 1 = found the switch, 0 = gave up. |
| `ERR <text>` | Any problem. Shown on the Devices page. |

### OneWire probe index

Every DS18B20 probe has a unique 64-bit ROM id, and the board reports each probe by that id, not by its position on the bus. The panel keeps its own **OneWire probe index** (Devices page, saved as `probes` in the config): numbered slots, each with a name and the ROM id of the probe in it. Temperature elements point to a slot number (`probeIndex`), never to the ROM id.

- **Add a probe:** plug it in. It appears under **OneWire probes seen**; pick **+ new number** (or an empty number) for it.
- **Replace a probe:** plug in the new one and pick its ROM id in that number's row. Every element using the number follows; nothing else changes.
- **Move a probe** to another vessel: give it the other number.

Older configs that put the ROM id on the element (`probe`) are moved into the index automatically.

## Element settings that use the protocol

## Boards

The "PLCs" are hobby boards: an **Arduino Mega** (USB, or Ethernet with a W5500 / W5100 shield), an **ESP32** bridge to a Mega (Ethernet or WiFi), and hobby modules wired to them (relay boards, SSRs, MOSFET modules, MAX31865 / MAX31855 / MAX31856 probe boards, ADS1115 analog board, PWM-to-0-10 V modules). Uno and Nano can run the same sketch with smaller pin lists. The Raspberry Pi runs the panel; using the Pi's own GPIO pins as Devices is not built yet.

## Devices

Devices are elements tied to a pin on a board. Every Device has `device` (which board) and `channel` (which pin, or the CS pin of its module).

| Element | Used for | Settings |
|---|---|---|
| digitalOut | relays, SSRs, contactors, pumps, valves | `activeLow` (invert) |
| pwmOut | pump speed, element power | value is 0-100 % |
| analogOut | VFD speed, proportional valve (0-10 V, 4-20 mA) | `signal`, `rangeLow`, `rangeHigh`, `units` |
| digitalIn | switches, buttons, float / level switches, flow switches, interlocks (BruControl DIN) | `mode`: `switch` (on while the input is on), `toggle` (each press flips it), `latch` (on until reset: leak, E-stop), `counter` (counts presses / pulses), `momentary` (a push button: each press gives one short ON of `pulse` ms, default 100; holding the button does not repeat it, and a bounce or second bump within `lockout` ms, default 3000 = 3 seconds, is not another press). `activeLow` (invert, normally-closed contact; same as BruControl's Active Low), `pullup`, `debounce` (ms, on the board), `onDelay` / `offDelay` (seconds the input must hold before it counts), `units` (counter). Properties: `state`, `raw` (the input itself), `count` (rising edges, a process can set it to 0), `reset` (`"Leak" reset = true` clears a latch or toggle). |
| temperature | `sensor`: `ds18b20`, `pt100`, `pt1000`, `thermocouple`, `ntc` | DS18B20: `probeIndex` (number in the OneWire probe index), `device` optional. PT100/PT1000: `channel` = CS pin, `wires`, `rref`. Thermocouple: `channel` = CS pin, `tcType`. NTC: `channel` = analog pin, `r0`, `beta`, `series`, `wiring`. All: `offset` (calibration), `units` (°F or °C). Property `fault` is true when the probe is open or shorted. |
| analogIn | pressure, level, pH, any 0-5 V / 0-10 V / 4-20 mA sensor | `adc`: `board` (analog pin) or `ads1115` (`channel` = 0-3). `signal`: `raw` (`scale`, `offset`), `0-5V`, `0.5-4.5V`, `1-5V`, `0-10V` (`divider`), `4-20mA` / `0-20mA` (`shunt`, ohm), `twoPoint` (`cal1Raw`, `cal1Value`, `cal2Raw`, `cal2Value`). Ranges: `rangeLow`, `rangeHigh`, `offset`. Properties `raw` and `fault` (4-20 mA below 3.6 mA = broken wire). |
| scale | vessel weight and volume from load cells on HX711 boards | `channel` = DT pin(s), comma between several boards on one vessel (their counts are added). `countsPerUnit` (calibration), `weightUnits` lb / kg, `volumeUnits` gal / L, `specificGravity` (1.000 = water) or `sgFrom` (an element holding the gravity, e.g. the OG variable), `offset`, `autoTare`, `autoTareBand`, `autoTareSeconds`. Properties: `value` (weight), `volume`, `raw`. A process or the screen tares it with `"Scale" tare = true` or `"Scale" volume = 0`, and calibrates it with `"Scale" calibrate = 10` (10 = the known weight on it). |
| dutyCycle, hysteresis, pid | relay or SSR switched by the server (BruControl-style control elements) | `input` (sensor element), `target`; the server switches the pin with `DO` (PID with `pwm` on sends `PWM`) |
| flowMeter | hall-effect pulse flow meters | `pulsesPerUnit`, `units`. Properties `rate` (per minute) and `total` (a process can reset it: `"Flow_1" total = 0`). |
| stepper | stepper motors (see **Stepper motors** below) | `channel` = STEP pin (IN1 on a 4-pin board), `dirPin`, `enablePin`, or `pin2`-`pin4`. Properties: `position`, `target`, `move`, `speed`, `run`, `stop`, `home`, `reset`, `moving`, `homed`, `steps`. |

### Pin names (Arduino Mega 2560)

A pin can be typed the Arduino way or the BruControl way, and both mean the same pin:

| Pin | Arduino name | BruControl number |
|---|---|---|
| Digital pins | 0-53 (or D0-D53) | 0-53 |
| Analog pins | A0-A15 | 54-69 |

The pin picker lists analog pins as `A0 = pin 54 (BruControl)` and so on. Analog pins also work as digital inputs or outputs (A5 = pin 59). On the wire the panel always sends the pin number (`DO 59 1`), and analog readings arrive as `A 5 <raw>` for A5. So a BruControl configuration that uses 54-69 works unchanged.

### Wiring notes (Arduino Mega)

- **0-10 V sensors** need a 2:1 voltage divider (for example two 10k resistors) so 10 V becomes 5 V at the pin. Set `divider` if you use another ratio.
- **4-20 mA sensors** need a 250 ohm resistor from the analog pin to GND (20 mA = 5 V).
- **PT100 / PT1000** use a MAX31865 board each, **thermocouples** a MAX31856 board (any type) or a MAX31855 board (type K) each, all on the SPI pins 50, 51, 52 with their own CS pin. Turn on `USE_RTD` / `USE_TC` in the sketch and install the Adafruit libraries.
- **ADS1115** (16-bit, 4 channels) on I2C pins 20 / 21 gives finer readings than the Mega's own analog pins, useful for pH and pressure. Turn on `USE_ADS1115`.
- **NTC thermistors**: a series resistor (usually 10k) from 5 V to the analog pin, thermistor from the pin to GND.
- **Flow meters** must be on an interrupt pin: 2, 3, 18, 19, 20 or 21.
- **Load cells**: each HX711 board takes one full bridge (4 half-bridge "bathroom scale" cells through a combinator board, or one bar / S-type cell) on any two pins (DT and SCK). Turn on `USE_HX711` and list the pins.

### Weight to volume, and auto tare

Volume = net weight ÷ (water density × specific gravity). Water is 8.345 lb per US gallon or 0.998 kg per liter. Set the gravity of what is in the vessel (wort at 1.050 weighs 5 % more than water), or point `sgFrom` at the element that holds it.

**Tare** zeroes the scale at its present reading and saves it, so it survives a restart. **Auto tare** (on by default) zeroes the scale by itself when the vessel reads empty (under 0.05 gal or 0.2 L) and steady for 10 seconds. This removes slow drift from temperature and settling, but never moves the zero while there is liquid in the vessel. Calibrate once: tare the empty scale, put a known weight on it, tap it, choose **Calibrate** and enter the weight.
- **Analog outputs**: the Mega has no true analog output. Use a PWM-to-0-10 V (or 4-20 mA) converter module on a PWM pin listed in `AO_PINS`.

## Stepper motors

A stepper is a Device like any other: it sits on pins of one board. The board makes the steps itself (exact timing, speeding up and slowing down, stopping on the home switch); the panel only says where to go. This keeps the motor smooth even though the panel talks to the board over USB, Ethernet or WiFi.

**BruControl has no stepper element** (its devices are digital / PWM / analog outputs, inputs, counters and probes), so a BruControl import never brings one in; add them on the Tabs page with **Add element > Devices: motors**.

### Drivers and wiring

| Driver board | Wired with | Microsteps (set on the board) | Shortest STEP pulse | ENABLE |
|---|---|---|---|---|
| A4988 | STEP, DIR, ENABLE pins | MS1-MS3 jumpers: 1, 2, 4, 8, 16 | 1 µs | LOW = on (leave unwired or tie to GND for always on) |
| DRV8825 | STEP, DIR, ENABLE | M0-M2: up to 32 | 2 µs | LOW = on |
| TMC2208 / TMC2209 (stand-alone, quiet) | STEP, DIR, EN | MS1 / MS2: 8, 16, 32, 64 | 1 µs | LOW = on |
| TB6600 / DM542 (big NEMA 23 motors, 24-48 V) | PUL, DIR, ENA (wire PUL-, DIR-, ENA- to GND and the + inputs to the pins) | DIP switches | 5 µs / 3 µs | ENA energized = OFF, so with ENA- to GND pick "LOW" |
| ULN2003 + 28BYJ-48 (small 5 V geared motor, slow) | IN1-IN4 | half steps: 4096 per turn | – | – |
| L298N (bipolar motor, H-bridge) | IN1-IN4 | full or half steps | – | – |

Every pin the stepper uses (STEP, DIR, ENABLE or IN1-IN4, and the home switch) goes in `STEPPER_PINS` in the Mega sketch, and `USE_STEPPER` is set to 1 (install the **AccelStepper** library by Mike McCauley). The ESP32 bridge needs no change: it passes the lines on to the Mega. Power the motor from its own supply, never from the Mega's 5 V pin (except a single 28BYJ-48), and set the driver's current limit to the motor's rating.

### Settings (properties dialog)

- **Device**, **Driver board** (picking one fills in the usual wiring, pulse and microsteps; **Add new ...** for another driver), **Wired with** (STEP / DIR, or 4 coil pins).
- **Pins**: STEP, DIR, ENABLE (empty = not wired), or IN1-IN4. **The driver is ON when the ENABLE pin is** LOW / HIGH. **Shortest STEP pulse** (µs).
- **Reverse the direction** (Yes / No).
- **Motor steps per turn**: 200 for a 1.8° motor (most NEMA 17 / 23), 400 for 0.9°, 2048 for a 28BYJ-48. **Microstepping** must match the jumpers or DIP switches on the driver. **Gearbox**: motor turns per output turn.
- **Position units** (turns, degrees, mm, in, mL, L, gal, %, steps; **Add new ...**) and **Units per output turn**: 360 for degrees, 100 for % (or 400 % per turn for a quarter-turn ball valve, so 0-100 % = 90°), the lead screw pitch for mm, the mL per turn of a dosing pump.
  Steps per unit = steps per turn × microsteps × gearbox ÷ units per turn. The dialog shows the result under **Position now**.
- **Top speed** and **Speeds up and slows down by** (units per second).
- **Keep the motor powered when stopped**: Yes holds the position (the motor runs warm); No lets it cool and turn freely.
- **Lowest / Highest position allowed**: moves are kept inside these, and **run** stops at them.
- **Home switch pin** (on the same board), **Home switch** normally open or normally closed, **Home switch is at the** low or high end, **Homing speed**, **Position at the home switch**, **Stop homing if the switch is not found within**, **Home by itself each time the board connects**.

### Processes (scripts) and the screen

| Process line | Does |
|---|---|
| `"Valve_M" target = 50` (or `value = 50`) | Go to position 50. |
| `"Valve_M" move = -10` | Go 10 units back from where it is heading. |
| `"Valve_M" speed = 5` | Top speed for the next moves (units per second). |
| `"Valve_M" run = 2` | Keep turning at 2 units per second (minus = backward, `run = 0` slows to a stop). Stops at the allowed limits. |
| `stop "Valve_M"` or `"Valve_M" stop = true` | Slow down and stop now. |
| `"Valve_M" home = true` | Turn toward the home switch until it is hit; that spot becomes the home position. |
| `reset "Valve_M"` or `"Valve_M" reset = true` | Call the present spot the home position (no switch needed). |
| `"Valve_M" enabled = false` | Turn the motor off (free to turn by hand); `true` turns it back on. |
| `wait "Valve_M" moving == false` | Wait until the move is done. |
| `wait "Valve_M" homed == true` | Wait for homing. |

`position`, `steps`, `moving` and `homed` come from the board and cannot be set by a Process. On a tab, a stepper shows its position, the target while moving, and "(not homed)" when it has a home switch that it has not found since the board started. Tapping it gives Move to, Move by, Turn at a speed, Stop, Home, Call this position home, and Turn the motor off / on.

On the simulator a stepper moves at its set speed; `sim` sets where it starts and where its home switch is, e.g. `{"start": 40, "switchAt": -5}`.

### Lines

| Server → board | Meaning |
|---|---|
| `CFG STEP <step> <dir> <enable\|-1> <flags> <top steps/s> <accel steps/s²> <pulse µs>` | Set up a STEP / DIR stepper. The STEP pin names the motor in every later line. |
| `CFG STEP4 <in1> <in2> <in3> <in4> <flags> <top> <accel>` | Set up a 4-pin stepper (IN1 names it). |
| `CFG HOME <step> <switch pin> <flags>` | Its home switch: flags 1 = the switch reads HIGH when hit (normally closed), 2 = the switch is at the + end. |
| `GO <step> <position> <steps/s>` | Go to a position (in steps). |
| `RUN <step> <steps/s>` | Keep turning (minus = backward); `RUN <step> 0` slows to a stop. |
| `STOP <step>` | Slow down and stop. |
| `ZERO <step> <position>` | Call the present spot this position (and homed). |
| `HOME <step> <steps/s> <max steps> <position>` | Turn at this speed (sign = direction) until the switch is hit, then call that spot `position`. Gives up after `max steps`. |
| `EN <step> <0\|1>` | Driver off (motor free) or on. |

Flags in `CFG STEP`: 1 reverse direction, 2 ENABLE HIGH = on, 4 keep powered when stopped, 8 half steps (4-pin boards), 16 28BYJ-48 coil order (IN1, IN3, IN2, IN4).

The board also stops a move that runs into the home switch, and the 10-second watchdog stops every motor at once. After a USB reconnect the Mega restarts, so the motor reports `homed` 0 until it is homed again.

The Mega makes steps between its other jobs, so keep each motor under about 1,000-2,000 steps per second (fewer microsteps for fast moves). The Mega firmware for steppers has been compiled with the real AccelStepper library but not yet run on a real motor. Steppers on a Raspberry Pi's own pins are not built (the Pi is not exact enough for step timing; a Pi would use a Mega or ESP32 for the motor).
