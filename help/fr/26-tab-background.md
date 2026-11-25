# Tab Settings

**⚙ Tab Settings** contient tout ce qui concerne un Tab : son nom et son Tab ID, son fond, son aspect, sa taille et ses tuyaux. La fenêtre ne s'ouvre que tant que **Edit layout** est actif, et seul un **Admin** peut la changer. L'exemple est le Tab **Brew House** (Tab ID **BH**) de l'exemple 3 Vessel 1 Pump.

Chaque case a un nom court. Laissez la souris sur le nom (souligné en pointillés) pour voir son aide au survol (Hover Help) ; sur un téléphone ou une tablette, touchez le nom. Les mots ci-dessous sont les mêmes que ceux de l'aide au survol.

## L'ouvrir {#open-it}

Sur un PC ou un Mac :

1. Cliquez sur le Tab que vous voulez changer (son bouton en haut).
2. Activez **Edit layout** (le bouton bleu Edit layout à côté de **☰ Menu**). Une barre de boutons en pointillés apparaît.
3. Ouvrez **⚙ Tab Settings** de l'une de ces façons :
   - appuyez sur **⚙ Tab settings** dans la barre en pointillés, ou
   - **double-cliquez sur un endroit vide** du Tab (pas sur une pompe, une vanne ou un tuyau), ou
   - double-cliquez sur le nom du Tab en haut.

Sur un iPhone, un iPad ou un téléphone Android : activez Edit layout, puis **gardez le doigt sur un endroit vide** du Tab pendant environ une demi-seconde, ou touchez **⚙ Tab settings** dans la barre en pointillés.

Quand vous avez fini, appuyez sur **💾 Save** en haut de la fenêtre, puis sur **Save layout** dans la barre en pointillés.

## Les boutons et les touches {#the-buttons-and-the-keys}

- **🗑 Delete**, **✖ Cancel** et **💾 Save** restent en haut pendant que le reste de la fenêtre défile ; il n'y a pas de deuxième rangée en bas. Delete supprime le Tab et tout ce qu'il contient (il demande d'abord ; il n'est pas là quand c'est le seul Tab). Cancel demande d'abord quand quelque chose a été changé.
- Le **Name** a le focus quand la fenêtre s'ouvre sur un nouveau Tab. Le Name d'un Tab enregistré est verrouillé (⛔ Name 🔒), alors c'est la **Color** qui a le focus.
- La touche **Entrée** va seulement entre le **Name** et le **Tab ID** (un nouveau Tab). Entrée sur un Name vide y reste. Depuis toute autre case, Entrée revient au Name.
- La touche **Tab** passe par toutes les cases, de la dernière à la première. Le ? (aide), Delete, Cancel et Save sont pour la souris.
- Un Name vide, ou un Tab ID qui ne peut pas servir, bloque seulement **Save** : une petite fenêtre ⚠ dit pourquoi, la case reçoit le focus, et la fenêtre ⚠ disparaît d'elle-même après 2 secondes. Tout le reste reste accessible.

## Name et Tab ID {#name-and-tab-id}

| Case | Ce qu'elle fait |
|---|---|
| **Name** | Le nom de ce Tab, affiché sur son bouton en haut du panel, par exemple Brew House. Chaque Tab a besoin de son propre nom, et il ne peut pas être vide. Le nom d'un Hidden Tab commence toujours par Hidden_. Renommer un Tab est sans risque : tout ce qu'il contient le suit, et les Suggested Names de ses Devices utilisent le Tab ID, pas le nom. Un Tab enregistré montre 🔒 et **✏ Change name**. |
| **Tab ID** | Un code court pour ce Tab, par exemple BH pour Brew House. Il vient en premier dans chaque liste de Tabs (BH: Brew House) et en dernier dans le Suggested Name de chaque Device de ce Tab (..._BH). Skynet en propose un unique, et il suit le Name jusqu'à ce que vous tapiez le vôtre. Le Tab ID suit la Règle 3.2. Vérifiez-le avant Save. Une fois enregistré, il est grisé. |

## Background

| Case | Ce qu'elle fait |
|---|---|
| **Copy Profile** | Choisissez un Tab Profile à copier sur ce Tab quand vous faites Save : sa couleur de fond va dans Color, et son aspect (couleurs et style de valeur) devient l'aspect de départ d'un nouveau Device ou Widget de ce Tab. None = rien n'est copié. Les Profiles se font dans ☰ Menu > Tab Profile ([Tab, Valve and Pump Profiles](36-tab-and-valve-profiles)). C'est une copie, pas un lien (Règle Skynet 2.62) : changer ou supprimer le Profile plus tard ne change jamais ce Tab. |
| **Color** | La couleur derrière tout ce qui est sur ce Tab. Elle se voit partout où la Picture ne couvre pas. Default = la couleur normale du panel. None = aucune couleur. Custom ouvre le Color Picker pour une couleur à vous, et sa case **Color (RGB)** s'affiche en dessous. Un Tab Profile choisi dans Copy Profile copie sa couleur ici quand vous faites Save. |
| **Picture** | Une image derrière tout ce qui est sur ce Tab. Choisissez les images Skynet ou les vôtres, un groupe, puis l'image. Seules les images Skynet du dossier Tab Background sont listées ici (il n'y en a pas encore, donc la liste commence sur Both et montre les vôtres). None = aucune image. Add new ... prend le nom d'une autre image dans media/Images ; la page [File Move](32-file-move) y copie une image depuis votre ordinateur. La Color se voit partout où l'image ne couvre pas. |
| **Picture Left** / **Picture Top** | Où vont le bord gauche et le bord haut de la Picture, en pixels depuis la gauche et le haut du Tab. |
| **Picture Width** / **Picture Height** | La largeur et la hauteur de la Picture, en pixels. |

