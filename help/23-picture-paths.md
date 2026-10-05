# Pictures on items (imagePath_1 to 3)

Every item on a tab (a Device or a Widget) can show a picture. It has three picture paths, the same three that BruControl had:

| Field | What it holds |
|---|---|
| **imagePath_1** | The main picture. This is the one you change, in the properties dialog or from a Process. |
| **imagePath_2** | A second picture (BruControl's background 2). |
| **imagePath_3** | A third picture (BruControl's background 3). |
| **Background picture** | Which one shows: **1**, **2** or **3**. **None** shows no picture. |

Double-click an item in **Edit layout** (or hold a finger on it) to see these fields. A picture path is a file in one of your media folders, for example `Images/Pump_Red_Rip_On.png` (see [Media](07-media)).

## Changing the picture from a Process: the Skynet way

Use one picture, imagePath_1, and change its path:

```
my_widget.image = "Images/RedPump.png"
```

That puts the new path in **imagePath_1** and sets **background = 1** by itself, so the new picture shows at once. You can also write `my_widget.imagePath_1 = "Images/RedPump.png"`; that changes the path but leaves the background number as it is.

A Process can only change imagePath_1. Trying to change imagePath_2 or imagePath_3 stops the Process with a message that says to use `.image`.

## The BruControl way still works

```
my_widget.background = 1
my_widget.background = 2
my_widget.background = 3
my_widget.background = 4
```

1, 2 or 3 shows imagePath_1, imagePath_2 or imagePath_3. Any other whole number (4, 0, 99 ...) shows **no picture**, just as in BruControl. The old spelling `"my_widget" background = 2` works too.

A number in **background** only ever picks a picture. A color name or code (`my_widget.background = "red"`) colors the item when it shows no picture.

## After a BruControl import: imagePath_2 and imagePath_3 are locked

When a BruControl configuration is imported, each item keeps its three BruControl pictures so your imported Processes that say `background = 2` or `background = 3` still show the right picture. On those items **imagePath_2** and **imagePath_3** are locked (🔒) and can no longer be changed. Clicking one opens a short note that explains the Skynet way above.

imagePath_1 stays open: change it in the properties dialog, or from a Process with `.image`.

> Items that were made from several stacked BruControl copies (see [Alarms and sound](21-alarms-and-sound)) can have more than three paths: imagePath_4, imagePath_5 and so on, for the pictures of the second and third copy. Their Processes were changed to the right numbers during the import.
