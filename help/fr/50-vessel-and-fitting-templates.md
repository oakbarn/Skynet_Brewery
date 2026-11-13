# Modèles de cuves et de raccords {#vessel-and-fitting-templates}

Un **Template** (modèle) est une cuve ou un raccord tout prêt, rangé dans une bibliothèque et non sur un Tab. **Add to Tab** en met une copie sur un Tab. La copie est un **Tab_Vessel** ou un **Tab_Fitting**, et elle est à vous : vous pouvez la changer ou la supprimer. Changer la copie ne change jamais le Template.

Il y a deux sortes de Template :

- **Vessel Templates** (modèles de cuves) : bouilloires, HLT, cuves d'empâtage et fermenteurs. Les refroidisseurs, serpentins, filtres à trub et tubes RIMS sont aussi des Vessel Templates, montrés dans leur propre volet **Equipment Templates**.
- **Bundled Fitting Templates** (modèles de raccords groupés) : jusqu'à quatre raccords assemblés (par exemple une vanne, un té avec doigt de gant et un coude à 90 degrés) qui se posent sur un orifice de cuve, ou seuls sur un Tab.

## Templates Skynet et Templates groupés de l'utilisateur {#skynet-templates-and-user-bundled-templates}

| | Template Skynet | Template groupé de l'utilisateur |
|---|---|---|
| Fait par | Skynet (changé seulement par GitHub) | Vous, dans le panel (Admins) |
| Le changer | Non (voir Construire les Templates Skynet plus bas) | Oui |
| Le supprimer | Jamais | Oui |
| Le cloner | Oui : le clone est un Template groupé de l'utilisateur | Oui |
| Add to Tab | Oui | Oui |
| Badge | **Skynet** (listé en premier) | **User** |

Le panel vérifie cela sur le Brain, donc un Template Skynet verrouillé ne peut être ni changé ni supprimé depuis aucun écran.

Les Templates Skynet viennent avec le panel, dans son dossier `templates`, et une mise à jour apporte les plus récents. Les Templates groupés de l'utilisateur sont gardés sur le Brain dans `config/templates/user`, auquel une mise à jour ne touche jamais.

## Les volets des Templates {#the-template-panes}

1. Appuyez sur **☰ Menu** et choisissez **Vessel Templates**, **Equipment Templates** (refroidisseurs, serpentins, filtres à trub, tubes RIMS) ou **Fitting Templates**.
2. Chaque Template s'affiche comme une petite icône avec son nom, pour qu'il en tienne beaucoup sur un écran.
3. **Double-cliquez** sur une icône (sur un téléphone, touchez-la deux fois) pour ouvrir sa fenêtre avec les réglages.
4. **New Vessel Template ...** (ou **New Bundled Fitting Template ...**) en crée un vide (Admins).

Les boutons de la fenêtre d'un Template :

- **✕** et **Cancel** : la ferment sans enregistrer.
- **Clone** : demande un nouveau nom (il propose Copy1_ et le nom ; changez-le comme vous voulez). La copie, avec tous ses réglages visibles dans la fenêtre, est d'abord faite sur le **🔨 Build Tab**. Changez-la là, regardez-la avec **👁 Preview**, puis appuyez sur **💾 Save Build ...** et choisissez **As a Template** : elle est enregistrée sous le nouveau nom (voir [Build Tab](55-build-tab)).
- **Add to Tab** : choisissez le Tab où elle va et un nom (il propose bndl1_TemplateName_TabID ; changez-le comme vous voulez), puis appuyez sur **Add**. La copie est d'abord faite sur le **🔨 Build Tab**. Changez-la là si vous voulez, puis appuyez sur **💾 Save Build ...** et **Save to Tab** : le Tab choisi est proposé en premier (voir [Build Tab](55-build-tab)).
- **Add to Vessel** (raccords groupés seulement) : pose ce raccord sur un orifice d'un Vessel Template (Outlet, Tangential Inlet, Steam Slayer ou CIP Inlet). Le nom proposé est bndl1_FittingName_VesselName.
- **Save** : seulement sur les Templates que vous pouvez changer.
- **Delete** : seulement sur les Templates groupés de l'utilisateur. Un raccord groupé utilisé par un Vessel Template ne peut pas être supprimé tant qu'il n'est pas retiré de cette cuve.

