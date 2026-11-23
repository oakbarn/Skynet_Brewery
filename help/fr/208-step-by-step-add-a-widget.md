# Pas à pas : ajouter un Widget {#step-by-step-add-a-widget}

Un **Widget** n'existe que dans l'application : il n'est câblé sur aucune carte, donc il n'a ni Interface ni Port. Les images, les textes, les interrupteurs, les minuteries, les alarmes, les raccords et la Manual Valve sont des Widgets. Ce guide ajoute un **Hose Bib** (le robinet extérieur en laiton, un Widget Tap Water Valve) appelé **Garden hose** au Tab **Brew House** de l'exemple 3 Vessel. Tous les autres Widgets s'ajoutent de la même façon.

> **⚠ Un nouveau Widget est créé sur le 🔨 Build Tab, pas sur votre Tab.** Il y reste jusqu'à ce que vous appuyiez sur **✅ Finish Build ... > Move to Tab** (étape 8). Jusque-là, il n'est sur aucun de vos Tabs. Ne vous arrêtez pas après **💾 Save**.

Seul un Admin peut ajouter un Widget.

## Étape 1. Ouvrir Edit layout {#step-1-open-edit-layout}

Appuyez sur **☰ Menu** (en haut à droite), puis sur **✎ Edit layout**. La barre Edit layout s'ouvre au-dessus du Tab.

![☰ Menu : Edit layout](help_pictures/Step_Add_Device_01_Edit_Layout.png)

## Étape 2. Choisir le type de Widget {#step-2-pick-the-kind-of-widget}

Sur la barre Edit layout, choisissez le type dans **Select Widget Type** (ici **Boolean Widgets (Switch, Slider, Checkbox, buttons, LED) and the Manual Valve**), puis le Widget dans **Add Widget** (ici **Tap Water Valve (household hose bib Manual Valve Widget)**).

Les boutons **➕** de la barre (**Picture ➕**, **Text ➕**, **Manual Valve ➕**, **Value ➕** ...) font la même chose en un clic.

![Select Widget Type et Add Widget](help_pictures/Step_Add_Widget_02_Widget_Type.png)

## Étape 3. Il est créé, et ses Properties s'ouvrent {#step-3-it-is-made-and-its-properties-open}

Le **🔨 Build Tab** s'ouvre tout seul, le Widget y est créé, et ses **Properties** s'ouvrent. Un Widget n'a pas de case Add : il n'y a pas de Port à choisir, donc il est créé tout de suite avec un nom comme `wgt_TWV_tap_water_1`.

![Les Properties du Hose Bib Widget](help_pictures/Step_Add_Widget_03_Properties.png)

## Étape 4. 1. Label {#step-4-1-label}

Tapez le **Label** : le nom que vous lui donnez, en mots simples, par exemple **Garden hose**. **Label Visible** montre le Label sur le Tab ; il est d'abord éteint.

![1. Label](help_pictures/Step_Add_Widget_04_Label.png)

## Étape 5. 3. Name {#step-5-3-name}

Le **Suggested Name** sous le Name suit le Label. Pour l'utiliser, appuyez sur **🏷 Update to Suggested Name** : il va dans la case **Change Name**. Puis appuyez sur **✏ Change Name**. Ou tapez votre propre nom dans **Change Name** et appuyez sur **✏ Change Name**. Voir [Interface, Tab and Device names](46-interface-tab-device-names).

![Change Name](help_pictures/Step_Add_Widget_05_Name.png)

## Étape 6. 2. Tab, puis Save {#step-6-2-tab-then-save}

Laissez **2. Tab** sur **Build Tab** pour l'instant : vous choisissez son Tab à l'étape 8. Regardez le reste (Orientation, Hose or Pipe, Cover, Overlay, les IP Fittings et sa place) ; chacun a une Hover Help. Appuyez sur **💾 Save**.

![2. Tab et Save](help_pictures/Step_Add_Widget_06_Save.png)

Si vous choisissez votre Tab dans **2. Tab** ici à la place, **💾 Save** l'envoie directement sur ce Tab, sans Finish Build.

## Étape 7. Il est sur le Build Tab {#step-7-it-is-on-the-build-tab}

Le nouveau Widget est sur le 🔨 Build Tab (un Hose Bib est petit : cherchez-le). **👁 Preview** montre à quoi il ressemblera le jour de brassage.

**Il n'est pas encore sur Brew House.** Appuyez sur **✅ Finish Build ...**.

![Le Build Tab : Finish Build](help_pictures/Step_Add_Widget_07_Build_Tab.png)

## Étape 8. ✅ Finish Build ... > Move to Tab {#step-8-finish-build-move-to-tab}

La case **Finish Build** demande où il doit aller. Sous **Move to Tab**, choisissez le Tab (ici **Brew House**) et appuyez sur **Move to Tab**.

![Finish Build : Move to Tab](help_pictures/Step_Add_Widget_08_Finish_Build.png)

Tout ce qui est sur le Build Tab va sur ce Tab, et le Build Tab se ferme. Les autres choix : **As a Template** (pas pour les Widgets), **Throw it away**, **Keep building**.

## Étape 9. Le faire glisser à sa place {#step-9-drag-it-to-its-place}

Aucun Tab n'avait été choisi pour lui avant, donc il arrive **au milieu du Tab** et **brille en rouge jusqu'à ce que vous cliquiez dessus**. Faites-le glisser à sa place.

![Il arrive au milieu du Tab](help_pictures/Step_Add_Widget_09_Drag.png)

## Étape 10. Save layout {#step-10-save-layout}

Appuyez sur **Save layout** pour le garder.

![Save layout](help_pictures/Step_Add_Widget_10_Save_Layout.png)

## Étape 11. C'est fait {#step-11-done}

Appuyez sur **Exit** pour quitter Edit layout. Le Garden hose est sur le Tab Brew House.

![Le nouveau Hose Bib sur Brew House](help_pictures/Step_Add_Widget_11_Done.png)

Ce qu'il reste à faire :

1. **Tracer son tuyau souple ou son tuyau** : **🛠 Build (Edit layout) > Draw hose** ([Tuyaux et tuyaux souples](24-pipes-and-hoses)).
2. **Le changer quand vous voulez** : dans Edit layout, double-cliquez dessus pour ouvrir ses Properties.

## Si vous vous êtes arrêté avant Finish Build {#if-you-stopped-before-finish-build}

Une construction pas finie n'est jamais perdue : elle est gardée sur le Brain et revient sur le 🔨 Build Tab la prochaine fois que vous ouvrez **Edit layout**, avec une note. Appuyez sur **✅ Finish Build ...** pour l'envoyer sur son Tab, ou sur **🗑 Discard Build** pour la jeter. Voir [Saving never ends the Build](55-build-tab#saving-never-ends-the-build).

Plus : [Build Tab](55-build-tab), [Tap Water Valve](141-tap-water-valve), [Semi_Widgets_Devices](112-semi-widgets-devices), [Pas à pas : ajouter un Device](207-step-by-step-add-a-device).
