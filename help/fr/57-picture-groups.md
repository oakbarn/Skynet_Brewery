# Groupes d'images {#picture-groups}

Les images de `media/Images` sont rangées en **groupes** : un dossier pour chaque sorte d'image, pour qu'une liste d'images ne soit jamais trop longue pour trouver ce que vous voulez. Les images fournies avec Skynet sont gardées à part des vôtres.

| Où | Ce qu'il y a dedans |
|---|---|
| `media/Images/Skynet/<group>` | Les **images Skynet**. En lecture seule. |
| `media/Images/<group>` | **Vos images**. Ajoutez-les, renommez-les, déplacez-les et supprimez-les comme vous voulez. |

## Les onze groupes {#the-eleven-groups}

Les deux endroits ont les mêmes onze groupes. Ils sont créés à chaque démarrage.

| Groupe | Dossier | Par exemple |
|---|---|---|
| Alarms | `Alarms` | Cloches d'alarme et panneaux d'avertissement |
| Vessels | `Vessels` | Bouilloires, HLT, cuve d'empâtage, fermenteurs |
| Pumps | `Pumps` | Pompes en marche et à l'arrêt |
| Valves | `Valves` | Vannes à bille, papillon, électrovannes et vannes manuelles |
| Chillers | `Chillers` | Refroidisseurs à plaques, à contre-courant et à immersion |
| Motors | `Motors` | Agitateurs, moteurs pas à pas, vis sans fin |
| Lights / LEDs | `Lights_LEDs` | LED, lampes, voyants |
| Hop Infusion | `Hop_Infusion` | Distributeurs de houblon, hop rockets, filtres à houblon |
| Other Equipment | `Other_Equipment` | Brûleurs, résistances, raccords, tubes RIMS |
| Miscellaneous | `Miscellaneous` | Fonds et tout le reste |
| On Off | `On_Off` | Superpositions On : des images transparentes dessinées par-dessus un élément quand il est On (voir On overlay) |

Les noms de dossiers ont `_` à la place des espaces, donc un Process peut utiliser un chemin tel quel, par exemple `my_pump.image = "Images/Skynet/Pumps/Pump_Red_Rip_On.png"` ou `my_pump.image = "Images/Pumps/MyPump.png"`.

## Les images Skynet sont en lecture seule {#the-skynet-pictures-are-read-only}

Rien dans `Images/Skynet` ne peut être ajouté, changé, renommé, déplacé ou supprimé depuis le panel, par personne. Sur l'écran Media, cela montre un 🔒 et une note jaune ; vous pouvez quand même regarder chaque image et faire **Copy path** (copier le chemin). Les nouvelles images Skynet viennent avec une mise à jour de Skynet, ou avec **☰ Menu > Get Skynet pictures** (voir [Obtenir les images Skynet](59-get-skynet-pictures)).

Pour changer une image Skynet, copiez-la sur votre ordinateur, changez-la, et ajoutez-la sous un nom à elle dans un de vos groupes.

## Vos propres groupes {#your-own-groups}

Les onze dossiers standard pour vos images ne peuvent être ni supprimés, ni renommés, ni déplacés (ils montrent un 🔒), mais les images qu'ils contiennent, si. Tout autre dossier que vous créez dans `media/Images` est un groupe à vous : sur l'écran **Media**, ouvrez **Images** et appuyez sur **New picture group** (le bouton s'appelle **New folder** partout ailleurs). Vos propres groupes peuvent être renommés, déplacés et supprimés comme n'importe quel dossier (videz-le d'abord pour le supprimer).

## Où sont passées les images Skynet {#where-the-skynet-pictures-went}

Les images Skynet étaient en vrac dans `Images` et `Images/samples`. Au premier démarrage de cette version, elles sont déplacées dans `Images/Skynet/<group>` ; par exemple `Images/samples/kettle.svg` est maintenant `Images/Skynet/Vessels/kettle.svg`. Rien de ce que vous avez réglé ne casse : **un ancien chemin trouve toujours l'image**, dans un Schema, un Template ou un Process. Une image que vous avez changée vous-même n'est jamais jetée ; si votre copie et celle de Skynet diffèrent, les deux sont gardées.

C'est pareil pour vos propres images : déplacez `Images/MyPump.png` dans `Images/Pumps` et tout ce qui dit encore `Images/MyPump.png` continue de l'afficher. (Deux images du même nom dans deux groupes : le premier groupe de la liste l'emporte, donnez-leur donc des noms différents.)

## Ranger vos images dans un groupe {#moving-your-pictures-into-a-group}

Sur l'écran **Media** (il marche comme l'Explorateur de fichiers de Windows, sur un PC, un Mac, Linux, un Pi ou un téléphone, car il tourne dans le navigateur) :

1. Ouvrez **Images**.
2. Choisissez les images : cliquez sur une, **Ctrl+clic** (Cmd+clic sur un Mac) pour en ajouter, **Maj+clic** pour en prendre une suite. Sur un téléphone, cochez **Select many** et touchez chacune.
3. Faites-les glisser sur un groupe à gauche, ou appuyez sur **Move picked** et choisissez le groupe.

**Delete picked** les supprime toutes (il demande d'abord). Les images SVG (`.svg`) ne peuvent toujours pas être supprimées, renommées ou déplacées depuis le panel (voir [Media (images et sons)](07-media)).

Pour copier tout un dossier d'images de votre ordinateur dans un groupe, utilisez **File Move** et choisissez le groupe dans **Picture group**.

## Choisir une image : Skynet, Mine ou Both, et un groupe {#picking-a-picture-skynet-mine-or-both-and-a-group}

Chaque liste d'images dans une fenêtre Properties (Picture when on / off, Graphic, Background picture, Image Path 1 ...) a deux petites listes à côté :

- **Skynet pictures**, **My pictures** ou **Both** (les deux). Elle commence à Skynet pictures, car la plupart des brasseurs n'utilisent que celles-là.
- Un **groupe** : **All groups** (tous), ou un seul groupe.

Les deux sont retenues sur cet ordinateur ou ce téléphone. L'image déjà choisie est toujours dans la liste. Appuyez sur le bouton **🖼** à côté de la liste pour choisir parmi des **icônes**, comme l'affichage Grandes icônes de l'Explorateur Windows : cliquez sur une image et appuyez sur **Use this one**, ou double-cliquez dessus. Les listes de sons n'ont que la liste des groupes (les dossiers de `media/sounds`). **Add new ...** accepte toujours n'importe quel chemin, par exemple `Valves/MyValve_On.png`.

## Dans l'éditeur de Process : Alt+P {#in-the-process-editor-alt-p}

En écrivant un Process, appuyez sur **Alt+P** (Option+P sur un Mac), ou sur le bouton **Picture** au-dessus de l'éditeur. Une liste d'images s'ouvre :

- Choisissez **Pictures** ou **Sounds**, **Skynet / My pictures / Both**, un groupe (ou **All groups**), et tapez dans **Search** pour réduire la liste.
- Les images s'affichent en **icônes**, comme dans l'Explorateur Windows. Cliquez sur une, ou déplacez-vous avec les flèches ; son chemin s'affiche en dessous (un son peut être joué).
- **Double-cliquez** ou appuyez sur **Entrée** pour mettre le chemin là où est le curseur, entre guillemets : `"Images/Skynet/Pumps/Pump_Red_Rip_On.png"`. Si vous avez déjà tapé le `"` d'ouverture, seul le chemin (et le `"` de fermeture) est ajouté.
