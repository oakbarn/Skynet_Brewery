# Double-clic dans les listes de choix {#double-click-in-picker-dropdowns}

**Un standard Skynet (2026-10-27) :** dans une fenêtre Properties, une liste qui choisit une chose ayant sa propre fenêtre Skynet ouvre les Properties de cette chose quand vous double-cliquez dessus.

Exemple : ouvrez les Properties du Widget Picture **pic_Kettle_Element** dans l'exemple à deux cuves. Sa liste **Tab** montre **Brewhouse**. Double-cliquez dessus et les **Brew House Tab settings** (réglages du Tab Brew House) s'ouvrent.

| Liste | Le double-clic ouvre |
| --- | --- |
| **Tab** | les réglages de ce Tab |
| Un Device ou un Widget (Turns on with, Input, Heater, Timer, Hop Alarm ...) | les Properties de ce Device ou Widget |
| **Port on vessel** | les Properties de la cuve |
| **Starts at IP** / **Ends at IP** d'un tuyau | les Properties de l'IP (ou de la pompe, de la vanne ou de la cuve à laquelle il appartient) |
| **Only when ALL of these are on** d'un tuyau (une liste) | les Properties du nom sur lequel vous double-cliquez |

Comment ça marche :

- Choisissez d'abord celui que vous voulez, puis double-cliquez sur la liste. Dans certains navigateurs, une liste ouverte avale le second clic, donc **deux clics rapides** dessus, ou un **double-clic sur le nom du champ** à sa gauche, font la même chose.
- Si vous avez changé quelque chose dans la fenêtre où vous êtes, le panel demande d'abord, car ces changements ne sont pas enregistrés.
- Les listes d'images et de sons marchent autrement : elles ont leur propre aperçu et leur sélecteur d'icônes 🖼, donc un double-clic n'y fait rien. Les simples listes de choix (couleurs, sortes Yes / No, tailles) n'ont pas non plus de fenêtre derrière.
- Les Interfaces (cartes) n'ont pas de fenêtre Properties ; changez-les sur la page Devices.

Voir aussi [Double-clic dans les listes](68-double-click-in-lists).
