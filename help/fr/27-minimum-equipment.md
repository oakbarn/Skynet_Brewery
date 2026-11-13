# Équipement minimum et limites {#minimum-equipment-and-limitations}

Le plus petit système Skynet Brewery, c'est **1 Raspberry Pi + 1 Arduino Mega**. Vous pouvez le faire grandir jusqu'à **3 Megas et 2 ESP32** sur le même Pi. Les tableaux ci-dessous listent chaque système, combien de ports chaque carte vous donne, le minimum qu'il vous faut pour chaque type d'appareil (pompes, vannes, chauffe, température, poids, débit, densimètres et plus), et ce que le panel ne sait pas encore faire.

Sans aucun matériel, le panel tourne quand même sur un PC avec son simulateur intégré, donc vous pouvez construire des Tabs et des Processes avant que les cartes arrivent.

Les prix sont des prix approximatifs aux États-Unis (octobre 2026), pas un relevé de prix en direct. Les cartes clones coûtent moins cher et marchent pareil.

## Comment les pièces s'assemblent {#how-the-pieces-fit}

- Le **Raspberry Pi** est le Brain (le cerveau). Il fait tourner le panel et garde le Schema, les images, les sons et les Processes. Ses propres broches ne sont pas encore utilisées.
- Une **Arduino Mega** est le contrôleur. Tout ce qui chauffe, pompe, ouvre ou mesure est câblé à une Mega. Une Mega à côté du Pi s'y branche avec un câble USB.
- Un **ESP32** est un pont pour une Mega qui est loin du Pi (par exemple un panneau dans la brasserie pendant que le Pi est dans la maison). Il est câblé à cette Mega et parle au Pi par votre réseau. **Un ESP32 sert une seule Mega**, donc un système n'a jamais plus d'ESP32 que de Megas. L'ESP32 ne fait que transmettre les messages ; ses propres broches ne sont pas encore utilisées.

## Les systèmes {#the-systems}

| Système | Cartes | Megas en USB | Megas par un ESP32 | Prises USB du Pi utilisées (sur 4) |
|---|---|---|---|---|
| 1 (minimum) | 1 Pi + 1 Mega | 1 | 0 | 1 |
| 2 | 1 Pi + 1 Mega + 1 ESP32 | 0 | 1 | 0 |
| 3 | 1 Pi + 2 Megas | 2 | 0 | 2 |
| 4 | 1 Pi + 2 Megas + 1 ESP32 | 1 | 1 | 1 |
| 5 | 1 Pi + 2 Megas + 2 ESP32 | 0 | 2 | 0 |
| 6 | 1 Pi + 3 Megas | 3 | 0 | 3 |
| 7 | 1 Pi + 3 Megas + 1 ESP32 | 2 | 1 | 2 |
| 8 | 1 Pi + 3 Megas + 2 ESP32 | 1 | 2 | 1 |

## Les ports disponibles dans chaque système {#ports-available-in-each-system}

Les broches libres pour votre équipement, après celles dont le sketch Skynet a besoin pour sa propre liaison. Une Mega en USB garde les broches 0 et 1 pour l'USB. Une Mega derrière un ESP32 cède aussi les broches 18 et 19 pour la liaison ESP32, ce qui lui coûte 2 broches numériques et 2 broches de débitmètre.

| Système | Broches numériques (sorties ou entrées) | dont capables de PWM | dont capables de débitmètre | Entrées analogiques | Total des broches libres |
|---|---|---|---|---|---|
| 1 (1 Pi + 1 Mega) | 52 | 15 | 6 | 16 | 68 |
| 2 (1 Pi + 1 Mega + 1 ESP32) | 50 | 15 | 4 | 16 | 66 |
| 3 (1 Pi + 2 Megas) | 104 | 30 | 12 | 32 | 136 |
| 4 (1 Pi + 2 Megas + 1 ESP32) | 102 | 30 | 10 | 32 | 134 |
| 5 (1 Pi + 2 Megas + 2 ESP32) | 100 | 30 | 8 | 32 | 132 |
| 6 (1 Pi + 3 Megas) | 156 | 45 | 18 | 48 | 204 |
| 7 (1 Pi + 3 Megas + 1 ESP32) | 154 | 45 | 16 | 48 | 202 |
| 8 (1 Pi + 3 Megas + 2 ESP32) | 152 | 45 | 14 | 48 | 200 |

Les broches capables de PWM et de débitmètre font partie des broches numériques, elles ne s'y ajoutent pas. Les entrées analogiques peuvent aussi servir de broches numériques quand vous n'en avez pas besoin pour des capteurs.

