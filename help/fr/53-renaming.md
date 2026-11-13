# Renommer des Devices et des Widgets {#renaming-devices-and-widgets}

Quand vous changez le **Name** d'un Device ou d'un Widget, chaque Process qui utilise l'ancien nom est changé pour le nouveau à votre place. Vous n'avez pas à fouiller vos Processes à la main.

## Comment ça marche {#how-it-works}

1. Activez **Edit layout**.
2. Double-cliquez sur le Device ou le Widget, appuyez sur **✏ Change name** à côté de son **Name** verrouillé, tapez le nouveau nom dans la fenêtre **Name Change** et appuyez sur **💾 Save** là, puis sur **💾 Save** dans ses propriétés (voir [Changement de nom et clés cachées](80-name-change-and-hidden-keys)).
3. Appuyez sur **Save** dans la barre Edit layout.

Quand la disposition est enregistrée, le panel passe dans chaque Process et change l'ancien nom pour le nouveau. Un message en bas de l'écran dit quels Processes ont été changés, par exemple :

*Layout saved. Renamed in 2 Processes: Mash_In, Heat_HLT.* (Disposition enregistrée. Renommé dans 2 Processes : Mash_In, Heat_HLT.)

Si aucun Process n'utilisait l'ancien nom, il le dit.

## Ce qui est changé {#what-is-changed}

Seul le **nom entier** est changé. Si vous renommez `HLT_Temp` en `MB_OW1_TmP_HLT_HS` :

- `HLT_Temp = 168` devient `MB_OW1_TmP_HLT_HS = 168`
- `HLT_Temp.visible = true` devient `MB_OW1_TmP_HLT_HS.visible = true`
- `"HLT_Temp"` (ancienne façon, entre guillemets) est changé aussi
- le nom dans les commentaires et les messages est changé aussi
- `HLT_Temp_2` et `Old_HLT_Temp` ne sont **pas** changés : ce sont d'autres noms
- un attribut après un point, comme `Pump.HLT_Temp`, n'est jamais changé

Les noms doivent correspondre exactement, majuscules et minuscules comprises.

Les autres réglages qui pointent vers l'élément renommé le suivent aussi : tuyaux et flexibles qui coulent quand il est On, un chauffage sur une cuve, des Devices qui le suivent ou le lisent, et les **CSV sets** enregistrés sur la page Log. Sa valeur actuelle reste avec lui.

## Bon à savoir {#good-to-know}

- **Renommez-en plusieurs à la fois.** Vous pouvez renommer plusieurs Devices et Widgets avant d'appuyer sur Save ; ils sont tous changés d'un coup. Même échanger deux noms (A devient B et B devient A) marche.
- **Les clones suivent.** Renommez un élément et l'ancien nom dans le nom de chacun de ses clones change aussi (voir [Changement de nom et clés cachées](80-name-change-and-hidden-keys)).
- **Renommez-le deux fois.** Si vous renommez `Pump1` en `Pump_A` puis en `Pump_Main` avant d'enregistrer, les Processes passent directement de `Pump1` à `Pump_Main`.
- **Annuler.** Si vous quittez Edit layout sans enregistrer, rien n'est renommé et aucun Process n'est changé.
- **Un Process qui tourne** continue de marcher : il trouve l'élément renommé par sa clé cachée. Il utilise le nouveau nom dès son prochain départ.
- **Sauvegarde.** Avant qu'un Process soit changé, l'ancienne copie est gardée à côté sous le nom `<Process name>.txt.bak` dans le dossier des scripts.
- **Autres Schemas.** Les Processes sont partagés par tous les Schemas. Si un autre Schema a encore un Device ou un Widget avec l'ancien nom, le message vous le dit, car le Process changé y cherche maintenant aussi le nouveau nom. Renommez-le aussi dans ce Schema, ou gardez une copie du Process pour lui.
- **Tabs et Processes.** Renommer un Tab ou un Process est une autre affaire ; cette page parle des Devices et des Widgets.

Voir aussi [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names), [Le langage des Processes et les étapes](22-process-language) et [Schemas et Equipment Profiles](28-schemas-and-equipment-profiles).
