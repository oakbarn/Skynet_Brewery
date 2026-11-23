# Le Tab Recipe {#the-recipe-tab}

Appuyez sur **☰ Menu** et choisissez **Recipe**. C'est la recette du jour de brassage. Faites-la venir de BeerSmith, ou commencez-en une nouvelle et remplissez-la. Il n'y a pas de limite au nombre de grains, houblons, levures ou adjuvants.

En haut :

- **IMPORT** fait venir un fichier de recette (plus bas).
- **NEW** vide la recette et en commence une à partir des valeurs par défaut (☰ Menu > Default).
- **Library ...** ouvre une recette enregistrée, enregistre celle-ci (💾), ou supprime une recette enregistrée. Les recettes enregistrées sont sur le Brain dans `config/recipes`.
- **Cancel** et **Save**.

## Brew on : le Tab du brassin {#brew-on-the-tab-for-the-brew}

**Brew on** (à côté de Brew Length) choisit le Tab sur lequel cette recette est brassée. Il liste les Tabs qui ont des Equipment numbers, avec le rendement de brasserie (Brewhouse Efficiency) de chaque Tab. Le Tab choisi devient le Tab du brassin.

Une recette nouvelle ou importée commence sur le Tab dont l'équipement a une cuve d'empâtage (Mash Tun) ou un All In One, sinon sur le premier Tab qui a des Equipment numbers. Un Tab renommé reste choisi.

L'**Expected Gravity** et les points de densité utilisent le **rendement de brasserie de ce Tab**. C'est le seul rendement de Skynet : il n'y a pas de valeur par défaut générale, et une recette n'en garde jamais un à elle. Un nouvel Equipment Profile commence à 72 %, il est copié sur un Tab avec le profil, et vous le changez sur le Tab : **⚙ Numbers** sur ☰ Menu > Equipment Profile, ou Tab Settings ([Equipment Profiles](28-schemas-and-equipment-profiles)). Sans Tab choisi, les grains et les adjuvants n'ont pas de points de densité, et l'Expected Gravity reste vide.

## Le niveau {#the-level}

Choisissez le **Level** (niveau) de la recette en haut du Tab Recipe, à côté de NEW. **NEW** le demande aussi.

- **1 Can Kit** : un kit en boîte d'extrait, pour un brasseur débutant. Une boîte d'extrait de malt houblonné, souvent avec du sucre ou de l'extrait de malt sec, puis la levure. Pas de grain et pas de houblon à ajouter.
- **2 Extract** : extrait de malt (liquide ou sec) bouilli avec vos propres houblons. Pas de grain.
- **3 Partial Grain** : extrait avec une partie de grain et des houblons. Un peu de grain est empâté ou infusé dans un peu d'eau, puis l'extrait et vos propres houblons.
- **4 All Grain** : tout le sucre vient du grain empâté.

Le Tab Recipe ne montre que les cases et les onglets qu'utilise ce niveau. Le niveau 1 montre les onglets Fermentable, Yeast, Adjuncts et Waters. Le niveau 2 ajoute HOPs et Drops. Les niveaux 3 et 4 montrent tout. Changer de niveau ne supprime jamais rien : une case cachée garde sa valeur.

Aux niveaux 1 et 2, l'onglet Fermentable ne propose que des **extraits** (Extract et Dry Extract). Les niveaux 3 et 4 proposent aussi les adjuvants et les sucres, et l'onglet Grain.

Chaque niveau a l'onglet Waters, et il commence avec **Tap Water** : votre propre eau, remplie dans ☰ Menu > Default settings > **Tap Water**.

