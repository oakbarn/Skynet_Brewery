# Step by Step: Wire an ADS1115

An **ADS1115** board reads 4 analog signals far more finely than the Mega can (16-bit). It talks on **I2C**: the Mega's **D20 (SDA)** and **D21 (SCL)**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- The **I2C** Ports (Mega **D20 SDA**, **D21 SCL**) (see [I2C](13-glossary#i2c)).
- One **ADS1115 board** (see [ADS1115](13-glossary#ads1115)).
- The sensors to read (pH board, pressure transducer ...).

![Wiring: Wire an ADS1115](help_pictures/Step_Wire_ADS1115_01_Wiring.svg)

## Step 1. Power

Wire the Mega's **5V** to the board's **VDD**, and **GND** to **GND**.

## Step 2. I2C

Wire Mega **D20** to **SDA** and **D21** to **SCL**.

## Step 3. Address

Wire the board's **ADDR** to **GND**: that sets address 0x48, the one Skynet reads.

## Step 4. The sensors

Wire each sensor's signal to **A0**, **A1**, **A2** or **A3** of the ADS1115 (not of the Mega), and its 5V and GND as in its own guide.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Sensors (pressure, level, pH, flow)** > **Analog input on an ADS1115 board (16-bit)** with its **ADS1115 channel** (0-3); a pressure transducer or pH board can also be set to **Read by** ADS1115.

## Step 6. Check it

Each channel reads its sensor; one with nothing on it wanders.

## Other boards

- **A 3.3 V board:** power it from 3.3 V and keep every signal under 3.3 V. On a Pi it uses GPIO 2 and 3.
- **Arduino Opta:** it has no I2C for this; see [Skynet Boards](206-skynet-boards).

## The technical side

- D20 and D21 are also Counter Ports: a flow meter can't use them while an ADS1115 is on.
- On the Mega program (`Mega_BrewPanel.ino`), set `USE_ADS1115` to 1, then upload it again.
