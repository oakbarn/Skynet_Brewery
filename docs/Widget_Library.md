# Skynet Brewery: Widget Library

A reference list of every Widget in the Skynet Brew Panel and all its settings (attributes). Paste the part you need into any chat about this project.

- Read from the code on the default branch, Panel version PR107_Skynet-v.20261026_23_23 (2026-10-27).
- **Widget** = app-only. It is never tied to a port on a PLC. (A **Device** is tied to a PLC port; see the Device Library.)
- Every new Widget is created on the 🔨 Build Tab first, then sent to a Tab.
- **Rule:** when a new unique Widget (or Skynet Template) is added to Skynet, add it to this document.

---

## 1. Settings almost every Widget has

| Setting | What it does |
|---|---|
| Name | Unique name. Processes use it (for example `Text_1.visible = false`). Pipes, Hoses, IPs and Text get one from Skynet that can't be changed (Pipe_1, Hose_1, IP_1, Elbow_1, Text_1 ...). |
| Tab | Which Tab it sits on. Pipes only join IPs on the same Tab. |
| X, Y | Position in pixels from the left and from the top. |
| Width, Height | Size in pixels. |
| Lock position | No drag or resize. (Lock icon in Properties.) |

Properties open with a double-click. Delete, Cancel, Save are at the top and bottom of every Properties dialog.

---

## 2. Drawing Widgets

### IP widget (Initial Point)
Marks where flow starts or ends (a pump outlet, a vessel port, a drain). Pipes and Hoses start and end on IPs. The IP marker itself only shows in Edit layout.

| Setting | Choices / notes |
|---|---|
| Type | IP point, Pipe (straight), Pipe tee, 90° elbow, 45° elbow, Pipe cross, Manual valve, Coupling / hose end, Pipe cap (no IP: dead end) |
| Turn (degrees) | 0, 45, 90, 135, 180, 225, 270, 315 |
| Manual valve is open | Yes / No (Manual valve type only). A closed manual valve stops flow. |
| Port on vessel | Set by dropping the IP on a vessel; it then moves with the vessel. |
| Name / label | For example "Red pump out", "MLT in", "Drain" |
| Show label on screen | on / off |
| Label position | below, above, top, center, bottom, top-left, top-right, bottom-left, bottom-right |
| Label color, Label back color, Label size | |
| Background picture path | Empty = the drawn shape |
| Text on marker | |
| Color | Default orange for a point, grey for a fitting |
| Hide its label and picture too when not editing | on / off |
| Tab, X, Y, Width, Height, Lock position | see section 1 |

Name prefixes Skynet gives: IP, Straight, Tee, Elbow, Elbow45, Cross, ManualValve, Coupling, Cap.
A Manual valve Widget can be picked as the valve in a Bundled Fitting.

### Pipe and Hose
Drawn between IPs. When a pump or powered valve on it is on, flow runs from the source, through the pump, into the Pipe or Hose.

| Setting | Choices / notes |
|---|---|
| Label | |
| Starts at IP | Flow comes from here |
| Ends at IP | Flow goes to here |
| Size units | Inch (SAE) or Metric (mm) |
| Pipe size / Hose size | List of standard sizes, or Custom |
| Custom size | Shows when Size = custom |
| Only when ALL of these are on | Optional extra conditions (pumps and valves on the pipe already count) |
| Reverse flow direction | on / off |
| Pipe color / Hose color | Default pipe #8a8f96, hose #c9ced3 |
| Flow color | Default #4fb3ff |
| Show when nothing flows | Off = only the moving flow shows (the Tab picture already shows the pipe) |
| Tab, Lock position | |

Two pipe sizes meeting on one IP get a reducer cone drawn by themselves.

### Graphic (picture) — "Add graphic"
| Setting | Notes |
|---|---|
| Image path | A picture in the media folders |
| Tab, X, Y, Width, Height, Lock position | |

