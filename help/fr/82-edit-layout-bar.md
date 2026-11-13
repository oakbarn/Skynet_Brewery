# Barre Edit layout {#edit-layout-bar}

La barre **Edit layout** (appuyez sur le bouton bleu Edit layout à côté de **☰ Menu**) a trois lignes. Chaque nouveau Device et Widget est d'abord fait sur le 🔨 [Build Tab](55-build-tab) (Règle 4.1), puis **💾 Save Build ...** le met sur le Tab choisi pour lui.

| Ligne | Ce qu'il y a dessus |
|---|---|
| **1** | Les Devices à gauche (avec **Vessel** juste avant ⧉ Clone Device), les Widgets à droite |
| **2** | Draw pipe, Draw hose, Draw QD hose, Elbows, Tees …, **Add equipment ➕**, les boutons pour tourner, 🔒 Lock, Lock All, Unlock All, ⚙ Tab settings, New tab, 👻 Hidden Tab et son **?** orange, 🔨 Build Tab, 🔨 To Build Tab, 📝 Processes, 👁 Preview, 💾 Save Build ... |
| **3** | Update Schema Version, Save layout, Exit |

Le **?** orange à côté de 👻 Hidden Tab explique dans une fenêtre comment marche Edit layout (glisser, redimensionner, double-cliquer pour les propriétés, verrous, Hidden Tabs, Update Schema Version). **Close** est en haut et en bas.

## Devices : Select Device Type et Add Device {#devices-select-device-type-and-add-device}

Un **Device** est lié à une broche d'une carte (une Interface).

1. **Select Device Type** liste les grandes sortes :
   - **On/Off** : relais, SSR ou contacteur, et les pompes, vannes et résistances qu'on allume et qu'on éteint
   - **Pumps** : on / off, vitesse par PWM, vitesse par 0-10 V (un variateur VFD), pompe de puisard
   - **Valves** : les vannes Skynet, la User Defined Motorized Ball Valve, la Skynet KLD20T Proportional Valve, la User Defined Proportional Valve, la Manual Valve
   - **Heating Element** : on / off, puissance par PWM, PID, Hysteresis, Duty cycle, tube RIMS, bouilloire électrique
   - **PWM / Analog out** : PWM, 0-10 V, 4-20 mA
   - **Inputs** : interrupteurs, boutons poussoir, bascule et impulsion, entrées à verrouillage, compteurs, flotteur, détecteur de débit, verrouillage de sécurité
   - **Probe** : DS18B20, PT100, PT1000, thermocouples, NTC, LM35, TMP36, et les doigts de gant (Short, Medium, Long)
   - **Sensors** : entrées analogiques, pression, niveau, pH, débitmètre
   - **Motors** : moteurs pas à pas
   - **Weight** : balance de cuve
2. **Add Device** liste ensuite seulement les Devices de cette sorte. Sans sorte choisie, il liste tous les Devices, groupés. Cliquez sur un pour l'ajouter.

## Les raccourcis : Pumps, Valves, Probe, Heating Element, PWM {#the-shortcuts-pumps-valves-probe-heating-element-pwm}

Ce sont des raccourcis. Cliquer sur **Pumps** montre seulement la liste des pompes : comme choisir **Pumps** dans Select Device Type puis ouvrir Add Device. Un clic pour ouvrir, un pour choisir.

## Add Device

Choisir un Device ouvre la fenêtre **Add Device**. Remplissez-la depuis le haut :

1. **Label** : le texte affiché sur le Tab, et **Label Visible** (il commence à No : activez-le pour afficher le Label).
2. **Interface** (la carte), et sur la même ligne **Available Ports** : seulement les broches libres de cette carte qui conviennent à ce Device. La dernière ligne de la liste des Interfaces, **➕ Add new Interface…**, ajoute une carte.
3. **Tab** : le Tab où il va. Il commence avec le Tab où vous étiez. La dernière ligne, **➕ Add new Tab…**, fait un nouveau Tab : tapez son nom, réglez-le dans Tab settings et appuyez sur Save. Vous revenez à la fenêtre Add Device avec ce que vous aviez tapé gardé et le nouveau Tab choisi.
4. **Name** : une fois 1-3 faits, le Name s'affiche, rempli avec le **Suggested Name** fait à partir du Label, de l'Interface, du Port, du Device Type et du Tab. Vous pouvez le modifier (le panel vous avertit, voir [Interfaces](76-interfaces)). **Entrée** vous fait passer dans la fenêtre dans l'ordre : Label, Interface, Available Ports, Tab, Orientation (une pompe ou une Motorized Ball Valve), puis **➕ Add Device** (Entrée encore l'ajoute) ; choisir dans une de ces listes fait aussi avancer, et le champ où vous êtes a un bord bleu. Dans toute autre fenêtre, Tab et Entrée passent tous deux au champ suivant. Si **➕ Add Device** a l'air pâle, appuyez quand même : il vous dit lequel de 1-3 manque encore. Le **Device Type** affiche d'abord son type général, par exemple **DO@Pump**. Une pompe montre aussi son **Graphic** et son **Orientation** (voir [Pump Device Properties](115-pump-device-properties)), de même qu'une Motorized Ball Valve (voir [Motorized Ball Valve Device Properties](128-motorized-ball-valve-device-properties)).

