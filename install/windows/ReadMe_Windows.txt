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
      Then follow this ReadMe. The boards plug into this PC (step 4 covers the USB driver), and phones
      and other computers open  http://<this PC's number>:8080 (step 11).

Use only ONE Brain at a time. Two panels driving the same boards fight each other.


WHAT YOU NEED
-------------
  [ ] A Windows 10 or 11 PC (64-bit), with an internet connection for the install.
  [ ] An account on the PC that can install programs (an "administrator" account).
      Most home PCs are set up this way.
  [ ] The panel zip file: Skynet_BrewPanel_<date>.zip  (<date> is the release date,
      for example Skynet_BrewPanel_2026-10-19.zip)
  [ ] These two files that come with this ReadMe:
        Skynet_First_Install.bat   runs once, the first time
        Skynet_Brewer.bat          starts the panel every day
      (Both are also inside the zip, in BrewPanel\install\windows.)

SOFTWARE YOU WILL INSTALL
  Program            Needed?                       Why
  -----------------  ----------------------------  -----------------------------------
  Node.js (LTS)      YES, always                   The panel runs on it. It must be
                                                    installed and the panel's black
                                                    window must be RUNNING to use it.
  A web browser      YES (you already have Edge)   This is how you see the panel.
  USB board driver   Only with an Arduino board    So Windows can talk to the board.
  Tailscale          Only to use it away from home Safe remote access from your phone.


STEP 1. MAKE SURE WINDOWS IS 64-BIT
-----------------------------------
  [ ] Click Start, type  about  and open "About your PC".
  [ ] Under "Device specifications", find "System type".
      It should say "64-bit operating system, x64-based processor".
      If it says "ARM-based processor", choose ARM64 in step 3 instead of x64.


STEP 2. MAKE THE FOLDER C:\Brewing
----------------------------------
  [ ] Open File Explorer (the yellow folder on the taskbar, or press Windows key + E).
  [ ] On the left click "This PC", then double-click "Local Disk (C:)".
  [ ] Right-click an empty spot, choose New > Folder, and name it  Brewing
      (capital B, no spaces). You now have the folder C:\Brewing


STEP 3. DOWNLOAD AND INSTALL NODE.JS (REQUIRED)
-----------------------------------------------
Node.js is free. The panel is a Node.js program, so it cannot start without it.
The panel needs Node.js version 22.13 or newer. The "LTS" version on the website
is always new enough.

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


STEP 4. USB DRIVER FOR YOUR ARDUINO BOARD (ONLY IF YOU HAVE ONE)
----------------------------------------------------------------
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
        [2/5] checks Node.js
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


STEP 8. CREATE THE ADMIN ACCOUNT (FIRST TIME ONLY)
--------------------------------------------------
  [ ] The panel asks you to create the admin account. Pick a name and a password
      you will remember.
  [ ] It then shows a RECOVERY CODE. Write it down on paper or save it somewhere
      safe. It is the only way back in if you forget the password.
  [ ] Pick a sample setup to start from (you can change it later in Settings).

  While Settings > Testing mode is on, every new version clears the sign-ins and you
  do this step again. That is on purpose while the panel is being tested.


STEP 9. STARTING THE PANEL EVERY DAY
------------------------------------
  [ ] Double-click "Skynet Brewer" on the Desktop. The black window opens and the
      browser shows the panel after a few seconds.
  [ ] If the shortcut is not on the Desktop, make it: open C:\Brewing, right-click
      Skynet_Brewer.bat, choose "Show more options" > "Send to" >
      "Desktop (create shortcut)". Rename the shortcut to  Skynet Brewer

  What Skynet_Brewer.bat contains (in case you need to make it in Notepad):

        :: MIT License Granted
        :: Copyright (c) OakBarn Brewery 2026
        @echo off
        title Skynet Brewery Panel
        cd /d C:\Brewing\BrewPanel
        if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
        where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org and try again. & pause & exit /b)
        start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"
        npm start
        pause

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
"'node' is not recognized" or "Node.js is not installed"
    Do step 3 again, then restart the PC.
"Node.js ... is too old"
    Install the LTS version from step 3. It replaces the old one.
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
