# Pipe fittings and Manual Valves

pipe fittings are kept simple, and a Manual Valve is a Widget of its own. This works the same on the 🔨 Build Tab and on every Tab.

## Pipe fittings

A **tee is only a tee**, an elbow only an elbow, a reducer only a reducer. This covers the fittings from **Elbows, Tees …** on the Edit layout bar (tee, 90° and 45° elbow, cross, straight piece, coupling, cap) and the Skynet pipe fittings made from a Template (Tee, Instrument_Tee, Elbow_90, Elbow_45, U_Bend, Reducer, End_Cap, Check_Valve).

A pipe fitting has no settings but:

| Setting | What it does |
|---|---|
| **Autosize to pipe** | On (the default): the fitting takes the size of the pipes joined to its IPs, so its body is as thick as most of the pipes on it (a tie takes the bigger). **Width and Height are greyed out** while it is on. A Skynet pipe fitting with no pipe on it yet takes the **Default pipe size** (☰ Menu > Default settings, [Help 155](155-default-settings)). |
| **X, Y** | Where it is, in pixels from the left and from the top (`.x_hPosition`, `.y_vPosition`). |
| **Width, Height** | How big it is. Switch **Autosize to pipe** off first; then you can type them, or drag its grab points in Edit layout. |
| 🔒 Lock | Locks it in place, as on every item. |

- It has **no label**, **no Type** and **no Connection Standard**. Its Skynet name (Tee_1, Elbow_1, bndl1_Tee_BH ...) shows in its Properties and when you hold the mouse over it.
- **Turn or flip it with the turn buttons** on the Edit layout bar (they show while it is picked). They are no longer in its Properties.
- **Pipe fittings have no Clone**: not on the Tab, and not in the Template pop-up of a Skynet pipe fitting Template. Add another one instead.
- An **End Cap** has **Autosize to pipe** too: on an opening of a pipe fitting it takes the size of that fitting's ferrule. On a Reducer, a Valve Tee or Supply Manifold, or a vessel opening it keeps its size.
- **Everything sizes to its pipes when you save** (Skynet Rule 5.36): pressing **Save layout**, or 💾 Save in a fitting's or a pipe's Properties, sizes every pipe fitting on every Tab to the size **most of the pipes and hoses joined to it** have. On a tie (one 1" and one 1/2") it takes the bigger one. Change a pipe run to 1" and Save, and its elbows and tees grow to 1". The same goes for **Valve Tees and Supply Manifolds**, **tees with a Temperature Probe**, **valves** and **flow meters**, which have no Autosize switch. **Pumps** follow their pipes too (since 2026-11-07). Something with no pipe on it takes the **Default pipe size** set on ☰ Menu > Default settings ([Help 155](155-default-settings)); a fitting on a vessel opening with no pipe keeps its size.
- A **check valve** is a pipe fitting too: flow only goes one way, and its orientation (the arrow on its picture) shows which way. Turn or flip it to point the arrow.
- A valve or flow meter in a fitting is a **Device**, and a tee with a thermowell (or a thermowell on a vessel IP) is a kind of **Temperature Probe**, so those keep their own settings for now: see [Skynet fittings](60-skynet-fittings).

## The Manual Valve Widget

A **Manual Valve** is a special Widget: a pipe fitting you turn by hand, and a pseudo Device. Add one with **Manual Valve ➕** on the Edit layout bar. Skynet names it **ManualValve_1**, ManualValve_2 ...

- Its **.state** is true (open) or false (closed). A closed Manual Valve stops flow in the pipes on it; an open one lets it pass the way it was going.
- **A click on it on its Tab opens or closes it, at any time.** That is the only way its .state changes. Operators and Admins can click it; Viewers can't. Every screen shows the change.
- It is a **Confirmation Widget** (2026-11-08, Skynet Rule 1.28, [Confirmation Widgets](162-confirmation-widgets)): its **.confirmation** switch in its Properties is on. A click shows a pop-up, **✋ OPEN Kettle drain by hand, then press Done**: open the real valve, then press **Done**, and only then does it show open. **Cancel** leaves it as it was. Switch .confirmation off and a click opens or closes it at once.
- While it is open, the **open overlay** (Images/Skynet/On_Off/Overlay_Manual_Valve_Open.svg, a green ring and a tick) is drawn on top of it.
- It has **two IPs**, one at each pipe end, so a pipe joins each side of it (Skynet Rule 5.24, Help 123).
- Its Properties: a note with its name and state, **Label** (used in the "by hand" message) and **Show label**, **.confirmation**, then **Autosize to pipe**, **X**, **Y**, **Width**, **Height** and 🔒 Lock.

### A Manual Valve in a Process

```
ManualValve_1.state = true
ManualValve_1 = false
```

A Process line like this **does not open or close the valve** by itself. With **.confirmation** on (as it starts), it shows a pop-up on every screen: **✋ OPEN Kettle drain by hand**, with **Done: it is open**. The Process waits; open the valve, press Done, and the valve shows open and the Process goes on. (A click on the valve on its Tab, with its own Done, does the same.)

With .confirmation off, it shows a bar at the top of every screen: **✋ OPEN Kettle drain by hand, then click it on the Brew Tab to confirm**, and the valve blinks on its Tab. The Process waits. Turn the real valve, then click the Manual Valve on the Tab: once it shows open, the Process goes on with the next line. If it already shows what the Process asks for, nothing is asked.

- **Go to Brew** on the bar takes you to the valve's Tab.
- Stopping the Process takes the bar away.
- A Process can read it: `if ManualValve_1 == true`.

The older **Valve type Manual** on a valve Device still works as before (pop-up and **Done**): see [Manual valves](29-manual-valves). It has the **.confirmation** switch too (on): a click on it asks for Done the same way.

## The Manual Pump Widget

A **Manual Pump** (2026-11-08, Skynet Rule 5.15a) is a pump plugged into a wall outlet, that you switch by hand: no Interface or Port turns it. Add one from **Select Device Type > Pumps** or **Select Widget Type > Semi_Widgets_Devices**, then pick the pump from the same list as **Add Pump** (or the Sump pump). It looks and joins pipes like a Pump Device (the same drawing, inlet and outlet IPs, Cover and Overlay). Its name is **wgt_MP_** + Label + Tab ID, for example `wgt_MP_Pump~1_BH`.

It is a Confirmation Widget too: a click on it, or a Process line such as `wgt_MP_Pump~1_BH.state = true`, shows **✋ TURN ON Pump 1 by hand, then press Done**. Switch the pump on, press **Done**, and it shows ON (a Process waits until then).
