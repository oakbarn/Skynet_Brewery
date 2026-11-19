# Pas à pas : câbler des sondes 1-Wire (DS18B20) {#step-by-step-wire-1-wire-probes-ds18b20}

Les sondes **DS18B20** parlent en **1-Wire** (OneWire) : plusieurs sondes partagent les trois mêmes fils et un seul Port, chacune avec son propre numéro. Les sondes **HLT**, **Mash** et **Kettle** de l'exemple 3 Vessel sont des DS18B20. Sur un Mega, le Port 1-Wire est **D40**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Le **Port 1-Wire** (Mega : **D40**), partagé par toutes les DS18B20.
- Une **résistance de 4,7k ohm** pour tout l'ensemble (pas une par sonde).
- Une ou plusieurs **sondes DS18B20 étanches** (3 fils).
- Un bornier à vis ou une petite carte aide à relier les fils.

![Câbler des sondes DS18B20 en 1-Wire](help_pictures/Step_Wire_OneWire_01_Wiring.svg)

## Étape 1. Tirer trois fils {#step-1-run-three-wires}

Tirez trois fils depuis le Mega : **5V**, **D40** et **GND**. Chaque sonde rejoint ces trois mêmes fils.

## Étape 2. La résistance de 4,7k ohm {#step-2-the-4-7k-ohm-resistor}

Câblez la **résistance de 4,7k ohm** entre **D40** et **5V**, une seule fois, près du Mega.

## Étape 3. Relier chaque sonde {#step-3-join-each-probe}

Câblez le fil **rouge** de chaque sonde au 5V, le **jaune** (ou blanc) à D40, et le **noir** au GND. Certaines sondes ont d'autres couleurs : vérifiez les vôtres.

## Étape 4. Ajouter chaque sonde dans Skynet {#step-4-add-each-probe-in-skynet}

Ajoutez une sonde (Select Device Type : **Probe (temperature)** > **DS18B20 (OneWire, waterproof probe)**) pour chacune, comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device). Skynet trouve chaque sonde par son propre numéro.

## Étape 5. Les distinguer {#step-5-tell-them-apart}

Réchauffez une sonde dans votre main (ou dans de l'eau tiède) et regardez quelle lecture monte. Nommez cette sonde, par exemple **HLT**. Passez à la suivante.

## Étape 6. Vérifier {#step-6-check-it}

Dans l'eau glacée, chaque sonde doit lire environ 32 °F (0 °C). Une sonde qui lit 185 °F (85 °C) ou -196 °F (-127 °C) est mal câblée : vérifiez ses trois fils et la résistance.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** utilisez le **3.3V** à la place du 5V pour les sondes et la résistance.
- Le Port 1-Wire de chaque carte est dans [Skynet Boards](206-skynet-boards) (un Pi utilise GPIO 4).
- **Arduino Opta :** gardez les sondes DS18B20 sur un Mega ; voir [Skynet Boards](206-skynet-boards).

## Le côté technique {#the-technical-side}

- De longues longueurs (plus d'environ 30 m en tout) ou beaucoup de sondes peuvent demander un pull-up plus fort (une résistance de 2,2k ohm) ou du câble blindé.
- Skynet règle chaque sonde sur ses pas les plus fins (0,0625 °C, environ 0,11 °F).
- Dans le programme du Mega (`Mega_BrewPanel.ino`), `ONEWIRE_PIN` vaut 40.
