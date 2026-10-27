# Skynet Brewery: hardware shopping list

What to buy to run the Brew Panel, based on what the panel and its board software support today (October 2026).
Prices are rough US prices from typical sellers (Amazon, Adafruit, AliExpress, brewing shops), not a live price check. Clone boards cost less than the brand-name ones and work the same.

**Legend:** ✅ **Required** · ⭐ **Recommended** · ➕ **Optional** (only if your brewery uses it)

> **Important:** the panel cannot yet switch things straight from the Raspberry Pi's own pins. Everything that heats, pumps, opens or measures is wired to an **Arduino Mega** (or ESP32 + Mega), and the Mega plugs into the Pi. So one Mega is required, not optional.

---

## 1. The "brain": Raspberry Pi

| | Item | Typical part | Rough price |
|---|---|---|---|
| ✅ | Raspberry Pi | **Raspberry Pi 5, 4 GB** (8 GB if you want room to spare). A Pi 4 with 4 GB also works. | $60-80 (8 GB: $80-95) |
| ✅ | Power supply | **Official Raspberry Pi 27 W USB-C supply** for a Pi 5 (Pi 4: official 15 W USB-C). Cheap phone chargers cause random crashes. | $12-15 |
| ✅ | Memory card | **32 or 64 GB microSD, "A2" rated** (SanDisk Extreme or Samsung PRO Plus) | $10-15 |
| ✅ | Case with fan | **Official Pi 5 case** (has a fan) or the **Active Cooler** plus any case | $10-15 |
| ✅ | Network | An **Ethernet cable** to your router is best. Built-in WiFi also works. | $5-10 |
| ⭐ | Card reader | USB microSD reader, to put Raspberry Pi OS on the card from your PC (skip if your PC has a slot) | $8-12 |
| ⭐ | Small UPS / battery backup | Keeps the Pi running through a power blip so the brew log and settings are not damaged | $40-80 |
| ➕ | SSD instead of microSD | Pi 5 **M.2 HAT+ with a 256 GB NVMe SSD**. Longer life than a card for all-day logging. | $40-60 |
| ➕ | Screen at the brewery | **Official Raspberry Pi Touch Display 2 (7")**, or just use an old tablet or phone in a browser | $60-70 |
| ➕ | Speaker | Alarm sounds play on whatever device has the panel open (phone, tablet, PC). Only buy one for a screen on the Pi itself: any small USB or 3.5 mm powered speaker. | $10-20 |

**Free software you will use:** Raspberry Pi OS, Node.js 22, Tailscale (to reach the Pi from anywhere), Arduino IDE (to load the Mega).

---

## 2. Controllers (the "PLCs")

| | Item | Typical part | Rough price |
|---|---|---|---|
| ✅ | Arduino Mega | **Arduino Mega 2560** (clone or genuine). One per control panel; add more later for more pins. | $20 clone, $50 genuine |
| ✅ | USB cable | **USB-A to USB-B** "printer" cable, 1-2 m, to plug the Mega into the Pi | $5-8 |
| ⭐ | Screw terminal shield | **Mega screw terminal shield** so wires screw down instead of plugging in. Much more reliable than jumper wires. | $15-25 |
| ➕ | Ethernet for the Mega | **W5500 Ethernet shield** (Arduino Ethernet Shield 2 or a clone). Only if the Mega sits far from the Pi. | $15-25 |
| ➕ | WiFi or Ethernet bridge | **ESP32 DevKit** (WiFi) or **WT32-ETH01** (ESP32 with an Ethernet jack), wired to the Mega. Only for a remote panel. Needs two resistors (1k and 2k) for the voltage divider. | $10-20 |
| ➕ | Smaller boards | Uno or Nano run the same software with fewer pins, for a small add-on panel | $5-25 |

USB or Ethernet is better than WiFi for anything that heats or pumps. On every link the board turns all outputs off if it hears nothing for 10 seconds.

---

## 3. Sensors (pick what your brewery needs)

| | Item | Typical part | Rough price |
|---|---|---|---|
| ⭐ | Temperature, easy | **DS18B20 waterproof probe**, stainless tip. Many probes share one wire. Buy one **4.7k resistor** for the whole set. | $3-10 each |
| ➕ | Temperature, accurate | **PT100 probe** (3-wire, 1/2" NPT thermowell) + one **Adafruit MAX31865** board per probe | $25-40 probe + $15 board |
| ➕ | Temperature, very hot (burners) | **Type K thermocouple** + **MAX31856** board (any type) or **MAX31855** board (type K only), one board per probe | $10 probe + $15-20 board |
| ➕ | Temperature, cheapest | **10k NTC thermistor** + a 10k resistor | $2-5 |
| ➕ | Vessel weight / volume | **HX711 board** + load cells: a set of 4 "bathroom scale" cells with a combinator board, or one **S-type load cell** sized for the full vessel | $10-20 (set of 4) or $30-60 (S-type) |
| ➕ | Flow | **Hall-effect flow meter**. Plastic YF-S201 is fine for cold water; buy a **stainless, food-grade** one for hot wort. Up to 6 per Mega. | $10 plastic, $30-60 stainless |
| ➕ | Level / overflow | **Float switch**, stainless | $5-15 |
| ➕ | Pressure / level | **0.5-4.5 V pressure transducer** (stainless, 1/4" NPT) | $15-30 |
| ➕ | pH | pH probe with amplifier board (0-5 V output) | $30-60 |
| ➕ | Finer analog readings | **ADS1115** 16-bit board, 4 inputs. Helps for pH and pressure. | $5-15 |
| ➕ | Buttons and switches | Panel push buttons, selector switches, an **E-stop** mushroom button | $3-20 each |
| ➕ | 4-20 mA or 0-10 V sensors | Industrial-style sensors work too: a **250 ohm resistor** (4-20 mA) or two **10k resistors** (0-10 V) per sensor | under $1 |

---

## 4. Outputs (what the Mega switches)

| | Item | Typical part | Rough price |
|---|---|---|---|
| ✅ | Relay board | **8-channel 5 V relay board** (opto-isolated). For pumps, valves, contactor coils, lights. | $10-15 |
| ➕ | Heating elements | **SSR, 25-40 A** (Auber, Crydom or Omron; avoid fake "Fotek") on a **heat sink**, one per element | $20-45 each with sink |
| ➕ | Element on/off safety | **2-pole contactor**, 30-40 A, coil switched by a relay | $20-40 |
| ➕ | Valves | **Motorized ball valves**, 12 V, stainless, CR02 or CR05 wiring (BruControl "VGC" outputs are valves). Or 12 V **solenoid valves** for water lines. | $25-45 each |
| ➕ | Pumps | **Riptide** or **Chugger** magnetic-drive brewing pump | $150-220 each |
| ➕ | Pump speed / proportional valve | **PWM to 0-10 V** (or 4-20 mA) converter module, for a VFD or proportional valve | $5-15 |
| ✅ | Power for valves and relays | **12 V (or 24 V) DIN-rail power supply**, 5 A, sized for your valves | $20-35 |
| ⭐ | Panel parts | Enclosure, DIN rail, terminal blocks, fuses, wire, cable glands | $50-150 |

**Safety:** anything on 120 V or 240 V (elements, pumps, contactors) should be on a **GFCI** circuit, with a contactor and E-stop, and checked by an electrician. The low-voltage side (Mega, relays, sensors) is safe to build yourself.

---

## 5. Stepper motors (optional, coming with the stepper motor update)

For things like a motorized valve handle or a grain/hop dropper. One driver board per motor.

| | Item | Typical part | Rough price |
|---|---|---|---|
| ➕ | Small, slow motor | **28BYJ-48 motor with ULN2003 board** (5 V) | $5 for the pair |
| ➕ | Normal motor | **NEMA 17** motor + **TMC2209** (quiet), **A4988** or **DRV8825** driver | $15 motor + $3-10 driver |
| ➕ | Big motor | **NEMA 23** motor + **TB6600** or **DM542** driver, 24-48 V | $30-50 motor + $15-40 driver |
| ➕ | Home switch | Micro limit switch, one per motor | $2 |
| ➕ | Motor power | Separate **12-24 V supply** (never the Mega's 5 V pin, except one 28BYJ-48) | $15-30 |

---

## 6. Voice and sign-in extras (optional, all software-side)

| | Item | Notes | Rough price |
|---|---|---|---|
| ➕ | Alexa / Google / Siri by voice | Comes with the MQTT update. Needs **Home Assistant** (a second Pi or a Home Assistant Green box) and an Echo or Google speaker. Mosquitto runs free on the brewery Pi. | $100-130 for HA Green |
| ➕ | Sign-in codes by text | Free by email (Gmail). Texting through **Twilio** if your carrier blocks email-to-text. | about $1/month + 1¢ per text |

---

## Smallest setup that runs

To get the panel running on the bench with one temperature probe and one relay:

| Item | Rough price |
|---|---|
| Raspberry Pi 5 4 GB + official power supply + 32 GB A2 card + case with fan | $95-125 |
| Arduino Mega 2560 (clone) + USB-A to USB-B cable | $25-30 |
| DS18B20 waterproof probe + 4.7k resistor | $5-10 |
| 8-channel 5 V relay board + jumper wires | $15-20 |
| **Total** | **about $140-185** |

Everything else is added one piece at a time as each part of the brewery comes under control. Until the boards arrive, the panel's built-in **simulator** lets you build Tabs and Processes with no hardware at all.
