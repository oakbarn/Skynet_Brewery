# Réglages par défaut {#default-settings}

**☰ Menu > Default settings** est le seul endroit pour **tous les réglages par défaut** de Skynet : ce avec quoi commence une **nouvelle** chose (Règle Skynet 2.42). Ce qui change les choses déjà faites est dans **Settings > Panel settings: screen, Tabs and alerts** ([Réglages](09-settings)). Il ne s'ouvre que depuis le
**☰ Menu**. Il s'appelait autrefois le Tab **Default**.

Ces réglages appartiennent au **panneau**, donc ils sont les mêmes dans chaque Schema. Les **Admins** les changent et appuient sur **Save** ; tous les
autres peuvent regarder.

## Tuyaux, flexibles et tailles {#pipes-hoses-and-sizes}

| Réglage | Ce qu'il fait |
|---|---|
| **Default pipe size** | 1/2" sauf si vous le changez (1/4" à 6", avec la taille en mm à côté de chacune). Un **nouveau tuyau** commence à cette taille. Chaque **Device, Pipe Fitting et élément avec des IP** (pompes, vannes, débitmètres, coudes, tés, Valve Tees, tés à sonde ...) qui n'a **pas de tuyau** est dessiné pour cette taille, donc une nouvelle pompe correspond déjà à vos tuyaux. |
| **Default hose size** | La taille de départ d'un **nouveau flexible**. |
| **How thick a 1/2" pipe is drawn on a new Tab** | En pixels ; vide = 10. Chaque Tab peut encore le changer dans **Tab settings**. |
| **Width** et **Height of a new Tab** | En pixels ; vide = 1600 x 900. |

### Comment les choses se dimensionnent selon leurs tuyaux {#how-things-size-to-their-pipes}

Une fois des tuyaux joints, un élément prend la taille qu'ont **la plupart de ses tuyaux et flexibles** (en cas d'égalité, la plus grande ; Règle Skynet
5.36). Depuis le 2026-11-07, cela couvre aussi les **pompes**. Par exemple,
ajoutez une pompe Blichmann à un Tab avec des tuyaux de 1" : elle est dessinée pour des tuyaux de 1" dès que les tuyaux y sont, et pour le Default pipe size
avant. Un raccord posé sur une ouverture de cuve sans tuyau garde sa taille. Voir
[Raccords de tuyauterie et vannes manuelles](87-pipe-fittings-and-manual-valves).

## Nouveaux Devices et Widgets (le Build) {#new-devices-and-widgets-the-build}

| Réglage | Ce qu'il fait |
|---|---|
| **Default Interface** | L'Interface sur laquelle commence la case d'ajout d'un nouveau Device. Vide : celle du dernier nouveau Device. |
| **Default Tab** | Le Tab où va un nouveau Device ou Widget quand le Build est fini (💾 Save Build ... > Move to Tab). Vide : le Tab d'où venait le Build Tab. **➕ Add new Tab…** dans une case d'ajout le règle aussi. |

Ce sont les deux mêmes listes déroulantes que sur la barre Edit layout du 🔨 Build Tab. Elles sont gardées par l'ID d'Interface et l'ID de Tab, donc un Schema
sans cette Interface ou ce Tab commence à l'ancienne façon. (Règle Skynet 4.6)

## Nouveaux Templates de l'utilisateur et Schemas {#new-user-templates-and-schemas}

Ils ne servent qu'aux **nouvelles** choses que vous faites vous-même. Un Skynet Template garde ses propres réglages, et les pompes et vannes déjà faites gardent les leurs.

| Réglage | Ce qu'il fait |
|---|---|
| **Look of a New Schema** | Le Look (thème) avec lequel commence un nouveau Schema vide. Le Look du Schema ouvert se change dans Settings > Panel settings ([Les Looks du panneau (thèmes)](151-panel-looks)). |
| **Pump Overlay** | La superposition On avec laquelle commence une nouvelle pompe : ce qui s'affiche dessus quand elle tourne. Anneau vert lumineux sauf si vous le changez ([On overlay](58-on-overlay)). |
| **Valve Overlay** | La superposition On avec laquelle commence une nouvelle vanne motorisée. L'éclair fixe sauf si vous le changez. |
| **Push Lockout (s)** | Combien de temps un nouveau bouton poussoir Pulse attend avant qu'un autre appui compte, en secondes (0,1 à 60, 3 sauf si vous le changez). Chaque bouton change le sien dans ses Properties. |

Certaines choses n'ont pas de case parce qu'elles sont toujours pareilles : voir **Skynet Defaults for New User Created Items** plus bas. Le **Lost Link** se règle sur chaque Interface ([Interfaces](76-interfaces)). Les réglages du **Simulator** sont seulement sur la barre du simulateur ([La barre du simulateur](85-simulator-bar)).

## Déplacé dans Settings {#moved-to-settings}

Ceux-ci changent les choses déjà faites, ou la façon dont tout le panneau marche, donc ce sont des réglages (Settings), pas des réglages par défaut. Ils sont dans **Settings > Panel settings: screen, Tabs and alerts** :

