# Make a gGlobal in a Process

A **gGlobal** is a variable that every Process can use, and it keeps its value even when the Brain is turned off
(Help 108 and 118). Besides the **gGlobal** screen (☰ Menu > Variables), a gGlobal can also be made by a line in a
Process (Skynet Rule 1.24; OakBarn Brewery, 2026-11-06).

## Three ways to write it

All three lines below make the **same** gGlobal:

```
new gGlobalValue gV_Mash_Temp = 152     // the long word
new gV gV_Mash_Temp = 152               // the short word
new value gV_Mash_Temp = 152            // a normal variable word, but the name starts gV_
```

`declare` works the same as `new`, so `declare gV gV_Mash_Temp` is fine too. The `= 152` is not needed.

| Kind | Long word | Short word | The name starts |
|---|---|---|---|
| a Value (a number) | `gGlobalValue` | `gV` | `gV_` |
| a String (text) | `gGlobalString` | `gS` | `gS_` |
| a Time | `gGlobalTime` | `gT` | `gT_` |
| a Date Time | `gGlobalDateTime` | `gD` | `gD_` |
| a Boolean (true or false) | `gGlobalBoolean` | `gB` | `gB_` |

A Graphic gGlobal (`gG_`) holds picture paths, so it is made only on the gGlobal screen.

## Predictive text helps

Pick **new gGlobalValue** from the list (or type `new gGlobalValue ` yourself) and the start of the name, `gV_`, is put in for
you. Then type the rest of the name, for example `Mash_Temp`, and add `= 152` if you want a first value.

## What happens when the line runs

- **The first time** the line runs, the gGlobal is made. It is saved in the Schema, the same as one made on the gGlobal
  screen, and shows there in the list of its Kind. The `= 152` is its **first value** (with none, a Value starts at 0, a String
  empty, a Boolean false).
- **After that** the gGlobal is already there, so the line does nothing. It keeps the value it has (Rule 1.22), even if a
  Process changed it to 160. To start from a fresh value every time, set it on its own line: `gV_Mash_Temp = 152`.
- The Output window says `Made the gGlobal gV_Mash_Temp` the one time it is made.

## A gGlobal takes only its own Kind of value

Each gGlobal holds **one Kind** of value, and nothing else goes in (Skynet Rule 1.30):

```
gT_HopDrop_1 = 00:15:00            // fine: a Time takes a time
gT_HopDrop_1 = "My Hop Drop"       // error: "My Hop Drop" is text, not a time
new gT gT_HopDrop_1 = "My Hop Drop"   // the same error when it is made
```

| Kind | It takes | For example |
|---|---|---|
| Value (`gV_`) | a number | `gV_Mash_Temp = 152.5` |
| String (`gS_`) | text in quotes | `gS_Note = "Add the hops"` |
| Boolean (`gB_`) | true or false (on or off) | `gB_Grain_Added = true` |
| Time (`gT_`) | a time | `gT_HopDrop_1 = 00:15:00` |
| Date Time (`gD_`) | a date and time | `gD_Start = now` or `gD_Start = "11/09/2026 07:00:00"` |

A wrong value is **never changed into another Kind**. The gGlobal keeps the value it had, the Process stops, and the Output
window says what went wrong, for example:

> gT_HopDrop_1 is a Time gGlobal: it only takes a time, such as 00:15:00. It was not changed, because "My Hop Drop" is text.

When the wrong value is typed right on the line, the **Check** finds it before the Process runs. When it comes from somewhere
else (a variable, a Device or a sum), it is found when the line runs.

To put a number into a String, put it after `"" +`: `gS_Note = "" + 152` gives the text "152".

## .minute and .seconds on a Time gGlobal

A Time gGlobal can also be set with a **whole number** of minutes or seconds. The number is turned into a time, and it becomes
the **whole** value (big numbers roll over into minutes and hours):

```
gT_HopDrop_1.minute = 5         // 00:05:00
gT_HopDrop_1.seconds = 45       // 00:00:45
gT_HopDrop_1.seconds = 126      // 00:02:06
gT_HopDrop_1.seconds = 3726     // 01:02:06
gT_HopDrop_1.minute += 5        // five minutes more
```

Read, they give the whole time in minutes or seconds: at 01:02:06, `gT_HopDrop_1.minute` is 62 and `gT_HopDrop_1.seconds` is
3726. Only whole numbers work: `gT_HopDrop_1.minute = 2.5` or `gT_HopDrop_1.minute = "five"` is an error.

## Mistakes the Check finds

| You wrote | Why it is wrong |
|---|---|
| `new value gS_Note` | `gS_` is for a String, but `value` is a number. Write `new string gS_Note` or `new gS gS_Note`. |
| `new gGlobalValue Mash_Temp` | A gGlobalValue name starts `gV_`: write `gV_Mash_Temp`. |
| `new gV gV_Pump` when a Device is named `gV_Pump` | The name is already used: pick another name. |
| `gT_HopDrop_1 = "My Hop Drop"` | A Time gGlobal takes only a time, such as `00:15:00` (Rule 1.30). |
| `new gS gS_Old` when `gS_Old` is already a Value gGlobal | A gGlobal's Kind can't change (Rule 1.19): use its own word, or delete it and make it again. |

A name with no gGlobal start (such as `vCount`) after `new value` is still a normal Process variable: only that Process can use
it, and it is cleared every time the Process starts.
