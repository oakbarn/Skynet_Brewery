# Les Sample Schemas Skynet {#the-skynet-sample-schemas}

Le panneau vient avec la brasserie **3 Vessel 1 Pump** (HLT, cuve d'empâtage, cuve d'ébullition et une pompe). Il est tenu à jour de chaque nouvelle Règle Skynet, et c'est le Schema avec lequel démarre un nouveau panneau. Il **reste toujours dans le panneau**.

Chaque **autre** Sample Schema (une brasserie toute faite) est ajouté **un à la fois**, et vient avec les Setups Skynet. **Il n'y a rien de plus à télécharger ni à lancer** (OakBarn Brewery : « No extra steps for a User ») :

- **Nouveau sur cet ordinateur Windows :** le **Full Setup** (`Skynet_Brewer_Full_Setup_<date>.exe`) a tous les Sample Schemas.
- **À chaque mise à jour :** l'**Update Setup** (`Skynet_Brewer_Update_<date>.exe`) apporte les Sample Schemas ajoutés ou changés depuis le dernier Update Setup.
- **Mac, Linux, Raspberry Pi ou à la main :** décompressez `Skynet_Sample_Schemas_<date>.zip` dans le dossier qui contient `BrewPanel` (utilisez `unzip -n`, qui ne remplace jamais un fichier), ou mettez-le à côté de l'installateur avant de le lancer. Il ajoute `BrewPanel/sample_schemas`.

> **Il n'y en a encore aucun.** Les anciens exemples (deux cuves une pompe, et le jour de brassage BrewZilla) sont mis de côté le temps que chacun soit mis aux Règles Skynet actuelles. Le **Skynet Sample Schemas Setup** .exe à part n'existe plus : l'Update Setup et le Full Setup font son travail.

**Vos propres Schemas ne sont jamais touchés.** Un Sample Schema ne sert qu'à faire un nouveau Schema : le choisir ajoute une copie qui est à vous. Donc quand Skynet corrige un exemple, la mise à jour remplace l'ancienne copie de cet exemple, et un Schema que vous en avez déjà fait reste exactement tel qu'il est. Il en va de même pour les Templates Skynet : chaque mise à jour apporte les plus récents, et vos propres Templates ne sont jamais touchés.

Puis appuyez sur **F5** dans le panneau. Les nouveaux exemples sont dans la liste des Schemas sous **Add a Sample Schema**, après l'exemple 3 Vessel (voir [Ajouter un Sample Schema](83-sample-schemas)). En choisir un ajoute une **copie** comme nouveau Schema à vous, sur le simulateur, donc rien de réel n'est commuté.

## Un Schema d'un autre brasseur {#a-schema-from-another-brewer}

Le même dossier, `BrewPanel/sample_schemas`, est l'endroit où va une brasserie qu'un autre brasseur partage. Chaque exemple est un dossier en trois parties :

| Partie | Ce que c'est |
|---|---|
| `sample.json` | Son nom, son titre, une courte description, et ce dont il a besoin |
| `config.json` | Ses Tabs, Devices, Widgets, tuyaux et Interfaces |
| `processes/` | Ses Processes (fichiers `.txt`) |

Mettez le dossier dans `sample_schemas` et appuyez sur **F5**. Il arrive exactement comme un exemple Skynet : comme nouveau Schema, sur le simulateur. Le `ReadMe.txt` de ce dossier dit la même chose.

La plupart du temps, un autre brasseur vous enverra plutôt un seul fichier `.json` (fait avec **Export to share ...**). Mettez-le dans le dossier Import et utilisez **Import a brewer's Schema ...** dans la liste des Schemas (voir [Schema.json (enregistrer un Schema dans un fichier .json)](44-schema-json)).

> **Skynet ne vérifie pas ce qu'il y a dans un Schema partagé.** Les images, les sons, les noms et tout le reste, et tout droit d'auteur dessus, sont l'affaire des brasseurs entre eux.

## Bon à savoir {#good-to-know}

- Mettre à jour le panneau ajoute les nouveaux exemples Skynet dans `sample_schemas` et remplace un exemple Skynet qui a été corrigé. Vos propres Schemas ne sont jamais touchés.
- Les exemples des anciennes versions du panneau (deux cuves une pompe ; jour de brassage BrewZilla ; OakBarn Brewery) sont déplacés, pas supprimés, dans `backups/old_samples_<date>` à la première mise à jour, donc seul l'exemple 3 Vessel est listé. Un Schema que vous avez déjà fait à partir de l'un d'eux est à vous et reste.
- Désinstaller le panneau supprime `sample_schemas` avec tout le reste. Le Full Setup remet tous les exemples Skynet lors d'une nouvelle installation.
