# OakBarn Brew Panel (prototype)

A browser-based brewery control panel with BruControl-style screens (called **Tabs**; BruControl calls them workspaces) and scripts. It runs on Windows, Mac, Linux or a Raspberry Pi, and you use it from any browser on your network: Chrome, Edge, Safari, Firefox or DuckDuckGo, on a PC, tablet or phone.

```
 Browser(s) ──WiFi/LAN──>  Brew Panel server (Node.js)  ──USB──>  Arduino Mega(s)
                           scripts, vAPI API,  SQLite ──Ethernet──> Mega + Ethernet shield, or ESP32 (Ethernet) ──> Mega
                                                        ──WiFi──> ESP32 ──> Mega
```

The server runs the scripts and talks to the hardware. Scripts keep running when every browser is closed.

## 1. Install and run

1. **Install Node.js 22 LTS or newer** from <https://nodejs.org>. On a Raspberry Pi use the NodeSource packages for Node 22.
2. **Copy this folder** anywhere, for example `C:\BrewPanel` or `/home/pi/brewpanel`.
3. **Start it.** In that folder run:
   ```
   npm start
   ```
4. **Open the panel.** On the same computer go to `http://localhost:8080`. From a tablet or phone, use `http://<computer's IP address>:8080`.
5. **Create the admin account.** The first time, the panel asks for a user name and password. Then it shows a **recovery code**: save it (copy, download or print), because it is how you get back in if you forget the password. After that everyone signs in. To use the panel away from home, follow [docs/REMOTE_ACCESS.md](docs/REMOTE_ACCESS.md) (login, user roles and Tailscale).

   **Testing mode (on for now):** each time a new version of the panel is installed, all users, sign-ins and the recovery code are removed, so you start again at step 5. Brew data, logs and settings are kept. Once you use the panel for real, turn it off in **Settings > Testing mode** (or put `"resetLoginsOnUpdate": false` in `config/brewery.json`).

Nothing else needs to be installed for the simulator, scripts, API and database.

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

- **Raspberry Pi / Linux:** see `docs/brewpanel.service` (systemd).
- **Windows:** a Task Scheduler task "At log on" that runs `node --no-warnings server.js` in this folder.

## 1a. Start from a sample

The first time the panel opens it offers four ready-made setups. You can load one later from **Settings > Start from a sample**. Loading one replaces your Tabs, elements, pipes and devices; your old setup is saved first in `config/backups/`. Scripts with the same name are backed up before they are replaced.

| Sample | What you get |
|---|---|
| **OakBarn BruControl** | Fritz's BruControl configuration, imported with every board on the simulator. |
| **Two vessel, one pump** | Kettle and mash tun, one pump, five valves, pipes, two probes, a kettle heater and a chiller. |
| **Three vessel, one pump** | HLT, mash tun and boil kettle, one pump, six valves, pipes, three probes and two heaters. |
| **BrewZilla brew day** | No hardware. A brew day flow for a BrewZilla and DigiBoil with step timers, hop drop warnings and readings you type in. |

Every sample has a **Recipe** tab (filled by a BeerXML import, including mash steps) and a **Brew Day** panel that works like BruControl: `gblV_Brew_Status` holds the step, the red/blue advance switch moves to the next step, timers count down, and the hop alarm sounds for each hop addition. Readings such as pH, gravity and volumes are vAPI fields, so they are logged and sent through the API. Run `BrewDay_Flow` to start; tick **Testing** to run it fast.

**Manual vessel widget.** For kettles with no connection (BrewZilla, DigiBoil and similar), add **Widgets > Manual vessel**. A script sets what it shows (`setpoint`, `heat`, `pump`, `timer`, `message`) and sets `waiting` to make it blink. The brewer taps it to press **Done**, or to type a reading or a volume; the script waits on `confirmed`.

## 2. What is in it

