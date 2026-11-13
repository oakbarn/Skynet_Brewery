# Tuyaux, tuyaux souples et réducteurs {#pipes-hoses-and-reducers}

Dans Skynet Brewery, vous pouvez facilement ajouter des **Pipes** (tuyaux rigides), des **Hoses** (tuyaux souples), des **Pumps** (pompes) et des **Valves** (vannes) interactifs. S'ils sont électromécaniques (une pompe ou une vanne motorisée), les allumer fait couler l'écoulement depuis une source, par le côté entrée d'une pompe, et dans le tuyau rigide ou souple de son côté sortie. L'écoulement en mouvement s'affiche à l'écran tant qu'il coule vraiment.

## Les IP ne s'affichent que dans Edit layout {#ips-only-show-in-edit-layout}

Les **IP** (les points de raccordement ronds sur les pompes, les vannes, les cuves et les simples Widgets IP) ne s'affichent que tant que **Edit layout** est actif. Le jour du brassage, vous voyez les tuyaux, les tuyaux souples, les raccords et les images, pas les points. Un label que vous avez réglé pour s'afficher reste à l'écran.

## Tuyaux rigides (Pipes) {#pipes}

1. Choisissez **☰ Menu > Edit layout** et appuyez sur **Draw pipe**.
2. Double-cliquez (ou touchez) le début, puis double-cliquez (ou touchez) la fin. Un tuyau est un seul morceau droit qui ne va qu'à l'**horizontale, à la verticale ou à 45 degrés** ; il ne tourne qu'à un raccord (un coude, un té ou une croix), que Skynet met là où deux tuyaux se rejoignent. Voir [Pipe angles and upright kettles](105-pipe-angles-and-upright-kettles).
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

**Custom** vous laisse taper n'importe quelle taille dans les unités choisies. Un nouveau tuyau commence à 1/2".

Les tailles sont dessinées en proportion : un tuyau de 1" est deux fois plus épais qu'un de 1/2". **Tab… > Pipe size** règle l'épaisseur d'un tuyau de 1/2" sur ce Tab (10 par défaut) ; toutes les autres tailles, et les raccords, grandissent ou rapetissent avec elle.

## Réducteurs {#reducers}

Là où des tuyaux de tailles différentes se rejoignent sur le même IP ou le même raccord, un **réducteur** (reducer) apparaît tout seul : un cône de la plus grande taille vers la plus petite, en proportion des deux côtés. Il n'y a rien à ajouter ni à régler. Un raccord (té, coude, croix, manchon, vanne manuelle) prend la taille du plus gros tuyau qui lui est relié.

## Ne montrer que l'écoulement {#showing-only-the-flow}

Si l'image de fond du Tab montre déjà votre tuyauterie, éteignez **Show when nothing flows** (afficher quand rien ne coule) sur ce tuyau. Seul l'écoulement en mouvement apparaît alors par-dessus l'image.
