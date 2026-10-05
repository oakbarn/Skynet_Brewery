// New Process language (name alone = main value, name.attribute), the BruControl rewriter, names without
// spaces, Process classes and step numbers.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, noSpaces, attrsOf, mainProp } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { modernize, removeSpacesOnDisk } from '../lib/modernize.js';
import { renumber, addSteps, guessClass, flowOrder } from '../lib/scaffold.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'lang'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [
  { name: 'alm_Hops', type: 'alarm' }, { name: 'Pump_Red', type: 'digitalOut' }, { name: 'tm_Mash', type: 'timer' },
  { name: 'Kettle_SP', type: 'vKonstant', kind: 'value' }, { name: 'Msg', type: 'vKonstant', kind: 'string' },
  { name: 'vKB_Flag', type: 'vKonstant', kind: 'bool' }, { name: 'vKStep_Brew', type: 'vKonstant', kind: 'step' },
  { name: 'odd (name)', type: 'vKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const prints = []; eng.on('print', p => prints.push(p.text));
const run = async (name, text) => {
  eng.write(name, text);
  const chk = eng.check(text); assert.deepEqual(chk.errors, [], name + ': ' + JSON.stringify(chk.errors));
  assert.equal(eng.start(name).ok, true);
  for (let i = 0; i < 100 && eng.running.has(name); i++) await new Promise(r => setTimeout(r, 20));
  assert.equal(eng.status.get(name).state, 'stopped', JSON.stringify(eng.status.get(name)));
};

// ---- the new style runs
await run('proc_a', `new value vX
step "Start"
alm_Hops = true
if alm_Hops == true && alm_Hops.active == true
  print "alarm on"
endif
alm_Hops = false
Pump_Red = true
Kettle_SP = 185.5
Kettle_SP += 1
vX = Kettle_SP
vX.precision = 0
print vX
Msg.visible = false
if Msg.visible == false and Msg.visibility == hidden
  print "hidden"
endif
"odd (name)".value = 3
"odd (name)".visible = true
tm_Mash.countdown = true
print tm_Mash.type
tm_Mash.displayname = "Mash " + Kettle_SP
vKB_Flag = true
step "Done"
`);
assert.equal(store.getProp('Pump_Red', 'state'), true);
assert.equal(store.getProp('Kettle_SP', 'value'), 186.5);
assert.equal(store.getProp('alm_Hops', 'active'), false);
assert.equal(store.getProp('Msg', 'visibility'), 'hidden');
assert.equal(store.getProp('odd (name)', 'value'), 3);
assert.equal(store.getProp('tm_Mash', 'type'), 'countdown');
assert.equal(store.getProp('tm_Mash', 'displayname'), 'Mash 186.5');
assert.deepEqual(prints.slice(0, 4), ['alarm on', '187', 'hidden', 'countdown']);
// the Step widget shows the last step a Flow Process reached (proc_a is a Sub by its name, so it stays empty)
assert.equal(store.getProp('vKStep_Brew', 'value'), '');

// unknown bare names are reported in plain words
assert.match(eng.check('Nope = 1').errors[0].msg, /Unknown name Nope/);
// "step = 5" is an assignment to an element called step, not a step line
assert.equal(compile('step = 5').stmts[0].op, 'assign');
assert.equal(compile('step 1.00002 "Mash in"').stmts[0].name, 'Mash in');
assert.ok(compile('step Mash').errors.length);

// ---- main value and attributes
assert.equal(mainProp(store.get('alm_Hops')), 'active');
assert.ok(attrsOf(store.get('tm_Mash')).includes('countdown'));
assert.ok(attrsOf(store.get('Msg')).includes('visible') && !attrsOf(store.get('Msg')).includes('visibility'));

// ---- the BruControl rewriter
const old = `new value vX
new string vS
"alm_Hops" active = true
if "Pump_Red" state == true && "Kettle_SP" value > 3
"Kettle_SP" value = 185.5
"Msg" visibility = hidden
"tm_Mash" type = countdown
vX precision = 0
vS = "Msg" visibility
wait "vKB_Flag" state == false
"odd (name)" value = 1
"Pump_Red" bogus = 1 +
`;
const m = modernize(old, n => store.get(n));
assert.equal(m.text, `new value vX
new string vS
alm_Hops = true
if Pump_Red == true && Kettle_SP > 3
Kettle_SP = 185.5
Msg.visible = false
tm_Mash.countdown = true
vX.precision = 0
vS = Msg.visibility
wait vKB_Flag == false
"odd (name)".value = 1
"Pump_Red" bogus = 1 +
`);
assert.equal(modernize(m.text, n => store.get(n)).changed, 0);          // already new: nothing to do

// ---- names without spaces
assert.equal(noSpaces('Test Timer'), 'Test_Timer');
assert.equal(noSpaces('sw_Advance_ BrewStatus'), 'sw_Advance_BrewStatus');
assert.equal(noSpaces('strt_2__Reset'), 'strt_2__Reset');
{
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'spc'));
  fs.mkdirSync(path.join(d2, 's')); fs.mkdirSync(path.join(d2, 'data'));
  fs.writeFileSync(path.join(d2, 'c.json'), JSON.stringify({ elements: [{ name: 'Test Timer', type: 'timer' }, { name: 'Test_Timer', type: 'timer' }], graphics: [{ flowWhen: ['Test Timer'] }] }));
  fs.writeFileSync(path.join(d2, 's', 'p.txt'), 'start "Test Timer"\n');
  fs.writeFileSync(path.join(d2, 'data', 'state.json'), JSON.stringify({ 'Test Timer': 5 }));
  const r = removeSpacesOnDisk({ configPath: path.join(d2, 'c.json'), scriptsDir: path.join(d2, 's'), dataDir: path.join(d2, 'data') });
  const c = JSON.parse(fs.readFileSync(path.join(d2, 'c.json'), 'utf8'));
  assert.equal(c.elements[0].name, 'Test_Timer_2');
  assert.equal(c.elements[0].displayName, 'Test Timer');
  assert.deepEqual(c.graphics[0].flowWhen, ['Test_Timer_2']);
  assert.equal(fs.readFileSync(path.join(d2, 's', 'p.txt'), 'utf8'), 'start "Test_Timer_2"\n');
  assert.equal(JSON.parse(fs.readFileSync(path.join(d2, 'data', 'state.json'), 'utf8')).Test_Timer_2, 5);
  assert.ok(r.lines.length);
  assert.equal(removeSpacesOnDisk({ configPath: path.join(d2, 'c.json'), scriptsDir: path.join(d2, 's'), dataDir: path.join(d2, 'data') }), null);
}

