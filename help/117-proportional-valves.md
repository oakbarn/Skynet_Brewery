# Proportional Valves

A **Proportional Valve** opens part way: from **0 %** (closed) to **100 %** (wide open). It is an **Analog Output**: Skynet sends a
control signal (a voltage) to the valve, and the valve turns to match it. Above 0 % it lets liquid through its pipes; at 0 % it is
closed. You find them in the **Valves** list on the Edit layout bar.

## The Skynet KLD20T Proportional Valve

The first **Skynet Proportional Valve** is the **KLD20T**: a 1/2 inch NPT, stainless steel (SS304) motorized
ball valve. It is powered by **24 VDC** and turns to the % set by a **0-5 VDC** control signal (0 V = closed, 5 V = wide open).

It is a **Skynet Template** (Skynet Rule 5.16), the same way as the Skynet Motorized Ball Valve (Help 88):

- **Set by the Template** (not in its Properties): Kind (Proportional Valve), Service (Room Temperature Liquid), Signal **0-5 V**,
  **0 to 100 %**, no decimals, its pictures and its look.
- **You set:** Name, Label, Show label, Tab, X, Y, Width, Height, Lock, Visible, Hidden, the text box settings, Device Type, the
  **Interface** and **Pin** (a PWM pin feeding a PWM-to-0-5 V module), **Orientation** and the **Flips**.
- **Orientation**: Horizontal, Vertical Left, Vertical Right or 45 degrees. The picture and its IPs follow.

Its picture is the Skynet Motorized Ball Valve's for now (open above 0 %, closed at 0 %).

In a Process it is set like any Analog Output, for example `PropValve_1.value = 40` opens it 40 %.

## The User Defined Proportional Valve

Under the Skynet Proportional Valves is the **User Defined Proportional Valve**, for any other proportional valve (for example a
24 V 0-10 V or 4-20 mA valve). It works the same way, but you set everything:

- **Interface** and **Pin**, **Signal** (0-10 V, 4-20 mA or 0-5 V), **Value at lowest signal** and **Value at highest signal**
  (0 and 100 for %), **Units**, **Decimals**.
- **Picture when open (above 0 %)** and **Picture when closed (0 %)**, and **Image Path 1, 2, 3** (Skynet Rule 7.10).
- **In IP across % / In IP down %** and **Out IP across % / Out IP down %**: where its two pipe ends are on the picture, in % of
  its Width (0 = the left edge, 100 = the right edge) and Height (0 = the top, 100 = the bottom). Leave them blank and Skynet
  places them for you. They are the same as on the User Defined Motorized Ball Valve (Help 88).

It used to be called "Proportional valve 0-100 % (analog output)"; older Schemas keep working as they are.
