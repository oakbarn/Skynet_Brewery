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
| 2026-11-12 | README, "2. What is in it" (the Older vessel widgets row, taken out of the Skynet README) | OakBarn Brewery: "Remove but add to importer sandbox. There are no vessels in BruControl, but should be built in the Imported from an Interview process." and "There can be NO older vessel Widgets, They were Global Strings used to display a graphic in OakBarn but other users. Big Part of the Global import in Importer". The row as it was: Pick the kind next to **Add equipment**: **Electric heated vessel**, **Gas heated vessel**, **Unheated mash tun**, **Cooling coil** or **Plate chiller**. The coil has IN and OUT IPs built in; the plate chiller has WORT IN / WORT OUT and WATER IN / WATER OUT, two circuits that never mix. Flow passes through them. Each has a **Background picture path** (empty = a plain drawn vessel), a **Label** with **position** (top, corners, center, bottom, above or below), **color**, **size** and **Show label**, and an optional **Heater** (the element or burner output): its heating strip or flames light up while that output is on. Drop an IP point on a vessel and it becomes one of its ports: it moves with the vessel, and pipes on it follow. | thread "Polish the Skynet Brew Panel" |
