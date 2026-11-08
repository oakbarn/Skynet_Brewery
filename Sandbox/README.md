# Sandbox folder

Schemas set aside for later (OakBarn Brewery, 2026-11-08, Rule 16.8). Only the **3 Vessel 1 Pump** sample
(`samples/configs/three-vessel-one-pump`) ships with Skynet for now: it is the test bed and is kept up to every new Rule. The
Schemas below are kept here, untouched, so they can be put back later (most of them will likely be rebuilt as Schema Templates).
They are **not** brought up to new Rules while they wait here. The panel does not use this folder, and it is left out of the
release zip and the installer.

To put one back: move its folder (or file) back to the same path outside `Sandbox/`, then bring it up to the current Rules.

| File or folder here | Was | What it was |
|---|---|---|
| `samples/configs/two-vessel-one-pump/` | `samples/configs/two-vessel-one-pump/` | Sample "Two vessels, one pump" (electric kettle and mash tun) |
| `samples/configs/brewzilla-brew-day/` | `samples/configs/brewzilla-brew-day/` | Sample "BrewZilla brew day (no board)" |
| `config/brewery.json` | `config/brewery.json` | The old default Schema "Skynet Brew Panel" (Tabs Brewery, Batch Hops, Variables Demo, Equipment). A new panel now starts with the 3 Vessel 1 Pump sample instead. |
| `scripts/*.txt` | `scripts/*.txt` | The old default Schema's Processes (Close_All_Valves, Demo_Heat_HLT, Demo_Hop_Stand, Demo_Mash_Steps, Demo_Transfer_HLT_to_MLT, Demo_Variables, Hops_Order_Boil, looper_LogTemps). A new panel now starts with the 3 Vessel 1 Pump sample's Processes. |
