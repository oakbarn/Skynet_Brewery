# BruControl Importer

Le **Skynet BruControl Importer** transforme une installation BruControl en Schema Skynet (Règle Skynet 15.4 ; OakBarn Brewery, 2026-11-06). C'est
la seconde porte du même programme Skynet : il utilise les propres Devices, Widgets, Templates, images et Règles du panneau, donc ce qu'il
crée est exactement ce que crée le panneau.

- **Windows seulement**, sur le **même ordinateur que BruControl** (BruControl ne tourne que sous Windows).
- Il ne fait que **lire** les fichiers de BruControl. BruControl et ses fichiers ne sont jamais changés.
- Il n'a besoin ni de Brain, ni de cartes, ni de connexion. Il s'ouvre dans sa propre fenêtre épurée, comme le panneau (Règle 2.36).

## Le démarrer {#starting-it}

Double-cliquez sur **Skynet BruControl Importer** sur le Bureau ou dans le menu Démarrer (dossier Skynet Brewer). Le Setup .exe l'y
met. Une fenêtre de commande noire s'ouvre et reste ouverte pendant que vous utilisez l'Importer ; **✖ Close Importer** en haut à droite l'arrête.

## Page 1 : Bienvenue {#page-1-welcome}

Un court mot de bienvenue : ce que fait l'Importer, et qu'il ne change jamais BruControl ni ses fichiers. Cliquez sur **Next ▶**.

## Page 2 : BruControl et Skynet {#page-2-brucontrol-and-skynet}

Cette page vous dit ce qui reste pareil (vos cartes, le câblage, les Devices, les écrans, les scripts, les images), ce qui est différent
dans Skynet (il tourne dans un navigateur, quelques mots nouveaux, les images et Templates Skynet, tout arrive à la façon Skynet), et les étapes
par lesquelles l'Importer va vous guider. Sous **Your Scripts**, elle vous parle aussi des **Preset Schema Templates** (ce que
BruControl appelait Configurations) que vous pouvez facilement changer, et pourquoi (OakBarn Brewery : « Je voulais brasser, pas écrire du code ! »).
Cliquez sur **Start ▶**.

| BruControl | Skynet |
|---|---|
| Configuration (.brucfg) | Schema |
| Workspace | Tab |
| Script | Process |
| Element avec un port | Device |
| Element sans port | Widget |
| Display name | Label |
| Global | gGlobal |
| Device (une carte) | Interface |

## Page 3 : Choisir votre fichier de configuration BruControl {#page-3-pick-your-brucontrol-config-file}

**📄 Browse for the config file…** ouvre la propre boîte Ouvrir de Windows dans **Documents\BruControl**, où BruControl garde ses
fichiers de configuration, montrant les fichiers `.brucfg` et les sauvegardes de BruControl (`.bak`) : choisissez le vôtre et il est choisi. Vous pouvez aussi choisir dans la liste :

L'Importer cherche d'abord **seulement dans Documents\BruControl** (le vrai dossier Documents, même quand Windows le garde sur
OneDrive). La liste a deux parties. D'abord viennent les **sauvegardes** de BruControl (`.bak`) de
**Documents\BruControl\Config Backup**, les plus récentes d'abord. Dessous viennent les **fichiers de configuration** (`.brucfg`) de Documents\BruControl,
les plus récents d'abord. Chacun montre sa date d'enregistrement et sa taille. Le fichier choisi est seulement lu ; rien ne lui est fait, donc il est
inchangé après l'import.
BruControl peut aussi y garder une **configuration par défaut** ; elle est listée en dernier et marquée *(BruControl default)*.

