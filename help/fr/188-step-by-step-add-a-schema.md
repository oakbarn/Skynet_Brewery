# Pas à pas : ajouter un Schema {#step-by-step-add-a-schema}

Un **Schema** est toute votre brasserie dans Skynet : ses Tabs, ses cartes (Interfaces), ses Devices et Widgets, ses tuyaux et ses Processes. Vous pouvez garder plusieurs Schemas et charger celui que vous voulez. En créer un nouveau ne change jamais les Schemas que vous avez déjà.

Ce guide vous mène de rien à un nouveau Schema à l'écran. Seul un Admin peut ajouter un Schema.

## Étape 1. Ouvrir la case Add new Schema {#step-1-open-the-add-new-schema-box}

Appuyez sur **☰ Menu** (en haut à droite), puis **➕ New Schema…**, juste sous **🗂 Schema**.

![☰ Menu : New Schema](help_pictures/Step_Add_Schema_01_Menu.png)

Deux autres façons ouvrent la même case :

- **☰ Menu > 🗂 Schema**, puis le grand bouton **➕ New Schema**. **❓ Step by step** à côté ouvre cette page.
- La liste déroulante **Schema** (sur la Menu Bar, le Tab Schema ou le Tab About), puis **Add new Schema ...** vers le bas de la liste.

![Le Tab Schema : bouton New Schema](help_pictures/Step_Add_Schema_02_Schema_Tab.png)

Si vous êtes en **Edit layout**, enregistrez-le ou quittez-le d'abord.

## Étape 2. Lui donner un nom {#step-2-give-it-a-name}

Tapez un nom qui a du sens pour vous, par exemple **My Brewery** ou **Hot Side**. Les espaces sont permises. Vous pouvez le renommer plus tard (liste Schema > **Rename this Schema ...**).

![Add new Schema : le nom](help_pictures/Step_Add_Schema_03_Add_New_Schema.png)

## Étape 3. Choisir d'où il part {#step-3-pick-where-it-starts-from}

**Start from** a trois choix :

![Start from : les trois choix](help_pictures/Step_Add_Schema_04_Start_From.png)

| Choix | Choisissez-le quand |
|---|---|
| **A Skynet Schema Template** | Vous débutez, ou votre brasserie est une installation courante à 1, 2 ou 3 cuves. Répondez à quelques questions et Skynet construit pour vous les Tabs, les Devices et tout le Brew Day. **La façon la plus facile de commencer.** Allez à l'étape 4. |
| **An empty Schema** | Vous voulez construire chaque partie vous-même. Vous recevez un Main Tab vide, le Tab Equipment et une carte simulée. Allez à l'étape 5. |
| **A copy of** du Schema chargé | Vous voulez essayer des changements sans toucher au Schema avec lequel vous brassez. Appuyez sur **Save**, et c'est fini. |

Appuyez sur **💾 Save**. Skynet demande s'il peut charger le nouveau Schema : chaque sortie est d'abord arrêtée, et le Schema que vous aviez reste tel quel. Appuyez sur **OK**.

## Étape 4. Un Skynet Schema Template {#step-4-a-skynet-schema-template}

**4a. Le Template, la carte et le Tab.** Choisissez le **Brew House Tab Template** qui ressemble le plus à votre brasserie (1 Vessel, 1 Vessel + 1 Pump, 2 Vessel + 1 Pump, 2 Vessel + 2 Pumps, 3 Vessel, ou Fermentor seulement). Choisissez votre **Interface** (votre carte) : chaque Device prend le Port libre suivant. Gardez le nom de Tab **Brew House** ou tapez le vôtre. Appuyez sur **💾 Save**.

![Le Template, la carte et le Tab](help_pictures/Step_Add_Schema_05_Template.png)

