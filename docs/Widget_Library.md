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
| Name | Unique name. Processes use it (for example `w_Text_1.visible = false`). Pipes, Hoses and IPs get one from Skynet that can't be changed (Pipe_1, Hose_1, IP_1, Elbow_1 ...). A Text Widget starts as w_Text_1 and can be renamed. |
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
The table above is now for an **IP point** only. Pipe fittings and the Manual Valve have their own settings (below, 2026-10-28).

### Pipe fitting Widgets (tee, 90° and 45° elbow, cross, straight piece, coupling, cap; and the Skynet Tee, Instrument_Tee, Elbow_90, Elbow_45, U_Bend, Reducer, End_Cap, Check_Valve)
A tee is only a tee: no Type, label or Connection Standard (Rule 5.14, Help 87). No Clone.

| Setting | Notes |
|---|---|
| Name | Given by Skynet (Tee_1, bndl1_Tee_BR ...), shown, can't be typed |
| Autosize to pipe (`autoSize`) | On by default: it takes the size of the pipes joined to its IPs (IP fittings: 5 x the pipe; Skynet fittings: body as thick as the biggest pipe, Template shape kept, only once a pipe is joined). Width and Height are greyed out while on. Not on an End Cap. |
| X, Y | Not shown while it sits on a vessel port or an opening |
| Width, Height | Only when Autosize to pipe is off |
| Lock position | |

Turning and flipping: the turn buttons on the Edit layout bar. A check valve is one way; its orientation (arrow) shows the way. Valves and flow meters in a fitting are Devices; a tee with a thermowell (or a thermowell on a vessel IP) is a kind of Temperature Probe (Fritz, 2026-10-28).

### Manual Valve Widget (`kind: ip`, `fitting: manualValve`)
A pipe fitting turned by hand and a pseudo Device (Rule 5.15, Help 87). Name ManualValve_1, ManualValve_2 ...

| Setting | Notes |
|---|---|
| .state | true = open, false = closed. Only a click on it on its Tab changes it (Operators and Admins), at any time. Kept in the layout (`open`). A closed one stops flow. |
| Label, Show label | The Label is used in the "by hand" message |
| Autosize to pipe, X, Y, Width, Height, Lock position | As a pipe fitting |
| Open overlay | Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg, drawn on top while open (fixed) |

In a Process: `ManualValve_1.state = true` (or `ManualValve_1 = true`) does not change it. It shows "✋ OPEN ... by hand, then click it on the ... Tab to confirm" at the top of every screen, the valve blinks, and the Process waits until it is clicked to that state. Reading it (`if ManualValve_1 == true`) works as for any Device.

**Snap to align** (2026-10-28, Help 86): in Edit layout, anything with IPs that is dragged so one of its IPs comes within 10 px of another IP on the Tab jumps so the two sit exactly on each other (hold Alt to place it without the jump). On Skynet valve pictures (motorized ball, manual ball, butterfly, gas solenoid) the two IPs sit on the picture's pipe ends, not the middle of the box's sides.

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

### Text Widget — "+ Text" (Text Widget Properties, 2026-10-29, Help 91)
The pattern for Properties dialogs: Delete, **COPY**, Cancel, Save at the top; framed Label and Properties boxes; an orange **?** that opens a pop-up with the Widget's Properties and Attributes (Close top and bottom).

| Setting | Notes |
|---|---|
| Name | Starts as `w_Text_N` (older `Text_N` become `w_Text_N`, Rule 15.2); locked once saved, ✏ Change name (Rule 3.11) |
| Text | Its value; Rich Text Embedded Codes work |
| Label box | Label (empty = Name), Visible (Show label; on for a new one), Font size, Font, Bold, Fore color, Back color, Alignment |
| Properties box | Visible, Hidden Locked, Font size, Font, Bold, Fore color, Back color, Alignment, Tab, X Horizontal, Y Vertical, Width, Height, Lock position |
| COPY | Saves, then makes a copy (next `w_Text_N`) on the Build Tab |
| Word wrap | Always on (no switch) |

Process attributes: `.text` (`.value` = `.text`), `.label`, `.label_visible`, `.font_label`, `.size_label`, `.fore_label`, `.back_label`, `.bold_label`, `.alignment_label`, `.font`, `.size`, `.fore`, `.back`, `.bold`, `.alignment`, `.visible`, `.hiddenlock`, `.x` (`.xh`, `.x_hPosition`), `.y` (`.yv`, `.y_vPosition`), `.width`, `.height`, `.lock` (read only), `.tab`.