## Les ports et leurs types sur chaque carte {#ports-and-types-on-each-board}

### Raspberry Pi 4 ou 5 (le Brain) {#raspberry-pi-4-or-5-the-brain}

| Port | Combien | Sert à |
|---|---|---|
| Prises USB-A | 4 (2 bleues rapides USB 3, 2 USB 2) | Les Megas en USB, une clé USB pour les fichiers. Un hub USB alimenté en ajoute. |
| Ethernet (gigabit) | 1 | Votre réseau domestique (le meilleur pour brasser) et les Megas ou ESP32 en Ethernet |
| WiFi et Bluetooth | intégrés | Votre réseau domestique s'il n'y a pas de câble ; les ESP32 en WiFi |
| Micro-HDMI | 2 | Un écran, seulement pour la configuration |
| USB-C | 1 | Alimentation seulement (alimentation officielle) |
| Connecteur GPIO | 40 broches | **Pas encore utilisé par le panel** |

### Arduino Mega 2560 (le contrôleur), avec le sketch Skynet {#arduino-mega-2560-the-controller-with-the-skynet-sketch}

| Type de port | Combien | Ce que vous branchez | Remarques |
|---|---|---|---|
| Broches numériques (D0-D53) | 54, dont 52 libres en USB (50 derrière un ESP32) | Relais (pompes, vannes, chauffe par SSR ou contacteurs), interrupteurs, interrupteurs à flotteur, boutons poussoirs | 5 V. N'importe quelle broche numérique libre peut être une sortie ou une entrée. |
| Broches PWM | 15 (D2-D13, D44-D46) | Vitesse de pompe, puissance de SSR 0-100 %, sorties analogiques (0-10 V ou 4-20 mA par un module convertisseur) | Font partie des broches numériques |
| Entrées analogiques (A0-A15) | 16 | Capteurs 0-5 V, transmetteurs de pression, capteurs 4-20 mA (résistance de 250 ohms), thermistances NTC, pH | 10 bits. Une carte ADS1115 ajoute 4 entrées plus fines en I2C. |
| Broches d'interruption | 6 (D2, D3, D18, D19, D20, D21) | Débitmètres à impulsions, jusqu'à 6 | D18 et D19 sont prises par une liaison ESP32 ; D20 et D21 par l'I2C s'il est utilisé |
| Bus OneWire | 1 broche (D40 par défaut) | Toutes les sondes de température DS18B20 sur un seul fil | Beaucoup de sondes le partagent ; une résistance de 4,7k. Le panel réserve D40 dès qu'une DS18B20 est configurée. |
| Bus SPI | D50, D51, D52 + 1 broche de sélection (chip-select) par carte | Cartes MAX31865 (PT100 / PT1000) et MAX31856 / MAX31855 (thermocouple) | Un shield Ethernet utilise aussi le SPI plus D4 et D10. Le panel réserve 50-52 dès qu'une sonde RTD ou un thermocouple est sur la carte (voir [Pins kept for RTD and OneWire probes](46-interface-tab-device-names)). |
| Bus I2C | D20 (SDA), D21 (SCL) | Carte analogique ADS1115 | |
| Ports série | 4 (Serial0 sur D0/D1 = USB, Serial1 sur D18/D19 = liaison ESP32, Serial2, Serial3 libres) | L'USB vers le Pi, ou le pont ESP32 | |
| Cellules de charge | 2 broches numériques par balance | Cartes HX711 (poids et volume des cuves) | |
| Moteurs pas à pas | jusqu'à 4, 2 à 4 broches chacun plus un contact d'origine | Cartes de commande pas à pas (A4988, DRV8825, TMC2209, TB6600, DM542, ULN2003) | |
| USB-B | 1 | Liaison vers le Pi, et chargement du sketch | |
| Prise d'alimentation | 1 | Alimentation 7-12 V quand elle n'est pas alimentée par l'USB | |

### ESP32 (le pont) {#esp32-the-bridge}

| Port | Combien | Sert à |
|---|---|---|
| WiFi | intégré | Liaison vers le Pi (modèles WiFi, par exemple ESP32 DevKit) |
| Ethernet | 1 sur les modèles Ethernet (WT32-ETH01, Olimex ESP32-POE) | Liaison vers le Pi. Le meilleur pour tout ce qui chauffe ou pompe. |
| Liaison série vers la Mega | 2 broches (GPIO17 TX, GPIO16 RX ; GPIO5 RX sur un WT32-ETH01) | Câblées aux broches 19 et 18 de la Mega. Le signal 5 V de la Mega passe par un diviseur de tension 1k/2k vers la broche 3,3 V de l'ESP32. |
| USB (micro-USB ou USB-C) | 1 | Alimentation (5 V) et chargement du sketch du pont |
| Autres broches GPIO | environ 20 à 25 | **Pas encore utilisées par le panel** |

