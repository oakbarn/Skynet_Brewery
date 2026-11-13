# The Alarm attributes

What a Process can use on an **Alarm Widget** (a Basic Skynet Alarm, a User Alarm or a Pre-Hop Alarm). Write the Alarm's Name, a
dot, and the attribute: `alm_Hops.loop = true`. The Alarm's Name alone means its On / Off.

## Common to every Alarm

| Attribute | What it does |
|---|---|
| `.state` | Its On / Off. `alm_Hops = On` and `alm_Hops.state = On` are the same. |
| `.path` | Its sound file (.wav or .mp3; .mp3 is preferred). A wrong path plays no sound of its own (the Missing Alarm Sound plays instead). The sound only plays while the Alarm is On. |
| `.loop` | true: the sound plays, then repeats. false: it plays one time. |
| `.label_fore`, `.label_back` | The colors of its Label. |
| `.x`, `.y` | Its place on the Tab. |
| `.w`, `.h` | Its size (width and height). |
| `.skynet_Layer_2` | Its Layer 2 picture, above its base picture and under Layer 1 (the Active overlay): `alm_Hops.skynet_Layer_2 = "Images/Skynet/Alarms/Alarm_Set_Hop.svg"`. By its Skynet Picture number works too: `alm_Hops.skynet_Layer_2 = 6` (6 is the hop cone, Alarm_Set_Hop.svg). Also picked on its Properties dialog (Set Graphic). |
| `.priority` | Which Alarm plays first when two sound at once (see [Alarms and sound](21-alarms-and-sound)). |

Two more are set by the panel itself, never by you:

- **Visible**: an Alarm **shows while it is On and hides while it is Off**. A Process can read `alm_Hops.visible`, but not set it.
  In Edit layout a hidden Alarm shows faint, so you can still place it.
- **Toggle**: a **click on the Alarm** turns it Off (or On), which changes `.state`.

## Brew Flow and Hop Drop Alarms

A Basic Skynet Alarm (the Skynet bell). `.fore` and `.back` color the bell and the square behind it.

**A Brew Flow Alarm holds its Process.** When a Process turns it On, the Process waits on that line until the brewer taps the
Alarm Off (or another Process turns it Off), as if a hidden `wait alm_Name == false` followed. **■ Stop** and Override end the
wait, as on any wait.

## Pre-Hop Alarm

A **Combination Alarm and String Box Widget**: a text box on a Skynet watermark.

| Attribute | What it does |
|---|---|
| `.background` | Which of the **three Skynet watermarks** shows: 1, 2 or 3. The watermarks themselves can't be changed. |
| `.string` | Its text. Rich Text codes work in it. |
| `.fore`, `.back` | The colors of its text. |
| `.playtime` | How many seconds it stays On; then it turns itself Off. A click turns it Off sooner. 0 = it stays On until it is tapped. |

## User Alarm

| Attribute | What it does |
|---|---|
| `.background` | Which of **your own three pictures** shows: 1, 2 or 3 (Image Path 1 to 3, set on its Properties dialog or with `.backpath`, `.backpath_2`, `.backpath_3`). |
| `.string`, `.fore`, `.back`, `.playtime` | As on the Pre-Hop Alarm. |

## Example

```
alm_PreHop.string = "Get the Flavor Hops ready"
alm_PreHop.background = 2
alm_PreHop.playtime = 30
alm_PreHop = On               // shows, sounds, and goes Off by itself after 30 seconds
alm_Mash_Done = On            // a Brew Flow Alarm: the Process waits here until it is tapped Off
```

See also [Alarm Widget](107-alarm-widget), [Alarms and sound](21-alarms-and-sound) and [The Alarm Chain](172-alarm-chain).
