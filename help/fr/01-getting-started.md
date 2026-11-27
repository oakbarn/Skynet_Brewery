# Pour commencer {#getting-started}

Bienvenue dans le **Brew Panel**, le programme de commande de brasserie de Skynet Brewery. Il tourne sur le Raspberry Pi (le « cerveau », le Brain) et vous l'utilisez depuis n'importe quel navigateur : un PC, un Mac, une tablette, un téléphone Android ou un iPhone, dans Chrome, Edge, Safari, Firefox ou DuckDuckGo.

Le Pi garde tout : la disposition de vos écrans, vos Processes, vos images, vos sons, le journal de brassage et ce manuel. Chaque écran que vous ouvrez montre la même brasserie en direct, et les Processes continuent de tourner quand tous les navigateurs sont fermés.

## Ouvrir le panel {#opening-the-panel}

- Sur le Pi lui-même : `http://localhost:8080`
- Depuis un autre ordinateur ou un téléphone à la maison : `http://<Pi's address>:8080`, par exemple `http://192.168.1.50:8080`
- Hors de chez vous : uniquement par Tailscale. Voir [Installer Tailscale sous Windows](00-tailscale-windows) et [Connexion, utilisateurs et mots de passe](10-login).

La toute première fois, le panel vous demande de **créer le compte administrateur** (admin). Cela ne marche que depuis un téléphone ou un ordinateur de votre réseau domestique.

## S'y retrouver {#finding-your-way}

Les boutons en haut sont les écrans principaux :

| Bouton | À quoi il sert |
|---|---|
| **Tabs** | Les écrans de votre brasserie : pompes, vannes, températures, minuteries, tuyaux. C'est là que vous brassez. |
| **Processes** | Écrire, vérifier, lancer et arrêter des Processes (étapes de brassage automatiques). |
| **Variables** | Chaque gGlobal et sa valeur. |
| **Log** | Les valeurs écrites dans la base de données de brassage, avec un téléchargement CSV. |
| **Devices** | Les cartes (automates, PLC) branchées au Pi, et la liste des sondes de température. |
| **Media** | Ajouter des images et des sons sur le Pi depuis n'importe quel navigateur. |
| **Import** | Importer une recette BeerSmith. |
| **Settings** | Exemples, votre mot de passe, les utilisateurs et les réglages du panel. |
| **Help** | Ce manuel. |

**Aide rapide :** faites un clic droit sur n'importe quel élément d'un Tab (ou gardez le doigt dessus sur un téléphone), ou appuyez sur un **?** jaune, et ce manuel s'ouvre à la partie qui en parle. Voir [Clic droit et ? pour l'aide](43-right-click-help).

Ce que vous voyez dépend de votre rôle. Un **Admin** voit tout ; un **Operator** peut mener une journée de brassage ; un **Viewer** peut seulement regarder. Voir [Connexion, utilisateurs et mots de passe](10-login).

## Tâches courantes {#common-jobs}

- Commencer votre propre Schema de brasserie : [Pas à pas : ajouter un Schema](188-step-by-step-add-a-schema). Chaque guide **Step by Step** (pas à pas) est en haut de la liste des pages d'aide.
- Ajouter une pompe, une vanne, une sonde ou un autre Device : [Pas à pas : ajouter un Device](207-step-by-step-add-a-device).
- Ajouter une image, un interrupteur, un robinet ou un autre Widget : [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget).
- Changer l'image ou la couleur de fond d'un Tab : [Image et couleur de fond d'un Tab](26-tab-background).
- Mettre vos propres images et sons sur le Pi : [Media (images et sons)](07-media).

## Répondre à une question : case à cocher et liste déroulante {#answering-a-question-tick-box-and-drop-down-list}

Dans Skynet (le Setup Interview, règle 2.75, et les autres entretiens), on répond aux questions de deux façons. Ce sont les mêmes
exemples que le Setup Interview montre avant sa première question.

**1. Une case à cocher (Tick Box).** Cliquez sur la case de votre réponse ; un ✔ vert montre qu’elle est cochée.

*Are you a morning person?* (Êtes-vous du matin ?)

| Yes | If 11:59 = morning | No |
|:---:|:---:|:---:|
| ☐ | ☐ | ☐ |

Cliquez sur la case du milieu, et elle est cochée :

| Yes | If 11:59 = morning | No |
|:---:|:---:|:---:|
| ☐ | ✔ | ☐ |

**2. Une liste déroulante (Drop Down list)** qui limite vos choix. Il y a parfois un choix **Other** (autre) qui permet d’utiliser
quelque chose qui n’est pas dans la liste ; s’il n’y est pas, il faut choisir la réponse la meilleure ou la plus proche. Dans la
question sur la glace ci-dessous, Other n’est pas disponible, car la boutique Skynet n’a que ces parfums aujourd’hui.

- Cliquez sur la petite flèche ▼ de **Favorite Ice Cream?** (votre glace préférée) pour voir les choix : Vanilla, Chocolate,
  Strawberry, Mint, Cookie, Orange Sherbet.
- Cliquez pour faire votre choix. Mon parfum préféré n’y est pas, alors je choisis **Chocolate**.
- **Chocolate** est choisi : la case montre maintenant Chocolate.

Plus sur les listes déroulantes (taper une lettre pour sauter, ➕ Add new ...) : [List Boxes (Dropdowns)](189-list-boxes).

## Les mots de ce manuel {#words-used-in-this-manual}

Le [Glossaire](13-glossary) explique chaque mot particulier. Les trois que vous verrez le plus :

- **Tab** : un écran de la brasserie.
- **Device** : tout ce qui est relié à un port ou une broche d'une carte (un relais de pompe, une sonde, une vanne).
- **Widget** : quelque chose qui n'existe que dans l'application et n'est relié à aucune carte (un raccord de tuyau, une note, une minuterie).

Skynet utilise des mots simples qui disent ce qu'ils veulent dire, pour que rien ne se lise à l'envers. Un plus veut dire vers le haut et un moins vers le bas : un Offset de −1 sur un élément chauffant l'allume 1 degré sous la consigne (Setpoint). Pas de confusion à la « Who's on First? », comme dans le [célèbre sketch](https://en.wikipedia.org/wiki/Who%27s_on_First%3F) d'Abbott et Costello ([à voir sur YouTube](https://www.youtube.com/watch?v=5FsJe4DScDs)).

## Passer à une nouvelle version {#updating-to-a-new-version}

Arrêtez d'abord le panel, puis relancez le programme d'installation ou décompressez le nouveau zip par-dessus le panel. Le zip ne contient pas de dossiers `config`, `data`, `media` ni `processes`, donc votre disposition, vos réglages, vos données de brassage, vos utilisateurs, vos images, vos sons et vos Processes ne sont jamais remplacés. Voir [Passer à une nouvelle version](18-updating).

## À propos de ce manuel {#about-this-manual}

Cliquez sur une page à gauche (sur un téléphone, les boutons des pages sont en haut). Tapez dans **Search the manual** pour trouver un mot dans toutes les pages. Quand vous ouvrez l'aide depuis un autre écran, elle s'ouvre à la page qui parle de cet écran.

**Print** imprime la page que vous lisez. Les Admins voient **Edit page** et **New page** : voir [Modifier ce manuel](12-editing-help).
