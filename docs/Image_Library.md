# Skynet Image Library

Every picture Skynet ships, so we can look them up when we talk about images. **This GitHub copy is the main copy (Rule 13.7).** Source: oakbarn/Skynet_Brewery, default branch `claude/project-thread-vzxi0a`, folder `media/Images/Skynet/<group>/`, as of version PR107_Skynet-v.20261026_23_23 (2026-10-26).

The older copy in the project folder (`/mnt/project-files/Image_Library/`, last updated 2026-10-31) is out of date: its 19 extra rows are pictures retired on 2026-11-05. Use this one.

**In the GitHub repo**, the pictures themselves are in [media/Images/Skynet](../media/Images/Skynet/) (one folder per group). Tap a group folder, then a file, to see the picture.

**Rule (Fritz, 2026-10-27): new images are never added here automatically.** A new image goes in only when Fritz says to commit it.

**2026-11-05 (Fritz):** the old pipe_ fittings, Skynet_TC15_InstrumentTee, the Valve_Ball PNGs and every Open valve picture were retired to the repo's Delete/ folder and taken off this list (see Delete/README.md and Help 129); Valve_Ball_ClosedH_1 / ClosedV-1x1 are renamed Motorized_TC15_Ball_Valve_Horizontal / _Vertical. The project-folder copies in Image_Library/ are not changed.

