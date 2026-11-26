# Skynet Process Commands

The Process commands Skynet added for brewing, in alphabetical order, then the Skynet words and values. The general language (`if`,
`wait`, `sleep`, math, date math ...) is in [Standard Process Commands](Process_Standard_Commands.md). Attributes are in
[Process Attributes: Devices](Process_Device_Attributes.md) and [Process Attributes: Widgets](Process_Widget_Attributes.md).

Built from the Process reader and runner (lib/engine.js), 2026-11-21. Upper and lower case do not matter (`place_Chiller` =
`place_chiller`). Commands that end in "waits" hold the Process until a person answers; an Override moves it on.

## 1. Commands

| Command | Example | What it does | Rule / Help |
|---|---|---|---|
| `all_heaters_off` | `all_heaters_off` | Turns every heater off: every Heating Element (any method), every older Duty Cycle / Hysteresis / PID / Deadband, and every gas burner (gas valve closed, igniter off). Nothing turns back on by itself. Same list as Emergency Off step 1. | 6.15, Help 100 |
| `all_pumps_off` | `all_pumps_off` | Turns every pump off. | 6.15, Help 100 |
| `ask_recipe` | `ask_recipe` | A Brew Day always has a Recipe. With one loaded it goes straight on; with none, the **No Recipe Found** pop-up (Saved Recipe, Extract Can Kit, Extract Partial Grain and Hops, All Grain, All Grain (own Grain Mill); starts on the Default settings Brewer Type) and the Process waits until a Recipe is opened, IMPORTed or saved. | 16.14 |
| `ask` | `ask "Add the grain, then press Done"` | A pop-up on every screen with ✔ Done. Waits until an Operator or Admin presses it. | 16.5 |
| `ask` (with a box) | `ask "Fire Hose minutes?" gT_Hose_Time` | The same pop-up with a box for the answer, filled with what the gGlobal or Value Widget holds now. Done puts the answer in it. Waits. | 16.5 |
| `close_all_valves` | `close_all_valves` | Closes every valve On Close List (tap water valves always). Then, only if the Schema has a Manual valve, one pop-up "Have you closed all Manual Valves?" and waits. | 6.15 |
| `close_valve` | `close_valve DigiBoil_Spigot` | Closes one valve. A Manual one asks a person and waits. | 5.39 |
| `DBSend` | `HLT_Temp DBSend` or `HLT_Temp.setpoint DBSend` | Goes after a name: sends its main value (or that one attribute) to the database now. | 6.14, Help 98 |
| `declare` / `new` (gGlobal) | `new gV gV_Strike = 163` | Makes a gGlobal the first time the line runs; the `= 163` is its first value only. Words: `gGlobalValue`/`gV`, `gGlobalString`/`gS`, `gGlobalTime`/`gT`, `gGlobalDateTime`/`gD`, `gGlobalBoolean`/`gB`. `new value gV_X` works too. A wrong prefix is an error. | 1.24, Help 145 |
| `delay` | `delay 7` | Waits a number of **seconds** (`sleep 7000`). Decimals and variables work. Override and Testing work as on `sleep`. | 16.12, Help 22 |
| `goLine` | `goLine 235` | Goes to a line number, like `goto` to a `[Label]`. The number follows its line when lines are added or taken out above it. | 16.10, Help 22 |
| `hide_Override` | `hide_Override` | Takes away this Process's Override pop-up. | 2.26, Help 96 |
| `hop_alert` | `hop_alert "Pre Boil"` / `"Mash"` / `"1st Wort"` / `"Hop Stand High"` (Middle, Low) / `"Fermenter"` | Sends one hop alert that comes before or after the boil, when the brew gets there: Strike reached, Mash Timer started, just before the First Run, the wort at a Hop Stand, every Fermenter filled. Pre Boil, Mash and 1st Wort are All Grain only. No Recipe or no such hops: nothing is sent, the Process goes on. | 17.20, Help 99 |
| `import_recipe` | `import_recipe "Recipes/My IPA.bsmx"` | Loads a Recipe file. A second text picks one recipe from a file with many. | 17.3, Help 99 |
| `lock_Equipment` | `lock_Equipment` | Locks the equipment (vessels, IPs, pipes, hoses) on every Tab of the Schema that has some. | 2.62, Help 22 |
| `open_all_valves` | `open_all_valves` | Opens every valve On Open List (never tap water). Then, only if the Schema has a Manual valve, one pop-up "Have you opened all Manual Valves?" and waits. | 6.15 |
| `open_valve` | `open_valve DigiBoil_Spigot` | Opens one valve. A Manual one asks a person and waits. | 5.39 |
| `place_Chiller` | `place_Chiller = Immersion_Chiller, BK_Vessel` | Draws a Chiller Template (an immersion chiller) in a Vessel with its hoses. Only the drawing changes; the Process goes straight on. | 5.42, Help 200 |
| `remove_Chiller` | `remove_Chiller = BK_Vessel` or `remove_Chiller` | Takes a placed chiller off that Vessel, or every placed one. A chiller put in by hand is never taken off. | 5.42 |
| `send_db` | `send_db HLT_Temp` | Sends its reading to the database now, whatever its own setting. | 6.14 |
| `send_db_group` | `send_db_group Readings` | Sends every item of that Database Group now, once. | 6.14 |
| `show_Override` | `show_Override "Press when the boil is rolling"` | Brings up this Process's Override pop-up (text optional). It stays until pressed, `hide_Override`, or the Process ends. | 2.26, Help 22 |
| `start_db_group` | `start_db_group Mash` | The Group's items are sent by their own setting from now on. | 6.14 |
| `start_hop_alerts` | `start_hop_alerts` / `start_hop_alerts "Boil_Timer"` / `start_hop_alerts "Boil_Timer", 1` | Starts the Recipe's hop alerts: on Skynet's own clock, or following a timer. The number is timer seconds per boil minute (60 = real time, 1 = Testing). | 17.4, Help 99 |
| `step` | `step "Mash in"` | Marks a step. Skynet numbers it on Save (1.00000, S1.00000 ...); never type the number. | Help 22 |
| `stop_db_group` | `stop_db_group Mash` | Stops what `start_db_group` started. | 6.14 |
| `stop_hop_alerts` | `stop_hop_alerts` | Stops the hop alerts. | 17.4 |
| `take_reading` | `take_reading Hydro_Red` | A pop-up asks for a gravity by Refractometer or Glass hydrometer and waits until it is saved. Goes into a Hydrometer, a Value Widget or a gGlobal. It can be paused 5 minutes. | 6.25 |
| `unlock_Equipment` | `unlock_Equipment` | Unlocks what `lock_Equipment` locked. | 2.62 |

