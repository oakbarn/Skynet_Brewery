# Nouveau Schema à partir d'un Skynet Template {#new-schema-from-a-skynet-template}

Répondez à quelques questions, et Skynet crée tout un nouveau Schema prêt à brasser : le Tab Brew House avec ses cuves, vannes, pompes, refroidisseur et Supply Manifold, un Tab Fermentor, chaque Device sur un Port libre de **votre propre** Interface, et le Brew Process avec chaque tâche choisie et le Brew Day construit (Règle Skynet 16.6).

Appuyez sur **☰ Menu > ➕ New Schema…** (ou choisissez **Add new Schema** dans la liste déroulante **Schema**), donnez-lui un nom, et réglez **Start from** sur **A Skynet Schema Template**. (**A copy of** du Schema ouvert est toujours là aussi, pour partir du vôtre.) Nouveau ici ? [Step by Step: Add a Schema](188-step-by-step-add-a-schema) montre chaque étape avec des images.

## 1. Choisir un Brew House Tab Template {#1-pick-a-brew-house-tab-template}

| Template | Ce qu'il contient | Process Templates utilisés |
|---|---|---|
| **1 Vessel** | Une cuve électrique qui chauffe, empâte dans un panier à grains et fait bouillir (comme une BrewZilla ou une Grainfather). Pas de pompe. | ceux pour 1 Vessel |
| **1 Vessel + 1 Pump** | La même, avec une pompe qui fait recirculer la maische, fait le whirlpool et remplit le fermenteur. | ceux pour 1 Vessel |
| **2 Vessel + 1 Pump** | Une cuve qui chauffe l'eau d'empâtage et de rinçage puis fait bouillir, et une cuve d'empâtage. Une pompe fait toutes les tâches. | ceux pour 2 Vessel |
| **2 Vessel + 2 Pumps** | Le même, avec une pompe de maische et une pompe de cuve d'ébullition. | ceux pour 2 Vessel |
| **3 Vessel** | Cuve d'eau chaude (avec un serpentin HERMS), cuve d'empâtage et cuve d'ébullition, une pompe de maische et une pompe de cuve d'ébullition. Le dernier Template côté chaud. | ceux de Skynet |
| **OakBarn Brewery** | Toutes les cuves et pompes de l'OakBarn Brewery : Radiator, Big Mac, Mash Tun, Brew Kettle, Little Mac, la Brewzilla 65 L et la DigiBoil (toutes deux [réglées à la main](158-digiboil-and-brewzilla)), et les pompes Red, Yellow, Green, Blue et White. Enlevez ce que vous n'avez pas. | ceux de Skynet |
| **Fermentor** | Seul : seulement un Tab Fermentor, et un Brew Process qui ne fait que fermenter. | Ferment |

Choisissez ensuite l'**Interface** (votre carte). Chaque Device prend le Port libre suivant. Le nouveau Schema démarre en **Simulator Mode** : rien de réel n'est commandé avant que vous appuyiez sur **🔌 Real**.

## 2. Les questions {#2-the-questions}

- **Chaque cuve** : un Vessel Template, ou un type général (HLT, Mash Tun, Brew Kettle, All In One) en bas de la liste. Et sa chauffe : électrique (une résistance), gaz (un brûleur sur une vanne de gaz) ou aucune.
- **Pompes** : le nombre propre au Template au départ.
- **Recirculation de la maische** : aucune, un RIMS tube, ou un serpentin HERMS dans la HLT.
- **Refroidisseur** : à immersion, à plaques ou à contre-courant. Une sonde **Wort out** (sortie du moût) y est mise, pour que le refroidissement sache quand s'arrêter.
- **Whirlpool pendant le refroidissement** : le Brew Day utilise **Whirlpool and Chill** au lieu de **Chill**.
- **Vannes** : vannes à main (Skynet vous demande de les tourner) ou une vanne motorisée sur chaque sortie de cuve (et l'eau du refroidisseur).
- **Supply Manifold** : aucun, un Long Tee with a Valve, un Double ou un Triple, avec des vannes manuelles ou motorisées.
- **Fermenteurs** : combien vont sur le Tab **Fermentor**. Chacun a sa sonde de température et une vanne de **glycol** qui s'ouvre au-dessus de la température de fermentation. Le Fermentor 1 fait les tâches de l'étape Ferment.

Chaque question part de **☰ Menu > Default settings > New Schema from a Skynet Template**, donc réglez-y une fois vos réponses habituelles.

## 3. Prêt à créer {#3-ready-to-make}

La dernière page liste ce qui va sur chaque Tab et chaque Device avec son nom et son Port. Appuyez sur **Save** : le Schema est créé et chargé, et le Brew Day est construit.

Les tuyaux ne sont pas dessinés : reliez le matériel comme le vôtre l'est vraiment (Edit layout > Draw pipe).

## Choisir une tâche en cliquant dessus {#pick-a-job-by-clicking-it}

Dans **☰ Menu > Brew Process**, chaque tâche a **🎯 Click it on the Tab**. Il va sur le Tab, éclaire les éléments qui conviennent à cette tâche (les pompes pour une tâche de pompe) et grise le reste. Cliquez sur celui qui fait la tâche, et la page Brew Process revient avec lui choisi. Appuyez sur **💾 Save** pour le garder. **Cancel** ou **Échap** revient sans rien changer. La liste à côté marche toujours, pour une brasserie avec beaucoup de vannes.
