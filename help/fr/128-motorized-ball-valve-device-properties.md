# Properties du Device Motorized Ball Valve {#motorized-ball-valve-device-properties}

Ajouter une **Motorized Ball Valve** (vanne à bille motorisée) se fait comme ajouter une pompe (voir [Pump Device Properties](115-pump-device-properties)),
avec une différence : **une vanne n'a pas de Cover**. (Règle Skynet 18.23)

## Ajouter une Motorized Ball Valve {#adding-a-motorized-ball-valve}

1. En Edit layout, cliquez sur **Valves > Motorized Ball Valve, open / closed (relay)** (elle est aussi dans la liste **On/Off**).
2. **Choisissez la vanne.** Chacune a son image :
   - **Skynet Motorized Ball Valve** : le dessin Skynet (actionneur bleu). Son image est fixée.
   - **User Defined Motorized Ball Valve** : vos propres images, et vous réglez où sont ses IP In et Out.
3. La fenêtre Add s'ouvre avec le nom de la vanne comme titre. Son **Label** est déjà rempli avec **mBV_1**, mBV_2 ... (le numéro
   suivant), donc le curseur commence sur le champ vide suivant. Vous pouvez changer le Label, mais il ne peut pas être vide. Remplissez dans l'ordre : 1 le
   **Label** (le ⬢ à côté règle sa police et ses couleurs) et **Label Visible**, 2 l'**Interface** (la carte) et un **Available Port** sur la même ligne, 3 le **Tab**.
   Puis le **Suggested Name** s'affiche, fait à partir d'eux, avec le reste :
   - **Graphic** : la vanne telle qu'elle s'affichera sur le Tab, fermée, tournée selon son Orientation.
   - **Path** : le fichier de l'image.
   - **Orientation** et, sur la même ligne, **Toggle** : comment la vanne se tient (le Graphic et ses IP tournent avec elle), et ce que
     fait un appui (On/Off l'ouvre ou la ferme d'un clic).
   - **Overlay** : dessiné par-dessus tant que la vanne est ouverte (l'éclair fixe rouge et jaune). Sur la même ligne,
     **Database and .API ⬢** ouvre ses réglages (aide 98).
   - **Tap water valve**, **On Close List** et **On Open List** sur une ligne (les deux listes activées au départ).
   - **X**, **Y**, **Width** et **Height**, et le **Device Type** grisé.
   **Entrée** vous fait passer par Label, Interface, Available Ports, Tab, Orientation, puis **➕ Add Device**. Si **➕ Add Device**
   a l'air pâle, appuyez quand même : il vous dit ce qui manque encore.
4. Appuyez sur **➕ Add Device**. La vanne est faite sur le 🔨 [Build Tab](55-build-tab) et ses Properties s'ouvrent ; **💾 Save Build ...** la déplace vers le Tab que vous avez choisi. L'**Interface** et le **Port** sont maintenant
   grisés et fixés : c'est le câblage, ils restent donc tels quels. Pour la câbler à une autre carte ou une autre broche, supprimez-la et ajoutez-la à nouveau. Son Name peut toujours être changé avec **✏ Change name**.

## Properties, du haut vers le bas {#properties-from-the-top}

1. Le titre est la vanne (**Skynet Motorized Ball Valve** ou **User Defined Motorized Ball Valve**), avec le **cadenas 🔓**,
   **Visible** et **Hidden Locked** à côté. Puis **Delete**, **Cancel** et **Save**.
2. **1. Label ⬆ ⬢** et **Label Visible**. Un Label n'est jamais vide : laissez-le vide et il devient le Name.
3. **2. Interface** et **Available Ports**, grisés (la carte et la broche auxquelles elle est câblée).
4. **3. Tab** et **4. Name** (le Suggested Name ; vous pouvez taper le vôtre).
5. **Graphic** et **Path**, puis **Orientation** et **Toggle** sur une ligne (comme sur la pompe).
6. **Overlay** avec **Database and .API ⬢**.
7. Les réglages propres à la vanne : **Tap water valve**, **On Close List** et **On Open List**, tous les trois sur une ligne (voir [Tap water valves](31-tap-water-valves)).
   On Close List : `close_all_valves` dans un Process la ferme. On Open List : `open_all_valves` l'ouvre. Une vanne d'eau du robinet montre son
   **Tap end** (bout robinet) à la place, et est toujours sur la Close List et jamais sur l'Open List.
8. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, et le **Device Type** grisé (**DO@Valve_E** : une vanne électrique, Valve_E, sur une sortie numérique, DO ; le même DO@Valve_E est dans son Suggested Name).

Le Suggested Name suit le format de nommage (Règle 3.1) : Interface ID, Port, `Valve_E`, Label, ID du Tab, comme
`22_E_Valve_E_MBV1__BR`. Les vannes ajoutées avant le 2026-11-05 gardent leurs noms `E_L_Vlv` (les noms ne changent jamais tout seuls, Règle 3.5).

## Skynet ou User Defined {#skynet-or-user-defined}

| | Skynet Motorized Ball Valve | User Defined Motorized Ball Valve |
|---|---|---|
| Path | grisé : fixé par son Template Skynet, suit l'Orientation | **Path (closed)** et **Path (open)** : vos images. Le ⬢ à côté de Path (closed) règle où sont les IP In et Out |
| Orientation | Horizontal, Vertical Left, Vertical Right, Front, 45 degrees | Horizontal, Vertical, 45 degrees Left, 45 degrees Right |
| Toggle et Overlay | à vous de choisir (ils commencent à On/Off et à l'éclair fixe) | à vous de choisir |
| Width et Height | la taille de son Template pour chaque Orientation | 150 x 150 au départ |

Les réglages que ces fenêtres ne montrent plus (Invert, One-shot, Text when on / off, Flip, Service) sont gardés si une vanne les avait déjà.
