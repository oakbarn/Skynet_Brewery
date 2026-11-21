# Process Attributes: Devices

Every `.attribute` a Process can use on a **Device**, grouped by Device type. Device types are in alphabetical order, and so are the
attributes under each one. Widgets are in [Process Attributes: Widgets](Process_Widget_Attributes.md). The commands are in
[Standard Process Commands](Process_Standard_Commands.md) and [Skynet Process Commands](Process_Skynet_Commands.md).

Built from the code (lib/store.js `attrsOf`, the list the Process editor's 💡 Suggest and Insert bar offer), 2026-11-21.

## How to read this list

- **The name alone is the main value.** `Pump_1 = true` is the same as `Pump_1.state = true`. Each Device type below says what its
  main value is.
- **Write a value with `=`, read it anywhere.** `HLT_Element.setpoint = 152` writes; `if HLT_Element.setpoint > 150` reads.
- **R** = read only. The Brain or the board sets it, and a Process line that sets it stops with an error.
- **Upper and lower case do not matter.** `.setpoint`, `.SetPoint` and `.SETPOINT` are the same attribute.
- **true / false** attributes also take `On` / `Off` (Rule 16.9).
- **Temperatures** are typed in your Units and kept in °C (Rule 2.59). An Offset is a difference (no 32).

## Attributes every Device has

| Attribute | Also written | What it does |
|---|---|---|
| `.alignment` | | Text placement in its box: Left, Center or Right. `""` puts back its Properties. |
| `.backcolor` | `.back` | Back color of its text box. A name (Red) or a code (#ffffff). |
| `.background` | | Which background picture shows: 1 = `.backpath`, 2 = `.backpath_2`, 3 = `.backpath_3`, 0 = none. |
| `.backpath` | | Background picture 1 (path). |
| `.backpath_2` | | Background picture 2 (path). |
| `.backpath_3` | | Background picture 3 (path). |
| `.enabled` | | On / off for older controls. On a Heating Element it is the same as `.state` and is not offered (Rule 7.9). |
| `.file` | | File name only of background picture 1 (Rule 7.23). |
| `.file_2` | | File name only of background picture 2. |
| `.file_3` | | File name only of background picture 3. |
| `.forecolor` | `.fore` | Text color. |
| `.height` | `.h` | Height in pixels. |
| `.hidden` | `.hiddenlock` | Hidden lock: true keeps it hidden even when `.visible` is true. |
| `.image` | | Shortcut: puts a picture in `.backpath` and sets `.background = 1`. |
| `.imageoff` | | Picture shown while Off. |
| `.imageon` | | Picture shown while On. |
| `.imageoverlay` | | Overlay picture shown while On (Layer 1). |
| `.label` | `.displayname` | The text shown on the Tab. Empty shows the Name. |
| `.layer` | | Layer Order: 1 is on top (Rule 1.29). `""` puts back its Properties. |
| `.path` | | Whole path of background picture 1 (Rule 7.23). |
| `.path_2` | | Whole path of background picture 2. |
| `.path_3` | | Whole path of background picture 3. |
| `.precision` | | Decimal places shown. |
| `.units` | | Units text shown after the value. |
| `.visible` | | Shown (true) or not (false). Also takes the words `visible` / `hidden`. |
| `.width` | `.w` | Width in pixels. |
| `.x_hPosition` | `.x`, `.xh` | Place across the Tab, in pixels (Rule 1.15). |
| `.y_vPosition` | `.y`, `.yv` | Place down the Tab, in pixels (Rule 1.15). |

### Look attributes (work, but not on the Suggest list)

A Process can set these on any Device (Help 22). They are not offered by 💡 Suggest. Reading one before a Process has set it stops
the Process ("has no property"), except `.display`.

| Attribute | Also written | What it does |
|---|---|---|
| `.digits` | | How many digits the reading shows, 1 to 12. |
| `.display` | | Which value shows (Data Display, Rule 6.26). Only on Devices with more than one: Deadband, Duty Cycle, Flow Meter, Heating Element, Hysteresis, PID, PWM / Analog Output, Vessel Scale. |
| `.nameAlign` | | Where the Label sits: TopLeft, TopCenter ... BottomRight. |
| `.nameBg` | `.nameBackColor` | Back color of the Label. |
| `.nameColor` | `.nameForeColor` | Color of the Label. |
| `.valueAlign` | | Where the value sits: TopLeft ... BottomRight. |
| `.valueBg` | `.valueBackColor` | Back color of the value. |
| `.valueColor` | `.valueForeColor` | Color of the value. |
| `.valueType` | | LED, Text, Gauge, Dial or Bar. On / Off Devices: LED or Text only. |

## Devices, by type

### Analog Input (`analogIn`: AI, Pressure, Level, Volume, pH meter)

Main value: **`.value`** (R), the reading.

| Attribute | What it does |
|---|---|
| `.fault` | R. true when the reading is bad. ⚠ Works, but missing from the Suggest list (see Review Notes). |
| `.raw` | R. The reading before scaling. ⚠ Works, but missing from the Suggest list. |

### Analog Output (`analogOut`: 0-10 V / 4-20 mA)

Main value: **`.value`**, the output %.

| Attribute | What it does |
|---|---|
| `.volts` | R. The volts at the % now, from its Measured volts table (Rule 6.24). |

### Cool / Warm Pump (`digitalOut`, Type ID CPMP, Rule 6.21)

Main value: **`.state`**, On / Off. It has every Pump attribute and every Heating Element method attribute (`.method`, `.setpoint`,
`.onoffset`, `.ondelay`, `.output`, `.pv`, `.value` ...). Its methods are only Direct (On/Off) and Hysteresis.

| Attribute | What it does |
|---|---|
| `.method` | Direct or Hysteresis. |
| `.ondelay` | Seconds it must stay Off before it turns On again. |
| `.onoffset` | Where it turns On: Setpoint + Offset. Plus cools, minus warms (Rule 6.19). |
| `.output` | R. Is its port on right now. |
| `.pv` | R. The smoothed probe reading. |
| `.setpoint` | The temperature it holds (the older `.target` is the same). |
| | Plus `.cover`, `.coverColor`, `.speed` as a Pump. The other method settings are listed but not used (see Review Notes). |

### Deadband (`deadband`, older control output, Rule 6.17)

Main value: **`.value`**, the output %.

| Attribute | What it does |
|---|---|
| `.calctime` | Seconds between steps. |
| `.deadbandoffset` | Band around the Setpoint where the % does not change. |
| `.initialoutput` | % it starts at. |
| `.innerbanddrive` | % step inside the inner band. |
| `.innerbandoffset` | Size of the inner band. |
| `.maxoutput` | Highest % it may use. |
| `.outerbanddrive` | % step outside the inner band. |
| `.outtime` | Output window in seconds. |
| `.setpoint` | The temperature it holds (`.target` is the same). |
| `.state` | On / Off (`.enabled` is the same). |

### Digital Input (`digitalIn`: DI, Float, DIN, Push button, Toggle, Latch, Flow switch, Interlock, E-Stop, Leak, Counter)

Main value: **`.state`** (R), true while made.

| Attribute | What it does |
|---|---|
| `.count` | Pulses counted (a Counter). |
| `.rate` | Pulses per second (a Counter). |
| `.raw` | R. The pin itself, before Latch / Toggle / DIN lockout. |
| `.reset` | Set true to clear a Latched or Toggled input. It goes back to false by itself. |

### Direct On / Off Output (`digitalOut`: DO, Motor, LED, Light, Electric Alarm, Fan, Chiller, Heat pad, Igniter)

Main value: **`.state`**, On / Off. No attributes of its own: only the ones every Device has.

### Duty Cycle (`dutyCycle`, older control output)

Main value: **`.state`**, On / Off.

| Attribute | What it does |
|---|---|
| `.dutycycle` | % of each cycle it is on. |
| `.interval` | Cycle time in milliseconds. |

### Fermentor Control (`fermentor`, Rule 6.30)

Built into a Fermentor Vessel Device. Main value: **`.state`**, On = it holds the Setpoint.

| Attribute | What it does |
|---|---|
| `.changeover` | Seconds one side must be Off before the other may start. |
| `.cooldelay` | Shortest Off time before Cooling starts again (seconds). |
| `.coolminrun` | Once Cooling is on, it stays on at least this long (seconds). |
| `.cooloffset` | Cooling turns On at Setpoint + this (plus). |
| `.doing` | R. What it is doing now: Heating, Cooling or Idle. |
| `.heatdelay` | Shortest Off time before Heat starts again (seconds). |
| `.heatminrun` | Once Heat is on, it stays on at least this long (seconds). |
| `.heatoffset` | Heat turns On at Setpoint + this (minus). |
| `.mode` | Heat & Cool, Heat only or Cool only. |
| `.setpoint` | The temperature it holds (`.target` is the same). |

### Flow Meter (`flowMeter`)

Main value: **`.rate`** (R), the flow rate (L/min inside a Process). With Data Display on Total, the name alone is `.total`.

| Attribute | What it does |
|---|---|
| `.raw` | R. Pulses from the board. |
| `.total` | Total that has flowed (L). |

### Gas Burner (a Heating Element with Gas burner ticked, Rule 6.33)

Every Heating Element attribute (below), plus:

| Attribute | What it does |
|---|---|
| `.flameout` | Flame Out safety: On, Off, or `"pause 10"` (minutes). |
| `.flameout_paused` | Minutes of pause left; 0 ends the pause. |
| `.flameout_tripped` | R. true after a Flame Out trip. Turning the burner back On clears it. |

### Heating Element (`digitalOut`, Type ID H_Element, Rule 6.19)

Main value: **`.state`**, On / Off. Set `.method` to pick how it is controlled. The short way, on a line of its own:
`hE_1.HYS`, `.DO`, `.DutyC`, `.PID`, `.DeadB`, `.PREC`, `.PWM` (see [Skynet Process Commands](Process_Skynet_Commands.md)).

| Attribute | What it does |
|---|---|
| `.autotune` | R. PID Auto-tune status text (Rule 6.39). |
| `.autotune_hold` | R. Hold output % found by Auto-tune. |
| `.autotune_kd` | R. Kd found by Auto-tune. |
| `.autotune_ki` | R. Ki found by Auto-tune. |
| `.autotune_kp` | R. Kp found by Auto-tune. |
| `.calctime` | Seconds between PID / Deadband / Precise calculations. |
| `.deadbandoffset` | Deadband: band around the Setpoint where the % does not change. |
| `.dutycycle` | Duty Cycle: % of each cycle it is on. |
| `.holdoutput` | Precise: the % it needs to stay at the Setpoint. |
| `.initialoutput` | Deadband: % it starts at. |
| `.innerbanddrive` | Deadband: % step inside the inner band. |
| `.innerbandoffset` | Deadband: size of the inner band. |
| `.interval` | Duty Cycle: cycle time in milliseconds. |
| `.kd` | PID / Precise: Kd. |
| `.ki` | PID / Precise: Ki. |
| `.kp` | PID / Precise: Kp. |
| `.maxintegral` | PID: highest integral. |
| `.maxoutput` | PID / Deadband / Precise: highest % it may use. |
| `.method` | Direct, PWM, Duty Cycle, Hysteresis, PID, Deadband or Precise (only the ones ticked in its Build). |
| `.ondelay` | Hysteresis: seconds it must stay Off before it turns On again. |
| `.onoffset` | Hysteresis: turns On at Setpoint + Offset. A heater uses a minus (-1). |
| `.outerbanddrive` | Deadband: % step outside the inner band. |
| `.output` | R. Is its port on right now. |
| `.outtime` | Output window in seconds. |
| `.power` | PWM: the % sent out. |
| `.pv` | R. Smoothed probe reading (Precise). |
| `.setpoint` | The temperature it holds (the older `.target` is the same). |
| `.smoothing` | Precise: seconds it averages the probe over. |
| `.value` | The output % a PID, Deadband or Precise works out. |

### Hydrometer (`hydrometer`: Tilt, Tilt Pro, iSpindel, RAPT Pill ..., Rule 6.25)

Main value: **`.value`** (R), the gravity in its Gravity units.

| Attribute | What it does |
|---|---|
| `.abv` | R. ABV from `.og` and the gravity now. |
| `.angle` | R. Tilt angle. |
| `.battery` | R. Battery. |
| `.brix` | R. Gravity in °Brix. |
| `.lastseen` | R. When it last reported. |
| `.lost` | R. true when it has stopped reporting. |
| `.og` | Original Gravity (SG). A Process may set it. |
| `.plato` | R. Gravity in °Plato. |
| `.rssi` | R. Signal strength. |
| `.sg` | R. Gravity in SG. |
| `.temperature` | R. Its own temperature reading. |

### Hysteresis (`hysteresis`, older control output)

Main value: **`.state`**, On / Off.

| Attribute | What it does |
|---|---|
| `.ondelay` | Seconds it must stay Off before it turns On again. |
| `.onoffset` | Turns On at Setpoint + Offset: -1 heats, +1 cools. |
| `.setpoint` | The temperature it holds (`.target` is the same). |

### PID (`pid`, older control output)

Main value: **`.value`**, the output %.

| Attribute | What it does |
|---|---|
| `.calctime` | Seconds between calculations. |
| `.kd` | Kd. |
| `.ki` | Ki. |
| `.kp` | Kp. |
| `.maxintegral` | Highest integral. |
| `.maxoutput` | Highest % it may use. |
| `.outtime` | Output window in seconds. |
| `.setpoint` | The temperature it holds (`.target` is the same). |
| `.state` | On / Off (`.enabled` is the same). |

### Pump (`digitalOut`, Type ID Pump)

Main value: **`.state`**, On / Off.

| Attribute | What it does |
|---|---|
| `.cover` | Cover color: None, Red, Yellow, Blue, Green, Purple, Orange, White or User. |
| `.coverColor` | The color used when `.cover` is User. |
| `.speed` | Speed % (a pump on a PWM port). |

### PWM Output (`pwmOut`: PWM, Proportional Valve, Pump / Fan / Motor speed, LED dimmer)

Main value: **`.value`**, the output %.

| Attribute | What it does |
|---|---|
| `.volts` | R. The volts at the % now, from its Measured volts table (Rule 6.24). |

### Stepper Motor (`stepper`)

Main value: **`.value`** (R), the same as `.position`.

| Attribute | What it does |
|---|---|
| `.home` | Set true to find the home switch. |
| `.homed` | R. true once it has found home. |
| `.move` | Move by this many steps. |
| `.moving` | R. true while it moves. |
| `.position` | R. Where it is now. |
| `.reset` | Set true: here becomes the home position. |
| `.run` | Keep turning at this speed; 0 stops. |
| `.speed` | Speed for the next moves. |
| `.steps` | R. Steps from the board. |
| `.stop` | Set true to stop. |
| `.target` | Go to this position. |

### Temperature Probe (`temperature`: 1-Wire, RTD, Thermocouple, NTC, LM35, TMP36)

Main value: **`.value`** (R), the temperature.

| Attribute | What it does |
|---|---|
| `.fault` | R. true when the probe reads badly. |
| `.raw` | R. The reading before calibration. |
| `.setpoint` | Its Setpoint. If a Heating Element, Fermentor Control or older control uses this probe, it is that one's Setpoint (one Setpoint, never two). |

### Valve (`digitalOut`: Electric Valve, High Temperature Electric Valve, Solenoid Gas Valve, Manual valve)

Main value: **`.state`**, true = open. On a **Manual** valve, setting it shows a pop-up and waits until a person confirms.

| Attribute | What it does |
|---|---|
| `.tapwater` | true when the valve is on a tap water outlet (flow with no pump). |
| `.flameout` | Solenoid Gas Valve only: as the Gas Burner. |
| `.flameout_paused` | Solenoid Gas Valve only: as the Gas Burner. |
| `.flameout_tripped` | Solenoid Gas Valve only, R: as the Gas Burner. |

### Integrated Devices (Rule 6.1 exception)

A Device inside a Vessel or other Integrated item is reached as `VesselName.DeviceName.attribute`, for example
`Mash_Tun.Temp.setpoint`. `VesselName.DeviceName` alone is its main value. Its attributes are the ones of its own type above.

---

## Analyst's Review Notes

- **Bug found (not fixed here, docs only):** in lib/store.js the Analog Input's attribute line (`analogIn: { value, raw, fault }`) sits
  at the end of a `//` comment on the Temperature line, so it never runs. `.raw` and `.fault` still work in a Process (the Brain sets
  them), but 💡 Suggest and the Insert bar don't offer them. A one-line fix; say the word and I'll make it a separate PR.
- **Cool / Warm Pump:** the Suggest list offers every Heating Element setting (`.kp`, `.deadbandoffset`, `.power` ...), but it can only
  run Direct or Hysteresis (Rule 6.21). Setting them does no harm, but they do nothing. Should the list be trimmed?
- **Rule 1.21 (Universal Properties) vs the code:** the Rule promises `.font`, `.font_size`, `.bold`, `.label_visible`, `.font_label`,
  `.size_label`, `.fore_label`, `.back_label`, `.bold_label`, `.alignment_label`, `.lock` and `.tab` on every Device. Today only the
  Text Widget has them; docs/Universal_Properties.md already calls this "the plan". This list shows what works now.
- **camelCase standard:** most built attribute names are all lower case (`.onoffset`, `.calctime`, `.resetvalue`), while only
  `.x_hPosition`, `.y_vPosition`, `.coverColor` and `.skynet_Layer_2` are shown with capitals. Since case doesn't matter they all
  work either way, but the list doesn't follow the camelCase standard. I listed them as the editor shows them.
- **Fermentor Control placement:** I put it with the Devices (Device Library 5.5). The Process editor's Insert bar groups it with
  Widgets, because it is not on a board port.
- **Not built yet:** `.capacity` and `.currentVolume` on Vessels (agreed 2026-11-20) are not in the code, so they are not listed.
- Confidence: **High** for the lists (they were pulled from the running code for every Device type, not typed from memory);
  **Medium** for a few one-line descriptions (Counter `.rate` units, Flow Meter `.total`), which I took from code comments.
