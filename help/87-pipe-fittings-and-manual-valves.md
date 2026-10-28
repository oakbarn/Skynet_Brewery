# Pipe fittings and Manual Valves

Fritz, 2026-10-28: pipe fittings are kept simple, and a Manual Valve is a Widget of its own. This works the same on the 🔨 Build Tab and on every Tab.

## Pipe fittings

A **tee is only a tee**, an elbow only an elbow, a reducer only a reducer. This covers the fittings from **Elbows, Tees …** on the Edit layout bar (tee, 90° and 45° elbow, cross, straight piece, coupling, cap) and the Skynet pipe fittings made from a Template (Tee, Instrument_Tee, Elbow_90, Elbow_45, U_Bend, Reducer, End_Cap).

A pipe fitting has no settings but:

| Setting | What it does |
|---|---|
| **Autosize to pipe** | On (the default): the fitting takes the size of the pipes joined to its IPs, so its body is as thick as the biggest pipe on it. **Width and Height are greyed out** while it is on. A Skynet pipe fitting with no pipe on it yet keeps its size. |
| **X, Y** | Where it is, in pixels from the left and from the top (`.x_hPosition`, `.y_vPosition`). |
| **Width, Height** | How big it is. Switch **Autosize to pipe** off first; then you can type them, or drag its grab points in Edit layout. |
| 🔒 Lock | Locks it in place, as on every item. |

- It has **no label**, **no Type** and **no Connection Standard**. Its Skynet name (Tee_1, Elbow_1, bndl1_Tee_BR ...) shows in its Properties and when you hold the mouse over it.
- **Turn or flip it with the turn buttons** on the Edit layout bar (they show while it is picked). They are no longer in its Properties.
- **Pipe fittings have no Clone**: not on the Tab, and not in the Template pop-up of a Skynet pipe fitting Template. Add another one instead.
- An **End Cap** has X, Y, Width and Height but no Autosize (it sits on an opening, not on a pipe).
- Fittings that do more than join pipes (a valve, a check valve, a flow meter, a tee with a thermowell) keep their own settings: see [Skynet fittings](60-skynet-fittings).

## The Manual Valve Widget

A **Manual Valve** is a special Widget: a pipe fitting you turn by hand, and a pseudo Device. Add one with **Manual Valve ➕** on the Edit layout bar. Skynet names it **ManualValve_1**, ManualValve_2 ...

- Its **.state** is true (open) or false (closed). A closed Manual Valve stops flow in the pipes on it; an open one lets it pass the way it was going.
- **One click on it on its Tab opens or closes it, at any time.** That is the only way its .state changes. Operators and Admins can click it; Viewers can't. Every screen shows the change.
- While it is open, the **open overlay** (Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg, a green ring and a tick) is drawn on top of it.
- Its Properties: a note with its name and state, **Label** (used in the "by hand" message) and **Show label**, then **Autosize to pipe**, **X**, **Y**, **Width**, **Height** and 🔒 Lock.

### A Manual Valve in a Process

```
ManualValve_1.state = true
ManualValve_1 = false
```

A Process line like this **does not open or close the valve**. It shows a bar at the top of every screen: **✋ OPEN Kettle drain by hand, then click it on the Brew Tab to confirm**, and the valve blinks on its Tab. The Process waits. Turn the real valve, then click the Manual Valve on the Tab: once it shows open, the Process goes on with the next line. If it already shows what the Process asks for, nothing is asked.

- **Go to Brew** on the bar takes you to the valve's Tab.
- Stopping the Process takes the bar away.
- A Process can read it: `if ManualValve_1 == true`.

The older **Valve type Manual** on a valve Device still works as before (pop-up and **Done**): see [Manual valves](29-manual-valves).
