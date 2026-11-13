# Log (la base de données de brassage) {#log-the-brew-database}

L'écran **Log** montre les valeurs écrites dans la base de données de brassage (`data/brewlog.db` sur le Brain), et les transforme en fichiers CSV pour Excel, Google Sheets ou LibreOffice.

Ce qui est écrit, et quand, se règle dans les Properties de chaque Device ou Widget, dans la case **Database and .API** : voir [Database and .API](98-database-and-api). Tout Device ou Widget qui a une valeur peut être enregistré. Les lectures sont gardées sous la clé cachée de l'élément, donc un élément renommé montre toujours toutes ses lectures sous son nom actuel.

## Download CSV

La case en haut de la page Log crée un fichier CSV et l'enregistre sur l'ordinateur ou le téléphone que vous utilisez.

1. **Cochez les valeurs** voulues, comme `HLT_Temp`, `MLT_Temp` et `RIMS_Temp`. Le nombre après chaque nom est le nombre de lectures qu'il a. **Tick all** et **Untick all** aident pour les longues listes.
2. Choisissez le **Time** (la période) : Last hour, Last 4 hours, Last 12 hours, Today, Last 24 hours, Last 7 days, Last 30 days, Everything, ou **From ... To ...** pour votre propre début et fin.
3. Choisissez le **Layout** (la mise en forme) :
   - **One column per value (for graphs)** : une ligne par instant, avec les colonnes Time, Minutes, puis une colonne par valeur cochée. Les lectures écrites dans la même seconde partagent une ligne. Minutes compte à partir de la première lecture du fichier, donc un empâtage ou une fermentation commence toujours à 0. C'est celle à utiliser pour un graphique : sélectionnez la colonne Minutes et les colonnes de valeurs et insérez un graphique en courbes.
   - **One row per reading** : Time, Name, Value et Trigger, exactement comme chaque lecture a été écrite. Les lectures d'un [simulated brew](20-simulation) ont un Trigger qui commence par `sim`.
4. Appuyez sur **Download CSV**.

Les heures sont à l'heure locale de l'ordinateur ou du téléphone sur lequel vous téléchargez, écrites comme `2026-10-21 14:05:03`, pour qu'Excel et Sheets les lisent comme des dates et des heures.

### Nom du fichier {#file-name}

Le fichier s'appelle `Skynet_Log_` + ce qu'il contient + la date et l'heure de sa première lecture, comme :

- `Skynet_Log_Mash_Profile_20261021T1405.csv` pour le jeu CSV Mash Profile
- `Skynet_Log_HLT_Temp_20261021T1405.csv` pour une seule valeur
- `Skynet_Log_3_values_20261021T1405.csv` pour plusieurs valeurs cochées

Quand il n'y a aucune lecture dans la période, le fichier n'a que sa ligne d'en-tête et la date est celle d'aujourd'hui.

### Jeux CSV (Mash Profile, Fermentor Profile ...) {#csv-sets-mash-profile-fermentor-profile}

Un jeu CSV (CSV set) est une liste de valeurs enregistrée, pour que les valeurs que vous voulez toujours ensemble soient à un seul choix.

1. Cochez les valeurs, par exemple `MLT_Temp`, `RIMS_Temp` et `HLT_Temp` pour l'empâtage.
2. Appuyez sur **Save as set** et donnez-lui un nom, comme `Mash Profile`. Réutilisez le même nom pour changer un jeu.
3. La prochaine fois, choisissez **Mash Profile** dans la liste **CSV set** : ses valeurs sont cochées pour vous. Choisissez la période et appuyez sur **Download CSV**.

**Delete set** supprime le jeu, jamais les lectures. Les jeux CSV appartiennent au Schema, donc chaque Schema garde les siens. Les brasseurs (Operators) et les Admins peuvent enregistrer et supprimer des jeux ; les comptes en lecture seule peuvent télécharger.

> Un bon Fermentor Profile : donnez à `Ferm_Temp` (et à la densité du Tilt, quand vous en avez un) **Send to the database: Every 15 minutes** dans ses Properties, puis téléchargez avec **Last 7 days** ou **Last 30 days**.

## Regarder les lectures {#look-at-the-readings}

1. Choisissez un nom, ou laissez sur tous.
2. Réglez **From** et **To** si vous voulez une période, et **Max** lignes.
3. Appuyez sur **Show** : les lectures les plus récentes sont en haut.

> Les graphiques à l'écran ne sont pas encore faits. Utilisez **Download CSV** et un graphique dans Excel ou Sheets pour l'instant.

Pour les autres programmes, l'API donne toujours la liste brute à `/api/log.csv` (voir [API](11-api)).
