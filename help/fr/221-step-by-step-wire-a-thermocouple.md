# Pas à pas : câbler un thermocouple {#step-by-step-wire-a-thermocouple}

Un **thermocouple** lit les endroits très chauds (un brûleur, un conduit de fumée). La carte le lit par une carte **MAX31856** (tous types : K, J, T ...) ou **MAX31855** (type K seulement) sur les Ports **SPI** partagés et son propre Port **CS**. Ce guide utilise le Port CS **D49**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Les Ports **SPI** (Mega **D50, D51, D52**), partagés avec chaque carte RTD.
- Un **Port CS** libre (ce guide : **D49**).
- Une carte **MAX31856** ou **MAX31855**.
- Un **thermocouple** (et du fil de thermocouple, jamais du cuivre ordinaire, s'il faut le rallonger) (voir [Thermocouple](13-glossary#thermocouple)).

![Câblage : câbler un thermocouple](help_pictures/Step_Wire_Thermocouple_01_Wiring.svg)

## Étape 1. L'alimentation {#step-1-power}

Câblez le **5V** du Mega au **Vin** de la carte, et le **GND** au **GND**.

## Étape 2. Les fils SPI {#step-2-the-spi-wires}

Câblez **D52** du Mega au **CLK**, **D50** au **SDO** et **D51** au **SDI** (une MAX31855 n'a pas de SDI : ne lui branchez pas D51).

## Étape 3. Le fil CS {#step-3-the-cs-wire}

Câblez **D49** du Mega au **CS** de la carte.

## Étape 4. La sonde {#step-4-the-probe}

Câblez le **+** du thermocouple au **T+** et le **-** au **T-**. Les couleurs changent selon le pays et le type : vérifiez les vôtres. À l'envers, il lit vers le bas quand il chauffe.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Probe (temperature)** > **Thermocouple type K (MAX31855 board)** ou **Thermocouple K / J / T and others (MAX31856 board)**, avec le Port CS **D49**.

## Étape 6. Vérifier {#step-6-check-it}

À la température ambiante il doit lire environ l'ambiante ; tenu dans la main, un peu plus.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** câblez le **3.3V** au Vin.
- **Arduino Opta :** un thermocouple demande un **transmetteur 0-10 V** ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- Un thermocouple dérive un peu : utilisez une RTD pour l'empâtage et l'ébullition, un thermocouple pour la chaleur d'une flamme.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), mettez `USE_TC` à 1 (MAX31856) ou 2 (MAX31855) et listez le Port CS dans `TC_CS_PINS` (par exemple `{49}`), puis téléversez-le de nouveau.
