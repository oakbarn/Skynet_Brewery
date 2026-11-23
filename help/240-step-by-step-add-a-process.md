# Step by Step: Add a Process

A **Process** is a list of jobs that Skynet does for you, one line at a time: set a heater, turn it on, wait for a temperature, hold for a time, ask the brewer to do something. This guide adds a Process to the 3 Vessel sample called **Heat_Strike_Water**. It heats the Hot liquor tank (HLT) to **152 °F**, holds it there for **10 minutes**, asks you to add the strike water, then turns the heater off. Every other Process is written the same way.

> **⚠ A Process does nothing until it is started.** Saving it does not start it. Start it from the Process editor (Step 10), from a **Process Widget** on a Tab (Step 11), or from another Process (`start Heat_Strike_Water`).

Only an Admin can add or change a Process. An operator can start and stop one.

The finished Process:

```
//Heat_Strike_Water
step "Heat the strike water"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.setpoint = 152
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = on
wait HLT_Vessel.BM1w1_1_HLT_BH >= 152
step "Hold"
sleep 10 * skn_const_Ms_p_Min
ask "The strike water is ready"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = off
```

## Step 1. Open the Processes screen

Press **☰ Menu** (top right), then **Processes** (under **Pages**).

You can also get there from **✎ Edit layout**: press **📝 Processes** on the Edit layout bar. **✖ Close** brings you back.

![☰ Menu: Processes](help_pictures/Step_Add_Process_01_Menu_Processes.png)

## Step 2. ➕ Add New Process...

Open the list box at the top of the editor and pick **➕ Add New Process...** (it is first in the list). The **New** button on the left does the same.

![The Process list box](help_pictures/Step_Add_Process_02_Add_New_Process.png)

A box asks for the **New process name**. Type **Heat_Strike_Water** and press **OK**.

- A name has no spaces: a space becomes `_` by itself.
- Do not start it with `skn_`. Names that start `skn_` belong to Skynet (see Step 6).

## Step 3. The new Process

The new Process opens in the editor with its name at the top. Its first line is a comment with its name (`//Heat_Strike_Water`). A comment is a note for people; the Process skips it.

