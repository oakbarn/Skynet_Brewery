# Dimensionner une cuve par ses gallons {#vessel-sizing-by-gallons}

Les cuves ont leurs propres Règles (Règles Skynet, section 19). Elles s'appliquent **seulement aux Vessel Widgets et aux Vessel Devices** :
pour eux, elles remplacent la Règle 2.20 (poignées de redimensionnement), la Règle 1.21 (`.width` et `.height`) et les marques pâles de la Règle 5.31.

## Gallons

Chaque Vessel Widget a un champ **Gallons** (**Liters** quand ses Units sont Metric). C'est un des premiers champs de Vessel Widget
Properties, donc une nouvelle construction depuis un Template le demande juste après le Label. Un Vessel Template commence à **10 gallons**, Templates Skynet et
User de même, et le nombre peut être changé.

**La taille suit le volume**, comme grandit une vraie marmite : deux fois plus de gallons donne environ 1,26 fois plus de largeur et de hauteur.

| Gallons | Taille sur le Tab (pas encore de Master) |
| --- | --- |
| 1 | 197 x 237 |
| 5 | 337 x 405 |
| 10 | 424 x 511 |
| 15 | 486 x 584 |
| 20 | 535 x 643 |

## Method : Proportional ou Diameter {#method-proportional-or-diameter}

- **Proportional :** la forme est celle de la cuve simple Skynet, le **One Gallon start** de **197 x 237** pixels. Une cuve plus grande garde
  ce rapport largeur / hauteur.
- **Diameter :** tapez son **Diameter** et sa **Height** (pouces, ou cm en Metric). Elle est dessinée à sa **taille réelle** : ils donnent sa
  forme (une cuve aussi large que haute est dessinée carrée) et sa grandeur. Les gallons annoncés peuvent être faux, donc les Gallons que vous tapez
  sont gardés comme ce qu'elle contient mais ne changent jamais le dessin. **Calculated Volume** (lecture seule) montre ce que contient vraiment une cuve de ce Diameter
  et de cette Height.

Le **Dead space** (ce qui reste au fond) et le **Safe Element Volume** (le moins de liquide qui couvre sa résistance chauffante) sont
aussi gardés avec la cuve.

## Master Vessel Sizer

Un Tab peut désigner une cuve comme son **Master Vessel Sizer** : double-cliquez sur un endroit vide du Tab en Edit layout (**Tab settings**) et
choisissez-la sous **Master Vessel Sizer**. Le Master affiche un 📏 dans son coin en Edit layout.

- **Seul le Master peut être redimensionné**, avec ses poignées ou ses Width et Height. Toutes les autres cuves de ce Tab suivent : elles
  gardent toutes la même échelle, donc une cuve de 5 gallons paraît toujours moitié moins volumineuse qu'une de 10 gallons.
- Changer les **propres Gallons du Master** agrandit ou réduit seulement le Master. Changer les Gallons ou la Method d'une autre cuve redimensionne seulement
  cette cuve, à l'échelle du Master.
- Une cuve déplacée sur un Tab qui a un Master prend l'échelle du Master.
- Dans un Process, seule la taille du Master peut changer.
- **Pas de Master choisi : aucune cuve ne peut être redimensionnée.** Les cuves gardent leur taille. Une nouvelle construction sur le 🔨 Build Tab est quand même dessinée
  selon ses Gallons (1 gallon = 197 x 237, ou l'échelle du Tab où elle va).

Chaque cuve reste où elle était quand elle est redimensionnée : le milieu de son fond ne bouge pas. Ses IP, raccords et End Caps la
suivent. Un tuyau droit ne se plie jamais pour suivre (Règle 5.19) : un bout de tuyau qui n'est plus aligné se détache.

## Emplacements Not Placed : cachés jusqu'à Show All {#not-placed-spots-hidden-until-show-all}

Un emplacement **Not Placed** (aide : Vessel Widget) est caché partout, même sur le 🔨 Build Tab. Dans Vessel Widget Properties,
appuyez sur **👁 Show All** pour lister les emplacements Not Placed, afin d'en activer un, et pour montrer des marques pâles là où ils iraient. Appuyez sur
**🙈 Hide Not Placed** pour les cacher de nouveau. Ils sont cachés à nouveau quand les Properties se ferment.
