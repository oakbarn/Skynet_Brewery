# Importer: the item and Widget pages

The BruControl Importer ([Help 143](143-brucontrol-importer)) asks about each of your items in small pages, one kind at a time.
Every page works the same way, and every answer is kept a moment after you give it, so you can close the Importer and carry on later.

## The columns on every line

| Column | What it is |
|---|---|
| Display Name | the words BruControl showed with the item; greyed when there was none (then its BruControl name is shown) |
| ✔ | tick it to copy the Display Name into the Label box |
| Label | your own words for it (HLT, Mash Tun ...). It is the Label in Skynet and part of its suggested name. Never blank |
| Show | ticked: the Label is shown with it on the Tab. It starts as BruControl showed the name |
| Skynet Name | the suggested Skynet name made with your Label; it changes as you type. Until you type a Label it is made with the Display Name, greyed |

There is no "tick them all" box, on purpose. Each item must be looked at: a BruControl name is often a code only its builder
knows, like `M_6_B_1`, while its Label should say what it is in your brewery, like *HLT*.

A box marked **(optional)** may stay blank; every other box must be filled in (Rule 18.33). A box is needed only when the
program or the board needs it to work, like the Pulses of a Hall effect flow meter. Handy information, like Volts, Amps or Watts,
is optional. A box needed by some types only is greyed out for the others; for a type that needs it, leaving it blank brings up a
pop-up, so you fill it in or leave the page with **◀ Back**. Every list starts at **Pick one…**; when no choice fits, pick **User defined** and type your own words.
**Accept ▶** marks a blank box in red and tells you how many there are.

## The Widget pages

They come right after **Your Tabs**. BruControl's **Application Elements** (things on a Workspace not wired to a board) become
the Skynet Widget that does the same job:

| BruControl | Skynet |
|---|---|
| Timer | Timer Widget |
| Alarm | Alarm Widget |
| Toggle Switch | Switch Widget |
| Script | Process Widget ([Help 173](173-process-widget)): shows its Process with Start / Stop; one click starts or stops it |
| Chart | Graph Widget ([Help 159](159-graph-widget)) |
| Inspector | none: it stays a grey Placeholder |

The first page lists every kind of Skynet Widget and how many of yours become one. Then there is one page for each kind found on
the Tabs you are importing, so *Timers (1 of 1)* when Timers are the only kind.
A Widget's suggested name is `wgt_`, its kind, the Label and the Tab ID, for example `wgt_TMR_Mash~Timer_BR`.

## The item pages

One page each, in this order: **Pumps, Heating Elements, Temperature Probes, Valves, Flow Meters, pH Meters, Pressure Sensors
(PSI), Hydrometers, Volume Meters, Floats, Digital Inputs, Other items.**

- **How many ... do you have?** If you have more than were found, an empty line is added for each one. An empty line has a
  **Fill with an item…** list of the items no page has taken yet (from Other items).
- **Belongs on** moves a line to the page it belongs on, for example a flow meter that landed in Other items.

| Page | It asks |
|---|---|
| Pumps | Pump model and Power, both optional (Power is filled in for you when the model is made for one voltage, like *Topsflo TD5 (24 V DC)*), Control Type |
| Heating Elements | Watts and Volts (both optional), Control Type |
| Temperature Probes | **Probe type** (needed): the Skynet probe types (OneWire, RTD, Thermocouple, the NTC thermistors, LM35, TMP36) |
| Valves | **Connection Type** and **Size** (both needed), Valve type and Voltage (optional) |
| Flow Meters | Meter type (Hall effect, turbine, oval gear, magnetic, ultrasonic, thermal mass, vortex) (needed), **Pulses per Gallon or Liter** (needed for a Hall effect, turbine or oval gear meter, greyed for the others) |
| pH Meters | **Signal to the board** (needed), pH meter type (optional) |
| Pressure Sensors (PSI) | **Sensor type** (needed), **Highest pressure it reads** (needed, greyed for a Pressure switch) |
| Hydrometers | **Hydrometer type** (needed: Tilt, iSpindel, RAPT Pill, Plaato ...), a Tilt's **Color** or any other kind's **Hardware ID** (needed) |
| Volume Meters | **How it measures** (needed), **Most it reads** (needed for an Ultrasonic, Pressure or Float level sensor, greyed for the others) |
| Floats | **Contact**: Normally Open or Normally Closed (needed), Float type (optional) |
| Digital Inputs | **Input type** (needed): the Skynet Digital Input types |

**Set every Valve**, at the top of the Valves page, gives every line the same Connection Type, Size and Voltage at once (for
example TC, 1 1/2 inch, 24 V DC). Each time you change it there, every line follows; then change any line that is different.
When the Skynet Panel on this computer has a **Default pipe size** set, a valve with no Size starts at it.

**Connection Type** is how the valve is built into your manifold, not the thread on the valve itself. A BSP valve with a BSP to
NPT adapter and a female TC on each end is a **TC** valve, because it joins the manifold with Tri-Clamps. **Size** goes up to
4 inch, in inches with millimeters, and the metric sizes, whatever units you picked.

## Control Type (Pumps and Heating Elements)

Each numbered column is one way to control it: **1 On/Off, 2 Speed (PWM), 3 Duty Cycle, 4 Hysteresis, 5 PID, 6 Deadband,
7 Precise.** Tick every one it may use. A pump's On/Off is always ticked. A Heating Element always has its On/Off button to turn
it on, so its first column is **On/Off Only**: tick it when nothing else controls it, and the other columns are greyed; untick it
to pick them. Then pick the **Primary** one, the method it starts with, by its
column number.

A method that is not recommended unticks itself and says why, with a **Use it anyway** button:

- **A pump:** Duty Cycle, PID, Deadband and Precise switch the motor on and off many times a minute. Use On/Off, Speed (PWM) or
  Hysteresis (a Cool / Warm Pump, [Help 164](164-cool-warm-pump)).
- **A Heating Element:** Speed (PWM) is for a pump, a fan or a motor; a heater on a PWM pin is run by Duty Cycle, PID, Deadband or Precise.

A Heating Element and a Cool / Warm Pump start in their Primary method, with a one-click spot on the Tab for each other one ticked.

⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.
