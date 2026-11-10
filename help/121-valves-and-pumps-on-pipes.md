# Valves and pumps on their pipes

## Centered on the pipe

A valve or pump sits **right on its pipes** (Skynet Rule 5.23). The pipe runs straight on through it: into the valve's own pipe
or the pump's port on one side and out the other, the same in every Orientation.

- **The pipes stay where they are; the valve or pump moves** across onto the pipe's line: left or right on an up-and-down pipe,
  up or down on a level one.
- This happens by itself when a Tab is shown, and once when you open **Edit layout**. Press **Save layout** to keep it.
- If two pipes would move it different ways (they were drawn out of line with each other), it is left where it is. Move the
  pipes into line and it centers.
- **Hoses** bend, so a hose simply goes to the valve's or pump's IP.
- The older ball valve pictures (now `Motorized_TC15_Ball_Valve_Vertical` and `Motorized_TC15_Ball_Valve_Horizontal`) and every
  Skynet valve and pump drawing know where their pipe is. A picture of your own keeps its IPs in the middle of its sides; on the
  **User Defined Motorized Ball Valve** you set the **In and Out IP** spots yourself.

## A lightning bolt when On

While a valve is **open**, a pump is **running** or a Proportional Valve is above **0 %**, a red **lightning bolt** with a yellow
edge shows over the middle of its picture (Skynet Rule 7.15). It is the **On overlay** called **Lightning Bolt**
(see Help 58). It stays still. If you want it to flash, pick **Flashing Bolt** instead.

- Every new motorized valve, Proportional Valve and Pump starts with it, and the Skynet valves always have it.
- The first time the panel starts with this version, each valve, Proportional Valve and Pump that had **no** On overlay gets
  the bolt. One that already had an overlay keeps its own.
- A **Manual** valve has no power, so it has no bolt.
- Don't want it on one? Open its Properties, set **On overlay** to **(none)** and Save. It stays off.

From a Process: `my_Valve.imageOverlay = "Images/Skynet/On_Off/Overlay_Bolt.svg"` (or `Overlay_Bolt_Flash.svg` for the flashing one)