**2026-11-17 (OakBarn Brewery, "any Copywrite images need to be removed from the Public github regardless"):** every Skynet picture in the repo now has a row here (116 were missing). Pictures that might be copyrighted were taken out of the repo and replaced by Skynet drawings; see [Removed for copyright](#removed-for-copyright-2026-11-17) at the end.

**Totals (2026-11-20):** 205 Skynet pictures in 10 groups (the Motors group is empty), plus the Help pictures and program icons listed at the end.

Notes: "viewBox" is the drawing's own size in SVG units (it scales to any size on screen). PNG sizes are pixels. Where a PNG and an SVG share a name, the PNG is the original and the SVG is either a hand redraw ("Skynet drawing") or a panel auto-trace. "Pump_Whute_Rip_On" is the original file name, typo included.

## Groups

- [Alarms](#alarms) (13)
- [Chillers](#chillers) (5)
- [Hop_Infusion](#hop_infusion) (1)
- [Lights_LEDs](#lights_leds) (5)
- [Miscellaneous](#miscellaneous) (12)
- [On_Off](#on_off) (7)
- [Other_Equipment](#other_equipment) (53)
- [Pumps](#pumps) (56)
- [Valves](#valves) (26)
- [Vessels](#vessels) (28)

## Alarms

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Alarm_Active_Red.svg` | Skynet Alarm Active overlay (Layer 1): red sound waves and bell outline while the alarm sounds. 600 x 600, see-through. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Basic.svg` | Skynet Basic Alarm (Fritz, 2026-11-02). 600 x 600. Together: Back (Layer 4) and Fore (Layer 3) with the black lines. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Basic_Back.svg` | Skynet Basic Alarm (Fritz, 2026-11-02). 600 x 600. Back only (Layer 4): the panel colors it with .back. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Basic_Fore.svg` | Skynet Basic Alarm (Fritz, 2026-11-02). 600 x 600. Fore only (Layer 3): the panel colors it with .fore. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Basic_Lines.svg` | Skynet Basic Alarm (Fritz, 2026-11-02). 600 x 600. The black lines over Layer 3 (never colored). | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Hop.svg` | Skynet Alarm Hop (original line drawing, 2026-11-17; Bell = Hop): a bell in two colors only, no black lines. 600 x 600. Together: Back (Layer 4) and Fore (Layer 3). Different Back and Fore colors make the Bitter, Flavor and Aroma Hop alarms. | viewBox 0 0 600 600 (600x600) | Panel code (app.js); Help 107 |
| `Alarm_Hop_Back.svg` | Skynet Alarm Hop. 600 x 600. Back only (Layer 4): the panel colors it with .back. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_Hop_Fore.svg` | Skynet Alarm Hop. 600 x 600. Fore only (Layer 3): the panel colors it with .fore. | viewBox 0 0 600 600 (600x600) | Panel code (app.js) |
| `Alarm_PreHop_Mark_1.svg` | Skynet Pre-Hop Alarm watermark 1 (Rule 7.21): a pale hop cone. Placeholder drawing, see-through. | viewBox 0 0 600 300 (600x300) | Panel code (store.js) |
| `Alarm_PreHop_Mark_2.svg` | Skynet Pre-Hop Alarm watermark 2 (Rule 7.21): a pale clock, the time before the hop drop. Placeholder drawing, see-through. | viewBox 0 0 600 300 (600x300) | Panel code (store.js) |
| `Alarm_PreHop_Mark_3.svg` | Skynet Pre-Hop Alarm watermark 3 (Rule 7.21): a pale bell. Placeholder drawing, see-through. | viewBox 0 0 600 300 (600x300) | Panel code (store.js) |
| `Alarm_Set_Hop.svg` | Skynet Alarm Set Graphic (Layer 2): a hop cone inside the Basic Alarm bell. 600 x 600, see-through. | viewBox 0 0 600 600 (600x600) | Panel code (app.js); Help 172, 195 |
| `Alarm_Set_Hop_Cone.svg` | Skynet Alarm Set Graphic (Layer 2) for the Hop bell: a detailed original line-art hop cone in fixed greens; see-through outside the hop. 600 x 600. | viewBox 0 0 600 600 (600x600) | Hop alarm in the 3 Vessel sample; Help 107 |

## Chillers

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Chiller_Counterflow.svg` | Skynet counterflow chiller (redrawn from Fritz's CounterFlow_1 photo): a copper coil with Wort In at the Top Left, Water Out at the Top Right, Water In at th... | viewBox 0 0 240 280 (240x280) | Vessel/Equipment Template Counterflow_Chiller |
| `Chiller_Counterflow_Small.svg` | Skynet small counterflow chiller (redrawn from Fritz's CounterFlow_2 photo): a shorter copper coil with Wort In at the Top Left, Water Out at the Top Right, ... | viewBox 0 0 240 200 (240x200) | Vessel/Equipment Template Counterflow_Chiller_Small |
| `chill_coil.svg` | Coiled immersion chiller. | viewBox 0 0 180 180 (180x180) | Vessel/Equipment Template Immersion_Chiller; Equipment Widget "Chilling coil" |
| `plate_chiller.svg` | Brazed plate chiller, four ports at the corners. | viewBox 0 0 110 200 (110x200) | Vessel/Equipment Template Plate_Chiller; Equipment Widget "Plate chiller" |
| `Chiller_Copper_Counterflow.svg` | Skynet Copper Counterflow Chiller (redrawn as plain SVG from Fritz's Copper_CounterFlow.svg, 2026-11-02): a copper coil of 8 turns. The 4 ports all face left... | viewBox 0 0 225 245 (225x245) | Template vessel Copper_Counterflow_Chiller; Panel code (app.js); Help 109 |

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
| `Skynet_Brewery_Main.svg` | Skynet drawing (OakBarn Brewery, 2026-11-17): a three vessel brewery (HLT, Mash Tun, Boil Kettle) with a pump, a counterflow chiller and a fermentor, joined... | viewBox 0 0 1536 1000 (1536x1000) | Panel code (gkinds.js); Help 07, 108, 194 |
| `Skynet_Icon_Clock.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Fan.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Gauge.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Kettle.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Liquid_Level.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Liquid_Temp.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_On_Off.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_PID.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_Pump.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Icon_PWM.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |
| `Skynet_Audio_Songs.svg` | Skynet Audio folder Songs (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): a blue music note. Background 250 250 250. Skynet Picture number 243. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Songs (or Patron/Songs) (Rule 7.27) |
| `Skynet_Audio_Text_to_voice.svg` | Skynet Audio folder Text_to_voice (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): a man shouting with his hands cupped round his mouth. Background 250 250 250. Skynet Picture number 244. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Text_to_voice (or Patron/Text_to_voice) (Rule 7.27) |
| `Skynet_Audio_Fanfare.svg` | Skynet Audio folder Fanfare (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): a brass bugle with notes coming out of the bell. Background 250 250 250. Skynet Picture number 240. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Fanfare (or Patron/Fanfare) (Rule 7.27) |
| `Skynet_Audio_Beep.svg` | Skynet Audio folder Beep (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): a purple cartoon desert bird running past cactus, with a "Beep! Beep!" speech bubble (its own bird, no resemblance to any cartoon). Background 250 250 250. Skynet Picture number 239. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Beep (or Patron/Beep) (Rule 7.27) |
| `Skynet_Audio_Nature.svg` | Skynet Audio folder Nature (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): a Japanese koi pond with an arched bridge, trees and a stone lantern. Background 250 250 250. Skynet Picture number 242. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Nature (or Patron/Nature) (Rule 7.27) |
| `Skynet_Audio_Go_to_work.svg` | Skynet Audio folder Go_to_work (OakBarn Brewery, 2026-11-23, Panel Update 10: "These are for the media catergorys"; replaces the Panel Update 9 line drawing): five bearded brewers marching off to work in Texas brush, pencil drawing. Background 250 250 250. Skynet Picture number 241. MIT License Granted. Copyright (c) OakBarn Brewery 2026. OakBarn Brewery's own picture (Adobe Firefly), kept inside the .svg as a JPEG. | viewBox 0 0 300 300 (300x300) | An Audio Widget with no picture of its own whose sound is in sounds/Skynet/Go_to_work (or Patron/Go_to_work) (Rule 7.27) |
| `Skynet_Icon_Valve.svg` | MIT License Granted. Copyright (c) OakBarn Brewery 2026. Drawn new for Skynet. | viewBox 0 0 160 128 (160x128) | not used by anything yet (in the picture list only) |

## On_Off

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Overlay_Bolt_Center.svg` | On overlay: a big half see-through lightning bolt over the middle of the picture | viewBox 0 0 100 100 (100x100) | On overlay "Lightning bolt (big, see-through)" |
| `Overlay_Bolt_Corner.svg` | On overlay: a lightning bolt badge in the top right corner, the rest is see-through | viewBox 0 0 100 100 (100x100) | On overlay "Lightning bolt (corner badge)" |
| `Overlay_Glow_Ring.svg` | On overlay: a green glow around the picture | viewBox 0 0 100 100 (100x100) | On overlay "Green glow ring" |
| `Overlay_Bolt.svg` | On overlay (Fritz, 2026-11-04): a red lightning bolt with a yellow edge over the middle of a valve or pump while it is on (steady, not flashing) | viewBox 0 0 100 100 (100x100) | Template device Skynet_Motorized_Butterfly_Valve_H; Template device Skynet_KLD20T_Proportional_Valve_H; Template device Skynet_Motorized_Ball_Valve_H; default Schema; sample three-vessel-one-pump; Panel code (app.js, eqinterview.js, profiles.js, schemabuild.js, store.js); Help 121, 193 |
| `Overlay_Bolt_Flash.svg` | On overlay (Fritz, 2026-11-04): a lightning bolt over the middle of a valve or pump that flashes red and yellow while it is on | viewBox 0 0 100 100 (100x100) | Panel code (app.js, store.js); Help 121 |
| `Skynet_Emergency_Off.svg` | Emergency Off (OakBarn Brewery, 2026-11-20, Panel Update 8: "fashioned after a real world graphic"; "Add it"): Skynet's own drawing of a red mushroom head on a yellow round plate, no words (Rule 7.25). Skynet Picture number 238 | viewBox 0 0 200 200 (200x200) | The Emergency Off button in the top bar (index.html draws the same picture inline); Rule 6.41, Help 244 |
| `Overlay_Manual_Valve_Open.svg` | Skynet On overlay for a Manual Valve Widget while it is open (Fritz, 2026-10-28): a green ring and a green open mark | viewBox 0 0 100 100 (100x100) | Panel code (app.js); Help 87 |

## Other_Equipment

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `BigMacRElementOff.svg` | BigMac heating element, off (grey), mounting flange on the right. Same size as BigMacRElementOff.png. | viewBox 0 0 51 24 (51x24) | not used yet |
| `BigMacRElementOn.svg` | BigMac heating element, on (red), mounting flange on the right. A copy of BigMacRElementOff.svg with the element red. Same size as BigMacRElementOn.png. | viewBox 0 0 51 24 (51x24) | not used yet |
| `Burner No Flame.svg` | cast-iron jet burner with brass jets, no flame. Same size as Burner No Flame.png. | viewBox 0 0 400 400 (400x400) | not used yet |
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
| `Skynet_TC15_Thermowell_Long.svg` | Skynet TC 1.5 inch long thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 320 100 (320x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC15_Thermowell_Medium.svg` | Skynet TC 1.5 inch medium thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 230 100 (230x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC15_Thermowell_Short.svg` | Skynet TC 1.5 inch short thermowell (after Fritz's drawing): the TC cap on the left, the well (purple) reaching right | viewBox 0 0 150 100 (150x100) | Thermowell Device (Short/Medium/Long) |
| `Skynet_TC1_2_Rims_Device.svg` | Skynet RIMS tube, an Integrated Device (Fritz's drawing, 2026-10-23): wort in at the top left and out at the bottom (TC fittings with their IPs built in), th... | viewBox 0 0 413 58 (413x58) | Integrated Device Template RIMS_Tube |
| `herms_coil.svg` | HERMS coil. | viewBox 0 0 180 180 (180x180) | Vessel/Equipment Template HERMS_Coil; Equipment Widget "HERMS coil" |
| `trub_filter.svg` | Trub / hop filter canister. | viewBox 0 0 100 170 (100x170) | Vessel/Equipment Template Trub_Filter; Equipment Widget "Trub filter" |
| `Burner_Jet_Flame.svg` | Skynet drawing (OakBarn Brewery, 2026-11-17): cast-iron jet burner with brass jets, lit: a blue flame on every jet. The lit partner of Burner No Flame.svg, s... | viewBox 0 0 400 400 (400x400) | not used by anything yet (in the picture list only) |
| `Ceramic_Heat_Emitter_Off.svg` | Skynet drawing: ceramic heat emitter (a heat bulb with no light) in a screw base, off. See-through background. | viewBox 0 0 40 56 (40x56) | Panel code (app.js) |
| `Ceramic_Heat_Emitter_On.svg` | Skynet drawing: ceramic heat emitter (a heat bulb with no light) in a screw base, on: glowing hot. See-through background. | viewBox 0 0 40 56 (40x56) | Panel code (app.js) |
| `Heat_Mat_Off.svg` | Skynet drawing: heat mat (pad) for a fermentor, off. See-through background. | viewBox 0 0 64 40 (64x40) | Panel code (app.js) |
| `Heat_Mat_On.svg` | Skynet drawing: heat mat (pad) for a fermentor, on: its heating wire glows. See-through background. | viewBox 0 0 64 40 (64x40) | Panel code (app.js) |
| `Heat_Wrap_Off.svg` | Skynet drawing: heat wrap (Fermwrap style band) around a fermentor, off. See-through background. | viewBox 0 0 64 40 (64x40) | Panel code (app.js) |
| `Heat_Wrap_On.svg` | Skynet drawing: heat wrap (Fermwrap style band) around a fermentor, on: its heating wire glows. See-through background. | viewBox 0 0 64 40 (64x40) | Panel code (app.js) |
| `Skynet_TC15_Cross.svg` | Skynet TC 1.5 cross (2026-11-04, in the style of Fritz's new Tee): IPs at the center of each ferrule face, left (0, 0.5), right (1, 0.5), top (0.5, 0) and bo... | viewBox 0 0 134 134 (134x134) | Template fitting Cross; Panel code (app.js); Help 129 |
| `Skynet_TC15_Elbow_45.svg` | Skynet TC 1.5 45 degree elbow (2026-11-04, in the style of Fritz's new 90 elbow): IPs at the center of each ferrule face, bottom left (0.194,0.756) and right... | viewBox 0 0 107.15 85.15 (107.15x85.15) | Template fitting Elbow_45; Panel code (app.js); Help 129 |
| `Skynet_TC15_Elbow_90.svg` | Skynet TC 1.5 90 degree elbow (Fritz's drawing, 2026-11-04): IPs at the center of each ferrule face, bottom (0.29, 1) and right (1, 0.29) | viewBox 0 0 100 100 (100x100) | Template fitting Valve_Tee_Thermowell_90; Template fitting Elbow_90; Template fitting Valve_90; default Schema; sample three-vessel-one-pump; Panel code (app.js); Help 129 |
| `Skynet_TC15_Elbow_Front.svg` | Skynet TC 1.5 90 degree elbow seen from the front: one end faces you, one goes down (Fritz's drawing, 2026-11-02). IPs at the center of the front opening (0.... | viewBox 0 0 80 110 (80x110) | Template fitting Elbow_Front; Panel code (app.js) |
| `Skynet_TC15_Instrument_Tee.svg` | Skynet TC 1.5 instrument tee (2026-11-04, in the style of Fritz's new Tee): a short branch. IPs at the center of each ferrule face, left (0, 0.318), right (1... | viewBox 0 0 210 91.2 (210x91.2) | Template fitting Instrument_Tee; Panel code (app.js); Help 129 |
| `Skynet_TC15_Instrument_Tee_Probe_Branch.svg` | Skynet Instrument Tee with a Temperature Probe (purple) in the branch (2026-11-04): a Temperature Device. The probe fills the branch, so the IPs are left (0,... | viewBox 0 0 210 91.2 (210x91.2) | Panel code (app.js) |
| `Skynet_TC15_Instrument_Tee_Probe_Run.svg` | Skynet Instrument Tee with a Temperature Probe (purple) in from the left (2026-11-04): a Temperature Device. The probe fills the left end, so the IPs are rig... | viewBox 0 0 210 91.2 (210x91.2) | Panel code (app.js) |
| `Skynet_TC15_Long_Tee.svg` | Skynet TC 1.5 tee (Fritz's drawing, 2026-11-04): IPs at the center of each ferrule face, left (0, 0.216), right (1, 0.216), branch (0.5, 1) | viewBox 0 0 210 134 (210x134) | Template fitting Tee; default Schema; sample three-vessel-one-pump; Panel code (app.js); Help 129 |
| `Skynet_TC15_Long_Tee_Probe_Branch.svg` | Skynet Long Tee with a Temperature Probe (purple) in the branch (Fritz's drawing, 2026-11-04): a Temperature Device. The probe fills the branch, so the IPs a... | viewBox 0 0 210 134 (210x134) | Panel code (app.js) |
| `Skynet_TC15_Long_Tee_Probe_Run.svg` | Skynet Long Tee with a Temperature Probe (purple) in from the left (2026-11-04): a Temperature Device. The probe fills the left end, so the IPs are right (1,... | viewBox 0 0 210 134 (210x134) | Panel code (app.js) |
| `Skynet_TC15_Priming_Tee.svg` | Skynet TC 1.5 Priming Tee (OakBarn Brewery, 2026-11-09: "Basically an Instrument Tee with a Manual Valve on the Short side always pointing up (on the Top sid... | viewBox 0 0 210 160 (210x160) | Template fitting Priming_Tee |
| `Skynet_TC15_Sight_Glass.svg` | Skynet TC 1.5 sight glass, 6 in (Rule 5.32). On a Tab the picture is drawn for its Length: only the glass stretch. IPs at the center of each ferrule face, le... | viewBox 0 0 169.2 58 (169.2x58) | Template fitting Sight_Glass |
| `Skynet_TC15_Sight_Glass_Caged.svg` | Skynet TC 1.5 caged sight glass, 6 in (Rule 5.32). On a Tab the picture is drawn for its Length: only the glass and cage stretch. IPs at the center of each f... | viewBox 0 0 169.2 58 (169.2x58) | Template fitting Sight_Glass_Caged |
| `Skynet_TC15_Supply_Manifold_2.svg` | Skynet TC 1.5 Supply Manifold, 2 Long Tees joined end to end (Fritz, 2026-11-06, Rule 5.35). Each tee is Fritz's Long Tee (210 x 134). The valve on each bran... | viewBox 0 0 420 344 (420x344) | Template fitting Supply_Manifold_2; Help 146 |
| `Skynet_TC15_Supply_Manifold_3.svg` | Skynet TC 1.5 Supply Manifold, 3 Long Tees joined end to end (Fritz, 2026-11-06, Rule 5.35). Each tee is Fritz's Long Tee (210 x 134). The valve on each bran... | viewBox 0 0 630 344 (630x344) | Template fitting Supply_Manifold_3 |
| `Skynet_TC15_Thermowell_Front.svg` | Skynet TC 1.5 thermowell seen from the front (2026-11-05, Rule 5.30): on a front facing IP. The TC cap face-on (flange, gasket groove, as the face-on ports o... | viewBox 0 0 40 40 (40x40) | Panel code (app.js) |
| `Skynet_TC15_Valve_Tee.svg` | Skynet TC 1.5 Long Tee with a Valve (Fritz, 2026-11-06, Rule 5.35). Each tee is Fritz's Long Tee (210 x 134). The valve on each branch is drawn by the panel... | viewBox 0 0 210 344 (210x344) | Template fitting Valve_Tee |
| `Skynet_TC2_1_Reducer_Concentric.svg` | Skynet TC 2 to 1 concentric reducer (Fritz's drawing 2_1__Reducer, 2026-11-02): IPs at the center of each ferrule face, big end (0, 0.5), small end (1, 0.5) | viewBox 0 0 120 84 (120x84) | Template fitting Reducer; Template fitting Reducer_2_1_Concentric; Panel code (app.js) |
| `Skynet_TC2_1_Reducer_Eccentric.svg` | Skynet TC 2 to 1 eccentric reducer, flat along the bottom (Fritz's drawing 2_1_Concentric, 2026-11-02): IPs at the center of each ferrule face, big end (0, 0... | viewBox 0 0 120 84 (120x84) | Template fitting Reducer_2_1_Eccentric; Panel code (app.js) |
| `Skynet_TC2_1_Reducer_Front.svg` | Skynet TC 2 to 1 reducer seen from the front, looking down the pipe (Fritz's drawing, 2026-11-02): both IPs at the center of the opening (0.5, 0.5) | viewBox 0 0 100 100 (100x100) | Template fitting Reducer_2_1_Front; Panel code (app.js) |
| `Skynet_Float_NC_Closed.svg` | Skynet float switch, Normally Closed (OakBarn Brewery's own drawing, 2026-11-20, redrawn as SVG): water low, the float hangs and its bar rests on the contacts, closed (red). | viewBox 0 0 640 500 (640x500) | not used yet |
| `Skynet_Float_NC_Open.svg` | Skynet float switch, Normally Closed (OakBarn Brewery's own drawing, 2026-11-20, redrawn as SVG): the water lifts the float and its bar off the contacts, open (black). | viewBox 0 0 640 500 (640x500) | not used yet |
| `Skynet_Float_NO_Closed.svg` | Skynet float switch, Normally Open (OakBarn Brewery's own drawing, 2026-11-20, redrawn as SVG): the water lifts the float and its bar closes the contacts (red). Picture when on (float made). | viewBox 0 0 640 500 (640x500) | Water float BM_32 and the Use FireHose Float / Use Manifold Float Process Widgets on the Water Tab (default Schema; sample three-vessel-one-pump); Help 173 |
| `Skynet_Float_NO_Open.svg` | Skynet float switch, Normally Open (OakBarn Brewery's own drawing, 2026-11-20, redrawn as SVG): water low, the float hangs, contacts apart (black). Picture when off (float dry). | viewBox 0 0 640 500 (640x500) | Water float BM_32 and the Use FireHose Float / Use Manifold Float Process Widgets on the Water Tab (default Schema; sample three-vessel-one-pump); Help 173 |

## Pumps

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Pump_Sump_Off.svg` | Skynet submersible sump pump, off (a generic drawing): it sits in the water and draws in through the screen at the Bottom; the outlet is at the top right. Gr... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Submersible sump pump off" |
| `Pump_Sump_On.svg` | Skynet submersible sump pump, on (a generic drawing): it sits in the water and draws in through the screen at the Bottom; the outlet is at the top right. Gre... | viewBox 0 0 120 140 (120x140) | On/Off picture list "Submersible sump pump on" |
| `Pump_Chugger_Poly_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_Poly_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_90_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_90_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_SS_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_KegLand_MKII_Poly_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_KegLand_MKII_Poly_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_KegLand_MKII_SS_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_KegLand_MKII_SS_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_90_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_90_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_Poly_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_SS_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_SS_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_SS_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_809_SS_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_90_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_90_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_Poly_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_SS_90_Inlet_Motor_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_SS_90_Inlet_Motor_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_SS_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_March_815_SS_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Riptide_SS_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Riptide_SS_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Topsflo_TD5_Poly_Center_Inlet_Cover.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Topsflo_TD5_Poly_Center_Inlet_Cover_Shape.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... (in Pumps/Covers/) | viewBox 0 0 300 300 (300x300) | pump Cover: drawn when its pump has a Cover (Covers/<pump>_Cover.svg, filled through _Cover_Shape.svg) |
| `Pump_Chugger_Poly_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_Chugger_SS_90_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_Chugger_SS_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_Chugger_SS_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_KegLand_MKII_Poly_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_KegLand_MKII_SS_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_809_Poly_90_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_809_Poly_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_809_Poly_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_809_SS_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_809_SS_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js); Help 25 |
| `Pump_March_815_Poly_90_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_815_Poly_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_815_Poly_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_815_SS_90_Inlet_Motor.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_March_815_SS_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |
| `Pump_Riptide_SS_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | default Schema; sample three-vessel-one-pump; Panel code (app.js, bruimport.js, connectpage.js, eqinterview.js, pumps.js, schemabuild.js); Help 07, 12, 25, 57, 93 |
| `Pump_Topsflo_TD5_Poly_Center_Inlet.svg` | Skynet Pump Standard (Fritz, 2026-11-05, Rule 5.11): every pump drawn in the same 300 x 300 box, shown 150 x 150; inlet IP at (285, 150), outlet IP at (243,... | viewBox 0 0 300 300 (300x300) | Panel code (app.js, pumps.js) |

## Valves

| Name | What it shows | Size | Used by |
|---|---|---|---|
| `Motorized_TC15_Ball_Valve_Horizontal.svg` | Motorized TC 1.5 inch ball valve, horizontal pipe (the older BruControl drawing, renamed from Valve_Ball_ClosedH_1 by Fritz 2026-11-05). Open shows the On overlay. | viewBox 0 0 139 119 (139x119) | On/Off picture list; sample Schemas and default Schema |
| `Motorized_TC15_Ball_Valve_Vertical.svg` | Motorized TC 1.5 inch ball valve, vertical pipe (the older BruControl drawing, renamed from Valve_Ball_ClosedV-1x1 by Fritz 2026-11-05). Open shows the On overlay. | viewBox 0 0 119 141 (119x141) | On/Off picture list; sample Schemas and default Schema |
| `Motorized_TC15_Ball_Valve_Vertical_Left.svg` | Motorized TC 1.5 inch ball valve, vertical pipe, motor on the LEFT: Motorized_TC15_Ball_Valve_Vertical.svg mirrored (OakBarn Brewery, 2026-11-18: "Add it", Rule 18.43). Open shows the On overlay. | viewBox 0 0 300 300 (300x300) | Skynet Motorized Ball Valve and KLD20T Templates (Vertical Left; Vertical Right flips it); On/Off picture list |
| `Valve_Check.svg` | Skynet check valve: openings at the middle of the Left (flow in) and Right (flow out) edges. The arrow shows the only way liquid can go. | viewBox 0 0 100 100 (100x100) | Fitting Template Check_Valve; Skynet Bundled Fitting picture choice |
| `Valve_Gas_Solenoid_ClosedH.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), horizontal: pipe ends at the middle of the Left and Right edges, coil on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Solenoid gas valve closed (horizontal)" |
| `Valve_Gas_Solenoid_ClosedV_L.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Bottom edges, coil on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve closed (vertical, coil left)" |
| `Valve_Gas_Solenoid_ClosedV_R.svg` | Skynet solenoid gas valve, closed (ring; brass body, black coil with a flame), vertical: pipe ends at the middle of the Top and Bottom edges, coil on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Solenoid gas valve closed (vertical, coil right)" |
| `Valve_Manual_Butterfly_ClosedH.svg` | Skynet manual butterfly valve, closed (handle across the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Manual butterfly valve closed (horizontal)" |
| `Valve_Manual_Butterfly_ClosedV_L.svg` | Skynet manual butterfly valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the left | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve closed (vertical, handle left)" |
| `Valve_Manual_Butterfly_ClosedV_R.svg` | Skynet manual butterfly valve, closed (handle across the pipe), vertical: pipe ends at the middle of the Top and Bottom edges, handle on the right | viewBox 0 0 120 140 (120x140) | On/Off picture list "Manual butterfly valve closed (vertical, handle right)" |
| `Valve_Manual_ClosedH.svg` | Skynet manual ball valve, closed (handle across the pipe), horizontal: pipe ends at the middle of the Left and Right edges, handle on top | viewBox 0 0 140 120 (140x120) | On/Off picture list "Manual ball valve closed (horizontal)" |
| `Manual_Ball_Valve_Front_Closed.svg` | Skynet Manual Ball Valve seen from the front, looking down the pipe, closed (Fritz's drawing, 2026-11-02): a Manual Valve Widget picture, its IP in the middl... | viewBox 0 0 100 100 (100x100) | Panel code (app.js) |
| `Manual_Ball_Valve_Front_Elbow_Closed.svg` | Skynet Manual Ball Valve on a front elbow, closed (Fritz's drawing, 2026-11-02): a Manual Valve Widget picture, its IP in the middle. The handle across the p... | viewBox 0 0 100 100 (100x100) | Panel code (app.js) |
| `Manual_Ball_Valve_Side_Closed.svg` | Skynet Manual Ball Valve, side view, closed (Fritz's drawing, 2026-11-02): a Manual Valve Widget picture. The pipe runs through the middle (its one IP); the... | viewBox 0 0 100 100 (100x100) | Panel code (app.js) |
| `Quick_Disconnect.svg` | Quick Disconnect (Fritz's drawing, 2026-11-05): a bold red four-point star with a grey centre, easy to see on a Tab. It sits on a valve end (an IP); the cent... | viewBox 0 0 100 100 (100x100) | Panel code (app.js) |
| `Tap_Water_Valve_Hose_Bib.svg` | Skynet Tap Water Valve: a household brass hose bib (sill cock) with a green cross handle, like one from a home store (Fritz, 2026-11-06). A Manual Valve Widg... | viewBox 0 0 300 300 (300x300) | sample three-vessel-one-pump; Panel code (app.js, chiller.js, helpmap.js); Help 141 |
| `Valve_Motor_Ball_ClosedFront.svg` | The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve in the same 300 x 300 box, its pipe through the middle, so its IPs are always on the same spot... | viewBox 0 0 300 300 (300x300) | Template device Skynet_Motorized_Ball_Valve_Front; Panel code (app.js) |
| `Valve_Motor_Butterfly_ClosedFront.svg` | The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve in the same 300 x 300 box, its pipe through the middle, so its IPs are always on the same spot... | viewBox 0 0 300 300 (300x300) | Template device Skynet_Motorized_Butterfly_Valve_Front |
| `Valve_Motor_Butterfly_ClosedFront_Elbow.svg` | The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve in the same 300 x 300 box, its pipe through the middle, so its IPs are always on the same spot... | viewBox 0 0 300 300 (300x300) | Template device Skynet_Motorized_Butterfly_Valve_Front_Elbow |
| `Valve_Motor_Butterfly_ClosedH.svg` | The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve in the same 300 x 300 box, its pipe through the middle, so its IPs are always on the same spot... | viewBox 0 0 300 300 (300x300) | Template device Skynet_Motorized_Butterfly_Valve_H |
| `Valve_Motor_Butterfly_ClosedV_L.svg` | The Valve Standard (Fritz, 2026-11-05, Rule 5.29): every valve in the same 300 x 300 box, its pipe through the middle, so its IPs are always on the same spot... | viewBox 0 0 300 300 (300x300) | Template device Skynet_Motorized_Butterfly_Valve_H |

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
| `Vessel_Kettle_BottomDrain.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_1): lid on top, drain at the middle of the Bottom edge. No text: the Label shows below it. | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Bottom_Drain; Vessel/Equipment Template Kettle_Bottom_Drain_Electric |
| `Vessel_Kettle_BottomDrain_Side.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_2): lid on top, drain at the middle of the Bottom edge, side port low on the Left edge. No text:... | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Bottom_Drain_2; Vessel/Equipment Template Kettle_Bottom_Drain_2_Electric |
| `Vessel_Kettle_BottomDrain_Side_SteamSlayer.svg` | Skynet bottom drain kettle (from Fritz's Bottom_Drain_Kettle_Tangental_Steam_Slayer): lid on top, drain at the middle of the Bottom edge, tangential inlet lo... | viewBox 0 0 220 370 (220x370) | Vessel/Equipment Template Kettle_Tangential_Steam_Slayer; Vessel/Equipment Template Kettle_Tangential_Steam_Slayer_Electric |
| `Vessel_Kettle_Tall.svg` | Skynet tall kettle (from Fritz's Kettle_Outlet_Thermowell_Tangental): lid on top, tangential inlet low on the Left edge, thermowell (upper) and outlet (lower... | viewBox 0 0 200 336 (200x336) | Vessel/Equipment Template Kettle_Tall; Vessel/Equipment Template Kettle_Tall_Electric |
| `boil_kettle.svg` | Older generic boil kettle drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Brew_Kettle |
| `brewzilla.svg` | Older Brewzilla drawing (replaced by Vessel_Brewzilla.svg). | viewBox 0 0 240 340 (240x340) | not used by anything yet (in the picture list only) |
| `digiboil.svg` | Older DigiBoil drawing (replaced by Vessel_DigiBoil.svg). | viewBox 0 0 220 300 (220x300) | not used by anything yet (in the picture list only) |
| `hlt.svg` | Older generic HLT drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template HLT |
| `kettle.svg` | Older generic kettle drawing; also the fallback icon for a Template with no picture. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Brew_Kettle; Vessel/Equipment Template Fermenter; fallback Template icon |
| `mash_tun.svg` | Older generic mash tun drawing. | viewBox 0 0 260 320 (260x320) | Vessel/Equipment Template Mash_Tun |
| `vessel_gray.svg` | A plain gray tank (Fritz, 2026-10-21): no text on it. The vessel's Label is its only text. | viewBox 0 0 260 320 (260x320) | Equipment Widget "Vessel" |
| `Skynet_Vessel_Widget.svg` | Skynet Vessel Widget (Fritz, 2026-11-05, Rule 5.31): the tank of the Three Vessel sample (260 x 320), drawn the Skynet way (Rule 7.4: flat grey #808080, blac... | viewBox 0 0 260 320 (260x320) | Template vessel Skynet_Vessel_Widget; default Schema; sample three-vessel-one-pump; Panel code (app.js, schemabuild.js, vesselbuilder.js); Help 133 |

## Help pictures

Pictures on the Help pages and in Hover Help, in [media/help_pictures](../media/help_pictures/). OakBarn Brewery's own screenshots and drawings, or Skynet drawings.

| Name | Used by |
|---|---|
| `Clone_Hive_Cube.svg` | Help 180 |
| `IP_Marker.png` | Help 115 |
| `IP_Marker.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Instance_Own_Way.svg` | Help 180 |
| `Label_Visible_Switch.png` | Help 115 |
| `Label_Visible_Switch.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Musketeers_All_For_One.svg` | Help 180 |
| `Pump_8_IPs.png` | Help 115 |
| `Pump_8_IPs.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Pump_Cover.png` | Help 115 |
| `Pump_Cover.svg`, `Pump_Cover_Art.png` | Help 115 (2026-11-20, Rule 7.25: used in place of the PNG; its words are real text, translated) |
| `Pump_Daisy_Chain.png` | Help 115 (2026-11-17: the pump is now the Skynet pump with its Red Cover; the old photo pump is gone) |
| `Pump_Daisy_Chain.svg`, `Pump_Daisy_Chain_Art.png` | Help 115 (2026-11-20, Rule 7.25: used in place of the PNG; Skynet's words are real text, translated; the board's and SSR's printed words stay) |
| `Valve_Daisy_Chain.png`, `Valve_Daisy_Chain.svg`, `Valve_Daisy_Chain_Art.png` | Help 128 (2026-11-20, Rule 7.25: the SVG is used; its words are real text, translated) |
| `Hose_Bib_8_IPs.png`, `Hose_Bib_8_IPs.svg`, `Hose_Bib_8_IPs_Art.png` | Help 141 (2026-11-20, Rule 7.25: the SVG is used; its words are real text) |
| `Hose_Bib_IP_Spots.png`, `Hose_Bib_IP_Spots.svg`, `Hose_Bib_IP_Spots_Art.png` | Help 141 (2026-11-20, Rule 7.25: the SVG is used; its words are real text, translated) |
| `Manual_Valve_Orientation.png`, `Manual_Valve_Orientation.svg`, `Manual_Valve_Orientation_Art.png` | Help 87 (2026-11-20, Rule 7.25: the SVG is used; its words are real text) |
| `Pump_IP_Example_1.png` | Help 115 |
| `Pump_IP_Example_1.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Pump_IP_Example_2.png` | Help 115 |
| `Pump_IP_Example_2.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Pump_Overlays.png` | Help 115 |
| `Pump_Overlays.svg`, `Pump_Overlays_Art.png` | Help 115 (2026-11-20, Rule 7.25: used in place of the PNG; its words are real text, translated) |
| `Pump_Right_Left.png` | Help 115 |
| `Pump_Right_Left.svg` | not on a Help page yet (the sharp copy of the PNG, Rule 7.25) |
| `Red_Pump_Label.png` | Help 115 (2026-11-17: made from Red_Pump_Label.svg) |
| `Red_Pump_Label.svg` | Help 115 (hand-made, used in place of the PNG, Rule 7.25; 2026-11-17: redrawn with the Skynet pump and its Red Cover) |
| `Step_Add_Schema_01_Menu.png` | Help 188 |
| `Step_Add_Schema_02_Schema_Tab.png` | Help 188 |
| `Step_Add_Schema_03_Add_New_Schema.png` | Help 188 |
| `Step_Add_Schema_04_Start_From.png` | Help 188 |
| `Step_Add_Schema_05_Template.png` | Help 188 |
| `Step_Add_Schema_06_Questions.png` | Help 188 |
| `Step_Add_Schema_07_Ready.png` | Help 188 |
| `Step_Add_Schema_08_Done.png` | Help 188 (2026-11-17: taken again; the pumps are the Skynet pumps) |
| `Step_Add_Schema_09_Simulator.png` | not on a Help page yet |
| `Step_Add_Schema_10_Interface.png` | Help 188 |
| `Step_Add_Schema_11_Edit_Layout.png` | Help 188 |

## Program icons

| File | What it is |
|---|---|
| `public/favicon.svg`, `public/favicon.ico`, `install/windows/skynet.ico`, `install/icon.png` | The Skynet Panel icon (Skynet's own drawing) |
| `public/importer/importer-icon.svg`, `.ico`, `install/windows/importer.ico` | The BruControl Import icon: Google Noto Emoji, Apache License 2.0 (credit in docs/Media_Licenses.csv) |
| `public/File_Not_Found.svg` | The picture shown when a picture's file is missing (Skynet's own drawing) |

## Removed for copyright (2026-11-17)

Taken out of the public repo (OakBarn Brewery, 2026-11-17: "Every thing with a possible copywrite violation needs to be listed and changed to a Non copywrite version"). Their Skynet Picture numbers are kept, marked retired (Rule 7.22). Copies are kept privately in the project folder (`private/Removed_Copyright_Images_2026-11-17/`), not on GitHub. **They are also gone from the repo's Git history:** on 2026-11-18 (OakBarn Brewery: "ALL, and I mean any and All Copywrite material remove") every branch and tag was rewritten without them, and the 375 Releases made before the cleanup (whose downloads carried them) were deleted. The first clean Release is PR478_Skynet-v.20261118_01_24. Anyone with an older copy of the code should download it again.

| File | Was in | Why, and what replaces it |
|---|---|---|
| `brewery_main.png` | Miscellaneous | may hold pictures from the internet (OakBarn Brewery); replaced by Skynet_Brewery_Main.svg |
| `BigMacRElementOff.png` | Other_Equipment | made from a web picture; replaced by the Skynet drawing BigMacRElementOff.svg (already used) |
| `BigMacRElementOn.png` | Other_Equipment | made from a web picture; replaced by BigMacRElementOn.svg (already used) |
| `Burner No Flame.png` | Other_Equipment | a web picture modified; replaced by the Skynet drawing Burner No Flame.svg |
| `BurnerFlame.png` | Other_Equipment | a web picture modified; replaced by Burner_Jet_Flame.svg |
| `BurnerFlame.svg` | Other_Equipment | traced from BurnerFlame.png; replaced by Burner_Jet_Flame.svg |
| `Pump_Black_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Blue_Rip_Off.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Blue_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Blue_Rip_On.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Blue_Rip_On.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Green_Rip_Off.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Green_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Green_Rip_On.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Green_Rip_On.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_NoCover_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Purple_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Red_Rip_Off.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Red_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Red_Rip_On.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Red_Rip_On.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_White_Rip_Off.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_White_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Whute_Rip_On.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Whute_Rip_On.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Yellow_Rip_Off.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Yellow_Rip_Off.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Yellow_Rip_On.png` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Pump_Yellow_Rip_On.svg` | Pumps | a photo of a Blichmann Riptide pump with a painted cover (a BruControl picture); replaced by Pump_Riptide_SS_Center_Inlet.svg with a Cover of the same color |
| `Bobiverse_Bob.png` | help_pictures | a screenshot of the Fandom wiki page; replaced by Instance_Own_Way.svg |
| `Three_Musketeers.png` | help_pictures | clip art, source unknown; replaced by Musketeers_All_For_One.svg |
| `Valve_Ball_*.png` (4), `Valve_Ball_OpenH_1.svg`, `Valve_Ball_OpenV-1x1.svg`, `Pump_Red_Rip_Off_Valve_IPs_Test.svg`, help `Bobiverse_Bob.svg`, `Three_Musketeers.svg` | Delete/ folder | product photos of a motorized ball valve and traced copies of removed pictures; the Delete/ folder is public too |
| `help_pictures/Pump_Daisy_Chain.png` (old version) | Help pictures | showed the Blichmann Riptide photo pump; same file name, the pump is now the Skynet pump with its Red Cover |
| `help_pictures/Pump_Daisy_Chain.svg` (old traced copy) | Help pictures | a traced copy of the old Pump_Daisy_Chain.png (photo pump inside); 2026-11-20 replaced by a hand-made SVG with real text (Rule 7.25) |
| `help_pictures/Red_Pump_Label.png` (old version) | Help pictures | a screenshot with the photo pump; same file name, now made from the Skynet drawing Red_Pump_Label.svg |
| `help_pictures/Red_Pump_Label.svg` (old version) | Help pictures | its pump was drawn to look like the photo pump; redrawn with the Skynet pump and Red Cover |
| `help_pictures/Step_Add_Schema_08_Done.png` (old version) | Help pictures | a screenshot with the photo pumps; same file name, taken again with the Skynet pumps |
| `docs/reviews/2026-11-04_Elbow_Tee_Three_Vessel_before_after.png`, `..._closeup.png` | docs/reviews | old review screenshots with the photo pump; not needed, not replaced |
| `AlarmBitter.png`, `AlarmBitter.svg` (trace) | Alarms | looks like a DevExpress bell (a BruControl-era picture); replaced by the original Skynet line drawing Alarm Hop (Alarm_Hop*.svg, Bell = Hop) with its separate hop overlay Alarm_Set_Hop_Cone.svg (OakBarn Brewery 2026-11-17). They are in the Alarms group (OakBarn Brewery, 2026-11-18: "Yes Add those"). |

## Not in the library

- Unmerged previews in `reviews/screenshots/` (for example `vessel_widgets`) are left out until Fritz says otherwise.
- Empty user folders `media/Images/<group>/` hold the user's own pictures, not Skynet ones.
