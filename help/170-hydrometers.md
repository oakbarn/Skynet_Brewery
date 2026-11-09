# Hydrometers (Tilt, iSpindel, RAPT Pill ...)

A **Hydrometer** is one Device for every kind of floating hydrometer (Skynet Rule 6.25). Add one from **Add Device >
Hydrometers**, and pick its **Template**: the kind you have. Every Hydrometer has the same Properties. The settings its Template
does not use are **greyed out**, so you can see what is there but can't change it.

| Template | How it talks | How Skynet tells two apart |
|---|---|---|
| Tilt, Tilt Pro, Tilt Pro Mini | Bluetooth | its **Tilt Color** (Red, Green, Black, Purple, Orange, Blue, Yellow, Pink) |
| iSpindel, Floaty | Wi-Fi: it sends its readings to Skynet | its **Hardware ID**: its Name (iSpindel000 to start) or its ID number |
| GravityMon | Wi-Fi or Bluetooth | its Hardware ID |
| BrewBrain Float | Wi-Fi, or the BrewBrain cloud | its Hardware ID |
| RAPT Pill | Bluetooth, or the RAPT cloud | its Hardware ID (shown in the RAPT app) |
| PLAATO | the PLAATO cloud | its Hardware ID |
| Other hydrometer | any | its Hardware ID |

## More than one

A Tilt's **Tilt Color** must be picked, and every other kind's **Hardware ID** must be filled in. That is how a reading finds its
Hydrometer, so two Hydrometers can never have the same one: one Tilt of each color (a Red Tilt and a Red Tilt Pro would look the
same), and a different Name on each iSpindel. Skynet never goes by a hydrometer's IP address, because your router may change it.

Leave a Tilt's **Tilt Color** blank and a pop-up says **The Color for a Tilt cannot be left blank**, then takes you back to the
Color box. The Importer's Hydrometers page does the same, and it greys out the box a type does not use.

You don't have to look a Hardware ID up. Turn the hydrometer on and wait for its first reading. The **Hardware ID** box then offers
every one the Brain heard that no Hydrometer has yet.

## Wi-Fi (iSpindel, GravityMon, Floaty, BrewBrain Float)

On the hydrometer's own setup page, pick **HTTP** and send to the address shown in its Properties:
`http://<the Brain's address>:<port>/api/hydrometer`. From your home network nothing else is needed. From anywhere else, add
`?key=` and the API key (☰ Menu > Settings).

## Bluetooth and the cloud

Reading Tilts and other Bluetooth hydrometers with the Brain's own Bluetooth (or an ESP32 near the fermenter) comes in the next
step, and the makers' clouds after that. Until then, a Hydrometer on a Simulator Interface shows a pretend fermentation (Simulator
settings: `{"og":1.056,"fg":1.012,"hours":96,"tempF":66}`).

## What it reads

- Its value is its gravity, in its **Gravity units** (SG, °Plato or °Brix). `.sg`, `.plato` and `.brix` are always there too.
- `.temperature`, and where its kind sends them `.battery`, `.rssi` (signal strength) and `.angle` (tilt angle).
- `.lost` is true, and it shows **No signal**, when nothing was heard for its **Lost signal after** minutes (Tilts 15, others 60).
- `.og` is the **Original Gravity** (SG; a Process may set it) and `.abv` the alcohol from it.
- **Gravity offset**, **Temperature offset** and **Smoothing weight %** (lower = smoother; Tilts start at 20 %) tidy up its readings.

**Database and .API** work as on every Device. A Hydrometer that talks through the web (Wi-Fi or a cloud) always has .API **On (Read
Only)**, shown greyed out.

**On a Graph**, a Hydrometer's line has a small **SG / °P / °Bx** switch. One click shows it in the other units, older readings too.
Each screen keeps its own pick.

## A reading by hand: take_reading

A Refractometer or a Glass hydrometer is read by a person, so it is a Process command, not a Device:

    take_reading OG_Value

The name after it is where the reading goes: a Hydrometer, a Value Widget or a gGlobal. The Process waits, like a `wait`, until the
reading is saved.

1. A pop-up asks **Refractometer** or **Glass** (tick one).
2. **Refractometer:** the SG box comes up at once. **Glass:** type how many minutes the sample needs to cool. A bar at the top counts
   down (**Read it now** skips the wait), then the SG box pops up.
3. Type the SG (for example 1.050) and press **Save**. With **Send to Database now** ticked the reading is sent to the database;
   unticked, Save is **Exit (No Database)**.

**Pause** hides the pop-up so you can do other things. It pops up again in 5 minutes. Only a person can pause it.

## The BruControl Import

A BruControl **Hydrometer Input** becomes a Tilt Hydrometer with the same Tilt Color, on the same port. The Importer's
**Hydrometers** page lists the same Templates, with the Tilt Color and the Hardware ID.
