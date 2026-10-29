# Timer Widget

A **Timer Widget** counts up or down in hours, minutes and seconds. Add one in Edit layout with **Select Widget Type > Timer** (it is made on the 🔨 Build Tab first, like every new Widget). Double-click it in Edit layout to open its **Timer Widget Properties**. They follow the same pattern as the [Text Widget](91-text-widget): Delete, **COPY**, Cancel and Save at the top, the Name with an orange **?**, and framed boxes. **A Timer Widget has no pictures.**

## Styles

A Timer Widget has **no pictures and no background**. Its look is its **Style**, picked from the **Style** list in its Properties:

- **Skynet Styles** 🔒 come with Skynet and **can never be changed by a user**: **Skynet Orange Timer** (big seven-segment digits `00:00:00` on an orange-red panel in a grey bezel, with the Label as a black title bar; the one a new Timer gets), **Skynet Green LCD**, **Skynet Blue Timer**, **Skynet Red LED digits** (the older LED look) and **Skynet Plain text**.
- **➕ Add new User Style…** (at the end of the list) makes your own Style, starting from the one picked now: a Name (never "Skynet ..."), the Look (seven-segment digits on a panel, LED digits or plain text), and the Digits, Panel, Bezel, Title bar text and Title bar colors. **✏ Edit** beside the list changes or deletes a User Style; it is greyed out for a Skynet Style.
- A User Style belongs to the Schema, so every Timer in it can use it.

The ▶ ■ ↺ **Set** buttons under the digits start, stop, reset and set it.

## Timer Widget Properties

- **Name**: once saved it is locked 🔒; **✏ Change name** changes it and every Process that uses it follows.
- The orange **?** opens a pop-up with the Timer Widget's Properties and Attributes (Close at the top and the bottom).
- **COPY** saves your changes, then makes a copy (`Timer_1` becomes `Timer_2` ...) on the 🔨 Build Tab and opens its Properties.

### Timer box
**Type** (Count up or Count down), **Reset value** and **Start value** (hh:mm:ss), and **Running when the Brain starts**.

### Label box
The title bar: **Label** (empty = the Name), **Visible** (Show label), **Font size**, **Font**, **Fore color**, **Back color** (Default = the Style's), **Alignment**.

### Properties box
**Visible**, **Hidden Locked**, **Style**, **Tab**, **X Horizontal**, **Y Vertical**, **Width**, **Height** and **Lock position**.

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
