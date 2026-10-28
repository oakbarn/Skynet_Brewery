# API (other programs)

Other programs, such as Node-RED or Home Assistant, can read and set **gAPI** variables. gKonstant and Shared variables are never in the API.

Programs send the **API key** from **Settings** in the header `X-API-Key: <key>` (or `?key=<key>` at the end of the address). Without a key, reading only works from your own network, and changes are refused.

| Request | Does |
|---|---|
| `GET /api/gapi` | All gAPI variables with values |
| `GET /api/gapi/<name>` | One gAPI variable |
| `PUT /api/gapi/<name>` with `{"value": 152}` | Set one |
| `POST /api/gapi` with `{"name1": v1, "name2": v2}` | Set several |
| `POST /api/import/beerxml` with the XML file | Import a recipe |
| `POST /api/log/<name>` | Write a value to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Logged values |
| `GET /api/log.csv?...` | The same as CSV |

The old `/api/vapi/...` and `/api/globals/...` addresses still work and do the same.
