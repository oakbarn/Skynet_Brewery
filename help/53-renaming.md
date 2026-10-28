# Renaming Devices and Widgets

When you change the **Name** of a Device or Widget, every Process that uses the old name is changed to the new name for you. You don't have to hunt through your Processes by hand.

## How it works

1. Turn on **Edit layout**.
2. Double-click the Device or Widget, press **✏ Change name** beside its locked **Name**, type the new name in the **Name Change** pop-up and press **💾 Save** there, then **💾 Save** in its properties (see [Name Change and hidden keys](80-name-change-and-hidden-keys)).
3. Press **Save** on the Edit layout bar.

When the layout is saved, the panel goes through every Process and changes the old name to the new one. A message at the bottom of the screen tells you which Processes were changed, for example:

*Layout saved. Renamed in 2 Processes: Mash_In, Heat_HLT.*

If no Process used the old name, it says so.

## What is changed

Only the **whole name** is changed. If you rename `HLT_Temp` to `MB_OW1_TmP_HLT_HS`:

- `HLT_Temp = 168` becomes `MB_OW1_TmP_HLT_HS = 168`
- `HLT_Temp.visible = true` becomes `MB_OW1_TmP_HLT_HS.visible = true`
- `"HLT_Temp"` (old style, in quotes) is changed too
- the name inside comments and messages is changed too
- `HLT_Temp_2` and `Old_HLT_Temp` are **not** changed: they are other names
- an attribute after a dot, like `Pump.HLT_Temp`, is never changed

Names are matched exactly, upper and lower case included.

Other settings that point at the renamed one follow it as well: pipes and hoses that flow when it is on, a heater on a vessel, Devices that follow or read it, and saved **CSV sets** on the Log page. Its current value stays with it.

## Good to know

- **Rename more than one at once.** You can rename several Devices and Widgets before pressing Save; they are all changed in one go. Even swapping two names (A becomes B and B becomes A) works.
- **Clones follow.** Rename an item and the old name inside the name of each of its clones changes too (see [Name Change and hidden keys](80-name-change-and-hidden-keys)).
- **Rename it twice.** If you rename `Pump1` to `Pump_A` and then to `Pump_Main` before saving, the Processes go straight from `Pump1` to `Pump_Main`.
- **Cancel.** If you leave Edit layout without saving, nothing is renamed and no Process is changed.
- **A running Process** keeps working: it finds the renamed item through its hidden key. It uses the new name from its next start.
- **Backup.** Before a Process is changed, the old copy is kept next to it as `<Process name>.txt.bak` in the scripts folder.
- **Other Schemas.** Processes are shared by every Schema. If another Schema still has a Device or Widget by the old name, the message tells you, because the changed Process now looks for the new name there too. Rename it in that Schema as well, or keep a copy of the Process for it.
- **Tabs and Processes.** Renaming a Tab or a Process is separate; this page is about Devices and Widgets.

See also [Interface, Tab and Device names](46-interface-tab-device-names), [Process language and steps](22-process-language) and [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).
