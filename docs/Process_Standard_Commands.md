# Standard Process Commands

The general parts of the Process language: commands, control flow (`if` ... `endif`), variables, math, comparisons and date / time
math. Each section is in alphabetical order. The Skynet-only commands (valves, heaters, hops, `ask`, `delay`, `goLine`, `step` ...)
are in [Skynet Process Commands](Process_Skynet_Commands.md). Attributes are in [Process Attributes: Devices](Process_Device_Attributes.md)
and [Process Attributes: Widgets](Process_Widget_Attributes.md).

Built from the Process reader and runner (lib/engine.js, lib/values.js), 2026-11-21. Help 5 and 22 explain more.

Upper and lower case do not matter in commands (`IF` = `if`). A comment starts with `//`, `#` or `'`, or sits between `/*` and `*/`.

## 1. Commands and control flow

| Command | Example | What it does |
|---|---|---|
| `[Label]` | `[Again]` | Marks a place that `goto` jumps to. |
| `clear` | `clear` | Kept for BruControl Processes. It does nothing (see Review Notes). |
| `declare` | `declare value vV_X` | The same as `new`. |
| `else` | `else` | Inside an `if`: the lines that run when nothing above was true. |
| `else if` | `else if vV_X > 5` | The same as `elseif`. |
| `elseif` | `elseif Kettle_Temp > 90` | Inside an `if`: asks the next question when the ones above were false. |
| `endif` | `endif` | Ends an `if`. Every `if` needs one (or `{ }`, or the one-line form). |
| `goto` | `goto Again` or `goto "My Section"` | Jumps to a `[Label]`. A `goto` back up is a loop; an Override passes it. |
| `if` | `if Pump_1 == true` | Runs the lines under it only when the question is true. In an `if`, a single `=` asks, the same as `==`. |
| `if ( ) one line` | `if (vV_X > 3) Pump_1 = true` | An `if` with its one command on the same line. No `endif`. |
| `new` | `new value vV_Count = 0` | Makes a Process variable: `value`, `string`, `bool`, `time` or `datetime`. The `= 0` is optional. It starts empty each time the Process starts. (`new gV gV_X` makes a gGlobal: Skynet list.) |
| `play` | `play alm_Hops` | Sounds an Alarm or plays an Audio Widget. |
| `print` | `print "Mash at " + Mash_Temp` | Writes a line to the Process Output. |
| `reset` | `reset tm_Boil` | A Timer goes back to its `.resetvalue`. A Stepper: here becomes home. |
| `restart` | `restart` or `restart Looper_Temps` | Stops a Process, clears its memory and starts it again from the top. Alone: this Process. |
| `show` | `show tab "Brew House"` | Switches every screen to that Tab (`show workspace` works too). |
| `sleep` | `sleep 1000` | Waits a number of milliseconds (1000 = 1 second). An Override passes it. |
| `start` | `start "Mash_Flow"` | Starts a Process, a Timer, or sounds an Alarm / Audio Widget. Starting a running Process does nothing. |
| `stop` | `stop Mash_Flow` | Stops a Process (or this one), a Timer, an Alarm, an Audio Widget or a Stepper. |
| `wait` | `wait Kettle_Temp >= 95` | Waits until the question is true. Checked on every change and every 0.1 s. An Override passes it. |
| `{ }` | `if (a) { ... } else { ... }` | C-style blocks: `}` is `endif` unless an `else` follows. |
| `;` | `Pump_1 = true; Pump_2 = false;` | Ends a command, so two can go on one line. |

## 2. Setting values

| Operator | Example | What it does |
|---|---|---|
| `=` | `Pump_1 = true` | Sets a value. (In an `if`, `elseif` or `wait` it asks, like `==`.) |
| `+=` | `vV_Count += 1` | Adds to it. |
| `-=` | `vV_Count -= 1` | Takes from it. |
| `*=` | `vV_Vol *= 2` | Multiplies it. |
| `/=` | `vV_Vol /= 2` | Divides it. |
| `++` | `vV_Count++` | Adds 1 (`++vV_Count` too). |
| `--` | `vV_Count--` | Takes 1 (`--vV_Count` too). |

A Process variable also has **`.precision`**: `vV_Avg.precision = 2` keeps it to 2 decimals.

## 3. Math

