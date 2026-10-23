# Skynet Vessels

A **Skynet vessel** is a Tab_Vessel made from a Skynet Vessel Template: a kettle, an HLT, a mash tun, an all-in-one and so on. Like a [Skynet Fitting](60-skynet-fittings), it is one unit:

- **Every opening has an IP built in**, where the Template puts it on the picture. Each one is two-way.
- The IPs can't be moved, set or taken off, and the vessel can't be un-bundled. The Bundled Fittings on its ports belong to it and move with it.
- Its **Properties** have no port or IP settings.

Vessels you make from a User Bundled Template keep their port settings: you place the IPs and bundle them yourself. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

## Its Properties

In **Edit layout**, double-click the vessel (or one of its IPs). You set:

- **Name**, **Type** and **Display Name**.
- **Heating Element: Select Device or None**, on an electric vessel. The **E** mark on the picture shows where the element goes in. It glows while that Device is on.
- **Temperature Probe: Select Temperature Probe or None**, on a vessel with a thermowell (the **T** mark).
- **Flip Horizontal**, **Flip Vertical** and **Rotate** (45 degree steps), the same as a [Skynet Fitting](60-skynet-fittings). The picture turns, and its IPs and the fittings on its ports (with their End Caps) turn with it about the middle of the vessel. Turned 90 or 270 degrees, the vessel's box turns too, so a tall kettle lies wide.
- The Display Name settings, the Tab, the place and the size. Drag the corner to make it bigger or smaller: the IPs stay on their openings.

Double-clicking a fitting on one of its ports opens that fitting's own Properties.

## Electric kettles and HLTs

The electric Skynet kettles (the ones whose name ends in **_Electric**, plus **HLT** and **Brew_Kettle**) come with:

- an **Outlet** with a valve fitting,
- a **Thermowell** above the outlet, for the Temperature Probe,
- a spot for the **Heating element** (the E mark, low on the right side).

## All-in-one kettles

These have the element built in, so they only come as electric Templates. Their own thermometers can't be read by the panel, so there is no probe to pick.

| Template | Looks like |
|---|---|
| **Kettle_Brewzilla_Electric** | Tall, recirculation arm up the left side, tap at the bottom middle |
| **Kettle_DigiBoil_Electric** | Tall with a domed lid, tap at the bottom middle |
| **Kettle_Grainfather_Electric** | Tall on a black base, recirculation arm up the right side and over the lid, outlet at the bottom middle |
| **Kettle_Foundry_Electric** | Wide and short with a black lid, drain valve on the front near the bottom |

The pictures are plain drawings with no maker's name or logo on them.

## Older Tab_Vessels

Tab_Vessels that came from a Skynet Template before this change become Skynet vessels by themselves. If you dragged one of their IPs somewhere else, open the vessel's Properties and press **Save**: the IPs go back onto their openings.
