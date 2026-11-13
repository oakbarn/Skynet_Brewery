# L'Alarm Chain : une alarme, plusieurs étapes {#the-alarm-chain-one-alarm-many-steps}

Vous n'avez jamais besoin d'**empiler** plusieurs alarmes les unes sur les autres, une pour chaque image et chaque son. **Une
seule alarme peut tout faire** : son **Alarm Chain** (chaîne d'alarme) est une liste d'**étapes**, et chaque étape change l'aspect et le son de l'alarme.

## Ajouter des étapes {#add-steps}

1. En Edit layout, double-cliquez sur l'Alarm Widget pour ouvrir ses **Alarm Widget Properties**.
2. Dans la case **Alarm Chain**, choisissez combien d'**étapes (Steps)** elle a (jusqu'à 20).
3. Tapez un **nom** pour chaque étape (Strike, Mash, Boil ...). Le **⬢** rouge à côté ouvre les choix de cette étape.

## Les choix d'une étape {#a-step-s-choices}

Chaque choix commence sur **No Change**. No Change **saute ce réglage** : l'alarme garde ce qu'elle a déjà.

| Choix | Ce qu'il change |
|---|---|
| **Fore color** | Couche 3, la cloche (une User Alarm : son texte) |
| **Back color** | Couche 4, derrière la cloche (une User Alarm : derrière ses images) |
| **Set Graphic** | Couche 2, l'image sur la cloche. **None** l'enlève |
| **Active overlay** | Couche 1, par-dessus tant que l'alarme sonne. **None** l'enlève |
| **Sound file** | le son qu'elle joue |
| **Background picture** | une User Alarm seulement : sa propre image (Image Path 1) |
| **At this time on the timer** | une Hop Alarm seulement : voir plus bas |

Les couleurs sont la liste de couleurs standard (No Change, Default, None, les couleurs nommées, Custom).

## Dans un Process {#in-a-process}

```
alm_Brew.step = 2           go to step 2 (its look and sound)
alm_Brew.step = "Strike"    the same, by the step's name
alm_Brew = On               sound it (alm_Brew = true works too)
wait alm_Brew == Off        wait until the brewer taps it off
alm_Brew.step = 0           back to what its Properties say
alm_Brew.setgraphic = "Images/Skynet/Alarms/Alarm_Set_Hop.svg"
```

(Dans l'ordre : aller à l'étape 2, la même par le nom de l'étape, la faire sonner, attendre que le brasseur l'arrête d'un appui, revenir à ce que disent ses Properties, et changer son image.)

## L'Alarm Chain d'un minuteur {#a-timer-s-alarm-chain}

Une **Hop Alarm** a un minuteur. Donnez à une étape une **heure sur ce minuteur** (hh:mm:ss) et quand le minuteur y arrive, l'alarme passe à cette
étape **et sonne**, une fois. Une seule Hop Alarm peut maintenant annoncer chaque ajout de houblon de l'ébullition, chacun avec sa propre image et son propre son.

**Une étape attend son tour.** Si une étape arrive à échéance pendant que l'alarme sonne encore la précédente, elle attend, et l'alarme affiche
« +1 step waiting » (1 étape en attente). Dès que la précédente est arrêtée d'un appui, l'alarme passe à l'étape en attente et sonne. (Le
`.step` d'un Process la change toujours tout de suite.) Quand plusieurs alarmes sonnent ensemble, leur **Priority** fixe l'ordre : voir
[Alarmes et son](21-alarms-and-sound).

Les étapes sont gardées **dans l'ordre où elles passent à On** : sur un minuteur qui décompte, celle qui a le plus de temps restant vient en premier. Quand vous
ajoutez une nouvelle étape, elle est mise à sa place dès que vous enregistrez. Les étapes sans heure restent après, dans votre ordre.

## On, Off, true et false {#on-off-true-and-false}

Tout ce qui est vrai ou faux peut s'écrire de l'une ou l'autre façon : `alm_Brew = On` est pareil que `alm_Brew = true`. Un Process n'écrit jamais
`.active`.

Voir aussi [Widget Alarm](107-alarm-widget) et [Alarmes et son](21-alarms-and-sound).
