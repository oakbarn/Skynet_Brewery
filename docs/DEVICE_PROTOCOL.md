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
| `PWM <pin> <0-255>` | Set a PWM output (the panel shows 0-100 %). The device answers with the same line. |
| `AO <pin> <0-1000>` | Set an analog output, in tenths of a percent of full scale (0 = 0 V / 4 mA, 1000 = 10 V / 20 mA). The Mega drives a PWM-to-0-10 V or 4-20 mA module from a PWM pin. |
| `CFG DI <pin> <PULLUP\|NOPULL>` | Input pull-up on or off. |
| `CFG RTD <cs> <2\|3\|4>` | PT100 / PT1000 probe wires on the MAX31865 board at chip-select pin `cs`. |
| `CFG TC <cs> <K\|J\|T\|N\|E\|R\|S\|B>` | Thermocouple type on the MAX31856 board at chip-select pin `cs` (MAX31855 boards are K only). |

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
| digitalIn | switches, buttons, float / level switches, flow switches, interlocks | `activeLow` (normally-closed contact), `pullup` |
| temperature | `sensor`: `ds18b20`, `pt100`, `pt1000`, `thermocouple`, `ntc` | DS18B20: `probeIndex` (number in the OneWire probe index), `device` optional. PT100/PT1000: `channel` = CS pin, `wires`, `rref`. Thermocouple: `channel` = CS pin, `tcType`. NTC: `channel` = analog pin, `r0`, `beta`, `series`, `wiring`. All: `offset` (calibration), `units` (°F or °C). Property `fault` is true when the probe is open or shorted. |
| analogIn | pressure, level, pH, any 0-5 V / 0-10 V / 4-20 mA sensor | `adc`: `board` (analog pin) or `ads1115` (`channel` = 0-3). `signal`: `raw` (`scale`, `offset`), `0-5V`, `0.5-4.5V`, `1-5V`, `0-10V` (`divider`), `4-20mA` / `0-20mA` (`shunt`, ohm), `twoPoint` (`cal1Raw`, `cal1Value`, `cal2Raw`, `cal2Value`). Ranges: `rangeLow`, `rangeHigh`, `offset`. Properties `raw` and `fault` (4-20 mA below 3.6 mA = broken wire). |
| scale | vessel weight and volume from load cells on HX711 boards | `channel` = DT pin(s), comma between several boards on one vessel (their counts are added). `countsPerUnit` (calibration), `weightUnits` lb / kg, `volumeUnits` gal / L, `specificGravity` (1.000 = water) or `sgFrom` (an element holding the gravity, e.g. the OG Global), `offset`, `autoTare`, `autoTareBand`, `autoTareSeconds`. Properties: `value` (weight), `volume`, `raw`. A script or the screen tares it with `"Scale" tare = true` or `"Scale" volume = 0`, and calibrates it with `"Scale" calibrate = 10` (10 = the known weight on it). |
| flowMeter | hall-effect pulse flow meters | `pulsesPerUnit`, `units`. Properties `rate` (per minute) and `total` (a script can reset it: `"Flow_1" total = 0`). |

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
