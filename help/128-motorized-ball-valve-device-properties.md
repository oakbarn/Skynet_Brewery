# Motorized Ball Valve Device Properties

Adding a **Motorized Ball Valve** works the same way as adding a Pump (see [Pump Device Properties](115-pump-device-properties)),
with one difference: **a valve has no Cover**. (Skynet Rule 18.23)

## Adding a Motorized Ball Valve

1. In Edit layout, click **Valves > Motorized Ball Valve, open / closed (relay)** (it is in the **On/Off** list too).
2. **Pick the valve.** Each one has its picture:
   - **Skynet Motorized Ball Valve**: the Skynet drawing (blue actuator). Its picture is set.
   - **User Defined Motorized Ball Valve**: your own pictures, and you set where its In and Out IPs are.
3. The Add box opens with the valve's name as its title. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font
   and colors) and **Label Visible**, 2 the **Interface (board)** and an **Available Port** on the same line, 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Graphic**: the valve as it will show on the Tab, closed, turned to its Orientation.
   - **Path**: the picture file.
   - **Orientation**: how the valve stands. The Graphic turns with it, and so do its IPs.
   - **Toggle**: what a tap does (On/Off opens or closes it with one click).
   - **Overlay**: drawn on top while the valve is open (the steady red and yellow lightning bolt). On the same line,
     **Database and .API ⬢** opens its settings (Help 98).
   - **X**, **Y**, **Width** and **Height**, and the **Device Type** greyed out.
   **Enter** takes you through Label, Interface, Available Ports, Tab, Orientation, then **➕ Add Device**. If **➕ Add Device**
   looks faded, press it anyway: it tells you what is still missing.
4. Press **➕ Add Device**. The valve goes on the Tab you picked and its Properties open. The **Interface** and **Port** are now
   greyed out and set; press **✏ Change** beside them to change them on purpose.

## Properties, from the top

1. The title is the valve (**Skynet Motorized Ball Valve** or **User Defined Motorized Ball Valve**), with the **🔓 lock**,
   **Visible** and **Hidden Locked** beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢** and **Label Visible**. A Label is never blank: leave it empty and it becomes the Name.
3. **2. Interface (board)** and **Available Ports**, greyed out with **✏ Change**.
4. **3. Tab** and **4. Name** (the Suggested Name; you may type your own).
5. **Graphic**, **Path** and **Orientation**.
6. **Toggle**, then **Overlay** with **Database and .API ⬢**.
7. The valve's own settings: **Tap water valve** (see [Tap water valves](31-tap-water-valves)) with its **Tap end**, and **Close all list** /
   **Open all list** (is it closed by `close_all_valves` and opened by `open_all_valves` in a Process). A tap water valve is
   always on the Close all list and never on the Open all list.
8. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, and the **Device Type** greyed out.

## Skynet or User Defined

| | Skynet Motorized Ball Valve | User Defined Motorized Ball Valve |
|---|---|---|
| Path | greyed out: set by its Skynet Template, follows the Orientation | **Path (closed)** and **Path (open)**: your pictures. The ⬢ beside Path (closed) sets where the In and Out IPs are |
| Orientation | Horizontal, Vertical Left, Vertical Right, Front, 45 degrees | Horizontal, Vertical, 45 degrees Left, 45 degrees Right |
| Toggle and Overlay | yours to pick (they start as On/Off and the steady bolt) | yours to pick |
| Width and Height | its Template's size for each Orientation | 150 x 150 to start |

Settings these dialogs no longer show (Invert, One-shot, Text when on / off, Flip, Service) are kept if a valve already had them.