### Text — "Add text"
| Setting | Notes |
|---|---|
| Text | Codes like \b bold, \L large, \n new line work here |
| Visible | on / off (a Process: `Text_1.visible = false`) |
| Hidden, locked | On = stays hidden even when Visible is on |
| Font size, Font, Bold | |
| Fore color, Back color | |
| Alignment | Default, Left / Centered / Right justified ... |
| Word wrap as needed | Off = one line, cut off at the edge |
| Tab, X, Y, Width, Height, Lock position | Starts at the Default tab's size and place |

---

## 3. Equipment Widgets ("Add equipment")

All of these are a picture with a Name, a Type, a Display Name and ports. Every port except a thermowell or heating element spot is an IP that stays attached to the Widget.

**Settings every Equipment Widget has**

| Setting | Notes |
|---|---|
| Name | |
| Type | From the kind's Type list (below) |
| Display Name | The only text on it (empty = the Type) |
| Graphic | Picture path |
| For each port: installed | on / off. When on: Position (list below) and Connection Standard (TC 1.5, NPT 1/2 FPT, BSP 1/2, MM, TC 2, NPT 3/4 FPT, NPT 1/2 MPT) |
| Show the Display Name, position, color, back color, size | Size empty = the Name font size on the Default tab |
| Tab, X, Y, Width, Height, Lock position | |
| Bundled with its IPs | Moves as one unit; no editing until switched off |

### Vessel (kettle, HLT, MLT ...)
- Picture: Images/Skynet/Vessels/vessel_gray.svg, 220 x 270. A plain grey tank with no text on it.
- Types: HLT, Brew Kettle, Mash Tun, RIMS, HERMS, Fermenter, Other (older: MLT, Whirlpool).
- Heat sources per Type: HLT / Brew Kettle / RIMS / HERMS = gas, electric, other. Mash Tun = gas, electric, RIMS, HERMS, other, unheated. Fermenter = none. Other = gas, electric, RIMS, other, unheated.

| Port | IP? | Positions |
|---|---|---|
| Outlet (on by default) | yes | Center Bottom, Bottom Drain, Front Low, Front Bottom Center, Center Bottom 1 in, Fat Center Bottom 1 in |
| Second Outlet | yes | Front Middle, Front Low, Bottom Drain |
| Tangential | yes | Bottom Left, Bottom Right, Center, Back, Left 4 in, Fat Left 4 in |
| Thermowell | no | Center Low, Left Low, Right Low, Back Low, Front Center, Center 5 in, Fat Center 10 in |
| Steam Slayer | yes | Center High, Left High, Right High, Back High |
| Sparge | yes | Center High, Left High, Right High, Back High, Fat Left 11 in |
| CIP | yes | Lid, Center High, Left High, Right High, Back High |
| Heating element | no (a mark) | Right Low, Left Low, Center Low, Back Low, Right Side, Right 6 in, Fat Right 6 in |

"... in" positions = the port center's height above the bottom on the Skynet Brew Vessel Widgets. "Fat ..." = Brew_Vessel_Big_Mac_Widget, which has its own picture box.

### Plate chiller
- Picture: Images/Skynet/Chillers/plate_chiller.svg, 110 x 200. Types: Brazed plate 20, 30, 40, Counterflow.
- Ports: Wort In (Top Left), Wort Out (Bottom Right), Water In (Bottom Left), Water Out (Top Right); any corner. Wort and water never mix. Thermowell (not an IP): Wort Out or Water Out.

### Chilling coil
- Picture: Images/Skynet/Chillers/chill_coil.svg, 180 x 180. Types: Immersion coil, Jacketed (glycol).
- Ports: In, Out (circuit A); In 2, Out 2 (circuit B, for a 4-port coil like the Chillzilla; never mixes with A). Positions: corners and sides.

