# L'onglet Vessel {#the-vessel-tab}

L'onglet **Vessel** (dans le **☰ Menu**) configure une cuve du Equipment Profile à la fois. Les refroidisseurs, les serpentins et les filtres à trub s'ouvrent aussi ici. Un profil peut avoir autant de cuves qu'il vous faut.

1. Appuyez sur **☰ Menu** et choisissez **Vessel**. Il travaille sur le profil ouvert dans l'onglet Equipment Profile, ou sur le profil du Tab où vous êtes.
2. Choisissez une cuve dans la liste déroulante, ou **Add new vessel ...**.
3. Remplissez ses réglages (plus bas), puis appuyez sur **Save**.
4. **Save and put on Equipment tab** la dessine aussi sur le Tab Equipment avec ses ports en IP.

**Delete** la retire du profil. Si elle est dessinée sur un Tab, le dessin y reste.

## Type

**HLT** (cuve d'eau chaude), **Brew Kettle** (cuve d'ébullition), **Mash Tun** (cuve d'empâtage), **RIMS**, **HERMS**, **Fermenter** (fermenteur) ou **Other** (autre). Pour Other, tapez ce que c'est dans **Other Type** (par exemple « Grant »).

## Taille {#size}

- **Size** (taille) et **Dead space** (volume mort, ce qui reste au fond), en gallons ou en litres (les Units du profil).
- **Extra trub loss** (perte de trub supplémentaire).
- **Graphic** : l'image dessinée sur le Tab.

## Chauffe {#heat}

La liste **Heat Source** (source de chaleur) dépend du Type :

| Type | Sources de chaleur |
|---|---|
| HLT, Brew Kettle, RIMS, HERMS | Gas, Electric, Other |
| Mash Tun | Gas, Electric, RIMS, HERMS, Other, Unheated |
| Other | Gas, Electric, RIMS, Other, Unheated |
| Fermenter | aucune |

Choisissez ensuite l'appareil qui la chauffe :

- **Gas** : une vanne dont le **Service** est **Gas**. Réglez le Service d'une vanne dans ses propriétés (Edit layout, double-cliquez sur la vanne) : Gas, Room Temperature Liquid (liquide à température ambiante), ou High Temperature Liquid (Stainless Steel) (liquide chaud, inox).
- **Electric** : une sortie dont le **Kind** est **element (electric heating element)**, ou une sortie PID, hysteresis, duty cycle ou PWM.
- **RIMS** ou **HERMS** : un tube RIMS ou une cuve HERMS de ce profil.
- **Other** : tapez ce que c'est.

## Sonde de température {#temperature-probe}

La liste **Temperature Probe** montre les sondes de la même carte (Interface) que l'appareil de chauffe, pour que la sonde et le chauffage soient sur la même Mega. Si la cuve n'est pas chauffée, ou si aucun appareil de chauffe n'est encore choisi, toutes les sondes sont listées.

## Fermenteur {#fermenter}

Un Fermenter a ses propres réglages :

- **Largest batch** et **Smallest batch** : le plus gros et le plus petit brassin qu'il peut contenir.
- **Trub loss** (ce qui reste dans le fermenteur). La vérification des volumes de l'onglet Equipment Profile l'utilise.
- **Graphic**, **Name** et **Temperature Probe**.
- **Report the temperature every** (envoyer la température toutes les) un nombre de **Minutes**, **Hours** ou **Days**.

La densité, l'ABV, le CO2 et les dates d'un brassin iront sur l'onglet Fermentation (plus tard).

## Ports et construction {#ports-and-build}

Les ports sont les mêmes que sur le Tab Equipment : allumez chaque port qu'elle a, et réglez sa **Position** et son **Standard**. Laissez **Bundled** actif pour la mettre sur le Tab comme un seul bloc avec ses IP. Voir [Equipment](14-equipment).
