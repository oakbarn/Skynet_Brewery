# Process Order

Every Process in the list on the **Processes** page has an **Order** number in a small box in front of its name. The number sets where the Process shows in the list, so you can put the ones you use most at the top.

## Moving a Process

1. Click the Order box of the Process you want to move.
2. Type the place you want it in, for example **1** for the top.
3. Press **Enter** (or click somewhere else).

The Process moves there, and **the other Processes are numbered again by themselves** (1, 2, 3 ...), so there are never two with the same number and never a gap. Typing a number bigger than the list puts it last; typing 0 puts it first.

## Good to know

- Each group in the list (Flow, Sub, Repeat, Looper) counts on its own, starting at 1.
- A new Process goes to the end of its group.
- **Rename** keeps its place. **Delete** closes the gap. A Process brought back from the Recycle Bin goes to the end.
- Changing a Process's class moves it to the end of its new group.
- The Order only sorts the list. It does not change when a Process runs or its step numbers.
- Everyone sees the same order. Only an Admin can change it.
- The numbers are kept on the Brain in `config/brewery.json` under `processOrder`.

See [Processes](05-scripts).
