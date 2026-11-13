# Changement de nom et clés cachées {#name-change-and-hidden-keys}

Chaque élément qui a un nom reçoit une **clé cachée** dès qu'il est enregistré la première fois : Devices, Widgets, variables, Texts, IP, tuyaux, cuves, raccords, Tabs, Interfaces, Processes, Templates et Profiles. Vous ne voyez jamais la clé et vous ne la tapez jamais. C'est ainsi que le panel sait « c'est le même élément » après que vous lui avez donné un nouveau nom.

Grâce à la clé, vous pouvez tout renommer à tout moment, et chaque Process qui utilise l'ancien nom est changé pour le nouveau à votre place.

## Le Name est verrouillé {#the-name-is-locked}

Une fois un élément enregistré, son **Name** dans les Properties est verrouillé (🔒). À côté se trouve le bouton **✏ Change name**.

1. Double-cliquez sur l'élément pour ouvrir ses Properties (en Edit layout pour les choses sur un Tab).
2. Appuyez sur **✏ Change name**. La fenêtre **Name Change** s'ouvre.
3. **Name now** montre le nom qu'il a (vous ne pouvez pas changer cette case).
4. Tapez le nouveau nom dans **New name**.
5. Appuyez sur **💾 Save** pour le garder, ou sur **✖ Cancel** pour laisser le nom tel qu'il était.
6. Appuyez sur **💾 Save** dans les Properties, puis sur **Save layout**.

Un nouvel élément pas encore enregistré a une case Name ouverte, vous pouvez donc y taper directement son premier nom.

La même fenêtre sert à renommer un **Process** (page Processes > **Rename**) et un **Schema** (liste des Schemas > **Rename this Schema ...**).

## Ce qui suit le nouveau nom {#what-follows-the-new-name}

- **Chaque Process.** `Pump_A = on` devient `Pump_Main = on`, et `Pump_A.visible` devient `Pump_Main.visible`. Seul le nom entier est changé, majuscules et minuscules comprises (voir [Renommer des Devices et des Widgets](53-renaming) pour les détails).
- **Un Process qui tourne en ce moment continue de marcher.** Il trouve toujours l'élément par sa clé cachée. La prochaine fois qu'il démarre, il utilise le nouveau nom.
- **Les Processes qui démarrent d'autres Processes.** Renommez un Process et les lignes qui le démarrent ou l'arrêtent suivent, de même que la liste Autostart.
- **Les clones.** Un clone se souvient de l'élément dont il a été cloné. Renommez le premier élément et l'ancien nom dans le nom de chaque clone change aussi : renommez `HLT` en `Hot_Liquor_Tank` et `HLT copy` devient `Hot_Liquor_Tank copy`. Un clone que vous avez renommé vous-même, ou dont le nouveau nom est déjà pris, reste tel quel.
- **Les tuyaux, chauffages et autres réglages** qui pointent vers l'élément le suivent, et sa valeur actuelle reste avec lui.

## Ce que vous ne pouvez pas faire avec la clé {#what-you-can-t-do-with-the-key}

- Vous ne pouvez la voir sur aucun écran, ni dans le Config Editor, ni dans un fichier de Schema enregistré.
- Vous ne pouvez pas l'utiliser dans un Process. Les Processes utilisent toujours des noms.
- Les **chemins** d'images et de sons ne sont pas des noms et n'ont pas de clé. Ils marchent comme avant.

## Les boutons de chaque fenêtre {#buttons-on-every-pop-up}

Chaque fenêtre utilise les mêmes boutons, chacun avec une icône et son mot :

| Bouton | Ce qu'il fait |
|---|---|
| ✖ Cancel | Ferme et n'enregistre rien |
| 💾 Save | Enregistre et ferme |
| ✖ Close | Ferme une fenêtre qui n'a rien à enregistrer |
| 🗑 Delete | Supprime (il demande d'abord) |
| ✔ OK | Ferme un message après que vous l'avez lu |

Voir aussi [Renommer des Devices et des Widgets](53-renaming), [Caractères permis dans les noms](63-allowed-names) et [Les noms des Interfaces, des Tabs et des Devices](46-interface-tab-device-names).