| Area | What it does |
|---|---|
| **Tabs** | Screens with a background image (a path) that fills the tab or sits at a set place and size (room for a message panel on the left), placed elements, graphics, text and **pipes**. Use **Edit layout** to drag, resize, double-click for properties, add elements, and draw pipes. Any element, graphic, text or pipe can be **locked** in place: select it and press **🔒 Lock** (or switch on **Lock position** in its properties). A locked item shows a padlock and cannot be dragged or resized until you unlock it; you can still open its properties and tap it as normal. |
| **Picture elements** | A screen picture you place anywhere, for example `insp_Pix_Red_Pump_B1`. It can stay **static**, **follow** another element (shows its *on* image when `MB_36_do_RedPump_B1` is on and its *off* image when it is off), or be changed by a script (`"insp_Pix_Red_Pump_B1" image = "oakbarn/Pump_Red_Rip_On.png"`). Tapping a picture that follows an output turns that output on/off. |
| **Touch screens** | Tap an output to turn it on/off, tap a variable to get a large dialog with − / + buttons and a number pad. Every element has **When tapped** (default, none, toggle, dialog, script, tab), a **Tap target**, and **Ask before changing**, which shows large ON / OFF buttons so a bump does not start a pump. In Edit layout, hold a finger on an item for a moment to open its properties, and use **Finish pipe** when drawing pipes. |
| **Looks** | `led` (red digits), `lcd` (blue digits), `dark` (white on black, like the BruControl message panels) and `button`. |
| **Pipes** | Click points to draw a line along a manifold path (or start and end it on an **IP**, below). Pick the valves and pump it needs in **Flow when**. When all of them are on, the pipe shows animated flow. If your background already shows the piping, turn off **Show pipe when not flowing**: then only the moving flow appears. |
| **IP (Initial Point) widget** | A small round marker where a flow starts or ends: a pump outlet, a vessel port, a drain. It is a widget, used only by the app and not tied to any PLC or device port. In **Edit layout** press **Add IP**, drag it onto the spot, and give it a name like *Red pump out* or *MLT in*. With **Draw pipe**, click the start IP, click the bends, then click the end IP: the pipe is joined to both, and its flow always runs from the start IP to the end IP. Move an IP and the pipe ends (and the corner next to them) follow. An IP lights up while a pipe on it is flowing; switch on **Show only while editing** if you only want it as a drawing aid. A pipe's **Starts at IP / Ends at IP** can also be picked in its properties. **Flow only happens on a pipe joined IP to IP**; in Edit layout a red ring marks a pipe end that is not on an IP yet. |
| **Fittings (IP widget types)** | Pick the type next to **Add IP**: **IP point**, **Pipe** (straight), **Pipe tee**, **90° elbow**, **45° elbow**, **Pipe cross**, **Manual valve** or **Pipe cap**, and set **Turn (degrees)** to point it the right way. Fittings join pipes and flow passes straight through them. A **Manual valve** is app-only: tap it on the screen and pick Open or Closed. A closed one stops flow, and every screen sees the change. A **Pipe cap** has no IP: it closes a pipe end, so nothing flows from or to it. Every IP widget can also have a **Background picture path** and a **Label** shown on screen (position, color, size). |
| **How flow is worked out** | Flow starts at a running pump. From its OUT it goes through pipes, fittings, open valves and pumps that are off until it reaches an IP point (a vessel port or outlet), and into its IN from an IP point the same way. Each pipe on that route shows flow, in the direction the liquid is really moving, whichever way the pipe was drawn. Flow stops at a closed valve or closed manual valve, so a pump pushing into a closed valve shows no flow. A pipe's optional **Only when** list adds extra conditions. A pipe between two plain IP points with an **Only when** list works the old way: it flows, as drawn, while those are all on. |
| **Pipe size** | Each tab has one **Pipe size** (Tab… > Pipe size, default 10). Every pipe and every fitting on that tab (straight pipe, tee, elbows, cross, cap, manual valve) is drawn from it, so they always match: change it and they all grow or shrink together. Fittings stay centred on their IP when the size changes. Devices with IPs scale with it too: pumps, valves, proportional valves and inline sensors (a **flow meter**, or a digital / analog input with **Inline in a pipe** switched on, such as a flow switch). Their Width / Height are their size at pipe size 10; at pipe size 20 they are drawn twice as big, about their centre. Inline sensors have IN and OUT IPs and always let flow through. |
| **Vessel** | Pick **Vessel** next to **Add equipment**. It goes on the **Equipment** tab (always there). Set its **Name**, **Type** (Brew Kettle, HLT, MLT, Mash Tun, Whirlpool), **Label** (starts as the Type) and **Graphic** (starts as `samples/kettle.svg`). Then switch on **Installed** for each port it has: **Outlet**, **Tangential**, **Thermowell**, **Steam Slayer**, **Sparge** and **CIP**, each with a **Position** (for example Center Bottom, Bottom Left, Right Low, Center High, Lid) and a **Standard** (TC 1.5, NPT 1/2 FPT, BSP 1/2, MM, TC 2, NPT 3/4 FPT, NPT 1/2 MPT). Every list has **Add new ...** at the bottom to add your own; added entries are kept for all vessels. Each port except the thermowell becomes an IP placed near its position, labelled like *Outlet (TC 1.5)*; the thermowell shows as a red **T** mark. A box then lists where the ports went and how to move them: drag an IP to fit the picture, and it stays a port of the vessel and moves with it. Drag the box by its title to get it out of the way, and close it with its button. Apart from its IPs the vessel is display only. Pipes only join IPs on the same tab. |
| **Other equipment** | The same **Add equipment** list has **Plate chiller**, **Chilling coil**, **HERMS coil**, **Trub filter**, **Pipe tee**, **Pipe 90° elbow**, **Pipe 45° elbow** and **Pipe cross**. They work just like the Vessel: Name, Type, Label, Graphic (a sample picture in `samples/`), and ports with Installed, Position and Standard, all lists extendable. All of their openings start installed as IPs. Flow passes through them between ports of the same circuit: a chiller's wort side and water side stay separate, and coils, the filter and the fittings pass flow end to end. Chillers, coils and the filter go on the Equipment tab; fittings go on the tab you are on, above the other elements. The Type and Position choices are placeholders for now. |
| **On / off graphics** | A Digital Output's **Graphic when on** and **Graphic when off** are dropdowns with a small preview: green, red and grey LEDs, a lightning bolt (on and off) and the ball valve pictures. **Add new ...** takes any picture path in your media folders (for example `oakbarn/MyValve_On.png`) and keeps it in the list for every output. |
| **Pick lists with Add new** | Wherever you pick from choices you get a dropdown, and lists that can grow end with **Add new ...**: every picture path (element images, on / off graphics, widget and vessel graphics, tab backgrounds; the list offers the sample pictures and every picture already used, with a preview), sound paths, **Units** (°F, °C, %, psi, gal, L, SG, pH ... ), vessel and equipment types, positions and standards, and colors (a **Custom** color is added to the color list). Fixed choices such as text alignment are plain dropdowns. Additions are kept in the settings and offered everywhere. |
| **Switches and dropdowns** | A simple true / false setting is a switch (slide it on or off). A choice between more options is a dropdown. Every color is a dropdown of standard colors (Red, Green, Blue, Yellow, Orange, Purple, Copper, Brown, greys, White, Black) with a swatch; pick **Custom ...** for any other color. |
| **vKonstant List** | A dropdown for a tab. Add element > vKonstant > **List (dropdown: Value + Text)**; its settings open with a two-column table: **Value** (a number) and **Text**. Example: `vKList_BrewStatus` with 1 = Mash, 2 = Boil, 3 = Chill. On the tab the dropdown shows Mash, Boil, Chill; picking Boil sets the vKonstant to 2, and that number is what Processes read and trigger on (`if "vKList_BrewStatus" value == 2`). A Process that sets it to 3 makes the dropdown show Chill. **+ Add row** adds a choice, ✕ removes one. |
| **Older vessel widgets** | Pick the kind next to **Add equipment**: **Electric heated vessel**, **Gas heated vessel**, **Unheated mash tun**, **Cooling coil** or **Plate chiller**. The coil has IN and OUT IPs built in; the plate chiller has WORT IN / WORT OUT and WATER IN / WATER OUT, two circuits that never mix. Flow passes through them. Each has a **Background picture path** (empty = a plain drawn vessel), a **Label** with **position** (top, corners, center, bottom, above or below), **color**, **size** and **Show label**, and an optional **Heater** (the element or burner output): its heating strip or flames light up while that output is on. Drop an IP point on a vessel and it becomes one of its ports: it moves with the vessel, and pipes on it follow. |
| **Pumps and valves** | A pump is a **Digital Output** device with **Kind = pump**: it comes with two built-in IPs, **IN** and **OUT**. A valve is a Digital Output with **Kind = valve**: it has a plain IP at each end, with no inlet or outlet side, and flow goes through it either way while it is open. The IPs sit on the long sides of its picture. Importing a BruControl file makes every output whose name starts with **VGC** a valve. A pump's head orientation is fixed, so there is no setting for it: use a picture that shows it. The **Add element** list has ready-made **Pump** and **Valve** Device Outputs with this already set: a Pump has IN on the left and OUT on the right, the red pump on/off pictures, tap = toggle and **Ask before changing** on; a Valve has one IP on top and one on the bottom, the ball-valve open/closed pictures, tap = toggle (no question), and its name and text hidden. Pick the **Device** and **Pin / channel** and you're done; anything else can be changed. A **Proportional valve** (also in the list) opens 0-100 %: it has an IP at each end like a valve, shows its percent open, passes flow whenever it is above 0 %, and tapping it lets you type the percent. It is meant to be an analog output (0-10 V or 4-20 mA, or PWM); until those output types are installed it is a vKonstant value holding the percent, which scripts can set too. Start or end a pipe on them like any other IP. A closed valve blocks flow. A pump that is off does not: flow can pass through it either way, even backwards, when another pump drives it. |
| **Elements** | `vKonstant`, `vAPI`, `shared`, `digitalOut`, `switch`, `digitalIn`, `temperature`, `analogIn`, `timer`, `alarm`, `label`. **Every element can have a background image path**, and on/off elements have separate on and off image paths. |
| **Devices** | Elements tied to a pin on a hobby board (Arduino Mega, ESP32 bridge; hobby modules such as relay boards, MAX31865 / MAX31855 / MAX31856 probe boards, ADS1115). **Add element** groups them: outputs (digital, PWM %, analog 0-10 V / 4-20 mA), digital inputs (switch, float / level switch, flow switch, interlock), temperature probes (DS18B20, PT100, PT1000, thermocouple K / J / T and more, NTC thermistor), analog sensors (0-5 V, 0-10 V, 4-20 mA, pressure transducer, level transmitter, pH with two-point calibration), pulse flow meters, and vessel scales (HX711 load cells) that show weight and volume with tare, calibration and auto tare when empty. The properties dialog shows only the settings the chosen probe or signal needs, plus the live reading for calibration. Wiring and protocol: `docs/DEVICE_PROTOCOL.md`. |
| **Widgets** | App-only items with no board pin: pictures, vKonstant / vAPI / shared variables, on-screen switches, timers, alarms, labels. |
| **Variables** | vKonstant (scripts and screen), vAPI (also the API and the database), shared (scripts). The old **Global** class is retired, see below. |
| **Shared variables** | Readable and writable by every script, but **never in the API or the database**. Use them to pass values between scripts. |
| **Database** | SQLite file `data/brewlog.db`. Each vAPI has a trigger: **Off, On demand, Once, Every N seconds, Every N hours, Every N days**. The **Log** page shows the data and downloads CSV. |
| **Alarms** | Sound file by path, `.wav` or `.mp3`. Browsers only play sound after one click, so press **Enable sound** on each screen that should sound alarms. |
| **BeerSmith** | BeerSmith **File > Export > BeerXML**, then the **Import** page (or POST to the API). Hop uses become your group codes: Mash -333, First Wort -444, boil hop at full boil time -888, other boil hops 919, Aroma/Whirlpool -999, Dry Hop -111, unused slot 0. Dry hop time is converted to days. The mapping is editable in **Settings**. |
| **OneWire probes** | The panel's own **OneWire probe index** (Devices page): each probe gets a number and a name, and temperature elements use the number. Probes are recognised by ROM id, not bus position. To replace a probe, pick the new probe's ROM id for that number; nothing else changes. New probes appear under **OneWire probes seen**. |
| **Media paths** | Images and sounds are paths to files inside the **media folders** listed in Settings, for example `valves/open.png` or `D:\Brewing\Pics\kettle.png`. Nothing is stored inside the program. For safety, only files inside those folders are served. |
| **Media page** | Add pictures and sounds to the Brew Panel computer (the Raspberry Pi) from any browser, PC or phone: pick files or drag them onto the page, several at once, or a `.zip` of them (unpacked keeping its folders, handy for the BruControl Media folder). Looks like Windows File Explorer: folder tree on the left, files with thumbnails on the right (Large icons or Details), an address bar and search. Make folders, drag files onto a folder to move them (Move button on phones), preview pictures, play sounds, copy the path to type into an element, rename and delete. Only pictures and sounds are accepted, and only inside the media folders. |
| **SVG pictures** | Every PNG or JPG in a media folder gets an SVG copy next to it (`Pump_On.png` makes `Pump_On.svg`) as soon as it is added, so pictures stay sharp at any size. The original is never changed, so BruControl can still use it, and you keep using the `.png` path everywhere. **Settings > Pictures** shows each original beside its SVG: by default the SVG is used for drawing-like pictures and the original for photo-like ones (tracing makes photos blotchy), and you can pick per picture or for all. A hand-made SVG with the same name is used instead and never overwritten. Pictures over 2 megapixels (photo backgrounds) are left as they are. Tracing runs in the background and needs no extra install. |
| **Help tab** | The manual, inside the panel. Everyone can read it; it opens on the page for the screen you came from, and **Search the manual** looks through every page. Admins can **Edit page** (with a live preview), add a **New page** or delete one. Pages are Markdown text files in the `help` folder (the number in front of the name sets the order), so they can also be edited with any text editor. An old copy goes to `help/backups/` on every save. |

