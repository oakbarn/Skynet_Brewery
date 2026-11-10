# Predictive Hysteresis: no overshoot

A **Hysteresis** turns its output **ON** at Setpoint + **Offset** (a heater's Offset has a minus, so below the **Setpoint**), and **OFF** when
the reading gets back to the Setpoint. But a heating element (or a chiller) does not stop the moment it is switched off: the heat
already in the element keeps going into the liquid, and the reading **overshoots** past the Setpoint.

**Predictive** fixes that (Skynet Rule 6.23). It is **on for every Hysteresis**: the Hysteresis Device, a Heating Element's
Hysteresis method and a Cool / Warm Pump.

## How it works

1. Each time the output turns off, Skynet watches how far the reading keeps going (its **coast**).
2. It averages the coast of the last runs.
3. Next time it turns off that much **before** the Setpoint, so the reading coasts up to the Setpoint and stops there.

The early OFF is never more than half the Offset (0.5 °F for -1).

## Safe for a compressor

Turning off earlier alone would make it start again sooner, which is hard on a fridge compressor or a glycol pump. So Predictive moves
the **ON point down by the same amount**. The swing between ON and OFF stays as wide as you set it, and it **starts no more often** than
without Predictive. The **On delay** (the shortest time off before it may start again) is always kept.

The one cost: the low point of each swing is lower by the same amount (for cooling, the high point is higher).

## Switching it off

Open the Device's **Properties** and turn **Predictive** off. It then works the plain way.

A heating element's Hysteresis also keeps to the Offset range of what switches it (Rule 6.29): see [Help 181](181-heat-hysteresis-switched-by).
