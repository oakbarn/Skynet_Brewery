# Glossary

Every special word in Skynet, from A to Z. Pick a letter to jump to it, or type the word in the Help **Search** box.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w)

## A

**Admin, Operator, Viewer**: the three user roles. See [Login](10-login).

**Alarm**: a Widget that plays a sound file: Hop, Brew Flow, Pre-Hop, General or Sound only. Only one sound plays at a time, by priority. In a Process: `alm_Name = true`. See [Alarms and sound](21-alarms-and-sound).

**Analog output**: a Device that sends a steady signal (0-10 V or 4-20 mA) to set something part way, such as a pump's speed. See [PWM and Analog out Device Properties](136-pwm-and-analog-out-device-properties).

**API**: the way other programs (Node-RED, Home Assistant) read and set values. See [API](11-api).

## B

**Background (of a tab)**: the picture and color behind everything on a tab. Set in **⚙ Tab settings** with Edit layout on. See [Tab background picture and color](26-tab-background).

**.backpath, .backpath_2, .backpath_3**: the three background picture paths of an item (they were imagePath_1, _2, _3). `background = 1, 2 or 3` picks one; 0, blank or over 3 shows none; `name.image = "path"` changes .backpath. See [Pictures on items](25-picture-paths).

**BeerXML**: the recipe file BeerSmith exports. See [Import](08-import).

**Boil Profile**: the total boil time and the boil off per hour.

**Boolean Widget**: a Widget that is only On or Off: a Switch, Slider, Checkbox, Lighted Button, Push Button, Pulse Button or LED. With a **Linked Device** picked, it acts like a **Clone** of that Device. See [Semi Widgets Devices](112-semi-widgets-devices).

**Brain**: the main computer that runs Skynet: a Raspberry Pi 4 or newer, or a Windows, Linux or Mac computer (a mini PC, desktop or laptop). It keeps every text, picture and Schema file and every saved value, so the panel can be reached from any browser. The boards (**Interfaces**) connect to it by USB or Ethernet. See [Move the Brain](119-move-brain).

**Brewhouse Efficiency**: how much of the sugar in the grain really ends up in the fermenter, as a %. Skynet records it for each brew on the **Equipment Profile** and shows the average of the last 10 brews on that Schema. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Build Tab (🔨)**: the clean Tab where every new Device, Widget or copy of a Template is made first. **✅ Finish Build ...** moves it to its Tab. An unfinished Build is kept on the Brain until you finish it or discard it. See [Build Tab](55-build-tab).

**Bundle**: a vessel locked together with its IPs so they move as one and can't be edited until you switch **Bundled** off. See [Equipment](14-equipment).

## C

**Clone**: the same Device shown on another Tab. It is not a copy: tapping the Clone is tapping the Device it came from. See [Cloned Devices](71-cloned-devices).

**Color selector**: every color setting is the same dropdown. **Default** (first) keeps the item's normal color, **None** (second) means no color at all (see-through), then colors by name with a swatch, and **Custom (add new) ...** for any other color: it pops up the **Color Picker** (Help 187), and the color is kept in the list for next time. A color of your own shows a **Color (RGB)** line just below, for example 250,250,250; double-click it to bring up the Color Picker again.

**Confirmation Widget**: stands for something done **by hand**, with no board to turn it on: a Manual Valve, a Manual Pump, or moving a QD Hose. When it is turned On or Off, Skynet asks you to do it and confirm it is done. See [Confirmation Widgets](162-confirmation-widgets).

## D

**Deadband**: a heating method that steps its output % up or down toward the **Setpoint**, gentler and slower than a PID. See [Deadband Device](126-deadband-device).

**Default Layout**: the vessels, fittings, IPs, pipes and hoses of one Tab, stored in that Tab's Equipment Profile. The Tab follows it, or keeps its own layout.

**Default settings**: what a **new** thing starts with. Found in **☰ Menu > Default settings**. See [Default settings](155-default-settings).

**Device**: a thing tied to a port or pin on a board, such as a pump relay or a probe. See [Devices](03-devices).

**Direct**: a heating method: the heater is fully On or fully Off. See [One Heating Element, pick how it heats](150-heating-method).

**Duty Cycle**: a heating method: the heater is On for a % of each cycle (for example 60 % for a rolling boil). See [One Heating Element, pick how it heats](150-heating-method).

## E

**Edit layout**: the mode where an Admin changes the Tabs: adds, moves and sets up Devices and Widgets. It is the first choice of the **☰ Menu**. See [Edit layout bar](82-edit-layout-bar).

**Element**: a word Skynet does not use: a thing on a Tab is a **Device** (tied to a port on a board) or a **Widget** (app only). The one exception is a *heating element*, the real part in a kettle.

**Equipment Profile**: the losses, vessels and piping on one Tab of a brewery (for example the Hot Side, or Fermentation), made on the Equipment Profile tab of the ☰ Menu. Each Tab can have its own. Any Schema can use any profile on one of its Tabs: unique to one Tab, or shared by several Schemas. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

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

**IP (Initial Point)**: a small round marker where a flow starts or ends (a pump outlet, a vessel port, a drain). Pipes start and end on IPs. IPs only show in Edit layout, as a white circle inside a colored ring.

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

**Menu Bar**: the top line of the page: the panel name, the Schema dropdown, Tabs, Processes and so on. See [The Menu Bar](40-menu-bar).

