# Glossaire {#glossary}

Chaque mot spécial de Skynet, de A à Z. Choisissez une lettre pour y sauter, ou tapez le mot dans la case **Search** de l'aide. Les mots restent en anglais, comme à l'écran ; le sens en français est entre parenthèses.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w) · [🔌 Mots du câblage](#wiring-and-hardware-words)

## A {#a}

**Admin, Operator, Viewer** : les trois rôles d'utilisateur. Voir [Connexion, utilisateurs et mots de passe](10-login).

**Alarm** (alarme) : un Widget qui joue un fichier son : Hop, Brew Flow, Pre-Hop, General ou Sound only. Un seul son joue à la fois, par ordre de priorité. Dans un Process : `alm_Name = true`. Voir [Alarmes et son](21-alarms-and-sound).

**Analog output** (sortie analogique) : un Device qui envoie un signal continu (0-10 V ou 4-20 mA) pour régler quelque chose en partie, comme la vitesse d'une pompe. Voir [Propriétés des Devices PWM et Analog out](136-pwm-and-analog-out-device-properties).

**API** : la façon dont d'autres programmes (Node-RED, Home Assistant) lisent et règlent des valeurs. Voir [API (les autres programmes)](11-api).

**Audio Widget** (lecteur de son) : un Widget qui joue un fichier son (`play SoundPlayer`, `stop SoundPlayer`). Il se met en pause pendant qu'une alarme sonne.

## B {#b}

**Background (d'un Tab)** (fond) : l'image et la couleur derrière tout ce qui est sur un Tab. Se règle dans **⚙ Tab settings** avec Edit layout actif. Voir [Image et couleur de fond d'un Tab](26-tab-background).

**.backpath, .backpath_2, .backpath_3** : les trois chemins d'image de fond d'un élément (ils s'appelaient imagePath_1, _2, _3). `background = 1, 2 or 3` en choisit un ; 0, vide ou plus de 3 n'en montre aucun ; `name.image = "path"` change .backpath. Voir [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths).

**BeerXML** : le fichier de recette qu'exporte BeerSmith. Voir [Import](08-import).

**Boil Profile** (profil d'ébullition) : la durée totale d'ébullition et l'évaporation par heure.

**Boolean Widget** (Widget tout ou rien) : un Widget qui est seulement On ou Off : un Switch, Slider, Checkbox, Lighted Button, Push Button, Pulse Button ou LED. Avec un **Linked Device** choisi, il agit comme un **Clone** de ce Device. Voir [Semi Widgets Devices](112-semi-widgets-devices).

**Brain** (le cerveau) : l'ordinateur principal qui fait tourner Skynet : un Raspberry Pi 4 ou plus récent, ou un ordinateur Windows, Linux ou Mac (un mini PC, un ordinateur de bureau ou un portable). Il garde tous les fichiers de texte, d'images et de Schema et toutes les valeurs enregistrées, pour que le panel soit joignable depuis n'importe quel navigateur. Les cartes (**Interfaces**) s'y branchent par USB ou Ethernet. Voir [Déplacer le Brain](119-move-brain).

**Brewhouse Efficiency** (rendement de la brasserie) : la part du sucre du grain qui arrive vraiment dans le fermenteur, en %. Chaque Tab a le sien, copié de son Equipment Profile. Skynet l'enregistre pour chaque brassin sur un Tab et montre la moyenne des 10 derniers brassins sur ce Tab. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

**Build Tab (🔨)** (Tab de construction) : le Tab propre où chaque nouveau Device, Widget ou copie de Template est d'abord créé. **✅ Finish Build ...** le déplace vers son Tab. Une construction pas finie est gardée sur le Brain jusqu'à ce que vous la finissiez ou la jetiez. Voir [Build Tab](55-build-tab), et chaque étape en images dans [Pas à pas : ajouter un Device](207-step-by-step-add-a-device).

**Bundle** (ensemble) : une cuve verrouillée avec ses IP pour qu'ils bougent comme un seul bloc et ne puissent pas être modifiés tant que vous n'éteignez pas **Bundled**. Voir [Équipement : cuves, refroidisseurs, serpentins et raccords](14-equipment).

## C {#c}

**Clone** : le même Device montré sur un autre Tab. Ce n'est pas une copie : toucher le Clone, c'est toucher le Device d'origine. Voir [Devices clonés](71-cloned-devices).

**Color selector** (sélecteur de couleur) : chaque réglage de couleur est la même liste déroulante. **Default** (en premier) garde la couleur normale de l'élément, **None** (en deuxième) veut dire aucune couleur (transparent), puis des couleurs par nom avec un échantillon, et **Custom (add new) ...** pour toute autre couleur : il ouvre le **Color Picker** (Help 187), et la couleur est gardée dans la liste pour la prochaine fois. Une couleur à vous montre une ligne **Color (RGB)** juste en dessous, par exemple 250,250,250 ; double-cliquez dessus pour rouvrir le Color Picker.

**Confirmation Widget** (Widget de confirmation) : représente une chose faite **à la main**, sans carte pour l'allumer : une vanne manuelle, une pompe manuelle, ou le déplacement d'un QD Hose. Quand il est mis On ou Off, Skynet vous demande de le faire et de confirmer que c'est fait. Voir [Widgets de confirmation](162-confirmation-widgets).

## D {#d}

**Deadband** (zone morte) : une méthode de chauffe qui monte ou baisse son % par petits pas vers le **Setpoint**, plus douce et plus lente qu'un PID. Voir [Device Deadband](126-deadband-device).

**Default Layout** (disposition par défaut) : les cuves, raccords, IP, tuyaux rigides et souples qu'un Equipment Profile contient. Elle est copiée sur un Tab pour commencer une construction ; le Tab ne garde aucun lien avec elle.

**Default settings** (réglages par défaut) : ce avec quoi commence une **nouvelle** chose. Dans **☰ Menu > Default settings**. Voir [Default settings](155-default-settings).

**Device** : une chose reliée à un port ou une broche d'une carte, comme un relais de pompe ou une sonde. Voir [Devices et cartes](03-devices). Chaque étape, en images : [Pas à pas : ajouter un Device](207-step-by-step-add-a-device).

**Direct** : une méthode de chauffe : l'élément est tout à fait On ou tout à fait Off. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Duty Cycle** (rapport cyclique) : une méthode de chauffe : l'élément est On pendant un % de chaque cycle (par exemple 60 % pour une bonne ébullition). Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

## E {#e}

**Edit layout** (modifier la disposition) : le mode où un Admin change les Tabs : il ajoute, déplace et règle les Devices et les Widgets. C'est le premier choix du **☰ Menu**. Voir [La barre Edit layout](82-edit-layout-bar).

**Element** : un mot que Skynet n'utilise pas : une chose sur un Tab est un **Device** (relié à un port d'une carte) ou un **Widget** (dans l'application seulement). La seule exception est un *heating element* (élément chauffant), la vraie pièce dans une cuve.

**Equipment Profile** (profil d'équipement) : les pertes, les cuves et la tuyauterie de l'équipement d'une brasserie (par exemple le Hot Side, côté chaud, ou la Fermentation), créé sur l'onglet Equipment Profile du ☰ Menu. Il est seulement copié sur un Tab pour commencer une construction ; ensuite le Tab ne garde aucun lien avec lui. N'importe quel Schema peut commencer autant de Tabs que voulu à partir de lui. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

**Equipment Profile Interview** (questions du profil d'équipement) : quelques questions (combien de cuves, le type et la taille de chacune) qui posent vos cuves sur un Tab pour vous. Voir [Equipment Profile Interview](196-equipment-profile-interview).

## F {#f}

**Fitting** (raccord) : une pièce de tuyau (té, coude, croix, manchon, bouchon, vanne manuelle) placée comme un type d'IP.

**Flow color** (couleur de l'écoulement) : la couleur dessinée dans un tuyau rigide ou souple pendant que le liquide y passe. Skynet la choisit pour vous. Voir [Couleurs d'écoulement des tuyaux](116-pipe-and-hose-flow-colors).

## G {#g}

**gAPI** : retiré le 2026-10-30, c'est maintenant un **gGlobal**. Tout Device ou Widget peut atteindre la base de données et l'API avec ses réglages **Database and .API**.

**gGlobal** : une variable à portée globale, pour les Processes. Elle n'a pas de case Database and .API : un Process l'envoie à la base de données avec `send_db` ou `DBSend`. Les noms proposés commencent par `gG` (`gGV_`, `gGB_` ...). C'était gKonstant et gAPI (et avant cela vKonstant et vAPI).

**gGlobal Kind** (sorte de gGlobal) : ce que contient un gGlobal : une valeur, Value (gV_), un texte, String (gS_), vrai ou faux, Boolean (gB_), une heure, Time (gT_), une date et heure, Date Time (gD_) ou une image, Graphic (gG_). La sorte est choisie une fois et ne change jamais. Un gGlobal garde sa valeur après un redémarrage. Voir [Les sortes de gGlobals](108-gglobal-kinds).

**gKonstant** : retiré le 2026-10-30, c'est maintenant un **gGlobal**.

**Global** : une ancienne classe de variable. Le panel transforme les Globals en variables gGlobal quand ils sont chargés.

## H {#h}

**Heat Source** (source de chaleur) : comment une cuve est chauffée : Gas, Electric, RIMS, HERMS, Other ou Unheated. Voir [Réglages d'une cuve](34-vessel-tab).

**Heating method** (méthode de chauffe) : comment un élément chauffant chauffe : **Direct**, **Duty Cycle**, **Hysteresis**, **PID**, **Deadband** ou **Precise**. Elle peut changer en plein brassage. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Hidden key** (clé cachée) : un numéro que Skynet donne à chaque élément la première fois qu'il est enregistré. Vous ne le voyez jamais. C'est ainsi que Skynet sait que c'est le même élément après un nouveau nom, et chaque Process suit le nouveau nom. Voir [Changement de nom et clés cachées](80-name-change-and-hidden-keys).

**Hole** (Kettle Port) (trou, port de cuve) : une ouverture dans une cuve.

**Hose** (tuyau souple) : un tuyau flexible qui se courbe en arcs, avec un IP (un raccord) à chaque bout. Voir [Tuyaux, tuyaux souples et réducteurs](24-pipes-and-hoses).

**Hover Help** (aide au survol) : la petite case jaune qui s'affiche quand la souris reste sur un nom de champ souligné en pointillés. Elle dit la même chose que la page d'aide. Voir [L'aide au survol dans les dialogues](147-hover-help).

**Hydro** : un Tilt ou tout autre densimètre : le Device Hydrometer. Voir [Densimètres](170-hydrometers).

**Hysteresis** (hystérésis) : une méthode de chauffe qui met l'élément On et Off pour garder l'eau près du **Setpoint**. Pour l'élément du HLT, Setpoint 150 °F et Offset −1 : l'élément s'éteint à 150 °F et se rallume à 149 °F. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

## I {#i}

**Integrated Device** (Device intégré) : un seul élément avec des Devices construits dedans, comme le tube RIMS (son élément chauffant et sa sonde) ou un Vessel Device. Ce qui est construit dedans ne peut jamais en être sorti. Voir [Devices intégrés Skynet](64-skynet-integrated-devices).

**Interface** : une carte (automate, PLC) à laquelle les Devices sont câblés. Son **Interface ID** (comme `MB_`, Rule 3.2) commence le nom de ses Devices. Voir [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).

**IP (Initial Point)** (point de départ) : un petit repère rond là où un écoulement commence ou finit (une sortie de pompe, un port de cuve, une vidange). Les tuyaux commencent et finissent sur des IP. Les IP ne s'affichent que dans Edit layout, sous forme de **petit point**, pour que des IP proches ne se cachent jamais les unes les autres. Un point **vert** est joint à un tuyau ou un tuyau souple ; un point **rouge** est libre (rien de joint encore). Posez la souris sur un point (ou sélectionnez-le) et il grandit en cercle blanc dans un anneau de couleur, avec ses lettres et son nom.

## L {#l}

**Label** (étiquette) : le texte qu'un Tab montre sur un Device ou un Widget. Il n'est jamais vide. Voir [Étiquettes](72-labels).

**Layer Order** (ordre des couches) : quel élément est au-dessus là où des éléments se chevauchent sur un Tab : 1 est au-dessus, 2 juste en dessous, et ainsi de suite. Voir [Propriétés universelles](114-universal-properties).

**List box** (liste déroulante, dropdown) : une case avec un ▼ qui ouvre une liste de choix. Tapez une lettre pour sauter à un choix ; **➕ Add new ...** à la fin en crée un nouveau. Voir [Listes déroulantes](189-list-boxes).

**Lock** (verrou) : un élément verrouillé (🔒) ne peut pas être déplacé ni redimensionné, même dans Edit layout. **Lock All** et **Unlock All** font tout le Tab. Voir [Verrouiller les éléments en place](56-locking).

## M {#m}

**Manual Valve Widget** (Widget de vanne manuelle) : une vanne que vous tournez à la main. Un clic dessus la tourne ; un Process vous demande de la tourner et attend votre confirmation. Voir [Vannes manuelles](29-manual-valves).

**Mash Profile** (profil d'empâtage) : jusqu'à 4 paliers d'empâtage (température et durée) et le rinçage des drêches (sparge). Voir [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).

**Media folder** (dossier media) : un dossier sur le Pi qui contient des images et des sons. Voir [Media (images et sons)](07-media).

**☰ Menu** : le bouton en haut à droite de la page Tabs. Edit layout est son premier choix ; les autres ouvrent des onglets de menu. Voir [Le ☰ Menu](33-menu).

**Menu Bar** (barre de menu) : la rangée avec le nom de la brasserie au milieu et, à droite, la bulle Simulator, Build, Sound, Emergency Off, ? et ☰ Menu, à la même place sur chaque Tab et dans l'éditeur de Processes. Voir [La Menu Bar](40-menu-bar).

**Menu tab** (onglet de menu) : une page ouverte depuis le ☰ Menu (Default settings, Equipment Profile, Mash Profile, Boil Profile, les autres profils et les Templates). Il s'affiche à côté des Tabs d'écran, avec un ✕ pour le fermer, et a un numéro d'Order.

## N {#n}

**Name** (nom) : le nom unique d'un élément, celui qu'utilisent les Processes ; pour un Device : Interface ID _ Port _ Type _ Label _ Tab ID. Seulement des lettres, des chiffres et _ ~ @. Une fois enregistré, il ne change qu'avec **✏ Change name**. Voir [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).

**NULL** : la valeur vide : aucune valeur du tout, ni 0 ni un texte vide. `X = NULL` la vide. Voir [Le langage des Processes et les étapes](22-process-language).

## O {#o}

**Offset** (écart) : à quelle distance du **Setpoint** un élément se rallume en **Hysteresis** : point On = Setpoint + Offset. Pour chauffer, l'Offset est négatif (−1 : On à 149 °F pour 150 °F) ; pour refroidir, il est positif. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Override button** (bouton de passage forcé) : un appui, et chaque Process en cours passe le wait ou le sleep où il est bloqué. Les vannes manuelles attendent toujours leur clic. Voir [Le bouton Override](96-override-button).

## P {#p}

**Pi Brain** : un Raspberry Pi installé comme **Brain** : Skynet est installé dessus, démarre tout seul dès qu'il a du courant, et les cartes sont sur ses prises USB. Chaque étape : [Installer un Pi Brain](204-set-up-a-pi-brain).

**PID** : une méthode de chauffe qui tient un **Setpoint** en calculant elle-même son %. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**PLC** (automate) : dans ce projet, une carte de loisir : compatible Arduino (comme la Mega), ESP32 ou Raspberry Pi.

**Port** : une connexion (broche) d'une carte où un Device est câblé. Quand vous ajoutez un Device, la liste ne propose que les Ports libres. Voir [Interfaces](76-interfaces).

**Precise** (précis) : une méthode de chauffe calme qui tient un Setpoint à 0,1 degré près, pour la colonne d'un alambic ou un bain-marie. Voir [Chauffe précise](156-precise-heating).

**Process** : un fichier texte d'étapes de brassage que le panel exécute tout seul. Voir [Processes](05-scripts).

**Process class** (classe de Process) : Flow, Sub, Repeat ou Looper : ce à quoi sert un Process. Voir [Le langage des Processes et les étapes](22-process-language).

**Process Widget** : un Widget qui montre un Process sur un Tab, ce qu'il fait, et un bouton ▶ Start / ■ Stop. Voir [Process Widget](173-process-widget).

**Push button, Toggle, Pulse** (bouton poussoir, bascule, impulsion) : un **Push button** est On seulement tant qu'on le tient. Un **Toggle** reste On ou Off jusqu'au prochain appui. Un **Pulse** est On pendant 100 ms (un dixième de seconde).

**PWM** : une sortie qui s'allume et s'éteint très vite pour doser la puissance d'une pièce, comme la vitesse d'une pompe DC (PWM veut dire pulse width modulation, modulation de largeur d'impulsion). Voir [Propriétés des Devices PWM et Analog out](136-pwm-and-analog-out-device-properties).

## Q {#q}

**Quick Disconnect (QD), QD hose** (raccord rapide, tuyau à raccord rapide) : un raccord sur un IP où un tuyau se branche et se débranche à la main, et le tuyau qu'on déplace de l'un à l'autre le jour du brassage. Voir [Raccords rapides et tuyaux QD](127-quick-disconnects-and-qd-hoses).

## R {#r}

**Raspberry Pi** : un petit ordinateur qui peut être le **Brain** : il fait tourner le panel et garde tous ses fichiers. Voir [Installer un Pi Brain](204-set-up-a-pi-brain).

**Recipe** (recette) : les grains, houblons, levure et étapes d'une bière, tapés à la main ou importés de BeerSmith. Voir [L'onglet Recipe](99-recipe-tab).

## S {#s}

**Schema** : toute une configuration de brasserie (Tabs, Devices, Widgets, tuyaux, réglages et les Equipment numbers de chaque Tab), gardée dans son propre fichier dans le dossier `config` et choisie dans la liste déroulante Schema en haut. D'autres programmes l'appellent setup ou configuration. Les exemples sont des Schemas tout prêts. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

**Semi_Widgets_Devices** : des choses qui n'existent que dans l'application comme un Widget, mais qui sont On ou Off comme un Device : le Manual Valve Widget et les **Boolean Widgets**. Voir [Semi Widgets Devices](112-semi-widgets-devices).

**Service** : ce que transporte une vanne : Gas, Room Temperature Liquid (liquide à température ambiante), ou High Temperature Liquid (Stainless Steel) (liquide chaud, inox). Une vanne de gaz peut être la source de chaleur d'une cuve.

**Setpoint** (consigne) : la température (ou autre mesure) qu'une commande tient, comme 150 °F pour le HLT. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Shared variable** (variable partagée) : une ancienne classe qui a disparu ; utilisez plutôt un gGlobal. Un Schema plus ancien qui en a encore une se charge sans elle : voir [Les variables partagées sont devenues des gGlobals](149-shared-variables-became-gglobals).

**Simulation mode** (mode simulation) : chaque carte est remplacée par le simulateur et le temps peut passer plus vite ou sauter en avant, pour essayer une journée de brassage sans toucher au matériel. Voir [Mode simulation](20-simulation).

**Simulator** (simulateur) : une fausse carte, pour tout essayer sans matériel.

**skn_** : le début de chaque nom Skynet, pour tout ce qui appartient à Skynet : des valeurs que Skynet règle et qu'un Process lit seulement, comme `skn_Boil_Temp` ; des rôles qui tiennent une sonde de température, comme `skn_Boil_Probe_1` ; et les constantes Skynet.

**skn_const_ (Skynet Constants)** (constantes Skynet) : des nombres fixes intégrés à Skynet pour les conversions courantes, comme `skn_const_L_p_Gal` (Label : Liters per Gallon). Personne ne peut les changer. Voir [Constantes Skynet](94-skynet-constants).

**Step** (étape) : une ligne `step "name"` dans un Process. Les étapes se numérotent toutes seules (1.00000, 1.00001 ...). Voir [Le langage des Processes et les étapes](22-process-language).

**Step by Step** (pas à pas) : des pages d'aide qui montrent chaque étape avec des images. Elles sont en tête de l'aide. Voir [Step by Step: Add a Schema](188-step-by-step-add-a-schema), [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) et [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget). Les guides de câblage (un DAC, un SSR, les sondes 10K NTC, 1-Wire, PT100 et PT1000) sont aussi des guides pas à pas, chacun avec un dessin.

**Suggested Name** (nom proposé) : le Name que Skynet remplit pour un nouvel élément à partir de ses parties. Vous pouvez le changer avant d'enregistrer.

**SVG** : un format d'image qui reste net à toutes les tailles. Le panel fait des copies SVG de vos images PNG et JPG.

## T {#t}

**Tab** : un écran de la brasserie.

**Tab ID** : l'ID court (comme `SP`) qui termine le nom des nouveaux Devices d'un Tab ; il suit la Rule 3.2. Voir [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).

**Tab Profile** : une couleur de fond et l'apparence (couleurs, placement, LED / Text / Gauge) avec laquelle commencent les nouveaux Devices et Widgets, copiées sur un Tab (jamais liées). Voir [Tab Profiles et Valve Profiles](36-tab-and-valve-profiles).

**Tab_Vessel, Tab_Fitting** : la copie d'un Template sur un Tab. Ni un Device ni un Widget, mais il peut contenir les deux. Entièrement modifiable. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

**Tailscale** : un réseau privé gratuit entre vos propres appareils, pour utiliser le panel hors de chez vous en sécurité. Voir [Installer Tailscale sous Windows](00-tailscale-windows).

**Template** (modèle) : une cuve toute prête (Vessel Template) ou un ensemble de jusqu'à quatre raccords (Bundled Fitting Template), gardé dans une bibliothèque. Les Templates Skynet viennent avec le panel et sont seulement clonés ; les User Bundled Templates sont les vôtres. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

**Top Line** (ligne du haut) : la ligne tout en haut des autres pages : le nom du panel, la liste Schema, Tabs, Processes et ainsi de suite. Cachée sur les Tabs au départ, et absente dans l'éditeur de Processes. Voir [La Menu Bar](40-menu-bar).

## U {#u}

**Universal Properties** (propriétés universelles) : les propriétés que tout Device et tout Widget possède : Name, Label, position, taille, Layer Order, Visible, Lock et la clé cachée. Voir [Propriétés universelles](114-universal-properties).

**User Language** (langue de l'utilisateur) : une troisième langue d'aide, en plus de l'anglais et du français, qu'un Admin ajoute avec n'importe quelle IA : Skynet enregistre l'aide en fichiers texte, l'IA les traduit, Skynet les reprend. Les mots de brassage comme Strike et Mash restent en anglais, avec leur sens à côté. Voir [L'aide dans n'importe quelle langue](242-help-in-any-language).

## V {#v}

**Value Widget** (Widget de valeur) : un Widget qui montre un nombre sur un Tab ; un toucher le règle et chaque Process peut le lire. Il y a aussi des Widgets Time et DateTime. Voir [Widgets Value, Time et DateTime](134-value-time-and-datetime-widgets).

**Valve Profile** (profil de vanne) : les images et l'orientation (Horizontal, Vertical, 45 degrés à gauche ou à droite) avec lesquelles commence une nouvelle vanne, choisies seulement quand la vanne est créée.

**Vessel Device** (Device de cuve) : une cuve avec ses éléments chauffants et sa sonde de température construits dedans, faite avec le **Vessel Device Builder**. Voir [Construire un Vessel Device pas à pas](166-vessel-device-builder).

**Vessel Widget** (Widget de cuve) : une cuve dessinée sur un Tab, avec une place pour chaque IP qu'une cuve de brassage peut avoir. Voir [Vessel Widget](133-vessel-widget).

## W {#w}

**Widget** : un élément qui n'existe que dans l'application, relié à aucune carte (images, étiquettes, minuteries, IP, raccords). Chaque étape, en images : [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget).

## Mots du câblage et du matériel {#wiring-and-hardware-words}

Les pièces et les mots techniques des listes de câblage, en mots simples : ce que fait chacun, ce dont Skynet a besoin, et des pièces à comparer. Les pièces suggérées sont des exemples à comparer, pas des recommandations. Les liens **Où acheter** viendront plus tard ; d'ici là, chacun montre quoi chercher.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **⚠ Le gaz peut exploser ou tuer. OakBarn Brewery et Skynet ne sont ni électriciens, ni plombiers, ni experts en chauffage et climatisation. Consultez un électricien, un plombier ou un professionnel du chauffage et de la climatisation agréé.** (Règle 6.20)

### 0-10 V Signal {#0-10-v-signal}

- **En mots simples :** un fil de commande dont la tension, de 0 V (arrêt ou 0 %) à 10 V (plein ou 100 %), règle la quantité. Utilisé par les régulateurs de puissance, les vannes proportionnelles et les commandes de vitesse.
- **Ce dont Skynet a besoin :** fait à partir d'un True PWM Port par un DAC / module PWM vers 0-10 V.

### 0-10V Controller {#0-10v-controller}

*Aussi appelé 0-10 V Power Regulator (régulateur de puissance 0-10 V) ou régulateur de puissance à SCR.*

- **Ce qu'il fait :** règle la puissance que reçoit un élément chauffant, de 0 à 100 %, par un signal 0-10 V (il rogne chaque onde alternative, ce qu'on appelle l'angle de phase).
- **Ce dont Skynet a besoin :** **Commande :** 0-10 V (venant du DAC / module PWM vers 0-10 V). **AMPS :** au moins ceux de l'élément, avec de la marge (40 A ou plus pour 5500 W en 240 V). **Tension :** celle de l'élément (120 ou 240 V alternatif). Toujours sur un Heat Sink.
- **Pièces suggérées :** régulateurs de puissance à SCR ou régulateurs de tension SSVR avec une entrée 0-10 V (Auber, Crydom)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "SCR power controller 0-10V".

### 4-20 mA {#4-20-ma}

- **En mots simples :** un capteur envoie un courant : 4 mA = le plus bas, 20 mA = le plus haut. Un fil coupé lit 0 mA, donc on le repère facilement. Bon sur de longs fils.
- **Ce dont Skynet a besoin :** une résistance de 250 ohms le transforme en 1-5 V pour un port analogique.

### ADS1115 {#ads1115}

- **Ce qu'il fait :** une petite carte qui lit 4 signaux analogiques bien plus finement que l'Arduino.
- **Ce dont Skynet a besoin :** I2C (SDA/SCL de la Mega, GPIO 2 et 3 du Pi), adresse 0x48, 3,3 ou 5 V. Pour le pH et la pression.
- **Comment le câbler :** [Pas à pas : câbler un ADS1115](227-step-by-step-wire-an-ads1115)
- **Pièces suggérées :** carte Adafruit ADS1115 (ou un clone)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "ADS1115 module".

### Contactor {#contactor}

- **Ce qu'il fait :** un relais robuste qui coupe les deux fils de phase d'un circuit 240 V, pour que l'élément soit vraiment Off. C'est aussi ce que coupe un E-Stop.
- **Ce dont Skynet a besoin :** **bipolaire** (les deux phases) pour le 240 V ; **30 ou 40 A** pour un élément de 5500 W. Tension de bobine adaptée à ce qui la commande (12 ou 24 V continu, ou 120 V alternatif), commandée par un canal de Relay Module.
- **Comment le câbler :** [Pas à pas : câbler un contacteur](216-step-by-step-wire-a-contactor)
- **Pièces suggérées :** contacteurs bipolaires « definite purpose » (30 A ou 40 A) ; contacteurs modulaires bipolaires sur rail DIN
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "2 pole 40A contactor".

### Counter Port {#counter-port}

- **En mots simples :** une broche de carte qui compte des impulsions rapides, comme celles d'un Flow Meter.
- **Ce dont Skynet a besoin :** Mega D2, D3, D18-D21 (jusqu'à 6 par Mega).

### CS Port {#cs-port}

*Chip Select (sélection de puce).*

- **En mots simples :** le fil qui dit à une carte SPI « c'est à toi qu'on parle maintenant ». Chaque carte SPI a besoin du sien.
- **Ce dont Skynet a besoin :** Mega : seulement D14-D17, D22-D39, D41-D43, D47-D49, D53 pour une RTD (Règle 6.9).

### DAC {#dac}

*Digital to Analog Converter (convertisseur numérique-analogique).*

- **Ce qu'il fait :** transforme le signal tout ou rien (numérique) de la carte en une tension continue et lisse, par exemple de 0 à 10 V, pour régler un chauffage, une vanne ou une pompe à n'importe quel %, et pas seulement On ou Off.
- **Ce dont Skynet a besoin :** Skynet envoie un % depuis un **True PWM Port**, donc le DAC qu'il lui faut est un **module PWM vers 0-10 V** (entrée PWM 0-5 V d'une Mega, ou 3,3 V d'un ESP32 ou d'un Pi ; sortie 0-10 V ou 0-5 V, réglée par un cavalier ou une vis). Une carte DAC séparée qui parle en I2C (MCP4725, GP8403) n'est **pas** encore lue par le programme de la carte Skynet. La Règle 6.24 permet d'accorder le % aux vrais volts avec un multimètre.
- **Comment le câbler :** [Pas à pas : câbler un DAC (0-10 V)](209-step-by-step-wire-a-dac)
- **Pièces suggérées :** module convertisseur PWM vers 0-10 V (type LC-LM358-PWM2V, 0-5 V ou 0-10 V au choix) ; un convertisseur de signal PWM vers 0-10 V sur rail DIN
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "PWM to 0-10V module".

### DC Power Supply {#dc-power-supply}

- **Ce qu'il fait :** transforme le courant alternatif du mur en 12 V ou 24 V continu stable pour les vannes, les relais, les pompes DC et les modules.
- **Ce dont Skynet a besoin :** la tension des pièces ; des AMPS au moins égaux au total de tout ce qui y est branché, plus 25 %. Sur rail DIN ou en boîtier. Son (-) relié au GND de l'Arduino quand un MOSFET, un module 0-10 V ou un capteur 4-20 mA est utilisé.
- **Pièces suggérées :** alimentations Mean Well sur rail DIN (séries HDR ou EDR) ; alimentations Mean Well LRS en boîtier
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "Mean Well 24V DIN rail power supply".

### Diode {#diode}

*Flyback Diode (diode de roue libre).*

- **Ce qu'il fait :** une pièce à sens unique placée sur une bobine en courant continu (électrovanne ou relais) pour absorber le choc quand elle s'éteint, afin qu'il n'abîme pas l'interrupteur.
- **Ce dont Skynet a besoin :** 1N4007 (ou 1N4001-1N4007), la bague vers le côté (+) de la bobine.
- **Pièces suggérées :** lots de diodes 1N4007
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "1N4007 diode".

### DO, DI and AI Ports {#do-di-and-ai-ports}

- **En mots simples :** DO = Digital Out, sortie numérique (la carte l'allume ou l'éteint). DI = Digital In, entrée numérique (la carte lit un interrupteur, On ou Off). AI = Analog In, entrée analogique (la carte lit une tension, de 0 à 5 V sur une Mega).
- **Ce dont Skynet a besoin :** ports AI de la Mega A0-A15 (= 54-69). Le Pi n'a pas de port AI (utilisez un ADS1115).

### DS18B20 {#ds18b20}

- **Ce qu'il fait :** une sonde de température numérique. Plusieurs partagent un seul fil, chacune avec son propre numéro.
- **Ce dont Skynet a besoin :** bout inox étanche, 3 fils (5 V, GND, données). Une résistance de 4,7 k ohms pour tout le groupe. Port OneWire : Mega D40, Pi GPIO 4.
- **Comment le câbler :** [Pas à pas : câbler des sondes 1-Wire (DS18B20)](212-step-by-step-wire-1-wire-probes)
- **Pièces suggérées :** sondes DS18B20 étanches (câble de 1 m à 3 m)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "DS18B20 waterproof probe".

### E-Stop {#e-stop}

*Emergency Stop (arrêt d'urgence).*

- **Ce qu'il fait :** un gros bouton champignon rouge. Appuyé, il coupe tout le courant de la brasserie par son propre câblage.
- **Ce dont Skynet a besoin :** un contact **normalement fermé** qui coupe la bobine du contacteur principal, et un second contact (normalement ouvert ou fermé) vers un port DI pour que Skynet le sache (Type ID `EStop`). On le tourne ou on le tire pour le réarmer.
- **Comment le câbler :** [Pas à pas : câbler un arrêt d'urgence](231-step-by-step-wire-an-e-stop)
- **Pièces suggérées :** bouton d'arrêt d'urgence champignon rouge 22 mm avec blocs de contact 1 NC + 1 NO
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "22mm emergency stop button NC NO".

### Float Switch {#float-switch}

- **Ce qu'il fait :** un flotteur qui ferme un contact quand le liquide l'atteint (plein) ou s'en éloigne (bas).
- **Ce dont Skynet a besoin :** inox, qualité alimentaire, 2 fils vers un port DI et le GND (la résistance de rappel de la carte est active).
- **Comment le câbler :** [Pas à pas : câbler des interrupteurs et des flotteurs](233-step-by-step-wire-switches-and-float-switches)
- **Pièces suggérées :** interrupteurs à flotteur inox, montage latéral ou vertical
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "stainless float switch".

### Flow Meter {#flow-meter}

- **Ce qu'il fait :** une petite roue dans le tuyau envoie une impulsion chaque fois qu'une quantité donnée de liquide passe.
- **Ce dont Skynet a besoin :** un Counter Port (Mega D2, D3, D18-D21), alimentation 5 V ; inox et qualité alimentaire pour le moût chaud (le YF-S201 en plastique pour l'eau froide seulement) ; les impulsions par unité sur sa fiche technique.
- **Comment le câbler :** [Pas à pas : câbler un débitmètre](223-step-by-step-wire-a-flow-meter)
- **Pièces suggérées :** débitmètres à effet Hall en inox (1/2" NPT) ; YF-S201 pour l'eau froide
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "stainless hall flow sensor 1/2".

### Gas Solenoid Valve {#gas-solenoid-valve}

- **Ce qu'il fait :** une électrovanne faite pour le gaz, pour que le contrôleur de brassage allume et éteigne le brûleur.
- **Ce dont Skynet a besoin :** **homologuée pour le gaz LP** (UL ou CSA), **normalement fermée**, prévue pour plus que la pression du détendeur, bobine 24 V continu (ou 24 V alternatif). Voir [Sécurité Flame Out](197-flame-out-safety). ⚠ Gaz : voir l'avertissement en haut de cette section.
- **Comment le câbler :** [Pas à pas : câbler une électrovanne gaz et un allumeur](219-step-by-step-wire-a-gas-solenoid-and-igniter)
- **Pièces suggérées :** électrovannes gaz LP homologuées (série de coupure gaz ASCO et similaires)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "LP gas solenoid valve 24V listed".

### GFCI {#gfci}

*Ground Fault Circuit Interrupter (disjoncteur différentiel).*

- **Ce qu'il fait :** coupe le courant en une fraction de seconde si l'électricité fuit vers la terre, par exemple par l'eau ou par une personne. Indispensable près des liquides.
- **Ce dont Skynet a besoin :** chaque circuit alternatif de la brasserie sur un GFCI : un disjoncteur GFCI dans le tableau principal, un panneau GFCI de spa, ou une prise GFCI en premier sur la ligne. Calibré pour le circuit (20 A pour les éléments et pompes en 120 V, 30 ou 50 A pour les éléments en 240 V).
- **Pièces suggérées :** disjoncteurs GFCI faits pour la marque de votre tableau principal ; panneaux GFCI de spa 50 A
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "GFCI spa panel 50A".

### GND {#gnd}

*Ground (masse).*

- **En mots simples :** le fil de retour commun (0 V) que partagent toutes les pièces basse tension, pour que leurs signaux veuillent dire la même chose.
- **Ce dont Skynet a besoin :** reliez le (-) d'une DC Power Supply au GND de l'Arduino quand elle alimente un MOSFET, un module 0-10 V ou un capteur 4-20 mA.

### Heat Sink {#heat-sink}

- **Ce qu'il fait :** un bloc de métal à ailettes sur lequel on boulonne un SSR ou un régulateur de puissance, pour qu'il évacue sa chaleur et ne grille pas.
- **Ce dont Skynet a besoin :** un pour chaque SSR au-dessus d'environ 5 AMPS et chaque régulateur de puissance 0-10 V, calibré pour les AMPS (le fabricant du SSR en indique un). Une fine couche de pâte thermique ou un pad entre les deux.
- **Pièces suggérées :** dissipateurs Auber ou Crydom faits pour leurs SSR ; dissipateurs de SSR sur rail DIN
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "SSR heat sink".

### HX711 and Load Cells {#hx711-and-load-cells}

- **Ce qu'il fait :** les capteurs de force (load cells) plient très légèrement sous le poids ; la carte HX711 le lit pour que Skynet puisse peser une cuve.
- **Ce dont Skynet a besoin :** un HX711 par cuve (deux ports : DT et SCK), avec quatre capteurs demi-pont et une carte de jonction (Combinator Board), ou un capteur en S calibré pour la cuve pleine.
- **Comment le câbler :** [Pas à pas : câbler une balance de cuve](228-step-by-step-wire-a-vessel-scale)
- **Pièces suggérées :** cartes HX711 ; lots de 4 capteurs demi-pont 50 kg avec carte de jonction ; capteurs en S
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "HX711 load cell kit".

### I2C {#i2c}

*Se dit « I deux C » ; parfois lu à tort 12C.*

- **En mots simples :** une façon à deux fils pour que de petites cartes parlent à l'Arduino ou au Pi (un fil de données SDA, un fil d'horloge SCL). Plusieurs cartes peuvent partager les deux mêmes fils, chacune avec sa propre adresse.
- **Ce dont Skynet a besoin :** Mega SDA = D20, SCL = D21 ; Pi GPIO 2 et 3. Utilisé par la carte ADS1115 (adresse 0x48).

### Igniter {#igniter}

- **Ce qu'il fait :** fait une étincelle (ou une pointe chauffée au rouge) pour allumer le brûleur.
- **Ce dont Skynet a besoin :** module d'étincelle 12 V continu ou allumeur à surface chaude 120 V alternatif, commandé par un canal de Relay Module. Éteint par un déclenchement Flame Out.
- **Comment le câbler :** [Pas à pas : câbler une électrovanne gaz et un allumeur](219-step-by-step-wire-a-gas-solenoid-and-igniter)
- **Pièces suggérées :** modules d'allumage à étincelles 12 V ; allumeurs à surface chaude pour brûleurs à gaz
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "12V spark igniter module".

### Level Transmitter {#level-transmitter}

*4-20 mA.*

- **Ce qu'il fait :** lit la profondeur du liquide et l'envoie sous forme de courant, de 4 mA (vide) à 20 mA (plein).
- **Ce dont Skynet a besoin :** alimentation de boucle 24 V continu et une résistance de 250 ohms du port analogique au GND (20 mA = 5 V). Prévu pour la température du liquide.
- **Comment le câbler :** [Pas à pas : câbler un transmetteur de niveau 4-20 mA](225-step-by-step-wire-a-4-20-ma-level-transmitter)
- **Pièces suggérées :** transmetteurs de niveau inox immergés ou hydrostatiques avec sortie 4-20 mA
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "4-20mA level transmitter stainless".

### Mechanical Power Relay {#mechanical-power-relay}

- **Ce qu'il fait :** un relais plus gros pour les charges lourdes comme un moteur de compresseur. Sa bobine est commandée par un canal de Relay Module.
- **Ce dont Skynet a besoin :** des contacts prévus pour un moteur (une puissance en chevaux, par exemple 1 HP, ou 30 A). Bobine 12 V ou 24 V continu, ou 120 V alternatif, selon ce qui la commande.
- **Comment le câbler :** [Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)
- **Pièces suggérées :** relais de puissance d'usage général avec une valeur en HP (relais enfichable 8 ou 11 broches sur support DIN, ou relais de puissance ouvert 30 A)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "30A power relay 12V coil".

### MOSFET Module {#mosfet-module}

- **Ce qu'il fait :** un interrupteur électronique pour les charges en courant continu qui peut aussi commuter très vite, pour régler la vitesse d'une pompe ou d'un ventilateur DC par PWM.
- **Ce dont Skynet a besoin :** **niveau logique** (pleinement passant à 3,3 ou 5 V), tension de charge 12 ou 24 V continu, 10 A ou plus. Masse reliée au GND de l'Arduino.
- **Comment le câbler :** [Pas à pas : câbler une commande de vitesse de pompe DC](220-step-by-step-wire-a-dc-pump-speed-control)
- **Pièces suggérées :** modules MOSFET à niveau logique (les modules IRF520 ne sont pas pleinement passants à 5 V ; prenez un module à niveau logique ou à double MOSFET)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "logic level MOSFET module PWM".

### Motorized Ball Valve {#motorized-ball-valve}

- **Ce qu'il fait :** une vanne à boisseau avec un petit moteur dessus qui l'ouvre et la ferme quand le courant est commuté.
- **Ce dont Skynet a besoin :** 12 V ou 24 V continu ; corps inox pour le moût ; le câblage indiqué sur son étiquette : **un fil de commande** (un relais) ou **un fil Open et un fil Close** (deux relais, Dual Throw, Règle 6.22). Les codes de fils des vendeurs (CR02, CR03, CR05...) diffèrent, donc lisez l'étiquette.
- **Comment le câbler :** [Pas à pas : câbler une vanne à bille motorisée](217-step-by-step-wire-a-motorized-ball-valve)
- **Pièces suggérées :** vannes à boisseau motorisées inox 3 fils (types US Solid, Tsai Fan), 1/2" NPT ou TC 1.5
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "motorized ball valve stainless 12V 3 wire".

### NO and NC {#no-and-nc}

*Normally Open, Normally Closed (normalement ouvert, normalement fermé).*

- **En mots simples :** la position d'un contact quand rien ne l'appuie ni ne l'alimente. NO = ouvert (off) jusqu'à l'appui ; NC = fermé (on) jusqu'à l'appui.
- **Ce dont Skynet a besoin :** un E-Stop utilise NC pour couper le contacteur principal. Une vanne normalement fermée est fermée sans courant.

### NTC Thermistor {#ntc-thermistor}

- **Ce qu'il fait :** la sonde de température la moins chère : sa résistance change avec la chaleur.
- **Ce dont Skynet a besoin :** un port analogique et une résistance de la même valeur que la thermistance (10 k ohms pour une 10K). Sa valeur Beta (par exemple 3950 ou 3977) se met dans ses Properties.
- **Comment le câbler :** [Pas à pas : câbler une sonde 10K NTC](210-step-by-step-wire-a-10k-ntc-probe)
- **Pièces suggérées :** sondes NTC 10K Beta 3950 étanches ; sondes 10K de type BCS-462
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "10K NTC thermistor probe waterproof".

### OneWire {#onewire}

- **En mots simples :** une façon à un seul fil (plus l'alimentation et la masse) pour que plusieurs sondes DS18B20 partagent un seul port. Chaque sonde a son propre numéro.
- **Ce dont Skynet a besoin :** Mega D40, Pi GPIO 4 ; une Pull-up Resistor de 4,7 k ohms pour le groupe.
- **Comment le câbler :** [Pas à pas : câbler des sondes 1-Wire (DS18B20)](212-step-by-step-wire-1-wire-probes)

### Opto-isolated {#opto-isolated}

- **En mots simples :** le signal de la carte allume une minuscule LED dans la pièce, et cette lumière commute la charge, si bien qu'aucun fil ne relie la carte au côté haute puissance.
- **Ce dont Skynet a besoin :** le mieux pour chaque Relay Module et chaque SSR.

### Pressure Transducer {#pressure-transducer}

*0,5-4,5 V.*

- **Ce qu'il fait :** lit une pression (ou la profondeur du liquide par la pression au fond) sous forme de tension.
- **Ce dont Skynet a besoin :** alimentation 5 V de l'Arduino, signal 0,5-4,5 V vers un port analogique, inox, 1/4" NPT, prévu pour la température du liquide. Une carte ADS1115 donne des lectures plus fines.
- **Comment le câbler :** [Pas à pas : câbler un capteur de pression](224-step-by-step-wire-a-pressure-transducer)
- **Pièces suggérées :** capteurs de pression inox 5 V, 0-5 psi ou 0-30 psi
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "pressure transducer 5V 0.5-4.5V stainless".

### Pull-up Resistor {#pull-up-resistor}

- **En mots simples :** une résistance (de rappel) entre un fil de signal et le 5 V (ou 3,3 V) qui tient le fil HAUT jusqu'à ce qu'un interrupteur ou un capteur le tire vers le BAS.
- **Ce dont Skynet a besoin :** la résistance de rappel de la carte est active pour les interrupteurs et les débitmètres ; le OneWire en demande une externe de 4,7 k ohms.

### PWM Port {#pwm-port}

*PWM, un True PWM Port.*

- **En mots simples :** Pulse Width Modulation (modulation de largeur d'impulsion) : une broche allumée et éteinte très vite. La part du temps où elle est On (de 0 à 100 %) règle une vitesse ou une puissance. Un True PWM Port est une broche que la carte peut faire pulser toute seule.
- **Ce dont Skynet a besoin :** Mega D2-D13, D44-D46. Nécessaire pour la vitesse des pompes, des ventilateurs, et pour le DAC / module PWM vers 0-10 V.

### Relay Module {#relay-module}

- **Ce qu'il fait :** une petite carte avec un ou plusieurs relais (un interrupteur actionné par un aimant). La broche de la carte allume l'aimant et le contact se ferme avec un clic.
- **Ce dont Skynet a besoin :** **Bobine :** cartes 5 V pour une Mega ; pour un ESP32 ou un Pi, prenez une carte vendue comme **3.3 V trigger** ou **High/Low trigger**. **Opto-isolée** est le mieux. **Contacts :** 10 A sous 250 V alternatif. Beaucoup sont **On quand la broche est BASSE** : c'est déjà ainsi que le programme de la carte Skynet pilote chaque Port (On = LOW), donc laissez **Invert** sur Off. Seule une carte qui s'allume avec HIGH demande **Invert** sur On dans les attributs de broche ⬢.
- **Comment le câbler :** [Pas à pas : câbler une carte relais](215-step-by-step-wire-a-relay-board)
- **Pièces suggérées :** modules relais 5 V opto-isolés de 1, 2, 4 ou 8 canaux (relais de type SRD-05VDC) ; modules relais sur rail DIN
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "8 channel 5V relay module opto isolated".

### RTD {#rtd}

*PT100 ou PT1000, avec une carte MAX31865.*

- **Ce qu'il fait :** le type de sonde de température le plus précis. La carte MAX31865 la lit pour l'Arduino.
- **Ce dont Skynet a besoin :** une carte MAX31865 par sonde ; ses cavaliers réglés pour 2, 3 ou 4 fils (3 pour commencer). Ports SPI (Mega D50-D52) et un CS Port (Règle 6.9). Résistance de référence 430 ohms pour une PT100, 4300 ohms pour une PT1000.
- **Comment le câbler :** [Pas à pas : câbler une sonde PT100](213-step-by-step-wire-a-pt100-probe) et [Pas à pas : câbler une sonde PT1000](214-step-by-step-wire-a-pt1000-probe)
- **Pièces suggérées :** carte Adafruit MAX31865 (ou un clone) ; sondes PT100 3 fils avec raccord 1/2" NPT
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "MAX31865 PT100 board".

### Solenoid Valve {#solenoid-valve}

- **Ce qu'il fait :** une vanne ouverte par un aimant électrique. Elle s'ouvre ou se ferme d'un coup. La plupart ont besoin de pression d'eau pour fonctionner.
- **Ce dont Skynet a besoin :** **normalement fermée**, 12 ou 24 V continu, qualité alimentaire (inox) pour le moût, laiton pour l'eau de refroidissement. Une Flyback Diode sur la bobine si elle n'en a pas.
- **Comment le câbler :** [Pas à pas : câbler une électrovanne à eau](218-step-by-step-wire-a-water-solenoid-valve)
- **Pièces suggérées :** électrovannes 12 V normalement fermées inox ou laiton (1/2" NPT)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "12V normally closed solenoid valve stainless".

### SPI {#spi}

- **En mots simples :** une façon à quatre fils pour que des cartes parlent à l'Arduino, plus rapide que l'I2C. Les cartes partagent trois fils ; chacune a son propre quatrième fil, le CS Port.
- **Ce dont Skynet a besoin :** Mega D50, D51, D52 (partagés par chaque carte RTD et thermocouple) ; Pi GPIO 7-11.

### SSR {#ssr}

*Solid State Relay, relais statique (Opto SSR).*

- **Ce qu'il fait :** un interrupteur électronique sans pièce mobile. Un petit signal continu de la carte allume et éteint une charge plus grosse en alternatif (ou en continu), sans bruit.
- **Ce dont Skynet a besoin :** **Entrée :** environ 3 à 32 V continu (marche avec toutes les Interfaces). **Sortie :** 24-380 V alternatif pour les charges alternatives (type « DA » : continu en entrée, alternatif en sortie), ou continu pour les charges continues (type « DD »). **AMPS :** 5 ou 10 A pour une pompe ou un tapis chauffant ; 25 ou 40 A sur un Heat Sink pour un élément. Type **Zero cross** pour les éléments.
- **Comment le câbler :** [Pas à pas : câbler un SSR](211-step-by-step-wire-an-ssr)
- **Pièces suggérées :** SSR Auber, Crydom ou Omron (type DA pour l'alternatif, DD pour le continu). Évitez les SSR imités sans nom de fabricant.
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "SSR 40A DA".

### Stepper Driver {#stepper-driver}

- **Ce qu'il fait :** alimente un moteur pas à pas par petits pas pour qu'il tourne jusqu'à une position exacte.
- **Ce dont Skynet a besoin :** broches STEP et DIR (ENABLE en option), sa propre alimentation 12-24 V continu (jamais le 5 V de l'Arduino), réglé sur le courant du moteur.
- **Comment le câbler :** [Pas à pas : câbler un moteur pas à pas](229-step-by-step-wire-a-stepper-motor)
- **Pièces suggérées :** TMC2209, A4988, DRV8825 (petits moteurs) ; TB6600 ou DM542 (NEMA 23)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "TMC2209 stepper driver".

### Thermocouple {#thermocouple}

*Avec une carte MAX31855 ou MAX31856.*

- **Ce qu'il fait :** une sonde pour les endroits très chauds (la flamme d'un brûleur, un conduit de fumée). La carte lit sa toute petite tension.
- **Ce dont Skynet a besoin :** MAX31856 pour tous les types (K, J, T ...) ou MAX31855 pour le type K seulement ; une carte par sonde ; ports SPI et un CS Port. Du fil de thermocouple, le + et le - dans le bon sens.
- **Comment le câbler :** [Pas à pas : câbler un thermocouple](221-step-by-step-wire-a-thermocouple)
- **Pièces suggérées :** cartes Adafruit MAX31856 ou MAX31855 ; sondes type K céramique ou Inconel
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "MAX31856 thermocouple board".

### Thermocouple Gas Safety Valve {#thermocouple-gas-safety-valve}

- **Ce qu'il fait :** une vanne de gaz tenue ouverte par une veilleuse qui chauffe un thermocouple. Si la flamme s'éteint, elle coupe tout le gaz d'elle-même, sans courant.
- **Ce dont Skynet a besoin :** **homologuée UL ou CSA**, pour le LP, la bonne pression (basse pression type VR8200, ou haute pression type BASO H19) et les bons BTU. Posée par un professionnel du gaz agréé. Recommandée (Règle 6.33).
- **Pièces suggérées :** type Honeywell VR8200 (basse pression) ; série BASO H19 (haute pression)
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "BASO H19 safety pilot valve".

### Thermowell {#thermowell}

- **Ce qu'il fait :** un tube de métal fermé qui baigne dans le liquide. La sonde glisse dedans, pour qu'on puisse la sortir sans vider la cuve.
- **Ce dont Skynet a besoin :** TC 1.5 (Tri-Clamp) ou 1/2" NPT, inox, assez long pour atteindre le liquide (Short, Medium ou Long), assez large dedans pour la sonde (la plupart prennent une sonde de 6 mm ou 1/4").
- **Pièces suggérées :** doigts de gant inox TC 1.5 ; doigts de gant 1/2" NPT
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "tri clamp thermowell 1.5".

### Waterproof In Use Outlet {#waterproof-in-use-outlet}

- **Ce qu'il fait :** une prise extérieure avec un couvercle qui reste fermé sur la fiche branchée, pour que l'eau n'entre pas.
- **Ce dont Skynet a besoin :** prévue pour les lieux humides (couvercle « in use » ou « extra duty »), sur un circuit GFCI, les AMPS de la prise adaptés au circuit.
- **Pièces suggérées :** couvercles de prise étanches « in use » avec une prise GFCI
- **Où acheter :** *(lien à venir)* Cherchez sur Amazon "in use weatherproof outlet cover".

### Zero Cross {#zero-cross}

- **En mots simples :** un SSR qui ne commute que quand l'onde alternative passe par zéro volt, ce qui ménage l'élément et ne fait pas de parasites électriques.
- **Ce dont Skynet a besoin :** le SSR normal pour les éléments commandés par PID, Duty Cycle ou Hysteresis. Pas pour le PWM rapide.
