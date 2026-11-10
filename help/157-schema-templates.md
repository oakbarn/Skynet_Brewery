# New Schema from a Skynet Template

Answer a few questions, and Skynet makes a whole new Schema that is ready to brew: the Brew House Tab with its vessels, valves, pumps, chiller and Supply Manifold, a Fermentor Tab, every Device on a free Port of **your own** Interface, and the Brew Process with every job picked and the Brew Day built (Skynet Rule 16.6).

Open the **Schema** dropdown, pick **Add new Schema**, give it a name, and set **Start from** to **A Skynet Schema Template**. (**A copy of** the Schema you have open is still there too, to start from your own.)

## 1. Pick a Brew House Tab Template

| Template | What it has | Process Templates it uses |
|---|---|---|
| **1 Vessel** | One electric vessel that heats, mashes in a grain basket and boils (like a BrewZilla or Grainfather). No pump. | the 1 Vessel ones |
| **1 Vessel + 1 Pump** | The same, with a pump that recirculates the mash, whirlpools and fills the fermentor. | the 1 Vessel ones |
| **2 Vessel + 1 Pump** | A kettle that heats the strike and sparge water and then boils, and a mash tun. One pump does every job. | the 2 Vessel ones |
| **2 Vessel + 2 Pumps** | The same, with a mash pump and a kettle pump. | the 2 Vessel ones |
| **3 Vessel** | Hot Liquor Tank (with a HERMS coil), mash tun and brew kettle, a mash pump and a kettle pump. The last hot side Template. | the Skynet ones |
| **OakBarn Brewery** | Every vessel and pump of the OakBarn Brewery: Radiator, Big Mac, Mash Tun, Brew Kettle, Little Mac, the 65 L Brewzilla and the DigiBoil (both [set by hand](158-digiboil-and-brewzilla)), and the Red, Yellow, Green, Blue and White pumps. Take out what you do not have. | the Skynet ones |
| **Fermentor** | On its own: only a Fermentor Tab, and a Brew Process that only ferments. | Ferment |

Then pick the **Interface** (your board). Each Device takes the next free Port on it. The new Schema starts in **Simulator Mode**: nothing real is switched until you press **🔌 Real**.

## 2. The questions

- **Each vessel**: a Vessel Template, or a general type (HLT, Mash Tun, Brew Kettle, All In One) at the bottom of the list. And its heat: electric (a Heating Element), gas (a burner on a gas valve) or none.
- **Pumps**: the Template's own number to start.
- **Mash recirculation**: none, a RIMS tube, or a HERMS coil in the HLT.
- **Chiller**: immersion, plate or counterflow. A **Wort out** probe goes on it, so the chill knows when to stop.
- **Whirlpool while chilling**: the Brew Day uses **Whirlpool and Chill** instead of **Chill**.
- **Valves**: hand valves (Skynet asks you to turn them) or a motorized valve on each vessel outlet (and the chiller water).
- **Supply Manifold**: none, a Long Tee with a Valve, a Double or a Triple, with manual or motorized valves.
- **Fermentors**: how many go on the **Fermentor** Tab. Each has its temperature probe and a **glycol** valve that turns on above the fermentation temperature. Fermentor 1 does the Ferment step's jobs.

Every question starts from **☰ Menu > Default settings > New Schema from a Skynet Template**, so set your usual answers there once.

## 3. Ready to make

The last page lists what goes on each Tab and every Device with its name and Port. Press **Save**: the Schema is made and loaded, and the Brew Day is built.

Pipes are not drawn: pipe the equipment the way yours really is (Edit layout > Draw pipe).

## Pick a job by clicking it

In **☰ Menu > Brew Process**, each job has **🎯 Click it on the Tab**. It goes to the Tab, lights up the items that fit that job (the pumps for a pump job) and greys the rest. Click the one that does the job, and the Brew Process page comes back with it picked. Press **💾 Save** to keep it. **Cancel** or **Esc** goes back with nothing changed. The list next to it still works, for a brewery with many valves.
