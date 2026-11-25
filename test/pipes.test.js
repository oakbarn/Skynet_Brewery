// Rule 5.19 (Fritz, 2026-11-02): pipes run only Horizontal, Vertical or 45 and turn only at a fitting
import test from 'node:test';
import assert from 'node:assert/strict';
import { dirOf, onAngle, angledEnd, alongLine, fitFor, inLine } from '../public/pipefit.js';
import { straightenPipes } from '../lib/pipes.js';

test('only Horizontal, Vertical and 45 are allowed angles', () => {
  assert.equal(onAngle([0, 0], [100, 0]), true);
  assert.equal(onAngle([0, 0], [0, -50]), true);
  assert.equal(onAngle([0, 0], [40, 40]), true);
  assert.equal(onAngle([0, 0], [-40, 40]), true);
  assert.equal(onAngle([0, 0], [100, 30]), false);
  assert.equal(onAngle([5, 5], [5, 5]), false);
});

test('drawing snaps the end to the nearest allowed line', () => {
  assert.deepEqual(angledEnd([0, 0], [100, 10]).c, [100, 0]);
  assert.deepEqual(angledEnd([0, 0], [8, 100]).c, [0, 100]);
  assert.deepEqual(angledEnd([0, 0], [52, 48]).c, [50, 50]);
  assert.deepEqual(angledEnd([0, 0], [-52, 48]).c, [-50, 50]);
  assert.equal(dirOf(1, 1), 1); assert.equal(dirOf(0, -1), 6); assert.equal(dirOf(-1, 0), 4);
  assert.deepEqual(alongLine([0, 0], 0, [70, 25]), [70, 0]);
  assert.deepEqual(alongLine([0, 0], 1, [60, 40]), [50, 50]);
});

test('joints get the fitting the pipes need, turned the right way', () => {
  assert.deepEqual(fitFor([4, 2]), { fitting: 'elbow90', rotate: '0', ok: true });
  assert.deepEqual(fitFor([6, 0]), { fitting: 'elbow90', rotate: '180', ok: true });     // up and right
  assert.deepEqual(fitFor([4, 1]), { fitting: 'elbow45', rotate: '0', ok: true });
  assert.equal(fitFor([0, 3]).fitting, 'elbow45');
  assert.deepEqual(fitFor([0, 4]), { fitting: 'coupling', rotate: '0', ok: true });
  assert.deepEqual(fitFor([2, 6]), { fitting: 'coupling', rotate: '90', ok: true });
  assert.equal(fitFor([0, 4, 6]).fitting, 'tee');
  assert.equal(fitFor([0, 2, 4, 6]).fitting, 'cross');
  assert.equal(fitFor([0, 1]).ok, false);           // 45 degrees apart: no fitting does that
});

test('an older pipe with bends is cut into straight pipes joined by elbows', () => {
  const c = { elements: [], graphics: [
    { id: 'p1', kind: 'pipe', name: 'Pipe_1', workspace: 'T', from: 'a', to: 'b', points: [[0, 0], [0, 100], [200, 100]], color: '#111' },
    { id: 'h1', kind: 'pipe', hose: true, workspace: 'T', points: [[0, 0], [33, 70], [90, 10]] },
    { id: 'p2', kind: 'pipe', workspace: 'T', from: 'c', to: 'd', points: [[0, 0], [100, 0]] }] };
  const report = straightenPipes(c);
  assert.equal(report.length, 1);
  const pipes = c.graphics.filter(g => g.kind === 'pipe' && !g.hose);
  assert.equal(pipes.length, 3);
  assert.ok(pipes.every(p => p.straight && p.points.length === 2 && onAngle(p.points[0], p.points[1])));
  const [first, second] = pipes.filter(p => p.id.startsWith('p1'));
  const elbow = c.graphics.find(g => g.kind === 'ip');
  assert.equal(elbow.fitting, 'elbow90');
  assert.equal(elbow.rotate, '180');                 // arms up (N) and right (E)
  assert.equal(first.from, 'a'); assert.equal(first.to, elbow.id);
  assert.equal(second.from, elbow.id); assert.equal(second.to, 'b');
  assert.equal(first.name, 'Pipe_1'); assert.equal(second.name, 'Pipe_2'); assert.equal(second.color, '#111');
  assert.deepEqual(c.graphics.find(g => g.id === 'h1').points, [[0, 0], [33, 70], [90, 10]]);     // hoses bend: left alone
  assert.deepEqual(straightenPipes(c), []);          // once is enough
});

