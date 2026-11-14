# Hover help in dialogs

Skynet keeps its dialogs as clean as possible (Skynet Rule 2.38). A dialog shows short field names and the
fields themselves. The explanation of a field is in its **hover help**.

## See the help of a field

- A field name with a **dotted underline** has hover help.
- **Rest the mouse on the name** (of a field or a dropdown). A small yellow box shows what the field is for, at once. To make it wait a moment first, set **Hover Delay** on **☰ Menu > Default settings** (in milliseconds; see [Default settings](155-default-settings)).
- **Buttons** (Delete, Cancel, Save, ⬆, ⬢ ...) and the **dialog title** have hover help too. The title shows a short piece of its Help page.
- In a dialog, the box goes **to the right of the dialog**, so it covers no part of it. With no room on the right it goes to the
  left; with no room on either side, just under (or over) the name and its box, so it never covers them. Beside the dialog it can be as tall as the screen, so it only
  gets a scroll bar when it is taller than the screen.
- The box **stays as long as the mouse is on the name**. Move the mouse off (or click, press a key or scroll) and it goes away.
- **Click the name** to open the same help in a small pop-up with **Close**, if you want to keep it open while you read.

## Hot spots: jump to the bigger Help

Some words in a help box are **blue and underlined**. They are **hot spots**: each one has its own, bigger Help page.

- Move the mouse from the name into the help box. A box with hot spots waits a moment, so the mouse can reach it.
- **Click a hot spot** and the Help window opens at the part about it. Example: in the help for **Interface**, click
  **Interface ID** and Help opens **Interfaces**, at **The Interface ID**.
- The row at the top of Help, with **◀ Back** and **✕ Close**, stays frozen while you scroll. Click **✕ Close** to close Help and go
  back to your dialog.
- Only the first time a word shows in a box is it a hot spot, so the box stays easy to read.
- The pop-up with **Close** (a click or a tap on the name) has the same hot spots.

### A broken link

A hot spot, or a link from one Help page to another, is checked before it opens. If its page or part is not there (or it has none),
**nothing opens and nothing goes to the web**. A pop-up says **This Help link is broken** and shows the details: where you clicked,
the link, what is wrong, the page, the browser and the time. Press **✉ Send** to send them to OakBarn Brewery
(support@oakbarnbrewery.com) so it can be fixed, or **✖ Close**. Send uses the Brain's email when it is set up (Settings > Sending
codes); otherwise your own mail program opens with the details filled in, and you press its Send. (Skynet Rule 11.10)

Help links to a web page outside Skynet only where OakBarn Brewery asked for one (Skynet Rule 11.10).

## On a phone or tablet

Phones and tablets are for running the brewery (Rule 2.35), and they have no mouse. **Tap the name** to open the small pop-up
with **Close**.

## What stays on the dialog

- Warnings you must act on, like **⚠ The Label cannot be blank.**
- What something is now, like the Suggested Name, or a valve that is OPEN or CLOSED.
- The yellow **?** in the title, which opens the full Help page.

## Widget dialogs

Every Widget's Properties look like the Pump's (Skynet Rule 18.30): the 🔓 lock, Visible and Hidden Locked in the title line, then
**1. Label** (⬆ a bigger box, ⬢ its font, size and colors) and Label Visible, **2. Tab**, **3. Name**, the Widget's own fields with
the extras behind a ⬢, its place and size, and the **Widget Type** greyed out last. A new Widget is named
**wgt_Type_Label_TabID**, for example **wgt_DT_DateTime_1_BH** (Rule 3.14).
