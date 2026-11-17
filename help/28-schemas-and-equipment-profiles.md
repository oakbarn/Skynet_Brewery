# Schemas and Equipment Profiles

A **Schema** is one whole brewery setup: its tabs, Devices, Widgets, pipes and the **Equipment Profile** each of its Tabs uses. You can keep as many Schemas as you like, for example one for the 10 gallon system and one for the BrewZilla. Each Schema is kept in its own file on the Brain, in `config/schemas`.

An **Equipment Profile** describes your brewing equipment: the losses, the efficiency, the vessels and other equipment it is built from **and its piping** (its Default Layout). Profiles live on their own, so **any Schema can use any profile**. A profile used by one Tab is **unique**. A profile used by several Schemas is **shared**, and a change to it changes all of them.

**An Equipment Profile belongs to a Tab, not to the whole Schema.** A Schema can have as many Equipment Profiles as it has Tabs. Usually there are two: one Tab for the **Hot Side** (HLT, Mash Tun, Brew Kettle, chiller) and one for **Fermentation** (the fermenters). A Schema uses a profile on one Tab only. A Tab without a profile keeps its equipment in the Schema itself.

The profile is not copied into the Schema. It is where the information is stored. The Tab_Vessels, Tab_Fittings, chillers, coils, filters, IPs, pipes and hoses on a Tab are saved in that Tab's Equipment Profile, and they are the profile's **Equipment list**. Load another Schema that uses the same profile on one of its Tabs, and the same equipment and pipes are on that Tab.

Panels made before this change had one profile for the whole Schema. On the first start after the update it moves by itself to the Tab that holds its equipment (the Equipment Tab, or the Tab with the most equipment). Equipment on the other Tabs stays where it is, kept in the Schema. Devices (pumps, valves, probes on a board), pictures and text stay with the Schema.

Only an **Admin** can load, add, rename, back up, restore or delete a Schema, or change an Equipment Profile. Everyone else can look.

## Pick and load a Schema

1. The **Schema** dropdown is on the Menu Bar, next to the panel's name, and also on **☰ Menu > Schema** and **☰ Menu > About**. It shows the Schema that is loaded now.
2. Pick another Schema in the list.
3. The panel asks if you want to load it, with a ⚠ warning if any Process is running. Press **OK**.
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
2. In the **Open** dropdown (or a Tab's dropdown in the box at the top), pick **Add new ...**.
3. Give it a name, for example "Oak Barn Hot Side" or "Fermentation room", and pick what it starts from: **Answer a few questions (the Interview)** (the first choice: it asks for the vessels, pumps and valves and builds them; see [The Equipment Profile Interview](196-equipment-profile-interview)), the usual numbers, or a copy of another profile.
4. Pick the **Units**: US (gallons, pounds, °F) or Metric (liters, kilograms, °C).
5. In **Use it on a Tab**, pick the Tab it is for, or **(not now)**.
6. Press **OK**. The profile opens.

## What is in an Equipment Profile

- **System Loss (Trub, Chiller Manifold and Hoses)**: what is left behind between the kettle and the fermenter.
- **Cooling shrinkage**, **Grain absorption**, **Brewhouse efficiency** and **Hop utilization**. The Brewhouse efficiency is the only Efficiency in Skynet: a new profile starts at 72 %, and every Recipe whose **Brew on** Tab uses this profile works out its Expected Gravity with it ([The Recipe tab](99-recipe-tab)).
- **Notes**.
- **Equipment list**: the Tab_Vessels and Tab_Fittings on its Tab, with their kind, size, the Template they came from and the vessel each fitting is joined to. You put them on the Tab from the [Vessel and Fitting Templates](50-vessel-and-fitting-templates) (**Add to Tab**) and change each one in its properties on the Tab.

Some numbers moved out of the profile (2026-10-20):

- **Batch size** and both **top up** waters (kettle and fermenter) are set in the Recipe (coming next).
- **Boil time** and **boil off** are in the [Boil Profile](35-mash-and-boil-profiles).
- Each vessel's **size** and **dead space** are in its Properties on the Tab (the [Equipment Profile Interview](196-equipment-profile-interview) asks them), and the **fermenter trub loss** belongs to the Fermenter.

## Edit or delete an Equipment Profile

- **Edit:** pick it in the **Open** dropdown. Change the numbers, then press **Save** (at the top or the bottom). **Cancel** puts back what was saved.
- **Delete:** open it and press **Delete**. The Tabs that used it are left with no profile. Their equipment and pipes stay on them.

The **Check the volumes** box works out the pre-boil volume, how much boils off, the post-boil volume, what goes into the fermenter and what is left to bottle or keg. Type a **Batch size** and pick a **Boil Profile** to try them (the Recipe will give these on brew day). It uses the first **Brew Kettle** and the first **Fermenter** in the profile's Equipment list (a Fermentation Tab's profile has no kettle, so it says so). A ⚠ line warns you when the pre-boil volume is more than the kettle holds, or the batch is more than the fermenter holds.

## Efficiency on this Schema