## 2. Skynet line forms

| Form | Example | What it does | Rule |
|---|---|---|---|
| Heating method shortcut | `hE_HLT.HYS` | On a line of its own: the same as `hE_HLT.method = "Hysteresis"`. Also `.DO`, `.PWM`, `.DutyC`, `.PID`, `.DeadB`, `.PREC` and the whole words. | 6.19 |
| Hose connect | `Hose_1.connect = QD_1` | Connects a Quick Disconnect hose to a QD, IP or Vessel; `= none` takes it off. A name, not a value. | 5.34, Help 142 |
| Flow color | `Pipe_1.flow_Color = Mash` / `tab.flow_Color = Boil` | Colors a pipe, hose, IP, or the Tab on the screen. A plain word works. | 5.21 |

## 3. Skynet words and values

| Word | What it is | Rule |
|---|---|---|
| `skn_Air_Pressure` | R. Air pressure at the brewery now (hPa). | 1.18 |
| `skn_Started_By` | R. The name of the Process that started this one with `start`; blank when a person, a button or the Brain started it. | 1.35 |
| `skn_Boil_Temp` | R. The temperature water boils at here and now (°C inside a Process; your Units in a message). | 1.18 |
| `skn_Boil_Temp_C` | R. The same, in °C. | 1.18 |
| `skn_Boil_Temp_F` | R. The same, in °F. | 1.18 |
| `skn_const_...` | R. Fixed conversion numbers, e.g. `skn_const_L_p_Gal` (Liters per Gallon). The full list: Help 94, or 📐 Constants in the Process editor. | 1.17 |
| `skn_rcp_...` | R. Recipe values, e.g. `skn_rcp_Strike_Temp`, `skn_rcp_Boil_Time`, in metric. The full list: Help 99, or the Insert bar. | 16.4, 17.3 |
| `toC( )` | °F to °C: `toC(152)` is 66.67. Only with ( ) after it. | 1.17 |
| `toF( )` | °C to °F: `toF(66.67)` is 152. Only with ( ) after it. | 1.17 |
| Number with its sign | `152°F`, `66.7°C`, `12psi`, `0.8bar`, `5gal`, `18.9L`, `10lb`, `4.5kg`, `2gpm`, `7.5Lpm`, also `kPa`. Always that unit, whatever Settings > Units says; changed to metric inside. | 2.59 |

## 4. Old words that now stop with a message

| Word | What it says |
|---|---|
| `log` | Now `send_db`. |
| `pause` | A sound pauses by itself while a higher alarm sounds; use `stop`. |

---

## Analyst's Review Notes

- **The split is mine.** I put here everything Skynet added on top of a plain programming language, so `delay`, `goLine` and `step`
  are here even though they are general. Tell me if you'd rather move them.
- **Not built, so not listed:** `lock_BrewDayRecipe` (Help 22 says it "comes with the Brew Day Recipe"), Universal Lock / Tab Lock
  commands (proposed 2026-11-02), and a settable `skn_Brew_Status` (Process entry 12).
- **Capitals:** Help writes `goLine`, `place_Chiller`, `show_Override`, `lock_Equipment` with capitals and the rest lower case. They work
  either way; I kept Help's spelling.
- **`all_pumps_off`** has no Manual Pump reminder, while `close_all_valves` has a Manual valve one. Intended?
- Confidence: **High**; each command's row comes from its own block in lib/engine.js and its Rule.
