# Processes

Processes are the automatic steps of a brew: open valves, run a pump, wait for a temperature, start a timer, sound an alarm. They are text files in the `scripts` folder on the Pi and work like BruControl processes.

## The Processes screen

- The list on the left shows every process; a running one is marked.
- **New**, **Rename**, **Delete** (admins).
- **Save** and **Check** (admins). Check finds mistakes without starting the process.
- **Start** and **Stop** (operators and admins). **Stop all** stops every process.
- **Output** shows what processes print. Tick **all processes** to see every process's output.

**A process with a mistake does not start.** The mistakes are listed with their line numbers; click one to jump to it.

The saved file is read every time a process starts, so it never runs an old copy. If you edit a running process, it is marked "edited since start": stop and start it to use the new version.

## Process lines you will use most

```
new value vVCount              make a number variable
vVCount = 3                    set it
V_BK_In = true                 open a valve (turn an output on)
gblS_Msg = "Mash in"           set a variable
tm_Whirlpool = 00:20:00        set a timer
start "tm_Whirlpool"           start a timer
alm_Hops = true                sound an alarm
wait BK_Temp <= 154            wait for a temperature
sleep 1000                     wait 1 second (1000 ms)
my_Widget.visible = false      hide something on the screen
if vVCount > 2 && Pump_Red == true
elseif ...
else
endif
[Label]  and  goto "Label"     jump
step "Mash in"                 mark a step (numbered when you save)
start "Other_Process"          start another process
print "text"                   write to Output
show tab "Brewery"             switch every screen to a tab
log "vAV_Kettle_Temp"          write a value to the database now
// a comment
```

The name alone means its main value, and other attributes use a dot. See [Process language and steps](19-process-language) for the full list, autofill, Process classes and step numbers.

## Differences from BruControl

- Labels and gotos can be anywhere, even inside if/endif.
- Starting a process that is already running does nothing (it prints a note).
- Readings from hardware (inputs, probes) cannot be set by processes.

## Sample processes

`Demo_Transfer_HLT_to_MLT`, `Demo_Hop_Stand`, `Demo_Heat_HLT`, `Hops_Order_Boil`, `looper_LogTemps` and `Demo_Variables` show how things are done. Open one and press Start to watch it work on the simulator.