Les Interfaces et les Tabs sont listés sous la forme **ID: Name**, par exemple `BM: Brewery Mega` et `BH: Brew House`. Les noms des champs sont courts : survolez un nom (ou touchez-le) pour en lire plus.

Avec le Name viennent **Width** et **Height** (150 x 150 au départ ; une pompe a aussi **Cover**, **X** et **Y**). Quand une sorte a plus d'un Device Type (par exemple une vanne basse ou haute température), une ligne **Device Type** vient après l'Interface.

Rien d'autre ne s'affiche tant que le Label, l'Interface, le Port et le Tab ne sont pas remplis (le Label doit être tapé). **➕ Add Device** (en haut ; sur une pompe il reste visible quand la fenêtre défile) marche une fois qu'ils le sont. **✖ Cancel** n'ajoute rien. Après Add Device, le Device est sur le 🔨 Build Tab et le reste de ses Properties s'ouvre ; **💾 Save Build ...** le déplace vers le Tab que vous avez choisi. Si **☰ Menu > Default** fixe où vont les nouvelles choses (X et Y), il va là.

## Widgets

Un **Widget** n'existe que dans l'application, sans broche de carte.

- **Select Widget Type** et **Add Widget** marchent comme la paire des Devices : Pictures and text, On-screen controls (interrupteur, minuterie, alarme, lecteur de sons), Vessels, Equipment, Fittings and IPs, variables gGlobal.
- **Picture ➕** et **Text ➕** : un clic chacun.
- **Manual Valve ➕** : une vanne qu'on tourne à la main. Touchez-la sur le Tab pour la montrer ouverte ou fermée.
- **Override ➕** ajoute le [Override button](96-override-button) (un par Tab).
- **Boolean ➕** : d'abord une liste des types ON / OFF, comme la liste Probe : **Switch**, **Push Button**, **Pulse Button** et **LED** (Semi_Widgets_Devices, voir [Semi_Widgets_Devices](112-semi-widgets-devices)). Choisissez-en un et il est fait.
- **Value ➕**, **Time ➕** et **DateTime ➕** : un clic chacun fait un [Value, Time or DateTime Widget](134-value-time-and-datetime-widgets).
- **Vessel** (ligne 1, juste avant ⧉ Clone Device) : un Vessel Widget (vous y ajoutez tout), une cuve Integrated (toute prête, voir [Add a Vessel](66-add-a-vessel)) ou une cuve manuelle (BrewZilla, DigiBoil).
- **Add equipment ➕** (ligne 2, après Elbows, Tees …) : refroidisseurs, serpentins, filtre à trub, tube RIMS et raccords de tuyauterie.

La ligne 1 est serrée pour que tout tienne sur la ligne du haut dans une fenêtre d'environ 1900 pixels de large (un écran Full HD). Dans une fenêtre plus étroite, les derniers boutons passent sur une seconde ligne ; ils marchent toujours de la même façon.

## L'Interface et le Tab par défaut du Build Tab {#the-build-tab-s-default-interface-and-default-tab}

Sur le 🔨 Build Tab, la barre montre deux listes : **Interface** et **Tab**. Ce sont la **Default Interface** (celle sur laquelle commence la fenêtre Add
d'un nouveau Device) et le **Default Tab** (celui où va un nouveau Device ou Widget quand la construction est finie). Ce sont les mêmes
valeurs par défaut que **☰ Menu > Default settings > New Devices and Widgets (the Build)** : changez-en une ici et elle change là aussi.
**➕ Add new Tab…** dans une fenêtre Add fait du nouveau Tab le Default Tab. (Règle Skynet 4.6)

## Ligne 2 : tuyaux, raccords, verrous et Tabs {#row-2-pipes-fittings-locks-and-tabs}

**Elbows, Tees …** est à côté de **Draw pipe** et **Draw hose** : un point IP, un tuyau, un té, des coudes, une croix, une vanne manuelle, un manchon ou un bouchon. Le reste de la ligne est décrit dans [Tabs](02-tabs) et [Build Tab Add button](75-build-tab-add-button) (tourner et retourner, poignées).

## ⧉ Clone Device

**⧉ Clone Device** (ligne 1, après les raccourcis et Vessel) liste les Devices déjà sur un autre Tab, groupés par sorte. Choisissez-en un et son Clone apparaît sur ce Tab. Voir [Cloned Devices](71-cloned-devices).