Un fichier de recette que vous importez (IMPORT) arrive à son propre niveau (une recette à l'extrait au niveau 2, un empâtage partiel au niveau 3, un tout-grain au niveau 4). Changez-le si c'est un kit en boîte.

Le côté technique : le niveau est le Skynet_Field `skn_rcp_Level` (1 à 4), donc un Process peut faire les étapes de son niveau. Il est enregistré avec la recette, et son type BeerXML dit la même chose (les niveaux 1 et 2 sont Extract, 3 est Partial Mash, 4 est All Grain).

## Les cases {#the-boxes}

Chaque case a un haut coloré qui dit de quelle sorte elle est :

- **Noir** : les noms (Beer Name, Style, Brew Length).
- **Gris** : les temps et les choix (Sparge Type, Sparge Minutes, Boil Minutes, Whirlpool Minutes, Grain Ratio).
- **Bleu** : les volumes (Strike Volume, Sparge Volume, PreBoil Volume).
- **Rouge** : les températures (Strike, Grain et Sparge Temperature, Pitch At).
- **Gris clair** : calculé par Skynet, pas tapé : **Grain Wt.**, **1st Mash** et **IBU** viennent des onglets Grain, MASH et HOPs.

La plupart des cases peuvent être changées. **Style** est une liste ; **Add new ...** y ajoute un style.

Appuyez sur **Calculate** pour calculer le poids total de grain, les ajouts de houblon, les avertissements et messages, la température du premier palier, les IBU (à partir de l'AAU réelle de chaque houblon), et le volume et la température d'empâtage ainsi que le volume et la température de rinçage, à partir de la température du grain et du rapport eau/grain. La température d'empâtage ajoute le **Strike offset** du Tab **Brew on** ([Profils d'équipement](28-schemas-and-equipment-profiles)). Appuyez ensuite sur **Save**. Une recette importée arrive déjà calculée.

La recette est gardée en kilogrammes, litres et °C. Elle s'affiche dans les unités que vous choisissez sur le Tab Default (voir **Valeurs par défaut de la recette** plus bas).

## Skynet_Fields

Chaque case du Tab Recipe et de ses Daughter Tabs (onglets filles) est un **Skynet_Field** : elle a un nom Skynet fixe qui commence par `skn_rcp_`, montré quand la souris se pose sur la case. Un Process les lit (ils y sont en lecture seule), par exemple `skn_rcp_Strike_Temp`, `skn_rcp_Boil_Minutes` ou `skn_rcp_Pitch_Temp`. Les noms ne changent jamais.

| Case | Skynet_Field |
|---|---|
| Beer Name | `skn_rcp_Name` |
| Style | `skn_rcp_Style` |
| Level | `skn_rcp_Level` |
| Brew Length | `skn_rcp_Batch_Volume` |
| Grain Wt. | `skn_rcp_Total_Grain_Weight` |
| 1st Mash | `skn_rcp_First_Mash_Temp` |
| IBU | `skn_rcp_IBU` |
| Expected Gravity | `skn_rcp_Expected_Gravity` |
| Strike Volume | `skn_rcp_Strike_Volume` |
| Strike Temperature | `skn_rcp_Strike_Temp` |
| Grain Temperature | `skn_rcp_Grain_Temp` |
| Sparge Volume | `skn_rcp_Sparge_Volume` |
| Sparge Type | `skn_rcp_Sparge_Type` |
| Sparge Minutes | `skn_rcp_Sparge_Minutes` |
| Sparge Temperature | `skn_rcp_Sparge_Temp` |
| PreBoil Volume | `skn_rcp_Boil_Volume` |
| Boil Minutes | `skn_rcp_Boil_Minutes` |
| Whirlpool Minutes | `skn_rcp_Whirlpool_Minutes` |
| Pitch At | `skn_rcp_Pitch_Temp` |
| Grain Ratio | `skn_rcp_Grain_Ratio` |
| Waters : Water Profile | `skn_rcp_Water_Profile` |
| MASH : Mash Profile | `skn_rcp_Mash_Profile` |
| Onglet Hops : nombre de lignes de houblon | `skn_rcp_Hop_Count` |

Chaque ligne de l'onglet Hops a ses propres Skynet_Fields, N = le numéro de la ligne (1, 2, 3 ... sans limite) :

| Case de l'onglet Hops | Skynet_Field |
|---|---|
| Hop N (son nom) | `skn_rcp_Hop_N_Name` |
| Ounces (ou Grams) | `skn_rcp_Hop_N_Amount` |
| Unit (oz ou g) | `skn_rcp_Hop_N_Measurement` |
| AAU % Recipe | `skn_rcp_Hop_N_AA_Recipe` |
| AAU % Actual | `skn_rcp_Hop_N_AA_Actual` |
| Calc oz | `skn_rcp_Hop_N_Calc_Amount` |
| Boil, Mash, 1st Wort, Secondary, Dry Hop ou Whirlpool | `skn_rcp_Hop_N_Use` |
| Hop N Min | `skn_rcp_Hop_N_Min` |
| Hop N Drop | `skn_rcp_Hop_N_Drop` |
| Hop N IBU | `skn_rcp_Hop_N_IBU` |
| Hop N Boil Group | `skn_rcp_Hop_N_Boil_Group` |
| Jours Secondary ou Dry Hop | `skn_rcp_Hop_N_Days` |
| Date Secondary ou Dry Hop | `skn_rcp_Hop_N_Date` |
| Température du Whirlpool | `skn_rcp_Hop_N_Whirlpool_Temp` |
| Hop Rocket | `skn_rcp_Hop_N_Hop_Rocket` |

