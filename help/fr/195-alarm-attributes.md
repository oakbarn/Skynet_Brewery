# Les attributs d'une Alarm {#the-alarm-attributes}

Ce qu'un Process peut utiliser sur un **Alarm Widget** (une Basic Skynet Alarm, une User Alarm ou une Pre-Hop Alarm). Écrivez le Name
de l'Alarm, un point, puis l'attribut : `alm_Hops.loop = true`. Le Name de l'Alarm tout seul veut dire son On / Off.

## Communs à toutes les Alarms {#common-to-every-alarm}

| Attribut | Ce qu'il fait |
|---|---|
| `.state` | Son On / Off. `alm_Hops = On` et `alm_Hops.state = On` sont la même chose. |
| `.path` | Son fichier son (.wav ou .mp3 ; le .mp3 est préféré). Un mauvais chemin ne joue pas son propre son (le Missing Alarm Sound joue à la place). Le son ne joue que pendant que l'Alarm est On. |
| `.loop` | true : le son joue, puis recommence. false : il joue une seule fois. |
| `.label_fore`, `.label_back` | Les couleurs de son Label. |
| `.x`, `.y` | Sa place sur le Tab. |
| `.w`, `.h` | Sa taille (largeur et hauteur). |
| `.skynet_Layer_2` | Son image de Layer 2, au-dessus de son image de base et sous la Layer 1 (l'Active overlay) : `alm_Hops.skynet_Layer_2 = "Images/Skynet/Alarms/Alarm_Set_Hop.svg"`. Par son numéro de Skynet Picture aussi : `alm_Hops.skynet_Layer_2 = 6` (6 est le cône de houblon, Alarm_Set_Hop.svg). Aussi choisie dans sa fenêtre Properties (Set Graphic). |
| `.priority` | Quelle Alarm joue en premier quand deux sonnent en même temps (voir [Alarmes et son](21-alarms-and-sound)). |

Deux autres sont réglés par le panel lui-même, jamais par vous :

- **Visible** : une Alarm **se montre pendant qu'elle est On et se cache pendant qu'elle est Off**. Un Process peut lire
  `alm_Hops.visible`, mais pas le régler. En Edit layout une Alarm cachée se montre pâle, pour que vous puissiez quand même la placer.
- **Toggle** : un **clic sur l'Alarm** la met Off (ou On), ce qui change `.state`.

## Brew Flow et Hop Drop Alarms {#brew-flow-and-hop-drop-alarms}

Une Basic Skynet Alarm (la cloche Skynet). `.fore` et `.back` colorent la cloche et le carré derrière elle.

**Une Brew Flow Alarm retient son Process.** Quand un Process la met On, le Process attend sur cette ligne jusqu'à ce que le
brasseur mette l'Alarm Off d'un toucher (ou qu'un autre Process la mette Off), comme si un `wait alm_Name == false` caché suivait.
**■ Stop** et Override terminent l'attente, comme pour toute attente.

## Pre-Hop Alarm

Un **Combination Alarm and String Box Widget** : une boîte de texte sur un filigrane Skynet.

| Attribut | Ce qu'il fait |
|---|---|
| `.background` | Lequel des **trois filigranes Skynet** se montre : 1, 2 ou 3. Les filigranes eux-mêmes ne peuvent pas être changés. |
| `.string` | Son texte. Les codes Rich Text marchent dedans. |
| `.fore`, `.back` | Les couleurs de son texte. |
| `.playtime` | Combien de secondes elle reste On ; ensuite elle se met Off toute seule. Un clic la met Off plus tôt. 0 = elle reste On jusqu'à ce qu'on la touche. |

## User Alarm

| Attribut | Ce qu'il fait |
|---|---|
| `.background` | Laquelle de **vos trois images** se montre : 1, 2 ou 3 (Image Path 1 à 3, réglées dans sa fenêtre Properties ou avec `.backpath`, `.backpath_2`, `.backpath_3`). |
| `.string`, `.fore`, `.back`, `.playtime` | Comme sur la Pre-Hop Alarm. |

## Exemple {#example}

```
alm_PreHop.string = "Get the Flavor Hops ready"
alm_PreHop.background = 2
alm_PreHop.playtime = 30
alm_PreHop = On               // shows, sounds, and goes Off by itself after 30 seconds
alm_Mash_Done = On            // a Brew Flow Alarm: the Process waits here until it is tapped Off
```

Voir aussi [Widget Alarm](107-alarm-widget), [Alarmes et son](21-alarms-and-sound) et [L'Alarm Chain : une alarme, plusieurs étapes](172-alarm-chain).
