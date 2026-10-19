SKYNET BREWERY - FIRST TIME INSTALL ON A RASPBERRY PI (THE BRAIN)
=================================================================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

This ReadMe walks you through a brand-new Raspberry Pi, from an empty memory card to
a running Skynet Brew Panel that starts by itself every time the Pi is switched on.
You do not need to know anything about programming or Linux. Do the steps in order
and tick each box as you go. It takes about 45 minutes, most of it waiting.

(There is also an automatic installer, install-skynet-brewer.sh, that does steps 6
to 8 for you. This ReadMe is the step-by-step way, so you know exactly what is on
your Pi. Use one or the other, not both.)


THE PI IS THE BRAIN
-------------------
The Pi runs the panel and holds all the settings, pictures, sounds and Processes.
Your boards (Arduino Mega and so on) plug into the PI's USB sockets, not into your
PC. Your PC, Mac, phone and tablet then only open the panel in a web browser: do not
install the panel or Node.js on them too. Use only ONE Brain at a time; two panels
driving the same boards fight each other.

How USB is different on the Pi:
  - No driver to install. Raspberry Pi OS already knows genuine Arduino boards and
    CH340 clone boards. (On Windows you may need a driver; on the Pi you never do.)
  - The board shows up as /dev/ttyACM0 (genuine Arduino) or /dev/ttyUSB0 (clone),
    not as a COM number like on Windows.
  - Linux only lets members of the "dialout" group use USB boards. The first install
    file (step 8) adds you to it and lets the panel's service use it. A restart
    afterwards makes it take effect everywhere.
  - The Pi's own GPIO pins (the row of pins on the board) are NOT used by the panel
    yet. All inputs and outputs go through a board on USB, such as the Arduino Mega.


WHAT YOU NEED
-------------
HARDWARE
  [ ] A Raspberry Pi 4 (2 GB memory or more) or a Raspberry Pi 5 (4 GB recommended).
  [ ] The official power supply for that Pi. Pi 5: 27 W USB-C. Pi 4: 15 W USB-C.
      (Phone chargers often cause random restarts. Use the official one.)
  [ ] A microSD card, 32 GB or bigger, "A1" or "A2" class (SanDisk or Samsung).
  [ ] A microSD card reader for your PC or Mac (many laptops have a slot).
  [ ] For setup: a monitor or TV, a micro-HDMI to HDMI cable (the Pi has MICRO-HDMI
      sockets), a USB keyboard and a USB mouse.
  [ ] A network: an Ethernet cable to your router is best for brewing; WiFi works too.
  [ ] A USB stick to carry the panel files to the Pi (or download them on the Pi).

FILES
  [ ] The panel zip file: Skynet_BrewPanel_<date>.zip  (<date> is the release date,
      for example Skynet_BrewPanel_2026-10-19.zip)
  [ ] The file that comes with this ReadMe:
        skynet-first-install-pi.sh    runs once, the first time
      (It is also inside the zip, in BrewPanel/install/pi.)

SOFTWARE YOU WILL INSTALL
  Program                   Where           Needed?                 Why
  ------------------------  --------------  ----------------------  -------------------------
  Raspberry Pi Imager       your PC or Mac  YES, once               Puts the Pi's system on
                                                                     the memory card.
  Raspberry Pi OS (64-bit)  the Pi          YES                     The Pi's operating system.
  Node.js (22.13+)          the Pi          YES, always             The panel runs on it. It
                                                                     must be installed and the
                                                                     panel must be RUNNING (the
                                                                     install sets it to run by
                                                                     itself).
  A web browser             phone / PC      YES (already there)     This is how you see the panel.
  USB board driver          -               NO, built into the Pi   -
  Tailscale                 the Pi + phone  Only away from home     Safe remote access.


PART A - ON YOUR PC OR MAC: PREPARE THE MEMORY CARD
===================================================

