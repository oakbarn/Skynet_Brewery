# Pas à pas : câbler une commande de vitesse de pompe DC {#step-by-step-wire-a-dc-pump-speed-control}

Une **pompe DC faite pour la commande de vitesse** peut tourner à n'importe quel % quand un **module MOSFET** commute son alimentation très vite depuis un **True PWM Port**. Ce guide en câble une sur le Port **D45**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **True PWM Port** libre (Mega : D2-D13, D44-D46). Ce guide utilise **D45**.
- Un **module MOSFET logic-level**, 10 A suffit largement (voir [MOSFET Module](13-glossary#mosfet-module)).
- Une **alimentation 12 ou 24 V DC** : la tension de la pompe, 1 A de plus que ce qu'elle tire.
- Une **pompe DC faite pour la commande de vitesse**. Une pompe AC est seulement On/Off.

![Câblage : câbler une commande de vitesse de pompe DC](help_pictures/Step_Wire_DCPump_01_Wiring.svg)

## Étape 1. Le signal {#step-1-the-signal}

Câblez le Port **D45** au **SIG** du module (ou IN, PWM), et le **GND** du Mega au **GND** du module.

## Étape 2. L'alimentation {#step-2-power-in}

Câblez le **+V** de l'alimentation au **V+ in** du module et le **-V** au **V- in**. Reliez aussi le **-V** de l'alimentation au **GND** du Mega.

## Étape 3. La pompe {#step-3-the-pump}

Câblez le **OUT +** du module au **+** de la pompe et le **OUT -** au **-** de la pompe.

## Étape 4. Ajouter le Device dans Skynet {#step-4-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Pumps** > **Pump speed 0-100 % (PWM output, e.g. a MOSFET module)** sur le Port **D45**.

## Étape 5. Vérifier {#step-5-check-it}

Réglez 30 %, 60 %, 100 % : la pompe tourne plus vite à chaque fois. Ne faites jamais tourner une pompe à sec.

## Autres cartes {#other-boards}

- **Une pompe avec son propre fil de vitesse (PWM)** n'a pas besoin de MOSFET : son fil de vitesse va sur **D45**, son GND relié au GND du Mega, et son alimentation directement depuis l'alimentation.
- **Une carte 3,3 V :** choisissez un module MOSFET qui commute complètement depuis 3,3 V.
- **Arduino Opta :** il n'a pas de Port PWM pour cela.

## Le côté technique {#the-technical-side}

- Utilisez un MOSFET **logic-level** : une carte IRF520 ordinaire n'est qu'à moitié passante sous 5 V et chauffe.
- D44-D46 sont déjà dans `PWM_PINS`.
