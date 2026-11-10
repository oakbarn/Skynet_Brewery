# Board settings and Board Talk

Each Interface (a board your Devices are wired to) has **Board settings**, and **Board Talk** shows every line the Brain and the
board send each other, in plain words (Skynet Rule 6.27). Use them to find or fix a problem with a board. Only an admin can change
them.

## Board settings

Open the **Devices** page and click **⚙ Change** on the Interface (in the BruControl Importer: **Connect your brewery**).

| Setting | What it does |
|---|---|
| **On** | On: the panel talks to this board. Off: the panel never opens it, and its Devices show as not connected. |
| **Pause communications** | The panel stops sending to the board (only the "are you there?" PING, so the board keeps its outputs as they are) and does not use what the board says. Board Talk still shows every line. Off again sends every setting and output, so the board matches the screen. |
| **Answer wait (seconds)** | If the board says nothing for this long, the Devices page shows **no answer**. 2 to 600; empty = 10. |
| **Diagnostic logging** | Every line to and from the board is written, with plain words, to a file a day in the data folder (`logs/boards`). It writes a lot: turn it off when the problem is found. |
| **Baud (USB speed)** | A USB board only. It must be the same as the program on the board; Skynet's own programs use 115200. |
| **Network port** | A board on Ethernet or WiFi only. It must be the same as the program on the board; Skynet's own programs use 4100. |

The **Lost link delay** (on the Devices page) is how long the board waits without hearing from the Brain before it turns every
output OFF.

## Board Talk

On the **Devices** page click **💬 Board Talk** on the Interface. A window opens:

- **→** lines the Brain sends to the board, **←** lines the board sends back, each with its time and its meaning in plain words.
- **Hide PING** (on to start) hides the "are you there?" line sent every 2 seconds.
- **⏸ Pause communications** / **▶ Talk again** does the same as the setting above.
- Type a line in the box and press **Send** (or Enter) to send it to the board. It is sent even while paused. For example `HELLO`
  asks the board who it is, and `DO 22 1` turns pin 22 ON. **Careful:** a line you send really turns things on and off.

## Every line

| Line | Sent | What it means |
|---|---|---|
| `HELLO` | Brain → board | Hello: the Brain asks the board who it is. The board answers HELLO with its name and program version, then reports all its inputs. |
| `HELLO <name> <program>` | board → Brain | Hello back: the board's name and the version of its program. |
| `PING` | Brain → board | Are you there? Sent every 2 seconds. A board that hears nothing for its Lost link delay turns every output OFF (a safety). |
| `CFG WD <seconds> S` | Brain → board | Lost link delay: if the board hears nothing from the Brain this many seconds, it turns every output OFF. |
| `DO <pin> <0\|1>` | both ways | Digital output: pin turned OFF (0) or ON (1). The Brain sends it; the board answers with the same line to say it is done. |
| `PWM <pin> <0-255>` | both ways | PWM output: how much power on a pin, 0 (none) to 255 (full). 128 is about half. |
| `AO <pin> <0-1000>` | Brain → board | Analog output in tenths of a percent: 0 = 0 V or 4 mA, 1000 = 10 V or 20 mA. |
| `CFG DI <pin> <PULLUP\|NOPULL> <ms>` | Brain → board | Set up a digital input: its pull-up on or off, and how long (ms) a change must hold before it counts (debounce). |
| `CFG RTD <pin> <2\|3\|4>` | Brain → board | Set up a PT100 / PT1000 probe board (MAX31865) on this chip-select pin, with 2, 3 or 4 wires. |
| `CFG TC <pin> <type>` | Brain → board | Set up a thermocouple board (MAX31856 / MAX31855) on this chip-select pin, with its type letter (K, J, T ...). |
| `CFG FLOW <pin> S` | Brain → board | Raspberry Pi only: count flow meter pulses on this pin. |
| `CFG STEP <step> <dir> <enable> <flags> <top> <accel> <µs>` | Brain → board | Set up a stepper motor on its STEP and DIR pins, with its top speed and how fast it speeds up. |
| `CFG STEP4 <in1> <in2> <in3> <in4> <flags> <top> <accel>` | Brain → board | Set up a 4-wire stepper motor board. |
| `CFG HOME <step> <switch pin> <flags>` | Brain → board | A stepper motor's home switch. |
| `GO <step> <position> <steps/s>` | Brain → board | Stepper motor: go to this position. |
| `RUN <step> <steps/s>` | Brain → board | Stepper motor: keep turning at this speed (minus = backward, 0 = slow to a stop). |
| `STOP <step>` | Brain → board | Stepper motor: slow down and stop. |
| `ZERO <step> <position>` | Brain → board | Stepper motor: call where it is now this position. |
| `HOME <step> <steps/s> <max> <position>` | Brain → board | Stepper motor: turn until the home switch is hit. |
| `EN <step> <0\|1>` | Brain → board | Stepper motor driver off (0, the motor turns freely) or on (1). |
| `DI <pin> <0\|1>` | board → Brain | Digital input: the pin reads OFF (0) or ON (1). Sent on every change, and every few seconds. |
| `A <n> <0-1023>` | board → Brain | Analog input A<n>: its reading, 0 (0 V) to 1023 (5 V). Every second. |
| `ADS <channel> <raw>` | board → Brain | ADS1115 analog board, channel 0-3: 0 to 32767 is 0 to 6.144 V. Every second. |
| `RTD <pin> <raw\|NAN>` | board → Brain | PT100 / PT1000 probe reading (0-32767). NAN = the probe is not working (a fault). |
| `TC <pin> <°C\|NAN>` | board → Brain | Thermocouple temperature in °C. NAN = the probe is open or shorted. |
| `T <probe id> <°F>` | board → Brain | OneWire probe (DS18B20) temperature in °F, by the probe's own 16-letter id. |
| `P <pin> <count>` | board → Brain | Flow meter: pulses counted since the board started. Every second. |
| `W <pin> <raw>` | board → Brain | Load-cell (HX711) board on this DT pin: its raw reading. Every second. |
| `SP <step> <steps> <moving> <homed>` | board → Brain | Stepper motor: where it is (in steps), moving (1) or not (0), homed (1) or not (0). |
| `SH <step> <1\|0>` | board → Brain | Stepper motor homing done: 1 = found the switch, 0 = gave up. |
| `SD <0\|1>` | board → Brain | Ethernet boards: 1 = an SD card is in the shield. SD cards are not supported: take it out (Rule 6.11). |
| `ERR <text>` | board → Brain | The board reports a problem, in its own words. |

A line the Skynet programs do not use is shown as "The Skynet programs do not use this line". A board running another program
(BruControl's, for example) talks differently, so its lines will not make sense here. The full details are in
docs/DEVICE_PROTOCOL.md.

## From BruControl

The BruControl Import keeps each board's **On** (Enabled), **Baud** and **Response Timeout** (as the Answer wait, in seconds).
BruControl's **Logging** is not turned on in Skynet, because Diagnostic logging writes every line; the import notes list the boards
that had it, so you can turn it on while finding a problem. BruControl's **Refresh Interval** is not copied: Skynet boards report
every second by themselves.

See also [Interfaces](76-interfaces) and [Connection ratings](69-connection-ratings).
