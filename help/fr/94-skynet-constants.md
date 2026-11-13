# Constantes Skynet {#skynet-constants}

Les constantes Skynet (Skynet Constants) sont des nombres fixes intégrés à Skynet pour les conversions que les brasseurs utilisent le plus : poids, volume, pression, température, rapports de brassage, longueur, puissance et temps. Chaque nom commence par **`skc_`**. Elles font partie de Skynet, donc personne ne peut les changer (Règle Skynet 3.11), et elles sont les mêmes sur chaque Brain.

## En utiliser une dans un Process {#using-one-in-a-process}

Utilisez une constante Skynet partout où un nombre peut aller. Multipliez la quantité par la constante dont le nom dit **de**\_To\_**vers** (from\_To\_to) :

```
gGV_Grain_Lb = gGV_Grain_Kg * skc_Kg_To_Lb        // 5 kg -> 11.02 lb
gGV_Strike_L = gGV_Strike_Gal * skc_Gal_To_L
gGV_Hops_G = gGV_Hops_Oz * skc_Oz_To_G
if Kettle_Pressure * skc_PSI_To_kPa > 70
sleep 5 * skc_Min_To_Sec * 1000                  // sleep counts in milliseconds
```

Les majuscules et les minuscules ne comptent pas : `SKC_KG_TO_LB` est la même constante. L'éditeur de Process les montre en bleu, comme `true`, `false` et `now`.

## Température {#temperature}

Une température demande une étape de plus que les autres, car 0 °C n'est pas 0 °F :

```
gGV_Temp_F = gGV_Temp_C * skc_F_Per_C + skc_F_Freeze
gGV_Temp_C = (gGV_Temp_F - skc_F_Freeze) * skc_C_Per_F
```

Un **changement** de température (une hausse de 2 degrés, une baisse de 10 degrés) n'a besoin que de la multiplication : `gGV_Rise_F = gGV_Rise_C * skc_F_Per_C`.

## Texte prédictif {#predictive-text}

