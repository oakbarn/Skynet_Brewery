# Switching and cloning Schemas

A **Schema** is one whole brewery setup: its tabs, Devices, Widgets, pictures, pipes, probes, autostart list, and the Equipment Profile of each Tab. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

## Where to pick the Schema

The same Schema dropdown is in three places. Use whichever is handy:

- the **Menu Bar** (on a Tab, pick **☰ Menu > Show Menu Bar** first),
- **☰ Menu > Schema**,
- **☰ Menu > About**.

Picking another Schema loads it. Only an Admin can load or change a Schema.

The **☰ Menu > Schema** tab also lists every Schema on the Brain: how many tabs it has, the Equipment Profile of each Tab and when it was last saved, with a **Load** and a **Clone** button on each one.

## When Processes are running

Loading another Schema stops every running Process. So if any Process is running, the panel warns you first:

> ⚠ The Schema "Oak Barn" is active: 2 Processes are running ... Is it OK to proceed?

Press **OK** to go ahead, or **Cancel** to stay where you are. The Schema tab shows the same warning in yellow while Processes are running.

The same warning comes up for anything else that loads a Schema again: **Add new Schema**, **Clone** with **Load the clone now**, and **Restore a backup or version**.

## Everything is switched off

When the active Schema changes, **every output is switched off first**, so nothing the old Schema left on keeps running:

- digital outs and valves (pumps, burners, elements, relays) go off or close,
- PWM and analog outs go to 0,
- duty cycle, hysteresis and PID controls are disabled,
- stepper motors that are moving stop,
- timers stop, and alarms and sounds go quiet.

Then the new Schema is loaded, and everything is switched off once more, so it starts with all outputs off whatever its saved start values say. After that its autostart Processes start as usual.

Manual valves are turned by hand, so the panel leaves them as they are.

## Clone a Schema

A clone is a copy of a Schema under a new name. Use it to try changes without touching the Schema you brew with.

1. Pick **Clone a Schema ...** in the Schema dropdown, or press **Clone** beside a Schema on the **☰ Menu > Schema** tab.
2. Pick the **Schema to clone**. It does not have to be the loaded one.
3. Type a **Name of the clone**. Leave it empty and it is called "<name> copy".
4. Turn on **Load the clone now** if you want to switch to it at once. Leave it off and the loaded Schema stays loaded.
5. Press **Save**.

The clone gets everything in the Schema, its saved values too (gKonstants, gAPI ...). Its Tabs use the same Equipment Profiles, so equipment and piping stay shared. It starts without a version of its own. The Schema you cloned is not changed.

## Clone a Bundled item

A Bundled vessel and its IPs can be copied in one go:

1. Pick **☰ Menu > Edit layout** and double-click the bundled vessel.
2. Turn on **Clone: put a copy of this vessel and its IPs next to it** and press **Save**.
3. The copy is placed just to the right of the first one, still bundled, named "<name> copy". Pipes are not copied: draw new ones to it.
4. Press **Save layout** to keep it.

If the Tab has an Equipment Profile, the copy is in that profile's **Equipment list** as soon as you save the layout, like everything else on the Tab.

On the **☰ Menu > Equipment Profile** tab each vessel in the **Made on the Vessel tab** list also has a **Clone** button. The copy opens on the Vessel tab as a new one (with the same size, heat, probe, ports and bundle setting). Change what you need, then press **Save** there.
