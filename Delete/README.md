# Delete folder

Files that no longer meet a Skynet Rule or standard are moved here instead of being deleted
(Fritz, 2026-10-31). Each file keeps the folder path it had in the repo, so it is easy to see
where it came from and to put it back if needed.

Nothing in this folder is used by the panel, and it is left out of the release zip and the
Windows installer (tools/build-release.sh). Fritz decides when a file here is deleted for good.

| Moved here | Date | Replaced by | Why |
|---|---|---|---|
| media/Images/Skynet/Valves/Valve_Ball_ClosedH_1.png / .svg | 2026-10-31 | Skynet Motorized Ball Valve Device, Master H (Valve_Motor_Ball_ClosedH.svg) | Rule 5.17 (the valve is a Skynet Device Template); Rule 7.1 (SVG only; the .png) |
| media/Images/Skynet/Valves/Valve_Ball_OpenH_1.png / .svg | 2026-10-31 | Skynet Motorized Ball Valve Device, Master H (Valve_Motor_Ball_OpenH.svg) | Rule 5.17; Rule 7.1 |
| media/Images/Skynet/Valves/Valve_Ball_ClosedV-1x1.png / .svg | 2026-10-31 | Skynet Motorized Ball Valve Device, Daughter VL / VR (Valve_Motor_Ball_ClosedV_LC.svg) | Rule 5.17; Rule 7.1 |
| media/Images/Skynet/Valves/Valve_Ball_OpenV-1x1.png / .svg | 2026-10-31 | Skynet Motorized Ball Valve Device, Daughter VL / VR (Valve_Motor_Ball_OpenV_LC.svg) | Rule 5.17; Rule 7.1 |

A panel that already has these pictures keeps them (an update never deletes your pictures), so a
Schema of yours that still uses them keeps working.
