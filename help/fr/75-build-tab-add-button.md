# Le bouton Add du Build Tab {#build-tab-add-button}

Trois outils de la barre **Edit layout** rendent la construction plus facile : les boutons pour tourner et retourner, des poignées sur chaque côté, et l'affichage X / Y / Width / Height. Le bouton **Edit layout** lui-même (le marteau et la pioche à côté de **☰ Menu**) est **bleu** (bleu marine au début ; depuis le 2026-11-07 un bleu moyen, #1D56B0, pour qu'il n'ait plus l'air noir).

## Le bouton Add {#the-add-button}

La case **➕ Add** a été remplacée le 2026-10-28 par les listes de types de Devices et de Widgets de la barre Edit layout : **Select Device Type**, **Add Device**, et les raccourcis **Pumps**, **Valves**, **Probe**, **Heating Element** et **PWM**. Voir [Edit layout bar](82-edit-layout-bar).

## La liste Add element (Relay module / SSR ...) {#the-add-element-list-relay-module-ssr}

La longue liste **Add element** est maintenant **Select Device Type** + **Add Device** pour les Devices et **Select Widget Type** + **Add Widget** pour les Widgets. Voir [Edit layout bar](82-edit-layout-bar).

## Tourner et retourner un raccord ou une cuve {#turn-and-flip-a-fitting-or-vessel}

Cliquez sur un raccord Skynet (un coude, un té, un U ...) ou une cuve Skynet en Edit layout. Quatre boutons apparaissent dans la barre Edit layout :

| Bouton | Ce qu'il fait |
|---|---|
| **⇆ Flip H** | Retourner horizontalement : miroir gauche-droite |
| **⇅ Flip V** | Retourner verticalement : miroir haut-bas |
| **⟲ 45** | Tourner de 45 degrés à gauche |
| **⟳ 45** | Tourner de 45 degrés à droite |

Les boutons de 90 degrés sont retirés (Règle Skynet 5.5) : les Flips font gauche et droite, et un quart de tour (un té debout) se fait en deux appuis sur un bouton 45.

L'image, ses IP et les raccords qui y sont joints suivent tous. Pour un raccord d'IP (le petit té, coude, croix ou vanne manuelle dessiné), seuls les boutons pour tourner marchent, car sa forme a le même aspect retournée. Les boutons ne s'affichent pas pour un élément verrouillé 🔒. Les mêmes réglages sont toujours dans les Properties de l'élément (Flip Horizontal, Flip Vertical, Rotate).

## Poignées pour redimensionner {#grab-points-to-resize}

En Edit layout, cliquez sur un élément déverrouillé : il reçoit **huit poignées**, une à chaque coin et une au milieu de chaque côté. Faites-en glisser une pour agrandir ou rapetisser l'élément :

- un **coin** change la largeur et la hauteur,
- un **côté** ne change que ce côté,
- le coin ou le côté opposé reste où il est.

Les éléments sur lesquels vous n'avez pas cliqué ne montrent que le coin en bas à droite, pour qu'un Tab chargé reste lisible. Cela marche sur le Build Tab et sur tous les autres Tabs. Les éléments verrouillés 🔒 n'ont pas de poignées (déverrouillez-les d'abord), et les téléphones et tablettes ne redimensionnent pas sauf si l'interrupteur de ☰ Menu > Default le permet.

## X, Y, Width et Height {#x-y-width-and-height}

Pendant que vous déplacez ou redimensionnez quelque chose, une petite case bleu marine à côté du pointeur montre son **X** et son **Y** (pixels depuis la gauche et le haut du Tab), sa **Width** (largeur) et sa **Height** (hauteur). Pour taper des nombres exacts, double-cliquez sur l'élément et réglez X, Y, Width et Height dans ses Properties.
