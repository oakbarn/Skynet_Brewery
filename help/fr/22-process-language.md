# Le langage des Processes et les étapes {#process-language-and-steps}

Les Processes s'écrivent maintenant comme dans la plupart des langages de programmation.

## Le nom seul est la valeur principale {#the-name-alone-is-the-main-value}

Écrivez le nom d'un Device ou d'un Widget tout seul. Vous n'avez jamais besoin de `value`, `state` ni `active`.

```
Pump_Red = true
alm_StrikeSpargeMash_ALARM = true
Kettle_SetPoint = 185.5
if Kettle_SetPoint == 185.5
wait tm_Mash <= 00:00:00
```

La valeur principale de chaque type :

- Digital Out, Switch, Digital In, Duty Cycle, Hysteresis : allumé ou éteint (`true` / `false`)
- Alarm : sonne ou non (`true` / `false`)
- Timer (minuterie) : son temps
- gGlobal : sa valeur
- Temperature, Analog In et Out, PWM, PID, Scale (balance) : leur lecture ou leur valeur
- Flow meter (débitmètre) : son débit

## Les autres attributs utilisent un point {#other-attributes-use-a-dot}

```
my_Widget.visible = false
tm_Mash.countdown = true
tm_Mash.label = "Mash rest"
Kettle_Temp.background = 2
Pump_Red.image = "RedPump.png"
if Hop_Text.visible == true
```

`.image` change l'image de l'élément : le chemin va dans .backpath et background devient 1. `.background = 1`, `2` ou `3` montre .backpath, .backpath_2 ou .backpath_3 ; 0, vide ou tout nombre au-dessus de 3 ne montre aucun fond. Voir [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths). Le nom du fichier seul suffit (Skynet ajoute son dossier), une image Skynet peut aussi être donnée par son numéro, et chaque image ou son a `.path` (le chemin entier) et `.file` (le nom du fichier) : voir [Chemins en deux parties (.path et .file)](194-two-part-paths) et [Numéros des images Skynet](193-skynet-picture-numbers).

Tout attribut qui n'a que deux choix est `true` ou `false` :