**Les sauvegardes marchent aussi.** Les sauvegardes BruControl finissent par `.bak` (par exemple `default.brucfg.20260615.bak`). Une sauvegarde contient le même
fichier de configuration, donc elle s'importe de la même façon. Les sauvegardes sont listées en premier, marquées *(backup of
2026-06-15)*, et le Schema porte son nom, par exemple `default_Backup_2026-06-15`. BruControl garde ses sauvegardes dans
**Documents\BruControl\Config Backup** ; tout ce qui s'y trouve est listé aussi (sauvegardes et tout `.brucfg` que vous y mettez), avec *Config Backup\* devant le nom.
Pour chercher ailleurs, utilisez **📁 Change folder…** (n'importe quel dossier avec un fichier `.bak` ou `.brucfg`) ou **📄 Browse for the config
file…** ; **⌂ Documents\BruControl** revient au propre dossier de BruControl.

- **Taper un dossier :** un dossier complet comme `D:\Brewing` marche. Un court comme `\downloads` ou `Downloads` veut dire ce dossier
  dans votre propre dossier Windows (`C:\Users\<you>\Downloads`).
- **Browse et Change folder** ouvrent la propre boîte de Windows devant l'Importer. Tant qu'elle est ouverte, une note le dit ; si vous ne
  la voyez pas, regardez dans la barre des tâches.
- **« The Importer has stopped »** en haut veut dire que sa fenêtre noire (**Skynet BruControl Importer**) a été fermée, donc aucun bouton
  ne peut marcher. Fermez la fenêtre de l'Importer et relancez-le depuis son raccourci. Gardez la fenêtre noire ouverte pendant l'import.

- **Pas de fichier de configuration là, ou seulement celui par défaut ?** L'Importer vous demande d'indiquer le dossier qui contient le vôtre : cliquez sur
  **📁 Change folder…** et choisissez le dossier, ou tapez le dossier dans la case et appuyez sur Entrée (ou cliquez sur **Look**). La fois suivante, la
  boîte Change folder s'ouvre sur le dernier dossier choisi.
- **⌂ Documents\BruControl** revient au dossier habituel.
- **Un fichier de configuration fait un Schema.** Vous pouvez avoir plus d'un fichier de configuration : choisissez-en un, et importez chaque autre
  séparément ensuite. Les fichiers de configuration ne sont jamais combinés (Règle 15.4).
- **Cliquez** sur un fichier pour voir ce qu'il contient : ses Interfaces (cartes), ses Tabs (workspaces), combien de Devices et Widgets (éléments),
  de Processes (scripts) et de gGlobals il a.
- **Double-cliquez** sur un fichier (ou cliquez dessus puis **Next ▶**) pour le choisir et continuer. Back et Next sont en haut et en bas.

## Noms {#names}

Les **Units** viennent d'abord : **US** (gallons, °F, pouces, livres) ou **Metric** (litres, °C, centimètres, kilogrammes). Chaque température,
taille et volume des étapes suivantes les utilise. Quand vos sondes BruControl montrent laquelle BruControl utilisait (°F ou °C), elle est choisie
pour vous et la question vous demande de la confirmer. Quand BruControl ne le dit pas, les Units du Skynet Panel de cet ordinateur sont
choisies, pour que vous ne les tapiez pas deux fois.

**Revenir plus tard.** Chaque réponse que vous donnez est gardée un instant après. Si vous fermez l'Importer et revenez, choisissez
le même fichier de configuration : la page Names propose alors **▶ Carry on where I left off** (reprendre où j'en étais), ou **Start again** (elle demande d'abord). Cliquer sur
**Next ▶** à la place n'efface jamais vos réponses : il demande s'il faut continuer, et redemande avant de tout recommencer.

**Clear Page et Restart Fresh.** Deux boutons sont en haut de chaque page :
- **🧹 Clear Page** remet chaque réponse de cette page comme au départ (sur Boards and Tabs : la petite étape où vous êtes). Les autres
  pages gardent leurs réponses. Il est grisé sur une page sans réponses, comme Welcome.
- **↺ Restart Fresh** efface chaque réponse que l'Importer a gardée pour le fichier de configuration sur lequel vous travaillez (vos autres fichiers gardent
  les leurs), et vous ramène à Welcome.

Chacun demande d'abord ; **No** ne change rien. Votre fichier de configuration BruControl et les Schemas que vous avez enregistrés ne sont jamais touchés.

**Aller à un sujet.** Les sujets en haut (Welcome, BruControl and Skynet ... Save the Schema) peuvent être cliqués pour revenir à
n'importe lequel déjà atteint. Sous **Boards and Tabs**, une seconde ligne liste ses petites étapes (Interfaces, IDs, Tabs, les pages Widget, Items,
chaque page d'éléments, Vessels, Summary) : cliquez sur n'importe laquelle déjà atteinte pour y aller.

Chaque case que vous remplissez est **grise avec du texte noir**, et **aucune case ne peut rester vide** : une case vide est marquée en rouge quand vous appuyez sur
**Accept ▶**, et un message dit combien il y en a.

Comment vos éléments sont nommés dans Skynet (ce choix est grisé pour l'instant : **il est fait bien plus tard dans l'Import**, et chaque élément
reçoit son nom Skynet) :

- **Skynet names (recommandé).** Chaque nom vous dit d'un coup d'œil son Interface, son Port, son Type, son Label et son Tab (Règle 3.1), par
  exemple `MB_28_do_ManualAlarm_B1` devient `BR_28_DO_Manually_BB`.
