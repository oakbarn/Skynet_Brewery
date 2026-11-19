# Pas à pas : câbler une carte relais {#step-by-step-wire-a-relay-board}

Une **carte relais** (module relais) permet à un Port de commuter quelque chose de plus gros : une pompe, une vanne, une lampe, ou la bobine d'un contacteur. Le Port ne fait bouger qu'un petit aimant ; ce sont les contacts du relais qui portent la puissance. Ce guide câble la **Pump** de l'exemple 3 Vessel sur le Port **D22**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (la Pump de l'exemple utilise **D22**).
- Un canal de **module relais** : bobine 5 V pour un Mega, **opto-isolé**, contacts dimensionnés pour la charge (10 A sous 250 V AC est courant) (voir [Relay Module](13-glossary#relay-module)).
- La charge et sa propre alimentation (une alimentation DC, ou le secteur pour une prise de pompe).

![Câblage : câbler une carte relais](help_pictures/Step_Wire_Relay_01_Wiring.svg)

## Étape 1. Alimenter la carte relais {#step-1-power-the-relay-board}

Câblez le **5V** du Mega au **VCC** de la carte, et le **GND** au **GND**. Une carte avec un cavalier **JD-VCC** : laissez le cavalier sauf si son fabricant dit d'alimenter les bobines par une alimentation 5 V à part.

## Étape 2. Le fil de commande {#step-2-the-control-wire}

Câblez le Port **D22** à l'**IN1** de la carte. Le programme Skynet met un Port **On en le tirant à LOW**, ce que veulent la plupart des cartes relais : laissez **Invert** sur Off.

## Étape 3. Le côté charge {#step-3-the-load-side}

Le relais relie **COM** à **NO** tant que le Device est On. Faites passer le + de la charge (ou la phase AC) par **COM** et **NO**. **NC** est relié quand c'est Off : laissez-le vide. Tout ce qui est sur le secteur : **faites-le câbler par un électricien qualifié.**

## Étape 4. Ajouter le Device dans Skynet {#step-4-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Pumps** > **Pump, on / off (relay or SSR)** sur le Port **D22**. Pour autre chose, **On/Off** > **Relay module / SSR / contactor (on-off)**.

## Étape 5. Vérifier {#step-5-check-it}

Avec l'alimentation de la charge **coupée**, mettez le Device On : le relais claque et son petit voyant s'allume. Off : il reclaque. Si cela marche à l'envers, votre carte s'allume avec HIGH : mettez **Invert** sur On dans les attributs du Port ⬢.

## Autres cartes {#other-boards}

- **Une carte 3,3 V** peut ne pas commuter une carte relais 5 V à chaque fois : prenez une carte vendue comme **3.3 V trigger** ou **High/Low trigger**, ou utilisez un SSR ([Pas à pas : câbler un SSR](211-step-by-step-wire-an-ssr)).
- **Arduino Opta :** il a 4 relais à lui (Relay 1-4) : pas besoin de carte relais.

## Le côté technique {#the-technical-side}

- Une bobine de relais tire environ 70 mA ; une carte opto-isolée ne prend que quelques mA au Port. Ne câblez jamais une bobine de relais nue directement sur un Port.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `OUTPUT_PINS` (D22-D25 y sont au départ). `RELAY_ACTIVE_LOW` vaut `true` : On = LOW.
