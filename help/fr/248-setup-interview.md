# Setup Interview (Entretien de configuration) {#setup-interview}

Le **Setup Interview** règle vos paramètres Skynet, une question à la fois (règle Skynet 2.75). Il s’ouvre tout seul la première fois
qu’un Admin ouvre une nouvelle installation (aucun paramètre Skynet encore enregistré), avant la page de bienvenue qui propose un
Schema d’exemple. Un Admin peut le relancer à tout moment depuis **☰ Menu > 🧭 Setup Interview**.

## Comment ça marche {#how-it-works}

Les boutons, le titre et la bande d’étapes restent figés en haut : seule la page dessous défile.

- Une question par page, avec une courte explication dessous. La bande d’étapes en haut montre où vous en êtes, en 6 étapes :
  **1. Units · 2. Brewer Type · 3. Brewery · 4. Other Defaults · 5. Recipe Defaults · 6. Help Language**. La page Done vient après la dernière question ; elle n’est pas dans la bande.
- **◀ Back** revient à la question précédente. **Next ▶** garde votre réponse et continue. Un choix de 6 ou moins est une case : un
  clic le choisit et continue. Un choix de plus de 6 est une liste déroulante (règle 2.6).
- Il faut répondre seulement aux deux premières étapes : **US or Metric** (toujours la première question) et **Brewer Type**. Tant que l’une
  d’elles n’a pas de réponse, son **Skip** et son **Next ▶** portent le signe ⛔ sens interdit et ne font rien : cliquez sur une
  réponse. Une fois répondue, Skip garde votre réponse et continue. **◀ Back** marche toujours (sauf sur la page de bienvenue : rien
  n’est avant elle).
- Les étapes 3 **Brewery**, 4 **Other Defaults** et 5 **Recipe Defaults** sont des branches. Chacune s’ouvre sur une page qui liste ce
  qu’elle demande. **Next ▶** la commence. **Skip** sur cette page saute toute la branche et garde les réponses de Skynet. Dans une
  branche, chaque question a son propre **Skip**.
- L’étape 6 **Help Language** est une seule question avec son propre **Skip** (anglais).
- **Skip** garde la réponse de Skynet et continue, et la question ne devient pas verte. Skynet ne vous le rappelle pas plus tard.
- Une question devient **verte** quand vous y répondez (Next). Une étape devient verte quand chacune de ses questions a une réponse.
  Cliquez sur une étape pour y aller.
- L’entretien s’ouvre sur la première question qui n’est pas verte, et **Next ▶** passe à la suivante qui n’est pas verte, dans
  l’ordre. Les questions déjà répondues (vertes) ne reviennent pas ; cliquez sur leur étape, ou sur **✎** dans Done, pour en changer
  une.
- Chaque page commence sur la réponse de Skynet (ou sur votre réponse enregistrée quand vous le relancez) : Next, Next, Next donne un
  panneau qui fonctionne.
- **La question 1, US or Metric**, commence par quelques mots sur les unités (toutes les données sont gardées en métrique à
  l’intérieur ; seul ce que vous voyez ou saisissez change), puis « And now for that 1st Question: US or Metric Units? Choose One. »
  avec deux **cases à cocher**. Cocher ne fait pas avancer : chaque **Next ▶** porte le ⛔ tant qu’aucune case n’est cochée.
- **Chaque réponse est enregistrée dès que vous la donnez** (Next, ou un clic sur un choix), sur le Brain, comme un gGlobal : elle
  reste même si votre ordinateur est éteint. Relancez l’entretien et il s’ouvre sur la première question sans réponse.
- La dernière page, **Done**, montre toutes les réponses. **✎** revient à cette question. **✔ Finish** les enregistre toutes.
- **Close** ou **✕** :
  - sur chaque écran, la page de bienvenue aussi, ils portent le signe ⛔ sens interdit et ne font rien tant que 1. Units et
    2. Brewer Type n’ont pas de réponse (Échap ne fait rien non plus). Chaque étape de la bande porte aussi le ⛔ jusque-là.
  - ensuite, quand certaines questions ne sont pas encore vertes, une fenêtre **bleue** dit : elles ont besoin d’une réponse ; régler
    Skynet dépend des réponses à beaucoup de ces questions pour qu’il soit vraiment le vôtre, mais il fonctionne avec seulement les 2
    premières questions. **◀ Keep answering** revient ; **Close** enregistre les réponses données et ferme. Relancez-le depuis
    ☰ Menu pour répondre au reste.