Par exemple `skn_rcp_Hop_1_Name` est le premier houblon. Une ligne que la recette n'a pas se lit comme vide (ou 0).

Les onglets Grain et Fermentable marchent de la même façon : `skn_rcp_Grain_Count`, `skn_rcp_Grain_N_Name`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, et `skn_rcp_Fermentable_Count`, `skn_rcp_Fermentable_N_Name`, `_Type`, `_Amount`, `_Potential`, `_SRM`, `_PPG_SG`, `_After_Boil`.

L'onglet Yeast aussi : `skn_rcp_Yeast_Count`, `skn_rcp_Yeast_N_Name`, `_Form`, `_Amount`, `_Measurement` (Packs, g, oz ou ml), `_Attenuation`, `_Min_Temp`, `_Max_Temp`, `_Lab`, `_Product_ID`, `_Type`, `_Flocculation`, `_Starter`, `_Starter_Size`, `_Times_Cultured`, `_Mfg_Date`, `_Notes`. `skn_rcp_Yeast_Name` reste la première levure.

## Les Daughter Tabs {#the-daughter-tabs}

Les boutons sous les cases ouvrent les Daughter Tabs. **◀ Back to the Recipe tab** (ou **Recipe** dans le titre) revient.

- **HOPs** : ajouter, modifier ou supprimer les houblons d'ébullition. L'AAU réelle des houblons utilisés dans le brassin DOIT être mise à jour ; les quantités sont ajustées à partir d'elle pour garder les IBU.
- **Pre and Post Boil Hops** : les houblons qui ne sont pas des houblons d'ébullition : empâtage, premier moût, secondaire, houblonnage à cru et whirlpool. Leur AAU réelle doit aussi être mise à jour.
- **Drops** : les groupes d'ajouts de houblon, les délais d'avertissement et les textes d'alerte, calculés à partir des houblons (voir **Programme et alertes de houblonnage**).
- **Grain** : ajouter, modifier ou supprimer des grains. Leur poids total est le Grain Wt.
- **Fermentable** : ajouter, modifier ou supprimer les autres fermentescibles : adjuvants, extraits, sucres, fruits et jus.
- **Yeast** : ajouter, modifier ou supprimer des levures et des levains.
- **Adjuncts** : ajouter, modifier ou supprimer des adjuvants comme le Whirlfloc, un nutriment pour levure ou le gypse (BeerSmith les appelle Misc).
- **Waters** : le profil d'eau.
- **MASH** : le profil d'empâtage et de rinçage (Mash and Sparge Profile).

Tous les boutons des Daughter Tabs ont la même taille.

Les onglets Hops, Pre and Post Boil Hops, Grain, Fermentable, Yeast, Adjuncts, MASH et Waters sont construits (plus bas). Les cases propres aux autres onglets viendront ensuite. En attendant, chacun montre ce que la recette contient pour lui, et Waters et MASH ont les listes de profils.

## L'onglet Hops {#the-hops-tab}

Une ligne pour chaque houblon d'ébullition, sans limite. **Add Hop +** met une nouvelle ligne en bas ; **Delete** sur une ligne la retire. **Calculate** est aussi en haut à droite des onglets Hops et Pre and Post Boil Hops.

- **Le titre de la ligne** est son groupe de houblon, en couleur : **Bitter Hops** (orange, amertume) au-dessus de 20 minutes, **Flavor Hops** (jaune, saveur) au-dessus de 5 jusqu'à 20, **Aroma Hops** (vert, arôme) 5 minutes ou moins. Il change dès que Min change.

