# Clapets anti-retour et débitmètres {#check-valves-and-flow-meters}

Skynet a trois raccords de plus pour la tuyauterie. Comme chaque [Skynet Fitting](60-skynet-fittings), chacun a ses IP intégrés dans ses ouvertures, et vous pouvez le retourner et le tourner.

Mettez-en un sur un Tab depuis **☰ Menu > Fitting Templates** : double-cliquez dessus, puis appuyez sur **Add to Tab**.

## Clapet anti-retour {#check-valve}

**Check_Valve** laisse passer le liquide **dans un seul sens**. Il entre par l'ouverture **Start** (le côté gauche de l'image) et sort par **End** (le côté droit). La flèche sur l'image montre le sens.

- Le passage venant d'une pompe ne s'affiche à travers lui que quand la pompe pousse dans le sens de la flèche.
- Si on pousse dans l'autre sens, le clapet arrête le passage, comme une vanne fermée.
- Pour le tourner dans l'autre sens, ouvrez ses Properties en Edit layout et utilisez **Flip Horizontal** (ou **Rotate**). La flèche et les côtés entrée et sortie tournent avec l'image.

Un clapet anti-retour n'a rien à commander et n'a besoin d'aucun Device.

## Débitmètres {#flow-meters}

Un débitmètre n'arrête **pas** le passage, dans aucun sens. Le liquide le traverse dans les deux sens. Il y en a deux :

| Fitting Template | Montre |
|---|---|
| **Flow_Meter** | À quelle vitesse le liquide coule (par minute) et le total qui est passé |
| **Flow_Meter_Temp** | La même chose, plus la température du liquide |

Sur le Tab, ouvrez ses Properties en Edit layout et choisissez :

- **Flow Meter: Select Flow meter Device or None** : le Device Flow meter qui compte ses impulsions (voir [Devices](03-devices)).
- **Temperature: Select Temperature Probe or None** (Flow_Meter_Temp seulement) : la sonde de température qui est dedans.

Les mesures s'affichent dans une petite case au-dessus de l'image, par exemple `1.20 gal/min · 3.50 gal · 152.0 °F`.

## Dans un raccord groupé {#in-a-bundled-fitting}

**Check Valve**, **Flow Meter** et **Flow Meter with Temperature** sont aussi dans les listes de raccords d'un Bundled Fitting Template que vous construisez vous-même. Avec un clapet anti-retour dans la chaîne, le liquide ne peut aller que du Start (le côté cuve) vers les autres ouvertures.
