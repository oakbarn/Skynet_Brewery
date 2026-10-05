# Updating to a new version

There are two kinds of install:

- **Full install**: the first time, on a computer or Pi that has no panel yet. You get everything, including the sample layout, pictures and processes.
- **Update**: a newer version over a panel you already use. **Your own things are never overwritten.**

| Folder | What is in it | On an update |
|---|---|---|
| `config` | Your tabs, elements, devices and settings (`brewery.json`) | **Kept.** Never replaced. |
| `data` | Brew log, saved values, users, passwords, sign-ins, the recovery code | **Kept.** Never replaced. |
| `media` | Your pictures and sounds | **Kept.** Never replaced. |
| `scripts` | Your processes | **Kept.** Never replaced. |
| `help` | This manual | Replaced by the new manual. The old pages are copied to `help/backups/before_update_<date>` first. |
| Everything else (`lib`, `public`, `server.js`, `samples` …) | The program itself | Replaced. |

The installers add a new sample picture or process to `media` or `scripts` only if you don't have a file with that name. They never change or delete one of yours. If you deleted a sample process, the installer brings it back. The update-only zip never does.

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

It also puts a copy of your layout in `config/backups/brewery_before_update_<date>.json`, just in case.

## Update by hand: use the Update zip

Each release has two zips:

| Zip | Use it for |
|---|---|
| `Skynet_BrewPanel_Full_<date>.zip` | A first install only |
| `Skynet_BrewPanel_Update_<date>.zip` | Updating. It has **no** `config`, `data`, `media` or `scripts` folders, so unzipping it can't overwrite yours. |

1. Stop the panel (above).
2. For extra safety, copy your panel folder: right-click `C:\Brewing\BrewPanel`, **Copy**, then **Paste**.
3. Right-click `Skynet_BrewPanel_Update_<date>.zip`, choose **Extract All…**, and extract into **`C:\Brewing`** (the folder *above* BrewPanel).
4. When Windows asks about files with the same name, choose **Replace the files in the destination**. That only replaces program files and help pages.
5. Start the panel again with **Skynet Brewer** on the Desktop.

> **Never unzip the Full zip over a panel you use.** It has a sample `config`, `media` and `scripts`, and Windows would replace yours if you choose Replace.

On the Raspberry Pi by hand: `sudo systemctl stop skynet-brewer`, unzip the Update zip over the panel folder (`unzip -o Skynet_BrewPanel_Update_<date>.zip -d ~/Brewing`), then `sudo systemctl start skynet-brewer`.
