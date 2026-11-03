# Pump Device Properties (the drill-down)

Double-click a Pump in Edit layout to open **Pump Device Properties**. It is the first Device dialog built to the General
Dialog Rules (Skynet Rules section 18), and it is **the standard for every Device**: the others will work the same way.

The idea: the things you set most are on the dialog itself. Everything else is one click away in a small pop-up.

## The two icons

| Icon | What it does |
|---|---|
| **⬢** red hexagon | Pops up a **Properties dialog** with more settings for that field |
| **⬆** red up arrow | Pops up a **String dialog**: a bigger box to type the text in (Rich Text codes like `\b` work) |

Every pop-up has **✖ Cancel** and **💾 Save** at the top and the bottom. Save in a pop-up puts the changes into the dialog;
nothing is really saved until you press **💾 Save** on the dialog. Cancel with changes made asks first.

## From the top

1. **Delete**, **Cancel** and **Save**.
2. **Visible**, **Hidden Locked** and the **🔓 lock** (locks its place: no drag or resize).
3. **Pump Properties ⬢**: the hexagon opens the Properties pop-up with Visible, Hidden Locked, the lock, **Tab**,
   **X Horizontal**, **Y Vertical**, **Width**, **Height** and **🗑 Delete**.
4. **Label ⬆ ⬢**: what shows on the Tab. The arrow opens a 2 line box; the hexagon opens the Label pop-up: Label, Visible,
   Font size, Font, Bold, Fore color, Back color and Alignment. A Label is never blank: leave it empty and it becomes the Name.
   **Show label** switches it on or off.
5. **Name**: starts as the Suggested Name (from the Label, Interface, pin and Device Type); you may type your own. It must be
   unique. A Process uses it: `Pump_Name.state = true`.
6. **Pump**: **Interface**, **Pin ⬢** (the hexagon has Invert, One-shot time and One-shot pulses OFF), **When tapped ⬢**
   (Tap target and Ask before changing) and Kind.
7. **Graphic**: **Picture ⬢** (the hexagon has the On overlay and an optional second picture for when it is on), **Cover**
   (Help 111), and **Background picture (Image Path 1) ⬢** (the Graphic Dialog: Background #, Image Path 2 and 3, Back Colour).
8. **On / Off text**: **Text when on ⬆ ⬢** (the hexagon has Hide the text, its size, colors and alignment, plus the Look and
   Border of the whole item) and **Text when off ⬆**.
9. **Database and .API**, as on every Device.
