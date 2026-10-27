# Picture Widget

A **Picture Widget** shows a picture on a Tab. It is a Widget (it lives only in the app), so its Properties dialog is called **Picture Widget** (it was "Picture element"; Skynet does not use the word element for things on a Tab).

## Turns on with

**Turns on with** picks what turns the picture on:

- **None**: a still picture. **Picture when on** and **On overlay** are greyed out, because nothing turns it on.
- **On / off Devices and Widgets**: an output, a switch, an input, an alarm, a sound player, a timer or a true / false variable. The picture is On while that one is on.
- **Heaters: on while Enabled**: a PID, Hysteresis, Duty Cycle or PWM output. The picture is On while the heater is **Enabled** (a PWM output: while it is above 0 %), not only while its output fires.

Double-click the dropdown to open the Properties of the one picked (see [Double-click in picker dropdowns](73-double-click-in-pickers)).

## Its pictures

1. **Picture when off**: the picture it shows. Pick it from the picture list (with groups, preview and the 🖼 icon picker).
2. **On overlay**: drawn on top while it is On. **This is the preferred way.**
3. **Picture when on (a second picture, optional)**: a whole second picture instead, for the cases that need two.

Example: the Two vessel sample's **pic_Kettle_Element** turns on with **Kettle_Heat** and swaps between two element pictures. With the preferred way it would keep the off picture and add **Glow red** as its On overlay.

See also [On overlay](58-on-overlay) and [Pictures on items](25-picture-paths).
