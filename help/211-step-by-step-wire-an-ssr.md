# Step by Step: Wire an SSR

An **SSR** (Solid State Relay) lets a small signal from the board switch a pump or a heating element on AC power, silently and with no moving parts. This guide wires the low voltage side of an SSR to Port **D23** for a heating element. The AC side is for a Licensed Electrician.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

> **You are responsible for your own safety.** This guide shows a simple, very general way to wire this part. It cannot know your wiring, your parts or your electrical layout. Read each part's own data sheet before you wire it, and have a Licensed Electrician do or check anything on AC (wall) power. Wire with the power off and the board unplugged.

The example board is the **Arduino Mega 2560**, the standard Skynet board. Other boards are wired the same way: only the Port names change (see [Skynet Boards](206-skynet-boards)).

## You need

- One free **Port** (Mega: D22-D43 or D47-D53 are best for an SSR; see Step 6). This guide uses **D23**.
- One **SSR**, DC in and AC out (**DA** type), zero cross, a known brand; 25 or 40 A for an element, 5 or 10 A for a pump (see [SSR](13-glossary#ssr)).
- One **Heat Sink** for the SSR (an element's SSR without one overheats).
- Wire for the low voltage side (red and yellow in the picture).

![Wiring an SSR](help_pictures/Step_Wire_SSR_01_Wiring.svg)

## Step 1. Mount the SSR

Mount the SSR on its Heat Sink, with heat sink paste or pad, as its maker shows.

## Step 2. 5V to the SSR's + input

Wire the Mega's **5V** to the SSR's **3 (+)** input.

## Step 3. The Port to the SSR's - input

Wire Port **D23** to the SSR's **4 (-)** input.

The Skynet program on the Mega turns a Port **On by pulling it LOW** (like a relay board), so this way the SSR is On when the Device is On, and Off while the board starts up.

## Step 4. The AC side

The SSR's **1** and **2** switch only the **Hot** wire to the pump or element; Ground and Neutral go straight to the load. This is mains power: **have a Licensed Electrician wire it**, on a GFCI circuit sized for the load. A 240 V element also needs a Contactor that cuts both hot wires.

## Step 5. Add the Device in Skynet

Add a **Heating Element** (Select Device Type: **Heating Element**, for example **Heating Element: HYS (Target and Offset)**) or a **Pump** on Port **D23**, as in [Step by Step: Add a Device](207-step-by-step-add-a-device).

## Step 6. Why not a True PWM Port

On a **True PWM Port** (Mega D2-D13, D44-D46) Skynet sends PID and Deadband as fast PWM, which is for a DAC ([Step by Step: Wire a DAC](209-step-by-step-wire-a-dac)). A zero-cross SSR can't follow it. On a plain Port, PID and Duty Cycle switch the SSR slowly (a few times a minute), which it follows well.

## Step 7. Check it

With the AC power **off**, turn the Device On in Skynet: the SSR's little light comes on. Turn it Off: the light goes off. If it works backwards, the input wires are swapped or **Invert** is set in the Port's attributes ⬢: undo it.

## Other boards

- **A 3.3 V board:** wire **3.3V** to the SSR's 3 (+). Most SSRs switch on from 3 to 32 V; check yours says 3 V.
- **Arduino Opta:** its outputs are relays. See [Skynet Boards](206-skynet-boards) for SSRs on an Opta.

## The technical side

- An SSR's input needs about 10 mA; a Mega Port gives up to 20 mA. An Uno R4 Port gives only 8 mA: use an SSR with its own driver.
- An SSR leaks a tiny current when Off: a meter can show volts at the load. Always unplug before touching.
- On the Mega program (`Mega_BrewPanel.ino`), the Port must be in `OUTPUT_PINS` (D22-D25 are there to start). `RELAY_ACTIVE_LOW` is `true`: On = LOW.
