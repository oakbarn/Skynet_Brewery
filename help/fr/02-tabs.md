# Tabs (les écrans de votre brasserie) {#tabs-your-brewery-screens}

Un **Tab** est un écran de votre brasserie : une image de fond sur laquelle sont placés des pompes, des vannes, des températures, des minuteries et des tuyaux. Les boutons des Tabs sont en haut de l'écran **Tabs**. Sur cet écran, la barre de menus (Menu Bar) est cachée ; choisissez **☰ Menu > Show Menu Bar** pour la faire revenir (voir [The Menu Bar](40-menu-bar)). Les Processes peuvent faire passer tous les écrans sur un Tab avec `show tab "Brew Day"`.

**Zoom** et **Full screen** (plein écran) sont dans l'onglet de menu **☰ Menu > Zoom**. Voir [Zoom and Full screen](41-zoom-and-full-screen).

## Utiliser un Tab le jour du brassage {#using-a-tab-on-brew-day}

- **Touchez une sortie** (une pompe ou une vanne) pour l'allumer ou l'éteindre.
- **Touchez une valeur** pour ouvrir une grande fenêtre avec des boutons − / + et un pavé numérique.
- Les éléments réglés sur **Ask before changing** (demander avant de changer) affichent d'abord de grands boutons ON / OFF, pour qu'un geste maladroit sur l'écran ne démarre pas une pompe.
- Les tuyaux montrent un **écoulement en mouvement** quand le liquide circule vraiment dedans.
- Les alarmes ne font du bruit qu'après avoir appuyé sur **Enable sound** dans la barre de menus (choisissez d'abord **☰ Menu > Show Menu Bar**), une fois sur chaque écran qui doit les faire sonner (les navigateurs l'exigent).

## Changer la disposition (Admins) {#changing-the-layout-admins}

Appuyez sur le **cercle bleu avec les outils jaunes** (un marteau et une pioche croisés sur une équerre de charpentier), juste à côté de **☰ Menu** sur la barre des Tabs (ou appuyez sur **☰ Menu** et choisissez **Edit layout**). Une barre en pointillés apparaît avec ces boutons, et le bouton prend un anneau jaune tant que Edit layout est actif. Appuyez de nouveau pour quitter Edit layout ; si quelque chose a changé, il demande **Save** ou **Exit without Saving**. Seuls les Admins voient ce bouton.

| Bouton | Ce qu'il fait |
|---|---|
| **Select Device Type**, **Add Device** | Choisissez un type de Device (On/Off, Pumps, Valves, Probe ...), puis choisissez-en un dans **Add Device**. Il est d'abord créé sur le **Build Tab**. Voir [Edit layout bar](82-edit-layout-bar). |
| **Pumps**, **Valves**, **Probe**, **Heating Element**, **PWM** | Raccourcis : un clic n'affiche que la liste de ce type. |
| **⧉ Clone Device** | Affiche aussi sur ce Tab un Device d'un autre Tab. Voir [Cloned Devices](71-cloned-devices). |
| **Select Widget Type**, **Add Widget** | La même chose pour les Widgets : images et textes, commandes à l'écran, cuves, équipements, raccords, variables. |
| **Picture ➕**, **Text ➕**, **Manual Valve ➕** | Un clic chacun. Il est d'abord créé sur le **Build Tab**. |
| **Vessel** | Un Widget de cuve (Vessel Widget), une cuve intégrée (Integrated) ou une cuve manuelle. |
| **Add equipment ➕** | Refroidisseurs, serpentins, filtre à trub, tube RIMS et raccords de tuyau. |
| **Elbows, Tees …** | Un point d'écoulement ou un raccord de tuyau (voir plus bas), à côté de Draw pipe et Draw hose. |
| **Draw pipe** | Cliquez des points sur le Tab ; double-cliquez ou appuyez sur Entrée pour finir, Échap pour annuler. Sur un téléphone, utilisez **Finish pipe**. |
| **Draw hose** | Comme un tuyau rigide, mais il se courbe en arcs doux. Les bouts libres reçoivent un raccord. Voir [Pipes, hoses and reducers](24-pipes-and-hoses). |
| **🔒 Lock** | Verrouille l'élément choisi pour qu'il ne puisse pas être déplacé ni redimensionné. Le bouton indique alors **🔓 Unlock** : appuyez dessus pour déverrouiller. Les propriétés de chaque élément ont aussi une petite icône **Lock position** : 🔓 veut dire déverrouillé, 🔒 veut dire verrouillé. Cliquez dessus pour changer, puis Save. |
| **🔒 Lock All** | Verrouille en place tous les éléments de ce Tab d'un seul coup. C'est une action, pas un interrupteur : ensuite, vous pouvez déverrouiller des éléments un par un avec **🔓 Unlock**. Voir [Locking items in place](56-locking). |
| **🔓 Unlock All** | Déverrouille tous les éléments de ce Tab d'un seul coup. C'est aussi une action, pas un interrupteur. |
| **⚙ Tab settings** | Nom, couleur de fond, image de fond, taille et **Pipe size** (taille des tuyaux) de ce Tab. Un double-clic sur un endroit vide du Tab l'ouvre aussi. |
| **New tab** | Ajoute un Tab. |
| **🔨 Build Tab** / **👁 Preview** / **💾 Save Build ...** | Un Tab propre où tout ce qui est nouveau est d'abord créé, loin d'un écran chargé. **👁 Preview** le montre tel qu'il sera le jour du brassage. **Save Build ...** le met sur un Tab ou l'enregistre comme Template (modèle). Voir [Build Tab](55-build-tab). |
| **Save layout** / **Exit** | Save garde vos changements. Exit quitte Edit layout ; si quelque chose a changé, il demande **Save** ou **Exit without Saving** (**Keep editing** revient en arrière). Choisir **☰ Menu > Exit Edit layout** demande la même chose. Rien n'est changé tant que vous n'enregistrez pas. |

Faites glisser les éléments déverrouillés pour les déplacer (les éléments 🔒 verrouillés restent où ils sont, même dans Edit layout), faites glisser une poignée (un coin ou le milieu d'un côté) pour redimensionner (voir [Build Tab Add button](75-build-tab-add-button)), et **double-cliquez** (ou gardez le doigt dessus) pour ouvrir ses propriétés. Dans toutes les listes du panel, un double-clic ouvre aussi les propriétés (Properties) : voir [Double-click in lists](68-double-click-in-lists).

**Sur un téléphone ou une tablette**, rien ne peut être déplacé ni redimensionné, pour qu'un doigt ne bouge rien par accident. Touchez pour choisir un élément, gardez le doigt dessus pour ses propriétés (X, Y, Width et Height y sont). Voir [Phones and tablets](45-phones-and-tablets).

## Couleur et image de fond {#background-color-and-picture}

Chaque Tab a une image de fond et une couleur de fond. Choisissez **☰ Menu > Edit layout**, puis ouvrez **⚙ Tab settings** (le bouton, ou un double-clic sur un endroit vide ; sur un téléphone, gardez le doigt sur un endroit vide). Pas à pas : [Tab background picture and color](26-tab-background).

## Minuteries {#timers}

Une minuterie affiche hh:mm:ss avec quatre boutons : **▶** démarrer, **■** arrêter, **↺** remettre à 00:00:00, et **Set** (régler). **Set** ouvre une case pour heures : minutes : secondes (par exemple 01:30:00). Vous pouvez aussi taper le temps entier, comme `1:30:00`, dans la première case. Une minuterie en marche continue à partir du nouveau temps ; un compte à rebours décompte à partir de lui.

> Chaque Device et chaque Widget peut avoir une image : **.backpath**, **.backpath_2** et **.backpath_3**, et **.background** (1, 2 ou 3 ; 0, vide ou plus de 3 = aucune) choisit celle qui s'affiche. Un Process la change avec `my_widget.image = "Images/RedPump.png"`. Voir [Pictures on items](25-picture-paths). Les éléments On/Off ont une image distincte pour allumé et pour éteint.

## Tuyaux et écoulement {#pipes-and-flow}

1. Placez un **IP** (Initial Point, point de départ) là où un écoulement commence ou finit : une sortie de pompe, un port de cuve, une vidange.
2. Appuyez sur **Draw pipe**, cliquez sur l'IP de départ, cliquez sur les coudes, puis cliquez sur l'IP d'arrivée.
3. Les pompes viennent avec des IP **IN** et **OUT** ; une vanne a un IP à chaque bout.

Les IP ne s'affichent que tant que **Edit layout** est actif.

Le panel calcule l'écoulement lui-même : il part d'une pompe en marche et suit les tuyaux, les raccords et les vannes ouvertes. Une vanne fermée l'arrête. Un tuyau ne montre l'écoulement que s'il est relié d'IP à IP ; dans Edit layout, un **anneau rouge** marque un bout de tuyau qui n'est pas encore sur un IP.

Les **raccords** (fittings) sont des types d'IP : tuyau droit, té, coude à 90° et à 45°, croix, **vanne manuelle** (touchez-la pour l'ouvrir ou la fermer), **manchon** (coupling) et **bouchon** (pipe cap). Réglez **Turn (degrees)** pour les orienter dans le bon sens.

Chaque tuyau rigide et chaque tuyau souple a sa propre **Size** (1/2", 3/4", 1" ... ou mm). **Pipe size** (dans **⚙ Tab settings**) règle l'épaisseur à laquelle un tuyau de 1/2" est dessiné sur ce Tab ; les autres tailles et les raccords suivent à l'échelle, et un **réducteur** (reducer) apparaît là où deux tailles se rejoignent. Voir [Pipes, hoses and reducers](24-pipes-and-hoses).

## Cuves {#vessels}

**Add equipment** donne une cuve dessinée, ou votre propre image avec **Background picture path**. Donnez-lui un **Heater** (la sortie de l'élément chauffant ou du brûleur) et sa bande chauffante ou ses flammes s'allument tant que cette sortie est allumée. Déposez un IP sur une cuve et il devient l'un de ses ports : il bouge avec la cuve.
