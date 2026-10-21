# Tap water valves

Some valves sit right on a tap water outlet (a hose bib or a water line). When one of these opens, water starts to flow because of the tap pressure. No pump is needed.

Turn on **Tap water valve** for such a valve, and the panel shows the flow in the pipes as soon as the valve is open.

## Make a valve a tap water valve

1. **Tabs > Edit layout**, then open the valve's properties. On a PC, **double-click** it. On an iPhone, **hold a finger on it**.
2. The **Kind** must be **valve**.
3. Turn on the **Tap water valve** switch, and pick the end the water leaves by in **Tap water flows out of**.
4. Press **Save**, then **Save layout**.

## How the flow shows

- **Valve open:** flow runs out of the valve into the pipes or hoses joined to it, and on until it reaches an end of the line: a vessel port, an open hose end, a plain IP point, or a running pump's inlet.
- **Valve closed:** no flow from it, the same as any closed valve.
- A tap water valve flows **one way**: out of one end only. **Tap water flows out of** in its properties picks which end: **The second end (right or bottom)** (the usual one), **The first end (left or top)**, or **Both ends**. In Edit layout the ends show **TAP** (the tap side) and **OUT**. Nothing flows back into the tap side.
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