Grain grind, mash conversion and sparge all change the Brewhouse Efficiency, and they are hard to keep track of. The result is easy to track, so Skynet keeps it for you. The **Efficiency on this Schema** box under the Equipment list shows each brew recorded with this profile in the loaded Schema: the **Date**, the **Recipe**, the **Brew on** Tab, the **OG**, the volume **Into the fermenter** and the real **Efficiency**.

1. After a brew, load its Recipe (☰ Menu > Recipe) and check its **Brew on** Tab.
2. Open the Equipment Profile of that Tab and press **📝 Record a brew**.
3. Type the **OG** (the gravity in the fermenter, like 1.052), the volume that went **Into the fermenter** and the **Date**, then press **OK**. Skynet works out the real Efficiency from the Recipe's grain bill and shows it, with the average.

The brews are kept in the **Schema**, so each Schema has its own list (a Schema made as a copy of another starts with that one's list). Skynet averages the **last 10 brews** on this Schema with this profile. 🗑 takes a brew out of the list when it was typed in wrong.

**Use the average (x %)** puts that average into this profile's **Brewhouse efficiency**. Skynet shows the change first, and **↩ Undo** puts the old number back. A shared profile is changed for every Schema that uses it; press **Make it unique to this Tab** first to change it for this Schema only. The button shows only when the average is different from the profile's number, for an Admin, and when the profile is not locked.

Any user can record a brew; only an Admin can use the average.

## Give each Tab its Equipment Profile

The box at the top of the **Equipment Profile** tab lists every Tab of the loaded Schema, each with its Equipment Profile.

- Pick a profile in a Tab's dropdown to use it on that Tab. Pick **Add new ...** to make a new one. A profile already used on another Tab of this Schema can't be picked (it says which Tab).
  - If that profile already has a **Default Layout** (equipment and pipes drawn), the panel asks what goes on the Tab:
    - **Use its Default Layout**: its equipment and pipes take the place of the ones on this Tab. The other Tabs are not touched. The old ones stay saved in the profile they came from.
    - **Keep this Tab's layout as it is**: the Tab is not changed, and the profile's Default Layout is left alone. See **The Default Layout** below.
  - If it has none drawn yet (a new profile), it takes the equipment and pipes that are on the Tab now as its Default Layout.
  - Picking **(none)** takes the profile off the Tab. The equipment and pipes stay on the Tab, kept in the Schema itself.
- **Open** opens that Tab's profile below.
- Under each Tab it says whether the profile is **Unique** (only this Tab uses it) or **Shared** (and with which Schemas and Tabs).
- **Make it unique to this Tab** shows when the profile is shared. It makes a copy of the profile just for this Tab, and the others keep the original.

## The Default Layout

The **Default Layout** is the profile's drawing: the vessels, fittings, IPs, pipes and hoses of its Tab. Open it with **☰ Menu > Default Layout**, and pick the **Tab** at the top.

A Tab either **follows** its profile's Default Layout or **keeps its own layout**:

- **Follows** (the usual): what you draw on the Tab is saved as the Default Layout. Every other Tab (in other Schemas) that follows the same profile shows the same equipment and pipes.
- **Keeps its own layout**: the Tab stays as it is. Changes to it stay in the Schema and don't change the profile.

The buttons on the Default Layout tab:

- **Edit it**: opens Edit layout on the Tab.
- **Use it on this Tab** (or **Load it on this Tab again**): puts the Default Layout on the Tab, and the Tab follows it from now on. A backup of the Schema is made first.
- **Save this Tab's layout as the Default Layout**: the Tab's equipment and pipes become the Default Layout. Other Schemas that follow the profile get them when they are loaded.
- **Keep this Tab's own layout**: stop following, and keep the Tab as it is.

If a piece coming from a Default Layout has the same name as something already in the Schema, it gets _2 (then _3 ...) on the end, so two names never clash.

## Lock the Equipment Profile

When the profile is right, lock it so nothing gets bumped on brew day.

- Switch on **🔒 Locked** next to the Tab's profile in the box at the top of the **Equipment Profile** tab. Operators and Admins can do this. Each Tab's profile is locked on its own, so the Fermentation Tab can stay open while the Hot Side is locked.
- Or put `lock_Equipment` in a Process (and `unlock_Equipment` to unlock). It locks (or unlocks) the profiles of **every** Tab of the loaded Schema. See [The Process language](22-process-language).

While it is locked:

- Its numbers and its equipment list can't be changed, and it can't be deleted.
- On its Tab, **Edit layout** can't move, add, change or delete equipment, IPs, pipes or hoses. **Save layout** says it is locked. Devices, pictures and text can still be changed, and so can the other Tabs.
- The Tab can't switch to another profile.

To unlock, switch **🔒 Locked** off (the panel asks first), or run `unlock_Equipment`. The Brew Day (coming soon) will lock the profile by itself when it starts.

## Build the Equipment list

The **Equipment list**, under the numbers, shows what is on the profile's Tab.

1. Go to **☰ Menu > Vessel Templates** (or **Fitting Templates**). The buttons under the list open them.
2. Double-click a Template and press **Add to Tab**. Pick the Tab that uses the profile.
3. The new Tab_Vessel or Tab_Fitting shows in the Equipment list. Change it in its properties on the Tab (double-click it in Edit layout).

**Go to the Tab** shows you the Tab itself.

Profiles made before Templates may still have a list of vessels. They show under **Made before Templates**, with **Put on Tab** to draw them on the profile's Tab ([Vessel settings](34-vessel-tab)).

## The Equipment Profile view

**Open** beside a Tab's profile (or **🖼 View the Equipment Profile** under the Open dropdown) shows the profile as the brewery it is: the Tab that uses it, with only its hardware (the vessels, pumps, valves, heaters, probes, fittings, IPs, pipes and hoses), as it looks on Brew Day. Nothing on it can be clicked there. When no Tab of the loaded Schema uses the profile, a drawing of its pieces shows instead.

The bar on top stays put:

- **➡ Transfer All to Tab**, **➡ Transfer Vessels to Tab** and **➡ Transfer Manifold to Tab** put that part of the hardware on the **Tab** picked beside them, with one click each. They do the same as **📋 Paste onto a Tab** (below) with Both, Vessels Only or Manifold Only: the pieces land on the 🔨 Build Tab, hardware that is the same is replaced after the Replace list, and **↩ Undo** shows after.
- **🗑 Delete**, **💾 Save**, **↶ Undo** and **✕ Close**, in that order.

Under them are the profile's **Properties**, the numbers that go with it to a Tab: System Loss, Cooling shrinkage, Grain absorption, **Brewhouse efficiency** and Hop utilization. **⚙ Properties** changes them (and the Name, Units and Notes); **💾 Save** keeps them. **📋 More ...** opens everything else on ☰ Menu > Equipment Profile: the volume check, the Equipment list, Efficiency on this Schema and the lock.

**The Properties go with every Transfer and Paste.** When the Tab already has its own Equipment Profile, the numbers that change are in the Replace list ("Brewhouse efficiency 74 % → 72 %"). When the Tab has no profile yet, it takes this one, so its Efficiency comes too. The Tab keeps its own layout, so the paste never changes the profile's drawing. This does not happen when another Tab of the Schema already uses the profile, because a Schema uses a profile on one Tab only.

## Paste a profile, or start a new Schema from it

An Equipment Profile holds **all of the brewery's physical hardware**: the vessels, IPs, fittings, pipes, hoses, chillers, pumps and valves, **and the Interfaces (boards), their Ports and wiring**, each with all of its Properties and its Name. Skynet keeps them in the profile every time the Tab that uses it is saved. Two buttons under the Equipment list use them (Admins only).

**🗂 New Schema from this profile ...** (also **Add new Schema ... > Start from > An Equipment Profile**) makes a new Schema with one Tab that uses the profile, so its numbers and drawing come too, with every board and every Device already wired: the same Names, Interfaces and Ports. No Processes, Text Widgets, Timers or other Widgets come: the new Schema gets its own. For example, build your brewery once as an Equipment Profile, then make a **Keg Cleaning** Schema from it and write its Processes, Text Boxes and Timers. The new Schema is loaded at once; the one you had stays just as it is.

**📋 Paste onto a Tab ...** puts a copy of the profile's hardware on a Tab of the loaded Schema:

1. Pick **What to paste**:
   - **Both**: all of it.
   - **Vessels Only**: each vessel with everything on it (its IPs, fittings, heaters and probes).
   - **Manifold Only**: all of the manifold (pumps, valves, pipes, hoses, fittings, chillers), not the vessels.
2. Pick the Tab it **Goes to**, and press **💾 Save**.
3. When that Tab already has hardware that is the same as the profile's (the same board and Port, or a vessel with the same Name), a list shows what will be replaced, and the Tab's own profile numbers that change (like "Brewhouse efficiency 74 % → 72 %"). Nothing changes until you press **Replace**. **Cancel** leaves everything as it was. A replaced Device keeps working in your Processes.
4. Edit layout opens and the pieces are on the **🔨 Build Tab**. Press **✅ Finish Build ... > Move to Tab**: they go on the Tab in the same spots. Then press **Save layout**.

**↩ Undo** shows for a few seconds after a paste and puts everything back.

- **A pipe end whose piece did not come stays open**, so a vessel can be joined to it (with Manifold Only, the pipes that went to the vessels).
- **A board already used on another Tab of this Schema stops the paste.** Nothing is pasted, and a note says which board and which Tab. One board is never split between Tabs, and its ID never changes. Paste onto that Tab, or start a new Schema from the profile. A new Schema always takes the boards.
- A board the Schema does not have yet comes with the paste, with its ID and settings.
- A piece whose Name is already used on another Tab gets _2 at the end.

## Coming next

Recipes (BeerSmith import, scaling, SRM and IBU), the Fermentation tab, the Brew Day Recipe and reports will be added to the **☰ Menu**.