test('a piece at another angle is turned, and lets go of an IP it no longer reaches', () => {
  const c = { graphics: [{ id: 'p', kind: 'pipe', workspace: 'T', from: 'a', to: 'b', points: [[0, 0], [100, 30]] }] };
  straightenPipes(c);
  const p = c.graphics.find(g => g.id === 'p'), end = c.graphics.find(g => g.kind === 'ip');
  assert.deepEqual(p.points, [[0, 0], [100, 0]]);
  assert.equal(p.from, 'a'); assert.equal(p.to, end.id); assert.equal(end.fitting, 'coupling');
});

test('the shipped sample Schemas and the default Schema follow the rule', async () => {
  const fs = await import('node:fs');
  for (const f of ['config/brewery.json', 'samples/configs/three-vessel-one-pump/config.json']) {   // the other Schemas wait in Sandbox/ (Rule 16.8)
    const c = JSON.parse(fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8'));
    for (const p of (c.graphics || []).filter(g => g.kind === 'pipe' && !g.hose)) {
      assert.ok(p.straight && p.points.length === 2 && onAngle(p.points[0], p.points[1]), `${f}: ${p.id}`);
    }
    assert.deepEqual(straightenPipes(c), [], f);
  }
});

// Rule 5.26 (Fritz, 2026-11-04): a pump or valve put on a pipe cuts it
import { splitAt } from '../public/pipefit.js';
const BOX = { x: 100, y: 80, w: 100, h: 60 };
const PUMP = [{ id: 'in', c: [200, 112], f: [1, 0] }, { id: 'out', c: [180, 80], f: [0, -1] }];     // inlet faces right, outlet up
const VALVE = [{ id: 'l', c: [100, 112], f: [-1, 0] }, { id: 'r', c: [200, 112], f: [1, 0] }];

test('a valve between the ends cuts the pipe into two straight pipes', () => {
  const r = splitAt([0, 110], [400, 110], BOX, VALVE);
  assert.equal(r.ok, true); assert.deepEqual(r.shift, [0, -2]); assert.deepEqual(r.joints, []);
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'l', pts: [[0, 110], [100, 110]] }, { from: 'r', to: 'B', pts: [[200, 110], [400, 110]] }]);
});

test('a pump between the ends: one piece straight in, the other round with elbows', () => {
  const r = splitAt([0, 110], [400, 110], BOX, PUMP);
  assert.equal(r.ok, true); assert.equal(r.mode, 'mid'); assert.equal(r.joints.length, 3);
  assert.deepEqual(r.pieces[0], { from: 'in', to: 'B', pts: [[200, 110], [400, 110]] });
  for (const p of r.pieces) assert.ok(onAngle(p.pts[0], p.pts[1]) && (p.pts[0][0] === p.pts[1][0] || p.pts[0][1] === p.pts[1][1]), 'every piece is level or up and down');
  assert.equal(r.pieces.at(-1).from, 'A'); assert.deepEqual(r.pieces.at(-1).pts[1], r.joints[2]);
  assert.equal(r.joints[2][1], 110);                     // back on the pipe's line
  assert.ok(r.joints[1][0] < BOX.x);                      // past the side of the pump
});