### HERMS coil
- Picture: Images/Skynet/Other_Equipment/herms_coil.svg, 180 x 180. Types: Stainless 25 ft, Stainless 50 ft, Copper.
- Ports: Wort In, Wort Out (circuit A); In 2, Out 2 (circuit B).

### Trub filter
- Picture: Images/Skynet/Other_Equipment/trub_filter.svg, 100 x 170. Types: Inline filter, Hop rocket, Hop spider.
- Ports: Inlet (Top), Outlet (Bottom); any side or corner.

### RIMS tube
- Picture: Images/Skynet/Other_Equipment/Equipment_RIMS.svg, 200 x 100. Type: RIMS.
- Ports: Wort In (Top Left), Wort Out (Bottom Right), Thermowell (probe, not an IP; Left End / Right End), Heating element (not an IP; Right End, Left End, Element Housing).
- The Skynet RIMS_Tube Template is a Skynet_Integrated_Device (its Devices are built in): see the Device Library.

### Pipe tee, Pipe 90° elbow, Pipe 45° elbow, Pipe cross
- Pictures in Images/Skynet/Other_Equipment (pipe_tee, pipe_elbow90, pipe_elbow45, pipe_cross), 90 x 90.
- Types: Equal / Reducing (tee, cross); Short radius / Long radius (elbows).
- Ports: Tee = Run A, Run B, Branch. Elbows = End A, End B. Cross = End A, B, C, D. Flow passes between all of them.

### Older vessel kinds (kept for old Schemas)
Electric heated vessel, Gas heated vessel, Unheated mash tun, Cooling coil, Plate chiller (older). Settings: Kind, Background picture path, Label, Show label, Label position / color / back color / size, Heater (an element or burner output; the vessel glows when it is on), Tab, X, Y, Width, Height, Lock position.

---

## 4. Widgets made from Templates (on a Tab)

### Tab_Vessel (from a User Vessel Template)
Same settings as the Equipment Widget above, plus a note naming the Template it came from. Changing it does not change the Template.

### Skynet vessel (from a Skynet Vessel Template)
One unit: its openings have their IPs built in, nothing to set for them.

| Setting | Notes |
|---|---|
| Name, Type, Display Name | |
| Graphic | Starts as the Skynet picture; editable. The IPs stay on the picture's openings. |
| Heating Element | Select Device or None (shows when it is electric; glows while on) |
| Temperature Probe | Select Temperature Probe or None (shows when it has a thermowell) |
| Flip Horizontal, Flip Vertical, Rotate | Rotate in 45° steps; picture, IPs and fittings follow |
| Bundled | For now a Skynet item can be un-bundled to work on it; once the Skynet Templates are locked it can't |
| Display Name look, Tab, X, Y, Width, Height, Lock position | |

A Skynet_Integrated_Device vessel (RIMS tube, Basic electric kettle) shows its Interface, ports and heater control here instead of the Graphic / Heating Element / Probe pickers, and can never be un-bundled.

### Tab_Fitting (from a Bundled Fitting Template)
| Setting | Notes |
|---|---|
| Name, Label (empty = the Name), Graphic | |
| Turn | Not turned, 90°, 180°, 270° clockwise |
| Connection Standard + Size | See section 5 |
| First to Fourth Fitting | From the vessel port outward (fitting kinds in section 5) |
| Valve | For a Valve: Select Device, manual valve Widget or None |
| Flow Meter | For a Flow Meter: Select Flow meter Device or None |
| Temperature | For a Flow Meter with Temperature, or a tee with a thermowell: Select Temperature Probe or None |
| Other end size | For a Reducer |
| Thermowell in this tee | That side then has no IP. Position of Thermowell: Short or Long |
| IP positions | Where each IP sits on the picture |
| Joined to its vessel port | Off = it gets a Start IP of its own |
| Label look, Tab, X, Y, Width, Height, Lock position, Bundled | |

