# BruControl Importer: General Import Rules and Change Patterns (Importer Sandbox)

OakBarn Brewery, 2026-11-15. **On hold**, not built: these wait in the Importer Sandbox until the Importer work starts (Rule 11.3,
Big Merge). They go with `Sandbox/Importer/Interview_Questions.md`.

OakBarn Brewery's own words are below, with spelling fixed only and the numbering kept. Under each one, an **Analyst's Review
Note** says what is already in the Rules or the Importer, what is new, and what clashes.

**Standing rule for the whole Import:** "Do NOT rely on Names of BruControl Elements as I used meaningful names for me. I have
carried that forward to Skynet because I find the way I did names useful. A lot of users might find it difficult to decipher the
suggested name, but the way we set up the Process Editor will make it easier for them to use the suggested name."

> **Analyst's Review Note:** New as a stated Rule. It fits the Import fix approach (fix inside the Importer when possible, otherwise
> an Interview question). A name may give a hint, but the brewer always confirms (see 4).

---

## General Import Rules

**1.** "Create the Import File on the Import Computer First, not on a Pi. Not a Phone or Tablet but a computer. This file will
later be sent to the Brain. The Brain can be a Pi or a Computer. This will be done on the same computer as BruControl. It is likely
that the BruControl user will use his BruControl Computer as the 'Brain'. If he chooses then or later to use a Pi brain, the Import
needs to occur on the BruControl Computer."

> **Analyst's Review Note:** Already the Rule. Rule 15.4: the Importer runs on Windows only, on the same computer as BruControl, and
> hands its file to the Brain (Rule 1.7). New: saying plainly that a Pi, phone or tablet never runs the Import, even when the Brain
> will be a Pi.

**The differences document.** "A detailed Instruction on the Main differences of BruControl and SkyNet that can be downloaded as a
.RTF, .pdf or .txt. Also a Print Button to allow the document to be printed. I will write the first one and we will build on it.
That document will come later."

> **Analyst's Review Note:** New. Waits for OakBarn Brewery's first version. The README and Hover Help notes already kept in
> `Importer_Notes.md` (BruControl vs Skynet differences, the Name and Device Type notes) are a good start for it.

**2.** "An Element that does Not have a displayname, place the Element Name in the Label Field. If in the Import, the Element
Name = the displayname, hard code the Element Name to the Label field. In BruControl the display name is greyed out and the display
name uses the Element Name. Skynet, they are independent of each other."

> **Analyst's Review Note:** Mostly there, one change. The Importer already puts the Element Name in the Label when the displayname
> is blank (Rule 15.4, Importing Norms 5). New: when the Name and the displayname are the same, the Name is written into the Label too.
> Change to check: the Importer's items page today starts each **Label box blank** (2026-11-08) and a tick box copies the
> displayname in. This Rule means the Label box starts **filled**. The items page is changed to match when built.

**3.** "Element Names with spaces: All Spaces replaced with underscore _"

> **Analyst's Review Note:** Already the Rule (Importing Norms 5, Rule 3.4). This is about the **Name**. It does not clash with
> the **Label**: a Label may have spaces, and only in the **Suggested Name** does a Label's space become ~ (Rule 3.1, PR #275).

**4.** "Element Names and Element Type may give a clue to what a BruControl Element may be in Skynet. But the clue is not reliable.
There needs to be a Process where each Element from BruControl is confirmed or set by the User in an Import."

> **Analyst's Review Note:** Partly there. The Importer's drill-down pages already show each item for the brewer to confirm
> (Interfaces, Tabs, items by Interface, vessels). New: **every** Element is confirmed or set by the brewer, including the
> Application Elements and Globals, and a guess from a name is only ever a starting pick.

**5.** "Most Imports get a meaningless key for anything. That would include Interfaces, Workspaces, Elements and so on. The
exceptions are paths for media files."

> **Analyst's Review Note:** Already the Rule. Design Rule #2 (Always use a Meaningless Key) and Rule 3.10 (every item has a hidden
> key). New: saying plainly that media paths are the exception.

**6.** "In Order to build a New Name and Confirm a Label in Skynet, there needs to be an Order of Import Fixes."

> **Analyst's Review Note:** New as an ordered list. It matches the order the Importer's pages already go in (Interfaces, Tabs,
> items); Media and Globals are added to it.

**6.1.** "Interface Names and Type (USB, Ethernet) are imported. SkyNet parses the name to create a Unique Interface id (1 to 4
Char). The user confirms or edits for his own id."

> **Analyst's Review Note:** Already there. Rule 3.2 (1 to 4 characters, starting with a letter, never changed once saved) and the
> Importer's ID page.

**6.1.1.** "The Interface General Type should be in our list of Common Arduino interfaces. If it is not, how does a User import and
add to the list of interface types?"

**6.1.2.** "And if imported, how to load the standard Arduino IDE?"

**6.1.3.** "In the Interface Element below, there are additional issues that may come up with an interface IDE as BruControl created
his own firmware."

> **Analyst's Review Note (6.1.1 to 6.1.3):** Answered in the firmware plan, section **"Questions from the General Import
> Rules"** (`docs/Skynet_Firmware_Plan.md` in the project files; thread "Plan Skynet firmware for all boards"), not yet approved by
> OakBarn Brewery. In short:
> - **6.1.1** A board the Importer can't tell gets the Interview question "Which board is this?". A board not on the list comes in as
>   **Other**, turned Off, with a send-to-support button. Users can't add boards to the list; OakBarn Brewery adds them in updates.
> - **6.1.2** No Arduino IDE is needed. The Importer's last step offers the **Load firmware** page for each board, with a warning that
>   BruControl then stops talking to that board.
> - **6.1.3** A board still on BruControl firmware shows "still has BruControl firmware". An ESP32's WiFi is set again on its
>   Skynet setup page, its IP address is kept, and its port changes from 5000 to 4100. Pins match BruControl Firmware 46 (Rule 6.16).