- **Tab Style** (l'aspect de chaque Tab qui n'a pas de Tab Style à lui) ;
- **Menu Bar**, **Sound**, **On startup** (Zoom, plein écran) ;
- **\L Rich Text Code Size** ;
- **Hover Delay** ([L'aide au survol dans les boîtes de dialogue](147-hover-help)) ;
- **Phones and tablets** (téléphones et tablettes) ;
- le **Grain weight label** et le label des points de densité ;
- les **Hop alerts** (alertes houblon) ;
- l'**Ordre du Menu**.

Le Look (thème) du Schema ouvert est dans Settings > Panel settings ([Les Looks du panneau (thèmes)](151-panel-looks)), et le Pulse est toujours de 100 ms.

## Les autres réglages de ce Tab {#the-other-settings-on-this-tab}

Nouvelles recettes (Units, Batch size, Profiles, Boil time, efficacité ...), New Schema from a Skynet Template, nouveaux Tabs et vannes (Tab
Background Profile, Valve Profile), Labels et Text Boxes. Voir [Le Menu](33-menu).

## Tap Water

Votre propre eau du robinet : les chiffres qui comptent pour brasser. Chaque recette commence avec Tap Water sur son Tab Waters, à chaque Level, sauf si vous choisissez une autre eau. Remplissez-les, puis appuyez sur **Save** (le seul Save de l'onglet Default, en haut ou en bas).

**Où trouver les chiffres :**

- **Votre service des eaux.** La plupart des villes et des compagnies des eaux publient un rapport sur la qualité de l'eau sur leur site web. Cherchez le nom de votre commune et « qualité de l'eau ». Si vous ne le trouvez pas, appelez-les et demandez le dernier rapport. Cherchez Calcium, Magnésium, Sodium, Sulfate, Chlorure, Bicarbonate ou Alcalinité, pH, et s'ils ajoutent du chlore ou de la chloramine.
- **Un kit d'analyse d'eau.** Les magasins de brassage et d'aquariophilie en vendent, ainsi que les magasins de piscines. La plupart des kits donnent la dureté totale, l'alcalinité totale, le pH et le chlore. Un laboratoire d'analyse d'eau peut analyser un échantillon envoyé par la poste pour tous les chiffres.
- **L'eau de puits** n'a pas de rapport du service des eaux : utilisez un kit ou un laboratoire.

L'eau change avec les saisons, donc revérifiez de temps en temps et changez la **Date**.

Les cases :

- **From** : Water Department (service des eaux) ou Test Kit (kit d'analyse).
- **Date** : quand le rapport ou l'analyse a été fait.
- **Calcium**, **Magnesium**, **Sodium**, **Sulfate**, **Chloride**, **Bicarbonate** : en ppm (pareil que mg/L).
- **Alkalinity** : ce que donnent la plupart des kits. C'est la même chose que le Bicarbonate, donc tapez l'un ou l'autre et l'autre suit.
- **Hardness** : calculée à partir du Calcium et du Magnésium (grisée). Un kit la donne aussi, donc vous pouvez vérifier vos chiffres.
- **pH** : 7 est neutre ; l'eau du robinet est souvent entre 7 et 8,5.
- **Chlorine** : None, Chlorine, Ammonia + chlorine (Chloramine) ou Unknown. L'un comme l'autre donne un goût de médicament à la bière. Un comprimé de Campden dans 20 gallons enlève les deux.

Posez la souris sur une case (ou appuyez sur son nom) pour voir ce qu'elle fait pour la bière.

Le côté technique : Tap Water est un Water Profile (☰ Menu > Water Profile le liste) créé quand le Brain démarre pour la première fois et jamais supprimé. Une recette ou les Default settings sans Water Profile choisi l'utilisent. Bicarbonate = Alcalinité (en CaCO3) x 1,22. Dureté (en CaCO3) = 2,497 x Calcium + 4,118 x Magnésium. Un Process le lit avec les Skynet_Fields `rcp_Water_...` (aide 99).

## Skynet Defaults for New User Created Items {#skynet-defaults-for-new-user-created-items}

Ces réglages par défaut sont fixés et ne peuvent pas être changés, mais peuvent être changés dans un nouveau Template de l'utilisateur.

- **Pump size** (taille de pompe) : le Pump Standard, 150 x 150 pour un tuyau de 1/2", puis la taille de ses tuyaux.
- **Valve size** (taille de vanne) : le Valve Standard, 150 x 150 pour un tuyau de 1/2", puis la taille de ses tuyaux.
- **Pipe fittings** (raccords) : prennent toujours la taille de leurs tuyaux.
- **Pump cover color** (couleur du couvercle de pompe) : None.
- **Flow color** (In et Out) : Blue.
- **Skynet Dial** : plage Cooler et Hotter 2 ; Cold, OK, Hot = Blue, Green, Red.
- **Alarm Set Graphic (Layer 2)** : None.

Les titres des parties de ce Tab ont un fond bleu, pour trouver chaque partie facilement.
