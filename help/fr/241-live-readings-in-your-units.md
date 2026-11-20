# Lectures en direct dans vos Units {#live-readings-in-your-units}

Un capteur de pression, un transmetteur de niveau, un débitmètre et une balance de cuve affichent leurs lectures selon
**☰ Menu > Settings > Units** : **US Standard** affiche psi, gal, gal/min et lb ; **Metric** affiche bar, L, L/min et kg.
Changer les Units ne change que ce que vous voyez. Cela ne change jamais un nombre enregistré (Règle 2.59).

## Gardé en : les unités propres du capteur {#kept-in-the-sensor-s-own-units}

Chaque capteur garde ses nombres dans les unités où il est étalonné : sa case **Units** (un débitmètre ou un niveau), ou ses
**Weight units** et **Volume units** (une balance de cuve). Sa plage, ses impulsions par unité et ses comptes par unité restent
dans ces unités, donc un capteur de 30 psi se règle toujours de 0 à 30 psi. Cette case n'est jamais changée à votre place.

| Capteur | Un nouveau commence en | Affiché en US Standard | Affiché en Metric |
|---|---|---|---|
| Capteur de pression 0,5-4,5 V | psi (vendu par sa plage en psi) | psi | bar |
| Transmetteur de niveau 4-20 mA | L | gal | L |
| Débitmètre (YF-S201 : 450 impulsions par litre) | L | gal/min et gal | L/min et L |
| Balance de cuve | kg et L | lb et gal | kg et L |

## La pression selon le champ {#pressure-by-the-field}

Une pression peut se lire d'une façon ou de l'autre, selon ce qu'elle est : une pression de CO2 ou de fût se lit en bar ou en
psi, tandis qu'un autre manomètre peut lire des kPa. Chaque capteur de pression a donc sa propre case **Metric pressure in** :
**bar** (au départ) ou **kPa**. C'est l'unité de cette pression quand les Units sont Metric. US Standard affiche toujours des
psi. Seul ce que vous voyez change : un Process travaille toujours en bar, et vous pouvez y taper `50kPa`.

Une unité de volume ou de poids déjà dans vos Units reste telle quelle : les qt restent des qt en US Standard, les mL restent des mL en Metric. Le pH, les %, la SG, les volts
et autres ne changent jamais. Les températures suivent aussi les Units (Aide : Propriétés de la sonde de température).

## Où cela s'affiche {#where-it-shows}

- La lecture sur son Tab, et son **Data Display** (Rate, Total, Weight, Volume).
- Son **Dial** : les cases Lowest, Highest, Cool et Hot s'affichent et se tapent dans les Units.
- Un message d'un Process (`print "Keg " + Keg_Pressure` affiche 12 psi en US Standard et 0,83 bar en Metric).

## Dans un Process {#in-a-process}

Un Process travaille en métrique, quoi que garde le capteur : une pression en **bar**, un volume en **L**, un débit en
**L/min**, un poids en **kg**. Tapez un nombre simple dans vos Units, comme pour une température :

```
wait Keg_Pressure >= 12
```

En US Standard, c'est 12 psi. Quand le Process est enregistré, il est gardé en `0.8274bar`, donc il veut dire la même chose
après un changement d'Units, et il se rouvre en `12`. Un nombre tapé avec son signe est toujours celui-là : `12psi`, `0.8bar`,
`5gal`, `18.9L`, `10lb`, `4.5kg`, `2gpm` (gal/min), `7.5Lpm` (L/min). Un étalonnage (le `.calibrate` d'une balance, son poids
connu) reste dans les unités propres du capteur. Un Value Widget n'est pas un capteur : il affiche et garde ce qu'on y met.
