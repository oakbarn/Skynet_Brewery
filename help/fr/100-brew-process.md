# Processus de brassage {#brew-process}

Le **Standard Skynet Brew Process** (processus de brassage Skynet standard) guide un brasseur pendant toute une journée de brassage, étape par étape, sans écrire de code. Appuyez sur **☰ Menu** et choisissez **Brew Process**.

Une journée de brassage est une liste de **grandes étapes** toutes faites, faites dans cet ordre. La liste peut s'allonger ou raccourcir dans les prochaines versions de Skynet.

| # | Grande étape | Ce qu'elle fait |
|---|---|---|
| 1 | **PreBrew** | Charger ou vérifier la recette, toutes les pompes à l'arrêt et chaque vanne fermée, faire le tour de la brasserie, verrouiller l'Equipment Profile. La même dans chaque Schema. |
| 2 | **Heat Strike** | Remplir le Hot Liquor Tank (la bouilloire sur une 2 cuves, la cuve sur une 1 cuve) et chauffer l'eau d'empâtage à la température d'empâtage de la recette. |
| 3 | **Strike** | L'eau d'empâtage dans la cuve d'empâtage, puis le grain (empâtage). |
| 4 | **Mash** | Chaque palier d'empâtage de la recette (monter à sa température, puis sa durée), le mash out et le rinçage. |
| 5 | **Boil** | Monter à l'ébullition, puis la minuterie Boil tourne pendant la durée d'ébullition de la recette. Les alertes de houblonnage de la recette tournent sur la minuterie Boil. |
| 6 | **Whirlpool and Chill** | Lancer le whirlpool, refroidir pendant qu'il tourne (avec un hop stand quand la recette a des houblons Whirlpool), puis laisser le trub se déposer. **Sautée au départ.** |
| 7 | **Chill** | Refroidir le moût à la température d'ensemencement (avec un hop stand quand la recette a des houblons Whirlpool, voir plus bas). |
| 8 | **Transfer to Fermentor** | Mettre le moût dans le fermenteur et mesurer la densité. |
| 9 | **Ferment** | Ensemencer la levure et tenir la température de fermentation. |
| 10 | **Clean** | Rincer, nettoyer et rincer la brasserie, puis ouvrir les vannes et les vidanges pour sécher. Toujours la dernière étape. |

**Whirlpool and Chill** et **Chill** font le même travail, donc une journée de brassage utilise l'une des deux. Pour faire un whirlpool, choisissez **Skynet_Whirlpool_and_Chill** pour Whirlpool and Chill et **(skip this step)** pour Chill.

**Le hop stand (les deux étapes de refroidissement) :** quand la recette a des houblons Whirlpool (d'arôme), le refroidissement se fait en deux parties. Il refroidit jusqu'à la **température du hop stand**, coupe l'eau de refroidissement, vous fait ajouter les houblons Whirlpool et tient pendant la **durée du hop stand**, puis rouvre l'eau de refroidissement et refroidit jusqu'à la température d'ensemencement. La température et la durée viennent du premier houblon Whirlpool (sa température et ses minutes de whirlpool, ou les minutes de Whirlpool de la recette) ; une recette qui n'en donne pas utilise ☰ Menu > **Default settings** > Hop stand temperature et Hop stand time (180 °F / 82 °C et 20 minutes au départ).

**Hop Infuser :** un houblon Whirlpool marqué **Hop Rocket** dans l'onglet Hops de la recette va dans le Hop Infuser au lieu de la bouilloire. Le refroidissement ouvre la **vanne du Hop Infuser** (ou vous demande de mettre l'infuseur dans le circuit), fait passer le moût dedans, et le sort du circuit quand le refroidissement est fini.

Toute étape peut être réglée sur **(skip this step)** (sauter cette étape) dans sa liste. Une étape sautée est grisée et ne fait pas de Process.

Chaque grande étape a ses propres **petites étapes** (les lignes `step "..."` que vous voyez sur l'écran Processes pendant qu'elle tourne, comme **House cleaning: pumps off, valves closed**).

## Process Templates

Chaque grande étape utilise un **Process Template** :

- Les **Skynet Process Templates** viennent avec Skynet (`Skynet_PreBrew`, `Skynet_Mash` ...). Personne ne peut les changer ni les supprimer.
- Les **User Process Templates** sont les vôtres. Choisissez **➕ Add new User Process Template…** dans la liste d'une étape : il commence comme une copie du Template choisi maintenant, et vous changez la copie. **✏ Edit** en change un plus tard, **🗑 Delete** le retire (l'étape revient à celui de Skynet).

**👁 View** montre n'importe quel Template.