## L'équipement par type d'appareil {#equipment-by-device-type}

Le minimum qu'il vous faut pour chaque type d'appareil que le panel gère, le port de la Mega qu'il utilise, et à peu près ce qu'il coûte. Ne prenez que les lignes que votre brasserie a.

### Sorties (ce que le panel commute) {#outputs-things-the-panel-switches}

| Appareil | Minimum à acheter | Port de la Mega utilisé | Prix approximatif | Remarques |
|---|---|---|---|---|
| Pompe (Riptide, Chugger) | La pompe + 1 voie de relais (carte 8 relais 5 V) | 1 broche numérique | 150-220 $ la pompe, 10-15 $ la carte relais | Les pompes sur secteur par un contacteur ou un relais de 10 A ou plus, sur un circuit protégé par un différentiel (GFCI) |
| Vanne à boisseau sphérique motorisée | La vanne (12 V, inox, câblage CR05 : reste en place, 1 relais) + alimentation 12 V | 1 broche numérique par vanne (le câblage CR02 en demande 2) | 25-45 $ chacune, 20-35 $ l'alimentation | |
| Électrovanne (eau) | Électrovanne 12 V + 1 voie de relais | 1 broche numérique | 10-25 $ | Pour les conduites d'eau, pas le moût chaud |
| Vanne proportionnelle ou vitesse de pompe | Une vanne ou un variateur (VFD) 0-10 V (ou 4-20 mA) + module PWM vers 0-10 V | 1 broche PWM | 5-15 $ le module | 0-100 % à l'écran |
| Élément chauffant électrique | SSR 25-40 A sur un dissipateur + contacteur bipolaire (commandé par un relais) | 1 broche PWM ou numérique pour le SSR, 1 broche numérique pour le contacteur | 20-45 $ le SSR, 20-40 $ le contacteur | Secteur : différentiel (GFCI) et vérification par un électricien |
| Brûleur à gaz | Électrovanne homologuée pour le gaz + une sécurité de flamme (allumeur et détecteur de flamme) | 1 broche numérique | 60-150 $ | La sécurité de flamme doit être câblée en dur ; le panel ne fait que demander de la chaleur |
| Lumières, buzzer, ventilateur | 1 voie de relais | 1 broche numérique | (carte relais) | |
| Moteur pas à pas (poignée de vanne, distributeur) | Moteur + carte de commande (28BYJ-48 + ULN2003, ou NEMA 17 + TMC2209 / A4988) + alimentation 12-24 V + contact d'origine | 2 à 4 broches + 1 pour le contact d'origine | 5-50 $ le moteur, 3-40 $ la carte | Jusqu'à 4 par Mega |

### Température {#temperature}

| Appareil | Minimum à acheter | Port de la Mega utilisé | Prix approximatif | Remarques |
|---|---|---|---|---|
| Sonde DS18B20 (la plus facile) | Sonde inox étanche + une résistance de 4,7k pour toutes | Bus OneWire (1 broche pour toutes les sondes) | 3-10 $ chacune | Beaucoup de sondes sur un seul fil |
| PT100 / PT1000 (la plus précise) | Sonde 3 fils dans un doigt de gant + 1 carte MAX31865 par sonde | SPI + 1 broche par sonde | 25-40 $ la sonde, 15 $ la carte | |
| Thermocouple (brûleurs, très chaud) | Sonde type K + 1 carte MAX31856 (tout type) ou MAX31855 (type K) par sonde | SPI + 1 broche par sonde | 10 $ la sonde, 15-20 $ la carte | |
| Thermistance NTC (la moins chère) | NTC 10k + résistance 10k | 1 entrée analogique | 2-5 $ | |

### Poids, débit, niveau et pression {#weight-flow-level-and-pressure}

