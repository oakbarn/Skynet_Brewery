# Step by Step: Wire a Contactor

A **contactor** is a heavy-duty relay. On a **240 V heating element** it cuts **both** hot wires, so the element is truly Off when Skynet says Off; the SSR does the fast switching. This guide wires the contactor's **coil** from Port **D23** through one relay channel.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** for the contactor (this guide: **D23**), and the SSR's own Port ([Step by Step: Wire an SSR](211-step-by-step-wire-an-ssr)).
- One **relay module** channel ([Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board)).
- One **two-pole contactor**, 30 or 40 A for a 5500 W element, its **coil** volts matched to its supply (24 V DC is common) (see [Contactor](13-glossary#contactor)).
- A **coil power supply** (24 V DC, or as the coil says).

![Wiring: Wire a Contactor](help_pictures/Step_Wire_Contactor_01_Wiring.svg)

## Step 1. The relay

Wire the relay board to the Mega as in [Step by Step: Wire a Relay Board](215-step-by-step-wire-a-relay-board), with its **IN** on Port **D23**.

## Step 2. Coil power through the relay

Wire the coil supply's **+V** to the relay's **COM**, and the relay's **NO** to the contactor's coil **A1**.

## Step 3. Coil return

Wire the contactor's coil **A2** to the coil supply's **-V**.

## Step 4. The power side

The contactor's **L1 / L2** in and out, the SSR and the element are 240 V mains: **have a Licensed Electrician wire them**, on a GFCI circuit sized for the element.

## Step 5. Add the Device in Skynet

Add it as in [Step by Step: Add a Device](207-step-by-step-add-a-device): pick a **Heating Element** (for example **Heating Element: HYS (Target and Offset)**) on Port **D23**, and set its **Hardware Controller** to **Contactor**. That gives it a longer On delay so the contacts last.

## Step 6. Check it

With the 240 V **off**, turn the Device On: the contactor clunks closed. Off: it drops out.

## Other boards

- **A 3.3 V board:** use a relay board made for 3.3 V (see the Relay Board guide).
- **Arduino Opta:** wire the coil supply through one of its own relays (Relay 1-4).

## The technical side

- A contactor wears each time it closes: use **Direct** or **Hysteresis** on it, never fast PID or Duty Cycle (Rule 6.29).
- An AC coil (120 V) is wired the same way, but then the relay side is mains too: a Licensed Electrician only.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `OUTPUT_PINS`.
