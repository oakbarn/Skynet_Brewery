# Construire un Vessel Device pas à pas {#build-a-vessel-device-step-by-step}

Le **Vessel Device Builder** demande ce qu'a votre cuve, puis la construit pour vous comme **Vessel Device** (Règles Skynet 19.5 et 5.31).
Ses résistances et sa sonde de température y sont **intégrées**, comme celles du RIMS tube, donc elles ne peuvent pas être perdues ni supprimées
seules.

## Où le trouver {#where-to-find-it}

En **Edit layout**, ouvrez **Vessel** sur la barre Edit layout et choisissez **🔨 Build a Vessel Device (step by step)**. Il est aussi sous
**Add Widget > Vessels**.

## 1. Les questions {#1-the-questions}

| Question | Choix |
| --- | --- |
| Label | par exemple HLT (il ne peut pas être vide) |
| General Type | HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank. **Other** vous demande d'en taper un, et il est gardé dans la liste comme **USER: Hop Pot Strainer**. |
| Tab | le Tab où elle va quand le Build est enregistré |
| Units, Volume | Gallons (Liters en Metric). Commence à 10. |
| Height, Diameter | tapez les deux pour sa forme, ou laissez les deux vides pour la forme de cuve simple |
| Bottom Drain | None, Center Low, Center Bottom Drain, Pick |
| Tangential Inlet | None, Left, Right, Pick |
| Sparge Arm / Steam Slayer | None, Right (High), Left (High), Pick |
| Thermowell / Probe | None, Center, Left, Right, Back Left, Back Center, Back Right, Pick |
| Heating Element | None, Left, Right, Back Left, Back Center, Back Right, Pick (une seconde peut être ajoutée) |
| HERMS Coil | None, Left, Right, Outlet Right & Inlet Left, Outlet Left & Inlet Right (un serpentin croisé, dessiné à travers la cuve). Pas de Pick. |

Un Thermowell, une sonde ou une résistance n'a **pas d'IP à lui**. Sur une ouverture, il la ferme, comme un End Cap. Deux d'entre eux ne peuvent pas aller
au même endroit. Appuyez sur **🔨 Build**.

### Pick (double-cliquez sur l'endroit) {#pick-double-click-the-spot}

Quand votre cuve a une pièce là où aucun des choix ne tombe, choisissez **Pick (double-click the spot on the vessel)**. Une cuve vide
s'ouvre avec de petits points aux endroits habituels (IP préréglés). **Double-cliquez** là où est la pièce sur votre cuve :

- Près d'un petit point, elle prend cet endroit habituel.
- Ailleurs, elle crée une nouvelle ouverture (un **User IP**) sur cette seule cuve, par exemple **Picked Drain**.

**↶ Undo** enlève la marque, **💾 Save** la garde, **✖ Cancel** laisse la question comme elle était. Pick ne marche **que pendant la première
construction de la cuve**. Une fois construite et enregistrée, aucune ouverture ne peut être ajoutée ni déplacée.

## 2. La finir sur le Build Tab {#2-finish-it-on-the-build-tab}

La cuve est à gauche du **🔨 Build Tab**, avec sa résistance, son Thermowell et son serpentin HERMS, et les ouvertures de sa
vidange, de son Tangential Inlet, de son Sparge Arm ou Steam Slayer et de son serpentin HERMS. Chaque ouverture non choisie est cachée.

Le panneau **Vessel Builder** est à droite. Il a une ligne pour chaque chose qu'il vous reste à choisir :

- **Heating Element** ou **Thermowell / Probe** : cliquez sur la ligne (ou sur le petit point actif de son image pâle) et choisissez-en
  un existant dans la liste, ou **➕ Add new …**, qui ouvre la case d'ajout habituelle. Celui que vous choisissez est intégré à la cuve
  et garde son nom et son Port. Son affichage va sur la cuve, comme celui de la HLT dans l'exemple Three Vessel.
  Un élément déjà intégré à une cuve (les sondes et résistances de l'exemple Three Vessel aussi) n'est pas listé : il reste dans sa propre
  cuve, donc l'exemple n'est jamais changé par ce que vous construisez.
- **Drain, Tangential Inlet, Sparge Arm** : cliquez sur sa ligne et choisissez **jusqu'à 3 pièces**, depuis la cuve vers l'extérieur : **None, Valve,
  Elbow, Tee** ou **Priming Tee** (seulement sur le Drain). None termine la liste, donc les pièces après sont grisées. Un Elbow (coude) tourne
  le parcours. Le Priming Tee (un Instrument Tee avec une Manual Valve sur son côté court) pointe toujours vers le haut, donc il ne va que là où le
  parcours est horizontal : sur un Drain, mettez un Elbow avant. Chaque pièce est jointe à la précédente par un court tuyau.
- **Quelle vanne :** une vanne motorisée que vous avez déjà (une qui n'est pas encore sur un tuyau), **➕ Add New Motorized Ball Valve** (les cases
  d'ajout habituelles), ou **➕ Add Manual Valve Widget** : Plain, Manual Ball Valve (vue de côté) ou Manual Butterfly Valve. Une Manual Valve est
  tournée pour aller sur un parcours vertical, et vous la confirmez à la main (Confirmation Widget).
- Le **Sparge Arm** est dessiné dans la cuve, depuis son ouverture vers l'autre côté. Le **Steam Slayer** arrive dans la prochaine
  mise à jour.

Double-cliquez sur l'image d'une pièce sur la cuve pour ouvrir ses propres Properties (une image pâle ouvre son choix). Les Properties de la cuve
montrent une section pour chaque résistance et pour le Thermowell / Probe (aide : Vessel Widget).

Appuyez sur **✔ Done** pour fermer le panneau. Puis appuyez sur **💾 Save Build ... > Move to Tab** pour mettre la cuve sur son Tab.

**Une fois sur un Tab et le layout enregistré, ses ouvertures et ses pièces intégrées sont verrouillées pour toujours.** Son Name, ses Labels, son Volume,
son Tab et sa position peuvent encore changer.
