# BruControl stock pictures: swap them for Skynet pictures (Importer only)

Status: **plan only.** The 11 new OakBarn backup pictures were approved by OakBarn Brewery on 2026-11-15 ("Set B"). The Importer is on hold until the Skynet Panel is done, so this sits in the
Importer Sandbox (Rule 11.3) until the Big Merge. No Importer code is changed yet.

## Why

BruControl comes with a set of small stock pictures. They belong to BruControl's makers, so Skynet may not copy or ship them
(copyright, Rule 9.12 and docs/Media_Licenses.csv). The Importer runs on the BruControl computer and copies the brewer's
pictures, so it must never copy these. The brewer chooses a Skynet Device or Widget in its place, with a new OakBarn picture as the backup.
The brewer's own pictures still copy as they do now (into media\Images\User, originals never moved or deleted).

## The 11 stock pictures (named as OakBarn Brewery sent them, 2026-11-15)

The pictures themselves are **not** in this repo (it is public). OakBarn Brewery's copies are in the private project files.
Each is a white symbol on a coloured square, 640 x 512 pixels.

OakBarn Brewery (2026-11-15): "I generally did not use them but I know user who did. I think there are some in Tartan other users did
so we have to come up with our own 11." Then: "Keep these as a backup but generally you would ch a device or Skynet Widget."

So each of the 11 is handled in two ways:

1. **Normally: the brewer chooses a Skynet Device or Widget** (an Interview question, see below). The item becomes that Device or
   Widget, drawn by Skynet. OakBarn Brewery, 2026-11-15: "actally for Pump need to select one of our Pumps!", "Sam with Kettle, Pick
   or create in impoter" and "snd and On Off choose a Skynet Boolean Widget".
2. **Backup: the new OakBarn picture** ("Set B", approved by OakBarn Brewery 2026-11-15), only when the brewer still wants a
   picture after the Importer steers them toward a Device or Widget. All 11 are drawn from scratch (not traced or copied), the same shape as
   BruControl's (160 x 128, a rounded coloured square with a white symbol) so they sit in the same spot on an imported Tab.
   Names follow the Skynet name characters (letters, numbers, _ only).

| BruControl picture | What it shows | Normally: the brewer chooses (examples) | Backup: OakBarn picture | What ours shows |
|---|---|---|---|---|
| Valve.png | Valve symbol (bow tie) | A Valve Device (motorized ball, butterfly, solenoid ...) | `Images/Skynet/Miscellaneous/Skynet_Icon_Valve.svg` (Skynet Picture 208) | Valve with a handle on top |
| Pump.png | Impeller in a circle | One of Skynet's own pumps, or a new Pump Device | `Images/Skynet/Miscellaneous/Skynet_Icon_Pump.svg` (Skynet Picture 206) | Pump housing with inlet and outlet |
| Kettle.png | Pot | One of Skynet's own vessels, or a new one from the Vessel Device Builder (Rule 19.5) | `Images/Skynet/Miscellaneous/Skynet_Icon_Kettle.svg` (Skynet Picture 201) | Pot with handles and liquid |
| On-Off.png | Power button symbol | A Skynet Boolean Widget (Rule 1.20): Switch, Slider, Checkbox, Lighted Button or LED | `Images/Skynet/Miscellaneous/Skynet_Icon_On_Off.svg` (Skynet Picture 204) | ON slide switch |
| Liquid Temp.png | Thermometer in liquid | A temperature probe Device | `Images/Skynet/Miscellaneous/Skynet_Icon_Liquid_Temp.svg` (Skynet Picture 203) | Probe dipping into a pot of liquid |
| Clock.png | Clock face | A Skynet Timer or Time Widget | `Images/Skynet/Miscellaneous/Skynet_Icon_Clock.svg` (Skynet Picture 198) | Stopwatch |
| Fan.png | Fan blades in a circle | A fan Device (On / Off or PWM) | `Images/Skynet/Miscellaneous/Skynet_Icon_Fan.svg` (Skynet Picture 199) | Four blade fan in a square housing |
| Guage.png | Dial gauge | A Skynet Gauge Widget | `Images/Skynet/Miscellaneous/Skynet_Icon_Gauge.svg` (Skynet Picture 200) | Half dial with a needle |
| Liquid Level.png | Water drop with a level line | A level or volume Device | `Images/Skynet/Miscellaneous/Skynet_Icon_Liquid_Level.svg` (Skynet Picture 202) | Tank with liquid and an up/down arrow |
| PID.png | Sigma sign | A Heating Element with the PID Method | `Images/Skynet/Miscellaneous/Skynet_Icon_PID.svg` (Skynet Picture 205) | The word PID over a settling curve |
| PWM.png | Square wave | A PWM Device | `Images/Skynet/Miscellaneous/Skynet_Icon_PWM.svg` (Skynet Picture 207) | Square wave with changing widths |

The 11 backup pictures are added as Skynet media (PR #406, media/Images/Skynet/Miscellaneous) together with the Daisy Chain pictures (OakBarn Brewery, 2026-11-15: "They can be
added with the daisy chain ones"), so they go out in the same Media Setup update, each with its row in docs/Media_Licenses.csv
(OakBarn Brewery's own). The swap plan itself stays here in the Sandbox until the Big Merge.
Like every new picture, they go in the Image Library only when OakBarn Brewery says so.

## The Interview question

OakBarn Brewery, 2026-11-15: "Keep as Backups but steer user in import away from use."

When the Importer finds a stock picture, it asks the brewer what the item should become, naming the BruControl item and Tab:

1. **First, and recommended:** the Devices or Widgets in the "Normally" column for that picture. The first one is picked
   (the default), marked "Recommended".
2. **Last, below a line:** "Keep a picture: use the OakBarn picture". Under it, a plain grey note steers the brewer away:
   "Not recommended. A picture only shows; it does not control or read anything. A Skynet Device or Widget does."

Until answered, the item keeps a Placeholder. Not built yet: show OakBarn Brewery the question wording before building (like the
other Interview questions in `Sandbox/Importer/Interview_Questions.md`).

## How the Importer will spot them (when built)

A stock picture is caught two ways, so a renamed copy is still caught:

1. **By what is inside the file** (its fingerprint, SHA-256). The same picture under any name or in any folder is caught.
2. **By file name**, when the fingerprint does not match (another BruControl version): the 11 names above, any capitals.
   The Importer then asks the brewer first: "This looks like a BruControl stock picture. Treat it as one?" (Yes default).

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

- It is **not copied**. The item becomes the Device or Widget the brewer chose, or keeps a picture: its OakBarn backup picture.
- The import report lists each swap: "BruControl stock picture Valve.png: now a Valve Device" or "... swapped for Skynet_Icon_Valve.svg".
- The brewer's BruControl files are never touched (Rule 15.4: originals stay where they were).

## Checked

- The OakBarn Brewery BruControl config (the one on file) uses **none** of the 11; its pictures are all in C:\BruControl\Media.
- None of the 11 is in the Skynet repo, the Setups or the Media zip. So the Skynet Panel needs no change: Importer only.
