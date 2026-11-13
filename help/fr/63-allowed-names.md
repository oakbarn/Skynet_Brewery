# Caractères permis dans les noms {#allowed-characters-in-names}

Certains caractères ne peuvent pas être utilisés dans les noms, parce qu'ils cassent les Processes, ou parce que Windows, Mac ou Linux ne peut pas enregistrer un fichier qui les contient. Quand un nom n'est pas permis, le panel vous dit pourquoi dans un message en bas de l'écran, et rien n'est enregistré tant que vous ne l'avez pas corrigé.

Seul un **nouveau** nom, ou un nom que vous **changez**, est vérifié. La seule exception est la liste de caractères ci-dessous : les anciens noms qui en ont sont changés pour vous (voir **Anciens noms** plus bas).

## Noms des Devices, Widgets et de tout ce qu'un Process utilise {#names-of-devices-widgets-and-everything-a-process-uses}

Un nom de Device, Widget, gGlobal, Text, tuyau, cuve ou autre élément n'a que des **lettres, des chiffres, `_`, `~`, `@` et `°`**, et commence par une lettre ou `_`. Un tel nom marche dans un Process sans guillemets, et ne pose pas de problème sous Windows, Mac, Linux et MQTT. Toute autre marque (une espace, `-` `+` `=` `!` `#` `'` `$` `%` `^` `&` `(` `)` `[` `]` `{` `}` `;` `,` `.` et l'accent grave seul, une lettre accentuée, `©` `®` `™`) est refusée, avec un message qui dit laquelle.

- `@` et `~` sont gardés pour le **Suggested Name**. Le programme les y met (`BM_15_DO@Pump_Red~Pump_BH`) ; un nom que vous tapez vous-même ne peut pas en avoir, utilisez donc `_`.
- `°` est permis : `Temp_°F`.
- Un mot du langage des Processes (`NULL`, `true`, `if`, `wait` ...) ne peut pas être un nom. Voir [Le langage des Processes et les étapes](22-process-language), Reserved words (mots réservés).
- Aucun nom ni **Label** ne peut commencer ou finir par une espace. Un Label est raccourci dès que vous quittez sa case.
- Un **Label** peut avoir presque n'importe quelle marque, mais pas `©` `®` `™` (réservés aux mentions de copyright et de marque de la licence MIT de Skynet) ni `@` `~` (gardés pour le Suggested Name). Pendant que vous tapez, `©` `®` `™` sont retirés et `@` `~` deviennent une espace. La liste complète, avec la raison pour chaque marque : [Special characters in names](https://github.com/oakbarn/Skynet_Brewery/blob/claude/project-thread-vzxi0a/docs/Special_Characters.md).

Votre **Label** peut avoir les autres marques : il est seulement affiché. Dans le Suggested Name, chacune devient `~`, et un accent est enlevé (*Würze #2* donne `Wurze~~2`).

**Les noms de Tabs et d'Interfaces** sont des noms affichés (*Brew House*, *Brewery Mega*), ils peuvent donc avoir des espaces ; leurs ID (`BH`, `BM`) sont simples. (Les noms de Templates de l'utilisateur ne servent qu'à choisir un Template, ils ne sont donc pas touchés.) Aucun nom ne peut avoir :

- l'un de ceux-ci : `<` `>` `:` `"` `/` `\` `|` `?` `*`

- des caractères de contrôle (des caractères cachés qui viennent parfois avec un copier-coller)
- une espace au début ou à la fin (les espaces au milieu deviennent `_` pour vous)
- un point `.` au début
- des emoji, comme 🍺 ou ✅
- un des noms que Windows garde pour lui : `CON`, `PRN`, `AUX`, `NUL`, `COM1` à `COM9`, `LPT1` à `LPT9`

`CON_2` ou `COM10` sont permis : seuls les noms exacts sont gardés par Windows.

Utilisez `_` à la place : `Hot_Cold`, pas `Hot/Cold`. Un nom de Device proposé le fait déjà avec votre Label : chacun de ces caractères (et `.` `,`) devient un `~`.

### Anciens noms {#older-names}

**Noms simples :** la première fois qu'un Schema se charge, un nom de Device, Widget ou élément qui a une marque autre que des lettres, des chiffres, `_`, `~`, `@` et `°` est changé une fois : chaque marque devient `~` et un accent est enlevé (`Red-Pump` devient `Red~Pump` ; si ce nom est pris, `Red~Pump_2`). Chaque Process et chaque réglage qui l'utilise suit.

Quand le panel démarre, ou qu'un Schema est ouvert, un nom qui a encore un de `<` `>` `:` `"` `/` `\` `|` `?` `*` est changé une fois : chacun devient un `~` (`Pump:1` devient `Pump~1` ; si ce nom est pris, `Pump~1_2`). C'est le même élément (il garde sa clé cachée), et :

- l'écran montre toujours l'ancien nom (il devient le Label, sauf si l'élément en avait déjà un)
- chaque Process suit : `"Pump:1".visible` devient `"Pump~1".visible`
- les réglages qui pointent vers lui, les tuyaux, les valeurs enregistrées et le journal de brassage suivent aussi (pour un Tab, tout ce qui est dessus bouge avec lui)
- les anciens fichiers sont gardés : `brewery.before-safe-names.bak` dans le dossier config et `<Process>.txt.before-safe-names.bak` dans le dossier des scripts

Le Process Log dit ce qui a été renommé.

## Noms de fichiers et de dossiers {#file-and-folder-names}

Cela concerne les images et les sons que vous envoyez ou renommez dans le gestionnaire Media, les nouveaux dossiers, les fichiers envoyés avec le **File Move Utility**, et les noms de **Process** (chaque Process est un fichier, `scripts/<name>.txt`).

Un nom de fichier ou de dossier ne peut pas avoir :

- l'un de ceux-ci : `<` `>` `:` `"` `/` `\` `|` `?` `*`
- des caractères de contrôle
- une espace au début ou à la fin
- un point `.` au début
- des emoji
- un des noms Windows `CON`, `PRN`, `AUX`, `NUL`, `COM1` à `COM9`, `LPT1` à `LPT9`, même avec une extension (`CON.txt` n'est pas permis non plus)

Un point `.` est permis **seulement avant l'extension du fichier** :

| Nom | Permis ? |
|---|---|
| `Mash_Steps.txt` | oui |
| `Burner No Flame.png` | oui |
| `Burner.No.Flame.png` | non, utilisez `Burner_No_Flame.png` |
| `Mash_v1.2` comme nom de Process | non, un nom de Process n'a pas de point : utilisez `Mash_v1_2` |
| `My.Pictures` comme dossier | non, un dossier n'a pas de point |

Dans un fichier zip que vous envoyez, un fichier dont le nom n'est pas permis est sauté, et la liste des fichiers sautés dit pourquoi.
