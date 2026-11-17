# Pompes DC, vitesse des pompes et caractéristiques des pompes {#dc-pumps-pump-speed-and-pump-facts}

Chaque pompe peut dire avec quoi elle est alimentée, à quoi elle sert, à quelle vitesse elle tourne et ses caractéristiques (Règle Skynet 18.32). Toute pompe peut être
mise en marche et arrêtée ; une pompe DC sur un Port PWM peut aussi tourner plus lentement (vitesse PWM). La liste des pompes est dans le
document DC Brewing Pumps (docs/DC_Brewing_Pumps.md).

## Les nouveaux réglages de la pompe {#the-pump-s-new-settings}

Double-cliquez sur une pompe (ou ouvrez-la depuis le Build Tab). Sous l'**Overlay** se trouvent :

| Réglage | Ce qu'il fait |
|---|---|
| **Model** | Quelle pompe c'est : Topsflo TD5, March 809 DC, DDMETER HB-MP20, BrewTaurus 24 V, bayite, une pompe 12 V de type solaire, les pompes à glycol Penguin, la pompe de refroidissement Grainfather GF30, une petite pompe immergée, ou celles en AC (March 809 et 815, Chugger, RipTide, KegLand MKII, BrewZilla Gen 4). Un dessin de pompe Skynet choisit son modèle tout seul, et alors il est grisé. **Other** = une pompe qui n'est pas dans la liste. |
| **⬢** à côté de Model | Les **Pump Facts** du modèle, à regarder : **Power** (AC 120 V ou AC 240 V, courant de la maison ; DC 12 V ou DC 24 V, depuis un bloc d'alimentation ; son Hover Help commence par l'avertissement électrique plus bas), **Use** (**Hot & Cool**, chaud et froid, ou Cold pour une pompe à glycol ; il vient du modèle et ne peut pas être changé), Flow (débit), Lift (jusqu'où elle pousse en hauteur) Hottest Liquid (liquide le plus chaud ; pomper un liquide qui bout n'est pas recommandé à cause de la cavitation : le liquide chaud se change en bulles de vapeur dans la pompe) et Self Priming (auto-amorçante : No pour la plupart des pompes de brasserie, la RipTide et toutes les pompes March aussi ; la pompe doit être plus bas que le liquide et remplie avant d'être mise sur On). Sous le nom, **Where from** indique la page web d'où viennent ces données. La plupart viennent de recherches sur Internet (magasins, avis), pas du site officiel du fabricant : ce sont des informations, pas des faits ; Self Priming vient d'OakBarn Brewery. Rien ne peut y être changé : son seul bouton est **◀ Back**. Pour une pompe User Defined (**Other**), les caractéristiques y sont tapées. |
| **Inlet Fitting** et **Outlet Fitting** | Deux lignes là où était Power : l'Inlet Fitting est là où le liquide entre dans la pompe, l'Outlet Fitting là où il sort. Chacun se choisit séparément. Faites correspondre les raccords de VOTRE pompe : TC1.5, TC2, TC3/4, TC1/2, FPT1/2, FPT3/4, FPT1, MPT1/2, MPT3/4, MPT1, BSP1/4, BSP3/8, BSP1/2, BSP3/4, BSP1, DN8, DN10, DN15, DN20, DN25. Un raccord change un port, donc on peut toujours choisir chacun : les pompes d'OakBarn Brewery sont arrivées avec des ports FPT1/2 ou FPT1 et chacune a été passée en TC1.5 en ajoutant un raccord Tri-Clamp. Seul un port Tri-Clamp que le modèle a pour sûr est grisé. |
| **Speed Control** | **On/Off only** (marche-arrêt seulement), ou **PWM speed**. Affiché seulement pour les pompes PWM (une pompe DC, ou une réglée en PWM) ; une pompe AC est On/Off only. |
| **Speed %** | Avec PWM speed : à quelle vitesse elle tourne quand elle est en marche, 0 à 100 (vide = 100). |

La case d'ajout les a aussi, donc une nouvelle pompe peut être réglée en **PWM speed** avant de choisir son Port : alors seuls les Ports PWM sont listés
(une Mega : D2-D13 et D44-D46 ; un Raspberry Pi : n'importe quelle broche). Si une pompe PWM est sur un Port qui ne peut pas faire un vrai PWM, ses Properties le disent,
et la pompe tourne seulement à pleine vitesse ou à l'arrêt.

## L'utiliser {#using-it}

- **Un clic** sur la pompe la met toujours en marche ou l'arrête (Règle Skynet 2.33). Une pompe PWM tourne à son **Speed %** tant qu'elle est en marche.
- **Gardez la souris sur une pompe** pour voir ses caractéristiques : modèle, alimentation, usage, vitesse, débit, hauteur, liquide le plus chaud, ports.
- Un **Process** peut changer la vitesse : `Pump_Name.speed = 60` (et la lire : `if Pump_Name.speed < 50`).

## Auto-amorçage et liquide chaud {#self-priming-and-hot-liquid}

- **Une pompe auto-amorçante** peut être placée plus haut que le liquide et l'aspirer seule sur quelques pieds (hauteur d'aspiration).
  Certaines doivent avoir leur corps (carter) rempli de liquide une fois, la première fois ; une pompe à membrane peut même démarrer à
  sec. La hauteur qu'elle peut aspirer change d'une pompe à l'autre : voyez le chiffre du fabricant.
- **Une pompe qui n'est pas auto-amorçante** (la plupart des pompes de brasserie, la Blichmann RipTide aussi) doit être **plus bas que
  le liquide** qu'elle aspire et être **pleine de liquide** avant d'être mise sur On. Pour la remplir (l'amorcer), laissez le liquide
  entrer et ouvrez sa purge d'air jusqu'à ce que du liquide sorte. À sec, elle ne pompe rien et peut être abîmée.
- **Plus bas que le liquide, c'est plus facile pour toute pompe**, auto-amorçante ou non.
- **Le moût chaud est plus difficile à aspirer.** Près de l'ébullition, le liquide se change en bulles de vapeur dans la pompe
  (cavitation) : elle perd son débit et peut être abîmée. Pomper un liquide qui bout n'est pas recommandé. Gardez une pompe du côté
  chaud plus bas que la cuve, avec le tuyau d'entrée le plus court et le plus large possible.

## Câblage {#wiring}

Une pompe n'est jamais câblée directement sur une broche de carte. La broche commande un **relais** (On/Off) ou un **module de commutation (MOSFET)** (On/Off ou
vitesse PWM) qui porte le 12 V ou le 24 V propre à la pompe. Une pompe AC demande un relais ou un SSR (relais statique) prévu pour elle.
Une pompe DC sans balais avec son propre pilote (la plupart des plus récentes) peut ne pas aimer le PWM : essayez d'abord à vitesse lente, et revenez à
On/Off only si elle hoquette ou bourdonne.

**⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.**
