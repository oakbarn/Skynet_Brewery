# Boil Temperature from the Air Pressure

Water boils cooler when the air pressure is low: high up a mountain, or when a storm is coming. At sea level water boils at
212 °F (100 °C); a mile up it boils near 202 °F (95 °C). So a Process that waits for 212 °F could wait forever.

Skynet reads your airport's weather report (its METAR) every 30 minutes, takes the pressure up or down to your brewery's
height, and works out the temperature water boils at **here and now**. Your Processes use it as `skn_Boil_Temp`. Use it to
tell when the boil has started.

## Set it up

Open **Settings > Boil temperature (air pressure)** (Admins).

| Box | What to put in |
|---|---|
| **Airport (ICAO)** | Your airport's 4 letter ICAO code, for example `KORD`. This is the only way to pick the weather station. |
| **Elevation** | Your brewery's height above sea level (feet for US Units, metres for Metric). It starts as the airport's own height. Change it to your own. |
| **Typed air pressure** | Leave it empty. A pressure typed here is used as it is, with no internet. |

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

- **Your phone:** on an iPhone the **Compass** app shows the elevation at the bottom of the screen. Many free elevation or
  altimeter apps do the same on iPhone and Android. Stand in the brewery and read it.
- **An internet search:** search for **elevation** and your town or address.

Type it in the **Elevation** box and press **Save**.

## The messages

| Message | What it means | What Skynet uses |
|---|---|---|
| *Check your Airport code in Skynet Settings.* | The code is not 4 letters, or that airport sends no weather report. | Standard air at your Elevation |
| *The Pressure is not available from your Airport code set in Skynet Settings.* | No internet, or the airport's weather station is down (no report in the last 3 hours). | Standard air at your Elevation |
| *No Airport code in Skynet Settings yet.* | The box is empty. | Standard air at your Elevation |

## In a Process

These Skynet internal Globals are set by Skynet and are read only (Rule 1.18):

| Name | What it is |
|---|---|
| `skn_Boil_Temp` | The temperature water boils at here and now, in the panel's Units (°F for US, °C for Metric) |
| `skn_Boil_Temp_C` | The same in °C |
| `skn_Boil_Temp_F` | The same in °F |
| `skn_Air_Pressure` | The air pressure at the brewery now, in hPa |

Wait until the kettle is a little under the boil, then go on:

```
wait BK_Temp >= skn_Boil_Temp - 1
```

Only the 4 letter airport code leaves the Brain. Nothing else about you or your brewery is sent.
