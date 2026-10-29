# Image block

Every Device or Widget dialog that has pictures shows them the same way (Fritz, 2026-10-29):

| Field | What it does |
|---|---|
| **Background #** | **1**, **2** or **3** shows Image Path 1, 2 or 3. Any other number shows no picture. Empty = 1. A Process: `name.background = 2` |
| **Back Colour** | A color behind the picture (and where there is no picture). Default first, None (see-through) second, then the color names and Custom |
| **Image Path 1, 2, 3** | **OPEN** picks a picture, or type a path in the box |

## OPEN

**OPEN** beside an Image Path opens the **Background Image N** pop-up:

- **Image Path N**: show the **Skynet pictures**, **My pictures** or both, pick a **group** (Pumps, Valves ...), or press **🖼** to pick from icons.
- **Image**: the picture. **Add new ...** takes a picture name in media/Images.
- **💾 Save** puts the path in the box; **✖ Cancel** changes nothing.

## Typing a path

You can type a path straight into the box (for example `Images/Skynet/Pumps/Pump_Red_Rip_Off.svg`). A path the panel can't find shows **⚠ Not found: it shows blank**, and the item shows no picture for that number.

Image Path 2 and 3 work as in BruControl. Changing one shows a heads-up once: any Device or Widget can have as many pictures as you like with `name.image = "path"` (see [Picture paths](25-picture-paths)).
