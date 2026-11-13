# Créer un gGlobal dans un Process {#make-a-gglobal-in-a-process}

Un **gGlobal** est une variable que chaque Process peut utiliser, et elle garde sa valeur même quand le Brain est éteint
(aides 108 et 118). En plus de l'écran **gGlobal** (☰ Menu > Variables), un gGlobal peut aussi être créé par une ligne dans un
Process (Règle Skynet 1.24).

## Trois façons de l'écrire {#three-ways-to-write-it}

Les trois lignes ci-dessous créent le **même** gGlobal :

```
new gGlobalValue gV_Mash_Temp = 152     // the long word
new gV gV_Mash_Temp = 152               // the short word
new value gV_Mash_Temp = 152            // a normal variable word, but the name starts gV_
```

(Le mot long, le mot court, ou un mot de variable normal, mais le nom commence par gV_.) `declare` marche comme `new`, donc `declare gV gV_Mash_Temp` convient aussi. Le `= 152` n'est pas nécessaire.

| Sorte | Mot long | Mot court | Le nom commence par |
|---|---|---|---|
| une Value (un nombre) | `gGlobalValue` | `gV` | `gV_` |
| une String (du texte) | `gGlobalString` | `gS` | `gS_` |
| une Time (une heure) | `gGlobalTime` | `gT` | `gT_` |
| une Date Time (date et heure) | `gGlobalDateTime` | `gD` | `gD_` |
| un Boolean (vrai ou faux) | `gGlobalBoolean` | `gB` | `gB_` |

Un gGlobal Graphic (`gG_`) contient des chemins d'images, donc il n'est créé que sur l'écran gGlobal.

## Le texte prédictif aide {#predictive-text-helps}

Choisissez **new gGlobalValue** dans la liste (ou tapez vous-même `new gGlobalValue `) et le début du nom, `gV_`, est mis pour
vous. Tapez ensuite le reste du nom, par exemple `Mash_Temp`, et ajoutez `= 152` si vous voulez une première valeur.

## Ce qui se passe quand la ligne s'exécute {#what-happens-when-the-line-runs}

- **La première fois** que la ligne s'exécute, le gGlobal est créé. Il est enregistré dans le Schema, comme un gGlobal créé sur l'écran
  gGlobal, et apparaît là dans la liste de sa sorte. Le `= 152` est sa **première valeur** (sans elle, une Value commence à 0, une String
  vide, un Boolean à faux).
- **Ensuite** le gGlobal existe déjà, donc la ligne ne fait rien. Il garde la valeur qu'il a (Règle 1.22), même si un
  Process l'a changée en 160. Pour repartir d'une valeur neuve à chaque fois, réglez-la sur sa propre ligne : `gV_Mash_Temp = 152`.
- La fenêtre Output dit `Made the gGlobal gV_Mash_Temp` la seule fois où il est créé.

## Un gGlobal ne prend que sa propre sorte de valeur {#a-gglobal-takes-only-its-own-kind-of-value}

Chaque gGlobal contient **une seule sorte** de valeur, et rien d'autre n'y entre (Règle Skynet 1.30) :

```
gT_HopDrop_1 = 00:15:00            // fine: a Time takes a time
gT_HopDrop_1 = "My Hop Drop"       // error: "My Hop Drop" is text, not a time
new gT gT_HopDrop_1 = "My Hop Drop"   // the same error when it is made
```

(La première ligne est correcte : une Time prend une heure. Les deux autres sont des erreurs : "My Hop Drop" est du texte, pas une heure.)

| Sorte | Elle prend | Par exemple |
|---|---|---|
| Value (`gV_`) | un nombre | `gV_Mash_Temp = 152.5` |
| String (`gS_`) | du texte entre guillemets | `gS_Note = "Add the hops"` |
| Boolean (`gB_`) | vrai ou faux (on ou off) | `gB_Grain_Added = true` |
| Time (`gT_`) | une heure | `gT_HopDrop_1 = 00:15:00` |
| Date Time (`gD_`) | une date et une heure | `gD_Start = now` ou `gD_Start = "11/09/2026 07:00:00"` |

Une mauvaise valeur n'est **jamais changée en une autre sorte**. Le gGlobal garde la valeur qu'il avait, le Process s'arrête, et la fenêtre Output
dit ce qui n'a pas marché, par exemple :

> gT_HopDrop_1 is a Time gGlobal: it only takes a time, such as 00:15:00. It was not changed, because "My Hop Drop" is text.

(gT_HopDrop_1 est un gGlobal Time : il ne prend qu'une heure, comme 00:15:00. Il n'a pas été changé, car "My Hop Drop" est du texte.)

Quand la mauvaise valeur est tapée directement sur la ligne, le **Check** la trouve avant que le Process s'exécute. Quand elle vient d'
ailleurs (une variable, un Device ou un calcul), elle est trouvée quand la ligne s'exécute.

Pour mettre un nombre dans une String, mettez-le après `"" +` : `gS_Note = "" + 152` donne le texte "152".

## .minute et .seconds sur un gGlobal Time {#minute-and-seconds-on-a-time-gglobal}

Un gGlobal Time peut aussi être réglé avec un **nombre entier** de minutes ou de secondes. Le nombre est transformé en heure, et il devient
la valeur **entière** (les grands nombres débordent en minutes et en heures) :

```
gT_HopDrop_1.minute = 5         // 00:05:00
gT_HopDrop_1.seconds = 45       // 00:00:45
gT_HopDrop_1.seconds = 126      // 00:02:06
gT_HopDrop_1.seconds = 3726     // 01:02:06
gT_HopDrop_1.minute += 5        // five minutes more
```

(La dernière ligne ajoute cinq minutes.) Lus, ils donnent l'heure entière en minutes ou en secondes : à 01:02:06, `gT_HopDrop_1.minute` vaut 62 et `gT_HopDrop_1.seconds` vaut
3726. Seuls les nombres entiers marchent : `gT_HopDrop_1.minute = 2.5` ou `gT_HopDrop_1.minute = "five"` est une erreur.

## Les erreurs que trouve le Check {#mistakes-the-check-finds}

| Vous avez écrit | Pourquoi c'est faux |
|---|---|
| `new value gS_Note` | `gS_` est pour une String, mais `value` est un nombre. Écrivez `new string gS_Note` ou `new gS gS_Note`. |
| `new gGlobalValue Mash_Temp` | Un nom gGlobalValue commence par `gV_` : écrivez `gV_Mash_Temp`. |
| `new gV gV_Pump` quand un Device s'appelle `gV_Pump` | Le nom est déjà pris : choisissez-en un autre. |
| `gT_HopDrop_1 = "My Hop Drop"` | Un gGlobal Time ne prend qu'une heure, comme `00:15:00` (Règle 1.30). |
| `new gS gS_Old` quand `gS_Old` est déjà un gGlobal Value | La sorte d'un gGlobal ne peut pas changer (Règle 1.19) : utilisez son propre mot, ou supprimez-le et recréez-le. |

Un nom sans début de gGlobal (comme `vCount`) après `new value` reste une variable de Process normale : seul ce Process peut l'utiliser,
et elle est effacée chaque fois que le Process démarre.
