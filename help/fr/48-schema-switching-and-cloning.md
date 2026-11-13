# Changer de Schema et cloner des Schemas {#switching-and-cloning-schemas}

Un **Schema** est toute une configuration de brasserie : ses Tabs, ses Devices, ses Widgets, ses images, ses tuyaux, ses sondes, sa liste autostart, et le Equipment Profile de chaque Tab. Voir [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

## Où choisir le Schema {#where-to-pick-the-schema}

La même liste déroulante Schema est à trois endroits. Utilisez celle qui vous arrange :

- la **Menu Bar** (sur un Tab, choisissez d'abord **☰ Menu > Show Menu Bar**),
- **☰ Menu > Schema**,
- **☰ Menu > About**.

Choisir un autre Schema le charge. Seul un Admin peut charger ou changer un Schema.

Pour commencer un **nouveau** Schema, appuyez sur **☰ Menu > ➕ New Schema…**, ou sur **➕ New Schema** sur l'onglet **☰ Menu > Schema**. Voir [Step by Step: Add a Schema](188-step-by-step-add-a-schema).

L'onglet **☰ Menu > Schema** liste aussi chaque Schema du Brain : combien de Tabs il a, le Equipment Profile de chaque Tab et quand il a été enregistré pour la dernière fois, avec un bouton **Load** et un bouton **Clone** sur chacun.

## Quand des Processes tournent {#when-processes-are-running}

Charger un autre Schema arrête chaque Process en marche. Donc si un Process tourne, le panel vous prévient d'abord :

> ⚠ The Schema "Oak Barn" is active: 2 Processes are running ... Is it OK to proceed?

(Le Schema « Oak Barn » est actif : 2 Processes tournent ... Peut-on continuer ?) Appuyez sur **OK** pour continuer, ou sur **Cancel** pour rester où vous êtes. L'onglet Schema montre le même avertissement en jaune tant que des Processes tournent.

Le même avertissement apparaît pour tout ce qui recharge un Schema : **Add new Schema**, **Clone** avec **Load the clone now**, et **Restore a backup or version**.

## Tout est éteint {#everything-is-switched-off}

Quand le Schema actif change, **chaque sortie est d'abord éteinte**, pour que rien de ce que l'ancien Schema avait laissé allumé ne continue de tourner :

- les sorties numériques et les vannes (pompes, brûleurs, éléments chauffants, relais) s'éteignent ou se ferment,
- les sorties PWM et analogiques passent à 0,
- les commandes duty cycle, hysteresis et PID sont désactivées,
- les moteurs pas à pas en mouvement s'arrêtent,
- les minuteries s'arrêtent, et les alarmes et les sons se taisent.

Ensuite, le nouveau Schema est chargé, et tout est éteint encore une fois, pour qu'il démarre avec toutes les sorties éteintes quelles que soient ses valeurs de départ enregistrées. Après cela, ses Processes autostart démarrent comme d'habitude.

Les vannes manuelles se tournent à la main, donc le panel les laisse comme elles sont.

## Cloner un Schema {#clone-a-schema}

Un clone est une copie d'un Schema sous un nouveau nom. Utilisez-le pour essayer des changements sans toucher au Schema avec lequel vous brassez.

1. Choisissez **Clone a Schema ...** dans la liste déroulante Schema, ou appuyez sur **Clone** à côté d'un Schema sur l'onglet **☰ Menu > Schema**.
2. Choisissez le **Schema to clone** (le Schema à cloner). Ce n'est pas forcément celui qui est chargé.
3. Tapez un **Name of the clone** (nom du clone). Laissez-le vide et il s'appellera « <name> copy ».
4. Allumez **Load the clone now** si vous voulez y passer tout de suite. Laissez-le éteint et le Schema chargé reste chargé.
5. Appuyez sur **Save**.

Le clone reçoit tout ce qu'il y a dans le Schema, y compris ses valeurs enregistrées (gGlobals ...). Ses Tabs utilisent les mêmes Equipment Profiles, donc l'équipement et la tuyauterie restent partagés. Il commence sans version à lui. Le Schema que vous avez cloné n'est pas changé.

## Cloner un élément regroupé (Bundled) {#clone-a-bundled-item}

Une cuve regroupée et ses IP peuvent être copiés d'un seul coup :

1. Choisissez **☰ Menu > Edit layout** et double-cliquez sur la cuve regroupée.
2. Allumez **Clone: put a copy of this vessel and its IPs next to it** (mettre une copie de cette cuve et de ses IP à côté) et appuyez sur **Save**.
3. La copie est placée juste à droite de la première, toujours regroupée, nommée « <name> copy ». Les tuyaux ne sont pas copiés : dessinez-en de nouveaux vers elle.
4. Appuyez sur **Save layout** pour la garder.

Si le Tab a un Equipment Profile, la copie est dans l'**Equipment list** de ce profil dès que vous enregistrez la disposition, comme tout le reste du Tab.

Sur l'onglet **☰ Menu > Equipment Profile**, chaque cuve de la liste **Made on the Vessel tab** a aussi un bouton **Clone**. La copie s'ouvre sur l'onglet Vessel comme une nouvelle (avec la même taille, la même chauffe, la même sonde, les mêmes ports et le même réglage de regroupement). Changez ce qu'il faut, puis appuyez sur **Save** là-bas.
