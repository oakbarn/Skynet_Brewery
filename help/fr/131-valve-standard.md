# Le standard des vannes : échanger une vanne contre une autre {#the-valve-standard-swap-one-valve-for-another}

Chaque image de vanne est dessinée dans la **même case de 300 x 300**, avec son tuyau qui passe **par le milieu**, donc ses **deux IP sont toujours
aux mêmes places** (Règle Skynet 5.29). Vous pouvez changer une vanne à bille pour une vanne papillon, ou une vanne manuelle pour une motorisée, au
**même X et Y et à la même taille**, et elle reste jointe aux mêmes tuyaux.

## Où sont les IP {#where-the-ips-are}

Une vanne commence à **150 x 150** sur un Tab (comme une pompe, donc les vannes et les pompes sont à la même échelle).

| Orientation | Dans le dessin de 300 x 300 | Sur une vanne de 150 x 150 |
|----|-----|-----|
| Horizontal | (0, 150) et (300, 150) | le milieu des côtés gauche et droit |
| Vertical Left, Vertical Right | (150, 0) et (150, 300) | le milieu du haut et du bas |
| 45 degrees | les places Horizontal, tournées de 45 degrés autour du milieu | |
| Front (en regardant dans le tuyau) | les deux à (150, 150) | le milieu |
| Front elbow | (150, 150) et (150, 300) | le milieu, et le milieu du bas |

Si vous redimensionnez une vanne, les places grandissent ou rétrécissent avec sa case. Gardez-la carrée pour que les places restent sur ses côtés.

## Dessinées à l'échelle {#drawn-to-scale}

Chaque dessin de vanne Skynet est à la même échelle dans la case. Une vanne plus courte que la case a son tuyau prolongé, tout droit,
jusqu'au bord de la case, là où est l'IP.

## Une vanne avec votre propre image {#a-valve-with-your-own-picture}

Pour une **User Defined Motorized Ball Valve**, une **User Defined Proportional Valve**, ou toute vanne avec une image à vous :

- Votre image est **redimensionnée pour remplir la case carrée**, et les IP vont aux mêmes places que ceux d'une vanne Skynet pour son Orientation.
- Si vous réglez ses **places In et Out** (le ⬢ à côté de Path (closed), ou les cases en %), Skynet **déplace et redimensionne votre image** pour que ces
  deux places tombent juste sur les IP. Une partie de l'image peut être coupée au bord, ou elle peut paraître un peu décentrée. C'est le prix
  à payer pour que chaque vanne s'aligne de la même façon.

## Anciens Schemas {#older-schemas}

La première fois qu'un Schema est ouvert, chaque vanne avec une image devient **carrée autour de son milieu** : 150 x 150, ou plus petite si un tuyau joint
à elle est trop court pour que les IP s'éloignent autant. Elle est ensuite remise sur ses tuyaux (Règle 5.23). **Save layout** la garde ainsi.

Le **Widget Manual Valve** prend la taille de son tuyau, comme un raccord de tuyauterie, il ne fait donc pas partie de ce standard. Le **clapet anti-retour** est un
raccord de tuyauterie.
