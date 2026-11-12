# BruControl Importer

The **Skynet BruControl Importer** turns a BruControl setup into a Skynet Schema (Skynet Rule 15.4; OakBarn Brewery, 2026-11-06). It is
the second door of the same Skynet program: it uses the Panel's own Devices, Widgets, Templates, pictures and Rules, so what it
makes is exactly what the Panel makes.

- **Windows only**, on the **same computer as BruControl** (BruControl runs only on Windows).
- It only **reads** BruControl's files. BruControl and its files are never changed.
- It needs no Brain, no boards and no sign-in. It opens in its own clean window, like the Panel (Rule 2.36).

## Starting it

Double-click **Skynet BruControl Importer** on the Desktop or in the Start menu (Skynet Brewer folder). The Setup .exe puts it
there. A black command window opens and stays open while you use the Importer; **✖ Close Importer** at the top right stops it.

## Page 1: Welcome

A short welcome: what the Importer does, and that it never changes BruControl or its files. Click **Next ▶**.

## Page 2: BruControl and Skynet

This page tells you what stays the same (your boards, wiring, Devices, screens, scripts, pictures), what is different
in Skynet (it runs in a browser, some new words, Skynet pictures and Templates, everything comes in the Skynet way), and the steps
the Importer will guide you through. Under **Your Scripts** it also tells you about the **Preset Schema Templates** (what
BruControl called Configurations) that you can easily change, and why (OakBarn Brewery: "I wanted to Brew, not write Code!").
Click **Start ▶**.

| BruControl | Skynet |
|---|---|
| Configuration (.brucfg) | Schema |
| Workspace | Tab |
| Script | Process |
| Element with a port | Device |
| Element with no port | Widget |
| Display name | Label |
| Global | gGlobal |
| Device (a board) | Interface |

## Page 3: Pick your BruControl config file

**📄 Browse for the config file…** opens Windows' own Open box in **Documents\BruControl**, where BruControl keeps its
config files, showing `.brucfg` files and BruControl's backups (`.bak`): pick yours and it is chosen. You can also pick from the list:

The Importer looks **only in Documents\BruControl** first (the real Documents folder, even when Windows keeps it on
OneDrive). The list has two parts. First come BruControl's **backups** (`.bak`) from
**Documents\BruControl\Config Backup**, newest first. Below them come the **config files** (`.brucfg`) in Documents\BruControl,
newest first. Each shows the date it was saved and its size. The file you pick is only read; nothing is done to it, so it is
unchanged after the import.
BruControl may keep a **default config** there too; it is listed last and marked *(BruControl default)*.

**Backups work too.** BruControl backups end in `.bak` (for example `default.brucfg.20260615.bak`). A backup is the same
config file inside, so it imports the same way. Backups are listed first, marked *(backup of
2026-06-15)*, and the Schema is named after it, for example `default_Backup_2026-06-15`. BruControl keeps its backups in
**Documents\BruControl\Config Backup**; everything there is listed too (backups and any `.brucfg` you put there), with *Config Backup\* in front of the name.
To look somewhere else, use **📁 Change folder…** (any folder with a `.bak` or `.brucfg` file) or **📄 Browse for the config
file…**; **⌂ Documents\BruControl** goes back to BruControl's own folder.

- **Typing a folder:** a full folder like `D:\Brewing` works. A short one like `\downloads` or `Downloads` means that folder
  in your own Windows folder (`C:\Users\<you>\Downloads`).
- **Browse and Change folder** open Windows' own box in front of the Importer. While it is open, a note says so; if you do not
  see it, look on the taskbar.
- **"The Importer has stopped"** at the top means its black window (**Skynet BruControl Importer**) was closed, so no button
  can work. Close the Importer window and start it again from its shortcut. Keep the black window open while you import.

- **No config file there, or only the default one?** The Importer asks you to point to the folder that holds yours: click
  **📁 Change folder…** and pick the folder, or type the folder in the box and press Enter (or click **Look**). Next time the
  Change folder box opens at the folder you picked last.
- **⌂ Documents\BruControl** goes back to the usual folder.
- **One config file makes one Schema.** You may have more than one config file: pick one, and import any other one on
  its own afterwards. Config files are never combined (Rule 15.4).
- **Click** a file to see what is in it: its Interfaces (boards), Tabs (workspaces), how many Devices and Widgets (elements),
  Processes (scripts) and gGlobals it has.
