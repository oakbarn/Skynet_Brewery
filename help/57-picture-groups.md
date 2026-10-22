# Picture groups

Pictures in `media/Images` are sorted into **groups**: one folder for each kind of picture, so a list of pictures never gets too long to find what you want.

## The Skynet groups

These ten groups are always there. They are made on every start, and they **can't be deleted, renamed or moved** (they show a 🔒 on the Media screen).

| Group | Folder | For example |
|---|---|---|
| Alarms | `Images/Alarms` | Alarm bells and warning signs |
| Vessels | `Images/Vessels` | Kettles, HLT, mash tun, fermenters |
| Pumps | `Images/Pumps` | Pumps on and off |
| Valves | `Images/Valves` | Ball, butterfly, solenoid and manual valves |
| Chillers | `Images/Chillers` | Plate, counterflow and immersion chillers |
| Motors | `Images/Motors` | Stirrers, stepper motors, augers |
| Lights / LEDs | `Images/Lights_LEDs` | LEDs, lamps, indicator lights |
| Hop Infusion | `Images/Hop_Infusion` | Hop droppers, hop rockets, hop filters |
| Other Equipment | `Images/Other_Equipment` | Burners, elements, fittings, RIMS tubes |
| Miscellaneous | `Images/Miscellaneous` | Backgrounds and anything else |

The folder names have `_` in place of spaces, so a Process can use a path as it is, for example `my_pump.image = "Images/Pumps/Pump_Red_Rip_On.png"`.

## Your own groups

Any other folder you make in `media/Images` is a group of your own. On the **Media** screen open **Images** and press **New picture group** (the button is called **New folder** everywhere else). Your groups can be renamed, moved and deleted like any folder (empty it first to delete it). Folders inside a group are fine too.

## Where the Skynet pictures went

The pictures that come with Skynet used to be loose in `Images` and `Images/samples`. On the first start of this version they are moved into their group, for example `Images/samples/kettle.svg` is now `Images/Vessels/kettle.svg`. Nothing you set up breaks: **an old path still finds the picture**, in a Schema, a Template or a Process. A picture you changed yourself is never thrown away; if your copy and the new one differ, both are kept.

The same goes for your own pictures: move `Images/MyPump.png` into `Images/Pumps` and anything that still says `Images/MyPump.png` keeps showing it. (Two pictures with the same name in two groups: the first group in the list wins, so give them different names.)

## Moving pictures into a group

On the **Media** screen (it works like Windows File Explorer, on a PC, Mac, Linux, Pi or phone alike, because it runs in the browser):

1. Open **Images**.
2. Pick the pictures: click one, **Ctrl+click** (Cmd+click on a Mac) to add more, **Shift+click** to pick a run. On a phone tick **Select many** and tap each one.
3. Drag them onto a group on the left, or press **Move picked** and choose the group.

**Delete picked** deletes them all (it asks first). SVG pictures (`.svg`) still can't be deleted, renamed or moved from the panel (see [Media](07-media)).

To copy a whole folder of pictures from your computer into a group, use **File Move** and pick the group in **Picture group**.

## Picking a picture from one group

Every picture list in a Properties dialog (Picture when on / off, Graphic, Background picture, imagePath_1 ...) has a **group list** beside it: **All groups**, or one group. The pick is remembered on that computer or phone. Sound lists do the same with the folders in `media/sounds`. **Add new ...** still takes any path, for example `Valves/MyValve_On.png`.

## In the Process editor: Alt+P

While writing a Process, press **Alt+P** (Option+P on a Mac), or the **Picture** button above the editor. A list of pictures opens:

- Choose **Pictures** or **Sounds**, a group (or **All groups**), and type in **Search** to narrow it down.
- The arrow keys move through the list; the picture is shown beside it (a sound can be played).
- **Double-click** or press **Enter** to put the path where the cursor is, in quotes: `"Images/Pumps/Pump_Red_Rip_On.png"`. If you already typed the opening `"`, only the path (and the closing `"`) is added.
