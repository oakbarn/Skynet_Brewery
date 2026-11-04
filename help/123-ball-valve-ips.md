# IPs on ball valves and pumps

Every ball valve has **two IPs**, one at each pipe end, so a pipe joins each side of it (Skynet Rule 5.24). This is true for
the **Skynet Motorized Ball Valve Device** and for the **Manual Valve Widget** (the hand-turned ball valve), in every
Orientation. The IPs sit where Rule 5.20 puts them: at the center of the opening, which on a TC valve is the center of the
ferrule's outer face (the flat end the clamp goes on).

## Skynet Motorized Ball Valve (a Device)

| Orientation | Where its two IPs are |
| --- | --- |
| Horizontal | the left and right ends of its pipe |
| Vertical Left, Vertical Right | the top and bottom ends of its pipe |
| 45 degrees | the two ends of its pipe, turned with the picture |
| Front (looking down the pipe) | both at the center of the opening |

The **45 degrees** Orientation used to put the IPs on the corners of the box. Now they turn with the picture and sit on the pipe
ends, the same as every other Orientation. This works for every Skynet valve drawing that can turn 45 degrees.

## Manual Valve Widget

| Picture | Where its two IPs are |
| --- | --- |
| Plain (the drawn valve) | the left and right ends of the drawn valve |
| Manual Ball Valve, side view | the outer face of each ferrule, left and right |
| Manual Ball Valve, front view | both at the center of the opening |
| Manual Ball Valve on a front elbow | the center of the opening, and the bottom ferrule's outer face |
| A picture of your own | the middle of its left and right sides |

- **Rotate 45** on the Edit layout bar turns the valve, and its IPs turn with it. Two steps stand it up (Vertical).
- A Manual Valve sits **centered on its pipes**, like every other valve (Rule 5.23).
- A closed Manual Valve still blocks both of its ends; open, flow passes through either way.
- Its name (ManualValve_1) and `.state` are the same as before. Only how pipes join it changed.

## Skynet Pumps

Every Skynet Pump has an **IP on its inlet** (IN) and an **IP on its outlet** (OUT), in both Orientations (Right and Left) and
with any Cover (Skynet Rule 5.24).

| Pump picture | Inlet IP | Outlet IP |
| --- | --- | --- |
| Skynet pump drawings (March 809 / 815, Chugger, Blichmann Riptide, Topsflo TD5, KegLand MKII) | the tip of the inlet port | the tip of the outlet port |
| Older Riptide-style pictures (`Pump_Blue_Rip_Off` and the other colors, No Cover, .svg or .png) | the outer face of the union on the pump head | the top of the pipe going up |
| Sump pump | the middle of the screen at its bottom | the top of the riser on its right |
| A picture of your own | the middle of its left side | the middle of its right side |

Orientation **Left** mirrors the pump, and its IPs mirror with it.

## Older Schemas

Before this, a Manual Valve Widget had only **one** IP, in its middle. When a Tab with an older Manual Valve is shown (and once
when you open **Edit layout**), each pipe that was joined to its middle is joined to the nearer end instead; two pipes take one end
each (Rule 15.2). Press **Save layout** to keep it.
