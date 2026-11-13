# Chaque fenêtre de Device ressemble à celle de la pompe {#every-device-dialog-looks-like-the-pump-s}

Les Properties de chaque Device marchent comme celles de la pompe (Règle Skynet 18.31). Une fois la fenêtre de la pompe connue, vous les connaissez toutes.

## De haut en bas {#from-the-top}

1. Le titre, avec le cadenas 🔓, **Visible** et **Hidden Locked** à côté. 🗑 Delete, ✖ Cancel et 💾 Save sont en haut et en bas.
2. **1. Label** : le ⬆ ouvre une case plus grande pour taper, le ⬢ règle sa police, sa taille et ses couleurs. **Label Visible** l'affiche ou le cache sur le Tab.
3. **2. Interface** avec son **Port** (ou **Probe #**) sur la même ligne. Ils sont grisés : c'est le câblage, fixé quand le Device
   a été ajouté. Là où le Device les a, le ⬢ contient **Invert** et **One-shot**.
4. **3. Tab** et **4. Name**, avec le Suggested Name dessous.
5. Un Device avec des images : le **Graphic**, son **Path**, et l'**Overlay** avec **Toggle** (sorties) et **Database and .API ⬢**
   sur la même ligne. Un Device sans images a **Database and .API ⬢** sur une ligne à part.
6. Ses propres réglages : seulement ce dont cette sorte de Device a besoin (l'Input, le Setpoint, le Kp ... d'un PID ; le Signal et les Units d'un capteur ...).
7. **Text attributes ⬢** (l'aspect de sa valeur ou de son texte On / Off), **X**, **Y**, **Width**, **Height**, et le **Device Type** en dernier.

Posez la souris sur n'importe quel nom de champ pour voir à quoi il sert (aide 147).

## Un Device intégré à quelque chose {#a-device-built-into-something}

Un Thermowell, une sonde de température, une résistance ou une vanne intégrés à un **Vessel Device**, et la résistance et la sonde d'un **RIMS tube**
ou d'une **cuve Integrated**, ouvrent la même fenêtre. À la place du Tab, elle montre **3. Built into** (grisé), et elle n'a ni Graphic,
ni X, Y, Width ou Height, car la pièce bouge avec ce dans quoi elle est intégrée. Une sonde intégrée montre son **Probe type**, ses **Units**, son
**Calibration offset** et sa **Reading now**.

En Edit layout, **double-cliquez sur l'image de la pièce sur la cuve** (ou sur sa lecture) pour ouvrir ses Properties.
