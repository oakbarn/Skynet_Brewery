# Minimum equipment and limitations

The smallest Skynet Brewery system is **1 Raspberry Pi + 1 Arduino Mega**. You can grow it up to **3 Megas and 2 ESP32s** on the same Pi. The tables below list each system, how many ports each board gives you, the least you need for each kind of device (pumps, valves, heaters, temperature, weight, flow, hydrometers and more), and what the panel cannot do yet.

Without any hardware at all, the panel still runs on a PC with its built-in simulator, so you can build Tabs and Processes before the boards arrive.

Prices are rough US prices (October 2026), not a live price check. Clone boards cost less and work the same.

## How the pieces fit

- The **Raspberry Pi** is the Brain. It runs the panel and holds the Schema, pictures, sounds and Processes. Its own pins are not used yet.
- An **Arduino Mega** is the controller. Everything that heats, pumps, opens or measures is wired to a Mega. A Mega next to the Pi plugs into it with a USB cable.
- An **ESP32** is a bridge for a Mega that sits away from the Pi (for example a panel in the brewery while the Pi is in the house). It is wired to that Mega and talks to the Pi over your network. **One ESP32 serves one Mega**, so a system never has more ESP32s than Megas. The ESP32 only passes messages through; its own pins are not used yet.

## The systems

| System | Boards | Megas on USB | Megas through an ESP32 | Pi USB sockets used (of 4) |
|---|---|---|---|---|
| 1 (minimum) | 1 Pi + 1 Mega | 1 | 0 | 1 |
| 2 | 1 Pi + 1 Mega + 1 ESP32 | 0 | 1 | 0 |
| 3 | 1 Pi + 2 Megas | 2 | 0 | 2 |
| 4 | 1 Pi + 2 Megas + 1 ESP32 | 1 | 1 | 1 |
| 5 | 1 Pi + 2 Megas + 2 ESP32s | 0 | 2 | 0 |
| 6 | 1 Pi + 3 Megas | 3 | 0 | 3 |
| 7 | 1 Pi + 3 Megas + 1 ESP32 | 2 | 1 | 2 |
| 8 | 1 Pi + 3 Megas + 2 ESP32s | 1 | 2 | 1 |

## Ports available in each system

Free pins for your equipment, after the pins the Skynet sketch needs for its own link. A Mega on USB keeps pins 0 and 1 for USB. A Mega behind an ESP32 also gives up pins 18 and 19 for the ESP32 link, which costs it 2 digital pins and 2 flow meter pins.

| System | Digital pins (outputs or inputs) | of those, PWM capable | of those, flow meter capable | Analog inputs | Total free pins |
|---|---|---|---|---|---|
| 1 (1 Pi + 1 Mega) | 52 | 15 | 6 | 16 | 68 |
| 2 (1 Pi + 1 Mega + 1 ESP32) | 50 | 15 | 4 | 16 | 66 |
| 3 (1 Pi + 2 Megas) | 104 | 30 | 12 | 32 | 136 |
| 4 (1 Pi + 2 Megas + 1 ESP32) | 102 | 30 | 10 | 32 | 134 |
| 5 (1 Pi + 2 Megas + 2 ESP32s) | 100 | 30 | 8 | 32 | 132 |
| 6 (1 Pi + 3 Megas) | 156 | 45 | 18 | 48 | 204 |
| 7 (1 Pi + 3 Megas + 1 ESP32) | 154 | 45 | 16 | 48 | 202 |
| 8 (1 Pi + 3 Megas + 2 ESP32s) | 152 | 45 | 14 | 48 | 200 |

PWM-capable and flow-meter-capable pins are part of the digital pins, not extra. Analog inputs can also be used as digital pins when you do not need them for sensors.

## Ports and types on each board

### Raspberry Pi 4 or 5 (the Brain)

| Port | How many | Used for |
|---|---|---|
| USB-A sockets | 4 (2 fast blue USB 3, 2 USB 2) | Megas on USB, a USB stick for files. A powered USB hub adds more. |
| Ethernet (gigabit) | 1 | Your home network (best for brewing) and Megas or ESP32s on Ethernet |
| WiFi and Bluetooth | built in | Your home network if no cable; ESP32s on WiFi |
| Micro-HDMI | 2 | A monitor, only needed for setup |
| USB-C | 1 | Power only (official supply) |
| GPIO header | 40 pins | **Not used by the panel yet** |

