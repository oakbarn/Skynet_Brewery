# Device protocol (Arduino Mega over USB, ESP32 over WiFi)

Both use the same plain-text protocol: one command per line, ending with a newline (`\n`), fields separated by spaces.

- **Mega over USB:** 115200 baud.
- **ESP32 over WiFi:** TCP port 4100. The ESP32 can bridge to a Mega on its second serial port. The included sketch does this.

## Server → device

| Line | Meaning |
|---|---|
| `HELLO` | Sent after connecting. The device answers `HELLO <name> <firmware>` and reports all its inputs. |
| `PING` | Sent every 2 seconds. **If the device hears nothing for 10 seconds it must turn every output OFF** (safety if the PC, cable or WiFi fails). |
| `DO <pin> <0\|1>` | Set a digital output. The device answers with the same line to confirm. |
| `PWM <pin> <0-255>` | Set a PWM output (the panel shows 0-100 %). The device answers with the same line. |
| `AO <pin> <0-1000>` | Set an analog output, in tenths of a percent of full scale (0 = 0 V / 4 mA, 1000 = 10 V / 20 mA). The Mega drives a PWM-to-0-10 V or 4-20 mA module from a PWM pin. |
| `CFG DI <pin> <PULLUP\|NOPULL>` | Input pull-up on or off. |
| `CFG RTD <cs> <2\|3\|4>` | PT100 / PT1000 probe wires on the MAX31865 board at chip-select pin `cs`. |
| `CFG TC <cs> <K\|J\|T\|N\|E\|R\|S\|B>` | Thermocouple type on the MAX31856 board at chip-select pin `cs`. |

After every reconnect the server sends the `CFG` lines and then the state of every output, so the hardware matches the screen and the panel's settings.

## Device → server

| Line | Meaning |
|---|---|
| `HELLO <name> <firmware>` | Answer to HELLO, shown on the Devices page. |
| `DO <pin> <0\|1>` | Confirms an output state. |
| `DI <pin> <0\|1>` | Digital input. Send it on every change, and all inputs every few seconds. |
| `A <n> <raw>` | Analog input (0-1023), `n` = 0 for A0, 1 for A1 … Sent every second. |
| `RTD <cs> <raw\|NAN>` | PT100 / PT1000: the MAX31865's 15-bit reading (0-32767). `NAN` = probe fault. Every second. |
| `TC <cs> <°C\|NAN>` | Thermocouple temperature in °C from the MAX31856. `NAN` = open or shorted probe. Every second. |
| `P <pin> <count>` | Flow meter: pulses counted since the device started. Every second. |
| `T <romid> <°F>` | OneWire temperature, by the probe's 16-hex-digit ROM id. |
| `ERR <text>` | Any problem. Shown on the Devices page. |

### Why temperatures use the ROM id

Every DS18B20 probe has a unique 64-bit ROM id. Elements are matched to that id, not to the probe's position on the bus. You can therefore add, remove, replace or move a probe to another vessel without renumbering the others. A new probe shows up on the Devices page under **OneWire probes seen**, where you pick the element it belongs to.

## Element settings that use the protocol

Devices are elements tied to a port on a PLC. Every Device has `device` (which PLC) and `channel` (which pin or port).

| Element | Used for | Settings |
|---|---|---|
| digitalOut | relays, SSRs, contactors, pumps, valves | `activeLow` (invert) |
| pwmOut | pump speed, element power | value is 0-100 % |
| analogOut | VFD speed, proportional valve (0-10 V, 4-20 mA) | `signal`, `rangeLow`, `rangeHigh`, `units` |
| digitalIn | switches, buttons, float / level switches, flow switches, interlocks | `activeLow` (normally-closed contact), `pullup` |
| temperature | `sensor`: `ds18b20`, `pt100`, `pt1000`, `thermocouple`, `ntc` | DS18B20: `probe` (ROM id), `device` optional. PT100/PT1000: `channel` = CS pin, `wires`, `rref`. Thermocouple: `channel` = CS pin, `tcType`. NTC: `channel` = analog pin, `r0`, `beta`, `series`, `wiring`. All: `offset` (calibration), `units` (°F or °C). Property `fault` is true when the probe is open or shorted. |
| analogIn | pressure, level, pH, any 0-5 V / 0-10 V / 4-20 mA sensor | `signal`: `raw` (`scale`, `offset`), `0-5V`, `0.5-4.5V`, `1-5V`, `0-10V` (`divider`), `4-20mA` / `0-20mA` (`shunt`, ohm), `twoPoint` (`cal1Raw`, `cal1Value`, `cal2Raw`, `cal2Value`). Ranges: `rangeLow`, `rangeHigh`, `offset`. Properties `raw` and `fault` (4-20 mA below 3.6 mA = broken wire). |
| flowMeter | hall-effect pulse flow meters | `pulsesPerUnit`, `units`. Properties `rate` (per minute) and `total` (a script can reset it: `"Flow_1" total = 0`). |

### Wiring notes (Arduino Mega)

- **0-10 V sensors** need a 2:1 voltage divider (for example two 10k resistors) so 10 V becomes 5 V at the pin. Set `divider` if you use another ratio.
- **4-20 mA sensors** need a 250 ohm resistor from the analog pin to GND (20 mA = 5 V).
- **PT100 / PT1000** use a MAX31865 board each, **thermocouples** a MAX31856 board each, all on the SPI pins 50, 51, 52 with their own CS pin. Turn on `USE_RTD` / `USE_TC` in the sketch and install the Adafruit libraries.
- **NTC thermistors**: a series resistor (usually 10k) from 5 V to the analog pin, thermistor from the pin to GND.
- **Flow meters** must be on an interrupt pin: 2, 3, 18, 19, 20 or 21.
- **Analog outputs**: the Mega has no true analog output. Use a PWM-to-0-10 V (or 4-20 mA) converter module on a PWM pin listed in `AO_PINS`.
