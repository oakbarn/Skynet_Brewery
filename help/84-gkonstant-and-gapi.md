# gKonstant and gAPI (new names)

On 2026-10-28 Fritz renamed the two variable classes:

| Was | Now | What it is |
|---|---|---|
| **vKonstant** | **gKonstant** | A variable for Processes and the screen only. Never in the API or the database. |
| **vAPI** | **gAPI** | A variable for Processes, the screen, the API and the database. |

Everything on screen, in the Help, in the Process editor colors and predictive text, and in the Notepad++ colors file now says gKonstant and gAPI.

## Suggested name prefixes

A new variable's suggested name now starts with **gK** (gKonstant) or **gA** (gAPI). The letters after them still tell the kind, the same as before:

| gKonstant kind | Prefix | | gAPI kind | Prefix |
|---|---|---|---|---|
| Graphic | `gK_` | | String | `gAS_` |
| String | `gKS_` | | Value | `gAV_` |
| Long String | `gKL_` | | Time | `gAT_` |
| Value | `gKV_` | | Date Time | `gADT_` |
| Time | `gKT_` | | Boolean | `gAB_` |
| Date Time | `gKDT_` | | | |
| Boolean | `gKB_` | | | |
| Switch | `gKSW_` | | | |
| Push Button | `gKPB_` | | | |
| Pulse Button | `gKMB_` | | | |
| List | `gKList_` | | | |
| Step | `gKStep_` | | | |

Prefixes are a hint, never required: any allowed name works.

## Your older Schemas and Processes

Everything is brought up to the new standard; the old words are not kept (Skynet Rule 15.2). The first time the Brain starts after this update:

- Every vKonstant becomes a gKonstant and every vAPI a gAPI, in every Schema.
- Every gKonstant or gAPI whose name starts `vK..._` or `vA..._` is renamed `gK..._` or `gA..._` (`vKV_Strike` becomes `gKV_Strike`). If that name is taken, `_2` is added.
- It is the same item (its hidden key stays), so everything that uses it follows: **every Process**, other Devices and Widgets that point to it, saved values, the BeerXML mapping and the brew database history.
- The old files are kept as `.before-gnames.bak` copies, and the list of what changed shows on the Processes page.
- A Schema file from before this update is changed the same way when it is loaded.
- The sample Schemas and demo Processes that come with Skynet already use the new names.

## The API

The web API address is now **`/api/gapi`** (see [The API](11-api)). `/api/vapi` is gone: a program that used it must change to `/api/gapi`. Programs that use a renamed variable's name (Node-RED, Home Assistant over MQTT) must use the new name too.

## Importing

A BruControl `RP_...` Global now comes in as a gAPI named `gA_...` (it used to be `vA_...`), and a `gbl...` Global becomes a gKonstant with the same name. See [Variables](04-variables).