### Arduino Mega 2560 (the controller), with the Skynet sketch

| Port type | How many | What you connect | Notes |
|---|---|---|---|
| Digital pins (D0-D53) | 54, of which 52 free on USB (50 behind an ESP32) | Relays (pumps, valves, heaters through SSRs or contactors), switches, float switches, push buttons | 5 V. Any free digital pin can be an output or an input. |
| PWM pins | 15 (D2-D13, D44-D46) | Pump speed, SSR power 0-100 %, analog outputs (0-10 V or 4-20 mA through a converter module) | Part of the digital pins |
| Analog inputs (A0-A15) | 16 | 0-5 V sensors, pressure transducers, 4-20 mA sensors (250 ohm resistor), NTC thermistors, pH | 10-bit. An ADS1115 board adds 4 finer inputs on I2C. |
| Interrupt pins | 6 (D2, D3, D18, D19, D20, D21) | Pulse flow meters, up to 6 | D18 and D19 are taken by an ESP32 link; D20 and D21 by I2C if used |
| OneWire bus | 1 pin (D40 by default) | All DS18B20 temperature probes on one wire | Many probes share it; one 4.7k resistor. The panel blocks D40 for anything else once a DS18B20 is set up. |
| SPI bus | D50, D51, D52 + 1 chip-select pin per board | MAX31865 (PT100 / PT1000) and MAX31856 / MAX31855 (thermocouple) boards | An Ethernet shield also uses SPI plus D4 and D10. The panel blocks 50-52 for anything else once an RTD or thermocouple is on the board (see [Pins kept for RTD and OneWire probes](46-interface-tab-device-names)). |
| I2C bus | D20 (SDA), D21 (SCL) | ADS1115 analog board | |
| Serial ports | 4 (Serial0 on D0/D1 = USB, Serial1 on D18/D19 = ESP32 link, Serial2, Serial3 free) | USB to the Pi, or the ESP32 bridge | |
| Load cells | 2 digital pins per scale | HX711 boards (vessel weight and volume) | |
| Stepper motors | up to 4, 2-4 pins each plus a home switch | Stepper drivers (A4988, DRV8825, TMC2209, TB6600, DM542, ULN2003) | |
| USB-B | 1 | Link to the Pi, and loading the sketch | |
| Power jack | 1 | 7-12 V supply when not powered by USB | |

### ESP32 (the bridge)

| Port | How many | Used for |
|---|---|---|
| WiFi | built in | Link to the Pi (WiFi models, for example ESP32 DevKit) |
| Ethernet | 1 on Ethernet models (WT32-ETH01, Olimex ESP32-POE) | Link to the Pi. Best for anything that heats or pumps. |
| Serial link to the Mega | 2 pins (GPIO17 TX, GPIO16 RX; GPIO5 RX on a WT32-ETH01) | Wired to Mega pins 19 and 18. The Mega's 5 V signal goes through a 1k/2k voltage divider to the ESP32's 3.3 V pin. |
| USB (micro-USB or USB-C) | 1 | Power (5 V supply) and loading the bridge sketch |
| Other GPIO pins | about 20-25 | **Not used by the panel yet** |

## Equipment by device type

The least you need for each kind of device the panel supports, which Mega port it uses, and roughly what it costs. Pick only the rows your brewery has.

### Outputs (things the panel switches)

