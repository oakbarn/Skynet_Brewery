# Raccords Skynet {#skynet-fittings}

Un **Skynet Fitting** est un Tab_Fitting fait à partir d'un Skynet Fitting Template : un coude, un té, un coude en U, une réduction, un End Cap (bouchon) ou un raccord de vanne. C'est un seul bloc, comme le raccord que vous achetez :

- **Chaque ouverture a un IP intégré.** L'IP est sur l'ouverture de l'image. Il marche dans les deux sens : le liquide peut y entrer ou en sortir.
- Les IP ne peuvent être ni déplacés, ni réglés, ni retirés, et le raccord ne peut pas être dégroupé. Tracez vos tuyaux vers les IP.
- Ses **Properties** n'ont aucun réglage d'IP.

Les raccords que vous construisez vous-même (à partir d'un Template groupé de l'utilisateur) marchent comme avant : vous ajoutez les IP, vous les placez et vous les groupez. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

## Ouvrir ses Properties {#opening-its-properties}

En **Edit layout**, double-cliquez sur le raccord (sur un téléphone, gardez le doigt dessus). Double-cliquer sur un de ses IP ouvre aussi les Properties du raccord. Un Skynet Fitting joint à un orifice de cuve ouvre aussi ses propres Properties, même quand la cuve est groupée.

## Orientation

Tournez un raccord dans le sens voulu avec ces réglages. L'image tourne, et ses IP suivent leurs ouvertures :

- **Flip Horizontal** : la gauche devient la droite.
- **Flip Vertical** : le haut devient le bas.
- **Rotate** : 45, 90, 135, 180, 225, 270 ou 315 degrés dans le sens des aiguilles d'une montre. Utilisez les pas de 45 degrés pour mettre un raccord en biais.

Le retournement se fait d'abord, puis la rotation. Un raccord posé sur un orifice de cuve qui pointe vers le haut ou vers la gauche est retourné pour vous, pour que son bout éloigné pointe à l'opposé de la cuve.

Vous pouvez aussi faire glisser le coin d'un Skynet Fitting pour l'agrandir ou le rapetisser. Ses IP restent sur les ouvertures.

## Bouchons (End Caps) {#end-caps}

Un **End Cap** ferme une ouverture qui ne sert pas, par exemple le côté libre d'un té.

1. Mettez un **End_Cap** sur le Tab depuis **☰ Menu > Fitting Templates**.
2. Faites-le glisser sur l'ouverture. Il s'accroche sur l'IP.

Une ouverture bouchée ne montre pas d'IP, aucun tuyau ne peut s'y joindre et aucun liquide n'y coule. Le bouchon est groupé avec ce qu'il bouche : quand vous déplacez le raccord ou la cuve, le bouchon suit. Pour la rouvrir, faites glisser le bouchon hors de l'ouverture. Supprimer un raccord supprime les bouchons qui sont dessus.

Un IP qui a déjà un tuyau ne peut pas être bouché.

Le bouchon est dessiné de côté, comme un vrai bouchon TC. Sur une ouverture il se tourne tout seul vers elle : debout sur une ouverture qui pointe à gauche ou à droite, couché sur une qui pointe vers le haut ou le bas, et en biais sur une ouverture à 45 degrés.

## Anciens Tab_Fittings {#older-tab-fittings}

Les Tab_Fittings venant d'un Template Skynet d'avant ce changement deviennent tout seuls des Skynet Fittings. Un **Turn** qu'ils avaient est gardé comme leur **Rotate**. Si un de leurs IP a été éloigné de son ouverture, ouvrez les Properties du raccord et appuyez sur **Save** : les IP retournent sur les ouvertures.
