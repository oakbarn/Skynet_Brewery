# Pas à pas : câbler un capteur de pression {#step-by-step-wire-a-pressure-transducer}

Un **capteur de pression** lit une pression, ou la hauteur de liquide par la pression au fond d'une cuve. Le type 5 V donne **0,5-4,5 V** à un **Port analogique**. Ce guide utilise **A2**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (ce guide : **A2**).
- Un **capteur de pression 5 V, sortie 0,5-4,5 V**, inox, prévu pour la température du liquide (voir [Pressure Transducer](13-glossary#pressure-transducer)).

![Câblage : câbler un capteur de pression](help_pictures/Step_Wire_Pressure_01_Wiring.svg)

## Étape 1. Le câbler {#step-1-wire-it}

Câblez son fil **rouge** au **5V** du Mega, le **noir** au **GND**, et son fil de **signal** (souvent jaune, vert ou blanc : vérifiez son étiquette) à **A2**.

## Étape 2. Le monter {#step-2-fit-it}

Montez-le en bas de la cuve (ou dans un té en dessous), là où il est toujours sous le liquide.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **Pressure transducer 0.5-4.5 V (5 V hobby type)** sur le Port **A2**, et tapez sa plage (par exemple 0-5 psi).

## Étape 4. Vérifier {#step-4-check-it}

Vide, il doit lire environ 0. Ajoutez une hauteur d'eau connue et comparez.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** ses 4,5 V sont trop pour le Port : utilisez un diviseur de tension, ou un ADS1115 ([Pas à pas : câbler un ADS1115](227-step-by-step-wire-an-ads1115)).
- **Arduino Opta :** utilisez un capteur 0-10 V directement sur I1-I8.

## Le côté technique {#the-technical-side}

- Un ADS1115 le lit bien plus finement qu'un Port analogique 10 bits.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS`.
