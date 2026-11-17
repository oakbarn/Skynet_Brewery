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
- **Arduino** = the Interface the Device is on: an Arduino Mega, an ESP32, or the Raspberry Pi's own pins (GPIO). The chain is the
  same on all of them. The ESP32 and the Pi send **3.3 V**, not 5 V: pick an SSR or relay module that turns on at 3.3 V (most
  "3-32 V DC input" SSRs do).
- **DO Port** = a Digital Out pin (on / off). **PWM Port** = a pin marked PWM (Mega D2-D13, D44-D46). **AI Port** = an analog pin
  (Mega A0-A15). **DI Port** = a Digital In pin. **Counter Port** = Mega D2, D3, D18-D21. These are the Port rules in the
  [Device Library](Device_Library.md).
- **Device Type** is the Skynet type the Device is made as (for example `DO@Pump`); **Type ID** is its ID in the [Device Library](Device_Library.md).
- One Port, one Device (Rule 6.1): count one free Port for every Device.

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

---

## 1. Pumps

### 1.1 Pump (On/Off)
Device Type `DO@Pump`. An AC brewing pump (Blichmann RipTide, Chugger, March).

- One (1) Free Arduino DO Port
- GFCI AC Circuit ⚠️ (can Provide Power to more than a single Pump)
- One (1) AC Opto SSR ⚠️ (5 or 10 AMPS is sufficient)
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

The SSR in 1.1 can be swapped for a **Relay** (One (1) Relay Module channel ⚠️, contacts rated 10 AMPS at 250 V AC). The chain is
the same: Arduino ───▶ Relay ───▶ Waterproof Outlet ───▶ Pump plug.

**Why a Relay works just as well for a pump:** a pump is switched On or Off only a few times a brew day and draws only a few AMPS, so a
Relay's contacts last for years. When a Relay is Off it is truly Off (no small leak of power), and it makes no heat, so it needs no
Heat Sink. It clicks when it switches. It is often the cheaper choice (an 8 channel board also runs the valves).

**Why the trigger voltage may favor an SSR:** a Relay needs enough voltage and current from the pin to pull its switch in. Most
relay boards are made for **5 V** boards like the Arduino Mega. An ESP32 or the Raspberry Pi's own pins send only **3.3 V** and
may not switch a 5 V relay board every time, or may not let it go. An Opto SSR switches on anything from about **3 to 32 V DC**
with very little current, so it works from every Interface. It is silent and has no contacts to wear out.

| | Relay | Opto SSR |
|---|---|---|
| Switches on from | 5 V boards (some 3.3 V boards with a "3.3 V" or "High/Low trigger" relay board) | About 3 to 32 V DC: every Interface |
| Off is | Truly Off | A tiny leak (a meter can show voltage at the outlet: still unplug before touching) |
| Heat | None | A little; a Heat Sink above about 5 AMPS (a pump does not need one) |
| Noise and wear | Clicks; contacts wear slowly | Silent; no wear |
| Watch for | Many boards are **On when the pin is LOW**: set **Invert** On in the Pin attributes ⬢ | Fake brand SSRs: buy a known brand |

Either way the Pump Device in Skynet is the same (`DO@Pump`); only the part in the box changes.

### 1.2 DC Pump (On/Off)
Device Type `DO@Pump`, Power dc12 or dc24 (a 12 V or 24 V pump, see [DC Brewing Pumps](DC_Brewing_Pumps.md)).

