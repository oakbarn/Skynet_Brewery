# Hysteresis: all the code, for review

Written 2026-11-10 for OakBarn Brewery's review, before the Process code changes (Draft PR "Process Offset sign").
Line numbers are as of this PR (after PRs #332 and #333). Each part says in plain English what it does today.

## The one thing to know first

Today there are **two ways of writing the same Offset**:

| Where | HLT element, Setpoint 150 °F, On at 149 °F | Cooling, Setpoint 66 °F, On at 67 °F |
|---|---|---|
| Dialogs (Rule 6.19, PR #332) | Offset (-) **-1** | Offset (+) **1** |
| Saved in the Schema, the Brain, a Process `.onoffset`, the .API | **1** (plus heats) | **-1** (minus cools) |
| BruControl (its OnOffset) | 1 | -1 |

The dialog adds the minus "in the background". **This PR's first change:** a Process writes the Offset the same way the
dialog shows it (`.onoffset = -1` heats, `.onoffset = 1` cools), and the predictive text after `.onoffset =` offers
**(-) Heat** and **(+) Cool**.

## 1. The Brain (runs the heating and cooling)

| File | Lines | What it does |
|---|---|---|
| `lib/control.js` | 162-186 `_hysteresis` | **The heart of it.** Every tick: reads the probe, the Setpoint (`target`), the Offset (`onoffset`) and On delay (`ondelay`). A plus Offset heats (On when the reading is the Offset below the Setpoint), a minus Offset cools (On when it is the Offset above). Off at the Setpoint. The On delay: the reading must stay past the On point that many seconds before it turns On. |
| `lib/control.js` | 168-169 | A Heating Element's heat Offset is kept inside its Hardware Controller's range (Rule 6.29) whatever was saved. |
| `lib/control.js` | 170-174 | Predictive (Rule 6.23): turns Off a little early (at most half the Offset), and the On point moves the same amount, so the swing stays the same. |
| `lib/control.js` | 82-103 `_coast` | Predictive learning: after it turns Off, watches how far the temperature keeps going and remembers it. |
| `lib/control.js` | 105-160 `_fermentor` | The Fermentor Control (Rule 6.30): Hysteresis on both sides. Its `heatoffset` and `cooloffset` are both **plus numbers** (Math.abs), Heat On at Setpoint - Heat offset, Cool On at Setpoint + Cool offset. |
| `lib/control.js` | 51, 65 | Which Devices run `_hysteresis`: the old separate Hysteresis Device, and a Heating Element or Cool / Warm Pump whose method is Hysteresis. |
| `lib/store.js` | 166 | What a Process can read and set on a Hysteresis: `.target` (`.setpoint`), `.onoffset`, `.ondelay`, `.state`. |
| `lib/store.js` | 659 | Start-up: copies the saved Offset (`onOffset`) into the running `.onoffset`, as is (no sign change). |
| `lib/store.js` | 1060-1066 | A Process or the .API setting `.onoffset` / `.ondelay` outside the Rule 6.29 range gets a plain error. |
| `lib/store.js` | 1130-1146 | Old rule for Devices sharing a Port (last one turned on wins). |
| `lib/hardware.js` | 265-275 | Stop everything: every Hysteresis is turned Off. |

## 2. Shared rules for both programs (`public/heatmethod.js`)

| Lines | What it does |
|---|---|
| 15 | Hysteresis is one of a Heating Element's methods, short name **HYS**. |
| 32-35 | A Cool / Warm Pump (Rule 6.21) may use Hysteresis: minus Offset cools, plus warms. |
| 79 | Hysteresis settings: Setpoint (`target`), On offset (`onOffset`, starts at **1**), On delay (`onDelay`). |
| 129-150 | Rule 6.29 Hardware Controller table: Optical SSR 0.5 to 3 °F, Contactor and Mechanical relay 1 to 5 °F with On delay at least 10 s (converted for °C). |
| 152-161 `heatHysProblem` | The plain error text. It already shows the minus to the person ("must be -0.5 to -3 °F ... It is -4"), but checks the plus number. |

## 3. Skynet Panel (dialogs and Tabs, `public/app.js`)

| Lines | What it does |
|---|---|
| 2409, 2428, 6484 | What the Tab shows: ON / idle and the Setpoint. |
| 6574 | The **old separate Hysteresis Device**'s Properties (Device, Pin, Input, Setpoint, On offset ...). |
| 6918-6920 | `coolsDir` / `heatsDir`: decides Heating or Cool (used for the Direction and the Blue Glow). A Cool / Warm Pump cools when its saved Offset is minus. |
| 7005 | Hover Help for Offset (-). |
| 7011-7019 `offsetChoices` | The Offset dropdown: every half degree the Hardware Controller allows, **shown with a minus, saved plus**. |
| 7040-7045 | Heating Element dialog: Direction (greyed, Heating) + Offset (-) + the wave picture; Hysteresis On offset / On delay still shown when Hysteresis is allowed but not Current. |
| 7052-7062 | Cool / Warm Pump dialog: label "On offset (- cools, + warms)" (still the saved sign, not the Rule 6.19 way). |
| 7670-7689 | Fermentor dialog: Heat Offset (-) (shown minus, saved plus, kind `negnum`) and Cool Offset (+). |
| 8126-8127, 8277, 8352-8353 | The dialog boxes that show the minus and save the plus. |
| 8452 | Picking a Hardware Controller sets the Offset and On delay (SSR 0.5 / 0 s, Contactor 1 / 10 s, Relay 1 / 10 s). |
| 7818 | Hardware Controller Hover Help. |

## 4. Process editor (predictive text, `public/autofill.js`)

| Lines | What it does |
|---|---|
| 162-174 | After `name.attribute =` it offers values: true / false, `.method` choices, timer types, hose connects. **Nothing yet for `.onoffset`** (this PR adds (-) Heat and (+) Cool). |

## 5. Building Schemas (`public/schemabuild.js`)

| Lines | What it does |
|---|---|
| 114 | A new vessel's Heating Element starts in Hysteresis, Setpoint 150, `onOffset: 1` (heats). |
| 171 | The fermentor sample's **glycol valve is built as a Heating Element with `onOffset: -1`** (cools). Old way: it should be a Cooling Device or a Fermentor Control (Rule 16.6). |

## 6. BruControl Import

| File | Lines | What it does |
|---|---|---|
| `lib/brucontrol.js` | 112, 343-347 | Reads a BruControl HysteresisPort: OnOffset, OnDelay, PredictiveHysteresis, its input probe. Keeps BruControl's sign (plus heats). |
| `lib/bruimport.js` | 49, 63 | The same, for the newer Import path (OnOffset -> onOffset). |
| `lib/bruimport.js` | 261 | A pump BruControl ran by a Hysteresis becomes one Cool / Warm Pump (Rule 6.21). |
| `lib/bruimport.js` | 329-352 | A heating Hysteresis (plus) and a cooling one (minus) on the same probe become ONE Fermentor Control; the offsets saved as plus numbers. |
| `lib/bruimport.js` | 550-559 | Rule 6.29: every heater starts as an Optical SSR; an Offset outside 0.5 to 3 °F is brought into range and listed in the notes. |
| `public/importer/connect.js` | 31, 108, 192, 245 | The Importer's Connect page: Hysteresis as a method column; pumps may use Hysteresis. |
| `public/importer/glossary.js` | 18-32 | Glossary words for Hysteresis. |

## 7. Smaller places (names, lists, colors)

`public/naming.js` 20, 56, 182-186, 239 (Type ID **Hys**); `public/datadisplay.js` 10; `public/semi.js` 11, 28;
`public/colorize.js` 29; `public/links.js` 41-43; `lib/engine.js` 346 (`name.HYS` = `.method = "Hysteresis"`);
`lib/modernize.js` 22; `lib/brewprocess.js` 45; `public/app.js` 1708, 2691, 2851, 2925-2974, 3186-3188, 4428, 4777,
5325-5396, 7092, 7801, 12142, 12535, 13383.

## 8. Help pages that talk about the Offset in a Process

- `help/150-heating-method.md` line 123: `.setpoint`, `.onoffset`, `.ondelay`.
- `help/164-cool-warm-pump.md` line 38: `MB_D5_CPMP_Cool~Pump_FR.onoffset = -1` (cools).
- `help/181-heat-hysteresis-switched-by.md` line 30: "writes `.onoffset` without the minus (2 means 2 degrees below)". **Changes in this PR.**
- `help/182-fermentor-control.md` line 56: `FV1.heatoffset = 1` / `FV1.cooloffset = 1`.
- Also 168 (Predictive Hysteresis), 137 (Heating Element Properties), 79 (Predictive text).

## 9. Things to decide (questions)

1. **Saved number:** change only the Process (and .API) side, or also flip the saved number so the Schema, Brain, dialog and
   Process all use one sign (no "background" minus)? Before the first Public Production there are no old Schemas to keep (No Old Ways).
2. **Fermentor:** should `FV1.heatoffset` also be written with its sign (`-1`) in a Process, like the dialog's Heat Offset (-)?
3. **Cool / Warm Pump dialog** still says "On offset (- cools, + warms)", the opposite of Rule 6.19's sign. Bring it to Offset (+) / Offset (-)?
4. **The old separate Hysteresis Device** (type `hysteresis`, Type ID Hys) and the glycol-valve-as-Heating-Element sample: bring to the latest standard?
