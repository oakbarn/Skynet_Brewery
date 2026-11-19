# Skynet Boards

A **board** (an **Interface**) is the Arduino, ESP or Raspberry Pi your Devices are wired to. You pick it in **➕ Add Interface > Board**. Skynet then sets the rest from the board: its **Connection** choices and its **Ports** (IO Pins), with the right PWM, counter, analog and bus Ports for that board.

**Skynet is planned and wired for the Arduino Mega 2560** (a 5 V board). Every other board in the list can be used too. A board must be On and talking to the Brain to do anything.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

## The boards

| Board | Volts | Ports (IO Pins) | True PWM Ports | Counter Ports (flow meters) | Analog Ports | Connection |
|---|---|---|---|---|---|---|
| **Arduino Mega 2560** (the standard) | 5 V | D2-D53 | D2-D13, D44-D46 | D2, D3, D18-D21 | A0-A15 (pin 54-69) | USB, Ethernet shield, WiFi through an ESP32 bridge |
| Arduino Uno R3 | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A5 | USB, Ethernet shield |
| Arduino Uno R4 (Minima or WiFi) | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11 | D0-D3, D8 | A0-A5 | USB, Ethernet shield, WiFi (R4 WiFi only) |
| Arduino Nano | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A7 | USB, Ethernet module |
| Arduino Nano Every | 5 V | D0-D13 | D3, D5, D6, D9, D10 | every Port | A0-A7 | USB, Ethernet module |
| Arduino Leonardo | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A11 (A6-A11 are D4, D6, D8, D9, D10, D12) | USB, Ethernet shield |
| Arduino Micro | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A11 (A6-A11 are D4, D6, D8, D9, D10, D12) | USB, Ethernet module |
| Arduino Due | **3.3 V** | D2-D53 | D2-D13 | every Port | A0-A11 | USB, Ethernet shield |
| Arduino GIGA R1 WiFi | **3.3 V** | D0-D53 | D2-D13 | every Port | A0-A11 | USB, Ethernet shield, WiFi |
| Arduino Nano ESP32 | **3.3 V** | D0-D13 | every Port | every Port | A0-A7 | USB, WiFi |
| Adafruit Grand Central M4 | **3.3 V** | D0-D53 | most Ports (Adafruit's list) | D0-D3, D6, D7, D14-D19, D23, D28, D32, D33 | A0-A15 (A0-A7 = pin 67-74, A8-A15 = pin 54-61) | USB, Ethernet shield |
| Adafruit Feather M0 (WiFi) | **3.3 V** | D0, D1, D5, D6, D9-D13 | D5, D6, D9-D13 | every Port | A0-A5 | USB, WiFi (Feather M0 WiFi only) |
| ESP32 | **3.3 V** | GPIO 2, 4, 5, 12-19, 21-23, 25-27, 32-36, 39 | every output Port | every Port | A0, A3-A7 (GPIO 36, 39, 32-35) | USB, Ethernet (ESP32 with a jack), WiFi |
| ESP8266 (NodeMCU, Wemos D1) | **3.3 V** | GPIO 0, 2, 4, 5, 12-16 | every Port but GPIO16 | every Port but GPIO16 | A0 | USB, WiFi |
| Arduino Opta (Lite, RS485 or WiFi) | **24 V** supply | Relay 1-4, I1-I8 | Relay 1-4 (one warning: see below) | I1-I8 (slow pulses) | I1-I8 (0-10 V) | USB, Ethernet (built in), WiFi (Opta WiFi only) |
| Raspberry Pi | **3.3 V** | GPIO 2-27 | every Port (hardware PWM: GPIO 12, 13, 18, 19) | every Port | none (use an ADS1115) | Ethernet, WiFi |

- **The Port list offers only the Ports the board has.** A Port the board does not have is refused. On an ESP32, GPIO 6-11 are the board's own memory and are never offered, and GPIO 34, 35, 36 and 39 can only read (inputs), so an output can't use them.
- **Start-up pins come last.** On an ESP32 (GPIO 2, 5, 12, 15) and an ESP8266 (GPIO 0, 2, 15) some Ports decide how the board starts. Skynet offers them last.
- **Uno R4: 8 mA per Port.** A Port of an Uno R4 gives at most 8 mA (an Uno R3 or a Mega gives 20 mA). Use a relay module or an SSR that has its own driver; never wire a bare relay coil or a bright LED straight to the Port.
- **Ethernet uses D10.** On a board connected by an Ethernet shield or module, D10 is the shield's and is not offered. On a Mega not on Ethernet, D10 is offered in orange with *Reserved for Ethernet: see Help*, and picking it gives one warning (Rule 6.10).
- **D4 is the SD card pin** of an Ethernet shield. On every board that takes a shield, D4 reads *SD card pin* and picking it gives one warning: **SD Card Not Supported. Never insert an SD Card!** (Rule 6.11)
- **Leonardo and Micro: A6-A11 are also D4, D6, D8, D9, D10, D12.** One pin, two names: a Device on A6 takes D4, so D4 is no longer offered (and the other way round).
- **Grand Central: one flow meter per interrupt.** Its 16 counter Ports each have their own interrupt, so every flow meter can run at once.
- **Nano ESP32:** D1 gives little current (a resistor is in its line), so it is offered last for outputs. A4-A7 can't read while the board's WiFi is on: on WiFi, picking one gives one warning.
- **ESP32: GPIO16 and GPIO17** are not free on a board with a WROVER module. They are offered last, and picking one gives one warning.
- **Arduino Opta:** a PLC that runs on 24 V. Its Ports go by name: **Relay 1-4** (Normally Open, at most 250 V AC and 10 A) and the inputs **I1-I8** (0-24 V digital or **0-10 V** analog, not 0-5 V). Every Device can go on it, as on a Mega: a relay takes any output and an input takes any reading. Only a reading on a relay is refused (a relay can't read). Like on a Mega, a probe or a heater needs something wired between it and the board, and Skynet gives **one warning** saying what:
  - **Temperature probes:** the Opta's inputs read 0-10 V, so most probes need an added circuit. The warning names it, by probe type:

    | Skynet probe | What to add on an Opta |
    |---|---|
    | 10K NTC (or other NTC) | An NTC temperature transmitter with a 0-10 V output (set it to your NTC: 10K, B 3950), wired to I1-I8 |
    | PT100 RTD | An **Opta Analog Expansion (A0602)**, which reads PT100 probes itself; or a PT100 transmitter with a 0-10 V output, wired to I1-I8 |
    | PT1000 RTD | A PT1000 transmitter with a 0-10 V output, wired to I1-I8 |
    | Thermocouple (K, J, T ...) | A thermocouple transmitter for your type with a 0-10 V output, wired to I1-I8 |
    | LM35, TMP36 | Nothing but a 5 V supply for the sensor: its output goes straight to I1-I8 (about 0.25 °C per step) |
    | DS18B20 (OneWire) | The Opta has no OneWire: keep DS18B20 probes on a Mega (you can mix boards), or swap them for 10K NTC or PT100 probes with a transmitter. A DS18B20-to-RS485 module will work once Skynet has RS485 |

    Set the transmitter's range (for example 0-150 °C) on the transmitter.
  - **Heater control by PWM or Pseudo PWM:** fast switching wears a relay out. Use an SSR driven by an **Opta Digital Expansion with solid-state outputs (D1608S)**, or run the heater On/Off with Duty Cycle or Hysteresis.
  - **A stepper motor:** a stepper driver with its own controller (a relay can't give step pulses), or put the motor on a Mega.
  - **An ADS1115:** the Opta has no I2C pins for it; wire a 0-10 V sensor straight to I1-I8, or use the A0602.
  - **A relay** gives one warning with the electrical warning; **an Analog In** gives one 0-10 V warning.
  - Expansion modules plug into the Opta's side port. Skynet's Opta program and its support for expansion modules come later in the firmware plan.
- **Raspberry Pi:** the Pi makes PWM on every pin, but GPIO 12, 13, 18 and 19 have hardware PWM: they read *Best for True PWM: see Help*, in blue.

## 3.3 V boards

A 3.3 V board must never get 5 V on a Port: it can ruin the board. When you put one of these Devices on a Port of a 3.3 V board, Skynet shows **one warning**, then you decide:

1. **A Digital Input** (a switch, a float switch, a push button): wire it to 3.3 V, never 5 V. A switch goes between the Port and GND (the board's own pull-up), or use a level shifter.
2. **A 0-5 V analog sensor** (for example a pressure transducer): it puts more than 3.3 V on the Port. Use a voltage divider, a 3.3 V sensor, or an ADS1115 board.
3. **A relay** (a Digital Out or PWM output): many 5 V relay modules do not switch from a 3.3 V Port. Use a relay module made for a 3.3 V signal, or an SSR (most switch from 3 to 32 V).

**You can mix 5 V and 3.3 V boards.** Each board is its own Interface, and the warnings go by the board each Device is on: a Mega and a Grand Central in one brewery is fine.

## The program on the board

The Board list makes the Panel's Port lists right for each board. The Skynet program on the board (its firmware) is written and tested for the **Arduino Mega 2560**. The program for the other boards is the next step of the Skynet firmware plan: one shared program, written with every board in this list in mind.

The **Arduino Opta** is in the list so you can plan its Ports now. Its own program comes later in the Skynet firmware plan (after the Mega and the Grand Central).
