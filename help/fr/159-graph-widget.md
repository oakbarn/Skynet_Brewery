# Widget Graph {#graph-widget}

Un **Graph Widget** dessine un **graphique en ligne dans le temps** sur un Tab, par exemple la température de votre fermenteur sur les 5 derniers jours, ou la
densité d'un iSpindel sur 2 semaines (Règle Skynet 1.26). Il s'appelait autrefois le Chart Widget.
Chaque Graph dessine jusqu'à **deux** Devices ou Widgets :

- Le **Channel 1** utilise l'axe de **gauche**.
- Le **Channel 2** utilise l'axe de **droite**, donc une température et une densité peuvent partager un Graph.

Les lignes viennent des lectures gardées dans la **base de données de brassage** (voir [Database and API](98-database-and-api)). Un Device ou Widget
doit être **envoyé à la base de données** (sa case **Database**, par exemple Every 1 minute), sinon sa ligne reste vide, et le Graph le dit.

## En ajouter un {#add-one}

**Edit layout > Add Widget > On-screen controls > Graph (a line graph of recorded readings)**. Il commence à 610 x 190 pixels avec un
Span d'1 heure. Double-cliquez dessus pour ses Properties.

## Ses Properties {#its-properties}

| Properties | Ce qu'elle fait | Attribut de Process |
|---|---|---|
| **1. Label** | Le titre au-dessus du graphique (jamais vide) | `.label` |
| **Channel 1 (left axis)** | Le Device ou Widget dessiné. Le ⬢ à côté : **Auto scale** (l'axe s'ajuste aux lectures), **Axis lowest** et **Axis highest** (quand Auto scale est désactivé), **Line color**, **Axis color** | `.ch1element`, `.ch1autoscale`, `.ch1ymin`, `.ch1ymax`, `.ch1linecolor`, `.ch1axiscolor` |
| **Channel 2 (right axis)** | La même chose pour la seconde ligne | `.ch2element` ... `.ch2axiscolor` |
| **Span (seconds)** | Jusqu'où le graphique remonte : 3600 = 1 heure, 86400 = 1 jour, 432000 = 5 jours. Le ⬢ à côté : **Grid lines across** (lignes horizontales), **Grid lines up and down** (lignes verticales, 0 = aucune) et la **Time axis color** | `.spanseconds`, `.hgridlines`, `.vgridlines`, `.xaxiscolor` |
| **Refresh interval (seconds)** | À quelle fréquence le graphique est redessiné avec les lectures les plus récentes | `.refreshinterval` |

Comme tout Widget, il a aussi un Tab, X, Y, Width, Height, Visible, Hidden Locked et Lock.

Un Process peut changer un Graph pendant qu'il tourne, par exemple :

```
wgt_GPH_Conical_CT.spanseconds = 86400
wgt_GPH_Conical_CT.ch1element = "BS_62_AI_S_Ferm~Temp_CT"
wgt_GPH_Conical_CT.ch1linecolor = "#00B050"
```

(Ici le graphique montre 1 jour, dessine la température du fermenteur et la trace en vert.) Un Graph créé avant le nouveau nom garde son ancien nom (`wgt_CHT_...`) et marche de même ; les noms déjà créés ne changent jamais
d'eux-mêmes (Règle 3.5).
