# Step by Step: Wire a Thermocouple

A **thermocouple** reads very hot places (a burner, a flue). The board reads it through a **MAX31856** (any type: K, J, T ...) or **MAX31855** (type K only) board on the shared **SPI** Ports and its own **CS** Port. This guide uses CS Port **D49**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- The **SPI** Ports (Mega **D50, D51, D52**), shared with every RTD board.
- One free **CS Port** (this guide: **D49**).
- One **MAX31856** or **MAX31855** board.
- One **thermocouple** (and thermocouple wire, never plain copper, if it must be longer) (see [Thermocouple](13-glossary#thermocouple)).

![Wiring: Wire a Thermocouple](help_pictures/Step_Wire_Thermocouple_01_Wiring.svg)

## Step 1. Power

Wire the Mega's **5V** to the board's **Vin**, and **GND** to **GND**.

## Step 2. The SPI wires

Wire Mega **D52** to **CLK**, **D50** to **SDO** and **D51** to **SDI** (a MAX31855 has no SDI: leave D51 off it).

## Step 3. The CS wire

Wire Mega **D49** to the board's **CS**.

## Step 4. The probe

Wire the thermocouple's **+** to **T+** and **-** to **T-**. The colors differ by country and type: check yours. Backwards, it reads down when it gets hot.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Probe (temperature)** > **Thermocouple type K (MAX31855 board)** or **Thermocouple K / J / T and others (MAX31856 board)**, with CS Port **D49**.

## Step 6. Check it

At room temperature it should read about room temperature; held in your hand, a little more.

## Other boards

- **A 3.3 V board:** wire **3.3V** to Vin.
- **Arduino Opta:** a thermocouple needs a **0-10 V transmitter**; see [Skynet Boards](206-skynet-boards).

## The technical side

- A thermocouple drifts a little: use an RTD for mash and boil, a thermocouple for flame heat.
- On the Mega program (`Mega_BrewPanel.ino`), set `USE_TC` to 1 (MAX31856) or 2 (MAX31855) and list the CS Port in `TC_CS_PINS` (for example `{49}`), then upload it again.
