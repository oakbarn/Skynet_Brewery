# Summary 1: the Skynet Brewery project chat

Written 2026-10-27 (covers 2026-10-03 to 2026-10-27 16:43 UTC).

This is a plain-language summary of the project chat: what Skynet is, what Fritz decided, the
Rules he gave, every PR, the documents, the questions still waiting on him, and the work in
progress. The full rulebook is the [Skynet Rules](Skynet_Rules.md); this summary only points to it.

Links to other documents open on GitHub (sign in first). Repo:
[oakbarn/Skynet_Brewery](https://github.com/oakbarn/Skynet_Brewery). The main (default) branch is
`claude/project-thread-vzxi0a`. Latest version: **PR109_Skynet-v.20261027_12_47_2**.

---

## 1. What Skynet is

- A brewery control panel that runs in any browser (Windows, Mac, Linux, Android, iPhone).
- **The Brain** is the main computer: a Raspberry Pi 4 or newer, **or** a mini PC (2026-10-26). It
  holds every text, picture and Schema file, so the panel can be reached from anywhere.
- **PLCs** are hobby boards (Arduino Mega and other Arduino-compatible boards, ESP32, Raspberry Pi),
  joined to the Brain by USB, or by Ethernet/WiFi where the board has it.
- It started from Fritz's earlier "OakBarn Brew Panel" prototype (Node.js, no framework, live
  updates, BruControl-style scripts, SQLite log, Mega over USB plus an ESP32 WiFi bridge, BeerXML
  import), uploaded to GitHub on 2026-10-03.
- Today Fritz runs it on Windows from `C:\Brewing` with a .bat file, and reaches it from his
  iPhone over Tailscale.
- Fritz said "Public is fine" for the GitHub repo on 2026-10-22, but
  nothing is posted or announced anywhere without his word. The announcement goes only to a few
  BruControl friends.

## 2. Main decisions Fritz made

**Words used on screen**
- **Schema** = a setup or configuration (a BruControl file is a "BruControl Schema").
- **Device** = tied to a port on a PLC. **Widget** = lives only in the app (pipes, IPs, text,
  pictures, vessels on screen).
- **Tab** = a screen. **Process** = a script. **Interface** = a board. **Menu Bar** = the top line.
- **Push button** = on while held. **Toggle** = stays on/off. **Pulse** = 100 ms one-shot.

