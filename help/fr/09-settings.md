# Settings (réglages) {#settings}

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

## Panel settings (réglages du panel, Admins) {#panel-settings-admins}

- **Title** : le nom en haut de l'écran.
- **Look (theme)** : l'apparence de tout le Panel (Office Black, Dark Gray, White ou Skynet Night), enregistrée tout de suite. **Use this Look
  on every Tab** donne à chaque Tab les couleurs du Look, et **Put the Tabs back** l'annule. Voir [Les Looks du panneau (thèmes)](151-panel-looks).
- **Media folders** : où sont gardés les images et les sons, un par ligne.
- **API key** : le mot de passe que les autres programmes (Node-RED et autres) doivent envoyer. Voir [API (les autres programmes)](11-api).
- **BeerXML mapping** : quelles variables une recette BeerSmith remplit.
- **Start these processes when the server starts** : cochez les Processes qui doivent toujours tourner.

## Pictures (images) {#pictures}

Comment les images PNG et JPG reçoivent leurs copies SVG nettes. Voir [Media (images et sons)](07-media).
