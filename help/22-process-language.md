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
tm_Mash.label = "Mash rest"
Kettle_Temp.background = 2
Pump_Red.image = "Images/RedPump.png"
if Hop_Text.visible == true
```

`.image` changes the item's picture: the path goes into imagePath_1 and background becomes 1. `.background = 1`, `2` or `3` shows imagePath_1, 2 or 3, and any other number shows no picture. See [Pictures on items](25-picture-paths).

Any attribute with only two choices is `true` or `false`:

- `.visible` (was `visibility = visible / hidden`)
- `.countdown` for timers (was `type = countdown / countup`)
- `.running` for timers, `.loop` for alarms, `.enabled`

If a name has characters other than letters, digits and `_`, put it in quotes before the dot: `"BK (Front)".visible = true`.

## Visible and Hidden

Every Device, Widget and Text has two true / false attributes:

- `.visible`: shown or not. It also takes the words `visible` (same as `true`) and `hidden` (same as `false`), so `Pump_Red.visible = hidden` works.
- `.hidden`: a lock that keeps the item hidden. Only `true` or `false`. **`.hidden = true` wins over `.visible = true`**: the item is on the Tab only while `.visible` is `true` and `.hidden` is `false`.

```
Pump_Red.visible = true
Pump_Red.hidden = true        // stays hidden, even though .visible is true
Pump_Red.hidden = false       // shown again
```

You can set both in the item's **Properties** too: **Visible** and **Hidden, locked** are switches. In Edit layout a hidden item shows faded so you can still find it.

Older Processes are changed for you (once, when the panel starts, and whenever a Process is saved or imported). The old file is kept as `.before-hidden.bak`:

| Old line | New line |
| --- | --- |
| `"my Widget" visibility = visible` | `"my Widget".visible = true` |
| `"my Widget" visibility = hidden` | `"my Widget".visible = false` |
| `"my Widget" visibility = hiddenlocked` | `"my Widget".visible = false; "my Widget".hidden = true` |

The old lines still run the same way if you leave them.

## Is a Process running?

`.running` on a Process name is `true` while that Process runs and `false` when it is stopped, finished or stopped by an error. It works in an `if`, `elseif`, `wait` or anywhere a value goes:

```
if my_Process_Mash.running = true
  stop my_Process_Mash
