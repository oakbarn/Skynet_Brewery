# Widgets de confirmation {#confirmation-widgets}

Certaines choses dans une brasserie se font **à la main** : aucune Interface (carte) ne les met en marche. Un **Confirmation Widget** représente l'une
d'elles sur un Tab, pour que votre Tab et vos Processes sachent quand même si elle est en marche (Règle Skynet 1.28).

Les Confirmation Widgets aujourd'hui sont :

- les **Manual Valves** (une vanne à bille manuelle ou une vanne papillon manuelle).
- les **Manual Pumps** (une pompe branchée sur une prise murale, sans Port d'Interface).
- le **déplacement d'un flexible QD** (un flexible à raccord rapide) vers une cuve ou vers un autre QD.

D'autres pourront être ajoutés plus tard.

## Comment ça marche {#how-it-works}

Un Confirmation Widget **ne met rien en marche**. Quand on lui commande **On ou Off**, soit par un **clic dessus** à
l'écran soit par du **code Process** comme `Pump~7.state = true` (On) ou `Pump~7.state = false` (Off) :

1. Skynet montre une **fenêtre** qui vous demande de le faire à la main, par exemple « Turn on Pump 7 » (mettez en marche la pompe 7).
2. Vous le faites dans votre brasserie, puis confirmez dans la fenêtre.
3. Seulement alors le Widget affiche **On** ou **Off** (Open ou Closed, Connected ou non).

Un Process qui en commande un attend, et le Widget clignote sur son Tab, jusqu'à ce que quelqu'un confirme. C'est ainsi que la Manual Valve a
toujours marché ([aide 87](87-pipe-fittings-and-manual-valves)).

Tout le reste sur un Tab se met en marche ou s'arrête d'un clic et sans fenêtre (Règle Skynet 2.44). Les Confirmation Widgets sont la seule
exception, car la fenêtre n'est pas une question avant de basculer : c'est vous qui dites à Skynet que vous l'avez fait.

## L'interrupteur .confirmation {#the-confirmation-switch}

Chaque Widget qui peut être On ou Off a un interrupteur **.confirmation** dans ses Properties. Quand il est activé, ce Widget est un Confirmation
Widget. Il commence activé pour les Manual Valves, les Manual Pumps et les flexibles QD, et désactivé pour tout le reste.
