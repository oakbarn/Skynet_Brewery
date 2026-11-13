# Skynet Brew Panel (prototype)

A browser-based brewery Control Panel with screens called **Tabs**, and **Processes**. It runs on Windows, Mac, Linux or a Raspberry Pi, and you use it from any browser on your network: Chrome, Edge, Safari, Firefox or DuckDuckGo, on a PC, Mac, Linux, or even a Stand Alone Pi (not Recommended, and the Pi will need additional Storage and RAM if it is the "Brain" and the Builder of the Panel). Phone and Tablet Browsers can view and control, but are not hardware that can be used to build things because of their size and storage. Phones or Tablets cannot be the "Brain".

### The "Brain"

The **Brain** is the main computer that runs Skynet. It can be a **Windows, Mac or Linux computer** (a desktop, laptop or mini PC) or a **Raspberry Pi 4 or newer**. Most new brewers start with a Windows PC as their Brain, and can move to another Brain later with **☰ Menu > Move Brain**. Everything works the same whichever kind of Brain it is.

- The Brain **holds everything**: your Schemas (Tabs, Devices, Widgets and pipes), your Processes, your pictures and sounds, the brew database, the logins, and the value of every gGlobal.
- The Brain **runs everything**: it runs your Processes and talks to your hardware. The Arduinos, ESP32s and other boards (the PLCs) connect to the Brain by USB, Ethernet or WiFi.
- Every **browser** (on the Brain itself, another computer, a tablet or a phone) is only a window onto the Brain. You can close every browser and the brew carries on.
- For a phone or a browser away from home to reach the panel, the Brain must be running, on Tailscale, and connected to the internet.

```
 Browser(s) ──WiFi/LAN──>  Brew Panel server (Node.js)  ──USB──>  Arduino Mega(s)
                           Processes, item API, SQLite ──Ethernet──> Mega + Ethernet shield, or ESP32 (Ethernet) ──> Mega
                                                        ──WiFi──> ESP32 ──> Mega
```

The server runs the processes and talks to the hardware. Processes keep running when every browser is closed, as long as the "Brain" is powered and On.

## 1. Install and run

