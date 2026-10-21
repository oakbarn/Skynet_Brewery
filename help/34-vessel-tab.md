# The Vessel tab

The **Vessel** tab (in the **☰ Menu**) sets up one vessel of the Equipment Profile at a time. Chillers, coils and trub filters open here too. A profile can have as many vessels as you need.

1. Press **☰ Menu** and pick **Vessel**. It works on the profile open on the Equipment Profile tab, or the profile of the Tab you are on.
2. Pick a vessel in the dropdown, or **Add new vessel ...**.
3. Fill in its settings (below), then press **Save**.
4. **Save and put on Equipment tab** also draws it on the Equipment tab with its ports as IPs.

**Delete** takes it out of the profile. If it is drawn on a tab, the drawing stays there.

## Type

**HLT**, **Brew Kettle**, **Mash Tun**, **RIMS**, **HERMS**, **Fermenter** or **Other**. For Other, type what it is in **Other Type** (for example "Grant").

## Size

- **Size** and **Dead space** (what stays in the bottom), in gallons or liters (the profile's Units).
- **Extra trub loss**.
- **Graphic**: the picture drawn on the tab.

## Heat

The **Heat Source** list depends on the Type:

| Type | Heat Sources |
|---|---|
| HLT, Brew Kettle, RIMS, HERMS | Gas, Electric, Other |
| Mash Tun | Gas, Electric, RIMS, HERMS, Other, Unheated |
| Other | Gas, Electric, RIMS, Other, Unheated |
| Fermenter | none |

Then pick the device that heats it:

- **Gas**: a valve whose **Service** is **Gas**. Set a valve's Service in its properties (Edit layout, double-click the valve): Gas, Room Temperature Liquid, or High Temperature Liquid (Stainless Steel).
- **Electric**: an output whose **Kind** is **element (electric heating element)**, or a PID, hysteresis, duty cycle or PWM output.
- **RIMS** or **HERMS**: a RIMS tube or HERMS vessel in this profile.
- **Other**: type what it is.

## Temperature Probe

The **Temperature Probe** list shows the probes on the same board (interface) as the heat device, so the probe and the heater are on the same Mega. If the vessel is unheated, or no heat device is picked yet, every probe is listed.

## Fermenter

A Fermenter has its own settings:

- **Largest batch** and **Smallest batch** it can hold.
- **Trub loss** (what stays in the fermenter). The volume check on the Equipment Profile tab uses it.
- **Graphic**, **Name** and **Temperature Probe**.
- **Report the temperature every** a number of **Minutes**, **Hours** or **Days**.

The gravity, ABV, CO2 and dates of a batch will go on the Fermentation tab (coming later).

## Ports and Build

The ports are the same as on the Equipment tab: switch on each port it has, and set its **Position** and **Standard**. Leave **Bundled** on to put it on the tab as one unit with its IPs. See [Equipment](14-equipment).
