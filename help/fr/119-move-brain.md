# Déplacer le Brain {#move-brain}

Skynet tourne de la même façon sur un **Raspberry Pi** et sur un **ordinateur Windows, Linux ou Mac** (Règle Skynet 1.7). Beaucoup de gens commencent avec
un ordinateur comme Brain et passent à un Pi plus tard. **☰ Menu > Move Brain** (Admins) déplace tout en trois étapes (Règle Skynet 9.9) :

1. Sur l'**ancien** Brain : faites un **fichier de déménagement du Brain** (Brain Move file).
2. Sur le **nouveau** Brain : faites entrer le fichier. Le panel redémarre avec tout ce qui venait de l'ancien Brain.
3. Sur le **nouveau** Brain : changez les **ports USB** pour les noms du nouveau Brain.

Ça marche dans tous les sens : d'un ordinateur vers un Pi, d'un Pi vers un ordinateur, ou d'un ordinateur à un autre.

## Ce qui est déplacé {#what-moves}

Tout ce qui est à vous :

- **Schemas** : chaque Schema, ses Tabs, Devices, Widgets, Interfaces, tuyaux et images sur les Tabs, et les sauvegardes quotidiennes des Schemas.
- **Réglages** : chaque réglage du panel (page Settings, MQTT and voice, règles de mot de passe, ordre du Menu, Styles ...), les Equipment
  Profiles, les profils Mash, Boil, Water, Tab et Valve, les recettes, vos propres Templates de cuves, de raccords, de Devices et de Processes.
- **Processes**, et les Processes de la corbeille.
- **Images et sons** dans le dossier media du Brain.
- **Valeurs enregistrées** : chaque gGlobal garde sa valeur (Règle Skynet 1.22), pour chaque Schema.
- **Connexions** : chaque utilisateur, mot de passe et rôle, et le code de récupération. Vous vous connectez sur le nouveau Brain avec le nom d'utilisateur
  et le mot de passe de l'**ancien** Brain.
- **Le journal de brassage** : chaque mesure de la base de données, et les réglages des messages (SMS et e-mail).

Pas déplacés : les connexions des navigateurs (chacun se reconnecte une fois), et les images d'**autres** dossiers media que vous avez ajoutés dans
Settings > Media folders. Le panel les liste ; copiez-les avec la page [File Move](32-file-move).

## Faire le fichier de déménagement du Brain {#make-the-brain-move-file}

Sur l'**ancien** Brain, ouvrez **☰ Menu > Move Brain** :

1. Tapez deux fois un **Move password** (mot de passe de déménagement, au moins 6 caractères). Le fichier est **verrouillé** avec lui, car il contient vos connexions et les
   clés cachées (Règle Skynet 3.10). Personne ne peut ouvrir le fichier sans lui, donc une copie oubliée sur une clé USB ne craint rien.
2. Cliquez sur **⬇ Make a Brain Move file**. Tout est d'abord enregistré, puis le fichier se télécharge dans le dossier Téléchargements de cet ordinateur,
   avec un nom comme `Skynet_Brain_Move_20261103T162600.skynetmove` (la date et l'heure où il a été fait).

Faire le fichier ne change rien sur l'ancien Brain. Gardez l'ancien Brain tel quel jusqu'à ce que le nouveau marche bien.

## Le faire entrer sur le nouveau Brain {#bring-it-in-on-the-new-brain}

1. **Installez Skynet** sur le nouveau Brain de la façon normale (sur un Pi : `bash install-skynet-brewer.sh`, voir [Installing](19-installing)),
   faites la création de l'Admin, et connectez-vous.
2. Ouvrez **☰ Menu > Move Brain** sur le nouveau Brain. Faites-le depuis un navigateur sur un ordinateur qui a le fichier de déménagement (l'ancien
   ordinateur convient : tapez l'adresse du Pi, par exemple `http://skynet-pi:8080`), ou copiez le fichier avec une clé USB.
3. Sous **2. On the NEW Brain**, choisissez le fichier, tapez le **Move password** et cliquez sur **⬆ Bring in the file**. Le panel vérifie
   le fichier et dit d'où il vient et combien de fichiers il contient. Un mauvais mot de passe ou un fichier abîmé est refusé, et rien n'est
   changé.
4. Cliquez sur **🚚 Move in now** et répondez **OK**. Chaque sortie s'éteint et les Processes qui tournent s'arrêtent. Le panel s'arrête et, en
   redémarrant, les fichiers de l'ancien Brain prennent la place de ceux du nouveau.
   - Sur un **Pi** (Skynet tourne comme service), il redémarre tout seul après quelques secondes. Rechargez la page après environ 15 secondes.
   - Sur un **ordinateur**, la fenêtre Skynet Brewer se ferme : double-cliquez sur **Skynet Brewer** pour le redémarrer, puis rechargez la page.
5. **Connectez-vous avec le nom d'utilisateur et le mot de passe de l'ancien Brain.** La console des Processes dit que le déménagement est fini.

Rien n'est supprimé : les propres dossiers config, data, scripts et media du nouveau Brain sont gardés dans
`backups/before_brain_move_<date and time>`, avec une copie du fichier de déménagement.

## Ports USB {#usb-ports}

Une carte en USB a un nom de port différent sur chaque sorte de Brain : **COM3** sous Windows, **/dev/ttyACM0** (un Mega ou un Uno) ou
**/dev/ttyUSB0** (beaucoup de cartes ESP32 et Nano) sur un Pi ou Linux, **/dev/cu.usbmodem14101** sur un Mac. Après le déménagement, branchez les
cartes sur le nouveau Brain et ouvrez **☰ Menu > Move Brain**. Sous **3. USB ports** :

- Chaque ancien port est listé une fois, avec les Interfaces (et leurs Schemas) qui l'utilisent, et la carte que l'ancien Brain y voyait.
- **Change to** liste les ports USB que ce Brain voit maintenant. Une carte que l'ancien Brain voyait est **trouvée par son numéro de série et choisie
  pour vous**. Quand il ne reste qu'une carte, elle est choisie aussi. Vérifiez chacune.
- **Keep** laisse le port tel quel (pour une carte pas encore branchée). Cliquez sur **🔄 Look again** après en avoir branché une.
- Cliquez sur **💾 Save USB ports**. Chaque Schema qui utilise ce port change tout de suite, et les cartes du Schema chargé se reconnectent.

Vous pouvez utiliser **USB ports** à tout moment, pas seulement après un déménagement, par exemple après avoir branché une carte sur une autre prise USB.
Les Interfaces en **Ethernet** ou **WiFi** gardent leur adresse et n'ont besoin de rien. Une carte sur le **Simulator** garde son vrai port USB pour
plus tard, et ce port est changé aussi.