| Device | Minimum to buy | Mega port used | Rough price | Notes |
|---|---|---|---|---|
| Pump (Riptide, Chugger) | The pump + 1 relay channel (8-channel 5 V relay board) | 1 digital pin | $150-220 pump, $10-15 relay board | Mains pumps through a contactor or a 10 A+ relay, on a GFCI circuit |
| Motorized ball valve | The valve (12 V, stainless, CR05 wiring: stays put, 1 relay) + 12 V power supply | 1 digital pin per valve (CR02 wiring needs 2) | $25-45 each, $20-35 supply | BruControl VGC outputs import as valves |
| Solenoid valve (water) | 12 V solenoid valve + 1 relay channel | 1 digital pin | $10-25 | For water lines, not hot wort |
| Proportional valve or pump speed | A 0-10 V (or 4-20 mA) valve or VFD + PWM-to-0-10 V module | 1 PWM pin | $5-15 module | 0-100 % on screen |
| Electric heating element | SSR 25-40 A on a heat sink + 2-pole contactor (switched by a relay) | 1 PWM or digital pin for the SSR, 1 digital pin for the contactor | $20-45 SSR, $20-40 contactor | Mains: GFCI and an electrician's check |
| Gas burner | Gas solenoid valve rated for gas + a flame safeguard (igniter and flame sensor) | 1 digital pin | $60-150 | The flame safeguard must be hard-wired; the panel only asks for heat |
| Lights, buzzer, fan | 1 relay channel | 1 digital pin | (relay board) | |
| Stepper motor (valve handle, dropper) | Motor + driver board (28BYJ-48 + ULN2003, or NEMA 17 + TMC2209 / A4988) + 12-24 V supply + home switch | 2-4 pins + 1 for the home switch | $5-50 motor, $3-40 driver | Up to 4 per Mega |

### Temperature

| Device | Minimum to buy | Mega port used | Rough price | Notes |
|---|---|---|---|---|
| DS18B20 probe (easiest) | Waterproof stainless probe + one 4.7k resistor for all of them | OneWire bus (1 pin for all probes) | $3-10 each | Many probes on one wire |
| PT100 / PT1000 (most accurate) | 3-wire probe in a thermowell + 1 MAX31865 board per probe | SPI + 1 pin per probe | $25-40 probe, $15 board | |
| Thermocouple (burners, very hot) | Type K probe + 1 MAX31856 board (any type) or MAX31855 (type K) per probe | SPI + 1 pin per probe | $10 probe, $15-20 board | |
| NTC thermistor (cheapest) | 10k NTC + 10k resistor | 1 analog input | $2-5 | |

### Weight, flow, level and pressure

