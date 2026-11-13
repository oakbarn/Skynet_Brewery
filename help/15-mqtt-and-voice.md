# MQTT and voice (Alexa, Google Home, Siri)

**Settings > MQTT and voice** (admin) connects the panel to an **MQTT broker**, a small message program such as Mosquitto on the Raspberry Pi. ESP32 boards, Tasmota plugs, Node-RED and **Home Assistant** can then read and change values. Home Assistant links the panel to **Alexa**, **Google Home** and **Apple Home (Siri)**, so you can ask "Alexa, what is the Kettle temperature?"

## Turn it on

1. Install Mosquitto on the Pi (steps in `docs/MQTT_AND_VOICE.md` in the panel folder).
2. In **Settings > MQTT and voice**, tick **Turn on MQTT**, type the **Broker address** (`localhost` when Mosquitto runs on the Pi), and the user name and password if you set one.
3. Leave **Announce to Home Assistant** ticked if you want voice control.
4. Tap **Save MQTT and voice**. The status line shows whether it is connected.

## What it may do

**.API is the one switch** for the web API, MQTT and voice. Set it in each Device's or Widget's Properties (its **Database and .API** box):

| .API | MQTT and voice |
|---|---|
| **Off** (the start) | Not shared |
| **Read Only** | Read it (a voice assistant hears it) |
| **Read & Control** | Read it and change it |

Hardware inputs and temperatures are always read only, and a gGlobal is never shared (it has no .API). A shared alarm can always be silenced, and every Process can always be stopped. The settings page lists every shared item with its .API, and the Processes that voice and MQTT may start (tick them there).

The full guide, with the topic list and Alexa setup, is `docs/MQTT_AND_VOICE.md`.
