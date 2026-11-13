# Mash Profiles et Boil Profiles {#mash-and-boil-profiles}

Les Mash Profiles (profils d'empâtage) et les Boil Profiles (profils d'ébullition) sont gardés à part, donc n'importe quelle Recipe peut utiliser n'importe lequel. Une Recipe en choisit un de chaque dans une liste déroulante (bientôt), et l'onglet de menu **Default** dit avec lesquels commence une nouvelle Recipe. Ils sont enregistrés sur le Brain dans `config/profiles/mash` et `config/profiles/boil`.

## Mash Profile

Appuyez sur **☰ Menu** et choisissez **Mash Profile**.

- **Add new ...** dans la liste déroulante **Open** en crée un. Commencez avec un seul palier à 152 °F (67 °C) pendant 60 minutes, ou une copie d'un autre.
- Jusqu'à **4 paliers**, chacun avec un **Name**, une **Temperature** et un **Time** en minutes. Laissez un palier vide si vous n'en avez pas besoin.
- **Mash out temperature** (température de fin d'empâtage ; vide veut dire pas de mash out).
- **Sparge** (rinçage des drêches) : **Fly sparge** (rinçage continu), **Batch sparge** (rinçage par lots, avec un **temps de repos** en minutes), ou **No sparge** (pas de rinçage, volume complet).
- **Sparge water temperature** (température de l'eau de rinçage).

Appuyez sur **Save**. **Delete** le supprime.

## Boil Profile

Appuyez sur **☰ Menu** et choisissez **Boil Profile**.

- **Total boil time** (durée totale d'ébullition) en minutes.
- **Boil off** : combien s'évapore chaque heure, en gallons ou en litres. C'était avant dans le Equipment Profile.

Appuyez sur **Save**. La case **Check the volumes** de l'onglet Equipment Profile peut utiliser n'importe quel Boil Profile.

Les températures et les volumes suivent les **Units** du profil : US (°F, gallons) ou Metric (°C, litres).
