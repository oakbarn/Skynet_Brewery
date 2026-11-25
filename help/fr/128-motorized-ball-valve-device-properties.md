# Properties du Device Motorized Ball Valve {#motorized-ball-valve-device-properties}

Ajouter une **Motorized Ball Valve** (vanne à bille motorisée) se fait comme ajouter une pompe (voir [Properties du Device Pump (le détail)](115-pump-device-properties)),
avec une différence : **une vanne n'a pas de Cover**. (Règle Skynet 18.23)

Chaque fenêtre ici suit le Blichmann Model, comme la pompe : le titre et les boutons restent en haut pendant que le reste
défile, il n'y a pas de rangée de boutons en bas, et chaque fenêtre ⬢ ou ⬆ a **💾 Keep**, **Close** et **✕** en haut (Rule 2.54). (Règle Skynet 18.41)

## Ajouter une Motorized Ball Valve {#adding-a-motorized-ball-valve}

1. En Edit layout, cliquez sur **Valves > Motorized Ball Valve, open / closed (relay)** (elle est aussi dans la liste **On/Off**).
2. **Choisissez la vanne.** Chacune a son image :
   - **Skynet Motorized Ball Valve** : le dessin Skynet (actionneur bleu). Son image est fixée.
   - **➕ New User Defined Motorized Ball Valve** : fait une nouvelle vanne avec vos propres images, et vous réglez où sont ses IP In
     et Out. Elle ne choisit pas une vanne faite avant : pour montrer aussi sur un autre Tab une vanne déjà sur un Tab, utilisez **⧉ Clone Device**.
