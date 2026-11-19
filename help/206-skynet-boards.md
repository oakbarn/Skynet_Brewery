# Skynet Boards

A **board** (an **Interface**) is the Arduino, ESP or Raspberry Pi your Devices are wired to. You pick it in **➕ Add Interface > Board**. Skynet then sets the rest from the board: its **Connection** choices and its **Ports** (IO Pins), with the right PWM, counter, analog and bus Ports for that board.

**Skynet is planned and wired for the Arduino Mega 2560** (a 5 V board). Every other board in the list can be used too. A board must be On and talking to the Brain to do anything.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

## The boards

| Board | Volts | Ports (IO Pins) | True PWM Ports | Counter Ports (flow meters) | Analog Ports | Connection |
|---|---|---|---|---|---|---|
| **Arduino Mega 2560** (the standard) | 5 V | D2-D53 | D2-D13, D44-D46 | D2, D3, D18-D21 | A0-A15 (pin 54-69) | USB, Ethernet shield, WiFi through an ESP32 bridge |
| Arduino Uno R3 | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A5 | USB, Ethernet shield |
| Arduino Uno R4 (Minima or WiFi) | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A5 | USB, Ethernet shield, WiFi (R4 WiFi only) |
| Arduino Nano | 5 V | D2-D13 | D3, D5, D6, D9, D10, D11 | D2, D3 | A0-A7 | USB, Ethernet module |
| Arduino Nano Every | 5 V | D0-D13 | D3, D5, D6, D9, D10 | every Port | A0-A7 | USB, Ethernet module |
| Arduino Leonardo | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A5 | USB, Ethernet shield |
| Arduino Micro | 5 V | D0-D13 | D3, D5, D6, D9, D10, D11, D13 | D0-D3, D7 | A0-A5 | USB, Ethernet module |
| Arduino Due | **3.3 V** | D2-D53 | D2-D13 | every Port | A0-A11 | USB, Ethernet shield |
| Arduino GIGA R1 WiFi | **3.3 V** | D0-D53 | D2-D13 | every Port | A0-A11 | USB, Ethernet shield, WiFi |
| Arduino Nano ESP32 | **3.3 V** | D0-D13 | every Port | every Port | A0-A7 | USB, WiFi |
| Adafruit Grand Central M4 | **3.3 V** | D0-D53 | most Ports (Adafruit's list) | D2, D3, D18, D19 | A0-A15 (A0-A7 = pin 67-74, A8-A15 = pin 54-61) | USB, Ethernet shield |
| Adafruit Feather M0 (WiFi) | **3.3 V** | D0, D1, D5, D6, D9-D13 | D5, D6, D9-D13 | every Port | A0-A5 | USB, WiFi (Feather M0 WiFi only) |
| ESP32 | **3.3 V** | GPIO 2, 4, 5, 12-19, 21-23, 25-27, 32-36, 39 | every output Port | every Port | A0, A3-A7 (GPIO 36, 39, 32-35) | USB, Ethernet (ESP32 with a jack), WiFi |
| ESP8266 (NodeMCU, Wemos D1) | **3.3 V** | GPIO 0, 2, 4, 5, 12-16 | every Port but GPIO16 | every Port but GPIO16 | A0 | USB, WiFi |
| Raspberry Pi | **3.3 V** | GPIO 2-27 | every Port | every Port | none (use an ADS1115) | Ethernet, WiFi |

- **The Port list offers only the Ports the board has.** A Port the board does not have is refused. On an ESP32, GPIO 6-11 are the board's own memory and are never offered, and GPIO 34, 35, 36 and 39 can only read (inputs), so an output can't use them.
- **Start-up pins come last.** On an ESP32 (GPIO 2, 5, 12, 15) and an ESP8266 (GPIO 0, 2, 15) some Ports decide how the board starts. Skynet offers them last.
- **Ethernet uses D10.** On every board with an Ethernet shield or module, D10 is the shield's and is not offered (Rule 6.10).

## 3.3 V boards

A 3.3 V board must never get 5 V on a Port: it can ruin the board. When you put one of these Devices on a Port of a 3.3 V board, Skynet shows **one warning**, then you decide:

1. **A Digital Input** (a switch, a float switch, a push button): wire it to 3.3 V, never 5 V. A switch goes between the Port and GND (the board's own pull-up), or use a level shifter.
2. **A 0-5 V analog sensor** (for example a pressure transducer): it puts more than 3.3 V on the Port. Use a voltage divider, a 3.3 V sensor, or an ADS1115 board.
3. **A relay** (a Digital Out or PWM output): many 5 V relay modules do not switch from a 3.3 V Port. Use a relay module made for a 3.3 V signal, or an SSR (most switch from 3 to 32 V).

**You can mix 5 V and 3.3 V boards.** Each board is its own Interface, and the warnings go by the board each Device is on: a Mega and a Grand Central in one brewery is fine.

## The program on the board

The Board list makes the Panel's Port lists right for each board. The Skynet program on the board (its firmware) is written and tested for the **Arduino Mega 2560**. The program for the other boards is the next step of the Skynet firmware plan: one shared program, written with every board in this list in mind.

The **Arduino Opta** (a PLC with relay outputs and 0-10 V inputs) is not in the list yet: it needs its own program first.
