# Étalonnages et volts mesurés {#calibrations-and-measured-volts}

## Étalonnages sur une lecture {#calibrations-on-a-reading}

Une **Temperature Probe**, un **Analog In** et un **débitmètre** peuvent avoir une liste de **Calibrations** (Règle Skynet 6.24). Ils marchent comme
des couches : chacun change le résultat du précédent, de haut en bas, et le dernier résultat est ce que montre le Device et ce que
lit un Process.

| Calibration | Ce qu'elle fait |
|---|---|
| Linear Offset | ajoute un nombre (un nombre négatif retranche) |
| Linear Multiplier | multiplie par un nombre |
| Linear Divider | divise par un nombre |
| Floor | jamais plus bas que ceci |
| Ceiling | jamais plus haut que ceci |
| Thermistor (Steinhart-Hart) | change la lecture brute d'une thermistance en Kelvin (sa résistance de tirage et les nombres A, B, C de sa fiche technique) |
| Celsius / Fahrenheit / Kelvin | change une échelle de température en une autre |
| Lookup Table | des paires d'une lecture et de la valeur qu'elle signifie, une paire par ligne, avec des lignes droites entre elles |

**D'où elles partent :** une sonde part de sa propre température (après son type de sonde et ses offsets) et un débitmètre de son débit.
Un Analog In avec étalonnages part de sa lecture **brute** 0-1023, au lieu de ses réglages Signal. C'est ainsi que lit une thermistance sur une
broche analogique : Thermistor, puis Kelvin vers Fahrenheit.

**Les régler :** ouvrez les Properties du Device. Sur une sonde, cliquez sur le **⬢** à côté de **More calibrations**.

- **➕ Add calibration** en ajoute une en bas. Choisissez sa sorte, puis tapez ses nombres.
- **↑** et **↓** la déplacent plus tôt ou plus tard. L'ordre compte : fois 2 puis plus 1 n'est pas la même chose que plus 1 puis fois 2.
- L'**interrupteur** en désactive une sans la perdre. **✕** l'enlève.

**Exemple :** un capteur de pression qui lit 8.9 à 29 pouces et 200 à 175 pouces est une Lookup Table à deux lignes, `8.9, 29` et
`200, 175`.

## Volts mesurés sur une sortie PWM ou analogique {#measured-volts-on-a-pwm-or-analog-output}

Une sortie PWM qui commande un DAC (une carte qui change le PWM en 0-10 V) donne rarement exactement 10 V à 100 %, et chaque carte est différente. Donc
mesurez-la :

1. Réglez la sortie sur quelques valeurs (par exemple 0 %, 50 % et 100 %).
2. Mesurez les volts avec un multimètre à chaque fois.
3. Dans les Properties de la sortie, écrivez chaque paire sur sa propre ligne sous **Measured volts**, par exemple `0, 0`, `50, 4.6`, `100, 9.4`.

La sortie montre alors à peu près combien de volts elle donne, par exemple `75 %  ≈ 7.0 V`. Un Process lit `My_DAC.volts`, et
`My_DAC.volts = 7.5` règle le % qui, d'après les paires, donne 7,5 V.
