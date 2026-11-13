# Widget Picture {#picture-widget}

Un **Picture Widget** montre une image sur un Tab. C'est un Widget (il n'existe que dans l'application), donc sa fenêtre Properties s'appelle **Picture Widget** (c'était « Picture element » ; Skynet n'utilise pas le mot élément (element) pour les choses sur un Tab).

## Ajouter un Widget Picture {#adding-a-picture-widget}

Appuyez sur **Picture ➕** dans la barre Edit layout (ou **Add Widget > Pictures and text > Picture Widget**). La fenêtre **Picture Widget** s'ouvre. Elle marche comme la fenêtre Add Device d'une pompe, mais un Widget n'a ni Interface ni Port, et il est d'abord fait sur le 🔨 Build Tab :

1. **Label** (le ⬢ règle sa police, sa taille et ses couleurs) et **Label Visible** (commence à No : une image n'a d'habitude pas besoin de Label).
2. **Picture** : l'image qu'il montre. Choisissez-la dans la liste (le 🖼 ouvre le sélecteur d'icônes).
3. **Tab** : grisé, **🔨 Build Tab**. Quand le Widget est prêt, envoyez-le vers son Tab.

Rien d'autre ne s'affiche tant que le Label et la Picture ne sont pas faits. **Entrée** passe par Label, Picture, puis **➕ Add Widget**. Appuyer trop tôt sur ➕ Add Widget dit ce qui manque encore.

Puis le reste s'affiche : le **Name** (le Suggested Name **wgt_PIX_Label_TabID**, par exemple wgt_PIX_Kettle_Element_BH ; il suit le Label et le Tab jusqu'à ce que vous tapiez le vôtre), le **Graphic** (l'image telle qu'elle s'affichera), **Turns on with** avec **Toggle** sur la même ligne, l'**Overlay**, **Text on picture**, X, Y, Width et Height, et le **Widget Type** (Picture) grisé.

## Properties du Widget Picture {#picture-widget-properties}

Double-cliquez sur un Widget Picture pour ouvrir ses Properties. Elles ressemblent à celles d'une pompe : le cadenas 🔓, **Visible** et **Hidden Locked** sur la ligne du titre, puis 1 Label ⬆ ⬢ et Label Visible, 2 Picture, 3 Tab, 4 Name (✏ Change name une fois construit), le Graphic, Turns on with et Toggle, Overlay, Text on picture, X, Y, Width, Height et le Widget Type. Le Label ne peut pas être vide : un Label vide devient le Name quand vous enregistrez.

**Toggle** est ce que fait un appui sur ce avec quoi il s'allume : **On/Off** l'allume ou l'éteint en un clic, **Push button** le garde allumé seulement tant qu'on appuie, **None** ne fait rien.

## Turns on with

**Turns on with** (s'allume avec) choisit ce qui allume l'image :

- **None** : une image fixe. L'**Overlay** et **Picture when on** sont grisés, car rien ne l'allume.
- **Devices et Widgets on / off** : une sortie, un interrupteur, une entrée, une alarme, un lecteur de sons, une minuterie ou une variable vrai / faux. L'image est On tant que celui-ci est On.
- **Heaters: on while Enabled** (chauffages : On tant qu'ils sont Enabled) : un PID, une Hysteresis, un Duty Cycle ou une sortie PWM. L'image est On tant que le chauffage est **Enabled** (une sortie PWM : tant qu'elle est au-dessus de 0 %), pas seulement pendant que sa sortie chauffe.

Double-cliquez sur la liste pour ouvrir les Properties de celui qui est choisi (voir [Double-click in picker dropdowns](73-double-click-in-pickers)).

## Ses images {#its-pictures}

1. **Picture** : l'image qu'il montre. Choisissez-la dans la liste des images (avec groupes, aperçu et sélecteur d'icônes 🖼).
2. **Overlay** : dessinée par-dessus quand il est On. **C'est la façon préférée.**
3. **Picture when on (a second picture, optional)** : dans le ⬢ à côté de l'Overlay. Toute une seconde image à la place, pour les cas qui en demandent deux. La Back Colour (derrière l'image) est là aussi.

Exemple : le **pic_Kettle_Element** de l'exemple à deux cuves s'allume avec **Kettle_Heat** et passe d'une image de résistance à l'autre. Avec la façon préférée, il garderait l'image Off et ajouterait **Glow red** comme superposition On.

Voir aussi [On overlay](58-on-overlay) et [Pictures on items](25-picture-paths).