The box next to **Add steps** is its **class**. Skynet guesses it from the name: **Sub** here. A Process for one job, that you start yourself or from another Process, is a Sub. See [Process classes](22-process-language#process-classes).

![The new Process](help_pictures/Step_Add_Process_03_New_Process.png)

## Step 4. Set the heater and turn it on

Type the first lines under the comment:

```
step "Heat the strike water"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH.setpoint = 152
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = on
```

1. `step` names this part of the Process. Skynet numbers the steps when you save; never type the number. See [Steps](22-process-language#steps-scaffolding).
2. `.setpoint = 152` sets the HLT element to 152.
3. `= on` turns it on. It now heats and holds the HLT at its Setpoint.

**Type temperatures in your Units.** With **Settings > Units** on US, `152` is 152 °F; on Metric it is 152 °C. To be sure, add the sign: `152°F` or `66.7°C` is always that. See [Temperatures in a Process](05-scripts#temperatures-in-a-process).

![Set the heater and turn it on](help_pictures/Step_Add_Process_04_Heat.png)

## Step 5. Wait for the temperature

Type the wait:

```
wait HLT_Vessel.BM1w1_1_HLT_BH >= 152
```

`wait` holds the Process on this line until the HLT probe reads 152 or more. Then it goes on to the next line.

While you type, **Predictive text** lists the names that fit. Click one, or press **Enter**, to put it in. **Ctrl+Space** or **💡 Suggest** opens the list any time. See [Predictive text](79-predictive-text).

![Predictive text](help_pictures/Step_Add_Process_05_Wait_Predictive.png)

## Step 6. Hold for 10 minutes: 📐 Constants

A Process counts the time of a `sleep` in milliseconds (1000 is one second). You do not need to work that out: a **Skynet Constant** does it.

Type `step "Hold"` on its own line, then `sleep 10 * ` and press **📐 Constants**. Type **Milliseconds per Minute** in its Find box and click **Milliseconds per Minute** (`skn_const_Ms_p_Min`). It goes in where the cursor is:

```
step "Hold"
sleep 10 * skn_const_Ms_p_Min
```

![📐 Constants](help_pictures/Step_Add_Process_06_Constants.png)

**Skynet names start `skn_`.** Every name that Skynet owns and a Process can read starts `skn_`: the Skynet Constants (`skn_const_L_p_Gal`, Liters per Gallon) and Skynet's own values (`skn_Boil_Temp`, today's boil temperature). You can read them; you can't change them, and none of your own names can start `skn_const_`. See [Skynet Constants](94-skynet-constants).

## Step 7. Ask, then turn the heater off

Type the last two lines:

```
ask "The strike water is ready"
HLT_Vessel.BM_8_DO@H_Element_HLT~element_BH = off
```

`ask` shows a pop-up on every screen with **✔ Done** and waits until an operator or Admin presses it. Then the heater goes off.

![The whole Process](help_pictures/Step_Add_Process_07_Whole_Process.png)

## Step 8. Check

Press **Check**. **No problems found** is what you want. A problem is listed under the editor with its line number, and the number turns red: click the problem to go to its line.

![Check](help_pictures/Step_Add_Process_08_Check.png)

## Step 9. Save

Press **💾 Save**. **✔ Saved** shows, and the steps get their numbers (`S2.00000`, `S2.00001`).

You still see `152`. Behind the scenes Skynet keeps it as `66.6667°C`, so the Process means the same if Units is switched later. Skynet does this in the Background and needs no user input.

![Save](help_pictures/Step_Add_Process_09_Save.png)

## Step 10. Start it, and the Override pop-up

Press **Start**. Next to the Process name you see what it is doing: **waiting (line 5, step S2.00000 Heat the strike water)**. Its line number turns green, and its dot in the list turns yellow.

**The Override pop-up:** after a Process has waited 3 seconds in a `wait` or `sleep`, and no **Override button** is set to it or to **Any**, a small pop-up comes up on top of every screen: **Heat_Strike_Water is waiting**. One press of **Override** moves only this Process on, past the wait or sleep that holds it, for example when you can see the water is hot enough. **✕** hides it on this screen until the Process waits again. See [Override button](96-override-button).

- A wait **inside a loop** never pops up by itself. Add `show_Override` in the Process only where moving on is safe.
- `show_Override "Press when the water is hot"` brings the pop-up up with your own words; `hide_Override` takes it away.

**Stop** stops the Process. **Stop all** (on the left) stops every Process.

![Start: waiting, and the Override pop-up](help_pictures/Step_Add_Process_10_Start.png)

## Step 11. Put it on a Tab: a Process Widget

A **Process Widget** shows a Process on a Tab and starts or stops it with one click (no pop-up first). Add one like any Widget ([Step by Step: Add a Widget](208-step-by-step-add-a-widget)):

1. Go back to the Tab (**Tabs**, or **✖ Close**), then **🛠 Build (Edit layout)**.
2. In **Select Widget Type** pick **On-screen controls**, then in **Add Widget** pick **Process Widget**.

![Select Widget Type and Add Widget](help_pictures/Step_Add_Process_11_Process_Widget_Type.png)

## Step 12. The Process Widget's Properties

The Widget is made on the 🔨 Build Tab and its **Properties** open.

1. **1. Label**: what it says on the Tab, for example **Strike water**.
2. **4. Process**: pick **Heat_Strike_Water**.
3. Press **💾 Save**.

![Process Widget Properties](help_pictures/Step_Add_Process_12_Process_Widget_Properties.png)

**It is not on your Tab yet.** Press **✅ Finish Build ... > Move to Tab**, then **Save layout**, as in [Step by Step: Add a Widget](208-step-by-step-add-a-widget). Out of Edit layout, one click on it starts **Heat_Strike_Water**; it shows **Running**, **Waiting** or **Stopped**, and one more click stops it. Turn on **Ask Before Starting or Stopping** if you want the click to ask first.

## Done

What is left to do:

1. **Try it in the Simulator first**: **☰ Menu > 🧪 Switch to Simulator** runs it with nothing real switched on ([Simulator or real boards](77-simulator-or-real-boards)).
2. **Change it any time**: open it from the list box, change it, **Check** and **💾 Save**. A running Process keeps the old lines until it is started again.
3. **A button of its own**: an **Override button** on a Tab, set to this Process ([Override button](96-override-button)).

More: [Processes](05-scripts), [The Process editor](30-process-editor), [Process language and steps](22-process-language), [Skynet Constants](94-skynet-constants), [Process Widget](173-process-widget), [Override button](96-override-button).
