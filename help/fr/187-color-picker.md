# Sélecteur de couleur {#color-picker}

Chaque case de couleur de chaque fenêtre choisit les couleurs de la même façon (Règle Skynet 2.48).

## Choisir une couleur {#pick-a-color}

Chaque case de couleur est une liste déroulante avec un échantillon devant :

1. **Default** garde la couleur normale de l'élément.
2. **None** veut dire pas de couleur du tout (transparent).
3. Les couleurs standard par leur nom, chacune avec son échantillon (White est RGB 250 250 250, Règle 2.7).
4. Vos propres couleurs, affichées par leurs nombres RGB, par exemple **RGB 32 178 170**.
5. **Custom (add new) ...** fait apparaître tout de suite le **Color Picker**.

## La case Color (RGB) {#the-color-rgb-box}

Quand vous choisissez une couleur à vous, une ligne **Color (RGB)** apparaît juste sous la case de couleur : un échantillon et la couleur en trois
nombres, rouge, vert, bleu (0 à 255 chacun), par exemple **250,250,250**.

- **Double-cliquez** sur les nombres pour refaire apparaître le Color Picker.
- Ou tapez-y trois nombres, par exemple `32,178,170`, et appuyez sur Entrée.
- Choisissez une couleur nommée (ou Default ou None) et la ligne Color (RGB) disparaît de nouveau.

## Le Color Picker {#the-color-picker}

- Glissez dans le grand carré pour choisir à quel point la couleur est claire et forte, et sur la bande de couleurs à côté pour choisir la couleur.
- Ou tapez-la dans la case dessous : en **RGB** (par exemple `rgb(32, 178, 170)`), ou appuyez sur **HEX** et tapez un code #
  (par exemple `#20B2AA`).
- L'échantillon et l'image dans la fenêtre changent pendant que vous choisissez, pour que vous voyiez la couleur avant de la garder.
- **Save** garde la couleur. Elle est ajoutée à la liste des couleurs, donc elle est là dans chaque case de couleur la fois suivante.
- **Cancel** (ou Échap) ferme le Color Picker et la case garde la couleur qu'elle avait.

## Les capots de pompe {#pump-covers}

Sur une pompe Skynet, choisissez **User Add** dans **Cover**. Le Color Picker apparaît et la ligne **Color (RGB)** s'affiche juste sous
le Cover. Choisissez la couleur et appuyez sur **Save** : le capot est dessiné de cette couleur sur la pompe dans la fenêtre et sur le Tab.
**◀ Back** remet le Cover sur None (pas de capot). Double-cliquez sur les nombres Color (RGB) pour changer la couleur plus tard.

## Les couleurs de débit {#flow-colors}

Une Flow Color (tuyaux, flexibles, cuves, IP et le Tab, Règle 5.21) choisit **RGB (pick your own color) ...** de la même façon : le Color
Picker apparaît et la ligne Color (RGB) s'affiche dessous.

## Le côté technique {#the-technical-side}

- Le Color Picker est **Pickr** 1.9.1 de Simon Reinisch (licence MIT, gratuit), gardé dans le panneau (`public/vendor/pickr`), donc il
  marche sans internet. Sa licence est listée dans `docs/Media_Licenses.csv`.
- Une couleur est enregistrée comme son code # (`#rrggbb`), comme avant, donc un Process règle et lit toujours les couleurs de la même façon
  (par exemple `Pump_1.coverColor = "#20b2aa"`).
- Si le fichier du Color Picker ne se charge pas, la case de couleur propre au navigateur s'ouvre à la place, donc on peut toujours choisir une couleur.
