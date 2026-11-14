# Step by Step: Add a Schema

A **Schema** is your whole brewery in Skynet: its Tabs, its boards (Interfaces), its Devices and Widgets, its pipes and its Processes. You can keep many Schemas and load the one you want. Making a new one never changes the Schemas you already have.

This guide takes you from nothing to a new Schema on the screen. Only an Admin can add a Schema.

## Step 1. Open the Add new Schema box

Press **☰ Menu** (top right), then **➕ New Schema…**, just under **🗂 Schema**.

![☰ Menu: New Schema](help_pictures/Step_Add_Schema_01_Menu.png)

Two other ways open the same box:

- **☰ Menu > 🗂 Schema**, then the big **➕ New Schema** button. **❓ Step by step** beside it opens this page.
- The **Schema** dropdown (on the Menu Bar, the Schema tab or the About tab), then **Add new Schema ...** near the bottom of the list.

![The Schema tab: New Schema button](help_pictures/Step_Add_Schema_02_Schema_Tab.png)

If you are in **Edit layout**, save or exit it first.

## Step 2. Give it a name

Type a name that means something to you, for example **My Brewery** or **Hot Side**. Spaces are fine. You can rename it later (Schema dropdown > **Rename this Schema ...**).

![Add new Schema: the name](help_pictures/Step_Add_Schema_03_Add_New_Schema.png)

## Step 3. Pick where it starts from

**Start from** has three choices:

![Start from: the three choices](help_pictures/Step_Add_Schema_04_Start_From.png)

| Choice | Pick it when |
|---|---|
| **A Skynet Schema Template** | You are new, or your brewery is a common 1, 2 or 3 vessel setup. Answer a few questions and Skynet builds the Tabs, Devices and the whole Brew Day for you. **The easiest way to begin.** Go to Step 4. |
| **An empty Schema** | You want to build every part yourself. You get a blank Main Tab, the Equipment Tab and one pretend board. Go to Step 5. |
| **A copy of** the loaded Schema | You want to try changes without touching the Schema you brew with. Press **Save**, and you are done. |

Press **💾 Save**. Skynet asks if it is OK to load the new Schema: every output is switched off first, and the Schema you had stays just as it is. Press **OK**.

## Step 4. A Skynet Schema Template

**4a. The Template, the board and the Tab.** Pick the **Brew House Tab Template** that looks most like your brewery (1 Vessel, 1 Vessel + 1 Pump, 2 Vessel + 1 Pump, 2 Vessel + 2 Pumps, 3 Vessel, or Fermentor only). Pick your **Interface** (your board): each Device takes the next free Port on it. Keep the Tab name **Brew House** or type your own. Press **💾 Save**.

![The Template, the board and the Tab](help_pictures/Step_Add_Schema_05_Template.png)

**4b. The questions.** Each vessel and how it is heated, the pumps, the mash recirculation, the chiller, the valves, the Supply Manifold and the number of fermentors. Each one already has an answer: change only what is different in your brewery. Hover over a box name for help on it. Press **💾 Save**.

![The questions of the 3 Vessel Template](help_pictures/Step_Add_Schema_06_Questions.png)

**4c. Check it.** Skynet lists what it will make: the vessels on each Tab, and every Device with its name and Port. Press **💾 Save** to make it, or **✖ Cancel** to stop (nothing is made).

![Ready to make](help_pictures/Step_Add_Schema_07_Ready.png)

**4d. Done.** The new Schema is loaded, in **🧪 Simulator** mode: nothing real is switched until you press **🔌 Real**. Its vessels, probes, heaters and pumps are on the Brew House Tab, and its fermentors on the Fermentor Tab.

![The new Schema](help_pictures/Step_Add_Schema_08_Done.png)

What is left to do:

1. **Draw the pipes** the way yours are: **☰ Menu > Edit layout > Draw pipe** ([Pipes and hoses](24-pipes-and-hoses)).
2. **Check each job** of the Brew Day in **☰ Menu > Brew Process** ([Brew Process](100-brew-process)).
3. Try a whole Brew Day in the Simulator with **▶ Start Brew Day**.

More about every question: [New Schema from a Skynet Template](157-schema-templates).

## Step 5. An empty Schema

**5a. Your board.** A new empty Schema has no board (Interface) yet. On the **Devices** page press **Add Interface**. Give it a **Name** that means something to you (**✏ Change name**), for example **Hot_Side**, and an **Interface ID** of 1 to 4 letters, for example **HS**. The Interface ID starts the name of every Device on that board. Pick the **Board** you have. Pick **Simulator** for **Connection** until the board is plugged in, fill in **Lost Link (s)** (10 to start), and press **💾 Save**.

![Your new Interface](help_pictures/Step_Add_Schema_10_Interface.png)

More about boards: [Interfaces](76-interfaces) and [Simulator or real boards](77-simulator-or-real-boards).

**5b. Add your first things.** The Main Tab is empty. Press **☰ Menu > ✎ Edit layout**. The bar at the top has a button for each kind of thing: **Vessel**, **Pumps**, **Valves**, **Probe**, **Heating Element** and more. Pick one and fill in its box: the Label (what you call it), the Interface (your board), the Port it is wired to, and the Tab. Then **Save layout**.

![The Edit layout bar](help_pictures/Step_Add_Schema_11_Edit_Layout.png)

More: [The Edit layout bar](82-edit-layout-bar), [Add a vessel](66-add-a-vessel) and [Every Device dialog](148-every-device-dialog).

## Going back to your old Schema

Pick it in the **Schema** dropdown. Every Schema stays on the Brain until you delete it ([Switching and cloning Schemas](48-schema-switching-and-cloning)).
