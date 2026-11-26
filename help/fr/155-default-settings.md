# Réglages par défaut {#default-settings}

**☰ Menu > Default settings** a **tous les réglages par défaut** de Skynet (Règle Skynet 2.42) : chaque réglage par défaut **doit** être sur cette page, et il **peut** aussi être dans d'autres endroits, comme les Properties d'un Device. Où qu'il soit aussi, c'est le même réglage : changez-le à un endroit et chaque endroit le montre. Il ne s'ouvre que depuis le
**☰ Menu**. Il s'appelait autrefois le Tab **Default**. Depuis le 2026-11-21, il a aussi la Boil temperature, les Panel settings et
l'Ordre du Menu, qui étaient sur la page Settings ; cette page s'appelle maintenant **Admin Settings** (comptes, utilisateurs, mots de
passe, Approved Devices, envoi des codes et Patron), et le bouton **🔐 Admin Settings** en haut de ce Tab l'ouvre ([Admin Settings](09-settings)).

Ces réglages appartiennent au **panneau**, donc ils sont les mêmes dans chaque Schema. Les **Admins** les changent et appuient sur **Save** ; tous les
autres peuvent regarder.

## Unités et votre brasserie {#units-and-your-brewery}

| Réglage | Ce qu'il fait |
|---|---|
| **Brewery Name** | Un avantage Patron : le nom de votre brasserie, affiché sur la Menu Bar de chaque Tab et dans l'éditeur de Processes, et le Copyright et le Created by de chaque nouveau Process. Sans être Patron : grisé, et la Menu Bar affiche Skynet Panel. Vide : le nom inscrit sur votre code Patron. Voir [Patron](198-patron). |
| **Units** | US (gallons, livres, °F) ou Métrique (litres, kilogrammes, °C). Chaque quantité et température s'affiche dans ce choix. Skynet garde chaque nombre en métrique, donc il change seulement ce que vous voyez et tapez (Règle Skynet 2.59). |
| *Boil temperature (air pressure)* | Les deux cases ci-dessous, sous leur propre titre. |
| **Airport (ICAO)** | Le code à 4 lettres de l'aéroport le plus proche qui a un bulletin météo (sa station METAR), par exemple `KDFW`. Skynet lit sa pression de l'air pour trouver la température à laquelle l'eau bout ici (`skn_Boil_Temp`). |
| **Elevation** | L'altitude de votre brasserie au-dessus du niveau de la mer : en pieds pour les Units US, en mètres pour Métrique (gardée en mètres). |

Les cases se tapent dans les Units qu'elles montrent. Changez **Units** et appuyez sur **Save**, et les cases s'affichent ensuite dans les nouvelles Units.
**Test** à côté d'Airport (ICAO) garde l'Airport et l'Elevation tels que tapés, va chercher le bulletin de l'aéroport tout de suite et montre l'aéroport, la pression de l'air et la température d'ébullition sous Elevation.
La **Typed air pressure** n'est pas ici : ce n'est pas un réglage par défaut. C'est la pression de l'air d'un jour de brassage, à demander dans l'entretien du jour de brassage (pas encore fait ; une pression tapée avant est gardée et utilisée) ; laissée vide, Skynet utilise le bulletin de l'aéroport, ou une journée standard à votre Elevation.
Comment trouver le code de votre aéroport et votre Elevation : [Température d'ébullition selon la pression de l'air](238-boil-temperature).

## Tuyaux, flexibles et tailles {#pipes-hoses-and-sizes}

### Default Pipe Size {#default-pipe-size}

La taille la plus courante des tuyaux à placer sur un nouveau Tab. Les raccords de tuyau sont ajoutés tout seuls et prennent la taille du tuyau qui y est joint. La taille de chaque tuyau peut être changée une fois placé, et tout nouveau tuyau joint à un tuyau d'une autre taille prend la taille de ce tuyau. Vous pouvez changer la taille d'un seul tuyau, et la nouvelle taille passe en cascade aux tuyaux joints, qui prennent cette taille tout seuls. Vous pouvez faire un collecteur qui ressemble en grande partie à celui de votre brasserie. Les tuyaux les plus courants font 1/2 po. Le type d'IP des bouts est donné par le Type d'IP, mais peut être changé sur chaque IP d'un tuyau.

