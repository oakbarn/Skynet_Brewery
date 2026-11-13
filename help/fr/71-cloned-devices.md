# Devices clonés {#cloned-devices}

Un Device peut s'afficher sur plus d'un Tab grâce à un **Clone**.

Un Clone est **le même Device**, pas une copie. Il montre ce que montre son parent (le Device à partir duquel il a été cloné), et le toucher revient à toucher le parent :

- Un Clone d'un Device on / off (une pompe, une vanne, une sortie) allume ou éteint le parent, et le parent et chaque Clone le montrent.
- Un Clone d'un Device avec **Enabled** (un PID, une Hysteresis ou un Duty Cycle) l'allume ou l'éteint de la même façon que le parent.
- Un Clone d'un Device qui lit (une sonde de température OneWire, un capteur) montre seulement la mesure, dans le même format que le parent.

## Faire un Clone {#make-a-clone}

Le seul moyen de faire un Clone est le bouton **⧉ Clone Device** dans la barre Edit layout (Admins). Il marche sur n'importe quel Tab, le 🔨 Build Tab aussi.

1. Allez sur le Tab où doit être le Clone (ou sur le Build Tab) et appuyez sur **⧉ Clone Device**.
2. La liste contient les Devices déjà placés sur un Tab (pas ceux déjà sur ce Tab), groupés par type : Pumps, Valves, Heat, Temperature probes, Other outputs, Motors, Inputs and sensors.
3. Choisissez-en un et appuyez sur **Save**. Le Clone apparaît sur le Tab ; faites-le glisser à sa place.

Un Clone fait sur le Build Tab va vers un Tab avec **Save Build**, comme tout ce qui y est construit.

## Le nom du Clone {#the-clone-s-name}

Skynet fait le nom, et on ne peut pas le retaper : le nom du parent, puis `_Clone_` et un numéro.

`MB_06_DO@Pump_Wort__HS` cloné une fois donne `MB_06_DO@Pump_Wort__HS_Clone_1`, le Clone suivant est `MB_06_DO@Pump_Wort__HS_Clone_2`.

Le nom sert seulement à distinguer les Clones quand vous regardez leurs Properties ; rien d'autre ne l'utilise. En coulisses, un Clone est lié à son parent, donc il continue de marcher quel que soit le nom du parent. Si le parent est renommé, ses Clones suivent (`..._Clone_1` garde son numéro).

## Les Properties d'un Clone {#a-clone-s-properties}

Double-cliquez sur un Clone en Edit layout. Seuls ceux-ci lui sont propres :

- **Visible** : désactivé, il cache le Clone sur son Tab seulement. Le parent et les autres Clones restent visibles.
- **Tab** : le Tab où est le Clone. Choisissez un autre Tab pour y déplacer le Clone (le parent reste où il est).
- **X** et **Y** : sa place sur son Tab.
- **Lock position**, comme tout autre élément.

Tout le reste (images, aspect, taille, Interface, port, valeur, on et off) appartient au parent. Changez-le dans les Properties du parent et chaque Clone suit. En Edit layout, un Clone a un contour en pointillés et une marque ⧉ ; on peut le faire glisser mais pas le redimensionner (sa taille est celle de son parent).

Un Clone de pompe ou de vanne a ses propres IP, donc des tuyaux de son Tab peuvent y être tracés. Le passage sur ce Tab suit la pompe ou la vanne, comme pour le parent.

## Clones et Processes {#clones-and-processes}

Un Clone **n'est pas utilisé dans les Processes**. Un Process utilise le nom du parent, et chaque Clone montre ce que le Process a fait.

## Supprimer {#deleting}

- Supprimer un Clone ne supprime que le Clone.
- Supprimer le Device parent demande ce que vous voulez :
  - **🗑 Delete the Device and all its Clones** (supprimer le Device et tous ses Clones), ou
  - **Make (a Clone) the Device** (faire d'un Clone le Device) : un bouton pour chaque Clone. Le Device va là où est ce Clone, sur son Tab, et ce Clone
    disparaît. Le Device garde son nom, son Port et ses Processes, et les tuyaux joints à ce Clone sont maintenant joints au Device. Les
    autres Clones restent des Clones de lui.
  - **✖ Cancel** garde tout.
- Supprimer un Tab supprime les Clones qui y sont, et les Clones des Devices qui y étaient.

## Method Clones (Devices avec plus d'une méthode de commande) {#method-clones-devices-with-more-than-one-control-method}

Un Device avec plus d'une méthode de commande, comme une Heating Element (On/Off, Duty Cycle, Hysteresis, PID, Deadband), peut avoir
des **Method Clones** (Règle 4.4) : chacun est une tuile qui représente une méthode, avec son propre Label. Ils peuvent aller sur le
Tab du Device lui-même : **⧉ Clone Device > Method Clone**. Il montre ON seulement tant que le Device est ON dans cette méthode. Un clic sur un Method Clone agit
exactement comme un clic sur le Device, tout à l'unisson, sans fenêtre : quand il montre ON, le clic éteint le Device ; quand il montre OFF, le
clic passe le Device à sa méthode et l'allume. Voir [One Heating Element, pick how it heats](150-heating-method).
