# Step by Step: Wire a Vessel Scale

A **vessel scale** weighs a vessel with **load cells**, read by an **HX711 board** on two Ports: **DT** (data) and **SCK** (clock). Skynet turns the weight into volume. This guide uses **D34** and **D35**.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- Two free **Ports** (this guide: **D34** DT, **D35** SCK).
- One **HX711 board** per scale (see [HX711 and Load Cells](13-glossary#hx711-and-load-cells)).
- Load cells: four half-bridge cells with a combinator board, or one S-type cell sized for the full vessel.

![Wiring: Wire a Vessel Scale](help_pictures/Step_Wire_Scale_01_Wiring.svg)

## Step 1. Power

Wire the Mega's **5V** to the HX711's **VCC**, and **GND** to **GND**.

## Step 2. Data and clock

Wire Mega **D34** to **DT** and **D35** to **SCK**.

## Step 3. The load cells

Wire the cell (or the combinator board) to **E+**, **E-**, **A-**, **A+**: often red E+, black E-, white A-, green A+. Colors vary: check yours.

## Step 4. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick **Weight** > **Vessel scale: load cells on an HX711 board (weight and volume)** with DT **D34** and SCK **D35**.

## Step 5. Check it

Empty, set its zero (tare). Then put a known weight on it and set the factor until it reads right.

## Other boards

- **A 3.3 V board:** power the HX711 from 3.3 V.
- **Arduino Opta:** it can't read an HX711; use a load cell transmitter with a 0-10 V output.

## The technical side

- Keep the load cell wires away from mains and pump wires: they carry tiny signals.
- On the Mega program (`Mega_BrewPanel.ino`), set `USE_HX711` to 1 and list the Ports in `HX711_DT_PINS` and `HX711_SCK_PINS` (for example `{34}` and `{35}`), then upload it again.
