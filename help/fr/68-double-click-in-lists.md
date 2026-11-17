# Double-clic dans les listes {#double-click-in-lists}

Dans n'importe quelle liste du panel, **double-cliquez sur une ligne pour ouvrir ses Properties**. C'est la même règle que sur un Tab, où un double-clic sur un Device ou un Widget ouvre ses Properties.

Les Properties se changent en **Edit layout**, c'est donc pour les admins. Le panel vous emmène sur le Tab de l'élément, active Edit layout et ouvre la même fenêtre Properties que celle obtenue en double-cliquant sur l'élément du Tab. Appuyez sur **Save layout** quand vous avez fini, comme d'habitude.

Un double-clic sur une case, une liste ou un bouton à l'intérieur d'une ligne fait le travail propre de cette case (par exemple taper une valeur), pour que les Properties ne s'ouvrent pas par accident.

## Quelles listes {#which-lists}

| Liste | Où | Le double-clic ouvre |
| --- | --- | --- |
| gGlobals | Page Variables | les Properties de la variable |
| Devices et Widgets pour la voix et Home Assistant | Settings, MQTT | les Properties du Device ou du Widget |
| Tabs du Schema | ☰ Menu > Tab Profile | les réglages de ce Tab |
| Templates | ☰ Menu > Vessel, Fitting and Equipment Templates | les réglages du Template |

## Les listes qui marchent autrement {#lists-that-work-differently}

- **Processes** : un clic ouvre déjà le Process dans l'éditeur ; ses réglages (classe, Restart if it fails) sont dans la barre de l'éditeur.
- **Media** et **Picture picker** : un double-clic ouvre un dossier, ou choisit l'image.
- **Interfaces**, **Users** et **OneWire probes** : leurs réglages se changent directement dans la ligne ; ils n'ont pas de fenêtre Properties.

Voir aussi [Tabs (les écrans de votre brasserie)](02-tabs) et [Variables](04-variables).
