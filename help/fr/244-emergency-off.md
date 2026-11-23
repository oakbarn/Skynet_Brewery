# Arrêt d'urgence {#emergency-off}

Le bouton **Emergency Off** (arrêt d'urgence) est le bouton champignon rouge sur la plaque jaune **en haut à droite de chaque page**. Il ressemble à celui d'une vraie machine.

**Un clic** arrête la brasserie tout de suite. Il n'y a pas de fenêtre.

**Laissez la souris dessus 2 secondes** et un grand bouton Emergency Off, de 400 pixels de large, apparaît dessous, pour qu'il soit facile à toucher. Un clic sur le grand fait exactement la même chose. Il disparaît quand la souris le quitte, ou avec Échap.

## Ce qu'il fait {#what-it-does}

Dans cet ordre :

1. **Chaque Process s'arrête**, comme avec **Stop all**.
2. **Les chauffes s'éteignent** : chaque Heating Element est mis sur Off, et chaque Duty Cycle, Hysteresis, PID et Deadband est désactivé.
3. **Les pompes s'arrêtent**, et tout moteur s'arrête.
4. **Chaque autre sortie s'éteint** : les sorties PWM et analogiques passent à 0, et les Switches passent sur Off.
5. **Les vannes se ferment.** Elles se ferment en dernier, pour qu'une pompe ne tourne jamais contre une vanne fermée.

Les **vannes manuelles** se tournent à la main, donc elles restent comme elles sont. Les Timers, les Alarmes et les sons ne sont pas touchés. La Console dit combien de choses il a changées.

## Bon à savoir {#good-to-know}

- Les brasseurs et les admins peuvent l'appuyer. Un compte en lecture seule ne peut rien changer.
- Pour brasser de nouveau, remettez les choses sur On et relancez votre Process. Rien ne se remet sur On tout seul.
- **Stop (all off)** dans les exemples est un Process que vous pouvez changer. **Emergency Off** est intégré à Skynet et fait toujours la même chose.
