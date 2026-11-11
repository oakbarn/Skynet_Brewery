# Vessel Widget

The **Vessel Widget** is a class of vessel (Skynet Rule 5.31). It starts from **one Skynet Template, Skynet_Vessel_Widget**, that
has every spot a brew vessel can have, each with a **Place** slider:

- **16 IPs**, laid out from the Skynet Vessel IP Template drawing:
  - **Right side**, top to bottom: **Right Sparge**, **Right HERMS In**, **Right HERMS Out**, **Right Element**
  - **Left side**, the same: **Left Sparge**, **Left HERMS In**, **Left HERMS Out**, **Left Element**
  - **Left Back Element**, **Center Back Element** and **Right Back Element** (seen from the front, level with the side Elements)
  - **Center Probe**, **Left Tangential** and **Right Tangential**, **Center Outlet**, and the **Center Bottom Outlet** on the
    bottom
- **one Temperature Probe**, seen from the **Front** (on the Center Probe spot) or as a **Thermowell** (in from the side)
- **one Element Port** (the heating element, on the Right Element spot)

**The names are only general.** Anything with an IP can go on any of them: an Element on a HERMS spot, a pipe on a Back Element
spot, and so on. There are no limits on which IP is used for what.

**Each IP has a Label** that starts the same as its Name. Change it in Vessel Widget Properties, next to the IP's Place slider
(for example "Whirlpool return" for Right Tangential). The Label is the text shown by the IP; empty it and it goes back to the Name.

On the Template every Place slider is on. The idea: Skynet builds kettle Templates from it with the sliders set to match real
kettles. You pick the one closest to yours, slide off what your kettle does not have, and it matches.

## IPs on a vessel

An IP on a vessel is a **TC, NPT or BSP outlet or inlet**. Which type does not matter: an IP is a place to connect another
Device or Widget that has its own IP, such as a Pipe, a Hose, a Fitting, or anything else with an IP.

## Place

- **Place on:** it is on the vessel and works. An IP joins pipes, hoses and fittings. The Probe and the Element show their
  pictures, and the Element glows while its heater is on.
- **Place off (Not Placed):** it is not there at all. Nothing shows on the Tab, and no pipe or Process can use it. It is hidden
  even on the 🔨 Build Tab and in Edit layout, and its slider is hidden in Vessel Widget Properties. Press **👁 Show All** in the
  Properties to list the Not Placed spots (so you can Place one) and to see faint marks where they would go (a dashed ring for an
  IP, a faint picture for the Probe or Element). Press **🙈 Hide Not Placed** to hide them again (Vessel Rule 19.4).

The spots are set by the Template: **nobody can move them**. A locked vessel moves only by its X and Y (Rule 2.12), and its IPs go
with it.

## Making one

Edit layout > **Vessel** > **Vessel Widget ...**, then pick **Skynet_Vessel_Widget** under **Vessel Widget**. It goes on the
🔨 Build Tab (Rule 4.1). Double-click it to open **Vessel Widget Properties** and set the Place sliders, the Probe type, and the
Devices.

## The Probe and the Element

When the Temperature Probe or the Element Port is Placed, pick the Device it uses under **Devices** (a Temperature Probe, or a
heating element output such as a Hysteresis or PID). Making that Device right from the vessel (picking its Interface, Port and
Probe Type) is waiting on a decision about Rule 5.7.

## The Vessel Device

A Vessel built from a Vessel Widget Template is a **Vessel Device**: a special Device, made like the **RIMS tube** (the RIMS tube is
a small Vessel Device whose Element and Probe are already set and locked). In its Properties, under each Placed IP, **On this IP**
picks what is built into that IP:

- **Nothing**: an open IP, for a Pipe, Hose or Fitting
- **Heating Element**
- **Temperature Probe** or **Thermowell with its Temperature Probe** (pick the probe type, then its Port or OneWire probe number)
- **Motorized Valve**

Pick the **Interface** (board) the parts are wired to once, then each part's **Port**. A part is not a separate Device: it is part
of the vessel, it shows on the vessel at its IP, and it gets a small reading (On / Off, or the temperature) beside the vessel, the
way the RIMS tube's do. It can't be deleted on its own. An Element, Probe or Thermowell fills its IP, so no flow goes through it;
a Valve lets flow through only while it is on.

**Each part has its own Properties.** In Edit layout, double-click a built in Heating Element, Thermowell or Probe on the vessel
(on a phone or tablet, hold a finger on it). Its own Properties open, the same as a Heating Element's or a Temperature Probe's of its
own: Label, Interface and Port, Name, Toggle, Overlay, Heating method and so on. Its Tab shows as **Built into** (the vessel). The
vessel's own Properties also have a **Heating Element** section and a **Thermowell / Probe** section with the main settings and a
button to the part's own Properties. When the vessel has none, that section is empty and greyed out.

**After it is built, only what can really change is in its Properties.** Once the vessel is built (with the Vessel Device Builder,
or saved on a Tab) its Properties show its Name (✏ Change name), its Type (greyed out), its Label, Visible, Hidden Locked, Label and
place, and the Heating Element and Thermowell / Probe sections. Those you can change: Label, Heating method, Setpoint, Units and
so on. Their **Interface and Port are greyed out for good**: the vessel locks them (Skynet Rule 5.31), and a built in part can't be
swapped. If the heater or probe itself wears out, put in a new one wired exactly the same way to the same Port; nothing changes in
Skynet. Its **Size** can still change: Gallons, Method, Diameter and Height, with the read only **Calculated Volume**, Dead space and Safe
Element Volume (Help: Vessel sizing). Its IPs, HERMS coil, Drain, Tangential and Sparge / Steam Slayer can't change, so they are not shown.

**Plugged openings hide their IP.** An Element, Probe or Thermowell plugs its opening, just like an End Cap, so its IP is
hidden and no pipe or hose can join it. Only the open IPs show. A Valve's IP still shows, because flow goes through it.

**HERMS coil:** pick **Left**, **Right**, or a crossed coil (**Outlet Right & Inlet Left**, **Outlet Left & Inlet Right**). The coil is drawn under that side's **HERMS In** and **HERMS Out** IPs, shaped to fit
them, and the two IPs become the coil's two ends: flow that goes in one comes out of the other.

**Once it is built and saved there is no way back.** After 💾 Save Build ... > To a Tab and Save layout, its IPs, the parts built
into them and its HERMS coil are locked for good, and it can't be un-bundled. Its Name, Labels, Gallons, Tab and place can still
change. (One exception to Skynet Rules 5.7 and 5.31.)

## Your own additions

You can still add your own Devices and Widgets to a Vessel Widget, and **Bundle** them with it to make a **User Bundled Template**
(Help: Add a Vessel).

## In the samples

The **Three Vessel** sample's Hot liquor tank, Mash tun and Boil kettle are **Vessel Devices** built from the Main Template
(locked, like a RIMS tube). Each one has its **Center Bottom Outlet** Placed (piped to its outlet valve) and a **Thermowell with
its Temperature Probe** built into its **Left Element** IP. The Hot liquor tank and the Boil kettle have their **Heating Element**
built into the **Right Element** IP, and the Mash tun and the Boil kettle have their **Left Sparge** IP Placed for the pipe in at
the top. The probes and elements are the same Devices as before, with the same Ports. Since 2026-11-08 they have the Skynet names
(BM_700_TEMP@1W_HLT_BH, BM_8_DO@HE_HLT~element_BH and so on, Rule 3.1), and the brew day Processes use those names.

## Size

A Vessel Widget is sized by its **Gallons** (10 to start): see Help **Vessel sizing by gallons**.
