# Les gGlobals gardent leurs valeurs {#gglobals-keep-their-values}

**Chaque gGlobal est non volatile**. Elle garde sa **.value** comme le fait un réglage, pas comme une
variable de Process :

| | Une variable de Process (`new value vTemp`) | Une gGlobal (`gV_Strike_Temp`) |
|---|---|---|
| Qui peut l'utiliser | Seulement le Process qui l'a faite | Chaque Process (portée globale) |
| Quand un Process démarre | Recommence vide | **Garde sa valeur** |
| Quand un Process s'arrête ou redémarre | Disparue | **Garde sa valeur** |
| Quand le panel est fermé ou le Brain éteint ou privé de courant | Disparue | **Gardée sur le disque du Brain** |
| Quand le Brain redémarre | – | **Revient avec la valeur qu'elle avait** |

## Comment ça marche {#how-it-works}

- Quand une gGlobal change (par un Process ou par sa fenêtre), Skynet écrit la nouvelle
  valeur sur le disque du Brain en environ un tiers de seconde. Si un Process la change sans arrêt, elle est quand même écrite au moins
  une fois par seconde. Fermer Skynet Brewer (☰ Menu > Close Skynet Brewer) l'écrit une fois de plus.
- Les valeurs sont dans **data/state.json** sur le Brain, que le Brain soit un Raspberry Pi ou un ordinateur Windows, Linux ou Mac. Chaque écriture est faite sans risque : les nouvelles valeurs vont d'abord dans un nouveau fichier, la dernière
  bonne copie est gardée sous **data/state.json.bak**, puis le nouveau fichier prend sa place. Si le courant coupe au milieu d'une écriture,
  le panel démarre avec la dernière bonne copie.
- Il n'y a **plus d'interrupteur « Keep value on restart »**. Chaque gGlobal garde sa valeur. Les anciens Schemas qui avaient l'interrupteur désactivé
  perdent l'interrupteur quand ils se chargent, et gardent leurs valeurs dès lors.
- La **.value** que vous tapez dans la fenêtre d'une gGlobal est sa **première valeur** : la valeur qu'elle a quand elle est faite, avant que quoi que ce soit
  l'ait changée.

## Chaque Schema garde les siennes {#each-schema-keeps-its-own}

Chaque Schema a ses propres gGlobals, donc chaque Schema garde ses propres valeurs enregistrées. Charger un autre Schema enregistre les valeurs de celui
que vous quittez et ramène les valeurs de celui que vous chargez.

## Repartir de zéro exprès {#starting-fresh-on-purpose}

Une gGlobal n'est remise à une valeur de départ que quand quelque chose la règle. Si une journée de brassage doit commencer avec des valeurs propres, mettez en haut
de son Flow Process des lignes qui les règlent, par exemple :

```
gB_Grain_Added = false
gS_Brewer_Note = ""
```

Les journées de brassage exemples le font déjà.

Installer une nouvelle version garde chaque valeur de gGlobal. Seul le **Start Fresh** de l'installateur (Règle Skynet 9.8, après son second
avertissement) les supprime, avec les Schemas.

## Pas compris {#not-included}

- Les gGlobals **Push Button** et **Pulse Button** commencent toujours relâchées (OFF), donc rien ne s'allume tout seul quand le Brain démarre.
- Une **Long String** avec un fichier texte : sa valeur est le texte du fichier, et le fichier est déjà sur le disque.

Voir aussi : [Sortes de gGlobal](108-gglobal-kinds), [Variables](04-variables), [Passer à une nouvelle version](18-updating).
