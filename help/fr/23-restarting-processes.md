# Relancer des Processes {#restarting-processes}

Une relance (restart) **arrête un Process, l'efface de la mémoire et le relance** depuis le début de son fichier enregistré. Ses propres variables (celles créées avec `new`) repartent de zéro et il oublie la ligne où il en était. Les Devices, les Widgets, les minuteries et les gGlobals gardent leurs valeurs.

Un Process peut s'arrêter sur une erreur, par exemple un capteur qui décroche. Une relance règle cela.

Il y a trois façons de relancer.

## 1. Le bouton Restart {#1-the-restart-button}

Sur l'écran **Processes**, choisissez le Process et appuyez sur **Restart** (Operators et Admins). S'il ne tournait pas, il démarre simplement. Si vous l'avez changé, il est d'abord enregistré, donc il fait tourner la nouvelle version.

## 2. La commande restart {#2-the-restart-command}

```
restart Looper_Temps     stop Looper_Temps, clear it and start it again
restart                  start this Process over from the top
```

(La première ligne arrête Looper_Temps, l'efface et le relance ; la seconde recommence ce Process depuis le début.)

La ligne après `restart Looper_Temps` s'exécute une fois que Looper_Temps s'est arrêté et a redémarré. `restart` tout seul termine ce Process et le relance tout de suite.

Pour faire tourner un Process en boucle, utilisez un `[Label]` et `goto`, pas `restart`. Restart sert à se sortir d'un problème.

## 3. Restart if it fails (relancer en cas d'échec) {#3-restart-if-it-fails}

Sur l'écran **Processes**, activez **Restart if it fails** (Admins) pour un Process. Si ce Process s'arrête sur une erreur, le panel attend 2 secondes et le relance tout seul. L'erreur est quand même écrite dans **Output**.

Il ne relance **pas** quand quelqu'un appuie sur **Stop** ou **Stop all**, quand le Process arrive à sa fin, ou quand il contient une erreur qui l'empêche même de démarrer. Appuyer sur **Stop** pendant les 2 secondes annule la relance.

## Pas de boucles sans fin {#no-endless-loops}

Un Process cassé pourrait se relancer pour toujours, donc les relances sont comptées. Quand un Process a été relancé **5 fois en une minute** par la commande `restart` ou par **Restart if it fails**, le panel ne le relance plus :

- le Process reste arrêté et montre pourquoi en rouge sur l'écran Processes,
- un message rouge s'affiche sur chaque écran jusqu'à ce qu'on le ferme,
- l'alarme que vous avez choisie dans Settings sonne.

Réglez le problème, puis lancez le Process à la main. Le lancer ou appuyer vous-même sur Restart n'est jamais compté et commence un nouveau compte.

Changez le nombre, et choisissez l'alarme, dans **Settings > Panel settings** :

- **Most restarts a minute for one Process** (le plus de relances par minute pour un Process : de 1 à 60, 5 si vous ne le changez pas)
- **Alarm to sound when a Process is stopped for restarting too often** (l'alarme qui sonne quand un Process est arrêté pour trop de relances : n'importe quel Alarm Widget, ou None)
