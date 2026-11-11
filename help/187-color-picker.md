# Color Picker

Every color box in every dialog picks colors the same way (Skynet Rule 2.48).

## Pick a color

Each color box is one dropdown with a swatch in front of it:

1. **Default** keeps the item's normal color.
2. **None** means no color at all (see-through).
3. The standard colors by name, each with its swatch (White is RGB 250 250 250, Rule 2.7).
4. Your own colors, shown by their RGB numbers, for example **RGB 32 178 170**.
5. **Custom (add new) ...** pops up the **Color Picker** at once.

## The Color (RGB) box

When you pick a color of your own, a **Color (RGB)** line shows just below the color box: a swatch and the color as three
numbers, Red, Green, Blue (0 to 255 each), for example **250,250,250**.

- **Double-click** the numbers to bring up the Color Picker again.
- Or type three numbers there, for example `32,178,170`, and press Enter.
- Pick a named color (or Default or None) and the Color (RGB) line goes away again.

## The Color Picker

- Drag in the big square to pick how light and how strong the color is, and on the color strip beside it to pick the color.
- Or type it in the box under them: as **RGB** (for example `rgb(32, 178, 170)`), or press **HEX** and type a # code
  (for example `#20B2AA`).
- The swatch and the picture in the dialog change as you pick, so you see the color before you keep it.
- **Save** keeps the color. It is added to the color list, so it is there in every color box next time.
- **Cancel** (or Escape) closes the Color Picker and the box keeps the color it had.

## Pump covers

On a Skynet pump, pick **Pick Cover Color** in **Cover**. The Color Picker pops up and the **Color (RGB)** line shows just below
the Cover. Pick the color and press **Save**: the cover is drawn in that color on the pump in the dialog and on the Tab.
**◀ Back** sets the Cover back to None (no cover). Double-click the Color (RGB) numbers to change the color later.

## Flow colors

A Flow Color (pipes, hoses, vessels, IPs and the Tab, Rule 5.21) picks **RGB (pick your own color) ...** the same way: the Color
Picker pops up and the Color (RGB) line shows below it.

## The technical side

- The Color Picker is **Pickr** 1.9.1 by Simon Reinisch (MIT License, free), kept in the panel (`public/vendor/pickr`), so it
  works with no internet. Its license is listed in `docs/Media_Licenses.csv`.
- A color is saved as its # code (`#rrggbb`), as before, so a Process still sets and reads colors the same way
  (for example `Pump_1.coverColor = "#20b2aa"`).
- If the Color Picker file can't load, the browser's own color box opens instead, so a color can always be picked.