| Name | Written | Example | What it does |
|---|---|---|---|
| Add | `+` | `Strike + 2` | Adds. |
| Divide | `/` | `vV_Total / 4` | Divides. Dividing by 0 stops the Process. |
| Group | `( )` | `(a + b) * 2` | Works out the inside first. |
| Join text | `+` | `"Mash " + vV_Step` | When either side is text, `+` joins them. |
| Minus sign | `-x` | `-vV_Offset` | The negative. |
| Multiply | `*` | `vV_Gal * skn_const_L_p_Gal` | Multiplies. |
| Power | `^` | `2 ^ 3` | Raises to a power (8). |
| Subtract | `-` | `Target - Mash_Temp` | Subtracts. |

Order: `( )`, then `^`, then `*` `/`, then `+` `-`. Math with an empty (NULL) value stops the Process and says which one.

## 4. Comparisons and logic

| Name | Written | Example |
|---|---|---|
| and | `and`, `&&` | `if Pump_1 and vV_X > 3` |
| Equal | `==` (or `=` in an `if` / `wait`) | `if alm_Hops == Off` |
| Greater than | `>` | `wait Kettle_Temp > 95` |
| Greater or equal | `>=` | `wait Kettle_Temp >= 95` |
| Less than | `<` | `if vV_X < 3` |
| Less or equal | `<=` | `wait tm_Mash <= 00:00:00` |
| not | `not`, `!` | `if not Pump_1` |
| Not equal | `!=`, `<>` | `if vS_Name != ""` |
| or | `or`, `\|\|` | `if a or b` |

Text compares as text when both sides are text. `true`/`false` compare as On/Off. `NULL` works only with `==` and `!=`.

## 5. Values and words

| Word | What it is |
|---|---|
| `"text"` | Text. `\n` inside it is a new line; Rich Text codes work (Help 90). |
| `00:15:00`, `15:00` | A time: hh:mm:ss, or mm:ss. |
| `152`, `0.5` | A number. A plain temperature is read in your Units (Rule 2.59). |
| `countdown`, `countup` | Timer types. |
| `custom`, `default`, `none` | Alarm sound modes. |
| `hidden`, `visible`, `hiddenlocked` | For `.visible` (older Processes). |
| `NULL` | Empty: no value at all (Rule 1.32). |
| `now` | The date and time now. |
| `On`, `Off` | The same as `true`, `false` (Rule 16.9). |
| `true`, `false` | Yes / no. |

## 6. Date and time math

A **time** is a length (00:20:00). A **date and time** is a moment (`now`, a DateTime Widget, a gD_ gGlobal). Inside a Process both
count in seconds.

| Name | Example | Answer |
|---|---|---|
| Compare times | `wait tm_Mash <= 00:00:00` | true / false. |
| Date + number | `now + 60` | A date and time, 60 **seconds** later. |
| Date + time | `now + 00:20:00` | A date and time, 20 minutes later. |
| Date − date | `now - gD_Start` | A time: how long between them. |
| Date − number | `now - 3600` | A date and time, one hour earlier. |
| Date − time | `now - 01:00:00` | A date and time, one hour earlier. |
| Now | `gD_Start = now` | The date and time now (the Brain's clock; faster in Testing). |
| Time + number | `tm_Boil + 30` | A time, 30 seconds longer. |
| Time + time | `00:10:00 + 00:05:00` | 00:15:00. |
| Time ÷ number | `00:20:00 / 2` | 00:10:00. |
| Time × number | `00:05:00 * 3` | 00:15:00. |
| Time − time | `00:20:00 - tm_Mash` | A time (can be below zero). |
| Text to date | `vD_Brew = "2026-11-21 08:00"` | Text set into a `datetime` variable becomes a date and time. |

A date and time shows as MM/DD/YYYY hh:mm:ss. The parts of a Time gGlobal (`.minute`, `.seconds`) are on the Widget list.

---

## Analyst's Review Notes

- **Where I drew the line:** "Standard" here means the parts any programming language (and BruControl) has. Skynet's own additions,
  even plain ones like `delay` (Rule 16.12), `goLine` (Rule 16.10) and `step`, went to the Skynet list. Move any you'd rather see here.
- **`clear` does nothing.** The reader accepts it and the runner just goes to the next line. It is a reserved word in Help 22 but its
  job is never said. Was it BruControl's "clear the output"? If you want it to clear the Process Output, that's a small build.
- **`play` and `start`** do the same thing to an Alarm or Audio Widget. Not a problem, just two ways.
- **Date + number counts seconds**, not days (as in Excel). Worth one line in Help 22, which has no date math section today.
- **No rounding, min / max, absolute value or square root** functions exist. Only `toF( )` and `toC( )` (Skynet list).
- Confidence: **High**; every row was read from lib/engine.js and lib/values.js, and the examples follow the code's own comments.
