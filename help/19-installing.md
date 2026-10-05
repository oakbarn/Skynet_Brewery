# Installing the panel

The Skynet Brew Panel runs on **Windows, Mac, Linux or a Raspberry Pi**. Each release comes with a `ReadMe.txt` (outside the zip) that has these same steps, so you can follow them before the panel is running.

Every way needs **Node.js** (free, from <https://nodejs.org>). The installers get it for you, or tell you how.

| File in the release | What it is for |
|---|---|
| `Skynet_Brewer_Setup_<date>.exe` | Windows installer. The whole panel is inside it. |
| `Skynet_BrewPanel_<date>.zip` | The panel itself: for a manual install, and for Mac, Linux and the Pi |
| `Install Skynet Brewer.command` | Mac installer |
| `install-skynet-brewer.sh` | Linux and Raspberry Pi installer |
| `Skynet_Brewer.bat` | Sample Windows start file |
| `ReadMe.txt` | How to install |

The panel goes in **`C:\Brewing\BrewPanel`** on Windows, and in **`Brewing/BrewPanel`** in your home folder on a Mac, Linux or a Pi. Every installer puts a **Skynet Brewer** shortcut on the Desktop.

> **Updating?** Stop the panel first. The installers keep your brew data (the `data` folder) and your layout (`config/brewery.json`, with a copy in `config/backups`). See [Updating to a new version](18-updating).

## Windows: the installer

1. Close the panel if it is running (**Ctrl + C** in its black window, then close it).
2. Double-click `Skynet_Brewer_Setup_<date>.exe`. Windows may say **Windows protected your PC**: click **More info**, then **Run anyway**. The installer just isn't signed with a paid certificate.
3. Keep the folder `C:\Brewing\BrewPanel` and click **Install**.
   - If Node.js is missing, it offers to install it. Windows asks for permission.
   - If you had the panel straight in `C:\Brewing` before, it offers to copy your data, layout, processes and pictures across. The old folder isn't changed.
4. Start it with **Skynet Brewer** on the Desktop. The black window is the panel running; your browser opens the panel a few seconds later.

To remove it: **Settings > Apps > Skynet Brewer > Uninstall**. It asks before deleting your brew data.

## Windows: by hand, with a .bat file

1. Install Node.js (the **LTS** version) from <https://nodejs.org>.
2. Make the folder `C:\Brewing` and copy `Skynet_BrewPanel_<date>.zip` into it.
3. Right-click the zip, choose **Extract All…**, and extract into `C:\Brewing`. It makes the sub folder `C:\Brewing\BrewPanel` by itself. (If Windows suggests `C:\Brewing\Skynet_BrewPanel_<date>`, change it to `C:\Brewing`.)
4. Create a `.bat` file that starts the panel. Use the sample `Skynet_Brewer.bat` from the release, or make your own:
   1. Open a simple text editor such as **Notepad** or **Notepad++**. (Word works only if you save as Plain Text, so Notepad is easier.)
   2. Paste these lines:

```
:: MIT License Granted
:: Copyright (c) OakBarn Brewery 2026
@echo off
title Skynet Brewery Panel
cd /d C:\Brewing\BrewPanel
start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"
npm start
pause
```

   3. Save it as `C:\Brewing\Skynet_Brewer.bat`. In Notepad, set **Save as type** to **All files**, or you get `Skynet_Brewer.bat.txt`.
5. Right-click the `.bat`, choose **Show more options > Send to > Desktop (create shortcut)**, and rename the shortcut to **Skynet Brewer**.
6. Double-click it. Keep the black window open while you brew.

The `start … timeout` line opens the browser 4 seconds later, so the panel has time to start. A plain `start "" http://localhost:8080` works too, but the browser may say it can't reach the page until you refresh.

## Mac

1. Double-click `Skynet_BrewPanel_<date>.zip`. Safari may already have unzipped it into a **BrewPanel** folder; that's fine.
2. Put `Install Skynet Brewer.command` next to the zip (or the BrewPanel folder), or use the one inside `BrewPanel/install/mac`.
3. Double-click **Install Skynet Brewer.command**. If macOS says it can't be opened, right-click it, choose **Open**, then **Open** again.
   - If Node.js is missing, the Node.js page opens. Install the **macOS Installer (.pkg)** for the LTS version, then run the installer again.
4. Start it with **Skynet Brewer** on the Desktop. The Terminal window is the panel running.

## Linux

1. Put `install-skynet-brewer.sh` and the zip in the same folder.
2. Open a terminal there and run `bash install-skynet-brewer.sh`. Don't put `sudo` in front; it asks for your password when it needs it. On Debian, Ubuntu, Mint and similar it installs Node.js if needed.
3. It asks whether the panel should start by itself when the computer starts. Start it with **Skynet Brewer** on the Desktop or in the applications menu.

## Raspberry Pi (the brain)

Use Raspberry Pi OS (64-bit recommended) on a Pi 4 or newer.

1. Copy `install-skynet-brewer.sh` and the zip to the Pi (a USB stick, or download them on the Pi).
2. Open a terminal in that folder and run `bash install-skynet-brewer.sh`.
3. It installs Node.js, lets the panel use USB boards, and sets the panel to **start by itself every time the Pi starts**. Say **Yes** when it asks.
4. At the end it prints the Pi's address, for example `http://192.168.1.50:8080`. Open that on any phone or computer at home. **Skynet Brewer** on the Pi's own desktop just opens the panel in the Pi's browser.

| To | Type in a terminal on the Pi |
|---|---|
| Stop the panel | `sudo systemctl stop skynet-brewer` |
| Start it again | `sudo systemctl start skynet-brewer` |
| See its messages | `journalctl -u skynet-brewer -f` |

## The first time

The panel asks you to create the **admin account**, then shows a **recovery code**. Save it: it's how you get back in if you forget the password. See [Login, users and passwords](10-login). To reach the panel away from home, use Tailscale: see [Installing Tailscale on Windows](00-tailscale-windows). Never open a port on your router for it.

## Making a release (for whoever builds the panel)

On a Linux computer with NSIS (`sudo apt install nsis`) and zip, run `bash tools/build-release.sh` in the panel folder. It writes every file in the table above to `release/`.
