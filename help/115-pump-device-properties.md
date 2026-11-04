# Pump Device Properties (the drill-down)

Double-click a Pump in Edit layout to open **Pump Device Properties**. It is the first Device dialog built to the General
Dialog Rules (Skynet Rules section 18), and it is **the standard for every Device**: the others will work the same way.

The idea: the things you set most are on the dialog itself. Everything else is one click away in a small pop-up.

## Adding a pump

1. In Edit layout, click **Pumps > Pump, on / off (relay or SSR)**.
2. **Pick the pump** from the list. Each one has its picture: March 809 and 815, Chugger, Blichmann Riptide, Topsflo TD5 and
   KegLand MKII. The picture you pick is the pump's Picture.
3. The Add box opens with the pump's name as its title. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font
   and colors) and **Label Visible**, 2 the **Interface (board)**, 3 an **Available Port**, 4 the **Tab**. Then 5 the
   **Suggested Name** shows, made from them. The **Graphic** shows the pump; set its **Orientation**, **Cover**, **X**, **Y**, **Width** and **Height** if you like. If **➕ Add Device** looks faded, press it: it tells you what is still missing. The **Device Type** (Pump) is shown greyed out: it comes from the list you picked.
4. Press **➕ Add Device**. The Properties open. The **Interface** and **Port** are now greyed out and set; press **✏ Change**
   beside one to change it on purpose.

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
6. **Pump**: **Interface (board)** and **Port** (greyed out once it is added: **✏ Change** to change one; the Port's ⬢ has
   Invert, One-shot time and One-shot pulses OFF), then **Tab**, **X**, **Y**, **Width**, **Height**, **When tapped ⬢** (Tap
   target and Ask before changing) and Kind. The **Device Type** is shown greyed out under the Name.
7. **Graphic**: the pump's picture as it shows on the Tab, and its **Orientation** (Normal, Flip Horizontal, Flip Vertical,
   Flip both). Change the Orientation and the picture here and the pump on the Tab flip, and its IPs follow. A Skynet pump
   drawing's **Picture** is set (shown greyed out with the pump's name); a User pump has one **Image Path**. The **⬢** beside
   it has the On overlay, an optional second picture for when it is on, and the Back Colour. **Cover** (Help 111) is for the
   Skynet pump drawings.
8. **On / Off text**: **Text when on ⬆ ⬢** (the hexagon has Hide the text, its size, colors and alignment, plus the Look and
   Border of the whole item) and **Text when off ⬆**.
9. **Database and .API**, as on every Device.
