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
assert.equal(t.probeStyle, 'front', 'the Probe sits on the Center Probe spot');
// Fritz's Vessel IP Template drawing (2026-11-05): 15 IPs, the Right side repeated on the Left, plus the Probe and the Element Port
const ipSpots = ['rSparge', 'rHermsIn', 'rHermsOut', 'rElement', 'lSparge', 'lHermsIn', 'lHermsOut', 'lElement', 'lBackElement', 'rBackElement', 'cBackElement',
  'cProbe', 'lTangential', 'rTangential', 'cOutlet', 'cBottomOutlet'];
const spots = [...ipSpots, 'thermowell', 'element'];
assert.deepEqual(Object.keys(t.ports).sort(), [...spots].sort(), 'every spot');
for (const k of spots) assert.equal(t.ports[k].installed, true, `${k} is Placed on the Template`);
assert.ok(isVesselWidget({ ...t, cls: 'skynet' }), 'a Skynet Vessel Widget, so a User Bundled Template can be built on it');
assert.ok(fs.existsSync(path.join(ROOT, 'media', t.image)), 'its picture');
assert.ok(read('lib/picgroups.js').includes("'Skynet_Vessel_Widget.svg'"), 'in the Vessels picture group');
// every spot has its position in the panel
for (const k of spots) assert.ok(app.includes(`['${t.ports[k].position}', `) || app.includes(`, '${t.ports[k].position}', `), `${t.ports[k].position} is a position`);
assert.ok(app.includes("['VW Front', 0.5, 0.8]"), 'the older Front probe spot');
assert.ok(app.includes("const VW_PROBE_POS = { thermowell: 'VW Left Thermowell', front: 'VW Center Probe' };"), 'a Front probe sits on the Center Probe spot');
// every IP spot: a Vessel Widget IP named as Fritz drew it, the Left a mirror of the Right
const names = { rSparge: 'Right Sparge', rHermsIn: 'Right HERMS In', rHermsOut: 'Right HERMS Out', rElement: 'Right Element', cProbe: 'Center Probe',
  lBackElement: 'Left Back Element', cBackElement: 'Center Back Element', rTangential: 'Right Tangential', cOutlet: 'Center Outlet', cBottomOutlet: 'Center Bottom Outlet' };
for (const [k, n] of Object.entries(names)) assert.ok(app.includes(`${k}: vwPt('${n}', `), `${k} is ${n}`);
const xy = k => { const m = app.match(new RegExp(`${k}: vwPt\\('[^']+', '[^']+', ([\\d.]+), ([\\d.]+)\\)`)); assert.ok(m, k); return [+m[1], +m[2]]; };
for (const s of ['Sparge', 'HermsIn', 'HermsOut', 'Element', 'BackElement', 'Tangential']) {
  const [rx, ry] = xy('r' + s), [lx, ly] = xy('l' + s);
  assert.equal(ry, ly, `${s}: Left at the same height as Right`); assert.ok(Math.abs(rx + lx - 1) < 0.002, `${s}: Left mirrors Right`);
}
for (const s of ['Sparge', 'HermsIn', 'HermsOut', 'Element']) assert.ok(xy('r' + s)[1] < 0.7, `${s} on the side wall`);
assert.ok(xy('rSparge')[1] < xy('rHermsIn')[1] && xy('rHermsIn')[1] < xy('rHermsOut')[1] && xy('rHermsOut')[1] < xy('rElement')[1], 'top to bottom');
assert.ok(xy('cProbe')[1] < xy('cOutlet')[1] && xy('cOutlet')[1] < xy('cBottomOutlet')[1], 'center spots top to bottom');
// only a Vessel Widget has them; each IP's Label starts the same as its Name and can be changed
assert.ok(app.includes("const vClassOf = t => t.vwidget && (t.vesselType || 'vessel') === 'vessel' && !t.integrated ? vwClassOf(t) : EQ[t.vesselType] || EQ.vessel;"));
assert.ok(app.includes("if (!t.userIps?.length) return EQ_VW;"), 'the Main Template IPs, plus a picked User IP (Rule 5.31, 2026-11-09)');
assert.ok(app.includes("if (d.vw) g.ports[k].label = q.label || d.name;"), 'Label starts as the Name');
assert.ok(app.includes("work.ports[k].label = lbl[k] || d.name;"), 'an empty Label goes back to the Name');
assert.equal(cleanVessel({ ports: { rSparge: { installed: true, label: 'Whirlpool' } } }).ports.rSparge.label, 'Whirlpool', 'a Template keeps IP Labels');
// Place: not Placed is hidden, even in Edit layout, until 👁 Show All (Vessel Rules); the spots can't move; Properties have the sliders
assert.ok(app.includes("if (ghost && !(editing && vwPeek === g.id)) continue;"), 'not Placed: hidden until Show All');
assert.ok(app.includes("if (k in place) work.ports[k].installed = place[k];"), 'Place sliders set installed');
assert.ok(app.includes("'Vessel Widget Properties'"), 'its dialog title');
assert.equal(cleanVessel({ vwidget: true, probeStyle: 'front' }).probeStyle, 'front');
assert.equal(cleanVessel({ vwidget: 'yes' }).vwidget, undefined, 'only true makes one');
// Help
assert.deepEqual(graphicTopic({ kind: 'vessel', vesselType: 'vessel', vwidget: true, template: 'Skynet_Vessel_Widget', templateCls: 'skynet' }), ['vessel-widget']);
assert.ok(read('help/133-vessel-widget.md').includes('TC, NPT or BSP'), 'Help explains vessel IPs');
// the Three Vessel sample: its vessels are Vessel Devices built from the Main Template (Fritz, 2026-11-07: "Vessels Devices"),
// their probes and heaters built into the Left and Right Element IPs
const c = JSON.parse(read('samples/configs/three-vessel-one-pump/config.json'));
const want = { HLT_Vessel: ['cBottomOutlet', 'lElement', 'rElement'], MLT_Vessel: ['cBottomOutlet', 'lSparge', 'lElement'], BK_Vessel: ['cBottomOutlet', 'lSparge', 'lElement', 'rElement'] };
const parts = { HLT_Vessel: { lElement: ['BM_700_1W_HLT_BR', 'thermowell'], rElement: ['BM_8_HE_HLT~element_BR', 'element'] }, MLT_Vessel: { lElement: ['BM_701_1W_Mash_BR', 'thermowell'] },
  BK_Vessel: { lElement: ['BM_702_1W_Kettle_BR', 'thermowell'], rElement: ['BM_9_HE_Kettle~element_BR', 'element'] } };
