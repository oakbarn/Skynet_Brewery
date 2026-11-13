# Pompe Cool / Warm {#cool-warm-pump}

Une **Cool / Warm Pump** est une pompe commandée par une température : une pompe à glycol qui refroidit un fermenteur, ou une pompe qui y amène de l'eau
tiède. Dans Skynet c'est **un seul Device pompe sur son port** (un Port, un Device), jamais une pompe plus un Device Hysteresis
séparé (Règle Skynet 6.21).

## Son nom {#its-name}

Son ID de Device Type est **CPMP**, donc son Suggested Name se lit simplement, par exemple `MB_D5_CPMP_Cool~Pump_FR` :

| Partie | Exemple | Ce que c'est |
|---|---|---|
| ID d'Interface | `MB` | la carte à laquelle elle est câblée |
| Port | `D5` | la broche |
| ID de type | `CPMP` | une Cool / Warm Pump |
| Label | `Cool~Pump` | vos mots, une espace devient `~` |
| ID de Tab | `FR` | le Tab où elle est |

## Sa méthode {#its-method}

Double-cliquez sur la pompe. Sous **Cool / Warm Pump: its Method**, choisissez comment elle tourne :

- **Direct** (anciennement On/Off) : un clic ou un Process la met en marche et l'arrête.
- **Hysteresis** : elle tourne selon sa **Temperature Probe** pour tenir un **Setpoint**. L'**Offset** dit où elle se met en marche, Setpoint +
  Offset : un **Offset plus refroidit** (elle se met en marche au-dessus du Setpoint, pour une pompe à glycol) ; un **Offset moins réchauffe** (elle se met en marche sous le
  Setpoint). **On delay** attend ce nombre de secondes avant
  de se remettre en marche.

Cochez **Hysteresis allowed too** pour passer de l'une à l'autre d'un clic sur le Tab, ou depuis un Process. Une pompe n'est jamais commandée en
Duty Cycle, PID, Deadband ou Precise : ils mettent le moteur en marche et à l'arrêt de nombreuses fois par minute et l'usent, lui et son relais.

## Dans un Process {#in-a-process}

Les mots sont les mêmes que pour une résistance chauffante :

```
MB_D5_CPMP_Cool~Pump_FR.method = "Hysteresis"
MB_D5_CPMP_Cool~Pump_FR.setpoint = 66
MB_D5_CPMP_Cool~Pump_FR.onoffset = +1
MB_D5_CPMP_Cool~Pump_FR = On
```

(La pompe passe en Hysteresis, tient 66 °F, se met en marche à 67 °F, et est mise en marche.)

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.
