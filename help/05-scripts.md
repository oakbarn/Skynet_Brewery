# Scripts

Scripts are the automatic steps of a brew: open valves, run a pump, wait for a temperature, start a timer, sound an alarm. They are text files in the `scripts` folder on the Pi and work like BruControl scripts.

## The Scripts screen

- The list on the left shows every script; a running one is marked.
- **New**, **Rename**, **Delete** (admins).
- **Save** and **Check** (admins). Check finds mistakes without starting the script.
- **Start** and **Stop** (operators and admins). **Stop all** stops every script.
- **Output** shows what scripts print. Tick **all scripts** to see every script's output.

**A script with a mistake does not start.** The mistakes are listed with their line numbers; click one to jump to it.

The saved file is read every time a script starts, so it never runs an old copy. If you edit a running script, it is marked "edited since start": stop and start it to use the new version.

## Script lines you will use most

```
new value vVCount              make a number variable
vVCount = 3                    set it
"V_BK_In" state = true         open a valve (turn an output on)
"gblS_Msg" value = "Mash in"   set a variable
"tm_Whirlpool" value = 00:20:00
start "tm_Whirlpool"           start a timer
wait "BK_Temp" value <= 154    wait for a temperature
sleep 1000                     wait 1 second (1000 ms)
if vVCount > 2 && "Pump_Red" state == true
elseif ...
else
endif
[Label]  and  goto "Label"     jump
start "Other_Script"           start another script
print "text"                   write to Output
show tab "Brewery"             switch every screen to a tab
log "gblV_Kettle_Temp"         write a value to the database now
// a comment
```

## Differences from BruControl

- Labels and gotos can be anywhere, even inside if/endif.
- Starting a script that is already running does nothing (it prints a note).
- Readings from hardware (inputs, probes) cannot be set by scripts.

## Sample scripts

`Demo_Transfer_HLT_to_MLT`, `Demo_Hop_Stand`, `Demo_Heat_HLT`, `Hops_Order_Boil`, `looper_LogTemps` and `Demo_Variables` show how things are done. Open one and press Start to watch it work on the simulator.
