# Devices intégrés Skynet {#skynet-integrated-devices}

Un **Skynet_Integrated_Device** est un seul élément avec des Devices intégrés. Le premier est le **tube RIMS** : sa résistance et sa sonde de température en font partie. Le second est la [Basic electric kettle](65-skynet-integrated-electric-kettle). Un **Skynet_Integrated_Widget** est un élément avec des IP intégrés, comme les [Skynet Fittings](60-skynet-fittings) (coudes, tés).

Un élément intégré peut être groupé avec d'autres choses, mais ce qui y est intégré ne peut jamais en être retiré (dégroupé).

## Tube RIMS {#rims-tube}

Le tube RIMS a une seule image (pas de choix) : des ouvertures TC en haut à gauche (entrée du moût) et en bas (sortie du moût), chacune avec son IP intégré, le doigt de gant et sa sonde dans le bout gauche, la résistance dans le bout droit avec son boîtier, et le cordon d'alimentation vers le secteur.

### Faire un tube RIMS {#making-a-rims-tube}

Il se fait comme tout autre Device. En **Edit layout**, choisissez **Devices: Skynet > RIMS tube** dans la liste Add et appuyez sur Add. La fenêtre **New Device: RIMS tube** demande, dans le même ordre que pour chaque Device :

1. **Interface** : la carte à laquelle le tube RIMS est câblé.
2. **Device Type** : RIMS tube. Choisissez comment la résistance est commandée : **PID**, **Hysteresis**, **Duty Cycle** ou **PWM**, et le type de **sonde de température** dans son doigt de gant.
3. **Available Ports / Pins** : une pour la résistance et une pour la sonde de température (une sonde DS18B20 prend plutôt son numéro de sonde OneWire). Les listes montrent les broches libres de cette Interface, les meilleures en premier.

Tapez ensuite son **Label** et appuyez sur **Create**. Le tube RIMS va sur le 🔨 Build Tab avec ses deux Devices à côté, et ses Properties s'ouvrent. Les Devices reçoivent des noms proposés comme d'habitude, par exemple `MB_9_PID_RIMS_Heat` et `MB_700_TEMP@1W_RIMS_Temp`.

Une résistance en **PID** ou **Hysteresis** tient la température que lit sa propre sonde (son Input est réglé pour vous).

### Ses Properties {#its-properties}

Double-cliquez sur le tube RIMS en Edit layout. En plus des réglages habituels Name, Label, Show label, Flip, Rotate et de place, il a :

- **Interface** : la carte à laquelle il est câblé.
- **Heating element** : sa **Control** (PID, Hysteresis, Duty Cycle ou PWM), son Port, et tous les réglages propres à cette commande (pour un PID : Setpoint, Kp, Ki, Kd, Max output, etc.). Changez la Control et les réglages en dessous changent en conséquence.
- **Heating element: its thermowell** : le doigt de gant fait partie de la résistance. Choisissez le type de sonde de température qui y est et son Port. Une résistance en PID ou Hysteresis tient la température que lit cette sonde.

Enregistrez, et la résistance et sa sonde suivent. Celui dont le nom est encore le nom proposé reçoit le nouveau nom proposé.

Le tube RIMS n'est pas un groupe : comme un coude, ses IP sont intégrés et restent sur ses ouvertures, et il n'a pas d'interrupteur Bundled. Sa résistance et sa sonde ne peuvent pas être supprimées seules ; supprimer le tube RIMS les supprime aussi. Un nouveau tube RIMS est nommé d'après son Label (RIMS, RIMS_2 ...).

Un tube RIMS mis sur un Tab depuis **☰ Menu > Equipment Templates** (le Template **RIMS_Tube**) n'a pas encore de Devices : ouvrez ses Properties et réglez l'Interface et les Ports.

## Doigts de gant {#thermowells}

Un **Thermowell** (doigt de gant) est un Device de température dessiné comme un doigt de gant TC 1.5. Il y en a trois : **Short**, **Medium** et **Long**. Choisissez **Devices: Skynet > Thermowell, Short** (ou Medium, Long) dans la liste Add. Une fenêtre demande **2a. Type of Temperature Probe** (type de sonde) qui y va ; puis la fenêtre New Device continue comme pour chaque Device (Interface, Device Type, Available Ports, Label).

## Raccords Skynet TC 1.5 {#skynet-tc-1-5-fittings}

Les Skynet Fitting Templates utilisent les dessins Skynet TC 1.5, avec des courbes plus rondes : **Elbow_90**, **Elbow_45**, **Tee** (un té égal), **End_Cap** et le nouveau **Instrument_Tee**, un té court avec une branche courte et étroite pour une sonde ou un manomètre. Les raccords déjà sur un Tab gardent l'image qu'ils avaient.
