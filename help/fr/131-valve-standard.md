# Le standard des vannes : échanger une vanne contre une autre {#the-valve-standard-swap-one-valve-for-another}

Chaque image de vanne est dessinée dans la **même case de 300 x 300**, avec son tuyau qui passe **par le milieu**, donc ses **deux IP sont toujours
aux mêmes places** (Règle Skynet 5.29). Vous pouvez changer une vanne à bille pour une vanne papillon, ou une vanne manuelle pour une motorisée, au
**même X et Y et à la même taille**, et elle reste jointe aux mêmes tuyaux.

## Où sont les IP {#where-the-ips-are}

Une vanne vue de côté fait **75 x 150** sur un Tab quand elle est à plat et **150 x 75** quand elle est debout : sa case n'est pas plus
longue que la vanne, et aussi haute que la vanne la plus haute. Une vue de face (en regardant dans le tuyau) fait **150 x 150**. Les vannes et les pompes sont à la même échelle.

| Orientation | Dans le dessin | Sur le Tab |
|----|-----|-----|
| Horizontal (dessin de 150 x 300) | (0, 150) et (150, 150) | le milieu des côtés gauche et droit : les bouts de la vanne |
| Vertical Left, Vertical Right (dessin de 300 x 150) | (150, 0) et (150, 150) | le milieu du haut et du bas : les bouts de la vanne |
| 45 degrees | les places Horizontal, tournées de 45 degrés autour du milieu | |
| Front (en regardant dans le tuyau) | les deux à (150, 150) | le milieu |
| Front elbow | (150, 150) et (150, 225) | le milieu, et à un quart du bas |

Si vous redimensionnez une vanne, les places grandissent ou rétrécissent avec sa case. La case garde sa forme (sa longueur est la moitié de sa hauteur). Tournée de à plat à debout, sa case tourne aussi. Une vanne avec votre propre image garde ses places au milieu des côtés de la case.

## Dessinées à l'échelle {#drawn-to-scale}

Chaque dessin de vanne Skynet est à la même échelle, et chaque vue de côté a la même longueur que la Motorized Ball Valve, d'un bout
à l'autre. Ses IP sont sur ses propres bouts ; la case est aussi haute que la vanne la plus haute, donc le moteur ou la poignée y tient toujours.
Les tuyaux qui y sont joints vont jusqu'à ses bouts.

## Une vanne avec votre propre image {#a-valve-with-your-own-picture}

Pour une **User Defined Motorized Ball Valve**, une **User Defined Proportional Valve**, ou toute vanne avec une image à vous :

- Votre image est **redimensionnée pour remplir la case carrée**, et les IP vont aux mêmes places que ceux d'une vanne Skynet pour son Orientation.
- Si vous réglez ses **places In et Out** (le ⬢ à côté de Path, ou les cases en %), Skynet **déplace et redimensionne votre image** pour que ces
  deux places tombent juste sur les IP. Une partie de l'image peut être coupée au bord, ou elle peut paraître un peu décentrée. C'est le prix
  à payer pour que chaque vanne s'aligne de la même façon.

## Anciens Schemas {#older-schemas}

La première fois qu'un Schema est ouvert, chaque vanne avec une image devient **carrée autour de son milieu** : 150 x 150, ou plus petite si un tuyau joint
à elle est trop court pour que les IP s'éloignent autant. Elle est ensuite remise sur ses tuyaux (Règle 5.23). **Save layout** la garde ainsi.

Le **Widget Manual Valve** prend la taille de son tuyau, comme un raccord de tuyauterie, il ne fait donc pas partie de ce standard. Le **clapet anti-retour** est un
raccord de tuyauterie.
