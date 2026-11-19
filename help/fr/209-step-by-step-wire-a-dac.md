# Pas à pas : câbler un DAC (0-10 V) {#step-by-step-wire-a-dac-0-10-v}

Un **DAC** transforme un % de Skynet en un signal 0-10 V régulier, pour qu'une résistance, une vanne proportionnelle ou une commande de vitesse de pompe se règle à n'importe quel %, et pas seulement On ou Off. Sur un Mega, le DAC est un **module PWM vers 0-10 V** sur un **True PWM Port**. Ce guide en câble un vers un **régulateur de puissance 0-10 V** pour une résistance, sur le Port **D44**.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Vous êtes responsable de votre propre sécurité.** Ce guide montre une façon simple et très générale de câbler cette pièce. Il ne peut pas connaître votre câblage, vos pièces ni votre installation électrique. Lisez la fiche technique de chaque pièce avant de la câbler, et faites faire ou vérifier par un électricien qualifié tout ce qui est sur le courant alternatif (secteur). Câblez hors tension, la carte débranchée.

La carte de l'exemple est l'**Arduino Mega 2560**, la carte standard de Skynet. Les autres cartes se câblent de la même façon : seuls les noms des Ports changent (voir [Skynet Boards](206-skynet-boards)).

## Il vous faut {#you-need}

- Un **True PWM Port** libre (Mega : D2-D13 ou D44-D46). Ce guide utilise **D44**.
- Un **module PWM vers 0-10 V** (voir [DAC](13-glossary#dac)), réglé pour donner **0-10 V**.
- Une **alimentation 12 ou 24 V DC** pour le module (la tension que demande le module).
- Un **régulateur de puissance 0-10 V** (SCR ou SSVR) sur son dissipateur, dimensionné pour la résistance (voir [0-10V Controller](13-glossary#0-10v-controller)).
- Du fil pour le côté basse tension (rouge, noir, jaune, bleu sont les couleurs de l'image).

![Câbler un module PWM vers 0-10 V](help_pictures/Step_Wire_DAC_01_Wiring.svg)

## Étape 1. Régler le module {#step-1-set-the-module}

Réglez le cavalier ou la vis du module pour une sortie **0-10 V**, comme le montre son fabricant. Certains modules ont aussi un réglage d'entrée : réglez-le pour le signal de la carte (5 V pour un Mega).

## Étape 2. Alimenter le module {#step-2-power-the-module}

Câblez le **+V** de l'alimentation au **VCC** du module et le **-V** de l'alimentation au **GND** d'alimentation du module. Ne branchez pas encore l'alimentation.

## Étape 3. Relier les masses {#step-3-join-the-grounds}

Câblez le **GND** du Mega au **GND** du module. Le GND du Mega, le GND du module et le -V de l'alimentation doivent tous être reliés, sinon le signal n'a aucune référence.

## Étape 4. Câbler le signal d'entrée {#step-4-wire-the-signal-in}

Câblez le Port **D44** du Mega au **PWM in** du module.

## Étape 5. Câbler le signal de sortie {#step-5-wire-the-signal-out}

Câblez le **VOUT** du module au **0-10 V +** du régulateur et le **GND** de sortie du module au **0-10 V -** du régulateur.

## Étape 6. Le côté alternatif {#step-6-the-ac-side}

Le côté alternatif du régulateur (l'alimentation GFCI et la résistance) est sur le secteur. **Faites-le câbler par un électricien qualifié.** Il n'est pas dessiné ici.

## Étape 7. Ajouter le Device dans Skynet {#step-7-add-the-device-in-skynet}

Ajoutez un **Heating Element: PWM (0 to 100%)** (Select Device Type : **Heating Element**) sur le Port **D44** de votre Mega, comme dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device). Cette ligne commence avec son **Hardware Controller** réglé sur **DAC / 0-10 V** : seul un DAC / 0-10 V sur un True PWM Port reçoit le % en PWM, ce dont le module a besoin. Laissez-le sur DAC / 0-10 V.

Pour une vanne proportionnelle ou une commande de vitesse de pompe, choisissez plutôt **Analog output 0-10 V** (Select Device Type : **PWM / Analog out**).

## Étape 8. Vérifier {#step-8-check-it}

Avec la résistance **débranchée ou son disjoncteur coupé**, mettez le Device à 0 %, 50 % et 100 % et mesurez le VOUT du module avec un multimètre : environ 0 V, 5 V et 10 V. Un module donne rarement exactement 10 V à 100 % : réglez sa vis d'ajustage s'il en a une. Un Device PWM output ou Analog output a aussi **Measured volts** dans ses Properties, pour que Skynet affiche les vrais volts.

## Autres cartes {#other-boards}

- **Une carte 3,3 V** (ESP32, Pi, Due ...) envoie un PWM de 3,3 V : choisissez un module qui accepte un signal de 3,3 V.
- **4-20 mA :** un **module PWM vers 4-20 mA** se câble de la même façon ; choisissez **Analog output 4-20 mA** dans Skynet.
- **Arduino Opta :** il n'a ni Port PWM ni sortie 0-10 V à lui. L'extension analogique Opta (A0602) a des sorties 0-10 V, mais le programme Opta de Skynet ne la pilote pas encore (voir [Skynet Boards](206-skynet-boards)).

## Le côté technique {#the-technical-side}

- Ne câblez pas un SSR ordinaire à passage par zéro directement sur un True PWM Port : le Port commute des centaines de fois par seconde et un SSR à passage par zéro ne peut suivre que 120 fois par seconde, donc la puissance devient irrégulière. Utilisez plutôt un SSR sur un Port ordinaire ([Pas à pas : câbler un SSR](211-step-by-step-wire-an-ssr)).
- Dans le programme du Mega (`Mega_BrewPanel.ino`), D44-D46 sont déjà dans `PWM_PINS`. Un Device **Analog output** a besoin que son Port soit plutôt dans `AO_PINS` (par exemple `{13}`) ; changez la liste et téléversez-le de nouveau.
