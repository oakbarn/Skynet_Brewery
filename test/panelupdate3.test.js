// Panel Update Final 3 (OakBarn Brewery, 2026-11-18, the Pump and the Hose Bib match each other; Rule 18.49, Help 115, 141, 148)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ipFamily, ipMate, ipFits, isIpCode, sizedIp, ownerIpType, fitOwnedEnds, HOSE_BIB_PIC, HOSE_BIB_END } from '../public/iptype.js';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
// #1 all 8 spots, the wall side too, and the inside Hose or Pipe reaches a wall side spot
assert.match(app, /const hbSpotOk = \(g, k\) => !!HB_SPOTS\[k\];/);
assert.match(app, /else if \(qx === 1\) \{ pts\.push\(\[sx, 0\.95\], \[0\.95, 0\.95\], \[0\.95, qy\]\); \}/);
assert.ok(fs.existsSync(new URL('../media/help_pictures/Hose_Bib_8_IPs.png', import.meta.url)));
assert.match(fs.readFileSync(new URL('../docs/Media_Licenses.csv', import.meta.url), 'utf8'), /^Hose_Bib_8_IPs\.png,media\/help_pictures,/m);
// #2 the Pump's Orientation: Horizontal greyed out, Left / Right beside it
const orient = app.slice(app.indexOf("else if (kind === 'orient')"), app.indexOf("else if (kind === 'vorient')"));
assert.match(orient, /h\('select', \{ class: 'orientSel', disabled: true, tabindex: '-1' \}, h\('option', \{ value: 'h', selected: true \}, 'Horizontal'\)\)/);
assert.match(orient, /'Left \/ Right'/); assert.match(orient, /class: 'fldPair orientPair orientBox'/);
// #4 Overlay and Outlet IP Fitting on the Hose Bib, in the Pump's order
const hb = app.slice(app.indexOf('const hbWidgetFields = '), app.indexOf('const mvWidgetFields = '));
const o = ["'mvOrient'", "'tapLink'", "'mvOverlay', 'Overlay'", "'ipTypeOut', 'Outlet IP Fitting'", 'MV_CONFIRM'].map(k => hb.indexOf(k));
assert.ok(o.every((x, i) => x > 0 && (i === 0 || x > o[i - 1])), 'Orientation, Hose or Pipe, Overlay, Outlet IP Fitting, .confirmation');
assert.match(app, /const mvOverPic = g =>/);
// FGH and MGH
assert.ok(isIpCode('FGH3/4') && isIpCode('MGH3/4'));
assert.equal(ipFamily('MGH3/4'), 'gh'); assert.equal(ipMate('MGH3/4'), 'FGH3/4'); assert.equal(ipMate('FGH3/4'), 'MGH3/4');
assert.ok(ipFits('FGH3/4', 'MGH3/4') && !ipFits('MGH3/4', 'MGH3/4') && !ipFits('MGH3/4', 'MPT3/4'));
assert.equal(sizedIp('gh', 0.75), 'MGH3/4'); assert.equal(sizedIp('gh', 0.75, { female: true }), 'FGH3/4');
// a hose on a Hose Bib takes the mate of its Outlet IP Fitting (MGH3/4 to start), a Quick Disconnect hose too
const cfg = { graphics: [{ id: 'b', kind: 'ip', fitting: 'manualValve', image: HOSE_BIB_PIC },
  { id: 'h', kind: 'pipe', hose: true, from: 'eq:b:out', to: 'x', ipTypeFrom: 'MSSQD1/2', ipTypeTo: 'MSSQD1/2' }] };
assert.equal(ownerIpType(cfg, 'eq:b:out'), HOSE_BIB_END);
fitOwnedEnds(cfg); assert.equal(cfg.graphics[1].ipTypeFrom, 'FGH3/4');
cfg.graphics[0].ipTypeOut = 'FGH3/4'; fitOwnedEnds(cfg); assert.equal(cfg.graphics[1].ipTypeFrom, 'MGH3/4');
assert.match(rules, /^18\.49 \*\*Panel Update Final 3/m);
console.log('panel update 3 tests passed');
