// A Pump with no pipes on it always has free IPs (OakBarn Brewery, 2026-11-19: "A Pump with No attached Pipes always have free IPs";
// "assign inlet outlet IPs one of the 8 each"; Rule 5.37): a new pump dropped near where the old one let go of its pipes slides onto
// them, and its Inlet and Outlet go on the spots where the old Inlet and Outlet were, whichever side they were on.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const cut = (a, b) => app.slice(app.indexOf(a), app.indexOf(b));
const src = [app.match(/^const PUMP_SPOTS = .*$/m)[0], cut('const SNAP_PX', '// a pump or valve can swap places')].join('\n');
// a pump here: a 150 x 150 box, its Inlet starts Right Middle and its Outlet Top Right (a Skynet pump, not flipped)
const at = (e, code) => [e.x + PS[code][0] * 150, e.y + PS[code][1] * 150];
const PS = { TL: [0, 0], TM: [0.5, 0], TR: [1, 0], RM: [1, 0.5], BR: [1, 1], BM: [0.5, 1], BL: [0, 1], LM: [0, 0.5] };
const spots = e => [e.pumpIn || 'RM', e.pumpOut || 'TR'];
const make = draft => new Function('draft', 'grabJoins', 'spotPump', 'isTapMv', 'isMv', 'ownCoupling', 'pumpEndAt', 'pumpSpots', 'pumpSpotStart', 'ipPoint', 'hbSpots', 'hbEndAt',
  `${src}\nreturn freeIpsTake;`)(draft, it => draft.graphics.filter(p => p.kind === 'pipe' && [p.from, p.to].some(x => String(x).startsWith(`dev:${it.name}:`))),
  e => e.subtype === 'pump', () => false, () => false, (id, p) => draft.graphics.find(g => g.id === id && g.kind === 'ip' && !g.attachTo),
  (e, end, code) => at(e, code), spots, () => ['RM', 'TR'], (id, ws) => { const [, n, end] = id.split(':'); const e = draft.elements.find(x => x.name === n); return e && at(e, spots(e)[end === 'in' ? 0 : 1]); },
  () => [], () => null);
// the 3 Vessel sample: its old pump (Left, Inlet Left Middle, Outlet Top Left at 1181,728) let go; both open ends remember it
const lay = () => ({
  elements: [{ name: 'Blich', subtype: 'pump', workspace: 'BH', x: 1500, y: 450 }],
  graphics: [{ kind: 'pipe', workspace: 'BH', from: 'a', to: 'c1', points: [[879, 803], [1181, 803]] }, { kind: 'ip', id: 'c1', wasAt: [1181, 803], wasEnd: 'in' },
    { kind: 'pipe', workspace: 'BH', from: 'c2', to: 'b', points: [[1181, 728], [1181, 707]] }, { kind: 'ip', id: 'c2', wasAt: [1181, 728], wasEnd: 'out' }],
});
for (const [dx, dy] of [[0, 0], [12, 12], [-20, -20], [25, -10]]) {
  const d = lay(), p = d.elements[0]; Object.assign(p, { x: 1181 + dx, y: 728 + dy });
  assert.equal(make(d)(p), true, `dropped ${dx},${dy} off: it takes the pipes`);
  assert.deepEqual([p.x, p.y], [1181, 728], 'it slides the last few pixels onto them');
  assert.deepEqual([p.pumpIn, p.pumpOut], ['LM', 'TL'], 'its Inlet and Outlet go where the old ones were (Left Middle, Top Left)');
}
{ const d = lay(), p = d.elements[0]; Object.assign(p, { x: 1181 + 45, y: 728 + 45 });
  assert.equal(make(d)(p), false, 'dropped far off: nothing moves'); assert.deepEqual([p.x, p.y, p.pumpIn], [1226, 773, undefined]); }
{ const d = lay(), p = d.elements[0]; Object.assign(p, { x: 1181, y: 728 }); d.graphics.push({ kind: 'pipe', workspace: 'BH', from: 'dev:Blich:out', to: 'z', points: [] });
  assert.equal(make(d)(p), false, 'a pump with a pipe on it keeps its IPs'); }
assert.match(app, /took = ids\.size && freeIpsTake\(drag\.item\)/, 'a dropped item takes the let-go ends before rejoinLetGo joins them');
console.log('freeips: ok');
