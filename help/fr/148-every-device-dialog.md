# Chaque fenêtre de Device ressemble à celle de la pompe {#every-device-dialog-looks-like-the-pump-s}

Les Properties de chaque Device marchent comme celles de la pompe (Règle Skynet 18.31). Une fois la fenêtre de la pompe connue, vous les connaissez toutes.

## De haut en bas {#from-the-top}

1. Le titre, avec le cadenas 🔓, **Visible** et **Hidden Locked** à côté. 🗑 Delete, ✖ Cancel et 💾 Save sont en haut, figés : ils restent en place pendant que le reste défile (il n'y a pas de rangée de boutons en bas).
2. **1. Label** : le ⬆ ouvre une case plus grande pour taper, le ⬢ règle sa police, sa taille et ses couleurs. **Label Visible** l'affiche ou le cache sur le Tab.
3. **2. Interface** avec son **Port** (ou **Probe #**) sur la même ligne. Ils sont grisés : c'est le câblage, fixé quand le Device
   a été ajouté. Là où le Device les a, le ⬢ contient **Invert** et **One-shot**.
4. **3. Tab** et **4. Name**, avec le Suggested Name dessous.
5. Un Device avec des images : le **Graphic**, son **Path**, et l'**Overlay** avec **Toggle** (sorties) et **Database and .API ⬢**
   sur la même ligne. Un Device sans images a **Database and .API ⬢** sur une ligne à part.
6. Ses propres réglages : seulement ce dont cette sorte de Device a besoin (l'Input, le Setpoint, le Kp ... d'un PID ; le Signal et les Units d'un capteur ...).
7. **Text attributes ⬢** (l'aspect de sa valeur ou de son texte On / Off), **X**, **Y**, **Width** et **Height** sur une ligne, et le **Device Type** en dernier.

Posez la souris sur n'importe quel nom de champ pour voir à quoi il sert (aide 147).

## Chaque fenêtre, de la même façon {#every-dialog-the-same-way}

Chaque fenêtre de Skynet, pas seulement celles des Devices, suit la fenêtre de la pompe Blichmann RipTide (Règle Skynet 18.44) :

- **Les boutons sont figés en haut.** Le titre et ses boutons restent en place pendant que vous faites défiler, donc vous n'avez
  jamais à descendre tout en bas pour enregistrer (Save). Il n'y a pas de deuxième rangée de boutons en bas.
- **⛔ = ne peut pas être changé ici.** Une case grisée montre le panneau rouge Sens interdit à son bout droit pendant que la souris
  est sur la case ou sur son nom (Skynet Rule 18.45 : la fenêtre reste propre). La case montre ce
  qu'elle est, mais vous ne pouvez pas y taper ni y choisir ici (par exemple l'Interface et le Port une fois le Device ajouté, ou le Device Type).
  ![Une case grisée avec le panneau Sens interdit](help_pictures/Greyed_Do_Not_Enter.png)
- **Chaque fenêtre ⬢ et ⬆** a son titre, ✖ Cancel et 💾 **Keep** figés en haut. Keep remet ce que vous avez réglé dans la fenêtre ;
  le 💾 Save de la fenêtre l'enregistre.
- **Des noms courts.** Un champ montre un nom court ; à quoi il sert est dans son Hover Help (posez la souris sur le nom).
- **X, Y, Width et Height** sont sur une ligne.
- **State, Name et Change Name** (Skynet Rule 18.45) : **State** (sur chaque Device On / Off, et une Manual Valve) est un curseur qui met
  l'élément On ou Off (une vanne : Open ou Closed) tout de suite, comme un clic sur lui dans son Tab ; ce n'est pas un réglage, donc
  Save et Cancel ne le changent pas. Le **Name** est grisé ; la case **Change Name** dessous commence avec le Name actuel, et **✏
  Change Name** met ce qui y est tapé dans le Name (gardé avec 💾 Save ; chaque Process le suit). Dès que le Label change, **🏷
  Update to Suggested Name** apparaît à côté de Label Visible et remplit la case Change Name. Le curseur State, la case Change Name
  et ses deux boutons sont pour la souris seulement : la touche Tab et Entrée les passent.
  La case Change Name s'affiche sur chaque Device et Widget une fois enregistré ; pendant que vous en construisez un nouveau, son Name
  suit simplement le Suggested Name jusqu'à ce que vous l'ajoutiez.

## Un Device intégré à quelque chose {#a-device-built-into-something}

Un Thermowell, une sonde de température, une résistance ou une vanne intégrés à un **Vessel Device**, et la résistance et la sonde d'un **RIMS tube**
ou d'une **cuve Integrated**, ouvrent la même fenêtre. À la place du Tab, elle montre **3. Built into** (grisé), et elle n'a ni Graphic,
ni X, Y, Width ou Height, car la pièce bouge avec ce dans quoi elle est intégrée. Une sonde intégrée montre son **Probe type**, ses **Units**, son
**Calibration offset** et sa **Reading now**.

En Edit layout, **double-cliquez sur l'image de la pièce sur la cuve** (ou sur sa lecture) pour ouvrir ses Properties.
