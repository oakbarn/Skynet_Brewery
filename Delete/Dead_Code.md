# Dead code taken out (this PR)

OakBarn Brewery, 2026-11-17: *"look for dead code and remove. Compact as much as possible."* and *"Keep the dead code in sandbox as
we may need to restore as it was not dead"*, then *"just keep on github"*.

Every piece below was found by a program check (nothing in the Skynet Panel or the BruControl Import program uses it) and then
checked by hand. Nothing that loads an older saved Schema was taken out. If one of them turns out to be needed, copy it back from
here into the file named (the line number is where it was), or ask Claude to put it back. Like every file in Delete/, this one is
never shipped (Rule 15.3).

| # | File | What it was | Why it was dead |
|---|------|-------------|-----------------|
| 1 | public/app.js (line 951) | Manifold kinds list (Manual / Motorized) for an old Manifold dialog | Nothing reads it: the Manifold dialog now takes its choices elsewhere. |
| 2 | public/app.js (line 1838) | Pipe size as words ("1/2\"") | Nothing calls it. |
| 3 | public/app.js (line 1990) | Plain names of the 8 pump IP spots (Top Left ...) | Nothing reads it: the pump dialogs write the spot names their own way. |
| 4 | public/app.js (line 8119) | Old "<Device> Properties" pop-up (Visible, Hidden Locked, Tab, X, Y ...) | No dialog opens it any more: those rows are on the Device dialogs themselves. |
| 5 | public/app.js (line 8127) | Old "Picture attributes" pop-up (On overlay, Picture when on, Back Colour) | No dialog opens it any more. |
| 6 | public/app.js (line 8128) | Old "Graphic Dialog: the other background pictures" pop-up | No dialog opens it any more. |
| 7 | public/app.js (line 8163) | Old "When tapped: more" pop-up (Tap target, Ask before changing) | No dialog opens it any more. |
| 8 | public/app.js (line 11894) | One-line summary of a Database send setting ("Every 5 min" ...) | Nothing calls it: the Database box shows its settings as rows. |
| 9 | public/app.js (line 8960) | An unused word (Heating Element / Temperature Probe) in the vessel probe spots | Worked out but never shown. |
| 10 | public/app.js (line 12113) | A checkbox switch maker inside the gGlobal dialog | Never used in that dialog. |
| 11 | public/app.js (line 13419) | An unused answer kept after making a new Schema | The answer was never read (the call itself stays). |
| 12 | public/app.js (line 16919) | An unused temperature converter in the Recipe hop dialog | Never used. |
| 13 | public/dial.js (line 9) | The Dial's start angle (-120) | Never read: the Dial works it out from END. |
| 14 | public/dial.js (line 110) | An unused x position in the Skynet Bar drawing | Never read. |
| 15 | public/importer/importer.js (line 322) | Importer: a Yes / No pick for each vessel detail | The vessel page no longer draws these picks. |
| 16 | public/media.js (line 144) | Media page: move one file (a short cut to moveMany) | Nothing calls it: every move goes through moveMany. |
| 17 | lib/bruimport.js (line 170) | Importer: a Tab-by-name list | Made but never read. |
| 18 | lib/hardware.js (line 412) | Board messages: a helper to set a value on every matching item | Never called. |
| 19 | lib/hardware.js (line 750) | Keep a number between 0 and 255 | Never called. |
| 20 | lib/schemas.js (line 589) | Today's date for a file name | Never called. |
| 21 | lib/freshstart.js (line 21) | This program's own folder | Never read. |
| 22 | server.js (line 56) | Unused name in a list of things the server takes from configfile.js | The server never uses it (the backup is made elsewhere). |
| 23 | server.js (line 81) | Unused name taken from devices.js | Never used in server.js. |
| 24 | server.js (line 1412) | File Move: a web address that lists the file kinds | No page or program asks for it. |
| 25 | lib/store.js (line 18) | Unused name taken from mediapaths.js | Never used in store.js. |
| 26 | lib/store.js (line 18) | Unused name taken from mediapaths.js | Never used in store.js. |
| 27 | public/app.js (line 18) | Unused name taken from iptype.js (isIpCode) | Never used in app.js. |
| 28 | public/app.js (line 19) | Unused name taken from pumps.js (PUMP_USES) | Never used in app.js. |
| 29 | public/app.js (line 19) | Unused name taken from pumps.js (pumpSpeed) | Never used in app.js. |
| 30 | public/app.js (line 31) | Unused name taken from mediapaths.js (MEDIA_DEFAULTS) | Never used in app.js. |
| 31 | public/app.js (line 36) | Unused name taken from stovetop.js (STOVE_SIDE) | Never used in app.js. |
| 32 | public/app.js (line 42) | Unused names taken from recipecalc.js (BEERXML_FERM_TYPES, MISC_UNITS) | Never used in app.js. |
| 33 | public/app.js (line 51) | Unused name taken from brewcalc.js (REPORT_UNITS) | Never used in app.js. |
| 34 | lib/schemas.js (line 17) | Unused name taken from filedate.js (fileDay) | Only the removed today() used it. |
| 35 | server.js (line 59) | Unused name taken from filemove.js (KINDS) | Only the removed /ui/filemove/kinds address used it. |
| 36 | lib/alarmoutputs.js (line 7) | List of an Alarm's two output slots | Nothing reads it. |
| 37 | lib/skynetpicids.js (line 45) | Skynet picture ID list for the picture lists | Nothing calls it: the picture lists get their ID numbers another way. |
| 38 | public/datadisplay.js (line 35) | A flow meter's main value (rate or total) for a Data Display | Nothing calls it. |
| 39 | public/heatmethod.js (line 160) | The words for a heater's Switched by pick (SSR, relay ...) | Nothing calls it: the dialog uses switchedByChoices. |
| 40 | public/mediapaths.js (line 55) | Lists of sound and path setting names | Nothing reads them (removing PATH_PARTS from store.js left it unused too). |
| 41 | public/pumps.js (line 8) | Pump Use choices: Hot (wort, water) / Cold (glycol, ice water) | No dialog shows this list (useOf, which reads a pump's Use, stays). |
| 42 | public/themes.js (line 30) | Plain words for each color of a Look (Back color, Text ...) | Nothing reads it. |
| 43 | public/brewcalc.js (line 58) | equipVolumes, an old second name for brewVolumes | Only a test used the old name; the test now uses brewVolumes. |
| 44 | public/style.css (line 713) | Look of an old Brew Day card (brewCard) | No screen uses the brewCard class. |
| 45 | public/style.css (line 717) | Look of an old Equipment Profile grid (eqGrid, eqNum) | No screen uses these classes. |
| 46 | public/style.css (line 727) | Phone-size look of the old eqGrid | No screen uses the eqGrid class. |
| 47 | public/style.css (line 931) | Look of an old Interface ID note | No screen uses the ifaceIdNote class. |
| 48 | public/style.css (line 1289) | Look of a 'later' line in the Vessel Device Builder | No screen uses the vbLater class. |

## The code

### 1. public/app.js, line 951

```js
const MF_KINDS = [['manual', 'Manual (turned by hand: a Process shows a pop-up and waits for Done)'], ['motorized', 'Motorized (switched by its Port)']];
```

### 2. public/app.js, line 1838

```js
const sizeText = p => p.size === 'custom' ? (+p.sizeCustom > 0 ? p.sizeCustom + (p.sizeUnits === 'mm' ? ' mm' : '"') : '1/2"')
  : (sizeChoices(p).find(c => c[0] === String(p.size || '0.5'))?.[1] || '1/2"').replace(/ +\(most common\)/, '');
```

### 3. public/app.js, line 1990

```js
const PUMP_SPOT_NAMES = { TL: 'Top Left', TM: 'Top Middle', TR: 'Top Right', RM: 'Right Middle', BR: 'Bottom Right', BM: 'Bottom Middle', BL: 'Bottom Left', LM: 'Left Middle' };
```

### 4. public/app.js, line 8119

```js
const DEV_PROPS_POP = what => ({ title: `${what} Properties`, canDelete: true, fields: [['visibility', 'Visible', 'vis', null, false, 'b'], ['hidden', 'Hidden Locked', 'bool', null, false, 'b'],
  ['locked', 'Lock position (no drag or resize)', 'lock'], ['workspace', 'Tab', 'ws'], ['x', 'X Horizontal', 'num'], ['y', 'Y Vertical', 'num'], ['w', 'Width', 'num'], ['h', 'Height', 'num']] });
```

### 5. public/app.js, line 8127

```js
const DEV_PIC_POP = { title: 'Picture attributes', fields: [['imageOverlay', 'On overlay (on top while it is on)', 'gpick', 'overlays'], ['imageOn', 'Picture when on (a second picture, optional)', 'gpick'], ['bgColor', 'Back Colour (behind the picture)', 'color']] };
```

### 6. public/app.js, line 8128

```js
const DEV_GRAPHIC_POP = { title: 'Graphic Dialog: the other background pictures', fields: [['background', 'Background # (1, 2 or 3 picks Image Path 1-3)', 'bgnum'],
  ['backpath_2', 'Image Path 2', 'imgopen', 2], ['backpath_3', 'Image Path 3', 'imgopen', 3], ['bgColor', 'Back Colour (behind the picture)', 'color']] };
```

### 7. public/app.js, line 8163

```js
const DEV_TAP_POP = { title: 'When tapped: more', fields: [['tapTarget', 'Tap target (Device, Widget, Process or Tab)', 'text', null, false, false, { tip: 'Empty: itself.' }], ['confirm', 'Ask before changing (ON / OFF buttons)', 'bool']] };
```

### 8. public/app.js, line 11894

```js
function logSummary(lg) {
  lg = lg || { frequency: 'none' };
  const f = lg.frequency || 'none';
  if (f === 'process') return lg.process ? `When "${lg.process}" starts` : 'When a Process starts (none picked)';
  if (f === 'datetime') return `At ${lg.at || '?'}`;
  if (f === 'clock') return `Every day at ${lg.at || '?'}`;
  const gs = (lg.groups || []).map(id => (S.config.dbGroups || []).find(x => x.id === id)?.name).filter(Boolean);
  const inG = s => gs.length && f !== 'none' ? `${s}, while Group ${gs.join(' or ')} is started` : s;
  if (!TIME_MODES.includes(f)) return inG(LOG_LABEL[f] || f);
  const every = f === 'hms' ? `Every ${lg.interval || '?'}` : `Every ${lg.every ?? 1} ${{ ms: 'ms', seconds: 'sec', minutes: 'min', hours: 'h', days: 'day(s)' }[f]}`;
  return inG(every);
}
```

### 9. public/app.js, line 8960

Was:

```js
, what = kind === 'element' ? 'Heating Element' : 'Temperature Probe';
```

Now:

```js
;
```

### 10. public/app.js, line 12113

Was:

```js
  const sw = (k, label) => { const c = h('input', { type: 'checkbox' }); c.checked = !!work[k]; c.onchange = () => { work[k] = c.checked; };
    return h('label', { class: 'toggle' }, h('span', { class: 'sw' }, c, h('span', { class: 'swk' })), ' ' + label); };
```

Now:

```js
(nothing)
```

### 11. public/app.js, line 13419

Was:

```js
  const r = await api('POST', '/ui/schemas', { name: w.name, empty: w.start === 'empty' });
```

Now:

```js
  await api('POST', '/ui/schemas', { name: w.name, empty: w.start === 'empty' });
```

### 12. public/app.js, line 16919

Was:

```js
    const tmp = { d: 1, to: v => cTo(v, u.tempUnit), from: v => toC(v, u.tempUnit) };
```

Now:

```js
(nothing)
```

### 13. public/dial.js, line 9

Was:

```js
const START = -120, END = 120;
```

Now:

```js
const END = 120;
```

### 14. public/dial.js, line 110

Was:

```js
[x1, y1] = at(1)
```

Now:

```js
[, y1] = at(1)
```

### 15. public/importer/importer.js, line 322

```js
  const yn = (v, k) => `<select class="vd" data-v="${esc(v.key)}" data-k="${k}" title="${v.details?.found?.[k] ? 'Found in your names or Scripts (a guess): change it if it is wrong' : 'Not found in your names or Scripts: change it if your vessel has one'}">
    <option value="no"${v.details?.[k] !== 'yes' ? ' selected' : ''}>No</option><option value="yes"${v.details?.[k] === 'yes' ? ' selected' : ''}>Yes${v.details?.found?.[k] ? ' (found)' : ''}</option></select>`;
```

### 16. public/media.js, line 144

```js
const move = (fromRoot, from, toRoot, toDir) => moveMany(fromRoot, [from], toRoot, toDir);
```

### 17. lib/bruimport.js, line 170

```js
  const tabOf = new Map(workspaces.map(w => [w.name, w]));
```

### 18. lib/hardware.js, line 412

```js
    const set = (match, prop, val) => {
      for (const el of this.store.list()) if (match(el)) this.store.setProp(el.name, prop, typeof val === 'function' ? val(el) : val, 'hw');
    };
```

### 19. lib/hardware.js, line 750

```js
const clamp255 = v => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
```

### 20. lib/schemas.js, line 589

```js
const today = () => fileDay();
```

### 21. lib/freshstart.js, line 21

```js
const HERE = path.dirname(fileURLToPath(import.meta.url));
```

### 22. server.js, line 56

Was:

```js
import { backupConfigFile, listBackups,
```

Now:

```js
import { listBackups,
```

### 23. server.js, line 81

Was:

```js
import { Devices, DEVICE_COOKIE, isBrainItself }
```

Now:

```js
import { Devices, isBrainItself }
```

### 24. server.js, line 1412

Was:

```js
    if (p === '/ui/filemove/kinds' && m === 'GET') return ok(res, { kinds: Object.fromEntries(Object.entries(MOVE_KINDS).map(([k, v]) => [k, v.label])), brain: ROOT });
```

Now:

```js
(nothing)
```

### 25. lib/store.js, line 18

Was:

```js
import { mediaDefaults, splitPath, joinPath,
```

Now:

```js
import { mediaDefaults, joinPath,
```

### 26. lib/store.js, line 18

Was:

```js
, PICTURE_PROPS, PATH_PARTS } from '../public/mediapaths.js';
```

Now:

```js
, PICTURE_PROPS } from '../public/mediapaths.js';
```

### 27. public/app.js, line 18

Was:

```js
 ipTypeChoices, isIpCode, ownerIpType,
```

Now:

```js
 ipTypeChoices, ownerIpType,
```

### 28. public/app.js, line 19

Was:

```js
, PUMP_POWERS, PUMP_USES, PUMP_SPEEDS,
```

Now:

```js
, PUMP_POWERS, PUMP_SPEEDS,
```

### 29. public/app.js, line 19

Was:

```js
, isDcPower, pumpSpeed, powerText,
```

Now:

```js
, isDcPower, powerText,
```

### 30. public/app.js, line 31

Was:

```js
 DEFAULT_WORDS, MEDIA_DEFAULTS, userFolderError
```

Now:

```js
 DEFAULT_WORDS, userFolderError
```

### 31. public/app.js, line 36

Was:

```js
import { STOVE_SIDE, STOVE_GALLONS,
```

Now:

```js
import { STOVE_GALLONS,
```

### 32. public/app.js, line 42

Was:

```js
TER_BOIL_TYPES, BEERXML_FERM_TYPES, FERM_MEASURES, MISC_UNITS, MISC_TYPES,
```

Now:

```js
TER_BOIL_TYPES, FERM_MEASURES, MISC_TYPES,
```

### 33. public/app.js, line 51

Was:

```js
, heatKindsFor, REPORT_UNITS, VALVE_SERVICE,
```

Now:

```js
, heatKindsFor, VALVE_SERVICE,
```

### 34. lib/schemas.js, line 17

Was:

```js
import { fileDay, fileMinute, fileStamp } from './filedate.js';
```

Now:

```js
import { fileMinute, fileStamp } from './filedate.js';
```

### 35. server.js, line 59

Was:

```js
import { FileMove, KINDS as MOVE_KINDS, missingMedia }
```

Now:

```js
import { FileMove, missingMedia }
```

### 36. lib/alarmoutputs.js, line 7

```js
export const ALARM_OUTPUT_KEYS = ['digitalOutput1', 'digitalOutput2'];
```

### 37. lib/skynetpicids.js, line 45

```js
// { "Images/Skynet/...": id } for the panel's picture lists
export function skynetPicIdMap() { load(); return Object.fromEntries(rows.filter(r => !r.retired).map(r => [SKYNET_IMAGES + r.file, r.id])); }
```

### 38. public/datadisplay.js, line 35

```js
// BruControl's Primary Value (a Process's "Flow" value): the value the Data Display shows, for a flow meter its rate or its total
export const primaryFlow = (el, r, display) => (display || el.display) === 'total' ? r.total : r.rate;
```

### 39. public/heatmethod.js, line 160

```js
export const switchedByWord = k => SWITCHED_BY.find(s => s[0] === k)?.[1] ?? SWITCHED_BY[0][1];
```

### 40. public/mediapaths.js, line 55

```js
export const SOUND_PROPS = ['sound', 'path'];
export const PATH_PARTS = ['path', 'file'];
```

### 41. public/pumps.js, line 8

```js
export const PUMP_USES = [['', 'Hot (wort, water)'], ['cold', 'Cold (glycol, ice water)']];
```

### 42. public/themes.js, line 30

```js
// the plain words for each color pick, in the order shown
export const THEME_PARTS = [
  ['back', 'Back color (behind everything)'], ['panel', 'Tabs and boxes'], ['box', 'Buttons and typing boxes'], ['line', 'Lines around them'],
  ['text', 'Text'], ['labels', 'Labels and hints'], ['accent', 'Picked button, Tab and headings'], ['accentText', 'Text on a picked button'],
];
```

### 43. public/brewcalc.js, line 58

```js
// the old name, used before the Boil Profile and Recipe took their numbers
export const equipVolumes = brewVolumes;
```

### 44. public/style.css, line 713

```css
.brewCard { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; }
.brewCard .bar { margin-bottom: 4px; }
```

### 45. public/style.css, line 717

```css
.eqGrid { display: grid; grid-template-columns: max-content minmax(160px, 260px); gap: 6px 12px; align-items: center; flex: 0 1 auto; }
.eqGrid textarea { width: 100%; box-sizing: border-box; }
.eqNum { display: flex; gap: 6px; align-items: center; }
.eqNum input { width: 7em; }
```

### 46. public/style.css, line 727

```css
  .eqGrid { grid-template-columns: 1fr; }
```

### 47. public/style.css, line 931

```css
.ifaceIdNote { border-left: 4px solid #1f3a93; padding: 6px 10px; background: color-mix(in srgb, #1f3a93 8%, transparent); }
```

### 48. public/style.css, line 1289

```css
.vbPanel .vbLater { opacity: .55; font-size: 13px; }
```
