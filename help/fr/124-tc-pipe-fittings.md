# Raccords de tuyauterie TC {#tc-pipe-fittings}

**TC Pipe Fittings** est une sorte (sous-classe) de Widget : chaque coude, té et croix sur un Tab (Règle Skynet 5.25). Chacun est un dessin
Skynet avec un **IP sur la face extérieure de chaque virole** (le bout plat où va le collier, Règle 5.20), et il prend la taille des
tuyaux qui y sont joints (**Autosize to pipe**). Un TC Pipe Fitting n'a pas de sens de passage (Règle 5.20) et pas de Clone (Règle 5.14).

| TC Pipe Fitting | Ses bouts ouverts |
| --- | --- |
| Elbow 90 | 2 (un vers le bas, un vers la droite, avant d'être tourné) |
| Elbow 45 | 2 (un vers la droite, un vers le bas et la gauche à 45 degrés) |
| Tee (le té normal, long) | 3 (gauche, droite et la branche) |
| Instrument Tee (une courte branche) | 3 |
| Cross | 4 |
| U Bend, réductions, clapet anti-retour, End Cap, vues de face | comme dessiné |

## Skynet les met pour vous {#skynet-puts-them-in-for-you}

Les tuyaux ne vont qu'à l'horizontale, à la verticale ou à 45 degrés (Règle 5.19). Là où vous joignez deux tuyaux en coin, ou trois ou quatre tuyaux en
un point, Skynet met le TC Pipe Fitting qu'il faut aux tuyaux, tourné dans le bon sens. Son coude est là où les tuyaux se sont rencontrés, et
chaque tuyau finit sur un de ses IP.

- **Faire un té à partir d'un coude :** tracez un nouveau tuyau qui commence (ou finit) sur le **coude** lui-même, là où les axes des deux tuyaux
  se rencontrent. Le coude devient un té. Faites de même sur un té pour faire une croix.
- **Joindre un tuyau au milieu d'un autre tuyau :** commencez ou finissez le nouveau tuyau sur l'autre tuyau, loin de ses IP. Skynet coupe ce
  tuyau en deux à cet endroit et y met un té.
- **Deux bouts de tuyau libres** qui se rencontrent deviennent un seul joint, donc un coude y est mis (ou un manchon, quand ils sont alignés).
- Un tuyau qui ne fait que croiser un autre en son milieu ne s'y joint pas.
- Deux tuyaux en ligne droite se joignent simplement sur un IP (un manchon). Un bout de tuyau ouvert reçoit aussi un manchon.

## En ajouter un à la main {#adding-one-by-hand}

- **Barre Edit layout > Elbows, Tees …**, sous **TC Pipe Fittings**, ou
- **Add Widget > TC Pipe Fittings**.

Le nouveau raccord va sur le Build Tab comme chaque nouvel élément (Règle 4.1). Tournez-le et retournez-le avec les boutons pour tourner de la barre Edit layout
(Règle 5.5), puis joignez des tuyaux à ses IP.

## Lâcher un té ou une croix sur un tuyau {#dropping-a-tee-or-a-cross-on-a-pipe}

Faites glisser un **Tee**, un **Instrument Tee** ou une **Cross** sur un tuyau droit et lâchez. Skynet le met dans le tuyau :

- **Entre les bouts du tuyau :** le tuyau est coupé en deux. Le té se déplace sur la ligne du tuyau, et ses deux bouts alignés (le
  passage droit) se joignent chacun à un des morceaux. Sa branche reste ouverte, prête pour le tuyau suivant. Le premier morceau garde le Name et la
  Flow Color du tuyau ; l'autre prend le nom Pipe_N suivant.
- **Son passage droit est en travers du tuyau ?** Skynet le tourne d'un quart de tour (ou plus) autour de son coude pour que le passage droit suive le tuyau.
- **Sur un bout ouvert du tuyau :** le tuyau est raccourci et se joint au té.
- Rien n'est coupé quand le té est encore joint à d'autres tuyaux, est verrouillé, que le tuyau est un flexible, que le tuyau est plus court que le
  té, ou que son bout à cet endroit est déjà joint à quelque chose. Un message en bas de l'écran dit ce qui a été fait (ou pourquoi pas).

Appuyez sur **Save layout** pour le garder, ou sur **Exit** sans enregistrer pour tout remettre.

## Raccords avec une sonde de température {#fittings-with-a-temperature-probe}

Un té avec une sonde de température dedans n'est **pas** un TC Pipe Fitting. C'est un **Device de température** (sous-type Probe Tee), car il
a une sonde câblée à un PLC (Règle 5.20). Ajoutez-le depuis la liste des Devices de température.

## Anciens Schemas {#older-schemas}

Un coude, un té ou une croix fait avant les TC Pipe Fittings (un simple raccord d'IP) devient son TC Pipe Fitting la première fois que son Tab est
affiché en Edit layout (Règle 15.2). Save layout le garde.
