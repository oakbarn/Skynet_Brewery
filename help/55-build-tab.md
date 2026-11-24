# Build Tab

Building something new on a busy Tab is hard: it lands on top of other things and is fiddly to grab. So **everything new is made first on a clean Build Tab**: every Device, Widget, IP, picture, text, piece of equipment and copy of a Template. You can look at it with **👁 Preview** at any time. When it is ready, **Finish Build ...** asks where it goes: onto one of your Tabs (one pick and one click), or into a Template.

The Build Tab only shows while you are building. It has a dashed orange edge and a 🔨 in the Tab bar. It is never one of your Tabs. An unfinished Build is kept on the Brain, in the Schema, and comes back the next time you open Edit layout (see [Saving never ends the Build](#saving-never-ends-the-build) below).

## Start building

Every step, with pictures: [Step by Step: Add a Device](207-step-by-step-add-a-device) and [Step by Step: Add a Widget](208-step-by-step-add-a-widget).

1. Press **☰ Menu** and pick **Edit layout**.
2. Do one of these:
   - Pick a Device in **Add Device** (or a shortcut: **Pumps**, **Valves**, **Probe**, **Heating Element**, **PWM**), a Widget in **Add Widget**, or press **Picture ➕**, **Text ➕**, **Vessel**, **Manual Valve ➕**, **Add equipment ➕** or **Elbows, Tees …** (see [Edit layout bar](82-edit-layout-bar)). The Build Tab opens by itself and the new item is made there, **never on a regular Tab**. The Tab you pick in its Add box is remembered: that is where it goes at the end (see **Where it goes** below).
   - Press **🔨 Build Tab** on the Edit layout bar to open it empty.
   - In **☰ Menu > Vessel Templates**, **Equipment Templates** or **Fitting Templates**, open a Template (a Skynet Template or a User Bundled Template) and press **Add to Tab** or **Clone**. The copy is made on the Build Tab (see **Copies of Templates** below).
3. Build it on the Build Tab: set its properties, add its IPs, draw its pipes. Everything on the Edit layout bar works there.

You can go back and forth between the Build Tab and your other Tabs at any time. The Build Tab is the size of the Tab you came from.

## Where it goes

A new Device or Widget always starts on the Build Tab. The **Tab** you pick in its Add box is where it will go when the build is done:

- Its **Suggested Name** already ends with that Tab's ID (for example `BM_22_DO@Pump_Pump_BH` for Brew House).
- Its Properties show that Tab in the **Tab** box. Pick another Tab there and it will go to that one instead. It stays on the Build Tab until then.
- **✅ Finish Build ... > Move to Tab** offers that Tab first, as a suggestion. You pick one Tab for the whole Build, and everything on the Build Tab goes there.

### Its spot on the Build Tab is its spot on its Tab

Where you put it on the Build Tab is where it lands on its Tab. The Build Tab is made at least as big as that Tab, so every spot fits. If you send it to a different Tab in Finish Build, it goes to the middle of that Tab instead.

### The Watermark

A faint copy of the Tab your build goes to shows behind everything on the Build Tab, like a watermark: the Tab as it looks on Brew Day, with every Device, Widget, vessel, picture, text and pipe on it, and **Goes to:** and the Tab name at the top left. Use it to place new things where they belong: line your new item up with it and it lands in the right place. Nothing in the watermark can be clicked.

- It shows as soon as the Build Tab opens: the Tab in the **Tab** box on the Edit layout bar (your Default Tab, or the Tab you came from).
- Click an item on the Build Tab to see the watermark of the Tab it goes to.
- A Build for a Template has no watermark, because a Template goes to no Tab.
- **🗺 Watermark On** on the Edit layout bar (it shows only on the Build Tab) turns it off; **🗺 Watermark Off** turns it back on. This browser remembers your choice.

### It glows until you click it

When Finish Build moves something onto a regular Tab (Brew House in the sample, for example), its border **glows red with a slow pulse**, so it is easy to find. As soon as you click it, the glow stops. The glow is never saved: reloading the page ends it too.

### Templates in the Tab list

A vessel, a piece of equipment or a Tab_Fitting on the Build Tab has **📁 Templates** at the end of the Tab list in its Properties. Pick it and **✅ Finish Build ...** shows **As a Template** first. Devices and Widgets can't be Templates (see **What can be a Template** below), so their Tab list doesn't have it.

## Preview

Press **👁 Preview** on the Edit layout bar (it shows while there is a Build Tab). The Build Tab is drawn the way it will look on Brew Day: no grid, no dashed outlines, no resize corners or padlocks. Nothing can be moved or changed while you look: press **✏ Back to building** (the same button) to go on building.

The Preview works before and after you change an item's Properties, as often as you like, until the build is sent to a Tab or a Template. Going to another Tab ends it too. The **Finish Build** pop-up also has a **👁 Preview** button, so you can have one more look before you pick where it goes.

## Leave for a moment, come back to the Build

You can step away from what you are building and come back to it. Nothing is lost:

- **In an Add box** (for example the Blichmann RipTide's first box), a double-click on a choice in a list, like **Brew House** in the **Tab** list, opens that Tab's settings (or that Device's Properties). The Add box steps aside with everything you typed and picked kept. When you close the other box (**💾 Save** or **✖ Cancel**), the Add box comes back, on the Tab you were on.
- **In the Properties of something already made**, the same double-click asks first if you changed something. When the other box closes, you are back on your Tab and its Properties open again.
- **On the Tab bar**, a double-click on a Tab's name opens its Tab settings. If you were on the 🔨 Build Tab, you go back to the Build Tab when you close them.

**➕ Add new Tab…** and **📁 Templates** in a Tab list are choices, so a double-click on them opens nothing.

## Copies of Templates

A copy of a Template, from a **Skynet Template** or a **User Bundled Template**, is always made on the Build Tab first.

- **Add to Tab**: pick the Tab it goes on and its name. The copy is made on the Build Tab, Bundled. **Finish Build ... > Move to Tab** then offers that Tab first.
- **Clone**: give the new Template a name. The copy is made on the Build Tab. Change it there, then **Finish Build ...** shows **As a Template** first, with that name filled in. Press **Save as Template** and the new Template is saved. What the Build Tab doesn't show (like each port's Connection Standard) is copied from the Template you cloned.

If you are not in Edit layout yet, it is switched on for you.

## Open the Templates from the Build Tab

You don't have to close your Build to look at the Templates. In Edit layout, **📁 Templates** on the Edit layout bar opens **Vessel Templates**, **Equipment Templates**, **Fitting Templates** or **Build Template**, and the Build stays open. A Template Menu tab you already opened can be clicked too.

- You see what you are getting: **Add to Tab**, **Clone** or a **right-drag** puts the copy on the Build Tab, as always.
- **B** (or **Insert**): click a Template's icon once, then press **B** (for Build) or **Insert**. A copy goes on the Build Tab and you stay on the Templates, so you can add several.
- While a Template page shows, the Edit layout bar steps aside. Click the **🔨 Build Tab** (or **✖ Close**) to go back to your Build, everything on it as you left it.
- The other Menu tabs still wait until you press **Save layout** or **Exit** (Skynet Rule 2.52).

(Skynet Rule 4.10)

## Finish Build

Press **✅ Finish Build ...** on the Edit layout bar. A pop-up asks where it should go:

| Pick | What happens |
|---|---|
| **Move to Tab** | Pick the Tab (the one picked for the new item is first; otherwise the one you came from) and press **Move to Tab**. Everything on the Build Tab moves there at the size it is now. To the Tab picked for it, it keeps its spot from the Build Tab; to another Tab it goes to the middle. It glows red until clicked. Then press **Save layout**. |
| **As a Template** | Type a **Template Name** (no spaces, unique) and press **Save as Template**. It is saved at once in **☰ Menu**, and the Build Tab closes. Use **Add to Tab** on the Template to put it on a Tab. |
| **Throw it away** | Everything on the Build Tab is deleted (it asks first), and the Ports of its Devices are free again. |
| **Keep building** | Back to the Build Tab, nothing changes. |

A new Device whose name still follows the suggested name gets the **Tab ID** of the Tab it moves to at the end of its name (for example `MB_25_PWM_VlV_Fly~Sparge_SP`). A name you typed yourself is never changed.

## Saving never ends the Build

Only **✅ Finish Build ...** ends a Build. Until then:

- **Save layout** saves your regular Tabs. The Build stays open on the 🔨 Build Tab, and you stay in Edit layout to keep adding to it.
- The unfinished Build is kept on the Brain. It is never run and never shows on Brew Day. It survives a restart, and it comes back on the 🔨 Build Tab the next time you open Edit layout. Leaving Edit layout, with or without saving, keeps it too.
- The Ports of its Devices stay taken, so nothing else can be put on them by mistake.
- When a kept Build comes back, a note says so, with **🗑 Discard Build**. One click throws the Build away and frees its Ports. **↩ Undo** shows for a few seconds after, in case it was a mistake.

## Work on an item on the Build Tab

When you edit a Tab, you can take any item on it to the clean Build Tab to work on it there. It is your choice: you can also change it right where it is.

1. In **Edit layout**, click the item to pick it (a Device, a Widget, a picture, a text or a vessel).
2. Press **🔨 To Build Tab** on the Edit layout bar. Skynet remembers its Tab, its spot and its size, and moves it to the Build Tab. A vessel takes its IPs and fittings along. Pipes drawn to it stay on its Tab.
3. Change it on the Build Tab. **👁 Preview** shows how it will look.
4. Press **✅ Finish Build ...**. A pop-up asks **Put it back where it came from?**
   - **OK (Yes)**: it goes back on the same Tab, in the same spot and at the same size. A bundled item is bundled again, and one that was not bundled stays that way.
   - **Cancel (No)**: it is saved like a new build. The Finish Build pop-up opens, and you can send it to any Tab or save it as a Template.
5. Press **Save layout** to keep it.

**🔨 To Build Tab** is greyed out when nothing is picked, when a pipe is picked, or when the item is already on the Build Tab. A locked item has to be unlocked first (only unlocked items move). New things are still always made on the Build Tab first.

## Change a bundled item on the Build Tab

A bundled item (a vessel or Tab_Fitting with its IPs) can be taken off its Tab, changed on the Build Tab, and put back in the same place.

1. In **Edit layout**, double-click the bundled item. Switch off **Bundled** and press **Save**.
2. A pop-up asks **Move it to the 🔨 Build Tab to work on it?**
   - **OK (Yes)**: Skynet remembers its Tab, its spot and its size, and moves it with its IPs to the Build Tab. Pipes drawn to it stay on its Tab.
   - **Cancel (No)**: it is un-bundled where it is, as before.
3. Change it on the Build Tab, then press **✅ Finish Build ...**.
4. A pop-up asks **Put it back where it came from?**
   - **OK (Yes)**: it goes back on the same Tab, in the same spot and at the same size, and is bundled again. Its IPs keep their place on the picture.
   - **Cancel (No)**: it is saved like a new build. The Finish Build pop-up opens: pick a Tab and it goes there at the size it is now, in the middle of the Tab, bundled again.
5. Press **Save layout** to keep it.

If its Tab was deleted or renamed in the meantime, the question is skipped and it is saved like a new build. **Throw it away** and **As a Template** both take it off your Tab for good (Throw it away names it and asks first).

## What can be a Template

A Template is **one vessel** (with the Bundled Fittings on its ports), **one Bundled Fitting**, or **a Chiller Bundle** (below). While anything else is on the Build Tab (a Device, a Widget, a loose IP, a pipe, a picture or text), **As a Template** is greyed out and says why. Save to a Tab instead, or delete those from the Build Tab first.

- A vessel, chiller, coil, trub filter or RIMS tube becomes a **Vessel Template** (or an **Equipment Template**). It keeps its kind, type, picture, the size it is drawn at, sizes, heat source, Connection Standard, notes and which ports are on and where.
- A Bundled Fitting on one of its ports that is still the same as its Template is used as it is. One you changed on the Build Tab is saved as a new **Bundled Fitting Template** first, named after it.
- A Tab_Fitting by itself becomes a **Bundled Fitting Template**.

### A Chiller Bundle

An immersion chiller with everything that goes with it can be **one Equipment Template**:

1. On the Edit layout bar pick **Valves/Equipment > 🔨 Build new Equipment Template**. The 🔨 Build Tab opens for a Template, and the
   buttons for things that can't go in one (Widgets, Picture, Text, Tab settings, New tab, Hidden Tab, Processes) are greyed out.
2. Put on it **one immersion chiller** (Add equipment ➕ > Chilling coil, 2 IPs), and what goes with it: its **hoses** (Draw hose or
   Draw QD hose: the supply hose to its In and the waste hose from its Out), an **Ice Water Can**, a **Sump Pump** (Pumps > Sump Pump
   by hand, or a sump pump Device on a controlled wall outlet) and any **IPs** they need.
3. Press **✅ Finish Build ...**: **As a Template** is first. Give it a name (for example Ice_Bath_Chiller) and press **Save as Template**.

It is in ☰ Menu > Equipment Templates and in **Valves/Equipment**. Picking it puts all of it on the 🔨 Build Tab together, hoses
still joined; a name already used gets a number. A Template never keeps a Port, so a sump pump Device gets the **next free Port** of
the Build's Interface when it is put down (or Skynet says to give it one in Properties). Anything else on the Build Tab (a Widget,
a picture, text, a second chiller) is named, and As a Template says to take it off first.

While Skynet is still building its Templates there is a **Skynet Template** switch (off = a User Bundled Template). See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).