**How the screens work**
- One click for things done often, two or more for rare things. Keep Brew Day Tabs clean; rare
  items go in the ☰ Menu. The ☰ Menu lists every screen and sub-screen (PR #106).
- Plain true/false = small switch or toggle icon. Several choices = dropdown, with "Add new ..."
  where the list can grow. Colors = dropdown with swatch and Custom.
- Double-click opens Properties, on a Tab and in any list (PR #107). Right-click starts a drag.
  Properties dialogs have Delete, Cancel and Save at the top and bottom.
- Every new Device, Widget or Template copy is made on the 🔨 Build Tab first, then sent to a Tab.
- Phones and tablets can't move or resize things in Edit layout.

**Templates and Integrated items**
- Skynet Templates come with Skynet, are read only and can only be cloned. User Bundled Templates
  can be edited and deleted by an Admin.
- Two kinds of Integrated item: **Skynet_Integrated_Device** (Electric Heated Vessel, RIMS tube)
  and **Skynet_Integrated_Widget** (for example a TC elbow with its IPs built in). Anything
  integrated from a Template can never be un-bundled.
- The RIMS tube is not bundled: its IPs are built in like an elbow, the element's settings are in
  RIMS Properties, and the thermowell is part of the element (PR #105).
- Add a Vessel asks: Widget or Integrated. User Bundled vessel Templates must start from a Skynet
  Vessel Widget.

**Pictures**
- Skynet pictures are SVG only, flat grey with a black outline and see-through background.
- Pictures live in `media/Images` in 10 groups (Alarms, Vessels, Pumps, Valves, Chillers, Motors,
  Lights/LEDs, Hop Infusion, Other Equipment, Miscellaneous); sounds in `media/sounds`.
- No .svg can be deleted, renamed or replaced from the panel. Generic shapes and names only, no
  brand logos.
- An On overlay picture can sit on top while a Device is on. The old two-picture (On/Off) code
  stays until Fritz says delete it.

**Delivery and testing**
- Every code change ships as a PR. Zips only when Fritz asks.
- Every new merged version wipes the logins (testing mode), so Fritz starts fresh with Admin setup.
- Dates in file names use ISO 8601 (YYYY-MM-DD, times as YYYY-MM-DDTHHMMSS).
- The version name is stamped by GitHub on every merge (`PR<number>_Skynet-v.yyyymmdd_hh_mm`).

**Hardware and safety (2026-10-26 and 2026-10-27)**
- Connection ranking by board: Mega USB best, Ethernet OK, WiFi poor; ESP32 WiFi good unless it
  runs heating. Heaters on a network link are allowed with a warning, and each board has a
  lost-link delay (3 to 600 s, default 10) after which it turns all outputs off (PR #108).
- The ESP32 bridge for the Mega stays, and the ranking covers all Arduino-type boards.

## 3. Rules given

All Rules are numbered in the [Skynet Rules](Skynet_Rules.md) (14 groups, about 90 Rules). If an
ask breaks a Rule, Claude quotes it and offers two choices: change the Rule, or allow one
exception. Rules added today:

- **Rule 6.9 (2026-10-27):** an RTD (PT100/PT1000 on a MAX31865 board) on an Arduino Mega may use
  only **D14-D17, D22-D39, D41-D43, D47-D49 or D53** as its CS pin. (PR #110)
- **Rule 6.10 (2026-10-27):** a Mega's Interface can't be changed from USB to Ethernet while any
  Device uses **pin D10** (the Ethernet shield needs it). The panel tells you to move that Device
  and its wiring to another free pin first. (being added to PR #110)
- **SD cards (2026-10-27):** SD cards are not supported. **D4 is not blocked**, but picking D4 for
  any Device on a Mega shows "SD Card Not Supported. Never insert an SD Card!" Fritz also asked for
  a warning if an SD card **is** inserted in the shield. (being added to PR #110)
- **Documents (2026-10-27):** every document Fritz asks for is saved in the project folder **and**
  in the repo `docs/` folder by PR, with a direct link. [docs/README.md](README.md) lists them all.
- **Libraries (2026-10-27):** new unique Devices go in the Device Library, new Widgets/Templates
  in the Widget Library. Pictures go in the Image Library **only** when Fritz says so.

## 4. Pull requests

**Merged (in the panel now):** #1 to #12, #14 to #50, #52 to #68, #70, #72 to #109.
They were mostly merged in groups ("combined builds"): #10 (#1-#8), #20 (#9, #11, #12, #14-#19),
#27 (#21-#26), #34, #36, #41, #46 (#42-#45), #62 (#54-#61), #70 (#63-#68), #75 (#72-#74),
#104 (#101-#103).

Highlights by date:

| Date | PRs | What they did |
|---|---|---|
| 2026-10-04 | #1-#20 | vKonstant and vAPI variables, BruControl import, IPs and fittings, PLC Devices, Lock and Tabs, samples, SVG pictures, login and Tailscale, MQTT and voice, forgot password, Globals retired, Equipment, Help tab, "Processes", beer money pop-up, stepper motors |
| 2026-10-05 | #21-#41 | Simulation mode, alarms and Sound Player, Process language, installers, push vs toggle, Process restart, updates never overwrite your files, Tab background, pipes and hoses, picture paths |
| 2026-10-20 | #42-#50 | Beginner install ReadMes, Process editor, Schemas and Equipment Profiles (brewing rewrite stage 1), .bat installs Node.js, tap water valves, File Move page, ☰ Menu tabs, Valve Profile |
| 2026-10-21 | #52-#68 | Process order numbers, password rules, hide Menu Bar, Zoom/About, right-click Help, C-style spellings, phones no drag, Schema.json, Interface/Tab IDs, `.running`, CSV logs, panel version stamp, Schema switching, text boxes, Vessel and Fitting Templates |
| 2026-10-22 | #72-#91 | On/Off pictures, renames update Processes, Skynet fittings/kettles/valves, Help window, Build Tab, Lock All, picture groups, On overlay, Edit layout button, SVG redraws, Brewzilla, Get Skynet pictures, un-bundle to Build Tab, built-in IPs |
| 2026-10-23 | #92-#100 | Flip/Rotate vessels, ISO 8601 file dates, lock icon, allowed name characters, .visible/.hidden, Device naming and New Device box, Build Tab Preview, RIMS tube |
| 2026-10-26 | #101-#107 | Basic electric kettle, Add a Vessel (Widget or Integrated), Skynet vessel Widgets, RIMS not bundled, ☰ Menu lists every screen, double-click in lists |
| 2026-10-27 | #108, #109 | Connection ratings and lost-link delay; documents in the repo with links |

**Closed without merging (replaced):** #13 (went into #43), #51 (right-click Properties, rejected),
#69 and #71 (folded into #70).

**Open:**
- **[PR #110](https://github.com/oakbarn/Skynet_Brewery/pull/110)**: RTD CS pins on the Mega
  (Rule 6.9). Pin D10 check, D4 warning and SD-card-inserted warning are being added to it now.
- The PR for this Summary (adds it to `docs/` and the document list).

## 5. Documents

| Document | Link |
|---|---|
| Skynet Rules | [docs/Skynet_Rules.md](Skynet_Rules.md) |
| Device Library | [docs/Device_Library.md](Device_Library.md) |
| Widget Library | [docs/Widget_Library.md](Widget_Library.md) |
| Image Library (index; pictures in the project's Image_Library folder and repo media/Images/Skynet) | [docs/Image_Library.md](Image_Library.md) |
| Minimum equipment and limitations | [docs/Minimum_Equipment_and_Limitations.md](Minimum_Equipment_and_Limitations.md) |
| Hardware shopping list | [docs/Skynet_Brewery_Shopping_List.md](Skynet_Brewery_Shopping_List.md) |
| BruControl import rules | [docs/BRUCONTROL_IMPORT_RULES.md](BRUCONTROL_IMPORT_RULES.md) |
| Document list (bookmark this) | [docs/README.md](README.md) |
| This summary | [docs/Summary_1.md](Summary_1.md) |

The Help pages inside the panel run from 01 to 69. The next free Help number is **70**.

## 6. Questions waiting on Fritz

From today (2026-10-27):
1. **Firmware for boards outside the Arduino IDE:** which goes first? (a) Pi GPIO in Python
   (recommended, since a Pi is on the bench this week), (b) Pi Pico in MicroPython, (c) ready-made
   Mega/Uno/Nano/ESP32 files plus a "Load firmware" page, or (d) all three in that order.
   It's a card in "Build firmware for non-Arduino-IDE boards".
2. **A0-A15 for RTDs:** they would work as CS pins, but they are the Mega's only analog inputs.
   Add them as a last choice for RTDs, or keep them off the list? (not answered yet)
3. **Thermocouples:** use the same CS pin list as RTDs?
4. **Mega firmware:** should it take its RTD CS pins from the panel instead of a hand-typed list?
5. **Merge PR #110** once the pin 10 and SD card items are in.

Older questions still open (also listed at the end of the Rules):
6. Should the Panel Version name use ISO 8601 too?
7. Is it time to make all Skynet fittings and vessels fully Integrated, like the RIMS?
8. Block `< > : " / \ | ? *` in Device names too?
9. Should Save layout keep the Build Tab as it is?
10. RIMS: show readings on the RIMS picture instead of separate Heat/Temp boxes?
11. RIMS file name "TC1_2": 1/2 inch or 2 inch tri-clamp? (marked TC 1.5 for now)
12. Phones in Edit layout: add a warning and an "Allow Edit layout on phones" switch (off)?
13. Bundled Devices listed in vessel Properties with Edit buttons: OK'd but not built yet.
14. BruControl import: keep the strict Process check, or allow a lenient BruControl-style start?
15. Brewing rewrite stages 2-4 (Recipe Profiles, Brew Day Recipe, reports) are waiting to start.
16. From the first check-up: phone layout, Pi GPIO pins, PID temperature control.

On hold until Fritz says go: the hardware summary for a Fritzing / screw-shield / daughter-board
chat, and a firmware compile check inside the app.

## 7. Work in progress, by thread

| Thread | State |
|---|---|
| "Limit RTD CS pins on the Mega" | Working: PR #110, adding the pin 10 check, D4 warning and SD-card-inserted warning |
| "Build firmware for non-Arduino-IDE boards" | Waiting on Fritz to pick what to build first |
| "Create image library for the project" | Done; asks if unmerged preview pictures should be added |
| "Schema, Equipment and Recipe rewrite" | Stage 1 merged; stages 2-4 waiting |
| "Add Vessel: Widget or Integrated choice" | Merged in #104; open follow-ups |
| "Build Tab preview and templates" | Merged; Save layout question open |
| "Allowed characters in names" | Merged; Device names question open |
| "ISO 8601 dates in file names" | Merged; Panel Version name question open |
| "Interface, Tab and Device naming" | Merged; waiting on Fritz |
| "No dragging on phones and tablets" | Merged; phone Edit layout switch question open |
| "Skynet pictures as SVG only" | Merged; waiting on Fritz |
| "Beer money donation pop-up" | Merged; Fritz to turn on branch protection himself |
| "Write chat Summary 1" | This document |

**Test bench (week of 2026-10-20):** a Pi, a Mega, an ESP32, one Tilt, a couple of valves, and two
12 V LEDs standing in for a burner and an electric element. The firmware has never run on real
hardware yet, so first real-hardware bug reports are expected. Fritz will write his first real
Schema after the rewrite.