## Les six premiers écrans {#the-first-six-screens}

Chaque passage commence par six écrans avant la première question. **Next ▶** (en haut, ou après **Click to proceed:**) ou
**Skip** continue ; **◀ Back** revient à l’écran précédent.

1. **Welcome** (bienvenue) : voir plus bas.
2. **Le guide des boutons** : chaque bouton du haut, tel qu’il apparaît, et ce qu’il fait, avec ceux marqués ⛔ (Skip et Next ▶ sur
   1. Units et 2. Brewer Type tant qu’ils n’ont pas de réponse ; Close et ✕ tant que 1 et 2 n’ont pas de réponse).
3. **Comment répondre** : on répond aux questions de deux façons. La première est une **case à cocher** (« Are you a morning
   person? »), montrée avant et après un clic ; vous pouvez essayer la première ligne.
4. **Comment répondre, la deuxième façon** : une **liste déroulante** (« Favorite Ice Cream? »), montrée fermée, ouverte puis avec
   Chocolate choisi ; vous pouvez essayer la première. Elle limite vos choix : il y a parfois un choix Other pour ce qui n’est pas
   dans la liste ; sinon, choisissez la réponse la meilleure ou la plus proche. Les deux exemples sont aussi dans
   [Getting started](01-getting-started).
5. **Hot Spots** (zones cliquables) : la bande d’étapes en haut n’est faite que de zones cliquables : cliquez sur une étape pour y
   aller. La bande d’exemple de cet écran peut être essayée : cliquez sur une étape (elle commence sur 4. Other Defaults) et l’écran
   montre dessous à quoi ressemble la page de cette étape.
6. **Let's get to the Interview** (passons à l’entretien) : l’entretien commence par deux questions faciles. Il n’y a pas de mauvaise réponse : donnez votre meilleure estimation, mais plus vous êtes
   précis, plus les écrans de Skynet ressemblent à VOTRE brasserie. L’écran dit aussi que Skynet a des Processes « tout faits » pour
   le jour de brassage, du coaching pas à pas à une brasserie automatisée, et que le code qu’ils demandent doit être une échelle, pas
   une montagne.

## La page de bienvenue {#the-welcome-page}

L’entretien s’ouvre toujours sur une page **Welcome** (bienvenue). Son encadré bleu est la seule note sur
les téléphones et les petits écrans : Skynet peut être commandé depuis presque n’importe quel appareil doté d’un navigateur et d’une
connexion Internet, mais il est bien plus facile de concevoir sur un ordinateur, car les détails fins sont difficiles à voir sur un
petit écran. En dessous, la page explique ce qu’est l’entretien : rien n’est gravé dans le marbre, chaque réponse peut être changée à
tout moment dans **☰ Menu > Default settings**, et vous pouvez relancer l’entretien depuis ☰ Menu. Son **◀ Back** porte le ⛔ (rien n’est avant elle). **◀ Back** sur la
première question revient à l’écran Let's get to the Interview.

## Les questions {#the-questions}

