# L'éditeur de Processes {#the-process-editor}

L'écran **Processes** a une rangée d'outils au-dessus de l'éditeur : **Find**, **All Processes**, **Go to line**, **Save to file**, l'interrupteur **Colors** et le **Color key** (légende des couleurs). Le bouton **Recycle Bin** (corbeille) est sous la liste des Processes.

## Numéros de ligne et Go to line {#line-numbers-and-go-to-line}

Chaque ligne a son numéro sur le côté gauche. Un numéro rouge est une ligne qui a un problème, un vert est la ligne où en est un Process en marche.

Pour sauter à une ligne, appuyez sur **Go to line** (ou **Ctrl+G** sur un PC), tapez le numéro et appuyez sur **OK**. La ligne est surlignée et amenée à l'écran. Go to line marche aussi dans l'éditeur **Schema.json**.

## Ouvrir l'éditeur de Processes et choisir un Process {#opening-the-process-editor-and-picking-a-process}

Ouvrez l'éditeur de Processes depuis **☰ Menu > Processes**, ou, pendant que vous êtes dans **Edit layout**, avec **📝 Processes** sur la barre Edit layout (à côté de 🔨 Build Tab). Revenez avec **☰ Menu > Tabs**.

Choisissez le Process à travailler dans la liste en haut de l'éditeur. **➕ Add New Process...** est le premier de cette liste ; viennent ensuite vos Processes, groupés par classe (Flow, Sub, Repeat, Looper) dans leur Order. La liste sur le côté gauche marche toujours aussi, et c'est là que vous changez les numéros d'Order.

Un Process a une clé cachée, donc **Rename** ne change que son nom : chaque autre Process qui le lance ou l'arrête est mis à jour tout seul avec le nouveau nom. Voir la page d'aide Name change and hidden keys.

## Texte prédictif : Ctrl+Espace {#predictive-text-ctrl-space}

