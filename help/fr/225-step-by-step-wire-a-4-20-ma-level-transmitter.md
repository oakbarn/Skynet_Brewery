# Pas à pas : câbler un transmetteur de niveau 4-20 mA {#step-by-step-wire-a-4-20-ma-level-transmitter}

Un **transmetteur de niveau 4-20 mA** envoie un courant : 4 mA = vide, 20 mA = plein. Une **résistance de 250 ohm** le transforme en 1-5 V pour un **Port analogique**. Ce guide utilise **A3**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (ce guide : **A3**).
- Une **résistance de 250 ohm** (1 % si possible).
- Une **alimentation 24 V DC** pour la boucle.
- Un **transmetteur de niveau 4-20 mA 2 fils**, prévu pour la température du liquide (voir [Level Transmitter](13-glossary#level-transmitter)).

![Câblage : câbler un transmetteur de niveau 4-20 mA](help_pictures/Step_Wire_Level_01_Wiring.svg)

## Étape 1. Alimenter la boucle {#step-1-power-the-loop}

Câblez le **+V** de l'alimentation au **+** du transmetteur.

## Étape 2. Vers le Mega {#step-2-into-the-mega}

Câblez le **-** du transmetteur à **A3**.

## Étape 3. La résistance {#step-3-the-resistor}

Câblez la **résistance de 250 ohm** de **A3** au **GND** du Mega.

## Étape 4. Relier les masses {#step-4-join-the-grounds}

Câblez le **-V** de l'alimentation au **GND** du Mega.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **Level transmitter 4-20 mA** sur le Port **A3**, avec **Resistor across the input** à 250, et tapez sa plage.

## Étape 6. Vérifier {#step-6-check-it}

Vide, il doit lire 0 (4 mA = 1 V sur A3). Une lecture proche de 0 V sur A3 veut dire que la boucle est ouverte : vérifiez les fils.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** 20 mA dans 250 ohm font 5 V, trop : utilisez une résistance de 150 ohm (20 mA = 3 V) et tapez 150.
- **Arduino Opta :** utilisez un transmetteur 0-10 V sur I1-I8.

## Le côté technique {#the-technical-side}

- 20 mA x 250 ohm = 5 V, le haut d'un Port analogique de Mega. Un petit défaut peut dépasser ; une diode Zener 5,1 V de A3 au GND protège le Port.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS`.