---|---|
| Text | Codes like \b bold, \L large, \n new line work here |
| Visible | on / off (a Process: `Text_1.visible = false`) |
| Hidden, locked | On = stays hidden even when Visible is on |
| Font size, Font, Bold | |
| Fore color, Back color | |
| Alignment | Default, Left / Centered / Right justified ... |
| Word wrap as needed | Off = one line, cut off at the edge |
| Tab, X, Y, Width, Height, Lock position | Starts at the Default tab's size and place |

---

### Timer Widget (Timer Widget Properties, 2026-10-29, Help 92)
Same pattern as the Text Widget (COPY, orange ?, boxes). **No pictures and no background.**

| Setting | Notes |
|---|---|
| Timer box | Type (Count up / Count down), Reset value, Start value, Running when the Brain starts |
| Label box | The black title bar: Label, Visible (Show label), Font size, Font, Fore / Back color, Alignment |
| Properties box | Visible, Hidden Locked, **Style**, Tab, X Horizontal, Y Vertical, Width, Height, Lock position |
| Style | Skynet Styles 🔒 (never changed by a user): Skynet Orange Timer (seven-segment 00:00:00 on an orange-red panel, grey bezel; the default), Skynet Green LCD, Skynet Blue Timer, Skynet Red LED digits, Skynet Plain text. ➕ Add new User Style… / ✏ Edit for User Styles (Look, Digits, Panel, Bezel, Title bar colors) |

### Override button Widget (`kind: override`, 2026-10-30, Help 94)
One press: every running Process (not Loopers) moves on 100 ms later. A wait or sleep it is held in is passed, and the loop it sits in (the next goto back up) is left; the next wait runs as normal. Manual valves still wait. **Only one on a Tab**; it can be on several Tabs (COPY, Save Build ...), each with its own Label and look. No name, no background picture, no Process attributes. Operator or Admin to press.

| Setting | Notes |
|---|---|
| Label box | Label (empty = Override), Font size, Font, Bold, Fore color, Back color, Alignment. Starting look (for now): bold white Override on red #c0392b, 20 px, centered, 160 x 60 |
| Properties box | Tab, X Horizontal, Y Vertical, Width, Height, Lock position |

### Image block (every dialog with background pictures, 2026-10-29, Help 93)
Background # (1, 2, 3; other = blank), Back Colour, Image Path 1-3 each with OPEN (Background Image N pop-up) and a typeable path (not found = blank + warning).

---

## 3. Equipment Widgets ("Add equipment")

All of these are a picture with a Name, a Type, a Label and ports. Every port except a thermowell or heating element spot is an IP that stays attached to the Widget.

**Settings every Equipment Widget has**

| Setting | Notes |
|---|---|
| Name | |
| Type | From the kind's Type list (below) |
| Label | The only text on it (empty = the Type) |
| Graphic | Picture path |
| For each port: installed | on / off. When on: Position (list below) and Connection Standard (TC 1.5, NPT 1/2 FPT, BSP 1/2, MM, TC 2, NPT 3/4 FPT, NPT 1/2 MPT) |
| Show label, Label position, color, back color, size | Size empty = the Name font size on the Default tab |
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
| Name, Type, Label | |
| Graphic | Starts as the Skynet picture; editable. The IPs stay on the picture's openings. |
| Heating Element | Select Device or None (shows when it is electric; glows while on) |
| Temperature Probe | Select Temperature Probe or None (shows when it has a thermowell) |
| Flip Horizontal, Flip Vertical, Rotate | Rotate in 45° steps; picture, IPs and fittings follow |
| Bundled | For now a Skynet item can be un-bundled to work on it; once the Skynet Templates are locked it can't |
| Show label and Label look, Tab, X, Y, Width, Height, Lock position | |

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
| (pipe fittings) | A Skynet Fitting that is only a tee, elbow, U, reducer, check valve or End Cap has just Name, Autosize to pipe, X, Y, Width, Height and Lock position (see Pipe fitting Widgets) |
| Flip Horizontal, Flip Vertical, Rotate | Rotate in 45° steps |
| Bundled | Same rule as the Skynet vessel |
| Label look, Tab, X, Y, Width, Height, Lock position | When it sits on a vessel port it moves with the vessel instead |

**End Cap:** drag it onto an opening (an IP with no pipe) to close it; drag it off to open it again. It has no IP of its own.

---

### Skynet Device Templates (Rule 5.16)
A Device made from a Skynet Device Template is its **User version**: it inherits everything and shows only the Template's user
settable attributes. First one: the Skynet Motorized Ball Valve Device, Master H with Daughters VL and VR (see the Device Library,
4.3a). ☰ Menu > Build Template (Rule 5.18, Help 89) lists every attribute with its Template value and a "user can set" box.

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

