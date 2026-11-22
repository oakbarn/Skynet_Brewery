# Une seule résistance, choisissez comment elle chauffe {#one-heating-element-pick-how-it-heats}

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

> **Ce qui décide de la précision :** la **sonde** (une DS18B20 lit à environ ±0,9 °F près), **sa place**, le **mélange** du liquide
> et son **étalonnage** comptent bien plus que la façon de commuter la résistance. Réglez-les d'abord.

Une résistance chauffante est **un seul Device**, quelle que soit la façon de la commander. Sa façon de chauffer est sa **méthode de chauffe**, et vous pouvez la changer
pendant le brassage, d'un clic ou depuis un Process (Règle Skynet 6.19).

| Méthode de chauffe | Ce qu'elle fait | Demande une sonde de température |
|---|---|---|
| **Direct** | Tout ou rien. | Non |
| **PWM** | Un % que vous ou un Process réglez (par exemple 60 %), envoyé sur un port PWM. | Non |
| **Duty Cycle** | En marche pendant un % de chaque cycle (par exemple 60 % pour une ébullition vive). | Non |
| **Hysteresis** | En marche sous le Setpoint, arrêtée quand elle y arrive. | Oui |
| **PID** | Tient une température de Setpoint en calculant son propre %. | Oui |
| **Deadband** | Monte ou baisse son % par paliers vers le Setpoint. | Oui |
| **Precise** | Un PID calme qui tient un Setpoint à 0,1 degré près, pour la colonne d'un alambic ou un bain-marie (voir Precise heating). | Oui, une sonde fine |

## En ajouter une : choisir sa méthode {#adding-one-pick-its-method}

**Select Device Type > Heating Element** (ou la liste Heating Element de la barre Edit layout) a une ligne pour chaque méthode :
**Heating Element: DO On/Off**, **PWM**, **DutyC**, **HYS**, **PID**, **Precise** et **Deadband**, puis **RIMs Tube** et **Vessel Device
Template**. Chaque ligne crée la même résistance chauffante **unique** ; la ligne choisit seulement la méthode avec laquelle elle démarre.
Après la fenêtre Add, ses Properties s'ouvrent avec les **Settings** de cette méthode par-dessus, pour la régler d'abord. Elle peut
toujours utiliser les autres méthodes plus tard.

