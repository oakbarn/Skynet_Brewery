# L'ordre des Processes (Process Order) {#process-order}

Chaque Process de la liste de la page **Processes** a un numéro d'**Order** dans une petite case devant son nom. Le numéro fixe la place du Process dans la liste, pour que vous puissiez mettre en haut ceux que vous utilisez le plus.

## Déplacer un Process {#moving-a-process}

1. Cliquez dans la case Order du Process que vous voulez déplacer.
2. Tapez la place voulue, par exemple **1** pour le haut.
3. Appuyez sur **Entrée** (ou cliquez ailleurs).

Le Process s'y déplace, et **les autres Processes sont renumérotés tout seuls** (1, 2, 3 ...), donc il n'y en a jamais deux avec le même numéro ni de trou. Taper un nombre plus grand que la liste le met en dernier ; taper 0 le met en premier.

## Bon à savoir {#good-to-know}

- Chaque groupe de la liste (Flow, Sub, Repeat, Looper) compte de son côté, en commençant à 1.
- Un nouveau Process va à la fin de son groupe.
- **Rename** garde sa place. **Delete** referme le trou. Un Process ramené de la Recycle Bin va à la fin.
- Changer la classe d'un Process le déplace à la fin de son nouveau groupe.
- L'Order ne fait que trier la liste. Il ne change ni le moment où un Process tourne ni ses numéros d'étape.
- Tout le monde voit le même ordre. Seul un Admin peut le changer.
- Les numéros sont gardés sur le Brain dans `config/brewery.json` sous `processOrder`.

Voir [Processes](05-scripts).
