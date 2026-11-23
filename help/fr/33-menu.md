# Le ☰ Menu {#the-menu}

Le bouton **☰ Menu** est en haut à droite de la page **Tabs**, là où était autrefois la case Edit layout. Appuyez dessus pour voir ses choix. Le même bouton ☰ Menu est aussi sur presque chaque fenêtre qui s'ouvre, et sur la barre de menus de chaque autre page, voir [Le ☰ Menu partout](51-menu-everywhere). (La ligne du haut du panel avec Processes, Settings, Help ... est la barre de menus, Menu Bar, voir [La barre de menus (Menu Bar)](40-menu-bar).)

- **Show Top Line** / **Hide Top Line** : la Top Line (ligne du haut) du panel est cachée sur la page Tabs ; ceci la fait revenir. Voir [La Menu Bar](40-menu-bar).
- **Process Editor** (seulement quand il est ouvert) : chaque bouton de l'éditeur de Processes, de New et Save jusqu'à Stop all et l'interrupteur Colors, chacun faisant la même chose que son bouton. Voir [L'éditeur de Processes](30-process-editor).
- **Edit layout** (Admins) : change les Tabs. C'est le premier choix. Pendant que vous êtes dans Edit layout, il indique **Exit Edit layout**. Voir [Tabs (les écrans de votre brasserie)](02-tabs).
- Les **onglets de menu** (Menu tabs) : Zoom (numéro 1 au départ), Default settings, Equipment Profile, Vessel Templates, Equipment Templates, Fitting Templates, Default Layout, Mash Profile, Boil Profile, Tab Profile, Valve Profile et Pump Profile.
- **File Move Utility** (Admins) ouvre la page File Move. Voir [File Move (copier des fichiers de votre ordinateur vers le Brain)](32-file-move).
- **Recipe** et **Fermentation** sont grisés. Ils arrivent dans les prochaines étapes.
- **Schema** : la liste déroulante Schema (la même que sur la barre de menus), chaque Schema du Brain avec **Load** et **Clone**. Voir [Changer de Schema et cloner des Schemas](48-schema-switching-and-cloning).
- **About** (toujours en haut du Menu ; il ne peut pas être déplacé dans la liste Order) : qui est connecté, **Sign out**, la liste déroulante Schema et la version du Schema. Voir [About et les versions de Schema](42-about-and-schema-versions).
- **Pages** (à la fin) : chaque page de la barre de menus, et sous chaque page (marquées ↳) ses parties : vos Tabs d'écran, les Interfaces (cartes), les Users, MQTT and voice, les Backups ... Choisissez-en une pour y aller directement. Voir [Chaque écran dans le ☰ Menu](67-every-screen-in-the-menu).

## Les onglets de menu {#menu-tabs}

Un onglet de menu ne s'affiche qu'une fois que vous l'avez choisi. Il s'ouvre à côté de vos Tabs d'écran, avec un ☰ devant son nom, et remplit la place du dessin du Tab.

- Appuyez sur un Tab d'écran (Brewery, Equipment ...) pour revenir à vos Tabs. Les onglets de menu que vous avez ouverts restent là-haut, donc un appui vous y ramène.
- Appuyez sur le **✕** d'un onglet de menu pour le fermer.
- Chaque onglet de menu a aussi **Close** et un **✕** encadré dans son coin en haut à droite. L'un ou l'autre ferme l'onglet de menu que vous regardez. La page Help et la page File Move les ont aussi ; là, ils vous ramènent là où vous étiez.
- La Top Line s'affiche toujours sur un onglet de menu (seuls vos propres Tabs la cachent, voir [La Menu Bar](40-menu-bar)).
- Si un onglet de menu a des changements non enregistrés, le panel demande avant de le fermer ou de passer ailleurs.
- **✔ Saved :** quand vous appuyez sur **Save** et restez sur le même écran (un onglet de menu, Settings, Default settings, un profil ...), une case **✔ Saved** s'affiche au milieu de l'écran pendant 2 secondes et part toute seule. Il n'y a rien à cliquer (Règle Skynet 2.54). Toutes les autres notes courtes s'affichent dans la même grande case au milieu de l'écran : bleue pour une information, rouge pour un avertissement ou un problème.
- **Delete, Save, Undo, Close et ✕** sont ensemble, dans cet ordre, figés dans le coin en haut à droite de Default settings, de l'Equipment Profile, de la Recipe et de chaque onglet de profil (Pump, Valve, Tab, Mash, Boil, Water). **Save** enregistre et l'onglet reste ouvert. **Undo** revient au dernier enregistrement et l'onglet reste ouvert (il remplace Cancel). **Close** (et le ✕ encadré) ferme l'onglet du Menu ; s'il y a des changements non enregistrés, Skynet demande d'abord (Règle Skynet 2.54).

