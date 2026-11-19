# DIN Button: On Press

A physical **DIN push button** on your panel can do **one thing** when it is pressed, with no code to write (Skynet Rule 6.38).
It is a **Digital Input Device** on a board Port, set up like any push button (see
[Step by Step: Wire Switches and Float Switches](233-step-by-step-wire-switches-and-float-switches)). Its **On Press** row in its
Properties picks what a press does:

| On Press | What one press does |
|---|---|
| **None** (the usual) | Nothing more: its State turns ON, for a Process to read, as before. |
| **Run a Process** | Starts the Process you pick and lets it run to its end in the background, just as **▶ Start** on a [Process Widget](173-process-widget) does. A press while it is running is ignored: a press never stops it. |
| **Advance (Override)** | Works like an [Override button](96-override-button) set to the Process you pick, or to **Any**. It works only when that Process is waiting in a `wait` or `sleep`. When nothing is waiting, the press is ignored. |
| **Cancel all alarms** | Every Alarm sounding now is turned Off, as a tap on each one does. |

## Examples

- A **yellow** button set to **Run a Process**, Process **Fire_Hose**: one press runs a 20 second Fire Hose.
- A **blue** button set to **Advance (Override)**, Process **Any**: one press moves the Brew on when it waits for you.
- A **red** button set to **Cancel all alarms**: one press makes every Alarm stop sounding.

## Setting it up

1. Wire the button to a free Port and add it as a **DIN / Pulse button** (Edit layout > Add Device > **Inputs (switches, buttons)**).
2. Double-click it to open its Properties.
3. Pick **On Press**. For **Run a Process** and **Advance (Override)**, pick its **Process** in the row below it.
4. **Save**, then **Save layout**.

If the Process gets a new name (✏ Change name), the button follows it.

## Good to know

- One press is one press: the input's **lockout** (3 seconds to start), **debounce** and **on delay** count first, so holding the
  button or a bump is not a second press.
- What each press did is written in the **Console**, for example *pressed: Fire_Hose started* or *pressed: no Brew is waiting for
  an Override, so the press was ignored*.
- A button set to **Advance** counts as an Override button for its Process, so that Process gets no Override pop-up on the screen.
- In simulation, a click on the button and **Simulate: press** does the same as a real press.
- A Process can still read the button's State as before (`if BM_30_DI@DIN_Fire~Hose_BH == true`).
