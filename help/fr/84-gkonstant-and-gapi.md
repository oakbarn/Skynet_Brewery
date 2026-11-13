# gKonstant et gAPI (nouveaux noms) {#gkonstant-and-gapi-new-names}

> **Remplacé le 2026-10-30 :** gKonstant et gAPI sont maintenant une seule classe, **gGlobal** (noms `gG_`), et l'API est `/api/items`. Voir [Database and .API on every Device and Widget](98-database-and-api). Cette page raconte l'historique.

Le 2026-10-28, les deux classes de variables ont été renommées :

| Avant | Maintenant | Ce que c'est |
|---|---|---|
| **vKonstant** | **gKonstant** | Une variable pour les Processes et l'écran seulement. Jamais dans l'API ni dans la base de données. |
| **vAPI** | **gAPI** | Une variable pour les Processes, l'écran, l'API et la base de données. |

Tout ce qui est à l'écran, dans l'aide, dans les couleurs et le texte prédictif de l'éditeur de Process, et dans le fichier de couleurs Notepad++ dit maintenant gKonstant et gAPI.

## Préfixes des noms proposés {#suggested-name-prefixes}

Le nom proposé d'une nouvelle variable commence maintenant par **gK** (gKonstant) ou **gA** (gAPI). Les lettres suivantes disent toujours la sorte, comme avant :

| Sorte gKonstant | Préfixe | | Sorte gAPI | Préfixe |
|---|---|---|---|---|
| Graphic | `gK_` | | String | `gAS_` |
| String | `gKS_` | | Value | `gAV_` |
| Long String | `gKL_` | | Time | `gAT_` |
| Value | `gKV_` | | Date Time | `gADT_` |
| Time | `gKT_` | | Boolean | `gAB_` |
| Date Time | `gKDT_` | | | |
| Boolean | `gKB_` | | | |
| Switch | `gKSW_` | | | |
| Push Button | `gKPB_` | | | |
| Pulse Button | `gKMB_` | | | |
| List | `gKList_` | | | |
| Step | `gKStep_` | | | |

Les préfixes sont une indication, jamais une obligation : tout nom permis marche.

## Vos anciens Schemas et Processes {#your-older-schemas-and-processes}

Tout est mis au nouveau standard ; les anciens mots ne sont pas gardés (Règle Skynet 15.2). La première fois que le Brain démarre après cette mise à jour :

- Chaque vKonstant devient un gKonstant et chaque vAPI un gAPI, dans chaque Schema.
- Chaque gKonstant ou gAPI dont le nom commence par `vK..._` ou `vA..._` est renommé `gK..._` ou `gA..._` (`vKV_Strike` devient `gKV_Strike`). Si ce nom est pris, `_2` est ajouté.
- C'est le même élément (sa clé cachée reste), donc tout ce qui l'utilise suit : **chaque Process**, les autres Devices et Widgets qui pointent vers lui, les valeurs enregistrées, la correspondance BeerXML et l'historique de la base de données de brassage.
- Les anciens fichiers sont gardés comme copies `.before-gnames.bak`, et la liste de ce qui a changé s'affiche sur la page Processes.
- Un fichier de Schema d'avant cette mise à jour est changé de la même façon quand il est chargé.
- Les Schemas exemples et les Processes de démonstration fournis avec Skynet utilisent déjà les nouveaux noms.

## L'API {#the-api}

L'adresse de l'API web est maintenant **`/api/gapi`** (voir [The API](11-api)). `/api/vapi` n'existe plus : un programme qui l'utilisait doit passer à `/api/gapi`. Les programmes qui utilisent le nom d'une variable renommée (Node-RED, Home Assistant par MQTT) doivent aussi utiliser le nouveau nom.

## Importer {#importing}
