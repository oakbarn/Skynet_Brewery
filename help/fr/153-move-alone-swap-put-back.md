# Déplacer quelque chose sans ses tuyaux, échanger une pompe, et Put back {#moving-something-without-its-pipes-swapping-a-pump-and-put-back}

(Règle Skynet 5.37.)

## La fenêtre quand vous attrapez quelque chose avec des tuyaux dessus {#the-pop-up-when-you-grab-something-with-pipes-on-it}

En **Edit layout**, la première fois que vous traînez un Device, un Widget, un Fitting ou un Pipe auquel des tuyaux sont joints, il reste où il est et
une petite fenêtre demande ce que vous voulez :

- **🔓 Unlock its IPs** (les points de connexion) : chaque bout de tuyau dessus se détache et reste où il est, avec un bout ouvert. Attrapez-le de nouveau
  et il bouge **seul** ; les tuyaux et raccords ne bougent pas. Cela marche aussi quand un tuyau ou raccord **verrouillé** y est joint (avant,
  il ne pouvait pas bouger du tout).
- **Move it with its pipes** : comme avant (Règle 5.19). Un tuyau avec un bout ouvert suit, un bout de tuyau glisse le long de sa propre ligne, et un
  tuyau tiré de côté se détache. Attrapez-le de nouveau pour le déplacer.
- **🔁 Swap places with...** (pompes, vannes et Manual Valves) : choisissez-en un autre de la même sorte, sur ce Tab ou un autre (le 🔨
  Build Tab aussi). Celui que vous choisissez prend **la place, la taille, les retournements et les tuyaux** de celui-ci, et celui-ci va là où était l'autre.
- **Cancel** : rien ne change.

**Don't ask again** déplace les choses avec leurs tuyaux sans demander jusqu'à ce que vous quittiez Edit layout. Sur un Pipe, la fenêtre propose
**🔓 Unlock its ends** (le tuyau se détache de ce à quoi il est joint et bouge seul), **🗑 Delete Pipe** ou Cancel.

## Unlock its IPs depuis les Properties {#unlock-its-ips-from-properties}

Un IP n'a pas de Properties à lui : il fait partie de l'objet auquel il appartient (Règle 2.9). Donc la **ligne de titre** des
Properties de tout ce qui a des IPs (un Device, un Widget, une Manual Valve, un Hose Bib, un raccord ou une cuve) a un bouton
**🔓 Unlock its IPs** et un bouton **↔ Move with pipes**, et un Pipe ou un Hose a **🔓 Unlock its ends**. Servez-vous-en quand un tuyau ou un tuyau souple s'est joint à
quelque chose sans que vous le vouliez, par exemple un tuyau souple qui s'est accroché à l'IP d'un Tee :

1. En **Edit layout**, double-cliquez sur le Tee (ou sur le tuyau souple) pour ouvrir ses Properties.
2. Appuyez sur **🔓 Unlock its IPs** (sur le tuyau souple : **🔓 Unlock its ends**). Chaque bout de tuyau dessus se détache tout de
   suite et reste où il est, comme un bout ouvert.
3. Fermez ou enregistrez (Close ou Save), puis traînez le bout ouvert où vous le voulez. **↩ Put back** (Ctrl+Z) le joint de nouveau.

À côté, **↔ Move with pipes** est l'autre choix de la fenêtre : appuyez dessus, fermez ou enregistrez, puis attrapez l'objet et il bouge
**avec** ses tuyaux, sans la fenêtre. Il n'est pas sur un Pipe ou un Hose, et il est gris quand un tuyau ou raccord 🔒 verrouillé devrait bouger avec lui.

