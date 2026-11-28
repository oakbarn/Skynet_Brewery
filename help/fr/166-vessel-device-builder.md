# Construire un Vessel Device pas à pas {#build-a-vessel-device-step-by-step}

Le **Vessel Device Builder** demande ce qu'a votre cuve, puis la construit pour vous comme **Vessel Device** (Règles Skynet 19.5 et 5.31).
Ses résistances et sa sonde de température y sont **intégrées**, comme celles du RIMS tube, donc elles ne peuvent pas être perdues ni supprimées
seules.

## Où le trouver {#where-to-find-it}

En **Edit layout**, ouvrez **Vessel** sur la barre Edit layout et choisissez **🔨 Build a Vessel (a plain stainless pot, then its parts)**.
Il est aussi sous **Add Widget > Vessels**.

## 1. Les questions {#1-the-questions}

Chaque cuve part d'une **simple marmite inox**, dessinée à sa propre Hauteur et à son propre Diamètre. Chaque pièce va à sa hauteur
habituelle au-dessus du fond intérieur, mesurée sur de vraies cuves, quelle que soit leur taille. Gauche et Droite se lisent face à la cuve.

| Question | Choix |
| --- | --- |
| Units | US (gallons, pouces) ou Metric (litres, cm) |
| 1. Hauteur, 2. Diamètre | intérieurs, en premier. La marmite est dessinée selon eux et son volume en découle. |
| Label | par exemple HLT (il ne peut pas être vide) |
| General Type | HLT, Mash Tun, Brew Kettle, All In One, Whirlpool, Fermentor, Bright Tank. **Other** vous demande d'en taper un. |
| Tab | le Tab où elle va quand le Build est enregistré |
| 3. Sortie | Center Low (environ 2 po au-dessus du fond), Center Bottom Drain (dans une jupe de 6 po, la vidange au centre), None. Sa vanne : Manual Ball Valve with Elbow, Motorized Ball Valve with Elbow, Manual Butterfly Valve with Elbow, Manual Ball Valve, Motorized Ball Valve, Manual Butterfly Valve |
| 3b. Faux fond (Mash Tun seulement) | sa Hauteur au-dessus du fond, vide s'il n'y en a pas. Il est dessiné en pointillés. La Sortie reste en dessous, à sa hauteur habituelle. |
| 4. Température | Electronic (puis son Probe Type) ou Analog Gauge, None. Puis Thermowell ou Direct, puis l'endroit : Center above the Outlet (environ 5,5 po au-dessus du fond), Left, Right, Back Left, Back Center, Back Right |
| 5. Entrée tangentielle | Left Low (environ 1,5 po au-dessus du fond), Right Low, None. Sa vanne : les mêmes 6 que la Sortie. |
| 6. Indicateur de niveau | Left, Right, None. Son IP du bas est à 1 po du fond, son IP du haut juste au-dessus, à 1 po du haut. |
| 7. Capteur de volume par pression | Right Side, Left Side, Back Centered, None (1 po au-dessus du fond) |
| 7a, 7b. Niveau ou flotteur 1 et 2 | Left, Right, Front, Back, None ; sa Hauteur depuis le fond ; Normally Closed ou Normally Open |
| 8. Chauffage | Résistance(s) électrique(s) : Heater 1 et Heater 2, Back Right ou Back Left (TC 2 po), chacune avec sa Hauteur au-dessus du fond. Brûleur à gaz : Natural Gas, High Pressure Propane ou Low Pressure Propane, et son allumeur : (none), Flat Plate (no Safety), Pilot with Valve Control, Pilot (no Safety). Pas chauffée. |
| 9. Retour de rinçage | High Right, High Left, None. Son arrêt : (none), Manual Ball Valve, Motorized Ball Valve. Son té avec sonde de température : (none), Instrument Tee, Long Tee. |
| 10. Steam Slayer 2 po | High Right, High Left, None. Réduction : (None), 2 in to 1.5 in Reducer |
| 11. Serpentin HERMS (immersion) | Inlet Left, Outlet Right ; Inlet Right, Outlet Left ; Inlet Right, Outlet Right ; Inlet Left, Outlet Left (d'un seul côté : Inlet High ou Inlet Low). Cuivre ou inox. |
| 12. Contrôle de fermenteur | Chauffage et refroidissement tenus par une seule consigne (il faut une sonde de température Electronic) |
| 13. IP supplémentaires | jusqu'à 4, sur tout endroit du Vessel Layout qu'aucune pièce ci-dessus n'a pris : 1.5 TC, 2.0 TC, 3/4 TC, 1/2 TC, 1/2 BSP, 1/2 MPT, 1/2 FPT |

Quand **Gas Burner** est choisi, un grand avertissement rouge s'affiche :

> ⚠ Le gaz peut tuer ou provoquer un incendie. Suivez toutes les précautions de sécurité pour le gaz. Vous êtes responsable de toute la
> sécurité quand vous utilisez du gaz. OakBarn Brewery et Skynet ne sont ni électriciens, ni plombiers, ni experts en chauffage et
> climatisation. Consultez un électricien, un plombier ou un professionnel du chauffage et de la climatisation agréé.

Appuyez sur **🔨 Build**. Une vanne manuelle sur la Sortie, l'Entrée tangentielle ou le Retour de rinçage est posée tout de suite, ainsi
que le **Sight Glass**, debout entre les deux IP de l'indicateur de niveau.

### 🔌 Interface, ports et noms {#interface-ports-and-names}

Juste après **🔨 Build**, une deuxième fenêtre demande chaque pièce qui a besoin d'un port : la sonde de température, les résistances et
les interrupteurs de niveau ou flotteurs. Choisissez l'**Interface** à laquelle ils sont câblés, puis le **Port** de chaque pièce (ou
son 1-Wire Index). **💾 Save** les crée toutes, intégrées à la cuve, chacune avec son **Suggested Name**. **✖ Close** les laisse à
choisir une par une dans le panneau Vessel Builder. Sans Interface pour l'instant, la fenêtre n'apparaît pas : ajoutez les pièces plus
tard, une fois l'Interface configurée.

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
- Le **Sparge Arm** est dessiné dans la cuve, depuis son ouverture vers l'autre côté. Le **Sparge Tee**, le **Steam Slayer** et le **Gas Burner** arrivent dans la prochaine
  mise à jour.

Double-cliquez sur l'image d'une pièce sur la cuve pour ouvrir ses propres Properties (une image pâle ouvre son choix). Les Properties de la cuve
montrent une section pour chaque résistance et pour le Thermowell / Probe (aide : Vessel Widget).

Appuyez sur **✔ Done** pour fermer le panneau. Puis appuyez sur **✅ Finish Build ... > Move to Tab** pour mettre la cuve sur son Tab.

**Une fois sur un Tab et le layout enregistré, ses ouvertures et ses pièces intégrées sont verrouillées pour toujours.** Son Name, ses Labels, son Volume,
son Tab et sa position peuvent encore changer.
