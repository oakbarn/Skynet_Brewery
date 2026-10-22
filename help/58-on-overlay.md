# On overlay

Instead of two pictures (one for **On**, one for **Off**), an item can keep **one picture** and show a small picture **on top of it** while it is On, for example a lightning bolt. The picture underneath stays visible.

## Which items have it

Every Device or Widget that has **Picture when on** and **Picture when off** (see On and Off pictures) also has **On overlay**, right below them. That is Digital Outputs (pumps, valves, burners, elements ...), Digital Inputs, Switches, Alarms (shown while sounding), PWM and Analog Outputs, PID, Duty Cycle, Hysteresis, Timers, Steppers, Flow meters, Sound Players and a Picture that follows another item.

## Setting it up

1. Press **Edit layout** and double-click the item to open its **Properties**.
2. Pick your one picture in **Picture when off**. Leave **Picture when on** at **(none)**.
3. Pick a picture in **On overlay**. You see a small preview beside it.
4. Press **Save**.

Now the item shows its picture all the time, and the overlay appears on top of it while it is On.

The **On overlay** dropdown has:

- **Lightning bolt (corner badge)**: a small yellow bolt in the top right corner.
- **Lightning bolt (big, see-through)**: a large half see-through bolt over the middle.
- **Green glow ring**: a green glow around the picture.
- Your own overlays from the **On_Off** folder (`media/Images/On_Off`), listed next.
- Then every other picture in `media/Images`, and **Add new ...** to type the name of your own.

Pick **(none)** to turn the overlay off. The three built-in overlays are in the On_Off folder too.

## Your own overlay picture

Use a **PNG or SVG with a see-through (transparent) background**, so the picture underneath shows through. A JPG, or a PNG with a white background, will cover the picture underneath. Put the file in the **On_Off** folder on the Brain with the **File Move** page (or the Media page), and it shows up in the On overlay dropdown near the top. A picture somewhere else works too: pick it with **Add new ...**, for example `MyBolt.png`.

The overlay is stretched to fit the item, keeping its shape. Draw it on a square canvas and put the mark where you want it (for example in a corner).

## Two pictures still work

Nothing changes for items that use two pictures. You can even use both: the On and Off pictures swap as before, and the overlay is drawn on top while On.

## From a Process

A Process can change the overlay while it runs:

```
Pump_1.imageOverlay = "Images/On_Off/Overlay_Bolt_Center.svg"
Pump_1.imageOverlay = ""
```

The second line turns the overlay off.