- **Double-click** a file (or click it and **Next ▶**) to pick it and go on. Back and Next are at the top and the bottom.

## Names

**Units** come first: **US** (Gallons, °F, inches, pounds) or **Metric** (Liters, °C, centimeters, kilograms). Every temperature,
size and volume in the next steps uses them. When your BruControl probes show which one BruControl used (°F or °C), it is picked
for you and the question asks you to confirm it. When BruControl does not say, the Units of the Skynet Panel on this computer are
picked, so you do not type them twice.

**Coming back later.** Every answer you give is kept a moment after you give it. If you close the Importer and come back, pick
the same config file: the Names page then offers **▶ Carry on where I left off**, or **Start again** (it asks first). Clicking
**Next ▶** instead never wipes your answers out: it asks whether to carry on, and asks again before starting over.

**Clear Page and Restart Fresh.** Two buttons sit at the top of every page:
- **🧹 Clear Page** puts every answer on this page back to how it started (on Boards and Tabs: the small step you are on). The other
  pages keep their answers. It is greyed on a page with no answers, like Welcome.
- **↺ Restart Fresh** clears every answer the Importer kept for the config file you are working on (your other config files keep
  theirs), and takes you back to Welcome.

Each one asks first; **No** changes nothing. Your BruControl config file and the Schemas you saved are never touched.

**Jump to a topic.** The topics along the top (Welcome, BruControl and Skynet ... Save the Schema) can be clicked to go back to
any you have reached. Under **Boards and Tabs** a second row lists its small steps (Interfaces, IDs, Tabs, the Widget pages, Items,
each item page, Vessels, Summary): click any one you have reached to jump there.

Every box you fill in is **grey with black text**, and **no box may be left blank**: a blank one is marked red when you press
**Accept ▶**, and a message says how many there are.

How your items are named in Skynet (this choice is greyed out for now: **it is made much later in the Import**, and every item
gets its Skynet name):

- **Skynet names (recommended).** Every name tells you its Interface, Port, Type, Label and Tab at a glance (Rule 3.1), for
  example `MB_28_do_ManualAlarm_B1` becomes `BR_28_DO_Manually_BB`.
- **Keep my BruControl names.** Allowed, but two warnings come first, like Start Fresh: **"Do you really want to keep your
  BruControl names?"** and then **"Last chance"**. **No** (use the Skynet names) is the default both times. Spaces and
  characters a name may not have still change.

**Pictures and Sounds:** the picture paths and sounds are imported, and the files stay where they were, so BruControl
continues to work normally. A copy of each one is always made too (it is not a question): every picture is copied into `media\Images\User` and every sound
into `media\sounds\User` of the Skynet Panel, so they are all together if you move to a Pi or another computer, and the items
use the copies. They are never deleted in their original spot, just copies made, and a copy already there is never written over.
New pictures and sounds you add in Skynet are always put in its media folders.

Your BruControl **DisplayName** becomes the **Label**, the name shown on the Tab. A blank DisplayName: the Label is the Name,
and it is not shown on the Tab.

## Boards and Tabs

**Next ▶** makes the **Import Copy**: your config file is copied into `C:\Brewing\Import\BruControl` (named
*name*_*date*T*time*.brucfg, also when you picked a `.bak` backup) and only the copy is converted, so BruControl's own file is never changed.
Then you confirm what comes in, in small steps:

1. **The Interfaces (boards) we found.** Each Interface with its **ID** (greyed, it is explained next), how many items,
   its **Interface Type** (Arduino MEGA, ESP32 ...), its **Connection** (TCP address and Port, or the serial COM port), whether it is
   **Enabled**, and an **Import** box: an Interface with items starts ticked, an empty one unticked. Untick one to leave it out, with
   its items. **Next ▶**.
2. **The ID column: new in Skynet.** Skynet gives every Interface an **ID** of up to four letters. It is the first part of the
   **suggested Skynet name** of every Device on that board: *Interface ID*_*Port*_*Type ID*_*Label*_*Tab ID*, one `_` between the
   parts, a space in the Label becomes `~` (Rule 3.1), for example `MP_45_DO_M~HLT~Pump_MD`; a name that would be the same as another
   gets `_2` before its Tab ID, so every name is unique. The Importer chose the IDs for you; you may change them (up to 4 letters,
   **2 are preferred**, each one different). Only the Interfaces you are importing are listed. **Accept ▶** uses them in every name and goes on.
