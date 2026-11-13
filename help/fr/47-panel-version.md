# La version du panel {#panel-version}

Le panel a deux codes de version :

- La **Panel version** est la version du programme lui-même. GitHub en crée une nouvelle chaque fois que du code est fusionné (merge).
- La **Schema version** est la version de votre configuration. Vous la créez vous-même (voir **About and Schema versions**).

## Où la voir {#where-you-see-it}

- Sur la **Menu Bar**, en petites lettres grises après le nom du panel, par exemple `PR85_Skynet-v.20261022_18_05`.
- Dans **☰ Menu > About**, à côté de **Panel version**, avec la date et l'heure de la fusion et une ligne qui dit si c'est la plus récente :
  - **Up to date: this is the latest merged version.** (à jour : c'est la dernière version fusionnée ; en vert)
  - **A newer version is on GitHub: ...** (une version plus récente est sur GitHub ; en jaune). Téléchargez et installez la nouvelle version (voir **Updating**).
  - **These files were changed after ...** (ces fichiers ont été changés après ...) : vous faites tourner une copie d'une pull request pas encore fusionnée, ou quelqu'un a modifié les fichiers du programme à la main. La version affichée est la dernière fusion sur laquelle elle a été construite, avec **+ changes** après.
  - **Could not check GitHub** (impossible de vérifier GitHub) : le Brain n'a pas Internet, ou le dépôt est privé. La Panel version elle-même est toujours juste.
  - **Not stamped** (pas tamponnée) : cette copie ne vient pas d'une fusion GitHub (par exemple un zip plus ancien). La prochaine version fusionnée règle cela.

Le lien **Versions on GitHub** ouvre la liste de toutes les versions (GitHub Releases), avec ce qui a changé dans chacune.

## Comment le nom est fait {#how-the-name-is-made}

`PR<number>_Skynet-v.yyyymmdd_hh_mm`. Pour l'instant, le nom commence par le numéro de la plus haute pull request fusionnée, pour que vous voyiez d'un coup d'œil quelles pull requests sont dans votre copie. Viennent ensuite l'année, le mois, le jour, l'heure et la minute de la fusion : par exemple `PR85_Skynet-v.20261022_18_05` contient toutes les pull requests jusqu'à la #85 et a été fusionnée le 22 octobre 2026 à 18:05. Les versions faites avant le 22 octobre 2026 n'ont pas de `PR<number>_` devant, par exemple `Skynet-v.20261021_16_30`. L'heure est en **UTC** (GMT), la même partout dans le monde. Si deux fusions arrivent dans la même minute, la seconde finit par `_2`.

Le premier mot dit à qui est cette copie du code. Le code original de Skynet Brewery (utilisateur GitHub **oakbarn**) dit **Skynet**. Quand quelqu'un fait sa propre copie sur GitHub (un fork) et y fusionne des changements, ses versions commencent plutôt par son nom d'utilisateur GitHub, par exemple `PR3_brewer42-v.20261105_19_02`. Vous pouvez donc toujours savoir de qui est la version que vous faites tourner.

## Comment ça marche {#how-it-works}

Quand une pull request est fusionnée dans la branche principale, GitHub lance **Panel version** (le fichier `.github/workflows/panel-version.yml`). Il :

1. Écrit le fichier `version.json` en haut du dossier du panel, avec le nom de la version, l'heure de la fusion et une empreinte des fichiers du programme.
2. Enregistre ce fichier dans la branche, pour que chaque téléchargement du code l'ait.
3. Crée un tag GitHub et une **Release** du même nom. Sur la page de la Release, **Source code (zip)** télécharge exactement cette version.

Ne modifiez jamais `version.json` à la main ni dans une pull request. Il appartient à GitHub.

L'onglet About demande à GitHub le `version.json` le plus récent (au plus toutes les 10 minutes). Rien sur votre brasserie n'est envoyé, c'est seulement un simple téléchargement de ce seul fichier.

## Les réglages GitHub {#github-settings}

Rien n'est à changer pour un dépôt personnel normal. Si le lancement de **Panel version** échoue (un ✗ rouge dans l'onglet **Actions** sur GitHub) :

- **Settings > Actions > General > Actions permissions** : choisissez **Allow all actions and reusable workflows**.
- **Settings > Actions > General > Workflow permissions** : choisissez **Read and write permissions**, puis **Save**.
- Si vous activez une protection de branche ou un ruleset pour la branche principale qui bloque les envois directs, le robot de GitHub lui-même ne peut pas non plus enregistrer `version.json`. Demandez à ce que le workflow soit changé avant de l'activer.

Vous pouvez aussi le lancer à la main : **Actions > Panel version > Run workflow**.

## Petite icône ou case de texte {#small-icon-or-text-box}

Sur la Menu Bar, la version est une petite case de texte. **Cliquez dessus** et elle devient une petite icône 🏷, pour prendre peu de place. **Cliquez sur le 🏷** et la case de texte avec la version revient. Chaque navigateur se souvient de celle que vous avez choisie. Passez la souris sur le 🏷 pour lire la version sans l'ouvrir.
