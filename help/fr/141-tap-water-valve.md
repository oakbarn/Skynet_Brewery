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

Ses Properties sont la fenêtre **Hose Bib Widget**, avec le même aspect et le même ordre que celle de la Pump : le cadenas et
**No Unlock** dans la ligne du titre, **State** (un curseur, Open ou Closed maintenant), **1. Label** et **Label Visible** (🏷 Update
to Suggested Name apparaît dès que le Label change), **Layer Order**, **2. Name** avec la case **Change Name** et **✏ Change Name**,
le Suggested Name, le **Graphic** (son image avec son Hose ou Pipe intérieur, tenue à jour), **Picture**, **Orientation** (Horizontal
ou Vertical) avec **Left / Right**, **Hose or Pipe**, **IP**, **.confirmation**, **X**, **Y**, **Width** et **Height** sur une ligne,
et le Widget Type.

**Orientation** et **Left / Right** : Horizontal Right est l'image telle qu'elle est dessinée (le mur à droite), Horizontal Left
est son miroir (le mur à gauche). Vertical la tourne pour un robinet sur un tuyau qui monte et descend : Vertical Left tourne la
poignée vers la gauche (le mur au-dessus), Vertical Right vers la droite (le mur en dessous).

**IP** est l'endroit de son seul IP : un des 8 endroits sur le bord de sa boîte (Bottom Middle, Bottom Left, Bottom Right, Left
Middle, Right Middle, Top Left, Top Middle, Top Right). L'endroit est nommé tel que vous le voyez, quelles que soient l'Orientation
et Left / Right, et les endroits du côté du mur ne sont pas proposés (l'eau de la maison arrive de là).

![Hose Bib IP spots](help_pictures/Hose_Bib_IP_Spots.png)
