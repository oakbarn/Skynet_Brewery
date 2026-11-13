# Hysteresis prédictive : pas de dépassement {#predictive-hysteresis-no-overshoot}

Une **Hysteresis** met sa sortie **en marche** à Setpoint + **Offset** (l'Offset d'une résistance a un moins, donc sous le **Setpoint**), et l'**arrête** quand
la lecture revient au Setpoint. Mais une résistance (ou un refroidisseur) ne s'arrête pas au moment où on la coupe : la chaleur
déjà dans la résistance continue d'aller dans le liquide, et la lecture **dépasse** le Setpoint.

**Predictive** corrige cela (Règle Skynet 6.23). Elle est **activée pour toute Hysteresis** : le Device Hysteresis, la méthode Hysteresis d'une
résistance et une Cool / Warm Pump.

## Comment ça marche {#how-it-works}

1. Chaque fois que la sortie s'arrête, Skynet regarde jusqu'où la lecture continue d'aller (sa **montée sur l'élan**).
2. Il fait la moyenne de cette montée sur les derniers cycles.
3. La fois suivante, il arrête d'autant **avant** le Setpoint, pour que la lecture monte sur l'élan jusqu'au Setpoint et s'y arrête.

L'arrêt anticipé n'est jamais plus de la moitié de l'Offset (0,5 °F pour -1).

## Sûr pour un compresseur {#safe-for-a-compressor}

Arrêter plus tôt, à lui seul, ferait redémarrer plus tôt, ce qui est dur pour un compresseur de réfrigérateur ou une pompe à glycol. Donc Predictive abaisse
le **point de mise en marche de la même quantité**. L'écart entre marche et arrêt reste aussi large que vous l'avez réglé, et elle **ne démarre pas plus souvent** que
sans Predictive. L'**On delay** (le temps d'arrêt le plus court avant de pouvoir redémarrer) est toujours respecté.

Le seul coût : le point bas de chaque cycle est plus bas de la même quantité (en refroidissement, le point haut est plus haut).

## La désactiver {#switching-it-off}

Ouvrez les **Properties** du Device et désactivez **Predictive**. Elle marche alors de la façon simple.

L'Hysteresis d'une résistance respecte aussi la plage d'Offset de ce qui la commande (Règle 6.29) : voir [aide 181](181-heat-hysteresis-switched-by).
