SKYNET BREWER - HOW TO INSTALL
==============================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

The Skynet Brew Panel runs on Windows, Mac, Linux or a Raspberry Pi.
You then use it from any browser: PC, Mac, tablet, Android phone or iPhone.

Every way below needs Node.js (free, from https://nodejs.org).
The installers get it for you, or tell you how.

The files in this release:

  Skynet_Brewer_Setup_<date>.exe    Windows installer (has the whole panel inside)
  Skynet_BrewPanel_Full_<date>.zip    The whole panel: first install by hand, or for Mac/Linux/Pi
  Skynet_BrewPanel_Update_<date>.zip  Update by hand (has no config, media or scripts)
  Install Skynet Brewer.command     Mac installer
  install-skynet-brewer.sh          Linux and Raspberry Pi installer
  Skynet_Brewer.bat                 Sample Windows start file (for a manual install)
  ReadMe.txt                        This file

The panel goes in C:\Brewing\BrewPanel on Windows, and in Brewing/BrewPanel in your
home folder on a Mac, Linux or a Pi.

FULL INSTALL OR UPDATE
A full install is the first time. An update is a newer version over a panel you use.
On an update these folders are NEVER overwritten:
  config    your layout, tabs, devices and settings
  data      brew log, saved values, users, passwords, sign-ins, recovery code
  media     your pictures and sounds
  scripts   your processes
The installers see an existing panel and update it by themselves (they only add new
sample files you don't have). Updating by hand? Use the Update zip, never the Full
zip. Stop the panel first either way. The Help pages are replaced by the new manual;
the old ones go to help\backups.
While Settings > Testing mode is on, a new version clears every sign-in, so you
create the admin account again. That is on purpose while testing. Turn it off when
you use the panel for real. In the panel, Help > "Updating to a new version" has
the details.


WINDOWS, THE EASY WAY (INSTALLER)
---------------------------------
1. Close the panel if it is running (Ctrl+C in its black window, then close it).
2. Double-click Skynet_Brewer_Setup_<date>.exe.
   Windows may say "Windows protected your PC". Click "More info", then "Run anyway".
   (The installer is not signed with a paid certificate, that is all.)
3. Keep the folder C:\Brewing\BrewPanel and click Install.
   If Node.js is missing it offers to install it (Windows asks for permission).
   If you had the panel straight in C:\Brewing before, it offers to copy your data across.
4. Start it with "Skynet Brewer" on the Desktop. Your browser opens the panel.

To remove it: Settings > Apps > Skynet Brewer > Uninstall. It asks before deleting
your brew data.


WINDOWS, BY HAND
----------------
1. Install Node.js (the LTS version) from https://nodejs.org
2. Make the folder C:\Brewing and copy Skynet_BrewPanel_Full_<date>.zip into it.
3. Right-click the zip, choose "Extract All...", and extract into C:\Brewing.
   It makes the sub folder C:\Brewing\BrewPanel by itself.
   (If Windows suggests C:\Brewing\Skynet_BrewPanel_Full_<date>, change it to C:\Brewing.)
4. Create a .bat file to start the panel. Use the sample Skynet_Brewer.bat that came
   with this ReadMe, or make your own:
     a. Open any simple text editor (Notepad, Notepad++). Word works only if you
        save as "Plain Text", so Notepad is easier.
     b. Paste these lines:

        :: MIT License Granted
        :: Copyright (c) OakBarn Brewery 2026
        @echo off
        title Skynet Brewery Panel
        cd /d C:\Brewing\BrewPanel
        start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"
        npm start
        pause

     c. Save it as C:\Brewing\Skynet_Brewer.bat
        In Notepad set "Save as type" to "All files", or it becomes Skynet_Brewer.bat.txt
5. Put it on the Desktop: right-click the .bat, "Show more options", "Send to",
   "Desktop (create shortcut)". Rename the shortcut to "Skynet Brewer".
6. Double-click it. The black window is the panel running; keep it open while you brew.
   The browser opens http://localhost:8080 after a few seconds.

The "start ... timeout" line opens the browser 4 seconds later, so the panel has
time to start. A plain  start "" http://localhost:8080  also works, but the browser
may show "can't reach this page" until you refresh.


MAC
---
1. Double-click Skynet_BrewPanel_Full_<date>.zip (Safari may already have unzipped it into
   a BrewPanel folder; that is fine).
2. Put "Install Skynet Brewer.command" in the same folder as the zip (or the BrewPanel
   folder), or open the one inside BrewPanel/install/mac.
3. Double-click "Install Skynet Brewer.command".
   If macOS says it cannot be opened, right-click it, choose Open, then Open again.
   If Node.js is missing, the Node.js page opens: install the "macOS Installer (.pkg)"
   for the LTS version, then run the installer again.
4. Start it with "Skynet Brewer" on the Desktop. A Terminal window is the panel
   running; your browser opens the panel.


LINUX
-----
1. Put install-skynet-brewer.sh and Skynet_BrewPanel_Full_<date>.zip in the same folder.
2. Open a terminal in that folder and run:
       bash install-skynet-brewer.sh
   Do not put sudo in front; it asks for your password when it needs it.
   On Debian, Ubuntu, Mint and similar it installs Node.js for you if needed.
3. Start it with "Skynet Brewer" on the Desktop or in the applications menu.
   It asks whether the panel should start by itself when the computer starts.


RASPBERRY PI (THE BRAIN)
------------------------
Raspberry Pi OS (64-bit recommended), Pi 4 or newer.
1. Copy install-skynet-brewer.sh and Skynet_BrewPanel_Full_<date>.zip to the Pi
   (a USB stick, or download them on the Pi).
2. Open a terminal in that folder and run:
       bash install-skynet-brewer.sh
   It installs Node.js, lets the panel use USB boards, and sets the panel to start by
   itself every time the Pi starts. Say Yes when it asks.
3. It prints the Pi's address, for example http://192.168.1.50:8080
   Open that on any phone or computer at home.
   "Skynet Brewer" on the Pi's desktop just opens the panel in the Pi's browser.

   Stop the panel:     sudo systemctl stop skynet-brewer
   Start it again:     sudo systemctl start skynet-brewer
   See its messages:   journalctl -u skynet-brewer -f


THE FIRST TIME
--------------
The panel asks you to create the admin account. Then it shows a recovery code: save it.
It is how you get back in if you forget the password.
To reach the panel away from home, use Tailscale (see Help > Installing Tailscale
on Windows). Never open a port on your router for it.
