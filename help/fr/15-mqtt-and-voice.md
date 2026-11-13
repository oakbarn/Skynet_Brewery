# MQTT et la voix (Alexa, Google Home, Siri) {#mqtt-and-voice-alexa-google-home-siri}

**Settings > MQTT and voice** (Admin) relie le panel à un **broker MQTT**, un petit programme de messages comme Mosquitto sur le Raspberry Pi. Les cartes ESP32, les prises Tasmota, Node-RED et **Home Assistant** peuvent alors lire et changer des valeurs. Home Assistant relie le panel à **Alexa**, **Google Home** et **Apple Home (Siri)**, pour que vous puissiez demander « Alexa, what is the Kettle temperature? » (quelle est la température de la cuve ?).

## L'activer {#turn-it-on}

1. Installez Mosquitto sur le Pi (les étapes sont dans `docs/MQTT_AND_VOICE.md` dans le dossier du panel).
2. Dans **Settings > MQTT and voice**, cochez **Turn on MQTT**, tapez le **Broker address** (`localhost` quand Mosquitto tourne sur le Pi), et le nom d'utilisateur et le mot de passe si vous en avez mis un.
3. Laissez **Announce to Home Assistant** coché si vous voulez la commande vocale.
4. Touchez **Save MQTT and voice**. La ligne d'état indique s'il est connecté.

## Ce qu'il a le droit de faire {#what-it-may-do}

| Toujours permis | Permis par défaut | Éteint tant que vous ne le cochez pas |
|---|---|---|
| Lire des valeurs, faire taire les alarmes, arrêter des Processes | Changer les gGlobals dont le .API est Get and Put et qui ne sont pas en lecture seule (comme l'API web) | Commuter des sorties (chauffe, brûleurs, pompes, vannes), commander les minuteries, lancer des Processes |

Les entrées matérielles et les températures sont en lecture seule, et un gGlobal dont le .API est Off n'est jamais partagé. Le tableau de la page de réglages a **Voice can hear it** (la voix peut l'entendre) et **Can change it** (peut le changer) pour chaque élément, et une liste des Processes que la voix et MQTT ont le droit de lancer.

Le guide complet, avec la liste des sujets (topics) et la configuration d'Alexa, est `docs/MQTT_AND_VOICE.md`.
