# MQTT and voice (Alexa, Google Home, Siri)

**Settings > MQTT and voice** (admin) connects the panel to an **MQTT broker**, a small message program such as Mosquitto on the Raspberry Pi. ESP32 boards, Tasmota plugs, Node-RED and **Home Assistant** can then read and change values. Home Assistant links the panel to **Alexa**, **Google Home** and **Apple Home (Siri)**, so you can ask "Alexa, what is the Kettle temperature?"

## Turn it on

1. Install Mosquitto on the Pi (steps in `docs/MQTT_AND_VOICE.md` in the panel folder).
2. In **Settings > MQTT and voice**, tick **Turn on MQTT**, type the **Broker address** (`localhost` when Mosquitto runs on the Pi), and the user name and password if you set one.
3. Leave **Announce to Home Assistant** ticked if you want voice control.
4. Tap **Save MQTT and voice**. The status line shows whether it is connected.

## What it may do

| Always allowed | Allowed by default | Off until you tick it |
|---|---|---|
| Reading values, silencing alarms, stopping Processes | Changing vAPI variables that are not read-only (same as the web API) | Switching outputs (heat, burners, pumps, valves), controlling timers, starting Processes |

Hardware inputs and temperatures are read only, and Shared variables are never shared. The table on the settings page has **Voice can hear it** and **Can change it** for each item, and a list of Processes that voice and MQTT may start.

The full guide, with the topic list and Alexa setup, is `docs/MQTT_AND_VOICE.md`.