Un **Template Name** n'a pas d'espaces (mettez _ à la place) et doit être unique.

## Réglages d'un Vessel Template {#vessel-template-settings}

- **Template Name**, **Kind** (Vessel, Plate chiller, Chilling coil, HERMS coil, Trub filter) et **Type** (HLT, Brew Kettle, Mash Tun, Fermenter ...).
- **Graphic** : l'image dessinée sur le Tab. Un Template Skynet garde aussi la taille à laquelle son image est dessinée, donc une bouilloire haute reste haute et une large reste large.
- **Size** : unités, taille, volume mort et perte de trub en plus (un fermenteur a le plus grand brassin, le plus petit brassin et la perte de trub).
- **Heat Source** (source de chaleur). Le Device qui chauffe, et sa sonde, sont choisis plus tard sur le Tab_Vessel, car ils appartiennent à un Schema.
- **Connection Standard** et sa **Size** : TC, FPT, MPT, BSP Female Rp, BSP Female Rc, BSP Male Rp, BSP Male Rc, MM Female, MM Male (un nombre, par exemple 1.5) ou DIN (du texte, par exemple DN25). C'est la valeur par défaut pour chaque orifice et chaque raccord groupé. Elle va sur la liste d'équipement et fixe la taille par défaut des images.
- **Ports** : activez chaque orifice que la cuve possède et choisissez sa **position**. **Outlet**, **Second Outlet**, **Tangential Inlet**, **Steam Slayer** et **CIP Inlet** ont aussi une liste **Bundled Fitting** :
  - un raccord groupé Skynet ou de l'utilisateur,
  - **New ...** : donnez-lui un nom, et sa fenêtre s'ouvre pour que vous le construisiez. Fermez-la pour revenir à la cuve.
  - **Clone ...** : choisissez un raccord groupé à copier, et nommez la copie.

