# Boil Temperature from the Air Pressure

Water boils cooler when the air pressure is low: high up a mountain, or when a storm is coming. At sea level water boils at
212 °F (100 °C); a mile up it boils near 202 °F (95 °C). So a Process that waits for 212 °F could wait forever.

Skynet reads your airport's weather report (its METAR) every 30 minutes, takes the pressure up or down to your brewery's
height, and works out the temperature water boils at **here and now**. Your Processes use it as `skn_Boil_Temp`. Use it to
tell when the boil has started.

## Set it up

Open **☰ Menu > Default settings > Boil temperature (air pressure)** (Admins).

| Box | What to put in |
|---|---|
| **Airport (ICAO)** | Your airport's 4 letter ICAO code, for example `KORD`. This is the only way to pick the weather station. |
| **Elevation** | Your brewery's height above sea level (feet for US Units, metres for Metric). It starts as the airport's own height. Change it to your own. |
| **Typed air pressure** | Not a default, so it has no box here: it is to be asked on Brew Day (the Brew Day interview, not built yet). A pressure typed before is kept and used as it is, with no internet. Skipped: the airport's report, or a standard day at your Elevation. |

Press **Test**. Skynet fetches the report now and shows the airport, the air pressure and the boil temperature. **Save**
keeps the boxes.

It works only with a correct ICAO airport code and an internet connection. If it does not work, the effect is very small:
Skynet uses the typed pressure, or standard air at your Elevation, and shows one warning.

## How to find your airport's ICAO code

The ICAO code is the 4 letter airport code pilots use. It is not the 3 letter code on a luggage tag, but it is often close:

- **USA:** most are **K** plus the 3 letter code. Chicago O'Hare (ORD) = `KORD`, Milwaukee (MKE) = `KMKE`.
- **Canada:** **C** plus 3 letters. Toronto Pearson (YYZ) = `CYYZ`.
- **Anywhere else:** search the internet for **ICAO code** and the airport's name, for example *ICAO code Munich airport*
  (`EDDM`).

Pick the nearest airport that has a weather report. Most larger airports have one; many small airfields do not. If **Test**
says *Check your Airport code in Skynet Settings*, try the next nearest airport.

## How to find your Elevation

Your Elevation is how high your brewery is above sea level. The airport's height is filled in to start, but your brewery
can sit well above or below the airport. Every 30 feet (10 metres) is about 1 hPa of air pressure.

Stand in the brewery and read it:

- **iPhone:** open the **Compass** app. The elevation shows at the bottom of the screen, under your position. Location
  Services must be on for Compass.
- **Android:** most phones have no built-in elevation. A free GPS app, such as **GPS Status**, shows it as *altitude*.
- **Google Earth:** drop a pin on your brewery. The elevation shows at the bottom of the screen. Works on a phone or a
  computer.
- **An internet search:** search for **elevation** and your town or address.

A phone's GPS elevation can be off by 30 to 50 feet (10 to 15 metres). That is fine: it moves the boil temperature by less
than 0.1 °F (0.05 °C). A map pin, like Google Earth, is often steadier than the phone.

Type it in the **Elevation** box and press **Save**.

## The messages

Only real air pressures are used. The lowest ever at sea level was about 870 hPa (25.69 inHg) and the highest about
1084 hPa (32.01 inHg); up high the pressure at the brewery is lower, about 600 hPa (17.7 inHg) at 4,000 metres.

| Message | What it means | What Skynet uses |
|---|---|---|
| *Check your Airport code in Skynet Settings.* | The code is not 4 letters, or that airport sends no weather report. | Standard air at your Elevation |
| *The Pressure is not available from your Airport code set in Skynet Settings.* | No internet, the airport's weather station is down (no report in the last 3 hours), or its report has a pressure no airport ever had (below 865 or above 1085 hPa). | Standard air at your Elevation |
| *No Airport code in Skynet Settings yet.* | The box is empty. | Standard air at your Elevation |
| *That is not an air pressure. Type it in inHg (15.9 to 32.05) or hPa (540 to 1085).* | The typed pressure can't be real (for example 10.13). It is not saved. | What it used before |

## In a Process

This Skynet internal Global is set by Skynet and is read only (Rule 1.18):

| Name | What it is |
|---|---|
| `skn_Boil_Temp` | Today's boil temperature at your brewery. Skynet works it out from the air pressure at your Airport and your Elevation, both set in ☰ Menu > Default settings > Boil temperature. It shows in your Units (°F for US, °C for Metric). |

## The Boil Probe and wait_boil

Open the Properties of the temperature probe in your boil kettle and switch on **Boil Probe**. Only one probe can be the Boil Probe:
on every other probe the switch is greyed out, and the line under it says which probe has it. To move it, switch it off on that probe first.

In a Process, this line waits for the Boil Probe to be 1 degree under today's boil temperature, then goes on:

```
wait_boil -1
```

The number is in your Units: with US it is 1 °F, with Metric 1 °C. `wait_boil` on its own waits for the boil temperature itself.
Override and Stop work on it as on any wait. With no Boil Probe, the Process editor gives one warning.

The long way still works too: `wait BK_Temp >= skn_Boil_Temp - 1`.

Then start the boil clock with `start skn_Boil_Timer`: see [The Skynet Brew Timers](246-skynet-brew-timers).

Only the 4 letter airport code leaves the Brain. Nothing else about you or your brewery is sent.
