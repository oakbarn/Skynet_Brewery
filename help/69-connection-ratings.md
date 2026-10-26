# Connection ratings

Each board (Interface) on the **Devices** page shows a **connection rating**: how safe its link to the Brain (the Pi or mini PC) is. USB is a cable straight to the Brain. Ethernet and WiFi depend on your network. On every link the board turns all outputs OFF if it hears nothing from the Brain for 10 seconds.

## Arduino Mega (and other Arduino-type boards)

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best**: safest, most reliable |
| 2 | Ethernet (W5500 / W5100 shield, or an ESP32 Ethernet bridge) | **OK**: depends on the network. If the network fails the board turns all outputs OFF after 10 s |
| 3 | WiFi (through an ESP32 bridge) | **Poor**: WiFi can drop often |

## ESP32

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best** |
| 2 | Ethernet | **Good** |
| 2 | WiFi | **Good**, as long as no heating Device is on it |

## Heating Devices

A heating Device is an electric element, a burner gas valve or igniter, a heat pad, or the output of a PID, Hysteresis or Duty Cycle. **A heating Device can't be put on a WiFi board.** The panel says so when you try.

A Schema made before this rule still loads. If it has a heating Device on a WiFi board, that board's rating shows **⚠ Poor** and names the Devices. Move them to a USB or Ethernet board.

## Picking the board

When you add an Interface, pick its **Board** and **Type**; the rating shows next to them. For an Interface added before, pick its board in the **Board** column (a name with "ESP" in it is taken to be an ESP32, anything else a Mega). A BruControl import takes the board from BruControl.
