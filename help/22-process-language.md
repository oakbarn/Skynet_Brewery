# Process language and steps

Processes are now written the way most programming languages work.

## The name alone is the main value

Write the name of a Device or Widget on its own. You never need `value`, `state` or `active`.

```
Pump_Red = true
alm_StrikeSpargeMash_ALARM = true
Kettle_SetPoint = 185.5
if Kettle_SetPoint == 185.5
wait tm_Mash <= 00:00:00
```

The main value of each kind:

- Digital Out, Switch, Digital In, Duty Cycle, Hysteresis: on or off (`true` / `false`)
- Alarm: sounding or not (`true` / `false`)
- Timer: its time
- gGlobal: its value
- Temperature, Analog In and Out, PWM, PID, Scale: their reading or value
- Flow meter: its flow rate

## Other attributes use a dot

```
my_Widget.visible = false
tm_Mash.countdown = true
tm_Mash.label = "Mash rest"
Kettle_Temp.background = 2
Pump_Red.image = "RedPump.png"
if Hop_Text.visible == true
```

`.image` changes the item's picture: the path goes into .backpath and background becomes 1. `.background = 1`, `2` or `3` shows .backpath, .backpath_2 or .backpath_3; 0, blank or any number over 3 shows no background. See [Pictures on items](25-picture-paths). A file name alone is enough (Skynet adds its folder), a Skynet picture can also be given by its number, and every picture or sound has `.path` (the whole path) and `.file` (the file name): see [Two-part paths](194-two-part-paths) and [Skynet Picture numbers](193-skynet-picture-numbers).

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

You can mix both styles in one Process. **Save** never changes one style into the other.

## Codes inside text

Text in quotes can carry codes that change how it looks on the screen. They work wherever a Process shows text: a string value on a Tab, a label, `print` lines in the Process output, and pop-ups such as a manual valve's message. Bold, large, subscript and superscript are switches: the first code turns it on, the next one turns it off.

| Code | What it does | Example | Shows |
|---|---|---|---|
| `\n` | a new line | `"Mash in\nStir well"` | Mash in, then Stir well on the next line |
| `\t` | an indent (about four spaces wide) | `"Mash in\n\tStir well"` | Stir well, pushed in, on the next line |
| `\b` | bold on / off | `"Add \bhops\b now"` | Add **hops** now |
| `\L` | large text on / off | `"\LSTRIKE\L 165"` | STRIKE in large letters |
| `\_` | subscript on / off | `"CO\_2\_"` | CO₂ |
| `\^` | superscript on / off | `"ft\^3\^"` | ft³ |
| `\deg` | a degree sign | `"152\degF"` | 152°F |
| `\\` | one backslash | `"C:\\Brewing"` | C:\Brewing |

Codes can be used together: `"\L\bBOIL\b\L 60 min"`.

Use `\t` and `\n` to lay text out, not extra spaces: a Label can't start or end with a space (they are trimmed).

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
- `valueType` is `LED`, `Text`, `Gauge` (LCD digits) or `Dial` (the Skynet Dial: an arc with a needle and the reading under it, Help 152). Something with an ON / OFF state (a pump, valve, switch) can only be `LED` or `Text`.
- `""` puts back the look set in its properties.

Every text box also has `.foreColor`, `.backColor`, `.alignment` (Left, Center, Right), `.width`, `.height`, `.x_hPosition` and `.y_vPosition`, for example `Pump_1.foreColor = "Red"` or `Text_1.x_hPosition = 400`. A Text added with **+ Text** has a name too (`Text_1`). See [Text boxes](49-text-boxes).

The change lasts until the panel restarts. To keep a look, set it in the item's properties, or start new items from a [Tab Background Profile](36-tab-and-valve-profiles).

## Skynet Constants

Fixed numbers for common conversions are built in, so a Process can write `gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb`. Every one starts with `skc_` and none can be changed. The full list is in [Skynet Constants](94-skynet-constants).

## NULL: the empty value

`NULL` means **no value at all**. It is not 0, not `false` and not `""`: it is empty.

