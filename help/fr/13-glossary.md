# Glossaire {#glossary}

**Admin, Operator, Viewer** : les trois rôles d'utilisateur. Voir [Login](10-login).

**Alarm** (alarme) : un Widget qui joue un fichier son : Hop, Brew Flow, Pre-Hop, General ou Sound only. Un seul son joue à la fois, par ordre de priorité. Dans un Process : `alm_Name = true`. Voir [Alarms and sound](21-alarms-and-sound).

**Sound Player** (lecteur de son) : un Widget qui joue un fichier son (`play SoundPlayer`, `stop SoundPlayer`). Il se met en pause pendant qu'une alarme sonne.

**API** : la façon dont d'autres programmes (Node-RED, Home Assistant) lisent et règlent des valeurs. Voir [API](11-api).

**Background (d'un Tab)** (fond) : l'image et la couleur derrière tout ce qui est sur un Tab. Se règle dans **⚙ Tab settings** avec Edit layout actif. Voir [Tab background picture and color](26-tab-background).

**Interface** : une carte (automate, PLC) à laquelle les Devices sont câblés. Son **Interface ID** (1 à 4 lettres, comme `MB_`) commence le nom de ses Devices. Voir [Interface, Tab and Device names](46-interface-tab-device-names).

**Tab ID** : les 2 lettres (comme `SP`) qui terminent le nom des nouveaux Devices d'un Tab. Voir [Interface, Tab and Device names](46-interface-tab-device-names).

**BeerXML** : le fichier de recette qu'exporte BeerSmith. Voir [Import](08-import).

**Bundle** (ensemble) : une cuve verrouillée avec ses IP pour qu'ils bougent comme un seul bloc et ne puissent pas être modifiés tant que vous n'éteignez pas **Bundled**. Voir [Equipment](14-equipment).

**Sélecteur de couleur** : chaque réglage de couleur est la même liste déroulante. **Default** (en premier) garde la couleur normale de l'élément, **None** (en deuxième) veut dire aucune couleur (transparent), puis des couleurs par nom avec un échantillon, et **Custom (add new) ...** pour toute autre couleur : il ouvre le **Color Picker** (Help 187), et la couleur est gardée dans la liste pour la prochaine fois. Une couleur à vous montre une ligne **Color (RGB)** juste en dessous, par exemple 250,250,250 ; double-cliquez dessus pour rouvrir le Color Picker.

**Device** : une chose reliée à un port ou une broche d'une carte, comme un relais de pompe ou une sonde. Voir [Devices](03-devices).

**Element** : un mot que Skynet n'utilise pas : une chose sur un Tab est un **Device** (relié à un port d'une carte) ou un **Widget** (dans l'application seulement). La seule exception est un *heating element* (élément chauffant), la vraie pièce dans une cuve.

**Fitting** (raccord) : une pièce de tuyau (té, coude, croix, manchon, bouchon, vanne manuelle) placée comme un type d'IP.

**Hose** (tuyau souple) : un tuyau flexible qui se courbe en arcs, avec un IP (un raccord) à chaque bout. Voir [Pipes, hoses and reducers](24-pipes-and-hoses).

**Global** : une ancienne classe de variable. Le panel transforme les Globals en variables gGlobal quand ils sont chargés.

**.backpath, .backpath_2, .backpath_3** : les trois chemins d'image de fond d'un élément (ils s'appelaient imagePath_1, _2, _3). `background = 1, 2 or 3` en choisit un ; 0, vide ou plus de 3 n'en montre aucun ; `name.image = "path"` change .backpath. Voir [Pictures on items](25-picture-paths).

**IP (Initial Point)** (point de départ) : un petit repère rond là où un écoulement commence ou finit (une sortie de pompe, un port de cuve, une vidange). Les tuyaux commencent et finissent sur des IP. Les IP ne s'affichent que dans Edit layout.

**List box** (liste déroulante, dropdown) : une case avec un ▼ qui ouvre une liste de choix. Tapez une lettre pour sauter à un choix ; **➕ Add new ...** à la fin en crée un nouveau. Voir [List Boxes (Dropdowns)](189-list-boxes).

**Media folder** (dossier media) : un dossier sur le Pi qui contient des images et des sons. Voir [Media](07-media).

**PLC** (automate) : dans ce projet, une carte de loisir : compatible Arduino (comme la Mega), ESP32 ou Raspberry Pi.

**Raspberry Pi** : le petit ordinateur qui fait tourner le panel et garde tous ses fichiers : le cerveau (Brain) de la brasserie.

**Process** : un fichier texte d'étapes de brassage que le panel exécute tout seul. Voir [Processes](05-scripts).

**Process class** (classe de Process) : Flow, Sub, Repeat ou Looper : ce à quoi sert un Process. Voir [Process language and steps](22-process-language).

**Step** (étape) : une ligne `step "name"` dans un Process. Les étapes se numérotent toutes seules (1.00000, 1.00001 ...). Voir [Process language and steps](22-process-language).

**Schema** : toute la configuration de votre brasserie dans le panel : Tabs, Devices, Widgets, tuyaux et réglages (d'autres programmes l'appellent setup ou configuration). Les exemples sont des Schemas tout prêts. Il est enregistré dans le dossier `config`.

**Shared variable** (variable partagée) : une ancienne classe qui a disparu ; utilisez plutôt un gGlobal. Un Schema plus ancien qui en a encore une se charge sans elle : voir [Shared variables became gGlobals](149-shared-variables-became-gglobals).

**Simulation mode** (mode simulation) : chaque carte est remplacée par le simulateur et le temps peut passer plus vite ou sauter en avant, pour essayer une journée de brassage sans toucher au matériel. Voir [Simulation mode](20-simulation).

**Simulator** (simulateur) : une fausse carte, pour tout essayer sans matériel.

**SVG** : un format d'image qui reste net à toutes les tailles. Le panel fait des copies SVG de vos images PNG et JPG.

**Tab** : un écran de la brasserie.

**Tailscale** : un réseau privé gratuit entre vos propres appareils, pour utiliser le panel hors de chez vous en sécurité. Voir [Installing Tailscale on Windows](00-tailscale-windows).

**gAPI** : retiré le 2026-10-30, c'est maintenant un **gGlobal**. Tout Device ou Widget peut atteindre la base de données et l'API avec ses réglages **Database and .API**.

**gGlobal** : la classe de variable pour les Processes et l'écran ; ses réglages **Database and .API** l'envoient à la base de données ou laissent d'autres programmes l'atteindre. Les noms proposés commencent par `gG` (`gGV_`, `gGB_` ...). C'était gKonstant et gAPI (et avant cela vKonstant et vAPI).

**gKonstant** : retiré le 2026-10-30, c'est maintenant un **gGlobal**.

**Widget** : un élément qui n'existe que dans l'application, relié à aucune carte (images, étiquettes, minuteries, IP, raccords).

**Schema** : toute une configuration de brasserie (Tabs, Devices, Widgets, tuyaux et le Equipment Profile de chaque Tab), gardée dans son propre fichier et choisie dans la liste déroulante Schema en haut. Voir [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Equipment Profile** (profil d'équipement) : les pertes, les cuves et la tuyauterie d'un Tab de brasserie (par exemple le Hot Side, côté chaud, ou la Fermentation), créé sur l'onglet Equipment Profile du ☰ Menu. Chaque Tab peut avoir le sien. N'importe quel Schema peut utiliser n'importe quel profil sur l'un de ses Tabs : propre à un Tab, ou partagé par plusieurs Schemas. Voir [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**☰ Menu** : le bouton en haut à droite de la page Tabs. Edit layout est son premier choix ; les autres ouvrent des onglets de menu. Voir [The ☰ Menu](33-menu).

**Menu tab** (onglet de menu) : une page ouverte depuis le ☰ Menu (Default, Equipment Profile, Vessel, Default Layout, Mash Profile, Boil Profile). Il s'affiche à côté des Tabs d'écran, avec un ✕ pour le fermer, et a un numéro d'Order.

**Default Layout** (disposition par défaut) : les cuves, raccords, IP, tuyaux rigides et souples d'un Tab, gardés dans le Equipment Profile de ce Tab. Le Tab la suit, ou garde sa propre disposition.

**Mash Profile** (profil d'empâtage) : jusqu'à 4 paliers d'empâtage (température et durée) et le rinçage des drêches (sparge). Voir [Mash and Boil Profiles](35-mash-and-boil-profiles).

**Boil Profile** (profil d'ébullition) : la durée totale d'ébullition et l'évaporation par heure.

**Tab Background Profile** : la couleur de fond d'un Tab et l'apparence (couleurs, placement, LED / Text / Gauge) avec laquelle commencent les nouveaux Devices et Widgets qu'on y met. Voir [Tab Background and Valve Profiles](36-tab-and-valve-profiles).

**Valve Profile** (profil de vanne) : les images et l'orientation (Horizontal, Vertical, 45 degrés à gauche ou à droite) avec lesquelles commence une nouvelle vanne, choisies seulement quand la vanne est créée.

**Heat Source** (source de chaleur) : comment une cuve est chauffée : Gas, Electric, RIMS, HERMS, Other ou Unheated. Voir [The Vessel tab](34-vessel-tab).

**Service** : ce que transporte une vanne : Gas, Room Temperature Liquid (liquide à température ambiante), ou High Temperature Liquid (Stainless Steel) (liquide chaud, inox). Une vanne de gaz peut être la source de chaleur d'une cuve.

**Template** (modèle) : une cuve toute prête (Vessel Template) ou un ensemble de jusqu'à quatre raccords (Bundled Fitting Template), gardé dans une bibliothèque. Les Templates Skynet viennent avec le panel et sont seulement clonés ; les User Bundled Templates sont les vôtres. Voir [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

**Tab_Vessel, Tab_Fitting** : la copie d'un Template sur un Tab. Ni un Device ni un Widget, mais il peut contenir les deux. Entièrement modifiable. Voir [Vessel and Fitting Templates](50-vessel-and-fitting-templates).
