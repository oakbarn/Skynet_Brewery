# Text Widget

A **Text Widget** is a piece of text you put on a Tab: **+ Text** on the Edit layout bar (it is made on the 🔨 Build Tab first, like every new Widget). Double-click it in Edit layout to open its **Text Widget Properties**. This dialog is the pattern the other Properties dialogs will follow.

## Text Widget Properties

At the top: **🗑 Delete**, **COPY**, **✖ Cancel** and **💾 Save** (Delete, Cancel and Save are at the bottom too).

- **COPY** saves your changes, then makes a copy of this Text Widget on the 🔨 Build Tab, with everything the same but a new name (the next `w_Text_N`). The copy's Properties open so you can change it. **Save Build ...** sends it to a Tab.
- **Name**: a new Text Widget is named **w_Text_1**, **w_Text_2** ... You can keep it, or give it a name of your own. Once it is saved the name is locked 🔒: press **✏ Change name** to change it, and every Process that uses it changes with it.
- The orange **?** after the name opens a pop-up with more about the Text Widget: its **Properties** and the **Attributes** a Process can use. (The yellow **?** by the title opens this Help page.) The pop-up has **✖ Close** at the top and the bottom.
- **Update Names**: on = the Label follows the Name (rename it and the Label changes too).
- **Text**: what it says. **Rich Text Embedded Codes** work here and in the Label: `\b` bold, `\i` italic, `\n` a new line, `\c{Red}` a color and the rest in [Codes inside text](22-process-language).

### The Label box

A line above the Text. Empty = the Name.

- **Label**, **Visible** (Show label), **Font size**, **Font**, **Bold**, **Fore color**, **Back color**, **Alignment**.

### The Properties box

- **Visible**, and **Hidden Locked** (stays hidden even when Visible is on).
- **Font size**, **Font**, **Bold**, **Fore color**, **Back color**, **Alignment** of the Text.
- **Tab**, **X Horizontal**, **Y Vertical**, **Width**, **Height**, and **Lock position** 🔓 / 🔒.

**Word wrap is always on**: a long text goes onto the next line inside the box.

## In a Process

`name.attribute = Something` is how a Process uses it, for example `w_Text_1.fore = "Red"`. `""` puts back what its Properties say. Reading one gives what it is now.

| Attribute | What it is |
|---|---|
| `.text` | what it says. `w_Text_1 = "Mashing"` does the same |
| `.value` | only in a Process: the same as `.text` |
| `.label` | the Label (empty = the Name) |
| `.label_visible` | true / false: the Label shows |
| `.font_label`, `.size_label`, `.bold_label` | the Label's font, size in pixels, bold (true / false) |
| `.fore_label`, `.back_label`, `.alignment_label` | the Label's colors and Left / Center / Right |
| `.font`, `.size`, `.bold` | the Text's font, size in pixels, bold |
| `.fore`, `.back`, `.alignment` | the Text's colors and Left / Center / Right (`.foreColor`, `.backColor` work too) |
| `.visible` | true / false |
| `.hiddenlock` | true = stays hidden even when `.visible` is true (`.hidden` works too) |
| `.x` | across, in pixels (`.xh` and `.x_hPosition` all work) |
| `.y` | up and down, in pixels (`.yv` and `.y_vPosition` all work) |
| `.width`, `.height` | its size in pixels |
| `.lock` | read only: true when it is locked in place (lock it in Edit layout) |
| `.tab` | the Tab it is on. Setting it moves it to another Tab while Processes run |

```
w_Text_1 = "Mashing at 152\degF"
w_Text_1.label = "Mash Tun"
w_Text_1.label_visible = true
w_Text_1.font = "Courier New"
w_Text_1.size = 24
w_Text_1.bold = true
w_Text_1.fore = "Red"
w_Text_1.x = 400
w_Text_1.tab = "Brewhouse"
w_Text_1.fore = ""
```

Fonts are the ones in the Font list: Arial, Verdana, Tahoma, Trebuchet MS, Georgia, Times New Roman, Courier New, Consolas, Impact or System. Colors are a name (Red, Black ...) or a code like `#ffffff`.

## Older Schemas

Text Widgets used to be named `Text_1`, `Text_2` ... When an older Schema loads, each one becomes `w_Text_1`, `w_Text_2` ... (Rule 15.2), and every Process that used the old name is changed to the new one. Its Word wrap switch is gone (word wrap is always on). Its Label starts hidden, so it looks the same as before.

Before, `Text_1.label` meant its text. Now `.label` is the Label line: use `.text` for what it says.

See also [Text boxes](49-text-boxes) for the Defaults on the ☰ Menu Default tab.
