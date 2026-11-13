# Passer à une nouvelle version {#updating-to-a-new-version}

**Un seul zip fait les deux :** une première installation et chaque mise à jour. Le zip n'a **pas** de dossiers `config`, `data`, `media` ni `scripts`, donc le décompresser par-dessus votre panel ne peut pas remplacer les vôtres. Leurs exemples sont dans un dossier appelé `defaults`, et le panel ne les copie qu'à son tout premier démarrage, dans un dossier que vous n'avez pas encore.

**Les images et les sons Skynet sont un téléchargement à part**, le Skynet Media Setup (Windows) ou le zip Skynet Media. Il n'ajoute que ceux que vous n'avez pas encore et n'en change ni n'en supprime jamais aucun. Voir [Le Skynet Media Setup](183-skynet-media-setup).

**D'autres Sample Schemas (Schemas d'exemple) sont aussi un téléchargement à part**, le Skynet Sample Schemas Setup (Windows) ou son zip. Le panel n'est livré qu'avec l'exemple 3 Vessel. Voir [Le Skynet Sample Schemas Setup](184-skynet-sample-schemas-setup).

| Dossier | Ce qu'il contient | Lors d'une mise à jour |
|---|---|---|
| `config` | Vos Tabs, Devices, Widgets et réglages (`brewery.json`) | **Gardé.** Pas dans le zip. |
| `data` | Journal de brassage, valeurs enregistrées, utilisateurs, mots de passe, connexions, le code de secours | **Gardé.** Pas dans le zip. |
| `media` | Vos images et vos sons | **Gardé.** Pas dans le zip. |
| `scripts` | Vos Processes | **Gardé.** Pas dans le zip. |
| `help` | Ce manuel | Remplacé par le nouveau manuel. Les programmes d'installation copient d'abord les anciennes pages dans `help/backups/before_update_<date>`. |
| `defaults` | La disposition et les Processes d'exemple | Remplacé. Utilisé seulement pour un dossier que vous n'avez pas. |
| `sample_schemas` | Les Sample Schemas en plus du Sample Schemas Setup, et tout Schema d'un autre brasseur | **Gardé.** Pas dans le zip. |
| Tout le reste (`lib`, `public`, `server.js`, `samples` …) | Le programme lui-même | Remplacé. |

**Vous voulez retrouver les exemples dans un dossier ?** Relancez le programme d'installation et répondez **No** à « Keep all of them as they are? » (tout garder tel quel ?). Il pose alors la question pour chaque dossier (config, scripts, data) et déplace ceux que vous choisissez vers `backups/<folder>_<date>`. Ou faites-le vous-même : arrêtez le panel et renommez le dossier (par exemple `scripts` en `scripts_old`). Le panel copie les exemples dans un nouveau `scripts` au démarrage suivant. (Les images et les sons ne sont jamais remplacés : renommez `media` seulement si vous voulez le recommencer, puis relancez le Skynet Media Setup.)

> **Les connexions sont gardées.** Une nouvelle version garde chaque utilisateur, mot de passe et le **code de secours**. La seule fois où une mise à jour les supprime, c'est quand vous choisissez **Update the program and reset all users** ou **Start Fresh** dans le programme d'installation et confirmez l'avertissement. Voir [Connexion, utilisateurs et mots de passe](10-login).

## Chaque mise à jour : arrêtez d'abord le panel {#every-update-stop-the-panel-first}

Pendant que le panel tourne, ses fichiers sont ouverts (la base de données du journal de brassage, les utilisateurs et les valeurs enregistrées). Copier par-dessus des fichiers ouverts échoue avec des erreurs comme « The action can't be completed because the file is open in Node.js » ou « Access denied ».