- **Keep my BruControl names.** Permis, mais deux avertissements viennent d'abord, comme pour Start Fresh : **"Do you really want to keep your
  BruControl names?"** (voulez-vous vraiment garder vos noms BruControl ?) puis **"Last chance"** (dernière chance). **No** (utiliser les noms Skynet) est le choix par défaut les deux fois. Les espaces et les
  caractères qu'un nom ne peut pas avoir changent quand même.

**Images et sons :** les chemins des images et les sons sont importés, et les fichiers restent où ils étaient, donc BruControl
continue de marcher normalement. Une copie de chacun est aussi toujours faite (ce n'est pas une question) : chaque image est copiée dans `media\Images\User` et chaque son
dans `media\sounds\User` du Skynet Panel, pour qu'ils soient tous ensemble si vous passez à un Pi ou à un autre ordinateur, et les éléments
utilisent les copies. Ils ne sont jamais supprimés à leur endroit d'origine, seulement copiés, et une copie déjà présente n'est jamais écrasée.
Les nouvelles images et nouveaux sons que vous ajoutez dans Skynet sont toujours mis dans ses dossiers media.

Votre **DisplayName** BruControl devient le **Label**, le nom affiché sur le Tab. Un DisplayName vide : le Label est le Name,
et il n'est pas affiché sur le Tab.

## Cartes et Tabs {#boards-and-tabs}

**Next ▶** fait l'**Import Copy** : votre fichier de configuration est copié dans `C:\Brewing\Import\BruControl` (nommé
*nom*_*date*T*heure*.brucfg, aussi quand vous avez choisi une sauvegarde `.bak`) et seule la copie est convertie, donc le propre fichier de BruControl n'est jamais changé.
Ensuite vous confirmez ce qui arrive, en petites étapes :

1. **Les Interfaces (cartes) trouvées.** Chaque Interface avec son **ID** (grisé, il est expliqué ensuite), combien d'éléments,
   son **Interface Type** (Arduino MEGA, ESP32 ...), sa **Connection** (adresse TCP et Port, ou le port série COM), si elle est
   **Enabled**, et une case **Import** : une Interface avec des éléments commence cochée, une vide décochée. Décochez-en une pour la laisser de côté, avec
   ses éléments. **Next ▶**.
2. **La colonne ID : nouvelle dans Skynet.** Skynet donne à chaque Interface un **ID** de quatre lettres au plus. C'est la première partie du
   **Suggested Name Skynet** de chaque Device de cette carte : *ID d'Interface*_*Port*_*ID de Type*_*Label*_*ID de Tab*, un `_` entre les
   parties, une espace dans le Label devient `~` (Règle 3.1), par exemple `MP_45_DO_M~HLT~Pump_MD` ; un nom qui serait identique à un autre
   reçoit `_2` avant son ID de Tab, donc chaque nom est unique. L'Importer a choisi les IDs pour vous ; vous pouvez les changer (4 lettres au plus,
   **2 de préférence**, chacun différent). Seules les Interfaces que vous importez sont listées. **Accept ▶** les utilise dans chaque nom et continue.
3. **Vos Tabs (workspaces).** Une ligne par Tab : son ID, ses **Items** et une colonne pour chaque sorte de **Placeholder** trouvée
   (Timers, Counter Devices ...) et une case **Import Tab**. Un Tab avec des éléments commence coché, un Tab vide commence décoché ; vous pouvez cocher
   ou décocher n'importe lequel, et un Tab décoché n'est pas importé, avec tout ce qu'il contient. **Accept ▶** continue.