### Skynet Fitting (from a Skynet Bundled Fitting Template) = Skynet_Integrated_Widget in practice
One unit: every opening has a two-way IP built in, nothing to set for the IPs. (The Templates are not yet tagged "Integrated Widget" in the code; that comes when Skynet Templates are locked.)

| Setting | Notes |
|---|---|
| Name, Label, Connection Standard | |
| Valve / Flow meter / Probe pickers | Only the ones its fittings use |
| Flip Horizontal, Flip Vertical, Rotate | Rotate in 45° steps |
| Bundled | Same rule as the Skynet vessel |
| Label look, Tab, X, Y, Width, Height, Lock position | When it sits on a vessel port it moves with the vessel instead |

**End Cap:** drag it onto an opening (an IP with no pipe) to close it; drag it off to open it again. It has no IP of its own.

---

## 5. Template attributes

Templates live in a library, not on a Tab. **Skynet Templates** ship in templates/ (read only once locked, never deleted, clone only). **User Templates** live in config/templates (Admins make, change and delete them). Template Names: letters, digits, _ and - only, no spaces, 60 max, unique. A Template sent to a Tab is named bndl1_Name_TabId, bndl2_ ... Clones are Copy1_Name, Copy2_Name ...

### Vessel Template
| Attribute | Notes |
|---|---|
| Template Name | |
| Kind | Vessel, Plate chiller, Chilling coil, HERMS coil, Trub filter, RIMS tube |
| Liquid ports | 2 or 4 (chilling coil, HERMS coil) |
| Type, Other Type | |
| Graphic | Picture path |
| Units | US (gallons, pounds, °F) or Metric (liters, kilograms, °C) |
| Size, Dead space, Extra trub loss | Fermenter instead: Largest batch, Smallest batch, Trub loss |
| Heat Source, Other heat source | Gas, Electric, RIMS, HERMS, Other, Unheated (by Type). The heating Device and probe are picked on the Tab. |
| Connection Standard + Size | Default for every port and Bundled Fitting |
| Ports | Installed, Position, Bundled Fitting on that port (Outlet, Second Outlet, Tangential Inlet, Steam Slayer, CIP Inlet take one), own Connection Standard |
| Picture size | Width x height on a Tab |
| Integrated | Skynet_Integrated_Device or Skynet_Integrated_Widget |
| Base | The Skynet Vessel Widget a User Bundled vessel Template is built on |
| Notes | |

### Bundled Fitting Template
| Attribute | Notes |
|---|---|
| Template Name | |
| Connection Standard + Size | Empty = the vessel's |
| First to Fourth Fitting | None, Valve, Tee, 90 Degree Elbow, 45 Degree Elbow, U, CIP Ball Valve, Reducer, End Cap, Check Valve, Flow Meter, Flow Meter with Temperature |
| Tee: Thermowell + Position | Short or Long |
| Reducer: Other end size | |
| Graphic | A Skynet picture (Skynet) or any picture path (User) |
| IP positions, Picture size | |
| Notes | |

IPs of a Bundled Fitting: the far End (none if an End Cap closes it) plus the open side of every tee without a thermowell.

**Connection Standards:** TC (Tri-Clamp), FPT (NPT female), MPT (NPT male), BSP Female Rp, BSP Female Rc, BSP Male Rp, BSP Male Rc, MM Female, MM Male, DIN. Sizes are numbers (DIN is text, e.g. DN25).

---

## 6. Skynet Templates shipped today

### Skynet Vessel Widgets (picture with IPs built in, no Devices)
All TC 1.5 unless noted; 217 x 235 except Big Mac.

