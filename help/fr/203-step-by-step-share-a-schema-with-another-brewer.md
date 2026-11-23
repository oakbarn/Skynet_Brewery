# Pas à pas : partager un Schema avec un autre brasseur {#step-by-step-share-a-schema-with-another-brewer}

Un Schema peut être envoyé à un autre brasseur, qui l'ajoute à son propre Skynet. **Skynet n'envoie aucun fichier pour vous :** les images et les sons peuvent contenir des éléments protégés par le droit d'auteur, donc ce que vous envoyez, et tout droit d'auteur dessus, regarde les brasseurs.

> **⚠ Les deux brasseurs devraient avoir la dernière version de Skynet.** Des choses sont ajoutées à Skynet tout le temps, et un Skynet plus ancien peut ne pas connaître quelque chose d'un fichier de Schema plus récent.

## Étape 1. Connaître les genres de fichiers {#step-1-know-the-kinds-of-files}

| Fichier | Ce que c'est | D'où il vient |
|---|---|---|
| **Le fichier du Schema** (.json) | Les Tabs, cartes, Devices, Widgets, tuyaux et dessins des Equipment Profiles. Pas de connexions, mots de passe ni réglages du panel. | **📤 Export to share** |
| **Vos propres images et sons** (.png, .jpg, .svg, .wav, .mp3 ...) | Le fichier du Schema ne fait que les nommer. Les images et sons de Skynet viennent avec chaque Skynet, donc ils ne sont jamais envoyés. | La liste sous **Share with other brewers** |
| **Processes** (.txt) | Ils sont gardés dans le dossier `processes`, pas dans le fichier du Schema. | Le dossier `processes` du dossier du panel (par exemple `C:\Brewing\BrewPanel\processes`) |

## Étape 2. Enregistrer le fichier du Schema {#step-2-save-the-schema-file}

Appuyez sur **☰ Menu > Schema**, puis sur **📤 Export to share** sous **Share with other brewers**. Choisissez le Schema et appuyez sur **Save**. Le fichier va dans le dossier **Downloads** (Téléchargements) de cet ordinateur. Plus : [Schema.json](44-schema-json).

## Étape 3. Enregistrer vos propres images et sons {#step-3-save-your-own-pictures-and-sounds}

Sous **Share with other brewers**, Skynet liste les images et sons à vous que le Schema chargé utilise (ceux de Skynet sont laissés de côté). **Cliquez sur chacun** pour l'enregistrer sur cet ordinateur, dans Downloads. N'envoyez que ceux que vous avez le droit de partager.

## Étape 4. Envoyer les fichiers {#step-4-send-the-files}

Mettez les fichiers dans un même dossier, et envoyez-les comme vous voulez : un e-mail avec les fichiers joints, une clé USB, ou un dossier partagé (OneDrive, Google Drive, Dropbox ...). Pour beaucoup de fichiers, un .zip du dossier est le plus simple (dans Windows : clic droit sur le dossier > **Envoyer vers > Dossier compressé**).

## Étape 5. L'autre brasseur les ajoute {#step-5-the-other-brewer-adds-them}

1. **Les images et les sons d'abord** : sur le Brain, **File Move** (tout un dossier, voir [File Move](32-file-move)) ou l'écran **Media** (un .zip est décompressé avec ses dossiers, voir [Media](07-media)).
2. **Les Processes** : **File Move**, avec **Processes** dans *Put them in*.
3. **Le fichier du Schema** : mettez-le dans le **dossier Import** (`C:\Brewing\Import`), puis **☰ Menu > Schema > 📥 Import a brewer's Schema**. Il arrive toujours comme un nouveau Schema : aucun des leurs n'est écrasé.

Une image ou un son qui n'est pas venu s'affiche comme manquant jusqu'à ce qu'il soit ajouté.
