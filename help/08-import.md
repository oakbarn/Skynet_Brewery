# Import

## A BeerSmith recipe

1. In BeerSmith: **File > Export > BeerXML**.
2. On the **Import** screen, choose the `.xml` file and press **Import**.

The file becomes the Recipe (**☰ Menu > Recipe**), the same as **IMPORT** on that tab: every hop comes in, with no limit, and Skynet puts the Boil hops into Hop Groups 1, 2, 3 ... and sets their warnings and Drops behind the scenes (see [The Recipe tab](99-recipe-tab)). A Process reads the Recipe as Skynet's own `skn_rcp_` values, such as `skn_rcp_Strike_Temp` (see [Brew Process](100-brew-process)). They are not gGlobals and are not on the Variables screen.

Only when **Settings > BeerXML mapping** names gGlobals are those filled in too (the older way, for a Schema whose Processes still read gGlobals). The samples have no mapping.

## A BruControl Schema (admins)

1. Choose the `.brucfg` file (in *Documents\BruControl* on the BruControl computer).
2. Pick **Replace** (start over) or **Add to what I have**.
3. Leave **Run the imported devices in the simulator** ticked until you are ready to use real hardware.
4. Press **Check file** to see what will come in, then **Import**.

Boards, Devices, tabs, Widgets and processes come in with their pins, calibrations, timers, sounds, pictures and positions. Put the BruControl pictures in the picture folder named on the screen (normally `Images`; the old name `oakbarn` still works) using the [Media](07-media) screen. Each item's three BruControl background pictures become **.backpath**, **.backpath_2** and **.backpath_3**; all three can be changed, see [Pictures on items](25-picture-paths).
