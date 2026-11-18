# Tap Water Valve

The **Tap Water Valve** is the brass household **hose bib** (outside faucet, sill cock) with a green handle, the kind you buy at a
home store. In Skynet it is a **Manual Valve Widget** (Skynet Rule 5.33): no board pin, turned by hand, and
it brings house water into your brewery.

![Tap Water Valve](Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg)

## Add one

In **Edit layout**, use **Select Device Type > Valves > Tap Water Valve**, or **Select Widget Type > Semi_Widgets_Devices >
Tap Water Valve**. It lands on the Tab you are on, named **ManualValve_1** (ManualValve_2 ...), with the Label **tap_water_1**
(tap_water_2 ...). Change the Label in its Properties if you like (Skynet Rule 18.15: it can never be blank).

You can also turn any Manual Valve into one: open its Properties and pick **Tap Water Valve (household hose bib)** as its Picture.

## Its one IP: the hose outlet

The water comes in from the wall (the house plumbing), so the valve has **only one IP**, at the end of its own short Hose or Pipe
that runs from the **hose thread at the bottom of the spout** (see Size below). Draw a hose (or a pipe) from there to where the water goes, such as your HLT or a chiller.

Like a Pump, you do not pick where the IP goes (Skynet Rule 18.48): put the end of a hose or pipe on or near the Hose Bib and its IP
moves to the nearest of the 8 spots on the edge of its box (any of the 8, the wall side too, Skynet Rule 18.49). Once a hose or pipe
is joined, the IP stays put, and the Graphic in its dialog shows it there.

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

## Size: a Hose Bib, sized like a Pump

A Manual Valve comes in two kinds (Skynet Rule 18.45): **Straight** (in a pipe line) and **Hose Bib**. The Tap Water Valve is the
Hose Bib. It is **sized by hand, like a Pump**: drag its corner, or type its Width and Height. Its picture sits in the top right of
its box, and its **own short Hose or Pipe** runs inside the box from the hose thread to its one IP on the edge of the box. Made bigger
or smaller, the inside Hose or Pipe is drawn again to reach the IP.

## Its own dialog

Its Properties are the **Hose Bib Widget** dialog, in the same look and order as the Pump's: the lock and **No Unlock** in the
title line, **State** (a slider, Open or Closed now), **1. Label** and **Label Visible** (🏷 Update to Suggested Name pops up once
the Label is changed), **2. Tab** with **Layer Order** under it, **3. Name** with the **Change Name** box and **✏ Change Name**, the
Suggested Name, the **Graphic** (its one Skynet picture with its inside Hose or Pipe, kept up to date), **Orientation** with **Left /
Right**, **Hose or Pipe**, **Cover** with **Toggle**, **Overlay** with **Database and .API ⬢**, **Inlet IP
Fitting**, **Outlet IP Fitting**, **.confirmation**, **X**, **Y**, **Width** and **Height** on one line, and the Widget Type (Skynet Rule
18.48). There is no Picture box (a Hose Bib has one Skynet picture) and no IP box (the hose or pipe you join sets it, see above).

**Orientation** and **Left / Right**: Horizontal Right is the picture as drawn (the wall on the right), Horizontal Left is it
mirrored (the wall on the left). Vertical turns it for a hose bib on an up and down pipe: Vertical Left points the handle to the
left (the wall above), Vertical Right points it to the right (the wall below).

Its one IP is on one of the 8 spots on the edge of its box (Bottom Middle, Bottom Left, Bottom Right, Left Middle, Right Middle,
Top Left, Top Middle, Top Right), the wall side too (Skynet Rule 18.49), as a Pump has. The joined hose or pipe picks the spot. A
spot stays where you see it when you change the Orientation or Left / Right, so the hose or pipe stays put.

![Hose Bib 8 IPs](help_pictures/Hose_Bib_8_IPs.png)

![Hose Bib IP spots](help_pictures/Hose_Bib_IP_Spots.png)

**Overlay**: what is drawn on top of it while it is open. Empty is the Manual Valve open sign (a green ring and a tick); the others
are the Pump's Overlays (Lightning Bolt ...).

**Cover** and **Toggle** (Skynet Rule 18.49): the Cover is a colored cover over the hose bib (the Pump's colors), for example a foam
faucet cover. The Toggle is what a click on it on its Tab does: **On/Off** (one click opens it, the next closes it) or **Push
Button** (open only while you hold it down, for topping off a vessel by hand).

**Database and .API** (the ⬢ on the Overlay line, as on the Pump): its .state can go to the brew database, and an outside program or
a Voice Command can read it, or, with .API Read & Control, ask for it. Asked for from outside, it is asked **by hand**, the same as a
Process line: the Tab shows "Open it by hand", someone turns the real valve and clicks it, and its .state then confirms it.

**Inlet IP Fitting**: the fitting on the wall side, where the house pipe comes in (MPT1/2 to start). It has no IP on the Tab, so it
is information only.

**Outlet IP Fitting**: the End Fitting of its one IP (Skynet Rules 2.57 and 18.49). A household hose bib has a male garden hose
thread, **MGH3/4**, and that is what it starts with. **FGH3/4** is the female garden hose thread. A hose or pipe joined to it fits it
by itself: an **FGH3/4** hose end on an MGH3/4 Hose Bib. FGH and MGH can also be ticked in Default settings for any pipe or hose end.