- **Hop N** : le nom du houblon.
- **Ounces** (ou Grams) : la quantité dans la recette, dans l'**Unit** propre de la ligne.
- **Unit** : **oz** ou **g**, pour cette ligne de houblon seulement, quoi que dise Settings > Units. La changer convertit la quantité (1 oz s'affiche 28,3 g). Une nouvelle ligne commence dans les Units ; un houblon BeerSmith .bsmx arrive en oz, un houblon BeerXML comme le fichier le montre (en grammes s'il ne le dit pas).
- **AAU % Recipe** et **Actual** (rouge) : l'acide alpha du houblon de la recette, et celui des houblons que vous avez (sur le paquet). **Tapez l'Actual pour chaque houblon.** Il commence à 0, pour un houblon importé et pour un nouveau.
- **Calc oz** (ou **Calc g**) : la quantité à utiliser avec l'AAU réelle, pour que la bière ait les IBU de la recette, dans l'Unit de la ligne.

**oz → g** (à côté de Add Hop +) passe toutes les lignes de houblon en onces en grammes d'un seul appui. Les grammes sont plus précis, et certaines balances démarrent en grammes. Seule l'unité change ; la quantité de houblon reste la même. Appuyez sur Save pour la garder.
- **Hop N Min** : les minutes d'ébullition. Min = la durée d'ébullition, c'est un houblon de début d'ébullition.
- **Hop N Drop** : à quel moment de l'ébullition il est ajouté, en heure : 75 minutes s'affiche **01:15:00**. **Hop N IBU** : son amertume.

**La case carrée** d'une ligne envoie le houblon à l'onglet **Pre and Post Boil Hops**.

## L'onglet Pre and Post Boil Hops {#the-pre-and-post-boil-hops-tab}

Les houblons qui ne sont pas des houblons d'ébullition, chacun avec son AAU **Recipe** et **Actual** comme sur l'onglet Hops, et une case d'interrupteurs : **Mash Hops, 1st WORT Hops, Secondary Hops, DRY Hops, Whirlpool**. Un clic sur un interrupteur est gardé tout de suite : il n'y a ni Save ni Cancel sur une ligne. Désactivez son interrupteur et le houblon redevient un houblon d'ébullition, de retour sur l'onglet Hops. **Delete** a la même taille que la ligne.

- **Secondary Hops** et **DRY Hops** : la date, les jours, et la **Pull Date** (la date plus les jours : le jour où retirer les houblons).
- **Whirlpool** : les questions Whirlpool : **Hop Stand**, sa **Temperature** et son **Time** (elles commencent vides ; l'aide au survol donne les chiffres courants, voir [Les trois Hop Stands](35-mash-and-boil-profiles#the-three-hop-stands)), les **Min** propres au houblon, et **Hop Rocket** quand le whirlpool passe par un Hop Rocket.

**Ordre.** Avec **Calculate** et avec **Save**, les lignes se mettent en ordre : les houblons d'ébullition par moment d'ajout (un houblon de début d'ébullition d'abord, puis par minutes), puis les houblons Mash, 1st WORT, Secondary, DRY et Whirlpool.

Un changement de la **Temperature** ou du **Time** d'un Hop Stand sur un houblon Whirlpool est le Hop Stand propre à la recette : le Tab Recipe le montre tout de suite.

**Calculate a besoin que chaque AAU réelle soit au-dessus de 0**, sur l'onglet Hops et sur l'onglet Pre and Post Boil Hops. La recette est basée sur l'AAU de la recette, mais les vrais IBU d'un brassin viennent de l'AAU réelle, l'AAU sur le paquet de houblon. Quand une AAU réelle est à 0, rien n'est calculé : Skynet passe à l'onglet du premier, met en surbrillance chaque AAU réelle à 0 et affiche un avertissement qui nomme chaque houblon (Hop 3 (Cascade)). Appuyez sur **READ** pour le fermer, corrigez les AAU réelles et appuyez à nouveau sur Calculate. Un houblon dont l'AAU de la recette est 0 n'est pas demandé : un import lui donne une AAU réelle de 0,01.

**Calculate enregistre.** Quand il calcule la recette, il l'enregistre aussi.

## Les onglets Grain et Fermentable {#the-grain-and-fermentable-tabs}

Les fermentescibles d'une recette sont répartis sur deux onglets. **Grain** contient ceux de type Grain (le type n'est pas montré). **Fermentable** contient tous les autres types, choisis dans la liste **Type** (la liste BeerXML : Adjunct, Extract, Dry Extract, Sugar). Chaque ligne Fermentable a aussi une liste **Measurement** (Pounds, Ounces, Kilograms, Grams) pour sa propre quantité. Les deux listes sont à choix seulement. **Add Grain +** ou **Fermentable +** met une nouvelle ligne en bas ; **Delete** en retire une. Il n'y a pas de limite.

