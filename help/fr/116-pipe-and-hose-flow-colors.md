# Couleurs du passage dans les tuyaux et flexibles {#pipe-and-hose-flow-colors}

Quand du liquide circule dans un tuyau ou un flexible, le passage est dessiné en couleur. Skynet choisit cette couleur pour vous, d'après le
Tab, le tuyau, la cuve d'où vient le passage, ou une Tap Water Valve.

## Faire un tuyau ou un flexible {#making-a-pipe-or-hose}

Un tuyau ou un flexible est un Widget, mais il **n'est pas dans la liste des Widgets**. Le seul moyen d'en faire un est **Draw pipe** ou **Draw hose**
dans la barre Edit layout, directement sur le Tab où il va (pas d'abord sur le Build Tab).

## D'où vient la couleur {#where-the-color-comes-from}

La première qui convient l'emporte :

1. **Une Tap Water Valve**, avant tout. Le passage d'une Tap Water Valve ouverte est toujours **bleu**, quoi qu'il soit réglé d'autre.
2. **La Flow Color d'un IP.** Le passage qui part d'un IP dont la **Flow Color** n'est pas None prend cette couleur. Exemple :
   réglez l'IP de la sortie de votre HLT sur Red, et le passage qui en sort est rouge, à travers la pompe et jusqu'où il va.
3. **L'Out flow color d'une cuve.** Le passage qui part d'une cuve dont l'**Out flow color** n'est pas None prend cette couleur. Exemple : réglez l'Out flow color de votre HLT sur Red, et chaque fois qu'un passage part de la sortie du HLT, il est rouge,
   à travers la pompe et jusqu'où il va.
4. **La Flow Color du Tab**, quand elle est **Tap**, **Strike**, une couleur simple ou RGB : chaque tuyau et flexible du Tab la prend.
5. **La propre Flow Color du tuyau**, quand elle n'est pas None.
6. **La Flow Color du Tab**, quand elle est **Mash**, **Boil**, **Whirlpool** ou **Ferment** (un tuyau avec sa propre Flow Color
   garde la sienne).
7. Tout à None : le passage bleu clair standard.

**None est la valeur par défaut** pour chaque tuyau, flexible, IP, Tab et cuve.

Un tuyau ou un flexible avec Flow Color None suit la Flow Color du Tab. Les tuyaux des Schemas exemples étaient orange ;
ils sont maintenant à None (changés une fois dans chaque Schema), choisissez donc à nouveau une couleur sur tout tuyau que vous voulez faire ressortir.

## Les choix de couleur {#the-color-choices}

| Choix | Couleur |
|---|---|
| None | (rien de réglé) |
| Tap | Bleu |
| Strike | Rouge |
| Mash | Brun |
| Boil | Brun rougeâtre |
| Whirlpool | Brun |
| Ferment | Doré |
| Red, Yellow, Blue, Green | les couleurs primaires |
| Brown, Orange, Purple, Reddish Brown, Golden | |
| RGB | une couleur à vous, choisie avec le sélecteur de couleur (aide 187) |

## La régler {#setting-it}

- **Tab** : Edit layout > **Tab settings** > **Flow Color**.
- **Tuyau ou flexible** : double-cliquez dessus > **Flow Color**.
- **IP** : double-cliquez sur l'IP en Edit layout > **Flow Color**.
- **Cuve** : double-cliquez sur une bouilloire, un HLT, une cuve d'empâtage ou un fermenteur > **Out flow** > **Out flow color**.

## Dans un Process {#in-a-process}

```
tab.flow_Color = Mash
Pipe_3.flow_Color = Orange
IP_2.flow_Color = Red
Hose_1.flow_Color = "RGB 160 69 42"
tab.flow_Color = None
```

- **`tab`** veut dire le Tab qui a le focus : le Tab que montre chaque écran. Tant qu'un Process l'a réglé, il l'emporte sur la Flow Color
  des Tab settings. `tab.flow_Color = None` rend la main aux Tab settings.
- **`Pipe_N.flow_Color`** (ou `Hose_N.flow_Color`) règle un seul tuyau ou flexible. `.flow` veut dire la même chose.
- **`IP_N.flow_Color`** règle la Flow Color d'un point IP (pas celle d'un raccord).
- Une couleur peut s'écrire simplement (`Mash`, `Reddish_Brown`) ou entre guillemets (`"Reddish Brown"`, `"#a0452a"`, `"RGB 160 69 42"`).
- Un Process peut aussi les lire : `if tab.flow_Color == "Mash"`.
- Ce qu'un Process règle dure jusqu'à ce qu'il soit remis à None, qu'un autre Schema soit chargé, ou que le panel redémarre.
- **La Flow Color est le seul attribut de Process d'un tuyau ou d'un flexible.**

## Label, Name, position et taille {#label-name-position-and-size}

Un tuyau ou un flexible a un **Label** comme tout autre Widget : double-cliquez dessus, tapez le Label et activez **Show label**, et il s'affiche
au milieu du tuyau. Son **Name** est donné par Skynet (Pipe_1, Hose_1 ...) et c'est ce qu'utilise un Process.

Un tuyau n'a **pas de cases de position ni de taille** : il est là où vous l'avez tracé, donc X, Y, Width et Height sont cachés. Déplacez ou étirez un tuyau sur
le Tab en Edit layout, comme avant.
