# Add a Vessel

A Vessel is a Kettle, an HLT, a Mash Tun, a Fermenter and so on. In **Edit layout**, pick **Vessel (kettle, HLT, MLT ...)** in the equipment list and press **Add equipment**. A box asks which kind you want:

- **Widget**: you add everything to it yourself.
- **Integrated**: ready-made.

Whatever you pick goes on the 🔨 [Build Tab](55-build-tab) first, and its Properties open. When it is done, press **💾 Save Build ...** and pick **To a Tab** (or **As a Template**).

## Widget

The box shows the **Skynet Vessel Widgets** as small pictures. Click one to use it. Each is a vessel picture with its IPs built in and nothing else: no Devices. The Skynet Vessel Widget itself is set by Skynet and can't be changed, only cloned (☰ Menu > Vessel Templates > Clone).

The picture you clicked is the Widget's picture to start with, but the one on the Build Tab is yours: open its Properties and change the **Graphic** like on any other Widget. Its IPs stay on the openings of the Skynet picture.

The Skynet Vessel Widgets so far:

- **Generic_Brew_Vessel_Widget**: a plain brew vessel with no ports.
- **Brew_Vessel_Low_TC_Output_Widget**: the same vessel with one TC 1.5 port (the outlet) at Center Bottom, its center 1 inch above the bottom.
- **Brew_Vessel_TC_Thermowell_Widget**: the one above plus a TC 1.5 Thermowell at Center 5".
- **Brew_Vessel_TC_Thermowell_Tangential_Widget**: the one above plus a TC 1.5 Tangential inlet on the Left side at 4".
- **Brew_Vessel_TC_Thermowell_Tangential_Side_Widget**: the one above plus a TC 2 Second Outlet on the Right side at 6".

Each one is built on the one before it. A port's inches are the height of its center above the bottom of the vessel.

A port (a hole in the vessel) is drawn as a TC or NPT fitting, sized in proportion to the vessel, so a TC 2 port looks a little bigger than a TC 1.5 one.

**Blank_Vessel** is a plain vessel where you pick the picture and set every port yourself.

Devices (a heating element, a temperature probe, a valve) are placed on the Build Tab next to the Widget and bundled with it.

## Integrated

The box has two groups:

- **Skynet Integrated Vessels**: their Devices are built in, for example the [Basic electric kettle](65-skynet-integrated-electric-kettle). The New Device box asks the Interface and the Ports, the same as for any Device. Most people will use one of these.
- **User Bundled Templates**: your own vessels. Each one is built on a Skynet Vessel Widget.

## Making a User Bundled Template

A User Bundled vessel Template always starts from a Skynet Vessel Widget. There is no other way to make one:

1. **Add equipment > Vessel > Widget**, and click a Skynet Vessel Widget.
2. On the Build Tab, add what it needs and bundle it.
3. Press **💾 Save Build ...**, pick **As a Template**, give it a name and save it.

From then on it is in the **User Bundled Templates** group under **Integrated**. A clone of it (or of a Skynet Vessel Widget) is built on the same Skynet Vessel Widget.

A blank Vessel, or a vessel that did not start from a Skynet Vessel Widget, can't be saved as a User Bundled vessel Template, and **☰ Menu > Vessel Templates > New Vessel Template ...** can't make a blank User one.