- **Name**, le poids, **Potential** (le rendement, %), **SRM** (la couleur) et **PPG>SG**, ses points de densité (calculés).
- Le poids s'affiche dans le **standard de poids du grain** choisi dans ☰ Menu > Default (Pounds ou Kg). Un fichier BeerSmith ou BeerXML importé y est aussi montré. Son étiquette, et l'étiquette PPG>SG, ne peuvent être changées que dans ☰ Menu > Default settings.
- **Points de densité** = Potential × 46.214 × livres × rendement ÷ gallons du brassin. Les grains et les adjuvants utilisent le rendement de brasserie du Tab **Brew on** ; les extraits, sucres, fruits et jus donnent tout leur sucre. Les points de chaque ligne s'additionnent dans la case **Expected Gravity** (densité attendue) du Tab Recipe (1 + points ÷ 1000), calculée chaque fois qu'une quantité change, et par Calculate. Il faut la Brew Length. Une case **PPG>SG** vide dit ce qu'elle attend : **Brew Length?**, **Potential?** ou **Brew on Tab?** (un grain n'a pas de points de densité sans le rendement de brasserie de l'Equipment Profile du Tab Brew on, Règle 17.13).
- La case **Grain Wt.** du Tab Recipe suit l'onglet Grain tout de suite : les grains et les fermentescibles de type Adjunct.
- Chaque ligne tient sur une ligne, toutes les cases à la même hauteur.
- **After Boil** (onglet Fermentable seulement) : un interrupteur, montré seulement pour les types qu'un brasseur ajoute pendant ou après l'ébullition (Extract, Dry Extract, Sugar, Fruit, Juice). Activé veut dire qu'il est ajouté après l'ébullition. Le grain n'est jamais ajouté après l'ébullition, donc l'onglet Grain n'en a pas.

Chaque onglet montre son poids total. Un import fait venir chaque champ de grain (notes, protéines, humidité et le reste aussi), prêt pour plus tard.

## L'onglet Yeast {#the-yeast-tab}

Une ligne pour chaque levure, sans limite. **Yeast +** met une nouvelle ligne en bas ; **Delete** en retire une.

- **Yeast N** (le nom), **Form** (Dry, Liquid, Slurry ou Culture), **Amount** et son **Unit** propre : **Packs**, **g**, **oz** ou **ml**. La plupart des levures viennent en sachets (Packs), certaines recettes donnent des grammes. L'Unit est celle de la ligne, quoi que dise Settings > Units.
- **Attenuation %** : la part du sucre que la levure consomme. **Min Temp** et **Max Temp** : la plage de température où elle fermente, affichée dans les Units.
- **▸ More** ouvre le reste sous la ligne : **Lab**, **Product ID** (par exemple US-05 de Fermentis), **Type** (Ale, Lager, Wheat, Wine, Champagne), **Flocculation** (Low, Medium, High, Very High), **Starter** (un interrupteur, avec un **Starter Size** facultatif), **Times Cultured**, **Mfg Date** (la date de fabrication sur le sachet) et **Notes**.

Un import remplit ce que le fichier contient. Une levure BeerSmith .bsmx est un nombre de Packs. Une levure BeerXML est en grammes (un poids) ou en millilitres (un volume), sauf si le fichier montre « pkg », ce qui donne des Packs.

## L'onglet Adjuncts {#the-adjuncts-tab}

Whirlfloc, nutriment pour levure, gypse, épices : ce que BeerSmith et BeerXML appellent Misc. **Adjunct +** est une liste : cliquez sur **Whirlfloc**, **Irish Moss**, **Yeast Nutrient**, **Gypsum**, **Calcium Chloride**, **Epsom Salt**, **Lactic Acid**, **Campden Tablet**, **Gelatin**, **Coriander Seed**, **Orange Peel** ou **Priming Sugar** pour ajouter sa ligne avec son Type, son Use, sa Measurement et son Time déjà remplis ; tapez la quantité. **Other** ajoute une ligne vide pour tout le reste. **Delete** en retire une, sans limite.

