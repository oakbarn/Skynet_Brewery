# Flame Out safety for gas burners

> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.** (Rule 6.20)

A gas burner can go out while the gas keeps flowing: a gust of wind, a boil over, or a low tank. Unburned gas then pours out,
which can catch fire or explode. The **Flame Out safety** is Skynet keeping an eye on the pot for you (Skynet Rule 6.33).

A lit burner makes the pot get hotter. So while the burner's gas valve is open, Skynet watches the temperature of the pot. If
the temperature **falls**, or **does not rise** after some minutes of burning, the flame is probably out. Skynet then:

1. **shuts the gas** (and turns the burner's igniter Off),
2. shows **"Burner may be out: check the flame. Gas is turned off."** in red on every screen, beeping until someone closes it,
3. turns **nothing back on by itself**. Check the flame, light it, then turn the burner back On with one click.

**Skynet does not see the flame.** The Flame Out safety is a helper, not a flame safety device. It can take minutes to notice a
flame out. Use a burner with its own flame safety (a UL or CSA listed thermocouple gas valve, or a flame sensor). Never brew with
gas indoors without fresh air, and never leave a lit burner alone.

## Which burners have it

- A **Heating Element** with **Gas burner** switched On in its Properties (a burner on a gas valve). The Schema Builder's gas
  burners have it On.
- A **Solenoid Gas Valve** (Device Type DO@Valve_Sgas). Pick its **Temperature Probe** in its Properties, so it knows what to watch.

## Its Properties

Under **Flame Out safety**:

| Box | What it does | Starts at |
|---|---|---|
| **Flame safety** | What shuts the gas by itself if the flame goes out: **Thermocouple gas valve (UL or CSA listed)** or **None (plain solenoid valve)**. You pick it; Skynet cannot check it. | None |
| **Flame Out** | **On** watches this burner while its gas is on. | On |
| **Igniter** | The burner's igniter, turned Off with the gas. | None |
| **No rise (minutes)** | Minutes of burning in which the temperature must go up by the Rise. | 5 |
| **Rise** | How much it must go up. | 1 °F (0.5 °C) |
| **Drop** | Once the pot is warming, falling this much below its highest shuts the gas. | 1 °F (0.5 °C) |
| **Pause (minutes)** | How long the Pause button stops the watch. | 10 |
| **Smoothing (seconds)** | The reading is averaged over this many seconds. | 30 |
| **Boil point** | Within 3 °F of it the No rise test rests, because a rolling boil stops rising. Water boils about 1 °F lower for every 500 ft above sea level: 212 °F at sea level, 202 °F at 5,000 ft. | 212 °F (100 °C) |

With **Thermocouple gas valve** picked, the valve itself is the flame safety, and Skynet's Flame Out is its backup. The Flame
Out stays On either way (OakBarn Brewery, 2026-11-14: "Also in Skynet have the software backup of decreasing Temp").

## Pause it

Opening the lid, adding cold water or doughing in makes the temperature fall with the flame still lit. Click the burner's box
(or a method spot) to open its pop-up and press **⏸ Pause Flame Out (10 min)**. It watches again by itself after 10 minutes, and
**▶ Watch now** ends the pause early.

## The thermocouple gas valve (the real flame safety)

A small **pilot flame** heats a **thermocouple**, which makes a tiny voltage (about 0 to 30 millivolts). While it is hot, the valve
lets gas through. If the pilot goes out, the valve shuts **all** the gas by itself, with no help from Skynet. Skynet only turns
the **main burner** On and Off through the valve's 24 V input. If the main flame goes out while the pilot is lit, the pilot lights
it again. For propane, buy the LP (propane) model, or fit the maker's LP conversion kit.

**Gas pressure matters.** These standing pilot valves (for example the Honeywell / Resideo VR8200, White-Rodgers 36C or Robertshaw
7000) are made for **low-pressure** gas, like a home furnace or water heater: propane at about 11 inches of water column. Most
brewing burners use a **high-pressure** regulator (several psi), and a valve made for low pressure must not be put on it. The
valve, the regulator and the burner must be matched. Have a licensed gas professional choose and fit them.

Most home brewing burners run on **high-pressure** propane (OakBarn Brewery, 2026-11-14: "Unforunately high pressure propane is more
standard for a Home Brewer"). Three ways to set it up:

| Way | Flame safety | Cost | In Skynet pick |
|---|---|---|---|
| **1. High pressure + a 24 V gas solenoid only** | **None.** Only Skynet's Flame Out, which is slow: gas can flow for minutes before it trips. Stay with the burner. | Lowest | **None (plain solenoid valve)** |
| **2. Change to low pressure + a 24 VAC VR8200 type valve** (a low-pressure regulator, about 11 inches of water column, and the right orifices) | **Real**: the valve shuts the gas by itself. **The best safety for the money.** It heats more slowly. | Low | **Thermocouple gas valve (UL or CSA listed)** |
| **3. High pressure + a high-pressure thermocouple safety pilot valve (for example BASO H19) + a 24 V gas solenoid** | **Real**, at full heat. | High | **Thermocouple gas valve (UL or CSA listed)** |

Check each part's data sheet for its pressure, and have a licensed gas professional choose and fit them.

**Recommended: the UL or CSA listed way** (way 2 or 3), where a listed device shuts the gas by itself.

The board's pin cannot switch the valve by itself. Two ways (OakBarn Brewery, 2026-11-14: "24 vdc preferred but 24 vac ... is ok as well"):

- **24 VDC (preferred):** only for a valve whose label says **24 VDC** (most say 24 VAC, and a 24 VAC valve on DC may not open or may
  burn out). A 24 VDC power supply and a relay on a Digital Out.
- **24 VAC:** for the common 24 VAC valves. A **true 24 VAC step-down transformer** and a relay rated for AC on a Digital Out. The
  valve's amps (on its label) times 24 must be less than the transformer's VA. A 40 VA one always covers it.

Either way, in Skynet the burner is on that Digital Out, the same as any other.

## For Information Only: a high-pressure daisy chain some home brewers build

> **⚠ BIG CAVEAT. For Information Only. This is NOT a listed flame safety and it is NOT recommended. It is only one way some home
> brewers do it with high-pressure propane. Use a UL or CSA listed flame safety instead (way 2 or 3 above).**
>
> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.**

What some home brewers build:

**K-type thermocouple in the flame → a stand-alone temperature controller (K-type input, relay output) → its relay → the brew
controller's relay → a 24 V gas solenoid listed for high-pressure propane.**

- The controller holds its relay closed only while the thermocouple is hot. If the flame goes out, it cools, the relay opens and the
  solenoid shuts the gas.
- The two relays are in a row (in series), so both must say "go" before gas flows, and losing power shuts the gas.
- A cold thermocouple holds the gas shut, so they add a **timed ignition bypass**: a relay across the controller's relay, closed only
  for a short lighting window (10 seconds to start; it depends on the thermocouple). If the flame is not proven by then (the
  controller's second contact wired to a Digital In), the gas shuts. At most 3 tries, at least 1 minute apart so unburned gas can clear.
- In the Flame safety list it is **Flame-out cutoff (K-type thermocouple and controller, not listed)**, and the Flame Out stays On as a backup.

The ignition bypass in Process words (For Information Only; change the names to yours):

```
//Gas_Ignition_Bypass
//FOR INFORMATION ONLY. Not a listed flame safety. Not recommended: use a UL or CSA listed flame safety.
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//Never leave a lit burner alone.
new value vV_Try
new value vV_Window
vV_Window = 10
vV_Try = 0
[Light]
vV_Try += 1
Kettle_burner = on
Kettle_spark = true
Kettle_bypass = true
sleep vV_Window * 1000
Kettle_bypass = false
Kettle_spark = false
sleep 1000
if Kettle_flame == true
	print "Flame proven: the cutoff holds the gas on"
	stop "Gas_Ignition_Bypass"
endif
Kettle_burner = off
alm_Flame_Out = true
print "No flame in the lighting window: gas turned off"
if vV_Try >= 3
	print "3 tries: check the burner before lighting again"
	stop "Gas_Ignition_Bypass"
endif
sleep 60000
ask "No flame. The gas has had 1 minute to clear. Press Done to try again"
alm_Flame_Out = false
goto "Light"
```

## Process words

```
Kettle_burner.flameout = On             watch it (Off: do not)
Kettle_burner.flameout = "pause 10"     rest the watch 10 minutes; it watches again by itself
Kettle_burner.flameout_paused = 0       end the pause now (it reads the minutes left)
Kettle_burner.flameout_tripped          true after Flame Out shut the gas, until the burner is turned back On
```

## Process snippet: gas burner control

Copy it into a new Process and change the names to yours. It asks for the pilot, lights the burner, pauses the watch while you
dough in, and sounds your own Alarm if Flame Out shuts the gas.

```
//Gas_Burner_Control
//MIT License Granted for all Scripts and Configurations
//Copyright © OakBarn Brewery 2026
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//Skynet's Flame Out is a backup, not a flame safety device. Use a UL or CSA listed thermocouple gas valve.
Kettle_burner.flameout = On
ask "Is the Kettle burner's pilot lit?"
Kettle_burner = on
wait Kettle_temp >= 152
Kettle_burner.flameout = "pause 10"
ask "Dough in, then press Done"
Kettle_burner.flameout_paused = 0
[WatchFlame]
sleep 1000
if Kettle_burner.flameout_tripped == true
	alm_Flame_Out = true
	print "Flame Out shut the gas: check the flame"
	stop "Gas_Burner_Control"
endif
goto "WatchFlame"
```

## Process snippet: the software backup, in Process words

Skynet already does this for every gas burner with Flame Out On. This snippet shows the same idea in Process words, so you can
see how it works or watch something Skynet does not know is gas. Every 5 seconds it reads the probe, throws away a wild reading
(more than 5 °F from the average), averages 6 readings (30 seconds), and shuts the gas if the average falls 1 °F below its highest
while the gas is on.

```
//Gas_Software_Backup
//MIT License Granted for all Scripts and Configurations
//Copyright © OakBarn Brewery 2026
//⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.
//A backup only: it does not see the flame.
new value vV_Sum
new value vV_N
new value vV_Avg
new value vV_Peak
vV_Avg = 0
vV_Peak = 0
[Average]
vV_Sum = 0
vV_N = 0
[Read]
sleep 5000
if vV_Avg > 0 && (Kettle_temp > vV_Avg + 5 || Kettle_temp < vV_Avg - 5)
	goto "Read"
endif
vV_Sum += Kettle_temp
vV_N += 1
if vV_N < 6
	goto "Read"
endif
vV_Avg = vV_Sum / 6
if Kettle_burner == false
	vV_Peak = 0
	goto "Average"
endif
if vV_Avg > vV_Peak
	vV_Peak = vV_Avg
endif
if vV_Avg <= vV_Peak - 1
	Kettle_burner = off
	alm_Flame_Out = true
	print "The temperature fell 1 °F with the gas on: gas turned off"
	stop "Gas_Software_Backup"
endif
goto "Average"
```

### The technical side

- The Brain looks about once a second. Burning time counts only while the gas valve is **really open**: in Hysteresis or Duty
  Cycle the valve opens and closes by itself, and the closed time does not count.
- **No rise:** after the No rise minutes of burning, the smoothed reading must be the Rise above where the count started. When it
  is, the count starts again. It rests within 3 °F (1.5 °C) of the Boil point.
- **Drop:** after the valve opens, the pot may keep cooling a little (the heat is still on its way). The Drop test starts once the
  smoothed reading is 0.2 °F (0.1 °C) past its lowest, then a fall of the Drop below its highest shuts the gas.
- **Wild readings:** one more than 5 °F (2.8 °C) from both the last reading and the average, or a probe error, is thrown away.
  One that stays 10 seconds is real (the probe was moved), and the average starts again from it.
- Turning the burner Off, or a pause, starts every count again.
- After a trip, `.flameout_tripped` is true until the burner is turned back On. The notice stays on every screen until it is closed.
  Nothing is turned back on by the Brain (as Rule 6.31).
