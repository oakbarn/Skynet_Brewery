SKYNET BREWERY - FIRST TIME INSTALL ON A MAC
============================================
MIT License Granted. Copyright (c) OakBarn Brewery 2026

This ReadMe walks you through a brand-new install on a Mac, one step at a time.
You do not need to know anything about programming. Do the steps in order and tick
each box as you go. It takes about 20 minutes.

(There is also an automatic installer, "Install Skynet Brewer.command", that does
most of these steps for you. This ReadMe is the step-by-step way, so you know
exactly what is on your Mac. Use one or the other, not both.)


WHICH COMPUTER IS THE BRAIN? READ THIS FIRST
--------------------------------------------
The "Brain" is the one computer that runs the panel. It holds all the settings,
pictures, sounds and Processes, and your boards (Arduino Mega and so on) plug into
ITS USB sockets. Every other phone, tablet or computer only opens the panel in a
web browser and needs NOTHING installed.

The Brain can be a Raspberry Pi or this Mac. A Raspberry Pi is the plan for the
finished brewery (small, cheap, always on), but it is not required today: the
panel runs the same on Windows, Mac, Linux or a Pi.

  Your Brain is a Raspberry Pi?
      Then do NOT follow this ReadMe on this Mac. Follow ReadMe_Raspberry_Pi.txt on
      the Pi instead, and plug the boards into the Pi. On this Mac you only open the
      browser and go to  http://skynet.local:8080  (or the Pi's number).
      No Node.js, no drivers and no files are needed on this Mac.

  Your Brain is this Mac?
      Then follow this ReadMe. The boards plug into this Mac (step 4 covers the USB setup), and phones
      and other computers open  http://<this Mac's number>:8080 (step 9).

Use only ONE Brain at a time. Two panels driving the same boards fight each other.


WHAT YOU NEED
-------------
  [ ] A Mac with macOS 12 Monterey or newer (Apple chip M1/M2/M3/M4 or Intel both work),
      with an internet connection for the install.
  [ ] Your Mac password (the one you use to install programs).
  [ ] The panel zip file: Skynet_BrewPanel_<date>.zip  (<date> is the release date,
      for example Skynet_BrewPanel_2026-10-19.zip)
  [ ] The file that comes with this ReadMe:
        Skynet First Install.command   runs once, the first time
      (It is also inside the zip, in BrewPanel/install/mac.)

SOFTWARE YOU WILL INSTALL
  Program            Needed?                        Why
  -----------------  -----------------------------  ----------------------------------
  Node.js (LTS)      YES, always                    The panel runs on it. It must be
                                                     installed and the panel's Terminal
                                                     window must be RUNNING to use it.
  A web browser      YES (you already have Safari)  This is how you see the panel.
  USB board driver   Only for some clone boards     So the Mac can talk to the board.
  Tailscale          Only to use it away from home  Safe remote access from your phone.


HOW TO OPEN TERMINAL (YOU WILL NEED IT A FEW TIMES)
  Press Command + Space, type  Terminal  and press Return. A window with text opens.
  You type a command in it and press Return. Type  exit  and press Return to finish,
  then close the window.


STEP 1. CHECK YOUR macOS VERSION
--------------------------------
  [ ] Click the Apple menu (top left) > "About This Mac".
  [ ] It shows the macOS name and version. It must be macOS 12 (Monterey) or newer.
      If it is older, update the Mac first: Apple menu > System Settings (or System
      Preferences) > Software Update.


STEP 2. MAKE THE FOLDER "Brewing" IN YOUR HOME FOLDER
-----------------------------------------------------
  [ ] Open Finder. In the menu bar click Go > Home. (Your home folder has your name
      and a house icon. It holds Desktop, Documents and Downloads.)
  [ ] Click File > New Folder and name it  Brewing  (capital B, no spaces).


