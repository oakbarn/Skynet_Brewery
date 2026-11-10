# BruControl text taken out of the Skynet Panel Help

Kept here, not deleted (OakBarn Brewery, 2026-11-10, Rule 11.3). Skynet Panel Help and Hover Help say nothing about BruControl;
BruControl differences belong only in the Importer Help. When the Importer Help is written (after the Skynet Panel Help is finished),
the text below is the starting point: it is added back there, next to the Skynet Panel Help it came from.

The panel does not use this folder, and it is left out of the release zip and the installer.

Each entry says where the text was, what was taken out, and what is there now.

## Help pages

### help/01-getting-started.md

**Taken out (a sentence):**

> - **Tab**: one brewery screen (BruControl calls these workspaces).

**Now:** 
> - **Tab**: one brewery screen.

### help/04-variables.md

**Taken out (a sentence):**

> The old **Global** class (from BruControl) is retired. When a BruControl file or an older Schema is loaded, each Global becomes a gGlobal, and the list of what moved shows on the Processes page.

**Now:** 
> The old **Global** class is retired. When an older Schema is loaded, each Global becomes a gGlobal, and the list of what moved shows on the Processes page.

### help/05-scripts.md

**Taken out (a sentence):**

> They are text files in the `scripts` folder on the Pi and work like BruControl processes.

**Now:** 
> They are text files in the `scripts` folder on the Pi.

**Taken out (a sentence):**

> The old BruControl word `displayname` still works and means the same thing.

**Now:** 
> The older word `displayname` still works and means the same thing.

**Taken out (a sentence):**

> (In BruControl this failed on a Global String; here it works the same on every type.)

**Now:** removed

**Taken out (a sentence):**

> a Windows path such as `C:\BruControl\Media\Hops.wav`

**Now:** 
> a Windows path such as `C:\Brewing\Sounds\Hops.wav`

**Taken out (a sentence):**

> ## Differences from BruControl

**Now:** 
> ## Good to know

### help/07-media.md

**Taken out (a sentence):**

> , and sounds imported from BruControl as `Images/wave/...`.

**Now:** 
> , and sounds kept as `Images/wave/...`.

**Taken out (a sentence):**

> , which is handy for a whole BruControl Media folder.

**Now:** 
> , which is handy for a whole folder of pictures.

**Taken out (a sentence):**

> (for example `C:\BruControl\Media`, added in **Settings > Media folders**) gets its copy with the Brain instead, in the hidden `media\.svg` folder, so nothing is written into BruControl's folders. The original is never changed (BruControl can still use it), and

**Now:** 
> (for example `D:\Pictures`, added in **Settings > Media folders**) gets its copy with the Brain instead, in the hidden `media\.svg` folder, so nothing is written into that folder. The original is never changed (other programs can still use it), and

### help/13-glossary.md

**Taken out (a sentence):**

> **BruControl**: the Windows brewery program this panel is modelled on. Its Schemas (BruControl calls them configuration files) and processes can be imported.

**Now:** removed

**Taken out (a sentence):**

> **Element**: an old BruControl word. Skynet does not use it:

**Now:** 
> **Element**: a word Skynet does not use:

**Taken out (a sentence):**

> **Global**: BruControl's variable class. The panel turns Globals into gGlobal variables when they are imported.

**Now:** 
> **Global**: an old variable class. The panel turns Globals into gGlobal variables when they are loaded.

**Taken out (a sentence):**

> The samples are ready-made Schemas, and a BruControl configuration file is imported as a Schema.

**Now:** 
> The samples are ready-made Schemas.

**Taken out (a sentence):**

> **Tab**: one brewery screen (BruControl calls it a workspace).

**Now:** 
> **Tab**: one brewery screen.

### help/21-alarms-and-sound.md

**Taken out (the whole section "Importing from BruControl"):**

