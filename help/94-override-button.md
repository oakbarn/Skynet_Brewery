# Override button

The **Override button** lets a brew day go on when a Process is stuck waiting. **One press and every running Process moves on**, 100 ms later, the way **Skip** does in the Simulator, but on the real clock:

- a **wait** it is held in (`wait Kettle_Temp >= 152`) is passed, as if it was reached;
- a **sleep** it is in ends now;
- the **loop** it sits in is left: the next `goto` that jumps back up (often inside an `if`) is passed, so the Process goes on with the line below it.

After that the Process runs as normal: the **next** wait or sleep waits as usual. Press Override again to pass that one too. A press that nothing uses within a second is dropped, so it never skips something later by surprise.

**Manual valves still wait** for their click (Manual Valve Widget) or their **Done** button.

**Looper Processes are left alone.** A Looper (Process class Looper, like `looper_LogTemps`) runs in the background on its own, for example copying a temperature for the log every few seconds. Override never moves it on, so it never ends it.

Only an operator or an admin can press it. Each Process that moved on writes a line in its console, for example `Override: the wait on line 12 was passed`.

## Adding one

In Edit layout press **Override ➕** on the Edit layout bar. It is made on the 🔨 Build Tab, like every new Widget, and its Properties open. **Save Build ...** sends it to a Tab.

- **Only one Override button on a Tab.** The panel won't put a second one on a Tab that has one.
- **It can be on several Tabs.** Press **COPY** in its Properties, then **Save Build ...** to another Tab. Each Tab's button has its **own Label and look**, and they all do the same thing.

## Override Button Widget Properties

At the top: **🗑 Delete**, **COPY**, **✖ Cancel** and **💾 Save** (Delete, Cancel and Save at the bottom too). The orange **?** opens a pop-up with more about it.

### The Label box

- **Label**: what the button says on this Tab. A new one says **Override**; empty puts Override back. Rich Text Embedded Codes work here (`\b`, `\n`, `\c{Yellow}` ...).
- **Font size**, **Font**, **Bold**, **Fore color**, **Back color** and **Alignment**.

It starts as bold white **Override** on red. This starting look is for now and may change.

### The Properties box

- **Tab**, **X Horizontal**, **Y Vertical**, **Width**, **Height** and **Lock position** 🔓 / 🔒.

The Override button has **no name** (a Process does not use it, a person presses it) and **no background picture**.
