# Schema.json (save a Schema as a .json file)

**Schema.json** on the Menu Bar (admins only; it was called **Config** before) opens the Schema.json page. On a Tab the Menu Bar may be hidden: open it with **☰ Menu > Show Menu Bar**.

The page does two things:

1. It shows the loaded Schema and the panel settings as text (`config/brewery.json`), so you can edit them. **Check**, **Save**, **Find**, **Reload** and **Backups** work as before (see *Process editor > The Schema.json editor*).
2. **Save as .json file** saves a Schema as one `.json` file on the computer you are using.
3. **Open a Schema file** adds a Schema from a `.json` file: one the BruControl Importer saved, or one saved with Save as .json file.

## Save as .json file

1. Click **Schema.json** on the Menu Bar.
2. Click **Save as .json file**.
3. Pick the Schema. The loaded one is first and is picked for you.
4. Press **Save**. The file goes to the Downloads folder of this computer (your browser may ask where to put it).

The file is named after the Schema version, for example `Main_Brewery_20261021T1405.json`. A Schema that has no version yet gets its name and the time now, in the same `Name_yyyymmddThhmm` form (ISO 8601). Spaces become `_`.

## Open a Schema file

1. Click **Schema.json** on the Menu Bar.
2. Click **Open a Schema file**.
3. Pick a file from the **Import folder** (`C:\Brewing\Import`, where the BruControl Importer saves its files, newest first),
   or **A .json file on this computer…** to pick one anywhere.
4. Leave **Load it now** on to switch to it straight away, or off to just add it to your Schemas.
5. Press **Save**.

The Schema is added under its own name. If a Schema with that name is already there, the new one gets `#2`, `#3` and so on:
an existing Schema is never written over. Processes in the file are added to the shared Processes; when one with the same
name but different text is already there, the old one is kept as a backup first. A short report shows what was added and the
import notes. A file marked **first draft** came from the Importer before its question steps were built: check it before you
brew with it.

## Sharing a Schema with another brewer

The Schema list has the same two things, so you don't need the Schema.json page to share:

- **Export to share ...** (Schema dropdown, or ☰ Menu > 🗂 Schema > **📤 Export to share**) saves a Schema as a `.json` file, the same as Save as .json file. Send that file to the other brewer.
- **Import a brewer's Schema ...** (Schema dropdown, or ☰ Menu > 🗂 Schema > **📥 Import a brewer's Schema**) adds a Schema file another brewer gave you, the same as Open a Schema file. **The place to put it is the Import folder** (`C:\Brewing\Import`), or pick it anywhere on your computer. It always comes in as a new Schema: none of yours is written over.

> **Skynet does not check what is in a Schema file, going out or coming in.** The pictures, sounds, names and anything else in it, and any copyright on them, are between the brewers.

Pictures and sounds are not inside the file, only their names. If the other brewer used pictures you don't have, those show as missing until you add them.

## What is in the file

- The Schema's Tabs, Devices, Widgets, pictures, text, pipes and hoses, probes and the Processes it starts by itself (autostart list).
- The equipment and piping from each Tab's Equipment Profile, so the file is complete on its own, and the name of each Tab's profile.
- The Schema name, its version and when the file was saved.

What is **not** in the file: logins and passwords, the API key, MQTT settings, media folders and other panel settings. So the file is safe to give to a friend. The Processes themselves (the `scripts` folder) are shared by every Schema and are not in it either.

Unsaved changes in the editor are not in the file. Press **Save** first if you want them in it.

Only admins see the button and can save a Schema this way.
