# Tap water valves

Some valves sit right on a tap water outlet (a hose bib or a water line). When one of these opens, water starts to flow because of the tap pressure. No pump is needed.

Turn on **Tap water valve** for such a valve, and the panel shows the flow in the pipes as soon as the valve is open.

## Make a valve a tap water valve

1. **Tabs > Edit layout**, then open the valve's properties. On a PC, **double-click** it. On an iPhone, **hold a finger on it**.
2. The **Kind** must be **valve**.
3. Turn on the **Tap water valve** switch, and pick the way the water flows in **Tap Water flows**.
4. Press **Save**, then **Save layout**.

## How the flow shows

- **Valve open:** flow runs out of the valve into the pipes or hoses joined to it, and on until it reaches an end of the line: a vessel port, an open hose end, a plain IP point, or a running pump's inlet.
- **Valve closed:** no flow from it, the same as any closed valve.
- A tap water valve flows **one way**: out of one end only. **Tap Water flows** in its properties picks the way: **Left to Right** or **Right to Left** when the valve lies flat, **Top to Bottom** or **Bottom to Top** when it stands up (only the two that fit the way it sits are shown; they change when you change its **Orientation**, and the way the water goes stays the same). It is always one way, from the tap side to the Out side. In Edit layout the tap side always shows **TAP** and can't be clicked or joined; the Out side is a plain red or green dot. Nothing flows back into the tap side.
- **Water Supply** (None, Pipe or Hose) draws the house water line on the **TAP** side. It is only a picture: it always shows blue water flowing to the valve, moves with the valve, and its other end (the wall) joins nothing. It is not a normal Pipe: it can't be picked, moved or joined, and only a tap water valve has it.
- **A pipe on its tap side:** with nothing joined on its tap side the house plumbing is not drawn, so it always has water. With a pipe joined there (for example from a Hose Bib through a Tee), it has water only when water reaches it along that pipe: from an open Hose Bib, a running pump, another tap water valve that has water, a plain IP end or an open end. A closed Hose Bib or a closed valve on that side means no water, so nothing flows out of it and nothing sprays, even when it is open. A vessel port is not a water supply.
- Pumps and other valves on the way work as usual: a closed valve or a cap stops the flow, a pump that is off lets it pass.
- **Valve type** (Electro_Mechanical or Manual) works as usual too. A Manual tap water valve still asks you to turn it by hand.

## In a Process

`my_Valve.tapwater` is true or false. You can read it or change it:

```
if VGC_Tap_Water.tapwater == true
  VGC_Tap_Water = true
endif
VGC_Hose_Fill.tapwater = true
```

A Process change lasts until the valve is saved again in Edit layout or the panel restarts. Then the switch in the valve's properties counts again. Only valves have `.tapwater`; using it on anything else stops the Process with an error.
