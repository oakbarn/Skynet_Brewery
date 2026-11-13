# MQTT et la voix (Alexa, Google Home, Siri) {#mqtt-and-voice-alexa-google-home-siri}

**Settings > MQTT and voice** (Admin) relie le panel à un **broker MQTT**, un petit programme de messages comme Mosquitto sur le Raspberry Pi. Les cartes ESP32, les prises Tasmota, Node-RED et **Home Assistant** peuvent alors lire et changer des valeurs. Home Assistant relie le panel à **Alexa**, **Google Home** et **Apple Home (Siri)**, pour que vous puissiez demander « Alexa, what is the Kettle temperature? » (quelle est la température de la cuve ?).

## L'activer {#turn-it-on}

1. Installez Mosquitto sur le Pi (les étapes sont dans `docs/MQTT_AND_VOICE.md` dans le dossier du panel).
2. Dans **Settings > MQTT and voice**, cochez **Turn on MQTT**, tapez le **Broker address** (`localhost` quand Mosquitto tourne sur le Pi), et le nom d'utilisateur et le mot de passe si vous en avez mis un.
3. Laissez **Announce to Home Assistant** coché si vous voulez la commande vocale.
4. Touchez **Save MQTT and voice**. La ligne d'état indique s'il est connecté.

## Ce qu'il a le droit de faire {#what-it-may-do}

**.API est le seul interrupteur** pour l'API web, MQTT et la voix. Réglez-le dans les Properties de chaque Device ou Widget (sa case **Database and .API**) :

| .API | MQTT et la voix |
|---|---|
| **Off** (au départ) | Pas partagé |
| **Read Only** | Le lisent (un assistant vocal l'entend) |
| **Read & Control** | Le lisent et le changent |

Les entrées matérielles et les températures sont toujours en lecture seule, et un gGlobal n'est jamais partagé (il n'a pas de .API). Une alarme partagée peut toujours être coupée, et chaque Process peut toujours être arrêté. La page de réglages liste chaque élément partagé avec son .API, et les Processes que la voix et MQTT ont le droit de lancer (cochez-les là).

Le guide complet, avec la liste des sujets (topics) et la configuration d'Alexa, est `docs/MQTT_AND_VOICE.md`.
