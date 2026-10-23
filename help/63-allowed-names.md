# Allowed characters in names

Some characters can't be used in names, because they break Processes, or because Windows, Mac or Linux can't save a file with them. When a name is not allowed, the panel tells you why in a message at the bottom of the screen, and nothing is saved until you fix it.

Names you already have are never changed or refused. Only a **new** name, or a name you **change**, is checked.

## Device and Widget names

A Device or Widget name can't have:

- control characters (hidden characters that sometimes come along with a copy and paste)
- a space at the start or the end (spaces in the middle become `_` for you)
- a dot `.` at the start
- emoji, like 🍺 or ✅
- one of the names Windows keeps for itself: `CON`, `PRN`, `AUX`, `NUL`, `COM1` to `COM9`, `LPT1` to `LPT9`

`CON_2` or `COM10` are fine: only the exact names are kept by Windows.

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
