# Équipement : cuves, refroidisseurs, serpentins et raccords {#equipment-vessels-chillers-coils-and-fittings}

L'équipement est dessiné à l'écran et a des **IP** (points de raccordement) où les tuyaux commencent et finissent. Il n'est pas câblé à une carte.

## Ajouter une cuve {#add-a-vessel}

1. **Tabs > ☰ Menu > Edit layout**, choisissez **Vessel** à côté de **Add equipment**, puis touchez **Add equipment**.
2. Elle va sur le Tab **Equipment**, qui est toujours là.
3. Réglez son **Name**, son **Type** (Brew Kettle, HLT, MLT, Mash Tun, Whirlpool), son **Label** et son **Graphic** (un chemin d'image).
4. Allumez **Installed** pour chaque port de la cuve : **Outlet** (sortie), **Tangential** (entrée tangentielle), **Thermowell** (doigt de gant), **Steam Slayer**, **Sparge** (rinçage) et **CIP** (nettoyage en place). Chacun a une **Position** (par exemple Center Bottom ou Lid) et un **Standard** (par exemple TC 1.5 ou NPT 1/2 FPT).
5. **Save**. Chaque port sauf le doigt de gant devient un IP près de sa position. Le doigt de gant s'affiche comme un **T** rouge. Une petite fenêtre liste où sont allés les ports : faites glisser un IP pour l'ajuster à l'image ; il reste une partie de la cuve et bouge avec elle.

Chaque liste se termine par **Add new ...** pour que vous puissiez ajouter votre propre choix. Les choix ajoutés sont gardés pour toutes les cuves.

## Autres équipements {#other-equipment}

La même liste contient **Plate chiller** (refroidisseur à plaques), **Chilling coil** (serpentin de refroidissement), **HERMS coil**, **Trub filter** (filtre à trub), **Pipe tee** (té), **Pipe 90° elbow** (coude à 90°), **Pipe 45° elbow** (coude à 45°) et **Pipe cross** (croix). Ils marchent comme la cuve, et toutes leurs ouvertures commencent comme des IP. L'écoulement les traverse : le côté moût et le côté eau d'un refroidisseur restent séparés. Les refroidisseurs, serpentins et le filtre vont sur le Tab Equipment ; les raccords vont sur le Tab où vous êtes.

> Les tuyaux ne relient que des IP du même Tab.

## Regrouper une cuve avec ses IP (Bundle) {#bundle-a-vessel-with-its-ips}

Regrouper (bundle) verrouille une cuve et ses IP ensemble comme un seul bloc, pour que rien ne soit déplacé par accident. Regroupez-la une fois que les IP sont là où vous les voulez.

**Pour regrouper (PC ou iPhone) :**

1. Allez sur le Tab de la cuve et choisissez **☰ Menu > Edit layout**.
2. Ouvrez les propriétés de la cuve. Sur un PC, **double-cliquez** dessus. Sur un iPhone, **gardez le doigt dessus**.
3. Appuyez sur **Save**. Le panel demande **Bundle ... with its IPs?** Appuyez sur **OK** pour regrouper, ou sur **Cancel** s'il faut encore faire glisser des IP à leur place.
4. Ou allumez **Bundled** en bas de ses propriétés et appuyez sur **Save**.
5. Appuyez sur **Save layout**.

**Tant qu'elle est regroupée :**

- Elle montre un 📦 dans Edit layout.
- Faites glisser la cuve, ou l'un de ses IP, et tout l'ensemble bouge d'un bloc (sur un iPhone, faites glisser avec un doigt).
- La cuve et ses IP ne peuvent être ni redimensionnés, ni modifiés, ni supprimés. L'ouvrir ne montre que **Bundled**, **Tab** et **Clone** (une copie de la cuve et de ses IP, voir [Changer de Schema et cloner des Schemas](48-schema-switching-and-cloning#clone-a-bundled-item)).

**Pour dégrouper :** ouvrez la cuve (double-clic, ou gardez le doigt dessus), éteignez **Bundled**, appuyez sur **Save**, puis sur **Save layout**. Vous pouvez de nouveau modifier, déplacer ou supprimer ses IP.

## Déplacer un équipement vers un autre Tab {#move-equipment-to-another-tab}

Les nouvelles cuves, refroidisseurs, serpentins et filtres commencent sur le Tab **Equipment**. Pour en déplacer un vers un autre Tab :

1. Allez sur le Tab où il est et choisissez **☰ Menu > Edit layout**.
2. Ouvrez ses propriétés. Sur un PC, **double-cliquez** dessus. Sur un iPhone, **gardez le doigt dessus**.
3. Choisissez le nouveau Tab dans la liste **Tab** près du bas.
4. Appuyez sur **Save**, puis sur **Save layout**.

Le panel saute au nouveau Tab avec l'élément, et ses IP vont avec. Une cuve regroupée se déplace avec tous ses IP exactement là où ils étaient. Les tuyaux ne bougent pas, car un tuyau ne relie que des IP du même Tab ; dessinez-en donc de nouveaux sur le nouveau Tab.

Tous les autres éléments (Devices, images, textes, IP et tuyaux) ont la même liste **Tab**.

## Listes de choix et interrupteurs {#pick-lists-and-switches}

Partout où il y a un choix, vous avez une liste déroulante, et les listes qui peuvent grandir se terminent par **Add new ...** (chemins d'image, sons, unités et plus). Un réglage oui / non est un interrupteur. Les couleurs sont une liste déroulante de couleurs standard, ou **Custom ...** pour toute autre.

Les **Picture when on** et **Picture when off** (image allumé / éteint) d'une Digital Output montrent un petit aperçu : des LED, un éclair et des images de vanne à boisseau sphérique, ou **Add new ...** pour les vôtres. Les sorties PWM, Analog, Duty Cycle, Hysteresis et PID ont les deux mêmes images (voir Help 52, On and Off Pictures).
