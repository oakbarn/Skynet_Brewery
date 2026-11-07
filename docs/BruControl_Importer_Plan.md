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

### Before the questions: the Vessel Build page (Fritz, 2026-11-07)
"This is totally new in Skynet. BruControl had a Picture and that was about the sum of a vessel. We need a good explanation
of the Vessel Build before the Questions." So the first page of this step explains it, before Dialog 1. It has only Back and
Next (top and bottom), a small drawing of a finished Vessel Device with its parts, and this text (Fritz revised the end, 2026-11-07):

> **Building your Vessels**
>
> In BruControl, a vessel was a picture on a Workspace. The heater, the probe and the valves were separate items placed near
> it, and nothing tied them together.
>
> In Skynet, each vessel is a **Vessel Device**: one item that has its parts built in. The heating element, the temperature
> probe, the thermowell, the sparge arm or Steam Slayer, the HERMS coil, and the outlets with their valves and fittings each
> sit in their own place on the vessel. They move with it and stay with it.
>
> Because Skynet knows how your vessels are built, it knows which heater and which probe belong to your HLT, where the wort
> goes when a valve opens, and what the brewing steps should do.
>
> The next pages ask how each of your vessels is built: its size, its fittings, its heat source, and what is on each outlet.
> Each answer is already filled in with our best guess, taken from your BruControl names, Workspaces and Scripts. Just check
> each one and change what is wrong.
>
> When the answers are done, you see each finished Vessel Device before anything is saved. You can go Back and change any
> answer. The Vessel Device is the integrated valves, heaters and probes, so each part has its properties just like in
> BruControl: a Valve like a BruControl Valve (Digital Output Element), a Heater like a BruControl Heater (PID, Hysteresis,
> PWM and so on). But the Properties are **all integrated into a single Device**. **Save** puts the Vessel Device on your
> **Brewery** Tab.
>
> Nothing in BruControl is changed.

- The longer points (what an IP is, Integrated items never unbundle, Vessel sizes by Gallons) go in hover help on the
  drawing, not on the page (clean dialogs, Rule 18.16).
- The drawing is made from the Vessel Master Template (Rule 5.31), not a new picture in the Image Library.

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
   BrewZilla 4, Robobrew, Grainfather G30, Grainfather G40, Grainfather G70, Anvil Foundry, Clawhammer, Other, None);
   Fermentor; Other (a text box for what it is).
   - **An All In One skips the questions its model already answers** (Fritz, 2026-11-07: "Yes"), such as the Outlet,
     Thermowell, HERMS Coil and Element location. Those answers come from the model and are shown, so the brewer can still
     change them. "Other" or "None" asks every question.

### All In One models that can talk to other programs (looked up 2026-11-07, for later)
Fritz asked: "Can any model talk with MQTT? That might make a difference if Skynet could Get and Put for an All In One."
None of these talks MQTT by itself. Some have their own app connection, which a bridge (for example Node-Red) could pass on:

| Model | How it connects | What Skynet might do, later |
|---|---|---|
| BrewZilla 4 (Gen 4) | Wi-Fi and Bluetooth to the KegLand RAPT cloud (internet and a RAPT account) | **Get and Put both possible.** The RAPT API (api.rapt.io, made by KegLand) reads the temperature and target temperature and can set the Target, turn the heater and pump on or off, set Heating % and Pump %, and set the PID. Needs internet, a RAPT account and an API secret. A hobby MQTT bridge (RAPT-to-MQTT) already exists |
| Grainfather G30, G40, G70 (Connect controller) | Bluetooth to the Grainfather app | Hobby projects (Python, Node-Red) already read and control it over Bluetooth |
| BrewZilla 3, Robobrew | None (buttons on the controller) | Nothing; BruControl or Skynet boards would have to take over the heat and pump |
| Anvil Foundry | None | The same |
| Clawhammer | None found (a plain controller) | The same |

