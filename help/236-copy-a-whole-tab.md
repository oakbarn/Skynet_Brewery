# Copy a Whole Tab

A new Tab can start as a **copy of a whole Tab**: everything on it, in the same places (Skynet Rule 4.8). Pipes can't be moved to
another Tab one by one; copying the whole Tab is the way.

## How

1. Open **Edit layout** and press **New tab**.
2. Pick **Copy of** the Tab you want (or **Empty Tab** for a plain new Tab). Tabs with nothing on them are not in the list.
3. Type the new Tab's name. It gets its own Tab ID (Rule 3.2); change it in Tab settings before you **Save layout** if you want another.
4. If the Tab has Widgets, pick what they become (below).
5. If you picked new Widgets and some Processes use them, one question asks: **Copy the N Processes?**
6. **Save layout** keeps it all. Leave Edit layout without saving and nothing is made, not even the Process copies.

## What the copy gets

| On the Tab | On the copy |
|---|---|
| **Devices** (pumps, valves, heating elements, probes ...) | A **Clone** of each one ([Cloned Devices](71-cloned-devices)). A Clone and its Device are the same Device, only another picture on the screen. A Process still commands the Device itself. |
| A **Clone** | Another Clone of the same Device (a Method Clone keeps its method). |
| **Pipes, hoses, IPs, fittings, vessels, pictures and text** | New ones, joined the same way. Skynet gives them new names in the background (Pipe_N, Hose_N, Tee_N ...). Pipes on a Device's IPs end on its Clone. |
| **Widgets** | What you pick: |

**The Widgets** (switches, alarms, timers, values, labels, gGlobals ...):

- **i) Clones**: each Widget is shown on the new Tab too. Both are the same Widget: change one, the other changes.
- **ii) New Widgets**: each one is a new Widget of its own, with a new Suggested Name that ends with the new Tab ID
  (`wgt_SW_Testing_BH` becomes `wgt_SW_Testing_B2`, Rule 3.14). A name with no Tab ID gets `_2`.
- **iii) Case by case**: Skynet asks for each Widget: **Clone** or **New Widget**.

## Copy the Processes

With new Widgets (ii or iii), the Processes that use the old Widgets would still work the old Tab's Widgets. **Copy the N Processes?**
makes a copy of each, named with the new Tab ID (`BrewDay_Flow` becomes `BrewDay_Flow_B2`). In each copy:

- the old Widgets' names become the new ones,
- a Process it starts or stops that was copied too becomes the copy,
- the **Devices stay the same**: the copy commands the same pumps, valves and heaters (their Clones on the new Tab show it).

A Widget that starts a Process (a Label or Process Widget) copied as new starts the Process copy. **No** copies no Process.
