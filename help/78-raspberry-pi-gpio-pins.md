# Raspberry Pi GPIO pins

A Raspberry Pi's own pins can be an **Interface**, just like an Arduino Mega: relays, SSRs, pumps, valves, switches, DS18B20 probes, RTD and thermocouple boards, flow meters, an ADS1115 and load cells. It can be the Brain itself, or a second Pi out at the brew stand. A small program on the Pi (**Skynet Pi GPIO**) talks to the panel in the same language as the Mega, so Processes and Tabs work the same.

## Install it on the Pi

1. Copy the `firmware/Pi_GPIO` folder to the Pi (it comes with the panel).
2. Open a terminal in that folder and run `sudo bash install.sh`. It installs what it needs, turns on SPI, I2C and 1-Wire, and starts the program. It starts again by itself after every restart.
3. Restart the Pi once (`sudo reboot`) the first time.

## Add it in the panel

**Devices** page > **Add Interface**:

- **Board**: Raspberry Pi (its own GPIO pins)
- **Type**: Ethernet
- **Network address**: `127.0.0.1` when this Pi **is** the Brain, or the other Pi's address (for example `192.168.1.70`)

| Where the Pi is | Connection rating |
|---|---|
| The Brain itself (address 127.0.0.1) | **Best**: nothing goes over the network |
| Another Pi on Ethernet | **Good** |
| Another Pi on WiFi | **OK** (**Poor** with a heating Device on it) |

## Pins

Pins are **GPIO numbers** (also called BCM numbers), **GPIO 2 to GPIO 27**, not the pin positions 1-40 on the header. The pin list shows them as GPIO17 and so on; typing `17` or `GPIO17` is the same.

| GPIO | Kept for |
|---|---|
| 4 | DS18B20 probes (1-Wire). Wire a 4.7k resistor from the data wire to 3.3 V. |
| 7, 8, 9, 10, 11 | SPI, for RTD (MAX31865) and thermocouple boards. Each board's chip-select (CS) goes on any other free GPIO. |
| 2, 3 | I2C, for an ADS1115 analog board |

Any other GPIO can be an output, a PWM output, an input or a flow meter: a Pi has no special PWM or counter pins.

## What a Pi can't do

- **No analog pins.** Use an ADS1115 board for pressure, level, pH and NTC probes, or put them on a Mega.
- **No stepper motors.** A Pi can't time the steps exactly. Put the motor on a Mega or ESP32.

The panel refuses these on a Pi Interface and says why.

## Safety

- **Lost link:** if the panel goes quiet for the Interface's lost link delay (Devices page, 10 s unless you change it), the Pi turns **every output OFF**. It also does this if the panel program stops.
- **At start-up** the Pi sets every output pin it has used before to OFF, before the panel connects.
- **Pi pins are 3.3 V** and can't take 5 V. Most relay boards work, but some 5 V relay boards that switch ON with LOW don't fully turn off at 3.3 V. Pick 3.3 V relay boards, or ones with a JD-VCC jumper. Never wire a 5 V sensor output straight to a Pi pin.

## Settings (only if you need them)

`/opt/skynet-pi-gpio/settings.json` on the Pi. After a change run `sudo systemctl restart skynet-pi-gpio`.

| Setting | What it does |
|---|---|
| `name` | The name shown on the Devices page |
| `relay_active_low` | `true` (like the Mega): ON drives the pin LOW, which suits most relay boards. `false` for boards that switch ON with HIGH. |
| `tc_chip` | `max31856` (any thermocouple type) or `max31855` (type K only) |
| `hx711` | Load cells: each board's DT and SCK pins, e.g. `{"5": 6, "13": 19}`. The scale's Port is the DT pin. |
| `pins` | Empty = GPIO 2-27 may be used; or a list of the only pins allowed, if a HAT uses some |
| `listen` | `0.0.0.0` (default), or `127.0.0.1` so only the panel on this same Pi can connect |

See also [Connection ratings](69-connection-ratings).
