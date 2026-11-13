# Media (images et sons) {#media-pictures-and-sounds}

Les images et les sons sont dans des **dossiers media** sur le Pi. Partout dans le panel, une image ou un son est donné par son **chemin** dans un dossier media, par exemple `Images/Skynet/Pumps/Pump_Red_Rip_On.png`. Les dossiers media sont listés dans **Settings > Panel settings**.

**Chaque image est dans `media/Images`**, rangée en **groupes d'images** (un dossier pour Pumps, Valves, Vessels ...), les images Skynet étant gardées à part dans `Images/Skynet` (voir [Groupes d'images](57-picture-groups)), les fonds aussi. Les listes d'images des fenêtres de propriétés ne montrent que les images de là. **Chaque son est dans `media/sounds`.** Les anciens chemins marchent toujours : `oakbarn/...` (l'ancien nom d'Images), un simple nom d'image comme `brewery_main.png`, les dessins d'exemple `samples/...`, et les sons gardés en `Images/wave/...`.

Dans une vraie brasserie, tout cela est sur le Brain (le Pi), dans le dossier du panel : `media/Images` et `media/sounds`. Les téléphones et les PC ne gardent jamais les images ; ils les reçoivent du Brain. Pour copier des images d'un PC vers le Brain, utilisez **File Move** (des dossiers entiers d'un coup) ou cet écran Media.

## L'écran Media {#the-media-screen}

Il ressemble à l'Explorateur de fichiers de Windows : les dossiers à gauche, les fichiers à droite.

- **Add pictures / sounds** : choisissez des fichiers, ou faites-les glisser sur la page. Un `.zip` est décompressé avec ses dossiers, ce qui est pratique pour tout un dossier d'images.
- **New folder**, **Up**, et la vue **Large icons** ou **Details**.
- Faites glisser un fichier sur un dossier à gauche pour le déplacer (sur un téléphone, utilisez **Move**).
- Choisissez plusieurs fichiers avec **Ctrl+clic** ou **Maj+clic** (sur un téléphone, cochez **Select many**), puis faites-les glisser ou appuyez sur **Move picked** ou **Delete picked**.
- **Images/Skynet** contient les images livrées avec Skynet et est en **lecture seule** : rien ne peut y être ajouté, renommé, déplacé ni supprimé. Les groupes d'images standard 🔒 d'Images (pour vos images), et les dossiers Images et sounds eux-mêmes, ne peuvent être ni supprimés, ni renommés, ni déplacés.
- Cliquez sur un fichier pour le prévisualiser, le jouer, **copier son chemin**, le renommer ou le supprimer.
- **Les images SVG (.svg) ne peuvent être ni supprimées, ni renommées, ni déplacées, ni remplacées**, même une que vous avez ajoutée vous-même. Les Templates Skynet et le panel sont dessinés avec elles, et une image manquante casserait chaque Tab qui l'utilise. Un dossier qui contient un SVG ne peut pas non plus être renommé ni déplacé. Pour changer un SVG, ajoutez-en un nouveau sous un nom à lui et choisissez plutôt celui-là.

Images : png, jpg, gif, svg, webp, bmp. Sons : wav, mp3, ogg, m4a.

## Des images SVG nettes {#sharp-svg-pictures}

Chaque PNG ou JPG reçoit une copie SVG à côté de lui, pour rester net à toutes les tailles. Une image gardée dans un autre dossier (par exemple `D:\Pictures`, ajouté dans **Settings > Media folders**) reçoit plutôt sa copie chez le Brain, dans le dossier caché `media\.svg`, pour que rien ne soit écrit dans ce dossier-là. L'original n'est jamais modifié (d'autres programmes peuvent toujours l'utiliser), et vous continuez à taper le chemin `.png`. **Settings > Pictures** montre chaque original à côté de son SVG et vous laisse choisir lequel est utilisé. Les images qui ressemblent à des photos rendent mieux en original.