| Device | Minimum to buy | Mega port used | Rough price | Notes |
|---|---|---|---|---|
| Vessel weight / volume | 1 HX711 board + load cells (a set of 4 with a combinator board, or 1 S-type cell sized for the full vessel) | 2 digital pins per scale | $10-20 (set of 4), $30-60 (S-type) | Tare, calibration and auto tare when empty |
| Flow meter | Hall-effect meter: plastic YF-S201 for cold water, stainless food-grade for hot wort | 1 interrupt pin | $10 plastic, $30-60 stainless | Up to 6 per Mega (4 behind an ESP32) |
| Float / level switch | Stainless float switch | 1 digital pin | $5-15 | |
| Flow switch | Paddle or reed flow switch | 1 digital pin | $10-25 | Pump dry-run protection |
| Pressure or level transmitter | 0.5-4.5 V stainless transducer (1/4" NPT), or a 4-20 mA one + 250 ohm resistor | 1 analog input | $15-30 | An ADS1115 board gives finer readings |

### Other sensors and controls

| Device | Minimum to buy | Mega port used | Rough price | Notes |
|---|---|---|---|---|
| pH | pH probe with an amplifier board (0-5 V out) | 1 analog input (or ADS1115) | $30-60 | Two-point calibration in the panel |
| 0-10 V or 4-20 mA sensor | The sensor + two 10k resistors (0-10 V) or one 250 ohm (4-20 mA) | 1 analog input | under $1 extra | |
| Panel buttons and switches | Push button, selector switch | 1 digital pin each | $3-20 | Push, toggle, pulse, latch and counter modes |
| E-stop | Mushroom E-stop button | Wired to cut power to outputs; 1 digital pin to tell the panel | $10-20 | Must cut power by itself, not through the panel |
| Interlock | Door or lid switch | 1 digital pin | $3-10 | |

### Hydrometers (gravity during fermentation)

**Not built into the panel yet.** Here is how each kind would connect, so you can choose:

| Hydrometer | How it talks | What it would need | Status |
|---|---|---|---|
| Tilt | Bluetooth (sends a signal every few seconds) | The Raspberry Pi has Bluetooth built in, so it can read a Tilt directly with no extra board. An ESP32 (for example running TiltBridge) is only needed when the fermenter is out of the Pi's Bluetooth range (about 10-30 ft, less through a fridge or a steel conical). | Not supported yet |
| iSpindel | WiFi, can send to an MQTT broker | The panel already has MQTT. A small Node-RED or Home Assistant link can copy its gravity into a gAPI variable today; built-in support is not there yet. | Possible today through MQTT, not built in |
| RAPT Pill | WiFi or Bluetooth | Bluetooth like a Tilt, or its own cloud | Not supported yet |

So a Tilt does not strictly need an ESP32 when the Pi is the Brain, but an ESP32 is a good idea when the fermenters are far from the Pi. Adding Tilt support to the panel is a separate change.

## What to buy for the boards

| Item | Needed for | Rough price |
|---|---|---|
| Raspberry Pi 5, 4 GB (or a Pi 4 with 2 GB or more) | every system, 1 | $60-80 |
| Official Pi power supply (Pi 5: 27 W USB-C, Pi 4: 15 W USB-C) | every system, 1 | $12-15 |
| microSD card, 32 GB or bigger, A1 or A2 (SanDisk or Samsung) | every system, 1 | $10-15 |
| Case with a fan | every system, 1 | $10-15 |
| Ethernet cable to your router (or use the Pi's WiFi) | every system, 1 | $5-10 |
| Arduino Mega 2560 (clone or genuine) | 1 per Mega | $20 clone, $50 genuine |
| USB-A to USB-B data cable, 1-2 m | 1 per Mega on USB | $5-8 |
| ESP32 with Ethernet (WT32-ETH01 or Olimex ESP32-POE), or an ESP32 DevKit for WiFi | 1 per ESP32 | $15-25 (DevKit about $10) |
| 1k and 2k resistors (voltage divider) | 1 pair per ESP32 | under $1 |
| 5 V USB power supply for the ESP32 | 1 per ESP32 | $8 |
| Ethernet cable for the ESP32 (Ethernet models) | 1 per ESP32 | $5-10 |
| Powered USB hub | only if you need more than 4 USB devices | $20-35 |
| To get started on the bench: DS18B20 probe + 4.7k resistor, 8-channel relay board + jumper wires | first system | $20-30 |
| Only for setting up: monitor with micro-HDMI cable, USB keyboard and mouse, microSD card reader | once | (borrow) |

Core cost, without sensors and outputs: about **$120-165 for System 1**, plus about $25-30 for each extra Mega on USB and about $50-65 for each Mega that sits behind an ESP32 (Mega, ESP32, its power supply and cable).

**Free software:** Raspberry Pi OS (64-bit), Node.js 22.13 or newer, Arduino IDE (to load the Mega and ESP32 sketches), Tailscale (optional, for away from home).

## Limitations today

- **The Pi's own pins and the ESP32's own pins are not used yet.** All inputs and outputs go through a Mega. That is why one Mega is required.
- **Not tested on real hardware yet.** Everything has been tested with the simulator and a simulated ESP32, not with a real Mega or ESP32, and the sketches have not been compiled yet. Expect some fixing when the first real board is connected.
- **Up to 3 Megas and 2 ESP32s** is what this page covers. The panel itself sets no limit on boards; more Megas need a powered USB hub or more ESP32s.
- **Browsers:** tested in Chrome and Edge. Safari (iPhone, Mac) and Firefox are not fully tested yet.
- **Phone layout:** works, but large Tabs are cramped on a phone screen.
- **No graphs yet** on the Log page (the data can be downloaded as a spreadsheet file).
- **Alarm sounds** play only on screens where **Enable sound** was pressed once (browsers block sound until you click).
- **WiFi is the weakest link.** Use USB or Ethernet for anything that heats or pumps. On every link the board turns all outputs OFF if it hears nothing from the Pi for its lost link delay (10 seconds unless you change it; see [Connection ratings](69-connection-ratings)).
- **One Brain at a time.** Two panels driving the same boards fight each other.
- **Away from home only through Tailscale.** Never open a port on your router for the panel.
- **The microSD card wears out** with all-day logging. A small UPS (battery backup) and, on a Pi 5, an SSD instead of the card help. Always shut the Pi down before unplugging it.
- **Testing mode** (on for now) clears every sign-in when a new version is installed.
- **Hardware safety comes first.** The panel is not a safety system. Keep hard-wired safety devices: an E-stop, float switches, burner flame safety, and GFCI on anything mains powered. Have mains wiring checked by an electrician.

See also [Installing the panel](19-installing) and [Devices](03-devices).
