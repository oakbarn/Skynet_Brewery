SKYNET SAMPLE SCHEMAS
=====================

This folder holds the extra Sample Schemas (ready-made breweries) that come with the
Skynet Sample Schemas Setup (Rule 9.13). The panel itself ships only one sample, the
3 Vessel 1 Pump brewery, and it always stays there: it never moves here. This folder
is only for additional samples, added one at a time.

Right now there are none: each older sample is brought up to the current Skynet Rules
before it is added.

HOW THE PANEL USES THIS FOLDER
  Every folder in here that has a sample.json is listed in the Schema dropdown under
  "Add a Sample Schema", after the 3 Vessel sample. Picking one adds a COPY of it as a
  new Schema of your own, on the simulator, so nothing real is switched. The sample in
  this folder is never changed.

WHAT A SAMPLE SCHEMA FOLDER HOLDS
  <name>/sample.json     its name, title, a short description, and what it needs
  <name>/config.json     its Tabs, Devices, Widgets, pipes and Interfaces
  <name>/processes/*.txt   its Processes

A SCHEMA FROM ANOTHER BREWER
  A brewery another brewer shares can be added the same way: put its folder (with the
  three parts above) in here and refresh the panel (F5). It comes in as a new Schema,
  on the simulator, exactly like the Skynet samples.

ONLY ADDS, NEVER REPLACES
  The Sample Schemas Setup only adds folders you do not have yet. A sample you already
  have, by that name, is never changed, and nothing is ever deleted. A changed sample
  comes with a new name, so the old one stays as it was.
