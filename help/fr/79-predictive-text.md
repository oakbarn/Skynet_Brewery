# Texte prédictif dans l'éditeur de Process {#predictive-text-in-the-process-editor}

L'éditeur de Process vous aide à écrire un Process en proposant ce qui peut venir ensuite, comme le clavier d'un téléphone. Vous pouvez toujours tout taper à la main ; la liste n'est là que pour aider. Un débutant peut écrire tout un Process rien qu'en choisissant dans la liste.

## L'activer et le désactiver {#turning-it-on-and-off}

L'interrupteur **Predictive text** est sur la ligne d'outils de l'éditeur, à côté de **Colors**. Il est activé au début. Désactivé, aucune liste ne s'ouvre toute seule pendant que vous tapez, mais **Ctrl+Espace** et **💡 Suggest** ouvrent toujours la liste quand vous la demandez. L'interrupteur ne vaut que pour vous sur cet ordinateur ou ce téléphone ; les autres gardent leur propre choix.

## Pendant que vous tapez {#while-you-type}

Dès que vous tapez une lettre, une liste s'ouvre sous le curseur avec ce qui convient :

- Au **début d'une ligne** : les commandes d'abord (`if`, `wait`, `start`, `new value` ...), chacune avec une petite note sur ce qu'elle fait, puis les noms que vous avez déjà utilisés plus haut dans ce Process.
- **Partout ailleurs** : les noms de vos variables, minuteries, gGlobals, Devices, Widgets et Processes.
- Chaque lettre que vous tapez **réduit la liste** : `vV_` montre chaque nom qui commence par `vV_`, `vV_A` seulement ceux qui commencent par `vV_A`. Dans un `if`, la liste ne contient que ce qu'un `if` peut prendre, donc les commandes n'y apparaissent jamais. Chaque sorte (variables, minuteries, gGlobals, Devices, Widgets) est listée de A à Z.
- Un nom correspond aussi sur **toute partie après un `_`**. Taper `Pump` trouve `MB_06_DO@Pump_Wort__HS`, vous n'avez donc pas besoin de vous rappeler le début d'un long nom de Device.

Le meilleur choix est aussi montré **en gris après le curseur**. Pour le prendre :

| Touche | Ce qu'elle fait |
|---|---|
| **Tab**, **Entrée** ou **Flèche droite** | Prend le choix en surbrillance |
| **Haut** / **Bas** | Se déplace dans la liste |
| **Échap** | Ferme la liste |
| Clic ou toucher | Prend ce choix |

## Après un point : les attributs {#after-a-dot-attributes}

Tapez un nom et un point, et la liste montre les attributs de cet élément, avec sa valeur principale en premier (`.state` pour une pompe, `.value` pour une sonde). Chaque lettre que vous tapez réduit la liste aux attributs qui commencent par ces lettres :

| Vous tapez | La liste montre |
|---|---|
| `Pump.` | chaque attribut de Pump, `state` en premier |
| `Pump.h` | `height`, `hidden` |
| `Pump.he` | seulement `height`, donc il est rempli tout seul |
| `Pump.st` | seulement `state`, rempli tout seul |

Taper **`.x`** remplit toujours **`.x_hPosition`** (en largeur) et **`.y`** remplit **`.y_vPosition`** (en hauteur), même avec l'interrupteur Predictive text désactivé. Les anciens noms `.xPosition` et `.yPosition` marchent toujours dans un Process.

Au début d'une ligne, le choix reçoit aussi ` = ` après lui (`Pump.state = `). Dans un `if` ou un `wait`, il reçoit une espace, et la liste suivante s'ouvre avec les signes de comparaison, car la ligne continue comme le panel la lit :

`if` nom`.`attribut `=` valeur, par exemple `if gG_Tulip.visible = true` ou `if gG_Tulip.x_hPosition = 456`.

