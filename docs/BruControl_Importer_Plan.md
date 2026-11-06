# BruControl Importer: the plan

Started 2026-11-06 for Fritz (thread "Plan the BruControl config importer"). **This is a plan only. No code is built until
Fritz OKs it** (Rule 13.4: the importer waits for his go).

---

## 1. What we are making

A **Skynet BruControl Importer** that a brewer runs on **Windows only, on the same computer as BruControl** (Fritz,
2026-11-06). BruControl runs only on Windows, so no Mac or Linux Importer is needed. Because it sits beside BruControl, it can
find the BruControl config file (`.brucfg`) and its Media folder (`C:\BruControl\Media`) by itself, so the brewer does not have to
hunt for them or copy them. It opens them and makes a **Skynet Schema** from them, with a plain report of everything it changed or
could not bring over. The Schema then goes onto the Brain, and the brewery shows up on its Tabs ready to check.

A valve, pump, probe or vessel made by the Importer must be **exactly** the one the Skynet Panel makes: same Template, same
picture, same size, same IPs, same Name and Label rules, same Properties.

## 2. Two things we already have

- **An old importer inside the Panel** (Settings > Import > BruControl Schema, from PR #2, 2026-10-03). It reads a `.brucfg`
  and makes Devices, Tabs and Processes, but it is older than most of the Rules (Templates, the Pump and Valve Standards, the
  Device name convention, Labels, Vessels). It is the starting point for the reading part, not the finished thing.
- **Fritz's own BruControl file is already on file**: `26-26-46 VGC UNI and MB Relay.brucfg` (uploaded 2026-10-03, 3 Interfaces,
  17 workspaces, about 900 elements, 175 scripts). **Question for Fritz: is this the Oakbarn Brewery?** If yes, we can start
  with it today and not wait for other brewers' files. Its Media folder (about 157 pictures) still needs to be sent.

## 3. One program, two doors (how it shares everything with the Panel)

The safest way to make the Importer match the Panel exactly is for both to be **built from the same code, the same
Templates, the same pictures and the same Rules, in the same GitHub repo**. Nothing is copied into a second project, so
nothing can drift apart.

- **Same box, two shortcuts.** The Windows Setup .exe puts in one Skynet program. It has two shortcuts: **Skynet Brewery Panel** and **Skynet BruControl Importer**. The Importer opens in its own clean
  window (like Rule 2.36) and works **without** a Brain being set up, without boards, and without signing in to a Panel, so a
  BruControl user can try it before moving. (The Mac and Linux / Pi installers get no Importer shortcut.)
- **Same parts inside.** The Importer uses the Panel's own builders: the Build Tab's Add dialogs, the Skynet Templates
  (`templates/`), the Skynet pictures (`media/`), the Device name convention (InterfaceID_Port_Type_Label_Tab), the Label
  Rule (18.15), the Pump, Valve and Vessel Standards, and the Importing Norms. When any of these change, both doors change
  in the same PR.
- **Same version number.** The Importer shows the same Panel version (Rule 9.4). A Schema made by an older Importer is
  brought up to date when the Brain loads it, like any older Schema (Rule 15.2).
- **Changes flow both ways.**
  - *A new Skynet Template* (for example a new Oakbarn vessel) is made once, in the repo, by PR. The Panel's Build Tab and the
    Importer both get it from the same `templates/` folder.
  - *A User Template* made while importing (Rule 5.1) is saved **into the Schema** it belongs to, so it reaches the Brain with
    the Schema. A User Template made on the Panel can be sent back to the Importer by exporting it (one file), so the next
    import uses it too.
  - *A new or changed Rule or Importing Norm* goes in `docs/Skynet_Rules.md` / `docs/Importing_Norms.md` as now, and the code
    for both doors is changed in the same PR.

**The other way (not recommended):** a fully separate Importer program with its own code. It would need every Template,
picture and Rule copied into it and kept in step by hand, and sooner or later a valve from the Importer would not match a
valve from the Panel.