Certaines étapes ont un Template Skynet pour chaque sorte de brasserie : `Skynet_Heat_Strike_1_Vessel`, `Skynet_Strike_1_Vessel` et `Skynet_Mash_1_Vessel` pour une cuve avec un panier à grain, ceux en `_2_Vessel` pour une bouilloire et une cuve d'empâtage, et les Skynet simples pour 3 cuves. Un nouveau Schema à partir d'un Template Skynet choisit les bons (aide 157).

## Quel Device fait chaque travail {#which-device-does-each-job}

Sous les étapes, le panel ne demande que les travaux qu'utilisent les Templates choisis : le chauffage et la sonde du Hot Liquor Tank, le chauffage, la sonde, la pompe et la minuterie d'empâtage, le chauffage, la sonde et la minuterie d'ébullition, la pompe du whirlpool, la pompe du refroidisseur, l'eau de refroidissement et la sonde du moût, la vanne du Hop Infuser, la pompe vers le fermenteur, la commande et la sonde du fermenteur, et la pompe de nettoyage. Chaque liste ne contient que les Devices et Widgets qui conviennent (une liste de sondes ne montre que des sondes de température, une liste de pompes que des pompes).

**🎯 Click it on the Tab** (cliquez dessus sur le Tab) à côté d'un travail va au Tab, éclaire les éléments qui conviennent à ce travail et grise le reste : cliquez sur celui qui fait le travail, et vous revenez ici avec lui choisi (appuyez sur **💾 Save** pour le garder). **Cancel** ou **Échap** ne change rien. La liste est la solution de secours.

Laissez un travail sur **(none: Skynet asks you to do it by hand)** (aucun : Skynet vous demande de le faire à la main) et la journée de brassage affiche à la place une fenêtre pour lui, par exemple « Turn the Hot Liquor Tank heat on and set it to 163.2°F. Press Done when it is on. » (Allumez le chauffage du Hot Liquor Tank et réglez-le à 163.2 °F. Appuyez sur Done quand il est allumé.)

## Construire et démarrer {#build-and-start}

1. Choisissez les Templates et les Devices, puis appuyez sur **💾 Save**.
2. Appuyez sur **🔨 Build the Brew Day** (Admins). Il fait un Flow Process pour chaque étape utilisée, numéroté dans l'ordre de ces étapes : **Brew_1_PreBrew**, **Brew_2_Heat_Strike** ... **Brew_9_Clean**. Chacun démarre le suivant quand il se termine. Construire à nouveau les remplace, et les anciens sont gardés en `.bak`. Un Process Brew_ que la nouvelle liste n'a plus (une étape que vous avez sautée, ou une dont le numéro a bougé) va à la corbeille. Reconstruisez après avoir changé un choix ou un Template.
3. Appuyez sur **▶ Start Brew Day** (operators et Admins), ou démarrez **Brew_1_PreBrew** sur l'écran Processes.

Une nouvelle recette n'a pas besoin d'une nouvelle construction : les Processes lisent la recette quand ils tournent.

## Valeurs de la recette {#recipe-values}

Les Templates lisent la recette par des noms qui commencent par **`rcp_`**. Ils sont en lecture seule dans un Process (changez-les dans la recette), et ils sont dans les unités du panel (☰ Menu > Default > Units).

| Nom | Ce que c'est |
|---|---|
| `rcp_Loaded` | true quand une recette est chargée |
| `rcp_Name`, `rcp_Yeast_Name` | la recette et sa levure |
| `rcp_Batch_Volume`, `rcp_Boil_Volume` | dans le fermenteur, et au début de l'ébullition |
| `rcp_Total_Grain_Weight` | tout le grain ensemble |
| `rcp_Strike_Temp`, `rcp_Strike_Volume` | l'eau d'empâtage |
| `rcp_Mash_Steps` | combien de paliers d'empâtage |
| `rcp_Mash_Step_1_Name`, `_Temp`, `_Time` | chaque palier d'empâtage (1, 2, 3 ... ; Time est en hh:mm:ss) |
| `rcp_Mash_Out_Temp`, `rcp_Sparge_Temp` | mash out (0 = aucun) et eau de rinçage |
| `rcp_Boil_Time`, `rcp_Boil_Start_Temp` | l'ébullition (hh:mm:ss), et la température où elle compte comme bouillante |
| `rcp_Whirlpool_Minutes` | combien de temps tourne le whirlpool (0 = aucun) |
| `rcp_Hop_Stand`, `rcp_Hop_Stand_Temp`, `rcp_Hop_Stand_Minutes` | true quand il y a des houblons Whirlpool ; où le refroidissement s'arrête pour eux et combien de temps il tient |
| `rcp_Hop_Infuser` | true quand un houblon Whirlpool passe par le Hop Infuser (Hop Rocket) |
| `rcp_Ferment_Temp` | température de fermentation et d'ensemencement |
| `rcp_Temp_Units`, `rcp_Volume_Units`, `rcp_Weight_Units` | °F ou °C, gal ou L, lb ou kg |

