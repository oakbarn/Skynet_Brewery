# Tuyaux, tuyaux souples et réducteurs {#pipes-hoses-and-reducers}

Dans Skynet Brewery, vous pouvez facilement ajouter des **Pipes** (tuyaux rigides), des **Hoses** (tuyaux souples), des **Pumps** (pompes) et des **Valves** (vannes) interactifs. S'ils sont électromécaniques (une pompe ou une vanne motorisée), les allumer fait couler l'écoulement depuis une source, par le côté entrée d'une pompe, et dans le tuyau rigide ou souple de son côté sortie. L'écoulement en mouvement s'affiche à l'écran tant qu'il coule vraiment.

## Les IP ne s'affichent que dans Edit layout {#ips-only-show-in-edit-layout}

Les **IP** (les points de raccordement ronds sur les pompes, les vannes, les cuves et les simples Widgets IP) ne s'affichent que tant que **Edit layout** est actif. Le jour du brassage, vous voyez les tuyaux, les tuyaux souples, les raccords et les images, pas les points. Un label que vous avez réglé pour s'afficher reste à l'écran.

## Tuyaux rigides (Pipes) {#pipes}

1. Choisissez **🛠 Build (Edit layout)** et appuyez sur **Draw pipe**.
2. Double-cliquez (ou touchez) le début, puis double-cliquez (ou touchez) la fin. Un tuyau est un seul morceau droit qui ne va qu'à l'**horizontale, à la verticale ou à 45 degrés** ; il ne tourne qu'à un raccord (un coude, un té ou une croix), que Skynet met là où deux tuyaux se rejoignent. Voir [Angles des tuyaux et bouilloires debout](105-pipe-angles-and-upright-kettles).
3. Double-cliquez sur le tuyau pour ouvrir ses réglages.

## Tuyaux souples (Hoses) {#hoses}

Un tuyau souple est un tuyau flexible : il se courbe en arcs doux.

1. Appuyez sur **Draw hose**.
2. Cliquez sur l'IP de départ (ou n'importe quel endroit), cliquez quelques points par où le tuyau doit passer, puis cliquez sur l'IP d'arrivée. Double-cliquez ou appuyez sur Entrée pour finir.
3. Un bout de tuyau souple qui n'est pas sur un IP reçoit un **raccord** (coupling), donc un tuyau souple a toujours un IP à chaque bout. Un autre tuyau peut être relié à ce raccord plus tard.

Un raccord qui n'a qu'un seul tuyau souple est un bout ouvert : quand l'écoulement l'atteint, il s'affiche en train de couler (comme un tuyau qui verse dans un fermenteur). Faites glisser les points d'un tuyau souple dans Edit layout pour changer sa courbe.

## Tailles {#sizes}

Chaque tuyau rigide et souple a sa propre **Size** (taille) dans ses réglages. Choisissez d'abord **Size units** : **Inch (SAE)** (pouces) ou **Metric (mm)**.

| Tuyau rigide (pouces) | Tuyau rigide (métrique) | Tuyau souple (pouces) | Tuyau souple (métrique) |
|---|---|---|---|
| 1/2" (le plus courant) | 15 mm (DN15) | 1/2" (le plus courant) | 13 mm |
| 1" | 25 mm (DN25) | 1" | 25 mm |
| 3/4" | 20 mm (DN20) | 3/4" | 19 mm |
| 1/4" | 8 mm (DN8) | 1/4" | 6 mm |
| 2" | 50 mm (DN50) | 2" | 50 mm |
| 3" | 80 mm (DN80) | | |
| 4" | 100 mm (DN100) | | |
| 5" | 125 mm (DN125) | | |
| 6" | 150 mm (DN150) | | |

**Custom** vous laisse taper n'importe quelle taille dans les unités choisies. Un nouveau tuyau rigide ou souple commence à la **Default pipe size** ou à la **Default hose size** de ☰ Menu > Default settings (1/2" sauf si vous la changez).

Les tailles sont dessinées en proportion : un tuyau de 1" est deux fois plus épais qu'un de 1/2". **Tab… > Pipe size** règle l'épaisseur d'un tuyau de 1/2" sur ce Tab (10 par défaut) ; toutes les autres tailles, et les raccords, grandissent ou rapetissent avec elle.

## Type d'IP {#ip-type}

Chaque tuyau et flexible a un **IP Type at start** et un **IP Type at end** : le raccord à chaque bout, avec sa taille (Règle Skynet 5.40). Les types sont :

- **Tri-Clamp** : TC1/2, TC3/4, TC1.5, TC2 ... jusqu'à TC6. Un Tri-Clamp se mesure par son collier : les tubes de 1/2", 3/4" et 1" utilisent souvent tous le **TC1.5** courant.
- **Filetage de tuyau (NPT)** : **FPT** est femelle et **MPT** est mâle, de 1/8" à 6" (FPT1/2, MPT1 ...). Un MPT va sur un FPT de même taille.
- **BSP** (filetage britannique), de 1/8" à 6". Il ne va pas sur du NPT.
- **Tuyau métrique (DN)** : DN6 à DN150.
- **Quick Disconnect**, inox : **FMSSQD** est femelle et **MSSQD** est mâle, de 1/2" à 3".
- **Camlock** : **CAMF** est le coupleur femelle et **CAMM** l'adaptateur mâle, de 1/2" à 6". Un CAMF va avec un CAMM de la même taille. Les Camlocks n'ont pas de dessin à eux.

