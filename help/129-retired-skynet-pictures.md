# Retired and renamed Skynet pictures

The Skynet pictures were cleaned up (Skynet Rules 7.8 and 15.3). Retired pictures are moved to the **Delete**
folder in the GitHub repo, never thrown away, and everything that came with Skynet now uses the picture that replaced them.

## Valves show open with an Overlay

Skynet valves no longer swap to a second "Open" picture. A valve keeps its one picture, and while it is open (On) its
**On overlay** is drawn on top: the red and yellow lightning bolt on a motorized valve, or the green ring and tick on a
Manual Valve Widget. Every Skynet valve Template, the sample Schemas and the default Schema work this way.

Your own pictures can still come in an On and Off pair if you want that (Rule 7.8); Skynet's just don't.

## Renamed

| Old name | New name |
| --- | --- |
| Valve_Ball_ClosedH_1 | Motorized_TC15_Ball_Valve_Horizontal.svg |
| Valve_Ball_ClosedV-1x1 | Motorized_TC15_Ball_Valve_Vertical.svg |

## Retired (moved to Delete/)

| Retired | Use instead |
| --- | --- |
| pipe_cross.svg | Skynet_TC15_Cross.svg |
| pipe_elbow45.svg | Skynet_TC15_Elbow_45.svg |
| pipe_elbow90.svg | Skynet_TC15_Elbow_90.svg |
| pipe_tee.svg | Skynet_TC15_Long_Tee.svg |
| Skynet_TC15_InstrumentTee.svg | Skynet_TC15_Instrument_Tee.svg |
| Valve_Ball_OpenH_1 | Motorized_TC15_Ball_Valve_Horizontal.svg plus the On overlay |
| Valve_Ball_OpenV-1x1 | Motorized_TC15_Ball_Valve_Vertical.svg plus the On overlay |
| Every other Skynet Open valve picture (Valve_Motor_Ball_Open..., Valve_Motor_Butterfly_Open..., Valve_Manual_Open..., Valve_Manual_Butterfly_Open..., Valve_Gas_Solenoid_Open..., Manual_Ball_Valve_..._Open) | The Closed picture of the same valve plus the On overlay |

## Sample Schemas use Overlays

In the sample Schemas and the default Schema, nothing swaps its picture between Off and On any more: pumps, valves and burners
keep their Off picture and show the lightning bolt when On, and a heating element glows red when On.

## White pump covers

The White pump cover is **RGB 250 250 250** (#FAFAFA). **White** is now one of the Skynet cover colors (Help 111).
