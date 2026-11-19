# Pas à pas : câbler des sondes 1-Wire (DS18B20) {#step-by-step-wire-1-wire-probes-ds18b20}

Les sondes **DS18B20** parlent en **1-Wire** (OneWire) : plusieurs sondes partagent les trois mêmes fils et un seul Port, chacune avec son propre numéro. Les sondes **HLT**, **Mash** et **Kettle** de l'exemple 3 Vessel sont des DS18B20. Sur un Mega, le Port 1-Wire est **D40**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Le **Port 1-Wire** (Mega : **D40**), partagé par toutes les DS18B20.
- Une **résistance de 4,7k ohm** (le **pull-up**) pour tout l'ensemble, pas une par sonde.
- Une ou plusieurs **sondes DS18B20 étanches** à **3 fils**. Skynet n'utilise jamais le mode parasite (2 fils) : chaque sonde a son propre fil 5 V.
- **Alimentation des sondes : le mieux est une alimentation 5 V DC à part.** Le 5V du Mega marche aussi pour quelques sondes sur des fils courts.
- Un bornier à vis ou une petite carte aide à relier les fils.

![Câbler des sondes DS18B20 en 1-Wire](help_pictures/Step_Wire_OneWire_01_Wiring.svg)

## Ce que fait le pull-up {#what-the-pull-up-does}

Le fil de données n'a pas de tension à lui. Le Mega et chaque sonde parlent en **tirant le fil de données vers GND** un instant ; rien ne le remonte. La **résistance de pull-up**, du fil de données vers le 5 V, le ramène doucement à 5 V entre ces instants, pour que chaque impulsion ait un front net que le Mega peut lire.

- **Sans elle**, le Mega ne trouve aucune sonde, ou elles lisent -196 °F (-127 °C).
- **4,7k ohm est la valeur standard**, et convient à la plupart des brasseries.
- **Les fils longs ou chargés demandent un pull-up plus fort :** plus d'environ 30 m de câble en tout, ou plus d'environ 10 sondes, ralentissent les fronts. Utilisez alors une résistance de **2,2k ohm**. Ne descendez pas sous 2,2k ohm : les sondes ne pourraient plus tirer le fil vers le bas.
- **Une par ensemble de sondes**, côté Mega, entre **D40** et **le même 5 V qui alimente les sondes**.

## Étape 1. Alimentation et masse {#step-1-power-and-ground}

Câblez le **+5 V** de l'alimentation à un bornier pour les fils rouges des sondes, et son **-V** au **GND** du Mega. Toutes les masses doivent être reliées : le -V de l'alimentation, le GND du Mega et le fil noir de chaque sonde. (Avec le 5V du Mega à la place : câblez le **5V** du Mega à ce bornier.)

## Étape 2. Le fil de données et le pull-up {#step-2-the-data-wire-and-the-pull-up}

Câblez **D40** du Mega à un bornier pour les fils jaunes des sondes. Câblez la **résistance de 4,7k ohm** de ce bornier de données au bornier **+5 V**, une seule fois, près du Mega.

## Étape 3. Chaîner les sondes {#step-3-daisy-chain-the-probes}

Tirez **un seul câble de sonde en sonde** (en chaîne), et reliez chaque sonde par une courte dérivation : **rouge** au 5 V, **jaune** (ou blanc) aux données, **noir** au GND. Certaines sondes ont d'autres couleurs : vérifiez les vôtres. Évitez l'étoile (plusieurs longs câbles partant d'un même point) : elle fait résonner les impulsions.

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

- Utilisez du câble en paires torsadées (un câble réseau convient : une paire pour données et GND, une pour 5 V et GND) pour les grandes longueurs.
- Le programme Skynet du Mega lit **un seul** Port 1-Wire. Pour plus de sondes qu'un Port ne porte bien, mettez-les sur une deuxième carte (sa propre Interface).
- Une alimentation à part est le mieux car une grande longueur fait chuter la tension du fil 5 V, et les sondes lisent alors faux pendant leur conversion.
- Skynet règle chaque sonde sur ses pas les plus fins (0,0625 °C, environ 0,11 °F).
- Dans le programme du Mega (`Mega_BrewPanel.ino`), `ONEWIRE_PIN` vaut 40.
