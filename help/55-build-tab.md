# Build Tab

Building something new on a busy Tab is hard: it lands on top of other things and is fiddly to grab. So **everything new is made first on a clean Build Tab**: every Device, Widget, IP, picture, text, piece of equipment and copy of a Template. You can look at it with **👁 Preview** at any time. When it is ready, **Save Build ...** asks where it goes: onto one of your Tabs (one pick and one click), or into a Template.

The Build Tab only shows while you are building. It has a dashed orange edge and a 🔨 in the Tab bar. It is never saved with the Schema.

## Start building

1. Press **☰ Menu** and pick **Edit layout**.
2. Do one of these:
   - Pick a Device in **Add Device** (or a shortcut: **Pumps**, **Valves**, **Probe**, **Heating Element**, **PWM**), a Widget in **Add Widget**, or press **Picture ➕**, **Text ➕**, **Vessel**, **Manual Valve ➕**, **Add equipment ➕** or **Elbows, Tees …** (see [Edit layout bar](82-edit-layout-bar)). The Build Tab opens by itself and the new item is made there.
   - Press **🔨 Build Tab** on the Edit layout bar to open it empty.
   - In **☰ Menu > Vessel Templates**, **Equipment Templates** or **Fitting Templates**, open a Template (a Skynet Template or a User Bundled Template) and press **Add to Tab** or **Clone**. The copy is made on the Build Tab (see **Copies of Templates** below).
3. Build it on the Build Tab: set its properties, add its IPs, draw its pipes. Everything on the Edit layout bar works there.

You can go back and forth between the Build Tab and your other Tabs at any time. The Build Tab is the size of the Tab you came from.

## Preview

Press **👁 Preview** on the Edit layout bar (it shows while there is a Build Tab). The Build Tab is drawn the way it will look on Brew Day: no grid, no dashed outlines, no resize corners or padlocks. Nothing can be moved or changed while you look: press **✏ Back to building** (the same button) to go on building.

The Preview works before and after you change an item's Properties, as often as you like, until the build is sent to a Tab or a Template. Going to another Tab ends it too. The **Save Build** pop-up also has a **👁 Preview** button, so you can have one more look before you pick where it goes.

## Copies of Templates

A copy of a Template, from a **Skynet Template** or a **User Bundled Template**, is always made on the Build Tab first.

- **Add to Tab**: pick the Tab it goes on and its name. The copy is made on the Build Tab, Bundled. **Save Build ... > Save to Tab** then offers that Tab first.
- **Clone**: give the new Template a name. The copy is made on the Build Tab. Change it there, then **Save Build ...** shows **As a Template** first, with that name filled in. Press **Save as Template** and the new Template is saved. What the Build Tab doesn't show (like each port's Connection Standard) is copied from the Template you cloned.

If you are not in Edit layout yet, it is switched on for you.

## Save Build

Press **💾 Save Build ...** on the Edit layout bar. A pop-up asks where it should go:

| Pick | What happens |
|---|---|
| **To a Tab** | Pick the Tab (the one you came from is first) and press **Save to Tab**. Everything on the Build Tab moves there at the size it is now, in the middle of that Tab. Drag it to its place, then press **Save layout**. |
| **As a Template** | Type a **Template Name** (no spaces, unique) and press **Save as Template**. It is saved at once in **☰ Menu**, and the Build Tab closes. Use **Add to Tab** on the Template to put it on a Tab. |
| **Throw it away** | Everything on the Build Tab is deleted (it asks first). |
| **Keep building** | Back to the Build Tab, nothing changes. |

A new Device whose name still follows the suggested name gets the **Tab ID** of the Tab it moves to at the end of its name (for example `MB_25_PWM_VlV_Fly_Sparge_SP`). A name you typed yourself is never changed.

If you press **Save layout** while something is still on the Build Tab, the Save Build pop-up opens first, so nothing is lost. **Exit without Saving** throws away the Build Tab with the rest of your changes.

## Change a bundled item on the Build Tab

A bundled item (a vessel or Tab_Fitting with its IPs) can be taken off its Tab, changed on the Build Tab, and put back in the same place.

1. In **Edit layout**, double-click the bundled item. Switch off **Bundled** and press **Save**.
2. A pop-up asks **Move it to the 🔨 Build Tab to work on it?**
   - **OK (Yes)**: Skynet remembers its Tab, its spot and its size, and moves it with its IPs to the Build Tab. Pipes drawn to it stay on its Tab.
   - **Cancel (No)**: it is un-bundled where it is, as before.
3. Change it on the Build Tab, then press **💾 Save Build ...**.
4. A pop-up asks **Put it back where it came from?**
   - **OK (Yes)**: it goes back on the same Tab, in the same spot and at the same size, and is bundled again. Its IPs keep their place on the picture.
   - **Cancel (No)**: it is saved like a new build. The Save Build pop-up opens: pick a Tab and it goes there at the size it is now, in the middle of the Tab, bundled again.
5. Press **Save layout** to keep it.

If its Tab was deleted or renamed in the meantime, the question is skipped and it is saved like a new build. **Throw it away** and **As a Template** both take it off your Tab for good (Throw it away names it and asks first).

## What can be a Template

A Template is **one vessel** (with the Bundled Fittings on its ports) or **one Bundled Fitting**. While anything else is on the Build Tab (a Device, a Widget, a loose IP, a pipe, a picture or text), **As a Template** is greyed out and says why. Save to a Tab instead, or delete those from the Build Tab first.

- A vessel, chiller, coil, trub filter or RIMS tube becomes a **Vessel Template** (or an **Equipment Template**). It keeps its kind, type, picture, the size it is drawn at, sizes, heat source, Connection Standard, notes and which ports are on and where.
- A Bundled Fitting on one of its ports that is still the same as its Template is used as it is. One you changed on the Build Tab is saved as a new **Bundled Fitting Template** first, named after it.
- A Tab_Fitting by itself becomes a **Bundled Fitting Template**.

While Skynet is still building its Templates there is a **Skynet Template** switch (off = a User Bundled Template). See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).