## 2a. Variables: vKonstant and vAPI

Add them in **Workspaces > Edit layout > Add element** (they are listed by kind with their suggested name prefix). The **Variables** page lists all of them. The prefixes are hints only; any name works. The **Variables Demo** workspace and the `Demo_Variables` script show every kind.

**vKonstant**: every script can read and change it, and you can change it on screen. It is never in the API or the database.

| Kind | Prefix | Notes |
|---|---|---|
| Graphic | `vK_` | The value is an image path inside a media folder. Shows the picture; a script can swap it: `"vK_Burner_Pic" value = "oakbarn/BurnerFlame.png"` |
| String | `vKS_` | |
| Long String | `vKL_` | Linked to a text file inside a media folder (a network drive works once it is added under Settings > Media folders). Editing the file updates the panel within a second; setting the value from the panel or a script saves the file. `"vKL_Notes" file = "notes/other.txt"` links another file. |
| Value | `vKV_` | |
| Time | `vKT_` | `00:00:00` |
| Date Time | `vKDT_` | |
| Boolean | `vKB_` | |
| Switch | `vKSW_` | Boolean shown as a slider; tap to flip it. |
| Push Button | `vKPB_` | LED button that is ON only while held. If the screen holding it closes or loses WiFi, it lets go by itself within 1.5 seconds. |
| Momentary Button | `vKMB_` | Tap (or a script sets it true): true for 100 ms, then off. `wait "vKMB_Go" value == true` always catches it. |

