# Cloned Devices

In BruControl a Device could sit on only one worksheet, so showing the same pump on two screens took extra code and globals. In Skynet a Device can be shown on more than one Tab with a **Clone**.

A Clone is **the same Device**, not a copy. It shows what its parent (the Device it was cloned from) shows, and tapping it is tapping the parent:

- A Clone of an on / off Device (a pump, a valve, an output) turns the parent on or off, and the parent and every Clone show it.
- A Clone of a Device with **Enabled** (a PID, Hysteresis or Duty Cycle) turns it on or off the same way the parent does.
- A Clone of a reading Device (a OneWire temperature probe, a sensor) only shows the reading, in the same format as the parent.

## Make a Clone

The only way to make a Clone is the **⧉ Clone Device** button on the Edit layout bar (Admins). It works on any Tab, the 🔨 Build Tab too.

1. Go to the Tab the Clone should be on (or the Build Tab) and press **⧉ Clone Device**.
2. The list holds the Devices already placed on a Tab (not the ones already on this Tab), grouped by type: Pumps, Valves, Heat, Temperature probes, Other outputs, Motors, Inputs and sensors.
3. Pick one and press **Save**. The Clone appears on the Tab; drag it into place.

A Clone made on the Build Tab goes to a Tab with **Save Build**, like everything else built there.

## The Clone's name

Skynet makes the name, and it can't be typed over: the parent's name, then `_Clone_` and a number.

`MB_06_Pump_Wort__HS` cloned once is `MB_06_Pump_Wort__HS_Clone_1`, the next Clone of it is `MB_06_Pump_Wort__HS_Clone_2`.

If the parent is renamed, its Clones follow (`..._Clone_1` keeps its number).

## A Clone's Properties

Double-click a Clone in Edit layout. Only these are its own:

- **Visible**: off hides the Clone on its Tab only. The parent and other Clones keep showing.
- **Tab**: the Tab the Clone is on. Pick another Tab to move the Clone there (the parent stays where it is).
- **X** and **Y**: where it sits on its Tab.
- **Lock position**, like any other item.

Everything else (pictures, look, size, Interface, port, value, on and off) belongs to the parent. Change it in the parent's Properties and every Clone follows. In Edit layout a Clone has a dashed outline and a ⧉ mark; it can be dragged but not resized (its size is its parent's).

A pump or valve Clone has its own IPs, so pipes on its Tab can be drawn to it. Flow on that Tab follows the pump or valve, the same as the parent.

## Clones and Processes

A Clone is **not used in Processes**. A Process uses the parent's name, and every Clone shows what the Process did.

## Deleting

- Deleting a Clone deletes only the Clone.
- Deleting the parent Device deletes its Clones too (the box names them first).
- Deleting a Tab deletes the Clones on it, and the Clones of Devices that were on it.
