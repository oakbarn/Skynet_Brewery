# Build Template Tab

**☰ Menu > Build Template** (Admins seulement) est l'endroit où les Device Templates sont faits et changés (Règle Skynet 5.18).

## Choisir un Template {#picking-a-template}

La liste en haut montre chaque Device Template, par exemple Skynet Motorized Ball Valve: Horizontal, et ses autres
Orientations : Vertical Left, Vertical Right et Front.

- **➕ New Template** en fait un vide. Donnez-lui un nom avec des lettres, des chiffres, _ et -, sans espaces.
- **⧉ Clone** fait une copie de celui qui est affiché.

## Les réglages du Template {#the-template-s-settings}

- **Title** est « vanne: Orientation », par exemple Skynet Motorized Ball Valve: Vertical Right. Les listes Add Device ne montrent que la
  partie avant les deux-points, une fois par vanne ; la partie après est un choix dans l'Orientation de la vanne.
- **Main Template** (Template principal) en fait une autre Orientation de cette vanne. Elle hérite de tout du Template principal et ne garde que
  ce qui diffère (par exemple Vertical Right : Orientation Vertical, Flip Horizontal activé).
- **Pictures** : une paire (quand On, quand Off) pour Horizontal et une pour Vertical. L'image suit l'Orientation du Device ; à
  45 degrés, l'image verticale est tournée.

## Les attributs et « User can set » {#attributes-and-user-can-set}

Chaque attribut du Device est listé avec :

- sa **valeur dans le Template**, avec laquelle commence chaque User version, et
- une case **User can set**. **Cochée** veut dire que l'attribut s'affiche dans les Properties des Devices faits à partir de ce Template, et qu'un
  utilisateur peut le changer. **Non cochée** veut dire qu'il est fixé : il est caché, et le Brain le remet à la valeur du Template chaque
  fois que la disposition est enregistrée (Règle 5.16).

Certains attributs sont **toujours fixés** : les images, Kind, Valve type, Service, Look, Digits, When tapped, Tap target, Ask before
changing, le fond et les images de fond (.backpath ...). Leur case est grisée.

Les attributs qui appartiennent à chaque Device (Name, Label, Tab, X, Y, Interface, Pin, Lock) n'ont pas de valeur de Template, seulement la case.

Appuyez sur **💾 Save** (en haut ou en bas). Les listes Add Device utilisent le changement tout de suite.

## Templates Skynet et verrouillage {#skynet-templates-and-locking}

Tant que Skynet est encore en construction, chaque Template fait ou changé ici est un **Template Skynet**. Un changement à un Template livré est
gardé sur ce Brain jusqu'à ce qu'il soit envoyé sur GitHub. Quand les Templates Skynet seront finis, ils seront **verrouillés** : ils ne pourront alors
qu'être clonés, et cet onglet fera des Templates groupés de l'utilisateur. Les Templates Skynet livrés ne sont jamais supprimés.
