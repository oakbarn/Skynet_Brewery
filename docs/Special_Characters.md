# Special characters in names

Every key on the keyboard that isn't a letter or a number, and what it does in a Skynet name. It covers the names of Devices,
Widgets, Interfaces, Tabs and the other items (Rule 3.4, Rule 3.11). It also covers file and folder names.

**The short answer:** letters, numbers, `_`, `~` and `@` are the safe ones. A name made of only those works everywhere: in a
Process with no quotes, in a Windows file name, on a phone, in a web link and in the Brain.

## Skynet's own marks

These are already used in every Suggested Name (Rule 3.1). Each one means one thing:

| Mark | Name | What it does in a name | Example |
|---|---|---|---|
| `_` | underscore | Separates the parts of a name: Interface, Port, Type, Label, Tab. | `BM_22_DO@Pump_Red~Pump_BH` |
| `~` | tilde | Stands for a space in the Label, and for any blocked mark typed in the Label. | Label *Red Pump* is `Red~Pump` |
| `@` | at | Stands for the `:` between the General Type and the Device Type (OakBarn Brewery, 2026-11-11). | *DO: Pump* is `DO@Pump` |

## Still free

These don't cause trouble anywhere and Skynet doesn't use them yet. Each one needs a small change before a Process reads it with
no quotes, the same change `@` got. **They aren't allowed in names yet.** They can only be added if OakBarn Brewery gives one a job.

| Mark | Name | Easy to type? | Notes |
|---|---|---|---|
| `$` | dollar | Yes | Safe in Windows file names, web links and the Brain. It looks like money (`Pump$1`). |
| `` ` `` | backquote | Yes (top left key) | Safe in file names, but it's so small it's easy to miss or mistake for `'`. Not recommended. |

## Blocked: never in a name

Windows does not allow these in file and folder names, so Skynet refuses them in every name (Rule 3.4). If you type one in a Label,
the Label keeps it, and the name gets a `~` in its place.

| Mark | Name | Why |
|---|---|---|
| `:` | colon | Windows file names. In a Process it also writes a time (`1:30`). Use `@` (General Type) or `~`. |
| `<` `>` | less than, greater than | Windows file names. In a Process they compare (`<` `>` `<=` `>=`). |
| `"` | double quote | Windows file names. In a Process it starts and ends text (`"Hello"`). |
| `/` | slash | Windows file names, and folders on the Brain. In a Process it divides. `//` starts a comment. |
| `\` | backslash | Windows folders (`C:\Brewing`). |
| `\|` | bar | Windows file names. In a Process `\|\|` means *or*. |
| `?` | question mark | Windows file names, and web links. |
| `*` | star | Windows file names. In a Process it multiplies. |

Also never in a name: emoji, control characters, a space or dot at the very start or end, and the Windows names CON, PRN, AUX, NUL,
COM1-9 and LPT1-9 (Rule 3.4).

## Allowed in a name you type, but trouble

You may type these in a name of your own, but every one of them already does a job somewhere. Each one means the name needs
"quotes" around it every time a Process uses it (`"Red-Pump".state = true`). Some cause trouble in other places too. **Skynet never
puts them in a Suggested Name.** In a Label they are fine, since a Label is only shown.

| Mark | Name | The trouble |
|---|---|---|
| space | space | Not allowed in a Device or Process name (Rule 3.3). In a Label it becomes `~`. |
| `.` | period | Starts an attribute in a Process (`Pump.visible`). No leading dot (Rule 3.4). In a Label it becomes `~`. |
| `,` | comma | Separates a list (a Graph's list of names). In a Label it becomes `~`. |
| `-` | dash | Minus in a Process (`Red-Pump` reads as *Red minus Pump*). |
| `+` | plus | Adds in a Process. A wildcard in MQTT (talking to other boxes). |
| `=` | equals | Sets a value in a Process (`Pump = true`). |
| `!` | exclamation | *Not* in a Process (`!=`). |
| `#` | number sign | Starts a comment in a Process (the rest of the line is skipped). Cuts a web link short. A wildcard in MQTT. |
| `'` | apostrophe | Starts a comment in a Process (the Visual Basic way). |
| `%` | percent | Breaks Windows .bat files (`%PATH%`) and web links. |
| `^` | caret | *To the power of* in a Process. Escapes the next key in Windows .bat files. |
| `&` | and | `&&` is *and* in a Process. Runs a second command in Windows .bat files. Starts a new part of a web link. |
| `(` `)` | round brackets | Group math in a Process. |
| `[` `]` | square brackets | A line like `[Mash]` is a place a Process can `goto`. |
| `{` `}` | curly brackets | Group steps in a Process. `{value}` stands for a Code Value Widget's value. |
| `;` | semicolon | Separates two steps on one line of a Process. |

## Not on the keyboard

Marks like the middle dot `·`, the degree sign `°` or `©` are safe in file names, but they're hard to type (Alt + four numbers on
Windows, a long press on a phone). Skynet doesn't use them in names.

---
Rules: 3.1 (Device names), 3.3 (no spaces), 3.4 (allowed characters), 3.11 (every name is treated the same).
Help: [Interface IDs, Tab IDs and Device names](../help/46-interface-tab-device-names.md).
