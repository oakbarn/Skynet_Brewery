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

## A Sump Pump you plug in

Most brewers turn a **sump pump** on by plugging it in or switching its outlet by hand: no relay or SSR. In Skynet it is a
**Manual Pump** with the Sump pump picture (Skynet Rule 5.15a). To add one, pick **Sump Pump by hand** in Select Widget Type >
Semi_Widgets_Devices (or Select Device Type > Pumps). It is the same as picking Manual Pump, then Sump pump in step 2. Its Label
starts **Sump 1**, so its name is `wgt_MP_Sump~1_BR` on the Brew Tab.

A click on it (or a Process line such as `wgt_MP_Sump~1_BR.state = true`) asks you to turn it on by hand. It shows **ON** and its
hose shows flow only after you confirm.

**Example: the OakBarn Brewery ice water loop.** A sump pump sits in a large ice bath (a trash can of ice and water). It pumps
the ice water through a first plate chiller, which cools the tap water, and the ice water goes back into the bath. The cold tap
water then runs through a second plate chiller, against the wort, and goes out to water the lawn. Help 201,
[The Ice Water Can](201-ice-water-can), shows how to draw it.
