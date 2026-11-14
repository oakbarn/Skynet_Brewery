# Settings

## Start from a sample Schema (admins)

Ready-made brewery Schemas: **Two vessel, one pump**, **Three vessel, one pump** and **BrewZilla brew day**. Every board starts on the simulator. Loading one replaces your Tabs, Devices and Widgets; a copy of your current Schema is saved first in `config/backups` on the Pi.

## My account

Change your own password. Every other phone or computer signed in as you is signed out.

## Users (admins)

Add people and give each a role:

| Role | Can do |
|---|---|
| **Viewer** | Watch only. |
| **Operator** | Brew day: switch pumps and valves, set values, start and stop processes, import a recipe. |
| **Admin** | Everything, including layout, processes, devices, settings, users and editing this manual. |

## Simulation (admins)

Try a brew day without touching any hardware, with time running faster or skipping ahead. See [Simulation mode](20-simulation).

## Panel settings (admins)

- **Title**: the name at the top of the screen.
- **Look (theme)**: how the whole Panel looks (Office Black, Dark Gray, White or Skynet Night), saved right away. **Use this Look
  on every Tab** gives every Tab the Look's colors, and **Put the Tabs back** undoes it. See [Panel Looks (themes)](151-panel-looks).
- **Media folders**: where pictures and sounds are kept, one per line.
- **API key**: the password other programs (Node-RED and the like) must send. See [API](11-api).
- **BeerXML mapping**: which variables a BeerSmith recipe fills.
- **Start these processes when the server starts**: tick processes that should always run.

## Panel settings: screen, Tabs and alerts (admins)

These change things already made and how the whole panel works, for every Schema (they used to be on the Default tab; Skynet Rule 2.42). What a **new** thing starts with is on [Default settings](155-default-settings).

- **Tabs**: **Tab Style**, the look of every Tab that has no Tab Style of its own ([Tab Styles](101-tab-styles)).
- **Menu Bar**: hide the Menu Bar on Tabs ([The Menu Bar](40-menu-bar)).
- **Sound**: **Sound on** (this screen, right now) and **Turn Sound On when starting**.
- **On startup**: the Zoom and Full screen the panel starts with ([Zoom and Full screen](41-zoom-and-full-screen)).
- **Rich Text Embedded Code**: **\L Rich Text Code Size (px)**.
- **Hover Help**: **Hover Delay (ms)** ([Hover help in dialogs](147-hover-help)).
- **Phones and tablets**: can they edit, and move things ([Phones and tablets](45-phones-and-tablets)).
- **Grain weight label** and the gravity points label ([Recipe tab](99-recipe-tab)).
- **Hop alerts**: warning minutes, joining alerts, a sound, saying them out loud, and the browser voice.
- **Order of the Menu**: type a number to move a Menu tab.

Press **Save** under them.

## Pictures

How PNG and JPG pictures get their sharp SVG copies. See [Media](07-media).
