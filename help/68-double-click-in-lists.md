# Double-click in lists

In any list in the panel, **double-click an entry to open its Properties**. It is the same rule as on a Tab, where a double-click on a Device or Widget opens its Properties.

Properties are changed in **Edit layout**, so this is for admins. The panel takes you to the item's Tab, switches Edit layout on and opens the same Properties dialog you get by double-clicking the item on the Tab. Press **Save layout** when you are done, as usual.

A double-click on a box, dropdown or button inside a row does that box's own job instead (for example typing a value), so the Properties don't open by accident.

## Which lists

| List | Where | Double-click opens |
| --- | --- | --- |
| gAPI, gKonstant and shared variables | Variables page | the variable's Properties |
| Devices and Widgets for voice and Home Assistant | Settings, MQTT | the Device's or Widget's Properties |
| Equipment list | ☰ Menu > Equipment Profile | the Tab_Vessel's or Tab_Fitting's Properties on its Tab |
| Made on the Vessel tab | ☰ Menu > Equipment Profile | the vessel, open on the Vessel tab |
| Tabs of the Schema | ☰ Menu > Tab Background Profile | that Tab's Tab settings |
| Templates | ☰ Menu > Vessel, Fitting and Equipment Templates | the Template's settings |

The Equipment list only opens Properties when the Tab follows its profile's Default Layout. When the Tab keeps its own layout, the list shows the profile's Default Layout, which is not on a Tab, so there is nothing to open.

## Lists that work differently

- **Processes**: one click already opens the Process in the editor; its settings (class, Restart if it fails) are on the editor bar.
- **Media** and **Picture picker**: a double-click opens a folder, or picks the picture.
- **Interfaces**, **Users** and **OneWire probes**: their settings are changed right in the row; they have no Properties dialog.

See also [Tabs](02-tabs) and [Variables](04-variables).