- **Windows :** cliquez sur la fenêtre de commande noire du panel, appuyez sur **Ctrl + C** (tapez **Y** s'il demande `Terminate batch job (Y/N)?`), puis fermez la fenêtre.
- **Mac / Linux :** appuyez sur **Ctrl + C** dans la fenêtre Terminal du panel.
- **Raspberry Pi :** le programme d'installation arrête et redémarre le service du panel tout seul.

### Windows : si des fichiers sont encore verrouillés {#windows-if-files-are-still-locked}

Parfois, Node.js continue de tourner en arrière-plan après la fermeture de la fenêtre. Pour l'arrêter :

1. Appuyez sur **Ctrl + Maj + Échap** pour ouvrir le **Gestionnaire des tâches** (Task Manager). S'il a l'air petit, cliquez sur **Plus de détails** (More details).
2. Dans l'onglet **Processus** (Processes ; Windows 11 : la première icône à gauche), trouvez **Node.js JavaScript Runtime** (ou `node.exe`).
3. Cliquez dessus, puis sur **Fin de tâche** (End task). Faites-le pour chaque ligne Node.js.

Toujours verrouillé ? Redémarrez l'ordinateur, et ne lancez pas le panel avant la fin de la mise à jour.

## Mettre à jour avec le programme d'installation (le plus simple) {#update-with-the-installer-easiest}

Lancez le même programme d'installation que la première fois, celui de la nouvelle version. Il voit que le panel est déjà là et le **met à jour** :

- **Windows :** `Skynet_Brewer_Setup_<date>.exe`. Gardez le même dossier (`C:\Brewing\BrewPanel`).
- **Mac :** `Install Skynet Brewer.command` à côté du nouveau zip.
- **Linux / Pi :** `bash install-skynet-brewer.sh` à côté du nouveau zip.

Il demande d'abord ce que fait cette mise à jour (voir [The three update choices](#the-three-update-choices) plus bas ; le troisième, déjà choisi, garde tout). Puis il demande **Keep all of them as they are?** pour vos dossiers config, data, media et scripts. **Yes** (la réponse normale) les garde tous. Il met aussi une copie de votre disposition dans `config/backups/brewery_before_update_<date>.json`, au cas où. Les dates dans les noms de fichiers et de dossiers sont au format ISO 8601, par exemple `20261023T113005` (année, mois, jour, T, heure, minute, seconde).

## Les trois choix de mise à jour {#the-three-update-choices}

Quand le programme d'installation trouve le panel déjà là, il demande ce que fait cette mise à jour. Les fichiers du programme sont toujours mis à jour. Sous Windows, c'est une page avec trois boutons ronds ; sur un Mac, sous Linux ou sur un Pi, vous tapez **1**, **2** ou **3**.

1. **Start Fresh : tout supprimer.** Le panel comme s'il n'avait jamais été installé. Un deuxième avertissement, rouge, vient d'abord : **ALL EXISTING DATA WILL BE DELETED** (toutes les données existantes seront supprimées). Il liste ce qui part, pour de bon et sans sauvegarde :
   - chaque Schema, Tab, Device, Widget et réglage (`config`)
   - chaque utilisateur, mot de passe, connexion et le code de secours, le journal de brassage et les valeurs enregistrées (`data`)
   - chaque Process (`scripts`)

   Vos images et vos sons (`media`) et le dossier `backups` sont **gardés**.
   - **No** sur l'avertissement revient en arrière. Rien n'est supprimé.
   - **Yes** les supprime. Le panel démarre alors comme une nouvelle installation à partir des exemples, et vous recréez le compte admin (notez le nouveau **code de secours**).
   - Sous Windows, il supprime aussi le nom d'utilisateur et le mot de passe dont se souvenait la fenêtre propre de Skynet, pour que rien d'ancien ne soit rempli. La fenêtre de Skynet ne se synchronise jamais avec votre compte Microsoft, donc une connexion synchronisée ne peut pas revenir non plus. Vous pouvez toujours enregistrer votre mot de passe dans la fenêtre de Skynet, et il se remplit au moment de Sign in comme d'habitude. Les cases de création de l'admin restent vides tant que vous ne cliquez ou ne tapez pas dedans, même si votre navigateur a enregistré un mot de passe pour le panel.

2. **Update the program and reset all users** (mettre à jour le programme et réinitialiser tous les utilisateurs). Un avertissement vient d'abord ; **No** revient en arrière et rien n'est supprimé. **Yes** supprime, pour de bon :
   - chaque utilisateur et mot de passe
   - chaque connexion, sur chaque ordinateur et téléphone
   - le code de secours
   - sous Windows, le nom d'utilisateur et le mot de passe dont se souvenait la fenêtre propre de Skynet

   Vos Schemas et réglages (`config`), le journal de brassage et les valeurs enregistrées (`data`), les Processes (`scripts`), les images et les sons (`media`) sont **gardés**. Le panel s'ouvre sur la création de l'admin : recréez le compte admin et notez le nouveau **code de secours**.
3. **Update the program and keep everything** (mettre à jour le programme et tout garder ; recommandé, et déjà choisi pour vous). Vos Schemas, réglages, utilisateurs et mots de passe, journal de brassage, Processes, images et sons restent tels quels.

Le programme d'installation Windows (`Skynet_Brewer_Setup_<date>.exe`), celui du Mac et celui de Linux / Pi le demandent tous. Si Windows ne peut pas supprimer un fichier parce qu'un programme l'a encore ouvert, le programme d'installation le dit : redémarrez l'ordinateur et relancez-le.

> Vous voulez remettre un seul dossier aux exemples ? Choisissez **3** (ou **2**), puis répondez **No** à « Keep all of them as they are? » (plus haut). Cela déplace un dossier vers `backups` au lieu de le supprimer.

## Mettre à jour à la main : décompresser par-dessus le panel {#update-by-hand-unzip-over-the-panel}

1. Arrêtez le panel (plus haut).
2. Par sécurité, copiez votre dossier du panel : clic droit sur `C:\Brewing\BrewPanel`, **Copier**, puis **Coller**.
3. Clic droit sur `Skynet_BrewPanel_<date>.zip`, choisissez **Extraire tout…**, et extrayez dans **`C:\Brewing`** (le dossier *au-dessus* de BrewPanel).
4. Quand Windows demande ce qu'il faut faire des fichiers qui ont le même nom, choisissez **Remplacer les fichiers dans la destination**. Cela ne remplace que les fichiers du programme, les pages d'aide et les exemples de `defaults`. Vos `config`, `data`, `media` et `scripts` ne sont pas dans le zip.
5. Relancez le panel avec **Skynet Brewer** sur le Bureau.

> **Les zips d'avant le 5 octobre 2026** contenaient encore `config`, `media` et `scripts`. Si vous décompressez l'un d'eux par-dessus votre panel, choisissez **Ignorer ces fichiers** (ou renommez d'abord vos dossiers), sinon il remplace les vôtres.

Sur le Raspberry Pi à la main : `sudo systemctl stop skynet-brewer`, décompressez par-dessus le dossier du panel (`unzip -o Skynet_BrewPanel_<date>.zip -d ~/Brewing`), puis `sudo systemctl start skynet-brewer`.
