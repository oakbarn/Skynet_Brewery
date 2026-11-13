# Fermentor Control : chauffer et refroidir avec l'Hysteresis {#fermentor-control-heat-and-cool-with-hysteresis}

Un **Fermentor Control** tient la bière à un seul **Setpoint** en la chauffant et en la refroidissant (Règle Skynet 6.30). Il est intégré à un
Vessel Device fermenteur avec trois Devices :

1. **Heat (chauffage) :** un tapis chauffant, une ceinture chauffante, un émetteur céramique ou une lampe : une résistance, une Light ou une simple sortie.
2. **Cooling (refroidissement) :** un congélateur ou un réfrigérateur sur un relais, une pompe à glycol, ou une vanne motorisée à glycol.
3. **Temperature Probe :** celle qui lit la bière (dans un doigt de gant, ou collée sur le côté sous un peu d'isolant), pas l'air.

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.

## Comment ça marche {#how-it-works}

- Sa **Direction** est **Bi-Directional** (grisée). Chaque Offset dit où ce côté se met en marche, en Setpoint + Offset.
  **Le chauffage se met en marche** au **Heat Offset (-)**, sous le Setpoint (Setpoint 66 et -1 : à 65). **Le refroidissement se met en marche** au **Cool Offset (+)**,
  au-dessus (Setpoint 66 et 1 : à 67). Les deux s'arrêtent au Setpoint, ou un peu avant quand la Predictive Hysteresis est activée (aide 168).
- **Le chauffage et le refroidissement ne sont jamais en marche ensemble.** L'un doit avoir été arrêté pendant le **Changeover wait** (5 minutes au départ) avant que
  l'autre puisse démarrer, donc ils ne se battent jamais. Une petite baisse après un refroidissement ne lance pas tout de suite le chauffage. (Juste après
  la mise en marche du Fermentor Control, rien n'a encore tourné, donc chaque côté n'attend que son propre On delay.)
- **Protection contre les cycles courts des deux côtés.** Un congélateur ne doit pas démarrer et s'arrêter souvent, et une lampe ne devrait pas clignoter non plus.
  - **On delay :** le temps d'arrêt le plus court avant de pouvoir redémarrer (Heat 1 minute, Cool 5 minutes au départ). Quand le Fermentor
    Control est mis en marche, chaque côté attend son On delay avant son premier démarrage.
  - **Shortest run :** une fois en marche, il le reste au moins ce temps (Heat 1 minute, Cool 2 minutes au départ).
- **La fermentation produit de la chaleur** au début et a besoin de chaleur à la fin, donc chauffage et refroidissement sont à égalité.
- Une **résistance** utilisée comme Heat tourne en **Direct** (le Fermentor Control la met en marche et l'arrête), et son offset et son On
  delay restent dans ce que permet son **Hardware Controller** (aide 181).
- **Mode :** **Heat & Cool**, **Heat only** ou **Cool only**.
- **Pas de lecture** de la sonde : les deux sont arrêtés jusqu'à ce qu'elle lise de nouveau.

## En construire un {#building-one}

**Vessel > 🔨 Build a Vessel Device**, question **14. Fermentor Control** : None, Heat & Cool, Heat only ou Cool only. Un Thermowell /
Probe doit être choisi aussi. Après 🔨 Build, le panneau Vessel Builder a une ligne pour le **Heat** et une pour le **Cooling** : choisissez-en un
que vous avez, ou **➕ Add new** (Heat mat, Heat wrap, Ceramic heat emitter, une résistance ou une Light ; Freezer or fridge, Glycol pump,
Glycol valve). Ils sont intégrés à la cuve sans emplacement à eux. Le Fermentor Control est ensuite créé à côté de la cuve,
nommé d'après le Label de la cuve.

## L'utiliser {#using-it}

- **Un clic** dessus le met en marche ou l'arrête. Il montre ce qu'il fait (Heating, Cooling, Waiting to heat, Waiting to cool, Idle,
  No reading) et le Setpoint.
- **Un clic sur sa sonde** ouvre le Setpoint.
- **Properties** (double-clic en Edit layout) : la sonde, Heat, Cooling, Mode, Setpoint, les deux offsets, Changeover wait, les On
  delays et Shortest runs, et Predictive.

## Dans un Process {#in-a-process}

Le Fermentor Control est utilisé par son propre nom. Son Heat et son Cooling sont intégrés à la cuve, donc un Process les appelle par le nom de la cuve et le leur (aide 180), par exemple `FV1.MB_30_DO@Light_Lamp_FR`. Tant que le Fermentor Control est en marche, il les commande lui-même.

| Ligne | Ce qu'elle fait |
|---|---|
| `FV1 = on` / `FV1 = off` | Le met en marche ou l'arrête |
| `FV1.setpoint = 66` | Le Setpoint |
| `FV1.mode = "Cool only"` | Heat & Cool, Heat only ou Cool only |
| `FV1.heatoffset = -1` / `FV1.cooloffset = +1` | Les deux offsets, avec leurs signes : chauffage moins (sous le Setpoint), refroidissement plus (au-dessus) |
| `FV1.changeover = 300` | Le Changeover wait, en secondes |
| `FV1.heatdelay`, `FV1.heatminrun`, `FV1.cooldelay`, `FV1.coolminrun` | Les On delays et Shortest runs, en secondes |
| `x = FV1.doing` | Ce qu'il fait maintenant (lecture seule) |
