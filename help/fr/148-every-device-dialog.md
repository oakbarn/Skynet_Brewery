# Chaque fenêtre de Device ressemble à celle de la pompe {#every-device-dialog-looks-like-the-pump-s}

Les Properties de chaque Device marchent comme celles de la pompe (Règle Skynet 18.31). Une fois la fenêtre de la pompe connue, vous les connaissez toutes.

## De haut en bas {#from-the-top}

1. Le titre, avec le cadenas 🔓, **Visible** et **Hidden Locked** à côté. Les boutons sont ensemble dans le coin en haut à droite, figés, toujours dans le même ordre : **🗑 Delete · 💾 Save · Close · ✕** (Règle Skynet 2.54). Ils restent en place pendant que le reste défile (il n'y a pas de rangée de boutons en bas).
2. **1. Label** : le ⬆ ouvre une case plus grande pour taper, le ⬢ règle sa police, sa taille et ses couleurs. **Label Visible** l'affiche ou le cache sur le Tab.
3. **2. Interface** avec son **Port** (ou **1-Wire Index**) sur la même ligne. Ils sont grisés : c'est le câblage, fixé quand le Device
   a été ajouté. Là où le Device les a, le ⬢ contient **Invert** et **One-shot**.
4. **3. Tab**, **Layer Order** dessous, et **4. Name**, avec le Suggested Name dessous.
5. Un Device avec des images : le **Graphic**, son **Path**, et l'**Overlay** avec **Toggle** (sorties) et **Database and .API ⬢**
   sur la même ligne. Un Device sans images a **Database and .API ⬢** sur une ligne à part.
6. Ses propres réglages : seulement ce dont cette sorte de Device a besoin (l'Input, le Setpoint, le Kp ... d'un PID ; le Signal et les Units d'un capteur ...).
7. **Text attributes ⬢** (l'aspect de sa valeur ou de son texte On / Off), **X**, **Y**, **Width** et **Height** sur une ligne, et le **Device Type** en dernier.

Posez la souris sur n'importe quel nom de champ pour voir à quoi il sert (aide 147).

## Chaque fenêtre, de la même façon {#every-dialog-the-same-way}

Chaque fenêtre de Skynet, pas seulement celles des Devices, suit la fenêtre de la pompe Blichmann RipTide (Règle Skynet 18.44) :

- **Les boutons sont figés en haut, dans le coin à droite, toujours dans le même ordre** (Règle Skynet 2.54) :
  **Delete · Save · Undo · Close · ✕**. Une fenêtre laisse de côté un bouton qu'elle n'a pas (une fenêtre Properties n'a pas d'Undo,
  une petite fenêtre dit **Keep** à la place de Save, une fenêtre d'ajout dit **➕ Add Device**) ; les autres gardent leur ordre, donc
  chaque bouton est toujours à la même place. **Close** (c'était Cancel) et le **✕** encadré ferment sans enregistrer, et demandent
  d'abord si vous avez changé quelque chose. Le titre et ses boutons restent en place pendant que vous faites défiler, donc vous
  n'avez jamais à descendre tout en bas pour enregistrer (Save). Il n'y a pas de deuxième rangée de boutons en bas.
- **⛔ = ne peut pas être changé ici.** Une case grisée montre le panneau rouge Sens interdit à son bout droit pendant que la souris
  est sur la case ou sur son nom (Skynet Rule 18.45 : la fenêtre reste propre). La case montre ce
  qu'elle est, mais vous ne pouvez pas y taper ni y choisir ici (par exemple l'Interface et le Port une fois le Device ajouté, ou le Device Type).
  Une case grisée n'a **pas de Hover Help** : le ⛔ est tout ce qu'elle montre (Règle Skynet 18.46).
  ![Une case grisée avec le panneau Sens interdit](help_pictures/Greyed_Do_Not_Enter.png)
- **Chaque fenêtre ⬢ et ⬆** a son titre et **🗑 Delete · 💾 Keep · Close · ✕** figés en haut. Keep remet ce que vous avez réglé dans la fenêtre ;
  le 💾 Save de la fenêtre l'enregistre.
- **Des noms courts.** Un champ montre un nom court ; à quoi il sert est dans son Hover Help (posez la souris sur le nom).
- **X, Y, Width et Height** sont sur une ligne.
- **L'ordre Blichmann** (Règle Skynet 18.47) : une fenêtre mise au Modèle a ses cases dans le même ordre que celle de la
  pompe : Label, Label Visible, Interface, Tab, **Layer Order** sous le Tab, Name ... Une case que la pompe n'a pas va là où elle
  convient le mieux ; tout ce qui est au-dessus et en dessous garde l'ordre de la pompe.
- **Deux Modèles maintenant** (Règle Skynet 18.48) : la fenêtre de la pompe (Blichmann RipTide) pour un Device, et la fenêtre
  **Hose Bib Widget** pour un Widget (2. Tab et Layer Order, une seule image Skynet sans case Picture, Orientation et Hose or Pipe
  disposés comme sur la pompe, et son IP fixé par le flexible ou le tuyau qui y est joint, jamais choisi dans une case). Ensemble,
  ils sont le Modèle auquel les autres fenêtres sont comparées. Depuis la Règle Skynet 18.49, l'**Orientation** de la pompe a
  l'aspect du Hose Bib : **Horizontal** grisé (une pompe est toujours à plat) avec **Left / Right** à côté ; et le Hose Bib a
  le **Cover** et le **Toggle**, l'**Overlay** et **Database and .API** de la pompe, un **Inlet** et un
  **Outlet IP Fitting** (pas de Model), et n'importe lequel de ses 8 endroits d'IP.
- **State, Name et Change Name** (Skynet Rule 18.45) : **State** (sur chaque Device On / Off, et une Manual Valve) est un curseur qui met
  l'élément On ou Off (une vanne : Open ou Closed) tout de suite, comme un clic sur lui dans son Tab ; ce n'est pas un réglage, donc
  Save et Close ne le changent pas. Le **Name** est grisé ; la case **Change Name** dessous commence avec le Name actuel, et **✏
  Change Name** met ce qui y est tapé dans le Name (gardé avec 💾 Save ; chaque Process le suit). Dès que le Label change, la case
  Change Name prend le nouveau Suggested Name et une fenêtre bleue propose **✏ Change Name** avec lui. Le curseur State, la case Change Name
  et ses deux boutons sont pour la souris seulement : la touche Tab et Entrée les passent.
  La case Change Name s'affiche sur chaque Device et Widget une fois enregistré ; pendant que vous en construisez un nouveau, son Name
  suit simplement le Suggested Name jusqu'à ce que vous l'ajoutiez.
- **Alarm Widgets** (Skynet Rule 18.50, la passe « Recheck dialogs ») : la Basic Skynet Alarm, la User Alarm et la Pre-Hop Alarm
  suivent l'ordre du Hose Bib : le cadenas et **Hidden Locked** dans la ligne de titre (Visible est automatique : une Alarm s'affiche
  quand elle est On), **1. Label**, **Label Visible**, **2. Tab**, **Layer Order**, **3. Name** avec Change Name, puis la case
  **Graphic**, la case **Alarm** et l'**Alarm Chain**, X, Y, Width et Height sur une ligne, et le **Widget Type** en dernier.
  **Database and .API** est le ⬢ sur la ligne Active overlay, comme sur l'Overlay de la pompe. Rien n'a été retiré.
- **Toutes les autres fenêtres** (la passe « Recheck dialogs », partie 2) ont maintenant le même aspect et le même ordre, sans rien
  retirer : le **Switch**, le **Push Button**, le **Pulse Button** et la **LED** reçoivent le **Graphic** (le Widget tel que dessiné sur
  son Tab) et un **Overlay** dont le ⬢ contient Database et .API. Un Widget sans image (Data / Value, Text, Override, Label, Timer,
  Graph, Audio Widget, Process) a **Background** (Show ou None), **Fore color** et **Back color** sur leurs propres lignes. Le gGlobal
  Widget, l'ancienne Alarm, le Manual vessel et un Clone, chaque Vessel, IP, Pipe, Hose, raccord et Manifold, et le tube RIMS et la
  bouilloire électrique suivent le même ordre : 1. Label, Label Visible, 2. Tab, Layer Order, 3. Name, leurs propres cases, X Y Width
  Height, et le Type en dernier. Le Picture Widget reçoit un **Background** (None, 1, 2 ou 3) dont le ⬢ contient ses 3 images.
- **Les mêmes lignes aux mêmes places** (règle Skynet 18.51) : chaque Device (PWM, relais, vanne, résistance, sonde de température,
  entrées, moteurs, densimètres ...) et chaque Widget a maintenant les lignes du modèle dans l'ordre du modèle : la ligne du titre,
  State, 1. Label, Label Visible, 2. Interface et Available Ports, 3. Tab, Layer Order, 4. Name, le **Graphic**, Orientation, Hose or
  Pipe, Cover et **Toggle**, **Overlay** avec **Database and .API**, Model, Inlet et Outlet IP Fitting, ses propres réglages, X Y
  Width Height et le **Device Type** en dernier. Chacun a un Graphic ; un **Path** d'image est dans le ⬢ du Graphic. Un Toggle sans
  Cover a sa propre ligne à la place du Cover. Sans Overlay, **Database and .API** a sa propre ligne ⬢ à cet endroit. Rien n'a été
  retiré.

## Un Device intégré à quelque chose {#a-device-built-into-something}

Un Thermowell, une sonde de température, une résistance ou une vanne intégrés à un **Vessel Device**, et la résistance et la sonde d'un **RIMS tube**
ou d'une **cuve Integrated**, ouvrent la même fenêtre. À la place du Tab, elle montre **3. Built into** (grisé), et elle n'a ni Graphic,
ni X, Y, Width ou Height, car la pièce bouge avec ce dans quoi elle est intégrée. Une sonde intégrée montre son **Probe type**, ses **Units**, son
**Calibration offset** et sa **Reading now**.

En Edit layout, **double-cliquez sur l'image de la pièce sur la cuve** (ou sur sa lecture) pour ouvrir ses Properties.
