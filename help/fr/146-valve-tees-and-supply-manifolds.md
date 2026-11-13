# Tés à vanne et collecteurs d'alimentation {#valve-tees-and-supply-manifolds}

Un **Valve Tee** (té à vanne) est un Long Tee TC 1.5 avec une vanne intégrée dans sa branche. Un **Supply Manifold** (collecteur d'alimentation) en est deux ou trois joints bout
à bout, comme beaucoup de brasseurs amateurs construisent un collecteur pour envoyer le liquide d'une source vers plusieurs endroits (Règle Skynet 5.35).

| Raccord | Tés | Vannes | IP |
| --- | --- | --- | --- |
| **Long Tee with a Valve** (Valve Tee) | 1 | 1 | 3 |
| **Double Supply Manifold** | 2 | 2 | 4 |
| **Triple Supply Manifold** | 3 | 3 | 5 |

![Double Supply Manifold](Images/Skynet/Other_Equipment/Skynet_TC15_Supply_Manifold_2.svg)

## Ses IP {#its-ips}

Il y a des IP **seulement** sur les **deux bouts ouverts des tés joints** (gauche et droite) et sur le **bout extérieur de chaque vanne** (le bas).
Les tuyaux et les flexibles s'y joignent. Le liquide passe dans tous les sens dans les tés ; une **vanne fermée ferme son IP**, donc rien n'y entre ni n'en sort.

## En ajouter un {#add-one}

En **Edit layout**, ouvrez **Elbows, Tees …** et choisissez-en un dans **Valve Tees and Supply Manifolds**, ou utilisez
**Select Device Type > Valves**. Chaque raccord a deux lignes : **..., Manual valves** (toutes les vannes commencent manuelles) et
**..., Motorized valves** (toutes les vannes commencent motorisées).

La **case d'ajout** marche comme celle d'une pompe (Règle Skynet 18.29). Posez la souris sur le nom de n'importe quel champ pour son aide.

1. **Label** : rempli pour vous (**valve_tee_1**, **manifold_2_1**, **manifold_3_1**). Vous pouvez le changer, mais il ne peut pas être vide.
2. **Interface** (la carte) : la carte à laquelle ses vannes motorisées sont câblées (une seule carte pour toutes).
3. **Valve 1**, **Valve 2**, **Valve 3** : **Manual** ou **Motorized**. Une vanne motorisée choisit son Port dans **Available Ports** sur la
   même ligne. Deux vannes ne peuvent pas partager un Port.
4. **Tab** : le Tab où il va.

Puis le **Name** (ValveTee_1, Manifold2_1 ou Manifold3_1 au départ), le **Graphic**, son **Path**, l'**Orientation** et le **Flip**, X, Y, Width,
Height et le **Device Type**. Appuyez sur **➕ Add Device** : il va sur ce Tab et ses Properties s'ouvrent. Entrée passe de champ en champ
et en dernier à ➕ Add Device.

## Les numéros des vannes {#the-valve-numbers}

En Edit layout, et sur le Graphic dans la case d'ajout et les Properties, chaque vanne montre un numéro jaune, **1**, **2**, **3**. C'est la
même vanne que **Valve 1**, **Valve 2**, **Valve 3** dans la fenêtre, et que **V1**, **V2**, **V3** dans son Label. Les numéros ne sont pas
affichés quand Edit layout est désactivé.

## Manuelle ou motorisée, une vanne à la fois {#manual-or-motorized-one-valve-at-a-time}

Chaque vanne est un **Device vanne intégré au raccord** (un Skynet_Integrated_Device, comme la résistance du RIMS tube). Elle ne peut
pas être retirée ni supprimée seule ; supprimer le raccord supprime ses vannes.

Dans les **Properties** du raccord (les mêmes champs que la case d'ajout), passez n'importe quelle vanne de **Manual** à **Motorized** ou inversement et appuyez sur
Save. Une vanne **manuelle** se tourne à la main : quand un Process demande de l'ouvrir ou de la fermer, une fenêtre demande à quelqu'un de le faire et le
Process attend **Done**. Une vanne **motorisée** est commandée par son Port.

Une fois une vanne motorisée enregistrée, son **Port** est grisé, et l'**Interface** aussi (c'est le câblage). Pour câbler une vanne à un autre
Port, rendez-la **Manual**, Save, puis de nouveau **Motorized** et choisissez le Port.

## L'utiliser {#using-it}

- **Cliquez sur une vanne** sur son Tab pour l'ouvrir ou la fermer (opérateurs et admins). Une vanne motorisée ouverte montre l'éclair ; une vanne manuelle ouverte
  montre l'anneau vert.
- Dans un Process, utilisez le nom de la vanne elle-même, par exemple `MB_22_DO@Valve_E_manifold_2_1_V1_BH.state = true`. Le Label de chaque vanne est le
  Label du raccord suivi de **V1**, **V2**, **V3**, et son nom est fait à partir de là (le Suggested Name).
- Les vannes motorisées sont dans les listes de vannes **Close all** et **Open all**, comme toute vanne qu'un Process peut commander.

## Le tourner et le mettre dans un tuyau {#turning-it-and-putting-it-in-a-pipe}

Son **Orientation** a trois choix : **Horizontal** (les vannes pendent vers le bas), **Left Vertical 90** (les vannes pointent à gauche) et
**Right Vertical 90** (les vannes pointent à droite). **Flip** est sur la même ligne :

- **No flip** : tel que dessiné (Horizontal : les vannes en bas).
- **Flip Vertical** : les vannes de l'autre côté des tés (Horizontal : **les vannes en haut**).
- **Flip Horizontal** : la Valve 1 à l'autre bout.
- **Flip both** : les deux à la fois.

Sur la barre Edit layout, les boutons de rotation passent par les trois positions, et **Flip H** et **Flip V** le retournent tel qu'il apparaît sur le
Tab. Les vannes, leurs numéros et les IP suivent.

Chaque vanne est dessinée avec les mêmes férules TC 1.5 que les tés : celle du haut est serrée sur la branche du té, et celle du bas est l'
IP de la vanne. Posé sur un tuyau droit en Edit layout, son corps suit le tuyau et le tuyau est coupé en deux, un morceau sur chaque bout
ouvert, comme pour un té. Il garde sa propre taille, donc il n'a pas d'Autosize to pipe.

**Sa taille** (Règle Skynet 5.36) : il se dimensionne maintenant selon ses tuyaux comme un té. Ses tés prennent la taille qu'ont la plupart des tuyaux
et flexibles de ses IP (en cas d'égalité, la plus grande), et ses vannes grandissent ou rapetissent avec lui. Sans tuyau, il prend le Default pipe size (☰ Menu > Default settings, [aide 155](155-default-settings)).
Ceci remplace « Il garde sa propre taille, donc il n'a pas d'Autosize to pipe » plus haut.
