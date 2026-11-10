# Universal Properties

Every **Device**, **Widget** and **Semi-Device** (Switch, Push Button, Pulse Button, LED, Manual Valve Widget) has the same
basic Properties, with the same names everywhere. Learn them once and they work on everything.

## The Properties

- **Name**: starts as the Suggested Name; you may change it before the first save. After that it is locked 🔒 and changed only with **✏ Change name**.
- **Label**: the text shown with the item, with a **Show Label** switch.
- **Rich Text**: the font, size, bold, fore and back colors and alignment of the Label and of the item's own text. **Rich Text Embedded Codes** (`\b`, `\i`, `\n`, `\c{Red}` ...) work in any text.
- **Position** (X, Y) and **Size** (Width, Height), in pixels.
- **Layer Order**: which item is drawn on top where items overlap. **1 is on top**, 2 is under it, and so on. A **new item gets 1** and the others move down one. The numbers on a Tab always run 1, 2, 3 ... with no gaps. It is right after Height in every Properties dialog.
- **Visible**, and **HiddenLock**: a HiddenLock item is hidden whenever the Tab is locked (outside Edit layout), even when Visible is on. In Edit layout you see it faded so you can still work on it.
- **Lock** (Item Lock) 🔓 / 🔒: locks where the item sits, so it can't be moved or resized by accident. You can still double-click it and change its other Properties. **🔒 Lock All** and **🔓 Unlock All** on the Edit layout bar lock or unlock everything on the Tab at once.
- A hidden **key**, given when the item is first saved. You never see it; it lets Processes follow a renamed item.

## In a Process

`name.attribute = something`, for example `Pump_1.fore_label = "Red"`. `""` puts back what its Properties say.

| Attribute | What it is |
|---|---|
| `.label`, `.label_visible` | the Label and whether it shows |
| `.font_label`, `.size_label`, `.bold_label` | the Label's font, size and bold |
| `.fore_label`, `.back_label`, `.alignment_label` | the Label's colors and alignment |
| `.font`, `.font_size`, `.bold` | the item's own text: font, size and bold |
| `.fore`, `.back`, `.alignment` | the item's own text: colors and alignment |
| `.backpath` | the background picture (`.backpath_2`, `.backpath_3` too) |
| `.visible`, `.hiddenlock` | shown or not; hidden while the Tab is locked |
| `.x`, `.y` | where it is (`.xh` / `.x_hPosition` and `.yv` / `.y_vPosition` work too) |
| `.width`, `.height` | its size |
| `.layer` | its Layer Order (1 is on top) |
| `.lock` | its Item Lock |
| `.tab` | the Tab it is on |

**Being built:** today the whole list works on the Text Widget (its font size is still `.size`). Other Devices and Widgets get the rest in a coming update; until then they use `.nameColor`, `.nameBg`, `.nameAlign` for the Label and `.valueColor`, `.valueBg`, `.valueAlign` for the value.

Pipe fittings (elbows, tees, reducers ...) have them too, Label included. Most Widgets have no background picture, so they have no `.backpath`.

## Clones

A Clone has the same Properties, but most belong to its parent and can't be changed on the Clone. Only its own place (X, Y), Tab, Visible, Lock and Layer Order are its own.

## Layer Order, step by step

1. Open **Edit layout** and double-click the item that should be on top.
2. Its **Layer Order** shows where it is now. Type **1** to put it on top (or 2 to put it just under the top one), then **Save** and **Save layout**. The other items on the Tab are numbered again, with no gaps.
3. A Process can change it while brewing: `Pump_1.layer = 1` puts the pump on top and the others move down one; `Pump_1.layer = ""` puts back its Properties' number.

Every item has a Layer Order: pipes, hoses, IP markers, pipe fittings and Manual Valve Widgets too. A Tab that was never numbered keeps the order it always had (pipes at the bottom, IP markers at the top); **Save layout** numbers it.

**Inside a Vessel Device** (Skynet Rule 1.29): a Device built into a Vessel Device (its Heating Element, Temperature Probe and the
other built-in parts) has a Layer Order that counts **only inside that vessel**. 1 is its top part, 2 is under it, and so on. They are
not in the Tab's list. Where the whole vessel sits among the other items on the Tab is the **Vessel Device's own Layer Order**, and its
built-in parts always go with it, drawn on top of the vessel. A Process works the same way: `HLT_Vessel.hE_1.layer = 1` puts that part
on top of the other parts of the HLT, not on top of the Tab.

The full standard is in the Skynet document **Universal Properties** (docs/Universal_Properties.md).
