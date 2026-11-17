# Le Skynet Media Setup {#the-skynet-media-setup}

Les images et sons Skynet (pompes, vannes, cuves, sons d'alarme ...) ne sont **pas** dans l'installateur ou le zip du panneau. Ils viennent dans leur propre téléchargement, pour que le panneau reste petit, et que de nouvelles images puissent être ajoutées sans nouvelle version du panneau.

Trois sons viennent aussi avec le panneau lui-même, pour qu'une alarme ou un Sound Player puisse toujours sonner : le bip d'alarme, la voix « Alarm sound missing » et la chanson « Find The File ».

**Il ne fait qu'ajouter.** Une image ou un son que vous avez déjà, sous ce nom, n'est jamais changé. Rien n'est jamais supprimé. Vos propres images et sons ne sont jamais touchés.

## Où l'obtenir {#where-to-get-it}

Sur la même page de téléchargement que le panneau : **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| Fichier | Pour |
|---|---|
| `Skynet_Media_Setup_<date>.exe` | Windows |
| `Skynet_Media_<date>.zip` | Mac, Linux, Raspberry Pi, ou Windows à la main |
| `Skynet_Brewer_Full_Setup_<date>.exe` | Windows : le panneau **et** les images et sons dans un seul fichier |

Le Media Setup et le zip ne sont refaits que quand Skynet ajoute des images ou des sons. En attendant, chaque nouvelle Release porte les mêmes, donc la date dans leur nom peut être plus ancienne que celle du panneau. C'est normal : ce sont toujours les images et les sons les plus récents.

## Le Full Setup : tout dans un seul fichier (Windows) {#the-full-setup-everything-in-one-file-windows}

Nouveau sur cet ordinateur ? Téléchargez **`Skynet_Brewer_Full_Setup_<date>.exe`** au lieu des deux Setups séparés. C'est le même Skynet Brewer Setup, avec toutes les images et tous les sons Skynet dedans : pas besoin du Media Setup.

- Il ajoute les images et les sons comme le Media Setup : une image ou un son que vous avez déjà n'est jamais changé, et rien n'est supprimé.
- Il n'a **aucun choix**. C'est toujours une installation complète, et il **écrase tout** : chaque Schema, réglage, utilisateur, Process, le journal de brassage, chaque image et son, et le dossier Import. Il remet ensuite tout seul les images et sons Skynet.
- Si Skynet est déjà installé, il montre **un seul avertissement** : c'est l'installation Full et elle va TOUT ÉCRASER. Sur cette page :
  - **Get the Update Setup** ouvre la page de téléchargement et ferme le Full Setup. Prenez l'Update Setup (`Skynet_Brewer_Setup_<date>.exe`) quand vous voulez seulement une mise à jour : il garde tout.
  - **Close and Do Not Install** le ferme, et rien n'est changé.
  - **Install** écrase tout.
- Avant d'écraser, vos anciens dossiers (config, data, processes, media, backups et le dossier Import) sont **déplacés, pas supprimés**, dans `C:\Brewing\Skynet_Backups\Before_Full_Setup_<date>`.
- Il est plus gros (environ 12 Mo au lieu d'environ 5 Mo). Pour une mise à jour rapide plus tard, prenez le Skynet Brewer Setup simple : vos images et sons restent en place.
- La désinstallation est la même, quel que soit le Setup utilisé.

## Comment l'utiliser {#how-to-use-it}

- **Windows :** installez d'abord le panneau (Skynet Brewer Setup), puis double-cliquez sur `Skynet_Media_Setup_<date>.exe`. Gardez le dossier qu'il montre (`C:\Brewing\BrewPanel`, où est le panneau) et cliquez sur Install. Si le panneau tourne, appuyez sur F5 dans sa fenêtre pour voir les nouvelles images.
- **Mac, Linux, Raspberry Pi avec l'installateur :** mettez `Skynet_Media_<date>.zip` à côté de l'installateur avant de le lancer. L'installateur ajoute les images et sons que vous n'avez pas encore.
- **À la main :** décompressez `Skynet_Media_<date>.zip` dans le dossier qui contient `BrewPanel` (sur Mac, Linux et Pi utilisez `unzip -n`, qui ne remplace jamais un fichier). Il ajoute `BrewPanel/defaults/media`. Au prochain démarrage, le panneau copie seulement les images et sons que vous n'avez pas encore.

Relancez-le chaque fois que de nouvelles images Skynet sortent. On peut le lancer aussi souvent qu'on veut sans risque.

## Bon à savoir {#good-to-know}

- Quand un dessin Skynet est refait, il arrive comme une **nouvelle image avec un nouveau nom**. L'ancienne reste, donc chaque Schema qui l'utilise a le même aspect qu'avant.
- Un Brain sur internet peut aussi obtenir les nouvelles images une à une avec **☰ Menu > Get Skynet pictures** (voir [Obtenir les images Skynet](59-get-skynet-pictures)).
- Skynet ne livre que des images et des sons qu'il est libre de partager : ses propres dessins, ou ceux du domaine public ou sous une licence libre comme CC0, avec le crédit gardé là où la licence le demande.
