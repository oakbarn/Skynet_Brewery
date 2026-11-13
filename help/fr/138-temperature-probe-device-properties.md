# Properties du Device sonde de température {#temperature-probe-device-properties}

Ajouter une **Temperature Probe** se fait comme pour une pompe (voir [Properties du Device Pump (le détail)](115-pump-device-properties)).
Une sonde lit une température, donc elle n'a **ni Cover, ni Toggle, ni Overlay**. Ceci couvre toutes les sondes : une sonde simple, un **Thermowell**
(doigt de gant Short, Medium, Long) et un **té avec une sonde de température** (Instrument Tee ou Long Tee). (Règle Skynet 18.26)

## Ajouter une sonde {#adding-a-probe}

1. En Edit layout, cliquez sur **Probe** (ou la liste Add Device) et choisissez la **sorte de sonde** : DS18B20, PT100, PT1000, un
   thermocouple, une thermistance NTC, LM35 ou TMP36. Pour un **Thermowell** ou un **té à sonde**, choisissez-le d'abord, puis l'étape **2a**
   demande la sorte de sonde qu'il contient. La sorte de sonde est toujours choisie en premier.
2. La case d'ajout s'ouvre avec la sonde comme titre, par exemple **Short Thermowell: DS18B20**. Son **Label** est déjà rempli
   selon sa sorte de sonde, en **tP_Type_n** (le numéro suivant pour cette sorte) : **tP_1W_1** (DS18B20), **tP_RTD_1** (PT100 ou PT1000),
   **tP_TC_1** (thermocouple), **tP_10KNTC_1**, **tP_50KNTC_1**, **tP_100KNTC_1** (thermistances NTC), **tP_LM35_1**, **tP_TMP36_1**,
   donc le curseur commence sur le champ vide suivant. Vous pouvez changer le Label, mais il ne peut pas
   être vide. Remplissez dans l'ordre : 1 le **Label** (le ⬢ à côté règle sa police et ses couleurs) et **Label Visible**, 2 l'
   **Interface** (la carte) et, sur la même ligne, le **Port** : le **Probe #** pour une DS18B20 (son numéro de sonde OneWire), ou un
   **Available Port** (la broche de sélection d'une carte RTD ou thermocouple, la broche analogique d'une NTC, LM35 ou TMP36), 3 le **Tab**.
   Ensuite le **Suggested Name** s'affiche, fait à partir d'eux, avec le reste :
   - **Graphic** et **Path** (un Thermowell ou un té à sonde) : le dessin Skynet tel qu'il s'affichera sur le Tab. Le Path est fixé.
   - **Orientation** et, sur la même ligne, **Flip** (un Thermowell ou un té à sonde) : tournez-le de 90, 180 ou 270 degrés et retournez-le.
     Le Graphic et ses IP tournent avec lui.
   - **Probe type**, grisé : la sorte choisie. Le **⬢** à côté contient ses réglages (fils et résistance de référence d'une
     RTD, type de thermocouple, valeurs de la thermistance, tension de la carte, réglages du simulateur).
   - **Units** (°F ou °C) et **Decimals** sur une ligne.
   - **Display** : comment la lecture s'affiche sur son Tab : un **Number**, des **LCD digits**, des **LED digits** ou le **Skynet Dial** ; le ⬢ à côté contient les réglages du cadran ([Le cadran Skynet et les chiffres du minuteur](152-skynet-dial-and-timer-digits)).
   - **Calibration offset** (ajouté à chaque lecture) et, sur la même ligne, **Database and .API ⬢** (aide 98).
   - **X**, **Y**, **Width** et **Height**, et le **Device Type** grisé (par exemple **TEMP@1W** : une sonde DS18B20, 1W, sur un port de température, TEMP ; le même TEMP@1W est dans son Suggested Name).
   **Entrée** vous fait passer par Label, Interface, Port, Tab, Orientation, puis **➕ Add Device**. Si **➕ Add Device** paraît pâle,
   appuyez quand même : il vous dit ce qui manque encore.
3. Appuyez sur **➕ Add Device**. La sonde est créée sur le 🔨 [Build Tab](55-build-tab) et ses Properties s'ouvrent ; **💾 Save Build ...** la déplace sur le Tab choisi. L'**Interface** et le **Port** sont maintenant
   grisés et fixés : c'est le câblage. Pour la câbler à une autre carte ou broche, ou utiliser une autre sorte de sonde, supprimez-la et ajoutez-la
   de nouveau. Son Name peut encore être changé avec **✏ Change name**.

## Properties, de haut en bas {#properties-from-the-top}

1. Le titre est la sonde (par exemple **Long Tee, probe in the branch: PT100 RTD**), avec le **cadenas 🔓**, **Visible** et
   **Hidden Locked** à côté. Puis **Delete**, **Cancel** et **Save**.
2. **1. Label ⬆ ⬢** et **Label Visible**. Un Label n'est jamais vide : laissez-le vide et il devient le Name.
3. **2. Interface** et son **Port**, grisés.
4. **3. Tab** et **4. Name** (le Suggested Name ; vous pouvez taper le vôtre).
5. **Graphic**, **Path**, **Orientation** et **Flip** (un Thermowell ou un té à sonde).
6. Les réglages propres à la sonde : **Probe type ⬢**, **Units** et **Decimals**, **Calibration offset** avec **Database and .API ⬢**,
   et la **Reading now** (lecture actuelle, pour aider à étalonner).
7. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, et le **Device Type** grisé.

Un Thermowell s'accroche toujours à un IP, s'affiche de face sur un IP tourné vers l'avant, et un té à sonde coupe toujours un tuyau comme le fait un té
(voir [Tés à sonde et doigts de gant sur les tuyaux](132-probe-tees-and-thermowells-on-pipes)). Une sonde qui fait partie d'un RIMS tube ou d'une
Integrated Electric Kettle garde la fenêtre de ce Device.
