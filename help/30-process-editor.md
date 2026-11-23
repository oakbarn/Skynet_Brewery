# The Process editor

The **Processes** screen has two rows of tools above the editor, most of them pictures (icons):

- **The top row:** the Process list box, **New**, then **Delete** (the red trash can), **Recycle Bin**, **Check** (the green check mark), **Start** (red while the Process is stopped, green while it runs), **Stop**, **Restart** and **Save**. Your Brewery Name is in the middle (**Skynet Panel** when you are not a Patron). Then **Predictive text**, **Key** (what each color means), **📐 Constants**, and the Menu Bar: Sound, Emergency Off, the yellow **?** and **☰ Menu** (see [The Menu Bar](40-menu-bar)).
- **The second row:** **Stop all** (the red Stop Sign: it stops every running Process), **Find** (the magnifying glass), **Find in All Processes** (the magnifying glass on purple: it searches every Process), **Go To** (the arrow) with its **Line / Section** box, then **Insert Line After** with its light-blue box and five buttons: **Conditionals**, **Skynet Special**, **Devices**, **Widgets** and **Common**, each with a small gray ▾ because it opens a list (see below). At the right are **Undo**, **Save** and **Close**, in the same place on every page.

The Save picture on the top row and the Save button do the same thing. Every one of these is also on the **☰ Menu** while the Process editor is open, under **Process Editor**. The ☰ Menu also has the rest: the name, class, Version and state of the Process, **Update Version**, **Add steps**, **Restart if it fails**, **Suggest**, **Picture**, **Save to file**, **Colors** and **Rename**. The yellow Simulator bar is off while the Process editor is open; **☰ Menu > Show Simulator bar** brings it back until you leave.

**Problems and Output** are in a column to the right of the code:

- **At the top**, the problems Check found (click one to go to its line), or *No problems found*, and **Clear**, which empties the Output window.
- **Output** has a list with two choices. **Current Process** shows what the Process open in the editor prints. **All Variables** shows the value now of each of its variables (while it runs) and of every gGlobal, kept up to date each second.
- **Reset every Start** (off to start): when it is on, a Process's old Output lines are cleared each time that Process starts, so you see only this run. Each browser remembers both choices.

On a phone the column is under the code.

Every step of adding a Process, with pictures: [Step by Step: Add a Process](240-step-by-step-add-a-process).

## Insert Line After and the five buttons

**Insert Line After** puts lines in for you, with the right names and words. Its light-blue box holds a line number: what you pick goes in as a **new line after that line**, with the same indent, and the number moves down one so your next pick goes under it. Clicking in the Process puts the line you clicked on in the box, or type a number (**0** puts it at the very top).

- **Conditionals:** `if`, `elseif`, `else`, `endif`, `wait`, `goto`, `goLine`, `step` and a `[label]` for goto to jump to.
- **Skynet Special:** the commands only Skynet has (`ask`, `close_all_valves`, `open_all_valves`, `all_pumps_off`, `all_heaters_off`, `wait_boil`, `take_reading`, the hop alerts, the Chiller and the Equipment lock), the **skn_ names** (they go in at the cursor) and the **📐 Constants**.
- **Devices:** Pumps, Valves, Manual Valve, PWM, Heating Element and Probe.
- **Widgets:** Text, Audio, Graphic, Value, Time and DateTime.
- **Common:** every other normal command (`sleep`, `delay`, `start`, `stop`, `play`, `print`, `show tab`, `new value` ...).

A command picked from Conditionals, Skynet Special or Common goes in and the list closes. Devices and Widgets stay open for more picks; a click outside, **Esc** or the same button closes them.

- **The Devices and Widgets dropdowns** list only what is already in this Schema. Nothing is added to the Schema from here. Pick one first.
- **The buttons** under a dropdown put in the line for the one picked: `.visible = true`, `.state = true` (on or open), `.method = "PID"`, `.play = true`. The `.visible` and `.state` buttons go with whichever Pump, Valve, Manual Valve, PWM or Heating Element was picked last.
- **The light-blue boxes** are for typing a value for the dropdown or button just above: a sound file, a picture file, a number, a time, a date and time or the Setpoint (SV) of a Probe. Type it and press **Enter** (or the **.path =** button above it), and the whole line goes in, for example `w_Strike_Volume = 7.5`.

**Making a line by picking:** after a word that waits for a name (`if `, `wait `, `start ` ...) or a sign (`== `, `and ` ...), a Device or Widget you pick goes in right at the cursor, and **PV** (`.value`) or **SV** (`.setpoint`) after it. So Conditionals > **if**, then Devices > Probe > your Probe, then **PV**, gives `if HLT_Probe.value`; type the rest. **Ctrl+Z** takes any of it back out.

`Audio_1.play = true` plays an Audio Widget and `= false` stops it (the same as `.active`).

## Line numbers and Go To

Every line has its number down the left side. A red number is a line with a problem, a green one is the line a running Process is on.

**Go To** jumps to a line or a Section:

- Pick **Line** in the box beside the Go To arrow, type the line number in the light-blue box and press **Enter** (or the Go To arrow).
- Pick **Section**, type the Section's name (for example **Sparge**) and press **Enter**. A Section is a `step "Sparge"` line or a `[Sparge]` label. The whole name finds it, and so does part of it. The light-blue box gets wider as you type.
- With the box empty, the Go To arrow (or **Ctrl+G** on a PC) asks for the line number. Ctrl+G works in the **Schema.json** editor too.

