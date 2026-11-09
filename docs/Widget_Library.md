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
| Database and .API | Every Widget with a value (not pictures, Labels, manual vessels or the Manual Valve Widget). **Send to the database**: Off, On demand, On value change, When a Process starts, Once, At a date and time, At clock time, Every N ms / seconds / minutes / hours / days, Every 00:00:00; **What to send** (main value or another attribute). **.API**: Off, Get only, Get and Put (Skynet Rule 6.14, Help 98). Always user settable. |
| .confirmation | A switch (2026-11-08, Rule 1.28, Help 162). Ticked: a **Confirmation Widget**, for something done **by hand** (no Interface controls it): commanding it On shows a pop-up asking the person to do it and confirm; it shows On only once confirmed, and a Process waits. On for Manual Valves, Manual Pumps and moving a QD Hose; off for everything else unless ticked. |

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
| Flow Color (`.flow_Color`) | IP point only. None to start. Flow that begins at this IP takes this color, first of all (Rule 5.21, Help 116) |
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
| .confirmation | On (2026-11-08, Rules 1.28 and 5.15): a Confirmation Widget. A click asks "OPEN (CLOSE) it by hand, then press Done" and it changes only on Done. Off: a click changes it at once. |
| Label, Show label | The Label is used in the "by hand" message |
| Autosize to pipe, X, Y, Width, Height, Lock position | As a pipe fitting |
| Open overlay | Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg, drawn on top while open (fixed) |
| Picture (`image`) | Plain (the drawn valve), or OakBarn Brewery's Manual Ball Valve drawings (2026-11-02, Help 110): side view, front view, on a front elbow (Images/Skynet/Valves/Manual_Ball_Valve_*_Closed.svg; the Tab shows the _Open twin while open), or the **Tap Water Valve** (below). |
| IPs (Rule 5.24, Help 123) | **Two**, one at each pipe end (`eq:<id>:in`, `eq:<id>:out`): plain valve left and right ends; side view the outer face of each ferrule; front view both at the center of the opening; front elbow the center of the opening and the bottom ferrule face; a user's picture the middle of its left and right sides. They turn with Rotate 45; a closed valve blocks both. (Before 2026-11-04 it had one IP in its middle.) |

In a Process: `ManualValve_1.state = true` (or `ManualValve_1 = true`) does not change it at once. With .confirmation on (2026-11-08) it shows the pop-up "OPEN ... by hand" with **Done** on every screen and the Process waits; Done opens it. With .confirmation off it shows "✋ OPEN ... by hand, then click it on the ... Tab to confirm" at the top of every screen, the valve blinks, and the Process waits until it is clicked to that state. Reading it (`if ManualValve_1 == true`) works as for any Device.

#### Tap Water Valve (a Manual Valve Widget, Rule 5.33, Help 141)
A brass household hose bib with a green cross handle (Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg). Added as **Tap Water Valve** from Select Device Type > Valves or Select Widget Type > Semi_Widgets_Devices, or by picking its Picture on a Manual Valve. Name ManualValve_n, Label starts as **tap_water_n**.

| Setting | Notes |
|---|---|
| IP | **One**, the center of the hose thread's outer face (`eq:<id>:out`). The wall side has no IP. It does not cut a pipe. |
| .state | As every Manual Valve: only a click changes it; a Process asks by hand. |
| Flow | Open: a tap water source, flow pushes out of the hose outlet with no pump, tap water Blue (Rule 5.21). Closed: blocks the hose on it. |

### Manual Pump Widget (`manualPump`, 2026-11-08, Rules 1.28 and 5.15a, Help 162)
A pump plugged into a wall outlet and switched **by hand**: no Interface or Port turns it. Added from Select Device Type > Pumps or Select Widget Type > Semi_Widgets_Devices; step 2 picks the pump from the same list as Add Pump (March 809 / 815, Chugger, Blichmann Riptide, Topsflo TD5, KegLand MKII) or the Sump pump. Name `wgt_MP_Label_TabID` (Label starts Pump 1, Pump 2 ...). 150 x 150.

| Setting | Notes |
|---|---|
| .state | true = ON, false = OFF (its value: `wgt_MP_Pump~1_BR = true` works too). |
| .confirmation | On to start: a click or a Process line asks "TURN ON (OFF) ... by hand, then press Done"; it shows ON or OFF only after Done, and the Process waits. Off: a click changes it at once. |
| Graphic, Path, Orientation, Cover, Toggle, Overlay | As a Pump Device (Rule 18.21). |
| IPs | Inlet and outlet, on the pump drawing's ports, as a Pump Device. |
| Label, Tab, Name, X, Y, Width, Height | As every Widget. No Interface, no Port. |

**Snap to align** (2026-10-28, Help 86): in Edit layout, anything with IPs that is dragged so one of its IPs comes within 10 px of another IP on the Tab jumps so the two sit exactly on each other (hold Alt to place it without the jump). On Skynet valve pictures (motorized ball, manual ball, butterfly, gas solenoid) the two IPs sit on the picture's pipe ends, not the middle of the box's sides.

