# PID Auto-tune: let Skynet find Kp, Ki and Kd

**Auto-tune** works out the **Kp**, **Ki** and **Kd** of a Heating Element for you, so you do not have to guess them. **PID** and
**Precise** use the same three numbers (Rule 6.19), so one Auto-tune serves both. It also finds the **Hold output %** that Precise
starts from (Help 156).

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.

## Before you start

1. **Water over the element** and the **Temperature Probe in the water**. Auto-tune turns the element On.
2. Type the **Setpoint** you brew at (for example the HLT at 150 °F). Tune at the temperature you will hold: a pot tuned at 150 °F
   holds 150 °F best.
3. Fill the vessel as full as you usually brew. A different amount of water needs different numbers.

## Start it

1. Open the Heating Element's **PID** or **Precise** Settings (Ctrl + Click on it, or its ⬢ in the Properties).
2. Press **🎯 Auto-tune**.
3. Check the **Highest temperature**. It starts at the Setpoint plus 10 °F (5 °C). If the probe reads above it, Auto-tune stops and
   the element turns Off.
4. Press **▶ Start**.

The dialog shows what it is doing: **Warming up to the Setpoint**, then **Swing 1 of 5** to **Swing 5 of 5**. It runs on the Brain,
so you can close the dialog and come back. **■ Stop** stops it any time, and turning the element Off stops it too.

## How long

A kettle takes about **30 to 90 minutes** (more from cold water), a RIMS tube a few minutes. It gives up after 3 hours.

## What it does

Skynet turns the element up when the water is a little below the Setpoint and down when it is a little above it, five times. It times
each swing and measures how far the temperature goes. A pot that swings slowly needs gentle numbers; one that swings fast and far
needs firmer ones. From that it works out Kp, Ki and Kd.

## Use or Keep old

When it is done the element turns Off, and the dialog shows the **Old** and the **New** numbers side by side:

| | Old | New |
|---|---|---|
| Kp | 10 | 25.65 |
| Ki | 0.1 | 0.0288 |
| Kd | 0 | 1647.9 |
| Hold output % (Precise) | 0 | 80 |

- **✔ Use new numbers** saves them at once.
- **Keep old** changes nothing.

Nothing is changed until you press Use. The new numbers stay on the element until the next Auto-tune: a Process can read them as
`.autotune_kp`, `.autotune_ki`, `.autotune_kd` and `.autotune_hold`, and `.autotune` says what it is doing.

## Tips

- The numbers are calm ones, picked for little overshoot. If it is slow to reach the Setpoint, raise Kp a little.
- A big Kd makes the % jump when a DS18B20 probe steps 0.11 °F. The water does not mind, but if you would rather the % stay calm, use
  **Precise** (it smooths the probe) or lower Kd.
- Stopped with **"the Temperature Probe gave no reading"**: check the probe. **"above the Highest temperature"**: raise it a little or
  start from cooler water.

## The technical side

It is a relay auto-tune with a bias (Åström and Hägglund). The output is bias + d while heating and bias − d while resting, with a
small band around the Setpoint (0.5 °F or 0.3 °C) so the probe's steps do not make it chatter. A heater heats faster than a pot
cools, so after each swing the bias moves until the heating and resting halves take about as long; the bias it ends on is the
Hold output %. Each swing gives Ku = 4 d / (π √(a² − band²)), where a is half the swing, and the period Tu. The first swing is the
warm-up and is not used; the last three are averaged. The Tyreus-Luyben rules turn them into Kp = Ku / 2.2, Ki = Kp / (2.2 Tu) and
Kd = Kp × Tu / 6.3. Rule 6.39, public/autotune.js.