STEP 1. INSTALL RASPBERRY PI IMAGER
-----------------------------------
  [ ] On your PC or Mac go to   https://www.raspberrypi.com/software/
  [ ] Click the download button for your computer (Windows, macOS or Ubuntu).
  [ ] Install it:
        Windows: open the downloaded imager_x.x.x.exe, click Yes, then Install, then Finish.
        Mac: open the .dmg and drag Raspberry Pi Imager into Applications.


STEP 2. WRITE RASPBERRY PI OS TO THE CARD
-----------------------------------------
  [ ] Put the microSD card in the card reader.
  [ ] Open Raspberry Pi Imager.
  [ ] "Raspberry Pi Device": CHOOSE DEVICE > pick your model (Raspberry Pi 5 or 4).
  [ ] "Operating System": CHOOSE OS > "Raspberry Pi OS (64-bit)" (the first one, the one
      WITH a desktop). Not "Lite", not 32-bit.
  [ ] "Storage": CHOOSE STORAGE > pick the memory card. Check the size matches the card,
      so you do not wipe a different drive.
  [ ] Click NEXT. When it asks "Would you like to apply OS customisation settings?",
      click EDIT SETTINGS and fill in:
        GENERAL tab
          [x] Set hostname:            skynet          (the Pi's name on your network)
          [x] Set username and password:
                Username:              brewer          (or your own; lower case, no spaces)
                Password:              (pick one and WRITE IT DOWN)
          [x] Configure wireless LAN:  only if you use WiFi: your WiFi name and password,
                                       and your country
          [x] Set locale settings:     your time zone and keyboard layout
        SERVICES tab
          [x] Enable SSH, "Use password authentication"
              (lets you work on the Pi later from your PC; optional but handy)
      Click SAVE.
  [ ] Click YES to use those settings, then YES to erase the card.
  [ ] Wait while it writes and verifies (5 to 15 minutes). When it says "Write
      Successful", click CONTINUE and take the card out.


PART B - ON THE RASPBERRY PI
============================

STEP 3. FIRST START
-------------------
  [ ] Put the memory card in the slot under the Pi (contacts facing the board).
  [ ] Connect the monitor (use the HDMI socket nearest the power socket), keyboard,
      mouse, and the Ethernet cable if you use one.
  [ ] Plug in the power supply LAST. The Pi starts by itself (there may be no button).
      The first start takes a few minutes and may restart once. That is normal.
  [ ] The Raspberry Pi desktop appears. If a "Welcome" window appears, follow it
      (country, password, WiFi) and let it update the software; then restart when asked.

HOW TO OPEN A TERMINAL ON THE PI (YOU WILL NEED IT)
  Click the black screen icon at the top of the screen (Terminal), or press
  Ctrl + Alt + T. You type a command and press Enter. When it asks for your
  password, type it and press Enter: NOTHING shows while you type. That is normal.
  To paste into the terminal use Ctrl + Shift + V.


STEP 4. UPDATE THE PI
---------------------
  [ ] Open a terminal and type:
          sudo apt update && sudo apt full-upgrade -y
      Wait until the prompt comes back (can take 10 minutes).
  [ ] Then restart the Pi:
          sudo reboot


STEP 5. GIVE THE PI A FIXED ADDRESS (RECOMMENDED)
-------------------------------------------------
So your phone always finds the panel at the same address.
  [ ] Easiest: you can always use the name instead of a number:  http://skynet.local:8080
      (works on iPhones, Macs and Windows 10/11; some Android phones need the number).
  [ ] Best: in your router's settings, find "DHCP reservation" (also called "Address
      reservation" or "Static lease") and reserve an address for the device named
      "skynet". Every router is different; your router's manual or its app shows where.
  [ ] To see the Pi's current number, type in a terminal:   hostname -I
      The first number, for example 192.168.1.80, is the Pi's address.


STEP 6. INSTALL NODE.JS (REQUIRED)
----------------------------------
Node.js is free. The panel is a Node.js program, so it cannot start without it.
The panel needs Node.js version 22.13 or newer.

IMPORTANT: do NOT just type "sudo apt install nodejs". The Node.js that comes with
Raspberry Pi OS is too old for the panel. Use these two commands, which get the
current LTS version from NodeSource (the official Linux packages of Node.js):

  [ ] In the terminal, paste this line and press Enter:
          curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
      It prints a lot of text. Wait for the prompt to come back.
  [ ] Then:
          sudo apt install -y nodejs

CHECK THAT NODE.JS WORKS
  [ ] Type   node -v   and press Enter.
      You should see a version like  v24.11.0  or  v22.13.0 . Anything from v22.13
      upward is good.
  [ ] Type   npm -v   and press Enter. Any number means npm is there too.


STEP 7. COPY THE PANEL TO THE PI AND UNZIP IT
---------------------------------------------
  [ ] On your PC, copy Skynet_BrewPanel_<date>.zip and skynet-first-install-pi.sh onto
      a USB stick. Plug the stick into the Pi. If a box asks what to do, choose
      "Open in File Manager".
  [ ] In a terminal, make the Brewing folder:
          mkdir -p ~/Brewing
  [ ] In the File Manager, copy both files from the USB stick into the Brewing folder
      (it is in your home folder: /home/brewer/Brewing if your user is brewer).
      Then eject the stick (the eject icon at the top right) and unplug it.
  [ ] In the terminal, unzip the panel:
          cd ~/Brewing
          unzip Skynet_BrewPanel_*.zip
  [ ] Check:
          ls ~/Brewing/BrewPanel/server.js
      It should print the file's name. "No such file" means the unzip went somewhere
      else; do this step again.

  Your Brewing folder should now look like this:
      Brewing/
          BrewPanel/                      (the panel)
          Skynet_BrewPanel_<date>.zip     (you can keep it or delete it)
          skynet-first-install-pi.sh


STEP 8. RUN THE FIRST TIME INSTALL FILE
---------------------------------------
  [ ] In the terminal type exactly this and press Enter (no sudo in front):
          bash ~/Brewing/skynet-first-install-pi.sh
  [ ] It works through 6 steps and asks for your password once or twice:
        [1/6] finds the panel
        [2/6] checks Node.js
        [3/6] gets the USB board support from the internet (a few minutes)
        [4/6] lets the panel use USB boards
        [5/6] sets the panel to START BY ITSELF every time the Pi starts
              (a service called skynet-brewer, which also restarts it if it stops)
        [6/6] checks it is running and shows the addresses to use
  [ ] When it says "Done. The panel is RUNNING", restart the Pi once:
          sudo reboot
      After the restart the panel starts by itself. You do not have to start it, and
      no window has to stay open. It runs as long as the Pi has power.

  If it shows a red message instead, read it. It tells you which step of this ReadMe
  to go back to.


STEP 9. CREATE THE ADMIN ACCOUNT (FIRST TIME ONLY)
--------------------------------------------------
  [ ] On the Pi, double-click "Skynet Brewer" on the desktop (or open the browser and
      go to http://localhost:8080). Or use your phone at home: http://skynet.local:8080
  [ ] The panel asks you to create the admin account. Pick a name and a password you
      will remember.
  [ ] It then shows a RECOVERY CODE. Write it down on paper or save it somewhere safe.
      It is the only way back in if you forget the password.
  [ ] Pick a sample setup to start from (you can change it later in Settings).

  While Settings > Testing mode is on, every new version clears the sign-ins and you
  do this step again. That is on purpose while the panel is being tested.


STEP 10. EVERY DAY
------------------
  Nothing to do: switch the Pi on, wait about a minute, and open the panel on your
  phone or PC at  http://skynet.local:8080  (or http://<the Pi's number>:8080).

  Useful commands (type them in a terminal on the Pi):
      Is it running?    systemctl status skynet-brewer       (q to quit)
      Stop it:          sudo systemctl stop skynet-brewer
      Start it:         sudo systemctl start skynet-brewer
      Restart it:       sudo systemctl restart skynet-brewer
      Its messages:     journalctl -u skynet-brewer -f       (Ctrl + C to stop watching)

  After setup you can run the Pi without monitor, keyboard and mouse.

  SWITCHING THE PI OFF: never just pull the plug while it runs; that can damage the
  memory card. Type   sudo shutdown -h now   , wait until the green light stops
  flashing, then unplug it. (Pi 5: you can also press its power button once.)


STEP 11. OPEN THE PANEL ON YOUR PHONE OR A PC AT HOME
-----------------------------------------------------
  [ ] On the phone (on the same home network), open the browser and go to
          http://skynet.local:8080
      If that does not open, use the number from step 5, for example
          http://192.168.1.80:8080
  [ ] Tip: add it to the phone's home screen (iPhone: Share > Add to Home Screen).


STEP 12. USE IT AWAY FROM HOME (OPTIONAL): TAILSCALE
----------------------------------------------------
Never open a port on your router for the panel. Use Tailscale (free for home use).
  [ ] On the Pi, in a terminal:
          curl -fsSL https://tailscale.com/install.sh | sh
          sudo tailscale up
      It prints a web link. Open it (on the Pi or any device) and sign in.
  [ ] On the phone: install Tailscale from the App Store or Google Play and sign in
      with the SAME account.
  [ ] On the Pi type   tailscale ip -4   to get its 100.x.x.x address.
      On the phone open  http://100.x.x.x:8080  (use the real number). This works
      from anywhere with the Tailscale app switched on.


STEP 13. CONNECT YOUR BOARDS
----------------------------
  [ ] Plug the Arduino Mega (or other board) into one of the Pi's USB sockets, with
      its normal USB cable (USB-A on the Pi end, USB-B on the Mega end). No driver
      is needed.
  [ ] In a terminal type   ls /dev/ttyACM* /dev/ttyUSB*
      You should see something like /dev/ttyACM0 (genuine Arduino) or /dev/ttyUSB0
      (clone). That is the port to pick for the board in the panel (Devices page).
      With several boards, plug them in one at a time and note which name each gets.
  [ ] Nothing shows? Try another cable (some cables only charge and carry no data),
      and make sure you restarted the Pi once after step 8.
  [ ] Several boards, or boards that draw a lot of power: use a powered USB hub, so
      the Pi's power supply is not overloaded.
  [ ] Help > Devices in the panel explains the rest.


PROBLEMS
--------
"Node.js is not installed" or "node: command not found"
    Do step 6 again.
"Node.js ... is too old"
    You have the old Node.js from Raspberry Pi OS. Do step 6 (the NodeSource commands);
    it replaces the old one.
"The panel is not in /home/.../Brewing/BrewPanel"
    Do step 7 again.
"Do not run this with sudo"
    Run it again without sudo, exactly as in step 8.
"The panel did not start" with messages
    Read the last lines it showed. Most often Node.js is too old (step 6) or the
    unzip was incomplete (step 7). Fix that and run step 8 again.
The phone cannot open http://skynet.local:8080
    Use the number instead (step 5). Check the phone is on your home WiFi, not mobile
    data, and that   systemctl status skynet-brewer   says "active (running)".
The USB board is not found
    Restart the Pi once (sudo reboot) after the first install, then check step 13.
The Pi restarts by itself, or shows a lightning bolt
    The power supply is too weak. Use the official one.
Forgot the panel password
    On the sign-in page click "Forgot password?" and type the recovery code from step 9.
    No recovery code? In a terminal on the Pi:
        cd ~/Brewing/BrewPanel && node tools/reset-password.js YOURNAME
        sudo systemctl restart skynet-brewer
Forgot the Pi's own password
    Write the card again with Raspberry Pi Imager (step 2). This wipes the card.

More help: once the panel is running, the Help tab has the full manual.
