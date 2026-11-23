# Properties du Device Pump (le détail) {#pump-device-properties-the-drill-down}

Double-cliquez sur une pompe en Edit layout pour ouvrir **Pump Device Properties**. C'est la première fenêtre de Device construite selon les règles générales
des fenêtres (Règles Skynet section 18), et c'est **le standard pour chaque Device** : les autres marcheront de la même façon.

L'idée : ce que vous réglez le plus est dans la fenêtre elle-même. Tout le reste est à un clic dans une petite fenêtre.

## Ajouter une pompe {#adding-a-pump}

1. En Edit layout, cliquez sur **Pumps > Pump, on / off (relay or SSR)**.
2. **Choisissez la pompe** dans la liste. Chacune a son image : March 809 et 815, Chugger, Blichmann Riptide, Topsflo TD5 et
   KegLand MKII. L'image que vous choisissez est la Picture de la pompe.
3. La fenêtre Add s'ouvre avec le nom de la pompe comme titre. Remplissez-la dans l'ordre : 1 le **Label** (le ⬢ à côté règle sa police
   et ses couleurs) et **Label Visible**, 2 l'**Interface** (la carte), 3 un **Available Port**, 4 le **Tab**. Puis 5 le
   **Suggested Name** s'affiche, fait à partir d'eux. Le curseur commence dans le **Label**. **Entrée** va seulement entre le **Label** et le **Port** (Entrée dans un Label vide y reste). La touche **Tab** va Label, ⬆, ⬢, Label Visible, Interface, Port, Tab puis revient au Label, et vous pouvez cliquer sur chacun à tout moment, même avant de taper le Label. L'aide ?, ✖ Cancel et ➕ Add Device sont pour la souris (Règle Skynet 18.38). Le **Graphic** montre la pompe ; réglez son **Orientation**, son **Cover**, **X**, **Y**, **Width** et **Height** si vous voulez. Si **➕ Add Device** a l'air pâle, appuyez dessus : il vous dit ce qui manque encore. Le **Device Type** (Pump) est montré grisé : il vient de la liste où vous avez choisi.
   Une fois l'**Interface** et le **Port** choisis, la fenêtre **Review** (vérification) les montre grisés avec : *You MUST Confirm the
   Interface and Port Number. Once Confirmed, they cannot be changed. If a Change is needed now, Click the Back Button.* (Vous DEVEZ
   confirmer l'Interface et le numéro de Port. Une fois confirmés, ils ne peuvent plus être changés. S'il faut changer maintenant, cliquez sur Back.)
   **✔ Confirm** grise la ligne **Interface** et **Available Ports** (c'est le câblage ; appuyez sur Cancel pour recommencer). Leur
   Hover Help commence alors en disant que la combinaison Interface et Port est enregistrée et ne peut pas être changée ;
   **◀ Back** revient au Port pour que vous le changiez. Rien n'est fixé pour de bon tant que **➕ Add Device** n'a pas enregistré le Device.
   Une fois 1 à 4 faits et confirmés, le reste de la fenêtre s'ouvre : le **Label** et le **Tab** peuvent encore être changés et le
   Suggested Name les suit, et le curseur va sur **Orientation**. Le **Graphic** est l'image de ce Device telle qu'elle s'affichera sur le Tab, avec son Cover
   et son Orientation ; la Picture elle-même ne peut pas être changée. **User Add** dans Cover ouvre le sélecteur de couleur et montre la
   ligne **Color (RGB)** juste en dessous (aide 187) : choisissez une couleur et appuyez sur Save, ou **◀ Back** remet le Cover sur None (pas de capot).
4. Appuyez sur **➕ Add Device**. Les Properties s'ouvrent. L'**Interface** et le **Port** sont maintenant grisés et fixés : c'est le câblage, ils restent donc tels quels. Pour le câbler à une autre carte ou une autre broche, supprimez-le et ajoutez-le à nouveau. Son Name peut toujours être changé avec **✏ Change name**.

## Les deux icônes {#the-two-icons}

| Icône | Ce qu'elle fait |
|---|---|
| **⬢** hexagone rouge | Ouvre une **fenêtre Properties** avec plus de réglages pour ce champ |
| **⬆** flèche rouge vers le haut | Ouvre une **fenêtre String** : une case plus grande pour taper le texte (les codes Rich Text comme `\b` marchent) |

Chaque petite fenêtre a **💾 Keep**, **Close** et **✕** figés en haut (Rule 2.54). Keep dans une petite fenêtre met les changements dans la fenêtre principale ;
rien n'est vraiment enregistré tant que vous n'appuyez pas sur **💾 Save** dans la fenêtre principale. Close avec des changements faits demande d'abord.

## Du haut vers le bas {#from-the-top}

Seuls ceux-ci appartiennent à une pompe (un dessin de pompe Skynet ou votre propre pompe User) :

1. Le titre est la pompe, par exemple **Blichmann Riptide**, avec le **cadenas 🔓** (verrouille sa place : pas de glisser ni de redimensionnement),
   **Visible** et **Hidden Locked** à côté. Puis **Delete · Save · Close · ✕** dans le coin en haut à droite (Rule 2.54). Le titre et ces boutons (pas de ☰ pendant que vous construisez, Rule 2.52) restent
   en haut pendant que le reste de la fenêtre défile, donc les boutons sont toujours visibles (il n'y a pas de seconde ligne en bas).
2. **1. Label ⬆ ⬢** : ce qui s'affiche sur le Tab (voir **Le Label** plus bas). Le ⬆ ouvre une fenêtre de texte de Label à 2 lignes ; le ⬢ ouvre
   la fenêtre **Label Attributes** : Label, Visible, Font Size, Font, Bold, Fore Color, Back Color et Alignment. Font Size, Font,
   Fore Color et Back Color montrent ce qu'a le Label maintenant (votre Tab Style, puis ☰ Menu > Default settings), et ils continuent
   à suivre ces valeurs par défaut tant que vous ne les changez pas. Ses **Cancel** et **Save** sont en haut seulement. Alignment est **Left**, **Centered** ou **Right** ; un Label commence Centered. Un Label n'est jamais
   vide : laissez-le vide et il devient le Name. **Label Visible** l'affiche ou non.
3. **2. Interface** et **Available Ports** sur une ligne : grisés une fois ajoutés (la carte et la broche auxquelles il est câblé). Les
   deux Hover Help commencent en disant que la combinaison Interface et Port est enregistrée et ne peut pas être changée.
4. **3. Tab** : le Tab où il est.
5. **4. Name** : commence comme le Suggested Name (à partir du Label, de l'Interface, du Port, du Device Type et du Tab) ; vous pouvez taper le vôtre. Il
   doit être unique. Un Process l'utilise : `Pump_Name.state = true`. Voir **Le Name** plus bas.
6. **Graphic** : ![Une pompe avec ses 8 IP](help_pictures/Pump_8_IPs.png)
   l'image Skynet de ce Device telle qu'elle s'affichera sur le Tab, avec son Cover et son Orientation. La Picture Skynet est
   fixée par Skynet et ne peut pas être changée, donc un dessin de pompe Skynet n'a pas de case Path. Une pompe User garde sa case **Path**, donc sa seule
   image peut être changée. Le Graphic change dès que vous choisissez une autre Orientation ou un autre Cover.
7. **Orientation** : ![Right et Left](help_pictures/Pump_Right_Left.png)
   **Horizontal** est grisé (une pompe est toujours à plat), avec **Left / Right** à côté, le même aspect que le Hose Bib
   (Règle Skynet 18.49) : **Right** (comme dessinée) ou **Left** (en miroir). Le Graphic ici et la pompe sur le Tab tournent. Changer l'Orientation
   laisse l'Inlet IP et l'Outlet IP où elles sont, donc les tuyaux et les flexibles qui y sont joints ne bougent pas ; le Hose ou
   Pipe dans la pompe est redessiné pour les rejoindre.
8. **Cover** (aide 111, dessins de pompes Skynet seulement) et **Toggle** sur une ligne. ![No Cover and Red Cover](help_pictures/Pump_Cover.png) Le Toggle est ce qui se passe quand on clique sur la pompe
   sur le Tab : **On/Off** (un clic l'allume ou l'éteint, le plus courant), **Push Button** (allumée seulement tant qu'on appuie), **Dual
   Action** (un clic l'allume ou l'éteint ; appuyée et tenue plus d'une demi-seconde, elle est allumée seulement tant qu'on appuie, pratique pour compléter
   une cuve à la main) ou **None** (l'image ne fait rien quand on clique). Règle 2.50.
   Juste en dessous, **Overlay** : ce qui est dessiné par-dessus quand la pompe est On. ![Every Overlay choice](help_pictures/Pump_Overlays.png)
   Sur la même ligne, **Database and .API ⬢** : l'hexagone ouvre ses réglages (aide 98).
   En dessous, **Model** (le modèle de pompe choisi parmi les pompes de brasserie courantes ; ses propriétés s'affichent avec le
   ⬢, seulement à regarder, avec **◀ Back** : Power, Use, Flow, Lift, Hottest Liquid et Self Priming) et **Inlet IP Fitting** et **Outlet IP Fitting**, chacun sur sa propre ligne (faites correspondre les raccords de VOTRE pompe). Aide 163.
9. **X (Horizontal)**, **Y (Vertical)**, **Width** et **Height**.
10. Le **Device Type** grisé et rempli pour vous : **DO@Pump** pour une pompe On/Off comme la Blichmann RipTide (une pompe sur une sortie numérique, DO), **PWM@Pump** pour une pompe dont la vitesse est réglée sur un port PWM. Le même DO@Pump est la troisième partie du Suggested Name : `BM_22_DO@Pump_Pump_BH`.

Le texte On / Off est montré avec une Overlay (la superposition On verte des dessins de pompes Skynet).

## Le Label {#the-label}

Comment appelez-vous cette pompe ? Pompe de brassage, pompe d'empâtage, pompe du HLT ...? Utilisez votre nom pour la pompe comme Label. Le Schema exemple
d'OakBarn Brewery a plusieurs pompes et elles ont un code de couleur grâce à un Cover. Quand OakBarn brasse, il peut crier
« Arrête la pompe rouge » pour stopper le passage. Les fermenteurs sont dans une autre pièce et quand ils sont pleins à vue d'œil, le Brewmeister crie
« Coupe la pompe rouge » à son charmant assistant, qui clique alors sur la pompe rouge pour l'éteindre.

![Label Visible](help_pictures/Label_Visible_Switch.png)

Le Label peut être affiché sur le Tab, par exemple Red Pump au-dessus du Device Pump.

![Red Pump : le Label au-dessus de la pompe](help_pictures/Red_Pump_Label.png)

C'est la partie en texte simple du Suggested Name. Les espaces deviennent ~.
BM_15_DO@Pump_**Red~Pump**_BH

Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid
D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM
(Brewery Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

Et ne vous inquiétez pas d'un nom aussi compliqué quand vous codez un Process, car il pourra être choisi dans une liste. Vous
le trouverez vite utile. Grâce au texte prédictif, si vous utilisez le Suggested Name, tapez BM dans la liste et vos
choix sont limités aux seuls devices de BM : l'Arduino Brewery Mega.

Le **⬆** ouvre une fenêtre de texte de Label à 2 lignes

Le **⬢** ouvre une fenêtre Label Attributes où vous pouvez régler sa police, sa taille et ses couleurs.

© ® ™ : réservés aux mentions de copyright et de marque de la licence MIT de Skynet. Skynet est Open Source. Interdits dans un nom ou un Label pour éviter la confusion avec la licence MIT de Skynet.
@ ~ : gardés pour le Suggested Name. Pas tapés dans un nom ou un Label.

## Le Port {#the-port}

Choisissez un Port (Available Port). Un Port doit être choisi dans la liste avant de continuer.

Cliquez sur le petit triangle gris vers le bas pour déplier la liste des ports disponibles.

**Available Ports** : seulement les Ports (broches) libres de cette carte qui conviennent à ce type de Device, par exemple 22, ou A5 = 59. Les Digital
Outputs ont le plus de ports, les vrais Ports PWM sont bien plus limités. Une fois ajouté, il est grisé et ne peut plus être changé.

Cliquez pour choisir le Port.

Un Port PWM marqué **Best for True PWM: see Help** marche, mais gardez-le pour un Device qui a besoin de PWM.

BM_**15**_DO@Pump_Red~Pump_BH

Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid
D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM
(Brewery Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

## L'Interface {#the-interface}

La carte Arduino à laquelle ce Device Pump est raccordé. Une Interface a un nom et un ID. L'ID est donné par vous quand une
Interface est raccordée. L'Interface fait partie du pont entre le « Brain » et votre pompe rouge. Si le « Brain » ne peut fournir
aucun courant de 120 VAC à un appareil raccordé mais seulement un signal de commande. Il faut d'autres pièces de
matériel, et pas une seule. C'est une chaîne :

![La chaîne: Brain, Arduino, SSR, Red Pump](help_pictures/Pump_Daisy_Chain.png)

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

Brain -> IO de l'Arduino (Port) -> Commande (le Brain dit d'allumer la pompe rouge) -> signal de 5 V ou 3.3 V envoyé à -> SSR ou contacteur (le
120 VAC se branche ici) -> la pompe reçoit le courant

L'Arduino doit être raccordé (WiFi, Ethernet, USB) au Brain et allumé. Il doit être correctement câblé au SSR. Un électricien
a câblé le SSR et monté le circuit de la pompe rouge. S'il y a un interrupteur On/Off sur la pompe, il doit rester sur On.

L'Interface a des broches IO qui fournissent le signal de commande. Ce sont les Ports. Le type de signal envoyé dépend de la
méthode de commande du Brain et du type de Port choisi sur l'Arduino, car ils peuvent varier. Dans notre exemple, l'Interface est un Arduino
Mega 2560 et le Port choisi est 15. La méthode de commande est On/Off (Direct Output ou DO). La pompe choisie est une Blichmann
RipTide, un matériel de type On/Off. Le type de matériel est DO@Pump : pour les Devices du Brain, et la méthode de commande
est Direct Output. Si l'état du Device est vrai, le courant passe (par le SSR), et s'il est Off, le SSR n'envoie plus de
courant. Comme un interrupteur de lumière.

Quand une Interface est ajoutée au Brain, elle a un ID. L'ID est un champ obligatoire de Skynet, et même si une suggestion est faite, c'est un
champ libre que vous pouvez modifier. Les Interface IDs suivent la Rule 3.2 ([La règle des ID](46-interface-tab-device-names)). Notre
Interface d'exemple est : BM: Brewery Mega

L'ID est important car il fait partie du Suggested Name.
**BM**_15_DO@Pump_Red~Pump_BH

Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid
D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM
(Brewery Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

Et ne vous inquiétez pas d'un nom aussi compliqué quand vous codez un Process, car il pourra être choisi dans une liste. Vous le
trouverez vite utile. Grâce au texte prédictif, si vous utilisez le Suggested Name, tapez BM dans la liste et vos choix sont
limités aux seuls devices qui ont un Port sur BM : l'Arduino Brewery Mega sera un choix (parmi tous les autres Devices BM_)
dans la liste du texte prédictif.

S'il vous faut ajouter une nouvelle Interface, choisissez **➕ Add new Interface** dans la liste (premier choix). Créez l'Interface et enregistrez-la.
Vous reviendrez à cette fenêtre. La nouvelle Interface sera dans la liste et choisie.

## Le Tab {#the-tab}

Le Tab où ce Device (ou un nouveau Widget) va quand on clique sur le bouton Move to Tab à la fin de la construction.

Un Tab normal est comme la passerelle d'un vaisseau spatial de votre conception. C'est là que vous installez les commandes pour ouvrir un trou de ver, détruire un
trou noir, ou tout ce que vous pouvez faire. Vous disposez le tout pour que le capitaine (Brewmeister) puisse commander le vaisseau (la brasserie).
Et comme dans un vaisseau, il y a une passerelle de secours et d'autres compartiments sur les ponts.
Il peut y avoir un compartiment de navigation où logent tous les navigateurs, mais le capitaine peut vouloir avoir certaines de ses
commandes dans cette pièce, il peut donc construire un Clone de sa commande de trou de ver dans cette pièce, qui est relié à celle de la
passerelle et agit comme elle.

En plus de tous les compartiments normaux d'un vaisseau (et c'est vous, le constructeur, qui décidez combien, leurs noms, et quelles commandes ou quels éléments
sont sur ce Tab), il y a aussi des Tabs spéciaux Skynet (comme ce Build Tab) auxquels vous pouvez accéder mais qui ne servent pas à
commander, seulement d'atelier pour construire quelque chose qui sera placé sur un Tab normal de l'utilisateur.

Quand un Tab est ajouté au Brain, il a un ID. L'ID est un champ obligatoire de Skynet, et même si une suggestion est faite, c'est un champ
libre que vous pouvez modifier. Les Tab IDs suivent la Rule 3.2 ([La règle des ID](46-interface-tab-device-names)). Notre Tab d'exemple
est : BH: Brew House
L'ID est important car il fait partie du Suggested Name.
BM_15_DO@Pump_Red~Pump_**BH**
Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid

D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM
(Brewery Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

Et ne vous inquiétez pas d'un nom aussi compliqué quand vous codez un Process, car il pourra être choisi dans une liste. Vous le
trouverez vite utile. Grâce au texte prédictif, si vous utilisez le Suggested Name, tapez BM dans la liste et vos choix sont
limités aux seuls devices qui ont un Port sur BM : l'Arduino Brewery Mega sera un choix (parmi tous les autres Devices BM_)
dans la liste du texte prédictif.

Vous envoyez toujours certaines constructions, comme un Vessel Template, vers le Tab spécial Skynet : Templates.
**➕ Add new Tab…** fait un nouveau Tab, revient ici et le règle comme Tab par défaut du Build Tab (Règle Skynet 4.6).

## Le Device Type {#the-device-type}

Son Device Type : DO@Pump, une pompe (Pump) sur un port de sortie numérique On/Off (DO). Le type général vient d'abord, puis un @, puis le
Device Type.
Le type est toujours donné par Skynet et vous ne pouvez pas le changer. Tous les Devices Skynet ont un type fixé.

Le même DO@Pump est la troisième partie du Suggested Name : DO@Pump. Il vient du Device que vous avez ajouté et est réglé pour vous.
BM_15_**DO@Pump**_Red~Pump_BH
Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid

D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM
(Brewery Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

Et ne vous inquiétez pas d'un nom aussi compliqué quand vous codez un Process, car il pourra être choisi dans une liste. Vous le
trouverez vite utile. Grâce au texte prédictif, si vous utilisez le Suggested Name, tapez BM dans la liste et vos choix sont
limités aux seuls devices qui ont un Port sur BM : l'Arduino Brewery Mega sera un choix (parmi tous les autres Devices BM_)
dans la liste du texte prédictif.

## Le Name {#the-name}

C'est ainsi que le Device (ou un Widget) est désigné : l'identifiant unique qui permet au Skynet Panel d'accéder à la pompe rouge que vous
venez de construire et de l'utiliser.
Dans Skynet, il y a des standards, comme les caractères interdits tels que :, " et d'autres qui pourraient gêner le système d'exploitation
de l'ordinateur ou le propre code de fond de Skynet. Aucune espace n'est permise dans les noms Skynet.

Skynet fournit toujours un Suggested Name, qui est la convention de nommage préférée de Skynet. Cette convention vous dit beaucoup sur le
Device (ou le Widget) rien que par son nom.

Format du Suggested Name : INTERFACEid_Port_Type_Label_TABid

| Partie | Dans le nom |
|---|---|
| Interfaceid | **BM**_15_DO@Pump_Red~Pump_BH |
| Port | BM_**15**_DO@Pump_Red~Pump_BH |
| Type | BM_15_**DO@Pump**_Red~Pump_BH |
| Label | BM_15_DO@Pump_**Red~Pump**_BH |
| TABid | BM_15_DO@Pump_Red~Pump_**BH** |

D'après BM_15_DO@Pump_Red~Pump_BH ci-dessus, le Brewmeister d'OakBarn sait que le Device Red Pump est raccordé à l'Interface BM (Brewery
Mega {Arduino}), sur le Port 15, de type Pump, avec le label Red Pump, et enfin sur le Tab BH (Tab Brew House).

Et ne vous inquiétez pas d'un nom aussi compliqué quand vous écrivez un Process : il pourra être choisi dans une List Box. Vous le
trouverez vite utile. Grâce au texte prédictif, si vous utilisez le Suggested Name, tapez BM dans la List Box et vos choix se limitent
aux seuls Devices du BM : Brewery Mega Arduino.

Dans Skynet, un nom peut être changé assez facilement. En plus d'un champ normal où vous pouvez écrire votre propre nom libre, il y a un
bouton qui convertit tous les noms en Suggested Name, si vous n'avez pas choisi d'utiliser le Suggested Name plus tôt. **Important :**
cliquer sur le bouton **🏷 Suggested Names** > **💾 Convert** change tous les noms en Suggested Name. Les noms peuvent toujours être
modifiés un par un (**💾 Update to Suggested** change un seul nom). Il est fortement conseillé d'utiliser le Suggested Name de Skynet, car certaines fonctions marchent mieux telles qu'elles ont été
prévues pour ce format. Ces fonctions existent toujours, mais peuvent ne servir à rien si les noms s'écartent du format Suggested Name.

En Edit layout, **🏷 Suggested Names** liste chaque Device et Widget dont le Name n'est pas
son Suggested Name ; cochez ceux à changer et appuyez sur **💾 Convert**, puis **Save layout** (Règle 3.18). Un nom à la fois : **💾 Update
to Suggested** dans sa fenêtre Name Change (Règle 3.16).

## L'Inlet IP, l'Outlet IP et Hose or Pipe {#the-inlet-ip-outlet-ip-and-hose-or-pipe}

![Une pompe avec ses 8 IP](help_pictures/Pump_8_IPs.png)

Chaque pompe a 8 IP : les 4 coins de sa boîte et le milieu de chaque côté, les mêmes sur chaque pompe, pour qu'une autre pompe puisse
prendre sa place et rester reliée à ses tuyaux.

Les tuyaux et les flexibles fixent son entrée (IN) et sa sortie (OUT), telles qu'on les voit sur le Tab (OakBarn Brewery : « Pipe and
hose changes are always auto » ; « nearest where the user places it ») : dessinez ou déposez un bout de tuyau ou de flexible sur la
pompe ou près d'elle, et il rejoint la plus proche des 8 IP, et le bout libre de la pompe (son IN ou son OUT sans rien de joint) va
là. Avec les deux bouts libres, celui qui est le plus près de cette place y va. Une place où est l'autre bout n'est jamais prise. Il
n'y a pas de case Inlet IP ni Outlet IP à choisir.

Exemple 1 :

![Exemple 1 : Right, Inlet Right Middle, Outlet Top Right](help_pictures/Pump_IP_Example_1.png)

Exemple 2 :

![Exemple 2 : Left, Inlet Bottom Right, Outlet Top Left](help_pictures/Pump_IP_Example_2.png)

Les tuyaux ou tuyaux souples se raccordent à l'IP la plus proche quand leur bout est mis sur la pompe ou près d'elle ; un bout à 10 px ou moins d'une
![IP](help_pictures/IP_Marker.png) rejoint cette IP.

Changer l'Orientation les laisse où elles sont (voir Orientation plus haut) : l'exemple 2 passé à Right garde son Inlet en
Bottom Right et son Outlet en Top Left, et le Hose ou Pipe dans la pompe est redessiné pour les rejoindre.

**Hose or Pipe** : ce qui est dessiné depuis l'entrée et la sortie de la pompe elle-même jusqu'à son Inlet IP et son Outlet IP : un
Hose blanc, ou un Pipe en inox. Un tuyau ou un flexible joint à l'IP le fixe aussi. Il est dessiné par-dessus la pompe et son Cover sous l'overlay On.

## Le bouton ➕ Add Device {#the-add-device-button}

Tant qu'il manque quelque chose, **➕ Add Device** a l'air pâle. Son aide au survol dit quoi faire d'abord (« Type a Label first », « Pick the
Port first » ...), puis, après une ligne vide, la même aide au survol que cette case. Appuyez dessus et il vous dit ce qui manque.

Les titres et noms de champs de chaque fenêtre sont en Title Case (Fore Color, Font Size).
