# Universal Properties

Every **Device**, **Widget** and **Semi-Device** (Switch, Push Button, Pulse Button, LED, Manual Valve Widget) has the same
basic Properties, with the same names everywhere. Learn them once and they work on everything.

## The Properties

- **Name**: starts as the Suggested Name; you may change it before the first save. After that it is locked 🔒 and changed only with **✏ Change name**.
- **Label**: the text shown with the item, with a **Show Label** switch.
- **Rich Text**: the font, size, bold, fore and back colors and alignment of the Label and of the item's own text. **Rich Text Embedded Codes** (`\b`, `\i`, `\n`, `\c{Red}` ...) work in any text (see [Rich Text Embedded Code](90-rich-text-embedded-code)).
- **Position** (X, Y) and **Size** (Width, Height), in pixels.
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
| `.lock` | its Item Lock |
| `.tab` | the Tab it is on |

**Being built:** today the whole list works on the Text Widget (its font size is still `.size`). Other Devices and Widgets get the rest in a coming update; until then they use `.nameColor`, `.nameBg`, `.nameAlign` for the Label and `.valueColor`, `.valueBg`, `.valueAlign` for the value.

Not every item has every one: pipe fittings have no Label, and most Widgets have no background picture.

## Clones

A Clone has the same Properties, but most belong to its parent and can't be changed on the Clone. Only its own place (X, Y), Tab, Visible and Lock are its own.

The full standard is in the Skynet document **Universal Properties** (docs/Universal_Properties.md).
