# Schema.json (enregistrer un Schema dans un fichier .json) {#schema-json-save-a-schema-as-a-json-file}

**Schema.json** sur la Menu Bar (Admins seulement ; il s'appelait **Config** avant) ouvre la page Schema.json. Sur un Tab, la Menu Bar peut être cachée : ouvrez-la avec **☰ Menu > Show Menu Bar**.

La page fait deux choses :

1. Elle montre le Schema chargé et les réglages du panel sous forme de texte (`config/brewery.json`), pour que vous puissiez les modifier. **Check**, **Save**, **Find**, **Reload** et **Backups** marchent comme avant (voir *Process editor > The Schema.json editor*).
2. **Save as .json file** enregistre un Schema comme un seul fichier `.json` sur l'ordinateur que vous utilisez.
3. **Open a Schema file** ajoute un Schema à partir d'un fichier `.json` : un que le BruControl Importer a enregistré, ou un enregistré avec Save as .json file.

## Save as .json file

1. Cliquez sur **Schema.json** sur la Menu Bar.
2. Cliquez sur **Save as .json file**.
3. Choisissez le Schema. Celui qui est chargé est le premier et il est choisi pour vous.
4. Appuyez sur **Save**. Le fichier va dans le dossier Téléchargements de cet ordinateur (votre navigateur peut demander où le mettre).

Le fichier porte le nom de la version du Schema, par exemple `Main_Brewery_20261021T1405.json`. Un Schema qui n'a pas encore de version reçoit son nom et l'heure actuelle, sous la même forme `Name_yyyymmddThhmm` (ISO 8601). Les espaces deviennent `_`.

## Open a Schema file

1. Cliquez sur **Schema.json** sur la Menu Bar.
2. Cliquez sur **Open a Schema file**.
3. Choisissez un fichier du **Import folder** (`C:\Brewing\Import`, où le BruControl Importer enregistre ses fichiers, les plus récents en premier),
   ou **A .json file on this computer…** pour en choisir un n'importe où.
4. Laissez **Load it now** actif pour y passer tout de suite, ou éteint pour simplement l'ajouter à vos Schemas.
5. Appuyez sur **Save**.

Le Schema est ajouté sous son propre nom. Si un Schema de ce nom est déjà là, le nouveau reçoit `#2`, `#3` et ainsi de suite :
un Schema existant n'est jamais écrasé. Les Processes du fichier sont ajoutés aux Processes partagés ; quand un Process de même
nom mais avec un texte différent est déjà là, l'ancien est d'abord gardé en sauvegarde. Un court rapport montre ce qui a été ajouté et
les notes d'importation. Un fichier marqué **first draft** (premier brouillon) vient de l'Importer d'avant que ses étapes de questions soient faites : vérifiez-le avant
de brasser avec.

## Partager un Schema avec un autre brasseur {#sharing-a-schema-with-another-brewer}

La liste Schema a les deux mêmes choses, donc vous n'avez pas besoin de la page Schema.json pour partager :

- **Export to share ...** (liste déroulante Schema, ou ☰ Menu > 🗂 Schema > **📤 Export to share**) enregistre un Schema dans un fichier `.json`, comme Save as .json file. Envoyez ce fichier à l'autre brasseur.
- **Import a brewer's Schema ...** (liste déroulante Schema, ou ☰ Menu > 🗂 Schema > **📥 Import a brewer's Schema**) ajoute un fichier Schema qu'un autre brasseur vous a donné, comme Open a Schema file. **L'endroit où le mettre est le Import folder** (`C:\Brewing\Import`), ou choisissez-le n'importe où sur votre ordinateur. Il arrive toujours comme un nouveau Schema : aucun des vôtres n'est écrasé.

> **Skynet ne vérifie pas ce qu'il y a dans un fichier Schema, à l'envoi ou à l'arrivée.** Les images, les sons, les noms et tout ce qu'il contient, et tout droit d'auteur sur eux, regardent les brasseurs entre eux.

Les images et les sons ne sont pas dans le fichier, seulement leurs noms. Si l'autre brasseur a utilisé des images que vous n'avez pas, elles s'affichent comme manquantes jusqu'à ce que vous les ajoutiez.

## Ce qu'il y a dans le fichier {#what-is-in-the-file}

- Les Tabs, Devices, Widgets, images, textes, tuyaux rigides et souples, sondes du Schema et les Processes qu'il lance tout seul (liste autostart).
- L'équipement et la tuyauterie du Equipment Profile de chaque Tab, pour que le fichier soit complet à lui seul, et le nom du profil de chaque Tab.
- Le nom du Schema, sa version et quand le fichier a été enregistré.

Ce qui n'est **pas** dans le fichier : les connexions et les mots de passe, l'API key, les réglages MQTT, les dossiers media et les autres réglages du panel. Donc le fichier peut être donné à un ami sans risque. Les Processes eux-mêmes (le dossier `scripts`) sont partagés par tous les Schemas et ne sont pas dedans non plus.

Les changements non enregistrés dans l'éditeur ne sont pas dans le fichier. Appuyez d'abord sur **Save** si vous voulez qu'ils y soient.

Seuls les Admins voient le bouton et peuvent enregistrer un Schema de cette façon.
