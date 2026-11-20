# Exemple Lance d'arrosage et Manifold {#fire-hose-and-manifold-sample}

L'exemple **Trois cuves, une pompe** a un onglet **Water**. Il fait couler l'eau du robinet pendant un temps choisi, par deux vannes
motorisées :

- la **Fire Hose** (lance d'arrosage), une vanne sur un tuyau ouvert, pour compléter une cuve ou la rincer au nettoyage ;
- la **Manifold Supply Valve**, l'eau du robinet dans le manifold.

La tuyauterie est dessinée comme celle d'OakBarn Brewery : le **Tap Water Supply** (arrivée d'eau du robinet) entre dans un Té ; un
côté passe par la **Manifold Valve** vers le **Brewery manifold**, l'autre descend par la **Firehose Valve** jusqu'à un **QD SS Male**,
où la lance d'arrosage s'accroche.

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
| Firehose Set Time | Set Time | Vous tapez le temps dans **Set Timer** |
| Use FireHose Float | Use Manifold Float | De l'eau jusqu'à ce que le **Water float** (flotteur) soit fait |
| FireHose Off | | L'arrête tout de suite et ferme les deux vannes |

## Ce qui se passe {#what-happens}

1. **Manifold Set?** vous demande de régler d'abord à la main les vannes du manifold, puis d'appuyer sur **Done**. C'est vous qui
   assurez la sécurité et le contrôle.
2. **Un avertissement de 20 secondes.** Le minuteur **Water delay** compte à rebours et l'alarme sonne, avec des messages à 10 et 5
   secondes.
3. **La vanne s'ouvre.** Le **Water timer** compte jusqu'à 00:00:00, puis la vanne se ferme. Avec un bouton Float il compte vers le
   haut, jusqu'à ce que le flotteur soit fait.
4. **Arrêtez-la plus tôt** avec **Override**. Sa fenêtre s'ouvre toute seule après 3 secondes
   ([Override button](96-override-button)), ou appuyez sur **FireHose Off**.

Dans le simulateur, touchez le **Water float** pour le faire.

## Les Processes {#the-processes}

| Process | Ce que c'est |
|---|---|
| `utility_FireHose_Manifold_Supply_Water` | Le Process Fire Hose et Manifold : Manifold Set?, l'avertissement, la marche minutée ou au flotteur, puis tout est coupé |
| `FireHose_1_Minute` ... `Manifold_Float` | Un par bouton : met dans `gblV_Water_Switch_Status_Water` son code et lance le Process |
| `FireHose_Off` | Arrête le Process et ferme les deux vannes |

Les codes sont ceux d'OakBarn Brewery : **1001** à **1005** pour la Fire Hose (1 minute, 2 minutes, 20 secondes, Set Time, Float) et
**2001** à **2005** pour le Manifold (1, 2 et 3 minutes, Set Time, Float).
