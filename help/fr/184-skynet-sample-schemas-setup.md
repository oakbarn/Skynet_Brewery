# Le Skynet Sample Schemas Setup {#the-skynet-sample-schemas-setup}

Le panneau vient avec **un** Sample Schema : la brasserie **3 Vessel 1 Pump** (HLT, cuve d'empâtage, cuve d'ébullition et une pompe). Il est tenu à jour de chaque nouvelle Règle Skynet, et c'est le Schema avec lequel démarre un nouveau panneau. Il **reste toujours dans le panneau** : il n'est jamais déplacé dans le Sample Schemas Setup.

Le Sample Schemas Setup ne sert qu'aux exemples **supplémentaires**. Chaque **autre** Sample Schema (une brasserie toute faite) vient dans son propre téléchargement, le **Skynet Sample Schemas Setup**, et ils y sont ajoutés **un à la fois**.

> **Il n'y en a encore aucun.** Les anciens exemples (deux cuves une pompe, et le jour de brassage BrewZilla) sont mis de côté le temps que chacun soit mis aux Règles Skynet actuelles. Quand l'un est prêt, il est ajouté au Sample Schemas Setup.

**Il ne fait qu'ajouter.** Un exemple que vous avez déjà, sous ce nom, n'est jamais changé. Rien n'est jamais supprimé. Vos propres Schemas ne sont jamais touchés. Quand un exemple est refait, il arrive avec un nouveau nom, donc l'ancien reste tel qu'il était.

## Où l'obtenir {#where-to-get-it}

Sur la même page de téléchargement que le panneau : **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| Fichier | Pour |
|---|---|
| `Skynet_Sample_Schemas_Setup_<date>.exe` | Windows |
| `Skynet_Sample_Schemas_<date>.zip` | Mac, Linux, Raspberry Pi, ou Windows à la main |

## Comment l'utiliser {#how-to-use-it}

- **Windows :** installez d'abord le panneau (Skynet Brewer Setup), puis double-cliquez sur `Skynet_Sample_Schemas_Setup_<date>.exe`. Gardez le dossier qu'il montre (`C:\Brewing\BrewPanel`, où est le panneau) et cliquez sur Install.
- **Mac, Linux, Raspberry Pi avec l'installateur :** mettez `Skynet_Sample_Schemas_<date>.zip` à côté de l'installateur avant de le lancer.
- **À la main :** décompressez `Skynet_Sample_Schemas_<date>.zip` dans le dossier qui contient `BrewPanel` (sur Mac, Linux et Pi utilisez `unzip -n`, qui ne remplace jamais un fichier). Il ajoute `BrewPanel/sample_schemas`.

Appuyez ensuite sur **F5** dans le panneau. Les nouveaux exemples sont dans la liste déroulante Schema sous **Add a Sample Schema**, après l'exemple 3 Vessel (voir [Ajouter un Schema exemple](83-sample-schemas)). En choisir un ajoute une **copie** comme nouveau Schema à vous, sur le simulateur, donc rien de réel n'est commandé.

## Un Schema d'un autre brasseur {#a-schema-from-another-brewer}

Le même dossier, `BrewPanel/sample_schemas`, est l'endroit où va une brasserie qu'un autre brasseur partage. Chaque exemple est un dossier en trois parties :

| Partie | Ce que c'est |
|---|---|
| `sample.json` | Son nom, son titre, une courte description, et ce dont il a besoin |
| `config.json` | Ses Tabs, Devices, Widgets, tuyaux et Interfaces |
| `scripts/` | Ses Processes (fichiers `.txt`) |

Mettez le dossier dans `sample_schemas` et appuyez sur **F5**. Il arrive exactement comme un exemple Skynet : comme nouveau Schema, sur le simulateur. Le `ReadMe.txt` de ce dossier dit la même chose.

La plupart du temps, un autre brasseur vous enverra plutôt un seul fichier `.json` (fait avec **Export to share ...**). Mettez-le dans le dossier Import et utilisez **Import a brewer's Schema ...** dans la liste des Schemas (voir [Schema.json (enregistrer un Schema dans un fichier .json)](44-schema-json)).

> **Skynet ne vérifie pas ce qu'il y a dans un Schema partagé.** Les images, les sons, les noms et tout le reste, et tout droit d'auteur dessus, sont l'affaire des brasseurs entre eux.

## Bon à savoir {#good-to-know}

- Mettre à jour le panneau ne touche jamais `sample_schemas`. Vos propres Schemas ne sont jamais touchés non plus.
- Les exemples des anciennes versions du panneau (deux cuves une pompe ; jour de brassage BrewZilla ; OakBarn Brewery) sont déplacés, pas supprimés, dans `backups/old_samples_<date>` à la première mise à jour, donc seul l'exemple 3 Vessel est listé. Un Schema que vous avez déjà fait à partir de l'un d'eux est à vous et reste.
- Désinstaller le panneau en gardant vos données (le Non recommandé) garde aussi `sample_schemas`.
