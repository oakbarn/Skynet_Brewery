# Constantes Skynet {#skynet-constants}

Les constantes Skynet (Skynet Constants) sont des nombres fixes intégrés à Skynet pour les conversions que les brasseurs utilisent le plus : poids, fractions et eau, volume (américain et impérial), pression, température, rapports de brassage, longueur, puissance et temps. Elles font partie de Skynet, donc personne ne peut les changer (Règle Skynet 3.11), et elles sont les mêmes sur chaque Brain.

Chacune a deux noms qui veulent dire le même nombre :

- un **nom court**, qui se lit « autant de A dans un B » : `L_p_Gal` est le nombre de litres dans un gallon (3.785). `_p_` veut dire **par** (per).
- un **nom long** qui commence par **`skc_`** et dit de\_To\_vers : `skc_Gal_To_L`. Les noms longs sont venus en premier et marchent toujours.

Les majuscules et les minuscules ne comptent pas : `l_p_gal`, `L_P_GAL` et `L_p_Gal` sont la même constante, donc deux constantes ne diffèrent jamais seulement par les majuscules.

Un gallon, un quart, une pinte ou une once liquide est toujours **américain**. Une unité **impériale** (britannique) a **Im** dans son nom : `L_p_ImGal` vaut 4.546.

## La liste dans l'éditeur de Process {#the-list-in-the-process-editor}

Dans l'éditeur de Process, **📐 Constants** montre chaque constante Skynet avec son nom court, sa valeur et ce qu'elle fait. Tapez dans sa boîte de recherche pour réduire la liste (`gal`, `oz`, `psi`, `water`). Cliquez une ligne pour mettre cette constante au curseur.

## En utiliser une dans un Process {#using-one-in-a-process}

Utilisez une constante Skynet partout où un nombre peut aller. Multipliez la quantité par la constante :

```
gGV_Batch_L = gGV_Batch_Gal * L_p_Gal          // 5 gal -> 18.93 L
gGV_Grain_Lb = gGV_Grain_Kg * Lb_p_Kg          // 5 kg -> 11.02 lb
gGV_Hops_G = gGV_Hops_Oz * g_p_Oz
gGV_Salt_Ppm = gGV_Salt_G_per_Gal * Ppm_p_GGal
if Kettle_Pressure * kPa_p_PSI > 70
sleep 5 * Ms_p_Min                             // sleep counts in milliseconds
gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb     // the long name works too
```

Skynet garde ses données en métrique (Règle 2.59), donc un Process a rarement besoin d'une constante pour lire une valeur. Elles servent aux nombres que vous tapez ou montrez.

## Température {#temperature}

Une température demande plus qu'une multiplication, car 0 °C n'est pas 0 °F. Utilisez **`toF( )`** et **`toC( )`** :

```
gGV_Temp_F = toF(gGV_Temp_C)                   // °C to °F: x × 1.8 + 32
gGV_Temp_C = toC(gGV_Temp_F)                   // °F to °C: (x − 32) ÷ 1.8
vSMsg = "Strike " + toF(gGV_Strike_C) + " °F"
```

Un **changement** de température (une hausse de 2 degrés, une baisse de 10 degrés) n'a besoin que de la multiplication : `gGV_Rise_F = gGV_Rise_C * F_p_C`.

L'ancienne façon marche toujours : `gGV_Temp_F = gGV_Temp_C * skc_F_Per_C + skc_F_Freeze`.

## Texte prédictif {#predictive-text}