3a. **Vos Widgets.** Les Application Elements de BruControl (ce qui n'est pas câblé à une carte) deviennent des Widgets Skynet : un Timer un
   **Timer Widget**, une Alarm un **Alarm Widget**, un Toggle Switch un **Switch Widget**, un élément Script un **Process Widget** ([aide 173](173-process-widget)), un Chart
   un **Graph Widget**. La première page liste chaque sorte de Widget Skynet et combien des vôtres en deviennent un ; puis il y a une page pour
   chaque sorte trouvée, avec les mêmes colonnes Display Name, coche, Label et Show que les éléments plus bas. Un Inspector BruControl n'a pas de Widget
   Skynet et reste un Placeholder. Voir [aide 165](165-importer-item-and-widget-pages).
4. **Les éléments de chaque Interface.** Un tableau par Interface (carte) : chaque élément câblé à un de ses ports, par port, avec son
   nom BruControl, son **Display Name** (sans Display Name, le nom BruControl est affiché grisé), une **case à cocher** et une case **Label**,
   une case **Show** (cochée quand BruControl affichait le nom), ce qu'il devient dans Skynet (Pump, Cool / Warm Pump, Heating Element, Analog
   Input ...), son **Skynet Name** (fait avec votre Label, et il change pendant que vous tapez ; tant que vous n'avez pas tapé de Label il est fait avec le
   Display Name et grisé) et son Tab.
   Il n'y a pas de case « tout cocher », exprès : regardez chaque élément, car un nom BruControl comme `M_6_B_1` devrait devenir des mots comme HLT. Un élément sur un Tab que vous
   avez laissé de côté est marqué *left out*.
   - **Labels.** Les réglages Display Name de BruControl arrivent comme **Label** de l'élément dans Skynet. Le Label peut être affiché sur le Tab exactement
     comme l'était le Display Name dans BruControl, et c'est la partie Label du Suggested Name Skynet. Utilisez les mots que vous employez pour
     décrire votre brasserie (HLT, Mash Tun, Boil Kettle).
   - Chaque case à cocher et chaque case Label commence vide. **Cochez** une case pour copier le Display Name de cet élément dans sa case Label, puis changez-le si vous voulez.
   - Un Label peut avoir des espaces ; dans le Suggested Name Skynet, une espace devient `~` (*Mash Tun* est `Mash~Tun`).
   - Un Label n'a pas besoin d'être différent des autres : une résistance, une sonde de température et une vanne peuvent toutes être **HLT**, et leurs
     Suggested Names sont quand même tous différents (par exemple `MB_25_DO@H_Element_HLT_BH`, `MB_A0_TEMP@10KNTC_HLT_BH`, `MB_30_MBV_HLT_BH`). La page montre
     trois exemples faits à partir de vos propres éléments quand elle en trouve, ou des exemples inventés.
   - Les noms Skynet sont la façon préférée de nommer les choses dans Skynet.
   - **Accept ▶** est en bas de la page. Aucun Label ne peut être vide : un message dit combien le sont, et les marque en rouge. Quand ils
     sont tous remplis, les Suggested Names Skynet sont refaits avec vos Labels, et chaque Label est le Label de l'élément dans le nouveau Schema.
5. **Les pages des éléments :** Pumps, Heating Elements, Temperature Probes, Valves, Flow Meters, pH Meters, Pressure Sensors (PSI),
   Hydrometers, Volume Meters, Floats, Digital Inputs et Other items, une page chacune, dans cet ordre. Chaque page commence par **How many
   ... do you have?** ; si vous en avez plus que trouvés, une ligne vide est ajoutée pour chacun (par exemple *Pump 7*), et une ligne vide
   peut être remplie avec un élément qu'aucune page n'a encore pris. Chaque ligne a les colonnes Display Name, coche, Label et Show, une liste
   **Belongs on** qui la déplace vers sa bonne page, et ses détails. Rien ne peut rester à **Pick one…** : si aucun choix ne convient, choisissez **User
   defined** et tapez vos propres mots. Les pompes et les résistances ont les colonnes **Control Type** : cochez chaque façon de les commander
   et choisissez la **Primary** par son numéro de colonne. Une méthode qui n'est pas recommandée se décoche d'elle-même et dit pourquoi, avec **Use it
   anyway**. Les vannes demandent leur type, la **Connection** (TC, NPT ou BSP : comment la vanne est montée dans votre collecteur), la **Size** et le
   **Voltage**. Tout est dans l'[aide 165](165-importer-item-and-widget-pages). Un élément en plus que vous ajoutez n'a pas de Port d'Interface, donc il
   deviendra un **Confirmation Widget** (Règle 1.28) : Skynet vous demande de le faire à la main et de confirmer que c'est fait.
