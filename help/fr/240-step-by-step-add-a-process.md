# Pas à pas : ajouter un Process {#step-by-step-add-a-process}

Un **Process** est une liste de tâches que Skynet fait pour vous, une ligne à la fois : régler une résistance, l'allumer, attendre une température, maintenir pendant un temps, demander au brasseur de faire quelque chose. Ce guide ajoute à l'exemple 3 Vessel un Process appelé **Heat_Strike_Water**. Il chauffe le Hot liquor tank (HLT) à **152 °F**, le maintient **10 minutes**, vous demande d'ajouter l'eau d'empâtage, puis éteint la résistance. Tous les autres Process s'écrivent de la même façon.

> **⚠ Un Process ne fait rien tant qu'il n'est pas démarré.** L'enregistrer ne le démarre pas. Démarrez-le depuis l'éditeur de Process (étape 10), depuis un **Process Widget** sur un Tab (étape 11), ou depuis un autre Process (`start Heat_Strike_Water`).

Seul un Admin peut ajouter ou changer un Process. Un opérateur peut en démarrer et en arrêter un.

Le Process terminé :

```
//Heat_Strike_Water
step "Heat the strike water"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.setpoint = 152
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = on
wait HLT_Vessel.BM1w1_1_HLT_BH >= 152
step "Hold"
sleep 10 * skn_const_Ms_p_Min
ask "The strike water is ready"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = off
```

## Étape 1. Ouvrir l'écran Processes {#step-1-open-the-processes-screen}

Appuyez sur **☰ Menu** (en haut à droite), puis sur **Processes** (sous **Pages**).

Vous pouvez aussi y aller depuis **✎ Edit layout** : appuyez sur **📝 Processes** dans la barre Edit layout. **✖ Close** vous ramène.

![☰ Menu: Processes](help_pictures/Step_Add_Process_01_Menu_Processes.png)

## Étape 2. ➕ Add New Process... {#step-2-add-new-process}

Ouvrez la liste en haut de l'éditeur et choisissez **➕ Add New Process...** (le premier de la liste). Le bouton **New** à gauche fait la même chose.

![The Process list box](help_pictures/Step_Add_Process_02_Add_New_Process.png)

Une boîte demande le nom (**New process name**). Tapez **Heat_Strike_Water** et appuyez sur **OK**.

- Un nom n'a pas d'espaces : une espace devient `_` toute seule.
- Ne le commencez pas par `skn_`. Les noms qui commencent par `skn_` appartiennent à Skynet (voir l'étape 6).

## Étape 3. Le nouveau Process {#step-3-the-new-process}

Le nouveau Process s'ouvre dans l'éditeur, avec son nom en haut. Sa première ligne est un commentaire avec son nom (`//Heat_Strike_Water`). Un commentaire est une note pour les gens ; le Process le saute.

La liste à côté de **Add steps** est sa **classe**. Skynet la devine d'après le nom : **Sub** ici. Un Process pour une seule tâche, que vous démarrez vous-même ou depuis un autre Process, est un Sub. Voir [Process classes](22-process-language#process-classes).

![The new Process](help_pictures/Step_Add_Process_03_New_Process.png)

## Étape 4. Régler la résistance et l'allumer {#step-4-set-the-heater-and-turn-it-on}

Tapez les premières lignes sous le commentaire :

```
step "Heat the strike water"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.setpoint = 152
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = on
```

1. `step` donne un nom à cette partie du Process. Skynet numérote les étapes à l'enregistrement ; ne tapez jamais le numéro. Voir [Steps](22-process-language#steps-scaffolding).
2. `.setpoint = 152` règle la résistance du HLT sur 152.
3. `= on` l'allume. Elle chauffe alors et maintient le HLT à son Setpoint.

**Tapez les températures dans vos Units.** Avec **Settings > Units** sur US, `152` est 152 °F ; sur Metric, c'est 152 °C. Pour être sûr, ajoutez le signe : `152°F` ou `66.7°C` veut toujours dire cela. Voir [Temperatures in a Process](05-scripts#temperatures-in-a-process).

![Set the heater and turn it on](help_pictures/Step_Add_Process_04_Heat.png)

## Étape 5. Attendre la température {#step-5-wait-for-the-temperature}

Tapez l'attente :

```
wait HLT_Vessel.BM1w1_1_HLT_BH >= 152
```

`wait` retient le Process sur cette ligne jusqu'à ce que la sonde du HLT lise 152 ou plus. Ensuite, il passe à la ligne suivante.

Pendant que vous tapez, **Predictive text** liste les noms qui conviennent. Cliquez sur l'un d'eux, ou appuyez sur **Entrée**, pour le mettre. **Ctrl+Space** ou **💡 Suggest** ouvre la liste à tout moment. Voir [Predictive text](79-predictive-text).

![Predictive text](help_pictures/Step_Add_Process_05_Wait_Predictive.png)

## Étape 6. Maintenir 10 minutes : 📐 Constants {#step-6-hold-for-10-minutes-constants}

Un Process compte le temps d'un `sleep` en millisecondes (1000 font une seconde). Inutile de le calculer : une **Skynet Constant** le fait.

Tapez `step "Hold"` sur sa propre ligne, puis `sleep 10 * ` et appuyez sur **📐 Constants**. Tapez **Milliseconds per Minute** dans sa case de recherche et cliquez sur **Milliseconds per Minute** (`skn_const_Ms_p_Min`). Elle se place là où est le curseur :

```
step "Hold"
sleep 10 * skn_const_Ms_p_Min
```

![📐 Constants](help_pictures/Step_Add_Process_06_Constants.png)

**Les noms Skynet commencent par `skn_`.** Tout nom qui appartient à Skynet et qu'un Process peut lire commence par `skn_` : les Skynet Constants (`skn_const_L_p_Gal`, Liters per Gallon) et les valeurs propres à Skynet (`skn_Boil_Temp`, la température d'ébullition du jour). Vous pouvez les lire ; vous ne pouvez pas les changer, et aucun de vos propres noms ne peut commencer par `skn_const_`. Voir [Skynet Constants](94-skynet-constants).

