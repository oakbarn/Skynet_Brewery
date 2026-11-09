// Properties hotspots on a Vessel Device (Fritz, 2026-11-07, Rule 5.38, Help 154): one click on a ⚙ opens the Vessel Device's
// Properties, and each built in part (Heating Element, Temperature Probe, Thermowell, Valve) has its own ⚙ for its own Properties.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const fn = app.slice(app.indexOf('function propsHotspot('), app.indexOf('function vpParts('));
assert.match(fn, /onpointerdown: stop/, 'a click on a hotspot never starts a drag');
assert.match(fn, /onclick: ev => \{ ev\.stopPropagation\(\); ev\.preventDefault\(\); open\(\); \}/, 'one click opens it');
assert.match(app, /const VP_WHAT = \{ element: 'Heating Element', probe: 'Temperature Probe'/, 'each part kind is named in its hover help');
assert.match(app, /if \(editing && isVDev\(g\)\) n\.append\(propsHotspot\('vdHot'[^\n]*editItem\('gfx', g\.id\)/, 'the Vessel Device hotspot opens the vessel');
const parts = app.slice(app.indexOf('function vpParts('), app.indexOf('// ---- Valve Tees and Supply Manifolds'));
assert.match(parts, /if \(editing\) out\.push\(propsHotspot\('vpHot vpHot-' \+ e\.vpKind[^\n]*editItem\('el', e\.name\)/, 'every built in part has its own hotspot');
assert.match(css, /#ws \.propsHot \{[^}]*pointer-events: auto/, 'hotspots can be clicked');
assert.match(app, /const vpart = vpPartAt\(ev\)/, 'double-click on a part still opens it (Rule 2.9)');
assert.ok(fs.existsSync(new URL('../help/154-properties-hotspots.md', import.meta.url)), 'Help 154');
console.log('propshot ok');
// the Flow Color hotspot where a pipe begins at a vessel opening, and the On Overlay on built in Elements and Valves
const fh = app.slice(app.indexOf('function flowHots('), app.indexOf('function flowPopup('));
assert.match(fh, /f\.onVessel === g\.id && f\.onPort === ip\.port/, 'a fitting joined to the opening: the hotspot goes on its far end');
assert.match(fh, /part\?\.vpKind === 'valve'/, 'a Valve built into the opening: at its outer end');
assert.match(app, /fieldOne\(\['flowColor', 'Out flow color', 'flowc', 'vessel'\], g\)/, 'the vessel\'s own Out flow color, the setting that is already there (Rule 5.21)');
assert.match(app, /isVDev\(g\)\)\) ws\.append\(\.\.\.flowHots\(g, capped\)\)/, 'drawn in Edit layout');
assert.match(app, /class: 'vwPart vpOvl'[^\n]*\n[^\n]*media\(ovp\)/, 'the On Overlay on a built in Element or Valve');
assert.match(app, /return e\.vpKind === 'valve' \? BOLT : ''/, 'a built in Valve starts with the bolt, a built in Element with its Glow alone (2026-11-09)');
assert.match(app, /'#ws \.vpPart\[data-dev\], #ws \.vpOvl\[data-dev\]'/, 'the overlay follows on and off');
console.log('propshot flow + overlay ok');
