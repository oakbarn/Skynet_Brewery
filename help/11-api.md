# API (other programs)

Other programs, such as Node-RED or Home Assistant, can read and set **vAPI** variables. vKonstant and Shared variables are never in the API.

Programs send the **API key** from **Settings** in the header `X-API-Key: <key>` (or `?key=<key>` at the end of the address). Without a key, reading only works from your own network, and changes are refused.

| Request | Does |
|---|---|
| `GET /api/vapi` | All vAPI variables with values |
| `GET /api/vapi/<name>` | One vAPI variable |
| `PUT /api/vapi/<name>` with `{"value": 152}` | Set one |
| `POST /api/vapi` with `{"name1": v1, "name2": v2}` | Set several |
| `POST /api/import/beerxml` with the XML file | Import a recipe |
| `POST /api/log/<name>` | Write a value to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values |
| `GET /api/log.csv?...` | The same as CSV |

The old `/api/globals/...` addresses still work and do the same.