> ## Importing from BruControl
>
> The [BruControl import](08-import) now also does this:
>
> - Each alarm gets a kind guessed from its name: Hops and Aroma are Hop Alarms, Hop or Irish Moss **Warning** ones are Pre-Hop, Strike, Mash, Sparge, Boil and Sanitize are Brew Flow, Music, Sound, Beep and Water Flow are Sound only, the rest are General. The import report lists them; change any on the alarm's settings.
> - Every `"alm_..." active = true` line becomes `alm_... = true`.
> - **Stacked look-alikes are folded into one.** BruControl allows only 3 background pictures per item, so one message panel was often three copies on top of each other (`gblS_Brewery_Top_1`, `_2`, `_3`). Copies with the same name apart from the number at the end, on the same tab at the same spot, become one item (`gblS_Brewery_Top`) with all their pictures: copy 1's pictures are 1-3, copy 2's are 4-6, copy 3's are 7-9. Processes are changed to match, and "hide the other copy" lines become comments.
> - **Timers are never folded**, so a long mash timer, a short delay timer and a sub-process timer can stay stacked.
> - Items stacked at one spot with different names are listed in the report, not folded.

**Now:** removed

**Taken out (a sentence):**

> A Process never writes `.active`: the BruControl Import changes BruControl's `"alm_Hops_1" active = true` into the new style.

**Now:** 
> A Process never writes `.active`.

### help/22-process-language.md

**Taken out (a sentence):**

> Old BruControl lines still run, and the panel rewrites them in the new style when you **Save** a Process or **Import** a BruControl file. A line is only rewritten when the new line means exactly the same thing, so nothing changes what a Process does.

**Now:** removed

**Taken out (a sentence):**

> | New style | BruControl style (still works) |
> |---|---|
> | `Pump_Red = true` | `"Pump_Red" state = true` |
> | `alm_StrikeSpargeMash_ALARM = true` | `"alm_StrikeSpargeMash_ALARM" active = true` |
> | `Kettle_SetPoint = 185.5` | `"Kettle_SetPoint" value = 185.5` |
> | `if Kettle_SetPoint == 185.5` | `if "Kettle_SetPoint" value == 185.5` |
> | `wait tm_Mash <= 00:00:00` | `wait "tm_Mash" value <= 00:00:00` |

**Now:** 
> ```
> Pump_Red = true
> alm_StrikeSpargeMash_ALARM = true
> Kettle_SetPoint = 185.5
> if Kettle_SetPoint == 185.5
> wait tm_Mash <= 00:00:00
> ```

**Taken out (a sentence):**

> You can mix both styles in one Process. Old Processes and BruControl imports keep working as they are, and **Save** never changes one style into the other.

**Now:** 
> You can mix both styles in one Process. **Save** never changes one style into the other.

### help/23-restarting-processes.md

**Taken out (a sentence):**

> In BruControl a thread could get corrupted and needed a restart, which is why old BruControl Processes have so many `start` lines. The Brew Panel does not corrupt Processes like that, but a Process can still stop on an error,

**Now:** 
> A Process can stop on an error,

### help/25-picture-paths.md

**Taken out (a sentence):**

> A BruControl import comes in with the new names too.

**Now:** removed

**Taken out (a sentence):**

> (from stacked BruControl copies)

**Now:** removed

### help/27-minimum-equipment.md

**Taken out (a sentence):**

> | $25-45 each, $20-35 supply | BruControl VGC outputs import as valves |

**Now:** 
> | $25-45 each, $20-35 supply | |

### help/32-file-move.md

**Taken out (a sentence):**

> Always straight into `sounds`, so BruControl's `wave` folder is not needed.

**Now:** 
> Always straight into `sounds`, so a separate `wave` folder is not needed.

**Taken out (a sentence):**

> ## Copying your BruControl pictures and sounds

**Now:** 
> ## Copying pictures and sounds from a folder

**Taken out (a sentence):**

> 1. Open the panel on the Windows PC that has BruControl, sign in as admin

**Now:** 
> 1. Open the panel on the computer that has the pictures and sounds, sign in as admin

**Taken out (a sentence):**

