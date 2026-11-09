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
| A blank `DisplayName` (BruControl showed the Element Name) | the Label is the BruControl Name and is not shown on the Tab (`.label_visible = false`); the item itself stays visible (Fritz, 2026-11-06) | Not built yet (Importer) |
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
| A name with `< > : " / \ \| ? *` in it: `Pump:1` | `Pump~1` (each one becomes `~`, `_2` if taken); the old name becomes the Label; Processes follow (Rule 3.4) | Built |
| The same name used twice | the second one gets `_2`, `_3` ... and a warning | Built |
| Names, all of them | follow the Skynet naming Rules (3.3, 3.4); each item gets its hidden key (Rule 3.10) | Norm |
| Device names | the Skynet name `InterfaceID_Port_DeviceTypeID_Label_TabID` (Rule 3.1) by default. The user may keep the BruControl names only after "Do you really want to keep your BruControl names?" (why not; No is the default) and a last chance to back out (Rule 15.1, Fritz 2026-11-06). Rule 3.4 characters and spaces are still changed | Decided, not built yet (Importer) |

## 6. Globals (BruControl's Global class is retired)

(Fritz, 2026-10-04, PR #12; lib/globals.js)

| BruControl Global | Skynet | Status |
| --- | --- | --- |
| `gbl...` | gGlobal of the same kind, same name, .API Off | Built |
| `glb...` (typo) | renamed `gbl...`, then a gGlobal | Built |
| `RP_...` | gGlobal, renamed `gG_...` everywhere (Schema and Processes), .API Get and Put, its database setting kept (was `gA_...` before 2026-10-30) | Built |
| `DX_gblV_...` | gGlobal, renamed `gG_...`, .API Get and Put | Built |
| `x...` | deleted; Processes and items still using one are listed with line numbers | Built |
| `insp_...` | deleted like `x` | Built |
| anything else | gGlobal, same name, .API Get and Put, listed so it can be sorted later | Built |

## 6a. vKonstant and vAPI (older Skynet)

(Fritz, 2026-10-28; Skynet Rule 1.16, Help 84)

| Older Skynet | Skynet | Status |
| --- | --- | --- |
| vKonstant / vAPI (on screen, Help, docs and the type in Schema files) | gGlobal (section 6b) | Built |
| A BruControl Global | gGlobal (section 6) | Built |
| Names starting `vK..._` (`vKV_Strike`) | `gG..._` (`gGV_Strike`), on the item, in every Process, saved values and the database; a taken name gets `_2` | Built (when the Brain starts or the Schema loads) |
| Names starting `vA..._` (`vAV_Mash_Temp`) | `gG..._` (`gGV_Mash_Temp`), the same way | Built |
| API address `/api/vapi` | `/api/items` (section 6b) | Built |

## 6b. gKonstant and gAPI become gGlobal

(Fritz, 2026-10-30; Skynet Rules 1.16 and 6.14, Help 98)

| Older Skynet | Skynet | Status |
| --- | --- | --- |
| gKonstant / gAPI (type in Schema files, on screen, Help, docs) | gGlobal | Built |
| Names starting `gK..._` / `gA..._` (`gKV_Strike`, `gAS_Note`) | `gG..._` (`gGV_Strike`, `gGS_Note`) through the hidden-key rename (Processes, saved values, other items, BeerXML mapping, database follow); a taken name gets `_2` | Built (when the Brain starts or the Schema loads) |
| A gAPI's database trigger (`log`) | its **Database** setting (`database`), with .API Get and Put | Built |
| A gKonstant | Database Off, .API Off | Built |
| `log Name` in a Process | `send_db Name` (a `log` line left in a Process is an error that says so) | Built |
| API addresses `/api/gapi`, `/api/globals` | `/api/items` (the old ones are gone, Rule 15.2) | Built |
| Old files | kept as `.before-gglobal.bak` | Built |

## 6c. BruControl Globals by Kind, and what goes on the Tab

(Fritz, 2026-11-02, thread "Add gGlobal Kinds and BruControl import"; Skynet Rule 1.19, Help 108)

**What a Global was, and what a gGlobal is.** In BruControl a Global was simply a variable with a global scope that any
script could use. It was also the API, and it could be put on a Workspace. Fritz used them to copy things like the Mash
Temperature probe so he could build a CSV export, and as Text or Graphic widgets to show something on the Workspace. In
Skynet none of that needs a Global: **any Device or Widget can be an API** (its Database and .API box, Rule 6.14). A
**gGlobal is a variable**: it is **never on a Tab**, and its properties and attributes are only those of a variable; only
its scope (global) is different.

**Globals need the most work when importing**, because how each one was used (something useful on a screen, or only an API
variable) is up to the brewer who built the config. **The import asks the user** whenever it can't tell.

### The Kind comes from the BruControl Global's Type

| BruControl Global Type | Skynet gGlobal Kind | Status |
| --- | --- | --- |
| Time | **gT_Global_Time** | Built (the kind follows the type, lib/globals.js) |
| DateTime | **gD_Global_DateTime** | Built |
| Value | **gV_Global_Value** | Built |
| Boolean | **gB_Global_Boolean** | Built |
| String, no Background picture, just text in the Value | **gS_Global_String** | Built (a String becomes a String) |
| String with a Background picture and a blank Value | **gG_Global_Graphic** (the picture paths go to its .backpath, .backpath_2, .backpath_3) | Norm (waits for the importer go) |
| String with a Background picture **and** some text in the Value | **ask the user**: gS_Global_String or gG_Global_Graphic | Norm |

The name rules of section 6 (`gbl`, `RP_`, `x` ...) still apply to the Name.

### What goes on the Tab in its place

A gGlobal is not on a Tab. When the BruControl Global **was on a Workspace**, a Widget takes its spot on the Tab (same
place and size), and the Widget shows the gGlobal:

| BruControl Global on a Workspace | On the Skynet Tab | Status |
| --- | --- | --- |
| gS_Global_String kind (text) | a **Text Widget** | Norm |
| gG_Global_Graphic kind, used to show a background picture | a **Graphic (Picture) Widget** | Norm |
| gV_Global_Value kind, used to show a value. The most used case, often only there to have the API or as a global variable | a **Value Widget** | Norm (no Value Widget yet) |
| gT_Global_Time kind, used to show a time. Often only there for the API or as a global variable | **the user decides**: a **Time Widget**, or only a gGlobal of Kind Time | Norm (no Time Widget yet) |
| gD_Global_DateTime kind | a **DateTime Widget**, or only a gGlobal of Kind DateTime (the user decides, like Time) | Norm (no DateTime Widget yet) |
| A Global that was only an API variable (not shown) | only the gGlobal; if the API mattered, its .API is set, or the user points the API at the Device it copied | Norm |

**User input needed** when importing Globals from BruControl: for each Global that was on a Workspace, or a String with a
picture and text, the import shows the choices above, with the recommended one picked.

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
| Digital output with a Dual Throw port (DualThrowPortNum, DualThrowDelay) | Dual Throw second Port and delay (Rule 6.22) | Built |
| Port types Skynet does not have yet | skipped, with a warning | Built |

## 9. Pictures and sounds

| BruControl | Skynet | Status |
| --- | --- | --- |
| `C:\BruControl\Media\pump.png` | `media/Images/pump.png` | Built |
| `C:\BruControl\Media\wave\x.wav` (any sound) | `media/sounds/x.wav` | Built |
| The 3 background pictures | `.backpath`, `.backpath_2`, `.backpath_3`, all editable; `.background` 1-3 picks one, 0 / blank / over 3 = none (Rule 7.10). A Process line with `imagepath_1` becomes `.backpath` | Built |
| A Tab's background picture | the Tab's picture, with its width and height | Built |

## 10. Recipes (BeerSmith .bsmx and BeerXML)

- A **.bsmx** file (BeerSmith 3 and 4) and a **BeerXML .xml** file both become the Skynet Recipe (☰ Menu > Recipe, Rule 17.3).
- **No limit**: every grain, hop, yeast, Misc item (Skynet calls them Adjuncts), water and mash step comes in. The BruControl
  way stopped at 8 hops and left out the grains, yeasts and other items.
- **Units**: inside a .bsmx BeerSmith keeps ounces (grains, hops), fluid ounces (volumes) and °F. A Misc item keeps its own
  unit (BeerSmith's number in `F_M_UNITS`: 0 mg, 1 g, 2 oz, 3 lb, 4 kg, 5 ml, 6 tsp, 7 tbsp, 8 cup, 9 pt, 10 qt, 11 l, 12 gal,
  13 items), or a text `AMOUNT_UNITS` when the file has one. BeerXML is in kg, L and °C. Skynet keeps every Recipe in kg, L
  and °C.
- **Hop use**: BeerSmith's `F_H_USE` 0 Boil, 1 Dry Hop (days in `F_H_DRY_HOP_TIME`), 2 Mash, 3 First Wort, 4 Aroma becomes
  Whirlpool. BeerXML Aroma also becomes Whirlpool; its dry hop TIME is minutes and becomes days.
- **Global mapping** (gblV_Hop1_Oz_R1 ...): kept for a BeerXML file only when Settings > BeerXML mapping names Globals.
- The boxes on the Recipe tab start filled in, as **Calculate** does.

## Still to decide

- Fritz's open question (Skynet Rules, Open questions 10): keep the strict Process check on import, or
  allow a BruControl-style lenient start?

## Change log

- 2026-10-28: First version. General Rule (importing always updates to the Skynet way), position
  attributes, and everything from BRUCONTROL_IMPORT_RULES.md and the current import code.
- 2026-10-28: Globals now become gKonstant / gAPI (`RP_` -> `gA_`); added section 6a, vKonstant / vAPI -> gKonstant / gAPI. (thread "Rename vAPI and vKonstant to gAPI and gKonstant")
- 2026-10-28: Section 6a built: older vK_ / vA_ names renamed, types changed in the files, no old words kept (Rule 15.2).
- 2026-10-29: Section 5: names with `< > : " / \ \| ? *` get a `~` for each (Rule 3.4, Rule 15.2). (thread "Block unsafe characters in Device names")
- 2026-10-30: Section 6 Globals now become gGlobal (`RP_` -> `gG_`); added section 6b, gKonstant / gAPI -> gGlobal, `log` -> `send_db`, `/api/gapi` -> `/api/items`. (thread "Send any Device or Widget to a database")
- 2026-10-31: Added section 10, Recipes: .bsmx and BeerXML, no limits, units, hop use. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-11-02: Section 6c: BruControl Globals go to the gGlobal Kind of their Type (a String with a picture becomes gG_Global_Graphic, or the user is asked); a gGlobal is never on a Tab, so a Text, Picture, Value, Time or DateTime Widget takes the Global's spot; user input needed. (thread "Add gGlobal Kinds and BruControl import")
- 2026-11-02: The 3 background pictures are .backpath, .backpath_2, .backpath_3 (Rule 7.10). (thread "Rename image paths to backpath")
- 2026-11-09: Section 8: BruControl Dual Throw (DualThrowPortNum, DualThrowDelay) is kept as the Skynet Dual Throw (Rule 6.22). (thread "Find BruControl properties missing in Skynet")
