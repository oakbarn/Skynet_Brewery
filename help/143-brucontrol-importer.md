# BruControl Importer

The **Skynet BruControl Importer** turns a BruControl setup into a Skynet Schema (Skynet Rule 15.4; Fritz, 2026-11-06). It is
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
the Importer will guide you through. Click **Start ▶**.

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

The Importer looks **only in Documents\BruControl** first (the real Documents folder, even when Windows keeps it on
OneDrive). It lists every BruControl config file (`.brucfg`) there, newest first, with the date it was saved and its size.
BruControl may keep a **default config** there too; it is listed last and marked *(BruControl default)*.

- **No config file there, or only the default one?** The Importer asks you to point to the folder that holds yours: click
  **📁 Change folder…** and pick the folder, or type the folder in the box and press Enter (or click **Look**). Next time the
  Change folder box opens at the folder you picked last.
- **⌂ Documents\BruControl** goes back to the usual folder.
- **One config file makes one Schema.** You may have more than one config file: pick one, and import any other one on
  its own afterwards. Config files are never combined (Rule 15.4).
- **Click** a file to see what is in it: its Interfaces (boards), Tabs (workspaces), how many Devices and Widgets (elements),
  Processes (scripts) and gGlobals it has.
- **Double-click** a file (or click it and **Next ▶**) to pick it and go on. Back and Next are at the top and the bottom.

## Save the Schema

**Save the Schema** saves what the Importer made as one Skynet Schema file (`.json`) in the **Import folder**:
`C:\Brewing\Import` when the panel is in `C:\Brewing\BrewPanel`. Type the Schema's name (spaces become `_`) and click
**💾 Save the Schema**. The file is named `<Name>_YYYY-MM-DDTHHMMSS.json`, so an older one is never written over.
**📂 Open the Import folder** shows it in File Explorer.

The file holds the Schema (Interfaces, Tabs, Devices and Widgets), its Processes and the import report. Until the question
steps below are built, it is a **first draft** made straight from your config file, so you can already try the whole trip.

Then, in the **Skynet Panel**, open **Schema.json** and click **Open a Schema file** (Help 44).

## Installing the Importer

The Windows Setup asks **"Will you import a BruControl configuration on this computer?"** Yes adds the **Skynet BruControl
Importer** shortcut to your Desktop and Start menu; No leaves it out, and you can run Setup again to add it later. Setup
always makes the Import folder, as BeerSmith or other programs may save their files there too.

## Next steps (being built)

Boards, then Tabs and items (for each BruControl item the Importer asks a few plain questions, so it becomes the right Skynet
Device, Widget or Template), then Processes, with a report of every change (Rule 15.1).
