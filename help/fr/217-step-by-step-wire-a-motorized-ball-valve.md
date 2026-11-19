# Pas à pas : câbler une vanne à bille motorisée {#step-by-step-wire-a-motorized-ball-valve}

Une **vanne à bille motorisée** s'ouvre et se ferme par son propre petit moteur. Le type courant a **3 fils** : alimentation +, un fil de **commande**, et GND. Du courant sur le fil de commande l'ouvre ; sans courant elle se ferme. Ce guide câble la vanne **HLT out** de l'exemple 3 Vessel sur le Port **D24**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (le HLT out de l'exemple utilise **D24**).
- Un canal de **module relais** ([Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)).
- Une **alimentation 12 V ou 24 V DC** : la tension de la vanne (une alimentation fait marcher plusieurs vannes).
- Une **vanne à bille motorisée**, 3 fils, un fil de commande (son câblage est sur son étiquette) (voir [Motorized Ball Valve](13-glossary#motorized-ball-valve)).

![Câblage : câbler une vanne à bille motorisée](help_pictures/Step_Wire_MBV_01_Wiring.svg)

## Étape 1. Le relais {#step-1-the-relay}

Câblez la carte relais au Mega, avec son **IN** sur le Port **D24**.

## Étape 2. L'alimentation permanente {#step-2-always-on-power}

Câblez le **+V** de l'alimentation au fil **power +** de la vanne, et aussi au **COM** du relais.

## Étape 3. Le fil de commande {#step-3-the-control-wire}

Câblez le **NO** du relais au fil de **commande** de la vanne.

## Étape 4. La masse {#step-4-ground}

Câblez le fil **GND** de la vanne au **-V** de l'alimentation.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Valves** > **Motorized Ball Valve, open / closed (relay)** sur le Port **D24**.

## Étape 6. Vérifier {#step-6-check-it}

Mettez le Device On : après quelques secondes la vanne tourne pour s'ouvrir. Off : elle tourne pour se fermer. Si elle fait l'inverse, votre vanne est du type « courant pour fermer » : passez sur son autre fil comme le montre son étiquette.

## Autres cartes {#other-boards}

- **Une vanne avec un fil Ouvrir et un fil Fermer** (2 fils de commande) demande deux relais et deux Ports : activez **Dual Throw** dans ses Properties, pour que les deux ne soient jamais On ensemble (voir [Dual throw](167-dual-throw)).
- **Un actionneur AC** (120 V) : câblez-le comme une pompe sur un SSR ou un relais, par un électricien qualifié.
- **Arduino Opta :** utilisez un de ses relais à la place de la carte relais.

## Le côté technique {#the-technical-side}

- Une vanne consomme le plus pendant qu'elle bouge : dimensionnez l'alimentation pour toutes les vannes qui peuvent bouger en même temps.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `OUTPUT_PINS`.
