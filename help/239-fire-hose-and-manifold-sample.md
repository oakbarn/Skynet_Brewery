# Fire Hose and Manifold Sample

The **Three vessels, one pump** sample has a **Water** Tab. It runs tap water for a set time through two motorized valves:

- the **Fire Hose**, a valve on an open hose, to top off a vessel or rinse one when cleaning;
- the **Manifold Supply Valve**, tap water into the manifold.

The piping is drawn as OakBarn Brewery's is: the **Tap Water Supply** comes in from the right into a Tee; one side goes through the
**Manifold Valve** to the **Brewery manifold**, the other up through the **Firehose Valve** to a **QD SS Male**, where the fire hose
clips on. The same two valves also show on the **Brew House** Tab, on the tap water line into its manifold, fed by the **Tap water**
hose bib (they are Clones: the same valves, so opening one on either Tab opens it on both).

The **Water** Tab is only for picking. A button takes every screen to the **Brew House**, the Tab with the manifold, and the fill runs
there, where you can watch it: the message box, the **Water delay** and **Water timer**, the warnings, the **Water Override** and,
with a Float button, the **Water float** are all on the Brew House.

It is the first Process Sample, made from OakBarn Brewery's own Fire Hose and Manifold Processes. Open it on the simulator and press a
button to watch it work.

## The buttons

Each button is a [Process Widget](173-process-widget). One click starts its small Process, which picks the time and starts the Fire Hose
and Manifold Process. The button is done at once, so it shows **Stopped** again while the water runs.

| Fire Hose | Manifold | What it does |
|---|---|---|
| FireHose 1 Minute | Manifold 1 Minute | Water for 1 minute |
| FireHose 2 Minutes | Manifold 2 Minutes | Water for 2 minutes |
| FireHose 20 Seconds | Manifold 3 Minutes | Water for 20 seconds or 3 minutes |
| Firehose Set Time | Set Time | A pop-up asks for the time; it goes in the hidden Time Widget `wgt_TM_Set~Timer_BH` |
| Use FireHose Float | Use Manifold Float | Water until the **Water float** is made |
| FireHose Off | | Stops it now and closes both valves |

## What happens

1. **Manifold Set?** The Brew House opens with a bar on top: set the manifold, then click **✔ Done** when ready. While the bar is
   up the Tab still works: open and close valves, turn the pump off and so on. Only Edit layout waits until Done. You are the Safety
   and Control.
2. **A 20 second delay**, time to move a hose by hand before the water flows. The **Water delay** timer counts down and the
   warning sounds, with messages at 10 and 5 seconds.
3. **The valve opens.** The **Water timer** counts down to 00:00:00, then the valve closes. With a Float button it counts up instead,
   until the float is made. The **Water float** shows on the Brew House only when a Float button was picked.
4. **Shut it off early** with the **Water Override** button: one press ends the run and the valve closes
   ([Override button](96-override-button)). Every tap water fill gets its own Override button. It shows only once the water is
   on, so there is none during the 20 second warning. **FireHose Off** stops it at any time.
5. **The true run time is kept.** A hidden count-up timer, **Water elapsed**, runs from the valve opening until the time is up, the
   float is made, or Override or FireHose Off ends it. The timer keeps that time, and the line `newSec vV_Elapsed_Seconds = wgt_TMR_Water~elapsed_BH`
   turns it into seconds for seconds per gallon ([Process commands](100-brew-process)).

In the simulator, tap the **Water float** and pick **Simulate: input ON** to make it (the float is lifted, contacts closed, red), and
**Simulate: input OFF** to drop it again. The Water float and the two Float buttons show the float switch picture of its state.

**Tip:** put a water pressure regulator in the tap water line before the valves. It is cheap and easy to install, and with the
same pressure every time, a timed fill gives the same amount of water every time.

## The Processes

| Process | What it is |
|---|---|
| `utility_FireHose_Manifold_Supply_Water` | The Fire Hose and Manifold Process: Manifold Set?, the warning, the timed or float run, then everything off |
| `FireHose_1_Minute` ... `Manifold_Float` | One per button: starts the Process, which knows the button by `skn_Started_By` (the name of the Process that started it) |
| `FireHose_Off` | Stops the Process and closes both valves |

No code number is needed: the Process reads the button's own name (`FireHose_1_Minute`, `Manifold_Float` ...).
