# Tab, Valve and Pump Profiles

All three are Menu tabs (**☰ Menu**): Tab Profile, Valve Profile and Pump Profile. Each profile is kept on the Brain, in `config/profiles/tab`, `config/profiles/valve` and `config/profiles/pump`, so every Schema can use it. Only an Admin can make or change them.

## Tab Profile

A Tab Profile gives a tab its **background color**, and the **look** a new device or widget on that tab starts with:

- **Name**: text color, background color and placement (TopLeft ... BottomRight).
- **Value**: text color, background color and placement.
- **Value type**:
  - **LED (push button)**: **Locking** (press: ON, press again: OFF) or **Momentary** (ON only while held). Something ON / OFF shows a lit dot; a number shows red LED digits.
  - **Text**: plain text.
  - **Gauge**: LCD digits, with how many **Digits** and how many decimals (**Precision**).

Something with an ON / OFF state (a pump, valve, switch) can only be an LED or Text; a Gauge shows it as Text. Something with neither a value nor a state (a picture, a label) takes only the colors. Pumps and valves keep their pictures.

**The look is copied only when the device or widget is made.** After that, change it in its properties (in Edit layout), or from a Process (for example `Pump_1.valueColor = "Red"`, see [The Process language](22-process-language)). Changing the profile later does not change what is already on the tab.

### Give a tab its profile

- On the **Tab Profile** Menu tab, the table at the bottom lists the loaded Schema's tabs. Pick the profile for each one.
- Or in Edit layout, open **⚙ Tab Settings** and pick it under **Background > Profile**.

A tab with its own **Background > Color** in Tab Settings keeps that color. Set it to **Default** to use the profile's color.

### New Tabs

A Tab Profile also holds what a **new Tab** made with it starts with: **How many Pixels are Pipes to be drawn on a Tab?** (10 if empty), **How many Pixels are Hoses to be drawn on a Tab?** (6 if empty), **Width of a New Tab (px)** and **Height of a New Tab (px)** (the size of the screen if empty). Each Tab still changes its own in **⚙ Tab Settings**.

☰ Menu > Default settings > **Tab Profile for a new tab** picks the Tab Profile a **new tab** gets ([Default settings](155-default-settings)).

## Valve Profile

A Valve Profile is how a new valve starts:

- **Graphic** (the valve as drawn): one picture. **Graphic when open** shows only on a profile that already has one. Skynet valves have no open pictures: the valve keeps its picture and the **On overlay** shows it is open ([Retired Skynet pictures](129-retired-skynet-pictures)).
- **Orientation**: **Horizontal** (pipe ends left and right) or **Vertical** (top and bottom). The 45s show only on a profile already set to one: **45 degrees Left** (top left and bottom right corners) or **45 degrees Right** (top right and bottom left). For Horizontal and Vertical, pick graphics drawn that way. For the 45s, pick the **vertical** graphics: the panel turns them 45 degrees left or right for you. The 45s are for a valve sitting on a 45 degree elbow.
- **Overlay**: what shows over the valve while it is open ([On overlay](58-on-overlay)). A new Valve Profile starts with the Overlay of the Valve Profile marked **Default** (the Lightning Bolt if none is marked). A new valve takes the Overlay of the Valve Profile picked in its Add box.

Skynet's own valve pictures are SVG files in `Images/samples`, so they stay sharp at any size and can't be deleted (see [Media](07-media)):

