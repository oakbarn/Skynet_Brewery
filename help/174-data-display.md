# Data Display: pick which value shows

Some Devices have more than one value. A Flow meter has its Rate and its Total, and a PID has its Output % and its Setpoint.
**Data Display** (Skynet Rule 6.26) picks which of them shows on the Tab. BruControl had a Primary Value and a Show Secondary
Value switch; Skynet lists every value the Device has.

## The choices

| Device | Data Display choices (the first shows them all, as before) |
|---|---|
| PID, Deadband | Output % and Setpoint, Output %, Reading (its probe), Setpoint |
| Hysteresis | ON / OFF and Setpoint, ON / OFF, Reading (its probe), Setpoint |
| Duty Cycle | Duty cycle %, ON / OFF now |
| Heating Element (run by a method) | What it is doing and its Setpoint, Output % or ON / OFF, Reading (its probe), Setpoint |
| Flow meter | Rate and Total, Rate, Total |
| Scale | Volume and Weight, Volume, Weight |
| PWM or Analog output with Measured volts | Value and Volts, Value, Volts |

Open the Device's **Properties** and pick **Data Display (what it shows)**. While a Device is switched off, it shows OFF as before.

## In a Process

```
Flow_1.display = "Total"      (by its words, any capitals)
Flow_1.display = "rate"
Flow_1.display = ""           (back to its Properties' pick)
print Flow_1.display
```

A word the Device does not have stops the Process with a message that lists its choices.

**BruControl's Primary Value:** a Flow meter's `.value` is the value its Data Display shows: its Rate, or its Total when Total is
picked. So a BruControl script that reads the Primary Value works either way.

## BruControl Import

An item with BruControl's **Show Secondary Value** switched off gets the Data Display of its main value (Output %, ON / OFF,
Rate or Value). The Import notes list them. Switched on (the usual) shows them all, as before.
