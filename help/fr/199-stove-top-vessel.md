# Cuve de cuisinière (Stove Top Vessel) {#stove-top-vessel}

Une **Cuve de cuisinière** (Stove Top Vessel) est une marmite de brassage posée sur la cuisinière ou sur un brûleur. C'est un
Widget avec des IP et sans Devices (règle Skynet 19.7) : rien n'y est relié à une carte. Skynet la dessine pour vous, la
marmite, son rebord et ses deux poignées, à la forme de sa Hauteur et de sa Largeur : une haute marmite et une marmite large et
basse ont toutes les deux le bon air.

## Il y en a deux {#two-of-them}

En **Edit layout**, ouvrez **Add equipment ➕** et choisissez :

| Choix | Ce qu'elle a |
|---|---|
| **Stove Top Vessel** | Aucune sortie. Seulement son haut pour suspendre un tuyau. |
| **Stove Top Vessel, Bottom Outlet** | Son haut pour suspendre un tuyau, et une IP **Bottom Outlet** (sortie du bas) au centre du fond. |

Comme tout nouveau Widget, elle est faite d'abord sur l'onglet 🔨 Build (règle 4.1) ; **✅ Finish Build ... > Move to Tab** la
met sur son onglet.

## Le haut pour suspendre un tuyau {#the-hose-hang-top}

Le **tiers du haut** de la marmite est une seule grande IP. Lâchez le bout d'un **tuyau Quick Disconnect** n'importe où à cet
endroit et le tuyau pend par-dessus le rebord, dans la marmite (Aide 127). Un Process fait la même chose avec
`Hose_1.connect = Stove_Top_Vessel_1` (son Name), puis attend qu'une personne appuie sur **Done** quand le vrai tuyau est dans
la marmite (Aide 142).

## Sa taille {#its-size}

| Case | Ce qu'elle fait |
|---|---|
| **Units** | US (gallons, pouces) ou Metric (litres, cm). |
| **Gallons** (Liters) | Ce qu'elle contient. Une nouvelle commence à **5**. |
| **Height** | La hauteur de la marmite. |
| **Width** | La largeur de la marmite, d'un bord à l'autre. |
| **Calculated Volume** | Ce que contient une marmite de cette Hauteur et de cette Largeur. Lecture seule. |

Avec **la Hauteur et la Largeur** tapées, la marmite est dessinée à sa **vraie taille** et dans sa vraie forme (le Calculated
Volume). Si l'une des deux est vide, elle est dessinée comme une marmite aussi haute que large, à la taille de ses Gallons.
Deux fois plus de gallons, c'est environ 1,26 fois plus large et plus haut, comme pour toutes les Vessels (Aide 135). Le
**Master Vessel Sizer** d'un onglet la dimensionne aussi.

## La sortie du bas {#the-bottom-outlet}

La **Bottom Outlet** est une IP au centre du fond : reliez-y un tuyau rigide ou souple comme à toute IP. Son **Bottom Outlet IP
Type** est le raccord qui s'y trouve, comme au bout d'un tuyau (Aide 24) : **Tri-Clamp**, **NPT**, **BSP** ou **Quick
Disconnect**. Il commence au **Default pipe IP Type** de l'onglet Default. Il est dessiné selon son type, sous la marmite, et il
a la taille du tuyau qui y est relié.

## Le côté technique {#the-technical-side}

- Son Name n'a pas d'espaces : `Stove_Top_Vessel_1`, `Stove_Top_Vessel_Bottom_Outlet_1`. Un Process l'utilise après
  `.connect =`.
- Sa Hauteur est enregistrée sous `vheight` et sa Largeur sous `diameter` (la largeur d'une marmite ronde est son diamètre),
  comme pour une Vessel dessinée par son Diameter (règle 19.2). Son Bottom Outlet IP Type est enregistré sous `ipTypeOut` :
  `tc`, `npt`, `bsp` ou `qd`.
- **Graphic :** laissez-le vide et Skynet la dessine. Choisissez une image à vous et c'est cette image qui sert.
