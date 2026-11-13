# Bouilloire électrique intégrée Skynet {#skynet-integrated-electric-kettle}

La **Basic electric kettle** (bouilloire électrique de base) est un [Devices intégrés Skynet](64-skynet-integrated-devices) dessiné à partir d'une image Skynet. C'est la base de chaque bouilloire électrique intégrée Skynet : les suivantes y ajoutent des raccords et une vanne comme parties intégrées.

Elle a trois trous :

- **Thermowell** (trou du haut, devant au centre) : sa sonde de température est intégrée.
- **Outlet** (trou du bas, devant en bas au centre) : un IP simple, pour qu'un tuyau ou un raccord puisse s'y joindre.
- **Heating element** (trou sur le côté droit) : sa résistance est intégrée. Elle brille tant qu'elle est On.

La sonde et la résistance sont deux Devices à part, chacun avec son propre Port. Ils ne peuvent jamais être retirés de la bouilloire (dégroupés). La bouilloire elle-même peut quand même être groupée avec d'autres choses.

## En faire une {#making-one}

Elle se fait comme tout autre Device. En **Edit layout**, choisissez **Devices: Skynet > Electric kettle, basic** dans la liste Add et appuyez sur Add. La fenêtre **New Device: electric kettle** demande, dans le même ordre que pour chaque Device :

1. **Interface** : la carte à laquelle la bouilloire est câblée.
2. **Device Type** : electric kettle. Choisissez comment la résistance est commandée : **PID**, **Hysteresis**, **Duty Cycle** ou **PWM**, et le type de **sonde de température** dans son doigt de gant.
3. **Available Ports / Pins** : une pour la résistance et une pour la sonde de température (une sonde DS18B20 prend plutôt son numéro de sonde OneWire). Les listes montrent les broches libres de cette Interface, les meilleures en premier.

Tapez ensuite son **Label** (il commence à Kettle) et appuyez sur **Create**. La bouilloire va sur le 🔨 Build Tab avec ses deux Devices à côté, et ses Properties s'ouvrent. Les Devices reçoivent des noms proposés, par exemple `MB_9_PID_Kettle_Heat` et `MB_700_TEMP@1W_Kettle_Temp`.

Une résistance en **PID** ou **Hysteresis** tient la température que lit sa propre sonde (son Input est réglé pour vous).

## Ses Properties {#its-properties}

Double-cliquez sur la bouilloire en Edit layout. En plus de Name, Type, Label, Show label, Flip, Rotate et de la place, **Built-in Devices** (Devices intégrés) a l'Interface, la commande et le Port de la résistance, et le type et le Port de la sonde de température. Changez-les et enregistrez : les deux Devices suivent.

Les deux Devices ne peuvent pas être supprimés seuls. Supprimer la bouilloire les supprime aussi.

La bouilloire est aussi dans **☰ Menu > Vessel Templates** sous le nom **Integrated_Electric_Kettle_Basic**. Une bouilloire mise sur un Tab depuis là n'a pas encore de Devices : ouvrez ses Properties et réglez l'Interface et les Ports.
