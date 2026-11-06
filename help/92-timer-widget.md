# Timer Widget

A **Timer Widget** counts up or down in hours, minutes and seconds. Add one in Edit layout with **Select Widget Type > Timer** (it is made on the 🔨 Build Tab first, like every new Widget). Double-click it in Edit layout to open its **Timer Widget Properties**, in the same look as the Pump's (Skynet Rule 18.30). **A Timer Widget has no pictures.**

## Styles

A Timer Widget has **no pictures and no background**. Its look is its **Style**, picked from the **Style** list in its Properties:

- **Skynet Styles** 🔒 come with Skynet and **can never be changed by a user**: **Skynet Orange Timer** (big seven-segment digits `00:00:00` on an orange-red panel in a grey bezel, with the Label as a black title bar; the one a new Timer gets), **Skynet Green LCD**, **Skynet Blue Timer**, **Skynet Red LED digits** (the older LED look) and **Skynet Plain text**.
- **➕ Add new User Style…** (at the end of the list) makes your own Style, starting from the one picked now: a Name (never "Skynet ..."), the Look (seven-segment digits on a panel, LED digits or plain text), and the Digits, Panel, Bezel, Title bar text and Title bar colors. **✏ Edit** beside the list changes or deletes a User Style; it is greyed out for a Skynet Style.
- A User Style belongs to the Schema, so every Timer in it can use it.

The ▶ ■ ↺ **Set** buttons under the digits start, stop, reset and set it.

## Timer Widget Properties

Rest the mouse on a field's name to see what it is for (hover help).

- **The title line:** the 🔓 lock, **Visible** and **Hidden Locked**.
- **1. Label** (the title bar) with ⬆ (a bigger box) and ⬢ (its font, size, colors and alignment), then **Label Visible**.
- **2. Tab** and **3. Name**. A new Timer is named **wgt_TMR_** + the Label + the Tab ID, for example **wgt_TMR_Mash_BR** (Rule 3.14).
  Once saved the name is locked 🔒; **✏ Change name** changes it and every Process that uses it follows.
- **Count** (Count up or Count down), **Start value** and **Reset value** (hh:mm:ss).
- **Running at start** (it is already counting when the Brain starts), with **Database and .API ⬢** on its line.
- **Style** (see above), **X**, **Y**, **Width** and **Height**, and the **Widget Type** greyed out last.

## In a Process

```
tm_Mash.countdown = true
tm_Mash = "01:00:00"
tm_Mash.running = true
wait tm_Mash == "00:00:00"
tm_Mash.fore = "Yellow"
tm_Mash.back = "Black"
tm_Mash.x = 400
```

| Attribute | What it is |
|---|---|
| `.value` (or the name alone) | the time, hh:mm:ss |
| `.running` | true / false |
| `.countdown` | true = counts down |
| `.resetvalue` | the time ↺ goes back to |
| `.label` | the title bar |
| `.fore`, `.back` | the digits and the panel color, over its Style while Processes run (`.foreColor`, `.backColor` work too; `""` = the Style's) |
| `.visible`, `.hiddenlock` | shown or hidden |
| `.x`, `.y` | its place (`.xh` / `.x_hPosition`, `.yv` / `.y_vPosition` work too) |
| `.width`, `.height` | its size |
