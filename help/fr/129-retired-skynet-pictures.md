# Images Skynet retirées et renommées {#retired-and-renamed-skynet-pictures}

Les images Skynet ont été mises en ordre (Règles Skynet 7.8 et 15.3). Les images retirées sont déplacées dans le dossier **Delete**
du dépôt GitHub, jamais jetées, et tout ce qui venait avec Skynet utilise maintenant l'image qui les a remplacées.

## Les vannes se montrent ouvertes avec une superposition {#valves-show-open-with-an-overlay}

Les vannes Skynet ne passent plus à une seconde image « Open ». Une vanne garde sa seule image, et tant qu'elle est ouverte (On), son
**On overlay** est dessinée par-dessus : l'éclair rouge et jaune sur une vanne motorisée, ou l'anneau vert et la coche sur un
Widget Manual Valve. Chaque Template de vanne Skynet, les Schemas exemples et le Schema par défaut marchent ainsi.

Vos propres images peuvent toujours venir en paire On et Off si vous le voulez (Règle 7.8) ; celles de Skynet, non.

## Renommées {#renamed}

| Ancien nom | Nouveau nom |
| --- | --- |
| Valve_Ball_ClosedH_1 | Motorized_TC15_Ball_Valve_Horizontal.svg |
| Valve_Ball_ClosedV-1x1 | Motorized_TC15_Ball_Valve_Vertical.svg |

## Retirées (déplacées dans Delete/) {#retired-moved-to-delete}

| Retirée | À utiliser à la place |
| --- | --- |
| pipe_cross.svg | Skynet_TC15_Cross.svg |
| pipe_elbow45.svg | Skynet_TC15_Elbow_45.svg |
| pipe_elbow90.svg | Skynet_TC15_Elbow_90.svg |
| pipe_tee.svg | Skynet_TC15_Long_Tee.svg |
| Skynet_TC15_InstrumentTee.svg | Skynet_TC15_Instrument_Tee.svg |
| Valve_Ball_OpenH_1 | Motorized_TC15_Ball_Valve_Horizontal.svg plus l'On overlay |
| Valve_Ball_OpenV-1x1 | Motorized_TC15_Ball_Valve_Vertical.svg plus l'On overlay |
| Toutes les autres images Skynet de vanne Open (Valve_Motor_Ball_Open..., Valve_Motor_Butterfly_Open..., Valve_Manual_Open..., Valve_Manual_Butterfly_Open..., Valve_Gas_Solenoid_Open..., Manual_Ball_Valve_..._Open) | L'image Closed de la même vanne plus l'On overlay |

## Les Schemas exemples utilisent des superpositions {#sample-schemas-use-overlays}

Dans les Schemas exemples et le Schema par défaut, plus rien ne change d'image entre Off et On : les pompes, les vannes et les brûleurs
gardent leur image Off et montrent l'éclair quand ils sont On, et une résistance brille en rouge quand elle est On.

## Capots de pompe blancs {#white-pump-covers}

Le capot de pompe White est **RGB 250 250 250** (#FAFAFA). **White** est maintenant une des couleurs de capot Skynet (aide 111).
