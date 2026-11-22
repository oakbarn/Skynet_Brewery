# Les images et sons Skynet {#the-skynet-pictures-and-sounds}

Les images et sons Skynet (pompes, vannes, cuves, sons d'alarme ...) viennent avec les Setups Skynet. **Il n'y a rien de plus à télécharger ni à lancer** (OakBarn Brewery : « No extra steps for a User »).

- **Nouveau sur cet ordinateur Windows :** le **Full Setup** (`Skynet_Brewer_Full_Setup_<date>.exe`) a toutes les images et tous les sons Skynet, et tous les Sample Schemas.
- **À chaque mise à jour :** l'**Update Setup** (`Skynet_Brewer_Update_<date>.exe`) et le zip du panel portent chaque image et son Skynet ajoutés depuis le dernier Update Setup. Le Brain ajoute ceux qu'il n'a pas encore à son prochain démarrage.

Trois sons viennent toujours avec le panneau lui-même, pour qu'une alarme ou un Audio Widget puisse toujours sonner : le bip d'alarme, la voix « Alarm sound missing » et la chanson « Find The File ».

**Il ne fait qu'ajouter.** Une image ou un son que vous avez déjà, sous ce nom, n'est jamais changé. Vos propres images et sons ne sont jamais touchés.

> Le **Skynet Media Setup** .exe à part n'existe plus : l'Update Setup et le Full Setup font son travail.

## Où l'obtenir {#where-to-get-it}

Sur la même page de téléchargement que le panneau : **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| Fichier | Pour |
|---|---|
| `Skynet_Brewer_Full_Setup_<date>.exe` | Windows, nouvel ordinateur : le panneau **et** toutes les images, sons et Sample Schemas dans un seul fichier |
| `Skynet_Brewer_Update_<date>.exe` | Windows, mises à jour : apporte les nouvelles images, sons et Sample Schemas |
| `Skynet_Media_<date>.zip` | Mac, Linux, Raspberry Pi, ou à la main : toutes les images et tous les sons Skynet |

Le zip Media n'est refait que quand Skynet ajoute des images ou des sons. En attendant, chaque nouvelle Release porte le même, donc la date dans son nom peut être plus ancienne que celle du panneau. C'est normal.

## Le Full Setup : tout dans un seul fichier (Windows) {#the-full-setup-everything-in-one-file-windows}

Nouveau sur cet ordinateur ? Téléchargez **`Skynet_Brewer_Full_Setup_<date>.exe`**. C'est le même Skynet Brewer Setup, avec toutes les images, tous les sons et tous les Sample Schemas Skynet dedans.

- C'est toujours une installation complète, et il **écrase tout** : chaque Schema, réglage, utilisateur, Process, le journal de brassage, chaque image et son, et le dossier Import. Il remet ensuite tout seul les images et sons Skynet.
- Si Skynet est déjà installé, il montre **un seul avertissement** : c'est l'installation Full et elle va TOUT ÉCRASER. Sur cette page :
  - **Get the Update Setup** ouvre la page de téléchargement et ferme le Full Setup. Prenez l'Update Setup (`Skynet_Brewer_Update_<date>.exe`) quand vous voulez seulement une mise à jour : il garde tout.
  - **Close and Do Not Install** le ferme, et rien n'est changé.
  - **1. Install with no backup** (installer sans sauvegarde) est déjà choisi. Il écrase tout et vos anciens dossiers sont **supprimés pour de bon**. Impossible de les récupérer.
  - **2. Install and back up my old folders first** (installer et sauvegarder d'abord mes anciens dossiers) : avant d'écraser, vos anciens dossiers (config, data, processes, media, backups et le dossier Import) sont **déplacés, pas supprimés**, dans `C:\Brewing\Skynet_Backups\Before_Full_Setup_<date>`.
  - Cliquez ensuite sur **Install**.
- Il est plus gros (environ 12 Mo au lieu d'environ 5 Mo). Pour une mise à jour rapide plus tard, prenez le Skynet Brewer Setup simple : vos images et sons restent en place.
- La désinstallation est la même, quel que soit le Setup utilisé.

## Mac, Linux, Raspberry Pi ou à la main {#mac-linux-raspberry-pi-or-by-hand}

- **Avec l'installateur :** mettez `Skynet_Media_<date>.zip` à côté de l'installateur avant de le lancer. L'installateur ajoute les images et sons que vous n'avez pas encore.
- **À la main :** décompressez `Skynet_Media_<date>.zip` dans le dossier qui contient `BrewPanel` (utilisez `unzip -n`, qui ne remplace jamais un fichier). Il ajoute `BrewPanel/defaults/media`. Au prochain démarrage, le panneau copie seulement les images et sons que vous n'avez pas encore.

## Bon à savoir {#good-to-know}

- Quand un dessin Skynet est refait, il arrive comme une **nouvelle image avec un nouveau nom**. L'ancienne reste, donc chaque Schema qui l'utilise a le même aspect qu'avant.
- Un Brain sur internet peut aussi obtenir les nouvelles images une à une avec **☰ Menu > Get Skynet pictures** (voir [Obtenir les images Skynet](59-get-skynet-pictures)).
- Skynet ne livre que des images et des sons qu'il est libre de partager : les siens (sous la licence MIT), ceux du domaine public (CC0 compris), ou ceux sous la licence CC BY ou CC BY-SA, avec leur crédit dans les Media credits du README. Rien sous une licence non commerciale (NC) ou sans modification (ND).
