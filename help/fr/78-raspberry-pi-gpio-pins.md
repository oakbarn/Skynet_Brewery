# Broches GPIO du Raspberry Pi {#raspberry-pi-gpio-pins}

Les propres broches d'un Raspberry Pi peuvent être une **Interface**, tout comme un Arduino Mega : relais, SSR, pompes, vannes, interrupteurs, sondes DS18B20, cartes RTD et thermocouple, débitmètres, un ADS1115 et des capteurs de poids. Ce peut être le Brain lui-même, ou un second Pi près du poste de brassage. Un petit programme sur le Pi (**Skynet Pi GPIO**) parle au panel dans la même langue que le Mega, donc les Processes et les Tabs marchent de la même façon.

## L'installer sur le Pi {#install-it-on-the-pi}

1. Copiez le dossier `firmware/Pi_GPIO` sur le Pi (il vient avec le panel).
2. Ouvrez un terminal dans ce dossier et lancez `sudo bash install.sh`. Il installe ce qu'il faut, active SPI, I2C et 1-Wire, et démarre le programme. Il redémarre tout seul après chaque redémarrage.
3. Redémarrez le Pi une fois (`sudo reboot`) la première fois.

## L'ajouter dans le panel {#add-it-in-the-panel}

Page **Devices** > **Add Interface** :

- **Board** : Raspberry Pi (its own GPIO pins)
- **Type** : Ethernet
- **Network address** : `127.0.0.1` quand ce Pi **est** le Brain, ou l'adresse de l'autre Pi (par exemple `192.168.1.70`)

| Où est le Pi | Note de connexion |
|---|---|
| Le Brain lui-même (adresse 127.0.0.1) | **Best** : rien ne passe par le réseau |
| Un autre Pi en Ethernet | **Good** |
| Un autre Pi en WiFi | **OK** (**Poor** avec un Device de chauffe dessus) |

## Broches {#pins}

Les broches sont des **numéros GPIO** (aussi appelés numéros BCM), **GPIO 2 à GPIO 27**, pas les positions 1-40 sur le connecteur. La liste des broches les montre comme GPIO17, etc. ; taper `17` ou `GPIO17` revient au même.

| GPIO | Gardée pour |
|---|---|
| 4 | Sondes DS18B20 (1-Wire). Câblez une résistance de 4.7k du fil de données au 3.3 V. |
| 7, 8, 9, 10, 11 | SPI, pour les cartes RTD (MAX31865) et thermocouple. La sélection de puce (CS) de chaque carte va sur n'importe quelle autre GPIO libre. |
| 2, 3 | I2C, pour une carte analogique ADS1115 |

Toute autre GPIO peut être une sortie, une sortie PWM, une entrée ou un débitmètre : un Pi n'a pas de broches spéciales PWM ou compteur.

## Ce qu'un Pi ne peut pas faire {#what-a-pi-can-t-do}

- **Pas de broches analogiques.** Utilisez une carte ADS1115 pour les sondes de pression, de niveau, de pH et NTC, ou mettez-les sur un Mega.
- **Pas de moteurs pas à pas.** Un Pi ne peut pas cadencer les pas exactement. Mettez le moteur sur un Mega ou un ESP32.

Le panel les refuse sur une Interface Pi et dit pourquoi.

## Sécurité {#safety}

- **Lien perdu :** si le panel se tait pendant le délai de lien perdu de l'Interface (page Devices, 10 s sauf si vous le changez), le Pi met **toutes ses sorties sur OFF**. Il le fait aussi si le programme du panel s'arrête.
- **Au démarrage**, le Pi met sur OFF chaque broche de sortie qu'il a déjà utilisée, avant que le panel se connecte.
- **Les broches du Pi sont en 3.3 V** et ne supportent pas le 5 V. La plupart des cartes relais marchent, mais certaines cartes relais 5 V qui s'allument sur LOW ne s'éteignent pas tout à fait en 3.3 V. Choisissez des cartes relais 3.3 V, ou des cartes avec un cavalier JD-VCC. Ne câblez jamais directement la sortie d'un capteur 5 V sur une broche du Pi.

## Réglages (seulement si vous en avez besoin) {#settings-only-if-you-need-them}

`/opt/skynet-pi-gpio/settings.json` sur le Pi. Après un changement, lancez `sudo systemctl restart skynet-pi-gpio`.

| Réglage | Ce qu'il fait |
|---|---|
| `name` | Le nom affiché sur la page Devices |
| `relay_active_low` | `true` (comme le Mega) : ON met la broche à LOW, ce qui convient à la plupart des cartes relais. `false` pour les cartes qui s'allument sur HIGH. |
| `tc_chip` | `max31856` (tout type de thermocouple) ou `max31855` (type K seulement) |
| `hx711` | Capteurs de poids : les broches DT et SCK de chaque carte, par ex. `{"5": 6, "13": 19}`. Le Port de la balance est la broche DT. |
| `pins` | Vide = les GPIO 2-27 peuvent être utilisées ; ou une liste des seules broches permises, si un HAT en utilise certaines |
| `listen` | `0.0.0.0` (par défaut), ou `127.0.0.1` pour que seul le panel de ce même Pi puisse se connecter |

Voir aussi [Notes de connexion](69-connection-ratings).
