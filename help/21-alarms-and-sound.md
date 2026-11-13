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

### Priority: your own order

Every Alarm has a **Priority** (Alarm Widget Properties > Alarm > Priority). It starts as its Kind's number above, and you can set
your own with **up to two decimal places**: 1, 1.1, 1.15, 2 ... **The lower one plays first.** All the 1s play before the first 2,
and 1.1 before 1.15 before 1.2, so you can put an Alarm in between two others without renumbering them.

- **The same Priority:** the one that went On first plays first, so a playing Alarm is never cut off by one of the same Priority.
- **Two at the same moment** (within a second) with the same Priority: one is **picked at random**, then the other follows.
- **A sound that doesn't Repeat** lets the next one play as soon as it has played to its end, even while its Alarm still shows On.
- **Alarm Chain steps wait their turn**: see [The Alarm Chain](172-alarm-chain).
- A Process can change it: `alm_Brew.priority = 1.15` (`alm_Brew.priority = ""` puts back its Properties' number).

## Add one

**Tabs > ☰ Menu > Edit layout > Add Widget > On-screen controls > Alarm**, then pick its **Kind** first. The settings below it change with the kind:

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

`alm_Hops_1 = On` and `alm_Hops_1 = Off` work the same as true and false (Rule 16.9). A Process never writes `.active`. One Alarm can change its look and sound step by step: see [The Alarm Chain](172-alarm-chain).

**A Brew Flow Alarm holds its Process:** turning a Brew Flow Alarm Widget On in a Process (`alm_Mash_Done = On`) waits on that line until the brewer taps it Off, as if `wait alm_Mash_Done == false` followed it. Every attribute an Alarm has (`.path`, `.string`, `.playtime` ...) is in [The Alarm attributes](195-alarm-attributes).

## Sound Player

Every panel has one built-in **SoundPlayer** for music and plain sounds. It is not on any tab; Processes use it:

```
SoundPlayer path = "sounds/polka.mp3"
play SoundPlayer
stop SoundPlayer
```

A sound can also be a **web link to an MP3** (`https://...`), played straight from the web: see [Sounds from a web link](186-sounds-from-a-web-link).

There is no pause command: it pauses by itself while an alarm sounds and goes on afterwards. To put a Sound Player on a tab (tap it to play or stop), use **Add Widget > On-screen controls > Sound Player**.

Press **Enable sound** at the top once on each screen that should play sounds (browsers insist on that). To have sound on every time the panel opens, turn on **Turn Sound On when starting** on **☰ Menu > Default** (see [The Menu](33-menu)); you still tap or click the page once before the first sound, because browsers insist on that too.