test('over an open end the pipe is made shorter; an end on a tee is left alone', () => {
  const box = { x: 300, y: 80, w: 100, h: 60 }, ports = [{ id: 'in', c: [300, 110], f: [-1, 0] }, { id: 'out', c: [380, 80], f: [0, -1] }];
  const r = splitAt([0, 110], [350, 110], box, ports, { bOpen: true });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, 'B');
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'in', pts: [[0, 110], [300, 110]] }]);
});

test('over an end on a tee: it slides back clear of the tee and both IPs are joined (Fritz: "it needs both IPs")', () => {
  const box = { x: 300, y: 80, w: 100, h: 60 }, valve = [{ id: 'l', c: [300, 110], f: [-1, 0] }, { id: 'r', c: [400, 110], f: [1, 0] }];
  const r = splitAt([0, 110], [350, 110], box, valve, { bOpen: false });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, null);
  assert.deepEqual(r.shift, [-115, 0]);                   // its right IP is now 65 short of the tee
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'l', pts: [[0, 110], [185, 110]] }, { from: 'r', to: 'B', pts: [[285, 110], [350, 110]] }]);
  const pump = splitAt([0, 110], [350, 110], box, [{ id: 'in', c: [300, 110], f: [-1, 0] }, { id: 'out', c: [380, 80], f: [0, -1] }], { bOpen: false });
  assert.equal(pump.ok, true); assert.equal(pump.pieces.at(-1).to, 'B'); assert.deepEqual(pump.pieces.at(-1).pts[1], [350, 110]);
  assert.equal(splitAt([250, 110], [350, 110], box, valve, { bOpen: false }).ok, false);     // too short to put it in
});

test('nothing is cut when the pipe passes by, is at 45, or there is no room to go round', () => {
  assert.equal(splitAt([0, 300], [400, 300], BOX, PUMP), null);
  assert.equal(splitAt([0, 0], [300, 300], BOX, PUMP), null);
  assert.equal(splitAt([90, 110], [400, 110], BOX, PUMP).ok, false);
});

// Rule 5.25 (Fritz, 2026-11-05): a tee or a cross dropped on a pipe cuts it there
import { fitOnPipe } from '../public/pipefit.js';
const TEE = [{ id: 'w', c: [170, 203], v: [-1, 0] }, { id: 'e', c: [230, 203], v: [1, 0] }, { id: 's', c: [200, 240], v: [0, 1] }];
const BEND = [200, 203];

test('a tee dropped between the ends of a level pipe cuts it in two on its run', () => {
  const r = fitOnPipe([0, 200], [400, 200], BEND, TEE);
  assert.equal(r.ok, true); assert.equal(r.mode, 'mid'); assert.deepEqual(r.shift, [0, -3]);
  assert.deepEqual(r.pieces, [{ from: 'A', to: 'w', pts: [[0, 200], [170, 200]] }, { from: 'e', to: 'B', pts: [[230, 200], [400, 200]] }]);
});

test('a tee whose run is across the pipe asks to be turned; a pipe that passes by is left alone', () => {
  assert.deepEqual(fitOnPipe([200, 0], [200, 400], BEND, TEE), { ok: false, turn: true });
  assert.equal(fitOnPipe([0, 260], [400, 260], BEND, TEE), null);
  assert.equal(fitOnPipe([300, 200], [400, 200], BEND, TEE), null);
});

test('a tee dropped over an open end makes the pipe shorter; over a joined end it says why', () => {
  const r = fitOnPipe([180, 200], [400, 200], BEND, TEE, { aOpen: true });
  assert.equal(r.ok, true); assert.equal(r.mode, 'end'); assert.equal(r.drop, 'A');
  assert.deepEqual(r.pieces, [{ from: 'e', to: 'B', pts: [[230, 200], [400, 200]] }]);
  assert.equal(fitOnPipe([180, 200], [400, 200], BEND, TEE).ok, false);
});
// A turned elbow or tee is drawn once (Fritz, 2026-11-08: "extra Gray parts that are not part of an elbow or a Tee"): its turned
// picture only, never a second unturned copy as the box's background behind it.
test('a Skynet pipe fitting is drawn once', async () => {
  const app = (await import('node:fs')).readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /else if \(g\.image && !isUnit\(\{ \.\.\.g, loose: false \}\)\) n\.style\.backgroundImage/);
});