Pendant que vous tapez, une liste propose les commandes et les noms qui conviennent ; appuyez sur **Ctrl+Espace** ou **💡 Suggest** pour voir ce qui peut aller au curseur. Voir [Texte prédictif dans l'éditeur de Process](79-predictive-text).

## Chemins d'image : Alt+P {#picture-paths-alt-p}

Appuyez sur **Alt+P** (Option+P sur un Mac) ou sur le bouton **Picture** pour choisir une image ou un son dans une liste, un groupe ou tous, et faire taper son chemin là où est le curseur. Voir [Groupes d'images](57-picture-groups).

## Couleurs {#colors}

Les mots d'un Process sont colorés selon ce qu'ils font :

| Couleur | Ce que c'est | Exemple |
|---|---|---|
| Bleu | Les commandes et leurs mots | `if`, `wait`, `start`, `new value`, `true`, `now` |
| Magenta | Les Devices (sur un port d'un PLC) | `Pump_Red`, `HLT_Temp` |
| Bleu-vert | Les Widgets (seulement dans l'application) | `tm_Mash`, `alm_Hops` |
| Violet | Les gGlobals | `gGV_Strike_Target` |
| Noir sur blanc | Les variables créées dans ce Process | `new value count`, puis `count` |
| Olive | Les noms de Processes | `start sub_Fill` |
| Orange | Les opérateurs | `=  +  -  *  /  <  >  ==  and  or  not` |
| Brun | Le texte entre guillemets | `"Mash in"` |
| Or | Les nombres et les durées | `185.5`, `00:10:00` |
| Vert | Les commentaires | `// note` |
| Gris | Les labels et les attributs | `[Mash]`, `goto Mash`, `tm_Mash.visible` |

Un nom qui n'est ni un Device, ni un Widget, ni un gGlobal, ni une variable, ni un Process reste sans couleur. C'est un moyen rapide de repérer une faute de frappe.

Appuyez sur **Color key** pour voir la liste à l'écran. L'interrupteur **Colors** éteint et rallume les couleurs pour vous seulement (les autres personnes gardent leur propre choix). Avec le téléphone ou le PC en mode sombre, les couleurs sont un peu plus claires pour être faciles à lire.

## Les commentaires d'autres langages {#comments-from-other-languages}

Un commentaire est une note pour les personnes ; le Process le saute. Tous ceux-ci marchent :

```
// a comment, as in C, C++, C#, JavaScript and Node.js
# a comment, as in Python
' a comment, as in Visual Basic
/* a comment that can go
   over several lines, as in C, C++, C#, JavaScript */
V_HLT_Out = true    // a comment can also go at the end of a line
```

(Commentaires à la manière de C, C++, C#, JavaScript et Node.js ; de Python ; de Visual Basic ; sur plusieurs lignes ; et en fin de ligne.)

Le texte entre guillemets n'est jamais un commentaire, donc `print "Pump #2"` affiche `Pump #2`. Les lignes à l'intérieur de `/* ... */` sont laissées telles quelles quand un Process est enregistré, donc les numéros d'étape et le nouveau style ne sont pas mis dans vos notes.

## Save to file (enregistrer dans un fichier) {#save-to-file}

Ouvrez la liste **Save to file...** et choisissez quoi enregistrer. Le fichier va dans le dossier Téléchargements (Downloads) de l'ordinateur ou du téléphone que vous utilisez.

- **Whole Process as text (.txt)** : tout le Process exactement comme il est dans l'éditeur.
- **Whole Process as XML in color (.xml)** : ouvrez-le dans n'importe quel navigateur web (Edge, Chrome, Safari, Firefox) pour voir le Process en couleurs avec les numéros de ligne et une légende. Le texte brut est aussi gardé dedans, pour que d'autres programmes puissent le lire.
- **Highlighted part as text (.txt)** et **Highlighted part as XML in color (.xml)** : surlignez d'abord quelques lignes dans l'éditeur (faites glisser dessus, ou sur un téléphone appuyez longuement, puis faites glisser les poignées), puis choisissez l'un de ces deux. Le nom du fichier dit quelles lignes, par exemple `Fill_HLT_lines_7-18.xml`.
- **Notepad++ colors file** : voir plus bas.

Ce qui est enregistré, c'est ce que vous voyez dans l'éditeur, même avant d'appuyer sur **Save**.

## Les couleurs dans Notepad++ {#colors-in-notepad}

**Notepad++ colors file** crée `Skynet_Process_Notepad++.xml` avec les mêmes couleurs que le panel et les noms de vos propres Devices, Widgets, gGlobals, variables et Processes. Quand vous ajoutez de nouveaux noms, enregistrez de nouveau le fichier et importez-le de nouveau.

Pour l'utiliser sur un PC Windows :

1. Ouvrez Notepad++.
2. Cliquez sur **Language**, puis **User Defined Language**, puis **Define your language...**.
3. Cliquez sur **Import...**, choisissez `Skynet_Process_Notepad++.xml` et cliquez sur **Open**. Fermez la fenêtre.
4. Fermez Notepad++ et rouvrez-le.
5. Ouvrez un Process (un fichier `.txt` du dossier `processes`), puis cliquez sur **Language** et choisissez **Skynet Process** près du bas de la liste.

Un fichier général qui colore les commandes, les commentaires, les nombres, le texte, les opérateurs et les noms qui commencent par `gG` (les gGlobals) est dans le dossier du panel sous `docs/Skynet_Process_Notepad++.xml`.

## Delete et la Recycle Bin (corbeille) {#delete-and-the-recycle-bin}

**Delete** n'efface pas un Process. Il demande d'abord, puis déplace le Process dans la **Recycle Bin** (le dossier `processes/Recycle_Bin` sur le Brain).

Appuyez sur **Recycle Bin** sous la liste des Processes pour voir ce qui a été supprimé et quand :

- **Look** montre ce qu'il contient, en couleurs.
- **Restore** vous demande de confirmer, puis remet le Process dans la liste avec sa classe et son réglage « Restart if it fails ». Si un Process de ce nom existe maintenant, on vous demande un autre nom pour le restaurer.
- **Delete for good** vous demande de confirmer, puis l'efface. Cela ne peut pas être annulé.

Tout le monde peut regarder dans la Recycle Bin ; seuls les Admins peuvent restaurer ou effacer.

## Rechercher et remplacer {#find-and-replace}

**Find** (ou **Ctrl+F** ; **Ctrl+H** pour remplacer) cherche dans le Process ouvert. **Aa** respecte les majuscules et les minuscules, **Whole word** (mot entier) saute les noms plus longs. Les boutons haut et bas (ou **Entrée** et **F3**) passent d'une correspondance à l'autre. **Replace** change une correspondance, **Replace all** toutes ; appuyez sur **Save** pour les garder, **Ctrl+Z** les annule.

**All Processes** cherche dans tous les Processes et liste chaque correspondance avec l'allure qu'aura la ligne après le changement. Décochez celles à laisser tranquilles, puis appuyez sur **Replace ticked** pour enregistrer ces Processes. Un Process en marche garde l'ancien texte jusqu'à ce qu'il soit relancé.

## L'éditeur Schema.json (Admins) {#the-schema-json-editor-admins}

La page **Schema.json** (Admins seulement, sur la barre de menus ; elle s'appelait **Config** avant) montre tout le fichier de configuration, `config/brewery.json`, sous forme de texte : Tabs, Devices, Widgets, tuyaux, Interfaces et réglages. Elle a les mêmes **Find**, **Replace** et **Go to line**.

- **Check** teste le fichier comme le panel le charge au démarrage et montre la ligne qui pose problème.
- **Save** le vérifie d'abord et n'enregistre pas un fichier que le panel ne peut pas charger. Enregistrer arrête les Processes en marche et reconnecte les cartes. L'ancien fichier est d'abord copié dans `config/backups`.
- **Save as .json file** enregistre un Schema comme un seul fichier `.json` sur cet ordinateur (voir la page d'aide *Schema.json*).
- **Backups** liste les copies. **Open** en montre une dans l'éditeur (rien ne change tant que vous n'appuyez pas sur Save) ; **Restore** la remet après avoir demandé.
