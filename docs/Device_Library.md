# Skynet Brewery: Device Library

A reference list of every Device the panel can make today, with its settings. Paste any section into a chat when you need to talk about that Device.

- **Read from:** the panel code on the default branch, version PR107_Skynet-v.20261026_23_23 (2026-10-27). PR #108 (connection ratings) was still open; its rules are in section 2 and marked "PR #108".
- **Rule:** whenever a new unique Device is added to Skynet, this document gets a new entry.
- **What counts as a Device:** a Device sits on a port (pin) of an Interface (a PLC board). Widgets (pictures, timers, alarms, switches on screen, pipes, IPs, vessels without Devices, gGlobals) are app-only and are not in this library.

---

## 1. Rules every Device follows

### Making a Device (BruControl order)
1. **Interface**: the board it is wired to.
2. **Device Type**: picked from its Type ID list (section 3).
3. **Available Ports / Pins**: only the free pins on that Interface that fit this Device, best fit first.
4. **Label**: the text shown on the Tab (for example "Fly Sparge"); it was called Display Name. A **Show label** switch hides it.
5. **Suggested Name**: filled in for you. An Admin may type another.

Press **Create** and the Device goes on the 🔨 **Build Tab**, and its Properties open. **Save Build** sends it to a Tab.

### Device names
`InterfaceID_Port_DeviceTypeID_Label_TabID` (one underscore between the parts, Fritz 2026-11-05; names made before keep their `__` before the Tab ID)

Example: `MB_25_eVlv_Fly~Sparge~In_SP` (Interface MB, pin 25, Type ID eVlv, Label "Fly/Sparge In", Tab SP).

- **Interface ID:** 1 to 4 letters, unique (for example MB). An Admin can change it.
- **Tab ID:** exactly 2 letters, unique (for example SP). Two underscores go before it.
- **Label in the name:** spaces become `~` (2026-11-07, so `_` only separates the parts); the characters `< > : " / \ | ? * . ,` become `~`; emoji and control characters are dropped. The Label itself stays as you typed it.
- **Port in the name:** analog pins use BruControl numbers (A0 = 54 ... A15 = 69, so A5 = 59). A OneWire probe uses its virtual port (700+). An ADS1115 channel is ADS0 to ADS3.
- **Unique:** a name already in use gets `_2`, `_3` ... after the Label. No spaces in Device names.
- Existing Devices are never renamed by themselves (that would break Processes).

### Ports
- **One Interface Port, one Device** (Rule 6.1, Fritz 2026-11-07), of any Device Type. A heater's ways of control are one Heating Element's heating methods (Rule 6.19, 4.1 below).
- **Older Schemas** made under the old exception (outputs of different Device Types on one port, for example `MB_05_Hys_HLT_BR` and `MB_05_PID_HLT_BR`) keep working: the one turned on or enabled last wins. No new sharing can be made.
- **Virtual ports** (no real pin):
  - **OneWire probes (DS18B20): 700 to 799.** Probe number 1 = port 700, probe 2 = 701 ... One Device per probe number.
  - **Hydrometers (Tilt or any other): 200, 201 ...** The Hydrometer Device's Port (section 4.17, Rule 6.25).

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
Name, Label (`label`, was Display name), Show label, Tab, X, Y, Width, Height, Lock position, Background picture (1, 2, 3; 0, blank or over 3 = none), .backpath / .backpath_2 / .backpath_3 (Image Path 1-3, all editable), Visible, Hidden (locked), Hide value, Look (normal, led, lcd, dark, button, indicator), Digits shown, Value font size, When tapped (default, none, toggle, push button, dialog, process, tab), Tap target, Ask before changing, and the text box settings (Fore/Back color, Alignment, Word wrap, Name font and size, Name/Value colors and backgrounds, Name/Value alignment, Border).

Every Device also has a **Database and .API** box at the end: **Send to the database** (Off, On demand, On value change, When a Process starts, Once, At a date and time, At clock time, Every N ms / seconds / minutes / hours / days, Every 00:00:00), **What to send** (main value or another attribute) and **.API** (Off, Get only, Get and Put). Readings from the board (probes, inputs) can be read from outside but never changed. (Skynet Rule 6.14, Help 98)

Devices with on/off states also have **Picture when on / off**, an **On overlay** picture, and **Text when on / off**. New ones start with a green LED for on and a red LED for off (pumps and valves bring their own pictures).

### Cloned Devices (one Device on more than one Tab)
A **Clone** shows a Device on another Tab too (Skynet Rule 4.4, Help 71). It is the same Device, not a new one: it has no
Interface, port or settings of its own, so it never counts against "one Device per port".
- **Made only with ⧉ Clone Device** (Edit layout bar), on any Tab, the Build Tab too. The list is grouped by type.
- **Name:** made by Skynet, never typed: `<Parent_Name>_Clone_N`, e.g. `MB_06_Pump_Wort_HS_Clone_1`. It follows a parent rename.
- **Its own settings:** Visible, Tab, X, Y, Lock position. **Not used in Processes.**
- **Everything else is the parent's** (pictures, look, size, value). Tapping it taps the parent: an on/off Device or one with
  Enabled (PID) turns on or off; a reading Device (1W) is only shown, in the parent's format.
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
- **Raspberry Pi GPIO pins** (Board **Raspberry Pi**, program `firmware/Pi_GPIO`, Help 78): Type Ethernet, address `127.0.0.1` when the Pi is the Brain (rating **Best**), or the other Pi's address (Ethernet **Good**, WiFi **OK**). Pins are GPIO 2-27 (`GPIO17` = `17`); GPIO 4 = DS18B20 probes, GPIO 7-11 = SPI (RTD / thermocouple boards, CS on any other free GPIO), GPIO 2-3 = I2C (ADS1115). Any other GPIO can be an output, PWM, input or flow meter. **No analog pins** (use an ADS1115) and **no steppers**: the panel refuses them on a Pi. Pins are 3.3 V.
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

