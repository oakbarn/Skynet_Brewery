# Glossary

Every special word in Skynet, from A to Z. Pick a letter to jump to it, or type the word in the Help **Search** box.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [🔌 Wiring words](#wiring-and-hardware-words)

## A

**Admin, Operator, Viewer**: the three user roles. See [Login](10-login).

**Alarm**: a Widget that plays a sound file: Hop, Brew Flow, Pre-Hop, General or Sound only. Only one sound plays at a time, by priority. In a Process: `alm_Name = true`. See [Alarms and sound](21-alarms-and-sound).

**Analog output**: a Device that sends a steady signal (0-10 V or 4-20 mA) to set something part way, such as a pump's speed. See [PWM and Analog out Device Properties](136-pwm-and-analog-out-device-properties).

**API**: the way other programs (Node-RED, Home Assistant) read and set values. See [API](11-api).

**Audio Widget**: a Widget that plays one sound file (`play SoundPlayer`, `stop SoundPlayer`). It pauses while any alarm sounds.

## B

**Background (of a tab)**: the picture and color behind everything on a tab. Set in **⚙ Tab settings** with Edit layout on. See [Tab background picture and color](26-tab-background).

**.backpath, .backpath_2, .backpath_3**: the three background picture paths of an item (they were imagePath_1, _2, _3). `background = 1, 2 or 3` picks one; 0, blank or over 3 shows none; `name.image = "path"` changes .backpath. See [Pictures on items](25-picture-paths).

**BeerXML**: the recipe file BeerSmith exports. See [Import](08-import).

**Boil Profile**: the total boil time and the boil off per hour.

**Boolean Widget**: a Widget that is only On or Off: a Switch, Slider, Checkbox, Lighted Button, Push Button, Pulse Button or LED. With a **Linked Device** picked, it acts like a **Clone** of that Device. See [Semi Widgets Devices](112-semi-widgets-devices).

**Brain**: the main computer that runs Skynet: a Raspberry Pi 4 or newer, or a Windows, Linux or Mac computer (a mini PC, desktop or laptop). It keeps every text, picture and Schema file and every saved value, so the panel can be reached from any browser. The boards (**Interfaces**) connect to it by USB or Ethernet. See [Move the Brain](119-move-brain).

**Brewhouse Efficiency**: how much of the sugar in the grain really ends up in the fermenter, as a %. Each Tab has its own, copied from its Equipment Profile. Skynet records it for each brew on a Tab and shows the average of the last 10 brews on that Tab. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Build Tab (🔨)**: the clean Tab where every new Device, Widget or copy of a Template is made first. **✅ Finish Build ...** moves it to its Tab. An unfinished Build is kept on the Brain until you finish it or discard it. See [Build Tab](55-build-tab), and every step with pictures in [Step by Step: Add a Device](207-step-by-step-add-a-device).

**Bundle**: a vessel locked together with its IPs so they move as one and can't be edited until you switch **Bundled** off. See [Equipment](14-equipment).

## C

**Clone**: the same Device shown on another Tab. It is not a copy: tapping the Clone is tapping the Device it came from. See [Cloned Devices](71-cloned-devices).

**Color selector**: every color setting is the same dropdown. **Default** (first) keeps the item's normal color, **None** (second) means no color at all (see-through), then colors by name with a swatch, and **Custom (add new) ...** for any other color: it pops up the **Color Picker** (Help 187), and the color is kept in the list for next time. A color of your own shows a **Color (RGB)** line just below, for example 250,250,250; double-click it to bring up the Color Picker again.

**Confirmation Widget**: stands for something done **by hand**, with no board to turn it on: a Manual Valve, a Manual Pump, or moving a QD Hose. When it is turned On or Off, Skynet asks you to do it and confirm it is done. See [Confirmation Widgets](162-confirmation-widgets).

## D

**Deadband**: a heating method that steps its output % up or down toward the **Setpoint**, gentler and slower than a PID. See [Deadband Device](126-deadband-device).

**Default Layout**: the vessels, fittings, IPs, pipes and hoses an Equipment Profile holds. It is copied onto a Tab to start a build; the Tab keeps no link to it.

**Default settings**: what a **new** thing starts with. Found in **☰ Menu > Default settings**. See [Default settings](155-default-settings).

**Device**: a thing tied to a port or pin on a board, such as a pump relay or a probe. See [Devices](03-devices). Every step, with pictures: [Step by Step: Add a Device](207-step-by-step-add-a-device).

**Direct**: a heating method: the heater is fully On or fully Off. See [One Heating Element, pick how it heats](150-heating-method).

**Duty Cycle**: a heating method: the heater is On for a % of each cycle (for example 60 % for a rolling boil). See [One Heating Element, pick how it heats](150-heating-method).

## E

**Edit layout**: the mode where an Admin changes the Tabs: adds, moves and sets up Devices and Widgets. It is the first choice of the **☰ Menu**. See [Edit layout bar](82-edit-layout-bar).

**Element**: a word Skynet does not use: a thing on a Tab is a **Device** (tied to a port on a board) or a **Widget** (app only). The one exception is a *heating element*, the real part in a kettle.

**Equipment Profile**: the losses, vessels and piping of a brewery's equipment (for example the Hot Side, or Fermentation), made on the Equipment Profile tab of the ☰ Menu. It is only copied onto a Tab to start a build; after that the Tab keeps no link to it. Any Schema can start any number of Tabs from it. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Equipment Profile Interview**: a few questions (how many vessels, the type and size of each) that put your vessels on a Tab for you. See [Equipment Profile Interview](196-equipment-profile-interview).

## F

**Fitting**: a pipe part (tee, elbow, cross, coupling, cap, manual valve) placed as an IP type.

**Flow color**: the color drawn in a Pipe or Hose while liquid moves through it. Skynet picks it for you. See [Pipe and Hose Flow Colors](116-pipe-and-hose-flow-colors).

## G

**gAPI**: retired 2026-10-30, now a **gGlobal**. Any Device or Widget can reach the database and the API with its **Database and .API** settings.

**gGlobal**: a variable with Global Scope, for Processes. It has no Database and .API box: a Process sends it to the database with `send_db` or `DBSend`. Suggested names start with `gG` (`gGV_`, `gGB_` ...). It was gKonstant and gAPI (and before that vKonstant and vAPI).

**gGlobal Kind**: what a gGlobal holds: a Value (gV_), a String of text (gS_), a Boolean, true or false (gB_), a Time (gT_), a Date Time (gD_) or a Graphic (gG_). The Kind is set once and never changes. A gGlobal keeps its value after a restart. See [gGlobal Kinds](108-gglobal-kinds).

**gKonstant**: retired 2026-10-30, now a **gGlobal**.

**Global**: an old variable class. The panel turns Globals into gGlobal variables when they are loaded.

## H

**Heat Source**: how a vessel is heated: Gas, Electric, RIMS, HERMS, Other or Unheated. See [Vessel settings](34-vessel-tab).

**Heating method**: how one Heating Element heats: **Direct**, **Duty Cycle**, **Hysteresis**, **PID**, **Deadband** or **Precise**. It can be changed while brewing. See [One Heating Element, pick how it heats](150-heating-method).

**Hidden key**: a number Skynet gives every item the first time it is saved. You never see it. It is how Skynet knows it is the same item after you give it a new name, so every Process follows the new name. See [Name Change and hidden keys](80-name-change-and-hidden-keys).

**Hole** (Kettle Port): an opening in a kettle.

**Hose**: a flexible pipe that bends in curves, with an IP (a coupling) at both ends. See [Pipes, hoses and reducers](24-pipes-and-hoses).

**Hover Help**: the small yellow box that shows when you rest the mouse on a field name with a dotted underline. It says the same as the Help page. See [Hover help in dialogs](147-hover-help).

**Hydro**: a Tilt or any other hydrometer: the Hydrometer Device. See [Hydrometers](170-hydrometers).

**Hysteresis**: a heating method that turns the heater On and Off to keep the water near the **Setpoint**. For the HLT element, Setpoint 150 °F and Offset −1: the heater turns Off at 150 °F and On again at 149 °F. See [One Heating Element, pick how it heats](150-heating-method).

## I

**Integrated Device**: one item with Devices built into it, such as the RIMS tube (its heating element and probe) or a Vessel Device. What is built in can never be taken out. See [Skynet Integrated Devices](64-skynet-integrated-devices).

**Interface**: a board (PLC) Devices are wired to. Its **Interface ID** (like `MB_`, Rule 3.2) starts the names of its Devices. See [Interface, Tab and Device names](46-interface-tab-device-names).

**IP (Initial Point)**: a small round marker where a flow starts or ends (a pump outlet, a vessel port, a drain). Pipes start and end on IPs. IPs only show in Edit layout, as a **small red dot**, so IPs close together never cover each other. Rest the mouse on a dot (or select it) and it grows into a white circle inside a colored ring with its letters and name.

## L

**Label**: the text a Tab shows on a Device or Widget. It is never blank. See [Labels](72-labels).

**Layer Order**: which item is on top where items overlap on a Tab: 1 is on top, 2 is under it, and so on. See [Universal Properties](114-universal-properties).

**List box** (dropdown, drop down list box): a box with a ▼ that opens a list of choices. Type a letter to jump to a choice; **➕ Add new ...** at the end makes a new one. See [List Boxes (Dropdowns)](189-list-boxes).

**Lock**: a locked item (🔒) can't be dragged or resized, not even in Edit layout. **Lock All** and **Unlock All** do the whole Tab. See [Locking items in place](56-locking).

## M

**Manual Valve Widget**: a valve you turn by hand. A click on it turns it; a Process asks you to turn it and waits until you confirm. See [Manual valves](29-manual-valves).

**Mash Profile**: up to 4 mash steps (temperature and time) and the sparge. See [Mash and Boil Profiles](35-mash-and-boil-profiles).

**Media folder**: a folder on the Pi that holds pictures and sounds. See [Media](07-media).

**☰ Menu**: the button at the top right of the Tabs page. Edit layout is its first choice; the rest open Menu tabs. See [The ☰ Menu](33-menu).

**Menu Bar**: the row with the Brewery Name in the middle and the Simulator balloon, Build, Sound, Emergency Off, ? and ☰ Menu at its right, in the same place on every Tab and in the Process Editor. See [The Menu Bar](40-menu-bar).

**Menu tab**: a page opened from the ☰ Menu (Default settings, Equipment Profile, Mash Profile, Boil Profile, the other profiles and Templates). It shows next to the screen tabs, with a ✕ to close it, and has an Order number.

## N

**Name**: the one name of an item that Processes use, for a Device: Interface ID _ Port _ Type _ Label _ Tab ID. Only letters, numbers and _ ~ @. Once saved it changes only with **✏ Change name**. See [Interface, Tab and Device names](46-interface-tab-device-names).

**NULL**: the empty value: no value at all, not 0 or blank text. `X = NULL` empties it. See [Process language and steps](22-process-language).

## O

**Offset**: how far from the **Setpoint** a heater turns On again in **Hysteresis**: On point = Setpoint + Offset. Heating uses a minus Offset (−1: On at 149 °F for 150 °F), cooling a plus one. See [One Heating Element, pick how it heats](150-heating-method).

**Override button**: one press and every running Process moves past the wait or sleep it is stuck in. Manual valves still wait for their click. See [Override button](96-override-button).

## P

**Pi Brain**: a Raspberry Pi set up as the **Brain**: Skynet installed on it, starting by itself whenever it has power, with the boards on its USB sockets. Every step: [Set Up a Pi Brain](204-set-up-a-pi-brain).

**PID**: a heating method that holds a **Setpoint** by working out its own %. See [One Heating Element, pick how it heats](150-heating-method).

**PLC**: in this project, a hobby board: Arduino-compatible (such as the Mega), ESP32 or Raspberry Pi.

**Port**: one connection (pin) on a board where a Device is wired. When you add a Device, the list offers only free Ports. See [Interfaces](76-interfaces).

**Precise**: a calm heating method that holds a Setpoint to 0.1 degree, for a still's column or a water bath. See [Precise heating](156-precise-heating).

**Process**: a text file of brew steps the panel runs by itself. See [Processes](05-scripts).

**Process class**: Flow, Sub, Repeat or Looper: what a Process is for. See [Process language and steps](22-process-language).

**Process Widget**: a Widget that shows one Process on a Tab, what it is doing, and a ▶ Start / ■ Stop button. See [Process Widget](173-process-widget).

**Push button, Toggle, Pulse**: a **Push button** is On only while held. A **Toggle** stays On or Off until pressed again. A **Pulse** is On for 100 ms (one tenth of a second).

**PWM**: an output that switches on and off very fast to give a part power, such as a DC pump's speed (PWM is short for pulse width modulation). See [PWM and Analog out Device Properties](136-pwm-and-analog-out-device-properties).

## Q

**Quick Disconnect (QD), QD hose**: a fitting on an IP where a hose is clicked on and off by hand, and the hose moved between them on Brew Day. See [Quick Disconnects and QD hoses](127-quick-disconnects-and-qd-hoses).

## R

**Raspberry Pi**: a small computer that can be the **Brain**: it runs the panel and keeps all its files. See [Set Up a Pi Brain](204-set-up-a-pi-brain).

**Recipe**: the grains, hops, yeast and steps of one beer, typed in or brought in from BeerSmith. See [The Recipe tab](99-recipe-tab).

## S

**Schema**: one whole brewery setup (tabs, Devices, Widgets, pipes, settings and the Equipment numbers of each Tab), kept in its own file in the `config` folder and picked from the Schema dropdown at the top. Other programs call it a setup or configuration. The samples are ready-made Schemas. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Semi_Widgets_Devices**: things that live only in the app like a Widget, but are On or Off like a Device: the Manual Valve Widget and the **Boolean Widgets**. See [Semi Widgets Devices](112-semi-widgets-devices).

**Service**: what a valve carries: Gas, Room Temperature Liquid, or High Temperature Liquid (Stainless Steel). A gas valve can be a vessel's heat source.

**Setpoint**: the temperature (or other reading) a control holds, such as 150 °F for the HLT. See [One Heating Element, pick how it heats](150-heating-method).

**Shared variable**: an old class that is gone; use a gGlobal instead. An older Schema that still has one loads without it: see [Shared variables became gGlobals](149-shared-variables-became-gglobals).

**Simulation mode**: every board is replaced by the simulator and time can run faster or skip ahead, to try a brew day without touching hardware. See [Simulation mode](20-simulation).

**Simulator**: a pretend board, so you can try everything without hardware.

**skn_**: the start of every Skynet name, for anything Skynet owns: values Skynet sets and a Process only reads, such as `skn_Boil_Temp`; roles that hold one temperature probe, such as `skn_Boil_Probe_1`; and Skynet Constants.

**skn_const_ (Skynet Constants)**: fixed numbers built into Skynet for common conversions, such as `skn_const_L_p_Gal` (Label: Liters per Gallon). Nobody can change them. See [Skynet Constants](94-skynet-constants).

**Step**: a `step "name"` line in a Process. Steps are numbered by themselves (1.00000, 1.00001 ...). See [Process language and steps](22-process-language).

**Step by Step**: Help pages that show every step with pictures. They are listed first in the Help. See [Step by Step: Add a Schema](188-step-by-step-add-a-schema), [Step by Step: Add a Device](207-step-by-step-add-a-device) and [Step by Step: Add a Widget](208-step-by-step-add-a-widget). The wiring guides (a DAC, an SSR, 10K NTC, 1-Wire, PT100 and PT1000 probes) are Step by Step guides too, each with a drawing.

**Suggested Name**: the Name Skynet fills in for a new item from its parts. You may change it before you save.

**SVG**: a picture format that stays sharp at any size. The panel makes SVG copies of your PNG and JPG pictures.

## T

**Tab**: one brewery screen.

**Tab ID**: the short ID (like `SP`) that ends the names of new Devices on a tab; it follows Rule 3.2. See [Interface, Tab and Device names](46-interface-tab-device-names).

**Tab Profile**: a background color and the look (colors, placement, LED / Text / Gauge) new devices and widgets start with, copied onto a tab (never linked). See [Tab and Valve Profiles](36-tab-and-valve-profiles).

**Tab_Vessel, Tab_Fitting**: the copy of a Template on a Tab. Not a Device and not a Widget, but it can hold both. Fully editable. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

**Tailscale**: a free private network between your own devices, for using the panel away from home safely. See [Installing Tailscale on Windows](00-tailscale-windows).

**Template**: a ready-made vessel (Vessel Template) or set of up to four fittings (Bundled Fitting Template), kept in a library. Skynet Templates come with the panel and are only cloned; User Bundled Templates are your own. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

**Top Line**: the line at the very top of the other pages: the panel name, the Schema dropdown, Tabs, Processes and so on. Hidden on the Tabs to start, and off in the Process Editor. See [The Menu Bar](40-menu-bar).

## U

**Universal Properties**: the Properties every Device and Widget has: Name, Label, Position, Size, Layer Order, Visible, Lock and the hidden key. See [Universal Properties](114-universal-properties).

**User Language**: a third Help language, besides English and Français, that an Admin brings in with any AI: Skynet saves the Help as text files, the AI translates them, Skynet takes them back. Brewing words such as Strike and Mash stay English, with their meaning next to them. See [Help in any language](242-help-in-any-language).

## V

**Value Widget**: a Widget that shows one number on a Tab; a tap sets it and every Process can read it. There are Time and DateTime Widgets too. See [Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets).

**Valve Profile**: the graphics and orientation (Horizontal, Vertical, 45 degrees Left or Right) a new valve starts with, picked only when the valve is made.

**Vessel Device**: a vessel with its Heating Elements and Temperature probe built into it, made with the **Vessel Device Builder**. See [Build a Vessel Device step by step](166-vessel-device-builder).

**Vessel Widget**: a vessel drawn on a Tab, with a spot for each IP a brew vessel can have. See [Vessel Widget](133-vessel-widget).

## W

**Widget**: an item that lives only in the app, not tied to any board (pictures, labels, timers, IPs, fittings). Every step, with pictures: [Step by Step: Add a Widget](208-step-by-step-add-a-widget).

## Wiring and hardware words

The parts and technical words in the wiring lists, in plain words: what each one does, what Skynet needs, and parts to compare. The suggested parts are examples to compare, not endorsements. **Where to buy** links will come later; until then each one shows what to search for.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.** (Rule 6.20)

### 0-10 V Signal

- **In plain words:** A control wire whose voltage, from 0 V (off or 0 %) to 10 V (full or 100 %), sets how much. Used by power regulators, proportional valves and speed controls.
- **What Skynet needs:** Made from a True PWM Port by a DAC / PWM to 0-10 V Module.

### 0-10V Controller

*Also called a 0-10 V Power Regulator or SCR power controller.*

- **What it does:** Sets how much power an element gets, from 0 to 100 %, by a 0-10 V signal (it trims each AC wave, called phase-angle).
- **What Skynet needs:** **Control:** 0-10 V (from the DAC / PWM to 0-10 V Module). **AMPS:** at least the element's, with room to spare (40 A or more for 5500 W at 240 V). **Voltage:** the element's (120 or 240 V AC). Always on a Heat Sink.
- **Suggested parts:** SCR power regulators or SSVR voltage regulators with a 0-10 V input (Auber, Crydom)
- **Where to buy:** *(link coming)* Search Amazon for "SCR power controller 0-10V".

### 4-20 mA

- **In plain words:** A sensor sends a current: 4 mA = lowest, 20 mA = highest. A broken wire reads 0 mA, so it is easy to spot. Good over long wires.
- **What Skynet needs:** A 250 ohm resistor turns it into 1-5 V for an Analog Port.

### ADS1115

- **What it does:** A small board that reads 4 analog signals much more finely than the Arduino can.
- **What Skynet needs:** I2C (Mega SDA/SCL, Pi GPIO 2 and 3), address 0x48, 3.3 or 5 V. For pH and pressure.
- **How to wire it:** [Step by Step: Wire an ADS1115](227-step-by-step-wire-an-ads1115)
- **Suggested parts:** Adafruit ADS1115 board (or a clone)
- **Where to buy:** *(link coming)* Search Amazon for "ADS1115 module".

### Contactor

- **What it does:** A heavy-duty relay that switches both hot wires of a 240 V circuit, so the element is truly Off. Also what an E-Stop drops.
- **What Skynet needs:** **Two-pole** (both hot wires) for 240 V; **30 or 40 A** for a 5500 W element. Coil voltage to match its driver (12 or 24 V DC, or 120 V AC), switched by a Relay Module channel.
- **How to wire it:** [Step by Step: Wire a Contactor](216-step-by-step-wire-a-contactor)
- **Suggested parts:** Two-pole definite purpose contactors (30 A or 40 A); DIN-rail 2-pole modular contactors
- **Where to buy:** *(link coming)* Search Amazon for "2 pole 40A contactor".

### Counter Port

- **In plain words:** A board pin that counts fast pulses, such as from a Flow Meter.
- **What Skynet needs:** Mega D2, D3, D18-D21 (up to 6 per Mega).

### CS Port

*Chip Select.*

- **In plain words:** The one wire that tells an SPI board "you are the one being talked to now". Each SPI board needs its own.
- **What Skynet needs:** Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53 for an RTD (Rule 6.9).

### DAC

*Digital to Analog Converter.*

- **What it does:** Turns the board's on/off (digital) signal into a smooth voltage, for example 0 to 10 V, so a heater, valve or pump can be set to any % instead of only On or Off.
- **What Skynet needs:** Skynet sends a % from a **True PWM Port**, so the DAC it needs is a **PWM to 0-10 V Module** (input 0-5 V PWM from a Mega, or 3.3 V from an ESP32 or Pi; output 0-10 V or 0-5 V, set by a jumper or screw). A separate DAC chip board that talks over I2C (MCP4725, GP8403) is **not** read by the Skynet board program yet. Rule 6.24 lets you match the % to the real volts with a meter.
- **How to wire it:** [Step by Step: Wire a DAC (0-10 V)](209-step-by-step-wire-a-dac)
- **Suggested parts:** PWM to 0-10 V converter module (LC-LM358-PWM2V type, 0-5 V or 0-10 V selectable); a DIN-rail PWM to 0-10 V signal converter
- **Where to buy:** *(link coming)* Search Amazon for "PWM to 0-10V module".

### DC Power Supply

- **What it does:** Turns the wall's AC into steady 12 V or 24 V DC for valves, relays, DC pumps and modules.
- **What Skynet needs:** Voltage to match the parts; AMPS at least the total of everything on it plus 25 %. DIN-rail or enclosed. Its (-) tied to the Arduino's GND when a MOSFET, 0-10 V Module or 4-20 mA sensor is used.
- **Suggested parts:** Mean Well DIN-rail supplies (HDR or EDR series); Mean Well LRS enclosed supplies
- **Where to buy:** *(link coming)* Search Amazon for "Mean Well 24V DIN rail power supply".

### Diode

*Flyback Diode.*

- **What it does:** A one-way part put across a DC coil (solenoid or relay) to soak up the kick when it turns off, so it does not harm the switch.
- **What Skynet needs:** 1N4007 (or 1N4001-1N4007), stripe toward the (+) side of the coil.
- **Suggested parts:** 1N4007 diode packs
- **Where to buy:** *(link coming)* Search Amazon for "1N4007 diode".

### DO, DI and AI Ports

- **In plain words:** DO = Digital Out (the board turns it On or Off). DI = Digital In (the board reads a switch, On or Off). AI = Analog In (the board reads a voltage, 0 to 5 V on a Mega).
- **What Skynet needs:** Mega AI Ports A0-A15 (= 54-69). The Pi has no AI Ports (use an ADS1115).

### DS18B20

- **What it does:** A digital temperature probe. Many share one wire, each with its own number.
- **What Skynet needs:** Waterproof stainless tip, 3 wires (5 V, GND, data). One 4.7k ohm resistor for the whole set. OneWire Port: Mega D40, Pi GPIO 4.
- **How to wire it:** [Step by Step: Wire 1-Wire Probes (DS18B20)](212-step-by-step-wire-1-wire-probes)
- **Suggested parts:** Waterproof DS18B20 probes (1 m to 3 m lead)
- **Where to buy:** *(link coming)* Search Amazon for "DS18B20 waterproof probe".

### E-Stop

*Emergency Stop.*

- **What it does:** A big red mushroom button. Pressed, it cuts all the brewery's power by its own wiring.
- **What Skynet needs:** A **normally closed** contact that drops the Main Contactor's coil, and a second contact (normally open or closed) to a DI Port so Skynet knows (Type ID `EStop`). Twist or pull to reset.
- **How to wire it:** [Step by Step: Wire an E-Stop](231-step-by-step-wire-an-e-stop)
- **Suggested parts:** 22 mm red mushroom E-stop button with 1 NC + 1 NO contact blocks
- **Where to buy:** *(link coming)* Search Amazon for "22mm emergency stop button NC NO".

### Float Switch

- **What it does:** A float that closes a switch when the liquid reaches it (full) or drops away (low).
- **What Skynet needs:** Stainless, food grade, 2 wires to a DI Port and GND (the board's pull-up is on).
- **How to wire it:** [Step by Step: Wire Switches and Float Switches](233-step-by-step-wire-switches-and-float-switches)
- **Suggested parts:** Stainless side-mount or vertical float switches
- **Where to buy:** *(link coming)* Search Amazon for "stainless float switch".

### Flow Meter

- **What it does:** A little wheel in the pipe sends a pulse each time a set amount of liquid passes.
- **What Skynet needs:** A Counter Port (Mega D2, D3, D18-D21), 5 V supply; stainless and food grade for hot wort (plastic YF-S201 for cold water only); Pulses per unit from its data sheet.
- **How to wire it:** [Step by Step: Wire a Flow Meter](223-step-by-step-wire-a-flow-meter)
- **Suggested parts:** Stainless hall-effect flow sensors (1/2" NPT); YF-S201 for cold water
- **Where to buy:** *(link coming)* Search Amazon for "stainless hall flow sensor 1/2".

### Gas Solenoid Valve

- **What it does:** A solenoid valve made for gas, so the brew controller can turn the burner On and Off.
- **What Skynet needs:** **Listed for LP gas** (UL or CSA), **normally closed**, rated above the regulator's pressure, 24 V DC (or 24 V AC) coil. See [Flame Out safety](197-flame-out-safety). ⚠ Gas: see the warning at the top of this section.
- **How to wire it:** [Step by Step: Wire a Gas Solenoid and Igniter](219-step-by-step-wire-a-gas-solenoid-and-igniter)
- **Suggested parts:** Listed LP gas solenoid valves (ASCO gas shut-off series and similar)
- **Where to buy:** *(link coming)* Search Amazon for "LP gas solenoid valve 24V listed".

### GFCI

*Ground Fault Circuit Interrupter.*

- **What it does:** Cuts the power in a split second if electricity leaks to ground, for example through water or a person. A must near liquids.
- **What Skynet needs:** Every AC circuit in the brewery on a GFCI: a GFCI breaker in the main panel, a GFCI spa panel, or a GFCI outlet first on the line. Sized for the circuit (20 A for 120 V elements and pumps, 30 or 50 A for 240 V elements).
- **Suggested parts:** GFCI breakers made for your main panel's brand; 50 A GFCI spa panels
- **Where to buy:** *(link coming)* Search Amazon for "GFCI spa panel 50A".

### GND

*Ground.*

- **In plain words:** The common return wire (0 V) every low-voltage part shares, so their signals mean the same thing.
- **What Skynet needs:** Tie the (-) of a DC Power Supply to the Arduino's GND when it feeds a MOSFET, a 0-10 V Module or a 4-20 mA sensor.

### Heat Sink

- **What it does:** A finned metal block an SSR or power regulator is bolted to, so it gets rid of its heat and does not burn out.
- **What Skynet needs:** One for every SSR above about 5 AMPS and every 0-10 V Power Regulator, sized for the AMPS (the SSR maker lists one). A thin layer of heat sink paste or a pad between them.
- **Suggested parts:** Auber or Crydom heat sinks made for their SSRs; DIN-rail SSR heat sinks
- **Where to buy:** *(link coming)* Search Amazon for "SSR heat sink".

### HX711 and Load Cells

- **What it does:** Load cells bend a tiny bit under weight; the HX711 board reads that so Skynet can weigh a vessel.
- **What Skynet needs:** One HX711 per vessel (two Ports: DT and SCK), with four half-bridge cells and a Combinator Board, or one S-type cell sized for the full vessel.
- **How to wire it:** [Step by Step: Wire a Vessel Scale](228-step-by-step-wire-a-vessel-scale)
- **Suggested parts:** HX711 boards; 50 kg half-bridge load cell sets of 4 with combinator; S-type load cells
- **Where to buy:** *(link coming)* Search Amazon for "HX711 load cell kit".

### I2C

*Said "I squared C"; sometimes misread as 12C.*

- **In plain words:** A two-wire way for small boards to talk to the Arduino or Pi (one data wire SDA, one clock wire SCL). Many boards can share the same two wires, each with its own address.
- **What Skynet needs:** Mega SDA = D20, SCL = D21; Pi GPIO 2 and 3. Used by the ADS1115 board (address 0x48).

### Igniter

- **What it does:** Makes a spark (or a hot glowing tip) to light the burner.
- **What Skynet needs:** 12 V DC spark module or 120 V AC hot surface igniter, switched by a Relay Module channel. Turned off by a Flame Out trip.
- **How to wire it:** [Step by Step: Wire a Gas Solenoid and Igniter](219-step-by-step-wire-a-gas-solenoid-and-igniter)
- **Suggested parts:** 12 V pulse spark igniter modules; hot surface igniters for gas burners
- **Where to buy:** *(link coming)* Search Amazon for "12V spark igniter module".

### Level Transmitter

*4-20 mA.*

- **What it does:** Reads how deep the liquid is and sends it as a current from 4 mA (empty) to 20 mA (full).
- **What Skynet needs:** 24 V DC loop power and a 250 ohm resistor from the Analog Port to GND (20 mA = 5 V). Rated for the liquid's temperature.
- **How to wire it:** [Step by Step: Wire a 4-20 mA Level Transmitter](225-step-by-step-wire-a-4-20-ma-level-transmitter)
- **Suggested parts:** Stainless submersible or hydrostatic level transmitters with a 4-20 mA output
- **Where to buy:** *(link coming)* Search Amazon for "4-20mA level transmitter stainless".

### Mechanical Power Relay

- **What it does:** A bigger relay for heavy loads like a compressor motor. Its coil is switched by a Relay Module channel.
- **What Skynet needs:** Contacts rated for a motor (a horsepower rating, for example 1 HP, or 30 A). Coil 12 V or 24 V DC, or 120 V AC, matching what drives it.
- **How to wire it:** [Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)
- **Suggested parts:** General purpose power relays with an HP rating (8 or 11 pin plug-in relay with a DIN socket, or a 30 A open-frame power relay)
- **Where to buy:** *(link coming)* Search Amazon for "30A power relay 12V coil".

### MOSFET Module

- **What it does:** An electronic switch for DC loads that can also switch very fast, so it can set a DC pump or fan's speed by PWM.
- **What Skynet needs:** **Logic level** (turns fully on at 3.3 or 5 V), DC load voltage 12 or 24 V, 10 A or more. Ground tied to the Arduino's GND.
- **How to wire it:** [Step by Step: Wire a DC Pump Speed Control](220-step-by-step-wire-a-dc-pump-speed-control)
- **Suggested parts:** Logic-level MOSFET driver modules (IRF520 modules are not fully on at 5 V; pick a logic-level or dual-MOSFET module)
- **Where to buy:** *(link coming)* Search Amazon for "logic level MOSFET module PWM".

### Motorized Ball Valve

- **What it does:** A ball valve with a small motor on top that opens and closes it when power is switched.
- **What Skynet needs:** 12 V or 24 V DC; stainless body for wort; the wiring on its label: **one control wire** (one relay) or **Open and Close wires** (two relays, Dual Throw, Rule 6.22). Sellers' wire codes (CR02, CR03, CR05...) differ, so read the label.
- **How to wire it:** [Step by Step: Wire a Motorized Ball Valve](217-step-by-step-wire-a-motorized-ball-valve)
- **Suggested parts:** Stainless 3-wire motorized ball valves (US Solid, Tsai Fan types), 1/2" NPT or TC 1.5
- **Where to buy:** *(link coming)* Search Amazon for "motorized ball valve stainless 12V 3 wire".

### NO and NC

*Normally Open, Normally Closed.*

- **In plain words:** How a switch sits when nothing presses it or powers it. NO = open (off) until pressed; NC = closed (on) until pressed.
- **What Skynet needs:** An E-Stop uses NC to drop the Main Contactor. A normally closed valve is shut with no power.

### NTC Thermistor

- **What it does:** The cheapest temperature probe: its resistance changes with heat.
- **What Skynet needs:** One Analog Port and one resistor the same size as the thermistor (10k ohm for a 10K). Its Beta value (for example 3950 or 3977) goes in its Properties.
- **How to wire it:** [Step by Step: Wire a 10K NTC Probe](210-step-by-step-wire-a-10k-ntc-probe)
- **Suggested parts:** 10K NTC Beta 3950 waterproof probes; BCS-462 type 10K probes
- **Where to buy:** *(link coming)* Search Amazon for "10K NTC thermistor probe waterproof".

### OneWire

- **In plain words:** A one-wire way (plus power and ground) for many DS18B20 probes to share a single Port. Each probe has its own number.
- **What Skynet needs:** Mega D40, Pi GPIO 4; one 4.7k ohm Pull-up Resistor for the set.
- **How to wire it:** [Step by Step: Wire 1-Wire Probes (DS18B20)](212-step-by-step-wire-1-wire-probes)

### Opto-isolated

- **In plain words:** The board's signal lights a tiny LED inside the part, and the light switches the load, so no wire joins the board to the high-power side.
- **What Skynet needs:** Best for every Relay Module and SSR.

### Pressure Transducer

*0.5-4.5 V.*

- **What it does:** Reads pressure (or liquid depth by the pressure at the bottom) as a voltage.
- **What Skynet needs:** 5 V supply from the Arduino, signal 0.5-4.5 V to an Analog Port, stainless, 1/4" NPT, rated for the liquid's temperature. An ADS1115 board gives finer readings.
- **How to wire it:** [Step by Step: Wire a Pressure Transducer](224-step-by-step-wire-a-pressure-transducer)
- **Suggested parts:** Stainless 5 V pressure transducers, 0-5 psi or 0-30 psi
- **Where to buy:** *(link coming)* Search Amazon for "pressure transducer 5V 0.5-4.5V stainless".

### Pull-up Resistor

- **In plain words:** A resistor from a signal wire to 5 V (or 3.3 V) that holds the wire HIGH until a switch or sensor pulls it LOW.
- **What Skynet needs:** The board's own pull-up is On for switches and flow meters; OneWire needs an outside 4.7k ohm one.

### PWM Port

*PWM, a True PWM Port.*

- **In plain words:** Pulse Width Modulation: a pin turned On and Off very fast. The share of time it is On (0 to 100 %) sets a speed or power. A True PWM Port is a pin the board can pulse by itself.
- **What Skynet needs:** Mega D2-D13, D44-D46. Needed for pump speed, fan speed, and the DAC / PWM to 0-10 V Module.

### Relay Module

- **What it does:** A small board with one or more relays (a switch moved by a magnet). The board's pin turns the magnet on and the switch clicks closed.
- **What Skynet needs:** **Coil:** 5 V boards for a Mega; for an ESP32 or Pi pick a board sold as **3.3 V trigger** or **High/Low trigger**. **Opto-isolated** is best. **Contacts:** 10 A at 250 V AC. Many are **On when the pin is LOW**: that is how the Skynet board program already drives every Port (On = LOW), so leave **Invert** Off. Only a board that switches On with HIGH needs **Invert** On in the Pin attributes ⬢.
- **How to wire it:** [Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)
- **Suggested parts:** 1, 2, 4 or 8 channel 5 V opto-isolated relay modules (SRD-05VDC type relays); DIN-rail relay modules
- **Where to buy:** *(link coming)* Search Amazon for "8 channel 5V relay module opto isolated".

### RTD

*PT100 or PT1000, with a MAX31865 Board.*

- **What it does:** The most accurate kind of temperature probe. The MAX31865 board reads it for the Arduino.
- **What Skynet needs:** One MAX31865 board per probe; its jumpers set for 2, 3 or 4 wires (3 is the start). SPI Ports (Mega D50-D52) and one CS Port (Rule 6.9). PT100 reference resistor 430 ohm, PT1000 4300 ohm.
- **How to wire it:** [Step by Step: Wire a PT100 Probe](213-step-by-step-wire-a-pt100-probe) and [Step by Step: Wire a PT1000 Probe](214-step-by-step-wire-a-pt1000-probe)
- **Suggested parts:** Adafruit MAX31865 board (or a clone); 3-wire PT100 probes with a 1/2" NPT fitting
- **Where to buy:** *(link coming)* Search Amazon for "MAX31865 PT100 board".

### Solenoid Valve

- **What it does:** A valve opened by an electric magnet. Snaps open or shut. Most need water pressure to work.
- **What Skynet needs:** **Normally closed**, 12 or 24 V DC, food grade (stainless) for wort, brass for cooling water. A Flyback Diode across the coil if it has none.
- **How to wire it:** [Step by Step: Wire a Water Solenoid Valve](218-step-by-step-wire-a-water-solenoid-valve)
- **Suggested parts:** Stainless or brass normally closed 12 V solenoid valves (1/2" NPT)
- **Where to buy:** *(link coming)* Search Amazon for "12V normally closed solenoid valve stainless".

### SPI

- **In plain words:** A four-wire way for boards to talk to the Arduino, faster than I2C. The boards share three wires; each gets its own fourth wire, the CS Port.
- **What Skynet needs:** Mega D50, D51, D52 (shared by every RTD and Thermocouple board); Pi GPIO 7-11.

### SSR

*Solid State Relay (Opto SSR).*

- **What it does:** An electronic switch with no moving parts. A small DC signal from the board turns a bigger AC (or DC) load On and Off, silently.
- **What Skynet needs:** **Input:** about 3 to 32 V DC (works from every Interface). **Output:** AC 24-380 V for AC loads ("DA" type: DC in, AC out), or DC for DC loads ("DD" type). **AMPS:** 5 or 10 A for a pump or heat pad; 25 or 40 A on a Heat Sink for an element. **Zero cross** type for elements.
- **How to wire it:** [Step by Step: Wire an SSR](211-step-by-step-wire-an-ssr)
- **Suggested parts:** Auber, Crydom or Omron SSRs (DA type for AC, DD type for DC). Avoid look-alike SSRs with no maker's name.
- **Where to buy:** *(link coming)* Search Amazon for "SSR 40A DA".

### Stepper Driver

- **What it does:** Feeds a stepper motor in small steps so it turns to an exact position.
- **What Skynet needs:** STEP and DIR pins (ENABLE optional), its own 12-24 V DC supply (never the Arduino's 5 V), set to the motor's current.
- **How to wire it:** [Step by Step: Wire a Stepper Motor](229-step-by-step-wire-a-stepper-motor)
- **Suggested parts:** TMC2209, A4988, DRV8825 (small motors); TB6600 or DM542 (NEMA 23)
- **Where to buy:** *(link coming)* Search Amazon for "TMC2209 stepper driver".

### Thermocouple

*With a MAX31855 or MAX31856 Board.*

- **What it does:** A probe for very hot places (a burner's flame, a flue). The board reads its tiny voltage.
- **What Skynet needs:** MAX31856 for any type (K, J, T ...) or MAX31855 for Type K only; one board per probe; SPI Ports and one CS Port. Thermocouple wire, + and - the right way round.
- **How to wire it:** [Step by Step: Wire a Thermocouple](221-step-by-step-wire-a-thermocouple)
- **Suggested parts:** Adafruit MAX31856 or MAX31855 boards; ceramic or Inconel Type K probes
- **Where to buy:** *(link coming)* Search Amazon for "MAX31856 thermocouple board".

### Thermocouple Gas Safety Valve

- **What it does:** A gas valve held open by a pilot flame heating a thermocouple. If the flame goes out, it shuts all gas by itself, with no power.
- **What Skynet needs:** **UL or CSA listed**, for LP, the right pressure (low-pressure VR8200 type, or high-pressure BASO H19 type) and BTU. Fitted by a licensed gas professional. Recommended (Rule 6.33).
- **Suggested parts:** Honeywell VR8200 type (low pressure); BASO H19 series (high pressure)
- **Where to buy:** *(link coming)* Search Amazon for "BASO H19 safety pilot valve".

### Thermowell

- **What it does:** A closed metal tube that sits in the liquid. The probe slides inside, so the probe can be taken out without draining.
- **What Skynet needs:** TC 1.5 (Tri-Clamp) or 1/2" NPT, stainless, long enough to reach the liquid (Short, Medium or Long), its inside wide enough for the probe (most take a 6 mm or 1/4" probe).
- **Suggested parts:** Stainless TC 1.5 thermowells; 1/2" NPT thermowells
- **Where to buy:** *(link coming)* Search Amazon for "tri clamp thermowell 1.5".

### Waterproof In Use Outlet

- **What it does:** An outdoor outlet with a cover that stays closed over a plug, so water can't get in.
- **What Skynet needs:** Rated for wet places ("in use" or "extra duty" cover), on a GFCI circuit, the outlet's AMPS matching the circuit.
- **Suggested parts:** Weatherproof in-use outlet covers with a GFCI outlet
- **Where to buy:** *(link coming)* Search Amazon for "in use weatherproof outlet cover".

### Zero Cross

- **In plain words:** An SSR that switches only when the AC wave passes zero volts, which is gentle on the element and makes no electrical noise.
- **What Skynet needs:** The normal SSR for elements switched by PID, Duty Cycle or Hysteresis. Not for fast PWM.
