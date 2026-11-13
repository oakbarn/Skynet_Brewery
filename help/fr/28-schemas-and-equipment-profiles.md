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

- **Add new Schema ...** (aussi **☰ Menu > ➕ New Schema…**) : donnez-lui un nom, puis choisissez à partir de quoi il commence. Chaque étape, avec des images : [Pas à pas : ajouter un Schema](188-step-by-step-add-a-schema). **A copy of** (une copie de) le Schema chargé copie tout, ce qui est bien pour essayer des changements. **An empty Schema** (un Schema vide) commence avec seulement un Tab Main et le Tab Equipment. Le nouveau Schema est chargé tout de suite.
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
3. Donnez-lui un nom, par exemple « Oak Barn Hot Side » ou « Fermentation room », et choisissez à partir de quoi il commence : les nombres habituels, ou une copie d'un autre profil.
4. Choisissez les **Units** (unités) : US (gallons, livres, °F) ou Metric (litres, kilogrammes, °C).
5. Dans **Use it on a Tab**, choisissez le Tab auquel il est destiné, ou **(not now)** (pas maintenant).
6. Appuyez sur **OK**. Le profil s'ouvre.

## Ce qu'il y a dans un Equipment Profile {#what-is-in-an-equipment-profile}

- **System Loss (Trub, Chiller Manifold and Hoses)** : ce qui reste en route entre la cuve d'ébullition et le fermenteur (trub, collecteur du refroidisseur et tuyaux).
- **Cooling shrinkage** (contraction au refroidissement), **Grain absorption** (absorption du grain), **Brewhouse efficiency** (rendement de la brasserie) et **Hop utilization** (utilisation du houblon).
- **Notes**.
- **Equipment list** : les Tab_Vessels et Tab_Fittings de son Tab, avec leur type, leur taille, le Template d'où ils viennent et la cuve à laquelle chaque raccord est relié. Vous les mettez sur le Tab depuis les [Modèles de cuves et de raccords](50-vessel-and-fitting-templates) (**Add to Tab**) et changez chacun dans ses propriétés sur le Tab.

Certains nombres sont sortis du profil (2026-10-20) :

- La **Batch size** (taille du brassin) et les deux eaux d'**ajout** (top up : cuve d'ébullition et fermenteur) se règlent dans la Recipe (bientôt).
- Le **Boil time** (durée d'ébullition) et le **boil off** (évaporation) sont dans le [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).
- La **taille** et le **volume mort** (dead space) de chaque cuve sont sur l'onglet Vessel, et la **perte de trub du fermenteur** appartient au Fermenter.

## Modifier ou supprimer un Equipment Profile {#edit-or-delete-an-equipment-profile}

- **Modifier :** choisissez-le dans la liste déroulante **Open**. Changez les nombres, puis appuyez sur **Save** (en haut ou en bas). **Cancel** remet ce qui était enregistré.
- **Supprimer :** ouvrez-le et appuyez sur **Delete**. Les Tabs qui l'utilisaient restent sans profil. Leur équipement et leurs tuyaux restent sur eux.

La case **Check the volumes** (vérifier les volumes) calcule le volume avant ébullition, ce qui s'évapore, le volume après ébullition, ce qui va dans le fermenteur et ce qui reste pour la mise en bouteille ou en fût. Tapez une **Batch size** et choisissez un **Boil Profile** pour les essayer (la Recipe les donnera le jour du brassage). Elle utilise la première **Brew Kettle** et le premier **Fermenter** de l'Equipment list du profil (le profil d'un Tab Fermentation n'a pas de cuve d'ébullition, donc il le dit). Une ligne ⚠ vous prévient quand le volume avant ébullition dépasse ce que contient la cuve, ou quand le brassin dépasse ce que contient le fermenteur.

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

Les profils faits avant les Templates peuvent encore avoir des cuves faites sur l'[L'onglet Vessel](34-vessel-tab). Elles s'affichent sous **Made on the Vessel tab**, avec **Put on Tab** pour les dessiner sur le Tab du profil.

## À venir {#coming-next}

Les recettes (import BeerSmith, mise à l'échelle, SRM et IBU), l'onglet Fermentation, la Brew Day Recipe et des rapports seront ajoutés au **☰ Menu**.
