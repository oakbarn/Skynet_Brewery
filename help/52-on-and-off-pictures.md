# On and Off pictures

An output can show one picture while it is **On** and another while it is **Off**. A pump can show a spinning pump, a burner a flame, a valve open or closed.

## Which items have them

Every Device or Widget that has an On / Off state has two settings, **.imageOn** and **.imageOff**. The Tab swaps them by itself, so no Process is needed.

- **Digital Output** (pumps, valves, burners, elements, LEDs ...): On while the pin is on.
- **PWM Output**, **Analog Output** and **PID**: On while running above 0 %.
- **Duty Cycle** and **Hysteresis**: On while their pin is on.
- **Timer**: On while it is running. **Stepper**: On while it moves. **Flow meter**: On while something flows. **Sound Player**: On while it plays.
- **Digital Input**, **Switch**, **Alarm** (sounding / quiet) and a **Picture** that follows another item.

## Setting the two pictures

1. Press **Edit layout** and double-click the item to open its **Properties**.
2. Pick **Picture when on** from the dropdown. You see a small preview beside it.
3. Pick **Picture when off** the same way.
4. Press **Save**.

The dropdown has LEDs (green, red, grey), lightning bolts and ball valves. Pick **Add new ...** for your own picture: type its name in `media/Images`, for example `MyPump_On.png` or `Pumps/MyPump_On.svg`. PNG, JPG, GIF and SVG pictures all work. Put your pictures on the Brain with the **File Move** page first.

Leave a picture at **(none)** and the item shows its normal background picture (picture path 1-3) or color in that state instead.

## From a Process

You never need a Process for the swap. A Process can still change either picture while it runs, for example to show a different pump:

```
Pump_1.imageOn = "Images/MyPump_On.png"
Pump_1.imageOff = "Images/MyPump_Off.png"
```
