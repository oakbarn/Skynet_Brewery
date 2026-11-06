<!-- MIT License Granted. Copyright (c) OakBarn Brewery 2026 -->
# The old BruControl import method (for reference)

Fritz, 2026-11-06: "I want to build the import step by step so for now, put what you did in an MD to refer to ... but start a
new import function and we will build it."

This page describes the **old import method**: the code that has turned a BruControl config file (`.brucfg`) into Skynet items
since 2026-10-04. It is kept so we can look things up while the **new import function** (`lib/bruimport.js`, Rule 15.4) is
built one step at a time. The new function does **not** use the old method. Each step of the new one is decided with Fritz,
and this page shows how the old method did that part, as a starting point.

The old method is still in the Panel: the older **Import BruControl** page (`/ui/import/brucontrol`) and the BruControl
samples use it. It is not changed.

## Where it is

| Part | File (computer term) |
|---|---|
| Reading the XML and converting everything | `lib/brucontrol.js`, `convertBruControl(xml, opts)` |
| Putting the result into the running Panel | `lib/brucontrol.js`, `applyBruControl(conv, ...)` |
| BruControl Globals become gGlobals | `lib/globals.js`, `retireGlobals` |
| Alarm kinds, folding stacked look-alikes | `lib/fold.js`, `importAlarms`, `foldStacked` |
| Rewriting Process lines in the Skynet style | `lib/modernize.js`, `modernize`, `spaceRenames` |
| Tests | `test/brucontrol.test.js` |

## What a BruControl config file holds

One XML file with `<Configuration>` at the top:

- `Devices/Device`: the boards (Skynet **Interfaces**). Each has `Name`, `Interface` (USB serial or network), `SerialPort`,
  `BaudRate`, `Address`, `Port`, `TypeName` (Mega, ESP32 ...), `Enabled`, and its `Ports/DevicePort` list.
- `DevicePort` (the pins): `ID`, `Number` (the pin), `Enabled`, and a kind in `i:type` (DigitalOutPort, AnalogInPort ...).
- `Workspaces/Workspace`: the screens (Skynet **Tabs**). Each has `Name`, `Hidden`, a `BackgroundImagePath` and its
  `Elements/Element` list.
- `Element`: an item on a workspace. Its kind is in `i:type` (DeviceElement, GlobalVariableElement, TimerElement ...). It has
  `Name`, `DisplayName`, `X`, `Y`, `Width`, `Height`, `Appearance` (colors, fonts, pictures, visibility) and, for a
  DeviceElement, the `PortID` of the pin it uses.
- `Processes/Process`: the scripts (Skynet **Processes**): `Name`, `Script` (the text), `AutoStart`, `UserControl`.

Fritz's file has 3 boards, 17 workspaces, 911 elements and 175 scripts.

## How the old method converted each part

### 1. Boards become Interfaces
- A network board (`Interface` says TCP, network, Ethernet or WiFi) becomes an ESP32 Interface with the `Address` and `Port`.
- Any other board becomes a USB serial Interface: `SerialPort` (a bare number gets `COM` before it) and `BaudRate` (115200 if blank).
- `TypeName` with "esp" is an ESP32 and with "mega" a Mega. Anything else is "other".
- Every BruControl setting with no Skynet place (wiring map, refresh interval, logging ...) was kept under `.bru`.

