# Time and DateTime formats: pick how a time shows

A Time Widget, a DateTime Widget and a Timer can each show their time in the way you like (Skynet Rule 2.45). Only the look
changes: a Process still reads the same value.

## Pick one

- **Time Widget or DateTime Widget:** in Edit layout, double-click it and pick **Shows as**.
- **Timer:** double-click it and pick **Digits**.

| Time formats | 1 hour 30 minutes 5 seconds shows as |
|---|---|
| hh:mm:ss (the standard look) | 01:30:05 |
| hh:mm | 01:30 |
| h:mm:ss | 1:30:05 |
| mm:ss, all minutes | 90:05 |
| Minutes only | 90 |
| Seconds only | 5405 |
| Days too | 0.01:30:05 |

| DateTime formats | Monday, November 9, 2026 at 2:30 in the afternoon shows as |
|---|---|
| mm/dd/yyyy hh:mm:ss (the standard look) | 11/09/2026 14:30:00 |
| With AM / PM | 11/09/2026 2:30:00 PM |
| Date only | 11/09/2026 |
| Short month | Nov 9, 2026 |
| Long date | Monday, November 9, 2026 |
| Clock | 2:30 PM |
| 24-hour clock | 14:30 |
| Day and clock | Mon 2:30 PM |
| Year first | 2026-11-09 14:30:00 |

## Any format you like, from a Process

A Process can set any format with **`.showas`**, using these letters:

| Letters | Time | DateTime |
|---|---|---|
| `d` | days | day of the month (`dd` = 09, `ddd` = Mon, `dddd` = Monday) |
| `h` `hh` | hours | hours 1 to 12 (`HH` = 0 to 23) |
| `m` `mm` | minutes | minutes |
| `s` `ss` | seconds | seconds |
| `M` `MM` `MMM` `MMMM` | | month (11, 11, Nov, November) |
| `yy` `yyyy` | | year (26, 2026) |
| `tt` | | AM or PM |

For a Time, the biggest unit in the format holds the whole time, so `mm:ss` shows 1 hour 30 minutes as 90:00. Put words in
'single quotes' to show them as typed.

```
wgt_TM_Boil_BH.showas = "mm:ss"
tm_Boil.showas = "mm' min'"          shows 45 min
wgt_DT_Clock_BH.showas = "ddd h:mm tt"
wgt_TM_Boil_BH.showas = ""           back to its Properties' pick
```

See also [Value, Time and DateTime Widgets](134-value-time-and-datetime-widgets) and [Timer digits](152-skynet-dial-and-timer-digits).
