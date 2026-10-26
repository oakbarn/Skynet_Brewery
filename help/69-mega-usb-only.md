# Mega on USB only

For safety, **an Arduino Mega connects to the Brain (the Pi or mini PC) by USB only**. A Mega drives heaters, burners and pumps, so its link to the Brain is a cable, not a network address anyone on the network could reach.

- **Mega next to the Brain:** a USB cable. On the **Devices** page add it with Type **Arduino / ESP32 board (USB)**.
- **Mega away from the Brain:** wire it to an **ESP32 bridge** (Mega pins 18 and 19). The ESP32 talks to the Brain over Ethernet or WiFi. Add the ESP32 as **ESP32 on Ethernet** or **ESP32 (WiFi)**.
- There is **no Ethernet shield (W5500 / W5100) option** in the Mega sketch any more. Flash the Mega with the new sketch (firmware 0.4).
- On every link the board still turns all outputs OFF if it hears nothing from the Brain for 10 seconds.

## Older Schemas

A Schema made before this rule still loads. If an Interface on Ethernet has "Mega" in its name (and not "ESP"), its row on the **Devices** page says **⚠ A Mega must use USB**. Remove it and add it again as USB, or rename it if it really is an ESP32 bridging to a Mega. Adding a new Ethernet Interface named like a Mega asks you to check first.

## BruControl Schemas

When a BruControl Schema has an Arduino Mega on the network, the import sets it to USB with no port yet and says so in the import report. Pick its USB port on the **Devices** page.
