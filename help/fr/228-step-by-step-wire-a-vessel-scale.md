# Pas à pas : câbler une balance de cuve {#step-by-step-wire-a-vessel-scale}

Une **balance de cuve** pèse une cuve avec des **cellules de charge**, lues par une **carte HX711** sur deux Ports : **DT** (données) et **SCK** (horloge). Skynet transforme le poids en volume. Ce guide utilise **D34** et **D35**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Deux **Ports** libres (ce guide : **D34** DT, **D35** SCK).
- Une **carte HX711** par balance (voir [HX711 and Load Cells](13-glossary#hx711-and-load-cells)).
- Des cellules de charge : quatre demi-ponts avec une carte de jonction, ou une cellule en S dimensionnée pour la cuve pleine.

![Câblage : câbler une balance de cuve](help_pictures/Step_Wire_Scale_01_Wiring.svg)

## Étape 1. L'alimentation {#step-1-power}

Câblez le **5V** du Mega au **VCC** de la HX711, et le **GND** au **GND**.

## Étape 2. Données et horloge {#step-2-data-and-clock}

Câblez **D34** du Mega au **DT** et **D35** au **SCK**.

## Étape 3. Les cellules {#step-3-the-load-cells}

Câblez la cellule (ou la carte de jonction) sur **E+**, **E-**, **A-**, **A+** : souvent rouge E+, noir E-, blanc A-, vert A+. Les couleurs varient : vérifiez les vôtres.

## Étape 4. Ajouter le Device dans Skynet {#step-4-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Weight** > **Vessel scale: load cells on an HX711 board (weight and volume)** avec DT **D34** et SCK **D35**.

## Étape 5. Vérifier {#step-5-check-it}

À vide, faites son zéro (tare). Puis posez un poids connu et réglez le facteur jusqu'à ce qu'il lise juste.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** alimentez la HX711 en 3,3 V.
- **Arduino Opta :** il ne peut pas lire une HX711 ; utilisez un transmetteur de cellule de charge à sortie 0-10 V.

## Le côté technique {#the-technical-side}

- Éloignez les fils des cellules des fils du secteur et des pompes : ils portent de tout petits signaux.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), mettez `USE_HX711` à 1 et listez les Ports dans `HX711_DT_PINS` et `HX711_SCK_PINS` (par exemple `{34}` et `{35}`), puis téléversez-le de nouveau.