3. **Your Tabs (workspaces).** One row per Tab: its ID, its **Items** and a column for each kind of **Placeholder** found
   (Timers, Counter Devices ...) and an **Import Tab** box. A Tab with items starts ticked, an empty Tab starts unticked; you can tick
   or untick any of them, and an unticked Tab is not imported, with everything on it. **Accept ▶** goes on.
3a. **Your Widgets.** BruControl's Application Elements (the things not wired to a board) become Skynet Widgets: a Timer a
   **Timer Widget**, an Alarm an **Alarm Widget**, a Toggle Switch a **Switch Widget**, a Script element a **Process Widget** ([Help 173](173-process-widget)), a Chart
   a **Graph Widget**. The first page lists every kind of Skynet Widget and how many of yours become one; then there is a page for
   each kind found, with the same Display Name, tick, Label and Show columns as the items below. A BruControl Inspector has no Skynet
   Widget and stays a Placeholder. See [Help 165](165-importer-item-and-widget-pages).
4. **The items on each Interface.** One table per Interface (board): every item wired to one of its ports, by port, with its
   BruControl name, its **Display Name** (with no Display Name, the BruControl name is shown greyed), a **tick box** and a **Label** box,
   a **Show** box (ticked when BruControl showed the name), what it becomes in Skynet (Pump, Cool / Warm Pump, Heating Element, Analog
   Input ...), its **Skynet Name** (made with your Label, and it changes as you type; until you type a Label it is made with the
   Display Name and greyed) and its Tab.
   There is no "tick them all" box, on purpose: look at each item, because a BruControl name like `M_6_B_1` should become words like HLT. An item on a Tab you
   left out is marked *left out*.
   - **Labels.** BruControl's Display Name settings come over as the item's **Label** in Skynet. The Label can be shown on the Tab just
     like the Display Name was in BruControl, and it is the Label part of the suggested Skynet name. Use the words you use when you
     describe your brewery (HLT, Mash Tun, Boil Kettle).
   - Every tick box and Label box starts blank. **Tick** a box to copy that item's Display Name into its Label box, then change it if you like.
   - A Label can have spaces; in the suggested Skynet name a space becomes `~` (*Mash Tun* is `Mash~Tun`).
   - A Label does not have to be different from the others: a Heater, a Temperature Probe and a Valve can all be **HLT**, and their
     suggested names are still all different (for example `MB_25_DO@H_Element_HLT_BH`, `MB_A0_TEMP@10KNTC_HLT_BH`, `MB_30_MBV_HLT_BH`). The page shows
     three examples made from your own items when it can find them, or made-up samples.
   - Skynet names are the preferred way to name things in Skynet.
   - **Accept ▶** is at the bottom of the page. No Label may be blank: a message says how many are, and marks them in red. When they
     are all filled in, the suggested Skynet names are made again with your Labels, and each Label is the item's Label in the new Schema.
5. **The item pages:** Pumps, Heating Elements, Temperature Probes, Valves, Flow Meters, pH Meters, Pressure Sensors (PSI),
   Hydrometers, Volume Meters, Floats, Digital Inputs and Other items, one page each, in that order. Each page starts with **How many
   ... do you have?**; if you have more than were found, an empty line is added for each one (for example *Pump 7*), and an empty line
   can be filled with an item no page has taken yet. Each line has the Display Name, tick, Label and Show columns, a **Belongs on**
   dropdown that moves it to its right page, and its details. Nothing can stay at **Pick one…**: if no choice fits, pick **User
   defined** and type your own words. Pumps and Heating Elements have the **Control Type** columns: tick each way it may be controlled
   and pick the **Primary** one by its column number. A method that is not recommended unticks itself and says why, with **Use it
   anyway**. Valves ask their type, **Connection** (TC, NPT or BSP: how the valve is built into your manifold), **Size** and
   **Voltage**. Everything is in [Help 165](165-importer-item-and-widget-pages). An extra one you add has no Interface Port, so it will
   become a **Confirmation Widget** (Rule 1.28): Skynet asks you to do it by hand and confirm it is done.
