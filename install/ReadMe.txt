SKYNET BREWER - HOW TO INSTALL
==============================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

The Skynet Brew Panel runs on Windows, Mac, Linux or a Raspberry Pi.
You then use it from any browser: PC, Mac, tablet, Android phone or iPhone.

Every way below needs Node.js (free, from https://nodejs.org). On Windows the
installer and Skynet_Brewer.bat install it for you when it is missing.
The installers get it for you, or tell you how.

The files in this release:

  Skynet_Brewer_Setup_<date>.exe    Windows installer (has the whole panel inside)
  Skynet_Brewer_Full_Setup_<date>.exe  The same Windows installer WITH the Skynet pictures and sounds
                                    inside: the easy way on a new computer (no Media Setup needed)
  Skynet_BrewPanel_<date>.zip       The panel itself: install or update by hand, or for Mac/Linux/Pi
  Skynet_Media_Setup_<date>.exe     The Skynet pictures and sounds, for Windows (run it after the installer)
  Skynet_Media_<date>.zip           The Skynet pictures and sounds, for Mac/Linux/Pi or by hand
  Skynet_Sample_Schemas_Setup_<date>.exe  More Sample Schemas, for Windows (none in it yet)
  Skynet_Sample_Schemas_<date>.zip  More Sample Schemas, for Mac/Linux/Pi or by hand
  Install Skynet Brewer.command     Mac installer
  install-skynet-brewer.sh          Linux and Raspberry Pi installer
  Skynet_Brewer.bat                 Sample Windows start file (for a manual install)
  ReadMe.txt                        This file

NEW TO THIS? Each platform also has its own step-by-step ReadMe for a first install by
hand, written for beginners, with every download and click spelled out:
  First_Install_windows/ReadMe_Windows.txt       with Skynet_First_Install.bat
  First_Install_mac/ReadMe_Mac.txt               with Skynet First Install.command
  First_Install_linux/ReadMe_Linux.txt           with skynet-first-install.sh
  First_Install_pi/ReadMe_Raspberry_Pi.txt       with skynet-first-install-pi.sh
(They are also inside the zip, in BrewPanel/install/<platform>.)
Minimum_Equipment_and_Limitations.txt lists what to buy for 1 Pi + 1 Mega up to
3 Megas and 2 ESP32s, the ports on each board, and what the panel cannot do yet.

The panel goes in C:\Brewing\BrewPanel on Windows, and in Brewing/BrewPanel in your
home folder on a Mac, Linux or a Pi.

INSTALL OR UPDATE: YOUR FOLDERS ARE SAFE
The zip has NO config, data, media or processes folders, so unzipping it over your
panel (or running an installer again) never replaces these:
  config    your layout, tabs, devices and settings
  data      brew log, saved values, users, passwords, sign-ins, recovery code
  media     your pictures and sounds
  processes   your processes
Their samples are in a "defaults" folder. The panel copies them in only on its first
start, into a folder you don't have yet. On an update the installers ask "Keep all of
them as they are?". Yes keeps them; No asks about each one and moves any you replace
to the "backups" folder. Stop the panel before you update. The Help pages are
replaced by the new manual; the old ones go to help\backups.
UPDATE CHOICES: before that, the installers ask what the update does:
  1. Start Fresh: delete everything, nothing saved. A warning says ALL EXISTING DATA
     WILL BE DELETED (config, data, processes, backups, every picture and sound, and
     the Import folder, with no backup). Run the Media Setup after it.
  2. Modified Fresh Start: deletes Schemas, Processes, users and the brew log after a
     warning. Kept: Default settings, your own Profiles, Equipment Profiles, Recipes,
     pictures and sounds, the backups and the Import folder.
  3. Update the program and reset all users: deletes every user, password, sign-in
     and the recovery code after a warning. Schemas, brew log, Processes, pictures
     and sounds are kept. You make the admin account again.
  4. Update the program and keep everything (the default, already picked).
  No on any warning backs out with nothing deleted.
Zips from before October 5, 2026 still had those folders inside. If you unzip one
of those over your panel, choose "Skip these files".
An update keeps every user, password and sign-in. Only choice 1, 2 or 3 (then
confirm the warning) removes them. In the panel, Help > "Updating to a new version" has
the details.


THE SKYNET PICTURES AND SOUNDS (SEPARATE DOWNLOAD)
--------------------------------------------------
The pictures and sounds are not inside the panel zip or the installer. They are their
own download, on the same page: https://github.com/oakbarn/Skynet_Brewery/releases/latest
  Windows:   run Skynet_Media_Setup_<date>.exe after Skynet_Brewer_Setup_<date>.exe,
             OR use Skynet_Brewer_Full_Setup_<date>.exe, which has them inside (one file, same order).
  Mac/Linux/Pi: put Skynet_Media_<date>.zip next to the installer before you run it,
             or unzip it into the folder that holds BrewPanel (it adds BrewPanel\defaults\media)
             and start the panel: it copies in the pictures and sounds you do not have yet.
ORDER, on a First Install and after a Start Fresh or Modified Fresh Start: the panel
  installer FIRST, then the Media Setup (it needs the panel folder, and a Fresh Start
  clears folders before anything goes in), then the Sample Schemas Setup if you want it.
  The Media Setup only adds what is missing, so running it again is always safe.
They ONLY ADD: a picture or sound you already have, by that name, is never changed, and
nothing is ever deleted. Your own pictures and sounds are never touched. Run them again
whenever new pictures come out.


MORE SAMPLE SCHEMAS (SEPARATE DOWNLOAD)
--------------------------------------
The panel comes with one Sample Schema, the 3 Vessel 1 Pump brewery. Every other sample
comes in the Skynet Sample Schemas Setup (Windows) or zip, on the same download page,
added one at a time. There are none in it yet: each older sample is brought up to the
current Skynet Rules first. It installs into BrewPanel\sample_schemas, which is also
where a Schema from another brewer goes (see the ReadMe.txt in that folder).
  Windows:   run Skynet_Sample_Schemas_Setup_<date>.exe after Skynet_Brewer_Setup_<date>.exe.
  Mac/Linux/Pi: put Skynet_Sample_Schemas_<date>.zip next to the installer before you
             run it, or unzip it (unzip -n) into the folder that holds BrewPanel.
It ONLY ADDS: a sample you already have is never changed, and nothing is deleted.

VIDEOS (COMING SOON)
  How to use the 3 Vessel sample, step by step
  How to add another Pump and edit the manifold in the 3 Vessel sample
  The links will be in the panel's Help > Add a Sample Schema.


WINDOWS, THE EASY WAY (INSTALLER)
---------------------------------
1. Close the panel if it is running (Ctrl+C in its black window, then close it).
2. Double-click Skynet_Brewer_Setup_<date>.exe.
   Windows may say "Windows protected your PC". Click "More info", then "Run anyway".
   (A brand-new or unsigned installer does this for a while, that is all.)
3. Keep the folder C:\Brewing\BrewPanel and click Install.
   If Node.js is missing it offers to install it (Windows asks for permission).
   If you had the panel straight in C:\Brewing before, it offers to copy your data across.
4. Start it with "Skynet Brewer" on the Desktop. Your browser opens the panel.
5. Then run Skynet_Media_Setup_<date>.exe for the Skynet pictures and sounds.
   (Used Skynet_Brewer_Full_Setup_<date>.exe in step 2? Then you already have them: skip this.)

To remove it: Settings > Apps > Skynet Brewer > Uninstall. After one red warning it
deletes EVERYTHING in C:\Brewing, the Import folder too. Copy anything you want to keep first.


WINDOWS, BY HAND
----------------
1. Make the folder C:\Brewing and copy Skynet_BrewPanel_<date>.zip into it.
2. Right-click the zip, choose "Extract All...", and extract into C:\Brewing.
   It makes the sub folder C:\Brewing\BrewPanel by itself.
   (If Windows suggests C:\Brewing\Skynet_BrewPanel_<date>, change it to C:\Brewing.)
3. Copy Skynet_Brewer.bat (it comes with this ReadMe, and is also in
   C:\Brewing\BrewPanel\install\windows) into C:\Brewing.
4. Put it on the Desktop: right-click the .bat, "Show more options", "Send to",
   "Desktop (create shortcut)". Rename the shortcut to "Skynet Brewer".
5. Double-click it. The black window is the panel running; keep it open while you brew.
   The browser opens http://localhost:8080 after a few seconds.

You do not need to install Node.js first. Each time Skynet_Brewer.bat starts, it
checks for Node.js and, if it is missing or too old, downloads the LTS version from
nodejs.org and installs it (needs the internet; Windows asks for permission, click
Yes). It also gets the USB board support the first time. If your panel is not in
C:\Brewing\BrewPanel, open the .bat in Notepad and change the PANEL line.


MAC
---
1. Double-click Skynet_BrewPanel_<date>.zip (Safari may already have unzipped it into
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
1. Put install-skynet-brewer.sh and Skynet_BrewPanel_<date>.zip in the same folder.
2. Open a terminal in that folder and run:
       bash install-skynet-brewer.sh
   Do not put sudo in front; it asks for your password when it needs it.
   On Debian, Ubuntu, Mint and similar it installs Node.js for you if needed.
3. Start it with "Skynet Brewer" on the Desktop or in the applications menu.
   It asks whether the panel should start by itself when the computer starts.


RASPBERRY PI (THE BRAIN)
------------------------
Raspberry Pi OS (64-bit recommended), Pi 4 or newer.
1. Copy install-skynet-brewer.sh and Skynet_BrewPanel_<date>.zip to the Pi
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
