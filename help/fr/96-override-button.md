# Bouton Override {#override-button}

Le **bouton Override** (forcer) permet à une journée de brassage de continuer quand un Process est bloqué dans une attente. Chaque bouton est réglé sur **un Process** ou sur **Any** (n'importe lequel). Un appui et ce Process (Any : chaque Process qui tourne) avance, 100 ms plus tard, comme le fait **Skip** dans le simulateur, mais sur la vraie horloge :

- un **wait** où il est retenu (`wait Kettle_Temp >= 152`) est passé, comme s'il était atteint ;
- un **sleep** où il est se termine maintenant ;
- la **boucle** où il se trouve est quittée : le prochain `goto` qui saute vers le haut (souvent dans un `if`) est passé, donc le Process continue avec la ligne en dessous.

Après cela, le Process tourne normalement : le **wait** ou le sleep **suivant** attend comme d'habitude. Appuyez de nouveau sur Override pour passer celui-là aussi. Un appui que rien n'utilise dans la seconde est abandonné, donc il ne saute jamais quelque chose plus tard par surprise.

**Les vannes manuelles attendent toujours** leur clic (Widget Manual Valve) ou leur bouton **Done**.

**Any laisse les Processes Looper tranquilles.** Un Looper (classe de Process Looper, comme `looper_LogTemps`) tourne seul en arrière-plan, par exemple en copiant une température pour le journal toutes les quelques secondes. Un bouton réglé sur Any ne le fait jamais avancer ; un bouton réglé sur ce Looper par son nom, oui.

Seul un operator ou un admin peut appuyer dessus. Chaque Process qui a avancé écrit une ligne dans sa console, par exemple `Override: the wait on line 12 was passed`.

## Des Processes côte à côte {#processes-side-by-side}

Les Processes tournent en même temps et chacun pour soi : un Process de brassage, et un Process Fire Hose ou Manifold lancé à côté. Réglez chaque bouton sur le Process qui lui correspond : un appui ne fait jamais avancer les autres.

## La fenêtre Override {#the-override-pop-up}

Un Process sans bouton à lui a quand même un Override : une petite **fenêtre Override**, par-dessus tout, qui nomme le Process. Un appui fait avancer seulement ce Process. **✕** la cache sur cet écran jusqu'à ce qu'elle revienne.

- **Toute seule :** quand un Process attend depuis 3 secondes dans un `wait` ou un `sleep` et **qu'aucun bouton Override n'est réglé sur lui ni sur Any**. Un wait sur une température compte : vous voyez la cuve bouillir avant qu'elle atteigne la Boil Temp du jour et vous appuyez sur Override.
- **Jamais toute seule dans une boucle :** un wait ou un sleep au-dessus duquel un `goto` plus bas revient (un `if` imbriqué qui attend une vanne ou un élément chauffant) n'est pas sûr à sauter à l'aveugle, donc il n'a pas de fenêtre toute seule.
- **À la demande :** `show_Override` dans un Process la fait apparaître (avec un texte facultatif : `show_Override "Press when the boil is rolling"`), et `hide_Override` l'enlève. Elle part aussi quand on appuie dessus ou à la fin du Process. Voir [Langage des Process](22-process-language).

## En ajouter un {#adding-one}

En Edit layout, appuyez sur **Override ➕** dans la barre Edit layout. Il est fait sur le 🔨 Build Tab, comme chaque nouveau Widget, et ses Properties s'ouvrent. **Finish Build ...** l'envoie vers un Tab.

- **Autant que vous voulez.** Un Tab peut avoir plusieurs boutons Override, et un Process peut avoir plusieurs boutons. Appuyez sur **COPY** dans ses Properties, puis **Finish Build ...** vers le même Tab ou un autre. Chaque bouton a son **propre Label, son propre Process et son propre aspect**.

## Override Button Widget Properties {#override-button-widget-properties}

- **1. Label** : ce que dit le bouton sur ce Tab, par exemple **Skip Fire Hose**. Un nouveau dit **Passer** (Override) ; vide le remet. Ce Label Override s'affiche dans la langue d'aide choisie (en français : **Passer**) ; un Label que vous tapez s'affiche tel que vous l'avez tapé. Les Rich Text Embedded Codes marchent ici (`\b`, `\n`, `\c{Yellow}` ...).
- **2. Tab** et **3. Name** (fait par Skynet à partir du Label et du Tab).
- **4. Process** : **Any** (chaque Process qui tourne sauf les Loopers, l'habituel) ou un Process de la liste. Si le Process change de nom, le bouton le suit.
- **Background** (Show ou None), **Fore color** (son ⬢ contient Font size, Font, Bold et Alignment) et **Back color**.
- **X**, **Y**, **Width**, **Height** et le **Widget Type**.

Il commence en **Passer** (Override) blanc gras sur rouge. Il n'a **pas d'image de fond**.
