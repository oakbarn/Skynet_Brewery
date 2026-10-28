# Importing Norms

The running list of every change an import must make so a BruControl Schema (.brucfg) comes into
Skynet the Skynet way. Fritz adds to it as things come up. Started 2026-10-28.

The **BruControl Schema Import** itself is not being written yet (Fritz, 2026-10-28). This list is
what it will follow when it is.

## The general Rule

**Importing always updates to the Skynet way.** When something old comes in (a BruControl Schema, or
an older Skynet Schema or Process), every attribute, name and line of Process code is changed to the
current Skynet word or style. Nothing is brought in the old way just because the old way still works.
(Fritz, 2026-10-28; Skynet Rules 15.1)

- If a line of Process code cannot be changed safely (the new line would not mean exactly the same),
  it is left as it was and listed in the import report, so it can be fixed by hand.
- Whatever BruControl has that Skynet does not use yet is kept in a hidden `bru` note on the item,
  so nothing is lost.

## Status words

- **Norm**: agreed with Fritz. Not built into the importer yet.
- **Built**: the current import code (lib/brucontrol.js, lib/modernize.js, lib/globals.js,
  lib/fold.js) already does it. It will be carried into the new importer.

## 1. Position attributes

Skynet Rules 1.15. (Fritz, 2026-10-28, thread "Add predictive text to the Process editor")

