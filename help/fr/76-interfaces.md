# Interfaces

Une **Interface** est une carte (PLC) à laquelle vos Devices sont câblés : un Arduino Mega 2560, un ESP32 et autres. Chaque Device (une pompe, une vanne, une sonde, une résistance) est sur un Port d'une Interface.

## Les trouver {#finding-them}

- **☰ Menu > Devices > ↳ Interfaces (boards)** ouvre la page Devices à la liste des Interfaces.
- La page **Devices** a deux onglets : **🔌 Interfaces** (chaque Interface et **Add Interface**) et **🌡 OneWire Probes** (les 1-Wire circuits, les 1-Wire Indexes et les sondes vues, voir [Devices and boards](03-devices)).

## La liste des Interfaces {#the-interfaces-list}

Posez la souris sur le nom d'une colonne pour son Hover Help :

| Colonne | Ce qu'elle montre |
|---|---|
| **ID** | L'Interface ID : il commence le nom suggéré de chaque Device sur cette Interface (MB_25_DO@Pump_Wort_BH). Les Interface ID suivent la Rule 3.2 : une fois enregistré, il ne change jamais. |
| **Name** | Le nom de l'Interface, celui que vous lui avez donné en l'ajoutant : Hot Side, Fermentation, le nom de votre brasserie. |
| **Board** | Le type de carte : l'Arduino Mega (la norme), une autre carte Arduino, un ESP32 ou un Raspberry Pi. Voir [Cartes Skynet](206-skynet-boards). |
| **Mode** | Simulator : le panel fait semblant d'être cette carte, et rien ne va à une vraie carte. Real : le panel parle à la vraie carte. Le panel passe de l'un à l'autre sur la barre Simulator. |
| **Connection** | Comment la carte est reliée au Brain : USB, Ethernet ou WiFi. Posez la souris dessus pour voir son USB Port ou son Network address. |
| **Rating** | À quel point la Connection est sûre pour cette carte : Best, Good, OK ou Poor. L'USB est le plus sûr ; Ethernet et WiFi dépendent de votre réseau. |
| **Lost Comm** | Lost Comm : si la carte n'entend rien du Brain pendant ce temps, elle met toutes ses sorties sur OFF |
| **Status** | La carte parle-t-elle au Brain : connected, connecting, no answer ou disabled. Posez la souris dessus pour en savoir plus (le programme de la carte et sa version, ou ce qui ne va pas). |

Quand quelque chose ne va pas (no answer, une erreur de la carte), la raison est aussi écrite sous le Status. La case ID est verrouillée : elle montre l'ID bien lisible mais on ne peut pas y taper (Rule 3.2).

## Ajouter une Interface {#adding-an-interface}

Il y a trois façons d'y entrer, et les trois ouvrent la même fenêtre **Add Interface** :

1. **☰ Menu > Devices > ↳ Add Interface**
2. **Page Devices > Add Interface > ➕ Add Interface…**
3. Dans la fenêtre **New Device** sur n'importe quel Tab : ouvrez **2. Interface** et choisissez **➕ Add new Interface…**, le premier choix. Quand vous cliquez sur Add, vous revenez à la fenêtre New Device avec la nouvelle Interface déjà choisie. La fenêtre New Device d'un tube RIMS ou d'une bouilloire électrique a le même choix.

La fenêtre demande (posez la souris sur chaque nom pour son Hover Help) :

