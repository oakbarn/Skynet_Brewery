# Every Device dialog looks like the Pump's

Every Device's Properties work the same way as the Pump's (Skynet Rule 18.31). Once you know the Pump's dialog, you know them all.

## From the top

1. The title, with the 🔓 lock, **Visible** and **Hidden Locked** beside it. The buttons are together in the upper right corner, frozen, always in the same order: **🗑 Delete · 💾 Save · Close · ✕** (Skynet Rule 2.54). They stay put while the rest scrolls (there is no row of buttons at the bottom).
2. **1. Label**: the ⬆ opens a bigger box to type in, the ⬢ sets its font, size and colors. **Label Visible** shows or hides it on the Tab.
3. **2. Interface** with its **Port** (or **1-Wire Index**) on the same line. They are greyed out: they are the wiring, set when the Device
   was added. Where the Device has them, the ⬢ holds **Invert** and **One-shot**.
4. **3. Tab**, **Layer Order** under it, and **4. Name**, with the Suggested Name under it.
5. A Device with pictures: the **Graphic**, its **Path**, and the **Overlay** with **Toggle** (outputs) and **Database and .API ⬢**
   on the same line. A Device with no pictures has **Database and .API ⬢** on a line of its own.
6. Its own settings: only what that kind of Device needs (a PID's Input, Setpoint, Kp ...; a sensor's Signal and Units ...).
7. **Text attributes ⬢** (the look of its value or On / Off text), **X**, **Y**, **Width** and **Height** on one line, and the **Device Type** last.

Rest the mouse on any field name to see what it is for (Help 147).

## Every dialog, the same way

Every dialog in Skynet, not only the Device ones, follows the Blichmann RipTide Pump dialog (Skynet Rule 18.44):

- **The buttons are frozen at the top, in the upper right corner, always in the same order** (Skynet Rule 2.54):
  **Delete · Save · Undo · Close · ✕**. A dialog leaves out a button it does not have (a Properties box has no Undo, a pop-up says
  **Keep** in place of Save, an Add box says **➕ Add Device**); the others keep their order, so each button is always in the same
  place. **Close** (it was Cancel) and the boxed **✕** close without saving, and ask first when you changed something. The title and
  its buttons stay where they are while you scroll, so you never have to scroll to the bottom to Save. There is no second row of
  buttons at the bottom.
- **⛔ = can not be changed here.** A greyed out box shows the red Do Not Enter sign at its right end while the mouse is on the box
  or its name (Skynet Rule 18.45: the dialog stays clean). The box shows what it is, but you can not type in it or pick from it here
  (for example the Interface and Port once a Device is added, or the Device Type). A greyed out box has **no Hover Help**: the ⛔
  is all it shows (Skynet Rule 18.46).
  ![A greyed out box with the Do Not Enter sign](help_pictures/Greyed_Do_Not_Enter.png)
- **Every ⬢ and ⬆ pop-up** has its title and **🗑 Delete · 💾 Keep · Close · ✕** frozen at the top. Keep puts what you set back into the dialog;
  the dialog's own 💾 Save saves it.
- **Short names.** A field shows a short name; what it is for is in its Hover Help (rest the mouse on the name).
- **X, Y, Width and Height** sit on one line.
- **The Blichmann order** (Skynet Rule 18.47): a dialog brought to the Model has its boxes in the same order as the
  Pump's: Label, Label Visible, Interface, Tab, **Layer Order** under the Tab, Name ... A box the Pump does not have goes where it
  fits best; everything above and below it keeps the Pump's order.
- **Two Models now** (Skynet Rule 18.48): the Pump (Blichmann RipTide) dialog for a Device, and the **Hose Bib Widget** dialog for
  a Widget (2. Tab and Layer Order, one Skynet picture with no Picture box, Orientation and Hose or Pipe laid out as on the Pump,
  and its IP set by the hose or pipe joined to it, never picked in a box). Together they are the Model other dialogs are matched to.
  Since Skynet Rule 18.49 the Pump's **Orientation** has the Hose Bib's look: **Horizontal** greyed out (a pump is always level)
  with **Left / Right** beside it; and the Hose Bib has the Pump's **Cover** and **Toggle**, **Overlay** and **Database and .API**, an **Inlet**
  and **Outlet IP Fitting** (no Model), and any of its 8 IP spots.
