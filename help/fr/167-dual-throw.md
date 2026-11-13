# Dual Throw : un second Port toujours à l'opposé {#dual-throw-a-second-port-that-is-always-the-opposite}

Certaines vannes ont **deux fils de commande** : un fil fait **ouvrir** la vanne, l'autre la fait **fermer**. Certains moteurs tournent en avant
sur un relais et en arrière sur un autre. Les deux demandent deux sorties qui ne sont **jamais en marche en même temps**. Dans Skynet, c'est un seul Digital Out
avec un second Port **Dual Throw** (Règle Skynet 6.22).

## Comment il bascule {#how-it-switches}

| Le Device est | Son propre Port | Le second Port |
|---|---|---|
| **ON** | en marche | arrêté |
| **OFF** | arrêté | en marche |

Quand il change, le Port qui passe à l'**arrêt** s'arrête d'abord. L'autre Port se met **en marche** après le **Dual Throw delay**, donc les deux
Ports ne sont jamais en marche ensemble. Pour une vanne motorisée, câblez le fil **Open** de la vanne sur le Port propre du Device et son fil **Close** sur
le second Port : ON ouvre la vanne, OFF la ferme.

## Le régler {#setting-it-up}

1. Ouvrez les **Properties** du Device (un Digital Out ou une vanne motorisée), ou la case **Add Device**.
2. Choisissez son **Interface** et son **Port**, puis cliquez sur le **⬢** à côté de l'Interface pour ouvrir **Pin attributes**.
3. Choisissez le **Dual Throw: second Port**. Seuls les Ports libres de la même Interface sont listés. **None** veut dire pas de second Port.
4. Tapez le **Dual Throw delay** en millisecondes (1000 = 1 seconde). Vide veut dire 0, les deux basculent en même temps, celui qui s'arrête en premier.

Le second Port appartient maintenant à ce Device : aucun autre Device ne peut l'utiliser (un port d'Interface, un Device, Règle 6.1).
**Invert** (broche LOW = en marche) inverse les deux Ports.

## Bon à savoir {#good-to-know}

- **OFF met le second Port en marche.** Quand tout est arrêté (un autre Schema est chargé), une vanne Dual Throw passe à OFF, donc son
  fil Close est alimenté et la vanne se ferme. Seule une liaison perdue entre le Brain et la carte arrête les deux Ports.
- Une **résistance chauffante** et une **vanne manuelle** n'ont pas de Dual Throw.