Là où une valeur peut aller, commencez à taper et les constantes Skynet qui correspondent sont listées avec leur valeur et ce qu'elles font, noms courts et noms longs. Taper une unité trouve chaque constante qui l'utilise : `Gal` liste `L_p_Gal`, `Gal_p_L`, `skc_Gal_To_L` et le reste. Taper `to` propose `toF(` et `toC(`. Voir [Texte prédictif dans l'éditeur de Process](79-predictive-text).

## Mots réservés {#reserved-words}

Les noms courts, `toF` et `toC` sont des **mots réservés**, avec n'importe quelles majuscules. Aucun Device, Widget, gGlobal ni variable `new` ne peut porter l'un d'eux : la boîte du nom le dit quand vous le tapez, et donne un nom à utiliser à la place (`L_p_Gal_1`).

Les noms qui commencent par `skc_` sont aussi gardés pour les constantes Skynet.

Un élément qui avait déjà un tel nom (fait avant que cette constante soit ajoutée à Skynet) **garde son nom** (Règle 3.2). Skynet montre un avis quand il démarre, et la vérification du Process donne un avertissement sur chaque ligne qui lit ce nom seul, car le nom seul lit la constante. Utilisez `L_p_Gal.value` pour votre élément.

## Ce que vous ne pouvez pas faire {#what-you-can-t-do}

- Une constante Skynet ne peut pas être changée : `L_p_Gal = 2` ou `skc_Kg_To_Lb = 2` est une erreur quand le Process est vérifié ou enregistré.
- Un nom long `skc_` n'a pas d'attributs : `skc_Kg_To_Lb.value` est une erreur. Utilisez le nom seul.
- `toF` et `toC` ont besoin d'une valeur entre ( ) : `toF(x)`.
- Un nom qui commence par `skc_` mais n'est pas dans les listes ci-dessous est une erreur, donc une faute de frappe est trouvée quand vous vérifiez le Process.

## Nouvelles constantes {#new-constants}

Quand une nouvelle fonction de Skynet a besoin d'une conversion qui n'est pas ici, elle est ajoutée à cette liste avec la fonction (Règle 1.17).

## Les constantes Skynet {#the-skynet-constants}

Les volumes sont en unités américaines sauf si le nom a Im (impérial). Les valeurs sont montrées ici avec 6 chiffres ; Skynet les utilise en pleine précision. Une constante sans nom court (-) est un point fixe, comme le point où l'eau gèle ; utilisez `toF( )` et `toC( )` pour les températures.

### Poids {#weight}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `g_p_Kg` | `skc_Kg_To_G` | 1000 | kilogrammes en grammes |
| `Lb_p_Kg` | `skc_Kg_To_Lb` | 2.20462 | kilogrammes en livres |
| `Oz_p_Kg` | `skc_Kg_To_Oz` | 35.274 | kilogrammes en onces |
| `Kg_p_g` | `skc_G_To_Kg` | 0.001 | grammes en kilogrammes |
| `Lb_p_g` | `skc_G_To_Lb` | 0.00220462 | grammes en livres |
| `Oz_p_g` | `skc_G_To_Oz` | 0.035274 | grammes en onces |
| `Kg_p_Lb` | `skc_Lb_To_Kg` | 0.453592 | livres en kilogrammes |
| `g_p_Lb` | `skc_Lb_To_G` | 453.592 | livres en grammes |
| `Oz_p_Lb` | `skc_Lb_To_Oz` | 16 | livres en onces |
| `Kg_p_Oz` | `skc_Oz_To_Kg` | 0.0283495 | onces en kilogrammes |
| `g_p_Oz` | `skc_Oz_To_G` | 28.3495 | onces en grammes |
| `Lb_p_Oz` | `skc_Oz_To_Lb` | 0.0625 | onces en livres |
| `mg_p_g` | `skc_G_To_Mg` | 1000 | grammes en milligrammes |
| `g_p_mg` | `skc_Mg_To_G` | 0.001 | milligrammes en grammes |
| `mg_p_Oz` | `skc_Oz_To_Mg` | 28349.5 | onces en milligrammes |
| `mg_p_Kg` | `skc_Kg_To_Mg` | 1000000 | kilogrammes en milligrammes |

### Fractions et eau (poids dans l'eau) {#fractions-and-water-weight-in-water}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `Frac_p_Pct` | `skc_Pct_To_Frac` | 0.01 | pourcentage en fraction (12.5 % donne 0.125) |
| `Pct_p_Frac` | `skc_Frac_To_Pct` | 100 | fraction en pourcentage (0.125 donne 12.5 %) |
| `MgL_p_Ppm` | `skc_Ppm_To_MgL` | 1 | parties par million en milligrammes par litre (la même chose dans l'eau) |
| `Ppm_p_MgL` | `skc_MgL_To_Ppm` | 1 | milligrammes par litre en parties par million (la même chose dans l'eau) |
| `Ppm_p_GL` | `skc_GL_To_Ppm` | 1000 | grammes par litre en parties par million |
| `GL_p_Ppm` | `skc_Ppm_To_GL` | 0.001 | parties par million en grammes par litre |
| `Ppm_p_GGal` | `skc_GGal_To_Ppm` | 264.172 | sels de l'eau, grammes par gallon américain en parties par million |
| `GGal_p_Ppm` | `skc_Ppm_To_GGal` | 0.00378541 | sels de l'eau, parties par million en grammes par gallon américain |

### Volume (gallons, quarts et onces liquides américains) {#volume-us-gallons-quarts-and-fluid-ounces}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `L_p_Gal` | `skc_Gal_To_L` | 3.78541 | gallons en litres |
| `Qt_p_Gal` | `skc_Gal_To_Qt` | 4 | gallons en quarts |
| `FlOz_p_Gal` | `skc_Gal_To_FlOz` | 128 | gallons en onces liquides |
| `L_p_Qt` | `skc_Qt_To_L` | 0.946353 | quarts en litres |
| `Gal_p_Qt` | `skc_Qt_To_Gal` | 0.25 | quarts en gallons |
| `mL_p_FlOz` | `skc_FlOz_To_ML` | 29.5735 | onces liquides en millilitres |
| `Gal_p_L` | `skc_L_To_Gal` | 0.264172 | litres en gallons |
| `Qt_p_L` | `skc_L_To_Qt` | 1.05669 | litres en quarts |
| `mL_p_L` | `skc_L_To_ML` | 1000 | litres en millilitres |
| `L_p_mL` | `skc_ML_To_L` | 0.001 | millilitres en litres |
| `FlOz_p_mL` | `skc_ML_To_FlOz` | 0.033814 | millilitres en onces liquides |
| `Gal_p_BBL` | `skc_BBL_To_Gal` | 31 | barils de bière US en gallons |
| `L_p_BBL` | `skc_BBL_To_L` | 117.348 | barils de bière US en litres |
| `BBL_p_L` | `skc_L_To_BBL` | 0.00852168 | litres en barils de bière US |
| `L_p_HL` | `skc_HL_To_L` | 100 | hectolitres en litres |
| `HL_p_L` | `skc_L_To_HL` | 0.01 | litres en hectolitres |
| `mL_p_Gal` | `skc_Gal_To_ML` | 3785.41 | gallons en millilitres |
| `Pt_p_Gal` | `skc_Gal_To_Pt` | 8 | gallons en pintes |
| `Pt_p_Qt` | `skc_Qt_To_Pt` | 2 | quarts en pintes |
| `FlOz_p_Qt` | `skc_Qt_To_FlOz` | 32 | quarts en onces liquides |
| `FlOz_p_Pt` | `skc_Pt_To_FlOz` | 16 | pintes en onces liquides |
| `mL_p_Pt` | `skc_Pt_To_ML` | 473.176 | pintes en millilitres |
| `Pt_p_mL` | `skc_ML_To_Pt` | 0.00211338 | millilitres en pintes |
| `L_p_FlOz` | `skc_FlOz_To_L` | 0.0295735 | onces liquides en litres |
| `FlOz_p_L` | `skc_L_To_FlOz` | 33.814 | litres en onces liquides |
| `FlOz_p_Cup` | `skc_Cup_To_FlOz` | 8 | tasses en onces liquides |
| `mL_p_Cup` | `skc_Cup_To_ML` | 236.588 | tasses en millilitres |
| `Tbsp_p_FlOz` | `skc_FlOz_To_Tbsp` | 2 | onces liquides en cuillères à soupe |
| `Tsp_p_Tbsp` | `skc_Tbsp_To_Tsp` | 3 | cuillères à soupe en cuillères à café |
| `mL_p_Tbsp` | `skc_Tbsp_To_ML` | 14.7868 | cuillères à soupe en millilitres |
| `mL_p_Tsp` | `skc_Tsp_To_ML` | 4.92892 | cuillères à café en millilitres |
| `Tbsp_p_mL` | `skc_ML_To_Tbsp` | 0.067628 | millilitres en cuillères à soupe |
| `Tsp_p_mL` | `skc_ML_To_Tsp` | 0.202884 | millilitres en cuillères à café |

### Volume (impérial, utilisé au Royaume-Uni : Im dans le nom) {#volume-imperial-used-in-the-uk-im-in-the-name}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `L_p_ImGal` | `skc_ImGal_To_L` | 4.54609 | gallons impériaux en litres |
| `ImGal_p_L` | `skc_L_To_ImGal` | 0.219969 | litres en gallons impériaux |
| `Gal_p_ImGal` | `skc_ImGal_To_Gal` | 1.20095 | gallons impériaux en gallons américains |
| `ImGal_p_Gal` | `skc_Gal_To_ImGal` | 0.832674 | gallons américains en gallons impériaux |
| `ImPt_p_ImGal` | `skc_ImGal_To_ImPt` | 8 | gallons impériaux en pintes impériales |
| `mL_p_ImPt` | `skc_ImPt_To_ML` | 568.261 | pintes impériales en millilitres |
| `ImPt_p_mL` | `skc_ML_To_ImPt` | 0.00175975 | millilitres en pintes impériales |
| `ImFlOz_p_ImPt` | `skc_ImPt_To_ImFlOz` | 20 | pintes impériales en onces liquides impériales |
| `mL_p_ImFlOz` | `skc_ImFlOz_To_ML` | 28.4131 | onces liquides impériales en millilitres |
| `ImFlOz_p_mL` | `skc_ML_To_ImFlOz` | 0.0351951 | millilitres en onces liquides impériales |
| `L_p_ImBBL` | `skc_ImBBL_To_L` | 163.659 | barils de bière britanniques (36 gallons impériaux) en litres |
| `ImBBL_p_L` | `skc_L_To_ImBBL` | 0.00611026 | litres en barils de bière britanniques |

### Pression {#pressure}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `kPa_p_PSI` | `skc_PSI_To_kPa` | 6.89476 | PSI en kilopascals |
| `Bar_p_PSI` | `skc_PSI_To_Bar` | 0.0689476 | PSI en bar |
| `hPa_p_PSI` | `skc_PSI_To_hPa` | 68.9476 | PSI en hectopascals (millibars) |
| `inHg_p_PSI` | `skc_PSI_To_inHg` | 2.03602 | PSI en pouces de mercure |
| `PSI_p_kPa` | `skc_kPa_To_PSI` | 0.145038 | kilopascals en PSI |
| `Bar_p_kPa` | `skc_kPa_To_Bar` | 0.01 | kilopascals en bars |
| `hPa_p_kPa` | `skc_kPa_To_hPa` | 10 | kilopascals en hectopascals (millibars) |
| `PSI_p_Bar` | `skc_Bar_To_PSI` | 14.5038 | bar en PSI |
| `kPa_p_Bar` | `skc_Bar_To_kPa` | 100 | bars en kilopascals |
| `inHg_p_hPa` | `skc_hPa_To_inHg` | 0.02953 | hectopascals (millibars) en pouces de mercure |
| `PSI_p_hPa` | `skc_hPa_To_PSI` | 0.0145038 | hectopascals (millibars) en PSI |
| `kPa_p_hPa` | `skc_hPa_To_kPa` | 0.1 | hectopascals (millibars) en kilopascals |
| `Bar_p_hPa` | `skc_hPa_To_Bar` | 0.001 | hectopascals (millibars) en bars |
| `hPa_p_Bar` | `skc_Bar_To_hPa` | 1000 | bars en hectopascals (millibars) |
| `inHg_p_kPa` | `skc_kPa_To_inHg` | 0.2953 | kilopascals en pouces de mercure |
| `mmHg_p_hPa` | `skc_hPa_To_mmHg` | 0.750062 | hectopascals (millibars) en millimètres de mercure |
| `hPa_p_inHg` | `skc_inHg_To_hPa` | 33.8639 | pouces de mercure en hectopascals (millibars) |
| `PSI_p_inHg` | `skc_inHg_To_PSI` | 0.491154 | pouces de mercure en PSI |
| `kPa_p_inHg` | `skc_inHg_To_kPa` | 3.38639 | pouces de mercure en kilopascals |
| `hPa_p_mmHg` | `skc_mmHg_To_hPa` | 1.33322 | millimètres de mercure en hectopascals (millibars) |
| `PSI_p_Atm` | `skc_Atm_PSI` | 14.6959 | pression standard au niveau de la mer en PSI |
| `kPa_p_Atm` | `skc_Atm_kPa` | 101.325 | pression standard au niveau de la mer en kilopascals |
| `hPa_p_Atm` | `skc_Atm_hPa` | 1013.25 | pression standard au niveau de la mer en hectopascals (millibars) |
| `inHg_p_Atm` | `skc_Atm_inHg` | 29.9213 | pression standard au niveau de la mer en pouces de mercure |

### Température {#temperature}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `F_p_C` | `skc_F_Per_C` | 1.8 | °F dans un °C (aussi un changement de température de °C en °F) |
| `C_p_F` | `skc_C_Per_F` | 0.555556 | °C dans un °F (aussi un changement de température de °F en °C) |
| - | `skc_F_Freeze` | 32 | l'eau gèle, °F |
| - | `skc_C_Freeze` | 0 | l'eau gèle, °C |
| - | `skc_F_Boil` | 212 | l'eau bout au niveau de la mer, °F |
| - | `skc_C_Boil` | 100 | l'eau bout au niveau de la mer, °C |

### Rapports de brassage {#brewing-ratios}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `LKg_p_QtLb` | `skc_QtLb_To_LKg` | 2.08635 | épaisseur de la maische, quarts par livre en litres par kilogramme |
| `QtLb_p_LKg` | `skc_LKg_To_QtLb` | 0.479306 | épaisseur de la maische, litres par kilogramme en quarts par livre |
| `LKg_p_GalLb` | `skc_GalLb_To_LKg` | 8.3454 | absorption du grain, gallons par livre en litres par kilogramme |
| `GalLb_p_LKg` | `skc_LKg_To_GalLb` | 0.119826 | absorption du grain, litres par kilogramme en gallons par livre |
| `GL_p_OzGal` | `skc_OzGal_To_GL` | 7.48915 | dose de houblon ou de sel, onces par gallon en grammes par litre |
| `OzGal_p_GL` | `skc_GL_To_OzGal` | 0.133526 | dose de houblon ou de sel, grammes par litre en onces par gallon |
| `LPM_p_GPM` | `skc_GPM_To_LPM` | 3.78541 | débit, gallons par minute en litres par minute |
| `GPM_p_LPM` | `skc_LPM_To_GPM` | 0.264172 | débit, litres par minute en gallons par minute |

### Longueur {#length}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `Cm_p_In` | `skc_In_To_Cm` | 2.54 | pouces en centimètres |
| `mm_p_In` | `skc_In_To_Mm` | 25.4 | pouces en millimètres |
| `In_p_Cm` | `skc_Cm_To_In` | 0.393701 | centimètres en pouces |
| `In_p_mm` | `skc_Mm_To_In` | 0.0393701 | millimètres en pouces |
| `M_p_Ft` | `skc_Ft_To_M` | 0.3048 | pieds en mètres |
| `Ft_p_M` | `skc_M_To_Ft` | 3.28084 | mètres en pieds |
| `In_p_Ft` | `skc_Ft_To_In` | 12 | pieds en pouces |
| `Ft_p_In` | `skc_In_To_Ft` | 0.0833333 | pouces en pieds |
| `Cm_p_M` | `skc_M_To_Cm` | 100 | mètres en centimètres |
| `mm_p_Cm` | `skc_Cm_To_Mm` | 10 | centimètres en millimètres |

### Puissance {#power}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `BTUh_p_W` | `skc_W_To_BTUh` | 3.41214 | watts en BTU par heure |
| `W_p_BTUh` | `skc_BTUh_To_W` | 0.293071 | BTU par heure en watts |
| `W_p_KW` | `skc_KW_To_W` | 1000 | kilowatts en watts |
| `KW_p_W` | `skc_W_To_KW` | 0.001 | watts en kilowatts |
| `W_p_HP` | `skc_HP_To_W` | 745.7 | chevaux-vapeur (le moteur d'une pompe) en watts |
| `HP_p_W` | `skc_W_To_HP` | 0.00134102 | watts en chevaux-vapeur |

### Temps (les Processes comptent le temps en secondes) {#time-processes-count-time-in-seconds}

| Nom court | Nom | Valeur | Ce qu'elle fait |
|---|---|---|---|
| `Sec_p_Min` | `skc_Min_To_Sec` | 60 | minutes en secondes |
| `Sec_p_Hr` | `skc_Hr_To_Sec` | 3600 | heures en secondes |
| `Min_p_Hr` | `skc_Hr_To_Min` | 60 | heures en minutes |
| `Hr_p_Day` | `skc_Day_To_Hr` | 24 | jours en heures |
| `Sec_p_Day` | `skc_Day_To_Sec` | 86400 | jours en secondes |
| `Min_p_Sec` | `skc_Sec_To_Min` | 0.0166667 | secondes en minutes |
| `Hr_p_Min` | `skc_Min_To_Hr` | 0.0166667 | minutes en heures |
| `Ms_p_Sec` | `skc_Sec_To_Ms` | 1000 | secondes en millisecondes (sleep compte en millisecondes) |
| `Ms_p_Min` | `skc_Min_To_Ms` | 60000 | minutes en millisecondes (sleep compte en millisecondes) |
