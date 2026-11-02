# Summary 2 of the project chat

**Covers:** 2026-10-27 16:43Z (where Summary 1 ends) to 2026-11-02 20:25Z.
**Written:** 2026-11-02, at Fritz's request, from the project chat, its threads, the GitHub pull requests and project memory.

**This is a history record only.** For what is true now, use [Skynet Rules](Skynet_Rules.md), not this summary.
Rule 0a still applies: no one reads this summary without Fritz's permission in that chat.

---

## 1. The big picture

In these six days 49 pull requests were merged (#110 to #159, except #113 and #137, which were closed on purpose).
Three PRs are still open (#133, #142, #149). The work moved from "how the panel is built" to "how a brew day runs":
hidden keys and locked names, the gGlobal variable class, a Database and API on every item, the Recipe Tab with
BeerSmith import, the Standard Skynet Brew Process, and a new family of pipe, valve, pump, chiller and alarm pictures
drawn from Fritz's own drawings. Fritz also wrote the General Dialog Rules (Rule 18), which every dialog will follow,
one dialog at a time when he says so.

---

## 2. Main decisions, by subject

### Names, keys and characters
- **Every named item has a hidden key** (Devices, Widgets, variables, Texts, IPs, pipes, Tabs, Processes). The key never
  shows and can't be used in a Process. Renames keep working Processes and history because they follow the key (PR #114).
- **Names lock after the first save** and change only with **✏ Change name** (Rule 3.11). All names follow the same rules,
  Tabs included (PR #138). User Template names and picture paths are the exceptions for now.
- **Blocked characters:** `< > : " / \ | ? *` are refused in every name. Older names were changed once, each bad
  character becoming `~` (PR #134, Rule 3.4).
- **Skynet words are protected:** command words (wait, if, start, show ...) and other Skynet-only words can't be used as
  names. Type names like "Pump" are fine.

### Variables and constants
- **vKonstant / vAPI** became **gKonstant / gAPI** (PR #126), and then both became one class, **gGlobal** (`gG_`, PR #143).
- **Rule 15.2: no backward compatibility.** Old files are converted to the newest standard (with a backup), instead of
  keeping old ways working.
- **gGlobal Kinds** (PR #153, Rule 1.19): a gGlobal is a plain variable, never shown on a Tab. Six Kinds: String (gS_),
  Graphic (gG_), Value (gV_), Boolean (gB_), Time (gT_), DateTime (gD_). The Kind is set once and never changed.
- **Semi_Widgets_Devices** (PR #159): a new class between Widget and Device for Switch, Push Button, Pulse Button, LED and
  the Manual Valve Widget. They can follow a Device ("Device controlled").
- **Skynet Constants** (PR #139, Rule 1.17): 75 fixed conversions named `skc_...` (for example skc_Kg_To_Lb).
- **skn_ and sk_ names** (PR #142, still open): `skn_` = read-only Skynet values such as skn_Boil_Temp; `sk_` = probe roles
  such as sk_Boil_Probe_1.

### Database and outside access
- **Every Device and Widget has a Database box and an .API box** (PR #143, Rule 6.14). Readings are stored with the hidden
  key. `log Name` became `send_db Name`.
- Later, not built yet: an outside database the user picks (own PC or cloud), a "Database Not Available" pop-up, and a
  Voice Name attribute for voice control.

### Building screens
- **Cloned Devices** (PR #115, Rule 4.4): one Device can show on several Tabs. A Clone is the same Device, not a copy.
- **Edit layout bar** (PR #124, Rule 4.5): Device and Widget type lists with shortcut buttons, an Add Device box, turn and
  flip buttons, 8 resize grab points.
- **🔨 To Build Tab** (PR #135): any item can be sent to the Build Tab for work and put back in the same spot.
- **Templates:** Skynet Templates can't be changed by a user (Rule 5.16), Master and Daughter Templates (5.17), and an
  Admin-only **Build Template** screen (PR #132, Rule 5.18). Rotate 90 was retired.
- **Text Widget Properties** is the pattern for dialogs (PR #136, Rule 2.22), with Styles (2.24) and the Image block (2.23).
- **Tab Styles** (PR #145, Rule 2.28), with the Tennyson style on Recipe Tabs. **Hidden_ Tabs** show only in Edit layout
  (PR #146, Rule 2.30).
- **General Dialog Rules = Rule 18** (PR #151): Label first, red ⬆ for a bigger text box, red ⬢ for an attribute pop-up,
  Name never blank, and Cancel warns before throwing away changes (18.11). **Rule 18.10: no dialog is changed to the new
  Rules until Fritz commands it, one at a time.**

### Pipes, valves, pumps and pictures
- **Pipe fittings are only what they are** (PR #130, Rules 5.13-5.15): just position, size and Autosize to pipe.
- **Manual Valve Widget:** changed only by a click on the Tab. A Process that wants it changed waits for the click.
- **IP snap** (PR #127) and **Skynet Motorized Ball Valve** Device Templates H / VL / VR (PR #131).
- **Pipes run only Horizontal, Vertical or 45** and turn only at a fitting (PR #152, Rule 5.19). Kettles flip Horizontal only.
- **Fritz's drawings became pipe Widgets** (PR #156, Rule 5.20): elbows, tees, reducers, front views, Manual Ball Valve
  pictures, Motorized Butterfly and Ball valves. Tees with the purple probe are Temperature Devices. **An IP sits at the
  center of the ferrule's outer face**, or at the center of the opening on a front view.
- **12 brew pump drawings** with IPs on the real ports (PR #150) and **Pump Cover Overlays** in six colors plus a User
  cover (PR #157, Rule 7.13).
- **Copper counterflow chiller** with 4 IPs on the real port tips (PR #155).
- **Alarm Widget** has two kinds: Basic Skynet Alarm (four layers) and User Alarm (PR #154, Rule 7.12). New Alarms follow
  the new standard; old ones are listed in docs/ExistingAlarms.md and change one by one (PR #158, Rule 7.14).
- **Rule 15.3:** old styles are replaced everywhere, and retired files go to the **Delete/** folder, never deleted.

### Processes and brew day
- **Predictive text** in the Process editor (PRs #120, #121): Ctrl+Space or 💡 Suggest offers what fits next.
  Positions are `.x_hPosition` and `.y_vPosition` (Rule 1.15).
- **🔍 Check a Process** (PR #122): a quick practice run that shows errors with a suggested fix.
- **Override button** (PR #141, Rule 2.26): one press lets running Processes move past their current wait.
- **Process Version** YYMMDD_HH_MM_n (PR #146, Rule 2.31).
- **Standard Skynet Brew Process** (PR #144, Rules 6.15 and section 16): seven steps, PreBrew, Heat_Strike, Add_Grain,
  Mash, Boil, Cool, Ferment, each from a Process Template. New commands: `ask`, `close_all_valves`, `open_all_valves`,
  `all_pumps_off`. A Tap Water valve is always closed by "Close all" and never opened by "Open all".
- **Recipe Tab** in Fritz's layout (PRs #147, #148, Rules 17.1-17.10): BeerSmith .bsmx and BeerXML import, `rcp_` fields,
  hop alerts, and the Hops, Grain, Fermentable, Adjuncts, MASH and Waters tabs. Drops and Yeast are still blank.

### Simulator, Schemas and Interfaces
- **One Simulator / Real switch** for the whole panel and an easy Add Interface pop-up (PR #118, Rules 10.4, 10.5).
- **Sample Schemas** (1, 2 and 3 vessels) can be added or cloned from the Schema list (PRs #125, #128, Rules 10.6-10.8).
- The **Simulator bar** can be hidden and starts at 25x with Auto skip each time it is switched on (PR #128).
- **Raspberry Pi GPIO pins** can be an Interface (PR #119, Pi firmware step 1).

### Hardware rules (Arduino Mega)
- **RTD CS pins** only on D14-D17, D22-D39, D41-D43, D47-D49 or D53 (Rule 6.9). On an Ethernet Mega nothing goes on D10
  (6.10), and **SD cards are not supported** (6.11). PR #110.

### Running the program
- **☰ Menu > Close Skynet Brewer** stops the panel and closes the Command Prompt window (PR #140, Rule 2.25). The Command
  Prompt now starts minimized (PR #146). Fritz's own .bat in C:\Brewing needs to be replaced with the new Skynet_Brewer.bat.
- **Releases** now carry the Windows Setup .exe and the install zip (PR #129).

### Importing
- **Rule 15.1: importing always updates to the Skynet way.** Every change an import makes is listed in
  docs/Importing_Norms.md (PR #123).
- The BruControl importer itself is **not started yet**. Fritz will import his own BruControl config once it is built and
  add Rules as errors show up.
- BruControl's gauge styles are paid closed-source parts (DevExpress) and can't be copied. Free gauge libraries exist;
  nothing is built yet.

---

## 3. Rules added or changed in this period

| Rules | Subject |
|---|---|
| 0, 0a | A new chat opens the Rules first; never read a Summary without Fritz's permission |
| 1.13-1.19 | Label, Widget not "element", x_hPosition / y_vPosition, gGlobal, Skynet Constants, skn_ / sk_, gGlobal Kinds |
| 2.17-2.31 | One button style, Show label, picker double-click, grab points, 🗂 Schema, dialog pattern, Image block, Styles, Close Skynet Brewer, Override, User Profile, Tab Styles, About first, Hidden Tabs, Process Version |
| 3.4, 3.5, 3.10-3.13 | Allowed characters, clones follow their parent, hidden keys, locked names, Interfaces easy to add, own-name warning |
| 4.1 (exception), 4.2, 4.4, 4.5 | Build Tab first, Add Device order, Cloned Devices, Edit layout bar |
| 5.5 (kettle exception), 5.13-5.20 | Manual valves, plain fittings, Manual Valve Widget, Templates, Master / Daughter, Build Template, pipe angles, IP location |
| 6.9-6.11, 6.14, 6.15 | RTD CS pins, D10, SD cards, Database and .API, Close all / Open all valves |
| 7.8-7.14 | On overlay, heaters On while Enabled, imagePath_2/_3, Picture Widget, Alarm Widget, Pump Covers, Alarms meet the new standard |
| 10.4-10.8 | Simulator switch, new Schema pretend Mega, Sample Schemas, Simulator bar, clone samples |
| 13.4, 13.6 | Importing Norms, documents easy to open |
| 15.1-15.3 | Importing updates to the Skynet way, no backward compatibility, old style to Delete/ |
| 16.1-16.5 | The Brew Process |
| 17.1-17.10 | The Recipe Tab and its Daughter Tabs |
| 18.1-18.11 | General Dialog Rules |

The next free Help page number is **113** (Rule 11.1 keeps the count).

---

## 4. Pull requests

**Merged:** #110, #111 (Summary 1), #112, #114-#136, #138-#141, #143-#148, #150-#159.

**Closed without merging, on purpose:** #113 (Unresolved PRs document, dropped) and #137 (gauge-style import note; Fritz
expects that rule to change).

**Still open:**

| PR | What | Waiting on |
|---|---|---|
| [#133](https://github.com/oakbarn/Skynet_Brewery/pull/133) | Rich Text Embedded Code: \i \u \s \S \c{Color} \t \F \C \ohm \+- (Help 90) | Fritz's review and merge |
| [#142](https://github.com/oakbarn/Skynet_Brewery/pull/142) | Boil temperature from local air pressure: User Profile, skn_Boil_Temp, probe roles, wait_boil (Help 97) | Fritz's review and merge. The vessel-order step (wait_boil_1 ...) waits until he has looked at it |
| [#149](https://github.com/oakbarn/Skynet_Brewery/pull/149) | **ON HOLD.** Samples use the Skynet Motorized Ball Valve Templates; old valve pictures to Delete/ | Fritz held it until the new pipe Widgets and pipe Temperature Devices landed. They did (PR #156), so it can now be updated to use them, once Fritz says go |

---

## 5. Questions waiting for Fritz

**Decision cards not yet answered**
1. **🔨 To Build Tab:** is the built version what he meant, or did he mean new items can go straight onto any Tab (that
   would change Rule 4.1)? (thread "Build Tab preview and templates")
2. **Other risky characters in names:** allow only letters, digits, `_` and `~` with no leading digit? (thread "Block
   unsafe characters in Device names")
3. **Key-based Process code:** convert names to keys in memory when a Process starts (recommended), or write a hidden file
   per Schema when the editor closes? (thread "Add hidden keys so names can change")
4. **Label never blank (Rule 18.3)** disagrees with Rules 1.13, 3.8 and 4.2. Change those Rules or allow an exception?
5. **Panel version name format:** plain YYMMDD_HH_MM_n, keep the PR prefix, or keep "Skynet-v."?

**Other open questions**
- Should thermocouples use the same Mega CS pin list as RTDs? A Device on D4 won't work on an Ethernet Mega; is that OK?
- "User Process Template" was used instead of "User Bundled Template" (Rule 1.12). Keep it?
- Move the remaining Skynet PNG pictures (pump On, BurnerFlame, AlarmBitter, BigMac, brewery_main) to Delete/?
- Remove the left Process list in the Process editor?
- The old gGlobal switch Kinds were not converted to the new Semi_Widgets_Devices class. Convert them?
- Older open questions in the Rules (numbers 1, 2, 4-11) are still open.

**Things Fritz said he will send**
- The list of Clone Properties for each type.
- His own Alarm bell drawings (Together, Back only, Fore only) plus Set and Active overlays.
- The Drops and Yeast tab layouts for the Recipe Tab, and BeerSmith 3 and 4 sample files.
- The default look for the Override button.

**Waiting for Fritz to say go**
- The BruControl importer.
- The vessel-order hierarchy for boil (wait_boil_1 ...).
- Changing each Device or Widget dialog to Rule 18, one at a time.
- Firmware work and the hardware summary chat (from Summary 1, still "not yet").
