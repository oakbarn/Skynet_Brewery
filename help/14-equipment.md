# Equipment: vessels, chillers, coils and fittings

Equipment is drawn on the screen and has **IPs** (connection points) where pipes start and end. It is not wired to a board.

## Add a vessel

1. **Tabs > Edit layout**, pick **Vessel** next to **Add equipment**, then tap **Add equipment**.
2. It goes on the **Equipment** tab, which is always there.
3. Set its **Name**, **Type** (Brew Kettle, HLT, MLT, Mash Tun, Whirlpool), **Label** and **Graphic** (a picture path).
4. Switch on **Installed** for each port the vessel has: **Outlet**, **Tangential**, **Thermowell**, **Steam Slayer**, **Sparge** and **CIP**. Each has a **Position** (for example Center Bottom or Lid) and a **Standard** (for example TC 1.5 or NPT 1/2 FPT).
5. **Save**. Every port except the thermowell becomes an IP near its position. The thermowell shows as a red **T**. A small box lists where the ports went: drag an IP to fit the picture, and it stays part of the vessel and moves with it.

Every list ends with **Add new ...** so you can add your own choice. Added choices are kept for all vessels.

## Other equipment

The same list has **Plate chiller**, **Chilling coil**, **HERMS coil**, **Trub filter**, **Pipe tee**, **Pipe 90° elbow**, **Pipe 45° elbow** and **Pipe cross**. They work like the vessel, and all their openings start as IPs. Flow passes through them: a chiller's wort side and water side stay separate. Chillers, coils and the filter go on the Equipment tab; fittings go on the tab you are on.

> Pipes only join IPs on the same tab.

## Bundle a vessel with its IPs

Bundling locks a vessel and its IPs together as one unit, so nothing gets bumped out of place. Bundle it once the IPs sit where you want them.

**To bundle (PC or iPhone):**

1. Go to the vessel's tab and switch on **Edit layout**.
2. Open the vessel's properties. On a PC, **double-click** it. On an iPhone, **hold a finger on it**.
3. Press **Save**. The panel asks **Bundle ... with its IPs?** Press **OK** to bundle, or **Cancel** if you still need to drag IPs into place.
4. Or switch on **Bundled** at the bottom of its properties and press **Save**.
5. Press **Save layout**.

**While it's bundled:**

- It shows a 📦 in Edit layout.
- Drag the vessel, or any of its IPs, and the whole bundle moves as one (on an iPhone, drag with one finger).
- The vessel and its IPs can't be resized, edited or deleted. Opening it only shows **Bundled** and **Tab**.

**To un-bundle:** open the vessel (double-click, or hold a finger on it), switch **Bundled** off, press **Save**, then **Save layout**. Now you can edit, move or delete its IPs again.

## Move equipment to another tab

New vessels, chillers, coils and filters start on the **Equipment** tab. To move one to another tab:

1. Go to the tab it is on and switch on **Edit layout**.
2. Open its properties. On a PC, **double-click** it. On an iPhone, **hold a finger on it**.
3. Pick the new tab in the **Tab** list near the bottom.
4. Press **Save**, then **Save layout**.

The panel jumps to the new tab with the item, and its IPs go with it. A bundled vessel moves with all its IPs exactly where they were. Pipes do not move, because a pipe only joins IPs on the same tab, so draw new ones on the new tab.

Every other item (devices, pictures, text, IPs and pipes) has the same **Tab** list.

## Pick lists and switches

Wherever there is a choice you get a dropdown, and lists that can grow end with **Add new ...** (picture paths, sounds, units and more). A yes / no setting is a switch. Colors are a dropdown of standard colors, or **Custom ...** for any other.

A Digital Output's **Graphic when on** and **Graphic when off** show a small preview: LEDs, a lightning bolt and ball valve pictures, or **Add new ...** for your own.