// A saved pipe's length, a saved hose's shape (OakBarn Brewery, 2026-11-15, Rule 5.37): a let-go end has a handle and can be dragged,
// it is grabbed before the pump, valve or vessel IP it sits on, and dropped on an IP that end (only) joins it
test('a let-go end of a pipe or hose can be dragged and joins an IP it is dropped on', async () => {
  assert.deepEqual(inLine([1208, 680], [1388, 680], [1385, 681]), [1385, 680], 'an IP a pixel off the line: the end stops level with it');
  assert.equal(inLine([1208, 680], [1388, 680], [1385, 690]), null, 'off to the side: no join');
  assert.equal(inLine([1208, 680], [1388, 680], [1100, 680]), null, 'behind the other end: no join');
  const app = (await import('node:fs')).readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /const oe = !noMove\(\) && !onFit && openEndAt\(p\);/, 'a let-go end comes first on a press, unless a fitting is under it');
  assert.match(app, /if \(cp && !onFit && endMoves/, 'a coupling on a fitting does not take the press (Rule 5.20: a Tee should win)');
  assert.match(app, /function fittingUnder\(ev\)/);
  assert.match(app, /if \(!openEnd\(p, i\)\) return !ipPoint\(i === 0 \? p\.from : p\.to, p\.workspace\);/, 'an end on no IP (red ring) can be grabbed');
  assert.match(app, /oe\.p\[k\] = endCoupling\(/, '... and gets its coupling so it can join an IP when dropped');
  assert.match(app, /const ZOOM_EDGE = 28, ZOOM_PAN = 8;/, 'the Zoom box moves its view near an edge with a button held');
  assert.match(app, /const propsDone = \(\) => setTimeout\(\(\) => \$\('#dlg\[open\] button\[value="ok"\]'\)\?\.click\(\), 0\);/, 'Unlock in Properties saves and closes it: one click (Rule 2.44)');
  assert.match(app, /const ipJoined = id =>/, 'a joined IP dot is green, an open one red');
  assert.match((await import('node:fs')).readFileSync(new URL('../public/style.css', import.meta.url), 'utf8'), /\.gfx\.ip\.joined:not\(\.fit\):not\(\.has-img\)::before \{ background: #1e9e3a; \}/);
  assert.ok(app.indexOf('const oe = !noMove() && !onFit && openEndAt(p);') < app.indexOf("const pip = ev.target.closest('.devip');"), '... before a pump or valve IP');
  assert.match(app, /return !L\(\)\.graphics\.find\(x => x\.id === \(i === 0 \? p\.from : p\.to\)\)\?\.locked;/, 'an end on a locked IP (No Unlock too) stays put');
  assert.match(app, /if \(!p \|\| p\.locked/, 'a locked pipe or hose stays put');
  assert.match(app, /endCouplingTo\(drag\.item, drag\.i\)/, 'a hose end takes its coupling with it');
  assert.match(app, /rejoinEnds\(null, drag\.item, drag\.i === 0 \? 'from' : 'to'\)/, 'dropped on an IP, only that end joins');
});

// Box-edge ends (OakBarn Brewery, 2026-11-23: "Make the connections at the edge of the box that look like the end of the valve or Pump"; Rule 5.29)
test('Skynet valves have no drawn-on pipe (IPs on their own ends); pump ends are TC ferrules', async () => {
  const fs = await import('node:fs'), dir = new URL('../media/Images/Skynet/Valves/', import.meta.url);
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const s = fs.readFileSync(new URL(f, dir), 'utf8');
    if (s.includes('data-valve-standard="1"')) assert.ok(!s.includes('fill="#8a8f96"'), f + ': no plain grey stub');
  }
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /class="pumpend"/, 'a pump Hose or Pipe ends in a ferrule');
  assert.match(app, /const VALVE_SKN = \{ h: VALVE_STD\.h, v: VALVE_STD\.v/, 'IPs on the ends of the cropped box');
});

// Rule 2.9 changed (OakBarn Brewery, 2026-11-24: "Can we make the drag and Hold (with the delay) universal"; "The right Drag and Hold
// can be deprecated as it too often brings up the help"; "can alt + Z = Zoom")
test('the left button held a moment drags outside Edit layout; the right button never drags; no Alt + Z', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /const HOLD_MS = 400;/, 'one hold time');
  assert.match(app, /holdThen\(ev, \(\) => qdGrab\(end, at\)/, 'a QD hose end moves after a left hold');
  assert.match(app, /holdThen\(ev, \(\) => chGrab\(c, at, false\)\)/, 'a chiller moves after a left hold');
  assert.match(app, /holdThen\(ev0, \(\) => tplDragGo\(at, btn, t\)\)/, 'a Template icon drags after a left hold');
  assert.match(app, /if \(ev\.pointerType === 'mouse' && ev\.button === 2\) return;/, 'the right button does not drag in Edit layout');
  assert.match(app, /ev\.altKey \|\| ev\.repeat \|\| ev\.key\.toLowerCase\(\) !== 'z'\) return;/, 'Z only, never Alt + Z (Rule 2.73)');
  assert.doesNotMatch(app, /'Move with Held Right Click'/, 'no right-drag hint left');
});

// Rule 5.37 changed (OakBarn Brewery, 2026-11-24: "the zoom box needs to be bigger ... + 50 px and fill the work area"; "inside the zoom Box,
// Click to open Tab Properties no longer works but only in the Zoom Box")
test('the Zoom box fills the work area with the whole manifold and never opens Tab settings', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /function zoomManifold\(x, y\)/);
  assert.match(app, /x0 = Math\.min\(\.\.\.xs\) - ZOOM_PAD/, '50 px all round');
  assert.match(app, /else if \(!zoomPassing\) editWorkspace\(\);/, 'no Tab settings from a double-click in the box');
  assert.match(app, /if \(kind === 'tab' && zoomPassing\) return;/, 'no Tab settings from a held press in the box');
});