Dans un `if`, un seul `=` demande « est-ce égal ? », comme `==`, donc les deux sont dans la liste. Après le signe, un attribut qui est vrai ou faux reçoit `true`, `false`, `on` et `off` ; pour un nombre, tapez-le (ou appuyez sur **Ctrl+Espace** pour choisir plutôt une variable).

## Ctrl+Espace ou le bouton Suggest : ce qui peut aller ici {#ctrl-space-or-the-suggest-button-what-can-go-here}

Appuyez sur **Ctrl+Espace** (sur un téléphone ou une tablette, touchez **💡 Suggest** au-dessus de l'éditeur) pour ouvrir la liste avant même de taper une lettre. Elle ne montre que ce qui peut aller à cet endroit :

- Sur une **ligne vide** : les commandes.
- Après **`if`**, **`wait`** ou **`elseif`** : seulement ce qui peut être testé, dans cet ordre : les variables faites dans ce Process, les minuteries, les gGlobals, les Devices, les Widgets, les Processes, puis `true`, `false`, `now` et `not`. Pas de commandes.
- Après un **nom dans un `if`** (`if MB_06_DO@Pump_Wort__HS`) : les signes de comparaison (`==` est égal à, `!=` n'est pas, `>` plus que ...) et les propres attributs de cet élément, comme `.state` (pareil que le nom seul), `.visible` ou `.enabled`.
- Après un **nom au début d'une ligne** : `=` le régler à, `+=`, `-=`, `++`, et ses attributs, comme `.visible = `.
- Après **`==` ou `=`** sur quelque chose qui est On ou Off (une pompe, une vanne, une alarme, une variable vrai/faux) : `true`, `false`, `on` et `off` viennent en premier.
- Après un **test entier** (`if MB_06_DO@Pump_Wort__HS == true`) : `and` ou `or`, pour ajouter un autre test.
- Après **`start`**, **`stop`** ou **`restart`** : vos Processes, puis les minuteries et alarmes qu'ils peuvent démarrer ou arrêter. Après **`reset`** : les minuteries et les moteurs pas à pas.
- Après **`play`** : les alarmes et les lecteurs de sons.
- Après **`show tab`** : les noms de vos Tabs (un nom avec une espace reçoit ses guillemets).
- Après **`goto`** : les `[labels]` de ce Process.
- Après **`new`** : `value`, `string`, `bool`, `time` et `datetime`.

## Écrire une ligne en choisissant {#writing-a-line-by-picking}

Quand vous choisissez une commande ou un nom, la liste de ce qui peut suivre s'ouvre toute seule. Par exemple :

1. Sur une ligne vide, appuyez sur **Ctrl+Espace** (ou **💡 Suggest**) et choisissez `if`.
2. La liste montre maintenant ce qui peut être testé. Choisissez `MB_06_DO@Pump_Wort__HS`.
3. La liste montre `==`, `!=` ... et `.state`, `.visible`. Choisissez `==`.
4. La liste montre `true` et `false` en premier. Choisissez `true`.

La ligne est maintenant `if MB_06_DO@Pump_Wort__HS == true`. Une valeur termine la ligne, donc la liste reste fermée et **Entrée** fait une nouvelle ligne. Pour ajouter un autre test, appuyez à nouveau sur **Ctrl+Espace** pour `and` / `or`.

## Ce qui n'est jamais proposé {#what-is-never-offered}

- Les **Clones** d'un Device ne sont pas utilisés dans les Processes (voir la page d'aide Cloned Devices), donc ils ne sont jamais dans la liste. Utilisez le nom du Device lui-même.
- Les **clés cachées** ne quittent jamais le Brain et ne peuvent pas être utilisées dans un Process (voir la page d'aide Name change and hidden keys). Seuls les noms sont proposés.

Voir [Le langage des Processes et les étapes](22-process-language) pour ce que fait chaque commande, et [L'éditeur de Processes](30-process-editor) pour les autres outils de l'éditeur.
