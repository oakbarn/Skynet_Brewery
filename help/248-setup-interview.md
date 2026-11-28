# Setup Interview

The **Setup Interview** sets your Skynet settings, one question at a time (Skynet Rule 2.75). It opens by itself the first time an
Admin opens a new installation (no Skynet settings saved yet), before the Welcome page that offers a sample Schema. An Admin can run it
again any time from **☰ Menu > 🧭 Setup Interview**.

## How it works

The buttons, the title and the steps strip are frozen at the top: only the page under them scrolls.

- One question per page, with a short explanation under it. The steps strip at the top shows where you are, in 7 steps:
  **1. Units · 2. Brewer Type · 3. Brewery · 4. Interface · 5. Other Defaults · 6. Recipe Defaults · 7. Help Language**. The Done page comes after the last question; it is not in the strip.
- **◀ Back** goes to the question before. **Next ▶** keeps your answer and goes on. A choice of 6 or fewer is a box: one click picks
  it and goes on. A choice of more than 6 is a dropdown (Rule 2.6).
- Only the first two steps must be answered: **US or Metric** (always the first question) and **Brewer Type**. Until one of them is
  answered, its **Skip** and **Next ▶** have the ⛔ Do Not Enter sign and do nothing: click an answer. Once it is answered, Skip keeps
  your answer and goes on. **◀ Back** always works (not on the Welcome page: nothing is before it).
- Step 4 **Interface** comes right after the Brewery: its first question decides which Interface questions follow (see the table).
- Steps 3 **Brewery**, 5 **Other Defaults** and 6 **Recipe Defaults** are branches. Each one opens on a page that lists what it asks.
  **Next ▶** starts it. **Skip** on that page skips the whole branch and keeps Skynet's own answers. Inside a branch, each question
  has its own **Skip**.
- Step 7 **Help Language** is one question with its own **Skip** (English).
- **Skip** keeps Skynet's own answer and goes on, and the question stays not green. Skynet does not remind you later.
- A question turns **green** when you answer it (Next). A step turns green when every question in it is answered. Click a step to go
  to it.
- The interview opens on the first question that is not green. **Next ▶** and **Skip** always go to the very next question, in
  order, even one already answered (green): no question is ever skipped for you.
- Every page starts on Skynet's own answer (or on your saved answer when you run it again), so Next, Next, Next gives a working panel.
- **Question 1, US or Metric**, starts with a few words about Units (all data is kept in metric inside; only what you see or
  enter changes), then "And now for that 1st Question: US or Metric Units? Choose One." as two **Tick Boxes**. A tick does not go
  on: every **Next ▶** has the ⛔ until one is ticked.
- **Every answer is saved the moment you give it** (Next, or a click on a choice), on the Brain, like a gGlobal: it stays even if
  your computer is shut down. Run the interview again and it opens on the first question not answered yet.
- The last page, **Done**, shows every answer. **✎** goes back to that question. **✔ Finish** saves them all.
- **Close** or **✕**:
  - on every screen, the Welcome page too, they have the ⛔ Do Not Enter sign and do nothing until 1. Units and 2. Brewer Type are
    answered (Esc does nothing either). Every step of the strip has the ⛔ too until then.
  - after that, when some questions are not green yet, a **blue** pop-up says: they do need completing; setting up Skynet depends
    on the answers to many of these questions to make it your own, but it will work with just the first 2 questions. **◀ Keep
    answering** goes back; **Close** saves the answers so far and closes. Run it again from ☰ Menu to answer the rest.

## The first six screens

Every run starts with six screens before the first question. **Next ▶** (at the top, or after **Click to proceed:**) or **Skip**
goes on; **◀ Back** goes to the screen before.

1. **Welcome**: see below.
2. **The button guide**: each button at the top, as it looks, and what it does, with the ⛔ ones (Skip and Next ▶ on 1. Units and
   2. Brewer Type until answered; Close and ✕ until 1 and 2 are answered).
3. **How to answer**: questions are answered in two methods. The first is a **Tick Box** ("Are you a morning person?"), shown before
   and after a click; you can try the first row.
4. **How to answer, the second method**: a **Drop Down list** ("Favorite Ice Cream?"), shown closed, open and with Chocolate picked;
   you can try the first one. It limits your choices: sometimes there is an Other choice for something not on the list; if not,
   choose the best or closest answer. Both samples are also in [Getting started](01-getting-started).
