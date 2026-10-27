# Skynet Brewery: Device Library

A reference list of every Device the panel can make today, with its settings. Paste any section into a chat when you need to talk about that Device.

- **Read from:** the panel code on the default branch, version PR107_Skynet-v.20261026_23_23 (2026-10-27). PR #108 (connection ratings) was still open; its rules are in section 2 and marked "PR #108".
- **Rule:** whenever a new unique Device is added to Skynet, this document gets a new entry.
- **What counts as a Device:** a Device sits on a port (pin) of an Interface (a PLC board). Widgets (pictures, timers, alarms, switches on screen, pipes, IPs, vessels without Devices, vKonstants, vAPIs) are app-only and are not in this library.

---

## 1. Rules every Device follows

### Making a Device (BruControl order)
1. **Interface**: the board it is wired to.
2. **Device Type**: picked from its Type ID list (section 3).
3. **Available Ports / Pins**: only the free pins on that Interface that fit this Device, best fit first.
4. **Label**: the Display Name shown on the Tab (for example "Fly Sparge").
5. **Suggested Name**: filled in for you. An Admin may type another.

Press **Create** and the Device goes on the 🔨 **Build Tab**, and its Properties open. **Save Build** sends it to a Tab.

### Device names
`InterfaceID_Port_DeviceTypeID_Label__TabID`

Example: `MB_25_E_L_Vlv_Fly~Sparge_In__SP` (Interface MB, pin 25, Type ID E_L_Vlv, Label "Fly/Sparge In", Tab SP).

- **Interface ID:** 1 to 4 letters, unique (for example MB). An Admin can change it.
- **Tab ID:** exactly 2 letters, unique (for example SP). Two underscores go before it.
- **Label in the name:** spaces become `_`; the characters `< > : " / \ | ? * . ,` become `~`; emoji and control characters are dropped. The Label itself stays as you typed it.
- **Port in the name:** analog pins use BruControl numbers (A0 = 54 ... A15 = 69, so A5 = 59). A OneWire probe uses its virtual port (700+). An ADS1115 channel is ADS0 to ADS3.
- **Unique:** a name already in use gets `_2`, `_3` ... after the Label. No spaces in Device names.
- Existing Devices are never renamed by themselves (that would break Processes).

### Ports
- **One Device per port** on an Interface.
- **Exception:** outputs of *different* Device Types may share a port (for example `MB_05_Hys_HLT__BR` and `MB_05_PID_HLT__BR` on one heater). The one turned on or enabled last wins; the others on that port are turned off. Output types that can share: Direct On/Off, PWM, Analog output, Duty Cycle, Hysteresis, PID.
- **Virtual ports** (no real pin):
  - **OneWire probes (DS18B20): 700 to 799.** Probe number 1 = port 700, probe 2 = 701 ... One Device per probe number.
  - **Hydrometers (Tilt or any other): 200, 201 ...** Reserved; Hydro Devices are not built yet.

### Arduino Mega pin rules
| Pins | Kept for | Notes |
|---|---|---|
| D0, D1 | USB link | Never used for Devices |
| D2-D13, D44-D46 | PWM | Shown as "PWM" in the pin list |
| D2, D3, D18-D21 | Counter (interrupt) | Shown as "Counter"; D2 and D3 are "PWM + Counter" |
| D50, D51, D52 | SPI bus | Shared by every RTD and thermocouple board. Blocked for anything else once one of those boards is in use |
| D14-D17, D22-D39, D41-D43, D47-D49, D53 | RTD chip-select (CS) pins | The ONLY pins an RTD (PT100 / PT1000, MAX31865) may use for its CS pin on a Mega (Skynet Rule 6.9). Any other pin is refused |
| D10 | Ethernet shield | On a Mega on Ethernet, no Device may use D10, and a Mega can't change from USB to Ethernet while a Device is on D10 (Skynet Rule 6.10) |
| D4 | Ethernet shield SD card pin | Allowed, with the warning "SD Card Not Supported. Never insert an SD Card!". An inserted card is reported by the Ethernet sketch and the panel says to remove it (Skynet Rule 6.11) |
| D40 | OneWire data pin | Shared by every DS18B20 probe. Blocked for anything else once a probe is in use (can be changed per Interface) |
| A0-A15 (= 54-69) | Analog inputs | Either name works |

