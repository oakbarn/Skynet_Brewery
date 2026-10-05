# Settings

## Start from a sample (admins)

Ready-made breweries: **OakBarn BruControl**, **Two vessel, one pump**, **Three vessel, one pump** and **BrewZilla brew day**. Every board starts on the simulator. Loading one replaces your tabs, elements and devices; a copy of your current setup is saved first in `config/backups` on the Pi.

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
- **Media folders**: where pictures and sounds are kept, one per line.
- **API key**: the password other programs (Node-RED and the like) must send. See [API](11-api).
- **BeerXML mapping**: which variables a BeerSmith recipe fills.
- **Start these processes when the server starts**: tick processes that should always run.

## Pictures

How PNG and JPG pictures get their sharp SVG copies. See [Media](07-media).
