# Alarmes et son {#alarms-and-sound}

**Un seul son joue à la fois.** Quand deux veulent jouer, celui qui a le plus petit numéro de priorité gagne. L'autre attend, et joue tout seul dès qu'il est le plus haut qui reste.

| Type | Priorité | À utiliser pour |
|---|---|---|
| **Brew Flow Alarm** | 1 | Les étapes de brassage : eau d'empâtage, fin de l'empâtage, début de l'ébullition. Passe avant tous les autres sons. |
| **Hop Alarm** | 2 | Les ajouts de houblon. N'attend qu'une Brew Flow Alarm. |
| **Pre-Hop Alarm** | 3 | Un avertissement un temps réglé avant sa Hop Alarm (10 minutes si vous ne le changez pas). |
| **General Alarm** | 4 | Tout le reste. |
| **Sound only** et le **Sound Player** | 5 | Musique et bips. Se met en pause pendant qu'une alarme sonne, puis reprend là où il s'était arrêté. |

Brew Flow est en priorité 1 et Hop en priorité 2 (OakBarn Brewery, 2026-11-13). Si un ajout de houblon doit passer en premier dans votre brassin, donnez à cette Hop Alarm sa propre Priority, par exemple 0.9. Une alarme qui a dû attendre recommence depuis le début quand son tour arrive ; la musique reprend là où elle en était.

### Priority : votre propre ordre {#priority-your-own-order}

Chaque Alarm a une **Priority** (Alarm Widget Properties > Alarm > Priority). Elle commence au numéro de son type ci-dessus, et vous pouvez régler
la vôtre avec **jusqu'à deux décimales** : 1, 1.1, 1.15, 2 ... **La plus basse joue en premier.** Tous les 1 jouent avant le premier 2,
et 1.1 avant 1.15 avant 1.2, pour que vous puissiez mettre une Alarm entre deux autres sans les renuméroter.

- **La même Priority :** celle qui est passée sur On la première joue la première, donc une Alarm qui joue n'est jamais coupée par une autre de même Priority.
- **Deux au même moment** avec la même Priority : la **première mise sur On joue en premier** (1a), puis la suivante (1b), même dans la même seconde. Dans un Process, c'est l'ordre de leurs lignes.
- **Un son qui ne se répète pas** (Repeat) laisse jouer le suivant dès qu'il a joué jusqu'au bout, même si son Alarm est toujours affichée On.
- **Les étapes d'une Alarm Chain attendent leur tour** : voir [L'Alarm Chain : une alarme, plusieurs étapes](172-alarm-chain).
- Un Process peut la changer : `alm_Brew.priority = 1.15` (`alm_Brew.priority = ""` remet le numéro de ses Properties).

## En ajouter une {#add-one}

**Tabs > ☰ Menu > Edit layout > Add Widget > On-screen controls > Alarm**, puis choisissez d'abord son **Kind** (type). Les réglages en dessous changent selon le type :

- **Hop Alarm** : choisissez une **minuterie** et le **temps sur cette minuterie** pour l'ajout de houblon, et elle sonne toute seule. Pour une minuterie d'ébullition en compte à rebours, c'est le temps restant (un houblon à 15 minutes : `00:15:00`). Laissez la minuterie vide pour ne l'activer que depuis un Process.
- **Pre-Hop Alarm** : choisissez la **Hop Alarm** à laquelle elle va et **combien de temps avant** (vide = `00:10:00`).

Touchez une alarme qui sonne à l'écran pour l'arrêter. « (waiting) » à côté veut dire qu'une alarme plus haute a le haut-parleur.

## Dans un Process {#in-a-process}

Une alarme, c'est simplement vrai ou faux :

```
alm_Hops_1 = true            sound it
wait alm_Hops_1 == false     wait here until the brewer taps it off
if alm_Hops_1 == true
  ...
endif
alm_Hops_1 = false           turn it off
"alm_Hops_1" at = 00:20:00   move the hop drop to 20:00 left
"alm_PreHop_1" before = 00:05:00
```

(La faire sonner ; attendre ici que le brasseur l'arrête d'un toucher ; l'arrêter ; déplacer l'ajout de houblon à 20:00 restantes.)

`alm_Hops_1 = On` et `alm_Hops_1 = Off` marchent comme true et false (Règle 16.9). Un Process n'écrit jamais `.active`. Une seule Alarm peut changer son apparence et son son étape par étape : voir [L'Alarm Chain : une alarme, plusieurs étapes](172-alarm-chain).

**Une Brew Flow Alarm retient son Process :** quand un Process met une Brew Flow Alarm Widget sur On (`alm_Mash_Done = On`), il attend sur cette ligne jusqu'à ce que le brasseur l'arrête d'un toucher, comme si `wait alm_Mash_Done == false` suivait. Tous les attributs d'une Alarm (`.path`, `.string`, `.playtime` ...) sont dans [Les attributs d'une Alarm](195-alarm-attributes).

## Sound Player

Chaque panel a un **SoundPlayer** intégré pour la musique et les sons simples. Il n'est sur aucun Tab ; les Processes l'utilisent :

```
SoundPlayer path = "sounds/polka.mp3"
play SoundPlayer
stop SoundPlayer
```

Un son peut aussi être un **lien web vers un MP3** (`https://...`), joué directement depuis le web : voir [Des sons depuis un lien web](186-sounds-from-a-web-link).

Il n'y a pas de commande de pause : il se met en pause tout seul pendant qu'une alarme sonne et reprend ensuite. Pour mettre un Sound Player sur un Tab (touchez-le pour jouer ou arrêter), utilisez **Add Widget > On-screen controls > Sound Player**.

Quand le panel s'ouvre avec le son coupé, Skynet demande **🔊 Turn sound on?** : appuyez sur **🔊 Turn Sound On** (les navigateurs ne jouent un son qu'après un clic, et ce clic suffit). Tant que le son est coupé, un bouton rouge **🔇 Sound is off** reste sur le Tab et **🔊 Turn Sound On** est en haut du **☰ Menu**. C'est une fois par navigateur, pas par Tab. Vous pouvez aussi appuyer sur **Enable sound** dans la barre de menu. Pour avoir le son actif à chaque ouverture du panel, activez **Turn Sound On when starting** sur **☰ Menu > Default** (voir [Le ☰ Menu](33-menu)) ; il faut quand même toucher ou cliquer une fois la page avant le premier son, parce que les navigateurs l'exigent aussi.