- A Device that does not need a PWM or Counter pin gets a heads-up when you put it on one, naming a free plain pin that fits better. You may still use it.
- The pin list always offers plain pins first to a relay, PWM pins to a PWM output, Counter pins to a flow meter, A0-A15 to analog sensors.

### Settings every Device has (Properties)
Name, Display name, Tab, X, Y, Width, Height, Lock position, Background picture (1, 2, 3 or none), imagePath_1/2/3, Visible, Hidden (locked), Hide name, Hide value, Look (normal, led, lcd, dark, button, indicator), Digits shown, Value font size, When tapped (default, none, toggle, push button, dialog, process, tab), Tap target, Ask before changing, and the text box settings (Fore/Back color, Alignment, Word wrap, Name font and size, Name/Value colors and backgrounds, Name/Value alignment, Border).

Devices with on/off states also have **Picture when on / off**, an **On overlay** picture, and **Text when on / off**. New ones start with a green LED for on and a red LED for off (pumps and valves bring their own pictures).

### Cloned Devices (one Device on more than one Tab)
A **Clone** shows a Device on another Tab too (Skynet Rule 4.4, Help 71). It is the same Device, not a new one: it has no
Interface, port or settings of its own, so it never counts against "one Device per port".
- **Name:** made by Skynet, never typed: the parent's name without its Tab ID, `_C1` (`_C2` ...), then the Clone's Tab ID.
  `MB_06_Pump_Wort__HS` on the Tab CE -> `MB_06_Pump_Wort_C1__CE`. It follows a parent rename.
- **Its own settings:** Visible, X, Y, Lock position (and the Tab it is on). A Process: `.visible`, `.hidden`, `.x` / `.xPosition`, `.y` / `.yPosition`.
- **Everything else is the parent's** (pictures, look, size, value, on/off). `Clone = true` turns the parent and every Clone on.
- A pump or valve Clone has its own IPs on its Tab, for pipes there.
- Saved in the Schema as `{ kind: "clone", name, of: <parent name>, workspace, x, y, visibility }` in the graphics list.

---

## 2. Interfaces (the boards)

| Interface kind | How it connects | Settings |
|---|---|---|
| USB | USB cable, 115200 baud | Name, Interface ID, USB port (Scan finds them) |
| Ethernet | Wired network, TCP port 4100 | Name, Interface ID, IP address |
| ESP32 (WiFi) | WiFi, TCP port 4100 | Name, Interface ID, IP address |
| Simulator | None (for testing) | Name, Interface ID; can switch to the real board later |

- Boards supported: **Arduino Mega 2560** (USB, or Ethernet with a W5500/W5100 shield), **ESP32** as a bridge to a Mega (WiFi, or Ethernet on ESP32 boards with a jack). Uno and Nano can run the same sketch with fewer pins.
- **Raspberry Pi GPIO pins as Devices: not built yet.** The Pi is the Brain that runs the panel.
- **Safety:** every board turns all its outputs OFF when it hears nothing from the panel for 10 seconds.
- Optional boards are switched on in the Mega sketch: MAX31865 (RTD), MAX31856 or MAX31855 (thermocouple), ADS1115 (analog), HX711 (scales), steppers.
- Firmware has been syntax checked but has not yet run on real hardware.

