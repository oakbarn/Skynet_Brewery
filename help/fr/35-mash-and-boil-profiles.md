# Mash, Boil et Water Profiles {#mash-boil-and-water-profiles}

Les Mash Profiles (profils d'empâtage), Boil Profiles (profils d'ébullition) et Water Profiles (profils d'eau) sont gardés à part, donc n'importe quelle Recipe peut utiliser n'importe lequel. Ils sont enregistrés sur le Brain dans `config/profiles/mash`, `config/profiles/boil` et `config/profiles/water`. **☰ Menu > Default settings** dit avec lesquels commence une nouvelle Recipe.

Les **Skynet Profiles** viennent avec Skynet. Ils sont en lecture seule : ils ne changent jamais, donc une Recipe qui en utilise un brasse pareil à chaque fois. Pour en changer un, faites-en votre propre copie (plus bas). Partir d'un Skynet Profile et changer ce qu'il faut est plus facile que d'en écrire un à partir de rien.

## Add new ... {#add-new}

Chaque liste de Mash, Boil et Water Profiles finit par **Add new ...** (en ajouter un) : sur l'onglet ☰ Menu du profil, dans **Default settings**, et sur les onglets **Mash**, **Recipe** (Boil Profile) et **Waters** de la Recipe. Choisissez-le, donnez un **Name** (nom) au nouveau profil, et choisissez de quoi il **part** (Start from) : un profil vide, ou **une copie** de n'importe quel profil (un Skynet aussi). Son onglet ☰ Menu s'ouvre pour que vous le remplissiez. Appuyez sur **Save**.

Les températures et les volumes suivent les **Units** du profil : US (°F, gallons) ou Metric (°C, litres).

## Mash Profile {#mash-profile}

Appuyez sur **☰ Menu** et choisissez **Mash Profile**.

- Jusqu'à **4 paliers**, chacun avec un **Name**, une **Temperature** et un **Time** (durée) en minutes. Laissez un palier vide si vous n'en avez pas besoin.
- **Mash out temperature** (température de mash out). Vide : pas de mash out.
- **Sparge** (rinçage des drêches) : **Fly sparge** (l'eau entre pendant que le moût sort), **Batch sparge** (toute l'eau d'un coup, avec un **temps de repos** en minutes), ou **No sparge** (volume complet, comme le brassage en sac).
- **Sparge water temperature** (température de l'eau de rinçage).

Ce que font les paliers : un **repos protéines** (environ 122 °F / 50 °C) aide le blé et les malts peu modifiés. La **bêta-amylase** (environ 146 °F / 63 °C) fait des sucres que la levure peut manger : une bière plus sèche et plus légère. L'**alpha-amylase** (environ 158 °F / 70 °C) laisse plus de sucres que la levure ne peut pas manger : une bière plus douce et plus ronde. Un seul repos de **saccharification** entre les deux (148 à 156 °F, 64 à 69 °C) fait un peu des deux : plus bas est plus sec, plus haut est plus rond. Le **mash out** (environ 168 °F / 76 °C) arrête le changement et fait couler le moût plus facilement.

| Skynet Mash Profile | Paliers (°F / °C, minutes) | Mash out | Sparge | À quoi il sert |
|---|---|---|---|---|
| Single Step, Batch Sparge | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, repos 10 min | Un repos à 152 °F, mash out à 168 °F, puis un batch sparge avec un repos de 10 minutes. |
| 3 Mash Steps, Fly Sparge | Repos protéines 122 °F / 50 °C, 15 min; Bêta-amylase 146 °F / 63 °C, 30 min; Alpha-amylase 158 °F / 70 °C, 20 min | 168 °F / 76 °C | Fly | Repos protéines, bêta et alpha, mash out à 168 °F, puis un fly sparge (continu) avec de l'eau à 168 °F. |
| Single Infusion, Light Body | Saccharification 148 °F / 64 °C, 75 min | 168 °F / 76 °C | Batch, repos 10 min | Une bière sèche et vive : un long repos, bas. |
| Single Infusion, Medium Body | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, repos 10 min | La plupart des ales. |
| Single Infusion, Full Body | Saccharification 156 °F / 69 °C, 45 min | 168 °F / 76 °C | Batch, repos 10 min | Une bière douce et ronde : stouts, Scottish ales. |
| Single Infusion, No Mash Out | Saccharification 152 °F / 67 °C, 60 min | aucun | Batch, repos 10 min | Corps moyen, directement au rinçage. |
| Step Mash, Repos protéines | Repos protéines 122 °F / 50 °C, 20 min; Saccharification 152 °F / 67 °C, 45 min | 168 °F / 76 °C | Batch, repos 10 min | Wheat beers and under-modified malts. |
| Step Mash, Beta and Alpha | Bêta-amylase 146 °F / 63 °C, 30 min; Alpha-amylase 158 °F / 70 °C, 30 min | 168 °F / 76 °C | Batch, repos 10 min | Lagers et bières belges : sèches, avec une bonne mousse. |
| Hochkurz | Repos maltose 145 °F / 63 °C, 35 min; Repos dextrine 162 °F / 72 °C, 25 min | 172 °F / 78 °C | Batch, repos 10 min | Les deux paliers allemands. |
| BIAB, Full Volume | Saccharification 152 °F / 67 °C, 60 min | 168 °F / 76 °C | Batch, repos 10 min | Brassage en sac (BIAB) : pas de rinçage. |

## Boil Profile {#boil-profile}

Appuyez sur **☰ Menu** et choisissez **Boil Profile**.

- **Total boil time** (durée totale d'ébullition) en minutes. **0** = pas d'ébullition.
- **Boil off** : combien s'évapore chaque heure, en gallons ou en litres. **Vide** utilise le Boil Off de l'**Equipment Profile** (chaque brasserie évapore différemment : un petit tout-en-un évapore moins qu'une grande cuve sur un brûleur). Quand un Boil Profile a son propre Boil Off, le choisir dans une Recipe demande lequel utiliser : **celui de l'Equipment Profile**, ou **celui du profil**. Il le demande à chaque fois.
- **Ask the kettle volume at the start and end of the boil** (demander le volume de la cuve au début et à la fin de l'ébullition) : le jour du brassage, on vous demande combien de moût il y a dans la cuve quand l'ébullition commence et quand elle finit. C'est ainsi que vous apprenez votre vrai Boil Off. C'est activé dans chaque Skynet Boil Profile.
- **Hop Stands** : les trois Hop Stands (plus bas). Vide : une Recipe qui utilise ce Boil Profile le demande quand un houblon Whirlpool est ajouté.

| Skynet Boil Profile | Minutes | À quoi il sert |
|---|---|---|
| 60 Minute Boil | 60 | L'ébullition habituelle de la plupart des bières : assez pour utiliser les houblons et chasser le DMS des malts pâles. |
| 90 Minute Boil | 90 | Pour les bières avec beaucoup de malt Pilsner (plus de DMS à chasser), les grosses bières qui doivent réduire, et un moût plus foncé et plus riche. |
| 30 Minute Boil | 30 | Une ébullition rapide : bières à l'extrait et partial grain, ou quand seuls des houblons tardifs sont utilisés. |
| No Boil | 0 | Pas d'ébullition du tout : sours sans ébullition (Berliner Weisse), raw ales et certains kits. Le moût doit seulement être assez chaud pour être sûr, ou il est déjà assaini. |

La case **Check the volumes** de l'onglet Equipment Profile peut utiliser n'importe quel Boil Profile.

## Les trois Hop Stands {#the-three-hop-stands}

Après l'ébullition, le refroidissement s'arrête à chaque **Hop Stand** (infusion de houblon) qui a des houblons Whirlpool, du plus haut au plus bas. L'eau de refroidissement est coupée pendant la durée du stand pendant que les houblons infusent, puis le refroidissement reprend.

| Hop Stand | Température | Durée | Ce qu'il donne |
|---|---|---|---|
| **High** | 170 à 185 °F (77 à 85 °C), le plus souvent 180 °F (82 °C) | 10 à 20 min | Plus d'amertume et de goût ; un peu d'arôme se perd. |
| **Middle** | 150 à 160 °F (65 à 71 °C), le plus souvent 154 °F (68 °C) | 20 à 30 min | Goût et arôme, peu d'amertume. |
| **Low** | environ la température d'ensemencement, 60 à 70 °F (16 à 21 °C) | 30 min ou plus | Le plus d'arôme, presque pas d'amertume. |

Ce sont les chiffres **courants**. Skynet n'en remplit aucun : il n'y a **pas de valeurs par défaut** (Règle Skynet 17.14).

**Les questions Whirlpool.** Quand vous activez l'interrupteur **Whirlpool** d'un houblon sur l'onglet **Hops** de la Recipe, Skynet demande :
- **Hop Stand** : High, Middle ou Low.
- **Temperature** : où le refroidissement s'arrête pour ce stand.
- **Time** : combien de temps l'eau de refroidissement reste coupée.

Elles commencent vides. L'aide au survol de chaque question donne les chiffres courants ci-dessus. Les houblons d'un même stand partagent sa Temperature et son Time. Si vous enregistrez avec une case vide, vous avez un seul avertissement, « The chill won't stop for this hop. » (le refroidissement ne s'arrêtera pas pour ce houblon), et c'est quand même enregistré.

La température et la durée de chaque stand sont celles de la **Recipe** (l'onglet Recipe montre les trois). Une Recipe qui n'a pas les siennes utilise celles de son **Boil Profile**, si vous les y avez tapées. Un fichier de recette (BeerSmith ou BeerXML) qui donne une température de whirlpool met ce houblon dans le stand qui lui correspond, avec la température et la durée du fichier : **High** à 170 °F (77 °C) et plus, **Middle** à partir de 140 °F (60 °C), **Low** en dessous. Un houblon whirlpool sans température dans le fichier n'a pas de stand, donc ses questions sont posées quand vous l'ouvrez.

Un Process les lit comme `skn_rcp_Hop_Stand_High`, `skn_rcp_Hop_Stand_High_Temp` et `skn_rcp_Hop_Stand_High_Minutes` (et pareil pour Middle et Low). Les Process Templates Skynet **Chill** et **Whirlpool and Chill** s'arrêtent à chacun.

## Water Profile {#water-profile}

Appuyez sur **☰ Menu** et choisissez **Water Profile**. Votre eau telle que le rapport d'analyse la donne (ppm), et combien elle est coupée avec de l'**eau distillée ou osmosée** (50 = moitié-moitié). Skynet calcule l'eau avec laquelle vous brassez. **Tap Water** (eau du robinet) est toujours là : remplissez ses chiffres dans **☰ Menu > Default settings > Tap Water**.

Ce que font les minéraux : le **calcium** aide l'empâtage et la levure. Le **sulfate** rend le houblon plus vif et plus amer. Le **chlorure** rend le malt plus rond et plus plein. Plus de sulfate que de chlorure donne une eau houblonnée ; plus de chlorure, une eau maltée. Le **bicarbonate** adoucit l'acidité des malts foncés : élevé dans les eaux pour bières foncées, bas pour les pâles. Le **sodium** et le **magnésium** sont à garder bas.

| Skynet Water Profile | Calcium | Magnésium | Sodium | Sulfate | Chlorure | Bicarbonate | À quoi il sert |
|---|---|---|---|---|---|---|---|
| Distilled or RO | 0 | 0 | 0 | 0 | 0 | 0 | Rien dedans : la base pour construire n'importe quelle eau. |
| Balanced | 60 | 10 | 15 | 75 | 75 | 40 | Autant de sulfate que de chlorure : la plupart des bières. |
| Pale Ale, Hoppy | 110 | 18 | 15 | 250 | 50 | 40 | Beaucoup de sulfate : amertume vive et sèche (IPA, Pale Ale). |
| Malty | 60 | 10 | 25 | 50 | 100 | 60 | Plus de chlorure : malt rond et plein (Brown, Scottish, NEIPA). |
| Pilsen | 7 | 2 | 2 | 5 | 5 | 15 | Très douce : Pilsner et lagers pâles. |
| Burton on Trent | 295 | 45 | 55 | 725 | 25 | 300 | Très dure : pale ales anglaises. |
| Dublin | 118 | 4 | 12 | 55 | 19 | 160 | Dure avec du bicarbonate : stouts et porters. |
| Munich | 76 | 18 | 2 | 6 | 2 | 152 | Bicarbonate : lagers foncées, Dunkel, Bock. |
| London | 52 | 32 | 86 | 32 | 34 | 104 | Bitters, porters, milds. |

Tous les chiffres sont en ppm (parties par million, la même chose que mg par litre).