for (const [n, on] of Object.entries(want)) {
  const v = c.graphics.find(g => g.name === n);
  assert.ok(v?.vwidget && v.vdevice && v.template === 'Skynet_Vessel_Widget', `${n} is a Vessel Device`);
  assert.deepEqual(Object.keys(v.ports).filter(k => v.ports[k].installed).sort(), [...on].sort(), `${n} Places`);
  const ips = c.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id).map(g => g.port).sort();
  assert.deepEqual(ips, [...on].sort(), `${n}: an IP for each Placed IP`);
  for (const [k, [dev, kind]] of Object.entries(parts[n])) {
    const e = c.elements.find(x => x.name === dev);
    assert.deepEqual([e.integratedIn, e.integratedAs, e.vpKind], [v.id, 'ip:' + k, kind], `${dev} is built into ${n}`);
  }
  for (const ip of c.graphics.filter(g => g.kind === 'ip' && g.attachTo === v.id))
    for (const p of c.graphics.filter(g => g.kind === 'pipe' && (g.from === ip.id || g.to === ip.id))) {
      const end = p.from === ip.id ? p.points[0] : p.points.at(-1);
      assert.deepEqual(end, [ip.x + 15, ip.y + 15], `${p.id} ends on ${ip.id}`);
    }
}
// the built in heaters are Heating Elements starting in Hysteresis (Rule 6.19), so they have the Heating method field and spots;
// the Processes still set .target and .enabled
{ const hlt = c.elements.find(e => e.name === 'BM_8_HE_HLT~element_BR'); assert.deepEqual([hlt.type, hlt.subtype, hlt.heatMethod], ['digitalOut', 'element', 'hysteresis']); }
assert.ok(!c.graphics.some(g => ['img_HLT', 'img_MLT', 'img_BK'].includes(g.id)), 'the old pictures went');
console.log('vessel widget ok');