Les IP s'emboîtent et sont verrouillées.

Les IP se verrouillent toutes seules, et les IP d'un tuyau doivent être déverrouillées pour le déplacer ou changer sa taille. Cela ne se fait qu'en mode Construction pour les tuyaux.

Les tuyaux ont une simulation de débit.

### IP Type (pour les tuyaux) {#ip-type-for-pipes}

Le raccord par défaut qu'un nouveau tuyau a aux deux bouts : Tri-Clamp, NPT, BSP ou Raccord rapide. Il a la taille du tuyau. Une fois placés, les tuyaux gardent leur type de raccord. Les IP de chaque bout d'un tuyau peuvent être changées une à une. Réglez le type d'IP par défaut des tuyaux comme la plupart de vos tuyaux sont montés. Pour les tuyaux de brassage, le plus courant est le Tri-Clamp 1,5 po. (TC1.5) Quand des tuyaux sont joints, les IP prennent toutes seules le type du joint. Une fois verrouillées, elles le gardent jusqu'à ce qu'elles soient déverrouillées. En général, cela se fait tout seul après votre premier joint de tuyau.

### Default Hose Size {#default-hose-size}

La taille la plus courante des tuyaux souples à placer sur un nouveau Tab. La taille de chaque tuyau souple peut être changée une fois placé. Les tuyaux souples peuvent se joindre aux tuyaux, aux raccords et à tout ce qui a des IP, mais gardent leur taille, au contraire d'un tuyau. Les tuyaux souples ne changent pas de taille tout seuls. Vous pouvez faire un collecteur qui ressemble en grande partie à celui de votre brasserie. Les tuyaux souples les plus courants font 1/2 po. Le type d'IP des bouts est donné par le Type d'IP, mais peut être changé sur chaque IP d'un tuyau souple.

Les IP s'emboîtent et sont verrouillées.

Les tuyaux souples joints par des IP à Raccord rapide peuvent être vite déverrouillés et déplacés, même pendant le brassage.

Les Devices et Widgets de cuve ont en haut une grande IP à Raccord rapide, où un tuyau souple peut être accroché par-dessus le bord de la cuve.

Les tuyaux souples ont une simulation de débit.

### IP Type (pour les flexibles) {#ip-type-for-hoses}

Le raccord par défaut qu'un nouveau tuyau souple a aux deux bouts : Tri-Clamp, NPT, BSP ou Raccord rapide. Il a la taille du tuyau souple. Une fois placés, les tuyaux souples gardent leur type de raccord. Les IP de chaque bout d'un tuyau souple peuvent être changées une à une. Réglez le type d'IP par défaut des tuyaux souples comme la plupart de vos tuyaux souples sont montés. Quand des tuyaux souples sont joints, les IP prennent toutes seules le type du joint. Une fois verrouillées, elles le gardent jusqu'à ce qu'elles soient déverrouillées. En général, cela se fait tout seul après votre premier joint de tuyau souple.

Chaque Tab peut encore changer sa **Pipe Size** et sa **Hose Size** dans **Tab Settings**. Un Tab fait avant qu'il y ait une Hose Size dessine ses tuyaux souples à sa Pipe Size, comme avant. Les cases Pixels sont dans chaque **Tab Profile** (voir **New Tabs** plus bas).

Le côté technique : les tailles vont de 1/4" à 6", avec la taille en mm à côté de chacune ; Skynet commence à 1/2" pour les deux, Tri-Clamp pour les tuyaux et Quick Disconnect pour les flexibles ([Tuyaux, tuyaux souples et réducteurs](24-pipes-and-hoses), Règle Skynet 5.40). Un nouveau Device, Pipe Fitting ou élément avec des IP (pompes, vannes, débitmètres, coudes, tés, Valve Tees, tés à sonde ...) est dessiné pour la Default Pipe Size jusqu'à ce qu'un tuyau y soit. Les éléments déjà faits gardent la taille qu'ils avaient : la changer ici n'atteint que les nouvelles choses (Règle Skynet 2.42). La case des pixels va de 2 à 100 (vide = 10).

