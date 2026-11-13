# Board settings et Board Talk {#board-settings-and-board-talk}

Chaque Interface (une carte à laquelle vos Devices sont câblés) a des **Board settings** (réglages de carte), et **Board Talk** montre chaque ligne que le Brain et la
carte s'envoient, en mots simples (Règle Skynet 6.27). Utilisez-les pour trouver ou corriger un problème de carte. Seul un admin peut les
changer.

## Board settings

Ouvrez la page **Devices** et cliquez sur **⚙ Change** sur l'Interface.

| Réglage | Ce qu'il fait |
|---|---|
| **On** | On : le panneau parle à cette carte. Off : le panneau ne l'ouvre jamais, et ses Devices apparaissent comme non connectés. |
| **Pause communications** | Le panneau arrête d'envoyer à la carte (seulement le PING « tu es là ? », pour que la carte garde ses sorties telles quelles) et n'utilise pas ce que dit la carte. Board Talk montre quand même chaque ligne. Le désactiver renvoie chaque réglage et chaque sortie, pour que la carte corresponde à l'écran. |
| **Answer wait (seconds)** | Si la carte ne dit rien pendant ce temps, la page Devices affiche **no answer**. 2 à 600 ; vide = 10. |
| **Diagnostic logging** | Chaque ligne vers et depuis la carte est écrite, avec des mots simples, dans un fichier par jour dans le dossier des données (`logs/boards`). Cela écrit beaucoup : désactivez-le quand le problème est trouvé. |
| **Baud (USB speed)** | Une carte USB seulement. Il doit être le même que le programme sur la carte ; les programmes de Skynet utilisent 115200. |
| **Network port** | Une carte en Ethernet ou WiFi seulement. Il doit être le même que le programme sur la carte ; les programmes de Skynet utilisent 4100. |

Le **Lost link delay** (sur la page Devices) est le temps que la carte attend sans nouvelles du Brain avant d'arrêter toutes
ses sorties.

## Board Talk

Sur la page **Devices**, cliquez sur **💬 Board Talk** sur l'Interface. Une fenêtre s'ouvre :

- **→** les lignes que le Brain envoie à la carte, **←** les lignes que la carte renvoie, chacune avec son heure et son sens en mots simples.
- **Hide PING** (activé au départ) cache la ligne « tu es là ? » envoyée toutes les 2 secondes.
- **⏸ Pause communications** / **▶ Talk again** fait la même chose que le réglage ci-dessus.
- Tapez une ligne dans la case et appuyez sur **Send** (ou Entrée) pour l'envoyer à la carte. Elle est envoyée même en pause. Par exemple `HELLO`
  demande à la carte qui elle est, et `DO 22 1` met la broche 22 sur ON. **Attention :** une ligne que vous envoyez met vraiment des choses en marche et à l'arrêt.

## Chaque ligne {#every-line}

