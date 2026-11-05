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
- **Following the Rules is the standard** (Fritz, 2026-11-03). When Fritz asks for something that breaks a Rule, tell him the Rule
  number and what it says; almost always he will say follow the Rule. **An exception is only for something no user would find useful**
  (example: a pipe's Position and Size, Rule 5.21), never just a different way of doing it.

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

1.7 **The Brain** = the main computer: a Raspberry Pi 4 or newer, **or** a Windows, Linux or Mac computer (a mini PC,
desktop or laptop). The Brain holds all text, picture and Schema files and every saved value (gGlobals, Rule 1.22) so the panel
can be reached from anywhere, and everything works the same whichever kind of Brain it is. Arduinos and the other PLCs (Rule 1.6)
connect to the Brain by USB or Ethernet. For a phone or a browser away from home to reach the panel, the Brain must be running,
on Tailscale, and connected to the internet; this is the same for a Pi Brain and a computer Brain. (Fritz, 2026-11-03, thread "Keep gGlobal values after restart")
*Replaced:* "The Brain = the main computer: a Raspberry Pi 4 or newer, or a mini PC. The Brain holds all text, picture and
Schema files so the panel can be reached from anywhere." (2026-10-26)

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

1.15 **Position attributes: `.x`, `.xh` and `.x_hPosition` are all the same thing**, and so are `.y`, `.yv` and
`.y_vPosition` (x = horizontal, y = vertical). `.x` / `.y` are the main names (Rule 1.21); all three spellings are Process
attributes for the same thing (Fritz, 2026-11-02). **Exception to Rule 15.2:** these aliases are kept on purpose. The very old
`.xPosition` / `.yPosition` are converted (Rule 15.1). (2026-10-28, PR #121, Help 49, 79; short forms 2026-10-29)
*Replaced:* `.x_hPosition` / `.y_vPosition` were the main names, and typing `.x` filled in the whole name (2026-10-28).

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

1.18 **Skynet names: `skn_` and `sk_`.** **`skn_`** = a **Skynet internal Global**, set by Skynet and read only in a
Process: `skn_Boil_Temp` (the temperature water boils at here and now, in the panel's units), `skn_Boil_Temp_C`,
`skn_Boil_Temp_F`, `skn_Air_Pressure` (hPa). **`sk_`** = a **Skynet role** that holds one temperature probe (by its hidden
key, so a rename keeps it): `sk_Boil_Probe_1-3`, `sk_Mash_Probe_1-3`, `sk_HLT_Probe_1-3`, `sk_Ferment_Probe_1-10`, set on
☰ Menu > Default > Probe roles. In a Process a role works like its probe's name. One probe per role, one role per probe.
**`wait_boil`** waits until `sk_Boil_Probe_1` reaches `skn_Boil_Temp`; `wait_boil = 211` (or `99.8`) waits for that
temperature, in the probe's units. Option 2 first; vessel roles in an order (`wait_boil_1`) wait until Fritz has looked
at it. (Fritz, 2026-10-30, thread "Find boil temperature from local pressure", Help 97)

1.19 **gGlobal Kinds** (Fritz, 2026-11-02). A gGlobal is a **variable with a global scope** that every Process can use. It is
**not a Widget and is never on a Tab** (a Text, Picture, Value, Time or DateTime Widget shows things on a Tab), and its
properties and attributes are only those of a variable. Each gGlobal has one **Kind**, and joins that Kind's group:
**gS_Global_String** (.value a String), **gG_Global_Graphic** (the standard background picture paths, in the Graphic
Dialog), **gV_Global_Value** (.value a Value), **gB_Global_Boolean** (.value a Boolean), **gT_Global_Time** (.value a Time),
**gD_Global_DateTime** (.value a DateTime). **Making one:** ➕ New gGlobal, its Name, pick the Kind from the dropdown, the Kind's
dialog opens, fill it in, ✖ Cancel or 💾 Save (Rule 18.11 asks before discarding changes). **Once picked, the Kind is set and
can't be changed**; a wrong Kind is deleted and made again. The Kind dialogs follow the General Dialog Rules (section 18).
➕ Add the sample gGlobals adds one of each Kind. **New gGlobals are only variables with a global scope.** Switch, Push Button,
Pulse Button, List, Step and Long String are **not gGlobals**: they go to the new Semi_Widgets_Devices class (they work as
before until it is built). Older gGlobals that are not true global-scope variables become a Text Widget or a Graphic Widget,
one at a time (the list is docs/ExistingGlobals.md). The Rule 1.16 prefix change is **on hold**. BruControl Globals:
Importing Norms section 6c. (thread "Add gGlobal
Kinds and BruControl import", Help 108)

1.20 **Semi_Widgets_Devices** (Fritz, 2026-11-02) are a class between a Widget and a Device: they live only in the app like a
Widget (no PLC port, Rule 1.2) but have an **ON / OFF state** (`.state`) like a Device. The class is the **Manual Valve Widget**
(Rule 5.15), the **Switch**, the **Push Button**, the **Pulse Button** (Rule 1.9) and the **LED** (a light; a tap does nothing).
A Switch, Push Button, Pulse Button or LED has **device_controlled**, **None** to start; only a Device with an ON / OFF state can
be picked (an on/off output, pump or valve a Process switches, or a Duty Cycle, Hysteresis or PID, which is ON while Enabled,
Rule 7.9; never a Manual valve Device or an input). With a Device picked, the two **follow each other like a Clone**: the Switch
slid ON turns the Device ON, and the Device turned OFF on its own Tab, by a Process or by the Brain slides the Switch OFF. A Pulse
Button gives the Device one 100 ms ON; one that only follows its Device shows ON while the Device is ON. **The Manual Valve Widget
has no device_controlled** (only a click turns it, Rule 5.15). `.device_controlled` is read only in a Process; a deleted Device puts
it back to None and a renamed one is followed. From outside (.API, Rule 6.14) one with a Device controlled can be changed only when
that Device is Get and Put too. (thread "Create the Semi_Widgets_Devices class", Help 112)

1.21 **Universal Properties** (Fritz, 2026-11-02): every Device, Widget and Semi_Widgets_Device has the same Properties and
Process attributes: Name (Suggested Name, user may edit), Label, Show Label, Rich Text properties, Embedded Rich Text Codes,
Position (`.x`, `.y`), Size (`.width`, `.height`), Visible, HiddenLock (hidden while the Tab Lock is on), Item Lock (`.lock`)
and the hidden key. Label attributes `.label`, `.label_visible`, `.font_label`, `.size_label`, `.fore_label`, `.back_label`,
`.bold_label`, `.alignment_label`; string attributes `.font`, `.font_size`, `.fore`, `.back`, `.bold`, `.backpath`,
`.alignment`, `.visible`; item attributes `.hiddenlock`, `.x`, `.y`, `.width`, `.height`, `.lock`, `.tab`. **Item Lock** locks
the position; a locked item can still be double-clicked and changed, except while the Tab Lock is on; Lock All and Unlock All go
with it (Rule 2.12). A Clone has them all, but most are its parent's and not editable (Rule 4.4). The full list, who lacks
which, and the plan to bring the panel up to it: [docs/Universal_Properties.md](Universal_Properties.md). (thread "Set
universal properties standard", Help 114)
*Exception, Vessels* (Fritz, 2026-11-05: "Again Exception for Vessel Devices or Vessel Widgets"): a Vessel's `.width` and
`.height` work only on the Master Vessel Sizer (Rule 19.3).

1.22 **gGlobals are non-volatile** (Fritz, 2026-11-03). Besides having a global scope (Rule 1.19), **every gGlobal keeps its
value**, unlike a normal Process variable, which is cleared every time a Process starts. A gGlobal is **never cleared when a
Process starts, stops or restarts**. Its value is **saved on the Brain's disk** soon after it changes (within about a second, even
while a Process keeps changing it, and again when the panel closes), written safely so a power cut leaves the last good copy, and
it **comes back when the Brain or the panel is restarted**. There is no "Keep value on restart" switch: every gGlobal keeps its
value (an older Schema's switch is dropped when it loads, Rule 15.2). The .value typed in its dialog is only its first value. Each
Schema keeps its own saved values. Updates keep them; only the installer's Start Fresh (Rule 9.8) deletes them. Push Button and
Pulse Button gGlobals always start let go, and a Long String with a text file takes its value from the file. (thread "Keep gGlobal
values after restart", Help 118)

1.23 **Value, Time and DateTime Widgets** (Fritz, 2026-11-05): Widgets that **show one value on a Tab** for the user to look at,
before and after it is sent: a **Value Widget** (a number, with Units, Decimals, Step, Lowest and Highest), a **Time Widget**
(hh:mm:ss) and a **DateTime Widget**. Names start `w_Value_N`, `w_Time_N`, `w_DateTime_N`; the Label is never blank (Rule 18.15).
A tap sets it (unless **Read only**); every Process reads and sets it by its Name, as Devices and Widgets are global in scope
across Processes, so they **stay Widgets and do not become gGlobals**. It keeps its value when the Brain restarts. Database and
.API as Rule 6.14 (**When Clicked** fits them). Properties follow the dialog pattern (Rule 18). The Switch, Push Button, Pulse
Button and LED stay Semi_Widgets_Devices (Rule 1.20, Fritz confirmed 2026-11-05). (Help 134)

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
a swatch, then Custom. (2026-10-05, PR #31) **White** in any color picker is **RGB 250 250 250 (#FAFAFA)**, the same White
as the pump covers of Rule 7.13 (Fritz, 2026-11-05); an item saved with pure white (#FFFFFF) shows as White and is saved as
250 250 250 the next time its Properties are saved.

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
*Exception (2026-11-05, waiting on Fritz's pick):* the free end of a Quick Disconnect hose moves outside Edit layout, and the right
button drags it (Rule 5.28).

2.12 **Only unlocked items may move**, Edit layout included. 🔒 Lock All and 🔓 Unlock All are
one-time **actions, not switches**, and work on the current Tab only. (2026-10-22, PR #79)
*Changed (Fritz, 2026-11-05: "Locked Vessels cannot be moved with a Mouse but can be moved by there x y attributes"):* a 🔒
**locked Vessel** can't be moved with the mouse, but a new **X** or **Y** typed in its Properties moves it, to the pixel (moving
something 1 pixel left can look much better on the screen). Its IPs, joined fittings and End Caps go with it, as with a drag,
and it stays locked. A bundled vessel's Properties have X and Y too. Pipe ends left off its IPs let go (Rule 5.19). (Help 56)

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
*Exception, Vessels* (Fritz, 2026-11-05): Vessel Widgets and Vessel Devices follow the Vessel Rules (Rule 19.3): only a Tab's
Master Vessel Sizer has grab points.

2.21 **🗂 Schema is at the top of the ☰ Menu** (under Edit layout), one click to the Schema Menu
tab. (2026-10-28, thread "Add sample Schemas to the Schema list")

2.22 **Properties dialog pattern** (Fritz's Text Widget Properties, 2026-10-29; the pattern for the other dialogs):
title "... Widget Properties" with the yellow Help ?; Delete, **COPY**, Cancel, Save at the top (Delete, Cancel, Save at the
bottom too); Name with its default name and an explanation ending in an **orange ?**; the settings in framed boxes (a Label
box, a Properties box). The **orange ?** is not Help: it opens a pop-up with that kind's **Properties** and **Attributes**,
with Close at the top and the bottom. **COPY** saves, then makes a copy with the next default name on the Build Tab (Rule
4.1). A Text Widget's word wrap is always on. (thread "Redesign the Text Widget dialog", Help 91)

2.23 **Image block** (Fritz, 2026-10-29): every dialog with background pictures shows **Background #** (1, 2 or 3 picks Image
Path 1-3, which a Process calls .backpath, .backpath_2, .backpath_3; 0, blank or any other number = no picture, Rule 7.10), **Back Colour** (a color behind the picture), and **Image Path 1, 2, 3**, each with
an **OPEN** button and a box to type a path in. OPEN pops up **Background Image N** (Skynet / My pictures, group, 🖼 icons,
the Image list, Cancel and Save). A typed path that is not found shows blank, with a warning. (Help 93)

2.24 **Styles** (Fritz, 2026-10-29): a Widget's look can be a **Style** picked from a list. **Skynet Styles** come with Skynet;
**a user can never edit a Skynet picture or a Skynet Style**. A user makes a **User Style** (➕ Add new User Style… at the end
of the list) and can change or delete only those. First used on the **Timer Widget**, which has **no pictures and no
background**: its look is its Style. (Help 92)

2.25 **Close Skynet Brewer** (Admins) is the last ☰ Menu choice. It stops the panel after asking, and the
Command Prompt window that started it closes too, **whatever .bat started it** (Skynet_Brewer.bat, an older .bat in
C:\Brewing, or npm start typed in a Command Prompt): the panel ends that Command Prompt itself as it stops (2026-11-04).
Only the Command Prompt and npm under it are ended, never Windows Terminal or anything above it. Every open page shows
"Skynet Brewer is closed", and Skynet's own clean window (Rule 2.36) closes. The window stays open when the panel stops because of an error. Closing a browser tab never
stops the panel. Not offered when the panel runs as a service (Pi). (2026-10-30, thread "Close the command window on
exit"; 2026-11-04, thread "Close the Command Prompt with Skynet")

2.26 **The Override button** (Fritz, 2026-10-30): one press lets every running Process move on, like the Simulator's skip
with a 100 ms delay: a wait or sleep it is held in is passed, and the loop it sits in (a goto back up, often in an if) is left; the
next wait runs as normal. **Only one Override button on a Tab**; it can be on several Tabs, each with its own Label (default
"Override") and look. A user changes only the Label and its style (font, size, bold, fore, back, alignment), **never a background
picture**. Manual valves still wait for their click or Done; Looper Processes are left alone. (thread "Add an Override button", Help 96)

2.27 **User Profile** (☰ Menu > ⚙ User Profile, also Settings > User Profile): where the brewery is (country, zip or
postal code, or city; optional airport, height and a typed air pressure). The Brain gets the air pressure from the nearest
airport's report (or the weather service, or standard air with a warning when offline), every 30 minutes, and works out
`skn_Boil_Temp` (Rule 1.18). One place for the Brain, the same for every user; Admins change it. (Fritz, 2026-10-30, Help 97)

2.28 **Tab Styles** (Fritz, 2026-10-30): a Tab's Style sets the look of the Devices and Widgets on it, as two separate groups:
the **Label** (Fore, Back, Font, Font size, Alignment) and **the Device or Widget itself** (Fore, Back, Font, Font size, Alignment). Skynet Styles 🔒
(**Skynet Default**, **Tennyson**) are never changed by a user; a user makes User Styles (Rule 2.24). A Tab with none of its own
uses the ☰ Menu > Default tab's Tab Style. **A Tab Style never writes over an item's own look: only items with no Fore and
Back of their own change.** Tennyson = Label black (0 0 0) on RGB 195 195 195, Comic Sans MS 16; the item itself as now. The
sample Schemas' Recipe Tabs use Tennyson. (thread "Add Tab Styles and Version display", Help 101)

2.29 **About is always at the top of the ☰ Menu**; it can't be moved in the Order list. On Windows the Command Prompt
window goes down to the task bar once the panel is up. (Fritz, 2026-10-30)

2.30 **Hidden Special Tabs** (Fritz, 2026-10-30): a Tab named **Hidden_...** shows only in Edit layout; the rest of the time
it works in the background (Processes still use what is on it). Edit layout > 👻 Hidden Tab makes Hidden_1, Hidden_2 ...; the
part after Hidden_ is editable, Hidden_ always stays. (Help 103)

2.31 **Process Version** (Fritz, 2026-10-30): every Process can have a Version, **YYMMDD_HH_MM_n** (Brain's clock; n counts up
only within the same minute), shown on the Process editor bar with an **Update Version** button (Admins). (Help 102)

2.32 **Shortcut keys in every text box** (Fritz, 2026-11-02): in every text and string box (Properties, Labels, Texts, the
String Entry Dialogs of Rule 18.1, the Process editor, Schema.json) **Shift+Enter** types `\n`, **Ctrl+B / ⌘+B** puts `\b`
around the picked words (or types `\b\b` with the cursor between), and **Ctrl+Shift+D / ⌘+Shift+D** types **°F** or **°C**
from the ☰ Menu > Default tab **Temperatures** unit. The common keys always work: Copy, Cut, Paste, Paste as plain text
(Ctrl+Shift+V / ⌘+Shift+V), Undo, and Redo with **Ctrl+Shift+Z or Ctrl+Y** (⌘+Shift+Z or ⌘+Y). A new key must never take
one of these. (thread "Add shortcut keys for text entry", Help 113)

2.33 **One click turns a Pump on or off** (Fritz, 2026-11-04): on a Tab (not in Edit layout) a single click or tap on a Pump
Device, or on a Picture Widget that follows one, switches it ON or OFF at once, the same as a valve. No ON / OFF pop-up asks
first. A new Pump starts that way, and every Schema's Pumps are changed once when the panel starts. **Ask before changing**
(When tapped ⬢ in the Pump's Properties) can still be turned on by hand for a Pump that should ask. Double-click still opens
Properties (Rule 2.9). Heating elements still ask first. (thread "Toggle pumps with one click", Help 120)

2.34 **The selected choice in every dropdown has a Cyan background** (Fritz, 2026-11-04, a standard for the whole app):
when a dropdown list (DDLB) is open, the choice that is selected now is shown on **Cyan** with black text; the choice under the
mouse or keyboard is a lighter Cyan. This works in **Chrome and Edge** (version 135 and newer, on Windows, Mac, Linux and
Android) and in **Firefox**. **iPhone / iPad (Safari)** and older browsers draw their own dropdown (on the iPhone the spinning
wheel) and do not let a web page change its colours, so there it looks as before. (thread "Make selected dropdown items cyan")

2.35 **Phones and tablets are for running the brewery, not for editing or building** (Fritz, 2026-11-04): as a
general Rule, a phone or a tablet is not suitable to edit or build on. Phones and tablets (Fritz's iPhone over Tailscale) are
for running and watching the brewery. Editing and building are done on a computer (Windows, Mac or Linux) with a mouse and
keyboard. A feature that does not work, or looks plainer, on a phone or tablet (example: the Cyan dropdown choice of Rule 2.34
on iPhone Safari) is fine under this Rule, as long as running and watching still work there.
**Run mode** (Fritz, 2026-11-04): on a phone or tablet an admin works as an operator. **Changing the Schema, Start / Stop of
Processes and the buttons on the Tabs work; there is no Edit layout and no Properties** (nor Tab settings or the admin
screens). A short note says so when the panel starts, and ☰ Menu > About shows "run mode". ☰ Menu > Default > Phones and
tablets has a switch, **Phones and tablets can edit** (off), set from a computer, to allow editing anyway; with it on,
Rule 2.13 still holds. The login and the Brain are not changed. (thread "Add the phone and tablet editing Rule", Help 45)

2.36 **Skynet opens in its own clean window** (Fritz, 2026-11-04): on Windows the panel opens in a window of its own, with **no
address bar, no bookmarks bar and no tabs**: Microsoft Edge (or Google Chrome when there is no Edge) in "app" mode, filling the
screen. It uses **its own small browser profile** (in `%LOCALAPPDATA%\SkynetBrewer\AppWindow`), so **the normal browser is never
changed**: its bookmarks bar, settings, tabs and sign-ins look exactly as before once Skynet closes ("restore on close"). The panel
opens the window itself once it is up, **whatever .bat started it** (an older .bat that opens the browser has that browser tab
stopped, so only the clean window opens). No Edge or Chrome: the normal browser opens the panel, as before. The window closes
when the panel stops (☰ Menu > Close Skynet Brewer, Rule 2.25, or the black window's X); closing the clean window with its X
never stops the panel (Rule 2.25), and double-clicking **Skynet Brewer** again opens it again. The first time, sign in once in the
clean window (it keeps its own sign-in). Phones, tablets and other computers open the panel in their browser as before.
(thread "Open Skynet in its own clean window", Help 122)
The clean window shows **the Skynet Brewer beer mug** (the same mug as the Desktop shortcut) on the taskbar, also when it is minimized, and in its title bar; the panel's Help window and the Sign in page show it too, and so do browser tabs. (Fritz, 2026-11-05, thread "Show a beer mug icon when minimized")

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

4.1 **Every new Widget or copy of a Template is made on the 🔨 Build Tab first**, then sent to a Tab. **A new Device goes
straight on the Tab picked in its Add Device box** (Rule 4.2; Fritz's Add Pump drawing, 2026-11-04). (2026-10-23, PR #97 and PR #99)
**A new Tab from the Add Device box** (Fritz, 2026-11-04; the general Rule is 18.14): picking **➕ Add new Tab…** in its Tab list pauses the Add Device box
and keeps what was entered (Label, Interface and Port) for now; the new Tab is named and built in Tab settings; once it is
saved the Add Device box comes back with that information filled in, the Tab list refreshed and the new Tab picked, and the
Suggested Name made with it. Cancel in Tab settings makes no Tab and goes back to the Add Device box as it was.
*Replaced:* "Every new Device, Widget or copy of a Template is made on the 🔨 Build Tab first" (2026-10-23).

*Exception:* a Clone (Rule 4.4) may be made on any Tab, the Build Tab too. (2026-10-27)

*Exception (Fritz, 2026-11-03):* a **Pipe or Hose** is drawn right on its Tab with Draw pipe or Draw hose; it is never made on the Build
Tab first (Rule 5.21).

4.2 **New Device order** (the **Add Device** box, Fritz 2026-11-04, "to build a name that follows my naming conventions"):
**1 Label** (typed, or filled in as Type_n where Rule 18.15 says; Fritz 2026-11-04/05), **2 Interface**, **3 Port** (Available Ports/Pins: only free ones that fit), **4 Tab**,
**5 Name** (the Suggested Name, made from them; it shows once 1-4 are done, and the user may type their own). Then Width and
Height (**150 x 150** to start). The Device Type comes from the list it was picked in, and is asked after the Interface only
when that kind has more than one. **✖ Cancel** and **➕ Add Device** sit at the top and the bottom; Add Device works once 1-4
are done (the Label filled in, Rule 18.15). The Device goes on the picked Tab (Rule 4.1), in the middle unless ☰ Menu > Default sets X and Y, and the rest of its
Properties open. The Tab list ends with **➕ Add new Tab…**: the Label, Interface and Port are kept while the new Tab is named and built in Tab settings; once it is saved the Add Device box comes back with the new Tab picked and the Suggested Name made with it (Fritz, 2026-11-04). The **Add Device box** (Fritz's Pump example, 2026-11-04): 1 Label (⬢) and Label Visible, 2 Interface (board) with
**Available Ports** (a dropdown of the free pins) on the same line, 3 Tab; until they are done only the greyed out Device Type
shows below them. Then 4 the **Name** (the Suggested Name, which may be edited) shows, with Cover (a pump), X, Y, Width and Height. (Help 82)
*Replaced:* 1 Interface, 2 Available Ports/Pins, 3 Suggested Name, 4 Label, on the Build Tab (2026-10-28); before that
1 Interface, 2 Device Type, 3 Ports, then Label; Create (2026-10-23).

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
  the kind and then Add Device. Then **Vessel** and **⧉ Clone Device** (a list of the Devices on other Tabs) (Fritz,
  2026-11-05: "place vessel before clone").
- **Row 1, Widgets:** **Select Widget Type** and **Add Widget**, **Picture ➕**, **Text ➕**, **Manual Valve ➕**,
  **Override ➕**, **Boolean ➕** (a list of the types first, like Probe: Switch, Push Button, Pulse Button, LED, the
  ON / OFF Semi_Widgets_Devices of Rule 1.20), **Value ➕**, **Time ➕**, **DateTime ➕** (one click each, Rule 1.23)
  (Fritz, 2026-11-05). Row 1 is made tight so it all fits on the top line in a full HD (1920 wide) window; a narrower
  window wraps the last ones.
- **Row 2:** Draw pipe, Draw hose, **Draw QD hose** (Rule 5.28), **Elbows, Tees …** (fittings and IPs), **Add equipment ➕**
  (moved from row 1, Fritz 2026-11-05), the turn buttons, Lock, Lock
  the kind and then Add Device. Then **⧉ Clone Device** (a list of the Devices on other Tabs).
- **Row 1, Widgets:** **Select Widget Type** and **Add Widget**, **Picture ➕** (a Picture Widget, Rule 18.27), **Text ➕**, **Manual Valve ➕**,
  **Override ➕**, then **Add equipment ➕** and **Vessel** at the far right (Fritz's order, 2026-11-03).
- **Row 2:** Draw pipe, Draw hose, **Draw QD hose** (Rule 5.28), **Elbows, Tees …** (fittings and IPs), the turn buttons, Lock, Lock
  All, Unlock All, Tab settings, New tab, **👻 Hidden Tab** and its **orange ?** (a pop-up with how Edit layout
  works, the hint that was on row 3), Build Tab, To Build Tab, Processes, Preview, Save Build.
- **Row 3:** **Update Schema Version** (was Update Version), Save layout, Exit. A locked Equipment Profile warning
  still shows on row 3.
*Replaced:* the ➕ Add box of PR #117 (2026-10-27). *Replaced (2026-11-05):* row 1 Widgets ended with **Add equipment ➕** and
**Vessel** at the far right (2026-11-03).

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
**Exception, kettles stay upright** (Fritz, 2026-11-02: "Kettles can flip Horizontal but not vertical"): a kettle (a vessel of
the Vessel kind: kettles, HLT, mash tun, fermenter) has **Flip Horizontal only**: no Flip Vertical and no Rotate (turned 180 is
the same as upside down). An older kettle turned or upside down is set upright. Chillers, coils, the RIMS tube and fittings keep
the full set. (thread "Limit pipes to horizontal, vertical, 45", Help 105)

5.6 **A Skynet Template's picture is fixed.** A bottom-drain copy of a kettle changes only the
picture. (2026-10-23)

5.7 **Adding a Vessel asks: Widget or Integrated.** A Skynet Vessel Widget has no Devices, only
built-in IPs. **A User Bundled vessel Template must be built on a Skynet Vessel Widget**; there is
no other way to make one. (2026-10-23, PR #102)
*Exception (Fritz, 2026-11-05: "I think the exception is good"):* a Vessel **built from a Vessel Widget Template** becomes a
**Vessel Device** with parts built into its IPs (Rule 5.31, The Vessel Device). The Vessel Widget Templates themselves stay Widgets.

5.8 **A Template sent to a Tab becomes a Tab item** (Tab_Vessel, Tab_Fitting, a Device) that can be
deleted. What can be edited on it follows Rule 5.16. (2026-10-21; changed 2026-10-28)
*Replaced:* "... that can be edited and deleted, even when it came from Skynet." (2026-10-21)

5.9 **Equipment:** valves have no inlet or outlet side; a pump's only orientation is its **Orientation** (Flip Horizontal /
Flip Vertical, Rule 18.19; Fritz, 2026-11-04); BruControl
VGC outputs are valves. Equipment types have Type, ports, Position and Standard lists that users can
add to. (2026-10-04, PR #14)
*Replaced:* "pumps have no orientation setting" (2026-10-04).

5.10 **Flow rules:** flow only runs on pipes joined IP to IP, traced from running pumps. An OFF pump
lets flow pass either way. Valves must be open. Dead ends show nothing. A check valve passes one way
only. Fitting bundles flow both ways. Tap water valves push flow on their own. (2026-10-04, PR #3;
PR #47; PR #91)

5.11 **Everything is drawn to scale:** fittings and Devices with IPs grow with the Tab's pipe size.
(2026-10-04, PR #3)
Valves keep to this through the **Valve Standard** (Rule 5.29): every Skynet valve drawing is to the same scale in the same
300 x 300 box.
Pumps keep to this through the **Pump Standard** (Rule 5.27): every Skynet pump drawing is to the same scale in the same
300 x 300 box. (Fritz, 2026-11-05: "They could comply with the rule if we drew everyone in the same Ratio Box.")

5.12 **Kettle pictures are empty:** no wort or liquid drawn, and no heating element drawn on a plain
kettle. Each kettle has a plain and an _Electric version. (2026-10-22, 2026-10-23)

5.13 **Manual valves** make a running Process wait. A valve Device with Valve type Manual waits for a "Done"
pop-up (2026-10-20, PR #44). A **Manual Valve Widget** waits for a click on it on its Tab (Rule 5.15).

5.14 **Pipe fittings are only what they are.** A tee is only a tee (no Top Tee, Suction Tee or other Type),
an elbow only an elbow, likewise a reducer, U, cross and End Cap. Their settings are **.x, .y, .width,
.height**, **.visible**, **.hiddenlock**, **.lock**, **.tab** and a **Label** (Rule 1.21; Fritz, 2026-11-02), plus **Autosize to pipe** (on by default: the fitting takes the size of the pipes joined to its IPs;
Width and Height are greyed out until it is switched off). No Type or Connection Standard; turning and
flipping stay on the Edit layout bar's turn buttons (Rule 5.5). **Pipe fittings have no Clone.** A **check valve
is a pipe fitting too**: it is always one way, and its orientation shows the way. Valves and flow meters in a fitting
are **Devices**; a tee with a thermowell, or a thermowell on a vessel IP, is a kind of **Temperature Probe**
(Fritz, 2026-10-28).
(2026-10-28, thread "Simplify pipe fittings and Manual Valves", Help 87)
*Replaced:* "Their only settings are .x, .y, .width and .height ... No label" (2026-10-28); changed by Fritz 2026-11-02.

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
**The words Master and Daughter are never shown** (Fritz, 2026-11-03: "follow the Rule with Master and Daughter, but don't label
them as such"). The add lists show **one entry per valve** (its Master); its **Orientation** dropdown (Horizontal, Vertical Left,
Vertical Right, Front, Front Elbow, 45 degrees) picks the Daughter, and the picture and its IPs follow. Titles read
"valve: Orientation". On the Build Template Tab the Master is the **Main Template**. (thread "Explain Master and Daughter in Valve list")

5.18 **Build Template Tab** (Admin only): where a Template is made or edited, with all its Properties and,
on each attribute, a **"user can set"** tick box (shown on User versions, Rule 5.16). During the building
phase every Template made there is a Skynet Template (or is deleted before Fritz switches them all to
Skynet Templates); they are set (locked) only when Fritz says (Rule 9.6). The dialog is kept in production
for User Bundled Templates. It is **☰ Menu > Build Template**; the always-fixed attributes (pictures, Kind,
Valve type, Service, Look, tap behaviour) have a greyed-out box. (2026-10-28, thread "Lock Skynet Widget Templates
and IPs"; built 2026-10-29, Help 89)

5.19 **Pipes run only Horizontal, Vertical or 45 degrees** (Fritz, 2026-11-02). A pipe is one straight piece and **never
bends**; it changes direction only at a TC pipe fitting Widget (a 90° elbow from Horizontal to Vertical, a 45° elbow, a tee, a
cross), which Skynet puts where two pipes meet. **Pipe movement where a pipe end followed a moved item at any angle is retired**:
a pipe with its own open end moves along as one piece; a pipe moves its end only along its own line; an item moved off to the
side lets go of the pipe (the end gets an open-end coupling). Older pipes with bends are cut at each bend into straight pipes
joined by elbows when a Schema loads (Rule 15.2); the samples and the default Schema are changed (Rule 15.3). Hoses still bend.
(thread "Limit pipes to horizontal, vertical, 45", Help 105)
- **Joined again on Save layout** (Fritz, 2026-11-05: "maybe a resnap to IPs on Save Layout"). A pipe's open end within 14 px of an
  IP joins it again when the layout is saved. A straight pipe stays Horizontal, Vertical or 45: if joining would bend it, a free IP
  point with no other pipe on it moves back onto the pipe end instead. A click or double-click that wobbles under 4 pixels is not a
  drag, and only the pipe ends a drag pulls off let go (an end already off its IP stays joined, so moving one thing never cuts a pipe
  somewhere else on the Tab).

5.20 **Where the IPs go** (Fritz, 2026-11-02, with two drawings): on every Device and Widget an IP sits at **the center of
the opening**. On a TC pipe Widget (elbows, tees, reducers ...) and on any Device or Widget with TC ferrules, that is **the
center of the ferrule's outer face** (the flat end the clamp goes on), one IP for each open end. On a **front view** (looking
down the pipe) it is **the center of the opening**; a straight item seen from the front has both of its IPs there. Pipe
Widgets have **no flow direction** (a check valve is still the only one-way fitting, Rule 5.14). A **tee with a Temperature
Probe** in it is a **Temperature Device** subtype, not a pipe Widget: the probe fills one opening, so the other two are its
IPs. The Manual Ball Valve drawings are pictures of the **Manual Valve Widget** (Rule 5.15), which keeps its click-only
Open/Closed. (thread "Create pipe Widgets from Fritz's drawings", Help 110)

5.21 **Pipe and Hose Widgets and Flow Colors** (Fritz, 2026-11-03, thread "Add flow colors to pipe and hose Widgets", Help 116):
- A Pipe or Hose is a Widget, but it is **not in the Widget List**. The only way to make one is **Draw pipe** or **Draw hose** on the
  Edit layout bar (the Layout Menu), right on its Tab (see the exception under Rule 4.1).
- **Flow Color** on a pipe or hose (`.flow_Color`, `.flow` the same), on a Tab (**tab.flow_Color**, Tab settings) and on a Vessel (**Out
  flow color**). **None is the default** for each. The choices: None, **Tap** (Blue), **Strike** (Red), **Mash** (Brown), **Boil**
  (Reddish Brown), **Whirlpool** (Brown), **Ferment** (Golden), the primary colors (Red, Yellow, Blue, Green), Brown, Orange, Purple,
  Reddish Brown, Golden, and **RGB** (a color of your own).
- **The Tab in tab.flow_Color is the Tab with the focus** (the one each screen shows). All pipes and hoses on a Tab use the Tab's Flow
  Color, except: a pipe's own Flow Color (not None) overrides **Mash, Boil, Whirlpool and Ferment**; **flow that begins at a Vessel's
  outlet with an Out flow color takes that color**; **flow that begins at an IP with a Flow Color takes that color** (Fritz, 2026-11-03:
  every IP point has `.flow_Color`, None to start; an HLT outlet IP set to Red makes the flow leaving it Red); and, **first of all
  (#1), flow from a Tap Water Valve is always Blue** and overrides every other flow (Fritz, 2026-11-04). Order: Tap Water Valve, IP,
  Vessel, Tab (Tap, Strike, plain colors, RGB), the pipe, Tab (Mash, Boil, Whirlpool, Ferment); all None = the standard light blue.
- **Flow Color is the only Process attribute of a Pipe or Hose** (`Pipe_1.flow_Color = Orange`, `tab.flow_Color = Mash`, and an IP's
  `IP_1.flow_Color = Red`). What a Process
  sets lasts until set to None, another Schema is loaded, or the panel restarts.
- **A Pipe or Hose follows the general Rule for Labels** (Rule 1.21, 2.18): a user can add a Label, edit it and Show it (it sits in the
  middle of the pipe). Its Name is given by Skynet (Pipe_1, Hose_1). **Exception: no Position or Size.** X, Y, Width and Height could never
  be useful to a user (a pipe is where it is drawn), so they are **hidden** in its dialog. (Fritz changed this 2026-11-03: first he had
  the Name and Label greyed out too.)
- Older Schemas (Rule 15.2): a pipe's old start Flow color (#4fb3ff) becomes None; any other color it had is kept as an RGB color.
- **Pipes and hoses start at None and follow the Tab Flow Color** (Fritz, 2026-11-04). The orange (#ffb347) every pipe in the
  sample Schemas had becomes None once in each Schema; a color picked after that is kept.

5.22 **Proportional Valves** (Fritz, 2026-11-03, thread "Add BruControl KLD20T proportional valve", Help 117). The Valves list has
**Skynet Proportional Valves** for valves on the market and one **User Defined Proportional Valve** for any other. The first
Skynet one is the **BruControl KLD20T** (1/2" NPT, SS304, 24 VDC, 0-5 VDC signal): an Analog Output, 0-100 %, a Skynet Template
set under Rules 5.16 and 5.17 (one entry, Orientation Horizontal / Vertical Left / Vertical Right / 45 degrees; its signal and
range are fixed). The User Defined Proportional Valve replaces "Proportional valve 0-100 % (analog output)": its own pictures,
signal and range, and In / Out spots like the User Defined Motorized Ball Valve (since Rule 5.29 they move and size the picture
onto the standard IP spots). More Skynet Proportional Valves only when
Fritz names them, and no new pictures without his word (Rule 13.3).

5.23 **Valves and pumps sit centered on their pipes** (Fritz, 2026-11-04, with a drawing, thread "Center pumps and valves on pipes",
Help 121). A pipe joined to a valve or pump runs straight on through it: the IPs sit on the picture's own pipe or port (Rule 5.20),
and the valve or pump is moved across (left or right on an up-and-down pipe, up or down on a level one) until each IP is on its pipe's
line. **The pipes stay where they are; the valve or pump moves.** This is done for every Tab as it is shown and once when Edit layout
opens, so Save layout keeps it. Two pipes that would move it different ways (drawn out of line) leave it as it is. Hoses bend, so a
hose just goes to the IP. The older ball valve pictures (from BruControl; since 2026-11-05 named Motorized_TC15_Ball_Valve_Horizontal and _Vertical)
have their pipe spot set too. A picture Skynet doesn't know (a user's own) keeps its IPs in the middle of its sides; on a valve those are the Valve Standard
spots, and the User Defined valve's In and Out spots move its picture onto them (Rule 5.29).

5.24 **Ball valves have two IPs, one at each pipe end, in every Orientation, and every Skynet Pump has IPs on its inlet and outlet** (Fritz, 2026-11-04: "Ball Valve Devices and Widgets
should have IPs", thread "Add IPs to Ball Valve Devices and Widgets", Help 123). Where they go is Rule 5.20. Since 2026-11-05 every valve's spots are those of the Valve Standard (Rule 5.29).
- **Skynet Motorized Ball Valve Device:** Horizontal, Vertical Left and Vertical Right on the ends of its pipe, Front both at the
  center of the opening, and **45 degrees on the ends of its pipe, turned with the picture** (before, a 45 degree valve put them on
  the corners of its box). The 45 degree turn works the same for every Skynet valve drawing.
- **Manual Valve Widget** (the hand-turned ball valve, Rule 5.15): **two IPs instead of one in its middle.** Plain drawn valve:
  its left and right ends; side view: the outer face of each ferrule; front view: both at the center of the opening; front elbow:
  the center of the opening and the bottom ferrule's outer face; a user's own picture: the middle of its left and right sides.
  They turn with Rotate 45 (Rule 5.5). A closed Manual Valve blocks both ends. It sits centered on its pipes like other valves
  (Rule 5.23).
- Older Schemas (Rule 15.2): a pipe joined to the middle of a Manual Valve is joined to the nearer end (two pipes take one end each)
  when its Tab is shown and when Edit layout opens; Save layout keeps it.
- **Every Skynet Pump has an IP on its inlet and its outlet** (Fritz, 2026-11-04: "All Skynet Pump should have IPs on the inlet Out
  Let"), in both Orientations (Right, Left) and with any Cover: on the Skynet pump drawings (March, Chugger, Riptide, Topsflo, KegLand)
  the tip of each port, as before; on the older Riptide-style pictures (Pump_<color>_Rip_Off / _On, .svg or .png, every color and
  No Cover) the outer face of the inlet union on the pump head and the top of the outlet pipe; on the sump pump the middle of its
  screen (inlet) and the top of its riser (outlet). A pump picture of a user's own keeps them on the middle of its sides.

5.25 **TC Pipe Fittings is a Widget subclass** (Fritz, 2026-11-04: "Widget Subclass TC Pipe Fittings"; "Clean up any svg that have
broken or missing end. I like the way you install them when pipes need them. There is a need to add manually as well. They should
all have IPs and they become Skynet Widgets"; thread "Make Fritz's elbow and tee into SVG Widgets", Help 124).
- Every elbow (90 and 45), tee (the normal Tee and the Instrument Tee), cross, U, reducer, check valve and End Cap is a Skynet
  **TC Pipe Fittings Widget**: a Skynet drawing with an IP on the outer face of each ferrule (Rule 5.20), Autosize to pipe, and the
  settings of Rule 5.14. Its Properties title reads "TC Pipe Fittings Widget: <name>".
- **Skynet puts them in where pipes need them** (Rule 5.19): where pipes meet at a corner, or three or four at one point, the joint
  becomes the TC Pipe Fitting the pipes need, turned the right way, its bend (where its pipes' center lines meet) on the joint and
  each pipe ended on one of its IPs. A pipe drawn to the bend of one turns it back into a joint, so an elbow becomes a tee and a tee a
  cross. Two pipes in line still join on one IP (a coupling). Autosize grows a TC Pipe Fitting about its bend.
- **A loose pipe end that meets another pipe joins it** (Fritz, 2026-11-05): on another loose end the two become one joint (an elbow,
  or a coupling when in line); partway along another pipe, away from its IPs, that pipe is cut in two there and the joint becomes a
  tee. Skynet then puts in the TC Pipe Fitting. A pipe that only crosses another one in its middle does not join it.
- **A tee or a cross dropped on a pipe cuts it** (Fritz, 2026-11-05: "Tried to add a Tee to a Pipe and it did not divide";
  thread "Fix Tee and valve not splitting a pipe"): in Edit layout, a Tee, Instrument Tee or Cross with no pipes on it dropped on
  a straight pipe moves across onto the pipe's line (turned about its bend if its run went across the pipe) and the pipe is cut
  into two pipes, one on each end of its run; the branch stays open. Over an open end the pipe is made shorter and joins it.
  The first piece keeps the pipe's Name, Label and Flow Color, as in Rule 5.26.
- **They are also added by hand:** Edit layout bar > Elbows, Tees … and Add Widget > TC Pipe Fittings (on the Build Tab, Rule 4.1).
  The older equipment pipe fittings (Pipe tee, Pipe 90° and 45° elbow, Pipe cross) are no longer in the Add lists; ones already on
  a Tab still draw.
- **A fitting with a Temperature Probe is a Device**, a Temperature Device subtype (Probe Tee), not a TC Pipe Fitting (Rule 5.20).
- **Every drawing has whole ends:** no ferrule or pipe end is cut off by the picture's edge.
- Older Schemas (Rule 15.2): an IP elbow, tee or cross becomes its TC Pipe Fitting when its Tab is shown in Edit layout; Save layout
  keeps it. The samples and the default Schema are changed (Rule 15.3).

5.26 **A pump or valve put on a pipe cuts the pipe** (Fritz, 2026-11-04: a Pump added between the ends of a
Pipe divides it in two separate pipes joined to its IPs; dropped on the end of a pipe "it needs both IPs": the pipe is shortened and
the pump or valve connects with its IPs; thread "Split a pipe when a pump is added", Help 125).
In Edit layout, when a Pump, a Valve (on/off or Proportional) or a Manual Valve Widget that is not on any pipe yet is dropped on a
straight Horizontal or Vertical pipe (or added right on one):
- **Between the pipe's ends:** the pipe is cut into separate pipes, one joined to each of its IPs. The first keeps the pipe's
  Name, Label, size and Flow Color; the new ones take the next Pipe_N names and the same size and Flow Color.
- **Over one end of the pipe:** the pipe is made **shorter** and joined to its IPs. An **open end** goes away: the pipe joins one
  IP and the other IP is the new open end. An end on a **tee, an elbow, a vessel port or another IP** stays where it is: the pump
  or valve slides back along the pipe, clear of it, and **both IPs are joined**, one to the shortened pipe and one by a short new
  pipe to what the end was on (Fritz, 2026-11-04: "it needs both IPs").
- A piece runs straight on into an IP that faces along the pipe (Rule 5.23: the pump or valve moves across onto the pipe's line).
  An IP that opens across the pipe (a pump's outlet on top when the pipe is level, or its inlet on the side when the pipe runs
  up and down) gets its piece **taken round with 90 degree elbows**: out of the IP, across past the side of the pump, and back
  onto the pipe's line (Rule 5.19: a pipe turns only at a fitting). Flip the pump (Orientation Right / Left) before dropping it
  to choose which side its inlet is on.
- Nothing is cut when the item is still joined to another pipe (a message says so; one dragged off its pipes lets them go first, Rule 5.19, and then cuts the pipe it is dropped on), is Locked, the pipe is a hose or a 45 degree pipe, a 45 degree valve, a front
  view valve, or when there is not enough pipe left to go round or to put it in; a message says why. Undo by Exit without saving.

5.27 **The Pump Standard: every pump in the same 300 x 300 box, with its IPs in the same spots** (Fritz, 2026-11-05: "They could
comply with the rule if we drew everyone in the same Ratio Box. We could make it a 300 x 300 for all Pump Drawings and by default
display as 150 x 150 which was the Size of my Rip Off Pump svgs"; thread "Standardize pump size and IPs", Help 130).
- **Why:** a pump put in the same place as the one it replaces must stay joined to the same pipes.
- **Every Skynet pump picture is drawn in a 300 x 300 box:** the brew pump drawings (March, Chugger, Riptide, Topsflo, KegLand), their
  Cover Overlays, and the older Riptide-style pictures (Pump_<color>_Rip_Off / _On, every color and No Cover).
- **The IPs are always in the same spots** (Orientation Right): the **inlet** at **(285, 150)** of the box (the middle of its height,
  near the right side) and the **outlet** at **(243, 56)** (near the top right). Shown at **150 x 150** that is (142.5, 75) and
  (121.5, 28). Orientation Left mirrors them. The IPs stay on the tips of the ports (Rule 5.20, 5.24).
- **To scale (Rule 5.11):** the brew pump drawings are all the same scale, 20 units = 1 inch in the box (10 at 150 x 150). Where a
  pump's ports are closer together than the spots, its **port tube is drawn longer** (straight tube only) to reach them. The older
  Riptide-style pictures came from BruControl at their own scale; their inlet and outlet pipes are made a little longer the same way.
- **A pump shows at 150 x 150 to start.** A pump can still be resized; the spots grow with its box, so two pumps of the same size
  and X, Y always line up.
- **Older Schemas** (Rule 15.2): once per Schema, a Pump Device or Picture Widget showing a Skynet pump picture becomes 150 x 150
  about its middle; Rule 5.23 then puts it back on its pipes.
- The **sump pump** is not a pipe pump (it sits in the liquid and draws in through its screen), so it keeps its own box. A **User
  pump** picture keeps its IPs in the middle of its sides.

5.28 **Quick Disconnects and Quick Disconnect hoses** (Fritz, 2026-11-05: "a Widget that is a Quick Disconnect that can be placed on an
IP of a Valve. Many home brewers have a manifold but move a pipe from source to source ... a special hose that connects to a Pump but
can be run to a vessel or an IP. The hose end could be run anytime, not just in edit mode"; thread "Add movable quick disconnect hose",
Help 127).
- **The Quick Disconnect Widget** sits on an IP, most often a valve end. It is Fritz's **bold red four-point star with a grey center**
  (his drawing, 2026-11-05: "I want it easy to see on a Tab"), never smaller than 40 px. In Edit layout it snaps onto the nearest IP
  within 30 px and follows it; dragged off, it comes off. With a hose on it, it passes flow to the IP under it; with nothing on it, it
  is shut (no flow).
- **The Quick Disconnect hose** (**Draw QD hose**, Edit layout bar) hangs from a **pump IP**. Its **free end can be moved at any time,
  not only in Edit layout**: with the **right mouse button** (Rule 2.9) on a computer, a **finger** on a phone or tablet (this is
  running the brewery, so it works in run mode, Rule 2.35). Dropped on an IP or a Quick Disconnect it joins it (a Quick Disconnect wins
  over the IP under it); anywhere in the **top third of a vessel** it is the same as putting the hose in the vessel's top (the whole top
  third is one big IP); anywhere else the end is loose and no flow shows. Operators and admins can move it, the move is kept at once
  for every screen, and a 🔒 locked hose does not move.
- Flow and Flow Colors are as for every hose (Rules 5.10, 5.21). A hose in a vessel's top is an end of the line like a vessel port;
  flow pumped from it takes that vessel's Out flow color.
- **Exception to Rule 2.11** (waiting on Fritz's pick: this exception, or a change to Rule 2.11): only the free end of a Quick
  Disconnect hose moves outside Edit layout; everything else on a Tab still moves only in Edit layout.

5.29 **The Valve Standard: every valve in the same 300 x 300 box, with its IPs in the same spots** (Fritz, 2026-11-05: "All Valves
follow the 300 x 300 with IPs in the same place so easy to change a valve from Ball to Butterfly or Manual to Motorized. So a new Rule
for Valves, even User ones. The graphic will be resized to 300 x 300 and IPs placed correctly on a User Created valve. The IPs are
placed at the same Points of the Graphic. I know this may offset the View a little, But I think the consistency is better";
thread "Standardize valve size and IPs", Help 131).
- **Why:** a valve swapped for another kind (Ball for Butterfly, Manual for Motorized, a Skynet one for a user's own) in the same
  place stays joined to the same pipes.
- **Every Skynet valve picture is drawn in a 300 x 300 box** with its pipe running **through the middle of the box**: the Motorized
  Ball and Butterfly valves, the Manual and Manual Butterfly valves, the Gas Solenoid valves and the older Motorized_TC15 ball valves,
  in every Orientation. They are all drawn **to the same scale** (Rule 5.11), and where a valve is shorter than the box its pipe is
  drawn on, straight, out to the edge of the box (as the Pump Standard lengthens port tubes, Rule 5.27).
- **The IPs are always on the same spots:** Horizontal at the middle of the left and right sides, **(0, 150)** and **(300, 150)**;
  Vertical Left and Vertical Right at the middle of the top and bottom, **(150, 0)** and **(150, 300)**; 45 degrees on the
  Horizontal spots turned about the middle; a front view (looking down the pipe) both at the middle, **(150, 150)**; a front elbow at
  the middle and the middle of its bottom, **(150, 300)**. The IP is on the end of the valve's pipe (Rule 5.20).
- **A valve shows at 150 x 150 to start** (the same as a pump, so the two are to the same scale). It can still be resized; a square
  box keeps the spots on its sides.
- **A user's own valve picture** (User Defined Motorized Ball Valve, User Defined Proportional Valve, or a picture picked for a valve)
  **is resized to fill the square box** and its IPs go on the same spots for its Orientation. When its **In and Out spots** are set
  (the ⬢ beside Path (closed), or the % boxes), the picture is moved and sized so those spots sit on the IPs. The view may be a little
  off; the consistency is worth it.
- **Older Schemas** (Rule 15.2): once per Schema, every valve with a picture (and a Picture Widget showing a Skynet valve picture)
  becomes square about its middle: 150 x 150, or smaller where a pipe joined to it is too short for its IPs to move out that far.
  Rule 5.23 then keeps it on its pipes.
- Not in this Rule: the **Manual Valve Widget** (Rule 5.15) sizes itself to its pipe like a pipe fitting, and the **check valve** is a
  pipe fitting (Rule 5.14).

5.30 **Probe tees and thermowells have IPs and go in pipes like tees** (Fritz, 2026-11-05: "On Probes make sure that the Thermowells,
Instrument Tees, and Long Tees have IPs. On Tees, they need to match the Widget Tees IP Placement. The tees need to Break a Line if
added to a Pipe or hose just as normal tees"; "A thermowell placed on a Front Facing IP needs the graphic to change to the same as a
Probe (Circle TEE). In fact, Probes placed on the Front have an implicit Thermowell"; thread "Add IPs to probe thermowells and tees",
Help 132).
- **Tees with a Temperature Probe** (Instrument Tee and Long Tee, probe in the branch or in from the end; Temperature Devices, Rule
  5.25) are the **same size as the TC Pipe Fittings Widget tee of the same shape** (Tee 160 x 102, Instrument Tee 160 x 69) with their
  **IPs on the same spots**: the center of each open ferrule face (Rule 5.20). The probe fills one opening, so they have two IPs.
- They **Rotate** (0, 90, 180, 270) as well as Flip; the picture and its IPs follow.
- **Dropped on a straight pipe in Edit layout, a probe tee cuts it as a tee does** (Rule 5.25): probe in the branch, its run goes along
  the pipe (it is turned if its run was across the pipe) and the pipe is cut in two, one piece on each end; probe in from the end, its
  open end goes on the pipe and its branch is taken round with 90 degree elbows (as a pump's port, Rule 5.26). Over an open end the
  pipe is made shorter. It then takes the pipe's size, about its bend, as a TC Pipe Fitting does.
- **A tee dropped on a hose cuts the hose** (a TC Pipe Fittings Tee, Instrument Tee or Cross, or a probe tee): the tee stays where
  it is and each piece of the hose goes to one end of its run (a probe tee: its two IPs). Not a Quick Disconnect hose (Rule 5.28) or a
  locked hose. Pumps and valves still don't cut hoses (Rule 5.26).
- **A Thermowell has one IP**, on the outer face of its TC cap (it fills the opening it is in, so no flow goes through it). It Rotates
  and Flips. Dropped in Edit layout with its IP within 30 px of another IP (a tee's branch, a vessel port), it **snaps on**.
- **On a front facing IP** (an opening seen face-on: a port on the front of a vessel, the opening of a front view valve or elbow) a
  Thermowell shows **from the front**: the round TC cap with the probe (purple) in its middle (Skynet_TC15_Thermowell_Front.svg,
  40 x 40), its IP in the middle. Dragged off, it shows from the side again.
- **A plain Temperature Probe dropped with its middle on a front facing IP has an implicit Thermowell**: it becomes a Thermowell seen
  from the front. Dragged off again, it is the plain probe it was (its look and size come back).
- In the samples, the Three Vessel sample shows a Short Thermowell picture on each vessel beside its reading (since Rule 5.31, drawn by its Vessel Widget).

5.31 **The Vessel Widget class: one Master Template with every spot, each with a Place slider** (Fritz, 2026-11-05: "New Class
Vessel Widget. Start making it with the Vessels you have on 3 Vessel Sample. There will be Skynet Templates that will have IPs pre
placed and Locked in position (user cannot change). There will be one Temperature Probe (Front or Thermowell) ... that is Place or Not
Place ... There will be one Element Port that also have the Place Slider. Make the IPs the same with Place Sliders then there will be
only a single Template to start that would have all the IPs I can think of ... Set all the Place slider to true on the Master
Template"; thread "Build the Vessel Widget class", Help 133).
- **One Skynet Template to start, Skynet_Vessel_Widget** (the Main Template, Rule 5.17; the word Master is not shown). Its picture is
  the Three Vessel sample's tank (260 x 320) drawn the Skynet way (Rule 7.4, 5.12: Images/Skynet/Vessels/Skynet_Vessel_Widget.svg).
  Its spots (*changed* by Fritz's **Vessel IP Template** drawing, 2026-11-05, thread "Lay out Vessel Master Template IPs"): **15 IPs**.
  **Right side, top to bottom: Sparge, HERMS In, HERMS Out, Element; the Right side is repeated on the Left** (Left Sparge ... Left
  Element). **Left and Right Back Element** (face-on, level with the side Elements). **Center Probe**, **Left and Right Tangential**,
  **Center Outlet** and the **Center Bottom Outlet** (on the bottom). Plus **one Temperature Probe**, **Front** (seen from the front,
  on the Center Probe spot; the Template's choice) or a **Thermowell** (in from the side), and **one Element Port** (on the Right
  Element spot). **Every Place slider is on** on this Template.
  *Replaced:* "the IPs Outlet (center bottom), Second Outlet, Tangential, Top Inlet, Sparge, CIP and Steam Slayer" (older Vessel
  Widgets, like the Three Vessel sample's, keep those spots).
- **The IP names are general only** (Fritz, 2026-11-05: "These are General Names but names are meaningless. An Element could be placed
  on any one. so no restrictions on IPs that are not already in effect."): anything with an IP can go on any of them.
- **Each IP has a Label** (Fritz, 2026-11-05: "Name the top on Sparge. The Label can be chosen by the User But start with the Name and
  Label the same"): it starts the same as its Name, the user can change it in Vessel Widget Properties, and an empty Label goes back
  to the Name (never blank, Rule 18.15).
- **The Vessel Device** (*one exception* to Rules 5.7 and this Rule, Fritz 2026-11-05: "When we build off a Template, It Becomes
  that Special Vessel Device." "Treat it just like the RIMs DEvice." Thread "Build locked Vessel Device from Template", Help 133):
  - A Vessel built from a Vessel Widget Template is a **Vessel Device**, a special Device like the RIMS tube. An **Element**, a
    **Temperature Probe**, a **Thermowell with its probe** or a **Valve** put on one of its IPs is **an integral part of it, not a
    separate Device** (Fritz: "they are not separate devices themselves"), locked to that IP. Its Interface and each part's Port
    are set in the Vessel's Properties, as the RIMS tube's element and probe are; each shows its reading or On / Off like the
    RIMS tube's and can't be deleted on its own.
  - A part fills its IP: an Element, Probe or Thermowell closes it (no flow); a Valve passes flow only while it is on.
  - **HERMS coil:** Left or Right. It goes on that side's HERMS In and HERMS Out IPs as **a layer under them**, drawn to fit them
    (the coil's look follows the Template's IPs), and the coil's ends **are** those two IPs, locked together: flow in one comes out
    the other.
  - **Once it is built and saved** (on a Tab, not the 🔨 Build Tab, and the layout saved), **its IPs (Place), parts and HERMS coil
    can't be changed and it can't be un-bundled: there is no way back** (Fritz: "No Way to Back Out Once Built and Saved"). Its
    Name, Labels, Gallons, Tab and place can still change.
  - The **RIMS tube Template is a kind of Vessel Device Template** (Fritz, 2026-11-05: "the Element and Probe are set and Locked.
    Just the shape and # of available IPs are fixed and shown"); it keeps its own Properties (Rules 5.3, 18.10).
  - *Replaced for a Vessel Device:* "a user can change the Place sliders on their copy" and "A Placed Probe or Element links a
    Device the Schema already has".
- **Place** (a switch for each spot, in Vessel Widget Properties): on = it is on the vessel and works (an IP joins pipes, hoses and
  fittings; the Probe and Element show their pictures, and the Element glows while its heater is on). Off = it is not there: nothing
  shows on a Tab and nothing (a pipe, a Process) can use or change it. *Changed (Fritz, 2026-11-05, Rule 19.4):* a Not Placed spot
  is hidden even on the Build Tab and in Edit layout; **👁 Show All** in the Vessel's Properties shows it.
  *Replaced:* "only in Edit layout a faint mark shows where it would go."
- **The spots are set by the Template and locked:** a user can't move an IP, the Probe or the Element Port.
- **IPs on a vessel** (Fritz, 2026-11-05): an IP is a TC, NPT or BSP outlet or inlet; the type does not matter, it is a place to
  connect another Device or Widget with its own IP (a Pipe, Hose, Fitting or anything with an IP).
- **The plan** (Fritz, 2026-11-05): more kettle Templates are built from the Main one with their Place sliders set to match real
  kettles, so a user picks the one closest to theirs; a user can change the Place sliders on their copy and add Devices and Widgets of
  their own, and Bundle them into a User Bundled Template (Rule 5.7).
- A Placed Probe or Element links a Device the Schema already has. *Waiting on Fritz's pick (Rule 5.7: "A Skynet Vessel Widget has
  no Devices, only built-in IPs"):* a Placed Probe making its own Device (Interface, Port, Probe Type), and the Element likewise.
- The Three Vessel sample's HLT, Mash tun and Boil kettle are Vessel Widgets (Outlet and Thermowell Placed; the Element on the HLT
  and Boil kettle; the Top Inlet on the Mash tun and Boil kettle).

---

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
  **When Clicked** (each time someone sets it on its Tab), When a Process starts, **In a Group**, At a date and time (once), At clock time (every day at that time), Every N ms /
  seconds / minutes / hours / days, Every 00:00:00. The **At clock time** box shows only when **At clock time** is
  picked; the Every choices have no clock time (Fritz, 2026-11-04). **What to send** is its main value unless another attribute is picked.
  `send_db Name` in a Process sends it now, whatever the setting, **even when it is Off** (Fritz, 2026-11-05: kept
  `send_db Name`, no `send_Now` command).
- **Database Groups** (Fritz, 2026-11-05): **In a Group** puts the item in a **Group**. A Group has a **meaningless hidden key**
  (the items point to it) and a **Group Name**. The Process line **`send_db_group Group_Name`** sends every item In that Group,
  **each time** it runs. **➕ Add new Group…** ends the Group list; **✏ Change name** changes the Group Name and **every Process**
  follows (Update All), like Rule 3.11. **Once is gone** (Rule 15.2): each Schema's Once items go **In the Group named Once**.
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
Motorized Ball Valve) has two switches, **On Close List** and **On Open List** (Fritz, 2026-11-05, renamed from Close all list / Open all list), both **on to start**.
`close_all_valves` and `open_all_valves` in a Process (and PreBrew's house cleaning) use them; `all_pumps_off` turns every pump off.
**A tap water valve is always on Close all and never on Open all**, and its Properties show this with no switches (the Brain puts it
back on every save). A Manual valve is on neither list. (thread "Build the Standard Skynet Brew Process", Help 100)

6.16 **Moving from BruControl needs no new hardware (Windows Brain only)** (Fritz, 2026-11-03). Every way a BruControl
Windows PC connects to its boards has an equal way in Skynet, so a brewer moving from BruControl keeps the same boards, shields,
wiring and cables: the same board types (Arduino Mega 2560, Adafruit Grand Central M4, ESP32, ESP8266, Feather M0, Arduino Due, and
the BruControl UniShield / UniFlex built on them), the same links (USB on the same COM port, Ethernet, WiFi), and the same pin
numbers (BruControl numbering, Rule 6.2). Which pin does what is set from the Brain, never by editing firmware, so anything wired
for BruControl works as it is. The only change allowed is **loading Skynet firmware onto the board once**, over its USB cable, from
inside Skynet (no Arduino IDE), with WiFi or network settings set the same way. Skynet does not copy BruControl's private firmware
language. This Rule is for a Windows Brain only, because BruControl runs only on Windows. Gaps and plan: docs/BruControl_Connections.md.
(thread "Match BruControl's Arduino connections on Windows")

6.17 **Deadband Device, as in BruControl** (Fritz, 2026-11-05: "Add Deadband", "look at BruControl's Deadband Control"). A
Deadband is its own control output Device (Type ID **DBand**), next to Duty Cycle, Hysteresis and PID. It reads an Input and,
every **Calc Time**, steps its output % toward the **Target**:
- within **± Deadband Offset** of the Target the output is left alone (the whole Deadband is twice the offset);
- within **± Inner Band Offset** (outside the Deadband) it moves by the **Inner Band Drive**;
- further out it moves by the **Outer Band Drive**.
Below the Target the output goes up, above it goes down; **Reversed** turns that round (cooling). It starts at the **Initial
Output** when Enabled. On a PWM pin (PWM output on) the pin follows the output %; on an on/off pin it is on for that % of each
**Output window** (a Duty Cycle). The Skynet way (Rule 15.1): the output is a **%** (0-100), not BruControl's 0-255, so Import
changes the Initial Output and the two Drives to % and says so. Like the PID it counts as a heater, is On while Enabled
(Rule 7.9) and can share a heater's port (Rule 6.1). Starting values: Deadband Offset 0.5, Inner Band Offset 2, Initial Output 0,
Inner Band Drive 1, Outer Band Drive 5, Calc Time 10 s, Output window 2 s. (thread "Add Deadband control", Help 126)

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
*2026-11-05 (Fritz):* every Skynet **Open valve picture** is retired to Delete/ (Rule 15.3); the two-picture code stays for a
user's own pictures. Pump On pictures stay in Skynet, but nothing that ships uses them (Rule 7.8). Help 129.

7.6 **Sounds** go in media/sounds; pictures in media/Images. (2026-10-20, PR #48)

7.7 **The Image Library is never added to automatically.** A new picture goes into
docs/Image_Library.md (and the Image_Library folder) only when Fritz says to commit it.
(2026-10-27)

7.8 **Skynet Standard: On overlay when On / True is the preferred way** for on/off Devices and
Widgets, and for heaters (Rule 7.9). Two pictures (on and off) are still allowed where needed. This
is new in Skynet; BruControl never had it. In Properties the overlay comes right after the picture
and the second picture comes last, marked optional. (2026-10-27, Help 58)
**Skynet valves have no Open picture** (Fritz, 2026-11-05: "I generally want to get away with changing the background picture for
switching from Off to On. Better to use the Overlay in all the sample Schema."): a valve keeps its one picture and its On overlay
shows open (the bolt on a motorized valve, the green ring and tick on a Manual Valve Widget). The sample Schemas and the default
Schema swap no pictures: pumps, valves and burners keep their Off picture with the bolt overlay, a heating element glows red
(tint). Help 129.

7.9 **Heaters are On while Enabled.** A PID, Hysteresis or Duty Cycle counts as On from Enable to
Disable (not only while its output fires): its overlay or On picture, a vessel's heater glow and a
Picture Widget that turns on with it all follow Enabled. A PWM output is On above 0 %.
(2026-10-27, Help 58, Help 74)

7.10 **Background pictures are .backpath, .backpath_2 and .backpath_3** (Fritz, 2026-11-02, thread "Rename image paths to
backpath", Help 25). Every Device and Widget with background pictures has three paths: **.backpath** (Image Path 1),
**.backpath_2** (Image Path 2) and **.backpath_3** (Image Path 3), e.g. `my_Widget.backpath = "Images/Skynet/Pumps/xxx.svg"`.
**.background** picks which one shows: **1** = .backpath, **2** = .backpath_2, **3** = .backpath_3; **0** or **any number over
3** = no background; **blank** sets .background to **0**. Setting a path does not change .background; `my_Widget.image =
"path"` is the shortcut that sets .backpath and .background = 1. All three can be changed in Properties (except on a User
version of a Skynet Template, Rule 5.16) and by a Process; changing 2 or 3 in Properties pops up the one-picture heads-up.
Under Rule 15.2 the old names **imagePath_1, _2, _3** are changed everywhere (Schemas, Processes, samples, predictive text,
the BruControl importer); an older item with a picture and a blank background gets .background = 1 so it still shows.
**Exception, a User pump** (Fritz, 2026-11-04, Rule 18.19): one path only, its Image Path; a Skynet pump drawing has none
(its Graphic is set). **At most 3:** no item has more than 3 background pictures; an older item with a 4th or more keeps only the first 3
(stacked BruControl copies with more than 3 are handled when the importer is built). **Not every item has a backpath:** most
Widgets have none; the Graphic Widget is the one that normally does.
*Replaced:* imagePath_2 and imagePath_3 worked as in BruControl and a blank background showed imagePath_1 (2026-10-27).
Before that, after a BruControl import imagePath_2 and _3 were locked (2026-10-05).

7.11 **Picture Widget: Turns on with** picks what turns it on: any on/off Device or Widget (output,
switch, input, alarm, sound player, timer, true/false variable) or a heater (on while Enabled).
**None** = a still picture, and its On pictures (Picture when on, On overlay) are greyed out. The
pictures are picked from the Picture list. (2026-10-27, Help 74)

7.12 **The Alarm Widget has two subclasses**, picked when it is made and never changed (Fritz, 2026-11-02, thread "Make the
Alarm Widget a Template", Help 107):
- **Basic Skynet Alarm:** a set Skynet bell picture that can't be changed, in three versions (Together, Back only, Fore only;
  Images/Skynet/Alarms/Alarm_Basic*.svg; Fritz will send his own drawings to replace them). It is drawn in layers, bottom up:
  **Layer 4 Back** (colored by **.back**), **Layer 3 Fore** (the bell, colored by **.fore**; never the text), **Layer 2 Set
  Graphic** (a short list of Skynet pictures, **None first**), **Layer 1 Active overlay** (on top while **.active** is true,
  None first). Back and Fore use the standard color list. Standard Label attributes and the standard Alarm attributes.
- **User Alarm:** its own background picture (Image Path 1), a Set Graphic that is any picture (Layer 2), an Active overlay,
  and **.backcolor** (.back) behind it. Standard Label and Alarm attributes.
An Alarm made before 2026-11-02 keeps working as before.

7.13 **Pump Cover Overlays** (Fritz, 2026-11-02, thread "Draw SVGs for common brew pumps", Help 111): a pump picture is drawn in
layers, bottom up: the **pump picture** (a Skynet no-cover pump drawing), the **Cover overlay**, then the **On overlay**. The cover
has a see-through background and shows on and off. **One cover for each color, and every cover fits every Skynet pump** (Fritz,
2026-11-05: "1 of each Color that I ask For and User created ones that just change the color using RGB. All Covers can overlay any
Pump"). A cover is a color, not a drawing: each Skynet no-cover pump drawing has one cover outline and one cover shape
(Images/Skynet/Pumps/Covers/), and Skynet fills the shape with the cover's color. The **Skynet colors** are the ones Fritz asks for:
**Red, Yellow, Blue, Green, Purple, Orange and White** (White is RGB 250 250 250, #FAFAFA). The **User Cover** is the same cover in
any color the user sets (standard color list or Custom RGB). A new color needs no new drawings. A Pump Device has **.cover** (None,
Red, Yellow, Blue, Green, Purple, Orange, White, User; **None is the default**) and **.coverColor** (the User cover's color).
*Replaced (2026-11-05):* each pump had its own cover file in every color (about 96 files); those are in Delete/.

7.14 **Every new Alarm meets the new Alarm standard** (Rule 7.12: a Basic Skynet Alarm or a User Alarm). **Old Alarms**
(made before 2026-11-02, in the samples and Schemas) **are changed to the new Basic format one by one**, using Basic Alarm
Widget formats Fritz will make; nothing is converted until then. The list of old Alarms is docs/ExistingAlarms.md (not
the OakBarn Schema). (Fritz, 2026-11-02, thread "Build the Basic and User Alarm Widgets")

7.15 **Powered valves and pumps show a lightning bolt when On** (Fritz, 2026-11-04, with a drawing, thread "Center pumps and
valves on pipes", Help 58 and 121). The Skynet On overlay **Lightning bolt, red and yellow** (Images/Skynet/On_Off/Overlay_Bolt.svg,
steady, not flashing) sits over the middle of the picture while it is On (a valve open, a pump running, a Proportional Valve above
0 %). Every new motorized valve, Proportional Valve and Pump Device starts with it, and the Skynet valve Templates have it set.
**Lightning bolt, flashing red and yellow** (Overlay_Bolt_Flash.svg) is a choice in the On overlay list, not the default (Fritz,
2026-11-04: "the flashing Bolt is good, but the default should be the single bolt that is not flashing"). Once per Schema, each one
that had no On overlay gets the steady bolt, and one that got the flashing bolt from the first version is changed to the steady one
(Rule 15.2); one with another overlay keeps it, and picking (none) or the flashing bolt afterwards stays. A Manual valve has no power,
so it has none. New pumps from the pump picker keep the Green glow ring (Rule 18.13; Fritz: leave it, the default may change later or
go into Panel Defaults).
*Replaced:* the flashing bolt was the default (2026-11-04, PR #179).

## 8. Sign-in and roles

8.1 **Roles:** viewer, operator, admin. Any new screen that changes things is Admin-only or
Operator-only. Only Admins edit Schemas or move pictures. (2026-10-04, PR #8; 2026-10-21)

8.2 **First Admin setup** works only from your own network or Tailscale. The recovery code screen
must be impossible to miss: a big code, copy, download and print, and a required "I saved it" tick.
(2026-10-04, PR #11)

8.3 **Password rules** are set by the Admin in Settings > Password rules. Old passwords keep working.
(2026-10-21, PR #53)

8.4 **Password key** (Fritz, 2026-11-05): every new-password box (Admin setup, Forgot password, Settings > My account,
Settings > Users > Add user) has Skynet's own **key** button that makes a strong password following the Password rules
(Rule 8.3), fills it in both boxes and shows it so it can be written down. Skynet has its own key because a browser's
"Suggest strong password" key needs the browser signed in and syncing, and the clean window never syncs (Rule 9.8).
(thread "Restore generate password Key on fresh install", Help 10)

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

9.8 **Start Fresh on an existing install** (Fritz, 2026-11-02): when an installer (the Windows Setup .exe, the Mac
.command, the Linux / Pi .sh) finds the panel already installed, it first asks **"Delete all users and Schemas and Start
Fresh?"** (No is the default). **Yes** shows a second warning that **all existing data will be deleted**, listing what goes,
with **No (back out, nothing deleted)** as the default. Confirmed, it deletes `config` (Schemas, Tabs, Devices, settings),
`data` (users, passwords, sign-ins, recovery code, brew log, saved values) and `scripts` (Processes) for good, with no
backup, and the panel starts again from the samples with Admin setup. **Kept:** `media` (pictures and sounds, Rule 7.3) and
the `backups` folder. (thread "Add Start Fresh option to installer", Help 18)
**Fresh is fresh** (Fritz, 2026-11-05): Start Fresh on Windows also deletes the clean window's own browser profile (Rule 2.36,
`%LOCALAPPDATA%\SkynetBrewer\AppWindow`), which holds the user name and password the browser saved. Admin setup always opens
with **empty** boxes: it is marked as a new account and, for as long as setup is open, any box you have not clicked, typed or
pasted in is kept empty, even when a browser fills it in later. Skynet's clean window never syncs with a Microsoft or Google
account (Edge signs new profiles in by itself and synced the old login back in). Saving your password still works: it is
kept only in Skynet's own window and fills in on Sign in as before.
(thread "Make Start Fresh admin setup truly fresh")

9.9 **Move to a new Brain** (Fritz, 2026-11-03): someone who runs the Brain on a Windows, Linux or Mac computer can move it to a
Raspberry Pi later (or any Brain to any other), with **☰ Menu > Move Brain** (Admins), in three steps:
1. On the **old** Brain, **Make a Brain Move file**: one file, `Skynet_Brain_Move_<YYYYMMDDTHHMMSS>.skynetmove`, with every Schema
   (and its saved gGlobal values), panel setting, Profile, Recipe, Template, Process, picture and sound in the media folder, the
   logins and recovery code, and the brew log. It is **locked with a Move password** (typed twice, at least 6 characters), because
   it holds the logins and the hidden keys (Rule 3.10). Making it changes nothing on the old Brain. Browser sign-ins and other media
   folders are not in it.
2. On the **new** Brain (a normal fresh install), **Bring in the file** with the same password: it is checked first (a wrong
   password or a damaged file changes nothing), then **Move in now** stops the panel and, as it starts again, puts the old Brain's
   files in place. The new Brain's own config, data, scripts and media are **kept** in `backups/before_brain_move_<date>`, never
   deleted. Everyone signs in with the old Brain's user names and passwords.
3. **USB ports**: each old USB port (COM3) is changed to the new Brain's (/dev/ttyACM0) in **every Schema at once**, Simulator
   boards included. A board the old Brain saw is found by its serial number and picked for you. It can be used any time, not only
   after a move. Ethernet and WiFi boards keep their address.
(thread "Move a computer Brain to a Pi", Help 119)

## 10. Testing

10.1 **Updates keep logins.** Installing a new version never removes users, passwords, sign-ins or the
recovery code. They are removed only when the installer's Start Fresh question is answered Yes and the
warning is confirmed (Rule 9.8). There is no Testing mode switch. (Fritz, 2026-11-03, thread "Keep logins
after installing a new .exe")
*Replaced:* "Testing mode is on: every newly merged version wipes all logins, so Fritz starts fresh with
Admin setup. It stays on until he is in real use." (2026-10-04)

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

10.7 **The Simulator bar** (yellow 🧪 SIMULATION bar) can be hidden with **▴ Hide** on the bar or ☰ Menu >
🧪 Hide Simulator bar, per screen. **Hidden, the bar is gone completely** (no strip), so the browser window is free for
the Panel; a small 🧪 on the ☰ Menu button says it is still Simulation. In Simulator mode **☰ Menu > 🧪 Show Simulator
bar** brings it back (changed 2026-11-04, Fritz: "keep the browser window as free as possible for the Panel"; it was a
thin 🧪 SIMULATION strip that always stayed). Hiding changes no setting.
**Each time the Simulator is switched on, the bar opens at 25× speed with Auto skip on**; after that
the user's choices stay until the next switch on. (2026-10-28, thread "Improve the Simulator bar
defaults", Help 85)

10.8 **The 1, 2 and 3 vessel Sample Schemas can be cloned to a User Schema** (Clone a Schema lists
them after the user's own Schemas, as 🧪 Sample). The clone is a normal User Schema, always loaded at
once, on the simulator (Rule 10.6). The OakBarn Brewery sample is not offered for now. (2026-10-28,
thread "Improve the Simulator bar defaults", Help 85)

## 11. Help pages

11.1 **Every new feature gets a Help page** (or an update to one) when it merges. Help pages are
Markdown files in help/ on the Brain, numbered for order. Next free number: **136**. (2026-10-04,
Markdown files in help/ on the Brain, numbered for order. Next free number: **138**. (2026-10-04,
PR #16)

11.2 **New Help headings and ☰ Menu tabs** are added to the right-click Help map. (2026-10-21,
PR #57)

## 12. Privacy and sharing

12.1 **Nothing is posted or announced anywhere without Fritz's word.** The announcement goes only to
a few BruControl friends. (2026-10-04)
*Replaced in part:* "never make the repo public" (2026-10-04). On 2026-10-22 Fritz said "Public is
fine" for the GitHub repo, which the Get Skynet pictures feature needs.

12.2 **Beer money donations can go to at most 2 PayPal accounts.** It is **locked now with only Fritz's
PayPal account**, in one file (lib/donation.js, owned by @oakbarn). It is unlocked only when Fritz gives the
second PayPal account (that may never happen); once that account is added it is locked again. Nobody can
add, change or delete a PayPal account from the panel, and the Prime Developers cannot either. (Fritz,
2026-11-02, thread "Expand Buy a Beer and Patron support")
*Replaced:* "The Beer money donation recipient is locked to Fritz's PayPal in one file and can never be
made editable again." (2026-10-04, PR #18)

12.3 **Patron payments are not Beer money.** They are split by percent between several PayPal accounts:
every Patron payment goes to one collecting account and a Prime Developer runs a Pay Out by percent
(Option A). The Patron accounts and percents are changed only by the Prime Developers as a group, on
GitHub, and **every** Prime Developer must approve (100%). Rule 12.2 covers Buy a Beer only. (Fritz, 2026-11-02, thread "Expand Buy a Beer and Patron support")

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

15.3 **Old style goes to the Delete folder.** When a new Rule, standard or Skynet Template replaces an old way, every
sample Schema, the default Schema, the Skynet Templates and every other file Skynet ships are changed to the new way in
the same change. The files that are no longer used are **moved to the `Delete/` folder** of the repo (same folder path
inside it, with a line in `Delete/README.md` saying what replaced each one), **never deleted**; Fritz decides when a
file there goes for good. `Delete/` is not used by the panel and is left out of the release zip and the installer.
First use: the old Ball valve pictures (Valve_Ball_*) gave way to the Skynet Motorized Ball Valve Device Templates
(Rule 5.17) in the 2 and 3 vessel samples and the default Schema. (Fritz, 2026-10-31, thread "Update samples to the
new valve and Rules")

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

17.7 **The Hops tab follows Fritz's layout** (2026-10-31): one line per hop with no limit (**Add Hop +**, **Delete** on each
line): Hop N name, amount, AAU % **Recipe** and **Actual**, **Calc oz** (the amount to use with the Actual AAU), then for a
Boil Hop: Hop N Min, Drop, IBU, Boil Group. The square box opens the **Outside of Boil Hops** dialog (switches: Mash, 1st WORT,
Secondary, DRY, Whirlpool; Cancel and Save). A hop with a switch on is not a Boil Hop: the dialog stays on its line in place of
Min, Drop, IBU and Boil Group until the switch is off. Secondary and DRY have a Date and Days; Whirlpool has Temperature, Min
and a Hop Rocket switch. Lines go in order on Calculate and Save: Boil Hops by drop time (Start of Boil first, then by
Minutes), then Mash, 1st WORT, Secondary, DRY, Whirlpool. **Actual AAU starts at 0** (imported or new). **Calculate checks
that every Actual AAU is above 0**; if any is 0, nothing is calculated, Skynet switches to the Hops tab, highlights each Actual
AAU that is 0, and shows Fritz's warning (set the Actual AAU to the AAU on the Hop Package; the real IBUs come from it) with
a **READ** button to close it. (Fritz, 2026-10-31 12:15Z) Each line's
boxes are Skynet_Fields `rcp_Hop_N_...` plus `rcp_Hop_Count` (Rule 17.2). (Help 99)

17.8 **Grain tab and Fermentable tab** (Fritz, 2026-10-31): the Grain tab holds the fermentables of Type Grain (Type hidden);
the Fermentable tab holds every other Type with a Type dropdown (the BeerXML types Adjunct, Extract, Dry Extract, Sugar; a
fixed list, so no Add new ...). Boxes: Name, amount, **Potential** (yield %), **SRM** (color), and **After
Boil**, a switch shown only for Types added during or after the boil (Extract, Dry Extract, Sugar, Fruit, Juice). No limit on
lines. Skynet_Fields `rcp_Grain_N_...`, `rcp_Fermentable_N_...`, `rcp_Grain_Count`, `rcp_Fermentable_Count`. (Help 99)
**Grain tab layout (Fritz's Grain_Tab.png, 2026-10-31):** Grains, Add Grain +, then Grain N, the weight, Potential, SRM (brown
header), **PPG>SG** (gravity points, worked out), Delete. No After Boil on the Grain tab (grain is never added after the boil).
The weight is shown in the **grain weight standard** picked on ☰ Menu > Default (Skynet field `skn_XML_Grain_WT_Standard`,
Pounds or Kg; a .bsmx or BeerXML import is shown in it) under a label set only on the Default tab
(`skn_XML_Grain_WT_Standard_Label`, empty = the standard's name). The PPG>SG label is set on the Default tab too. Gravity
points = Potential x 46.214 x pounds x efficiency (grains and adjuncts; 100% for extracts, sugars, fruit, juice) / batch
gallons; the Recipe tab's **Expected Gravity** (`rcp_Expected_Gravity`) = 1 + all points / 1000, worked out when an amount
changes and by Calculate.
**Fermentable tab layout (Fritz's Fermentable_Tab.png, 2026-10-31):** Fermentables, Fermentable +, then Fermentable N, Amount,
**Measurement**, **Type**, Potential, SRM, PPG>SG, After Boil, Delete. Measurement (lb, oz, kg, g) and Type (Adjunct, Extract,
Dry Extract, Sugar) are select-only dropdowns with the BeerXML standard's lists; each line keeps its own Measurement. A
BeerSmith-only Type on an imported line (Fruit, Juice) stays in that line's list.

17.9 **Adjuncts tab** (Fritz, 2026-10-31: "in a like manner", he checks it once built): the recipe's Misc items (Whirlfloc,
yeast nutrient, gypsum, spices). Adjuncts, Adjunct +, then Adjunct N, Amount, **Measurement**, **Type**, **Use**, Time (Boil Min
for a Boil adjunct), **Time Unit**, Delete. The dropdowns are select only, with the BeerXML lists (Measurement: mg, g, oz, lb, kg,
ml, tsp, tbsp, cup, pt, qt, l, gal, items; Type: Spice, Fining, Water Agent, Herb, Flavor, Other; Use: Boil, Mash, Primary,
Secondary, Bottling; Time Unit: min, hr, day, week). Adjunct-type fermentables (flaked grains) stay on the Fermentable tab
because they add sugar. A Boil adjunct gets alerts like a hop (Rule 17.4). Skynet_Fields `rcp_Adjunct_N_...`,
`rcp_Adjunct_Count`. (Help 99)

17.10 **MASH tab and Waters tab** (Fritz, 2026-10-31: "Mash Profile and Water Profiles can be built as well"). MASH: the
Mash Profile dropdown (Skynet Templates, the user's own, or the Recipe's own mash). A picked profile shows read only (Step N,
Temp, Time, then Sparge Type, Sparge Temperature, Batch Rest, Mash Out); **Copy into this Recipe** makes it the Recipe's own
mash, which is edited here (Mash Step +, Delete, the Recipe's sparge boxes). Waters: the Water Profile dropdown, the minerals
after the distilled or RO cut, % distilled, SO4 : Cl and pH (read only; the profile is changed on ☰ Menu > Water Profile), then
the waters the recipe file listed. Skynet_Fields `rcp_Mash_Step_N_Name/Temp/Time`, `rcp_Water_Ca`, `_Mg`, `_Na`, `_SO4`, `_Cl`,
`_HCO3`, `rcp_Water_Distilled_Pct`, `rcp_Water_SO4_Cl`, `rcp_Water_PH`. Two more Skynet Mash Profile Templates (Fritz):
**Skynet Single Step, Batch Sparge** (152 °F 60 min, mash out 168 °F, batch sparge, 10 min rest) and **Skynet 3 Mash Steps, Fly
Sparge** (122 °F 15 min, 146 °F 30 min, 158 °F 20 min, mash out 168 °F, fly sparge at 168 °F). (Help 99)

## 18. General Dialog Rules

Fritz's **New General Dialog Rules** (2026-11-02, thread "Add the New General Dialog Rules"). His drawing of the layout is
[docs/General_Properties_Dialog_Format.png](General_Properties_Dialog_Format.png) (a Text Widget as the example). Changed so far: the Alarm Widget, the **Pump Device** (Rule 18.12), the **Motorized Ball Valve** (Rule 18.23) and the **Heating Element** (Rule 18.24).
[docs/General_Properties_Dialog_Format.png](General_Properties_Dialog_Format.png) (a Text Widget as the example). Changed so far: the Alarm Widget, the **Pump Device** (Rule 18.12), the **Motorized Ball Valve** (Rule 18.23) and the **PWM / Analog out** (Rule 18.25).
[docs/General_Properties_Dialog_Format.png](General_Properties_Dialog_Format.png) (a Text Widget as the example). Changed so far: the Alarm Widget, the **Pump Device** (Rule 18.12), the **Motorized Ball Valve** (Rule 18.23) and the **Temperature Probes** (Rule 18.26).
[docs/General_Properties_Dialog_Format.png](General_Properties_Dialog_Format.png) (a Text Widget as the example). Changed so far: the Alarm Widget, the **Pump Device** (Rule 18.12), the **Motorized Ball Valve** (Rule 18.23) and the **Picture Widget** (Rule 18.27).

18.1 **The Up Arrow icon** (a red up arrow ⬆) beside a field opens a **String Entry Dialog**: a bigger box to type the
string in, with ✖ Cancel and 💾 Save. There are two sizes: **2 lines** and **30 lines**. Word wrap and the Rich Text
embedded codes (`\b`, `\i` ...) are allowed in both.

18.2 **The Attribute Dialog icon** (a red hexagon ⬢) beside a field opens an **Attribute Pop Up Dialog** (a Properties
pop-up) for the attributes of that field. Example: a Label's pop-up holds its Back and Fore colors and the rest of its look.

18.3 **A Device or Widget that has a Label: the Label is the first field.**
1. It has a **Show** slider (switch) (Rule 2.18).
2. **The Label cannot be blank.**
3. **BruControl import:** a blank Label is filled in with the item's Name (Rule 15.1; not built yet, waits for Fritz's go).
4. It has an **Up Arrow** that opens the **2 line** String Entry Dialog.
5. It has an **Attribute Dialog icon** that shows the Label's attributes (the Label pop-up: Label, Visible, Font size, Font,
   Bold, Fore color, Back color, Alignment).
6. The Label becomes part of the **Suggested Name**,
7. which follows the Suggested Name Rule (Rule 3.1 for Devices),
8. and the Suggested Name is filled into the Name field.

18.4 **The Name field** has **no Up Arrow** and **no Attribute icon**, and **cannot be blank**. It starts with the Suggested
Name, which the user may edit; it must be unique (Rules 3.3, 3.4). Once built, the Name is locked and changed only with
✏ Change name (Rule 3.11).

18.5 **Common attributes may follow** the Label and Name, some with an Attribute Dialog icon.

18.6 **An Up Arrow may sit beside any field whose `.value` is a String.** Example: the Text field of a Text Widget, whose
Up Arrow opens the **30 line** String Entry Dialog.

18.7 **A field may have both icons** (Up Arrow and Attribute Dialog icon), like the Label.

18.8 **Background picture:** a Device or Widget with a background path has a **text dropdown** field for **Image Path 1**
(`image.path_1`) that also takes a new typed entry. This field has an **Attribute Dialog icon** that opens the **Graphic
Dialog** pop-up.

18.9 **The philosophy:** the most common fields are set on the opening dialog; an Attribute icon leads to the extra actions
or fields. Example: the Graphic Background shows only Image Path 1 on the opening dialog; every other path attribute or
choice is in the Graphic Dialog pop-up. Likewise the item's own Properties (Visible, Hidden Locked, Tab, X, Y, Width,
Height) can sit in a "... Properties" pop-up opened with the Attribute Dialog icon beside that heading.

18.10 **One dialog at a time.** Each Widget or Device dialog is changed to these Rules **one at a time, only when Fritz
commands it**. Until a dialog is changed, it keeps its present layout (Rules 2.22 and 2.23 still describe those). When one
is changed, it follows Rule 15.3 (the old way is changed everywhere Skynet ships it).

18.11 **Cancel warns before throwing away changes.** In every dialog with ✖ Cancel and 💾 Save, if anything was changed and
Cancel is pressed, a warning asks whether to really discard the changes or go back and save. With no changes, Cancel just
closes (Rule 2.17). (Fritz, 2026-11-02)

18.12 **The drill-down: Pump Device Properties is the standard for every Device** (Fritz, 2026-11-03, thread "Set the
drill-down dialog standard for Devices"; his drawing [docs/Pump_Drill_Down_Format.png](Pump_Drill_Down_Format.png)). The Pump's
dialog is the first one changed to Rule 18 (Rule 18.10) and is **the starting standard for all Devices added**; every other
dialog will work the same way when Fritz commands it, one at a time. From the top:
1. The title (**Pump Device Properties** and its **?**), then 🗑 Delete, ✖ Cancel, 💾 Save (top and bottom, Rule 2.17).
2. **Visible**, **Hidden Locked** and the 🔓 lock.
3. **Pump Properties ⬢**: the hexagon beside the heading opens the **Properties pop-up**: Visible, Hidden Locked, the lock, Tab,
   X Horizontal, Y Vertical, Width, Height, and 🗑 Delete, with ✖ Cancel and 💾 Save.
4. **Label ⬆ ⬢** (Rule 18.3): the arrow opens the 2 line String Entry Dialog, the hexagon the **Label pop-up** (Label, Visible,
   Font size, Font, Bold, Fore color, Back color, Alignment). Then **Show label**. A blank Label becomes the Name on Save, so a
   Label is never blank (Rules 1.13, 18.3).
5. **Name** (Rule 18.4), the Suggested Name and the Device Type it is made from.
6. The Device's own fields, the most used first, each extra in a pop-up: for the Pump, **Interface**, **Pin ⬢** (Invert,
   One-shot time, One-shot pulses OFF), **When tapped ⬢** (Tap target, Ask before changing) and Kind; **Picture ⬢** (On
   overlay, Picture when on), Cover, **Background picture (Image Path 1) ⬢** (the Graphic Dialog, Rule 18.8); **Text when
   on ⬆ ⬢** (Hide the text, its font size, colors, alignment, Look, Border) and **Text when off ⬆**.
7. Database and .API last (Rule 6.14).
A field shown both on the dialog and in a pop-up is the same setting: saving the pop-up updates the dialog. Nothing is saved
until 💾 Save on the dialog. (Help 115)

18.13 **Adding a Pump** (Fritz's Add Pump drawing, 2026-11-04, [docs/Add_Pump_Format.png](Add_Pump_Format.png)):
1. **Pumps > Pump, on / off (relay or SSR)**, then 2. **Pick the pump**: a list of the Skynet pump drawings (March 809 and 815,
   Chugger, Blichmann Riptide, Topsflo TD5, KegLand MKII), each with its picture. The pick is the Pump's Picture, with the green
   On overlay and Cover None to start.
3. The Add box is titled with the pump (e.g. **Blichmann Riptide**). Besides Rule 4.2's fields it has the **Label ⬢** (Label
   pop-up), **Label Visible**, **Cover**, **X (Horizontal)**, **Y (Vertical)**, Width and Height, and the **Device Type** greyed
   out, read only (Pump: it comes from the list it was picked in). X and Y typed here are kept.
4. Once ➕ Add Device is pressed, its Properties (Rule 18.12) show the **Interface (board)** and **Port** greyed out and set, **for
   good** (Fritz, 2026-11-05: it is physical wiring, so a user almost never changes it; the Device keeps its hidden key, Rule 3.10,
   and only its Name changes, with ✏ Change name). To wire it to another board or pin, delete it and add it again. **Tab, X, Y, Width and Height** on the dialog itself (they are in the Pump
   Properties ⬢ pop-up too); the **Device Type** greyed out, read only; and the Name with ✏ Change name once built (Rule 3.11).
The Add box follows Rule 4.2's order (1 Label, 2 Interface, 3 Port, 4 Tab, 5 Name) and the pump goes on the picked Tab (Rule 4.1).
(Help 115)

18.14 **"Add new ..." in a dialog pauses it and comes back** (Fritz, 2026-11-04, a general Rule): when **➕ Add new ...** (a new
Tab, Interface, Style, unit, picture ...) is picked in a dropdown of a dialog, the calling dialog **keeps what was entered so far
as temporary data and pauses**; the new thing is made in its own dialog; once that is saved the calling dialog **comes back with
the temporary data filled in again**, the dropdown **refreshed**, and **the new thing picked**. Cancel while making it makes
nothing and goes back to the calling dialog as it was. The first one built this way: ➕ Add new Tab… in the Add Device box
(Rule 4.1); ➕ Add new Interface… already works this way. Other dialogs are brought to it one at a time, when Fritz says (Rule 18.10).

18.15 **The opening pattern of every new Device dialog** (Fritz, 2026-11-04): **1 Label, 2 Interface, 3 Port, 4 Tab**, then
**5 the Suggested Name** made from them (Rule 4.2), before anything else. **Label Visible starts at No** (Fritz, 2026-11-04: the standard for every new Device dialog).
   **The standard for every new Device dialog** (Fritz, 2026-11-04): the **Label, Interface, Port and Tab are filled in first**;
   no other property shows until all four are done (only the greyed out Device Type). **➕ Add Device** can always be pressed:
   until all four are done it looks faded and pressing it says what is still missing (Fritz, 2026-11-04: "Add Device button
   does not work"; a greyed out button gave no reason on a phone). Then the hidden properties appear, with
   the **Name** (the Suggested Name) on top of them, then the rest (Cover for a pump, X, Y, Width, Height ...). The Label must be
   filled in (Label Visible off does not skip it). The Add Device box has it now.
   *Changed (Fritz, 2026-11-05):* **A Device or Widget must have a Label, and a Label can't be blank.** Some Devices and Widgets
   have their Label **filled in for you** with the pattern **Type_n**, n the next number not used yet: a **Motorized Ball Valve**
   starts as **mBV_1**, then mBV_2 ... (Fritz: "Pumps do NOT have Auto Fill, Valves do"); a **Temperature Probe** as **tP_1** (Rule 18.26). It can be changed like any Label. When the
   Label is filled in (by you or by the program) on a Build dialog, **the focus jumps to the next field** in the Enter order (the
   next one still empty). **Every Label is editable by the user**, filled in for you or not. Which Devices and Widgets fill in
   their Label is decided **dialog by dialog: Fritz says so when each dialog is built** (Fritz, 2026-11-05). Every other dialog that
makes a new Device (for now the RIMS tube and the Integrated Electric Kettle New Device box) gets it one at a time, when Fritz
says (Rule 18.10).

18.16 **Short field names, the rest in a tip** (Fritz, 2026-11-04, his Pump example): a field's name is short ("Label",
"Interface (board)"); the longer explanation is in its **tip**: hover the name (dotted underline) to see it, or tap it for a
small pop-up with Close. The Add Device box has it now; other dialogs get it one at a time (Rule 18.10).

18.17 **Dropdowns of Interfaces and Tabs read "ID: Name"** (Fritz, 2026-11-04): an Interface as `BM: Brewery Mega`, a Tab as
`BH: Brewhouse`, everywhere they are picked.
*Replaced:* the Interface list showed the full name first, `Brewery Mega   (ID BM_)` (Fritz, 2026-10-27).

18.18 **Device Type shows its General Type first** (Fritz, 2026-11-04): where a Device Type is shown, it reads
`General Type: Type`, for example an On/Off Pump as `DO: Pump`. The saved type stays as it was (digitalOut, typeCode Pump)
so nothing conflicts, and the Suggested Name still uses the Type (Pump). General Types: **DO** (Digital Out), **PWM**,
**HYS** (Hysteresis) from Fritz; AO (Analog Out), DI (Digital In), AI (Analog In), TEMP, FLOW, SCALE, STEP (Stepper),
DUTY (Duty Cycle) and PID proposed, waiting on Fritz's OK. A type with no sub-type shows only its General Type.

18.19 **A Device dialog shows its Graphic with its Orientation** (Fritz, 2026-11-04, the Pump first): the Add box and the
Properties show the **Graphic** (the picture as it will be on the Tab, with its Cover) and an **Orientation** dropdown (a pump: **Right**, as
drawn, or **Left**, mirrored; Fritz's screens 7-9). Changing the Orientation flips the Graphic on the dialog and the Device on the Tab,
and its IPs follow (Rule 5.5). A **Skynet pump drawing's Graphic is set**: no path is offered (Rule 5.6), the Picture is shown
greyed out with its pump name. A **User pump** (its own picture) has **one path only**, its Image Path (an exception to Rule
7.10's three paths). Cover is for the Skynet pump drawings only (Rule 7.13). (Help 115)

18.20 **Focus and the Enter key in a dialog** (Fritz, 2026-11-04, his Blichmann Pump Sequence 1-9,
[docs/Blichmann_Pump_Sequence.png](Blichmann_Pump_Sequence.png)): the field with the focus has a **blue border**. Inside a dialog
**Tab** moves field to field and **Enter jumps to the next field** (from the last field to the Save button); Enter no longer
saves from a field. **Exception, a new Device:** until it is added, Enter (or picking from one of its dropdowns) jumps to the next
field of its sequence: 1 Label, 2 Interface, 3 Available Ports, 4 Tab, then Orientation (a Pump), then the **➕ Add Device**
button, where Enter adds it. The Name, Cover, X, Y, Width and Height are skipped by Enter (Tab or a click reaches them). The box
opens with the focus on the first empty field of the sequence. Arrow keys change a dropdown without jumping on. (Help 82)

18.21 **Pump Device Properties are Fritz's screen 9** (2026-11-04, [docs/Blichmann_Pump_Sequence.png](Blichmann_Pump_Sequence.png)):
the title is the pump (e.g. **Blichmann Riptide** ?) with the 🔓 lock, **Visible** and **Hidden Locked** on the title line; 🗑 Delete,
✖ Cancel, 💾 Save; **1. Label** ⬆ ⬢ and **Label Visible**; **2. Interface (board)** with **Available Ports** on the same line
(greyed out for good, Rule 18.13); **3. Tab**; **4. Name** and the Suggested Name; the **Graphic**; its **Path** (greyed out on a
Skynet pump drawing, editable on a User pump, Rule 18.19); **Orientation** (Right / Left); **Cover** with **Toggle** (On/Off, Push
button, None: what a tap does) on the same line; just below it the **Overlay** (the On overlay, Rule 7.15; Fritz,
2026-11-04: "add an Overlay DDLB just below the Cover DDLB", in the Add box too), and on its line **Database and .API ⬢**:
the hexagon opens the Database and .API settings in a pop-up, in the Add box and the Properties (Fritz's screen 7); **X, Y, Width, Height**; the **Device
Type** (DO: Pump) greyed out last. A User pump has the same Properties. **Only these** belong to a Pump: the old Hidden Locked row,
Pump Properties ⬢, Pin ⬢ (Invert, One-shot), When tapped ⬢, Kind, Picture ⬢, Background picture ⬢ and Text when on / off are gone
from its dialog (what a Pump already has set is kept). The On / Off text is shown with an **Overlay** instead (Rule 7.13).
*Replaced:* for the Pump, Rule 18.12's list of fields (2026-11-03).
*Replaced (Rule 18.13):* the Interface and Port each had **✏ Change** to change them on purpose (2026-11-04).

18.22 **Each Device and Widget has only its own Properties** (Fritz, 2026-11-04): besides the Universal Properties (Rule 1.21),
a Device or Widget may have a limited set of attributes and Properties, only the ones that fit it (the Pump: Rule 18.21). Other
dialogs are changed to their own set one at a time, on Fritz's say (Rule 18.10).

18.23 **Adding a Motorized Ball Valve: the Pump's drill-down without a Cover** (Fritz, 2026-11-05: "Create a Motorized Ball Valve
Add Dialog using the Pump Drill Down Format. Valves do not have covers but every thing else the same.", thread "Add Motorized Ball
Valve drill-down dialog", Help 128):
1. **Valves (or On/Off) > Motorized Ball Valve, open / closed (relay)**, then 2. **Pick the valve**, each with its picture:
   **Skynet Motorized Ball Valve** or **User Defined Motorized Ball Valve** (its own pictures). The two rows the lists had for them
   are now this one row (Rule 15.3).
   Its Label starts filled in as **mBV_n** (the next number), so the focus starts on the Interface (Rule 18.15).
3. The Add box is titled with the valve and works as the Pump's (Rules 4.2, 18.13, 18.15-18.17, 18.20): 1 Label ⬢ and Label
   Visible, 2 Interface with Available Ports, 3 Tab; then the Name, the **Graphic**, its **Path**, **Orientation** with **Toggle**
   on its line, **Overlay** with **Database and .API ⬢** on its line, **Tap water valve**, **On Close List** and **On Open List**
   on one line, X, Y, Width, Height, and the Device Type greyed out last. Fritz, 2026-11-05: "It should look and feel almost a
   copy of the Pump dialogs": two fields on one line in the Pump's dialogs are on one line here too. Enter goes Label,
   Interface, Ports, Tab, Orientation, ➕ Add Device. **No Cover** (Covers are for pumps, Rule 7.13).
4. Its Properties are the Pump's screen 9 (Rule 18.21) without the Cover, plus the valve's own set (Rule 18.22): **Tap water
   valve**, **On Close List** and **On Open List** on one line (a tap water valve shows its Tap end instead, Rule 6.15).
5. Its Type ID is **eVlv** (Fritz, 2026-11-05, was E_L_Vlv; the Device Type reads **DO: eVlv**). Valves named before keep their
   names (Rule 3.5); the Brain upgrades the stored Type ID on load.
- **Skynet Motorized Ball Valve:** the Path is greyed out (set by its Template, Rule 5.6) and follows the Orientation; the
  **Orientation** (Horizontal, Vertical Left, Vertical Right, Front, 45 degrees) picks its Template (Rule 5.17), with that Template's
  Width and Height; **Toggle and Overlay work normally**, as on the Pump (Fritz, 2026-11-05: "Toggles and Overlays should work
  normally"): an exception to Rule 5.18's fixed tap behaviour and overlay for this valve only; its Templates list them as user
  settable. It starts with On/Off and the steady bolt (Rule 7.15).
- **User Defined Motorized Ball Valve:** **Path (closed)** with a ⬢ for its In and Out IP spots (Rule 5.22) and **Path (open)** (a
  valve shows open and closed, so the User pump's one-path exception is not used); Orientation Horizontal, Vertical, 45 degrees
  Left or Right; Toggle and Overlay can be picked.
- Gone from these dialogs, as for the Pump (what a valve already has set is kept): Pin ⬢ (Invert, One-shot), When tapped ⬢, Kind,
  Picture ⬢, Background picture ⬢, Text when on / off, Flip Horizontal / Vertical (the Orientation does it), Valve type and Service.
  The Motorized Butterfly Valve and the Proportional Valves keep their present dialogs until Fritz says (Rule 18.10).

18.24 **Adding a Heating Element: the Pump's drill-down without a Cover** (Fritz, 2026-11-05: "Same with Heating Element but
instead of the Electric Kettle, Basic have Vessel Device Template and Choose then Build", thread "Build Heating Element Add dialogs
like Pump", Help 137):
1. **Heating Element (or On/Off) > Heating element, on / off (relay, SSR or contactor)**, then 2. **Pick the heating element**, each
   with its picture: **Skynet Heating Element** (the Skynet element drawing, its Path set, Rule 5.6) or **User Defined Heating
   Element** (its own Path (off) and Path (on)).
3. The Add box is titled with the element and works as the Pump's and the Motorized Ball Valve's (Rules 4.2, 18.13, 18.15-18.17,
   18.20, 18.23): 1 Label ⬢ and Label Visible, 2 Interface with Available Ports, 3 Tab; then the Name, the **Graphic**, its **Path**,
   **Orientation** (Right / Left) with **Toggle** on its line, **Overlay** (None to start: the on picture glows) with **Database and
   .API ⬢** on its line, X, Y, Width, Height, and the Device Type greyed out last (**DO**). **No Cover.** It still asks before it
   turns on (Rule 2.33). Label auto-fill (Fritz, 2026-11-05, Rule 18.15): a Heating Element's Label fills in by its control mode as **hE_Mode_n**: PID
   **hE_PID_1**, Hysteresis **hE_HYS_1**, Duty Cycle **hE_DutyC_1**, PWM **hE_PWM_1**, On/Off **hE_DO_1**, Deadband **hE_DeadB_1** (n the
   next number not used yet for that mode). *The hE_ start and the _n end wait on Fritz's OK.*
4. Its Properties are the Pump's screen 9 (Rule 18.21) without the Cover; the Interface and Port are greyed out for good (Rule 18.13).
5. **Vessel Device Template: Choose, then Build.** In the Heating Element list it takes the place of *Electric kettle, basic*
   (which stays in the full Add Device list, Devices: Skynet). **Choose** a Vessel Template that has an Element Port (the Vessel
   Widget, Rule 5.31, first), then the Heating Element is added as above; **Build** puts the Heating Element on the picked Tab
   (Rule 4.1) and a copy of the Vessel Template on the 🔨 Build Tab with its **Element Placed and linked** to the new Heating
   Element. The Vessel keeps no Devices of its own (Rule 5.7): the Heating Element is its own Device, which the Element spot links
   (Rule 5.31).
- Heating elements built into a RIMS tube or an Integrated kettle, and the PID, Hysteresis, Deadband and Duty Cycle heaters, keep
  their present dialogs until Fritz says (Rule 18.10).
18.25 **Adding a PWM or Analog output: the Pump's drill-down** (Fritz, 2026-11-05: "PWM Build Dialog", thread "Build PWM Add dialog
like Pump", Help 136): a **PWM output** and an **Analog output** (0-10 V, 4-20 mA), from the PWM / Analog out list or the Pump speed rows,
get the Pump's Add box and Properties (Rules 4.2, 18.13, 18.15-18.17, 18.20, 18.21):
1. The Add box is titled **Add PWM Output** or **Add Analog Output 0-10V**: 1 Label ⬢ and Label Visible, 2 Interface with Available
   Ports (only free PWM pins), the **Device Type** (PWM or AO to start; P_Pump, P_Fan ... can be picked, since this kind has more than
   one, Rule 4.2), 3 Tab; then the Name, the **Graphic**, its **Path** (one picture, the same on and off; optional, with none it shows
   its value), **Overlay** with **Database and .API ⬢** on its line (drawn while it is above 0 %), its own set, X, Y, Width, Height.
   Enter goes Label, Interface, Ports, Device Type, Tab, ➕ Add Device.
2. Its own set (Rule 18.22), two to a line as the Pump's: a PWM output **Start value (%)** with **Decimals**; an Analog output
   **Signal** with **Units**, **Low value** with **High value**, then **Decimals**.
3. **No Cover** (pumps only, Rule 7.13), **no Orientation** (it has no IPs) and **no Toggle** (a tap opens the box that sets its %).
4. Its Properties are the same, with the Interface and Port greyed out for good (Rule 18.13) and the Device Type last.
5. The Label is typed (no Type_n fill-in until Fritz says, Rule 18.15).
A Proportional Valve and a heating element's PWM keep their own dialogs until Fritz says (Rule 18.10).
18.26 **Adding a Temperature Probe: the Pump's drill-down without a Cover, Toggle or Overlay** (Fritz, 2026-11-05: "Build the Probe
Add Dialog Boxes using the Pump Drill down as the Template", thread "Build Probe Add dialogs like Pump", Help 138). For every
Temperature Probe Device: a plain probe, a **Thermowell** (Short, Medium, Long) and a **tee with a Temperature Probe** (Instrument Tee,
Long Tee, Rule 5.30). A probe built into a Skynet_Integrated_Device (RIMS tube, Integrated Electric Kettle) keeps its present dialog
1. **The kind of probe is picked first, as before** (Fritz, 2026-11-05: "Choosing the Probe Type First like it is is fine"): the
   list row of a plain probe (DS18B20, PT100 ...), or step 2a after picking a Thermowell or probe tee.
2. The Add box is titled with the probe (e.g. **Short Thermowell: DS18B20**) and works as the Pump's (Rules 4.2, 18.13, 18.15-18.17,
   18.20): 1 Label ⬢ and Label Visible, 2 Interface with its Port on the same line (**Probe #**, the OneWire probe number of a
   DS18B20, or **Available Ports**: the chip-select pin of an RTD or thermocouple board, the analog pin of an NTC, LM35 or TMP36),
   3 Tab; then the Name, and for a Thermowell or probe tee the **Graphic**, its **Path** (greyed out, the Skynet drawing, Rule 5.6) and
   **Orientation** (Rotate 0, 90, 180, 270) with **Flip** on its line; then the probe's own set (Rule 18.22): **Probe type** greyed
   out with a ⬢ for its settings (wires, reference resistor, thermocouple type, thermistor values, board voltage, Simulator
   settings), **Units** with **Decimals** on one line, **Calibration offset** with **Database and .API ⬢** on its line; X, Y, Width,
   Height, and the Device Type greyed out last (e.g. **TEMP: 1W**). Enter goes Label, Interface, Port, Tab, Orientation,
   ➕ Add Device. **No Cover, Toggle or Overlay** (a probe is an input).
3. Its Label starts filled in as **tP_n** (the next number), so the focus starts on the Interface (Rule 18.15). *(Built as recommended;
   Fritz's pick on the decision card is pending: tP_n, Probe_n or no auto fill.)*
4. Its Properties are the Pump's screen 9 (Rule 18.21) without Cover, Toggle and Overlay, plus the same own set and the **Reading
   now**. The Interface and Port are greyed out for good once added (Rule 18.13); so is the **Probe type**: to use another kind of
   probe, delete it and add it again.
- Gone from these dialogs (what a probe already has set is kept): the Probe type dropdown, Device (empty = any), the separate Flip
  Horizontal / Flip Vertical / Rotate rows (now Orientation and Flip), the Thermowell and probe tee notes (now the Graphic's tip).

18.27 **Adding a Picture Widget: the Pump's drill-down made to fit a Widget** (Fritz, 2026-11-05: "build a Picture Widget Build, I
will look at what you did and modify, but follow the look and sequences of the Pump drill Down", thread "Build Picture Widget dialog
like Pump", Help 74). A Widget has no Interface or Port (Rule 1.2) and is made on the 🔨 Build Tab first (Rule 4.1), so:
1. **Picture ➕** on the Edit layout bar, or **Add Widget > Pictures and text > Picture Widget**, opens the **Add Widget box**, titled
   **Picture Widget**, with ✖ Cancel and **➕ Add Widget** at the top and the bottom (Picture ➕ made a plain still picture before;
   those already on a Tab keep working).
2. The opening pattern (Rule 18.15 for a Widget): **1 Label** ⬢ and **Label Visible** (starts at No), **2 Picture** (the picture it
   shows, from the Picture list with the 🖼 icon picker), **3 Tab** greyed out as **🔨 Build Tab**. Nothing else shows until the
   Label and the Picture are done; ➕ Add Widget can always be pressed and says what is missing. Enter goes Label, Picture,
   ➕ Add Widget (Rule 18.20). Label auto-fill (Fritz, 2026-11-05, Rule 18.15): a Heating Element's Label fills in by its control mode as **hE_Mode_n**: PID
   **hE_PID_1**, Hysteresis **hE_HYS_1**, Duty Cycle **hE_DutyC_1**, PWM **hE_PWM_1**, On/Off **hE_DO_1**, Deadband **hE_DeadB_1** (n the
   next number not used yet for that mode). *The hE_ start and the _n end wait on Fritz's OK.*
3. Then **4 Name** (the Suggested Name **pic_** + the Label, e.g. pic_Kettle_Element, as the samples name them; it may be edited),
   the **Graphic**, **Turns on with** (Rule 7.11) with **Toggle** (On/Off, Push button, None: what a tap does) on its line,
   **Overlay** (greyed out while Turns on with is None) with a ⬢ for the second picture (Picture when on, optional, Rule 7.8) and
   the Back Colour, **Text on picture** ⬆, X, Y, Width, Height (140 x 120 to start), and the **Widget Type** (Picture) greyed out last.
4. **Picture Widget Properties** are the Pump's screen 9 (Rule 18.21) for a Widget: the lock, Visible and Hidden Locked in the
   title line; 🗑 Delete, ✖ Cancel, 💾 Save; 1 Label ⬆ ⬢ and Label Visible, 2 Picture, 3 Tab, 4 Name (✏ Change name once built,
   Rule 3.11), then the same fields as the Add box. The Label is never blank (a blank one becomes the Name on Save).
- Gone from its dialog (Rule 18.22; what an older Picture Widget already has set is kept): the Image block (Background #, Image
  Path 1-3), Hide value, Look, Digits, When tapped, Tap target and Ask before changing. Database and .API are not offered: a
  picture has no value (Rule 6.14).
---

## 19. Vessel Rules

Fritz (2026-11-05): "Vessels will have their own Rules." "Vessels on a Tab are Exception to the Rule and Only Apply to Vessel
Devices or Vessel Widgets." Where a Vessel Rule and a general Rule differ, the Vessel Rule wins for **Vessel Widgets and Vessel
Devices only**; everything else keeps the general Rules (2.20, 1.21, 5.31). (thread "Size Vessels by gallons with a Master Sizer",
Help 135)

19.1 **Gallons.** Every Vessel has a **Gallons** field (Liters when its Units are Metric). **A Vessel Template starts at 10
gallons**, Skynet and User Templates alike, and it is an editable field. **Gallons is one of the first fields of a new build from a
Template** (right after the Label in the Properties that open on the Build Tab).

19.2 **Size follows the Method: Proportional or Diameter.**
- **Proportional:** Fritz's plain vessel is the **One Gallon start: 197 x 237 pixels** (Fritz, 2026-11-05). Its Width to Height is
  the shape, and the Gallons field sizes it in proportion to that 1 gallon start.
- **Diameter:** a **Diameter** and a **Height** field (inches; cm for Metric). They give the shape as if the vessel were 1 gallon;
  then the Gallons size it.
- **Size follows volume:** twice the gallons is the cube root of 2 (about 1.26) times as wide and as tall. 10 gallons is 424 x 511.
  (Fritz, 2026-11-05: "I think the way you have done it will work.")

19.3 **The Master Vessel Sizer** is a Tab attribute (Tab settings). Any one Vessel on the Tab can be assigned. **Only the Master's
size fields are active**, in a Process or on the screen (grab points, Width, Height); it is the only one that can be resized, and
**every Vessel on that Tab follows** at the same scale. Changing the Master's own Gallons resizes only the Master; another Vessel's
Gallons or Method resizes only that Vessel, at the Master's scale. **No Master Vessel Sizer picked: no Vessel can be resized**
(a new build is still drawn at its Gallons). A resized Vessel keeps the middle of its bottom where it was; its IPs, fittings and
End Caps go with it (pipes per Rule 5.19). The Master shows 📏 in Edit layout.

19.4 **Not Placed is hidden, even on a Build screen.** A spot that is Not Placed (Rule 5.31) is hidden on every Tab, the Build Tab
and Edit layout included, and its slider is hidden in the Vessel's Properties. A **👁 Show All** button in the Build or Edit dialog
(Vessel Widget Properties) shows the hidden items (their sliders, and faint marks on the vessel) until it is pressed again (🙈 Hide
Not Placed) or the dialog closes.

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
8. ~~**Phones in Edit layout:** add a warning and an "Allow Edit layout on phones" switch (off)?~~
   Answered 2026-11-04: Rule 2.35 run mode.
9. **Bundled Devices on a vessel:** the plan to list bundled Devices in vessel Properties with Edit
   buttons was OK'd but not built yet.
10. **BruControl import:** keep the strict Process check, or allow BruControl-style lenient start?
11. **Still undecided from the check-up:** phone layout, PID temperature control.
12. **Label cannot be blank (Rule 18.3)** disagrees with Rules 1.13 and 3.8 ("empty Label = the Name") and 4.2 (Add Device
    works once "Show label is off" with no Label). Change those Rules, or allow an exception? (asked 2026-11-02)
13. *Answered 2026-11-02:* gGlobal prefixes: the Rule 1.16 change is on hold. Switch, Push Button, Pulse Button, List, Step and
    Long String are not gGlobals (new Semi_Widgets_Devices class). See Rule 1.19.

14. **Universal Properties** (Rule 1.21): *answered 2026-11-02:* `.x`, `.xh` and `.x_hPosition` are all the same attribute (Rule
    1.15, exception to Rule 15.2). Rule 5.14 changed: pipe fittings get `.visible`,
    `.hiddenlock`, `.lock`, `.tab` and a Label. (asked and answered 2026-11-02)

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
- 2026-10-30: Added Rules 1.18 (`skn_` Skynet internal Globals, `sk_` probe roles, `wait_boil`) and 2.27 (User Profile: where
  the brewery is, air pressure from the nearest airport, `skn_Boil_Temp`). Help 97; next free Help number 98. (thread "Find
  boil temperature from local pressure")
- 2026-10-30: Rule 1.16 rewritten (gKonstant and gAPI become one class, gGlobal, prefixes gG); Rule 2.6 says gGlobal
  List; added Rule 6.14 (Database and .API on every Device and Widget, readings kept by hidden key, API safeguards,
  `log` is `send_db`). Help 98 used; next free Help number 99. (thread "Send any Device or Widget to a database")
- 2026-10-30: Added Rule 6.15 (Close all / Open all valve lists; a tap water valve always on Close all, never on Open all) and
  section 16 (the Standard Skynet Brew Process: seven major steps, Skynet and User Process Templates, rcp_ Recipe values, ask). Help 100.
  (thread "Build the Standard Skynet Brew Process")
- 2026-10-30: Added Rule 2.28 (Tab Styles: Label and item groups, Skynet Default and Tennyson, Default tab's Tab Style, only items
  with no look of their own change). Help 101. (thread "Add Tab Styles and Version display")
- 2026-10-30: Added Rules 2.29 (About at the top of ☰ Menu; Command Prompt minimizes), 2.30 (Hidden_ Special Tabs, Help 103) and
  2.31 (Process Version YYMMDD_HH_MM_n, Help 102). Next free Help number 104. (thread "Add Tab Styles and Version display")
- 2026-10-31: Added section 17 Recipes (Rules 17.1 to 17.6: the Recipe tab layout, Skynet_Fields, .bsmx and BeerXML import with
  no limits, hop order and merged alerts, voice files, Skynet Mash and Water Profiles). Help 99. (thread "Build the Recipe Tab
  with BeerSmith import")
- 2026-10-31: Added Rule 17.7 (the Hops tab: hop lines with no limit, Outside of Boil dialog, line order, Actual AAU above
  zero before Calculate with a READ warning, rcp_Hop_N_ Skynet_Fields). Help 99. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Changed Rule 17.7 (Actual AAU starts at 0; a failed Calculate switches to Hops and highlights the 0s) and added
  Rule 17.8 (Grain tab and Fermentable tab). Help 99. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Rule 17.8 adds Fritz's Grain tab layout: PPG>SG gravity points, Expected Gravity on the Recipe tab, the grain
  weight standard and its label set only on the Default tab, no After Boil on the Grain tab. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Rule 17.8 adds Fritz's Fermentable tab layout: Amount with its own Measurement, select-only BeerXML Measurement and
  Type lists. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Added Rule 17.9 (the Adjuncts tab). Help 99. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Added Rule 17.10 (MASH and Waters tabs; Skynet Mash Profile Templates Single Step Batch Sparge and 3 Mash Steps
  Fly Sparge). Help 99. (thread "Build the Recipe Tab with BeerSmith import")
- 2026-10-31: Added Rule 15.3 (old style goes to the Delete folder: samples, the default Schema, Skynet Templates and shipped
  files follow a new Rule or Template at once; retired files move to Delete/, never deleted). (thread "Update samples to the new valve and Rules")
- 2026-11-02: Added section 18, General Dialog Rules (Up Arrow String Entry Dialogs of 2 and 30 lines, Attribute Dialog
  icon, Label first and never blank, Suggested Name from the Label, Name never blank, Image Path 1 with the Graphic Dialog
  pop-up, one dialog at a time on Fritz's command) and Open question 12. (thread "Add the New General Dialog Rules")
- 2026-11-02: Added Rule 18.11 (Cancel warns when changes were made: discard or go back to save; every dialog with Cancel
  and Save). (thread "Add the New General Dialog Rules")
- 2026-11-02: Added Rule 5.19 (pipes only Horizontal, Vertical or 45; turns only at a fitting; the old free pipe movement retired) and the kettle exception to Rule 5.5 (Flip Horizontal only, no Flip Vertical or Rotate). Help 105; next free Help number 106. (thread "Limit pipes to horizontal, vertical, 45")
- 2026-11-02: Added Rule 1.19 (gGlobal Kinds: gS_, gG_, gV_, gB_, gT_, gD_; a variable, never on a Tab; the Kind is set once
  picked) and Open question 13 (prefixes, the on-screen kinds). Help 108; next free Help number 109. (thread "Add gGlobal Kinds and BruControl import")
- 2026-11-02: Added Rule 7.12 (the Alarm Widget's two subclasses: Basic Skynet Alarm in four layers, User Alarm). Help 107
  (105 and 106 are taken by other threads); next free Help number 108. (thread "Make the Alarm Widget a Template")
- 2026-11-02: Help 109 used by the Skynet Copper Counterflow Chiller (thread "Add copper counterflow chiller Widget"); next free Help number 110. No Rule changed.
- 2026-11-02: Added Rule 5.20 (where the IPs go: the center of a ferrule's outer face on TC pipe Widgets, the center of the
  opening on a front view; tees with a Temperature Probe are Temperature Devices). Help 110; next free Help number 111. (thread "Create pipe Widgets from Fritz's drawings")
- 2026-11-02: Added Rule 7.13 (Pump Cover Overlays: picture, cover, On overlay; six Skynet colors plus a User cover; .cover with None
  the default, .coverColor). Help 111; next free Help number 112. (thread "Draw SVGs for common brew pumps")
- 2026-11-02: Added Rule 7.14 (new Alarms meet the new standard; old Alarms change to the new Basic format one by one;
  docs/ExistingAlarms.md lists them). (thread "Build the Basic and User Alarm Widgets")
- 2026-11-02: Rule 1.19: new gGlobals are only global-scope variables; Switch, Push Button, Pulse Button, List, Step and Long String
  are not gGlobals (Semi_Widgets_Devices); the Rule 1.16 prefix change is on hold; Open question 13 answered. docs/ExistingGlobals.md. (thread "Add gGlobal Kinds and BruControl import")
- 2026-11-02: Added Rule 1.20 (Semi_Widgets_Devices: Manual Valve Widget, Switch, Push Button, Pulse Button, LED; device_controlled, None to start, follows its Device both ways like a Clone; only Devices with an ON / OFF state). Help 112; next free Help number 113. (thread "Create the Semi_Widgets_Devices class")
- 2026-11-02: Added Rule 2.32 (shortcut keys in every text box: Shift+Enter `\n`, Ctrl/⌘+B `\b`, Ctrl/⌘+Shift+D °F or °C; the common copy, paste, undo and redo keys always work). Help 113; next free Help number 114. (thread "Add shortcut keys for text entry")
- 2026-11-02: Rule 7.10 rewritten: background pictures are .backpath, .backpath_2, .backpath_3 (were imagePath_1, _2, _3); .background 1-3 picks one, 0, blank or over 3 = none; old names changed everywhere (Rule 15.2). Help 25 rewritten. (thread "Rename image paths to backpath")
- 2026-11-02: Rule 7.10: at most 3 background pictures on any item (a 4th or more is dropped); most Widgets have no backpath, the Graphic Widget does. (thread "Rename image paths to backpath")
- 2026-11-02: Added Rule 9.8 (Start Fresh on an existing install: the installers ask "Delete all users and Schemas and Start Fresh?", a second warning with back out; config, data and scripts deleted, media and backups kept). Help 18 updated; no new Help number used. (thread "Add Start Fresh option to installer")
- 2026-11-02: Added Rule 1.21 (Universal Properties for every Device, Widget and Semi-Device; docs/Universal_Properties.md) and Open question 14 (Rules 1.15 / 15.2 position aliases, Rule 5.14 pipe fittings). Help 114; next free Help number 115. (thread "Set universal properties standard")
- 2026-11-02: Rule 1.15 rewritten: `.x`, `.xh`, `.x_hPosition` (and `.y`, `.yv`, `.y_vPosition`) are all Process attributes for the same thing, `.x` / `.y` the main names; an exception to Rule 15.2. (thread "Set universal properties standard")
- 2026-11-02: Rule 5.14 changed (Fritz): pipe fittings get `.visible`, `.hiddenlock`, `.lock`, `.tab` and a Label, besides `.x`, `.y`, `.width`, `.height` and Autosize to pipe. Open question 14 answered. (thread "Set universal properties standard")
- 2026-11-02: Rule 12.2 changed (Fritz): Beer money can go to at most 2 PayPal accounts; locked now with only Fritz's, unlocked only when he gives the second, then locked again. (thread "Expand Buy a Beer and Patron support")
- 2026-11-02: Added Rule 12.3 (Fritz): Patron payments are split by percent between several PayPal accounts (Option A, Pay Out); Rule 12.2 covers Buy a Beer only. (thread "Expand Buy a Beer and Patron support")
- 2026-11-02: Rule 12.3: a Patron account or percent change needs every Prime Developer's approval (100%, Fritz). (thread "Expand Buy a Beer and Patron support")
- 2026-11-03: Rule 4.5 updated from Fritz's Edit layout bar picture ("Fix 1"): row 1 order Picture, Text, Manual Valve, Override, Add equipment, Vessel; 👻 Hidden Tab gets an orange ? pop-up holding the Edit layout hint (taken off row 3); the switch is now Update Schema Version. Help 82 updated; no new Help number used. (thread "Fix the Edit layout bar from screenshot")
- 2026-11-03: Added Rule 18.12 (the drill-down: Pump Device Properties is the first dialog changed to Rule 18 and the
  starting standard for every Device; Properties ⬢ pop-up with Delete, Label ⬆ ⬢, Pin, When tapped, Picture, Background and
  On / Off text pop-ups). Help 115; next free Help number 116. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-03: Added Rule 5.21 (Pipe and Hose Widgets: made only with Draw pipe / Draw hose, not in the Widget List; Flow Colors on the
  Tab, the pipe and the Vessel, tap water always Blue, Vessel over all; .flow_Color the only Process attribute; Name, Label, Position and
  Size greyed out) and the pipe exception under Rule 4.1. Help 116; next free Help number 117. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-03: Rule 5.17: Master and Daughter are kept underneath but never shown; one entry per Skynet valve in the add lists,
  Orientation picks the Daughter and the picture and IPs follow; titles "valve: Orientation"; Build Template says Main Template. Help 88,
  89, 110 updated; no new Help number used. (thread "Explain Master and Daughter in Valve list")
- 2026-11-03: Valves list: the plain Motorized valve is now the User Defined Motorized Ball Valve (own picture, Image Path 1-3 kept per Rule 7.10 at Fritz's word "Follow the rule", In and Out IP spots in % of the item); Manual Valve (Widget) added to the Valves list, its bar button kept. Help 88. (thread "Explain Master and Daughter in Valve list")
- 2026-11-03: Rule 5.21 changed (Fritz): pipes and hoses keep an editable Label and Show label (the general Rule); only Position and Size
  are hidden. Added to How Rules work: following the Rules is the standard; an exception only for what no user would find useful.
- 2026-11-03: Added Rule 5.22 (Proportional Valves: the BruControl KLD20T is the first Skynet Proportional Valve; "Proportional valve 0-100 %" is now the User Defined Proportional Valve with In and Out IP spots). Help 117; next free Help number 118. (thread "Add BruControl KLD20T proportional valve")
- 2026-11-03: Rule 10.1 replaced (Fritz): Testing mode retired; updates keep logins, only Start Fresh (Rule 9.8) removes them. Settings > Testing mode switch removed. Help 10, 18, 27, 39, 67 updated; no new Help number used. (thread "Keep logins after installing a new .exe")
- 2026-11-03: Added Rule 1.22 (gGlobals are non-volatile: never cleared when a Process starts, saved on the Brain's disk soon after each change, back after a restart; the Keep value on restart switch is gone). Help 118, Help 04 and 108 updated; next free Help number 119. Saving works the same on every Brain (Pi, Windows, Linux, Mac). (thread "Keep gGlobal values after restart")
- 2026-11-03: Rule 1.7 changed (Fritz): the Brain can be a Raspberry Pi or a Windows, Linux or Mac computer, Arduinos on USB or Ethernet; remote browsers need the Brain running, on Tailscale, with internet (the same for a Pi or a computer). Rule 11.1 next free Help number is 119. (thread "Keep gGlobal values after restart")
- 2026-11-03: Added Rule 6.16 (moving from BruControl on a Windows Brain needs no new hardware: same boards, links, COM ports, wiring and pin numbers; only a one-time Skynet firmware load from inside Skynet). Gap report docs/BruControl_Connections.md. No Help number used. (thread "Match BruControl's Arduino connections on Windows")
- 2026-11-03: Added Rule 9.9 (Move Brain: a Brain Move file locked with a Move password on the old Brain, Bring in + Move in now on the new Brain with its own files kept in backups/, then USB ports changed in every Schema at once, matched by serial number). Help 119; next free Help number 120. (thread "Move a computer Brain to a Pi")
- 2026-11-03: Rule 5.21: every IP point has a Flow Color (`.flow_Color`, None to start), first in the flow color order: flow that begins at it
  takes that color. Help 116 updated. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-04: Added Rule 18.13 (adding a Pump: pick the pump with its picture; the Add box titled with it, Label ⬢, Cover, X, Y, Device Type read only; Interface and Port greyed out with ✏ Change once added; Tab, X, Y, Width, Height on the Properties). Rules 4.1 / 4.2 parts of the drawing wait for Fritz. Help 115 updated; no new Help number. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 4.2 changed (Fritz): the Add Device order is 1 Label, 2 Interface, 3 Port, 4 Tab, 5 Name, so the Suggested Name follows his naming convention; the Name shows once 1-4 are done. Rule 4.1 changed with it: a new Device goes straight on the Tab picked in its Add Device box (Widgets and Templates still start on the Build Tab). Rule 18.13 updated. Help 82 and 115 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 4.2: ➕ Add new Tab… in the Add Device box's Tab list keeps the Label, Interface and Port, builds the Tab in Tab settings, then comes back with it picked and the Suggested Name made (Fritz). Help 82 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 4.1 updated (Fritz): ➕ Add new Tab… in the Add Device box pauses it, keeps the Label, Interface and Port, builds the new Tab, then returns with them filled in and the new Tab picked. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rule 2.33 (one click turns a Pump on or off, no ON / OFF pop-up; Pumps in every Schema changed once; Ask before changing still there by hand). Help 120; next free Help number 121. (thread "Toggle pumps with one click")
- 2026-11-04: Added Rule 18.14 (general: ➕ Add new ... in any dialog dropdown pauses the dialog, keeps its temporary data, makes the new thing, comes back with the data filled in, the dropdown refreshed and the new thing picked); Rule 4.1 points to it. Other dialogs follow one at a time (Rule 18.10). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rule 18.15 (every new Device dialog opens with 1 Label, 2 Interface, 3 Port, 4 Tab, then the Suggested Name; the Add Device box has it, the RIMS / Integrated Kettle box waits for Fritz, one at a time). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rules 18.16 (short field names, the rest in a hover / tap tip) and 18.17 (Interface and Tab dropdowns read ID: Name); Rule 4.2: the Add Device box layout from Fritz's Pump example (Interface and Available Ports on one line; Name, Cover, X, Y, Width, Height show once Label, Interface, Port and Tab are done). Help 82 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 18.15: Label Visible starts at No in every new Device dialog (Fritz). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 18.15: the standard for every new Device dialog: Label, Interface, Port and Tab first, nothing else shows until they are done (only the greyed Device Type), then the Name on top of the other properties. The Label must be typed (Show label off no longer skips it); Rule 4.2 changed to match. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rule 18.18 (Device Type shows its General Type first, e.g. DO: Pump; the saved type is unchanged). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rule 18.19 (a Device dialog shows its Graphic with its Orientation; a Skynet pump's Graphic is set, a User pump has one path). Rule 7.10: exception, a User pump has one path. Rule 18.15: ➕ Add Device stays pressable and says what is still missing (Fritz: "Add Device button does not work"). Help 82 and 115 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 5.9 changed (Fritz picked the recommended wording): pumps have an Orientation (Flip Horizontal / Vertical, Rule 18.19); the rest of 5.9 stays. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rule 5.23 (valves and pumps sit centered on their pipes: the valve or pump moves across onto the pipe's line, the pipes stay; the older ball valve pictures have their pipe spot) and Rule 7.15 (powered valves and pumps flash a red and yellow lightning bolt On overlay when On; once per Schema for those with no overlay). Help 121, Help 58 updated; next free Help number 122. (thread "Center pumps and valves on pipes")
- 2026-11-04: Added Rule 18.20 (blue border on the field with the focus; Tab and Enter go field to field in a dialog; a new Device's Enter sequence Label, Interface, Ports, Tab, Orientation, Add Device). Help 82 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Added Rules 18.21 (Pump Device Properties = Fritz's screen 9; only those) and 18.22 (besides the Universal Properties each Device and Widget has only its own set). Rule 18.19: a pump's Orientation is Right / Left (Fritz's screens 7-9). (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 7.15 changed (Fritz): the default On overlay for powered valves and pumps is the steady red and yellow bolt (Overlay_Bolt.svg); the flashing bolt is only a choice. Schemas given the flashing bolt are changed once. Help 58 and 121 updated; no new Help number. (thread "Center pumps and valves on pipes")
- 2026-11-04: Added Rule 2.34 (the selected choice in every dropdown has a Cyan background; not possible on iPhone Safari or older browsers). (thread "Make selected dropdown items cyan")
- 2026-11-04: Changed Rule 2.25 (Close Skynet Brewer now closes the Command Prompt window itself, whatever .bat started the panel, not only the new Skynet_Brewer.bat). Help 95 updated; no new Help number. (thread "Close the Command Prompt with Skynet")
- 2026-11-04: Changed Rule 10.7 (hiding the Simulator bar removes it completely, no strip; ☰ Menu > 🧪 Show / Hide Simulator bar in Simulator mode; small 🧪 on the ☰ Menu button while hidden). Help 85 updated. (thread "Move Show Simulator bar to the ☰ Menu")
- 2026-11-04: Added Rule 2.35 (as a general Rule, phones and tablets are for running and watching the brewery, not for editing or building; a feature that does not work on a phone or tablet is fine under it; nothing is hidden or locked on phones until Fritz says). (thread "Add the phone and tablet editing Rule")
- 2026-11-04: Rule 2.35: run mode on phones and tablets (Fritz): an admin works as an operator there; the Schema, Processes and Tab buttons work, no Edit layout or Properties; switch "Phones and tablets can edit" (off) on ☰ Menu > Default. Open question 8 answered. Help 45 updated; no new Help number. (thread "Add the phone and tablet editing Rule")
- 2026-11-04: Added Rule 2.36 (on Windows Skynet opens in its own clean window, Edge or Chrome app mode with its own profile, no address or bookmarks bar; the normal browser is never changed; the window closes with the panel). Rule 2.25: Close Skynet Brewer closes that window too. Help 122, Help 95 updated; next free Help number 123. (thread "Open Skynet in its own clean window")
- 2026-11-04: Rule 5.21: pipes and hoses start at Flow Color None and follow the Tab Flow Color; the orange every sample pipe had becomes None once in each Schema (Fritz). Help 116 updated; no new Help number. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-04: Rule 5.21 changed (Fritz): flow from a Tap Water Valve is always Blue and is #1, over every other flow color (was third, after an IP and a Vessel). Order: Tap Water Valve, IP, Vessel, Tab, pipe, Tab (Mash, Boil, Whirlpool, Ferment). Help 116 updated; no new Help number. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-04: Added Rule 5.24 (ball valves have two IPs, one at each pipe end, in every Orientation: a 45 degree Skynet valve's IPs turn with its picture; the Manual Valve Widget has two IPs instead of one in its middle; older pipes on its middle join the nearer end). Help 123, Help 87 updated; next free Help number 124 (Help 122 is taken by PR #186). (thread "Add IPs to Ball Valve Devices and Widgets")
- 2026-11-04: Rule 5.24: every Skynet Pump has IPs on its inlet and outlet (the older Riptide-style pictures and the sump pump now too; Right and Left, any Cover). Help 123 updated. (thread "Add IPs to Ball Valve Devices and Widgets")
- 2026-11-04: Rule 18.21: an Overlay dropdown (the On overlay) just below the Cover on the Pump dialogs, Add box and Properties (Fritz). Help 115 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Rule 18.21: Database and .API is on the Overlay line as a ⬢ pop-up (no box) on the Pump's Add box and Properties (Fritz's screen 7). Help 115 updated. (thread "Set the drill-down dialog standard for Devices")
- 2026-11-04: Changed Rule 6.14 (new Send to the database choice "At clock time" writes every day at a clock time; the At clock time box shows only for that choice; the Every choices no longer have a clock time, and an older "Every 1 day at 12 AM" becomes At clock time 12 AM). Help 98 updated; no new Help number. (thread "Add At clock time to Send to the database")
- 2026-11-04: Added Rule 5.25 (TC Pipe Fittings is a Widget subclass: every elbow, tee, cross, U, reducer, check valve and End Cap is a Skynet TC Pipe Fittings Widget with an IP on each ferrule face; Skynet puts them in where pipes meet, a pipe drawn to the bend turns an elbow into a tee; added by hand from Elbows, Tees … and Add Widget > TC Pipe Fittings; fittings with probes stay Temperature Devices; no cut-off ends). New Cross; Elbow 45, Instrument Tee and the probe tees redrawn in the style of Fritz's 2026-11-04 Elbow and Tee; the cut-off 45 ends of Fitting_Elbow45, Skynet_TC15_45 and pipe_elbow45 fixed. Samples and default Schema changed. Help 124; next free Help number 125. (thread "Make Fritz's elbow and tee into SVG Widgets")
- 2026-11-05: Rule 2.36: the clean window shows the Skynet Brewer beer mug on the taskbar (also when minimized); the panel, Sign in and Help pages all use it as their icon. Help 122 updated; no new Help number. (thread "Show a beer mug icon when minimized")
- 2026-11-05: Rule 5.25: a loose pipe end that meets another pipe joins it (on another loose end: an elbow; partway along a pipe: the pipe is cut and a tee goes in). Help 124 updated. (thread "Make Fritz's elbow and tee into SVG Widgets")
- 2026-11-04: Added Rule 5.26 (a Pump, Valve or Manual Valve Widget dropped on a straight pipe cuts it: between the ends into separate pipes joined to its IPs, over an end the pipe is made shorter and both IPs joined, an end on a tee or other IP staying where it is; an IP that opens across the pipe is taken round with 90 degree elbows). Help 125; next free Help number 126 (Help 124 is taken by PR #193). (thread "Split a pipe when a pump is added")
- 2026-11-05: Rule 9.8: Start Fresh on Windows also deletes the clean window's browser profile (saved user name and password), and Admin setup always opens with empty boxes (browser fill-in cleared). Help 18 updated; no new Help number. (thread "Make Start Fresh admin setup truly fresh")
- 2026-11-05: Rule 5.19: Save layout joins a pipe's open end within 14 px of an IP again (a free IP point moves back onto a straight pipe's end); a wobble under 4 pixels is not a drag; only ends a drag pulls off let go (Fritz: changing IP1's Flow Color in the Three Vessel sample stopped the flow). Help 105 updated; no new Help number. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-05: Skynet pictures cleaned up (Fritz, thread "Clean up SVG names and retire old pictures"): Valve_Ball_ClosedH_1 / ClosedV-1x1 renamed Motorized_TC15_Ball_Valve_Horizontal / _Vertical; pipe_cross, pipe_elbow45, pipe_elbow90, pipe_tee, Skynet_TC15_InstrumentTee and every Open valve picture retired to Delete/ (replacements listed in Delete/README.md). Rule 7.5 note, Rule 7.8: Skynet valves have no Open picture, the On overlay shows open, and the sample and default Schemas swap no pictures. Rule 7.13: White cover (RGB 250 250 250). Rule 5.23 names updated. Help 129.
- 2026-11-05: Added Rule 6.17 (Deadband Device, as in BruControl's Deadband Output: Deadband Offset, Inner Band Offset, Initial Output, Inner and Outer Band Drive, Calc Time, Out Time, Reversed; output in %; BruControl import). Help 126; next free Help number 127. (thread "Add Deadband control")
- 2026-11-05: New Rule 18.23: adding a Motorized Ball Valve uses the Pump's drill-down without a Cover (pick the valve with its picture; Skynet or User Defined); Toggle and Overlay work normally on the Skynet valve too (an exception to Rule 5.18 for this valve). Help 128. (thread "Add Motorized Ball Valve drill-down dialog")
- 2026-11-05: Added Rule 5.28 (Quick Disconnect Widget: Fritz's red star snaps onto a valve IP; Quick Disconnect hose: hangs from a pump IP, its free end moves at any time with the right mouse button or a finger, onto an IP, a Quick Disconnect or the top third of a vessel). Rule 4.5 row 2 gets Draw QD hose. Exception note on Rule 2.11, waiting on Fritz's pick (exception or change Rule 2.11). Help 127. (thread "Add movable quick disconnect hose")
- 2026-11-05: Rule 18.13 (and 18.21, 18.23): once a Pump or Motorized Ball Valve is added, its Interface and Port are greyed out for good; ✏ Change beside them is gone (physical wiring; the hidden key stays, only the Name changes with ✏ Change name). (thread "Add Motorized Ball Valve drill-down dialog")
- 2026-11-05: Rule 18.23 and 6.15: the Motorized Ball Valve dialogs match the Pump's (Orientation and Toggle on one line; Tap water valve, On Close List and On Open List on one line, in the Add box too); the switches are renamed On Close List / On Open List; the valve Type ID E_L_Vlv becomes eVlv (old names kept, Rule 3.5). Help 128 and 46 updated. (thread "Add Motorized Ball Valve drill-down dialog")
- 2026-11-05: Rule 18.15 changed (Fritz: "A Device or Widget must have a label. Some Devices or Widgets will have a Label Auto filled in following a pattern ... Type_n where n is the next number ... A Label cannot be blank"; "Pumps do NOT have Auto Fill, Valves do"): a Motorized Ball Valve's Label starts as mBV_n; a filled Label sends the focus to the next field. Rules 4.2 and 18.23 follow. Help 128 updated. (thread "Add Motorized Ball Valve drill-down dialog")
- 2026-11-05: Rule 2.12 changed (Fritz): a 🔒 locked Vessel can't be moved with the mouse but moves by its X and Y in Properties (to the pixel), with its IPs, joined fittings and End Caps; bundled vessels' Properties got X and Y. Other locked items are as before. Help 56 updated; no new Help number. (thread "Let locked vessels move by X and Y")
- 2026-11-05: Rule 9.8: Skynet's clean window (Rule 2.36) never syncs with a Microsoft or Google account, so saved passwords stay in Skynet's own window and still fill in on Sign in (Edge synced Fritz's old login back in after Start Fresh); Admin setup keeps untouched boxes empty for as long as it is open. Help 18 and 122 updated; no new Help number. (thread "Make Start Fresh admin setup truly fresh")
- 2026-11-05: Added Rule 5.27 (the Pump Standard: every Skynet pump picture drawn in the same 300 x 300 box, to scale, shown 150 x 150, inlet IP at (285, 150) and outlet IP at (243, 56), port tubes made longer where needed; older pumps become 150 x 150 once). Rule 5.11 notes pumps keep to it this way. Help 130; next free Help number 131. (thread "Standardize pump size and IPs")
- 2026-11-05: Added Rule 5.29 (the Valve Standard: every valve picture in the same 300 x 300 box with its pipe through the middle, to one scale, IPs always on the same spots; shown 150 x 150; a user's own valve picture fills the box and its In and Out spots move and size the picture onto the IPs; older valves become square once). Notes under Rules 5.11, 5.22 and 5.24. Help 131; next free Help number 132. (thread "Standardize valve size and IPs")
- 2026-11-05: Rule 5.25: a Tee, Instrument Tee or Cross dropped on a straight pipe cuts it there (turned so its run goes along the pipe). Rule 5.26: a valve or pump dragged off its pipes onto another pipe now cuts it (its old pipes let go first); one still joined says why. Help 124 and 125 updated; no new Help number. (thread "Fix Tee and valve not splitting a pipe")
- 2026-11-05: Added Rule 5.30 (tees with a Temperature Probe are the size of the TC Pipe Fittings tee of their shape with IPs on the same spots, Rotate, and cut a pipe like a tee; a tee or probe tee dropped on a hose cuts the hose; a Thermowell has one IP on its cap face and snaps onto an IP; on a front facing IP it shows from the front; a plain Temperature Probe on a front facing IP has an implicit Thermowell). Three Vessel sample shows its probes. Help 132; next free Help number 133. (thread "Add IPs to probe thermowells and tees")
- 2026-11-05: Rule 2.7: White in any color picker is RGB 250 250 250 (#FAFAFA), as for the pump covers (Rule 7.13). Three Vessel sample: the brew status boxes are Black with White text, and the Readings boxes (Blue with White text) moved to a new Reporting Tab. No new Help number. (thread "Recolor 3 Vessel sample and add Reporting Tab")
- 2026-11-05: Rule 7.13 changed (Fritz): one cover per color plus User (any RGB), and every cover fits every Skynet pump; a cover is a color filled into each pump's cover shape, so the per-pump, per-color files moved to Delete/. Help 111 updated. (thread "Clean up SVG names and retire old pictures")
- 2026-11-05: The test pump on the valve spots is retired (Fritz: the Pump Standard, Rule 5.27, stays). Pump_1 in the Three Vessel One Pump sample is back on Pump_Red_Rip_Off.svg; the test picture went to Delete/ (Rule 15.3). (thread "Standardize valve size and IPs")
- 2026-11-05: Added Rule 5.31, the Vessel Widget class (one Skynet_Vessel_Widget Template, a Place slider on every IP, the Temperature Probe and the Element Port; spots locked). The Three Vessel sample uses it. Rule 11.1 next free Help number now 134. (thread "Build the Vessel Widget class", Help 133)
- 2026-11-05: Rule 6.14: the Send to the database choice Once is replaced by **In a Group** (Database Groups with a hidden key and a Group Name, `send_db_group Group_Name` sends the Group each time, ✏ Change name updates every Process; old Once items go In the Group named Once). `send_db Name` sends even when Off (no `send_Now`). Help 98 and 05 updated; no new Help number. (thread "Recolor 3 Vessel sample and add Reporting Tab")
- 2026-11-05: Added Rule 1.23 (Value, Time and DateTime Widgets); Rule 6.14 gets the Send to the database choice **When Clicked**. Three Vessel sample: the Reporting readings are Value Widgets (w_Strike_Volume ...) sent When Clicked; Notes stays a gGlobal for now. Rule 1.20 confirmed unchanged. Help 134; next free Help number 135. (thread "Recolor 3 Vessel sample and add Reporting Tab")
- 2026-11-05: Added Rule 8.4 (Password key): Skynet's own key button in every new-password box makes a strong password that follows the Password rules; Edge's own key went away when the clean window stopped syncing (Rule 9.8, PR #205). Help 10 updated; no new Help number. (thread "Restore generate password Key on fresh install")
- 2026-11-05: Added section 19, the **Vessel Rules** (Fritz: "Vessels will have their own Rules"; an exception to Rules 2.20, 1.21 and 5.31 for Vessel Widgets and Vessel Devices only): 19.1 Gallons (10 to start on every vessel Template), 19.2 Proportional (1 gallon = Fritz's plain vessel, 197 x 237) or Diameter, size follows volume, 19.3 the Tab's Master Vessel Sizer (only it resizes; no Master, no resizing), 19.4 Not Placed hidden even on the Build Tab, 👁 Show All. Help 135; next free Help number 136. (thread "Size Vessels by gallons with a Master Sizer")
- 2026-11-05: Added Rule 18.24 (Adding a Heating Element: the Pump's drill-down without a Cover; in the Heating Element list, Vessel Device Template, Choose then Build, takes the place of Electric kettle, basic). (thread "Build Heating Element Add dialogs like Pump", Help 137)
- 2026-11-05: Rule 18.24: Heating Element Labels fill in by control mode (hE_PID_1, hE_HYS_1, hE_DutyC_1, hE_PWM_1, hE_DO_1, hE_DeadB_1; Rule 18.15). The Heating Element list's PWM row is a heating PWM (H_PWM).
- 2026-11-05: Added Rule 18.25 (Fritz: "PWM Build Dialog"): the PWM output and Analog output Add box and Properties follow the Pump's drill-down; no Cover, Orientation or Toggle; own set Start value / Decimals or Signal / Units / Low / High / Decimals; Label typed (auto fill asked). Help 136; next free Help number 137. (thread "Build PWM Add dialog like Pump")
- 2026-11-05: Rule 4.5 updated: row 1 gets **Boolean ➕** (a list first, like Probe: Switch, Push Button, Pulse Button, LED), **Value ➕**, **Time ➕** and **DateTime ➕**; **Vessel** moves before ⧉ Clone Device; **Add equipment ➕** moves to row 2 after Elbows, Tees …; row 1 made tighter so it fits on the top line at 1920 wide. Help 82 updated; no new Help number. (thread "Add Widget buttons to Edit layout bar")
- 2026-11-05: New Rule 18.26: adding a Temperature Probe (plain, Thermowell, probe tee) uses the Pump's drill-down without a Cover, Toggle or Overlay; the kind of probe is still picked first (Fritz); Orientation with Flip, Probe type ⬢, Units with Decimals, Calibration offset with Database and .API ⬢; Label auto fill tP_n (Fritz's pick pending). Rule 18.15 lists it. Help 138; next free Help number 139. (thread "Build Probe Add dialogs like Pump")
- 2026-11-05: Added Rule 18.27 (Adding a Picture Widget: the Pump's drill-down made to fit a Widget: 1 Label, 2 Picture, 3 Tab = the Build Tab, then the Name, Graphic, Turns on with + Toggle, Overlay, Text on picture, X, Y, Width, Height, Widget Type; Picture ➕ now makes a Picture Widget). Rule 4.5 updated. Help 74 updated. (thread "Build Picture Widget dialog like Pump")
- 2026-11-05: Rule 5.31 changed (Fritz's Vessel IP Template drawing, PR #226): the Vessel Widget Main Template has 15 IPs (Right side
  Sparge, HERMS In, HERMS Out, Element, repeated on the Left; Left and Right Back Element; Center Probe; Left and Right Tangential;
  Center Outlet; Center Bottom Outlet); the names are general only; each IP has a Label that starts the same as its Name.
- 2026-11-05: One exception to Rules 5.7 and 5.31 (Fritz): a Vessel built from a Vessel Widget Template is a Vessel Device; Elements,
  Probes, Thermowells and Valves on its IPs are integral parts (like the RIMS tube); a HERMS coil goes on the Left or Right HERMS IPs;
  once built and saved there is no way back. The RIMS tube Template is a kind of Vessel Device Template.
