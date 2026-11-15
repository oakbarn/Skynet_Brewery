# BruControl Importer: Interview Questions (Importer Sandbox)

Settled with OakBarn Brewery 2026-11-13 to 2026-11-15, from testing a BruControl brewer's file. **ON HOLD** (OakBarn Brewery, 2026-11-15: "Import can Hold. I want the Panel ready to go and see where it might conflict with a BruControl Import"). Not built: when the Importer work starts, the questions are taken from here. Names in *italics* are examples; the Importer puts in the brewer's own names.

**How the Importer handles a problem (standing approach):** fix it inside the Importer when it can (preferred). Only when it can't, ask the brewer a plain Interview question, so the brewer fixes their own setup. Each question is shown only when the file needs it.

**Plain terms: no Who's on First?** Every Interview question asks what a thing *is* or what the brewer can *see*, never how it is wired or which way it is flipped. ([Who's on First on Wikipedia](https://en.wikipedia.org/wiki/Who%27s_on_First%3F), [the YouTube clip](https://www.youtube.com/watch?v=5FsJe4DScDs))

## Fixed inside the Importer (no question)
- **Active Low** copied over as BruControl had it; listed in the Import notes.
- **BruControl Buttons** come in as Skynet Push Buttons.
- **PT100 probes on SPI boards** come in as Skynet PT100 Temperature Probes, with their offsets. The board's reference resistor (430 = PT100, 4300 = PT1000) is read from the file. Import note: "A PT100 board only reads PT100 probes. A PT1000 probe needs a PT1000 board (its reference resistor is 4300 ohms), so changing to PT1000 probes means new amp boards too."
- **Flow meters** (BruControl Counter) come in as Skynet Flow meters, with their sampling time. BruControl's Counter only counts pulses, so every one is a pulse meter.
- **A heater set to cool** (question 3 answered with a gas valve or element): set to heat, with a line in the Import notes.
- **ESP32 boards**: Import note: "Your ESP32 boards need Skynet firmware before Skynet can use them." (stand-alone firmware for every board is planned separately, matching BruControl Firmware 46 so no one rewires, Rule 6.16)
- **Empty Interfaces**: already handled on the Boards and Tabs page (empty boards start unticked).

## The questions

### 1. Fermentor pair
"*Ferm1 Heat* and *Ferm1 Cool* both read the *Ferm1 Temp* probe.
Skynet has a Device made just for this, the **Fermentor Control**. It both heats and cools one fermentor. You set one temperature. It turns the heat On when the beer is too cold and the cooling On when it's too warm, and never both at once. It also waits a little between them, so the heater and the chiller don't keep turning On and Off.
Is that what your BruControl scripts do with *Ferm1 Heat* and *Ferm1 Cool*: hold one fermentor at one temperature, heating or cooling as needed?"
- **Yes, make one Fermentor Control** (picked first): the two keep their names and Ports, and the Fermentor Control runs them.
- **No, keep them apart.**

### 2. What does it turn on? (only when the Importer can't tell)
"What does *Ferm1 Cool* turn on?"
- **Something That Cools** (freezer, chiller, glycol pump)
- **Something That Heats** (lamp, heat wrap, heat mat)

The Importer sets the relay so it works the way it did in BruControl.

### 3. What heats?
"*HLT Burner* turns something on to heat. What is it?"
- **Solenoid Gas Valve**
- **Other Gas Valve**
- **Gas Burner Control**
- **Electric Element**
- **Not Listed**

The first four make it a Heating Element (Rule 6.19). Not Listed leaves it as it is.
If Not Listed: "What does *HLT Burner* turn on?" **Something That Heats** / **Something That Cools**.

#### 3b. How is the burner lit? (gas choices)
- **Hand**
- **Pilot**
- **Electronic Ignition** (then: which Port is the igniter on?)

#### 3c. Flame Out safety (gas choices)
**⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.** (GAS_WARNING in public/flameout.js, PR #395: import it, never retype it)
"What the Flame Out safety does: while this burner's gas is On, Skynet watches its temperature. If the temperature drops, or doesn't go up within 5 minutes, the flame may have gone out. Skynet then shuts the gas valve, sounds the alarm, and shows **Burner may be out: check the flame.** You check the burner, relight it, and turn it back On.
It does not see the flame. It only watches the temperature, so it is a backup, not a replacement for a flame sensor or a thermocouple safety valve on the burner itself.
**This is not a UL listed safety and should not be relied on. Always monitor the burner.** (NOT_UL in public/flameout.js, PR #397: import it, never retype it)
Turn on the Flame Out safety for this burner?"
- **Yes** (picked first)
- **No**

(The Flame Out feature is in the Panel: Rule 6.33, Help 197. Keys the Importer sets: Heating Element gasBurner: true (a Solenoid Gas Valve, DO@Valve_Sgas, is always a gas burner); flameOut 'on'/'off'; input = probe name; flameSafety 'none'/'thermocouple'/'cutoff'; flameIgniter = Ignit Device name.)

### 4. (dropped: covered by question 3)

### 5. PT100 probe
**5a.** "How many wires come out of the *HLT Temp* probe? Count them."
- **3 Wires** (picked first) / **2 Wires** / **4 Wires**

**5b.** **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.**
"How is the RTD board for *HLT Temp* set? Look at the small solder pads on the board, or check what you did when you built it."
- **3 Wires** / **2 or 4 Wires** / **Not Sure**

Why Skynet asks: "Skynet has to tell the board how it is set. If it's told wrong, the temperature reads a few degrees off."
- 5a and 5b don't match: "Your probe and board don't match, so the reading may be off. A 3-wire probe needs the board's pads changed. See the board maker's guide."
- Not Sure: Skynet goes by 5a and adds a reminder to the Import notes.
- Both end with: "You can change this later in the probe's Properties if the temperature seems off."
- Panel: a matching **Board set for** box next to Probe wires in the PT100 Properties (both programs).

**BruControl note (Importer only, Rule 11.3; kept in the Importer Sandbox until the Big Merge):**
"BruControl's code did not handle 4-wire RTDs, so a 4-wire probe was usually put in as 2-wire, using the board's 2-wire trace cut. If you did that, pick **4 Wires** in 5a and **2 or 4 Wires** in 5b.
Skynet handles real 4-wire RTDs, and 4 wires give the truest reading.
**Adafruit's suggested use for 4 wires:** Adafruit's MAX31865 board comes set for 4-wire RTDs. Their words: "For 4-wire usage, do nothing with the jumpers!" Hook the four wires to the two terminal blocks, with the two wires that are joined inside the probe (about 2 ohms between them) on the same side.
If you set your board for 2 wires for BruControl (the two small triangle jumpers below the terminal blocks soldered closed), you have two choices: **do nothing**, and it reads just the same as it did in BruControl; or remove that solder to go back to true 4 wires. Nothing changes in Skynet: **2 or 4 Wires** stays the right answer. Other makers' boards may be marked differently, so see your board maker's guide."
(Source: https://learn.adafruit.com/adafruit-max31865-rtd-pt100-amplifier)

### 6. Flow meter
**6.** "What kind of flow meter is *Wort Flow*?"
- **Hall Effect** (paddle wheel, like the YF-S201) / **Turbine** / **Oval Gear** / **Not Listed**

Why Skynet asks: "This is for its picture and its Help. Skynet counts it the same way whichever you pick. This answer is optional."

**6b.** "How many pulses does *Wort Flow* send for each gallon?" (or Liter, for Metric)
Why Skynet asks: "Skynet counts the meter's pulses. To turn pulses into gallons and gallons per minute, it needs to know how many pulses make one gallon. It's on the meter's label or data sheet."
- Used by a Process or control: "Your Processes use this meter's reading, so this answer is needed." (cannot be blank, Rule 18.33)
- Only shown on a Tab: "This meter is only shown on a Tab. Nothing uses it to control anything. This answer is optional: leave it blank and fill it in later."
- Found in the brewer's Scripts (for example a total divided by 4200): the box starts filled with "Found in your Scripts. Check it against your meter."

The Importer's flow meter list is shortened to this one (Rule 2.38: the old list had Turbine and Thermal mass).

### 7. (dropped: the Boards and Tabs page already leaves empty boards unticked)
