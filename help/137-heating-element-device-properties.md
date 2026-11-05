# Heating Element Device Properties

Adding a **Heating Element** works the same way as adding a Pump (see [Pump Device Properties](115-pump-device-properties)) and a
Motorized Ball Valve (see [Motorized Ball Valve Device Properties](128-motorized-ball-valve-device-properties)): **a Heating Element
has no Cover**. (Skynet Rule 18.24)

## Adding a Heating Element

1. In Edit layout, click **Heating Element > Heating element, on / off (relay, SSR or contactor)** (it is in the **On/Off** list too).
2. **Pick the heating element.** Each one has its picture:
   - **Skynet Heating Element**: the Skynet element drawing. Its picture is set, and it glows when on.
   - **User Defined Heating Element**: your own off and on pictures.
3. The Add box opens with the element's name as its title. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font and
   colors) and **Label Visible**, 2 the **Interface (board)** and an **Available Port** on the same line, 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Graphic**: the element as it will show on the Tab, off, turned to its Orientation.
   - **Path** (a Skynet element: greyed out), or **Path (off)** and **Path (on)** (a User Defined one).
   - **Orientation** (Right or Left) and, on the same line, **Toggle** (what a tap does).
   - **Overlay** (None to start: its on picture glows) and, on the same line, **Database and .API ⬢** (Help 98).
   - **X**, **Y**, **Width** and **Height**, and the **Device Type** greyed out (**DO**).
   **Enter** takes you through Label, Interface, Available Ports, Tab, Orientation, then **➕ Add Device**.
4. Press **➕ Add Device**. The Heating Element goes on the Tab you picked and its Properties open. The **Interface** and **Port**
   are now greyed out and set (they are the wiring). A Heating Element always asks before it turns on (Rule 2.33).

## Vessel Device Template: choose, then Build

In the **Heating Element** list, **Vessel Device Template** takes the place of *Electric kettle, basic*:

1. **Choose the Vessel**: the Vessel Widget (every IP, a Temperature Probe and an Element Port, each with a Place slider) or any
   other Vessel Template that has an Element Port.
2. **Pick the heating element** and fill in the Add box, as above. Its title says which Vessel it is for.
3. **➕ Add Device** builds them: the Heating Element goes on the Tab you picked, and a copy of the Vessel goes on the
   **🔨 Build Tab** with its **Element Placed** and linked to the new Heating Element (the Element glows while it is on). Press
   **💾 Save Build ... > To a Tab** to put the Vessel on the same Tab.

The Vessel still has no Devices of its own (Rule 5.7): the Heating Element is its own Device, and the Vessel's Element spot links to
it (Rule 5.31). *Electric kettle, basic* is still in the full **Add Device** list (Devices: Skynet).

## Properties, from the top

1. The title (**Skynet Heating Element** or **User Defined Heating Element**), with the **🔓 lock**, **Visible** and **Hidden Locked**
   beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢** and **Label Visible**.
3. **2. Interface (board)** and **Available Ports**, greyed out.
4. **3. Tab** and **4. Name**.
5. **Graphic**, **Path**, then **Orientation** and **Toggle** on one line.
6. **Overlay** with **Database and .API ⬢**.
7. **X (Horizontal)**, **Y (Vertical)**, **Width**, **Height**, and the **Device Type** greyed out (**DO**).

Heating elements built into a RIMS tube or an Integrated kettle keep their present dialog (Rule 18.10). PID, Hysteresis, Deadband
and Duty Cycle heaters keep theirs too.