// OakBarn Brewery, 2026-11-24: "On a property allow individual Unlock of an IP in addition to Unlock IPs" (Rule 5.37)
test('Properties have 🔓 Unlock one IP / one end next to Unlock its IPs', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /'🔓 Unlock one end ▾' : '🔓 Unlock one IP ▾'/);
  assert.match(app, /unlockJoins\(\[j\]\)/, 'only the picked one lets go');
});

// OakBarn Brewery, 2026-11-24: "just the red dot would match what we have rather than the red circle"; then, picked "Remove
// automatically": "they are not needed with a new Join" (Rule 5.37): a lost end is a plain end, leftover red dots go
test('a pipe end whose IP is deleted is left a plain end, and leftover red dots go when Edit layout opens', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  assert.match(app, /function openLostEnds\(d\)/);
  assert.match(app, /openLostEnds\(draft\);\s+\/\/ the pipe ends that were on it/, 'after a delete');
  assert.match(app, /centerOnPipes\(draft\); openLostEnds\(draft\); plainLonelyEnds\(draft\); \}/, 'and when Edit layout opens');
  const f = app.slice(app.indexOf('function openLostEnds(d)'), app.indexOf('function plainLonelyEnds(d)'));
  assert.match(f, /delete p\[k\]; p\[plain\] = true;/, 'no coupling, a plain end');
  assert.doesNotMatch(f, /endCoupling\(/);
  assert.match(css, /#ws\.editing \.gfx\.ip\.fit\.lonely::before \{[^}]*background: #e01b12/, 'a red dot');
});

