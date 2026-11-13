# Réglages d'une cuve {#vessel-settings}

L'onglet **Vessel** du **☰ Menu** n'existe plus (OakBarn Brewery, 2026-11-13). L'[Equipment Profile Interview](196-equipment-profile-interview) a pris sa place : il demande combien de cuves, le type de chacune et leur taille, puis les met sur le Tab. Tout le reste d'une cuve est dans ses **Propriétés** sur le Tab : dans **Edit layout**, double-cliquez sur la cuve.

## Type

**HLT**, **Mash Tun**, **Brew Kettle**, **All In One**, **Whirlpool**, **Fermentor**, **Bright Tank** ou **Other**. L'Interview le demande ; les Propriétés de la cuve le montrent.

## Taille {#size}

- Les **Gallons** (Liters quand les Units sont Metric) et le **Dead space** (ce qui reste au fond) sont dans les Propriétés de la cuve, sous **Size**. L'Interview demande les deux.
- Un Fermentor a à la place son **Largest batch** et son **Smallest batch**.
- Comment la taille dessine la cuve : [Taille de la cuve](166-vessel-device-builder).

## Chauffe {#heat}

Le **Heating Element** d'une cuve se choisit dans ses Propriétés (ou dans le [Vessel Device Builder](166-vessel-device-builder)). Il brille quand il est allumé.

## Sonde de température {#temperature-probe}

La **Temperature Probe** se choisit dans les Propriétés de la cuve : **Select Temperature Probe or None**.

## Ports et construction {#ports-and-build}

Les ouvertures de la cuve sont ses **IP**, réglées par son Vessel Template ou par le [Vessel Device Builder](166-vessel-device-builder). **Bundled** garde la cuve et ses IP ensemble, comme un seul bloc.

## Faits avant les Templates {#made-before-templates}

Les Equipment Profiles faits avant les Vessel Templates peuvent encore avoir une liste de cuves. Elle s'affiche dans **☰ Menu > Equipment Profile** sous **Made before Templates**, avec **Put on Tab** pour dessiner chacune sur le Tab du profil. Ensuite, changez-la dans ses Propriétés sur le Tab.
