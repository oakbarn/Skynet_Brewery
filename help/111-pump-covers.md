# Pump Covers

A Skynet no-cover pump drawing (see Brew Pump Pictures) can wear a **cover**. The pump is drawn in layers, bottom up:

1. the **pump picture** (Picture when off),
2. the **Cover overlay**,
3. the **On overlay** (only while the pump is on).

The cover has a see-through background, so the pump head, ports and base still show. It is there on and off.

## Picking a cover

In the pump's Properties, **Cover overlay** is right after the picture:

- **None** (the default): no cover.
- **Red, Yellow, Blue, Green, Purple, Orange, White** (White is RGB 250 250 250): the Skynet cover colors.
- **Pick Cover Color**: the same cover in a color of your own. The Color Picker pops up and the **Color (RGB)** line shows just
  below the Cover (Help 187); double-click it to change the color later. **◀ Back** sets the Cover back to None.

There is **one cover for each color, and every cover fits every Skynet pump**. Skynet keeps one cover shape for
each pump drawing and fills it with the color you pick, so changing the color or the pump never needs a new picture.

Covers are drawn only on the Skynet no-cover pump drawings (March 809 and 815, Chugger, Riptide, Topsflo TD5, KegLand MKII). On any other pump picture the setting does nothing. Flip Horizontal and Flip Vertical turn the cover with the picture.

## In a Process

- `Pump_Wort.cover = "Blue"` puts the blue cover on. The choices are None, Red, Yellow, Blue, Green, Purple, Orange, White and User (any letter case).
- `Pump_Wort.cover = "User"` and `Pump_Wort.coverColor = "#20b2aa"` (or a color name such as `"Teal"`) put on a cover in your own color.
- `Pump_Wort.cover = "None"` takes it off. Only pumps have `.cover` and `.coverColor`.
