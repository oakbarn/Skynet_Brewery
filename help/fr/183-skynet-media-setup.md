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

## Comment l'utiliser {#how-to-use-it}

- **Windows :** installez d'abord le panneau (Skynet Brewer Setup), puis double-cliquez sur `Skynet_Media_Setup_<date>.exe`. Gardez le dossier qu'il montre (`C:\Brewing\BrewPanel`, où est le panneau) et cliquez sur Install. Si le panneau tourne, appuyez sur F5 dans sa fenêtre pour voir les nouvelles images.
- **Mac, Linux, Raspberry Pi avec l'installateur :** mettez `Skynet_Media_<date>.zip` à côté de l'installateur avant de le lancer. L'installateur ajoute les images et sons que vous n'avez pas encore.
- **À la main :** décompressez `Skynet_Media_<date>.zip` dans le dossier qui contient `BrewPanel` (sur Mac, Linux et Pi utilisez `unzip -n`, qui ne remplace jamais un fichier). Il ajoute `BrewPanel/defaults/media`. Au prochain démarrage, le panneau copie seulement les images et sons que vous n'avez pas encore.

Relancez-le chaque fois que de nouvelles images Skynet sortent. On peut le lancer aussi souvent qu'on veut sans risque.

## Bon à savoir {#good-to-know}

- Quand un dessin Skynet est refait, il arrive comme une **nouvelle image avec un nouveau nom**. L'ancienne reste, donc chaque Schema qui l'utilise a le même aspect qu'avant.
- Un Brain sur internet peut aussi obtenir les nouvelles images une à une avec **☰ Menu > Get Skynet pictures** (voir [Obtenir les images Skynet](59-get-skynet-pictures)).
- Skynet ne livre que des images et des sons qu'il est libre de partager : ses propres dessins, ou ceux du domaine public ou sous une licence libre comme CC0, avec le crédit gardé là où la licence le demande.
