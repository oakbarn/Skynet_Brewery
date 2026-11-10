# The Skynet Sample Schemas Setup

The panel comes with **one** Sample Schema: the **3 Vessel 1 Pump** brewery (HLT, mash tun, boil kettle and one pump). It is kept up to every new Skynet Rule, and it is the Schema a new panel starts with.

Every **other** Sample Schema (a ready-made brewery) comes as its own download, the **Skynet Sample Schemas Setup**, and they are added to it **one at a time**.

> **There are none in it yet.** The older samples (Two vessels, one pump, and the BrewZilla brew day) are set aside while each one is brought up to the current Skynet Rules. When one is ready, it is added to the Sample Schemas Setup.

**It only ever adds.** A sample you already have, by that name, is never changed. Nothing is ever deleted. Your own Schemas are never touched. When a sample is redone, it comes with a new name, so the old one stays as it was.

## Where to get it

On the same download page as the panel: **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| File | For |
|---|---|
| `Skynet_Sample_Schemas_Setup_<date>.exe` | Windows |
| `Skynet_Sample_Schemas_<date>.zip` | Mac, Linux, Raspberry Pi, or Windows by hand |

## How to use it

- **Windows:** install the panel first (Skynet Brewer Setup), then double-click `Skynet_Sample_Schemas_Setup_<date>.exe`. Keep the folder it shows (`C:\Brewing\BrewPanel`, where the panel is) and click Install.
- **Mac, Linux, Raspberry Pi with the installer:** put `Skynet_Sample_Schemas_<date>.zip` next to the installer before you run it.
- **By hand:** unzip `Skynet_Sample_Schemas_<date>.zip` into the folder that holds `BrewPanel` (on Mac, Linux and Pi use `unzip -n`, which never replaces a file). It adds `BrewPanel/sample_schemas`.

Then press **F5** in the panel. The new samples are in the Schema dropdown under **Add a Sample Schema**, after the 3 Vessel sample (see [Add a Sample Schema](83-sample-schemas)). Picking one adds a **copy** as a new Schema of your own, on the simulator, so nothing real is switched.

## A Schema from another brewer

The same folder, `BrewPanel/sample_schemas`, is where a brewery another brewer shares goes. Each sample is a folder with three parts:

| Part | What it is |
|---|---|
| `sample.json` | Its name, title, a short description, and what it needs |
| `config.json` | Its Tabs, Devices, Widgets, pipes and Interfaces |
| `scripts/` | Its Processes (`.txt` files) |

Put the folder in `sample_schemas` and press **F5**. It comes in exactly like a Skynet sample: as a new Schema, on the simulator. The `ReadMe.txt` in that folder says the same.

## Good to know

- Updating the panel never touches `sample_schemas`. (The panel's own `samples` folder is program files: an update replaces it, so a sample an older version had does not stay behind.)
- Uninstalling the panel and keeping your data (the recommended No) keeps `sample_schemas` too.
