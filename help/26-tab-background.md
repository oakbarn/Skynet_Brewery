# Tab Settings

**⚙ Tab Settings** holds everything about one Tab: its name and Tab ID, its background, its look, its size and its pipes. It only opens while **Edit layout** is on, and only an **Admin** can change it. The example is the **Brew House** Tab (Tab ID **BH**) of the 3 Vessel 1 Pump sample.

Each box has a short name. Rest the mouse on the name (dotted underline) for its Hover Help; on a phone or tablet, tap the name. The words below are the same as the Hover Help.

## Open it

On a PC or Mac:

1. Click the Tab you want to change (its button at the top).
2. Turn on **Edit layout** (the blue Edit layout button beside **☰ Menu**). A dashed bar of buttons appears.
3. Open **⚙ Tab Settings** in one of these ways:
   - press **⚙ Tab settings** in the dashed bar, or
   - **double-click an empty spot** on the Tab (not on a pump, valve or pipe), or
   - double-click the Tab's name at the top.

On an iPhone, iPad or Android phone: turn on Edit layout, then **hold your finger on an empty spot** of the Tab for about half a second, or tap **⚙ Tab settings** in the dashed bar.

When you are done, press **💾 Save** at the top of the box, then **Save layout** in the dashed bar.

## The buttons and the keys

- **🗑 Delete**, **✖ Cancel** and **💾 Save** stay at the top while the rest of the box scrolls; there is no second row at the bottom. Delete takes the Tab and everything on it away (it asks first; it is not there when this is the only Tab). Cancel asks first when something was changed.
- The **Name** has the focus when the box opens on a new Tab. A saved Tab's Name is locked (⛔ Name 🔒), so the **Color** has the focus instead.
- The **Enter** key goes only between the **Name** and the **Tab ID** (a new Tab). Enter on a blank Name stays on it. From any other box, Enter goes back to the Name.
- The **Tab** key goes through every box, the last one back to the first. The ? Help, Delete, Cancel and Save are for the mouse.
- A blank Name, or a Tab ID that can't be used, only stops **Save**: a small ⚠ box says why, the box gets the focus, and the ⚠ box goes away by itself after 2 seconds. Everything else can still be reached.

## Name and Tab ID

| Box | What it does |
|---|---|
| **Name** | The name of this Tab, shown on its button at the top of the panel, for example Brew House. Each Tab needs a name of its own, and it cannot be blank. A Hidden Tab's name always starts with Hidden_. Renaming a Tab is safe: everything on it goes with it, and the Suggested Names of its Devices use the Tab ID, not the name. A saved Tab shows 🔒 and **✏ Change name**. |
| **Tab ID** | A short code for this Tab, for example BH for Brew House. It comes first in every list of Tabs (BH: Brew House) and last in the Suggested Name of every Device on this Tab (..._BH). Skynet suggests a unique one, and it follows the Name until you type your own. The Tab ID follows Rule 3.2. Check it before you Save. Once it is saved, it is greyed out. |

## Background

| Box | What it does |
|---|---|
| **Copy Profile** | Pick a Tab Profile to copy onto this Tab when you Save: its background color goes into Color, and its look (colors and value style) becomes the look a new Device or Widget on this Tab starts with. None = copy nothing. Profiles are made on ☰ Menu > Tab Profile ([Tab, Valve and Pump Profiles](36-tab-and-valve-profiles)). It is a copy, not a link (Skynet Rule 2.62): changing or deleting the Profile later never changes this Tab. |
| **Color** | The color behind everything on this Tab. It shows wherever the Picture does not cover. Default = the panel's normal color. None = no color. Custom opens the Color Picker for a color of your own, and its **Color (RGB)** box shows below it. A Tab Profile picked in Copy Profile copies its color in here when you Save. |
| **Picture** | A picture behind everything on this Tab. Pick Skynet pictures or your own, a group, then the picture. Only Skynet pictures from the Tab Background folder are listed here (there are none yet, so the list starts on Both and shows your own). None = no picture. Add new ... takes the name of another picture in media/Images; the [File Move](32-file-move) page copies a picture from your computer there. The Color shows wherever the picture does not cover. |
| **Picture Left** / **Picture Top** | Where the left edge and the top edge of the Picture go, in pixels from the left and the top of the Tab. |
| **Picture Width** / **Picture Height** | How wide and how tall the Picture is drawn, in pixels. |

