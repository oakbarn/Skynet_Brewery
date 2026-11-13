# Numéros des images Skynet {#skynet-picture-numbers}

Chaque image livrée avec Skynet a son propre **numéro**. Le numéro ne change jamais et n'est jamais donné à une autre image, même si l'image est renommée (Skynet Rule 7.22).

## Où vous voyez les numéros {#where-you-see-the-numbers}

- **Chaque liste d'images** dans les Properties montre une image Skynet avec son numéro devant le nom du fichier, par exemple **24 · Overlay_Bolt.svg**. Vos propres images ne montrent que le nom du fichier.
- **🖼 Choisir parmi les icônes :** la vignette de chaque image Skynet montre son numéro. Tapez un numéro dans la case de recherche pour trouver cette image.
- **Page Media :** les images dans **Images/Skynet** montrent leur numéro.
- **La liste à imprimer :** page Media > **🔢 Skynet Picture numbers** ouvre toutes les images Skynet avec leur numéro, leur nom de fichier et leur groupe. Choisissez un groupe ou cherchez, puis appuyez sur **🖨 Print**.

## Dans un Process {#in-a-process}

Donnez une image par son numéro ou par son nom de fichier. Ces deux lignes font la même chose :

```
alm_Brew.setgraphic = 24
alm_Brew.setgraphic = "Overlay_Bolt.svg"
```

Un numéro marche partout où va une image : `.image`, `.backpath`, `.backpath_2`, `.backpath_3`, `.imageon`, `.imageoff`, `.imageoverlay`, `.setgraphic` et un gGlobal Graphic. Un numéro qui n'est pas une image Skynet arrête le Process avec un message qui le dit.

## Le côté technique {#the-technical-side}

Les numéros sont gardés dans `lib/skynetpicids.json`, une ligne pour chaque image de `media/Images/Skynet`. Une nouvelle image Skynet prend le numéro suivant. Une image retirée garde sa ligne, marquée retirée, donc son numéro n'est jamais réutilisé. La même liste est sur GitHub : `docs/Skynet_Picture_IDs.md`. Voir aussi [Chemins en deux parties (.path et .file)](194-two-part-paths).
