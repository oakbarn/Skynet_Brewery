# The Alarm Chain: one Alarm, many steps

In BruControl you often had to **stack** several alarms on top of each other, one for each picture and sound. In Skynet **one
Alarm can do all of it**: its **Alarm Chain** is a list of **steps**, and each step changes how the Alarm looks and sounds.

## Add steps

1. In Edit layout, double-click the Alarm Widget to open its **Alarm Widget Properties**.
2. In the **Alarm Chain** box, pick how many **Steps** it has (up to 20).
3. Type a **name** for each step (Strike, Mash, Boil ...). The red **⬢** beside it opens that step's choices.

## A step's choices

Every choice starts on **No Change**. No Change **skips that adjustment**: the Alarm keeps what it already has.

| Choice | What it changes |
|---|---|
| **Fore color** | Layer 3, the bell (a User Alarm: its text) |
| **Back color** | Layer 4, behind the bell (a User Alarm: behind its pictures) |
| **Set Graphic** | Layer 2, the picture on the bell. **None** takes it off |
| **Active overlay** | Layer 1, on top while the alarm sounds. **None** takes it off |
| **Sound file** | the sound it plays |
| **Background picture** | a User Alarm only: its own picture (Image Path 1) |
| **At this time on the timer** | a Hop Alarm only: see below |

The colors are the standard color list (No Change, Default, None, the named colors, Custom).

## In a Process

```
alm_Brew.step = 2           go to step 2 (its look and sound)
alm_Brew.step = "Strike"    the same, by the step's name
alm_Brew = On               sound it (alm_Brew = true works too)
wait alm_Brew == Off        wait until the brewer taps it off
alm_Brew.step = 0           back to what its Properties say
alm_Brew.setgraphic = "Images/Skynet/Alarms/Alarm_Set_Hop.svg"
```

## A Timer's Alarm Chain

A **Hop Alarm** has a timer. Give a step a **time on that timer** (hh:mm:ss) and when the timer gets there, the Alarm goes to that
step **and sounds**, once. One Hop Alarm can now call every hop drop of the boil, each with its own picture and sound.

**A step waits its turn.** If a step comes due while the Alarm is still sounding the last one, it waits, and the Alarm shows
"+1 step waiting". As soon as the last one is tapped off, the Alarm moves on to the waiting step and sounds. (A Process's
`.step` still changes it at once.) When several Alarms sound together, their **Priority** sets the order: see
[Alarms and sound](21-alarms-and-sound).

The steps are kept **in the order they go On**: on a count-down timer the one with the most time left comes first. When you
add a new step, it is put into its place as soon as you save. Steps with no time stay after them, in your order.

**From BruControl:** a BruControl Timer had 2 alarms. The import joins each one that was on to its Alarm: the Alarm becomes a
Hop Alarm on that Timer, the first time is the Alarm's own time, and a second time becomes a step on its Alarm Chain. In Skynet
you can then add more steps (up to 20). The import notes list each one it joined.

## On, Off, true and false

Anything that is true or false can be written either way: `alm_Brew = On` is the same as `alm_Brew = true`. The old BruControl
`"alm_Brew" active = true` (and `alm_Brew.active = true`) still works, but **only so older Processes keep running**: use the new
style in new ones. When the BruControl Import turns a Script into a Process it offers to write `alm_Brew = true`, `alm_Brew = On`,
or keep the old `.active`, and strongly suggests one of the new styles.

See also [The Alarm Widget](107-alarm-widget) and [Alarms and sound](21-alarms-and-sound).
