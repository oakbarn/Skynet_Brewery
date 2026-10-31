# Brew Process

The **Standard Skynet Brew Process** walks a brewer through a whole brew day, step by step, without writing any code. Press **☰ Menu** and pick **Brew Process**.

A brew day has seven **major steps**, done in this order:

| # | Major step | What it does |
|---|---|---|
| 1 | **PreBrew** | Load or check the Recipe, all pumps off and every valve closed, walk the brewery, lock the Equipment Profile. The same in every Schema. |
| 2 | **Heat Strike** | Fill the Hot Liquor Tank and heat the strike water to the Recipe's strike temperature. |
| 3 | **Add Grain** | Strike water into the mash tun, then the grain (dough in). |
| 4 | **Mash** | Every mash step of the Recipe (up to its temperature, then its time), the mash out and the sparge. |
| 5 | **Boil** | Up to the boil, then the Boil timer runs for the Recipe's boil time. The Recipe's hop alerts run on the Boil timer. |
| 6 | **Cool** | Chill the wort to the pitching temperature and move it to the fermenter. |
| 7 | **Ferment** | Pitch the yeast and hold the fermentation temperature. |

Each major step has its own **minor steps** (the `step "..."` lines you see on the Processes screen while it runs, like **House cleaning: pumps off, valves closed**).

## Process Templates

Each major step uses one **Process Template**:

- **Skynet Process Templates** come with Skynet (`Skynet_PreBrew`, `Skynet_Mash` ...). Nobody can change or delete them.
- **User Process Templates** are your own. Pick **➕ Add new User Process Template…** in a step's dropdown: it starts as a copy of the Template picked now, and you change the copy. **✏ Edit** changes one later, **🗑 Delete** removes it (the step goes back to the Skynet one).

**👁 View** shows any Template.

## Which Device does each job

Below the steps, the panel asks only for the jobs the picked Templates use: the Hot Liquor Tank heater and probe, the mash heater, probe, pump and timer, the boil heater, probe and timer, the chiller pump and wort probe, the fermenter control and probe. Each list holds only the Devices and Widgets that fit (a probe list shows only temperature probes, a pump list only pumps).

Leave a job on **(none: Skynet asks you to do it by hand)** and the Brew Day shows a pop-up for it instead, for example "Turn the Hot Liquor Tank heat on and set it to 163.2°F. Press Done when it is on."

## Build and start

1. Pick the Templates and the Devices, then press **💾 Save**.
2. Press **🔨 Build the Brew Day** (Admins). It makes seven Flow Processes, **Brew_1_PreBrew** to **Brew_7_Ferment**. Each one starts the next when it ends. Building again replaces them, and the old ones are kept as `.bak`. Build again after you change a pick or a Template.
3. Press **▶ Start Brew Day** (operators and Admins), or start **Brew_1_PreBrew** on the Processes screen.

A new Recipe needs no new build: the Processes read the Recipe when they run.

## Recipe values

Templates read the Recipe through names that start with **`rcp_`**. They are read only in a Process (change them in the Recipe), and they are in the panel's units (☰ Menu > Default > Units).

| Name | What it is |
|---|---|
| `rcp_Loaded` | true when a Recipe is loaded |
| `rcp_Name`, `rcp_Yeast_Name` | the Recipe and its yeast |
| `rcp_Batch_Volume`, `rcp_Boil_Volume` | into the fermenter, and at the start of the boil |
| `rcp_Total_Grain_Weight` | all the grain together |
| `rcp_Strike_Temp`, `rcp_Strike_Volume` | the strike water |
| `rcp_Mash_Steps` | how many mash steps |
| `rcp_Mash_Step_1_Name`, `_Temp`, `_Time` | each mash step (1, 2, 3 ...; Time is hh:mm:ss) |
| `rcp_Mash_Out_Temp`, `rcp_Sparge_Temp` | mash out (0 = none) and sparge water |
| `rcp_Boil_Time`, `rcp_Boil_Start_Temp` | the boil (hh:mm:ss), and the temperature it counts as boiling |
| `rcp_Ferment_Temp` | fermentation and pitching temperature |
| `rcp_Temp_Units`, `rcp_Volume_Units`, `rcp_Weight_Units` | °F or °C, gal or L, lb or kg |

While no Recipe is loaded, the values come from the **☰ Menu > Default** tab: its Mash Profile and Boil Profile. The strike temperature is worked out from the first mash step (water to grain ratio 1.5 qt/lb or 3.1 L/kg, grain at 68 °F or 20 °C). PreBrew always asks for a Recipe first.

The Brew Process screen shows every value as it is now.

## New Process commands

| Command | What it does |
|---|---|
| `ask "Add the grain, then press Done"` | a pop-up on every screen with **✔ Done**; the Process waits until an operator or Admin presses it. Text codes work (`\b`, `\n` ...). |
| `close_all_valves` | closes every valve on the **Close all valves** list |
| `open_all_valves` | opens every valve on the **Open all valves** list (how things are left after cleaning) |
| `all_pumps_off` | turns every pump off |

## Close all and Open all valves

Every valve that a Process switches (Electro_Mechanical, such as a Motorized Ball Valve) has two switches in its Properties:

- **On the Close all valves list** (on to start)
- **On the Open all valves list** (on to start)

Turn one off to leave that valve out. A **tap water valve** is always on the Close all list and never on the Open all list, so tap water can't be left running: its Properties say so and have no switches. A **Manual** valve is on neither list, because a Process asks for it by name.

## Writing your own Template

A Template is a Process with a few build lines that are used when the Brew Day is built and never reach the Process:

| Build line | Means |
|---|---|
| `{{HLT_Heater}}` | the Device picked for that job (see the job names below) |
| `@if HLT_Heater` ... `@else` ... `@end` | lines used only when a Device is picked for that job (or, after `@else`, when none is) |
| `@each_mash_step` ... `@end` | the lines once for each possible mash step; `{{n}}` is 1, 2, 3 ... |

Job names: `HLT_Heater`, `HLT_Probe`, `Mash_Heater`, `Mash_Probe`, `Mash_Pump`, `Mash_Timer`, `Boil_Heater`, `Boil_Probe`, `Boil_Timer`, `Chill_Pump`, `Wort_Probe`, `Ferment_Heater`, `Ferment_Probe`.

A line `//About: ...` near the top is the Template's description on the Brew Process screen.

See [Process language](22-process-language), [Tap water valves](31-tap-water-valves) and [Mash and Boil Profiles](35-mash-and-boil-profiles).
