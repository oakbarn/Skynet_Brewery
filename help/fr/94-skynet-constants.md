# Constantes Skynet {#skynet-constants}

Les constantes Skynet (Skynet Constants) sont des nombres fixes intégrés à Skynet pour les conversions que les brasseurs utilisent le plus : poids, fractions et eau, volume (américain et impérial), pression, température, rapports de brassage, longueur, puissance et temps. Elles font partie de Skynet, donc personne ne peut les changer (Règle Skynet 3.11), et elles sont les mêmes sur chaque Brain.

Chacune a un **nom** et un **Label** :

- Le nom commence par **`skn_const_`**, comme chaque nom Skynet (`skn_`), et finit par un code court qui se lit « autant de A dans un B ». `_p_` veut dire **par** (per) : `skn_const_L_p_Gal` est le nombre de litres dans un gallon (3.785).
- Le Label le dit en mots simples : **Liters per Gallon** (litres par gallon).

Les majuscules et les minuscules ne comptent pas : `SKN_CONST_L_P_GAL` est la même constante.

Un gallon, un quart, une pinte ou une once liquide est toujours **américain**. Une unité **impériale** (britannique) a **Im** dans son nom : `skn_const_L_p_ImGal` vaut 4.546. Un gallon s'écrit `Gal`, jamais `G`, car `g` est un gramme et les majuscules ne comptent pas.

## La liste dans l'éditeur de Process {#the-list-in-the-process-editor}

Dans l'éditeur de Process, **📐 Constants** montre chaque constante Skynet avec son Label, sa valeur et son nom. Tapez dans sa boîte de recherche pour réduire la liste (`gallon`, `ounce`, `psi`, `water`). Cliquez une ligne pour mettre cette constante au curseur.

## En utiliser une dans un Process {#using-one-in-a-process}

Utilisez une constante Skynet partout où un nombre peut aller. Multipliez la quantité par la constante :

```
gGV_Batch_L = gGV_Batch_Gal * skn_const_L_p_Gal     // 5 gal -> 18.93 L
gGV_Grain_Lb = gGV_Grain_Kg * skn_const_Lb_p_Kg     // 5 kg -> 11.02 lb
gGV_Hops_G = gGV_Hops_Oz * skn_const_g_p_Oz
gGV_Salt_Ppm = gGV_Salt_G_per_Gal * skn_const_Ppm_p_GGal
if Kettle_Pressure * skn_const_kPa_p_PSI > 70
sleep 5 * skn_const_Ms_p_Min                        // sleep counts in milliseconds
```

Skynet garde ses données en métrique (Règle 2.59), donc un Process a rarement besoin d'une constante pour lire une valeur. Elles servent aux nombres que vous tapez ou montrez.

## Température {#temperature}

Une température demande plus qu'une multiplication, car 0 °C n'est pas 0 °F. Utilisez **`toF( )`** et **`toC( )`** :

```
gGV_Temp_F = toF(gGV_Temp_C)                   // °C to °F: x × 1.8 + 32
gGV_Temp_C = toC(gGV_Temp_F)                   // °F to °C: (x − 32) ÷ 1.8
vSMsg = "Strike " + toF(gGV_Strike_C) + " °F"
```

Un **changement** de température (une hausse de 2 degrés, une baisse de 10 degrés) n'a besoin que de la multiplication : `gGV_Rise_F = gGV_Rise_C * skn_const_F_p_C`.

`toF` et `toC` ne marchent qu'avec ( ) après eux, donc un élément qui s'appelle `toF` est toujours lu par son nom.

## Texte prédictif {#predictive-text}

Là où une valeur peut aller, commencez à taper et les constantes Skynet qui correspondent sont listées avec leur valeur et leur Label. Taper une unité trouve chaque constante qui l'utilise : `Gal` liste `skn_const_L_p_Gal`, `skn_const_Gal_p_L` et le reste. Taper `to` propose `toF(` et `toC(`. Voir [Texte prédictif dans l'éditeur de Process](79-predictive-text).

## Ce que vous ne pouvez pas faire {#what-you-can-t-do}

- Une constante Skynet ne peut pas être changée : `skn_const_L_p_Gal = 2` est une erreur quand le Process est vérifié ou enregistré.
- Une constante Skynet n'a pas d'attributs : `skn_const_L_p_Gal.value` est une erreur. Utilisez le nom seul.
- Les noms qui commencent par `skn_const_` sont gardés pour les constantes Skynet. Aucun Device, Widget, gGlobal ni variable `new` ne peut en avoir un.
- Un nom qui commence par `skn_const_` mais n'est pas dans les listes ci-dessous est une erreur, donc une faute de frappe est trouvée quand vous vérifiez le Process.

