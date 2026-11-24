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
   suite et reste où il est, comme un bout ouvert, et les Properties s'enregistrent et se ferment toutes seules (un seul clic).
3. Traînez le bout ouvert où vous le voulez. **↩ Put back** (Ctrl+Z) le joint de nouveau.

À côté, **↔ Move with pipes** est l'autre choix de la fenêtre : appuyez dessus (les Properties s'enregistrent et se ferment toutes seules), puis attrapez l'objet et il bouge
**avec** ses tuyaux, sans la fenêtre. Il n'est pas sur un Pipe ou un Hose, et il est gris quand un tuyau ou raccord 🔒 verrouillé devrait bouger avec lui.

**🔓 Unlock one IP ▾** (sur un Pipe ou un Hose : **🔓 Unlock one end ▾**) est là quand 2 bouts de tuyau ou plus y sont joints.
Choisissez un IP dans la liste et seul ce bout de tuyau se détache ; les autres restent joints. Les Properties s'enregistrent et se
ferment toutes seules, et **↩ Put back** (Ctrl+Z) le rejoint.

Les boutons sont gris quand rien n'y est joint, quand l'objet est 🔒 verrouillé (déverrouillez-le d'abord) ou quand l'équipement de son
Tab est verrouillé (lock_Equipment). Posez la souris dessus pour voir pourquoi.

## Zoomer sur un raccord (Z) {#zoom-in-on-a-join-z}

En **Edit layout**, pointez un tuyau ou un raccord et appuyez sur **Z** (pas pendant que vous tapez dans une case). Une fenêtre
s'ouvre sur toute la zone de travail. Elle montre ce que vous avez pointé **2,5 fois plus grand**. Quand tout le collecteur pointé (les tuyaux, raccords, vannes et
pompes qui y sont joints, avec 50 pixels tout autour) tient à 2,5x, la fenêtre est centrée dessus ; sinon, sur la souris. Elle reste où elle s'est ouverte. Un clic ou un double-clic
sur un endroit vide de la fenêtre n'ouvre jamais les Tab settings.

**Travaillez directement dans la fenêtre :** traînez-y un bout de tuyau, un IP ou un objet avec le bouton gauche de la souris,
comme sur le Tab, et il bouge aussi sur le Tab, plus finement, pour poser un bout exactement sur un IP. Les clics et les
doubles-clics y marchent aussi (un double-clic ouvre les Properties, sauf sur un IP rouge).

**Se déplacer dans la fenêtre :** gardez le bouton de la souris enfoncé et approchez-vous d'un bord de la fenêtre : la vue se
déplace de ce côté sur le collecteur, et ce que vous traînez suit. Éloignez-vous du bord, ou lâchez, et elle s'arrête. Quand le Tab
est plus grand que la fenêtre, elle a des **barres de défilement** sur ses bords droit et bas : traînez-en une, ou cliquez le long
pour y sauter. La molette de la souris défile vers le haut et le bas, et **Shift + molette** sur le côté.

Appuyez sur **Échap** ou sur le **✕**
rouge dans son coin en haut à droite pour la fermer.

**Joindre deux IP avec un tracé (seulement dans la fenêtre de zoom) :** double-cliquez sur un IP rouge pour commencer une ligne
de tracé rouge, puis cliquez sur l'IP auquel le joindre. Appuyez sur **🔧 Auto configure** : le premier IP se pose sur le second
et ils se joignent, et ce qui est joint derrière suit pour qu'aucun raccord ne se défasse. Deux bouts ouverts (points rouges) qui se rejoignent en angle reçoivent un coude (un té là où trois tuyaux se rejoignent, et ainsi de suite). Un tuyau droit s'allonge ou se raccourcit
pour la part du déplacement le long de sa ligne, et seule la part en travers passe à ce qui est à son autre bout (un té glisse le
long de ses tuyaux à niveau, le tuyau qui monte à un coude se raccourcit), et ainsi de suite ; un tuyau coudé prend tout le déplacement à son coude, et un tuyau souple se plie. Si cela
défaisait un raccord, le second IP est essayé sur le premier. Si aucun ne marche, rien ne bouge et un message dit que cela ne
peut pas se faire automatiquement : faites-le à la main, en supprimant ou en ajoutant des tuyaux, des raccords ou des joints.
Deux IP déjà joints par un tuyau, même très court, sont déjà joints : le débit passe par ce tuyau, donc rien ne change.
**Cancel trace** ou **Échap** enlève le tracé, et ↩ Put back (Ctrl+Z) annule un Auto configure.

## Rendre un tuyau plus court ou plus long, et redessiner un tuyau souple {#making-a-pipe-shorter-or-longer-and-redrawing-a-hose}

Un tuyau (pipe) ou un tuyau souple (hose) peut changer après avoir été enregistré, une fois ses bouts détachés :

1. En **Edit layout**, attrapez le tuyau ou le tuyau souple et choisissez **🔓 Unlock its ends** (ou attrapez ce à quoi il est joint et choisissez **🔓 Unlock its
   IPs**).
2. Chaque bout détaché a une petite poignée ronde. Traînez-la :
   - un bout de **tuyau** glisse le long de la propre ligne du tuyau, donc le tuyau devient **plus court ou plus long** et reste Horizontal, Vertical ou à 45
     (Règle 5.19). Il n'est jamais plus court que 10 pixels.
   - un bout de **tuyau souple** va **n'importe où**, et le tuyau souple se courbe pour suivre. Les poignées rondes au milieu d'un tuyau souple changent ses courbes.
3. Lâchez le bout sur un IP (à moins de 14 pixels) et il se joint à cet IP. Lâché ailleurs, il reste un bout ouvert.

Un bout détaché peut être attrapé même là où il est posé sur un IP de pompe, de vanne ou de cuve. Sur un raccord (un té, un coude,
tout raccord), le raccord gagne : appuyer dessus attrape le raccord, pas un raccord d'about (coupling) ni un bout détaché posé
par-dessus. Attrapez le coupling ou le bout à côté du raccord. Un bout dont le coude, le té ou le Device a été supprimé devient tout de suite un bout ouvert : un petit **point rouge** comme tout IP ouvert, qui peut être attrapé, joint ou tracé (🔗) dans la fenêtre Zoom. Pour enlever un point rouge dont vous ne voulez pas, appuyez dessus puis sur la touche **Suppr** (Delete) : le point s'en va, son tuyau reste, et ce bout de tuyau reste simple (aucun point ne revient). Deux clics rapides sur un point rouge ouvrent ses Properties, qui ont aussi 🗑 Delete (dans la fenêtre Zoom, un double-clic commence plutôt un tracé). Un bout encore joint, un tuyau ou tuyau souple 🔒 verrouillé,
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

**Touche Suppr :** cliquez sur un objet en Edit layout et appuyez sur **Suppr** (Delete) ou sur **Retour arrière** (sur un Mac, la touche
**delete**) pour le supprimer, comme Delete dans ses Properties. Ctrl+Z (Cmd+Z sur un Mac) le ramène. Elle ne fait rien pendant que vous tapez dans une case ou qu'une fenêtre est ouverte, et un objet
verrouillé reste où il est.