**Menu tab**: a page opened from the ☰ Menu (Default settings, Equipment Profile, Mash Profile, Boil Profile, the other profiles and Templates). It shows next to the screen tabs, with a ✕ to close it, and has an Order number.

## N

**Name**: the one name of an item that Processes use, for a Device: Interface ID _ Port _ Type _ Label _ Tab ID. Only letters, numbers and _ ~ @. Once saved it changes only with **✏ Change name**. See [Interface, Tab and Device names](46-interface-tab-device-names).

**NULL**: the empty value: no value at all, not 0 or blank text. `X = NULL` empties it. See [Process language and steps](22-process-language).

## O

**Offset**: how far from the **Setpoint** a heater turns On again in **Hysteresis**: On point = Setpoint + Offset. Heating uses a minus Offset (−1: On at 149 °F for 150 °F), cooling a plus one. See [One Heating Element, pick how it heats](150-heating-method).

**Override button**: one press and every running Process moves past the wait or sleep it is stuck in. Manual valves still wait for their click. See [Override button](96-override-button).

## P

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

**Raspberry Pi**: a small computer that can be the **Brain**: it runs the panel and keeps all its files.

**Recipe**: the grains, hops, yeast and steps of one beer, typed in or brought in from BeerSmith. See [The Recipe tab](99-recipe-tab).

## S

**Schema**: one whole brewery setup (tabs, Devices, Widgets, pipes, settings and the Equipment Profile of each Tab), kept in its own file in the `config` folder and picked from the Schema dropdown at the top. Other programs call it a setup or configuration. The samples are ready-made Schemas. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Semi_Widgets_Devices**: things that live only in the app like a Widget, but are On or Off like a Device: the Manual Valve Widget and the **Boolean Widgets**. See [Semi Widgets Devices](112-semi-widgets-devices).

**Service**: what a valve carries: Gas, Room Temperature Liquid, or High Temperature Liquid (Stainless Steel). A gas valve can be a vessel's heat source.

**Setpoint**: the temperature (or other reading) a control holds, such as 150 °F for the HLT. See [One Heating Element, pick how it heats](150-heating-method).

**Shared variable**: an old class that is gone; use a gGlobal instead. An older Schema that still has one loads without it: see [Shared variables became gGlobals](149-shared-variables-became-gglobals).

**Simulation mode**: every board is replaced by the simulator and time can run faster or skip ahead, to try a brew day without touching hardware. See [Simulation mode](20-simulation).

**Simulator**: a pretend board, so you can try everything without hardware.

**skc_ (Skynet Constants)**: fixed numbers built into Skynet for common conversions, such as `skc_Kg_To_Lb`. Nobody can change them. See [Skynet Constants](94-skynet-constants).

**skn_, sk_**: `skn_` names are values Skynet sets and a Process only reads, such as `skn_Boil_Temp`. `sk_` names are roles that hold one temperature probe, such as `sk_Boil_Probe_1`.

**Sound Player**: a Widget that plays one sound file (`play SoundPlayer`, `stop SoundPlayer`). It pauses while any alarm sounds.

**Step**: a `step "name"` line in a Process. Steps are numbered by themselves (1.00000, 1.00001 ...). See [Process language and steps](22-process-language).

**Step by Step**: Help pages that show every step with pictures. They are listed first in the Help. See [Step by Step: Add a Schema](188-step-by-step-add-a-schema).

**Suggested Name**: the Name Skynet fills in for a new item from its parts. You may change it before you save.

**SVG**: a picture format that stays sharp at any size. The panel makes SVG copies of your PNG and JPG pictures.

## T

**Tab**: one brewery screen.

**Tab ID**: the short ID (like `SP`) that ends the names of new Devices on a tab; it follows Rule 3.2. See [Interface, Tab and Device names](46-interface-tab-device-names).

**Tab Profile**: a tab's background color and the look (colors, placement, LED / Text / Gauge) new devices and widgets on it start with. See [Tab and Valve Profiles](36-tab-and-valve-profiles).

**Tab_Vessel, Tab_Fitting**: the copy of a Template on a Tab. Not a Device and not a Widget, but it can hold both. Fully editable. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

**Tailscale**: a free private network between your own devices, for using the panel away from home safely. See [Installing Tailscale on Windows](00-tailscale-windows).

**Template**: a ready-made vessel (Vessel Template) or set of up to four fittings (Bundled Fitting Template), kept in a library. Skynet Templates come with the panel and are only cloned; User Bundled Templates are your own. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

## U

**Universal Properties**: the Properties every Device and Widget has: Name, Label, Position, Size, Layer Order, Visible, Lock and the hidden key. See [Universal Properties](114-universal-properties).

## V

**Value Widget**: a Widget that shows one number on a Tab; a tap sets it and every Process can read it. There are Time and DateTime Widgets too. See [Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets).

**Valve Profile**: the graphics and orientation (Horizontal, Vertical, 45 degrees Left or Right) a new valve starts with, picked only when the valve is made.

**Vessel Device**: a vessel with its Heating Elements and Temperature probe built into it, made with the **Vessel Device Builder**. See [Build a Vessel Device step by step](166-vessel-device-builder).

**Vessel Widget**: a vessel drawn on a Tab, with a spot for each IP a brew vessel can have. See [Vessel Widget](133-vessel-widget).

## W

**Widget**: an item that lives only in the app, not tied to any board (pictures, labels, timers, IPs, fittings).