**vAPI**: scripts, the API (`/api/vapi`; the old `/api/globals` address still works) and the database. Kinds: String `vAS_`, Value `vAV_`, Time `vAT_`, Date Time `vADT_`, Boolean `vAB_`.

**Database trigger** (Variables page > Change…, for vAPI):

- **On demand only**: pick a script; the value is written when that script starts, and at no other time.
- **Every N** milliseconds, seconds, minutes, hours or days (whole numbers), or **every 00:00:00**. Fastest is 100 ms.
- **At clock time** (optional): lines the writes up with the clock, e.g. every 1 day at `12 AM`, or every 6 hours at `1 AM` (1 AM, 7 AM, 1 PM, 7 PM). Accepts `12 AM`, `6:30 PM` or `18:30`.
- Off, Manual (`log` line or Log now), and Once still work as before.

**The old Global class is retired.** Globals move by their name, on start-up for a saved setup and in the BruControl import:

- `gbl…` becomes a **vKonstant** of the same kind with the **same name**, so the names still match BruControl for now.
- `RP_…` becomes a **vAPI** of the same kind, renamed `RP_` → `vA_` in the setup and in every script (`RP_v_Pitch_Temp` → `vA_v_Pitch_Temp`).
- `x…` is **deleted**. Scripts or items still using one are listed with line numbers.
- `glb…` was a typo for `gbl…`: renamed `glb` → `gbl` (setup and scripts), then a vKonstant like the rest.
- `DX_gblV_…` becomes a **vAPI**, renamed `DX_gblV_` → `vA_` in the setup and every script.
- `insp_…` is **deleted** like `x…` (scripts still using one are listed).
- Any other name becomes a vAPI with the same name (it works exactly like the Global did) and is listed so it can be sorted later.

