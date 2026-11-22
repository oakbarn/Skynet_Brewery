# The Skynet pictures and sounds

The Skynet pictures and sounds (pumps, valves, vessels, alarm sounds ...) come with the Skynet Setups. **There is nothing extra to download or run** (OakBarn Brewery: "No extra steps for a User").

- **New on this Windows computer:** the **Full Setup** (`Skynet_Brewer_Full_Setup_<date>.exe`) has every Skynet picture and sound, and every Sample Schema.
- **Each update:** the **Update Setup** (`Skynet_Brewer_Update_<date>.exe`) and the panel zip carry every Skynet picture and sound added since the last Update Setup. The Brain adds the ones it does not have yet on its next start.

Three sounds always come with the panel itself, so an Alarm or Audio Widget can always sound: the alarm beep, the "Alarm sound missing" voice clip and the "Find The File" song.

**It only ever adds.** A picture or sound you already have, by that name, is never changed. Your own pictures and sounds are never touched.

> The separate **Skynet Media Setup** .exe is gone: the Update and Full Setups do its job.

## Where to get it

On the same download page as the panel: **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| File | For |
|---|---|
| `Skynet_Brewer_Full_Setup_<date>.exe` | Windows, new computer: the panel **and** every picture, sound and Sample Schema in one file |
| `Skynet_Brewer_Update_<date>.exe` | Windows, updates: brings the new pictures, sounds and Sample Schemas |
| `Skynet_Media_<date>.zip` | Mac, Linux, Raspberry Pi, or by hand: every Skynet picture and sound |

The Media zip is only made new when Skynet adds pictures or sounds. Until then every new Release carries the same one, so the date in its name can be older than the panel's. That is normal.

## The Full Setup: everything in one file (Windows)

New on this computer? Download **`Skynet_Brewer_Full_Setup_<date>.exe`**. It is the same Skynet Brewer Setup with every Skynet picture, sound and Sample Schema inside.

- It is always a full install, and it **overwrites everything**: every Schema, setting, user, Process, the brew log, every picture and sound, and the Import folder. It then puts the Skynet pictures and sounds back by itself.
- If Skynet is already installed, it shows **one warning** that this is the Full install and will OVERWRITE everything. On that page:
  - **Get the Update Setup** opens the download page and closes the Full Setup. Use the Update Setup (`Skynet_Brewer_Update_<date>.exe`) when you only want an update: it keeps everything.
  - **Close and Do Not Install** closes it, and nothing is changed.
  - **1. Install with no backup** is already picked. It overwrites everything and your old folders are **deleted for good**. They cannot be brought back.
  - **2. Install and back up my old folders first**: before it overwrites, your old folders (config, data, processes, media, backups and the Import folder) are **moved, not deleted**, to `C:\Brewing\Skynet_Backups\Before_Full_Setup_<date>`.
  - Then click **Install**.
- It is bigger (about 12 MB instead of about 5 MB). For a quick update later, use the plain Skynet Brewer Setup: your pictures and sounds stay where they are.
- The Uninstall is the same one, whichever Setup you used.

## Mac, Linux, Raspberry Pi or by hand

- **With the installer:** put `Skynet_Media_<date>.zip` next to the installer before you run it. The installer adds the pictures and sounds you do not have yet.
- **By hand:** unzip `Skynet_Media_<date>.zip` into the folder that holds `BrewPanel` (use `unzip -n`, which never replaces a file). It adds `BrewPanel/defaults/media`. The next time the panel starts, it copies in only the pictures and sounds you do not have yet.

## Good to know

- When a Skynet drawing is redone, it comes as a **new picture with a new name**. The old one stays, so every Schema that uses it looks the same as before.
- A Brain on the internet can also get new pictures one at a time with **☰ Menu > Get Skynet pictures** (see [Get Skynet pictures](59-get-skynet-pictures)).
- Skynet only ships pictures and sounds it is free to share: its own (under the MIT License), ones in the public domain (CC0 included), or ones under the CC BY or CC BY-SA license, with their credit in the Media credits of the README. Nothing under a non-commercial (NC) or no-changes (ND) license.
