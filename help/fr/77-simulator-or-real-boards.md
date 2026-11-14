# Simulateur ou vraies cartes {#simulator-or-real-boards}

Un seul appui fait passer **tout le panel**, toutes les Interfaces à la fois, entre le **Simulator** et les **Real boards** (vraies cartes). C'est pour tester : essayez toute une journée de brassage sans que rien de réel ne soit commandé, puis revenez.

## Où est l'interrupteur (Admins) {#where-the-switch-is-admins}

- Le bouton rond à côté de **☰ Menu** sur la barre des Tabs : **🔌 Real** (vert) quand les vraies cartes sont utilisées, **🧪 Simulator** (rayures jaunes) en mode simulateur. Appuyez dessus pour changer.
- **☰ Menu > 🧪 Switch to Simulator** ou **🔌 Switch to Real boards**.

Les deux font la même chose. Le panel demande d'abord. Chaque Process s'arrête et chaque sortie s'éteint avant le changement, donc rien de ce qu'un brassage fictif a allumé n'est jamais envoyé à une vraie carte. Une barre **SIMULATION** à rayures jaunes s'affiche pour tout le monde tant qu'il est actif.

Une Interface dont la Connection est **Simulator** (comme le Mega fictif que fait un Skynet Schema Template quand il n'y a pas de vraie carte) reste fictive même en Real boards. Changez sa Connection avec **⚙ Change** sur la page Devices une fois la carte câblée (aide : [Interfaces](76-interfaces)).

## Ce que fait le simulateur {#what-the-simulator-does}

- Les **minuteries** tournent comme maintenant, plus vite si vous réglez une Speed, et **+1 min**, **Skip to next event** et **Auto skip** marchent comme avant (aide : [Mode simulation](20-simulation)).
- **Les attentes sur une mesure sont considérées comme atteintes.** Une ligne de Process qui attend une mesure, par exemple `wait "Temp_HLT" value >= 152` ou l'attente du début de l'ébullition, continue toute seule après **60 secondes d'horloge**, comme si la mesure y était arrivée. La sortie du Process le dit : *Simulation: the wait on line 12 is pretended reached after 60 s* (l'attente de la ligne 12 est considérée comme atteinte après 60 s).
  - Le temps se règle dans **barre du simulateur > ⚙ Settings > Pretend readings are reached ... after (clock seconds)**. À une Speed de 10×, 60 secondes d'horloge passent en 6 vraies secondes.
  - **Skip to next event** et **Auto skip** la comptent comme un événement, ils sautent donc directement dessus.
  - Désactivez **Pretend readings are reached** pour attendre plutôt la chauffe fictive du simulateur lui-même.
  - Les mesures sont les températures, les entrées analogiques (niveau, pression, pH), les balances et les débitmètres. Une attente sur un **bouton** ou un **interrupteur** n'est jamais simulée : appuyez dessus comme le jour du brassage.
