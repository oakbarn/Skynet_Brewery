# Schemas et Equipment Profiles {#schemas-and-equipment-profiles}

Un **Schema** est toute une configuration de brasserie : ses Tabs, ses Devices, ses Widgets, ses tuyaux et les nombres d'équipement (Equipment numbers) de chacun de ses Tabs. Vous pouvez garder autant de Schemas que vous voulez, par exemple un pour le système de 10 gallons et un pour la BrewZilla. Chaque Schema est gardé dans son propre fichier sur le Brain, dans `config/schemas`.

Un **Equipment Profile** (profil d'équipement) décrit votre équipement de brassage : les pertes, le rendement, les cuves et autres équipements dont il est fait **et sa tuyauterie** (son Default Layout). Les profils existent à part, donc **n'importe quel Schema peut utiliser n'importe quel profil**, sur autant de Tabs que vous voulez.

**Un profil est seulement copié sur un Tab pour commencer une construction.** Les boutons ➡ Transfer, la New Schema Interview et 🗂 New Schema from this profile copient son matériel et ses nombres sur le Tab. Ensuite, **le Tab ne garde aucun lien avec le profil** : un changement sur le Tab ne change jamais le profil, et un changement du profil ne change jamais un Tab. Chaque Tab a ses propres **Equipment numbers** (Brewhouse efficiency, pertes ...), copiés du profil et changés sur le Tab.

Un Schema fait avant ce changement, dont un Tab était lié à un profil, perd ce lien la première fois qu'il est chargé : le Tab garde une copie de l'équipement, des tuyaux et des nombres du profil, donc rien n'y est perdu.

Seul un **Admin** peut charger, ajouter, renommer, sauvegarder, restaurer ou supprimer un Schema, ou changer un Equipment Profile. Tous les autres peuvent regarder.

## Choisir et charger un Schema {#pick-and-load-a-schema}

1. La liste déroulante **Schema** est sur la barre de menus, à côté du nom du panel, et aussi sur **☰ Menu > Schema** et **☰ Menu > About**. Elle montre le Schema chargé en ce moment.
2. Choisissez un autre Schema dans la liste.
3. Le panel demande si vous voulez le charger, avec un avertissement ⚠ si un Process tourne. Appuyez sur **▶ Proceed**.
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
2. Dans la liste déroulante **Open**, choisissez **Add new ...**.
3. Donnez-lui un nom, par exemple « Oak Barn Hot Side » ou « Fermentation room », et choisissez à partir de quoi il commence : **Answer a few questions (the Interview)** (le premier choix : il demande les cuves, les pompes et les vannes et les construit ; voir [L'Equipment Profile Interview](196-equipment-profile-interview)), les nombres habituels, ou une copie d'un autre profil.
4. Choisissez les **Units** (unités) : US (gallons, livres, °F) ou Metric (litres, kilogrammes, °C).
5. Choisissez un **Tab** du Schema, ou **(none)** (aucun). L'Interview construit sur ce Tab. Avec les nombres habituels, l'équipement déjà sur ce Tab est copié dans le nouveau profil (du Tab vers le profil seulement).
6. Appuyez sur **OK**. Le profil s'ouvre (voir **La vue du Equipment Profile** plus bas).

## Ce qu'il y a dans un Equipment Profile {#what-is-in-an-equipment-profile}

- **System Loss (Trub, Chiller Manifold and Hoses)** : ce qui reste en route entre la cuve d'ébullition et le fermenteur (trub, collecteur du refroidisseur et tuyaux).
- **Cooling shrinkage** (contraction au refroidissement), **Grain absorption** (absorption du grain), **Brewhouse efficiency** (rendement de la brasserie) et **Hop utilization** (utilisation du houblon). Le Brewhouse efficiency est le seul rendement de Skynet : il est copié sur chaque Tab où le profil est copié, et une recette calcule son Expected Gravity avec la copie du Tab **Brew on** ([Le Tab Recipe](99-recipe-tab)).
- **Strike offset** (écart d'empâtage) : les degrés ajoutés à la Strike Temperature, pour compenser la chaleur qu'une Mash Tun froide prend à l'eau d'empâtage. Il appartient à l'équipement, pas à la recette : **0** pour un All In One (le grain va dans la cuve qui a chauffé l'eau) ou une Mash Tun préchauffée, plus pour une Mash Tun qui part froide. Chaque Tab a sa propre copie, donc deux brasseries peuvent avoir deux nombres (par exemple 10 °F sur l'une et 0 sur l'autre). Le **Calculate** d'une recette ajoute le Strike offset du Tab **Brew on** ; un Tab sans Strike offset ajoute 0. Changez-le sur le Tab quand l'air de la brasserie est beaucoup plus chaud ou plus froid que d'habitude.
- **Notes**.
- **Son matériel** : les choses réelles de son Tab (voir **La vue du Equipment Profile** plus bas). Vous les mettez sur le Tab depuis les [Modèles de cuves et de raccords](50-vessel-and-fitting-templates) (**Add to Tab**), l'Interview ou Edit layout, et changez chacun dans ses propriétés sur le Tab.

Certains nombres sont sortis du profil (2026-10-20) :

- La **Batch size** (taille du brassin) et les deux eaux d'**ajout** (top up : cuve d'ébullition et fermenteur) se règlent dans la Recipe (bientôt).
- Le **Boil time** (durée d'ébullition) et le **boil off** (évaporation) sont dans le [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).
- La **taille** et le **volume mort** (dead space) de chaque cuve sont dans ses Propriétés sur le Tab (l'[Equipment Profile Interview](196-equipment-profile-interview) les demande), et la **perte de trub du fermenteur** appartient au Fermenter.

## Modifier ou supprimer un Equipment Profile {#edit-or-delete-an-equipment-profile}

- **Modifier :** choisissez-le dans la liste déroulante **Open** (il s'ouvre lui-même, voir **La vue du Equipment Profile** plus bas). Appuyez sur **⚙ Properties**, changez les nombres, puis appuyez sur **💾 Save**. **↶ Undo** remet ce qui était enregistré.
- **Supprimer :** ouvrez-le et appuyez sur **🗑 Delete**. Aucun Tab n'y est lié, donc les Tabs où il a été copié gardent leur équipement, leurs tuyaux et leurs nombres.

**🧮 Check the volumes** (vérifier les volumes), dans la vue du profil, calcule le volume avant ébullition, ce qui s'évapore, le volume après ébullition, ce qui va dans le fermenteur et ce qui reste pour la mise en bouteille ou en fût. Tapez une **Batch size** et choisissez un **Boil Profile** pour les essayer (la Recipe les donnera le jour du brassage). Elle utilise la première **Brew Kettle** et le premier **Fermenter** du profil (le profil d'un Tab Fermentation n'a pas de cuve d'ébullition, donc il le dit). Une ligne ⚠ vous prévient quand le volume avant ébullition dépasse ce que contient la cuve, ou quand le brassin dépasse ce que contient le fermenteur.

## Les Equipment numbers de chaque Tab {#each-tab-s-equipment-numbers}

La case en haut de l'onglet **Equipment Profile** liste chaque Tab du Schema chargé, avec les propres Equipment numbers du Tab. Ils servent de valeurs par défaut du Tab, et vous pouvez les changer à tout moment :

- **⚙ Numbers** (nombres) change le System Loss, le Cooling shrinkage, le Grain absorption, le **Brewhouse efficiency**, le Hop utilization et le **Strike offset** du Tab (Admins). Les mêmes nombres sont dans **Edit layout > Tab Settings > Equipment numbers**.
- **📈 Efficiency** (rendement) montre les brassins de ce Tab (voir **Rendement d'un Tab** plus bas).
- **🔒 Locked** verrouille l'équipement de ce Tab (voir **Verrouiller l'équipement d'un Tab** plus bas).
- **💾 Save as a profile ...** (enregistrer comme profil) copie l'équipement, les tuyaux, le matériel et les nombres du Tab dans un nouvel Equipment Profile, ou par-dessus un profil que vous choisissez. Cela ne va que dans ce sens, du Tab vers le profil, et aucun lien n'est gardé.
- **🔌 Give ... a Port** (donner un Port) s'affiche quand des pompes ou des vannes motorisées copiées sur le Tab n'ont pas encore de Port dans ce Schema.

## Rendement d'un Tab {#efficiency-of-a-tab}

La mouture du grain, la conversion de l'empâtage et le rinçage changent tous le Rendement de la salle de brassage, et il est difficile de les suivre. Le résultat est facile à suivre, donc Skynet le garde pour vous. **📈 Efficiency**, sur la ligne d'un Tab, montre chaque brassin enregistré sur ce Tab : la **Date**, la **Recipe**, la **OG** (DO), le volume **Into the fermenter** (mis dans le fermenteur) et le vrai **Efficiency** (rendement).

1. Après un brassin, chargez sa Recipe (☰ Menu > Recipe) et vérifiez son Tab **Brew on**.
2. Sur ☰ Menu > Equipment Profile, appuyez sur **📈 Efficiency** sur la ligne de ce Tab, puis sur **📝 Record a brew** (enregistrer un brassin).
3. Tapez la **OG** (la densité dans le fermenteur, par exemple 1.052), le volume mis **Into the fermenter** et la **Date**, puis appuyez sur **OK**. Skynet calcule le vrai rendement à partir de la liste de grains de la Recipe et le montre, avec la moyenne.

Les brassins sont gardés dans le **Schema**, donc chaque Schema a sa propre liste (un Schema fait comme copie d'un autre commence avec la liste de celui-ci). Skynet fait la moyenne des **10 derniers brassins** sur le Tab. 🗑 retire un brassin de la liste quand il a été mal tapé.

**Use the average (x %)** (utiliser la moyenne) met cette moyenne dans le **Brewhouse efficiency** du Tab. Skynet montre d'abord le changement, et **↩ Undo** (annuler) remet l'ancien nombre. Seul ce Tab change. Le bouton n'apparaît que quand la moyenne est différente du nombre du Tab, et pour un Admin.

Tout utilisateur peut enregistrer un brassin ; seul un Admin peut utiliser la moyenne.

## Le Default Layout {#the-default-layout}

Le **Default Layout** (disposition par défaut) est le dessin du profil : les cuves, raccords, IP, tuyaux rigides et souples qu'il contient. Il est copié sur un Tab avec les boutons ➡ Transfer (voir **La vue du Equipment Profile** plus bas). **☰ Menu > Default Layout** choisit un **Tab** en haut, avec :

- **Edit this Tab's layout** : ouvre Edit layout sur le Tab.
- **💾 Save this Tab as a profile ...** : copie le dessin, le matériel et les nombres du Tab dans un nouveau profil, ou par-dessus un profil que vous choisissez (du Tab vers le profil seulement).

Si un morceau venant d'un profil a le même nom que quelque chose déjà dans le Schema, il reçoit _2 (puis _3 ...) à la fin, pour que deux noms ne se heurtent jamais.

## Verrouiller l'équipement d'un Tab {#lock-the-equipment-on-a-tab}

Quand l'équipement d'un Tab est juste, verrouillez-le pour que rien ne soit dérangé le jour du brassage.

- Allumez **🔒 Locked** sur la ligne du Tab dans la case en haut de l'onglet **Equipment Profile**. Les Operators et les Admins peuvent le faire. Chaque Tab se verrouille séparément, donc le Tab Fermentation peut rester ouvert pendant que le Hot Side est verrouillé.
- Ou mettez `lock_Equipment` dans un Process (et `unlock_Equipment` pour déverrouiller). Il verrouille (ou déverrouille) **tous** les Tabs du Schema chargé qui ont de l'équipement. Voir [Le langage des Processes et les étapes](22-process-language).

Tant qu'il est verrouillé, **Edit layout** ne peut ni déplacer, ni ajouter, ni changer, ni supprimer l'équipement, les IP, les tuyaux rigides ou souples de ce Tab, et **Save layout** dit qu'il est verrouillé. Les Devices, les images et les textes peuvent toujours être changés, et les autres Tabs aussi.

Pour déverrouiller, éteignez **🔒 Locked** (le panel demande d'abord), ou lancez `unlock_Equipment`. Le Brew Day (bientôt) verrouillera l'équipement tout seul quand il commencera.

## Construire le matériel d'un profil {#build-the-hardware-of-a-profile}

Construisez sur un Tab, puis copiez le Tab dans le profil :

1. Allez dans **☰ Menu > Vessel Templates** (ou **Fitting Templates**).
2. Double-cliquez sur un Template et appuyez sur **Add to Tab**. Choisissez le Tab.
3. Changez-le dans ses propriétés sur le Tab (double-cliquez dessus dans Edit layout), puis **Save layout**.
4. Sur ☰ Menu > Equipment Profile, appuyez sur **💾 Save as a profile ...** sur la ligne de ce Tab. Ouvrez le profil : les pièces y sont.

## La vue du Equipment Profile {#the-equipment-profile-view}

Choisir un profil dans la liste déroulante **Open** montre le profil lui-même. Un Equipment Profile **n'est pas un Tab** : c'est un profil du matériel réel de la brasserie, et c'est tout ce qu'il contient : les cuves, IP, raccords, tuyaux, tuyaux souples, pompes, vannes, éléments chauffants, sondes, refroidisseurs (un refroidisseur à immersion va avec la cuve où il se trouve) et **tout Widget avec une IP** (un Widget avec une IP est une chose réelle), avec leurs Interfaces (cartes) et leurs Ports. Un **Switch qui est une chose réelle** (câblé sur le Port d'une carte) est un Widget spécial comme une Manual Valve, donc il est aussi dans le profil. Les Text Boxes, Processes, Timers, Switches qui ne sont pas des choses réelles et autres **ne peuvent pas être ajoutés** à un profil, ils ne font donc pas du tout partie de cette vue. Rien ne peut y être cliqué.

La barre du haut reste en place :

- **Move** (une liste : **Entire Profile**, **Just Vessels** ou **Just Manifold** : tout, les cuves, le collecteur), **To Tab** (une liste : **🔨 Build Tab** à chaque ouverture du profil, ou un Tab que vous choisissez) et **➡ Transfer**, qui déplace cette partie du matériel en un clic. Ils collent le profil (voir **Coller un profil** plus bas) : les pièces arrivent sur le 🔨 Build Tab, le même matériel est remplacé après la liste Replace, et **↩ Undo** s'affiche ensuite.
- **🗑 Delete**, **💾 Save**, **↶ Undo** et **✕ Close**, dans cet ordre.

En dessous, les **Properties** (propriétés) du profil, les nombres qui vont avec lui sur un Tab : System Loss, Cooling shrinkage, Grain absorption, **Brewhouse efficiency**, Hop utilization et Strike offset. **⚙ Properties** les change (et le Nom, les Unités et les Notes) ; **💾 Save** les garde. À côté :

- **🧮 Check the volumes** et **📈 Efficiency** ouvrent leur case sous la barre (appuyez encore pour la fermer). Voir **Modifier ou supprimer un Equipment Profile** plus haut. **📈 Efficiency** montre le Tab choisi dans To Tab (voir **Rendement d'un Tab** plus haut).
- **🗂 New Schema from this profile ...** (voir plus bas).

**Les Properties vont avec chaque Transfer et chaque collage.** Elles sont copiées sur le Tab comme ses propres Equipment numbers. Quand le Tab a déjà des nombres, ceux qui changent sont dans la liste Replace (« Brewhouse efficiency 74 % → 72 % »). Le collage ne change jamais le profil.

## Coller un profil, ou commencer un nouveau Schema à partir de lui {#paste-a-profile-or-start-a-new-schema-from-it}

Un Equipment Profile garde **tout le matériel physique de la brasserie** : les cuves, IP, raccords, tuyaux, tuyaux souples, refroidisseurs, pompes et vannes, **et les Interfaces (cartes), leurs Ports et leur câblage**, chacun avec toutes ses Propriétés et son Nom. Ils arrivent dans le profil depuis un Tab avec **💾 Save as a profile ...**. Deux choses de la vue du profil les utilisent (Admins seulement).

**🗂 New Schema from this profile ...** (nouveau Schema à partir de ce profil ; aussi **Add new Schema ... > Start from > An Equipment Profile**) fait un nouveau Schema avec un Tab qui commence par une copie du profil, donc ses nombres et son dessin viennent aussi, avec chaque carte et chaque Device déjà câblés : les mêmes Noms, Interfaces et Ports. Aucun Processus, Text Widget, Minuterie ou autre Widget ne vient : le nouveau Schema a les siens. Par exemple, construisez votre brasserie une fois comme Equipment Profile, puis faites-en un Schema **Keg Cleaning** (nettoyage des fûts) et écrivez ses Processus, Zones de texte et Minuteries. Le nouveau Schema est chargé tout de suite ; celui que vous aviez reste tel quel.

**➡ Transfer** met une copie du matériel du profil sur un Tab du Schema chargé :

1. Choisissez quoi déplacer (**Move**) et le **To Tab**, et appuyez sur **➡ Transfer**. Avec **🔨 Build Tab**, les pièces sont pour le Default Tab du Build (sinon le Tab où vous étiez) :
   - **Entire Profile** : tout.
   - **Just Vessels** : chaque cuve avec tout ce qui est dessus (ses IP, raccords, éléments chauffants, sondes et un refroidisseur à immersion dedans).
   - **Just Manifold** : tout le collecteur (pompes, vannes, tuyaux, tuyaux souples, raccords, refroidisseurs à plaques), pas les cuves.
2. Quand ce Tab a déjà du matériel qui est le même que celui du profil (la même carte et le même Port, ou une cuve du même Nom), une liste montre ce qui sera remplacé, et les propres nombres du Tab qui changent (comme « Brewhouse efficiency 74 % → 72 % »). Rien ne change avant que vous appuyiez sur **Replace** (remplacer). **Cancel** (annuler) laisse tout comme avant. Un Device remplacé continue de marcher dans vos Processus.
3. Edit layout s'ouvre sur le **🔨 Build Tab** avec les pièces dessus. Appuyez sur **✅ Finish Build ... > Move to Tab** : elles vont sur le Tab aux mêmes endroits. Puis appuyez sur **Save layout**.

**↩ Undo** (annuler) s'affiche quelques secondes après un collage et remet tout.

- **Un bout de tuyau dont la pièce n'est pas venue reste ouvert**, pour qu'une cuve puisse y être jointe (avec Transfer Manifold, les tuyaux qui allaient aux cuves).
- **Une carte déjà utilisée sur un autre Tab de ce Schema arrête le collage.** Rien n'est collé, et une note dit quelle carte et quel Tab. Une carte n'est jamais partagée entre des Tabs, et son ID ne change jamais. Collez sur ce Tab, ou commencez un nouveau Schema à partir du profil. Un nouveau Schema prend toujours les cartes.
- Une carte que le Schema n'a pas encore vient avec le collage, avec son ID et ses réglages.
- Une pièce dont le Nom est déjà utilisé sur un autre Tab reçoit _2 à la fin.

## À venir {#coming-next}

Les recettes (import BeerSmith, mise à l'échelle, SRM et IBU), l'onglet Fermentation, la Brew Day Recipe et des rapports seront ajoutés au **☰ Menu**.
