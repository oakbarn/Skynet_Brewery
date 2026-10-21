# Schema.json (save a Schema as a .json file)

**Schema.json** on the Menu Bar (admins only; it was called **Config** before) opens the Schema.json page. On a Tab the Menu Bar may be hidden: open it with **☰ Menu > Show Menu Bar**.

The page does two things:

1. It shows the loaded Schema and the panel settings as text (`config/brewery.json`), so you can edit them. **Check**, **Save**, **Find**, **Reload** and **Backups** work as before (see *Process editor > The Schema.json editor*).
2. **Save as .json file** saves a Schema as one `.json` file on the computer you are using.

## Save as .json file

1. Click **Schema.json** on the Menu Bar.
2. Click **Save as .json file**.
3. Pick the Schema. The loaded one is first and is picked for you.
4. Press **Save**. The file goes to the Downloads folder of this computer (your browser may ask where to put it).

The file is named after the Schema version, for example `Main_Brewery_20261021_14_05.json`. A Schema that has no version yet gets its name and the time now, in the same `Name_yyyymmdd_hh_mm` form. Spaces become `_`.

## What is in the file

- The Schema's Tabs, Devices, Widgets, pictures, text, pipes and hoses, probes and the Processes it starts by itself (autostart list).
- The equipment and piping from its Equipment Profile, so the file is complete on its own, and the name of that profile.
- The Schema name, its version and when the file was saved.

What is **not** in the file: logins and passwords, the API key, MQTT settings, media folders and other panel settings. So the file is safe to give to a friend. The Processes themselves (the `scripts` folder) are shared by every Schema and are not in it either.

Unsaved changes in the editor are not in the file. Press **Save** first if you want them in it.

Only admins see the button and can save a Schema this way.