## Étape 7. Demander, puis éteindre la résistance {#step-7-ask-then-turn-the-heater-off}

Tapez les deux dernières lignes :

```
ask "The strike water is ready"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = off
```

`ask` affiche une fenêtre sur tous les écrans avec **✔ Done** et attend qu'un opérateur ou un Admin appuie dessus. Ensuite, la résistance s'éteint.

![The whole Process](help_pictures/Step_Add_Process_07_Whole_Process.png)

## Étape 8. Check {#step-8-check}

Appuyez sur **Check**. **No problems found** est ce que vous voulez voir. Un problème est listé sous l'éditeur avec son numéro de ligne, et ce numéro devient rouge : cliquez sur le problème pour aller à sa ligne.

![Check](help_pictures/Step_Add_Process_08_Check.png)

## Étape 9. Save {#step-9-save}

Appuyez sur **💾 Save**. **✔ Saved** s'affiche, et les étapes reçoivent leur numéro (`S2.00000`, `S2.00001`).

Vous voyez toujours `152`. En coulisses, Skynet le garde comme `66.6667°C`, donc le Process veut dire la même chose si Units est changé plus tard. Skynet le fait en arrière-plan et n'a besoin d'aucune action de votre part.

![Save](help_pictures/Step_Add_Process_09_Save.png)

## Étape 10. Le démarrer, et la fenêtre Override {#step-10-start-it-and-the-override-pop-up}

Appuyez sur **Start**. À côté du nom du Process, vous voyez ce qu'il fait : **waiting (line 5, step S2.00000 Heat the strike water)**. Le numéro de sa ligne devient vert, et son point dans la liste devient jaune.

**La fenêtre Override :** quand un Process attend depuis 3 secondes dans un `wait` ou un `sleep`, et qu'aucun **Override button** n'est réglé sur lui ou sur **Any**, une petite fenêtre s'ouvre par-dessus tous les écrans : **Heat_Strike_Water is waiting**. Un appui sur **Passer** (Override) fait avancer ce Process seulement, au-delà du wait ou du sleep qui le retient, par exemple quand vous voyez que l'eau est assez chaude. **✕** la cache sur cet écran jusqu'à ce que le Process attende de nouveau. Voir [Override button](96-override-button).

- Une attente **dans une boucle** ne s'ouvre jamais toute seule. Ajoutez `show_Override` dans le Process seulement là où avancer est sans danger.
- `show_Override "Press when the water is hot"` ouvre la fenêtre avec vos propres mots ; `hide_Override` la retire.

**Arrêt** (Stop) arrête le Process. **Tout arrêter** (Stop all, à gauche) arrête tous les Process.

![Start: waiting, and the Override pop-up](help_pictures/Step_Add_Process_10_Start.png)

## Étape 11. Le mettre sur un Tab : un Process Widget {#step-11-put-it-on-a-tab-a-process-widget}

Un **Process Widget** montre un Process sur un Tab et le démarre ou l'arrête d'un clic (sans fenêtre avant). Ajoutez-en un comme n'importe quel Widget ([Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget)) :

1. Revenez au Tab (**Tabs**, ou **✖ Close**), puis **🛠 Build (Edit layout)**.
2. Dans **Select Widget Type**, choisissez **On-screen controls**, puis dans **Add Widget**, choisissez **Process Widget**.

![Select Widget Type and Add Widget](help_pictures/Step_Add_Process_11_Process_Widget_Type.png)

## Étape 12. Les Properties du Process Widget {#step-12-the-process-widget-s-properties}

Le Widget est créé sur le 🔨 Build Tab et ses **Properties** s'ouvrent.

1. **1. Label** : ce qu'il affiche sur le Tab, par exemple **Strike water**.
2. **4. Process** : choisissez **Heat_Strike_Water**.
3. Appuyez sur **💾 Save**.

![Process Widget Properties](help_pictures/Step_Add_Process_12_Process_Widget_Properties.png)

**Il n'est pas encore sur votre Tab.** Appuyez sur **✅ Finish Build ... > Move to Tab**, puis sur **Save layout**, comme dans [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget). Hors d'Edit layout, un clic dessus démarre **Heat_Strike_Water** ; il affiche **Running**, **Waiting** ou **Stopped**, et un autre clic l'arrête. Activez **Ask Before Starting or Stopping** si vous voulez que le clic demande d'abord.

## Terminé {#done}

Ce qu'il reste à faire :

1. **Essayez-le d'abord dans le Simulator** : **☰ Menu > 🧪 Switch to Simulator** le fait tourner sans rien allumer de réel ([Simulator or real boards](77-simulator-or-real-boards)).
2. **Changez-le quand vous voulez** : ouvrez-le depuis la liste, changez-le, puis **Check** et **💾 Save**. Un Process en marche garde les anciennes lignes jusqu'à ce qu'il soit redémarré.
3. **Un bouton à lui** : un **Override button** sur un Tab, réglé sur ce Process ([Override button](96-override-button)).

Plus : [Processes](05-scripts), [The Process editor](30-process-editor), [Process language and steps](22-process-language), [Skynet Constants](94-skynet-constants), [Process Widget](173-process-widget), [Override button](96-override-button).
