# Sandbox folder

Schemas set aside for later (OakBarn Brewery, 2026-11-08, Rule 16.8). Only the **3 Vessel 1 Pump** sample
(`samples/configs/three-vessel-one-pump`) ships with Skynet for now: it is the test bed and is kept up to every new Rule. The
Schemas below are kept here, untouched, so they can be put back later (most of them will likely be rebuilt as Schema Templates).
They are **not** brought up to new Rules while they wait here. The panel does not use this folder, and it is left out of the
release zip and the installer.

To put one back: bring it up to the current Rules, then move its folder into `sample_schemas/` (repo top), so it ships in the
add-only Skynet Sample Schemas Setup (Rule 9.13), one at a time. The panel itself ships only the 3 Vessel sample.

| File or folder here | Was | What it was |
|---|---|---|
| `samples/configs/two-vessel-one-pump/` | `samples/configs/two-vessel-one-pump/` | Sample "Two vessels, one pump" (electric kettle and mash tun) |
| `samples/configs/brewzilla-brew-day/` | `samples/configs/brewzilla-brew-day/` | Sample "BrewZilla brew day (no board)" |
| `config/brewery.json` | `config/brewery.json` | The old default Schema "Skynet Brew Panel" (Tabs Brewery, Batch Hops, Variables Demo, Equipment). A new panel now starts with the 3 Vessel 1 Pump sample instead. |
| `scripts/*.txt` | `scripts/*.txt` | The old default Schema's Processes (Close_All_Valves, Demo_Heat_HLT, Demo_Hop_Stand, Demo_Mash_Steps, Demo_Transfer_HLT_to_MLT, Demo_Variables, Hops_Order_Boil, looper_LogTemps). A new panel now starts with the 3 Vessel 1 Pump sample's Processes. |

## Help text set aside

| File here | What it is |
|---|---|
| `help/BruControl_Help_Extract.md` | Every BruControl sentence and section taken out of the Skynet Panel Help, Hover Help and README (OakBarn Brewery, 2026-11-10, Rule 11.3), with where it was and what is there now. It is the starting point for the Importer Help, written after the Skynet Panel Help is finished. Nothing in it is shown by the panel. |
| `Importer/Importer_Notes.md` | The Importer Sandbox (OakBarn Brewery, 2026-11-12, Rule 11.3): notes said to be for the Importer version only, with where each goes, kept until the Big Merge moves them into the Importer. |
