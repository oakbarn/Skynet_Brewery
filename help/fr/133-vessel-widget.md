# Widget Vessel {#vessel-widget}

Le **Vessel Widget** est une classe de cuve (Règle Skynet 5.31). Il part d'**un seul Skynet Template, Skynet_Vessel_Widget**, qui
a tous les emplacements qu'une cuve de brassage peut avoir, chacun avec un curseur **Place** :

- **16 IP**, disposés d'après le dessin Skynet Vessel IP Template :
  - **Côté droit**, de haut en bas : **Right Sparge**, **Right HERMS In**, **Right HERMS Out**, **Right Element**
  - **Côté gauche**, de même : **Left Sparge**, **Left HERMS In**, **Left HERMS Out**, **Left Element**
  - **Left Back Element**, **Center Back Element** et **Right Back Element** (vus de face, à la hauteur des Elements des côtés)
  - **Center Probe**, **Left Tangential** et **Right Tangential**, **Center Outlet**, et le **Center Bottom Outlet** sur le
    fond
- **une sonde de température**, vue de **Front** (sur l'emplacement Center Probe) ou comme **Thermowell** (doigt de gant, entrant par le côté)
- **un Element Port** (la résistance chauffante, sur l'emplacement Right Element)

**Les noms sont seulement indicatifs.** Tout ce qui a un IP peut aller sur n'importe lequel : un Element sur un emplacement HERMS, un tuyau sur un
emplacement Back Element, et ainsi de suite. Il n'y a aucune limite sur l'usage de chaque IP.

**Chaque IP a un Label** qui commence identique à son Name. Changez-le dans Vessel Widget Properties, à côté du curseur Place de l'IP
(par exemple « Retour whirlpool » pour Right Tangential). Le Label est le texte affiché près de l'IP ; videz-le et il redevient le Name.

Sur le Template, tous les curseurs Place sont activés. L'idée : Skynet construit à partir de lui des Templates de cuves avec les curseurs réglés comme sur de vraies
cuves. Vous choisissez celle qui ressemble le plus à la vôtre, désactivez ce que votre cuve n'a pas, et elle correspond.

## Les IP sur une cuve {#ips-on-a-vessel}

Un IP sur une cuve est une **sortie ou une entrée TC, NPT ou BSP**. Le type importe peu : un IP est un endroit où brancher un autre
Device ou Widget qui a son propre IP, comme un Pipe, un Hose, un Fitting, ou tout ce qui a un IP.

## Place

- **Place activé :** il est sur la cuve et il fonctionne. Un IP relie tuyaux, flexibles et raccords. La sonde et l'Element affichent leurs
  images, et l'Element rougeoie pendant que sa chauffe est en marche.
- **Place désactivé (Not Placed) :** il n'existe pas du tout. Rien ne s'affiche sur le Tab, et aucun tuyau ni Process ne peut l'utiliser. Il est caché
  même sur le 🔨 Build Tab et en Edit layout, et son curseur est caché dans Vessel Widget Properties. Appuyez sur **👁 Show All** dans les
  Properties pour lister les emplacements Not Placed (pour pouvoir en placer un) et voir des marques pâles là où ils iraient (un anneau en pointillés pour un
  IP, une image pâle pour la sonde ou l'Element). Appuyez sur **🙈 Hide Not Placed** pour les cacher de nouveau (Règle Vessel 19.4).

Les emplacements sont fixés par le Template : **personne ne peut les déplacer**. Une cuve verrouillée ne se déplace que par son X et son Y (Règle 2.12), et ses IP
la suivent.

## En créer un {#making-one}

Edit layout > **Vessel** > **Vessel Widget ...**, puis choisissez **Skynet_Vessel_Widget** sous **Vessel Widget**. Il va sur le
🔨 Build Tab (Règle 4.1). Double-cliquez dessus pour ouvrir **Vessel Widget Properties** et régler les curseurs Place, le type de sonde et les
Devices.

## La sonde et l'Element {#the-probe-and-the-element}

Quand la sonde de température ou l'Element Port est placé, choisissez le Device qu'il utilise sous **Devices** (une sonde de température, ou une
sortie de résistance chauffante comme Hysteresis ou PID). Créer ce Device directement depuis la cuve (en choisissant son Interface, son Port et son
type de sonde) attend une décision sur la Règle 5.7.

## Le Vessel Device {#the-vessel-device}

Une cuve construite à partir d'un Vessel Widget Template est un **Vessel Device** : un Device spécial, fait comme le **RIMS tube** (le RIMS tube est
un petit Vessel Device dont l'Element et la sonde sont déjà réglés et verrouillés). Dans ses Properties, sous chaque IP placé, **On this IP**
choisit ce qui est intégré dans cet IP :

- **Nothing** : un IP ouvert, pour un Pipe, un Hose ou un Fitting
- **Heating Element**
- **Temperature Probe** ou **Thermowell with its Temperature Probe** (choisissez le type de sonde, puis son Port ou son numéro de sonde OneWire)
- **Motorized Valve**

Choisissez une fois l'**Interface** (la carte) à laquelle les pièces sont câblées, puis le **Port** de chaque pièce. Une pièce n'est pas un Device séparé : elle fait partie
de la cuve, elle s'affiche sur la cuve à son IP, et elle reçoit une petite lecture (On / Off, ou la température) à côté de la cuve, comme
celles du RIMS tube. Elle ne peut pas être supprimée seule. Un Element, une sonde ou un Thermowell remplit son IP, donc aucun débit n'y passe ;
une vanne ne laisse passer le débit que lorsqu'elle est ouverte.

**Chaque pièce a ses propres Properties.** En Edit layout, double-cliquez sur un Heating Element, un Thermowell ou une sonde intégré à la cuve
(sur un téléphone ou une tablette, gardez le doigt dessus). Ses propres Properties s'ouvrent, les mêmes que celles d'un Heating Element ou d'une Temperature Probe
indépendants : Label, Interface et Port, Name, Toggle, Overlay, méthode de chauffe, etc. Son Tab s'affiche comme **Built into** (la cuve). Les
Properties de la cuve elle-même ont aussi une section **Heating Element** et une section **Thermowell / Probe** avec les réglages principaux et un
bouton vers les Properties de la pièce. Quand la cuve n'en a pas, cette section est vide et grisée.

**Une fois construite, seul ce qui peut vraiment changer reste dans ses Properties.** Une fois la cuve construite (avec le Vessel Device Builder,
ou enregistrée sur un Tab), ses Properties montrent son Name (✏ Change name), son Type (grisé), son Label, Visible, Hidden Locked, le Label et
la position, et les sections Heating Element et Thermowell / Probe. Celles-ci peuvent changer : Label, méthode de chauffe, Setpoint, Units,
etc. Leurs **Interface et Port sont grisés pour toujours** : la cuve les verrouille (Règle Skynet 5.31), et une pièce intégrée ne peut pas être
remplacée par une autre. Si la résistance ou la sonde elle-même s'use, posez-en une neuve câblée exactement pareil sur le même Port ; rien ne change dans
Skynet. Sa **taille** peut encore changer : Gallons, Method, Diameter et Height, avec le **Calculated Volume** en lecture seule, le Dead space et le Safe
Element Volume (aide : Vessel sizing). Ses IP, son serpentin HERMS, sa vidange, son Tangential et son Sparge / Steam Slayer ne peuvent pas changer, ils ne sont donc pas affichés.

**Les ouvertures bouchées cachent leur IP.** Un Element, une sonde ou un Thermowell bouche son ouverture, exactement comme un End Cap, donc son IP est
caché et aucun tuyau ni flexible ne peut s'y joindre. Seuls les IP ouverts s'affichent. L'IP d'une vanne reste affiché, car le débit la traverse.

**Serpentin HERMS :** choisissez **Left**, **Right**, ou un serpentin croisé (**Outlet Right & Inlet Left**, **Outlet Left & Inlet Right**). Le serpentin est dessiné sous les IP **HERMS In** et **HERMS Out** de ce côté, avec une forme adaptée
à eux, et les deux IP deviennent les deux bouts du serpentin : ce qui entre par l'un sort par l'autre.

**Une fois construite et enregistrée, pas de retour en arrière.** Après 💾 Save Build ... > Move to Tab et Save layout, ses IP, les pièces intégrées
et son serpentin HERMS sont verrouillés pour toujours, et elle ne peut pas être dégroupée. Son Name, ses Labels, ses Gallons, son Tab et sa position peuvent encore
changer. (Une exception aux Règles Skynet 5.7 et 5.31.)

## Vos propres ajouts {#your-own-additions}

Vous pouvez toujours ajouter vos propres Devices et Widgets à un Vessel Widget, et les **grouper (Bundle)** avec lui pour faire un **User Bundled Template**
(aide : Add a Vessel).

## Dans les exemples {#in-the-samples}

La cuve d'eau chaude, la cuve d'empâtage et la cuve d'ébullition de l'exemple **Three Vessel** sont des **Vessel Devices** construits à partir du Main Template
(verrouillés, comme un RIMS tube). Chacune a son **Center Bottom Outlet** placé (relié par tuyau à sa vanne de sortie) et un **Thermowell with
its Temperature Probe** intégré dans son IP **Left Element**. La cuve d'eau chaude et la cuve d'ébullition ont leur **Heating Element**
intégré dans l'IP **Right Element**, et la cuve d'empâtage et la cuve d'ébullition ont leur IP **Left Sparge** placé pour le tuyau d'arrivée en
haut. Les sondes et les résistances sont les mêmes Devices qu'avant, avec les mêmes Ports. Depuis le 2026-11-08 elles portent les noms Skynet
(BM_700_TEMP@1W_HLT_BH, BM_8_DO@H_Element_HLT~element_BH, etc., Règle 3.1), et les Processes du jour de brassage utilisent ces noms.

## Taille {#size}

Un Vessel Widget est dimensionné par ses **Gallons** (10 au départ) : voir l'aide **Vessel sizing by gallons**.
