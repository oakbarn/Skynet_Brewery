# Skynet Image Library

Every picture Skynet ships, copied from the repo so we can look them up when we talk about images. Source: oakbarn/Skynet_Brewery, default branch `claude/project-thread-vzxi0a`, folder `media/Images/Skynet/<group>/`, as of version PR107_Skynet-v.20261026_23_23 (2026-10-26).

Copies live in `/mnt/project-files/Image_Library/<group>/` with the same group folders. A contact sheet of every picture is `Image_Library/_Contact_Sheet.png`.

**In the GitHub repo**, the pictures themselves are in [media/Images/Skynet](../media/Images/Skynet/) (one folder per group). Tap a group folder, then a file, to see the picture.

**Rule (Fritz, 2026-10-27): new images are never added here automatically.** A new image goes in only when Fritz says to commit it.

**Totals:** 133 files (113 SVG, 20 PNG) in 10 groups. The Motors group is empty.

Notes: "viewBox" is the drawing's own size in SVG units (it scales to any size on screen). PNG sizes are pixels. Where a PNG and an SVG share a name, the PNG is the original and the SVG is either a hand redraw ("Skynet drawing") or a panel auto-trace. "Pump_Whute_Rip_On" is the original file name, typo included.

## Groups

- [Alarms](#alarms) (2)
- [Chillers](#chillers) (4)
- [Hop_Infusion](#hop_infusion) (1)
- [Lights_LEDs](#lights_leds) (5)
- [Miscellaneous](#miscellaneous) (1)
- [On_Off](#on_off) (3)
- [Other_Equipment](#other_equipment) (32)
- [Pumps](#pumps) (25)
- [Valves](#valves) (33)
- [Vessels](#vessels) (27)

## Alarms

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `AlarmBitter.png` | Alarm bell picture (original PNG). | 600x600 px | sample Schema (config/brewery.json) |
| `AlarmBitter.svg` | Alarm bell, SVG traced from AlarmBitter.png (the trace is clean). | viewBox 0 0 600 600 (600x600) | not used yet |

## Chillers

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Chiller_Counterflow.svg` | Skynet counterflow chiller (redrawn from Fritz's CounterFlow_1 photo): a copper coil with Wort In at the Top Left, Water Out at the Top Right, Water In at th... | viewBox 0 0 240 280 (240x280) | Vessel/Equipment Template Counterflow_Chiller |
| `Chiller_Counterflow_Small.svg` | Skynet small counterflow chiller (redrawn from Fritz's CounterFlow_2 photo): a shorter copper coil with Wort In at the Top Left, Water Out at the Top Right, ... | viewBox 0 0 240 200 (240x200) | Vessel/Equipment Template Counterflow_Chiller_Small |
| `chill_coil.svg` | Coiled immersion chiller. | viewBox 0 0 180 180 (180x180) | Vessel/Equipment Template Chillzilla; Vessel/Equipment Template Immersion_Chiller; Equipment Widget "Chilling coil" |
| `plate_chiller.svg` | Brazed plate chiller, four ports at the corners. | viewBox 0 0 110 200 (110x200) | Vessel/Equipment Template Plate_Chiller; Equipment Widget "Plate chiller" |

## Hop_Infusion

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Filter_Hop_Inline.svg` | Skynet inline hop filter (a generic drawing, no maker's name or logo): domed stainless body, inlet at the middle of the Top edge, outlet low on the Right edg... | viewBox 0 0 200 300 (200x300) | Vessel/Equipment Template Hop_Filter_Inline |

## Lights_LEDs

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `bolt_off.svg` | Lightning bolt, grey (off). | viewBox 0 0 100 100 (100x100) | On/Off picture list "Lightning bolt off" |
| `bolt_on.svg` | Lightning bolt, yellow (on). | viewBox 0 0 100 100 (100x100) | On/Off picture list "Lightning bolt on" |
| `led_green.svg` | Round LED, green. | viewBox 0 0 100 100 (100x100) | On/Off picture list "LED green"; default On/Off picture for new Digital In/Out, switch, picture |
| `led_off.svg` | Round LED, grey (off). | viewBox 0 0 100 100 (100x100) | On/Off picture list "LED off (grey)" |
| `led_red.svg` | Round LED, red. | viewBox 0 0 100 100 (100x100) | On/Off picture list "LED red"; default On/Off picture for new Digital In/Out, switch, picture |

## Miscellaneous

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `brewery_main.png` | Sample Tab background photo of a brewery (3540x2304, too big to trace). | 3540x2304 px | sample Schema (config/brewery.json) |

## On_Off

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Overlay_Bolt_Center.svg` | On overlay: a big half see-through lightning bolt over the middle of the picture | viewBox 0 0 100 100 (100x100) | On overlay "Lightning bolt (big, see-through)" |
| `Overlay_Bolt_Corner.svg` | On overlay: a lightning bolt badge in the top right corner, the rest is see-through | viewBox 0 0 100 100 (100x100) | On overlay "Lightning bolt (corner badge)" |
| `Overlay_Glow_Ring.svg` | On overlay: a green glow around the picture | viewBox 0 0 100 100 (100x100) | On overlay "Green glow ring" |

## Other_Equipment

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `BigMacRElementOff.png` | BigMac heating element, off (original PNG). | 51x24 px | sample Schema (config/brewery.json) |
| `BigMacRElementOff.svg` | BigMac heating element, off (grey), mounting flange on the right. Same size as BigMacRElementOff.png. | viewBox 0 0 51 24 (51x24) | not used yet |
| `BigMacRElementOn.png` | BigMac heating element, on (original PNG). | 51x24 px | sample Schema (config/brewery.json) |
| `BigMacRElementOn.svg` | BigMac heating element, on (red), mounting flange on the right. A copy of BigMacRElementOff.svg with the element red. Same size as BigMacRElementOn.png. | viewBox 0 0 51 24 (51x24) | not used yet |
| `Burner No Flame.png` | Jet burner with no flame (original photo-like PNG). | 400x400 px | sample Schema (config/brewery.json) |
| `Burner No Flame.svg` | cast-iron jet burner with brass jets, no flame. Same size as Burner No Flame.png. | viewBox 0 0 400 400 (400x400) | not used yet |
| `BurnerFlame.png` | Burner flame (original PNG). | 251x191 px | sample Schema (config/brewery.json) |
| `BurnerFlame.svg` | Auto-traced SVG of BurnerFlame (made by the panel; quality only fair). | viewBox 0 0 251 191 (251x191) | not used yet |
| `Equipment_RIMS.svg` | Skynet RIMS tube: liquid in at the top left, out at the bottom right; probe (purple) in the left end, element (red) in the right end | viewBox 0 0 200 100 (200x100) | Equipment Widget "RIMS tube" |
| `Fitting_Elbow45.svg` | Skynet 45 degree elbow: openings at the middle of the Left edge and near the top right corner | viewBox 0 0 100 100 (100x100) | Skynet Bundled Fitting picture choice |
| `Fitting_Elbow90.svg` | Skynet 90 degree elbow: openings at the middle of the Bottom and Right edges | viewBox 0 0 100 100 (100x100) | Skynet Bundled Fitting picture choice |
| `Fitting_End_Cap.svg` | Skynet End Cap, seen face on: it closes the opening it is dropped on, so it looks the same whichever way it points | viewBox 0 0 100 100 (100x100) | Skynet Bundled Fitting picture choice |
| `Fitting_Flow_Meter.svg` | Skynet flow meter: openings at the middle of the Left and Right edges; liquid can pass either way | viewBox 0 0 100 100 (100x100) | Fitting Template Flow_Meter; Skynet Bundled Fitting picture choice |
| `Fitting_Flow_Meter_Temp.svg` | Skynet flow meter with temperature: openings at the middle of the Left and Right edges; liquid can pass either way. The red thermometer on top marks its temp... | viewBox 0 0 100 100 (100x100) | Fitting Template Flow_Meter_Temp; Skynet Bundled Fitting picture choice |
| `Fitting_Reducer.svg` | Skynet reducer, seen from the side: the big opening at the middle of the Left edge, the small one at the middle of the Right edge | viewBox 0 0 100 100 (100x100) | Fitting Template Reducer; Skynet Bundled Fitting picture choice |
| `Fitting_Tee.svg` | Skynet Tee: openings at the middle of the Left, Right and Top edges | viewBox 0 0 100 100 (100x100) | Skynet Bundled Fitting picture choice |
| `Fitting_U.svg` | Skynet U bend: two openings at the Bottom edge, a quarter in from the left and from the right | viewBox 0 0 100 100 (100x100) | Fitting Template U_Bend; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_45.svg` | Skynet TC 1.5 inch 45 degree elbow (after Fritz's drawing): openings at the middle of the Left edge and near the top right corner | viewBox 0 0 100 100 (100x100) | Fitting Template Elbow_45; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_90.svg` | Skynet TC 1.5 inch 90 degree elbow (after Fritz's drawing): openings at the middle of the Bottom and Right edges, a long round bend | viewBox 0 0 100 100 (100x100) | Fitting Template Elbow_90; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_EndCap.svg` | Skynet TC 1.5 inch End Cap, seen from the side (after Fritz's drawing). On an opening it turns to face it. | viewBox 0 0 100 100 (100x100) | Fitting Template End_Cap; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_EqualTee.svg` | Skynet TC 1.5 inch equal tee (after Fritz's drawing): openings at the middle of the Left, Right and Top edges, round inside corners | viewBox 0 0 100 100 (100x100) | Fitting Template Tee; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_InstrumentTee.svg` | Skynet TC 1.5 inch instrument tee (after Fritz's drawing): a short tee with a short, narrow branch for a probe or gauge. Openings at the middle of the Left, ... | viewBox 0 0 100 56 (100x56) | Fitting Template Instrument_Tee; Skynet Bundled Fitting picture choice |
| `Skynet_TC15_Thermowell_Long.svg` | Skynet TC 1.5 inch long thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 320 100 (320x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC15_Thermowell_Medium.svg` | Skynet TC 1.5 inch medium thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 230 100 (230x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC15_Thermowell_Short.svg` | Skynet TC 1.5 inch short thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 150 100 (150x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC1_2_Rims_Device.svg` | Skynet RIMS tube, an Integrated Device (Fritz's drawing, 2026-10-23): wort in at the top left and out at the bottom (TC fittings with their IPs built in), th... | viewBox 0 0 413 58 (413x58) | Integrated Device Template RIMS_Tube |
| `herms_coil.svg` | HERMS coil. | viewBox 0 0 180 180 (180x180) | Vessel/Equipment Template HERMS_Coil; Equipment Widget "HERMS coil" |
| `pipe_cross.svg` | Pipe cross (4 ends). | viewBox 0 0 90 90 (90x90) | Equipment Widget "Pipe cross"; Skynet Bundled Fitting picture choice |
| `pipe_elbow45.svg` | Pipe 45° elbow. | viewBox 0 0 90 90 (90x90) | Equipment Widget "Pipe 45° elbow"; Skynet Bundled Fitting picture choice |
| `pipe_elbow90.svg` | Pipe 90° elbow. | viewBox 0 0 90 90 (90x90) | Fitting Template Valve_90; Fitting Template Valve_Tee_Thermowell_90; Equipment Widget "Pipe 90° elbow"; Skynet Bundled Fitting picture choice |
| `pipe_tee.svg` | Pipe tee (3 ends). | viewBox 0 0 90 90 (90x90) | Equipment Widget "Pipe tee"; Skynet Bundled Fitting picture choice |
| `trub_filter.svg` | Trub / hop filter canister. | viewBox 0 0 100 170 (100x170) | Vessel/Equipment Template Trub_Filter; Equipment Widget "Trub filter" |

## Pumps

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Pump_Black_Rip_Off.svg` | Riptide-style pump, off, black cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used by anything yet (in the picture list only) |
| `Pump_Blue_Rip_Off.png` | Original PNG (Pump Blue Rip Off). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Blue_Rip_Off.svg` | Riptide-style pump, off, blue cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Blue_Rip_On.png` | Original PNG (Pump Blue Rip On). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Blue_Rip_On.svg` | Auto-traced SVG of Pump_Blue_Rip_On (made by the panel; quality only fair). | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Green_Rip_Off.png` | Original PNG (Pump Green Rip Off). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Green_Rip_Off.svg` | Riptide-style pump, off, green cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Green_Rip_On.png` | Original PNG (Pump Green Rip On). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Green_Rip_On.svg` | Auto-traced SVG of Pump_Green_Rip_On (made by the panel; quality only fair). | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_NoCover_Rip_Off.svg` | Riptide-style pump, off, no cover. Same size and pipe spots as the other Riptide pumps. | viewBox 0 0 434 292 (434x292) | not used by anything yet (in the picture list only) |
| `Pump_Purple_Rip_Off.svg` | Riptide-style pump, off, purple cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used by anything yet (in the picture list only) |
| `Pump_Red_Rip_Off.png` | Original PNG (Pump Red Rip Off). | 434x292 px | Pump Device preset; sample Schema (config/brewery.json) |
| `Pump_Red_Rip_Off.svg` | Riptide-style pump, off, red cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Red_Rip_On.png` | Original PNG (Pump Red Rip On). | 434x292 px | Pump Device preset; sample Schema (config/brewery.json) |
| `Pump_Red_Rip_On.svg` | Auto-traced SVG of Pump_Red_Rip_On (made by the panel; quality only fair). | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Sump_Off.svg` | Skynet submersible sump pump, off (a generic drawing): it sits in the water and draws in through the screen at the Bottom; the outlet is at the top right. Gr... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Submersible sump pump off" |
| `Pump_Sump_On.svg` | Skynet submersible sump pump, on (a generic drawing): it sits in the water and draws in through the screen at the Bottom; the outlet is at the top right. Gre... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Submersible sump pump on" |
| `Pump_White_Rip_Off.png` | Original PNG (Pump White Rip Off). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_White_Rip_Off.svg` | Riptide-style pump, off, white cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Whute_Rip_On.png` | Original PNG (Pump Whute Rip On). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Whute_Rip_On.svg` | Auto-traced SVG of Pump_Whute_Rip_On (made by the panel; quality only fair). | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Yellow_Rip_Off.png` | Original PNG (Pump Yellow Rip Off). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Yellow_Rip_Off.svg` | Riptide-style pump, off, yellow cover. Same size and pipe spots as the Riptide pump PNGs. | viewBox 0 0 434 292 (434x292) | not used yet |
| `Pump_Yellow_Rip_On.png` | Original PNG (Pump Yellow Rip On). | 434x292 px | sample Schema (config/brewery.json) |
| `Pump_Yellow_Rip_On.svg` | Auto-traced SVG of Pump_Yellow_Rip_On (made by the panel; quality only fair). | viewBox 0 0 434 292 (434x292) | not used yet |

## Valves

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Valve_Ball_ClosedH_1.png` | Original PNG (Valve Ball ClosedH 1). | 139x119 px | On/Off picture list "Ball valve closed (horizontal)"; sample Schema (config/brewery.json) |
| `Valve_Ball_ClosedH_1.svg` | motorised ball valve, closed, horizontal pipe. Same size and pipe spot as Valve_Ball_ClosedH_1.png. | viewBox 0 0 139 119 (139x119) | not used yet |
| `Valve_Ball_ClosedV-1x1.png` | Original PNG (Valve Ball ClosedV-1x1). | 119x141 px | On/Off picture list "Ball valve closed (vertical)" |
| `Valve_Ball_ClosedV-1x1.svg` | motorised ball valve, closed, vertical pipe. Same size and pipe spot as Valve_Ball_ClosedV-1x1.png. | viewBox 0 0 119 141 (119x141) | not used yet |
| `Valve_Ball_OpenH_1.png` | Original PNG (Valve Ball OpenH 1). | 139x119 px | On/Off picture list "Ball valve open (horizontal)"; Skynet Bundled Fitting picture choice; sample Schema (config/brewery.json) |
| `Valve_Ball_OpenH_1.svg` | Auto-traced SVG of Valve_Ball_OpenH_1 (made by the panel; quality only fair). | viewBox 0 0 139 119 (139x119) | not used yet |
| `Valve_Ball_OpenV-1x1.png` | Original PNG (Valve Ball OpenV-1x1). | 119x141 px | On/Off picture list "Ball valve open (vertical)"; Skynet Bundled Fitting picture choice |
| `Valve_Ball_OpenV-1x1.svg` | Auto-traced SVG of Valve_Ball_OpenV-1x1 (made by the panel; quality only fair). | viewBox 0 0 119 141 (119x141) | not used yet |
| `Valve_Check.svg` | Skynet check valve: openings at the middle of the Left (flow in) and Right (flow out) edges. The arrow shows the only way liquid can go. | viewBox 0 0 100 100 (100x100) | Fitting Template Check_Valve; Skynet Bundled Fitting picture choice |
| `Valve_Gas_Solenoid_ClosedH.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), horizontal: pipe ends at the middle of the Left and Right edges, coil on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Solenoid gas valve closed (horizontal)" |
| `Valve_Gas_Solenoid_ClosedV_L.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Bottom edges, coil on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve closed (vertical, coil left)" |
| `Valve_Gas_Solenoid_ClosedV_R.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Bottom edges, coil on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve closed (vertical, coil right)" |
| `Valve_Gas_Solenoid_OpenH.svg` | Skynet solenoid gas valve, open (red dot and a bolt on the coil; brass body, black coil with a flame), horizontal: pipe ends at the middle of the Left and Ri... | viewBox 0 0 140 120 (140x120) | On/Off picture list "Solenoid gas valve open (horizontal)" |
| `Valve_Gas_Solenoid_OpenV_L.svg` | Skynet solenoid gas valve, open (red dot and a bolt on the coil; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Botto... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve open (vertical, coil left)" |
| `Valve_Gas_Solenoid_OpenV_R.svg` | Skynet solenoid gas valve, open (red dot and a bolt on the coil; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Botto... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve open (vertical, coil right)" |
| `Valve_Manual_Butterfly_ClosedH.svg` | Skynet manual butterfly valve, closed (handle across the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Manual butterfly valve closed (horizontal)" |
| `Valve_Manual_Butterfly_ClosedV_L.svg` | Skynet manual butterfly valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve closed (vertical, handle left)" |
| `Valve_Manual_Butterfly_ClosedV_R.svg` | Skynet manual butterfly valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve closed (vertical, handle right)" |
| `Valve_Manual_Butterfly_OpenH.svg` | Skynet manual butterfly valve, open (handle along the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | Fitting Template Butterfly_Valve_1in; On/Off picture list "Manual butterfly valve open (horizontal)"; Skynet Bundled Fitting picture choice |
| `Valve_Manual_Butterfly_OpenV_L.svg` | Skynet manual butterfly valve, open (handle along the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve open (vertical, handle left)" |
| `Valve_Manual_Butterfly_OpenV_R.svg` | Skynet manual butterfly valve, open (handle along the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve open (vertical, handle right)" |
| `Valve_Manual_ClosedH.svg` | Skynet manual ball valve, closed (handle across the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Manual ball valve closed (horizontal)" |
| `Valve_Manual_ClosedV_L.svg` | Skynet manual ball valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual ball valve closed (vertical, handle left)" |
| `Valve_Manual_ClosedV_R.svg` | Skynet manual ball valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual ball valve closed (vertical, handle right)" |
| `Valve_Manual_OpenH.svg` | Skynet manual ball valve, open (handle along the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Manual ball valve open (horizontal)"; Skynet Bundled Fitting picture choice |
| `Valve_Manual_OpenV_L.svg` | Skynet manual ball valve, open (handle along the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual ball valve open (vertical, handle left)" |
| `Valve_Manual_OpenV_R.svg` | Skynet manual ball valve, open (handle along the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual ball valve open (vertical, handle right)" |
| `Valve_Motor_Ball_ClosedH.svg` | Skynet motorized ball valve, closed, horizontal: pipe ends at the middle of the Left and Right edges; the ring means closed | viewBox 0 0 140 120 (140x120) | On/Off picture list "Motorized ball valve closed (horizontal)"; Proportional valve preset |
| `Valve_Motor_Ball_ClosedV_LC.svg` | Skynet motorized ball valve, closed, vertical, motor on the left: pipe ends at the middle of the Top and Bottom edges | viewBox 0 0 120 140 (120x140) | On/Off picture list "Motorized ball valve closed (vertical, motor left)" |
| `Valve_Motor_Ball_ClosedV_RC.svg` | Skynet motorized ball valve, closed, vertical, motor on the right: pipe ends at the middle of the Top and Bottom edges | viewBox 0 0 120 140 (120x140) | On/Off picture list "Motorized ball valve closed (vertical, motor right)"; Valve Profile default |
| `Valve_Motor_Ball_OpenH.svg` | Skynet motorized ball valve, open, horizontal: pipe ends at the middle of the Left and Right edges; the red bolts mean open | viewBox 0 0 140 120 (140x120) | On/Off picture list "Motorized ball valve open (horizontal)"; Proportional valve preset; Skynet Bundled Fitting picture choice |
| `Valve_Motor_Ball_OpenV_LC.svg` | Skynet motorized ball valve, open, vertical, motor on the left: pipe ends at the middle of the Top and Bottom edges | viewBox 0 0 120 140 (120x140) | On/Off picture list "Motorized ball valve open (vertical, motor left)"; Skynet Bundled Fitting picture choice |
| `Valve_Motor_Ball_OpenV_RC.svg` | Skynet motorized ball valve, open, vertical, motor on the right: pipe ends at the middle of the Top and Bottom edges | viewBox 0 0 120 140 (120x140) | On/Off picture list "Motorized ball valve open (vertical, motor right)"; Skynet Bundled Fitting picture choice; Valve Profile default |

## Vessels

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Skynet_BasicElectricBrewKettle.svg` | Skynet basic electric brew kettle, an Integrated Device (Fritz's drawing BasicElectricBrewKettle, 2026-10-23): the base of every Skynet Integrated Electric K... | viewBox 0 0 196 256 (196x256) | Integrated Device Template Integrated_Electric_Kettle_Basic; Basic electric kettle Integrated Device |
| `Skynet_Brew_Vessel_Big_Mac_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_Big_Mac_Widget" (Fritz, 2026-10-23, "Big Mac"): 26.7 in wide, 28.7 in tall (10 units = 1 in). Ports, their heights measured... | viewBox -10 0 316 316 (316x316) | Vessel/Equipment Template Brew_Vessel_Big_Mac_Widget |
| `Skynet_Brew_Vessel_Low_NPT_Output_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_Low_NPT_Output_Widget" (Fritz, 2026-10-23): a clone of Brew_Vessel_Low_TC_Output_Widget with a 1/2 in NPT Female Outlet at ... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_Low_NPT_Output_Widget |
| `Skynet_Brew_Vessel_Low_TC_Output_Widget.svg` | Skynet Vessel Widget "Brew Vessel Low TC Output Widget" (Fritz, 2026-10-23): the Generic Brew Vessel with a TC 1.5 port at Center Bottom 1 in (port center 1 ... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_Low_TC_Output_Widget |
| `Skynet_Brew_Vessel_NPT_Temperature_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_NPT_Temperature_Widget" (Fritz, 2026-10-23): a clone of Brew_Vessel_TC_Temperature_Widget with a 1/2 in NPT Female Outlet a... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_NPT_Temperature_Widget |
| `Skynet_Brew_Vessel_TC_Temperature_Tangential_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_TC_Temperature_Tangential_Widget" (Fritz, 2026-10-23): Brew Vessel TC Temperature + a TC 1.5 Tangential inlet, drawn face-o... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_TC_Temperature_Tangential_Widget |
| `Skynet_Brew_Vessel_TC_Temperature_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_TC_Temperature_Widget" (Fritz, 2026-10-23): Brew Vessel Low TC Output + a TC 1.5 Thermowell at Center 5 in (center 5 in abo... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_TC_Temperature_Widget |
| `Skynet_Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget.svg` | Skynet Vessel Widget "Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget" (Fritz, 2026-10-23): Brew Vessel TC Temperature Tangential (Tangential face-o... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Brew_Vessel_TC_Thermowell_Tangential_Element_Port_Widget |
| `Skynet_Generic_Brew_Vessel_Widget.svg` | Skynet Vessel Widget "Generic Brew Vessel Widget" (Fritz, 2026-10-23): a plain kettle with no ports, drawn like his BasicElectricBrewKettle. No text: the Dis... | viewBox -20 0 236 256 (236x256) | Vessel/Equipment Template Generic_Brew_Vessel_Widget |
| `Vessel_Brewzilla.svg` | Skynet Brewzilla (from Fritz's Brewzilla): all-in-one electric kettle with a domed lid, its recirculation arm and valve up the left side, its control panel a... | viewBox 0 0 286 556 (286x556) | Vessel/Equipment Template Kettle_Brewzilla_Electric |
| `Vessel_DigiBoil.svg` | Skynet DigiBoil (from Fritz's Digiboil): all-in-one electric kettle with a domed lid, its control panel and power light on the front, and its tap at the midd... | viewBox 0 0 260 500 (260x500) | Vessel/Equipment Template Kettle_DigiBoil_Electric |
| `Vessel_Foundry.svg` | Skynet wide all-in-one (Foundry style): stainless body with a black lid, two side handles, the control panel on the front near the top, and its drain valve o... | viewBox 0 0 300 380 (300x380) | Vessel/Equipment Template Kettle_Foundry_Electric |
| `Vessel_Grainfather.svg` | Skynet tall all-in-one (Grainfather style): stainless body, glass lid, black base with its control panel, the pump recirculation arm up the right side and ov... | viewBox 0 0 260 500 (260x500) | Vessel/Equipment Template Kettle_Grainfather_Electric |
| `Vessel_Kettle_Basic.svg` | Skynet basic brew kettle (from Fritz's BasicBrewKettle_1_outlet_Tangental_Thermowell): lid on top, tangential inlet low on the Left edge, thermowell (upper) ... | viewBox 0 0 200 266 (200x266) | Vessel/Equipment Template Kettle_Basic; Vessel/Equipment Template Kettle_Basic_Electric |
| `Vessel_Kettle_BigFatty.svg` | Skynet Big Fatty kettle (from Fritz's BigFatty_Tangental): wide and short, lid on top, tangential inlet low on the Left edge, one drain on the front near the... | viewBox 0 0 280 278 (280x278) | Vessel/Equipment Template Kettle_Big_Fatty; Vessel/Equipment Template Kettle_Big_Fatty_Electric |
| `Vessel_Kettle_BigFatty_TwoDrains.svg` | Skynet Big Fatty kettle with two drains (from Fritz's BigFatty_Tangental): wide and short, lid on top, tangential inlet low on the Left edge, two drains on t... | viewBox 0 0 280 278 (280x278) | not used by anything yet (in the picture list only) |
| `Vessel_Kettle_BottomDrain.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_1): lid on top, drain at the middle of the Bottom edge. No text: the Display Name shows below it. | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Bottom_Drain; Vessel/Equipment Template Kettle_Bottom_Drain_Electric |
| `Vessel_Kettle_BottomDrain_Side.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_2): lid on top, drain at the middle of the Bottom edge, side port low on the Left edge. No text:... | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Bottom_Drain_2; Vessel/Equipment Template Kettle_Bottom_Drain_2_Electric |
| `Vessel_Kettle_BottomDrain_Side_SteamSlayer.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_Tangental_Steam_Slayer): lid on top, drain at the middle of the Bottom edge, tangential inlet lo... | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Tangential_Steam_Slayer; Vessel/Equipment Template Kettle_Tangential_Steam_Slayer_Electric |
| `Vessel_Kettle_Tall.svg` | Skynet tall kettle (from Fritz's Kettle_Outlet_Thermowell_Tangental): lid on top, tangential inlet low on the Left edge, thermowell (upper) and outlet (lower... | viewBox 0 0 200 336 (200x336) | Vessel/Equipment Template Kettle_Tall; Vessel/Equipment Template Kettle_Tall_Electric |
| `boil_kettle.svg` | Older generic boil kettle drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Brew_Kettle |
| `brewzilla.svg` | Older Brewzilla drawing (replaced by Vessel_Brewzilla.svg). | viewBox 0 0 240 340 (240x340) | not used by anything yet (in the picture list only) |
| `digiboil.svg` | Older DigiBoil drawing (replaced by Vessel_DigiBoil.svg). | viewBox 0 0 220 300 (220x300) | not used by anything yet (in the picture list only) |
| `hlt.svg` | Older generic HLT drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template HLT |
| `kettle.svg` | Older generic kettle drawing; also the fallback icon for a Template with no picture. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Brew_Kettle; Vessel/Equipment Template Fermenter; fallback Template icon |
| `mash_tun.svg` | Older generic mash tun drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Mash_Tun |
| `vessel_gray.svg` | A plain gray tank (Fritz, 2026-10-21): no text on it. The vessel's Display Name is its only text. | viewBox 0 0 260 320 (260x320) | Equipment Widget "Vessel" |

## Not in the library

- `install/icon.png` (the app icon) is not a Skynet picture group image, so it is left out.
- Unmerged previews in `reviews/screenshots/` (for example `vessel_widgets`) are left out until Fritz says otherwise.
- Empty user folders `media/Images/<group>/` hold the user's own pictures, not Skynet ones.
