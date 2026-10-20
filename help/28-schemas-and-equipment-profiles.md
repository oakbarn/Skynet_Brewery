# Schemas and Equipment Profiles

A **Schema** is one whole brewery setup: its tabs, devices, elements, pipes and the **Equipment Profile** it uses. You can keep as many Schemas as you like, for example one for the 10 gallon system and one for the BrewZilla. Each Schema is kept in its own file on the Brain, in `config/schemas`.

An **Equipment Profile** describes your brewing equipment: the losses, the efficiency, the vessels and other equipment it is built from **and its piping** (its Default Layout). Profiles live on their own, so **any Schema can use any profile**. A profile used by one Schema is **unique**. A profile used by several Schemas is **shared**, and a change to it changes all of them.

The profile is not copied into the Schema. It is where the information is stored. The vessels, chillers, coils, filters, fittings, IPs, pipes and hoses you draw on a Schema's tabs are saved in its Equipment Profile. Load another Schema that uses the same profile, and the same equipment and pipes are on its tabs. Devices (pumps, valves, probes on a board), pictures and text stay with the Schema.

Only an **Admin** can load, add, rename, back up, restore or delete a Schema, or change an Equipment Profile. Everyone else can look.

## Pick and load a Schema

1. The **Schema** dropdown is at the top of every screen, next to the panel's name. It shows the Schema that is loaded now.
2. Pick another Schema in the list.
3. The panel asks if you want to load it. Press **OK**.
4. Running Processes stop, and the new Schema's tabs, devices and elements take over. The one you left is kept just as it was. Pick it in the list to go back to it.

Each Schema remembers its own variable values (vKonstants, vAPI), so they come back when you load it again.

Processes, logins, MQTT, media folders and the lists behind the dropdowns belong to the panel. They stay the same whichever Schema is loaded.

## Add, rename or delete a Schema

At the bottom of the **Schema** dropdown:

- **Add new Schema ...**: give it a name, then pick what it starts from. **A copy of** the loaded Schema copies everything, which is good for trying changes. **An empty Schema** starts with just a Main tab and the Equipment tab. The new Schema is loaded straight away.
- **Rename this Schema ...**: gives the loaded Schema a new name.
- **Delete a Schema ...**: pick one that is not loaded. It is moved to `config/schemas/deleted`, so it can be got back.

Loading a sample under **Settings > Start from a sample Schema** also makes a new Schema, so a sample never writes over yours.

## Backups

- **Every day** the panel backs up every Schema by itself. The last 30 daily backups are kept.
- **Back up this Schema now** in the Schema dropdown makes one straight away. These are never removed.
- **Restore a backup ...** shows the loaded Schema's backups with their dates. Pick one and press **Save**. The Schema as it is now is backed up first, so you can undo a restore by restoring that backup.

Backups are in `config/schemas/backups/<schema name>`.

## Make an Equipment Profile

Equipment Profiles are made on the **Equipment Profile** Menu tab. See [The ☰ Menu](33-menu) for how Menu tabs open and close.

