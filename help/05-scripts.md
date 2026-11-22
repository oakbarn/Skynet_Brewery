# Processes

Processes are the automatic steps of a brew: open valves, run a pump, wait for a temperature, start a timer, sound an alarm. They are text files in the `processes` folder on the Pi.

## The Processes screen

- The list on the left shows every process; a running one is marked. The small number in front of each one is its **Order**: type a new number to move it, and the others renumber themselves. See [Process Order](38-process-order).
- **New**, **Rename**, **Delete** (admins).
- **Save** and **Check** (admins). Check finds mistakes without starting the process.
- **Start**, **Stop** and **Restart** (operators and admins). **Stop all** stops every process. Restart stops the process, clears its memory and starts it again from the top.
- **Restart if it fails** (admins): start the process again by itself if it stops on an error. See *Restarting Processes*.
- **Output** shows what processes print. Tick **all processes** to see every process's output.

**A process with a mistake does not start.** The mistakes are listed with their line numbers; click one to jump to it.

The saved file is read every time a process starts, so it never runs an old copy. If you edit a running process, it is marked "edited since start": stop and start it (or press Restart) to use the new version.

## Process lines you will use most

```
new value vVCount              make a number variable
vVCount = 3                    set it
new value vVHops = 10          make one and set it on one line
new gV gV_Strike = 163         make a gGlobal (every Process can use it, Help 145)
V_BK_In = true                 open a valve (turn an output on)
gblS_Msg = "Mash in"           set a variable
tm_Whirlpool = 00:20:00        set a timer
start "tm_Whirlpool"           start a timer
alm_Hops = true                sound an alarm
wait BK_Temp <= 154            wait for a temperature (in your Units)
sleep 1000                     wait 1 second (1000 ms)
delay 7                        wait 7 seconds (the same as sleep 7000)
my_Widget.visible = false      hide something on the screen
if vVCount > 2 && Pump_Red == true
elseif ...
else
endif
[Label]  and  goto "Label"     jump
step "Mash in"                 mark a step (numbered when you save)
start "Other_Process"          start another process
restart Other_Process          stop it, clear its memory, start it again
restart                        start this process over from the top
print "text"                   write to Output
show tab "Brewery"             switch every screen to a tab
send_db "gGV_Kettle_Temp"      send a reading to the database now
send_db_group Readings        send every item of the Group Readings to the database now, once
start_db_group Mash           the items in the Group Mash are sent by their own setting from now on
stop_db_group Mash            ... until this line (see Database and .API)
// a comment
```

The name alone means its main value, and other attributes use a dot. See [Process language and steps](22-process-language) for the full list, autofill, Process classes and step numbers.

## Labels

Every Device and Widget has a **label**: the name shown on the tab (empty = its Name). A process can change it on any kind of Device or Widget, including String, Value and Graphic gGlobals, timers, alarms and outputs:

```
tm_Delay_W1.label = "1 Minute Delay"
gGS_Brewery_Top.label = "Mash"
```

## Temperatures in a Process

Type a temperature in your **Settings > Units**: `152` is 152 °F in US and 152 °C in Metric (Skynet Rule 2.59). When you save, Skynet
keeps it in °C with its sign (`66.6667°C`), so the Process means the same if Units is switched later, and when you open the Process it
shows `152` again (or `66.67` in Metric).

```
HLT_Element.setpoint = 152       152 in your Units
HLT_Element.onoffset = -1        an Offset is a difference: -1 °F is -0.56 °C (no 32)
HLT_Element.setpoint += 2        so is a step up or down
wait HLT_Temp >= 150             wait until the HLT reaches 150
HLT_Element.setpoint = 66.7°C    a number with its own sign is always that
```

Only a plain number set on, or compared with, a temperature is turned. A number in a formula with a temperature
(`HLT_Element.setpoint = Strike + 2`) is kept as typed, in °C, and the save gives one warning: give it its sign (`2°F`) or work it out
on its own line. A setpoint hotter than boiling in °C gets one warning too. A probe kept in °F (an older Schema) works the same way.

## Files that are not on the Brain

When you save a process with a new file path that is not on the Brain (the Raspberry Pi), a warning pops up. That happens for a Windows path such as `C:\Brewing\Sounds\Hops.wav`, a path outside the media folders, or a file that is not in a media folder yet. Phones and other computers cannot reach those files. Put the file in a media folder with the [Media](07-media) screen and use its path there, for example `sounds/Hops.wav`.

Tick **Do not show this warning again** to stop the warnings. Turn them back on in **☰ Menu > Default settings**.

## Good to know

- Labels and gotos can be anywhere, even inside if/endif.
- Starting a process that is already running does nothing (it prints a note).
- Readings from hardware (inputs, probes) cannot be set by processes.

## Sample processes

The **Three vessels, one pump** sample comes with `BrewDay_Flow` (a whole guided brew day), `BrewDay_Stop` (everything off) and `looper_Advance_Switch`. Its **Water** Tab has the Fire Hose and Manifold Processes ([Fire Hose and Manifold Sample](239-fire-hose-and-manifold-sample)). Open one to see how things are done, and press Start to watch it work on the simulator. The Process Templates (☰ Menu > Brew Process) show more.