**Connection ratings (PR #108, open):**

| Board | USB | Ethernet | WiFi |
|---|---|---|---|
| Arduino Mega / other Arduino | Best | OK (depends on the network) | Poor (through an ESP32 bridge) |
| ESP32 | Best | Good | Good, as long as nothing heats on it |

With PR #108: heating Devices (element, H_PWM, H_AO, gas valve, igniter, heat pad, PID, Hysteresis, Duty Cycle) on Ethernet or WiFi are allowed but warned about; each Interface gets a Board dropdown and a "Lost link: all OFF after" time (3 to 600 seconds, default 10).

---

## 3. Device Type IDs (quick list)

| Group | Type IDs |
|---|---|
| Temperature | 1W, RTD, TC, 10KNTC, 5KNTC, 50KNTC, 100KNT, NTC, LM35, TMP36 |
| Direct On / Off output | DO, Pump, M_L_Vlv, E_L_Vlv, M_H_Vlv, E_H_Vlv, G_Vlv, Mtr, LED, Light, E_Alm, Fan, Chill, HtPad, Ignit |
| PWM output | PWM, H_PWM, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr, P_LED |
| Analog output | AO, H_AO, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr |
| Digital input | DI, Float, DIN, PB, Toggle, Latch, FlowSw, Intlk, EStop, Leak, Count |
| Analog input | AI, Pres, Level, Vol, PH_Met |
| Flow meter | FlowM |
| Scale | Scale |
| Stepper motor | Step |
| Heating control | PID, DutyCy, Hys |
| Reserved (not built) | DHT11, DHT22, Hydro |

What each ID means:

| ID | Meaning | ID | Meaning |
|---|---|---|---|
| 1W | DS18B20 OneWire probe | DO | Direct On/Off (relay, SSR, contactor; also an element on one) |
| RTD | PT100 / PT1000 on a MAX31865 board | Pump | Pump |
| TC | Thermocouple on a MAX31855 / MAX31856 board | M_L_Vlv | Low Temperature Manual Valve |
| 10KNTC | 10K NTC thermistor (BCS-462 / BruControl type) | E_L_Vlv | Low Temperature Electric Valve |
| 5KNTC | 5K NTC thermistor | M_H_Vlv | High Temperature Manual Valve |
| 50KNTC | 50K NTC thermistor | E_H_Vlv | High Temperature Electric Valve |
| 100KNT | 100K NTC thermistor (3D printer type) | G_Vlv | Solenoid Gas Valve |
| NTC | NTC thermistor, other size | Mtr | Motor |
| LM35 | LM35 analog temperature sensor | LED | LED |
| TMP36 | TMP36 analog temperature sensor | Light | Light |
| PID | PID | E_Alm | Electric Alarm |
| DutyCy | Duty Cycle | Fan | Fan |
| Hys | Hysteresis | Chill | Chiller / glycol / fridge compressor |
| H_PWM | Heating element on a PWM output | HtPad | Fermenter heat wrap or pad |
| H_AO | Heating element on a 0-10 V power controller (SCR / SSVR) | Ignit | Burner igniter |
| PWM | PWM (plain) | DI | Direct Input (plain) |
| P_L_Vlv | Low Temperature Proportional Valve | Float | Float (true while made) |
| P_H_Vlv | High Temperature Proportional Valve | DIN | DIN momentary push button (one trigger per press, 3 s lockout) |
| P_Pump | Pump speed | PB | Push button (ON only while held) |
| P_Fan | Fan speed | Toggle | Toggle button (press ON, press again OFF) |
| P_Mtr | Motor speed | Latch | Latching input (ON until reset) |
| P_LED | LED / light dimmer | FlowSw | Flow switch |
| AO | Analog output 0-10 V / 4-20 mA (plain) | Intlk | Door / lid / safety interlock |
| AI | Analog input (plain) | EStop | Emergency stop |
| Pres | Pressure | Leak | Leak sensor |
| Level | Level | Count | Pulse counter |
| Vol | Volume | FlowM | Flow meter |
| PH_Met | pH meter | Scale | Scale (load cells) |
| Step | Stepper motor | Hydro | Hydrometer, Tilt or other (reserved) |
| DHT11 / DHT22 | Temperature / humidity (reserved, needs firmware) | | |

---

## 4. The Devices

### 4.1 Direct On / Off output (Relay, SSR, contactor)
- **Add menu:** Devices: outputs > Relay module / SSR / contactor (on-off). Also Pump and Valve (below).
- **Type IDs:** DO, Pump, M_L_Vlv, E_L_Vlv, M_H_Vlv, E_H_Vlv, G_Vlv, Mtr, LED, Light, E_Alm, Fan, Chill, HtPad, Ignit.
- **Port:** any digital pin (plain pins offered first). Can share a port with a different output type.
- **Settings:**
  - Kind: plain, pump, valve, element (electric heating element). Pumps and valves have IPs for pipes.
  - Interface, Pin (for example 22, or A5 = 59)
  - Invert (pin LOW = on): on / off
  - One-shot time in ms (0 = off); One-shot pulses OFF (off = pulses ON)
  - Pictures and texts when on / off
- **Board sends:** `DO <pin> <0|1>`.

### 4.2 Pump
- **Add menu:** Devices: outputs > Pump (relay output with inlet and outlet IPs for pipes).
- **Type ID:** Pump (or P_Pump on a PWM / analog output for speed).
- Same settings as 4.1 with Kind = pump. Turning it on makes flow run from its inlet IP to its outlet IP. Pumps have no orientation setting.

### 4.3 Valve
- **Add menu:** Devices: outputs > Valve (relay output with an IP at each end). A Valve Profile can be picked when it is made.
- **Type IDs:** E_L_Vlv (default), E_H_Vlv, M_L_Vlv, M_H_Vlv, G_Vlv.
- Same settings as 4.1 with Kind = valve, plus:
  - Valve type: **Electro_Mechanical** (switched by its pin) or **Manual** (turned by hand; a Process shows a pop-up and waits for Done)
  - Orientation: by its shape, Horizontal, Vertical, 45° Left, 45° Right
  - Service (what flows through it; a Gas valve can heat a vessel)
  - Tap water valve (open = tap water flows, no pump needed): on / off; Tap water flows out of: which end
- Valves have no inlet / outlet side. Starts as OPEN / CLOSED, tap = toggle.

### 4.4 PWM output
- **Add menu:** Devices: outputs > PWM output (MOSFET module, pump speed, element %).
- **Type IDs:** PWM, H_PWM, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr, P_LED.
- **Port:** PWM pins only (Mega 2-13, 44-46).
- **Settings:** Interface, PWM pin, Start value (%), Decimals.
- **Value:** 0-100 % on screen; the board gets 0-255. Board line `PWM <pin> <0-255>`.

### 4.5 Analog output (0-10 V / 4-20 mA)
- **Add menu:** Devices: outputs > Analog output 0-10 V, or Analog output 4-20 mA.
- **Type IDs:** AO, H_AO, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr.
- **Port:** a PWM pin feeding a PWM-to-0-10 V or 4-20 mA module.
- **Settings:** Interface, Pin, Signal (0-10V, 4-20mA, 0-5V), Value at lowest signal, Value at highest signal (default 0 to 100), Units (default %), Decimals.
- Board line `AO <pin> <0-1000>` (tenths of a percent of full scale).

### 4.6 Proportional valve (0-100 %)
- **Add menu:** Devices: outputs > Proportional valve 0-100 % (analog output).
- **Type IDs:** P_L_Vlv (default), P_H_Vlv.
- An Analog output (4.5) set to 0-10 V, 0-100 %, with IN and OUT IPs and pictures for open (above 0 %) and closed (0 %).

### 4.7 Duty Cycle (control output)
- **Add menu:** Devices: control outputs > Duty cycle.
- **Type ID:** DutyCy. Counts as heating (PR #108).
- **Settings:** Interface, Pin, Active low, Enabled at start, Duty cycle %, Cycle time (ms).
- Turns its pin on for a % of each cycle by itself.

### 4.8 Hysteresis (control output)
- **Add menu:** Devices: control outputs > Hysteresis.
- **Type ID:** Hys. Counts as heating (PR #108).
- **Settings:** Interface, Pin, Active low, Enabled at start, Input (a sensor Device), Target, ON offset (positive = heat: on below target minus offset; negative = cool), ON delay (seconds).

### 4.9 PID (control output)
- **Add menu:** Devices: control outputs > PID (holds a target temperature).
- **Type ID:** PID. Counts as heating (PR #108).
- **Port:** any pin; with PWM output on it needs a PWM pin.
- **Settings:** Interface, Pin, Active low, Enabled at start, Input (a sensor Device), Target, Kp, Ki, Kd, Max output %, Max integral %, Calculation time (s), Output window (s), Reversed (cooling), PWM output (off = time-proportioned on/off).

### 4.10 Digital input
- **Add menu entries** (Devices: digital inputs), each a preset of the same Device:

| Add menu entry | Type ID | Input type | Starts with |
|---|---|---|---|
| Switch (on while closed) | DI | Switch | |
| Push button (ON only while held) | PB | Switch | |
| Toggle button (press ON, press again OFF) | Toggle | Toggle | |
| DIN / Pulse button | DIN | Pulse | 100 ms pulse, 3 s lockout |
| Latching input (leak, E-stop, alarm) | DI (or Latch, Leak, EStop) | Latch | TRIPPED / OK |
| Pulse counter | Count | Counter | |
| Float / level switch | Float | Switch | FULL / LOW, 2 s on and off delay |
| Flow switch | FlowSw | Switch | FLOW / NO FLOW, 3 s off delay |
| Door / lid / safety interlock | Intlk | Switch | CLOSED / OPEN |

- **Port:** any digital pin (Count prefers Counter pins).
- **Settings:**
  - Inline in a pipe (gets IN and OUT IPs, for example a flow switch): on / off
  - Interface, Pin
  - Input type: Switch / push button (ON while closed or held), Toggle, Pulse (one short ON per press), Latch (ON until reset), Counter (counts presses)
  - Pulse ON time (ms, default 100); Pulse lockout before the next press counts (ms, default 3000)
  - Invert / active low (normally-closed contact)
  - Use the board's pull-up (switch wired to GND): on by default
  - Debounce on the board (ms, default 20)
  - On delay and Off delay (seconds the input must stay on / off)
  - Counter units (presses, gal ...)
  - Pictures and texts when on / off
- **Board sends:** `DI <pin> <0|1>`.

### 4.11 Temperature probes
- **Add menu:** Devices: temperature probes. One Device, the Probe type picks the rest:

| Add menu entry | Probe type | Type ID | Port |
|---|---|---|---|
| DS18B20 (OneWire, waterproof probe) | ds18b20 | 1W | OneWire probe number = virtual port 700-799 |
| PT100 RTD (MAX31865 board) | pt100 | RTD | Chip-select (CS) pin, Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53 (Rule 6.9); shares SPI 50-52 |
| PT1000 RTD (MAX31865 board) | pt1000 | RTD | CS pin, Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53 (Rule 6.9); shares SPI 50-52 |
| Thermocouple type K (MAX31855 board) | thermocouple | TC | CS pin; shares SPI 50-52 |
| Thermocouple K / J / T and others (MAX31856 board) | thermocouple | TC | CS pin; shares SPI 50-52 |
| NTC 10K, Beta 3950 | ntc | 10KNTC | Analog pin |
| NTC 10K, BCS-462 / BruControl type, Beta 3977 | ntc | 10KNTC | Analog pin |
| NTC 50K, Beta 3950 | ntc | 50KNTC | Analog pin |
| NTC 100K, Beta 3950, 3D printer type | ntc | 100KNT | Analog pin |
| LM35 (10 mV per °C) | lm35 | LM35 | Analog pin |
| TMP36 (10 mV per °C, 0.5 V at 0 °C) | tmp36 | TMP36 | Analog pin |

- **Settings for every probe:** Calibration offset (added to the reading), Units (°F or °C, new ones start °F), Decimals (starts 1), Simulator settings, Reading now.
- **Extra settings by probe type:**
  - **DS18B20:** OneWire probe number (from Devices page > OneWire probe index), Interface (empty = any). The index holds each probe's ROM id; replacing a probe = give the new one the same number.
  - **PT100 / PT1000:** Interface, CS pin (on a Mega only D14-D17, D22-D39, D41-D43, D47-D49 or D53, Rule 6.9; the pin list shows only those), Probe wires (2, 3, 4; new ones 3), Board reference resistor (default 430 for PT100, 4300 for PT1000).
  - **Thermocouple:** Interface, CS pin, Thermocouple type (K, J, T, N, E, R, S, B; MAX31855 boards are K only).
  - **NTC:** Interface, Analog pin, Thermistor ohm at 25 °C, Beta value, Series resistor (ohm), Wiring (toGround, toVcc).
  - **LM35 / TMP36:** Interface, Analog pin, Board voltage (5 for a Mega, 3.3 for an ESP32; default 5).
- A reading that makes no sense shows FAULT (check the probe and its wiring).

### 4.12 Thermowell (Skynet Device)
- **Add menu:** Devices: Skynet > Thermowell, Short / Medium / Long (TC 1.5).
- A Temperature probe (4.11) drawn as a TC 1.5 thermowell. After picking the length, a pop-up (step 2a) asks which Temperature Probe type is in it; then the normal New Device box.
- **Pictures:** Skynet_TC15_Thermowell_Short.svg (90 wide), _Medium.svg (138), _Long.svg (192), in Images/Skynet/Other_Equipment.
- **Settings:** the same as its probe type, plus its length.

### 4.13 Analog input
- **Add menu entries** (Devices: analog sensors):

| Add menu entry | Type ID | Signal | Starts with |
|---|---|---|---|
| Analog input 0-5 V | AI | 0-5V | 0-100 |
| Analog input 0-10 V (with voltage divider) | AI | 0-10V | 0-100 |
| Analog input 4-20 mA | AI | 4-20mA | 0-100 |
| Analog input on an ADS1115 board (16-bit) | AI | 0-5V | 0-100, read by ADS1115 |
| Analog input, raw reading | AI | raw | scale / offset |
| Pressure transducer 0.5-4.5 V | Pres | 0.5-4.5V | 0-30 psi |
| Level transmitter 4-20 mA | Level | 4-20mA | 0-30 gal |
| pH probe board (two-point calibration) | PH_Met | twoPoint | raw 410 = pH 7, raw 560 = pH 4 |

- **Port:** analog pin A0-A15 (54-69), or ADS1115 channel 0-3 (port ADS0-ADS3). Vol is also a Type ID here.
- **Settings:**
  - Inline in a pipe (gets IN and OUT IPs): on / off
  - Interface; Read by: board or ads1115; Pin or ADS1115 channel
  - Sensor signal: raw, 0-5V, 0.5-4.5V, 1-5V, 0-10V, 4-20mA, 0-20mA, twoPoint
  - raw: Scale (times the 0-1023 reading), Offset
  - twoPoint: Point 1 raw and real value, Point 2 raw and real value, Extra offset
  - the others: Value at lowest signal, Value at highest signal, Calibration offset
  - 0-10V: Input divider (10 V to 5 V = 2). mA: Resistor across the input (ohm, usually 250)
  - BruControl calibrations (list, used instead of the above), Smoothing weight % (100 = none), Prefix, Units, Decimals, Simulator settings, Raw reading now
- Out-of-range signals (for example a broken 4-20 mA wire) show a fault.

### 4.14 Flow meter
- **Add menu:** Devices: analog sensors > Flow meter (hall sensor, e.g. YF-S201).
- **Type ID:** FlowM.
- **Port:** Counter pins only (Mega 2, 3, 18, 19, 20, 21).
- **Settings:** Interface, Pulse pin, Pulses per unit (from the data sheet; starts 1703 per gal), Units, Decimals (starts 2), Simulator settings.
- Gives a running total and a rate per minute. Board sends `P <pin> <count>`.

### 4.15 Vessel scale (load cells on HX711)
- **Add menu:** Devices: weight > Vessel scale.
- **Type ID:** Scale.
- **Port:** HX711 DT pin(s); several boards on one vessel are typed with commas (for example 26, 28). The first one goes in the name.
- **Settings:** Interface, DT pin(s), Calibration counts per lb / kg (tap the scale > Calibrate), Weight units (lb, kg), Volume units (gal, L), Liquid specific gravity (water 1.000) or take it from another item, Weight offset, Auto tare (zero itself when empty and steady; on by default), Counts as empty below (default 0.05 gal or 0.2 L), Steady for (seconds, default 10), Decimals, Simulator settings, Raw reading now.
- Volume = weight / (water density x specific gravity).

### 4.16 Stepper motor
- **Add menu:** Devices: motors > Stepper on a STEP / DIR driver, or 28BYJ-48 on a ULN2003 board (4 pins).
- **Type ID:** Step.
- **Ports:** STEP / DIR wiring: STEP pin (in the name), DIR pin, ENABLE pin (optional). 4-wire: IN1 (in the name), IN2, IN3, IN4. Plus an optional Home switch pin. All on the same Interface.
- **Settings:**
  - Driver board (picking one fills in its settings): A4988, DRV8825, TMC2208, TMC2209, TB6600, DM542, ULN2003 + 28BYJ-48, L298N, or Add new
  - Wired with: STEP and DIR pins, or 4 coil pins
  - Driver ON when ENABLE is LOW or HIGH; Shortest STEP pulse (µs)
  - Reverse the direction (Yes/No)
  - Motor steps per turn: 200, 400, 2048, 4096, or Add new
  - Microstepping: 1, 2, 4 ... 256
  - Gearbox ratio; Position units (turns, degrees, mm, in, mL, L, gal, %, steps); Units per output turn
  - Top speed, Acceleration; Keep powered when stopped (Yes by default)
  - Lowest / Highest position allowed
  - Home switch: normally open or normally closed; at the low or high end; Homing speed; Position at home; Stop homing after; Home by itself each time the board connects
  - Decimals, Text when off, Simulator settings, Position now
- BruControl has no stepper, so imports never bring one in.

---

## 5. Skynet_Integrated_Devices

One item with Devices built into it. What is built in can never be taken out (un-bundled), and the built-in Devices can't be deleted by themselves; deleting the item deletes them. Integrated Devices have no Bundled switch.

Both are made the same way:
1. **Interface**
2. **Device Type** (RIMS tube or electric kettle): pick the heating element **Control** (PID, Hysteresis, Duty Cycle or PWM) and the **Temperature probe type** in its thermowell (any probe from 4.11)
3. **Available Ports / Pins:** one for the heating element, one for the probe (a DS18B20 takes its OneWire number instead). The two can't share a pin.

Then the Label; Create puts it on the Build Tab with its two Devices beside it.

- **Built-in Devices made:** a heating element (PID, Hysteresis, Duty Cycle, or PWM with Kind = element) named `<Label> Heat`, and a Temperature probe named `<Label> Temp`. Example names: `MB_9_PID_RIMS_Heat`, `MB_700_1W_RIMS_Temp`.
- A PID or Hysteresis element always holds the temperature its own probe reads (its Input is set for you).
- **Properties:** Interface; Heating element: Control, Port and all that control's own settings (for a PID: Target, Kp, Ki, Kd, Max output ...); Heating element's thermowell: probe type and Port. Save and both Devices follow.
- Put on a Tab from a Template (☰ Menu), it has no Devices yet; set the Interface and Ports in its Properties.

### 5.1 RIMS tube
- **Add menu:** Devices: Skynet > RIMS tube. Template: RIMS_Tube (Equipment Templates).
- **Picture:** one, no choice: Skynet_TC1_2_Rims_Device.svg.
- **Openings:** Wort In (top left, IP built in), Wort Out (bottom, IP built in), thermowell and probe in the left end, heating element in the right end. The thermowell is part of the element.
- Named from its Label: RIMS, RIMS_2 ...
- Not bundled (Fritz, 2026-10-26).

### 5.2 Basic electric kettle
- **Add menu:** Devices: Skynet > Electric kettle, basic. Template: Integrated_Electric_Kettle_Basic (Vessel Templates).
- **Picture:** Skynet_BasicElectricBrewKettle.svg.
- **Holes:** Thermowell (upper, front center, probe built in), Outlet (lower, front bottom center, a plain IP), Heating element (right side, glows while on).
- Label starts as Kettle. The base of every future Skynet Integrated Electric Kettle (later ones add fittings and a valve as built-in parts). The kettle itself can still be bundled with other things.

---

## 6. Reserved, not built yet
- **DHT11 / DHT22** (temperature and humidity): Type IDs kept; needs firmware first.
- **Hydro** (Tilt or any other hydrometer): Type ID kept; virtual ports 200, 201 ...; a Tilt is Bluetooth.
- **Raspberry Pi GPIO pins** as Devices.

---

## Change log
- 2026-10-27: First version, from panel version PR107_Skynet-v.20261026_23_23 (plus open PR #108).
- 2026-10-27: RTD (PT100 / PT1000) CS pins on a Mega limited to D14-D17, D22-D39, D41-D43, D47-D49, D53 (Skynet Rule 6.9).
- 2026-10-27: D10 kept for the Ethernet shield on an Ethernet Mega; no USB to Ethernet change while D10 is used (Skynet Rule 6.10).
- 2026-10-27: D4 warning and SD card check (Skynet Rule 6.11).
- 2026-10-27: Added Cloned Devices (Skynet Rule 4.4).
