# Bac d'eau glacée {#ice-water-can}

Un **Ice Water Can** est une grande poubelle (ou un bac, ou une glacière) remplie de glace et d'eau. Beaucoup de brasseurs pompent cette
eau froide à travers leur refroidisseur (chiller) et la laissent revenir dans le bac, pour que la même eau tourne en boucle. C'est un
Widget sans Devices et sans IP à lui (Règle Skynet 19.8) : rien n'y est câblé à une carte. Skynet le dessine pour vous, le bac, son
bord, ses poignées, l'eau et la glace, à la forme de son cadre.

## En ajouter un {#add-one}

En **Edit layout**, ouvrez **Add equipment ➕** et choisissez **Ice Water Can**. Comme chaque nouveau Widget, il est fait d'abord sur le
🔨 Build Tab (Règle 4.1) ; **✅ Finish Build ... > Move to Tab** le met sur son Tab. Son Label commence à **Ice Water**. Tirez son coin
pour le rendre plus haut ou plus large.

## La boucle d'eau glacée {#the-ice-water-loop}

La boucle la plus simple : une pompe de puisard (sump pump) est posée dans le bac, son flexible va au chiller, et un second flexible
revient du chiller dans le bac. Sur le Tab :

1. Ajoutez l'**Ice Water Can**.
2. Ajoutez une **Sump Pump by hand** (Select Widget Type > Semi_Widgets_Devices, aide 162) et tirez-la **dans le bac**, en bas.
   Son entrée est sa crépine, posée dans l'eau, donc rien n'est raccordé à son entrée.
3. Tracez un flexible de la sortie de la pompe au Water In du chiller.
4. Tracez un **flexible Quick Disconnect** depuis le Water Out du chiller et posez son bout dans le **tiers du haut** du bac. Il
   pend par-dessus le bord, dans l'eau (aide 127).
5. Branchez la pompe, cliquez dessus sur le Tab et confirmez. Les flexibles montrent l'eau froide qui circule, en **Blue** (bleu).

## Exemple : la boucle à deux chillers d'OakBarn Brewery {#example-the-oakbarn-brewery-two-chiller-loop}

OakBarn Brewery utilise **deux refroidisseurs à plaques** (Plate Chillers), et cela refroidit le moût très vite :

- **Plate Chiller 1** (le pré-refroidisseur) : l'eau glacée du bac passe d'un côté et retourne dans le bac. L'**eau du robinet**
  passe de l'autre côté et en sort froide.
- **Plate Chiller 2** (le refroidisseur de moût) : cette eau du robinet froide passe d'un côté, et le **moût** passe de l'autre.
- L'eau du robinet qui sort du Plate Chiller 2 est de l'**eau perdue**. Elle sert à arroser la pelouse.

Sur le Tab :

1. Tracez la boucle d'eau glacée ci-dessus, par le Water In et le Water Out du **Plate Chiller 1**.
2. Ajoutez une **Tap Water Valve** (aide 31) et tracez un flexible de celle-ci à l'autre côté du **Plate Chiller 1** (Wort In). Chaque
   côté d'un refroidisseur à plaques est son propre chemin et ne se mélange jamais avec l'autre (Règle 5.41), donc peu importe que ce
   côté s'appelle Wort.
3. Tracez un flexible du Wort Out du **Plate Chiller 1** au Water In du **Plate Chiller 2**.
4. Placez un **IP** simple là où l'eau perdue sort (Select Widget Type > IPs, couplings and caps), donnez-lui le Label **Lawn**, et
   tracez un flexible du Water Out du **Plate Chiller 2** jusqu'à lui. Chaque bout de flexible est posé sur un IP.
5. Raccordez le moût par le Wort In et le Wort Out du **Plate Chiller 2** comme d'habitude, depuis la pompe de votre cuve.

Ouvrez la Tap Water Valve et mettez la pompe de puisard en marche : les deux circuits d'eau s'affichent en **Blue**, l'eau glacée qui
tourne et l'eau du robinet qui part vers la pelouse.

## Sa couleur {#its-color}

L'eau qui vient du bac prend la **Out flow color** du bac. Elle commence à **Blue**, parce que l'eau est froide. Changez-la dans ses
Properties si vous voulez (aide 116).

## Le côté technique {#the-technical-side}

- Son nom n'a pas d'espaces : `Ice_Water_Can_1`. Un Process met un flexible dans son haut avec `Hose_1.connect = Ice_Water_Can_1`,
  puis attend que quelqu'un appuie sur **Done** (aide 142).
- Une pompe en marche dont l'entrée est dans un Ice Water Can, sans rien de raccordé à cette entrée, pompe dans le bac. Son débit prend
  la Out flow color du bac (Règle 5.21).
- **Graphic :** laissez-le vide et Skynet le dessine. Choisissez une image à vous et c'est elle qui est utilisée.
