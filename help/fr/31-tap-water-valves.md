# Vannes d'eau du robinet {#tap-water-valves}

Certaines vannes sont montées directement sur une sortie d'eau du robinet (un robinet de jardin ou une conduite d'eau). Quand l'une d'elles s'ouvre, l'eau se met à couler grâce à la pression du réseau. Aucune pompe n'est nécessaire.

Activez **Tap water valve** pour une telle vanne, et le panel montre l'écoulement dans les tuyaux dès que la vanne est ouverte.

## Faire d'une vanne une vanne d'eau du robinet {#make-a-valve-a-tap-water-valve}

1. **Tabs > Edit layout**, puis ouvrez les propriétés de la vanne. Sur un PC, **double-cliquez** dessus. Sur un iPhone, **gardez le doigt dessus**.
2. Le **Kind** doit être **valve**.
3. Allumez l'interrupteur **Tap water valve**, et choisissez dans quel sens l'eau coule dans **Tap Water flows**.
4. Appuyez sur **Save**, puis sur **Save layout**.

## Comment l'écoulement s'affiche {#how-the-flow-shows}

- **Vanne ouverte :** l'écoulement sort de la vanne dans les tuyaux rigides ou souples qui lui sont reliés, et continue jusqu'à un bout de ligne : un port de cuve, un bout de tuyau souple ouvert, un simple point IP, ou l'entrée d'une pompe en marche.
- **Vanne fermée :** aucun écoulement, comme pour n'importe quelle vanne fermée.
- Une vanne d'eau du robinet coule **dans un seul sens** : par un seul bout. **Tap Water flows** dans ses propriétés choisit le sens : **Right to Left** (de droite à gauche) ou **Left to Right** (de gauche à droite) quand la vanne est Horizontal, **Bottom to Top** (de bas en haut) ou **Top to Bottom** (de haut en bas) quand elle est Vertical (seuls les deux qui vont avec sa position s'affichent). Une nouvelle commence **Left to Right** (**Bottom to Top** en Vertical). Le bout TAP suit l'image (OakBarn Brewery, Panel Update 14 : « Tap Water Flow change avec les Flips, mais le dernier changé gagne et change cela ») : **Flip Horizontal** sur une vanne Horizontal, ou **Flip Vertical** sur une vanne Vertical, le passe de l'autre côté et Tap Water Flows change ; choisir l'autre sens dans Tap Water Flows retourne l'image. Passer de Horizontal à Vertical garde Left to Right en Bottom to Top. C'est toujours dans un seul sens, du côté robinet vers le côté sortie. Dans Edit layout, le côté robinet affiche toujours **TAP** et ne peut pas être cliqué ni joint ; le côté sortie est un simple point rouge ou vert. Rien ne revient vers le côté robinet.
- **Water Supply** (arrivée d'eau : None, Pipe ou Hose) dessine la conduite d'eau de la maison du côté **TAP**. Ce n'est qu'une image : elle montre toujours l'eau bleue qui coule vers la vanne, bouge avec la vanne, et son autre bout (le mur) ne se joint à rien. Ce n'est pas un Pipe normal : on ne peut pas le choisir, le déplacer ni le joindre, et seule une vanne d'eau du robinet en a un.
- **Un tuyau côté robinet :** sans rien de raccordé côté robinet, la plomberie de la maison n'est pas dessinée, donc elle a toujours de l'eau. Avec un tuyau raccordé de ce côté (par exemple depuis un Hose Bib par un Té), elle n'a de l'eau que si l'eau lui arrive par ce tuyau : d'un Hose Bib ouvert, d'une pompe en marche, d'une autre vanne d'eau du robinet qui a de l'eau, d'un bout d'IP simple ou d'un bout ouvert. Un Hose Bib fermé ou une vanne fermée de ce côté veut dire pas d'eau : rien ne coule et rien ne gicle, même si elle est ouverte. Un port de cuve n'est pas une arrivée d'eau.
- Les pompes et les autres vannes en chemin marchent comme d'habitude : une vanne fermée ou un bouchon arrête l'écoulement, une pompe éteinte le laisse passer.
- **Valve type** (Electro_Mechanical ou Manual) marche aussi comme d'habitude. Une vanne d'eau du robinet Manual demande toujours que vous la tourniez à la main.

## Dans un Process {#in-a-process}

`my_Valve.tapwater` vaut true ou false. Vous pouvez le lire ou le changer :

```
if VGC_Tap_Water.tapwater == true
  VGC_Tap_Water = true
endif
VGC_Hose_Fill.tapwater = true
```

Un changement fait par un Process dure jusqu'à ce que la vanne soit de nouveau enregistrée dans Edit layout ou que le panel redémarre. Alors l'interrupteur des propriétés de la vanne compte de nouveau. Seules les vannes ont `.tapwater` ; l'utiliser sur autre chose arrête le Process avec une erreur.
