# Emergency Off

The **Emergency Off** button is the red mushroom button on the yellow plate at the **top right of every page**. It looks like the one on a real machine.

**One click** shuts the brewery down at once. There is no pop-up.

**Rest the mouse on it for 2 seconds** and a big Emergency Off button, 400 pixels wide, pops up under it, so it is easy to hit. One click on the big one does exactly the same. It goes away when the mouse leaves it, or with Esc.

## What it does

In this order:

1. **Every Process stops**, the same as **Stop all**.
2. **The heaters go off**: every Heating Element is turned Off, and every Duty Cycle, Hysteresis, PID and Deadband is turned off.
3. **The pumps go off**, and any motor stops.
4. **Every other output goes off**: PWM and analog outputs go to 0, and Switches go Off.
5. **The valves close.** They close last, so a pump never runs against a closed valve.

**Manual valves** are turned by hand, so they stay as they are. Timers, Alarms and sounds are left alone. The Console says how many things it switched.

## Good to know

- Brewers and admins can press it. A view only account can't switch anything.
- To brew again, turn things back On and start your Process again. Nothing comes back On by itself.
- **Stop (all off)** in the samples is a Process you can change. **Emergency Off** is built into Skynet and always does the same thing.
