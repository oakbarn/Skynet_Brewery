# Exemple Lance d'arrosage et Manifold {#fire-hose-and-manifold-sample}

L'exemple **Trois cuves, une pompe** a un onglet **Water**. Il fait couler l'eau du robinet pendant un temps choisi, par deux vannes
motorisées :

- la **Fire Hose** (lance d'arrosage), une vanne sur un tuyau ouvert, pour compléter une cuve ou la rincer au nettoyage ;
- la **Manifold Supply Valve**, l'eau du robinet dans le manifold.

La tuyauterie est dessinée comme celle d'OakBarn Brewery : le **Tap Water Supply** (arrivée d'eau du robinet) arrive par la droite
dans un Té ; un côté passe par la **Manifold Valve** vers le **Brewery manifold**, l'autre monte par la **Firehose Valve** jusqu'à un
**QD SS Male**, où la lance d'arrosage s'accroche. Les deux mêmes vannes apparaissent aussi sur l'onglet **Brew House**, sur la ligne
d'eau du robinet qui va à son manifold, alimentée par le robinet **Tap water** (ce sont des Clones : les mêmes vannes, donc en ouvrir
une sur un onglet l'ouvre sur les deux).

L'onglet **Water** sert seulement à choisir. Un bouton amène chaque écran sur la **Brew House**, l'onglet qui a le manifold, et le
remplissage se fait là, où vous pouvez le regarder : la boîte de message, le **Water delay** et le **Water timer**, les
avertissements, le **Water Override** et, avec un bouton Float, le **Water float** sont tous sur la Brew House.

C'est le premier exemple de Process, fait à partir des Processes Fire Hose et Manifold d'OakBarn Brewery. Ouvrez-le sur le simulateur
et appuyez sur un bouton pour le voir fonctionner.

## Les boutons {#the-buttons}

Chaque bouton est un [Process Widget](173-process-widget). Un clic lance son petit Process, qui choisit le temps et lance le Process
Fire Hose et Manifold. Le bouton a fini tout de suite : il affiche de nouveau **Stopped** pendant que l'eau coule.

| Fire Hose | Manifold | Ce qu'il fait |
|---|---|---|
| FireHose 1 Minute | Manifold 1 Minute | De l'eau pendant 1 minute |
| FireHose 2 Minutes | Manifold 2 Minutes | De l'eau pendant 2 minutes |
| FireHose 20 Seconds | Manifold 3 Minutes | De l'eau pendant 20 secondes ou 3 minutes |
| Firehose Set Time | Set Time | Une fenêtre demande le temps ; il va dans le gGlobal `gblT_SetTimer_Water` |
| Use FireHose Float | Use Manifold Float | De l'eau jusqu'à ce que le **Water float** (flotteur) soit fait |
| FireHose Off | | L'arrête tout de suite et ferme les deux vannes |

## Ce qui se passe {#what-happens}

1. **Manifold Set?** La Brew House s'ouvre avec une barre en haut : réglez le manifold, puis cliquez sur **✔ Done** quand vous êtes
   prêt. Pendant que la barre est là, l'onglet marche toujours : ouvrir et fermer des vannes, arrêter la pompe, etc. Seul Edit layout
   attend le Done. C'est vous qui assurez la sécurité et le contrôle.
2. **Un délai de 20 secondes**, le temps de déplacer un tuyau à la main avant que l'eau coule. Le minuteur **Water delay** compte à
   rebours et l'alarme sonne, avec des messages à 10 et 5 secondes.
3. **La vanne s'ouvre.** Le **Water timer** compte jusqu'à 00:00:00, puis la vanne se ferme. Avec un bouton Float il compte vers le
   haut, jusqu'à ce que le flotteur soit fait. Le **Water float** n'apparaît sur la Brew House que si un bouton Float a été choisi.
4. **Arrêtez-la plus tôt** avec le bouton **Water Override** : un appui finit la marche et la vanne se ferme
   ([Override button](96-override-button)). Chaque remplissage d'eau du robinet a son propre bouton Override. Il n'apparaît
   qu'une fois l'eau ouverte, donc il n'y en a pas pendant l'avertissement de 20 secondes. **FireHose Off** l'arrête à tout moment.
5. **Le vrai temps de marche est gardé.** Un minuteur caché qui compte vers le haut, **Water elapsed**, tourne de l'ouverture de la
   vanne jusqu'à la fin du temps, au flotteur fait, ou à Override ou FireHose Off. Ce temps va dans le gGlobal caché
   `gblT_Elapsed_Water` (True Run Time), pour les secondes par gallon.

Dans le simulateur, touchez le **Water float** et choisissez **Simulate: input ON** pour le faire (le flotteur est soulevé, contacts
fermés, en rouge), et **Simulate: input OFF** pour le faire retomber. Le Water float et les deux boutons Float montrent l'image de
l'interrupteur à flotteur selon son état.

**Conseil :** mettez un régulateur de pression d'eau sur la ligne d'eau du robinet, avant les vannes. Il coûte peu et
s'installe facilement, et avec la même pression à chaque fois, un remplissage minuté donne toujours la même quantité d'eau.

## Les Processes {#the-processes}

| Process | Ce que c'est |
|---|---|
| `utility_FireHose_Manifold_Supply_Water` | Le Process Fire Hose et Manifold : Manifold Set?, l'avertissement, la marche minutée ou au flotteur, puis tout est coupé |
| `FireHose_1_Minute` ... `Manifold_Float` | Un par bouton : met dans `gblV_Water_Switch_Status_Water` son code et lance le Process |
| `FireHose_Off` | Arrête le Process et ferme les deux vannes |

Les codes sont ceux d'OakBarn Brewery : **1001** à **1005** pour la Fire Hose (1 minute, 2 minutes, 20 secondes, Set Time, Float) et
**2001** à **2005** pour le Manifold (1, 2 et 3 minutes, Set Time, Float).
