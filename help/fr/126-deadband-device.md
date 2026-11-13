# Device Deadband {#deadband-device}

Un Device **Deadband** (zone morte) tient une température (ou toute autre mesure) près d'un **Setpoint** (consigne, Règle Skynet 6.17). Il est plus doux et plus lent qu'un PID : à chaque **Calc Time**, il pousse son % de sortie vers le haut ou
vers le bas d'un pas fixé, et quand la mesure est proche du Setpoint, il laisse la sortie tranquille.

Ajoutez-en un avec **➕ Add > Devices: control outputs > Deadband**, puis double-cliquez dessus pour ses Properties.

## Les trois zones {#the-three-zones}

Autour du Setpoint, il y a trois zones, chacune à la même distance au-dessus et en dessous :

| Zone | À quelle distance du Setpoint | À chaque Calc Time, la sortie ... |
| --- | --- | --- |
| **Deadband** | à ± Deadband Offset | reste comme elle est |
| **Inner Band** | à ± Inner Band Offset (mais hors de la Deadband) | bouge de l'**Inner Band Drive** |
| **Outer Band** | plus loin que l'Inner Band | bouge de l'**Outer Band Drive** |

En dessous du Setpoint, la sortie **monte** ; au-dessus, la sortie **descend**. Activez **Reversed** pour un refroidisseur, pour qu'elle monte
quand la mesure est trop chaude.

Exemple : Setpoint 152 °F, Deadband Offset 0.5, Inner Band Offset 2, Inner Band Drive 1, Outer Band Drive 5, Calc Time 10.
À 145 °F, la sortie monte de 5 % toutes les 10 secondes. À 151 °F, elle monte de 1 % toutes les 10 secondes. De 151.5 à 152.5 °F, elle reste
où elle est. À 153 °F, elle baisse de 1 % toutes les 10 secondes.

## Ses réglages {#its-settings}

| Réglage | Ce qu'il fait | Commence à |
| --- | --- | --- |
| Input | La sonde ou le capteur qu'il lit | |
| Setpoint | La mesure à tenir | 0 |
| Deadband Offset | La moitié de la largeur de la zone calme (toute la zone fait deux fois cela) | 0.5 |
| Inner Band Offset | La moitié de la largeur de la bande intérieure | 2 |
| Initial Output % | La sortie à laquelle il commence quand il est Enabled, pour partir près du bon niveau | 0 |
| Inner Band Drive | Le % de changement à chaque Calc Time dans la bande intérieure | 1 |
| Outer Band Drive | Le % de changement à chaque Calc Time dans la bande extérieure | 5 |
| Max output % | Le maximum qu'il donne jamais | 100 |
| Calc Time (s) | À quelle fréquence il pousse la sortie | 10 |
| Output window (s) | Sans broche PWM : le % de sortie est la part de chaque fenêtre où la broche est active (un Duty Cycle) | 2 |
| Reversed | Pour refroidir | désactivé |
| PWM output | Activé : la broche est une sortie PWM réglée au % de sortie | désactivé |

Un Process utilise les mêmes noms en minuscules : `DBand_HLT.setpoint = 152`, `DBand_HLT.deadbandoffset = 0.5`,
`DBand_HLT.innerbanddrive = 1`, et lit la sortie avec `DBand_HLT.value`. Comme un PID, il compte comme **On tant qu'il est Enabled**
(Règle 7.9) et peut partager le port d'un chauffage avec un PID ou une Hysteresis (Règle 6.1).

## Quand l'utiliser {#when-to-use-it}

Utilisez une Deadband quand la mesure réagit vite et commence près du Setpoint, par exemple pour tenir un fermenteur ou un
tube RIMS qui est déjà proche. Quand la mesure est loin du Setpoint ou réagit lentement (une grosse bouilloire), utilisez un **PID** :
une Deadband continuerait de monter alors que la chaleur ne s'est pas encore montrée, et dépasserait.