The line is highlighted and scrolled into view.

## Opening the Process editor and picking a Process

Open the Process editor from **☰ Menu > Processes**, or, while you are in **Edit layout**, with **📝 Processes** on the Edit layout bar (next to 🔨 Build Tab). Go back with **☰ Menu > Tabs**.

The editor opens ready to edit: it shows the Process you had open last on this computer or phone (the first time, the first Process in the list). Click in the box and type, then press **Save**.

Pick the Process to work on in the list box at the top of the editor. **➕ Add New Process...** is first in that list; then come your Processes, grouped by class (Flow, Sub, Repeat, Looper) in their Order. The list down the left side still works too, and is where you change the Order numbers.

## A new Process

1. Press **New** (or pick **➕ Add New Process...** in the list box) and type the name. Spaces are fine: they become **_** in the Process name (**My New Brew Process** becomes **My_New_Brew_Process**, which is how another Process starts it: `start My_New_Brew_Process`). Line 1 of the new Process keeps the name as you typed it.
2. The **New Process** box asks what kind it is. Click one of the four boxes (it turns red), then press **Save**:
   - **Flow**: the brew itself. Flow Processes follow a Brew Day, one starting the next. They are numbered 1, 2, 3 ... in the order they start each other.
   - **Sub**: a job used in more than one place (fill a vessel, run a transfer), called by a Flow Process. Numbered S1, S2, S3 ...
   - **Repeat**: a small common helper, often a wait place in the Process that calls it. Numbered R1, R2, R3 ...
   - **Looper**: runs in the background on its own and is never called. Numbered L1, L2, L3 ... Override and Stop all leave it running.
3. **The kind can not be changed once it is saved.** It shows next to the Process name. If you picked the wrong one, make a new Process and paste the text in.

**Close** (or ✕) makes nothing. The new Process starts with a few lines: its name, then `// Use at YOUR own Risk! Follow Your Own Safety Guidelines. You are Responsible.` (every Process has it on line 2, the Skynet samples and Process Templates too), **Created on** with the date and time it was made (for example `//Created on 261123 14h 23M`: year, month, day, then hours and minutes), the line `//This Process was written by its user, not by Skynet`, then some comments that remind you to say what the Process does and show how comments are written (`/* ... */` for several lines, `//` for one). A Patron's new Process also says **Created by** your Brewery Name, the MIT License line and **Copyright ©** your Brewery Name (see [Patron](198-patron)). Skynet did not write your Process, so without a Brewery Name these lines are left out; you can type your own.

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
5. Open a Process (a `.txt` file in the `processes` folder), then click **Language** and pick **Skynet Process** near the bottom of the list.

A general file that colors commands, comments, numbers, text, operators and names starting with `gG` (gGlobals) is in the panel folder as `docs/Skynet_Process_Notepad++.xml`.

## Delete and the Recycle Bin

**Delete** does not erase a Process. It asks first, then moves the Process to the **Recycle Bin** (the `processes/Recycle_Bin` folder on the Brain).

Press **Recycle Bin** (the black bin with the recycle arrows, on the top row) to see what was deleted and when:

- **Look** shows what is in it, in color.
- **Restore** asks you to confirm, then puts the Process back in the list with its class and its "Restart if it fails" setting. If a Process with that name exists now, you are asked for another name to restore it as.
- **Delete for good** asks you to confirm, then erases it. This cannot be undone.

Everyone can look in the Recycle Bin; only admins can restore or erase.

## Find and Replace

**Find** (or **Ctrl+F**; **Ctrl+H** to replace) searches the open Process. **Aa** matches upper and lower case, **Whole word** skips longer names. Up and down buttons (or **Enter** and **F3**) move between matches. **Replace** changes one match, **Replace all** every match; press **Save** to keep them, **Ctrl+Z** undoes them.

The same bar (Ctrl+F and Ctrl+H) is in the **Process Template** editor (☰ Menu > Brew Process > **👁 View** or **✏ Edit**) and the **Help** text editor (**✏ Edit page**). Every match is lit and the current one is darker. A Skynet Process Template can't be changed, so it has Find but no Replace.

**All Processes** searches every Process and lists each match with how the line will look after the change. Untick the ones to leave alone, then press **Replace ticked** to save those Processes. A running Process keeps the old text until it is restarted.

## The Schema.json editor (admins)

The **Schema.json** page (admins only, on the Top Line; it was called **Config** before) shows the whole setup file, `config/brewery.json`, as text: tabs, Devices, Widgets, pipes, Interfaces and settings. It has the same **Find**, **Replace** and **Go to line**.

- **Check** tests the file the way the panel loads it at start-up and points at the line with a problem.
- **Save** checks it first and will not save a file the panel cannot load. Saving stops running Processes and reconnects the boards. The old file is copied to `config/backups` first.
- **Save as .json file** saves a Schema as one `.json` file on this computer (see the Help page *Schema.json*).
- **Backups** lists the copies. **Open** shows one in the editor (nothing changes until you press Save); **Restore** puts it back after asking.