On start-up the old setup is copied to `config/backups/brewery-before-globals-<date>.json`, each changed script keeps a `.before-globals.bak` copy, and the list of what moved is in `data/globals-retired.txt` (and on the Scripts page console). A vKonstant is never written to the database, so a `gbl` that had a database trigger is listed too.

## 3. Scripts

Scripts are text files in the `scripts` folder. You can edit them on the **Scripts** page or in any text editor.

**The saved file is read every time a script starts**, so a script can never run an old copy from memory. A script that is running while you edit it is marked "edited since start - stop and start to apply".

Most BruControl script lines work unchanged:

```
new value vVCount          new string vSMsg     new bool vB_Testing     new time vT     new datetime vDT
vVCount = 3                vVCount += 1         vSMsg = "Temp " + "BK_Temp" value
"V_BK_In" state = true     "gblS_Msg" value = vSMsg     "tm_Whirlpool" value = 00:20:00
if vVCount > 2 && "Pump_Red" state == true
elseif ...
else
endif
[Label]                    goto "Label"
sleep 1000                 wait "BK_Temp" value <= 154
start "Other_Script"       stop "Other_Script"     start "tm_Whirlpool"   reset "tm_Whirlpool"   start "alm_Hops"
print "text"               show tab "Brewery"   (or show workspace)     log "vAV_Kettle_Temp"   (writes that vAPI to the database now)
vDT = now                  vT = vDT2 - vDT  (time between)   vDT = vDT + 00:10:00
BF precision = 4           "Euler's number" = 2.718   (quoted variable names work)
```