1. **Empty a value:** `gV_Strike = NULL`. Its box on the Tab shows **blank** until something sets it again, and it stays empty after a restart.
2. **Ask if it is empty:** `if gV_Strike == NULL` (or `!= NULL` for "has a value").
3. **Math needs a value:** `gV_Strike + 5`, `gV_Strike += 1` or `if gV_Strike > 150` on an empty value **stops the Process** and says which value is empty. Test it first:

```
if gV_Strike == NULL
  gV_Strike = 152
endif
gV_Strike = gV_Strike + 1
```

`NULL` works for every Kind: a number, text, a time, a date and time, or true / false, in a Process variable, a gGlobal or a Value Widget. A Device (a pump, a valve, a Heating Element) is always on or off, so `Pump_1 = NULL` is an error. `NULL`, `Null` and `null` are the same word.

### The technical side

`NULL` is a reserved word (below). Only `= NULL` makes a value empty: nothing turns into `NULL` on its own, and a sensor with no reading is not `NULL`. `==` and `!=` are the only questions that take `NULL`; `+ - * / ^`, `< > <= >=` and `+= -= *= /=` stop the Process with the line number. `NUL` is a different word: it is one of the names Windows keeps for itself, so it can't be a name and does nothing in a Process.

## Reserved words

These words belong to the Process language, so none of them can be the name of a Device, Widget, gGlobal or Process variable. Upper and lower case are the same (`NULL` = `null`).

- **Values:** `NULL`, `true`, `false`, `on`, `off`, `now`, `visible`, `hidden`, `hiddenlocked`, `countdown`, `countup`, `none`, `custom`, `default`
- **Joining words:** `and`, `or`, `not`
- **Kinds of variable:** `value`, `string`, `bool`, `time`, `datetime`
- **Commands:** `if`, `elseif`, `else`, `endif`, `goto`, `goLine`, `sleep`, `wait`, `start`, `stop`, `restart`, `reset`, `print`, `clear`, `show`, `new`, `declare`, `play`, `step`, `ask`, `send_db`, `DBSend` (after a name: `HLT_PID.setpoint DBSend`), `send_db_group`, `start_db_group`, `stop_db_group`, `lock_equipment`, `unlock_equipment`, `close_all_valves`, `open_all_valves`, `open_valve`, `close_valve`, `all_pumps_off`, `import_recipe`, `start_hop_alerts`, `stop_hop_alerts`, `take_reading`
- **Places:** `tab`, `workspace`
- **Skynet Constants:** every name that starts with `skc_` (see above)

The names Windows keeps for itself (CON, PRN, AUX, NUL, COM1 to COM9, LPT1 to LPT9) can't be names either. See [Allowed names](63-allowed-names).

## Go to a line: goLine

Processes have automatic line numbers. `goLine` goes to a line number, the same way `goto` goes to a section (a `[label]`):

```
234  some Code
235  [My New Section]

goto "My New Section"
goLine 235
```

These two lines do the same thing.

**The number follows its line** when lines are added or taken out. Skynet does this in the Background and needs no user input.

A goLine to a line the Process does not have is an error, and the Process does not start.

## Names have no spaces

Names of Devices, Widgets and Processes cannot have spaces any more. When you type a space in a name it becomes `_`. Names that already had spaces were changed once, for example `Test Timer` became `Test_Timer`. The screen still shows the old name, because it became the **Label**. Every Process that used the old name was updated too, and a copy of each one was kept as `.before-no-spaces.bak`.

## Autofill

There is more on this, including **Ctrl+Space** and writing a line by picking, in [Predictive text](79-predictive-text).

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

While a Process runs, the Processes screen shows the step it is on. To show it on a tab, add a **gGlobal** with the kind **Step**. In its properties, **Shows the steps of** picks the class to follow (Flow unless you change it). It then shows, for example, `2.00003  Mash in`.

## Lock the Equipment Profile

`lock_Equipment` locks the Equipment Profiles of every Tab of the loaded Schema (usually the Hot Side and Fermentation profiles), so their numbers, equipment and pipes can't be changed. `unlock_Equipment` unlocks them again. Put them on a line of their own, for example at the start and end of a brew day:

```
lock_Equipment
step "Mash in"
...
unlock_Equipment
```

The Process output says which profiles were locked. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles). A matching `lock_BrewDayRecipe` comes with the Brew Day Recipe.
