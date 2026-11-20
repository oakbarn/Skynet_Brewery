# Fire Hose and Manifold Sample

The **Three vessels, one pump** sample has a **Water** Tab. It runs tap water for a set time through two motorized valves:

- the **Fire Hose**, a valve on an open hose, to top off a vessel or rinse one when cleaning;
- the **Manifold Supply Valve**, tap water into the manifold.

The piping is drawn as OakBarn Brewery's is: the **Tap Water Supply** goes into a Tee; one side goes through the **Manifold Valve**
to the **Brewery manifold**, the other down through the **Firehose Valve** to a **QD SS Male**, where the fire hose clips on.

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
| Firehose Set Time | Set Time | A pop-up asks for the time; it goes in the gGlobal `gblT_SetTimer_Water` |
| Use FireHose Float | Use Manifold Float | Water until the **Water float** is made |
| FireHose Off | | Stops it now and closes both valves |

## What happens

1. **Manifold Set?** asks you to set any manifold valves by hand first, then press **Done**. You are the Safety and Control.
2. **A 20 second warning.** The **Water delay** timer counts down and the warning sounds, with messages at 10 and 5 seconds.
3. **The valve opens.** The **Water timer** counts down to 00:00:00, then the valve closes. With a Float button it counts up instead,
   until the float is made.
4. **Shut it off early** with the **Water Override** button: one press ends the run and the valve closes
   ([Override button](96-override-button)). Every tap water fill gets its own Override button. **FireHose Off** stops it too.
5. **The true run time is kept.** A hidden count-up timer, **Water elapsed**, runs from the valve opening until the time is up, the
   float is made, or Override or FireHose Off ends it. That time goes in the hidden gGlobal `gblT_Elapsed_Water` (True Run Time),
   for seconds per gallon.

In the simulator, tap the **Water float** to make it.

**Tip:** put a water pressure regulator in the tap water line before the valves. It is cheap and easy to install, and with the
same pressure every time, a timed fill gives the same amount of water every time.

## The Processes

| Process | What it is |
|---|---|
| `utility_FireHose_Manifold_Supply_Water` | The Fire Hose and Manifold Process: Manifold Set?, the warning, the timed or float run, then everything off |
| `FireHose_1_Minute` ... `Manifold_Float` | One per button: sets `gblV_Water_Switch_Status_Water` to its code and starts the Process |
| `FireHose_Off` | Stops the Process and closes both valves |

The codes are OakBarn Brewery's own: **1001** to **1005** for the Fire Hose (1 minute, 2 minutes, 20 seconds, Set Time, Float) and
**2001** to **2005** for the Manifold (1, 2 and 3 minutes, Set Time, Float).