| Appareil | Minimum à acheter | Port de la Mega utilisé | Prix approximatif | Remarques |
|---|---|---|---|---|
| Poids / volume de cuve | 1 carte HX711 + cellules de charge (un jeu de 4 avec une carte de jonction, ou 1 cellule en S dimensionnée pour la cuve pleine) | 2 broches numériques par balance | 10-20 $ (jeu de 4), 30-60 $ (en S) | Tare, étalonnage et tare automatique à vide |
| Débitmètre | Compteur à effet Hall : YF-S201 en plastique pour l'eau froide, inox de qualité alimentaire pour le moût chaud | 1 broche d'interruption | 10 $ le plastique, 30-60 $ l'inox | Jusqu'à 6 par Mega (4 derrière un ESP32) |
| Interrupteur à flotteur / de niveau | Interrupteur à flotteur inox | 1 broche numérique | 5-15 $ | |
| Détecteur de débit | Détecteur à palette ou à ampoule reed | 1 broche numérique | 10-25 $ | Protection de la pompe contre la marche à sec |
| Transmetteur de pression ou de niveau | Transducteur inox 0,5-4,5 V (1/4" NPT), ou un 4-20 mA + résistance de 250 ohms | 1 entrée analogique | 15-30 $ | Une carte ADS1115 donne des lectures plus fines |

### Autres capteurs et commandes {#other-sensors-and-controls}

| Appareil | Minimum à acheter | Port de la Mega utilisé | Prix approximatif | Remarques |
|---|---|---|---|---|
| pH | Sonde pH avec une carte amplificatrice (sortie 0-5 V) | 1 entrée analogique (ou ADS1115) | 30-60 $ | Étalonnage en deux points dans le panel |
| Capteur 0-10 V ou 4-20 mA | Le capteur + deux résistances de 10k (0-10 V) ou une de 250 ohms (4-20 mA) | 1 entrée analogique | moins de 1 $ en plus | |
| Boutons et interrupteurs du panneau | Bouton poussoir, commutateur | 1 broche numérique chacun | 3-20 $ | Modes push, toggle, pulse, verrouillé (latch) et compteur |
| Arrêt d'urgence | Bouton coup de poing | Câblé pour couper l'alimentation des sorties ; 1 broche numérique pour prévenir le panel | 10-20 $ | Doit couper l'alimentation tout seul, pas par le panel |
| Verrouillage (interlock) | Contact de porte ou de couvercle | 1 broche numérique | 3-10 $ | |

### Densimètres (la densité pendant la fermentation) {#hydrometers-gravity-during-fermentation}

**Le Hydrometer Device** (Règle Skynet 6.25, Help 170) a un Template pour chaque type. Comment chacun se connecte :

| Densimètre | Comment il communique | Ce qu'il lui faut | État |
|---|---|---|---|
| Tilt, Tilt Pro, Tilt Pro Mini | Bluetooth (envoie un signal toutes les quelques secondes) | Le Raspberry Pi a le Bluetooth intégré, donc il peut lire un Tilt directement sans carte en plus. Un ESP32 (par exemple avec TiltBridge) n'est nécessaire que quand le fermenteur est hors de portée Bluetooth du Pi (environ 3 à 9 m, moins à travers un réfrigérateur ou un fermenteur conique en acier). | Device et Templates faits ; la lecture Bluetooth est la prochaine étape |
| iSpindel, GravityMon, Floaty, BrewBrain Float | Wi-Fi : il envoie ses lectures à Skynet | Rien de plus : son réglage HTTP pointe vers le Brain | Marche |
| RAPT Pill | Bluetooth, ou le cloud RAPT | Le Bluetooth comme un Tilt, ou son propre cloud | Device fait ; la lecture vient avec le Bluetooth, puis le cloud |
| PLAATO | son cloud | sa clé Cloud | Device fait ; la lecture par le cloud plus tard |
| Réfractomètre, densimètre en verre | lu par une personne | la commande de Process `take_reading` | Marche |

Un Tilt n'a donc pas strictement besoin d'un ESP32 quand le Pi est le Brain, mais un ESP32 est une bonne idée quand les fermenteurs sont loin du Pi.

## Quoi acheter pour les cartes {#what-to-buy-for-the-boards}

| Article | Nécessaire pour | Prix approximatif |
|---|---|---|
| Raspberry Pi 5, 4 Go (ou un Pi 4 avec 2 Go ou plus) | chaque système, 1 | 60-80 $ |
| Alimentation officielle du Pi (Pi 5 : 27 W USB-C, Pi 4 : 15 W USB-C) | chaque système, 1 | 12-15 $ |
| Carte microSD, 32 Go ou plus, A1 ou A2 (SanDisk ou Samsung) | chaque système, 1 | 10-15 $ |
| Boîtier avec ventilateur | chaque système, 1 | 10-15 $ |
| Câble Ethernet vers votre box (ou utilisez le WiFi du Pi) | chaque système, 1 | 5-10 $ |
| Arduino Mega 2560 (clone ou d'origine) | 1 par Mega | 20 $ le clone, 50 $ l'originale |
| Câble de données USB-A vers USB-B, 1-2 m | 1 par Mega en USB | 5-8 $ |
| ESP32 avec Ethernet (WT32-ETH01 ou Olimex ESP32-POE), ou un ESP32 DevKit pour le WiFi | 1 par ESP32 | 15-25 $ (DevKit environ 10 $) |
| Résistances de 1k et 2k (diviseur de tension) | 1 paire par ESP32 | moins de 1 $ |
| Alimentation USB 5 V pour l'ESP32 | 1 par ESP32 | 8 $ |
| Câble Ethernet pour l'ESP32 (modèles Ethernet) | 1 par ESP32 | 5-10 $ |
| Hub USB alimenté | seulement s'il vous faut plus de 4 appareils USB | 20-35 $ |
| Pour démarrer sur l'établi : sonde DS18B20 + résistance de 4,7k, carte 8 relais + fils de liaison | premier système | 20-30 $ |
| Seulement pour la configuration : écran avec câble micro-HDMI, clavier et souris USB, lecteur de carte microSD | une fois | (à emprunter) |

Coût de base, sans capteurs ni sorties : environ **120-165 $ pour le Système 1**, plus environ 25-30 $ pour chaque Mega en USB en plus et environ 50-65 $ pour chaque Mega derrière un ESP32 (Mega, ESP32, son alimentation et son câble).

**Logiciels gratuits :** Raspberry Pi OS (64 bits), Node.js 22.13 ou plus récent, Arduino IDE (pour charger les sketches de la Mega et de l'ESP32), Tailscale (facultatif, pour hors de chez vous).

## Les limites aujourd'hui {#limitations-today}

- **Les broches du Pi et de l'ESP32 ne sont pas encore utilisées.** Toutes les entrées et sorties passent par une Mega. C'est pour cela qu'une Mega est obligatoire.
- **Pas encore testé sur du vrai matériel.** Tout a été testé avec le simulateur et un ESP32 simulé, pas avec une vraie Mega ni un vrai ESP32, et les sketches n'ont pas encore été compilés. Attendez-vous à quelques corrections quand la première vraie carte sera branchée.
- **Jusqu'à 3 Megas et 2 ESP32**, c'est ce que couvre cette page. Le panel lui-même ne fixe pas de limite de cartes ; plus de Megas demandent un hub USB alimenté ou plus d'ESP32.
- **Navigateurs :** testé dans Chrome et Edge. Safari (iPhone, Mac) et Firefox ne sont pas encore entièrement testés.
- **Disposition sur téléphone :** ça marche, mais les grands Tabs sont à l'étroit sur un écran de téléphone.
- **Pas encore de graphiques** sur la page Log (les données peuvent être téléchargées en fichier de tableur).
- **Les sons d'alarme** ne jouent que sur les écrans où **Enable sound** a été appuyé une fois (les navigateurs bloquent le son jusqu'à ce que vous cliquiez).
- **Le WiFi est le maillon le plus faible.** Utilisez l'USB ou l'Ethernet pour tout ce qui chauffe ou pompe. Sur chaque liaison, la carte éteint toutes les sorties si elle n'entend plus rien du Pi pendant son délai de perte de liaison (10 secondes si vous ne le changez pas ; voir [Connection ratings](69-connection-ratings)).
- **Un seul Brain à la fois.** Deux panels qui commandent les mêmes cartes se battent entre eux.
- **Hors de chez vous, seulement par Tailscale.** N'ouvrez jamais de port sur votre box pour le panel.
- **La carte microSD s'use** avec un enregistrement toute la journée. Un petit onduleur (batterie de secours) et, sur un Pi 5, un SSD à la place de la carte aident. Éteignez toujours le Pi avant de le débrancher.
- Les mises à jour gardent chaque connexion ; seul le choix **reset all users** ou **Start Fresh** du programme d'installation (confirmé) les supprime.
- **La sécurité du matériel passe en premier.** Le panel n'est pas un système de sécurité. Gardez des dispositifs de sécurité câblés en dur : un arrêt d'urgence, des interrupteurs à flotteur, une sécurité de flamme pour le brûleur, et un différentiel (GFCI) sur tout ce qui est sur secteur. Faites vérifier le câblage secteur par un électricien.

Voir aussi [Installing the panel](19-installing) et [Devices](03-devices).