- **Adjunct N** (le nom), **Amount** et **Measurement** (mg, g, oz, lb, kg, ml, tsp, tbsp, cup, pt, qt, l, gal ou items).
- **Type** : Spice, Fining, Water Agent, Herb, Flavor ou Other. **Use** : Boil, Mash, Primary, Secondary ou Bottling.
- **Time** et **Time Unit** (min, hr, day, week). Pour un adjuvant Boil, la case dit **Boil Min** : les minutes restantes d'ébullition quand il est ajouté. Un adjuvant Boil reçoit un avertissement et une alerte d'ajout comme un houblon (l'onglet Drops).

Les listes sont à choix seulement, avec les listes BeerXML. Les grains en flocons et les autres adjuvants qui apportent du sucre sont sur l'onglet Fermentable, ils comptent donc dans l'Expected Gravity. Skynet_Fields : `skn_rcp_Adjunct_Count`, `skn_rcp_Adjunct_N_Name`, `_Amount`, `_Measurement`, `_Type`, `_Use`, `_Time`, `_Time_Unit`.

## L'onglet MASH {#the-mash-tab}

Choisissez le **Mash Profile** : un Template Skynet, un des vôtres (☰ Menu > Mash Profile), ou **l'empâtage propre de la recette** (l'empâtage du fichier de recette, ou un que vous tapez ici).

- Un profil choisi s'affiche en lecture seule : chaque **Step** (palier) avec sa **Temp** et son **Time**, puis le rinçage (type, température, repos du batch) et le mash out. **⧉ Copy into this Recipe** en fait l'empâtage propre de la recette pour que vous puissiez le changer ici.
- L'empâtage propre de la recette : **Mash Step +** ajoute un palier, **Delete** en retire un, et les cases de rinçage sont les mêmes que sur le Tab Recipe.
- Calculate sur le Tab Recipe utilise le premier palier pour le 1st Mash et l'eau d'empâtage.