- One (1) Free Arduino DO Port
- One (1) DC Power Supply, 12 V or 24 V (the pump's voltage, at least 1 A more than the pump draws; can power more than a single Pump)
- One (1) DC Opto SSR (DC in, DC out) or One (1) Relay Module channel (5 or 10 AMPS is sufficient)
- One (1) DC On/Off Brewing Pump

```
               12 V / 24 V DC PWR
                    │
                    ▼
  Arduino  ───▶  DC SSR   ───▶   DC Pump
                 or Relay
```

### 1.3 DC Pump (Speed, PWM)
Device Type `PWM@Pump`, Speed control = PWM. Only a brushless DC pump made for speed control (for example a Topsflo TD5 model
with a speed wire). An AC pump is On/Off only (Rule 18.32).

- One (1) Free Arduino PWM Port
- One (1) DC Power Supply, 12 V or 24 V
- One (1) MOSFET Module (logic level, 10 AMPS is sufficient), unless the pump has its own speed (PWM) wire, which then goes straight to the PWM Port with a shared Ground
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
Device Type `DO@H_Element`, Hardware Controller = Optical SSR (Rule 6.29). Any method (Direct, PID, Hysteresis, Duty Cycle, Deadband).

- One (1) Free Arduino DO Port
- GFCI AC Circuit ⚠️ (its own 20 AMP circuit for a 1650 W element; one element per circuit)
- One (1) AC Opto SSR ⚠️ (25 or 40 AMPS, zero cross, a brand-name one)
- One (1) SSR Heat Sink ⚠️ (sized for the SSR; an SSR without one overheats)
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
Device Type `DO@H_Element`. The SSR switches the heat; the Contactor cuts both hot wires so the element is truly OFF.

- Two (2) Free Arduino DO Ports (one for the SSR, one for the Contactor's relay)
- GFCI AC Circuit ⚠️ (240 V, 30 AMP for a 5500 W element; one element per circuit)
- One (1) AC Opto SSR ⚠️ (40 AMPS, zero cross, a brand-name one)
- One (1) SSR Heat Sink ⚠️
- One (1) Two-Pole Contactor ⚠️ (30 or 40 AMPS)
- One (1) Relay Module channel (switches the Contactor's coil)
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
Device Type `DO@H_Element`, Hardware Controller = Contactor (Rule 6.29: offset -1 to -5 °F, On delay at least 10 seconds).
For Direct or Hysteresis only; PID and Duty Cycle switch too often for a Contactor.

- One (1) Free Arduino DO Port
- GFCI AC Circuit ⚠️ (sized for the element)
- One (1) Relay Module channel (switches the Contactor's coil)
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

- One (1) Free Arduino PWM Port
- One (1) PWM to 0-10 V Module
- One (1) 12 or 24 V DC Power Supply (for the module)
- GFCI AC Circuit ⚠️
- One (1) SCR or Voltage Regulator (SSVR) Power Controller ⚠️ (0-10 V input, sized for the element) on its Heat Sink ⚠️
- One (1) Heating Element ⚠️

```
               AC GFCI PWR ⚠️
                    │
                    ▼
  Arduino  ───▶  PWM to 0-10 V  ───▶  SCR / SSVR ⚠️  ───▶  Heating Element ⚠️
  (PWM Port)       Module
```

### 2.4a Heater on a PWM Port
Device Type `PWM@H_Element` (OakBarn Brewery, 2026-11-17: "Those would be the True PWM Ports and a DAC and 0-10v Controller").
The element's power is set from 0 to 100 %. The same power controller as 2.4; only the Port and the converter differ.

- One (1) Free Arduino **True PWM Port** (Mega D2-D13, D44-D46)
- One (1) DAC or PWM to 0-10 V Module: an Arduino Mega has **no real DAC**, so on a Mega a PWM to 0-10 V Module takes its place. An
  ESP32 has a real DAC (GPIO 25 and 26), but it gives only 0-3.3 V, so it still needs a module that raises it to 0-10 V.
- One (1) 12 or 24 V DC Power Supply (for the module)
- GFCI AC Circuit ⚠️ (sized for the element)
- One (1) 0-10 V Controlled Power Regulator ⚠️ (SCR, phase-angle type), its AMPS matched to the element (40 AMPS or more for a 5500 W
  element on 240 V)
- One (1) Heat Sink ⚠️ for the regulator (it makes heat like an SSR)
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

- One (1) Free Arduino DO Port
- GFCI AC Circuit ⚠️ (can Provide Power to more than a single Heat Pad)
- One (1) AC Opto SSR ⚠️ (5 or 10 AMPS is sufficient)
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

- One (1) Free Arduino DO Port
- One (1) Relay Module channel
- One (1) 24 V DC Power Supply (or a true 24 VAC transformer for a 24 VAC valve)
- One (1) Gas Solenoid Valve ⚠️ (normally closed, listed for LP gas, rated above the regulator's pressure)
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

- One (1) Free Arduino DO Port
- One (1) Relay Module channel
- One (1) Power Supply for the igniter (12 V DC, or GFCI AC Circuit ⚠️ for a 120 V igniter)
- One (1) Spark or Hot Surface Igniter ⚠️

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

- One (1) Free Arduino DO Port
- One (1) Relay Module channel
- One (1) 12 V or 24 V DC Power Supply (the valve's voltage; can power more than a single Valve)
- One (1) Motorized Ball Valve, 3 wire, one control wire (the wiring is printed on its label)

```
               12 V / 24 V DC PWR ───────────────▶ Valve (always-on wire)
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Valve (control wire)
```

### 3.3 Motorized Ball Valve (Open wire and Close wire)
Device Type `DO@Valve_E` with **Dual Throw** (Rule 6.22): the two relays are never on together.

- Two (2) Free Arduino DO Ports (its own Port and the Dual Throw Port)
- Two (2) Relay Module channels
- One (1) 12 V or 24 V DC Power Supply
- One (1) Motorized Ball Valve with an Open wire and a Close wire

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
use the AC chain of 1.1 (GFCI AC Circuit ⚠️ and AC Opto SSR ⚠️) instead of the DC Power Supply and Relay.

### 3.5 Water Solenoid Valve
Device Type `DO@Valve_E`, often a Tap water valve. Most solenoid valves need water pressure to open (not for gravity flow).

- One (1) Free Arduino DO Port
- One (1) Relay Module channel
- One (1) 12 V or 24 V DC Power Supply
- One (1) Normally Closed Solenoid Valve (food grade for wort, brass is fine for cooling water)
- One (1) Diode (1N4007) across the coil, if the valve has none

```
               12 V / 24 V DC PWR
                    │
                    ▼
  Arduino  ───▶   Relay   ───▶   Solenoid Valve
```

### 3.6 Proportional Valve (KLD20T)
Type ID `P_L_Vlv` (Skynet KLD20T): 0-5 V opens it 0-100 %.

- One (1) Free Arduino PWM Port
- One (1) PWM to 0-10 V Module, set to 0-5 V
- One (1) 24 V DC Power Supply
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
No wiring: in Skynet a chiller is a pipe. To switch its cooling water, add one Water Solenoid Valve (3.5) or Motorized Ball Valve
(3.2). To read the wort out, add one Temperature Probe (section 6).

```
  Arduino ───▶ (the 3.5 chain) ───▶ Cooling Water ───▶ Chiller ───▶ Probe ───▶ Arduino
```

### 4.2 Glycol Chiller, Fridge or Freezer
Type ID `Chill`. A compressor, so a Mechanical Relay is better than an SSR, with an On delay so it is not restarted too soon.

- One (1) Free Arduino DO Port
- GFCI AC Circuit ⚠️
- One (1) Relay Module channel
- One (1) Mechanical Power Relay ⚠️ (rated for a motor: 30 AMPS, or a relay with a 1 HP rating)
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
Type ID `Fan` (on a PWM Port for speed, with a 4-wire PWM fan).

- One (1) Free Arduino DO Port (PWM Port for speed)
- One (1) 12 V DC Power Supply
- One (1) Relay Module channel or MOSFET Module
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
| Temperature Probe or Thermowell | Section 6 |
| Motorized Valve | 3.2 or 3.3 |
| Gas Burner under it | 2.6 (and 2.7) |
| HERMS Coil | No wiring (the HLT's element and probe, and a pump) |

### 5.2 Basic Electric Kettle
A Skynet Integrated Device: one Heating Element (2.1 or 2.2) plus one Temperature Probe (section 6) in its thermowell.

### 5.3 Float Switch (High or Low Level)
Type ID `Float`. Low voltage only; the board's pull-up is on.

- One (1) Free Arduino DI Port
- One (1) Stainless Float Switch

```
  Arduino DI Port  ───▶  Float Switch  ───▶  Arduino GND
```

### 5.4 Level Transmitter (4-20 mA)
Type ID `Level`.

- One (1) Free Arduino AI Port
- One (1) 24 V DC Power Supply
- One (1) 250 ohm Resistor (AI Port to GND: 20 mA = 5 V)
- One (1) 4-20 mA Level Transmitter (rated for the liquid's temperature)

```
  24 V DC PWR (+) ───▶ Transmitter (+)
  Transmitter (-) ───▶ Arduino AI Port ───▶ 250 ohm ───▶ GND
  24 V DC PWR (-) ───▶ Arduino GND
```

### 5.5 Pressure Transducer (Level by pressure)
Type ID `Pres`.

- One (1) Free Arduino AI Port
- One (1) 0.5-4.5 V Pressure Transducer, stainless, 1/4" NPT (rated for the liquid's temperature)

```
  Arduino 5 V ───▶ Transducer (red)
  Arduino GND ───▶ Transducer (black)
  Transducer (signal) ───▶ Arduino AI Port
```

### 5.6 Vessel Scale (Load Cells)
Type ID `Scale`.

- Two (2) Free Arduino Ports (DT and SCK)
- One (1) HX711 Board
- One (1) set of Load Cells: Four (4) half-bridge cells with a Combinator Board, or One (1) S-type cell sized for the full Vessel

```
  Load Cells ───▶ HX711 Board (E+, E-, A+, A-) ───▶ Arduino (DT, SCK, 5 V, GND)
```

---

## 6. Temperature Probes

Low voltage only. A Temperature Probe in a vessel or pipe sits in a **Thermowell** or a **Tee** (TC 1.5).

### 6.1 DS18B20 (OneWire)
Device Type `TEMP@1W`. Many probes share one wire.

- The OneWire Port (Mega D40; Pi GPIO 4), shared by every DS18B20
- One (1) 4.7k ohm Resistor (one for the whole set, data wire to 5 V)
- One (1) Waterproof DS18B20 Probe, stainless tip

```
  Arduino 5 V ───┬───▶ Probe (red)
              4.7k ohm
                 │
  Arduino D40 ◀──┴──── Probe (yellow, data)
  Arduino GND ───────▶ Probe (black)
```

### 6.2 PT100 or PT1000 RTD
Type ID `RTD`. The most accurate.

- One (1) Free Arduino CS Port (Mega: only D14-D17, D22-D39, D41-D43, D47-D49, D53, Rule 6.9)
- The SPI Ports (Mega D50, D51, D52), shared by every RTD and Thermocouple board
- One (1) MAX31865 Board (its jumpers set for 2, 3 or 4 wires)
- One (1) PT100 or PT1000 Probe (3 wire is the start)

```
  Probe ───▶ MAX31865 Board ───▶ Arduino (CS Port, D50, D51, D52, 5 V, GND)
```

### 6.3 Thermocouple (Type K and others)
Type ID `TC`. For very hot places (burners, flue).

- One (1) Free Arduino CS Port
- The SPI Ports (Mega D50, D51, D52), shared
- One (1) MAX31856 Board (any type) or MAX31855 Board (Type K only)
- One (1) Thermocouple Probe (and Thermocouple wire if it needs to be longer; + and - the right way round)

```
  Thermocouple ───▶ MAX31856 / MAX31855 Board ───▶ Arduino (CS Port, D50, D51, D52, 5 V, GND)
```

### 6.4 NTC Thermistor (10K and others)
Type ID `10KNTC` (5K, 50K, 100K the same way). The cheapest.

- One (1) Free Arduino AI Port
- One (1) Resistor the size of the thermistor (10k ohm for a 10K), AI Port to 5 V
- One (1) NTC Thermistor Probe

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

- One (1) Free Arduino AI Port
- One (1) LM35 or TMP36

```
  Arduino 5 V ───▶ Sensor ───▶ Arduino AI Port
                      │
                      ▼
                 Arduino GND
```

### 6.6 Thermowell or Tee with a Temperature Probe
The parts of the Probe it holds (6.1 to 6.4), plus One (1) TC 1.5 Thermowell (Short, Medium or Long) or One (1) Instrument / Long
Tee, and One (1) TC 1.5 Clamp and Gasket.

---

## 7. Flow

### 7.1 Flow Meter
Type ID `FlowM`.

- One (1) Free Arduino Counter Port (Mega D2, D3, D18-D21; up to 6 per Mega)
- One (1) Hall Flow Meter (stainless, food grade for hot wort; plastic YF-S201 for cold water only)

```
  Arduino 5 V ───▶ Flow Meter (red)
  Arduino GND ───▶ Flow Meter (black)
  Flow Meter (yellow, pulse) ───▶ Arduino Counter Port
```

### 7.2 Flow Switch
Type ID `FlowSw`. Wired like the Float Switch (5.3).

- One (1) Free Arduino DI Port
- One (1) Flow Switch (food grade)

```
  Arduino DI Port  ───▶  Flow Switch  ───▶  Arduino GND
```

---

## 8. Safety and buttons

### 8.1 Emergency Stop (E-Stop)
Type ID `EStop`. **The E-Stop must cut the power by its own wiring**, not only tell Skynet: a mushroom button with a
normally closed contact that drops the Main Contactor's coil, and a second contact to a DI Port so Skynet knows.

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
Type IDs `Leak`, `Intlk`, `PB`, `Toggle`, `DIN`. Wired like the Float Switch (5.3).

- One (1) Free Arduino DI Port
- One (1) Sensor, Switch or Button

```
  Arduino DI Port  ───▶  Switch  ───▶  Arduino GND
```

---

## 9. Other Devices

### 9.1 Light, LED or Alarm Buzzer
Type IDs `Light`, `LED`, `E_Alm`.

- One (1) Free Arduino DO Port
- A small LED: One (1) 220 ohm Resistor. A panel light or buzzer: One (1) Relay Module channel and its Power Supply
  (GFCI AC Circuit ⚠️ for a 120 V light)

```
  Arduino ───▶ 220 ohm ───▶ LED ───▶ GND
  Arduino ───▶ Relay ───▶ Light or Buzzer
```

### 9.2 pH Probe
Type ID `PH_Met`.

- One (1) Free Arduino AI Port (or an ADS1115 channel for finer readings)
- One (1) pH Amplifier Board (0-5 V out)
- One (1) pH Probe

```
  pH Probe ───▶ pH Board ───▶ Arduino AI Port (5 V, GND)
```

### 9.3 Stepper Motor
Type ID `Step`.

- Two (2) or Three (3) Free Arduino Ports (STEP, DIR, ENABLE), plus One (1) for a Home Switch
- One (1) Stepper Driver (TMC2209, A4988, DRV8825, TB6600 ...)
- One (1) 12-24 V DC Power Supply (never the Arduino's 5 V)
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
- One (1) 12 V or 24 V DC Power Supply for the Relays, Valves and DC Pumps
- One (1) Relay Module (8 channels, opto-isolated) for the Valves and Contactor coils
- One (1) Main Contactor ⚠️ and E-Stop ⚠️ (8.1)
- GFCI AC Circuit(s) ⚠️ (a GFCI breaker or GFCI spa panel)
- Fuses or Breakers ⚠️ for each AC circuit, and an Enclosure, DIN Rail, Terminal Blocks and Cable Glands
- Grounds: a MOSFET Module, a PWM to 0-10 V Module or a 4-20 mA sensor needs its DC Power Supply's (-) tied to the Arduino's GND (opto-isolated Relays and SSRs do not)

Prices: see the [Hardware shopping list](Skynet_Brewery_Shopping_List.md).

---

## Change log
- 2026-11-17: Added 2.4a Heater on a PWM Port (True PWM Port, DAC or PWM to 0-10 V Module, 0-10 V Power Regulator).
- 2026-11-17: OakBarn Brewery confirmed the additions ("Additions to Confirm Yes"): the Contactor for 240 V elements (2.2), the Mechanical Relay for compressors (4.2) and the E-Stop that cuts the power by its own wiring (8.1).
- 2026-11-17: Pump Switching: Relay or SSR, both as options (OakBarn Brewery: "Describe both as Options in Text and why a Relay Works just as well as a SSR but the trigger voltage may favor an SSR").
- 2026-11-17: First version, from OakBarn Brewery's Pump (On/Off) sheet, for every Device Skynet makes today.
