# La barre du simulateur {#the-simulator-bar}

Tant que le panel est en **Simulator mode** (🧪 à côté de ☰ Menu), une barre **🧪 SIMULATION** à rayures jaunes s'affiche sous la Menu Bar sur chaque Tab. Les admins y ont la Speed, les boutons pour sauter et Auto skip.

## La cacher ou la montrer {#hide-or-show-it}

- Appuyez sur **▴ Hide** au bout droit de la barre (ou **☰ Menu > 🧪 Hide Simulator bar**). La barre disparaît complètement, le panel a donc toute la fenêtre.
- Tant qu'elle est cachée, un petit **🧪** s'affiche sur le bouton **☰ Menu**, pour que vous voyiez toujours que rien de réel n'est commandé.
- **☰ Menu > 🧪 Show Simulator bar** fait revenir toute la barre. Il n'est dans le ☰ Menu qu'en Simulator mode.
- La cacher et la montrer **ne change rien** : la Speed et Auto skip restent comme vous les avez réglés.
- C'est retenu sur cet ordinateur ou ce téléphone seulement. Chaque écran peut la cacher ou non.
- Repasser au simulateur montre toujours la barre.

## Elle commence à 25× avec Auto skip actif {#it-starts-at-25-with-auto-skip-on}

Chaque fois que le panel passe au simulateur (🔌 Real > 🧪 Simulator, le ☰ Menu, un nouveau Schema vide ou un Schema exemple), la barre s'ouvre avec :

- **Speed 25× plus vite.** Un empâtage de 60 minutes prend environ 2 minutes 24 secondes.
- **Auto skip actif.** Chaque étape tourne quelques secondes, puis le temps saute jusqu'à juste avant la suivante.

Ensuite, changez-les comme vous voulez sur la barre ; votre choix reste jusqu'à la prochaine fois que le simulateur est activé. 25× est aussi dans la liste des Speed à tout moment.

## Chaque réglage du simulateur est sur la barre {#every-simulator-setting-is-on-the-bar}

Chaque réglage du simulateur est sur cette barre, et seulement là. Speed et Auto skip sont sur la barre elle-même et sont enregistrés dès que vous les changez. Appuyez sur **⚙ Settings** sur la barre (Admins) pour le reste :

- **"Skip to next event" stops this many seconds before it** (5 secondes si vous ne le changez pas).
- **Auto skip: watch each step for (seconds)** (5 secondes si vous ne le changez pas).
- **Pretend readings are reached** et **after (clock seconds)** (actif, 60 secondes si vous ne le changez pas).
- Le tableau **Time jumps** et la **Process timeline** (Aide : [Le mode simulation](20-simulation)).

Appuyez sur **Save** en haut ou en bas, ou sur **Close** pour le ranger. Les réglages du simulateur ne sont ni dans Settings ni sur l'onglet Default settings.

## Cloner un Schema exemple en Schema de l'utilisateur {#clone-a-sample-schema-to-a-user-schema}

Les Schemas exemples à **1, 2 et 3 cuves** peuvent être clonés de la même façon que vos propres Schemas :

1. Liste des Schemas > **Clone a Schema ...** (ou ☰ Menu > 🗂 Schema > Clone).
2. Dans **Schema to clone**, vos Schemas sont listés d'abord, puis les exemples marqués **🧪 Sample:**
   - **🧪 Sample: BrewZilla brew day (no board)** (une cuve)
   - **🧪 Sample: Two vessels, one pump**
   - **🧪 Sample: Three vessels, one pump**
3. Donnez un nom au clone (vide : « <nom de l'exemple> copy ») et appuyez sur **OK**.

Le clone est un **User Schema** à vous : renommez-le, changez-le, clonez-le ou supprimez-le comme n'importe quel autre. Un clone d'exemple est toujours chargé tout de suite, car ses Processes sont écrits à ce moment-là. Chaque Interface qu'il contient est un simulateur et le panel passe en Simulator mode, donc rien de réel n'est commandé (voir [Ajouter un Schema exemple](83-sample-schemas)). L'exemple OakBarn Brewery n'est pas proposé pour l'instant.
