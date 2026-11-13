# Verrouiller des éléments en place {#locking-items-in-place}

Un élément verrouillé ne peut être ni déplacé ni redimensionné, même en **Edit layout**. Seuls les éléments déverrouillés bougent. Un élément verrouillé montre un cadenas 🔒 en Edit layout.

Vous pouvez quand même ouvrir les propriétés d'un élément verrouillé (double-cliquez dessus) et le changer là, y compris son **X**, son **Y**, sa **Width** (largeur) et sa **Height** (hauteur).

## Verrouiller ou déverrouiller un élément {#lock-or-unlock-one-item}

1. Choisissez **☰ Menu > Edit layout**.
2. Cliquez sur l'élément.
3. Appuyez sur **🔒 Lock** dans la barre Edit layout. Le bouton dit alors **🔓 Unlock** : appuyez encore pour déverrouiller.
4. Appuyez sur **Save layout**.

Les propriétés de chaque élément ont aussi une petite icône **Lock position** : 🔓 veut dire déverrouillé, 🔒 veut dire verrouillé. Cliquez dessus pour changer, puis Save. Cela comprend les Skynet Fittings, les cuves Skynet et les cuves groupées (leurs Properties groupées ont aussi l'icône).

Verrouiller ou déverrouiller une cuve fait de même pour ses orifices (IP) et les raccords qui y sont joints, car ils bougent avec elle.

## Déplacer une cuve verrouillée par X et Y {#moving-a-locked-vessel-by-x-and-y}

Une cuve verrouillée 🔒 ne peut pas être déplacée à la souris, mais vous pouvez quand même la déplacer par son **X** et son **Y** (Règle Skynet 2.12). C'est pratique pour une petite retouche : déplacer une cuve de 1 pixel vers la gauche peut rendre l'écran bien plus joli.

1. En **Edit layout**, double-cliquez sur la cuve pour ouvrir ses Properties.
2. Tapez le nouveau **X** (gauche et droite) et le nouveau **Y** (haut et bas). Un de plus, c'est 1 pixel vers la droite (ou vers le bas) ; un de moins, c'est 1 pixel vers la gauche (ou vers le haut).
3. Appuyez sur **Save**, puis sur **Save layout**.

Les IP de la cuve, ses raccords joints et ses End Caps bougent avec elle, comme pour un glisser, et la cuve reste verrouillée. Les Properties d'une cuve groupée ont aussi X et Y : tout le groupe bouge. Un tuyau droit dont le bout reste en dehors d'un IP déplacé le lâche, comme après un glisser (voir [Pipe angles](105-pipe-angles-and-upright-kettles)).

## Lock All et Unlock All {#lock-all-and-unlock-all}

**🔒 Lock All** verrouille chaque élément du Tab que vous regardez : devices, widgets, images, textes, cuves, IP, tuyaux et flexibles. **🔓 Unlock All** déverrouille chaque élément de ce Tab.

Ce sont des actions, pas des interrupteurs. Appuyer sur l'un règle chaque élément une fois, puis vous reprenez la main :

1. Appuyez sur **🔒 Lock All**. Tout ce qui est sur le Tab est verrouillé.
2. Cliquez sur le seul élément que vous voulez déplacer et appuyez sur **🔓 Unlock**.
3. Déplacez-le, puis appuyez à nouveau sur **🔒 Lock** si vous voulez.
4. Appuyez sur **Save layout**.

Rien n'est gardé tant que vous n'appuyez pas sur **Save layout**. **Exit** sans enregistrer remet chaque verrou comme il était.

Les autres Tabs ne sont pas changés.

## Pourquoi cet élément déverrouillé ne bouge-t-il pas ? {#why-won-t-this-unlocked-item-move}

Un élément déverrouillé reste aussi en place quand le déplacer ferait bouger ou plier un élément verrouillé. Le message en bas de l'écran nomme les éléments verrouillés. Cela arrive quand :

- un **tuyau ou flexible** joint à l'élément est verrouillé (déplacer l'élément étirerait le tuyau),
- un **orifice (IP)** ou un **raccord joint** d'une cuve est verrouillé,
- le **raccord du bout ouvert** d'un tuyau droit est verrouillé.

Déverrouillez aussi ces éléments (cliquez sur chacun et appuyez sur **🔓 Unlock**), ou appuyez sur **🔓 Unlock All**.

## Equipment Profile verrouillé {#locked-equipment-profile}

Quand l'**Equipment Profile** du Tab est verrouillé, son équipement, ses IP et ses tuyaux ne peuvent pas changer du tout, donc leurs cadenas non plus. **🔒 Lock All** et **🔓 Unlock All** les sautent alors et disent combien ils en ont sautés. Voir [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

## Téléphones et tablettes {#phones-and-tablets}

Sur un téléphone ou une tablette, rien ne bouge en Edit layout de toute façon, sauf si l'interrupteur du Tab **Default** le permet. Voir [Phones and tablets](45-phones-and-tablets).
