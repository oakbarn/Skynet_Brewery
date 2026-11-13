# Vannes d'eau du robinet {#tap-water-valves}

Certaines vannes sont montées directement sur une sortie d'eau du robinet (un robinet de jardin ou une conduite d'eau). Quand l'une d'elles s'ouvre, l'eau se met à couler grâce à la pression du réseau. Aucune pompe n'est nécessaire.

Activez **Tap water valve** pour une telle vanne, et le panel montre l'écoulement dans les tuyaux dès que la vanne est ouverte.

## Faire d'une vanne une vanne d'eau du robinet {#make-a-valve-a-tap-water-valve}

1. **Tabs > Edit layout**, puis ouvrez les propriétés de la vanne. Sur un PC, **double-cliquez** dessus. Sur un iPhone, **gardez le doigt dessus**.
2. Le **Kind** doit être **valve**.
3. Allumez l'interrupteur **Tap water valve**, et choisissez par quel bout l'eau sort dans **Tap water flows out of**.
4. Appuyez sur **Save**, puis sur **Save layout**.

## Comment l'écoulement s'affiche {#how-the-flow-shows}

- **Vanne ouverte :** l'écoulement sort de la vanne dans les tuyaux rigides ou souples qui lui sont reliés, et continue jusqu'à un bout de ligne : un port de cuve, un bout de tuyau souple ouvert, un simple point IP, ou l'entrée d'une pompe en marche.
- **Vanne fermée :** aucun écoulement, comme pour n'importe quelle vanne fermée.
- Une vanne d'eau du robinet coule **dans un seul sens** : par un seul bout. **Tap water flows out of** dans ses propriétés choisit lequel : **The second end (right or bottom)** (le second bout, à droite ou en bas ; le cas habituel), **The first end (left or top)** (le premier bout, à gauche ou en haut), ou **Both ends** (les deux bouts). Dans Edit layout, les bouts affichent **TAP** (le côté robinet) et **OUT**. Rien ne revient vers le côté robinet.
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
