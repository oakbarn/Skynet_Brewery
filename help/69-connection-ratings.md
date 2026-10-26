# Connection ratings

Each board (Interface) on the **Devices** page shows a **connection rating**: how safe its link to the Brain (the Pi or mini PC) is. USB is a cable straight to the Brain. Ethernet and WiFi depend on your network. On every link the board turns all outputs OFF if it hears nothing from the Brain for its **lost link delay** (see below).

## Arduino Mega (and other Arduino-type boards)

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best**: safest, most reliable |
| 2 | Ethernet (W5500 / W5100 shield, or an ESP32 Ethernet bridge) | **OK**: depends on the network. If the network fails the board turns all outputs OFF after the lost link delay |
| 3 | WiFi (through an ESP32 bridge) | **Poor**: WiFi can drop often |

## ESP32

| Rank | Type | Rating |
|---|---|---|
| 1 | USB | **Best** |
| 2 | Ethernet | **Good** |
| 2 | WiFi | **Good**, as long as no heating Device is on it |

## Heating Devices

A heating Device is an electric element, a burner gas valve or igniter, a heat pad, or the output of a PID, Hysteresis or Duty Cycle. You **can** put one on an Ethernet or WiFi board, but the panel warns you when you save it, and that board's **Connection** shows ⚠ with the heating Devices named. On WiFi an ESP32's rating drops to **Poor**. USB is safest.

## Lost link delay

Each board has its own **Lost link: all OFF after** box on the **Devices** page (Admin). If the board hears nothing from the Brain for that many seconds, it turns **all its outputs OFF** (heaters, pumps, valves, motors). It is 10 seconds unless you change it, and can be 3 to 600 seconds. The Brain talks to every board every 2 seconds, so a short delay reacts fast but may trip on a brief network hiccup; a long one rides out hiccups but leaves a heater on longer. For a heating Device on a network board, keep it short.

The board gets the delay each time it connects, so a change takes effect right away. Boards need the new sketch (firmware 0.4) for this; older firmware keeps 10 seconds.

## Picking the board

When you add an Interface, pick its **Board** and **Type**; the rating shows next to them. For an Interface added before, pick its board in the **Board** column (a name with "ESP" in it is taken to be an ESP32, anything else a Mega). A BruControl import takes the board from BruControl.
