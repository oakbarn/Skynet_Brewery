# Pas à pas : câbler un arrêt d'urgence {#step-by-step-wire-an-e-stop}

Un **arrêt d'urgence** (E-Stop) doit **couper le courant par son propre câblage**, pas seulement prévenir Skynet. Un bouton coup de poing à deux contacts : le **contact 1** fait retomber le **contacteur principal** qui alimente chaque résistance et pompe ; le **contact 2** prévient Skynet sur le Port **D31**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (ce guide : **D31**).
- Un **bouton d'arrêt d'urgence** avec deux contacts **normalement fermés** (voir [E-Stop](13-glossary#e-stop)).
- Un **contacteur principal** qui alimente chaque circuit de résistance et de pompe.

![Câblage : câbler un arrêt d'urgence](help_pictures/Step_Wire_EStop_01_Wiring.svg)

## Étape 1. Le contact 1 coupe le courant {#step-1-contact-1-cuts-the-power}

Le contact 1 est dans le fil de **bobine** du contacteur principal : enfoncé, la bobine perd son courant et chaque résistance et pompe s'arrête, même si l'ordinateur est planté. C'est du câblage secteur : **faites-le faire par un électricien qualifié.**

## Étape 2. Le contact 2 prévient Skynet {#step-2-contact-2-tells-skynet}

Câblez le contact 2 entre le Port **D31** et le **GND** du Mega. Non enfoncé, il est fermé.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Inputs (switches, buttons)** > **Latching input (stays on until reset: leak, E-stop, alarm)** sur le Port **D31**, et mettez **Invert** sur On dans ses Properties, pour qu'enfoncé (contact ouvert) se lise ON.

## Étape 4. Vérifier {#step-4-check-it}

Enfoncez-le : le contacteur principal retombe et Skynet montre qu'il s'est déclenché. Tournez pour le relâcher, puis réarmez-le dans Skynet.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** le contact 2 va toujours au GND (le pull-up de la carte). Jamais au 5 V.
- **Arduino Opta :** câblez le contact 2 sur une entrée avec du 24 V, comme le montre son fabricant.

## Le côté technique {#the-technical-side}

- Un contact normalement fermé est plus sûr : un fil coupé se lit comme enfoncé.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `INPUT_PINS` (D30-D33 y sont au départ).
