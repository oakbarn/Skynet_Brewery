# Variables

Les variables contiennent des valeurs que les Processes et les écrans utilisent. L'écran **Variables** les liste toutes avec leurs valeurs. Les six Kinds (types) simples (String, Graphic, Value, Boolean, Time, Date Time) sont créés sur l'écran **gGlobal** avec **➕ New gGlobal** et ne sont jamais posés sur un Tab : voir [Sortes de gGlobal](108-gglobal-kinds). Les types affichés à l'écran (Switch, Push Button, Pulse Button, List, Step, Long String) s'ajoutent toujours dans **Tabs > ☰ Menu > Edit layout > Select Widget Type > gGlobal variables**, puis **Add Widget**. Les préfixes de nom ci-dessous sont des suggestions ; n'importe quel nom marche.

gKonstant et gAPI sont devenus une seule classe, **gGlobal**, le 2026-10-30. Envoyer les lectures à la base de données et laisser des programmes extérieurs atteindre un élément sont maintenant des réglages que chaque Device et chaque Widget possède, donc une classe API séparée n'était plus nécessaire. Les anciens sont convertis au démarrage du Brain : voir [Base de données et .API sur chaque Device et Widget](98-database-and-api).

## Quel type utiliser {#which-kind-to-use}

| Type | Processes | À l'écran | Base de données et programmes extérieurs |
|---|---|---|---|
| **gGlobal** | ✓ | ✓ | Quand ses Properties le disent (case **Database and .API**) |

- Utilisez un **gGlobal** pour les réglages, les éléments d'écran et les lectures (pH, densité, volumes). Pour en enregistrer un dans le journal, ou laisser un autre programme le lire ou le changer, réglez sa case **Database and .API**.
- Pour passer une valeur d'un Process à un autre, utilisez un gGlobal avec **Database** et **.API** tous les deux sur **Off**. Rien en dehors des Processes ne peut le voir.

L'ancienne classe **Shared variable** a disparu. Un Schema plus ancien qui en a encore une se charge sans elle. Pour passer une valeur entre Processes, créez un gGlobal du type qui lui convient (un nombre gV_Global_Value, du texte gS_Global_String, vrai / faux gB_Global_Boolean, une durée gT_Global_Time, une date et une heure gD_Global_DateTime) avec Database et .API sur Off. Voir [Les variables partagées sont devenues des gGlobals](149-shared-variables-became-gglobals).

Chaque gGlobal est **non volatil** : démarrer un Process ne l'efface jamais, et sa valeur est enregistrée sur le disque du Brain et revient quand le Brain redémarre. Voir [Les gGlobals gardent leurs valeurs](118-gglobals-keep-their-values).

L'ancienne classe **Global** est retirée. Quand un Schema plus ancien est chargé, chaque Global devient un gGlobal, et la liste de ce qui a changé s'affiche sur la page Processes.

## Types de gGlobal {#gglobal-kinds}

| Type | Préfixe | Remarques |
|---|---|---|
| gG_Global_Graphic | `gG_` | Les chemins d'image de fond standard. Un Process peut changer l'image. [Sortes de gGlobal](108-gglobal-kinds) |
| gS_Global_String | `gGS_` | Du texte. [Sortes de gGlobal](108-gglobal-kinds) |
| Long String | `gGL_` | Relié à un fichier texte dans un dossier media. Modifiez le fichier et le panel suit en moins d'une seconde. |
| gV_Global_Value | `gGV_` | Un nombre. |
| gT_Global_Time | `gGT_` | `00:00:00` |
| gD_Global_DateTime | `gGDT_` | |
| gB_Global_Boolean | `gGB_` | Vrai ou faux. |
| Switch | `gGSW_` | Un curseur. C'est une bascule : touchez-le sur ON et il reste ON, touchez-le de nouveau et il reste OFF. |
| Push Button | `gGPB_` | ON seulement tant qu'on le tient, OFF dès qu'on le lâche. Se relâche tout seul si l'écran perd le WiFi. |
| Pulse Button | `gGMB_` | Un appui le rend vrai pendant un dixième de seconde, quelle que soit la durée de l'appui. |
| List | `gGList_` | Une liste déroulante (plus bas). |
| Step | `gGStep_` | Montre l'étape (step) qu'un Process vient d'atteindre. |

## Database and .API

Chaque gGlobal (et chaque autre Device et Widget qui a une valeur) a une case **Database and .API** à la fin de ses Properties. L'écran Variables montre le réglage de chaque gGlobal, et **Log now** envoie aussitôt sa valeur à la base de données. Voir [Base de données et .API sur chaque Device et Widget](98-database-and-api).

## gGlobal List (une liste déroulante sur un Tab) {#gglobal-list-a-dropdown-on-a-tab}

**Tabs > ☰ Menu > Edit layout > Add Widget > gGlobal variables > List (dropdown: Value + Text)** crée une liste déroulante. Ses réglages ont un tableau à deux colonnes : **Value** (un nombre) et **Text**. **+ Add row** ajoute un choix et ✕ en retire un.

Exemple : `gGList_BrewStatus` avec 1 = Mash, 2 = Boil, 3 = Chill. Sur le Tab, la liste déroulante affiche Mash, Boil et Chill. Choisir Boil met la valeur à 2, et c'est ce nombre que les Processes lisent (`if gGList_BrewStatus == 2`). Un Process qui la met à 3 fait afficher Chill à la liste déroulante.
