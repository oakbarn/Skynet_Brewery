# Daisy Chained Hardware for every Device

Date: 2026-11-17. Made from OakBarn Brewery's **Pump (On/Off)** sheet: every entry below follows it (title, parts with counts, ⚠️ on
the parts that carry mains power or gas, then the chain from the board's pin out to the real device).

> [!CAUTION]
> ⚠️ **The General Electricity can Kill Caveat**
>
> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed
> Electrician.**

> [!CAUTION]
> ⚠️ **Gas** (the gas burner entries)
>
> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed
> Electrician, Plumber or HVAC professional.**

## How to read an entry

- **⚠️** = this part carries mains power (120 V or 240 V AC) or gas. A Licensed Electrician (or gas professional) checks it.
  Parts with no ⚠️ are low voltage (5 V, 12 V or 24 V DC).
- **Arduino** = the [Interface](#interface) the Device is on: an Arduino Mega, an ESP32, or the Raspberry Pi's own pins (GPIO). The chain is the
  same on all of them. The ESP32 and the Pi send **3.3 V**, not 5 V: pick an [SSR](#ssr-solid-state-relay-opto-ssr) or relay module that turns on at 3.3 V (most
  "3-32 V DC input" SSRs do).
- **[DO Port](#do-di-and-ai-ports)** = a Digital Out pin (on / off). **[PWM](#pwm-true-pwm-port) Port** = a pin marked PWM (Mega D2-D13, D44-D46). **AI Port** = an analog pin
  (Mega A0-A15). **DI Port** = a Digital In pin. **Counter Port** = Mega D2, D3, D18-D21. These are the Port rules in the
  [Device Library](Device_Library.md).
- **Device Type** is the Skynet type the Device is made as (for example `DO@Pump`); **Type ID** is its ID in the [Device Library](Device_Library.md).
- One Port, one Device (Rule 6.1): count one free Port for every Device.
- **Linked words** (for example [I2C](#i2c), [SSR](#ssr-solid-state-relay-opto-ssr), [GFCI](#gfci-ground-fault-circuit-interrupter)) open their plain-English meaning in the [Parts Glossary](#11-parts-glossary) at the end.

## Contents

1. [Pumps](#1-pumps)
2. [Heaters](#2-heaters)
3. [Valves](#3-valves)
4. [Chillers and cooling](#4-chillers-and-cooling)
5. [Vessels and level](#5-vessels-and-level)
6. [Temperature Probes](#6-temperature-probes)
7. [Flow](#7-flow)
8. [Safety and buttons](#8-safety-and-buttons)
9. [Other Devices](#9-other-devices)
10. [Shared by the whole panel](#10-shared-by-the-whole-panel)
11. [Parts Glossary](#11-parts-glossary)

---

## 1. Pumps

### 1.1 Pump (On/Off)
Device Type `DO@Pump`. An AC brewing pump (Blichmann RipTide, Chugger, March).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (can Provide Power to more than a single Pump)
- One (1) AC [Opto SSR](#ssr-solid-state-relay-opto-ssr) ⚠️ (5 or 10 AMPS is sufficient)
- One (1) Waterproof In Use Wall Outlet ⚠️
- One (1) AC On/Off Brewing Pump

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶    SSR    ───▶   Pump
                    │              │
                    ▼              │ Plug
            WaterProof Outlet ◀────┘ ⚠️
```

### Pump Switching: Relay or SSR (both are Options)

The [SSR](#ssr-solid-state-relay-opto-ssr) in 1.1 can be swapped for a **Relay** (One (1) [Relay Module](#relay-module) channel ⚠️, contacts rated 10 AMPS at 250 V AC). The chain is
the same: Arduino ───▶ Relay ───▶ Waterproof Outlet ───▶ Pump plug.

**Why a Relay works just as well for a pump:** a pump is switched On or Off only a few times a brew day and draws only a few AMPS, so a
Relay's contacts last for years. When a Relay is Off it is truly Off (no small leak of power), and it makes no heat, so it needs no
[Heat Sink](#heat-sink). It clicks when it switches. It is often the cheaper choice (an 8 channel board also runs the valves).

**Why the trigger voltage may favor an SSR:** a Relay needs enough voltage and current from the pin to pull its switch in. Most
relay boards are made for **5 V** boards like the Arduino Mega. An ESP32 or the Raspberry Pi's own pins send only **3.3 V** and
may not switch a 5 V relay board every time, or may not let it go. An Opto SSR switches on anything from about **3 to 32 V DC**
with very little current, so it works from every [Interface](#interface). It is silent and has no contacts to wear out.

| | Relay | Opto SSR |
|---|---|---|
| Switches on from | 5 V boards (some 3.3 V boards with a "3.3 V" or "High/Low trigger" relay board) | About 3 to 32 V DC: every Interface |
| Off is | Truly Off | A tiny leak (a meter can show voltage at the outlet: still unplug before touching) |
| Heat | None | A little; a Heat Sink above about 5 AMPS (a pump does not need one) |
| Noise and wear | Clicks; contacts wear slowly | Silent; no wear |
| Watch for | Many boards are **On when the pin is LOW**: the Skynet board program already drives On = LOW, so leave **Invert** Off (set it only for a board that switches On with HIGH) | Fake brand SSRs: buy a known brand |

Either way the Pump Device in Skynet is the same (`DO@Pump`); only the part in the box changes.

### 1.2 DC Pump (On/Off)
Device Type `DO@Pump`, Power dc12 or dc24 (a 12 V or 24 V pump, see [DC Brewing Pumps](DC_Brewing_Pumps.md)).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- One (1) [DC Power Supply](#dc-power-supply), 12 V or 24 V (the pump's voltage, at least 1 A more than the pump draws; can power more than a single Pump)
- One (1) DC [Opto SSR](#ssr-solid-state-relay-opto-ssr) (DC in, DC out) or One (1) [Relay Module](#relay-module) channel (5 or 10 AMPS is sufficient)
- One (1) DC On/Off Brewing Pump

```
               12 V / 24 V DC PWR
                    │
                    ▼
  Arduino  ───▶  DC SSR   ───▶   DC Pump
                 or Relay
```

### 1.3 DC Pump (Speed, PWM)
Device Type `PWM@Pump`, Speed control = [PWM](#pwm-true-pwm-port). Only a brushless DC pump made for speed control (for example a Topsflo TD5 model
with a speed wire). An AC pump is On/Off only (Rule 18.32).

- One (1) Free Arduino PWM Port
- One (1) [DC Power Supply](#dc-power-supply), 12 V or 24 V
- One (1) [MOSFET Module](#mosfet-module) (logic level, 10 AMPS is sufficient), unless the pump has its own speed (PWM) wire, which then goes straight to the PWM Port with a shared Ground
- One (1) DC Speed Control Brewing Pump

```
               12 V / 24 V DC PWR
                    │
                    ▼
  Arduino  ───▶  MOSFET   ───▶   DC Pump
  (PWM Port)     Module          (Speed %)
```

### 1.4 Cool / Warm Pump
Type ID `CPMP` (Rule 6.21): a pump a temperature switches (a glycol pump, a warm water pump).

- The parts of 1.1 (AC pump) or 1.2 (DC pump)
- One (1) Temperature Probe (section 6) where the temperature is read

```
  Temperature Probe ───▶ Arduino ───▶ (the 1.1 or 1.2 chain) ───▶ Pump
```

---

## 2. Heaters

### 2.1 Heating Element, 120 V (SSR)
Device Type `DO@H_Element`, Hardware Controller = Optical [SSR](#ssr-solid-state-relay-opto-ssr) (Rule 6.29). Any method (Direct, PID, Hysteresis, Duty Cycle, Deadband).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (its own 20 AMP circuit for a 1650 W element; one element per circuit)
- One (1) AC Opto SSR ⚠️ (25 or 40 AMPS, zero cross, a brand-name one)
- One (1) SSR [Heat Sink](#heat-sink) ⚠️ (sized for the SSR; an SSR without one overheats)
- One (1) Element Cord and Plug, or Element Enclosure ⚠️ (closes the element's back terminals)
- One (1) 120 V Heating Element ⚠️

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶    SSR ⚠️  ───▶   Heating Element ⚠️
               (on Heat Sink)
```

### 2.2 Heating Element, 240 V (SSR + Contactor)
Device Type `DO@H_Element`. The [SSR](#ssr-solid-state-relay-opto-ssr) switches the heat; the [Contactor](#contactor) cuts both hot wires so the element is truly OFF.

- Two (2) Free Arduino DO Ports (one for the SSR, one for the Contactor's relay)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (240 V, 30 AMP for a 5500 W element; one element per circuit)
- One (1) AC Opto SSR ⚠️ (40 AMPS, zero cross, a brand-name one)
- One (1) SSR [Heat Sink](#heat-sink) ⚠️
- One (1) Two-Pole Contactor ⚠️ (30 or 40 AMPS)
- One (1) [Relay Module](#relay-module) channel (switches the Contactor's coil)
- One (1) Element Enclosure, Cord and Plug ⚠️
- One (1) 240 V Heating Element ⚠️

```
               AC GFCI PWR 240 V ⚠️
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Contactor ⚠️ (both hot wires)
                                     │
                                     ▼
  Arduino  ───▶   SSR ⚠️  ───▶   Heating Element ⚠️
              (on Heat Sink)
```

### 2.3 Heating Element (Contactor only)
Device Type `DO@H_Element`, Hardware Controller = [Contactor](#contactor) (Rule 6.29: offset -1 to -5 °F, On delay at least 10 seconds).
For Direct or Hysteresis only; PID and Duty Cycle switch too often for a Contactor.

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (sized for the element)
- One (1) [Relay Module](#relay-module) channel (switches the Contactor's coil)
- One (1) Contactor ⚠️ (two-pole for 240 V; 30 or 40 AMPS)
- One (1) Heating Element ⚠️

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Contactor ⚠️  ───▶   Heating Element ⚠️
```

### 2.4 Heating Element (0-10 V Power Controller)
Device Type `AO@H_Element`: the element's power is set from 0 to 100 %.

- One (1) Free Arduino [PWM](#pwm-true-pwm-port) Port
- One (1) PWM to [0-10 V](#0-10-v-signal) Module
- One (1) 12 or 24 V [DC Power Supply](#dc-power-supply) (for the module)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️
- One (1) SCR or Voltage Regulator (SSVR) Power Controller ⚠️ (0-10 V input, sized for the element) on its [Heat Sink](#heat-sink) ⚠️
- One (1) Heating Element ⚠️

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶  PWM to 0-10 V  ───▶  SCR / SSVR ⚠️  ───▶  Heating Element ⚠️
  (PWM Port)       Module
```

### 2.4a Heater on a PWM Port
Device Type `PWM@H_Element` (OakBarn Brewery, 2026-11-17: "Those would be the True [PWM](#pwm-true-pwm-port) Ports and a [DAC](#dac-digital-to-analog-converter) and 0-10v Controller").
The element's power is set from 0 to 100 %. The same power controller as 2.4; only the Port and the converter differ.

- One (1) Free Arduino **True PWM Port** (Mega D2-D13, D44-D46)
- One (1) DAC or PWM to [0-10 V](#0-10-v-signal) Module: an Arduino Mega has **no real DAC**, so on a Mega a PWM to 0-10 V Module takes its place. An
  ESP32 has a real DAC (GPIO 25 and 26), but it gives only 0-3.3 V, so it still needs a module that raises it to 0-10 V.
- One (1) 12 or 24 V [DC Power Supply](#dc-power-supply) (for the module)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (sized for the element)
- One (1) 0-10 V Controlled Power Regulator ⚠️ (SCR, phase-angle type), its AMPS matched to the element (40 AMPS or more for a 5500 W
  element on 240 V)
- One (1) [Heat Sink](#heat-sink) ⚠️ for the regulator (it makes heat like an [SSR](#ssr-solid-state-relay-opto-ssr))
- One (1) Heating Element ⚠️

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶  DAC or PWM to 0-10 V  ───▶  0-10 V Power Regulator ⚠️  ───▶  Heating Element ⚠️
  (True PWM Port)      Module                   (on Heat Sink)
```

Do not drive a plain zero-cross SSR straight from a fast PWM Port: it can't follow the fast pulses, so the heat is not what the %
says. For an SSR, use a time-proportioned method (PID, Duty Cycle) on 2.1 or 2.2 instead.

### 2.5 Heat Pad or Heat Wrap (Fermenter)
Type ID `HtPad`. The same chain as the Pump (On/Off).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ (can Provide Power to more than a single Heat Pad)
- One (1) AC [Opto SSR](#ssr-solid-state-relay-opto-ssr) ⚠️ (5 or 10 AMPS is sufficient)
- One (1) Waterproof In Use Wall Outlet ⚠️
- One (1) Heat Pad or Heat Wrap

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶    SSR    ───▶   Heat Pad
                    │              │
                    ▼              │ Plug
            WaterProof Outlet ◀────┘ ⚠️
```

### 2.6 Gas Burner (24 V Gas Solenoid)
Device Type `DO@Valve_Sgas`, or a Heating Element with Gas burner On (Rule 6.33, Flame Out). Gas warning above. More detail and
the flame safety ways: [High-pressure gas burner build](High_Pressure_Gas_Build.md) (For Information Only).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- One (1) [Relay Module](#relay-module) channel
- One (1) 24 V [DC Power Supply](#dc-power-supply) (or a true 24 VAC transformer for a 24 VAC valve)
- One (1) [Gas Solenoid Valve](#gas-solenoid-valve) ⚠️ ([normally closed](#no-and-nc-normally-open-normally-closed), listed for LP gas, rated above the regulator's pressure)
- One (1) Flame Safety ⚠️ (a UL or CSA listed thermocouple gas valve is recommended; see Help 197)
- One (1) Regulator, Hose and Burner ⚠️
- One (1) Temperature Probe (section 6) in the pot, for the Flame Out software backup

```
               24 V DC PWR
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Gas Solenoid ⚠️
                                     │
  Tank ⚠️ ─▶ Regulator ⚠️ ─▶ Flame Safety ⚠️ ─▶ Gas Solenoid ⚠️ ─▶ Burner ⚠️
```

### 2.7 Igniter
Type ID `Ignit`. Turned off by a Flame Out trip.

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- One (1) [Relay Module](#relay-module) channel
- One (1) Power Supply for the igniter (12 V DC, or [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ for a 120 V igniter)
- One (1) Spark or Hot Surface [Igniter](#igniter) ⚠️

```
               Igniter PWR ⚠️
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Igniter ⚠️
```

### 2.8 RIMS Tube
A Skynet Integrated Device: one Heating Element plus one Temperature Probe.

- The parts of 2.1 or 2.2 (its element)
- The parts of one Temperature Probe (section 6) in its thermowell
- One (1) Flow Switch (7.2) is a good idea: no heat without flow

```
  Arduino ───▶ (the 2.1 or 2.2 chain) ───▶ RIMS Element ⚠️
  Arduino ◀─── RIMS Temperature Probe
```

---

## 3. Valves

### 3.1 Manual Valve
Type ID `M_L_Vlv` (or High Temperature). Turned by hand; no wiring and no Port.

- One (1) Manual Ball or Butterfly Valve

```
  (no chain: a Process shows a pop-up and waits for Done)
```

### 3.2 Motorized Ball Valve (one control wire)
Device Type `DO@Valve_E` (high temperature `DO@Valve_E_H`). Power on the control wire = open; power off = closed.

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- One (1) [Relay Module](#relay-module) channel
- One (1) 12 V or 24 V [DC Power Supply](#dc-power-supply) (the valve's voltage; can power more than a single Valve)
- One (1) [Motorized Ball Valve](#motorized-ball-valve), 3 wire, one control wire (the wiring is printed on its label)

```
               12 V / 24 V DC PWR ───────────────▶ Valve (always-on wire)
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Valve (control wire)
```

### 3.3 Motorized Ball Valve (Open wire and Close wire)
Device Type `DO@Valve_E` with **Dual Throw** (Rule 6.22): the two relays are never on together.

- Two (2) Free Arduino DO Ports (its own Port and the Dual Throw Port)
- Two (2) [Relay Module](#relay-module) channels
- One (1) 12 V or 24 V [DC Power Supply](#dc-power-supply)
- One (1) [Motorized Ball Valve](#motorized-ball-valve) with an Open wire and a Close wire

```
               12 V / 24 V DC PWR
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
  Arduino ─▶ Relay 1     Arduino ─▶ Relay 2
          │                   │
          ▼                   ▼
     Valve OPEN wire     Valve CLOSE wire
```

### 3.4 Motorized Butterfly Valve
Device Type `DO@Valve_E`. The same parts and chain as 3.2 or 3.3, by how its actuator is wired. If its actuator is 120 V AC,
use the AC chain of 1.1 ([GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ and AC [Opto SSR](#ssr-solid-state-relay-opto-ssr) ⚠️) instead of the [DC Power Supply](#dc-power-supply) and Relay.

### 3.5 Water Solenoid Valve
Device Type `DO@Valve_E`, often a Tap water valve. Most solenoid valves need water pressure to open (not for gravity flow).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- One (1) [Relay Module](#relay-module) channel
- One (1) 12 V or 24 V [DC Power Supply](#dc-power-supply)
- One (1) Normally Closed [Solenoid Valve](#solenoid-valve) (food grade for wort, brass is fine for cooling water)
- One (1) [Diode](#diode-flyback-diode) (1N4007) across the coil, if the valve has none

```
               12 V / 24 V DC PWR
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Solenoid Valve
```

### 3.6 Proportional Valve (KLD20T)
Type ID `P_L_Vlv` (Skynet KLD20T): 0-5 V opens it 0-100 %.

- One (1) Free Arduino [PWM](#pwm-true-pwm-port) Port
- One (1) PWM to [0-10 V](#0-10-v-signal) Module, set to 0-5 V
- One (1) 24 V [DC Power Supply](#dc-power-supply)
- One (1) KLD20T Proportional Valve

```
               24 V DC PWR ─────────────────────▶ Valve power
                    │
                    ▼
  Arduino  ───▶  PWM to 0-5 V  ───▶   Valve (signal wire)
  (PWM Port)       Module
```

### 3.7 Valve Tee and Supply Manifolds
Each **Motorized** valve on it is one 3.2 or 3.3 chain (its own Port). Each **Manual** valve is a 3.1 (no wiring).

---

## 4. Chillers and cooling

### 4.1 Plate, Counterflow or Immersion Chiller
No wiring: in Skynet a chiller is a pipe. To switch its cooling water, add one Water [Solenoid Valve](#solenoid-valve) (3.5) or [Motorized Ball Valve](#motorized-ball-valve)
(3.2). To read the wort out, add one Temperature Probe (section 6).

```
  Arduino ───▶ (the 3.5 chain) ───▶ Cooling Water ───▶ Chiller ───▶ Probe ───▶ Arduino
```

### 4.2 Glycol Chiller, Fridge or Freezer
Type ID `Chill`. A compressor, so a Mechanical Relay is better than an [SSR](#ssr-solid-state-relay-opto-ssr), with an On delay so it is not restarted too soon.

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️
- One (1) [Relay Module](#relay-module) channel
- One (1) [Mechanical Power Relay](#mechanical-power-relay) ⚠️ (rated for a motor: 30 AMPS, or a relay with a 1 HP rating)
- One (1) Waterproof In Use Wall Outlet ⚠️
- One (1) Glycol Chiller, Fridge or Freezer
- One (1) Temperature Probe (section 6) in the glycol or the fermenter

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Power Relay ⚠️  ───▶   Chiller
                                     │                   │
                                     ▼                   │ Plug
                             WaterProof Outlet ◀─────────┘ ⚠️
```

### 4.3 Glycol Pump
A Cool / Warm Pump (1.4).

### 4.4 Fan
Type ID `Fan` (on a [PWM](#pwm-true-pwm-port) Port for speed, with a 4-wire PWM fan).

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports) (PWM Port for speed)
- One (1) 12 V [DC Power Supply](#dc-power-supply)
- One (1) [Relay Module](#relay-module) channel or [MOSFET Module](#mosfet-module)
- One (1) 12 V Fan

```
               12 V DC PWR
                    │
                    ▼
  Arduino  ───▶  Relay or MOSFET  ───▶   Fan
```

---

## 5. Vessels and level

### 5.1 Vessel
A Vessel with no parts needs no wiring. Each part built into its IPs is its own chain:

| Part on the Vessel | Use |
|---|---|
| Heating Element | 2.1, 2.2, 2.3 or 2.4 |
| Temperature Probe or [Thermowell](#thermowell) | Section 6 |
| Motorized Valve | 3.2 or 3.3 |
| Gas Burner under it | 2.6 (and 2.7) |
| HERMS Coil | No wiring (the HLT's element and probe, and a pump) |

### 5.2 Basic Electric Kettle
A Skynet Integrated Device: one Heating Element (2.1 or 2.2) plus one Temperature Probe (section 6) in its thermowell.

### 5.3 Float Switch (High or Low Level)
Type ID `Float`. Low voltage only; the board's pull-up is on.

- One (1) Free Arduino [DI Port](#do-di-and-ai-ports)
- One (1) Stainless [Float Switch](#float-switch)

```
  Arduino DI Port  ───▶  Float Switch  ───▶  Arduino GND
```

### 5.4 Level Transmitter (4-20 mA)
Type ID `Level`.

- One (1) Free Arduino [AI Port](#do-di-and-ai-ports)
- One (1) 24 V [DC Power Supply](#dc-power-supply)
- One (1) 250 ohm Resistor (AI Port to [GND](#gnd-ground): 20 mA = 5 V)
- One (1) [4-20 mA](#4-20-ma-signal) [Level Transmitter](#level-transmitter-4-20-ma) (rated for the liquid's temperature)

```
  24 V DC PWR (+) ───▶ Transmitter (+)
  Transmitter (-) ───▶ Arduino AI Port ───▶ 250 ohm ───▶ GND
  24 V DC PWR (-) ───▶ Arduino GND
```

### 5.5 Pressure Transducer (Level by pressure)
Type ID `Pres`.

- One (1) Free Arduino [AI Port](#do-di-and-ai-ports)
- One (1) 0.5-4.5 V [Pressure Transducer](#pressure-transducer-05-45-v), stainless, 1/4" NPT (rated for the liquid's temperature)

```
  Arduino 5 V ───▶ Transducer (red)
  Arduino GND ───▶ Transducer (black)
  Transducer (signal) ───▶ Arduino AI Port
```

### 5.6 Vessel Scale (Load Cells)
Type ID `Scale`.

- Two (2) Free Arduino Ports (DT and SCK)
- One (1) [HX711 Board](#hx711-board-and-load-cells)
- One (1) set of Load Cells: Four (4) half-bridge cells with a Combinator Board, or One (1) S-type cell sized for the full Vessel

```
  Load Cells ───▶ HX711 Board (E+, E-, A+, A-) ───▶ Arduino (DT, SCK, 5 V, GND)
```

---

## 6. Temperature Probes

Low voltage only. A Temperature Probe in a vessel or pipe sits in a **[Thermowell](#thermowell)** or a **Tee** (TC 1.5).

### 6.1 DS18B20 (OneWire)
Device Type `TEMP@1W`. Many probes share one wire.

- The [OneWire](#onewire) Port (Mega D40; Pi GPIO 4), shared by every DS18B20
- One (1) 4.7k ohm Resistor (one for the whole set, data wire to 5 V)
- One (1) Waterproof [DS18B20 Probe](#ds18b20-probe), stainless tip

```
  Arduino 5 V ───┬───▶ Probe (red)
              4.7k ohm
                 │
  Arduino D40 ◀──┴──── Probe (yellow, data)
  Arduino GND ───────▶ Probe (black)
```

### 6.2 PT100 or PT1000 RTD
Type ID `RTD`. The most accurate.

- One (1) Free Arduino [CS Port](#cs-port-chip-select) (Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53, Rule 6.9)
- The [SPI](#spi) Ports (Mega D50, D51, D52), shared by every [RTD](#rtd-pt100-or-pt1000-and-max31865-board) and [Thermocouple](#thermocouple-and-max31855--max31856-board) board
- One (1) MAX31865 Board (its jumpers set for 2, 3 or 4 wires)
- One (1) PT100 or PT1000 Probe (3 wire is the start)

```
  Probe ───▶ MAX31865 Board ───▶ Arduino (CS Port, D50, D51, D52, 5 V, GND)
```

### 6.3 Thermocouple (Type K and others)
Type ID `TC`. For very hot places (burners, flue).

- One (1) Free Arduino [CS Port](#cs-port-chip-select)
- The [SPI](#spi) Ports (Mega D50, D51, D52), shared
- One (1) MAX31856 Board (any type) or MAX31855 Board (Type K only)
- One (1) [Thermocouple](#thermocouple-and-max31855--max31856-board) Probe (and Thermocouple wire if it needs to be longer; + and - the right way round)

```
  Thermocouple ───▶ MAX31856 / MAX31855 Board ───▶ Arduino (CS Port, D50, D51, D52, 5 V, GND)
```

### 6.4 NTC Thermistor (10K and others)
Type ID `10KNTC` (5K, 50K, 100K the same way). The cheapest.

- One (1) Free Arduino [AI Port](#do-di-and-ai-ports)
- One (1) Resistor the size of the thermistor (10k ohm for a 10K), AI Port to 5 V
- One (1) [NTC Thermistor](#ntc-thermistor) Probe

```
  Arduino 5 V ───▶ 10k ohm ───┬───▶ Arduino AI Port
                              │
                        NTC Thermistor
                              │
                              ▼
                         Arduino GND
```

### 6.5 LM35 or TMP36
Type ID `LM35` or `TMP36`. For air temperature (in a panel or a room).

- One (1) Free Arduino [AI Port](#do-di-and-ai-ports)
- One (1) LM35 or TMP36

```
  Arduino 5 V ───▶ Sensor ───▶ Arduino AI Port
                      │
                      ▼
                 Arduino GND
```

### 6.6 Thermowell or Tee with a Temperature Probe
The parts of the Probe it holds (6.1 to 6.4), plus One (1) TC 1.5 [Thermowell](#thermowell) (Short, Medium or Long) or One (1) Instrument / Long
Tee, and One (1) TC 1.5 Clamp and Gasket.

---

## 7. Flow

### 7.1 Flow Meter
Type ID `FlowM`.

- One (1) Free Arduino Counter Port (Mega D2, D3, D18-D21; up to 6 per Mega)
- One (1) Hall [Flow Meter](#flow-meter) (stainless, food grade for hot wort; plastic YF-S201 for cold water only)

```
  Arduino 5 V ───▶ Flow Meter (red)
  Arduino GND ───▶ Flow Meter (black)
  Flow Meter (yellow, pulse) ───▶ Arduino Counter Port
```

### 7.2 Flow Switch
Type ID `FlowSw`. Wired like the [Float Switch](#float-switch) (5.3).

- One (1) Free Arduino [DI Port](#do-di-and-ai-ports)
- One (1) Flow Switch (food grade)

```
  Arduino DI Port  ───▶  Flow Switch  ───▶  Arduino GND
```

---

## 8. Safety and buttons

### 8.1 Emergency Stop (E-Stop)
Type ID `EStop`. **The [E-Stop](#e-stop-emergency-stop) must cut the power by its own wiring**, not only tell Skynet: a mushroom button with a
[normally closed](#no-and-nc-normally-open-normally-closed) contact that drops the Main [Contactor](#contactor)'s coil, and a second contact to a [DI Port](#do-di-and-ai-ports) so Skynet knows.

- One (1) Free Arduino DI Port
- One (1) E-Stop Mushroom Button ⚠️ (two contacts)
- One (1) Main Contactor ⚠️ (feeds every heater and pump circuit)

```
  AC GFCI PWR ⚠️ ───▶ Main Contactor ⚠️ ───▶ Heater and Pump circuits ⚠️
                          ▲
  E-Stop contact 1 ⚠️ ────┘ (coil: pressed = OFF)
  E-Stop contact 2 ───▶ Arduino DI Port
```

### 8.2 Leak Sensor, Lid / Door Interlock, Push Button, Toggle
Type IDs `Leak`, `Intlk`, `PB`, `Toggle`, `DIN`. Wired like the [Float Switch](#float-switch) (5.3).

- One (1) Free Arduino [DI Port](#do-di-and-ai-ports)
- One (1) Sensor, Switch or Button

```
  Arduino DI Port  ───▶  Switch  ───▶  Arduino GND
```

---

## 9. Other Devices

### 9.1 Light, LED or Alarm Buzzer
Type IDs `Light`, `LED`, `E_Alm`.

- One (1) Free Arduino [DO Port](#do-di-and-ai-ports)
- A small LED: One (1) 220 ohm Resistor. A panel light or buzzer: One (1) [Relay Module](#relay-module) channel and its Power Supply
  ([GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit ⚠️ for a 120 V light)

```
  Arduino ───▶ 220 ohm ───▶ LED ───▶ GND
  Arduino ───▶ Relay ───▶ Light or Buzzer
```

### 9.2 pH Probe
Type ID `PH_Met`.

- One (1) Free Arduino [AI Port](#do-di-and-ai-ports) (or an ADS1115 channel for finer readings)
- One (1) pH Amplifier Board (0-5 V out)
- One (1) pH Probe

```
  pH Probe ───▶ pH Board ───▶ Arduino AI Port (5 V, GND)
```

### 9.3 Stepper Motor
Type ID `Step`.

- Two (2) or Three (3) Free Arduino Ports (STEP, DIR, ENABLE), plus One (1) for a Home Switch
- One (1) [Stepper Driver](#stepper-driver) (TMC2209, A4988, DRV8825, TB6600 ...)
- One (1) 12-24 V [DC Power Supply](#dc-power-supply) (never the Arduino's 5 V)
- One (1) Stepper Motor

```
               12-24 V DC PWR
                    │
                    ▼
  Arduino  ───▶  Stepper Driver  ───▶   Stepper Motor
  (STEP, DIR)
```

### 9.4 Hydrometer (Tilt, iSpindel ...)
No wiring. A Tilt talks Bluetooth to the Pi (or an ESP32); an iSpindel sends its readings over Wi-Fi.

---

## 10. Shared by the whole panel

Bought once, not per Device:

- One (1) Raspberry Pi (the Brain) and One (1) Arduino Mega (or ESP32) for every 50 or so Ports
- One (1) 12 V or 24 V [DC Power Supply](#dc-power-supply) for the Relays, Valves and DC Pumps
- One (1) [Relay Module](#relay-module) (8 channels, opto-isolated) for the Valves and [Contactor](#contactor) coils
- One (1) Main Contactor ⚠️ and [E-Stop](#e-stop-emergency-stop) ⚠️ (8.1)
- [GFCI](#gfci-ground-fault-circuit-interrupter) AC Circuit(s) ⚠️ (a GFCI breaker or GFCI spa panel)
- Fuses or Breakers ⚠️ for each AC circuit, and an Enclosure, DIN Rail, Terminal Blocks and Cable Glands
- Grounds: a [MOSFET Module](#mosfet-module), a [PWM](#pwm-true-pwm-port) to [0-10 V](#0-10-v-signal) Module or a [4-20 mA](#4-20-ma-signal) sensor needs its DC Power Supply's (-) tied to the Arduino's [GND](#gnd-ground) (opto-isolated Relays and SSRs do not)

Prices: see the [Hardware shopping list](Skynet_Brewery_Shopping_List.md).

---

## 11. Parts Glossary

Each part with its Term, what it does in plain words, what Skynet needs, and suggested parts. The suggested parts are examples to compare, not endorsements. **Where to buy** links will come later through a skynetbrewery.com parts page; until then each one shows what to search for. Each word also links to its entry in the Skynet Help Glossary (Help 13, **Wiring and hardware words**), which says the same in the Panel and in French.

### Technical words

#### I2C
- **In plain words:** A two-wire way for small boards to talk to the Arduino or Pi (one data wire SDA, one clock wire SCL). Many boards can share the same two wires, each with its own address.
- **What Skynet needs:** Mega SDA = D20, SCL = D21; Pi GPIO 2 and 3. Used by the ADS1115 board (address 0x48).
- **In the Skynet Help:** [Glossary: I2C](../help/13-glossary.md#i2c)

#### SPI
- **In plain words:** A four-wire way for boards to talk to the Arduino, faster than I2C. The boards share three wires; each gets its own fourth wire, the CS Port.
- **What Skynet needs:** Mega D50, D51, D52 (shared by every RTD and Thermocouple board); Pi GPIO 7-11.
- **In the Skynet Help:** [Glossary: SPI](../help/13-glossary.md#spi)

#### CS Port (Chip Select)
- **In plain words:** The one wire that tells an SPI board "you are the one being talked to now". Each SPI board needs its own.
- **What Skynet needs:** Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53 for an RTD (Rule 6.9).
- **In the Skynet Help:** [Glossary: CS Port](../help/13-glossary.md#cs-port)

#### PWM (True PWM Port)
- **In plain words:** Pulse Width Modulation: a pin turned On and Off very fast. The share of time it is On (0 to 100 %) sets a speed or power. A True PWM Port is a pin the board can pulse by itself.
- **What Skynet needs:** Mega D2-D13, D44-D46. Needed for pump speed, fan speed, and the DAC / PWM to 0-10 V Module.
- **In the Skynet Help:** [Glossary: PWM](../help/13-glossary.md#pwm-port)

#### 0-10 V Signal
- **In plain words:** A control wire whose voltage, from 0 V (off or 0 %) to 10 V (full or 100 %), sets how much. Used by power regulators, proportional valves and speed controls.
- **What Skynet needs:** Made from a True PWM Port by a DAC / PWM to 0-10 V Module.
- **In the Skynet Help:** [Glossary: 0-10 V Signal](../help/13-glossary.md#0-10-v-signal)

#### 4-20 mA Signal
- **In plain words:** A sensor sends a current: 4 mA = lowest, 20 mA = highest. A broken wire reads 0 mA, so it is easy to spot. Good over long wires.
- **What Skynet needs:** A 250 ohm resistor turns it into 1-5 V for an Analog Port.
- **In the Skynet Help:** [Glossary: 4-20 mA Signal](../help/13-glossary.md#4-20-ma)

#### OneWire
- **In plain words:** A one-wire way (plus power and ground) for many DS18B20 probes to share a single Port. Each probe has its own number.
- **What Skynet needs:** Mega D40, Pi GPIO 4; one 4.7k ohm Pull-up Resistor for the set.
- **In the Skynet Help:** [Glossary: OneWire](../help/13-glossary.md#onewire)

#### Pull-up Resistor
- **In plain words:** A resistor from a signal wire to 5 V (or 3.3 V) that holds the wire HIGH until a switch or sensor pulls it LOW.
- **What Skynet needs:** The board's own pull-up is On for switches and flow meters; OneWire needs an outside 4.7k ohm one.
- **In the Skynet Help:** [Glossary: Pull-up Resistor](../help/13-glossary.md#pull-up-resistor)

#### GND (Ground)
- **In plain words:** The common return wire (0 V) every low-voltage part shares, so their signals mean the same thing.
- **What Skynet needs:** Tie the (-) of a DC Power Supply to the Arduino's GND when it feeds a MOSFET, a 0-10 V Module or a 4-20 mA sensor.
- **In the Skynet Help:** [Glossary: GND](../help/13-glossary.md#gnd)

#### DO, DI and AI Ports
- **In plain words:** DO = Digital Out (the board turns it On or Off). DI = Digital In (the board reads a switch, On or Off). AI = Analog In (the board reads a voltage, 0 to 5 V on a Mega).
- **What Skynet needs:** Mega AI Ports A0-A15 (= 54-69). The Pi has no AI Ports (use an ADS1115).
- **In the Skynet Help:** [Glossary: DO, DI and AI Ports](../help/13-glossary.md#do-di-and-ai-ports)

#### Opto-isolated
- **In plain words:** The board's signal lights a tiny LED inside the part, and the light switches the load, so no wire joins the board to the high-power side.
- **What Skynet needs:** Best for every Relay Module and SSR.
- **In the Skynet Help:** [Glossary: Opto-isolated](../help/13-glossary.md#opto-isolated)

#### Zero Cross
- **In plain words:** An SSR that switches only when the AC wave passes zero volts, which is gentle on the element and makes no electrical noise.
- **What Skynet needs:** The normal SSR for elements switched by PID, Duty Cycle or Hysteresis. Not for fast PWM.
- **In the Skynet Help:** [Glossary: Zero Cross](../help/13-glossary.md#zero-cross)

#### NO and NC (Normally Open, Normally Closed)
- **In plain words:** How a switch sits when nothing presses it or powers it. NO = open (off) until pressed; NC = closed (on) until pressed.
- **What Skynet needs:** An E-Stop uses NC to drop the Main Contactor. A normally closed valve is shut with no power.
- **In the Skynet Help:** [Glossary: NO and NC](../help/13-glossary.md#no-and-nc)

#### Interface
- **In plain words:** The board a Device is wired to: an Arduino Mega, an ESP32, or the Raspberry Pi's own pins.
- **What Skynet needs:** See the Device Library, section 2.

### Parts


### DAC (Digital to Analog Converter)
- **What it does:** Turns the board's on/off (digital) signal into a smooth voltage, for example 0 to 10 V, so a heater, valve or pump can be set to any % instead of only On or Off.
- **What Skynet needs:** Skynet sends a % from a **True PWM Port**, so the DAC it needs is a **PWM to 0-10 V Module** (input 0-5 V PWM from a Mega, or 3.3 V from an ESP32 or Pi; output 0-10 V or 0-5 V, set by a jumper or screw). A separate DAC chip board that talks over I2C (MCP4725, GP8403) is **not** read by the Skynet board program yet. Rule 6.24 lets you match the % to the real volts with a meter.
- **Suggested parts:** PWM to 0-10 V converter module (LC-LM358-PWM2V type, 0-5 V or 0-10 V selectable); a DIN-rail PWM to 0-10 V signal converter
- **Where to buy:** *(link coming)* Search Amazon for "PWM to 0-10V module".
- **In the Skynet Help:** [Glossary: DAC](../help/13-glossary.md#dac)

### SSR (Solid State Relay, Opto SSR)
- **What it does:** An electronic switch with no moving parts. A small DC signal from the board turns a bigger AC (or DC) load On and Off, silently.
- **What Skynet needs:** **Input:** about 3 to 32 V DC (works from every Interface). **Output:** AC 24-380 V for AC loads ("DA" type: DC in, AC out), or DC for DC loads ("DD" type). **AMPS:** 5 or 10 A for a pump or heat pad; 25 or 40 A on a Heat Sink for an element. **Zero cross** type for elements.
- **Suggested parts:** Auber, Crydom or Omron SSRs (DA type for AC, DD type for DC). Avoid look-alike "Fotek" SSRs.
- **Where to buy:** *(link coming)* Search Amazon for "SSR 40A DA".
- **In the Skynet Help:** [Glossary: SSR](../help/13-glossary.md#ssr)

### Heat Sink
- **What it does:** A finned metal block an SSR or power regulator is bolted to, so it gets rid of its heat and does not burn out.
- **What Skynet needs:** One for every SSR above about 5 AMPS and every 0-10 V Power Regulator, sized for the AMPS (the SSR maker lists one). A thin layer of heat sink paste or a pad between them.
- **Suggested parts:** Auber or Crydom heat sinks made for their SSRs; DIN-rail SSR heat sinks
- **Where to buy:** *(link coming)* Search Amazon for "SSR heat sink".
- **In the Skynet Help:** [Glossary: Heat Sink](../help/13-glossary.md#heat-sink)

### Relay Module
- **What it does:** A small board with one or more relays (a switch moved by a magnet). The board's pin turns the magnet on and the switch clicks closed.
- **What Skynet needs:** **Coil:** 5 V boards for a Mega; for an ESP32 or Pi pick a board sold as **3.3 V trigger** or **High/Low trigger**. **Opto-isolated** is best. **Contacts:** 10 A at 250 V AC. Many are **On when the pin is LOW**: that is how the Skynet board program already drives every Port (On = LOW), so leave **Invert** Off. Only a board that switches On with HIGH needs **Invert** On in the Pin attributes ⬢.
- **Suggested parts:** 1, 2, 4 or 8 channel 5 V opto-isolated relay modules (SRD-05VDC type relays); DIN-rail relay modules
- **Where to buy:** *(link coming)* Search Amazon for "8 channel 5V relay module opto isolated".
- **In the Skynet Help:** [Glossary: Relay Module](../help/13-glossary.md#relay-module)

### Mechanical Power Relay
- **What it does:** A bigger relay for heavy loads like a compressor motor. Its coil is switched by a Relay Module channel.
- **What Skynet needs:** Contacts rated for a motor (a horsepower rating, for example 1 HP, or 30 A). Coil 12 V or 24 V DC, or 120 V AC, matching what drives it.
- **Suggested parts:** General purpose power relays with an HP rating (8 or 11 pin plug-in relay with a DIN socket, or a 30 A open-frame power relay)
- **Where to buy:** *(link coming)* Search Amazon for "30A power relay 12V coil".
- **In the Skynet Help:** [Glossary: Mechanical Power Relay](../help/13-glossary.md#mechanical-power-relay)

### Contactor
- **What it does:** A heavy-duty relay that switches both hot wires of a 240 V circuit, so the element is truly Off. Also what an E-Stop drops.
- **What Skynet needs:** **Two-pole** (both hot wires) for 240 V; **30 or 40 A** for a 5500 W element. Coil voltage to match its driver (12 or 24 V DC, or 120 V AC), switched by a Relay Module channel.
- **Suggested parts:** Two-pole definite purpose contactors (30 A or 40 A); DIN-rail 2-pole modular contactors
- **Where to buy:** *(link coming)* Search Amazon for "2 pole 40A contactor".
- **In the Skynet Help:** [Glossary: Contactor](../help/13-glossary.md#contactor)

### 0-10 V Power Regulator (SCR)
- **What it does:** Sets how much power an element gets, from 0 to 100 %, by a 0-10 V signal (it trims each AC wave, called phase-angle).
- **What Skynet needs:** **Control:** 0-10 V (from the DAC / PWM to 0-10 V Module). **AMPS:** at least the element's, with room to spare (40 A or more for 5500 W at 240 V). **Voltage:** the element's (120 or 240 V AC). Always on a Heat Sink.
- **Suggested parts:** SCR power regulators or SSVR voltage regulators with a 0-10 V input (Auber, Crydom, Fotek-free brands)
- **Where to buy:** *(link coming)* Search Amazon for "SCR power controller 0-10V".
- **In the Skynet Help:** [Glossary: 0-10 V Power Regulator](../help/13-glossary.md#0-10v-controller)

### GFCI (Ground Fault Circuit Interrupter)
- **What it does:** Cuts the power in a split second if electricity leaks to ground, for example through water or a person. A must near liquids.
- **What Skynet needs:** Every AC circuit in the brewery on a GFCI: a GFCI breaker in the main panel, a GFCI spa panel, or a GFCI outlet first on the line. Sized for the circuit (20 A for 120 V elements and pumps, 30 or 50 A for 240 V elements).
- **Suggested parts:** GFCI breakers made for your main panel's brand; 50 A GFCI spa panels
- **Where to buy:** *(link coming)* Search Amazon for "GFCI spa panel 50A".
- **In the Skynet Help:** [Glossary: GFCI](../help/13-glossary.md#gfci)

### Waterproof In Use Outlet
- **What it does:** An outdoor outlet with a cover that stays closed over a plug, so water can't get in.
- **What Skynet needs:** Rated for wet places ("in use" or "extra duty" cover), on a GFCI circuit, the outlet's AMPS matching the circuit.
- **Suggested parts:** Weatherproof in-use outlet covers with a GFCI outlet
- **Where to buy:** *(link coming)* Search Amazon for "in use weatherproof outlet cover".
- **In the Skynet Help:** [Glossary: Waterproof In Use Outlet](../help/13-glossary.md#waterproof-in-use-outlet)

### E-Stop (Emergency Stop)
- **What it does:** A big red mushroom button. Pressed, it cuts all the brewery's power by its own wiring.
- **What Skynet needs:** A **normally closed** contact that drops the Main Contactor's coil, and a second contact (normally open or closed) to a DI Port so Skynet knows (Type ID `EStop`). Twist or pull to reset.
- **Suggested parts:** 22 mm red mushroom E-stop button with 1 NC + 1 NO contact blocks
- **Where to buy:** *(link coming)* Search Amazon for "22mm emergency stop button NC NO".
- **In the Skynet Help:** [Glossary: E-Stop](../help/13-glossary.md#e-stop)

### MOSFET Module
- **What it does:** An electronic switch for DC loads that can also switch very fast, so it can set a DC pump or fan's speed by PWM.
- **What Skynet needs:** **Logic level** (turns fully on at 3.3 or 5 V), DC load voltage 12 or 24 V, 10 A or more. Ground tied to the Arduino's GND.
- **Suggested parts:** Logic-level MOSFET driver modules (IRF520 modules are not fully on at 5 V; pick a logic-level or dual-MOSFET module)
- **Where to buy:** *(link coming)* Search Amazon for "logic level MOSFET module PWM".
- **In the Skynet Help:** [Glossary: MOSFET Module](../help/13-glossary.md#mosfet-module)

### DC Power Supply
- **What it does:** Turns the wall's AC into steady 12 V or 24 V DC for valves, relays, DC pumps and modules.
- **What Skynet needs:** Voltage to match the parts; AMPS at least the total of everything on it plus 25 %. DIN-rail or enclosed. Its (-) tied to the Arduino's GND when a MOSFET, 0-10 V Module or 4-20 mA sensor is used.
- **Suggested parts:** Mean Well DIN-rail supplies (HDR or EDR series); Mean Well LRS enclosed supplies
- **Where to buy:** *(link coming)* Search Amazon for "Mean Well 24V DIN rail power supply".
- **In the Skynet Help:** [Glossary: DC Power Supply](../help/13-glossary.md#dc-power-supply)

### Diode (Flyback Diode)
- **What it does:** A one-way part put across a DC coil (solenoid or relay) to soak up the kick when it turns off, so it does not harm the switch.
- **What Skynet needs:** 1N4007 (or 1N4001-1N4007), stripe toward the (+) side of the coil.
- **Suggested parts:** 1N4007 diode packs
- **Where to buy:** *(link coming)* Search Amazon for "1N4007 diode".
- **In the Skynet Help:** [Glossary: Diode](../help/13-glossary.md#diode)

### Motorized Ball Valve
- **What it does:** A ball valve with a small motor on top that opens and closes it when power is switched.
- **What Skynet needs:** 12 V or 24 V DC; stainless body for wort; the wiring on its label: **one control wire** (one relay) or **Open and Close wires** (two relays, Dual Throw, Rule 6.22). Sellers' wire codes (CR02, CR03, CR05...) differ, so read the label.
- **Suggested parts:** Stainless 3-wire motorized ball valves (US Solid, Tsai Fan types), 1/2" NPT or TC 1.5
- **Where to buy:** *(link coming)* Search Amazon for "motorized ball valve stainless 12V 3 wire".
- **In the Skynet Help:** [Glossary: Motorized Ball Valve](../help/13-glossary.md#motorized-ball-valve)

### Solenoid Valve
- **What it does:** A valve opened by an electric magnet. Snaps open or shut. Most need water pressure to work.
- **What Skynet needs:** **Normally closed**, 12 or 24 V DC, food grade (stainless) for wort, brass for cooling water. A Flyback Diode across the coil if it has none.
- **Suggested parts:** Stainless or brass normally closed 12 V solenoid valves (1/2" NPT)
- **Where to buy:** *(link coming)* Search Amazon for "12V normally closed solenoid valve stainless".
- **In the Skynet Help:** [Glossary: Solenoid Valve](../help/13-glossary.md#solenoid-valve)

### Gas Solenoid Valve
- **What it does:** A solenoid valve made for gas, so the brew controller can turn the burner On and Off.
- **What Skynet needs:** **Listed for LP gas** (UL or CSA), **normally closed**, rated above the regulator's pressure, 24 V DC (or 24 V AC) coil. See [High-pressure gas burner build](High_Pressure_Gas_Build.md). ⚠️ Gas warning above.
- **Suggested parts:** Listed LP gas solenoid valves (ASCO gas shut-off series and similar)
- **Where to buy:** *(link coming)* Search Amazon for "LP gas solenoid valve 24V listed".
- **In the Skynet Help:** [Glossary: Gas Solenoid Valve](../help/13-glossary.md#gas-solenoid-valve)

### Thermocouple Gas Safety Valve
- **What it does:** A gas valve held open by a pilot flame heating a thermocouple. If the flame goes out, it shuts all gas by itself, with no power.
- **What Skynet needs:** **UL or CSA listed**, for LP, the right pressure (low-pressure VR8200 type, or high-pressure BASO H19 type) and BTU. Fitted by a licensed gas professional. Recommended (Rule 6.33).
- **Suggested parts:** Honeywell VR8200 type (low pressure); BASO H19 series (high pressure)
- **Where to buy:** *(link coming)* Search Amazon for "BASO H19 safety pilot valve".
- **In the Skynet Help:** [Glossary: Thermocouple Gas Safety Valve](../help/13-glossary.md#thermocouple-gas-safety-valve)

### Igniter
- **What it does:** Makes a spark (or a hot glowing tip) to light the burner.
- **What Skynet needs:** 12 V DC spark module or 120 V AC hot surface igniter, switched by a Relay Module channel. Turned off by a Flame Out trip.
- **Suggested parts:** 12 V pulse spark igniter modules; hot surface igniters for gas burners
- **Where to buy:** *(link coming)* Search Amazon for "12V spark igniter module".
- **In the Skynet Help:** [Glossary: Igniter](../help/13-glossary.md#igniter)

### Thermowell
- **What it does:** A closed metal tube that sits in the liquid. The probe slides inside, so the probe can be taken out without draining.
- **What Skynet needs:** TC 1.5 (Tri-Clamp) or 1/2" NPT, stainless, long enough to reach the liquid (Short, Medium or Long), its inside wide enough for the probe (most take a 6 mm or 1/4" probe).
- **Suggested parts:** Stainless TC 1.5 thermowells; 1/2" NPT thermowells
- **Where to buy:** *(link coming)* Search Amazon for "tri clamp thermowell 1.5".
- **In the Skynet Help:** [Glossary: Thermowell](../help/13-glossary.md#thermowell)

### DS18B20 Probe
- **What it does:** A digital temperature probe. Many share one wire, each with its own number.
- **What Skynet needs:** Waterproof stainless tip, 3 wires (5 V, GND, data). One 4.7k ohm resistor for the whole set. OneWire Port: Mega D40, Pi GPIO 4.
- **Suggested parts:** Waterproof DS18B20 probes (1 m to 3 m lead)
- **Where to buy:** *(link coming)* Search Amazon for "DS18B20 waterproof probe".
- **In the Skynet Help:** [Glossary: DS18B20 Probe](../help/13-glossary.md#ds18b20)

### RTD (PT100 or PT1000) and MAX31865 Board
- **What it does:** The most accurate kind of temperature probe. The MAX31865 board reads it for the Arduino.
- **What Skynet needs:** One MAX31865 board per probe; its jumpers set for 2, 3 or 4 wires (3 is the start). SPI Ports (Mega D50-D52) and one CS Port (Rule 6.9). PT100 reference resistor 430 ohm, PT1000 4300 ohm.
- **Suggested parts:** Adafruit MAX31865 board (or a clone); 3-wire PT100 probes with a 1/2" NPT fitting
- **Where to buy:** *(link coming)* Search Amazon for "MAX31865 PT100 board".
- **In the Skynet Help:** [Glossary: RTD](../help/13-glossary.md#rtd)

### Thermocouple and MAX31855 / MAX31856 Board
- **What it does:** A probe for very hot places (a burner's flame, a flue). The board reads its tiny voltage.
- **What Skynet needs:** MAX31856 for any type (K, J, T ...) or MAX31855 for Type K only; one board per probe; SPI Ports and one CS Port. Thermocouple wire, + and - the right way round.
- **Suggested parts:** Adafruit MAX31856 or MAX31855 boards; ceramic or Inconel Type K probes
- **Where to buy:** *(link coming)* Search Amazon for "MAX31856 thermocouple board".
- **In the Skynet Help:** [Glossary: Thermocouple and MAX31855 / MAX31856 Board](../help/13-glossary.md#thermocouple)

### NTC Thermistor
- **What it does:** The cheapest temperature probe: its resistance changes with heat.
- **What Skynet needs:** One Analog Port and one resistor the same size as the thermistor (10k ohm for a 10K). Its Beta value (for example 3950 or 3977) goes in its Properties.
- **Suggested parts:** 10K NTC Beta 3950 waterproof probes; BCS-462 type 10K probes
- **Where to buy:** *(link coming)* Search Amazon for "10K NTC thermistor probe waterproof".
- **In the Skynet Help:** [Glossary: NTC Thermistor](../help/13-glossary.md#ntc-thermistor)

### Float Switch
- **What it does:** A float that closes a switch when the liquid reaches it (full) or drops away (low).
- **What Skynet needs:** Stainless, food grade, 2 wires to a DI Port and GND (the board's pull-up is on).
- **Suggested parts:** Stainless side-mount or vertical float switches
- **Where to buy:** *(link coming)* Search Amazon for "stainless float switch".
- **In the Skynet Help:** [Glossary: Float Switch](../help/13-glossary.md#float-switch)

### Level Transmitter (4-20 mA)
- **What it does:** Reads how deep the liquid is and sends it as a current from 4 mA (empty) to 20 mA (full).
- **What Skynet needs:** 24 V DC loop power and a 250 ohm resistor from the Analog Port to GND (20 mA = 5 V). Rated for the liquid's temperature.
- **Suggested parts:** Stainless submersible or hydrostatic level transmitters with a 4-20 mA output
- **Where to buy:** *(link coming)* Search Amazon for "4-20mA level transmitter stainless".
- **In the Skynet Help:** [Glossary: Level Transmitter](../help/13-glossary.md#level-transmitter)

### Pressure Transducer (0.5-4.5 V)
- **What it does:** Reads pressure (or liquid depth by the pressure at the bottom) as a voltage.
- **What Skynet needs:** 5 V supply from the Arduino, signal 0.5-4.5 V to an Analog Port, stainless, 1/4" NPT, rated for the liquid's temperature. An ADS1115 board gives finer readings.
- **Suggested parts:** Stainless 5 V pressure transducers, 0-5 psi or 0-30 psi
- **Where to buy:** *(link coming)* Search Amazon for "pressure transducer 5V 0.5-4.5V stainless".
- **In the Skynet Help:** [Glossary: Pressure Transducer](../help/13-glossary.md#pressure-transducer)

### HX711 Board and Load Cells
- **What it does:** Load cells bend a tiny bit under weight; the HX711 board reads that so Skynet can weigh a vessel.
- **What Skynet needs:** One HX711 per vessel (two Ports: DT and SCK), with four half-bridge cells and a Combinator Board, or one S-type cell sized for the full vessel.
- **Suggested parts:** HX711 boards; 50 kg half-bridge load cell sets of 4 with combinator; S-type load cells
- **Where to buy:** *(link coming)* Search Amazon for "HX711 load cell kit".
- **In the Skynet Help:** [Glossary: HX711 Board and Load Cells](../help/13-glossary.md#hx711-and-load-cells)

### Flow Meter
- **What it does:** A little wheel in the pipe sends a pulse each time a set amount of liquid passes.
- **What Skynet needs:** A Counter Port (Mega D2, D3, D18-D21), 5 V supply; stainless and food grade for hot wort (plastic YF-S201 for cold water only); Pulses per unit from its data sheet.
- **Suggested parts:** Stainless hall-effect flow sensors (1/2" NPT); YF-S201 for cold water
- **Where to buy:** *(link coming)* Search Amazon for "stainless hall flow sensor 1/2".
- **In the Skynet Help:** [Glossary: Flow Meter](../help/13-glossary.md#flow-meter)

### ADS1115 Board
- **What it does:** A small board that reads 4 analog signals much more finely than the Arduino can.
- **What Skynet needs:** I2C (Mega SDA/SCL, Pi GPIO 2 and 3), address 0x48, 3.3 or 5 V. For pH and pressure.
- **Suggested parts:** Adafruit ADS1115 board (or a clone)
- **Where to buy:** *(link coming)* Search Amazon for "ADS1115 module".
- **In the Skynet Help:** [Glossary: ADS1115 Board](../help/13-glossary.md#ads1115)

### Stepper Driver
- **What it does:** Feeds a stepper motor in small steps so it turns to an exact position.
- **What Skynet needs:** STEP and DIR pins (ENABLE optional), its own 12-24 V DC supply (never the Arduino's 5 V), set to the motor's current.
- **Suggested parts:** TMC2209, A4988, DRV8825 (small motors); TB6600 or DM542 (NEMA 23)
- **Where to buy:** *(link coming)* Search Amazon for "TMC2209 stepper driver".
- **In the Skynet Help:** [Glossary: Stepper Driver](../help/13-glossary.md#stepper-driver)

---

## Change log
- 2026-11-17: Each Parts Glossary word links to its entry in the Skynet Help Glossary (Help 13), where the same words are in the Panel and in French (OakBarn Brewery: "something Technical like 12C needs explanation (Link to Glossary)"; "Since 457 is merged anything need must be in the newer PR").
- 2026-11-17: Technical words (I2C, SPI, PWM ...) explained in the Glossary, and each Device entry links its terms to them (OakBarn Brewery: "something Technical like I2C needs explanation (Link to Glossary)").
- 2026-11-17: Added 11 Parts Glossary (OakBarn Brewery: Term, plain words, what Skynet needs, suggested parts; store links later).
- 2026-11-17: Added 2.4a Heater on a PWM Port (True PWM Port, DAC or PWM to 0-10 V Module, 0-10 V Power Regulator).
- 2026-11-17: OakBarn Brewery confirmed the additions ("Additions to Confirm Yes"): the Contactor for 240 V elements (2.2), the Mechanical Relay for compressors (4.2) and the E-Stop that cuts the power by its own wiring (8.1).
- 2026-11-17: Pump Switching: Relay or SSR, both as options (OakBarn Brewery: "Describe both as Options in Text and why a Relay Works just as well as a SSR but the trigger voltage may favor an SSR").
- 2026-11-17: First version, from OakBarn Brewery's Pump (On/Off) sheet, for every Device Skynet makes today.
