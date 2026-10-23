# About and Schema versions

## The About Menu tab

**☰ Menu > About** shows:

- **Signed in as**: your user name and whether you are a Viewer, Operator or Admin.
- **Schema**: the Schema that is loaded now, as a dropdown. Pick another Schema there to load it, right from the About tab (Admins). It is the same list as on the Menu Bar and the **☰ Menu > Schema** tab, with the same choices (Add new, Clone, Rename, versions, backups, Delete). If any Process is running you are warned first, and every output is switched off before the other Schema loads. See [Switching and cloning Schemas](48-schema-switching-and-cloning).
- **Schema version**: its version, or "No version yet".
- **Last saved**: when the Schema was last saved.

The **Sign out** button is here too. Your user name and Sign out are no longer on the Menu Bar.

## Schema versions

A version is the Schema's name with the date and time it was saved, on the Brain's clock:

`<Schema name>_yyyymmddThhmm` (ISO 8601: year, month, day, T, hour, minute), for example `Oak Barn_20261021T0940`. Versions saved before 23 October 2026 keep their older names, for example `Oak Barn_20261021_09_40`, and can still be restored.

### Making a version

- In **Edit layout**, switch on **Update Version** next to **Save layout**, then save. The same switch is in the "Leave Edit layout?" box. The switch stays the way you left it on this browser.
- Or pick **Save a new version now** in the **Schema** list on the Menu Bar (Admins).

Each version is kept as its own file, named after the version, in `config/schemas/versions/<Schema>/` on the Brain (spaces in the name become `_`). Old versions are never removed.

The Schema itself is still saved in `config/schemas/<Schema>.json`, as before, so loading Schemas, the daily backups and restoring keep working the same way.

### Going back to a version

Pick **Restore a backup or version ...** in the **Schema** list. Versions show as **Version <name>** next to the backups. The Schema as it is now is backed up first, so a restore can be undone.
