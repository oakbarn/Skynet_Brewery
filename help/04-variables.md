# Variables

Variables hold values that processes and screens use. The **Variables** screen lists them all with their values. Add new ones in **Tabs > ☰ Menu > Edit layout > Select Widget Type > gKonstant variables** (or **gAPI variables**), then **Add Widget**. The name prefixes below are suggestions; any name works. gKonstant and gAPI were called vKonstant and vAPI before 2026-10-28; older ones are renamed when the Brain starts: see [gKonstant and gAPI (new names)](84-gkonstant-and-gapi).

## Which kind to use

| Kind | Processes | On screen | API (other programs) | Database |
|---|---|---|---|---|
| **gKonstant** | ✓ | ✓ | – | – |
| **gAPI** | ✓ | ✓ | ✓ | ✓ |
| **Shared** | ✓ | – | – | – |

- Use a **gKonstant** for settings and screen items that stay inside the panel.
- Use a **gAPI** for readings you want logged or sent to other programs (pH, gravity, volumes).
- Use a **Shared** variable to pass a value from one process to another.

The old **Global** class (from BruControl) is retired. When a BruControl file or an older Schema is loaded, each Global becomes a gKonstant or a gAPI by its name, and the list of what moved shows on the Processes page.

## gKonstant kinds

| Kind | Prefix | Notes |
|---|---|---|
| Graphic | `gK_` | The value is a picture path. A process can swap the picture. |
| String | `gKS_` | Text. |
| Long String | `gKL_` | Linked to a text file in a media folder. Edit the file and the panel follows within a second. |
| Value | `gKV_` | A number. |
| Time | `gKT_` | `00:00:00` |
| Date Time | `gKDT_` | |
| Boolean | `gKB_` | True or false. |
| Switch | `gKSW_` | A slider. It is a toggle: tap it ON and it stays ON, tap it again and it stays OFF. |
| Push Button | `gKPB_` | ON only while held, OFF as soon as you let go. Lets go by itself if the screen loses WiFi. |
| Pulse Button | `gKMB_` | A tap makes it true for a tenth of a second, however long you hold it. |

## gAPI kinds

String `gAS_`, Value `gAV_`, Time `gAT_`, Date Time `gADT_`, Boolean `gAB_`.

## Database trigger

For gAPI variables, press **Change…** on the Variables screen to choose when the value is written to the database:

- **Off**, **Manual** (a `log` line in a process, or Log now), or **Once**.
- **On demand**: when a chosen process starts.
- **Every N** milliseconds, seconds, minutes, hours or days (fastest is 100 ms).
- **At clock time**, for example every day at `12 AM`.

The written values appear on the [Log](06-log) screen.

## gKonstant List (a dropdown on a tab)

**Tabs > ☰ Menu > Edit layout > Add Widget > gKonstant variables > List (dropdown: Value + Text)** makes a dropdown. Its settings have a two-column table: **Value** (a number) and **Text**. **+ Add row** adds a choice and ✕ removes one.

Example: `gKList_BrewStatus` with 1 = Mash, 2 = Boil, 3 = Chill. On the tab the dropdown shows Mash, Boil and Chill. Picking Boil sets the value to 2, and that number is what Processes read (`if gKList_BrewStatus == 2`). A Process that sets it to 3 makes the dropdown show Chill.
