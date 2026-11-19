# Pas à pas : câbler un moteur pas à pas {#step-by-step-wire-a-stepper-motor}

Un **moteur pas à pas** tourne par pas exacts (la trappe d'un moulin, un distributeur de houblon). Le Mega envoie **STEP** et **DIR** à un **driver pas à pas**, qui alimente le moteur par sa propre alimentation. Ce guide utilise **D36** (STEP), **D37** (DIR) et **D38** (ENABLE).

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Deux ou trois **Ports** libres (ce guide : **D36**, **D37**, **D38**), plus un pour un contact de position si vous en utilisez un.
- Un **driver pas à pas** (A4988, DRV8825, TMC2209, TB6600 ...) (voir [Stepper Driver](13-glossary#stepper-driver)).
- Une **alimentation 12-24 V DC** pour le moteur : jamais le 5V du Mega.
- Un **moteur pas à pas**.

![Câblage : câbler un moteur pas à pas](help_pictures/Step_Wire_Stepper_01_Wiring.svg)

## Étape 1. Le côté logique {#step-1-logic-side}

Câblez le **5V** du Mega au **VDD** du driver, et le **GND** à son **GND** logique.

## Étape 2. STEP, DIR, ENABLE {#step-2-step-dir-enable}

Câblez **D36** à **STEP**, **D37** à **DIR** et **D38** à **EN**.

## Étape 3. L'alimentation du moteur {#step-3-motor-power}

Câblez le **+V** de l'alimentation à **VMOT** et le **-V** au **GND** moteur. Une petite carte driver demande un condensateur de 100 uF entre VMOT et GND.

## Étape 4. Le moteur {#step-4-the-motor}

Câblez la bobine 1 sur **1A** et **1B**, la bobine 2 sur **2A** et **2B** (un multimètre trouve chaque paire : les deux fils d'une bobine montrent quelques ohms).

## Étape 5. Régler le courant {#step-5-set-the-current}

Réglez la limite de courant du driver pour votre moteur, comme le montre son fabricant, avant le premier essai.

## Étape 6. Ajouter le Device dans Skynet {#step-6-add-the-device-in-skynet}

Ajoutez-le comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) : choisissez **Motors** > **Stepper motor on a STEP / DIR driver (A4988, DRV8825, TMC2209, TB6600, DM542)** avec ses Ports.

## Étape 7. Vérifier {#step-7-check-it}

Faites-le avancer de quelques pas dans chaque sens. S'il ne fait que bourdonner, une bobine est inversée ou le courant est trop bas.

## Autres cartes {#other-boards}

- **Un moteur 28BYJ-48 sur une carte ULN2003** utilise 4 Ports et le 5 V : choisissez sa propre ligne.
- **Une carte 3,3 V :** la plupart des drivers acceptent un STEP en 3,3 V ; vérifiez le vôtre.
- **Arduino Opta :** un relais ne peut pas donner d'impulsions de pas ; utilisez un driver avec son propre contrôleur, ou mettez le moteur sur un Mega.

## Le côté technique {#the-technical-side}

- Ne débranchez jamais un moteur quand le driver est alimenté : cela peut détruire le driver.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), mettez `USE_STEPPER` à 1 et listez chaque Port qu'il utilise dans `STEPPER_PINS` (par exemple `{36, 37, 38}`), puis téléversez-le de nouveau.