// OakBarn Brewery, 2026-11-24: "Scroll Bars in the Zoom Box when needed" (Rule 5.37)
test('the Zoom box has scroll bars when the zoomed Tab is bigger, and the wheel scrolls', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /bar\.hidden = all <= view \+ 1;/, 'only when needed');
  assert.match(app, /frame\.addEventListener\('wheel'/);
  assert.match(app, /function zoomScrollTo\(lx, ly\)/);
});

// OakBarn Brewery, 2026-11-24: "On autoconfigure should have put in an elbow" (Rule 5.37)
test('Auto configure gives two open ends joined at a corner the fitting the corner needs', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const i = app.indexOf('rejoinEnds(new Set([tr.a.id, tr.b.id]));');
  assert.ok(i > 0);
  const after = app.slice(i, i + 2200);
  assert.match(after, /x\.fitting === 'coupling' && x\.autoFit\); if \(g && pipesOn\(g\.id, g\.workspace\)\.length >= 2\) autoFit\(g\);/);
});

// OakBarn Brewery, 2026-11-24: "Double click alone should add the elbow and open the Build Tab in edit mode. If I was on a Zoom Box,
// the Elbow should be in the Zoom Box" (Rule 5.25)
test('a TC Pipe Fitting is added with no Properties box, in the middle of the Zoom box when it is open', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const f = app.slice(app.indexOf('function addTcFit(name)'), app.indexOf('function tcArms(u)'));
  assert.doesNotMatch(f, /editItem\(/, 'no Properties box');
  assert.match(f, /const zb = editing && zoomBox \? zoomBox : null;\s+if \(!zb\) toBuild\(\);/);
  assert.match(f, /g\.x = Math\.round\(zb\.lx - g\.w \/ 2\); g\.y = Math\.round\(zb\.ly - g\.h \/ 2\);/);
});

// OakBarn Brewery, 2026-11-24: "trying to get the properties up so I can delete these coupling" (Rule 5.37)
test('a red dot can be deleted with the Delete key or its Properties, and a plain end gets no coupling', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /function redDotPress\(p, i\)/);
  // changed 2026-11-24 ("it is still there"): the Delete key now takes the dot's pipe too (test below)
  assert.match(app, /if \(kind === 'gfx' && item\.kind === 'ip' && item\.fitting === 'coupling' && !item\.port && !item\.attachTo\)/, 'Delete: a red dot takes its pipe');
  assert.match(app, /again = !zoomPassing && lastDotTap/, 'two quick presses open its Properties, not in the Zoom box');
  assert.match(app, /else if \(p\[plain\]\) continue;/, 'a plain end gets no new dot');
  assert.match(app, /!ipPoint\(p\.from, p\.workspace\) && !p\.plainFrom\)/, 'and no red ring');
});

// OakBarn Brewery, 2026-11-24: "I put the Valve Red Dot on top the Pump red dot and got a message. This is how real life the valves
// are on the Pump" (Rule 5.26)
test('an IP dropped right on another open IP joins it IP to IP instead of cutting a pipe', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /const IP_ON_IP_PX = 12;/);
  assert.match(app, /kind: 'pipe', straight: true, direct: true, workspace: ws, points: \[\[\.\.\.c\], \[\.\.\.c\]\]/, 'a pipe of no length');
  assert.match(app, /const j = ipOnIpJoin\(drag\.item\);[\s\S]{0,300}else \{ const r = splitPipeFor\(drag\.item\);/, 'before cutting a pipe');
});

// OakBarn Brewery, 2026-11-24: "Autoconfigured worked but why is the red dot not green on the elbow and valve?" (Rule 5.37)
test('Auto configure joins two IPs of things brought onto one spot IP to IP', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const i = app.indexOf('rejoinEnds(new Set([tr.a.id, tr.b.id]));');
  assert.match(app.slice(i, i + 1400), /directJoin\(tr\.a\.id, tr\.b\.id, wsName\)/);
});

