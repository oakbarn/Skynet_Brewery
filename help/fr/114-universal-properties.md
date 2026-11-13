# Propriétés universelles {#universal-properties}

Chaque **Device**, **Widget** et **Semi-Device** (Switch, Push Button, Pulse Button, LED, Manual Valve Widget) a les mêmes
Properties de base, avec les mêmes noms partout. Apprenez-les une fois et elles marchent sur tout.

## Les Properties {#the-properties}

- **Name** : commence comme le Suggested Name ; vous pouvez le changer avant le premier enregistrement. Ensuite il est verrouillé 🔒 et ne se change qu'avec **✏ Change name**.
- **Label** : le texte affiché avec l'élément, avec un interrupteur **Show Label**.
- **Rich Text** : la police, la taille, le gras, les couleurs de texte et de fond et l'alignement du Label et du propre texte de l'élément. Les **Rich Text Embedded Codes** (`\b`, `\i`, `\n`, `\c{Red}` ...) marchent dans n'importe quel texte.
- **Position** (X, Y) et **Size** (Width, Height), en pixels.
- **Layer Order** (ordre des couches) : quel élément est dessiné par-dessus là où des éléments se chevauchent. **1 est au-dessus**, 2 est en dessous, et ainsi de suite. Un **nouvel élément reçoit 1** et les autres descendent d'un cran. Les numéros d'un Tab vont toujours 1, 2, 3 ... sans trous. Il vient juste après Height dans chaque fenêtre Properties.
- **Visible**, et **HiddenLock** : un élément HiddenLock est caché chaque fois que le Tab est verrouillé (hors Edit layout), même quand Visible est activé. En Edit layout vous le voyez pâli pour pouvoir quand même y travailler.
- **Lock** (Item Lock) 🔓 / 🔒 : verrouille la place de l'élément, pour qu'il ne puisse pas être déplacé ou redimensionné par accident. Vous pouvez toujours double-cliquer dessus et changer ses autres Properties. **🔒 Lock All** et **🔓 Unlock All** dans la barre Edit layout verrouillent ou déverrouillent tout ce qui est sur le Tab d'un coup.
- Une **clé** cachée, donnée quand l'élément est enregistré la première fois. Vous ne la voyez jamais ; elle permet aux Processes de suivre un élément renommé.

## Dans un Process {#in-a-process}

`name.attribute = something`, par exemple `Pump_1.fore_label = "Red"`. `""` remet ce que disent ses Properties.

| Attribut | Ce que c'est |
|---|---|
| `.label`, `.label_visible` | le Label et s'il s'affiche |
| `.font_label`, `.size_label`, `.bold_label` | la police, la taille et le gras du Label |
| `.fore_label`, `.back_label`, `.alignment_label` | les couleurs et l'alignement du Label |
| `.font`, `.font_size`, `.bold` | le propre texte de l'élément : police, taille et gras |
| `.fore`, `.back`, `.alignment` | le propre texte de l'élément : couleurs et alignement |
| `.backpath` | l'image de fond (`.backpath_2`, `.backpath_3` aussi) |
| `.visible`, `.hiddenlock` | affiché ou non ; caché tant que le Tab est verrouillé |
| `.x`, `.y` | où il est (`.xh` / `.x_hPosition` et `.yv` / `.y_vPosition` marchent aussi) |
| `.width`, `.height` | sa taille |
| `.layer` | son Layer Order (1 est au-dessus) |
| `.lock` | son Item Lock |
| `.tab` | le Tab où il est |

**En construction :** aujourd'hui toute la liste marche sur le Widget Text (sa taille de police est encore `.size`). Les autres Devices et Widgets recevront le reste dans une prochaine mise à jour ; d'ici là, ils utilisent `.nameColor`, `.nameBg`, `.nameAlign` pour le Label et `.valueColor`, `.valueBg`, `.valueAlign` pour la valeur.

Les raccords de tuyauterie (coudes, tés, réductions ...) les ont aussi, Label compris. La plupart des Widgets n'ont pas d'image de fond, ils n'ont donc pas de `.backpath`.

## Clones

Un Clone a les mêmes Properties, mais la plupart appartiennent à son parent et ne peuvent pas être changées sur le Clone. Seuls sa propre place (X, Y), son Tab, Visible, Lock et Layer Order sont à lui.

## Layer Order, pas à pas {#layer-order-step-by-step}

1. Ouvrez **Edit layout** et double-cliquez sur l'élément qui doit être au-dessus.
2. Son **Layer Order** montre où il est maintenant. Tapez **1** pour le mettre au-dessus (ou 2 pour le mettre juste sous celui du dessus), puis **Save** et **Save layout**. Les autres éléments du Tab sont renumérotés, sans trous.
3. Un Process peut le changer pendant le brassage : `Pump_1.layer = 1` met la pompe au-dessus et les autres descendent d'un cran ; `Pump_1.layer = ""` remet le numéro de ses Properties.

Chaque élément a un Layer Order : les tuyaux, les flexibles, les marques d'IP, les raccords de tuyauterie et les Widgets Manual Valve aussi. Un Tab jamais numéroté garde l'ordre qu'il a toujours eu (les tuyaux en bas, les marques d'IP en haut) ; **Save layout** le numérote.

**Dans un Vessel Device** (Règle Skynet 1.29) : un Device intégré dans un Vessel Device (sa Heating Element, sa Temperature Probe et les
autres parties intégrées) a un Layer Order qui ne compte **qu'à l'intérieur de cette cuve**. 1 est sa partie du dessus, 2 est en dessous, et ainsi de suite. Elles ne sont
pas dans la liste du Tab. La place de toute la cuve parmi les autres éléments du Tab est le **propre Layer Order du Vessel Device**, et ses
parties intégrées vont toujours avec elle, dessinées par-dessus la cuve. Un Process marche de la même façon : `HLT_Vessel.hE_1.layer = 1` met cette partie
au-dessus des autres parties du HLT, pas au-dessus du Tab.

Le standard complet est dans le document Skynet **Universal Properties** (docs/Universal_Properties.md).
