// Retiring the Global class: node test/globals.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { retireGlobals, retireGlobalsOnDisk, reportLines, hasGlobals } from '../lib/globals.js';
import { Store } from '../lib/store.js';

const cfg = {
  elements: [
    { name: 'gblV_Strike', type: 'global', dataType: 'value', initial: 160, precision: 1, log: { mode: 'seconds', every: 10 } },
    { name: 'gblS_Msg', type: 'global', dataType: 'string' },
    { name: 'RP_v_Pitch_Temp', type: 'global', dataType: 'value', log: { mode: 'minutes', every: 5 } },
    { name: 'RP_dt_BrewDate', type: 'global', dataType: 'datetime' },
    { name: 'xgblT_Old', type: 'global', dataType: 'time' },
    { name: 'glbV_Typo', type: 'global', dataType: 'value' },
    { name: 'Pitch_Show', type: 'picture', follow: 'RP_v_Pitch_Temp', note: 'RP_v_Pitch_Temp is shown' },
    { name: 'Old_Show', type: 'picture', follow: 'xgblT_Old' },
  ],
  graphics: [{ kind: 'pipe', id: 'p1', flowWhen: ['RP_dt_BrewDate'] }],
  beerxml: { recipe: { og: 'RP_v_Pitch_Temp' }, hops: { oz: 'RP_v_Hop{n}_Oz' } },
};
const scripts = [
  { name: 'Brew', text: '"RP_v_Pitch_Temp" value = 68\nprint "RP_v_Pitch_Temp"\n"xgblT_Old" value = 0\nsXRP_y = 1' },
  { name: 'Plain', text: '"gblV_Strike" value = 165' },
];
const r = retireGlobals(cfg, scripts);
const el = n => r.cfg.elements.find(e => e.name === n);
assert.equal(cfg.elements[0].type, 'global', 'input is not changed');
assert.equal(el('gblV_Strike').type, 'vKonstant'); assert.equal(el('gblV_Strike').kind, 'value'); assert.equal(el('gblV_Strike').initial, 160);
assert.equal(el('gblV_Strike').dataType, undefined); assert.equal(el('gblV_Strike').log, undefined);
assert.equal(el('gblS_Msg').kind, 'string');
assert.equal(el('RP_v_Pitch_Temp'), undefined);
assert.equal(el('vA_v_Pitch_Temp').type, 'vAPI'); assert.deepEqual(el('vA_v_Pitch_Temp').log, { mode: 'minutes', every: 5 });
assert.equal(el('vA_dt_BrewDate').kind, 'datetime');
assert.equal(el('xgblT_Old'), undefined);
assert.equal(el('glbV_Typo').type, 'global'); assert.equal(el('glbV_Typo').dataType, 'value');
assert.equal(el('Pitch_Show').follow, 'vA_v_Pitch_Temp'); assert.equal(el('Pitch_Show').note, 'RP_v_Pitch_Temp is shown');
assert.deepEqual(r.cfg.graphics[0].flowWhen, ['vA_dt_BrewDate']);
assert.deepEqual(r.cfg.beerxml, { recipe: { og: 'vA_v_Pitch_Temp' }, hops: { oz: 'vA_v_Hop{n}_Oz' } });
assert.equal(r.scripts[0].text, '"vA_v_Pitch_Temp" value = 68\nprint "vA_v_Pitch_Temp"\n"xgblT_Old" value = 0\nsXRP_y = 1');
assert.equal(r.scripts[1], scripts[1], 'unchanged scripts are kept as they are');
assert.deepEqual(r.report.scriptsChanged, ['Brew']);
assert.deepEqual(r.report.brokenScripts, [{ script: 'Brew', line: 3, name: 'xgblT_Old', text: '"xgblT_Old" value = 0' }]);
assert.deepEqual(r.report.brokenItems, [{ name: 'xgblT_Old', where: 'elements > Old_Show > follow' }]);
assert.deepEqual(r.report.other, ['glbV_Typo']); assert.deepEqual(r.report.lostLog, ['gblV_Strike']);
assert.ok(reportLines(r.report)[0].startsWith('Globals retired: 2 gbl → vKonstant (same names), 2 RP_ → vAPI renamed vA_, 1 x deleted'));
// a vA_ name that already exists is not overwritten
const clash = retireGlobals({ elements: [{ name: 'RP_a', type: 'global' }, { name: 'vA_a', type: 'vAPI' }] });
assert.deepEqual(clash.report.notRenamed, [{ name: 'RP_a', to: 'vA_a' }]); assert.equal(clash.cfg.elements[0].type, 'vAPI');
// Globals that fit no rule do not make the start-up conversion run again
assert.equal(retireGlobals({ elements: [{ name: 'Odd', type: 'global' }] }).cfg.elements[0].type, 'global');

// start-up: a saved setup is converted once, with backups, and saved values follow the renames
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpg'));
for (const s of ['config', 'scripts', 'data']) fs.mkdirSync(path.join(d, s));
const configPath = path.join(d, 'config', 'brewery.json');
fs.writeFileSync(configPath, JSON.stringify(cfg));
for (const s of scripts) fs.writeFileSync(path.join(d, 'scripts', s.name + '.txt'), s.text);
fs.writeFileSync(path.join(d, 'data', 'state.json'), JSON.stringify({ RP_v_Pitch_Temp: 66, gblS_Msg: 'hi' }));
const done = retireGlobalsOnDisk({ configPath, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') });
assert.ok(done.lines.length > 2);
assert.ok(fs.readdirSync(path.join(d, 'config', 'backups'))[0].startsWith('brewery-before-globals-'));
assert.ok(fs.existsSync(path.join(d, 'scripts', 'Brew.txt.before-globals.bak')));
assert.ok(!fs.existsSync(path.join(d, 'scripts', 'Plain.txt.before-globals.bak')));
assert.match(fs.readFileSync(path.join(d, 'scripts', 'Brew.txt'), 'utf8'), /^"vA_v_Pitch_Temp" value = 68/);
assert.ok(fs.existsSync(path.join(d, 'data', 'globals-retired.txt')));
assert.equal(retireGlobalsOnDisk({ configPath, scriptsDir: path.join(d, 'scripts'), dataDir: path.join(d, 'data') }), null, 'only once');
assert.equal(hasGlobals([{ name: 'glbV_Typo', type: 'global' }]), false);
const store = new Store(configPath, path.join(d, 'data')); store.load();
assert.equal(store.getProp('vA_v_Pitch_Temp', 'value'), 66); assert.equal(store.getProp('gblS_Msg', 'value'), 'hi');
assert.equal(store.get('glbV_Typo').type, 'global', 'names that fit no rule stay Globals');
console.log('globals OK');
