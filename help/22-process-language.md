# Process language and steps

Processes are now written the way most programming languages work. Old BruControl lines still run, and the panel rewrites them in the new style when you **Save** a Process or **Import** a BruControl file. A line is only rewritten when the new line means exactly the same thing, so nothing changes what a Process does.

## The name alone is the main value

Write the name of a Device or Widget on its own. You never need `value`, `state` or `active`.

| New style | BruControl style (still works) |
|---|---|
| `Pump_Red = true` | `"Pump_Red" state = true` |
| `alm_StrikeSpargeMash_ALARM = true` | `"alm_StrikeSpargeMash_ALARM" active = true` |
| `Kettle_SetPoint = 185.5` | `"Kettle_SetPoint" value = 185.5` |
| `if Kettle_SetPoint == 185.5` | `if "Kettle_SetPoint" value == 185.5` |
| `wait tm_Mash <= 00:00:00` | `wait "tm_Mash" value <= 00:00:00` |

The main value of each kind:

- Digital Out, Switch, Digital In, Duty Cycle, Hysteresis: on or off (`true` / `false`)
- Alarm: sounding or not (`true` / `false`)
- Timer: its time
- vKonstant and vAPI: their value
- Temperature, Analog In and Out, PWM, PID, Scale: their reading or value
- Flow meter: its flow rate

## Other attributes use a dot

```
my_Widget.visible = false
tm_Mash.countdown = true
tm_Mash.displayname = "Mash rest"
Kettle_Temp.background = 2
if Hop_Text.visible == true
```

Any attribute with only two choices is `true` or `false`:

- `.visible` (was `visibility = visible / hidden`)
- `.countdown` for timers (was `type = countdown / countup`)
- `.running` for timers, `.loop` for alarms, `.enabled`

If a name has characters other than letters, digits and `_`, put it in quotes before the dot: `"BK (Front)".visible = true`.

## Names have no spaces

Names of Devices, Widgets and Processes cannot have spaces any more. When you type a space in a name it becomes `_`. Names that already had spaces were changed once, for example `Test Timer` became `Test_Timer`. The screen still shows the old name, because it became the **Display name**. Every Process that used the old name was updated too, and a copy of each one was kept as `.before-no-spaces.bak`.

## Autofill

While you type in a Process, a list of names pops up. Names you already used higher up in that Process come first, then your Devices, Widgets and Processes. Use **Up** and **Down** to pick one, **Enter** or **Tab** to take it, and **Esc** to close the list.

After a dot, the list shows that item's attributes. When the letters you typed fit only one attribute, it is filled in by itself: `my_Widget.b` becomes `my_Widget.background = `. At the start of a line you also get ` = `; inside an `if` or a `wait` you get just the attribute name. You can keep typing the whole word anyway, because letters that are already filled in are skipped.

## Process classes

Each Process belongs to a class. The list on the Processes screen is grouped by class, and you can click a heading to fold that group.

| Class | What it is for | Guessed from a name starting with |
|---|---|---|
| **Flow** | The brew itself: one Flow Process starts the next. | `scr`, or a name with `flow` in it |
| **Sub** | Called by Flow Processes for jobs used in more than one place. | anything else |
| **Repeat** | Small common helpers, often a place to wait in the calling Process (like `inscpt_scrAdvancewithSwitch`). | `inscpt` |
| **Looper** | Runs in the background on its own and is never called. | `looper` |

If the guess is wrong, change it in the dropdown next to **Save**.

## Steps (scaffolding)

A `step` line marks a section of a Process:

```
step "Mash in"
```

When you save, every step in every Process is numbered again:

- Flow Processes get 1, 2, 3 and so on, in the order they start each other. Their steps are numbered **1.00000**, **1.00001** and so on, and the next Flow Process begins at **2.00000**.
- Sub, Repeat and Looper Processes each count on their own: **S1.00000**, **R1.00000**, **L1.00000**.

If you add a step in the middle, the numbers after it move up by themselves. Never type the number yourself.

**Add steps** (next to Save) puts a step at the start of the Process and after every `[label]` that doesn't have one yet. Save afterwards to number them.

While a Process runs, the Processes screen shows the step it is on. To show it on a tab, add a **vKonstant** with the kind **Step**. In its properties, **Shows the steps of** picks the class to follow (Flow unless you change it). It then shows, for example, `2.00003  Mash in`.
