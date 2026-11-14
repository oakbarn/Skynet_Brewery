# Réglages par défaut {#default-settings}

**☰ Menu > Default settings** est le seul endroit où voir **tous les réglages par défaut** de Skynet (Règle Skynet 2.42). Il ne s'ouvre que depuis le
**☰ Menu**. Il s'appelait autrefois le Tab **Default**.

Ces réglages appartiennent au **panneau**, donc ils sont les mêmes dans chaque Schema. Les **Admins** les changent et appuient sur **Save** ; tous les
autres peuvent regarder.

## Tuyaux, flexibles et tailles {#pipes-hoses-and-sizes}

| Réglage | Ce qu'il fait |
|---|---|
| **Default pipe size** | 1/2" sauf si vous le changez (1/4" à 6", avec la taille en mm à côté de chacune). Un **nouveau tuyau** commence à cette taille. Chaque **Device, Pipe Fitting et élément avec des IP** (pompes, vannes, débitmètres, coudes, tés, Valve Tees, tés à sonde ...) qui n'a **pas de tuyau** est dessiné pour cette taille, donc une nouvelle pompe correspond déjà à vos tuyaux. |
| **Default hose size** | La taille de départ d'un **nouveau flexible**. |
| **How thick a 1/2" pipe is drawn on a new Tab** | En pixels ; vide = 10. Chaque Tab peut encore le changer dans **Tab settings**. |
| **Width** et **Height of a new Tab** | En pixels ; vide = 1600 x 900. |

### Comment les choses se dimensionnent selon leurs tuyaux {#how-things-size-to-their-pipes}

Une fois des tuyaux joints, un élément prend la taille qu'ont **la plupart de ses tuyaux et flexibles** (en cas d'égalité, la plus grande ; Règle Skynet
5.36). Depuis le 2026-11-07, cela couvre aussi les **pompes**. Par exemple,
ajoutez une pompe Blichmann à un Tab avec des tuyaux de 1" : elle est dessinée pour des tuyaux de 1" dès que les tuyaux y sont, et pour le Default pipe size
avant. Un raccord posé sur une ouverture de cuve sans tuyau garde sa taille. Voir
[Raccords de tuyauterie et vannes manuelles](87-pipe-fittings-and-manual-valves).

## Nouveaux Devices et Widgets (le Build) {#new-devices-and-widgets-the-build}

| Réglage | Ce qu'il fait |
|---|---|
| **Default Interface** | L'Interface sur laquelle commence la case d'ajout d'un nouveau Device. Vide : celle du dernier nouveau Device. |
| **Default Tab** | Le Tab où va un nouveau Device ou Widget quand le Build est fini (💾 Save Build ... > Move to Tab). Vide : le Tab d'où venait le Build Tab. **➕ Add new Tab…** dans une case d'ajout le règle aussi. |

Ce sont les deux mêmes listes déroulantes que sur la barre Edit layout du 🔨 Build Tab. Elles sont gardées par l'ID d'Interface et l'ID de Tab, donc un Schema
sans cette Interface ou ce Tab commence à l'ancienne façon. (Règle Skynet 4.6)

## Hover Help {#hover-help}

