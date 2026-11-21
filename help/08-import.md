# Import

## A BeerSmith recipe

1. In BeerSmith: **File > Export > BeerXML**.
2. On the **Import** screen, choose the `.xml` file and press **Import**.

The file becomes the Recipe (**☰ Menu > Recipe**), the same as **IMPORT** on that tab: every hop comes in, with no limit, and Skynet puts the Boil hops into Hop Groups 1, 2, 3 ... and sets their warnings and Drops behind the scenes (see [The Recipe tab](99-recipe-tab)). A Process reads the Recipe as Skynet's own `skn_rcp_` values, such as `skn_rcp_Strike_Temp` (see [Brew Process](100-brew-process)). They are not gGlobals and are not on the Variables screen.

Only when **Settings > BeerXML mapping** names gGlobals are those filled in too (the older way, for a Schema whose Processes still read gGlobals). The samples have no mapping.