| Étape | Question | Ce qu’elle règle | Réponse de Skynet |
|---|---|---|---|
| 1 | **US or Metric?** (réponse obligatoire) | Units : l’unité de chaque quantité, température et Recipe affichée. Skynet garde tous les nombres en métrique (règle 2.59) : changer ne modifie jamais un nombre enregistré | US |
| 2 | **What type of Brewer are you now?** (réponse obligatoire) | Six **cases à cocher** sur un seul écran : Extract Kit, Extract Brewer add Own Hops, BIAB (Brew in a Bag), All In One Brewer, All Grain, All Grain Mill own Grain. C’est votre Brewer Type. C’est simplement une aide pour que le Panel ressemble à VOTRE brasserie, et il ne limite aucun outil : même un brasseur débutant peut construire un système automatisé compliqué. Choisissez celui qui vous correspond le mieux, ou le niveau suivant si vous êtes prêt. Chaque Next porte le ⛔ tant qu’aucune case n’est cochée. La fenêtre No Recipe Found commence sur lui (règle 16.14) | All Grain |
| 3 Brewery | **Number of Hot Side Vessels** (nombre de cuves du côté chaud ; la première question Brewery, pour tous les Brewer Types) : une case où vous tapez un nombre entier de **1 à 6** (plus ne tiendrait pas sur un Tab avec des jauges lisibles). Comptez les Kettles, Mash Tuns et HLT, pas les fermenteurs. Les questions suivantes dépendent du nombre : 1, 2, ou 3 et plus. Pour l’instant la seule autre question Brewery est **How is the vessel heated?** (ci-dessous) ; les autres (All In One, sortie, pompe, combien de pompes, HERMS ou RIMS, All Grain Plus) sont dans Default settings | Avec les réponses de Default settings, elle calcule votre **Brewer Level**, de 1 Stove Top, One Pot, No Outlet jusqu’à 9 All Grain Plus | 7 Three Vessel |
| 3 Brewery | **How is the vessel heated?** (seulement avec 1 cuve) | Sept **cases à cocher** : No Boil Brewer, Electric Stove Top, Gas Stove Top, Hot Plate, Turkey Fryer, Brewery Gas Burner, Internal Electric Element. Aussi dans Default settings | pas réglé |
| 3 Brewery | **Single Vessel Brewer: Choose the Vessel that matches yours:** (seulement avec 1 cuve et **No Boil Brewer**) | Trois images de Skynet Vessel Templates, chacune avec des mots simples dessous : **Plain Pot** (marmite simple), **Pot with 1.5 TC Outlet** (marmite avec sortie TC 1,5), **Pot with NPT Outlet** (marmite avec sortie NPT). Cliquez sur celle qui ressemble à la vôtre (elle s’allume), puis **Next ▶**. **Other Skynet Template** ouvre tous les autres Skynet Vessel Templates, chacun avec ses mots simples dessous. Aussi dans Default settings | non réglé |
| 3 Brewery | **Electric Stove Top Brewer: Choose the Vessel that matches yours:** (seulement avec 1 cuve et **Electric Stove Top**) | Deux images de Skynet Vessel Templates avec des mots simples dessous : **Kettle on an Electric Stove** (marmite sur une cuisinière électrique) et **Kettle with a Ball Valve on an Electric Stove** (marmite avec une vanne à bille sur une cuisinière électrique). Cliquez sur celle qui ressemble à la vôtre, puis **Next ▶**. **Other Skynet Template** ouvre tous les autres. Aussi dans Default settings | non réglé |
| 3 Brewery | **Choose the Vessel that matches yours:** pour les autres façons de chauffer une cuve | **Gas Stove Top Brewer** : Kettle on a Gas Stove, Kettle with a Ball Valve on a Gas Stove. **Hot Plate Brewer** : Plain Pot, Pot with 1.5 TC Outlet, Pot with NPT Outlet. **Turkey Fryer Brewer** : les mêmes marmites et une Kettle with Outlet, Thermowell and Side Inlet. **Brewery Gas Burner Brewer** : Basic, Tall et Wide Kettles, Kettle with Bottom Drain, Kettle with Steam Slayer ; votre construction reçoit aussi un **Gas Burner** (brûleur) et un **Burner Igniter** (allumeur). **Internal Electric Element Brewer** : seulement les marmites avec un Element Port et un Thermowell ; votre construction reçoit aussi un **Heating Element** (résistance) et une **Temperature Probe** (sonde). Le but, à la fin de l’entretien, est de trouver la Sample Brewery qui correspond le mieux à vos réponses | non réglé |
| 3 Brewery | **Size of your Vessel: Measure the inside of your vessel:** (1 cuve, chaque façon de la chauffer, après la cuve) | Des cases pour le **diamètre intérieur** et la **hauteur intérieure** (pouces ou cm), le **volume annoncé** (celui de la vente) et le **Dead Space** (ce qui reste dedans) si vous le connaissez, en gallons ou litres. Une cuve à Internal Electric Element demande aussi la distance **du haut de la cuve jusqu’au haut de la résistance** : Skynet en calcule le **Safe Element Volume** (le liquide qui couvre la résistance, plus 1 pouce de marge). Skynet calcule le volume à partir du diamètre et de la hauteur et l’affiche pendant la saisie ; il dessine votre cuve à la bonne taille. Skip garde la taille du Template. Aussi dans Default settings | non réglé |
| 3 Brewery | **Vessel 1 of 2, puis Vessel 2 of 2** (2 cuves) | Pour chaque cuve, l’une après l’autre : **How is the vessel heated?** (cases à cocher : Electric Stove Top, Gas Stove Top, Hot Plate, Turkey Fryer, Brewery Gas Burner, Internal Electric Element, No Heat (une Mash Tun glacière) ; No Boil Brewer est seulement pour une cuve), **What is it used for?** (Boil Kettle (BK), Hot Liquor Tank (HLT), BK and HLT, Mash Tun (MLT)), **Does it have any of these?** (Tangential Inlet, Steam Slayer, Sparge Arm, Sight Glass, Bottom Drain with Skirt, Temperature Probe : cochez chacune de celles qu’elle a, ou aucune, et choisissez **Where on the vessel** se trouve chacune : les mêmes 10 emplacements à l’avant (Front) et à l’arrière (Back), de High Right à Low Left ; un Sight Glass est seulement à droite ou à gauche (Right ou Left) ; un Bottom Drain with Skirt est toujours dessous, au centre, donc rien à choisir. **📐 Vessel Layout** affiche une cuve exemple avec chaque emplacement, et ceux que vous avez cochés remplis), puis **Choose the Vessel that matches** (jusqu’à 6 images : seulement les cuves qui correspondent à l’usage, au chauffage et à chaque pièce cochée ; si aucune ne les a toutes, les plus proches, et la note le dit ; Other Skynet Template les a toutes) et la **taille** de cette cuve. Un Brewery Gas Burner ajoute un brûleur et un allumeur, un Internal Electric Element ajoute une résistance et une sonde. Aussi dans Default settings | non réglé |
| 3 Brewery | **Cold Side: Number of Fermentors** (tous les Brewer Types, après le Hot Side) | Une case pour un nombre entier de **1 à 9**. Puis pour chaque fermenteur, l’un après l’autre : **What kind of fermentor?** (une image au-dessus de chaque case : Plastic Bucket (là où la plupart commencent), Conical, Unitank, Stainless Bucket, Glass Carboy, Plastic Carboy, Corny Keg, Other (tout fermenteur absent de la liste : toutes les façons de le refroidir sont proposées), et sur une deuxième ligne Stainless Conical Bucket et Plastic Pressure Conical), puis **How is it cooled?** avec seulement les façons qui conviennent à ce type (Not Cooled, Fermentation Chamber, Peltier, Manual Ice Bath, Glycol Coil, Glycol Jacket ; Fermentation Chamber est toujours là). Aussi dans Default settings | non réglé |
| Default settings (pas demandée pour l’instant) | **Is your brewery a Piped Manifold?** | Oui : vos cuves et pompes sont reliées par des tuyaux fixes et des vannes, comme dans l’exemple 3 Vessel. Non : vous déplacez des tuyaux souples à la main. L’interrupteur **Piped Manifold** de Default settings | No |
| Default settings (pas demandée pour l’instant) | **Pipe size** et **Hose size** (seulement après Piped Manifold Oui) | La taille d’un nouveau tuyau rigide ou souple | 1/2" |
| 4 Other Defaults | **Brewery Name** (Patrons seulement) | Le nom en haut de chaque Tab | Skynet Panel |
| 4 Other Defaults | **Airport** | L’aéroport (code OACI, par exemple KDFW) dont le bulletin météo donne la pression de l’air pour la température d’ébullition. **Test** le récupère tout de suite | vide : air standard |
| 4 Other Defaults | **Elevation** | L’altitude de votre brasserie, en pieds (US) ou en mètres (Metric) ; gardée en mètres | vide |
| 5 Recipe Defaults | **Yeast Starter** | Pour information : PreBrew vous le rappelle un jour ou deux avant | No |
| 5 Recipe Defaults | **Batch Size** | La quantité de bière d’une nouvelle Recipe, dans le fermenteur, en gallons (US) ou en litres (Metric) ; gardée en litres | 5 gallons (18,9 litres) |
| 5 Recipe Defaults | **Mash Profile** (All Grain seulement) et **Boil Profile** | Les Profiles avec lesquels une nouvelle Recipe commence | Single Step, Batch Sparge et le Boil Profile de 60 minutes de Skynet |
| 6 Help Language | **Help language** | Anglais ou français pour les pages d’aide et les bulles, dans ce navigateur. Dès qu’une User Language est sur ce Brain (? Help > 🌐 Languages), elle est aussi un choix | English |

