# Tés à sonde et doigts de gant sur les tuyaux {#probe-tees-and-thermowells-on-pipes}

Les tés avec une sonde de température et les doigts de gant sont des **Devices de température** avec des **IP**, donc les tuyaux et les flexibles s'y joignent comme à tout
raccord (Règle Skynet 5.30).

## Tés avec une sonde de température {#tees-with-a-temperature-probe}

L'**Instrument Tee** et le **Long Tee** avec une sonde (dans la branche, ou entrant par le bout) ont la **même taille que le Tee et l'Instrument Tee
des TC Pipe Fittings**, et leurs IP sont aux **mêmes places** : le milieu de chaque face de virole ouverte. La sonde remplit une ouverture,
donc un té à sonde a deux IP. Vous pouvez mettre un té à sonde là où était un té et il s'aligne.

Dans ses Properties : **Flip Horizontal**, **Flip Vertical** et **Rotate** (0, 90, 180, 270). L'image et ses IP suivent.

### En lâcher un sur un tuyau {#dropping-one-on-a-pipe}

En **Edit layout**, faites glisser un té à sonde (sans tuyau dessus pour l'instant) sur un tuyau droit et lâchez :

- **Sonde dans la branche :** ses deux bouts ouverts vont le long du tuyau (il tourne s'il était en travers du tuyau), et le tuyau est **coupé en deux**,
  un morceau à chaque bout. C'est pareil qu'un Tee normal (Règle 5.25).
- **Sonde entrant par le bout :** son bout ouvert va sur le tuyau, et sa branche est reliée au reste du tuyau en contournant avec des **coudes à 90
  degrés**, comme pour une pompe.
- Lâché sur un **bout ouvert** d'un tuyau, le tuyau est **raccourci** et joint à lui.
- Il prend ensuite la **taille du tuyau**, comme un TC Pipe Fitting.

## Tés sur les flexibles {#tees-on-hoses}

Un **Tee**, un **Instrument Tee** ou une **Cross** (TC Pipe Fittings), ou un **té à sonde**, lâché sur un **flexible** coupe le flexible. Un flexible
se courbe, donc le té reste là où vous l'avez lâché et chaque morceau de flexible va à un bout du passage droit du té. Un **flexible Quick Disconnect** et un
flexible verrouillé 🔒 ne sont jamais coupés. Les pompes et les vannes ne coupent pas les flexibles.

## Doigts de gant {#thermowells}

Un **Thermowell** (doigt de gant) a **un seul IP**, sur la face de son bouchon TC (le bout qui se serre avec le collier). Rien ne le traverse : il remplit l'ouverture où il
est. Il peut faire **Rotate** et **Flip** comme un té à sonde.

En **Edit layout**, lâchez un doigt de gant avec son bouchon près d'un autre IP (à moins de 30 px), comme la **branche d'un té** ou un **orifice de cuve**,
et il **s'accroche** : son IP se pose sur cet IP.

### Sur un IP de face {#on-a-front-facing-ip}

Un **IP de face** est une ouverture que vous regardez droit dedans : un orifice sur le **devant d'une cuve**, ou l'ouverture d'une vanne ou d'un coude en **vue de face**.
Un doigt de gant lâché là se montre **de face** : le bouchon TC rond avec la sonde (violette) au milieu. Faites-le glisser ailleurs
et il se montre de nouveau de côté.

Une **simple sonde de température** lâchée avec son milieu sur un IP de face y a aussi un doigt de gant, elle se change donc en
**doigt de gant vu de face**. Faites-la glisser ailleurs et elle redevient la simple sonde qu'elle était.
