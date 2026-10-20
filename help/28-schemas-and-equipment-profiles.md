# Schemas and Equipment Profiles

A **Schema** is one whole brewery setup: its tabs, devices, elements, pipes and the **Equipment Profile** it uses. You can keep as many Schemas as you like, for example one for the 10 gallon system and one for the BrewZilla. Each Schema is kept in its own file on the Brain, in `config/schemas`.

An **Equipment Profile** describes your brewing equipment: the batch size, the boil off, the losses, the vessel sizes, the efficiency, and the equipment itself. Profiles live on their own, so **any Schema can use any profile**. A profile used by one Schema is **unique**. A profile used by several Schemas is **shared**, and a change to it changes all of them.

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

1. Open the **Brewing** page.
2. In the **Menu** dropdown, pick **➕ New Equipment Profile ...**.
3. Give it a name, and pick what it starts from: the usual numbers, or a copy of another profile.
4. Pick the **Units**: US (gallons, pounds) or Metric (liters, kilograms).
5. Leave **Use it for the Schema** switched on to give it to the loaded Schema.
6. Press **Save**. The profile opens.

## Edit or delete an Equipment Profile

- **Edit:** in the **Menu** dropdown pick **✎ Edit:** and the profile's name. Change the numbers, then press **Save** (at the top or the bottom). **Cancel** closes it without saving.
- **Delete:** in the **Menu** dropdown pick **🗑 Delete:** and the profile's name, or press **Delete** in the open profile. Schemas that used it are left with no profile. Their tabs and drawings stay as they are.

The **Worked out from these numbers** box updates while you type. It shows the pre-boil volume, how much boils off, the post-boil volume, what goes into the fermenter and what is left to bottle or keg. A ⚠ line warns you when the pre-boil volume is more than the kettle holds, or the batch is more than the fermenter holds.

## Give a Schema its Equipment Profile

The box at the top of the **Brewing** page shows the loaded Schema and its Equipment Profile.

- Pick a profile in the dropdown to use it. Pick **Add new ...** to make a new one.
- Under the dropdown it says whether the profile is **Unique** (only this Schema uses it) or **Shared** (and with which Schemas).
- **Make it unique to this Schema** shows when the profile is shared. It makes a copy of the profile just for this Schema, and the other Schemas keep the original.

## Build and bundle equipment

The **Equipment in this profile** pane, under the numbers, lists the equipment the profile is built from.

1. Pick a kind (**Vessel**, **Plate chiller**, **Chilling coil**, **HERMS coil** or **Trub filter**), then press **Build new equipment**.
2. Set its **Name** and **Type**, and switch on each port it has, with its **Position** and **Standard**. These are the same as on the Equipment tab (see [Equipment](14-equipment)).
3. Under **Brewing**, set its **Size**, **Dead space** and **Heat** (each list has **Add new ...**).
4. Leave **Bundled** on to put it on the tab as one unit with its IPs.
5. Press **Save** in the box, then **Save** for the profile.

To put it on the loaded Schema's **Equipment** tab, press **Put on Equipment tab**. The profile is saved, and the panel draws the equipment with its ports as IPs and shows you the tab. If it is already drawn there, the button says **Update on tab**. It brings the drawing up to date with the profile and leaves it where it is. **Put all on Equipment tab** does the whole list at once.

Already drew your vessels on the Equipment tab? Press **Bring in ... from the tabs**. It copies them into the profile and keeps each one linked to its drawing.

To change a piece, press **Build / edit**. To take it out of the profile, open it and press **Delete**. Its drawing stays on the tab.

## Coming next

Recipe Profiles (BeerSmith import, scaling, SRM and IBU), the Brew Day Recipe and reports will be added to the **Menu** on the Brewing page.