6. **Vos cuves.** Cela commence par les cuves trouvées, où vous en renommez une, réglez son **Side**, en enlevez une (✖) ou **➕ Add a
   vessel**. Pour chacune, tapez son **Volume** et mesurez sa **Height** et son **Diameter** (gallons et pouces, ou
   litres et centimètres, selon la question Units). Puis ce que l'import a pu en dire d'après vos noms et Scripts : sa **Heater Element** (une liste de chaque résistance BruControl trouvée ; la supposition est celle nommée d'après la cuve),
   son **Thermowell with Probe** (une liste de chaque sonde BruControl trouvée ; la supposition est celle nommée d'après la cuve), son **Outlet** (None, Center Low ou Bottom Drain ; Bottom Drain au départ), une case à cocher **Tangential Inlet** (une pompe de whirlpool veut dire qu'il y en a une sur la cuve d'ébullition), **Sparge Arm / Steam
   Slayer** (une réponse : None, Upper Left ou Upper Right) et un **HERMS Coil** (les choix du panneau : None, Left, Right, Outlet Left & Inlet Right, Outlet Right & Inlet Left ; None au départ). Ce qui a été trouvé dans vos noms ou Scripts est
   marqué *found* ; c'est une supposition, changez-la si elle est fausse ; sa **Motorized Ball Valve**
   (une liste de chaque vanne motorisée trouvée ; la supposition est celle nommée d'après la cuve). Tout est affiché par son **nom BruControl**
   pendant ces étapes, pour que vous reconnaissiez chacun ; ce sont quand même les noms Skynet qui sont enregistrés (Règle 15.1). Les **Manual Valves** ne sont pas dans
   BruControl, donc choisissez None, Manual Ball Valve ou Manual Butterfly Valve (None au départ). **Accept ▶** continue ; les réponses sont enregistrées
   avec chaque cuve, et la page suivante les utilise pour faire de chaque cuve un Vessel Device.
   **🔨 Build** sur une cuve ouvre le propre **Vessel Device Builder** du Skynet Panel sur la page Build, à partir des réponses de cette ligne ;
   ses choix de résistance et de sonde listent celles importées de votre fichier (aide : Vessel Device Builder).
7. **Boards and Tabs :** tout le reste qui arrive :

- vos **Interfaces** (cartes BruControl), chacune avec son ID d'Interface et combien d'éléments elle a. Une Interface **sans
  éléments (0)** n'est **pas** importée, sauf si vous cochez sa case **Import** ; alors elle **sera** importée ;
- le **Look (thème)** : le thème Skynet le plus proche du thème réglé dans BruControl (pour Office 2019, **Skynet
  Office Black**). Les thèmes BruControl ne marchent pas dans les navigateurs, donc Skynet a son propre petit jeu de thèmes Skynet, et vous pouvez
  construire votre propre User Theme. Un nouveau thème Skynet pour un Tab (ancien Workspace) peut être choisi à tout moment ;
- vos **Tabs** (workspaces BruControl), chacun avec son ID de Tab. Les fonds de Tab sont laissés de côté pour l'instant. Les Tabs avec des éléments **seront**
  importés. Un Tab sans éléments a une case : elle **doit** être cochée pour qu'il soit importé ; laissée décochée, il n'est **pas** importé, ni
  ses Placeholders. Un Tab sans éléments ni Placeholders est un bon candidat à laisser de côté ;
- vos **Globals** sont **seulement listés** pour l'instant, sur le résumé (chaque Global avec son Tab). Ils ne sont pas importés, ils n'ont pas de
  Placeholder, et rien n'est demandé à leur sujet : les Globals seront traités dans une étape future ;
- vos **pompes** deviennent des **Pump Devices** Skynet avec le dessin de pompe Skynet (le Pump Standard, avec les mêmes 8 IP que chaque pompe :
  Inlet au milieu à droite et Outlet en haut à droite au départ), donc n'importe quelle pompe peut être échangée plus tard ; vos **régulations de chauffe** gardent leurs réglages (la Target de BruControl devient le Setpoint, Kp, Ki, Kd ... ; le `target` d'un script s'écrit `.setpoint`, et une ancienne
  ligne `.target` marche toujours) et leur sonde de température, donc un
  clic sur cette sonde ouvre son SetPoint ; tout ce que BruControl marquait comme non commandable par l'utilisateur ne fait rien quand on clique dessus ;
- vos **Charts** : chaque Chart BruControl devient un **Graph Widget** Skynet ([aide 159](159-graph-widget)) avec la même durée,
  le même rafraîchissement, les mêmes lignes de grille, couleurs et canaux, et chaque élément qu'il dessine est envoyé à la base de données pour que sa ligne se remplisse ;
- les **éléments sur un port de carte** (éléments BruControl qui ont une Interface et un Port). Pour l'instant, seuls ceux-ci arrivent ;
- vos **Widgets** (Timers, Alarms, Toggle Switches, Scripts), depuis les pages Widget ; une pompe que BruControl commandait par une régulation de température
  est une seule **Cool / Warm Pump** (ID de Device Type CPMP, [aide 164](164-cool-warm-pump)) ;
- un **Placeholder** pour chaque autre élément sur un Tab (un Inspector, un port Counter ...). C'est une case grise
  avec ⬚ et le nom BruControl, au même endroit et à la même taille que dans BruControl, pour que vous voyiez ce qui reste à venir. Le Placeholder d'un
  élément caché reste caché.
- le **Layer Order** de chaque élément (le Z Order de BruControl, [aide 114](114-universal-properties)) : le premier élément de chaque Workspace BruControl
  est au-dessus (Layer Order 1), le suivant est 2, et ainsi de suite, donc les éléments qui se chevauchent sont dessinés comme BruControl les dessinait.

- vos **images et sons** : leurs chemins sont importés, et **les fichiers restent où ils étaient**, donc BruControl continue de
  marcher normalement. BruControl avait une case Browse, donc ils peuvent être dans n'importe quel dossier. Pour les voir dans le panneau, ajoutez leur dossier (par
  exemple `C:\BruControl\Media`) dans **Settings > Media folders**. Un fichier qui n'est pas sur cet ordinateur est listé ; son chemin
  est gardé quand même.

La liste des nouveaux noms et les notes pour le rapport sont en bas.

## Relier votre brasserie {#connect-your-brewery}

### Les pages Build Tab {#the-build-tab-pages}

Chaque Tab que vous importez reçoit sa propre **page Build Tab**, une à la fois, dans l'ordre des Tabs dans BruControl (par exemple
MD, puis ME). Un Tab laissé décoché n'a pas de page. **◀ Previous Tab** et **Next Tab ▶** passent de l'une à l'autre. Chaque page a :

