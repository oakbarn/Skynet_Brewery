# Une pompe ou une vanne coupe un tuyau {#a-pump-or-valve-cuts-a-pipe}

En **Edit layout**, lâchez une **pompe**, une **vanne** (on/off ou Proportional) ou une **vanne manuelle** juste sur un tuyau que vous avez
déjà tracé, et Skynet la joint au tuyau pour vous (Règle Skynet 5.26). Ça marche pareil quand vous ajoutez une nouvelle pompe ou vanne
qui tombe sur un tuyau.

## Lâchée entre les bouts du tuyau {#dropped-between-the-pipe-s-ends}

Le tuyau est **coupé en tuyaux séparés**, un joint à chaque IP de la pompe ou de la vanne.

- Une vanne : le tuyau devient deux tuyaux droits, un à chaque bout de la vanne.
- Une pompe : le tuyau du côté où regarde son **entrée** va tout droit dans l'entrée. Sa **sortie** s'ouvre en haut, en travers du tuyau,
  donc ce morceau est **contourné avec des coudes** : vers le haut depuis la sortie, en travers le long du côté de la pompe, et de nouveau vers le bas sur la
  ligne du tuyau. Un tuyau vertical est pareil dans l'autre sens : tout droit dans la sortie, en contournant vers l'entrée.
- La pompe ou la vanne se déplace en travers (pas le long) pour être juste sur la ligne du tuyau (Règle 5.23).
- Le premier morceau garde le Name, le Label, la taille et la Flow Color du tuyau. Les nouveaux morceaux prennent les noms Pipe_N suivants et la même taille
  et la même Flow Color.

**Astuce :** pour avoir l'entrée de l'autre côté, réglez l'**Orientation** de la pompe (Right ou Left) avant de la lâcher sur le tuyau.

## Lâchée sur le bout d'un tuyau {#dropped-over-the-end-of-a-pipe}

Le tuyau est **raccourci** et la pompe ou la vanne y est jointe par **ses deux IP**.

- **Un bout ouvert** (rien n'y est joint) : le bout ouvert disparaît, le tuyau se joint à un IP, et l'autre IP est maintenant le bout de la
  ligne, prêt pour le tuyau suivant.
- **Un bout sur un té, un coude, un orifice de cuve ou un autre IP :** ce bout reste où il est. La pompe ou la vanne recule le long
  du tuyau pour s'en dégager ; un IP se joint au tuyau raccourci et l'autre est joint par un court nouveau tuyau au té (ou à
  ce sur quoi était le bout).

## Quand rien n'est coupé {#when-nothing-is-cut}

- La pompe ou la vanne est encore jointe à un autre tuyau, ou elle est verrouillée. Une pompe ou une vanne que vous **faites glisser hors** de ses tuyaux les lâche
  (Règle 5.19), donc lâchée sur un autre tuyau, elle coupe celui-là. Une qui est encore jointe le dit dans un message.
- Le tuyau est un flexible, ou va à 45 degrés ; la vanne est tournée de 45 degrés ou est une vue de face.
- Il ne reste pas assez de tuyau pour contourner la pompe ou pour la mettre. Déplacez-la plus loin le long du tuyau, ou tracez un tuyau plus long.

Un message en bas de l'écran dit ce qui a été fait (ou pourquoi pas). Appuyez sur **Save layout** pour le garder, ou sur **Exit** sans
enregistrer pour tout remettre.
