# Updating to a new version

**One zip does both:** a first install and every update. The zip has **no** `config`, `data`, `media` or `scripts` folders, so unzipping it over your panel can't replace yours. Their samples are in a folder called `defaults`, and the panel copies them in only on its very first start, into a folder you don't have yet.

**The Skynet pictures and sounds are a separate download**, the Skynet Media Setup (Windows) or Skynet Media zip. It only adds the ones you don't have yet and never changes or deletes any. See [The Skynet Media Setup](183-skynet-media-setup).

**More Sample Schemas are a separate download too**, the Skynet Sample Schemas Setup (Windows) or zip. The panel comes with only the 3 Vessel sample. See [The Skynet Sample Schemas Setup](184-skynet-sample-schemas-setup).

| Folder | What is in it | On an update |
|---|---|---|
| `config` | Your tabs, Devices, Widgets and settings (`brewery.json`) | **Kept.** Not in the zip. |
| `data` | Brew log, saved values, users, passwords, sign-ins, the recovery code | **Kept.** Not in the zip. |
| `media` | Your pictures and sounds | **Kept.** Not in the zip. |
| `scripts` | Your processes | **Kept.** Not in the zip. |
| `help` | This manual | Replaced by the new manual. The installers copy the old pages to `help/backups/before_update_<date>` first. |
| `defaults` | The sample layout and processes | Replaced. Only used for a folder you don't have. |
| `sample_schemas` | The extra Sample Schemas from the Sample Schemas Setup, and any Schema from another brewer | **Kept.** Not in the zip. |
| Everything else (`lib`, `public`, `server.js`, `samples` …) | The program itself | Replaced. |

**Want the samples back in one folder?** Run the installer again and answer **No** to "Keep all of them as they are?". It then asks about each folder (config, scripts, data) and moves the ones you pick to `backups/<folder>_<date>`. Or do it yourself: stop the panel and rename the folder (for example `scripts` to `scripts_old`). The panel copies the samples into a fresh `scripts` the next time it starts. (Pictures and sounds are never replaced: rename `media` only if you want to start it over, then run the Skynet Media Setup again.)

> **Sign-ins are kept.** A new version keeps every user, password and the **recovery code**. The only time an update removes them is when you pick **Update the program and reset all users** or **Start Fresh** in the installer and confirm the warning. See [Login, users and passwords](10-login).

## Every update: stop the panel first

While the panel runs, its files are open (the brew log database, users and saved values). Copying over open files fails with errors like "The action can't be completed because the file is open in Node.js" or "Access denied".

- **Windows:** click the panel's black command window, press **Ctrl + C** (type **Y** if it asks `Terminate batch job (Y/N)?`), then close the window.
- **Mac / Linux:** press **Ctrl + C** in the panel's Terminal window.
- **Raspberry Pi:** the installer stops and restarts the panel service by itself.

### Windows: if files are still locked

Sometimes Node.js keeps running in the background after the window is gone. To end it:

1. Press **Ctrl + Shift + Esc** to open **Task Manager**. If it looks small, click **More details**.
2. On the **Processes** tab (Windows 11: the first icon on the left), find **Node.js JavaScript Runtime** (or `node.exe`).
3. Click it, then click **End task**. Do this for each Node.js line.

Still locked? Restart the computer, and don't start the panel until the update is done.

## Update with the installer (easiest)

Run the same installer you used the first time, from the new release. It sees the panel is already there and **updates** it:

- **Windows:** `Skynet_Brewer_Setup_<date>.exe`. Keep the same folder (`C:\Brewing\BrewPanel`).
- **Mac:** `Install Skynet Brewer.command` next to the new zip.
- **Linux / Pi:** `bash install-skynet-brewer.sh` next to the new zip.

It first asks what this update does (see [The three update choices](#the-three-update-choices) below; the third one, already picked, keeps everything). Then it asks **Keep all of them as they are?** about your config, data, media and scripts folders. **Yes** (the normal answer) keeps them all. It also puts a copy of your layout in `config/backups/brewery_before_update_<date>.json`, just in case. Dates in file and folder names are ISO 8601, for example `20261023T113005` (year, month, day, T, hour, minute, second).

## The three update choices

When the installer finds the panel already there, it asks what this update does. The program files are always updated. On Windows it is a page with three round buttons; on a Mac, Linux or Pi you type **1**, **2** or **3**.

1. **Start Fresh: delete everything.** The panel as if it had never been installed. A second, red warning comes first: **ALL EXISTING DATA WILL BE DELETED**. It lists what goes, for good and with no backup:
   - every Schema, Tab, Device, Widget and setting (`config`)
   - every user, password, sign-in and the recovery code, the brew log and saved values (`data`)
   - every Process (`scripts`)

   Your pictures and sounds (`media`) and the `backups` folder are **kept**.
   - **No** on the warning goes back. Nothing is deleted.
   - **Yes** deletes them. The panel then starts like a new install from the samples, and you make the admin account again (write down the new **recovery code**).
   - On Windows it also deletes the user name and password that Skynet's own window remembered, so nothing old is filled in. Skynet's window never syncs with your Microsoft account, so a synced login can't come back either. You can still save your password in Skynet's window, and it fills in on Sign in as usual. The admin setup boxes stay empty until you click or type in them, even if your browser saved a password for the panel.

2. **Update the program and reset all users.** A warning comes first; **No** goes back and nothing is deleted. **Yes** deletes, for good:
   - every user and password
   - every sign-in, on every computer and phone
   - the recovery code
   - on Windows, the user name and password Skynet's own window remembered

   Your Schemas and settings (`config`), brew log and saved values (`data`), Processes (`scripts`), pictures and sounds (`media`) are **kept**. The panel opens at admin setup: make the admin account again and write down the new **recovery code**.
3. **Update the program and keep everything** (recommended, and already picked for you). Your Schemas, settings, users and passwords, brew log, Processes, pictures and sounds stay as they are.

The Windows installer (`Skynet_Brewer_Setup_<date>.exe`), the Mac installer and the Linux / Pi installer all ask it. If Windows can't delete a file because a program still has it open, the installer says so: restart the computer and run it again.

> Only want one folder back to the samples? Pick **3** (or **2**), then answer **No** to "Keep all of them as they are?" (above). That moves a folder to `backups` instead of deleting it.

## Update by hand: unzip over the panel

1. Stop the panel (above).
2. For extra safety, copy your panel folder: right-click `C:\Brewing\BrewPanel`, **Copy**, then **Paste**.
3. Right-click `Skynet_BrewPanel_<date>.zip`, choose **Extract All…**, and extract into **`C:\Brewing`** (the folder *above* BrewPanel).
4. When Windows asks about files with the same name, choose **Replace the files in the destination**. That only replaces program files, help pages and the samples in `defaults`. Your `config`, `data`, `media` and `scripts` aren't in the zip.
5. Start the panel again with **Skynet Brewer** on the Desktop.

> **Zips from before October 5, 2026** still had `config`, `media` and `scripts` in them. If you unzip one of those over your panel, choose **Skip these files** (or rename your folders first), or it replaces yours.

On the Raspberry Pi by hand: `sudo systemctl stop skynet-brewer`, unzip over the panel folder (`unzip -o Skynet_BrewPanel_<date>.zip -d ~/Brewing`), then `sudo systemctl start skynet-brewer`.
