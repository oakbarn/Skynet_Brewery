# Database and .API on every Device and Widget

Since 2026-10-30 (Fritz) any Device or Widget that has a value can send its readings to the brew database, and can be read or changed by outside programs. Both are set in its Properties, in the **Database and .API** box at the end. Because of this, gKonstant and gAPI became one variable class, **gGlobal** (below).

Pictures, Labels and manual vessels have no value, so they have no box.

## Database

**Send to the database** says when a reading is written:

| Choice | Writes |
|---|---|
| **Off** | Never (the start) |
| **On demand** | Only when asked: a `send_db` line in a Process, **Log now** on the Variables screen, or the API |
| **On value change** | Every time the value changes, at most 10 times a second (the last change is never lost) |
| **When a Process starts** | Each time the Process you pick starts |
| **Once** | One time after the Brain starts (**Once again** on the Variables screen arms it again) |
| **At a date and time (once)** | One time, at the date and time you type, like `2026-11-01T06:00` |
| **Every N milliseconds / seconds / minutes / hours / days** | Every N of them (fastest is 100 ms) |
| **Every 00:00:00** | Every interval you type, like `00:05:00` |

The **Every** choices can have a clock time: **Every 1 days at 12 AM** writes at midnight every day; **Every 6 hours at 1 AM** writes at 1 AM, 7 AM, 1 PM and 7 PM.

**What to send** is its main value (a probe's temperature, an output's on/off, a timer's time ...) unless you pick one of its other attributes, like a PID's `.target`.

### Send it now from a Process

```
send_db HLT_Temp
send_db "gGV_Mash_pH"
```

`send_db Name` writes the reading at once, whatever its frequency. It was `log Name`; older Processes are changed to `send_db` when the Brain starts (Skynet Rule 15.2).

### Time and hidden key

Each reading is kept with its **time** and the item's **hidden key** (the name it had then is kept too). So when an item is renamed with ✏ Change name, the [Log](06-log) screen, CSV downloads and the API still find all of its readings under today's name. The key never leaves the Brain: lists and CSV files show names.

The database is a SQLite file on the Brain (`data/brewlog.db`): free, SQL, nothing to install. On a Raspberry Pi, use an SD card big enough for the readings you keep. Sending the readings to an outside database (on your PC, Mac or Linux computer, or a free or paid cloud database) and emptying the Brain's copy is a later step.

## .API

| Choice | Outside programs (web API, MQTT, Home Assistant, voice) |
|---|---|
| **Off** | Can't see it (the start) |
| **Get only** | Can read it |
| **Get and Put** | Can read it and change it |

The addresses and the safeguards are on [API (other programs)](11-api). A gGlobal shows up in MQTT and Home Assistant only when its .API is on, and can be changed there only with **Get and Put**.

## gGlobal (one variable class)

gKonstant and gAPI are now one class, **gGlobal**, with name prefixes `gG_`, `gGS_`, `gGV_`, `gGT_`, `gGDT_`, `gGB_`, `gGSW_`, `gGPB_`, `gGMB_`, `gGList_`, `gGStep_` (hints only). See [Variables](04-variables).

The first time the Brain starts after this update (Skynet Rule 15.2, nothing old is kept):

- Every gKonstant and gAPI (and any vKonstant or vAPI still around) becomes a gGlobal, in every Schema.
- Names starting `gK..._`, `gA..._` (or `vK..._`, `vA..._`) become `gG..._`: `gKV_Strike` is `gGV_Strike`, `gAS_Note` is `gGS_Note`. If the new name is taken, `_2` is added.
- A former gAPI keeps its database trigger as its **Database** setting and gets **.API = Get and Put**, so it works as before. A former gKonstant starts with Database Off and .API Off.
- It is the same item (its hidden key stays), so every Process, the other Devices and Widgets that point to it, saved values, the BeerXML mapping and the brew database history follow the new name.
- `log Name` lines in Processes become `send_db Name`.
- The old files are kept as `.before-gglobal.bak` copies, and the list of what changed shows on the Processes page.
- A BruControl import brings every Global in as a gGlobal: `RP_...` becomes `gG_...` with .API Get and Put, and `gbl...` keeps its name with .API Off.