### IP Types

Une case à cocher pour chaque IP Type et chaque taille : Tri-Clamp (TC1/2 à TC6), filetage de tuyau (FPT femelle et MPT mâle, de 1/8" à 6"), BSP, métrique (DN6 à DN150), Quick Disconnect inox (FMSSQD femelle et MSSQD mâle) et Camlock (CAMF coupleur femelle et CAMM adaptateur mâle, de 1/2" à 6"). Seules les cochées apparaissent dans les listes IP Type des tuyaux, flexibles, pompes et Stove Top Vessels, avec celles déjà utilisées dans le Schema. Aucune n'est cochée au départ : cochez celles que vous utilisez ([Tuyaux, flexibles et réducteurs](24-pipes-and-hoses), Règle Skynet 5.40).

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
| **Default Tab** | Le Tab où va un nouveau Device ou Widget quand le Build est fini (✅ Finish Build ... > Move to Tab). Vide : le Tab d'où venait le Build Tab. **➕ Add new Tab…** dans une case d'ajout le règle aussi. |

Ce sont les deux mêmes listes déroulantes que sur la barre Edit layout du 🔨 Build Tab. Elles sont gardées par l'ID d'Interface et l'ID de Tab, donc un Schema
sans cette Interface ou ce Tab commence à l'ancienne façon. (Règle Skynet 4.6)

## Brewer Type {#brewer-type}

Ce que cette brasserie brasse d'habitude : **Extract Can Kit**, **Extract Partial Grain and Hops**, **All Grain** (au départ) ou **All Grain (own Grain Mill)**. Quand un jour de brassage ne trouve aucune recette, la fenêtre **No Recipe Found** commence sur ce choix, et vous pouvez en choisir un autre. Voir [Aucune recette trouvée](100-brew-process#no-recipe-found).

**Brewer Level** : sur quoi vous brassez, de **1 Stove Top, One Pot, No Outlet** jusqu’à **9 All Grain Plus**. Un nouveau Tab de brassage dans le New Schema Interview commence sur le Level qui lui correspond. **Yeast Starter usually** : pour information ; PreBrew vous le rappelle un jour ou deux avant. Les deux sont demandés par le [Setup Interview](248-setup-interview).

## New User Recipes {#new-user-recipes}

Ce avec quoi commence une nouvelle Recette quand vous appuyez sur **NEW** sur le Tab Recipe. Vous pouvez changer chaque chose dans la Recette. **Units** (US ou Métrique) est en haut de ce Tab (voir **Unités et votre brasserie**).

### Batch Size (Gallons) ou Batch Size (Liters) {#batch-size-gallons-or-batch-size-liters}

Ne touche que les nouvelles Recettes de l'utilisateur. C'est votre taille de brassin habituelle quand vous faites une Recette à la main dans Skynet. Skynet ne prétend pas être un logiciel de recettes : il importe un fichier Beer.xml standard des logiciels de recettes connus, sans rien programmer dans Skynet. Faites simplement la recette dans votre logiciel de recettes préféré, ou prenez-en une sur un forum ou chez un ami, et importez-la. Tant que le fichier suit la norme beer.xml, Skynet devrait l'importer. Si vous ne comptez jamais faire de Recette ici, vous pouvez ignorer toute cette partie : elle a déjà les valeurs les plus courantes.

### Mash Profile {#mash-profile}

Le Profil d'empâtage d'une nouvelle Recette. Skynet Single Step, Batch Sparge : un palier à 152 °F (67 °C) pendant 60 minutes, l'empâtage habituel de la plupart des bières.

**Température d'empâtage (Strike)**
L'eau est chauffée plus que la température d'empâtage (la température Strike), car le grain la refroidit en entrant. La cuve d'empâtage absorbe aussi un peu de chaleur : c'est le Décalage de l'équipement. Un grain froid refroidit l'eau davantage : si votre grain est plus froid le Jour de brassage que prévu dans la recette (72 °F), vous serez sous la température d'empâtage.