Là où une valeur peut aller, commencez à taper et les constantes Skynet qui correspondent sont listées avec leur valeur et ce qu'elles font. Taper `skc_` les liste toutes, et taper une unité trouve chaque constante qui l'utilise : `Kg` liste `skc_Kg_To_Lb`, `skc_Lb_To_Kg`, `skc_G_To_Kg` et le reste. Voir [Texte prédictif dans l'éditeur de Process](79-predictive-text).

## Ce que vous ne pouvez pas faire {#what-you-can-t-do}

- Une constante Skynet ne peut pas être changée : `skc_Kg_To_Lb = 2` est une erreur quand le Process est vérifié ou enregistré.
- Une constante Skynet n'a pas d'attributs : `skc_Kg_To_Lb.value` est une erreur. Utilisez le nom seul.
- Les noms qui commencent par `skc_` sont gardés pour les constantes Skynet. Aucun Device, Widget, gGlobal ni variable `new` ne peut en avoir un.
- Un nom qui commence par `skc_` mais n'est pas dans les listes ci-dessous est une erreur, donc une faute de frappe est trouvée quand vous vérifiez le Process.

## Les constantes Skynet {#the-skynet-constants}

Les volumes sont en gallons, quarts et onces liquides américains. Les valeurs sont montrées ici avec 6 chiffres ; Skynet les utilise en pleine précision.

### Poids {#weight}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_Kg_To_G` | 1000 | kilogrammes en grammes |
| `skc_Kg_To_Lb` | 2.20462 | kilogrammes en livres |
| `skc_Kg_To_Oz` | 35.274 | kilogrammes en onces |
| `skc_G_To_Kg` | 0.001 | grammes en kilogrammes |
| `skc_G_To_Lb` | 0.00220462 | grammes en livres |
| `skc_G_To_Oz` | 0.035274 | grammes en onces |
| `skc_Lb_To_Kg` | 0.453592 | livres en kilogrammes |
| `skc_Lb_To_G` | 453.592 | livres en grammes |
| `skc_Lb_To_Oz` | 16 | livres en onces |
| `skc_Oz_To_Kg` | 0.0283495 | onces en kilogrammes |
| `skc_Oz_To_G` | 28.3495 | onces en grammes |
| `skc_Oz_To_Lb` | 0.0625 | onces en livres |

### Volume (gallons, quarts et onces liquides américains) {#volume-us-gallons-quarts-and-fluid-ounces}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_Gal_To_L` | 3.78541 | gallons en litres |
| `skc_Gal_To_Qt` | 4 | gallons en quarts |
| `skc_Gal_To_FlOz` | 128 | gallons en onces liquides |
| `skc_Qt_To_L` | 0.946353 | quarts en litres |
| `skc_Qt_To_Gal` | 0.25 | quarts en gallons |
| `skc_FlOz_To_ML` | 29.5735 | onces liquides en millilitres |
| `skc_L_To_Gal` | 0.264172 | litres en gallons |
| `skc_L_To_Qt` | 1.05669 | litres en quarts |
| `skc_L_To_ML` | 1000 | litres en millilitres |
| `skc_ML_To_L` | 0.001 | millilitres en litres |
| `skc_ML_To_FlOz` | 0.033814 | millilitres en onces liquides |
| `skc_BBL_To_Gal` | 31 | barils de bière US en gallons |
| `skc_BBL_To_L` | 117.348 | barils de bière US en litres |
| `skc_L_To_BBL` | 0.00852168 | litres en barils de bière US |
| `skc_HL_To_L` | 100 | hectolitres en litres |

### Pression {#pressure}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_PSI_To_kPa` | 6.89476 | PSI en kilopascals |
| `skc_PSI_To_Bar` | 0.0689476 | PSI en bar |
| `skc_PSI_To_hPa` | 68.9476 | PSI en hectopascals (millibars) |
| `skc_PSI_To_inHg` | 2.03602 | PSI en pouces de mercure |
| `skc_kPa_To_PSI` | 0.145038 | kilopascals en PSI |
| `skc_kPa_To_Bar` | 0.01 | kilopascals en bars |
| `skc_kPa_To_hPa` | 10 | kilopascals en hectopascals (millibars) |
| `skc_Bar_To_PSI` | 14.5038 | bar en PSI |
| `skc_Bar_To_kPa` | 100 | bars en kilopascals |
| `skc_hPa_To_inHg` | 0.02953 | hectopascals (millibars) en pouces de mercure |
| `skc_hPa_To_PSI` | 0.0145038 | hectopascals (millibars) en PSI |
| `skc_hPa_To_kPa` | 0.1 | hectopascals (millibars) en kilopascals |
| `skc_inHg_To_hPa` | 33.8639 | pouces de mercure en hectopascals (millibars) |
| `skc_inHg_To_PSI` | 0.491154 | pouces de mercure en PSI |
| `skc_inHg_To_kPa` | 3.38639 | pouces de mercure en kilopascals |
| `skc_mmHg_To_hPa` | 1.33322 | millimètres de mercure en hectopascals (millibars) |
| `skc_Atm_PSI` | 14.6959 | pression standard au niveau de la mer en PSI |
| `skc_Atm_kPa` | 101.325 | pression standard au niveau de la mer en kilopascals |
| `skc_Atm_hPa` | 1013.25 | pression standard au niveau de la mer en hectopascals (millibars) |
| `skc_Atm_inHg` | 29.9213 | pression standard au niveau de la mer en pouces de mercure |

### Température {#temperature}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_F_Per_C` | 1.8 | °F dans un °C (aussi un changement de température de °C en °F) |
| `skc_C_Per_F` | 0.555556 | °C dans un °F (aussi un changement de température de °F en °C) |
| `skc_F_Freeze` | 32 | l'eau gèle, °F |
| `skc_C_Freeze` | 0 | l'eau gèle, °C |
| `skc_F_Boil` | 212 | l'eau bout au niveau de la mer, °F |
| `skc_C_Boil` | 100 | l'eau bout au niveau de la mer, °C |

### Rapports de brassage {#brewing-ratios}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_QtLb_To_LKg` | 2.08635 | épaisseur de la maische, quarts par livre en litres par kilogramme |
| `skc_LKg_To_QtLb` | 0.479306 | épaisseur de la maische, litres par kilogramme en quarts par livre |
| `skc_GalLb_To_LKg` | 8.3454 | absorption du grain, gallons par livre en litres par kilogramme |
| `skc_LKg_To_GalLb` | 0.119826 | absorption du grain, litres par kilogramme en gallons par livre |
| `skc_OzGal_To_GL` | 7.48915 | dose de houblon ou de sel, onces par gallon en grammes par litre |
| `skc_GL_To_OzGal` | 0.133526 | dose de houblon ou de sel, grammes par litre en onces par gallon |
| `skc_GPM_To_LPM` | 3.78541 | débit, gallons par minute en litres par minute |
| `skc_LPM_To_GPM` | 0.264172 | débit, litres par minute en gallons par minute |

### Longueur {#length}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_In_To_Cm` | 2.54 | pouces en centimètres |
| `skc_In_To_Mm` | 25.4 | pouces en millimètres |
| `skc_Cm_To_In` | 0.393701 | centimètres en pouces |
| `skc_Mm_To_In` | 0.0393701 | millimètres en pouces |
| `skc_Ft_To_M` | 0.3048 | pieds en mètres |
| `skc_M_To_Ft` | 3.28084 | mètres en pieds |

### Puissance {#power}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_W_To_BTUh` | 3.41214 | watts en BTU par heure |
| `skc_BTUh_To_W` | 0.293071 | BTU par heure en watts |
| `skc_KW_To_W` | 1000 | kilowatts en watts |

### Temps (les Processes comptent le temps en secondes) {#time-processes-count-time-in-seconds}

| Nom | Valeur | Ce qu'elle fait |
|---|---|---|
| `skc_Min_To_Sec` | 60 | minutes en secondes |
| `skc_Hr_To_Sec` | 3600 | heures en secondes |
| `skc_Hr_To_Min` | 60 | heures en minutes |
| `skc_Day_To_Hr` | 24 | jours en heures |
| `skc_Day_To_Sec` | 86400 | jours en secondes |
