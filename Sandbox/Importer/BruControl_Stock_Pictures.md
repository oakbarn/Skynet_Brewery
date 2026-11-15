# BruControl stock pictures: swap them for Skynet pictures (Importer only)

Status: **plan only, waiting for OakBarn Brewery's OK.** The Importer is on hold until the Skynet Panel is done, so this sits in the
Importer Sandbox (Rule 11.3) until the Big Merge. No Importer code is changed yet.

## Why

BruControl comes with a set of small stock pictures. They belong to BruControl's makers, so Skynet may not copy or ship them
(copyright, Rule 9.12 and docs/Media_Licenses.csv). The Importer runs on the BruControl computer and copies the brewer's
pictures, so it must never copy these. Each one is swapped for a new picture OakBarn Brewery makes.
The brewer's own pictures still copy as they do now (into media\Images\User, originals never moved or deleted).

## The 11 stock pictures (named as OakBarn Brewery sent them, 2026-11-15)

The pictures themselves are **not** in this repo (it is public). OakBarn Brewery's copies are in the private project files.
Each is a white symbol on a coloured square, 640 x 512 pixels.

OakBarn Brewery (2026-11-15): "I generally did not use them but I know user who did. I think there are some in Tartan other users did
so we have to come up with our own 11." So **every one of the 11 gets its own new OakBarn drawing**, one for one, drawn from scratch
(not traced or copied). Same shape as BruControl's (160 x 128, the same 5 x 4 look) so it sits in the same spot on an imported Tab:
a rounded coloured square with a white symbol. Names follow the Skynet name characters (letters, numbers, _ only).

| BruControl picture | What it shows | New OakBarn drawing | What ours shows |
|---|---|---|---|
| Valve.png | Valve symbol (bow tie) | `Skynet_Icon_Valve.svg` | Valve with a handle on top |
| Pump.png | Impeller in a circle | `Skynet_Icon_Pump.svg` | Pump housing with inlet and outlet |
| Kettle.png | Pot | `Skynet_Icon_Kettle.svg` | Pot with handles and liquid |
| On-Off.png | Power button symbol | `Skynet_Icon_On_Off.svg` | ON slide switch |
| Liquid Temp.png | Thermometer in liquid | `Skynet_Icon_Liquid_Temp.svg` | Probe dipping into a pot of liquid |
| Clock.png | Clock face | `Skynet_Icon_Clock.svg` | Stopwatch |
| Fan.png | Fan blades in a circle | `Skynet_Icon_Fan.svg` | Four blade fan in a square housing |
| Guage.png | Dial gauge | `Skynet_Icon_Gauge.svg` | Half dial with a needle |
| Liquid Level.png | Water drop with a level line | `Skynet_Icon_Liquid_Level.svg` | Tank with liquid and an up/down arrow |
| PID.png | Sigma sign | `Skynet_Icon_PID.svg` | The word PID over a settling curve |
| PWM.png | Square wave | `Skynet_Icon_PWM.svg` | Square wave with changing widths |

The drawings wait in the private project files (brucontrol-stock-pictures/oakbarn_drawings) for OakBarn Brewery's OK. Once OK'd they
come into the repo with the Importer at the Big Merge, each with its row in docs/Media_Licenses.csv (OakBarn Brewery's own).
Like every new picture, they go in the Image Library only when OakBarn Brewery says so.

## How the Importer will spot them (when built)

A stock picture is caught two ways, so a renamed copy is still caught:

1. **By what is inside the file** (its fingerprint, SHA-256). The same picture under any name or in any folder is caught.
2. **By file name**, when the fingerprint does not match (another BruControl version): the 11 names above, any capitals.
   The Importer then asks the brewer: "This looks like a BruControl stock picture. Use the Skynet picture instead?" (Yes default).

Fingerprints of the copies OakBarn Brewery sent:

| File | SHA-256 |
|---|---|
| Clock.png | 225ed77d3d2c34c8d5ef22c5c31a5414172fd2fc806bad2dbfcca768bb9329a3 |
| Fan.png | 1fd3d858d31da32a4eedf13df47190dc1d3b182a2f29c523f8f82c2c76fbaa48 |
| Guage.png | 5d23e20bea9a08fa0f4271514176d80a46653c16539fe87dc98088b8429a6135 |
| Kettle.png | ee35d0479d26f1f18017582d209cc9e17095d43857233f393969fdf5d53d6960 |
| Liquid Level.png | a765f8316ec48715a7a4353a1ada5aef71c8b74b65e40274e3d6aa74d82b5c41 |
| Liquid Temp.png | b391ebdae0ca03caf75d7a0c2ae027d5c3f4669d5df091ed484fea8d528f0eaf |
| On-Off.png | fca50680d1f70763fa2ac6e36ee176b97aa1efde0dee8012cad37f54acd7748f |
| PID.png | 087888cf1d575821294da2d4275c90cdc3b69cb8172ffa1e2c47bd7b426c18e0 |
| PWM.png | 76b80ad6a136c696f34522d71854314cc1a1974fb7db0228a43a3d330d7e3159 |
| Pump.png | ac1f6e2d947b5f6666233a322ec8fc56c0eae3318d31121d39203849e232a8bf |
| Valve.png | 7dcbf3e31ccbf5380b03d4ee8a0ba7679a1cc2d11dc2f1958249fa37c7c568d4 |

What happens to a caught picture:

- It is **not copied**. The item points to its new OakBarn drawing instead.
- The import report lists each swap: "BruControl stock picture Valve.png swapped for Skynet_Icon_Valve.svg".
- The brewer's BruControl files are never touched (Rule 15.4: originals stay where they were).

## Checked

- The OakBarn Brewery BruControl config (the one on file) uses **none** of the 11; its pictures are all in C:\BruControl\Media.
- None of the 11 is in the Skynet repo, the Setups or the Media zip. So the Skynet Panel needs no change: Importer only.
