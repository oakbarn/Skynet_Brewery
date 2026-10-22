# Build Tab

Building something new on a busy Tab is hard: it lands on top of other things and is fiddly to grab. So new things are made first on a clean **Build Tab**. When it is ready, **Save Build ...** asks where it goes: onto one of your Tabs, or into a Template.

The Build Tab only shows while you are building. It has a dashed orange edge and a 🔨 in the Tab bar. It is never saved with the Schema.

## Start building

1. Press **☰ Menu** and pick **Edit layout**.
2. Do one of these:
   - Press **Add element** (a Device or Widget) or **Add equipment** (a vessel, chiller, coil, trub filter or RIMS tube). The Build Tab opens by itself and the new item is made there.
   - Press **🔨 Build Tab** on the Edit layout bar to open it empty.
   - In **☰ Menu > Vessel Templates**, **Equipment Templates** or **Fitting Templates**, open a Template, press **Add to Tab** and pick **🔨 Build Tab** at the top of the Tab list.
3. Build it on the Build Tab: set its properties, add its IPs, draw its pipes. Everything on the Edit layout bar works there.

**Add IP**, **Add graphic**, **Add text** and the pipe fittings (tee, elbows, cross) still go on the Tab you are on, because they are small and are usually placed right where they belong.

You can go back and forth between the Build Tab and your other Tabs at any time. The Build Tab is the size of the Tab you came from.

## Save Build

Press **💾 Save Build ...** on the Edit layout bar. A pop-up asks where it should go:

| Pick | What happens |
|---|---|
| **To a Tab** | Pick the Tab (the one you came from is first) and press **Save to Tab**. Everything on the Build Tab moves there, in the same spot it had on the Build Tab. Drag it to its place, then press **Save layout**. |
| **As a Template** | Type a **Template Name** (no spaces, unique) and press **Save as Template**. It is saved at once in **☰ Menu**, and the Build Tab closes. Use **Add to Tab** on the Template to put it on a Tab. |
| **Throw it away** | Everything on the Build Tab is deleted (it asks first). |
| **Keep building** | Back to the Build Tab, nothing changes. |

A new Device whose name still follows the suggested name gets the **Tab ID** of the Tab it moves to at the end of its name (for example `MB_25_PWM_VlV_Fly_Sparge_SP`). A name you typed yourself is never changed.

If you press **Save layout** while something is still on the Build Tab, the Save Build pop-up opens first, so nothing is lost. **Exit without Saving** throws away the Build Tab with the rest of your changes.

## What can be a Template

A Template is **one vessel** (with the Bundled Fittings on its ports) or **one Bundled Fitting**. While anything else is on the Build Tab (a Device, a Widget, a loose IP, a pipe, a picture or text), **As a Template** is greyed out and says why. Save to a Tab instead, or delete those from the Build Tab first.

- A vessel, chiller, coil, trub filter or RIMS tube becomes a **Vessel Template** (or an **Equipment Template**). It keeps its kind, type, picture, the size it is drawn at, sizes, heat source, Connection Standard, notes and which ports are on and where.
- A Bundled Fitting on one of its ports that is still the same as its Template is used as it is. One you changed on the Build Tab is saved as a new **Bundled Fitting Template** first, named after it.
- A Tab_Fitting by itself becomes a **Bundled Fitting Template**.

While Skynet is still building its Templates there is a **Skynet Template** switch (off = a User Template). See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).