**6.2.** "Workspaces are created as Tabs, SkyNet parses the name to create a Unique Tab id (1 to 4 Char). The user confirms or edits
for his own id."

> **Analyst's Review Note:** Already there. Rule 3.2 (changed 2026-11-15: Tab IDs are 1 to 4 characters too) and the Importer's Tabs page.

**6.3.** "A means to import a User's media Files (and update the paths for backgrounds for those Elements that have them when they
are fixed for Skynet). It is possible that the User had his media files scattered on his computer. If the Import is done on the
same computer as the BruControl Program, scan the computer for the media files based on the BruControl path and import them."

> **Analyst's Review Note:** Partly there. The Importer already looks for each picture and sound at its BruControl path and can copy
> them (never move them) into `media/Images/User` and `media/sounds/User` (Importing Norms 9). New: when a file is **not** at its
> path, search the computer for it by its file name. Copyright still applies (Rule 9.12): the brewer's own files stay on their own
> Brain and never ship with Skynet.

**6.4.** "Later, when fixing the new Paths for an imported Element (Device or Widget), any missing media files."

> **Analyst's Review Note:** Partly there. Missing files are listed in the Import notes today, with their path kept. New: a step
> where the brewer fixes each missing file (pick the file, or leave it blank).

**6.5.** "Importing Globals Always ask the User about Each Element imported to Confirm or set Skynet type. Always ask about API (send
to data base) for any globals after any labels, names of types confirmations. Look to see if it was used as a variable where the
value or state was set in a Process, and if the scope was Global (in different processes). The API will always be the last
Confirmation of the User Import Process for any Element Imported. In addition, also look if the Global was used as a variable in a
process."

> **Analyst's Review Note:** Partly there. Importing Norms 6c already asks the brewer about Globals. New: ask about **every** Global;
> the Importer reads the Scripts to see where each one is set and in how many Processes; the **API question is always the last one**
> for every Element.
> **Clash with Rule 1.33** ("A gGlobal has no Database and no .API ... a Process sends it to the database with `send_db Name`").
> For an Element that stays a **gGlobal**, the "API (send to database)" question cannot set .API. See the question at the end.

**6.5.1.** "Always ask the user if the Global was used for talking to the Database only or was used to display something on a
Workspace as well. A good example were my Hop Fields in the OakBarn Brewery. They were used for the Node_Red API, but were also
displayed in the Batch Workspace."

> **Analyst's Review Note:** New question, fits Importing Norms 6c (a Widget takes the Global's spot on the Tab).

**6.5.2.** "You could not create a Global in BruControl except by placing it on a Workspace. A good hint as to if it was just used
as a Variable with global scope would be if the visibility = hiddenlocked. It was almost always a variable then."

> **Analyst's Review Note:** New hint. A HiddenLocked Global starts with "Only a variable (gGlobal)" picked; the brewer confirms.

**6.5.3.** "I created a Lot of globals on a Workspace that was simply to have a Place for them. All of those globals were only
variables. The scope can only be determined by the use in scripts. The main reason I used Globals versus a standard variable was
not only the global scope, but because a Global was not volatile and the values were stored, even if the computer was shut down.
Regular variables were volatile."

> **Analyst's Review Note:** Already matched by Rule 1.22 / 1.33: a gGlobal is Persistent and Non-Volatile. New hint: a Workspace
> that holds only Globals (like a "Globals" Workspace) is a place, not a screen: its Globals start as "Only a variable".

**6.5.4.** *(blank: waiting for OakBarn Brewery)*

**6.5.5.** "Check if there are Backgrounds paths filled. If So, ask user if it was used for:"
- **1. Has a Media File (Picture)**
  - 1. Used as a Global Scope Variable in addition to 1 above.
  - 2. Wanted in the Database and csv exports.
    - 1. If 1 only, turn into a Picture Widget.
    - 2. If a or b, create a gGlobal or the type (value, string, boolean, Time, DateTime.)
    - 3. If b, set .API to true for the new gGlobal.
- **2. No Media Files**
  - 1. *(blank)*
  - 2. *(blank)*
  - 3. String Type used to display Text on a Workspace, Convert to Text Widget.
  - 4. Value Type, used to display a Value on a Workspace, Convert to Value Widget.
  - 5. *(blank)*

> **Analyst's Review Note:** Mostly fits Importing Norms 6c (String with a picture becomes a Graphic; a Global on a Workspace gets
> a Text, Picture or Value Widget in its spot). Three things to confirm:
> - "If a or b" most likely means **1.1 or 1.2** (a global variable, or wanted in the Database). To confirm.
> - "set .API to true for the new gGlobal" clashes with **Rule 1.33** (see 6.5).
> - Items 2.1, 2.2, 2.5 and 6.5.4 are blank: to be filled in, or left out.

**7.** *(blank: waiting for OakBarn Brewery)*

---

## Change Patterns

OakBarn Brewery will send changes to Globals, Devices and Widgets in the Skynet sample (OakBarn Brewery, 2026-11-15: "Keep track of
the pattern so when we create the BruControl Import, we can follow a pattern. I will tell you what the pattern is."). Each pattern
is named by OakBarn Brewery and written here, so the Importer does the same change. A pattern never relies on a BruControl Element
name (Standing rule above): it goes by what the Element is, how it is set up, and how the Scripts use it.

| # | Pattern name (OakBarn Brewery's) | BruControl Element (what it is, never its name) | Becomes in Skynet | Interview question, if any | Date / thread |
|---|---|---|---|---|---|
| | *(none yet)* | | | | |
