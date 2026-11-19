# Pas à pas : câbler un capteur 0-10 V {#step-by-step-wire-a-0-10-v-sensor}

Un **capteur 0-10 V** donne plus de volts que n'en accepte un Port analogique de Mega (5 V). Deux résistances égales (un **diviseur de tension**) les divisent par deux. Ce guide utilise **A4**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (ce guide : **A4**).
- Deux **résistances de 10k ohm** (1 % si possible).
- Un **capteur 0-10 V** et sa propre alimentation.

![Câblage : câbler un capteur 0-10 V](help_pictures/Step_Wire_ZeroTen_01_Wiring.svg)

## Étape 1. La résistance du haut {#step-1-the-top-resistor}

Câblez une résistance de **10k ohm** de la **OUT** du capteur à **A4**.

## Étape 2. La résistance du bas {#step-2-the-bottom-resistor}

Câblez l'autre résistance de **10k ohm** de **A4** au **GND** du Mega.

## Étape 3. Relier les masses {#step-3-join-the-grounds}

Câblez le **GND** du capteur (et le - de son alimentation) au **GND** du Mega.

## Étape 4. Ajouter le Device dans Skynet {#step-4-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **Analog input 0-10 V (with voltage divider)** sur le Port **A4**, avec **Input divider** à 2.

## Étape 5. Vérifier {#step-5-check-it}

Mesurez la OUT du capteur et A4 avec un multimètre : A4 doit être la moitié.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** mettez 22k ohm en haut et 10k ohm en bas (10 V = environ 3,1 V), et Input divider à 3,2.
- **Arduino Opta :** ses entrées lisent 0-10 V : pas de diviseur.

## Le côté technique {#the-technical-side}

- Ne mettez jamais 10 V directement sur un Port de Mega : cela peut détruire la carte.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS`.
