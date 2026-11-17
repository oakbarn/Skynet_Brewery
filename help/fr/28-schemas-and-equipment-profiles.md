# Schemas et Equipment Profiles {#schemas-and-equipment-profiles}

Un **Schema** est toute une configuration de brasserie : ses Tabs, ses Devices, ses Widgets, ses tuyaux et le **Equipment Profile** (profil d'équipement) qu'utilise chacun de ses Tabs. Vous pouvez garder autant de Schemas que vous voulez, par exemple un pour le système de 10 gallons et un pour la BrewZilla. Chaque Schema est gardé dans son propre fichier sur le Brain, dans `config/schemas`.

Un **Equipment Profile** décrit votre équipement de brassage : les pertes, le rendement, les cuves et autres équipements dont il est fait **et sa tuyauterie** (son Default Layout). Les profils existent à part, donc **n'importe quel Schema peut utiliser n'importe quel profil**. Un profil utilisé par un seul Tab est **unique** (Unique). Un profil utilisé par plusieurs Schemas est **partagé** (Shared), et un changement sur lui les change tous.

**Un Equipment Profile appartient à un Tab, pas au Schema entier.** Un Schema peut avoir autant d'Equipment Profiles qu'il a de Tabs. En général, il y en a deux : un Tab pour le **Hot Side** (côté chaud : HLT, cuve d'empâtage, cuve d'ébullition, refroidisseur) et un pour la **Fermentation** (les fermenteurs). Un Schema n'utilise un profil que sur un seul Tab. Un Tab sans profil garde son équipement dans le Schema lui-même.

Le profil n'est pas copié dans le Schema. C'est là que l'information est rangée. Les Tab_Vessels, Tab_Fittings, refroidisseurs, serpentins, filtres, IP, tuyaux rigides et souples d'un Tab sont enregistrés dans le Equipment Profile de ce Tab, et ils forment l'**Equipment list** (liste d'équipement) du profil. Chargez un autre Schema qui utilise le même profil sur l'un de ses Tabs, et le même équipement et les mêmes tuyaux sont sur ce Tab.

