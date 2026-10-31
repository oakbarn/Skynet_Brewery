# Skynet Brewery: the Rules

Started 2026-10-27 from everything Fritz has said since 2026-10-03. Each Rule has a number, plain
wording, the date Fritz gave it, and where it came from (PR number or thread) when known.

---

## How Rules work

- **Rule 0: in a new chat, open these Rules first and follow them.** Every new chat or thread
  about Skynet reads this document before it does anything else. (2026-10-27)
- **Rule 0a: never open or read any Summary_N document** (Summary_1, Summary_2 ...) unless Fritz
  gives permission first. Much of what they say is out of date as the project moves on, so reading
  them wastes time and tokens. (2026-10-27)
- **Every new thing is built to these Rules.** Before building anything for Skynet, read this
  document and follow it.
- **When Fritz asks for something that breaks a Rule**, Claude tells him which Rule it breaks
  (quoting it by number), and gives him two choices:
  1. **Change the Rule** (it is rewritten here, with the date), or
  2. **Allow this one exception** (the Rule stays; the exception is noted under the Rule).

  The part that breaks the Rule is not built until Fritz picks. Rules are made to be broken, but
  on purpose.
- **When a Rule changes or a new one is given**, this document is updated the same day, and a
  line goes in the Change log at the bottom.
- When two Rules disagreed, only the latest one is kept here. The old wording is shown as
  "Replaced" so the history is not lost.
- Questions Fritz has not answered yet are at the end, under **Open questions**. They are not Rules.

Companion documents (look things up there, do not copy them here):

| Document | What it holds |
|---|---|
| docs/Device_Library.md (project folder) | Every Device, its Type ID, ports, pins and settings |
| docs/Widget_Library.md (project folder) | Every Widget, Template and their settings |
| docs/Image_Library.md (project folder) | Every Skynet picture, its group and what uses it |
| docs/Importing_Norms.md (project folder and GitHub repo) | Every change an import makes to bring things up to the Skynet way |
| docs/Minimum_Equipment_and_Limitations.md (project folder) | What the boards can do today |

---

## 1. Words we use (terminology)

