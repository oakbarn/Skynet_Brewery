# Properties du Device résistance chauffante {#heating-element-device-properties}

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

Ajouter un **Heating Element** se fait comme pour une pompe (voir [Properties du Device Pump (le détail)](115-pump-device-properties)) et une
vanne à bille motorisée (voir [Properties du Device Motorized Ball Valve](128-motorized-ball-valve-device-properties)) : **une résistance chauffante
n'a pas de Cover**. (Règle Skynet 18.24)

## Ajouter une résistance chauffante {#adding-a-heating-element}

1. En Edit layout, cliquez sur **Heating Element > Heating element, on / off (relay, SSR or contactor)** (elle est aussi dans la liste **On/Off**).
2. **Choisissez la résistance.** Chacune a son image :
   - **Skynet Heating Element** : le dessin de résistance Skynet. Son image est fixée, et elle rougeoie en marche.
   - **User Defined Heating Element** : vos propres images à l'arrêt et en marche.
3. La case d'ajout s'ouvre avec le nom de la résistance comme titre. Son **Label** est déjà rempli (**hE_1**, hE_2 ... ; voir plus bas), donc le curseur commence sur le champ vide suivant. Remplissez dans l'ordre : 1 le **Label** (le ⬢ à côté règle sa police et ses
   couleurs) et **Label Visible**, 2 l'**Interface** (la carte) et un **Available Port** sur la même ligne, 3 le **Tab**.
   Ensuite le **Suggested Name** s'affiche, fait à partir d'eux, avec le reste :
   - **Graphic** : la résistance telle qu'elle s'affichera sur le Tab, à l'arrêt, tournée selon son Orientation.
   - **Path** (une résistance Skynet : grisé), ou **Path (off)** et **Path (on)** (une User Defined).
   - **Orientation** (Right ou Left) et, sur la même ligne, **Toggle** (Toggle au départ, ou Push Button : en marche seulement tant qu'on appuie ; [aide 179](179-heating-element-look)).
   - **Overlay** (**Red Glow** au départ : elle rougeoie en marche ; **None** n'affiche rien) et, sur la même ligne, **Database and .API ⬢** (aide 98).
   - **X**, **Y**, **Width** et **Height**, et le **Device Type** grisé (**DO**).
   **Entrée** vous fait passer par Label, Interface, Available Ports, Tab, Orientation, puis **➕ Add Device**.
4. Appuyez sur **➕ Add Device**. La résistance est créée sur le 🔨 [Build Tab](55-build-tab) et ses Properties s'ouvrent ; **💾 Save Build ...** la déplace sur le Tab choisi. L'**Interface** et le **Port**
   sont maintenant grisés et fixés (c'est le câblage). Sur le Tab, un clic dessus la met en marche ou à l'arrêt tout de suite, comme une pompe (Règle 2.33).

## Vessel Device Template : choisir, puis construire {#vessel-device-template-choose-then-build}

Dans la liste **Heating Element**, **Vessel Device Template** remplace *Electric kettle, basic* :

1. **Choisissez la cuve** : le Vessel Widget (tous les IP, une sonde de température et un Element Port, chacun avec un curseur Place) ou tout
   autre Vessel Template qui a un Element Port.
2. **Choisissez la résistance** et remplissez la case d'ajout, comme plus haut. Son titre dit pour quelle cuve elle est.
3. **➕ Add Device** les construit sur le **🔨 Build Tab** : la résistance et une copie de la cuve avec son **Element placé**
   et lié à la nouvelle résistance (l'Element rougeoie quand elle est en marche). Appuyez sur **💾 Save Build ... > Move to Tab** : le Tab que vous
   avez choisi est proposé en premier, et les deux y vont.

La cuve n'a toujours pas de Devices à elle (Règle 5.7) : la résistance est son propre Device, et l'emplacement Element de la cuve s'y lie
(Règle 5.31). *Electric kettle, basic* est toujours dans la liste complète **Add Device** (Devices : Skynet).

## Les Labels se remplissent {#labels-fill-in}

Le Label de chaque résistance commence rempli, avec le numéro libre suivant. Vous pouvez le changer, mais il ne peut pas être vide.
Il ne contient pas de méthode de chauffe, car la méthode peut changer pendant le brassage (aide 150). Son Device Type est **HE**, donc son
nom se lit comme `MB_25_DO@H_Element_HLT_BH`.

| Sorte | Label |
|---|---|
| Heating Element (sortie on / off : Direct, Duty Cycle, Hysteresis, PID, Deadband ou Precise) | hE_1 |
| PWM (puissance de la résistance 0-100 %) | hE_PWM_1 |
| Les anciens Devices de régulation : PID, Hysteresis, Duty Cycle, Deadband | hE_PID_1, hE_HYS_1, hE_DutyC_1, hE_DeadB_1 |

## Properties, de haut en bas {#properties-from-the-top}

1. Le titre (**Skynet Heating Element** ou **User Defined Heating Element**), avec le **cadenas 🔓**, **Visible** et **Hidden Locked**
   à côté. Puis **Delete**, **Cancel** et **Save**.
2. **1. Label ⬆ ⬢** et **Label Visible**.
3. **2. Interface** et **Available Ports**, grisés.
4. **3. Tab** et **4. Name**.
5. **Graphic**, **Path**, puis **Orientation** et **Toggle** sur une ligne.
6. **Overlay** avec **Database and .API ⬢**.
7. **Heating method** : la méthode de départ (Direct, Duty Cycle, Hysteresis, PID, Deadband ou Precise), sa sonde de température et les réglages de cette
   méthode. Un clic pendant le brassage ou un Process la change : voir [Une seule résistance, choisissez comment elle chauffe](150-heating-method).
8. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, et le **Device Type** grisé (**DO**).

Les résistances intégrées à un RIMS tube ou à une cuve Integrated gardent leur fenêtre actuelle (Règle 18.10), avec la Heating method
ajoutée (Règle 6.19). Les anciennes résistances séparées PID, Hysteresis, Deadband et Duty Cycle gardent aussi la leur.

## Intégrée à un Vessel Device : l'exemple de la HLT {#built-into-a-vessel-device-the-hlt-example}

Les bulles de cette fenêtre (gardez la souris sur le nom d'une case) prennent comme exemple l'**HLT element** de l'exemple **3 Vessel 1 Pump**
(Règle Skynet 11.7). Elle est intégrée à la cuve **HLT_Vessel**, donc sa fenêtre s'appelle **Integrated Heating Element Device**.
Ce que disent les bulles :

| Case | L'HLT element |
|---|---|
| **1. Label** | **HLT element**. C'est le début du Suggested Name : une espace devient ~, donc c'est HLT~element dans le nom. |
| **2. Interface** et **Available Ports** | **Brewery Mega** (son ID est **BM**), Port **8**. |
| **3. Built into** | **HLT_Vessel**. Elle bouge avec la cuve et ne peut pas en être séparée. |
| **4. Name** | `BM_8_DO@H_Element_HLT~element_BH` : BM (Brewery Mega), Port 8, DO@H_Element (une résistance sur un port On/Off), HLT~element (son Label) et BH (le Tab Brew House). |
| **Device Type** | **HE**, une résistance chauffante. |
| **Toggle** | Toggle : un clic la met en marche ou à l'arrêt tout de suite, en Hysteresis, en tenant 150 °F. |
| **Current Method** | **Hysteresis** : en marche sous son Setpoint de 150 °F, arrêtée à celui-ci. |
| **Hardware Controller** | **Optical SSR**, donc son Offset de -1 °F est dans la plage (-0.5 à -3 °F, Règle 6.29). |
| **Enabled** et **Control Method** | Hysteresis, avec Duty Cycle et PID activés aussi : quatre bulles, Direct, Duty Cycle, Hysteresis et PID. |
| **Temperature Probe** | `BM_700_TEMP@1W_HLT_BH`, la sonde DS18B20 intégrée à la même cuve. |
| **Setpoint** | **150** °F. |
| **Offset (-)** | **-1** : elle se met en marche à 149 °F (150 - 1) et s'arrête à 150 °F. |
| **On delay** | **0** seconde (un Optical SSR) ; un contacteur ou un relais mécanique demande au moins 10. |
| **Predictive** | Activé : si l'eau continue de chauffer d'un demi-degré après l'arrêt, elle s'arrête un demi-degré sous 150 °F. |

Un Process appelle un Device intégré à un Vessel Device par le nom de la cuve et le sien :

```
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.setpoint = 168
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.method = "PID"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = on
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.display = "Setpoint"
```

Ces lignes règlent la consigne à 168, passent la méthode en PID, mettent la résistance en marche et affichent sa consigne.

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)
