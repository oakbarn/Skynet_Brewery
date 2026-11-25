# Motorized Ball Valve Device Properties

Adding a **Motorized Ball Valve** works the same way as adding a Pump (see [Pump Device Properties](115-pump-device-properties)),
with one difference: **a valve has no Cover**. (Skynet Rule 18.23)

Every dialog here follows the Blichmann Model, the same as the Pump: the title and buttons stay at the top while the rest
scrolls, there is no row of buttons at the bottom, and every ⬢ or ⬆ pop-up has **💾 Keep**, **Close** and **✕** at its top (Rule 2.54). (Skynet Rule 18.41)

## Adding a Motorized Ball Valve

1. In Edit layout, click **Valves > Motorized Ball Valve, open / closed (relay)** (it is in the **On/Off** list too).
2. **Pick the valve.** Each one has its picture:
   - **Skynet Motorized Ball Valve**: the Skynet drawing (blue actuator). Its picture is set.
   - **➕ New User Defined Motorized Ball Valve**: makes a new valve with your own pictures, and you set where its In and Out IPs
     are. It does not pick a valve you made before: to show a valve that is already on a Tab on another Tab too, use **⧉ Clone Device**.
3. The Add box opens with the valve's name as its title. Its **Label** is already filled in as **mBV_1**, mBV_2 ... (the next
   number), so the cursor starts on the **Available Ports**. You can change the Label, but it can't be blank. Fill it in order: 1 the
   **Label** (the ⬢ beside it sets its font and colors) and **Label Visible**, 2 the **Interface** (the board) and an **Available Port** on the same line, 3 the **Tab**.
   Then the **Suggested Name** shows, made from them, with the rest:
   - **Valve Profile** (the User Defined valve only): the pictures, Orientation and Overlay it starts with. The one marked Default
     is picked; there is always one Default Valve Profile (☰ Menu > Valve Profile).
   - **Graphic**: the valve as it will show on the Tab, closed, turned to its Orientation.
   - **Path**: the picture file.
   - **Orientation** and, on the same line, **Toggle**: how the valve stands (the Graphic and its IPs turn with it), and what
     a tap does (On/Off opens or closes it with one click).
   - **Overlay**: drawn on top while the valve is open (the steady red and yellow lightning bolt). On the same line,
     **Database and .API ⬢** opens its settings (Help 98).
   - **Tap water valve**, **On Close List** and **On Open List** on one line (both lists on to start).
   - **X**, **Y**, **Width** and **Height** on one line, and the **Device Type** greyed out.
   **Enter** goes between the **Label** and the **Available Ports** only; on a picked Port it asks you to **Confirm** the Interface
   and Port (or go **◀ Back**). The **Tab key** goes through every box, last back to first; the Interface and Tab are changed with
   the Tab key or the mouse. Once Confirmed, the rest of the box opens with the cursor on the **Orientation**. If **➕ Add Device**
   looks faded, press it anyway: it tells you what is still missing.
4. Press **➕ Add Device**. The valve is made on the 🔨 [Build Tab](55-build-tab) and its Properties open; **✅ Finish Build ...** moves it to the Tab you picked. The **Interface** and **Port** are now
   greyed out and set: they are the wiring, so they stay as they are. To wire it to another board or pin, delete it and add it again. Its Name can still be changed with **✏ Change name**.

## The Label

How do you refer to this Valve? Mash Valve, HLT Valve, Fermenter Valve ...? Use your name for the Valve as the Label. OakBarn
Brewery Sample Schema has several Valves. When OakBarn is brewing, he might yell out, "Close the Mash Valve" to stop the flow. The
Fermenters are in a different Room and when visually full, the Brewmeister yells to "Close the Fermenter Valve" to his comely
assistant, who then clicks the Fermenter Valve Closed.

![Label Visible](help_pictures/Label_Visible_Switch.png)

The Label may be shown on the Tab, for example Mash Valve above the Valve Device.

![Mash Valve: the Label above the Valve](help_pictures/Mash_Valve_Label.png)

This is the Plain Text Part of the Suggested Name. Spaces become ~.
BM_15_DO@Valve_E_**Mash~Valve**_BH

## The Interface

The Arduino board this Valve Device is connected to. An Interface has a Name and an ID. The ID is supplied by you when an
Interface is connected. The Interface is the part of the Bridge between the "Brain" and your Mash Valve. The "Brain" cannot supply
the power for the Valve (12 V DC, 24 V or 120 VAC) but only a trigger signal. It takes other pieces of Hardware, and not just one.
There is a Daisy Chain:

