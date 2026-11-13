# Cuves Skynet {#skynet-vessels}

Une **cuve Skynet** est un Tab_Vessel fait à partir d'un Skynet Vessel Template (un Skynet Vessel Widget, voir [Ajouter une cuve](66-add-a-vessel)) : une bouilloire, un HLT, une cuve d'empâtage, un tout-en-un, etc. Comme un [Raccords Skynet](60-skynet-fittings), c'est un seul bloc :

- **Chaque ouverture a un IP intégré**, là où le Template le met sur l'image. Chacun marche dans les deux sens.
- Les IP ne peuvent être ni déplacés, ni réglés, ni retirés, et la cuve ne peut pas être dégroupée. Les raccords groupés sur ses orifices lui appartiennent et bougent avec elle.
- Ses **Properties** n'ont aucun réglage d'orifice ou d'IP.

Les cuves que vous faites à partir d'un Template groupé de l'utilisateur gardent leurs réglages d'orifices : vous placez les IP et les groupez vous-même. Voir [Modèles de cuves et de raccords](50-vessel-and-fitting-templates).

## Ses Properties {#its-properties}

En **Edit layout**, double-cliquez sur la cuve (ou sur un de ses IP). Vous réglez :

- **Name**, **Type** et **Label** (avec son interrupteur **Show label**).
- **Graphic** : elle commence avec l'image Skynet et peut être changée comme sur tout autre Widget. Les IP restent sur les ouvertures de l'image Skynet.
- **Heating Element: Select Device or None**, sur une cuve électrique. La marque **E** sur l'image montre où entre la résistance. Elle brille tant que ce Device est On.
- **Temperature Probe: Select Temperature Probe or None**, sur une cuve avec un doigt de gant (la marque **T**).
- **Flip Horizontal**, **Flip Vertical** et **Rotate** (par pas de 45 degrés), comme un [Raccords Skynet](60-skynet-fittings). L'image tourne, et ses IP et les raccords sur ses orifices (avec leurs bouchons) tournent avec elle autour du milieu de la cuve. Tournée de 90 ou 270 degrés, la case de la cuve tourne aussi, donc une bouilloire haute se couche en largeur.
- Les réglages du Label, le Tab, la place et la taille. Faites glisser le coin pour l'agrandir ou la rapetisser : les IP restent sur leurs ouvertures.

Double-cliquer sur un raccord d'un de ses orifices ouvre les propres Properties de ce raccord.

## Bouilloires et HLT électriques {#electric-kettles-and-hlts}

Les bouilloires Skynet électriques (celles dont le nom finit par **_Electric**, plus **HLT** et **Brew_Kettle**) ont :

- un **Outlet** (sortie) avec un raccord de vanne,
- un **Thermowell** (doigt de gant) au-dessus de la sortie, pour la sonde de température,
- une place pour la **résistance** (la marque E, en bas sur le côté droit).

## Bouilloires tout-en-un {#all-in-one-kettles}

Elles ont la résistance intégrée, elles n'existent donc qu'en Templates électriques. Le panel ne peut pas lire leurs propres thermomètres, il n'y a donc pas de sonde à choisir.

| Template | Aspect |
|---|---|
| **Kettle_Brewzilla_Electric** | Haute, bras de recirculation sur le côté gauche, robinet en bas au milieu |
| **Kettle_DigiBoil_Electric** | Haute avec un couvercle bombé, robinet en bas au milieu |
| **Kettle_DigiBoil** | Une DigiBoil réglée à la main : interrupteurs Power et Heater, consigne et écran, robinet BSP. Voir [DigiBoil et Brewzilla, réglées à la main](158-digiboil-and-brewzilla) |
| **Kettle_Brewzilla_65L** | Une Brewzilla de 65 L réglée à la main : interrupteurs Pump et 3 Heater, consigne et écran avec On/Off et Run, robinet BSP et vanne de sortie de pompe. Voir [DigiBoil et Brewzilla, réglées à la main](158-digiboil-and-brewzilla) |
| **Kettle_Grainfather_Electric** | Haute sur un socle noir, bras de recirculation sur le côté droit et par-dessus le couvercle, sortie en bas au milieu |
| **Kettle_Foundry_Electric** | Large et basse avec un couvercle noir, vanne de vidange sur l'avant près du bas |

Les images sont de simples dessins sans nom ni logo de fabricant.

## Anciens Tab_Vessels {#older-tab-vessels}

Les Tab_Vessels venant d'un Template Skynet d'avant ce changement deviennent tout seuls des cuves Skynet. Si vous avez fait glisser un de leurs IP ailleurs, ouvrez les Properties de la cuve et appuyez sur **Save** : les IP retournent sur leurs ouvertures.
