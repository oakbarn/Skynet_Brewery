# Widget Timer {#timer-widget}

Un **Timer Widget** (minuterie) compte vers le haut ou vers le bas en heures, minutes et secondes. Ajoutez-en un en Edit layout avec **Select Widget Type > Timer** (il est d'abord fait sur le 🔨 Build Tab, comme chaque nouveau Widget). Double-cliquez dessus en Edit layout pour ouvrir ses **Timer Widget Properties**, du même aspect que celles de la pompe (Règle Skynet 18.30). **Un Widget Timer n'a pas d'images.**

## Styles

Un Widget Timer n'a **ni images ni fond**. Son aspect est son **Style**, choisi dans la liste **Style** de ses Properties :

- Les **Skynet Styles** 🔒 viennent avec Skynet et **ne peuvent jamais être changés par un utilisateur** : **Skynet Orange Timer** (gros chiffres à sept segments `00:00:00` sur un panneau rouge orangé dans une lunette grise, avec le Label comme barre de titre noire ; celui que reçoit une nouvelle minuterie), **Skynet Green LCD**, **Skynet Blue Timer**, **Skynet Red LED digits** (l'ancien aspect LED) et **Skynet Plain text**.
- **➕ Add new User Style…** (au bout de la liste) fait votre propre Style, à partir de celui qui est choisi : un Name (jamais « Skynet ... »), le Look (chiffres à sept segments sur un panneau, chiffres LED ou texte simple), la **Back color** (autour du panneau), la **Text Fore color** (les chiffres), la **Text Back color** (le panneau), le **Frame** (cadre : coins arrondis, coins carrés, ou haut carré avec un bas arrondi, parmi les cadres de minuterie Skynet) avec sa **Frame color**, et le texte et les couleurs de la barre de titre ([Le cadran Skynet et les chiffres du minuteur](152-skynet-dial-and-timer-digits)). **✏ Edit** à côté de la liste change ou supprime un User Style ; il est grisé pour un Skynet Style.
- Un User Style appartient au Schema, donc chaque minuterie qu'il contient peut l'utiliser.

Les boutons ▶ ■ ↺ **Set** sous les chiffres la démarrent, l'arrêtent, la remettent à zéro et la règlent.

## Timer Widget Properties

Posez la souris sur le nom d'un champ pour voir à quoi il sert (aide au survol).

- **La ligne du titre :** le cadenas 🔓, **Visible** et **Hidden Locked**.
- **1. Label** (la barre de titre) avec ⬆ (une case plus grande) et ⬢ (sa police, sa taille, ses couleurs et son alignement), puis **Label Visible**.
- **2. Tab** et **3. Name**. Une nouvelle minuterie est nommée **wgt_TMR_** + le Label + l'ID du Tab, par exemple **wgt_TMR_Mash_BH** (Règle 3.14).
  Une fois enregistré, le nom est verrouillé 🔒 ; **✏ Change name** le change et chaque Process qui l'utilise suit.
- **Count** (Count up ou Count down : vers le haut ou vers le bas), **Start value** et **Reset value** (hh:mm:ss).
- **Running at start** (elle compte déjà quand le Brain démarre), avec **Database and .API ⬢** sur sa ligne.
- **Style** (voir plus haut).
- **Digits** : **hh:mm:ss** (01:30:00) ou **hh:mm** (01:30).
- **Seconds only in the last minute** : activé, une minuterie qui décompte ne montre que les secondes (**45**) quand il reste moins d'une minute.
- **X**, **Y**, **Width** et **Height**, et le **Widget Type** grisé en dernier.

## Dans un Process {#in-a-process}

```
tm_Mash.countdown = true
tm_Mash = "01:00:00"
tm_Mash.running = true
wait tm_Mash == "00:00:00"
tm_Mash.fore = "Yellow"
tm_Mash.back = "Black"
tm_Mash.x = 400
```

| Attribut | Ce que c'est |
|---|---|
| `.value` (ou le nom seul) | le temps, hh:mm:ss |
| `.running` | true / false |
| `.countdown` | true = décompte |
| `.resetvalue` | le temps auquel ↺ revient |
| `.label` | la barre de titre |
| `.fore`, `.back` | la couleur des chiffres et du panneau, par-dessus son Style pendant que les Processes tournent (`.foreColor`, `.backColor` marchent aussi ; `""` = celles du Style) |
| `.visible`, `.hiddenlock` | affichée ou cachée |
| `.x`, `.y` | sa place (`.xh` / `.x_hPosition`, `.yv` / `.y_vPosition` marchent aussi) |
| `.width`, `.height` | sa taille |
