# About et les versions de Schema {#about-and-schema-versions}

## L'onglet de menu About {#the-about-menu-tab}

**☰ Menu > About** montre :

- **Signed in as** : votre nom d'utilisateur et si vous êtes Viewer, Operator ou Admin.
- **Schema** : le Schema chargé en ce moment, sous forme de liste déroulante. Choisissez-y un autre Schema pour le charger, directement depuis l'onglet About (Admins). C'est la même liste que sur la Menu Bar et l'onglet **☰ Menu > Schema**, avec les mêmes choix (Add new, Clone, Rename, versions, sauvegardes, Delete). Si un Process tourne, vous êtes d'abord prévenu, et chaque sortie est éteinte avant que l'autre Schema se charge. Voir [Switching and cloning Schemas](48-schema-switching-and-cloning).
- **Schema version** : sa version, ou « No version yet » (pas encore de version).
- **Last saved** : quand le Schema a été enregistré pour la dernière fois.

Le bouton **Sign out** est ici aussi. Votre nom d'utilisateur et Sign out ne sont plus sur la Menu Bar.

## Les versions de Schema {#schema-versions}

Une version est le nom du Schema avec la date et l'heure de son enregistrement, à l'horloge du Brain :

`<Schema name>_yyyymmddThhmm` (ISO 8601 : année, mois, jour, T, heure, minute), par exemple `Oak Barn_20261021T0940`. Les versions enregistrées avant le 23 octobre 2026 gardent leurs anciens noms, par exemple `Oak Barn_20261021_09_40`, et peuvent toujours être restaurées.

### Faire une version {#making-a-version}

- Dans **Edit layout**, allumez **Update Schema Version** à côté de **Save layout**, puis enregistrez. Le même interrupteur est dans la fenêtre « Leave Edit layout? ». L'interrupteur reste comme vous l'avez laissé sur ce navigateur.
- Ou choisissez **Save a new version now** dans la liste **Schema** de la Menu Bar (Admins).

Chaque version est gardée dans son propre fichier, nommé d'après la version, dans `config/schemas/versions/<Schema>/` sur le Brain (les espaces du nom deviennent `_`). Les anciennes versions ne sont jamais supprimées.

Le Schema lui-même est toujours enregistré dans `config/schemas/<Schema>.json`, comme avant, donc le chargement des Schemas, les sauvegardes quotidiennes et la restauration marchent toujours de la même façon.

### Revenir à une version {#going-back-to-a-version}

Choisissez **Restore a backup or version ...** dans la liste **Schema**. Les versions s'affichent comme **Version <name>** à côté des sauvegardes. Le Schema tel qu'il est maintenant est d'abord sauvegardé, donc une restauration peut être annulée.
