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

Pick how your items are named in Skynet:

- **Skynet names (recommended).** Every name tells you its Interface, Port, Type, Label and Tab at a glance (Rule 3.1), for
  example `MB_28_do_ManualAlarm_B1` becomes `BR_28_DO_Manually_BB`.
- **Keep my BruControl names.** Allowed, but two warnings come first, like Start Fresh: **"Do you really want to keep your
  BruControl names?"** and then **"Last chance"**. **No** (use the Skynet names) is the default both times. Spaces and
  characters a name may not have still change.

**Pictures and Sounds:** the picture paths and sounds are imported, and the files stay where they were, so BruControl
continues to work normally. The tick box **Also copy my pictures and sounds into one folder with subfolders (Recommended)**
is ticked to start with: every picture is then copied into `media\Images\User` and every sound
into `media\sounds\User` of the Skynet Panel, so they are all together if you move to a Pi or another computer, and the items
use the copies. They are never deleted in their original spot, just copies made, and a copy already there is never written over.
Untick it to keep only the paths. New pictures and sounds you add in Skynet are always put in its media folders.

Your BruControl **DisplayName** becomes the **Label**, the name shown on the Tab. A blank DisplayName: the Label is the Name,
and it is not shown on the Tab.

## Boards and Tabs

**Next ▶** makes the **Import Copy**: your config file is copied into `C:\Brewing\Import\BruControl` (named
*name*_*date*T*time*.brucfg, also when you picked a `.bak` backup) and only the copy is converted, so BruControl's own file is never changed. Then you see what comes in:

- your **Interfaces** (BruControl boards), each with its Interface ID and how many items it has. An Interface with **no
  items (0)** is **not** imported, unless you tick its **Import** box; then it **will** be imported;
- the **Look (theme)**: the Skynet Theme that most closely matches the theme set in BruControl (for Office 2019, **Skynet
  Office Black**). BruControl themes do not work in browsers, so Skynet has its own small set of Skynet Themes, and you can
  build your own User Theme. A new Skynet Theme for a Tab (old Workspace) can be chosen at any time;
- your **Tabs** (BruControl workspaces), each with its Tab ID. Tab backgrounds are left out for now. Tabs with items **will**
  be imported. A Tab with no items has a box: it **must** be ticked to be imported; left unticked, it is **not** imported, and
  neither are its Placeholders. A Tab with no items and no Placeholders is a good one to leave out. When every Placeholder on a
  Tab is a BruControl Global, the page asks whether those Globals are used to import a Beer.xml recipe (for example with
  Node-RED): if Yes, leave it unticked, since Skynet imports recipes without Globals; if they are used for something else (for
  example sending readings to the Database), tick it and they are dealt with when the Globals are imported;
- your **pumps** become Skynet **Pump Devices** with the Skynet pump drawing (the Pump Standard), so any Skynet pump can be
  swapped in later; your **heating controls** keep their settings (Target, Kp, Ki, Kd ...) and their temperature probe, so a
  click on that probe opens its SetPoint; anything BruControl marked as not user controlled does nothing when clicked;
- your **Charts**: each BruControl Chart becomes a Skynet **Chart Widget** ([Help 159](159-chart-widget)) with the same span,
  refresh, grid lines, colors and channels, and each item it draws is sent to the database so its line fills;
- the **items on a board port** (BruControl elements that have an Interface and a Port). For now only these come in;
- a **Placeholder** for every other item on a Tab (Timers, Alarms, switches, Globals, script pictures ...). It is a grey box
  with ⬚ and the BruControl name, at the same place and size as in BruControl, so you can see what is still to come. A hidden
  item's Placeholder stays hidden.

- your **pictures and sounds**: their paths are imported, and **the files stay where they were**, so BruControl continues to
  work normally. BruControl had a Browse box, so they may be in any folder. To see them in the Panel, add their folder (for
  example `C:\BruControl\Media`) in **Settings > Media folders**. A file that is not on this computer is listed; its path
  is kept anyway.

The list of new names and the notes for the report are at the bottom.

## Connect your brewery

BruControl only knew your valves and pumps as buttons; it never knew which vessel they sit on or what they are joined to. This
page asks **what is connected to what** (OakBarn Brewery, 2026-11-07), one piece at a time, "like the knee bone is connected to the leg
bone". The page shows a few lines of the old song (*Dem Bones*) and the brewery version, with **▶ Play the song** (Skynet's own
song, *Skynet - Outlet to Valve*, made by OakBarn Brewery; it never plays by itself, and the button turns into **■ Stop**) and
**▶ Hear it** beside the old song's lines (OakBarn Brewery's own clip of them in a comic voice).

- **Your vessels.** Guessed from your names and Scripts (HLT, Mash Tun, Boil Kettle, Fermenter). Rename, remove or add one.
  The **Hot Side** vessels are joined here; a **Fermenter** (Cold Side) has its own questions.
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
Importer** shortcut to your Desktop, the Start menu and the Import folder (`C:\Brewing\Import`); No leaves it out, and you can run Setup again to add it later. If you answered Yes, the last Setup page has a tick box, **Open the BruControl Importer now**. Setup
always makes the Import folder, as BeerSmith or other programs may save their files there too.

## Next steps (being built)

The import is built one step at a time with OakBarn Brewery: next come the other BruControl items (each Placeholder becomes the right
Skynet Device, Widget or Template, with a few plain questions; for each Vessel these include its **other openings**: Not there,
Open, or Plugged with a Thermowell, End Cap or Heating Element, where a plugged opening shows no IP), then Processes, with a report of every change (Rule 15.1).
How the older import code did each part is in `docs/BruControl_Old_Import_Method.md`.