| Picture | File |
|---|---|
| Motorized TC 1.5" ball valve, horizontal (the 3 Vessel valve, the first choice) | Motorized_TC15_Ball_Valve_Horizontal.svg |
| Motorized TC 1.5" ball valve, vertical, motor on the right (the 3 Vessel valve, the first choice) | Motorized_TC15_Ball_Valve_Vertical.svg |
| Motorized ball valve, horizontal | Valve_Motor_Ball_ClosedH.svg |
| Motorized ball valve, vertical, motor on the right | Valve_Motor_Ball_ClosedV_RC.svg |
| Motorized ball valve, vertical, motor on the left | Valve_Motor_Ball_ClosedV_LC.svg |
| Manual ball valve, horizontal | Valve_Manual_ClosedH.svg |
| Manual ball valve, vertical, handle on the right | Valve_Manual_ClosedV_R.svg |
| Manual ball valve, vertical, handle on the left | Valve_Manual_ClosedV_L.svg |
| Manual butterfly valve, horizontal | Valve_Manual_Butterfly_ClosedH.svg |
| Manual butterfly valve, vertical, handle on the right | Valve_Manual_Butterfly_ClosedV_R.svg |
| Manual butterfly valve, vertical, handle on the left | Valve_Manual_Butterfly_ClosedV_L.svg |
| Solenoid gas valve, horizontal | Valve_Gas_Solenoid_ClosedH.svg |
| Solenoid gas valve, vertical, coil on the right | Valve_Gas_Solenoid_ClosedV_R.svg |
| Solenoid gas valve, vertical, coil on the left | Valve_Gas_Solenoid_ClosedV_L.svg |

When the valve opens, its **On overlay** (the red and yellow lightning bolt unless you pick another) is drawn on top. A solenoid gas valve has a brass body and a black coil with a flame; set its **Service** to **Gas** so it can heat a vessel. A new Valve Profile and a new valve start with the motorized one (vertical, motor on the right). Pick the motor-on-the-left one where the motor would be in the way.

Your own pictures can still come in **pairs**: pick the closed (or off) one and its open (or on) partner fills in by itself. This works the other way round too, for any picture whose name has Closed/Open or Off/On in it (for example Pump_Off.png and Pump_On.png), as long as the partner is in your pictures.

You pick the Valve Profile **only when you make a new valve**: in Edit layout, **Valves > Motorized valve**, the Add box has a **Valve Profile** dropdown. It starts on the Valve Profile marked **Default**, and you can pick another or **(none)**. After that, the valve is changed in its own properties, where **Orientation** and the graphics can be set again.

**Default:** switch **Default** on in one Valve Profile and the Add box picks it first. Only one in the list is the Default: turning it on in one turns it off in the others.

## Pump Profile

A Pump Profile is how a new pump starts. Its picture comes from the pump you pick (the model), so the profile holds the rest. Changing a Pump Profile never changes the pumps already on a Tab. Every box has its Hover Help, and the title and the **Open** list stay at the top, and the buttons (**Delete**, **Save**, **Undo**, **Close**, **✕**) stay in the upper right corner, while the rest scrolls (the Blichmann model, Skynet Rule 2.51; the other profiles too). Right of the **Open** list, **+ Add New** (the purple +) makes a new Pump Profile, the same as **Add new ...** in the list (Skynet Rule 2.55). The profile holds:

- **Orientation**: Right or Left.
- **Cover**: None or a color.
- **Hose or Pipe**: what is drawn from the pump's End Fittings to its IPs.
- **Overlay**: what shows over it while it runs.
- **Inlet IP Fitting** and **Outlet IP Fitting**: the End Fitting on its In and Out IPs (TC1.5, FPT1/2 ...). Empty: from the pump.

The **Pump Add box** has a **Pump Profile** dropdown. It starts on the Pump Profile marked **Default** and fills the boxes below with it; pick another and they change to it. You can still change any box before **➕ Add Device**. After that, the pump is changed in its own properties.

**Default:** there is always one Default Pump Profile, so the Pump Profile list has no (none). Skynet makes the first one, **Default Pump Profile**: Right, no Cover, Hose, and the Green Glow Ring Overlay. Change it as you like. Its **Default** switch can not be turned Off and it can not be deleted: to make another one the Default, open that one, turn its **Default** on and Save.

**Overlay of a new Pump Profile:** a new Pump Profile starts with the **Overlay** of the Default Pump Profile. Pump Profiles and pumps already made keep theirs. A new pump takes the Overlay of the Pump Profile picked in its Add box. (The Pump Overlay is no longer on ☰ Menu > Default settings.)
