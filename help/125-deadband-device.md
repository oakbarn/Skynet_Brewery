# Deadband Device

A **Deadband** Device holds a temperature (or any other reading) close to a **Target**, the same way as BruControl's
Deadband Output (Skynet Rule 6.17). It is gentler and slower than a PID: every **Calc Time** it nudges its output % up or
down by a set step, and when the reading is close to the Target it leaves the output alone.

Add one with **➕ Add > Devices: control outputs > Deadband**, then double-click it for its Properties.

## The three zones

Around the Target there are three zones, each the same distance above and below it:

| Zone | How far from the Target | Each Calc Time the output ... |
| --- | --- | --- |
| **Deadband** | within ± Deadband Offset | stays as it is |
| **Inner Band** | within ± Inner Band Offset (but outside the Deadband) | moves by the **Inner Band Drive** |
| **Outer Band** | further out than the Inner Band | moves by the **Outer Band Drive** |

Below the Target the output goes **up**; above it the output goes **down**. Turn on **Reversed** for a cooler, so it goes
up when the reading is too warm.

Example: Target 152 °F, Deadband Offset 0.5, Inner Band Offset 2, Inner Band Drive 1, Outer Band Drive 5, Calc Time 10.
At 145 °F the output rises 5 % every 10 seconds. At 151 °F it rises 1 % every 10 seconds. From 151.5 to 152.5 °F it stays
where it is. At 153 °F it drops 1 % every 10 seconds.

## Its settings

| Setting | What it does | Starts at |
| --- | --- | --- |
| Input | The probe or sensor it reads | |
| Target | The reading to hold | 0 |
| Deadband Offset | Half the width of the quiet zone (the whole zone is twice this) | 0.5 |
| Inner Band Offset | Half the width of the inner band | 2 |
| Initial Output % | The output it starts at when Enabled, so it begins near the right level | 0 |
| Inner Band Drive | % change each Calc Time in the inner band | 1 |
| Outer Band Drive | % change each Calc Time in the outer band | 5 |
| Max output % | The most it ever gives | 100 |
| Calc Time (s) | How often it nudges the output | 10 |
| Output window (s) | With no PWM pin: the output % is the part of each window the pin is on (a Duty Cycle) | 2 |
| Reversed | For cooling | off |
| PWM output | On: the pin is a PWM output set to the output % | off |

A Process uses the same names in lower case: `DBand_HLT.target = 152`, `DBand_HLT.deadbandoffset = 0.5`,
`DBand_HLT.innerbanddrive = 1`, and reads the output with `DBand_HLT.value`. Like a PID it counts as **on while Enabled**
(Rule 7.9) and can share a heater's port with a PID or Hysteresis (Rule 6.1).

## When to use it

Use a Deadband when the reading answers quickly and starts near the Target, for example holding a fermenter or a
RIMS tube that is already close. When the reading is far from the Target or answers slowly (a big kettle), use a **PID**:
a Deadband would keep stepping up while the heat has not shown yet, and overshoot.

## Moving from BruControl

Import brings a BruControl Deadband Output in as a Skynet Deadband with the same settings. BruControl counts its output
from 0 to 255; Skynet counts it in %, so the Initial Output and the two Drives are changed to % on the way in (the import
report says so; check them).
