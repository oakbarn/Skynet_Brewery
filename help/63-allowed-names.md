# Allowed characters in names

Some characters can't be used in names, because they break Processes, or because Windows, Mac or Linux can't save a file with them. When a name is not allowed, the panel tells you why in a message at the bottom of the screen, and nothing is saved until you fix it.

Only a **new** name, or a name you **change**, is checked. The one exception is the list of characters below: older names that have them are changed for you (see **Older names** further down).

## Device, Widget and Interface names

A Device, Widget or Interface name can't have:

- any of these: `<` `>` `:` `"` `/` `\` `|` `?` `*`

- control characters (hidden characters that sometimes come along with a copy and paste)
- a space at the start or the end (spaces in the middle become `_` for you)
- a dot `.` at the start
- emoji, like 🍺 or ✅
- one of the names Windows keeps for itself: `CON`, `PRN`, `AUX`, `NUL`, `COM1` to `COM9`, `LPT1` to `LPT9`

`CON_2` or `COM10` are fine: only the exact names are kept by Windows.

Use `~` or `_` instead: `Hot~Cold` or `Hot_Cold`, not `Hot/Cold`. A Suggested Device name already does this with your Label: each of these characters (and `.` `,`) becomes a `~`.

### Older names

When the panel starts, or a Schema is opened, a Device, Widget or Interface name that still has one of `<` `>` `:` `"` `/` `\` `|` `?` `*` is changed once: each of them becomes a `~` (`Pump:1` becomes `Pump~1`; if that name is taken, `Pump~1_2`). It is the same item (it keeps its hidden key), and:

- the screen still shows the old name (it becomes the Label, unless the item already had one)
- every Process follows: `"Pump:1".visible` becomes `"Pump~1".visible`
- settings that point to it, pipes, saved values and the brew log follow too
- the old files are kept: `brewery.before-safe-names.bak` in the config folder and `<Process>.txt.before-safe-names.bak` in the scripts folder

The Process Log says what was renamed.

## File and folder names

This covers pictures and sounds you upload or rename in the Media manager, new folders, files sent with the **File Move Utility**, and **Process** names (each Process is a file, `scripts/<name>.txt`).

A file or folder name can't have:

- any of these: `<` `>` `:` `"` `/` `\` `|` `?` `*`
- control characters
- a space at the start or the end
- a dot `.` at the start
- emoji
- one of the Windows names `CON`, `PRN`, `AUX`, `NUL`, `COM1` to `COM9`, `LPT1` to `LPT9`, even with a file ending (`CON.txt` is not allowed either)

A period `.` is allowed **only before the file ending**:

| Name | Allowed? |
|---|---|
| `Mash_Steps.txt` | yes |
| `Burner No Flame.png` | yes |
| `Burner.No.Flame.png` | no, use `Burner_No_Flame.png` |
| `Mash_v1.2` as a Process name | no, a Process name has no period: use `Mash_v1_2` |
| `My.Pictures` as a folder | no, a folder has no period |

In a zip file you upload, a file whose name is not allowed is skipped, and the list of skipped files says why.
