# Hysteresis de chauffe : ce qui commande la résistance {#heat-hysteresis-what-switches-the-element}

Une résistance dit ce qui la met en marche et l'arrête : son **Hardware Controller** (Règle Skynet 6.29). Cela décide jusqu'où son **Hysteresis**
peut tenir le Setpoint de près, pour que la pièce qui commute dure.

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.

## Les choix {#the-choices}

| Hardware Controller | Offset (-) | On delay | Pourquoi |
|---|---|---|---|
| **Optical SSR** (relais statique, au départ) | -0.5 à -3 °F | n'importe lequel | Pas de pièces mobiles : il peut basculer souvent. |
| **Contactor** (contacteur) | -1 à -5 °F | au moins 10 secondes | Ses contacts s'usent un peu à chaque fermeture. Des chauffes moins nombreuses et plus longues les font durer. |
| **Mechanical relay** (relais mécanique) | -1 à -5 °F | au moins 10 secondes | Comme un contacteur. |

Avec une sonde en °C, les nombres sont convertis : un Optical SSR -0.3 à -1.7 °C, un contacteur ou un relais mécanique -0.6 à -2.8 °C.

- L'**Offset (-)** dit où la résistance se met en marche : Setpoint + Offset, donc -1 est 1 degré sous le Setpoint. Elle s'arrête au Setpoint (ou un peu avant, quand
  la Predictive Hysteresis est activée : voir aide 168).
- L'**On delay** est le temps le plus court qu'elle reste arrêtée avant de pouvoir se remettre en marche.

## Où il se trouve {#where-it-is}

- **Choisir un Hardware Controller règle l'Offset et l'On delay pour vous** : un Optical SSR reçoit -0.5 °F et 0 seconde, un contacteur ou un
  relais mécanique -1 °F et 10 secondes. Vous pouvez les changer ensuite, dans la plage.
- **Properties > Heating method > Hardware Controller.** Posez la souris dessus pour voir la plage pour cette résistance. Quand Hysteresis est Enabled mais
  n'est pas la Current Method, son Offset et son On delay s'affichent quand même, pour pouvoir les régler.
- **Save** refuse un Offset ou un On delay hors de la plage, et dit ce qui est permis.
- **Un Process ou l'.API** écrit `.onoffset` avec le même moins (`hE_1.onoffset = -2` met en marche 2 degrés en dessous), et reçoit la même erreur simple : `hE_1.onoffset = -8` sur une résistance commandée par un Optical SSR est refusé, et un plus aussi (`hE_1.onoffset = 2`), car une résistance ne fait que chauffer.
- **Le Brain** ne fait jamais tourner une Hysteresis de chauffe hors de sa plage, quoi qu'on ait enregistré.
- Seule une Hysteresis qui **chauffe** a une plage.

Voir aussi : [Une seule résistance, choisissez comment elle chauffe](150-heating-method), [Hysteresis prédictive : pas de dépassement](168-predictive-hysteresis).
