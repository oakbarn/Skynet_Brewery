# Vannes manuelles {#manual-valves}

Une vanne peut être **Electro_Mechanical** (électromécanique : une vanne motorisée ou une électrovanne, commutée par sa broche sur une carte) ou **Manual** (manuelle : une vanne à boisseau sphérique que vous tournez à la main). Quand un Process ouvre ou ferme une vanne **Manual**, le panel affiche une fenêtre qui vous dit quoi faire, et le Process attend que vous appuyiez sur **Done** (fait).

C'est pratique quand une vanne électrique tombe en panne le jour du brassage : passez-la en Manual et continuez à brasser. Le Process reste le même.

## Rendre une vanne Manual {#make-a-valve-manual}

1. **Tabs > Edit layout**, puis ouvrez les propriétés de la vanne. Sur un PC, **double-cliquez** dessus. Sur un iPhone, **gardez le doigt dessus**.
2. Le **Kind** doit être **valve**.
3. Réglez **Valve type** sur **Manual**. (**Electro_Mechanical** est la vanne normale, commutée.)
4. Appuyez sur **Save**, puis sur **Save layout**.

La broche de la carte d'une vanne Manual est laissée tranquille, donc une vanne en panne n'est pas allumée et éteinte pour rien.

## Dans un Process {#in-a-process}

Écrivez-la comme n'importe quelle vanne :

```
VGC_Kettle_Out = true
VGC_Kettle_Out.state = false
```

Quand la ligne s'exécute, chaque écran affiche **✋ Manual valve: OPEN Kettle outlet by hand** (ouvrir la sortie de la cuve à la main ; ou CLOSE, fermer). Tournez la vanne, puis appuyez sur **Done: it is open**. La vanne s'affiche ouverte sur les Tabs, et le Process passe à la ligne suivante. Si la vanne est déjà dans cette position, rien n'est demandé.

- Les Operators et les Admins peuvent appuyer sur **Done**. Les Viewers voient la fenêtre mais ne peuvent pas appuyer.
- Arrêter le Process fait disparaître la fenêtre.
- Vous pouvez retirer les anciennes lignes qui demandaient une vanne manuelle d'une autre façon (un message et une attente), car cette fenêtre fait le même travail.

Un Brew Day Equipment Profile, où vous passez une vanne en Manual pour une seule journée de brassage sans changer le Equipment Profile, arrive avec le Brew Day.

Un **Manual Valve Widget** (une vanne dessinée sur un Tab, sans broche de carte) marche autrement : un clic dessus sur son Tab est la seule chose qui l'ouvre ou la ferme, et un Process attend ce clic. Voir [Raccords de tuyauterie et vannes manuelles](87-pipe-fittings-and-manual-valves).