### Pipe and Hose
Drawn between IPs with **Draw pipe** or **Draw hose** on the Edit layout bar (the only way to make one; not in the Widget List, Rule 5.21).
When a pump or powered valve on it is on, flow runs from the source, through the pump, into the Pipe or Hose.

| Setting | Choices / notes |
|---|---|
| Flow Color (`.flow_Color`) | **None** (default: follows the Tab), Tap, Strike, Mash, Boil, Whirlpool, Ferment, Red, Yellow, Blue, Green, Brown, Orange, Purple, Reddish Brown, Golden, RGB. The only Process attribute of a pipe or hose (Help 116) |
| Starts at IP | Flow comes from here |
| Ends at IP | Flow goes to here |
| Size units | Inch (SAE) or Metric (mm) |
| Pipe size / Hose size | List of standard sizes, or Custom |
| Custom size | Shows when Size = custom |
| Only when ALL of these are on | Optional extra conditions (pumps and valves on the pipe already count) |
| Reverse flow direction | on / off |
| Pipe color / Hose color | Default pipe #8a8f96, hose #c9ced3 |
| Show when nothing flows | Off = only the moving flow shows (the Tab picture already shows the pipe) |
| Tab, Lock position | |
| Label, Show label | As every Widget (Rule 1.21): the Label sits in the middle of the pipe |
| Name | Given by Skynet (Pipe_1, Hose_1), shown greyed out |
| X, Y, Width, Height | **Hidden** (Rule 5.21 exception): the place and size come from where it is drawn |

**Tab Flow Color** (Tab settings, `tab.flow_Color`, the Tab the screen shows) colors every pipe and hose on the Tab; a pipe's own Flow
Color overrides only Mash, Boil, Whirlpool and Ferment. Flow from a **Tap Water Valve** is always Blue, and flow that begins at a
**Vessel** with an **Out flow color** (Vessel Properties > Out flow) takes that color over all else.

Two pipe sizes meeting on one IP get a reducer cone drawn by themselves.

### Quick Disconnect Widget (`kind: ip`, `fitting: qd`, 2026-11-05, Rule 5.28, Help 127)
A cam lock **Quick Disconnect** that sits on an **IP**, most often a valve end on a manifold. Drawn as Fritz's **bold red four-point star
with a grey center** (`Images/Skynet/Valves/Quick_Disconnect.svg`, not in the Image Library), never smaller than 40 px, so it is easy to
see on a Tab. Added from **Elbows, Tees …** or **Add Widget** (IPs, couplings and caps), made on the Build Tab first (Rule 4.1). In Edit
layout it **snaps onto the nearest IP within 30 px** (`qdOn`) and follows that IP when it moves; dragged off, it comes off. With a hose
on it, it passes flow to the IP under it; with nothing on it, it is shut. Settings: those of a pipe fitting (Rule 5.14: Autosize, X and
Y hidden while it is on an IP, lock, Tab). Name **QD_1, QD_2 ...**

### Quick Disconnect Hose (`kind: pipe`, `hose: true`, `qd: true`, 2026-11-05, Rule 5.28, Help 127)
A hose drawn with **Draw QD hose** (Edit layout bar, row 2). Its first end hangs from a **pump IP** and stays put; its **free end** (`to`)
can be moved **at any time, Edit layout or not**: the right mouse button (Rule 2.9), or a finger on a phone or tablet, on the yellow
dashed ring at its end. Dropped on an **IP or Quick Disconnect** it joins it; anywhere in the **top third of a vessel** it is in that
vessel's top (`to: vtop:<vessel id>`, one big IP); anywhere else it is loose (no flow). Operators and admins move it; the move is kept
at once and every screen sees it (`POST /ui/hose`). A locked hose stays. Settings: the same as a Hose; its Properties title reads
**Quick Disconnect Hose**. Flow and Flow Colors as every hose (Rule 5.21); a vessel's Out flow color colors flow pumped from its top.

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

### Value, Time and DateTime Widgets (`valueWidget`, `timeWidget`, `dateTimeWidget`; 2026-11-05, Rule 1.23, Help 134)
Show one value on a Tab (a number, hh:mm:ss, or a date and time); a tap sets it unless Read only; every Process reads and sets it by its Name. Names start `w_Value_N`, `w_Time_N`, `w_DateTime_N`; the Label is never blank. Value box: Start value (Value Widget: Units, Decimals, Step, Lowest, Highest), Read only, Fore / Back color, Alignment; Label box; Properties box; Database and .API (When Clicked, Database Groups ...). Keeps its value when the Brain restarts.

