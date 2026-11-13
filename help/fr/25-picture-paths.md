# Images de fond (.backpath, .backpath_2, .backpath_3) {#background-pictures-backpath-backpath-2-backpath-3}

Chaque élément d'un Tab (un Device ou un Widget) peut montrer une image de fond. Il a trois chemins d'image de fond, et **.background** choisit celle qui s'affiche :

| Attribut | Dans les Properties | Ce qu'il contient |
|---|---|---|
| **.backpath** | Image Path 1 | L'image de fond 1. `.background = 1` la montre. |
| **.backpath_2** | Image Path 2 | L'image de fond 2. `.background = 2` la montre. |
| **.backpath_3** | Image Path 3 | L'image de fond 3. `.background = 3` la montre. |
| **.background** | Background # | Laquelle s'affiche. |

## Ce que fait .background {#what-background-does}

| .background | Ce qui s'affiche |
|---|---|
| **1** | .backpath |
| **2** | .backpath_2 |
| **3** | .backpath_3 |
| **0** | Pas de fond |
| **4 ou plus** | Pas de fond |
| **vide** | Il est mis à **0** : pas de fond |

Double-cliquez sur un élément dans **Edit layout** (ou gardez le doigt dessus) pour voir ces champs. Un chemin d'image est un fichier dans l'un de vos dossiers media, par exemple `Images/Skynet/Pumps/Pump_Red_Rip_On.svg` (voir [Media (images et sons)](07-media)).

## Dans un Process {#in-a-process}

```
my_Widget.backpath = "Images/Skynet/Pumps/Pump_Red_Rip_On.svg"
my_Widget.backpath_2 = "Images/Skynet/Pumps/Pump_Blue_Rip_On.svg"
my_Widget.backpath_3 = "Images/Skynet/Pumps/Pump_Green_Rip_On.svg"
my_Widget.background = 2
```

Régler un chemin ne change pas **.background** ; la dernière ligne choisit l'image qui s'affiche.

**Le raccourci Skynet :** `my_Widget.image = "Images/RedPump.svg"` met le chemin dans **.backpath** et règle **.background = 1**, donc la nouvelle image s'affiche tout de suite. De cette façon, n'importe quel Device ou Widget peut avoir autant d'images que vous voulez.

Un nom ou un code de couleur dans **.background** (`my_Widget.background = "red"`) ne montre aucune image ; il colore l'élément. **Back Colour** dans les Properties est la couleur derrière l'image.

## Les anciens noms ont disparu {#the-old-names-are-gone}

**.imagePath_1**, **.imagePath_2** et **.imagePath_3** sont maintenant **.backpath**, **.backpath_2** et **.backpath_3** (Règle Skynet 15.2 : rien d'ancien n'est gardé). Quand le panel démarre, chaque Schema et chaque Process passe tout seul aux nouveaux noms, et un Process est d'abord sauvegardé. Un élément plus ancien qui avait une image et un fond vide reçoit **.background = 1**, donc il montre toujours son image.

La première fois que vous changez Image Path 2 ou 3 dans les Properties, un **avertissement** s'affiche : dans Skynet, un seul chemin d'image suffit, car `.image` peut donner à n'importe quel Device ou Widget autant d'images que vous voulez. Cochez **Do not show this again** pour ne plus le voir.

> Chaque élément a **au plus 3** images de fond. Un élément plus ancien qui avait une 4e image ou plus ne garde que les 3 premières ; `.background = 4` ou plus ne montre aucun fond.