## 4. Rule check

**Rule 1.7** says: "The Brain holds all text, picture and Schema files and every saved value ... so the panel can be reached
from anywhere, and everything works the same whichever kind of Brain it is."

A separate Importer on a computer that is not the Brain could break this if it kept its own Schemas or pictures. This plan
keeps the Rule: the Importer only holds the files Skynet ships (like any install), works on the one import in front of it, and
**hands the finished Schema, its pictures and its User Templates to the Brain** (Schema import on the Brain, or Move Brain
style one-file handoff, Rule 9.9). It keeps nothing for itself after that. So **no exception is needed**, unless Fritz wants the
Importer to keep its own library of imported Schemas; that part would need a change to Rule 1.7 or an exception.

No other Rule is broken. Rule 15.1 (importing always updates to the Skynet way), 15.2 and 15.3 all apply to the Importer as
they do to the Panel.

## 5. Proposed new Rule (for Fritz to OK)

> **15.4 One source for the Panel and the Importer.** The Skynet Brewery Panel and the Skynet BruControl Importer are built
> from the same repo and share one copy of the code, the Skynet Templates, the Skynet pictures and sounds, the Rules and the
> Importing Norms. A Template, picture, standard or Rule is never made for only one of them: a change made for one is made for
> both in the same PR, so an item the Importer makes is exactly the item the Panel makes. User Templates travel with the Schema
> (Importer to Brain) or by export (Brain to Importer). The Importer keeps no Schemas of its own; its result goes to the Brain
> (Rule 1.7).

## 6. What we need from a BruControl brewer

On the brewer's own computer the Importer finds items 1 and 2 by itself. For us to **build and test** the Importer, a brewer
sends:

1. **The config file** (`.brucfg`). In BruControl it is the saved configuration file (often in `C:\BruControl\`).
2. **The Media folder** (`C:\BruControl\Media`), zipped, so every picture and sound comes in.
3. **The BruControl version** and, for each Interface, the **board** and **firmware / wiring map** (for example Mega 2560, FW 46).
4. **A screenshot of each workspace**, so we can check that the Tabs look right after import.
5. **A short list of the real vessels**: name, gallons, and what is on each one (outlets, tangential inlet, thermowell, element,
   probe, sight glass, HERMS coil). This is what we build the matching Vessel Templates from.
6. **A photo or sketch of the brewery** if they have one (pipes, pumps, valves), to check the flow paths.
7. **Their OK** for how we use it (see below).

**Privacy:** the Skynet repo is public. Another brewer's file, pictures and names are **never** put in the repo or shared
without their written OK. A config can hold network addresses or passwords; we check for them and leave them out. Their files
stay in the private project folder.

## 7. Suggested order (after Fritz's go)

1. **Start with the Oakbarn Brewery** (Fritz's file, if section 2 is right). Make a list of every vessel, pump, valve, probe,
   element and pipe in it, and what Skynet Template each one will become. Fritz checks the list.
2. **Build the missing Oakbarn Vessel Templates** as Skynet Templates (one PR each, or a few together), to the Vessel Rules
   (section 19).
3. **Bring the import code up to the Rules**: the old Panel importer's reading part, now making items through the same
   builders as the Build Tab.
4. **Make the Importer door**: pick the `.brucfg` and the Media folder, see a preview of each Tab, read the report, save the
   Schema, hand it to the Brain.
5. **Try other brewers' files** as they arrive; each new thing found becomes an Importing Norm.
6. **Put the Importer shortcut in the Windows Setup .exe.**

## 8. Questions for Fritz

1. Is `26-26-46 VGC UNI and MB Relay.brucfg` the Oakbarn Brewery?
2. OK with "one program, two doors" (same Windows install, two shortcuts), instead of a fully separate program?
3. OK to add proposed Rule 15.4?
4. Open question 10 is still open: keep the strict Process check on import, or allow a BruControl-style lenient start?