endif
```

`if my_Process_Mash.running == true` means the same: in an `if` a single `=` asks, just like `==`. The C style works too: `if (my_Process_Mash.running) stop my_Process_Mash;` and `if (!Looper_Temps.running) start Looper_Temps;`.

`.running` on a Process is read only. A line like `my_Process_Mash.running = false` is an error ("my_Process_Mash.running is read only: use start my_Process_Mash or stop my_Process_Mash"); use `start` and `stop` to change it. A timer's `.running` is different: it can be set, and it starts or stops the timer.

Autofill shows `running` after a Process name and a dot.

## C, C# and JavaScript spellings

If you know C, C++, C# or JavaScript, you can use the spellings you are used to. They are only other ways to write the same Process commands, so the Process works the same either way. It is not JavaScript: only the spellings below are understood.

| You can write | It means |
|---|---|
| `Kettle_SP = 185.5;` | A `;` at the end of a line is allowed. It also lets you put two commands on one line: `Pump_Red = true; Pump_Blue = false;` |
| `new value vV_Hop1F = 10` | `new value vV_Hop1F` and then `vV_Hop1F = 10` on the next line (both ways work) |
| `vCount++` and `vCount--` | `vCount += 1` and `vCount -= 1` (`++vCount` works too) |
| `if (a) { ... }` | `if a` ... `endif` |
| `} else if (b) {` | `elseif b` |
| `} else {` | `else` |
| `if (vCount > 5) print "done";` | an `if` with one command on the same line, no `endif` needed |
| `!=`  `&&`  `\|\|`  `!` | not equal, `and`, `or`, `not` (these always worked) |
| `//` and `/* ... */` | comments (these always worked) |
| `+=`  `-=`  `*=`  `/=` | add to, take from, multiply, divide (these always worked) |

A Process in this style:

```
new value vCount = 0;
[Again]
vCount++;
if (vCount < 3 && !alm_Hops) {
  print "pass " + vCount;
  goto Again;
} else if (vCount == 3) {
  print "three";
} else {
  print "done";
}
```

The `{` can also go on a line of its own, under the `if` or `else` (the way C# is often written). Every `{` needs its `}`, and the Process check tells you the line when one is missing.

You can mix both styles in one Process. Old Processes and BruControl imports keep working as they are, and **Save** never changes one style into the other.

## Codes inside text

Text in quotes can carry codes that change how it looks on the screen. They work wherever a Process shows text: a string value on a Tab, a label, `print` lines in the Process output, and pop-ups such as a manual valve's message. Bold, large, subscript and superscript are switches: the first code turns it on, the next one turns it off.

| Code | What it does | Example | Shows |
|---|---|---|---|
| `\n` | a new line | `"Mash in\nStir well"` | Mash in, then Stir well on the next line |
| `\b` | bold on / off | `"Add \bhops\b now"` | Add **hops** now |
| `\L` | large text on / off | `"\LSTRIKE\L 165"` | STRIKE in large letters |
| `\_` | subscript on / off | `"CO\_2\_"` | CO₂ |
| `\^` | superscript on / off | `"ft\^3\^"` | ft³ |
| `\deg` | a degree sign | `"152\degF"` | 152°F |
| `\\` | one backslash | `"C:\\Brewing"` | C:\Brewing |

Codes can be used together: `"\L\bBOIL\b\L 60 min"`.

The size of large text is **Large text size** on the ☰ Menu **Default** tab, in pixels. It has to be bigger than normal text (18), and it is 28 when the box is empty. Large text is always at least a quarter bigger than the text around it, so it still stands out in an item with a big font.

## Change the look of a device or widget

A Process can change the colors, placement and value type of any device or widget while it runs:

```
BK_Temp.valueColor = "Red"
BK_Temp.valueBackColor = "Black"
BK_Temp.nameColor = "#ffffff"
BK_Temp.nameAlign = "TopCenter"
BK_Temp.valueAlign = "MiddleRight"
BK_Temp.valueType = "Gauge"
BK_Temp.digits = 4
BK_Temp.valueColor = ""
```

- Colors are a name (Red, Black, ...) or a code like `#ffffff`. `nameBackColor` is the same as `nameBg`, and `valueBackColor` the same as `valueBg`.
- Placement is one of TopLeft, TopCenter, TopRight, MiddleLeft, MiddleCenter, MiddleRight, BottomLeft, BottomCenter, BottomRight.
- `valueType` is `LED`, `Text` or `Gauge`. Something with an ON / OFF state (a pump, valve, switch) can only be `LED` or `Text`.
- `""` puts back the look set in its properties.

Every text box also has `.foreColor`, `.backColor`, `.alignment` (Left, Center, Right), `.width`, `.height`, `.xPosition` and `.yPosition`, for example `Pump_1.foreColor = "Red"` or `Text_1.xPosition = 400`. A Text added with **+ Text** has a name too (`Text_1`). See [Text boxes](49-text-boxes).

The change lasts until the panel restarts. To keep a look, set it in the item's properties, or start new items from a [Tab Background Profile](36-tab-and-valve-profiles).

## Names have no spaces

Names of Devices, Widgets and Processes cannot have spaces any more. When you type a space in a name it becomes `_`. Names that already had spaces were changed once, for example `Test Timer` became `Test_Timer`. The screen still shows the old name, because it became the **Label**. Every Process that used the old name was updated too, and a copy of each one was kept as `.before-no-spaces.bak`.

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

## Lock the Equipment Profile

`lock_Equipment` locks the Equipment Profiles of every Tab of the loaded Schema (usually the Hot Side and Fermentation profiles), so their numbers, equipment and pipes can't be changed. `unlock_Equipment` unlocks them again. Put them on a line of their own, for example at the start and end of a brew day:

```
lock_Equipment
step "Mash in"
...
unlock_Equipment
```

The Process output says which profiles were locked. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles). A matching `lock_BrewDayRecipe` comes with the Brew Day Recipe.
