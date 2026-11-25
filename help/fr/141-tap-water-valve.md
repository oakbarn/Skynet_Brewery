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

Comme pour une Pump, vous ne choisissez pas où va l'IP (Règle Skynet 18.48) : posez le bout d'un flexible ou d'un tuyau sur le Hose
Bib ou près de lui, et son IP va au plus proche des 8 endroits du bord de sa boîte (n'importe lequel des 8, le côté du mur aussi, Règle Skynet
18.49). Une fois un flexible ou un tuyau joint, l'IP ne bouge plus, et le Graphic de sa fenêtre le montre là.

- **Fermé** : rien ne sort ; tout flexible branché est bloqué.
- **Ouvert** : c'est une **source d'eau du réseau**. Le débit sort par la sortie sans pompe, et le débit est **bleu eau du réseau**
  (Règle Skynet 5.21 : l'eau du réseau l'emporte sur toutes les autres Flow Colors).
- Il ne coupe pas un tuyau sur lequel on le pose : son Inlet et sa sortie pour tuyau ne sont pas en ligne (Règles Skynet 5.26 et 18.52).

## Son IP Inlet : le tuyau d'eau de la maison {#its-inlet-ip-the-house-water-pipe}

Comme une Motorized Valve, il a aussi un **IP Inlet** sur la face extérieure du filetage du côté du mur (Règle Skynet 18.52). Il tourne
avec l'image, donc en Vertical il est en haut ou en bas (la case **Inlet**). Joignez-y un tuyau pour dessiner le tuyau d'eau de la maison.

- **Rien sur l'Inlet** : la plomberie de la maison n'est pas dessinée, et le Hose Bib a toujours de l'eau (comme avant).
- **Un tuyau sur l'Inlet, Hose Bib ouvert** : l'eau entre le long de ce tuyau, vers le Hose Bib, en bleu eau du réseau.
- **Une vanne sur ce tuyau** : elle doit être ouverte aussi. Fermée, il n'y a pas d'eau, donc rien ne coule dans le tuyau de l'Inlet
  et rien ne sort non plus du flexible. Une vanne ouverte dont l'autre côté n'a rien de joint compte comme l'arrivée d'eau de la maison.
- **Du côté du flexible** : une vanne fermée au bout du flexible ou du tuyau arrête le débit sur celui-ci, comme sur tout tuyau.

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
to Suggested Name apparaît dès que le Label change), **2. Tab** avec **Layer Order** dessous, **3. Name** avec la case **Change
Name** et **✏ Change Name**, le Suggested Name, le **Graphic** (sa seule image Skynet avec son Hose ou Pipe intérieur, tenue à jour),
**Orientation** avec **Flip Horizontal** et **Flip Vertical**, **Hose or Pipe**, **Cover** avec **Toggle**, **Overlay** avec **Database and .API ⬢**,
**Inlet IP Fitting**, **Outlet IP Fitting**, **.confirmation**, **X**, **Y**, **Width** et **Height** sur une ligne, et
le Widget Type (Règle Skynet 18.48). Il n'y a pas de case Picture (un Hose Bib a une seule image Skynet) ni de case IP (le flexible
ou le tuyau que vous joignez la fixe, voir plus haut).

**Orientation**, **Flip Horizontal** et **Flip Vertical** (OakBarn Brewery, Panel Update 14 : « Le Hose Bib se retourne de gauche à
droite » ; « Toutes les images Horizontal commencent avec l'écoulement de gauche à droite » ; « Toutes les images Vertical commencent
avec l'écoulement de bas en haut » ; Règle Skynet 18.52) : un Hose Bib se place comme une Motorized Valve, sa poignée faisant office de
« moteur ». **Horizontal** a l'Inlet (le côté du mur, le TAP) à gauche, donc l'eau va de gauche à droite. **Vertical** est pour un
robinet sur un tuyau qui monte et descend : l'Inlet en bas (de bas en haut) et la poignée à gauche. **Flip Horizontal** le retourne de
gauche à droite et **Flip Vertical** de haut en bas, tel qu'on le voit sur le Tab, ce qui donne les 4 vues dans chaque Orientation (en
Vertical : Flip Vertical met l'Inlet en haut, Flip Horizontal la poignée à droite). Un Hose Bib enregistré avec Left / Right et Inlet
garde la même allure avec les Flips quand ses Properties s'ouvrent ; rien ne bouge sur le Tab. Dans la fenêtre de zoom, **H** et **V**
retournent aussi le Hose Bib choisi.

Son seul IP est sur un des 8 endroits du bord de sa boîte (Bottom Middle, Bottom Left, Bottom Right, Left Middle, Right Middle,
Top Left, Top Middle, Top Right), le côté du mur aussi (Règle Skynet 18.49), comme une Pump. Le flexible ou le tuyau joint choisit
l'endroit. Un endroit reste où vous le voyez quand vous changez l'Orientation ou un Flip, donc le flexible ou le tuyau ne bouge
pas.

![Hose Bib 8 IPs](help_pictures/Hose_Bib_8_IPs.png)

![Hose Bib IP spots](help_pictures/Hose_Bib_IP_Spots.png)

**Overlay** : ce qui est dessiné par-dessus tant qu'il est ouvert. Vide est le signe ouvert de la Manual Valve (un anneau vert et une
coche) ; les autres sont les Overlays de la Pump (Lightning Bolt ...).

**Cover** et **Toggle** (Règle Skynet 18.49) : le Cover est un cache de couleur sur le robinet (les couleurs de la Pump), par
exemple un cache en mousse. Le Toggle est ce que fait un clic dessus sur son Tab : **On/Off** (un clic l'ouvre, le suivant le ferme)
ou **Push Button** (ouvert seulement tant que vous le tenez appuyé, pour compléter une cuve à la main).

**Database and .API** (le ⬢ sur la ligne Overlay, comme sur la Pump) : son .state peut aller dans la base de données de brassage, et
un programme extérieur ou une commande vocale peut le lire, ou, avec .API Read & Control, le demander. Demandé de l'extérieur, il
est demandé **à la main**, comme par une ligne de Process : le Tab affiche « Open it by hand », quelqu'un tourne le vrai robinet et
clique dessus, et son .state le confirme alors.

**Inlet IP Fitting** : le raccord du côté du mur, là où arrive le tuyau de la maison (MPT1/2 au départ), sur son IP Inlet (voir plus
haut). Le raccord lui-même est une information seulement.

**Outlet IP Fitting** : l'End Fitting de son seul IP (Règles Skynet 2.57 et 18.49). Un robinet de jardin a un filetage mâle de tuyau
d'arrosage, **MGH3/4**, et c'est ce qu'il a au départ. **FGH3/4** est le filetage femelle de tuyau d'arrosage. Un flexible ou un
tuyau joint s'y adapte de lui-même : un bout de flexible **FGH3/4** sur un Hose Bib MGH3/4. FGH et MGH peuvent aussi être cochés dans
Default settings pour n'importe quel bout de tuyau ou de flexible.
