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

## Une Sump Pump que l'on branche {#a-sump-pump-you-plug-in}

La plupart des brasseurs mettent une **pompe de puisard** (sump pump) en marche en la branchant ou en allumant sa prise à la main : pas
de relais ni de SSR. Dans Skynet c'est une **Manual Pump** avec l'image Sump pump (Règle Skynet 5.15a). Pour en ajouter une, choisissez
**Sump Pump by hand** dans Select Widget Type > Semi_Widgets_Devices (ou Select Device Type > Pumps). C'est la même chose que choisir
Manual Pump, puis Sump pump à l'étape 2. Son Label commence à **Sump 1**, donc son nom est `wgt_MP_Sump~1_BR` sur le Tab Brew.

Un clic dessus (ou une ligne de Process comme `wgt_MP_Sump~1_BR.state = true`) vous demande de la mettre en marche à la main. Elle
affiche **ON** et son flexible montre le débit seulement après votre confirmation.

**Exemple : la boucle d'eau glacée d'OakBarn Brewery.** Une pompe de puisard est posée dans un grand bain de glace (une poubelle remplie
de glace et d'eau). Elle pompe l'eau glacée à travers un premier refroidisseur à plaques, qui refroidit l'eau du robinet, et l'eau
glacée retourne dans le bain. L'eau du robinet froide passe ensuite dans un second refroidisseur à plaques, contre le moût, et sert à
arroser la pelouse.
L'aide 201, [The Ice Water Can](201-ice-water-can), montre comment la dessiner.
