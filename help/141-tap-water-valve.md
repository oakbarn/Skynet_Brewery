# Tap Water Valve

The **Tap Water Valve** is the brass household **hose bib** (outside faucet, sill cock) with a green handle, the kind you buy at a
home store. In Skynet it is a **Manual Valve Widget** (Skynet Rule 5.33; Fritz, 2026-11-06): no board pin, turned by hand, and
it brings house water into your brewery.

![Tap Water Valve](Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg)

## Add one

In **Edit layout**, use **Select Device Type > Valves > Tap Water Valve**, or **Select Widget Type > Semi_Widgets_Devices >
Tap Water Valve**. It lands on the Tab you are on, named **ManualValve_1** (ManualValve_2 ...), with the Label **tap_water_1**
(tap_water_2 ...). Change the Label in its Properties if you like (Skynet Rule 18.15: it can never be blank).

You can also turn any Manual Valve into one: open its Properties and pick **Tap Water Valve (household hose bib)** as its Picture.

## Its one IP: the hose outlet

The water comes in from the wall (the house plumbing), so the valve has **only one IP**, on the **center of the hose thread at the
bottom of the spout**. Draw a hose (or a pipe) from there to where the water goes, such as your HLT or a chiller.

- **Closed**: nothing comes out; any hose on it is blocked.
- **Open**: it is a **tap water source**. Flow pushes out of the hose outlet with no pump, and the flow is **tap water Blue**
  (Skynet Rule 5.21: tap water wins over every other Flow Color).
- It does not cut a pipe it is dropped on, because it has only one IP (a valve needs two to sit in a pipe, Skynet Rule 5.26).

## Opening and closing it

Exactly like every Manual Valve Widget (Skynet Rule 5.15, see the Pipe fittings and Manual Valves page):

- **One click on it on its Tab opens or closes it**, at any time. While it is open the open overlay (a green ring and a tick) is
  drawn on it.
- A Process line such as `ManualValve_1.state = true` does **not** turn it. The Tab shows "Open it by hand", the valve blinks, and
  the Process waits until someone clicks it open. That is your reminder to go out and turn on the water.

## Size

**Autosize to pipe** is on to start: the valve takes the size of the hose on it, so its hose thread is as wide as the hose. Switch
Autosize off in its Properties to type a bigger Width and Height.
