# Labels et Show label {#labels-and-show-label}

Chaque Device et Widget a un **Name** et un **Label**.

- Le **Name** est celui qu'utilisent les Processes, par exemple `MB_25_PWM@Valve_L_Fly~Sparge_SP`.
- Le **Label** est le texte qu'affiche le Tab, par exemple *Fly Sparge*. Vide = le Tab affiche le Name.

Le Label s'appelait avant **Display name** (`displayName` dans le fichier du Schema). C'est maintenant **Label** partout. Un ancien Schema passe au nouveau tout seul quand il se charge ; rien n'est perdu.

## Show label (un standard Skynet) {#show-label-a-skynet-standard}

Chaque fenêtre Properties qui a un **Label** a aussi un interrupteur **Show label** (afficher le label) juste avec. Désactivé = le Label est gardé mais pas dessiné sur le Tab. C'est vrai pour :

- chaque Device et Widget
- la fenêtre New Device
- les cuves, les Tab_Vessels et les Tab_Fittings, le tube RIMS et les bouilloires intégrées
- les IP
- les tuyaux et les flexibles (le label est au milieu du tuyau ; désactivé quand un tuyau est nouveau)
- les cuves d'un Equipment Profile

## Dans un Process {#in-a-process}

```
tm_Mash.label = "Mash rest"
```

`label` est le mot Skynet. L'ancien mot marche toujours et veut dire la même chose :

```
tm_Mash.displayname = "Mash rest"
"tm_Mash" displayname = "Mash rest"
```

Le bouton **Modernize** change `"tm_Mash" displayname = "..."` en `tm_Mash.label = "..."`.

Voir aussi [Les zones de texte](49-text-boxes) et [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).
