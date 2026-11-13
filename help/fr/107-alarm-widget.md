# Widget Alarm {#alarm-widget}

Un **Alarm Widget** fait sonner et montre une alarme sur un Tab. Il existe en **trois sous-classes**. Vous en choisissez une quand vous le faites, en Edit
layout avec **Select Widget Type > On-screen controls** (il est d'abord fait sur le 🔨 Build Tab, comme chaque nouveau Widget), et il
**ne peut jamais être changé** pour une autre :

- **Basic Skynet Alarm** : l'image de cloche Skynet. Vous choisissez ses couleurs et ce qui est posé dessus.
- **User Alarm** : vos propres images, avec un texte.
- **Pre-Hop Alarm** : une boîte de texte sur un filigrane Skynet (un Combination Alarm and String Box Widget).

Les alarmes faites avant le 2026-11-02 continuent de marcher comme avant.

## Basic Skynet Alarm : quatre couches {#basic-skynet-alarm-four-layers}

La Basic Skynet Alarm est dessinée en couches, de bas en haut :

| Couche | Ce que c'est | Réglée par |
|---|---|---|
| 4 | **Back** : le carré derrière la cloche | **Back color**, ou `.back` dans un Process |
| 3 | **Fore** : la cloche et son battant | **Fore color**, ou `.fore` dans un Process |
| 2 | **Set Graphic** : une image Skynet sur la cloche (le cône de houblon au départ) | la liste **Set Graphic** ; **None** (en premier dans la liste) = rien |
| 1 | **Active overlay** : par-dessus, clignotante, tant que l'alarme est active | la liste **Active overlay** ; **None** = rien |

L'image de la cloche elle-même est fixée par Skynet et ne peut pas être changée. Elle existe en trois versions : **Together** (Back et Fore),
**Back only** et **Fore only**, toutes dans `Images/Skynet/Alarms/`. Les traits noirs de la cloche ne sont jamais colorés.
Les couleurs sont la liste de couleurs standard (Default et None d'abord, puis les couleurs nommées, puis Custom).

Les listes Set Graphic et Active overlay ne contiennent que des images Skynet : les images `Alarm_Set_...` et `Alarm_Active_...` de
`Images/Skynet/Alarms/`. D'autres seront ajoutées.

## User Alarm

- **Background picture (Image Path 1)** : n'importe quelle image ; choisissez-la dans la liste ou tapez un nouveau chemin. L'hexagone rouge **⬢** à côté
  ouvre la **Graphic Dialog** avec Background #, Image Path 2 et 3, et la Back Colour derrière l'image.
- **Set Graphic (Layer 2)** : n'importe quelle image, par-dessus le fond.
- **Active overlay (Layer 1)** : par-dessus tant que l'alarme est active.
- **Text** : ce qu'elle dit (`.string` dans un Process). Les codes Rich Text marchent dedans.
- **Fore color** et **Back color** : les couleurs de son texte (`.fore` et `.back` dans un Process).
- **Play time** : combien de secondes elle reste On, puis elle se met Off toute seule. Vide = jusqu'à ce qu'on la touche.

## Pre-Hop Alarm

Une boîte de texte sur l'un des **trois filigranes Skynet**. Les filigranes sont des images Skynet et ne peuvent pas être changés ; un
Process en choisit un avec `.background = 1`, `2` ou `3` (1 au départ).

- **Text**, **Fore color**, **Back color** et **Play time** : comme sur une User Alarm.
- **Set Graphic (Layer 2)** et **Active overlay (Layer 1)** : des images Skynet sur le filigrane, comme sur une Basic Skynet Alarm.

## Se montre seulement quand elle est On {#shows-only-while-it-is-on}

Chaque Alarm Widget **se montre pendant qu'elle est On et se cache pendant qu'elle est Off** : vous ne réglez jamais Visible. En Edit
layout une Alarm cachée se montre pâle, pour que vous puissiez quand même la placer. **Un clic dessus la met Off.** Voir
[Les attributs d'une Alarm](195-alarm-attributes).

## Alarm Widget Properties

La fenêtre suit les règles générales des fenêtres (Règles Skynet section 18) :

- **Label** est en premier et **ne peut pas être vide**. **Show label** l'affiche ou non sur le Tab. Le **⬆** rouge ouvre une case plus
  grande (2 lignes) pour le taper, et le **⬢** rouge ouvre les **Label attributes** : Label, Visible, Font size, Font, Bold, Fore
  color, Back color et Alignment.
- **Name** : le Name d'une nouvelle alarme suit son Label (`alm_` + le Label) jusqu'à ce que vous tapiez un nom à vous. Il ne peut pas être vide.
- **Alarm** : la sorte d'alarme (Hop 1, Brew Flow 2, Pre-Hop 3, General 4, Sound only 5), sa minuterie ou Hop Alarm, et le son
  et Repeat. Ils marchent comme avant (voir Alarms and sound).
- **Graphic** : les couches ci-dessus.
- **Alarm Chain** : des étapes qui changent ses couleurs, ses images et son son, pour qu'une seule alarme fasse le travail de plusieurs alarmes empilées. Chaque
  choix commence sur **No Change**. Voir [L'Alarm Chain : une alarme, plusieurs étapes](172-alarm-chain).
- **Properties** : Hidden Locked, Tab, X, Y, Width, Height et Lock. Visible est automatique (ci-dessus).
- **COPY** l'enregistre et en fait une copie sur le 🔨 Build Tab. Le **?** orange liste ses Properties et ses Attributes.
- **✖ Cancel** dans les fenêtres ⬆ et ⬢ demande d'abord si quelque chose a été changé : abandonner les changements, ou revenir (Règle 18.11).

## Dans un Process {#in-a-process}

```
alm_Hops = On                 // sound it
alm_Hops.back = "Red"         // Layer 4 of a Basic Skynet Alarm (behind the text of a User or Pre-Hop Alarm)
alm_Hops.fore = "Yellow"      // Layer 3: the bell
alm_Hops.back = ""            // back to what its Properties say
alm_Hops.step = 2             // step 2 of its Alarm Chain (or alm_Hops.step = "Aroma")
alm_PreHop.string = "Get the Flavor Hops ready"   // the text of a Pre-Hop or User Alarm
alm_PreHop.playtime = 30      // it turns itself Off after 30 seconds
```

(Dans l'ordre : la faire sonner ; couche 4 d'une Basic Skynet Alarm (derrière le texte d'une User ou Pre-Hop Alarm) ; couche 3 : la cloche ; revenir à ce que disent ses Properties ; étape 2 de son Alarm Chain ; le texte d'une Pre-Hop ou User Alarm ; elle se met Off toute seule après 30 secondes.)

Tous les attributs d'une Alarm sont dans [Les attributs d'une Alarm](195-alarm-attributes).
