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
- **Glow red**, **Glow orange** and **Glow blue**: no extra picture. They color the picture itself while it is On, for example a heating element inside a vessel turns red. Only the drawn part is colored, so use a picture with a see-through background; on a picture with a white or solid background the whole box turns red.
- Your own overlays from the **On Off** picture group (`media/Images/On_Off`), listed next.
- Then every other picture in `media/Images`, and **Add new ...** to type the name of your own.

Pick **(none)** to turn the overlay off. The three built-in overlay pictures are in `media/Images/Skynet/On_Off` (read only).

## Your own overlay picture

Use a **PNG or SVG with a see-through (transparent) background**, so the picture underneath shows through. A JPG, or a PNG with a white background, will cover the picture underneath. Put the file in the **On Off** picture group (`media/Images/On_Off`) on the Brain with the **File Move** page (or the Media page), and it shows up in the On overlay dropdown near the top. A picture somewhere else works too: pick it with **Add new ...**, for example `MyBolt.png`.

You pick the overlay once per item, and it is sized to the picture underneath (not to the empty space beside a wide or tall picture). A PNG or JPG overlay is stretched to the same width and height as that picture, so draw it the same shape as your pictures. An SVG can say where its mark sits instead: the built-in corner bolt always stays in the top right corner of the picture, the big bolt stays in the middle, and the glow ring stretches around the picture.

## Two pictures still work

Nothing changes for items that use two pictures. You can even use both: the On and Off pictures swap as before, and the overlay is drawn on top while On.

## From a Process

A Process can change the overlay while it runs:

```
Pump_1.imageOverlay = "Images/Skynet/On_Off/Overlay_Bolt_Center.svg"
Pump_1.imageOverlay = ""
```

The second line turns the overlay off.
