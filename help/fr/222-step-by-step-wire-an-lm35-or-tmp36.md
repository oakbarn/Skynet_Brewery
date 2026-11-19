# Pas à pas : câbler un LM35 ou un TMP36 {#step-by-step-wire-an-lm35-or-tmp36}

Un **LM35** ou un **TMP36** est un petit capteur à 3 pattes pour la température de l'**air** (dans un coffret ou une pièce). Il ne demande que le 5V, le GND et un **Port analogique**. Ce guide utilise **A1**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (ce guide : **A1**).
- Un **LM35** ou un **TMP36**.

![Câblage : câbler un LM35 ou un TMP36](help_pictures/Step_Wire_LM35_01_Wiring.svg)

## Étape 1. Trouver les pattes {#step-1-find-the-legs}

Regardez sa fiche technique : face plate vers vous, les pattes sont en général **+Vs**, **Vout**, **GND** de gauche à droite. Vérifiez le vôtre : un capteur à l'envers chauffe.

## Étape 2. Le câbler {#step-2-wire-it}

Câblez **+Vs** au **5V** du Mega, **Vout** à **A1**, et **GND** au **GND**.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Probe (temperature)** > **LM35 analog temperature sensor** ou **TMP36 analog temperature sensor**, sur le Port **A1**.

## Étape 4. Vérifier {#step-4-check-it}

Il doit lire la température de la pièce ; un doigt chaud dessus la fait monter.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** un TMP36 marche sous 3,3 V ; un LM35 demande 4 V ou plus, donc alimentez-le en 5 V (sa sortie reste sous 1,5 V).
- **Arduino Opta :** seulement une alimentation 5 V pour le capteur ; sa sortie va directement sur I1-I8.

## Le côté technique {#the-technical-side}

- Un Port analogique 10 bits voit des pas d'environ 0,5 °C avec ces capteurs : bien pour l'air, trop grossier pour l'empâtage.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS`.
