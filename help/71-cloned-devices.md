# Cloned Devices

A Device can be shown on more than one Tab with a **Clone**.

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

The name is only there so you can tell Clones apart when you look at their Properties; nothing else uses it. Behind the scenes a Clone is tied to its parent, so it keeps working whatever the parent is called. If the parent is renamed, its Clones follow (`..._Clone_1` keeps its number).

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
- Deleting the parent Device asks what you want:
  - **🗑 Delete the Device and all its Clones**, or
  - **Make (a Clone) the Device**: one button for each Clone. The Device moves to where that Clone is, on its Tab, and that Clone
    goes. The Device keeps its name, its Port and its Processes, and pipes joined to that Clone are now joined to the Device. Any
    other Clones stay Clones of it.
  - **✖ Cancel** keeps everything.
- Deleting a Tab deletes the Clones on it, and the Clones of Devices that were on it.

## Method Clones (Devices with more than one Control Method)

A Device with more than one Control Method, like a Heating Element (On/Off, Duty Cycle, Hysteresis, PID, Deadband), can have
**Method Clones** (Rule 4.4): each one is a tile that stands for one method, with its own Label. They can go on the Device's own
Tab: **⧉ Clone Device > Method Clone**. It shows ON only while the Device is ON in that method. One click on a Method Clone acts just
as a click on the Device, all in unison, with no pop-up: when it shows ON, the click turns the Device Off; when it shows OFF, the
click switches the Device to its method and turns it On. See [One Heating Element, pick how it heats](150-heating-method).
