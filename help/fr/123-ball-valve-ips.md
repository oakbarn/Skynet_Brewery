# IP des vannes à bille et des pompes {#ips-on-ball-valves-and-pumps}

Chaque vanne à bille a **deux IP**, un à chaque bout de tuyau, donc un tuyau se joint de chaque côté (Règle Skynet 5.24). C'est vrai pour
le **Device Skynet Motorized Ball Valve** et pour le **Widget Manual Valve** (la vanne à bille tournée à la main), dans chaque
Orientation. Les IP sont là où la Règle 5.20 les met : au centre de l'ouverture, ce qui sur une vanne TC est le centre de la
face extérieure de la virole (le bout plat où va le collier).

## Skynet Motorized Ball Valve (un Device) {#skynet-motorized-ball-valve-a-device}

| Orientation | Où sont ses deux IP |
| --- | --- |
| Horizontal | les bouts gauche et droit de son tuyau |
| Vertical Left, Vertical Right | les bouts haut et bas de son tuyau |
| 45 degrees | les deux bouts de son tuyau, tournés avec l'image |
| Front (en regardant dans le tuyau) | les deux au centre de l'ouverture |

L'Orientation **45 degrees** mettait avant les IP aux coins de la case. Maintenant ils tournent avec l'image et sont sur les bouts
du tuyau, comme pour toutes les autres Orientations. Cela marche pour chaque dessin de vanne Skynet qui peut tourner de 45 degrés.

## Widget Manual Valve {#manual-valve-widget}

| Image | Où sont ses deux IP |
| --- | --- |
| Plain (la vanne dessinée) | les bouts gauche et droit de la vanne dessinée |
| Manual Ball Valve, side view | la face extérieure de chaque virole, à gauche et à droite |
| Manual Ball Valve, front view | les deux au centre de l'ouverture |
| Manual Ball Valve on a front elbow | le centre de l'ouverture, et la face extérieure de la virole du bas |
| Une image à vous | le milieu de ses côtés gauche et droit |

- **Rotate 45** dans la barre Edit layout tourne la vanne, et ses IP tournent avec elle. Deux pas la mettent debout (Vertical).
- Une vanne manuelle est **centrée sur ses tuyaux**, comme toute autre vanne (Règle 5.23).
- Une vanne manuelle fermée bloque toujours ses deux bouts ; ouverte, le passage la traverse dans les deux sens.
- Son nom (ManualValve_1) et son `.state` sont les mêmes qu'avant. Seule la façon dont les tuyaux s'y joignent a changé.

## Pompes Skynet {#skynet-pumps}

Chaque pompe Skynet a un **IP sur son entrée** (IN) et un **IP sur sa sortie** (OUT), dans les deux Orientations (Right et Left) et
avec n'importe quel Cover (Règle Skynet 5.24).

Ils sont sur deux des **8 IP** de la pompe (les 4 coins et le milieu de chaque côté de sa case, les mêmes sur chaque pompe) : son
**Inlet IP** et son **Outlet IP**, choisis dans ses Properties (aide 130). Une pompe Skynet commence avec son entrée au milieu à droite et sa
sortie en haut à droite, avec un flexible ou un tuyau tracé depuis ses vrais orifices jusqu'à eux. La pompe de puisard garde les siens : le milieu de la
grille en bas (IN) et le haut de la colonne montante à droite (OUT).

L'Orientation **Left** fait un miroir de la pompe, et ses IP aussi.

## Anciens Schemas {#older-schemas}

Avant cela, un Widget Manual Valve n'avait qu'**un** IP, au milieu. Quand un Tab avec une ancienne vanne manuelle s'affiche (et une fois
quand vous ouvrez **Edit layout**), chaque tuyau qui était joint à son milieu est joint plutôt au bout le plus proche ; deux tuyaux prennent un bout
chacun (Règle 15.2). Appuyez sur **Save layout** pour le garder.
