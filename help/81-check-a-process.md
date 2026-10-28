# Check a Process

The **🔍 Check** button in the Process editor finds the mistakes in a Process before Brew Day. It runs the Process in a **checking mode**, a bit like Simulation, but much faster and much safer:

- **Nothing is switched.** No pump, valve, heater or alarm is touched, no board is told anything, and nothing is saved or logged. The check works on a scratch copy of every value.
- **No waiting.** Every `sleep` and every `wait` takes no time: a pretend clock moves on instead, and timers count down with it. A three hour brew is checked in a moment.
- **The Process is not started.** It doesn't show as running, and other Processes keep doing what they do.
- **Unsaved changes are checked too.** It checks what is in the editor now, saved or not.

Check is for Admins (the same people who can edit Processes).

## What it looks for

1. **Spelling and names**, on every line: a command it doesn't know (`sleeep`), a name that is not a Device, Widget, variable or Process (`Pump_Wrot`), a `goto` with no label, an `if` with no `endif`, a missing `"` or `)`, curly quotes from a word processor.
2. **Running it.** When the spelling is right, the Process is run from the top, line by line, with today's values. This finds what only shows up when it runs: a variable used before `new`, dividing by 0, an attribute a Device doesn't have (`Pump_Wort.visble`), setting a sensor (a sensor is read, never set), a `wait` on a timer that was never started (it would wait for ever), a `show` of a Tab that doesn't exist.

When a line has a problem, the check carries on with the next line, so one check finds as many problems as it can.

## The Error dialog

When the check finds something, the **Error dialog** opens. For each problem it shows:

- **Where**: Error or Warning, its number (1 of 3), and the **line number**. The line is also picked in the editor behind the dialog.
- **What is wrong**, in plain words.
- **The code on this line**, as it is now.
- **Suggested fix**: what to do about it. Often it has a guess, for example *Did you mean Pump_Wort?*
- **Fixed code**: a box with the line rewritten the suggested way. You can change it any way you like, even type several lines.
- **At line**: where the fixed code goes. Usually the problem's own line; for a missing `endif` it is the end of the Process, and you can change it.

The buttons:

| Button | What it does |
|---|---|
| **◀ Previous** / **Next ▶** | Moves between the problems |
| **↺ Replace line** | Puts the fixed code in place of the line. An empty box deletes the line (it asks first). |
| **➕ Insert above** | Puts the fixed code in as new line(s) above **At line**, and keeps the line that is there |
| **✖ Close** | Closes the dialog and changes nothing |

The button the suggestion fits best is the blue one. After Replace or Insert the Process is **checked again by itself**, and the dialog shows what is left. The change is in the editor but **not saved yet**: press **Save** to keep it.

A **⚠ Warning** is something that may be right on purpose, like a wait on a timer that another Process starts. An **✖ Error** would stop the Process on Brew Day.

## No problems found

When everything is fine the dialog says **✔ No problems found**, and tells you:

- how many lines ran, and how long the Process would take at least on the real panel;
- the lines that **did not run** because an `if` was false with today's values. They were checked for spelling and names, but not run. Change the value and Check again to try that part;
- what was **pretended** in the check: a wait on a temperature, level, weight or flow is pretended reached; a wait on a button or switch is pretended pressed; a Manual valve is pretended done; starting another Process is only noted (check that one on its own);
- what the Process would **print**.

## Good to know

- A Process that goes round in a loop (a Looper, or a `goto` back up) is followed three times round, then the check stops by itself and says so. That is not a problem.
- `restart` on its own ends the check, the same as it would start the Process over.
- The check uses the values on the panel now. A part that depends on a reading (`if Mash_Temp > 150`) may run differently on Brew Day.
- The old **Check** (spelling and names only) is now part of 🔍 Check. Save still shows the spelling problems under the editor, the same as before.
