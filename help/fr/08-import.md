# Import

## Une recette BeerSmith {#a-beersmith-recipe}

1. Dans BeerSmith : **File > Export > BeerXML**.
2. Sur l'écran **Import**, choisissez le fichier `.xml` et appuyez sur **Import**.

Le fichier devient la recette (**☰ Menu > Recipe**), comme **IMPORT** sur cet onglet : tous les houblons arrivent, sans limite, et Skynet met les houblons d'ébullition dans les Hop Groups 1, 2, 3 ... et règle leurs avertissements et leurs Drops en coulisse (voir [The Recipe tab](99-recipe-tab)). Un Process lit la recette avec les valeurs propres à Skynet `skn_rcp_`, comme `skn_rcp_Strike_Temp` (voir [Brew Process](100-brew-process)). Ce ne sont pas des gGlobals et elles ne sont pas sur l'écran Variables.

Seulement quand **Settings > BeerXML mapping** nomme des gGlobals, celles-ci sont remplies aussi (l'ancienne façon, pour un Schema dont les Processes lisent encore des gGlobals). Les exemples n'ont pas de correspondance.
