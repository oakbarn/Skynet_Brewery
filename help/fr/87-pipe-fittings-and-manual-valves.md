# Raccords de tuyauterie et vannes manuelles {#pipe-fittings-and-manual-valves}

Les raccords de tuyauterie restent simples, et une vanne manuelle est un Widget à part. Cela marche de la même façon sur le 🔨 Build Tab et sur chaque Tab.

## Raccords de tuyauterie {#pipe-fittings}

Un **té n'est qu'un té**, un coude seulement un coude, une réduction seulement une réduction. Cela concerne les raccords de **Elbows, Tees …** dans la barre Edit layout (té, coude à 90° et 45°, croix, pièce droite, manchon, bouchon) et les raccords de tuyauterie Skynet faits à partir d'un Template (Tee, Instrument_Tee, Elbow_90, Elbow_45, U_Bend, Reducer, End_Cap, Check_Valve).

Un raccord de tuyauterie n'a pas d'autres réglages que :

| Réglage | Ce qu'il fait |
|---|---|
| **Autosize to pipe** | Toujours activé, sans interrupteur : le raccord prend la taille des tuyaux joints à ses IP, son corps est donc aussi épais que la plupart des tuyaux dessus (en cas d'égalité, il prend le plus gros). Sa **Width et Height** sont données par ses tuyaux. Un raccord Skynet sans tuyau dessus prend la **Default pipe size** (☰ Menu > Default settings, [aide 155](155-default-settings)). |
| **X, Y** | Où il est, en pixels depuis la gauche et depuis le haut (`.x_hPosition`, `.y_vPosition`). |
| **Width, Height** | Sa taille. Donnée par ses tuyaux (Autosize to pipe). |
| 🔒 Lock | Le verrouille en place, comme pour chaque élément. |

- Il n'a **pas de label**, **pas de Type** et **pas de Connection Standard**. Son nom Skynet (Tee_1, Elbow_1, bndl1_Tee_BH ...) s'affiche dans ses Properties et quand vous tenez la souris dessus.
- **Tournez-le ou retournez-le avec les boutons pour tourner** de la barre Edit layout (ils s'affichent quand il est choisi). Ils ne sont plus dans ses Properties.
- **Les raccords de tuyauterie n'ont pas de Clone** : ni sur le Tab, ni dans la fenêtre Template d'un Template de raccord Skynet. Ajoutez-en un autre à la place.
- Un **End Cap** a aussi **Autosize to pipe** : sur une ouverture d'un raccord, il prend la taille de la virole de ce raccord. Sur une réduction, un Valve Tee ou un Supply Manifold, ou une ouverture de cuve, il garde sa taille.
- **Tout prend la taille de ses tuyaux quand vous enregistrez** (Règle Skynet 5.36) : appuyer sur **Save layout**, ou sur 💾 Save dans les Properties d'un raccord ou d'un tuyau, donne à chaque raccord de chaque Tab la taille qu'ont **la plupart des tuyaux et flexibles qui y sont joints**. En cas d'égalité (un de 1" et un de 1/2"), il prend le plus gros. Passez une ligne de tuyaux à 1" et enregistrez, et ses coudes et tés grandissent à 1". C'est pareil pour les **Valve Tees et Supply Manifolds**, les **tés avec une sonde de température**, les **vannes** et les **débitmètres**, qui suivent aussi leurs tuyaux. Les **pompes** suivent aussi leurs tuyaux (depuis le 2026-11-07). Ce qui n'a pas de tuyau prend la **Default pipe size** réglée dans ☰ Menu > Default settings ([aide 155](155-default-settings)) ; un raccord sur une ouverture de cuve sans tuyau garde sa taille.
- Un **clapet anti-retour** est aussi un raccord de tuyauterie : le passage ne va que dans un sens, et son orientation (la flèche sur son image) montre lequel. Tournez-le ou retournez-le pour orienter la flèche.
- Une vanne ou un débitmètre dans un raccord est un **Device**, et un té avec doigt de gant (ou un doigt de gant sur un IP de cuve) est une sorte de **Temperature Probe**, ils gardent donc leurs propres réglages pour l'instant : voir [Raccords Skynet](60-skynet-fittings).

## Le Widget Manual Valve {#the-manual-valve-widget}

Une **Manual Valve** (vanne manuelle) est un Widget spécial : un raccord qu'on tourne à la main, et un pseudo-Device. Ajoutez-en une avec **Manual Valve ➕** dans la barre Edit layout. Skynet la nomme **ManualValve_1**, ManualValve_2 ...

- Son **.state** est vrai (ouverte) ou faux (fermée). Une vanne manuelle fermée arrête le passage dans les tuyaux qui y sont ; une vanne ouverte le laisse passer dans le sens où il allait.
- **Un clic dessus sur son Tab l'ouvre ou la ferme, à tout moment.** C'est la seule façon dont son .state change. Les Operators et les Admins peuvent cliquer dessus ; les Viewers non. Chaque écran montre le changement.
- C'est un **Confirmation Widget** (2026-11-08, Règle Skynet 1.28, [Widgets de confirmation](162-confirmation-widgets)) : son interrupteur **.confirmation** dans ses Properties est activé. Un clic affiche une fenêtre, **✋ OPEN Kettle drain by hand, then press Done** (ouvrez la vidange de la bouilloire à la main, puis appuyez sur Done) : ouvrez la vraie vanne, puis appuyez sur **Done**, et seulement alors elle se montre ouverte. **Cancel** la laisse comme elle était. Désactivez .confirmation et un clic l'ouvre ou la ferme tout de suite.
- Tant qu'elle est ouverte, la **superposition ouverte** (Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg, un anneau vert et une coche) est dessinée par-dessus.
- Elle a **deux IP**, un à chaque bout de tuyau, donc un tuyau se joint de chaque côté (Règle Skynet 5.24, aide 123).
- Ses Properties : une note avec son nom et son état, **Label** (utilisé dans le message « à la main ») et **Show label**, **.confirmation**, puis **X**, **Y**, **Width**, **Height** et 🔒 Lock.

### Une vanne manuelle dans un Process {#a-manual-valve-in-a-process}

```
ManualValve_1.state = true
ManualValve_1 = false
```

Une ligne de Process comme celle-ci **n'ouvre ni ne ferme la vanne** toute seule. Avec **.confirmation** activé (comme au départ), elle affiche une fenêtre sur chaque écran : **✋ OPEN Kettle drain by hand**, avec **Done: it is open**. Le Process attend ; ouvrez la vanne, appuyez sur Done, et la vanne se montre ouverte et le Process continue. (Un clic sur la vanne sur son Tab, avec son propre Done, fait la même chose.)

Avec .confirmation désactivé, elle affiche une barre en haut de chaque écran : **✋ OPEN Kettle drain by hand, then click it on the Brew Tab to confirm** (puis cliquez dessus sur le Tab de brassage pour confirmer), et la vanne clignote sur son Tab. Le Process attend. Tournez la vraie vanne, puis cliquez sur la vanne manuelle sur le Tab : une fois qu'elle se montre ouverte, le Process continue avec la ligne suivante. Si elle montre déjà ce que le Process demande, rien n'est demandé.

- **Go to Brew** sur la barre vous emmène au Tab de la vanne.
- Arrêter le Process retire la barre.
- Un Process peut la lire : `if ManualValve_1 == true`.

L'ancien **Valve type Manual** sur un Device de vanne marche toujours comme avant (fenêtre et **Done**) : voir [Vannes manuelles](29-manual-valves). Il a aussi l'interrupteur **.confirmation** (activé) : un clic dessus demande Done de la même façon.

## Le Widget Manual Pump {#the-manual-pump-widget}

Une **Manual Pump** (pompe manuelle, 2026-11-08, Règle Skynet 5.15a) est une pompe branchée sur une prise murale, que vous allumez à la main : aucune Interface ni aucun Port ne la commande. Ajoutez-en une depuis **Select Device Type > Pumps** ou **Select Widget Type > Semi_Widgets_Devices**, puis choisissez la pompe dans la même liste que **Add Pump** (ou la pompe de puisard). Elle a l'aspect d'un Device Pump et se joint aux tuyaux comme lui (le même dessin, les IP d'entrée et de sortie, Cover et Overlay). Son nom est **wgt_MP_** + Label + ID du Tab, par exemple `wgt_MP_Pump~1_BH`.

C'est aussi un Confirmation Widget : un clic dessus, ou une ligne de Process comme `wgt_MP_Pump~1_BH.state = true`, affiche **✋ TURN ON Pump 1 by hand, then press Done** (allumez la pompe 1 à la main, puis appuyez sur Done). Allumez la pompe, appuyez sur **Done**, et elle se montre ON (un Process attend jusque-là).