| Name | Ports |
|---|---|
| Generic_Brew_Vessel_Widget | none (no holes) |
| Brew_Vessel_Low_TC_Output_Widget | Outlet Center Bottom 1 in |
| Brew_Vessel_Low_NPT_Output_Widget | Outlet Center Bottom 1 in, NPT 1/2 FPT |
| Brew_Vessel_TC_Temperature_Widget | Outlet CB 1 in, Thermowell Center 5 in |
| Brew_Vessel_NPT_Temperature_Widget | Same, both NPT 1/2 FPT |
| Brew_Vessel_TC_Temperature_Tangential_Widget | + Tangential Left 4 in (faces forward) |
| Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget | + Heating element port Right 6 in (TC 2, a mark, no IP) |
| Brew_Vessel_Big_Mac_Widget ("the fat one", 291 x 291) | Outlet Fat CB 1 in, Thermowell Fat Center 10 in, Tangential Fat Left 4 in, Sparge Fat Left 11 in (TC 2), Element Fat Right 6 in (TC 2) |

### Other Skynet Vessel Templates
| Name | Kind / Type | Ports (+ Bundled Fitting) |
|---|---|---|
| Brew_Kettle | Vessel, Brew Kettle, electric, 15 gal | Outlet CB + Valve_90, Thermowell, Tangential, Element |
| HLT | Vessel, HLT, electric, 15 gal | Outlet + Valve_90, Thermowell, Tangential, Sparge, Element |
| Mash_Tun | Vessel, Mash Tun, unheated, 15 gal | Outlet + Valve_90, Thermowell, Sparge |
| Fermenter | Vessel, Fermenter, 3-7 gal | Outlet + Valve_Only, Thermowell, CIP + CIP_Ball_Valve |
| Kettle_Basic / _Electric | Brew Kettle | Outlet Front Low + Valve_90, Thermowell, Tangential (+ Element) |
| Kettle_Tall / _Electric | Brew Kettle | Same as Basic |
| Kettle_Big_Fatty / _Electric | Brew Kettle | Outlet Front Low + Valve_90, Tangential, Thermowell Back Low (+ Element) |
| Kettle_Bottom_Drain / _Electric | Brew Kettle | Outlet CB + Valve_90, Thermowell (+ Element) |
| Kettle_Bottom_Drain_2 / _Electric | Brew Kettle | + Tangential |
| Kettle_Tangential_Steam_Slayer / _Electric | Brew Kettle | + Tangential, Steam Slayer Right High (+ Element) |
| Kettle_Brewzilla_Electric | All-in-one, electric | Outlet CB + Valve_90 (no thermowell) |
| Kettle_DigiBoil_Electric | All-in-one, electric | Outlet CB + Valve_90 (no thermowell) |
| Kettle_Foundry_Electric | All-in-one, electric | Outlet Front Low + Valve_90 |
| Kettle_Grainfather_Electric | All-in-one, electric | Outlet CB + Valve_90 |
| Integrated_Electric_Kettle_Basic | Skynet_Integrated_Device | Outlet, Thermowell + probe and Element built in |
| RIMS_Tube | Skynet_Integrated_Device | Wort In, Wort Out, Thermowell + probe and Element built in |
| Plate_Chiller | Plate chiller, Brazed plate 30, MPT 1/2 | 4 ports |
| Counterflow_Chiller / _Small | Plate chiller, Counterflow, MPT 1/2 | 4 ports |
| Immersion_Chiller | Chilling coil, 2 ports, MPT 1/2 | In, Out |
| Chillzilla | Chilling coil, 4 ports, MPT 1/2 | In, Out, In 2, Out 2 |
| HERMS_Coil | HERMS coil, Stainless 50 ft | Wort In, Wort Out |
| Trub_Filter | Trub filter, Inline filter | Inlet, Outlet |
| Hop_Filter_Inline | Trub filter, Hop rocket, MPT 1/2 | Inlet Top, Outlet Bottom Right |

"_Electric" versions: pick the Heating Element Device and Temperature Probe on the Tab.

