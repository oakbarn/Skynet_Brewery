# Fix before next Brew Day (the Process Error Log)

**☰ Menu > 🔧 Fix before next Brew Day** is a list of what needs fixing before your next brew (Skynet Rule 10.13). The number
beside it is how many are still open. Everyone can read it. Brewers and Admins can add to it, check entries and tick them off.

## Every Process error is written here by itself

When a Process stops on an error, or does not start because of one, an entry is added with:

- the **time**, the **Process** and the **line number**,
- the **line itself**, as it was when it ran,
- **what the error was**,
- **💡 How to fix**, when the fix is clear (for example a name spelled differently from the Devices page, or an `if` with no `endif`).

The Process, its line number and what the error was are in **red**. When the error lists the names you can use (for example a
Recipe value that is spelled wrong), the list starts on its own line after **Possible Suggested Replacement at Line N:** in light
blue: pick the one you meant and put it in that line.

The same error on the same line again (in a loop, for example) stays one entry, with how many times it happened.

**How exact is the line number?** It is the line in the Process file, the same number as in the Process Editor, counting blank
lines and comment lines. Two things to know:

- Two commands on one line (`X = 1; Y = 2`) share that line's number. The line's text is shown, so you can see which one it was.
- If you save a Process while it is running, the copy that is running is the old one, so its line numbers can be off. The entry
  says so.

## Fix it, then 🧪 Check it

1. **✎ Open line** opens the Process in the Process Editor at that line. Fix it and **Save**. The entry keeps the fix: the line
   as it was and as it is now.
2. **🧪 Check** runs the saved Process in a **check-only simulation**: every Device, Widget and gGlobal is read as it is now, but
   **nothing real is switched**, nothing goes to the database and nothing is saved. A brew that is running is not touched.
   - It starts **just above the error line** with the values the Process had when the error happened.
   - It stops at the **next wait or step** (or a sleep, or a line that asks something), at the end of the Process, or at an error.
   - It shows what it would have set, for example `HLT_Element = true`.
   - **▶ Override** goes on past that wait, the way the Override pop-up does on Brew Day, and checks up to the next one.
3. No error: the entry moves to **Fixed**, with the fix. An error: the entry stays open and shows the new line and message.

**✔ Fixed** ticks an entry off by hand (a Check is not needed), and **↩ Open again** puts it back. **Delete** removes it.

## Your own issues

Type an issue in the box at the top, for example *the HLT valve sticks*, and press **➕ Add an issue**. The Tab you were on (or the
Process open in the Process Editor) is written with it. It stays on the list until you tick it off.

## Resume after an error

When a Process stops on an error during a brew (Skynet Rule 10.14), **everything is left as it is** and a red pop-up shows on every
screen with the Process, the line, the line itself and the error. The first time an error happens, Skynet always waits for you to
pick:

- **🔧 Fixed hardware: try line N again**: you fixed or swapped what failed (a pump, a valve, a heater). That same line runs again
  and the Process goes on from there, with the values it had. If it fails again, fix more and try again.
- **✎ Fix Process code** opens the Process in the Process Editor at that line. The line shows with a **red background and bold
  yellow text** while it is on this list. Fix it and **Save**, then press **🔧 Try again** on the pop-up: the saved Process runs from
  that line. When a **🧪 Check** finds no error (or you tick **✔ Fixed**), the line goes back to normal colors.
- **▶ Resume at the next line** leaves that line out and goes on at the next one (for example line 77 fails, it goes on at 78). Use
  it when you worked around the problem, for example you re-routed through the RIMS.
- **⏭ Ignore this error in any Process and go on** leaves the line out and goes on. From then on, the same error (the same words),
  in any Process and on any line, is left out by itself with no pop-up until the Brain restarts. It is still written in the Console
  and on this list. You get one warning: you are responsible, so stay with the brew and watch it.
- **✕** leaves the Process stopped and closes the pop-up on every screen.

The pop-up stays until someone picks. Starting the Process over lets it go. The error is still written on this list, so you can fix
the Process before the next Brew Day.

## How long they are kept

The list is kept on the Brain, so a restart keeps it. Open entries stay until they are fixed or deleted. Fixed ones are kept for
90 days.
