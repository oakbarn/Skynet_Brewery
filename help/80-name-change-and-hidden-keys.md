# Name Change and hidden keys

Every item that has a name gets a **hidden key** the moment it is first saved: Devices, Widgets, variables, Texts, IPs, pipes, vessels, fittings, Tabs, Interfaces, Processes, Templates and Profiles. You never see the key and you never type it. It is how the panel knows "this is the same item" after you give it a new name.

Because of the key, you can rename anything at any time, and every Process that uses the old name is changed to the new name for you.

## The Name is locked

Once an item has been saved, its **Name** in Properties is locked (🔒). Beside it is the **✏ Change name** button.

1. Double-click the item to open its Properties (in Edit layout for things on a Tab).
2. Press **✏ Change name**. The **Name Change** pop-up opens.
3. **Name now** shows the name it has (you can't change that box).
4. Type the new name in **New name**.
5. Press **💾 Save** to keep it, or **✖ Cancel** to leave the name as it was.
6. Press **💾 Save** in the Properties, then **Save layout**.

A new item that has not been saved yet has an open Name box, so you can type its first name straight in.

The same pop-up is used to rename a **Process** (Processes page > **Rename**) and a **Schema** (Schema list > **Rename this Schema ...**).

## What follows the new name

- **Every Process.** `Pump_A = on` becomes `Pump_Main = on`, and `Pump_A.visible` becomes `Pump_Main.visible`. Only the whole name is changed, upper and lower case included (see [Renaming Devices and Widgets](53-renaming) for the details).
- **A Process that is running right now keeps working.** It still finds the item through its hidden key. The next time it starts it uses the new name.
- **Processes that start other Processes.** Rename a Process and the lines that start or stop it follow, and so does the Autostart list.
- **Clones.** A clone remembers the item it was cloned from. Rename the first item and the old name inside each clone's name changes too: rename `HLT` to `Hot_Liquor_Tank` and `HLT copy` becomes `Hot_Liquor_Tank copy`. A clone you renamed yourself, or one whose new name is already taken, is left as it is.
- **Pipes, heaters and other settings** that point at the item follow it, and its current value stays with it.

## What you can't do with the key

- You can't see it on any screen, in the Config Editor or in a saved Schema file.
- You can't use it in a Process. Processes always use names.
- Picture and sound **paths** are not names and have no key. They work as before.

## Buttons on every pop-up

Every pop-up uses the same buttons, each with an icon and its word:

| Button | What it does |
|---|---|
| ✖ Cancel | Closes and saves nothing |
| 💾 Save | Saves and closes |
| ✖ Close | Closes a pop-up that has nothing to save |
| 🗑 Delete | Deletes (it asks first) |
| ✔ OK | Closes a message after you have read it |

See also [Renaming Devices and Widgets](53-renaming), [Allowed names](63-allowed-names) and [Interface, Tab and Device names](46-interface-tab-device-names).