6. **Your vessels.** It starts with the vessels found, where you rename one, set its **Side**, remove one (✖) or **➕ Add a
   vessel**. For each one, type its **Volume** and measure its **Height** and **Diameter** (Gallons and inches, or
   Liters and centimeters, from the Units question). Then what the import could tell about it from your names and Scripts: its **Heater Element** (a list of every BruControl heating element found; the guess is the one named for the vessel),
   its **Thermowell with Probe** (a list of every BruControl probe found; the guess is the one named for the vessel), its **Outlet** (None, Center Low or Bottom Drain; Bottom Drain to start), a **Tangential Inlet** tick box (a whirlpool pump means one on the Boil Kettle), **Sparge Arm / Steam
   Slayer** (one answer: None, Upper Left or Upper Right) and a **HERMS Coil** (the Panel's choices: None, Left, Right, Outlet Left & Inlet Right, Outlet Right & Inlet Left; None to start). What was found in your names or Scripts is
   marked *found*; it is a guess, change it if it is wrong; its **Motorized Ball Valve**
   (a list of every motorized valve found; the guess is the one named for the vessel). Everything is shown by its **BruControl name**
   during these steps, so you know each one; the Skynet names are still what is saved (Rule 15.1). **Manual Valves** are not in
   BruControl, so pick None, Manual Ball Valve or Manual Butterfly Valve (None to start). **Accept ▶** goes on; the answers are saved
   with each vessel, and the next page uses them to build each vessel into a Vessel Device.
   **🔨 Build** on a vessel opens the Skynet Panel's own **Vessel Device Builder** on the Build page, starting from that row's
   answers; its Heating Element and Probe pickers list the ones imported from your file (Help: Vessel Device Builder).
7. **Boards and Tabs:** everything else that comes in:

- your **Interfaces** (BruControl boards), each with its Interface ID and how many items it has. An Interface with **no
  items (0)** is **not** imported, unless you tick its **Import** box; then it **will** be imported;
- the **Look (theme)**: the Skynet Theme that most closely matches the theme set in BruControl (for Office 2019, **Skynet
  Office Black**). BruControl themes do not work in browsers, so Skynet has its own small set of Skynet Themes, and you can
  build your own User Theme. A new Skynet Theme for a Tab (old Workspace) can be chosen at any time;
- your **Tabs** (BruControl workspaces), each with its Tab ID. Tab backgrounds are left out for now. Tabs with items **will**
  be imported. A Tab with no items has a box: it **must** be ticked to be imported; left unticked, it is **not** imported, and
  neither are its Placeholders. A Tab with no items and no Placeholders is a good one to leave out;
- your **Globals** are **only listed** for now, on the summary (each Global with its Tab). They are not imported, they get no
  Placeholder, and nothing is asked about them: Globals will be dealt with in a later step;
- your **pumps** become Skynet **Pump Devices** with the Skynet pump drawing (the Pump Standard, with the same 8 IPs as every pump:
  Inlet on the Right Middle and Outlet on the Top Right to start), so any pump can be swapped in later; your **heating controls** keep their settings (BruControl's Target becomes the Setpoint, Kp, Ki, Kd ...; a script's `target` is written `.setpoint`, and an old
  `.target` line still works) and their temperature probe, so a
  click on that probe opens its SetPoint; anything BruControl marked as not user controlled does nothing when clicked;
- your **Charts**: each BruControl Chart becomes a Skynet **Graph Widget** ([Help 159](159-graph-widget)) with the same span,
  refresh, grid lines, colors and channels, and each item it draws is sent to the database so its line fills;
- the **items on a board port** (BruControl elements that have an Interface and a Port). For now only these come in;
- your **Widgets** (Timers, Alarms, Toggle Switches, Scripts), from the Widget pages; a pump BruControl ran by a temperature control
  is one **Cool / Warm Pump** (Device Type ID CPMP, [Help 164](164-cool-warm-pump));
- a **Placeholder** for every other item on a Tab (an Inspector, a Counter port ...). It is a grey box
  with ⬚ and the BruControl name, at the same place and size as in BruControl, so you can see what is still to come. A hidden
  item's Placeholder stays hidden.
- each item's **Layer Order** (BruControl's Z Order, [Help 114](114-universal-properties)): the first item in each BruControl Workspace
  is on top (Layer Order 1), the next is 2, and so on, so items that overlap are drawn the way BruControl drew them.

- your **pictures and sounds**: their paths are imported, and **the files stay where they were**, so BruControl continues to
  work normally. BruControl had a Browse box, so they may be in any folder. To see them in the Panel, add their folder (for
  example `C:\BruControl\Media`) in **Settings > Media folders**. A file that is not on this computer is listed; its path
  is kept anyway.

The list of new names and the notes for the report are at the bottom.

## Connect your brewery

### The Build Tab pages