**Test brewer** (Fritz, 2026-11-07): "One of my fellow Brewers has a Brewzilla 4 so we can Test it." When this is built, that
brewer makes an **API secret** (a key for other programs) in their own RAPT account; they keep their RAPT password to
themselves and can delete the key after. Things to check in the test: how often the temperature updates, whether the Put
commands work with that key, and that it still works after RAPT's move to its new system (2026-09-21). The API pages
(computer terms): GET /api/BrewZillas/GetBrewZillas, GetBrewZilla, GetTelemetry; POST SetTargetTemperature,
SetHeatingEnabled, SetHeatingUtilisation, SetPumpEnabled, SetPumpUtilisation, SetPIDEnabled, SetPID; sign in at
id.rapt.io/connect/token (from the community client fkolacek/kegland_rapt_api_client, not from KegLand's own docs).

**One account per BrewZilla** (Fritz, 2026-11-07: "They are not sure a two RAPT accounts can share the same Brewzilla 4.
There is no mention of supporting MQTT that they know of in the documentation"). So the plan assumes one RAPT account owns
each BrewZilla 4, and Skynet talks to the RAPT API directly with that owner's API secret. MQTT is not part of RAPT; the
RAPT-to-MQTT bridge is someone else's hobby program and only an option.

**Chosen way for later** (Fritz, 2026-11-07: "for RAPT integration use the RAPT API at api.rapt.io first. Then the Bridge."):
1. **First, the RAPT API** (api.rapt.io): Skynet talks to it directly with the owner's API secret, to read and set the
   BrewZilla 4.
2. **Then the Bridge** (RAPT-to-MQTT), second (Fritz: "We can use that MQTT Bridge for Voice Commands as well as reading and
   setting things").

Either way, voice commands reach the BrewZilla by its API_Name (Rule 6.18). Nothing is built until Fritz says go.

So a connected All In One would become an Interface of its own kind (a cloud or Bluetooth link instead of a board). That is
not part of this plan; it needs Fritz's go and its own Rule.

### Dialog 2: one for each Vessel ("Vessel N: HLT")
1. **Capacity:** Liters (Metric) or Gallons (US). This is the Vessel's Gallons field (Rule 19.1).
2. **Dead Space:** the same units as Capacity.
3. **Outlet:** a drill-down (Fritz, 2026-11-07: "Drill Down is good"). First the **fitting**: TC 1.5; NPT; BSP; None.
   If it is not None, then **where it is**: Above Bottom (Center Outlet IP); Bottom Outlet (Center Bottom Outlet IP).
4. **Thermowell:** Center Above, Manual Thermometer; Center Above, BruControl Probe; None.
5. **High Return:** Sparge Arm; Steam Slayer; Inlet; None.
6. **Tangential Inlet:** Left; Right; Left and Right; None. It uses the Left or Right Tangential IP from the drawing (both IPs
   for Left and Right). Each tangential then gets its own connection chain in Dialog 2b (Fritz, 2026-11-07: "If I forgot ask
   about tangentials").
7. **HERMS Coil inside the Vessel:** Left Outlet and Inlet; Right Outlet and Inlet; Right Inlet, Left Outlet; Left Inlet,
   Right Outlet; None.
8. **Heat Source:** a dropdown. What comes under it depends on the choice:
   - **BruControl Heating Element**
     - **Element location:** Right; Left; Back Left; Back Right; None.
     - **BruControl Element:** a dropdown of the imported heating Devices (Hysteresis, PID, Duty Cycle, Deadband and so on),
       each shown by its **BruControl name**.
       **One physical Element, more than one way to control it** (Fritz, 2026-11-07: "It is one Physical Element, so there are not
       2, just the way it is controlled Duty Cycle or PID"). BruControl controls on the **same Interface and Port** (for example
       "M_HLT Heat" Duty Cycle and "HLT PID" on port 42, Rule 6.1) are **one Element**: the dropdown shows them as one entry
       (for example *Main Panel port 42: M_HLT Heat (Duty Cycle) or HLT PID (PID)*), and every control on that port is linked to
       that one Element, as its ways of being controlled. It is never two Elements.
     - **Temperature Probe:** a dropdown of the imported probes by their BruControl name. It is **filled in automatically** from
       the properties of the BruControl Element picked (the probe that Element reads), and **always shown**, so the brewer
       sees it and can change it.
     - **Probe Location:** Center Probe, above the outlet (most common); Left Element; Right Element; Back Left Element; Back
       Right Element; Left or Right HERMS In/Out (the IP locations above). Filled in automatically when it can be, always shown.
   - **Gas Burner, not smart.** Two switches: **BruControl controls the Gas Valve**; **BruControl controls the Igniter**.
   - **Gas Burner with smart control.** Two switches: **BruControl controls the Gas Valve**; **BruControl turns on the Smart
     control**.
   - For both Gas Burners (Fritz, 2026-11-07: "If there is BruControl Valve Yes"): each switch that is on opens a dropdown
     of the imported Devices by **BruControl name** (an educated guess filled in), the same way as the BruControl Element.
     The **Temperature Probe** and **Probe Location** are asked the same way too, always shown.
   - **Gas Burner, total manual control.**
   - **BruControl RIMS Tube.**
   - **Oakbarn Modified HERMS (BruControl).**
   - **Unheated.**
9. **Other openings** (Fritz, 2026-11-07: "In the interview, we need to ask about any other openings (IPs)"). Asked last, after
   the questions above, so it only lists the openings not already used by an answer: every other IP of the Vessel Master
   Template (for example Left Sparge, Right HERMS In and Out, Back Left Element, Center Probe, Center Outlet). Each opening is
   one line with a dropdown:
   - **Not there**: the Vessel has no opening here (Place off, so nothing shows).
   - **Open**: something connects to it. It gets its own connection chain in Dialog 2b, the same as an outlet.
   - **Plugged with a Thermowell**: then a dropdown of the imported probes by BruControl name, or Manual Thermometer, or None.
   - **Plugged with an End Cap.**
   - **Plugged with a Heating Element**: then a dropdown of the imported heating Devices by BruControl name, as for the
     Heat Source.

   Each line starts with the educated guess (Not there, unless the BruControl names, Workspaces or Scripts show something
   there). **A plugged opening's IP is hidden; only open IPs show** (Rule 5.31), on the preview and on the Brewery Tab.

### Dialog 2b: what is on each outlet (Fritz, 2026-11-07)
"We need to ask about outlets and what is connected to them (Valves and Type), Pipe Fittings, and if a Valve what comes Next
(elbow)." For each outlet or inlet the Vessel has (Center Outlet, Center Bottom Outlet, Left Tangential, Right Tangential,
Sparge or Steam Slayer, HERMS In/Out, and every **Open** opening from Dialog 2, question 9), a drill-down, one step at a time, like the Pump Add box (Rules 4.2, 18.13):
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
5. **Tangentials** get the same chain as the outlets, one for each tangential the Vessel has: what is connected (usually a
   Valve), the valve Type and the Device that runs it, what comes next, and the end (Pipe, Hose, Supply Manifold or None, only
   an IP). The chain starts at the Left or Right Tangential IP.
6. **Other open openings** (Dialog 2, question 9) get the same chain too, starting at that opening's IP.
7. **A plug ends the chain** (Fritz, 2026-11-07): a Thermowell, an End Cap or a Heating Element put on an opening plugs it. The
   chain ends there and that IP is hidden; only open IPs show (Rule 5.31).

### Building the Vessel Device, shown before saving (Fritz, 2026-11-07)
"Once the answers are done, create a Vessel Device with the Integral Components and Place On the Brewery Tab. Drill Down to get
to where we can build the Device vessel and display it to the user before saving."
- From the answers the Importer builds one **Vessel Device** (Rule 5.31, The Vessel Device) from the Vessel Master Template: each
  answer turns its IP location on (Place) and puts the part there (Element, Probe, Thermowell, Sparge Arm or Steam Slayer,
  HERMS Coil, Tangential Inlet, Outlets with their valves and fittings, and the other openings: open, or plugged with a
  Thermowell, End Cap or Heating Element). The parts are integrated: they never unbundle. Plugged openings show no IP; only
  the open IPs show, ready for pipes and hoses on the Tab.
- It is sized from the Capacity (Vessel Rules, section 19) and named the Skynet way (Rule 3.1).
- **Preview before saving:** the finished Vessel Device is drawn for the brewer, with its parts, before anything is saved. The
  brewer can go Back to any question and change it; **Save** places it on the **Brewery Tab**.
- Imported items that are now part of the Vessel (its heater, probe, valves) are linked to it; their Placeholders go away.

### Connect your brewery: how valves and pumps join the vessels (plan only, Fritz 2026-11-07)
Fritz, 2026-11-07: "One obvious issue is how valves and pumps are connected to the vessels. Can a uploaded Picture help in the
building, but only within the program (no AI)"; "We can Also ask the User about his 'manifold Layout' what is connected to
what." The Tartan test build (Tartan1, 2026-11-07) showed this is the biggest gap: 10 valves had nothing saying where they sit.

A new Importer step, after the Vessel Devices are built and before the Schema is saved. Nothing here reads a picture with AI:
the program only shows it and measures distances on the screen. Three helpers, used together:

1. **Manifold questions (what is connected to what), built one piece at a time** (Fritz, 2026-11-07: "Build the manifold like
   the knee bone is connected to the leg bone"). The manifold is walked as chains, like Dialog 2b: start at a Vessel outlet (or a
   pump), ask **what is connected to it**, then **what is connected to that**, and so on (each link asks Hose or Pipe) until the
   chain reaches an end (a Vessel IP, Tap Water, Drain, a QD, or Nothing). A Tee or Supply Manifold opens a branch that is walked
   next. Every item already used shows as used, so nothing is joined twice, and a loose valve or pump left at the end gets its own
   chain. **The page's explanation uses the rhyme** (Fritz, 2026-11-07: "put that little rhyme in the Explanation of how a
   manifold is built"): *"The outlet's connected to the valve, the valve's connected to the pump, the pump's connected to the
   hose ..."*, one piece at a time, the way the old song goes. The page shows a few lines of the song first (Fritz, 2026-11-07:
   "show a few lines of that old song"; "Dem Bones", 1928, now public domain):
   > *Toe bone connected to the foot bone,*
   > *Foot bone connected to the heel bone,*
   > *Heel bone connected to the ankle bone,*
   > *Ankle bone connected to the leg bone ...*

   A small **▶ Play** button beside it plays a few bars of the tune (Fritz, 2026-11-07: "if there is a free Copy of the song a
   snippet that plays"). The song itself is free to use, but most **recordings** have their own copyright, so the Importer plays
   the tune **from its own notes** (the browser makes the sound, no recording file). If a recording marked free to use (public
   domain or CC0) is found later, Fritz decides whether to use it instead. It never plays by itself, only on the click.
   *Or our own song file* (Fritz, 2026-11-07: "we could just make our own song file using an AI Childs voice"): the song is free
   to use and the brewery verse is our own, so a short sung file made with an AI singing tool can replace the notes, if that
   tool's terms allow its songs in a program we give away. Fritz makes or picks the file; it goes in `media/sounds/Skynet`.

   and then the brewery version:
   > *Outlet connected to the valve,*
   > *Valve connected to the pump,*
   > *Pump connected to the hose,*
   > *Hose connected to the mash tun ...*

   Each link is one
   short drill-down question, like Dialog 2b: **From** (a Vessel and its IP, a pump's in or out, another valve, a Supply Manifold, Tap Water, Drain, or Not
   connected) and **To** (the same list). A pump also asks which way it pumps. A **Supply Manifold** (Rule 5.35) can be picked
   for a row of valves on one pipe. Each answer starts with the best guess (helper 3), so the brewer only checks it. Answers
   build the pipes and hoses between the IPs (Rule 5.29, 5.34); a missing answer leaves the item loose, never a wrong pipe.
2. **A picture as a guide.** The brewer can pick a picture: the **background picture they used on that BruControl Tab** (filled
   in automatically when there is one) or **a photo or drawing they upload**. It shows faded behind the Brewery Tab. The brewer
   drags each vessel, pump and valve onto its place in the picture and **clicks one IP and then another** to join them, the same
   joining the Panel uses for pipes (one source, Rule 15.4). The picture is only a guide: it is kept as the Tab background only if
   the brewer says so.
3. **Guesses from BruControl's screen.** Many BruControl brewers put their valve and pump buttons on top of a picture of their
   brewery. Each item keeps its BruControl place, and the Importer suggests a connection when a valve or pump sits next to a
   Vessel's IP, another valve or a drawn pipe picture (nearest within a short distance), plus the clues from names and Scripts
   (a Script that opens M_V1 and runs M_HLT Pump together suggests one path). Each suggestion is marked **guess** until the
   brewer OKs or changes it.
4. **Ask a free AI, outside the Importer (the brewer's choice).** Fritz, 2026-11-07: "Could we provide a Link in the imported to
   open a Free AI to analyse the Picture for the Manifold and Vessel layout". The Importer itself stays AI-free. A button
   **Ask an AI about my picture…** does two things: it **copies a ready-made question** to the clipboard and **opens the free AI
   site the brewer picks** (for example claude.ai, ChatGPT or Gemini) in their browser. The brewer adds their picture there and
   pastes the question. The question lists the brewer's own vessel, pump and valve names and asks the AI to answer **only** in a
   fixed form, one line per connection, for example `M_V5: From Mash Tun Center Bottom Outlet To M_Mash Pump In`. The brewer
   copies the AI's answer and clicks **Paste the AI answer**: the Importer reads the lines (plain text matching, no AI), fills
   in the manifold questions, and marks each one **from the AI, check it**. A line it can't read is listed, never guessed.
   - **Privacy:** a note says plainly that the picture goes to that AI company under the brewer's own account, not to Skynet,
     and that it is optional.
   - Nothing is sent by the Importer: the brewer does the uploading and pasting.
   - **Hot Side only** (Fritz, 2026-11-07: "That could give the Number of Vessels and a good guess on how they were connected,
     at least for the Hot Side. I think for Fermentors we ask questions as they are likely in a different Room."). The question
     asks the AI for the **number of hot side vessels** (HLT, Mash Tun, Boil Kettle and so on) as well as their connections;
     the vessel count fills in Dialog 1's answer as a guess too, so this button is offered early, before the Vessel questions.
- **Fermenters are asked, not pictured** (Fritz, 2026-11-07): they are usually in another room, so the picture, the AI and the
  screen guesses cover the Hot Side only. For each fermenter the Importer asks plain questions instead: how it is cooled and
  heated (glycol coil, jacket, chamber, wrap or none), which valves feed and return the glycol, which pumps (chiller, warm tank),
  and which probe and pressure sensor are its own. Each answer starts with a guess from names and Scripts (for example Tartan's
  "FV 2 // feed glycol", "FV 1 // return glycol").
- Order on the page: the picture (if any) on the left, the manifold questions on the right; answering a question draws the pipe
  on the picture side, and joining on the picture fills in the question. Either way works.
- Shown before saving with the rest; Back changes any answer.
- **The ends** (Fritz, 2026-11-07: "Tap water and Drain ends are good. And maybe a QD"): besides a Vessel IP, a pump, a valve and
  a Supply Manifold, an end can be **Tap Water** (the Tap Water Valve, Rule 5.33), **Drain**, or a **Quick Disconnect (QD)**
  (Rule 5.28). A QD asks two more things:
  - **Male or Female** (it mates with the other kind, on the hose or the manifold).
  - **Open or Shut-off** (Fritz: "The Quickdisconnect is always open but could also be the type that is closed (a type of Kent
    Fitting) when the other QD ... is NOT connected"). **Open** is the default: flow passes whether or not its mate is on.
    **Shut-off** passes flow only while its mate is connected, as Skynet's QD Widget already does (Rule 5.28).
    *For later:* the Open kind is new to the QD Widget, so Rule 5.28 gets that choice when this step is built.
- **Hose or Pipe is asked for each connection, as it is built** (Fritz, 2026-11-07: "Ask Hose or pip as it is being built. In my
  manifold, I use both hoses and Pipes"). Each From / To answer (or each join on the picture) asks **Hose** or **Pipe**; a Hose
  to a QD is a QD hose (Rules 5.28, 5.34). The guess is Pipe, unless one end is a QD (then Hose).

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
1. **Outlet questions: decided** (Fritz, 2026-11-07: "Drill Down is good"). One Outlet question (2.3): first the fitting,
   then where it is.
2. **Gas Burners: decided** (Fritz, 2026-11-07: "If there is BruControl Valve Yes"). The Gas Valve, Igniter, Smart control and
   Probe are each picked by BruControl name, like the Element.
3. **All In One: decided** (Fritz, 2026-11-07: "Yes"). The longer model list is in Dialog 1, and a model skips what it
   already answers. Talking to a connected model (MQTT, Get and Put) is a later idea (see the table above).
4. **Order: decided** (Fritz, 2026-11-06): these dialogs come **after Names**, "because in some follow ups we will associate
   heater, Probes and valves eventually to what Device control is the HLT Heat for example."


## One Heating Element, the heating method picked (built, Rule 6.19)

Fritz, 2026-11-07: "The way I want to handle this is ONE device, but a to select the heating method via process or on the Device
when clicked". **Built now** in the import (lib/bruimport.js) and the Panel:
- BruControl heating controls on the **same Interface and Port** (Duty Cycle, Hysteresis, PID, Deadband; a plain Digital Out on
  that port too) become **one Heating Element** (Digital Out, Kind = element). It starts in the first one's heating method; a
  Process or a click while running changes it (Help 150).
- Each BruControl name is kept on it (`.heatControls`, made safe: `HLT PID` -> `HLT_PID`) with its method, so when Processes are
  imported, `HLT_PID = true` switches the Element to PID and turns it ON, and `M_HLT_Heat = true` to Duty Cycle.
- Where a second one was placed on a Tab, a **Clone** of the Heating Element is put there.
- The import notes list each merge, for example *MP_42_DO_HLT_Heat_BH (Main Panel port 42: M_HLT Heat (Duty Cycle) or HLT PID (PID))*.
- The Vessel Build dialogs' **BruControl Element** dropdown (above) then shows that one Heating Element.
