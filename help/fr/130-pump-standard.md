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

Choisissez lequel est son entrée (IN) et lequel sa sortie (OUT), vu sur le Tab, dans la fenêtre Add ou les Properties de la pompe :

- **Inlet IP** et **Outlet IP** (sur une ligne). Le premier choix de chaque liste, marqué **(start)**, est là où il commence : une pompe Skynet
  commence avec son entrée **au milieu à droite** et sa sortie **en haut à droite** ; avec l'Orientation **Left**, c'est **au milieu à
  gauche** et **en haut à gauche**. Une pompe avec votre propre image commence au milieu de ses côtés gauche et droit.
- Les deux ne sont jamais à la même place, donc on voit toujours clairement lequel est In et lequel est Out, même quand les deux sont du même côté.
- Exemple : la pompe de l'exemple 3 Vessel 1 Pump (montrée Left) a son entrée au milieu à gauche et sa sortie en haut à gauche.

## Hose ou Pipe {#hose-or-pipe}

Ce qui est dessiné entre les propres entrée et sortie de la pompe et son Inlet IP et son Outlet IP : un **Hose** (flexible) blanc, ou un **Pipe** (tuyau) inox. Il est
dessiné par-dessus la pompe et son Cover, sous l'On overlay. Il sort tout droit de l'orifice, fait le tour par le bord intérieur de la case de la pompe,
et va jusqu'à la place, et il tourne avec la pompe quand elle est montrée Left. Une pompe avec votre propre image n'a pas de Hose ni de Pipe (Skynet ne
sait pas où sont ses orifices), donc ses IP sont simplement sur les places.

## Tuyaux sur une pompe {#pipes-on-a-pump}

Quand vous choisissez une autre place, un tuyau joint à l'entrée ou à la sortie reste où il est : la pompe se déplace sur sa ligne, et le bout du tuyau
glisse pour rejoindre la nouvelle place. La même chose arrive quand un Tab avec une ancienne pompe s'affiche.

## Toujours dessinées à l'échelle {#still-drawn-to-scale}

Les dessins de pompes de brassage (March, Chugger, Blichmann Riptide, Topsflo, KegLand) sont tous à la même échelle : 1 pouce vaut 20 dans la case de 300 x 300,
ou 10 sur une pompe de 150 x 150. Une pompe commence à **150 x 150** sur un Tab. Si vous la redimensionnez, les places grandissent ou rétrécissent avec sa case, donc
deux pompes de la **même taille** ont toujours leurs IP au même endroit. Les Covers s'alignent de la même façon. Les anciennes images en couleur
style Riptide suivent aussi le standard des pompes.

| Où finit l'orifice propre de la pompe (Orientation Right) | Dans le dessin de 300 x 300 | Sur une pompe de 150 x 150 |
|----|-----|-----|
| Orifice d'entrée | 285 en largeur, 150 en hauteur | 142.5 en largeur, 75 en hauteur |
| Orifice de sortie | 243 en largeur, 56 en hauteur | 121.5 en largeur, 28 en hauteur |

Le Hose ou le Pipe commence là.

## Remplacer une pompe {#replacing-a-pump}

1. Ouvrez **Edit layout** et notez le **X**, le **Y**, l'**Inlet IP** et l'**Outlet IP** de l'ancienne pompe (et sa taille, 150 x 150 au départ).
2. Ajoutez la nouvelle pompe avec la même Orientation, le même Inlet IP et le même Outlet IP, et mettez-la au même X et Y (ou supprimez d'abord l'ancienne).
3. Son entrée et sa sortie tombent sur les mêmes bouts de tuyau. **Save layout**.

## Anciens Schemas {#older-schemas}

La première fois qu'un Schema est ouvert, chaque pompe (et chaque Picture montrant une pompe Skynet) passe à 150 x 150 autour de son milieu, et elle est
remise sur ses tuyaux (Règle 5.23).

La **pompe de puisard** est dans le liquide et aspire par sa grille, elle garde donc sa propre taille et ses deux propres IP.
