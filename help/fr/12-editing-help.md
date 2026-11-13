# Modifier ce manuel {#editing-this-manual}

Les Admins peuvent modifier ce manuel ici même, et il est gardé sur le Pi avec tout le reste.

- **Edit page** ouvre la page sous forme de texte avec un aperçu en direct à côté (en dessous sur un téléphone). Appuyez sur **Save page** quand vous avez fini.
- **New page** demande un titre et ajoute la page à la fin de la liste.
- **Delete page** la supprime. Une copie est gardée dans `help/backups` sur le Pi, et une copie de l'ancien texte y est gardée chaque fois qu'une page est enregistrée.

## Comment les pages sont écrites {#how-pages-are-written}

Les pages sont écrites en **Markdown**, du texte simple avec quelques signes :

| Tapez ceci | Pour obtenir |
|---|---|
| `# Title` | Le titre de la page (la première ligne de chaque page) |
| `## Heading` | Un intertitre |
| `**bold**` et `*italic*` | **gras** et *italique* |
| `- item` | Une liste à puces |
| `1. step` | Une liste numérotée |
| Un mot entre accents graves (la touche à gauche du 1 sur un clavier américain) | `code` |
| `> Note` | Une note mise en valeur |
| `[Tailscale](https://tailscale.com)` | Un lien vers un site web |
| `[Scripts](05-scripts)` | Un lien vers une autre page d'aide |
| `![Red pump](Images/Skynet/Pumps/Pump_Red_Rip_On.png)` | Une image d'un dossier media |
| `---` | Une ligne en travers de la page |

Les tableaux sont des lignes de `|` avec une ligne `|---|---|` sous la première ligne, comme celui ci-dessus. Pour une image, ajoutez-la d'abord sur l'écran [Media](07-media), puis utilisez **Copy path**.

## Les fichiers {#the-files}

Chaque page est un fichier texte `.md` dans le dossier `help` du panel sur le Pi. Le nombre au début du nom de fichier fixe l'ordre (`05-scripts.md`). Vous pouvez aussi les modifier avec n'importe quel éditeur de texte ; le panel montre le changement la prochaine fois que la page est ouverte. Les pages françaises sont dans `help/fr`, avec les mêmes noms de fichier (voir [Help in French](192-help-in-french)).
