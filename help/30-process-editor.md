# The Process editor

The **Processes** screen has a row of tools above the editor: **Find**, **All Processes**, **Go to line**, **Save to file**, the **Colors** switch and the **Color key**. The **Recycle Bin** button is under the Process list.

## Line numbers and Go to line

Every line has its number down the left side. A red number is a line with a problem, a green one is the line a running Process is on.

To jump to a line, press **Go to line** (or **Ctrl+G** on a PC), type the number and press **OK**. The line is highlighted and scrolled into view. Go to line works in the **Schema.json** editor too.

## Opening the Process editor and picking a Process

Open the Process editor from **☰ Menu > Processes**, or, while you are in **Edit layout**, with **📝 Processes** on the Edit layout bar (next to 🔨 Build Tab). Go back with **☰ Menu > Tabs**.

Pick the Process to work on in the list box at the top of the editor. **➕ Add New Process...** is first in that list; then come your Processes, grouped by class (Flow, Sub, Repeat, Looper) in their Order. The list down the left side still works too, and is where you change the Order numbers.

A Process has a hidden key, so **Rename** only changes its name: every other Process that starts or stops it is updated to the new name by itself. See the Help page Name change and hidden keys.

## Predictive text: Ctrl+Space

While you type, a list offers the commands and names that fit; press **Ctrl+Space** or **💡 Suggest** to see what can go at the cursor. See [Predictive text](79-predictive-text).

## Picture paths: Alt+P

Press **Alt+P** (Option+P on a Mac) or the **Picture** button to pick a picture or sound from a list, one group or all, and have its path typed where the cursor is. See [Picture groups](57-picture-groups).

## Colors

The words of a Process are colored by what they do:

| Color | What it is | Example |
|---|---|---|
| Blue | Commands and their words | `if`, `wait`, `start`, `new value`, `true`, `now` |
| Magenta | Devices (on a port of a PLC) | `Pump_Red`, `HLT_Temp` |
| Teal | Widgets (only in the app) | `tm_Mash`, `alm_Hops` |
| Purple | gGlobals | `gGV_Strike_Target` |
| Black on white | Variables made in this Process | `new value count`, then `count` |
| Olive | Names of Processes | `start sub_Fill` |
| Orange | Operators | `=  +  -  *  /  <  >  ==  and  or  not` |
| Brown | Text in quotes | `"Mash in"` |
| Gold | Numbers and times | `185.5`, `00:10:00` |
| Green | Comments | `// note` |
| Gray | Labels and attributes | `[Mash]`, `goto Mash`, `tm_Mash.visible` |

A name that is not a Device, Widget, gGlobal, variable or Process stays plain. That is a quick way to spot a typo.

Press **Color key** to see the list on screen. The **Colors** switch turns the colors off and on for you only (other people keep their own choice). With the phone or PC in dark mode the colors are a little lighter so they are easy to read.

## Comments from other languages

A comment is a note for people; the Process skips it. These all work:

```
// a comment, as in C, C++, C#, JavaScript and Node.js
# a comment, as in Python
' a comment, as in Visual Basic
/* a comment that can go
   over several lines, as in C, C++, C#, JavaScript */
V_HLT_Out = true    // a comment can also go at the end of a line
```

Text in quotes is never a comment, so `print "Pump #2"` prints `Pump #2`. Lines inside `/* ... */` are left alone when a Process is saved, so step numbers and the new style are not put into your notes.

## Save to file

Open the **Save to file...** list and pick what to save. The file goes to the Downloads folder of the computer or phone you are using.

- **Whole Process as text (.txt)**: the Process exactly as it is in the editor.
- **Whole Process as XML in color (.xml)**: open it in any web browser (Edge, Chrome, Safari, Firefox) to see the Process in color with line numbers and a color key. The plain text is kept inside it as well, so other programs can read it.
- **Highlighted part as text (.txt)** and **Highlighted part as XML in color (.xml)**: first highlight some lines in the editor (drag over them, or on a phone press and hold, then drag the handles), then pick one of these. The file name says which lines, for example `Fill_HLT_lines_7-18.xml`.
- **Notepad++ colors file**: see below.

What is saved is what you see in the editor, even before you press **Save**.

## Colors in Notepad++

**Notepad++ colors file** makes `Skynet_Process_Notepad++.xml` with the same colors as the panel and the names of your own Devices, Widgets, gGlobals, variables and Processes. When you add new names, save the file again and import it again.

To use it on a Windows PC:

1. Open Notepad++.
2. Click **Language**, then **User Defined Language**, then **Define your language...**.
3. Click **Import...**, pick `Skynet_Process_Notepad++.xml` and click **Open**. Close the window.
4. Close Notepad++ and open it again.
5. Open a Process (a `.txt` file in the `scripts` folder), then click **Language** and pick **Skynet Process** near the bottom of the list.

A general file that colors commands, comments, numbers, text, operators and names starting with `gG` (gGlobals) is in the panel folder as `docs/Skynet_Process_Notepad++.xml`.

## Delete and the Recycle Bin

**Delete** does not erase a Process. It asks first, then moves the Process to the **Recycle Bin** (the `scripts/Recycle_Bin` folder on the Brain).

Press **Recycle Bin** under the Process list to see what was deleted and when:

- **Look** shows what is in it, in color.
- **Restore** asks you to confirm, then puts the Process back in the list with its class and its "Restart if it fails" setting. If a Process with that name exists now, you are asked for another name to restore it as.
- **Delete for good** asks you to confirm, then erases it. This cannot be undone.

Everyone can look in the Recycle Bin; only admins can restore or erase.

## Find and Replace

**Find** (or **Ctrl+F**; **Ctrl+H** to replace) searches the open Process. **Aa** matches upper and lower case, **Whole word** skips longer names. Up and down buttons (or **Enter** and **F3**) move between matches. **Replace** changes one match, **Replace all** every match; press **Save** to keep them, **Ctrl+Z** undoes them.

**All Processes** searches every Process and lists each match with how the line will look after the change. Untick the ones to leave alone, then press **Replace ticked** to save those Processes. A running Process keeps the old text until it is restarted.

## The Schema.json editor (admins)

The **Schema.json** page (admins only, on the Menu Bar; it was called **Config** before) shows the whole setup file, `config/brewery.json`, as text: tabs, Devices, Widgets, pipes, Interfaces and settings. It has the same **Find**, **Replace** and **Go to line**.

- Opening it copies the file to `config/backups` first (no new copy when nothing changed).
- **Check** tests the file the way the panel loads it at start-up and points at the line with a problem.
- **Save** checks it first and will not save a file the panel cannot load. Saving stops running Processes and reconnects the boards. The old file is copied to `config/backups` first.
- **Save as .json file** saves a Schema as one `.json` file on this computer (see the Help page *Schema.json*).
- **Backups** lists the copies. **Open** shows one in the editor (nothing changes until you press Save); **Restore** puts it back after asking.
