# Refroidisseur à contre-courant en cuivre {#copper-counterflow-chiller}

Le **Skynet Copper Counterflow Chiller** est un Widget de refroidisseur fait à partir du dessin Copper_CounterFlow. C'est un serpentin en cuivre : le moût passe dans le tube intérieur et l'eau froide dans le tube extérieur, dans le sens inverse, et les deux ne se mélangent jamais.

## Ses 4 IP {#its-4-ips}

Le refroidisseur vient avec **4 IP intégrés**, un au bout de chaque vrai orifice de l'image. Chaque orifice est tourné vers la gauche, donc un tuyau se joint à chacun **à l'horizontale** (les tuyaux vont seulement à l'horizontale, à la verticale ou à 45°).

| Orifice | Où il est sur l'image | Côté |
|---|---|---|
| **Wort In** | En haut, le bout qui passe tout droit dans le té du haut | Moût |
| **Water Out** | En haut, la courte branche du té du haut | Eau |
| **Water In** | En bas, la courte branche du té du bas | Eau |
| **Wort Out** | En bas, le bout qui passe tout droit dans le té du bas | Moût |

Le moût chaud entre en haut et sort froid en bas ; l'eau du robinet entre en bas et repart tiède en haut. Le passage ne va que de Wort In à Wort Out et de Water In à Water Out.

Tracez un tuyau vers un IP et son bout s'accroche (accrochage des IP, 10 px). Les IP restent sur les bouts des orifices quand vous déplacez, redimensionnez, retournez ou tournez le refroidisseur.

## En ajouter un {#adding-one}

1. Ouvrez le **🔨 Build Tab** (les nouveaux Widgets y sont faits d'abord).
2. ☰ Menu > **Equipment Templates**, choisissez **Copper_Counterflow_Chiller** et mettez-en une copie sur le Build Tab (ou **Add equipment ➕** dans la barre Edit layout).
3. Raccordez-le, puis **Save Build** pour l'envoyer vers son Tab.

C'est un Template Skynet : son image et la place de ses orifices sont fixées. Son Type est **Plate chiller, Counterflow** avec des orifices **MPT 1/2"**, comme les autres refroidisseurs à contre-courant.

L'image est `Images/Skynet/Chillers/Chiller_Copper_Counterflow.svg`, redessinée en SVG simple (les images Skynet sont seulement en SVG).
