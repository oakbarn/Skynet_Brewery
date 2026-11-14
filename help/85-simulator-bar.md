# The Simulator bar

While the panel is in **Simulator mode** (🧪 beside ☰ Menu), a yellow striped **🧪 SIMULATION** bar shows under the Menu Bar on every Tab. Admins get the Speed, skip buttons and Auto skip on it.

## Hide or Show it

- Press **▴ Hide** at the right end of the bar (or **☰ Menu > 🧪 Hide Simulator bar**). The bar is gone completely, so the Panel has the whole window.
- While it is hidden, a small **🧪** shows on the **☰ Menu** button, so you can still see that nothing real is switched.
- **☰ Menu > 🧪 Show Simulator bar** brings the whole bar back. It is in the ☰ Menu only in Simulator mode.
- Hiding and showing **changes nothing**: the Speed and Auto skip stay as you set them.
- It is remembered on this computer or phone only. Each screen can hide it or not.
- Switching to the Simulator again always shows the bar.

## It starts at 25× with Auto skip on

Each time the panel is switched to the Simulator (🔌 Real > 🧪 Simulator, the ☰ Menu, a new empty Schema or a Sample Schema), the bar opens with:

- **Speed 25× faster.** A 60 minute mash takes about 2 minutes 24 seconds.
- **Auto skip on.** Each step runs a few seconds, then time skips to just before the next one.

After that, change them as you like on the bar; your choice stays until the next time the Simulator is switched on. 25× is also in the Speed list any time.

## Every Simulator setting is on the bar

Every Simulator setting is on this bar, and only here. Speed and Auto skip are on the bar itself and are saved as soon as you change them. Press **⚙ Settings** on the bar (Admins) for the rest:

- **"Skip to next event" stops this many seconds before it** (5 seconds unless you change it).
- **Auto skip: watch each step for (seconds)** (5 seconds unless you change it).
- **Pretend readings are reached** and **after (clock seconds)** (on, 60 seconds unless you change it).
- The **Time jumps** table and the **Process timeline** (Help: [Simulation mode](20-simulation)).

Press **Save** at the top or the bottom of it, or **Close** to put it away. The Simulator settings are not in Settings or on the Default settings tab.

## Clone a Sample Schema to a User Schema

The **1, 2 and 3 vessel** Sample Schemas can be cloned the same way as your own Schemas:

1. Schema dropdown > **Clone a Schema ...** (or ☰ Menu > 🗂 Schema > Clone).
2. In **Schema to clone**, your Schemas are listed first, then the samples marked **🧪 Sample:**
   - **🧪 Sample: BrewZilla brew day (no board)** (one vessel)
   - **🧪 Sample: Two vessels, one pump**
   - **🧪 Sample: Three vessels, one pump**
3. Give the clone a name (empty: "<sample name> copy") and press **OK**.

The clone is a **User Schema** of your own: rename it, change it, clone or delete it like any other. A Sample clone is always loaded at once, because its Processes are written then. Every Interface in it is a simulator and the panel goes to Simulator mode, so nothing real is switched (see [Add a Sample Schema](83-sample-schemas)). The OakBarn Brewery sample is not offered for now.
