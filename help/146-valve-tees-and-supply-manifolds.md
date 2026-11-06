# Valve Tees and Supply Manifolds

A **Valve Tee** is a TC 1.5 Long Tee with a valve built into its branch. A **Supply Manifold** is two or three of them joined end to
end, the way many home brewers build a manifold to send liquid from one source to several places (Skynet Rule 5.35; Fritz,
2026-11-06).

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
**Select Device Type > Valves**. Each fitting has two rows:

- **..., Manual valves**: every valve starts Manual.
- **..., Motorized valves**: every valve starts Motorized.

It goes on the Build Tab (like every new item) and its Properties open. Its Name is **ValveTee_1**, **Manifold2_1** or
**Manifold3_1**, and its **Label** starts as **valve_tee_1**, **manifold_2_1** or **manifold_3_1** (you can change it, but it can't be
blank).

## Manual or Motorized, one valve at a time

Each valve is a **valve Device built into the fitting** (a Skynet_Integrated_Device, like the RIMS tube's heating element). It can't
be taken out or deleted by itself; deleting the fitting deletes its valves.

In the fitting's **Properties**, under **Valves**, each valve has its own dropdown, the same choice as a regular valve's **Valve type**:

- **Manual**: turned by hand. It has no Port. When a Process asks for it to be opened or closed, a pop-up asks someone to do it and the
  Process waits for **Done**.
- **Motorized**: switched by a Port. Pick the **Interface** (one board for all the Motorized valves of this fitting) and then each
  valve's **Port**. Two valves can't share a Port.

Change any valve from Manual to Motorized (or back) at any time and press Save. Its picture changes, and it stays on the same spot, so
the pipes on it stay joined.

## Using it

- **Click a valve** on its Tab to open or close it (operators and admins). An open Motorized valve shows the bolt; an open Manual valve
  shows the green ring.
- In a Process, use the valve's own name, for example `MB_22_eVlv_manifold_2_1_V1_BR.state = true`. Each valve's Label is the
  fitting's Label with **V1**, **V2**, **V3** after it, and its name is made from that (the suggested name).
- Motorized valves are on the **Close all** and **Open all** valve lists, like every valve a Process can switch.

## Turning it and putting it in a pipe

Flip Horizontal, Flip Vertical and Rotate (in 45 degree steps) are in its Properties and on the Edit layout bar's turn buttons; the
valves and IPs turn with it. Dropped on a straight pipe in Edit layout, its run goes along the pipe and the pipe is cut in two, one
piece on each open end, the same as a tee. It keeps its own size (it is drawn to the Valve Standard size), so it has no Autosize to
pipe.
