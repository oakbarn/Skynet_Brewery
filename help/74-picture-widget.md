# Picture Widget

A **Picture Widget** shows a picture on a Tab. It is a Widget (it lives only in the app), so its Properties dialog is called **Picture Widget** (it was "Picture element"; Skynet does not use the word element for things on a Tab).

## Adding a Picture Widget

Press **Picture ➕** on the Edit layout bar (or **Add Widget > Pictures and text > Picture Widget**). The **Picture Widget** box opens. It works like the Add Device box of a Pump, but a Widget has no Interface or Port, and it is made on the 🔨 Build Tab first:

1. **Label** (the ⬢ sets its font, size and colors) and **Label Visible** (starts at No: a picture usually needs no Label).
2. **Picture**: the picture it shows. Pick it from the list (the 🖼 opens the icon picker).
3. **Tab**: greyed out, **🔨 Build Tab**. When the Widget is ready, send it to its Tab.

Nothing else shows until the Label and the Picture are done. **Enter** goes Label, Picture, then **➕ Add Widget**. Pressing ➕ Add Widget too early says what is still missing.

Then the rest shows: the **Name** (the Suggested Name, **pic_** and the Label, for example pic_Kettle_Element; you may type your own), the **Graphic** (the picture as it will show), **Turns on with** with **Toggle** on the same line, the **Overlay**, **Text on picture**, X, Y, Width and Height, and the **Widget Type** (Picture) greyed out.

## Picture Widget Properties

Double-click a Picture Widget to open its Properties. They look like a Pump's: the 🔓 lock, **Visible** and **Hidden Locked** on the title line, then 1 Label ⬆ ⬢ and Label Visible, 2 Picture, 3 Tab, 4 Name (✏ Change name once it is built), the Graphic, Turns on with and Toggle, Overlay, Text on picture, X, Y, Width, Height and the Widget Type. The Label can't be blank: a blank one becomes the Name when you save.

**Toggle** is what a tap does to what it turns on with: **On/Off** turns it on or off with one click, **Push button** keeps it on only while held, **None** does nothing.

## Turns on with

**Turns on with** picks what turns the picture on:

- **None**: a still picture. The **Overlay** and **Picture when on** are greyed out, because nothing turns it on.
- **On / off Devices and Widgets**: an output, a switch, an input, an alarm, a sound player, a timer or a true / false variable. The picture is On while that one is on.
- **Heaters: on while Enabled**: a PID, Hysteresis, Duty Cycle or PWM output. The picture is On while the heater is **Enabled** (a PWM output: while it is above 0 %), not only while its output fires.

Double-click the dropdown to open the Properties of the one picked (see [Double-click in picker dropdowns](73-double-click-in-pickers)).

## Its pictures

1. **Picture**: the picture it shows. Pick it from the picture list (with groups, preview and the 🖼 icon picker).
2. **Overlay**: drawn on top while it is On. **This is the preferred way.**
3. **Picture when on (a second picture, optional)**: in the ⬢ beside the Overlay. A whole second picture instead, for the cases that need two. The Back Colour (behind the picture) is there too.

Example: the Two vessel sample's **pic_Kettle_Element** turns on with **Kettle_Heat** and swaps between two element pictures. With the preferred way it would keep the off picture and add **Glow red** as its On overlay.

See also [On overlay](58-on-overlay) and [Pictures on items](25-picture-paths).