// OakBarn Brewery, 2026-11-24: "No way to orient" (Rule 5.37)
test('the Zoom box has quarter-turn and flip buttons for a picked fitting, and redraws at once', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /\['⟲ 90', -90, [^\]]+\], \['⟳ 90', 90,/);
  assert.match(app, /onclick: ev => \{ ev\.stopPropagation\(\); turnSel\(op\); \}/);
  assert.match(app, /if \(zoomBox\?\.turn\) \{/, 'shown with the Edit layout bar turn buttons');
  assert.match(app, /if \(zoomBox && !zoomBox\.down\) setTimeout\(\(\) => zoomDraw\(true\), 0\);/, 'redrawn after a change');
});

// OakBarn Brewery, 2026-11-24: "Maybe time for a keyboard shortcut to rotate 90 degrees and flip horizontal or vertical?" (Rule 5.5)
test('R, Shift + R, H and V turn and flip the picked fitting', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /turnSel\(k === 'r' \? \(ev\.shiftKey \? -90 : 90\) : k\);/);
  assert.match(app, /if \(!editing \|\| previewing \|\| menuTab \|\| !sel \|\| ev\.ctrlKey \|\| ev\.metaKey \|\| ev\.altKey \|\| ev\.repeat\) return;/, 'never with Ctrl, Alt or ⌘');
});

// OakBarn Brewery, 2026-11-24: "Both should have been red"; "The Pump IPs" (Rule 5.26)
test('an IP to IP join goes when its two IPs come apart', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /function dropLooseDirect\(d\)/);
  assert.match(app, /if \(editing && draft && !drag\) dropLooseDirect\(draft\);/, 'checked each time the Tab is drawn');
});

// OakBarn Brewery, 2026-11-24: "Hit R and did not rotate but this" (Rule 2.73)
test('an Edit layout bar list lets go of the keyboard once a row is picked', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /function pickRun\(sel\) \{[\s\S]{0,500}sel\.blur\(\);\s+if \(f\) guard\(f\)\(\);/);
});

// OakBarn Brewery, 2026-11-24: "Clicked Finish Build then Keep building ... but still in non edit mode" (Rule 4.1)
test('Finish Build > Keep building turns Preview off', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /onclick: \(\) => \{ close\(null\); if \(previewing\) setPreview\(false\); \} \}, 'Keep building'/);
});

