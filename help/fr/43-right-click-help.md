# Clic droit et ? pour l'aide {#right-click-and-for-help}

Un **clic droit** sur quelque chose qui ne peut pas être déplacé ouvre ce manuel à la partie qui l'explique. Utilisez-le le jour du brassage quand vous oubliez à quoi sert un gadget.

## Sur un PC ou un Mac {#on-a-pc-or-mac}

Faites un clic droit (sur un Mac : Contrôle + clic, ou un clic à deux doigts sur le pavé tactile) :

- **N'importe quel élément d'un Tab** quand vous n'êtes pas dans Edit layout : une pompe, une vanne, une sonde, une minuterie, une alarme, une cuve, un tuyau, une image ...
- **Un élément 🔒 verrouillé** dans Edit layout.
- **Un endroit vide d'un Tab** : ouvre [Image et couleur de fond d'un Tab](26-tab-background).
- **La Menu Bar** : la liste Schema, chaque bouton (Tabs, Processes, Devices ...), les Tabs d'écran, le ☰ Menu, et la barre Edit layout.

Dans **Edit layout**, un élément qui n'est **pas** verrouillé garde le bouton droit de la souris pour le faire glisser, comme avant. Le double-clic ouvre toujours les **Properties**.

> Vous voulez le menu du clic droit du navigateur (copier, inspecter ...) ? Gardez **Maj** enfoncée pendant le clic droit.

Les endroits où vous tapez, comme l'éditeur de Processes, gardent le menu normal du clic droit pour que copier et coller marchent toujours.

## Sur un iPhone, un iPad ou un téléphone Android {#on-an-iphone-ipad-or-android-phone}

Les téléphones n'ont pas de clic droit. **Gardez le doigt sur un élément pendant environ une seconde** quand vous n'êtes **pas** dans Edit layout, et l'aide s'ouvre. Levez le doigt : l'élément n'est **pas** commuté.

- Un **bouton poussoir** est laissé tranquille : le tenir, c'est la façon de l'appuyer.
- Dans **Edit layout**, garder le doigt ouvre les **Properties**, comme avant, donc il n'y a pas de geste d'aide là.
- La Menu Bar et les endroits vides n'ont pas encore de geste sur téléphone : touchez le **?** jaune à côté de **☰ Menu**, ou **Help** sur la Menu Bar.

## L'icône ? jaune {#the-yellow-icon}

Un cercle jaune avec un **?** noir ouvre l'aide à la partie qui parle de la chose à côté.

- **Onglets du ☰ Menu** : à côté de chaque titre (Default, Equipment Profile, Vessel et ses parties Size, Heat, Temperature, Ports and Build, Default Layout, Mash, Boil, Tab Background et Valve Profiles).
- Fenêtres **Properties** : à côté du titre, pour chaque Device et Widget, les tuyaux, les IP, l'équipement et Tab settings. Si vous avez changé quelque chose dans la fenêtre, il demande d'abord, car ouvrir l'aide ferme la fenêtre sans enregistrer.
- Il n'y a **pas** de ? sur un Tab lui-même, pour que vos écrans du jour de brassage restent propres. Le seul ? de la barre des Tabs est à côté de **☰ Menu**, pas sur le Tab.

L'aide s'ouvre dans une fenêtre à elle : voir [L'aide dans sa propre fenêtre](54-help-window).

## Où va chaque élément {#where-each-item-goes}

| Élément | Partie de l'aide |
|---|---|
| Sortie relais, PWM ou analogique, pompe, vanne simple, entrée, sonde, capteur, débitmètre, balance | [Devices : mettre un Device sur un Tab](03-devices) |
| Sonde DS18B20 | [Devices : les sondes OneWire](03-devices) |
| Vanne manuelle | [Vannes manuelles](29-manual-valves) |
| Vanne d'eau du robinet | [Vannes d'eau du robinet](31-tap-water-valves) |
| Moteur pas à pas | [Moteurs pas à pas](16-stepper-motors) |
| Alarm, Sound Player | [Alarmes et son](21-alarms-and-sound) |
| Minuterie | [Tabs : les minuteries](02-tabs) |
| gGlobal, gGlobal List | [Variables](04-variables) |
| Image | [Images de fond (.backpath, .backpath_2, .backpath_3)](25-picture-paths) |
| Cuve | [Réglages d'une cuve](34-vessel-tab) |
| Refroidisseur, serpentin, filtre, raccord d'équipement, cuve regroupée | [Équipement : cuves, refroidisseurs, serpentins et raccords](14-equipment) |
| Point IP, raccord de tuyau, tuyau rigide, tuyau souple | [Tuyaux, tuyaux souples et réducteurs](24-pipes-and-hoses) |
| Label, texte, interrupteur à l'écran, cuve manuelle | [Tabs : changer la disposition](02-tabs) |

## Changer où il va {#changing-where-it-goes}

La liste est dans `public/helpmap.js` sur le Brain. Si une page est renommée, l'aide s'ouvre quand même, en haut de la page la plus proche qu'elle trouve. Demandez un changement et elle sera mise à jour avec la nouvelle page.
