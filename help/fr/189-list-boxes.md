# Listes déroulantes {#list-boxes-dropdowns}

Une **list box** (aussi appelée **dropdown** ou **liste déroulante**) est une case avec un petit ▼ au bout à droite. Cliquez dessus et une
liste de choix s'ouvre ; cliquez sur un choix et il est choisi. Skynet utilise une liste déroulante partout où il y a **plus de deux réponses**
(un simple Oui / Non est un interrupteur à la place, Règle 2.5).

## En quelques mots {#in-a-few-words}

- **Cliquez** sur la case (ou appuyez dessus sur un téléphone) pour ouvrir la liste, puis **cliquez sur un choix** pour le choisir.
- **Tapez une lettre** pour sauter au choix qui commence par elle. Chaque choix d'une liste Skynet commence par sa propre première
  lettre, donc une lettre suffit : dans la liste **Overlay** de l'HLT element, **R** choisit **Red Glow**, **O** choisit **Orange Glow**.
- **Tapez un nom vite** (touches à moins d'environ une seconde d'écart) pour sauter au premier choix qui commence par ces lettres :
  dans la liste **Temperature Probe** de l'HLT element, taper **BM_700** saute à **BM_700_TEMP@1W_HLT_BH**.
- Les **flèches haut et bas** déplacent d'un choix à la fois. **Entrée** ou **Tab** le garde et passe à la case suivante.
- Le choix actuel a un fond **Cyan** quand la liste est ouverte (Règle 2.34).
- **➕ Add new ...** à la fin d'une liste crée un nouveau choix. La fenêtre attend, la nouvelle chose est créée dans sa propre fenêtre, puis vous
  revenez avec elle choisie et rien de ce que vous aviez tapé n'est perdu (Règle 18.14).
- **Double-cliquez** sur une liste déroulante qui choisit un Device, un Widget, un Tab, une cuve ou un IP pour ouvrir les Properties de celui choisi (Règle 2.19).
- **Posez la souris sur le nom** devant la liste déroulante pour son Hover Help. La liste elle-même ne montre jamais de bulle, donc
  l'aide ne cache jamais un choix (Règle 2.38).

## Comment une liste déroulante est remplie {#how-a-list-box-is-filled}

Chaque liste déroulante tire ses choix d'un de ces trois endroits :

| D'où viennent les choix | Exemple dans l'exemple 3 Vessel 1 Pump | Pouvez-vous en ajouter ? |
|---|---|---|
| **Intégrés à Skynet** (une liste fixe avec laquelle Skynet lui-même travaille) | La **Current Method** de l'HLT element : Direct, Duty Cycle, Hysteresis, PID ... | Non |
| **Votre Schema** (les Devices, Widgets, Tabs et Interfaces que vous avez créés) | La **Temperature Probe** de l'HLT element : BM_700_TEMP@1W_HLT_BH, BM_701_TEMP@1W_Mash_BH, BM_702_TEMP@1W_Kettle_BH | Oui : ➕ Add new ... en crée un nouveau |
| **Une liste qui grandit** (images, Styles, unités, couleurs ...) | La liste des Tabs : **BH: Brew House**, puis **➕ Add new Tab…** | Oui : ce que vous ajoutez reste dans la liste pour la fois suivante |

- Les noms sont listés **de A à Z**, donc BM_700 vient avant BM_701.
- Les Interfaces et les Tabs se lisent **ID: Name**, par exemple **BM: Brewery Mega** et **BH: Brew House** (Règle 18.17).
- Chaque choix est **court et en anglais simple** ; ce que fait un choix est dans le Hover Help (Règle 2.38).

## Comment les choix sont limités {#how-the-choices-are-limited}

Une liste déroulante ne propose que ce qui peut aller là. Vous n'avez jamais à faire défiler des choses qui ne marcheraient pas.

- **Par sorte :** la liste **Temperature Probe** de l'HLT element ne contient que des sondes de température, jamais une pompe ni une vanne.
- **Par carte :** une cuve avec un Device de chauffe choisi ne propose que les sondes de température de **la même carte** que ce Device de chauffe.
- **Par ce qui est libre :** la liste **Available Ports** d'un nouveau Device ne montre que les ports de cette Interface qui ne sont pas encore utilisés.
- **Jamais proposés :** les Clones d'un Device (utilisez le nom du Device lui-même) et les clés cachées.

### Taper BM_ pour ne voir que les Devices d'une carte {#typing-bm-to-see-only-one-board-s-devices}

Chaque nom de Device commence par son **Interface ID** (Règle 3.1) : `BM_8_DO@H_Element_HLT~element_BH` est sur **BM: Brewery Mega**,
port 8. Donc quand les Suggested Names sont utilisés, les premières lettres d'un nom disent sur quelle carte est un Device.

- **Dans l'éditeur de Process** (Predictive Text, aide 79), taper **BM_** montre **seulement** les noms qui commencent par BM_, c'est-à-dire
  seulement les Devices sur la Brewery Mega. Chaque lettre de plus réduit encore : **BM_70** ne laisse que les trois sondes.
- **Dans la liste déroulante d'une fenêtre**, taper **BM_** vite **saute** au premier choix qui commence par BM_. Les autres choix
  sont toujours dans la liste ; ils ne sont pas cachés.

Si vous ajoutez une seconde carte, par exemple une carte de fermenteur avec l'ID **FM**, taper **FM_** trouve ses Devices de la même façon.
Un nom que vous avez tapé vous-même (pas le Suggested Name) peut ne pas commencer par un Interface ID, donc il n'est pas trouvé ainsi.

## Le côté technique {#the-technical-side}

- Une liste déroulante est la case `<select>` propre au navigateur, donc elle a un aspect un peu différent sous Windows, Mac, Android et iPhone. Sur un
  iPhone ou un iPad elle s'ouvre comme une roue qui tourne et le fond Cyan ne s'affiche pas (Règle 2.35 : les téléphones et tablettes servent à
  faire tourner la brasserie, pas à la construire).
- Derrière chaque liste, il y a une liste de paires : le **texte** que vous voyez et la **valeur** qui est enregistrée. Un Process lit la valeur
  (Règle 2.6). Pour un Device, la valeur est son nom ; pour une liste intégrée, c'est un mot court ou un nombre.
- Sauter en tapant est fait par le navigateur : une lettre (ou la même lettre encore) passe d'un choix à l'autre parmi ceux qui commencent par elle ;
  les lettres tapées à moins d'environ une seconde d'écart sont cherchées comme un seul mot, comparé au **début** du texte du choix.
  Là où un choix montre d'abord un Label (par exemple **HLT: BM_700_TEMP@1W_HLT_BH**), tapez les lettres du Label.
- La liste de l'éditeur de Process est la liste propre à Skynet (aide 79). Elle compare le début d'un nom, ou n'importe quelle partie après un `_`
  une fois deux lettres tapées (`Pump` trouve `BM_22_DO@Pump_Pump_BH`). Un `_` que vous tapez fait partie de la comparaison, donc **BM_** ne
  trouve que les noms qui commencent par BM_.
- Ce que vous ajoutez à une liste qui grandit est enregistré avec le Schema sur le Brain, donc c'est dans la liste la fois suivante, sur chaque ordinateur
  ou téléphone qui ouvre ce Schema.
