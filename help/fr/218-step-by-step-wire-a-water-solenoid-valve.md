# Pas à pas : câbler une électrovanne à eau {#step-by-step-wire-a-water-solenoid-valve}

Une **électrovanne** s'ouvre d'un coup quand sa bobine est alimentée et se ferme quand le courant s'en va. La plupart demandent de la pression d'eau, donc elles conviennent à l'eau du robinet ou de refroidissement. Ce guide câble une vanne 12 V **normalement fermée** sur le Port **D25**, avec une **diode** sur sa bobine.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (ce guide : **D25**).
- Un canal de **module relais** ([Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)).
- Une **alimentation 12 V ou 24 V DC** : la tension de la vanne.
- Une **électrovanne normalement fermée** : qualité alimentaire (inox) pour le moût, le laiton convient pour l'eau de refroidissement (voir [Solenoid Valve](13-glossary#solenoid-valve)).
- Une **diode 1N4007**, si la vanne n'en a pas (voir [Diode](13-glossary#diode)).

![Câblage : câbler une électrovanne à eau](help_pictures/Step_Wire_Solenoid_01_Wiring.svg)

## Étape 1. Le relais {#step-1-the-relay}

Câblez la carte relais au Mega, avec son **IN** sur le Port **D25**.

## Étape 2. L'alimentation de la bobine {#step-2-coil-power}

Câblez le **+V** de l'alimentation au **COM** du relais, le **NO** du relais au **+** de la bobine, et le **-** de la bobine au **-V** de l'alimentation.

## Étape 3. La diode {#step-3-the-diode}

Placez la **diode 1N4007** entre les deux fils de la bobine, sa **bague vers le +**. Elle absorbe le choc quand la bobine s'éteint, pour qu'il ne brûle pas les contacts du relais. À l'envers, elle court-circuite l'alimentation.

## Étape 4. Ajouter le Device dans Skynet {#step-4-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Valves** > une ligne de vanne, ou **On/Off** > **Relay module / SSR / contactor (on-off)**, sur le Port **D25**. Une vanne d'eau du robinet : activez **Tap water valve** dans ses Properties.

## Étape 5. Vérifier {#step-5-check-it}

Eau coupée, mettez le Device On : la vanne s'ouvre avec un clic. Off : elle se ferme avec un clic. Puis ouvrez l'eau et vérifiez les fuites.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** utilisez une carte relais 3,3 V, ou un SSR DC (type « DD ») à la place du relais.
- **Arduino Opta :** utilisez un de ses relais ; gardez la diode.

## Le côté technique {#the-technical-side}

- Une électrovanne chauffe tant qu'elle est ouverte : c'est normal.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `OUTPUT_PINS`.
