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

## Panel settings: screen, Tabs and alerts (Admins) {#panel-settings-screen-tabs-and-alerts-admins}

Ceux-ci changent les choses déjà faites et la façon dont tout le panel marche, pour chaque Schema (ils étaient avant sur l'onglet Default ; Règle Skynet 2.42). Ce avec quoi commence une **nouvelle** chose est dans [Réglages par défaut](155-default-settings).

- **Tabs** : **Tab Style**, l'aspect de chaque Tab qui n'a pas de Tab Style à lui ([Tab Styles](101-tab-styles)).
- **Menu Bar** : cacher la Menu Bar sur les Tabs ([La barre de menus](40-menu-bar)).
- **Sound** : **Sound on** (cet écran, tout de suite) et **Turn Sound On when starting**.
- **On startup** : le Zoom et le plein écran avec lesquels le panel démarre ([Zoom et plein écran](41-zoom-and-full-screen)).
- **Rich Text Embedded Code** : **\L Rich Text Code Size (px)**.
- **Hover Help** : **Hover Delay (ms)** ([L'aide au survol dans les boîtes de dialogue](147-hover-help)).
- **Phones and tablets** : peuvent-ils modifier, et déplacer les choses ([Téléphones et tablettes](45-phones-and-tablets)).
- **Grain weight label** et le label des points de densité ([L'onglet Recipe](99-recipe-tab)).
- **Hop alerts** : minutes d'avertissement, alertes réunies, un son, les dire à voix haute, et la voix du navigateur.
- **Order of the Menu** : tapez un numéro pour déplacer un onglet de menu.

Appuyez sur **Save** en dessous.

## Pictures (images) {#pictures}

Comment les images PNG et JPG reçoivent leurs copies SVG nettes. Voir [Media (images et sons)](07-media).
