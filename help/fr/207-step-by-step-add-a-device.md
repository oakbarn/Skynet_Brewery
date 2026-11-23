# Pas à pas : ajouter un Device {#step-by-step-add-a-device}

Un **Device** est une chose câblée sur un Port (une broche) d'une de vos cartes : une pompe, une vanne, une résistance, une sonde, un interrupteur. Ce guide ajoute une nouvelle pompe au Tab **Brew House** de l'exemple 3 Vessel : une **Blichmann RipTide** appelée **Wort pump** sur le Port **D14** de la carte **Brewery Mega**. Tous les autres Devices s'ajoutent de la même façon.

> **⚠ Un nouveau Device est créé sur le 🔨 Build Tab, pas sur votre Tab.** Il y reste jusqu'à ce que vous appuyiez sur **✅ Finish Build ... > Move to Tab** (étape 10). Jusque-là, il n'est sur aucun de vos Tabs et il ne fait rien le jour de brassage. Ne vous arrêtez pas après **💾 Save**.

Seul un Admin peut ajouter un Device.

## Étape 1. Ouvrir Edit layout {#step-1-open-edit-layout}

Appuyez sur **☰ Menu** (en haut à droite), puis sur **✎ Edit layout**. La barre Edit layout s'ouvre au-dessus du Tab.

![☰ Menu : Edit layout](help_pictures/Step_Add_Device_01_Edit_Layout.png)

## Étape 2. Choisir le type de Device {#step-2-pick-the-kind-of-device}

Sur la barre Edit layout, choisissez le type dans **Select Device Type** (ici **Pumps**), puis le Device dans **Add Device** (ici **Pump, on / off (relay or SSR)**).

Les listes raccourcis à côté (**Pumps**, **Valves/Equipment**, **Probe**, **Heating Element**, **PWM**) font la même chose en un seul choix.

![Select Device Type et Add Device](help_pictures/Step_Add_Device_02_Device_Type.png)

Le **🔨 Build Tab** s'ouvre tout seul. Tout ce qui est nouveau y est d'abord créé, loin d'un Tab chargé (voir [Build Tab](55-build-tab)).

## Étape 3. Choisir le modèle {#step-3-pick-the-model}

Certains Devices demandent lequel vous avez. Pour une pompe, choisissez-la dans **Pick the pump** (ici **Blichmann Riptide**). Son image vient avec.

![Pick the pump](help_pictures/Step_Add_Device_03_Pick.png)

## Étape 4. 1. Label {#step-4-1-label}

Tapez le **Label** : le nom que vous lui donnez, en mots simples, par exemple **Wort pump**. **Label Visible** montre le Label sur le Tab ; il est d'abord éteint.

![1. Label](help_pictures/Step_Add_Device_04_Label.png)

## Étape 5. 2. Interface et Port {#step-5-2-interface-and-port}

**2. Interface** est la carte sur laquelle il est câblé (ici **BM: Brewery Mega**). **Available Ports** ne liste que les Ports libres qui conviennent à ce Device. Choisissez celui sur lequel il est câblé (ici **D14**).

Une case vous demande de les vérifier : **une fois confirmés, l'Interface et le Port ne peuvent plus être changés.** Appuyez sur **✔ Confirm**, ou sur **◀ Back** pour choisir à nouveau.

![Review: Interface and Port](help_pictures/Step_Add_Device_05_Port.png)

Pas encore de carte ? **➕ Add new Interface…** dans la liste en crée une et revient (voir [Interfaces](76-interfaces)).

## Étape 6. 3. Tab et 4. Name {#step-6-3-tab-and-4-name}

**3. Tab** est le Tab où il ira quand la construction sera finie (ici **BH: Brew House**). **➕ Add new Tab…** crée un nouveau Tab et revient.

**4. Name** se remplit tout seul : la carte, le Port, le type, le Label et le Tab, par exemple `BM_14_DO@Pump_Wort~pump_BH`. Gardez-le, ou tapez le vôtre (voir [Interface, Tab and Device names](46-interface-tab-device-names)).

