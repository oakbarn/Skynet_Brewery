# Résistances intégrées à une cuve {#heating-elements-built-into-a-vessel}

Ce qui se passe quand une résistance est intégrée à un Vessel Device, et comment marchent ses Properties (Règles Skynet 2.47, 3.16, 6.1 et 6.28).

## Un Clone : un Device, plusieurs endroits {#a-clone-one-device-many-places}

Un Clone (Règle Skynet 4.4) n'est pas un nouveau Device. Lui et son Device ont **un seul jeu de Properties** : changez l'un et l'autre change.
Mettez-en un en marche et ils sont tous en marche. Pensez à un Device et ses Clones comme à UN SEUL.

![Un Device et ses Clones ne font qu'un](help_pictures/Clone_Hive_Cube.svg)

## Une Integrated Instance {#an-integrated-instance}

Quand vous intégrez à un Vessel Device une résistance qui est déjà sur un Tab, Skynet crée une **Integrated Instance** (instance intégrée) de celle-ci. Ce
n'est pas un Clone. Elle commence comme une copie des Properties de cette résistance, et à partir de là elle est **indépendante** : elle a sa propre
marche et son propre arrêt, sa propre méthode de chauffe, son propre Setpoint et son propre aspect. Changer l'une ne change jamais l'autre. La résistance sur
son Tab reste où elle est.

Il peut y avoir plus d'une Instance de la même résistance, par exemple une dans la HLT et une dans la cuve d'ébullition.

**Elles utilisent toutes le même Port d'Interface**, le Port de la résistance dont elles viennent. Une Instance ne peut pas changer son Interface ni son
Port (ils sont grisés). Rien d'autre ne peut utiliser ce Port.

Une Instance ressemble plus à **Bob** du Bobiverse (*We Are Legion*) qu'à un Clone : elle commence comme une copie puis suit son propre chemin.

![Bob du Bobiverse](help_pictures/Bobiverse_Bob.png)

*Image : la [page Bob du Wiki Bobiverse](https://bobiverse.fandom.com/wiki/Bob) (Fandom, CC BY-SA).*

**La dernière commande** (Règle 6.28, « Un pour tous, tous pour un ») : une seule d'entre elles peut être en marche à la fois.

![Un pour tous, tous pour un](help_pictures/Three_Musketeers.png)

- En mettre une en marche prend le Port. Les autres sur ce Port s'arrêtent.
- En arrêter une arrête le Port. Toutes celles qui y sont sont alors arrêtées.

## Dans un Process {#in-a-process}

Chaque Device intégré à un Vessel Device (une résistance, une sonde ou un Thermowell) est appelé par le nom de la cuve, un point et son propre
nom : `HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = On` (Règle Skynet 5.31). Son nom seul est refusé, pour qu'un Process dise toujours de quelle
cuve il parle. Le nom propre d'une Instance est déjà le nom de la cuve, un point et le nom de la résistance. Les majuscules ne comptent pas.
Quand un Device ou une cuve est renommé, chaque Process est changé pour vous.

| Ligne | Ce qu'elle fait |
|---|---|
| `HLT_Vessel.hE_1 = on` | met en marche l'Instance de la HLT |
| `HLT_Vessel.hE_1.setpoint = 152` | règle le Setpoint de l'Instance de la HLT |
| `hE_1 = off` | arrête la résistance sur le Tab |

Une espace dans le nom d'une cuve devient `_` dans ce nom.

## Ses Properties {#its-properties}

Double-cliquez sur une résistance intégrée en Edit layout pour ouvrir **Integrated Heating Element Device**.

- **Pas de Hidden Locked.** Un élément intégré n'a pas d'interrupteur Hidden Locked. Si un ancien Schema en a un réglé, il est ignoré. **Visible**
  marche toujours.
- **Bulles d'aide :** posez la souris sur Visible, sur le cadenas ou sur n'importe quel nom de la case pour voir ce qu'il fait.
- **La bulle du Label** nomme votre Label et montre votre Suggested Name avec la partie Label en rouge, par exemple
  MB_22_DO@H_Element_**HLT~Element**_BH. Les espaces d'un Label deviennent ~ dans le nom. Le ⬢ rouge à côté du Label règle sa police, sa taille et ses couleurs ; le
  ⬆ rouge ouvre une case de texte à 2 lignes.

## Le Suggested Name suit le Label {#the-suggested-name-follows-the-label}

Tapez un nouveau Label (ou choisissez une autre Interface, un autre Port, Type ou Tab) et le **Suggested Name** sous le Name change tout de suite. Le Name
lui-même ne change que quand vous le changez.

Pour changer le Name, appuyez sur **✏ Change name**. La case **Name Change** montre le nom actuel, une case pour le nouveau nom et le Suggested
Name. Ses boutons :

- **✖ Cancel** garde le nom.
- **💾 Save** enregistre le nom que vous avez tapé.
- **💾 Update to Suggested** enregistre le Suggested Name d'un clic. Un Process ou un Schema n'a pas de Suggested Name, donc là il est grisé.

Chaque Process qui utilise l'ancien nom est changé pour le nouveau à votre place.
