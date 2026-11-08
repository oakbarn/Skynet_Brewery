# DC Brewing Pumps (12 V and 24 V)

A list of low-voltage (DC) pumps that home and craft brewers use, so the Skynet Panel can get these pump types.
OakBarn Brewery said Go to every idea in section 5 (2026-11-08): they are built (Rule 18.32, Help 162).

Searched 2026-11-08. Numbers are what each maker or store page says (see Sources at the end). Pages often
disagree a little, so treat flow and lift as "about".

Words used below:
- **Flow** = how much it moves with nothing in the way (GPM = gallons per minute, L/min = litres per minute).
- **Lift** = how high it can push liquid straight up before the flow stops (the "head", in feet or metres).
- **Brushless** = a motor with no wearing brushes. Lasts longer and some can be slowed down (speed control).
- **Power brick** = the plug-in box that turns house power into 12 V or 24 V (power supply).

## 1. The tartan pumps

The tartan Schema (from a fellow brewer, kept private) has five pumps:

| Pump in the tartan file | How BruControl runs it | What it is for |
|---|---|---|
| M_Boil Pump, M_HLT Pump, M_Mash Pump | Plain On/Off output (Digital Output) | One pump under each of the three vessels |
| Cool Pump | Hysteresis output (turns on when the fermenter is too warm) | Glycol chiller pump for the fermenter |
| Warm Pump | Hysteresis output (turns on when the fermenter is too cold) | Heat pump for the fermenter |

The file does not say the make or model, only that they are switched on and off. The owner's pumps are 24 V.
So the Panel can already run them as On/Off Pumps today; what is missing is a way to say "this is a 24 V DC
pump" and pictures of the common DC pumps.

## 2. DC pumps for hot wort (brew day)

