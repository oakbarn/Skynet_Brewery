# Le Label ne peut pas être vide {#the-label-cannot-be-blank}

Chaque Device et chaque Widget a un **Label**, et un Label ne peut pas être vide (Règles Skynet 18.15 et 18.28).

## Ce que vous voyez {#what-you-see}

Dans toute case **Add** ou fenêtre **Properties** qui a un Label : si le Label est vide et que vous cliquez ou appuyez sur autre chose (un autre champ,
un interrupteur, une liste déroulante, **Save**, **➕ Add Device**, une icône), rien ne se passe sauf une petite fenêtre :

> ⚠ The Label cannot be blank.

(Le Label ne peut pas être vide.) Le curseur revient sur le Label pour que vous en tapiez un. La fenêtre disparaît d'elle-même après **5 secondes** (ou appuyez dessus). Appuyer sur
**Tab** ou **Entrée** dans un Label vide fait la même chose.

## Ce qui marche toujours {#what-always-works}

- **✖ Cancel** est toujours « actif » : il marche même quand le Label est vide, donc vous pouvez toujours quitter la fenêtre. (Si vous avez changé
  quelque chose, il demande quand même d'abord.) **Échap** marche de même.
- Les icônes **⬆** (case plus grande) et **⬢** (attributs du Label) du Label lui-même, puisqu'elles servent à taper le Label.

## Le Port aussi {#the-port-too}

Quand un Device a besoin d'un Port (une broche de sa carte), c'est pareil pour le **Port** : une fois sur la liste déroulante Available Ports et
tant qu'elle est vide, cliquer sur autre chose donne **"⚠ The Port cannot be blank."** (le Port ne peut pas être vide). Vous pouvez quand même revenir au **Label** ou à l'
**Interface** (par exemple pour choisir une carte qui a un Port libre), et Cancel marche toujours.

## Ajouter une nouvelle Interface depuis la liste déroulante {#adding-a-new-interface-from-the-dropdown}

Choisissez **➕ Add new Interface…** dans la liste déroulante Interface et la case Add Interface s'ouvre. Quand vous l'enregistrez, vous revenez avec la
**nouvelle Interface choisie** dans la liste. Si vous l'annulez, l'**Interface qui y était avant** (celle par défaut) est remise.
