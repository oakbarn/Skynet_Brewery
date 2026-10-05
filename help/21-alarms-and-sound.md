# Alarms and sound

Only **one sound plays at a time**. When two want to play, the one with the lowest priority number wins. The other one waits, and plays by itself as soon as it is the highest one left.

| Kind | Priority | Use it for |
|---|---|---|
| **Hop Alarm** | 1 | Hop drops. Beats every other sound. |
| **Brew Flow Alarm** | 2 | Brew steps: strike, end of mash, start of boil. Waits only for a Hop Alarm. |
| **Pre-Hop Alarm** | 3 | A warning a set time before its Hop Alarm (10 minutes unless you change it). |
| **General Alarm** | 4 | Anything else. |
| **Sound only** and the **Sound Player** | 5 | Music and beeps. Pauses while any alarm sounds, then goes on where it stopped. |

Brew Flow is priority 2 because it beats a Pre-Hop Alarm. An alarm that had to wait starts from the beginning when its turn comes; music carries on where it was.

## Add one

**Tabs > Edit layout > Add element > Widgets > Alarm**, then pick its **Kind** first. The settings below it change with the kind:

- **Hop Alarm**: pick a **timer** and the **time on that timer** for the hop drop, and it sounds by itself. For a boil count-down timer, that is the time left (a 15-minute hop: `00:15:00`). Leave the timer empty to turn it on only from a Process.
- **Pre-Hop Alarm**: pick the **Hop Alarm** it goes with and **how long before** (empty = `00:10:00`).

Tap a sounding alarm on the screen to turn it off. "(waiting)" next to it means a higher alarm has the speaker.

## In a Process

An alarm is just true or false:

```
alm_Hops_1 = true            sound it
wait alm_Hops_1 == false     wait here until the brewer taps it off
if alm_Hops_1 == true
  ...
endif
alm_Hops_1 = false           turn it off
"alm_Hops_1" at = 00:20:00   move the hop drop to 20:00 left
"alm_PreHop_1" before = 00:05:00
```

`"alm_Hops_1" active = true` (the BruControl way) still works, so older Processes keep running.

## Sound Player

Every panel has one built-in **SoundPlayer** for music and plain sounds. It is not on any tab; Processes use it:

```
SoundPlayer path = "sounds/polka.mp3"
play SoundPlayer
stop SoundPlayer
```

There is no pause command: it pauses by itself while an alarm sounds and goes on afterwards. To put a Sound Player on a tab (tap it to play or stop), use **Add element > Widgets > Sound Player**.

Press **Enable sound** at the top once on each screen that should play sounds (browsers insist on that).

## Importing from BruControl

The [BruControl import](08-import) now also does this:

- Each alarm gets a kind guessed from its name: Hops and Aroma are Hop Alarms, Hop or Irish Moss **Warning** ones are Pre-Hop, Strike, Mash, Sparge, Boil and Sanitize are Brew Flow, Music, Sound, Beep and Water Flow are Sound only, the rest are General. The import report lists them; change any on the alarm's settings.
- Every `"alm_..." active = true` line becomes `alm_... = true`.
- **Stacked look-alikes are folded into one.** BruControl allows only 3 background pictures per item, so one message panel was often three copies on top of each other (`gblS_Brewery_Top_1`, `_2`, `_3`). Copies with the same name apart from the number at the end, on the same tab at the same spot, become one item (`gblS_Brewery_Top`) with all their pictures: copy 1's pictures are 1-3, copy 2's are 4-6, copy 3's are 7-9. Processes are changed to match, and "hide the other copy" lines become comments.
- **Timers are never folded**, so a long mash timer, a short delay timer and a sub-process timer can stay stacked.
- Items stacked at one spot with different names are listed in the report, not folded.