**Calibrations (Rule 6.24, Help 169):** every Temperature Probe, Analog In and Flow meter has a layered Calibrations list in plain boxes (Offset, Multiplier, Divider, Floor, Ceiling, Thermistor Steinhart-Hart, °C / °F / K conversions, Lookup Table).

**Smoothing (Rule 6.24, Help 171):** every Temperature Probe, Analog In, Flow meter (rate), Scale and Counter has **Smoothing %** (BruControl's Avg Weight; 100 = none; empty = 25 % on a thermistor probe, else 100). `.raw` is the reading before smoothing. A Counter also has a **Rate** (counts per second over its Sampling Period, 1-10 s).

**Data Display (Rule 6.26, Help 174):** a Device with more than one value (PID, Deadband, Hysteresis, Duty Cycle, Heating Element by method, Flow meter, Scale, PWM / Analog output with Measured volts) picks which one shows on the Tab; `.display` in a Process; a Flow meter's `.value` follows it.

| Direct On / Off output | DO, HE, Pump, CPMP, M_L_Vlv, eVlv, M_H_Vlv, E_H_Vlv, G_Vlv, Mtr, LED, Light, E_Alm, Fan, Chill, HtPad, Ignit |
| PWM output | PWM, H_PWM, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr, P_LED |
| Analog output | AO, H_AO, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr |
| Digital input | DI, Float, DIN, PB, Toggle, Latch, FlowSw, Intlk, EStop, Leak, Count |
| Analog input | AI, Pres, Level, Vol, PH_Met |
| Flow meter | FlowM |
| Scale | Scale |
| Stepper motor | Step |
| Hydrometer | Hydro |
| Heating control | PID, DutyCy, Hys, DBand |
| Reserved (not built) | DHT11, DHT22 |

What each ID means:

| ID | Meaning | ID | Meaning |
|---|---|---|---|
| 1W | DS18B20 OneWire probe | DO | Direct On/Off (relay, SSR, contactor) |
| RTD | PT100 / PT1000 on a MAX31865 board | Pump | Pump |
| TC | Thermocouple on a MAX31855 / MAX31856 board | M_L_Vlv | Low Temperature Manual Valve |
| 10KNTC | 10K NTC thermistor (BCS-462 / BruControl type) | eVlv | Electric Valve (motorized ball valve, low temperature; was E_L_Vlv) |
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
| Step | Stepper motor | Hydro | Hydrometer (Tilt, Tilt Pro, iSpindel, RAPT Pill or any other) |
| DHT11 / DHT22 | Temperature / humidity (reserved, needs firmware) | | |

---

## 4. The Devices

### 4.1 Direct On / Off output (Relay, SSR, contactor)
- **Add menu:** Devices: outputs > Relay module / SSR / contactor (on-off). Also Pump and Valve (below).
- **Type IDs:** DO, HE (Heating Element, Rule 3.1: `MB_25_HE_HLT_BR`; elements named before keep DO), Pump, CPMP (Cool / Warm Pump, one Pump with a Method, Rule 6.21: `MB_D5_CPMP_Cool~Pump_FR`, Help 164), M_L_Vlv, eVlv, M_H_Vlv, E_H_Vlv, G_Vlv, Mtr, LED, Light, E_Alm, Fan, Chill, HtPad, Ignit.
- **Port:** any free digital pin (plain pins offered first). One Device per port (Rule 6.1).
- **Settings:**
  - Kind: plain, pump, valve, element (electric heating element). Pumps and valves have IPs for pipes.
  - Interface, Pin (for example 22, or A5 = 59)
  - Invert (pin LOW = on): on / off
  - One-shot time in ms (0 = off); One-shot pulses OFF (off = pulses ON)
  - **Dual Throw** (Rule 6.22, Help 167): a second Port on the same Interface, always the opposite (ON = own Port on, second off; OFF = own Port off, second on), and a delay in ms between them; for a valve with Open and Close wires. In the ⬢ Pin attributes.
  - Pictures and texts when on / off
- **Board sends:** `DO <pin> <0|1>`.
- **Heating Element (Kind = element): one Device, the heating method picked** (Rule 6.19, Fritz 2026-11-07, Help 150). Its
  **Heating method** is On/Off, Duty Cycle, Hysteresis, PID, Deadband or Precise (a calm PID that holds to 0.1 degree, Help 156): the one it starts with is in its Properties (with the
  Temperature Probe and each method's settings); a Process (`hE_1.method = "PID"`) or a click while running changes it.
  `.state` / `.enabled` = ON, `.output` = its pin now (read only), `.value` = a PID or Deadband's output %. Same for a Heating
  Element built into a Vessel Device, RIMS tube or Integrated kettle. BruControl's two controls on one port import as one of these.

### 4.2 Pump
- **Add menu:** Devices: outputs > Pump (relay output with inlet and outlet IPs for pipes).
- **Type ID:** Pump (or P_Pump on a PWM / analog output for speed).
- Same settings as 4.1 with Kind = pump. Turning it on makes flow run from its inlet IP to its outlet IP. Pumps have no orientation setting.
- **Skynet pump pictures** (Pumps group, Help 104): March 809 and 815 (poly 90° inlet, poly center inlet, stainless center inlet), Chugger (stainless 90° inlet and center inlet), Blichmann Riptide (stainless, cover off), Topsflo TD5 and KegLand MKII (poly, plus MKII stainless). Drawn from the real pumps with no cover; with one of them the IN and OUT IPs sit on the tips of the real inlet and outlet ports.
- **Pump Standard** (Rule 5.27, Fritz 2026-11-05, Help 130): every Skynet pump picture (these drawings, their Covers and the older Riptide-style color pictures) is drawn to scale in the same 300 x 300 box and shown 150 x 150, with the inlet IP at (285, 150) and the outlet IP at (243, 56) of the box (Orientation Left mirrors them). Port tubes are drawn longer where needed to reach the spots, so one pump can replace another in the same place and stay joined. The sump pump keeps its own box.
- **DC pumps, speed and facts** (Rule 18.32, Fritz 2026-11-08, Help 163): every Pump has **Model** (`pumpModel`, the list in public/pumps.js and docs/DC_Brewing_Pumps.md; a Skynet drawing picks its own; `other`), the **Pump facts** ⬢ (`pumpFlow`, `pumpLift`, `pumpHottest`, `pumpPorts`; empty = the model's), **Power** (`power`: ac120, ac240, dc12, dc24; empty = the model's), **Use** (`pumpUse`: empty = Hot, `cold`), **Speed control** (`pwm`: empty = On/Off only, `pwm` = PWM speed on a true PWM Port) and **Speed %** (`speed`, 0-100, empty = 100; a Process: `Pump.speed = 60`). An AC pump is On/Off only. Holding the mouse on a Pump shows its facts.
- **Cover overlay** (Rule 7.13, Help 111): **.cover** = None (default), Red, Yellow, Blue, Green, Purple, Orange, White or User; **.coverColor** = the User cover's color (any RGB). One cover per color fits every pump (2026-11-05). Drawn between the pump picture and the On overlay, on the Skynet no-cover pump drawings only.
- **Properties dialog: the drill-down** (Rule 18.12, Help 115, Fritz 2026-11-03): Visible, Hidden Locked and the lock at the top;
  **Pump Properties ⬢** (Tab, X, Y, Width, Height, Delete); **Label ⬆ ⬢**, Show label, Name; Interface, **Pin ⬢**, **When tapped ⬢**,
  Kind; **Picture ⬢**, Cover, **Background picture ⬢**; **Text when on ⬆ ⬢**, Text when off ⬆. The standard for every Device.
- **Adding a Pump** (Rule 18.13, Fritz 2026-11-04): Pumps > Pump, on / off, then pick the pump from the list with pictures; the Add box is titled with it and has the Label ⬢, Cover, X, Y and the Device Type (Pump) read only. Once added, Interface and Port are greyed out with ✏ Change.

### 4.3 Valve
- **Add menu:** Devices: outputs > Valve (relay output with an IP at each end). A Valve Profile can be picked when it is made.
- **Type IDs:** eVlv (default), E_H_Vlv, M_L_Vlv, M_H_Vlv, G_Vlv.
- Same settings as 4.1 with Kind = valve, plus:
  - Valve type: **Electro_Mechanical** (switched by its pin) or **Manual** (turned by hand; a Process shows a pop-up and waits for Done)
  - Orientation: by its shape, Horizontal, Vertical, 45° Left, 45° Right
  - Service (what flows through it; a Gas valve can heat a vessel)
  - Tap water valve (open = tap water flows, no pump needed): on / off; Tap water flows out of: which end
  - On the Close all valves list / On the Open all valves list (Rule 6.15): on / on to start. A tap water valve is always on
    Close all and never on Open all (no switches shown); a Manual valve is on neither.
- Valves have no inlet / outlet side. Starts as OPEN / CLOSED, tap = toggle.

### 4.3a Skynet Motorized Ball Valve Device (Skynet Template, Rules 5.16 and 5.17)
- **Add menu:** Valves (and On/Off) on the Edit layout bar, at the top: **Motorized Ball Valve, open / closed (relay)**, then
  **Pick the valve** > **Skynet Motorized Ball Valve** (starts Horizontal). The Add box and Properties are the Pump's drill-down
  without a Cover (Rule 18.23, Help 128): Graphic, Path (greyed out), Orientation, Toggle and Overlay (user settable: an exception
  to Rule 5.18, Fritz 2026-11-05), Database and .API ⬢, Tap water valve, On Close List / On Open List. Its **Orientation** picks Horizontal, Vertical Left, Vertical Right, Front or 45 degrees (Rule 5.17: each is its own
  Template, never shown as Master / Daughter). Templates in templates/device/ (Skynet_Motorized_Ball_Valve_H, _VL, _VR, _Front).
- **Type ID:** eVlv (set by the Template; Fritz 2026-11-05, was E_L_Vlv, names already made keep it, so the Add Device box doesn't ask for it).
- **Fixed by the Template** (not in its Properties; the Brain puts them back on every layout save): Kind = valve, Valve type =
  Electro_Mechanical, Service = Room Temperature Liquid, pictures (Valve_Motor_Ball_*H for Horizontal, *V_LC for Vertical and 45),
  Look normal, Ask before changing, background / .backpath, _2, _3, Digits, Hide value.
- **User settable:** Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible, Hidden, text box settings, Device Type,
  Interface, Pin, Invert, One-shot, Dual Throw (Rule 6.22), **Orientation** (Horizontal, Vertical Left, Vertical Right, Front, 45 degrees), **Flip Horizontal**, **Flip Vertical**,
  **Tap water valve** (off by default) with **Tap water flows out of**: Tap Water Source Top / Bottom (vertical) or Left / Right
  (horizontal, 45) and **Needs setting** after the Orientation or a Flip changes (no tap flow until set), **Text On/Off** (the On /
  Off text shows only when on) with Text when on / off.
- Its IPs sit on the picture's pipe ends and mirror with the Flips. Help 88. At **45 degrees** they turn with the picture and stay on
  the pipe ends (Rule 5.24, 2026-11-04, Help 123; before, they were on the corners of its box).

### 4.3c User Defined Motorized Ball Valve (Fritz, 2026-11-03)
**Since 2026-11-05 (Rule 18.23, Help 128):** picked as **Motorized Ball Valve > Pick the valve > User Defined Motorized Ball Valve**;
its Add box and Properties are the Pump's drill-down without a Cover: **Path (closed)** with ⬢ In and Out IP spots, **Path (open)**,
Orientation (Horizontal, Vertical, 45 degrees Left / Right), Toggle, Overlay with Database and .API ⬢, Tap water valve, Close all /
Open all list. The text below is how it was added before.
The Valves list row under the Skynet valves (was "Motorized valve, open / closed (relay)"): digitalOut, subtype valve, the user's own
picture (Picture when on / off, Image Path 1-3, Rule 7.10). **In IP across % / down %** and **Out IP across % / down %** (ipInX, ipInY,
ipOutX, ipOutY: % of the item's Width and Height) place its two IPs; blank = Skynet places them. The Valves list also ends with
**Manual Valve** (the Manual Valve Widget, no pin, Rule 1.2). Help 88.

### 4.3b Skynet Motorized Butterfly Valve Device (Skynet Template, Rules 5.16, 5.17, 5.20)
Fritz's drawing (2026-11-02, Help 110): a grey actuator on a butterfly valve. A Valve (digitalOut, subtype valve, Electric, Room Temperature Liquid), made from **Valves** on the Edit layout bar like the Motorized Ball Valve.

| Template | Picture | IPs |
|---|---|---|
| Skynet_Motorized_Butterfly_Valve_H (Horizontal, the main Template) | Valve_Motor_Butterfly_Open/ClosedH.svg (140 x 170, pipe at 135) | left and right ferrule faces |
| ..._VL, ..._VR (Vertical Left, Vertical Right: VR has Flip Horizontal) | Valve_Motor_Butterfly_Open/ClosedV_L.svg | top and bottom ferrule faces |
| ..._Front (Front) | Valve_Motor_Butterfly_Open/ClosedFront.svg: looking down the pipe | both at the center of the opening |
| ..._Front_Elbow (Front Elbow) | Valve_Motor_Butterfly_Open/ClosedFront_Elbow.svg | center of the front opening, bottom ferrule face |

One entry in the Valves list; its Orientation picks the row above. The Front views have no Flip to set. The **Skynet Motorized Ball Valve** (4.3a) is redrawn after Fritz's blue actuator (same files, same IP spots) and has a **Front** Orientation too (Valve_Motor_Ball_Open/ClosedFront.svg, both IPs at the center of the opening). Closed = a ring on the body; open = a bar and red bolts.

### 4.4 PWM output
- **Add menu:** Devices: outputs > PWM output (MOSFET module, pump speed, element %).
- **Type IDs:** PWM, H_PWM, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr, P_LED.
- **Port:** PWM pins only (Mega 2-13, 44-46).
- **Settings:** Interface, PWM pin, Start value (%), Decimals, **Measured volts** (Rule 6.24, Help 169: pairs of % and the volts measured; shows ≈ V, `.volts` reads and sets).
- **Value:** 0-100 % on screen; the board gets 0-255. Board line `PWM <pin> <0-255>`.

### 4.5 Analog output (0-10 V / 4-20 mA)
- **Add menu:** Devices: outputs > Analog output 0-10 V, or Analog output 4-20 mA.
- **Type IDs:** AO, H_AO, P_L_Vlv, P_H_Vlv, P_Pump, P_Fan, P_Mtr.
- **Port:** a PWM pin feeding a PWM-to-0-10 V or 4-20 mA module.
- **Settings:** Interface, Pin, Signal (0-10V, 4-20mA, 0-5V), Value at lowest signal, Value at highest signal (default 0 to 100), Units (default %), Decimals, **Measured volts** (Rule 6.24).
- Board line `AO <pin> <0-1000>` (tenths of a percent of full scale).

### 4.6 User Defined Proportional Valve (0-100 %)
- **Add menu:** Valves > User Defined Proportional Valve 0-100 % (analog output), or Devices: outputs (was "Proportional valve
  0-100 % (analog output)", renamed 2026-11-03).
- Its own pictures (open above 0 % / closed at 0 %, Image Path 1-3, Rule 7.10) and **In / Out IP across % and down %** (ipInX,
  ipInY, ipOutX, ipOutY), the same as the User Defined Motorized Ball Valve (4.3c). Help 117.
- **Type IDs:** P_L_Vlv (default), P_H_Vlv.
- An Analog output (4.5) set to 0-10 V, 0-100 %, with IN and OUT IPs and pictures for open (above 0 %) and closed (0 %).

### 4.6a Skynet KLD20T Proportional Valve (Skynet Template, Rules 5.16, 5.17, 5.22)
The first Skynet Proportional Valve (Fritz, 2026-11-03): the **KLD20T** sold by BruControl, a 1/2" NPT SS304 motorized ball
valve, 24 VDC power, 0-5 VDC control signal, 0-100 % open.
- **Add menu:** Valves on the Edit layout bar (not On/Off: it is not an on / off valve). One entry; **Orientation** picks
  Horizontal, Vertical Left, Vertical Right or 45 degrees.
- **Templates:** templates/device/Skynet_KLD20T_Proportional_Valve_H (main), _VL, _VR (Flip Horizontal on).
- **Type:** analogOut, subtype propValve. **Type ID:** P_L_Vlv.
- **Fixed by the Template:** Kind, Service (Room Temperature Liquid), Signal 0-5V, 0 to 100 %, Decimals 0, pictures (the Skynet
  Motorized Ball Valve's: Valve_Motor_Ball_*H, *V_LC, until Fritz sends a KLD20T drawing), look.
- **User settable:** Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible, Hidden, text box settings, Device Type,
  Interface, Pin (a PWM pin feeding a PWM-to-0-5 V module), Orientation, Flip Horizontal, Flip Vertical.
- IPs on the picture's pipe ends (Rule 5.20), following the Orientation and Flips. Help 117.

### 4.7 Duty Cycle (control output)
- **Add menu:** Devices: control outputs > Duty cycle.
- **Type ID:** DutyCy. Counts as heating (PR #108).
- **Settings:** Interface, Pin, Active low, Enabled at start, Duty cycle %, Cycle time (ms).
- Turns its pin on for a % of each cycle by itself.

### 4.8 Hysteresis (control output)
- **Add menu:** Devices: control outputs > Hysteresis.
- **Type ID:** Hys. Counts as heating (PR #108).
- **Settings:** Interface, Pin, Active low, Enabled at start, Input (a sensor Device), Setpoint, ON offset (positive = heat: on below target minus offset; negative = cool), ON delay (seconds). **Predictive** (on by default, Rule 6.23, Help 168): turns off early by the coast it has learned, so it does not overshoot; never more starts.

### 4.9 PID (control output)
- **Add menu:** Devices: control outputs > PID (holds a target temperature).
- **Type ID:** PID. Counts as heating (PR #108).
- **Port:** any pin; with PWM output on it needs a PWM pin.
- **Settings:** Interface, Pin, Active low, Enabled at start, Input (a sensor Device), Setpoint, Kp, Ki, Kd, Max output %, Max integral %, Calculation time (s), Output window (s), Reversed (cooling), PWM output (off = time-proportioned on/off).

### 4.9.1 Deadband (control output)
- **Add menu:** Devices: control outputs > Deadband. As in BruControl's Deadband Output (Skynet Rule 6.17, Help 126).
- **Type ID:** DBand (General Type DBAND, proposed). Counts as heating and is On while Enabled (Rule 7.9); can share a heater's port (Rule 6.1).
- **Port:** any pin; with PWM output on it needs a PWM pin.
- **How it works:** every Calc Time its output % steps toward the Setpoint: left alone within ± Deadband Offset, by the Inner Band Drive within ± Inner Band Offset, by the Outer Band Drive further out. Below the Setpoint it goes up, above it goes down (Reversed for cooling). Starts at the Initial Output when Enabled.
- **Settings:** Interface, Pin, Active low, Enabled at start, Input (a sensor Device), Setpoint, Deadband Offset (0.5), Inner Band Offset (2), Initial Output % (0), Inner Band Drive (1), Outer Band Drive (5), Max output % (100), Calc Time (10 s), Output window (2 s), Reversed (cooling), PWM output (off = time-proportioned on/off).

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
- **IP (Rule 5.30, 2026-11-05):** one, on the outer face of its TC cap; no flow. Rotate and Flip. Dropped with its cap within 30 px of an IP it snaps on. On a front facing IP it shows from the front (Skynet_TC15_Thermowell_Front.svg, 40 x 40, IP in the middle); a plain Temperature probe dropped on a front facing IP becomes one (an implicit Thermowell).

### 4.12a Tee with a Temperature Probe (Skynet Device, Rule 5.20)
Fritz (2026-11-02, Help 110): a Temperature Device (type temperature, `subtype: probeTee`), not a pipe Widget. Made from **Probe** on the Edit layout bar like a Thermowell: pick the probe type, then Interface and Port.

| `probeTee` | Picture | IPs (center of the open ferrule faces) |
|---|---|---|
| Instrument_Branch | Skynet_TC15_Instrument_Tee_Probe_Branch.svg (redrawn 2026-11-04): probe (purple) in the branch | left, right |
| Instrument_Run | Skynet_TC15_Instrument_Tee_Probe_Run.svg (redrawn 2026-11-04): probe in from the left end | right, branch |
| Long_Branch | Skynet_TC15_Long_Tee_Probe_Branch.svg (Fritz's drawing 2026-11-04) | left, right |
| Long_Run | Skynet_TC15_Long_Tee_Probe_Run.svg (redrawn 2026-11-04) | right, branch |

Flow passes through either way (like an inline sensor). Flip Horizontal, Flip Vertical and Rotate (0, 90, 180, 270) turn the picture and its IPs. It reads like any Temperature probe (4.11).
Since Rule 5.30 (2026-11-05): the same size as the TC Pipe Fittings Widget tee of its shape (Instrument 160 x 69, Long 160 x 102) with its IPs on the same spots; dropped on a pipe or hose it cuts it like a tee and takes the pipe's size.

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

### 4.17 Hydrometer (Skynet Rule 6.25, Help 170)
One Device for every kind of hydrometer. Its **Template** picks which settings it uses; the others are shown **greyed out**.
- **Type ID:** Hydro. **Port:** a virtual port, 200, 201 ... on its Interface (the Brain, or the ESP32 that hears it). Name example
  `PI_200_Hydro_Red~Tilt_FE`.
- **Templates:**

| Template | Connection | Told apart by | Gravity decimals | Sends |
|---|---|---|---|---|
| Tilt | Bluetooth | Tilt Color | 0.001 | gravity, temperature, signal |
| Tilt Pro | Bluetooth | Tilt Color | 0.0001 | gravity, temperature (0.1 °F), signal |
| Tilt Pro Mini | Bluetooth | Tilt Color | 0.0001 | as the Tilt Pro |
| iSpindel | Wi-Fi to Skynet | Hardware ID (its Name or ID) | 0.001 | gravity, temperature, battery, signal, tilt angle |
| GravityMon | Wi-Fi or Bluetooth | Hardware ID | 0.0001 | as the iSpindel |
| Floaty | Wi-Fi to Skynet | Hardware ID | 0.001 | as the iSpindel |
| BrewBrain Float | Wi-Fi or its cloud | Hardware ID | 0.001 | as the iSpindel |
| RAPT Pill | Bluetooth or the RAPT cloud | Hardware ID | 0.0001 | as the iSpindel |
| PLAATO | its cloud | Hardware ID | 0.001 | gravity (worked out from the bubbles), temperature |
| Other hydrometer | any | Hardware ID | 0.001 | iSpindel-style readings |

- **Settings (Properties):** Interface, Port, Template, Connection (greyed when its Template has one), **Tilt Color** (mandatory for
  a Tilt, greyed for the rest), **Hardware ID** (mandatory for the rest, greyed for a Tilt; type it or pick one the Brain heard),
  Cloud key (the maker's cloud only), Gravity units (SG, °Plato, °Brix), Gravity decimals, Temperature units, Gravity offset,
  Temperature offset, Smoothing weight % (Tilts start at 20, the rest at 100), Lost signal after (minutes; Tilts 15, the rest 60),
  Original Gravity (SG), Simulator settings, Database and .API (.API is On, Read Only and greyed out for Wi-Fi and cloud ones).
- **No two the same:** one Hydrometer per Tilt Color (any Tilt kind), one per Hardware ID. Never matched by IP address.
- **Attributes:** its gravity is its value (in its Gravity units); `.sg`, `.plato`, `.brix` always; `.temperature`, `.battery`,
  `.rssi`, `.angle`, `.lost` (true after its Lost signal minutes), `.lastseen`, `.og` (a Process may set it) and `.abv`.
- **Wi-Fi:** it sends its readings to `http://<the Brain>:<port>/api/hydrometer` (from the home network; from anywhere else add
  `?key=` and the API key).
- **Bluetooth:** a listener near the fermenter sends what it hears to `/api/hydrometer/bluetooth`: an ESP32 with
  `firmware/ESP32_Hydrometer`, or a Raspberry Pi's own Bluetooth (`firmware/Pi_Bluetooth`). A Tilt is found by its Tilt Color, a RAPT
  Pill by its Hardware ID (its Bluetooth address). The cloud comes later. On a Simulator Interface it shows a pretend fermentation until
  a real reading comes.
- **Read by hand** (a Refractometer or a Glass hydrometer) is not a Device: the Process command `take_reading Name` asks for it.
- **BruControl Import:** a Hydrometer Input becomes a Tilt with the same Tilt Color on the same port.

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
- **Properties:** Interface; Heating element: Control, Port and all that control's own settings (for a PID: Setpoint, Kp, Ki, Kd, Max output ...); Heating element's thermowell: probe type and Port. Save and both Devices follow.
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

### 5.3 Vessel Device (built from a Vessel Widget Template)
- **Made by:** placing a Vessel Widget Template (Skynet_Vessel_Widget, or a kettle Template built from it). It goes on the Build Tab as a Vessel Device (Skynet Rule 5.31, one exception to Rule 5.7; Help 133).
- **Or step by step:** Vessel > 🔨 Build a Vessel Device asks Name, Size, Outlet and its valve, Inlets, Heating Elements, Temperature probe and HERMS Coil one page at a time, then builds it on the Build Tab (Skynet Rule 19.5, Help 166).
- **Picture:** the Template's (Skynet_Vessel_Widget.svg: 16 IPs: 15 from the Vessel IP Template drawing, plus Center Back Element).
- **Parts built into its IPs** (Properties, under each Placed IP, **On this IP**): Heating Element (digital out, element), Temperature Probe, Thermowell with its Temperature Probe, or Motorized Valve (digital out, valve). One **Interface** for all of them, then each part's **Port** (a DS18B20 takes its OneWire number). Two parts can't share a Port. They are integral parts, like the RIMS tube's: not separate Devices, can't be deleted on their own, and a built-in valve has no IPs of its own (it sits in the vessel's IP).
- **Named:** each part gets the suggested name from its Label `<Vessel Label> <IP Label>`, e.g. `BM_14_eVlv_HLT_Right_Sparge_BH`.
- **Flow:** an Element, Probe or Thermowell closes its IP; a Valve passes flow only while it is on.
- **HERMS coil:** Left or Right, drawn under that side's HERMS In and Out IPs; the two IPs are the coil's ends.
- **Locked once built and saved** on a Tab: IPs (Place), parts and HERMS coil can't be changed; no un-bundling.
- The **RIMS tube** (5.1) is a small Vessel Device Template whose Element and Probe are already set and locked (Fritz, 2026-11-05).

### 5.4 Valve Tee and Supply Manifolds (Skynet Rule 5.35)
- **Add menu:** Edit layout bar > Elbows, Tees … > Valve Tees and Supply Manifolds, or Select Device Type > Valves. Six rows: **Long Tee with a Valve**, **Double Supply Manifold** and **Triple Supply Manifold**, each with all its valves **Manual** or all **Motorized** to start. Templates: Valve_Tee, Supply_Manifold_2, Supply_Manifold_3 (Bundled Fitting Templates).
- **Pictures:** Skynet_TC15_Valve_Tee.svg, Skynet_TC15_Supply_Manifold_2.svg, Skynet_TC15_Supply_Manifold_3.svg (Fritz's Long Tees joined end to end); the panel draws each valve on its branch, Manual or Motorized, with TC 1.5 ferrules that match the tee ends (top one clamped to the branch, bottom one the IP); no picture file.
- **IPs:** only the two open ends of the joined tees and the far end of each valve (3, 4 or 5). A closed valve shuts its IP.
- **Built-in Devices:** one valve per tee, a Digital Output with Kind = valve. **Manual** = Valve type Manual (no Port; a Process shows a pop-up and waits for Done), Type ID M_L_Vlv. **Motorized** = Valve type Electro_Mechanical, Type ID eVlv, on a Port of the fitting's one **Interface**. Two valves can't share a Port.
- **Each valve is swapped Manual / Motorized on its own** in the fitting's Properties (Valves: Valve 1, Valve 2 ...), at any time; not locked once saved (unlike 5.3).
- **Named:** the fitting ValveTee_n / Manifold2_n / Manifold3_n, Label valve_tee_n / manifold_2_n / manifold_3_n (never blank). Each valve's Label is `<fitting Label> V1`, `V2` ...; its name the suggested name, e.g. `MB_22_eVlv_manifold_2_1_V1_BR`, `M_L_Vlv_manifold_2_1_V2_BR`.
- A click on a valve on its Tab opens or closes it. Motorized valves are on Close all / Open all.
- **Add box and Properties:** the Pump's drill-down (Rule 18.29): 1 Label, 2 Interface, 3 Valve 1 / 2 / 3 (Manual or Motorized, Available Ports on its line), 4 Tab, then Name, Graphic, Path, Orientation, X, Y, Width, Height, Device Type. A saved Motorized valve's Port and the Interface are greyed out (make it Manual, Save, then Motorized to wire it again).
- **Valve numbers** 1, 2, 3 on the valves in Edit layout and on the dialog Graphic, matching Valve 1, 2, 3.
- **Orientation:** Horizontal, Left Vertical 90, Right Vertical 90, with Flip (No flip, Flip Vertical: valves on top when Horizontal, Flip Horizontal, Flip both; Fritz 2026-11-07). No Autosize, no Clone. Dropped on a straight pipe it cuts the pipe like a tee.

---

## 6. Reserved, not built yet
- **DHT11 / DHT22** (temperature and humidity): Type IDs kept; needs firmware first.

---

## Change log
- 2026-10-27: First version, from panel version PR107_Skynet-v.20261026_23_23 (plus open PR #108).
- 2026-10-27: RTD (PT100 / PT1000) CS pins on a Mega limited to D14-D17, D22-D39, D41-D43, D47-D49, D53 (Skynet Rule 6.9).
- 2026-10-27: D10 kept for the Ethernet shield on an Ethernet Mega; no USB to Ethernet change while D10 is used (Skynet Rule 6.10).
- 2026-10-27: D4 warning and SD card check (Skynet Rule 6.11).
- 2026-10-27: Added Cloned Devices (Skynet Rule 4.4).
- 2026-10-27: Display name became Label (`label`) with a Show label switch (it replaces Hide name); imagePath_2 / _3 editable again; PID, Hysteresis and Duty Cycle are On while Enabled (thread "Apply clean-up requests and standards").
- 2026-10-27: Cloned Devices updated: Clone button only, names <Parent_Name>_Clone_N, not used in Processes.
- 2026-10-28: Raspberry Pi GPIO pins built (Board Raspberry Pi, Help 78, PR #119 merged); removed from Reserved.
- 2026-10-28: Added 4.3a Skynet Motorized Ball Valve Device (Master H, Daughters VL and VR; fixed and user settable attributes; thread "Lock Skynet Widget Templates and IPs", Help 88).
- 2026-10-30: Database and .API settings on every Device (Rule 6.14, Help 98). (thread "Send any Device or Widget to a database")
- 2026-10-31: 4.2 Pump: Skynet pump pictures with IPs on the real ports (12 drawings, Help 104). (thread "Draw SVGs for common brew pumps")
- 2026-11-02: 4.2 Pump: Cover overlay, .cover and .coverColor (Rule 7.13, Help 111). (thread "Draw SVGs for common brew pumps")
- 2026-11-02: Added 4.3b Skynet Motorized Butterfly Valve Device (Master H, VL, VR, Front, Front Elbow), the Motorized Ball Valve redrawn with a Front Daughter, and 4.12a Tees with a Temperature Probe; IPs on the ferrule faces (Rule 5.20, Help 110). (thread "Create pipe Widgets from Fritz's drawings")
- 2026-11-02: Background pictures are .backpath, .backpath_2, .backpath_3 (were imagePath_1-3); 0, blank or over 3 = no background (Rule 7.10). (thread "Rename image paths to backpath")
- 2026-11-02: Universal Properties standard (Rule 1.21): every Device, Widget and Semi-Device gets the same Properties and attributes; see docs/Universal_Properties.md. (thread "Set universal properties standard", Help 114)
- 2026-11-03: 4.2 Pump: the drill-down Properties dialog, the standard for every Device (Rule 18.12, Help 115). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-03: 4.6 renamed User Defined Proportional Valve (In / Out IP spots); added 4.6a Skynet KLD20T Proportional Valve (Rule 5.22, Help 117). (thread "Add BruControl KLD20T proportional valve")
- 2026-11-04: 4.2 Pump: adding a Pump, pick the pump with its picture (Rule 18.13). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: 4.3a Skynet Motorized Ball Valve: IPs on the pipe ends at 45 degrees too (Rule 5.24, Help 123). (thread "Add IPs to Ball Valve Devices and Widgets")
- 2026-11-04: 4.2 Pump: IPs on the inlet and outlet of every Skynet pump picture, the older Riptide-style ones and the sump pump too (Rule 5.24, Help 123). (thread "Add IPs to Ball Valve Devices and Widgets")
- 2026-11-05: 4.3a and 4.3c: one Motorized Ball Valve row with a valve picker; the Pump's drill-down Add box and Properties without a Cover (Rule 18.23, Help 128). (thread "Add Motorized Ball Valve drill-down dialog")
- 2026-11-05: Added 5.3 Vessel Device (built from a Vessel Widget Template; parts built into its IPs, HERMS coil, locked once built and saved; Skynet Rule 5.31).
- 2026-11-06: Added 5.4 Valve Tee and Supply Manifolds (Double, Triple): Long Tees with a valve Device built into each branch, each Manual or Motorized on its own (Skynet Rule 5.35, Help 146). (thread "Add valve Tees and supply manifolds")
- 2026-11-06: 5.4 Valve Tee and Supply Manifolds: the Pump's drill-down Add box and Properties (Rule 18.29), valve ends with TC ferrules matching the tees, valve numbers, three Orientations and no Flip. (thread "Add valve Tees and supply manifolds")
- 2026-11-07: 5.4 Valve Tee and Supply Manifolds: Flip added on the Orientation line (valves on top or bottom). (thread "Let Supply Manifolds flip valves top or bottom")
- 2026-11-08: 4.2 Pump: Model with Pump facts, Power, Use, Speed control and Speed % (PWM), hover facts (Rule 18.32, Help 163). (thread "List DC brewing pumps for the Panel")
- 2026-11-08: 5.3 Vessel Device: can be made step by step with the Vessel Device Builder (Skynet Rule 19.5, Help 166).
- 2026-11-09: Added 4.17 Hydrometer (Type ID Hydro, virtual ports 200+), with its Templates; Hydro taken off Reserved (Skynet Rule 6.25, Help 170). (thread "Add Hydrometer Device with templates")
- 2026-11-09: 4.17 Hydrometer reads Bluetooth: Tilts by Tilt Color, RAPT Pills by Hardware ID, heard by an ESP32 (ESP32_Hydrometer) or a Raspberry Pi's own Bluetooth (Pi_Bluetooth) (Skynet Rule 6.25, Help 170). (thread "Add Hydrometer Device with templates")
