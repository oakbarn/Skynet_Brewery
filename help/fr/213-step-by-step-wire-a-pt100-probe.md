# Pas à pas : câbler une sonde PT100 {#step-by-step-wire-a-pt100-probe}

Une **PT100** est une sonde RTD, le type de sonde de température le plus précis. La carte la lit par une **carte MAX31865** faite pour la PT100 (sa résistance de référence est de **430 ohm**). La MAX31865 parle au Mega sur les Ports **SPI** partagés et son propre Port **CS**. Ce guide utilise le Port CS **D48**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Les Ports **SPI** (Mega **D50, D51, D52**), partagés par toutes les cartes MAX31865 et thermocouple.
- Un **Port CS** libre pour cette carte (Mega : seulement D14-D17, D22-D39, D41-D43, D47-D49, D53 ; Règle 6.9). Ce guide utilise **D48**.
- Une **carte MAX31865** pour une **PT100** (résistance de référence de 430 ohm). Pour une PT1000, voir [Pas à pas : câbler une sonde PT1000](214-step-by-step-wire-a-pt1000-probe).
- Une **sonde PT100**, 3 fils le plus souvent (voir [RTD](13-glossary#rtd)).

![Câbler une sonde PT100 sur une carte MAX31865](help_pictures/Step_Wire_PT100_01_Wiring.svg)

## Étape 1. Régler la carte pour 3 fils {#step-1-set-the-board-for-3-wires}

La carte est livrée réglée pour 2 ou 4 fils. Pour une sonde 3 fils, réglez ses ponts à souder pour 3 fils, comme le montre le guide du fabricant de la carte.

## Étape 2. L'alimentation {#step-2-power}

Câblez le **5V** du Mega au **Vin** de la carte, et le **GND** au **GND**.

## Étape 3. Les fils SPI {#step-3-the-spi-wires}

Câblez **D52** du Mega au **CLK** de la carte, **D50** au **SDO**, et **D51** au **SDI**. Toutes les cartes MAX31865 partagent ces trois fils.

## Étape 4. Le fil CS {#step-4-the-cs-wire}

Câblez **D48** du Mega au **CS** de la carte. Chaque carte MAX31865 a son propre Port CS.

## Étape 5. La sonde {#step-5-the-probe}

Une sonde 3 fils a deux fils de la même couleur et un d'une autre couleur. Mettez le fil de couleur différente d'un côté des bornes et les deux fils de même couleur de l'autre côté, comme le montre l'image 3 fils du fabricant de la carte.

## Étape 6. Ajouter le Device dans Skynet {#step-6-add-the-device-in-skynet}

Ajoutez une sonde (Select Device Type : **Probe (temperature)** > **PT100 RTD (MAX31865 board)**) avec son Port CS **D48**, comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device). Dans ses Properties, **Probe wires** vaut **3** et **Board reference resistor** vaut **430**.

## Étape 7. Vérifier {#step-7-check-it}

Dans l'eau glacée, elle doit lire environ 32 °F (0 °C). Un défaut (pas de lecture) veut le plus souvent dire que les ponts ne sont pas réglés pour 3 fils, ou que les fils de la sonde sont du mauvais côté.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** câblez le **3.3V** au Vin. Ses Ports SPI sont dans [Skynet Boards](206-skynet-boards).
- **Arduino Opta :** une PT100 demande l'extension A0602 ou un transmetteur ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- Une PT100 sur une MAX31865 voit des pas d'environ 0,03 °C, assez fins pour le chauffage Precise.
- 3 fils annulent la résistance propre des fils de la sonde ; 4 fils le font le mieux ; 2 fils seulement pour des fils courts.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), mettez `USE_RTD` à 1 et listez le Port CS dans `RTD_CS_PINS` (par exemple `{48}`), puis téléversez-le de nouveau.