- **State, Name and Change Name** (Skynet Rule 18.45): **State** (on every On / Off Device, and a Manual Valve) is a slider that turns the
  item On or Off (a valve: Open or Closed) at once, the same as a click on it on its Tab; it is not a setting, so Save and Close
  do not change it. The **Name** is greyed out; the **Change Name** box below it starts with the Name now, and **✏ Change Name**
  puts what is typed there in the Name (kept with 💾 Save; every Process follows it). Once the Label is changed, the Change Name
  box takes the new Suggested Name and a blue pop-up offers **✏ Change Name** with it. The State slider, the Change Name box and its two
  buttons are for the mouse only: the Tab key and Enter pass them by. The Change Name box shows on every Device and Widget once it
  is saved; while you build a new one its Name simply follows the Suggested Name until you add it.
- **Alarm Widgets** (Skynet Rule 18.50, the "Recheck dialogs" pass): the Basic Skynet Alarm, the User Alarm and the Pre-Hop Alarm
  follow the Hose Bib's order: the lock and **Hidden Locked** in the title line (Visible is automatic: an Alarm shows while it is On),
  **1. Label**, **Label Visible**, **2. Tab**, **Layer Order**, **3. Name** with Change Name, then the **Graphic** box, the **Alarm**
  box and the **Alarm Chain**, X, Y, Width and Height on one line, and the **Widget Type** last. **Database and .API** is the ⬢ on the
  Active overlay line, as on the Pump's Overlay. Nothing was taken away.
- **Every other dialog** (the "Recheck dialogs" pass, part 2) now has the same look and flow, with nothing taken away:
  the **Switch**, **Push Button**, **Pulse Button** and **LED** get the **Graphic** (the Widget as drawn on its Tab) and an **Overlay**
  whose ⬢ holds Database and .API. A Widget with no picture (Data / Value, Text, Override, Label, Timer, Graph, Audio Widget,
  Process) has **Background** (Show or None), **Fore color** and **Back color** on their own lines. The gGlobal Widget, the older
  Alarm, the Manual vessel and a Clone, every Vessel, IP, Pipe, Hose, fitting and Manifold, and the RIMS tube and electric kettle
  follow the same order: 1. Label, Label Visible, 2. Tab, Layer Order, 3. Name, their own boxes, X Y Width Height, and the Type last.
  The Picture Widget gets a **Background** (None, 1, 2 or 3) whose ⬢ holds its 3 pictures.
- **The same rows in the same places** (Skynet Rule 18.51): every Device (PWM, Relay, Valve, Heating Element, Temperature Probe,
  inputs, motors, hydrometers ...) and every Widget now has the Model's rows in the Model's order: the title line, State, 1. Label,
  Label Visible, 2. Interface and Available Ports, 3. Tab, Layer Order, 4. Name, the **Graphic**, Orientation, Hose or Pipe, Cover
  and **Toggle**, **Overlay** with **Database and .API**, Model, Inlet and Outlet IP Fitting, its own settings, X Y Width Height and
  the **Device Type** last. Every one has a Graphic; a picture **Path** is in the Graphic's ⬢. A Toggle with no Cover has its own
  line where the Cover would be. With no Overlay, **Database and .API** has its own ⬢ line there. Nothing was taken away.

## A Device built into something

A Thermowell, Temperature Probe, Heating Element or Valve built into a **Vessel Device**, and the element and probe of a **RIMS tube**
or an **Integrated kettle**, open the same dialog. In place of the Tab it shows **3. Built into** (greyed out), and it has no Graphic,
X, Y, Width or Height, because it moves with what it is built into. A built in probe shows its **Probe type**, **Units**,
**Calibration offset** and **Reading now**.

In Edit layout, **double-click the part's picture on the Vessel** (or its reading) to open its Properties.
