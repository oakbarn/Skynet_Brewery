# Pas à pas : câbler un débitmètre {#step-by-step-wire-a-flow-meter}

Un **débitmètre à effet Hall** envoie une impulsion pour chaque petite quantité de liquide qui passe. La carte compte les impulsions sur un **Counter Port**. Ce guide utilise **D18**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Counter Port** libre (Mega : D2, D3, D18-D21, jusqu'à 6). Ce guide utilise **D18** (voir [Counter Port](13-glossary#counter-port)).
- Un **débitmètre à effet Hall** : inox et qualité alimentaire pour le moût chaud ; un YF-S201 en plastique pour l'eau froide seulement (voir [Flow Meter](13-glossary#flow-meter)).

![Câblage : câbler un débitmètre](help_pictures/Step_Wire_FlowMeter_01_Wiring.svg)

## Étape 1. Le câbler {#step-1-wire-it}

Câblez le fil **rouge** du débitmètre au **5V** du Mega, le **noir** au **GND**, et le **jaune** (les impulsions) à **D18**. Vérifiez les couleurs de votre débitmètre.

## Étape 2. Le monter {#step-2-fit-it}

Montez-le avec la flèche de son corps dans le sens où le liquide coule.

## Étape 3. Ajouter le Device dans Skynet {#step-3-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Sensors (pressure, level, pH, flow)** > **Flow meter (hall sensor, e.g. YF-S201)** sur le Port **D18**, et tapez ses impulsions par litre (sur sa fiche technique).

## Étape 4. Vérifier {#step-4-check-it}

Faites passer 10 litres mesurés et comparez ; ajustez ses impulsions par litre jusqu'à ce que cela corresponde.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** la plupart des débitmètres envoient des impulsions de 5 V. Alimentez-le en 5 V et mettez un diviseur de tension (ou un adaptateur de niveau) sur le fil d'impulsions, ou prenez un débitmètre qui marche en 3,3 V.
- **Arduino Opta :** ses entrées ne comptent que des impulsions lentes ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- Le pull-up de la carte est On pour un Counter Port, donc aucune résistance n'est nécessaire sur un Mega.
- D20 et D21 sont aussi les Ports I2C : un ADS1115 les prend.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), listez le Port dans `FLOW_PINS` (par exemple `{18}`), puis téléversez-le de nouveau.