Laissez Picture Left, Top, Width et Height tous vides pour étirer la Picture sur tout le Tab ; remplissez-les pour la mettre à un endroit et une taille précis.

## Look

| Case | Ce qu'elle fait |
|---|---|
| **Tab Style** | Le Tab Style : les couleurs, polices et tailles des Labels, Devices et Widgets de ce Tab. Default = le Tab Style choisi dans ☰ Menu > Default settings. Un Device ou un Widget qui a sa propre couleur, police ou taille la garde ; seuls les autres prennent le Tab Style. Les Skynet Styles 🔒 ne peuvent jamais être changés. ➕ Add new User Style… crée le vôtre, et ✏ Edit le change ([Tab Styles](101-tab-styles)). |

## Size

| Case | Ce qu'elle fait |
|---|---|
| **Width** | La largeur de ce Tab, en pixels. Vous pouvez taper n'importe quelle taille (200 à 20000), ou appuyer sur 🖥 Fit Screen plus bas pour suivre cet écran. Un nouveau Tab commence aussi large que l'écran sur lequel il est créé (1920 sur la plupart des écrans), sauf si ☰ Menu > Default settings donne une Largeur. |
| **Height** | La hauteur de ce Tab, en pixels. Vous pouvez taper n'importe quelle taille (200 à 20000), ou appuyer sur 🖥 Fit Screen plus bas pour suivre cet écran. Un nouveau Tab commence aussi haut que l'écran sur lequel il est créé, moins la barre des tâches (1040 sur la plupart des écrans), sauf si ☰ Menu > Default settings donne une Hauteur. |
| **Screen size : 🖥 Fit Screen** | Un clic met la Largeur et la Hauteur de ce Tab à la taille utile de CET écran (l'écran moins la barre des tâches), pour que tout le Tab remplisse l'écran au Zoom Fit screen, sans barres de défilement. Appuyez sur Save pour le garder. Vous pouvez toujours taper votre propre Largeur et Hauteur. Faites-le sur l'écran de l'ordinateur d'où vous brassez : un Tab réglé sur un petit portable est dessiné plus petit sur un grand écran. |
| **Vessel Sizer** | Le Master Vessel Sizer : choisissez une Vessel de ce Tab. Seule cette Vessel peut être redimensionnée, et toutes les autres Vessels du Tab la suivent à la même échelle. None = aucune Vessel ne peut être redimensionnée. Le Master montre 📏 dans Edit layout ([Vessel sizing](135-vessel-sizing)). |

## Pipes

| Case | Ce qu'elle fait |
|---|---|
| **Pipe Size** | L'épaisseur d'un tuyau de 1/2" dessiné sur ce Tab, en pixels. Un nouveau Tab commence à 10. Toutes les autres tailles de tuyau, les réductions et les raccords sont dessinés à l'échelle à partir de lui. |
| **Hose Size** | L'épaisseur d'un tuyau souple de 1/2" dessiné sur ce Tab, en pixels. Les tuyaux souples sont en général dessinés plus fins que les tuyaux. Un nouveau Tab commence à 6 (☰ Menu > Default settings). Toutes les autres tailles de tuyau souple sont dessinées à l'échelle à partir de lui. Vide = la Pipe Size, comme sur les Tabs faits avant qu'il y ait une Hose Size. |
| **Flow Color** | La couleur du flux dans chaque tuyau et tuyau souple de ce Tab. None = chaque tuyau garde sa propre Flow Color. Mash, Boil, Whirlpool et Ferment : un tuyau qui a sa propre Flow Color la garde. Tap, Strike et les couleurs simples : chaque tuyau la prend. Le flux d'une Tap Water Valve est toujours bleu, et le flux qui part d'une Vessel avec une Out Flow Color prend cette couleur. RGB ouvre le Color Picker ([Pipe and hose flow colors](116-pipe-and-hose-flow-colors)). |

## Le côté technique {#the-technical-side}

- Un Process règle la Flow Color avec `tab.flow_Color = Mash`, sur le Tab que l'écran montre ; `tab.flow_Color = None` la rend à Tab Settings.
- Les Devices, les Widgets et les Processes trouvent un Tab par sa clé cachée, qui ne change jamais, donc un nouveau Name ne casse jamais un lien.
- Pour mettre votre propre image sur le Brain, utilisez l'écran [Media](07-media) (dans le dossier `Images`) ; elle est ensuite dans la liste **Picture**. Une pompe, une vanne ou un autre élément a ses propres images (**.backpath**, **.backpath_2**, **.backpath_3**) : voir [Pictures on items](25-picture-paths).
