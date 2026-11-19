# Pas à pas : câbler une sonde pH {#step-by-step-wire-a-ph-probe}

Une **sonde pH** donne un tout petit signal qu'une **carte pH** (amplificateur) transforme en 0-5 V pour un **Port analogique**. Ce guide utilise **A5**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (ce guide : **A5**), ou un canal d'ADS1115 pour des lectures plus fines.
- Une **carte pH** (sortie 0-5 V).
- Une **sonde pH** (prise BNC).
- Des solutions tampon pH 7 et pH 4 pour calibrer.

![Câblage : câbler une sonde pH](help_pictures/Step_Wire_pH_01_Wiring.svg)

## Étape 1. Câbler la carte {#step-1-wire-the-board}

Câblez le **V+** de la carte au **5V** du Mega, le **G** au **GND**, et le **Po** (la sortie pH) à **A5**.

## Étape 2. La sonde {#step-2-the-probe}

Vissez la prise BNC de la sonde sur la carte.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **pH probe board (two-point calibration)** sur le Port **A5**.

## Étape 4. Vérifier {#step-4-check-it}

Calibrez avec le tampon **pH 7** puis **pH 4** (deux points), en rinçant la sonde entre les deux. Un troisième tampon doit alors lire près de sa valeur.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** sa sortie 5 V peut être trop forte : utilisez un ADS1115 ou une carte pH 3,3 V.
- **Arduino Opta :** utilisez un transmetteur pH à sortie 0-10 V.

## Le côté technique {#the-technical-side}

- Lisez le pH sur un échantillon refroidi : une sonde chaude lit faux et s'use vite.
- Gardez la sonde humide dans son liquide de stockage.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS`.
