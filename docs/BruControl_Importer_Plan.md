# BruControl Importer: the plan

Started 2026-11-06 for Fritz (thread "Plan the BruControl config importer"). Fritz said go on 2026-11-06: first the Welcome
screen and the Starting dialog (built, Help 143), then the Oakbarn Schema, built from the Importer.

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

## 5. The Rule (now Rule 15.4)

Fritz gave it on 2026-11-06 ("a Template or Rules must be written to both the Skynet Panel or the Import BruControl
Program and vice versus"). It is in Skynet_Rules.md as Rule 15.4. The idea, in short:

> **One source for the Panel and the Importer.** The Skynet Brewery Panel and the Skynet BruControl Importer are built
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
7. **Option: start from the Skynet model** (Fritz, 2026-11-06). The Importer may ask whether the brewer wants a **new Schema based on
   a Skynet Schema Template** (like the 3 Vessel sample, with all its Processes built in from the Skynet Process Templates:
   Prebrew, Heat Strike, Strike, Mash, Boil, Whirlpool and Chill, Chill, Transfer to Fermentor, Clean, Ferment) instead of
   bringing the BruControl Scripts over line by line. The brewer answers a few questions and the brewery is ready to brew. The
   Templates themselves are built in their own thread; the Importer uses them (Rule 15.4).

## 8. Questions for Fritz

1. Is `26-26-46 VGC UNI and MB Relay.brucfg` the Oakbarn Brewery?
2. OK with "one program, two doors" (same Windows install, two shortcuts), instead of a fully separate program?
4. Open question 10 is still open: keep the strict Process check on import, or allow a BruControl-style lenient start?

## 9. Setup questions the Importer asks (Fritz, 2026-11-06)

Fritz's list of questions, asked before the items are brought in, so each BruControl item becomes the right Skynet Vessel,
Device or Widget. Plan only: nothing is built until Fritz says go. Both programs share the same Rules, Devices, Widgets and
Templates (Rule 15.4), so every answer feeds the same Vessel Templates and Vessel Rules (section 19) the Panel uses.

How they are asked (the Rules for dialogs):
- One clean page per question group, Back and Next at the top and the bottom.
- Short field names, with the longer explanation in a hover or tap tip (Rule 18.16).
- A choice of more than two things is a **dropdown**. A Yes / No is a **switch**. "Other" opens a text box for what it is.
- Plain English, correct spelling (Rule 2.37).

### The Vessel IP locations (Fritz's drawing, 2026-11-07)
"We are eventually going to build Vessels from his answers." Every answer about a fitting, element or probe names one of these
places (IPs) on the Vessel, so the Importer can later build the Vessel from the answers:

| Where | Places (top to bottom) |
|---|---|
| Left side | Left Sparge or Steam Slayer; Left HERMS In/Out (upper); Left HERMS In/Out (lower); Left Element |
| Right side | Right Sparge or Steam Slayer; Right HERMS In/Out (upper); Right HERMS In/Out (lower); Right Element |
| Back (inside) | Back Left Element; Back Right Element |
| Low | Left Tangential; Right Tangential |
| Center | Center Probe (above the outlet); Center Outlet; Center Bottom Outlet |

So the answers map like this: **High Return** (Sparge Arm, Steam Slayer, Inlet) uses a Sparge or Steam Slayer IP; **HERMS Coil**
uses the two HERMS IPs on its side; **Element location** is Left, Right, Back Left or Back Right Element; **Tangential Inlet**
is Left or Right Tangential; **Outlet** is Center Outlet (above the bottom) or Center Bottom Outlet; **Thermowell** and the
most common **Probe Location** are the Center Probe. (Fritz's drawing: project file importer/Vessel_IP_Template_Fritz_2026-11-07.png.)

### Dialog 1: Units and Vessels (asked once; Fritz's revised list, 2026-11-07)
1. **Units:** **Metric** (mL, kg, °C ...) or **US** (ounces, pounds, °F ...). Two choices. Every later question that has a size
   uses it (Liters or Gallons).
2. **How many Vessels do you have?** A number.
3. **Function of each Vessel:** one line for each Vessel (Vessel 1, Vessel 2 ...), each with a dropdown:
   HLT; HLT with HERMS; Mash Tun; Mash Tun with RIMS; Brew Kettle; **All In One** (a second dropdown: BrewZilla 3,
   BrewZilla 4, Grainfather, and so on, None); Fermentor; Other (a text box for what it is).

### Dialog 2: one for each Vessel ("Vessel N: HLT")
1. **Capacity:** Liters (Metric) or Gallons (US). This is the Vessel's Gallons field (Rule 19.1).
2. **Dead Space:** the same units as Capacity.
3. **Outlet fitting:** TC 1.5; NPT; BSP; None.
4. **Thermowell:** Center Above, Manual Thermometer; Center Above, BruControl Probe; None.
5. **High Return:** Sparge Arm; Steam Slayer; Inlet; None.
6. **Tangential Inlet:** Left; Right; None.
7. **Outlet:** TC above Bottom; TC Bottom Outlet; BSP above Bottom; BSP Bottom Outlet; None.
8. **HERMS Coil inside the Vessel:** Left Outlet and Inlet; Right Outlet and Inlet; Right Inlet, Left Outlet; Left Inlet,
   Right Outlet; None.
9. **Heat Source:** a dropdown. What comes under it depends on the choice:
   - **BruControl Heating Element**
     - **Element location:** Right; Left; Back Left; Back Right; None.
     - **BruControl Element:** a dropdown of the imported heating Devices (Hysteresis, PID, Duty Cycle, Deadband and so on),
       each shown by its **BruControl name**.
     - **Temperature Probe:** a dropdown of the imported probes by their BruControl name. It is **filled in automatically** from
       the properties of the BruControl Element picked (the probe that Element reads), and **always shown**, so the brewer
       sees it and can change it.
     - **Probe Location:** Center Probe, above the outlet (most common); Left Element; Right Element; Back Left Element; Back
       Right Element; Left or Right HERMS In/Out (the IP locations above). Filled in automatically when it can be, always shown.
   - **Gas Burner, not smart.** Two switches: **BruControl controls the Gas Valve**; **BruControl controls the Igniter**.
   - **Gas Burner with smart control.** Two switches: **BruControl controls the Gas Valve**; **BruControl turns on the Smart
     control**.
   - **Gas Burner, total manual control.**
   - **BruControl RIMS Tube.**
   - **Oakbarn Modified HERMS (BruControl).**
   - **Unheated.**

### Dialog 2b: what is on each outlet (Fritz, 2026-11-07)
"We need to ask about outlets and what is connected to them (Valves and Type), Pipe Fittings, and if a Valve what comes Next
(elbow)." For each outlet or inlet the Vessel has (Center Outlet, Center Bottom Outlet, Tangential, Sparge or Steam Slayer,
HERMS In/Out), a drill-down, one step at a time, like the Pump Add box (Rules 4.2, 18.13):
1. **What is connected:** Valve; Pipe Fitting; Probe tee or Thermowell (Rule 5.30); Sight Glass (Rule 5.32); Nothing.
2. **If a Valve:** its **Type** (Manual Ball Valve, Motorized Ball Valve, Butterfly, and so on, from the Valve Standard) and,
   when it is motorized, **which imported Device runs it** (a dropdown by BruControl name, an educated guess filled in).
3. **What comes next** after it: Elbow 90; Elbow 45; Tee; Reducer; End Cap; **None** (the TC Pipe Fittings, Rule 5.25). Each
   answer asks "what comes next" again, so a short run (outlet, valve, elbow ...) is built up. **Every outlet chain ends with
   None** (Fritz, 2026-11-07: "Basically have to have none at the end for the Outlet chain"): None is always in the list, and
   picking it ends the chain.
4. **The end of the chain** (Fritz, 2026-11-07: "End could be a Pipe, Hose, Supply manifold or None"): **Pipe**; **Hose**
   (Quick Disconnect, Rule 5.34); **Supply Manifold** (Double or Triple, Rule 5.35); **None**. A Pipe, Hose or Manifold also
   ends the chain. **The Pipe, Hose or Supply Manifold itself is not added** (Fritz, 2026-11-07: "do not add the supply
   manifold Hose or Pipe, just the Ip"): the chain ends with an **IP** there, where the brewer connects it on the Tab later.

### Building the Vessel Device, shown before saving (Fritz, 2026-11-07)
"Once the answers are done, create a Vessel Device with the Integral Components and Place On the Brewery Tab. Drill Down to get
to where we can build the Device vessel and display it to the user before saving."
- From the answers the Importer builds one **Vessel Device** (Rule 5.31, The Vessel Device) from the Vessel Master Template: each
  answer turns its IP location on (Place) and puts the part there (Element, Probe, Thermowell, Sparge Arm or Steam Slayer,
  HERMS Coil, Tangential Inlet, Outlets with their valves and fittings). The parts are integrated: they never unbundle.
- It is sized from the Capacity (Vessel Rules, section 19) and named the Skynet way (Rule 3.1).
- **Preview before saving:** the finished Vessel Device is drawn for the brewer, with its parts, before anything is saved. The
  brewer can go Back to any question and change it; **Save** places it on the **Brewery Tab**.
- Imported items that are now part of the Vessel (its heater, probe, valves) are linked to it; their Placeholders go away.

### Dialog 3: More Questions
To come (Fritz, 2026-11-07: "New Dialog More Questions").

### Educated guesses, and the Scripts as clues (Fritz, 2026-11-06)
"We can make an educated guess. We may also want to import his Scripts even if the User elects to use Skynet Templated
Processes as we may gain what a vessel is used for."
- Each answer starts with the Importer's **educated guess**, worked out from the config file (item names and DisplayNames such
  as HLT, MLT, BK, Kettle; which port runs which heater or valve; pictures; the Tab it sits on). The brewer only checks it
  and changes what is wrong.
- The **BruControl Scripts are always read**, even when the brewer picks the Skynet Templated Processes (section 7, option 7).
  They are clues for the guesses: a script that heats to strike temperature and then opens the valves into the mash tun
  tells which vessel is the HLT and which heater and valves belong to it. Whether the Scripts are also brought in as Processes
  stays the brewer's choice.

### Open questions for Fritz on this list
1. **Two Outlet questions (2.3 and 2.7).** Suggestion: 2.3 is the outlet's **fitting** (TC 1.5, NPT, BSP) and 2.7 is **where** it is.
   Then 2.7 could be just "Above Bottom; Bottom Outlet; None", since 2.3 already says TC or BSP.
2. **Gas Burners:** when BruControl controls the Gas Valve or the Igniter, pick that Device the same way (a dropdown of the
   imported Devices by BruControl name), and the Temperature Probe too?
3. **All In One:** which other models go in the list (for example Anvil Foundry, Clawhammer, Robobrew)? Does an All In One
   skip the questions its model already answers (Outlet, Thermowell, HERMS Coil, Element location)?
4. **Order: decided** (Fritz, 2026-11-06): these dialogs come **after Names**, "because in some follow ups we will associate
   heater, Probes and valves eventually to what Device control is the HLT Heat for example."