**Ajouter le grain**
Ajoutez le grain lentement en remuant, pour éviter les grumeaux secs (boules de pâte), jusqu'à la température d'empâtage. Chauffez l'eau (le Pré-Strike) un peu plus que la température Strike et laissez-la refroidir jusqu'à Strike avant d'ajouter le grain : refroidir est facile, réchauffer une cuve pleine est difficile.

**Durée et température de l'empâtage**
Une température plus basse (148 à 150 °F) donne une bière plus sèche et légère ; une plus haute (154 à 158 °F), une bière plus douce et ronde. 60 minutes suffisent pour la plupart des malts d'aujourd'hui. Bonne pratique : gardez l'empâtage à sa température tout du long, couvercle mis ou chauffage allumé.

**Rinçage (sparge)**
Après l'empâtage, on rince le sucre du grain (le rinçage). Rinçage par lots : vidanger, ajouter de l'eau chaude, remuer, laisser reposer, vidanger encore. Rinçage continu : l'eau chaude est versée en pluie sur le dessus pendant que le moût s'écoule lentement par le bas ; plus lent, souvent un peu plus de sucre. Type Brewzilla (sac ou panier) : sortez le grain et versez de l'eau chaude dessus. Chacun change la quantité de sucre tirée du grain (le rendement).

### Boil Profile {#boil-profile}

