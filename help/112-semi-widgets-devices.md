# Semi_Widgets_Devices

**Semi_Widgets_Devices** are a class between a Widget and a Device. Like a Widget they live only in the app: no board, no
pin (Rule 1.2). Like a Device they have an **ON / OFF state** (`.state`, true or false). (Fritz, 2026-11-02, Rule 1.20)

| Semi_Widgets_Device | What it does | Device controlled |
|---|---|---|
| **Switch** | A tap slides it ON; another tap slides it OFF. | Yes |
| **Push Button** | ON only while held, OFF when you let go. | Yes |
| **Pulse Button** | One 100 ms ON for each tap. | Yes |
| **LED** | A light that shows ON or OFF. A tap does nothing: a Process or its Device controlled sets it. | Yes |
| **Manual Valve Widget** | Open or closed. Only a click on it changes it; a Process asks for it by hand and waits for the click (see *Pipe fittings and Manual Valves*). | No |

## Adding one

In Edit layout, **Select Widget Type > Semi_Widgets_Devices**, then pick Switch, Push Button, Pulse Button, LED or Manual
Valve Widget. Like every new Widget it is made on the 🔨 Build Tab and its Properties open; **Save Build ...** sends it to a Tab.
New names start `sw_`, `pb_`, `pl_` and `led_` (hints only; a Manual Valve Widget is `ManualValve_N`).

## Device controlled

A Switch, Push Button, Pulse Button or LED has **Device controlled** in its Properties, right after its Name and Label.
It starts at **None**: the Widget only has its own `.state`, for a Process to read or set.

Pick a Device and the two **follow each other, like a Clone**:

- Slide the **Switch** ON and the Device turns ON. Turn the Device OFF anywhere (on its own Tab, by a Process, with
  Close all valves) and the Switch slides OFF.
- Hold the **Push Button** and the Device is ON until you let go. If the Device is turned ON some other way, the button shows pressed.
- Tap the **Pulse Button** and the Device gets one 100 ms ON. If the Device is turned ON some other way, the button shows ON
  until the Device is OFF again (it never turns the Device off by itself).
- The **LED** lights while the Device is ON. A Process that sets the LED (`led_Pump = true`) switches the Device too.

**Only Devices with an ON / OFF state are listed:** pumps, valves and other on/off outputs a Process can switch, and the heater
controls (Duty Cycle, Hysteresis, PID), which count as ON while **Enabled** (Rule 7.9). Not listed: a **Manual valve** Device
(it is turned by hand and a Process waits for its Done), an **input** (it is read from its board), and other Widgets.

Several Semi_Widgets_Devices may control the same Device; they all follow it. If the Device is deleted, Device controlled goes
back to None. If it is renamed, Device controlled follows the new name.

## In a Process

The name alone is its `.state`:

```
sw_Pump = true                // the Switch slides ON, and its Device controlled turns ON
wait sw_Pump == false         // until someone slides it OFF, or the Device is turned off
if led_HLT == true then ...
```

`.device_controlled` reads the Device's name (or `None`). It is **read only**: pick it in the Properties.

## Outside programs (.API)

A Semi_Widgets_Device can have **.API** like any Widget (Help: *Database and API*). When it has a Device controlled, an outside
program may change it only if **that Device's own .API is Get and Put** too, so nobody gets around the Device's setting through a
Switch. `.device_controlled` can never be changed from outside.
