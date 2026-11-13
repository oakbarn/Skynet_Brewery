# Chauffe Precise : tenir une température à 0,1 degré près {#precise-heating-hold-a-temperature-to-0-1-degree}

**Precise** est une méthode de chauffe de la résistance, à côté de On/Off, Duty Cycle, Hysteresis, PID et Deadband (Règle Skynet
6.19). Elle sert aux travaux
où un PID normal dérive : la colonne d'un alambic, un bain-marie sous vide, un empâtage qui ne doit pas bouger.

## Ce qui décide jusqu'où elle peut tenir {#what-decides-how-close-it-can-hold}

Rien ne peut tenir une température plus près que ce que sa **sonde** peut voir. Precise n'est aussi bonne que la sonde et la façon dont la résistance
est commandée.

| Sonde | Plus petit pas qu'elle voit | Bonne pour 0,1 °F ? | Bonne pour 0,1 °C ? |
|---|---|---|---|
| **PT100 / PT1000** sur une carte MAX31865 | environ 0,03 °C (0,05 °F) | Oui, le meilleur choix | Oui |
| **DS18B20** (One Wire) | 0,0625 °C (0,11 °F) | Tout juste (±0,1 °F) | Oui |
| **Thermocouple** sur une carte MAX31856 | environ 0,01 °C, mais elle dérive | Pas assez stable | Pas assez stable |
| **Thermistance, LM35, TMP36** sur une broche analogique Arduino | environ 0,2 à 0,5 °F | Non | Non |

Skynet règle chaque DS18B20 sur sa résolution la plus fine (12 bits) au démarrage, car certaines arrivent réglées plus grossièrement. Quand Precise est choisie
ou permise, les Properties de la résistance disent si sa sonde est assez fine.

| Câblée à | Bonne pour Precise ? |
|---|---|
| **SSR** (relais statique) | Oui. Une Output window de 1 à 2 secondes est bonne. |
| **DAC** (signal 0-10 V vers un variateur de puissance), sur une broche PWM | Oui, la plus douce. |
| **Contacteur** (un interrupteur qui claque) | Non : il s'use quand on le bascule aussi souvent. |

L'emplacement de la sonde compte aussi : dans la vapeur ou le liquide que vous voulez tenir, sans toucher la résistance, dans un doigt de gant avec
de la pâte thermique pour qu'elle voie vite un changement.

## Ce que fait Precise et que le PID ne fait pas {#what-precise-does-that-pid-does-not}

1. **Smoothing** (lissage) : elle fait la moyenne de la sonde sur les secondes de **Smoothing** (10 au départ), pour que les petits pas de la sonde ne fassent pas
   tressauter la résistance.
2. **Hold output** : le % dont la résistance a besoin **juste pour rester** au Setpoint. Elle part de là, donc elle ne s'écarte pas loin pour le trouver.
   Regardez le % une fois stabilisé au Setpoint et mettez ce nombre. Laissez-le à 0 et elle le trouve toute seule, plus lentement.
3. **Moins de dépassement après une montée en température** : la partie qui s'accumule avec le temps (la partie I) est bloquée tant que la résistance est à 0 % ou
   à son Max output, et tant que la température est déjà en route vers le Setpoint. Cette poussée accumulée est ce qui fait
   dépasser un PID simple à l'arrivée.
4. **Puissance exacte** : la résistance est en marche pendant son % de chaque **Output window**. Le petit reste trop court pour basculer est reporté à la
   fenêtre suivante, donc sur une minute elle reçoit exactement le % demandé, même 12,34 %.
5. **Max output %** : une grosse résistance sur une petite colonne dépasse. Limitez-la, par exemple à 40 %.

Setpoint, Kp, Ki, Kd et Max output sont les **mêmes nombres que son PID**, donc passer entre PID et Precise continue sans à-coup.

## Étalonner la sonde : deux points {#calibrate-the-probe-two-points}

Un **Calibration offset** décale chaque lecture de la même quantité. C'est bien quand la sonde se trompe de la même quantité
partout. Beaucoup de sondes sont justes à un bout et un peu fausses à l'autre, donc les Properties de la sonde ont aussi un
**Two-point calibration** (étalonnage en deux points ; le ⬢ sur sa ligne) :

1. Mettez la sonde dans de l'**eau glacée** (beaucoup de glace, un peu d'eau, remuée). La vraie valeur est **32 °F (0 °C)**. Notez ce qu'elle a lu.
2. Mettez-la dans de l'**eau bouillante**. L'eau bout environ **1 °F plus bas tous les 500 pieds** (environ 150 m) au-dessus du niveau de la mer : 212 °F au niveau de la mer, 207 °F
   à 2 500 pieds, 202 °F à 5 000 pieds (100 °C, 97,2 °C, 94,4 °C). Notez ce qu'elle a lu et le vrai point d'ébullition.

Skynet corrige ensuite chaque lecture entre les deux. Le Calibration offset est encore ajouté après, pour un dernier petit réglage. Avec
un seul point rempli, cela marche comme un offset.

## L'utiliser {#use-it}

- Dans les Properties de la résistance, choisissez **Precise** comme méthode principale, ou cochez-la sous **Other methods allowed**.
- Un clic sur son bouton **Precise**, ou sur le bouton Precise de sa fenêtre, y passe.
- Un Process : `hE_1.method = "Precise"` ou le court `hE_1.PREC`. Ses réglages par nom : `.setpoint`, `.kp`, `.ki`, `.kd`,
  `.maxoutput`, `.holdoutput`, `.smoothing`, `.calctime`, `.outtime`. `.value` est son % de sortie, `.pv` la lecture lissée.

## Le réglage, simplement {#tuning-plainly}

Commencez avec Kp 10, Ki 0.1, Kd 0, Smoothing 10 s, Output window 2 s.
- Elle oscille au-dessus et au-dessous du Setpoint : baissez **Kp**, ou augmentez **Smoothing**.
- Elle reste un peu sous le Setpoint : augmentez un peu **Ki**, ou réglez le **Hold output**.
- Elle dépasse à l'arrivée : baissez **Max output %**, ou réglez le **Hold output**.
