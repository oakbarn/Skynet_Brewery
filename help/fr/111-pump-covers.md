# Capots de pompe {#pump-covers}

Un dessin de pompe Skynet sans capot (voir Brew Pump Pictures) peut porter un **capot**. La pompe est dessinée en couches, de bas en haut :

1. l'**image de la pompe** (Picture when off),
2. la **Cover overlay** (superposition du capot),
3. l'**On overlay** (seulement tant que la pompe est en marche).

Le capot a un fond transparent, donc la tête de pompe, les orifices et le socle se voient toujours. Il est là en marche comme à l'arrêt.

## Choisir un capot {#picking-a-cover}

Dans les Properties de la pompe, **Cover overlay** vient juste après l'image :

- **None** (par défaut) : pas de capot.
- **Red, Yellow, Blue, Green, Purple, Orange, White** (White est RGB 250 250 250) : les couleurs de capot Skynet.
- **User Add** : le même capot dans une couleur à vous. Le sélecteur de couleur s'ouvre et la ligne **Color (RGB)** s'affiche juste
  sous le Cover (aide 187) ; double-cliquez dessus pour changer la couleur plus tard. **◀ Back** remet le Cover sur None.

Il y a **un capot pour chaque couleur, et chaque capot va sur chaque pompe Skynet**. Skynet garde une forme de capot pour
chaque dessin de pompe et la remplit avec la couleur que vous choisissez, donc changer la couleur ou la pompe ne demande jamais une nouvelle image.

Les capots ne sont dessinés que sur les dessins de pompes Skynet sans capot (March 809 et 815, Chugger, Riptide, Topsflo TD5, KegLand MKII). Sur toute autre image de pompe, le réglage ne fait rien. Flip Horizontal et Flip Vertical tournent le capot avec l'image.

## Dans un Process {#in-a-process}

- `Pump_Wort.cover = "Blue"` met le capot bleu. Les choix sont None, Red, Yellow, Blue, Green, Purple, Orange, White et User (majuscules ou minuscules).
- `Pump_Wort.cover = "User"` et `Pump_Wort.coverColor = "#20b2aa"` (ou un nom de couleur comme `"Teal"`) mettent un capot dans votre propre couleur.
- `Pump_Wort.cover = "None"` l'enlève. Seules les pompes ont `.cover` et `.coverColor`.