- **Before you build: the choices on a Build Tab** : ce que fait la barre Edit layout, ligne par ligne, et
  **❓ Show every Build Tab choice and its hover help**, une fenêtre avec chaque choix et le hover help qu'il montre dans le panneau.
- **Build your manifold as it really is** : ajoutez les pièces que vous tournez ou déplacez à la main : **Manual Valve ➕**, **Elbows, Tees ...** reliés avec
  **Draw pipe** ou **Draw hose**, **Draw QD hose**, et les pompes manuelles (elles deviennent des Confirmation Widgets, [aide 162](162-confirmation-widgets)).
- **🔨 Open the Build Tab for** ce Tab : le **propre Build Tab du Skynet Panel**, sur ce Tab, dans sa propre fenêtre. C'est le même panneau
  avec lequel vous construisez tous les jours. Seules deux choses sont différentes : **aucune carte n'est connectée**, et **les Processes sont grisés** (vos Scripts
  deviennent des Processes dans une étape future de l'Importer).

Fermez la fenêtre quand vous avez fini : votre travail est gardé dans `Brewing\Import\build`, et il entre dans votre Schema quand vous l'enregistrez sur
la dernière page. Si vous importez un autre fichier, les Build Tabs repartent de ce fichier. Vos cuves et les éléments de chaque Tab seront
placés pour vous une fois les Vessel Templates construits (le Vessel Device Builder, une étape future).

BruControl ne connaissait vos vannes et vos pompes que comme des boutons ; il n'a jamais su sur quelle cuve elles sont ni à quoi elles sont reliées. Cette
page demande **ce qui est relié à quoi** (OakBarn Brewery, 2026-11-07), une pièce à la fois, « comme l'os du genou est relié à l'os de la
jambe ». La page montre quelques lignes de la vieille chanson (*Dem Bones*) et la version brasserie, avec **▶ Play the song** (la propre
chanson de Skynet, *Skynet - Outlet to Valve*, faite par OakBarn Brewery ; elle ne joue jamais toute seule, et le bouton devient **■ Stop**) et
**▶ Hear it** à côté des lignes de la vieille chanson (le propre extrait d'OakBarn Brewery, chanté d'une voix comique).

- **Vos cuves.** Devinées d'après vos noms et Scripts (HLT, Mash Tun, Boil Kettle, Fermenter). Renommez, enlevez ou ajoutez-en une.
  Les cuves du **Hot Side** (côté chaud) sont reliées ici ; un **Fermenter** (Cold Side, côté froid) a ses propres questions.
- **Construire vos cuves**, une à la fois : **quel template ressemble le plus à votre cuve ?** Chaque format de cuve Skynet est montré
  par son image (les propres Vessel Templates du panneau) ; cliquez sur celui qui ressemble le plus à votre cuve. Le premier choix est une supposition
  d'après le nom. **Save, next vessel ▶** passe à la suivante. Votre cuve ressemble alors à ce template sur l'écran
  d'image, et la réponse est enregistrée avec elle, pour que son Vessel Device puisse en être construit.