- **Name** : quelque chose qui a un sens pour vous, comme *Hot Side*, *Fermentation* ou le nom de votre brasserie. La Skynet Home Brewery, par exemple, a 3 Megas : **Main_Brewery_HotSide**, **Valves** et **Fermentor**.
- **Interface ID** : voir plus bas.
- **Board** : l'Arduino Mega (la norme), une autre carte Arduino, un ESP32 ou un Raspberry Pi. Une carte 3,3 V montre un seul avertissement quand vous y mettez une entrée, un capteur 0-5 V ou un relais. Voir [Cartes Skynet](206-skynet-boards).
- **Connection** : les choix suivent la Board. Un Arduino Mega : USB, Ethernet (avec un Shield W5100 ou W5500) ou WiFi (par un pont ESP32). Un ESP32 : USB, Ethernet ou WiFi. Un Raspberry Pi : Ethernet (ou le Brain lui-même) ou WiFi. Son Hover Help montre la note de connexion (aide : [Notes de connexion](69-connection-ratings)).
- **USB Port** (une carte USB) ou **Network address** (adresse réseau, Ethernet ou WiFi). Voir [Le USB Port, le côté technique](#the-usb-port-the-technical-side) et [La Network address](#the-network-address). Quand le panel est en mode 🧪 Simulator, le Brain ne parle à aucune carte, donc rien ne passe par le USB Port : pour tester la vraie connexion, passez sur 🔌 Real, ajoutez l'Interface, puis ⚙ changez-la sur la page Devices et appuyez sur 🔌 Test Communication.
- **Board Settings** : **On**, **🔌 Test Communication**, **Answer Wait**, **Lost Comm** et **Diagnostic Logging** (et le **Network Port** en Ethernet ou WiFi) : voir [Board Settings](#board-settings) plus bas.

Le **Simulator** n'est pas une Connection : il appartient au panel, pas à une carte. Il s'allume et s'éteint sur la barre du simulateur.

**Les boutons** (✖ Cancel et Add) sont figés en haut, avec le titre, et il n'y a pas de rangée de boutons en bas : le modèle (Règle 2.51). Choisir une autre Connection garde l'Interface ID suggéré.

**Les touches.** Le **Name** et le **USB Port** (ou la **Network address**) sont les cases où va la touche **Entrée** : Entrée sur le Name va au USB Port, et Entrée sur un USB Port rempli, avec un Name, ajoute (ou enregistre) l'Interface. La touche **Tab** fait le tour de chaque case de la fenêtre, de la dernière à la première. Le **?** Help, **✖ Cancel** et **Add** sont pour la souris. Le même ordre que le [Blichmann RipTide Dialog 1](115-pump-device-properties) (Rule 18.39).

## L'Interface ID {#the-interface-id}

- L'Interface ID **devient une partie du Suggested Name de chaque Device sur cette Interface**. C'est le début du nom : une pompe sur la broche 25 de l'Interface **HS** est proposée sous le nom `HS_25_DO@Pump_Wort_HS`.
- Les Interface IDs suivent la **Rule 3.2** : voir [La règle des ID](46-interface-tab-device-names). Une fois enregistré, il ne change jamais, même pas par un Admin.

Skynet propose l'ID à partir du Name pendant que vous le tapez : les premières lettres de ses deux premiers mots (*Hot Side* = **HS**). Quand cet ID est pris, 3 lettres (**HSI**), et seulement quand tous les 3 sont pris, 4. Son Hover Help est le même que le Hover Help de l'Interface de la Pump, avec l'ID (en rouge) et le Name de cette Interface.

## Ports (broches IO) {#ports-io-pins}

L'Interface a des **broches IO** qui fournissent le signal de commande. Ce sont les **Ports**. Chaque Device est sur un Port d'une
Interface, et la liste **Available Ports** de la fenêtre New Device ne montre que les Ports libres de cette carte qui conviennent à ce type de
Device, par exemple 22, ou A5 = 59. Les Digital Outputs ont le plus de ports, les vrais Ports PWM sont bien plus limités (aide
[Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names)). Une fois un Port confirmé et le Device enregistré, il est grisé
et ne peut plus être changé : c'est le câblage (aide [Properties du Device Pump (le détail)](115-pump-device-properties)).

## Le signal de commande {#the-trigger-signal}

Le Brain (Skynet Panel) n'alimente jamais lui-même une pompe ou un chauffage. Si le Brain est sur un ordinateur, l'ordinateur ne peut fournir aucun
courant de 120 VAC à un appareil branché. Il faut d'autres pièces de matériel, et pas une seule. C'est une chaîne :

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

Brain -> IO de l'Arduino (Port) -> Commande (le Brain dit d'allumer la pompe rouge) -> signal de 5 V ou 3.3 V envoyé à -> SSR ou contacteur (le
120 VAC se branche ici) -> la pompe reçoit le courant

Le type de signal envoyé dépend de la méthode de commande du Brain et du type de Port choisi sur l'Arduino, car ils peuvent
varier. Une pompe On/Off comme une Blichmann RipTide sur le Port 15 est en Direct Output (DO) : si l'état du Device est vrai, le courant
passe (par le SSR), et s'il est Off, le SSR n'envoie plus de courant. Comme un interrupteur de lumière.

## Changer une Interface {#changing-an-interface}

**⚙ Change** dans la ligne d'une Interface sur la page Devices ouvre la même fenêtre. Utilisez-le pour donner à une carte fictive son vrai **USB Port** ou son adresse réseau une fois câblée, pour choisir un autre USB Port, pour changer ses Board Settings ou pour faire un **Test Communication**. Le nom d'une Interface qui a des Devices reste tel quel, et un ID enregistré ne change jamais (Rule 3.2).

**La liste des USB Ports.** Le USB Port se choisit dans une liste des ports que Skynet trouve sur ce Brain maintenant. Sous Windows c'est un numéro (COM3 s'affiche 3). Sur un Raspberry Pi ou Linux c'est un nom comme /dev/ttyACM0. Vous ne savez pas lequel est la carte ? Débranchez-la et choisissez **🔄 Look again** : celui qui a disparu est la carte. Un port enregistré avant qui n'est pas sur ce Brain maintenant reste dans la liste, en rouge, marqué « not found on this Brain », pour qu'il ne soit jamais perdu sans que vous le voyiez. Quand le panel tourne en **Simulator**, une ligne grise montre le vrai port : il sert quand vous repassez sur Real boards, et vous pouvez encore le changer.