Skynet a deux Templates : **Skynet Single Step, Batch Sparge** (152 °F pendant 60 minutes, mash out à 168 °F, rinçage par batch avec un repos de 10 minutes) et **Skynet 3 Mash Steps, Fly Sparge** (122 °F pendant 15, 146 °F pendant 30, 158 °F pendant 20 minutes, mash out à 168 °F, rinçage continu avec de l'eau à 168 °F).

Skynet_Fields : `skn_rcp_Mash_Profile`, `skn_rcp_Mash_Step_N_Name`, `skn_rcp_Mash_Step_N_Temp`, `skn_rcp_Mash_Step_N_Time`.

## L'onglet Waters {#the-waters-tab}

Choisissez le **Water Profile** (profil d'eau). Il commence avec **Tap Water** (votre propre eau, ☰ Menu > Default settings > Tap Water). Ses minéraux s'affichent après la coupe d'eau distillée ou osmosée (calcium, magnésium, sodium, sulfate, chlorure, bicarbonate, en ppm), avec le **% Distilled / RO**, le rapport **SO4 : Cl** (au-dessus de 2 sec et houblonné, en dessous de 1 rond et malté) et le **pH**. Ils sont en lecture seule ici ; changez le profil dans ☰ Menu > Water Profile. En dessous se trouvent les eaux que listait le fichier de recette.

Skynet_Fields : `skn_rcp_Water_Profile`, `skn_rcp_Water_Ca`, `skn_rcp_Water_Mg`, `skn_rcp_Water_Na`, `skn_rcp_Water_SO4`, `skn_rcp_Water_Cl`, `skn_rcp_Water_HCO3`, `skn_rcp_Water_Distilled_Pct`, `skn_rcp_Water_SO4_Cl`, `skn_rcp_Water_PH`.

## Importer un fichier BeerSmith {#importing-a-beersmith-file}

Deux sortes de fichiers arrivent, et les deux apportent chaque grain, houblon, levure, élément divers, eau et palier d'empâtage :

- **.bsmx** : le fichier dans lequel BeerSmith 3 et BeerSmith 4 enregistrent les recettes. C'est le meilleur à utiliser. Si le fichier contient beaucoup de recettes (tout un dossier), Skynet demande laquelle.
- **BeerXML .xml** : dans BeerSmith, utilisez **File > Export > BeerXML**. La plupart des autres logiciels de recettes peuvent aussi l'exporter.

Note : dans un fichier .bsmx, BeerSmith garde ses propres unités américaines : les poids en **onces**, les volumes en **onces liquides**, les températures en **°F**. Un élément Misc garde l'unité que vous lui avez donnée dans BeerSmith (tsp, g, oz ...). Skynet les convertit toutes dans ses propres unités en lisant le fichier. (Les fichiers BeerXML utilisent les kilogrammes et les litres.)

**Le rendement du fichier.** Un fichier BeerSmith ou BeerXML dit à quel rendement de brasserie son auteur a brassé. Ce nombre peut ne rien vouloir dire (beaucoup de brasseurs ne le règlent jamais), donc après l'import Skynet demande :

- **Ignore it** (l'ignorer, choisi au départ) : le rendement du Tab reste tel quel.
- **Put on** le Tab Brew on : le nombre du fichier va dans le propre rendement de ce Tab. Skynet montre d'abord le changement (« 72 % → 75 % »), et **↩ Undo** remet l'ancien nombre pendant quelques secondes après. Cela change chaque recette brassée sur ce Tab.

Vous pouvez aussi importer depuis la page **Import**, depuis Node-RED (envoyez le fichier par POST à `/api/import/recipe?file=MyBeer.bsmx`), ou depuis un Process (plus bas).

## Mash Profile : Skynet ou le vôtre {#mash-profile-skynet-or-your-own}

La liste Mash Profile (onglet MASH) liste vos propres profils d'empâtage et ceux de **Skynet** : Single Infusion (corps léger, moyen et plein, et sans mash out), Step Mash with a Protein Rest, Step Mash Beta and Alpha, Hochkurz et BIAB. Ceux de Skynet ne peuvent pas être changés ; dans ☰ Menu > Mash Profile, choisissez **Add new ...** et partez d'une copie de l'un d'eux pour faire le vôtre.

## Water Profile

Appuyez sur **☰ Menu** et choisissez **Water Profile**. Tapez votre analyse d'eau (calcium, magnésium, sodium, sulfate, chlorure, bicarbonate en ppm, et pH), puis la part de l'eau qui est **distillée ou osmosée** (50% = moitié-moitié). Skynet montre l'eau avec laquelle vous brassez et son rapport sulfate/chlorure.

**Tap Water** est toujours dans la liste. C'est l'eau avec laquelle commence une recette. Remplissez ses nombres dans ☰ Menu > Default settings > **Tap Water** (aide : Default settings). Elle ne peut pas être supprimée.

Les profils d'eau Skynet sont là aussi (Distilled or RO, Balanced, Pale Ale Hoppy, Malty, Pilsen, Burton, Dublin, Munich, London). Comme les profils d'empâtage Skynet, ils ne peuvent pas être changés, mais peuvent être copiés.

## Programme et alertes de houblonnage {#hop-schedule-and-alerts}

Skynet met les houblons dans l'ordre du jour de brassage : **Top of Mash, 1st Wort, Start of Boil, puis les houblons d'ébullition (Bitter, Flavor, Aroma), Whirlpool, Dry Hop**. Les houblons ajoutés en même temps forment un **Hop Group**.

Chaque groupe de houblons d'ébullition (et chaque élément Misc Boil) reçoit :

- un **avertissement** avant d'être ajouté (10 minutes sauf changement dans ☰ Menu > Default settings), et
- une alerte d'**ajout** (drop) quand il est ajouté.

Quand deux alertes tombent au même moment, par exemple un ajout et l'avertissement du groupe suivant, Skynet fait **une seule alerte qui contient les deux**. L'onglet Drops les marque avec ⚠ et les liste sous les alertes.

Le jour du brassage, chaque alerte s'affiche comme une barre en haut de chaque écran (verte pour un avertissement, rouge pour un ajout) et reste jusqu'à ce qu'on la ferme. Avec le son activé, elle joue le son d'alerte (s'il y en a un de réglé dans ☰ Menu > Default settings) puis dit l'alerte à voix haute.

Démarrez les alertes depuis un Process (plus bas), ou avec **▶ Start hop alerts** sur l'onglet Drops. Elles peuvent tourner sur la propre horloge de Skynet à partir de ce moment, ou suivre une **minuterie** à rebours comme la minuterie d'ébullition, donc une minuterie en pause ou les sauts de temps du simulateur sont suivis aussi.

### Avant et après l'ébullition {#before-and-after-the-boil}

Certains houblons sont ajoutés quand le brassage arrive à un moment donné, pas à une minute d'ébullition. Le Process envoie leurs alertes à ce moment-là (`hop_alert`, plus bas), et l'onglet Drops les liste sous **Alerts the Process sends** :

| Quand | Alerte |
| --- | --- |
| L'eau d'empâtage (Strike Water) atteint la température Strike | avertissement **Pre Boil** : préparez les houblons Mash et 1st Wort |
| Juste après le démarrage du Mash Timer | ajout **Mash** : les houblons Top of Mash |
| Juste avant le début du First Run | ajout **1st Wort** : les houblons 1st Wort vont dans la cuve d'ébullition |
| 10 minutes avant la fin de l'ébullition | avertissement **Post Boil** : chaque houblon Whirlpool, Hop Stand, Secondary et Dry Hop (une alerte minutée, avec les autres) |
| Le moût atteint la température d'un Hop Stand | ajout **Hop Stand** : les houblons de ce stand. L'eau de refroidissement est coupée pendant son temps, sur la minuterie Whirlpool / Chilling |
| Chaque fermenteur est rempli | houblons **Fermenter** : les houblons Secondary et Dry Hop, pour mettre un rappel sur votre téléphone |

Les alertes Pre Boil, Mash et 1st Wort sont pour les recettes **All Grain** seulement. Un houblon Whirlpool sans température ni temps de Hop Stand (un fichier BeerXML n'en a pas) est toujours ajouté au flame out.

## Voix et fichiers audio {#voice-and-audio-files}

Chaque alerte peut avoir son propre fichier de voix dans `media/Audio/Hops`. L'onglet Drops montre son nom. Quand le fichier est là, il est joué ; sinon, la voix du navigateur lit l'alerte (chaque navigateur courant en a une, sur ordinateur et téléphone, sans besoin de site web).

Pour faire un fichier de voix :

1. Appuyez sur **1 Copy words** (copier les mots).
2. Appuyez sur **2 Open voice site** (un site web gratuit de synthèse vocale s'ouvre), collez les mots, choisissez une voix et téléchargez le MP3.
3. Appuyez sur **3 Put the file here** et choisissez le MP3. Skynet l'enregistre sous le bon nom.

Skynet ne va pas chercher la voix tout seul sur le site web : les sites de voix gratuits ne laissent pas entrer les programmes, cela se fait donc à la main.

## Valeurs par défaut de la recette {#recipe-defaults}

Dans **☰ Menu > Default** :

- **Water Profile** et **Water to grain ratio** : ce avec quoi commence une nouvelle recette. Chacun peut être changé dans la recette. Le Boil time vient du Boil Profile, la Grain temperature est 72 °F pour la planification, et le **Strike offset** appartient à l'équipement du Tab **Brew on** ([Profils d'équipement](28-schemas-and-equipment-profiles)).
- **How amounts show** (comment s'affichent les quantités) : grains (lb, kg, oz, g), houblons (oz, g), volumes (gal, L, qt), températures (°F, °C), eau/grain (qt/lb, L/kg) et éléments divers (comme la recette les donne, métrique, ou US).

Dans **☰ Menu > Default settings** :

- **Hop alerts** : les minutes d'avertissement avant chaque ajout, à quel point deux alertes doivent être proches pour n'en faire qu'une, un son avant chaque alerte, les dire à voix haute, et quelle voix du navigateur.

## Dans un Process {#in-a-process}

```
import_recipe "Recipes/Zombie Dust.bsmx"
import_recipe "Recipes/All My Recipes.bsmx", "Zombie Dust"
start_hop_alerts
start_hop_alerts "Boil_Timer"
start_hop_alerts "Boil_Timer", 1
stop_hop_alerts
hop_alert "Pre Boil"
hop_alert "Hop Stand High"
hop_alert "Fermenter"
```

- `import_recipe` lit un fichier .bsmx ou .xml sur le Brain (un chemin dans le dossier du Brain ou dans un dossier media) et en fait la recette. Un second texte choisit une recette dans un fichier qui en a beaucoup.
- `start_hop_alerts` démarre les alertes de houblonnage sur l'horloge de Skynet à partir de maintenant ; avec un nom de minuterie, il suit plutôt cette minuterie. Un nombre après la minuterie dit combien de secondes de minuterie font une minute d'ébullition : 60 (temps réel) au départ ; 1 quand un interrupteur Testing fait passer chaque minute en une seconde.
- `stop_hop_alerts` les arrête.
- `hop_alert` envoie une des alertes d'avant ou d'après l'ébullition (voir **Avant et après l'ébullition**) : `"Pre Boil"`, `"Mash"`, `"1st Wort"`, `"Hop Stand High"`, `"Hop Stand Middle"`, `"Hop Stand Low"` ou `"Fermenter"`. Sans recette, ou sans ces houblons, rien n'est envoyé et le Process continue.
