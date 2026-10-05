# Import

## A BeerSmith recipe

1. In BeerSmith: **File > Export > BeerXML**.
2. On the **Import** screen, choose the `.xml` file and press **Import**.

The recipe values go into the variables named in **Settings > BeerXML mapping**, including mash steps and hops. Hop uses become group codes:

| Hop use | Code |
|---|---|
| Mash | -333 |
| First Wort | -444 |
| Boil at full boil time | -888 |
| Other boil hops | 919 |
| Aroma / Whirlpool | -999 |
| Dry Hop | -111 |
| Unused slot | 0 |

## A BruControl configuration (admins)

1. Choose the `.brucfg` file (in *Documents\BruControl* on the BruControl computer).
2. Pick **Replace** (start over) or **Add to what I have**.
3. Leave **Run the imported devices in the simulator** ticked until you are ready to use real hardware.
4. Press **Check file** to see what will come in, then **Import**.

Boards, device elements, tabs, elements and processes come in with their pins, calibrations, timers, sounds, pictures and positions. Put the BruControl pictures in the picture folder named on the screen (normally `Images`; the old name `oakbarn` still works) using the [Media](07-media) screen. Each item's three BruControl background pictures become **imagePath_1**, **imagePath_2** and **imagePath_3**; imagePath_2 and _3 are then locked, see [Pictures on items](23-picture-paths).
