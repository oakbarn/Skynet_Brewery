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

- **Nothing breaks.** Variables you already made with `vK..._` or `vA..._` names keep their names and keep working in every Process, in the database log, in the API and over MQTT.
- If you want the new prefix on an old variable, change it yourself with **✏ Change name** in its Properties (see [Name Change and hidden keys](80-name-change-and-hidden-keys)). Processes follow the new name.
- The sample Schemas and demo Processes that come with Skynet already use the new names.

## The API

The web API address is now **`/api/gapi`** (see [The API](11-api)). The older addresses `/api/vapi` and `/api/globals` still work and do the same.

## Importing

A BruControl `RP_...` Global now comes in as a gAPI named `gA_...` (it used to be `vA_...`), and a `gbl...` Global becomes a gKonstant with the same name. See [Variables](04-variables).
