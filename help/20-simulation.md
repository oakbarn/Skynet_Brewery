# Simulation mode

Simulation mode (the test mode) lets you try a whole brew day without touching any hardware. Processes, timers, alarms and the screen work exactly as on brew day, but no real heater, pump or valve is switched. Time can also run faster, or skip ahead, so you do not have to sit through a 60 minute mash to see what happens at minute 50.

An admin turns it on in **Settings > Simulation**.

## What happens when you turn it on

- Every Process stops and every output turns off, so nothing that was running keeps running on the real boards.
- The real boards are let go. Each one is replaced by the simulator, so the **Devices** page shows them as *Simulator (simulation mode)*.
- A yellow striped **SIMULATION** bar shows under the menu on every phone and computer, so nobody mistakes it for a real brew.
- Inputs from the boards (temperatures, flow, pH and so on) come from the simulator. You can also type a value into an input by tapping it, for example a pH reading.
- Values written to the Log while it is on are marked **sim** in the Trigger column, so they are easy to tell apart from real brews.

Turning it off does the same in reverse: every Process stops, every output turns off, and the real boards are used again.

> MQTT and Home Assistant keep running in simulation mode. If an automation there reacts to Brew Panel values, it will see the pretend ones.

## Making time go faster

**Speed** sets how fast the clock runs: normal, 2×, 5×, 10× and up to 120× faster. At 10×, a 60 minute mash takes 6 minutes. Process `sleep` lines, timers, PID and duty cycle outputs, and the simulator's heating and cooling all follow it. Change it in Settings or in the yellow bar.

## Skipping ahead

The yellow bar has buttons for admins:

- **+1 min**, **+5 min**, **+10 min** move the clock ahead at once. Timers jump, sleeps end early, and temperatures change as if that time had passed.
- **Skip to next event** finds the next thing that happens by itself (a `sleep` ending, a Process waiting on a timer, a countdown timer running out) and jumps to a few seconds before it, so you see it happen. The few seconds are set by **"Skip to next event" stops this many seconds before it** (5 seconds unless you change it).

The bar also shows what the next event is and how long until it.

## Auto skip

Turn on **Auto skip** (in Settings or the yellow bar) and the panel skips by itself, with no table to fill in. Each step runs for a few seconds (**Watch each step for**, 5 seconds unless you change it), then the clock skips to a few seconds before the next thing that happens by itself: a `sleep` ending, a timer reaching its time, or a countdown running out. It looks at every running Process, including ones another Process started and loopers.

Only time is skipped. A wait on a screen button, a switch or a temperature is never skipped: press the button as on brew day, and auto skip carries on from there.

## Time jumps table

The table skips ahead by itself. Each row says: **when** something starts (a Process or a timer), **wait** this many seconds, then **jump ahead** this much time.

Example: *A timer starts*, **tm_Mash**, wait **5** seconds, jump ahead **00:50:00**. When the mash starts, it runs normally for 5 seconds, then the mash timer goes from 00:00:05 to 00:50:05. A 60 minute mash takes about 15 seconds of watching instead of an hour.

Use the switch at the start of a row to turn a jump off without deleting it. Click **Save simulation settings** after changing the table. Time jumps only ever happen in simulation mode.

## Process timeline

The panel can work out when each step of a Process will happen, for example *00:10:00 into the mash: check the pH*. Pick a Process and click **Work out timeline**.

- It reads the Process without running it and without switching anything, using the values the panel has right now.
- `sleep` lines and waits on a timer (`wait "tm_Mash" value >= 00:10:00`, or a countdown reaching `00:00:00`) are counted.
- A wait on anything else, like a temperature or a button, cannot be known ahead. The steps after it are shown as time *after* that line.
- Steps inside an `if` that cannot be known ahead are marked **(if)**.

**Make time jumps from this** fills the Time jumps table for that Process: after it starts, it skips to a few seconds before each timed step, one after the other. Check the rows, then click **Save simulation settings**.

Try it with the **Demo_Mash_Steps** Process: a 60 minute mash with a pH check at 10 minutes and a stir at 30.
