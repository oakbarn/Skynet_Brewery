# Vessel Widget

The **Vessel Widget** is a class of vessel (Skynet Rule 5.31). It starts from **one Skynet Template, Skynet_Vessel_Widget**, that
has every spot a brew vessel can have, each with a **Place** slider:

- **IPs:** Outlet (center bottom), Second Outlet, Tangential (whirlpool), Top Inlet, Sparge, CIP and Steam Slayer
- **one Temperature Probe**, seen as a **Thermowell** (in from the side) or from the **Front**
- **one Element Port** (the heating element)

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

## Your own additions

You can still add your own Devices and Widgets to a Vessel Widget, and **Bundle** them with it to make a **User Bundled Template**
(Help: Add a Vessel).

## In the samples

The **Three Vessel** sample's Hot liquor tank, Mash tun and Boil kettle are Vessel Widgets: each one has its Outlet, a Thermowell
and, on the HLT and the Boil kettle, the Element Port Placed. The Mash tun and the Boil kettle have their Top Inlet Placed too.

## Size

A Vessel Widget is sized by its **Gallons** (10 to start): see Help **Vessel sizing by gallons**.
