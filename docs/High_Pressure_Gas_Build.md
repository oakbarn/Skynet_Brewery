# High-pressure propane burner: parts list and step-by-step build

Date: 2026-11-14.

> **⚠ BIG CAVEAT. For Information Only.** This page lists parts and steps some home brewers use. It is not a plan to follow, not an
> approved design, and nothing here is tested. Every gas and wiring part must be chosen, fitted and checked by licensed professionals.
>
> **⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed
> Electrician, Plumber or HVAC professional.**

Most home brewing burners run on **high-pressure** propane (a regulator set to several psi). Two ways to add flame safety:

| | Way | What shuts the gas if the flame goes out |
|---|---|---|
| **Recommended** | **A. The UL / CSA listed way:** a listed high-pressure safety pilot valve (for example BASO H19) + a listed 24 V gas solenoid | The listed valve, by itself, with no power needed |
| For Information Only | **B. The daisy chain:** a K-type thermocouple + a stand-alone temperature controller + a 24 V gas solenoid | A cutoff made from parts. **Not listed.** |

Prices below are rough (late 2026) and change often. The links are examples to compare, not endorsements. Check every part's data
sheet for its **pressure rating**, its **gas type (LP / propane)** and its **listing (UL or CSA)**.

---

## Parts both ways need

| Part | What to look for | Rough price |
|---|---|---|
| High-pressure propane regulator and hose | The one your burner was sold with; adjustable 0 to 10 or 0 to 20 psi; hose made for propane | $25 to $60 |
| 24 V gas solenoid valve, normally closed | **Listed for gas (LP)** and rated **above** your regulator's psi; 24 VDC coil (or 24 VAC). Examples to compare: [McMaster-Carr propane solenoids](https://www.mcmaster.com/products/solenoids/for-use-with~propane), [ASCO gas shut-off valves](https://wholesale.yodify.com/Product/s/MVqK2/ASCO-S261-Series-Gas-Shut-Off-Valve) | $60 to $250 |
| 24 VDC power supply | DIN-rail or enclosed, at least 1 A more than the solenoid coil needs | $15 to $30 |
| Relay module for the brew controller's Digital Out | Contacts rated for the coil's voltage and current; opens when it loses power | $5 to $15 |
| Fittings | Brass, gas-rated, the right NPT sizes; yellow PTFE tape or gas-rated pipe dope | $15 to $40 |
| Leak test solution | Soapy water in a spray bottle, or a gas leak detector spray | $5 to $10 |
| Fire extinguisher (ABC) | Within reach of the burner | $30 to $60 |

## A. Recommended: the UL / CSA listed way

| Part | What to look for | Rough price |
|---|---|---|
| High-pressure safety pilot valve | Listed, for LP, sized for your burner's BTU. Example: BASO H19 series ([data sheet](https://industrialstores.com/media/industrialstores/product/attachments/BASO-H19-Series-High-Pressure-Safety-Pilot-Valve-Data-Sheet.pdf), [H19NA-4 at SupplyHouse](https://www.supplyhouse.com/Baso-Gas-Products-H19NA-4-1-4-Automatic-Shutoff-High-Pressure-Pilot-Gas-Valve-325000-BTU), [H19RA-2C](https://www.supplyhouse.com/Baso-Gas-Products-H19RA-2C-3-8-Automatic-Shutoff-High-Pressure-Pilot-Gas-Valve-600000-BTU)) | $150 to $350 |
| Thermocouple | The one the valve's data sheet lists (length to reach the pilot) | $15 to $30 |
| High-pressure pilot burner | Made for high-pressure LP, with its own small orifice; mounts so its flame lights the main burner and heats the thermocouple | $25 to $80 |
| Pilot gas line | Small tube and fittings from the pilot outlet of the safety valve to the pilot burner | $10 to $20 |

**How it works:** the pilot heats the thermocouple; the thermocouple holds the safety valve open. If the pilot goes out, the valve
shuts **all** gas (pilot and main) by itself. The 24 V solenoid, after it, lets the brew controller turn the main burner On and Off.

### Steps (A)

1. **Plan it with a licensed gas professional.** Pick the valve size for the burner's BTU and the regulator's psi.
2. **Gas line order:** tank → regulator → **safety pilot valve** → 24 V solenoid → main burner. The pilot line comes off the safety
   valve's pilot outlet to the pilot burner.