// ---- classes and step numbers
assert.equal(guessClass('scrBrew200_Mashing'), 'flow');
assert.equal(guessClass('looper_scrBlinkClick'), 'looper');
assert.equal(guessClass('inscpt_scrAdvancewithSwitch'), 'repeat');
assert.equal(guessClass('sub_scrCloseAllValves'), 'sub');
const texts = new Map([
  ['scrA_Start', 'step "Begin"\nstart "scrC_Mash"\nstart "sub_Fill"\n'],
  ['scrC_Mash', 'step 9.00009 "Mash in"\n[Rest]\n  step "Rest"\nstart "scrB_Boil"\n'],
  ['scrB_Boil', '// boil\nstep "Boil"\n'],
  ['sub_Fill', 'step "Fill"\nstep "Full"\n'],
  ['looper_X', 'step "Loop"\n'],
]);
const cls = n => guessClass(n);
assert.deepEqual(flowOrder(texts, cls), ['scrA_Start', 'scrC_Mash', 'scrB_Boil']);
const out = renumber(texts, cls);
assert.equal(out.get('scrA_Start'), 'step 1.00000 "Begin"\nstart "scrC_Mash"\nstart "sub_Fill"\n');
assert.equal(out.get('scrC_Mash'), 'step 2.00000 "Mash in"\n[Rest]\n  step 2.00001 "Rest"\nstart "scrB_Boil"\n');
assert.equal(out.get('scrB_Boil'), '// boil\nstep 3.00000 "Boil"\n');
assert.equal(out.get('sub_Fill'), 'step S1.00000 "Fill"\nstep S1.00001 "Full"\n');
assert.equal(out.get('looper_X'), 'step L1.00000 "Loop"\n');
const again = new Map(texts); for (const [k, v] of out) again.set(k, v);
assert.equal(renumber(again, cls).size, 0);
assert.equal(addSteps('//title\nPump_Red = true\n[Mash_Rest]\nsleep 1\n'), '//title\nstep "Start"\nPump_Red = true\n[Mash_Rest]\nstep "Mash Rest"\nsleep 1\n');
assert.equal(addSteps(addSteps('[A]\nx = 1')), addSteps('[A]\nx = 1'));

// the engine renumbers on disk, and the Step widget follows Flow Processes
eng.write('scrZ_Brew', 'step "Heat"\nstep "Mash"\n');
eng.renumber();
assert.equal(eng.read('scrZ_Brew'), 'step 1.00000 "Heat"\nstep 1.00001 "Mash"\n');
await run('scrZ_Brew', eng.read('scrZ_Brew'));
assert.equal(store.getProp('vKStep_Brew', 'value'), '1.00001  Mash');
eng.setClass('scrZ_Brew', 'sub');
assert.match(eng.read('scrZ_Brew'), /step S\d+\.00000 "Heat"/);

console.log('language tests passed');
process.exit(0);
