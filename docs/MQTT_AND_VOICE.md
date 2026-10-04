# MQTT and voice control

The Brew Panel can share its Globals and Devices over **MQTT**. MQTT is a small "message board" program (a *broker*) that many brewing and home gadgets understand: ESP32 boards, Tasmota smart plugs, Node-RED and Home Assistant.

Through **Home Assistant** you can then use your voice with **Google Home, Alexa and Siri** (Apple Home).

```
 ESP32 / Tasmota / Node-RED ─┐
                             ├──>  Mosquitto (broker, on the Pi)  <──>  Brew Panel
 Home Assistant ─────────────┘
       │
       ├── Google Home  ("Hey Google, what is the Kettle temperature?")
       ├── Alexa        ("Alexa, what is the HLT temperature?")
       └── Apple Home   ("Hey Siri, is the Red Pump on?")
```

## 1. Install Mosquitto on the Raspberry Pi

Open a terminal on the Pi (or connect with `ssh`) and type these lines one at a time.

```
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
```

Make a user name and password for the broker. Replace `brewer` with any name you like; it asks for the password twice:

```
sudo mosquitto_passwd -c /etc/mosquitto/passwd brewer
sudo chown root:mosquitto /etc/mosquitto/passwd
sudo chmod 640 /etc/mosquitto/passwd
```

Tell Mosquitto to accept connections from your home network, with that password:

```
sudo nano /etc/mosquitto/conf.d/brewpanel.conf
```

Type these three lines, then press Ctrl+O, Enter, Ctrl+X to save:

```
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
```

Start it now and every time the Pi starts:

```
sudo systemctl enable mosquitto
sudo systemctl restart mosquitto
```

**Check it works.** Open two terminals. In the first type
`mosquitto_sub -u brewer -P YOURPASSWORD -t test`
and in the second
`mosquitto_pub -u brewer -P YOURPASSWORD -t test -m hello`.
The first one shows `hello`.

> Do not open port 1883 on your internet router. For access away from home, use Tailscale like the panel itself.

## 2. Turn on MQTT in the Brew Panel

1. Go to **Settings**, scroll to **MQTT and voice**.
2. Tick **Turn on MQTT**.
3. **Broker address**: `localhost` when Mosquitto runs on the same Pi as the panel. Otherwise the Pi's address, for example `192.168.1.50`.
4. **Port**: leave empty (1883).
5. **User name / Password**: the ones you made above.
6. **Save MQTT and voice.** The status line turns green: *Connected to localhost:1883*.

The password is stored in `config/brewery.json` on the Pi and is never sent to a browser.

## 3. What is shared

Everything uses the **Topic name** from Settings (default `brewpanel`).

| Topic | What it is |
|---|---|
| `brewpanel/status` | `online` or `offline` (the broker sets offline if the panel stops) |
| `brewpanel/state/<name>` | The value of a Global or Device. On/off things are `ON` / `OFF`. Timers are `hh:mm:ss`. |
| `brewpanel/state/<timer>/running` | `ON` while a timer runs |
| `brewpanel/scripts/running` | Names of the running scripts, or `none` |
| `brewpanel/set/<name>` | Send a value here to change a Global or Device (see the safety rules) |
| `brewpanel/cmd/stopall` | Stops all scripts |
| `brewpanel/cmd/script/<script>/start` or `/stop` | Start or stop one script |
| `brewpanel/cmd/timer/<timer>/start`, `/stop`, `/reset` | Control a timer |

Values are kept on the broker ("retained"), so a gadget that connects later gets the latest value straight away. **Shared variables are never shared**, the same as the web API.

Example from any computer with `mosquitto-clients`:

```
mosquitto_sub -h 192.168.1.50 -u brewer -P YOURPASSWORD -t 'brewpanel/#' -v
mosquitto_pub -h 192.168.1.50 -u brewer -P YOURPASSWORD -t brewpanel/set/gblVBoilTime_Minutes -m 75
```

## 4. Safety: what MQTT and voice may change

The table in **Settings > MQTT and voice** has two ticks per element.

* **Voice can hear it**: Home Assistant (and so Google, Alexa and Siri) gets this element.
* **Can change it**: MQTT and voice may change it.

Out of the box:

| Always allowed | Allowed until you untick it | Not allowed until you tick it |
|---|---|---|
| Reading every shared value | Changing Globals that are not read-only (same as the web API) | Turning outputs and switches on or off (heaters, burners, pumps, valves) |
| Silencing an alarm | | Starting, stopping or resetting a timer |
| Stopping scripts | | Starting a script (list under the table) |

Temperatures and other hardware inputs can never be changed from outside. A refused change is written to the panel's console with the reason.

Think twice before ticking a heater or burner: a voice assistant can mishear, and a smart speaker in another room can be talked to by anyone in the house.

## 5. Voice: Home Assistant

Google Home, Alexa and Siri do not talk MQTT themselves. **Home Assistant** sits in the middle and links to all three. It is free and runs on its own Raspberry Pi, a spare PC, or a small box like the Home Assistant Green. (It can run on the same Pi 4 as the panel with Docker, but a separate one is simpler.)

1. Install Home Assistant: <https://www.home-assistant.io/installation/>.
2. In Home Assistant: **Settings > Devices & services > Add integration > MQTT**. Enter the Brew Panel Pi's address, port 1883, and the broker user name and password.
3. In the Brew Panel, keep **Announce to Home Assistant** ticked and save. A device named after your panel title (for example *OakBarn Brew Panel*) appears in Home Assistant by itself, with:
   * temperatures as sensors,
   * outputs as on/off status, or as switches if **Can change it** is ticked,
   * timers as sensors (plus Start / Stop / Reset buttons if allowed),
   * alarms as problem sensors plus a **Silence** button,
   * **Running scripts**, **Stop all scripts**, and a **Start** button for each script you allowed,
   * read-only Globals such as your message panel or *Script status*, and any Global you tick.

Name things the way you will say them: the **Display name** of each element becomes its name in Home Assistant and on your speakers.

### Google Home and Alexa

Pick one way:

* **Home Assistant Cloud (Nabu Casa)**, a paid subscription: **Settings > Home Assistant Cloud**, sign in, turn on Google Assistant and/or Alexa, and choose which Brew Panel items to expose. Then link "Home Assistant Cloud" in the Google Home app or the Alexa app. This is the easy way.
* **Free, manual setup**: Home Assistant's own guides for *Google Assistant* and *Amazon Alexa Smart Home Skill*. These need a developer account and a web address for your Home Assistant, and take an evening.

### Siri (Apple Home)

In Home Assistant add the **HomeKit Bridge** integration, choose the Brew Panel items, and scan the code it shows with the Home app on your iPhone. Then "Hey Siri, what is the HLT temperature?" works, on the iPhone, iPad, Apple Watch and HomePod.

Siri Shortcuts can also call the panel's web API directly without Home Assistant: a Shortcut with **Get Contents of URL** `http://<pi address>:8080/api/globals/<name>` reads a Global, and **Speak Text** reads it out.

### What you can say

Exact words depend on the assistant, but for example:

* "Hey Google, what is the Kettle temperature?"
* "Alexa, is the Red Pump on?"
* "Hey Siri, what is the Whirlpool timer?"
* "Hey Google, press Stop all scripts." / "Alexa, turn on Silence Hop alarm."

Some assistants are shy about reading sensors that are not temperatures; Home Assistant's own Assist app (on the phone) can answer any of them.
