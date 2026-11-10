# Vessel sizing by gallons

Vessels have their own Rules (Skynet Rules section 19). They apply **only to Vessel Widgets and Vessel Devices**:
for them they take the place of Rule 2.20 (resize grab points), Rule 1.21 (`.width` and `.height`) and the faint marks of Rule 5.31.

## Gallons

Every Vessel Widget has a **Gallons** field (**Liters** when its Units are Metric). It is one of the first fields in Vessel Widget
Properties, so a new build from a Template asks for it right after the Label. A Vessel Template starts at **10 gallons**, Skynet and
User Templates alike, and the number can be changed.

**Size follows volume**, the way a real pot grows: twice the gallons is about 1.26 times as wide and as tall.

| Gallons | Size on the Tab (no Master yet) |
| --- | --- |
| 1 | 197 x 237 |
| 5 | 337 x 405 |
| 10 | 424 x 511 |
| 15 | 486 x 584 |
| 20 | 535 x 643 |

## Method: Proportional or Diameter

- **Proportional:** the shape is the Skynet plain vessel, the **One Gallon start** of **197 x 237** pixels. A bigger vessel keeps
  that Width to Height.
- **Diameter:** type its **Diameter** and **Height** (inches, or cm for Metric). It is drawn by its **real size**: they give its
  shape (a vessel as wide as it is tall is drawn square) and how big it is. Advertised gallons can be wrong, so the Gallons you type
  are kept as what it holds but never change the drawing. **Calculated Volume** (read only) shows what a vessel of that Diameter
  and Height really holds.

**Dead space** (what is left in the bottom) and **Safe Element Volume** (the least liquid that covers its Heating Element) are
kept with the vessel too.

## Master Vessel Sizer

A Tab can name one Vessel its **Master Vessel Sizer**: double-click an empty spot on the Tab in Edit layout (**Tab settings**) and
pick it under **Master Vessel Sizer**. The Master shows a 📏 in its corner in Edit layout.

- **Only the Master can be resized**, with its grab points or its Width and Height. Every other Vessel on that Tab follows: they
  all keep the same scale, so a 5 gallon kettle always looks half the volume of a 10 gallon one.
- Changing the **Master's own Gallons** grows or shrinks only the Master. Changing another Vessel's Gallons or Method resizes only
  that Vessel, at the Master's scale.
- A Vessel moved onto a Tab that has a Master takes the Master's scale.
- In a Process, only the Master's size can change.
- **No Master picked: no Vessel can be resized.** Vessels keep the size they have. A new build on the 🔨 Build Tab is still drawn
  at its Gallons (1 gallon = 197 x 237, or the scale of the Tab it is going to).

Each Vessel stands where it stood when it is resized: the middle of its bottom stays put. Its IPs, fittings and End Caps go with
it. A straight pipe never bends to follow (Rule 5.19): a pipe end that no longer lines up lets go.

## Not Placed spots: hidden until Show All

A spot that is **Not Placed** (Help: Vessel Widget) is hidden everywhere, even on the 🔨 Build Tab. In Vessel Widget Properties
press **👁 Show All** to list the Not Placed spots, so you can slide one on, and to show faint marks where they would go. Press
**🙈 Hide Not Placed** to hide them again. They are hidden again when the Properties close.
