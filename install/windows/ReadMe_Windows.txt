SKYNET BREWERY - FIRST TIME INSTALL ON WINDOWS
==============================================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

This ReadMe walks you through a brand-new install on a Windows 10 or Windows 11 PC,
one step at a time. You do not need to know anything about programming.
Do the steps in order and tick each box as you go. It takes about 20 minutes.

(There is also an automatic installer, Skynet_Brewer_Setup_<date>.exe, that does
steps 3 to 9 for you. This ReadMe is the step-by-step way, so you know exactly
what is on your PC. Use one or the other, not both.)


WHICH COMPUTER IS THE BRAIN? READ THIS FIRST
--------------------------------------------
The "Brain" is the one computer that runs the panel. It holds all the settings,
pictures, sounds and Processes, and your boards (Arduino Mega and so on) plug into
ITS USB sockets. Every other phone, tablet or computer only opens the panel in a
web browser and needs NOTHING installed.

The Brain can be a Raspberry Pi or this PC. A Raspberry Pi is the plan for the
finished brewery (small, cheap, always on), but it is not required today: the
panel runs the same on Windows, Mac, Linux or a Pi.

  Your Brain is a Raspberry Pi?
      Then do NOT follow this ReadMe on this PC. Follow ReadMe_Raspberry_Pi.txt on
      the Pi instead, and plug the boards into the Pi. On this PC you only open the
      browser and go to  http://skynet.local:8080  (or the Pi's number).
      No Node.js, no drivers and no files are needed on this PC.

  Your Brain is this PC?
      Then follow this ReadMe. The boards plug into this PC (step 4 covers the USB
      driver), and phones and other computers open  http://<this PC's number>:8080
      (step 11).

Use only ONE Brain at a time. Two panels driving the same boards fight each other.


WHAT YOU NEED
-------------
(For the boards to buy, how many ports each has, and what the panel cannot do yet,
see Minimum_Equipment_and_Limitations.txt, or Help > Minimum equipment in the panel.)

  [ ] A Windows 10 or 11 PC (64-bit), with an internet connection for the install.
  [ ] An account on the PC that can install programs (an "administrator" account).
      Most home PCs are set up this way.
  [ ] The panel zip file: Skynet_BrewPanel_<date>.zip  (<date> is the release date,
      for example Skynet_BrewPanel_2026-10-19.zip)
  [ ] These two files that come with this ReadMe:
        Skynet_First_Install.bat   runs once, the first time
        Skynet_Brewer.bat          starts the panel every day
      (Both are also inside the zip, in BrewPanel\install\windows.)

REAL-WORLD EQUIPMENT: ONLY NEEDED FOR REAL-WORLD TESTING WITH WIRED DEVICES
==========================================================================
You do NOT need any boards to install or try the panel. It has a built-in simulator
(Settings > Simulation) that runs every tab, Process and alarm with no hardware at
all. Buy the parts below only when you want to switch real things on and off: valves,
pumps, burners, heating elements, temperature probes.