### 2. Pins (DevicePorts) by kind
| BruControl port | Skynet Device type |
|---|---|
| DigitalOutPort | digitalOut (one-shot and dual-throw settings kept) |
| DigitalInPort | digitalIn |
| AnalogInPort, CounterInPort | analogIn (average weight, poll rate) |
| OWTempPort, SPISensorPort | temperature (sensor index; the probe is picked later on the Devices page) |
| PWMOutPort | pwmOut |
| DutyCyclePort | dutyCycle (duty cycle, interval) |
| HysteresisPort | hysteresis (input sensor, target, on offset, on delay, predictive) |
| PIDPort | pid (input, target, Kp, Ki, Kd, max output, max integral, times, reversed, PWM) |
| DeadbandPort | deadband (BruControl's 0-255 output changed to %, Rule 6.17) |

Calibration points, precision, prefix and suffix (units) were read from `CalValue` or `Temperature`.
A name that starts with `VGC` made a digital output a **valve** and a PWM output a **proportional valve** (Fritz's own way of naming valves).

### 3. Elements by kind
| BruControl element | Old Skynet item |
|---|---|
| DeviceElement | the Device of its pin (table above); skipped when its pin was not in the file |
| GlobalVariableElement | a gGlobal (value, string, time, date, true/false), by its name (see 6) |
| ToggleSwitchElement | a switch |
| TimerElement | a timer (count up or down, reset value, start value, alarms kept under `.bru`) |
| AlarmElement | an alarm (loop, up to 3 sounds, on/off pictures, its output, email) |
| ScriptElement | a picture that shows a script's variable (tap starts the script when UserControl is on) |
| anything else | skipped, with a note |

### 4. How each item looked
- `DisplayName` became the **Label**.
- Visibility: Hidden stayed hidden, and HiddenLocked was noted.
- Name hidden, border, name and value colors, fonts, value size and alignment were kept.
- Up to 3 background pictures became `.backpath`, `.backpath_2` and `.backpath_3` (Fritz, 2026-11-02). Picture paths were moved into the media folder `Images`.
- Gauges: a digital gauge became an LED or LCD look and a state indicator an indicator look. Other gauge settings were kept under `.bru` (Skynet gauges are not built yet).
- True text and false text became the On and Off text. UserControl off made the item not tappable.

### 5. Workspaces became Tabs
- They kept the same name, and Hidden was kept.
- The background picture was kept, with its size. The new function leaves backgrounds out for now (Fritz, 2026-11-06).
- The Tab was sized to fit its items, at least 800 x 600.

### 6. Clean-ups after converting
1. **Same name twice**: the second one got `_2`.
2. **Globals** (`lib/globals.js`):
   - `gbl...` kept its name.
   - `RP_` and `DX_gblV_` became `gG_`.
   - `glb` (a typo) became `gbl`.
   - `x...` and `insp_...` were deleted.
3. **Alarms** got a kind (Hop, Brew Flow, Pre-Hop, General, Sound only) from their names (`lib/fold.js`).
4. **Stacked look-alikes** were folded into one item with all their pictures (`gblS_Brewery_Top_1, _2, _3`). Timers were never folded.
5. **Spaces in names** became `_`, and the old name stayed as the Label.
6. **Process lines** were rewritten in the Skynet style when the new line means exactly the same (`lib/modernize.js`). For example, `"Kettle_SP" value = 185.5` became `Kettle_SP = 185.5`.
7. A **start/stop line** that named a Process not in the file became a comment (BruControl skipped those lines quietly).
8. A list of notes for the import report.

### 7. Putting it in the Panel (`applyBruControl`)
- **Replace**: the file became the whole layout. Pipes and pictures on Tabs that were kept stayed.
- **Merge**: items with the same name were updated and new ones were added.
- Processes were written into the shared Processes folder, then every Process was checked against the new items. 69 of Fritz's 175 did not pass the Panel's strict check (Open question 10).

## What the old method did not do
- It asked the brewer **no questions**, so every item kept a guessed Skynet type.
- **Names were not changed to the Skynet convention** (Rule 3.1). They kept their BruControl names, with spaces made `_`.
- No Import Copy was made. It read the uploaded file directly.
- No Skynet Templates (Vessels, Valve Standard, RIMS ...) were used.

## The new import function, step by step
`lib/bruimport.js`, started 2026-11-06. Steps done so far are in Rule 15.4 and Help 143:
1. **Import Copy**: the config file is copied to `Brewing\Import\BruControl` and only the copy is read.
2. **Interfaces**: the boards.
3. **Tabs**: the workspaces, without backgrounds.
4. **Items on a board port**: only the elements that have an Interface and a Port. Each is named the Skynet way (Rule 3.1), or keeps its BruControl name after two warnings (Rule 15.1). The DisplayName becomes the Label; a blank one gives Label = Name, with the Label not shown on the Tab.
5. **Placeholders**: everything else on a Tab is a Placeholder, where BruControl had it, until a later step brings it in.
6. **Pictures and Sounds**: their paths are imported and the files stay where they were, so BruControl keeps working.
   As an option they are copied (never moved) into `media/Images/User` and `media/sounds/User`, for a move to a Pi or
   another computer. (The old method rewrote the paths to `Images` and left the copying to the brewer, with File Move.)

Next steps are decided with Fritz.

### Later: Globals (postponed, Fritz 2026-11-06)
"We will work on the global import later as it is very involved. We can look at how it was used in BruControl and make
some educated guess, but will need confirmation from a User. For example, a global that was hiddenlocked was probably only
a variable with global scope." So when this step is built, the Importer looks at how each BruControl Global was used
(hidden or locked, shown on a Workspace, used in which Scripts), makes an educated guess at the Skynet kind, and asks the
brewer to confirm it. Until then every Global is a Placeholder. (The old method's Global rules are in section 6 above, for reference.)
