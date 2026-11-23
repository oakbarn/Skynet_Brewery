# Le Label ne peut pas être vide {#the-label-cannot-be-blank}

Chaque Device et chaque Widget a un **Label**, et un Label ne peut pas être vide (Règles Skynet 18.15 et 18.28).

## Ce que vous voyez {#what-you-see}

Dans toute case **Add** ou fenêtre **Properties** qui a un Label, vous pouvez quand même vous déplacer quand le Label est vide : la
touche **Tab** et la souris atteignent tous les autres champs et icônes (la case ⬆ sur deux lignes, le ⬢, Label Visible,
l'Interface, le Port, le Tab, l'aide ?). Seuls **Save** ou **➕ Add Device** (et une case grisée) attendent un Label. Cliquez sur
l'un d'eux avec le Label vide et une petite fenêtre s'affiche :

> ⚠ The Label cannot be blank.

(Le Label ne peut pas être vide.) Le curseur revient sur le Label pour que vous en tapiez un. La fenêtre disparaît d'elle-même après
**5 secondes** (ou appuyez dessus). Appuyer sur **Entrée** dans un Label vide vous y garde, et cliquer sur un endroit vide de la
fenêtre remet le curseur dans le Label.

## Ce qui marche toujours {#what-always-works}

- **✖ Cancel** est toujours « actif » : il marche même quand le Label est vide, donc vous pouvez toujours quitter la fenêtre. (Si vous avez changé
  quelque chose, il demande quand même d'abord.) **Échap** marche de même.
- **🗑 Delete** est aussi « actif » : il marche même quand le Label, le Port ou une case nécessaire est vide (il ne demande pas
  d'abord : l'objet part tout de suite, et **↩ Put back** (Ctrl+Z) le ramène).

## Le Port aussi {#the-port-too}

Quand un Device a besoin d'un Port (une broche de sa carte), c'est pareil pour le **Port** : Save ou **➕ Add Device** donne
**"⚠ The Port cannot be blank."** (le Port ne peut pas être vide) tant qu'il est vide. Un Port vide ne garde jamais le curseur,
donc vous pouvez aller à l'**Interface** et choisir une carte qui a un Port libre.

## Ajouter une nouvelle Interface depuis la liste déroulante {#adding-a-new-interface-from-the-dropdown}

Choisissez **➕ Add new Interface…** dans la liste déroulante Interface et la case Add Interface s'ouvre. Quand vous l'enregistrez, vous revenez avec la
**nouvelle Interface choisie** dans la liste. Si vous l'annulez, l'**Interface qui y était avant** (celle par défaut) est remise.
