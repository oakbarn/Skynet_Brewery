# Double-click in picker dropdowns

**A Skynet Standard (2026-10-27):** in a Properties dialog, a dropdown that picks something with a Skynet dialog of its own opens that thing's Properties when you double-click it.

Example: open the Properties of the Picture Widget **pic_Kettle_Element** on the Two vessel sample. Its **Tab** dropdown shows **Brewhouse**. Double-click it and the **Brewhouse Tab settings** pop up.

| Dropdown | Double-click opens |
| --- | --- |
| **Tab** | that Tab's Tab settings |
| A Device or Widget (Turns on with, Input, Heater, Timer, Hop Alarm ...) | that Device's or Widget's Properties |
| **Port on vessel** | the vessel's Properties |
| **Starts at IP** / **Ends at IP** of a pipe | the IP's Properties (or the pump, valve or vessel it belongs to) |
| **Only when ALL of these are on** of a pipe (a list) | the Properties of the name you double-click |

How it works:

- Pick the one you want first, then double-click the dropdown. In some browsers an open dropdown swallows the second click, so **two quick clicks** on it, or a **double-click on the field's name** to its left, do the same.
- If you changed something in the dialog you are in, the panel asks first, because those changes are not saved.
- Dropdowns of pictures and sounds work differently: they have their own preview and 🖼 icon picker, so a double-click does nothing there. Plain choice lists (colors, Yes / No kinds, sizes) have no dialog behind them either.
- Interfaces (boards) have no Properties dialog; change them on the Devices page.

See also [Double-click in lists](68-double-click-in-lists).
