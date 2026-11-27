# Setup Interview (Entretien de configuration) {#setup-interview}

Le **Setup Interview** règle vos paramètres Skynet, une question à la fois (règle Skynet 2.75). Il s’ouvre tout seul la première fois
qu’un Admin ouvre une nouvelle installation (aucun paramètre Skynet encore enregistré), avant la page de bienvenue qui propose un
Schema d’exemple. Un Admin peut le relancer à tout moment depuis **☰ Menu > 🧭 Setup Interview**.

## Comment ça marche {#how-it-works}

Les boutons, le titre et la bande d’étapes restent figés en haut : seule la page dessous défile.

- Une question par page, avec une courte explication dessous. La bande d’étapes en haut montre où vous en êtes, en 6 étapes :
  **1. Units · 2. Brewer Type · 3. Brewery · 4. Other Defaults · 5. Recipe Defaults · 6. Help Language**, puis Done.
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
- **Chaque réponse est enregistrée dès que vous la donnez** (Next, ou un clic sur un choix), sur le Brain, comme un gGlobal : elle
  reste même si votre ordinateur est éteint. Relancez l’entretien et il s’ouvre sur la première question sans réponse.
- La dernière page, **Done**, montre toutes les réponses. **✎** revient à cette question. **✔ Finish** les enregistre toutes.
- **Close** ou **✕** :
  - sur chaque écran, la page de bienvenue aussi, ils portent le signe ⛔ sens interdit et ne font rien tant que 1. Units et
    2. Brewer Type n’ont pas de réponse (Échap ne fait rien non plus).
  - ensuite, quand certaines questions ne sont pas encore vertes, une fenêtre **bleue** dit : elles ont besoin d’une réponse ; régler
    Skynet dépend des réponses à beaucoup de ces questions pour qu’il soit vraiment le vôtre, mais il fonctionne avec seulement les 2
    premières questions. **◀ Keep answering** revient ; **Close** enregistre les réponses données et ferme. Relancez-le depuis
    ☰ Menu pour répondre au reste.

## Les trois premiers écrans {#the-first-three-screens}

Chaque passage commence par trois écrans avant la première question. **Next ▶** (en haut, ou après **Click to proceed:**) ou
**Skip** continue ; **◀ Back** revient à l’écran précédent.

1. **Welcome** (bienvenue) : voir plus bas.
2. **Le guide des boutons** : chaque bouton du haut, tel qu’il apparaît, et ce qu’il fait, avec ceux marqués ⛔ (Skip et Next ▶ sur
   1. Units et 2. Brewer Type tant qu’ils n’ont pas de réponse ; Close et ✕ tant que 1 et 2 n’ont pas de réponse).
3. **Comment répondre** : on répond aux questions de deux façons. La première est une **case à cocher** (« Are you a morning
   person? »), montrée avant et après un clic ; vous pouvez essayer la première ligne.

## La page de bienvenue {#the-welcome-page}

L’entretien s’ouvre toujours sur une page **Welcome** (bienvenue). Son encadré bleu est la seule note sur
les téléphones et les petits écrans : Skynet peut être commandé depuis presque n’importe quel appareil doté d’un navigateur et d’une
connexion Internet, mais il est bien plus facile de concevoir sur un ordinateur, car les détails fins sont difficiles à voir sur un
petit écran. En dessous, la page explique ce qu’est l’entretien : rien n’est gravé dans le marbre, chaque réponse peut être changée à
tout moment dans **☰ Menu > Default settings**, et vous pouvez relancer l’entretien depuis ☰ Menu. Son **◀ Back** porte le ⛔ (rien n’est avant elle). **◀ Back** sur la
première question revient à l’écran Comment répondre.

## Les questions {#the-questions}

| Étape | Question | Ce qu’elle règle | Réponse de Skynet |
|---|---|---|---|
| 1 | **US or Metric?** (réponse obligatoire) | Units : l’unité de chaque quantité, température et Recipe affichée. Skynet garde tous les nombres en métrique (règle 2.59) : changer ne modifie jamais un nombre enregistré | US |
| 2 | **What is the highest level you will brew now?** (réponse obligatoire) | Votre Brewer Type : Extract Can Kit, Extract Partial Grain and Hops ou All Grain. C’est juste pour commencer : Skynet grandit avec vous. La fenêtre No Recipe Found commence sur lui (règle 16.14) | All Grain |
| 2 | **Do you grind your own grain?** (seulement après All Grain) | Oui : All Grain (own Grain Mill) | No |
| 3 Brewery | **Brewery Vessels** : combien de cuves de brassage, puis (selon la réponse) All In One, sortie, pompe, combien de pompes, HERMS ou RIMS, All Grain Plus | Elles calculent votre **Brewer Level**, de 1 Stove Top, One Pot, No Outlet jusqu’à 9 All Grain Plus | 7 Three Vessel |
| 3 Brewery | **Is your brewery a Piped Manifold?** | Oui : vos cuves et pompes sont reliées par des tuyaux fixes et des vannes, comme dans l’exemple 3 Vessel. Non : vous déplacez des tuyaux souples à la main. L’interrupteur **Piped Manifold** de Default settings | No |
| 3 Brewery | **Pipe size** et **Hose size** (seulement après Piped Manifold Oui) | La taille d’un nouveau tuyau rigide ou souple | 1/2" |
| 4 Other Defaults | **Brewery Name** (Patrons seulement) | Le nom en haut de chaque Tab | Skynet Panel |
| 4 Other Defaults | **Airport** | L’aéroport (code OACI, par exemple KDFW) dont le bulletin météo donne la pression de l’air pour la température d’ébullition. **Test** le récupère tout de suite | vide : air standard |
| 4 Other Defaults | **Elevation** | L’altitude de votre brasserie, en pieds (US) ou en mètres (Metric) ; gardée en mètres | vide |
| 5 Recipe Defaults | **Yeast Starter** | Pour information : PreBrew vous le rappelle un jour ou deux avant | No |
| 5 Recipe Defaults | **Batch Size** | La quantité de bière d’une nouvelle Recipe, dans le fermenteur, en gallons (US) ou en litres (Metric) ; gardée en litres | 5 gallons (18,9 litres) |
| 5 Recipe Defaults | **Mash Profile** (All Grain seulement) et **Boil Profile** | Les Profiles avec lesquels une nouvelle Recipe commence | Single Step, Batch Sparge et le Boil Profile de 60 minutes de Skynet |
| 6 Help Language | **Help language** | Anglais ou français pour les pages d’aide et les bulles, dans ce navigateur. Dès qu’une User Language est sur ce Brain (? Help > 🌐 Languages), elle est aussi un choix | English |

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
