# Mises à jour officielles de Skynet {#official-skynet-updates}

Une **mise à jour officielle de Skynet** est une version de Skynet qu'**OakBarn Brewery** a construite et publiée sur sa propre page Releases de GitHub.
Chaque fois que Skynet démarre, il vérifie que ses fichiers du programme sont toujours exactement ceux qu'OakBarn Brewery a envoyés. Si quelque chose a
été changé, il **vous avertit** (Règle Skynet 9.14).

## Skynet est open source {#skynet-is-open-source}

Skynet est open source, sous la **licence MIT**. Tout le monde peut en lire chaque ligne sur GitHub, le copier, et faire sa propre version.
Cela reste vrai. Ce que la vérification ajoute, c'est que vous savez toujours si le Skynet de **votre** Brain est toujours le **Skynet officiel**,
exactement tel qu'OakBarn Brewery l'a envoyé, ou si quelque chose y a été changé.

## Où vous le voyez {#where-you-see-it}

- **Sur la Menu Bar**, après le nom de la version :
  - **✓ Official** : chaque fichier du programme est celui qu'OakBarn Brewery a envoyé.
  - **⚠ Changed** : certains fichiers du programme ne sont pas comme OakBarn Brewery les a envoyés.
  - **⚠ Not Official** : ce Skynet ne vient pas d'OakBarn Brewery. C'est la copie de quelqu'un d'autre, ou une copie de test jamais publiée.
  - **⚠ Not checked** : Skynet n'a pas trouvé de liste avec laquelle comparer.
- **Une barre rouge en haut de chaque écran** quand il n'est pas officiel. **Details** ouvre **☰ Menu > About**, **Help** ouvre cette page,
  et **✕** ferme la barre jusqu'à la vérification suivante.
- **☰ Menu > About > Official Skynet** donne le résultat, l'heure de la vérification, et les noms des fichiers **Changed** (changés),
  **Missing** (manquants) ou **Added** (ajoutés). **🔍 Check again** vérifie de nouveau chaque fichier.

La vérification **n'arrête jamais rien**. Un brassage en cours continue, quoi qu'elle trouve.

## Comment Skynet le sait {#how-skynet-knows}

1. **Chaque mise à jour officielle vient avec une liste.** Quand OakBarn Brewery publie une version, GitHub écrit une liste de chaque fichier
   du programme, chacun avec sa propre **empreinte**. Une empreinte est un long code calculé à partir de chaque lettre du fichier (un
   hachage SHA-256). Changez une lettre et l'empreinte est complètement différente.
2. **À chaque démarrage, Skynet calcule l'empreinte de chacun de ses fichiers du programme** et la compare à la liste.
3. **Il demande la liste de cette même version au propre GitHub d'OakBarn Brewery**, donc une liste changée sur le Brain ne peut pas le tromper
   non plus. Sans internet, il utilise la liste qui est venue avec lui, et **☰ Menu > About** le dit.
4. **Officiel et inchangé ? Les fichiers du programme sont mis en lecture seule**, pour que le Bloc-notes et les autres éditeurs ne puissent pas en écraser un par accident.
   Le Setup et les installateurs enlèvent la lecture seule tout seuls quand ils mettent Skynet à jour.

## Ce qui est vérifié, et ce qui est à vous {#what-is-checked-and-what-is-yours}

**Vérifié (le programme) :** `server.js`, `importer.js`, `package.json` et les dossiers `lib`, `public`, `templates`, `firmware`, `install`
et `samples`.

**Jamais vérifié ni touché (à vous) :** vos Schemas, Tabs, Devices, Widgets et réglages (`config`), les utilisateurs, mots de passe et données de brassage
(`data`), les images et sons (`media`), les Processes (`processes`), les pages d'aide (un Admin peut les modifier dans le panneau), les Sample
Schemas supplémentaires (`sample_schemas`) et vos propres Templates.

## Repair

