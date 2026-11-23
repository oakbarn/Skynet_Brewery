# Devices et cartes {#devices-and-boards}

## Devices et Widgets {#devices-and-widgets}

- Un **Device** est relié à un port ou une broche d'une carte (un automate, PLC) : un relais de pompe, une vanne, une sonde de température, un interrupteur à flotteur, un débitmètre, une balance.
- Un **Widget** n'existe que dans l'application : images, étiquettes, minuteries, alarmes, variables, points IP et raccords de tuyau.

Chaque étape, en images : [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) et [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget).

Ici, « PLC » veut dire des cartes de loisir : les cartes compatibles Arduino (comme la Mega), l'ESP32 et le Raspberry Pi. Elles se branchent par **USB**, par **Ethernet** quand la carte en a, ou par **WiFi** avec un ESP32.

## Ajouter une carte (Interface) {#adding-a-board-interface}

Une carte s'appelle une **Interface**. Sur l'écran **Devices**, sous **Add Interface**, appuyez sur **➕ Add Interface…** :

1. Donnez-lui un **Name**, par exemple `Main Brewery Mega USB`. Son **Interface ID** (`MB`) est proposé à partir du nom ; voir [Interfaces](76-interfaces).
2. Choisissez la **Board** (l'Arduino Mega, une autre carte Arduino, un ESP32 ou un Raspberry Pi ; voir [Cartes Skynet](206-skynet-boards)) et sa **Connection** : les choix suivent la Board (USB, Ethernet ou WiFi). Le Hover Help de la Connection donne la **note de connexion** (connection rating), à quel point ce lien est sûr ; voir [Notes de connexion](69-connection-ratings).
3. Pour l'USB, le numéro du **USB Port** : Skynet en propose un libre qu'il a trouvé (Windows : `7` est COM7 ; Pi : `/dev/ttyACM0`). Pour l'Ethernet ou le WiFi, tapez son adresse réseau.
4. Appuyez sur **Add**. Ensuite **⚙ Change** et **🔌 Test Communication** vérifient que le Brain et la carte se parlent.

Le tableau du haut montre chaque carte, sa note de connexion et si elle est connectée.

> Sur le Pi, les cartes USB ont besoin une fois de `npm install serialport` dans le dossier du panel, et une fois de `sudo usermod -aG dialout $USER` (puis déconnectez-vous et reconnectez-vous).

## Mettre un Device sur un Tab {#putting-a-device-on-a-tab}

Dans **Tabs > 🛠 Build (Edit layout)**, **Select Device Type** liste les types de Device et **Add Device** liste les Devices de ce type (voir [Barre Edit layout](82-edit-layout-bar)) :

- **Sorties** (Outputs) : marche/arrêt (relais), PWM %, analogique 0-10 V ou 4-20 mA. Une **Pump** (pompe) et une **Valve** (vanne) sont des sorties toutes prêtes, avec leurs images et leurs points d'écoulement déjà placés.
- **Entrées numériques** (Digital inputs) : interrupteurs, interrupteurs à flotteur et de niveau, détecteurs de débit, verrouillages de sécurité (interlocks) et boutons. Un **bouton poussoir** (push button) est ON seulement tant qu'on le tient et OFF quand on le lâche. Un **bouton à bascule** (toggle button) reste ON après un appui et OFF après le suivant. Un **bouton à impulsion** (pulse button) donne un court ON par appui.
- **Sondes de température** : DS18B20, PT100, PT1000, thermocouples (K, J, T et d'autres), thermistances NTC.
- **Capteurs analogiques** : 0-5 V, 0-10 V, 4-20 mA, pression, niveau, pH (avec étalonnage en deux points).
- **Débitmètres** (à impulsions) et **balances de cuve** (cellules de charge HX711, avec tare et étalonnage).

Un nouveau Device demande d'abord son **Interface**, son **Port** (seules les broches libres qui conviennent sont listées), son **Suggested Name** (nom proposé), son **Label** (étiquette, avec un interrupteur **Show label**) et sa taille (150 x 150 pour commencer) ; le **Device Type** est aussi demandé quand ce type en a plusieurs, et il reçoit un nom comme `MB_25_PWM@Valve_L_Fly~Sparge_SP` ([Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names)). **➕ Add Device** (il marche une fois le Label tapé ou Show label éteint) le place au milieu du Build Tab et ouvre ses propriétés pour le reste ; **✅ Finish Build ...** le met ensuite sur un Tab. Un port d'Interface a un seul Device (Règle 6.1) : les autres façons de commander un élément chauffant sont ses méthodes de chauffe ([Une seule résistance, choisissez comment elle chauffe](150-heating-method)). Les propriétés ne montrent que les réglages dont ce type a besoin, plus la lecture en direct pour l'étalonnage.

## Sondes OneWire (DS18B20) {#onewire-probes-ds18b20}

Les sondes ont leur propre onglet : **Devices > 🌡 OneWire Probes**. Chaque sonde reçoit un **1-Wire Index** sur son circuit 1-Wire (BM1w1_2 = Interface BM, circuit 1, sonde 2), et les Devices de température utilisent cet Index. Voir [1-Wire probes: circuits and Indexes](234-1-wire-probes). Les sondes sont reconnues par leur identifiant ROM, pas par leur place sur le fil.

**Pour remplacer une sonde :** branchez la nouvelle, trouvez-la sous **OneWire probes seen**, et choisissez son identifiant ROM dans la ligne de l'ancienne sonde. Chaque Device qui utilise ce numéro la suit ; rien d'autre ne change.

## Sécurité {#safety}

Gardez des dispositifs de sécurité câblés en dur, quoi que fasse le panel : la sécurité de flamme du brûleur, les interrupteurs à flotteur et un arrêt d'urgence. Le panel n'a pas encore été testé avec une vraie Mega, et le micrologiciel (firmware) des cartes n'a pas encore été compilé.
