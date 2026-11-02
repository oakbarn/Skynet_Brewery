# Background pictures (.backpath, .backpath_2, .backpath_3)

Every item on a tab (a Device or a Widget) can show a background picture. It has three background picture paths, and **.background** picks which one shows (Fritz, 2026-11-02):

| Attribute | In Properties | What it holds |
|---|---|---|
| **.backpath** | Image Path 1 | Background picture 1. `.background = 1` shows it. |
| **.backpath_2** | Image Path 2 | Background picture 2. `.background = 2` shows it. |
| **.backpath_3** | Image Path 3 | Background picture 3. `.background = 3` shows it. |
| **.background** | Background # | Which one shows. |

## What .background does

| .background | What shows |
|---|---|
| **1** | .backpath |
| **2** | .backpath_2 |
| **3** | .backpath_3 |
| **0** | No background |
| **4 or more** | No background |
| **blank** | It is set to **0**: no background |

Double-click an item in **Edit layout** (or hold a finger on it) to see these fields. A picture path is a file in one of your media folders, for example `Images/Skynet/Pumps/Pump_Red_Rip_On.svg` (see [Media](07-media)).

## In a Process

```
my_Widget.backpath = "Images/Skynet/Pumps/Pump_Red_Rip_On.svg"
my_Widget.backpath_2 = "Images/Skynet/Pumps/Pump_Blue_Rip_On.svg"
my_Widget.backpath_3 = "Images/Skynet/Pumps/Pump_Green_Rip_On.svg"
my_Widget.background = 2
```

Setting a path does not change **.background**; the last line picks which picture shows.

**The Skynet shortcut:** `my_Widget.image = "Images/RedPump.svg"` puts the path in **.backpath** and sets **.background = 1**, so the new picture shows at once. Any Device or Widget can have as many pictures as you like this way.

A color name or code in **.background** (`my_Widget.background = "red"`) shows no picture; it colors the item. **Back Colour** in the Properties is the color behind the picture.

## The old names are gone

**.imagePath_1**, **.imagePath_2** and **.imagePath_3** are now **.backpath**, **.backpath_2** and **.backpath_3** (Skynet Rule 15.2: nothing old is kept). When the panel starts, every Schema and every Process is changed to the new names by itself, and a Process is backed up first. An older item that had a picture and a blank background gets **.background = 1**, so it still shows its picture. A BruControl import comes in with the new names too.

The first time you change Image Path 2 or 3 in the Properties, a **heads-up** pops up: in Skynet one picture path is enough, because `.image` can give any Device or Widget as many pictures as you like. Tick **Do not show this again** to stop it.

> Every item has **at most 3** background pictures. An older item with a 4th picture or more (from stacked BruControl copies) keeps only the first 3; `.background = 4` or more shows no background.
