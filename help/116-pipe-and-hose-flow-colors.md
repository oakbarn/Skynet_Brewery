# Pipe and Hose Flow Colors

When liquid moves through a Pipe or Hose, the moving flow is drawn in a color. Skynet picks that color for you, from the
Tab, the pipe, the Vessel the flow came from, or a Tap Water Valve.

## Making a Pipe or Hose

A Pipe or Hose is a Widget, but it is **not in the Widget List**. The only way to make one is **Draw pipe** or **Draw hose**
on the Edit layout bar, right on the Tab where it goes (not on the Build Tab first).

## Where the color comes from

The first one that fits wins:

1. **A Vessel's Out flow color.** Flow that begins at a Vessel whose **Out flow color** is not None takes that color, over
   everything else. Example: set your HLT's Out flow color to Red, and whenever flow starts from the HLT's outlet it is Red,
   through the pump and on to wherever it goes.
2. **A Tap Water Valve.** Flow from an open Tap Water Valve is always **Blue**.
3. **The Tab's Flow Color**, when it is **Tap**, **Strike**, a plain color or RGB: every pipe and hose on the Tab takes it.
4. **The pipe's own Flow Color**, when it is not None.
5. **The Tab's Flow Color**, when it is **Mash**, **Boil**, **Whirlpool** or **Ferment** (a pipe with its own Flow Color
   keeps its own).
6. Everything None: the standard light blue flow.

**None is the default** for every pipe, hose, Tab and Vessel.

## The color choices

| Choice | Color |
|---|---|
| None | (nothing set) |
| Tap | Blue |
| Strike | Red |
| Mash | Brown |
| Boil | Reddish Brown |
| Whirlpool | Brown |
| Ferment | Golden |
| Red, Yellow, Blue, Green | the primary colors |
| Brown, Orange, Purple, Reddish Brown, Golden | |
| RGB | a color of your own, picked with the color picker |

## Setting it

- **Tab**: Edit layout > **Tab settings** > **Flow Color**.
- **Pipe or Hose**: double-click it > **Flow Color**.
- **Vessel**: double-click a kettle, HLT, mash tun or fermenter > **Out flow** > **Out flow color**.

## In a Process

```
tab.flow_Color = Mash
Pipe_3.flow_Color = Orange
Hose_1.flow_Color = "RGB 160 69 42"
tab.flow_Color = None
```

- **`tab`** means the Tab with the focus: the Tab each screen is showing. While a Process has set it, it wins over the Tab
  settings Flow Color. `tab.flow_Color = None` hands it back to the Tab settings.
- **`Pipe_N.flow_Color`** (or `Hose_N.flow_Color`) sets one pipe or hose. `.flow` means the same.
- A color can be written plainly (`Mash`, `Reddish_Brown`) or in quotes (`"Reddish Brown"`, `"#a0452a"`, `"RGB 160 69 42"`).
- A Process can read them too: `if tab.flow_Color == "Mash"`.
- What a Process sets lasts until it is set to None, another Schema is loaded, or the panel restarts.
- **Flow Color is the only Process attribute of a Pipe or Hose.**

## Label, Name, Position and Size

A Pipe or Hose has a **Label** like every other Widget: double-click it, type the Label and switch **Show label** on, and it shows
in the middle of the pipe. Its **Name** is given by Skynet (Pipe_1, Hose_1 ...) and is what a Process uses.

A pipe has **no Position or Size boxes**: it is where you drew it, so X, Y, Width and Height are hidden. Move or stretch a pipe on
the Tab in Edit layout, as before.
