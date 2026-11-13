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
vanne est ouverte. Sans rien dessus, il est fermé : aucun passage ne s'y affiche.

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

- **Ordinateur :** gardez le **bouton droit de la souris** appuyé sur l'anneau et faites glisser (Règle 2.9 : le bouton droit fait glisser).
- **Téléphone ou tablette :** gardez un **doigt** sur l'anneau et faites glisser.

Pendant que vous faites glisser, un **anneau vert** montre où ira le bout. Lâchez sur :

- **un IP ou un Quick Disconnect** : le flexible s'y joint. Un Quick Disconnect l'emporte sur l'IP de vanne en dessous.
- **n'importe où dans le tiers du haut d'une cuve** : tout le tiers du haut est un seul gros IP. C'est comme mettre le flexible dans le
  haut de la cuve, et le bout du flexible va au milieu du haut de la cuve.
- **n'importe où ailleurs** : le bout est libre et aucun passage ne s'affiche dans le flexible.

Quand vous lâchez, Skynet demande **"Is the real hose there now?"** (le vrai flexible est-il là maintenant ? Règle 5.34). **OK** le garde là ; **Cancel** remet le bout
où il était. Un Process peut aussi déplacer le flexible, avec `Hose_1.connect = QD_1` (aide : *Connect a QD hose from a Process*).

Un message dit où est allé le bout. Chaque écran voit le déplacement tout de suite et il est gardé (pas besoin de Save layout).
Les operators et les admins peuvent le déplacer ; un viewer non. Un flexible **verrouillé** (🔒) ne bouge pas.

## Passage et couleurs du passage {#flow-and-flow-colors}

Le passage traverse le flexible de la même façon que tout flexible (Règle 5.10, Règle 5.21) : depuis une pompe qui tourne, à travers les vannes ouvertes.
Un flexible dans le haut d'une cuve est un endroit où le passage finit ou commence, comme un orifice de cuve. Pompez depuis une cuve qui a une **Out flow
color** et le flexible prend cette couleur. L'ordre des couleurs du passage est le même que pour chaque tuyau et flexible (Règle 5.21).
