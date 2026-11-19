# Pas à pas : câbler un ADS1115 {#step-by-step-wire-an-ads1115}

Une carte **ADS1115** lit 4 signaux analogiques bien plus finement que le Mega (16 bits). Elle parle en **I2C** : **D20 (SDA)** et **D21 (SCL)** du Mega.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Les Ports **I2C** (Mega **D20 SDA**, **D21 SCL**) (voir [I2C](13-glossary#i2c)).
- Une **carte ADS1115** (voir [ADS1115](13-glossary#ads1115)).
- Les capteurs à lire (carte pH, capteur de pression ...).

![Câblage : câbler un ADS1115](help_pictures/Step_Wire_ADS1115_01_Wiring.svg)

## Étape 1. L'alimentation {#step-1-power}

Câblez le **5V** du Mega au **VDD** de la carte, et le **GND** au **GND**.

## Étape 2. L'I2C {#step-2-i2c}

Câblez **D20** du Mega au **SDA** et **D21** au **SCL**.

## Étape 3. L'adresse {#step-3-address}

Câblez l'**ADDR** de la carte au **GND** : cela donne l'adresse 0x48, celle que lit Skynet.

## Étape 4. Les capteurs {#step-4-the-sensors}

Câblez le signal de chaque capteur sur **A0**, **A1**, **A2** ou **A3** de l'ADS1115 (pas du Mega), et son 5V et son GND comme dans son propre guide.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **Analog input on an ADS1115 board (16-bit)** avec son **ADS1115 channel** (0-3) ; un capteur de pression ou une carte pH peut aussi être réglé sur **Read by** ADS1115.

## Étape 6. Vérifier {#step-6-check-it}

Chaque canal lit son capteur ; un canal sans rien dessus flotte.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** alimentez-la en 3,3 V et gardez chaque signal sous 3,3 V. Sur un Pi, elle utilise GPIO 2 et 3.
- **Arduino Opta :** il n'a pas d'I2C pour cela ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- D20 et D21 sont aussi des Counter Ports : un débitmètre ne peut pas les utiliser tant qu'un ADS1115 est branché.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), mettez `USE_ADS1115` à 1, puis téléversez-le de nouveau.
