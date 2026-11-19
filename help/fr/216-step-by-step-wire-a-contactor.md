# Pas à pas : câbler un contacteur {#step-by-step-wire-a-contactor}

Un **contacteur** est un relais de puissance. Sur une **résistance en 240 V**, il coupe **les deux** phases, pour que la résistance soit vraiment Off quand Skynet dit Off ; le SSR fait la commutation rapide. Ce guide câble la **bobine** du contacteur depuis le Port **D23** par un canal de relais.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre pour le contacteur (ce guide : **D23**), et le Port du SSR ([Pas à pas : câbler un SSR](211-step-by-step-wire-an-ssr)).
- Un canal de **module relais** ([Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)).
- Un **contacteur bipolaire**, 30 ou 40 A pour une résistance de 5500 W, la tension de sa **bobine** accordée à son alimentation (24 V DC est courant) (voir [Contactor](13-glossary#contactor)).
- Une **alimentation de bobine** (24 V DC, ou ce que dit la bobine).

![Câblage : câbler un contacteur](help_pictures/Step_Wire_Contactor_01_Wiring.svg)

## Étape 1. Le relais {#step-1-the-relay}

Câblez la carte relais au Mega comme dans [Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board), avec son **IN** sur le Port **D23**.

## Étape 2. L'alimentation de la bobine par le relais {#step-2-coil-power-through-the-relay}

Câblez le **+V** de l'alimentation de bobine au **COM** du relais, et le **NO** du relais au **A1** de la bobine du contacteur.

## Étape 3. Le retour de la bobine {#step-3-coil-return}

Câblez le **A2** de la bobine du contacteur au **-V** de l'alimentation de bobine.

## Étape 4. Le côté puissance {#step-4-the-power-side}

L'entrée et la sortie **L1 / L2** du contacteur, le SSR et la résistance sont sur le secteur 240 V : **faites-les câbler par un électricien qualifié**, sur un circuit GFCI dimensionné pour la résistance.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez un **Heating Element** (par exemple **Heating Element: HYS (Target and Offset)**) sur le Port **D23**, et réglez son **Hardware Controller** sur **Contactor**. Cela lui donne un délai On plus long pour que les contacts durent.

## Étape 6. Vérifier {#step-6-check-it}

Avec le 240 V **coupé**, mettez le Device On : le contacteur se ferme avec un bruit sourd. Off : il retombe.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** utilisez une carte relais faite pour 3,3 V (voir le guide de la carte relais).
- **Arduino Opta :** faites passer l'alimentation de la bobine par un de ses propres relais (Relay 1-4).

## Le côté technique {#the-technical-side}

- Un contacteur s'use à chaque fermeture : utilisez **Direct** ou **Hysteresis**, jamais un PID ou un Duty Cycle rapide (Règle 6.29).
- Une bobine AC (120 V) se câble de la même façon, mais le côté relais est alors aussi sur le secteur : électricien qualifié seulement.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `OUTPUT_PINS`.
