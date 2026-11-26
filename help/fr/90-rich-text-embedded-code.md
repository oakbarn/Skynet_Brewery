# Rich Text Embedded Code (codes de texte enrichi) {#rich-text-embedded-code}

Un Rich Text Embedded Code est un code court, qui commence par une barre oblique inverse `\`, que vous tapez dans un texte pour changer son aspect. Il marche dans chaque texte que le panel montre : un Text sur un Tab, les Labels, les Names et Values des Devices et des Widgets, les valeurs string qu'un Process règle, les lignes `print` dans la sortie du Process, et les fenêtres comme le message d'une vanne manuelle. Dans un Process, mettez le code dans le texte entre guillemets (Règle Skynet 3.19).

## Les aspects (interrupteurs) {#looks-switches}

Ce sont des interrupteurs : le premier code allume l'aspect et le suivant l'éteint.

| Code | Ce qu'il fait | Exemple | Affiche |
|---|---|---|---|
| `\b` | gras on / off | `Add \bhops\b now` | Add **hops** now |
| `\i` | italique on / off | `\iWhirlpool\i 15 min` | *Whirlpool* 15 min |
| `\u` | souligné on / off | `\uDo not\u open` | Do not (souligné) open |
| `\s` | barré on / off | `\sOld\s New` | ~~Old~~ New |
| `\L` | grand texte on / off | `\LSTRIKE\L 165` | STRIKE en grandes lettres |
| `\S` | petit texte on / off | `Mash \S(step 2)\S` | (step 2) en petites lettres |
| `\_` | indice on / off | `CO\_2\_` | CO₂ |
| `\^` | exposant on / off | `ft\^3\^` | ft³ |

## La couleur {#color}

| Code | Ce qu'il fait | Exemple |
|---|---|---|
| `\c{Red}` | le texte qui suit est rouge | `\c{Red}HOT\c 212\degF` |
| `\c` | retour à la couleur normale | |

Utilisez n'importe quel nom de couleur du panel : Red, Green, Blue, Yellow, Orange, Purple, Copper, Brown, Steel grey, Light grey, White (Opaque), White (Transparent), Black (White tout court est White (Opaque)). Les majuscules et les espaces ne comptent pas (`\c{steelgrey}` marche), et un code de couleur comme `\c{#ff8800}` marche aussi. Un nom qui n'est pas une couleur reste à l'écran tel qu'il est tapé, pour que vous voyiez l'erreur.

## Les signes et l'espacement {#signs-and-spacing}

| Code | Ce qu'il fait | Exemple | Affiche |
|---|---|---|---|
| `\n` | une nouvelle ligne | `Mash in\nStir well` | Mash in, puis Stir well à la ligne suivante |
| `\t` | un retrait (environ quatre espaces) | `Mash in\n\tStir well` | Stir well, en retrait, à la ligne suivante |
| `\deg` | un signe degré | `45\deg elbow` | 45° elbow |
| `\degF` | degrés F | `152\degF` | 152°F |
| `\degC` | degrés C | `66\degC` | 66°C |
| `\dFC` | °F ou °C, selon votre Default | `Mash at 152\dFC` | Mash at 152°F (US) ou 152°C (Metric) |
| `\ohm` | un signe Ohm | `9.6\ohm` | 9.6Ω |
| `\+-` | un signe plus-moins | `152\degF \+-2` | 152°F ±2 |
| `\\` | une barre oblique inverse | `C:\\Brewing` | C:\Brewing |

**`\dFC` ne change que la lettre, pas le nombre.** Il montre °F quand vos unités Default sont US et °C quand elles sont Metric (l'unité **Temperatures** de l'onglet ☰ Menu > Default, la même que celle de la touche Ctrl+Shift+D). Le nombre devant est celui que vous avez tapé, donc `152\dFC` montre 152°C sur un panel Metric. Utilisez-le pour des mots qui vont aux deux, comme `Temperature (\dFC)`, ou dans un Process où le nombre arrive déjà dans vos unités.

## Nouvelles lignes et retour à la ligne {#new-lines-and-word-wrap}

Le retour à la ligne (word wrap) est toujours actif dans chaque Text Box et chaque Label : un long texte passe sur plusieurs lignes tout seul. Le Rich Text s'occupe d'une nouvelle ligne là où vous en voulez une : `\n` commence une nouvelle ligne, et `\t` un retrait.

## Les raccourcis clavier du Rich Text {#rich-text-shortcut-keys}

Ces touches tapent les codes pour vous, dans chaque case de texte et de chaîne ([Raccourcis clavier](113-shortcut-keys)) :

| Windows et Linux | Mac | Ce qu'elle tape |
|---|---|---|
| **Shift + Enter** | **Shift + Enter** | `\n`, une nouvelle ligne |
| **Ctrl + B** | **⌘ + B** | `\b` avant et après les mots choisis (gras) ; sans rien de choisi, `\b\b` avec le curseur au milieu |
| **Ctrl + Shift + D** | **⌘ + Shift + D** | **°F** ou **°C**, selon Units |

Les téléphones et tablettes sans clavier n'ont pas ces touches : tapez les codes à la main.

## Bon à savoir {#good-to-know}

- Les codes peuvent être utilisés ensemble : `\L\b\c{Red}BOIL\c\b\L 60 min`.
- Les lettres comptent : `\S` et `\L` sont des majuscules, et `\i`, `\u`, `\s`, `\c`, `\t` et `\n` des minuscules. `\b` et `\B` sont tous les deux le gras.
- Un code qui n'est pas sur cette page reste à l'écran tel qu'il est tapé.
- Pour montrer une vraie barre oblique inverse, comme dans un nom de dossier, tapez-en deux : `C:\\Brewing`. Une seule pourrait devenir un code (`\b` est le gras, `\i` l'italique).
- Utilisez `\t` et `\n` pour mettre le texte en page, pas des espaces en plus : un Label ne peut pas commencer ni finir par un espace (ils sont enlevés).
- La taille du grand texte est **\L Rich Text Code Size (px)** dans **☰ Menu > Default settings** (sous **Rich Text Embedded Code**), en pixels. Elle doit être plus grande que le texte normal (18), et elle vaut 28 quand la case est vide. Le grand texte est toujours au moins un quart plus grand que le texte autour, pour qu'il ressorte même dans un élément à grande police. Le petit texte fait les trois quarts du texte autour.
- Les noms de couleur sont la même liste que les listes déroulantes de couleur des fenêtres Properties.
