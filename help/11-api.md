# API (other programs)

Other programs, such as Node-RED or Home Assistant, can read and set **Globals** and **vAPI** variables. vKonstant and Shared variables are never in the API.

Programs send the **API key** from **Settings** in the header `X-API-Key: <key>` (or `?key=<key>` at the end of the address). Without a key, reading only works from your own network, and changes are refused.

| Request | Does |
|---|---|
| `GET /api/globals` | All Globals with values |
| `GET /api/globals/<name>` | One Global |
| `PUT /api/globals/<name>` with `{"value": 152}` | Set one |
| `POST /api/globals` with `{"name1": v1, "name2": v2}` | Set several |
| `POST /api/import/beerxml` with the XML file | Import a recipe |
| `POST /api/log/<name>` | Write a value to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values |
| `GET /api/log.csv?...` | The same as CSV |

`/api/vapi/...` works the same way as `/api/globals/...`.
