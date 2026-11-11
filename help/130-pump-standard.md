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

Pick which one is its Inlet (IN) and which its Outlet (OUT), as seen on the Tab, in the pump's Add box or Properties:

- **Inlet IP** and **Outlet IP** (on one line). The first choice in each list, marked **(start)**, is where it starts: a Skynet pump
  starts with its Inlet on the **Right Middle** and its Outlet on the **Top Right**; with Orientation **Left** that is the **Left
  Middle** and the **Top Left**. A pump with your own picture starts on the middle of its left and right sides.
- The two are never on the same spot, so it is always clear which is In and which is Out, even when both are on one side.
- Example: the 3 Vessel 1 Pump sample pump (shown Left) has its Inlet on the Left Middle and its Outlet on the Top Left.

## Hose or Pipe

What is drawn from the pump's own inlet and outlet to its Inlet IP and Outlet IP: a white **Hose**, or a stainless **Pipe**. It is
drawn over the pump and its Cover, under the On overlay. It runs straight out of the port, round the inside edge of the pump's box,
and out to the spot, and it turns with the pump when it is shown Left. A pump with your own picture has no Hose or Pipe (Skynet does
not know where its ports are), so its IPs are simply on the spots.

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

1. Open **Edit layout** and note the old pump's **X**, **Y**, **Inlet IP** and **Outlet IP** (and its size, 150 x 150 to start).
2. Add the new pump with the same Orientation, Inlet IP and Outlet IP, and put it at the same X and Y (or delete the old one first).
3. Its inlet and outlet land on the same pipe ends. **Save layout**.

## Older Schemas

The first time a Schema is opened, each Pump (and each Picture showing a Skynet pump) becomes 150 x 150 about its middle, and it is
moved back onto its pipes (Rule 5.23).

The **sump pump** sits in the liquid and draws in through its screen, so it keeps its own size and its own two IPs.
