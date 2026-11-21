# Skynet documents

Every document Fritz has asked for, in one place. Tap a name to open it.
These GitHub copies are the main copies (Rule 13.7). This repo is public: private notes (the Sandboxes, Summaries and unbuilt plans) go in the private [Skynet_Private](https://github.com/oakbarn/Skynet_Private) repo. The links to them below open that private repo (sign in to GitHub).

| Document | What it holds |
|---|---|
| [Skynet Rules](Skynet_Rules.md) | Every Skynet Rule. Read before building anything. |
| [Panel Updates Sandbox](https://github.com/oakbarn/Skynet_Private/blob/main/Sandbox/Panel_Updates/Panel_Updates.md) | General Skynet Panel updates and ideas, parked and not built until OakBarn Brewery picks them (Rule 14.4). The only copy: the one that was here was merged into it on 2026-11-18. |
| [Process Updates Sandbox](https://github.com/oakbarn/Skynet_Private/blob/main/Sandbox/Process_Updates/Process_Updates.md) | Brew Day step, sample Process and Process command ideas, parked until the Skynet Process setup starts (Rule 14.5). |
| [Dialog Model Learning: Tab Settings](Dialog_Model_Learning/Tab_Settings.md) | The Tab Settings dialog before and after its update to the Blichmann RipTide Dialog 1 model, the reason for each change, and room for OakBarn Brewery's corrections. |
| [Importer Sandbox](https://github.com/oakbarn/Skynet_Private/blob/main/Sandbox/Importer/Importer_Notes.md) | Notes for the BruControl Importer version only, kept for the Big Merge (Rule 11.3). |
| [General Properties Dialog Format](General_Properties_Dialog_Format.png) | Fritz's drawing for the General Dialog Rules (Rule 18). |
| [Universal Properties](Universal_Properties.md) | The Properties and Process attributes every Device, Widget and Semi-Device has (Rule 1.21). |
| [Device Library](Device_Library.md) | Every Device and all its attributes. |
| [Skynet Picture ID numbers](Skynet_Picture_IDs.md) | Every Skynet picture and its fixed number (Rule 7.22), ready to print. |
| [Special Characters](Special_Characters.md) | Every keyboard mark and what it does in a name: the safe ones (`_` `~` `@`), the free ones, the blocked ones and the trouble ones. |
| [Default Settings: Other Places](Default_Settings_Other_Places.md) | Review list: each default set somewhere other than ☰ Menu > Default settings, the other place, and whether it should get a box on the Default tab. |
| [Outside Links](Outside_Links.md) | Every web link in Help, and whether OakBarn Brewery directed it (Rule 11.10). A test fails on any other. |
| [Widget Library](Widget_Library.md) | Every Widget, Widget setting and Skynet Template. |
| [Process Attributes: Devices](Process_Device_Attributes.md) | Every .attribute a Process can use on a Device, by Device type, A to Z. |
| [Process Attributes: Widgets](Process_Widget_Attributes.md) | Every .attribute a Process can use on a Widget, by Widget type, A to Z. |
| [Standard Process Commands](Process_Standard_Commands.md) | The general Process language A to Z: if ... endif, goto, wait, sleep, variables, math, comparisons and date math. |
| [Skynet Process Commands](Process_Skynet_Commands.md) | The Skynet-only Process commands A to Z (all_heaters_off, close_all_valves, delay, start_hop_alerts ...) and Skynet words. |
| [Media Licenses](Media_Licenses.csv) | A spreadsheet of every picture and sound Skynet ships that is not its own drawing, and the free programs it ships (the Pickr Color Picker): where it came from, its license, and the credit the license asks for. Opens in Excel. |
| [Image Library](Image_Library.md) | Every Skynet picture, by group. The pictures are in [media/Images/Skynet](../media/Images/Skynet/). |
| [Minimum equipment and limitations](Minimum_Equipment_and_Limitations.md) | All you need (one computer for the Brain + one Arduino), how far it grows, and what the panel cannot do yet. |
| [Hardware shopping list](Skynet_Brewery_Shopping_List.md) | What to buy to run the panel, with rough prices. |
| [DC Brewing Pumps](DC_Brewing_Pumps.md) | 12 V and 24 V pumps brewers use (flow, lift, ports), for adding DC pump types to the Panel. List only, waiting for review. |
| [Existing Alarms](ExistingAlarms.md) | Every old-style Alarm in the sample Schemas (Name, Schema, Tab), to change to the new Basic format one by one. |
| [Importing Norms](Importing_Norms.md) | Every change an import makes to bring a BruControl Schema (or anything old) up to the Skynet way. |
| [BruControl Importer Plan](BruControl_Importer_Plan.md) | The plan for the Windows BruControl Importer: one program with the Panel, what we need from a BruControl brewer, proposed Rule 15.4. Waiting for Fritz's OK. |
| [BruControl Old Import Method](BruControl_Old_Import_Method.md) | How the older import code turned a BruControl config file into Skynet items, kept for reference while the new import function is built step by step (Fritz, 2026-11-06). |
| [Existing gGlobals](ExistingGlobals.md) | Every gGlobal in the default and sample Schemas (Name, Schema, Tab), to sort into true variables and Text or Graphic Widgets. |
| [Put sounds on GitHub](Upload_Sounds_to_GitHub.md) | Step-by-step: put MP3s on the free Skynet-Sounds Release, name them Song_ or Voice_, and get their links (Rule 7.20). |
| [Security scanning](Security_Scanning.md) | What GitHub checks in the Skynet code (CodeQL, Dependabot, secret scanning) and click-by-click steps for the switches only the owner can turn on. |
| [Signing the Setup .exe](Code_Signing_Setup.md) | Step-by-step: set up Microsoft Artifact Signing (Azure) so Windows Smart App Control lets the Setup .exe run. |
| [Remote access](REMOTE_ACCESS.md) | Reaching the panel from outside the house. |
| [MQTT and voice](MQTT_AND_VOICE.md) | MQTT and voice assistant hookups. |
| [Device protocol](DEVICE_PROTOCOL.md) | The message language between the Brain and the boards. |
| [Moving from BruControl: board connections](BruControl_Connections.md) | How BruControl connects to its boards on Windows, what Skynet does today, and the gaps to close (Rule 6.16). |
| [Hysteresis code review](Hysteresis_Code_Review.md) | Every place in the code that deals with Hysteresis and its Offset, with plain notes, for review (2026-11-10). |
| [High-pressure gas burner build](High_Pressure_Gas_Build.md) | **For Information Only.** A parts list and step-by-step build for flame safety on a high-pressure propane burner: the UL / CSA listed way (recommended) and a daisy chain some home brewers build, with leak and first-light tests (2026-11-14). |
| [LED Test Board: parts list](LED_Test_Board_Parts.md) | Parts, wiring and pins for a plug-in Mega test board with LEDs (220 ohm) standing in for Pumps, Valves and other Devices (2026-11-12). |
| [Set up a Raspberry Pi 4 as the Brain](Pi_Brain_Setup_Guide.md) | Step by step: card, Pi OS, Skynet install, Windows and iPhone access, Skynet firmware on a Mega on the Pi's USB, and an LED test set on the Mega's own pin lists (2026-11-19). |
| [Daisy Chained Hardware for every Device](Device_Wiring_Hardware.md) | The parts each Device needs, from the board's pin out to the real pump, heater, valve, chiller, vessel part or probe, with a chain drawing for each, after OakBarn Brewery's Pump (On/Off) sheet (2026-11-17). |
| [Summary 1](https://github.com/oakbarn/Skynet_Private/blob/main/Summaries/Summary_1.md) | History record of the project chat up to 2026-10-27. For what is true now, use the Skynet Rules. |
| [Summary 2](https://github.com/oakbarn/Skynet_Private/blob/main/Summaries/Summary_2.md) | History record of the project chat from 2026-10-27 to 2026-11-02. For what is true now, use the Skynet Rules. |
| [Summary 3](https://github.com/oakbarn/Skynet_Private/blob/main/Summaries/Summary_3.md) | Full copy of the project memory on 2026-11-17, before it was trimmed: every standing rule, merged PR and open question up to then. For what is true now, use the Skynet Rules. |
