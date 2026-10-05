# Restarting Processes

A restart **stops a Process, clears it from memory and starts it again** from the top of its saved file. Its own variables (the ones made with `new`) start from scratch and it forgets which line it was on. Devices, Widgets, timers and vKonstants keep their values.

In BruControl a thread could get corrupted and needed a restart, which is why old BruControl Processes have so many `start` lines. The Brew Panel does not corrupt Processes like that, but a Process can still stop on an error, for example a sensor that drops out. A restart cures that.

There are three ways to restart.

## 1. The Restart button

On the **Processes** screen, pick the Process and press **Restart** (operators and admins). If it was not running, it just starts. If you changed it, it is saved first, so it runs the new version.

## 2. The restart command

```
restart Looper_Temps     stop Looper_Temps, clear it and start it again
restart                  start this Process over from the top
```

The line after `restart Looper_Temps` runs once Looper_Temps has stopped and started again. `restart` on its own ends this Process and starts it again straight away.

To keep a Process going round and round, use a `[Label]` and `goto`, not `restart`. Restart is for getting out of trouble.

## 3. Restart if it fails

On the **Processes** screen, turn on **Restart if it fails** (admins) for a Process. If that Process stops on an error, the panel waits 2 seconds and starts it again by itself. The error is still written to **Output**.

It does **not** restart when someone presses **Stop** or **Stop all**, when the Process gets to its end, or when it has a mistake that stops it from starting at all. Pressing **Stop** during the 2 seconds cancels the restart.

## No endless loops

A broken Process could restart forever, so restarts are counted. When one Process has been restarted **5 times in one minute** by the `restart` command or by **Restart if it fails**, the panel does not start it again:

- the Process stays stopped and shows why in red on the Processes screen,
- a red message pops up on every screen until it is closed,
- the alarm you picked in Settings sounds.

Fix the problem, then start the Process by hand. Starting it or pressing Restart yourself is never counted and begins a new count.

Change the number, and pick the alarm, in **Settings > Panel settings**:

- **Most restarts a minute for one Process** (1 to 60, 5 unless you change it)
- **Alarm to sound when a Process is stopped for restarting too often** (any Alarm Widget, or None)
