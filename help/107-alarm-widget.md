# Alarm Widget

An **Alarm Widget** sounds and shows an alarm on a Tab. It comes in **two subclasses**. You pick one when you make it, in Edit
layout with **Select Widget Type > On-screen controls** (it is made on the 🔨 Build Tab first, like every new Widget), and it
**can never be changed** to the other one:

- **Basic Skynet Alarm**: the Skynet bell picture. You pick its colors and what sits on it.
- **User Alarm**: your own pictures.

Alarms made before 2026-11-02 keep working as before.

## Basic Skynet Alarm: four layers

The Basic Skynet Alarm is drawn in layers, from the bottom up:

| Layer | What it is | Set by |
|---|---|---|
| 4 | **Back**: the square behind the bell | **Back color**, or `.back` in a Process |
| 3 | **Fore**: the bell and its clapper | **Fore color**, or `.fore` in a Process |
| 2 | **Set Graphic**: a Skynet picture on the bell (the hop cone to start) | the **Set Graphic** list; **None** (first in the list) = nothing |
| 1 | **Active overlay**: on top, blinking, while the alarm is active | the **Active overlay** list; **None** = nothing |

The bell picture itself is set by Skynet and can't be changed. It comes in three versions: **Together** (Back and Fore),
**Back only** and **Fore only**, all in `Images/Skynet/Alarms/`. The black lines of the bell are never colored.
The colors are the standard color list (Default and None first, then the named colors, then Custom).

The Set Graphic and Active overlay lists hold only Skynet pictures: the `Alarm_Set_...` and `Alarm_Active_...` pictures in
`Images/Skynet/Alarms/`. More will be added.

## User Alarm

- **Background picture (Image Path 1)**: any picture; pick it from the list or type a new path. The red hexagon **⬢** beside
  it opens the **Graphic Dialog** with Background #, Image Path 2 and 3, and the Back Colour behind the picture.
- **Set Graphic (Layer 2)**: any picture, on top of the background.
- **Active overlay (Layer 1)**: on top while the alarm is active.
- **Back color**: the color behind it all (`.back` in a Process).

## Alarm Widget Properties

The dialog follows the General Dialog Rules (Skynet Rules section 18):

- **Label** is first and **can't be blank**. **Show label** switches it on or off on the Tab. The red **⬆** opens a bigger
  box (2 lines) to type it in, and the red **⬢** opens the **Label attributes**: Label, Visible, Font size, Font, Bold, Fore
  color, Back color and Alignment.
- **Name**: a new Alarm's Name follows its Label (`alm_` + the Label) until you type a name of your own. It can't be blank.
- **Alarm**: the Kind of alarm (Brew Flow 1, Hop 2, Pre-Hop 3, General 4, Sound only 5), its timer or Hop Alarm, and the sound
  and Repeat. These work as before (see Alarms and sound).
- **Graphic**: the layers above.
- **Alarm Chain**: steps that change its colors, pictures and sound, so one Alarm does the work of many stacked ones. Every
  choice starts on **No Change**. See [The Alarm Chain](172-alarm-chain).
- **Properties**: Visible, Hidden Locked, Tab, X, Y, Width, Height and Lock.
- **COPY** saves it and makes a copy on the 🔨 Build Tab. The orange **?** lists its Properties and Attributes.
- **✖ Cancel** in the ⬆ and ⬢ pop-ups asks first when something was changed: discard the changes, or go back (Rule 18.11).

## In a Process

```
alm_Hops = On                 // sound it
alm_Hops.back = "Red"         // Layer 4 of a Basic Skynet Alarm (the color behind a User Alarm)
alm_Hops.fore = "Yellow"      // Layer 3: the bell
alm_Hops.back = ""            // back to what its Properties say
alm_Hops.step = 2             // step 2 of its Alarm Chain (or alm_Hops.step = "Aroma")
```
