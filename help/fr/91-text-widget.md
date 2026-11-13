# Widget Text {#text-widget}

Un **Text Widget** est un morceau de texte que vous mettez sur un Tab : **+ Text** dans la barre Edit layout (il est d'abord fait sur le 🔨 Build Tab, comme chaque nouveau Widget). Double-cliquez dessus en Edit layout pour ouvrir ses **Text Widget Properties**. Cette fenêtre est le modèle que suivront les autres fenêtres Properties.

## Text Widget Properties

En haut : **🗑 Delete**, **COPY**, **✖ Cancel** et **💾 Save** (Delete, Cancel et Save sont aussi en bas).

- **COPY** enregistre vos changements, puis fait une copie de ce Widget Text sur le 🔨 Build Tab, avec tout pareil sauf un nouveau nom (le même nom avec _2, _3 ...). Les Properties de la copie s'ouvrent pour que vous la changiez. **Save Build ...** l'envoie vers un Tab.
- **Name** : le Label d'un nouveau Widget Text commence à **Text_1**, **Text_2** ... et son nom est **wgt_TXT_** + le Label + l'ID du Tab, par exemple **wgt_TXT_Text_1_BH** (Règle Skynet 3.14). Les anciens gardent leurs noms **w_Text_1**. Vous pouvez le garder, ou lui donner un nom à vous. Une fois enregistré, le nom est verrouillé 🔒 : **✏ Change name** est le seul moyen de le changer (il *met à jour les noms* partout), et chaque Process qui l'utilise change avec lui. Les noms ne servent qu'à trouver l'élément à l'écran et à régler ses `.attributes` dans un Process.
- Le **?** orange après le nom ouvre une fenêtre avec plus d'informations sur le Widget Text : ses **Properties** et les **Attributes** qu'un Process peut utiliser. (Le **?** jaune près du titre ouvre cette page d'aide.) La fenêtre a **✖ Close** en haut et en bas.
- **Text** : ce qu'il dit. Les **Rich Text Embedded Codes** (codes de texte enrichi) marchent ici et dans le Label : `\b` gras, `\i` italique, `\n` une nouvelle ligne, `\c{Red}` une couleur et le reste dans [Codes inside text](22-process-language).

### La case Label {#the-label-box}

Une ligne au-dessus du Text. Vide = le Name.

- **Label**, **Visible** (Show label), **Font size**, **Font**, **Bold**, **Fore color**, **Back color**, **Alignment**.

### La case Properties {#the-properties-box}

- **Visible**, et **Hidden Locked** (reste caché même quand Visible est activé).
- **Font size**, **Font**, **Bold**, **Fore color**, **Back color**, **Alignment** du Text.
- **Tab**, **X Horizontal**, **Y Vertical**, **Width**, **Height**, et **Lock position** 🔓 / 🔒.

**Le retour à la ligne est toujours actif** : un long texte passe à la ligne suivante à l'intérieur de la case.

## Dans un Process {#in-a-process}

`name.attribute = Something` (nom.attribut = quelque chose) est la façon dont un Process l'utilise, par exemple `w_Text_1.fore = "Red"`. `""` remet ce que disent ses Properties. Le lire donne ce qu'il est maintenant.

| Attribut | Ce que c'est |
|---|---|
| `.text` | ce qu'il dit. `w_Text_1 = "Mashing"` fait la même chose |
| `.value` | seulement dans un Process : pareil que `.text` |
| `.label` | le Label (vide = le Name) |
| `.label_visible` | true / false : le Label s'affiche |
| `.font_label`, `.size_label`, `.bold_label` | la police du Label, sa taille en pixels, gras (true / false) |
| `.fore_label`, `.back_label`, `.alignment_label` | les couleurs du Label et Left / Center / Right |
| `.font`, `.size`, `.bold` | la police du Text, sa taille en pixels, gras |
| `.fore`, `.back`, `.alignment` | les couleurs du Text et Left / Center / Right (`.foreColor`, `.backColor` marchent aussi) |
| `.visible` | true / false |
| `.hiddenlock` | true = reste caché même quand `.visible` est true (`.hidden` marche aussi) |
| `.x` | en largeur, en pixels (`.xh` et `.x_hPosition` marchent tous) |
| `.y` | en hauteur, en pixels (`.yv` et `.y_vPosition` marchent tous) |
| `.width`, `.height` | sa taille en pixels |
| `.lock` | lecture seule : true quand il est verrouillé en place (verrouillez-le en Edit layout) |
| `.tab` | le Tab où il est. Le régler le déplace vers un autre Tab pendant que les Processes tournent |

```
w_Text_1 = "Mashing at 152\degF"
w_Text_1.label = "Mash Tun"
w_Text_1.label_visible = true
w_Text_1.font = "Courier New"
w_Text_1.size = 24
w_Text_1.bold = true
w_Text_1.fore = "Red"
w_Text_1.x = 400
w_Text_1.tab = "Brewhouse"
w_Text_1.fore = ""
```

Les polices sont celles de la liste Font : Arial, Verdana, Tahoma, Trebuchet MS, Georgia, Times New Roman, Courier New, Consolas, Impact ou System. Les couleurs sont un nom (Red, Black ...) ou un code comme `#ffffff`.

## Anciens Schemas {#older-schemas}

Les Widgets Text s'appelaient `Text_1`, `Text_2` ... Quand un ancien Schema se charge, chacun devient `w_Text_1`, `w_Text_2` ... (Règle 15.2), et chaque Process qui utilisait l'ancien nom est changé pour le nouveau. Son interrupteur Word wrap a disparu (le retour à la ligne est toujours actif). Son Label commence caché, il a donc le même aspect qu'avant.

Avant, `Text_1.label` voulait dire son texte. Maintenant `.label` est la ligne du Label : utilisez `.text` pour ce qu'il dit.

Voir aussi [Text boxes](49-text-boxes) pour les valeurs par défaut du Tab Default du ☰ Menu.