**Seules les tailles que vous cochez apparaissent dans les listes.** Cochez-les dans ☰ Menu > Default settings > **IP Types**. Aucune n'est cochée au départ. Une taille déjà utilisée dans le Schema apparaît toujours aussi.

**Les bouts qui s'ajustent d'eux-mêmes :** un bout de tuyau sur une pompe, ou sur la sortie d'une Stove Top Vessel, va avec elle (un bout MPT1/2 sur un End Fitting FPT1/2). Son IP Type est grisé ; changez l'Inlet ou l'Outlet IP Fitting de la pompe pour le changer. Le bout Quick Disconnect d'un flexible est femelle (**FMSSQD**) là où il est sur un tuyau ou une pompe, et mâle (**MSSQD**) à son autre bout. Sur un tuyau ou une pompe Tri-Clamp, ajoutez le vrai adaptateur à cet endroit (le plus courant est TC1.5 vers MSSQD1/2) : en attendant, l'anneau orange ci-dessous s'affiche.

**Quand des bouts sont différents :** deux bouts de tuyau sur le même IP qui ne peuvent pas se joindre directement (Tri-Clamp vers NPT, MPT vers MPT) sont joints avec un adaptateur, comme dans votre brasserie, donc il n'y a pas de différence et pas d'avertissement. Les Properties de l'IP disent quel adaptateur est là (par exemple **Adapter: TC1.5 to MPT1/2**), seulement pour information.

Chaque bout est **dessiné selon son IP Type**, pour que vous le voyiez sur le Tab : une virole et un collier Tri-Clamp, un filetage NPT, un écrou hexagonal BSP, ou un raccord à cames Quick Disconnect avec ses deux bras. Il n'est pas dessiné là où le bout est sur un raccord, un Quick Disconnect ou un End Cap, déjà dessinés.

Un bout de **flexible** en **Quick Disconnect** peut être décroché et déplacé à tout moment, pas seulement dans Edit layout, comme un flexible QD (voir Help 127). Prenez un bout à la fois ; l'autre reste. Les tuyaux rigides ne bougent pas ainsi.

Un nouveau tuyau commence avec le **Default pipe IP Type**, et un nouveau flexible avec le **Default hose IP Type**, à sa propre taille, aux deux bouts. Les deux sont dans ☰ Menu > Default settings, à côté des tailles. Un flexible QD est toujours Quick Disconnect aux deux bouts. Changer un Default ne change jamais un tuyau ou un flexible déjà fait.

## Réducteurs {#reducers}

Là où des tuyaux de tailles différentes se rejoignent sur le même IP ou le même raccord, un **réducteur** (reducer) apparaît tout seul : un cône de la plus grande taille vers la plus petite, en proportion des deux côtés. Il n'y a rien à ajouter ni à régler. Un raccord (té, coude, croix, manchon, vanne manuelle) prend la taille du plus gros tuyau qui lui est relié.

## Supprimer un tuyau ou un flexible {#deleting-a-pipe-or-hose}

Supprimez un tuyau rigide ou souple depuis ses Properties (🗑 Delete), ou attrapez-le dans Edit layout : la fenêtre **Move** a un
bouton rouge **🗑 Delete Pipe** (ou **Delete Hose**). Ses propres IP partent avec lui : un raccord (coupling) ou un point IP à l'un de
ses bouts est supprimé aussi quand rien d'autre n'y est (pas d'autre tuyau, de Quick Disconnect ni d'End Cap, et pas une ouverture
de cuve). **↩ Put back** (Ctrl+Z) le remet.

## Raccords sur un tuyau {#fittings-on-a-pipe}

Quand un té, une croix, une pompe ou une vanne va sur un tuyau, ou qu'un tuyau tourne à un coude, le tuyau est divisé en deux tuyaux. Leurs IP sont réglés et chaque réglage de l'ancien tuyau est gardé sur les deux (taille, IP Types, couleurs) : Skynet le fait en arrière-plan, sans rien vous demander. Chaque nouveau tuyau reçoit son propre Name. Un nouveau tuyau dessiné au bout d'un tuyau prend sa taille, son IP Type et sa couleur de la même façon.

## Raccourcir un tuyau {#shortening-a-pipe}

Attrapez un tuyau dans Edit layout et appuyez sur **🔓 Unlock its ends** : ses bouts se détachent et reçoivent un raccord (coupling). Faites glisser ce raccord (ou la poignée au bout) le long du tuyau pour le raccourcir ou l'allonger. Il reste sur sa propre ligne.

## Les tuyaux se voient toujours {#pipes-always-show}

Un tuyau ou un flexible se voit toujours sur son Tab, qu'il y ait du passage ou non, parce qu'il est vraiment là.

## Écoulement par gravité {#gravity-flow}

Sans pompe pour le pousser, le liquide sort par gravité de la sortie basse d'une cuve, le long de chaque chemin ouvert, en s'éloignant de la cuve. Une vanne fermée l'arrête, un clapet anti-retour (Check Valve) ne le laisse passer que dans son propre sens, et une pompe à l'arrêt (Off) le laisse passer, donc l'amorçage d'une pompe par retour se voit aussi. Skynet ne connaît pas la hauteur réelle des choses, donc l'écoulement par gravité est dessiné **plus clair et plus lent** que l'écoulement pompé. Quand une pompe déplace le liquide, c'est l'écoulement pompé qui s'affiche.
