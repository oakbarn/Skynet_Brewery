# Valve Tees and Supply Manifolds

A **Valve Tee** is a TC 1.5 Long Tee with a valve built into its branch. A **Supply Manifold** is two or three of them joined end to
end, the way many home brewers build a manifold to send liquid from one source to several places (Skynet Rule 5.35).

| Fitting | Tees | Valves | IPs |
| --- | --- | --- | --- |
| **Long Tee with a Valve** (Valve Tee) | 1 | 1 | 3 |
| **Double Supply Manifold** | 2 | 2 | 4 |
| **Triple Supply Manifold** | 3 | 3 | 5 |

![Double Supply Manifold](Images/Skynet/Other_Equipment/Skynet_TC15_Supply_Manifold_2.svg)

## Its IPs

There are IPs **only** on the **two open ends of the joined tees** (left and right) and on the **far end of each valve** (the bottom).
Pipes and hoses join there. Liquid goes any way through the tees; a **closed valve shuts its IP**, so nothing goes in or out there.

## Add one

In **Edit layout**, open **Elbows, Tees …** and pick one from **Valve Tees and Supply Manifolds**, or use
**Select Device Type > Valves**. Each fitting has two rows: **..., Manual valves** (every valve starts Manual) and
**..., Motorized valves** (every valve starts Motorized).

The **Add box** works like a Pump's (Skynet Rule 18.29). Hover the name of any field for its help.

1. **Label**: filled in for you (**valve_tee_1**, **manifold_2_1**, **manifold_3_1**). You can change it, but it can't be blank.
2. **Interface (board)**: the board its Motorized valves are wired to (one board for all of them).
3. **Valve 1**, **Valve 2**, **Valve 3**: **Manual** or **Motorized**. A Motorized valve picks its Port in **Available Ports** on the
   same line. Two valves can't share a Port.
4. **Tab**: the Tab it goes on.

Then the **Name** (ValveTee_1, Manifold2_1 or Manifold3_1 to start), the **Graphic**, its **Path**, the **Orientation** and **Flip**, X, Y, Width,
Height and the **Device Type**. Press **➕ Add Device**: it goes on that Tab and its Properties open. Enter goes from field to field
and last to ➕ Add Device.

## The valve numbers

In Edit layout, and on the Graphic in the Add box and the Properties, each valve shows a yellow number, **1**, **2**, **3**. It is the
same valve as **Valve 1**, **Valve 2**, **Valve 3** in the dialog, and as **V1**, **V2**, **V3** in its Label. The numbers are not
shown when Edit layout is off.

## Manual or Motorized, one valve at a time

Each valve is a **valve Device built into the fitting** (a Skynet_Integrated_Device, like the RIMS tube's heating element). It can't
be taken out or deleted by itself; deleting the fitting deletes its valves.

In the fitting's **Properties** (the same fields as the Add box) change any valve from **Manual** to **Motorized** or back and press
Save. A **Manual** valve is turned by hand: when a Process asks for it to be opened or closed, a pop-up asks someone to do it and the
Process waits for **Done**. A **Motorized** valve is switched by its Port.

Once a Motorized valve is saved, its **Port** is greyed out, and so is the **Interface** (it is wiring). To wire a valve to another
Port, make it **Manual**, Save, then make it **Motorized** again and pick the Port.

## Using it

- **Click a valve** on its Tab to open or close it (operators and admins). An open Motorized valve shows the bolt; an open Manual valve
  shows the green ring.
- In a Process, use the valve's own name, for example `MB_22_eVlv_manifold_2_1_V1_BR.state = true`. Each valve's Label is the
  fitting's Label with **V1**, **V2**, **V3** after it, and its name is made from that (the suggested name).
- Motorized valves are on the **Close all** and **Open all** valve lists, like every valve a Process can switch.

## Turning it and putting it in a pipe

Its **Orientation** has three choices: **Horizontal** (the valves hang down), **Left Vertical 90** (the valves point left) and
**Right Vertical 90** (the valves point right). **Flip** is on the same line:

- **No flip**: as drawn (Horizontal: the valves on the bottom).
- **Flip Vertical**: the valves on the other side of the tees (Horizontal: **the valves on top**).
- **Flip Horizontal**: Valve 1 at the other end.
- **Flip both**: both of these.

On the Edit layout bar the turn buttons step through the three turns, and **Flip H** and **Flip V** flip it the way it looks on the
Tab. The valves, their numbers and the IPs follow.

Each valve is drawn with the same TC 1.5 ferrules as the tees: the top one is clamped to the tee's branch, and the bottom one is the
valve's IP. Dropped on a straight pipe in Edit layout, its run goes along the pipe and the pipe is cut in two, one piece on each open
end, the same as a tee. It keeps its own size, so it has no Autosize to pipe.

**Its size** (Skynet Rule 5.36): it now sizes to its pipes like a tee. Its tees take the size most of the pipes
and hoses on its IPs have (a tie takes the bigger), and its valves grow or shrink with it. With no pipe on it, it takes the Default pipe size (☰ Menu > Default settings, [Help 155](155-default-settings)).
This replaces "It keeps its own size, so it has no Autosize to pipe" above.