Le Profil d'ébullition d'une nouvelle Recette. C'est surtout la durée d'ébullition : combien de temps le moût bout (Skynet 60 Minute Boil, c'est 60 minutes). Il peut aussi avoir sa propre évaporation, et chaque Profil d'ébullition Skynet demande le volume de la cuve au début et à la fin de l'ébullition.

### Water Profile {#water-profile}

L'eau d'une nouvelle Recette. L'Eau du robinet, sauf si vous en choisissez une autre.

Ce qu'il y a dans votre eau change la bière : le Calcium et le Magnésium (la dureté) aident l'empâtage et la levure, le Sulfate rend le houblon plus vif et plus amer, le Chlorure rend le malt plus plein et plus rond, et le Bicarbonate (l'alcalinité) convient aux bières foncées mais peut ternir les blondes. Le chlore donne un goût de médicament.

Le rapport sur la qualité de l'eau de votre service des eaux donne les chiffres, ou utilisez une trousse d'analyse d'eau. Vous pouvez aussi faire votre propre « eau » pour imiter une région brassicole célèbre : partez d'eau osmosée (RO) ou distillée et ajoutez des sels de brassage.

Et si vous brassez avec l'eau du robinet et faites de la Bonne bière, pourquoi tout chambouler ?

### Hop Stands {#hop-stands}

Plus dans Default settings : il n'y a pas de Hop Stands par défaut. Une Recette demande le stand, sa température et sa durée quand un houblon Whirlpool est ajouté, avec les chiffres courants dans l'aide au survol ([Profils d'empâtage, d'ébullition et d'eau](35-mash-and-boil-profiles#the-three-hop-stands), Règle Skynet 17.14).

### Water to Grain Ratio {#water-to-grain-ratio}

Combien d'eau va dans l'empâtage pour chaque livre (ou kilogramme) de grain (le ratio eau/grain). Sert à calculer la température Strike le Jour de brassage.

Un empâtage épais (moins d'eau, environ 1,25 qt/lb ou 2,6 L/kg) garde bien la chaleur et se remue facilement. Un empâtage fluide (plus d'eau, 1,5 à 2 qt/lb ou 3 à 4 L/kg) passe mieux dans une pompe et laisse plus d'eau pour un rinçage par lots. Le brassage en sac utilise toute l'eau d'un coup. Tout ce qui est entre les deux fait de la bonne bière.

Le côté technique : une nouvelle Recette commence avec un brassin de 5 gallons (18,93 litres), **Skynet Single Step, Batch Sparge** (152 °F pendant 60 minutes), **Skynet 60 Minute Boil** (sa durée d'ébullition vient du Boil Profile) et Tap Water. La Batch Size est gardée en litres et affichée en Gallons ou en Liters selon Units. Le Brewhouse Efficiency (72 %) et le Strike Offset appartiennent à l'Equipment Profile, pas à la Recette, et la Grain Temperature est de 72 °F (22,2 °C) pour prévoir. L'étiquette dit Gallons pour US et Liters pour Métrique.

## New Tabs {#new-tabs}

**Tab Profile for a new tab** est la seule case ici : le Tab Profile avec lequel commence un nouveau Tab. Les quatre cases ci-dessous sont dans chaque **Tab Profile** (☰ Menu > Tab Profile), avec sa couleur de fond et l'aspect de départ d'un nouveau Device ou Widget ([Tab, Valve et Pump Profiles](36-tab-and-valve-profiles)). Avec **(none)** choisi, un nouveau Tab prend ceux de Skynet : 10, 6 et la taille de l'écran. Ce qui était réglé ici avant est gardé dans le Tab Profile.

### How many Pixels are Pipes to be drawn on a Tab? {#how-many-pixels-are-pipes-to-be-drawn-on-a-tab}

C'est seulement la façon dont les tuyaux sont dessinés à l'écran : cela ne change rien d'autre que « l'Aspect ». Pour les résolutions d'écran d'ordinateur normales (réglées par vous sur votre ordinateur, mais le système en a mis une par défaut), 10 est un bon départ. Cela vaut pour les nouveaux tuyaux placés, pas pour ceux déjà placés : c'est donc une bonne idée de le régler et de ne plus y toucher, sinon votre écran pourrait sembler dessiné par un enfant de 3 ans.

### How many Pixels are Hoses to be drawn on a Tab? {#how-many-pixels-are-hoses-to-be-drawn-on-a-tab}

C'est seulement la façon dont les tuyaux souples sont dessinés à l'écran : cela ne change rien d'autre que « l'Aspect ». Pour les résolutions d'écran d'ordinateur normales (réglées par vous sur votre ordinateur, mais le système en a mis une par défaut), 6 est un bon départ ; les tuyaux souples sont en général dessinés plus fins que les tuyaux. Cela vaut pour les nouveaux tuyaux souples placés, pas pour ceux déjà placés : c'est donc une bonne idée de le régler et de ne plus y toucher, sinon votre écran pourrait sembler dessiné par un enfant de 3 ans.

### Width of a New Tab (px) {#width-of-a-new-tab-px}

Ne touche que les nouveaux Tabs ajoutés à un Schéma. C'est la façon dont le Tab tient à l'écran, et s'il lui faut des barres de défilement horizontales parce qu'une partie du Tab sort de l'écran quand la valeur est trop grande. Le mieux est de n'avoir aucune barre de défilement sur un Tab. Changer la résolution de l'écran ou utiliser un ordinateur à distance peut aussi changer l'affichage, avec ou sans barres de défilement. Les téléphones et tablettes s'ajustent à leur taille, et vous n'avez presque pas de contrôle si vous en utilisez un à distance. Réglez-les pour l'ordinateur de votre brasserie qui suit le Skynet Panel. Pour une résolution d'écran de 1920 x 1040, 1600 x 900 est un bon départ, mais il faudra peut-être l'ajuster un peu pour VOTRE ordinateur. La Largeur ne touche que la barre de défilement horizontale.

La taille d'affichage (le Zoom de Skynet : Fit screen, Fit width, 50 % à 150 %) change si les barres de défilement se voient ou non. Skynet commence à Fit screen, qui dessine tout le Tab plus petit pour tenir à l'écran : aucune barre de défilement ne se voit. Votre ordinateur décide aussi de l'aspect des barres : Windows les montre ; un Mac les cache souvent jusqu'à ce que vous fassiez défiler (Réglages Système > Apparence) ; sous Linux, cela dépend du bureau et du navigateur.

### Height of a New Tab (px) {#height-of-a-new-tab-px}

Ne touche que les nouveaux Tabs ajoutés à un Schéma. C'est la façon dont le Tab tient à l'écran, et s'il lui faut des barres de défilement verticales parce qu'une partie du Tab sort de l'écran quand la valeur est trop grande. Le mieux est de n'avoir aucune barre de défilement sur un Tab. Changer la résolution de l'écran ou utiliser un ordinateur à distance peut aussi changer l'affichage, avec ou sans barres de défilement. Les téléphones et tablettes s'ajustent à leur taille, et vous n'avez presque pas de contrôle si vous en utilisez un à distance. Réglez-les pour l'ordinateur de votre brasserie qui suit le Skynet Panel. Pour une résolution d'écran de 1920 x 1040, 1600 x 900 est un bon départ, mais il faudra peut-être l'ajuster un peu pour VOTRE ordinateur. La Hauteur ne touche que la barre de défilement verticale.

La taille d'affichage (le Zoom de Skynet : Fit screen, Fit width, 50 % à 150 %) change si les barres de défilement se voient ou non. Skynet commence à Fit screen, qui dessine tout le Tab plus petit pour tenir à l'écran : aucune barre de défilement ne se voit. Votre ordinateur décide aussi de l'aspect des barres : Windows les montre ; un Mac les cache souvent jusqu'à ce que vous fassiez défiler (Réglages Système > Apparence) ; sous Linux, cela dépend du bureau et du navigateur.

Le côté technique : de 200 à 20000 pixels. Les cases sont remplies au départ avec la taille utile de votre écran (l'écran moins la barre des tâches : 1920 x 1040 sur un écran Windows de 1920 x 1080). Laissé ainsi, un nouveau Tab prend la taille de l'écran sur lequel il est créé, et remplit donc l'écran au Zoom Fit screen ; un autre nombre est gardé pour chaque nouveau Tab. Chaque Tab change le sien dans **Tab Settings**. Le **Zoom** de départ d'un écran est dans ☰ Menu > Default settings (On startup). Les quatre cases sont dans chaque Tab Profile.

## Nouveaux Templates de l'utilisateur et Schemas {#new-user-templates-and-schemas}

Ils ne servent qu'aux **nouvelles** choses que vous faites vous-même. Un Skynet Template garde ses propres réglages, et les pompes et vannes déjà faites gardent les leurs.

| Réglage | Ce qu'il fait |
|---|---|
| **Look of a New Schema** | Le Look (thème) avec lequel commence un nouveau Schema vide. Le Look du Schema ouvert se change dans ☰ Menu > Default settings ([Les Looks du panneau (thèmes)](151-panel-looks)). |

Le **Pump Overlay** est maintenant sur chaque **Pump Profile** et le **Valve Overlay** sur chaque **Valve Profile** ([Tab, Valve et Pump Profiles](36-tab-and-valve-profiles)). **Push Lockout (s)** est dans **Panel settings (aussi dans Settings)** plus bas. Ce qui était réglé ici est gardé.

Certaines choses n'ont pas de case parce qu'elles sont toujours pareilles (par exemple les Pump et Valve Standards, et les raccords qui prennent la taille de leurs tuyaux). Le **Lost Comm** se règle sur chaque Interface ([Interfaces](76-interfaces)). Les réglages du **Simulator** sont seulement sur la barre du simulateur ([La barre du simulateur](85-simulator-bar)).

## Dossiers par défaut {#default-folders}

**User Graphic** et **User Audio** : où sont vos propres images et sons (vide : `Images` et `sounds`). Un Process peut donner seulement
un nom de fichier et Skynet cherche ici d'abord ([Chemins en deux parties](194-two-part-paths), Règle Skynet 7.23).

## Panel settings {#panel-settings}

La façon dont tout le panneau marche, donc un changement atteint les choses déjà faites. Ils étaient sur la page Settings jusqu'au 2026-11-21 :

- **Units** (US ou Métrique) : chaque quantité, température et Recette s'affiche dans ce choix. Skynet garde chaque nombre en métrique (°C, litres, kilogrammes, cm) : Units change seulement ce que vous voyez et tapez, et le changer ne change jamais un nombre enregistré (Skynet Rule 2.59). Les Mash, Boil et Equipment Profiles, les Vessels et les Vessel Templates affichent leurs nombres dans ce choix à l'ouverture ; leur propre case Units est grisée et suit celle-ci ; sur un Tab en marche, chaque température s'affiche aussi dans ce choix : la lecture d'une sonde (PV), sa consigne (SV), son Dial, et la consigne et les Offsets d'un Heating Element ou d'un Fermentor Control, aussi dans leurs Properties et leurs fenêtres. Une sonde gardée en °C (le 3 Vessel Sample) affiche 150.0 °F en US, et une sonde gardée en °F affiche des °C en Métrique ; ce que vous tapez est enregistré dans les unités de la sonde, et un nombre que vous n'avez pas changé est enregistré exactement comme avant. Un Offset se convertit par 1,8 seulement (1 °C = 1,8 °F), jamais avec le 32. Les articles d'une Recette qui ont leur propre unité la gardent (un ajout en grammes, une levure en Packs ; les houblons sont gardés en kg et s'affichent en oz ou g) ;
- **Tab Style** (l'aspect de chaque Tab qui n'a pas de Tab Style à lui) ;
- **Top Line**, **Sound**, **On startup** (Zoom, plein écran) ;
- **\L Rich Text Code Size** ;
- **Hover Delay** ([L'aide au survol dans les boîtes de dialogue](147-hover-help)) ;
- **Push Lockout (s)** : combien de temps un nouveau bouton poussoir Pulse attend avant qu'un autre appui compte ;
- **Phones and tablets** (téléphones et tablettes) ;
- le **Grain weight label** et le label des points de densité ;
- les **Brew Timers** : les Labels du Skynet Boil Timer, du Mash Timer et du Whirlpool / Chilling Timer ([Les Skynet Brew Timers](246-skynet-brew-timers)) ;
- les **Hop alerts** (alertes houblon) ;
- **Title**, **Look (theme)** (enregistré tout de suite), **Media folders**, **API key**, **BeerXML mapping**, les Processes qui démarrent avec le serveur, et la limite de redémarrages et son Alarm.

**Ordre du Menu** : tapez un numéro pour déplacer un Tab du Menu.

Le Look (thème) est celui du Schema ouvert ([Les Looks du panneau (thèmes)](151-panel-looks)), et le Pulse est toujours de 100 ms.

## Les autres réglages de ce Tab {#the-other-settings-on-this-tab}

**Les réglages par défaut sont seulement pour les nouvelles choses.** Labels, Text Boxes, la Default pipe size et les IP Types sont gardés sur chaque élément quand il est créé, donc les changer ici ne change jamais ce qui est déjà sur vos Tabs.

Nouveaux Tabs (Tab Profile), Labels et Text Boxes. (Les réponses de New Schema from a Skynet Template ne sont plus ici : chaque question commence avec la réponse de Skynet, et vous la changez dans la case Add new Schema.) Le Valve Profile et le Pump Profile d'un nouvel élément est celui marqué **Default** dans sa propre liste ([Tab Profiles et Valve Profiles](36-tab-and-valve-profiles)). Voir [Le Menu](33-menu).

## Tap Water

Votre propre eau du robinet : les chiffres qui comptent pour brasser. Chaque recette commence avec Tap Water sur son Tab Waters, à chaque Level, sauf si vous choisissez une autre eau. Remplissez-les, puis appuyez sur **Save** (le seul Save de l'onglet Default, en haut).

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

Le côté technique : Tap Water est un Water Profile (☰ Menu > Water Profile le liste) créé quand le Brain démarre pour la première fois et jamais supprimé. Une recette ou les Default settings sans Water Profile choisi l'utilisent. Bicarbonate = Alcalinité (en CaCO3) x 1,22. Dureté (en CaCO3) = 2,497 x Calcium + 4,118 x Magnésium. Un Process le lit avec les Skynet_Fields `skn_rcp_Water_...` (aide 99).

Les titres des parties de ce Tab ont un fond bleu, pour trouver chaque partie facilement. Le titre et **Save** restent en haut pendant que le reste défile (Règle Skynet 2.51).
