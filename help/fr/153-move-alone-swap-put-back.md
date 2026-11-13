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
**🔓 Unlock its ends** (le tuyau se détache de ce à quoi il est joint et bouge seul) ou Cancel.

## Mettre une nouvelle pompe à la place d'une ancienne {#putting-a-new-pump-in-place-of-an-old-one}

Le plus rapide est **🔁 Swap places with...** : attrapez l'ancienne pompe, choisissez la nouvelle dans la liste, et la nouvelle pompe est tout de suite sur les tuyaux de l'
ancienne. L'ancienne pompe va là où était la nouvelle.

Ou à la main : attrapez l'ancienne pompe, choisissez **🔓 Unlock its IPs**, traînez-la ailleurs, puis traînez la nouvelle pompe au même endroit. Quand vous la
lâchez, chaque bout de tuyau ouvert qui était sur l'**entrée** de l'ancienne pompe se joint à l'entrée de la nouvelle, et la **sortie** à sa sortie (le même bout,
à moins de 14 pixels de l'endroit où était l'ancien IP). Chaque pompe Skynet a ses IP aux mêmes endroits (le Pump Standard, Règle 5.27), donc deux
pompes de même taille et de même place s'alignent.

## ↩ Put back (Ctrl+Z)

**↩ Put back** sur la barre Edit layout (ou **Ctrl+Z**) annule le dernier déplacement, redimensionnement, déverrouillage ou échange, pour que les tuyaux et raccords reviennent
là où ils étaient. Appuyez de nouveau pour revenir plus loin (jusqu'à 30 étapes). Posez la souris dessus pour voir ce qu'il va remettre. Il repart
à zéro chaque fois que vous ouvrez Edit layout. Les changements faits dans une fenêtre Properties n'y sont pas ; **Exit** sans enregistrer annule quand même
tout depuis le dernier Save layout.
