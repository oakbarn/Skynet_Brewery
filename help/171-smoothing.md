# Smoothing a jumpy reading

Some readings jump about: a thermistor (NTC) probe on a long wire, a flow meter that counts pulses, a scale with a stirrer
running. **Smoothing** (Skynet Rule 6.24) calms them. It is the same idea as BruControl's **Avg Weight**.

## How it works

**Smoothing %** is how much each new reading counts:

| Smoothing % | What you see |
|---|---|
| 100 | no smoothing: the number jumps with every reading |
| 50 | each new reading moves the number halfway |
| 25 | calm: a jump of 4 degrees shows as 1, and a real change still shows in a few seconds |
| 10 | very calm, but slow to show a real change |

Leave it empty for the starting value: **25 % for a thermistor (NTC) probe**, 100 % (none) for everything else.

## Where it is

Open the Device's **Properties** and set **Smoothing %**. It is on:

- every **Temperature Probe**
- every **Analog In**
- a **Flow meter**: its rate is smoothed; its Total always counts every pulse
- a **Scale**: its weight and volume; Auto tare still works
- a **Digital In** set to **Counter**: see below

## A Counter's Rate

A Digital In set to **Counter** now also has a **Rate**: the counts per second over its **Sampling Period** (1 to 10 seconds,
empty = 1), the same as BruControl's Counter Input. The Rate is then smoothed. The **Count** itself is never smoothed.

## In a Process

A Process, an Alarm and the Tab all see the smoothed number. The reading before smoothing is `.raw`:

```
if MB_A0_10KNTC_Mash~Tun_MT > 152      (the smoothed reading)
print MB_A0_10KNTC_Mash~Tun_MT.raw     (the reading before smoothing)
print Water_Flow.raw                   (a flow meter's rate before smoothing)
print Pulse_Counter.rate               (a Counter's counts per second)
```

## BruControl Import

BruControl's **Avg Weight** on an Analog In or temperature port becomes its **Smoothing %**. The Import notes list them.