3. La fenêtre Add s'ouvre avec le nom de la vanne comme titre. Son **Label** est déjà rempli avec **mBV_1**, mBV_2 ... (le numéro
   suivant), donc le curseur commence sur les **Available Ports**. Vous pouvez changer le Label, mais il ne peut pas être vide. Remplissez dans l'ordre : 1 le
   **Label** (le ⬢ à côté règle sa police et ses couleurs) et **Label Visible**, 2 l'**Interface** (la carte) et un **Available Port** sur la même ligne, 3 le **Tab**.
   Puis le **Suggested Name** s'affiche, fait à partir d'eux, avec le reste :
   - **Valve Profile** (la vanne User Defined seulement) : les images, l'Orientation et l'Overlay avec lesquels elle commence. Celui marqué
     Default est choisi ; il y a toujours un Default Valve Profile (☰ Menu > Valve Profile).
   - **Graphic** : la vanne telle qu'elle s'affichera sur le Tab, fermée, tournée selon son Orientation.
   - **Path** : le fichier de l'image.
   - **Orientation** et, sur la même ligne, **Toggle** : comment la vanne se tient (le Graphic et ses IP tournent avec elle), et ce que
     fait un appui (On/Off l'ouvre ou la ferme d'un clic).
   - **Overlay** : dessiné par-dessus tant que la vanne est ouverte (l'éclair fixe rouge et jaune). Sur la même ligne,
     **Database and .API ⬢** ouvre ses réglages (aide 98).
   - **Tap water valve**, **On Close List** et **On Open List** sur une ligne (les deux listes activées au départ).
   - **X**, **Y**, **Width** et **Height** sur une ligne, et le **Device Type** grisé.
   **Entrée** va seulement entre le **Label** et les **Available Ports** ; sur un Port choisi, elle vous demande de **Confirm**
   l'Interface et le Port (ou de revenir avec **◀ Back**). La **touche Tab** passe par chaque case, la dernière revenant à la première ;
   l'Interface et le Tab se changent avec la touche Tab ou la souris. Une fois Confirmed, le reste s'ouvre avec le curseur sur l'**Orientation**. Si **➕ Add Device**
   a l'air pâle, appuyez quand même : il vous dit ce qui manque encore.
4. Appuyez sur **➕ Add Device**. La vanne est faite sur le 🔨 [Build Tab](55-build-tab) et ses Properties s'ouvrent ; **✅ Finish Build ...** la déplace vers le Tab que vous avez choisi. L'**Interface** et le **Port** sont maintenant
   grisés et fixés : c'est le câblage, ils restent donc tels quels. Pour la câbler à une autre carte ou une autre broche, supprimez-la et ajoutez-la à nouveau. Son Name peut toujours être changé avec **✏ Change name**.

## Le Label {#the-label}

Comment appelez-vous cette vanne ? Mash Valve, HLT Valve, Fermenter Valve ...? Utilisez votre nom pour la vanne comme Label. Le
Sample Schema d'OakBarn Brewery a plusieurs vannes. Quand OakBarn brasse, il peut crier « Ferme la Mash Valve » pour arrêter le
débit. Les fermenteurs sont dans une autre pièce et, quand ils sont pleins à vue, le Brewmeister crie « Ferme la Fermenter Valve »
à sa charmante assistante, qui clique alors la Fermenter Valve sur Closed.

![Label Visible](help_pictures/Label_Visible_Switch.png)

Le Label peut être affiché sur le Tab, par exemple Mash Valve au-dessus du Device de vanne.

![Mash Valve : le Label au-dessus de la vanne](help_pictures/Mash_Valve_Label.png)

C'est la partie en texte simple du Suggested Name. Les espaces deviennent ~.
BM_15_DO@Valve_E_**Mash~Valve**_BH

## L'Interface {#the-interface}

La carte Arduino à laquelle ce Device Valve est raccordé. Une Interface a un nom et un ID. L'ID est donné par vous quand une
Interface est raccordée. L'Interface fait partie du pont entre le « Brain » et votre Mash Valve. Le « Brain » ne peut pas fournir
le courant de la vanne (12 V DC, 24 V ou 120 VAC) mais seulement un signal de déclenchement. Il faut d'autres pièces de matériel,
et pas une seule. Il y a une chaîne (Daisy Chain) :

![La chaîne : Brain, Arduino, relais ou SSR, Mash Valve](help_pictures/Valve_Daisy_Chain.png)

> **⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.** (Règle 6.20)

Brain -> Arduino IO (Port) -> déclenchement (le Brain dit d'ouvrir la Mash Valve) -> signal de 5 V ou 3,3 V envoyé au -> relais
ou SSR (branchez ici le courant de la vanne : 12 V DC, 24 V ou 120 VAC) -> la vanne reçoit le courant et s'ouvre

Les bulles Interface, Available Ports, Tab, Name et Device Type sont celles de la pompe ([Properties du Device Pump](115-pump-device-properties)),
avec la vanne dans les exemples : **Mash Valve**, Device Type **DO@Valve_E** (une vanne électrique sur un Digital Out), et le Suggested
Name **BM_15_DO@Valve_E_Mash~Valve_BH**. (Règle Skynet 18.42)

## Properties, du haut vers le bas {#properties-from-the-top}

1. Le titre est la vanne (**Skynet Motorized Ball Valve** ou **User Defined Motorized Ball Valve**), avec le **cadenas 🔓**,
   **Visible** et **Hidden Locked** à côté, tous sur une ligne. Puis **Delete · Save · Close · ✕**, qui restent dans le coin en haut à droite (Rule 2.54).
2. **1. Label ⬆ ⬢** et **Label Visible**. Un Label n'est jamais vide : laissez-le vide et il devient le Name.
3. **2. Interface** et **Available Ports**, grisés (la carte et la broche auxquelles elle est câblée).
4. **3. Tab**, **Layer Order** et **4. Name** (le Suggested Name ; vous pouvez taper le vôtre).
5. **Graphic** et **Path**, puis **Orientation** et **Toggle** sur une ligne (comme sur la pompe).
6. **Overlay** avec **Database and .API ⬢**.
7. Les réglages propres à la vanne : **Tap water valve**, **On Close List** et **On Open List**, tous les trois sur une ligne (voir [Vannes d'eau du robinet](31-tap-water-valves)).
   On Close List : `close_all_valves` dans un Process la ferme. On Open List : `open_all_valves` l'ouvre. Une vanne d'eau du robinet montre son
   **Tap Water flows** (sens de l'eau du robinet) à la place, et est toujours sur la Close List et jamais sur l'Open List ; les boutons de ces deux interrupteurs montrent alors le signe Sens interdit ⛔ (ils ne peuvent pas être changés).
8. **X (Horizontal)**, **Y (Vertical)**, **Width** et **Height** sur une ligne, et le **Device Type** grisé (**DO@Valve_E** : une vanne électrique, Valve_E, sur une sortie numérique, DO ; le même DO@Valve_E est dans son Suggested Name).

Le Suggested Name suit le format de nommage (Règle 3.1) : Interface ID, Port, `Valve_E`, Label, ID du Tab, comme
`22_E_Valve_E_MBV1__BR`. Les vannes ajoutées avant le 2026-11-05 gardent leurs noms `E_L_Vlv` (les noms ne changent jamais tout seuls, Règle 3.5).

## Skynet ou User Defined {#skynet-or-user-defined}

| | Skynet Motorized Ball Valve | User Defined Motorized Ball Valve |
|---|---|---|
| Path | grisé : fixé par son Template Skynet, suit l'Orientation | **Path** : votre image, une seule image dessinée Horizontal (l'Overlay la montre ouverte). Skynet la tourne et la retourne pour les autres Orientations. Le ⬢ à côté de Path règle où sont les IP In et Out. **Path (open)** ne s'affiche que sur une vanne qui a déjà une image ouverte |
| Orientation | Horizontal, Vertical Left, Vertical Right (Front et 45 degrees ne s'affichent que sur une vanne déjà posée ainsi) | Horizontal, Horizontal Flipped, Vertical Left, Vertical Right, toutes faites à partir de votre seule image (Vertical simple et les 45 ne s'affichent que sur une vanne déjà posée ainsi) |
| Toggle et Overlay | à vous de choisir (ils commencent à On/Off et à l'éclair fixe) | à vous de choisir |
| Width et Height | la taille de son Template pour chaque Orientation | 150 x 150 au départ |

Les réglages que ces fenêtres ne montrent plus (Invert, One-shot, Text when on / off, Flip, Service) sont gardés si une vanne les avait déjà.

## Une image, quatre vues (User Defined) {#one-picture-four-looks-user-defined}

Donnez à la User Defined Motorized Ball Valve **une seule image**, dessinée **Horizontal** : le tuyau de gauche à droite et le
moteur en haut. Skynet en fait les autres vues, vous n'avez donc jamais besoin d'une deuxième image. (Règle Skynet 18.43)

| Orientation | Ce que Skynet fait de votre image |
|---|---|
| **Horizontal** | la montre comme vous l'avez dessinée |
| **Horizontal Flipped** | la retourne de haut en bas (moteur sous le tuyau) |
| **Vertical Left** | la tourne de 90 degrés (moteur à gauche) |
| **Vertical Right** | la tourne de 90 degrés et la retourne de gauche à droite (moteur à droite) |

Le fichier de votre image n'est jamais changé ; il est seulement dessiné tourné ou retourné. Les IP In et Out suivent la vue.

**Quelle image marche le mieux :**

- Un fond uni ou transparent.
- La vanne vue bien de face par le côté, le tuyau à plat au milieu.
- Pas d'écriture ni de logo dessus : en la retournant, l'écriture serait à l'envers.
- N'importe quelle taille : elle est ajustée dans la boîte carrée de la vanne. Utilisez le ⬢ à côté de **Path** pour régler où
  sont les bouts du tuyau, s'ils ne sont pas au milieu des côtés gauche et droit.
