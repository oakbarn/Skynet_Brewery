# The Pump Standard: swap one pump for another

Every pump has **8 IPs in the same spots**, and every Skynet pump picture is drawn in the **same 300 x 300 box** (Skynet Rule 5.27).
So you can take one pump out, put a different one in the **same X and Y at the same size**, and it stays joined to the same pipes.

## The 8 IPs

Every pump has 8 IPs: the 4 corners of its box and the middle of each side, the same on every pump, so another pump can take its
place and stay joined to its pipes.

| Top Left | Top Middle | Top Right |
|---|---|---|
| **Left Middle** | (the pump) | **Right Middle** |
| **Bottom Left** | **Bottom Middle** | **Bottom Right** |

The pipes and hoses set which one is its Inlet (IN) and which its Outlet (OUT), as seen on the Tab. There is nothing to pick:

- **Draw or drop a pipe or hose end on or near the pump** and it joins the nearest of the 8 IPs; the pump's free end (IN or OUT
  with nothing joined yet) moves there. With both ends free, the one nearer that spot moves (OakBarn Brewery, 2026-11-16: "Pipe and
  hose changes are always auto"; "nearest where the user places it").
- **Before anything is joined**, a Skynet pump starts with its Inlet on the **Right Middle** and its Outlet on the **Top Right**; with Orientation **Left** that is the **Left
  Middle** and the **Top Left**. A pump with your own picture starts on the middle of its left and right sides.
- The two are never on the same spot, so it is always clear which is In and which is Out, even when both are on one side.
- Example: the 3 Vessel 1 Pump sample pump (shown Left) has its Inlet on the Left Middle and its Outlet on the Top Left.

## Hose or Pipe

What is drawn from the pump's own inlet and outlet to its Inlet IP and Outlet IP: a white **Hose**, or a stainless **Pipe**. It is
drawn over the pump and its Cover, under the On overlay. It runs straight out of the port, round the inside edge of the pump's box,
and out to the spot, and it turns with the pump when it is shown Left. A pump with your own picture has no Hose or Pipe (Skynet does
not know where its ports are), so its IPs are simply on the spots.

**With a pipe or hose joined to the IP**, that end is drawn like the pipe or hose on it: the same kind, color and thickness, so the
two meet as one piece. With nothing on the IP, the Hose or Pipe picked here is drawn.

**A corner IP** (Top Left, Top Right, Bottom Left, Bottom Right) can be reached from the side or from the top or bottom. Skynet
picks it for you: the Hose or Pipe comes in the same way as the pipe or hose joined to that IP. With nothing joined yet, it comes
in along the side, and it turns to follow as soon as a pipe or hose is joined. There is nothing to pick.

**IP Type In** and **IP Type Out** are the connector on the pump's inlet and outlet: Tri-Clamp, NPT, BSP or Quick Disconnect
(Skynet Rule 5.40). A pump starts with the one its **Ports** say (TC is Tri-Clamp, FPT or MPT is NPT, BSP is BSP), or else the
**Default pipe IP Type**.

## Pipes on a pump

When you pick another spot, a pipe joined to the Inlet or Outlet stays where it is: the pump moves onto its line, and the pipe's end
slides along to meet the new spot. The same happens when a Tab with an older pump is shown.

## Still drawn to scale

The brew pump drawings (March, Chugger, Blichmann Riptide, Topsflo, KegLand) are all at the same scale: 1 inch is 20 in the 300 x 300
box, or 10 on a 150 x 150 pump. A pump starts at **150 x 150** on a Tab. If you resize it, the spots grow or shrink with its box, so
two pumps of the **same size** always have their IPs in the same place. The Covers line up the same way. The older Riptide-style
color pictures follow the Pump Standard too.

| Where the pump's own port ends (Orientation Right) | In the 300 x 300 drawing | On a 150 x 150 pump |
|----|-----|-----|
| Inlet port | 285 across, 150 down | 142.5 across, 75 down |
| Outlet port | 243 across, 56 down | 121.5 across, 28 down |

The Hose or Pipe starts there.

## Replacing a pump

1. Open **Edit layout** and note the old pump's **X** and **Y** (and its size, 150 x 150 to start).
2. Add the new pump with the same Orientation, and put it at the same X and Y (or use 🔁 Swap places, Rule 5.37).
3. Its free inlet and outlet go to the nearest spots as the pipe ends join it. **Save layout**.

## Older Schemas

The first time a Schema is opened, each Pump (and each Picture showing a Skynet pump) becomes 150 x 150 about its middle, and it is
moved back onto its pipes (Rule 5.23).

The **sump pump** sits in the liquid and draws in through its screen, so it keeps its own size and its own two IPs.