Quand **⚠ Changed** s'affiche, un **Admin** peut cliquer sur **🛠 Repair** dans **☰ Menu > About > Official Skynet** :

- Il récupère le fichier officiel de cette même version pour chaque fichier changé ou manquant, directement depuis le GitHub d'OakBarn Brewery. Il
  a besoin d'internet.
- Chaque téléchargement est vérifié par rapport à la liste officielle avant d'être utilisé.
- Les fichiers changés qu'il remplace, et tout fichier ajouté, sont **déplacés** dans `backups/changed_files_<date>`. Rien n'est supprimé.
- Vos propres fichiers (ci-dessus) ne sont jamais touchés.
- Fermez ensuite Skynet Brewer et relancez-le, pour qu'il utilise les fichiers réparés.

Pas d'internet ? Relancez le Setup (ou l'installateur) de la même version. Il remet aussi chaque fichier du programme.

## Pourquoi un fichier peut apparaître comme Changed {#why-a-file-might-show-as-changed}

- Quelqu'un a ouvert un fichier du programme dans un éditeur et l'a enregistré.
- Une copie a été faite à partir d'une version de test jamais publiée.
- Un virus ou un autre programme a changé un fichier. C'est rare, mais c'est la raison de regarder chaque fois que vous voyez **⚠ Changed**.

Un programme changé pourrait faire des choses qu'OakBarn Brewery ne lui a jamais fait faire, comme mettre en marche une résistance ou une pompe. Si vous ne l'avez pas changé
vous-même, faites **Repair** avant de brasser.

## Ce qu'elle ne peut pas faire {#what-it-can-t-do}

L'administrateur d'un ordinateur peut changer n'importe quel fichier dessus, cette vérification comprise. Donc elle **trouve et signale** les changements ; elle
ne peut pas les rendre impossibles. Pour votre brasserie, les bonnes habitudes sont :

- Obtenir Skynet seulement depuis la **page Releases d'OakBarn Brewery** sur GitHub, ou depuis oakbarnbrewery.com.
- Installer et mettre à jour avec le **Setup** (ou l'installateur de votre ordinateur).
- Chercher **✓ Official** sur la Menu Bar.

## Vérifications antivirus {#virus-checks}

- **À chaque Release :** après qu'OakBarn Brewery a publié une version, GitHub analyse chaque `.exe` avec **Microsoft Defender**. S'il trouve
  quelque chose, la Release est cachée jusqu'à ce qu'OakBarn Brewery l'ait regardée. Une analyse propre ajoute une ligne **Virus check** aux notes
  de la Release. Une fois la clé VirusTotal gratuite d'OakBarn Brewery configurée, environ 70 antivirus examinent aussi chaque `.exe`, et les notes de la
  Release donnent le compte.
- **Le Setup reçoit la signature d'OakBarn Brewery** (Règle Skynet 9.10) une fois la signature configurée, pour que Windows puisse montrer qui l'a fait.

### Vérifier vous-même un Setup .exe, gratuitement {#check-a-setup-exe-yourself-for-free}

Tout le monde peut vérifier un fichier sur **virustotal.com**. Aucun compte n'est nécessaire.

1. Ouvrez `virustotal.com` dans votre navigateur.
2. Cliquez sur **Choose file** et choisissez le `.exe` du Setup que vous avez téléchargé (par exemple `Skynet_Brewer_Setup_<version>.exe`).
3. Attendez une minute ou deux pendant qu'environ 70 antivirus l'examinent.
4. Lisez le résultat. **0** sur environ 70 est un fichier propre. Avec un installateur tout neuf, un ou deux antivirus **devinent** parfois mal (un
   faux positif). Si plusieurs le signalent, ne le lancez pas, et prévenez OakBarn Brewery.

VirusTotal garde une copie de chaque fichier qu'on lui envoie. C'est sans problème pour le Setup de Skynet, qui est public de toute façon. **N'envoyez jamais un fichier
à vous qui contient des mots de passe ou d'autres informations privées.**