Tout le monde peut regarder les onglets de menu. Seul un Admin peut les changer (un Operator peut verrouiller et déverrouiller le Equipment Profile).

**L'onglet Default s'appelle maintenant Default settings** (2026-11-07). Il ne contient que ce avec quoi commence une **nouvelle** chose (Règle Skynet 2.42). Voir [Réglages par défaut](155-default-settings).

## L'onglet Default {#the-default-tab}

**Chaque valeur par défaut se règle ici : ce avec quoi commence une nouvelle chose.** Ce avec quoi commence une nouvelle recette : les Units, la Batch size, l'Equipment Profile, le Mash Profile et le Boil Profile (chacun peut être changé dans la recette elle-même). Le Tab Profile qu'un nouveau Tab reçoit (le Valve Profile et le Pump Profile d'un nouvel élément est celui marqué Default dans sa propre liste). **Labels** et **Text Boxes** : les valeurs par défaut de chaque case de texte (voir [Cases de texte](49-text-boxes)). Les nouveaux Templates de l'utilisateur et Schemas. Appuyez sur **Save**.

Ce qui change les choses déjà faites, ou la façon dont tout le panel marche, est dans **☰ Menu > Default settings** ([Réglages](09-settings)) : la Top Line ([La Menu Bar](40-menu-bar)), **Sound**, **On startup** ([Zoom et plein écran](41-zoom-and-full-screen)), **\L Rich Text Code Size** ([Rich Text Embedded Code](90-rich-text-embedded-code)), Hover Delay, Phones and tablets ([Téléphones et tablettes](45-phones-and-tablets)), les Hop alerts et l'**ordre du Menu**.

**Sound** (son ; dans ☰ Menu > Default settings) :

- **Sound on** : la même chose que le bouton du son en haut de la page. Il active ou coupe le son sur cet écran tout de suite, et n'est pas enregistré.
- **Turn Sound On when starting** : quand ceci est actif, le son s'active tout seul chaque fois que le panel s'ouvre et chaque fois qu'un Schema est chargé, donc vous n'avez pas à cliquer sur l'icône **Sound**. Appuyez sur **Save** pour le garder.

Les navigateurs (Chrome, Edge, Safari, iPhone et Android) ne laissent une page jouer aucun son tant que vous ne l'avez pas touchée ou cliquée une fois. Donc quand le panel s'ouvre, le bouton du haut dit **Sound on (tap anywhere)** : touchez ou cliquez une fois n'importe où sur la page et le son joue à partir de là. Une alarme qui s'est déclenchée avant ce premier toucher commence dès que vous touchez.

**L'ordre du Menu** (dans ☰ Menu > Default settings) : chaque onglet de menu a un numéro d'Order. Tapez un nouveau numéro pour y déplacer un onglet de menu. Les autres sont renumérotés pour faire de la place (1, 2, 3 ...), et le Menu et les onglets de menu ouverts se trient tout seuls. Les nouveaux onglets de menu ajoutés plus tard vont à la fin.

## Les autres onglets de menu {#the-other-menu-tabs}

- **Zoom** : la taille d'affichage des Tabs, et le plein écran. Voir [Zoom et plein écran](41-zoom-and-full-screen).
- **Equipment Profile** : les pertes et le rendement, les cuves, et quel profil utilise chaque Tab du Schema chargé. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).
- **Vessel** n'existe plus : l'[Equipment Profile Interview](196-equipment-profile-interview) l'a remplacé. Voir [Réglages d'une cuve](34-vessel-tab).
- **Vessel Templates**, **Equipment Templates** et **Fitting Templates** : des cuves, refroidisseurs, serpentins, filtres à trub et Bundled Fittings tout prêts (Skynet et les vôtres) en petites icônes. Double-cliquez sur l'un pour ses réglages, ou mettez-en une copie sur un Tab. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).
- **Default Layout** : les cuves et les tuyaux qu'un Tab reçoit avec son Equipment Profile. Voir [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).
- **Mash Profile** et **Boil Profile** : voir [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).
- **Tab Profile**, **Valve Profile** et **Pump Profile** : voir [Tab Profiles et Valve Profiles](36-tab-and-valve-profiles).
- **Move Brain** (Admins) : tout déplacer vers un nouveau Brain, par exemple d'un ordinateur vers un Raspberry Pi, puis corriger les ports USB. Voir [Déplacer le Brain](119-move-brain).
- **Schema** : voir [Changer de Schema et cloner des Schemas](48-schema-switching-and-cloning).
- **About** : voir [About et les versions de Schema](42-about-and-schema-versions).
