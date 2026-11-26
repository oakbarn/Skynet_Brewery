# Make a gGlobal in a Process

A **gGlobal** is a variable that every Process can use, and it keeps its value even when the Brain is turned off
(Help 108 and 118). Besides the **gGlobal** screen (☰ Menu > Variables), a gGlobal can also be made by a line in a
Process (Skynet Rule 1.24).

## Three ways to write it

All three lines below make the **same** gGlobal:

```
new gGlobalValue gblV_Mash_Temp = 152     // the long word
new gblV gblV_Mash_Temp = 152               // the short word
new value gblV_Mash_Temp = 152            // a normal variable word, but the name starts gblV_
```

`declare` works the same as `new`, so `declare gblV gblV_Mash_Temp` is fine too. The `= 152` is not needed.

| Kind | Long word | Short word | The name starts |
|---|---|---|---|
| a Value (a number) | `gGlobalValue` | `gblV` | `gblV_` |
| a String (text) | `gGlobalString` | `gblS` | `gblS_` |
| a Time | `gGlobalTime` | `gblT` | `gblT_` |
| a Date Time | `gGlobalDateTime` | `gblDT` | `gblDT_` |
| a Boolean (true or false) | `gGlobalBoolean` | `gblB` | `gblB_` |

A Graphic gGlobal (`gG_`) holds picture paths, so it is made only on the gGlobal screen.

## Predictive text helps

Pick **new gGlobalValue** from the list (or type `new gGlobalValue ` yourself) and the start of the name, `gblV_`, is put in for
you. Then type the rest of the name, for example `Mash_Temp`, and add `= 152` if you want a first value.

## What happens when the line runs

- **The first time** the line runs, the gGlobal is made. It is saved in the Schema, the same as one made on the gGlobal
  screen, and shows there in the list of its Kind. The `= 152` is its **first value** (with none, a Value starts at 0, a String
  empty, a Boolean false).
- **After that** the gGlobal is already there, so the line does nothing. It keeps the value it has (Rule 1.22), even if a
  Process changed it to 160. To start from a fresh value every time, set it on its own line: `gblV_Mash_Temp = 152`.
- The Output window says `Made the gGlobal gblV_Mash_Temp` the one time it is made.

## A gGlobal takes only its own Kind of value

Each gGlobal holds **one Kind** of value, and nothing else goes in (Skynet Rule 1.30):

```
gblT_HopDrop_1 = 00:15:00            // fine: a Time takes a time
gblT_HopDrop_1 = "My Hop Drop"       // error: "My Hop Drop" is text, not a time
new gblT gblT_HopDrop_1 = "My Hop Drop"   // the same error when it is made
```

| Kind | It takes | For example |
|---|---|---|
| Value (`gblV_`) | a number | `gblV_Mash_Temp = 152.5` |
| String (`gblS_`) | text in quotes | `gblS_Note = "Add the hops"` |
| Boolean (`gblB_`) | true or false (on or off) | `gblB_Grain_Added = true` |
| Time (`gblT_`) | a time | `gblT_HopDrop_1 = 00:15:00` |
| Date Time (`gblDT_`) | a date and time | `gblDT_Start = now` or `gblDT_Start = "11/09/2026 07:00:00"` |

A wrong value is **never changed into another Kind**. The gGlobal keeps the value it had, the Process stops, and the Output
window says what went wrong, for example:

> gblT_HopDrop_1 is a Time gGlobal: it only takes a time, such as 00:15:00. It was not changed, because "My Hop Drop" is text.

When the wrong value is typed right on the line, the **Check** finds it before the Process runs. When it comes from somewhere
else (a variable, a Device or a sum), it is found when the line runs.

To put a number into a String, put it after `"" +`: `gblS_Note = "" + 152` gives the text "152".

## .minute and .seconds on a Time gGlobal

A Time gGlobal can also be set with a **whole number** of minutes or seconds. The number is turned into a time, and it becomes
the **whole** value (big numbers roll over into minutes and hours):

```
gblT_HopDrop_1.minute = 5         // 00:05:00
gblT_HopDrop_1.seconds = 45       // 00:00:45
gblT_HopDrop_1.seconds = 126      // 00:02:06
gblT_HopDrop_1.seconds = 3726     // 01:02:06
gblT_HopDrop_1.minute += 5        // five minutes more
```

Read, they give the whole time in minutes or seconds: at 01:02:06, `gblT_HopDrop_1.minute` is 62 and `gblT_HopDrop_1.seconds` is
3726. Only whole numbers work: `gblT_HopDrop_1.minute = 2.5` or `gblT_HopDrop_1.minute = "five"` is an error.

## Mistakes the Check finds

| You wrote | Why it is wrong |
|---|---|
| `new value gblS_Note` | `gblS_` is for a String, but `value` is a number. Write `new string gblS_Note` or `new gblS gblS_Note`. |
| `new gGlobalValue Mash_Temp` | A gGlobalValue name starts `gblV_`: write `gblV_Mash_Temp`. |
| `new gblV gblV_Pump` when a Device is named `gblV_Pump` | The name is already used: pick another name. |
| `gblT_HopDrop_1 = "My Hop Drop"` | A Time gGlobal takes only a time, such as `00:15:00` (Rule 1.30). |
| `new gblS gblS_Old` when `gblS_Old` is already a Value gGlobal | A gGlobal's Kind can't change (Rule 1.19): use its own word, or delete it and make it again. |

A name with no gGlobal start (such as `vCount`) after `new value` is still a normal Process variable: only that Process can use
it, and it is cleared every time the Process starts.
