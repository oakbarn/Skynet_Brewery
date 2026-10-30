# Variables

Variables hold values that processes and screens use. The **Variables** screen lists them all with their values. Add new ones in **Tabs > ☰ Menu > Edit layout > Select Widget Type > gGlobal variables**, then **Add Widget**. The name prefixes below are suggestions; any name works.

gKonstant and gAPI became one class, **gGlobal**, on 2026-10-30 (Fritz). Sending readings to the database and letting outside programs reach an item are now settings that every Device and Widget has, so a separate API class was no longer needed. Older ones are changed when the Brain starts: see [Database and .API on every Device and Widget](98-database-and-api).

## Which kind to use

| Kind | Processes | On screen | Database and outside programs |
|---|---|---|---|
| **gGlobal** | ✓ | ✓ | When its Properties say so (**Database and .API** box) |
| **Shared** | ✓ | – | – |

- Use a **gGlobal** for settings, screen items and readings (pH, gravity, volumes). To log one, or let another program read or change it, set its **Database and .API** box.
- Use a **Shared** variable to pass a value from one process to another.

The old **Global** class (from BruControl) is retired. When a BruControl file or an older Schema is loaded, each Global becomes a gGlobal, and the list of what moved shows on the Processes page.

## gGlobal kinds

| Kind | Prefix | Notes |
|---|---|---|
| Graphic | `gG_` | The value is a picture path. A process can swap the picture. |
| String | `gGS_` | Text. |
| Long String | `gGL_` | Linked to a text file in a media folder. Edit the file and the panel follows within a second. |
| Value | `gGV_` | A number. |
| Time | `gGT_` | `00:00:00` |
| Date Time | `gGDT_` | |
| Boolean | `gGB_` | True or false. |
| Switch | `gGSW_` | A slider. It is a toggle: tap it ON and it stays ON, tap it again and it stays OFF. |
| Push Button | `gGPB_` | ON only while held, OFF as soon as you let go. Lets go by itself if the screen loses WiFi. |
| Pulse Button | `gGMB_` | A tap makes it true for a tenth of a second, however long you hold it. |
| List | `gGList_` | A dropdown (below). |
| Step | `gGStep_` | Shows the step a Process just reached. |

## Database and .API

Every gGlobal (and every other Device and Widget with a value) has a **Database and .API** box at the end of its Properties. The Variables screen shows what each gGlobal is set to, and **Log now** sends its value to the database at once. See [Database and .API on every Device and Widget](98-database-and-api).

## gGlobal List (a dropdown on a tab)

**Tabs > ☰ Menu > Edit layout > Add Widget > gGlobal variables > List (dropdown: Value + Text)** makes a dropdown. Its settings have a two-column table: **Value** (a number) and **Text**. **+ Add row** adds a choice and ✕ removes one.

Example: `gGList_BrewStatus` with 1 = Mash, 2 = Boil, 3 = Chill. On the tab the dropdown shows Mash, Boil and Chill. Picking Boil sets the value to 2, and that number is what Processes read (`if gGList_BrewStatus == 2`). A Process that sets it to 3 makes the dropdown show Chill.
