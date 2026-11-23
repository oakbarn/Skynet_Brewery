# The Skynet Brew Timers

Skynet has three timers of its own for brew day (Skynet Rule 2.68):

| Name | What it times | Where `start` takes its time from |
|---|---|---|
| `skn_Boil_Timer` | the boil | the Recipe's boil time |
| `skn_Mash_Timer` | the mash | the Recipe's mash steps' times added up |
| `skn_Whirlpool_Timer` | the Whirlpool and chilling; the Skynet Chill Process Templates also hold each Hop Stand on it | the Recipe's Whirlpool Minutes |

With no Recipe loaded, the times come from ☰ Menu > Default settings.

## What you see

- They always **count down**.
- Each one **shows itself** at the top middle of every screen while it runs, and **hides** when it stops or reaches 0.
- It shows **hh:mm** until 5 minutes are left, then **hh:mm:ss**: 01:30, then 00:04:59.
- You set only their **Labels**: ☰ Menu > Default settings > Brew Timers. Everything else is Skynet's.

## In a Process

```
wait_boil -1
start skn_Boil_Timer
wait skn_Boil_Timer <= 00:30:00
print "30 minutes left in the boil"
wait skn_Boil_Timer <= 0
```

- `skn_Boil_Timer = 01:00:00` sets the time left before (or while) it runs. A time the Process set wins over the Recipe's.
- `start`, `stop` and `reset` work on it. After `reset`, the next `start` takes the Recipe's time again.
- `skn_Boil_Timer.running` is true while it counts down (read only). There are no other attributes.

## Hop alerts

The hop alerts run on the Boil Timer: `start_hop_alerts` with no timer named follows `skn_Boil_Timer` while it runs, so a
paused boil pauses the hop alerts too (see [Recipe Tab](99-recipe-tab)).