| Pump | Volts | Motor | Flow | Lift | Hottest | Ports | Body | Power brick | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **Topsflo TD5** (also sold as Steelhead and Wort Hog) | 24 V (runs on 6 to 24 V) | Brushless, magnetic drive | 5 GPM (maker) / 6.4 GPM (store) | 14 ft (maker) / 19 ft (store) | 230 °F (110 °C) | 1/2" NPT in and out | 304 stainless | Included at MoreBeer (120 V to 24 V) | Power level can be set (5, 10, 15 or 25 W). Very quiet. **Most likely the most common 24 V brew pump.** The Panel already has a Topsflo TD5 picture. |
| **March 809-PL-HS DC** | 12 V or 24 V (also 36 V) | DC (store page says both "brush" and "brushless") | 7 GPM | 12 ft | 250 °F | 3/4" male NPT in, 1/2" male NPT out | PPS plastic (Ryton) | Not stated | DC version of the well-known March 809. Costly (about $436). The Panel already has March 809 pictures. |
| **DDMETER HB-MP20** | 12 V | Brushless | 9 L/min (about 2.4 GPM) | 5 m (about 16 ft) | 100 °C (212 °F) | Stainless fittings (size not stated) | Stainless and plastic | Not included | 18 W, 1.5 A. Small and low cost. |
| **BrewTaurus JT-1000B-24** "Mini pump DC 24V" | 24 V (starts at 9 V) | Brushless | 2000 L/h (about 33 L/min, 8.8 GPM) | 5 m (up to 8 m) | 100 °C (212 °F) | 20 mm and 1/2" thread | Not stated | Included (24 V) | Can sit in the liquid (submersible). Sold out when checked. |
| **bayite BYT-7A006** | 12 V | Brushless | 2.1 GPM | 9.8 ft (3 m) | 100 °C (212 °F) | 1/2" male thread | Not stated | Not included | 0.7 A. Sold as a solar hot-water pump. Will not prime itself; the review says it is not a swap for a March or MKII. |
| **"Solar hot-water" 12 V pumps** (Seaflo center inlet wort pump, ZAOJIAO, LD Carlson DC brewing pump and others) | 12 V | Usually brushless | Varies (about 2 to 5 L/min for the smallest) | Varies | Usually up to 100 to 110 °C | Varies (barb or 1/2" thread) | Plastic | Some include one | Cheap and many brands. Fine for small batches and transfers. |
| **Anvil Foundry recirculation pump kit** | Not stated on the store page | Not stated | Not stated | Not stated | Not stated | Hose kit | Not stated | Not stated | Made to fit the Anvil Foundry. Needs checking before it is added. |

## 3. DC pumps for cold liquid (glycol, fermenter cooling)

These are for cold glycol or ice water, not hot wort. The tartan **Cool Pump** is this kind.

| Pump | Volts | Flow | Lift | Ports | Notes |
|---|---|---|---|---|---|
| **Penguin Chillers glycol pump, standard** | 12 V | 3.5 GPM | 16 ft | 3/8" barb | 19 W. Made to cycle on and off, not run all day. |
| **Penguin Chillers glycol pump, XL** | 24 V | 6.3 GPM | 32 ft | 3/8" and 1/2" barbs | 60 W. Made to cycle on and off. |
| **Grainfather GF30 cooling pump** | 12 V | Not stated | Not stated | Grainfather fittings | Cools the Grainfather GF30 fermenter. |
| **Small 12 V or 24 V submersible pumps** (aquarium / fountain style) | 12 V or 24 V | Varies | Low | Barb | Often dropped in a bucket of ice water to cool a fermenter. |

## 4. Pumps that are NOT DC (so they are not mixed up)

These run straight off house power (AC). The Panel already has pictures for most of them.

| Pump | Power |
|---|---|
| KegLand MKII 25 W | 240 V AC (the NZ store page says 240 V, 1.1 A) |
| March 809 and 815 (standard) | 115 V or 230 V AC |
| Chugger (all heads) | 115 V or 230 V AC |
| Blichmann RipTide | 120 V AC |
| BrewZilla Gen 4 built-in pump | 220 to 240 V AC, 6 W |

## 5. What the Skynet Panel does with them (Rule 18.32, Help 162)

All a Go (2026-11-08). Built, except where it says it waits:

1. **A "Power" setting on every Pump**: AC house power, DC 12 V, or DC 24 V. A DC pump is still turned On or Off
   with one click (Rule 2.33), like every other Pump.
2. **Speed control for brushless DC pumps**: some (for example the Topsflo TD5) can be run slower. If wanted, a DC
   pump could have a "Speed %" that uses the PWM output the Panel already has.
3. **A "Use" setting**: Hot wort, or Cold (glycol / chiller). The BruControl Importer guessing that a pump named "Cool" or
   "Glycol" is a cold pump waits for the Importer review.
4. **Pictures**: the Topsflo TD5 and March 809 pictures already exist. Every pump in the list can be picked as the **Model**, so its
   facts show even with another picture. New drawings (for example a small solar-style
   12 V pump or a Penguin glycol pump) are only made if OakBarn Brewery asks, and they are not added to the Image
   Library unless asked.
5. **Wiring note** (Help 162 and the Pump's Properties): a 12 V or 24 V pump is never wired straight to a board pin. The
   board's output switches a relay or a switch module (MOSFET) that carries the pump's own 12 V or 24 V power. With the
   electrical warning of Rule 6.20: "OakBarn Brewery and Skynet are not electricians... Consult a Licensed Electrician".
6. **Facts at your fingertips**: hold the mouse on a pump to see its model, power, use, speed, flow, lift, hottest liquid and ports.

Both programs (the Skynet Panel and the BruControl Import) share these Pump settings. The manual BrewZilla 3 pump is a Pump Widget,
built in its own thread.

## Sources

- Topsflo TD5 maker manual: https://www.manualslib.com/manual/1608243/Topsflo-Td5.html
- Topsflo TD5 store post (MoreBeer): https://www.homebrewfinds.com/topsflo-td5-beer-pump-119-99-save-50-free-shipping/
- March 809-PL-HS 24 V DC: https://pumpbiz.com/pps-magnetic-circulation-pump-24-volt-809-pl-hs-24vdc-brush
- March 809-PL-HS 12 V DC: https://pumpbiz.com/pps-magnetic-circulation-pump-12-volt-809-pl-hs-12vdc-brush
- DDMETER HB-MP20: https://www.ddmeter.com/products/hb-mp20-dc-12v-brewing-pump-low-noise-durable-homebrew-beer-circulation-brushless-water-pump-home-brew-beer-pumps
- BrewTaurus mini pump DC 24V: https://brewtaurus.com/en-cz/products/mini-pump-dc-24v
- bayite BYT-7A006: https://www.homebrewfinds.com/bayite-food-grade-hot-water-circulation-pump/
- Seaflo center inlet wort pump: https://m.made-in-china.com/product/12V-High-Flow-Water-Pump-739189975.html
- LD Carlson DC brewing pump: https://www.scribd.com/document/422793312/Ld-Carlson-Dc-Brewing-Pump
- Anvil Foundry pump kit: https://morebeer.com/products/anvil-foundrytrade-recirculation-pump-kit-18-gal
- Penguin Chillers glycol pump: https://www.brewershardware.com/penguin-chillers/penguin-chillers/penguin-glycol-pump.html
- Grainfather GF30 12 V cooling pump: https://us.grainfather.com/products/grainfather-gf30-12vdc-cooling-pump-3-way-cord
- KegLand MKII 25 W: https://leagueofbrewers.co.nz/mkii-high-temperature-magnetic-drive-pump.html
- BrewZilla Gen 4 pump: https://www.kegland.com.au/products/high-temperature-magnetic-drive-pump-6watts-220-240v-replacement-for-brewzilla-gen-4
