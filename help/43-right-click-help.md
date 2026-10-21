# Right-click and ? for Help

A **right-click** on something that can't be moved opens this manual at the part that explains it. Use it on brew day when you forget what a gadget does.

## On a PC or Mac

Right-click (on a Mac: Control + click, or a two-finger click on the trackpad):

- **Any item on a tab** while you are not in Edit layout: a pump, a valve, a probe, a timer, an alarm, a vessel, a pipe, a picture ...
- **A 🔒 locked item** in Edit layout.
- **An empty spot on a tab**: opens [Tab background picture and color](26-tab-background).
- **The Menu Bar**: the Schema list, each button (Tabs, Processes, Devices ...), the screen tabs, the ☰ Menu, and the Edit layout bar.

In **Edit layout** an item that is **not** locked keeps the right mouse button for dragging it, as before. Double-click still opens **Properties**.

> Want the browser's own right-click menu (copy, inspect ...)? Hold **Shift** while you right-click.

Places where you type, like the Process editor, keep the normal right-click menu so copy and paste still work.

## On an iPhone, iPad or Android phone

Phones have no right-click. **Hold a finger on an item for about a second** while you are **not** in Edit layout, and Help opens. Lift the finger: the item is **not** switched.

- A **push button** is left alone: holding it is how you press it.
- In **Edit layout** holding a finger opens **Properties**, as before, so there is no Help gesture there.
- The Menu Bar and empty spots have no phone gesture yet: open **Help** from the Menu Bar.

## The yellow ? icon

A yellow circle with a black **?** opens Help at the part about the thing next to it.

- **☰ Menu tabs**: beside each heading (Default, Equipment Profile, Vessel and its Size, Heat, Temperature, Ports and Build parts, Default Layout, Mash, Boil, Tab Background and Valve Profiles).
- **Properties** pop-ups: beside the title, for every device and widget, pipes, IPs, equipment, and Tab settings. If you changed something in the pop-up, it asks first, because opening Help closes the pop-up without saving.
- There is **no** ? on a tab itself, so your brew day screens stay clean.

## Where each item goes

| Item | Help part |
|---|---|
| Relay, PWM or analog output, pump, plain valve, input, probe, sensor, flow meter, scale | [Devices: Putting a device on a tab](03-devices) |
| DS18B20 probe | [Devices: OneWire probes](03-devices) |
| Manual valve | [Manual valves](29-manual-valves) |
| Tap water valve | [Tap water valves](31-tap-water-valves) |
| Stepper motor | [Stepper motors](16-stepper-motors) |
| Alarm, Sound Player | [Alarms and sound](21-alarms-and-sound) |
| Timer | [Tabs: Timers](02-tabs) |
| vKonstant, vKonstant List, vAPI, Shared variable | [Variables](04-variables) |
| Picture | [Pictures on items](25-picture-paths) |
| Vessel | [The Vessel tab](34-vessel-tab) |
| Chiller, coil, filter, equipment fitting, bundled vessel | [Equipment](14-equipment) |
| IP point, pipe fitting, pipe, hose | [Pipes, hoses and reducers](24-pipes-and-hoses) |
| Label, text, on-screen switch, manual vessel | [Tabs: Changing the layout](02-tabs) |

## Changing where it goes

The list lives in `public/helpmap.js` on the Brain. If a page is renamed, Help still opens, at the top of the closest page it can find. Ask for a change and it will be updated with the new page.
