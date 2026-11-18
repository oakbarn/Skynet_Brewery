# Robinet d'eau du réseau {#tap-water-valve}

Le **Tap Water Valve** est le **robinet de jardin** en laiton (robinet extérieur) à poignée verte, celui qu'on achète dans un
magasin de bricolage. Dans Skynet c'est un **Manual Valve Widget** (Règle Skynet 5.33) : pas de broche de carte, tourné à la main, et
il amène l'eau de la maison dans votre brasserie.

![Robinet d'eau du réseau](Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg)

## En ajouter un {#add-one}

En **Edit layout**, utilisez **Select Device Type > Valves > Tap Water Valve**, ou **Select Widget Type > Semi_Widgets_Devices >
Tap Water Valve**. Il arrive sur le Tab où vous êtes, nommé **ManualValve_1** (ManualValve_2 ...), avec le Label **tap_water_1**
(tap_water_2 ...). Changez le Label dans ses Properties si vous voulez (Règle Skynet 18.15 : il ne peut jamais être vide).

Vous pouvez aussi transformer n'importe quelle Manual Valve en robinet : ouvrez ses Properties et choisissez **Tap Water Valve (household hose bib)** comme Picture.

## Son seul IP : la sortie pour tuyau {#its-one-ip-the-hose-outlet}

L'eau arrive du mur (la plomberie de la maison), donc le robinet n'a **qu'un seul IP**, au bout de son propre petit Hose ou Pipe
qui part du **filetage pour tuyau en bas du bec** (voir Taille plus bas). Tracez un flexible (ou un tuyau) de là jusqu'où va l'eau, comme votre HLT ou un refroidisseur.

- **Fermé** : rien ne sort ; tout flexible branché est bloqué.
- **Ouvert** : c'est une **source d'eau du réseau**. Le débit sort par la sortie sans pompe, et le débit est **bleu eau du réseau**
  (Règle Skynet 5.21 : l'eau du réseau l'emporte sur toutes les autres Flow Colors).
- Il ne coupe pas un tuyau sur lequel on le pose, car il n'a qu'un IP (une vanne en demande deux pour se placer dans un tuyau, Règle Skynet 5.26).

## L'ouvrir et le fermer {#opening-and-closing-it}

Exactement comme tout Manual Valve Widget (Règle Skynet 5.15, voir la page Pipe fittings and Manual Valves) :

- **Un clic dessus sur son Tab l'ouvre ou le ferme**, à tout moment. Tant qu'il est ouvert, le signe ouvert (un anneau vert et une coche) est
  dessiné dessus.
- Une ligne de Process comme `ManualValve_1.state = true` ne le tourne **pas**. Le Tab affiche « Open it by hand » (ouvrez-le à la main), le robinet clignote, et
  le Process attend que quelqu'un clique pour l'ouvrir. C'est votre rappel d'aller ouvrir l'eau.

## Taille : un Hose Bib, dimensionné comme une Pump {#size-a-hose-bib-sized-like-a-pump}

Une Manual Valve existe en deux sortes (Skynet Rule 18.45) : **Straight** (dans une ligne de tuyaux) et **Hose Bib**. Le Tap Water
Valve est le Hose Bib. Il se **dimensionne à la main, comme une Pump** : tirez son coin, ou tapez sa Width et sa Height. Son image
est en haut à droite de sa boîte, et son **propre petit Hose ou Pipe** court dans la boîte, du filetage jusqu'à son seul IP sur le
bord de la boîte. Agrandi ou réduit, le Hose ou Pipe intérieur est redessiné pour atteindre l'IP.

## Sa propre fenêtre {#its-own-dialog}

Ses Properties sont la fenêtre **Hose Bib Widget** : **State** (un curseur, Open ou Closed maintenant), **1. Label** et **Label
Visible** (🏷 Update to Suggested Name apparaît dès que le Label change), **2. Name** avec la case **Change Name** et **✏ Change
Name**, **.confirmation**, le **Graphic** (son image avec son Hose ou Pipe intérieur, tenue à jour), **Picture**, **Orientation**
(toujours Horizontal) avec **Left / Right** (le mur à droite comme dessiné, ou à gauche), **IP** avec **Hose or Pipe**, et **X**,
**Y**, **Width**, **Height**.

**IP** est l'endroit de son seul IP : Bottom Middle (au départ), Bottom Left, Bottom Right ou Left Middle. L'endroit est nommé tel
que vous le voyez, donc sur un Hose Bib Left, Bottom Left est toujours à gauche.

![Hose Bib IP spots](help_pictures/Hose_Bib_IP_Spots.png)
