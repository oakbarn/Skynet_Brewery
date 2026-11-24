# Build Tab

Construire quelque chose de nouveau sur un Tab chargé est difficile : ça tombe sur d'autres choses et c'est délicat à attraper. Alors **tout ce qui est nouveau est d'abord fait sur un Build Tab propre** (l'onglet de construction) : chaque Device, Widget, IP, image, texte, équipement et copie de Template. Vous pouvez le regarder avec **👁 Preview** à tout moment. Quand c'est prêt, **Finish Build ...** demande où ça va : sur un de vos Tabs (un choix et un clic), ou dans un Template.

Le Build Tab ne s'affiche que pendant que vous construisez. Il a un bord orange en pointillés et un 🔨 dans la barre des Tabs. Il ne fait jamais partie de vos Tabs. Un Build pas fini est gardé sur le Brain, dans le Schema, et revient la prochaine fois que vous ouvrez Edit layout (voir [Enregistrer ne termine jamais le Build](#saving-never-ends-the-build) plus bas).

## Commencer à construire {#start-building}

Chaque étape, en images : [Pas à pas : ajouter un Device](207-step-by-step-add-a-device) et [Pas à pas : ajouter un Widget](208-step-by-step-add-a-widget).

1. Appuyez sur **☰ Menu** et choisissez **Edit layout**.
2. Faites l'une de ces choses :
   - Choisissez un Device dans **Add Device** (ou un raccourci : **Pumps**, **Valves**, **Probe**, **Heating Element**, **PWM**), un Widget dans **Add Widget**, ou appuyez sur **Picture ➕**, **Text ➕**, **Vessel**, **Manual Valve ➕**, **Add equipment ➕** ou **Elbows, Tees …** (voir [Barre Edit layout](82-edit-layout-bar)). Le Build Tab s'ouvre tout seul et le nouvel élément y est fait, **jamais sur un Tab normal**. Le Tab que vous choisissez dans sa fenêtre Add est retenu : c'est là qu'il ira à la fin (voir **Où il va** plus bas).
   - Appuyez sur **🔨 Build Tab** dans la barre Edit layout pour l'ouvrir vide.
   - Dans **☰ Menu > Vessel Templates**, **Equipment Templates** ou **Fitting Templates**, ouvrez un Template (un Template Skynet ou un Template groupé de l'utilisateur) et appuyez sur **Add to Tab** ou **Clone**. La copie est faite sur le Build Tab (voir **Copies de Templates** plus bas).
3. Construisez-le sur le Build Tab : réglez ses propriétés, ajoutez ses IP, tracez ses tuyaux. Tout ce qui est dans la barre Edit layout y marche.

Vous pouvez aller et venir entre le Build Tab et vos autres Tabs à tout moment. Le Build Tab a la taille du Tab d'où vous venez.

## Où il va {#where-it-goes}

Un nouveau Device ou Widget commence toujours sur le Build Tab. Le **Tab** que vous choisissez dans sa fenêtre Add est celui où il ira quand la construction sera finie :

- Son **Suggested Name** se termine déjà par l'ID de ce Tab (par exemple `BM_22_DO@Pump_Pump_BH` pour Brew House).
- Ses Properties montrent ce Tab dans la case **Tab**. Choisissez-y un autre Tab et il ira dans celui-là. Il reste sur le Build Tab jusque-là.
- **✅ Finish Build ... > Move to Tab** propose ce Tab en premier, comme suggestion. Vous choisissez un seul Tab pour tout le Build, et tout ce qui est sur le Build Tab y va.

### Sa place sur le Build Tab est sa place sur son Tab {#its-spot-on-the-build-tab-is-its-spot-on-its-tab}

Là où vous le mettez sur le Build Tab, c'est là qu'il arrive sur son Tab. Le Build Tab est fait au moins aussi grand que ce Tab, donc chaque place y tient. Si vous l'envoyez vers un autre Tab dans Finish Build, il va au milieu de ce Tab.

### Le filigrane {#the-watermark}

Une copie pâle du Tab où va votre construction s'affiche derrière tout sur le Build Tab, comme un filigrane : le Tab tel qu'il est le jour de brassage (Brew Day), avec chaque Device, Widget, cuve, image, texte et tuyau qui s'y trouve, et **Goes to:** (va vers) avec le nom du Tab en haut à gauche. Servez-vous-en pour placer les nouvelles choses là où elles vont : alignez votre nouvel élément dessus et il arrivera au bon endroit. Rien dans le filigrane ne peut être cliqué.

- Il s'affiche dès que le Build Tab s'ouvre : le Tab de la case **Tab** dans la barre Edit layout (votre Tab par défaut, ou le Tab d'où vous venez).
- Cliquez sur un élément du Build Tab pour voir le filigrane du Tab où il va.
- Un Build pour un Template n'a pas de filigrane, car un Template ne va dans aucun Tab.
- **🗺 Watermark On** dans la barre Edit layout (il ne s'affiche que sur le Build Tab) l'éteint ; **🗺 Watermark Off** le rallume. Ce navigateur se souvient de votre choix.

### Il brille jusqu'à ce que vous cliquiez dessus {#it-glows-until-you-click-it}

Quand Finish Build déplace quelque chose sur un Tab normal (Brew House dans l'exemple, par exemple), son bord **brille en rouge avec une pulsation lente**, pour qu'il soit facile à trouver. Dès que vous cliquez dessus, la lueur s'arrête. La lueur n'est jamais enregistrée : recharger la page l'arrête aussi.

### Templates dans la liste des Tabs {#templates-in-the-tab-list}

Une cuve, un équipement ou un Tab_Fitting sur le Build Tab a **📁 Templates** au bout de la liste des Tabs dans ses Properties. Choisissez-le et **✅ Finish Build ...** montre **As a Template** en premier. Les Devices et les Widgets ne peuvent pas être des Templates (voir **Ce qui peut être un Template** plus bas), donc leur liste des Tabs ne l'a pas.

## Preview

Appuyez sur **👁 Preview** dans la barre Edit layout (il s'affiche tant qu'il y a un Build Tab). Le Build Tab est dessiné comme il sera le jour de brassage : pas de grille, pas de contours en pointillés, pas de coins de redimensionnement ni de cadenas. Rien ne peut être déplacé ou changé pendant que vous regardez : appuyez sur **✏ Back to building** (le même bouton) pour continuer à construire.

Le Preview marche avant et après que vous changiez les Properties d'un élément, aussi souvent que vous voulez, jusqu'à ce que la construction soit envoyée vers un Tab ou un Template. Aller sur un autre Tab l'arrête aussi. La fenêtre **Finish Build** a aussi un bouton **👁 Preview**, pour un dernier coup d'œil avant de choisir où ça va.

## Partir un moment, revenir au Build {#leave-for-a-moment-come-back-to-the-build}

Vous pouvez quitter ce que vous construisez et y revenir. Rien n'est perdu :

- **Dans une boîte Add** (par exemple la première boîte de la Blichmann RipTide), un double-clic sur un choix dans une liste, comme **Brew House** dans la liste **Tab**, ouvre les réglages de ce Tab (ou les Properties de ce Device). La boîte Add se met de côté et garde tout ce que vous avez tapé et choisi. Quand vous fermez l'autre boîte (**💾 Save** ou **✖ Cancel**), la boîte Add revient, sur le Tab où vous étiez.
- **Dans les Properties d'une chose déjà faite**, le même double-clic demande d'abord si vous avez changé quelque chose. Quand l'autre boîte se ferme, vous êtes de retour sur votre Tab et ses Properties s'ouvrent à nouveau.
- **Dans la barre des Tabs**, un double-clic sur le nom d'un Tab ouvre ses réglages. Si vous étiez sur le 🔨 Build Tab, vous revenez au Build Tab quand vous les fermez.

**➕ Add new Tab…** et **📁 Templates** dans une liste de Tabs sont des choix : un double-clic dessus n'ouvre rien.

## Copies de Templates {#copies-of-templates}

Une copie de Template, d'un **Template Skynet** ou d'un **Template groupé de l'utilisateur**, est toujours faite d'abord sur le Build Tab.

- **Add to Tab** : choisissez le Tab où elle va et son nom. La copie est faite sur le Build Tab, groupée. **Finish Build ... > Move to Tab** propose ensuite ce Tab en premier.
- **Clone** : donnez un nom au nouveau Template. La copie est faite sur le Build Tab. Changez-la là, puis **Finish Build ...** montre **As a Template** en premier, avec ce nom déjà rempli. Appuyez sur **Save as Template** et le nouveau Template est enregistré. Ce que le Build Tab ne montre pas (comme le Connection Standard de chaque orifice) est copié du Template que vous avez cloné.

Si vous n'êtes pas encore en Edit layout, il est activé pour vous.

## Ouvrir les Templates depuis le Build Tab {#open-the-templates-from-the-build-tab}

Vous n'avez pas à fermer votre Build pour voir les Templates. En Edit layout, **📁 Templates** dans la barre Edit layout ouvre **Vessel Templates**, **Equipment Templates**, **Fitting Templates** ou **Build Template**, et le Build reste ouvert. Un onglet Template du Menu déjà ouvert peut aussi être cliqué.

- Vous voyez ce que vous obtenez : **Add to Tab**, **Clone** ou un **glisser avec le bouton droit** met la copie sur le Build Tab, comme toujours.
- **B** (ou **Insert**) : cliquez une fois sur l'icône d'un Template, puis appuyez sur **B** (pour Build) ou **Insert**. Une copie va sur le Build Tab et vous restez sur les Templates, pour en ajouter plusieurs.
- Pendant qu'une page de Templates est affichée, la barre Edit layout s'efface. Cliquez sur le **🔨 Build Tab** (ou **✖ Close**) pour revenir à votre Build, tout y est comme vous l'avez laissé.
- Les autres onglets du Menu attendent toujours que vous appuyiez sur **Save layout** ou **Exit** (Règle Skynet 2.52).

(Règle Skynet 4.10)

## Finish Build

Appuyez sur **✅ Finish Build ...** dans la barre Edit layout. Une fenêtre demande où ça doit aller :

| Choix | Ce qui se passe |
|---|---|
| **Move to Tab** | Choisissez le Tab (celui choisi pour le nouvel élément est en premier ; sinon celui d'où vous venez) et appuyez sur **Move to Tab**. Tout ce qui est sur le Build Tab y va à sa taille actuelle. Vers le Tab choisi pour lui, il garde sa place du Build Tab ; vers un autre Tab il va au milieu. Il brille en rouge jusqu'à ce qu'on clique dessus. Appuyez ensuite sur **Save layout**. |
| **As a Template** | Tapez un **Template Name** (sans espaces, unique) et appuyez sur **Save as Template**. Il est enregistré tout de suite dans **☰ Menu**, et le Build Tab se ferme. Utilisez **Add to Tab** sur le Template pour le mettre sur un Tab. |
| **Throw it away** | Tout ce qui est sur le Build Tab est supprimé (il demande d'abord), et les Ports de ses Devices sont de nouveau libres. |
| **Keep building** | Retour au Build Tab, rien ne change. |

Un nouveau Device dont le nom suit encore le nom proposé reçoit l'**ID du Tab** où il va au bout de son nom (par exemple `MB_25_PWM_VlV_Fly~Sparge_SP`). Un nom que vous avez tapé vous-même n'est jamais changé.

## Enregistrer ne termine jamais le Build {#saving-never-ends-the-build}

Seul **✅ Finish Build ...** termine un Build. Jusque-là :

- **Save layout** enregistre vos Tabs normaux. Le Build reste ouvert sur le 🔨 Build Tab, et vous restez dans Edit layout pour continuer à y ajouter des choses.
- Le Build pas fini est gardé sur le Brain. Il ne tourne jamais et ne s'affiche jamais le jour de brassage (Brew Day). Il survit à un redémarrage, et il revient sur le 🔨 Build Tab la prochaine fois que vous ouvrez Edit layout. Quitter Edit layout, avec ou sans enregistrer, le garde aussi.
- Les Ports de ses Devices restent pris, donc rien d'autre ne peut y être mis par erreur.
- Quand un Build gardé revient, une note le dit, avec **🗑 Discard Build**. Un clic jette le Build et libère ses Ports. **↩ Undo** s'affiche quelques secondes après, au cas où c'était une erreur.

## Travailler sur un élément dans le Build Tab {#work-on-an-item-on-the-build-tab}

Quand vous modifiez un Tab, vous pouvez emmener n'importe quel élément sur le Build Tab propre pour y travailler. C'est votre choix : vous pouvez aussi le changer là où il est.

1. En **Edit layout**, cliquez sur l'élément pour le choisir (un Device, un Widget, une image, un texte ou une cuve).
2. Appuyez sur **🔨 To Build Tab** dans la barre Edit layout. Skynet retient son Tab, sa place et sa taille, et le déplace vers le Build Tab. Une cuve emmène ses IP et ses raccords. Les tuyaux qui y sont tracés restent sur son Tab.
3. Changez-le sur le Build Tab. **👁 Preview** montre de quoi il aura l'air.
4. Appuyez sur **✅ Finish Build ...**. Une fenêtre demande **Put it back where it came from?** (Le remettre d'où il vient ?)
   - **OK (Oui)** : il retourne sur le même Tab, à la même place et à la même taille. Un élément groupé est regroupé, et un élément qui n'était pas groupé le reste.
   - **Cancel (Non)** : il est enregistré comme une nouvelle construction. La fenêtre Finish Build s'ouvre, et vous pouvez l'envoyer vers n'importe quel Tab ou l'enregistrer comme Template.
5. Appuyez sur **Save layout** pour le garder.

**🔨 To Build Tab** est grisé quand rien n'est choisi, quand un tuyau est choisi, ou quand l'élément est déjà sur le Build Tab. Un élément verrouillé doit d'abord être déverrouillé (seuls les éléments déverrouillés bougent). Les choses nouvelles sont toujours faites d'abord sur le Build Tab.

## Changer un élément groupé dans le Build Tab {#change-a-bundled-item-on-the-build-tab}

Un élément groupé (une cuve ou un Tab_Fitting avec ses IP) peut être retiré de son Tab, changé sur le Build Tab, et remis au même endroit.

1. En **Edit layout**, double-cliquez sur l'élément groupé. Désactivez **Bundled** et appuyez sur **Save**.
2. Une fenêtre demande **Move it to the 🔨 Build Tab to work on it?** (Le déplacer vers le Build Tab pour y travailler ?)
   - **OK (Oui)** : Skynet retient son Tab, sa place et sa taille, et le déplace avec ses IP vers le Build Tab. Les tuyaux qui y sont tracés restent sur son Tab.
   - **Cancel (Non)** : il est dégroupé là où il est, comme avant.
3. Changez-le sur le Build Tab, puis appuyez sur **✅ Finish Build ...**.
4. Une fenêtre demande **Put it back where it came from?**
   - **OK (Oui)** : il retourne sur le même Tab, à la même place et à la même taille, et il est regroupé. Ses IP gardent leur place sur l'image.
   - **Cancel (Non)** : il est enregistré comme une nouvelle construction. La fenêtre Finish Build s'ouvre : choisissez un Tab et il y va à sa taille actuelle, au milieu du Tab, regroupé.
5. Appuyez sur **Save layout** pour le garder.

Si son Tab a été supprimé ou renommé entre-temps, la question est sautée et il est enregistré comme une nouvelle construction. **Throw it away** et **As a Template** le retirent tous les deux de votre Tab pour de bon (Throw it away le nomme et demande d'abord).

## Ce qui peut être un Template {#what-can-be-a-template}

Un Template est **une cuve** (avec les raccords groupés sur ses orifices), **un raccord groupé** ou **un Chiller Bundle** (plus bas). Tant qu'il y a autre chose sur le Build Tab (un Device, un Widget, un IP isolé, un tuyau, une image ou un texte), **As a Template** est grisé et dit pourquoi. Enregistrez plutôt vers un Tab, ou supprimez d'abord ces choses du Build Tab.

- Une cuve, un refroidisseur, un serpentin, un filtre à trub ou un tube RIMS devient un **Vessel Template** (ou un **Equipment Template**). Il garde sa sorte, son type, son image, la taille à laquelle il est dessiné, ses tailles, sa source de chaleur, son Connection Standard, ses notes et quels orifices sont actifs et où.
- Un raccord groupé sur un de ses orifices qui est encore identique à son Template est utilisé tel quel. Un raccord que vous avez changé sur le Build Tab est d'abord enregistré comme un nouveau **Bundled Fitting Template**, nommé d'après lui.
- Un Tab_Fitting seul devient un **Bundled Fitting Template**.

### Un Chiller Bundle {#a-chiller-bundle}

Un refroidisseur à immersion avec tout ce qui va avec peut être **un seul Equipment Template** :

1. Dans la barre Edit layout, choisissez **Valves/Equipment > 🔨 Build new Equipment Template**. Le 🔨 Build Tab s'ouvre pour un
   Template, et les boutons des choses qui ne peuvent pas y aller (Widgets, Picture, Text, Tab settings, New tab, Hidden Tab,
   Processes) sont grisés.
2. Mettez-y **un refroidisseur à immersion** (Add equipment ➕ > Chilling coil, 2 IP) et ce qui va avec : ses **tuyaux souples** (Draw
   hose ou Draw QD hose : le tuyau d'arrivée vers son In et le tuyau d'évacuation depuis son Out), un **Ice Water Can**, une **pompe
   de puisard** (Pumps > Sump Pump by hand, ou un Device de pompe sur une prise murale commandée) et les **IP** nécessaires.
3. Appuyez sur **✅ Finish Build ...** : **As a Template** est en premier. Donnez-lui un nom (par exemple Ice_Bath_Chiller) et
   appuyez sur **Save as Template**.

Il est dans ☰ Menu > Equipment Templates et dans **Valves/Equipment**. Le choisir met tout sur le 🔨 Build Tab ensemble, tuyaux
toujours joints ; un nom déjà pris reçoit un numéro. Un Template ne garde jamais de Port, donc un Device de pompe de puisard reçoit le
**prochain Port libre** de l'Interface du Build quand il est posé (ou Skynet dit de lui en donner un dans Properties). Toute autre
chose sur le Build Tab (un Widget, une image, un texte, un deuxième refroidisseur) est nommée, et As a Template dit de l'enlever d'abord.

Tant que Skynet construit encore ses Templates, il y a un bouton **Skynet Template** (désactivé = un Template groupé de l'utilisateur). Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).