Leave Picture Left, Top, Width and Height all empty to stretch the Picture over the whole Tab; fill them in to put it at one spot and size.

## Look

| Box | What it does |
|---|---|
| **Tab Style** | The Tab Style: the colors, fonts and sizes of the Labels, Devices and Widgets on this Tab. Default = the Tab Style picked on ☰ Menu > Default settings. A Device or Widget with a color, font or size of its own keeps it; only the rest take the Tab Style. Skynet Styles 🔒 can never be changed. ➕ Add new User Style… makes your own, and ✏ Edit changes it ([Tab Styles](101-tab-styles)). |

## Size

| Box | What it does |
|---|---|
| **Width** | How wide this Tab is, in pixels. You can type any size (200 to 20000), or press 🖥 Fit Screen below to match this screen. A new Tab starts as wide as the screen it is made on (1920 on most screens), unless ☰ Menu > Default settings gives a Width. |
| **Height** | How tall this Tab is, in pixels. You can type any size (200 to 20000), or press 🖥 Fit Screen below to match this screen. A new Tab starts as tall as the screen it is made on, less the taskbar (1040 on most screens), unless ☰ Menu > Default settings gives a Height. |
| **Screen size: 🖥 Fit Screen** | One click sets this Tab's Width and Height to the usable size of THIS screen (the screen less the taskbar), so the whole Tab fills the screen at Zoom Fit screen with no scroll bars. Press Save to keep it. You can still type your own Width and Height. Pick the screen of the computer you brew from: a Tab sized on a small laptop is drawn smaller on a big screen. |
| **Vessel Sizer** | The Master Vessel Sizer: pick one Vessel on this Tab. Only that Vessel can be resized, and every other Vessel on the Tab follows it at the same scale. None = no Vessel can be resized. The Master shows 📏 in Edit layout ([Vessel sizing](135-vessel-sizing)). |

## Pipes

| Box | What it does |
|---|---|
| **Pipe Size** | How thick a 1/2" pipe is drawn on this Tab, in pixels. A new Tab starts at 10. Every other pipe size, reducer and fitting is drawn to scale from it. |
| **Hose Size** | How thick a 1/2" hose is drawn on this Tab, in pixels. Hoses are usually drawn thinner than pipes. A new Tab starts at 6 (☰ Menu > Default settings). Every other hose size is drawn to scale from it. Empty = the Pipe Size, as on Tabs made before there was a Hose Size. |
| **Flow Color** | The color of the flow in every pipe and hose on this Tab. None = each pipe keeps its own Flow Color. Mash, Boil, Whirlpool and Ferment: a pipe with a Flow Color of its own keeps it. Tap, Strike and the plain colors: every pipe takes it. Flow from a Tap Water Valve is always Blue, and flow that starts at a Vessel with an Out Flow Color takes that color. RGB opens the Color Picker ([Pipe and hose flow colors](116-pipe-and-hose-flow-colors)). |

## The technical side

- A Process sets the Flow Color with `tab.flow_Color = Mash`, on the Tab the screen shows; `tab.flow_Color = None` hands it back to Tab Settings.
- Devices, Widgets and Processes find a Tab by its hidden key, which never changes, so a new Name never breaks a link.
- To get your own picture onto the Brain, use the [Media](07-media) screen (into the `Images` folder); it is then in the **Picture** list. A pump, valve or other item has its own pictures (**.backpath**, **.backpath_2**, **.backpath_3**): see [Pictures on items](25-picture-paths).
