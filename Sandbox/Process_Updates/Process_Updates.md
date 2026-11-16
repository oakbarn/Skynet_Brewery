# Process Updates Sandbox: Skynet Process ideas, parked for later

Kept here until the **Skynet Processes are set up** (OakBarn Brewery, 2026-11-16: "WE will do that later when we start the Skynet
Process setup. New sand Box for Process and put things there till we build those Processes"). Rule 14.5.

Any idea for a Brew Day step, a sample Process or a Process command given before then is written here, with where it goes, and is
**not built yet**. When the Skynet Process setup starts, OakBarn Brewery picks which entries to start, and each one is checked against
the Rules (and both programs) before it is built. An entry that is built is moved to the **Done** table with its PR.

General Panel ideas go to the Panel Updates Sandbox, `Sandbox/Panel_Updates/Panel_Updates.md` (Rule 14.4). Importer-only notes go to
the Importer Sandbox (Rule 11.3). OakBarn Brewery's OakBarn Schema Scripts are read only with his permission.

The panel does not use this folder, and it is left out of the release zip and the installer.

## Waiting

| # | Date | Where it goes | The update | Notes from Claude (what is there now, questions) | Asked in |
|---|---|---|---|---|---|
| 1 | 2026-11-16 | Brew Day **PreBrew** step (Rule 16.1, Skynet_PreBrew) and the Process `ask` command (Rule 16.5) | OakBarn Brewery, 2026-11-16, spelling fixed only: Grain Temperature "add this in the Brew Day Start Process as a question to calculate a Strike Temperature as if the Grain is lower than the 72, you will be below strike after you add the grain"; Strike Offset "might need a confirm and a box to change it ... the Offset might need to change on a Brew Day"; "I think I ask to add that to the Brew Day as well in the Pre Brew Process". | Moved from Panel Updates entry 14 (the Strike Offset box in each Equipment Profile stays there). The plan: (2) the **PreBrew** step (Rule 16.1, Skynet_PreBrew) asks two things with a box each, filled in to start: **Grain temperature now** (72 °F unless changed) and **Strike Offset** (the Tab's Equipment Profile's), ✔ Confirm; the Strike Temperature (`rcp_Strike_Temp`) is worked out again from them; (3) a Process needs an `ask` with a number box (today `ask` only has ✔ Done, Rule 16.5), so a new Process command or ask option, in the Process editor, Help 100 and the Process language Help. | thread "Rewrite Default settings Hover Help" |
| 2 | 2026-11-16 | The sample Brew Day Process (processes/BrewDay_Flow.txt), heating the kettle to a boil | **"Boil has started" button in the sample Brew Day Process**: OakBarn Brewery, 2026-11-16: "And on the Skynet Boil Process Sample, an Override Button for a user to say the Boil has started." | Moved from Panel Updates entry 16. **Found (2026-11-16):** processes/BrewDay_Flow.txt heats the kettle with `wait BK_Vessel.BM_702_TEMP@1W_Kettle_BH >= 211` (a fixed 211 °F, not `skn_Boil_Temp`) and hides the Advance button (`wgt_SW_Advance_BH.visible = false`) while it waits; then [SectionBrew400] asks "Hot Break?". The **Override button** (Rule 2.26, Help 96, widget OVR) already passes any wait, but it moves every running Process on, so it is a blunt tool here. **Plan:** during "Heating the kettle to a boil" show the Advance button labelled **"Boil Started"** (one click, no pop-up, Rule 2.44); the wait goes on when the kettle reaches the boil temperature **or** the button is clicked, whichever is first; the click is written in the Brew Day log. With the METAR rebuild the 211 becomes `skn_Boil_Temp` (minus a small margin). The Rule 2.26 Override button stays as it is. **OakBarn Brewery, 2026-11-16:** "I have that in the OakBarn Boil Process." So the sample should follow his own OakBarn Boil Process; his OakBarn Schema Scripts are read only with his permission (asked 2026-11-16, waiting). | thread "Rewrite Default settings Hover Help" |
| 3 | 2026-11-16 | The sample Brew Day Process and PreBrew: using the **boil temperature from the air pressure** (`skn_Boil_Temp`, Rule 1.18, `wait_boil`) | From Panel Updates entry 16 (the Settings boxes, the airport fetch and the Test button stay there). | When Panel Updates entry 16 is built: the sample's `wait ... >= 211` becomes a wait on `skn_Boil_Temp` (or `wait_boil`) minus a small margin, and PreBrew (entry 1) can show the boil temperature it found next to the grain temperature and Strike Offset. If there is no report, the typed pressure or standard air is used, with its warning. | thread "Rewrite Default settings Hover Help" |

## Done

| # | Built in | Date |
|---|---|---|