**Changer la carte.** Quand vous choisissez une autre Board pour une Interface qui a des Devices, 💾 Save montre d'abord une seule boîte : combien de Devices, Widgets et Processes l'utilisent, et les Devices sur un Port que la nouvelle carte n'a pas. Appuyez sur 💾 Save pour continuer, ou Close pour revenir. Ces Devices gardent leurs Ports ; donnez à chacun un nouveau Port dans ses Properties.

**Le nom de Device suggéré.** La bulle de l'Interface ID finit par le **Nom de Device suggéré** pour cette Interface, par exemple BM_Port_Type_Label_TabID, avec l'ID en rouge.

## Retirer une Interface {#removing-an-interface}

Retirer une Interface peut casser toute votre brasserie : chaque Device branché dessus cesse de fonctionner. La plupart du temps, vous voulez plutôt **⚙ Change**, pour choisir une autre carte, un autre USB Port ou une autre Network address ; les Devices y restent.

Poser la souris sur **Remove** montre un grand avertissement avec le nombre de Devices, de Widgets et de Processes qui utilisent cette Interface. Rien n'est retiré par lui.

**Remove** (Admins seulement) ouvre une seule boîte Skynet. Rien ne change tant que vous n'appuyez pas sur un de ses boutons.

- **Rien ne l'utilise :** la boîte le dit, et **🗑 Delete** la retire.
- **Quelque chose l'utilise :** la boîte liste ce qui l'utilise, avec le nombre de chacun : les **Devices** qui sont dessus (avec leurs Ports), les **Widgets et images** liés à ces Devices (un Clone, un Widget qui en nomme un), les **Processes** qui les utilisent, ses emplacements **1-Wire Index**, et les autres éléments dessus (les pièces d'un Vessel, un Manifold).
- **▶ Move them** (recommandé) : choisissez une autre Interface, ou ➕ Add new Interface, et chaque Device y est déplacé avec son nom et tous ses réglages. Un Device dont le Port (ou le 1-Wire Index) est déjà pris sur la nouvelle Interface reste où il est, et la boîte le liste avec la raison, pour que vous puissiez le corriger et appuyer de nouveau sur Move. Quand tout est déplacé, rien n'utilise plus l'Interface et elle peut être retirée sans risque.
- **La retirer quand même :** un seul avertissement. Tapez l'Interface ID (par exemple BM) pour allumer **🗑 Delete**.

Une sauvegarde du Schema est toujours faite d'abord (Règle 9.17) : une Interface retirée peut être remise à partir d'elle.

Rien de ce qui utilisait l'Interface n'est supprimé (Règle de conception n° 1) : les Devices, Widgets et Processes gardent tous leurs réglages. Un Device dont l'Interface a été retirée montre **⚠ No Interface** en rouge dans sa case Interface, et ne fait rien tant qu'il n'est pas déplacé vers une Interface. Un Process s'arrête à une ligne qui en utilise un.

## Un nouveau Schema vide n'a pas d'Interface {#a-new-empty-schema-has-no-interface}

Un nouveau Schema qui n'est **pas** une copie d'un autre (liste Schema > Add new Schema > *An empty Schema*) commence **sans Interface**. Ajoutez vos cartes avec **Add Interface** sur la page Devices, ou avec **➕ Add new Interface…** dans la case New Device. Chaque Device que vous ajoutez porte son Interface.

Un Skynet Schema Template fait sans vraie carte reçoit quand même un Mega fictif pour ses Devices ([Nouveau Schema depuis un Skynet Template](157-schema-templates)). Il reste fictif jusqu'à ce que son USB Port ou sa Network address soit rempli et enregistré.

Une copie d'un Schema garde les Interfaces qu'il avait.

## Vos propres noms de Devices {#your-own-device-names}

La fenêtre New Device propose un nom à partir de l'Interface ID, du Port, du Device Type, du Label et de l'ID du Tab. Vous pouvez taper le vôtre à la place, et le panel vous avertit alors :

- Un simple mot comme nom (par exemple **Pump**) devient un mot réservé dans vos Processes et peut causer des problèmes dans le code.
- Le nom du Device n'est **utilisé que dans les Processes** et n'est **jamais affiché sur un Tab** (c'est le Label qui l'est). Un nom unique et parlant, comme le Suggested Name, est le meilleur choix.

Cliquez sur OK pour garder votre nom, ou sur Cancel pour revenir le changer.

## Board Settings

- **On** : le panel parle à cette carte. **Off** : le panel ne l'ouvre jamais, et ses Devices apparaissent comme non connectés. Quand une carte est Off, aucun de ses Devices ne fonctionne. Une carte doit être On et en communication avec le Brain (les deux se parlent) pour faire la moindre action.
- **🔌 Test Communication** : une vérification pas à pas que le Brain et la carte se parlent. Voir [Test Communication](#test-communication).
- **Answer Wait (seconds)** : si la carte ne dit rien pendant ce nombre de secondes, la page Devices affiche « no answer ». 2 à 600.
- **Lost Comm (s)** : une sécurité. Si la carte n'entend rien du Brain pendant ce nombre de secondes, elle met toutes ses sorties sur OFF, pour qu'un chauffage ou une pompe ne reste pas allumé quand le Brain, le câble ou le réseau lâche. À remplir : 3 à 600 secondes (10 au départ).

  ⚠ **C'est vous la sécurité. Lost Comm est une sécurité de secours, pas votre sécurité : vous êtes responsable de surveiller votre brasserie pendant qu'elle tourne. Vous êtes la première sécurité.**
- **Diagnostic Logging** : normalement **Off**. Ne l'activez que pour trouver un problème : chaque ligne vers et depuis cette carte est écrite, avec des mots simples, dans un fichier par jour dans le dossier des données (`logs/boards`). Utilisez-le quand vous savez ce que le journal veut dire. Désactivez-le après.

  Skynet ne donne pas d'aide pour les problèmes de communication : le journal est seulement un moyen pour vous, ou pour quelqu'un qui vous aide, de trouver le problème.
- **Network Port** (Ethernet ou WiFi) : le port réseau sur lequel la carte écoute. Les programmes de Skynet utilisent 4100.

Il n'y a pas de case Baud (vitesse USB) : elle vient de la carte. Chaque programme de carte Skynet parle à 115200.

## La Network address {#the-network-address}

Si vous ne comprenez pas les réseaux et les protocoles, demandez de l'aide à un ami.

**Ce que c'est.** La Network Address (adresse IP) est le numéro de la carte sur votre réseau à la maison : quatre nombres avec des points, par exemple 192.168.1.60. Le Brain trouve la carte grâce à elle, comme une lettre trouve une maison grâce à son adresse.

**Avant de l'ajouter.** Branchez la carte, ou mettez-la sous tension (un ESP32 aussi), avant de l'ajouter, pour qu'elle soit sur
votre réseau et que 🔌 Test Communication puisse l'atteindre.

**L'adresse proposée.** Skynet propose une adresse sur le réseau du Brain : les trois premiers nombres sont ceux du Brain, et le
dernier est un nombre qu'aucune autre Interface n'utilise (60 au départ, l'adresse du programme Mega de Skynet). Ce n'est qu'une
proposition : c'est la carte qui décide de sa propre adresse. Rendez-la fixe, pour qu'elle ne change jamais : écrivez-la dans le
programme Skynet de la carte, ou réservez-la pour la carte dans votre routeur (Comment la trouver, plus bas).

**Ethernet (un câble réseau).**
- Aucun nom de WiFi (SSID) ni mot de passe n'est nécessaire : le câble branche la carte sur votre routeur ou votre switch réseau.
- Un Arduino Mega avec un Ethernet Shield utilise l'adresse écrite dans le programme Skynet sur la carte : 192.168.1.60 au départ. Tapez cette même adresse. Si les adresses de votre réseau commencent par d'autres nombres (par exemple 10.0.0.), l'adresse du programme est changée pour une des vôtres et le programme est rechargé sur la carte.
- Un ESP32 avec une prise Ethernet reçoit son adresse de votre routeur (Comment la trouver, plus bas).
- Un Raspberry Pi qui est lui-même le Brain : 127.0.0.1 (le Brain qui se parle à lui-même).

**WiFi.**
- Oui, le nom du WiFi (SSID) et son mot de passe sont nécessaires, mais pas dans Skynet : ils sont tapés dans le programme Skynet de la carte (l'ESP32) avant que le programme y soit chargé, pour que la carte puisse rejoindre votre WiFi. Skynet ne les demande jamais et ne les garde jamais.
- Une carte Raspberry Pi rejoint votre WiFi dans ses propres réglages WiFi, faits sur le Pi quand il est installé.
- Votre routeur donne ensuite son adresse à la carte. Quand la carte démarre, elle montre son adresse dans le Serial Monitor du programme Arduino (avec le câble USB branché), et votre routeur la liste aussi.
- Le WiFi doit atteindre la carte là où elle est. Un câble USB ou un câble réseau est plus sûr.

**Comment la trouver.** Ouvrez l'application ou la page web de votre routeur et regardez sa liste d'appareils connectés : la carte y est avec son adresse. Puis, dans le routeur, réservez cette adresse pour la carte (cela peut s'appeler une réservation DHCP, une adresse fixe ou statique), pour qu'elle ne change jamais. Sans cela, la carte peut recevoir une nouvelle adresse après une coupure de courant et le Brain ne la trouve plus.

**Windows, Mac, Linux ou un Raspberry Pi.** C'est pareil pour tous : l'adresse appartient à la carte et à votre routeur, pas à l'ordinateur du Brain, et rien de plus n'est installé. Le Brain doit seulement être sur le même réseau (le même routeur) que la carte. Le **Network Port** doit être le même que celui du programme de la carte (les programmes de Skynet utilisent 4100).

## Test Communication

**🔌 Test Communication** dans la fenêtre de l'Interface (⚙ Change sur la page Devices) ouvre une vérification pas à pas. Rien sur la carte n'est mis sur On ou Off. Une Interface en cours d'ajout se teste après avoir été ajoutée.

1. **La carte est-elle On et parle-t-elle ?** Elle montre ce que le Brain voit maintenant : *Talking*, *no answer*, *Off* ou *Not connected* avec la raison.
2. **👋 Say Hello.** Skynet envoie `HELLO`. Une carte avec le programme Skynet répond avec son nom et la version de son programme en moins de 5 secondes.
3. **Exemples de réponses :**

| La carte dit | Ce que cela veut dire |
|---|---|
| `HELLO MEGA1 0.5` | Bien : la carte MEGA1 a répondu, et elle a le programme Skynet, version 0.5. |
| `DI 22 0` | Bien : la carte donne ses entrées après Hello (l'entrée 22 est Off). |
| `ERR ADS1115 not found on I2C` | La carte parle, mais une de ses pièces n'est pas trouvée : vérifiez le câblage de cette pièce. |
| (rien) | Pas de réponse : voir l'étape 4. |
| des lettres étranges (ÿ?¿) | La carte a un programme qui n'est pas celui de Skynet : chargez le programme Skynet dessus. |

4. **Quoi vérifier quand il n'y a pas de réponse.** Une carte USB : le numéro du USB Port est celui où la carte est branchée ; le câble USB transporte des données (certains câbles ne font que charger) ; aucun autre programme n'a la carte ouverte (le Serial Monitor du programme Arduino, un autre programme de brassage) ; la carte a le programme Skynet. Une carte réseau : elle a du courant et son voyant réseau est allumé ; la Network address est bien la sienne et le Brain est sur le même réseau ; le Network Port est celui de son programme (4100) ; elle a le programme Skynet.

**💬 Board Talk** sur la page Devices montre chaque ligne vers et depuis la carte, en mots simples : voir [Board settings et Board Talk](177-board-talk).

## Le USB Port, le côté technique {#the-usb-port-the-technical-side}

Une carte USB apparaît sur le Brain comme un **port série**. Sous Windows il s'appelle **COM** et un numéro (COM3, COM7 ...) : tapez le numéro seul (7) et Skynet en fait COM7. Windows les numérote de 1 à 256 et donne à chaque carte son propre numéro la première fois qu'elle est branchée ; la même carte dans la même prise USB garde son numéro. Sur un Raspberry Pi ou sous Linux, le port est un nom comme `/dev/ttyACM0` (un Arduino Mega) ou `/dev/ttyUSB0` (une carte avec une puce USB-série) ; tapez-le tel quel.

Quand la fenêtre s'ouvre, Skynet cherche les cartes branchées et propose la première qu'aucune autre Interface n'utilise. Pour trouver le numéro de votre carte : débranchez-la, ouvrez la fenêtre et regardez les numéros trouvés, rebranchez-la et ouvrez-la à nouveau. Le nouveau numéro est votre carte. Un seul programme à la fois peut utiliser un port : fermez le Serial Monitor du programme Arduino et tout autre programme de brassage avant que Skynet se connecte.