Each Tab you are importing gets its own **Build Tab page**, one at a time, in the order the Tabs were in BruControl (for example
MD, then ME). A Tab you left unticked has no page. **◀ Previous Tab** and **Next Tab ▶** move between them. Each page has:

- **Before you build: the choices on a Build Tab**: what the Edit layout bar does, row by row, and
  **❓ Show every Build Tab choice and its hover help**, a pop-up with each choice and the hover help it shows in the Panel.
- **Build your manifold as it really is**: add the parts you turn or move by hand: **Manual Valve ➕**, **Elbows, Tees ...** joined with
  **Draw pipe** or **Draw hose**, **Draw QD hose**, and manual pumps (they become Confirmation Widgets, [Help 162](162-confirmation-widgets)).
- **🔨 Open the Build Tab for** that Tab: the **Skynet Panel's own Build Tab**, on that Tab, in its own window. It is the same Panel
  you build with every day. Only two things are different: **no board is connected**, and **Processes are greyed out** (your Scripts
  become Processes in a later Importer step).

Close the window when you are done: your work is kept in `Brewing\Import\build`, and it comes into your Schema when you save it on
the last page. If you import a different file, the Build Tabs start again from that file. Your Vessels and each Tab's items will be
placed for you once the Vessel Templates are built (the Vessel Device Builder, a later step).

BruControl only knew your valves and pumps as buttons; it never knew which vessel they sit on or what they are joined to. This
page asks **what is connected to what** (OakBarn Brewery, 2026-11-07), one piece at a time, "like the knee bone is connected to the leg
bone". The page shows a few lines of the old song (*Dem Bones*) and the brewery version, with **▶ Play the song** (Skynet's own
song, *Skynet - Outlet to Valve*, made by OakBarn Brewery; it never plays by itself, and the button turns into **■ Stop**) and
**▶ Hear it** beside the old song's lines (OakBarn Brewery's own clip of them in a comic voice).

- **Your vessels.** Guessed from your names and Scripts (HLT, Mash Tun, Boil Kettle, Fermenter). Rename, remove or add one.
  The **Hot Side** vessels are joined here; a **Fermenter** (Cold Side) has its own questions.