![The Daisy Chain: Brain, Arduino, Relay or SSR, Mash Valve](help_pictures/Valve_Daisy_Chain.png)

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

Brain -> Arduino IO (Port) -> Trigger (Brain says Open the Mash Valve) -> 5 V or 3.3 V signal sent to -> Relay or SSR (Hook the
Valve's power Here: 12 V DC, 24 V or 120 VAC) -> Valve Gets Power and Opens

The Interface, Available Ports, Tab, Name and Device Type balloons are the Pump's ([Pump Device Properties](115-pump-device-properties)),
with the valve in the examples: **Mash Valve**, Device Type **DO@Valve_E** (an electric valve on a Digital Out), and the Suggested
Name **BM_15_DO@Valve_E_Mash~Valve_BH**. (Skynet Rule 18.42)

## Properties, from the top

1. The title is the valve (**Skynet Motorized Ball Valve** or **User Defined Motorized Ball Valve**), with the **🔓 lock**,
   **Visible** and **Hidden Locked** beside it, all on one line. Then **Delete · Save · Close · ✕**, which stay in the upper right corner (Rule 2.54).
2. **1. Label ⬆ ⬢** and **Label Visible**. A Label is never blank: leave it empty and it becomes the Name.
3. **2. Interface** and **Available Ports**, greyed out (the board and pin it is wired to).
4. **3. Tab**, **Layer Order** and **4. Name** (the Suggested Name; you may type your own).
5. **Graphic** and **Path**, then **Orientation** and **Toggle** on one line (as on the Pump).
6. **Overlay** with **Database and .API ⬢**.
7. The valve's own settings: **Tap water valve**, **On Close List** and **On Open List**, all three on one line (see [Tap water valves](31-tap-water-valves)).
   On Close List: `close_all_valves` in a Process closes it. On Open List: `open_all_valves` opens it. A tap water valve shows its
   **Tap Water flows** instead, and is always on the Close List and never on the Open List; the knobs of those two switches then show the Do Not Enter sign ⛔ (they can't be changed).
8. **X (Horizontal)**, **Y (Vertical)**, **Width** and **Height** on one line, and the **Device Type** greyed out (**DO@Valve_E**: an electric valve, Valve_E, on a Digital Out, DO; the same DO@Valve_E is in its Suggested Name).

The Suggested Name follows the naming format (Rule 3.1): Interface ID, Port, `Valve_E`, Label, Tab ID, such as
`22_E_Valve_E_MBV1__BR`. Valves added before 2026-11-05 keep their `E_L_Vlv` names (names never change by themselves, Rule 3.5).

## Skynet or User Defined

| | Skynet Motorized Ball Valve | User Defined Motorized Ball Valve |
|---|---|---|
| Path | greyed out: set by its Skynet Template, follows the Orientation | **Path**: your picture, one picture drawn Horizontal (the Overlay shows it open). Skynet turns and mirrors it for the other Orientations. The ⬢ beside Path sets where the In and Out IPs are. **Path (open)** shows only on a valve that already has an open picture |
| Orientation | Horizontal, Vertical Left, Vertical Right (Front and 45 degrees show only on a valve that already sits that way) | Horizontal, Horizontal Flipped, Vertical Left, Vertical Right, all made from your one picture (plain Vertical and the 45s show only on a valve that already sits that way) |
| Toggle and Overlay | yours to pick (they start as On/Off and the steady bolt) | yours to pick |
| Width and Height | its Template's size for each Orientation | 150 x 150 to start |

Settings these dialogs no longer show (Invert, One-shot, Text when on / off, Flip, Service) are kept if a valve already had them.

## One picture, four looks (User Defined)

Give the User Defined Motorized Ball Valve **one picture**, drawn **Horizontal**: the pipe running left to right and the motor on
top. Skynet makes the other looks from it, so you never need a second picture. (Skynet Rule 18.43)

| Orientation | What Skynet does with your picture |
|---|---|
| **Horizontal** | shows it as you drew it |
| **Horizontal Flipped** | mirrors it top to bottom (motor below the pipe) |
| **Vertical Left** | turns it 90 degrees (motor on the left) |
| **Vertical Right** | turns it 90 degrees and mirrors it left to right (motor on the right) |

Your picture file is never changed; it is only drawn turned or mirrored. The In and Out IPs follow the look.

**What picture works best:**

- A plain or see-through background.
- The valve seen straight on from the side, the pipe level across the middle.
- No writing or logo on it: mirroring turns writing backwards.
- Any size: it is fitted into the valve's square box. Use the ⬢ beside **Path** to set where the pipe ends are, if they are not
  at the middle of the left and right sides.
