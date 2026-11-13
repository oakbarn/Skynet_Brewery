# Widget Process {#process-widget}

Un **Process Widget** met un **Process** sur un Tab, pour que vous voyiez ce qu'il fait et le démarriez ou l'arrêtiez d'un clic
(Règle Skynet 1.31).

Il montre trois choses :

- son **Label** comme titre (par exemple *Mash Steps*),
- ce que fait son Process : **Running** (en cours), **Waiting** (retenu à un `wait` ou un `ask`), **Stopped** (arrêté), ou **Stopped on an error** (arrêté sur une erreur),
- un bouton **▶ Start** tant que le Process est arrêté, ou un bouton **■ Stop** tant qu'il tourne.

Ajoutez-en un dans **Edit layout > Add Widget > Widgets (app only, no board pin) > Process Widget**. Comme tout Widget, il est d'abord créé sur le
🔨 Build Tab et n'existe que dans l'application (pas d'Interface ni de Port). Son Name suit `wgt_PRC_` + le Label + l'ID du Tab, par
exemple `wgt_PRC_Mash~Steps_BH` (Règle 3.14).

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

Puis **Ask before starting or stopping**, **X**, **Y**, **Width** et **Height** (200 x 80 au départ) et le **Widget Type**.

Posez la souris sur le nom d'un champ pour une courte explication.

## Quand le Process change {#when-the-process-changes}

- Quand vous donnez un nouveau nom au Process avec **✏ Change name**, le Widget le suit tout seul.
- Quand un Process démarre ou arrête le Process (`start Mash`, `stop Mash`), chaque Process Widget qui le montre change tout de suite.
- Si le Process est supprimé, le Widget affiche **No such Process** jusqu'à ce que vous en choisissiez un autre. Sans Process choisi, il affiche
  **No Process picked**.

Un Process Widget n'a pas de valeur à lui, donc il n'a pas de réglages Database ni .API.
