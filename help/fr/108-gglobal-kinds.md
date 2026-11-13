# Sortes de gGlobal {#gglobal-kinds}

Une **gGlobal** est une variable à portée globale : chaque Process peut la lire et la changer. Ce **n'est pas un Widget** et elle **n'est pas sur un Tab**. Pour montrer quelque chose sur un Tab, utilisez un Widget (un Widget Text, Picture, Value, Time ou Date Time). Tout Device ou Widget peut déjà aller dans la base de données et être atteint par des programmes extérieurs (sa case **Database and .API**), donc une gGlobal n'est plus nécessaire pour cela non plus.

Chaque gGlobal a une **Kind** (sorte). La sorte est choisie quand la gGlobal est faite et **ne peut jamais être changée**. Si la sorte est fausse, supprimez la gGlobal et faites-en une nouvelle.

## Les six sortes {#the-six-kinds}

| Sorte | .value est | Exemple |
|---|---|---|
| **gS_Global_String** | une chaîne (du texte) | `gS_Brewer_Note.value = "Add the yeast nutrient at 10 minutes"` |
| **gG_Global_Graphic** | le chemin d'une image (il commence comme l'Image Path que choisit Background #) : les chemins d'images de fond standard (Image Path 1, 2, 3, Background #, Back Colour) | `gG_Brew_Day_Picture.background = 2` |
| **gV_Global_Value** | une valeur (un nombre) | `gV_Strike_Temp.value = 163` |
| **gB_Global_Boolean** | un booléen : true ou false | `gB_Grain_Added.value = true` |
| **gT_Global_Time** | une durée, `hh:mm:ss` | `gT_Mash_Rest.value = 01:00:00` |
| **gD_Global_DateTime** | une date et heure | `gD_Brew_Day_Start.value = "2026-11-07T07:00:00"` |

Sur cet écran, les préfixes de noms (`gS_`, `gG_`, `gV_` ...) sont des indications et n'importe quel nom marche. Dans un Process, le préfixe d'un nom dit de quelle sorte il est (aide 145).

## Faire une gGlobal {#making-a-gglobal}

Un Process peut aussi en faire une, avec une ligne comme `new gV gV_Strike_Temp = 163` (aide 145).

Une gGlobal ne prend que sa propre sorte de valeur : `gT_Mash_Rest = 00:15:00` marche, mais `gT_Mash_Rest = "My Rest"` est une erreur (aide 145).

1. Ouvrez l'écran **gGlobal** (☰ Menu > Variables) et appuyez sur **➕ New gGlobal**.
2. Tapez son **Name**. Il ne peut pas être vide, n'a pas d'espaces et doit être unique.
3. Choisissez sa **Kind** dans la liste.
4. La fenêtre de cette sorte s'ouvre sous le Name. La sorte montre maintenant 🔒 : elle est fixée.
5. Remplissez les champs de la sorte (plus bas).
6. Appuyez sur **💾 Save**, ou sur **✖ Cancel**. Si vous avez changé quelque chose, Cancel demande d'abord : **🗑 Discard changes** (abandonner les changements) ou **↩ Go back to Save** (revenir pour enregistrer).

La nouvelle gGlobal rejoint la liste de sa sorte sur l'écran gGlobal. Double-cliquez sur sa ligne pour rouvrir sa fenêtre (pour changer son Name, sa valeur ou ses réglages, ou pour la supprimer avec 🗑 Delete).

## Les fenêtres des sortes {#the-kind-dialogs}

Toutes suivent les règles générales des fenêtres : Name en premier, ✖ Cancel et 💾 Save en haut et en bas, et 🗑 Delete quand elle existe déjà.

- **⬆ (flèche rouge vers le haut)** à côté d'une chaîne ouvre la case **String Entry** : deux lignes pour taper, avec retour à la ligne.
- **⬢ (hexagone rouge)** ouvre une fenêtre avec les réglages en plus.

| Sorte | Champs |
|---|---|
| gS_Global_String | **.value** avec ⬆ |
| gG_Global_Graphic | **Image Path 1** (choisir dans la liste ou taper un chemin) avec ⬢ pour la **Graphic Dialog** : Background # (1, 2 ou 3 choisit l'Image Path 1-3), Back Colour, Image Path 1, 2 et 3 avec OPEN |
| gV_Global_Value | **.value**, Decimals, Units, Lowest allowed, Highest allowed |
| gB_Global_Boolean | **.value** sous forme d'interrupteur (activé = true) |
| gT_Global_Time | **.value** comme `01:30:00` |
| gD_Global_DateTime | **.value** à partir d'un sélecteur de date et d'heure |

Chaque sorte a aussi **Database and .API** avec un ⬢ pour ses réglages. Chaque gGlobal garde sa .value quand un Process démarre et quand le Brain redémarre : voir [Les gGlobals gardent leurs valeurs](118-gglobals-keep-their-values). La .value que vous tapez est sa première valeur.

## Exemple {#sample}

**➕ Add the sample gGlobals** sur l'écran gGlobal ajoute une de chaque sorte au Schema que vous avez ouvert :

| Nom | Sorte | .value |
|---|---|---|
| gS_Brewer_Note | gS_Global_String | Add the yeast nutrient at 10 minutes |
| gG_Brew_Day_Picture | gG_Global_Graphic | Images/Skynet/Miscellaneous/brewery_main.png |
| gV_Strike_Temp | gV_Global_Value | 163 °F (32 à 212) |
| gB_Grain_Added | gB_Global_Boolean | false |
| gT_Mash_Rest | gT_Global_Time | 01:00:00 |
| gD_Brew_Day_Start | gD_Global_DateTime | 2026-11-07 07:00:00 |

Un Process peut les utiliser ainsi :

```
if gB_Grain_Added == false
  gS_Brewer_Note.value = "Add the grain now"
  wait gB_Grain_Added == true
endif
gV_Strike_Temp.value = gV_Strike_Temp.value + 2
```

## Cancel demande avant de jeter les changements {#cancel-asks-before-throwing-changes-away}

Dans chaque fenêtre avec ✖ Cancel et 💾 Save, si vous avez changé quelque chose et appuyez sur Cancel (ou Échap), un avertissement demande : **🗑 Discard changes** ou **↩ Go back to Save**. Sans changement, Cancel ferme simplement.

## Les autres sortes de gGlobal {#the-other-gglobal-kinds}

Switch, Push Button, Pulse Button, List, Step et Long String ne sont **plus des gGlobals** : ils ont un état que vous voyez sur un Tab, ils vont donc dans une nouvelle classe, **Semi_Widgets_Devices**. En attendant qu'elle soit construite, ils sont toujours ajoutés sur un Tab en **Edit layout** et marchent comme avant : voir [Variables](04-variables).

Les anciennes gGlobals qui ne sont pas de vraies variables à portée globale deviendront un Widget Text ou un Widget Graphic, une à la fois. La liste de chaque gGlobal des Schemas livrés est dans docs/ExistingGlobals.md.