> choose `C:\BruControl\Media` (or drag

**Now:** 
> choose the folder that holds them (or drag

### help/36-tab-and-valve-profiles.md

**Taken out (a sentence):**

> (the older BruControl drawing), horizontal

**Now:** 
> (the older drawing), horizontal

**Taken out (a sentence):**

> (the older BruControl drawing), vertical

**Now:** 
> (the older drawing), vertical

### help/46-interface-tab-device-names.md

**Taken out (a sentence):**

> , in this order, as BruControl does:

**Now:** 
> , in this order:

**Taken out (a sentence):**

> Analog pins are written the way BruControl numbers them, A0 = 54

**Now:** 
> Analog pins are written by their pin number, A0 = 54

**Taken out (a sentence):**

> This is different from BruControl, where one heater could have a Hysteresis and a PID on its port: in Skynet the heater is one Heating Element and you pick

**Now:** 
> A heater is one Heating Element and you pick

**Taken out (a sentence):**

> 10K NTC thermistor (BCS-462 and BruControl type)

**Now:** 
> 10K NTC thermistor (BCS-462 type)

**Taken out (a sentence):**

> , so, as in BruControl, they get a virtual port

**Now:** 
> , so they get a virtual port

**Taken out (a sentence):**

> 10K BCS-462 / BruControl (Beta 3977)

**Now:** 
> 10K BCS-462 (Beta 3977)

### help/58-on-overlay.md

**Taken out (a sentence):**

> This is new in Skynet; BruControl never had it.

**Now:** removed

### help/69-connection-ratings.md

**Taken out (a sentence):**

> A BruControl import takes the board from BruControl.

**Now:** removed

### help/71-cloned-devices.md

**Taken out (a sentence):**

> In BruControl a Device could sit on only one worksheet, so showing the same pump on two screens took extra code and globals. In Skynet a Device

**Now:** 
> A Device

### help/72-labels.md

**Taken out (a sentence):**

> - every Device and Widget (it is BruControl's Name Visibility)

**Now:** 
> - every Device and Widget

**Taken out (a sentence):**

> `label` is the Skynet word. BruControl's old word still works and means the same:

**Now:** 
> `label` is the Skynet word. The older word still works and means the same:

### help/84-gkonstant-and-gapi.md

**Taken out (a sentence):**

> A BruControl `RP_...` Global now comes in as a gAPI named `gA_...` (it used to be `vA_...`), and a `gbl...` Global becomes a gKonstant with the same name. See [Variables](04-variables).

**Now:** removed

### help/98-database-and-api.md

**Taken out (a sentence):**

> - A BruControl import brings every Global in as a gGlobal: `RP_...` becomes `gG_...` with .API Get and Put, and `gbl...` keeps its name with .API Off.

**Now:** removed

### help/108-gglobal-kinds.md

**Taken out (the whole section "Coming in from BruControl"):**

> ## Coming in from BruControl
>
> How BruControl Globals turn into these Kinds (and when the import asks you) is in the Importing Norms (docs/Importing_Norms.md), section 6c.

**Now:** removed

### help/112-semi-widgets-devices.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Import turns each **Toggle Switch** into a Boolean Widget. On its Switches page, **Becomes** picks which one
> (Switch to start), and **Linked Device** can link it to one of your imported Devices with an ON / OFF state.

**Now:** removed

### help/114-universal-properties.md

**Taken out (a sentence):**

> , the same as BruControl's Z Order. **1 is on top**

**Now:** 
> . **1 is on top**

**Taken out (a sentence):**

> The **BruControl Import** brings BruControl's Z Order across: the first item in each BruControl Workspace is on top (Layer Order 1).

**Now:** removed

### help/117-proportional-valves.md

**Taken out (a sentence):**

> is the **KLD20T** sold by BruControl: a 1/2 inch

**Now:** 
> is the **KLD20T**: a 1/2 inch

### help/121-valves-and-pumps-on-pipes.md

**Taken out (a sentence):**

> The older ball valve pictures from BruControl (now

**Now:** 
> The older ball valve pictures (now

### help/126-deadband-device.md

**Taken out (the whole section "Moving from BruControl"):**

> ## Moving from BruControl
>
> Import brings a BruControl Deadband Output in as a Skynet Deadband with the same settings. BruControl counts its output
> from 0 to 255; Skynet counts it in %, so the Initial Output and the two Drives are changed to % on the way in (the import
> report says so; check them).

**Now:** removed

**Taken out (a sentence):**

> , the same way as BruControl's
> Deadband Output (Skynet Rule 6.17).

**Now:** 
> (Skynet Rule 6.17).

### help/147-hover-help.md

**Taken out (a sentence):**

> The **BruControl Import** works the same way.

**Now:** removed

### help/148-every-device-dialog.md

**Taken out (the whole section "The BruControl Import"):**

> ## The BruControl Import
>
> The Importer has no Device dialogs of its own. The Devices it brings in open in these same Properties in the Panel.

**Now:** removed

### help/149-shared-variables-became-gglobals.md

**Taken out (the whole section "BruControl Globals"):**

> ## BruControl Globals
>
> Globals brought in by the BruControl Import are set one at a time later, in the Importer's globals questions.

**Now:** removed

### help/150-heating-method.md

**Taken out (the whole section "Coming from BruControl"):**

> ## Coming from BruControl
>
> BruControl controls one element with two Devices on the same port, for example **M_HLT Heat** (Duty Cycle) and **HLT PID** on port
> 42. The BruControl Import makes them **one Heating Element**. It starts in the first one's method, and both old names still work
> in a Process: `HLT_PID = true` switches it to PID and turns it ON; `M_HLT_Heat = true` switches it to Duty Cycle. Where the second
> one was placed on a Tab, it becomes a **Method Clone** of the Heating Element standing for its method, with its BruControl Label
> (*HLT PID*), so the Tab looks as it did in BruControl.

**Now:** removed

**Taken out (a sentence):**

> The BruControl Import sets Duty Cycle as the main method and ticks PID for you.

**Now:** removed

**Taken out (a sentence):**

> To show one Element as separate tiles, like BruControl's *M_HLT Heat* and *HLT PID* side by side, add

**Now:** 
> To show one Element as separate tiles, one for each method side by side, add

**Taken out (a sentence):**

> (BruControl used *Enabled* for this; an old `.enabled` line still works, but Skynet says On and Off.)

**Now:** removed

**Taken out (a sentence):**

> so older Processes and BruControl lines keep working.

**Now:** 
> so older Processes keep working.

**Taken out (a sentence):**

> This is a big difference from BruControl (Rule 6.1): in Skynet **each port

**Now:** 
> Rule 6.1: in Skynet **each port

**Taken out (a sentence):**

> Anything else BruControl had sharing a port (for example a pump's on/off
> and its PWM speed) is listed in the Import notes so you can keep one.

**Now:** removed

### help/151-panel-looks.md

**Taken out (the whole section "Why not BruControl's themes"):**

> ## Why not BruControl's themes
>
> BruControl's **Settings > Environment > Theme** (for example **Office 2019 Black**, palette **Default**) are paid DevExpress
> themes. They are not public, and they would not work in a browser anyway. Skynet gets the same effect by setting the **Back
> color** and the **Text and Label colors** (Fritz: "the same affect is by setting the Back and the Text colors"). This is one of the
> changes from BruControl.

**Now:** removed

**Taken out (the whole section "The BruControl Import"):**

> ## The BruControl Import
>
> The Import looks for your BruControl theme in BruControl's own settings files (it only reads them) and picks the closest Look:
> a Black, Dark or High Contrast theme becomes **Office Black**, a Dark Gray one **Dark Gray**, and a White, Light, Colorful or Blue
> one **White**. When it cannot find it, the Schema gets **Office Black**, the closest to BruControl's own default. Each imported
> Tab gets the Look's Tab colors. You can change the Look afterwards in the Panel.

**Now:** removed

**Taken out (a sentence):**

> | **Office Black** (the default) | BruControl's Office 2019 Black |

**Now:** 
> | **Office Black** (the default) | Office 2019 Black |

**Taken out (a sentence):**

> | **Dark Gray** | BruControl's Office 2019 Dark Gray |

**Now:** 
> | **Dark Gray** | Office 2019 Dark Gray |

**Taken out (a sentence):**

> | **White** | BruControl's Office 2019 White or Colorful |

**Now:** 
> | **White** | Office 2019 White or Colorful |

### help/152-skynet-dial-and-timer-digits.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Import gives each BruControl gauge the closest Skynet look: a **round gauge** becomes the **Skynet Dial** and a
> **bar gauge** the **Skynet Bar**, with BruControl's lowest and highest numbers, its large and small tick marks, its shape (full or
> half round) or direction, and its decimals; a **digit gauge** shows **LCD digits**. Each gets the **nearest Skynet color style**
> (BruControl's style name is kept only as a record and never shown). Set the Setpoint in its Properties to get the blue, green and
> red reading.

**Now:** removed

**Taken out (a sentence):**

> BruControl's gauges are paid drawings from another company
> (DevExpress); Skynet never copies their pictures, code or style names.

**Now:** 
> Skynet never copies
> another company's pictures, code or style names.

### help/153-move-alone-swap-put-back.md

**Taken out (the whole section "Checked with the BruControl Import"):**

> ## Checked with the BruControl Import
>
> The BruControl Import makes Schemas and does not move things on a Tab, so it is not changed. Schemas it makes get the pop-up,
> Swap and Put back in the Panel like any other.

**Now:** removed

### help/154-properties-hotspots.md

**Taken out (the whole section "BruControl Import"):**

> ## BruControl Import
>
> A vessel the BruControl Import makes into a Vessel Device gets the same hotspots when it is opened in the Skynet Panel. The Import
> program itself has no Device dialogs, so nothing changes there.

**Now:** removed

### help/155-default-settings.md

**Taken out (the whole section "The BruControl Import"):**

> ## The BruControl Import
>
> The Import makes Schemas; when one is loaded in the Panel it uses these Default settings. The Import draws no pipes, so its pumps
> and valves are drawn for the **Default pipe size** until you pipe them.

**Now:** removed

**Taken out (a sentence):**

> - **Setup** and the **BruControl Import** (Skynet names; the Look closest to the BruControl theme).

**Now:** 
> - **Setup** and the **Import** (Skynet names, and its Look).

### help/156-precise-heating.md

**Taken out (the whole section "Coming from BruControl"):**

> ## Coming from BruControl
>
> BruControl has no Precise method, so the BruControl Import brings a PID in as **PID**, as it was. Precise and the two-point
> calibration are Skynet's own: after the Import, tick **Precise** in the Heating Element's Properties and calibrate its probe.

**Now:** removed

### help/159-graph-widget.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Importer turns each BruControl **Chart** into a Graph Widget, in the same place and size, with the same Span,
> Refresh interval, grid lines, colors and Channels. Each item a Graph draws is set to be sent to the database every Refresh
> interval (if it had no Database setting), so its line fills as soon as readings come in. A Graph that draws a BruControl Global
> which is not imported yet keeps its name, and its line fills once that Global comes in.
>
> BruControl's Charts are DevExpress drawings; Skynet draws its own (lines in the browser) and copies nothing from BruControl.

**Now:** removed

**Taken out (a sentence):**

> It used to be called the Chart Widget; BruControl still calls it a Chart.

**Now:** 
> It used to be called the Chart Widget.

**Taken out (a sentence):**

> The settings are the same as a BruControl Chart, so a BruControl Chart imports one to one:

**Now:** removed

### help/162-confirmation-widgets.md

**Taken out (the whole section "From the BruControl Importer"):**

> ## From the BruControl Importer
>
> On the Importer's item pages (Pumps, Heaters, Probes, Valves, Flow Meters, Other), you can say you have more than were found, for
> example 8 Pumps when 6 were found. The extra ones, *Pump 7* and *Pump 8*, have no Interface Port, so they become Confirmation
> Widgets ([Help 143](143-brucontrol-importer)).

**Now:** removed

### help/164-cool-warm-pump.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Importer makes a BruControl pump that had a Hysteresis (or another control) on its port, alone or beside its on/off
> output, one Cool / Warm Pump that starts in that method, with its Setpoint, offsets and probe. The report lists each one.

**Now:** kept only: ⚠ Electricity can kill. OakBarn Brewery and Skynet are not e...

### help/166-vessel-device-builder.md

**Taken out (the whole section "In the BruControl Import"):**

> ## In the BruControl Import
>
> On the Importer's **Your vessels** step, each vessel has a **🔨 Build** button. It opens this same Vessel Device Builder on the
> Importer's Build page, with the questions already filled in from that vessel's row: its Label, General Type, Volume, Height,
> Diameter, Drain, Tangential Inlet, Sparge Arm, HERMS Coil, and a Heating Element and Probe spot when the row has them. BruControl
> never knew which side a Tangential Inlet is on or where the Heating Element and Probe sit, so check those spots. The Heating Element
> and Probe pickers list the ones imported from your BruControl file, with the row's own picked first. Build the vessel, press
> **Save layout**, then go back to the Importer.

**Now:** removed

**Taken out (a sentence):**

> The BruControl Import program uses this same builder, with the same look (see below).

**Now:** removed

### help/167-dual-throw.md

**Taken out (a sentence):**

> It works like BruControl's Dual Throw output.

**Now:** removed

**Taken out (a sentence):**

> - **From BruControl:** the BruControl Importer keeps each Digital Out's Dual Throw port and delay, and lists them in the Import notes.

**Now:** removed

### help/168-predictive-hysteresis.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Importer makes every imported Hysteresis Predictive.

**Now:** kept only: A heating element's Hysteresis also keeps to the On offset r...

**Taken out (a sentence):**

> It then works the plain way, as BruControl's Hysteresis did.

**Now:** 
> It then works the plain way.

### help/169-calibrations.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Importer keeps each Analog In's and probe's calibrations in the same order, with its Decimal Places, Prefix and Suffix
> (the Suffix becomes its Units). A PWM output's BruControl calibrations are not copied, because BruControl counts a PWM output 0-255 and
> Skynet counts it in %. They are listed in the Import notes.

**Now:** removed

### help/170-hydrometers.md

**Taken out (the whole section "The BruControl Import"):**

> ## The BruControl Import
>
> A BruControl **Hydrometer Input** becomes a Tilt Hydrometer with the same Tilt Color, on the same port. The Importer's
> **Hydrometers** page lists the same Templates, with the Tilt Color and the Hardware ID.

**Now:** removed

### help/171-smoothing.md

**Taken out (the whole section "BruControl Import"):**

> ## BruControl Import
>
> BruControl's **Avg Weight** on an Analog In or temperature port becomes its **Smoothing %**. The Import notes list them.

**Now:** removed

**Taken out (a sentence):**

> It is the same idea as BruControl's **Avg Weight**.

**Now:** removed

**Taken out (a sentence):**

> empty = 1), the same as BruControl's Counter Input. The Rate

**Now:** 
> empty = 1). The Rate

### help/172-alarm-chain.md

**Taken out (a sentence):**

> In BruControl you often had to **stack** several alarms on top of each other, one for each picture and sound. In Skynet **one
> Alarm can do all of it**:

**Now:** 
> You never need to **stack** several alarms on top of each other, one for each picture and sound. **One
> Alarm can do all of it**:

**Taken out (a sentence):**

> **From BruControl:** a BruControl Timer had 2 alarms. The import joins each one that was on to its Alarm: the Alarm becomes a
> Hop Alarm on that Timer, the first time is the Alarm's own time, and a second time becomes a step on its Alarm Chain. In Skynet
> you can then add more steps (up to 20). The import notes list each one it joined.

**Now:** removed

**Taken out (a sentence):**

> A Process never
> writes `.active`. When the BruControl Import turns a BruControl Script into a Process, it always changes BruControl's
> `"alm_Brew" active = true` into `alm_Brew = true` or `alm_Brew = On`, whichever you pick.

**Now:** 
> A Process never
> writes `.active`.

### help/173-process-widget.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The **BruControl Import** makes each BruControl **Script element** a Process Widget (it used to make a Value Widget). It shows the
> BruControl Script of the same name, which becomes that Process when your Scripts come into Skynet. The variable the Script
> element showed in BruControl is kept with what BruControl had. A Script element BruControl marked as **not user controlled**
> comes in with **When tapped: none**, so a click on it does nothing, as before. See [Help 143](143-brucontrol-importer) and
> [Help 165](165-importer-item-and-widget-pages).

**Now:** removed

**Taken out (a sentence):**

> It is BruControl's **Script element**: in Skynet a script is called a
> **Process** (Rule 1.4), so this is the Process Widget.

**Now:** removed

### help/174-data-display.md

**Taken out (the whole section "BruControl Import"):**

> ## BruControl Import
>
> An item with BruControl's **Show Secondary Value** switched off gets the Data Display of its main value (Output %, ON / OFF,
> Rate or Value). The Import notes list them. Switched on (the usual) shows them all, as before.

**Now:** removed

**Taken out (a sentence):**

> BruControl had a Primary Value and a Show Secondary
> Value switch; Skynet lists every value the Device has.

**Now:** 
> Skynet lists every value the Device has.

**Taken out (a sentence):**

> **BruControl's Primary Value:** a Flow meter's `.value` is the value its Data Display shows: its Rate, or its Total when Total is
> picked. So a BruControl script that reads the Primary Value works either way.

**Now:** 
> **Its main value:** a Flow meter's `.value` is the value its Data Display shows: its Rate, or its Total when Total is
> picked.

### help/175-alarm-email.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> The BruControl Import keeps each Alarm's **Email Notification** switch. BruControl's own mail settings are not copied: pick
> your mail server in Skynet's Settings as in step 1.

**Now:** removed

### help/176-time-formats.md

**Taken out (the whole section "From BruControl"):**

> ## From BruControl
>
> BruControl Timers and time Globals had a **Format** box with the same letters. The BruControl Import keeps a Timer's Format. A
> Time or DateTime Global's Format is kept in the Globals list, so when Globals are imported each one becomes a Time or DateTime
> Widget that shows the same way.

**Now:** kept only: See also [Value, Time and DateTime Widgets](134-value-time-a...

### help/179-heating-element-look.md

**Taken out (the whole section "BruControl Import"):**

> ## BruControl Import
>
> The Importer's first Control Type column for a Heating Element is **Direct Only**. A heater that BruControl marked as not user
> controlled becomes a Toggle, since a Heating Element can not have None.

**Now:** kept only: ⚠ Electricity can kill. OakBarn Brewery and Skynet are not e...

### help/181-heat-hysteresis-switched-by.md

**Taken out (the whole section "The BruControl Import"):**

> ## The BruControl Import
>
> BruControl does not say what switches a heater, so each imported heating element starts as an **Optical SSR**. A Hysteresis On
> offset outside 0.5 to 3 °F is brought to the nearest end of that range, and the Import notes list each one. If a Contactor or
> Mechanical relay switches it, pick that in its Properties.

**Now:** kept only: See also: [The heating method](150-heating-method), [Predict...

## Hover Help and screen text

### public/app.js: hover help or screen text

**Taken out:**

> For a Flow meter it is also its Value (BruControl\'s Primary Value): Flow_1.value is its Total when Total is picked.

**Now:**

> For a Flow meter it is also its Value: Flow_1.value is its Total when Total is picked.

### public/app.js: hover help or screen text

**Taken out:**

> top to bottom, like BruControl\'s layered calibrations.

**Now:**

> top to bottom.

### public/app.js: hover help or screen text

**Taken out:**

> 'Smoothing (Rule 6.24, BruControl\'s Avg Weight):

**Now:**

> 'Smoothing (Rule 6.24):

### public/app.js: hover help or screen text

**Taken out:**

> over this many seconds, as BruControl\'s Counter Input, then smoothed.

**Now:**

> over this many seconds, then smoothed.

### public/app.js: hover help or screen text

**Taken out:**

> in seconds, like BruControl\'s Span: 3600

**Now:**

> in seconds: 3600

### public/app.js: hover help or screen text

**Taken out:**

> with the newest readings, in seconds, like BruControl\'s Refresh interval.'

**Now:**

> with the newest readings, in seconds.'

### public/app.js: hover help or screen text

**Taken out:**

> 'Layer Order, like BruControl\'s Z Order: which one

**Now:**

> 'Layer Order: which one

### public/processwidget.js: hover help or screen text

**Taken out:**

> (Rule 1.2). It is BruControl\'s Script element.'

**Now:**

> (Rule 1.2).'

### public/index.html: hover help or screen text

**Taken out:**

> Office Black is the closest to BruControl's own Office 2019 Black.

**Now:** removed

### public/index.html: hover help or screen text

**Taken out:**

> so BruControl can still use it

**Now:**

> so other programs can still use it

### public/themes.js: hover help or screen text

**Taken out:**

> like: 'BruControl Office 2019 Black'

**Now:**

> like: 'Office 2019 Black'

### public/themes.js: hover help or screen text

**Taken out:**

> like: 'BruControl Office 2019 Dark Gray'

**Now:**

> like: 'Office 2019 Dark Gray'

### public/themes.js: hover help or screen text

**Taken out:**

> like: 'BruControl Office 2019 White or Colorful'

**Now:**

> like: 'Office 2019 White or Colorful'

### public/naming.js: the Device Type list (shared with the Importer)

**Taken out:**

> '10KNTC': '10K NTC thermistor (BCS-462 and BruControl type)'

**Now:**

> '10KNTC': '10K NTC thermistor (BCS-462 type)'

### public/naming.js: the pin picker

**Taken out:**

> A3 = pin 57 (BruControl)

**Now:**

> A3 = pin 57

### public/app.js: the analog pin list

**Taken out:**

> A0 = pin 54 (BruControl)

**Now:**

> A0 = pin 54

### public/app.js: the Add Device list

**Taken out:**

> NTC thermistor 10K, BCS-462 / BruControl type, Beta 3977 (analog pin)

**Now:**

> NTC thermistor 10K, BCS-462 type, Beta 3977 (analog pin)

### public/app.js: the probe settings (NTC, LM35, TMP36)

**Taken out:**

> Analog pin (A0-A15, or BruControl 54-69)

**Now:**

> Analog pin (A0-A15, or 54-69)
