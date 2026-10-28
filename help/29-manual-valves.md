# Manual valves

A valve can be **Electro_Mechanical** (a motorized or solenoid valve, switched by its pin on a board) or **Manual** (a ball valve you turn by hand). When a Process opens or closes a **Manual** valve, the panel shows a pop-up telling you what to do, and the Process waits until you press **Done**.

This is handy when an electric valve fails on brew day: switch it to Manual and keep brewing. The Process stays the same.

## Make a valve Manual

1. **Tabs > Edit layout**, then open the valve's properties. On a PC, **double-click** it. On an iPhone, **hold a finger on it**.
2. The **Kind** must be **valve**.
3. Set **Valve type** to **Manual**. (**Electro_Mechanical** is the normal, switched one.)
4. Press **Save**, then **Save layout**.

A Manual valve's board pin is left alone, so a failed valve isn't switched on and off for nothing.

## In a Process

Write it the same way as any valve:

```
VGC_Kettle_Out = true
VGC_Kettle_Out.state = false
```

When the line runs, every screen shows **✋ Manual valve: OPEN Kettle outlet by hand** (or CLOSE). Turn the valve, then press **Done: it is open**. The valve shows as open on the tabs, and the Process goes on to the next line. If the valve is already in that position, nothing is asked.

- Operators and Admins can press **Done**. Viewers see the pop-up but can't press it.
- Stopping the Process takes the pop-up away.
- You can take out the old lines that asked for a manual valve some other way (a message and a wait), because this pop-up does the same job.

A Brew Day Equipment Profile, where you change a valve to Manual for one brew day without changing the Equipment Profile, is coming with the Brew Day.

A **Manual Valve Widget** (a valve drawn on a Tab, with no board pin) works another way: a click on it on its Tab is the only thing that opens or closes it, and a Process waits for that click. See [Pipe fittings and Manual Valves](87-pipe-fittings-and-manual-valves).
