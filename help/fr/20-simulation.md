# Mode simulation {#simulation-mode}

Le mode simulation (le mode d'essai) vous permet d'essayer toute une journée de brassage sans toucher au matériel. Les Processes, les minuteries, les alarmes et l'écran marchent exactement comme le jour du brassage, mais aucun vrai élément chauffant, aucune pompe ni aucune vanne n'est commuté. Le temps peut aussi passer plus vite, ou sauter en avant, pour que vous n'ayez pas à attendre un empâtage de 60 minutes pour voir ce qui se passe à la minute 50.

Un Admin l'active avec le bouton **🔌 Real / 🧪 Simulator** à côté du ☰ Menu, depuis **☰ Menu > Switch to Simulator**, ou dans **Settings > Simulation** (Aide : [Simulator or Real boards](77-simulator-or-real-boards)).

## Ce qui se passe quand vous l'activez {#what-happens-when-you-turn-it-on}

- Chaque Process s'arrête et chaque sortie s'éteint, pour que rien de ce qui tournait ne continue sur les vraies cartes.
- Les vraies cartes sont lâchées. Chacune est remplacée par le simulateur, donc la page **Devices** les montre comme *Simulator (simulation mode)*.
- Une barre jaune rayée **SIMULATION** s'affiche sous le menu sur chaque téléphone et ordinateur, pour que personne ne la prenne pour un vrai brassage.
- Les entrées des cartes (températures, débit, pH, etc.) viennent du simulateur. Vous pouvez aussi taper une valeur dans une entrée en la touchant, par exemple une lecture de pH.
- Les valeurs écrites dans le Log pendant qu'il est actif sont marquées **sim** dans la colonne Trigger, pour les distinguer facilement des vrais brassages.

L'éteindre fait la même chose à l'envers : chaque Process s'arrête, chaque sortie s'éteint, et les vraies cartes sont de nouveau utilisées.

> MQTT et Home Assistant continuent de tourner en mode simulation. Si une automatisation de leur côté réagit aux valeurs du Brew Panel, elle verra les fausses.

## Faire passer le temps plus vite {#making-time-go-faster}

**Speed** (vitesse) règle à quelle vitesse tourne l'horloge : normale, 2×, 5×, 10×, 25× et jusqu'à 120× plus vite. Allumer le Simulator démarre à 25× avec Auto skip actif (Aide : [The Simulator bar](85-simulator-bar)). À 10×, un empâtage de 60 minutes prend 6 minutes. Les lignes `sleep` des Processes, les minuteries, les sorties PID et Duty Cycle, et la chauffe et le refroidissement du simulateur la suivent toutes. Changez-la dans Settings ou dans la barre jaune.

## Sauter en avant {#skipping-ahead}

La barre jaune a des boutons pour les Admins :

- **+1 min**, **+5 min**, **+10 min** avancent l'horloge d'un coup. Les minuteries sautent, les sleeps finissent plus tôt, et les températures changent comme si ce temps était passé.
- **Skip to next event** (sauter au prochain événement) trouve la prochaine chose qui arrive toute seule (la fin d'un `sleep`, un Process qui attend une minuterie, un compte à rebours qui arrive à zéro) et saute à quelques secondes avant, pour que vous la voyiez arriver. Ces quelques secondes se règlent avec **"Skip to next event" stops this many seconds before it** (5 secondes si vous ne le changez pas).

La barre montre aussi quel est le prochain événement et dans combien de temps.

## Auto skip (saut automatique) {#auto-skip}

Activez **Auto skip** (dans Settings ou la barre jaune) et le panel saute tout seul, sans tableau à remplir. Chaque étape tourne quelques secondes (**Watch each step for**, 5 secondes si vous ne le changez pas), puis l'horloge saute à quelques secondes avant la prochaine chose qui arrive toute seule : la fin d'un `sleep`, une minuterie qui atteint son temps, ou un compte à rebours qui arrive à zéro. Il regarde chaque Process en marche, y compris ceux qu'un autre Process a lancés et les loopers.

Seul le temps est sauté. Une attente sur un bouton de l'écran ou un interrupteur n'est jamais sautée : appuyez sur le bouton comme le jour du brassage, et le saut automatique reprend de là. Une attente sur une lecture (une température, un niveau, un poids) est considérée comme atteinte après un temps réglé tant que **Pretend readings are reached** est actif (Aide : [Simulator or Real boards](77-simulator-or-real-boards)), et le saut automatique y saute comme pour tout autre événement.

## Le tableau des sauts de temps {#time-jumps-table}

Le tableau saute en avant tout seul. Chaque ligne dit : **quand** quelque chose commence (un Process ou une minuterie), **attendre** tant de secondes, puis **sauter en avant** de tant de temps.

Exemple : *A timer starts* (une minuterie démarre), **tm_Mash**, attendre **5** secondes, sauter de **00:50:00**. Quand l'empâtage commence, il tourne normalement pendant 5 secondes, puis la minuterie d'empâtage passe de 00:00:05 à 00:50:05. Un empâtage de 60 minutes prend environ 15 secondes à regarder au lieu d'une heure.

Utilisez l'interrupteur au début d'une ligne pour désactiver un saut sans le supprimer. Cliquez sur **Save simulation settings** après avoir changé le tableau. Les sauts de temps n'arrivent jamais qu'en mode simulation.

## La chronologie d'un Process {#process-timeline}

Le panel peut calculer quand chaque étape d'un Process va arriver, par exemple *00:10:00 après le début de l'empâtage : vérifier le pH*. Choisissez un Process et cliquez sur **Work out timeline**.

- Il lit le Process sans le lancer et sans rien commuter, avec les valeurs qu'a le panel en ce moment.
- Les lignes `sleep` et les attentes sur une minuterie (`wait "tm_Mash" value >= 00:10:00`, ou un compte à rebours qui atteint `00:00:00`) sont comptées.
- Une attente sur autre chose, comme une température ou un bouton, ne peut pas être connue à l'avance. Les étapes qui suivent sont montrées en temps *après* cette ligne.
- Les étapes à l'intérieur d'un `if` qui ne peuvent pas être connues à l'avance sont marquées **(if)**.

**Make time jumps from this** remplit le tableau des sauts de temps pour ce Process : après son démarrage, il saute à quelques secondes avant chaque étape minutée, l'une après l'autre. Vérifiez les lignes, puis cliquez sur **Save simulation settings**.

Essayez-le avec le Process **BrewDay_Flow** de l'exemple Three vessels, one pump : ses temps d'empâtage, d'ébullition et de houblonnage deviennent tous des sauts.
