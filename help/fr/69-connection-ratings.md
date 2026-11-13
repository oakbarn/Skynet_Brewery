# Notes de connexion {#connection-ratings}

Chaque carte (Interface) sur la page **Devices** montre une **note de connexion** : à quel point son lien avec le Brain (le Pi ou le mini PC) est sûr. L'USB est un câble direct vers le Brain. Ethernet et le WiFi dépendent de votre réseau. Sur chaque lien, la carte met toutes ses sorties sur OFF si elle n'entend rien du Brain pendant son **lost link delay** (délai de lien perdu, voir plus bas).

## Arduino Mega (et autres cartes de type Arduino) {#arduino-mega-and-other-arduino-type-boards}

| Rang | Type | Note |
|---|---|---|
| 1 | USB | **Best** (le meilleur) : le plus sûr, le plus fiable |
| 2 | Ethernet (shield W5500 / W5100, ou un pont Ethernet ESP32) | **OK** : dépend du réseau. Si le réseau tombe, la carte met toutes ses sorties sur OFF après le délai de lien perdu |
| 3 | WiFi (par un pont ESP32) | **Poor** (faible) : le WiFi peut souvent couper |

## ESP32

| Rang | Type | Note |
|---|---|---|
| 1 | USB | **Best** |
| 2 | Ethernet | **Good** (bon) |
| 2 | WiFi | **Good**, tant qu'aucun Device de chauffe n'est dessus |

## Devices de chauffe {#heating-devices}

Un Device de chauffe est une résistance électrique, une vanne de gaz ou un allumeur de brûleur, un tapis chauffant, ou la sortie d'un PID, d'une Hysteresis ou d'un Duty Cycle. Vous **pouvez** en mettre un sur une carte Ethernet ou WiFi, mais le panel vous avertit quand vous l'enregistrez, et la **Connection** de cette carte montre ⚠ avec les Devices de chauffe nommés. En WiFi, la note d'un ESP32 tombe à **Poor**. L'USB est le plus sûr.

## Délai de lien perdu {#lost-link-delay}

Chaque carte a sa propre case **Lost link: all OFF after** sur la page **Devices** (Admin). Si la carte n'entend rien du Brain pendant ce nombre de secondes, elle met **toutes ses sorties sur OFF** (chauffages, pompes, vannes, moteurs). C'est 10 secondes sauf si vous le changez, et cela peut aller de 3 à 600 secondes. Le Brain parle à chaque carte toutes les 2 secondes, donc un délai court réagit vite mais peut se déclencher sur un petit hoquet du réseau ; un délai long passe les hoquets mais laisse un chauffage allumé plus longtemps. Pour un Device de chauffe sur une carte réseau, gardez-le court.

La carte reçoit le délai à chaque connexion, donc un changement prend effet tout de suite. Les cartes ont besoin du nouveau sketch (firmware 0.4) pour cela ; un firmware plus ancien garde 10 secondes.

## Choisir la carte {#picking-the-board}

Quand vous ajoutez une Interface, choisissez sa **Board** (carte) et son **Type** ; la note s'affiche à côté. Pour une Interface ajoutée avant, choisissez sa carte dans la colonne **Board** (un nom contenant « ESP » est pris pour un ESP32, tout le reste pour un Mega).

## Broche 10 sur un Mega Ethernet {#pin-10-on-an-ethernet-mega}

Le shield Ethernet d'un Arduino Mega utilise la **broche D10** (Règle Skynet 6.10). Donc :

- Sur un Mega en **Ethernet**, aucun Device ne peut utiliser la broche D10. La liste des broches ne la propose pas, et la taper est refusé.
- Une Interface Mega **ne peut pas passer de l'USB à l'Ethernet** tant qu'un Device est sur la broche D10 (par exemple en la retirant puis en la rajoutant en Ethernet, ou en passant du simulateur à une vraie carte Ethernet). Le panel nomme le Device et vous demande de le déplacer d'abord, **avec son câblage**, sur une autre broche libre. Une fois la broche 10 libre, le changement passe.
- En USB, la broche D10 est une broche PWM normale.

## Cartes SD : non prises en charge {#sd-cards-not-supported}

La broche **D4** est la broche de carte SD du shield Ethernet (Règle Skynet 6.11). **SD Card Not Supported. Never insert an SD Card!** (Carte SD non prise en charge. N'insérez jamais de carte SD !)

- Vous pouvez quand même utiliser D4 pour un Device sur un Mega, mais le panel vous avertit d'abord. Appuyez sur **OK** pour l'utiliser quand même ou sur **Cancel** pour choisir une autre broche. Dans la liste des broches, D4 est marquée **SD card pin**.
- Le sketch Ethernet (firmware 0.5) garde la fente SD éteinte et la vérifie toutes les 10 secondes. Si une carte est dans la fente, chaque panel ouvert affiche **"SD Card Not Supported. Remove the SD Card!"** (retirez la carte SD) et la ligne de la carte sur la page **Devices** l'affiche en rouge jusqu'à ce que la carte soit retirée.
