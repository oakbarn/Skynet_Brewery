# A pump or valve cuts a pipe

In **Edit layout**, drop a **Pump**, a **Valve** (on/off or Proportional) or a **Manual Valve** right on a pipe you have
already drawn, and Skynet joins it into the pipe for you (Skynet Rule 5.26). It works the same when you add a new Pump or Valve
that lands on a pipe.

## Dropped between the pipe's ends

The pipe is **cut into separate pipes**, one joined to each IP of the pump or valve.

- A valve: the pipe becomes two straight pipes, one on each end of the valve.
- A pump: the pipe on the side its **inlet** faces runs straight into the inlet. Its **outlet** opens on top, across the pipe,
  so that piece is **taken round with elbows**: up out of the outlet, across past the side of the pump, and back down onto the
  pipe's line. A pipe that runs up and down is the same the other way: straight into the outlet, round to the inlet.
- The pump or valve moves across (not along) so it sits right on the pipe's line (Rule 5.23).
- The first piece keeps the pipe's Name, Label, size and Flow Color. The new pieces get the next Pipe_N names and the same size
  and Flow Color.

**Tip:** to have the inlet on the other side, set the pump's **Orientation** (Right or Left) before you drop it on the pipe.

## Dropped over the end of a pipe

The pipe is made **shorter** and the pump or valve is joined in with **both of its IPs**.

- **An open end** (nothing joined to it): the open end goes away, the pipe joins one IP, and the other IP is now the end of the
  line, ready for the next pipe.
- **An end on a tee, an elbow, a vessel port or another IP:** that end stays where it is. The pump or valve slides back along
  the pipe so it is clear of it; one IP joins the shortened pipe and the other is joined by a short new pipe to the tee (or
  whatever the end was on).

## When nothing is cut

- The pump or valve is still joined to another pipe, or it is Locked. A pump or valve you **drag off** its pipes lets them go
  (Rule 5.19), so dropped on another pipe it cuts that one. One still joined says so in a message.
- The pipe is a hose, or runs at 45 degrees; the valve is turned 45 degrees or is a front view.
- There is not enough pipe left to go round the pump or to put it in. Move it further along the pipe, or draw a longer pipe.

A message at the bottom of the screen says what was done (or why not). Press **Save layout** to keep it, or **Exit** without
saving to put everything back.
