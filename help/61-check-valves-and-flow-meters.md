# Check valves and flow meters

Skynet has three more fittings for the piping. Like every [Skynet Fitting](60-skynet-fittings), each one has its IPs built into its openings, and you can flip and rotate it.

Put one on a Tab from **☰ Menu > Fitting Templates**: double-click it, then press **Add to Tab**.

## Check valve

**Check_Valve** lets liquid through **one way only**. It goes in at the **Start** opening (the left side of the picture) and out at the **End** (the right side). The arrow on the picture shows the way.

- Flow from a pump shows through it only when the pump pushes in the direction of the arrow.
- Pushing the other way, the check valve stops the flow, the same as a closed valve.
- To point it the other way, open its Properties in Edit layout and use **Flip Horizontal** (or **Rotate**). The arrow and the in and out sides turn with the picture.

A check valve has nothing to switch and needs no Device.

## Flow meters

A flow meter does **not** stop flow in either direction. Liquid passes through it both ways. There are two:

| Fitting Template | Shows |
|---|---|
| **Flow_Meter** | How fast liquid flows (per minute) and the total that has gone through |
| **Flow_Meter_Temp** | The same, plus the temperature of the liquid |

On the Tab, open its Properties in Edit layout and pick:

- **Flow Meter: Select Flow meter Device or None**: the Flow meter Device that counts its pulses (see [Devices](03-devices)).
- **Temperature: Select Temperature Probe or None** (Flow_Meter_Temp only): the Temperature Probe in it.

The readings show in a small box above the picture, for example `1.20 gal/min · 3.50 gal · 152.0 °F`.

## In a Bundled Fitting

**Check Valve**, **Flow Meter** and **Flow Meter with Temperature** are also on the fitting dropdowns of a Bundled Fitting Template you build yourself. With a check valve in the chain, liquid can only go from the Start (the vessel side) out to the other openings.
