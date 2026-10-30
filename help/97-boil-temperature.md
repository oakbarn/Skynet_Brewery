# Boil temperature

Water boils cooler when the air pressure is low: up a mountain, or when a storm is coming. In Denver water boils near
**203 °F (95 °C)**, not 212 °F. So a Process should not wait for 212 °F: it waits for **skn_Boil_Temp**, the temperature
water boils at **here and now** (Fritz, 2026-10-30).

## User Profile

**☰ Menu > ⚙ User Profile** (also **Settings > User Profile**) says where the brewery is:

| Field | What it does |
|---|---|
| **Country** | USA, Canada, Germany ... or a code like US, CA, DE |
| **Zip or postal code** | Finds the place best |
| **City** | When there is no postal code |
| **Airport** | Optional: a 4 letter ICAO code like KMKE. Empty = the nearest airport |
| **Height above sea level** | Optional: feet (US units) or metres (Metric). Empty = found from the place |
| **Air pressure to use instead** | Optional: inHg (like 29.92) or hPa (like 1013). Used as it is, no internet needed |
| **Get the air pressure every** | Minutes, 30 to start (airports report about once an hour) |

The top of the tab shows **Water boils at ... here now**, the air pressure, where it came from and when.
**🔄 Get the air pressure now** asks again at once. Only an Admin changes the User Profile. The place is the Brain's
(one brewery), so it is the same for everyone who signs in.

How the Brain gets the pressure:

1. **Air pressure typed in** the User Profile: used as it is.
2. **The nearest airport** that reported in the last 3 hours (its METAR, from aviationweather.gov), or the airport you name.
   An airport reports its pressure brought down to sea level, so the Brain takes it back up to the brewery's height.
3. **The weather service** (open-meteo.com) for that spot, when no airport answers.
4. **No internet:** standard air at the brewery's height (or at sea level), and the tab says so in orange.

The place is found on the map (openstreetmap.org) once, when it is saved. All of these are free and need no sign-up.

## Probe roles

**☰ Menu > Default > Probe roles** gives a temperature probe a job. Each role holds one probe, and a probe can have only one role:

| Roles | For |
|---|---|
| `sk_Boil_Probe_1` to `sk_Boil_Probe_3` | the boil kettle |
| `sk_Mash_Probe_1` to `sk_Mash_Probe_3` | the mash tun |
| `sk_HLT_Probe_1` to `sk_HLT_Probe_3` | the hot liquor tank |
| `sk_Ferment_Probe_1` to `sk_Ferment_Probe_10` | the fermenters |

Pick a probe beside a role and press **Save probe roles**. Double-click the dropdown to open the probe's Properties. The
role is kept with the probe itself (by its hidden key), so renaming the probe keeps its role.

## In a Process

| Name | What it is |
|---|---|
| `skn_Boil_Temp` | The boil temperature here now, in the panel's units (°F for US, °C for Metric, ☰ Menu > Default > Units) |
| `skn_Boil_Temp_C` / `skn_Boil_Temp_F` | The same in °C / °F |
| `skn_Air_Pressure` | The air pressure now, in hPa (millibar) |
| `sk_Boil_Probe_1` ... | The probe with that role. It works like the probe's own name: `if sk_Mash_Probe_1 > 152`, `sk_HLT_Probe_1.label` |

**skn_** names are **Skynet internal Globals**: Skynet sets them and a Process can only read them. **sk_** names are
**Skynet roles**.

**wait_boil** waits until `sk_Boil_Probe_1` reaches `skn_Boil_Temp` (in the probe's own °F or °C):

```
Element_Boil.enabled = true
wait_boil
print "Boiling at " + skn_Boil_Temp
tm_Boil.running = true
```

Other ways to write it:

- `wait_boil = 211` or `wait_boil = 99.8`: wait for that temperature instead (in the probe's units).
- `wait_boil = skn_Boil_Temp - 1`: a degree early, for a probe that reads a little low.

Process Check says so when no probe has the role `sk_Boil_Probe_1` yet. In Simulator mode a `wait_boil` is pretended
reached like any wait on a reading (Settings > Simulation).

Later (after Fritz has looked at this): vessels with roles in an order (Boil 1, Boil 2 ...) and `wait_boil_1`.
