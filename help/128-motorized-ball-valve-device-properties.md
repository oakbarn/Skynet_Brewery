# Motorized Ball Valve Device Properties

Adding a **Motorized Ball Valve** works the same way as adding a Pump (see [Pump Device Properties](115-pump-device-properties)),
with one difference: **a valve has no Cover**. (Skynet Rule 18.23)

## Adding a Motorized Ball Valve

1. In Edit layout, click **Valves > Motorized Ball Valve, open / closed (relay)** (it is in the **On/Off** list too).
2. **Pick the valve.** Each one has its picture:
   - **Skynet Motorized Ball Valve**: the Skynet drawing (blue actuator). Its picture is set.
   - **User Defined Motorized Ball Valve**: your own pictures, and you set where its In and Out IPs are.
3. The Add box opens with the valve's name as its title. Its **Label** is already filled in as **mBV_1**, mBV_2 ... (the next
   number), so the cursor starts on the next empty field. You can change the Label, but it can't be blank. Fill it in order: 1 the
   **Label** (the ⬢ beside it sets its font and colors) and **Label Visible**, 2 the **Interface (board)** and an **Available Port** on the same line, 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Graphic**: the valve as it will show on the Tab, closed, turned to its Orientation.
   - **Path**: the picture file.
   - **Orientation** and, on the same line, **Toggle**: how the valve stands (the Graphic and its IPs turn with it), and what
     a tap does (On/Off opens or closes it with one click).
   - **Overlay**: drawn on top while the valve is open (the steady red and yellow lightning bolt). On the same line,
     **Database and .API ⬢** opens its settings (Help 98).
   - **Tap water valve**, **On Close List** and **On Open List** on one line (both lists on to start).
   - **X**, **Y**, **Width** and **Height**, and the **Device Type** greyed out.
   **Enter** takes you through Label, Interface, Available Ports, Tab, Orientation, then **➕ Add Device**. If **➕ Add Device**
   looks faded, press it anyway: it tells you what is still missing.
4. Press **➕ Add Device**. The valve goes on the Tab you picked and its Properties open. The **Interface** and **Port** are now
   greyed out and set: they are the wiring, so they stay as they are. To wire it to another board or pin, delete it and add it again. Its Name can still be changed with **✏ Change name**.

## Properties, from the top

1. The title is the valve (**Skynet Motorized Ball Valve** or **User Defined Motorized Ball Valve**), with the **🔓 lock**,
   **Visible** and **Hidden Locked** beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢** and **Label Visible**. A Label is never blank: leave it empty and it becomes the Name.
3. **2. Interface (board)** and **Available Ports**, greyed out (the board and pin it is wired to).
4. **3. Tab** and **4. Name** (the Suggested Name; you may type your own).
5. **Graphic** and **Path**, then **Orientation** and **Toggle** on one line (as on the Pump).
6. **Overlay** with **Database and .API ⬢**.
7. The valve's own settings: **Tap water valve**, **On Close List** and **On Open List**, all three on one line (see [Tap water valves](31-tap-water-valves)).
   On Close List: `close_all_valves` in a Process closes it. On Open List: `open_all_valves` opens it. A tap water valve shows its
   **Tap end** instead, and is always on the Close List and never on the Open List.
8. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, and the **Device Type** greyed out (**DO: eVlv**).

The Suggested Name follows the naming format (Rule 3.1): Interface ID, Port, `eVlv`, Label, Tab ID, such as
`22_E_eVlv_MBV1__BR`. Valves added before 2026-11-05 keep their `E_L_Vlv` names (names never change by themselves, Rule 3.5).

## Skynet or User Defined

| | Skynet Motorized Ball Valve | User Defined Motorized Ball Valve |
|---|---|---|
| Path | greyed out: set by its Skynet Template, follows the Orientation | **Path (closed)** and **Path (open)**: your pictures. The ⬢ beside Path (closed) sets where the In and Out IPs are |
| Orientation | Horizontal, Vertical Left, Vertical Right, Front, 45 degrees | Horizontal, Vertical, 45 degrees Left, 45 degrees Right |
| Toggle and Overlay | yours to pick (they start as On/Off and the steady bolt) | yours to pick |
| Width and Height | its Template's size for each Orientation | 150 x 150 to start |

Settings these dialogs no longer show (Invert, One-shot, Text when on / off, Flip, Service) are kept if a valve already had them.
