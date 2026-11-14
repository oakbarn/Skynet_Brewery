# Text boxes

Every piece of text on a Tab is a **text box**, and every text box has the same attributes. The text boxes are:

- the **Name** and the **Value** of every Device and Widget (a pump, a temperature, a gGlobal ...)
- a **Label** (Add > Label in Edit layout)
- a **Text Widget** (**+ Text** in Edit layout; its own page: [Text Widget](91-text-widget))
- the **Label** on a vessel and on other equipment

## The attributes

| Attribute | What it is | In a Process |
|---|---|---|
| Visible | shown or hidden (a switch) | `w_Text_1.visible = false` |
| Fore color | the color of the text | `Pump_1.foreColor = "Red"` |
| Back color | the color behind the text | `Pump_1.backColor = "#000000"` |
| Alignment | Left, Centered or Right justified | `w_Text_1.alignment = "Center"` |
| Width, Height | its size in pixels | `w_Text_1.width = 300` |
| X and Y position | its place in pixels from the left and top of the Tab: **x** is **h**orizontal (across), **y** is **v**ertical (up and down). The old names `.xPosition` and `.yPosition` still work. | `w_Text_1.x_hPosition = 400`, `w_Text_1.y_vPosition = 120` |

- **Word wrap as needed**: a long text goes onto more lines. On a Device or Widget it lets a long Name wrap (Values always wrap). A Text Widget always wraps.
- **Codes inside text** work in every text box: `\b` bold, `\L` large, `\n` a new line, `\t` an indent, `\deg` a degree sign and the others in [Codes inside text](22-process-language).
- **Shortcut keys** type the codes for you: Shift+Enter `\n`, Ctrl+B (⌘+B) `\b`, Ctrl+Shift+D (⌘+Shift+D) °F or °C. See [Shortcut keys](113-shortcut-keys).

On a Device or Widget, **Fore color**, **Back color** and **Alignment** are for all of its text. **Name color**, **Value color**, **Name alignment** and the others below them are still there, and win over Fore color for that one box.

## Defaults

Every attribute has a **Default** on **☰ Menu > Default settings**, in two parts:

- **Labels**: the Name of every Device and Widget, and the Label on a vessel. Visible, Fore Color, Back Color, Alignment, Bold,
  Font and Font Size (px).
- **Text Boxes**: a Text, a Label Widget, and the Value of a Device or Widget. Fore Color, Back Color, Alignment, Font, Font Size
  (px), New Box Width, New Box Height and Word Wrap.

A new install starts with:

| | Labels | Text Boxes |
|---|---|---|
| Visible | On | |
| Fore Color | White (250, 250, 250) | White (250, 250, 250) |
| Back Color | Black | Black |
| Alignment | Centered justified | Centered justified |
| Bold | Off | |
| Font | Tab's font | Tab's font |
| Font Size (px) | 11 | 11 |
| New Box Width / Height | | 520 x 140 |

- **Tab's font**: each Tab uses its Tab Style's font, and the panel's normal font when its Tab Style has none. So every Tab always
  has a font. A font picked on the Default tab is used where a Tab Style has none.
- **Defaults are for new things only** (Skynet Rule 2.42). A **new** item left on **Default** in its properties uses what the Default
  tab said when it was made (its Tab Style still comes first). Changing the Default tab later changes only items made after that:
  **items already made keep how they look**. Pick a color of its own in the item's properties and that item keeps it.
- **The Value of a Device or Widget** follows the Text Boxes colors only once you change them from what a new install has, so a new install
  puts no black box behind the values on your pictures.
- **Visible, Word Wrap, the size and the place are copied when an item is made.** A new Device, Widget or Text starts with them,
  then you change it in its properties. Changing the Default later does not hide, move or resize what is already on your Tabs.
- The Default fore color leaves the digits of an **LED** or **Gauge** look in their own colors.
- The size of large text (the `\L` code) is **\L Rich Text Code Size (px)**, under **Rich Text Embedded Code** in **Settings > Panel settings: screen, Tabs and alerts**.

## In a Process

A Process changes a text box while it runs, and `""` puts back what its properties say:

```
w_Text_1.visible = false
w_Text_1 = "Mashing at 152\degF"
Pump_1.foreColor = "Red"
Pump_1.backColor = "Black"
BK_Temp.alignment = "Right"
w_Text_1.x_hPosition = 400
w_Text_1.y_vPosition = 120
w_Text_1.width = 300
Pump_1.foreColor = ""
if w_Text_1.visible == true
   w_Text_1.visible = false
endif
```

- Each new **Text Widget** starts with the name `wgt_TXT_Text_1_BH` (Skynet Rule 3.14; older ones are `w_Text_1`, `w_Text_2` ...) (it can be changed: see [Text Widget](91-text-widget)). `w_Text_1 = "..."` (or `w_Text_1.text = "..."`) changes what it says.
- Colors are a name (Red, Black ...) or a code like `#ffffff`.
- Alignment is `Left`, `Center` or `Right` (`"Left justified"` and `"Centered"` work too).
- Width, Height, X and Y are whole numbers of pixels. Reading one (`if w_Text_1.width > 200`) gives the size or place it has now.
- A size or place set by a Process shows on the Tab only outside Edit layout. In Edit layout you see and drag where its properties put it.
- The Label on a vessel has no Process name. Change it in the vessel's properties.

## Vessels

A new vessel is a **plain gray tank** with no writing on it (the picture `Images/Skynet/Vessels/vessel_gray.svg`). Its **Label** is its only text: set it in the vessel's properties, with its position, color, back color and size. A vessel made before this keeps its picture; pick `Images/Skynet/Vessels/vessel_gray.svg` as its Graphic to make it plain gray.
