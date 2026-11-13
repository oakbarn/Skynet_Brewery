# API_Name : le nom que dit une commande vocale {#api-name-the-name-a-voice-command-says}

Chaque Device et Widget qui a une valeur a une case **API_Name** dans sa fenêtre **Database and .API** (le ⬢ à côté de
Database and .API dans ses Properties). C'est une String (du texte), et c'est le nom qu'utilise une **Voice Command** (commande vocale, Règle Skynet 6.18). Il n'est que dans la fenêtre Database and .API.

## Unique

**Un API_Name doit être unique.** Deux éléments du même Schema ne peuvent pas avoir le même API_Name. Les majuscules et les espaces en trop ne
comptent pas, donc `Mash Temp`, `mash temp` et `Mash  Temp` sont le même API_Name. Enregistrer un nom déjà utilisé dit quel élément
l'a, et rien n'est enregistré tant qu'il n'est pas changé.

Nommez-le comme vous le direz. Par exemple, une pompe dont l'API_Name est **Red Pump** se commande en disant
**"Turn on Red Pump"**. D'autres : `Hot Liquor`, `Mash Temp`. Les espaces sont permises. Ces caractères sont interdits :
`< > : " / \ | ? *`. 60 caractères au plus.

## Vide {#blank}

L'API_Name peut rester vide. La fenêtre montre alors un avertissement :

> ⚠ API_Name is blank: a Voice Command can't be used for this item.

(L'API_Name est vide : aucune commande vocale ne peut servir pour cet élément.) L'élément marche toujours sur son Tab, dans les Processes, dans la base de données et dans l'API web par son Name. Seule une commande vocale ne peut pas
l'atteindre.

## Où il sert {#where-it-is-used}

- **Home Assistant (Alexa, Google Home, Siri)** : l'API_Name est le nom que l'élément reçoit là-bas et sur vos enceintes. Sans
  API_Name, son Label est utilisé, comme avant. L'élément doit quand même avoir son **.API** activé (Read Only pour le lire, Read & Control pour
  le changer) : l'API_Name n'ouvre rien à lui seul.
- **L'API web** (`/api/items`) : on peut demander un élément par son Name ou par son API_Name, par exemple
  `/api/items/Red%20Pump` ou `/api/items/Red_Pump` (un `_` dans l'adresse remplace une espace). La liste montre l'
  `apiName` de chaque élément.
- Les **Voice Commands** dans Skynet lui-même sont une étape future ; elles utiliseront l'API_Name.

L'API_Name n'est pas le Name de l'élément : le Name (Règle Skynet 3.1) reste ce qu'utilisent les Processes, et changer l'API_Name
ne change jamais un Process.

Voir aussi [Database and .API](98-database-and-api).
