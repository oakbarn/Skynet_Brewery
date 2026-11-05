// Sight Glasses (Fritz, 2026-11-05, Rule 5.32): two TC Pipe Fittings, plain and Caged, whose Length stretches only the glass.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { sightGlassSvg, sgRatio, sgLength, SG_H, SG_INCH } from '../public/pipefit.js';
import { cleanFitting } from '../public/templates.js';
import { graphicTopic } from '../public/helpmap.js';

const ROOT = path.join(import.meta.dirname, '..');
const tpl = n => JSON.parse(fs.readFileSync(path.join(ROOT, 'templates', 'fitting', n + '.json'), 'utf8'));
for (const [n, caged] of [['Sight_Glass', false], ['Sight_Glass_Caged', true]]) {
  const t = cleanFitting(tpl(n));
  assert.equal(t.fittings[0].kind, 'sightGlass', `${n} is a sight glass`);
  assert.equal(!!t.fittings[0].caged, caged, `${n} caged flag kept`);
  assert.deepEqual(t.ipPos, { start: '0,0.5', end: '1,0.5' }, `${n} IPs on the ferrule faces`);
  assert.equal(t.bend, '0.5,0.5');
  assert.ok(fs.existsSync(path.join(ROOT, 'media', t.image)), `${n} picture exists`);
  assert.deepEqual(graphicTopic({ kind: 'vessel', vesselType: 'bfit', templateCls: 'skynet', fittings: t.fittings }), ['sight-glasses']);
}
// Length: inches, 2 to 48, quarter inches, 6 by default
assert.equal(sgLength(''), 6); assert.equal(sgLength(1), 2); assert.equal(sgLength(100), 48); assert.equal(sgLength(4.1), 4);
assert.ok(Math.abs(sgRatio(12) / sgRatio(6) - 2) < 1e-9, 'twice the Length is twice as long');
// only the glass stretches: the ferrules are the same width at any length, and the viewBox follows the ratio
const ferrule = s => (s.match(/<rect x="1" y="1" width="([\d.]+)" height="56"/) || [])[1];
const short = sightGlassSvg(sgRatio(3), false), long = sightGlassSvg(sgRatio(24), true);
assert.equal(ferrule(short), ferrule(long));
assert.ok(long.includes(`viewBox="0 0 ${Math.round(24 * SG_INCH * 100) / 100} ${SG_H}"`));
assert.ok(!short.includes('#a9aeb4') && long.includes('#a9aeb4'), 'only the Caged one has a cage');
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.ok(/TC_FIT_ADD = \[[^\]]*'Sight_Glass', 'Sight_Glass_Caged'/.test(app), 'both on the Add lists');
console.log('sightglass ok');
