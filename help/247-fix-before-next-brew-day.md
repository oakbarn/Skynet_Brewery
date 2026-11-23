# Fix before next Brew Day (the Process Error Log)

**☰ Menu > 🔧 Fix before next Brew Day** is a list of what needs fixing before your next brew (Skynet Rule 10.13). The number
beside it is how many are still open. Everyone can read it. Brewers and Admins can add to it, check entries and tick them off.

## Every Process error is written here by itself

When a Process stops on an error, or does not start because of one, an entry is added with:

- the **time**, the **Process** and the **line number**,
- the **line itself**, as it was when it ran,
- **what the error was**,
- **💡 How to fix**, when the fix is clear (for example a name spelled differently from the Devices page, or an `if` with no `endif`).

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

## How long they are kept

The list is kept on the Brain, so a restart keeps it. Open entries stay until they are fixed or deleted. Fixed ones are kept for
90 days.