1. Press **☰ Menu** and pick **Equipment Profile**.
2. In the **Open** dropdown (or the Schema's dropdown in the box at the top), pick **Add new ...**.
3. Give it a name, and pick what it starts from: the usual numbers, or a copy of another profile.
4. Pick the **Units**: US (gallons, pounds, °F) or Metric (liters, kilograms, °C).
5. Leave **Use it for the Schema** switched on to give it to the loaded Schema.
6. Press **Save**. The profile opens.

## What is in an Equipment Profile

- **System Loss (Trub, Chiller Manifold and Hoses)**: what is left behind between the kettle and the fermenter.
- **Cooling shrinkage**, **Grain absorption**, **Brewhouse efficiency** and **Hop utilization**.
- **Notes**.
- **Vessels and equipment**: as many as you need. Each one is set up on the [Vessel tab](34-vessel-tab): its size, dead space, trub loss, heat source and temperature probe.

Some numbers moved out of the profile (2026-10-20):

- **Batch size** and both **top up** waters (kettle and fermenter) are set in the Recipe (coming next).
- **Boil time** and **boil off** are in the [Boil Profile](35-mash-and-boil-profiles).
- Each vessel's **size** and **dead space** are on the Vessel tab, and the **fermenter trub loss** belongs to the Fermenter.

## Edit or delete an Equipment Profile

- **Edit:** pick it in the **Open** dropdown. Change the numbers, then press **Save** (at the top or the bottom). **Cancel** puts back what was saved.
- **Delete:** open it and press **Delete**. Schemas that used it are left with no profile. Their tabs and drawings stay as they are.

The **Check the volumes** box works out the pre-boil volume, how much boils off, the post-boil volume, what goes into the fermenter and what is left to bottle or keg. Type a **Batch size** and pick a **Boil Profile** to try them (the Recipe will give these on brew day). It uses the first **Brew Kettle** and the first **Fermenter** in the profile. A ⚠ line warns you when the pre-boil volume is more than the kettle holds, or the batch is more than the fermenter holds.

## Give a Schema its Equipment Profile

The box at the top of the **Equipment Profile** tab shows the loaded Schema and its Equipment Profile.

- Pick a profile in the dropdown to use it. Pick **Add new ...** to make a new one.
  - If that profile already has a **Default Layout** (equipment and pipes drawn), the panel asks what goes on this Schema's tabs:
    - **Use its Default Layout**: its equipment and pipes take the place of the ones on this Schema's tabs. The old ones stay saved in the profile they came from.
    - **Keep this Schema's layout as it is**: the tabs are not changed, and the profile's Default Layout is left alone. See **The Default Layout** below.
  - If it has none drawn yet (a new profile), it takes the equipment and pipes that are on this Schema's tabs now as its Default Layout.
  - Picking **(none yet)** takes the profile off. The equipment and pipes stay on the tabs, kept in the Schema itself.
- Under the dropdown it says whether the profile is **Unique** (only this Schema uses it) or **Shared** (and with which Schemas).
- **Make it unique to this Schema** shows when the profile is shared. It makes a copy of the profile just for this Schema, and the other Schemas keep the original.

## The Default Layout

The **Default Layout** is the profile's drawing: its vessels, IPs, pipes and hoses, and the tabs they sit on. Open it with **☰ Menu > Default Layout**.

A Schema either **follows** its profile's Default Layout or **keeps its own layout**:

- **Follows** (the usual): what you draw on the Schema's tabs is saved as the Default Layout. Every other Schema that follows the same profile shows the same equipment and pipes.
- **Keeps its own layout**: the Schema's tabs stay as they are. Changes to them stay in the Schema and don't change the profile.

The buttons on the Default Layout tab:

- **Edit it**: opens Edit layout on the tabs.
- **Use it on this Schema** (or **Load it on this Schema again**): puts the Default Layout on this Schema's tabs, and the Schema follows it from now on. A backup of the Schema is made first.
- **Save this Schema's layout as the Default Layout**: this Schema's equipment and pipes become the Default Layout. Other Schemas that follow the profile get them when they are loaded.
- **Keep this Schema's own layout**: stop following, and keep the tabs as they are.

## Lock the Equipment Profile

When the profile is right, lock it so nothing gets bumped on brew day.

- Switch on **🔒 Locked** next to the profile in the box at the top of the **Equipment Profile** tab. Operators and Admins can do this.
- Or put `lock_Equipment` in a Process (and `unlock_Equipment` to unlock). See [The Process language](22-process-language).

While it is locked:

- Its numbers and its equipment list can't be changed, and it can't be deleted.
- On the tabs, **Edit layout** can't move, add, change or delete equipment, IPs, pipes or hoses. **Save layout** says it is locked. Devices, pictures and text can still be changed.
- The Schema can't switch to another profile.

To unlock, switch **🔒 Locked** off (the panel asks first), or run `unlock_Equipment`. The Brew Day (coming soon) will lock the profile by itself when it starts.

## Build and bundle equipment

The **Vessels and equipment in this profile** list, under the numbers, shows the equipment the profile is built from.

1. Pick a kind (**Vessel**, **Plate chiller**, **Chilling coil**, **HERMS coil** or **Trub filter**), then press **Add**. It opens on the [Vessel tab](34-vessel-tab).
2. Set it up there and press **Save**.
3. To put it on the loaded Schema's **Equipment** tab, press **Put on Equipment tab** (in the list, or **Save and put on Equipment tab** on the Vessel tab). The panel draws the equipment with its ports as IPs and shows you the tab. If it is already drawn there, the button says **Update on tab**. It brings the drawing up to date and leaves it where it is. **Put all on Equipment tab** does the whole list at once.

Already drew your vessels on the Equipment tab? Press **Bring in ... from the tabs**. It copies them into the profile and keeps each one linked to its drawing.

To change a piece, press **Open in Vessel tab**. To take it out of the profile, open it there and press **Delete**. Its drawing stays on the tab.

## Coming next

Recipes (BeerSmith import, scaling, SRM and IBU), the Fermentation tab, the Brew Day Recipe and reports will be added to the **☰ Menu**.
