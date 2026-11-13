# Points actifs Properties sur un Vessel Device {#properties-hotspots-on-a-vessel-device}

Un **Vessel Device** (une cuve construite à partir d'un Vessel Widget Template, Règle Skynet 5.31) a de petits **points actifs ⚙** en **Edit layout**.
**Un clic** sur un point actif ouvre une fenêtre Properties (Règle Skynet 5.38).

| Où est le ⚙ | Ce qu'ouvre un clic |
|---|---|
| Le **coin en haut à droite** de la cuve | Les **Properties du Vessel Device lui-même** (son Name, ses Labels, ses Gallons, son Interface, les Ports de ses pièces, etc.) |
| Le milieu du bord supérieur d'un **Heating Element** intégré | Les Properties de cette **résistance chauffante** (sa méthode de chauffe, son Port, etc.) |
| Le milieu du bord supérieur d'une **Temperature Probe** ou d'un **Thermowell** intégré | Les Properties de cette **sonde de température** |
| Le milieu du bord supérieur d'une **Valve** intégrée | Les Properties de cette **vanne** |
| Un **🎨** là où un tuyau commence à une ouverture de la cuve | Une petite fenêtre avec l'**Out flow color** de la cuve |

## Point actif Flow Color 🎨 {#flow-color-hotspot}

Chaque ouverture libre (IP) d'un Vessel Device qui a un tuyau ou un flexible, ou un raccord qui y est joint, a un petit 🎨 là où
le tuyau commence :

- sur l'ouverture elle-même, quand le tuyau s'y joint ;
- au **bout extérieur du raccord** qui y est joint (un coude, un raccord à vanne ...), quand il y en a un ;
- au **bout extérieur d'une vanne intégrée** à l'ouverture.

Un clic montre une petite fenêtre avec l'**Out flow color** de la cuve. Choisissez une couleur (Mash, Boil, Red, votre propre RGB ...) et appuyez sur
**Save** : le débit qui commence à cette cuve prend cette couleur, à travers la pompe et jusqu'où il va
([Pipe and Hose Flow Colors](116-pipe-and-hose-flow-colors)). Un anneau autour du 🎨 montre la couleur choisie. Appuyez sur **Save layout** pour
la garder.

C'est le **même réglage** que **Out flow color** dans les Properties de la cuve (double-cliquez sur la cuve, ou cliquez sur son ⚙, et regardez
sous Flip Horizontal). Le 🎨 le met juste à un clic, là où le tuyau commence.

## L'On Overlay sur les pièces intégrées {#on-overlay-on-built-in-parts}

Une résistance ou une vanne intégrée à un Vessel Device montre l'**On Overlay** (l'éclair rouge et jaune, Règle Skynet 7.8)
tant qu'elle est en marche. Une résistance est en marche tant qu'elle est Enabled (Règle Skynet 7.9), et elle rougeoie aussi en orange.

## Pourquoi des points actifs {#why-hotspots}

Pourquoi : les pièces sont intégrées à la cuve et posées dessus, donc un double-clic sur la cuve tombe souvent sur une pièce et ouvre la
pièce au lieu de la cuve. Le ⚙ du coin ouvre toujours la cuve elle-même, et chaque pièce a son propre ⚙ pour qu'on sache clairement laquelle
va s'ouvrir.

- **Le double-clic marche toujours** comme avant (Règle Skynet 2.9) : sur la cuve pour la cuve, sur une pièce pour cette pièce.
- Un clic sur un ⚙ **ne déplace jamais rien** : il ne commence pas à traîner la cuve ni ses tuyaux.
- Gardez la souris sur un ⚙ pour voir ce qu'il va ouvrir.
- Les points actifs ne s'affichent **qu'en Edit layout**, où l'on change les Properties. Pendant le brassage, la cuve a son aspect habituel.
- Les téléphones et tablettes servent à faire tourner la brasserie (Règle Skynet 2.35), donc ils n'en ont pas.
