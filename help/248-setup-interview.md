# Setup Interview

The **Setup Interview** sets your Skynet settings, one question at a time (Skynet Rule 2.75). It opens by itself the first time an
Admin opens a new installation (no Skynet settings saved yet), before the Welcome page that offers a sample Schema. An Admin can run it
again any time from **☰ Menu > 🧭 Setup Interview**.

## How it works

The buttons, the title and the steps strip are frozen at the top: only the page under them scrolls.

- One question per page, with a short explanation under it. The steps strip at the top shows where you are, in 6 steps:
  **1. Units · 2. Brewer Type · 3. Brewery · 4. Other Defaults · 5. Recipe Defaults · 6. Help Language**. The Done page comes after the last question; it is not in the strip.
- **◀ Back** goes to the question before. **Next ▶** keeps your answer and goes on. A choice of 6 or fewer is a box: one click picks
  it and goes on. A choice of more than 6 is a dropdown (Rule 2.6).
- Only the first two steps must be answered: **US or Metric** (always the first question) and **Brewer Type**. Until one of them is
  answered, its **Skip** and **Next ▶** have the ⛔ Do Not Enter sign and do nothing: click an answer. Once it is answered, Skip keeps
  your answer and goes on. **◀ Back** always works (not on the Welcome page: nothing is before it).
- Steps 3 **Brewery**, 4 **Other Defaults** and 5 **Recipe Defaults** are branches. Each one opens on a page that lists what it asks.
  **Next ▶** starts it. **Skip** on that page skips the whole branch and keeps Skynet's own answers. Inside a branch, each question
  has its own **Skip**.
- Step 6 **Help Language** is one question with its own **Skip** (English).
- **Skip** keeps Skynet's own answer and goes on, and the question stays not green. Skynet does not remind you later.
- A question turns **green** when you answer it (Next). A step turns green when every question in it is answered. Click a step to go
  to it.
- The interview opens on the first question that is not green, and **Next ▶** goes on to the next one that is not green, in order.
  Answered (green) questions do not take your turn again; click their step, or **✎** on Done, to change one.
- Every page starts on Skynet's own answer (or on your saved answer when you run it again), so Next, Next, Next gives a working panel.
- **Every answer is saved the moment you give it** (Next, or a click on a choice), on the Brain, like a gGlobal: it stays even if
  your computer is shut down. Run the interview again and it opens on the first question not answered yet.
- The last page, **Done**, shows every answer. **✎** goes back to that question. **✔ Finish** saves them all.
- **Close** or **✕**:
  - on every screen, the Welcome page too, they have the ⛔ Do Not Enter sign and do nothing until 1. Units and 2. Brewer Type are
    answered (Esc does nothing either). Steps 3 to 6 of the strip have the ⛔ too until then.
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
   tried: click a step (it starts on 4. Other Defaults) and the screen shows below how that step's page looks.
6. **Let's get to the Interview**: the interview starts with two easy questions (and a follow-up after some Brewer Types). There
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
| 2 | **What is the highest level you will brew now?** (must be answered) | Your Brewer Type: Extract Can Kit, Extract Partial Grain and Hops, or All Grain. This is just to get started: Skynet can grow with you. The No Recipe Found pop-up starts on it (Rule 16.14) | All Grain |
| 2 | **Do you grind your own grain?** (only after All Grain) | Yes: All Grain (own Grain Mill) | No |
| 3 Brewery | **Brewery Vessels**: how many brewing vessels, then (by the answer) All In One, outlet, pump, how many pumps, HERMS or RIMS, All Grain Plus | They work out your **Brewer Level**, from 1 Stove Top, One Pot, No Outlet up to 9 All Grain Plus | 7 Three Vessel |
| 3 Brewery | **Is your brewery a Piped Manifold?** | Yes: your vessels and pumps are joined by fixed pipes and valves, like the 3 Vessel sample. No: you move hoses by hand. The **Piped Manifold** switch on Default settings | No |
| 3 Brewery | **Pipe size** and **Hose size** (only after Piped Manifold Yes) | The size a new pipe or hose starts at | 1/2" |
| 4 Other Defaults | **Brewery Name** (Patrons only) | The name at the top of every Tab | Skynet Panel |
| 4 Other Defaults | **Airport** | The airport (ICAO code, for example KDFW) whose weather report gives the air pressure for the boil temperature. **Test** fetches it now | empty: standard air |
| 4 Other Defaults | **Elevation** | How high your brewery is, in feet (US) or meters (Metric); kept in meters | empty |
| 5 Recipe Defaults | **Yeast Starter** | Information only: PreBrew reminds you a day or two ahead | No |
| 5 Recipe Defaults | **Batch Size** | How much beer a new Recipe makes, into the fermenter, in gallons (US) or liters (Metric); kept in liters | 5 gallons (18.9 liters) |
| 5 Recipe Defaults | **Mash Profile** (All Grain only) and **Boil Profile** | The Profiles a new Recipe starts with | Single Step, Batch Sparge and Skynet's 60 minute Boil Profile |
| 6 Help Language | **Help language** | English or French for the Help pages and balloons, in this browser. Once a User Language is on this Brain (? Help > 🌐 Languages), it is a choice too | English |

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
