# Pas à pas : câbler des interrupteurs et des flotteurs {#step-by-step-wire-switches-and-float-switches}

Un **interrupteur**, un **flotteur**, un **bouton poussoir**, un **détecteur de débit**, un **détecteur de fuite** ou une **sécurité de couvercle** n'a besoin que de deux fils : un vers le Port, un vers le **GND**. Le pull-up de la carte maintient le Port en haut jusqu'à ce que le contact se ferme. Ce guide utilise **D32**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (ce guide : **D32**).
- L'interrupteur (basse tension seulement) (voir [Float Switch](13-glossary#float-switch)).

![Câblage : câbler des interrupteurs et des flotteurs](help_pictures/Step_Wire_Switch_01_Wiring.svg)

## Étape 1. Le câbler {#step-1-wire-it}

Câblez un des fils de l'interrupteur à **D32** et l'autre au **GND** du Mega. Dans n'importe quel sens.

## Étape 2. Un flotteur {#step-2-a-float-switch}

Montez-le pour qu'il se ferme au niveau que vous voulez connaître (la plupart peuvent être retournés pour se fermer en montant ou en descendant).

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Inputs (switches, buttons)** > la ligne qui convient : **Switch (on while closed)**, **Push button ...**, **Toggle button ...** ou **Latching input ...** ; un flotteur est **Float / level switch**, sur le Port **D32**.

## Étape 4. Vérifier {#step-4-check-it}

Fermez le contact : Skynet montre ON. Ouvrez-le : OFF. À l'envers ? Mettez **Invert** sur On dans ses Properties.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** pareil ; ne câblez jamais du 5 V sur un Port 3,3 V.
- **Arduino Opta :** ses entrées veulent du 24 V : câblez l'interrupteur entre le 24 V et l'entrée.

## Le côté technique {#the-technical-side}

- Fermé = ON : le Mega lit le Port à LOW et Skynet montre ON.
- Ne câblez jamais un interrupteur sur le secteur.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `INPUT_PINS` (D30-D33 y sont au départ).