### Skynet Bundled Fitting Templates (TC 1.5 unless noted)
| Name | Fittings | Openings |
|---|---|---|
| Elbow_90 | 90° elbow | Bottom, Right |
| Elbow_45 | 45° elbow | Left, Top Right |
| Tee | Tee | Left, Right, Top |
| Instrument_Tee (90 x 50) | Tee with short narrow branch | Left, Right, Top |
| U_Bend | U | both at the bottom |
| Reducer (TC 2) | Reducer to 1.5 | Left (big), Right (small) |
| End_Cap | End Cap | none: closes an opening |
| Check_Valve | Check valve (one way, Left to Right) | Left, Right |
| Butterfly_Valve_1in | Reducer, 1 in valve, Reducer | Left, Right |
| CIP_Ball_Valve | CIP spray ball with valve | |
| Flow_Meter | Flow meter (either way) | Left, Right; pick Flow meter Device |
| Flow_Meter_Temp | Flow meter with temperature | Left, Right; pick Flow meter Device + Probe |
| Valve_Only | Valve | |
| Valve_90 | Valve, 90° elbow | |
| Valve_Tee_Thermowell_90 | Valve, tee with short thermowell, 90° elbow | |

---

## 7. App-only items in "Add element > Widgets"

These are added from the same list as Devices but need no board pin.

**Settings they all share:** Name, Display name, Tab, X, Y, Width, Height, Lock position, Background picture (1-3), imagePath_1-3 (a Process changes it: `name.image = "path"`), Visible, Hidden locked, Hide name, Hide value / text, Look (normal, led, lcd, dark, button, indicator), Digits shown, Value font size, When tapped (default, none, toggle, push button, dialog, process, tab), Tap target, Ask before changing, and Text box look (Fore / Back color, Alignment, Word wrap, Name font + size + color + background, Value color + background, Name / Value alignment, Border).

| Widget | Its own settings |
|---|---|
| Picture | Follow element (on / off image follows it; empty = static), Image when on, Image when off, Text on picture |
| Shared variable (older) | Data type (value, string, bool, time, datetime), Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Read only on screen, Keep value on restart |
| Switch (on screen only) | Image when on / off, Text when on / off |
| Timer | Type (count up, count down), Reset value, Start value (hh:mm:ss), Running when the server starts |
| Alarm | Sound file, Sound files 1-3, Sound file number, Sound (custom, default, none), Repeat sound, Text when sounding, Image when sounding / quiet |
| Sound Player | Sound file, Repeat sound. Lowest priority (5): pauses while any alarm sounds. Process: play / stop SoundPlayer |
| Label | Text box only (no own settings) |
| Manual vessel (BrewZilla, DigiBoil by hand) | Temperature units, Volume units, Set point decimals, Set point at start, Has no pump, Picture when heating / not heating. Processes set setpoint, heat, pump, timer, message, waiting; the brewer confirms or types a reading |

### vKonstant variables (Processes and screen; never API or database)
Settings: Kind, then by kind: Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Text when on / off, Read only on screen, Keep value on restart.

| Kind | Prefix (hint) | Extra |
|---|---|---|
| Graphic (image file path) | vK_ | Image path |
| String | vKS_ | |
| Long String (text file) | vKL_ | Text file path |
| Value | vKV_ | |
| Time | vKT_ | |
| Date Time | vKDT_ | |
| Boolean | vKB_ | |
| Switch (tap ON, tap again OFF) | vKSW_ | |
| Push Button (ON while held) | vKPB_ | |
| Pulse Button (one 100 ms pulse per tap) | vKMB_ | On time in ms |
| List (dropdown: Value + Text) | vKList_ | Choices (two columns: Value, Text), Starting choice |
| Step (shows the Process step reached) | vKStep_ | Shows the steps of: Flow, Sub, Repeat, Looper, Any Process |

### vAPI variables (Processes + API + database, with database triggers)
Kinds: String (vAS_), Value (vAV_), Time (vAT_), Date Time (vADT_), Boolean (vAB_). Settings: Kind, Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Read only on screen, Keep value on restart. Database trigger is set on the Variables page.

---

## Change log
- 2026-10-27: First version.