1.1 **Schema** = a setup or configuration, on screen and in the Help. A BruControl .brucfg file is a
"BruControl Schema". (2026-10-19, PR #42)

1.2 **Device** = something tied to a port on a PLC board. **Widget** = something that lives only in
the app, with no PLC port (pipes, IPs, text, pictures, vessels drawn on screen). A Widget must never
need a Device or port. (2026-10-03)

1.3 **Tab** = a screen (never "Workspace" or "Pane"). (2026-10-03)

1.4 **Process** = a script, on screen and in the Help. (The scripts/ folder keeps its old name inside
the program.) (2026-10-04, PR #17)

1.5 **Interface** = a board (Mega, ESP32, Pi ...). (2026-10-21, PR #61)

1.6 **PLC** means hobby boards: Arduino-compatible, Raspberry Pi, ESP32 and similar. Not
industrial PLCs. They connect by USB, and by Ethernet where the board has it. (2026-10-03)

1.7 **The Brain** = the main computer: a Raspberry Pi 4 or newer, **or** a mini PC. The Brain holds
all text, picture and Schema files so the panel can be reached from anywhere. (2026-10-26)

1.8 **Menu Bar** = the top line of the page (panel name "Skynet Brewery Panel", Schema dropdown,
Tabs, Processes and so on). (2026-10-21)

1.9 **Buttons:** a **Push button** is ON only while held, OFF on release. A **Toggle** stays ON or
OFF until pressed again. A 100 ms one-shot is a **Pulse**. (2026-10-05, PR #28)

1.10 **Hole** or **Kettle Port** = an opening in a kettle. "Add TC 1.5 Port to the Center Bottom at
1 inch" means the port's center is 1 inch above the bottom. (2026-10-23)

1.11 **Hydro** = a Tilt or any other hydrometer. (2026-10-23, PR #97)

1.12 **User Bundled Template** = a Template a user builds (not "User Template"). (2026-10-23, PR #99)

1.13 **Label** = the text a Tab shows on a Device or Widget (empty = its Name). It was called
"Display Name" (`displayName`); every Display Name / displayname is now **label**, on screen, in the
Schema file and in Processes (`tm_Mash.label = "Mash"`). Old Schemas move over when they load, and
BruControl's `displayname` still works in a Process and means label. (2026-10-27, thread "Apply
clean-up requests and standards", Help 72)

1.14 **Skynet Standard: a Widget is a Widget, never an "element".** Things on a Tab are Devices or
Widgets; stay away from the word Element. A Picture Widget's dialog is "Picture Widget" (it was
"Picture Element"), and every Properties title says "... Device" or "... Widget". The only exception
is a real *heating element*. (2026-10-27, Help 74)

1.15 **Position attributes are `.x_hPosition` and `.y_vPosition`** (x = horizontal, y = vertical, so
nobody has to remember which). Typing `.x` or `.y` in the Process editor fills in the whole name, even with
Predictive text off. The old `.xPosition` / `.yPosition` still work. **Short forms** `.x` / `.xh` and `.y` / `.yv` work
too (Fritz's Text Widget list, 2026-10-29). (2026-10-28, PR #121, Help 49, 79)

1.16 **gGlobal** is the one variable class (it was gKonstant and gAPI, and before that vKonstant and
vAPI). Suggested name prefixes start **gG**: `gG_`, `gGS_`, `gGL_`, `gGV_`, `gGT_`, `gGDT_`, `gGB_`, `gGSW_`,
`gGPB_`, `gGMB_`, `gGList_`, `gGStep_`. Prefixes are hints, never required. Going to the database and being
reached by outside programs are settings every Device and Widget has (Rule 6.14), so no separate API class
is needed. Older Schemas are changed when the Brain starts or the Schema loads (Rule 15.2): the types become
gGlobal, `vK..._` / `vA..._` / `gK..._` / `gA..._` names become `gG..._` through the hidden-key rename
(Processes, saved values and the database follow), a former gAPI keeps its database setting and gets .API
Get and Put, `log Name` in a Process becomes `send_db Name`, and the web API is `/api/items`
(`/api/gapi` is gone). (Fritz, 2026-10-30, thread "Send any Device or Widget to a database", Help 4, 98;
was 2026-10-28, Help 84)

1.17 **Skynet Constants** are fixed numbers built into Skynet for common conversions (weight, volume,
pressure, temperature, brewing ratios, length, power, time). Each name starts **`skc_`** and says
from_To_to: `skc_Kg_To_Lb`, `skc_PSI_To_kPa`. A Process uses one like a number
(`gGV_Lb = gGV_Kg * skc_Kg_To_Lb`). Nobody can change them (Rule 3.11), and no Device, Widget or
variable name can start `skc_`. (Fritz, 2026-10-30, thread "Add Skynet unit conversion constants", Help 94)

## 2. Screen design and clicks

2.1 **One click for things done often, two or more clicks for things done rarely.** Keep Tab
screens clean for Brew Day; rarely-needed items go in the ☰ (hamburger) Menu. (2026-10-21, PR #56)

2.2 **The Menu Bar is hidden on Tabs** by default; reach it from ☰ Menu > Show Menu Bar. The switch
is on the ☰ Menu > Default tab. (2026-10-21, PR #54)

2.3 **The ☰ Menu is on almost every dialog** as a way to move around. Only dialogs that must be
answered first leave it out. (2026-10-21, PR #71)

2.4 **The ☰ Menu lists every screen and every part of a screen** you can go to (for example
Devices ↳ Interfaces). (2026-10-26, PR #106)

2.5 **Yes / no choices are a toggle icon or a small switch, never a dropdown.** Lock position is the
small 🔓 / 🔒 icon. Lists where you tick several items stay as tick boxes. (2026-10-04 corrected,
restated 2026-10-23, PR #94)
*Replaced:* the first wording on 2026-10-04 asked for Yes/No dropdowns. Fritz corrected it the same
day.

2.6 **Choices with more than two answers are dropdowns.** A list that can grow ends with
"Add new ...". Behind a dropdown sits a gGlobal List: the list shows text, Processes see the
number (Value). (2026-10-04, PR #14)

2.7 **Color pickers:** Default first, None (see-through) second, then the standard color names with
a swatch, then Custom. (2026-10-05, PR #31)

2.8 **Properties dialogs** have Delete, Cancel and Save at both the top and the bottom. (2026-10-04,
PR #15)

2.9 **Double-click opens Properties** (hold a finger on phones). **Right mouse button drags.**
(2026-10-21)
*Replaced:* right-click opening Properties (PR #51) was built, then Fritz turned it down and the PR
was closed. Do not offer it again.

2.10 **Double-click any entry in any list box** opens that item's Properties. (2026-10-26, PR #107)

2.11 **Right-click gives Help** when the item can't move (outside Edit layout, a locked item, an
empty spot, the Menu Bar). A yellow "?" sits by ☰ Menu tab headings and Properties titles, **but
never on a Tab itself.** (2026-10-21, PR #57)

2.12 **Only unlocked items may move**, Edit layout included. 🔒 Lock All and 🔓 Unlock All are
one-time **actions, not switches**, and work on the current Tab only. (2026-10-22, PR #79)

2.13 **Phones and tablets do not move pictures** in Edit layout; they only select, and holding a
finger opens Properties. A switch on ☰ Menu > Default can allow it. (2026-10-21, PR #59)

2.14 **Edit layout button** (hammer and pick over a square) sits beside ☰ Menu on the Tabs bar, for
Admins. Its background is **navy blue**. (2026-10-22, PR #82 and PR #98; navy blue 2026-10-27)

2.15 **No up and down scrolling** on a Tab: "Fit screen" is the default. (2026-10-04, PR #12)

2.16 **Any Device or Widget with an on/off state** has a Picture when on, a Picture when off and an
On overlay, which swap by themselves with no Process needed. (2026-10-22, PR #72, PR #81) The
overlay is the preferred way: see Rule 7.8.

2.17 **Every dialog uses the same buttons, each an icon and its word:** ✖ Cancel (closes, saves
nothing), 💾 Save (saves and closes), ✖ Close (a dialog with nothing to save), 🗑 Delete (asks
first), ✔ OK (closes a message). (2026-10-27, thread "Add hidden keys so names can change") The **Add Device** box
uses **➕ Add Device** in place of Save. (2026-10-28)

2.18 **Skynet Standard: Show label.** Every dialog that has a Label also has a **Show label**
switch with it (Devices, Widgets, the New Device dialog, vessels, Tab_Vessels, Tab_Fittings,
Integrated items, IPs, pipes and hoses, Equipment Profile vessels). (2026-10-27, Help 72)

2.19 **Skynet Standard: double-click a picker dropdown** to open the Properties of the one picked,
when it has a Skynet dialog a user can reach. Example: in pic_Kettle_Element's Properties,
double-clicking the Tab dropdown on **Brewhouse** opens the Brewhouse Tab settings. Works for Tab,
Device / Widget, vessel and IP dropdowns and the pipe's "Only when" list. Picture and sound pickers
work differently (preview and 🖼 icon picker), and plain choice lists have no dialog. Unsaved
changes in the open dialog are asked about first. Extends Rule 2.10. (2026-10-27, Help 73)

2.20 **Resize grab points:** in Edit layout an unlocked item can be resized with the mouse from
eight grab points: the four corners and the middle of each side. The picked item shows all eight,
the others only the bottom right corner. A small box shows X, Y, Width and Height while moving or
resizing. Locked items have none (Rule 2.12). Works on the Build Tab and every Tab. (2026-10-27,
thread "Improve the Build Tab add and resize tools", Help 75)

2.21 **🗂 Schema is at the top of the ☰ Menu** (under Edit layout), one click to the Schema Menu
tab. (2026-10-28, thread "Add sample Schemas to the Schema list")

2.22 **Properties dialog pattern** (Fritz's Text Widget Properties, 2026-10-29; the pattern for the other dialogs):
title "... Widget Properties" with the yellow Help ?; Delete, **COPY**, Cancel, Save at the top (Delete, Cancel, Save at the
bottom too); Name with its default name and an explanation ending in an **orange ?**; the settings in framed boxes (a Label
box, a Properties box). The **orange ?** is not Help: it opens a pop-up with that kind's **Properties** and **Attributes**,
with Close at the top and the bottom. **COPY** saves, then makes a copy with the next default name on the Build Tab (Rule
4.1). A Text Widget's word wrap is always on. (thread "Redesign the Text Widget dialog", Help 91)

2.23 **Image block** (Fritz, 2026-10-29): every dialog with background pictures shows **Background #** (1, 2 or 3 picks Image
Path 1-3; any other number = no picture), **Back Colour** (a color behind the picture), and **Image Path 1, 2, 3**, each with
an **OPEN** button and a box to type a path in. OPEN pops up **Background Image N** (Skynet / My pictures, group, 🖼 icons,
the Image list, Cancel and Save). A typed path that is not found shows blank, with a warning. (Help 93)

2.24 **Styles** (Fritz, 2026-10-29): a Widget's look can be a **Style** picked from a list. **Skynet Styles** come with Skynet;
**a user can never edit a Skynet picture or a Skynet Style**. A user makes a **User Style** (➕ Add new User Style… at the end
of the list) and can change or delete only those. First used on the **Timer Widget**, which has **no pictures and no
background**: its look is its Style. (Help 92)

2.25 **Close Skynet Brewer** (Admins) is the last ☰ Menu choice. It stops the panel after asking, and the
launcher (Skynet_Brewer.bat) then closes its Command Prompt window; every open page shows "Skynet Brewer is closed".
Closing a browser tab never stops the panel. Not offered when the panel runs as a service (Pi). (2026-10-30, thread
"Close the command window on exit")

2.26 **The Override button** (Fritz, 2026-10-30): one press lets every running Process move on, like the Simulator's skip
with a 100 ms delay: a wait or sleep it is held in is passed, and the loop it sits in (a goto back up, often in an if) is left; the
next wait runs as normal. **Only one Override button on a Tab**; it can be on several Tabs, each with its own Label (default
"Override") and look. A user changes only the Label and its style (font, size, bold, fore, back, alignment), **never a background
picture**. Manual valves still wait for their click or Done; Looper Processes are left alone. (thread "Add an Override button", Help 96)

## 3. Names and file names

3.1 **Device names** follow `InterfaceID_Port_DeviceTypeID_Label__TabID`
(example `MB_A0_10KNTC_Mash~Tun__SP`). The panel suggests the name; an Admin may type another.
Full details (Type IDs, virtual ports, what happens to odd characters) are in the Device Library.
(2026-10-23, PR #97)
*Replaced:* the 2026-10-21 format `InterfaceID_Port_Type_DisplayName_TabID` from PR #61.

3.2 **Interface ID** = 1 to 4 letters, unique. **Tab ID** = exactly 2 letters, unique. **Only an
Admin can change either**; for everyone else the box is greyed out. The panel explains that the
Interface ID is best set once (it is part of every Suggested Device name) and warns before changing
one that Devices already use. (2026-10-21, PR #61; restated by Fritz 2026-10-27, PR #118)

3.3 **No spaces in Device or Process names.** Names must be unique. (2026-10-05, PR #25; 2026-10-21)

3.4 **Allowed characters** in every name (Devices, Widgets, Interfaces, Tabs, Texts, pipes, vessels ...;
all names are treated the same, Rule 3.11): no control characters, no spaces at the start or end, no leading dot, no emoji, none of `< > : " / \ | ? *`, none of the Windows reserved
names (CON, PRN, AUX, NUL, COM1-9, LPT1-9). **File and folder names** follow the same list, and a
period only before the file ending (folders and Process names: no period). Only new or changed names
are checked, except `< > : " / \ | ? *`: under Rule 15.2 an older name with one of them is changed
once, each to a `~` (`Pump:1` becomes `Pump~1`, `_2` if taken); it keeps its hidden key, the old name
becomes its Label, and Processes, settings, saved values and the brew log follow (backups
`.before-safe-names.bak`; for a Tab, everything on it follows). (2026-10-23, PR #95; `< > : " / \ | ? *` added by
Fritz 2026-10-29, PR #134; every name 2026-10-29, Help 63)

3.5 **Never rename an existing item by itself**, with one exception: **a clone follows its parent.**
A clone's name is always its parent's name plus `_Clone_N`; when the parent is renamed, the parent part
of each clone's name changes with it, and every Process follows (Rule 3.6). Each clone has its own
hidden key (Rule 3.10) but acts only through its parent's key. (2026-10-21; changed 2026-10-27)
*Replaced:* "Never rename an existing Device by itself. It would break Processes." (2026-10-21)

3.6 **When a name changes, every Process that uses it follows** the new name. The panel finds the
rename by the item's hidden key (Rule 3.10). A Process running at the time keeps working and uses
the new name from its next start. Renaming a Process changes the lines that start or stop it and
the Autostart list. **Clones follow too:** renaming an item changes the old-name part of each of
its clones' names (`HLT copy` becomes `Hot_Liquor_Tank copy`), unless that name is taken.
(2026-10-22, PR #73; keys and clones 2026-10-27)

3.7 **Every date in a file name follows ISO 8601**, safe for file names: `YYYY-MM-DD` for a day,
`YYYYMMDDTHHMMSS` (no colons) for a date and time. (2026-10-23, PR #93)
Note: the Panel Version name is not changed yet (see Open questions).

3.8 **Template names:** no spaces, unique. A Label is only on Tab items (empty Label = the name).
(2026-10-21)

3.9 **Generic names and shapes only.** Product photos with a maker's logo or name are redrawn as
generic shapes with generic names (for example Hop_Filter_Inline, not a brand name), because
Skynet will be open source. (2026-10-22)

3.10 **Every item with a name has a hidden key** (Devices, Widgets, variables, Texts, IPs, pipes,
vessels, fittings, Tabs, Interfaces, Processes, Templates, Profiles). It is given when the item is
first built (saved), is meaningless, unique and never changes. Nobody can see it (not on screen, not
in the Config Editor, not in a saved Schema file) and nobody can use it in a Process: Processes
always use names, and the panel ties each name to its key behind the scenes. Old Schemas get their keys
when they are loaded. **Exception:** picture and sound paths have no key; a later request covers
how the Graphic Picker handles a path. (2026-10-27)

3.11 **Once an item is built, its Name is locked** (🔒). It is changed only with the **✏ Change
name** button beside it, which opens the **Name Change** pop-up: the name now (read only), a box for
the new name, ✖ Cancel and 💾 Save. The same pop-up renames Processes and Schemas. (2026-10-27)
**All names are treated the same** (Fritz, 2026-10-29): a name is only there to find the item on the screen and, in the Process
Editor, to set its `.attribute`. **Skynet names are fixed** and are never changed (only while building Skynet). **Any name a Process
could use changes only with ✏ Change name** (Rule 3.6: the Processes follow). Exceptions: **User Template names** (only for picking
one; renaming changes nothing in a Process), and picture paths / graphic file names (handled later).

3.12 **Interfaces are easy to find and add.** ☰ Menu has **🔌 Interfaces (boards)** and **➕ Add
Interface…**, and every Interface dropdown in a New Device box (any Tab, RIMS and kettle too) ends
with **➕ Add new Interface…**, which opens the Add Interface pop-up and comes back with the new
Interface picked. The pop-up explains the Interface ID: it becomes part of every Suggested Device
name, must be unique, and should be set once and left. (2026-10-27, thread "Make Interfaces easy to
add and simulate", Help 76)

3.13 **Own Device names get a warning.** When a name is typed instead of the Suggested Name, the panel
warns: a plain word like "Pump" becomes a reserved word in Processes and can cause problems in the
code; the Device name is only used in Processes and never shown on a Tab, so a unique, meaningful
name is better. OK keeps it, Cancel goes back. (2026-10-27, Help 76)

## 4. Making things: the Build Tab

4.1 **Every new Device, Widget or copy of a Template is made on the 🔨 Build Tab first**, then sent
to a Tab. (2026-10-23, PR #97 and PR #99)

*Exception:* a Clone (Rule 4.4) may be made on any Tab, the Build Tab too. (2026-10-27)

4.2 **New Device order** (the **Add Device** box, Fritz 2026-10-28): 1 Interface, 2 Available Ports/Pins
(only free ones that fit), 3 Suggested Name, 4 Label (or **Show label** off), then Width and Height
(**150 x 150** to start). The Device Type comes from the list it was picked in, and is asked after the
Interface only when that kind has more than one. **✖ Cancel** and **➕ Add Device** sit at the top and
the bottom; Add Device works once the Label is typed or Show label is off. The Device goes in the
**middle of the Build Tab** (unless ☰ Menu > Default sets X and Y), and the rest of its Properties open.
(2026-10-23, PR #97; 2026-10-28, Help 82)
*Replaced:* 1 Interface, 2 Device Type, 3 Ports, then Label; Create (2026-10-23).

4.3 **Un-bundling** a bundled item asks "Move it to the Build Tab?". Save Build then asks "Put it
back where it came from?". Save to Tab places the build in the center of the chosen Tab.
(2026-10-22, PR #88)

4.4 **Cloned Devices: one Device can be shown on more than one Tab.** A Clone is the same Device, not
a copy. **The only way to make one is ⧉ Clone Device** on the Edit layout bar; it works on any Tab,
**the Build Tab too** (an exception to Rule 4.1, Fritz 2026-10-27). Its list holds the Devices
already placed on a Tab, grouped by type (Pumps, Valves ...). Its name is made by Skynet and can't
be typed: **`<Parent_Name>_Clone_N`** (`MB_06_Pump_Wort__HS_Clone_1`). The name is only for reference in its
Properties. **Each Clone has its own hidden key (Rule 3.10) but acts only on its parent's key**
(the key link is built once PR #114 is in; until then a Clone points at its parent by name). Only **.visible, .x, .y and its Tab** (a
Tab dropdown in its Properties; not in Processes) and its lock are the Clone's own; every other property is the parent's. Tapping a Clone of an on/off
Device, or one with Enabled (a PID), turns the parent on or off; a Clone of a reading Device (1W)
only shows it, in the parent's format. **Clones are not used in Processes.** Clones follow a parent
rename; deleting the parent deletes its Clones. A Clone is not a new Device, so Rule 6.1 (one Device
per port) is not touched. Help 71. (2026-10-27, thread "Show one Device on several Tabs")

4.5 **The Edit layout bar has three rows** (Fritz's layout, 2026-10-28, Help 82):
- **Row 1, Devices:** **Select Device Type** (the major kinds: On/Off, Pumps, Valves, Heating Element,
  PWM / Analog out, Inputs, Probe, Sensors, Motors, Weight) and **Add Device** (only that kind's Devices;
  a Pump, Valve or on/off heating element is in On/Off too). Then the shortcuts **Pumps**, **Valves**,
  **Probe**, **Heating Element** and **PWM**: one click shows only that kind's list, the same as picking
  the kind and then Add Device. Then **⧉ Clone Device** (a list of the Devices on other Tabs).
- **Row 1, Widgets:** **Select Widget Type** and **Add Widget**, **Picture ➕**, **Text ➕**, **Vessel**,
  **Manual Valve ➕**, and **Add equipment ➕** at the far right.
- **Row 2:** Draw pipe, Draw hose, **Elbows, Tees …** (fittings and IPs), the turn buttons, Lock, Lock
  All, Unlock All, Tab settings, New tab, Build Tab, Preview, Save Build.
- **Row 3:** the hint, Update Version, Save layout, Exit.
*Replaced:* the ➕ Add box of PR #117 (2026-10-27).

## 5. Templates and Integrated items

5.1 **Two kinds of Template:** Skynet Templates (come with Skynet, read only, cannot be deleted,
clone only) and User Bundled Templates (Admins can edit and delete). (2026-10-21, PR #68)

5.2 **Two kinds of Skynet_Integrated item:**
- **Skynet_Integrated_Device**, for example the Electric Heated Vessel and the RIMS tube.
- **Skynet_Integrated_Widget**, for example a 90° TC elbow with its IPs built in.

**Anything integrated from the Template can never be un-bundled.** An Integrated item can be
bundled with other things. (2026-10-23 19:47Z)

5.3 **The RIMS tube is not bundled.** It has no Bundled switch; its IPs are integrated like an
elbow. Its heating element settings are in the RIMS Properties, and **the thermowell is part of the
element**. (2026-10-26, PR #105)
*Replaced:* on 2026-10-23 Fritz allowed Bundle/Unbundle on Skynet items "for now". For the RIMS this
ended on 2026-10-26. For other Skynet fittings and vessels, see Open questions.

5.4 **Skynet fittings** (elbows, tees, U and so on): every opening has a built-in two-way IP that
can't be un-bundled, and End Caps where needed. Their Properties have no IP settings. Items a user
builds still add IPs and bundle by hand. (2026-10-22, PR #91)

5.5 **Every Skynet item gets the same turn and flip set:** Flip Vertical, Flip Horizontal and
Rotate 45, and the picture and its IPs follow. **Rotate 90 is retired**: the Flips do left and right; a
quarter turn (a tee standing up) is two Rotate 45 steps. (2026-10-22, PR #91; vessels 2026-10-23, PR #92;
Rotate 90 retired 2026-10-28, thread "Lock Skynet Widget Templates and IPs")
*Replaced:* "Flip Vertical, Flip Horizontal, Rotate 90, Rotate 45" (2026-10-22).

5.6 **A Skynet Template's picture is fixed.** A bottom-drain copy of a kettle changes only the
picture. (2026-10-23)

5.7 **Adding a Vessel asks: Widget or Integrated.** A Skynet Vessel Widget has no Devices, only
built-in IPs. **A User Bundled vessel Template must be built on a Skynet Vessel Widget**; there is
no other way to make one. (2026-10-23, PR #102)

5.8 **A Template sent to a Tab becomes a Tab item** (Tab_Vessel, Tab_Fitting, a Device) that can be
deleted. What can be edited on it follows Rule 5.16. (2026-10-21; changed 2026-10-28)
*Replaced:* "... that can be edited and deleted, even when it came from Skynet." (2026-10-21)

5.9 **Equipment:** valves have no inlet or outlet side; pumps have no orientation setting; BruControl
VGC outputs are valves. Equipment types have Type, ports, Position and Standard lists that users can
add to. (2026-10-04, PR #14)

5.10 **Flow rules:** flow only runs on pipes joined IP to IP, traced from running pumps. An OFF pump
lets flow pass either way. Valves must be open. Dead ends show nothing. A check valve passes one way
only. Fitting bundles flow both ways. Tap water valves push flow on their own. (2026-10-04, PR #3;
PR #47; PR #91)

5.11 **Everything is drawn to scale:** fittings and Devices with IPs grow with the Tab's pipe size.
(2026-10-04, PR #3)

5.12 **Kettle pictures are empty:** no wort or liquid drawn, and no heating element drawn on a plain
kettle. Each kettle has a plain and an _Electric version. (2026-10-22, 2026-10-23)

5.13 **Manual valves** make a running Process wait. A valve Device with Valve type Manual waits for a "Done"
pop-up (2026-10-20, PR #44). A **Manual Valve Widget** waits for a click on it on its Tab (Rule 5.15).

5.14 **Pipe fittings are only what they are.** A tee is only a tee (no Top Tee, Suction Tee or other Type),
an elbow only an elbow, likewise a reducer, U, cross and End Cap. Their only settings are **.x, .y, .width and
.height**, plus **Autosize to pipe** (on by default: the fitting takes the size of the pipes joined to its IPs;
Width and Height are greyed out until it is switched off). No label, Type or Connection Standard; turning and
flipping stay on the Edit layout bar's turn buttons (Rule 5.5). **Pipe fittings have no Clone.** A **check valve
is a pipe fitting too**: it is always one way, and its orientation shows the way. Valves and flow meters in a fitting
are **Devices**; a tee with a thermowell, or a thermowell on a vessel IP, is a kind of **Temperature Probe**
(Fritz, 2026-10-28).
(2026-10-28, thread "Simplify pipe fittings and Manual Valves", Help 87)

5.15 **The Manual Valve is a special Widget class**: something of a pipe fitting (Autosize to pipe, .x .y .width
.height) and a pseudo Device. Its **.state** is true (open) or false (closed) and **only a click on it on its
Tab changes it**, at any time. A Process line `ManualValve_1.state = true` does **not** change it: it shows the
warning to open it by hand, the valve blinks on its Tab, and the Process waits until someone clicks it to the
state asked for. While open it shows the open overlay (Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg).
(2026-10-28, thread "Simplify pipe fittings and Manual Valves", Help 87)

5.16 **Skynet Templates and Daughter Templates are set and can't be changed by a user.** A user makes
a **User version** (a User item made from a Skynet Template) that inherits everything from the Template.
Only some attributes are user settable, and only those show in its Properties; the rest are fixed and
not shown. **Which ones depends on the Widget or Device type**: each type has its own list, set per
Template (a "user can set" tick box on each attribute, Rule 5.18). A user's own Devices and Widgets (not
made from a Skynet Template) keep the normal Properties. The Brain enforces it: a fixed attribute sent by
any screen is put back to the Template's value. (2026-10-28, thread "Lock Skynet Widget Templates and IPs")

5.17 **Master and Daughter Templates.** A Master Template can have Daughter Templates for common
orientations; a Daughter inherits everything from its Master and sets only its orientation and flips.
The **Skynet Motorized Ball Valve Device** (a Device, Rule 1.2: it has a pin) is one Template set:
**Master H** (Horizontal), **Daughter VL** (Vertical) and **Daughter VR** (Vertical, Flip Horizontal on).
Its picture, Kind, Valve type and Service are fixed (a High Temperature valve is a different Skynet
Template, even if only the Service differs). (2026-10-28, thread "Lock Skynet Widget Templates and IPs")

5.18 **Build Template Tab** (Admin only): where a Template is made or edited, with all its Properties and,
on each attribute, a **"user can set"** tick box (shown on User versions, Rule 5.16). During the building
phase every Template made there is a Skynet Template (or is deleted before Fritz switches them all to
Skynet Templates); they are set (locked) only when Fritz says (Rule 9.6). The dialog is kept in production
for User Bundled Templates. It is **☰ Menu > Build Template**; the always-fixed attributes (pictures, Kind,
Valve type, Service, Look, tap behaviour) have a greyed-out box. (2026-10-28, thread "Lock Skynet Widget Templates
and IPs"; built 2026-10-29, Help 89)

## 6. Devices, connections and safety

6.1 **One Device per port** on an Interface. **Exception:** outputs of different Device Types may
share a port (for example Hysteresis and PID on one heater). The last one turned on wins and the
others turn off. (2026-10-23, PR #97)

6.2 **Virtual ports:** OneWire probes 700-799 (one Device per probe); hydrometers 200, 201 and up.
Analog pins use BruControl numbers (A0 = 54, A5 = 59). (2026-10-23, PR #97)

6.3 **Connection ranking per board** (2026-10-26, PR #108, still open):
- Mega and other Arduino boards: USB best, Ethernet OK (a network failure is a safety risk), WiFi
  poor.
- ESP32: USB best, Ethernet good, WiFi good **as long as no heating is on a pin**.
- Heating on Ethernet or WiFi is allowed, with a warning. A lost link turns the board's outputs off
  after a set delay (default 10 seconds).
*Replaced:* Fritz first said "Mega by USB only" the same day, then changed it to this ranking.

6.4 **Switching Schemas turns every output off** before and after the switch (manual valves are
not touched), and warns if Processes are running. (2026-10-21, PR #66)

6.5 **Never run real JavaScript inside a Process.** C-style spellings (`;`, `{ }`, `++`) are fine.
(2026-10-21, PR #58)

6.6 **Remote access is by Tailscale only.** Never open a port on the router. (2026-10-04, PR #8)

6.7 **Digital input push buttons** (Pulse mode) have a 3 second lockout by default. (2026-10-04,
PR #4)

6.8 **Firmware for the boards**: ready firmware for boards that are not on the standard Arduino IDE
is now a go (2026-10-27, thread "Build firmware for non-Arduino-IDE boards"). Every firmware keeps
the same message language (docs/DEVICE_PROTOCOL.md) and the lost-link watchdog.

6.9 **RTD chip-select (CS) pins on an Arduino Mega:** an RTD Device (PT100 / PT1000 on a MAX31865
board) may ONLY use **D14-D17, D22-D39, D41-D43, D47-D49 or D53** for its CS pin. Those pins are not
PWM, counter, SPI (50-52), OneWire (40) or Ethernet shield (4, 10) pins. The pin list offers only
these, and the panel refuses any other pin. Thermocouples are not covered (yet).
(2026-10-27, thread "Limit RTD CS pins on the Mega")

6.10 **Pin D10 on an Ethernet Mega:** the Ethernet shield uses pin D10, and a pin is hard wired to its
equipment, so moving it is real work. On a Mega on Ethernet no Device may use D10 (the pin list
doesn't offer it). Before a Mega Interface can be changed from USB to Ethernet, the panel checks
pin 10: if a Device uses it, the panel says that Device and its wiring must move to another free
pin first, and refuses the change until pin 10 is free. (2026-10-27, thread "Limit RTD CS pins on
the Mega")

6.11 **SD cards are not supported. Never insert an SD card** in a Mega's Ethernet shield. Pin D4 is
the shield's SD card pin: it is NOT blocked, but picking D4 for a Device on a Mega shows the warning
"SD Card Not Supported. Never insert an SD Card!". The Ethernet sketch (firmware 0.5) holds D4 HIGH,
checks the slot every 10 seconds, and when a card is in, the panel shows "SD Card Not Supported.
Remove the SD Card!" to everyone and on the Devices page. (2026-10-27, thread "Limit RTD CS pins on
the Mega")

6.12 **Firmware order and add-ons** (Fritz, 2026-10-27/28): 1 Raspberry Pi GPIO program, 2 board
profiles with ready-made firmware for Uno, Nano, R4, GIGA, Opta and the others, loaded from inside
Skynet (board on the Brain's USB, the Brain uploads, terminal-style box and serial monitor, Admin
only), 3 Pi Pico. Every board is a daughter board (Interface) of the Brain like a Mega 2560; the Brain
holds all logic. **Each add-on (OneWire, RTD, thermocouple, ADS1115, load cells, steppers, Ethernet)
goes to every Arduino board**: one shared Skynet firmware, built with only the add-ons that
Interface's Devices use so small boards fit. (thread "Build firmware for non-Arduino-IDE boards")

6.13 **Raspberry Pi GPIO pins:** an Interface with Board "Raspberry Pi" runs `firmware/Pi_GPIO`.
Pins are GPIO (BCM) numbers 2-27. GPIO 4 is kept for DS18B20 probes, GPIO 7-11 for SPI (RTD and
thermocouple boards), GPIO 2-3 for I2C (ADS1115). No analog pins and no stepper motors on a Pi: the
panel refuses them. On the Brain itself (address 127.0.0.1) the rating is Best. Same protocol and
lost-link watchdog as every other board. (2026-10-28, Help 78, PR #119 open)

6.14 **Database and .API on every Device and Widget** (Fritz, 2026-10-30, Help 98). Every Device and Widget
with a value has a **Database and .API** box at the end of its Properties:
- **Send to the database**: Off, On demand, On value change (at most 10 a second, the last change never lost),
  When a Process starts, Once, At a date and time (once), Every N ms / seconds / minutes / hours / days (with an
  optional clock time), Every 00:00:00. **What to send** is its main value unless another attribute is picked.
  `send_db Name` in a Process sends it now, whatever the setting.
- Each reading is kept with its **time stamp** and the item's **hidden key** (Rule 3.10), so a renamed item keeps
  all its readings under today's name. The key never leaves the Brain. The database is SQLite on the Brain
  (free, SQL). An outside database (offload, reports and CSV from it, a "Database Not Available" pop-up) is later.
- **.API**: Off (the start), Get only, Get and Put. Only items with .API on are in `/api/items`, MQTT and Home
  Assistant; only Get and Put can be changed from outside.
- **Safeguards so a bot can't take over:** board readings (inputs, probes), names, Tabs, Interfaces, ports and
  pictures are never changed from outside; a Manual Valve Widget has no .API (only a click turns it); ten wrong
  API keys in 10 minutes shut that address out for 15 minutes; every outside change is written in the Processes
  console.
- These two settings are always user settable, also on a User version of a Skynet Template (an exception to
  Rule 5.16).

6.15 **Close all and Open all valve lists** (Fritz, 2026-10-30). Every valve a Process switches (Electro_Mechanical, such as a
Motorized Ball Valve) has two switches, **On the Close all valves list** and **On the Open all valves list**, both **on to start**.
`close_all_valves` and `open_all_valves` in a Process (and PreBrew's house cleaning) use them; `all_pumps_off` turns every pump off.
**A tap water valve is always on Close all and never on Open all**, and its Properties show this with no switches (the Brain puts it
back on every save). A Manual valve is on neither list. (thread "Build the Standard Skynet Brew Process", Help 100)

## 7. Pictures

7.1 **All Skynet pictures are SVG only.** (2026-10-22) Fritz's PNG drawings are redrawn as SVG and
only the SVG ships. (2026-10-22)

7.2 **Skynet pictures live in media/Images/Skynet/<group>/** and are read only in the panel. User
pictures go in media/Images/<group>/. The groups are Alarms, Vessels, Pumps, Valves, Chillers,
Motors, Lights_LEDs, Hop_Infusion, Other_Equipment, Miscellaneous and On_Off. (2026-10-22, PR #80)

7.3 **No .svg may be deleted, renamed or replaced from the panel**, not even a user's own.
(2026-10-21)

7.4 **Skynet drawing style:** flat grey #808080, black outline, see-through background. (2026-10-23)

7.5 **Keep the two-picture (On and Off) code** until Fritz says to delete it, even though On overlays
now exist. Ask before deleting any On picture files. (2026-10-22, PR #81)

7.6 **Sounds** go in media/sounds; pictures in media/Images. (2026-10-20, PR #48)

7.7 **The Image Library is never added to automatically.** A new picture goes into
docs/Image_Library.md (and the Image_Library folder) only when Fritz says to commit it.
(2026-10-27)

7.8 **Skynet Standard: On overlay when On / True is the preferred way** for on/off Devices and
Widgets, and for heaters (Rule 7.9). Two pictures (on and off) are still allowed where needed. This
is new in Skynet; BruControl never had it. In Properties the overlay comes right after the picture
and the second picture comes last, marked optional. (2026-10-27, Help 58)

7.9 **Heaters are On while Enabled.** A PID, Hysteresis or Duty Cycle counts as On from Enable to
Disable (not only while its output fires): its overlay or On picture, a vessel's heater glow and a
Picture Widget that turns on with it all follow Enabled. A PWM output is On above 0 %.
(2026-10-27, Help 58, Help 74)

7.10 **imagePath_2 and imagePath_3 work as in BruControl**, for compatibility: they can be changed
in Properties (except on a User version of a Skynet Template, where the pictures are fixed, Rule 5.16)
and set by a Process; background = 1, 2 or 3 picks one. Changing one in Properties
pops up a heads-up: any Device or Widget can have unlimited pictures with the `.image` attribute.
(2026-10-27, Help 25)
*Replaced:* after a BruControl import imagePath_2 and _3 were locked and a Process could only change
imagePath_1 (2026-10-05).

7.11 **Picture Widget: Turns on with** picks what turns it on: any on/off Device or Widget (output,
switch, input, alarm, sound player, timer, true/false variable) or a heater (on while Enabled).
**None** = a still picture, and its On pictures (Picture when on, On overlay) are greyed out. The
pictures are picked from the Picture list. (2026-10-27, Help 74)

## 8. Sign-in and roles

8.1 **Roles:** viewer, operator, admin. Any new screen that changes things is Admin-only or
Operator-only. Only Admins edit Schemas or move pictures. (2026-10-04, PR #8; 2026-10-21)

8.2 **First Admin setup** works only from your own network or Tailscale. The recovery code screen
must be impossible to miss: a big code, copy, download and print, and a required "I saved it" tick.
(2026-10-04, PR #11)

8.3 **Password rules** are set by the Admin in Settings > Password rules. Old passwords keep working.
(2026-10-21, PR #53)

## 9. Delivery: PRs and zips

9.1 **Every code change ships as a pull request (PR)** on GitHub. (2026-10-21)

9.2 **Zips of the whole panel are sent only when Fritz asks** for one (no data/ or node_modules
inside). (2026-10-21 09:17Z)
*Replaced:* from 2026-10-03 a zip came with every change.

9.3 **The release zip carries no config/, media/ or scripts/ folders.** Samples ship in defaults/
and are copied only into a missing folder, so unzipping over an old copy and choosing "Replace all"
is safe. (2026-10-05, PR #39)

9.4 **Never edit version.json in a PR.** A GitHub Action writes it on every merge. The version name
is `PR<number>_Skynet-v.yyyymmdd_hh_mm`. (2026-10-21, PR #65; 2026-10-22, PR #86)

9.5 **New pictures go in a fresh PR off the default branch.** (2026-10-22)

9.6 **Skynet pictures and Templates are built and kept editable** during the building phase; Fritz
locks them before a production zip. (2026-10-21)

9.7 *Replaced (2026-10-28):* "When Fritz closes a chat, rewrite docs/Unresolved_PRs.md" (2026-10-27).
Fritz dropped it: open PRs are on GitHub and Claude doesn't forget them, so no Unresolved PRs
document is kept.

## 10. Testing

10.1 **Testing mode is on:** every newly merged version wipes all logins, so Fritz starts fresh with
Admin setup. It stays on until he is in real use. (2026-10-04)

10.2 **Fritz's test bench** (week of 2026-10-20): a Pi, a Mega, an ESP32, one Tilt, a couple of
valves, a 12 V LED as a burner and another as an electric element. Firmware has never run on real
hardware, so expect first real-hardware bug reports. (2026-10-20)

10.3 **Simulation (test mode) touches no hardware.** Turning it on or off stops all Processes and
turns outputs off. (2026-10-05, PR #22)

10.4 **One switch for Simulator or Real boards**, for the whole panel (every Interface at once): the
🔌 Real / 🧪 Simulator button beside ☰ Menu (Admins), ☰ Menu > Switch to Simulator / Real boards,
and Settings > Simulation. Timers run as before. **A wait on a reading** (temperature, boil start,
level, weight, flow) **is pretended reached** after a set time (60 clock seconds by default, Settings
> Simulation, can be switched off); a wait on a button or switch never is. (2026-10-27, Help 77)

10.5 **A new Schema that is not a copy starts with a pretend Mega**: one Interface, Connection
Simulator, named **New_Mega_2560_N** (N = the next number not used in any Schema). The panel switches
to Simulator mode and says so, then opens the Interface pop-up to give it a meaningful name (example:
the Skynet Home Brewery's 3 Megas Main_Brewery_HotSide, Valves, Fermentor) and set its Interface ID.
A copy of a Schema keeps its Interfaces. (2026-10-27, Help 76)

10.6 **A Sample Schema always comes in as a new Schema** (Schema dropdown > Add a Sample Schema, the
☰ Menu > 🗂 Schema tab, or Settings): it never writes over one of yours. Every Interface in it gets
Connection Simulator (its real connection is kept to switch to later), and the panel switches to
Simulator mode and says so, so nothing real is switched. (2026-10-28, thread "Add sample Schemas to
the Schema list", Help 83)

10.7 **The Simulator bar** (yellow 🧪 SIMULATION bar) can be hidden and shown again with **▴ Hide /
▾ Show** on the bar, per screen; a thin 🧪 SIMULATION strip always stays. Hiding changes no setting.
**Each time the Simulator is switched on, the bar opens at 25× speed with Auto skip on**; after that
the user's choices stay until the next switch on. (2026-10-28, thread "Improve the Simulator bar
defaults", Help 85)

10.8 **The 1, 2 and 3 vessel Sample Schemas can be cloned to a User Schema** (Clone a Schema lists
them after the user's own Schemas, as 🧪 Sample). The clone is a normal User Schema, always loaded at
once, on the simulator (Rule 10.6). The OakBarn Brewery sample is not offered for now. (2026-10-28,
thread "Improve the Simulator bar defaults", Help 85)

## 11. Help pages

11.1 **Every new feature gets a Help page** (or an update to one) when it merges. Help pages are
Markdown files in help/ on the Brain, numbered for order. Next free number: **97**. (2026-10-04,
PR #16)

11.2 **New Help headings and ☰ Menu tabs** are added to the right-click Help map. (2026-10-21,
PR #57)

## 12. Privacy and sharing

12.1 **Nothing is posted or announced anywhere without Fritz's word.** The announcement goes only to
a few BruControl friends. (2026-10-04)
*Replaced in part:* "never make the repo public" (2026-10-04). On 2026-10-22 Fritz said "Public is
fine" for the GitHub repo, which the Get Skynet pictures feature needs.

12.2 **The Beer money donation recipient is locked** to Fritz's PayPal in one file and can never be
made editable again. (2026-10-04, PR #18)

## 13. Libraries (reference documents)

13.1 **Device Library** (docs/Device_Library.md in the project folder): when a new unique Device is
added, add it there, with a Change log line. (2026-10-27)

13.2 **Widget Library** (docs/Widget_Library.md in the project folder): when a new unique Widget,
Widget setting or Skynet Template is added, add it there, with a Change log line. (2026-10-27)

13.3 **Image Library**: see Rule 7.7. Never add a picture unless Fritz says so. (2026-10-27)

13.4 **Importing Norms** (docs/Importing_Norms.md in the project folder and the GitHub repo): every
new import rule Fritz gives goes there. The importer itself waits for his go. (2026-10-23, PR #96;
2026-10-28: was docs/BRUCONTROL_IMPORT_RULES.md, now in Importing Norms)

13.5 **This Rules document**: every new or changed Rule goes here the same day. (2026-10-27)

13.6 **Every document Fritz asks for must be easy for him to open.** Save it in the project folder
AND copy it to docs/ in the GitHub repo (by PR), then reply with a direct link he can open in a
browser. The list of all documents is docs/README.md in the repo. (2026-10-27)

## 14. Things on hold until Fritz says go

14.1 **Hardware summary** for a Fritzing / screw-shield / daughter-board chat: not yet. Offer it again
only when Fritz says the program is set. (2026-10-26)

14.2 **Compile check of firmware** inside the app: deferred. (2026-10-04)

## 15. Importing

15.1 **Importing always updates to the Skynet way.** When anything old comes in (a BruControl
Schema, or an older Skynet Schema or Process), every attribute, name and line of Process code is
changed to the current Skynet word or style, even where the old way still works. A Process line that
cannot be changed safely stays as it was and is listed in the import report. Each change is listed
in docs/Importing_Norms.md. First norm: `.xposition` / `.yposition` become `.x_hPosition` /
`.y_vPosition` (Rule 1.15), on the item and in every Process. (2026-10-28, thread "Start the
Importing Norms document")

15.2 **Everything conforms to the latest standard. Backward compatibility is not needed.** When a
standard changes, existing Schemas, Processes, names and files are changed to it (with backups),
rather than keeping the old way working beside the new one. (Fritz, 2026-10-28, thread "Rename vAPI
and vKonstant to gAPI and gKonstant")

---

## 16. The Brew Process

16.1 **The Standard Skynet Brew Process** (Fritz, 2026-10-30): a brew day is seven **major steps** in this order: **PreBrew,
Heat Strike, Add Grain, Mash, Boil, Cool, Ferment**, each with its own minor steps (`step "..."`). The goal is a novice brewing,
not coding. It is ☰ Menu > **Brew Process**. (thread "Build the Standard Skynet Brew Process", Help 100)

16.2 **Process Templates:** each major step uses one. **Skynet Process Templates** (`Skynet_PreBrew` ...) come with Skynet and are
never changed or deleted by a user (as Rule 5.16). **User Process Templates** are a user's own, usually a copy of a Skynet one
(➕ Add new User Process Template…); their names never start with Skynet. **PreBrew is the same in every Schema.**

16.3 **The user picks, Skynet writes the code.** The Brew Process asks only which Device does each job the picked Templates use
(HLT heater and probe, mash heater, probe, pump and timer, boil heater, probe and timer, chiller pump, wort probe, fermenter
control and probe). A job left on "(none)" becomes a pop-up asking the brewer to do it by hand. **Build the Brew Day** makes
the Flow Processes `Brew_1_PreBrew` ... `Brew_7_Ferment`, each starting the next; building again keeps the old ones as .bak.

16.4 **Recipe values are `rcp_` names, read only in a Process**, in the panel's units (`rcp_Strike_Temp`, `rcp_Boil_Time`,
`rcp_Mash_Step_1_Temp` ...). They are read when the Process runs, so a new Recipe needs no new build. While no Recipe is loaded
they come from the ☰ Menu > Default tab's Mash and Boil Profiles. **PreBrew starts with the Recipe**: load, clear and import,
make, or review it.

16.5 **`ask "text"`** in a Process shows a pop-up on every screen with ✔ Done and waits until an operator or Admin presses it.

---

## 17. Recipes

17.1 **The Recipe tab follows Fritz's layout** (☰ Menu > Recipe, 2026-10-31): IMPORT and NEW at the top, Cancel and Save,
then boxes with colored tops by kind: black names, grey times and choices, blue volumes, red temperatures, light grey worked
out by Skynet (Grain Wt., 1st Mash, IBU). **Calculate** works out the Total Grain Weight, Hop Drops, Warnings and Messages,
1st Mash, IBU, Strike Volume and Temperature and Sparge Volume. Daughter Tabs open from buttons: HOPs, Drops, Grain, Yeast,
Adjuncts, Waters, MASH. Fritz sends the fields and layout of each Daughter Tab; none are built before he does. (Help 99)

17.2 **Every field on the Recipe tab or a Daughter Tab is a Skynet_Field** (Fritz, 2026-10-31): a fixed Skynet name starting
`rcp_` (for example `rcp_Strike_Temp`), read only in a Process, never renamed by a user (Rule 3.11). The list is in
public/recipecalc.js and Help 99.

17.3 **Recipe import: BeerSmith .bsmx (BeerSmith 3 and 4) and BeerXML .xml**, every grain, hop, yeast, adjunct (Misc), water
and mash step, with **no limit** on how many (the old BruControl import stopped at 8 hops). The .bsmx keeps BeerSmith's own
US units inside (ounces, fluid ounces, °F; a Misc item in its own unit); Skynet keeps every Recipe in kg, L and °C and shows it
in the units picked on the Default tab. A Process imports with `import_recipe "path"`. (Fritz, 2026-10-30, Help 99)

17.4 **Skynet orders the hops and makes the hop alerts** (the OakBarn Hop Warnings): Top of Mash, 1st Wort, Start of Boil,
Bitter, Flavor, Aroma, Whirlpool, Dry Hop; hops at the same time are one Hop Group; each gets a warning (10 minutes, Default
tab) and a drop alert; **two alerts at the same time become one alert with both**. The user sees only the results (Drops tab).
`start_hop_alerts` / `start_hop_alerts "Boil_Timer"` / `stop_hop_alerts` in a Process. (Fritz, 2026-10-30, Help 99)

17.5 **Voice for alerts**: every alert has an audio path in media/Audio/Hops. When the file is there it plays; otherwise the
browser's own voice reads the alert. Skynet does not fetch voices from a text to voice web site by itself (free sites do not
let programs in); the Drops tab gives the manual way: copy the words, open a free voice site, put the MP3 in. (Fritz, 2026-10-30)

17.6 **Skynet Mash and Water Profiles are Skynet Templates**: read only, listed with the user's own, copied with Add new ....
The Water Profile has the source water report and how much is cut with distilled or RO water. (Fritz, 2026-10-30, Help 99)

---

## Open questions (not Rules yet)

1. **Panel Version name** (`PR107_Skynet-v.20261026_23_23`): should it follow ISO 8601 too, like
   file names (Rule 3.7)? (asked 2026-10-23)
2. **Other Skynet fittings and vessels:** Fritz allowed Bundle / Unbundle on them "for now"
   (2026-10-23). Rule 5.2 says anything integrated can never be un-bundled. Is it time to make all
   Skynet fittings and vessels fully Integrated, like the RIMS (Rule 5.3)?
3. *Answered 2026-10-29:* `< > : " / \ | ? *` are blocked in Device names too (Rule 3.4). Fritz
   asked for a list of other characters that could interfere with code; sent in the thread "Block
   unsafe characters in Device names", waiting for his pick.
4. **Build Tab:** should Save layout keep the Build Tab as it is? (asked 2026-10-23)
5. **RIMS readings:** drop the separate Heat / Temp boxes and show readings on the RIMS picture?
   (asked 2026-10-26)
6. **RIMS file name "TC1_2":** 1/2 inch or 2 inch TC? The Template still says TC 1.5.
7. **Equipment Profile:** one per Tab (Hot Side, Fermentation; Fritz 2026-10-21) or one per Schema
   (PR #44)? Still open in the Brewing rewrite.
8. **Phones in Edit layout:** add a warning and an "Allow Edit layout on phones" switch (off)?
   (asked 2026-10-26)
9. **Bundled Devices on a vessel:** the plan to list bundled Devices in vessel Properties with Edit
   buttons was OK'd but not built yet.
10. **BruControl import:** keep the strict Process check, or allow BruControl-style lenient start?
11. **Still undecided from the check-up:** phone layout, PID temperature control.

---

## Change log

- 2026-10-27: First version, gathered from project memory, the GitHub repo docs and the Device,
  Widget and Image Libraries.
- 2026-10-27: Added Rule 6.9, RTD CS pins on a Mega (D14-D17, D22-D39, D41-D43, D47-D49, D53).
- 2026-10-27: Added Rule 6.10, pin D10 on an Ethernet Mega.
- 2026-10-27: Added Rule 6.11, SD cards not supported; warning on D4 and when a card is inserted.
- 2026-10-27: Added Rule 0 at the top of "How Rules work": a new chat opens these Rules first and
  follows them.
- 2026-10-27: Added Rule 0a: never read a Summary_N document without Fritz's permission.
- 2026-10-27: Added Rule 9.7: when Fritz closes a chat, rewrite docs/Unresolved_PRs.md.
- 2026-10-27: Added Rule 2.17 (one button style on every dialog), Rule 3.10 (hidden keys) and
  Rule 3.11 (locked names, Name Change pop-up); Rule 3.6 now covers keys, running Processes and
  clones. Help 80; next free Help number 81. (thread "Add hidden keys so names can change")
- 2026-10-27: Added Rule 4.4, Cloned Devices (one Device on more than one Tab).
- 2026-10-27: Added Rules 1.13 (Label, was Display Name), 1.14 (a Widget is never an "element"),
  2.18 (Show label), 2.19 (double-click a picker dropdown), 7.8 (On overlay preferred), 7.9 (heaters
  On while Enabled), 7.10 (imagePath_2 / _3 as in BruControl; replaces the lock) and 7.11 (Picture
  Widget Turns on with). Help 72-74; next free Help number 75. (thread "Apply clean-up requests and
  standards")
- 2026-10-27: Rule 2.14 now says the Edit layout button is navy blue; added Rule 2.20 (eight resize
  grab points, X / Y / W / H read-out) and Rule 4.5 (➕ Add box). Help 75; next free Help number 76.
  (thread "Improve the Build Tab add and resize tools")
- 2026-10-27: Added Rules 3.12 (Interfaces easy to find and add, Add new Interface in New Device),
  3.13 (own Device name warning), 10.4 (one Simulator / Real switch; waits on readings pretended
  reached) and 10.5 (a new Schema starts with a pretend New_Mega_2560_N in Simulator mode); open
  question 13 (Interface ID set once vs Rule 3.2). Help 76-77; next free Help number 78. (thread
  "Make Interfaces easy to add and simulate")
- 2026-10-27: Open question 13 answered: Rule 3.2 stays (only an Admin changes an Interface or Tab
  ID; greyed out for everyone else), with the set-once explanation and warning. (PR #118)
- 2026-10-27: Rule 4.4 rewritten from Fritz's answers: Clone button only, any Tab incl. the Build Tab (exception noted under Rule 4.1), names <Parent_Name>_Clone_N, not used in Processes.
- 2026-10-27: Rule 4.4: a Clone's Tab is its own too (Tab dropdown in its Properties).
- 2026-10-27: Rule 4.4: a Clone's name is for reference only; it has its own hidden key and acts on its parent's key.
- 2026-10-28: Added Rules 6.12 (firmware order, add-ons on every board, loading from Skynet) and 6.13
  (Raspberry Pi GPIO pins); firmware open question answered.
- 2026-10-28: Help 79 = Predictive text in the Process editor (thread "Add predictive text to the Process editor"); next free Help number 80.
- 2026-10-28: Rule 9.7 (Unresolved PRs document) Replaced: Fritz dropped it; PR #113 closed unmerged.
- 2026-10-28: Help 81 = Check a Process (🔍 Check button and Error dialog, thread "Check Process code for errors"); next free Help number 82.
- 2026-10-28: Added Rule 1.15 (x_hPosition / y_vPosition). (thread "Add predictive text to the Process editor")
- 2026-10-28: Added Rule 15.1 (importing always updates to the Skynet way); Rule 13.4 now points to docs/Importing_Norms.md. (thread "Start the Importing Norms document")
- 2026-10-28: Rule 4.2 rewritten (Add Device box order, 150 x 150, middle of the Build Tab), added Rule 4.5 (the three-row
  Edit layout bar; replaces PR #117's ➕ Add box), Rule 2.17 notes ➕ Add Device. Help 82; next free Help number 83.
  (thread "Add Device and Widget type buttons to Edit layout")
- 2026-10-28: Added Rule 10.6 (Sample Schemas come in as a new Schema on the simulator) and Rule 2.21 (🗂 Schema at the
  top of the ☰ Menu). Help 83 = Add a Sample Schema; next free Help number 84. (thread "Add sample Schemas to the Schema list")
- 2026-10-28: Added Rule 1.16 (vKonstant / vAPI renamed gKonstant / gAPI, prefixes gK / gA); Rule 2.6 says
  gKonstant List. Help 84; next free Help number 85. (thread "Rename vAPI and vKonstant to gAPI and gKonstant")
- 2026-10-28: Rule 1.16 now renames older vK_ / vA_ names; added Rule 15.2 (everything conforms to the latest
  standard, no backward compatibility). The OakBarn BruControl sample is out of the shipped samples for now.
- 2026-10-28: Added Rules 10.7 (Simulator bar Hide / Show; starts at 25× with Auto skip on each time the Simulator is
  switched on) and 10.8 (1, 2 and 3 vessel samples clone to a User Schema). Help 85; next free Help number 86.
  (thread "Improve the Simulator bar defaults")
- 2026-10-28: Help 86 = IPs line up by themselves (snap to align within 10 px; IPs on Skynet valve pipe ends). Next free Help number 87. (thread "Lock Skynet Widget Templates and IPs")
- 2026-10-28: Added Rules 5.14 (pipe fittings: only .x .y .width .height and Autosize to pipe, no Clone) and 5.15
  (Manual Valve Widget: only a click changes .state; a Process asks for it by hand); Rule 5.13 covers both kinds of
  manual valve. Help 87; next free Help number 88. (thread "Simplify pipe fittings and Manual Valves")
- 2026-10-28: Rule 5.14: a check valve is a plain pipe fitting; valves and flow meters are Devices; a tee with a
  thermowell (or a thermowell on a vessel IP) is a kind of Temperature Probe. (thread "Simplify pipe fittings and Manual Valves")
- 2026-10-28: Rule 5.5 changed (Rotate 90 retired; Flips + Rotate 45), Rule 5.8 changed (editing follows 5.16), Rule 7.10
  excepts User versions of Skynet Templates; added Rules 5.16 (Skynet Templates locked, User versions with per-type user
  settable attributes), 5.17 (Master and Daughter Templates; Skynet Motorized Ball Valve Device H / VL / VR) and 5.18
  (Build Template Tab). Help 88 taken; next free Help number 89. (thread "Lock Skynet Widget Templates and IPs")
- 2026-10-29: Rule 5.18 built as ☰ Menu > Build Template (Device Templates). Help 89; next free Help number 90. (thread "Lock Skynet Widget Templates and IPs")
- 2026-10-29: Help 90 = Rich Text Embedded Code (all the \codes: \b \i \u \s \L \S \_ \^ \c{Color} \n \t \deg \F \C \ohm \+- \\). Next free Help number 91. (thread "List text formatting codes")
- 2026-10-29: Rule 3.4 changed: `< > : " / \ | ? *` are not allowed in Device, Widget and Interface names either;
  older names are changed to `~` (Rule 15.2). Open question 3 answered. Help 63 updated. (thread "Block unsafe
  characters in Device names")
- 2026-10-29: Added Rule 2.22 (Properties dialog pattern: boxes, COPY, orange ? pop-up); Rule 1.15 adds the short forms .x / .xh /
  .y / .yv. Text Widgets are named w_Text_N (older Text_N renamed under Rule 15.2). Help 91; next free Help number 92. (thread "Redesign the Text Widget dialog")
- 2026-10-29: Added Rules 2.23 (Image block: Background #, Back Colour, Image Path 1-3 with OPEN) and 2.24 (Styles: Skynet Styles never
  edited by a user, User Styles; Timer Widgets have no pictures or background). Help 92-93; next free Help number 94. (thread "Redesign the Text Widget dialog")
- 2026-10-29: Rule 3.11: all names treated the same; Skynet names fixed; any name a Process could use changes only with ✏ Change name (User Template names and picture paths excepted). The Text Widget's "Update Names" switch is that method, so the switch was dropped. (thread "Redesign the Text Widget dialog")
- 2026-10-29: Rule 3.4 now covers every name (Tabs, Texts, pipes, vessels too), as Rule 3.11 treats all names the same.
  User Template names are left alone. (thread "Block unsafe characters in Device names")
- 2026-10-30: Added Rule 1.17 (Skynet Constants, `skc_` conversions, read only). Help 94; next free Help number 95.
  (thread "Add Skynet unit conversion constants")
- 2026-10-30: Added Rule 2.25 (☰ Menu > Close Skynet Brewer closes the Command Prompt window too). Help 95; next free Help number 96.
  (thread "Close the command window on exit")
- 2026-10-30: Added Rule 2.26 (the Override button: one per Tab, per-Tab Label and style, passes a wait, sleep or loop 100 ms
  after the press; Loopers and manual valves left alone). Help 96; next free Help number 97. (thread "Add an Override button")
- 2026-10-30: Rule 1.16 rewritten (gKonstant and gAPI become one class, gGlobal, prefixes gG); Rule 2.6 says gGlobal
  List; added Rule 6.14 (Database and .API on every Device and Widget, readings kept by hidden key, API safeguards,
  `log` is `send_db`). Help 98 used; next free Help number 99. (thread "Send any Device or Widget to a database")
- 2026-10-30: Added Rule 6.15 (Close all / Open all valve lists; a tap water valve always on Close all, never on Open all) and
  section 16 (the Standard Skynet Brew Process: seven major steps, Skynet and User Process Templates, rcp_ Recipe values, ask). Help 100.
  (thread "Build the Standard Skynet Brew Process")
- 2026-10-31: Added section 17 Recipes (Rules 17.1 to 17.6: the Recipe tab layout, Skynet_Fields, .bsmx and BeerXML import with
  no limits, hop order and merged alerts, voice files, Skynet Mash and Water Profiles). Help 99. (thread "Build the Recipe Tab
  with BeerSmith import")
