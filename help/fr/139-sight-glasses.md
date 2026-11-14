# Voyants {#sight-glasses}

Un **Sight Glass** (voyant) permet de voir le moût ou l'eau qui passe dans un tuyau. Skynet en a deux, tous deux des **TC Pipe Fittings** (Règle Skynet 5.32,
voir la page TC Pipe Fittings) :

| Sight Glass | À quoi il ressemble |
| --- | --- |
| **Sight Glass** | un simple tube de verre entre deux férules TC 1.5 |
| **Sight Glass Caged** | le même, avec une cage en inox autour du verre |

Chacun a un **IP sur la face extérieure de chaque férule** (gauche et droite), donc un tuyau se joint à chaque bout. Le débit le traverse dans les deux sens.

## En ajouter un {#adding-one}

En **Edit layout**, choisissez **Elbows, Tees … > Sight Glass** (ou Sight Glass Caged), ou **Add Widget > TC Pipe Fittings**. Il va sur
le Build Tab comme tout nouvel élément (Règle 4.1), long de 6 pouces. Son **Label** commence par **site_glass_1**, **site_glass_2** et ainsi de suite (vous pouvez le changer,
mais il ne peut pas être vide).

Posez-le sur un tuyau droit et Skynet coupe le tuyau et y insère le voyant, comme pour un té.

## L'allonger ou le raccourcir : Length {#making-it-longer-or-shorter-length}

Double-cliquez dessus pour ouvrir ses Properties. **Length** est en pouces, d'une face de férule à l'autre (2 à 48). Tapez une nouvelle Length et
appuyez sur **Save** : seul le **verre** (et la cage) s'allonge ou se raccourcit. Les férules gardent leur taille et leur forme.

- **Autosize to pipe** (toujours activé) le garde aussi épais que le tuyau qui y est joint.

Mettez-le debout avec les boutons de rotation de la barre Edit layout. Appuyez sur **Save layout** pour garder vos changements.
