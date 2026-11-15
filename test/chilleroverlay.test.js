// The Chiller Overlay (Rule 5.42): place_Chiller = template, vessel and remove_Chiller
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compile } from '../lib/engine.js';
import { placeChiller, removeChiller, placeError, chillerTemplates, chillerVessels } from '../lib/chiller.js';
import { suggest } from '../public/autofill.js';

const cfg = JSON.parse(fs.readFileSync(new URL('../samples/configs/three-vessel-one-pump/config.json', import.meta.url)));
const n0 = cfg.graphics.length;

// the Process line
const c = compile('place_Chiller = Immersion_Chiller, BK_Vessel\nremove_Chiller = BK_Vessel\nremove_Chiller\n');
assert.deepEqual(c.errors, []);
assert.deepEqual(c.stmts.map(s => [s.op, s.place, s.tpl, s.vessel]), [['chiller', true, 'Immersion_Chiller', 'BK_Vessel'], ['chiller', false, null, 'BK_Vessel'], ['chiller', false, null, null]]);
assert.ok(compile('place_Chiller = Immersion_Chiller').errors.length, 'a Vessel is needed');
assert.ok(compile('place_Chiller Immersion_Chiller, BK_Vessel').errors.length, 'the = is needed');

// the Chiller Templates are the immersion coils; the Brew Kettle comes first
assert.deepEqual(chillerTemplates().map(t => t.name).sort(), ['Immersion_Chiller'], 'only immersion chillers: a Chillzilla is a counterflow chiller with 4 IPs');
assert.match(placeError(cfg, null, 'Chillzilla', 'BK_Vessel'), /no Chiller Template/);
assert.equal(chillerVessels(cfg)[0].name, 'BK_Vessel');
assert.match(placeError(cfg, null, 'Counterflow_Chiller', 'BK_Vessel'), /no Chiller Template/);
assert.match(placeError(cfg, null, 'Immersion_Chiller', 'Nope'), /no Vessel/);

// placed over the kettle, with its hoses from the Chiller water tap to In and from Out to the drain
const r = placeChiller(cfg, null, 'Immersion_Chiller', 'BK_Vessel');
assert.ok(r.ok, r.error);
const bk = cfg.graphics.find(g => g.name === 'BK_Vessel'), ch = r.chiller;
assert.equal(ch.name, 'wgt_CHL_Immersion~chiller_BH');
assert.equal(ch.label, 'Immersion chiller');
assert.ok(ch.x > bk.x && ch.x + ch.w < bk.x + bk.w && ch.y > bk.y && ch.y < bk.y + bk.h, 'drawn over the vessel');
const ips = cfg.graphics.filter(g => g.attachTo === ch.id);
assert.equal(ips.length, 2);
assert.equal(r.hoses.length, 2);
assert.equal(r.hoses[0].from, 'eq:g_chill_tap:out');
assert.equal(r.hoses[0].to, ips.find(g => g.port === 'in').id);
assert.equal(r.hoses[1].from, ips.find(g => g.port === 'out').id);
assert.equal(r.hoses[1].to, 'ip_chill_drain');
for (const hz of r.hoses) { assert.ok(hz.hose && /^Hose_\d+$/.test(hz.name)); assert.equal(hz.label, hz.name.toLowerCase()); }
// placing again takes the first one off first
placeChiller(cfg, null, 'Immersion_Chiller', 'Boil kettle');
assert.equal(cfg.graphics.length, n0 + 5);
// remove_Chiller takes the chiller, its IPs and its hoses off
assert.deepEqual(removeChiller(cfg, 'BK_Vessel').removed, ['wgt_CHL_Immersion~chiller_BH']);
assert.equal(cfg.graphics.length, n0);
assert.deepEqual(removeChiller(cfg, null).removed, []);

// the Process editor: Templates after place_Chiller =, then the Vessels
const W = { chillers: ['Chillzilla', 'Immersion_Chiller'], vessels: ['BK_Vessel', 'HLT_Vessel'], elements: [] };
assert.deepEqual(suggest('place_C', W).list.map(i => i.text), ['place_Chiller = ']);
assert.deepEqual(suggest('place_Chiller = ', W).list.map(i => i.text), ['Chillzilla, ', 'Immersion_Chiller, ']);
assert.deepEqual(suggest('place_Chiller = Immersion_Chiller, ', W).list.map(i => i.text), ['BK_Vessel', 'HLT_Vessel']);
console.log('chilleroverlay ok');
