# Le standard des pompes : échanger une pompe contre une autre {#the-pump-standard-swap-one-pump-for-another}

Chaque pompe a **8 IP aux mêmes places**, et chaque image de pompe Skynet est dessinée dans la **même case de 300 x 300** (Règle Skynet 5.27).
Vous pouvez donc retirer une pompe, en mettre une autre au **même X et Y à la même taille**, et elle reste jointe aux mêmes tuyaux.

## Les 8 IP {#the-8-ips}

Chaque pompe a 8 IP : les 4 coins de sa case et le milieu de chaque côté, les mêmes sur chaque pompe, pour qu'une autre pompe puisse prendre sa
place et rester jointe à ses tuyaux.

| En haut à gauche | En haut au milieu | En haut à droite |
|---|---|---|
| **Au milieu à gauche** | (la pompe) | **Au milieu à droite** |
| **En bas à gauche** | **En bas au milieu** | **En bas à droite** |

Les tuyaux et les flexibles fixent lequel est son entrée (IN) et lequel sa sortie (OUT), vu sur le Tab. Il n'y a rien à choisir :

- **Dessinez ou déposez un bout de tuyau ou de flexible sur la pompe ou près d'elle** et il rejoint la plus proche des 8 IP ; le bout
  libre de la pompe (IN ou OUT sans rien de joint) va là. Avec les deux bouts libres, celui qui est le plus près de cette place y va
  (OakBarn Brewery, 2026-11-16 : « Pipe and hose changes are always auto » ; « nearest where the user places it »).
- **Avant que rien ne soit joint**, une pompe Skynet commence avec son entrée **au milieu à droite** et sa sortie **en haut à droite** ; avec l'Orientation **Left**, c'est **au milieu à
  gauche** et **en haut à gauche**. Une pompe avec votre propre image commence au milieu de ses côtés gauche et droit.
- Les deux ne sont jamais à la même place, donc on voit toujours clairement lequel est In et lequel est Out, même quand les deux sont du même côté.
- Exemple : la pompe de l'exemple 3 Vessel 1 Pump (montrée Left) a son entrée au milieu à gauche et sa sortie en haut à gauche.

## Hose ou Pipe {#hose-or-pipe}

Ce qui est dessiné entre les propres entrée et sortie de la pompe et son Inlet IP et son Outlet IP : un **Hose** (flexible) blanc, ou un **Pipe** (tuyau) inox. Il est
dessiné par-dessus la pompe et son Cover, sous l'On overlay. Il sort tout droit de l'End Fitting, fait le tour par le bord intérieur de la case de la pompe,
et va jusqu'à la place, où il finit par une virole TC comme le bout de la pompe ou d'une vanne, et il tourne avec la pompe quand elle est montrée Left. Une pompe avec votre propre image n'a pas de Hose ni de Pipe (Skynet ne
sait pas où sont ses End Fittings), donc ses IP sont simplement sur les places.

**Avec un tuyau ou un flexible joint à l'IP**, ce bout est dessiné comme le tuyau ou le flexible qui y est : même sorte, même
couleur et même épaisseur, donc les deux se rejoignent en une seule pièce. Sans rien sur l'IP, le Hose ou Pipe choisi ici est dessiné.

**Une IP de coin** (Top Left, Top Right, Bottom Left, Bottom Right) peut être atteinte par le côté ou par le haut ou le bas.
Skynet la choisit pour vous : le Hose ou Pipe arrive du même sens que le tuyau ou le flexible joint à cette IP. Sans rien de
joint, il arrive le long du côté, et il tourne pour suivre dès qu'un tuyau ou un flexible est joint. Il n'y a rien à choisir.

**Inlet IP Fitting** et **Outlet IP Fitting** sont l'End Fitting (le raccord) sur les IP In et Out de la pompe, avec sa taille (FPT1/2, TC1.5 ...)
(Règle Skynet 5.40). Une nouvelle pompe commence avec le **Default pipe IP Type** (une pompe enregistrée avec l'ancien choix Ports commence avec lui), et
les deux peuvent être différents. Un bout de tuyau sur la pompe va avec elle de lui-même (un bout MPT1/2 sur un End Fitting FPT1/2). L'End Fitting est
une information seulement, sauf un Quick Disconnect, où un bout de flexible peut être décroché et déplacé.

## Tuyaux sur une pompe {#pipes-on-a-pump}

Quand vous choisissez une autre place, un tuyau joint à l'entrée ou à la sortie reste où il est : la pompe se déplace sur sa ligne, et le bout du tuyau
glisse pour rejoindre la nouvelle place. La même chose arrive quand un Tab avec une ancienne pompe s'affiche.

## Toujours dessinées à l'échelle {#still-drawn-to-scale}

Les dessins de pompes de brassage (March, Chugger, Blichmann Riptide, Topsflo, KegLand) sont tous à la même échelle : 1 pouce vaut 20 dans la case de 300 x 300,
ou 10 sur une pompe de 150 x 150. Une pompe commence à **150 x 150** sur un Tab. Si vous la redimensionnez, les places grandissent ou rétrécissent avec sa case, donc
deux pompes de la **même taille** ont toujours leurs IP au même endroit. Les Covers s'alignent de la même façon. Les anciennes images en couleur
style Riptide suivent aussi le standard des pompes.

| Où finit l'End Fitting propre de la pompe (Orientation Right) | Dans le dessin de 300 x 300 | Sur une pompe de 150 x 150 |
|----|-----|-----|
| Inlet IP Fitting | 285 en largeur, 150 en hauteur | 142.5 en largeur, 75 en hauteur |
| Outlet IP Fitting | 243 en largeur, 56 en hauteur | 121.5 en largeur, 28 en hauteur |

Le Hose ou le Pipe commence là.

## Remplacer une pompe {#replacing-a-pump}

1. Ouvrez **Edit layout** et notez le **X** et le **Y** de l'ancienne pompe (et sa taille, 150 x 150 au départ).
2. Ajoutez la nouvelle pompe avec la même Orientation, et mettez-la au même X et Y (ou utilisez 🔁 Swap places, Règle 5.37).
3. Son entrée et sa sortie libres vont aux places les plus proches quand les bouts de tuyau la rejoignent. **Save layout**.

## Anciens Schemas {#older-schemas}

La première fois qu'un Schema est ouvert, chaque pompe (et chaque Picture montrant une pompe Skynet) passe à 150 x 150 autour de son milieu, et elle est
remise sur ses tuyaux (Règle 5.23).

La **pompe de puisard** est dans le liquide et aspire par sa grille, elle garde donc sa propre taille et ses deux propres IP.