**Le Hardware Controller et le port décident comment un % arrive à la résistance** (seul un DAC / 0-10 V sur un port PWM reçoit du PWM, voir [Quelle méthode et quel câblage ?](#which-method-and-which-wiring)).
La ligne **PWM** propose d'abord les ports PWM et commence avec le Hardware Controller **DAC / 0-10 V**. Les Settings de chaque méthode montrent une note qui dit sur quel genre de port elle est.

## Cliquez dessus pendant le brassage {#click-it-while-brewing}

**Un clic** sur la résistance sur son Tab la met **en marche ou à l'arrêt** tout de suite, dans la méthode où elle est, comme une pompe (Règle Skynet
2.33). Sa fenêtre s'ouvre depuis un **bouton de méthode** (plus bas), ou par **Heating method…** dans la fenêtre SetPoint de sa sonde de température. La fenêtre montre :

1. **Heating method** : un bouton pour chacune. Celle utilisée maintenant est marquée. **Un clic sur une méthode y passe tout de suite**
   (pas besoin de Set) ; la fenêtre reste ouverte pour son réglage. Hysteresis, PID, Deadband et Precise sont grisées tant que l'Element n'a pas de
   **Temperature Probe** (dans ses Properties).
2. Le réglage principal de cette méthode, avec **−** et **+** : le **Duty cycle %**, ou le **Setpoint**.
3. **Set + ON** (ou **ON** pour Direct), **OFF**, **Set** (changer, en laissant en marche ou à l'arrêt tel quel) et **Cancel**.

Rien dans la fenêtre ne se met en marche avant que vous cliquiez sur **Set + ON** ou **ON**, avec une exception : en **Duty Cycle**, le % est aussi sa marche et son
arrêt. Un Duty cycle % de **0 arrête la résistance**, et **au-dessus de 0 la met en marche** si elle était arrêtée, que vous le régliez ici ou qu'un
Process le règle (Règle Skynet 6.19).

**Changez le % ou le Setpoint directement sur le Tab.** L'affichage de la résistance montre ce qu'elle fait et, dans une case verte sur la
même ligne, le nombre que vous réglez, comme le **SV** d'un régulateur de tableau :

- **Duty Cycle :** la case verte est son **Duty cycle %**, par exemple **60 %** (à l'arrêt : **idle 60 %**).
- **Hysteresis, PID, Deadband, Precise :** la case verte est son **SV** (le Setpoint) avec °F ou °C, par exemple **idle SV 152.0 °F**,
  **HEAT SV 152.0 °F** ou **45 % SV 152.0 °F**.
- **Direct** et **PWM** n'ont pas de case verte.

**Un clic sur la case verte** permet d'y taper un nouveau nombre. Appuyez sur **Entrée** pour le régler (ou cliquez ailleurs après l'avoir changé) ;
**Échap** le remet comme avant. Un nouveau Setpoint ne met jamais la résistance en marche ou à l'arrêt et ne change jamais sa méthode. Un nouveau
Duty cycle % suit la règle ci-dessus : **0 l'arrête**, **au-dessus de 0 la met en marche**. Un clic ailleurs sur la résistance la met toujours en
marche ou à l'arrêt. Si un Process tourne, il peut régler le nombre de nouveau à son étape suivante. La case verte n'apparaît pas en Edit layout,
avec l'aspect Dial ou Bar, ni quand son **Data Display** choisit une seule valeur.

## Hysteresis

L'hystérésis garde l'eau près du **Setpoint** en mettant la résistance en marche et à l'arrêt.
La résistance de la HLT : **Setpoint** 150 °F, **Direction** Heating, **Offset (−)** −1.

- La résistance commence à chauffer.
- L'eau atteint le Setpoint, 150 °F : la résistance s'arrête.
- L'eau refroidit jusqu'à Setpoint - Offset, 149 °F (150 −1) : la résistance se remet en marche.
- L'eau atteint le Setpoint, 150 °F : la résistance s'arrête de nouveau.
- L'eau refroidit encore, et le cycle marche-arrêt de l'hystérésis se répète.

**Delay** 0 : elle se met en marche dès que l'eau atteint 149 °F.

**Hardware Controller** Optical SSR : l'Offset peut aller de −0.5 à −3 °F, et il commence à −0.5. Un contacteur ou un relais mécanique peut utiliser
−1 à −5 °F avec un Delay d'au moins 10 secondes, et il commence à −1 et 10 secondes. Ainsi il claque moins souvent et dure plus longtemps.

**Predictive** activé : l'eau continue de chauffer un peu après l'arrêt. Skynet apprend de combien, et arrête d'autant plus tôt, pour que l'eau
s'arrête à 150 °F.

### Le côté technique {#the-technical-side}

- **Ce que c'est.** L'hystérésis est une régulation tout ou rien (aussi appelée régulation à deux points ou « bang-bang ») avec un écart entre ses deux
  points de bascule. Elle se met en marche à Setpoint + Offset (150 + (−1) = 149 °F) et s'arrête au Setpoint (150 °F). L'écart de 1 °F est la
  **bande d'hystérésis**. En refroidissement (Cooling), l'Offset est (+) : +1 met en marche à 151 °F et arrête à 150 °F.
- **Pourquoi l'écart.** Sans écart, la résistance basculerait à chaque petit pas de la lecture de la sonde. Une sonde DS18B20
  lit par pas de 0,0625 °C (0,11 °F), donc la résistance se mettrait en marche et à l'arrêt de nombreuses fois par minute. On appelle cela le battement, et il
  use les relais et les contacteurs. La bande l'empêche.
- **Pourquoi elle dépasse.** Quand la résistance s'arrête, sa gaine métallique est encore plus chaude que l'eau, et cette chaleur continue d'entrer.
  La chaleur met aussi du temps à aller de la résistance à la sonde. L'eau monte donc au-delà du Setpoint après l'arrêt. On appelle cela
  l'inertie thermique ou le temps mort.
- **Ce que fait Predictive.** Skynet mesure de combien l'eau monte après chaque arrêt (la montée sur l'élan), et abaisse les deux points de bascule
  d'autant. Le décalage n'est jamais plus de la moitié de l'Offset (0,5 °F pour −1). L'écart reste le même, donc la résistance ne
  bascule pas plus souvent. Cela le rend sûr pour un compresseur.
- **À quelle fréquence elle cycle.** Chaque cycle dure à peu près le temps de chauffer l'eau à travers la bande. L'eau demande 1 BTU par livre et par °F.
  Par exemple, 15 gallons font environ 125 lb, donc 1 °F demande 125 BTU, soit environ 37 wattheures. Une résistance de 5500 W les fournit en environ
  24 secondes, plus ce que la cuve perd dans l'air. Une bande plus large donne des cycles plus longs et moins nombreux.
- **Pourquoi les plages du Hardware Controller.** Un Optical SSR (relais statique) n'a pas de pièces mobiles et bascule quand l'onde alternative
  passe par zéro, donc il peut basculer souvent : −0.5 à −3 °F. Un contacteur ou un relais mécanique n'est prévu que pour un certain nombre de fermetures, et chaque
  fermeture fait un petit arc. C'est pourquoi il lui faut une bande plus large (−1 à −5 °F) et un Delay d'au moins 10 secondes (Règle 6.29).

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.

## Quelle méthode et quel câblage ? {#which-method-and-which-wiring}

### Comment Skynet envoie la puissance {#how-skynet-sends-the-power}

- **Direct** et **Hysteresis** ne font que tout On ou tout Off. N'importe quel port les fait de la même façon.
- **Duty Cycle** est en marche pendant son % de chaque cycle, un cycle de quelques secondes, donc un port simple le fait.
- **PWM**, **PID**, **Deadband** et **Precise** travaillent avec un % : PWM utilise le % que vous ou un Process réglez, les autres le
  calculent d'après la sonde. **Le Hardware Controller et le port décident comment ce % sort :**
  - **Hardware Controller DAC / 0-10 V sur un port PWM** l'envoie en PWM. Branchez-le à un **module PWM vers 0-10 V et un variateur de puissance 0-10 V**, pas directement à
    un SSR à passage par zéro : la carte commute des centaines de fois par seconde et un SSR à passage par zéro ne peut suivre que
    120 fois par seconde (60 Hz), donc la puissance sort irrégulière.
  - **Tout le reste** (un Optical SSR, un Contactor ou un Mechanical relay, sur n'importe quel port, ou un DAC / 0-10 V sur un port
    simple) met la résistance tout en marche pendant son % de chaque **Output window** (un « Pseudo PID »), donc un SSR sur un port PWM est sans danger. Avec un SSR,
    c'est le bon choix. Elle s'allume et s'éteint plusieurs fois par minute, ce qui **use vite tout organe de commutation mécanique** :
    un relais mécanique, un module de relais mécaniques (les cartes relais Arduino courantes), un contacteur, une minuterie motorisée
    ou mécanique. Utilisez un **relais statique (SSR)**.

### Quel câblage {#which-wiring}

| Branché à | Port | Bonnes méthodes | Remarque |
|---|---|---|---|
| **SSR à passage par zéro** (relais statique) | N'importe lequel (Hardware Controller Optical SSR) | Toutes | Le choix habituel. Sur un port PWM il reçoit quand même le Pseudo PID, jamais le PWM rapide. |
| **Contacteur** ou relais mécanique (ils claquent) | Simple | Direct, Hysteresis (ou un long temps de cycle) | S'use s'il commute souvent. |
| **Variateur de puissance 0-10 V** (par un module PWM vers 0-10 V) | PWM, Hardware Controller DAC / 0-10 V | PWM, PID, Deadband, Precise | Puissance douce de 0 à 100 %. Coûte plus, chauffe plus, fait du bruit électrique. |

### Où cela fait une différence {#where-it-makes-a-difference}

- **Une cuve ou un HLT :** l'eau met des minutes à changer d'un degré, donc un SSR à passage par zéro sur un port simple la tient aussi
  bien qu'une puissance douce.
- **Un RIMS tube :** peu d'eau passe vite devant la résistance, donc une puissance douce (0-10 V) veut dire moins de pulsations et
  moins de brûlé.
- **La colonne d'un alambic ou un bain-marie tenu à 0,1 degré :** utilisez **Precise**, une sonde fine (une PT100) et une puissance douce.

### PID ou Precise {#pid-or-precise}

**La méthode compte plus que le câblage.** L'hystérésis dépasse : elle chauffe à pleine puissance jusqu'au Setpoint et la résistance
chauffe encore un peu après. PID et Precise ralentissent en approchant.

**Precise est un PID avec des extras.** Il utilise les mêmes Kp, Ki et Kd, donc il faut toujours le régler : de mauvais nombres rendent
Precise mauvais aussi. Avec les mêmes nombres, il fait en général mieux que PID : moins de dépassement après une chauffe (sa partie I ne
s'accumule pas), une sortie plus calme quand la lecture de la sonde saute (il lisse la lecture), et une puissance exacte sur un port
simple (le temps restant passe à la fenêtre suivante). Voir Precise heating.

**Auto-tune (prévu, pas encore dans le Panel) :** un bouton pour PID et Precise. Avec de l'eau au-dessus de la résistance, Skynet la
mettra tout On et tout Off autour du Setpoint pendant quelques oscillations, mesurera la durée et la taille de chacune, et calculera
Kp, Ki et Kd ; vous verrez alors les nouveaux nombres à côté des anciens et choisirez Use ou Keep old.

## Sa méthode principale et les autres méthodes permises {#its-main-method-and-the-other-methods-allowed}

Quand vous la construisez (et plus tard dans ses Properties), la partie **Heating method** a ces lignes :

- **Current Method** : la méthode où elle est. La liste ne contient que les méthodes utilisées (voir Use Method plus bas). La fenêtre
  s'ouvre sur celle où elle est maintenant. À côté, **Short Label** passe ses bulles en noms courts (DO, DutyC, HYS ...). Le **⬢**
  rouge au bout de la ligne ouvre les **Settings de la Current Method** (par exemple Hysteresis Settings).
- **On / Off** : sur la même ligne, une petite image de la résistance. Un clic la met en marche ou à l'arrêt tout de suite, comme un clic dessus sur
  le Tab. On / Off est la résistance elle-même ; **Direct** est une méthode (simplement marche ou arrêt), donc une résistance en Direct en marche chauffe à 100 %.
- **Method Settings** : un bouton **⬢** pour chaque méthode (Direct, PWM, Duty Cycle, Hysteresis, PID, Deadband, Precise), avec **✔ Used** ou
  **Not used** dessous. **Chaque méthode a sa propre fenêtre de réglages** : cliquez sur son ⬢ pour l'ouvrir. Voir [Les réglages de chaque méthode](#each-method-s-settings).
- **Control Method** : une bulle pour chaque méthode utilisée, la Current Method en **rouge**, les autres en **jaune**. Ce sont les mêmes
  bulles que sous la résistance sur son Tab, et elles marchent ensemble : **cliquez sur Duty Cycle ici ou sur le Tab** et Duty Cycle devient la
  Current Method aux deux endroits, en rouge, et la précédente passe en jaune.

Une résistance **intégrée à un Vessel Device ou à un RIMS tube** marche de même : ouvrez ses Properties (double-cliquez dessus, ou sur son ⚙) pour
sa Heating method et les autres méthodes permises. Les anciens Schemas dont la résistance intégrée était un Device Hysteresis ou PID séparé
sont changés en Heating Element au chargement, en gardant son nom et ses réglages.

## Les réglages de chaque méthode {#each-method-s-settings}

Chaque méthode garde ses propres réglages, donc vous pouvez préparer la méthode suivante avant d'y passer. Exemple : l'élément du HLT
est en Hysteresis. Pour faire bouillir en Duty Cycle, cliquez sur **⬢ Duty Cycle**, mettez **Use Method** sur On, réglez le
**Duty cycle %** et cliquez sur **💾 Keep**. Puis **💾 Save** les Properties. Duty Cycle est alors dans la liste Current Method, il a une
bulle, et un Process peut y passer.

Sa fenêtre a son titre, **✖ Cancel** et **💾 Keep** figés en haut pendant que le reste défile (pas de boutons en bas). Keep met les
réglages dans les Properties ; ils sont enregistrés quand vous faites Save dans les Properties.

- **Use Method** (un interrupteur, en haut) : **On** permet de choisir la méthode : dans la liste Current Method, par sa bulle ici et
  sur le Tab, par un Method Clone et par un Process. **Off** : elle ne peut pas être choisie, et **tous ses autres réglages sont
  cachés** (ils sont gardés pour plus tard). **Direct** et la **Current Method** sont toujours sur On (grisés). Quand vous choisissez une
  nouvelle Current Method, la précédente reste utilisée.
- **Direct** : rien à régler ; elle est simplement tout On ou tout Off.
- **PWM** : **Power %** et **Output window (s)** (utilisé seulement sur un port simple).
- **Duty Cycle** : **Duty cycle %** et **Cycle time (ms)**.
- **Hysteresis** : la **Temperature Probe** et son **Setpoint** sur une ligne. **Direction** est Heating, avec l'**Offset (-)** à
  côté (-1 la met en marche 1 degré sous le Setpoint), choisi dans une liste (chaque demi-degré que permet son Hardware Controller).
  **Predictive** a le **Delay** à côté. Un petit dessin à côté de chacun montre la température (rouge) allant entre le Setpoint (bleu)
  et l'Offset (jaune).
- **PID**, **Deadband** et **Precise** : la **Temperature Probe** et son **Setpoint**, puis leurs propres nombres (Kp, Ki, Kd, Max
  output ...) et **Reversed** (refroidissement). Precise dit aussi si sa sonde peut voir 0,1 degré. Une note dit si son port est un
  port PWM ou un port simple (voir [En ajouter une : choisir sa méthode](#adding-one-pick-its-method)).

La **Temperature Probe** et le **Setpoint** sont partagés : réglez-les dans la fenêtre d'une méthode et les autres utilisent les mêmes.

Choisir une méthode, ou mettre son Use Method sur On, **ne met jamais la résistance en marche** (Règle 6.19).

## Boutons de méthode en un clic {#one-click-method-spots}

Quand **deux méthodes ou plus** sont permises, un petit bouton pour chacune s'affiche **sous la résistance** sur son Tab, ou sous son image sur
un **Vessel Device** quand elle y est intégrée. **Un clic** sur l'un passe la résistance à cette méthode tout de suite ; celle utilisée est en **rouge**, les autres
en **jaune**. Il n'y a pas de bouton d'arrêt : un clic sur l'image l'arrête. Les boutons sont dans une case invisible aussi large que les méthodes permises, centrée sous l'image, et peuvent afficher des noms courts ([Les résistances et les vannes à l'écran](179-heating-element-look)).
**Un clic sur l'image de la résistance** sur son Vessel Device la met **en marche ou à l'arrêt** tout de suite, dans la méthode où elle est, comme une pompe.
Un clic sur sa **case** (la tuile avec sa lecture) ouvre sa fenêtre, avec **ON**, **OFF** et sa méthode.
Quand la résistance est **arrêtée**, un clic sur un bouton de méthode change seulement sa méthode ; elle reste arrêtée jusqu'à ce que vous la mettiez en marche.
Plusieurs résistances peuvent être en marche en même temps (par exemple sur des circuits électriques différents). Avec seulement la méthode principale, aucun bouton ne s'affiche.

Exemple : la résistance HLT de Tartan sur le port 42 du Main Panel montre **Duty Cycle** et **PID** : un clic sur Duty Cycle pour l'ébullition, un
clic sur PID pour tenir la température d'empâtage.

**Montrer ou cacher les boutons de méthode.** Les boutons de méthode sont **cachés** au départ, pour que le Tab reste propre. Une
bande là où entre la résistance, de sa **plaque d'extrémité jusqu'au-delà de la paroi du Vessel** (à côté de l'image d'une résistance seule), les
montre en **un clic** et les cache au suivant. Ça marche avec n'importe quelle image de Vessel. Chaque écran garde son propre choix, et
rien ne se met en marche ni ne s'arrête.

**Un affichage qui ne saute pas.** La sortie d'un PID montre toujours deux chiffres (05 %, 45 %, puis 100 %), et idle, HEAT et COOL
prennent la même place, donc la case SV à côté ne bouge jamais.

## Ctrl + clic pour les Settings d'une méthode {#ctrl-click-for-a-method-s-settings}

Sur un Tab en marche (pas en Edit layout), **Ctrl + cliquez un bouton de méthode** (**⌘ + clic** sur un Mac, où Ctrl + clic est le clic
droit et ouvre l'aide) pour ouvrir les Settings de cette méthode pour cette résistance, par exemple **HLT Heater: Duty Cycle Settings**.
Ctrl + cliquez l'**image de la résistance** (seule, sur son Vessel Device, ou un Picture Widget qui la suit) pour ouvrir les Settings de
la méthode où elle est ; Ctrl + cliquez un **Method Clone** pour sa propre méthode.

- **Rien ne s'allume ni ne s'éteint, et la méthode ne change pas.** Un simple clic agit toujours tout de suite.
- C'est la même fenêtre que le **⬢** de la méthode dans les Properties. **💾 Save** l'enregistre tout de suite. La résistance reste en
  marche ou à l'arrêt dans la même méthode ; un nouvel Offset, Delay ou Kp agit tout de suite, et un nouveau Setpoint est envoyé tout de suite aussi.
- **Admins seulement.** Les autres comptes reçoivent une courte note.
- Les changements de tous les jours restent à un clic : la fenêtre **SetPoint** depuis la sonde de température, et la fenêtre de la
  résistance (**Heating method…**) pour la méthode et son Duty cycle %. Toutes les autres Properties se changent en **Edit layout**, où
  Ctrl + clic ouvre les Properties comme un double-clic.

Exemple : la HLT Heater chauffe en **PID**. Ctrl + cliquez **Duty Cycle** sous elle : les **Duty Cycle Settings** s'ouvrent, et la HLT
Heater continue de chauffer en PID.

## Method Clones : une tuile par méthode {#method-clones-one-tile-per-method}

Pour montrer une résistance en tuiles séparées, une par méthode côte à côte, ajoutez un **Method Clone** (Règle 4.4) :
en Edit layout, ouvrez **⧉ Clone Device** et choisissez la résistance sous **Method Clone**. Il peut aller sur le Tab de la résistance elle-même. Dans ses
Properties, choisissez la **Control Method** qu'il représente et, si vous voulez, son propre **Label**.

- **Un clic** sur la tuile agit exactement comme un clic sur la résistance, tout à l'unisson, sans fenêtre : si elle affiche ON, elle arrête la
  résistance ; si elle affiche OFF, elle passe la résistance à cette méthode et la met en marche.
- La tuile affiche **ON** seulement tant que la résistance est en marche **dans cette méthode** ; sinon elle affiche OFF.
- La résistance elle-même montre toujours ce qu'elle fait dans la méthode qu'elle utilise.

## Depuis un Process {#from-a-process}

```
hE_HLT_1.method = "PID"
hE_HLT_1.setpoint = 152
hE_HLT_1 = true
...
hE_HLT_1.method = "Duty Cycle"
hE_HLT_1.dutycycle = 70
```

Ici la résistance passe en PID à 152 et se met en marche, puis plus tard en Duty Cycle à 70 %.

**La façon courte :** le code court de la méthode après un point, sur une ligne à part, la change, comme `.method =` :

```
MB_25_DO@H_Element_HLT_BH.HYS
MB_25_DO@H_Element_HLT_BH.DutyC
```

Les codes sont **DO** (Direct), **PWM**, **DutyC** (Duty Cycle), **HYS** (Hysteresis), **PID**, **DeadB** (Deadband) et **PREC** (Precise). L'éditeur de Process les propose après le nom.

**Seulement les méthodes utilisées :** un Process ne peut passer qu'à une méthode dont le **Use Method** est sur On (Direct et la
Current Method le sont toujours). L'éditeur de Process ne propose que celles-là, et sa vérification montre une erreur simple avant de
brasser, par exemple : *hE_HLT_1 may only use Direct, Duty Cycle, Hysteresis: the Use Method of PID is Off*. Si une telle ligne tourne
quand même, le Brain la refuse avec le même genre de message.

## Son nom {#its-name}

Le Device Type d'une résistance chauffante est **DO@H_Element**, donc son nom se lit comme `MB_25_DO@H_Element_HLT_BH` (Interface, Port, DO@H_Element, Label, Tab), quelle que soit la méthode utilisée.
Elle est câblée directement à son port, vers un SSR ou un contacteur, ou vers un DAC. Les résistances nommées avant gardent DO dans leur nom.

- `.method` vaut **Direct**, **PWM**, **Duty Cycle**, **Hysteresis**, **PID**, **Deadband** ou **Precise** (les codes courts DO, PWM, DutyC, HYS, PID, DeadB et PREC
  marchent aussi). Le lire donne le mot, par exemple `if hE_HLT_1.method == "PID"`.
- `hE_HLT_1 = on` la met **en marche** dans sa méthode ; `hE_HLT_1 = off` l'**arrête**. Toutes les méthodes marchent ainsi, Hysteresis et PID aussi.
- **Choisir une méthode ne la met jamais en marche** : un bouton de méthode, les boutons de méthode de la fenêtre ou un Process ne changent que la méthode. La mettre
  en marche ou l'arrêter, c'est son image, un Clone, ou un Duty cycle % (Règle Skynet 6.19).
- Changer la méthode **pendant qu'elle est en marche** continue tout de suite dans la nouvelle méthode, **sauf** vers **Direct** : cela l'arrête d'abord, pour qu'
  une résistance ne saute jamais d'elle-même de 40 % à pleine puissance. Remettez-la en marche pour la pleine puissance.
- Chaque méthode garde ses propres réglages : `.power` (PWM, par exemple `hE_HLT_1.power = 60`) ; `.dutycycle`, `.interval` (Duty Cycle) ; `.setpoint`, `.onoffset` (avec son moins : `-1`), `.ondelay` (Hysteresis) ;
  `.setpoint`, `.kp`, `.ki`, `.kd`, `.maxoutput`, `.maxintegral`, `.calctime`, `.outtime` (PID) ; `.setpoint`, `.deadbandoffset`,
  `.innerbandoffset`, `.initialoutput`, `.innerbanddrive`, `.outerbanddrive`, `.maxoutput`, `.calctime`, `.outtime` (Deadband) ; ceux du PID plus `.holdoutput`, `.smoothing` (Precise).
  Les mêmes noms qu'avaient les anciens Devices séparés Duty Cycle, Hysteresis, PID et Deadband.
- **`.setpoint` est le Setpoint** (la température qu'elle tient), en lecture ou en réglage. Les fenêtres l'appellent **Setpoint** (Règle Skynet 6.19).
- `.value` est le % de sortie que calcule un PID, un Deadband ou un Precise (en PWM c'est le Power %) (`.pv` est la lecture lissée que tient Precise). `.output` est sa broche en ce moment (lecture seule).
- **`.method` est le mot pour tout Device qui a plus d'une méthode de régulation** (aujourd'hui la résistance chauffante). Dans l'éditeur de Process,
  tapez `hE_HLT_1.method =` et la liste montre ses méthodes à choisir, entre guillemets. Un Device avec une seule façon de régulation
  n'a pas de `.method`.

## Dans ses Properties {#in-its-properties}

Sous **Heating method** : la méthode avec laquelle elle **démarre** et **Method Settings**, une fenêtre ⬢ pour chaque méthode avec
son interrupteur **Use Method**, la **Temperature Probe** qu'elle lit (Hysteresis, PID, Deadband et Precise) et les réglages de cette
méthode ([Les réglages de chaque méthode](#each-method-s-settings)). Un PID, un Deadband ou un Precise peut aussi être **Reversed**
(refroidissement). Le Hardware Controller et le port décident PWM ou la manière d'un port simple. Une résistance intégrée à un Vessel Device, un RIMS tube ou une cuve Integrated a les
mêmes réglages.

## Un port d'Interface, un Device {#one-interface-port-one-device}

Règle 6.1 : dans Skynet, **chaque port d'une Interface n'a qu'un seul Device**. La liste Available
Ports ne propose jamais un port déjà utilisé, et un Device ne peut pas y être enregistré. Pour commander une résistance autrement, changez sa
méthode de chauffe au lieu d'ajouter un second Device.

Les anciens Schemas Skynet qui ont déjà deux Devices sur un port continuent de marcher comme avant (le dernier mis en marche l'emporte), et ces
deux peuvent encore être enregistrés ; vous ne pouvez simplement pas en créer de nouveaux.

Voir aussi : [Hysteresis de chauffe : ce qui commande la résistance](181-heat-hysteresis-switched-by) (Règle 6.29).

> **Ce qui décide de la précision :** la **sonde** (une DS18B20 lit à environ ±0,9 °F près), **sa place**, le **mélange** du liquide
> et son **étalonnage** comptent bien plus que la façon de commuter la résistance. Réglez-les d'abord.
