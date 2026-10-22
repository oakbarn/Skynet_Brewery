# Picture groups

Pictures in `media/Images` are sorted into **groups**: one folder for each kind of picture, so a list of pictures never gets too long to find what you want. The pictures that come with Skynet are kept apart from yours.

| Where | What is in it |
|---|---|
| `media/Images/Skynet/<group>` | The **Skynet pictures**. Read only. |
| `media/Images/<group>` | **Your pictures**. Add, rename, move and delete them as you like. |

## The eleven groups

Both places have the same eleven groups. They are made on every start.

| Group | Folder | For example |
|---|---|---|
| Alarms | `Alarms` | Alarm bells and warning signs |
| Vessels | `Vessels` | Kettles, HLT, mash tun, fermenters |
| Pumps | `Pumps` | Pumps on and off |
| Valves | `Valves` | Ball, butterfly, solenoid and manual valves |
| Chillers | `Chillers` | Plate, counterflow and immersion chillers |
| Motors | `Motors` | Stirrers, stepper motors, augers |
| Lights / LEDs | `Lights_LEDs` | LEDs, lamps, indicator lights |
| Hop Infusion | `Hop_Infusion` | Hop droppers, hop rockets, hop filters |
| Other Equipment | `Other_Equipment` | Burners, elements, fittings, RIMS tubes |
| Miscellaneous | `Miscellaneous` | Backgrounds and anything else |
| On Off | `On_Off` | On overlays: see-through pictures drawn on top of an item while it is on (see On overlay) |

The folder names have `_` in place of spaces, so a Process can use a path as it is, for example `my_pump.image = "Images/Skynet/Pumps/Pump_Red_Rip_On.png"` or `my_pump.image = "Images/Pumps/MyPump.png"`.

## The Skynet pictures are read only

Nothing in `Images/Skynet` can be added, changed, renamed, moved or deleted from the panel, by anyone. On the Media screen it shows a 🔒 and a yellow note; you can still look at each picture and **Copy path**. New Skynet pictures come with a Skynet update.

To change a Skynet picture, copy it to your computer, change it, and add it under a name of its own to one of your groups.

## Your own groups

The eleven standard folders for your pictures can't be deleted, renamed or moved (they show a 🔒), but the pictures in them can. Any other folder you make in `media/Images` is a group of your own: on the **Media** screen open **Images** and press **New picture group** (the button is called **New folder** everywhere else). Your own groups can be renamed, moved and deleted like any folder (empty it first to delete it).

## Where the Skynet pictures went

The Skynet pictures used to be loose in `Images` and `Images/samples`. On the first start of this version they are moved into `Images/Skynet/<group>`, for example `Images/samples/kettle.svg` is now `Images/Skynet/Vessels/kettle.svg`. Nothing you set up breaks: **an old path still finds the picture**, in a Schema, a Template or a Process. A picture you changed yourself is never thrown away; if your copy and the Skynet one differ, both are kept.

The same goes for your own pictures: move `Images/MyPump.png` into `Images/Pumps` and anything that still says `Images/MyPump.png` keeps showing it. (Two pictures with the same name in two groups: the first group in the list wins, so give them different names.)

## Moving your pictures into a group

On the **Media** screen (it works like Windows File Explorer, on a PC, Mac, Linux, Pi or phone alike, because it runs in the browser):

1. Open **Images**.
2. Pick the pictures: click one, **Ctrl+click** (Cmd+click on a Mac) to add more, **Shift+click** to pick a run. On a phone tick **Select many** and tap each one.
3. Drag them onto a group on the left, or press **Move picked** and choose the group.

**Delete picked** deletes them all (it asks first). SVG pictures (`.svg`) still can't be deleted, renamed or moved from the panel (see [Media](07-media)).

To copy a whole folder of pictures from your computer into a group, use **File Move** and pick the group in **Picture group**.

## Picking a picture: Skynet, Mine or Both, and a group

Every picture list in a Properties dialog (Picture when on / off, Graphic, Background picture, imagePath_1 ...) has two small lists beside it:

- **Skynet pictures**, **My pictures** or **Both**. It starts at Skynet pictures, since most brewers only use those.
- A **group**: **All groups**, or one group.

Both are remembered on that computer or phone. The picture already picked is always in the list. Sound lists have the group list only (the folders in `media/sounds`). **Add new ...** still takes any path, for example `Valves/MyValve_On.png`.

## In the Process editor: Alt+P

While writing a Process, press **Alt+P** (Option+P on a Mac), or the **Picture** button above the editor. A list of pictures opens:

- Choose **Pictures** or **Sounds**, **Skynet / My pictures / Both**, a group (or **All groups**), and type in **Search** to narrow it down.
- The arrow keys move through the list; the picture is shown beside it (a sound can be played).
- **Double-click** or press **Enter** to put the path where the cursor is, in quotes: `"Images/Skynet/Pumps/Pump_Red_Rip_On.png"`. If you already typed the opening `"`, only the path (and the closing `"`) is added.
