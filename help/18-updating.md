# Updating to a new version

**One zip does both:** a first install and every update. The zip has **no** `config`, `data`, `media` or `scripts` folders, so unzipping it over your panel can't replace yours. Their samples are in a folder called `defaults`, and the panel copies them in only on its very first start, into a folder you don't have yet.

| Folder | What is in it | On an update |
|---|---|---|
| `config` | Your tabs, elements, devices and settings (`brewery.json`) | **Kept.** Not in the zip. |
| `data` | Brew log, saved values, users, passwords, sign-ins, the recovery code | **Kept.** Not in the zip. |
| `media` | Your pictures and sounds | **Kept.** Not in the zip. |
| `scripts` | Your processes | **Kept.** Not in the zip. |
| `help` | This manual | Replaced by the new manual. The installers copy the old pages to `help/backups/before_update_<date>` first. |
| `defaults` | The sample layout, pictures, sounds and processes | Replaced. Only used for a folder you don't have. |
| Everything else (`lib`, `public`, `server.js`, `samples` …) | The program itself | Replaced. |

**Want the samples back in one folder?** Run the installer again and answer **No** to "Keep all of them as they are?". It then asks about each folder (config, media, scripts, data) and moves the ones you pick to `backups/<folder>_<date>`. Or do it yourself: stop the panel and rename the folder (for example `media` to `media_old`). The panel copies the samples into a fresh `media` the next time it starts.

> **Testing mode and sign-ins.** Your users and passwords stay on disk. But while **Settings > Testing mode** is on, a new version clears every sign-in when it starts, so you create the admin account again and get a new **recovery code**. That is on purpose while testing. Turn Testing mode off when you use the panel for real, and updates keep your logins too. See [Login, users and passwords](10-login).

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

It asks **Keep all of them as they are?** about your config, data, media and scripts folders. **Yes** (the normal answer) keeps them all. It also puts a copy of your layout in `config/backups/brewery_before_update_<date>.json`, just in case.

## Update by hand: unzip over the panel

1. Stop the panel (above).
2. For extra safety, copy your panel folder: right-click `C:\Brewing\BrewPanel`, **Copy**, then **Paste**.
3. Right-click `Skynet_BrewPanel_<date>.zip`, choose **Extract All…**, and extract into **`C:\Brewing`** (the folder *above* BrewPanel).
4. When Windows asks about files with the same name, choose **Replace the files in the destination**. That only replaces program files, help pages and the samples in `defaults`. Your `config`, `data`, `media` and `scripts` aren't in the zip.
5. Start the panel again with **Skynet Brewer** on the Desktop.

> **Zips from before October 5, 2026** still had `config`, `media` and `scripts` in them. If you unzip one of those over your panel, choose **Skip these files** (or rename your folders first), or it replaces yours.

On the Raspberry Pi by hand: `sudo systemctl stop skynet-brewer`, unzip over the panel folder (`unzip -o Skynet_BrewPanel_<date>.zip -d ~/Brewing`), then `sudo systemctl start skynet-brewer`.
