# Semi_Widgets_Devices

Les **Semi_Widgets_Devices** sont une classe entre un Widget et un Device. Comme un Widget, ils n'existent que dans l'application : pas de carte, pas de
broche (Règle 1.2). Comme un Device, ils ont un **état ON / OFF** (`.state`, true ou false). (Règle 1.20)

| Semi_Widgets_Device | Ce qu'il fait | Device commandé |
|---|---|---|
| **Switch** | Un appui le fait glisser sur ON ; un autre appui sur OFF. | Oui |
| **Slider** | Un interrupteur glissant ON / OFF : le bouton glisse à droite et devient vert pour ON, à gauche pour OFF. Un appui le fait glisser. | Oui |
| **Checkbox** | Une case à cocher : cochée, c'est ON. Un appui la coche ou la décoche. | Oui |
| **Lighted Button** | Un bouton avec une lampe qui reste allumée tant que c'est ON. Un appui le met sur ON ou OFF. | Oui |
| **Push Button** | ON seulement tant qu'on appuie, OFF quand on lâche. | Oui |
| **Pulse Button** | Un ON de 100 ms pour chaque appui. | Oui |
| **LED** | Une lumière qui montre ON ou OFF. Un appui ne fait rien : un Process ou son Device commandé la règle. | Oui |
| **Manual Valve Widget** | Ouverte ou fermée. Seul un clic dessus la change ; un Process la demande à la main et attend le clic (voir *Pipe fittings and Manual Valves*). | Non |

## Widgets Boolean {#boolean-widgets}

Chacun d'eux qui a un état ON / OFF, sauf le Widget Manual Valve, est un **Boolean Widget** : Switch, Slider, Checkbox,
Lighted Button, Push Button, Pulse Button et LED. Chacun est **son propre Widget**, donc son aspect est fixé : un Slider est toujours un
Slider. Ses Properties montrent lequel c'est (Widget Type, lecture seule). Pour un autre aspect, ajoutez celui-là depuis **Boolean ➕**.

Voyez un Widget Boolean avec un **Linked Device** (Device lié) comme un **Clone de ce Device** pour ce qu'il fait, avec l'aspect d'un Switch,
d'un Slider, d'une LED, etc. Mettez un Slider sur n'importe quel Tab, liez-le à la pompe d'empâtage, et il allume et éteint la pompe sans Process.

## En ajouter un {#adding-one}

En Edit layout, **Select Widget Type > Semi_Widgets_Devices**, puis choisissez Switch, Slider, Checkbox, Lighted Button, Push Button,
Pulse Button, LED ou Manual Valve Widget (ou utilisez **Boolean ➕** dans la barre Edit layout). Comme chaque nouveau Widget, il est fait sur le 🔨 Build Tab et ses Properties s'ouvrent ; **Save Build ...** l'envoie vers un Tab.
Les nouveaux noms sont `wgt_SW_...`, `wgt_SLD_...` (Slider), `wgt_CHK_...` (Checkbox), `wgt_LTB_...` (Lighted Button), `wgt_PB_...`, `wgt_PL_...` et `wgt_LED_...`, puis le Label et l'ID du Tab (Règle Skynet 3.14), par exemple `wgt_SW_Mash_Stir_BH` ; un Widget Manual Valve est `wgt_MV_...` et une Tap Water Valve `wgt_TWV_...`. Les anciens noms (`sw_1`, `ManualValve_1`) continuent de marcher.

## Linked Device

Chaque Widget Boolean a **Linked Device** dans ses Properties, juste après son Name et son Label (dans un Process c'est
`.device_controlled`).
Il commence à **None** : le Widget n'a que son propre `.state`, qu'un Process peut lire ou régler.

Choisissez un Device et les deux **se suivent, comme un Clone** :

- Faites glisser le **Switch**, le **Slider**, la **Checkbox** ou le **Lighted Button** sur ON et le Device s'allume ; éteignez le Device n'importe où et il passe aussi sur OFF.

- Faites glisser le **Switch** sur ON et le Device s'allume. Éteignez le Device n'importe où (sur son propre Tab, par un Process, avec
  Close all valves) et le Switch glisse sur OFF.
- Appuyez sur le **Push Button** et le Device est ON jusqu'à ce que vous lâchiez. Si le Device est allumé autrement, le bouton se montre enfoncé.
- Touchez le **Pulse Button** et le Device reçoit un ON de 100 ms. Si le Device est allumé autrement, le bouton se montre ON
  jusqu'à ce que le Device soit de nouveau OFF (il n'éteint jamais le Device tout seul).
- La **LED** s'allume tant que le Device est ON. Un Process qui règle la LED (`led_Pump = true`) commande aussi le Device.

**Seuls les Devices qui ont un état ON / OFF sont listés :** les pompes, les vannes et les autres sorties on/off qu'un Process peut commander, et les commandes
de chauffage (Duty Cycle, Hysteresis, PID), qui comptent comme ON tant qu'elles sont **Enabled** (Règle 7.9). Pas listés : un Device **Manual valve**
(on la tourne à la main et un Process attend son Done), une **entrée** (elle est lue depuis sa carte), et les autres Widgets.

Plusieurs Widgets Boolean peuvent être liés au même Device ; ils le suivent tous. Si le Device est supprimé, Linked Device revient
à None. S'il est renommé, Linked Device suit le nouveau nom.

## Dans un Process {#in-a-process}

Le nom seul est son `.state` :

```
sw_Pump = true                // the Switch slides ON, and its Device controlled turns ON
wait sw_Pump == false         // until someone slides it OFF, or the Device is turned off
if led_HLT == true then ...
```

(Le Switch glisse sur ON et son Device commandé s'allume ; on attend que quelqu'un le fasse glisser sur OFF, ou que le Device soit éteint.)

`.device_controlled` lit le nom du Device (ou `None`). Il est **en lecture seule** : choisissez-le dans les Properties.

## Programmes extérieurs (.API) {#outside-programs-api}

Un Semi_Widgets_Device peut avoir **.API** comme tout Widget (aide : *Database and API*). Quand il a un Device commandé, un programme
extérieur ne peut le changer que si **le propre .API de ce Device est aussi Get and Put**, pour que personne ne contourne le réglage du Device par un
Switch. `.device_controlled` ne peut jamais être changé de l'extérieur.