3. **Mount** the pilot burner so its flame reaches the main burner ports and wraps the thermocouple tip.
4. **Wire the solenoid:** 24 VDC supply → relay contact (on the brew controller's Digital Out) → solenoid coil → back to the supply.
   When the relay or the power is off, the solenoid is closed.
5. **Leak test** (below), then **first light** (below).

## B. For Information Only: the daisy chain some home brewers build

> **⚠ Not listed. Not recommended.** Use way A if you can. If you build this, have it checked by a licensed gas professional and a
> licensed electrician.

| Part | What to look for | Rough price |
|---|---|---|
| K-type thermocouple probe | High-temperature, ceramic or Inconel sheath, rated well above flame heat (1,000 °C or more), with high-temperature lead wire | $15 to $40 |
| Stand-alone temperature controller | K-type input, **relay output** (the "R" model), with an alarm or second relay contact. Example: Inkbird ITC-100 series in its relay-output model ([Inkbird ITC-100](https://inkbird.com/products/pid-temperature-controller-itc-100)) | $25 to $45 |
| Second relay (the ignition bypass) | On a second Digital Out of the brew controller; contacts rated for the coil | $5 to $15 |
| Digital In wiring ("flame proven") | From the controller's alarm or second contact to a Digital In of the brew controller | $5 |
| Igniter (optional) | A spark igniter on a third relay, or light it by hand with a long lighter | $15 to $40 |

### Steps (B)

1. **Gas line order:** tank → regulator → 24 V solenoid → burner.
2. **Mount the thermocouple** in the edge of the flame, where it gets hot within seconds of lighting but is not crushed by the pot.
3. **Set the controller** to hold its relay closed while the thermocouple reads hot, and open it well below flame heat (for example,
   closed above 400 °F). Its manual says how (often an "alarm" setting).
4. **Wire the solenoid coil** through **two contacts in a row (in series):** the controller's relay **and** the brew controller's relay.
   Both must be closed for gas to flow. Power lost on either side = gas shut.
5. **Wire the ignition bypass relay across the controller's relay** (in parallel with it only). The brew controller closes it for the
   **lighting window, 10 seconds to start** (it depends on how fast your thermocouple heats; time it on your burner), then opens it.
6. **Wire "flame proven"** (the controller's alarm or second contact) to a Digital In, so the brew controller knows the flame is lit
   after the window. No flame: everything Off.
7. **At most 3 tries**, with at least 1 minute between them so unburned gas can clear. After 3, stop and check the burner.
8. **Leak test** (below), then **first light** (below).

---

## Leak test (every new joint, and each brew day)

1. Everything Off. Open the tank valve slowly. The solenoid stays shut.
2. Spray soapy water on **every joint** from the tank to the solenoid. **Bubbles growing = a leak.** Shut the tank, tighten or redo
   the joint, and test again.
3. The joints after the solenoid only have gas in them while the burner is lit. Test them with the burner lit at its lowest flame,
   from a safe distance, with soapy water, then turn it Off. Never open the solenoid with the burner unlit to test.
4. Never test with a flame. Never use a joint that bubbles.

## First light test (outdoors, fire extinguisher at hand)

1. Regulator at its **lowest** setting. Lid off the pot, nothing on the burner. Stand back.
2. **Way A:** light the pilot by the safety valve's own steps (press, light, hold about 30 to 60 seconds, release). The pilot must stay lit.
   Turn the main burner On from the brew controller: it should light from the pilot.
   **Way B:** start the lighting window; the burner must light within it and "flame proven" must come on.
3. **Flame-out test:** with the burner lit, shut the tank valve. Way A: the safety valve should shut within the time its data sheet
   gives (often under a few minutes). Way B: the controller should open the relay and shut the solenoid within seconds. Time it.
4. **Power-lost test:** with the burner lit, pull the plug on the brew controller and the 24 V supply. The gas must shut at once.
5. **No-light test (Way B):** with the tank shut, start the lighting window. After it, the gas must shut and the brew controller must alarm.
6. Write down the times. Have a licensed gas professional look at the results before a brew day.

## Sources

- [BASO H19 Series data sheet](https://industrialstores.com/media/industrialstores/product/attachments/BASO-H19-Series-High-Pressure-Safety-Pilot-Valve-Data-Sheet.pdf)
- [BASO H19NA-4 (SupplyHouse)](https://www.supplyhouse.com/Baso-Gas-Products-H19NA-4-1-4-Automatic-Shutoff-High-Pressure-Pilot-Gas-Valve-325000-BTU)
- [BASO H19RA-2C (SupplyHouse)](https://www.supplyhouse.com/Baso-Gas-Products-H19RA-2C-3-8-Automatic-Shutoff-High-Pressure-Pilot-Gas-Valve-600000-BTU)
- [McMaster-Carr: solenoid valves for propane](https://www.mcmaster.com/products/solenoids/for-use-with~propane)
- [ASCO S261 gas shut-off valve](https://wholesale.yodify.com/Product/s/MVqK2/ASCO-S261-Series-Gas-Shut-Off-Valve)
- [Inkbird ITC-100 PID temperature controller](https://inkbird.com/products/pid-temperature-controller-itc-100)