STEP 3. DOWNLOAD AND INSTALL NODE.JS (REQUIRED)
-----------------------------------------------
Node.js is free. The panel is a Node.js program, so it cannot start without it.
The panel needs Node.js version 22.13 or newer. The "LTS" version on the website
is always new enough.

  [ ] Open Safari and go to:   https://nodejs.org/en/download
  [ ] Pick the LTS version (LTS means Long Term Support, the steady one), for macOS.
  [ ] Click "macOS Installer (.pkg)". It works on both Apple chip and Intel Macs.
      The file downloads, named something like  node-v24.x.x.pkg
  [ ] Open your Downloads folder and double-click that .pkg file.
  [ ] Click through the installer:
        Introduction     Continue
        License          Continue, then Agree
        Installation     Install
  [ ] Type your Mac password when asked, then click Install Software.
  [ ] Click Close. (It may ask to move the installer to the Bin/Trash; say yes.)

CHECK THAT NODE.JS WORKS
  [ ] Open Terminal (see above). Type   node -v   and press Return.
      You should see a version like  v24.11.0  or  v22.13.0 . Anything from v22.13
      upward is good.
      If it says "command not found": close Terminal completely (Terminal menu >
      Quit Terminal), open it again and retry. Still not? Run the .pkg again.
  [ ] Type  exit  and press Return, then close the window.


STEP 4. USB BOARD (ONLY IF YOU HAVE ONE)
----------------------------------------
Skip this step if you only want to try the panel (it has a built-in simulator).
A genuine Arduino Mega needs no driver on a Mac. Most clone boards (chip marked
CH340 near the USB plug) also work without one on macOS 12 and newer.
  [ ] Plug the board into the Mac. If you use a USB-C Mac, use a USB-C to USB-B cable
      or an adapter.
  [ ] Open Terminal and type   ls /dev/cu.*   then press Return.
      You should see a line like  /dev/cu.usbmodem14101  or  /dev/cu.wchusbserial1410
      That is your board. Write it down.
  [ ] Only if nothing new appears for a CH340 clone: get the Mac driver from
      https://www.wch-ic.com/downloads/CH34XSER_MAC_ZIP.html , open the zip, run the
      .pkg, and allow it in System Settings > Privacy & Security if the Mac asks.
      Then unplug and replug the board.


STEP 5. PUT THE PANEL IN THE BREWING FOLDER
-------------------------------------------
  [ ] Move Skynet_BrewPanel_<date>.zip into the Brewing folder (drag it there from
      Downloads or a USB stick).
  [ ] Double-click the zip. The Mac unzips it into a folder named BrewPanel.
      (Safari sometimes unzips downloads by itself. If you already have a BrewPanel
      folder, just move that folder into Brewing.)
  [ ] Check: you now have Brewing/BrewPanel in your home folder, and inside it a file
      named server.js
  [ ] Also move "Skynet First Install.command" into the Brewing folder.

  Your Brewing folder should now look like this:
      Brewing/
          BrewPanel/                      (the panel)
          Skynet_BrewPanel_<date>.zip     (you can keep it or delete it)
          Skynet First Install.command


