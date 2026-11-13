# Interfaces

Une **Interface** est une carte (PLC) à laquelle vos Devices sont câblés : un Arduino Mega 2560, un ESP32 et autres. Chaque Device (une pompe, une vanne, une sonde, une résistance) est sur un Port d'une Interface.

## Les trouver {#finding-them}

- **☰ Menu > 🔌 Interfaces (boards)** ouvre la page Devices à la liste des Interfaces.
- La page **Devices** liste chaque Interface : son ID, son nom, sa carte, sa connexion, sa note, son délai de lien perdu et son état.

## Ajouter une Interface {#adding-an-interface}

Il y a trois façons d'y entrer, et les trois ouvrent la même fenêtre **Add Interface** :

1. **☰ Menu > ➕ Add Interface…**
2. **Page Devices > Add Interface > ➕ Add Interface…** (la ligne de cases en dessous marche toujours aussi)
3. Dans la fenêtre **New Device** sur n'importe quel Tab : ouvrez **1. Interface** et choisissez **➕ Add new Interface…** en bas. Quand vous cliquez sur Add, vous revenez à la fenêtre New Device avec la nouvelle Interface déjà choisie. La fenêtre New Device d'un tube RIMS ou d'une bouilloire électrique a le même choix.

La fenêtre demande :

- **Name** : quelque chose qui a un sens pour vous, comme *Hot Side*, *Fermentation* ou le nom de votre brasserie. La Skynet Home Brewery, par exemple, a 3 Megas : **Main_Brewery_HotSide**, **Valves** et **Fermentor**.
- **Interface ID** : voir plus bas.
- **Board** : Arduino Mega, ESP32 ou une autre carte de type Arduino.
- **Connection** : USB, Ethernet, WiFi, ou **Simulator** (pas encore de carte : tout ce qui est dessus est fictif). Elle montre la note de connexion (aide : [Connection ratings](69-connection-ratings)).
- **USB port** ou **Network address** (adresse réseau), pour une carte USB ou réseau.

## L'Interface ID {#the-interface-id}

- L'Interface ID (1 à 4 lettres) **devient une partie du Suggested Name de chaque Device sur cette Interface**. C'est le début du nom : une pompe sur la broche 25 de l'Interface **HS** est proposée sous le nom `HS_25_DO@Pump_Wort__HS`.
- Il **doit être unique** : deux Interfaces ne peuvent pas avoir le même ID.
- **Seul un Admin peut le changer.** Pour tous les autres, la case ID de la page Devices est grisée.
- **Réglez-le une fois et n'y touchez plus.** Les Devices faits avant un changement gardent l'ancien ID dans leur nom, donc un changement laisse un mélange de noms. Le panel demande avant de changer l'ID d'une Interface qui a déjà des Devices.

Laissé vide, l'ID est fait des premières lettres du Name (*Hot Side* = HS).

## Ports (broches IO) {#ports-io-pins}

L'Interface a des **broches IO** qui fournissent le signal de commande. Ce sont les **Ports**. Chaque Device est sur un Port d'une
Interface, et la liste **Available Ports** de la fenêtre New Device ne montre que les Ports libres de cette carte qui conviennent à ce type de
Device, par exemple 22, ou A5 = 59. Les Digital Outputs ont le plus de ports, les vrais Ports PWM sont bien plus limités (aide
[Interface, Tab and Device names](46-interface-tab-device-names)). Une fois un Port confirmé et le Device enregistré, il est grisé
et ne peut plus être changé : c'est le câblage (aide [Pump Device Properties](115-pump-device-properties)).

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

**⚙ Change** dans la ligne d'une Interface sur la page Devices ouvre la même fenêtre. Utilisez-le pour faire passer une carte de **Simulator** à son vrai port **USB** ou à son adresse réseau une fois câblée, pour choisir un autre port USB, ou pour régler l'ID. Le nom d'une Interface qui a des Devices reste tel quel.

## Un nouveau Schema commence avec un Mega fictif {#a-new-schema-starts-with-a-pretend-mega}

Quand vous faites un nouveau Schema qui n'est **pas** une copie d'un autre (liste Schema > Add new Schema > *An empty Schema*) :

1. Il commence avec une Interface, un Arduino Mega 2560 fictif (Simulator) appelé **New_Mega_2560_1**. Si un New_Mega_2560_1 existe déjà dans un de vos Schemas, c'est New_Mega_2560_2, et ainsi de suite.
2. Tout le panel passe en **Simulator mode**, et un message vous le dit (aide : [Simulator or Real boards](77-simulator-or-real-boards)).
3. La fenêtre de l'Interface s'ouvre pour que vous lui donniez un nom qui a un sens pour vous et que vous régliez son Interface ID.

Une copie d'un Schema garde les Interfaces qu'il avait.

## Vos propres noms de Devices {#your-own-device-names}

La fenêtre New Device propose un nom à partir de l'Interface ID, du Port, du Device Type, du Label et de l'ID du Tab. Vous pouvez taper le vôtre à la place, et le panel vous avertit alors :

- Un simple mot comme nom (par exemple **Pump**) devient un mot réservé dans vos Processes et peut causer des problèmes dans le code.
- Le nom du Device n'est **utilisé que dans les Processes** et n'est **jamais affiché sur un Tab** (c'est le Label qui l'est). Un nom unique et parlant, comme le Suggested Name, est le meilleur choix.

Cliquez sur OK pour garder votre nom, ou sur Cancel pour revenir le changer.

Chaque Interface a aussi des **Board settings** (On, Pause communications, Answer wait, Diagnostic logging, Baud, Network port) et
**💬 Board Talk** sur la page Devices, qui montre chaque ligne envoyée à la carte et reçue d'elle en mots simples : voir
[Board settings and Board Talk](177-board-talk).
