# Schemas and Equipment Profiles

A **Schema** is one whole brewery setup: its tabs, Devices, Widgets, pipes and the Equipment numbers of each Tab. You can keep as many Schemas as you like, for example one for the 10 gallon system and one for the BrewZilla. Each Schema is kept in its own file on the Brain, in `config/schemas`.

An **Equipment Profile** describes your brewing equipment: the losses, the efficiency, the vessels and other equipment it is built from **and its piping** (its Default Layout). Profiles live on their own, so **any Schema can use any profile**, on as many Tabs as you like.

**A profile is only copied onto a Tab to start a build.** The ➡ Transfer buttons, the New Schema Interview and 🗂 New Schema from this profile copy its hardware and its numbers onto the Tab. After that **the Tab keeps no link to the profile**: a change on the Tab never changes the profile, and a change to the profile never changes a Tab. Each Tab has its own **Equipment numbers** (Brewhouse efficiency, losses ...), copied from the profile and changed on the Tab.

A Schema made before this change, whose Tab was linked to a profile, loses the link the first time it is loaded: the Tab keeps a copy of the profile's equipment, pipes and numbers, so nothing on it is lost.

Only an **Admin** can load, add, rename, back up, restore or delete a Schema, or change an Equipment Profile. Everyone else can look.

## Pick and load a Schema

1. The **Schema** dropdown is on the Menu Bar, next to the panel's name, and also on **☰ Menu > Schema** and **☰ Menu > About**. It shows the Schema that is loaded now.
2. Pick another Schema in the list.
3. The panel asks if you want to load it, with a ⚠ warning if any Process is running. Press **▶ Proceed**.
4. Running Processes stop, every output is switched off, and the new Schema's tabs, Devices and Widgets take over. The one you left is kept just as it was. Pick it in the list to go back to it.

Each Schema remembers its own variable values (gGlobals), so they come back when you load it again.

Processes, logins, MQTT, media folders and the lists behind the dropdowns belong to the panel. They stay the same whichever Schema is loaded.

## Add, rename or delete a Schema

At the bottom of the **Schema** dropdown:

- **Add new Schema ...** (also **☰ Menu > ➕ New Schema…**): give it a name, then pick what it starts from. Every step, with pictures: [Step by Step: Add a Schema](188-step-by-step-add-a-schema). **A copy of** the loaded Schema copies everything, which is good for trying changes. **An empty Schema** starts with just a Main tab and the Equipment tab. **An Equipment Profile** starts with that profile's hardware already wired ([Paste a profile, or start a new Schema from it](#paste-a-profile-or-start-a-new-schema-from-it)). The new Schema is loaded straight away.
- **Clone a Schema ...**: a copy of any Schema under a new name, loaded only if you say so. See [Switching and cloning Schemas](48-schema-switching-and-cloning).
- **Rename this Schema ...**: gives the loaded Schema a new name.
- **Delete a Schema ...**: pick one that is not loaded. It is moved to `config/schemas/deleted`, so it can be got back.

Loading a sample under **Settings > Start from a sample Schema** also makes a new Schema, so a sample never writes over yours.

## Backups

- **Every time a change is saved**, the Schema as it was is kept as a backup, named `<Schema name>_yyyymmddThhmm.BacUp`. Skynet does this in the Background and needs no user input.
- **Back up this Schema now** in the Schema dropdown makes one straight away.
- A backup never writes over another one, and none is ever removed.
- **Restore a backup ...** shows the loaded Schema's backups with their dates. Pick one and press **Save**. The Schema as it is now is backed up first, so you can undo a restore by restoring that backup.

Backups are in `config/schemas/backups/<schema name>`.

## Make an Equipment Profile

Equipment Profiles are made on the **Equipment Profile** Menu tab. See [The ☰ Menu](33-menu) for how Menu tabs open and close.

