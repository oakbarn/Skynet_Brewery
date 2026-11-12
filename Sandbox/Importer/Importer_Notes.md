# Importer Sandbox: notes for the Importer version only

Kept here until the **Big Merge** (OakBarn Brewery, 2026-11-12, Rule 11.3): "For the Most Part, Put Updates to the Importer in a Sand Box.
We will do a Big Merge to move things over to the Importer."

The Skynet Panel version of each Help page, Hover Help and the README is polished first, and never mentions BruControl. Anything
OakBarn Brewery says is for the **Importer version only** is written here, with where it goes, and is not put in the Importer yet. When OakBarn Brewery says to update **both** the Importer and Skynet, the change goes into the Importer itself, not here.
BruControl text taken out of Skynet text is in `Sandbox/help/BruControl_Help_Extract.md`.

The panel does not use this folder, and it is left out of the release zip and the installer.

| Date | Where it goes (Importer version of ...) | The note | Asked in |
|---|---|---|---|
| 2026-11-12 | README, "2. What is in it", Touch screens | A good place to bring in the BruControl differences and similarities: what is new and improved, and comparisons. Model to come from OakBarn Brewery after the Skynet README is polished. | thread "Add step-by-step guides to Help" |
| 2026-11-12 | Help 188, Step by Step: Add a Schema | An Importer version with BruControl cross references and differences in many places (waits, Rule 11.3). | thread "Add step-by-step guides to Help" |
| 2026-11-12 | Device Type Hover Help of the Add Device and Pump Properties dialogs (Blichmann RipTide), and Help 115 | OakBarn Brewery's words: "Explain how Skynet and Brucontol are similar, but rather than the Selection Method in BruControl, we have the actual Hardware types like a Pump, where it is selectable as to the Type of Control (DO or PWM). In BruControl, you could only select the control and then make it into a Pump or a Valve. In Skynet you choose Pump or Valve with many control Items and Background already filled in. Also about the One Port One device rule and how Heater Elements are treat in Skynet vs Brucontol". To write: Skynet starts from the hardware (Pump, Valve, Heating Element) and lets you pick its control (DO or PWM), with the rest filled in; BruControl starts from the control (Digital Output, PWM ...) and then makes it a Pump or a Valve. One Port, one Device (Rule 6.1). A Heating Element is one Device with its Control Methods (Rule 6.19), where BruControl has a separate Device for each method. | thread "Rewrite Add Device Hover Help and add confirm step" (Hover Help Blichmann RipTide Dialog 1 #2) |
