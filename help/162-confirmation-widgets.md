# Confirmation Widgets

Some things on a brewery are done **by hand**: no Interface (board) turns them on. A **Confirmation Widget** stands for one of
these on a Tab, so your Tab and your Processes still know whether it is On (Skynet Rule 1.28).

The Confirmation Widgets today are:

- **Manual Valves** (a Manual Ball Valve or a Manual Butterfly Valve).
- **Manual Pumps** (a pump plugged into a wall outlet, with no Interface Port).
- **Moving a QD Hose** (a Quick Disconnect hose) to a Vessel or to another QD.

More may be added later.

## How it works

A Confirmation Widget **does not turn anything on**. When it is commanded **On or Off**, either by a **click on it** on the
screen or by **Process code** such as `Pump~7.state = true` (On) or `Pump~7.state = false` (Off):

1. Skynet shows a **pop-up** asking you to do it by hand, for example "Turn on Pump 7".
2. You do it on your brewery, then confirm in the pop-up.
3. Only then does the Widget show **On** or **Off** (Open or Closed, Connected or not).

A Process that commands one waits, and the Widget blinks on its Tab, until someone confirms. This is how the Manual Valve has
always worked ([Help 87](87-pipe-fittings-and-manual-valves)).

Everything else on a Tab turns On or Off with one click and no pop-up (Skynet Rule 2.44). Confirmation Widgets are the one
exception, because the pop-up is not a question before switching: it is you telling Skynet that you did it.

## The .confirmation switch

Every Widget that can be On or Off has a **.confirmation** switch in its Properties. When it is on, that Widget is a Confirmation
Widget. It starts on for Manual Valves, Manual Pumps and QD Hoses, and off for everything else.
