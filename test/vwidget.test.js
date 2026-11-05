// The Vessel Widget class (Fritz, 2026-11-05, Rule 5.31, Help 133): one Skynet Template with every IP, one Temperature Probe
// (Thermowell or Front) and one Element Port, each with a Place slider (all on); the Three Vessel sample's vessels use it.
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanVessel, isVesselWidget } from '../public/templates.js';
import { graphicTopic } from '../public/helpmap.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const app = read('public/app.js');

// the Template: every spot Placed, a Vessel Widget, and its picture is a Skynet one
const t = cleanVessel(JSON.parse(read('templates/vessel/Skynet_Vessel_Widget.json')));
assert.equal(t.vwidget, true, 'a Vessel Widget');
assert.equal(t.probeStyle, 'thermowell');
const spots = ['outlet', 'outlet2', 'tangential', 'topInlet', 'sparge', 'cip', 'steamSlayer', 'thermowell', 'element'];
assert.deepEqual(Object.keys(t.ports).sort(), [...spots].sort(), 'every spot');
for (const k of spots) assert.equal(t.ports[k].installed, true, `${k} is Placed on the Template`);
assert.ok(isVesselWidget({ ...t, cls: 'skynet' }), 'a Skynet Vessel Widget, so a User Bundled Template can be built on it');
assert.ok(fs.existsSync(path.join(ROOT, 'media', t.image)), 'its picture');
assert.ok(read('lib/picgroups.js').includes("'Skynet_Vessel_Widget.svg'"), 'in the Vessels picture group');
// every spot has its position in the panel
for (const k of spots) assert.ok(app.includes(`['${t.ports[k].position}', `), `${t.ports[k].position} is a position`);
assert.ok(app.includes("['VW Front', 0.5, 0.8]"), 'the Front probe spot');
// Place: not Placed is hidden, even in Edit layout, until 👁 Show All (Vessel Rules); the spots can't move; Properties have the sliders
assert.ok(app.includes("if (ghost && !(editing && vwPeek === g.id)) continue;"), 'not Placed: hidden until Show All');
assert.ok(app.includes("if (k in place) work.ports[k].installed = place[k];"), 'Place sliders set installed');
assert.ok(app.includes("'Vessel Widget Properties'"), 'its dialog title');
assert.equal(cleanVessel({ vwidget: true, probeStyle: 'front' }).probeStyle, 'front');
assert.equal(cleanVessel({ vwidget: 'yes' }).vwidget, undefined, 'only true makes one');
// Help
assert.deepEqual(graphicTopic({ kind: 'vessel', vesselType: 'vessel', vwidget: true, template: 'Skynet_Vessel_Widget', templateCls: 'skynet' }), ['vessel-widget']);
assert.ok(read('help/133-vessel-widget.md').includes('TC, NPT or BSP'), 'Help explains vessel IPs');
// the Three Vessel sample
const c = JSON.parse(read('samples/configs/three-vessel-one-pump/config.json'));
const want = { HLT_Vessel: ['outlet', 'thermowell', 'element'], MLT_Vessel: ['outlet', 'topInlet', 'thermowell'], BK_Vessel: ['outlet', 'topInlet', 'thermowell', 'element'] };
for (const [n, on] of Object.entries(want)) {
  const v = c.graphics.find(g => g.name === n);
  assert.ok(v?.vwidget && v.template === 'Skynet_Vessel_Widget', `${n} is a Vessel Widget`);
  assert.deepEqual(Object.keys(v.ports).filter(k => v.ports[k].installed).sort(), [...on].sort(), `${n} Places`);
  const ips = c.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id).map(g => g.port).sort();
  assert.deepEqual(ips, on.filter(k => !['thermowell', 'element'].includes(k)).sort(), `${n}: an IP for each Placed opening`);
  for (const ip of c.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id))
    for (const p of c.graphics.filter(g => g.kind === 'pipe' && (g.from === ip.id || g.to === ip.id))) {
      const end = p.from === ip.id ? p.points[0] : p.points.at(-1);
      assert.deepEqual(end, [ip.x + 15, ip.y + 15], `${p.id} ends on ${ip.id}`);
    }
}
assert.ok(!c.graphics.some(g => ['img_HLT', 'img_MLT', 'img_BK'].includes(g.id)), 'the old pictures went');
console.log('vessel widget ok');
