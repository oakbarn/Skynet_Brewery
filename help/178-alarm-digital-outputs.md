# Alarm Digital Outputs: an Alarm can switch a light or a horn

An Alarm can turn up to **2 Devices** ON while it is going off, and OFF again when it stops (Skynet Rule 7.19). Use it for a warning
light, a horn, a buzzer or a relay.

## Set it up

1. In Edit layout, double-click the Alarm Widget to open its **Alarm Widget Properties**.
2. Pick **Digital Output 1** and, if you like, **Digital Output 2**. Each list shows the Devices with an ON / OFF state.
3. Click **Save**.

Both start on **None**. A slot left on None does nothing.

## What happens

| The Alarm | Its Digital Outputs |
|---|---|
| goes off (active) | turn **ON** |
| stops (tapped off, or a Process sets it off) | turn **OFF** |

A Process that sounds the Alarm (`alm_Boil = On`) switches them too. If a picked Device has no ON / OFF state, nothing is switched
and the Console says so.

See also [The Alarm Widget](107-alarm-widget) and [Alarm Email](175-alarm-email).
