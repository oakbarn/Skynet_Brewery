# Device Templates Skynet {#skynet-device-templates}

Un **Template Skynet** est fixé par Skynet et ne peut pas être changé par un utilisateur (Règle Skynet 5.16). Quand vous faites un Device à partir de l'un d'eux, vous obtenez
votre propre **User version** (version de l'utilisateur). Elle hérite de tout du Template. Vous ne pouvez régler que certains de ses attributs, et seuls
ceux-là s'affichent dans ses Properties. Lesquels dépend de la sorte de Device.

## Le Device Skynet Motorized Ball Valve {#the-skynet-motorized-ball-valve-device}

C'est **une seule ligne**, **Skynet Motorized Ball Valve**, en haut de la liste **Valves** (et de la liste **On/Off**) de la barre Edit
layout. Choisissez-la et la fenêtre **Add Device** demande l'Interface, la broche et le Label, comme pour tout Device. Elle
commence Horizontal. Son **Orientation** (dans ses Properties) choisit comment elle se tient :

| Orientation | De quoi elle a l'air |
|---|---|
| **Horizontal** | couchée dans un tuyau horizontal |
| **Vertical Left** | debout dans un tuyau vertical |
| **Vertical Right** | debout, avec le moteur de l'autre côté (Flip Horizontal activé) |
| **Front (looking down the pipe)** | vue de face (en regardant dans le tuyau) |
| **45 degrees** | l'image verticale tournée de 45 degrés |

L'image et ses IP suivent l'Orientation : chacune a ses propres places d'IP, donc tourner la vanne déplace aussi ses IP.
(En coulisses, chaque Orientation est son propre Template Skynet de la même vanne, Règle Skynet 5.17 ; vous n'avez jamais à les choisir.)

### Ce qui est fixé par le Template {#what-is-set-by-the-template}

L'image, le Kind (vanne), le Valve type, le Service (liquide à température ambiante), le Look et ce que fait un appui (bascule) sont
fixés, ils ne sont donc pas dans ses Properties. Une vanne haute température est un autre Template Skynet, même si seul le Service diffère.
Si quelque chose essaie d'en changer un, le Brain le remet quand la disposition est enregistrée.

### Ce que vous pouvez régler {#what-you-can-set}

- **Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible**, et les réglages de la case de texte.
- **Interface et Pin**, Invert, One-shot.
- **Orientation** : Horizontal, Vertical Left, Vertical Right, Front ou 45 degrees. L'image et ses IP suivent.
- **Flip Horizontal** et **Flip Vertical** : des interrupteurs qui font un miroir de l'image et de ses IP.
- **Tap water valve** (vanne d'eau du robinet) : désactivé par défaut. Activé, **Tap water flows out of** demande quel bout est le robinet :
  - sur une vanne verticale : **Tap Water Source Top** ou **Tap Water Source Bottom**
  - sur une vanne horizontale ou à 45 degrés : **Tap Water Source Left** ou **Tap Water Source Right**

  Si vous changez l'Orientation ou un Flip tant que Tap water est activé, il revient à **Needs setting** (à régler). Tant qu'il n'est pas réglé à nouveau, aucune
  eau du robinet n'en sort.
- **Text On/Off** : activez-le pour afficher le texte On ou Off sur le Tab. Seulement alors **Text when on** et **Text when off** s'affichent dans
  ses Properties.

## Tourner et retourner {#turning-and-flipping}

Rotate 90 est retiré (Règle 5.5). Utilisez les Flips pour gauche et droite, et des pas de 45 degrés pour tourner. Un quart de tour, c'est deux pas de 45.

## Construire des Templates {#building-templates}

Pendant la phase de construction, un Admin fait et change des Templates sur le **Build Template Tab** (à venir), avec une case **user can set**
(l'utilisateur peut régler) sur chaque attribut. Ils sont verrouillés quand les Templates Skynet sont finis.

## La User Defined Motorized Ball Valve {#the-user-defined-motorized-ball-valve}

Sous les vannes Skynet dans la liste **Valves** se trouve la **User Defined Motorized Ball Valve**, pour une vanne dont Skynet n'a pas de dessin.
Elle marche comme une vanne Skynet (ouverte / fermée par sa broche, Tap water, les listes Close all et Open all), mais vous choisissez son image et
dites où sont les bouts de son tuyau :

- **Picture when on / off** et **Image Path 1, 2, 3** (Règle Skynet 7.10), comme pour tout Device.
- **In IP across % / In IP down %** et **Out IP across % / Out IP down %** : où se trouve chaque IP sur l'élément, en % de sa Width
  (0 = le bord gauche, 100 = le bord droit) et de sa Height (0 = le haut, 100 = le bas). Par exemple In 0 / 50 et Out 100 / 50 les mettent
  au milieu des bords gauche et droit. Laissez-les vides et Skynet les place pour vous comme avant.

Les IP suivent l'élément quand vous le déplacez, le redimensionnez ou le retournez.

## Manual Valve dans la liste Valves {#manual-valve-in-the-valves-list}

La dernière ligne de la liste **Valves** est la **Manual Valve**. Elle fait le même Widget Manual Valve que le bouton **Manual Valve ➕**
de la barre Edit layout. C'est toujours un Widget sans broche (Règle Skynet 1.2) : seul un clic sur le Tab l'ouvre ou la ferme.
