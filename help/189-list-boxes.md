# List Boxes (Dropdowns)

A **list box** (also called a **dropdown** or **drop down list box**) is a box with a small ▼ at its right end. Click it and a
list of choices opens; click one and it is picked. Skynet uses a list box wherever there are **more than two answers**
(a plain Yes / No is a switch instead, Rule 2.5).

## In a few words

- **Click** the box (or tap it on a phone) to open the list, then **click a choice** to pick it.
- **Type a letter** to jump to the choice that starts with it. Every choice in a Skynet list starts with its own first
  letter, so one letter is enough: in the HLT element's **Overlay** list, **R** picks **Red Glow**, **O** picks **Orange Glow**.
- **Type a name quickly** (keys less than about a second apart) to jump to the first choice that starts with those letters:
  in the HLT element's **Temperature Probe** list, typing **BM_700** jumps to **BM_700_TEMP@1W_HLT_BH**.
- **Up and Down arrows** move one choice at a time. **Enter** or **Tab** keeps it and goes to the next box.
- The choice picked now has a **Cyan** background when the list is open (Rule 2.34).
- **➕ Add new ...** at the end of a list makes a new choice. The dialog waits, the new thing is made in its own dialog, then you
  come back with it picked and nothing you typed lost (Rule 18.14).
- **Double-click** a list box that picks a Device, Widget, Tab, vessel or IP to open the Properties of the one picked (Rule 2.19).
- **Rest the mouse on the name** in front of the list box for its Hover Help. The list itself never shows a balloon, so the
  help never covers a choice (Rule 2.38).

## How a list box is filled

Every list box gets its choices from one of three places:

| Where the choices come from | Example in the 3 Vessel 1 Pump sample | Can you add to it? |
|---|---|---|
| **Built into Skynet** (a fixed list Skynet itself works with) | The HLT element's **Current Method**: Direct, Duty Cycle, Hysteresis, PID ... | No |
| **Your Schema** (the Devices, Widgets, Tabs and Interfaces you have made) | The HLT element's **Temperature Probe**: BM_700_TEMP@1W_HLT_BH, BM_701_TEMP@1W_Mash_BH, BM_702_TEMP@1W_Kettle_BH | Yes: ➕ Add new ... makes a new one |
| **A list that grows** (pictures, Styles, units, colors ...) | The Tab list: **BH: Brew House**, then **➕ Add new Tab…** | Yes: what you add stays in the list for next time |

- Names are listed **A to Z**, so BM_700 comes before BM_701.
- Interfaces and Tabs read **ID: Name**, for example **BM: Brewery Mega** and **BH: Brew House** (Rule 18.17).
- Each choice is **short and in plain English**; what a choice does is in the Hover Help (Rule 2.38).

## How the choices are limited

A list box only offers what can go there. You never have to scroll past things that would not work.

- **By kind:** the HLT element's **Temperature Probe** list holds only Temperature Probes, never a pump or a valve.
- **By board:** a vessel with a heat Device picked only offers the Temperature Probes on **the same board** as that heat Device.
- **By what is free:** the **Available Ports** list of a new Device shows only the ports of that Interface that are not used yet.
- **Never offered:** Clones of a Device (use the Device's own name) and hidden keys.

### Typing BM_ to see only one board's Devices

Every Device name starts with its **Interface ID** (Rule 3.1): `BM_8_DO@H_Element_HLT~element_BH` is on **BM: Brewery Mega**,
port 8. So when Suggested Names are used, the first letters of a name tell you which board a Device is on.

- **In the Process editor** (Predictive Text, Help 79), typing **BM_** shows **only** the names that start with BM_, which
  means only the Devices on the Brewery Mega. Each letter more narrows it again: **BM_70** leaves only the three probes.
- **In a dialog's list box**, typing **BM_** quickly **jumps** to the first choice that starts with BM_. The other choices
  are still in the list; they are not hidden.

If you add a second board, for example a fermentor board with the ID **FM**, typing **FM_** finds its Devices the same way.
A name you typed yourself (not the Suggested Name) may not start with an Interface ID, so it is not found this way.

## The technical side

- A list box is the browser's own `<select>` box, so it looks a little different on Windows, Mac, Android and iPhone. On an
  iPhone or iPad it opens as a spinning wheel and the Cyan background does not show (Rule 2.35: phones and tablets are for
  running the brewery, not for building it).
- Behind each list is a list of pairs: the **text** you see and the **value** that is saved. A Process reads the value
  (Rule 2.6). For a Device the value is its name; for a built-in list it is a short word or a number.
- Jumping by typing is done by the browser: one letter (or the same letter again) steps through the choices starting with it;
  letters typed less than about a second apart are searched as one word, matched against the **start** of the choice's text.
  Where a choice shows a Label first (for example **HLT: BM_700_TEMP@1W_HLT_BH**), type the Label's letters.
- The Process editor's list is Skynet's own list box (Help 79). It matches the start of a name, or any part of it after a `_`
  once two letters are typed (`Pump` finds `BM_22_DO@Pump_Pump_BH`). An `_` you type is part of the match, so **BM_** only
  matches names that start with BM_.
- What you add to a list that grows is saved with the Schema on the Brain, so it is in the list next time, on every computer
  or phone that opens that Schema.
