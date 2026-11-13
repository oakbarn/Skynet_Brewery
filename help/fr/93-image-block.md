# Bloc des images {#image-block}

Chaque fenêtre de Device ou de Widget qui a des images les montre de la même façon :

| Champ | Ce qu'il fait |
|---|---|
| **Background #** | **1**, **2** ou **3** montre l'Image Path 1, 2 ou 3. Tout autre nombre ne montre aucune image. Vide = 1. Un Process : `name.background = 2` |
| **Back Colour** | Une couleur derrière l'image (et là où il n'y a pas d'image). Default en premier, None (transparent) en second, puis les noms de couleurs et Custom |
| **Image Path 1, 2, 3** | **OPEN** choisit une image, ou tapez un chemin dans la case |

## OPEN

**OPEN** à côté d'un Image Path ouvre la fenêtre **Background Image N** :

- **Image Path N** : montrez les **images Skynet**, **mes images** ou les deux, choisissez un **groupe** (Pumps, Valves ...), ou appuyez sur **🖼** pour choisir parmi des icônes.
- **Image** : l'image. **Add new ...** prend un nom d'image dans media/Images.
- **💾 Save** met le chemin dans la case ; **✖ Cancel** ne change rien.

## Taper un chemin {#typing-a-path}

Vous pouvez taper un chemin directement dans la case (par exemple `Images/Skynet/Pumps/Pump_Red_Rip_Off.svg`). Un chemin que le panel ne trouve pas affiche **⚠ Not found: it shows blank** (introuvable : il s'affiche vide), et l'élément ne montre aucune image pour ce numéro.

Les Image Path 1, 2 et 3 sont **.backpath**, **.backpath_2** et **.backpath_3** dans un Process ; Background # 1, 2 ou 3 en choisit un, et 0, vide ou plus de 3 n'en montre aucun. En changer un affiche une fois une remarque : tout Device ou Widget peut avoir autant d'images que vous voulez avec `name.image = "path"` (voir [Picture paths](25-picture-paths)).
