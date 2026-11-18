# Every Device dialog looks like the Pump's

Every Device's Properties work the same way as the Pump's (Skynet Rule 18.31). Once you know the Pump's dialog, you know them all.

## From the top

1. The title, with the 🔓 lock, **Visible** and **Hidden Locked** beside it. 🗑 Delete, ✖ Cancel and 💾 Save are at the top, frozen: they stay put while the rest scrolls (there is no row of buttons at the bottom).
2. **1. Label**: the ⬆ opens a bigger box to type in, the ⬢ sets its font, size and colors. **Label Visible** shows or hides it on the Tab.
3. **2. Interface** with its **Port** (or **Probe #**) on the same line. They are greyed out: they are the wiring, set when the Device
   was added. Where the Device has them, the ⬢ holds **Invert** and **One-shot**.
4. **3. Tab** and **4. Name**, with the Suggested Name under it.
5. A Device with pictures: the **Graphic**, its **Path**, and the **Overlay** with **Toggle** (outputs) and **Database and .API ⬢**
   on the same line. A Device with no pictures has **Database and .API ⬢** on a line of its own.
6. Its own settings: only what that kind of Device needs (a PID's Input, Setpoint, Kp ...; a sensor's Signal and Units ...).
7. **Text attributes ⬢** (the look of its value or On / Off text), **X**, **Y**, **Width** and **Height** on one line, and the **Device Type** last.

Rest the mouse on any field name to see what it is for (Help 147).

## Every dialog, the same way

Every dialog in Skynet, not only the Device ones, follows the Blichmann RipTide Pump dialog (Skynet Rule 18.44):

- **The buttons are frozen at the top.** The title and its buttons stay where they are while you scroll, so you never have to
  scroll to the bottom to Save. There is no second row of buttons at the bottom.
- **⛔ = can not be changed here.** A greyed out box shows the red Do Not Enter sign at its right end while the mouse is on the box
  or its name (Skynet Rule 18.45: the dialog stays clean). The box shows what it is, but you can not type in it or pick from it here
  (for example the Interface and Port once a Device is added, or the Device Type).
  ![A greyed out box with the Do Not Enter sign](help_pictures/Greyed_Do_Not_Enter.png)
- **Every ⬢ and ⬆ pop-up** has its title, ✖ Cancel and 💾 **Keep** frozen at the top. Keep puts what you set back into the dialog;
  the dialog's own 💾 Save saves it.
- **Short names.** A field shows a short name; what it is for is in its Hover Help (rest the mouse on the name).
- **X, Y, Width and Height** sit on one line.
- **State, Name and Change Name** (Skynet Rule 18.45, the Pump and the Manual Valve first): **State** is a slider that turns the
  item On or Off (a valve: Open or Closed) at once, the same as a click on it on its Tab; it is not a setting, so Save and Cancel
  do not change it. The **Name** is greyed out; the **Change Name** box below it starts with the Name now, and **✏ Change Name**
  puts what is typed there in the Name (kept with 💾 Save; every Process follows it). Once the Label is changed, **🏷 Update to
  Suggested Name** pops up beside Label Visible and fills the Change Name box. The State slider, the Change Name box and its two
  buttons are for the mouse only: the Tab key and Enter pass them by.

## A Device built into something

A Thermowell, Temperature Probe, Heating Element or Valve built into a **Vessel Device**, and the element and probe of a **RIMS tube**
or an **Integrated kettle**, open the same dialog. In place of the Tab it shows **3. Built into** (greyed out), and it has no Graphic,
X, Y, Width or Height, because it moves with what it is built into. A built in probe shows its **Probe type**, **Units**,
**Calibration offset** and **Reading now**.

In Edit layout, **double-click the part's picture on the Vessel** (or its reading) to open its Properties.
