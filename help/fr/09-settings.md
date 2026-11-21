# Admin Settings (réglages d'administration) {#admin-settings}

## Partir d'un Schema d'exemple (Admins) {#start-from-a-sample-schema-admins}

Des Schemas de brasserie tout prêts : **Two vessel, one pump**, **Three vessel, one pump** et **BrewZilla brew day**. Chaque carte démarre sur le simulateur. En charger un remplace vos Tabs, Devices et Widgets ; une copie de votre Schema actuel est d'abord enregistrée dans `config/backups` sur le Pi.

## My account (mon compte) {#my-account}

Changez votre propre mot de passe. Tous les autres téléphones ou ordinateurs connectés sous votre nom sont déconnectés.

## Users (utilisateurs, Admins) {#users-admins}

Ajoutez des personnes et donnez un rôle à chacune :

| Rôle | Peut faire |
|---|---|
| **Viewer** | Regarder seulement. |
| **Operator** | Journée de brassage : commuter pompes et vannes, régler des valeurs, lancer et arrêter des Processes, importer une recette. |
| **Admin** | Tout, y compris la disposition, les Processes, les Devices, les réglages, les utilisateurs et la modification de ce manuel. |

## Simulation (Admins)

Essayez une journée de brassage sans toucher au matériel, avec le temps qui passe plus vite ou qui saute en avant. Voir [Mode simulation](20-simulation).

## Déplacé dans Default settings {#moved-to-default-settings}

Depuis le 2026-11-21 (Règle Skynet 2.42), la **Boil temperature**, les **Panel settings** (Title, Look, Media folders, Default folders,
API key, BeerXML mapping, les Processes qui démarrent avec le serveur, la limite de redémarrages et son Alarm), les réglages **screen,
Tabs and alerts** et l'**Ordre du Menu** sont dans **☰ Menu > [Réglages par défaut](155-default-settings)**, enregistrés par son seul
**Save**. Cette page s'appelle maintenant **Admin Settings** : comptes, utilisateurs, mots de passe, Approved Devices, envoi des codes et
Patron. Default settings a un bouton **🔐 Admin Settings** qui l'ouvre.

## Pictures (images) {#pictures}

Comment les images PNG et JPG reçoivent leurs copies SVG nettes. Voir [Media (images et sons)](07-media).
