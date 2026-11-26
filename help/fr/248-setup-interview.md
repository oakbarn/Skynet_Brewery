# Setup Interview (Entretien de configuration) {#setup-interview}

Le **Setup Interview** règle vos paramètres Skynet, une question à la fois (règle Skynet 2.75). Il s’ouvre tout seul la première fois
qu’un Admin ouvre une nouvelle installation (aucun paramètre Skynet encore enregistré), avant la page de bienvenue qui propose un
Schema d’exemple. Un Admin peut le relancer à tout moment depuis **☰ Menu > 🧭 Setup Interview**.

## Comment ça marche {#how-it-works}

- Une question par page, avec une courte explication dessous. La bande d’étapes en haut montre où vous en êtes, en 6 étapes :
  **1. Units · 2. Help language · 3. Brewer Type · 4. Brewery · 5. Recipes · 6. Other Defaults**, puis Done.
- **◀ Back** revient à la question précédente. **Next ▶** garde votre réponse et continue. Un choix de 6 ou moins est une case : un
  clic le choisit et continue. Un choix de plus de 6 est une liste déroulante (règle 2.6).
- Il faut répondre aux étapes 1 à 3, elles n’ont donc pas de Skip : **US or Metric** (toujours la première question),
  **Help language** et **Brewer Type**.
- Les étapes 4 **Brewery**, 5 **Recipes** et 6 **Other Defaults** sont des branches. Chacune s’ouvre sur une page qui liste ce
  qu’elle demande. **Next ▶** la commence. **Skip** sur cette page saute toute la branche et garde les réponses de Skynet. Dans une
  branche, chaque question a son propre **Skip**.
- **Skip** garde la réponse de Skynet et continue. Skynet ne vous le rappelle pas plus tard.
- Chaque page commence sur la réponse de Skynet (ou sur votre réponse enregistrée quand vous le relancez) : Next, Next, Next donne un
  panneau qui fonctionne.
- La dernière page, **Done**, montre toutes les réponses. **✎** revient à cette question. **✔ Finish** les enregistre toutes.
- **Close** ou **✕** arrête l’entretien sans rien enregistrer. Sur une nouvelle installation, il s’ouvre de nouveau la prochaine fois
  que le panneau s’ouvre.

La première page porte un seul avertissement : concevez votre brasserie sur un ordinateur, pas sur un téléphone ou une tablette, car
l’écran est trop petit. Un téléphone ou une tablette convient pour suivre et mener un jour de brassage.

## Les questions {#the-questions}

| Étape | Question | Ce qu’elle règle | Réponse de Skynet |
|---|---|---|---|
| 1 | **US or Metric?** (réponse obligatoire) | Units : l’unité de chaque quantité, température et Recipe affichée. Skynet garde tous les nombres en métrique (règle 2.59) : changer ne modifie jamais un nombre enregistré | US |
| 2 | **Help language** (réponse obligatoire) | Anglais ou français pour les pages d’aide et les bulles, dans ce navigateur. Dès qu’une User Language est sur ce Brain (? Help > 🌐 Languages), elle est aussi un choix | English |
| 3 | **What is the highest level you will brew now?** (réponse obligatoire) | Votre Brewer Type : Extract Can Kit, Extract Partial Grain and Hops ou All Grain. C’est juste pour commencer : Skynet grandit avec vous. La fenêtre No Recipe Found commence sur lui (règle 16.14) | All Grain |
| 3 | **Do you grind your own grain?** (seulement après All Grain) | Oui : All Grain (own Grain Mill) | No |
| 4 Brewery | **Brewer Level** | Sur quoi vous brassez, ou ce que vous construisez, de 1 Stove Top, One Pot, No Outlet jusqu’à 9 All Grain Plus | 7 Three Vessel |
| 4 Brewery | **Pipe size** et **Hose size** | La taille d’un nouveau tuyau rigide ou souple | 1/2" |
| 5 Recipes | **Yeast Starter** | Pour information : PreBrew vous le rappelle un jour ou deux avant | No |
| 5 Recipes | **Batch Size** | La quantité de bière d’une nouvelle Recipe, dans le fermenteur, en gallons (US) ou en litres (Metric) ; gardée en litres | 5 gallons (18,9 litres) |
| 5 Recipes | **Mash Profile** (All Grain seulement) et **Boil Profile** | Les Profiles avec lesquels une nouvelle Recipe commence | Single Step, Batch Sparge et le Boil Profile de 60 minutes de Skynet |
| 6 Other Defaults | **Brewery Name** (Patrons seulement) | Le nom en haut de chaque Tab | Skynet Panel |
| 6 Other Defaults | **Airport** | L’aéroport (code OACI, par exemple KDFW) dont le bulletin météo donne la pression de l’air pour la température d’ébullition. **Test** le récupère tout de suite | vide : air standard |
| 6 Other Defaults | **Elevation** | L’altitude de votre brasserie, en pieds (US) ou en mètres (Metric) ; gardée en mètres | vide |

L’étape Recipes règle seulement ce avec quoi une nouvelle Recipe commence. Un jour de brassage demande sa propre Recipe dans le
**Recipe Interview**.

## Les Brewer Levels {#the-brewer-levels}

Chaque niveau a tout ce qu’a le niveau du dessous. Vous pouvez toujours choisir un niveau plus bas.

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
langue de l’aide est aussi dans la fenêtre d’aide **?**. Relancer le Setup Interview commence sur vos réponses enregistrées et ne
change rien avant ✔ Finish.