### Graph Widget (`chart`, was the Chart Widget; 2026-11-08, renamed 2026-11-09, Rule 1.26, Help 159)
A line graph over time of brew database readings for up to two Devices or Widgets (Channel 1 left axis, Channel 2 right axis). Name `wgt_GPH_Label_TabID` (older ones keep `wgt_CHT_`). Properties (and Process attributes) match a BruControl Chart: Span seconds, Refresh interval, Grid lines across / up and down, Time axis color; per Channel: Device or Widget, Auto scale, Axis lowest / highest, Line color, Axis color. 610 x 190 to start, 1 hour Span. The BruControl Importer makes one from each BruControl Chart. A Hydrometer's line has an SG / °P / °Bx switch on the Graph itself (Rule 6.25, each screen keeps its own pick).

### Timer Widget (Timer Widget Properties, 2026-10-29, Help 92)
Same pattern as the Text Widget (COPY, orange ?, boxes). **No pictures and no background.**

| Setting | Notes |
|---|---|
| Timer box | Type (Count up / Count down), Reset value, Start value, Running when the Brain starts |
| Label box | The black title bar: Label, Visible (Show label), Font size, Font, Fore / Back color, Alignment |
| Properties box | Visible, Hidden Locked, **Style**, Tab, X Horizontal, Y Vertical, Width, Height, Lock position |
| Style | Skynet Styles 🔒 (never changed by a user): Skynet Orange Timer (seven-segment 00:00:00 on an orange-red panel, grey bezel; the default), Skynet Green LCD, Skynet Blue Timer, Skynet Red LED digits, Skynet Plain text. ➕ Add new User Style… / ✏ Edit for User Styles (Look, Digits, Panel, Bezel, Title bar colors) |
| Timer Digits (Rule 2.40, 2026-11-07, Help 152) | **Digits**: hh:mm:ss or hh:mm. **Seconds only in the last minute**: counting down, shows just SS under one minute. A User Style also has **Back color** (round the panel), **Text Fore color** (digits), **Text Back color** (panel), **Frame** (Rounded corners / Square corners / Square top, rounded bottom: Fritz's own Timer frames, drawn by Skynet) and **Frame color** |

### Code Value Widget (`codeValueWidget`; 2026-11-08, Rule 1.27, Help 161)
A Value Widget with a **Format** (Number with Units and Decimals, Time hh:mm:ss, or DateTime) and a **Code** attribute: Process code that runs once each time a person sets the Value (a tap and Set, or the .API), never when a Process sets it. `{value}` in the Code is the Value, e.g. `MB_25_HE_Brew~Kettle_BR.setpoint = {value}`. Normal Label (never blank); name `wgt_CV_Label_TabID`. Properties as the Value Widget, plus Format (after 3 Name) and Code (before X). Keeps its value when the Brain restarts; a restart does not run the Code.

### Process Widget (`processWidget`; 2026-11-09, Rule 1.31, Help 173)
Shows one **Process** on a Tab, as BruControl's Script element does: its Label as the title, what the Process is doing (Running, Waiting, Stopped, Stopped on an error; No such Process / No Process picked) and a **▶ Start / ■ Stop** button. **One click** anywhere on it starts the Process when stopped and stops it when running, with no pop-up (Rule 2.44); **Ask before starting or stopping** (off to start) makes it ask first. Properties (Pump drill-down look): 1 Label (never blank, Script_1 to start), Label Visible, 2 Tab, 3 Name, **4 Process** (dropdown of every Process), Ask before starting or stopping, X, Y, Width, Height (200 x 80 to start), Widget Type. Name `wgt_PRC_Label_TabID`. Follows its Process's new name (✏ Change name). No value of its own: no Database or .API; a Process uses `start` / `stop` on the Process itself. The BruControl Importer makes one from each BruControl Script element (BruControl's variable kept in `.bru`; not user controlled = When tapped: none).

### Skynet Dial (a Look, Rule 2.40, 2026-11-07, Help 152)
Skynet's own temperature gauge (Fritz's pick: an arc with a needle and the reading in digits under it), drawn by Skynet as SVG. Not a Widget of its own: a **Look** (`look: dial`) a Temperature Probe picks with **Display > Skynet Dial**, and any Device that shows a number picks in its Text attributes ⬢ (analog in, PWM / analog out, Duty Cycle, PID, Deadband, a Heating Element's output %). A Process: `name.valueType = "Dial"`.

| Setting | Notes |
|---|---|
| Lowest / Highest (`dialMin` / `dialMax`) | The ends of the arc. Empty = 0-220 °F, -20-110 °C, else 0-100 |
| Setpoint (`dialSp`) | A number, or the Name of a Device or gGlobal (its target, else its value). Empty = no Setpoint: a blue-to-red arc |
| Cooler range / Hotter range (`dialCool` / `dialHot`) | How far below / above the Setpoint is still OK (empty = 2 each) |
| Cold / OK / Hot color | The reading's color: Blue below the Cooler range, Red above the Hotter range, Green between (names + swatch + Custom) |
| Decimals | The item's own Decimals, 0 to 2 |

### Override button Widget (`kind: override`, 2026-10-30, Help 96)
One press: every running Process (not Loopers) moves on 100 ms later. A wait or sleep it is held in is passed, and the loop it sits in (the next goto back up) is left; the next wait runs as normal. Manual valves still wait. **Only one on a Tab**; it can be on several Tabs (COPY, Save Build ...), each with its own Label and look. No name, no background picture, no Process attributes. Operator or Admin to press.

| Setting | Notes |
|---|---|
| Label box | Label (empty = Override), Font size, Font, Bold, Fore color, Back color, Alignment. Starting look (for now): bold white Override on red #c0392b, 20 px, centered, 160 x 60 |
| Properties box | Tab, X Horizontal, Y Vertical, Width, Height, Lock position |

### Image block (every dialog with background pictures, 2026-10-29, Help 93)
Background # (1, 2, 3; 0, blank or other = none), Back Colour, Image Path 1-3 (.backpath, .backpath_2, .backpath_3) each with OPEN (Background Image N pop-up) and a typeable path (not found = blank + warning).

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
- Port tip positions of the Skynet Copper Counterflow Chiller picture (2026-11-02): Coil Top End, Coil Top Branch, Coil Bottom Branch, Coil Bottom End.

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
- Pictures in Images/Skynet/Other_Equipment (Skynet_TC15_Long_Tee, Skynet_TC15_Elbow_90, Skynet_TC15_Elbow_45, Skynet_TC15_Cross; the old pipe_tee, pipe_elbow90, pipe_elbow45 and pipe_cross were retired to Delete/ on 2026-11-05), 90 x 90.
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

### Vessel Widget (from the Skynet_Vessel_Widget Template; `vwidget: true`, 2026-11-05, Rule 5.31, Help 133)
A class of Skynet vessel: one Template with every spot, each with a **Place** slider (`ports.<spot>.installed`; all on on the
Template). Spots and their positions (picture box 260 x 320, Images/Skynet/Vessels/Skynet_Vessel_Widget.svg), locked by the Template:

| Spot | Kind | Position |
|---|---|---|
| Outlet (`outlet`) | IP | VW Center Bottom (0.5, 0.931) |
| Second Outlet (`outlet2`) | IP | VW Right Middle (0.923, 0.641) |
| Tangential (`tangential`) | IP | VW Left Low (0.077, 0.625) |
| Top Inlet (`topInlet`, new) | IP | VW Left High (0.077, 0.094) |
| Sparge (`sparge`) | IP | VW Lid Center (0.5, 0.044) |
| CIP (`cip`) | IP | VW Lid Right (0.769, 0.044) |
| Steam Slayer (`steamSlayer`) | IP | VW Right High (0.923, 0.1875) |
| Temperature Probe (`thermowell`) | picture, no IP | `probeStyle` thermowell: VW Left Thermowell (0.077, 0.844), Skynet_TC15_Thermowell_Short.svg; front: VW Front (0.5, 0.8), Skynet_TC15_Thermowell_Front.svg |
| Element Port (`element`) | picture, no IP | VW Right Element (0.923, 0.859), BigMacRElementOff.svg, glows while `heater` is on |

Not Placed: no IP, nothing on the Tab, hidden in Edit layout too (faint marks only with 👁 Show All, Rule 19.4). Properties (Vessel Widget Properties): Name, Type, Label,
Graphic, the Place switches, Probe: Front or Thermowell, then the Devices (`probe`, `heater`: links to Devices the Schema has; making
them from the vessel waits on Rule 5.7), Flip Horizontal, Out flow color, Label and place. An IP on a vessel is a TC, NPT or BSP
outlet or inlet: a place to connect anything with its own IP.

**Size by gallons (Vessel Rules 19.1-19.4, Help 135, 2026-11-05):** `volume` = **Gallons** (Liters when Metric; 10 on every vessel
Template), `sizeMethod` Proportional (default: Fritz's plain vessel, 1 gallon = 197 x 237) or `diameter` with `diameter` and
`vheight` (inches; cm Metric). Size follows volume (10 gal = 424 x 511). Tab settings **Master Vessel Sizer** (`tab.vSizer` = the
vessel's id, `tab.vScale` its scale): only the Master has grab points and Width / Height (📏 in Edit layout); every Vessel Widget on
the Tab follows it. No Master: no resizing. Not Placed spots are hidden even on the Build Tab until **👁 Show All** in Properties.

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
| Kettle_DigiBoil | Brew Kettle, its own heat set by hand (Rule 5.39) | Outlet CB with its BSP Spigot (Manual valve) built in; Controls: Power, Heater, set point and screen |
| Kettle_Brewzilla_65L | All In One, its own heat and pump set by hand (Rule 5.39) | Outlet CB with its BSP Spigot, Pump out IP with its Manual valve; Controls: Pump, Heater 1, 2, 3, set point, screen On/Off and Run |
| Kettle_Foundry_Electric | All-in-one, electric | Outlet Front Low + Valve_90 |
| Kettle_Grainfather_Electric | All-in-one, electric | Outlet CB + Valve_90 |
| Integrated_Electric_Kettle_Basic | Skynet_Integrated_Device | Outlet, Thermowell + probe and Element built in |
| RIMS_Tube | Skynet_Integrated_Device | Wort In, Wort Out, Thermowell + probe and Element built in |
| Plate_Chiller | Plate chiller, Brazed plate 30, MPT 1/2 | 4 ports |
| Counterflow_Chiller / _Small | Plate chiller, Counterflow, MPT 1/2 | 4 ports |
| Copper_Counterflow_Chiller | Plate chiller, Counterflow, MPT 1/2 (Fritz's Copper_CounterFlow drawing, 2026-11-02) | 4 IPs on the real port tips, all facing left: Wort In (top, straight through the tee), Water Out (top tee branch), Water In (bottom tee branch), Wort Out (bottom, straight through the tee) |
| Immersion_Chiller | Chilling coil, 2 ports, MPT 1/2 | In, Out |
| Chillzilla | Chilling coil, 4 ports, MPT 1/2 | In, Out, In 2, Out 2 |
| HERMS_Coil | HERMS coil, Stainless 50 ft | Wort In, Wort Out |
| Trub_Filter | Trub filter, Inline filter | Inlet, Outlet |
| Hop_Filter_Inline | Trub filter, Hop rocket, MPT 1/2 | Inlet Top, Outlet Bottom Right |

"_Electric" versions: pick the Heating Element Device and Temperature Probe on the Tab.

### Skynet Bundled Fitting Templates (TC 1.5 unless noted)
**TC Pipe Fittings** (Rule 5.25, Help 124): the plain ones here (elbows, tees, cross, U, reducers, check valve, End Cap) are a Widget subclass. Skynet puts the elbow, tee or cross the pipes need where they meet (a pipe drawn to an elbow's bend makes it a tee), and they are added by hand from Elbows, Tees … or Add Widget > TC Pipe Fittings. Elbows, tees and the cross also have a `bend` (where the pipes' center lines meet on the picture).

**Valve Tees and Supply Manifolds** (Rule 5.35, Help 146) are on the same Elbows, Tees … list but are not Widgets: each valve built into them is a valve Device, so they are in the Device Library (5.4).

Every IP is the center of a ferrule's outer face, or the center of the opening on a front view (Rule 5.20). Fritz's 2026-11-02 drawings give each Template its own shape (`size`), where its IPs sit as "x,y" fractions of the picture (`ipPos`), and how thick its pipe is drawn (`body`, used by Autosize to pipe). A Skynet pipe fitting already on a Tab takes its Template's new picture when Edit layout opens. Tees with a Temperature Probe in them are Temperature Devices (Device Library).

| Name | Fittings | Openings |
|---|---|---|
| Elbow_90 | 90° elbow (Fritz's drawing 2026-11-04) | Bottom, Right |
| Elbow_45 | 45° elbow (redrawn 2026-11-04 in the style of Fritz's new Elbow) | Bottom Left (45°), Right |
| Elbow_Front | 90° elbow seen from the front (Fritz's drawing) | center of the front opening, Bottom |
| Tee | Normal Tee (Fritz's drawing 2026-11-04, 160 x 102) | Left, Right, Bottom (branch) |
| Instrument_Tee (160 x 69) | Tee with a short branch (redrawn 2026-11-04 in the style of Fritz's new Tee) | Left, Right, Bottom (branch) |
| Cross (100 x 100) | Cross, two tees in one (new 2026-11-04) | Left, Right, Bottom, Top |
| Reducer_2_1_Concentric (TC 2) | Reducer to 1, both ends on one center line | Left (big), Right (small) |
| Reducer_2_1_Eccentric (TC 2) | Reducer to 1, flat along the bottom | Left (big), Right (small, low) |
| Reducer_2_1_Front (TC 2) | Reducer to 1 seen from the front | both at the center of the opening |
| U_Bend | U | both at the bottom |
| Reducer (TC 2) | Reducer to 1.5 (drawn like the concentric one) | Left (big), Right (small) |
| End_Cap | End Cap | none: closes an opening |
| Check_Valve | Check valve (one way, Left to Right) | Left, Right |
| Sight_Glass | Sight glass, plain glass; **Length** (inches, 2 to 48, 6 when placed) stretches only the glass (Rule 5.32, Help 139) | Left, Right |
| Sight_Glass_Caged | Sight glass with a stainless cage round the glass; **Length** as above | Left, Right |
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

**Settings they all share:** Name, Label (`label`; it was Display name), Show label, Tab, X, Y, Width, Height, Lock position, Background picture (1-3; 0, blank or over 3 = none), .backpath, .backpath_2, .backpath_3 (all three editable and settable by a Process, as in BruControl; `name.image = "path"` gives unlimited pictures), Visible, Hidden locked, Hide value / text, Look (normal, led, lcd, dark, button, indicator), Digits shown, Value font size, When tapped (default, none, toggle, push button, dialog, process, tab), Tap target, Ask before changing, and Text box look (Fore / Back color, Alignment, Word wrap, Name font + size + color + background, Value color + background, Name / Value alignment, Border).

| Widget | Its own settings |
|---|---|
| Picture Widget (`pic_`, Rule 18.27, 2026-11-05) | Made in the **Add Widget box** (Picture ➕ or Add Widget > Picture Widget), the Pump's drill-down for a Widget: **1 Label** ⬢ + Label Visible, **2 Picture** (`imageOff`), **3 Tab** (the 🔨 Build Tab), then **4 Name** (Suggested `pic_` + Label), Graphic, **Turns on with** (`follow`: an on/off Device or Widget, or a heater that is on while Enabled; None = a still picture and the Overlay is greyed out) with **Toggle** (`tap`), **Overlay** (`imageOverlay`; ⬢ Picture when on `imageOn`, optional, and Back Colour), **Text on picture** (`text`), X, Y, Width, Height (140 x 120), Widget Type (Picture) greyed out |
| **Semi_Widgets_Devices** (Rule 1.20, 2026-11-02) | Widgets with an ON / OFF `.state`. Switch, Push Button, Pulse Button and LED have **Device controlled** (`deviceControlled`, `.device_controlled` read only; None to start; only Devices with an ON / OFF state: on/off outputs, pumps, valves a Process switches, Duty Cycle / Hysteresis / PID on while Enabled). With a Device picked, the two follow each other like a Clone. The Manual Valve Widget is in the class too, with no Device controlled (click only). |
| Switch (`sw_`) | Device controlled, Picture when on / off, Text when on / off. A tap slides it ON / OFF |
| Slider (`wgt_SLD_`, 2026-11-09) | A Boolean Widget (Rule 1.20), a Switch inside with `boolStyle: slider`: Linked Device, Text when on / off. Drawn by Skynet: a sliding ON / OFF switch, green while ON. Its look is fixed |
| Checkbox (`wgt_CHK_`, 2026-11-09) | A Boolean Widget, `boolStyle: checkbox`: Linked Device, Text when on / off. A tick box, ticked while ON. Its look is fixed |
| Lighted Button (`wgt_LTB_`, 2026-11-09) | A Boolean Widget, `boolStyle: lighted`: Linked Device, Text when on / off. A button with a lamp lit while ON. Its look is fixed |
| Push Button (`pb_`) | Device controlled, Picture when on / off, Text when on / off. ON only while held |
| Pulse Button (`pl_`) | Device controlled, Picture when on / off, Text when on / off. One 100 ms ON per tap; when it only follows its Device it shows ON while the Device is ON |
| LED (`led_`) | Device controlled, Text when on / off; Look indicator (a light). A tap does nothing: a Process or its Device sets it |
| Timer | Type (count up, count down), Reset value, Start value (hh:mm:ss), Running when the server starts |
| Alarm Widget: **Basic Skynet Alarm** (2026-11-02) | Its own **Alarm Widget Properties** (General Dialog Rules, section 18): Label first (never blank, Show label, ⬆ 2-line box, ⬢ Label attributes), Name (follows the Label: `alm_` + Label), then boxes. **Alarm:** Kind of alarm, timer / Hop Alarm, Sound, Sound file(s), Sound file number, Repeat sound. **Graphic, four layers:** Layer 4 **Back color** (`.back`), Layer 3 **Fore color** (`.fore`, the bell), Layer 2 **Set Graphic** (Skynet `Alarm_Set_` pictures, None first; Hop to start), Layer 1 **Active overlay** (Skynet `Alarm_Active_` pictures, None first; Red to start; blinks while active). The bell picture is set by Skynet (Images/Skynet/Alarms/Alarm_Basic.svg Together, _Back, _Fore, _Lines). **Properties:** Visible, Hidden Locked, Tab, X, Y, Width, Height, Lock. **Alarm Chain** (Rule 7.16, Help 172): up to 20 steps, each with a name and Fore, Back, Set Graphic, Active overlay and Sound (No Change first); a Hop Alarm's steps can have times on its timer. Attributes `.active`, `.back`, `.fore`, `.step`, `.setgraphic`, `.label`, `.visible` ... |
| Alarm Widget: **User Alarm** (2026-11-02) | The same dialog, but **Graphic:** Background picture (Image Path 1, any picture or a typed path; ⬢ Graphic Dialog with Background #, Image Path 2 and 3, Back Colour), Set Graphic (Layer 2, any picture), Active overlay (Layer 1), Back color (`.back`, behind the pictures). Its Alarm Chain steps can also change its Background picture. |
| Alarm (made before 2026-11-02, no subclass) | Sound file, Sound files 1-3, Sound file number, Sound (custom, default, none), Repeat sound, Text when sounding, Picture when sounding / quiet |
| Alarm Widget: **Email** (2026-11-09, both kinds) | **Email Notification** (switch, Off to start) and **Email to** (addresses with commas; empty = every user with an email in My account). Sent through the mail server picked in Settings (Rule 7.17, Help 175). Attribute `.email` (true / false). |
| Sound Player | Sound file, Repeat sound. Lowest priority (5): pauses while any alarm sounds. Process: play / stop SoundPlayer |
| Label | Text box only (no own settings) |
| Process Widget (Rule 1.31) | Process (dropdown), Ask before starting or stopping. Shows the Process's state with Start / Stop; one click starts or stops it |
| Manual vessel (BrewZilla, DigiBoil by hand) | Temperature units, Volume units, Set point decimals, Set point at start, Has no pump, Picture when heating / not heating. Processes set setpoint, heat, pump, timer, message, waiting; the brewer confirms or types a reading. The DigiBoil and 65 L Brewzilla Controls (Rule 5.39) also have power, heat2, heat3 and run, and a Process setting them pops up what to do by hand and waits |

### gGlobal variables (Processes and screen; database and outside programs when its Database and .API box says so)
gKonstant and gAPI became one class, gGlobal, on 2026-10-30 (Skynet Rule 1.16, Help 98). Settings: Kind, then by kind: Initial value, Decimals, Units, + / - step, Lowest / Highest allowed, Text when on / off, Read only on screen, Keep value on restart, then the **Database and .API** box.

| Kind | Prefix (hint) | Extra |
|---|---|---|
| Graphic (image file path) | gG_ | Image path |
| String | gGS_ | |
| Long String (text file) | gGL_ | Text file path |
| Value | gGV_ | |
| Time | gGT_ | |
| Date Time | gGDT_ | |
| Boolean | gGB_ | |
| Switch (tap ON, tap again OFF) | gGSW_ | |
| Push Button (ON while held) | gGPB_ | |
| Pulse Button (one 100 ms pulse per tap) | gGMB_ | On time in ms |
| List (dropdown: Value + Text) | gGList_ | Choices (two columns: Value, Text), Starting choice |
| Step (shows the Process step reached) | gGStep_ | Shows the steps of: Flow, Sub, Repeat, Looper, Any Process |

---

## Change log
- 2026-10-27: First version.
- 2026-10-27: Display Name became Label (`label`) with a Show label switch; Picture became the Picture Widget with Turns on with; imagePath_2 / _3 editable again; On overlay preferred (thread "Apply clean-up requests and standards").
- 2026-10-28: IP Snap to align (10 px) and IPs on the pipe ends of Skynet valve pictures (thread "Lock Skynet Widget Templates and IPs", Help 86).
- 2026-10-28: Pipe fitting Widgets (only X, Y, Width, Height and Autosize to pipe; no Clone) and the Manual Valve Widget (click-only .state, Process asks by hand, open overlay) (thread "Simplify pipe fittings and Manual Valves", Help 87).
- 2026-10-28: Skynet Device Templates and User versions (Rules 5.16-5.18), first one the Skynet Motorized Ball Valve Device (Help 88).
- 2026-10-29: Text Widget Properties: new dialog pattern (boxes, COPY, orange ? info pop-up), w_Text_N names, Label line, word wrap always on, new Process attributes (thread "Redesign the Text Widget dialog", Help 91).
- 2026-10-29: Timer Widget Properties with Styles (Skynet Styles locked, User Styles), no pictures; the Image block for dialogs with pictures (Help 92, 93).
- 2026-10-30: Override button Widget (one per Tab, per-Tab Label and look; passes a wait, sleep or loop 100 ms after the press) (thread "Add an Override button", Help 96).
- 2026-10-30: Database and .API settings on every Widget with a value; gKonstant and gAPI variables became one class, gGlobal (prefixes gG). (thread "Send any Device or Widget to a database", Help 98)
- 2026-11-02: Alarm Widget with two subclasses, Basic Skynet Alarm (four layers: Back, Fore, Set Graphic, Active overlay) and User Alarm, picked when made and never changed; Alarm Widget Properties follow the General Dialog Rules. (thread "Make the Alarm Widget a Template", Help 107)
- 2026-11-02: Skynet Copper Counterflow Chiller Template (Copper_Counterflow_Chiller, picture Chiller_Copper_Counterflow.svg redrawn from Fritz's file) with 4 IPs on the real port tips (thread "Add copper counterflow chiller Widget", Help 109).
- 2026-11-02: Fritz's pipe drawings (Help 110, Rule 5.20): Elbow_90, Elbow_45, Tee (Long Tee) and Instrument_Tee redrawn; new Elbow_Front, Reducer_2_1_Concentric, Reducer_2_1_Eccentric and Reducer_2_1_Front; IPs on the ferrule faces; Manual Valve Widget Picture (Manual Ball Valve side, front, front elbow). (thread "Create pipe Widgets from Fritz's drawings")
- 2026-11-02: Semi_Widgets_Devices class (Rule 1.20): Switch, Push Button, Pulse Button and LED Widgets with Device controlled (None to start, follows its Device both ways like a Clone), and the Manual Valve Widget. (thread "Create the Semi_Widgets_Devices class", Help 112)
- 2026-11-02: Background pictures are .backpath, .backpath_2, .backpath_3 (were imagePath_1-3); 0, blank or over 3 = no background (Rule 7.10). (thread "Rename image paths to backpath")
- 2026-11-02: Universal Properties standard (Rule 1.21): every Device, Widget and Semi-Device gets the same Properties and attributes; see docs/Universal_Properties.md. (thread "Set universal properties standard", Help 114)
- 2026-11-03: Pipe and Hose Flow Colors (Rule 5.21, Help 116): Flow Color None by default; Tab Flow Color (tab.flow_Color); Vessel Out flow color; tap water always Blue; pipes and hoses keep their Label; X, Y, Width, Height hidden. (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-03: IP points get a Flow Color (`.flow_Color`), first in the flow color order (Rule 5.21, Help 116). (thread "Add flow colors to pipe and hose Widgets")
- 2026-11-04: Fritz's new drawings for Elbow_90 and Tee (thicker pipe, grey outline, IPs on the ferrule faces, Rule 5.20); the Three Vessel sample uses them for all its elbows and tees. (thread "Make Fritz's 90 elbow into an SVG Widget")
- 2026-11-04: TC Pipe Fittings Widget subclass (Rule 5.25, Help 124): new Cross; Elbow_45 and Instrument_Tee redrawn; joints where pipes meet become TC Pipe Fittings; the old equipment Pipe tee / elbows / cross left the Add lists. (thread "Make Fritz's elbow and tee into SVG Widgets")
- 2026-11-04: Manual Valve Widget has two IPs, one at each pipe end, in every Orientation (Rule 5.24, Help 123). (thread "Add IPs to Ball Valve Devices and Widgets")
- 2026-11-05: Quick Disconnect Widget (Fritz's red star on a valve IP) and Quick Disconnect Hose (its free end moves at any time, onto an IP, a Quick Disconnect or the top third of a vessel) (Rule 5.28, Help 127). (thread "Add movable quick disconnect hose")
- 2026-11-05: Vessel Widget class (Rule 5.31, Help 133): Skynet_Vessel_Widget Template, a Place slider on each IP, the Temperature Probe (Thermowell or Front) and the Element Port; new vessel port Top Inlet. The Three Vessel sample's vessels use it.
- 2026-11-05: Picture Widget: Add Widget box and Properties follow the Pump drill-down (Rule 18.27, Help 74); Picture ➕ makes a Picture Widget. (thread "Build Picture Widget dialog like Pump")
- 2026-11-05: Sight_Glass and Sight_Glass_Caged TC Pipe Fittings (Rule 5.32, Help 139): a Length setting in inches stretches the glass; Label starts as site_glass_n. (thread "Add caged and plain sight glass fittings")
- 2026-11-06: Tap Water Valve, a Manual Valve Widget with a household hose bib picture, one IP on its hose outlet, a tap water source while open, Label tap_water_n (Rule 5.33, Help 141). (thread "Add hose bib Manual Valve Widget")
- 2026-11-08: Code Value Widget (Rule 1.27, Help 161): a Value Widget in a chosen Format whose Code attribute runs Process code with {value} each time a person sets it. (thread "Build a Code Value Widget")
- 2026-11-06: Pointer to the Valve Tee and Supply Manifolds (Rule 5.35): on the Elbows, Tees … list, but they are Skynet_Integrated_Devices (Device Library 5.4). (thread "Add valve Tees and supply manifolds")
- 2026-11-09: Process Widget (`processWidget`, Rule 1.31, Help 173): one Process on a Tab with its state and Start / Stop, one click starts or stops it; name `wgt_PRC_Label_TabID`; the BruControl Importer makes one from each Script element.
- 2026-11-08: Manual Pump Widget (`manualPump`, Rule 5.15a) and the `.confirmation` switch on the Manual Valve Widget (on), Manual valve Devices (on), Switch and LED (off) (Rule 1.28). (thread "Build Confirmation Widgets in the Panel")
- 2026-11-09: Boolean Widgets (Rule 1.20): Slider, Checkbox and Lighted Button added as their own sub-Widgets with a fixed look; Device controlled shown as Linked Device (acts like a Clone of the Device). (thread "Add Boolean Widget styles and linking")
- 2026-11-09: Alarm Widget gets Email Notification and Email to (Rule 7.17, Help 175). (thread "Find BruControl properties missing in Skynet")
- 2026-11-09: Chart Widget: a Hydrometer's line has an SG / °P / °Bx switch right on the Graph (Rule 6.25, Help 170). (thread "Add Hydrometer Device with templates")