**Settings they all share:** Name, Label (`label`; it was Display name), Show label, Tab, X, Y, Width, Height, Lock position, Background picture (1-3), imagePath_1-3 (all three editable and settable by a Process, as in BruControl; `name.image = "path"` gives unlimited pictures), Visible, Hidden locked, Hide value / text, Look (normal, led, lcd, dark, button, indicator), Digits shown, Value font size, When tapped (default, none, toggle, push button, dialog, process, tab), Tap target, Ask before changing, and Text box look (Fore / Back color, Alignment, Word wrap, Name font + size + color + background, Value color + background, Name / Value alignment, Border).

| Widget | Its own settings |
|---|---|
| Picture Widget | Turns on with (`follow`: an on/off Device or Widget, or a heater that is on while Enabled; None = a still picture and the On pictures are greyed out), Picture when off, On overlay (preferred), Picture when on (a second picture, optional), Text on picture |
| Shared variable (older) | Data type (value, string, bool, time, datetime), Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Read only on screen, Keep value on restart |
| Switch (on screen only) | Picture when on / off, Text when on / off |
| Timer | Type (count up, count down), Reset value, Start value (hh:mm:ss), Running when the server starts |
| Alarm | Sound file, Sound files 1-3, Sound file number, Sound (custom, default, none), Repeat sound, Text when sounding, Picture when sounding / quiet |
| Sound Player | Sound file, Repeat sound. Lowest priority (5): pauses while any alarm sounds. Process: play / stop SoundPlayer |
| Label | Text box only (no own settings) |
| Manual vessel (BrewZilla, DigiBoil by hand) | Temperature units, Volume units, Set point decimals, Set point at start, Has no pump, Picture when heating / not heating. Processes set setpoint, heat, pump, timer, message, waiting; the brewer confirms or types a reading |

### gKonstant variables (Processes and screen; never API or database)
Settings: Kind, then by kind: Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Text when on / off, Read only on screen, Keep value on restart.

| Kind | Prefix (hint) | Extra |
|---|---|---|
| Graphic (image file path) | gK_ | Image path |
| String | gKS_ | |
| Long String (text file) | gKL_ | Text file path |
| Value | gKV_ | |
| Time | gKT_ | |
| Date Time | gKDT_ | |
| Boolean | gKB_ | |
| Switch (tap ON, tap again OFF) | gKSW_ | |
| Push Button (ON while held) | gKPB_ | |
| Pulse Button (one 100 ms pulse per tap) | gKMB_ | On time in ms |
| List (dropdown: Value + Text) | gKList_ | Choices (two columns: Value, Text), Starting choice |
| Step (shows the Process step reached) | gKStep_ | Shows the steps of: Flow, Sub, Repeat, Looper, Any Process |

### gAPI variables (Processes + API + database, with database triggers)
Kinds: String (gAS_), Value (gAV_), Time (gAT_), Date Time (gADT_), Boolean (gAB_). Settings: Kind, Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Read only on screen, Keep value on restart. Database trigger is set on the Variables page.

---

## Change log
- 2026-10-27: First version.
- 2026-10-27: Display Name became Label (`label`) with a Show label switch; Picture became the Picture Widget with Turns on with; imagePath_2 / _3 editable again; On overlay preferred (thread "Apply clean-up requests and standards").
- 2026-10-28: IP Snap to align (10 px) and IPs on the pipe ends of Skynet valve pictures (thread "Lock Skynet Widget Templates and IPs", Help 86).
- 2026-10-28: Pipe fitting Widgets (only X, Y, Width, Height and Autosize to pipe; no Clone) and the Manual Valve Widget (click-only .state, Process asks by hand, open overlay) (thread "Simplify pipe fittings and Manual Valves", Help 87).
- 2026-10-28: Skynet Device Templates and User versions (Rules 5.16-5.18), first one the Skynet Motorized Ball Valve Device (Help 88).
- 2026-10-29: Text Widget Properties: new dialog pattern (boxes, COPY, orange ? info pop-up), w_Text_N names, Label line, word wrap always on, new Process attributes (thread "Redesign the Text Widget dialog", Help 91).
- 2026-10-29: Timer Widget Properties with Styles (Skynet Styles locked, User Styles), no pictures; the Image block for dialogs with pictures (Help 92, 93).
- 2026-10-30: Override button Widget (one per Tab, per-Tab Label and look; passes a wait, sleep or loop 100 ms after the press) (thread "Add an Override button", Help 94).
