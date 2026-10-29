# Rich Text Embedded Code

Rich Text Embedded Code is a short code, starting with a backslash `\`, that you type inside text to change how it looks. It works in every text the panel shows: a Text on a Tab, Labels, Device and Widget Names and Values, string values a Process sets, `print` lines in the Process output, and pop-ups such as a manual valve's message. In a Process, put the code inside the text in quotes.

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
| `\c{Red}` | the text after it is red | `\c{Red}HOT\c 212\F` |
| `\c` | back to the normal color | |

Use any panel color name: Red, Green, Blue, Yellow, Orange, Purple, Copper, Brown, Steel grey, Light grey, White, Black. Capital letters and spaces don't matter (`\c{steelgrey}` works), and a color code like `\c{#ff8800}` works too. A name that is not a color stays on the screen as it is typed, so you can see the mistake.

## Signs and spacing

| Code | What it does | Example | Shows |
|---|---|---|---|
| `\n` | a new line | `Mash in\nStir well` | Mash in, then Stir well on the next line |
| `\t` | an indent (4 spaces) | `\tStep 1` | &nbsp;&nbsp;&nbsp;&nbsp;Step 1 |
| `\deg` | a degree sign | `152\degF` | 152°F |
| `\F` | degrees F | `152\F` | 152°F |
| `\C` | degrees C | `66\C` | 66°C |
| `\ohm` | an Ohm sign | `9.6\ohm` | 9.6Ω |
| `\+-` | a plus-minus sign | `152\F \+-2` | 152°F ±2 |
| `\\` | one backslash | `C:\\Brewing` | C:\Brewing |

## Good to know

- Codes can be used together: `\L\b\c{Red}BOIL\c\b\L 60 min`.
- Letters matter: `\F`, `\C`, `\S` and `\L` are capital letters, and `\i`, `\u`, `\s`, `\c`, `\t` and `\n` are small ones. `\b` and `\B` are both bold.
- A code that is not on this page stays on the screen as it is typed.
- To show a real backslash, as in a folder name, type two: `C:\\Config`. A single one could turn into a code (`\C` is °C).
- The size of large text is **Large text size** on the ☰ Menu **Default** tab, in pixels. It has to be bigger than normal text (18), and it is 28 when the box is empty. Large text is always at least a quarter bigger than the text around it, so it still stands out in an item with a big font. Small text is three quarters of the text around it.
