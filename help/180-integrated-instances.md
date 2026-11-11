# Heating Elements built into a vessel

What happens when a Heating Element is built into a Vessel Device, and how its Properties work (Skynet Rules 2.47, 3.16, 6.1 and 6.28).

## A Clone: one Device, many places

A Clone (Skynet Rule 4.4) is not a new Device. It and its Device have **one set of Properties**: change one and the other changes.
Turn one On and they are all On. Think of a Device and its Clones as ONE.

![A Device and its Clones are one](help_pictures/Clone_Hive_Cube.svg)

## An Integrated Instance

When you build a Heating Element that is already on a Tab into a Vessel Device, Skynet makes an **Integrated Instance** of it. It
is not a Clone. It starts as a copy of that Heating Element's Properties, and from then on it is **independent**: it has its own
On and Off, its own heating method, its own Setpoint and its own look. Changing one never changes the other. The Heating Element on
its Tab stays where it is.

There can be more than one Instance of the same Heating Element, for example one in the HLT and one in the Boil Kettle.

**They all use the same Interface Port**, the Port of the Heating Element they came from. An Instance can't change its Interface or
Port (they are greyed out). Nothing else may use that Port.

An Instance is more like **Bob** of the Bobiverse (*We Are Legion*) than a Clone: it starts as a copy and then goes its own way.

![Bob of the Bobiverse](help_pictures/Bobiverse_Bob.png)

*Picture: the [Bob page of the Bobiverse Wiki](https://bobiverse.fandom.com/wiki/Bob) (Fandom, CC BY-SA).*

**Last One Rules** (Rule 6.28, "All for One, One For All"): only one of them can be On at a time.

![All for One, One For All](help_pictures/Three_Musketeers.png)

- Turning one On takes the Port. The others on it go Off.
- Turning one Off turns the Port Off. Every one on it is then Off.

## In a Process

Every Device built into a Vessel Device (a Heating Element, Probe or Thermowell) is called by the vessel's name, a dot and its own
name: `HLT_Vessel.BM_8_DO@HE_HLT~element_BH = On` (Skynet Rule 5.31). Its plain name alone is refused, so a Process always says which
vessel it means. An Instance's own name already is the vessel's name, a dot and the Heating Element's name. Capitals don't matter.
When a Device or a vessel is renamed, every Process is changed for you.

| Line | What it does |
|---|---|
| `HLT_Vessel.hE_1 = on` | turns the HLT's Instance On |
| `HLT_Vessel.hE_1.setpoint = 152` | sets the HLT Instance's Setpoint |
| `hE_1 = off` | turns the Heating Element on the Tab Off |

A space in a vessel's name becomes `_` in this name.

## Its Properties

Double-click a built-in Heating Element in Edit layout to open **Integrated Heating Element Device**.

- **No Hidden Locked.** An Integrated Item has no Hidden Locked switch. If an older Schema has one set, it is ignored. **Visible**
  still works.
- **Help balloons:** rest the mouse on Visible, on the lock or on any name in the box to see what it does.
- **The Label's balloon** names your Label and shows your Suggested Name with the Label part in red, for example
  MB_22_DO@HE_**HLT~Element**_BH. Spaces in a Label become ~ in the name. The red ⬢ beside the Label sets its font, size and colors; the
  red ⬆ opens a Text Box with 2 lines.

## The Suggested Name follows the Label

Type a new Label (or pick another Interface, Port, Type or Tab) and the **Suggested Name** under the Name changes at once. The Name
itself only changes when you change it.

To change the Name, press **✏ Change name**. The **Name Change** box shows the name now, a box for the new name and the Suggested
Name. Its buttons:

- **✖ Cancel** keeps the name.
- **💾 Save** saves the name you typed.
- **💾 Update to Suggested** saves the Suggested Name in one click. A Process or a Schema has no Suggested Name, so there it is greyed.

Every Process that uses the old name is changed to the new one for you.
