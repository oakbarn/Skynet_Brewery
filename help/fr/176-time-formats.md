# Formats Time et DateTime : choisir comment une heure s'affiche {#time-and-datetime-formats-pick-how-a-time-shows}

Un Time Widget, un DateTime Widget et un minuteur peuvent chacun afficher leur heure comme vous voulez (Règle Skynet 2.45). Seul l'aspect
change : un Process lit toujours la même valeur.

## En choisir un {#pick-one}

- **Time Widget ou DateTime Widget :** en Edit layout, double-cliquez dessus et choisissez **Shows as**.
- **Minuteur :** double-cliquez dessus et choisissez **Digits**.

| Formats Time | 1 heure 30 minutes 5 secondes s'affiche |
|---|---|
| hh:mm:ss (l'aspect standard) | 01:30:05 |
| hh:mm | 01:30 |
| h:mm:ss | 1:30:05 |
| mm:ss, tout en minutes | 90:05 |
| Minutes seulement | 90 |
| Secondes seulement | 5405 |
| Avec les jours | 0.01:30:05 |

| Formats DateTime | Lundi 9 novembre 2026 à 14 h 30 s'affiche |
|---|---|
| mm/dd/yyyy hh:mm:ss (l'aspect standard) | 11/09/2026 14:30:00 |
| Avec AM / PM | 11/09/2026 2:30:00 PM |
| Date seulement | 11/09/2026 |
| Mois court | Nov 9, 2026 |
| Date longue | Monday, November 9, 2026 |
| Horloge | 2:30 PM |
| Horloge 24 heures | 14:30 |
| Jour et horloge | Mon 2:30 PM |
| Année d'abord | 2026-11-09 14:30:00 |

## N'importe quel format, depuis un Process {#any-format-you-like-from-a-process}

Un Process peut régler n'importe quel format avec **`.showas`**, en utilisant ces lettres :

| Lettres | Time | DateTime |
|---|---|---|
| `d` | jours | jour du mois (`dd` = 09, `ddd` = Mon, `dddd` = Monday) |
| `h` `hh` | heures | heures de 1 à 12 (`HH` = 0 à 23) |
| `m` `mm` | minutes | minutes |
| `s` `ss` | secondes | secondes |
| `M` `MM` `MMM` `MMMM` | | mois (11, 11, Nov, November) |
| `yy` `yyyy` | | année (26, 2026) |
| `tt` | | AM ou PM |

Pour un Time, la plus grande unité du format contient toute la durée, donc `mm:ss` affiche 1 heure 30 minutes comme 90:00. Mettez des mots entre
'apostrophes simples' pour les afficher tels qu'ils sont tapés.

```
wgt_TM_Boil_BH.showas = "mm:ss"
tm_Boil.showas = "mm' min'"          shows 45 min
wgt_DT_Clock_BH.showas = "ddd h:mm tt"
wgt_TM_Boil_BH.showas = ""           back to its Properties' pick
```

(La deuxième ligne affiche « 45 min » ; la dernière revient au choix de ses Properties.)

Voir aussi [Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets) et [Timer digits](152-skynet-dial-and-timer-digits).
