# Special characters in names

This page lists every key on the keyboard that isn't a letter or a number, and what it does in a Skynet name. It covers the names of
Devices, Widgets, gGlobals and the other items a Process uses by name (Rule 3.4). It also says which marks cause trouble on Windows,
Mac, Linux (the Raspberry Pi Brain) or MQTT (messages between boxes).

**The rule (OakBarn Brewery, 2026-11-11):** a name has only **letters, numbers, `_`, `~` and `@`**, and starts with a letter or `_`.
Every other mark is a **No**. Such a name works everywhere: in a Process with no quotes, in a file name on Windows, Mac and Linux,
on a phone, in a web link, and in MQTT.

- **Labels may have any mark.** A Label is only shown. In the Suggested Name each mark becomes `~`, and an accent is dropped
  (*Würze #2* gives `Wurze~~2`).
- **Tab and Interface names** are shown names (*Brew House*, *Brewery Mega*), so they only follow the Windows list below. Their IDs
  (`BH`, `BM`) are plain.
- **Older names** with a No mark are changed once, when their Schema loads: each mark becomes `~` (`_2` if the name is taken). Every
  Process and setting that uses the name follows (Rule 15.2).

## Yes: Skynet's own marks

| Mark | Name | What it does in a name | Example |
|---|---|---|---|
| `_` | underscore | Separates the parts of a name: Interface, Port, Type, Label, Tab. | `BM_22_DO@Pump_Red~Pump_BH` |
| `~` | tilde | Stands for a space, or any No mark, typed in the Label. | Label *Red Pump* is `Red~Pump` |
| `@` | at | Joins the General Type and the Device Type, in the name and wherever the Device Type is shown (a `:` can't be in a name). | `DO@Pump`, `PWM@Pump`, `DO@H_Element` |

All three are safe on Windows, Mac, Linux and MQTT. A `~` only means "home folder" on Linux and Mac when it starts a word, and a
name never starts with one.

## No: every other mark

**Win** = Windows, **Mac**, **Lin** = Linux (the Brain), **MQTT**, **Proc** = a Skynet Process. ✖ means it causes trouble there.

| Mark | Name | Win | Mac | Lin | MQTT | Proc | The trouble |
|---|---|---|---|---|---|---|---|
| `<` `>` | less, greater than | ✖ | | ✖ | | ✖ | Not allowed in Windows file names. On Linux they send a command's output to a file. In a Process they compare. |
| `:` | colon | ✖ | ✖ | | | ✖ | Not allowed in Windows file names. The Mac Finder shows it as `/`. In a Process it writes a time (`1:30`). Use `@`. |
| `"` | double quote | ✖ | | ✖ | | ✖ | Not allowed in Windows file names. In a Process it starts and ends text. |
| `/` | slash | ✖ | ✖ | ✖ | ✖ | ✖ | A folder separator on every computer, and a level separator in MQTT. In a Process it divides, and `//` starts a comment. |
| `\` | backslash | ✖ | | ✖ | | | A Windows folder separator (`C:\Brewing`). On Linux it escapes the next key. |
| `\|` | bar | ✖ | | ✖ | | ✖ | Not allowed in Windows file names. On Linux it pipes one command into another. `\|\|` is *or* in a Process. |
| `?` | question mark | ✖ | | ✖ | | | Not allowed in Windows file names. On Linux it's a wildcard. Starts the end of a web link. |
| `*` | star | ✖ | | ✖ | | ✖ | Not allowed in Windows file names. On Linux it's a wildcard. Multiplies in a Process. |
| space | space | | | ✖ | | ✖ | Splits words on Linux and in a Process. In a Label it becomes `~`. |
| `.` | period | | ✖ | ✖ | | ✖ | A leading dot hides a file on Mac and Linux. Starts an attribute in a Process (`Pump.visible`). |
| `,` | comma | | | | | ✖ | Separates a list (a Graph's list of names). |
| `-` | dash | | | ✖ | | ✖ | Minus in a Process (`Red-Pump` reads as *Red minus Pump*). A leading `-` reads as an option on Linux. |
| `+` | plus | | | | ✖ | ✖ | A wildcard in MQTT (one level). Adds in a Process. |
| `#` | number sign | | | ✖ | ✖ | ✖ | A wildcard in MQTT (all levels). Starts a comment in a Process and on Linux. Cuts a web link short. |
| `$` | dollar | | | ✖ | ✖ | ✖ | Starts a variable on Linux. A topic that starts with `$` is kept for the MQTT server. Not a name mark in a Process. |
| `` ` `` | backquote | | | ✖ | | ✖ | Runs a command on Linux. Hard to see, and easy to mistake for `'`. |
| `'` | apostrophe | | | ✖ | | ✖ | Starts and ends text on Linux. Starts a comment in a Process. |
| `!` | exclamation | | | ✖ | | ✖ | Repeats an old command on Linux. *Not* in a Process (`!=`). |
| `=` | equals | | | | | ✖ | Sets a value in a Process (`Pump = true`). |
| `%` | percent | ✖ | | | | | Breaks Windows .bat files (`%PATH%`) and web links. |
| `^` | caret | ✖ | | | | ✖ | Escapes the next key in Windows .bat files. *To the power of* in a Process. |
| `&` | and | ✖ | | ✖ | | ✖ | Runs a second command on Windows and Linux. Starts a new part of a web link. `&&` is *and* in a Process. |
| `(` `)` | round brackets | | | ✖ | | ✖ | Group commands on Linux and math in a Process. |
| `[` `]` | square brackets | | | ✖ | | ✖ | A wildcard on Linux. `[Mash]` is a place a Process can `goto`. |
| `{` `}` | curly brackets | | | ✖ | | ✖ | Expand on Linux. Group steps in a Process. `{value}` is a Code Value Widget's value. |
| `;` | semicolon | | | ✖ | | ✖ | Ends a command on Linux. Separates two steps on one line of a Process. |
| accents, `°` `©` `·` | not on the keyboard | | | | | ✖ | Hard to type, and a Process reads only plain letters. In a Label an accent is dropped (*é* is *e*), any other mark is `~`. |

Also never in a name: emoji, control characters, a space at the start or end, and the Windows names CON, PRN, AUX, NUL, COM1-9 and
LPT1-9 (Rule 3.4). MQTT also never takes the hidden NUL character.

---
Rules: 3.1 (Device names), 3.3 (no spaces), 3.4 (allowed characters), 3.11 (names are locked once built), 15.2 (older Schemas).
Help: [Allowed names](../help/63-allowed-names.md), [Interface IDs, Tab IDs and Device names](../help/46-interface-tab-device-names.md).
