# Process Attributes: Widgets

Every `.attribute` a Process can use on a **Widget**, grouped by Widget type. Widget types are in alphabetical order, and so are the
attributes under each one. Devices are in [Process Attributes: Devices](Process_Device_Attributes.md). The commands are in
[Standard Process Commands](Process_Standard_Commands.md) and [Skynet Process Commands](Process_Skynet_Commands.md).

Built from the code (lib/store.js `attrsOf` and server.js `processWords`, the lists the Process editor's 💡 Suggest and Insert bar
offer), 2026-11-21.

## How to read this list

- **The name alone is the main value.** `alm_Hops = On` is the same as `alm_Hops.state = On`. Each Widget type says what its main
  value is; "none" means the name alone means nothing.
- **R** = read only. A Process line that sets it stops with an error.
- **Upper and lower case do not matter.** **true / false** attributes also take `On` / `Off` (Rule 16.9).
- The **Semi_Widgets_Devices** (Switch, Push Button, Pulse Button, LED, Manual Valve Widget) are listed here, with the Widgets.

## Attributes every Widget has

All Widgets except the Manual Valve Widget, Pipes and Hoses (below) have these. The Text Widget has its own list.

| Attribute | Also written | What it does |
|---|---|---|
| `.alignment` | | Text placement in its box: Left, Center or Right. `""` puts back its Properties. |
| `.backcolor` | `.back` | Back color of its text box. A name (Red) or a code (#ffffff). |
| `.background` | | Which background picture shows: 1 = `.backpath`, 2 = `.backpath_2`, 3 = `.backpath_3`, 0 = none. |
| `.backpath` | | Background picture 1 (path). |
| `.backpath_2` | | Background picture 2 (path). |
| `.backpath_3` | | Background picture 3 (path). |
| `.enabled` | | Enabled (true) or not. |
| `.file` | | File name only of background picture 1 (Rule 7.23). On an Alarm or Audio Widget: its sound. |
| `.file_2` | | File name only of background picture 2. |
| `.file_3` | | File name only of background picture 3. |
| `.forecolor` | `.fore` | Text color. |
| `.height` | `.h` | Height in pixels. |
| `.hidden` | `.hiddenlock` | Hidden lock: true keeps it hidden even when `.visible` is true. |
| `.image` | | Shortcut: puts a picture in `.backpath` and sets `.background = 1`. |
| `.imageoff` | | Picture shown while Off. |
| `.imageon` | | Picture shown while On. |
| `.imageoverlay` | | Overlay picture shown while On (Layer 1). |
| `.label` | | The text shown on the Tab. Empty shows the Name. |
| `.layer` | | Layer Order: 1 is on top (Rule 1.29). |
| `.path` | | Whole path of background picture 1 (Rule 7.23). On an Alarm or Audio Widget: its sound. |
| `.path_2` | | Whole path of background picture 2. |
| `.path_3` | | Whole path of background picture 3. |
| `.precision` | | Decimal places shown. |
| `.units` | | Units text shown after the value. |
| `.visible` | | Shown (true) or not (false). Also takes `visible` / `hidden`. |
| `.width` | `.w` | Width in pixels. |
| `.x_hPosition` | `.x`, `.xh` | Place across the Tab, in pixels (Rule 1.15). |
| `.y_vPosition` | `.y`, `.yv` | Place down the Tab, in pixels (Rule 1.15). |

### Look attributes (work, but not on the Suggest list)

A Process can set these on any Widget (Help 22). 💡 Suggest does not offer them. Reading one before a Process has set it stops the
Process ("has no property"), except `.format` / `.showas`.

| Attribute | Also written | What it does |
|---|---|---|
| `.digits` | | How many digits the value shows, 1 to 12. |
| `.format` | `.showas` (time ones), `.numformat` (Value) | How the value shows. Timer, Time, DateTime and Code Value Widgets: a time format such as `"mm:ss"` (Rule 2.45). Value Widget: Fixed, Number, Percent, Scientific, Accounting, Financial, Currency, Currency rounded (Rule 1.23). |
| `.nameAlign` | | Where the Label sits: TopLeft, TopCenter ... BottomRight. |
| `.nameBg` | `.nameBackColor` | Back color of the Label. |
| `.nameColor` | `.nameForeColor` | Color of the Label. |
| `.valueAlign` | | Where the value sits: TopLeft ... BottomRight. |
| `.valueBg` | `.valueBackColor` | Back color of the value. |
| `.valueColor` | `.valueForeColor` | Color of the value. |
| `.valueType` | | LED, Text, Gauge, Dial or Bar. On / Off Widgets: LED or Text only. |

## Widgets, by type

### Alarm Widget (`alarm`: Brew Flow, Hop Drop, Pre-Hop Drop, User Alarm, Rule 7.21)

Main value: **`.state`**, On / Off (`.active` is the same). A Brew Flow Alarm set On holds its Process until tapped Off.

| Attribute | What it does |
|---|---|
| `.at` | Hop Alarm: sounds when its timer reaches this time. |
| `.before` | Pre-Hop Alarm: sounds this long before its Hop Alarm. |
| `.email` | true sends an Alarm Email (Rule 7.17). |
| `.fileindex` | Which of its sounds plays. |
| `.finished` | R. true once its sound has played to the end. |
| `.h` | Height (same as `.height`). |
| `.label_back` | Back color of its Label. |
| `.label_fore` | Color of its Label. |
| `.loop` | true repeats the sound; false plays it once. |
| `.path` | Its sound file. A path to a file, or none: with none, or one that can't play, it plays the Missing Alarm Sound (Rule 7.20). The older `.sound` still works. |
| `.playing` | R. true while its sound is the one playing. |
| `.playtime` | Pre-Hop and User Alarm: seconds it stays On; 0 = until tapped. |
| `.priority` | Priority, 0 to 99 with two decimals (Rule 7.18). |
| `.skynet_Layer_2` | Layer 2 picture (Set Graphic), by name or Skynet Picture number (the older `.setgraphic` still works). |
| `.state` | On / Off (the same as the name alone). |
| `.step` | Alarm Chain step it is on (Rule 7.16). |
| `.string` | Pre-Hop and User Alarm: the text it shows (Rich Text codes work). |
| `.w` | Width (same as `.width`). |
| `.waiting` | R. How many Alarm Chain steps wait their turn. |
| `.x` | Place across (same as `.x_hPosition`). |
| `.y` | Place down (same as `.y_vPosition`). |

Not settable: `.visible` follows On / Off (a Process can read it), and `.toggle` is a click only. On a Pre-Hop Alarm `.background`
picks one of its three Skynet watermarks (1, 2 or 3).

### Audio Widget (`soundPlayer`, was Sound Player, Rule 7.26)

Main value: **`.active`**, true plays, false stops.

| Attribute | What it does |
|---|---|
| `.loop` | true repeats the sound. |
| `.path` | Its sound file (`.path_audio` is the same). |
| `.path_image` | Its one picture. |
| `.play` | The same as the name alone: true plays, false stops. |
| `.playing` | R. true while it is the one playing. |

### Code Value Widget (`codeValueWidget`, Rule 1.27)

Main value: **`.value`**. Setting it from a Process does **not** run its Code. No attributes of its own beyond `.format`.

### DateTime Widget (`dateTimeWidget`, Rule 1.23)

Main value: **`.value`**, a date and time. No attributes of its own beyond `.format`.

### Graph Widget (`chart`, was Chart Widget, Rule 1.26)

Main value: none in use.

| Attribute | What it does |
|---|---|
| `.ch1autoscale` | Line 1: true scales itself. |
| `.ch1axiscolor` | Line 1: axis color. |
| `.ch1element` | Line 1: the Device or Widget it draws. |
| `.ch1linecolor` | Line 1: line color. |
| `.ch1ymax` | Line 1: top of the scale. |
| `.ch1ymin` | Line 1: bottom of the scale. |
| `.ch2autoscale` | Line 2: true scales itself. |
| `.ch2axiscolor` | Line 2: axis color. |
| `.ch2element` | Line 2: the Device or Widget it draws. |
| `.ch2linecolor` | Line 2: line color. |
| `.ch2ymax` | Line 2: top of the scale. |
| `.ch2ymin` | Line 2: bottom of the scale. |
| `.hgridlines` | How many level grid lines. |
| `.refreshinterval` | Seconds between redraws. |
| `.spanseconds` | How many seconds the graph shows (86400 = a day). |
| `.vgridlines` | How many upright grid lines. |
| `.xaxiscolor` | Time axis color. |

### Label (`label`)

Main value: none. Only the attributes every Widget has.

### LED (`led`, Semi_Widgets_Device)

Main value: **`.state`**, On / Off.

| Attribute | What it does |
|---|---|
| `.device_controlled` | R. The Device it follows (set in its Properties). |

### Manual Pump Widget (`manualPump`, Rule 1.28)

Main value: **`.state`**, On / Off. Setting it from a Process asks a person and waits for the confirm. No attributes of its own.

### Manual Valve Widget (incl. Tap Water Valve, Rule 5.33)

Main value: **`.state`**, true = open. Setting it asks a person and waits for the click. **It has no other attributes** (not even
`.visible`).

### Manual Vessel Widget (`manual`: plain, DigiBoil, Brewzilla 65 L, Rule 5.39)

Main value: none. Setting a hand-worked attribute shows a pop-up telling the brewer what to set, and waits for the confirm.

| Attribute | What it does |
|---|---|
| `.confirmed` | R. true once the brewer confirms. |
| `.heat` | Heater switch (Brewzilla: Heater 1). |
| `.heat2` | Brewzilla: Heater 2 switch. |
| `.heat3` | Brewzilla: Heater 3 switch. |
| `.message` | Text shown to the brewer. |
| `.power` | DigiBoil Power switch, or the Brewzilla screen's On/Off. |
| `.pump` | Pump switch. |
| `.reading` | A reading the brewer types in. |
| `.run` | Brewzilla: the Run button on its screen. |
| `.setpoint` | Temperature to set on it. |
| `.timer` | Time to set on it. |
| `.volume` | Volume. |
| `.waiting` | true while it waits for the brewer. |

### Picture / Graphic Widget (`picture`)

Main value: none. Only the attributes every Widget has.

### Pipe, Hose and IP point (Rule 5.21)

Main value: **`.flow_Color`**. These are the only attributes.

| Attribute | Also written | What it does |
|---|---|---|
| `.flow_Color` | `.flow` | Flow color: None, Tap, Strike, Mash, Boil, Whirlpool, Ferment, Red, Yellow, Blue, Green, Brown, Orange, Purple, Reddish_Brown, Golden, or `"RGB 160 69 42"`. |

### Process Widget (`processWidget`, Rule 1.31)

Main value: none. Only the attributes every Widget has. Start and stop its Process with `start` / `stop` on the Process itself.

### Pulse Button (`pulseButton`, Semi_Widgets_Device)

Main value: **`.state`**, one short pulse per tap.

| Attribute | What it does |
|---|---|
| `.device_controlled` | R. The Device it controls (set in its Properties). |

### Push Button (`pushButton`, Semi_Widgets_Device)

Main value: **`.state`**, On while held.

| Attribute | What it does |
|---|---|
| `.device_controlled` | R. The Device it controls (set in its Properties). |

### Quick Disconnect Hose (Rule 5.34)

Main value: none.

| Attribute | What it does |
|---|---|
| `.connect` | Where the hose goes: a QD or IP (`= QD_1`), a Vessel (`= Mash_Tun`), or `= none` (loose). |
| `.flow_Color` | As a Pipe (`.flow` is the same). |

### Switch (`switch`, Semi_Widgets_Device)

Main value: **`.state`**, On / Off.

| Attribute | What it does |
|---|---|
| `.device_controlled` | R. The Device it controls (set in its Properties). |

### Tab (the word `tab`, Rule 5.21)

`tab.flow_Color` is the Flow Color of the Tab each screen shows now. It is the only Tab attribute.

### Text Widget (`text`, "+ Text", Help 91)

Main value: **`.text`** (`.value` is the same). `""` puts any attribute back to its Properties.

| Attribute | What it does |
|---|---|
| `.alignment` | Left, Center or Right. |
| `.alignment_label` | Label: Left, Center or Right. |
| `.back_label` | Label back color. |
| `.backcolor` | Back color (`.back` is the same). |
| `.bold` | Text bold. |
| `.bold_label` | Label bold. |
| `.font` | Text font. |
| `.font_label` | Label font. |
| `.fore_label` | Label color. |
| `.forecolor` | Text color (`.fore` is the same). |
| `.height` | Height in pixels (`.h`). |
| `.hidden` | Hidden lock (`.hiddenlock`). |
| `.label` | Its Label. |
| `.label_visible` | Show the Label. |
| `.layer` | Layer Order. |
| `.lock` | R. Item Lock (set in Edit layout). |
| `.size` | Text size. |
| `.size_label` | Label size. |
| `.tab` | The Tab it is on. |
| `.text` | Its text (the main value). |
| `.visible` | Shown or not. |
| `.width` | Width in pixels (`.w`). |
| `.x_hPosition` | Place across (`.x`, `.xh`). |
| `.y_vPosition` | Place down (`.y`, `.yv`). |

### Time Widget (`timeWidget`, Rule 1.23)

Main value: **`.value`**, a time (hh:mm:ss). No attributes of its own beyond `.format`.

### Timer Widget (`timer`)

Main value: **`.value`**, its time. `start`, `stop` and `reset` work on it too.

| Attribute | What it does |
|---|---|
| `.countdown` | true counts down, false counts up. |
| `.resetvalue` | The time `reset` puts back. |
| `.running` | true runs it, false stops it. |

### Value Widget (`valueWidget`, Rule 1.23)

Main value: **`.value`**, a number. Can be set to NULL (Rule 1.32). No attributes of its own beyond `.format`.

## Not Widgets, but used the same way

### gGlobals (Rule 1.19)

Main value: **`.value`**. The Suggest list also offers the attributes every Widget has (see Review Notes).

| Attribute | On which Kind | What it does |
|---|---|---|
| `.file` | Long String | Its text file. |
| `.file` / `.path` | Graphic | Its picture's file name / whole path. |
| `.minute` | Time (gT_) | The time in whole minutes; setting 5 makes 00:05:00 (Rule 1.30). |
| `.seconds` | Time (gT_) | The time in whole seconds; setting 126 makes 00:02:06. `.minutes` and `.second` work too. |

### A Process

| Attribute | What it does |
|---|---|
| `.running` | R. true while that Process runs. Use `start` / `stop` to change it. |

---

## Analyst's Review Notes

- **gGlobals offer Tab attributes:** 💡 Suggest lists `.x_hPosition`, `.width`, `.backpath`, `.forecolor` and the rest on a gGlobal,
  but a gGlobal is not on a Tab ("not a Widget and does not sit on a Tab", public/gkinds.js). Most of these do nothing on it. Worth
  trimming the list to `.value`, `.label`, `.precision` and the Kind's own ones? Your call.
- **Look attributes are hidden:** `.nameColor`, `.valueType`, `.format` and the rest work (Help 22) but are not on the Suggest list or
  the Insert bar, and reading one before it is set stops the Process. A novice picking from lists will never find them.
- **Rule 1.21 vs the code:** the Text Widget is the only item with `.font`, `.bold`, `.label_visible`, `.lock`, `.tab` ... (see the
  Device list's notes).
- **Manual Vessel Widget:** a plain one and a DigiBoil are offered `.heat2`, `.heat3` and `.run`, which only a Brewzilla has.
- **Vessel Widgets** have no Process attributes today. `.capacity` and `.currentVolume` (agreed 2026-11-20) are not built yet.
- **Override button** Widgets have no Process attributes: `show_Override` / `hide_Override` are commands (Skynet list).
- **Graph Widget main value:** the code gives it `.value` as its main value, but nothing uses it. I wrote "none in use".
- Confidence: **High** for which attributes exist (pulled from the running code for each type); **Medium** for a few descriptions
  taken from code comments (Alarm `.fileindex`; Manual Vessel `.reading`, `.volume`).