1. Press **☰ Menu** and pick **Equipment Profile**.
2. In the **Open** dropdown, pick **Add new ...**.
3. Give it a name, for example "Oak Barn Hot Side" or "Fermentation room", and pick what it starts from: **Answer a few questions (the Interview)** (the first choice: it asks for the vessels, pumps and valves and builds them; see [The Equipment Profile Interview](196-equipment-profile-interview)), the usual numbers, or a copy of another profile.
4. Pick the **Units**: US (gallons, pounds, °F) or Metric (liters, kilograms, °C).
5. Pick a **Tab** of the Schema, or **(none)**. The Interview builds on that Tab. With the usual numbers, the equipment already on that Tab is copied into the new profile (Tab to profile only).
6. Press **OK**. The profile opens (see **The Equipment Profile view** below).

## What is in an Equipment Profile

- **System Loss (Trub, Chiller Manifold and Hoses)**: what is left behind between the kettle and the fermenter.
- **Cooling shrinkage**, **Grain absorption**, **Brewhouse efficiency** and **Hop utilization**. The Brewhouse efficiency is the only Efficiency in Skynet: a new profile starts at 72 %, and it is copied onto each Tab the profile is copied onto, and a Recipe works out its Expected Gravity with the **Brew on** Tab's own copy ([The Recipe tab](99-recipe-tab)).
- **Strike offset**: degrees added to the Strike Temperature, to make up for the heat a cold Mash Tun takes from the Strike Water. It belongs to the equipment, not the recipe: **0** for an All In One (the grain goes into the vessel that heated the water) or a pre-heated Mash Tun, more for a Mash Tun that starts cold. Each Tab gets its own copy, so two breweries can have two numbers (for example 10 °F on one and 0 on the other). A Recipe's **Calculate** adds the **Brew on** Tab's Strike offset; a Tab with none adds 0. Change it on the Tab when the brewery air is much hotter or colder than usual.
- **Notes**.
- **Its hardware**: the real world things on its Tab (see **The Equipment Profile view** below). You put them on the Tab from the [Vessel and Fitting Templates](50-vessel-and-fitting-templates) (**Add to Tab**), the Interview or Edit layout, and change each one in its properties on the Tab.

Some numbers moved out of the profile (2026-10-20):

- **Batch size** and both **top up** waters (kettle and fermenter) are set in the Recipe (coming next).
- **Boil time** and **boil off** are in the [Boil Profile](35-mash-and-boil-profiles).
- Each vessel's **size** and **dead space** are in its Properties on the Tab (the [Equipment Profile Interview](196-equipment-profile-interview) asks them), and the **fermenter trub loss** belongs to the Fermenter.

## Edit or delete an Equipment Profile

- **Edit:** pick it in the **Open** dropdown (it opens as itself, see **The Equipment Profile view** below). Press **⚙ Properties**, change the numbers, then press **💾 Save**. **↶ Undo** puts back what was saved.
- **Delete:** open it and press **🗑 Delete**. No Tab is linked to it, so the Tabs it was copied onto keep their equipment, pipes and numbers.

