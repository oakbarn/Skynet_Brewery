# Step by Step: Add a Device

A **Device** is a thing wired to a Port (a pin) on one of your boards: a pump, a valve, a heating element, a probe, a switch. This guide adds a new pump to the **Brew House** Tab of the 3 Vessel sample: a **Blichmann RipTide** called **Wort pump** on Port **D14** of the **Brewery Mega** board. Every other Device is added the same way.

> **⚠ A new Device is made on the 🔨 Build Tab, not on your Tab.** It stays there until you press **✅ Finish Build ... > Move to Tab** (Step 10). Until then it is not on any of your Tabs and it does nothing on Brew Day. Do not stop after **💾 Save**.

Only an Admin can add a Device.

## Step 1. Open Edit layout

Press **☰ Menu** (top right), then **✎ Edit layout**. The Edit layout bar opens above the Tab.

![☰ Menu: Edit layout](help_pictures/Step_Add_Device_01_Edit_Layout.png)

## Step 2. Pick the kind of Device

On the Edit layout bar, pick the kind in **Select Device Type** (here **Pumps**), then pick the Device in **Add Device** (here **Pump, on / off (relay or SSR)**).

The shortcut lists next to it (**Pumps**, **Valves/Equipment**, **Probe**, **Heating Element**, **PWM**) do the same in one pick.

![Select Device Type and Add Device](help_pictures/Step_Add_Device_02_Device_Type.png)

The **🔨 Build Tab** opens by itself. Everything new is made there first, away from a busy Tab (see [Build Tab](55-build-tab)).

## Step 3. Pick the model

Some Devices ask which one you have. For a pump, pick it in **Pick the pump** (here **Blichmann Riptide**). Its picture comes with it.

![Pick the pump](help_pictures/Step_Add_Device_03_Pick.png)

## Step 4. 1. Label

Type the **Label**: what you call it, in plain words, for example **Wort pump**. **Label Visible** shows the Label on the Tab; it starts off.

![1. Label](help_pictures/Step_Add_Device_04_Label.png)

## Step 5. 2. Interface and Port

**2. Interface** is the board it is wired to (here **BM: Brewery Mega**). **Available Ports** lists only the free Ports that fit this Device. Pick the one it is wired to (here **D14**).

A box asks you to check them: **once confirmed, the Interface and Port can't be changed.** Press **✔ Confirm**, or **◀ Back** to pick again.

![Review: Interface and Port](help_pictures/Step_Add_Device_05_Port.png)

No board yet? **➕ Add new Interface…** in the list makes one and comes back (see [Interfaces](76-interfaces)).

## Step 6. 3. Tab and 4. Name

**3. Tab** is the Tab it goes to when the build is done (here **BH: Brew House**). **➕ Add new Tab…** makes a new Tab and comes back.

**4. Name** fills itself in: the board, the Port, the kind, the Label and the Tab, for example `BM_14_DO@Pump_Wort~pump_BH`. Keep it, or type your own (see [Interface, Tab and Device names](46-interface-tab-device-names)).

![3. Tab and 4. Name](help_pictures/Step_Add_Device_06_Tab_Name.png)

## Step 7. Look over the rest, then Add Device

The rest of the box has the Device's own settings (for a pump: Pump Profile, Orientation, Hose or Pipe, Cover, Overlay, the IP Fittings, and where it sits). Each one has Hover Help: hold the mouse over its name. You can change all of them later.

Press **➕ Add Device**.

![Add Device](help_pictures/Step_Add_Device_07_Add_Device.png)

## Step 8. Its Properties, then Save

The Device is made on the 🔨 Build Tab and its **Properties** open. Change anything you want, then press **💾 Save**.

![Properties: Save](help_pictures/Step_Add_Device_08_Properties.png)

## Step 9. It is on the Build Tab: place it

The new Device is on the 🔨 Build Tab. The faint drawing behind it is the Tab it goes to (the **Watermark**, "Goes to: Brew House"). Drag it to the spot you want: **where it sits on the Build Tab is where it lands on its Tab.** **👁 Preview** shows how it will look on Brew Day.

**It is not on Brew House yet.** Press **✅ Finish Build ...**.

![The Build Tab: Finish Build](help_pictures/Step_Add_Device_09_Build_Tab.png)

## Step 10. ✅ Finish Build ... > Move to Tab

The **Finish Build** box asks where it should go. Under **Move to Tab**, the Tab you picked in Step 6 is already picked (**Brew House**). Press **Move to Tab**.

![Finish Build: Move to Tab](help_pictures/Step_Add_Device_10_Finish_Build.png)

Everything on the Build Tab moves to that Tab, and the Build Tab closes. The other choices: **As a Template** (not for Devices), **Throw it away** (deletes it and frees its Port), **Keep building**.

## Step 11. Save layout

You are on the Brew House Tab. The new pump is in its spot and **glows red until you click it**, so it is easy to find. Press **Save layout** to keep it.

![Save layout](help_pictures/Step_Add_Device_11_Save_Layout.png)

## Step 12. Done

Press **Exit** to leave Edit layout. The Wort pump is on the Brew House Tab.

![The new pump on Brew House](help_pictures/Step_Add_Device_12_Done.png)

What is left to do:

1. **Draw its pipes or hoses**: **🛠 Build (Edit layout) > Draw pipe** ([Pipes and hoses](24-pipes-and-hoses)).
2. **Change it any time**: in Edit layout, double-click it to open its Properties.

## If you stopped before Finish Build

An unfinished Build is never lost: it is kept on the Brain, it is never run, and its Port stays taken. The next time you open **Edit layout**, it comes back on the 🔨 Build Tab with a note. Press **✅ Finish Build ...** to send it to its Tab, or **🗑 Discard Build** to throw it away. See [Saving never ends the Build](55-build-tab#saving-never-ends-the-build).

More: [Devices](03-devices), [Build Tab](55-build-tab), [Pump Device Properties](115-pump-device-properties), [Step by Step: Add a Widget](208-step-by-step-add-a-widget).
