# Sondes 1-Wire : circuits et Indexes {#1-wire-probes-circuits-and-indexes}

Les sondes de température **DS18B20** parlent en **1-Wire** : plusieurs sondes partagent une broche de données et sa résistance de rappel de 4,7k ohms. Cette broche avec ses sondes est un **circuit 1-Wire**. Une Interface peut avoir plusieurs circuits, chacun sur sa broche.

## Le 1-Wire Index {#the-1-wire-index}

Chaque sonde DS18B20 a un **1-Wire Index** : son Interface, son circuit et son numéro sur ce circuit.

- **BM1w1_1** = Interface **BM**, circuit 1-Wire **1**, sonde **1**.
- **BM1w1_2** = la deuxième sonde sur ce même circuit.
- **BM1w2_1** = la première sonde d'un deuxième circuit sur la même Interface.

La broche n'est pas dans l'Index : c'est un réglage du circuit. Le Suggested Name d'une sonde est son Index, son Label et son Tab, par exemple **BM1w1_1_HLT_BH** (Rule 3.1). Comme il commence par l'Interface ID, taper **BM** dans l'éditeur de Process le montre avec les autres Devices de cette Interface.

Un numéro de circuit n'est jamais réutilisé après la suppression de son circuit. Un trou dans les numéros ne gêne pas.

## Ajouter une sonde 1-Wire {#adding-a-1-wire-probe}

Dans la case **1-Wire Index** de la sonde, choisissez :

1. **➕ Create an Index for a new 1-Wire circuit** : un court interview demande la **Pin** (broche) du circuit, son alimentation (**Powered by**) et sa **Resolution**. La sonde reçoit l'Index 1 sur le nouveau circuit. La première sonde 1-Wire d'une Interface commence toujours ici.
2. **Un circuit existant** : la sonde reçoit l'Index suivant sur ce circuit. Vous pouvez choisir à la place n'importe quel Index libre de ce circuit.

Quand une Interface a un seul circuit, l'Index suivant est déjà choisi.

## Combien de sondes sur un circuit {#how-many-probes-on-a-circuit}

Le 1-Wire n'a pas de limite fixe ; des fils longs, un montage en chaîne et une alimentation faible font perdre des lectures. Skynet a une **limite souple** : environ **6** sondes sur un circuit alimenté par **Board 5V**, environ **12** sur une **External supply** (alimentation externe). Au-delà vous avez un avertissement, et la sonde est quand même ajoutée. Mettez plus de sondes sur un deuxième circuit si des lectures se perdent.

## Résolution {#resolution}

- **12-bit** (par défaut) : pas de 0,0625 °C (0,11 °F), environ 0,75 s par lecture. Le meilleur pour le chauffage Precise et une colonne de distillation.
- **11-bit** : pas de 0,125 °C (0,23 °F), plus rapide.
- **10-bit** : pas de 0,25 °C (0,45 °F), le plus rapide.

Pour plus de justesse sur une sonde, utilisez son **Calibration offset** ou sa **Two-point calibration**. Pour une vraie précision, utilisez une sonde PT100 sur une carte MAX31865.

## Devices > 🌡 OneWire Probes {#devices-onewire-probes}

- **1-Wire circuits** : chaque circuit de chaque Interface : sa Pin, Powered by et Resolution (à changer ici), combien de sondes il a, **➕ Index** pour une sonde que vous brancherez, et **Delete**. **➕ Add 1-Wire circuit** lance le même interview.
- **1-Wire Indexes** : chaque Index garde l'identifiant ROM de sa sonde. Pour remplacer une sonde, branchez la nouvelle et choisissez son ROM id dans la ligne de l'Index : chaque Device qui utilise cet Index la suit.
- **OneWire probes seen** : chaque sonde que les cartes signalent, par son ROM id, et la broche où elle est. Donnez ici un Index à une nouvelle sonde.

## Le programme de la carte {#the-board-program}

Le sketch du Mega liste ses broches 1-Wire dans **ONEWIRE_PINS** (D40 au départ ; par exemple `{40, 41}` pour deux circuits). Chaque broche a besoin de sa propre résistance de 4,7k ohms vers l'alimentation des sondes. Le panneau envoie la résolution de chaque circuit quand la carte se connecte. Un Raspberry Pi a un seul circuit 1-Wire, sur GPIO 4.
