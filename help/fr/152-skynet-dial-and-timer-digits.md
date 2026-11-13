# Le cadran Skynet et les chiffres du minuteur {#skynet-dial-and-timer-digits}

Skynet dessine sa propre jauge de température et ses propres chiffres de minuteur (Règle Skynet 2.40). Ce sont **les propres dessins de Skynet**,
faits de lignes (SVG), donc ils restent nets à toute taille et sur les téléphones. Skynet ne copie jamais les images, le code ou les noms de style
d'une autre société.

## Le Skynet Dial {#the-skynet-dial}

Un arc avec une aiguille, et la lecture en gros chiffres dessous. Il convient le mieux à une **Temperature Probe**, et marche aussi sur une entrée
analogique, une sortie PWM ou analogique, une sortie Duty Cycle, PID ou Deadband et une résistance chauffante (son % de sortie) ; un Process peut aussi le mettre
sur un Value Widget ou un gGlobal nombre.

**Pour l'utiliser :** dans les Properties de la sonde de température, choisissez **Display > Skynet Dial** (tout autre Device : les **Text attributes ⬢**,
**Look > Skynet Dial**). Le ⬢ à côté contient les réglages du cadran :

| Réglage | Ce qu'il fait |
|---|---|
| **Lowest** et **Highest** | Les nombres aux deux bouts de l'arc. Vide = 0 à 220 pour °F, -20 à 110 pour °C, 0 à 100 pour tout le reste. |
| **Setpoint** | La cible. Tapez un nombre (170), ou le **Name** d'un Device ou d'un gGlobal à suivre (le Setpoint d'une résistance, ou sa valeur). Vide = pas de Setpoint. |
| **Cooler range** | Jusqu'où sous le Setpoint c'est encore bon (vide = 2). |
| **Hotter range** | Jusqu'où au-dessus du Setpoint c'est encore bon (vide = 2). |
| **Cold color**, **OK color**, **Hot color** | Les couleurs de la lecture (par défaut Blue, Green, Red). |

La lecture montre les **Decimals** de la sonde : 0, 1 ou 2.

**Avec un Setpoint**, l'arc a trois parties et une marque au Setpoint, et la lecture change de couleur :

- plus que le **Cooler range** sous le Setpoint : **Cold color** (bleu)
- plus que le **Hotter range** au-dessus du Setpoint : **Hot color** (rouge)
- entre les deux : **OK color** (vert)

Par exemple, Setpoint 152, Cooler range 2, Hotter range 1 : 149 est bleu, 151 et 153 sont verts, 153.5 est rouge.

**Sans Setpoint**, l'arc va du bleu au rouge en passant par le vert et le jaune, et la lecture a la couleur de texte de l'élément.

Un Process peut l'activer : `BK_Temp.valueType = "Dial"` (`"Text"`, `"LED"` ou `"Gauge"` font revenir en arrière).

## Les chiffres du minuteur {#timer-digits}

L'aspect d'un minuteur est son **Style** ([Timer Widget](92-timer-widget)). Un **User Style** (➕ Add new User Style…) a maintenant :

- **Back color** : autour du panneau des chiffres, sous la barre de titre.
- **Text Fore color** : les chiffres. **Text Back color** : le panneau derrière eux.
- **Frame** : le cadre autour du panneau, parmi les cadres de minuteur Skynet : **Rounded corners** (coins arrondis), **Square corners** (coins carrés), ou **Square top,
  rounded bottom** (haut carré, bas arrondi), avec sa **Frame color** (toute couleur : Black, Blue, Green, Grey, Orange, Purple, Red, White, Yellow ou Custom).

Chaque minuteur a aussi, dans ses Properties :

- **Digits** : **hh:mm:ss** (01:30:00) ou **hh:mm** (01:30).
- **Seconds only in the last minute** : activé, un minuteur qui décompte ne montre que les secondes (**45**, **44** ...) quand il reste moins d'une
  minute, pour que la dernière minute soit facile à lire.

## Réglages de jauge : forme, graduations, la Skynet Bar et les styles de couleur {#gauge-settings-shape-tick-marks-the-skynet-bar-and-color-styles}

Le même ⬢ contient les **Gauge settings** (Règle Skynet 2.40 point 4), les sortes de réglages qu'ont la plupart des programmes de jauges, tous dessinés par Skynet :

| Réglage | Ce qu'il fait |
|---|---|
| **Dial shape** | Standard (deux tiers de cercle, comme avant), Full round (cercle complet), ou Half round (demi-cercle) |
| **Large tick marks** | Combien de grandes graduations, chacune avec son nombre (2 à 21 ; vide = 6) |
| **Small tick marks between** | Petites graduations entre deux grandes (0 à 10 ; vide = aucune) |
| **Bar direction** | Pour la **Skynet Bar** : de haut en bas, ou de côté |
| **Color style** | Skynet Classic (comme avant), Skynet Dark, Steel, Night Green, Amber, Ice Blue, Fire Red ou Paper. Il colore aussi les **LCD** et **LED digits** |

La **Skynet Bar** est une jauge droite : choisissez **Display > Skynet Bar** (ou **Look > Skynet Bar**). Elle utilise les mêmes Lowest, Highest,
Setpoint, plages et couleurs que le cadran, et se remplit jusqu'à la lecture. Un Process peut y passer avec `name.valueType = "Bar"`.