- **Build your vessels**, one at a time: **which template matches your vessel the best?** Every Skynet vessel format is shown
  as its picture (the Panel's own Vessel Templates); click the one that looks most like your vessel. The first pick is a guess
  from the name. **Save, next vessel ▶** goes on to the next one. Your vessel then looks like that template on the picture
  screen, and the answer is saved with it, so its Vessel Device can be built from it.
- **What is connected to what.** Each **chain** starts at a vessel opening (or a pump or valve), then says what that piece is
  **connected to**, then what *that* is connected to, until it reaches an **end**: a vessel opening, **Tap Water**, a
  **Drain**, a **Quick Disconnect (QD)** or **Not connected**. A QD also asks **Male or Female** and **Open or Shut-off**; a
  **Supply Manifold** asks which one. Each connection asks **by Pipe** or **by Hose** (Pipe is the guess, Hose for a QD).
  After a pump, the next piece leaves from its **Out**.
- **The first guesses** come from your names (a vessel's outlet to its own valve, then its own pump, for example *HLT Center
  Bottom Outlet > M_HLT PV2 > M_HLT Pump In*; a whirlpool pump back into the Boil Kettle) and, on a BruControl Tab with a
  background picture, from a valve that sits right next to a pump. Each one is marked **guess** until you click **✓**.
- **Not joined yet** lists every pump and valve no answer uses. A missing answer leaves it loose, never a wrong pipe.
- **A picture as a guide.** Pick the background picture you had on a BruControl Tab, or **📷 Use a photo or drawing** of your
  brewery (it stays on this computer); the picture's back is always black. Drag each vessel, pump and valve onto its place,
  then **click one** (it gets a yellow border) **and then another**, and a line joins them. A **blue** line is a **Pipe** (with its
  fittings), a **yellow** line is a **Hose**: **right-click** a line to change it. **Click** a line to pick it and press **Delete** to
  remove it (a line in the middle of a chain splits the chain in two). The picture is only a guide: it is not saved and nothing reads it.
  **🖼 Open the picture screen** shows it as large as the window. The vessels look like Skynet vessels, the pumps like pumps and
  the valves like valves. A Pipe runs only across, up and down, or at 45 degrees; a Hose hangs in a curve. Pieces joined by Pipe
  are stacked in a column under their vessel, a Hose moves over a column, with room to grab each line. It starts with twice as
  many columns as vessels: the left most vessel in the first column, the right most in the last, the others spaced between.
  **Set** moves the left most vessel one column right and the right most one column left, leaving a column between all the
  vessels; **↺ Start** puts every piece back where it started.
- **The list on its own screen.** **Next ▶ (the list)** on the picture screen shows **What is connected to what** as large as the
  window; its **◀ Back (the picture)** goes straight back to the picture, so you can move quickly between the two. **Next ▶**
  there returns to this page at the Fermenters (**📋 Open the list screen** opens it from the page; **Esc** closes either screen).
- **One vessel at a time.** The list has a button for each Hot Side vessel, **Other chains** (chains that reach no vessel) and
  **All**. **Save, next vessel ▶** marks the vessel done (✓) and shows the next one; every answer is kept as you go.
- **How each piece is joined:** **Vertical pipe** (the next piece is under it), **Pipe to the left**, **Pipe to the right** (the
  next piece is beside it) or **Hose**. A pipe to the left or right asks for its fitting: **with an Elbow**, or **with a Tee**, which
  puts a real Tee in the line: the pipe runs into the Tee, the Tee goes on down to the next piece, and its third opening starts
  a **branch** (its own chain, under it). **⊤ Tee** adds a Tee after any piece the same way. Back to an Elbow takes the Tee out
  again, unless its branch is joined to something. Until you drag a piece, the picture follows these answers.
- **Ask an AI about my picture (your choice).** The Importer itself never uses an AI. **🤖 Copy the question and open it**
  copies a ready-made question (it lists your own vessel, pump and valve names) and opens the free AI site you pick (Claude,
  ChatGPT or Gemini). Add your picture there and paste the question. Copy the AI's answer back into the box and click **Read
  the AI answer**: each line it can read becomes a connection marked **from the AI, check it**; a line it cannot read is listed,
  never guessed. Your picture goes to that AI company under your own account, not to Skynet.
- **Fermenters** are asked, not pictured (they are usually in another room): how it is cooled (glycol coil, jacket, chamber,
  wrap or not cooled) and warmed, which valves feed and return the glycol, which pumps cool and warm it, and its probe and
  pressure sensor. Each starts with a guess from the names and Script notes (for example *"FV 2 // feed glycol"*).

The answers are saved in the Schema file. The pipes and hoses themselves are drawn when the Vessels are built (a later Import
step).

## Save the Schema

**Save the Schema** saves what the Importer made as one Skynet Schema file (`.json`) in the **Import folder**:
`C:\Brewing\Import` when the panel is in `C:\Brewing\BrewPanel`. Type the Schema's name (spaces become `_`) and click
**💾 Save the Schema**. The file is named `<Name>_YYYY-MM-DDTHHMMSS.json`, so an older one is never written over.
**📂 Open the Import folder** shows it in File Explorer.

The file holds the Schema (Interfaces, Tabs, the items on a board port and the Placeholders) and the import report. It is
marked a **first draft**: the import is being built one step at a time, and Processes are not in it yet.

Then, in the **Skynet Panel**, open **Schema.json** and click **Open a Schema file** (Help 44).

## Installing the Importer

The Windows Setup asks **"Will you import a BruControl configuration on this computer?"** Under the question it says: "If you are a BruControl Brewer and want to import a BruControl .brucfg Configuration File, answer Yes. If you are not a BruControl Brewer, answer No." Yes adds the **Skynet BruControl
Importer** shortcut to your Desktop, the Start menu and the Import folder (`C:\Brewing\Import`); No leaves it out, and you can run Setup again to add it later. If you answered Yes, the last Setup page has two tick boxes, **Start Skynet Brewer now** (ticked) and **Start the BruControl
Importer now**: only one can be ticked, so only one program starts. Setup never clears the Importer's answers: use **Restart Fresh**
in the Importer. Setup
always makes the Import folder, as BeerSmith or other programs may save their files there too.

## Next steps (being built)

The import is built one step at a time with OakBarn Brewery: next come the other BruControl items (each Placeholder becomes the right
Skynet Device, Widget or Template, with a few plain questions; for each Vessel these include its **other openings**: Not there,
Open, or Plugged with a Thermowell, End Cap or Heating Element, where a plugged opening shows no IP), then Processes, with a report of every change (Rule 15.1).
How the older import code did each part is in `docs/BruControl_Old_Import_Method.md`.