**4b. Les questions.** Chaque cuve et sa façon d'être chauffée, les pompes, la recirculation de la maische, le refroidisseur, les vannes, le Supply Manifold et le nombre de fermenteurs. Chacune a déjà une réponse : ne changez que ce qui est différent dans votre brasserie. Posez la souris sur le nom d'une case pour son aide. Appuyez sur **💾 Save**.

![Les questions du Template 3 Vessel](help_pictures/Step_Add_Schema_06_Questions.png)

**4c. Vérifier.** Skynet liste ce qu'il va créer : les cuves sur chaque Tab, et chaque Device avec son nom et son Port. Appuyez sur **💾 Save** pour le créer, ou **✖ Cancel** pour arrêter (rien n'est créé).

![Prêt à créer](help_pictures/Step_Add_Schema_07_Ready.png)

**4d. Fini.** Le nouveau Schema est chargé, en mode **🧪 Simulator** : rien de réel n'est commandé avant que vous appuyiez sur **🔌 Real**. Ses cuves, sondes, résistances et pompes sont sur le Tab Brew House, et ses fermenteurs sur le Tab Fermentor.

![Le nouveau Schema](help_pictures/Step_Add_Schema_08_Done.png)

Ce qu'il reste à faire :

1. **Dessiner les tuyaux** comme sont les vôtres : **☰ Menu > Edit layout > Draw pipe** ([Tuyaux, tuyaux souples et réducteurs](24-pipes-and-hoses)).
2. **Vérifier chaque tâche** du Brew Day dans **☰ Menu > Brew Process** ([Processus de brassage](100-brew-process)).
3. Essayer tout un Brew Day dans le simulateur avec **▶ Start Brew Day**.

Plus sur chaque question : [Nouveau Schema à partir d'un Skynet Template](157-schema-templates).

## Étape 5. Un Schema vide {#step-5-an-empty-schema}

**5a. Mode simulateur.** Votre nouveau Schema a une carte simulée, un Arduino Mega appelé **New_Mega_2560_1**, et le panneau est en mode Simulator, donc rien de réel n'est commandé. Appuyez sur **✔ OK**.

![Vous êtes maintenant en mode Simulator](help_pictures/Step_Add_Schema_09_Simulator.png)

**5b. Votre carte.** La case de cette carte s'ouvre. Donnez-lui un **Name** qui a du sens pour vous (**✏ Change name**), par exemple **Hot_Side**, et un **Interface ID** de 1 à 4 lettres, par exemple **HS**. L'Interface ID commence le nom de chaque Device de cette carte. Choisissez la **Board** que vous avez. Laissez **Connection** sur **Simulator** jusqu'à ce que la carte soit branchée. Appuyez sur **💾 Save**.

![Votre nouvelle Interface](help_pictures/Step_Add_Schema_10_Interface.png)

Plus sur les cartes : [Interfaces](76-interfaces) et [Simulateur ou vraies cartes](77-simulator-or-real-boards).

**5c. Ajouter vos premières choses.** Le Main Tab est vide. Appuyez sur **☰ Menu > ✎ Edit layout**. La barre du haut a un bouton pour chaque sorte de chose : **Vessel**, **Pumps**, **Valves**, **Probe**, **Heating Element** et plus. Choisissez-en un et remplissez sa case : le Label (comment vous l'appelez), l'Interface (votre carte), le Port auquel il est câblé, et le Tab. Puis **Save layout**.

![La barre Edit layout](help_pictures/Step_Add_Schema_11_Edit_Layout.png)

Plus : [Barre Edit layout](82-edit-layout-bar), [Ajouter une cuve](66-add-a-vessel) et [Chaque fenêtre de Device ressemble à celle de la pompe](148-every-device-dialog).

## Revenir à votre ancien Schema {#going-back-to-your-old-schema}

Choisissez-le dans la liste déroulante **Schema**. Chaque Schema reste sur le Brain jusqu'à ce que vous le supprimiez ([Changer de Schema et cloner des Schemas](48-schema-switching-and-cloning)).
