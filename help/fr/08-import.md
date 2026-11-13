# Import

## Une recette BeerSmith {#a-beersmith-recipe}

1. Dans BeerSmith : **File > Export > BeerXML**.
2. Sur l'écran **Import**, choisissez le fichier `.xml` et appuyez sur **Import**.

Les valeurs de la recette vont dans les variables nommées dans **Settings > BeerXML mapping**, y compris les paliers d'empâtage et les houblons.

Pour le jour de brassage, utilisez plutôt **IMPORT** sur l'onglet **☰ Menu > Recipe** : tous les houblons arrivent, sans limite, et Skynet met les houblons d'ébullition dans les Hop Groups 1, 2, 3 ... et règle leurs avertissements et leurs Drops en coulisse (voir [The Recipe tab](99-recipe-tab)).

## Un Schema BruControl (Admins) {#a-brucontrol-schema-admins}

1. Choisissez le fichier `.brucfg` (dans *Documents\BruControl* sur l'ordinateur BruControl).
2. Choisissez **Replace** (tout recommencer) ou **Add to what I have** (ajouter à ce que j'ai).
3. Laissez **Run the imported devices in the simulator** coché jusqu'à ce que vous soyez prêt à utiliser le vrai matériel.
4. Appuyez sur **Check file** pour voir ce qui va arriver, puis **Import**.

Les cartes, les Devices, les Tabs, les Widgets et les Processes arrivent avec leurs broches, étalonnages, minuteries, sons, images et positions. Mettez les images BruControl dans le dossier d'images indiqué à l'écran (normalement `Images` ; l'ancien nom `oakbarn` marche toujours) avec l'écran [Media (images et sons)](07-media). Les trois images de fond BruControl de chaque élément deviennent **.backpath**, **.backpath_2** et **.backpath_3** ; les trois peuvent être changées, voir [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths).
