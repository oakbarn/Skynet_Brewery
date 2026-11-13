# Superposition On {#on-overlay}

Au lieu de deux images (une pour **On**, une pour **Off**), un élément peut garder **une seule image** et montrer une petite image **par-dessus** quand il est On, par exemple un éclair. L'image du dessous reste visible.

**La superposition quand il est On est la façon préférée** dans Skynet (un standard Skynet, 2026-10-27) : une image plus une superposition On. Deux images sont toujours permises pour les cas qui en ont besoin. Dans les Properties, la superposition vient juste après l'image, et la seconde image (**Picture when on**) vient en dernier, marquée facultative.

## Quels éléments l'ont {#which-items-have-it}

Chaque Device ou Widget qui a **Picture when on** et **Picture when off** (voir On and Off pictures) a aussi **On overlay**, juste en dessous. Ce sont les Digital Outputs (pompes, vannes, brûleurs, résistances ...), les Digital Inputs, les Switches, les Alarms (montrée tant qu'elle sonne), les PWM et Analog Outputs, PID, Duty Cycle, Hysteresis, les Timers, les Steppers, les Flow meters, les Sound Players et un Widget Picture qui s'allume avec un autre élément.

**Les chauffages sont On tant qu'ils sont Enabled.** Un PID, une Hysteresis ou un Duty Cycle compte comme On dès qu'il est Enabled jusqu'à ce qu'il soit Disabled, pas seulement pendant que sa sortie chauffe. Sa superposition (ou sa seconde image) s'affiche tout le temps qu'il est Enabled, de même que la lueur du chauffage d'une cuve et un Widget Picture qui s'allume avec lui.

## La régler {#setting-it-up}

1. Appuyez sur **Edit layout** et double-cliquez sur l'élément pour ouvrir ses **Properties**.
2. Choisissez votre seule image dans **Picture when off**. Laissez **Picture when on** à **(none)**.
3. Choisissez une image dans **On overlay**. Vous voyez un petit aperçu à côté.
4. Appuyez sur **Save**.

Maintenant l'élément montre son image tout le temps, et la superposition apparaît par-dessus quand il est On.

La liste **On overlay** contient :

- **Lightning Bolt** : un éclair rouge à bord jaune au milieu. Les vannes que vous pouvez commander, les Proportional Valves et les pompes commencent avec lui (Règle Skynet 7.15, voir l'aide 121).
- **Flashing Lightning Bolt** : le même éclair, qui clignote.
- **Corner Badge Bolt** : un petit éclair jaune dans le coin en haut à droite.
- **See Through Lightning Bolt** : un grand éclair à moitié transparent au milieu.
- **Green Glow Ring** : une lueur verte autour de l'image.
- **Red Glow**, **Orange Glow** et **Blue Glow** : pas d'image en plus. Elles colorent l'image elle-même quand elle est On ; par exemple une résistance dans une cuve devient rouge. Seule la partie dessinée est colorée, utilisez donc une image à fond transparent ; sur une image à fond blanc ou plein, toute la case devient rouge.
- Vos propres superpositions du groupe d'images **On Off** (`media/Images/On_Off`), listées ensuite.
- Puis toutes les autres images de `media/Images`, et **Add new ...** pour taper le nom de la vôtre.

Les couleurs suivent ce que fait l'élément :

- Ce qui **chauffe** (une Heating Element, la chauffe d'un Fermentor Control) n'a ni **Blue Glow** ni **Green Glow Ring**.
- Ce qui **refroidit** (le refroidissement d'un Fermentor Control, une Cool / Warm Pump qui refroidit) n'a ni **Red Glow** ni **Orange Glow**,
  et a **Blue Glow** et **Green Glow Ring**.
- Tout le reste a tous les choix sauf **Blue Glow** : le bleu est gardé pour le froid.

Chaque nom commence par sa propre lettre, donc liste ouverte, vous pouvez taper cette lettre pour le choisir.

Choisissez **None** pour éteindre la superposition. Une Heating Element commence avec **Red Glow** : elle brille en rouge quand elle est On. Les images de superposition intégrées sont dans `media/Images/Skynet/On_Off` (lecture seule).

## Votre propre image de superposition {#your-own-overlay-picture}

Utilisez un **PNG ou un SVG à fond transparent**, pour que l'image du dessous se voie à travers. Un JPG, ou un PNG à fond blanc, couvrira l'image du dessous. Mettez le fichier dans le groupe d'images **On Off** (`media/Images/On_Off`) sur le Brain avec la page **File Move** (ou la page Media), et il apparaît en haut de la liste On overlay. Une image ailleurs marche aussi : choisissez-la avec **Add new ...**, par exemple `MyBolt.png`.

Vous choisissez la superposition une fois par élément, et elle prend la taille de l'image du dessous (pas de l'espace vide à côté d'une image large ou haute). Une superposition PNG ou JPG est étirée à la même largeur et hauteur que cette image, dessinez-la donc de la même forme que vos images. Un SVG peut plutôt dire où se place sa marque : l'éclair de coin intégré reste toujours dans le coin en haut à droite de l'image, le grand éclair reste au milieu, et l'anneau lumineux s'étire autour de l'image.

## Deux images marchent toujours {#two-pictures-still-work}

Rien ne change pour les éléments qui utilisent deux images. Vous pouvez même utiliser les deux : les images On et Off s'échangent comme avant, et la superposition est dessinée par-dessus quand c'est On.

## Depuis un Process {#from-a-process}

Un Process peut changer la superposition pendant qu'il tourne :

```
Pump_1.imageOverlay = "Images/Skynet/On_Off/Overlay_Bolt_Center.svg"
Pump_1.imageOverlay = ""
```

La seconde ligne éteint la superposition.