**Cases à cocher après Brewery** : chaque question à partir de 4 Other Defaults avec Oui/Non ou **jusqu’à 8** choix est en **cases à cocher** (Yeast Starter, Boil Profile, Help language, et Mash Profile tant qu’il a 8 choix ou moins) ; plus de 8 donne une **liste déroulante**. La fenêtre est assez large pour 8 cases à cocher sur une ligne. Un libellé peut aller jusqu’à 4 lignes. Cocher ne fait pas avancer : Next ▶ (ou Click to proceed) le fait, et il porte le ⛔ tant qu’aucune case n’est cochée. Ces questions ne sont pas obligatoires, donc **Skip** fonctionne, et la ligne « Skip keeps Skynet's answer » sous les cases dit ce que Skip garde. Les réponses tapées (Airport, Elevation, Batch Size) restent des champs à remplir.

L’étape Recipe Defaults règle seulement ce avec quoi une nouvelle Recipe commence. Un jour de brassage demande sa propre Recipe dans le
**Recipe Interview**.

## Les Brewer Levels {#the-brewer-levels}

Chaque niveau a tout ce qu’a le niveau du dessous. Les questions Brewery Vessels (dans l’entretien et dans Default settings) le calculent.

1. **Stove Top, One Pot, No Outlet** : une marmite sur la cuisinière ; vous versez ou siphonnez.
2. **Stove Top, One Pot, Manual Outlet** : une marmite avec une vanne à bille en bas sur le côté.
3. **Stove Top with Pump** : une marmite sur la cuisinière et une pompe.
4. **All In One** : une cuve électrique avec panier et pompe intégrés.
5. **Two Vessel, One Pump** : une Mash Tun (parfois une glacière) et une Kettle.
6. **Two Vessel, Two Pumps**.
7. **Three Vessel** : HLT, Mash Tun et Kettle, une pompe.
8. **Three Vessel, Recirculating** : HERMS ou RIMS, deux pompes, vannes motorisées.
9. **All Grain Plus** : trois cuves ou plus, fermenteurs régulés, vannes motorisées, une rampe d’eau du robinet (Supply Manifold).

Le New Schema Interview démarre un nouveau Tab de brassage sur le Level qui correspond à votre Brewer Level.

## Où les réponses sont gardées {#where-the-answers-are-kept}

Chaque réponse est aussi sur **☰ Menu > Default settings** (règle 2.42), la même valeur enregistrée : changez-la là à tout moment. La
langue de l’aide est aussi dans la fenêtre d’aide **?**. Relancer le Setup Interview commence sur vos réponses enregistrées et sur
la première question qui n’est pas verte ; il ne change rien avant ✔ Finish (ou Close, qui enregistre les réponses données).

**Le Brewery Build.** Les réponses Brewery (Number of Hot Side Vessels, How is the vessel heated?, Single Vessel Brewer et celles qui
suivent) sont aussi gardées ensemble comme votre **Brewery Build**, avec le Brewer Level qu’elles donnent. Seules les réponses qui
vont ensemble y entrent : avec trois cuves, How is the vessel heated? (une question pour une seule cuve) est laissée de côté. À la
fin de l’entretien, le Brewery Build sert à proposer les Templates qui correspondent à votre brasserie, ou à en construire un à partir
de vos réponses. Changer une réponse Brewery dans Default settings change aussi le Brewery Build.
