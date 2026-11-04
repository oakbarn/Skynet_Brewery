# Moving from BruControl: how the boards connect (Windows Brain)

Fritz, 2026-11-03: *"If there is anything relating to how the Brain on a Windows computer connects to Arduinos with
BruControl, there needs to be an equivalent method in Skynet so the transition is seamless where no additional hardware
is needed. This is only for Windows because BruControl is only on Windows."* This is now **Skynet Rule 6.16**.

This page compares how BruControl talks to its boards with how Skynet does it today, and lists what is still missing.

---

## The short answer

- **No new hardware is needed today for a plain USB Mega**, and nothing has to be rewired *if* the pins fit Skynet's
  sketch. The same board, the same USB cable and the same COM port work.
- **But every board must get Skynet firmware once.** BruControl boards run BruControl's own firmware, which speaks a
  private language that BruControl does not publish. Skynet cannot talk to it. Loading Skynet firmware is free, takes a
  minute over the same USB cable, and can be undone by loading BruControl's firmware again.
- **The big gaps** are: Skynet's Mega firmware has its pins written into the sketch (BruControl lets you pick any pin from
  the app), there is no Skynet firmware yet for the **Grand Central M4**, a **stand-alone ESP32**, the **ESP8266** or the
  **Feather M0**, and there is no "load the firmware for me" tool like BruControl's **InterfaceSetup**.

---

## How BruControl connects (from brucontrol.com)

| What | BruControl |
|---|---|
| Brain | A Windows PC only. |
| Boards ("Interfaces") | Arduino Mega 2560, Adafruit Grand Central M4, ESP32 Dev Module (and M5Stack), ESP8266 / ESP8285 modules, Adafruit Feather M0. Older versions also: Arduino Due, Uno, 101, NodeMCU / Wemos D1, Sonoff TH. BruControl's own **UniShield** (a Mega, Due or Grand Central on a driver board, with Ethernet or WiFi shield options) and **UniFlex**. |
| Links | **USB** (a Windows COM port, 115200 baud) or the **network** (Ethernet shield or WiFi), by IP address and a TCP port. |
| Firmware | BruControl's own, closed firmware (versions 45 and 46). Loaded with the **InterfaceSetup** program from the Windows Start menu, over USB. No Arduino IDE needed. |
| Pins | The board's firmware is the same for everyone. **Which pin does what is picked in the BruControl app**, not in the firmware. Pin numbers follow BruControl's "wiring map" (Mega analog pins A0-A15 = 54-69). |
| OneWire | A DS18B20 bus on the pin you pick (the UniShield has pull-ups on pins 5 and 6). |
| Add an Interface | Settings > Interfaces > Add: pick the board type, then the COM port, or the IP address. |

## What Fritz's own BruControl setup uses

From his BruControl file (`26-26-46 VGC UNI and MB Relay.brucfg`):

| Interface | Board | Link | Pins used |
|---|---|---|---|
| Brewery (2560) | Arduino Mega, wiring map FW_v46 | USB, COM3 | 15 digital outputs (pins 14-36), 7 digital inputs (40-47), 14 analog inputs (A0-A15 as 54-69, thermistors with Steinhart-Hart), 4 PWM, PID / hysteresis / duty cycle |
| Valve Grand Central | Adafruit Grand Central M4, FW_v46 | USB, COM6 | 44 digital outputs (valves) on pins 2-49 |
| Interface 1 (turned off) | Arduino Mega | USB, COM8 | 2 OneWire probes |

All three are on USB. No Ethernet or WiFi Interfaces are in use.

## How Skynet connects today

| What | Skynet now |
|---|---|
| Brain | Raspberry Pi or a Windows, Linux or Mac computer (Rule 1.7). |
| Boards | Arduino Mega (USB, or Ethernet shield), ESP32 **as a bridge to a Mega** (WiFi or Ethernet), the Raspberry Pi's own pins. |
| Links | USB (any COM port Windows shows; the Devices page lists them), or TCP port 4100 on the network. Lost link watchdog on every board (Rule 6.3). |
| Firmware | Skynet's own (docs/DEVICE_PROTOCOL.md), open and free. The Mega sketch is loaded with the Arduino IDE by hand. |
| Pins | **Written into the Mega sketch** (lists of output, input, analog and PWM pins, OneWire on pin 40). Changing a pin means editing the sketch and loading it again. The Raspberry Pi program already sets its pins from the Brain. |
| Importing | A BruControl file comes in with its Interfaces, COM ports, pins (same numbers) and thermistor calibrations. |

---

## The gaps, in order of importance

