# Pompes DC, vitesse des pompes et caractéristiques des pompes {#dc-pumps-pump-speed-and-pump-facts}

Chaque pompe peut dire avec quoi elle est alimentée, à quoi elle sert, à quelle vitesse elle tourne et ses caractéristiques (Règle Skynet 18.32). Toute pompe peut être
mise en marche et arrêtée ; une pompe DC sur un Port PWM peut aussi tourner plus lentement (vitesse PWM). La liste des pompes est dans le
document DC Brewing Pumps (docs/DC_Brewing_Pumps.md).

## Les nouveaux réglages de la pompe {#the-pump-s-new-settings}

Double-cliquez sur une pompe (ou ouvrez-la depuis le Build Tab). Sous l'**Overlay** se trouvent :

| Réglage | Ce qu'il fait |
|---|---|
| **Model** | Quelle pompe c'est : Topsflo TD5, March 809 DC, DDMETER HB-MP20, BrewTaurus 24 V, bayite, une pompe 12 V de type solaire, les pompes à glycol Penguin, la pompe de refroidissement Grainfather GF30, une petite pompe immergée, ou celles en AC (March 809 et 815, Chugger, RipTide, KegLand MKII, BrewZilla Gen 4). Un dessin de pompe Skynet choisit son modèle tout seul, et alors il est grisé. **Other** = une pompe qui n'est pas dans la liste. |
| **⬢** à côté de Model | Les **Pump Facts** : Flow (débit), Lift (jusqu'où elle pousse en hauteur), Hottest Liquid (liquide le plus chaud) et Ports. Une caractéristique que le modèle connaît est remplie et grisée ; une que le modèle ne connaît pas, et toutes celles d'une pompe User Defined, sont des cases à remplir. **Ports** est une liste : TC1.5, TC2, TC3/4, TC1/2, FPT1/2, FPT3/4, FPT1, MPT1/2, MPT3/4, MPT1, BSP1/4, BSP3/8, BSP1/2, BSP3/4, BSP1, DN8, DN10, DN15, DN20, DN25. Un raccord change un port, donc on peut toujours le choisir : les pompes d'OakBarn Brewery sont arrivées avec des ports FPT1/2 ou FPT1 et chacune a été passée en TC1.5 en ajoutant un raccord Tri-Clamp. Seul un port Tri-Clamp que le modèle a pour sûr est grisé. |
| **Power** | AC 120 V ou AC 240 V (courant de la maison), DC 12 V ou DC 24 V (depuis un bloc d'alimentation). Un dessin de pompe Skynet montre celui de son modèle, par exemple AC 120 V (courant de la maison). Son Hover Help commence par l'avertissement électrique plus bas. Connu par le modèle, il est grisé. |
| **Use** | Grisé : **Hot & Cool** (chaud et froid), ou Cold (glycol, eau glacée) pour une pompe à glycol. Il vient du modèle. |
| **Speed Control** | **On/Off only** (marche-arrêt seulement), ou **PWM speed**. Affiché seulement pour les pompes PWM (une pompe DC, ou une réglée en PWM) ; une pompe AC est On/Off only. |
| **Speed %** | Avec PWM speed : à quelle vitesse elle tourne quand elle est en marche, 0 à 100 (vide = 100). |

La case d'ajout les a aussi, donc une nouvelle pompe peut être réglée en **PWM speed** avant de choisir son Port : alors seuls les Ports PWM sont listés
(une Mega : D2-D13 et D44-D46 ; un Raspberry Pi : n'importe quelle broche). Si une pompe PWM est sur un Port qui ne peut pas faire un vrai PWM, ses Properties le disent,
et la pompe tourne seulement à pleine vitesse ou à l'arrêt.

## L'utiliser {#using-it}

- **Un clic** sur la pompe la met toujours en marche ou l'arrête (Règle Skynet 2.33). Une pompe PWM tourne à son **Speed %** tant qu'elle est en marche.
- **Gardez la souris sur une pompe** pour voir ses caractéristiques : modèle, alimentation, usage, vitesse, débit, hauteur, liquide le plus chaud, ports.
- Un **Process** peut changer la vitesse : `Pump_Name.speed = 60` (et la lire : `if Pump_Name.speed < 50`).

## Câblage {#wiring}

Une pompe n'est jamais câblée directement sur une broche de carte. La broche commande un **relais** (On/Off) ou un **module de commutation (MOSFET)** (On/Off ou
vitesse PWM) qui porte le 12 V ou le 24 V propre à la pompe. Une pompe AC demande un relais ou un SSR (relais statique) prévu pour elle.
Une pompe DC sans balais avec son propre pilote (la plupart des plus récentes) peut ne pas aimer le PWM : essayez d'abord à vitesse lente, et revenez à
On/Off only si elle hoquette ou bourdonne.

**⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.**
