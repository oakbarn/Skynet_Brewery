# Les Skynet Brew Timers {#the-skynet-brew-timers}

Skynet a trois minuteries à lui pour le jour de brassage (Règle Skynet 2.68) :

| Nom | Ce qu'elle chronomètre | D'où `start` prend son temps |
|---|---|---|
| `skn_Boil_Timer` | l'ébullition | le temps d'ébullition de la Recipe |
| `skn_Mash_Timer` | l'empâtage | les temps des paliers d'empâtage de la Recipe, additionnés |
| `skn_Whirlpool_Timer` | le Whirlpool et le refroidissement | les Whirlpool Minutes de la Recipe |

Sans Recipe chargée, les temps viennent de ☰ Menu > Default settings.

## Ce que vous voyez {#what-you-see}

- Elles **comptent toujours à rebours**.
- Chacune **s'affiche** en haut au milieu de chaque écran pendant qu'elle tourne, et **se cache** quand elle s'arrête ou arrive à 0.
- Elle affiche **hh:mm** jusqu'à ce qu'il reste 5 minutes, puis **hh:mm:ss** : 01:30, puis 00:04:59.
- Vous ne réglez que leurs **Labels** : ☰ Menu > Default settings > Brew Timers. Tout le reste appartient à Skynet.

## Dans un Process {#in-a-process}

```
wait_boil -1
start skn_Boil_Timer
wait skn_Boil_Timer <= 00:30:00
print "30 minutes left in the boil"
wait skn_Boil_Timer <= 0
```

- `skn_Boil_Timer = 01:00:00` règle le temps restant avant (ou pendant) qu'elle tourne. Un temps réglé par le Process l'emporte sur celui de la Recipe.
- `start`, `stop` et `reset` marchent dessus. Après `reset`, le `start` suivant reprend le temps de la Recipe.
- `skn_Boil_Timer.running` est vrai pendant qu'elle compte à rebours (lecture seule). Il n'y a pas d'autres attributs.

## Alertes houblon {#hop-alerts}

Les alertes houblon suivent le Boil Timer : `start_hop_alerts` sans minuterie nommée suit `skn_Boil_Timer` pendant qu'elle tourne,
donc une ébullition en pause met aussi les alertes houblon en pause (voir [Recipe Tab](99-recipe-tab)).