5. **Hot Spots**: the steps strip at the top is all Hot Spots: click a step to go to it. The sample strip on this screen can be
   tried: click a step (it starts on 5. Other Defaults) and the screen shows below how that step's page looks.
6. **Let's get to the Interview**: the interview starts with two easy questions. There
   are no bad answers: take your best guess, but the more accurate you are, the more Skynet's screens look like YOUR Brewery. It
   also says that Skynet has "canned" Processes for the Brew Day, from Step by Step coaching to an automated Brewery, and that the
   coding they need is meant to be a ladder, not a mountain.

## The Welcome page

The interview always opens on a **Welcome** page. Its blue box is the one note about phones and small
screens: Skynet may be controlled from almost any device with a browser and internet connection, but it is much easier to design
on a computer, because finer details are hard to see on a small screen. Under it, the page says what the interview is: nothing is
written in stone, every answer can be changed any time on **☰ Menu > Default settings**, and you can run the interview again from
☰ Menu. Its **◀ Back** has the ⛔ (nothing is before it). **◀ Back** on the first
question comes back to the Let's get to the Interview screen.

## The questions

| Step | Question | What it sets | Skynet's answer |
|---|---|---|---|
| 1 | **US or Metric?** (must be answered) | Units: what every amount, temperature and Recipe shows in. Skynet keeps every number in metric inside (Rule 2.59), so changing it never changes a saved number | US |
| 2 | **What type of Brewer are you now?** (must be answered) | Six **Tick Boxes** on one screen: Extract Kit, Extract Brewer add Own Hops, BIAB (Brew in a Bag), All In One Brewer, All Grain, All Grain Mill own Grain. This is your Brewer Type. It is simply an aid to make the Panel look like YOUR Brewery, and it does not restrict any tool: even a novice brewer can build a complicated automated system. Choose the one that best fits you, or the next level if you are ready. Every Next has the ⛔ until a box is ticked. The No Recipe Found pop-up starts on it (Rule 16.14) | All Grain |
| 3 Brewery | **Number of Hot Side Vessels** (the first Brewery question, for every Brewer Type): a box where you type a whole number from **1 to 6** (more would not fit on a Tab with Gauges you can read). Count the Kettles, Mash Tuns and HLT, not the fermentors. The questions after it branch on the number: 1, 2, or 3 or more. For now the only other Brewery question is **How is the vessel heated?** (below); the rest (All In One, outlet, pump, how many pumps, HERMS or RIMS, All Grain Plus) are on Default settings | With the Default settings answers it works out your **Brewer Level**, from 1 Stove Top, One Pot, No Outlet up to 9 All Grain Plus | 7 Three Vessel |
| 3 Brewery | **How is the vessel heated?** (only with 1 vessel) | Seven **Tick Boxes**: No Boil Brewer, Electric Stove Top, Gas Stove Top, Hot Plate, Turkey Fryer, Brewery Gas Burner, Internal Electric Element. Also on Default settings | not set |
| 3 Brewery | **Single Vessel Brewer: Choose the Vessel that matches yours:** (only with 1 vessel and **No Boil Brewer**) | Three pictures of Skynet Vessel Templates, each with plain words under it: **Plain Pot**, **Pot with 1.5 TC Outlet**, **Pot with NPT Outlet**. Click the one like yours (it lights up), then **Next ▶**. **Other Skynet Template** opens every other Skynet Vessel Template, each with its plain words under it. Also on Default settings | not set |
| 3 Brewery | **Electric Stove Top Brewer: Choose the Vessel that matches yours:** (only with 1 vessel and **Electric Stove Top**) | Two pictures of Skynet Vessel Templates with plain words under them: **Kettle on an Electric Stove** and **Kettle with a Ball Valve on an Electric Stove**. Click the one like yours, then **Next ▶**. **Other Skynet Template** opens every other one. Also on Default settings | not set |
| 3 Brewery | **Choose the Vessel that matches yours:** for the other ways to heat one vessel | **Gas Stove Top Brewer**: Kettle on a Gas Stove, Kettle with a Ball Valve on a Gas Stove. **Hot Plate Brewer**: Plain Pot, Pot with 1.5 TC Outlet, Pot with NPT Outlet. **Turkey Fryer Brewer**: the same pots and a Kettle with Outlet, Thermowell and Side Inlet. **Brewery Gas Burner Brewer**: Basic, Tall and Wide Kettles, Kettle with Bottom Drain, Kettle with Steam Slayer; your build also gets a **Gas Burner** and a **Burner Igniter**. **Internal Electric Element Brewer**: only kettles with an Element Port and a Thermowell; your build also gets a **Heating Element** and a **Temperature Probe**. The goal at the end of the interview is to find the Sample Brewery that best matches your answers | not set |
| 3 Brewery | **Size of your Vessel: Measure the inside of your vessel:** (1 vessel, every way to heat it, after the vessel) | Boxes for the **Inside Diameter** and **Inside Height** (inches or cm), the **Purported Volume** (what it is sold as) and the **Dead Space** (what stays in it) if you know it, in gallons or liters. An Internal Electric Element vessel also asks how far it is from the **Top of the vessel down to the top of the element**: Skynet works out the **Safe Element Volume** from it (the liquid that covers the element, plus 1 inch as a buffer). Skynet works out the Volume from Diameter and Height and shows it as you type; it draws your vessel to size. Skip keeps the Template's own size. Also on Default settings | not set |
| 3 Brewery | **Vessel 1 of 2, then Vessel 2 of 2** (2 vessels) | For each vessel, one after the other: **How is the vessel heated?** (Tick Boxes: Electric Stove Top, Gas Stove Top, Hot Plate, Turkey Fryer, Brewery Gas Burner, Internal Electric Element, No Heat (a cooler Mash Tun); No Boil Brewer is only for one vessel), **What is it used for?** (Boil Kettle (BK), Hot Liquor Tank (HLT), BK and HLT, Mash Tun (MLT)), **Does it have any of these?** (Tangential Inlet, Steam Slayer, Sparge Arm, Sight Glass, Bottom Drain with Skirt, Temperature Probe: tick every one it has, or none, and pick **Where on the vessel** each one is: the same 10 places on the Front and on the Back, from High Right down to Low Left; a Sight Glass is on the Right or the Left only; a Bottom Drain with Skirt is always under the center, so there is nothing to pick. **📐 Vessel Layout** pops up a sample vessel with every place, and the ones you ticked filled in), then **Choose the Vessel that matches** (up to 6 pictures: only the vessels that fit what it is used for, how it is heated and every part you ticked; when none has them all, the closest, and the note says so; Other Skynet Template has every one) and the **Size** of that vessel. A Brewery Gas Burner adds a burner and igniter, an Internal Electric Element adds an element and a probe. Also on Default settings | not set |
| 3 Brewery | **Cold Side: Number of Fermentors** (every Brewer Type, after the Hot Side) | A box for a whole number from **1 to 9**. Then for each fermentor, one after the other: **What kind of fermentor?** (a picture over each Tick Box: Plastic Bucket (where most people start), Conical, Unitank, Stainless Bucket, Glass Carboy, Plastic Carboy, Corny Keg, Other (any fermentor not in the list: every way to cool it is offered), and on a second row Stainless Conical Bucket, Plastic Pressure Conical, Plastic Pressure Fermentor, Ceramic Crock and Plastic Jug with Tap), then **How is it cooled?** with only the ways that fit that kind (Not Cooled, Fermentation Chamber, Peltier, Manual Ice Bath, Glycol Coil, Glycol Jacket; a Fermentation Chamber and Peltier are always there). Also on Default settings | not set |
| Default settings (not asked for now) | **Is your brewery a Piped Manifold?** | Yes: your vessels and pumps are joined by fixed pipes and valves, like the 3 Vessel sample. No: you move hoses by hand. The **Piped Manifold** switch on Default settings | No |
| Default settings (not asked for now) | **Pipe size** and **Hose size** (only after Piped Manifold Yes) | The size a new pipe or hose starts at | 1/2" |
| 4 Interface | **How automated is your brewery?** (first in the Interface step) | Four Tick Boxes on one row: **No Automation**, **New to IoT Arduino**, **Know IoT Brewery not Wired**, **Brewery Wired**. No Automation skips the rest of the Interface step. New to IoT Arduino gets the **Read Me**, then the **Plan**. Know IoT Brewery not Wired gets the **Plan**. Brewery Wired goes straight to How many Interfaces. Also on Default settings | not set |
| 4 Interface | **Read Me** and **Plan** (pages to read) | Next ▶ goes on | |
| 4 Interface | **How many Interfaces** (every answer but No Automation) | A box for a whole number from **1 to 9**: the boards (such as an Arduino Mega, an ESP32 or a Raspberry Pi) you have, or plan to have. Also on Default settings | not set |
| 5 Other Defaults | **Brewery Name** (Patrons only) | The name at the top of every Tab | Skynet Panel |
| 5 Other Defaults | **Airport** | The airport (ICAO code, for example KDFW) whose weather report gives the air pressure for the boil temperature. **Test** fetches it now | empty: standard air |
| 5 Other Defaults | **Elevation** | How high your brewery is, in feet (US) or meters (Metric); kept in meters | empty |
| 6 Recipe Defaults | **Yeast Starter** | Information only: PreBrew reminds you a day or two ahead | No |
| 6 Recipe Defaults | **Batch Size** | How much beer a new Recipe makes, into the fermenter, in gallons (US) or liters (Metric); kept in liters | 5 gallons (18.9 liters) |
| 6 Recipe Defaults | **Mash Profile** (All Grain only) and **Boil Profile** | The Profiles a new Recipe starts with | Single Step, Batch Sparge and Skynet's 60 minute Boil Profile |
| 7 Help Language | **Help language** | English or French for the Help pages and balloons, in this browser. Once a User Language is on this Brain (? Help > 🌐 Languages), it is a choice too | English |

