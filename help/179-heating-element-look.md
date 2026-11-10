# Heating Elements and Valves on the screen

How a Heating Element and a Valve look and answer a click on a Tab (Skynet Rules 2.46, 6.19 and 7.8).

## The On overlay

While something is On, its **Overlay** is drawn on top of its picture. It has **no border** round it and it is **drawn small**,
in the middle of the picture, so the picture underneath still shows. This is the same for every overlay: pumps, valves, heaters
and your own pictures. A glow (Glow red, orange or blue) colors the picture itself and the Green glow ring goes round it, so those
two stay the size of the picture.

A **Heating Element's Overlay** has these choices:

| Overlay | What shows while it is On |
|---|---|
| **Glow** (the start) | It glows. A Skynet element shows its glowing picture; one built into a Vessel Device glows orange. |
| **None** | Nothing at all. The picture stays as it is. |
| A bolt or another picture | The glow, with the picture drawn small on top. |

## The method buttons

A Heating Element allowed more than one heating method has a small button for each one just below its picture. The buttons sit
in an invisible box that is only as wide as the methods you ticked, with its middle under the middle of the picture. One click on a
button switches the Element to that method; the one in use is red. Picking a method never turns it On.

**Direct** is full on or off. It used to be called **On/Off**; a Process that still says `hE_1.method = "On/Off"` works the same.

To make the buttons take less room, turn on **Short method names on its buttons** in the Element's Properties (under the method
tick boxes):

| Method | Short name |
|---|---|
| Direct | DO |
| Duty Cycle | DutyC |
| Hysteresis | HYS |
| PID | PID |
| Deadband | DeadB |
| Precise | PREC |

These are the same short words a Process uses, for example `hE_1.HYS`. There is no Turn Off button: one click on the picture turns
the Element Off.

## Toggle or Push Button

A Valve and a Heating Element always have one of these two in their **Toggle** box. There is no None.

- **Toggle** (the start): one click on the picture turns it On or Off at once.
- **Push Button:**
  - **A Heater:** you can hold and the Heater is Direct On in the On State as long as you hold the Button. You can no longer Toggle
    it On and Off with the Image.
  - **A Valve:** you can hold and the Valve is Direct On in the On State as long as you hold the Button. You can no longer Toggle it
    On and Off with the Image.
  - **If it is already On**, the Push Button is reversed: holding down turns it Off, but only as long as the picture is held down.
    Let go and it is On again.

A **Process ignores this choice**: a Process, the .API and voice turn it On or Off as always. A Valve or Heating Element that had
None is changed to Toggle when its Schema loads. A Manual valve has no power, so it has neither.

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed
Electrician.