// OakBarn Brewery, 2026-11-24: "Nanny state up too long. Needs to be quick, maybe 3 seconds and then gone" (Rule 5.37)
test('the deleted ... Put back note goes after 3 seconds', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const all = [...app.matchAll(/deleted[^\n]*Put back \(Ctrl\+Z\) brings it back\.`, false, (\d+)\)/g)].map(m => +m[1]);
  assert.ok(all.length >= 2); assert.ok(all.every(n => n === 3000), String(all));
});

// OakBarn Brewery, 2026-11-24: "All nanny pop-ups 3 seconds" (Rule 2.74)
test('every note, blue or red, stays 2 seconds', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /const NOTE_MS = 2000;/, 'changed from 3 to 2 seconds, red too ("Change Blue and Red Nanny to 2 seconds")');
  assert.match(app, /setTimeout\(\(\) => t\.className = '', NOTE_MS\); \}/);
});

// OakBarn Brewery, 2026-11-24: "Pipe end needs the red dot, cannot join a valve to a pipe" (Rule 5.37)
test('a plain pipe end shows the red dot, and an IP dropped near it joins it', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /class: plain \? 'handle plainDot' : 'handle'/, 'the plain end handle is a red dot');
  assert.match(app, /own = p\[k\] \? ownCoupling\(p\[k\], p\) : p\[pk\] \? \{ plain: true \} : null;/, 'rejoinEnds takes a plain end');
  assert.match(app, /function snapOpenEnd\(it\)/);
  assert.match(app, /if \(drag\?\.mode === 'move' && drag\.moved && !endJoined\) \{/, 'not cut into a pipe once joined');
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.pipes \.plainDot \{ fill: #e01b12;/);
});

// OakBarn Brewery, 2026-11-24: "Used Delete and the Delete key. Pop-up says deleted but it is still there" (Rule 5.37)
test('deleting a red dot on an open pipe end deletes its pipe', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /const ps = pipesOn\(item\.id, item\.workspace\); if \(ps\.length === 1\) item = ps\[0\];/);
  assert.doesNotMatch(app, /item = findItem\('gfx', dotPick\.dot\)/, 'the Delete key no longer deletes only the dot');
});

// OakBarn Brewery, 2026-11-24: "the Name has the focus but cannot be edited here ... focus ring should be red" (Rule 3.11)
test('a locked Name box shows the Do Not Enter sign, a red focus ring, and asks before Change name', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /skyConfirm\(`Do you want to change the Name of the \$\{what\}\?`, \{ ok: '✏ Yes, change it', danger: false \}\)\) btn\.click\(\);/);
  assert.match(app, /h\('label', \{\}, '⛔ ' \+ label\.replace/);
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  assert.match(css, /input\.lockedName\[readonly\]:focus, input\.lockedName\[readonly\]:focus-visible \{ outline: 2px solid #d62828;/);
});

// OakBarn Brewery, 2026-11-24: "Color should be the first focus"; "... be in a Tab Background folder" (Rule 7.23)
test('Tab Settings: Color first when the Name is locked; Skynet backgrounds only from Tab_Background', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /nameBox\?\.readOnly \? body\.querySelector\('input\[data-k="color"\]'\)/);
  assert.match(app, /const TAB_BG_GROUP = 'Tab_Background';/);
  assert.match(app, /if \(list === 'backgrounds'\) os = os\.filter\(p => !isSkynetPic\(p\) \|\| groupOf\(p\)\.toLowerCase\(\) === TAB_BG_GROUP\.toLowerCase\(\)\);/);
});

// OakBarn Brewery, 2026-11-25: "Still cannot join a Pump to a pipe"; "A, the way it was before with just red IPs" (Rule 5.26)
test('a pump or valve still joined to its pipes lets them go and cuts the pipe it is dropped on', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /is still joined to other pipes\. Take those pipes off it first \(Rule 5\.26\)/, 'no longer refused');
  assert.match(app, /!p\.locked && !own\.includes\(p\)\)\) \{/, 'its own pipes are never the one cut');
  assert.match(app, /if \(own\.length\) \{ const j = grabJoins\(it\); unlockJoins\(j\); letGo = j\.length; \}/, 'lets go only once a pipe will be cut');
});

// OakBarn Brewery, 2026-11-24: "It may be they are joined to the Valves, but the IPs are not aligned" (Rule 5.23)
test('valve boxes are fitted before valves are lined up on their pipes', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /if \(on\) \{ fitValveBoxes\(draft\); mvJoinEnds\(draft\); centerOnPipes\(draft\);/);
  assert.match(app, /if \(!editing\) \{ fitValveBoxes\(L\(\)\); mvJoinEnds\(L\(\), w\.name\); centerOnPipes\(L\(\), w\.name\); \}/);
});

// OakBarn Brewery, 2026-11-24: "going from Valve Red IP to Pump Red IP would not lock trace" (Rule 5.37)
test('the Zoom box trace takes the red dot of an open pipe end', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /best = \{ d, id: null, plain: \{ p: pp, k \}, label: `the open end of /);
  assert.match(app, /p\[k\] = endCoupling\(p\.points, i, j, p\.workspace\); delete p\[k === 'from' \? 'plainFrom' : 'plainTo'\];/);
  assert.match(app, /zb\.trace = \{ a: zoomTakeEnd\(ip\), b: null/);
  assert.match(app, /tr\.b = zoomTakeEnd\(ip\);/);
  assert.match(app, /const ip = zoomIpAt\(x, y, true\); if \(!ip\) return false;/, 'only a red (open) IP starts a trace');
  assert.match(app, /const ip = zoomIpAt\(x, y, true\);        \/\/ it ends on a red/, 'and ends it');
});
