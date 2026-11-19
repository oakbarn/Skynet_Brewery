# Pas à pas : câbler un SSR {#step-by-step-wire-an-ssr}

Un **SSR** (relais statique) permet à un petit signal de la carte de commuter une pompe ou une résistance sur le courant alternatif, sans bruit et sans pièce mobile. Ce guide câble le côté basse tension d'un SSR au Port **D23** pour une résistance. Le côté alternatif est pour un électricien qualifié.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **Port** libre (Mega : D22-D43 ou D47-D53 sont les meilleurs pour un SSR ; voir l'étape 6). Ce guide utilise **D23**.
- Un **SSR**, entrée DC et sortie AC (type **DA**), à passage par zéro, d'une marque connue ; 25 ou 40 A pour une résistance, 5 ou 10 A pour une pompe (voir [SSR](13-glossary#ssr)).
- Un **dissipateur** pour le SSR (le SSR d'une résistance sans dissipateur surchauffe).
- Du fil pour le côté basse tension (rouge et jaune sur l'image).

![Câbler un SSR](help_pictures/Step_Wire_SSR_01_Wiring.svg)

## Étape 1. Monter le SSR {#step-1-mount-the-ssr}

Montez le SSR sur son dissipateur, avec de la pâte ou un pad thermique, comme le montre son fabricant.

## Étape 2. 5V vers l'entrée + du SSR {#step-2-5v-to-the-ssr-s-input}

Câblez le **5V** du Mega à l'entrée **3 (+)** du SSR.

## Étape 3. Le Port vers l'entrée - du SSR {#step-3-the-port-to-the-ssr-s-input}

Câblez le Port **D23** à l'entrée **4 (-)** du SSR.

Le programme Skynet du Mega met un Port **On en le tirant à LOW** (comme une carte relais), donc ainsi le SSR est On quand le Device est On, et Off pendant le démarrage de la carte.

## Étape 4. Le côté alternatif {#step-4-the-ac-side}

Les bornes **1** et **2** du SSR ne commutent que le fil de **phase** vers la pompe ou la résistance ; la terre et le neutre vont directement à la charge. C'est le secteur : **faites-le câbler par un électricien qualifié**, sur un circuit GFCI dimensionné pour la charge. Une résistance en 240 V demande aussi un contacteur qui coupe les deux phases.

## Étape 5. Ajouter le Device dans Skynet {#step-5-add-the-device-in-skynet}

Ajoutez un **Heating Element** (Select Device Type : **Heating Element**, par exemple **Heating Element: HYS (Target and Offset)**) ou une **Pump** sur le Port **D23**, comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device).

## Étape 6. Pourquoi pas un True PWM Port {#step-6-why-not-a-true-pwm-port}

Sur un **True PWM Port** (Mega D2-D13, D44-D46), Skynet envoie PID et Deadband en PWM rapide, ce qui est pour un DAC ([Pas à pas : câbler un DAC](209-step-by-step-wire-a-dac)). Un SSR à passage par zéro ne peut pas le suivre. Sur un Port ordinaire, PID et Duty Cycle commutent le SSR lentement (quelques fois par minute), ce qu'il suit bien.

## Étape 7. Vérifier {#step-7-check-it}

Avec le courant alternatif **coupé**, mettez le Device On dans Skynet : le petit voyant du SSR s'allume. Mettez-le Off : le voyant s'éteint. Si cela marche à l'envers, les fils d'entrée sont inversés ou **Invert** est coché dans les attributs du Port ⬢ : annulez-le.

## Autres cartes {#other-boards}

- **Une carte 3,3 V :** câblez le **3.3V** au 3 (+) du SSR. La plupart des SSR s'allument de 3 à 32 V ; vérifiez que le vôtre indique 3 V.
- **Arduino Opta :** ses sorties sont des relais. Voir [Skynet Boards](206-skynet-boards) pour les SSR sur un Opta.

## Le côté technique {#the-technical-side}

- L'entrée d'un SSR demande environ 10 mA ; un Port de Mega donne jusqu'à 20 mA. Un Port d'Uno R4 ne donne que 8 mA : utilisez un SSR avec son propre circuit de commande.
- Un SSR laisse passer un tout petit courant quand il est Off : un multimètre peut montrer des volts sur la charge. Débranchez toujours avant de toucher.
- Dans le programme du Mega (`Mega_BrewPanel.ino`), le Port doit être dans `OUTPUT_PINS` (D22-D25 y sont au départ). `RELAY_ACTIVE_LOW` vaut `true` : On = LOW.