- `.visible` (c'était `visibility = visible / hidden`)
- `.countdown` pour les minuteries (c'était `type = countdown / countup`)
- `.running` pour les minuteries, `.loop` pour les alarmes, `.enabled`

Si un nom contient d'autres caractères que des lettres, des chiffres et `_`, mettez-le entre guillemets avant le point : `"BK (Front)".visible = true`.

## Visible et Hidden {#visible-and-hidden}

Chaque Device, Widget et Text a deux attributs vrai / faux :

- `.visible` : affiché ou non. Il accepte aussi les mots `visible` (comme `true`) et `hidden` (comme `false`), donc `Pump_Red.visible = hidden` marche.
- `.hidden` : un verrou qui garde l'élément caché. Seulement `true` ou `false`. **`.hidden = true` l'emporte sur `.visible = true`** : l'élément n'est sur le Tab que tant que `.visible` est `true` et `.hidden` est `false`.

```
Pump_Red.visible = true
Pump_Red.hidden = true        // stays hidden, even though .visible is true
Pump_Red.hidden = false       // shown again
```

(Après la deuxième ligne, la pompe reste cachée même si .visible est true ; la troisième la montre de nouveau.)

Vous pouvez aussi régler les deux dans les **Properties** de l'élément : **Visible** et **Hidden, locked** sont des interrupteurs. Dans Edit layout, un élément caché s'affiche estompé pour que vous puissiez quand même le trouver.

Les Processes plus anciens sont changés pour vous (une fois, au démarrage du panel, et chaque fois qu'un Process est enregistré ou importé). L'ancien fichier est gardé sous `.before-hidden.bak` :

| Ancienne ligne | Nouvelle ligne |
| --- | --- |
| `"my Widget" visibility = visible` | `"my Widget".visible = true` |
| `"my Widget" visibility = hidden` | `"my Widget".visible = false` |
| `"my Widget" visibility = hiddenlocked` | `"my Widget".visible = false; "my Widget".hidden = true` |

Les anciennes lignes tournent toujours de la même façon si vous les laissez.

## Un Process tourne-t-il ? {#is-a-process-running}

`.running` sur un nom de Process vaut `true` tant que ce Process tourne et `false` quand il est arrêté, terminé ou arrêté par une erreur. Il marche dans un `if`, un `elseif`, un `wait` ou partout où va une valeur :

```
if my_Process_Mash.running = true
  stop my_Process_Mash
endif
```

`if my_Process_Mash.running == true` veut dire la même chose : dans un `if`, un seul `=` pose la question, exactement comme `==`. Le style C marche aussi : `if (my_Process_Mash.running) stop my_Process_Mash;` et `if (!Looper_Temps.running) start Looper_Temps;`.

`.running` sur un Process est en lecture seule. Une ligne comme `my_Process_Mash.running = false` est une erreur (« my_Process_Mash.running is read only: use start my_Process_Mash or stop my_Process_Mash ») ; utilisez `start` et `stop` pour le changer. Le `.running` d'une minuterie est différent : il peut être réglé, et il démarre ou arrête la minuterie.

La saisie automatique (autofill) propose `running` après un nom de Process et un point.

## Les écritures de C, C# et JavaScript {#c-c-and-javascript-spellings}

Si vous connaissez C, C++, C# ou JavaScript, vous pouvez utiliser les écritures dont vous avez l'habitude. Ce ne sont que d'autres façons d'écrire les mêmes commandes de Process, donc le Process marche pareil dans les deux cas. Ce n'est pas du JavaScript : seules les écritures ci-dessous sont comprises.

| Vous pouvez écrire | Cela veut dire |
|---|---|
| `Kettle_SP = 185.5;` | Un `;` en fin de ligne est permis. Il permet aussi de mettre deux commandes sur une ligne : `Pump_Red = true; Pump_Blue = false;` |
| `new value vV_Hop1F = 10` | `new value vV_Hop1F` puis `vV_Hop1F = 10` à la ligne suivante (les deux façons marchent) |
| `vCount++` et `vCount--` | `vCount += 1` et `vCount -= 1` (`++vCount` marche aussi) |
| `if (a) { ... }` | `if a` ... `endif` |
| `} else if (b) {` | `elseif b` |
| `} else {` | `else` |
| `if (vCount > 5) print "done";` | un `if` avec une commande sur la même ligne, sans besoin de `endif` |
| `!=`  `&&`  `\|\|`  `!` | différent de, `and` (et), `or` (ou), `not` (non) (ceux-ci ont toujours marché) |
| `//` et `/* ... */` | des commentaires (ceux-ci ont toujours marché) |
| `+=`  `-=`  `*=`  `/=` | ajouter, retirer, multiplier, diviser (ceux-ci ont toujours marché) |

Un Process dans ce style :

```
new value vCount = 0;
[Again]
vCount++;
if (vCount < 3 && !alm_Hops) {
  print "pass " + vCount;
  goto Again;
} else if (vCount == 3) {
  print "three";
} else {
  print "done";
}
```

Le `{` peut aussi aller sur une ligne à lui, sous le `if` ou le `else` (comme on écrit souvent en C#). Chaque `{` a besoin de son `}`, et la vérification du Process vous donne la ligne quand il en manque un.

Vous pouvez mélanger les deux styles dans un même Process. **Save** ne change jamais un style en l'autre.

## Les codes dans le texte {#codes-inside-text}

Le texte entre guillemets peut contenir des codes qui changent son apparence à l'écran. Ils marchent partout où un Process affiche du texte : une valeur texte sur un Tab, un label, les lignes `print` dans la sortie du Process, et les fenêtres comme le message d'une vanne manuelle. Le gras, le grand texte, l'indice et l'exposant sont des bascules : le premier code l'active, le suivant le désactive.

| Code | Ce qu'il fait | Exemple | Affiche |
|---|---|---|---|
| `\n` | une nouvelle ligne | `"Mash in\nStir well"` | Mash in, puis Stir well à la ligne suivante |
| `\t` | un retrait (environ quatre espaces) | `"Mash in\n\tStir well"` | Stir well, en retrait, à la ligne suivante |
| `\b` | gras activé / désactivé | `"Add \bhops\b now"` | Add **hops** now |
| `\L` | grand texte activé / désactivé | `"\LSTRIKE\L 165"` | STRIKE en grandes lettres |
| `\_` | indice activé / désactivé | `"CO\_2\_"` | CO₂ |
| `\^` | exposant activé / désactivé | `"ft\^3\^"` | ft³ |
| `\deg` | un signe degré | `"152\degF"` | 152°F |
| `\\` | une barre oblique inverse | `"C:\\Brewing"` | C:\Brewing |

Les codes peuvent s'utiliser ensemble : `"\L\bBOIL\b\L 60 min"`.

Utilisez `\t` et `\n` pour mettre le texte en page, pas des espaces en trop : un Label ne peut ni commencer ni finir par un espace (ils sont retirés).

La taille du grand texte est **Large text size** sur l'onglet **Default** du ☰ Menu, en pixels. Elle doit être plus grande que le texte normal (18), et elle vaut 28 quand la case est vide. Le grand texte est toujours au moins un quart plus grand que le texte autour, pour qu'il ressorte même dans un élément à grosse police.

## Changer l'apparence d'un Device ou d'un Widget {#change-the-look-of-a-device-or-widget}

Un Process peut changer les couleurs, le placement et le type de valeur de n'importe quel Device ou Widget pendant qu'il tourne :

```
BK_Temp.valueColor = "Red"
BK_Temp.valueBackColor = "Black"
BK_Temp.nameColor = "#ffffff"
BK_Temp.nameAlign = "TopCenter"
BK_Temp.valueAlign = "MiddleRight"
BK_Temp.valueType = "Gauge"
BK_Temp.digits = 4
BK_Temp.valueColor = ""
```

- Les couleurs sont un nom (Red, Black, ...) ou un code comme `#ffffff`. `nameBackColor` est la même chose que `nameBg`, et `valueBackColor` la même chose que `valueBg`.
- Le placement est l'un de TopLeft, TopCenter, TopRight, MiddleLeft, MiddleCenter, MiddleRight, BottomLeft, BottomCenter, BottomRight.
- `valueType` est `LED`, `Text`, `Gauge` (chiffres LCD) ou `Dial` (le Skynet Dial : un arc avec une aiguille et la lecture dessous, Help 152). Ce qui a un état ON / OFF (une pompe, une vanne, un interrupteur) ne peut être que `LED` ou `Text`.
- `""` remet l'apparence réglée dans ses propriétés.

Chaque zone de texte a aussi `.foreColor`, `.backColor`, `.alignment` (Left, Center, Right), `.width`, `.height`, `.x_hPosition` et `.y_vPosition`, par exemple `Pump_1.foreColor = "Red"` ou `Text_1.x_hPosition = 400`. Un Text ajouté avec **+ Text** a aussi un nom (`Text_1`). Voir [Les zones de texte](49-text-boxes).

Le changement dure jusqu'au redémarrage du panel. Pour garder une apparence, réglez-la dans les propriétés de l'élément, ou faites commencer les nouveaux éléments avec un [Tab Background Profiles et Valve Profiles](36-tab-and-valve-profiles).

## Skynet Constants (constantes Skynet) {#skynet-constants}

Des nombres fixes pour les conversions courantes sont intégrés, pour qu'un Process puisse écrire `gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb`. Chacune commence par `skc_` et aucune ne peut être changée. La liste complète est dans [Constantes Skynet](94-skynet-constants).

## NULL : la valeur vide {#null-the-empty-value}

`NULL` veut dire **aucune valeur du tout**. Ce n'est pas 0, pas `false` et pas `""` : c'est vide.

1. **Vider une valeur :** `gV_Strike = NULL`. Sa case sur le Tab s'affiche **vide** jusqu'à ce que quelque chose la règle de nouveau, et elle reste vide après un redémarrage.
2. **Demander si elle est vide :** `if gV_Strike == NULL` (ou `!= NULL` pour « a une valeur »).
3. **Les calculs ont besoin d'une valeur :** `gV_Strike + 5`, `gV_Strike += 1` ou `if gV_Strike > 150` sur une valeur vide **arrête le Process** et dit quelle valeur est vide. Testez-la d'abord :

```
if gV_Strike == NULL
  gV_Strike = 152
endif
gV_Strike = gV_Strike + 1
```

`NULL` marche pour chaque Kind (type) : un nombre, du texte, une durée, une date et une heure, ou vrai / faux, dans une variable de Process, un gGlobal ou un Value Widget. Un Device (une pompe, une vanne, un Heating Element) est toujours allumé ou éteint, donc `Pump_1 = NULL` est une erreur. `NULL`, `Null` et `null` sont le même mot.

### Le côté technique {#the-technical-side}

`NULL` est un mot réservé (plus bas). Seul `= NULL` rend une valeur vide : rien ne devient `NULL` tout seul, et un capteur sans lecture n'est pas `NULL`. `==` et `!=` sont les seules questions qui acceptent `NULL` ; `+ - * / ^`, `< > <= >=` et `+= -= *= /=` arrêtent le Process avec le numéro de ligne. `NUL` est un autre mot : c'est l'un des noms que Windows garde pour lui, donc il ne peut pas être un nom et ne fait rien dans un Process.

## Mots réservés {#reserved-words}

Ces mots appartiennent au langage des Processes, donc aucun d'eux ne peut être le nom d'un Device, d'un Widget, d'un gGlobal ou d'une variable de Process. Les majuscules et les minuscules sont pareilles (`NULL` = `null`).

- **Valeurs :** `NULL`, `true`, `false`, `on`, `off`, `now`, `visible`, `hidden`, `hiddenlocked`, `countdown`, `countup`, `none`, `custom`, `default`
- **Mots de liaison :** `and`, `or`, `not`
- **Types de variable :** `value`, `string`, `bool`, `time`, `datetime`
- **Commandes :** `if`, `elseif`, `else`, `endif`, `goto`, `goLine`, `sleep`, `wait`, `start`, `stop`, `restart`, `reset`, `print`, `clear`, `show`, `new`, `declare`, `play`, `step`, `ask`, `send_db`, `DBSend` (après un nom : `HLT_PID.setpoint DBSend`), `send_db_group`, `start_db_group`, `stop_db_group`, `lock_equipment`, `unlock_equipment`, `close_all_valves`, `open_all_valves`, `open_valve`, `close_valve`, `all_pumps_off`, `import_recipe`, `start_hop_alerts`, `stop_hop_alerts`, `take_reading`
- **Lieux :** `tab`, `workspace`
- **Skynet Constants :** chaque nom qui commence par `skc_` (voir plus haut)

Les noms que Windows garde pour lui (CON, PRN, AUX, NUL, COM1 à COM9, LPT1 à LPT9) ne peuvent pas non plus être des noms. Voir [Caractères permis dans les noms](63-allowed-names).

## Aller à une ligne : goLine {#go-to-a-line-goline}

Les Processes ont des numéros de ligne automatiques. `goLine` va à un numéro de ligne, comme `goto` va à une section (un `[label]`) :

```
234  some Code
235  [My New Section]

goto "My New Section"
goLine 235
```

Ces deux lignes font la même chose.

**Le numéro suit sa ligne** quand des lignes sont ajoutées ou enlevées. Skynet le fait en coulisse et n'a besoin d'aucune action de votre part.

Un goLine vers une ligne que le Process n'a pas est une erreur, et le Process ne démarre pas.

## Les noms n'ont pas d'espaces {#names-have-no-spaces}

Les noms des Devices, des Widgets et des Processes ne peuvent plus contenir d'espaces. Quand vous tapez un espace dans un nom, il devient `_`. Les noms qui avaient déjà des espaces ont été changés une fois, par exemple `Test Timer` est devenu `Test_Timer`. L'écran montre toujours l'ancien nom, parce qu'il est devenu le **Label**. Chaque Process qui utilisait l'ancien nom a aussi été mis à jour, et une copie de chacun a été gardée sous `.before-no-spaces.bak`.

## Saisie automatique (autofill) {#autofill}

Il y a plus à ce sujet, y compris **Ctrl+Espace** et l'écriture d'une ligne en choisissant, dans [Texte prédictif dans l'éditeur de Process](79-predictive-text).

Pendant que vous tapez dans un Process, une liste de noms s'ouvre. Les noms que vous avez déjà utilisés plus haut dans ce Process viennent en premier, puis vos Devices, Widgets et Processes. Utilisez **Haut** et **Bas** pour en choisir un, **Entrée** ou **Tab** pour le prendre, et **Échap** pour fermer la liste.

Après un point, la liste montre les attributs de cet élément. Quand les lettres que vous avez tapées ne correspondent qu'à un seul attribut, il est rempli tout seul : `my_Widget.b` devient `my_Widget.background = `. En début de ligne, vous obtenez aussi ` = ` ; à l'intérieur d'un `if` ou d'un `wait`, vous n'obtenez que le nom de l'attribut. Vous pouvez quand même continuer à taper le mot entier, car les lettres déjà remplies sont sautées.

## Les classes de Process {#process-classes}

Chaque Process appartient à une classe. La liste de l'écran Processes est groupée par classe, et vous pouvez cliquer sur un titre pour replier ce groupe.

| Classe | À quoi elle sert | Devinée d'après un nom qui commence par |
|---|---|---|
| **Flow** | Le brassage lui-même : un Process Flow lance le suivant. | `scr`, ou un nom qui contient `flow` |
| **Sub** | Appelé par les Processes Flow pour des tâches utilisées à plus d'un endroit. | tout le reste |
| **Repeat** | De petites aides communes, souvent un endroit où attendre dans le Process qui appelle (comme `inscpt_scrAdvancewithSwitch`). | `inscpt` |
| **Looper** | Tourne en arrière-plan tout seul et n'est jamais appelé. | `looper` |

Si la devinette est fausse, changez-la dans la liste déroulante à côté de **Save**.

## Les étapes (Steps, l'échafaudage) {#steps-scaffolding}

Une ligne `step` marque une section d'un Process :

```
step "Mash in"
```

Quand vous enregistrez, chaque étape de chaque Process est renumérotée :

- Les Processes Flow reçoivent 1, 2, 3 et ainsi de suite, dans l'ordre où ils se lancent les uns les autres. Leurs étapes sont numérotées **1.00000**, **1.00001** et ainsi de suite, et le Process Flow suivant commence à **2.00000**.
- Les Processes Sub, Repeat et Looper comptent chacun de leur côté : **S1.00000**, **R1.00000**, **L1.00000**.

Si vous ajoutez une étape au milieu, les numéros qui suivent montent tout seuls. Ne tapez jamais le numéro vous-même.

**Add steps** (à côté de Save) met une étape au début du Process et après chaque `[label]` qui n'en a pas encore. Enregistrez ensuite pour les numéroter.

Pendant qu'un Process tourne, l'écran Processes montre l'étape où il en est. Pour la montrer sur un Tab, ajoutez un **gGlobal** de type **Step**. Dans ses propriétés, **Shows the steps of** choisit la classe à suivre (Flow si vous ne le changez pas). Il affiche alors, par exemple, `2.00003  Mash in`.

## Verrouiller le Equipment Profile {#lock-the-equipment-profile}

`lock_Equipment` verrouille les Equipment Profiles de chaque Tab du Schema chargé (en général les profils Hot Side et Fermentation), pour que leurs nombres, leur équipement et leurs tuyaux ne puissent pas être changés. `unlock_Equipment` les déverrouille. Mettez-les sur une ligne à part, par exemple au début et à la fin d'une journée de brassage :

```
lock_Equipment
step "Mash in"
...
unlock_Equipment
```

La sortie du Process dit quels profils ont été verrouillés. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles). Un `lock_BrewDayRecipe` assorti vient avec la Brew Day Recipe.