Tant qu'aucune recette n'est chargée, les valeurs viennent du Tab **☰ Menu > Default** : son Mash Profile et son Boil Profile. La température d'empâtage est calculée à partir du premier palier (rapport eau/grain 1.5 qt/lb ou 3.1 L/kg, grain à 68 °F ou 20 °C). PreBrew demande toujours d'abord une recette.

L'écran Brew Process montre chaque valeur telle qu'elle est maintenant.

## Nouvelles commandes de Process {#new-process-commands}

| Commande | Ce qu'elle fait |
|---|---|
| `ask "Add the grain, then press Done"` | une fenêtre sur chaque écran avec **✔ Done** ; le Process attend qu'un operator ou un Admin appuie dessus. Les codes de texte marchent (`\b`, `\n` ...). |
| `close_all_valves` | ferme chaque vanne de la liste **Close all valves** |
| `open_all_valves` | ouvre chaque vanne de la liste **Open all valves** (l'état dans lequel on laisse tout après le nettoyage) |
| `all_pumps_off` | arrête chaque pompe |
| `open_valve DigiBoil_Spigot` | ouvre une seule vanne. Une vanne manuelle (une Manual valve, un Widget Manual Valve, un robinet de DigiBoil ou de Brewzilla) affiche une fenêtre et attend que ce soit fait à la main ; une vanne motorisée est commandée tout de suite. Voir [DigiBoil et Brewzilla, réglées à la main](158-digiboil-and-brewzilla) |
| `close_valve DigiBoil_Spigot` | ferme une seule vanne, de la même façon |

## Close all et Open all valves {#close-all-and-open-all-valves}

Chaque vanne qu'un Process commande (Electro_Mechanical, comme une Motorized Ball Valve) a deux interrupteurs dans ses Properties :

- **On the Close all valves list** (sur la liste Fermer toutes les vannes ; activé au départ)
- **On the Open all valves list** (sur la liste Ouvrir toutes les vannes ; activé au départ)

Désactivez-en un pour laisser cette vanne de côté. Une **vanne d'eau du robinet** est toujours sur la liste Close all et jamais sur la liste Open all, donc l'eau du robinet ne peut pas rester ouverte : ses Properties montrent On Close List activé et On Open List désactivé, tous deux grisés. La dernière étape de **Clean** ouvre chaque vanne de la liste Open (jamais une vanne d'eau du robinet) pour que la brasserie sèche. Une vanne **Manual** n'est sur aucune liste, car un Process la demande par son nom.

## Écrire votre propre Template {#writing-your-own-template}

Un Template est un Process avec quelques lignes de construction qui servent quand la journée de brassage est construite et n'arrivent jamais dans le Process :

| Ligne de construction | Veut dire |
|---|---|
| `{{HLT_Heater}}` | le Device choisi pour ce travail (voir les noms des travaux plus bas) |
| `@if HLT_Heater` ... `@else` ... `@end` | des lignes utilisées seulement quand un Device est choisi pour ce travail (ou, après `@else`, quand aucun ne l'est) |
| `@each_mash_step` ... `@end` | les lignes une fois pour chaque palier d'empâtage possible ; `{{n}}` vaut 1, 2, 3 ... |

Noms des travaux : `HLT_Heater`, `HLT_Probe`, `Mash_Heater`, `Mash_Probe`, `Mash_Pump`, `Mash_Timer`, `Boil_Heater`, `Boil_Probe`, `Boil_Timer`, `Whirlpool_Pump`, `Chill_Pump`, `Chill_Water`, `Hop_Infuser_Valve`, `Wort_Probe`, `Transfer_Pump`, `Ferment_Heater`, `Ferment_Probe`, `Clean_Pump`.

Une ligne `//About: ...` près du haut est la description du Template sur l'écran Brew Process.

Voir [Le langage des Processes et les étapes](22-process-language), [Vannes d'eau du robinet](31-tap-water-valves) et [Mash Profiles et Boil Profiles](35-mash-and-boil-profiles).

## Anciens processus de brassage {#older-brew-processes}

Avant le 2026-11-07, la liste avait **Add Grain** et **Cool**. Add Grain est maintenant **Strike**. Cool est maintenant **Chill** plus **Transfer to Fermentor**. Un Brew Process enregistré change tout seul : un User Process Template fait pour Add Grain ou Cool passe à Strike ou Chill, et quand un User Template Cool était choisi, Transfer to Fermentor est sauté (ce Template déplaçait déjà le moût). Appuyez une fois sur **🔨 Build the Brew Day** pour faire les nouveaux Processes.
