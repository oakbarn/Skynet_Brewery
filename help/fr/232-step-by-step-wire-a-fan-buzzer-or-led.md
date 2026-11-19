# Pas à pas : câbler un ventilateur, un buzzer ou une LED {#step-by-step-wire-a-fan-buzzer-or-led}

Une **petite LED** va sur un Port avec une résistance. Un **ventilateur** ou un **buzzer** tire plus que ce que donne un Port, donc il passe par un **relais** ou un **module MOSFET**. Ce guide utilise **D41** (LED) et **D42** (ventilateur ou buzzer).

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre pour chacun (ce guide : **D41**, **D42**).
- Pour une LED : une **résistance de 330 ohm** (220 ohm pour plus de lumière).
- Pour un ventilateur ou un buzzer : un canal de **module relais** ou un **module MOSFET**, et une **alimentation 12 V**.

![Câblage : câbler un ventilateur, un buzzer ou une LED](help_pictures/Step_Wire_FanLED_01_Wiring.svg)

## Étape 1. La LED {#step-1-the-led}

Câblez le **5V** du Mega à la résistance de **330 ohm**, la résistance à la patte **longue** de la LED, et la patte **courte** de la LED à **D41**. Le Mega met un Port On en le tirant à LOW, donc la LED s'allume quand le Device est On.

## Étape 2. Le ventilateur ou le buzzer {#step-2-the-fan-or-buzzer}

Câblez un relais (ou un module MOSFET) sur **D42** comme dans [Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board), et faites passer le 12 V du ventilateur ou du buzzer par lui.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **On/Off** > **Relay module / SSR / contactor (on-off)** sur **D41** ou **D42**. Un ventilateur sur un True PWM Port peut avoir sa vitesse réglée avec un module MOSFET ([Pas à pas : câbler une commande de vitesse de pompe DC](220-step-by-step-wire-a-dc-pump-speed-control)).

## Étape 4. Vérifier {#step-4-check-it}

Mettez chaque Device On et Off.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** câblez la résistance de la LED au **3.3V** et utilisez 100 ohm.
- **Arduino Opta :** utilisez ses relais, ou ses propres voyants.

## Le côté technique {#the-technical-side}

- Ne câblez jamais une LED sans sa résistance.
- Un Port de Mega donne au plus 20 mA, et tous les Ports ensemble environ 200 mA.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), les Ports doivent être dans `OUTPUT_PINS`.