**🧮 Check the volumes** in the profile view works out the pre-boil volume, how much boils off, the post-boil volume, what goes into the fermenter and what is left to bottle or keg. Type a **Batch size** and pick a **Boil Profile** to try them (the Recipe will give these on brew day). It uses the first **Brew Kettle** and the first **Fermenter** in the profile (a Fermentation Tab's profile has no kettle, so it says so). A ⚠ line warns you when the pre-boil volume is more than the kettle holds, or the batch is more than the fermenter holds.

## Each Tab's Equipment numbers

The box at the top of the **Equipment Profile** tab lists every Tab of the loaded Schema, with the Tab's own Equipment numbers. They act as the Tab's defaults, and you can change them any time:

- **⚙ Numbers** changes the Tab's System Loss, Cooling shrinkage, Grain absorption, **Brewhouse efficiency**, Hop utilization and **Strike offset** (Admins). The same numbers are in **Edit layout > Tab Settings > Equipment numbers**.
- **📈 Efficiency** shows the brews on that Tab (see **Efficiency of a Tab** below).
- **🔒 Locked** locks the equipment on that Tab (see **Lock the equipment on a Tab** below).
- **💾 Save as a profile ...** copies the Tab's equipment, pipes, hardware and numbers into a new Equipment Profile, or over one you pick. It only goes that way, from the Tab to the profile, and no link is kept.
- **🔌 Give ... a Port** shows when pumps or motorized valves copied onto the Tab have no Port in this Schema yet.

## Efficiency of a Tab

Grain grind, mash conversion and sparge all change the Brewhouse Efficiency, and they are hard to keep track of. The result is easy to track, so Skynet keeps it for you. **📈 Efficiency** on a Tab's row shows each brew recorded on that Tab: the **Date**, the **Recipe**, the **OG**, the volume **Into the fermenter** and the real **Efficiency**.

1. After a brew, load its Recipe (☰ Menu > Recipe) and check its **Brew on** Tab.
2. On ☰ Menu > Equipment Profile, press **📈 Efficiency** on that Tab's row, then **📝 Record a brew**.
3. Type the **OG** (the gravity in the fermenter, like 1.052), the volume that went **Into the fermenter** and the **Date**, then press **OK**. Skynet works out the real Efficiency from the Recipe's grain bill and shows it, with the average.

The brews are kept in the **Schema**, so each Schema has its own list (a Schema made as a copy of another starts with that one's list). Skynet averages the **last 10 brews** on the Tab. 🗑 takes a brew out of the list when it was typed in wrong.

**Use the average (x %)** puts that average into the Tab's **Brewhouse efficiency**. Skynet shows the change first, and **↩ Undo** puts the old number back. Only that Tab changes. The button shows only when the average is different from the Tab's number, and for an Admin.

Any user can record a brew; only an Admin can use the average.

## The Default Layout

The **Default Layout** is the profile's drawing: the vessels, fittings, IPs, pipes and hoses it holds. It is copied onto a Tab with the ➡ Transfer buttons (see **The Equipment Profile view** below). **☰ Menu > Default Layout** picks a **Tab** at the top, with:

- **Edit this Tab's layout**: opens Edit layout on the Tab.
- **💾 Save this Tab as a profile ...**: copies the Tab's drawing, hardware and numbers into a new profile, or over one you pick (Tab to profile only).

If a piece coming from a profile has the same name as something already in the Schema, it gets _2 (then _3 ...) on the end, so two names never clash.

## Lock the equipment on a Tab

When the equipment on a Tab is right, lock it so nothing gets bumped on brew day.

- Switch on **🔒 Locked** on the Tab's row in the box at the top of the **Equipment Profile** tab. Operators and Admins can do this. Each Tab is locked on its own, so the Fermentation Tab can stay open while the Hot Side is locked.
- Or put `lock_Equipment` in a Process (and `unlock_Equipment` to unlock). It locks (or unlocks) **every** Tab of the loaded Schema that has equipment. See [The Process language](22-process-language).

While it is locked, **Edit layout** can't move, add, change or delete the equipment, IPs, pipes or hoses on that Tab, and **Save layout** says it is locked. Devices, pictures and text can still be changed, and so can the other Tabs.

To unlock, switch **🔒 Locked** off (the panel asks first), or run `unlock_Equipment`. The Brew Day (coming soon) will lock the equipment by itself when it starts.

## Build the hardware of a profile

Build on a Tab, then copy the Tab into the profile:

1. Go to **☰ Menu > Vessel Templates** (or **Fitting Templates**).
2. Double-click a Template and press **Add to Tab**. Pick the Tab.
3. Change it in its properties on the Tab (double-click it in Edit layout), then **Save layout**.
4. On ☰ Menu > Equipment Profile, press **💾 Save as a profile ...** on that Tab's row. Open the profile: the pieces are in it.

## The Equipment Profile view

Picking a profile in the **Open** dropdown shows the profile itself. An Equipment Profile is **not a Tab**: it is a profile of the brewery's real world hardware, and that is all it holds: the vessels, IPs, fittings, pipes, hoses, pumps, valves, heaters, probes, chillers (an immersion chiller goes with the vessel it sits in) and **any Widget with an IP** (a Widget with an IP is a real world thing), with their Interfaces (boards) and Ports. A **Switch that is a real world thing** (wired to a board's Port) is a Special Widget like a Manual Valve, so it is in the profile too. Text Boxes, Processes, Timers, Switches that are not real world things and the like **cannot be added** to a profile, so they are not part of this view at all. Nothing on it can be clicked.

The bar on top stays put:

- **Move** (a dropdown: **Entire Profile**, **Just Vessels** or **Just Manifold**), **To Tab** (a dropdown: **🔨 Build Tab** every time the profile opens, or a Tab you pick) and **➡ Transfer**, which moves that part of the hardware with one click. They paste the profile (see **Paste a profile** below): the pieces land on the 🔨 Build Tab, hardware that is the same is replaced after the Replace list, and **↩ Undo** shows after.
- **🗑 Delete**, **💾 Save**, **↶ Undo** and **✕ Close**, in that order.

Under them are the profile's **Properties**, the numbers that go with it to a Tab: System Loss, Cooling shrinkage, Grain absorption, **Brewhouse efficiency**, Hop utilization and Strike offset. **⚙ Properties** changes them (and the Name, Units and Notes); **💾 Save** keeps them. Beside them:

- **🧮 Check the volumes** and **📈 Efficiency** open their box under the bar (press again to close it). See **Edit or delete an Equipment Profile** above. **📈 Efficiency** shows the Tab picked in To Tab (see **Efficiency of a Tab** above).
- **🗂 New Schema from this profile ...** (see below).

**The Properties go with every Transfer and Paste.** They are copied onto the Tab as its own Equipment numbers. When the Tab already has numbers, the ones that change are in the Replace list ("Brewhouse efficiency 74 % → 72 %"). The paste never changes the profile.

## Paste a profile, or start a new Schema from it

An Equipment Profile holds **all of the brewery's physical hardware**: the vessels, IPs, fittings, pipes, hoses, chillers, pumps and valves, **and the Interfaces (boards), their Ports and wiring**, each with all of its Properties and its Name. They come into the profile from a Tab with **💾 Save as a profile ...**. Two things in the profile view use them (Admins only).

**🗂 New Schema from this profile ...** (also **Add new Schema ... > Start from > An Equipment Profile**) makes a new Schema with one Tab that starts from a copy of the profile, so its numbers and drawing come too, with every board and every Device already wired: the same Names, Interfaces and Ports. No Processes, Text Widgets, Timers or other Widgets come: the new Schema gets its own. For example, build your brewery once as an Equipment Profile, then make a **Keg Cleaning** Schema from it and write its Processes, Text Boxes and Timers. The new Schema is loaded at once; the one you had stays just as it is.

**➡ Transfer** puts a copy of the profile's hardware on a Tab of the loaded Schema:

1. Pick what to **Move** and the **To Tab**, and press **➡ Transfer**. With **🔨 Build Tab**, the pieces are for the Default Tab of the Build (else the Tab you were on):
   - **Entire Profile**: all of it.
   - **Just Vessels**: each vessel with everything on it (its IPs, fittings, heaters, probes and an immersion chiller in it).
   - **Just Manifold**: all of the manifold (pumps, valves, pipes, hoses, fittings, plate chillers), not the vessels.
2. When that Tab already has hardware that is the same as the profile's (the same board and Port, or a vessel with the same Name), a list shows what will be replaced, and the Tab's own numbers that change (like "Brewhouse efficiency 74 % → 72 %"). Nothing changes until you press **Replace**. **Cancel** leaves everything as it was. A replaced Device keeps working in your Processes.
3. Edit layout opens on the **🔨 Build Tab** with the pieces on it. Press **✅ Finish Build ... > Move to Tab**: they go on the Tab in the same spots. Then press **Save layout**.

**↩ Undo** shows for a few seconds after a paste and puts everything back.

- **A pipe end whose piece did not come stays open**, so a vessel can be joined to it (with Transfer Manifold, the pipes that went to the vessels).
- **A board already used on another Tab of this Schema stops the paste.** Nothing is pasted, and a note says which board and which Tab. One board is never split between Tabs, and its ID never changes. Paste onto that Tab, or start a new Schema from the profile. A new Schema always takes the boards.
- A board the Schema does not have yet comes with the paste, with its ID and settings.
- A piece whose Name is already used on another Tab gets _2 at the end.

## Coming next

Recipes (BeerSmith import, scaling, SRM and IBU), the Fermentation tab, the Brew Day Recipe and reports will be added to the **☰ Menu**.
