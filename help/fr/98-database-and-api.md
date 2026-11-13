# Base de données et .API sur chaque Device et Widget {#database-and-api-on-every-device-and-widget}

Depuis le 2026-10-30, tout Device ou Widget qui a une valeur peut envoyer ses mesures à la base de données de brassage, et peut être lu ou changé par des programmes extérieurs. Les deux se règlent dans ses Properties, dans la case **Database and .API** à la fin. À cause de cela, gKonstant et gAPI sont devenus une seule classe de variables, **gGlobal** (plus bas).

Les images, les Labels et les cuves manuelles n'ont pas de valeur, ils n'ont donc pas de case.

## Base de données {#database}

**Send to the database** (envoyer à la base de données) dit quand une mesure est écrite :

| Choix | Écrit |
|---|---|
| **Off** | Jamais (au départ) |
| **On demand** | Seulement sur demande : une ligne `send_db` dans un Process, **Log now** sur l'écran Variables, ou l'API |
| **On value change** | Chaque fois que la valeur change, au plus 10 fois par seconde (le dernier changement n'est jamais perdu) |
| **When Clicked** | Chaque fois que quelqu'un le règle sur son Tab (un appui, puis Set), même à la même valeur |
| **When a Process starts** | Chaque fois que le Process que vous choisissez démarre |
| **At a date and time (once)** | Une fois, à la date et à l'heure que vous tapez, comme `2026-11-01T06:00` |
| **At clock time (every day)** | Chaque jour à l'heure que vous tapez, comme `12 AM`, `6:30 PM` ou `18:30` |
| **Every second**, **Every minute**, **Every hour** | Raccourcis : chaque seconde, minute ou heure |
| **Every day (at Midnight)** | Raccourci : chaque jour à minuit (12 AM) |
| **Every N milliseconds / seconds / minutes / hours / days** | Toutes les N de ces unités (le plus rapide est 100 ms) |
| **Every 00:00:00** | À chaque intervalle que vous tapez, comme `00:05:00` |

La case **At clock time** ne s'affiche que quand **At clock time** est choisi. **At clock time 12 AM** écrit à minuit chaque jour. Les choix **Every** n'ont pas d'heure ; un réglage enregistré avant comme « Every 1 day at 12 AM » devient tout seul **At clock time 12 AM**.

**What to send** (quoi envoyer) est sa valeur principale (la température d'une sonde, le on/off d'une sortie, le temps d'une minuterie ...) sauf si vous choisissez un de ses autres attributs, comme le `.setpoint` d'un PID.

### L'envoyer tout de suite depuis un Process {#send-it-now-from-a-process}

```
send_db HLT_Temp
send_db "gGV_Mash_pH"
```

`send_db Name` écrit la mesure tout de suite, quelle que soit sa fréquence, même quand elle est **Off**. C'était `log Name` ; les anciens Processes sont changés en `send_db` quand le Brain démarre (Règle Skynet 15.2).

### Groupes de base de données : envoyer seulement quand vous voulez {#database-groups-send-only-when-you-want}

**Les groupes sont la façon dont un ensemble de Devices et de Widgets est envoyé à la base de données, ou non.** Une ligne de Process commence à envoyer un groupe, et une autre ligne de Process l'arrête :

```
start_db_group Mash
stop_db_group Mash
```

- **Un Device ou un Widget peut appartenir à plus d'un groupe.** Sous **What to send** dans sa case Database and .API, vous voyez ses groupes et un bouton **👥 Groups…**. Il ouvre la **liste des groupes** :
  - **➕ Add new Group…** en haut fait un nouveau groupe : tapez son nom (lettres, chiffres et `_`, comme `Mash`, `Boil` ou `Readings`). Le nouveau groupe est alors choisi dans la liste.
  - **Cliquez** sur un groupe pour ouvrir la fenêtre du groupe avec tous ses membres.
  - **Double-cliquez** sur un groupe pour y ajouter ce Device ou Widget ; la fenêtre du groupe s'ouvre avec ses membres. Un ✔ dans la liste marque les groupes dont il fait partie.
  - Dans la fenêtre du groupe, **➖ Take it out of this Group** (le retirer de ce groupe) ou **➕ Add it** (l'ajouter) vous laisse changer d'avis, et **✏ Change name** renomme le groupe.
  - **💾 Save** dans la liste des groupes garde votre choix ; il est enregistré quand vous enregistrez les Properties.
- **Un élément dans un groupe n'est envoyé à la base de données que tant qu'un de ses groupes est démarré.** Il est envoyé selon son propre réglage **Send to the database** (Every 1 minute, On value change, When Clicked ...) : l'élément dit *à quelle fréquence*, le groupe dit *quand*. Un élément sans groupe est envoyé selon son réglage tout le temps.
- **On demand marche toujours.** `send_db Name` envoie l'élément tout de suite, même quand ses groupes sont arrêtés.
- `send_db_group Readings` envoie une fois, maintenant, chaque élément du groupe **Readings**, démarré ou non (une journée de brassage peut envoyer ses mesures à la fin, par exemple).
- Chaque groupe est arrêté quand le Brain démarre. La console des Processes affiche chaque démarrage et arrêt.

**Exemple : la sonde d'empâtage.** Vous voulez votre sonde de température d'empâtage dans la base de données chaque minute, mais seulement pendant l'empâtage.

1. Dans la case Database and .API de la sonde, réglez **Send to the database** sur **Every minute**. Appuyez sur **👥 Groups…** et double-cliquez sur **Mash** (➕ Add new Group… le crée la première fois).
2. Au début de votre Process d'empâtage, ajoutez la ligne `start_db_group Mash`. Dès lors, la sonde envoie sa mesure à la base de données chaque minute.
3. À la fin du Process d'empâtage, ajoutez la ligne `stop_db_group Mash`.

Votre base de données n'a les données de cette sonde que pendant l'empâtage. Si la sonde est aussi dans le groupe **Boil**, `start_db_group Boil` l'envoie aussi pendant l'ébullition.

- Un groupe a une clé cachée qui ne change jamais ; ses éléments pointent vers cette clé. **✏ Change name** dans la fenêtre du groupe change son nom, et **chaque Process** avec `send_db_group`, `start_db_group` ou `stop_db_group Old_Name` est changé tout de suite pour le nouveau nom (Update All). Un Process qui tourne garde l'ancien texte jusqu'à ce qu'il soit redémarré.
- **Check** dans l'éditeur de Process dit quand une de ces lignes nomme un groupe qui n'existe pas.

Les anciens choix **Once** et **In a Group** ont disparu (Règle Skynet 6.14). Quand un Schema se charge, chaque élément réglé sur Once ou In a Group devient **On demand** et reste dans son groupe (les éléments Once reçoivent le groupe nommé **Once**), donc une ligne de Process `send_db_group Once` les envoie toujours comme avant.

### Heure et clé cachée {#time-and-hidden-key}

Chaque mesure est gardée avec son **heure** et la **clé cachée** de l'élément (le nom qu'il avait alors est gardé aussi). Donc quand un élément est renommé avec ✏ Change name, l'écran [Log](06-log), les téléchargements CSV et l'API trouvent toujours toutes ses mesures sous le nom d'aujourd'hui. La clé ne quitte jamais le Brain : les listes et les fichiers CSV montrent des noms.

La base de données est un fichier SQLite sur le Brain (`data/brewlog.db`) : gratuit, SQL, rien à installer. Sur un Raspberry Pi, utilisez une carte SD assez grande pour les mesures que vous gardez. Envoyer les mesures vers une base de données extérieure (sur votre PC, Mac ou ordinateur Linux, ou une base de données en ligne gratuite ou payante) et vider la copie du Brain est une étape ultérieure.

## .API

| Choix | Programmes extérieurs (API web, MQTT, Home Assistant, voix) |
|---|---|
| **Off** | Ne peuvent pas le voir (au départ) |
| **Read Only (Get: outside programs like Node-Red can read it.)** | Peuvent le lire |
| **Read & Control (Get & Put: outside programs like Node-Red can also control it.)** | Peuvent le lire et le commander (le changer) |

**API_Name** (sous .API dans la fenêtre) est le nom que dit une commande vocale. Il doit être unique et peut être vide (avec un avertissement) : voir [API_Name](144-api-name-for-voice-commands).

Les adresses et les protections sont sur [API (other programs)](11-api). Une gGlobal n'apparaît dans MQTT et Home Assistant que quand son .API est activé, et ne peut y être changée qu'avec **Read & Control**.

Les choix s'appelaient Get only et Get and Put jusqu'au 2026-11-06. Skynet utilise d'abord l'anglais simple, avec les mots d'informatique entre ( ) ; ils marchent pareil. Dans les Règles et les autres pages d'aide, Get only veut dire Read Only et Get and Put veut dire Read & Control.

## gGlobal (une seule classe de variables) {#gglobal-one-variable-class}

gKonstant et gAPI sont maintenant une seule classe, **gGlobal**, avec les préfixes de noms `gG_`, `gGS_`, `gGV_`, `gGT_`, `gGDT_`, `gGB_`, `gGSW_`, `gGPB_`, `gGMB_`, `gGList_`, `gGStep_` (indications seulement). Voir [Variables](04-variables).

La première fois que le Brain démarre après cette mise à jour (Règle Skynet 15.2, rien d'ancien n'est gardé) :

- Chaque gKonstant et gAPI (et tout vKonstant ou vAPI qui traîne encore) devient une gGlobal, dans chaque Schema.
- Les noms qui commencent par `gK..._`, `gA..._` (ou `vK..._`, `vA..._`) deviennent `gG..._` : `gKV_Strike` devient `gGV_Strike`, `gAS_Note` devient `gGS_Note`. Si le nouveau nom est pris, `_2` est ajouté.
- Un ancien gAPI garde son déclencheur de base de données comme réglage **Database** et reçoit **.API = Get and Put**, il marche donc comme avant. Un ancien gKonstant commence avec Database Off et .API Off.
- C'est le même élément (sa clé cachée reste), donc chaque Process, les autres Devices et Widgets qui pointent vers lui, les valeurs enregistrées, la correspondance BeerXML et l'historique de la base de données de brassage suivent le nouveau nom.
- Les lignes `log Name` des Processes deviennent `send_db Name`.
- Les anciens fichiers sont gardés comme copies `.before-gglobal.bak`, et la liste de ce qui a changé s'affiche sur la page Processes.