// The Vessel Device (Fritz, 2026-11-05, one exception to Rules 5.7 and 5.31): built from a Vessel Widget Template, with parts
// (Element, Probe, Thermowell, Valve) built into its IPs like the RIMS tube, a HERMS coil on the Left or Right HERMS IPs, and no
// way back once built and saved
assert.ok(app.includes("if (t.vwidget && !t.integrated) g.vdevice = true;"), 'built from a Vessel Widget Template: a Vessel Device');
for (const k of ['element', 'probe', 'thermowell', 'valve']) assert.ok(app.includes(`['${k}', `), `a ${k} can go on an IP`);
assert.ok(app.includes("const HERMS_SIDES = { left: ['lHermsIn', 'lHermsOut'], right: ['rHermsIn', 'rHermsOut'], crossRL: ['lHermsIn', 'rHermsOut'], crossLR: ['rHermsIn', 'lHermsOut'] };"), 'HERMS coil Left, Right or crossed (Rule 5.31, 2026-11-09)');
assert.ok(app.includes("if (vpHermsOn(v, k)) return { key: `eq:${v.id}:herms`, pass: true };"), 'the coil joins its two IPs');
assert.ok(app.includes("return e.vpKind === 'valve' && isOn(e.name) ? null : { closed: true };"), 'a part fills its IP; a valve passes flow only while on');
assert.ok(app.includes("const vpLocked = g => !!g?.vbBuilt || !!S.config.graphics.find(x => x.id === g.id && x.workspace && !S.config.workspaces.find(w => w.name === x.workspace)?.build);"), 'locked once built (the Builder) or built and saved');
assert.ok(app.includes("if (vdev && vpLocked(it)) return vdevDone(it);"), 'integrated: only Name, Type, Label, the parts and Label and place (2026-11-09)');
assert.ok(app.includes("['vtype', 'Type', 'ro', it.vtype || '']") && app.includes("['name', 'Name', 'lockname']"), 'Type greyed out, Name with Change name');
assert.ok(app.includes("...vpSections(it, true), ...VESSEL_FLOW(it),"), 'integrated: the Heater and Probe sections are editable');
assert.ok(app.includes("vpApply = () => { const swaps = vpxApply(item, vpx);"), 'their changes are saved onto the parts, and a part can be swapped');
assert.ok(app.includes("for (const k of ['integratedIn', 'integratedAs', 'vpKind']) delete e[k];"), 'a swapped out part stays as a Device of its own');
assert.ok(app.includes("for (const k of Object.keys(work.ports)) work.ports[k].installed = !!item.ports?.[k]?.installed;"), 'locked: Place does not change');
assert.ok(app.includes("...(vdev && vpLocked(it) ? [] : looseField(it))"), 'locked: no un-bundling');
assert.ok(app.includes("integratedIn: g.id, integratedAs: 'ip:' + k, vpKind: kind"), 'its parts are built in, like the RIMS tube');
assert.ok(app.includes('const hasIps = e => e && !isVPart(e) &&'), 'a built-in valve has no IPs of its own');
assert.ok(read('help/133-vessel-widget.md').includes('## The Vessel Device'), 'Help explains the Vessel Device');
assert.ok(read('docs/Skynet_Rules.md').includes('**The Vessel Device** (*one exception* to Rules 5.7 and this Rule'), 'the exception is in the Rules');
console.log('vessel device ok');

// Plugged IPs are hidden (Fritz, 2026-11-07): an End Cap, or a Vessel Device's built in Element, Probe or Thermowell, plugs its IP;
// only open IPs show (a built in Valve passes flow, so its IP still shows)
{
  const src = app.match(/function cappedIps\(\) \{[\s\S]*?\n\}/)[0];
  const graphics = [
    { id: 'v1', kind: 'vessel', vdevice: true },
    { id: 'a', kind: 'ip', attachTo: 'v1', port: 'lElement' }, { id: 'b', kind: 'ip', attachTo: 'v1', port: 'rElement' },
    { id: 'c', kind: 'ip', attachTo: 'v1', port: 'cProbe' }, { id: 'd', kind: 'ip', attachTo: 'v1', port: 'cOutlet' },
    { id: 'e', kind: 'ip', attachTo: 'v1', port: 'lTangential' }, { id: 'f', kind: 'ip' }, { id: 'cap', kind: 'cap', capOn: 'f' }];
  const elements = [{ integratedIn: 'v1', integratedAs: 'ip:lElement', vpKind: 'thermowell' }, { integratedIn: 'v1', integratedAs: 'ip:rElement', vpKind: 'element' },
    { integratedIn: 'v1', integratedAs: 'ip:cProbe', vpKind: 'probe' }, { integratedIn: 'v1', integratedAs: 'ip:cOutlet', vpKind: 'valve' }];
  const cappedIps = new Function('L', 'isCap', 'isVPart', src + '; return cappedIps;')(() => ({ graphics, elements }), g => g.kind === 'cap', e => String(e?.integratedAs || '').startsWith('ip:'));
  assert.deepEqual([...cappedIps()].sort(), ['a', 'b', 'c', 'f'], 'Thermowell, Element, Probe and End Cap plug their IPs; the Valve and the open Tangential show');
}
console.log('vwidget ok (plugged IPs)');
