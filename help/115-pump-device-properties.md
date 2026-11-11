# Pump Device Properties (the drill-down)

Double-click a Pump in Edit layout to open **Pump Device Properties**. It is the first Device dialog built to the General
Dialog Rules (Skynet Rules section 18), and it is **the standard for every Device**: the others will work the same way.

The idea: the things you set most are on the dialog itself. Everything else is one click away in a small pop-up.

## Adding a pump

1. In Edit layout, click **Pumps > Pump, on / off (relay or SSR)**.
2. **Pick the pump** from the list. Each one has its picture: March 809 and 815, Chugger, Blichmann Riptide, Topsflo TD5 and
   KegLand MKII. The picture you pick is the pump's Picture.
3. The Add box opens with the pump's name as its title. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font
   and colors) and **Label Visible**, 2 the **Interface** (the board), 3 an **Available Port**, 4 the **Tab**. Then 5 the
   **Suggested Name** shows, made from them. The **Graphic** shows the pump; set its **Orientation**, **Cover**, **X**, **Y**, **Width** and **Height** if you like. If **➕ Add Device** looks faded, press it: it tells you what is still missing. The **Device Type** (Pump) is shown greyed out: it comes from the list you picked.
   Once 1 to 4 are done, the rest of the box opens: the **Interface** and **Available Ports** line is greyed out (it is the
   wiring; press Cancel to change it), the **Label** and **Tab** can still be changed and the Suggested Name follows them, and
   the focus goes to **Orientation**. The **Graphic** is the picture of this Device as it will show on the Tab, with its Cover
   and Orientation; the Picture itself cannot be changed. **User Add** in Cover pops up the Color Picker and shows the
   **Color (RGB)** line just below it (Help 187): pick a color and press Save, or **◀ Back** sets the Cover back to None (no cover).
4. Press **➕ Add Device**. The Properties open. The **Interface** and **Port** are now greyed out and set: they are the wiring, so they stay as they are. To wire it to another board or pin, delete it and add it again. Its Name can still be changed with **✏ Change name**.

## The two icons

| Icon | What it does |
|---|---|
| **⬢** red hexagon | Pops up a **Properties dialog** with more settings for that field |
| **⬆** red up arrow | Pops up a **String dialog**: a bigger box to type the text in (Rich Text codes like `\b` work) |

Every pop-up has **✖ Cancel** and **💾 Save** at the top and the bottom. Save in a pop-up puts the changes into the dialog;
nothing is really saved until you press **💾 Save** on the dialog. Cancel with changes made asks first.

## From the top

Only these belong to a Pump (a Skynet pump drawing or your own User pump):

1. The title is the pump, for example **Blichmann Riptide**, with the **🔓 lock** (locks its place: no drag or resize),
   **Visible** and **Hidden Locked** beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢**: what shows on the Tab (see **The Label** below). The ⬆ opens a 2 Line Label Text Dialog; the ⬢ opens
   the **Label Attributes** Dialog: Label, Visible, Font Size, Font, Bold, Fore Color, Back Color and Alignment. Font Size shows
   the size the Label has now. Alignment is **Left**, **Centered** or **Right**; a Label starts Centered. A Label is never
   blank: leave it empty and it becomes the Name. **Label Visible** switches it on or off.
3. **2. Interface** and **Available Ports** on one line: greyed out once it is added (the board and pin it is wired to).
4. **3. Tab**: the Tab it is on.
5. **4. Name**: starts as the Suggested Name (from the Label, Interface, Port, Device Type and Tab); you may type your own. It
   must be unique. A Process uses it: `Pump_Name.state = true`.
6. **Graphic**: the pump's picture as it shows on the Tab. **Path**: greyed out on a Skynet pump drawing (it is set); a User
   pump's one Path can be changed.
7. **Orientation**: **Right** (as drawn) or **Left** (mirrored). The Graphic here and the pump on the Tab turn, and its IPs
   follow.
8. **Cover** (Help 111, Skynet pump drawings only) and **Toggle** on one line: On/Off (one click turns it on or off), Push
   button (on only while held) or None.
   Just below them, **Overlay**: what is drawn on top while the pump is On (the steady lightning bolt, the flashing bolt,
   the Green glow ring, or None). On the same line, **Database and .API ⬢**: the hexagon opens its settings (Help 98).
9. **X (Horizontal)**, **Y (Vertical)**, **Width** and **Height**.
10. The **Device Type** (DO: Pump) greyed out.

The On / Off text is shown with an Overlay (the green On overlay of the Skynet pump drawings).

## The Label

How do You refer to this Pump. Brewing Pump, Mash Pump, HLT Pump ...? Use your name for the Pump as the Label. OakBarn
Brewery Sample Schema has several Pumps and they are Color Coded with a Cover. When OakBarn is brewing, he might yell out,
"Shut off the Red Pump" to stop the flow. The Fermenters are in a different Room and when visually full, the Brewmeister yells
to "Turn off the Red Pump" to his comely assistant, who then clicks the Red Pump Off.

![Label Visible](help_pictures/Label_Visible_Switch.png)

The Label may be shown on the Tab, for example Red Pump above the Pump Device.

![Red Pump: the Label above the Pump](help_pictures/Red_Pump_Label.png)

This is the Plain Text Part of the Suggested Name. Spaces become ~.
BM_6_Pump_**Red~Pump**_BH

Suggested Name Format: INTERFACEid_Port_Type_Label_TABid
From the above BM_6_Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 6, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You
will quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your
choices are limited only to those devices on the BM: Brewery Mega Arduino.

The **⬆** opens a 2 Line Label Text Dialog

The **⬢** opens a Label Attributes Dialog where you can set its font, size and colors.

**Available Ports**: only the free Ports (pins) on this board that fit this Device, for example 22, or A5 = 59. Once it is
added it is greyed out: it is the wiring.

Every dialog's titles and field names are in Title Case (Fore Color, Font Size).