## Nouvelles constantes {#new-constants}

Quand une nouvelle fonction de Skynet a besoin d'une conversion qui n'est pas ici, elle est ajoutée à cette liste avec la fonction (Règle 1.17).

## Les constantes Skynet {#the-skynet-constants}

Les volumes sont en unités américaines sauf si le nom a Im (impérial). Les valeurs sont montrées ici avec 6 chiffres ; Skynet les utilise en pleine précision.

### Poids {#weight}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_g_p_Kg` | 1000 | kilogrammes en grammes |
| `skn_const_Lb_p_Kg` | 2.20462 | kilogrammes en livres |
| `skn_const_Oz_p_Kg` | 35.274 | kilogrammes en onces |
| `skn_const_Kg_p_g` | 0.001 | grammes en kilogrammes |
| `skn_const_Lb_p_g` | 0.00220462 | grammes en livres |
| `skn_const_Oz_p_g` | 0.035274 | grammes en onces |
| `skn_const_Kg_p_Lb` | 0.453592 | livres en kilogrammes |
| `skn_const_g_p_Lb` | 453.592 | livres en grammes |
| `skn_const_Oz_p_Lb` | 16 | livres en onces |
| `skn_const_Kg_p_Oz` | 0.0283495 | onces en kilogrammes |
| `skn_const_g_p_Oz` | 28.3495 | onces en grammes |
| `skn_const_Lb_p_Oz` | 0.0625 | onces en livres |
| `skn_const_mg_p_g` | 1000 | grammes en milligrammes |
| `skn_const_g_p_mg` | 0.001 | milligrammes en grammes |
| `skn_const_mg_p_Oz` | 28349.5 | onces en milligrammes |
| `skn_const_mg_p_Kg` | 1000000 | kilogrammes en milligrammes |

