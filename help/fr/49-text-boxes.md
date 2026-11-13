# Les zones de texte {#text-boxes}

Chaque morceau de texte sur un Tab est une **zone de texte** (text box), et chaque zone de texte a les mêmes attributs. Les zones de texte sont :

- le **Name** et la **Value** de chaque Device et Widget (une pompe, une température, un gGlobal ...)
- un **Label** (Add > Label dans Edit layout)
- un **Text Widget** (**+ Text** dans Edit layout ; sa propre page : [Text Widget](91-text-widget))
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
- **Les codes dans le texte** marchent dans chaque zone de texte : `\b` gras, `\L` grand, `\n` nouvelle ligne, `\t` retrait, `\deg` signe degré et les autres dans [Codes inside text](22-process-language).
- **Les raccourcis clavier** tapent les codes pour vous : Maj+Entrée `\n`, Ctrl+B (⌘+B) `\b`, Ctrl+Maj+D (⌘+Maj+D) °F ou °C. Voir [Shortcut keys](113-shortcut-keys).
- **Name font** et **Name font size** règlent la police des Names, des Labels sur les cuves et des Texts.

Sur un Device ou un Widget, **Fore color**, **Back color** et **Alignment** valent pour tout son texte. **Name color**, **Value color**, **Name alignment** et les autres en dessous sont toujours là, et l'emportent sur Fore color pour cette case-là.

## Valeurs par défaut {#defaults}

Chaque attribut a un **Default** sur l'onglet **Default** du ☰ Menu, sous **Text**. Le Default vaut pour tout ce qui a cet attribut : Devices, Widgets, Labels, Texts et cuves.

- **Les couleurs, l'Alignment et la Name font suivent le Default.** Un élément laissé sur **Default** dans ses propriétés utilise ce que dit l'onglet Default. Changez-le là et chaque élément sur Default change avec lui. Choisissez une couleur à lui dans les propriétés de l'élément et cet élément la garde.
- **Visible, Word wrap, la taille et la place sont copiés quand un élément est créé.** Un nouveau Device, Widget ou Text commence avec, puis vous le changez dans ses propriétés. Changer le Default plus tard ne cache, ne déplace ni ne redimensionne ce qui est déjà sur vos Tabs.
- La couleur de texte par défaut laisse les chiffres d'une apparence **LED** ou **Gauge** dans leurs propres couleurs.
- **Default** sur l'onglet Default veut dire l'apparence normale du panel, comme avant.

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

- Chaque nouveau **Text Widget** commence avec le nom `wgt_TXT_Text_1_BH` (Règle Skynet 3.14 ; les plus anciens sont `w_Text_1`, `w_Text_2` ...) (il peut être changé : voir [Text Widget](91-text-widget)). `w_Text_1 = "..."` (ou `w_Text_1.text = "..."`) change ce qu'il dit.
- Les couleurs sont un nom (Red, Black ...) ou un code comme `#ffffff`.
- L'alignement est `Left`, `Center` ou `Right` (`"Left justified"` et `"Centered"` marchent aussi).
- Width, Height, X et Y sont des nombres entiers de pixels. En lire un (`if w_Text_1.width > 200`) donne la taille ou la place qu'il a maintenant.
- Une taille ou une place réglée par un Process ne se voit sur le Tab qu'en dehors d'Edit layout. Dans Edit layout, vous voyez et faites glisser là où ses propriétés le mettent.
- Le Label sur une cuve n'a pas de nom de Process. Changez-le dans les propriétés de la cuve.

## Les cuves {#vessels}

Une nouvelle cuve est un **simple réservoir gris** sans rien d'écrit dessus (l'image `Images/Skynet/Vessels/vessel_gray.svg`). Son **Label** est son seul texte : réglez-le dans les propriétés de la cuve, avec sa position, sa couleur, sa couleur de fond et sa taille. Une cuve faite avant ceci garde son image ; choisissez `Images/Skynet/Vessels/vessel_gray.svg` comme Graphic pour la rendre simplement grise.