**Official Release:** **[Releases > Latest](https://github.com/oakbarn/skynet_brewery/releases/latest)** is always the newest **Official** Skynet, built and sent out by OakBarn Brewery. Every time Skynet starts it checks that its program files are still the ones OakBarn Brewery sent, and shows **✓ Official** on the Menu Bar (or a warning when something was changed). See Help > Official Skynet updates.

**Download:** the newest version is always at **[Releases > Latest](https://github.com/oakbarn/skynet_brewery/releases/latest)**. On Windows download `Skynet_Brewer_Setup_<version>.exe` and double-click it. Every merge makes a new Release with the installer, the panel zip and the ReadMe attached; you don't need a GitHub account.

**The easy way:** each release has installers. On Windows run `Skynet_Brewer_Setup_<date>.exe`; on a Mac open `Install Skynet Brewer.command`; on Linux or a Raspberry Pi run `bash install-skynet-brewer.sh`. They put the panel in `C:\Brewing\BrewPanel` (Windows) or `~/Brewing/BrewPanel`, get Node.js if needed, and add a **Skynet Brewer** shortcut to the Desktop. On a Pi the panel also starts by itself at boot (service `skynet-brewer`). **Updates:** a release zip has no `config/`, `data/`, `media/` or `processes/` (their samples are in `defaults/`, copied in by `lib/seed.js` only into a folder that doesn't exist yet), so unzipping it over a panel or running an installer again never replaces them. On an update the installers ask whether to keep those folders (default: keep all). Full steps: `install/ReadMe.txt` and Help > Installing the panel. To build a release: `bash tools/build-release.sh` (needs NSIS for the Windows installer).

**By hand:**

1. **Install Node.js 22 LTS or newer** from <https://nodejs.org>. On a Raspberry Pi use the NodeSource packages for Node 22. On Windows you can skip this: `install/windows/Skynet_Brewer.bat` installs Node.js by itself (winget, or the LTS .msi from nodejs.org, checked against its SHA-256) when it is missing or too old.
2. **Copy this folder** anywhere, for example `C:\BrewPanel` or `/home/pi/brewpanel`.
3. **Start it.** In that folder run:
   ```
   npm start
   ```
4. **Open the panel.** On the same computer go to `http://localhost:8080`. From a tablet or phone, use `http://<computer's IP address>:8080`.
5. **Create the admin account.** The first time, the panel asks for a user name and password. Then it shows a **recovery code**: save it (copy, download or print), because it is how you get back in if you forget the password. After that everyone signs in. To use the panel away from home, follow [docs/REMOTE_ACCESS.md](docs/REMOTE_ACCESS.md) (login, user roles and Tailscale).

   **Updates keep your logins.** Installing a new version keeps every user, password and the recovery code. They are only removed if you pick **Update the program and reset all users** or **Start Fresh** in the installer (and confirm the warning).

Nothing else needs to be installed for the simulator, processes, API and database.

**For Megas on USB**, run this once in the folder:
```
npm install serialport
```
Then add a device on the **Devices** page. **Scan ports** lists the ports it finds:

| System | Port names |
|---|---|
| Windows | COM3, COM4 … |
| Mac | /dev/tty.usbmodem… |
| Linux / Pi | /dev/ttyACM0 … |

On Linux or a Pi, also run `sudo usermod -aG dialout $USER` once, then log out and back in.

**Start automatically**

- **Raspberry Pi / Linux:** `install/linux/install-skynet-brewer.sh --service` sets it up, or see `docs/brewpanel.service` (systemd).
- **Windows:** a Task Scheduler task "At log on" that runs `node --no-warnings server.js` in this folder.

## 1a. Start from a sample Schema

A Schema is a whole brewery setup: Tabs, Devices, Widgets, pipes and settings. The **3 Vessel 1 Pump** sample is native to the Skynet Panel: it comes with every panel, is kept up to every new Skynet Rule, and is the Schema a new panel starts with. You can load it again later from **Settings > Start from a sample Schema**. A sample loaded later comes in as a new Schema, so the Schema you have is kept. Processes with the same name are backed up before they are replaced.

**More samples:** the **Skynet Sample Schemas Setup** (`Skynet_Sample_Schemas_Setup_<date>.exe`, on the same Releases page) can add additional ones. It has a **tick box for each sample**, so you pick which samples will be imported; there is **no All tick box**. A sample that is available is **never deleted**: if a change is needed, a new sample is added with the same Name but **#2** at the end, and the old one stays as it was.

The samples available to download in the Sample Schemas Setup:

| Sample | What you get |
|---|---|
| **Three vessel, one pump** (in the panel) | HLT, mash tun and boil kettle, one pump, six valves, pipes, three probes and two heaters. |
| *(Sample Schemas Setup)* | None yet. Each sample is added one at a time, once it is brought up to the current Skynet Rules. |

Every sample has a **Recipe** tab (filled by a BeerXML import, including mash steps) and a **Brew Day** panel: `gblV_Brew_Status` holds the step, the red/blue advance switch moves to the next step, timers count down, and the hop alarm sounds for each hop addition. Readings such as pH, gravity and volumes are gGlobals with Database and .API set, so they are logged and sent through the API. Run `BrewDay_Flow` to start; tick **Testing** to run it fast.

**Manual vessel widget.** For kettles with no connection (BrewZilla, DigiBoil and similar), add **Widgets > Manual vessel**. A process sets what it shows (`setpoint`, `heat`, `pump`, `timer`, `message`) and sets `waiting` to make it blink. The brewer taps it to press **Done**, or to type a reading or a volume; the process waits on `confirmed`.

## 2. What is in it

| Area | What it does |
|---|---|
| **Tabs** | Placed Devices (Pumps, Valves, Heating Elements ...), Widgets (Graphics, Text, Values) and Pipes and/or Hoses become your Control Centers on your Star Ship.<br><br>Screens that fill a Browser Pane. Your Computer's Screen resolution is up to you, but Skynet was built on a Windows Computer whose resolution was set to 1920 x 1080. At that resolution there is room for whatever is available on the Build menu. The layout and the number and type of items are up to you.<br><br>Use **Edit layout** to drag, resize, double-click for properties, add Devices and Widgets, and draw pipes. Any Device, Widget, graphic, text or pipe can be **locked** in place: select it and press **🔒 Lock** (or switch on **Lock position** in its properties). A locked item shows a padlock and cannot be dragged or resized until you unlock it; you can still open its properties and tap it as normal. |
| **Picture Widgets** | A screen picture you place anywhere, for example `insp_Pix_Red_Pump_B1`. It can stay **static**, **follow** a Device (shows its *on* image when `MB_36_do_RedPump_B1` is on and its *off* image when it is off), or be changed by a process (`"insp_Pix_Red_Pump_B1" image = "Images/Skynet/Pumps/Pump_Red_Rip_On.png"`). Tapping a picture that follows an output turns that output on/off.<br><br>Some Picture paths can be changed and even updated in a process, while some are fixed and cannot be changed. |
| **Touch screens** | Tap an output to turn it on/off, tap a variable to get a large dialog with − / + buttons and a number pad. Every Device and Widget has **When tapped** (default, none, toggle, dialog, process, tab), a **Tap target**, and **Ask before changing**, which shows large ON / OFF buttons so a bump does not start a pump. In Edit layout, hold a finger on an item for a moment to open its properties, and use **Finish pipe** when drawing pipes. |
| **Looks** | `led` (red digits), `lcd` (blue digits), `dark` (white on black) and `button`. |
| **Pipes** | In Skynet Brewery you can easily add interactive Pipes, Hoses, Pumps and Valves. If they are electro-mechanical, turning them on makes flow run from a source, through the inlet side of a pump, and out into the Pipe or Hose on its outlet side. Click points to draw a pipe along a manifold path (or start and end it on an **IP**, below). You can even add Manual Valves that require a Confirmation that they were set during the Brew Day before proceeding. Design manifolds with Pipes, Hoses, Valves, Pumps, Fittings and so on. A flow is created based on a source and the Open or Closed Valves or End Caps. A Pump can back flow if off (OakBarn Brewery has drained Vessels with gravity it did not want to!). When all of them are on and the Valves and such are set correctly, the Pipes and Hoses show animated flow.<br><br>Background Pictures with Vessels and Manifolds are not needed in Skynet. You have Dynamic Vessel Devices and a working display of a Manifold with Valves and Pumps. A Back Color is generally a better choice than a Background Image, but you could have a Graphic of something you might want to display like a watermark for the background. |
| **Hoses** | **Draw hose** works like Draw pipe, but the hose bends in smooth curves through the points you click. A loose hose end gets a **coupling** (an IP fitting), so a hose always has IPs at both ends; a coupling with one hose on it is an open end that shows flow pouring out.<br><br>In Skynet Brewery Hoses work like they do in your brewery: they are flexible and they move. A hose joins IPs the same way a pipe does: start it on an IP (a pump outlet, a valve end, a vessel port), click the points it curves through, and end it on another IP. Flow runs through a hose from a source, through the inlet side of a pump, and out the other end, the same as a pipe. When the Pumps are on and the Valves and such are set correctly, the Hose shows animated flow. A hose end left loose pours out, like a hose hanging into a fermenter.<br><br>**Quick Disconnect (QD) hoses** are for brewers who move one hose from place to place on Brew Day. Press **Draw QD hose**, start it on the **pump IP** it hangs from (that end stays put), and put its free end on a **Quick Disconnect** (the red star on a valve IP), on any IP, or over the top of a Vessel: every Vessel Device has a large QD Type IP on the Top, so you can hook a QD Hose over the rim. The free end can be moved **at any time**, not only in Edit layout: drag its yellow ring with the right mouse button (hold a finger on a phone or tablet). A Process can also say where it goes next (`Hose_1.connect = Mash_Tun`) and waits until someone has really moved the hose and confirmed it, the same as a Manual Valve. |
| **IP (Initial Point) widget** | A small round marker where a flow starts or ends: a pump outlet, a vessel port, a drain. It is a widget, used only by the app and not tied to any PLC or device port. In **Edit layout** press **Add IP**, drag it onto the spot, and give it a name like *Red pump out* or *MLT in*. With **Draw pipe**, click the start IP, click the bends, then click the end IP: the pipe is joined to both, and its flow always runs from the start IP to the end IP. Move an IP and the pipe ends (and the corner next to them) follow. An IP lights up while a pipe on it is flowing; switch on **Show only while editing** if you only want it as a drawing aid. A pipe's **Starts at IP / Ends at IP** can also be picked in its properties. **Flow only happens on a pipe joined IP to IP**; in Edit layout a red ring marks a pipe end that is not on an IP yet.<br><br>Many Skynet Devices (Pumps, Motorized Valves, etc.) or Widgets (Manual Valves) have pre-built Integral IPs.<br><br>Vessel Devices have a large QD Type IP on the Top so you can dynamically move a QD Hose and hook it over the top. |
| **Fittings (IP widget types)** | Pick the type next to **Add IP**: **IP point**, **Pipe** (straight), **Pipe tee**, **90° elbow**, **45° elbow**, **Pipe cross**, **Manual valve**, **Coupling / hose end** or **Pipe cap**, and set **Turn (degrees)** to point it the right way. Fittings join pipes and flow passes straight through them. A **Manual valve** is app-only: tap it on the screen and pick Open or Closed. A closed one stops flow, and every screen sees the change. A **Pipe cap** has no IP: it closes a pipe end, so nothing flows from or to it. Every IP widget can also have a **Background picture path** and a **Label** shown on screen (position, color, size).<br><br>If you join Pipes at Right Angles, an Elbow is fitted. If you add a Pipe 90 degrees in the middle of another Pipe, a Tee is automatically inserted.<br><br>There are special Device Tees that are Both a Device Temperature Type, but also a Fitting with IPs. |
| **How flow is worked out** | Flow starts at a running pump. From its OUT it goes through pipes, fittings, open valves and pumps that are off until it reaches an IP point (a vessel port or outlet), and into its IN from an IP point the same way. Each pipe on that route shows flow, in the direction the liquid is really moving, whichever way the pipe was drawn. Flow stops at a closed valve or closed manual valve, so a pump pushing into a closed valve shows no flow. A pipe's optional **Only when** list adds extra conditions. A pipe between two plain IP points with an **Only when** list works the old way: it flows, as drawn, while those are all on. |
| **Pipe size** | Every pipe and hose has its own **Size**, in **Inch (SAE)** or **Metric (mm)**: pipes 1/2" (most common), 1", 3/4", 1/4", 2", 3", 4", 5", 6" (15 to 150 mm DN), hoses 1/2", 1", 3/4", 1/4", 2" (13, 25, 19, 6, 50 mm), or **Custom**. New ones start at 1/2". Sizes are drawn in proportion. Each tab's **Pipe size** (Tab… > Pipe size, default 10) is how thick a 1/2" pipe is drawn there; other sizes scale from it. A fitting takes the size of the biggest pipe joined to it, and where two sizes meet a **reducer** (a cone, proportional to both sides) is drawn by itself. |
| **IPs in Edit layout only** | The IP markers of plain IPs, pumps, valves and equipment only show while **Edit layout** is ticked. Fittings, IPs with a picture, and labels set to show stay visible. |
| **Vessel** | Pick **Vessel** next to **Add equipment**. It goes on the **Equipment** tab (always there). Set its **Name**, **Type** (Brew Kettle, HLT, MLT, Mash Tun, Whirlpool), **Label** (starts as the Type) and **Graphic** (starts as `Images/Skynet/Vessels/kettle.svg`). Then switch on **Installed** for each port it has: **Outlet**, **Tangential**, **Thermowell**, **Steam Slayer**, **Sparge** and **CIP**, each with a **Position** (for example Center Bottom, Bottom Left, Right Low, Center High, Lid) and a **Standard** (TC 1.5, NPT 1/2 FPT, BSP 1/2, MM, TC 2, NPT 3/4 FPT, NPT 1/2 MPT). Every list has **Add new ...** at the bottom to add your own; added entries are kept for all vessels. Each port except the thermowell becomes an IP placed near its position, labelled like *Outlet (TC 1.5)*; the thermowell shows as a red **T** mark. A box then lists where the ports went and how to move them: drag an IP to fit the picture, and it stays a port of the vessel and moves with it. Drag the box by its title to get it out of the way, and close it with its button. Apart from its IPs the vessel is display only. Pipes only join IPs on the same tab. |
| **Other equipment** | The same **Add equipment** list has **Plate chiller**, **Chilling coil**, **HERMS coil**, **Trub filter**, **Pipe tee**, **Pipe 90° elbow**, **Pipe 45° elbow** and **Pipe cross**. They work just like the Vessel: Name, Type, Label, Graphic (a sample picture in `samples/`), and ports with Installed, Position and Standard, all lists extendable. All of their openings start installed as IPs. Flow passes through them between ports of the same circuit: a chiller's wort side and water side stay separate, and coils, the filter and the fittings pass flow end to end. Chillers, coils and the filter go on the Equipment tab; fittings go on the tab you are on, above the other Devices and Widgets. The Type and Position choices are placeholders for now. |
| **On / off graphics** | A Digital Output's **Graphic when on** and **Graphic when off** are dropdowns with a small preview: green, red and grey LEDs, a lightning bolt (on and off) and the ball valve pictures. **Add new ...** takes any picture path in your media folders (for example `Images/MyValve_On.png`) and keeps it in the list for every output. |
| **Pick lists with Add new** | Wherever you pick from choices you get a dropdown, and lists that can grow end with **Add new ...**: every picture path (Device and Widget images, on / off graphics, widget and vessel graphics, tab backgrounds; the list offers the sample pictures and every picture already used, with a preview), sound paths, **Units** (°F, °C, %, psi, gal, L, SG, pH ... ), vessel and equipment types, positions and standards, and colors (a **Custom** color is added to the color list). Fixed choices such as text alignment are plain dropdowns. Additions are kept in the settings and offered everywhere. |
| **Switches and dropdowns** | A simple true / false setting is a switch (slide it on or off). A choice between more options is a dropdown. Every color is a dropdown of standard colors (Red, Green, Blue, Yellow, Orange, Purple, Copper, Brown, greys, White, Black) with a swatch; pick **Custom ...** for any other color. |
| **gGlobal List** | A dropdown for a tab. Add > gGlobal > **List (dropdown: Value + Text)**; its settings open with a two-column table: **Value** (a number) and **Text**. Example: `gGList_BrewStatus` with 1 = Mash, 2 = Boil, 3 = Chill. On the tab the dropdown shows Mash, Boil, Chill; picking Boil sets the gGlobal to 2, and that number is what Processes read and trigger on (`if gGList_BrewStatus == 2`). A Process that sets it to 3 makes the dropdown show Chill. **+ Add row** adds a choice, ✕ removes one. |
| **Pumps** | A pump is a **Digital Output** device with **Kind = pump**: it comes with two built-in IP slots that need to be placed when Built. A Pump has 8 IPs that can be set by you, so that the placement and flow with Pipes or Hoses is an easy set up.<br><br>A Pump's head orientation is fixed by the real Pump's orientation, but the directions of them can be set to any of the 8 IPs on a Pump Device (which add a Pipe or Hose, user choice). There is a General Orientation for a Pump Head to be on the Left or Right. The Add list has Common Off the Shelf Brewing Pumps.<br><br>A pump that is off does not block flow: flow can pass through it either way, even backwards, when another pump drives it. |
| **Valves** | A Motorized Valve is a **Digital Output** device that opens and closes, with an IP at each end and no inlet or outlet side: flow goes through it either way while it is open, and a closed valve blocks flow. Click its picture on the Tab to open or close it (one click, no pop-up). The Add list has ready-made Skynet Motorized Valves; pick the **Interface** and **Port** and you're done.<br><br>A **Manual Valve** Widget has IPs on its ends like a Motorized Valve and works the same for flow, but only moves when a user confirms it has been moved (see **Widgets** below).<br><br>A Common Proportional Valve with its properties set can also be chosen. Like a Brewing Pump, it has the same 8 IPs. Proportional Valves have additional properties that can be manipulated on the Browser tab during a Brew Day. These typically include:<br>- **Percent open** (0 to 100 %): tap it on the Tab and type the percent, or a Process sets it. It shows its percent open.<br>- **Flow**: it passes flow whenever it is above 0 %, and blocks flow at 0 %.<br>- **Signal**: the control signal it needs (0-10 V, 4-20 mA or 0-5 V), fed from a PWM Port through a signal module.<br>- **Low or High temperature** (`Valve_L` or `Valve_H`), for room temperature liquid or hot wort.<br>- Its **open** and **closed** pictures (open above 0 %, closed at 0 %). |
| **Devices, Widgets and gGlobals** | `gGlobal`, `digitalOut`, `switch`, `digitalIn`, `temperature`, `analogIn`, `timer`, `alarm`, `label`. **Every Device and Widget can have a background image path**, and on/off Devices and Widgets have separate on and off image paths. |
| **Devices** | Items tied to a pin on a hobby board (Arduino Mega, ESP32 bridge; hobby modules such as relay boards, MAX31865 / MAX31855 / MAX31856 probe boards, ADS1115). **Add** groups them: outputs (digital, PWM %, analog 0-10 V / 4-20 mA), digital inputs (switch, push button that is ON only while held, toggle button that stays ON or OFF until pressed again, pulse button, latch, counter, float / level switch, flow switch, interlock), temperature probes (DS18B20, PT100, PT1000, thermocouple K / J / T and more, NTC thermistor), analog sensors (0-5 V, 0-10 V, 4-20 mA, pressure transducer, level transmitter, pH with two-point calibration), pulse flow meters, vessel scales (HX711 load cells) that show weight and volume with tare, calibration and auto tare when empty, and stepper motors (A4988, DRV8825, TMC2208 / TMC2209, TB6600, DM542 drivers, or a 28BYJ-48 on a ULN2003 board) that a process moves to a position in turns, degrees, mm, mL or % with homing on a switch. The properties dialog shows only the settings the chosen probe or signal needs, plus the live reading for calibration. Wiring and protocol: `docs/DEVICE_PROTOCOL.md`. |
| **Widgets** | App-only items with no board pin: pictures, on-screen switches, timers, alarms, extra label boxes, Messages and so on.<br><br>There are special Widgets like a Manual Valve Widget that has IPs on the ends like a Regular Valve and can be placed for Flow and operates the same as a Motorized Valve Device, including the ability to command it on or off in a Process Code, but only gets moved on Confirmation by a user that it has been moved to the desired position (Open or Closed). There is no additional coding required for the confirmation, as it is built in for Manual Valves.<br><br>**gGlobal Variables are not Widgets** (see **Variables** below).<br><br>**Suggested Names:** every new Widget gets a Suggested Name, `wgt_Type_Label_TabID`, for example `wgt_DT_DateTime_1_BR`. The **Type** is a few letters for the kind of Widget: **PIX** Picture, **TXT** Text, **LBL** Label, **VAL** Value, **TM** Time, **DT** Date Time, **TMR** Timer, **SND** Sound Player, **SW** Switch, **PB** Push Button, **PL** Pulse Button, **LED** LED, **MV** Manual Valve, **TWV** Tap Water Valve, **ALM** Alarm, **GPH** Graph, **PRC** Process Widget, and more. The **Label** is the one you type (a space becomes `~`), and the **TabID** is the Tab it sits on. A taken name gets a number added. You can type a name of your own; it can't be blank.<br><br>**Predictive text:** in the Process editor, Widget names (with your Devices, gGlobals, variables and timers) pop up in the predictive text list as you type. A name also matches on any part after a `_`: typing `DateTime` finds `wgt_DT_DateTime_1_BR`, so you don't need to remember the start of a long name (see **Predictive text** below). |
| **Predictive text** | The Process editor helps you write a Process by offering what can come next, the way a phone keyboard does. As soon as you type a letter, a list pops up under the cursor: at the start of a line the commands (`if`, `wait`, `start`, `new value` ...) with a short note of what each does; anywhere else the names of your variables, timers, gGlobals, Devices, Widgets and Processes. Each letter you type narrows the list, and a name also matches on any part after a `_`. **Tab**, **Enter** or **Right arrow** takes the pick; **Esc** closes the list. The **Predictive text** switch next to **Colors** turns the pop-up off; **Ctrl+Space** or **💡 Suggest** still opens it when you ask. A beginner can write a whole Process just by picking from the list. See Help > Predictive text. |
| **Variables** | gGlobal (processes only. A gGlobal is sent to the database with a Process Command only, and has no .API).<br><br>gGlobals are simply a Variable with Global Scope that can be used between different Processes.<br><br>gGlobal Variables are persistent and non volatile. Their values are stored, even if the Computer is shut down. They will be available with their values after a computer is restarted. They reside with the "Brain" (see **The "Brain"** at the top). |
| **Database** | SQLite file `data/brewlog.db`. Any Device, Widget, gGlobal or Variable can share its value or properties with a Timestamp to an SQLite database.<br><br>Automatic filling of Database inserts is based upon an item's .database attribute.<br><br>Inserts into the database can be:<br>- **Off**: never.<br>- **On demand**: only when you ask (a Process line, **Log now**, or the API).<br>- **On value change**: every time the value changes (at most 10 times a second).<br>- **When Clicked**: each time someone sets it on its Tab.<br>- **When a Process starts**: each time the Process you pick starts.<br>- **At a date and time**: one time, at the date and time you type.<br>- **At clock time**: every day at the clock time you type, like `6:30 PM`.<br>- **Every N ...**: every N milliseconds, seconds, minutes, hours or days, or every `00:05:00`.<br><br>Readings are kept with the time and the item's hidden key, so a renamed item keeps its history. The **Log** page shows the data and downloads CSV. **Database Groups** send a set of items only while a Process has started the Group (`start_db_group Mash`, `stop_db_group Mash`).<br><br>Almost anything can be sent to the Database with the Process Commands `Name.Attribute DBSend`, where the item's (Device, Widget, gGlobal or Variable) .attribute is sent to the Database, and `send_db Name` (the same as `Name DBSend`), which sends its main value, or the attribute picked in **What to send** in its Database and .API box. |
| **.API** | The **.API** attribute lets programs outside Skynet (Node-RED, Home Assistant, MQTT and voice commands like Alexa, Google Home or Siri) see an item. Every Device and Widget with a value has it, in its Properties, Database and .API box (a gGlobal does not):<br>- **Off**: outside programs can't see it (the start).<br>- **Read Only** (Get): outside programs can read it.<br>- **Read & Control** (Get & Put): outside programs can read it and also change it.<br><br>**API_Name** is the name a Voice Command says; it must be Unique. Programs must send the API key from Settings. Without a key, reading works only from your own network (home or Tailscale), and changes are refused. Ten wrong keys from one address shut it out for 15 minutes. Board readings and Manual Valve Widgets are never changed from outside. The addresses are in **4. API** below. |
| **Alarms** | Sound file by path, `.wav` or `.mp3` (preferred).<br><br>**Common Attributes to All** (Skynet and User Alarms). Alarms can have additional attributes only applicable to them.<br>**`.path`** Attribute where a Path can be set in the Process Coding to set the Audio to any audio file (`.wav` or `.mp3` (preferred)). If the path is invalid, there is no Sound. Audio only plays when `AlarmName = On`.<br>**`.label_fore`** and **`.label_back`** Attributes that change the colors of the Label.<br>**`.x`** and **`.y`** Attributes to set Tab Position. **`.h`** and **`.w`** Attributes to set size.<br>**`.visible`** Attribute that is set Automatically: `AlarmName = On` > `AlarmName.visible = True`; `AlarmName = Off` > `AlarmName.visible = False`. `.visible` attributes are hidden from the User and not visible or settable on the Property Dialog or by Process Command.<br>**`.toggle`** attribute on Image to turn off, turn on with Mouse Click. Changes the `.state` Attribute. `.toggle` attributes are hidden from the User and not visible or settable on the Property Dialog or by Process Command.<br>**`.loop`** Attribute: if True, plays the sound then Repeats. If false, plays the sound track only one time.<br>**`.state`** Attribute is the boolean On/Off state of the Widget. Assumed attribute in a Process Command that has no `.attribute`: `AlarmName = On` and `AlarmName.state = On` are the same.<br>**`.skynet_Layer_2`** attribute. A graphic File set as a transparent above the base Graphic (layer Last) and under Layer 1 (Normally the Overlay). A Selection of Skynet Images that can be displayed as Layer 2 on an Alarm. Can be selected on the Property Dialog or by Process Command: `AlarmName.skynet_Layer_2 = "Name of Skynet Picture"`.<br><br>**`.priority`** Attribute (Rule 7.18): when Alarms are On at the same time, only one sound plays at a time, the lowest number wins, the rest wait. Kinds: **(1) Brew Flow**, **(2) Hop Drop**, **(3) Pre-Hop Drop**, **(4) User**, **(5) Sound only**. Two with the same number play in the order they went On. A Hop Alarm can sound by itself at a time on a timer, a Pre-Hop Alarm a set time before it. In a Process: `alm_Hops = true`, `wait alm_Hops == false`. The built-in **SoundPlayer** plays music (`play SoundPlayer`, `stop SoundPlayer`) and pauses for alarms.<br><br>**(1) Brew Flow Alarm.** Skynet Common Attributes plus: **`.fore`** and **`.back`** Attributes that change the colors of a Skynet Brew Flow Alarm. When turned on in a Process, `AlarmName = On` creates a hidden wait command (`wait AlarmName = Off`) in the Process code until the Brew Flow Alarm is false. `.priority = 1`.<br>**(2) Hop Drop Alarm.** Skynet Common Attributes plus: **`.fore`** and **`.back`** Attributes that change the colors of a Skynet Hop Drop Alarm. `.priority = 2`.<br>**(3) Pre-Hop Drop Alarm: Combination Alarm and String Box Widget.** Common Attributes plus: **`.background`** of 3 Choices for a Background WaterMark. The Background images are Skynet and not changeable except by the Process command `AlarmName.background = 3`. **`.fore`** and **`.back`** Attributes that change the colors of the String Text. **`.string`** Attribute to set the Text; accepts embedded Rich Text Codes. **`.playtime`** Attribute, a Time Value in seconds as how long the Pre-Hop Drop Alarm is On. After the Time, the Alarm is off. Clicking it also causes the Alarm to False. `.priority = 3`.<br>**(4) User Alarm.** Common Attributes plus: **`.background`** of 3 Choices for a Background Graphic. The Background images are User supplied and are changeable by Process Editor (`AlarmName.background = 3`) or the Property Dialog. **`.fore`** and **`.back`** Attributes that change the colors of the String Text. **`.string`** Attribute to set the Text; accepts embedded Rich Text Codes. **`.playtime`** Attribute, a Time Value in seconds as how long the User Alarm is On. After the Time, the Alarm is off. Clicking it also causes the Alarm to False. `.priority = 4`.<br><br>**A Browser item where Skynet CANNOT Control:** browsers **only** play sound after one click. So when the panel opens with sound off, Skynet asks **Turn sound on?**; until it is on, a **🔇 Sound is off** button stays on the Tab and **🔊 Turn Sound On** is in the **☰ Menu**. It is needed once in each browser that should sound alarms or other audio files (each computer, tablet or phone, and each browser window). It is **not** needed for each Tab: once it is on, moving between Tabs keeps it on. To have it on every time the panel opens, turn on **☰ Menu > Default > Turn Sound On when starting**; you still click or tap the page once before the first sound, because browsers insist on that. |
| **BeerSmith** | BeerSmith **File > Export > BeerXML**, then **IMPORT** on the **☰ Menu > Recipe** tab. Every hop comes in, with no limit. The **Boil hops** are put into **Hop Groups 1, 2, 3 ...** by drop time (hops that go in at the same time make one Group), with no top number, so 20 or more hops is fine. Skynet uses each Group behind the scenes to sound the hop **warning** (10 minutes before, unless you change it) and the **Drop** at the correct time. The other hop uses (Mash, First Wort, Whirlpool, Dry Hop) are handled behind the scenes too, and are not something you need to see or set. Dry hop time is converted to days. |
| **OneWire probes** | The panel's own **OneWire probe index** (Devices page): each probe gets a number and a name, and temperature probe Devices use the number. Probes are recognised by ROM id, not bus position. To replace a probe, pick the new probe's ROM id for that number; nothing else changes. New probes appear under **OneWire probes seen**. |
| **MQTT and voice** | **Settings > MQTT and voice** shares every Device and Widget whose **.API** is on with an MQTT broker such as Mosquitto on the Pi, for ESP32 boards, Node-RED or Home Assistant. Through Home Assistant you can ask **Alexa, Google Home or Siri** for temperatures, timers and status. Each item's **.API** is the one switch for the web API, MQTT and voice: Off, Read Only, or Read & Control. Starting processes stays off until you tick each one. Setup: `docs/MQTT_AND_VOICE.md`. |
| **Media paths** | Images and sounds are paths to files inside the **media folders** listed in Settings, for example `valves/open.png` or `D:\Brewing\Pics\kettle.png`. Nothing is stored inside the program. For safety, only files inside those folders are served. |
| **Media page** | Add pictures and sounds to the Brew Panel computer (the Raspberry Pi) from any browser, PC or phone: pick files or drag them onto the page, several at once, or a `.zip` of them (unpacked keeping its folders). Looks like Windows File Explorer: folder tree on the left, files with thumbnails on the right (Large icons or Details), an address bar and search. Make folders, drag files onto a folder to move them (Move button on phones), preview pictures, play sounds, copy the path to type into a Device or Widget, rename and delete. Only pictures and sounds are accepted, and only inside the media folders. |
| **SVG pictures** | Every PNG or JPG in a media folder gets an SVG copy next to it (`Pump_On.png` makes `Pump_On.svg`) as soon as it is added, so pictures stay sharp at any size. The original is never changed, and you keep using the `.png` path everywhere. **Settings > Pictures** shows each original beside its SVG: by default the SVG is used for drawing-like pictures and the original for photo-like ones (tracing makes photos blotchy), and you can pick per picture or for all. A hand-made SVG with the same name is used instead and never overwritten. Pictures over 2 megapixels (photo backgrounds) are left as they are. Tracing runs in the background and needs no extra install. |
| **Help tab** | The manual, inside the panel. Everyone can read it; it opens on the page for the screen you came from, and **Search the manual** looks through every page. Admins can **Edit page** (with a live preview), add a **New page** or delete one. Pages are Markdown text files in the `help` folder (the number in front of the name sets the order), so they can also be edited with any text editor. An old copy goes to `help/backups/` on every save. |

## 2a. Variables: gGlobal, and Database and .API on everything

**gGlobal Variable**: Global Scope, Persistent and Non-Volatile. Every process can read and change it, and you can change it on screen.

### Variables

gGlobal Variables are the only Variables with a Global Scope. Most are used only in Processes and have no screen presence other than being listed on the **Variables** page.

### The gGlobal Kinds

Each gGlobal is one of six Kinds, the subclasses of a gGlobal. The Kind is picked when it is made (**☰ Menu > Variables > ➕ New gGlobal**, or a Process line such as `new gV gV_Boil_Time = 60`) and never changes. Its prefix starts the name.

| Kind | Prefix | Notes |
|---|---|---|
| String | `gS_` | Text. |
| Graphic | `gG_` | A picture: Image Path 1, 2 and 3, Background # and Back Colour. A process can swap it: `gG_Burner_Pic = "Images/Skynet/Other_Equipment/BurnerFlame.png"` |
| Value | `gV_` | A number. |
| Boolean | `gB_` | true / false. |
| Time | `gT_` | `00:00:00` |
| Date Time | `gD_` | A date and a time. |

Switch, Push Button, Pulse Button, List, Step and Long String are Widgets, not gGlobals.

gGlobals or Variables are sent to the database with a Process Command only. No need for API.

**Database and .API** (the last box in the Properties of every Device and Widget with a value):

- **Send to the database**: Off, On demand (`send_db Name` in a process, Log now, or the API), On value change (at most 10 a second), When a Process starts, Once, At a date and time, At clock time (every day at a time like `12 AM`), Every N milliseconds / seconds / minutes / hours / days, or every 00:00:00. **What to send** is its main value or one of its attributes.
- Each reading is kept with its time and the item's hidden key, so a renamed item keeps its history.
- **.API**: Off, Get only (outside programs read it) or Get and Put (they read and change it), through `/api/items`, MQTT and voice. Ten wrong API keys from one address shut it out for 15 minutes.

## 3. Processes

Processes are text files in the `processes` folder. You can edit them on the **Processes** page or in any text editor.

**The saved file is read every time a process starts**, so a process can never run an old copy from memory. A process that is running while you edit it is marked "edited since start - stop and start to apply".

Process lines (the name alone is the main value or state, other attributes use a dot):

```
"V_BK_In" = true
"V_BK_In".state = true
```

are equivalent, and either may be used.

```
"V_BK_In".visible = true
```

The attribute `.visible` must be used to set the `.visible` attribute.


```
new value vVCount          new string vSMsg     new bool vB_Testing     new time vT     new datetime vDT
vVCount = 3                vVCount += 1         vSMsg = "Temp " + BK_Temp
V_BK_In = true             gblS_Msg = vSMsg     tm_Whirlpool = 00:20:00     alm_Hops = true
my_Widget.visible = false  tm_Mash.countdown = true     tm_Mash.label = "Mash"
if vVCount > 2 && Pump_Red == true
elseif ...
else
endif
[Label]                    goto "Label"
step "Mash in"             (a numbered section: 1.00000, 1.00001 ... renumbered on every save)
sleep 1000                 wait BK_Temp <= 154
start "Other_Script"       stop "Other_Script"     start "tm_Whirlpool"   reset "tm_Whirlpool"   start "alm_Hops"
restart Other_Script       restart                 (stop, clear its memory, start again; on its own = this Process. See Help > Restarting Processes)
print "text"               show tab "Brewery"   (or show workspace)     send_db gGV_Kettle_Temp   (sends its reading to the database now)
vDT = now                  vT = vDT2 - vDT  (time between)   vDT = vDT + 00:10:00
BF.precision = 4           "Euler's number" = 2.718   (quoted variable names work)
```

Names can have no spaces, and this is enforced when a Device, Widget or Template is created. Processes have automatic line numbers. There is a Process command to go to a line number, similar to going to a section:

```
234  some Code
235  [My New Section]

goto "My New Section"
```

or

```
goLine 235
```

are equivalent. The goLine number follows its line when lines are added or taken out. Skynet does this in the Background and needs no user input.

Processes have a class (Flow, Sub, Repeat, Looper) that decides how their steps are numbered, and the editor fills in names and attributes as you type. Details: Help > Process language and steps (`help/22-process-language.md`).

**Included samples**

| Process | What it does |
|---|---|
| `Demo_Transfer_HLT_to_MLT` | Opens valves and runs the pump; watch the flow. |
| `Demo_Hop_Stand` | 154 °F, 20-minute stand; 20 seconds when Testing is on. |
| `Demo_Heat_HLT` | Heats the simulated HLT, then sounds the alarm. |
| `Hops_Order_Boil` | Orders the imported boil hops into groups. |
| `looper_LogTemps` | Copies the kettle temperature into a logged gGlobal. |
| `Demo_Variables` | Uses each gGlobal kind; waits for the Ping button. |
| `Demo_Mash_Steps` | A 60-minute mash with a pH check at 10 and a stir at 30; made for trying simulation mode. |

**Simulation mode** (Settings > Simulation, admins): every board is replaced by the simulator so no real hardware is switched, a yellow bar shows on every screen, and time can run up to 120× faster, skip ahead by hand, skip to the next event, or skip by itself from a Time jumps table. The Process timeline works out when each step of a Process happens. See the Help page *Simulation mode*.

## 3a. Schema.json (admins only)

The **Schema.json** page shows the whole setup file (`config/brewery.json`) as text. Operators and viewers do not see it and cannot reach it.

- **A backup copy is made every time a change is saved**, named after the Schema, `Name_yyyymmddThhmm.BacUp`. A backup never overwrites another. Skynet does this in the Background and needs no user input.
- **Find** (Ctrl+F) and **Replace** (Ctrl+H) work.
- **Check** looks for mistakes and jumps to the line. **Save** checks first and refuses a file the panel cannot load, so a typo cannot break the panel. Saving stops running Processes and reconnects the boards.
- **Backups** lists every copy. **Open** shows one in the editor without saving it; **Restore** puts it back straight away.
- **Save as .json file** saves a Schema (its tabs, devices, widgets, pipes and Equipment Profile drawing, no logins or panel settings) to this computer. The file is named after the Schema version, `Name_yyyymmddThhmm.json` (ISO 8601).

## 4. API (for Node-RED or other programs)

Any Device or Widget whose **.API** setting is on (its Properties, Database and .API box) is in the API: **Get only** = read, **Get and Put** = read and change. Programs must send the API key from Settings in the header `X-API-Key: <key>` (or `?key=<key>`). Without a key, reading works only from your own network (home or Tailscale), and changes are refused. Ten wrong keys from one address shut it out for 15 minutes. A signed-in browser can use the API too: viewers read, operators and admins also change. Board readings and Manual Valve Widgets are never changed from outside.

| Request | Does |
|---|---|
| `GET /api/items` | Everything with .API on, with its main value |
| `GET /api/items/<name>` | One item and all its attributes |
| `GET /api/items/<name>/<attribute>` | One attribute |
| `PUT /api/items/<name>` with body `{"value": 152}` or just `152` | Change its main value (Get and Put only) |
| `PUT /api/items/<name>` with body `{"target": 152}` | Change attributes |
| `POST /api/items` with body `{"name1": v1, "name2": v2}` | Change several |
| `POST /api/import/beerxml` with the XML file as the body | Import a recipe |
| `POST /api/log/<name>` | Send its reading to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values (from/to in epoch ms; older names of the item included) |
| `GET /api/log.csv?...` | Same as CSV |

## 5. Files

```
server.js            the server
lib/                 engine (Processes), store (elements), logger (SQLite), hardware, beerxml, mqtt
public/              the browser app
config/brewery.json  the loaded Schema (tabs, elements, graphics, devices) and the panel settings (edited by the app; a .bak is kept)
config/schemas/      one file per Schema (picked in the Schema dropdown), its saved values, daily and by-hand backups
config/equipment/    Equipment Profiles (☰ Menu > Equipment Profile), used by any Schema
config/profiles/     Mash, Boil, Tab Background and Valve Profiles (☰ Menu)
processes/*.txt      Processes
media/Images/        every picture (backgrounds too, e.g. media/Images/brewery_main.png); the
                     File Move page copies a whole folder from your computer
media/sounds/        alarm and timer sounds
media/notes/         text files read by Long String gGlobals
data/                state.json (variable values kept over restarts), brewlog.db (the database),
                     users.json (accounts, passwords are hashed) and sessions.json (who is signed in)
tools/               reset-password.js (forgotten password)
help/                the manual shown on the Help tab, one Markdown file per page
firmware/            Mega_BrewPanel.ino (Mega: USB or Ethernet shield), ESP32_Bridge.ino (WiFi or Ethernet bridge)
docs/                DEVICE_PROTOCOL.md, MQTT_AND_VOICE.md, brewpanel.service, REMOTE_ACCESS.md (login and Tailscale)
```

## 6. Prototype limits

- **Remote use:** only through Tailscale (see docs/REMOTE_ACCESS.md). Never port-forward the panel on your router.
- **Browser testing:** tested in Chromium (Chrome/Edge engine), not yet in Safari or Firefox.
- **Hardware testing:** the hardware layer is tested with the simulator and a simulated ESP32. It is not yet tested with a real Mega. The firmware sketches have not been compiled yet.
- **Not built yet:** graphs on the Log page and PWM/analog outputs.
- **Hardware safety still comes first.** Keep hard-wired safety devices: burner flame safety, float switches and emergency stop.
