# OakBarn Brew Panel (prototype)

A browser-based brewery control panel with BruControl-style workspaces and scripts. It runs on Windows, Mac, Linux or a Raspberry Pi, and you use it from any browser on your network: Chrome, Edge, Safari, Firefox or DuckDuckGo, on a PC, tablet or phone.

```
 Browser(s) ──WiFi/LAN──>  Brew Panel server (Node.js)  ──USB──>  Arduino Mega(s)
                           scripts, Globals API, SQLite ──Ethernet──> Mega + Ethernet shield, or ESP32 (Ethernet) ──> Mega
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

## 2. What is in it

| Area | What it does |
|---|---|
| **Workspaces** | Tabs with a background image (a path) that fills the workspace or sits at a set place and size (room for a message panel on the left), placed elements, graphics, text and **pipes**. Use **Edit layout** to drag, resize, double-click for properties, add elements, and draw pipes. |
| **Picture elements** | A screen picture you place anywhere, for example `insp_Pix_Red_Pump_B1`. It can stay **static**, **follow** another element (shows its *on* image when `MB_36_do_RedPump_B1` is on and its *off* image when it is off), or be changed by a script (`"insp_Pix_Red_Pump_B1" image = "oakbarn/Pump_Red_Rip_On.png"`). Tapping a picture that follows an output turns that output on/off. |
| **Touch screens** | Tap an output to turn it on/off, tap a Global to get a large dialog with − / + buttons and a number pad. Every element has **When tapped** (default, none, toggle, dialog, script, workspace), a **Tap target**, and **Ask before changing**, which shows large ON / OFF buttons so a bump does not start a pump. In Edit layout, hold a finger on an item for a moment to open its properties, and use **Finish pipe** when drawing pipes. |
| **Looks** | `led` (red digits), `lcd` (blue digits), `dark` (white on black, like the BruControl message panels) and `button`. |
| **Pipes** | Click points to draw a line along a manifold path. Pick the valves and pump it needs in **Flow when**. When all of them are on, the pipe shows animated flow. If your background already shows the piping, turn off **Show pipe when not flowing**: then only the moving flow appears. |
| **Elements** | `global`, `shared`, `digitalOut`, `switch`, `digitalIn`, `temperature`, `analogIn`, `timer`, `alarm`, `label`. **Every element can have a background image path**, and on/off elements have separate on and off image paths. |
| **Devices** | Elements tied to a pin on a hobby board (Arduino Mega, ESP32 bridge; hobby modules such as relay boards, MAX31865 / MAX31855 / MAX31856 probe boards, ADS1115). **Add element** groups them: outputs (digital, PWM %, analog 0-10 V / 4-20 mA), digital inputs (switch, float / level switch, flow switch, interlock), temperature probes (DS18B20, PT100, PT1000, thermocouple K / J / T and more, NTC thermistor), analog sensors (0-5 V, 0-10 V, 4-20 mA, pressure transducer, level transmitter, pH with two-point calibration) and pulse flow meters. The properties dialog shows only the settings the chosen probe or signal needs, plus the live reading for calibration. Wiring and protocol: `docs/DEVICE_PROTOCOL.md`. |
| **Widgets** | App-only items with no board pin: pictures, Globals, shared variables, on-screen switches, timers, alarms, labels. |
| **Globals** | Readable and writable by every script, by the API, and can be logged to the database. |
| **Shared variables** | Readable and writable by every script, but **never in the API or the database**. Use them to pass values between scripts. |
| **Database** | SQLite file `data/brewlog.db`. Each Global has a trigger: **Off, On demand, Once, Every N seconds, Every N hours, Every N days**. The **Log** page shows the data and downloads CSV. |
| **Alarms** | Sound file by path, `.wav` or `.mp3`. Browsers only play sound after one click, so press **Enable sound** on each screen that should sound alarms. |
| **BeerSmith** | BeerSmith **File > Export > BeerXML**, then the **Import** page (or POST to the API). Hop uses become your group codes: Mash -333, First Wort -444, boil hop at full boil time -888, other boil hops 919, Aroma/Whirlpool -999, Dry Hop -111, unused slot 0. Dry hop time is converted to days. The mapping is editable in **Settings**. |
| **OneWire probes** | Matched by ROM id, not bus position. New probes appear on **Devices > OneWire probes seen**, where you assign them to an element. |
| **Media paths** | Images and sounds are paths to files inside the **media folders** listed in Settings, for example `valves/open.png` or `D:\Brewing\Pics\kettle.png`. Nothing is stored inside the program. For safety, only files inside those folders are served. |

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
print "text"               show workspace "Brewery"     log "gblV_Kettle_Temp"   (writes that Global to the database now)
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
| `looper_LogTemps` | Copies the kettle temperature into a logged Global. |

## 4. API (for Node-RED or other programs)

Only **Globals** are in the API. If an API key is set in Settings, every change must send the header `X-API-Key: <key>`.

| Request | Does |
|---|---|
| `GET /api/globals` | All Globals with values |
| `GET /api/globals/<name>` | One Global |
| `PUT /api/globals/<name>` with body `{"value": 152}` or just `152` | Set one |
| `POST /api/globals` with body `{"name1": v1, "name2": v2}` | Set several |
| `POST /api/import/beerxml` with the XML file as the body | Import a recipe |
| `POST /api/log/<name>` | Write a Global to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values (from/to in epoch ms) |
| `GET /api/log.csv?...` | Same as CSV |

## 5. Files

```
server.js            the server
lib/                 engine (scripts), store (elements), logger (SQLite), hardware, beerxml
public/              the browser app
config/brewery.json  workspaces, elements, graphics, devices, settings (edited by the app; a .bak is kept)
scripts/*.txt        scripts
media/               images and sounds (your background is media/brewery_main.png;
                     put all your BruControl pictures in media/oakbarn - a few are already there)
data/                state.json (Global values kept over restarts) and brewlog.db (the database)
firmware/            Mega_BrewPanel.ino (Mega: USB or Ethernet shield), ESP32_Bridge.ino (WiFi or Ethernet bridge)
docs/                DEVICE_PROTOCOL.md, brewpanel.service
```

## 6. Prototype limits

- **No login.** Anyone on your network who can open the page can control the rig. Keep it on your home network, not the internet.
- **Browser testing:** tested in Chromium (Chrome/Edge engine), not yet in Safari or Firefox.
- **Hardware testing:** the hardware layer is tested with the simulator and a simulated ESP32. It is not yet tested with a real Mega. The firmware sketches have not been compiled yet.
- **Not built yet:** graphs on the Log page, user accounts, and PWM/analog outputs.
- **Hardware safety still comes first.** Keep hard-wired safety devices: burner flame safety, float switches and emergency stop.
