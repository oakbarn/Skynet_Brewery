# Tab Background Profiles et Valve Profiles {#tab-background-valve-and-pump-profiles}

Les trois sont des onglets de menu (**☰ Menu**) : Tab Background Profile, Valve Profile et Pump Profile. Chaque profil est gardé sur le Brain, dans `config/profiles/tab`, `config/profiles/valve` et `config/profiles/pump`, donc chaque Schema peut l'utiliser. Seul un Admin peut les créer ou les changer.

## Tab Background Profile

Un Tab Background Profile donne à un Tab sa **couleur de fond**, et l'**apparence** avec laquelle commence un nouveau Device ou Widget sur ce Tab :

- **Name** (nom) : couleur du texte, couleur de fond et placement (TopLeft ... BottomRight).
- **Value** (valeur) : couleur du texte, couleur de fond et placement.
- **Value type** (type de valeur) :
  - **LED (push button)** : **Locking** (appui : ON, nouvel appui : OFF) ou **Momentary** (ON seulement tant qu'on le tient). Ce qui est ON / OFF montre un point allumé ; un nombre montre des chiffres LED rouges.
  - **Text** : du texte simple.
  - **Gauge** : des chiffres LCD, avec combien de **Digits** (chiffres) et combien de décimales (**Precision**).

Ce qui a un état ON / OFF (une pompe, une vanne, un interrupteur) ne peut être qu'une LED ou du Text ; un Gauge l'affiche en Text. Ce qui n'a ni valeur ni état (une image, une étiquette) ne prend que les couleurs. Les pompes et les vannes gardent leurs images.

**L'apparence n'est copiée qu'au moment où le Device ou le Widget est créé.** Ensuite, changez-la dans ses propriétés (dans Edit layout), ou depuis un Process (par exemple `Pump_1.valueColor = "Red"`, voir [Le langage des Processes et les étapes](22-process-language)). Changer le profil plus tard ne change pas ce qui est déjà sur le Tab.

### Donner son profil à un Tab {#give-a-tab-its-profile}

- Sur l'onglet de menu **Tab Background Profile**, le tableau du bas liste les Tabs du Schema chargé. Choisissez le profil de chacun.
- Ou dans Edit layout, ouvrez **⚙ Tab Settings** et choisissez-le sous **Background > Profile**.

Un Tab qui a sa propre **Background > Color** dans Tab Settings garde cette couleur. Mettez-la sur **Default** pour utiliser la couleur du profil.

L'onglet de menu **Default** choisit le Tab Background Profile que reçoit un **nouveau Tab**.

## Valve Profile

Un Valve Profile est la façon dont commence une nouvelle vanne :

- **Graphic** (la vanne telle qu'elle est dessinée) et, facultatif, **Graphic when open** (image quand elle est ouverte). Les vannes Skynet n'ont pas d'images ouvertes : la vanne garde son image et l'**On overlay** (la superposition « allumé ») montre qu'elle est ouverte ([Images Skynet retirées et renommées](129-retired-skynet-pictures)).
- **Orientation** : **Horizontal** (bouts du tuyau à gauche et à droite), **Vertical** (en haut et en bas), **45 degrees Left** (coins en haut à gauche et en bas à droite) ou **45 degrees Right** (en haut à droite et en bas à gauche). Pour Horizontal et Vertical, choisissez des images dessinées dans ce sens. Pour les 45, choisissez les images **verticales** : le panel les tourne de 45 degrés à gauche ou à droite pour vous. Les 45 sont pour une vanne posée sur un coude à 45 degrés.

Les images de vanne de Skynet sont des fichiers SVG dans `Images/samples`, donc elles restent nettes à toutes les tailles et ne peuvent pas être supprimées (voir [Media (images et sons)](07-media)) :

| Image | Fichier |
|---|---|
| Vanne à boisseau motorisée, horizontale | Valve_Motor_Ball_ClosedH.svg |
| Vanne à boisseau motorisée, verticale, moteur à droite | Valve_Motor_Ball_ClosedV_RC.svg |
| Vanne à boisseau motorisée, verticale, moteur à gauche | Valve_Motor_Ball_ClosedV_LC.svg |
| Vanne à boisseau motorisée TC 1.5" (l'ancien dessin), horizontale | Motorized_TC15_Ball_Valve_Horizontal.svg |
| Vanne à boisseau motorisée TC 1.5" (l'ancien dessin), verticale | Motorized_TC15_Ball_Valve_Vertical.svg |
| Vanne à boisseau manuelle, horizontale | Valve_Manual_ClosedH.svg |
| Vanne à boisseau manuelle, verticale, poignée à droite | Valve_Manual_ClosedV_R.svg |
| Vanne à boisseau manuelle, verticale, poignée à gauche | Valve_Manual_ClosedV_L.svg |
| Vanne papillon manuelle, horizontale | Valve_Manual_Butterfly_ClosedH.svg |
| Vanne papillon manuelle, verticale, poignée à droite | Valve_Manual_Butterfly_ClosedV_R.svg |
| Vanne papillon manuelle, verticale, poignée à gauche | Valve_Manual_Butterfly_ClosedV_L.svg |
| Électrovanne de gaz, horizontale | Valve_Gas_Solenoid_ClosedH.svg |
| Électrovanne de gaz, verticale, bobine à droite | Valve_Gas_Solenoid_ClosedV_R.svg |
| Électrovanne de gaz, verticale, bobine à gauche | Valve_Gas_Solenoid_ClosedV_L.svg |

Quand la vanne s'ouvre, son **On overlay** (l'éclair rouge et jaune si vous n'en choisissez pas un autre) est dessiné par-dessus. Une électrovanne de gaz a un corps en laiton et une bobine noire avec une flamme ; réglez son **Service** sur **Gas** pour qu'elle puisse chauffer une cuve. Un nouveau Valve Profile et une nouvelle vanne commencent avec la vanne motorisée (verticale, moteur à droite). Choisissez celle avec le moteur à gauche là où le moteur gênerait.

Vos propres images peuvent toujours aller par **paires** : choisissez celle fermée (ou éteinte) et sa partenaire ouverte (ou allumée) se remplit toute seule. Ça marche aussi dans l'autre sens, pour toute image dont le nom contient Closed/Open ou Off/On (par exemple Pump_Off.png et Pump_On.png), tant que la partenaire est dans vos images.

Vous ne choisissez le Valve Profile **qu'au moment de créer une nouvelle vanne** : dans Edit layout, **Valves > Motorized valve**, la case d'ajout a une liste **Valve Profile**. Elle commence sur le Valve Profile marqué **Default**, et vous pouvez en choisir un autre ou **(none)**. Ensuite, la vanne se change dans ses propres propriétés, où **Orientation** et les images peuvent être réglées de nouveau.

**Default :** activez **Default** dans un Valve Profile et la case d'ajout le choisit d'abord. Un seul de la liste est le Default : l'activer dans l'un le désactive dans les autres.

## Pump Profile {#pump-profile}

Un Pump Profile est la façon dont une nouvelle pompe commence. Son image vient de la pompe choisie (le modèle), donc le profil garde le reste. Changer un Pump Profile ne change jamais les pompes déjà sur un Tab. Chaque case a son Hover Help, et le titre et la liste **Open** restent en haut, et les boutons (**Delete**, **Save**, **Undo**, **Close**, **✕**) restent dans le coin en haut à droite pendant que le reste défile (le modèle Blichmann, Règle Skynet 2.51 ; les autres profils aussi). À droite de la liste **Open**, **+ Add New** (le + violet) crée un nouveau Pump Profile, comme **Add new ...** dans la liste (Règle Skynet 2.54). Le profil garde :

- **Orientation** : Right ou Left.
- **Cover** : None ou une couleur.
- **Hose or Pipe** : ce qui est dessiné des orifices de la pompe à ses IP.
- **Overlay** : ce qui s'affiche dessus quand elle tourne.
- **IP Type In** et **IP Type Out** : Tri-Clamp, NPT, BSP ou Quick Disconnect. Vide : d'après ses Ports.

La **case d'ajout de pompe** a une liste **Pump Profile**. Elle commence sur le Pump Profile marqué **Default** et remplit les cases en dessous avec lui ; choisissez-en un autre et elles changent. Vous pouvez encore changer chaque case avant **➕ Add Device**. Ensuite, la pompe se change dans ses propres propriétés.

**Default :** il y a toujours un Pump Profile par défaut, donc la liste Pump Profile n'a pas de (none). Skynet fait le premier, **Default Pump Profile** : Right, pas de Cover, Hose (tuyau souple), et le Pump Overlay des Default settings. Changez-le comme vous voulez. Son interrupteur **Default** ne peut pas être mis sur Off et il ne peut pas être supprimé : pour qu'un autre devienne le Default, ouvrez-le, mettez son **Default** sur On et faites Save.

**Overlay d'un nouveau Pump Profile :** un nouveau Pump Profile commence avec le **Pump Overlay** de ☰ Menu > Default settings (l'anneau lumineux vert sauf si vous le changez). Le Pump Overlay des Default settings ne s'applique qu'aux nouveaux Pump Profiles : les Pump Profiles et les pompes déjà faits gardent le leur. Une nouvelle pompe prend l'Overlay du Pump Profile choisi dans sa case d'ajout.
