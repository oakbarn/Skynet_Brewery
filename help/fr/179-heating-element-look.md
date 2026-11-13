# Les résistances et les vannes à l'écran {#heating-elements-and-valves-on-the-screen}

L'aspect d'une résistance et d'une vanne sur un Tab, et comment elles répondent à un clic (Règles Skynet 2.46, 6.19 et 7.8).

## L'On overlay {#the-on-overlay}

Tant que quelque chose est en marche, son **Overlay** est dessiné par-dessus son image. Il n'a **pas de bordure** et il est **dessiné petit**,
au milieu de l'image, pour que l'image dessous se voie encore. C'est pareil pour tous les overlays : pompes, vannes, résistances
et vos propres images. Une lueur (Glow red, orange ou blue) colore l'image elle-même et l'anneau vert lumineux l'entoure, donc ces
deux-là restent de la taille de l'image.

L'**Overlay d'une résistance** a ces choix :

| Overlay | Ce qui s'affiche tant qu'elle est en marche |
|---|---|
| **Glow** (au départ) | Elle rougeoie. Une résistance Skynet montre son image rougeoyante ; une intégrée à un Vessel Device rougeoie en orange. |
| **None** | Rien du tout. L'image reste telle quelle. |
| Un éclair ou une autre image | La lueur, avec l'image dessinée petite par-dessus. |

## Les boutons de méthode {#the-method-buttons}

Une résistance qui a plus d'une méthode de chauffe permise a un petit bouton pour chacune juste sous son image. Les boutons sont
dans une case invisible aussi large que les méthodes que vous avez cochées, avec son milieu sous le milieu de l'image. Un clic sur un
bouton passe la résistance à cette méthode ; celle utilisée est rouge. Choisir une méthode ne la met jamais en marche.

**Direct** est tout ou rien. Elle s'appelait autrefois **On/Off** ; un Process qui dit encore `hE_1.method = "On/Off"` marche de même.

Pour que les boutons prennent moins de place, activez **Short method names on its buttons** dans les Properties de la résistance (sous les cases à cocher
des méthodes) :

| Méthode | Nom court |
|---|---|
| Direct | DO |
| Duty Cycle | DutyC |
| Hysteresis | HYS |
| PID | PID |
| Deadband | DeadB |
| Precise | PREC |

Ce sont les mêmes mots courts qu'utilise un Process, par exemple `hE_1.HYS`. Il n'y a pas de bouton d'arrêt : un clic sur l'image arrête
la résistance.

## Toggle ou Push Button {#toggle-or-push-button}

Une vanne et une résistance ont toujours l'un de ces deux dans leur case **Toggle**. Il n'y a pas de None.

- **Toggle** (au départ) : un clic sur l'image la met en marche ou l'arrête tout de suite.
- **Push Button** (bouton poussoir) :
  - **Une résistance :** vous pouvez appuyer et la résistance est en Direct, en marche, tant que vous tenez le bouton. Vous ne pouvez plus la mettre
    en marche et l'arrêter d'un clic sur l'image.
  - **Une vanne :** vous pouvez appuyer et la vanne est en Direct, en marche, tant que vous tenez le bouton. Vous ne pouvez plus la mettre
    en marche et l'arrêter d'un clic sur l'image.
  - **Si elle est déjà en marche**, le Push Button est inversé : appuyer l'arrête, mais seulement tant que l'image est tenue enfoncée.
    Relâchez et elle est de nouveau en marche.

Un **Process ignore ce choix** : un Process, l'.API et la voix la mettent en marche ou l'arrêtent comme toujours. Une vanne ou une résistance qui avait
None est passée en Toggle quand son Schema se charge. Une vanne manuelle n'a pas d'alimentation, donc elle n'a ni l'un ni l'autre.

⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.
