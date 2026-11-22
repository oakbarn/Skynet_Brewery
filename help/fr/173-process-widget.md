# Widget Process {#process-widget}

Un **Process Widget** met un **Process** sur un Tab, pour que vous voyiez ce qu'il fait et le démarriez ou l'arrêtiez d'un clic
(Règle Skynet 1.31).

Il montre trois choses :

- son **Label** comme titre (par exemple *Mash Steps*),
- ce que fait son Process : **Running** (en cours), **Waiting** (retenu à un `wait` ou un `ask`), **Stopped** (arrêté), ou **Stopped on an error** (arrêté sur une erreur),
- un bouton **▶ Start** tant que le Process est arrêté, ou un bouton **■ Arrêt** (Stop) tant qu'il tourne.

Ajoutez-en un dans **Edit layout > Add Widget > Widgets (app only, no board pin) > Process Widget**. Comme tout Widget, il est d'abord créé sur le
🔨 Build Tab et n'existe que dans l'application (pas d'Interface ni de Port). Son Name suit `wgt_PSW_` + le Label + l'ID du Tab, par
exemple `wgt_PSW_Mash~Steps_BH` (Règle 3.14).

## Un clic le démarre ou l'arrête {#one-click-starts-or-stops-it}

Hors Edit layout, **un clic n'importe où sur le Widget** démarre son Process quand il est arrêté, et l'arrête quand il tourne. Il n'y a
pas de fenêtre d'abord (Règle 2.44 : ce que vous faites tous les jours est à un clic). Si le Process ne peut pas démarrer (par exemple il a une
erreur dans son code), un message en haut de l'écran dit pourquoi, et le Widget affiche **Stopped on an error**.

- Activez **Ask before starting or stopping** dans ses Properties si vous voulez que le clic demande d'abord.
- Un compte **en lecture seule** peut regarder mais ne peut ni le démarrer ni l'arrêter.
- Un **double-clic** ouvre ses Properties, comme sur tout Device et Widget.

## Ses Properties {#its-properties}

1. **Label** (jamais vide) et **Label Visible**.
2. **Tab** : le Tab où il est.
3. **Name** : créé par Skynet à partir du Label et du Tab.
4. **Process** : le Process qu'il montre et démarre, choisi dans la liste de tous les Processes.

Puis **Ask before starting or stopping**, **Picture**, **Picture turns on with**, **X**, **Y**, **Width** et **Height** (200 x 80
au départ) et le **Widget Type**.

**Hide while running** (désactivé au départ) : activé, le Widget se cache (`.visible = false`) dès que son Process démarre, et se
montre de nouveau quand le Process s'arrête. Pour un bouton qui démarre quelque chose, comme **Start Brew Day** dans les exemples.
Laissez-le désactivé sur un bouton Start / Stop, pour qu'un clic puisse aussi arrêter le Process.

**Group** (vide au départ) : les Process Widgets qui ont le même mot de groupe agissent ensemble, comme les boutons Water de
l'exemple 3 Vessel (groupe **Water**). Un clic sur l'un grise le Start de tous les autres, pour que deux ne puissent pas tourner en même temps :

1. Pendant le délai, chacun d'eux affiche **Delay**, et celui qui a été pressé dit **Started**.
2. Quand l'eau coule, celui qui a été pressé affiche **Running** et les autres se vident.
3. Quand c'est fini, chaque Start marche de nouveau.

Le Process dit quand chaque partie commence, avec `.phase` sur n'importe quel Widget du groupe :

```
wgt_PSW_FireHose~1~Minute_WA.phase = "running"
wgt_PSW_FireHose~1~Minute_WA.phase = "stopped"
```

Laissez hors du groupe un bouton qui doit toujours marcher, comme **FireHose Off**.

## Une image dessus {#a-picture-on-it}

Un Process Widget peut montrer une **Picture** entre son Label et son bouton, par exemple un interrupteur à flotteur sur un bouton
« remplir jusqu'au flotteur ». Le ⬢ à côté de Picture contient la **Picture when on**. Réglez **Picture turns on with** sur un Device
ou un Widget, et le Widget montre la Picture when on pendant que celui-ci est allumé, et la Picture when off pendant qu'il est éteint.
Sur le Tab Water de l'exemple Fire Hose, les boutons **Use FireHose Float** et **Use Manifold Float** montrent le flotteur pendu
tant que le Water float est sec, et soulevé avec ses contacts fermés (rouges) une fois que l'eau le fait monter. Laissez Picture vide
pour ne pas avoir d'image.

Posez la souris sur le nom d'un champ pour une courte explication.

## Quand le Process change {#when-the-process-changes}

- Quand vous donnez un nouveau nom au Process avec **✏ Change name**, le Widget le suit tout seul.
- Quand un Process démarre ou arrête le Process (`start Mash`, `stop Mash`), chaque Process Widget qui le montre change tout de suite.
- Si le Process est supprimé, le Widget affiche **No such Process** jusqu'à ce que vous en choisissiez un autre. Sans Process choisi, il affiche
  **No Process picked**.

Un Process Widget n'a pas de valeur à lui, donc il n'a pas de réglages Database ni .API.
