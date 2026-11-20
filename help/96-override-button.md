# Override button

The **Override button** lets a brew day go on when a Process is stuck waiting. Each button is set to **one Process** or to **Any**. One press and that Process (Any: every running Process) moves on, 100 ms later, the way **Skip** does in the Simulator, but on the real clock:

- a **wait** it is held in (`wait Kettle_Temp >= 152`) is passed, as if it was reached;
- a **sleep** it is in ends now;
- the **loop** it sits in is left: the next `goto` that jumps back up (often inside an `if`) is passed, so the Process goes on with the line below it.

After that the Process runs as normal: the **next** wait or sleep waits as usual. Press Override again to pass that one too. A press that nothing uses within a second is dropped, so it never skips something later by surprise.

**Manual valves still wait** for their click (Manual Valve Widget) or their **Done** button.

**Looper Processes are left alone by Any.** A Looper (Process class Looper, like `looper_LogTemps`) runs in the background on its own, for example copying a temperature for the log every few seconds. A button set to Any never moves it on; a button set to that Looper by name does.

Only an operator or an admin can press it. Each Process that moved on writes a line in its console, for example `Override: the wait on line 12 was passed`.

## Processes side by side

Processes run at the same time and on their own: a Brew Process, and a Fire Hose or Manifold Process started beside it. Set each button to the Process it is for, so pressing one never moves the others on.

## The Override pop-up

A Process with no button of its own still gets an Override: a small **Override pop-up**, on top of everything, that names the Process. One press moves only that Process on. **✕** hides it on this screen until it pops up again.

- **By itself:** when a Process has waited 3 seconds in a `wait` or a `sleep` and **no Override button is set to it or to Any**. A wait for a temperature counts: you can see the kettle boiling before it reaches today's Boil Temp and press Override.
- **Never by itself inside a loop:** a wait or sleep that a `goto` further down jumps back above (a nested `if` waiting on a valve or a heater) is not safe to skip blindly, so it gets no pop-up by itself.
- **On demand:** `show_Override` in a Process brings it up (with an optional text: `show_Override "Press when the boil is rolling"`), and `hide_Override` takes it away. It also goes when it is pressed or the Process ends. See [Process language](22-process-language).

## Adding one

In Edit layout press **Override ➕** on the Edit layout bar. It is made on the 🔨 Build Tab, like every new Widget, and its Properties open. **Finish Build ...** sends it to a Tab.

- **As many as you like.** A Tab may have several Override buttons, and a Process may have several buttons. Press **COPY** in its Properties, then **Finish Build ...** to the same Tab or another. Each button has its **own Label, Process and look**.

## Override Button Widget Properties

- **1. Label**: what the button says on this Tab, for example **Skip Fire Hose**. A new one says **Override**; empty puts Override back. That Label Override shows in the Help language picked (French: **Passer**); a Label you type shows as you typed it. Rich Text Embedded Codes work here (`\b`, `\n`, `\c{Yellow}` ...).
- **2. Tab** and **3. Name** (made by Skynet from the Label and the Tab).
- **4. Process**: **Any** (every running Process but Loopers, the usual) or one Process from the list. If the Process gets a new name, the button follows it.
- **Background** (Show or None), **Fore color** (its ⬢ holds Font size, Font, Bold and Alignment) and **Back color**.
- **X**, **Y**, **Width**, **Height** and the **Widget Type**.

It starts as bold white **Override** on red. It has **no background picture**.
