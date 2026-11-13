# Properties des Devices PWM et sortie analogique {#pwm-and-analog-out-device-properties}

Ajouter une **sortie PWM** ou une **sortie analogique** (0-10 V ou 4-20 mA) se fait comme pour une pompe (voir
[Pump Device Properties](115-pump-device-properties)), avec quelques différences : elle n'a **pas de Cover**, **pas d'Orientation** (elle n'a pas
de bouts de tuyau) et **pas de Toggle** (un appui ouvre la case où vous réglez son %). (Règle Skynet 18.25)

## Ajouter une sortie PWM ou analogique {#adding-a-pwm-or-analog-output}

1. En Edit layout, cliquez sur **PWM** (ou **Select Device Type > PWM / Analog out**) et choisissez **PWM output**, **Analog output 0-10 V**
   ou **Analog output 4-20 mA**. Les lignes **Pump speed** de la liste Pumps ouvrent la même case.
2. La case d'ajout s'ouvre avec le titre **Add PWM Output** ou **Add Analog Output**. Son **Label** est déjà rempli : **PWM_1** pour une sortie PWM, **4_20_1** pour une sortie analogique 4-20 mA, **0_10_1** pour une 0-10 V
   (le numéro suivant à chaque fois), donc le curseur commence sur le champ vide suivant. Vous pouvez le changer, mais il ne peut pas être vide. Remplissez dans l'ordre : 1 le **Label** (le ⬢ à côté règle
   sa police et ses couleurs) et **Label Visible**, 2 l'**Interface** (la carte) et un **Available Port** sur la même ligne (seules les
   broches PWM libres s'affichent), le **Device Type** (PWM au départ ; choisissez PWM@Pump, PWM@Fan ... si elle commande l'un d'eux), 3 le **Tab**.
   Ensuite le **Suggested Name** s'affiche, fait à partir d'eux, avec le reste :
   - **Graphic** : la sortie telle qu'elle s'affichera sur le Tab. Sans image elle affiche sa valeur (par exemple 45 %).
   - **Path** : le fichier image (facultatif). C'est la même image en marche et à l'arrêt.
   - **Overlay** : dessiné par-dessus tant que la sortie est au-dessus de 0 % (l'éclair rouge et jaune fixe). Sur la même ligne,
     **Database and .API ⬢** ouvre ses réglages (aide 98).
   - Une sortie PWM : **Start value (%)** et **Decimals** sur une ligne.
   - Une sortie analogique : **Signal** et **Units** sur une ligne, **Low value** et **High value** sur une ligne (sa valeur au signal le plus bas
     et le plus haut), puis **Decimals**.
   - **X**, **Y**, **Width** et **Height**.
   **Entrée** vous fait passer par Label, Interface, Available Ports, Device Type, Tab, puis **➕ Add Device**. Si **➕ Add Device**
   paraît pâle, appuyez quand même : il vous dit ce qui manque encore.
3. Appuyez sur **➕ Add Device**. La sortie est créée sur le 🔨 [Build Tab](55-build-tab) et ses Properties s'ouvrent ; **💾 Save Build ...** la déplace sur le Tab choisi. L'**Interface** et le **Port** sont maintenant
   grisés et fixés : c'est le câblage. Pour la câbler à une autre carte ou broche, supprimez-la et ajoutez-la de nouveau. Son Name peut encore être
   changé avec **✏ Change name**.

## Properties, de haut en bas {#properties-from-the-top}

- Le titre (**PWM Output Device Properties** ou **Analog Output Device Properties**) avec le cadenas 🔓, **Visible** et
  **Hidden Locked**, puis 🗑 Delete, ✖ Cancel, 💾 Save.
- **1. Label** ⬆ ⬢ et **Label Visible** ; **2. Interface** avec **Available Ports** (grisés) ; **3. Tab** ;
  **4. Name** et le Suggested Name.
- **Graphic**, **Path**, **Overlay** avec **Database and .API ⬢**.
- Ses propres réglages : Start value et Decimals (PWM), ou Signal, Units, Low value, High value et Decimals (analogique).
- **X**, **Y**, **Width**, **Height**, et le **Device Type** en dernier.

Une vanne proportionnelle et le PWM d'une résistance chauffante gardent leurs propres fenêtres.
