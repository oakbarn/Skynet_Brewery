# Vessel Widget

The **Vessel Widget** is a class of vessel (Skynet Rule 5.31). It starts from **one Skynet Template, Skynet_Vessel_Widget**, that
has every spot a brew vessel can have, each with a **Place** slider:

- **15 IPs**, laid out from Fritz's Vessel IP Template drawing (2026-11-05):
  - **Right side**, top to bottom: **Right Sparge**, **Right HERMS In**, **Right HERMS Out**, **Right Element**
  - **Left side**, the same: **Left Sparge**, **Left HERMS In**, **Left HERMS Out**, **Left Element**
  - **Left Back Element** and **Right Back Element** (seen from the front, level with the side Elements)
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
Probe Type) is waiting on Fritz's decision about Rule 5.7.

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

**Plugged openings hide their IP.** An Element, Probe or Thermowell plugs its opening, just like an End Cap, so its IP is
hidden and no pipe or hose can join it. Only the open IPs show. A Valve's IP still shows, because flow goes through it.

**HERMS coil:** pick **Left** or **Right**. The coil is drawn under that side's **HERMS In** and **HERMS Out** IPs, shaped to fit
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
the top. The probes and elements are the same Devices as before (HLT_Temp, HLT_Heat and so on), with the same Ports, so the brew
day Processes work as they did.

## Size

A Vessel Widget is sized by its **Gallons** (10 to start): see Help **Vessel sizing by gallons**.
