SKYNET BREWERY - FIRST TIME INSTALL ON LINUX
============================================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

This ReadMe walks you through a brand-new install on a Linux PC, one step at a time.
It is written for Ubuntu, Linux Mint and Debian (the most common ones); Fedora notes
are included where it differs. You do not need to know anything about programming.
Do the steps in order and tick each box as you go. It takes about 20 minutes.

For a Raspberry Pi, use ReadMe_Raspberry_Pi.txt instead.

(There is also an automatic installer, install-skynet-brewer.sh, that does most of
these steps for you. This ReadMe is the step-by-step way, so you know exactly what
is on your computer. Use one or the other, not both.)


WHICH COMPUTER IS THE BRAIN? READ THIS FIRST
--------------------------------------------
The "Brain" is the one computer that runs the panel. It holds all the settings,
pictures, sounds and Processes, and your boards (Arduino Mega and so on) plug into
ITS USB sockets. Every other phone, tablet or computer only opens the panel in a
web browser and needs NOTHING installed.

The Brain can be a Raspberry Pi or this computer. A Raspberry Pi is the plan for the
finished brewery (small, cheap, always on), but it is not required today: the
panel runs the same on Windows, Mac, Linux or a Pi.

  Your Brain is a Raspberry Pi?
      Then do NOT follow this ReadMe on this computer. Follow
      ReadMe_Raspberry_Pi.txt on the Pi instead, and plug the boards into the Pi. On
      this computer you only open the browser and go to  http://skynet.local:8080
      (or the Pi's number).
      No Node.js, no drivers and no files are needed on this computer.

  Your Brain is this computer?
      Then follow this ReadMe. The boards plug into this computer (Linux needs no
      USB driver; the first install file sets the USB permission), and phones and
      other computers open  http://<this computer's number>:8080 (step 10).

Use only ONE Brain at a time. Two panels driving the same boards fight each other.


WHAT YOU NEED
-------------
(For the boards to buy, how many ports each has, and what the panel cannot do yet,
see Minimum_Equipment_and_Limitations.txt, or Help > Minimum equipment in the panel.)

  [ ] A 64-bit PC with Ubuntu 22.04 or newer, Linux Mint 21 or newer, Debian 12 or
      newer, or Fedora 40 or newer, with an internet connection for the install.
  [ ] Your Linux password (the one you use for updates).
  [ ] The panel zip file: Skynet_BrewPanel_<date>.zip  (<date> is the release date,
      for example Skynet_BrewPanel_2026-10-19.zip)
  [ ] The file that comes with this ReadMe:
        skynet-first-install.sh    runs once, the first time
      (It is also inside the zip, in BrewPanel/install/linux.)

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
          Windows needs the free CH340 driver (see ReadMe_Windows.txt) only if you
          plug the Mega into a Windows PC, for example to load the firmware.
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
  Program            Needed?                        Why
  -----------------  -----------------------------  ----------------------------------
  Node.js (22.13+)   YES, always                    The panel runs on it. It must be
                                                     installed and the panel's terminal
                                                     window must be RUNNING to use it.
  curl, unzip        YES (small helper tools)       To get Node.js and unzip the panel.
  A web browser      YES (Firefox is already there) This is how you see the panel.
  USB board driver   NO, Linux has them built in    -
  Tailscale          Only to use it away from home  Safe remote access from your phone.


HOW TO OPEN A TERMINAL (YOU WILL NEED IT)
  Press Ctrl + Alt + T. (Or open the applications menu and search for Terminal.)
  You type a command and press Enter. When it asks for your password, type it and
  press Enter: NOTHING shows while you type, not even dots. That is normal.
  To paste a command into the terminal use Ctrl + Shift + V (plain Ctrl + V does
  not work there).


STEP 1. UPDATE THE COMPUTER
---------------------------
  [ ] Open a terminal and type (or paste) this, then press Enter:
          sudo apt update && sudo apt upgrade -y
      Type your password when asked. Wait until the prompt comes back.
      Fedora:   sudo dnf upgrade -y


STEP 2. INSTALL THE HELPER TOOLS
--------------------------------
  [ ] In the terminal:
          sudo apt install -y curl ca-certificates unzip
      Fedora:   sudo dnf install -y curl unzip


STEP 3. INSTALL NODE.JS (REQUIRED)
----------------------------------
Node.js is free. The panel is a Node.js program, so it cannot start without it.
The panel needs Node.js version 22.13 or newer.

IMPORTANT: do NOT just type "sudo apt install nodejs" on Ubuntu, Mint or Debian.
That gives an old version that is too old for the panel. Use the two commands
below, which get the current LTS version from NodeSource (the official Linux
packages of Node.js).

UBUNTU, LINUX MINT, DEBIAN
  [ ] In the terminal, paste this line and press Enter:
          curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
      It prints a lot of text and ends with a line about running apt install nodejs.
  [ ] Then:
          sudo apt install -y nodejs

FEDORA
  [ ] In the terminal:
          sudo dnf install -y nodejs npm
      Then check the version (below). If it is older than v22.13, run instead:
          curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
          sudo dnf install -y nodejs

CHECK THAT NODE.JS WORKS
  [ ] Type   node -v   and press Enter.
      You should see a version like  v24.11.0  or  v22.13.0 . Anything from v22.13
      upward is good.
  [ ] Type   npm -v   and press Enter. Any number means npm is there too.


STEP 4. MAKE THE BREWING FOLDER
-------------------------------
  [ ] In the terminal:
          mkdir -p ~/Brewing
      (~ means your home folder, so this makes /home/<your name>/Brewing)


STEP 5. PUT THE PANEL IN THE BREWING FOLDER AND UNZIP IT
--------------------------------------------------------
  [ ] Open the Files app (the file manager). Copy Skynet_BrewPanel_<date>.zip and
      skynet-first-install.sh into the Brewing folder in your home folder
      (from Downloads or a USB stick).
  [ ] In the terminal, unzip it:
          cd ~/Brewing
          unzip Skynet_BrewPanel_*.zip
      You now have ~/Brewing/BrewPanel
  [ ] Check:
          ls ~/Brewing/BrewPanel/server.js
      It should print the file's name. "No such file" means the unzip went somewhere
      else; do this step again.

  Your Brewing folder should now look like this:
      Brewing/
          BrewPanel/                      (the panel)
          Skynet_BrewPanel_<date>.zip     (you can keep it or delete it)
          skynet-first-install.sh


STEP 6. RUN THE FIRST TIME INSTALL FILE
---------------------------------------
  [ ] In the terminal type exactly this and press Enter (no sudo in front):
          bash ~/Brewing/skynet-first-install.sh
  [ ] It works through 6 steps:
        [1/6] finds the panel
        [2/6] checks Node.js
        [3/6] gets the USB board support from the internet (about a minute)
        [4/6] lets you use USB boards (asks for your password)
        [5/6] puts "Skynet Brewer" on your Desktop and in the applications menu
        [6/6] starts the panel and shows its address for your phone
  [ ] After a few seconds your browser opens  http://localhost:8080  with the panel.

  The terminal window IS the panel. Keep it open the whole time you brew.
  Closing it, or pressing Ctrl + C in it, stops the panel.

  If it shows a red message instead, read it. It tells you which step of this ReadMe
  to go back to.

  If it said "log out and back in": do that once (or restart), so USB boards work.


IF THIS COMPUTER ALREADY HAD THE PANEL (STARTING OVER)
------------------------------------------------------
If the panel was installed here before, the first install file finds your old
work and stops with a red WARNING before it changes anything:
    "THIS COMPUTER ALREADY HAS A SKYNET PANEL WITH YOUR WORK IN IT"
Starting over gives you a brand-new panel, as if it had never been installed,
and ALL OF THE WORK DONE SO FAR WILL BE OVERWRITTEN: your Tabs, layout, Devices,
pipes, settings, Processes, pictures, sounds, brew log, users and passwords.
  [ ] Type  YES  (capital letters) and press Enter to start over.
      As a safety net the old work is moved to ~/Brewing/Old_Panel_<date>, not deleted.
      Nothing from it is used by the new panel. Delete that folder later if you
      do not need it.
  [ ] Type  KEEP  and press Enter to keep all your work and only finish the
      install (for example when you run it again to get the USB support).
  [ ] Just press Enter to stop without changing anything.
  If it says the panel is still running, stop it first (Ctrl + C in its window, or
  close it), then run the first install file again.


STEP 7. CREATE THE ADMIN ACCOUNT (FIRST TIME ONLY)
--------------------------------------------------
  [ ] The panel asks you to create the admin account. Pick a name and a password
      you will remember.
  [ ] It then shows a RECOVERY CODE. Write it down on paper or save it somewhere
      safe. It is the only way back in if you forget the password.
  [ ] Pick a sample Schema to start from (a Schema is a whole brewery: Tabs, Devices,
      pipes and settings; you can load another later in Settings).

  While Settings > Testing mode is on, every new version clears the sign-ins and you
  do this step again. That is on purpose while the panel is being tested.


STEP 8. STARTING THE PANEL EVERY DAY
------------------------------------
  [ ] Double-click "Skynet Brewer" on the Desktop, or pick it from the applications
      menu. A terminal window opens and the browser shows the panel.
      On Ubuntu, the first time: right-click the Desktop icon and choose
      "Allow Launching".
  [ ] Or, in a terminal:   ~/Brewing/start-skynet-brewer.sh
  [ ] To stop the panel: press Ctrl + C in its window, or close the window.

  Want it to start by itself whenever the computer starts? Run the automatic
  installer (install-skynet-brewer.sh) and say Yes when it asks, or follow step 8 of
  ReadMe_Raspberry_Pi.txt, which works the same on any Linux PC.


STEP 9. KEEP THE COMPUTER AWAKE WHILE BREWING
---------------------------------------------
  [ ] Ubuntu: Settings > Power > turn OFF "Automatic Suspend" (and set Screen Blank
      as you like; a dark screen is fine).
      Linux Mint: Menu > Power Management > "Suspend when inactive for": Never.


STEP 10. OPEN THE PANEL ON YOUR PHONE OR ANOTHER PC AT HOME
-----------------------------------------------------------
  [ ] The first time install printed it, or type   hostname -I   in a terminal.
      The first number, for example 192.168.1.70, is the computer's address.
  [ ] On the phone (on the same home WiFi), open the browser and go to
          http://192.168.1.70:8080        (use your own number)
  [ ] If it cannot connect and your firewall is on, allow the panel:
          sudo ufw allow 8080/tcp                    (Ubuntu, Mint)
          sudo firewall-cmd --add-port=8080/tcp --permanent && sudo firewall-cmd --reload   (Fedora)


STEP 11. USE IT AWAY FROM HOME (OPTIONAL): TAILSCALE
----------------------------------------------------
Never open a port on your router for the panel. Use Tailscale (free for home use).
  [ ] In a terminal:
          curl -fsSL https://tailscale.com/install.sh | sh
          sudo tailscale up
      It prints a web link. Open it and sign in.
  [ ] On the phone: install Tailscale from the App Store or Google Play and sign in
      with the SAME account.
  [ ] In a terminal type   tailscale ip -4   to get the computer's 100.x.x.x address.
      On the phone open  http://100.x.x.x:8080  (use the real number).


PROBLEMS
--------
"Node.js is not installed" or "node: command not found"
    Do step 3 again.
"Node.js ... is too old"
    You probably have the old Node.js from apt. Do step 3 (the NodeSource commands);
    it replaces the old one.
"The panel is not in /home/.../Brewing/BrewPanel"
    Do step 5 again.
"Permission denied" when running the file
    Run it with bash in front, exactly as in step 6.
"Do not run this with sudo"
    Run it again without sudo; it asks for the password when it needs it.
The browser says "Unable to connect"
    The panel takes a few seconds to start. Wait, then reload. Make sure its terminal
    window is still open.
"EADDRINUSE" or "port 8080 is already in use"
    The panel is already running in another window. Use that one, or close it.
The USB board is not found
    Log out and back in (or restart) once after the first install. Then check it shows
    with   ls /dev/ttyACM* /dev/ttyUSB*
"Could not get the USB board support"
    Check the internet, then run   bash ~/Brewing/skynet-first-install.sh   again.
Forgot the password
    On the sign-in page click "Forgot password?" and type the recovery code from step 7.

More help: once the panel is running, the Help tab has the full manual.
