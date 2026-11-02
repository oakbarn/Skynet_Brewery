# Universal Properties for Widgets and Devices

Fritz's standard, 2026-11-02 (thread "Set universal properties standard"). Every **Device**, **Widget** and
**Semi_Widgets_Device** (Rule 1.20) has these Properties and Process attributes, with the same names everywhere.
A **Clone** has them too, but most are its parent's and can't be changed on the Clone (see *Clones* below).

This is the standard. Where the panel does not meet it yet, the gap is listed under *Where the panel stands today*.
Rule 1.21 in the [Skynet Rules](Skynet_Rules.md) points here. Help page 114 explains it for users.

---

## 1. The Universal Properties

| Property | Type | What it is |
|---|---|---|
| **Name** | string | Starts as the **Suggested Name**; the user may edit it. Unique, never blank. Locked once saved, changed only with ✏ Change name (Rules 3.11, 18.4). |
| **Label** | string | The text shown with the item (Add > Label in Edit layout). |
| **Show Label** | boolean (switch) | Show or hide the Label (Rule 2.18). |
| **Rich Text properties** | | Font, font size, bold, fore and back color, alignment, for each string (the Label and the item's own text). |
| **Embedded Rich Text Codes** | string | `\b`, `\i`, `\n`, `\c{Red}` ... inside any string (Help 90). |
| **Position** (`.x`, `.y`) | integer | Where it is on its Tab, in pixels. |
| **Size** (Width, Height) | integer | How big it is, in pixels. |
| **Visibility** (Visible) | boolean | Shown or not. |
| **HiddenLock** | boolean | Hidden whenever the **Tab Lock is on** (outside Edit layout), even when Visible is on; seen (faded) only in Edit layout, like BruControl's HiddenLocked. |
| **Lock** (Item Lock) | boolean | Locks the item's position. See *Item Lock* below. |
| **Key** | hidden | Meaningless, given when first saved, can never be changed, never shown (Rule 3.10). |

### Item Lock

- Locks or unlocks one item. It **locks its position**: a locked item can't be moved or resized (Rules 2.12, 2.20).
- A locked item can still be **double-clicked** and **any property changed**, except when the **Tab Lock** is on.
- It goes with the **🔒 Lock All** and **🔓 Unlock All** icons on the Edit layout bar: one-time actions on the current Tab,
  not switches (Rule 2.12).
- In Properties it is the small 🔓 / 🔒 icon (Rule 2.5).

---

## 2. Process attributes

`name.attribute = something` in a Process. `""` puts back what its Properties say.

### For items with a Label

| Attribute | Type | What it is |
|---|---|---|
| `.label` | string | The Label |
| `.label_visible` | boolean | The Label shows |
| `.font_label` | string | The Label's font |
| `.size_label` | integer | The Label's font size, in pixels |
| `.fore_label` | color | The Label's text color |
| `.back_label` | color | The Label's back color |
| `.bold_label` | boolean | The Label is bold |
| `.alignment_label` | string | Left, Center or Right |

### For items with a string (their own text or value)

| Attribute | Type | What it is |
|---|---|---|
| `.font` | string | Font |
| `.font_size` | integer | Font size, in pixels |
| `.fore` | color | Text color |
| `.back` | color | Back color |
| `.bold` | boolean | Bold |
| `.backpath` | string | Background picture path (with `.backpath_2`, `.backpath_3`, Rule 7.10) |
| `.alignment` | string | As in BruControl |
| `.visible` | boolean | Shown or not |

### For every Widget, Device and Semi-Device

| Attribute | Type | What it is |
|---|---|---|
| `.hiddenlock` | boolean | Hidden while the Tab Lock is on |
| `.x` | integer | Across. **`.xh`** and **`.x_hPosition`** work too |
| `.y` | integer | Up and down. **`.yv`** and **`.y_vPosition`** work too |
| `.width` | integer | Width in pixels |
| `.height` | integer | Height in pixels |
| `.lock` | boolean | Item Lock |
| `.tab` | string | The Tab it is on (the Tab's Name) |

Fritz wrote `.x_H_position` / `.y_V_Position`; these are read as the `.x_hPosition` / `.y_vPosition` names Skynet already
has (attribute names don't care about capitals).

---

## 3. Clones

A Clone (Rule 4.4) has every Universal Property, but **most are not editable on the Clone**: they are its parent's.

| On the Clone | Universal Properties |
|---|---|
| **Its own** (editable) | `.visible`, `.x`, `.y`, `.tab` (Tab dropdown in its Properties, not in Processes), `.lock` |
| **Made by Skynet** (not editable) | Name (`<Parent_Name>_Clone_N`), its own hidden key (acts through its parent's key) |
| **The parent's** (shown, not editable) | Label, Show Label, the Rich Text properties, Width, Height, HiddenLock, `.backpath` |

Clones are not used in Processes (Rule 4.4). **Waiting on Fritz:** his list of Clone Properties for each type; this table
changes to match it.

---

## 4. Who does not have all of them

- **Pipe fittings** (elbows, tees, reducers, U, cross, End Cap, check valve): Rule 5.14 says their only settings are `.x`,
  `.y`, `.width`, `.height` and Autosize to pipe, with no Label. **Open question for Fritz** (see below).
- **Items with no background picture** (most Widgets, the Timer Widget; Rules 2.24, 7.10) have no `.backpath`.
- **The Override button** (Rule 2.26): a user changes only its Label and the Label's style.
- **gGlobals** are variables, never on a Tab (Rule 1.19), so they have none of these.

---

## 5. Where the panel stands today (2026-11-02)

The **Text Widget** (Help 91) already has the whole attribute list, except that its font size is `.size` (the standard
says `.font_size`). Other Devices and Widgets do not yet:

| Standard | Today on Devices and other Widgets |
|---|---|
| `.fore`, `.back`, `.alignment` | work (`.foreColor`, `.backColor` too); the value's look is also `.valueColor`, `.valueBg`, `.valueAlign` |
| `.fore_label`, `.back_label`, `.alignment_label` | are `.nameColor`, `.nameBg`, `.nameAlign` |
| `.label_visible`, `.font_label`, `.size_label`, `.bold_label` | missing |
| `.font`, `.font_size`, `.bold` | missing (`.fontSize` is in Properties only) |
| `.hiddenlock` | works (`.hidden` is the old name) |
| `.lock`, `.tab` | missing |
| Manual Valve Widget | has only `.state` |

### The plan (one code PR, after Fritz answers the open questions)

1. Every Device, Widget and Semi-Device answers to the attributes in section 2, with predictive text and the orange ?
   pop-ups listing them.
2. Under Rule 15.2 the old names are changed in every Process, sample and the default Schema, with backups:
   `.size` -> `.font_size` (Text Widget), `.nameColor` / `.nameBg` / `.nameAlign` -> `.fore_label` / `.back_label` /
   `.alignment_label`, `.valueColor` / `.valueBg` / `.valueAlign` -> `.fore` / `.back` / `.alignment`,
   `.foreColor` / `.backColor` -> `.fore` / `.back`, `.hidden` -> `.hiddenlock`. The same goes in the Importing Norms.
3. **No dialog layout changes** (Rule 18.10): dialogs keep their look until Fritz commands each one.
4. Item Lock, Lock All and Unlock All already exist (Rule 2.12); only `.lock` in a Process is new.

---

## 6. Open questions for Fritz

1. **Rule 1.15 and Rule 15.2:** `.x` / `.y` become the main names, with `.xh`, `.x_hPosition`, `.yv`, `.y_vPosition` also
   working. Rule 15.2 says no old way is kept working beside the new one. Change Rule 1.15, or allow the aliases as an
   exception to Rule 15.2?
2. **Rule 5.14:** do pipe fittings get `.visible`, `.hiddenlock`, `.lock` and `.tab` (still no Label)?
3. **`.lock` in a Process:** read only (as on the Text Widget today), or can a Process lock and unlock an item?
4. Still open from before: **Label never blank** (Rule 18.3) against Rules 1.13, 3.8 and 4.2 (Open question 12).

---

## Change log

- 2026-11-02: First version, from Fritz's Universal Properties list (thread "Set universal properties standard").
