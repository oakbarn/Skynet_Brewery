# File Move (copier des fichiers de votre ordinateur vers le Brain) {#file-move-copy-files-from-your-computer-to-the-brain}

**File Move** copie des fichiers, ou des dossiers entiers, depuis l'ordinateur devant lequel vous êtes (Windows, Mac ou Linux) vers le Brain (le Raspberry Pi). Il n'y a rien à installer : ça marche dans le navigateur que vous utilisez déjà pour ouvrir le panel. Seul un Admin le voit.

Chaque type de fichier a une seule place sur le Brain, pour que rien n'atterrisse au mauvais endroit :

| Type | Va sur le Brain dans | Remarques |
|---|---|---|
| Images (png, jpg, gif, svg, webp, bmp) | `media/Images` | Les dossiers à l'intérieur de celui que vous choisissez sont gardés, donc `Media\Pumps\a.png` devient `Images/Pumps/a.png`. |
| Sons (wav, mp3, ogg, m4a) | `media/sounds` | Toujours directement dans `sounds`, donc un dossier `wave` séparé n'est pas nécessaire. |
| Processes (.txt) | `processes` | Choisissez d'abord **Processes** dans *Put them in*. |
| Pages d'aide (.md) | `help` | Choisissez d'abord **Help pages** dans *Put them in*. |

## Copier des images et des sons depuis un dossier {#copying-pictures-and-sounds-from-a-folder}

1. Ouvrez le panel sur l'ordinateur qui a les images et les sons, connectez-vous en Admin et cliquez sur **File Move**.
2. En haut, il dit combien d'images et de sons utilisés par le Schema chargé ne sont **pas encore sur le Brain** (**Show the list** les montre).
3. Laissez *Put them in* sur **Pictures and sounds (sorted for you)** (images et sons, triés pour vous).
4. Cliquez sur **Pick a folder** et choisissez le dossier qui les contient (ou faites glisser ce dossier depuis l'Explorateur de fichiers sur la case en pointillés). Le navigateur peut demander « Upload all files? » (envoyer tous les fichiers ?) : cliquez sur **Upload**. Rien n'est encore copié.
5. La liste montre chaque fichier, où il va, et ce qui va se passer : **New** (nouveau), **Already on the Brain** (déjà sur le Brain, sauté), ou pourquoi il ne peut pas être copié. Cochez **Only the ones this Schema is missing** pour ne copier que ceux qui manquent à ce Schema.
6. Cliquez sur **Copy ... to the Brain**. Quand c'est fini, le compte des fichiers manquants en haut diminue.

Un fichier déjà sur le Brain n'est jamais remplacé sauf si vous cochez **Replace files already on the Brain**. Une image SVG (.svg) déjà présente n'est jamais remplacée, même dans ce cas : voir [Media (images et sons)](07-media).

## Bon à savoir {#good-to-know}

- Des fichiers jusqu'à 300 Mo chacun.
- Pour une seule image ou un .zip, vous pouvez aussi utiliser l'écran **Media** ([Media (images et sons)](07-media)).
- Copier depuis le Brain vers un ordinateur (une sauvegarde) n'est pas encore sur cette page.
