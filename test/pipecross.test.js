// A pipe that crosses another with no joint never looks joined (OakBarn Brewery, 2026-11-20, Rule 5.44): node test/pipecross.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeCrossings, crossBox } from '../public/pipecross.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pipe = (id, points, more = {}) => ({ id, kind: 'pipe', workspace: 'T', points, ...more });

// a level pipe and an up-and-down pipe crossing in the middle of both: the up-and-down one is in front
let x = pipeCrossings([pipe('v', [[100, 0], [100, 200]]), pipe('h', [[0, 100], [200, 100]])]);
assert.equal(x.length, 1);
assert.equal(x[0].front.id, 'v'); assert.equal(x[0].back.id, 'h'); assert.deepEqual(x[0].at, [100, 100]);
x = pipeCrossings([pipe('h', [[0, 100], [200, 100]]), pipe('v', [[100, 0], [100, 200]])]);
assert.equal(x[0].front.id, 'v', 'whatever the order, the up-and-down pipe is in front');

// joints are never crossings: a tee (an end on the other pipe), an elbow (ends meeting), pipes in line
assert.equal(pipeCrossings([pipe('a', [[0, 100], [200, 100]]), pipe('b', [[100, 100], [100, 200]])]).length, 0, 'tee');
assert.equal(pipeCrossings([pipe('a', [[0, 100], [100, 100]]), pipe('b', [[100, 100], [100, 200]])]).length, 0, 'elbow');
assert.equal(pipeCrossings([pipe('a', [[0, 100], [100, 100]]), pipe('b', [[100, 100], [200, 100]])]).length, 0, 'in line');
assert.equal(pipeCrossings([pipe('a', [[0, 100], [200, 100]]), pipe('b', [[0, 120], [200, 120]])]).length, 0, 'side by side');
// hoses and other Tabs are left as drawn
assert.equal(pipeCrossings([pipe('v', [[100, 0], [100, 200]], { hose: true }), pipe('h', [[0, 100], [200, 100]])]).length, 0, 'hose');
assert.equal(pipeCrossings([pipe('v', [[100, 0], [100, 200]], { workspace: 'U' }), pipe('h', [[0, 100], [200, 100]])]).length, 0, 'other Tab');
// a bent pipe crossing on its second piece
x = pipeCrossings([pipe('l', [[0, 0], [100, 0], [100, 200]]), pipe('h', [[0, 100], [200, 100]])]);
assert.equal(x.length, 1); assert.equal(x[0].front.id, 'l'); assert.deepEqual(x[0].seg, [[100, 0], [100, 200]]);

// the box round the crossing: along the front pipe as wide as the back pipe plus its edges, across a little wider than the front pipe
const box = crossBox({ at: [100, 100], seg: [[100, 0], [100, 200]] }, 10, 20);
const ys = box.map(q => q[1]), xs = box.map(q => q[0]);
assert.ok(Math.max(...ys) - Math.min(...ys) > 20 && Math.max(...ys) - Math.min(...ys) < 30);
assert.ok(Math.max(...xs) - Math.min(...xs) > 10 && Math.max(...xs) - Math.min(...xs) < 20);

// the 3 Vessel 1 Pump sample's Brew House: its crossings went with the bottom drain header (OakBarn Brewery, 2026-11-26: Low Center
// Outlets with hoses to the pump replace the bottom drains); any crossing it has has the up-and-down pipe in front
const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'configs', 'three-vessel-one-pump', 'config.json'), 'utf8'));
const bh = pipeCrossings(c.graphics.filter(g => g.kind === 'pipe' && g.workspace === 'Brew House'));
assert.equal(bh.length, 0, 'no crossings left on the Brew House');
for (const k of bh) assert.equal(k.seg[0][0], k.seg[1][0], `${k.front.name} in front is the up-and-down pipe`);

// the Panel draws them (Rule 5.44)
const app = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
assert.match(app, /pipeCrossings\(pipes\)/);
const rules = fs.readFileSync(path.join(ROOT, 'docs', 'Skynet_Rules.md'), 'utf8');
assert.match(rules, /^5\.44 \*\*A pipe that crosses another pipe with no joint never looks joined\*\*/m);
console.log('pipecross: ok');