**Differences from BruControl**

- A `[label]` inside an if/endif works. Labels and gotos can be anywhere.
- A `//` comment can contain quote marks.
- **A script with an error does not start.** Errors include an if without endif, a goto to a missing label, an unknown variable, an unknown element or a missing script. The Scripts page lists the errors with line numbers; click one to jump to it.
- `start` on a script that is already running does nothing and prints a note. Stop it first to restart it.
- Inputs from hardware (digitalIn, temperature, analogIn) cannot be set by scripts.
- `fileindex` and other BruControl-only properties are stored but ignored. Alarms use `sound` (a path).

**Included samples**

| Script | What it does |
|---|---|
| `Demo_Transfer_HLT_to_MLT` | Opens valves and runs the pump; watch the flow. |
| `Demo_Hop_Stand` | 154 °F, 20-minute stand; 20 seconds when Testing is on. |
| `Demo_Heat_HLT` | Heats the simulated HLT, then sounds the alarm. |
| `Hops_Order_Boil` | Orders the imported boil hops into groups. |
| `looper_LogTemps` | Copies the kettle temperature into a logged vAPI. |
| `Demo_Variables` | Uses each vKonstant and vAPI kind; waits for the Ping button. |

## 4. API (for Node-RED or other programs)

Only **vAPI** variables are in the API (the old `/api/globals/...` address works the same as `/api/vapi/...`). Programs must send the API key from Settings in the header `X-API-Key: <key>` (or `?key=<key>`). Without a key, reading works only from your own network (home or Tailscale), and changes are refused. A signed-in browser can use the API too: viewers read, operators and admins also change.

| Request | Does |
|---|---|
| `GET /api/vapi` | All vAPI variables with values |
| `GET /api/vapi/<name>` | One vAPI |
| `PUT /api/vapi/<name>` with body `{"value": 152}` or just `152` | Set one |
| `POST /api/vapi` with body `{"name1": v1, "name2": v2}` | Set several |
| `POST /api/import/beerxml` with the XML file as the body | Import a recipe |
| `POST /api/log/<name>` | Write a vAPI to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values (from/to in epoch ms) |
| `GET /api/log.csv?...` | Same as CSV |

## 5. Files

```
server.js            the server
lib/                 engine (scripts), store (elements), logger (SQLite), hardware, beerxml
public/              the browser app
config/brewery.json  workspaces (the tabs), elements, graphics, devices, settings (edited by the app; a .bak is kept)
scripts/*.txt        scripts
media/               images and sounds (your background is media/brewery_main.png;
                     put all your BruControl pictures in media/oakbarn - a few are already there)
data/                state.json (variable values kept over restarts), brewlog.db (the database),
                     users.json (accounts, passwords are hashed) and sessions.json (who is signed in)
tools/               reset-password.js (forgotten password)
help/                the manual shown on the Help tab, one Markdown file per page
firmware/            Mega_BrewPanel.ino (Mega: USB or Ethernet shield), ESP32_Bridge.ino (WiFi or Ethernet bridge)
docs/                DEVICE_PROTOCOL.md, brewpanel.service, REMOTE_ACCESS.md (login and Tailscale)
```

## 6. Prototype limits

- **Remote use:** only through Tailscale (see docs/REMOTE_ACCESS.md). Never port-forward the panel on your router.
- **Browser testing:** tested in Chromium (Chrome/Edge engine), not yet in Safari or Firefox.
- **Hardware testing:** the hardware layer is tested with the simulator and a simulated ESP32. It is not yet tested with a real Mega. The firmware sketches have not been compiled yet.
- **Not built yet:** graphs on the Log page and PWM/analog outputs.
- **Hardware safety still comes first.** Keep hard-wired safety devices: burner flame safety, float switches and emergency stop.