- **Ce qui est relié à quoi.** Chaque **chaîne** commence à une ouverture de cuve (ou une pompe ou une vanne), puis dit à quoi cette pièce est
  **reliée**, puis à quoi *celle-ci* est reliée, jusqu'à atteindre une **fin** : une ouverture de cuve, **Tap Water** (l'eau du réseau), un
  **Drain** (l'égout), un **Quick Disconnect (QD)** ou **Not connected**. Un QD demande aussi **Male or Female** et **Open or Shut-off** ; un
  **Supply Manifold** demande lequel. Chaque liaison demande **by Pipe** (par tuyau) ou **by Hose** (par flexible) (Pipe est la supposition, Hose pour un QD).
  Après une pompe, la pièce suivante part de son **Out**.
- **Les premières suppositions** viennent de vos noms (la sortie d'une cuve vers sa propre vanne, puis sa propre pompe, par exemple *HLT Center
  Bottom Outlet > M_HLT PV2 > M_HLT Pump In* ; une pompe de whirlpool qui revient dans la cuve d'ébullition) et, sur un Tab BruControl avec une
  image de fond, d'une vanne posée juste à côté d'une pompe. Chacune est marquée **guess** jusqu'à ce que vous cliquiez sur **✓**.
- **Not joined yet** liste chaque pompe et vanne qu'aucune réponse n'utilise. Une réponse manquante la laisse libre, jamais avec un mauvais tuyau.
- **Une image comme guide.** Choisissez l'image de fond que vous aviez sur un Tab BruControl, ou **📷 Use a photo or drawing** de votre
  brasserie (elle reste sur cet ordinateur) ; le fond de l'image est toujours noir. Glissez chaque cuve, pompe et vanne à sa place,
  puis **cliquez sur l'une** (elle reçoit une bordure jaune) **puis sur une autre**, et une ligne les relie. Une ligne **bleue** est un **Pipe** (avec ses
  raccords), une ligne **jaune** est un **Hose** : **clic droit** sur une ligne pour la changer. **Cliquez** sur une ligne pour la choisir et appuyez sur **Suppr** pour
  l'enlever (une ligne au milieu d'une chaîne coupe la chaîne en deux). L'image n'est qu'un guide : elle n'est pas enregistrée et rien ne la lit.
  **🖼 Open the picture screen** l'affiche aussi grande que la fenêtre. Les cuves ressemblent à des cuves Skynet, les pompes à des pompes et
  les vannes à des vannes. Un Pipe ne va qu'horizontalement, verticalement, ou à 45 degrés ; un Hose pend en courbe. Les pièces reliées par Pipe
  sont empilées en colonne sous leur cuve, un Hose passe sur une autre colonne, avec de la place pour attraper chaque ligne. Cela commence avec deux fois plus
  de colonnes que de cuves : la cuve la plus à gauche dans la première colonne, la plus à droite dans la dernière, les autres espacées entre.
  **Set** déplace la cuve la plus à gauche d'une colonne vers la droite et la plus à droite d'une colonne vers la gauche, en laissant une colonne entre toutes les
  cuves ; **↺ Start** remet chaque pièce là où elle a commencé.
- **La liste sur son propre écran.** **Next ▶ (the list)** sur l'écran d'image montre **What is connected to what** aussi grand que la
  fenêtre ; son **◀ Back (the picture)** revient directement à l'image, pour passer vite de l'un à l'autre. **Next ▶**
  là revient à cette page, aux Fermenters (**📋 Open the list screen** l'ouvre depuis la page ; **Échap** ferme l'un ou l'autre écran).
- **Une cuve à la fois.** La liste a un bouton pour chaque cuve du Hot Side, **Other chains** (les chaînes qui n'atteignent aucune cuve) et
  **All**. **Save, next vessel ▶** marque la cuve comme faite (✓) et montre la suivante ; chaque réponse est gardée au fur et à mesure.
- **Comment chaque pièce est reliée :** **Vertical pipe** (la pièce suivante est dessous), **Pipe to the left**, **Pipe to the right** (la
  pièce suivante est à côté) ou **Hose**. Un tuyau vers la gauche ou la droite demande son raccord : **with an Elbow** (avec un coude), ou **with a Tee** (avec un té), qui
  met un vrai té dans la ligne : le tuyau entre dans le té, le té continue vers le bas jusqu'à la pièce suivante, et sa troisième ouverture commence
  une **branche** (sa propre chaîne, dessous). **⊤ Tee** ajoute un té après n'importe quelle pièce de la même façon. Revenir à un Elbow enlève de nouveau le té,
  sauf si sa branche est reliée à quelque chose. Tant que vous ne déplacez pas une pièce, l'image suit ces réponses.
- **Demander à une IA à propos de mon image (à vous de choisir).** L'Importer lui-même n'utilise jamais d'IA. **🤖 Copy the question and open it**
  copie une question toute prête (elle liste les noms de vos propres cuves, pompes et vannes) et ouvre le site d'IA gratuit que vous choisissez (Claude,
  ChatGPT ou Gemini). Ajoutez-y votre image et collez la question. Recopiez la réponse de l'IA dans la case et cliquez sur **Read
  the AI answer** : chaque ligne qu'il peut lire devient une liaison marquée **from the AI, check it** (de l'IA, à vérifier) ; une ligne qu'il ne peut pas lire est listée,
  jamais devinée. Votre image va à cette société d'IA sous votre propre compte, pas à Skynet.
