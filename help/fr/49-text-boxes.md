# Les zones de texte {#text-boxes}

Chaque morceau de texte sur un Tab est une **zone de texte** (text box), et chaque zone de texte a les mêmes attributs. Les zones de texte sont :

- le **Name** et la **Value** de chaque Device et Widget (une pompe, une température, un gGlobal ...)
- un **Label** (Add > Label dans Edit layout)
- un **Text Widget** (**+ Text** dans Edit layout ; sa propre page : [Widget Text](91-text-widget))
- le **Label** sur une cuve et sur les autres équipements

## Les attributs {#the-attributes}

| Attribut | Ce que c'est | Dans un Process |
|---|---|---|
| Visible | affiché ou caché (un interrupteur) | `w_Text_1.visible = false` |
| Fore color | la couleur du texte | `Pump_1.foreColor = "Red"` |
| Back color | la couleur derrière le texte | `Pump_1.backColor = "#000000"` |
| Alignment | aligné à gauche, centré ou aligné à droite | `w_Text_1.alignment = "Center"` |
| Width, Height | sa taille en pixels | `w_Text_1.width = 300` |
| Position X et Y | sa place en pixels depuis la gauche et le haut du Tab : **x** est **h**orizontal (en travers), **y** est **v**ertical (de haut en bas). Les anciens noms `.xPosition` et `.yPosition` marchent toujours. | `w_Text_1.x_hPosition = 400`, `w_Text_1.y_vPosition = 120` |

- **Word wrap as needed** (retour à la ligne si besoin) : un long texte passe sur plusieurs lignes. Sur un Device ou un Widget, il permet à un long Name de passer à la ligne (les Values passent toujours à la ligne). Un Text Widget passe toujours à la ligne.
- **Les codes dans le texte** marchent dans chaque zone de texte : `\b` gras, `\L` grand, `\n` nouvelle ligne, `\t` retrait, `\deg` signe degré et les autres dans [Le langage des Processes et les étapes](22-process-language).
- **Les raccourcis clavier** tapent les codes pour vous : Maj+Entrée `\n`, Ctrl+B (⌘+B) `\b`, Ctrl+Maj+D (⌘+Maj+D) °F ou °C. Voir [Raccourcis clavier](113-shortcut-keys).

Sur un Device ou un Widget, **Fore color**, **Back color** et **Alignment** valent pour tout son texte. **Name color**, **Value color**, **Name alignment** et les autres en dessous sont toujours là, et l'emportent sur Fore color pour cette case-là.

## Valeurs par défaut {#defaults}

Chaque attribut a un **Default** dans **☰ Menu > Default settings**, en deux parties :

- **Labels** : le Name de chaque Device et Widget, et le Label sur une cuve. Visible, Fore Color, Back Color, Alignment, Bold,
  Font et Font Size (px).
- **Text Boxes** : un Text, un Label Widget, et la Value d'un Device ou d'un Widget. Fore Color, Back Color, Alignment, Font, Font Size
  (px), New Box Width, New Box Height et Word Wrap.

Une nouvelle installation commence avec :

| | Labels | Text Boxes |
|---|---|---|
| Visible | On | |
| Fore Color | Blanc (250, 250, 250) | Blanc (250, 250, 250) |
| Back Color | Noir | Noir |
| Alignment | Centré | Centré |
| Bold | Off | |
| Font | Tab's font | Tab's font |
| Font Size (px) | 11 | 11 |
| New Box Width / Height | | 520 x 140 |

- **Tab's font** : chaque Tab utilise la police de son Tab Style, et la police normale du panel quand son Tab Style n'en a pas. Ainsi
  chaque Tab a toujours une police. Une police choisie sur l'onglet Default est utilisée là où un Tab Style n'en a pas.
- **Les réglages par défaut sont seulement pour les nouvelles choses** (Règle Skynet 2.42). Un **nouvel** élément laissé sur **Default**
  dans ses propriétés utilise ce que disait l'onglet Default quand il a été créé (son Tab Style passe quand même en premier). Changer
  l'onglet Default plus tard ne change que les éléments créés après : **les éléments déjà faits gardent leur aspect**. Choisissez une
  couleur à lui dans les propriétés de l'élément et cet élément la garde.
- **La Value d'un Device ou d'un Widget** suit les couleurs des Text Boxes seulement une fois que vous les changez par rapport à
  une nouvelle installation, donc une nouvelle installation ne met pas de case noire derrière les valeurs sur vos images.
- **Visible, Word Wrap, la taille et la place sont copiés quand un élément est créé.** Un nouveau Device, Widget ou Text commence
  avec, puis vous le changez dans ses propriétés. Changer le Default plus tard ne cache, ne déplace ni ne redimensionne ce qui est
  déjà sur vos Tabs.
- La couleur de texte par défaut laisse les chiffres d'une apparence **LED** ou **Gauge** dans leurs propres couleurs.
- La taille du grand texte (le code `\L`) est **\L Rich Text Code Size (px)**, sous **Rich Text Embedded Code** dans **Settings > Panel settings: screen, Tabs and alerts**.

## Dans un Process {#in-a-process}

Un Process change une zone de texte pendant qu'il tourne, et `""` remet ce que disent ses propriétés :

```
w_Text_1.visible = false
w_Text_1 = "Mashing at 152\degF"
Pump_1.foreColor = "Red"
Pump_1.backColor = "Black"
BK_Temp.alignment = "Right"
w_Text_1.x_hPosition = 400
w_Text_1.y_vPosition = 120
w_Text_1.width = 300
Pump_1.foreColor = ""
if w_Text_1.visible == true
   w_Text_1.visible = false
endif
```

- Chaque nouveau **Text Widget** commence avec le nom `wgt_TXT_Text_1_BH` (Règle Skynet 3.14 ; les plus anciens sont `w_Text_1`, `w_Text_2` ...) (il peut être changé : voir [Widget Text](91-text-widget)). `w_Text_1 = "..."` (ou `w_Text_1.text = "..."`) change ce qu'il dit.
- Les couleurs sont un nom (Red, Black ...) ou un code comme `#ffffff`.
- L'alignement est `Left`, `Center` ou `Right` (`"Left justified"` et `"Centered"` marchent aussi).
- Width, Height, X et Y sont des nombres entiers de pixels. En lire un (`if w_Text_1.width > 200`) donne la taille ou la place qu'il a maintenant.
- Une taille ou une place réglée par un Process ne se voit sur le Tab qu'en dehors d'Edit layout. Dans Edit layout, vous voyez et faites glisser là où ses propriétés le mettent.
- Le Label sur une cuve n'a pas de nom de Process. Changez-le dans les propriétés de la cuve.

## Les cuves {#vessels}

Une nouvelle cuve est un **simple réservoir gris** sans rien d'écrit dessus (l'image `Images/Skynet/Vessels/vessel_gray.svg`). Son **Label** est son seul texte : réglez-le dans les propriétés de la cuve, avec sa position, sa couleur, sa couleur de fond et sa taille. Une cuve faite avant ceci garde son image ; choisissez `Images/Skynet/Vessels/vessel_gray.svg` comme Graphic pour la rendre simplement grise.
