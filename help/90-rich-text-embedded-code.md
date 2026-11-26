# Rich Text Embedded Code

Rich Text Embedded Code is a short code, starting with a backslash `\`, that you type inside text to change how it looks. It works in every text the panel shows: a Text on a Tab, Labels, Device and Widget Names and Values, string values a Process sets, `print` lines in the Process output, and pop-ups such as a manual valve's message. In a Process, put the code inside the text in quotes (Skynet Rule 3.19).

## Looks (switches)

These are switches: the first code turns the look on and the next one turns it off.

| Code | What it does | Example | Shows |
|---|---|---|---|
| `\b` | bold on / off | `Add \bhops\b now` | Add **hops** now |
| `\i` | italic on / off | `\iWhirlpool\i 15 min` | *Whirlpool* 15 min |
| `\u` | underline on / off | `\uDo not\u open` | Do not (underlined) open |
| `\s` | strikethrough on / off | `\sOld\s New` | ~~Old~~ New |
| `\L` | large text on / off | `\LSTRIKE\L 165` | STRIKE in large letters |
| `\S` | small text on / off | `Mash \S(step 2)\S` | (step 2) in small letters |
| `\_` | subscript on / off | `CO\_2\_` | CO₂ |
| `\^` | superscript on / off | `ft\^3\^` | ft³ |

## Color

| Code | What it does | Example |
|---|---|---|
| `\c{Red}` | the text after it is red | `\c{Red}HOT\c 212\degF` |
| `\c` | back to the normal color | |

Use any panel color name: Red, Green, Blue, Yellow, Orange, Purple, Copper, Brown, Steel grey, Light grey, White (Opaque), White (Transparent), Black (plain White is White (Opaque)). Capital letters and spaces don't matter (`\c{steelgrey}` works), and a color code like `\c{#ff8800}` works too. A name that is not a color stays on the screen as it is typed, so you can see the mistake.

## Signs and spacing

| Code | What it does | Example | Shows |
|---|---|---|---|
| `\n` | a new line | `Mash in\nStir well` | Mash in, then Stir well on the next line |
| `\t` | an indent (about four spaces wide) | `Mash in\n\tStir well` | Stir well, pushed in, on the next line |
| `\deg` | a degree sign | `45\deg elbow` | 45° elbow |
| `\degF` | degrees F | `152\degF` | 152°F |
| `\degC` | degrees C | `66\degC` | 66°C |
| `\dFC` | °F or °C, whichever your Default is | `Mash at 152\dFC` | Mash at 152°F (US) or 152°C (Metric) |
| `\ohm` | an Ohm sign | `9.6\ohm` | 9.6Ω |
| `\+-` | a plus-minus sign | `152\degF \+-2` | 152°F ±2 |
| `\\` | one backslash | `C:\\Brewing` | C:\Brewing |

**`\dFC` only changes the letter, not the number.** It shows °F when your Default units are US and °C when they are Metric (the **Temperatures** unit on the ☰ Menu > Default tab, the same one the Ctrl+Shift+D key uses). The number in front of it is whatever you typed, so `152\dFC` shows 152°C on a Metric panel. Use it for words that fit both, like `Temperature (\dFC)`, or in a Process where the number already comes in your units.

## New lines and word wrap

Word wrap is always on in every Text Box and Label: a long text goes onto more lines by itself. Rich Text takes care of a new line where you want one: `\n` starts a new line, and `\t` an indent.

## Rich Text shortcut keys

These keys type the codes for you, in every text and string box ([Shortcut keys](113-shortcut-keys)):

| Windows and Linux | Mac | What it types |
|---|---|---|
| **Shift + Enter** | **Shift + Enter** | `\n`, a new line |
| **Ctrl + B** | **⌘ + B** | `\b` before and after the words picked (bold); with nothing picked, `\b\b` with the cursor in between |
| **Ctrl + Shift + D** | **⌘ + Shift + D** | **°F** or **°C**, as Units says |

Phones and tablets with no keyboard do not have these keys: type the codes by hand.

## Good to know

- Codes can be used together: `\L\b\c{Red}BOIL\c\b\L 60 min`.
- Letters matter: `\S` and `\L` are capital letters, and `\i`, `\u`, `\s`, `\c`, `\t` and `\n` are small ones. `\b` and `\B` are both bold.
- A code that is not on this page stays on the screen as it is typed.
- To show a real backslash, as in a folder name, type two: `C:\\Brewing`. A single one could turn into a code (`\b` is bold, `\i` is italic).
- Use `\t` and `\n` to lay text out, not extra spaces: a Label can't start or end with a space (they are trimmed).
- The size of large text is **\L Rich Text Code Size (px)** in **☰ Menu > Default settings** (under **Rich Text Embedded Code**), in pixels. It has to be bigger than normal text (18), and it is 28 when the box is empty. Large text is always at least a quarter bigger than the text around it, so it still stands out in an item with a big font. Small text is three quarters of the text around it.
- The color names are the same list as the color dropdowns in the Properties dialogs.