SUGGESTED REAL-WORLD TEST SETUP
-------------------------------
  [ ] One Raspberry Pi 4 (4 GB). This is the Brain (see ReadMe_Raspberry_Pi.txt).
  [ ] A dedicated power supply for the Pi: the official Raspberry Pi 15 W USB-C
      supply (5.1 V, 3 A). Use it for the Pi only. Phone chargers and shared supplies
      cause random restarts in the middle of a brew.
        Additional items for a real Production Environment (not needed for testing):
        [ ] A case with a fan or a heat-sink case (the Pi slows itself down when hot).
        [ ] A USB SSD or a "High Endurance" microSD card (normal cards wear out),
            and a spare card with a copy of your setup.
        [ ] A small UPS (battery backup) so a power blink does not restart the Brain.
        [ ] An Ethernet cable to your router (steadier than WiFi on brew day).
        [ ] A dry spot away from steam and splashes, or a closed electrical box.
        [ ] A surge protector, and a powered USB hub if you add more than 2 boards.
  [ ] One Arduino Mega 2560 (genuine or clone) and a USB cable (USB-A to USB-B, the
      square "printer" plug). The Mega plugs into the Pi's USB socket.
        Clone boards work fine. What is different about a clone:
        - The chip next to the USB plug is usually a CH340 instead of the genuine
          board's chip. The Pi, Linux and Macs (macOS 12 and newer) need no driver.
          Windows needs the free CH340 driver (see STEP 4 below) only if
          you plug the Mega into a Windows PC, for example to load the firmware.
        - It shows up as "USB-SERIAL CH340" (Windows) or /dev/ttyUSB0 (Pi, Linux)
          instead of "Arduino Mega 2560" or /dev/ttyACM0. Pick that port on the
          Devices page.
        - In the Arduino IDE pick Board "Arduino Mega or Mega 2560" and Processor
          "ATmega2560 (Mega 2560)", the same as a genuine board.
        - If loading the firmware fails ("not in sync"), try another USB cable (many
          cheap cables only charge and carry no data), pick the right port, and
          press the board's reset button just as the upload starts.
  [ ] For the test devices: a relay board (5 V coil, 4 or 8 channels), a 12 V power
      supply for the valves and lights, a DS18B20 temperature probe with a 4.7 k
      resistor, and some jumper wires. A 12 V LED makes a safe stand-in for a burner
      or an electric element. Never power valves or relays from the Mega's 5V pin.
  [ ] OPTION: one ESP32, only if you want to test a hydrometer that needs it (below).

HYDROMETERS AND THE ESP32 (OPTION)
----------------------------------
A hydrometer may be tested using only the Pi. Depending on the type and where the
hydrometer sits, an ESP32 (or a WiFi extender) might be required in a real
Production Environment, because metal blocks radio signals:
  Tilt (Bluetooth)
    - Pi only: works when the fermenter is within about 10-30 ft of the Pi in the
      open, or in a plastic or glass fermenter.
    - Needs an ESP32 near the fermenter (for example running TiltBridge) when it is
      far from the Pi, inside a freezer or fridge (metal walls), or inside a
      stainless conical (the steel blocks most of the signal; even then the ESP32
      or a Tilt Repeater must sit right next to the conical).
  RAPT Pill (Bluetooth or WiFi)
    - On Bluetooth: the same as a Tilt above.
    - On WiFi: no ESP32. It needs good WiFi at the fermenter; inside a freezer or a
      stainless conical put a WiFi extender close by.
  iSpindel (WiFi, it has its own ESP chip)
    - No ESP32 needed. It sends over WiFi (the panel can take it in through MQTT).
    - Inside a freezer or a stainless conical the WiFi signal may not get out: put
      a WiFi extender next to it.
Hydrometer readings in the panel are still being built. See Help > Minimum
equipment for what works today.


SOFTWARE YOU WILL INSTALL
  Program            Needed?                       Why
  -----------------  ----------------------------  -----------------------------------
  Node.js (LTS)      YES, always                   The panel runs on it. The two .bat
                                                    files install it for you (step 3).
                                                    The panel's black window must be
                                                    RUNNING to use the panel.
  A web browser      YES (you already have Edge)   This is how you see the panel.
  USB board driver   Only with an Arduino board    So Windows can talk to the board.
  Tailscale          Only to use it away from home Safe remote access from your phone.


STEP 1. MAKE SURE WINDOWS IS 64-BIT
-----------------------------------
  [ ] Click Start, type  about  and open "About your PC".
  [ ] Under "Device specifications", find "System type".
      It should say "64-bit operating system, x64-based processor".
      If it says "ARM-based processor", that is fine too. If you ever install
      Node.js by hand (step 3), choose ARM64 instead of x64.


