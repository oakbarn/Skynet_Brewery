# Process Widget

A **Process Widget** puts one **Process** on a Tab, so you can see what it is doing and start or stop it with one click
(Skynet Rule 1.31, OakBarn Brewery 2026-11-09). It is BruControl's **Script element**: in Skynet a script is called a
**Process** (Rule 1.4), so this is the Process Widget.

It shows three things:

- its **Label** as the title (for example *Mash Steps*),
- what its Process is doing: **Running**, **Waiting** (held at a `wait` or `ask`), **Stopped**, or **Stopped on an error**,
- a **▶ Start** button while the Process is stopped, or a **■ Stop** button while it runs.

Add one in **Edit layout > Add Widget > Widgets (app only, no board pin) > Process Widget**. Like every Widget it is made on the
🔨 Build Tab first and lives only in the app (no Interface or Port). Its Name follows `wgt_PRC_` + the Label + the Tab ID, for
example `wgt_PRC_Mash~Steps_BR` (Rule 3.14).

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

Then **Ask before starting or stopping**, **X**, **Y**, **Width** and **Height** (200 x 80 to start) and the **Widget Type**.

Hover over a field's name for a short explanation.

## When the Process changes

- When you give the Process a new name with **✏ Change name**, the Widget follows it by itself.
- When a Process starts or stops the Process (`start Mash`, `stop Mash`), every Process Widget showing it changes at once.
- If the Process is deleted, the Widget says **No such Process** until you pick another one. With no Process picked it says
  **No Process picked**.

A Process Widget has no value of its own, so it has no Database or .API settings.

## From BruControl

The **BruControl Import** makes each BruControl **Script element** a Process Widget (it used to make a Value Widget). It shows the
BruControl Script of the same name, which becomes that Process when your Scripts come into Skynet. The variable the Script
element showed in BruControl is kept with what BruControl had. A Script element BruControl marked as **not user controlled**
comes in with **When tapped: none**, so a click on it does nothing, as before. See [Help 143](143-brucontrol-importer) and
[Help 165](165-importer-item-and-widget-pages).
