# Process Widget

A **Process Widget** puts one **Process** on a Tab, so you can see what it is doing and start or stop it with one click
(Skynet Rule 1.31).

It shows three things:

- its **Label** as the title (for example *Mash Steps*),
- what its Process is doing: **Running**, **Waiting** (held at a `wait` or `ask`), **Stopped**, or **Stopped on an error**,
- a **▶ Start** button while the Process is stopped, or a **■ Stop** button while it runs.

Add one in **Edit layout > Add Widget > Widgets (app only, no board pin) > Process Widget**. Like every Widget it is made on the
🔨 Build Tab first and lives only in the app (no Interface or Port). Its Name follows `wgt_PSW_` + the Label + the Tab ID, for
example `wgt_PSW_Mash~Steps_BH` (Rule 3.14).

## One click starts or stops it

Outside Edit layout, **one click anywhere on the Widget** starts its Process when it is stopped, and stops it when it runs. There
is no pop-up first (Rule 2.44: what you do every day is one click away). If the Process can't start (for example it has a
mistake in its code), a message at the top of the screen says why, and the Widget shows **Stopped on an error**.

- Turn on **Ask before starting or stopping** in its Properties if you want the click to ask first.
- A **view only** account can look but can't start or stop it.
- A **double-click** opens its Properties, as on every Device and Widget.

## Its Properties

1. **Label** (never blank) and **Label Visible**.
2. **Tab**: the Tab it is on.
3. **Name**: made by Skynet from the Label and the Tab.
4. **Process**: the Process it shows and starts, picked from the list of every Process.

Then **Ask before starting or stopping**, **Picture**, **Picture turns on with**, **X**, **Y**, **Width** and **Height** (200 x 80
to start) and the **Widget Type**.

**Hide while running** (Off to start): On, the Widget hides (`.visible = false`) once its Process starts, and shows again when the
Process stops. Use it for a button that starts something, such as **Start Brew Day** in the samples. Leave it Off on a Start / Stop
button, so one click can stop the Process too.

**Group** (empty to start): Process Widgets with the same Group word act together, like the Water buttons of the 3 Vessel sample
(Group **Water**). One click on one greys out the Start of all the others, so two cannot run at once:

1. While the delay runs, every one of them shows **Delay**, and the one pressed says **Started**.
2. Once the water flows, the one pressed shows **Running** and the others go blank.
3. When it is over, every Start works again.

The Process says when each part starts, with `.phase` on any Widget of the Group:

```
wgt_PSW_FireHose~1~Minute_WA.phase = "running"
wgt_PSW_FireHose~1~Minute_WA.phase = "stopped"
```

Leave a button that must always work, such as **FireHose Off**, out of the Group.

## A picture on it

A Process Widget can show a **Picture** between its Label and its button, for example a float switch on a "fill to the float"
button. The ⬢ beside Picture holds the **Picture when on**. Set **Picture turns on with** to a Device or Widget, and the Widget
shows the Picture when on while that one is on, and the Picture when off while it is off. On the Fire Hose sample's Water Tab, the
**Use FireHose Float** and **Use Manifold Float** buttons show the float hanging while the Water float is dry, and lifted with its
contacts closed (red) once the water makes it. Leave Picture empty for no picture.

Hover over a field's name for a short explanation.

## When the Process changes

- When you give the Process a new name with **✏ Change name**, the Widget follows it by itself.
- When a Process starts or stops the Process (`start Mash`, `stop Mash`), every Process Widget showing it changes at once.
- If the Process is deleted, the Widget says **No such Process** until you pick another one. With no Process picked it says
  **No Process picked**.

A Process Widget has no value of its own, so it has no Database or .API settings.
