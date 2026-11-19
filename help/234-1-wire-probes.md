# 1-Wire probes: circuits and Indexes

**DS18B20** temperature probes talk on **1-Wire**: several probes share one data pin and its 4.7k ohm pull-up resistor. That pin with its probes is a **1-Wire circuit**. One Interface can have more than one circuit, each on its own pin.

## The 1-Wire Index

Each DS18B20 probe has a **1-Wire Index**: its Interface, its circuit and its number on that circuit.

- **BM1w1_1** = Interface **BM**, 1-Wire circuit **1**, probe **1**.
- **BM1w1_2** = the second probe on that same circuit.
- **BM1w2_1** = the first probe on a second circuit on the same Interface.

The pin is not in the Index: it is a setting of the circuit. The Suggested Name of a probe is its Index, its Label and its Tab, for example **BM1w1_1_HLT_BH** (Rule 3.1). Because it starts with the Interface ID, typing **BM** in the Process editor lists it with the other Devices on that Interface.

A circuit number is never used again after its circuit is deleted. A gap in the numbers does no harm.

## Adding a 1-Wire probe

In the probe's **1-Wire Index** box, pick one:

1. **➕ Create an Index for a new 1-Wire circuit**: a short interview asks for the circuit's **Pin**, what it is **Powered by** and its **Resolution**. The probe gets Index 1 on the new circuit. The first 1-Wire probe on an Interface always starts here.
2. **An existing circuit**: the probe gets the next Index on it. You can pick any free Index on that circuit instead.

When an Interface has one circuit, the next Index on it is already picked.

## How many probes on a circuit

1-Wire has no fixed limit; long wires, a daisy chain and weak power make readings drop out. Skynet uses a **soft limit**: about **6** probes on a circuit **Powered by Board 5V**, about **12** on an **External supply**. Past it you get one warning, and the probe is still added. Put more probes on a second circuit if readings drop out.

## Resolution

- **12-bit** (the default): 0.0625 °C (0.11 °F) steps, about 0.75 s for each reading. Best for Precise heating and a distilling column.
- **11-bit**: 0.125 °C (0.23 °F) steps, faster.
- **10-bit**: 0.25 °C (0.45 °F) steps, fastest.

For more accuracy on any probe use its **Calibration offset** or **Two-point calibration**. For real precision, use a PT100 probe on a MAX31865 board.

## Devices > 🌡 OneWire Probes

- **1-Wire circuits**: every circuit on every Interface: its Pin, Powered by and Resolution (change them here), how many probes it has, **➕ Index** for a probe you will plug in, and **Delete**. **➕ Add 1-Wire circuit** runs the same interview.
- **1-Wire Indexes**: each Index holds its probe's ROM id. To replace a probe, plug in the new one and pick its ROM id in the Index's row: every Device that uses that Index follows it.
- **OneWire probes seen**: every probe the boards report, by its ROM id, and the pin it is on. Give a new probe an Index here.

## The board program

The Mega sketch lists its 1-Wire pins in **ONEWIRE_PINS** (D40 to start; for example `{40, 41}` for two circuits). Each pin needs its own 4.7k ohm resistor to the probes' power. The panel sends each circuit's resolution when the board connects. A Raspberry Pi has one 1-Wire circuit, on GPIO 4.
