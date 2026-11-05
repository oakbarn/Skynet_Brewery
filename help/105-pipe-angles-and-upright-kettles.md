# Pipe angles and upright kettles

Fritz, 2026-11-02: pipes are drawn the way real hard pipe is put together, and kettles always stand upright. This works the same on the 🔨 Build Tab and on every Tab.

## Pipes run Horizontal, Vertical or 45

- **A pipe is one straight piece.** It runs only **Horizontal**, **Vertical** or at **45 degrees**. Nothing else.
- **A pipe never bends.** To change direction you need a fitting: a **90° elbow** to go from Horizontal to Vertical, a **45° elbow** to go onto a 45, a **tee** or **cross** where pipes branch.
- Hoses are not pipes: a hose still bends in smooth curves (see [Pipes, hoses and reducers](24-pipes-and-hoses)).

## Drawing a pipe

1. In Edit layout press **Draw pipe**.
2. Double-click (or tap) where the pipe starts: on an IP, or anywhere.
3. Move the mouse. The pipe follows the nearest of the allowed directions (across, up and down, or one of the four 45s).
4. Double-click (or tap) the end. It joins the IP there only when that IP is in line with the start.

Start the next pipe on the end of the last one. Where two pipes meet, Skynet puts the joint there and draws it as the fitting they need, turned the right way: a straight coupling when they are in line, a 90° elbow, a 45° elbow, a tee or a cross. Two pipes only 45 degrees apart have no fitting, so the joint stays a plain coupling until you change one of them.

## Moving things that have pipes on them

The old way, where a pipe end was dragged along with a pump, valve or vessel and the pipe bent to any angle, is **retired**. Now:

- **The whole pipe moves along** when its other end is its own open end (a coupling only that pipe uses). It keeps its length and angle.
- **The pipe stretches or shrinks along its own line** when you move the thing on its end in line with the pipe.
- **Moved off to the side**, the pipe keeps its direction and does not follow. When you let go of the mouse, that end **lets go** of the IP, gets an open end (red ring), and a message names the pipe. Put the item back in line, or join the pipe again with an elbow or tee.
- **Save layout joins it again** when the open end is still within 14 px of an IP. If the pipe would bend, a free IP point (one with no other pipe on it) moves back onto the pipe end instead.
- A click or double-click that wobbles a few pixels does not move anything, and moving one thing never lets go of a pipe somewhere else on the Tab.
- Dragging a pipe itself moves it as one piece, as before. Dropped with an end on an IP, it joins that IP.

## Older Schemas

When a Schema is loaded, every older pipe that had bends in it is **cut at each bend into straight pipes**, and every bend gets an elbow joint, so the drawing looks the same. A piece at some other angle is turned to the nearest allowed direction; if its end then misses the IP it was on, that end lets go (red ring in Edit layout). The sample Schemas and the default Schema have been changed this way already. The Command Prompt window lists what was changed.

## Kettles stay upright

- A **kettle** (any vessel of the Vessel kind: kettles, HLT, mash tun, fermenter) can **Flip Horizontal** only.
- It can **not Flip Vertical**, and it is **not turned** (turned upside down is the same as a vertical flip). The Flip V and ⟲ 45 / ⟳ 45 buttons are greyed out while a kettle is picked, and its Properties show only Flip Horizontal.
- Chillers, coils, the RIMS tube, Skynet fittings and other equipment still have all the turn and flip buttons.
- A kettle that was turned or flipped upside down before is set upright when you open Edit layout. **Save layout** keeps it.