Les panels faits avant ce changement avaient un seul profil pour tout le Schema. Au premier démarrage après la mise à jour, il passe tout seul au Tab qui contient son équipement (le Tab Equipment, ou le Tab qui a le plus d'équipement). L'équipement des autres Tabs reste où il est, gardé dans le Schema. Les Devices (pompes, vannes, sondes sur une carte), les images et les textes restent avec le Schema.

Seul un **Admin** peut charger, ajouter, renommer, sauvegarder, restaurer ou supprimer un Schema, ou changer un Equipment Profile. Tous les autres peuvent regarder.

## Choisir et charger un Schema {#pick-and-load-a-schema}

1. La liste déroulante **Schema** est sur la barre de menus, à côté du nom du panel, et aussi sur **☰ Menu > Schema** et **☰ Menu > About**. Elle montre le Schema chargé en ce moment.
2. Choisissez un autre Schema dans la liste.
3. Le panel demande si vous voulez le charger, avec un avertissement ⚠ si un Process tourne. Appuyez sur **OK**.
4. Les Processes en marche s'arrêtent, chaque sortie est éteinte, et les Tabs, Devices et Widgets du nouveau Schema prennent le relais. Celui que vous avez quitté est gardé tel quel. Choisissez-le dans la liste pour y revenir.

Chaque Schema se souvient des valeurs de ses propres variables (gGlobals), donc elles reviennent quand vous le rechargez.

Les Processes, les connexions, MQTT, les dossiers media et les listes derrière les listes déroulantes appartiennent au panel. Ils restent les mêmes quel que soit le Schema chargé.

## Ajouter, renommer ou supprimer un Schema {#add-rename-or-delete-a-schema}

En bas de la liste déroulante **Schema** :

- **Add new Schema ...** (aussi **☰ Menu > ➕ New Schema…**) : donnez-lui un nom, puis choisissez à partir de quoi il commence. Chaque étape, avec des images : [Pas à pas : ajouter un Schema](188-step-by-step-add-a-schema). **A copy of** (une copie de) le Schema chargé copie tout, ce qui est bien pour essayer des changements. **An empty Schema** (un Schema vide) commence avec seulement un Tab Main et le Tab Equipment. **An Equipment Profile** (un profil d'équipement) commence avec le matériel de ce profil déjà câblé ([Coller un profil, ou commencer un nouveau Schema à partir de lui](#paste-a-profile-or-start-a-new-schema-from-it)). Le nouveau Schema est chargé tout de suite.
- **Clone a Schema ...** : une copie de n'importe quel Schema sous un nouveau nom, chargée seulement si vous le dites. Voir [Changer de Schema et cloner des Schemas](48-schema-switching-and-cloning).
- **Rename this Schema ...** : donne un nouveau nom au Schema chargé.
- **Delete a Schema ...** : choisissez-en un qui n'est pas chargé. Il est déplacé dans `config/schemas/deleted`, donc on peut le récupérer.

Charger un exemple dans **Settings > Start from a sample Schema** crée aussi un nouveau Schema, donc un exemple n'écrase jamais le vôtre.

## Sauvegardes {#backups}

- **Chaque fois qu'un changement est enregistré**, le Schema tel qu'il était est gardé comme sauvegarde, nommée `<Schema name>_yyyymmddThhmm.BacUp`. Skynet le fait en coulisse et n'a besoin d'aucune action de votre part.
- **Back up this Schema now** dans la liste déroulante Schema en fait une tout de suite.
- Une sauvegarde n'écrase jamais une autre, et aucune n'est jamais supprimée.
- **Restore a backup ...** montre les sauvegardes du Schema chargé avec leurs dates. Choisissez-en une et appuyez sur **Save**. Le Schema tel qu'il est maintenant est d'abord sauvegardé, donc vous pouvez annuler une restauration en restaurant cette sauvegarde.

Les sauvegardes sont dans `config/schemas/backups/<schema name>`.

## Créer un Equipment Profile {#make-an-equipment-profile}

Les Equipment Profiles se créent sur l'onglet de menu **Equipment Profile**. Voir [Le ☰ Menu](33-menu) pour la façon dont les onglets de menu s'ouvrent et se ferment.

1. Appuyez sur **☰ Menu** et choisissez **Equipment Profile**.
2. Dans la liste déroulante **Open** (ou la liste déroulante d'un Tab dans la case du haut), choisissez **Add new ...**.
3. Donnez-lui un nom, par exemple « Oak Barn Hot Side » ou « Fermentation room », et choisissez à partir de quoi il commence : **Answer a few questions (the Interview)** (le premier choix : il demande les cuves, les pompes et les vannes et les construit ; voir [L'Equipment Profile Interview](196-equipment-profile-interview)), les nombres habituels, ou une copie d'un autre profil.
4. Choisissez les **Units** (unités) : US (gallons, livres, °F) ou Metric (litres, kilogrammes, °C).
5. Dans **Use it on a Tab**, choisissez le Tab auquel il est destiné, ou **(not now)** (pas maintenant).
6. Appuyez sur **OK**. Le profil s'ouvre.

## Ce qu'il y a dans un Equipment Profile {#what-is-in-an-equipment-profile}

- **System Loss (Trub, Chiller Manifold and Hoses)** : ce qui reste en route entre la cuve d'ébullition et le fermenteur (trub, collecteur du refroidisseur et tuyaux).
- **Cooling shrinkage** (contraction au refroidissement), **Grain absorption** (absorption du grain), **Brewhouse efficiency** (rendement de la brasserie) et **Hop utilization** (utilisation du houblon). Le Brewhouse efficiency est le seul rendement de Skynet : un nouveau profil commence à 72 %, et chaque recette dont le Tab **Brew on** utilise ce profil calcule son Expected Gravity avec lui ([Le Tab Recipe](99-recipe-tab)).
- **Notes**.
- **Equipment list** : les Tab_Vessels et Tab_Fittings de son Tab, avec leur type, leur taille, le Template d'où ils viennent et la cuve à laquelle chaque raccord est relié. Vous les mettez sur le Tab depuis les [Modèles de cuves et de raccords](50-vessel-and-fitting-templates) (**Add to Tab**) et changez chacun dans ses propriétés sur le Tab.

Certains nombres sont sortis du profil (2026-10-20) :

- La **Batch size** (taille du brassin) et les deux eaux d'**ajout** (top up : cuve d'ébullition et fermenteur) se règlent dans la Recipe (bientôt).
- Le **Boil time** (durée d'ébullition) et le **boil off** (évaporation) sont dans le [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).
- La **taille** et le **volume mort** (dead space) de chaque cuve sont dans ses Propriétés sur le Tab (l'[Equipment Profile Interview](196-equipment-profile-interview) les demande), et la **perte de trub du fermenteur** appartient au Fermenter.

## Modifier ou supprimer un Equipment Profile {#edit-or-delete-an-equipment-profile}

- **Modifier :** choisissez-le dans la liste déroulante **Open**. Changez les nombres, puis appuyez sur **Save** (en haut ou en bas). **Cancel** remet ce qui était enregistré.
- **Supprimer :** ouvrez-le et appuyez sur **Delete**. Les Tabs qui l'utilisaient restent sans profil. Leur équipement et leurs tuyaux restent sur eux.

La case **Check the volumes** (vérifier les volumes) calcule le volume avant ébullition, ce qui s'évapore, le volume après ébullition, ce qui va dans le fermenteur et ce qui reste pour la mise en bouteille ou en fût. Tapez une **Batch size** et choisissez un **Boil Profile** pour les essayer (la Recipe les donnera le jour du brassage). Elle utilise la première **Brew Kettle** et le premier **Fermenter** de l'Equipment list du profil (le profil d'un Tab Fermentation n'a pas de cuve d'ébullition, donc il le dit). Une ligne ⚠ vous prévient quand le volume avant ébullition dépasse ce que contient la cuve, ou quand le brassin dépasse ce que contient le fermenteur.

## Rendement sur ce Schema {#efficiency-on-this-schema}

La mouture du grain, la conversion de l'empâtage et le rinçage changent tous le Rendement de la salle de brassage, et il est difficile de les suivre. Le résultat est facile à suivre, donc Skynet le garde pour vous. La case **Efficiency on this Schema** (rendement sur ce Schema) sous l'Equipment list montre chaque brassin enregistré avec ce profil dans le Schema chargé : la **Date**, la **Recipe**, le Tab **Brew on**, la **OG** (DO), le volume **Into the fermenter** (mis dans le fermenteur) et le vrai **Efficiency** (rendement).

1. Après un brassin, chargez sa Recipe (☰ Menu > Recipe) et vérifiez son Tab **Brew on**.
2. Ouvrez le Equipment Profile de ce Tab et appuyez sur **📝 Record a brew** (enregistrer un brassin).
3. Tapez la **OG** (la densité dans le fermenteur, par exemple 1.052), le volume mis **Into the fermenter** et la **Date**, puis appuyez sur **OK**. Skynet calcule le vrai rendement à partir de la liste de grains de la Recipe et le montre, avec la moyenne.

Les brassins sont gardés dans le **Schema**, donc chaque Schema a sa propre liste (un Schema fait comme copie d'un autre commence avec la liste de celui-ci). Skynet fait la moyenne des **10 derniers brassins** sur ce Schema avec ce profil. 🗑 retire un brassin de la liste quand il a été mal tapé.

**Use the average (x %)** (utiliser la moyenne) met cette moyenne dans le **Brewhouse efficiency** de ce profil. Skynet montre d'abord le changement, et **↩ Undo** (annuler) remet l'ancien nombre. Un profil partagé est changé pour chaque Schema qui l'utilise ; appuyez d'abord sur **Make it unique to this Tab** pour le changer pour ce Schema seulement. Le bouton n'apparaît que quand la moyenne est différente du nombre du profil, pour un Admin, et quand le profil n'est pas verrouillé.

Tout utilisateur peut enregistrer un brassin ; seul un Admin peut utiliser la moyenne.

## Donner à chaque Tab son Equipment Profile {#give-each-tab-its-equipment-profile}

La case en haut de l'onglet **Equipment Profile** liste chaque Tab du Schema chargé, chacun avec son Equipment Profile.

- Choisissez un profil dans la liste déroulante d'un Tab pour l'utiliser sur ce Tab. Choisissez **Add new ...** pour en créer un nouveau. Un profil déjà utilisé sur un autre Tab de ce Schema ne peut pas être choisi (il dit quel Tab).
  - Si ce profil a déjà un **Default Layout** (équipement et tuyaux dessinés), le panel demande ce qui va sur le Tab :
    - **Use its Default Layout** (utiliser sa disposition par défaut) : son équipement et ses tuyaux prennent la place de ceux de ce Tab. Les autres Tabs ne sont pas touchés. Les anciens restent enregistrés dans le profil d'où ils venaient.
    - **Keep this Tab's layout as it is** (garder la disposition de ce Tab telle quelle) : le Tab n'est pas changé, et le Default Layout du profil est laissé tel quel. Voir **The Default Layout** plus bas.
  - S'il n'en a encore aucun de dessiné (un nouveau profil), il prend l'équipement et les tuyaux qui sont sur le Tab maintenant comme Default Layout.
  - Choisir **(none)** retire le profil du Tab. L'équipement et les tuyaux restent sur le Tab, gardés dans le Schema lui-même.
- **Open** ouvre le profil de ce Tab plus bas.
- Sous chaque Tab, il est indiqué si le profil est **Unique** (seul ce Tab l'utilise) ou **Shared** (partagé, et avec quels Schemas et Tabs).
- **Make it unique to this Tab** (le rendre unique à ce Tab) s'affiche quand le profil est partagé. Il fait une copie du profil rien que pour ce Tab, et les autres gardent l'original.

## Le Default Layout {#the-default-layout}

Le **Default Layout** (disposition par défaut) est le dessin du profil : les cuves, raccords, IP, tuyaux rigides et souples de son Tab. Ouvrez-le avec **☰ Menu > Default Layout**, et choisissez le **Tab** en haut.

Un Tab soit **suit** le Default Layout de son profil, soit **garde sa propre disposition** :

- **Suit** (le cas habituel) : ce que vous dessinez sur le Tab est enregistré comme Default Layout. Chaque autre Tab (dans d'autres Schemas) qui suit le même profil montre le même équipement et les mêmes tuyaux.
- **Garde sa propre disposition** : le Tab reste tel quel. Ses changements restent dans le Schema et ne changent pas le profil.

Les boutons de l'onglet Default Layout :

- **Edit it** : ouvre Edit layout sur le Tab.
- **Use it on this Tab** (ou **Load it on this Tab again**) : met le Default Layout sur le Tab, et le Tab le suit désormais. Une sauvegarde du Schema est faite d'abord.
- **Save this Tab's layout as the Default Layout** : l'équipement et les tuyaux du Tab deviennent le Default Layout. Les autres Schemas qui suivent le profil les reçoivent quand ils sont chargés.
- **Keep this Tab's own layout** : arrêter de suivre, et garder le Tab tel quel.

Si un morceau venant d'un Default Layout a le même nom que quelque chose déjà dans le Schema, il reçoit _2 (puis _3 ...) à la fin, pour que deux noms ne se heurtent jamais.

## Verrouiller le Equipment Profile {#lock-the-equipment-profile}

Quand le profil est juste, verrouillez-le pour que rien ne soit dérangé le jour du brassage.

- Allumez **🔒 Locked** à côté du profil du Tab dans la case en haut de l'onglet **Equipment Profile**. Les Operators et les Admins peuvent le faire. Le profil de chaque Tab se verrouille séparément, donc le Tab Fermentation peut rester ouvert pendant que le Hot Side est verrouillé.
- Ou mettez `lock_Equipment` dans un Process (et `unlock_Equipment` pour déverrouiller). Il verrouille (ou déverrouille) les profils de **tous** les Tabs du Schema chargé. Voir [Le langage des Processes et les étapes](22-process-language).

Tant qu'il est verrouillé :

- Ses nombres et sa liste d'équipement ne peuvent pas être changés, et il ne peut pas être supprimé.
- Sur son Tab, **Edit layout** ne peut ni déplacer, ni ajouter, ni changer, ni supprimer d'équipement, d'IP, de tuyaux rigides ou souples. **Save layout** dit qu'il est verrouillé. Les Devices, les images et les textes peuvent toujours être changés, et les autres Tabs aussi.
- Le Tab ne peut pas passer à un autre profil.

Pour déverrouiller, éteignez **🔒 Locked** (le panel demande d'abord), ou lancez `unlock_Equipment`. Le Brew Day (bientôt) verrouillera le profil tout seul quand il commencera.

## Construire l'Equipment list {#build-the-equipment-list}

L'**Equipment list**, sous les nombres, montre ce qu'il y a sur le Tab du profil.

1. Allez dans **☰ Menu > Vessel Templates** (ou **Fitting Templates**). Les boutons sous la liste les ouvrent.
2. Double-cliquez sur un Template et appuyez sur **Add to Tab**. Choisissez le Tab qui utilise le profil.
3. Le nouveau Tab_Vessel ou Tab_Fitting apparaît dans l'Equipment list. Changez-le dans ses propriétés sur le Tab (double-cliquez dessus dans Edit layout).

**Go to the Tab** vous montre le Tab lui-même.

Les profils faits avant les Templates peuvent encore avoir une liste de cuves. Elles s'affichent sous **Made before Templates**, avec **Put on Tab** pour les dessiner sur le Tab du profil ([Réglages d'une cuve](34-vessel-tab)).

## Coller un profil, ou commencer un nouveau Schema à partir de lui {#paste-a-profile-or-start-a-new-schema-from-it}

Un Equipment Profile garde **tout le matériel physique de la brasserie** : les cuves, IP, raccords, tuyaux, tuyaux souples, refroidisseurs, pompes et vannes, **et les Interfaces (cartes), leurs Ports et leur câblage**, chacun avec toutes ses Propriétés et son Nom. Skynet les garde dans le profil chaque fois que le Tab qui l'utilise est enregistré. Deux boutons sous l'Equipment list les utilisent (Admins seulement).

**🗂 New Schema from this profile ...** (nouveau Schema à partir de ce profil ; aussi **Add new Schema ... > Start from > An Equipment Profile**) fait un nouveau Schema avec un Tab qui utilise le profil, donc ses nombres et son dessin viennent aussi, avec chaque carte et chaque Device déjà câblés : les mêmes Noms, Interfaces et Ports. Aucun Processus, Text Widget, Minuterie ou autre Widget ne vient : le nouveau Schema a les siens. Par exemple, construisez votre brasserie une fois comme Equipment Profile, puis faites-en un Schema **Keg Cleaning** (nettoyage des fûts) et écrivez ses Processus, Zones de texte et Minuteries. Le nouveau Schema est chargé tout de suite ; celui que vous aviez reste tel quel.

**📋 Paste onto a Tab ...** (coller sur un Tab) met une copie du matériel du profil sur un Tab du Schema chargé :

1. Choisissez **What to paste** (quoi coller) :
   - **Both** (les deux) : tout.
   - **Vessels Only** (cuves seulement) : chaque cuve avec tout ce qui est dessus (ses IP, raccords, éléments chauffants et sondes).
   - **Manifold Only** (collecteur seulement) : tout le collecteur (pompes, vannes, tuyaux, tuyaux souples, raccords, refroidisseurs), pas les cuves.
2. Choisissez le Tab où il va (**Goes to the Tab**), et appuyez sur **💾 Save**.
3. Quand ce Tab a déjà du matériel qui est le même que celui du profil (la même carte et le même Port, ou une cuve du même Nom), une liste montre ce qui sera remplacé, et les nombres du profil du Tab qui changent (comme « Brewhouse efficiency 74 % → 72 % »). Rien ne change avant que vous appuyiez sur **Replace** (remplacer). **Cancel** (annuler) laisse tout comme avant. Un Device remplacé continue de marcher dans vos Processus.
4. Edit layout s'ouvre et les pièces sont sur le **🔨 Build Tab**. Appuyez sur **✅ Finish Build ... > Move to Tab** : elles vont sur le Tab aux mêmes endroits. Puis appuyez sur **Save layout**.

**↩ Undo** (annuler) s'affiche quelques secondes après un collage et remet tout.

- **Un bout de tuyau dont la pièce n'est pas venue reste ouvert**, pour qu'une cuve puisse y être jointe (avec Manifold Only, les tuyaux qui allaient aux cuves).
- **Une carte déjà utilisée sur un autre Tab de ce Schema arrête le collage.** Rien n'est collé, et une note dit quelle carte et quel Tab. Une carte n'est jamais partagée entre des Tabs, et son ID ne change jamais. Collez sur ce Tab, ou commencez un nouveau Schema à partir du profil. Un nouveau Schema prend toujours les cartes.
- Une carte que le Schema n'a pas encore vient avec le collage, avec son ID et ses réglages.
- Une pièce dont le Nom est déjà utilisé sur un autre Tab reçoit _2 à la fin.

## À venir {#coming-next}

Les recettes (import BeerSmith, mise à l'échelle, SRM et IBU), l'onglet Fermentation, la Brew Day Recipe et des rapports seront ajoutés au **☰ Menu**.
