# Value, Time and DateTime Widgets

Three Widgets that show **one value on a Tab** for you to look at (Skynet Rule 1.23, Fritz 2026-11-05):

| Widget | Shows | Starts as |
|---|---|---|
| **Value Widget** | a number, with Units and Decimals | `w_Value_1` |
| **Time Widget** | a time, `hh:mm:ss` | `w_Time_1` |
| **DateTime Widget** | a date and time | `w_DateTime_1` |

Add one in **Edit layout > Add Widget > Value, Time and DateTime Widgets**. Like every Widget it lives only in the app (no PLC
port), has a **Label** that is never blank, and opens its Properties on a double-click.

## Setting it

On its Tab, a tap opens a box to type the new value (a Value Widget also has **−** and **+**, by its Step), then **Set**.
Switch on **Read only** in its Properties and a tap does nothing: only a Process sets it.

Every Process can read and set it by its Name, like any Device or Widget: `w_Strike_Volume = 7.5`, `if w_OG > 1.050`.
It keeps its value when the Brain restarts.

## Properties

- **Value box:** Start value; for a Value Widget also Units, Decimals, Step for − and +, Lowest and Highest; Read only; Fore
  color, Back color and Alignment of the value.
- **Label box:** Label, Visible (Show label), Font size, Font, Fore color, Back color, Alignment.
- **Properties box:** Visible, Hidden Locked, Tab, X, Y, Width, Height, Lock position.
- **Database and .API** (see [Database and .API](98-database-and-api)): **When Clicked** sends it each time someone sets it on its
  Tab (even to the same value); in a **Database Group** it is sent only while one of its Groups is started (`start_db_group Group_Name` ... `stop_db_group Group_Name`).

## Widget, Device or Clone: your choice

When you put a reading on a Tab, pick what fits your brewery (Fritz, 2026-11-05). Skynet does not choose for you:

- **A Device** when a board reads it, for example a **smart pH meter** wired to an Interface: its reading comes in by itself.
- **A Clone** of that Device (see [Cloned Devices](71-cloned-devices)) when you want the same reading on another Tab, for
  example the Reporting Tab. A Clone always shows its Device's value, with no Process code.
- **A Value, Time or DateTime Widget** when nothing reads it for you, for example a **pH meter that is not smart**: you read it
  yourself and type the value in with a tap. A Process can set it too.

The Three Vessel sample uses Value Widgets for its readings; a brewery with a smart pH meter would put a Clone there instead.

## In the samples

The **Three Vessel** sample's **Reporting** Tab holds the brew day readings (Strike volume, Mash pH, Pre-boil volume ...) as Value
Widgets, sent to the database When Clicked.