STEP 6. RUN THE FIRST TIME INSTALL FILE
---------------------------------------
  [ ] In Finder, RIGHT-click (or Control-click) "Skynet First Install.command" and
      choose Open. Then click Open again in the box that appears.
      (A plain double-click the first time gives "cannot be opened because it is from
      an unidentified developer". Right-click > Open is how you allow it.)
      On macOS 15 and newer, if there is no Open button: click Done, then go to
      System Settings > Privacy & Security, scroll down, click "Open Anyway" next to
      the file's name, and enter your password.
  [ ] A Terminal window opens and works through 5 steps:
        [1/5] finds the panel
        [2/5] checks Node.js
        [3/5] gets the USB board support from the internet (about a minute)
        [4/5] puts "Skynet Brewer" on your Desktop
        [5/5] starts the panel
  [ ] If the Mac asks: "Do you want the application node to accept incoming network
      connections?", click Allow. This lets your phone reach the panel.
      If it asks whether Terminal may find devices on your local network, click Allow.
  [ ] After a few seconds your browser opens  http://localhost:8080  with the panel.

  The Terminal window IS the panel. Keep it open the whole time you brew.
  Closing it, or pressing Control + C in it, stops the panel.

  If the window shows a red message instead, read it. It tells you which step of this
  ReadMe to go back to.

IF "Skynet First Install.command" WILL NOT OPEN AT ALL ("permission" message)
  [ ] Open Terminal and type exactly this, then press Return:
          chmod +x ~/Brewing/"Skynet First Install.command"
  [ ] Then do step 6 again.


STEP 7. CREATE THE ADMIN ACCOUNT (FIRST TIME ONLY)
--------------------------------------------------
  [ ] The panel asks you to create the admin account. Pick a name and a password
      you will remember.
  [ ] It then shows a RECOVERY CODE. Write it down on paper or save it somewhere
      safe. It is the only way back in if you forget the password.
  [ ] Pick a sample setup to start from (you can change it later in Settings).

  While Settings > Testing mode is on, every new version clears the sign-ins and you
  do this step again. That is on purpose while the panel is being tested.


STEP 8. STARTING THE PANEL EVERY DAY
------------------------------------
  [ ] Double-click "Skynet Brewer" on the Desktop. A Terminal window opens and the
      browser shows the panel after a few seconds.
      The first time, the Mac may ask again: right-click > Open, as in step 6.
  [ ] To stop the panel: click in the Terminal window and press Control + C, or
      close the window.

  "Skynet Brewer" keeps the Mac from going to sleep while the panel runs.
  If you have a MacBook, keep it plugged in while you brew.

  If you ever need to make the everyday start file yourself: run "Skynet First
  Install.command" again. It makes a fresh one on the Desktop.


STEP 9. OPEN THE PANEL ON YOUR PHONE OR ANOTHER COMPUTER AT HOME
----------------------------------------------------------------
  [ ] On the Mac: Apple menu > System Settings > Wi-Fi (or Network), click Details
      next to your network, and find the IP address, for example 192.168.1.60
  [ ] On the phone (on the same home WiFi), open the browser and go to
          http://192.168.1.60:8080        (use your own number)
  [ ] Tip: add it to the iPhone home screen (Share > Add to Home Screen).


STEP 10. USE IT AWAY FROM HOME (OPTIONAL): TAILSCALE
----------------------------------------------------
Never open a port on your router for the panel. Use Tailscale (free for home use).
  [ ] On the Mac: get Tailscale from the Mac App Store (or https://tailscale.com/download),
      open it, and sign in. Allow the VPN setting when the Mac asks.
  [ ] On the phone: install Tailscale from the App Store or Google Play and sign in
      with the SAME account.
  [ ] In the Tailscale app on the phone, find the Mac's name and its 100.x.x.x address.
      Open  http://100.x.x.x:8080  in the phone's browser (use the real number).


PROBLEMS
--------
"Node.js is not installed" or "node: command not found"
    Do step 3 again, then quit Terminal and open it again.
"Node.js ... is too old"
    Install the LTS version from step 3. It replaces the old one.
"The panel is not in .../Brewing/BrewPanel"
    Do step 5 again. The folder must be Brewing/BrewPanel in your HOME folder (not on
    the Desktop or in Downloads), with server.js inside.
"cannot be opened because it is from an unidentified developer"
    Right-click the file > Open > Open (step 6).
The browser says "Safari can't connect to the server"
    The panel takes a few seconds to start. Wait, then reload. Make sure the Terminal
    window is still open.
"EADDRINUSE" or "port 8080 is already in use"
    The panel is already running in another Terminal window. Use that one, or close it.
The phone cannot open the panel
    Same WiFi as the Mac? Terminal window open? Then check System Settings > Network >
    Firewall: either turn it off, or click Options and set "node" to
    "Allow incoming connections".
"Could not get the USB board support"
    Check the internet, then open "Skynet First Install.command" again.
Forgot the password
    On the sign-in page click "Forgot password?" and type the recovery code from step 7.

More help: once the panel is running, the Help tab has the full manual.