| Réglage | Ce qu'il fait |
|---|---|
| **Hover Delay (ms)** | Combien de temps la souris doit rester sur un nom avant que son Hover Help s'affiche, en millisecondes (1000 ms = 1 seconde). **0 ou vide : elle s'affiche tout de suite** (par défaut). Jusqu'à 5000. Essayez 300 à 500 si le Hover Help s'ouvre alors que vous ne faites que passer la souris sur une boîte de dialogue. Les téléphones et tablettes n'ont pas de souris : un toucher ouvre toujours l'aide tout de suite. Voir [L'aide au survol dans les boîtes de dialogue](147-hover-help). |

## Les autres réglages de ce Tab {#the-other-settings-on-this-tab}

Nouvelles recettes (Units, Batch size, Profiles, Boil time, rendement ...), affichage des quantités sur le Tab Recipe, alertes houblon, nouveaux Tabs et
vannes (Tab Background Profile, Tab Style, Valve Profile), la Menu Bar, Sound, On startup (Zoom, Full screen), Text (l'aspect de
chaque case de texte) et Phones and tablets. Voir [Le ☰ Menu](33-menu).

## Tap Water

Votre propre eau du robinet : les chiffres qui comptent pour brasser. Chaque recette commence avec Tap Water sur son Tab Waters, à chaque Level, sauf si vous choisissez une autre eau. Remplissez-les, puis appuyez sur **Save** (le seul Save de l'onglet Default, en haut ou en bas).

**Où trouver les chiffres :**

- **Votre service des eaux.** La plupart des villes et des compagnies des eaux publient un rapport sur la qualité de l'eau sur leur site web. Cherchez le nom de votre commune et « qualité de l'eau ». Si vous ne le trouvez pas, appelez-les et demandez le dernier rapport. Cherchez Calcium, Magnésium, Sodium, Sulfate, Chlorure, Bicarbonate ou Alcalinité, pH, et s'ils ajoutent du chlore ou de la chloramine.
- **Un kit d'analyse d'eau.** Les magasins de brassage et d'aquariophilie en vendent, ainsi que les magasins de piscines. La plupart des kits donnent la dureté totale, l'alcalinité totale, le pH et le chlore. Un laboratoire d'analyse d'eau peut analyser un échantillon envoyé par la poste pour tous les chiffres.
- **L'eau de puits** n'a pas de rapport du service des eaux : utilisez un kit ou un laboratoire.

L'eau change avec les saisons, donc revérifiez de temps en temps et changez la **Date**.

Les cases :

- **From** : Water Department (service des eaux) ou Test Kit (kit d'analyse).
- **Date** : quand le rapport ou l'analyse a été fait.
- **Calcium**, **Magnesium**, **Sodium**, **Sulfate**, **Chloride**, **Bicarbonate** : en ppm (pareil que mg/L).
- **Alkalinity** : ce que donnent la plupart des kits. C'est la même chose que le Bicarbonate, donc tapez l'un ou l'autre et l'autre suit.
- **Hardness** : calculée à partir du Calcium et du Magnésium (grisée). Un kit la donne aussi, donc vous pouvez vérifier vos chiffres.
- **pH** : 7 est neutre ; l'eau du robinet est souvent entre 7 et 8,5.
- **Chlorine** : None, Chlorine, Ammonia + chlorine (Chloramine) ou Unknown. L'un comme l'autre donne un goût de médicament à la bière. Un comprimé de Campden dans 20 gallons enlève les deux.

Posez la souris sur une case (ou appuyez sur son nom) pour voir ce qu'elle fait pour la bière.

Le côté technique : Tap Water est un Water Profile (☰ Menu > Water Profile le liste) créé quand le Brain démarre pour la première fois et jamais supprimé. Une recette ou les Default settings sans Water Profile choisi l'utilisent. Bicarbonate = Alcalinité (en CaCO3) x 1,22. Dureté (en CaCO3) = 2,497 x Calcium + 4,118 x Magnésium. Un Process le lit avec les Skynet_Fields `rcp_Water_...` (aide 99).

## Réglages par défaut définis ailleurs {#defaults-set-somewhere-else}

Certains réglages par défaut se changent à un autre endroit. Ils sont listés ici pour que vous les voyiez tous, avec **ce qu'ils valent maintenant**, **où ils se
changent** et leur **Règle**. Rien ne se change dans cette liste. Par exemple :

- le **Look** (Office Black) et les **couleurs de fond et de texte d'un nouveau Tab**, depuis Settings > Panel settings > Look ([Les Looks du panneau (thèmes)](151-panel-looks)) ;
- le **Pump Standard** et le **Valve Standard** (dessinés en 150 x 150 pour un tuyau de 1/2") ;
- l'**On overlay** (l'éclair fixe), l'**anneau vert lumineux** sur une nouvelle pompe, les **flow colors** (None) ;
- les plages et couleurs du **Skynet Dial**, le **Pulse** (100 ms) et le **verrouillage du bouton poussoir** (3 secondes) ;
- le **Simulator** (une attente est comptée comme atteinte après 60 secondes ; la barre s'ouvre à 25x avec Auto skip) ;
- le **Setup** et l'**Import** (noms Skynet, et son Look).

Chaque fois qu'un nouveau réglage par défaut est ajouté à Skynet, il est ajouté aussi à ce Tab.

## Ordre du Menu {#order-of-the-menu}

En bas, comme avant : tapez un nombre pour déplacer un Tab du Menu.
