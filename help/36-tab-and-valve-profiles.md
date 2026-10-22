# Tab Background and Valve Profiles

Both are Menu tabs (**☰ Menu**). Each profile is kept on the Brain, in `config/profiles/tab` and `config/profiles/valve`, so every Schema can use it. Only an Admin can make or change them.

## Tab Background Profile

A Tab Background Profile gives a tab its **background color**, and the **look** a new device or widget on that tab starts with:

- **Name**: text color, background color and placement (TopLeft ... BottomRight).
- **Value**: text color, background color and placement.
- **Value type**:
  - **LED (push button)**: **Locking** (press: ON, press again: OFF) or **Momentary** (ON only while held). Something ON / OFF shows a lit dot; a number shows red LED digits.
  - **Text**: plain text.
  - **Gauge**: LCD digits, with how many **Digits** and how many decimals (**Precision**).

Something with an ON / OFF state (a pump, valve, switch) can only be an LED or Text; a Gauge shows it as Text. Something with neither a value nor a state (a picture, a label) takes only the colors. Pumps and valves keep their pictures.

**The look is copied only when the device or widget is made.** After that, change it in its properties (in Edit layout), or from a Process (for example `Pump_1.valueColor = "Red"`, see [The Process language](22-process-language)). Changing the profile later does not change what is already on the tab.

### Give a tab its profile

- On the **Tab Background Profile** Menu tab, the table at the bottom lists the loaded Schema's tabs. Pick the profile for each one.
- Or in Edit layout, open **⚙ Tab settings** and pick **Tab Background Profile**.

A tab with its own **Background color** in Tab settings keeps that color. Set it to **Default** to use the profile's color.

The **Default** Menu tab picks the Tab Background Profile a **new tab** gets.

## Valve Profile

A Valve Profile is how a new valve starts:

- **Graphic when open** and **Graphic when closed**.
- **Orientation**: **Horizontal** (pipe ends left and right), **Vertical** (top and bottom), **45 degrees Left** (top left and bottom right corners) or **45 degrees Right** (top right and bottom left). For Horizontal and Vertical, pick graphics drawn that way. For the 45s, pick the **vertical** graphics: the panel turns them 45 degrees left or right for you. The 45s are for a valve sitting on a 45 degree elbow.

Skynet's own valve pictures are SVG files in `Images/samples`, so they stay sharp at any size and can't be deleted (see [Media](07-media)):

| Picture | Open | Closed |
|---|---|---|
| Motorized ball valve, horizontal | Valve_Motor_Ball_OpenH.svg | Valve_Motor_Ball_ClosedH.svg |
| Motorized ball valve, vertical, motor on the right | Valve_Motor_Ball_OpenV_RC.svg | Valve_Motor_Ball_ClosedV_RC.svg |
| Motorized ball valve, vertical, motor on the left | Valve_Motor_Ball_OpenV_LC.svg | Valve_Motor_Ball_ClosedV_LC.svg |

Open shows red lightning bolts on the motor; closed shows a ring on the valve body. A new Valve Profile and a new valve start with these (vertical, motor on the right). Pick the motor-on-the-left pair where the motor would be in the way. Valves made before keep the pictures they have.

You pick the Valve Profile **only when you make a new valve**: in Edit layout, **Add element > Valve**, and the panel asks which Valve Profile to start from (the **Default** Menu tab sets the one picked first). After that, the valve is changed in its own properties, where **Orientation** and the graphics can be set again.
