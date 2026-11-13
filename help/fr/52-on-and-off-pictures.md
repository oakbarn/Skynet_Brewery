# Images On et Off {#on-and-off-pictures}

Une sortie peut montrer une image quand elle est **On** et une autre quand elle est **Off**. Une pompe peut montrer une pompe qui tourne, un brûleur une flamme, une vanne ouverte ou fermée.

## Quels éléments en ont {#which-items-have-them}

Chaque Device ou Widget qui a un état On / Off a deux réglages, **.imageOn** et **.imageOff**. Le Tab les échange tout seul, aucun Process n'est nécessaire.

- **Digital Output** (pompes, vannes, brûleurs, résistances, LED ...) : On tant que la broche est active.
- **PWM Output**, **Analog Output** et **PID** : On tant qu'ils tournent au-dessus de 0 %.
- **Duty Cycle** et **Hysteresis** : On tant que leur broche est active.
- **Timer** : On tant qu'elle tourne. **Stepper** : On tant qu'il bouge. **Flow meter** : On tant que quelque chose coule. **Sound Player** : On tant qu'il joue.
- **Digital Input**, **Switch**, **Alarm** (qui sonne / silencieuse) et une **Picture** qui suit un autre élément.

## Régler les deux images {#setting-the-two-pictures}

1. Appuyez sur **Edit layout** et double-cliquez sur l'élément pour ouvrir ses **Properties**.
2. Choisissez **Picture when on** dans la liste. Vous voyez un petit aperçu à côté.
3. Choisissez **Picture when off** de la même façon.
4. Appuyez sur **Save**.

La liste contient des LED (verte, rouge, grise), des éclairs, des vannes et une pompe de puisard immergée (Pump_Sump_On et Pump_Sump_Off : verte et qui pompe quand elle est On). Choisissez une image d'une paire et l'autre se remplit toute seule. Choisissez **Add new ...** pour votre propre image : tapez son nom dans `media/Images`, par exemple `MyPump_On.png` ou `Pumps/MyPump_On.svg`. Les images PNG, JPG, GIF et SVG marchent toutes. Mettez d'abord vos images sur le Brain avec la page **File Move**.

Vous voulez une seule image avec un éclair par-dessus quand elle est On, au lieu de deux images ? Voir **On overlay**.

Laissez une image à **(none)** et l'élément montre dans cet état son image de fond normale (chemin d'image 1-3) ou sa couleur.

## Depuis un Process {#from-a-process}

Vous n'avez jamais besoin d'un Process pour l'échange. Un Process peut quand même changer l'une ou l'autre image pendant qu'il tourne, par exemple pour montrer une autre pompe :

```
Pump_1.imageOn = "Images/MyPump_On.png"
Pump_1.imageOff = "Images/MyPump_Off.png"
```
