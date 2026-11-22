# The Skynet Sample Schemas

The panel comes with the **3 Vessel 1 Pump** brewery (HLT, mash tun, boil kettle and one pump). It is kept up to every new Skynet Rule, and it is the Schema a new panel starts with. It **always stays in the panel**.

Every **other** Sample Schema (a ready-made brewery) is added **one at a time**, and comes with the Skynet Setups. **There is nothing extra to download or run** (OakBarn Brewery: "No extra steps for a User"):

- **New on this Windows computer:** the **Full Setup** (`Skynet_Brewer_Full_Setup_<date>.exe`) has every Sample Schema.
- **Each update:** the **Update Setup** (`Skynet_Brewer_Update_<date>.exe`) brings the Sample Schemas added or changed since the last Update Setup.
- **Mac, Linux, Raspberry Pi or by hand:** unzip `Skynet_Sample_Schemas_<date>.zip` into the folder that holds `BrewPanel` (use `unzip -n`, which never replaces a file), or put it next to the installer before you run it. It adds `BrewPanel/sample_schemas`.

> **There are none yet.** The older samples (Two vessels, one pump, and the BrewZilla brew day) are set aside while each one is brought up to the current Skynet Rules. The separate **Skynet Sample Schemas Setup** .exe is gone: the Update and Full Setups do its job.

**Your own Schemas are never touched.** A Sample Schema is only used to make a new Schema: picking it adds a copy that is yours. So when Skynet fixes a sample, the update replaces the older copy of that sample, and a Schema you already made from it stays exactly as it is. The same goes for the Skynet Templates: each update brings the newest ones, and your own Templates are never touched.

Then press **F5** in the panel. The new samples are in the Schema dropdown under **Add a Sample Schema**, after the 3 Vessel sample (see [Add a Sample Schema](83-sample-schemas)). Picking one adds a **copy** as a new Schema of your own, on the simulator, so nothing real is switched.

## A Schema from another brewer

The same folder, `BrewPanel/sample_schemas`, is where a brewery another brewer shares goes. Each sample is a folder with three parts:

| Part | What it is |
|---|---|
| `sample.json` | Its name, title, a short description, and what it needs |
| `config.json` | Its Tabs, Devices, Widgets, pipes and Interfaces |
| `processes/` | Its Processes (`.txt` files) |

Put the folder in `sample_schemas` and press **F5**. It comes in exactly like a Skynet sample: as a new Schema, on the simulator. The `ReadMe.txt` in that folder says the same.

Most of the time another brewer will send you a single `.json` file instead (made with **Export to share ...**). Put it in the Import folder and use **Import a brewer's Schema ...** in the Schema list (see [Schema.json](44-schema-json)).

> **Skynet does not check what is in a shared Schema.** The pictures, sounds, names and anything else in it, and any copyright on them, are between the brewers.

## Good to know

- Updating the panel adds new Skynet samples to `sample_schemas` and replaces a Skynet sample that was fixed. Your own Schemas are never touched.
- The samples older versions of the panel had (Two vessels, one pump; BrewZilla brew day; OakBarn Brewery) are moved, not deleted, to `backups/old_samples_<date>` the first time you update, so only the 3 Vessel sample is listed. A Schema you already made from one of them is yours and stays.
- Uninstalling the panel deletes `sample_schemas` with everything else (Rule 9.19). The Full Setup puts every Skynet sample back on a new install.
