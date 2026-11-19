# Connection ratings

Each board (Interface) on the **Devices** page shows a **connection rating**: how safe its link to the Brain (the Pi or mini PC) is. USB is a cable straight to the Brain. Ethernet and WiFi depend on your network. On every link the board turns all outputs OFF if it hears nothing from the Brain for its **Lost Comm** time (see below).

## Arduino Mega

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best**: safest, most reliable |
| 2 | Ethernet (W5500 / W5100 shield, or an ESP32 Ethernet bridge) | **OK**: depends on the network. If the network fails the board turns all outputs OFF after its Lost Comm time |
| 3 | WiFi (through an ESP32 bridge) | **Poor**: WiFi can drop often |

## ESP32

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best** |
| 2 | Ethernet | **Good** |
| 2 | WiFi | **Good**, as long as no heating Device is on it |

## Other boards

An Arduino-type board (Uno, Nano, Leonardo, Micro, Due, Grand Central and the others) is rated like the **Arduino Mega**. A board with WiFi built in (GIGA, Nano ESP32, Uno R4 WiFi, Feather M0 WiFi, ESP8266) is rated like the **ESP32**: its built-in WiFi is **Good**, as long as no heating Device is on it.

## Heating Devices

A heating Device is an electric element, a burner gas valve or igniter, a heat pad, or the output of a PID, Hysteresis or Duty Cycle. You **can** put one on an Ethernet or WiFi board, but the panel warns you when you save it, and that board's **Rating** shows ⚠ with the heating Devices named. On WiFi an ESP32's rating drops to **Poor**. USB is safest.

## Lost Comm

Each board has its own **Lost Comm** box on the **Devices** page and in its Interface pop-up (Admin). If the board hears nothing from the Brain for that many seconds, it turns **all its outputs OFF** (heaters, pumps, valves, motors). It is 10 seconds unless you change it, and can be 3 to 600 seconds. The Brain talks to every board every 2 seconds, so a short delay reacts fast but may trip on a brief network hiccup; a long one rides out hiccups but leaves a heater on longer. For a heating Device on a network board, keep it short.

The board gets the delay each time it connects, so a change takes effect right away. Boards need the new sketch (firmware 0.4) for this; older firmware keeps 10 seconds.

## Picking the board

When you add an Interface, pick its **Board** (the Arduino Mega, another Arduino board, an ESP32 or a Raspberry Pi; see [Skynet Boards](206-skynet-boards)) and its **Connection**; the choices follow the Board, and the Connection's Hover Help gives its rating. A board with no Board picked yet shows **(pick the board)**: pick it in the **Board** column or in the Interface pop-up.

## Pin 10 on an Ethernet Mega

The Ethernet shield on an Arduino Mega uses **pin D10** (Skynet Rule 6.10). So:

- On a Mega on **Ethernet**, no Device can use pin D10. The pin list doesn't offer it, and typing it in is refused.
- A Mega Interface **can't be changed from USB to Ethernet** while a Device is on pin D10 (for example by removing it and adding it again as Ethernet, or by switching from the simulator to a real Ethernet board). The panel names the Device and asks you to move it, **and its wiring**, to another free pin first. Once pin 10 is free, the change goes through.
- On USB, pin D10 is a normal PWM pin.

## SD cards: not supported

Pin **D4** is the SD card pin of the Ethernet shield (Skynet Rule 6.11). **SD Card Not Supported. Never insert an SD Card!**

- You can still use D4 for a Device on a Mega, but the panel warns you first. Press **OK** to use it anyway or **Cancel** to pick another pin. In the pin list D4 is tagged **SD card pin**.
- The Ethernet sketch (firmware 0.5) keeps the SD slot switched off and checks it every 10 seconds. If a card is in the slot, every open panel shows **"SD Card Not Supported. Remove the SD Card!"** and the board's row on the **Devices** page shows it in red until the card is out.

