# Bouton Override {#override-button}

Le **bouton Override** (forcer) permet à une journée de brassage de continuer quand un Process est bloqué dans une attente. **Un appui et chaque Process qui tourne avance**, 100 ms plus tard, comme le fait **Skip** dans le simulateur, mais sur la vraie horloge :

- un **wait** où il est retenu (`wait Kettle_Temp >= 152`) est passé, comme s'il était atteint ;
- un **sleep** où il est se termine maintenant ;
- la **boucle** où il se trouve est quittée : le prochain `goto` qui saute vers le haut (souvent dans un `if`) est passé, donc le Process continue avec la ligne en dessous.

Après cela, le Process tourne normalement : le **wait** ou le sleep **suivant** attend comme d'habitude. Appuyez de nouveau sur Override pour passer celui-là aussi. Un appui que rien n'utilise dans la seconde est abandonné, donc il ne saute jamais quelque chose plus tard par surprise.

**Les vannes manuelles attendent toujours** leur clic (Widget Manual Valve) ou leur bouton **Done**.

**Les Processes Looper sont laissés tranquilles.** Un Looper (classe de Process Looper, comme `looper_LogTemps`) tourne seul en arrière-plan, par exemple en copiant une température pour le journal toutes les quelques secondes. Override ne le fait jamais avancer, donc ne l'arrête jamais.

Seul un operator ou un admin peut appuyer dessus. Chaque Process qui a avancé écrit une ligne dans sa console, par exemple `Override: the wait on line 12 was passed`.

## En ajouter un {#adding-one}

En Edit layout, appuyez sur **Override ➕** dans la barre Edit layout. Il est fait sur le 🔨 Build Tab, comme chaque nouveau Widget, et ses Properties s'ouvrent. **Save Build ...** l'envoie vers un Tab.

- **Un seul bouton Override par Tab.** Le panel n'en mettra pas un second sur un Tab qui en a un.
- **Il peut être sur plusieurs Tabs.** Appuyez sur **COPY** dans ses Properties, puis **Save Build ...** vers un autre Tab. Le bouton de chaque Tab a son **propre Label et son propre aspect**, et ils font tous la même chose.

## Override Button Widget Properties

En haut : **🗑 Delete**, **COPY**, **✖ Cancel** et **💾 Save** (Delete, Cancel et Save aussi en bas). Le **?** orange ouvre une fenêtre avec plus d'informations.

### La case Label {#the-label-box}

- **Label** : ce que dit le bouton sur ce Tab. Un nouveau dit **Override** ; vide remet Override. Les Rich Text Embedded Codes marchent ici (`\b`, `\n`, `\c{Yellow}` ...).
- **Font size**, **Font**, **Bold**, **Fore color**, **Back color** et **Alignment**.

Il commence en **Override** blanc gras sur rouge. Cet aspect de départ est pour l'instant et peut changer.

### La case Properties {#the-properties-box}

- **Tab**, **X Horizontal**, **Y Vertical**, **Width**, **Height** et **Lock position** 🔓 / 🔒.

Le bouton Override n'a **pas de nom** (un Process ne l'utilise pas, une personne appuie dessus) et **pas d'image de fond**.