![3. Tab et 4. Name](help_pictures/Step_Add_Device_06_Tab_Name.png)

## Étape 7. Regarder le reste, puis Add Device {#step-7-look-over-the-rest-then-add-device}

Le reste de la case contient les réglages propres au Device (pour une pompe : Pump Profile, Orientation, Hose or Pipe, Cover, Overlay, les IP Fittings et sa place). Chacun a une Hover Help : gardez la souris sur son nom. Vous pouvez tous les changer plus tard.

Appuyez sur **➕ Add Device**.

![Add Device](help_pictures/Step_Add_Device_07_Add_Device.png)

## Étape 8. Ses Properties, puis Save {#step-8-its-properties-then-save}

Le Device est créé sur le 🔨 Build Tab et ses **Properties** s'ouvrent. Changez ce que vous voulez, puis appuyez sur **💾 Save**.

![Properties : Save](help_pictures/Step_Add_Device_08_Properties.png)

## Étape 9. Il est sur le Build Tab : le placer {#step-9-it-is-on-the-build-tab-place-it}

Le nouveau Device est sur le 🔨 Build Tab. Le dessin pâle derrière lui est le Tab où il ira (le **Watermark**, « Goes to: Brew House »). Faites-le glisser à l'endroit voulu : **sa place sur le Build Tab est sa place sur son Tab.** **👁 Preview** montre à quoi il ressemblera le jour de brassage.

**Il n'est pas encore sur Brew House.** Appuyez sur **✅ Finish Build ...**.

![Le Build Tab : Finish Build](help_pictures/Step_Add_Device_09_Build_Tab.png)

## Étape 10. ✅ Finish Build ... > Move to Tab {#step-10-finish-build-move-to-tab}

La case **Finish Build** demande où il doit aller. Sous **Move to Tab**, le Tab choisi à l'étape 6 est déjà choisi (**Brew House**). Appuyez sur **Move to Tab**.

![Finish Build : Move to Tab](help_pictures/Step_Add_Device_10_Finish_Build.png)

Tout ce qui est sur le Build Tab va sur ce Tab, et le Build Tab se ferme. Les autres choix : **As a Template** (pas pour les Devices), **Throw it away** (le supprime et libère son Port), **Keep building**.

## Étape 11. Save layout {#step-11-save-layout}

Vous êtes sur le Tab Brew House. La nouvelle pompe est à sa place et **brille en rouge jusqu'à ce que vous cliquiez dessus**, pour qu'on la trouve facilement. Appuyez sur **Save layout** pour la garder.

![Save layout](help_pictures/Step_Add_Device_11_Save_Layout.png)

## Étape 12. C'est fait {#step-12-done}

Appuyez sur **Exit** pour quitter Edit layout. La Wort pump est sur le Tab Brew House.

![La nouvelle pompe sur Brew House](help_pictures/Step_Add_Device_12_Done.png)

Ce qu'il reste à faire :

1. **Tracer ses tuyaux ou ses tuyaux souples** : **🛠 Build (Edit layout) > Draw pipe** ([Tuyaux et tuyaux souples](24-pipes-and-hoses)).
2. **La changer quand vous voulez** : dans Edit layout, double-cliquez dessus pour ouvrir ses Properties.

## Si vous vous êtes arrêté avant Finish Build {#if-you-stopped-before-finish-build}

Une construction pas finie n'est jamais perdue : elle est gardée sur le Brain, elle ne tourne jamais, et son Port reste pris. La prochaine fois que vous ouvrez **Edit layout**, elle revient sur le 🔨 Build Tab avec une note. Appuyez sur **✅ Finish Build ...** pour l'envoyer sur son Tab, ou sur **🗑 Discard Build** pour la jeter. Voir [Saving never ends the Build](55-build-tab#saving-never-ends-the-build).

Plus : [Devices et cartes](03-devices), [Build Tab](55-build-tab), [Pump Device Properties](115-pump-device-properties), [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget).
