# Pumps: one click turns them on or off

On a Tab (not in Edit layout), **one click** (or one tap on a phone) on a **Pump** turns it **ON**, and the next click turns it
**OFF**, the same way a valve opens and closes. No ON / OFF pop-up comes up first (Skynet Rule 2.33). A Picture Widget that
follows a Pump works the same way.

- **Double-click** still opens the Pump's Properties (Skynet Rule 2.9).
- Only an operator or an admin can turn a Pump on or off. A view-only login sees a note instead.
- **Heating Elements work the same way** (since 2026-11-08): one click turns one ON or OFF at once, in the heating method it is in,
  whether it is on its own on a Tab, followed by a Picture Widget, or built into a Vessel Device. Make sure there is liquid over
  the element before you turn it on: a dry element can burn out.
- A **Valve built into a Vessel Device** opens or closes with one click on its picture, like any valve.

## Dual Action: click or hold

A Pump's **Toggle** (in its Properties) can be **On/Off** (one click turns it on or off), **Push Button** (on only while held),
**Dual Action** or **None**. With **Dual Action**, a click turns the Pump on or off, and pressing and holding it for more than half
a second makes it a Push Button: on while you hold it, off when you let go. Handy for topping off a vessel with a little water by
hand on a Brew Day (Skynet Rule 2.50).

## Pumps made before this change

The first time the panel starts with this version, every Pump in every Schema that used to ask ON / OFF is changed to one click.
Nothing else about the Pump changes. Heating Elements that used to ask are changed the same way, once, the first time the panel
starts with the 2026-11-08 version.

## I want a Pump to ask first

Double-click the Pump or Heating Element (or open it from the Build Tab), click the **⬢** beside **When tapped**, and turn on
**Ask before changing (ON / OFF buttons)**. Save. That Pump asks again; the others stay one click.
