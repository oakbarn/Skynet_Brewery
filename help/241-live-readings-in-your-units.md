# Live Readings in Your Units

A Pressure transducer, a Level transmitter, a Flow meter and a Vessel scale show their readings in **☰ Menu > Settings >
Units**: **US Standard** shows psi, gal, gal/min and lb; **Metric** shows bar, L, L/min and kg. Switching Units only changes what
you see. It never changes a saved number (Rule 2.59).

## Kept in: the sensor's own units

Each sensor keeps its numbers in the units it is calibrated in: its **Units** box (a Flow meter or Level), or its **Weight
units** and **Volume units** (a Vessel scale). Its range, its pulses per unit and its counts per unit stay in those units, so a
30 psi transducer is still set up as 0 to 30 psi. The box is never changed for you.

| Sensor | A new one starts in | Shown in US Standard | Shown in Metric |
|---|---|---|---|
| Pressure transducer 0.5-4.5 V | psi (sold by its psi range) | psi | bar |
| Level transmitter 4-20 mA | L | gal | L |
| Flow meter (YF-S201: 450 pulses per liter) | L | gal/min and gal | L/min and L |
| Vessel scale | kg and L | lb and gal | kg and L |

A unit that is already in your Units stays as it is: a kPa sensor shows kPa in Metric. pH, %, SG, volts and the like never
change. Temperatures follow Units too (Help: Temperature Probe Device Properties).

## Where it shows

- The reading on its Tab, and its **Data Display** (Rate, Total, Weight, Volume).
- Its **Dial**: the Lowest, Highest, Cool and Hot boxes show and are typed in the Units.
- A message from a Process (`print "Keg " + Keg_Pressure` shows 12 psi in US Standard and 0.83 bar in Metric).

## In a Process

A Process works in metric, whatever the sensor keeps: a pressure in **bar**, a volume in **L**, a flow rate in **L/min**, a
weight in **kg**. Type a plain number in your Units, the same as a temperature:

```
wait Keg_Pressure >= 12
```

In US Standard that is 12 psi. When the Process is saved it is kept as `0.8274bar`, so it means the same after Units is
switched, and it opens again as `12`. A number typed with its sign is always that: `12psi`, `0.8bar`, `5gal`, `18.9L`,
`10lb`, `4.5kg`, `2gpm` (gal/min), `7.5Lpm` (L/min). A calibration (a scale's `.calibrate`, its known weight) stays in the
sensor's own units. A Value Widget is not a sensor: it shows and keeps what is put in it.
