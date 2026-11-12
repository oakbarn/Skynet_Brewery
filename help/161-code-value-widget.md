# Code Value Widget

A **Code Value Widget** is a Value Widget that **does something** when you set it (Skynet Rule 1.27). It shows its **Value** on a Tab in the **Format** you pick, with the normal **Label** of a Value Widget, and it
holds a few lines of **Process code** in its **Code** attribute. Each time you set the Value, that code runs once.

For example, a Code Value Widget for the Brew Kettle's temperature Setpoint. The Setpoint belongs to the Kettle's **Heating
Element** (its `.setpoint`; the older `.target` is the same), the one that reads the Kettle's Temperature Probe:

```
MB_25_DO@H_Element_Brew~Kettle_BH.setpoint = {value}
```

Tap the Widget, type **152**, press **Set**: the Widget shows 152 and the Brew Kettle's Setpoint becomes 152.

Add one in **Edit layout > Add Widget > Value, Time and DateTime Widgets > Code Value Widget**, or with **Code Value ➕** on
the 🔨 Build Tab. Like every Widget it lives only in the app (no PLC port), its Label is never blank, and a double-click opens
its Properties. Its Name follows `wgt_CV_` + the Label + the Tab ID, for example `wgt_CV_Kettle~SP_BH` (Rule 3.14).

## {value}: the Value of the Widget

In the Code, **`{value}`** stands for the Value of the Widget just set. Use it as often as you like, in any line:

```
MB_25_DO@H_Element_Brew~Kettle_BH.setpoint = {value}
gV_Strike_Temp = {value} + 2
print "Kettle Setpoint is now " + {value}
```

Inside "quoted text" `{value}` stays as it is typed. Writing the Widget's own Name (`wgt_CV_Kettle~SP_BH.value`) does the same
thing as `{value}`.

## When the Code runs

- **It runs** each time a **person** sets the Value: a tap and **Set** on its Tab (even to the same value), or an outside program
  through the **.API** (Read & Control).
- **It does not run** when a **Process** sets the Value (`wgt_CV_Kettle~SP_BH = 150`), so a Process and a Widget can never keep
  setting each other off.
- It runs **once**, from the first line to the last, like a short Process. It uses the same words as a Process (`if`, `wait`,
  `sleep`, `start`, `play` ...). It is **not** on the Processes list. If you set a new Value while the old run is still in a
  `sleep` or `wait`, the old run stops and the new one starts.
- **Stop All** stops it like any running Process.

## Problems in the Code

When you **Save** its Properties, the Code is checked like a Process; a problem shows at once (for example "line 1: No element
named ..."), and the Widget is still saved so you can fix it later. When the Code runs, a problem is written in the **Console**
as `wgt_CV_Kettle~SP_BH (code)`, with `NOT RUN` and the line, and nothing in the Code is done.

## Properties

They look like the Pump's Properties (Skynet Rule 18.30), the same as a Value Widget's
([Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets)). Rest the mouse on a field's name to see what it is
for (hover help).

- **The title line:** the 🔓 lock, **Visible** and **Hidden Locked**.
- **1. Label** with ⬆ and ⬢, then **Label Visible**.
- **2. Tab** and **3. Name**.
- **Format**: how the Value is shown and typed.
  - **Number**: with **Units**, and its ⬢ holds Decimals, the Step for − and +, the Lowest and the Highest.
  - **Time**: `hh:mm:ss`.
  - **DateTime**: `mm/dd/yyyy hh:mm:ss`.
- **Start value**, in the Format picked.
- **Read only**, with **Database and .API ⬢** on its line. Read only on: a tap does nothing, so the Code only runs from the .API.
- **Fore color** of the value, and its ⬢ holds the Back color and the Alignment.
- **Code (runs when the Value is set)**: the Process code.
- **X**, **Y**, **Width** and **Height**, and the **Widget Type** greyed out last.

It keeps its Value when the Brain restarts. A restart does **not** run the Code.
