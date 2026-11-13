# Data Display : choisir quelle valeur s'affiche {#data-display-pick-which-value-shows}

Certains Devices ont plus d'une valeur. Un débitmètre a son débit et son total, et un PID a son % de sortie et son Setpoint.
**Data Display** (Règle Skynet 6.26) choisit laquelle s'affiche sur le Tab. Skynet liste toutes les valeurs qu'a le Device.

## Les choix {#the-choices}

| Device | Choix de Data Display (le premier les montre toutes, comme avant) |
|---|---|
| PID, Deadband | Output % and Setpoint, Output %, Reading, Setpoint |
| Hysteresis | ON / OFF and Setpoint, ON / OFF, Reading, Setpoint |
| Duty Cycle | Duty cycle %, ON / OFF |
| Heating Element (commandée par une méthode) | Status and Setpoint, Output, Temperature, Setpoint |
| Débitmètre | Rate and Total, Rate, Total |
| Balance | Volume and Weight, Volume, Weight |
| Sortie PWM ou analogique avec Measured volts | Value and Volts, Value, Volts |

Ouvrez les **Properties** du Device et choisissez **Data Display**. Tant qu'un Device est arrêté, il affiche OFF comme avant.

## Dans un Process {#in-a-process}

```
Flow_1.display = "Total"      (by its words, any capitals)
Flow_1.display = "rate"
Flow_1.display = ""           (back to its Properties' pick)
print Flow_1.display
```

(Par ses mots, en majuscules ou non ; une valeur vide revient au choix de ses Properties.) Un mot que le Device n'a pas arrête le Process avec un message qui liste ses choix.

**Sa valeur principale :** le `.value` d'un débitmètre est la valeur que montre son Data Display : son débit, ou son total quand Total est
choisi.
