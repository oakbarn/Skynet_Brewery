# LED Test Board: parts list

A plug-in test board for the Arduino Mega 2560. LEDs stand in for Pumps, Valves and other On/Off Devices, so a Schema
and its Processes can be tried at the desk, with nothing wet and nothing on mains power. Every LED gets a **220 ohm**
resistor.

Asked for by OakBarn Brewery, 2026-11-12. No store links (Skynet Rule 11.10). Search the part names below at any
electronics shop.

## Parts

| # | Part | How many | What it is for |
|---|---|---|---|
| 1 | Arduino Mega 2560 (or a Mega 2560 clone) | 1 | The board. You may already have one. |
| 2 | USB cable, type A to type B (printer style) | 1 | Mega to the Brain. |
| 3 | **Mega 2560 prototype shield** (also sold as "Mega proto shield", with a small breadboard on top) | 1 | Plugs straight on top of the Mega, so the test board comes off in one piece. |
| 4 | Solderless breadboard, 830 points | 2 | Room for the LEDs and resistors. |
| 5 | Jumper wires (Dupont), male to male, 20 cm | 1 pack of 40 | Mega pins to the breadboard. |
| 6 | Jumper wires (Dupont), male to female, 20 cm | 1 pack of 40 | For the shield's header pins. |
| 7 | 5 mm LEDs, **red** | 10 | **Pumps** (On/Off). |
| 8 | 5 mm LEDs, **green** | 10 | **Valves** (lit = open). |
| 9 | 5 mm LEDs, **yellow** | 10 | Heating Elements and other On/Off things (Fan, Light, Alarm). |
| 10 | 5 mm **RGB LEDs, common cathode, diffused** (4 legs) | 5 | PWM Devices: a PWM Pump's speed or a Proportional Valve. Each color leg goes on its own PWM pin. |
| 11 | **220 ohm resistors**, 1/4 watt | 1 pack of 100 | One for every LED leg (an RGB LED needs 3). |
| 12 | Tactile push buttons, 6 mm, 4 legs | 5 | Digital inputs: Float switch, Push Button, Interlock. |
| 13 | 10K ohm potentiometer (knob), breadboard type | 2 | An analog input that you turn by hand. |
| 14 | DS18B20 temperature probe (TO-92 or waterproof) and a **4.7K ohm** resistor | 1 each | A real temperature probe on the OneWire pin. |

**Easier to buy:** an "LED assortment kit" (5 mm, many colors) and a "resistor assortment kit" cover items 7, 8, 9, 11
and the 4.7K ohm resistor.

## How it is wired

- **LED:** Mega pin → 220 ohm resistor → LED **long leg** (+). LED **short leg** (−) → **GND** (the blue − row of the
  breadboard, joined to a Mega GND pin).
- **RGB LED (common cathode):** the **longest leg** → GND. Each of the other three legs (red, green, blue) → its own
  220 ohm resistor → its own **PWM** pin.
- **Push button:** one leg → the Mega pin, the other leg → GND. No resistor needed: Skynet's Mega code turns on the
  pin's own pull-up (`INPUT_PULLUP`).
- **Potentiometer:** outer legs → 5V and GND, middle leg → an analog pin (A0 to A15).
- **DS18B20:** red → 5V, black → GND, yellow (data) → the OneWire pin, and the 4.7K ohm resistor between data and 5V.

## Which pins

| Use | Mega pins |
|---|---|
| Red LEDs (Pumps) | D22 to D31 |
| Green LEDs (Valves) | D32 to D41 |
| Yellow LEDs (other On/Off) | D42, D43, D47, D48, D49 (and D14 to D17 if more are needed) |
| RGB LEDs (PWM) | D2 to D13 and D44 to D46: 15 PWM pins, so 5 RGB LEDs |
| Push buttons | D18 and D19 (these can also count pulses, like a flow meter), and any free plain pin |
| Potentiometers | A0, A1 |

Keep these free: **D0 and D1** (the USB talk to the Brain), **D20 and D21** (I2C), **D50 to D53** (SPI, for RTD boards).
Pick the real pins in Skynet's **Available Ports** list. It shows only the free ones that fit each Device.

## Do not overload the Mega

A red LED with a 220 ohm resistor draws about **14 mA**. One pin is fine (the limit is 40 mA, 20 mA is the safe working
level), but the whole Mega should stay under about **200 mA** in total. That is about **12 LEDs lit at the same time**.

- A test that turns on more than about 12 at once: use **1K ohm** resistors instead of 220. The LEDs are dimmer but
  still easy to see (about 3 mA each).
- Never wire an LED without its resistor. The LED or the pin can burn out.

## In Skynet

Make each LED a normal Device on the Mega's Interface, for example an On/Off Pump on Port 22. Its LED lights when the
Pump is On. A PWM Pump on an RGB LED's pin gets brighter as its Speed goes up. When the test is done, the same Schema
works on the real brewery: move each Device to its real Port.
