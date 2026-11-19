// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Updates 40 (Rule 6.19, Rule 2.44): a Heating Element's green SV box on a running Tab. Duty Cycle shows only its %;
// Hysteresis, PID, Deadband and Precise show SV and the Setpoint; one click types a new one in place (no pop-up)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'public/style.css'), 'utf8');
const fn = name => { const i = app.indexOf(`function ${name}(`); assert.ok(i >= 0, name); return app.slice(i, app.indexOf('\n}\n', i)); };

const hs = fn('heatSv');
assert.match(hs, /k === 'dutyCycle'\) return \{ prop: 'dutycycle'/, 'Duty Cycle: its Duty cycle %');
assert.match(hs, /if \(!SP_METHODS\.includes\(k\)\) return null/, 'Direct and PWM: no box; only the Setpoint methods show SV');
assert.match(hs, /prop: 'target'.*sp: true/, 'the Setpoint methods: SV and the Setpoint');
assert.match(hs, /if \(editing \|\| e\.look === 'dial' \|\| e\.look === 'bar'\) return null/, 'not in Edit layout, not on the Dial or Bar');
assert.match(hs, /dk !== 'both' && displayChoices\(e\)\) return null/, 'a Data Display picked wins');
assert.match(hs, /e0\.cloneMethod \|\|/, 'a Method Clone shows its own method');
assert.doesNotMatch(app, /hideSV|svVisible/, 'no Visible switch: the box is part of the display');

const ed = fn('svEdit');
assert.match(ed, /can\('operator'\)/, 'operators and admins only');
assert.match(ed, /h\('input', \{ class: 'svIn'/, 'typed in place, no pop-up (Rule 2.44)');
assert.match(ed, /ke\.key === 'Enter'\) \{ ke\.preventDefault\(\); finish\(true\)/, 'Enter sets it');
assert.match(ed, /ke\.key === 'Escape'\) \{ ke\.preventDefault\(\); finish\(false\)/, 'Esc puts it back');
assert.match(ed, /x < 0 \|\| x > 100/, 'a Duty cycle % is 0 to 100');
assert.match(ed, /e\.confirm\) \{ if \(!\(await choose/, 'Ask before changing by hand asks before a % turns it On');
assert.doesNotMatch(ed, /'method'|'state'/, 'it never switches the method or turns it On or Off itself (the Brain does that for a Duty cycle %, Rule 6.19)');

assert.match(app, /const sb = ev\.target\.closest\('\.el \.svBox'\); if \(sb\) return svEdit\(sb\);/, 'a click on the box types, not On / Off');
assert.match(app, /if \(ev\.target\.closest\('\.el \.svBox'\)\) return;/, 'the box is never a Push Button press');
assert.match(app, /else if \(vl\._svEdit\) \{/, 'a new value updating the tile leaves the box being typed in alone');
assert.match(css, /\.el \.vl \.svBox \{[^}]*color: #3ddc5a/, 'green, like a panel controller SV');
assert.match(css, /\.el \.vl \.svBox \{[^}]*white-space: nowrap/, 'all digits and °F / °C on one line');
console.log('svbox.test.js passed');
