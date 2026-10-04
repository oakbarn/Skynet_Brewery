# Variables

Variables hold values that scripts and screens use. The **Variables** screen lists them all with their values. Add new ones in **Tabs > Edit layout > Add element**. The name prefixes below are suggestions; any name works.

## Which kind to use

| Kind | Scripts | On screen | API (other programs) | Database |
|---|---|---|---|---|
| **vKonstant** | ✓ | ✓ | – | – |
| **vAPI** | ✓ | ✓ | ✓ | ✓ |
| **Global** | ✓ | ✓ | ✓ | ✓ |
| **Shared** | ✓ | – | – | – |

- Use a **vKonstant** for settings and screen items that stay inside the panel.
- Use a **vAPI** for readings you want logged or sent to other programs (pH, gravity, volumes).
- Use a **Shared** variable to pass a value from one script to another.

## vKonstant kinds

| Kind | Prefix | Notes |
|---|---|---|
| Graphic | `vK_` | The value is a picture path. A script can swap the picture. |
| String | `vKS_` | Text. |
| Long String | `vKL_` | Linked to a text file in a media folder. Edit the file and the panel follows within a second. |
| Value | `vKV_` | A number. |
| Time | `vKT_` | `00:00:00` |
| Date Time | `vKDT_` | |
| Boolean | `vKB_` | True or false. |
| Switch | `vKSW_` | A slider; tap to flip it. |
| Push Button | `vKPB_` | ON only while held. Lets go by itself if the screen loses WiFi. |
| Momentary Button | `vKMB_` | A tap makes it true for a tenth of a second. |

## vAPI kinds

String `vAS_`, Value `vAV_`, Time `vAT_`, Date Time `vADT_`, Boolean `vAB_`.

## Database trigger

For vAPI and Globals, press **Change…** on the Variables screen to choose when the value is written to the database:

- **Off**, **Manual** (a `log` line in a script, or Log now), or **Once**.
- **On demand**: when a chosen script starts.
- **Every N** milliseconds, seconds, minutes, hours or days (fastest is 100 ms).
- **At clock time**, for example every day at `12 AM`.

The written values appear on the [Log](06-log) screen.
