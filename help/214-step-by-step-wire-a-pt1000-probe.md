# Step by Step: Wire a PT1000 Probe

A **PT1000** is an RTD probe, the most accurate kind of temperature probe. The board reads it through a **MAX31865 board** made for the PT1000 (its reference resistor is **4300 ohm**). The MAX31865 talks to the Mega on the shared **SPI** Ports and its own **CS** Port. This guide uses CS Port **D48**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- The **SPI** Ports (Mega **D50, D51, D52**), shared by every MAX31865 and thermocouple board.
- One free **CS Port** for this board (Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53; Rule 6.9). This guide uses **D48**.
- One **MAX31865 board** for a **PT1000** (4300 ohm reference resistor). For a PT100 use [Step by Step: Wire a PT100 Probe](213-step-by-step-wire-a-pt100-probe).
- One **PT1000 probe**, 3 wires is the usual (see [RTD](13-glossary#rtd)).

![Wiring a PT1000 probe on a MAX31865 board](help_pictures/Step_Wire_PT1000_01_Wiring.svg)

## Step 1. Set the board for 3 wires

The board comes set for 2 or 4 wires. For a 3 wire probe, set its solder jumpers for 3 wires, as the board maker's guide shows.

## Step 2. Power

Wire the Mega's **5V** to the board's **Vin**, and **GND** to **GND**.

## Step 3. The SPI wires

Wire Mega **D52** to the board's **CLK**, **D50** to **SDO**, and **D51** to **SDI**. Every MAX31865 board shares these three.

## Step 4. The CS wire

Wire Mega **D48** to the board's **CS**. Each MAX31865 board gets its own CS Port.

## Step 5. The probe

A 3 wire probe has two wires of the same color and one of another color. Put the odd-color wire on one side of the terminals and the two same-color wires on the other side, as the board maker's 3 wire picture shows.

## Step 6. Add the Device in Skynet

Add a probe (Select Device Type: **Probe (temperature)** > **PT1000 RTD (MAX31865 board)**) with its CS Port **D48**, as in [Step by Step: Add a Device](207-step-by-step-add-a-device). In its Properties, **Probe wires** is **3** and **Board reference resistor** is **4300**.

## Step 7. Check it

In ice water it should read about 32 °F (0 °C). A fault (no reading) most often means the jumpers are not set for 3 wires, or the probe wires are on the wrong side.

## Other boards

- **A 3.3 V board:** wire **3.3V** to Vin. Its SPI Ports are in [Skynet Boards](206-skynet-boards).
- **Arduino Opta:** a PT1000 needs a 0-10 V transmitter; see [Skynet Boards](206-skynet-boards).

## The technical side

- A PT1000 on a MAX31865 sees steps of about 0.03 °C, fine enough for Precise heating.
- 3 wires cancel out the probe wires' own resistance; 4 wires do it best; 2 wires only for short leads.
- On the Mega program (`Mega_BrewPanel.ino`), set `USE_RTD` to 1 and list the CS Port in `RTD_CS_PINS` (for example `{48}`), then upload it again.
