# API (other programs)

Other programs, such as Node-RED, Home Assistant, a spreadsheet or a phone app, can read and change **any Device or Widget whose .API setting is on** (its Properties, **Database and .API** box):

- **Off** (the start): not in the API at all.
- **Get only**: other programs can read it.
- **Get and Put**: other programs can read it and change it.

Programs send the **API key** from **Settings** in the header `X-API-Key: <key>` (or `?key=<key>` at the end of the address). Without a key, reading only works from your own network, and changes are refused.

| Request | Does |
|---|---|
| `GET /api/items` | Everything whose .API is on, with its main value |
| `GET /api/items/<name>` | One item: its main value and all its attributes |
| `GET /api/items/<name>/<attribute>` | One attribute, for example `/api/items/HLT_PID/target` |
| `PUT /api/items/<name>` with `152` or `{"value": 152}` | Change its main value (Get and Put only) |
| `PUT /api/items/<name>` with `{"target": 152, "enabled": true}` | Change several attributes |
| `PUT /api/items/<name>/<attribute>` with `152` | Change one attribute |
| `POST /api/items` with `{"name1": v1, "name2": v2}` | Change several main values |
| `POST /api/import/beerxml` with the XML file | Import a recipe |
| `POST /api/log/<name>` | Send its reading to the database now |
| `GET /api/log?name=&from=&to=&limit=` | Readings in the database (an item's older names included) |
| `GET /api/log.csv?...` | The same as CSV |

`/api/gapi` and `/api/globals` are gone (Skynet Rule 15.2): a program that used them changes to `/api/items`.

## Safeguards

- Readings that come from a board (a probe's temperature, an input) are never changed from outside, and neither is a **Manual Valve Widget** (only a click on its Tab turns it).
- Only attributes can be changed, never a name, Tab, Interface, port or picture.
- **Ten wrong API keys** from one address within 10 minutes shut that address out for 15 minutes, so a bot can't guess the key.
- Every change from outside is written in the Processes console (`API (address): name.attribute = value`), so you can see what a program did.
- Reach the Brain from outside your home only through Tailscale (never open a port on the router).