| Old | Skynet | Status |
| --- | --- | --- |
| `.xposition` / `.xPosition` (any capitals, and BruControl's `"Pump_1" xposition = 300` style) | `.x_hPosition` (h = horizontal) | Norm |
| `.yposition` / `.yPosition` (any capitals, and `"Pump_1" yposition = 120`) | `.y_vPosition` (v = vertical) | Norm |

Both the attribute on the Device or Widget **and** every Process line that uses it are rewritten:
`Pump_1.xPosition = 300` becomes `Pump_1.x_hPosition = 300`.

## 2. Visibility

(Fritz, 2026-10-23, PR #96; moved here from BRUCONTROL_IMPORT_RULES.md)

Every Device and Widget has two true / false attributes:

- `.visible`: shown or not. It also takes the words `visible` (= `true`) and `hidden` (= `false`), but only `.visible` does.
- `.hidden`: keeps the item hidden. Only `true` or `false`. `.hidden = true` takes precedence over `.visible = true`.

| BruControl | Skynet | Status |
| --- | --- | --- |
| `"my_Widget" visibility = visible` | `my_Widget.visible = true` | Built (Process lines) |
| `"my_Widget" visibility = hidden` | `my_Widget.visible = false` | Built (Process lines) |
| `"my_Widget" visibility = hiddenlocked` | `my_Widget.visible = false; my_Widget.hidden = true` | Built (Process lines) |
| Appearance `Visibility = Visible` | Visible switch on | Built |
| Appearance `Visibility = Hidden` | Visible switch off | Built |
| Appearance `Visibility = HiddenLocked` | Visible switch off **and** "Hidden, locked" switch on (`hidden: true`) | Norm (today only a `bru.visibility = "HiddenLocked"` note is kept) |

## 3. Words (Skynet Rules 1.1 to 1.14)

| BruControl | Skynet | Status |
| --- | --- | --- |
| Configuration / .brucfg | Schema ("BruControl Schema") | Built (on screen) |
| Workspace | Tab | Built |
| Script | Process | Built (on screen; the scripts/ folder keeps its name) |
| Element (on a workspace) | Device (has a PLC port) or Widget (app only); never "element" | Built |
| Interface | Interface (a board) | Built |
| `DisplayName` (Appearance) | Label | Built |
| `"tm_Mash" displayname = "Mash"` | `tm_Mash.label = "Mash"` | Built (Process lines) |

## 4. Process code in the Skynet style

The name alone is the item's main value; everything else is `name.attribute`.

| BruControl | Skynet | Status |
| --- | --- | --- |
| `"Kettle_SP" value = 185.5` | `Kettle_SP = 185.5` | Built |
| `if "Pump_Red" state == true` | `if Pump_Red == true` | Built |
| `"alm_Hops" active = true` | `alm_Hops = true` | Built |
| `wait "alm_Hops" active == false` | `wait alm_Hops == false` | Built |
| `"tm_Mash" type = countdown` | `tm_Mash.countdown = true` | Built |
| `"Name" anything = ...` | `Name.anything = ...` | Built |
| `start "X"` / `stop "X"` where Process X does not exist (BruControl skips it) | the line becomes a comment: `// skipped, no such Process in BruControl either: ...` | Built |

## 5. Names

| BruControl | Skynet | Status |
| --- | --- | --- |
| A name with spaces: `Test Timer` | `Test_Timer`; the old name becomes the Label so the screen looks the same; Processes follow | Built |
| The same name used twice | the second one gets `_2`, `_3` ... and a warning | Built |
| Names, all of them | follow the Skynet naming Rules (3.3, 3.4); each item gets its hidden key (Rule 3.10) | Norm |
| Device names | the Suggested Name `InterfaceID_Port_DeviceTypeID_Label__TabID` (Rule 3.1) is offered; a kept BruControl name gets the own-name warning (Rule 3.13) | To decide with Fritz when the importer starts |

## 6. Globals (BruControl's Global class is retired)

(Fritz, 2026-10-04, PR #12; lib/globals.js)

| BruControl Global | Skynet | Status |
| --- | --- | --- |
| `gbl...` | gKonstant of the same kind, same name | Built |
| `glb...` (typo) | renamed `gbl...`, then a gKonstant | Built |
| `RP_...` | gAPI, renamed `gA_...` everywhere (Schema and Processes; was `vA_...` before 2026-10-28) | Built |
| `DX_gblV_...` | gAPI, renamed `gA_...` | Built |
| `x...` | deleted; Processes and items still using one are listed with line numbers | Built |
| `insp_...` | deleted like `x` | Built |
| anything else | gAPI, same name, listed so it can be sorted later | Built |

## 6a. vKonstant and vAPI (older Skynet)

(Fritz, 2026-10-28; Skynet Rule 1.16, Help 84)

| Older Skynet | Skynet | Status |
| --- | --- | --- |
| vKonstant / vAPI (on screen, Help, docs) | gKonstant / gAPI | Built (on screen; the type inside Schema files stays `vKonstant` / `vAPI`) |
| A BruControl Global | gKonstant or gAPI (section 6) | Built |
| Names starting `vK..._` (`vKV_Strike`) | `gK..._` (`gKV_Strike`), on the item and in every Process; a taken name gets `_2` | Norm |
| Names starting `vA..._` (`vAV_Mash_Temp`) | `gA..._` (`gAV_Mash_Temp`), on the item and in every Process | Norm |
| API address `/api/vapi` | `/api/gapi` (the old address still works) | Built |

## 7. Alarms and stacked copies

(Fritz, 2026-10-05, PR #24; lib/fold.js)

| BruControl | Skynet | Status |
| --- | --- | --- |
| Alarm | gets a kind (Hop, Brew Flow, Pre-Hop, General, Sound only) guessed from its name | Built |
| Several copies stacked on one spot (`gblS_Brewery_Top_1`, `_2`, `_3`) because BruControl allows only 3 pictures each | folded into ONE item with all the pictures; Processes follow | Built |
| Stacked timers | never folded (long mash timer, short delay timer, sub-process timer are kept on purpose) | Built |
| Same-spot items with different names | not folded; listed so they can be sorted by hand | Built |

## 8. Devices

| BruControl | Skynet | Status |
| --- | --- | --- |
| Digital output named `VGC...` | Valve (two IP ends, flow either way when open) | Built |
| PWM output named `VGC...` | Proportional valve | Built |
| OneWire probe numbered by bus position | the probe has to be picked on the Devices page (Skynet uses each probe's ROM id) | Built (warning) |
| Port types Skynet does not have yet | skipped, with a warning | Built |

## 9. Pictures and sounds

| BruControl | Skynet | Status |
| --- | --- | --- |
| `C:\BruControl\Media\pump.png` | `media/Images/pump.png` | Built |
| `C:\BruControl\Media\wave\x.wav` (any sound) | `media/sounds/x.wav` | Built |
| The 3 background pictures | `imagePath_1`, `imagePath_2`, `imagePath_3`, all editable as in BruControl (Rule 7.10) | Built |
| A Tab's background picture | the Tab's picture, with its width and height | Built |

## Still to decide

- Fritz's open question (Skynet Rules, Open questions 10): keep the strict Process check on import, or
  allow a BruControl-style lenient start?

## Change log

- 2026-10-28: First version. General Rule (importing always updates to the Skynet way), position
  attributes, and everything from BRUCONTROL_IMPORT_RULES.md and the current import code.
- 2026-10-28: Globals now become gKonstant / gAPI (`RP_` -> `gA_`); added section 6a, vKonstant / vAPI -> gKonstant / gAPI. (thread "Rename vAPI and vKonstant to gAPI and gKonstant")