Les boutons sont gris quand rien n'y est joint, quand l'objet est 🔒 verrouillé (déverrouillez-le d'abord) ou quand l'équipement de son
Tab est verrouillé (lock_Equipment). Posez la souris dessus pour voir pourquoi.

## Zoomer sur un raccord (Z) {#zoom-in-on-a-join-z}

En **Edit layout**, appuyez sur **Z** (pas pendant que vous tapez dans une case). Une fenêtre s'ouvre dans le coin du haut du Tab et
montre les **200 pixels autour de la souris, 3 fois plus grands**, avec une croix jaune là où est la souris. Bougez la souris, ou
traînez un bout de tuyau ou un objet comme d'habitude, et la fenêtre suit, pour voir exactement où un bout tombe sur un IP. La
fenêtre sert seulement à regarder : elle ne prend jamais de clic. Appuyez de nouveau sur **Z** ou sur **Échap** pour la fermer.

## Rendre un tuyau plus court ou plus long, et redessiner un tuyau souple {#making-a-pipe-shorter-or-longer-and-redrawing-a-hose}

Un tuyau (pipe) ou un tuyau souple (hose) peut changer après avoir été enregistré, une fois ses bouts détachés :

1. En **Edit layout**, attrapez le tuyau ou le tuyau souple et choisissez **🔓 Unlock its ends** (ou attrapez ce à quoi il est joint et choisissez **🔓 Unlock its
   IPs**).
2. Chaque bout détaché a une petite poignée ronde. Traînez-la :
   - un bout de **tuyau** glisse le long de la propre ligne du tuyau, donc le tuyau devient **plus court ou plus long** et reste Horizontal, Vertical ou à 45
     (Règle 5.19). Il n'est jamais plus court que 10 pixels.
   - un bout de **tuyau souple** va **n'importe où**, et le tuyau souple se courbe pour suivre. Les poignées rondes au milieu d'un tuyau souple changent ses courbes.
3. Lâchez le bout sur un IP (à moins de 14 pixels) et il se joint à cet IP. Lâché ailleurs, il reste un bout ouvert.

Un bout détaché peut être attrapé même là où il est posé sur un IP de pompe, de vanne ou de cuve. Un bout encore joint, un tuyau ou tuyau souple 🔒 verrouillé,
et un bout sur un IP 🔒 verrouillé (aussi un IP réglé sur No Unlock) ne bougent pas. **↩ Put back** (Ctrl+Z) annule chaque glissement, et **Save layout**
garde la nouvelle longueur ou forme.

## Mettre une nouvelle pompe à la place d'une ancienne {#putting-a-new-pump-in-place-of-an-old-one}

Le plus rapide est **🔁 Swap places with...** : attrapez l'ancienne pompe, choisissez la nouvelle dans la liste, et la nouvelle pompe est tout de suite sur les tuyaux de l'
ancienne. L'ancienne pompe va là où était la nouvelle.

Ou à la main : attrapez l'ancienne pompe, choisissez **🔓 Unlock its IPs**, traînez-la ailleurs, puis traînez la nouvelle pompe au même endroit. Une pompe sans
tuyau a toujours des IP libres. Quand vous la lâchez près des bouts de tuyau ouverts (à environ 30 pixels), elle glisse le dernier bout en place, son **entrée** va
sur l'endroit où était l'entrée de l'ancienne pompe et sa **sortie** là où était l'ancienne sortie (l'un de ses 8 IP, quel que soit le côté de l'ancienne pompe),
et les tuyaux se joignent à elle. Chaque pompe Skynet a ses IP aux mêmes endroits (le Pump Standard, Règle 5.27), donc deux pompes de même taille
s'alignent. Une vanne ou une Manual Valve sans tuyau glisse sur ses bouts ouverts de la même façon.

## ↩ Put back (Ctrl+Z)

**↩ Put back** sur la barre Edit layout (ou **Ctrl+Z**) annule le dernier déplacement, redimensionnement, déverrouillage, échange ou **suppression** (un Device, un Widget, un tuyau ou tout ce qui est supprimé depuis ses Properties : aucune fenêtre « Delete this item? » ne demande d'abord), pour que les tuyaux et raccords reviennent
là où ils étaient. Appuyez de nouveau pour revenir plus loin (jusqu'à 30 étapes). Posez la souris dessus pour voir ce qu'il va remettre. Il repart
à zéro chaque fois que vous ouvrez Edit layout. Les autres changements faits dans une fenêtre Properties n'y sont pas ; **Exit** sans enregistrer annule quand même
tout depuis le dernier Save layout.
