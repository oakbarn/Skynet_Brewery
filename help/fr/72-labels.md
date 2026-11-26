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

`label` est le seul mot pour cela dans un Process.

Un Label réglé par un Process s'affiche sur tous les écrans tant que le panneau tourne. Le Schema garde le Label des Properties, et
`tm_Mash.label = ""` remet celui-là. Le Brew Day de l'exemple 3 Vessel s'en sert sur son Step timer : le minuteur dit ce que fait le
brassage, par exemple **Transferring 1st Run**. Une étape minutée (empâtage, ébullition, whirlpool) compte à rebours ; toutes les
autres comptent vers le haut, vous voyez donc combien de temps prend chaque transfert, chauffe et refroidissement.

Voir aussi [Les zones de texte](49-text-boxes) et [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).
