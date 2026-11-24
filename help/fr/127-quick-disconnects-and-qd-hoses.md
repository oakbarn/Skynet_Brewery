# Raccords rapides et flexibles QD {#quick-disconnects-and-qd-hoses}

Beaucoup de brasseurs amateurs ont un collecteur de vannes et déplacent un flexible d'une source à l'autre le jour du brassage. Skynet fait la même chose avec un
**Widget Quick Disconnect** (raccord rapide) et un **Quick Disconnect hose** (flexible QD) (Règle Skynet 5.28).

## Le Widget Quick Disconnect {#the-quick-disconnect-widget}

Un Quick Disconnect est posé sur un **IP**, le plus souvent l'IP d'un bout de vanne. Il est dessiné comme une **étoile rouge épaisse au
centre gris** pour être facile à voir sur un Tab, jamais plus petit que 40 pixels.

1. En **Edit layout**, ouvrez **Elbows, Tees …** (ou **Add Widget**) et choisissez **Quick Disconnect** sous *IPs, couplings and caps*.
   Comme chaque nouveau Widget, il est d'abord fait sur le 🔨 Build Tab (Règle 4.1) ; envoyez-le vers son Tab.
2. Faites-le glisser sur l'IP d'une vanne (ou tout autre IP). À environ 30 pixels, il **s'accroche sur l'IP** et un message le dit.
   Dès lors il reste sur cet IP : quand la vanne bouge, le Quick Disconnect la suit.
3. Faites-le glisser ailleurs pour le retirer de l'IP.

Avec un flexible dessus, le Quick Disconnect passe le liquide à l'IP sur lequel il est, donc le passage continue à travers la vanne quand la
vanne est ouverte. **Sans rien dessus, il est ouvert**, comme un vrai Quick Disconnect : l'eau poussée dedans en jaillit, avec
l'éclaboussure d'eau. Un flexible dessus dont l'autre bout est libre jaillit par ce bout.

## Le flexible Quick Disconnect {#the-quick-disconnect-hose}

1. En **Edit layout**, appuyez sur **Draw QD hose** (ligne 2 de la barre Edit layout, à côté de Draw hose).
2. Cliquez sur l'**IP de la pompe** d'où pend le flexible (son entrée ou sa sortie). Ce bout reste en place.
3. Cliquez sur quelques points par où le flexible se courbe, puis cliquez là où va son autre bout : un IP, un Quick Disconnect, ou
   le **tiers du haut d'une cuve**. Double-cliquez (ou Entrée) pour laisser le bout libre.
4. **Save layout.**

Le titre des Properties dit **Quick Disconnect Hose**. Sa taille, sa couleur, son Label et sa Flow Color se règlent comme pour tout flexible.

## Déplacer le bout du flexible le jour du brassage {#moving-the-hose-end-on-brew-day}

Le bout libre d'un flexible QD peut être déplacé **à tout moment**, pas seulement en Edit layout. Son bout s'affiche comme un anneau jaune en pointillés,
toujours par-dessus tout ce qui est sur le Tab.

- **Ordinateur :** gardez le **bouton gauche de la souris** appuyé un instant sur l'anneau (moins d'une demi-seconde), puis faites glisser. Un clic rapide ne le déplace pas. Le bouton droit ouvre seulement l'aide.
- **Téléphone ou tablette :** gardez un **doigt** sur l'anneau et faites glisser.
- **Clic gauche :** il ne déplace pas l'extrémité. Après un instant, une petite fenêtre avec le ⛔ rouge dit **Hold the left button a moment, then drag** (tenez le bouton gauche un instant, puis glissez). Elle disparaît seule après 3 secondes, ou au clic suivant.
- **Double-clic** sur l'anneau : les **Properties** du flexible s'ouvrent (admins seulement ; Edit layout s'ouvre avec elles). Un double-clic sur un **IP** ouvre les Properties du Device ou du Widget auquel il appartient.

Tout bout de tuyau souple dont l'**IP Type** est **Quick Disconnect** bouge de la même façon (aide 24), un bout à la fois.

C'est tout : gardez l'anneau appuyé et faites glisser. Rien ne s'ouvre avant.

**Sécurité :** si une pompe sur le tuyau est en marche (ou si du liquide coule dedans), un avertissement s'ouvre à la place et le bout ne bouge pas. Il dit d'arrêter la pompe d'abord, pour que le tuyau ne gicle pas. Il continue de vérifier et se ferme tout seul quand plus rien ne coule ; gardez alors l'anneau appuyé de nouveau. **✖ Exit** le ferme à tout moment.

Pendant que vous faites glisser, le tuyau **fléchit** : il quitte la pompe comme avant et pend en une courbe passant par plusieurs points de pliage, en pendant davantage plus vous tirez le bout loin. Un **anneau vert** montre où ira le bout. Lâchez sur :

- **un IP ou un Quick Disconnect** : le flexible s'y joint. Sur le bout ouvert d'un tuyau, le flexible entre dans le sens où ce
  bout est tourné, comme un vrai flexible : sur un bout tourné vers le bas, il pend dessous et fait un **U** pour y remonter. Un Quick Disconnect l'emporte sur l'IP de vanne en dessous. Sur le bout
  ouvert d'un tuyau, le passage continue du flexible dans ce tuyau.
- **n'importe où dans le tiers du haut d'une cuve** : tout le tiers du haut est un seul gros IP. C'est comme mettre le flexible dans le
  haut de la cuve, et le bout du flexible va au milieu du haut de la cuve.
- **n'importe où ailleurs** : le bout est libre, il pend en l'air. Si quelque chose pousse de l'eau dans le flexible (une Tap Water
  Valve ouverte, ou une pompe en marche), elle coule par le bout ouvert, donc le flexible montre un passage et
  une éclaboussure d'eau de la couleur du passage. Un bout laissé dans un Té ou un Coude, ou tout près d'un IP, est dedans :
  l'eau continue à travers et il n'y a pas d'éclaboussure. Un bout posé sur un tuyau ou un widget n'en a pas non plus.

Quand l'eau n'a nulle part où aller (chaque chemin finit à une vanne fermée), le flexible et les tuyaux jusqu'à ces vannes sont
pleins mais immobiles : leurs tirets se montrent et **restent immobiles**. Dès qu'une vanne s'ouvre, ils bougent.

Quand vous lâchez, le bout **reste où il est** : joint à l'IP, au Quick Disconnect ou au haut de la cuve en dessous, ou libre.
Rien n'est demandé. Quand il se fixe sur un IP, un Quick Disconnect ou le haut d'une cuve, son anneau **clignote rouge et jaune pendant 2
secondes** ; laissé en l'air, l'anneau reste simplement jaune. Pour le remettre, faites-le glisser de nouveau. Un Process peut aussi déplacer le flexible, avec `Hose_1.connect = QD_1` (aide : *Connect a QD hose from a Process*).

Un message dit où est allé le bout. Chaque écran voit le déplacement tout de suite et il est gardé (pas besoin de Save layout).
Les operators et les admins peuvent le déplacer ; un viewer non. Un flexible **verrouillé** (🔒) ne bouge pas.

## Passage et couleurs du passage {#flow-and-flow-colors}

Le passage traverse le flexible de la même façon que tout flexible (Règle 5.10, Règle 5.21) : depuis une pompe qui tourne, à travers les vannes ouvertes.
Un flexible dans le haut d'une cuve est un endroit où le passage finit ou commence, comme un orifice de cuve. Pompez depuis une cuve qui a une **Out flow
color** et le flexible prend cette couleur. L'ordre des couleurs du passage est le même que pour chaque tuyau et flexible (Règle 5.21).