| # | Gap | Why it matters | What would close it | Needs new firmware? |
|---|---|---|---|---|
| 1 | **Pins are fixed in the Mega sketch.** BruControl picks pins in the app. | Fritz's Mega uses outputs on 14-36 and inputs on 40-47; Skynet's sketch has other lists, and pin 40 is its OneWire pin. He would have to edit the sketch (or rewire). | One Skynet firmware where the **Brain tells the board which pin does what** after it connects, as the Raspberry Pi program already does. Any wiring that worked with BruControl works as is. | Yes |
| 2 | **No Grand Central M4 firmware.** | Fritz's 44 valves are on a Grand Central. | Grand Central M4 board profile and firmware (same shared firmware as gap 1). | Yes |
| 3 | **ESP32 only as a bridge to a Mega.** BruControl uses an ESP32 as a board on its own (its own pins, WiFi). | Anyone with an ESP32 Interface would need a Mega behind it. | ESP32 stand-alone firmware (same shared firmware). | Yes |
| 4 | **No ESP8266 or Feather M0 firmware.** | BruControl users with these would need new boards. | Board profiles and firmware for them (same shared firmware). Arduino Due too, for older UniShields. | Yes |
| 5 | **No InterfaceSetup equivalent.** | Loading Skynet firmware today means installing the Arduino IDE, libraries and editing a sketch. | The planned **Load firmware** page (Rule 6.12 step 2): pick the board and COM port, the Brain loads the firmware over USB, Admin only. On Windows it uses the board's own uploader, no Arduino IDE. | No (Brain side) |
| 6 | **WiFi name and password are typed into the sketch.** BruControl sets them over USB with InterfaceSetup. | Same as gap 5. | The Load firmware page asks for WiFi name / password or a fixed IP and sends them over USB. | Yes (small) |
| 7 | **One OneWire bus on a fixed pin (40).** BruControl allows a bus on any pin, and more than one. | UniShield owners have probes on pin 5 or 6. | OneWire on any pin the Brain names, several buses (part of gap 1). | Yes |
| 8 | **Imported network Interfaces keep BruControl's TCP port** (5000 in Fritz's file). | A network board with Skynet firmware listens on 4100, so it would not connect. | The importer sets 4100 (an Importing Norm). | No |
| 9 | **UniShield / UniFlex terminal names.** | A UniShield owner reads terminal names (like 2:3D), not pin numbers. | A UniShield board profile that shows the terminal next to the pin. | No |
| 10 | **Where Duty Cycle, Hysteresis and PID run.** BruControl runs them on the board itself ("offloaded to interfaces for speed and communication failure tolerance", BruControl manual p. 5). Skynet runs them on the Brain and switches the pin with `DO` lines. | Same result while the link is up. If the link drops, BruControl's board keeps controlling; Skynet's board turns everything off after the lost link delay (safer, Rule 6.3). | Fritz's call: keep it on the Brain (as now), or move them into the board firmware. | Only if moved |
| 11 | **No Deadband control Device.** BruControl offers Deadband on D and P ports. | A BruControl Schema with a Deadband port can't be brought over as is. | Add a Deadband control Device (Brain side, like Hysteresis). | No |

Already the same as BruControl, nothing to do:

- USB on any Windows COM port at 115200 baud, picked from a list; the board's reset on connect is handled.
- Pin numbers use BruControl's numbers (A0 = 54 ... A15 = 69, Rule 6.2), so imported Devices keep their pins.
- Thermistor (Steinhart-Hart), PID, hysteresis, duty cycle, PWM, digital in and out all import and run.
- Ethernet with a W5100 / W5500 shield on a Mega (Rules 6.10, 6.11).
- Every Skynet board turns all outputs off if the Brain goes quiet (lost link watchdog, Rule 6.3).

## PWM ports: true PWM or software timed? (Fritz, 2026-11-03)

BruControl has two different kinds of pulsed output, and only one is true PWM:

- **PWM Output** is true hardware PWM: "pulsed at a fixed high frequency ... ~500 Hz, ~1000 Hz, or similar, depending on
  the interface and pin" (BruControl manual p. 40). Those are the Arduino's own timer frequencies (490 Hz and 980 Hz on a
  Mega), and only pins marked **P** on the wiring map can do it (a Mega has 15: 2-13 and 44-46). A Grand Central M4 and an
  ESP32 can do hardware PWM on almost every pin, which is why their lists look much longer.
- **Duty Cycle Output** is slow and timed in software: on and off once per Cycle Time (default 1000 ms = once a second),
  on any digital output pin (manual pp. 41-42). A **PID** on a pin without PWM becomes a Duty Cycle output (p. 45).
  These are the "extra" PWM-like ports.

