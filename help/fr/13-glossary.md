# Glossaire {#glossary}

Chaque mot spécial de Skynet, de A à Z. Choisissez une lettre pour y sauter, ou tapez le mot dans la case **Search** de l'aide. Les mots restent en anglais, comme à l'écran ; le sens en français est entre parenthèses.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) · [T](#t) · [U](#u) · [V](#v) · [W](#w)

## A {#a}

**Admin, Operator, Viewer** : les trois rôles d'utilisateur. Voir [Connexion, utilisateurs et mots de passe](10-login).

**Alarm** (alarme) : un Widget qui joue un fichier son : Hop, Brew Flow, Pre-Hop, General ou Sound only. Un seul son joue à la fois, par ordre de priorité. Dans un Process : `alm_Name = true`. Voir [Alarmes et son](21-alarms-and-sound).

**Analog output** (sortie analogique) : un Device qui envoie un signal continu (0-10 V ou 4-20 mA) pour régler quelque chose en partie, comme la vitesse d'une pompe. Voir [Propriétés des Devices PWM et Analog out](136-pwm-and-analog-out-device-properties).

**API** : la façon dont d'autres programmes (Node-RED, Home Assistant) lisent et règlent des valeurs. Voir [API (les autres programmes)](11-api).

## B {#b}

**Background (d'un Tab)** (fond) : l'image et la couleur derrière tout ce qui est sur un Tab. Se règle dans **⚙ Tab settings** avec Edit layout actif. Voir [Image et couleur de fond d'un Tab](26-tab-background).

**.backpath, .backpath_2, .backpath_3** : les trois chemins d'image de fond d'un élément (ils s'appelaient imagePath_1, _2, _3). `background = 1, 2 or 3` en choisit un ; 0, vide ou plus de 3 n'en montre aucun ; `name.image = "path"` change .backpath. Voir [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths).

**BeerXML** : le fichier de recette qu'exporte BeerSmith. Voir [Import](08-import).

**Boil Profile** (profil d'ébullition) : la durée totale d'ébullition et l'évaporation par heure.

**Boolean Widget** (Widget tout ou rien) : un Widget qui est seulement On ou Off : un Switch, Slider, Checkbox, Lighted Button, Push Button, Pulse Button ou LED. Avec un **Linked Device** choisi, il agit comme un **Clone** de ce Device. Voir [Semi Widgets Devices](112-semi-widgets-devices).

**Brain** (le cerveau) : l'ordinateur principal qui fait tourner Skynet : un Raspberry Pi 4 ou plus récent, ou un ordinateur Windows, Linux ou Mac (un mini PC, un ordinateur de bureau ou un portable). Il garde tous les fichiers de texte, d'images et de Schema et toutes les valeurs enregistrées, pour que le panel soit joignable depuis n'importe quel navigateur. Les cartes (**Interfaces**) s'y branchent par USB ou Ethernet. Voir [Déplacer le Brain](119-move-brain).

**Brewhouse Efficiency** (rendement de la brasserie) : la part du sucre du grain qui arrive vraiment dans le fermenteur, en %. Skynet l'enregistre pour chaque brassin dans le **Equipment Profile** et montre la moyenne des 10 derniers brassins sur ce Schema. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

**Build Tab (🔨)** (Tab de construction) : le Tab propre où chaque nouveau Device, Widget ou copie de Template est d'abord créé. **✅ Finish Build ...** le déplace vers son Tab. Une construction pas finie est gardée sur le Brain jusqu'à ce que vous la finissiez ou la jetiez. Voir [Build Tab](55-build-tab).

**Bundle** (ensemble) : une cuve verrouillée avec ses IP pour qu'ils bougent comme un seul bloc et ne puissent pas être modifiés tant que vous n'éteignez pas **Bundled**. Voir [Équipement : cuves, refroidisseurs, serpentins et raccords](14-equipment).

## C {#c}

**Clone** : le même Device montré sur un autre Tab. Ce n'est pas une copie : toucher le Clone, c'est toucher le Device d'origine. Voir [Devices clonés](71-cloned-devices).

**Color selector** (sélecteur de couleur) : chaque réglage de couleur est la même liste déroulante. **Default** (en premier) garde la couleur normale de l'élément, **None** (en deuxième) veut dire aucune couleur (transparent), puis des couleurs par nom avec un échantillon, et **Custom (add new) ...** pour toute autre couleur : il ouvre le **Color Picker** (Help 187), et la couleur est gardée dans la liste pour la prochaine fois. Une couleur à vous montre une ligne **Color (RGB)** juste en dessous, par exemple 250,250,250 ; double-cliquez dessus pour rouvrir le Color Picker.

**Confirmation Widget** (Widget de confirmation) : représente une chose faite **à la main**, sans carte pour l'allumer : une vanne manuelle, une pompe manuelle, ou le déplacement d'un QD Hose. Quand il est mis On ou Off, Skynet vous demande de le faire et de confirmer que c'est fait. Voir [Widgets de confirmation](162-confirmation-widgets).

## D {#d}

**Deadband** (zone morte) : une méthode de chauffe qui monte ou baisse son % par petits pas vers le **Setpoint**, plus douce et plus lente qu'un PID. Voir [Device Deadband](126-deadband-device).

**Default Layout** (disposition par défaut) : les cuves, raccords, IP, tuyaux rigides et souples d'un Tab, gardés dans le Equipment Profile de ce Tab. Le Tab la suit, ou garde sa propre disposition.

**Default settings** (réglages par défaut) : ce avec quoi commence une **nouvelle** chose. Dans **☰ Menu > Default settings**. Voir [Default settings](155-default-settings).

**Device** : une chose reliée à un port ou une broche d'une carte, comme un relais de pompe ou une sonde. Voir [Devices et cartes](03-devices).

**Direct** : une méthode de chauffe : l'élément est tout à fait On ou tout à fait Off. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Duty Cycle** (rapport cyclique) : une méthode de chauffe : l'élément est On pendant un % de chaque cycle (par exemple 60 % pour une bonne ébullition). Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

## E {#e}

**Edit layout** (modifier la disposition) : le mode où un Admin change les Tabs : il ajoute, déplace et règle les Devices et les Widgets. C'est le premier choix du **☰ Menu**. Voir [La barre Edit layout](82-edit-layout-bar).

**Element** : un mot que Skynet n'utilise pas : une chose sur un Tab est un **Device** (relié à un port d'une carte) ou un **Widget** (dans l'application seulement). La seule exception est un *heating element* (élément chauffant), la vraie pièce dans une cuve.

**Equipment Profile** (profil d'équipement) : les pertes, les cuves et la tuyauterie d'un Tab de brasserie (par exemple le Hot Side, côté chaud, ou la Fermentation), créé sur l'onglet Equipment Profile du ☰ Menu. Chaque Tab peut avoir le sien. N'importe quel Schema peut utiliser n'importe quel profil sur l'un de ses Tabs : propre à un Tab, ou partagé par plusieurs Schemas. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

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

**IP (Initial Point)** (point de départ) : un petit repère rond là où un écoulement commence ou finit (une sortie de pompe, un port de cuve, une vidange). Les tuyaux commencent et finissent sur des IP. Les IP ne s'affichent que dans Edit layout, sous forme de cercle blanc dans un anneau de couleur.

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

**Menu Bar** (barre de menu) : la ligne du haut de la page : le nom du panel, la liste Schema, Tabs, Processes et ainsi de suite. Voir [La Menu Bar](40-menu-bar).

**Menu tab** (onglet de menu) : une page ouverte depuis le ☰ Menu (Default settings, Equipment Profile, Mash Profile, Boil Profile, les autres profils et les Templates). Il s'affiche à côté des Tabs d'écran, avec un ✕ pour le fermer, et a un numéro d'Order.

## N {#n}

**Name** (nom) : le nom unique d'un élément, celui qu'utilisent les Processes ; pour un Device : Interface ID _ Port _ Type _ Label _ Tab ID. Seulement des lettres, des chiffres et _ ~ @. Une fois enregistré, il ne change qu'avec **✏ Change name**. Voir [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).

**NULL** : la valeur vide : aucune valeur du tout, ni 0 ni un texte vide. `X = NULL` la vide. Voir [Le langage des Processes et les étapes](22-process-language).

## O {#o}

**Offset** (écart) : à quelle distance du **Setpoint** un élément se rallume en **Hysteresis** : point On = Setpoint + Offset. Pour chauffer, l'Offset est négatif (−1 : On à 149 °F pour 150 °F) ; pour refroidir, il est positif. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Override button** (bouton de passage forcé) : un appui, et chaque Process en cours passe le wait ou le sleep où il est bloqué. Les vannes manuelles attendent toujours leur clic. Voir [Le bouton Override](96-override-button).

## P {#p}

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

**Raspberry Pi** : un petit ordinateur qui peut être le **Brain** : il fait tourner le panel et garde tous ses fichiers.

**Recipe** (recette) : les grains, houblons, levure et étapes d'une bière, tapés à la main ou importés de BeerSmith. Voir [L'onglet Recipe](99-recipe-tab).

## S {#s}

**Schema** : toute une configuration de brasserie (Tabs, Devices, Widgets, tuyaux, réglages et le Equipment Profile de chaque Tab), gardée dans son propre fichier dans le dossier `config` et choisie dans la liste déroulante Schema en haut. D'autres programmes l'appellent setup ou configuration. Les exemples sont des Schemas tout prêts. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).

**Semi_Widgets_Devices** : des choses qui n'existent que dans l'application comme un Widget, mais qui sont On ou Off comme un Device : le Manual Valve Widget et les **Boolean Widgets**. Voir [Semi Widgets Devices](112-semi-widgets-devices).

**Service** : ce que transporte une vanne : Gas, Room Temperature Liquid (liquide à température ambiante), ou High Temperature Liquid (Stainless Steel) (liquide chaud, inox). Une vanne de gaz peut être la source de chaleur d'une cuve.

**Setpoint** (consigne) : la température (ou autre mesure) qu'une commande tient, comme 150 °F pour le HLT. Voir [Un élément chauffant, choisissez comment il chauffe](150-heating-method).

**Shared variable** (variable partagée) : une ancienne classe qui a disparu ; utilisez plutôt un gGlobal. Un Schema plus ancien qui en a encore une se charge sans elle : voir [Les variables partagées sont devenues des gGlobals](149-shared-variables-became-gglobals).

**Simulation mode** (mode simulation) : chaque carte est remplacée par le simulateur et le temps peut passer plus vite ou sauter en avant, pour essayer une journée de brassage sans toucher au matériel. Voir [Mode simulation](20-simulation).

**Simulator** (simulateur) : une fausse carte, pour tout essayer sans matériel.

**skc_ (Skynet Constants)** (constantes Skynet) : des nombres fixes intégrés à Skynet pour les conversions courantes, comme `skc_Kg_To_Lb`. Personne ne peut les changer. Voir [Constantes Skynet](94-skynet-constants).

**skn_, sk_** : les noms `skn_` sont des valeurs que Skynet règle et qu'un Process lit seulement, comme `skn_Boil_Temp`. Les noms `sk_` sont des rôles qui tiennent une sonde de température, comme `sk_Boil_Probe_1`.

**Sound Player** (lecteur de son) : un Widget qui joue un fichier son (`play SoundPlayer`, `stop SoundPlayer`). Il se met en pause pendant qu'une alarme sonne.

**Step** (étape) : une ligne `step "name"` dans un Process. Les étapes se numérotent toutes seules (1.00000, 1.00001 ...). Voir [Le langage des Processes et les étapes](22-process-language).

**Step by Step** (pas à pas) : des pages d'aide qui montrent chaque étape avec des images. Elles sont en tête de l'aide. Voir [Step by Step: Add a Schema](188-step-by-step-add-a-schema).

**Suggested Name** (nom proposé) : le Name que Skynet remplit pour un nouvel élément à partir de ses parties. Vous pouvez le changer avant d'enregistrer.

**SVG** : un format d'image qui reste net à toutes les tailles. Le panel fait des copies SVG de vos images PNG et JPG.

## T {#t}

**Tab** : un écran de la brasserie.

**Tab ID** : l'ID court (comme `SP`) qui termine le nom des nouveaux Devices d'un Tab ; il suit la Rule 3.2. Voir [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).

**Tab Profile** : la couleur de fond d'un Tab et l'apparence (couleurs, placement, LED / Text / Gauge) avec laquelle commencent les nouveaux Devices et Widgets qu'on y met. Voir [Tab Profiles et Valve Profiles](36-tab-and-valve-profiles).

**Tab_Vessel, Tab_Fitting** : la copie d'un Template sur un Tab. Ni un Device ni un Widget, mais il peut contenir les deux. Entièrement modifiable. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

**Tailscale** : un réseau privé gratuit entre vos propres appareils, pour utiliser le panel hors de chez vous en sécurité. Voir [Installer Tailscale sous Windows](00-tailscale-windows).

**Template** (modèle) : une cuve toute prête (Vessel Template) ou un ensemble de jusqu'à quatre raccords (Bundled Fitting Template), gardé dans une bibliothèque. Les Templates Skynet viennent avec le panel et sont seulement clonés ; les User Bundled Templates sont les vôtres. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

## U {#u}

**Universal Properties** (propriétés universelles) : les propriétés que tout Device et tout Widget possède : Name, Label, position, taille, Layer Order, Visible, Lock et la clé cachée. Voir [Propriétés universelles](114-universal-properties).

## V {#v}

**Value Widget** (Widget de valeur) : un Widget qui montre un nombre sur un Tab ; un toucher le règle et chaque Process peut le lire. Il y a aussi des Widgets Time et DateTime. Voir [Widgets Value, Time et DateTime](134-value-time-and-datetime-widgets).

**Valve Profile** (profil de vanne) : les images et l'orientation (Horizontal, Vertical, 45 degrés à gauche ou à droite) avec lesquelles commence une nouvelle vanne, choisies seulement quand la vanne est créée.

**Vessel Device** (Device de cuve) : une cuve avec ses éléments chauffants et sa sonde de température construits dedans, faite avec le **Vessel Device Builder**. Voir [Construire un Vessel Device pas à pas](166-vessel-device-builder).

**Vessel Widget** (Widget de cuve) : une cuve dessinée sur un Tab, avec une place pour chaque IP qu'une cuve de brassage peut avoir. Voir [Vessel Widget](133-vessel-widget).

## W {#w}

**Widget** : un élément qui n'existe que dans l'application, relié à aucune carte (images, étiquettes, minuteries, IP, raccords).
