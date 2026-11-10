# Semi_Widgets_Devices

**Semi_Widgets_Devices** are a class between a Widget and a Device. Like a Widget they live only in the app: no board, no
pin (Rule 1.2). Like a Device they have an **ON / OFF state** (`.state`, true or false). (Rule 1.20)

| Semi_Widgets_Device | What it does | Device controlled |
|---|---|---|
| **Switch** | A tap slides it ON; another tap slides it OFF. | Yes |
| **Slider** | A sliding ON / OFF switch: the knob slides right and turns green for ON, left for OFF. A tap slides it. | Yes |
| **Checkbox** | A tick box: ticked is ON. A tap ticks or unticks it. | Yes |
| **Lighted Button** | A button with a lamp that stays lit while ON. A tap turns it ON or OFF. | Yes |
| **Push Button** | ON only while held, OFF when you let go. | Yes |
| **Pulse Button** | One 100 ms ON for each tap. | Yes |
| **LED** | A light that shows ON or OFF. A tap does nothing: a Process or its Device controlled sets it. | Yes |
| **Manual Valve Widget** | Open or closed. Only a click on it changes it; a Process asks for it by hand and waits for the click (see *Pipe fittings and Manual Valves*). | No |

## Boolean Widgets

Every one of these with an ON / OFF state, except the Manual Valve Widget, is a **Boolean Widget**: Switch, Slider, Checkbox,
Lighted Button, Push Button, Pulse Button and LED. Each one is **its own Widget**, so its look is fixed: a Slider is always a
Slider. Its Properties show which one it is (Widget Type, read only). For another look, add that one from **Boolean ➕**.

Think of a Boolean Widget with a **Linked Device** as a **Clone of that Device** in what it does, with the look of a Switch,
Slider, LED and so on. Put a Slider on any Tab, link it to the Mash pump, and it turns the pump ON and OFF with no Process.

## Adding one

In Edit layout, **Select Widget Type > Semi_Widgets_Devices**, then pick Switch, Slider, Checkbox, Lighted Button, Push Button,
Pulse Button, LED or Manual Valve Widget (or use **Boolean ➕** on the Edit layout bar). Like every new Widget it is made on the 🔨 Build Tab and its Properties open; **Save Build ...** sends it to a Tab.
New names are `wgt_SW_...`, `wgt_SLD_...` (Slider), `wgt_CHK_...` (Checkbox), `wgt_LTB_...` (Lighted Button), `wgt_PB_...`, `wgt_PL_...` and `wgt_LED_...`, then the Label and the Tab ID (Skynet Rule 3.14), for example `wgt_SW_Mash_Stir_BR`; a Manual Valve Widget is `wgt_MV_...` and a Tap Water Valve `wgt_TWV_...`. Older names (`sw_1`, `ManualValve_1`) keep working.

## Linked Device

Every Boolean Widget has **Linked Device** in its Properties, right after its Name and Label (in a Process it is
`.device_controlled`).
It starts at **None**: the Widget only has its own `.state`, for a Process to read or set.

Pick a Device and the two **follow each other, like a Clone**:

- Slide the **Switch**, **Slider**, **Checkbox** or **Lighted Button** ON and the Device turns ON; turn the Device OFF anywhere and it goes OFF too.

- Slide the **Switch** ON and the Device turns ON. Turn the Device OFF anywhere (on its own Tab, by a Process, with
  Close all valves) and the Switch slides OFF.
- Hold the **Push Button** and the Device is ON until you let go. If the Device is turned ON some other way, the button shows pressed.
- Tap the **Pulse Button** and the Device gets one 100 ms ON. If the Device is turned ON some other way, the button shows ON
  until the Device is OFF again (it never turns the Device off by itself).
- The **LED** lights while the Device is ON. A Process that sets the LED (`led_Pump = true`) switches the Device too.

**Only Devices with an ON / OFF state are listed:** pumps, valves and other on/off outputs a Process can switch, and the heater
controls (Duty Cycle, Hysteresis, PID), which count as ON while **Enabled** (Rule 7.9). Not listed: a **Manual valve** Device
(it is turned by hand and a Process waits for its Done), an **input** (it is read from its board), and other Widgets.

Several Boolean Widgets may be linked to the same Device; they all follow it. If the Device is deleted, Linked Device goes
back to None. If it is renamed, Linked Device follows the new name.

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
