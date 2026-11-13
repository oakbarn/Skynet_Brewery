# Vannes et pompes sur leurs tuyaux {#valves-and-pumps-on-their-pipes}

## Centrées sur le tuyau {#centered-on-the-pipe}

Une vanne ou une pompe est posée **juste sur ses tuyaux** (Règle Skynet 5.23). Le tuyau la traverse tout droit : dans le propre tuyau de la vanne
ou l'orifice de la pompe d'un côté et ressort de l'autre, pareil dans chaque Orientation.

- **Les tuyaux restent où ils sont ; c'est la vanne ou la pompe qui bouge** sur la ligne du tuyau : à gauche ou à droite sur un tuyau vertical,
  en haut ou en bas sur un tuyau horizontal.
- Cela se fait tout seul quand un Tab s'affiche, et une fois quand vous ouvrez **Edit layout**. Appuyez sur **Save layout** pour le garder.
- Si deux tuyaux la déplaceraient dans des sens différents (ils ont été tracés mal alignés l'un avec l'autre), elle est laissée où elle est. Alignez les
  tuyaux et elle se centre.
- Les **flexibles** se courbent, donc un flexible va simplement à l'IP de la vanne ou de la pompe.
- Les anciennes images de vanne à bille (maintenant `Motorized_TC15_Ball_Valve_Vertical` et `Motorized_TC15_Ball_Valve_Horizontal`) et chaque
  dessin de vanne et de pompe Skynet savent où est leur tuyau. Une image à vous garde ses IP au milieu de ses côtés ; sur la
  **User Defined Motorized Ball Valve**, vous réglez vous-même les places des **IP In et Out**.

## Un éclair quand c'est On {#a-lightning-bolt-when-on}

Tant qu'une vanne est **ouverte**, qu'une pompe **tourne** ou qu'une Proportional Valve est au-dessus de **0 %**, un **éclair** rouge à bord
jaune s'affiche au milieu de son image (Règle Skynet 7.15). C'est l'**On overlay** appelé **Lightning Bolt**
(voir l'aide 58). Il reste fixe. Si vous voulez qu'il clignote, choisissez plutôt **Flashing Lightning Bolt**.

- Chaque nouvelle vanne motorisée, Proportional Valve et pompe commence avec lui, et les vannes Skynet l'ont toujours.
- La première fois que le panel démarre avec cette version, chaque vanne, Proportional Valve et pompe qui n'avait **pas** d'On overlay reçoit
  l'éclair. Celle qui avait déjà une superposition garde la sienne.
- Une vanne **manuelle** n'a pas de courant, elle n'a donc pas d'éclair.
- Vous n'en voulez pas sur l'une ? Ouvrez ses Properties, réglez **On overlay** sur **(none)** et enregistrez. Il reste éteint.

Depuis un Process : `my_Valve.imageOverlay = "Images/Skynet/On_Off/Overlay_Bolt.svg"` (ou `Overlay_Bolt_Flash.svg` pour celui qui clignote)
