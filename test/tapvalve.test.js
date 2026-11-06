// Tap Water Valve (Fritz, 2026-11-06, Rule 5.33): a Manual Valve Widget with the household hose bib picture, one IP on its hose
// outlet, a tap water source while open, Label tap_water_n.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { graphicTopic } from '../public/helpmap.js';


const ROOT = path.join(import.meta.dirname, '..');
const PIC = 'Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg';
const svg = fs.readFileSync(path.join(ROOT, 'media', PIC), 'utf8');
assert.ok(svg.includes('viewBox="0 0 300 300"'), 'drawn in a 300 x 300 box');
assert.ok(fs.readFileSync(path.join(ROOT, 'lib', 'picgroups.js'), 'utf8').includes("'Tap_Water_Valve_Hose_Bib.svg'"), 'listed in the Valves picture group');
assert.deepEqual(graphicTopic({ kind: 'ip', fitting: 'manualValve', image: PIC }), ['tap-water-valve']);
assert.deepEqual(graphicTopic({ kind: 'ip', fitting: 'manualValve' }), ['pipe-fittings-and-manual-valves', 'the-manual-valve-widget']);
assert.ok(fs.existsSync(path.join(ROOT, 'help', '141-tap-water-valve.md')), 'Help 141');
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.ok(app.includes(`const TAP_PIC = '${PIC}'`), 'the picture is a Manual Valve picture');
assert.ok(/MV_PICS = [\s\S]*?Tap_Water_Valve_Hose_Bib\.svg/.test(app), 'offered in the Manual Valve Picture list');
assert.ok(app.includes("tap: [[1 / 3, 0.987]]"), 'one IP: the center of the hose thread face (100, 296 of 300)');
assert.ok(app.includes("if (q?.tap) return { key: id, push: true, tap: true }"), 'open, it pushes tap water out');
assert.ok(app.includes("return 'tap_water_' + n"), 'Label starts as tap_water_n');
assert.equal((app.match(/addIpFit\('manualValve', 'tap'\)/g) || []).length, 2, 'on the Valves and Semi_Widgets_Devices lists');
console.log('tapvalve ok');