- Les **fermenteurs** sont demandés, pas dessinés (ils sont souvent dans une autre pièce) : comment il est refroidi (serpentin à glycol, double enveloppe, chambre,
  ceinture ou pas refroidi) et réchauffé, quelles vannes amènent et renvoient le glycol, quelles pompes le refroidissent et le réchauffent, et sa sonde et son
  capteur de pression. Chacun commence avec une supposition d'après les noms et les notes des Scripts (par exemple *"FV 2 // feed glycol"*).

Les réponses sont enregistrées dans le fichier du Schema. Les tuyaux et flexibles eux-mêmes sont dessinés quand les cuves sont construites (une étape future de
l'Import).

## Enregistrer le Schema {#save-the-schema}

**Save the Schema** enregistre ce que l'Importer a créé comme un seul fichier Schema Skynet (`.json`) dans le **dossier Import** :
`C:\Brewing\Import` quand le panneau est dans `C:\Brewing\BrewPanel`. Tapez le nom du Schema (les espaces deviennent `_`) et cliquez sur
**💾 Save the Schema**. Le fichier est nommé `<Name>_YYYY-MM-DDTHHMMSS.json`, donc un plus ancien n'est jamais écrasé.
**📂 Open the Import folder** le montre dans l'Explorateur de fichiers.

Le fichier contient le Schema (Interfaces, Tabs, les éléments sur un port de carte et les Placeholders) et le rapport d'import. Il est
marqué comme **premier jet** : l'import est construit une étape à la fois, et les Processes n'y sont pas encore.

Ensuite, dans le **Skynet Panel**, ouvrez **Schema.json** et cliquez sur **Open a Schema file** (aide 44).

## Installer l'Importer {#installing-the-importer}

Le Setup Windows demande **"Will you import a BruControl configuration on this computer?"** (allez-vous importer une configuration BruControl sur cet ordinateur ?) Sous la question, il dit : « If you are a BruControl Brewer and want to import a BruControl .brucfg Configuration File, answer Yes. If you are not a BruControl Brewer, answer No. » (si vous êtes un brasseur BruControl et voulez importer un fichier de configuration .brucfg, répondez Oui ; sinon, répondez Non). Oui ajoute le raccourci **Skynet BruControl
Importer** sur votre Bureau, dans le menu Démarrer et dans le dossier Import (`C:\Brewing\Import`) ; Non le laisse de côté, et vous pouvez relancer le Setup pour l'ajouter plus tard. Si vous avez répondu Oui, la dernière page du Setup a deux cases à cocher, **Start Skynet Brewer now** (cochée) et **Start the BruControl
Importer now** : une seule peut être cochée, donc un seul programme démarre. Le Setup n'efface jamais les réponses de l'Importer : utilisez **Restart Fresh**
dans l'Importer. Le Setup
crée toujours le dossier Import, car BeerSmith ou d'autres programmes peuvent aussi y enregistrer leurs fichiers.

## Prochaines étapes (en construction) {#next-steps-being-built}

L'import est construit une étape à la fois avec OakBarn Brewery : ensuite viennent les autres éléments BruControl (chaque Placeholder devient le bon
Device, Widget ou Template Skynet, avec quelques questions simples ; pour chaque cuve, celles-ci comprennent ses **autres ouvertures** : Not there,
Open, ou Plugged (bouchée) avec un Thermowell, un End Cap ou une résistance, où une ouverture bouchée ne montre pas d'IP), puis les Processes, avec un rapport de chaque changement (Règle 15.1).
La façon dont l'ancien code d'import faisait chaque partie est dans `docs/BruControl_Old_Import_Method.md`.
