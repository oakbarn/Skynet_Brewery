# Moteurs pas à pas {#stepper-motors}

Un moteur pas à pas (stepper) tourne jusqu'à une position exacte : une vanne à boisseau sphérique motorisée, une pompe doseuse, une alimentation de moulin à grain. C'est un **Device** sur des broches d'une seule carte. La carte fait les pas ; le panel dit où aller.

## En ajouter un {#add-one}

**Tabs > ☰ Menu > Edit layout > Select Device Type > Motors**, puis **Add Device**. Réglez ensuite :

- **Device** et **Driver board** (carte de commande : A4988, DRV8825, TMC2208 / 2209, TB6600 / DM542, ULN2003 avec un 28BYJ-48, L298N). En choisir une remplit le câblage habituel.
- **Pins** (broches) : STEP, DIR et ENABLE, ou IN1-IN4 pour les cartes à 4 broches.
- **Motor steps per turn** (pas par tour : 200 pour la plupart des moteurs NEMA 17 / 23), **Microstepping** (micro-pas : doit correspondre aux cavaliers de la carte de commande) et **Gearbox** (réducteur).
- **Position units** (degrés, %, mm, mL et plus) et **Units per output turn** (unités par tour de sortie). Pour une vanne à boisseau quart de tour, 400 % par tour donne 0-100 % = 90°.
- **Top speed** (vitesse maximale), **Lowest / Highest position allowed** (positions permises la plus basse / la plus haute), et un **Home switch** (contact de position d'origine) facultatif.

Alimentez le moteur avec sa propre alimentation, jamais par la broche 5 V de la carte.

## À l'écran {#on-the-screen}

Le moteur pas à pas affiche sa position, et « (not homed) » (origine non trouvée) s'il a un contact d'origine qu'il n'a pas encore trouvé. Touchez-le pour aller à une position, avancer d'une quantité, tourner à une vitesse, arrêter ou chercher l'origine.

## Dans un Process {#in-a-process}

```
"Valve_M" target = 50        go to 50
"Valve_M" move = -10         go 10 back
"Valve_M" run = 2            keep turning at 2 per second (0 stops)
stop "Valve_M"               stop now
"Valve_M" home = true        find the home switch
wait "Valve_M" moving == false
```

(Aller à 50 ; reculer de 10 ; tourner sans arrêt à 2 par seconde, 0 arrête ; arrêter maintenant ; chercher le contact d'origine ; attendre la fin du mouvement.)

La Mega a besoin de la bibliothèque **AccelStepper** et de `USE_STEPPER` réglé à 1 dans son sketch. Les détails sont dans `docs/DEVICE_PROTOCOL.md`. Le micrologiciel n'a pas encore été essayé sur un vrai moteur.