| Ligne | Envoyée | Ce qu'elle veut dire |
|---|---|---|
| `HELLO` | Brain → carte | Bonjour : le Brain demande à la carte qui elle est. La carte répond HELLO avec son nom et la version de son programme, puis indique toutes ses entrées. |
| `HELLO <name> <program>` | carte → Brain | Bonjour en retour : le nom de la carte et la version de son programme. |
| `PING` | Brain → carte | Tu es là ? Envoyée toutes les 2 secondes. Une carte qui n'entend rien pendant son Lost link delay arrête toutes ses sorties (une sécurité). |
| `CFG WD <seconds> S` | Brain → carte | Lost link delay : si la carte n'entend rien du Brain pendant ce nombre de secondes, elle arrête toutes ses sorties. |
| `DO <pin> <0\|1>` | dans les deux sens | Sortie numérique : broche arrêtée (0) ou en marche (1). Le Brain l'envoie ; la carte répond par la même ligne pour dire que c'est fait. |
| `PWM <pin> <0-255>` | dans les deux sens | Sortie PWM : combien de puissance sur une broche, 0 (aucune) à 255 (pleine). 128 est environ la moitié. |
| `AO <pin> <0-1000>` | Brain → carte | Sortie analogique en dixièmes de pour cent : 0 = 0 V ou 4 mA, 1000 = 10 V ou 20 mA. |
| `CFG DI <pin> <PULLUP\|NOPULL> <ms>` | Brain → carte | Régler une entrée numérique : sa résistance de tirage activée ou non, et combien de temps (ms) un changement doit tenir avant de compter (anti-rebond). |
| `CFG RTD <pin> <2\|3\|4>` | Brain → carte | Régler une carte de sonde PT100 / PT1000 (MAX31865) sur cette broche de sélection, avec 2, 3 ou 4 fils. |
| `CFG TC <pin> <type>` | Brain → carte | Régler une carte thermocouple (MAX31856 / MAX31855) sur cette broche de sélection, avec la lettre de son type (K, J, T ...). |
| `CFG FLOW <pin> S` | Brain → carte | Raspberry Pi seulement : compter les impulsions d'un débitmètre sur cette broche. |
| `CFG STEP <step> <dir> <enable> <flags> <top> <accel> <µs>` | Brain → carte | Régler un moteur pas à pas sur ses broches STEP et DIR, avec sa vitesse maximale et son accélération. |
| `CFG STEP4 <in1> <in2> <in3> <in4> <flags> <top> <accel>` | Brain → carte | Régler une carte de moteur pas à pas à 4 fils. |
| `CFG HOME <step> <switch pin> <flags>` | Brain → carte | L'interrupteur de position d'origine d'un moteur pas à pas. |
| `GO <step> <position> <steps/s>` | Brain → carte | Moteur pas à pas : aller à cette position. |
| `RUN <step> <steps/s>` | Brain → carte | Moteur pas à pas : continuer à tourner à cette vitesse (moins = en arrière, 0 = ralentir jusqu'à l'arrêt). |
| `STOP <step>` | Brain → carte | Moteur pas à pas : ralentir et s'arrêter. |
| `ZERO <step> <position>` | Brain → carte | Moteur pas à pas : appeler l'endroit actuel cette position. |
| `HOME <step> <steps/s> <max> <position>` | Brain → carte | Moteur pas à pas : tourner jusqu'à toucher l'interrupteur d'origine. |
| `EN <step> <0\|1>` | Brain → carte | Pilote du moteur pas à pas arrêté (0, le moteur tourne librement) ou en marche (1). |
| `DI <pin> <0\|1>` | carte → Brain | Entrée numérique : la broche lit OFF (0) ou ON (1). Envoyée à chaque changement, et toutes les quelques secondes. |
| `A <n> <0-1023>` | carte → Brain | Entrée analogique A<n> : sa lecture, 0 (0 V) à 1023 (5 V). Chaque seconde. |
| `ADS <channel> <raw>` | carte → Brain | Carte analogique ADS1115, canal 0-3 : 0 à 32767 correspond à 0 à 6,144 V. Chaque seconde. |
| `RTD <pin> <raw\|NAN>` | carte → Brain | Lecture d'une sonde PT100 / PT1000 (0-32767). NAN = la sonde ne marche pas (une panne). |
| `TC <pin> <°C\|NAN>` | carte → Brain | Température d'un thermocouple en °C. NAN = la sonde est ouverte ou en court-circuit. |
| `T <probe id> <°F>` | carte → Brain | Température d'une sonde OneWire (DS18B20) en °F, par l'identifiant de 16 lettres propre à la sonde. |
| `P <pin> <count>` | carte → Brain | Débitmètre : impulsions comptées depuis le démarrage de la carte. Chaque seconde. |
| `W <pin> <raw>` | carte → Brain | Carte de capteur de pesée (HX711) sur cette broche DT : sa lecture brute. Chaque seconde. |
| `SP <step> <steps> <moving> <homed>` | carte → Brain | Moteur pas à pas : où il est (en pas), en mouvement (1) ou non (0), à l'origine (1) ou non (0). |
| `SH <step> <1\|0>` | carte → Brain | Mise à l'origine du moteur pas à pas finie : 1 = interrupteur trouvé, 0 = abandon. |
| `SD <0\|1>` | carte → Brain | Cartes Ethernet : 1 = une carte SD est dans le shield. Les cartes SD ne sont pas prises en charge : retirez-la (Règle 6.11). |
| `ERR <text>` | carte → Brain | La carte signale un problème, dans ses propres mots. |

Une ligne que les programmes Skynet n'utilisent pas s'affiche comme « The Skynet programs do not use this line ». Une carte qui fait tourner un autre programme
parle autrement, donc ses lignes n'auront pas de sens ici. Tous les détails sont dans
docs/DEVICE_PROTOCOL.md.

Voir aussi [Interfaces](76-interfaces) et [Connection ratings](69-connection-ratings).