### Pin by pin: BruControl's wiring map (FW 46) against the boards' own hardware

| Code on the wiring map | Mega 2560 pins | Grand Central M4 pins | The board's own hardware | True or made by the firmware? |
|---|---|---|---|---|
| **P** PWM Output | 2-13, 44-46 | 2-9, 11, 13-19, 22-45, 48, 50-53, A1, A2, A12, A15 | Mega: the 15 timer PWM pins are exactly 2-13 and 44-46. Grand Central: Adafruit lists PWM on "A1, A2, A12, A15, D2-D9, D11, D13-D45, D48, D50-D53". | **True hardware PWM.** The lists match pin for pin. The Grand Central simply has many more timer pins than a Mega. |
| **C** Counter Input | 2, 3, 18, 19 | 2, 3, 18, 19 | Mega interrupt pins are 2, 3, 18, 19, 20, 21 (20 and 21 are kept for I2C). | **True hardware** interrupt pins. |
| **A** Analog Input | A0-A15 (54-69) | A0-A15 (A8-A15 = 54-61, A0-A7 = 67-74) | The board's analog pins. | **True hardware.** Note the Grand Central's different numbering. |
| **O** 1-Wire Input | 2-15 | 2-11, 12-15 | No board has 1-Wire hardware; the 1-Wire library times it on any pin. | **Made by the firmware** (as in every Arduino sketch, Skynet's too). One pin per board. |
| **D** Digital In / Out | almost every pin | almost every pin | Every pin. | True hardware. |
| **Duty Cycle, Hysteresis** | any **D** pin | any **D** pin | No hardware for this. | **Made by the firmware:** slow on / off timing. |
| **PID, Deadband** | any **D** or **P** pin | any **D** or **P** pin | On a **P** pin it drives true PWM; on a **D** pin it becomes a Duty Cycle. | Mixed: control math in the firmware, output true PWM or timed on / off. |

So the extra "PWM-like" uses are not fake PWM: every **P** pin is a real hardware PWM pin. What BruControl builds in
software is the **control** that sits on a port (Duty Cycle, Hysteresis, PID, Deadband) and the 1-Wire bus. In Skynet
these are the control Devices that sit on an output port (Rule 6.1: a PID and a Hysteresis may share one heater port).

In Fritz's file the Mega's 4 PWM ports are on pins 5, 7, 8 and 9 (all real PWM pins), and the Duty Cycle, Hysteresis
and PID ports are on 2, 5, 7 and 8.

Skynet already does the same split: true PWM (`PWM` lines) on real PWM pins only, and Duty Cycle, Hysteresis and
PID-without-PWM as slow on / off switching of any output pin, timed by the Brain (gap 10). Skynet has no **Deadband**
control yet; a BruControl Deadband port needs one (gap 11). The Grand Central board profile must use its own PWM and
analog numbering from this table (gap 2).

## What Skynet will not do

- **Talk BruControl's own firmware language.** It is private, not published, and changes between versions (45, 46).
  Copying it would break the moment BruControl changes it and may break BruControl's license. Loading Skynet firmware
  over the same USB cable gives the same result with no new hardware.

## Suggested order (waiting for Fritz's go)

1. Importer: TCP port 4100 for network Interfaces (gap 8). Small, no firmware.
2. **Skynet shared firmware with pins set by the Brain** for the Mega, then Grand Central M4, ESP32 stand-alone,
   ESP8266, Feather M0 and Due (gaps 1-4, 7). This is the same "one shared Skynet firmware" Rule 6.12 already plans,
   changed so no one edits pin lists.
3. **Load firmware** page on the Brain (gaps 5 and 6), Windows first.
4. UniShield board profile (gap 9).

Sources: [BruControl Interface Firmware](https://brucontrol.com/download/firmware/),
[Interface Wiring Maps](https://brucontrol.com/build/interface-wiring-maps/),
[Quick Start](https://brucontrol.com/quick-start/),
[Interface Wiring Maps v1.2 FW46A](https://brucontrol.com/wp-content/uploads/2022/10/BruControl-Interface-Wiring-Maps-v1.2-FW46A.pdf),
[Adafruit Grand Central M4 guide](https://learn.adafruit.com/adafruit-grand-central),
[BruControl Manual v1.0](https://brucontrol.com/wp-content/uploads/2017/03/BruControl-Manual-v1.0-12-8-2017.pdf),
[UM-1 MEGA UniShield product note](https://brucontrol.com/wp-content/uploads/2020/01/BruControl%20Product%20Note%20-%20UM-1%20MEGA%20UniShield.pdf),
and Fritz's BruControl file.
