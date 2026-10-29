# Text boxes

Every piece of text on a Tab is a **text box**, and every text box has the same attributes. The text boxes are:

- the **Name** and the **Value** of every Device and Widget (a pump, a temperature, a gKonstant ...)
- a **Label** (Add > Label in Edit layout)
- a **Text** (**+ Text** in Edit layout)
- the **Label** on a vessel and on other equipment

## The attributes

| Attribute | What it is | In a Process |
|---|---|---|
| Visible | shown or hidden (a switch) | `Text_1.visible = false` |
| Fore color | the color of the text | `Pump_1.foreColor = "Red"` |
| Back color | the color behind the text | `Pump_1.backColor = "#000000"` |
| Alignment | Left, Centered or Right justified | `Text_1.alignment = "Center"` |
| Width, Height | its size in pixels | `Text_1.width = 300` |
| X and Y position | its place in pixels from the left and top of the Tab: **x** is **h**orizontal (across), **y** is **v**ertical (up and down). The old names `.xPosition` and `.yPosition` still work. | `Text_1.x_hPosition = 400`, `Text_1.y_vPosition = 120` |

- **Word wrap as needed**: a long text goes onto more lines. On a Device or Widget it lets a long Name wrap (Values always wrap). On a Text, switching it off keeps the text on one line, cut off at the edge.
- **Codes inside text** work in every text box: `\b` bold, `\i` italic, `\c{Red}` color, `\L` large, `\n` a new line, `\F` °F and the others in [Rich Text Embedded Code](90-rich-text-embedded-code).
- **Name font** and **Name font size** set the font of the Names, the Labels on vessels and the Texts.

On a Device or Widget, **Fore color**, **Back color** and **Alignment** are for all of its text. **Name color**, **Value color**, **Name alignment** and the others below them are still there, and win over Fore color for that one box.

## Defaults

Every attribute has a **Default** on the ☰ Menu **Default** tab, under **Text**. The Default is for everything that has that attribute: Devices, Widgets, Labels, Texts and vessels.

- **Colors, Alignment and the Name font follow the Default.** An item left on **Default** in its properties uses what the Default tab says. Change it there and every item on Default changes with it. Pick a color of its own in the item's properties and that item keeps it.
- **Visible, Word wrap, the size and the place are copied when an item is made.** A new Device, Widget or Text starts with them, then you change it in its properties. Changing the Default later does not hide, move or resize what is already on your Tabs.
- The Default fore color leaves the digits of an **LED** or **Gauge** look in their own colors.
- **Default** on the Default tab means the panel's normal look, as before.

## In a Process

A Process changes a text box while it runs, and `""` puts back what its properties say:

```
Text_1.visible = false
Text_1 = "Mashing at 152\degF"
Pump_1.foreColor = "Red"
Pump_1.backColor = "Black"
BK_Temp.alignment = "Right"
Text_1.x_hPosition = 400
Text_1.y_vPosition = 120
Text_1.width = 300
Pump_1.foreColor = ""
if Text_1.visible == true
   Text_1.visible = false
endif
```

- Each **Text** has a fixed name: `Text_1`, `Text_2` ... It is shown at the top of its properties. `Text_1 = "..."` (or `Text_1.text = "..."`) changes what it says.
- Colors are a name (Red, Black ...) or a code like `#ffffff`.
- Alignment is `Left`, `Center` or `Right` (`"Left justified"` and `"Centered"` work too).
- Width, Height, X and Y are whole numbers of pixels. Reading one (`if Text_1.width > 200`) gives the size or place it has now.
- A size or place set by a Process shows on the Tab only outside Edit layout. In Edit layout you see and drag where its properties put it.
- The Label on a vessel has no Process name. Change it in the vessel's properties.

## Vessels

A new vessel is a **plain gray tank** with no writing on it (the picture `Images/Skynet/Vessels/vessel_gray.svg`). Its **Label** is its only text: set it in the vessel's properties, with its position, color, back color and size. A vessel made before this keeps its picture; pick `Images/Skynet/Vessels/vessel_gray.svg` as its Graphic to make it plain gray.
