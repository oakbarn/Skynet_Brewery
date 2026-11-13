# Brancher un flexible QD depuis un Process {#connect-a-qd-hose-from-a-process}

Le jour du brassage, le même flexible passe souvent d'une cuve à l'autre. Un Process peut dire où va ensuite le **flexible à raccord rapide (Quick Disconnect)** (aide 127),
puis attendre qu'une personne l'y ait vraiment mis (Règle Skynet 5.34).

## La ligne {#the-line}

```
Hose_1.connect = QD_1          // onto a Quick Disconnect (the red star) on the hose's Tab
Hose_1.connect = Mash_Tun      // into the top of a Vessel Widget or a Vessel Device
Hose_1.connect = none          // take it off: the end is loose, no flow
```

Ces trois lignes branchent le flexible sur un raccord rapide (l'étoile rouge) de son Tab, le mettent dans le haut d'une cuve, ou le débranchent (le bout est libre, pas de débit).

- **Hose_1** est le Name du flexible (Skynet nomme les flexibles Hose_1, Hose_2 ...). Son Label marche aussi quand aucun autre élément n'a ce Label.
- Après le `=` vient le **Name** d'un Quick Disconnect, d'un simple IP, ou d'une cuve (Vessel Widget ou Vessel Device) sur le
  **même Tab** que le flexible. Pas besoin de guillemets.
- Une cuve marche comme si vous traîniez à la main le bout du flexible dans le **tiers supérieur de la cuve** : tout le tiers supérieur est l'IP QD de la
  cuve, et le flexible est dessiné passant par-dessus le bord et descendant dedans.

## Ce qui se passe {#what-happens}

1. Le flexible est **dessiné tout de suite là où il va**, sur chaque écran, pour que vous voyiez où il doit être.
2. Une fenêtre dit **PUT Hose_1 in the top of Mash_Tun** (ou *on QD_1*), et le flexible **clignote** sur son Tab. Si vous êtes sur un autre
   Tab, **Go to** vous y emmène.
3. Le Process **attend**, comme pour une vanne manuelle (Règle 5.13), qu'un opérateur ou un admin déplace le vrai flexible et appuie sur
   **✔ Done: the hose is on**.

Si le flexible y est déjà, rien n'est demandé et le Process continue directement. **Stop** sur le Process enlève la fenêtre.
Le bouton Override ne la passe pas : le flexible doit être placé.

## Le déplacer à la main demande aussi {#moving-it-by-hand-asks-too}

Quand une personne traîne le bout du flexible (bouton droit de la souris, ou un doigt, aide 127), Skynet demande **"Is the real hose there now?"** (le vrai flexible est-il là maintenant ?).
**OK** le garde ; **Cancel** remet le bout là où il était. Ainsi l'écran montre toujours où est le vrai flexible.

## Texte prédictif et Check {#predictive-text-and-check}

- Tapez `Hose_1.` et la liste montre **connect** et **flow_Color**. Après `Hose_1.connect = ` la liste montre d'abord les Quick
  Disconnects, puis les cuves, puis les IP du Tab du flexible, et **none**.
- **🔍 Check** trouve un flexible qui n'est pas un flexible Quick Disconnect, un nom qui n'est pas sur le Tab du flexible, une cuve sans haut
  (un refroidisseur), et `+=` ou un `if` sur `.connect` (il est seulement réglé, avec `=`).
