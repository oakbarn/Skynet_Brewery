# Skynet Dial and Timer Digits

Skynet draws its own temperature gauge and timer digits (Skynet Rule 2.40). They are **Skynet's own drawings**,
made from lines (SVG), so they stay sharp at any size and on phones. Skynet never copies
another company's pictures, code or style names.

## The Skynet Dial

An arc with a needle, and the reading in big digits under it. It fits a **Temperature Probe** best, and also works on an analog
input, a PWM or analog output, a Duty Cycle, PID or Deadband output and a Heating Element (its output %); a Process can also put it
on a Value Widget or a number gGlobal.

**To use it:** in the Temperature Probe's Properties pick **Display > Skynet Dial** (any other Device: the **Text attributes ⬢**,
**Look > Skynet Dial**). The ⬢ beside it holds the Dial settings:

| Setting | What it does |
|---|---|
| **Lowest** and **Highest** | The numbers at the two ends of the arc. Empty = 0 to 220 for °F, -20 to 110 for °C, 0 to 100 for anything else. |
| **Setpoint** | The target. Type a number (170), or the **Name** of a Device or gGlobal to follow (a heater's Setpoint, or its value). Empty = no Setpoint. |
| **Cooler range** | How far below the Setpoint is still OK (empty = 2). |
| **Hotter range** | How far above the Setpoint is still OK (empty = 2). |
| **Cold color**, **OK color**, **Hot color** | The reading's colors (Default = Blue, Green, Red). |

The reading shows the probe's **Decimals**: 0, 1 or 2.

**With a Setpoint** the arc has three parts and a mark at the Setpoint, and the reading changes color:

- more than the **Cooler range** below the Setpoint: **Cold color** (Blue)
- more than the **Hotter range** above the Setpoint: **Hot color** (Red)
- in between: **OK color** (Green)

For example, Setpoint 152, Cooler range 2, Hotter range 1: 149 is blue, 151 and 153 are green, 153.5 is red.

**With no Setpoint** the arc runs from blue through green and yellow to red, and the reading is the item's own text color.

A Process can switch it on: `BK_Temp.valueType = "Dial"` (`"Text"`, `"LED"` or `"Gauge"` switch back).

## Timer Digits

A Timer's look is its **Style** ([Timer Widget](92-timer-widget)). A **User Style** (➕ Add new User Style…) now has:

- **Back color**: round the digits panel, under the title bar.
- **Text Fore color**: the digits. **Text Back color**: the panel behind them.
- **Frame**: the frame round the panel, from the Skynet Timer frames: **Rounded corners**, **Square corners**, or **Square top,
  rounded bottom**, with its **Frame color** (any color: Black, Blue, Green, Grey, Orange, Purple, Red, White, Yellow or Custom).

Each Timer also has, in its Properties:

- **Digits**: **hh:mm:ss** (01:30:00) or **hh:mm** (01:30).
- **Seconds only in the last minute**: on, a Timer counting down shows just the seconds (**45**, **44** ...) once less than one
  minute is left, so the last minute is easy to read.

## Gauge settings: shape, tick marks, the Skynet Bar and color styles

The same ⬢ holds **Gauge settings** (Skynet Rule 2.40 point 4), the kinds of settings most gauge programs have, all drawn by Skynet:

| Setting | What it does |
|---|---|
| **Dial shape** | Standard (two thirds round, as before), Full round, or Half round |
| **Large tick marks** | How many big ticks, each with its number (2 to 21; empty = 6) |
| **Small tick marks between** | Little ticks between two big ones (0 to 10; empty = none) |
| **Bar direction** | For the **Skynet Bar**: up and down, or side to side |
| **Color style** | Skynet Classic (as before), Skynet Dark, Steel, Night Green, Amber, Ice Blue, Fire Red or Paper. It also colors **LCD** and **LED digits** |

The **Skynet Bar** is a straight gauge: pick **Display > Skynet Bar** (or **Look > Skynet Bar**). It uses the same Lowest, Highest,
Setpoint, ranges and colors as the Dial, and fills up to the reading. A Process can switch to it with `name.valueType = "Bar"`.
