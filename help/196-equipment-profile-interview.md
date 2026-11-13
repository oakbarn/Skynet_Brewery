# The Equipment Profile Interview

The **Equipment Profile Interview** makes a whole Equipment Profile by asking plain questions, one page at a time. Every answer starts from your **Default settings**, so pressing **Next ▶** all the way through already makes a working profile. **◀ Back** goes back a page; **✖ Cancel** stops, and nothing is made.

Start it from **☰ Menu > Equipment Profile > Open > Add new ...** (or **Add new ...** on a Tab's row). **Start from: Answer a few questions (the Interview)** is the first choice.

## The pages

1. **Start**: the profile's Name, the Tab it is for (or **➕ A new Tab**), and the **Interface** (the board) the pumps and valves are wired to.
2. **How many Vessels?** (up to 8).
3. **The type of each Vessel**: HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank or Other.
4. **Pick or build each Vessel**: a Vessel Device or Widget of that type first, then the plain **Skynet Vessel Widget**, then **🔨 Build a new Vessel Device** (the [Vessel Device Builder](166-vessel-device-builder) opens after the Interview). Also its Label, Size and Dead space (a Fermentor: Largest and Smallest batch).
5. **How many Pumps?**
6. **Each Pump**: Type, Cover, Overlay, Label, Label Visible and Toggle.
7. **How many Motorized Valves?**
8. **Each Motorized Valve**: Type (and which way it stands), Overlay, Label, Label Visible and Toggle.
9. **Manual Valves**: how many, with a picture and Label for each. Skynet asks you to turn them ([Confirmation Widgets](162-confirmation-widgets)).
10. **And so on**: Mash recirculation (RIMS, HERMS), Chiller and Supply Manifold.
11. **The numbers**: the profile's losses and numbers.
12. **Review**: what will be made, with each pump's and valve's Name and Port. A problem (a Label used twice, no Interface) shows here; press **◀ Back** to fix it.

## 🔨 Build

**🔨 Build** makes the profile, gives it to the Tab, and puts everything on the **🔨 Build Tab** ([Build Tab](55-build-tab)). Each pump and motorized valve is a real Device and takes the next free Port of the Interface. Then press **💾 Save Build ... > Move to Tab**, and **Save layout**. Pipes are not drawn: draw them the way yours are piped (**Draw pipe**).

## Use the same layout in another Schema

An Equipment Profile keeps its pumps and motorized valves too: their look and their place, but never their Interface, Port or Name. So a **3 Vessel 3 Pump** layout can be picked from the list on a Tab of another Schema without building it again.

When a Tab picks a profile whose pumps or valves this Schema does not have yet, Skynet asks for their Interface and gives each one the next free Port. The Tab's row also shows **🔌 Give ... their Ports** until it is done. Like every new Device, they start on the 🔨 Build Tab.

Deleting one of those pumps from a Schema takes it out of the profile. A pump another Schema has not given a Port yet stays in the profile.
