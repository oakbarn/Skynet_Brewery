# Stove Top Vessel

A **Stove Top Vessel** is a brew pot that sits on your kitchen stove or a burner. It is a Widget with IPs and no Devices
(Skynet Rule 19.7): nothing in it is wired to a board. Skynet draws it for you, the pot, its rim and its two handles, in the
shape of its Height and Width, so a tall stock pot and a wide short pot both look right.

## Two of them

In **Edit layout**, open **Add equipment ➕** and pick one:

| Choice | What it has |
|---|---|
| **Stove Top Vessel** | No outlets. Only its hose hang top. |
| **Stove Top Vessel, Bottom Outlet** | Its hose hang top, and one **Bottom Outlet** IP at the center of the bottom. |

Like every new Widget it is made on the 🔨 Build Tab first (Rule 4.1); **💾 Save Build ... > Move to Tab** puts it on its Tab.

## The hose hang top

The **top third** of the pot is one big IP. Drop the end of a **Quick Disconnect hose** anywhere there and the hose hangs over
the rim, into the pot (Help 127). A Process can do the same with `Hose_1.connect = Stove_Top_Vessel_1` (its Name), and then
waits for someone to press **Done** once the real hose is in the pot (Help 142).

## Its size

| Box | What it does |
|---|---|
| **Units** | US (gallons, inches) or Metric (liters, cm). |
| **Gallons** (Liters) | How much it holds. A new one starts at **5**. |
| **Height** | How tall the pot is. |
| **Width** | How wide the pot is, across. |
| **Calculated Volume** | What a pot of that Height and Width holds. Read only. |

With **both Height and Width** typed, the pot is drawn at its **real size** and in its real shape (the Calculated Volume).
With either one empty, it is drawn as a stock pot as tall as it is wide, sized by its Gallons. Twice the gallons is about
1.26 times as wide and as tall, the same as every Vessel (Help 135). A Tab's **Master Vessel Sizer** sizes it too.

## The Bottom Outlet

The **Bottom Outlet** is an IP at the center of the bottom: join a pipe or a hose to it like any IP. Its **Bottom Outlet IP
Type** is the connector on it, as on the end of a pipe (Help 24): **Tri-Clamp**, **NPT**, **BSP** or **Quick Disconnect**. It
starts as the **Default pipe IP Type** on the Default tab. It is drawn as its type, under the pot, and it is the size of the pipe
or hose joined to it.

## The technical side

- Its Name has no spaces: `Stove_Top_Vessel_1`, `Stove_Top_Vessel_Bottom_Outlet_1`. A Process uses it after `.connect =`.
- Its Height is saved as `vheight` and its Width as `diameter` (a round pot's width is its diameter), the same as a Vessel drawn
  by its Diameter (Rule 19.2). Its Bottom Outlet IP Type is saved as `ipTypeOut`: `tc`, `npt`, `bsp` or `qd`.
- **Graphic:** leave it empty and Skynet draws it. Pick a picture of your own and that picture is used instead.