**Tick Boxes after Brewery**: every question from 4 Interface on with Yes/No or **up to 8** choices is **Tick Boxes** (Yeast Starter, Boil Profile, Help language, and Mash Profile while it has 8 or fewer); more than 8 is a **Drop Down list**. The dialog is wide enough for 8 Tick Boxes on one line. A label may wrap to up to 4 lines. A tick does not go on: Next ▶ (or Click to proceed) does, and it has the ⛔ until a box is ticked. These questions are not a must, so **Skip** works, and the line "Skip keeps Skynet's answer" under the boxes says what Skip keeps. Typed answers (Airport, Elevation, Batch Size) stay boxes you type in.

The Recipe Defaults step only sets what a new Recipe starts with. A Brew Day asks about its own Recipe in the **Recipe Interview**.

## The Brewer Levels

Each level has everything the level below has. The Brewery Vessels questions (in the interview and on Default settings) work it out.

1. **Stove Top, One Pot, No Outlet**: one kettle on the stove; you pour or siphon.
2. **Stove Top, One Pot, Manual Outlet**: one kettle with a ball valve low on the side.
3. **Stove Top with Pump**: a stove top kettle and one pump.
4. **All In One**: one electric vessel with a basket and a pump built in.
5. **Two Vessel, One Pump**: a Mash Tun (it may be a cooler) and a Kettle.
6. **Two Vessel, Two Pumps**.
7. **Three Vessel**: HLT, Mash Tun and Kettle, one pump.
8. **Three Vessel, Recirculating**: HERMS or RIMS, two pumps, motorized valves.
9. **All Grain Plus**: three or more vessels, controlled fermentors, motorized valves, a tap water Supply Manifold.

The New Schema Interview starts a new Brewing Tab on the Level that fits your Brewer Level.

## Where the answers are kept

Every answer is on **☰ Menu > Default settings** too (Rule 2.42), the same saved value: change it there any time. The Help language
is also on the **?** Help window. Running the Setup Interview again starts on your saved answers and on the first question that is
not green; it changes nothing until ✔ Finish (or Close, which saves the answers so far).

**The Brewery Build.** The Brewery answers (Number of Hot Side Vessels, How is the vessel heated?, Single Vessel Brewer and the ones
after them) are also kept together as your **Brewery Build**, with the Brewer Level they give. Only the answers that fit go in: with
three vessels, How is the vessel heated? (a one vessel question) is left out. At the end of the interview the Brewery Build is used
to offer the Templates that match your brewery, or to build one from your answers. Changing a Brewery answer on Default settings
changes the Brewery Build too.