### Fractions et eau (poids dans l'eau) {#fractions-and-water-weight-in-water}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_Frac_p_Pct` | 0.01 | pourcentage en fraction (12.5 % donne 0.125) |
| `skn_const_Pct_p_Frac` | 100 | fraction en pourcentage (0.125 donne 12.5 %) |
| `skn_const_MgL_p_Ppm` | 1 | parties par million en milligrammes par litre (la même chose dans l'eau) |
| `skn_const_Ppm_p_MgL` | 1 | milligrammes par litre en parties par million (la même chose dans l'eau) |
| `skn_const_Ppm_p_GL` | 1000 | grammes par litre en parties par million |
| `skn_const_GL_p_Ppm` | 0.001 | parties par million en grammes par litre |
| `skn_const_Ppm_p_GGal` | 264.172 | sels de l'eau, grammes par gallon américain en parties par million |
| `skn_const_GGal_p_Ppm` | 0.00378541 | sels de l'eau, parties par million en grammes par gallon américain |

### Volume (gallons, quarts et onces liquides américains) {#volume-us-gallons-quarts-and-fluid-ounces}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_L_p_Gal` | 3.78541 | gallons en litres |
| `skn_const_Qt_p_Gal` | 4 | gallons en quarts |
| `skn_const_FlOz_p_Gal` | 128 | gallons en onces liquides |
| `skn_const_L_p_Qt` | 0.946353 | quarts en litres |
| `skn_const_Gal_p_Qt` | 0.25 | quarts en gallons |
| `skn_const_mL_p_FlOz` | 29.5735 | onces liquides en millilitres |
| `skn_const_Gal_p_L` | 0.264172 | litres en gallons |
| `skn_const_Qt_p_L` | 1.05669 | litres en quarts |
| `skn_const_mL_p_L` | 1000 | litres en millilitres |
| `skn_const_L_p_mL` | 0.001 | millilitres en litres |
| `skn_const_FlOz_p_mL` | 0.033814 | millilitres en onces liquides |
| `skn_const_Gal_p_BBL` | 31 | barils de bière US en gallons |
| `skn_const_L_p_BBL` | 117.348 | barils de bière US en litres |
| `skn_const_BBL_p_L` | 0.00852168 | litres en barils de bière US |
| `skn_const_L_p_HL` | 100 | hectolitres en litres |
| `skn_const_HL_p_L` | 0.01 | litres en hectolitres |
| `skn_const_mL_p_Gal` | 3785.41 | gallons en millilitres |
| `skn_const_Pt_p_Gal` | 8 | gallons en pintes |
| `skn_const_Pt_p_Qt` | 2 | quarts en pintes |
| `skn_const_FlOz_p_Qt` | 32 | quarts en onces liquides |
| `skn_const_FlOz_p_Pt` | 16 | pintes en onces liquides |
| `skn_const_mL_p_Pt` | 473.176 | pintes en millilitres |
| `skn_const_Pt_p_mL` | 0.00211338 | millilitres en pintes |
| `skn_const_L_p_FlOz` | 0.0295735 | onces liquides en litres |
| `skn_const_FlOz_p_L` | 33.814 | litres en onces liquides |
| `skn_const_FlOz_p_Cup` | 8 | tasses en onces liquides |
| `skn_const_mL_p_Cup` | 236.588 | tasses en millilitres |
| `skn_const_Tbsp_p_FlOz` | 2 | onces liquides en cuillères à soupe |
| `skn_const_Tsp_p_Tbsp` | 3 | cuillères à soupe en cuillères à café |
| `skn_const_mL_p_Tbsp` | 14.7868 | cuillères à soupe en millilitres |
| `skn_const_mL_p_Tsp` | 4.92892 | cuillères à café en millilitres |
| `skn_const_Tbsp_p_mL` | 0.067628 | millilitres en cuillères à soupe |
| `skn_const_Tsp_p_mL` | 0.202884 | millilitres en cuillères à café |

### Volume (impérial, utilisé au Royaume-Uni : Im dans le nom) {#volume-imperial-used-in-the-uk-im-in-the-name}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_L_p_ImGal` | 4.54609 | gallons impériaux en litres |
| `skn_const_ImGal_p_L` | 0.219969 | litres en gallons impériaux |
| `skn_const_Gal_p_ImGal` | 1.20095 | gallons impériaux en gallons américains |
| `skn_const_ImGal_p_Gal` | 0.832674 | gallons américains en gallons impériaux |
| `skn_const_ImPt_p_ImGal` | 8 | gallons impériaux en pintes impériales |
| `skn_const_mL_p_ImPt` | 568.261 | pintes impériales en millilitres |
| `skn_const_ImPt_p_mL` | 0.00175975 | millilitres en pintes impériales |
| `skn_const_ImFlOz_p_ImPt` | 20 | pintes impériales en onces liquides impériales |
| `skn_const_mL_p_ImFlOz` | 28.4131 | onces liquides impériales en millilitres |
| `skn_const_ImFlOz_p_mL` | 0.0351951 | millilitres en onces liquides impériales |
| `skn_const_L_p_ImBBL` | 163.659 | barils de bière britanniques (36 gallons impériaux) en litres |
| `skn_const_ImBBL_p_L` | 0.00611026 | litres en barils de bière britanniques |

### Pression {#pressure}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_kPa_p_PSI` | 6.89476 | PSI en kilopascals |
| `skn_const_Bar_p_PSI` | 0.0689476 | PSI en bar |
| `skn_const_hPa_p_PSI` | 68.9476 | PSI en hectopascals (millibars) |
| `skn_const_inHg_p_PSI` | 2.03602 | PSI en pouces de mercure |
| `skn_const_PSI_p_kPa` | 0.145038 | kilopascals en PSI |
| `skn_const_Bar_p_kPa` | 0.01 | kilopascals en bars |
| `skn_const_hPa_p_kPa` | 10 | kilopascals en hectopascals (millibars) |
| `skn_const_PSI_p_Bar` | 14.5038 | bar en PSI |
| `skn_const_kPa_p_Bar` | 100 | bars en kilopascals |
| `skn_const_inHg_p_hPa` | 0.02953 | hectopascals (millibars) en pouces de mercure |
| `skn_const_PSI_p_hPa` | 0.0145038 | hectopascals (millibars) en PSI |
| `skn_const_kPa_p_hPa` | 0.1 | hectopascals (millibars) en kilopascals |
| `skn_const_Bar_p_hPa` | 0.001 | hectopascals (millibars) en bars |
| `skn_const_hPa_p_Bar` | 1000 | bars en hectopascals (millibars) |
| `skn_const_inHg_p_kPa` | 0.2953 | kilopascals en pouces de mercure |
| `skn_const_mmHg_p_hPa` | 0.750062 | hectopascals (millibars) en millimètres de mercure |
| `skn_const_hPa_p_inHg` | 33.8639 | pouces de mercure en hectopascals (millibars) |
| `skn_const_PSI_p_inHg` | 0.491154 | pouces de mercure en PSI |
| `skn_const_kPa_p_inHg` | 3.38639 | pouces de mercure en kilopascals |
| `skn_const_hPa_p_mmHg` | 1.33322 | millimètres de mercure en hectopascals (millibars) |
| `skn_const_PSI_p_Atm` | 14.6959 | pression standard au niveau de la mer en PSI |
| `skn_const_kPa_p_Atm` | 101.325 | pression standard au niveau de la mer en kilopascals |
| `skn_const_hPa_p_Atm` | 1013.25 | pression standard au niveau de la mer en hectopascals (millibars) |
| `skn_const_inHg_p_Atm` | 29.9213 | pression standard au niveau de la mer en pouces de mercure |

### Température {#temperature}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_F_p_C` | 1.8 | °F dans un °C (aussi un changement de température de °C en °F) |
| `skn_const_C_p_F` | 0.555556 | °C dans un °F (aussi un changement de température de °F en °C) |
| `skn_const_F_Freeze` | 32 | l'eau gèle, °F |
| `skn_const_C_Freeze` | 0 | l'eau gèle, °C |
| `skn_const_F_Boil` | 212 | l'eau bout au niveau de la mer, °F |
| `skn_const_C_Boil` | 100 | l'eau bout au niveau de la mer, °C |

### Rapports de brassage {#brewing-ratios}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_LKg_p_QtLb` | 2.08635 | épaisseur de la maische, quarts par livre en litres par kilogramme |
| `skn_const_QtLb_p_LKg` | 0.479306 | épaisseur de la maische, litres par kilogramme en quarts par livre |
| `skn_const_LKg_p_GalLb` | 8.3454 | absorption du grain, gallons par livre en litres par kilogramme |
| `skn_const_GalLb_p_LKg` | 0.119826 | absorption du grain, litres par kilogramme en gallons par livre |
| `skn_const_GL_p_OzGal` | 7.48915 | dose de houblon ou de sel, onces par gallon en grammes par litre |
| `skn_const_OzGal_p_GL` | 0.133526 | dose de houblon ou de sel, grammes par litre en onces par gallon |
| `skn_const_LPM_p_GPM` | 3.78541 | débit, gallons par minute en litres par minute |
| `skn_const_GPM_p_LPM` | 0.264172 | débit, litres par minute en gallons par minute |

### Longueur {#length}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_Cm_p_In` | 2.54 | pouces en centimètres |
| `skn_const_mm_p_In` | 25.4 | pouces en millimètres |
| `skn_const_In_p_Cm` | 0.393701 | centimètres en pouces |
| `skn_const_In_p_mm` | 0.0393701 | millimètres en pouces |
| `skn_const_M_p_Ft` | 0.3048 | pieds en mètres |
| `skn_const_Ft_p_M` | 3.28084 | mètres en pieds |
| `skn_const_In_p_Ft` | 12 | pieds en pouces |
| `skn_const_Ft_p_In` | 0.0833333 | pouces en pieds |
| `skn_const_Cm_p_M` | 100 | mètres en centimètres |
| `skn_const_mm_p_Cm` | 10 | centimètres en millimètres |

### Puissance {#power}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_BTUh_p_W` | 3.41214 | watts en BTU par heure |
| `skn_const_W_p_BTUh` | 0.293071 | BTU par heure en watts |
| `skn_const_W_p_KW` | 1000 | kilowatts en watts |
| `skn_const_KW_p_W` | 0.001 | watts en kilowatts |
| `skn_const_W_p_HP` | 745.7 | chevaux-vapeur (le moteur d'une pompe) en watts |
| `skn_const_HP_p_W` | 0.00134102 | watts en chevaux-vapeur |

### Temps (les Processes comptent le temps en secondes) {#time-processes-count-time-in-seconds}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skn_const_Sec_p_Min` | 60 | minutes en secondes |
| `skn_const_Sec_p_Hr` | 3600 | heures en secondes |
| `skn_const_Min_p_Hr` | 60 | heures en minutes |
| `skn_const_Hr_p_Day` | 24 | jours en heures |
| `skn_const_Sec_p_Day` | 86400 | jours en secondes |
| `skn_const_Min_p_Sec` | 0.0166667 | secondes en minutes |
| `skn_const_Hr_p_Min` | 0.0166667 | minutes en heures |
| `skn_const_Ms_p_Sec` | 1000 | secondes en millisecondes (sleep compte en millisecondes) |
| `skn_const_Ms_p_Min` | 60000 | minutes en millisecondes (sleep compte en millisecondes) |
