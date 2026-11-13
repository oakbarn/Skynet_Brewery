# Tab Background Profiles et Valve Profiles {#tab-background-and-valve-profiles}

Les deux sont des onglets de menu (**☰ Menu**). Chaque profil est gardé sur le Brain, dans `config/profiles/tab` et `config/profiles/valve`, donc chaque Schema peut l'utiliser. Seul un Admin peut les créer ou les changer.

## Tab Background Profile

Un Tab Background Profile donne à un Tab sa **couleur de fond**, et l'**apparence** avec laquelle commence un nouveau Device ou Widget sur ce Tab :

- **Name** (nom) : couleur du texte, couleur de fond et placement (TopLeft ... BottomRight).
- **Value** (valeur) : couleur du texte, couleur de fond et placement.
- **Value type** (type de valeur) :
  - **LED (push button)** : **Locking** (appui : ON, nouvel appui : OFF) ou **Momentary** (ON seulement tant qu'on le tient). Ce qui est ON / OFF montre un point allumé ; un nombre montre des chiffres LED rouges.
  - **Text** : du texte simple.
  - **Gauge** : des chiffres LCD, avec combien de **Digits** (chiffres) et combien de décimales (**Precision**).

Ce qui a un état ON / OFF (une pompe, une vanne, un interrupteur) ne peut être qu'une LED ou du Text ; un Gauge l'affiche en Text. Ce qui n'a ni valeur ni état (une image, une étiquette) ne prend que les couleurs. Les pompes et les vannes gardent leurs images.

**L'apparence n'est copiée qu'au moment où le Device ou le Widget est créé.** Ensuite, changez-la dans ses propriétés (dans Edit layout), ou depuis un Process (par exemple `Pump_1.valueColor = "Red"`, voir [The Process language](22-process-language)). Changer le profil plus tard ne change pas ce qui est déjà sur le Tab.

### Donner son profil à un Tab {#give-a-tab-its-profile}

- Sur l'onglet de menu **Tab Background Profile**, le tableau du bas liste les Tabs du Schema chargé. Choisissez le profil de chacun.
- Ou dans Edit layout, ouvrez **⚙ Tab settings** et choisissez **Tab Background Profile**.

Un Tab qui a sa propre **Background color** dans Tab settings garde cette couleur. Mettez-la sur **Default** pour utiliser la couleur du profil.

L'onglet de menu **Default** choisit le Tab Background Profile que reçoit un **nouveau Tab**.

## Valve Profile

Un Valve Profile est la façon dont commence une nouvelle vanne :

- **Graphic** (la vanne telle qu'elle est dessinée) et, facultatif, **Graphic when open** (image quand elle est ouverte). Les vannes Skynet n'ont pas d'images ouvertes : la vanne garde son image et l'**On overlay** (la superposition « allumé ») montre qu'elle est ouverte ([Retired Skynet pictures](129-retired-skynet-pictures)).
- **Orientation** : **Horizontal** (bouts du tuyau à gauche et à droite), **Vertical** (en haut et en bas), **45 degrees Left** (coins en haut à gauche et en bas à droite) ou **45 degrees Right** (en haut à droite et en bas à gauche). Pour Horizontal et Vertical, choisissez des images dessinées dans ce sens. Pour les 45, choisissez les images **verticales** : le panel les tourne de 45 degrés à gauche ou à droite pour vous. Les 45 sont pour une vanne posée sur un coude à 45 degrés.

Les images de vanne de Skynet sont des fichiers SVG dans `Images/samples`, donc elles restent nettes à toutes les tailles et ne peuvent pas être supprimées (voir [Media](07-media)) :

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

Vous ne choisissez le Valve Profile **qu'au moment de créer une nouvelle vanne** : dans Edit layout, **Valves > Motorized valve**, et le panel demande à partir de quel Valve Profile commencer (l'onglet de menu **Default** règle celui qui est choisi d'abord). Ensuite, la vanne se change dans ses propres propriétés, où **Orientation** et les images peuvent être réglées de nouveau.
