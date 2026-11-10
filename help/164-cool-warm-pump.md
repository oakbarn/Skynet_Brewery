# Cool / Warm Pump

A **Cool / Warm Pump** is a pump that a temperature switches: a glycol pump that cools a fermenter, or a pump that brings warm
water to it. In Skynet it is **one Pump Device on its port** (One Port, One Device), never a pump plus a separate Hysteresis
Device (Skynet Rule 6.21).

## Its name

Its Device Type ID is **CPMP**, so its suggested name reads plainly, for example `MB_D5_CPMP_Cool~Pump_FR`:

| Part | Example | What it is |
|---|---|---|
| Interface ID | `MB` | the board it is wired to |
| Port | `D5` | the pin |
| Type ID | `CPMP` | a Cool / Warm Pump |
| Label | `Cool~Pump` | your words, a space becomes `~` |
| Tab ID | `FR` | the Tab it is on |

## Its Method

Double-click the pump. Under **Cool / Warm Pump: its Method** pick how it runs:

- **Direct** (was On/Off): a click or a Process turns it on and off.
- **Hysteresis**: it runs by its **Temperature Probe** to hold a **Setpoint**. A **minus On offset cools** (it turns on above the
  Setpoint, for a glycol pump); a **plus On offset warms** (it turns on below the Setpoint). **On delay** waits that many seconds before
  it turns on again.

Tick **Hysteresis allowed too** to switch between the two with one click on the Tab, or from a Process. A pump is never run by
Duty Cycle, PID, Deadband or Precise: they switch the motor on and off many times a minute and wear it and its relay out.

## In a Process

The words are the same as a Heating Element's:

```
MB_D5_CPMP_Cool~Pump_FR.method = "Hysteresis"
MB_D5_CPMP_Cool~Pump_FR.setpoint = 66
MB_D5_CPMP_Cool~Pump_FR.onoffset = -1
MB_D5_CPMP_Cool~Pump_FR = On
```

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.
