# Pas à pas : câbler une sonde 10K NTC {#step-by-step-wire-a-10k-ntc-probe}

Une **thermistance 10K NTC** est la sonde de température la moins chère : sa résistance change avec la chaleur. La carte la lit sur un **Port analogique** avec une résistance en plus. Ce guide en câble une sur le Port **A0**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port analogique** libre (Mega : A0-A15). Ce guide utilise **A0**.
- Une **sonde 10K NTC** (2 fils). Sa valeur **Beta** est sur sa fiche technique (souvent 3950, ou 3977 pour le type BCS-462).
- Une **résistance de 10k ohm** : de la même valeur que la sonde (une sonde 50K demande une résistance de 50k ohm).

![Câbler une sonde 10K NTC](help_pictures/Step_Wire_NTC_01_Wiring.svg)

## Étape 1. La résistance vers 5V {#step-1-the-resistor-to-5v}

Câblez une patte de la **résistance de 10k ohm** au **5V** du Mega.

## Étape 2. La résistance vers A0 {#step-2-the-resistor-to-a0}

Câblez l'autre patte de la résistance au Port **A0**.

## Étape 3. La sonde vers A0 {#step-3-the-probe-to-a0}

Câblez un des deux fils de la sonde à **A0** aussi (là où la résistance le rejoint). Une thermistance n'a ni + ni - : n'importe quel fil.

## Étape 4. La sonde vers GND {#step-4-the-probe-to-gnd}

Câblez l'autre fil de la sonde au **GND** du Mega.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez une sonde (Select Device Type : **Probe (temperature)**) : choisissez **NTC thermistor 10K, Beta 3950 (analog pin)**, ou la ligne **BCS-462 type, Beta 3977** si c'est votre sonde, sur le Port **A0**, comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device). Dans ses Properties, **Series resistor** vaut 10000 et **Wiring** vaut **toGround** (la sonde va au GND, comme dans ce guide).

## Étape 6. Vérifier {#step-6-check-it}

Tenez la sonde dans de l'eau glacée : elle doit lire environ 32 °F (0 °C). Puis dans l'eau bouillante : environ 212 °F (100 °C) au niveau de la mer. Si elle est un peu décalée, réglez sa Calibration dans les Properties. Si elle lit très faux, vérifiez la valeur Beta et la valeur de la résistance.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** câblez la résistance au **3.3V**, jamais au 5V (Règle 6.35).
- **Arduino Opta :** une 10K NTC demande un **transmetteur 0-10 V** sur l'Opta ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- La sonde et la résistance partagent le 5 V, donc la carte lit leur rapport ; une petite variation du 5 V ne change pas la lecture.
- Skynet lisse la lecture d'une thermistance (Smoothing 25 % au départ), car un Port analogique 10 bits la rend instable.
- De longs fils de sonde ajoutent un peu de résistance : gardez-les courts, ou calibrez.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `ANALOG_PINS` (A0 y est au départ).