Un **Second Outlet** est une seconde vidange, par exemple au-dessus de la résistance pour qu'elle reste toujours sous l'eau (clonez Kettle_Big_Fatty, activez son Second Outlet et choisissez l'image Vessel_Kettle_BigFatty_TwoDrains.svg).

**Bouilloires tout-en-un** : **Kettle_DigiBoil_Electric**, **Kettle_Brewzilla_Electric**, **Kettle_Grainfather_Electric** et **Kettle_Foundry_Electric** ont la résistance intégrée, elles n'existent donc qu'en Templates électriques (voir [Cuves Skynet](62-skynet-vessels)). L'image de la Brewzilla montre son bras de recirculation et sa vanne sur le côté gauche, et son robinet est l'Outlet en bas au milieu. Aucune n'a de doigt de gant, car le panel ne peut pas lire leurs propres thermomètres.

## Réglages d'un Equipment Template {#equipment-template-settings}

Les refroidisseurs, serpentins et filtres à trub ont les mêmes réglages qu'une cuve, plus le nombre de **Liquid ports** (orifices de liquide) pour faire circuler le liquide :

| Sorte | Orifices de liquide |
|---|---|
| Plate chiller (refroidisseur à plaques) | 4 : entrée et sortie du moût, entrée et sortie de l'eau (les deux ne se mélangent jamais) |
| Chilling coil, HERMS coil (serpentins) | **2** (1 entrée, 1 sortie) ou **4** (2 entrées, 2 sorties, par exemple un Chillzilla) |
| Trub filter (filtre à trub) | 2 : entrée et sortie |
| RIMS tube (tube RIMS) | 2 : Wort In et Wort Out |

Avec 4, le second circuit est **In 2** et **Out 2**. Le liquide d'un circuit ne coule jamais dans l'autre.

Sur les refroidisseurs à contre-courant Skynet, les bouts en cuivre nu sont pour le moût et les raccords de tuyau en laiton pour l'eau. Un refroidisseur peut être raccordé dans les deux sens : pour les inverser, choisissez d'autres coins pour **Wort In**, **Wort Out**, **Water In** et **Water Out** (sur le Template, ou sur le Tab_Vessel en Edit layout).

Un **tube RIMS** fait partie de la tuyauterie : le moût entre par un bout et sort par l'autre. Sa **résistance** (un Device Electric Element) va dans un bout et son **doigt de gant** (une sonde de température) dans l'autre. Les deux sont choisis sur le Tab_Vessel. Aucun des deux n'est un IP, donc aucun liquide n'y coule. Une cuve d'empâtage dont la Heat Source est **RIMS** prend son tube RIMS dans l'Equipment Profile.

## Réglages d'un Bundled Fitting Template {#bundled-fitting-template-settings}

- **Template Name** et **Connection Standard** (vide = celui de la cuve).
- **First, Second, Third and Fourth Fitting** (premier à quatrième raccord), de l'orifice de la cuve vers l'extérieur. Chacun est une liste :
  - **Valve** : la vanne elle-même (un Device ou un Widget de vanne manuelle) est choisie quand elle est sur un Tab.
  - **Tee** : activez **Thermowell** si une sonde y est placée, et choisissez sa **Position** (Short ou Long). Un doigt de gant arrête le passage, donc ce côté du té n'a pas d'IP. La sonde est choisie quand il est sur un Tab.
  - **Reducer** : tapez sa **Other end size** (taille de l'autre bout). Il passe de la taille d'avant (au début la taille du Connection Standard) à cette taille, plus petite ou plus grande. Chaque IP après la réduction prend la nouvelle taille.
  - **90 Degree Elbow**, **45 Degree Elbow**, **U**, **CIP Ball Valve**, ou **None**.
- **Graphic** : un raccord groupé Skynet prend une des images Skynet. Un raccord groupé de l'utilisateur peut avoir n'importe quelle image.

La liste des raccords est fixée par Skynet. Une nouvelle sorte de raccord est ajoutée par GitHub.

Le passage dans un raccord groupé va **dans les deux sens**. Le premier raccord est sur l'orifice, mais le liquide peut entrer ou sortir. Par exemple, l'eau du robinet peut passer à l'envers dans une pompe pour l'amorcer.

Les images des Templates Skynet sont des fichiers SVG, et un fichier SVG ne peut pas être supprimé, renommé ou remplacé dans la page Media. Voir [Media (images et sons)](07-media).

## Raccords standard pour la tuyauterie {#standard-fittings-for-piping}

Skynet fournit des raccords simples prêts à mettre dans la tuyauterie, avec leurs IP là où sont les ouvertures sur l'image :

| Fitting Template | IP |
|---|---|
| **Elbow_90** | En bas et à droite |
| **Elbow_45** | À gauche et au coin en haut à droite |
| **Tee** | À gauche, à droite et en haut (le passage va dans tous les sens) |
| **Reducer** | À gauche (le gros bout, TC 2) et à droite (le petit bout, TC 1.5) |
| **Butterfly_Valve_1in** | À gauche et à droite, TC 1.5 : une réduction vers TC 1, une vanne papillon 1", et une réduction pour revenir à TC 1.5 |
| **U_Bend** | Les deux en bas |
| **End_Cap** | Aucun : faites-le glisser sur une ouverture pour la fermer |

Ajoutez-en un à un Tab (**Add to Tab** dans sa fenêtre), faites-le glisser à sa place et tracez des tuyaux vers ses IP. Sur le Tab c'est un **Skynet Fitting** : chaque ouverture a son IP intégré. Pour le tourner dans un autre sens, ouvrez-le en Edit layout et utilisez **Flip Horizontal**, **Flip Vertical** et **Rotate** (par pas de 45 degrés). L'image et ses IP tournent ensemble, donc un seul Elbow_90 couvre toutes les directions. Voir [Raccords Skynet](60-skynet-fittings).

Là où deux tuyaux de tailles différentes se rejoignent sur un IP, le panel dessine tout seul un cône de réduction (voir [Tuyaux, tuyaux souples et réducteurs](24-pipes-and-hoses)). Utilisez le raccord **Reducer** là où il doit figurer sur la liste d'équipement, ou sur un orifice de cuve qui n'a pas la taille de sa tuyauterie.

## Add to Tab {#add-to-tab}

**Add to Tab** ouvre **Edit layout** sur ce Tab avec la copie dessus, **Bundled** (groupée) :

- Un **Tab_Vessel** reçoit ses orifices comme IP, et un **Tab_Fitting** joint à chaque orifice qui a un raccord groupé. Le tout bouge d'un seul bloc.
- Un **Tab_Fitting** seul reçoit un IP **Start**, son IP **End** et un IP pour le côté ouvert de chaque té.

Faites-le glisser à sa place, puis appuyez sur **Save layout**.

## Tab_Vessel et Tab_Fitting {#tab-vessel-and-tab-fitting}

Un Tab_Vessel ou un Tab_Fitting n'est ni un Device ni un Widget. C'est un élément sur un Tab qui peut contenir les deux : une résistance et une sonde sur un Tab_Vessel, une vanne sur un Tab_Fitting, et des IP sur les deux.

Ouvrez-le en **Edit layout** (double-clic, ou gardez le doigt dessus). Désactivez d'abord **Bundled** s'il est groupé. Tout peut être changé, ou il peut être supprimé, même s'il vient d'un Template Skynet. La note en haut dit de quel Template il vient. Son **Label** peut rester vide : le nom s'affiche à la place.

Sur un Tab_Fitting vous choisissez :

- **Turn** (un raccord venant d'un Template groupé de l'utilisateur) : 90, 180 ou 270 degrés dans le sens des aiguilles d'une montre. L'image et ses IP tournent ensemble. Un raccord venant d'un Template Skynet a **Flip Horizontal**, **Flip Vertical** et **Rotate** à la place, et pas de réglages d'IP : voir [Raccords Skynet](60-skynet-fittings).

- chaque **Valve** : **Select Device, Widget or None**. Tant que cette vanne est fermée, rien ne passe dans le Tab_Fitting.
- la **Temperature Probe** de chaque doigt de gant : **Select Temperature Probe or None**.

Supprimer un Tab_Vessel supprime aussi les Tab_Fittings qui y sont joints.

## Joindre un Tab_Fitting à une cuve {#joining-a-tab-fitting-to-a-vessel}

Un raccord groupé est d'habitude déjà sur le Vessel Template, il arrive donc joint. Quand il vous en faut un autre, ou que le Tab_Vessel a été mis sur le Tab en premier :

1. Ajoutez le raccord groupé seul au Tab (**Add to Tab** dans sa fenêtre).
2. En Edit layout, faites glisser le Tab_Fitting (ou son IP **Start**) pour que l'IP Start soit sur l'IP de l'orifice de la cuve, et lâchez.
3. Il se joint à cet orifice : son IP Start disparaît, et le liquide passe entre la cuve et le raccord sans tuyau.

Pour le retirer, ouvrez le Tab_Fitting et désactivez **Joined to its vessel port**. Il retrouve son propre IP Start. Un Skynet Fitting n'a pas ce bouton : avec la cuve dégroupée, faites glisser le raccord hors de l'orifice. Remettez-le sur l'orifice et il se joint à nouveau.

## Construire les Templates Skynet {#building-skynet-templates}

Pour l'instant Skynet construit encore ses Templates, donc les Templates Skynet peuvent être changés dans le panel, et les nouveaux et les clones peuvent être des Templates Skynet (un bouton dans la fenêtre du nom ; désactivé, il fait un Template groupé de l'utilisateur). Ceux qui sont faits ou changés ainsi sont gardés dans `config/templates/skynet` sur le Brain, donc une mise à jour ne peut pas les écraser. Envoyez ce dossier et ils iront dans le dossier `templates` du panel sur GitHub.

Quand ils seront tous finis, Skynet les verrouillera. Dès lors les Templates Skynet ne pourront plus être changés ni supprimés, et chaque nouveau Template ou clone sera un Template groupé de l'utilisateur.