STEP 2. MAKE THE FOLDER C:\Brewing
----------------------------------
  [ ] Open File Explorer (the yellow folder on the taskbar, or press Windows key + E).
  [ ] On the left click "This PC", then double-click "Local Disk (C:)".
  [ ] Right-click an empty spot, choose New > Folder, and name it  Brewing
      (capital B, no spaces). You now have the folder C:\Brewing


STEP 3. NODE.JS (DONE FOR YOU)
------------------------------
Node.js is free. The panel is a Node.js program, so it cannot start without it.
The panel needs Node.js version 22.13 or newer.

You do NOT have to install it yourself. Skynet_First_Install.bat (step 7) and
Skynet_Brewer.bat (every day) check for Node.js each time. If it is missing or too
old, they download the LTS version from nodejs.org and install it, then carry on.
  - It needs the internet, and takes a few minutes the first time.
  - Windows asks "Do you want to allow this app to make changes to your device?".
    Click Yes. (On an account that is not an administrator, Windows asks for the
    administrator's password.)
  [ ] Nothing to do here. Go on to step 4.

ONLY IF THE AUTOMATIC INSTALL DID NOT WORK (the black window says so and opens
the Node.js page), install it by hand:
  [ ] Open your browser and go to:   https://nodejs.org/en/download
  [ ] Pick the LTS version (LTS means Long Term Support, the steady one), for
      Windows, x64 (or ARM64 if step 1 said ARM).
  [ ] Click "Windows Installer (.msi)". The file downloads, named something like
      node-v24.x.x-x64.msi
  [ ] Open your Downloads folder and double-click that .msi file.
  [ ] Click through the setup:
        "Welcome"               click Next
        "License Agreement"     tick "I accept", click Next
        "Destination Folder"    leave it as it is, click Next
        "Custom Setup"          leave it as it is, click Next
                                (it already includes "Add to PATH", which is needed)
        "Tools for Native       leave the box UNTICKED, click Next
         Modules"               (the panel does not need those extra tools)
        "Ready to install"      click Install
  [ ] Windows asks "Do you want to allow this app to make changes?". Click Yes.
  [ ] Click Finish.

CHECK THAT NODE.JS WORKS
  [ ] Click Start, type  cmd  and open "Command Prompt". A black window opens.
  [ ] Type   node -v   and press Enter.
      You should see a version like  v24.11.0  or  v22.13.0 . Anything from v22.13
      upward is good.
      If it says "'node' is not recognized": close the black window, restart the PC,
      and try again. Still not? Run the Node.js installer again.
  [ ] Type   exit   and press Enter to close the window.


STEP 4. USB DRIVER FOR YOUR ARDUINO BOARD (ONLY FOR REAL-WORLD TESTING)
-----------------------------------------------------------------------
Skip this step if you only want to try the panel (it has a built-in simulator).
  [ ] Plug the board into the PC with its USB cable.
  [ ] Right-click Start and open "Device Manager". Open "Ports (COM & LPT)".
      If you see the board with a COM number (for example "Arduino Mega 2560 (COM3)"
      or "USB-SERIAL CH340 (COM4)"), the driver is already there. Write down the
      COM number and go to step 5.
  [ ] If it shows under "Other devices" with a yellow mark, install a driver:
        - A genuine Arduino Mega: install the Arduino IDE from
          https://www.arduino.cc/en/software  (Windows, "Win 10 and newer"). Say Yes
          when it asks to install drivers. That puts the Arduino drivers on the PC.
        - A clone board (the chip near the USB plug says CH340): get the CH340
          driver from the chip maker at  https://www.wch-ic.com/downloads/CH341SER_EXE.html
          Run CH341SER.EXE and click INSTALL.
  [ ] Unplug the board and plug it in again. It should now show a COM number.


STEP 5. PUT THE PANEL ZIP IN C:\Brewing
---------------------------------------
  [ ] Copy Skynet_BrewPanel_<date>.zip into C:\Brewing
      (drag it from your Downloads folder, or from the USB stick, into C:\Brewing).
  [ ] Also copy Skynet_First_Install.bat and Skynet_Brewer.bat into C:\Brewing


STEP 6. UNZIP THE PANEL
-----------------------
  [ ] In C:\Brewing, right-click Skynet_BrewPanel_<date>.zip and choose "Extract All...".
  [ ] IMPORTANT: Windows suggests a folder like C:\Brewing\Skynet_BrewPanel_<date>.
      Change the box so it says only:   C:\Brewing
  [ ] Click Extract.
  [ ] Check: you now have the folder C:\Brewing\BrewPanel, and inside it a file
      named server.js (Windows may show it as just "server").
      If you got C:\Brewing\Skynet_BrewPanel_<date>\BrewPanel instead, move the
      BrewPanel folder up into C:\Brewing and delete the empty one.

  C:\Brewing should now look like this:
      C:\Brewing\
          BrewPanel\                      (the panel)
          Skynet_BrewPanel_<date>.zip     (you can keep it or delete it)
          Skynet_First_Install.bat
          Skynet_Brewer.bat


STEP 7. RUN THE FIRST TIME INSTALL FILE
---------------------------------------
  [ ] Double-click C:\Brewing\Skynet_First_Install.bat
  [ ] If a blue box says "Windows protected your PC": click "More info", then
      "Run anyway". (The file is not signed with a paid certificate, that is all.)
  [ ] A black window opens and works through 5 steps:
        [1/5] finds the panel
        [2/5] checks Node.js, and installs it if it is missing or too old
              (a few minutes; click Yes when Windows asks for permission)
        [3/5] gets the USB board support from the internet (about a minute)
        [4/5] puts "Skynet Brewer" on your Desktop
        [5/5] starts the panel
  [ ] Windows Security may ask "Allow Node.js JavaScript Runtime on your networks?"
      Tick "Private networks" ONLY, then click "Allow". This lets your phone and
      other PCs at home reach the panel.
  [ ] After a few seconds your browser opens  http://localhost:8080  with the panel.

  The black window IS the panel. Keep it open the whole time you brew.
  Closing it, or pressing Ctrl+C in it, stops the panel.

  If the black window shows a message instead, read it. It tells you which step of
  this ReadMe to go back to.

WHAT IS IN THE FIRST TIME INSTALL FILE
If you ever need to make Skynet_First_Install.bat yourself, it is a plain text file.
Copy it from C:\Brewing\BrewPanel\install\windows, or open Notepad, paste the text
from that file, and save it as C:\Brewing\Skynet_First_Install.bat with
"Save as type" set to "All files" (otherwise Notepad names it .bat.txt).


IF THIS COMPUTER ALREADY HAD THE PANEL (STARTING OVER)
------------------------------------------------------
If the panel was installed here before, the first install file finds your old
work and stops with a red WARNING before it changes anything:
    "THIS COMPUTER ALREADY HAS A SKYNET PANEL WITH YOUR WORK IN IT"
Starting over gives you a brand-new panel, as if it had never been installed,
and ALL OF THE WORK DONE SO FAR WILL BE OVERWRITTEN: your Tabs, layout, Devices,
pipes, settings, Processes, pictures, sounds, brew log, users and passwords.
  [ ] Type  YES  (capital letters) and press Enter to start over.
      As a safety net the old work is moved to C:\Brewing\Old_Panel_<date>, not deleted.
      Nothing from it is used by the new panel. Delete that folder later if you
      do not need it.
  [ ] Type  KEEP  and press Enter to keep all your work and only finish the
      install (for example when you run it again to get the USB support).
  [ ] Just press Enter to stop without changing anything.
  If it says the panel is still running, stop it first (close its black window),
  then run the first install file again.


STEP 8. CREATE THE ADMIN ACCOUNT (FIRST TIME ONLY)
--------------------------------------------------
  [ ] The panel asks you to create the admin account. Pick a name and a password
      you will remember.
  [ ] It then shows a RECOVERY CODE. Write it down on paper or save it somewhere
      safe. It is the only way back in if you forget the password.
  [ ] Pick a sample Schema to start from (a Schema is a whole brewery: Tabs, Devices,
      pipes and settings; you can load another later in Settings).

  While Settings > Testing mode is on, every new version clears the sign-ins and you
  do this step again. That is on purpose while the panel is being tested.


STEP 9. STARTING THE PANEL EVERY DAY
------------------------------------
  [ ] Double-click "Skynet Brewer" on the Desktop. The black window opens and the
      browser shows the panel after a few seconds.
  [ ] If the shortcut is not on the Desktop, make it: open C:\Brewing, right-click
      Skynet_Brewer.bat, choose "Show more options" > "Send to" >
      "Desktop (create shortcut)". Rename the shortcut to  Skynet Brewer

  Lost Skynet_Brewer.bat? A copy is in C:\Brewing\BrewPanel\install\windows.
  Copy it into C:\Brewing. Each time it starts, it installs Node.js if it is
  missing, gets the USB board support if it is missing, then starts the panel.
  If your panel is not in C:\Brewing\BrewPanel, open the file in Notepad and
  change the line  set "PANEL=C:\Brewing\BrewPanel" .

  To stop the panel: click in the black window and press Ctrl+C, or close it.


STEP 10. KEEP THE PC AWAKE WHILE BREWING
----------------------------------------
The panel only runs while the PC is on and awake.
  [ ] Settings > System > Power (& battery) > Screen and sleep.
  [ ] Set "When plugged in, put my device to sleep after" to  Never.
      The screen may still turn off; that is fine.


STEP 11. OPEN THE PANEL ON YOUR PHONE OR ANOTHER PC AT HOME
-----------------------------------------------------------
  [ ] On the brewing PC, open Command Prompt (Start, type cmd) and type  ipconfig
  [ ] Find "IPv4 Address", for example 192.168.1.50
  [ ] On the phone (on the same home WiFi), open the browser and go to
          http://192.168.1.50:8080        (use your own number)
  [ ] Tip: add it to the phone's home screen (Share > Add to Home Screen on iPhone).
  If the phone cannot reach it, see "Problems" below.


STEP 12. USE IT AWAY FROM HOME (OPTIONAL): TAILSCALE
----------------------------------------------------
Never open a port on your router for the panel. Use Tailscale (free for home use).
  [ ] On the PC: download Tailscale from  https://tailscale.com/download  (Windows),
      install it, and sign in.
  [ ] On the phone: install Tailscale from the App Store or Google Play and sign in
      with the SAME account.
  [ ] In the panel: Help > "Installing Tailscale on Windows" has the full steps and
      the address to use.


PROBLEMS
--------
"Node.js could not be installed by itself"
    Check the internet, then double-click the .bat file again. Still not? Install
    it by hand: see "Only if the automatic install did not work" in step 3, then
    restart the PC.
"'node' is not recognized"
    Restart the PC, then double-click Skynet Brewer again.
"The panel is not in C:\Brewing\BrewPanel"
    Do step 6 again. The folder must be exactly C:\Brewing\BrewPanel with server.js inside.
The browser says "This site can't be reached"
    The panel takes a few seconds to start. Wait, then press F5. Make sure the black
    window is still open.
"Port 8080 is already in use" (or EADDRINUSE) in the black window
    The panel is already running in another black window. Use that one, or close it first.
The phone cannot open the panel
    Same WiFi as the PC? Black window open? Then allow it in the firewall:
    Start > type "Allow an app through Windows Firewall" > Change settings >
    tick "Private" next to "Node.js JavaScript Runtime" > OK.
    Also check the PC's network is set to Private: Settings > Network & internet >
    WiFi (or Ethernet) > your network > Network profile type: Private.
"Could not get the USB board support"
    Check the internet, then double-click Skynet_First_Install.bat again.
Forgot the password
    On the sign-in page click "Forgot password?" and type the recovery code from step 8.

More help: once the panel is running, the Help tab has the full manual.
