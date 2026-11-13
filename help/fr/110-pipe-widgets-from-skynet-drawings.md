# Widgets de tuyauterie des dessins Skynet {#pipe-widgets-from-the-skynet-drawings}

Nouveaux dessins Skynet des raccords de tuyauterie TC, de la vanne à bille manuelle et de deux vannes motorisées. Ils sont dessinés en SVG (Règle 7.1). Le passage va dans les deux sens dans tous ; aucun n'a de sens de passage (un clapet anti-retour est toujours le seul raccord à sens unique).

## Où sont les IP {#where-the-ips-are}

La règle pour chaque Device et Widget (Règle 5.20) :

- **Sur un Widget de tuyauterie TC** (coudes, tés, réductions ...) et sur une vanne à viroles, chaque IP est au **centre de la face extérieure de la virole** : le bout plat où va le collier. Chaque bout ouvert a son propre IP.
- **Sur une vue de face** (vous regardez dans le tuyau), l'IP est au **centre de l'ouverture**. Un élément droit vu de face a ses deux IP là : un pour le tuyau qui vient vers vous, un pour le tuyau qui s'éloigne.

## Widgets de tuyauterie {#pipe-widgets}

Ce sont des Templates de raccords de tuyauterie Skynet. Comme chaque raccord de tuyauterie, ils n'ont que X, Y, Width, Height et **Autosize to pipe** ([Pipe fittings and Manual Valves](87-pipe-fittings-and-manual-valves)). Tournez-les et retournez-les avec les boutons pour tourner de la barre Edit layout.

| Template | Image | IP |
|---|---|---|
| **Elbow_90** | coude à 90 degrés | viroles du bas et de droite |
| **Elbow_45** | coude à 45 degrés | viroles en bas à gauche (à 45 degrés) et à droite |
| **Elbow_Front** | coude à 90 degrés vu de face : un bout vous fait face, un descend | centre de l'ouverture de face, virole du bas |
| **Tee** (Long Tee) | té avec une longue branche | gauche, droite et la branche (bas) |
| **Instrument_Tee** | té avec une courte branche | gauche, droite et la branche (bas) |
| **Reducer_2_1_Concentric** | TC 2 vers TC 1, les deux bouts sur un même axe | gros bout (gauche), petit bout (droite) |
| **Reducer_2_1_Eccentric** | TC 2 vers TC 1, plat le long du bas pour qu'il se vide | gros bout (gauche), petit bout (droite, en bas) |
| **Reducer_2_1_Front** | une réduction TC 2 vers TC 1 vue de face | les deux au centre de l'ouverture |
| **Reducer** | TC 2 vers TC 1.5, dessinée comme la concentrique | gros bout (gauche), petit bout (droite) |

Chaque raccord est dessiné à sa forme Skynet : un Long Tee est plus large que haut. **Autosize to pipe** garde cette forme et rend le tuyau de l'image aussi épais que le plus gros tuyau qui y est joint.

Un raccord Skynet déjà sur un Tab prend sa nouvelle image la prochaine fois que vous ouvrez **Edit layout**, et ses IP vont sur les nouvelles viroles. **Save layout** garde le changement. Un tuyau dessus suit son IP ; vérifiez qu'il est toujours droit.

## Images de la vanne à bille manuelle {#manual-ball-valve-pictures}

Le **Widget Manual Valve** est le même Widget spécial qu'avant : son état ouvert/fermé (.state) ne change que quand quelqu'un clique dessus sur son Tab, et un Process qui tourne attend ce clic. Ses Properties ont maintenant une **Picture** :

- **Plain** : la vanne dessinée, comme avant.
- **Manual Ball Valve, side view** (vue de côté) : le tuyau passe au milieu.
- **Manual Ball Valve, front view** (vue de face) : en regardant dans le tuyau.

L'image reste la même ouverte ou fermée ; tant qu'elle est ouverte, la **superposition ouverte** (un anneau vert et une coche) est dessinée par-dessus (les images Open sont retirées).
- **Manual Ball Valve on a front elbow** (sur un coude de face) : la même, avec la jambe du coude qui descend.

Le Tab passe tout seul de l'image ouverte à l'image fermée, et la superposition verte ouverte s'affiche toujours tant qu'elle est ouverte. Une vanne manuelle a un IP, au milieu de son image.

## Tés avec une sonde de température {#tees-with-a-temperature-probe}

Un té avec une sonde de température dedans est un **Device de température**, pas un Widget de tuyauterie. Ajoutez-en un avec **Probe** dans la barre Edit layout (ou Select Device Type > Probe) :

- **Instrument Tee** ou **Long Tee**, **sonde dans la branche** : la sonde (violette) remplit la branche, donc ses IP sont les viroles de **gauche et de droite**.
- **Instrument Tee** ou **Long Tee**, **sonde entrant par le bout** : la sonde remplit le bout gauche, donc ses IP sont la **virole de droite et la branche**.

Comme pour un doigt de gant, vous choisissez le type de sonde qui y est (DS18B20, PT100 ...), puis l'Interface et son Port. Ses Properties ont **Flip Horizontal**, **Flip Vertical** et **Rotate**, et l'image et ses IP suivent. Le passage la traverse dans les deux sens. Il a la taille du té des TC Pipe Fittings de sa forme, avec ses IP aux mêmes places, et lâché sur un tuyau ou un flexible, il le coupe comme un té : voir **Probe tees and thermowells on pipes** (aide 132).

## Devices de vannes motorisées {#motorized-valve-devices}

Deux vannes, une ligne chacune dans **Valves** de la barre Edit layout. Son **Orientation** (dans ses Properties) choisit comment elle se tient,
et l'image et ses IP suivent.

| Vanne | Orientations |
|---|---|
| **Skynet Motorized Butterfly Valve** | un actionneur gris sur une vanne papillon : Horizontal, Vertical Left, Vertical Right, 45 degrees, **Front** (en regardant dans le tuyau : les deux IP au centre de l'ouverture ; le disque vu par la tranche veut dire ouvert, le disque face à vous veut dire fermé) et **Front Elbow** (un IP au centre de l'ouverture de face, un à la virole du bas) |
| **Skynet Motorized Ball Valve** | un actionneur bleu : Horizontal, Vertical Left, Vertical Right, 45 degrees et **Front** (les deux IP au centre de l'ouverture) |

Comme avant, une vanne fermée montre un anneau sur son corps et une vanne ouverte une barre et des éclairs rouges. Une vue Front n'a pas de Flip à régler.
