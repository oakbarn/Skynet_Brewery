# Styles de Tab {#tab-styles}

Un **Tab Style** est l'aspect des Devices et Widgets d'un Tab. Il règle, en deux groupes séparés :

- **Label** (le titre d'un Device ou d'un Widget) : **Fore color**, **Back color**, **Font**, **Font size** et **Alignment** (à gauche, centré ou à droite).
- **Le Device ou le Widget lui-même** : **Fore color**, **Back color**, **Font**, **Font size** et **Alignment**.

Une case laissée sur **Default** garde l'aspect tel qu'il est maintenant (le Tab ☰ Menu > Default, puis l'aspect normal du panel).

## Seuls ceux qui n'ont rien à eux changent {#only-the-ones-with-none-of-their-own-change}

Un Tab Style **n'écrase jamais** une couleur, une police ou une taille qu'un Device ou un Widget a déjà. Il ne remplit que ce qui est laissé sur Default. Donc quand le Style d'un Tab change, seuls les Devices et Widgets qui n'avaient **pas de Fore et Back color à eux** changent. Donnez-en un ses propres couleurs dans ses Properties et il les garde avec n'importe quel Tab Style.

## Styles Skynet et Styles de l'utilisateur {#skynet-styles-and-user-styles}

- Les **Skynet Styles** 🔒 viennent avec Skynet et **ne peuvent jamais être changés par un utilisateur** (Règle 2.24) :
  - **Skynet Default** : tout comme maintenant.
  - **Tennyson** : le Label est en texte noir (RGB 0 0 0) sur gris clair (RGB 195 195 195), **Comic Sans MS**, taille **16**. Le Device ou le Widget lui-même reste comme maintenant (gris clair avec texte noir).
- **➕ Add new User Style…** au bout de la liste fait le vôtre, à partir de celui qui est choisi. **✏ Edit** à côté de la liste change ou supprime un User Style (grisé pour un Skynet Style). Un User Style appartient au Schema.

## Où le régler {#where-to-set-it}

- **Un Tab :** Edit layout > **Tab settings** > **Tab Style**. Le premier choix, **(the Default tab's Style)**, fait suivre au Tab le Tab Default.
- **Chaque Tab qui n'en a pas à lui :** **Settings > Panel settings: screen, Tabs and alerts** > **Tab Style**. Il commence sur Skynet Default.

Le Tab **Recipe** de chaque Schema exemple utilise **Tennyson**. Un Schema que vous aviez déjà reçoit Tennyson sur son Tab **Recipe** une fois, la première fois qu'il se charge avec cette version (seulement si ce Tab n'avait pas encore de Tab Style). Ensuite, changez-le dans Tab settings quand vous voulez.

Le Widget Text et les labels des cuves et de l'équipement suivent le Tab Style de la même façon. Voir aussi [Widget Text](91-text-widget) et [Widget Timer](92-timer-widget).
