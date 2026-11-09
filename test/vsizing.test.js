// Vessels sized by gallons (Fritz, 2026-11-05, Vessel Rules 19.x): Gallons (10 to start), Method Proportional (Fritz's plain vessel,
// 1 gallon = 197 x 237) or Diameter, size follows volume, a Tab's Master Vessel Sizer, and Not Placed spots hidden until Show All.
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanVessel } from '../public/templates.js';
import { vbRealGallons } from '../public/vesselbuilder.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('public/app.js');

// Templates: 10 gallons to start, Skynet and User alike; Method and Diameter kept
assert.equal(cleanVessel(JSON.parse(read('templates/vessel/Skynet_Vessel_Widget.json'))).volume, 10, 'the Skynet Vessel Widget is 10 gallons');
assert.equal(cleanVessel({ vesselType: 'vessel' }).volume, 10, 'a new vessel Template starts at 10 gallons');
assert.equal(cleanVessel({ vesselType: 'vessel', volume: 15 }).volume, 15, 'an editable field');
assert.equal(cleanVessel({ vesselType: 'pchiller' }).volume, undefined, 'only vessels');
const d = cleanVessel({ vesselType: 'vessel', sizeMethod: 'diameter', diameter: 16, vheight: 17 });
assert.deepEqual([d.sizeMethod, d.diameter, d.vheight], ['diameter', 16, 17]);
assert.equal(cleanVessel({ vesselType: 'vessel', sizeMethod: 'x', diameter: -1 }).sizeMethod, undefined);

// the size maths, taken from the panel: 1 gallon is 197 x 237, size follows volume
const grab = name => { const m = app.match(new RegExp(`(?:const|function) ${name}\\b[^\\n]*(?:\\n(?!const |function |let |//)[^\\n]*)*`)); assert.ok(m, name); return m[0]; };
const src = [grab('V1_GAL'), 'const VW_W = 260;', grab('vGal'), grab('vAspect'), grab('vDrawGal'), grab('V1_SCALE'), grab('vBox'), grab('vScaleOf')].join('\n');
const f = new Function('TPL', 'tplOf', 'vbRealGallons', src + '\nreturn { vBox, V1_SCALE, vScaleOf, vAspect };')(null, () => null, vbRealGallons);
assert.deepEqual(f.vBox({ volume: 1 }, f.V1_SCALE), [197, 237], '1 gallon = Fritz\'s plain vessel');
assert.deepEqual(f.vBox({ volume: 10 }, f.V1_SCALE), [424, 511], '10 gallons: the cube root of 10 times as big');
assert.deepEqual(f.vBox({ volume: 37.85, units: 'Metric' }, f.V1_SCALE), [424, 511], 'Liters work too');
const dia = f.vBox({ volume: 10, sizeMethod: 'diameter', diameter: 16, vheight: 16 }, f.V1_SCALE);
assert.equal(dia[0], dia[1], 'Diameter: its Diameter and Height give the shape');
// drawn by its real size (2026-11-09): the advertised Gallons do not change a Diameter vessel's drawing
assert.deepEqual(f.vBox({ volume: 99, sizeMethod: 'diameter', diameter: 16, vheight: 16 }, f.V1_SCALE), dia);
// the Master sets the scale: a Master drawn half size makes every vessel half size
const m = { volume: 10, w: 212 }, c = f.vScaleOf(m);
assert.deepEqual(f.vBox({ volume: 10 }, c), [212, 255]);
assert.deepEqual(f.vBox({ volume: 1 }, c), [98, 118]);

// the panel: only the Master has grab points; Tab settings pick it; Show All
assert.ok(app.includes("['vSizer', 'Master Vessel Sizer"), 'Tab settings: Master Vessel Sizer');
assert.ok(app.includes("isVW(o) && vMaster(draft?.workspaces.find(w => w.name === o.workspace))?.id !== o.id) return;"), 'no grab points on a Vessel that is not the Master');
assert.ok(app.includes("if (drag?.mode === 'resize' && drag.moved && isVW(drag.item)) { vSizeTab("), 'resizing the Master resizes the Tab');
assert.ok(app.includes("if (!m || m.id !== item.id) { work.w = item.w; work.h = item.h; }"), 'only the Master takes a new Width or Height');
assert.ok(app.includes("'showall', 'Show the Not Placed spots too"), 'Show All in Vessel Widget Properties');
assert.ok(app.includes("['volume', metric ? 'Liters' : 'Gallons', 'num']"), 'Gallons on the Vessel, in the new build Properties');
assert.ok(read('help/135-vessel-sizing.md').includes('Master Vessel Sizer'), 'Help');
console.log('vessel sizing ok');
