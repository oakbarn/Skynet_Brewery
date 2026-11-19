# Copier un onglet entier {#copy-a-whole-tab}

Un nouvel onglet peut commencer comme **copie d'un onglet entier** : tout ce qui s'y trouve, aux mêmes places (Règle Skynet 4.8). Les
tuyaux ne peuvent pas être déplacés un par un vers un autre onglet ; copier l'onglet entier est la façon de le faire.

## Comment {#how}

1. Ouvrez **Edit layout** et appuyez sur **New tab**.
2. Choisissez **Copy of** l'onglet voulu (ou **Empty Tab** pour un nouvel onglet vide). Les onglets vides ne sont pas dans la liste.
3. Tapez le nom du nouvel onglet. Il reçoit son propre Tab ID (Règle 3.2) ; changez-le dans Tab settings avant **Save layout** si vous en voulez un autre.
4. Si l'onglet a des Widgets, choisissez ce qu'ils deviennent (plus bas).
5. Si vous avez choisi de nouveaux Widgets et que des Processes les utilisent, une seule question : **Copy the N Processes?**
6. **Save layout** garde le tout. Quittez Edit layout sans enregistrer et rien n'est fait, pas même les copies de Processes.

## Ce que reçoit la copie {#what-the-copy-gets}

| Sur l'onglet | Sur la copie |
|---|---|
| **Devices** (pompes, vannes, éléments chauffants, sondes ...) | Un **Clone** de chacun ([Cloned Devices](71-cloned-devices)). Un Clone et son Device sont le même Device, seulement une autre image à l'écran. Un Process commande toujours le Device lui-même. |
| Un **Clone** | Un autre Clone du même Device (un Method Clone garde sa méthode). |
| **Tuyaux, tuyaux souples, IP, raccords, cuves, images et texte** | De nouveaux, joints de la même façon. Skynet leur donne de nouveaux noms en arrière-plan (Pipe_N, Hose_N, Tee_N ...). Les tuyaux sur les IP d'un Device finissent sur son Clone. |
| **Widgets** | Ce que vous choisissez : |

**Les Widgets** (interrupteurs, alarmes, minuteries, valeurs, étiquettes, gGlobals ...) :

- **i) Clones** : chaque Widget est aussi montré sur le nouvel onglet. Les deux sont le même Widget : changez l'un, l'autre change.
- **ii) New Widgets** : chacun est un nouveau Widget à part, avec un nouveau Suggested Name qui finit par le nouveau Tab ID
  (`wgt_SW_Testing_BH` devient `wgt_SW_Testing_B2`, Règle 3.14). Un nom sans Tab ID reçoit `_2`.
- **iii) Case by case** : Skynet demande pour chaque Widget : **Clone** ou **New Widget**.

## Copier les Processes {#copy-the-processes}

Avec de nouveaux Widgets (ii ou iii), les Processes qui utilisent les anciens Widgets commanderaient encore ceux de l'ancien onglet.
**Copy the N Processes?** fait une copie de chacun, nommée avec le nouveau Tab ID (`BrewDay_Flow` devient `BrewDay_Flow_B2`). Dans chaque copie :

- les noms des anciens Widgets deviennent les nouveaux,
- un Process qu'elle démarre ou arrête et qui a aussi été copié devient la copie,
- les **Devices restent les mêmes** : la copie commande les mêmes pompes, vannes et éléments (leurs Clones sur le nouvel onglet le montrent).

Un Widget qui démarre un Process (un Label ou un Process Widget) copié comme nouveau démarre la copie du Process. **No** ne copie aucun Process.
