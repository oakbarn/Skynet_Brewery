# API (les autres programmes) {#api-other-programs}

D'autres programmes, comme Node-RED, Home Assistant, un tableur ou une application de téléphone, peuvent lire et changer **tout Device ou Widget dont le réglage .API est actif** (ses Properties, case **Database and .API**) :

- **Off** (au départ) : pas du tout dans l'API.
- **Get only** : les autres programmes peuvent le lire.
- **Get and Put** : les autres programmes peuvent le lire et le changer.

Les programmes envoient l'**API key** (clé d'API) de **Settings** dans l'en-tête `X-API-Key: <key>` (ou `?key=<key>` à la fin de l'adresse). Sans clé, la lecture ne marche que depuis votre propre réseau, et les changements sont refusés.

| Requête | Ce qu'elle fait |
|---|---|
| `GET /api/items` | Tout ce dont le .API est actif, avec sa valeur principale |
| `GET /api/items/<name>` | Un élément : sa valeur principale et tous ses attributs |
| `GET /api/items/<name>/<attribute>` | Un attribut, par exemple `/api/items/HLT_PID/setpoint` |
| `PUT /api/items/<name>` avec `152` ou `{"value": 152}` | Change sa valeur principale (Get and Put seulement) |
| `PUT /api/items/<name>` avec `{"setpoint": 152, "enabled": true}` | Change plusieurs attributs |
| `PUT /api/items/<name>/<attribute>` avec `152` | Change un attribut |
| `POST /api/items` avec `{"name1": v1, "name2": v2}` | Change plusieurs valeurs principales |
| `POST /api/import/beerxml` avec le fichier XML | Importe une recette |
| `POST /api/log/<name>` | Envoie sa lecture à la base de données maintenant |
| `GET /api/log?name=&from=&to=&limit=` | Les lectures dans la base de données (y compris les anciens noms d'un élément) |
| `GET /api/log.csv?...` | La même chose en CSV |

`/api/gapi` et `/api/globals` ont disparu (Règle Skynet 15.2) : un programme qui les utilisait passe à `/api/items`.

## Garde-fous {#safeguards}

- Les lectures qui viennent d'une carte (la température d'une sonde, une entrée) ne sont jamais changées de l'extérieur, pas plus qu'un **Manual Valve Widget** (seul un clic sur son Tab la tourne).
- Seuls les attributs peuvent être changés, jamais un nom, un Tab, une Interface, un port ou une image.
- **Dix clés d'API fausses** venant d'une même adresse en 10 minutes bloquent cette adresse pendant 15 minutes, pour qu'un robot ne puisse pas deviner la clé.
- Chaque changement venant de l'extérieur est écrit dans la console des Processes (`API (address): name.attribute = value`), pour que vous voyiez ce qu'un programme a fait.
- N'atteignez le Brain depuis l'extérieur de chez vous que par Tailscale (n'ouvrez jamais de port sur la box).
