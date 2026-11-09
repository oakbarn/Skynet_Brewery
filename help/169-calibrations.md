# Calibrations and Measured volts

## Calibrations on a reading

A **Temperature Probe**, an **Analog In** and a **Flow meter** can have a list of **Calibrations** (Skynet Rule 6.24). They work like
layers: each one changes the result of the one before, top to bottom, and the last result is what the Device shows and what a
Process reads.

| Calibration | What it does |
|---|---|
| Linear Offset | adds a number (a minus number takes away) |
| Linear Multiplier | multiplies by a number |
| Linear Divider | divides by a number |
| Floor | never lower than this |
| Ceiling | never higher than this |
| Thermistor (Steinhart-Hart) | turns a thermistor's raw reading into Kelvin (its pad resistor and the A, B, C numbers from its data sheet) |
| Celsius / Fahrenheit / Kelvin | turns one temperature scale into another |
| Lookup Table | pairs of a reading and the value it means, one pair per line, with straight lines between them |

**Where they start:** a probe starts from its own temperature (after its probe type and its offsets) and a flow meter from its rate.
An Analog In with calibrations starts from its **raw** 0-1023 reading, instead of its Signal settings. That is how a thermistor on an
analog pin reads: Thermistor, then Kelvin to Fahrenheit.

**Setting them:** open the Device's Properties. On a probe, click the **⬢** beside **More calibrations**.

- **➕ Add calibration** adds one at the bottom. Pick its kind, then type its numbers.
- **↑** and **↓** move it earlier or later. The order matters: times 2 then plus 1 is not the same as plus 1 then times 2.
- The **switch** turns one off without losing it. **✕** removes it.

**Example:** a pressure sensor that reads 8.9 at 29 inches and 200 at 175 inches is a Lookup Table with two lines, `8.9, 29` and
`200, 175`.

## Measured volts on a PWM or Analog output

A PWM output driving a DAC (a board that turns PWM into 0-10 V) seldom gives exactly 10 V at 100 %, and each board is different. So
measure it:

1. Set the output to a few settings (for example 0 %, 50 % and 100 %).
2. Measure the volts with a meter each time.
3. In the output's Properties, write each pair on its own line under **Measured volts**, for example `0, 0`, `50, 4.6`, `100, 9.4`.

The output then shows about how many volts it gives, for example `75 %  ≈ 7.0 V`. A Process reads `My_DAC.volts`, and
`My_DAC.volts = 7.5` sets the % the pairs say gives 7.5 V.

## From BruControl

The BruControl Importer keeps each Analog In's and probe's calibrations in the same order, with its Decimal Places, Prefix and Suffix
(the Suffix becomes its Units). A PWM output's BruControl calibrations are not copied, because BruControl counts a PWM output 0-255 and
Skynet counts it in %. They are listed in the Import notes.
