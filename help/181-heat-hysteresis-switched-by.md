# Heat Hysteresis: what switches the element

A Heating Element says what turns it on and off: its **Switched by** (Skynet Rule 6.29). That decides how close its **Hysteresis**
may hold the Setpoint, so the part that does the switching lasts.

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed
Electrician.

## The choices

| Switched by | Hysteresis On offset | On delay | Why |
|---|---|---|---|
| **Optical SSR** (solid state relay, the start) | 0.5 to 3 °F | any | No moving parts: it may switch often. |
| **Contactor** | 2 to 5 °F | at least 60 seconds | Its contacts wear a little each time they close. Fewer, longer heats make them last. |
| **Mechanical relay** | 2 to 5 °F | at least 60 seconds | The same as a contactor. |

With a °C probe the numbers are converted: an Optical SSR 0.3 to 1.7 °C, a Contactor or Mechanical relay 1.1 to 2.8 °C.

- The **On offset** is how far below the Setpoint the element turns on. It turns off at the Setpoint (or a little before it, when
  Predictive Hysteresis is on: see Help 168).
- The **On delay** is the shortest time it stays off before it may turn on again.

## Where it is

- **Properties > Heating method > Switched by.** Under it, a line says the range for this element. When Hysteresis is ticked but is
  not the method it starts with, its On offset and On delay still show, so they can be set.
- **Save** refuses an On offset or On delay outside the range, and says what is allowed.
- **A Process or the .API** gets the same plain error: `hE_1.onoffset = 8` on an element switched by an Optical SSR is refused.
- **The Brain** never runs a heating Hysteresis outside its range, whatever was saved.
- Only Hysteresis that **heats** (a plus On offset) has a range. A minus On offset cools and is not checked here.

## The BruControl Import

BruControl does not say what switches a heater, so each imported heating element starts as an **Optical SSR**. A Hysteresis On
offset outside 0.5 to 3 °F is brought to the nearest end of that range, and the Import notes list each one. If a Contactor or
Mechanical relay switches it, pick that in its Properties.

See also: [The heating method](150-heating-method), [Predictive Hysteresis](168-predictive-hysteresis).
