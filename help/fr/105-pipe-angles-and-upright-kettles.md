# Angles des tuyaux et bouilloires debout {#pipe-angles-and-upright-kettles}

Les tuyaux sont dessinés comme on assemble un vrai tuyau rigide, et les bouilloires sont toujours debout. Cela marche de la même façon sur le 🔨 Build Tab et sur chaque Tab.

## Les tuyaux vont à l'horizontale, à la verticale ou à 45 {#pipes-run-horizontal-vertical-or-45}

- **Un tuyau est une seule pièce droite.** Il va seulement à l'**horizontale**, à la **verticale** ou à **45 degrés**. Rien d'autre.
- **Un tuyau ne se plie jamais.** Pour changer de direction, il faut un raccord : un **coude à 90°** pour passer de l'horizontale à la verticale, un **coude à 45°** pour passer sur un 45, un **té** ou une **croix** là où les tuyaux se séparent.
- Les flexibles ne sont pas des tuyaux : un flexible se courbe toujours en douceur (voir [Pipes, hoses and reducers](24-pipes-and-hoses)).

## Tracer un tuyau {#drawing-a-pipe}

1. En Edit layout, appuyez sur **Draw pipe**.
2. Double-cliquez (ou touchez) là où le tuyau commence : sur un IP, ou n'importe où.
3. Déplacez la souris. Le tuyau suit la plus proche des directions permises (en largeur, en hauteur, ou l'un des quatre 45).
4. Double-cliquez (ou touchez) le bout. Il ne se joint à l'IP qui s'y trouve que si cet IP est aligné avec le départ.

Commencez le tuyau suivant au bout du dernier. Là où deux tuyaux se rencontrent, Skynet met le joint et le dessine comme le raccord qu'il leur faut, tourné dans le bon sens : un manchon droit quand ils sont alignés, un coude à 90°, un coude à 45°, un té ou une croix. Deux tuyaux séparés de seulement 45 degrés n'ont pas de raccord, donc le joint reste un simple manchon jusqu'à ce que vous changiez l'un d'eux.

## Déplacer des choses qui ont des tuyaux {#moving-things-that-have-pipes-on-them}

L'ancienne façon, où un bout de tuyau était entraîné avec une pompe, une vanne ou une cuve et où le tuyau se pliait à n'importe quel angle, est **retirée**. Maintenant :

- **Tout le tuyau suit** quand son autre bout est son propre bout ouvert (un manchon que seul ce tuyau utilise). Il garde sa longueur et son angle.
- **Le tuyau s'allonge ou se raccourcit le long de sa propre ligne** quand vous déplacez la chose à son bout dans l'axe du tuyau.
- **Déplacée sur le côté**, le tuyau garde sa direction et ne suit pas. Quand vous lâchez la souris, ce bout **lâche** l'IP, reçoit un bout ouvert (anneau rouge), et un message nomme le tuyau. Remettez l'élément dans l'axe, ou rejoignez le tuyau avec un coude ou un té.
- **Save layout le rejoint** quand le bout ouvert est encore à moins de 14 px d'un IP. Si le tuyau devait se plier, un point IP libre (sans autre tuyau dessus) revient plutôt sur le bout du tuyau.
- Un clic ou un double-clic qui tremble de quelques pixels ne déplace rien, et déplacer une chose ne fait jamais lâcher un tuyau ailleurs sur le Tab.
- Faire glisser un tuyau lui-même le déplace d'un bloc, comme avant. Lâché avec un bout sur un IP, il se joint à cet IP.

## Anciens Schemas {#older-schemas}

Quand un Schema est chargé, chaque ancien tuyau qui avait des coudes est **coupé à chaque coude en tuyaux droits**, et chaque coude reçoit un joint en coude, donc le dessin a le même aspect. Un morceau à un autre angle est tourné vers la direction permise la plus proche ; si son bout rate alors l'IP où il était, ce bout le lâche (anneau rouge en Edit layout). Les Schemas exemples et le Schema par défaut ont déjà été changés ainsi. La fenêtre Invite de commandes liste ce qui a été changé.

## Les bouilloires restent debout {#kettles-stay-upright}

- Une **bouilloire** (toute cuve de la sorte Vessel : bouilloires, HLT, cuve d'empâtage, fermenteur) peut seulement faire **Flip Horizontal**.
- Elle ne peut **pas faire Flip Vertical**, et elle n'est **pas tournée** (la mettre à l'envers revient à un retournement vertical). Les boutons Flip V et ⟲ 45 / ⟳ 45 sont grisés quand une bouilloire est choisie, et ses Properties ne montrent que Flip Horizontal.
- Les refroidisseurs, serpentins, le tube RIMS, les raccords Skynet et les autres équipements ont toujours tous les boutons pour tourner et retourner.
- Une bouilloire qui était tournée ou retournée à l'envers avant est remise debout quand vous ouvrez Edit layout. **Save layout** la garde ainsi.
