# The Valve Standard: swap one valve for another

Every valve picture is drawn in the **same 300 x 300 box**, with its pipe running **through the middle**, so its **two IPs are always
in the same spots** (Skynet Rule 5.29). You can change a Ball valve for a Butterfly, or a Manual valve for a Motorized one, at the
**same X and Y and the same size**, and it stays joined to the same pipes.

## Where the IPs are

A valve starts at **150 x 150** on a Tab (the same as a pump, so valves and pumps are to the same scale).

| Orientation | In the 300 x 300 drawing | On a 150 x 150 valve |
|----|-----|-----|
| Horizontal | (0, 150) and (300, 150) | the middle of the left and right sides |
| Vertical Left, Vertical Right | (150, 0) and (150, 300) | the middle of the top and bottom |
| 45 degrees | the Horizontal spots, turned 45 degrees about the middle | |
| Front (looking down the pipe) | both at (150, 150) | the middle |
| Front elbow | (150, 150) and (150, 300) | the middle, and the middle of the bottom |

If you resize a valve, the spots grow or shrink with its box. Keep it square so the spots stay on its sides.

## Drawn to scale

Every Skynet valve drawing is at the same scale in the box. A valve that is shorter than the box has its pipe drawn on, straight, out
to the edge of the box, where the IP is.

## A valve with your own picture

For a **User Defined Motorized Ball Valve**, a **User Defined Proportional Valve**, or any valve with a picture of your own:

- Your picture is **resized to fill the square box**, and the IPs go on the same spots as a Skynet valve's for its Orientation.
- If you set its **In and Out spots** (the ⬢ beside Path (closed), or the % boxes), Skynet **moves and sizes your picture** so those
  two spots sit right on the IPs. Part of the picture may be cut off at the edge, or it may look a little off center. That is the price
  of every valve lining up the same way.

## Older Schemas

The first time a Schema is opened, each valve with a picture becomes **square about its middle**: 150 x 150, or smaller if a pipe joined
to it is too short for the IPs to move out that far. It is then moved back onto its pipes (Rule 5.23). **Save layout** keeps it.

The **Manual Valve Widget** sizes itself to its pipe, like a pipe fitting, so it is not part of this standard. The **check valve** is a
pipe fitting.

## Test: a pump on the valve spots

To see whether pumps could follow the same idea, **Pump_1** in the **Three Vessel One Pump** sample uses a test picture
(Pump_Red_Rip_Off_Valve_IPs_Test.svg): the red Riptide-style pump with its IPs on the valve spots, so it sits in a straight pipe like a
level valve. Its outlet pipe is drawn up and over the pump to the other side. It is only a test: the Pump Standard (Help 130) has not
changed, and the old picture is kept, so the pump can go back to Pump_Red_Rip_Off.svg at once.
