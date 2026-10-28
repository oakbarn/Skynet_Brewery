// Process editor (Fritz, 2026-10-19): comments from other languages, colors, files, Notepad++ and the Recycle Bin
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js';
import { Engine, compile } from '../lib/engine.js';
import { modernize } from '../lib/modernize.js';
import { renumber } from '../lib/scaffold.js';
import { classify, CLASSES, toHtml, processXml, notepadPlusPlus } from '../public/colorize.js';

// ---- comments: //, #, ' and /* */ are skipped; quotes are never comments
const prog = compile([
  '# Python', "' Visual Basic", '/* one', 'two = 3', '   three */', 'new string s', 's = "Pump #2 isn\'t // off"  # note',
  'new value n /* inline */', "n = 1 ' VB", 'n = n + 1 // C',
].join('\n'));
assert.deepEqual(prog.errors, []);
assert.deepEqual(prog.stmts.map(s => s.line), [6, 7, 8, 9, 10], 'only the code lines are statements');
assert.equal(prog.stmts[1].expr.v, "Pump #2 isn't // off");
assert.deepEqual(compile('/* never closed\nx = = =').errors, [], 'an open block comment runs to the end');

// lines touched by a block comment are left alone when saving
const el = n => ({ Pump: { type: 'digitalOut' } })[n];
const m = modernize('/*\n"Pump" state = true\n*/\n"Pump" state = true', el);
assert.equal(m.text, '/*\n"Pump" state = true\n*/\nPump = true');
assert.equal(m.changed, 1);
const r = renumber(new Map([['a', '/* step "old"\n*/\nstep "Start"']]), () => 'sub').get('a');
assert.equal(r, '/* step "old"\n*/\nstep S1.00000 "Start"');

// ---- colors
const words = { elements: [{ name: 'Pump', type: 'digitalOut' }, { name: 'tm_Mash', type: 'timer' }, { name: 'gKV_A', type: 'gKonstant' }, { name: 'gAV_B', type: 'gAPI' }], processes: ['sub_Fill'] };
const text = 'new value x\nif Pump == true and x < 2 // c\n  gAV_B = gKV_A + 1.5\n  tm_Mash.visible = "hi"\nstart sub_Fill\n[L]\ngoto L\nstep S1.00002 "a"';
const cls = classify(text, words);
const at = (word, nth = 0) => { let i = -1; for (let k = 0; k <= nth; k++) i = text.indexOf(word, i + 1); return CLASSES[cls[i]]; };
assert.equal(at('new'), 'cmd'); assert.equal(at('x'), 'var'); assert.equal(at('Pump'), 'dev'); assert.equal(at('=='), 'op'); assert.equal(at('true'), 'cmd');
assert.equal(at('and'), 'op'); assert.equal(at('// c'), 'com'); assert.equal(at('gAV_B'), 'vapi'); assert.equal(at('gKV_A'), 'vk'); assert.equal(at('1.5'), 'num');
assert.equal(at('tm_Mash'), 'wid'); assert.equal(at('visible'), 'attr'); assert.equal(at('"hi"'), 'str'); assert.equal(at('sub_Fill'), 'proc');
assert.equal(at('[L]'), 'lab'); assert.equal(at('L', 1), 'lab'); assert.equal(at('S1.00002'), 'num');
const blk = classify('/* a\nPump */ Pump', words);
assert.equal(CLASSES[blk[5]], 'com'); assert.equal(CLASSES[blk[13]], 'dev');
assert.equal(toHtml('a < b', classify('a < b')), 'a <span class="hl-op">&lt;</span> b');
assert.equal(toHtml('if x', classify('if x'), 0, 4, [[3, 4]], 0), '<span class="hl-cmd">if</span> <mark class="cur">x</mark>');
// C-style spellings are operators too: { } ; ++ --
{ const t = 'if (x) { x++; }', c = classify(t); for (const ch of ['{', '}', ';', '++']) assert.equal(CLASSES[c[t.indexOf(ch)]], 'op', ch); }

// ---- XML file: XHTML in color, with the plain text kept; the highlighted part keeps its line numbers
const xml = processXml('Fill', text, words, text.indexOf('start'), text.indexOf('[L]') + 3);
assert.match(xml, /^<\?xml version="1.0"/);
assert.match(xml, /lines 5 to 6/);
assert.match(xml, /<span class="ln">5<\/span><span class="hl-cmd">start<\/span>/);
assert.match(xml, /<!\[CDATA\[start sub_Fill\n\[L\]\]\]>/);
assert.match(processXml('x', 'print "]]>"', words), /CDATA\[print "]]]]><!\[CDATA\[>"\]\]>/, ']]> in a Process cannot end the CDATA early');

// ---- Notepad++: this brewery's names, or the general file
const npp = notepadPlusPlus(words, [text]);
assert.match(npp, /<Keywords name="Keywords2">Pump<\/Keywords>/);
assert.match(npp, /<Keywords name="Keywords5">x<\/Keywords>/);
assert.match(npp, /<Keywords name="Comments">00\/\/ 00# 00' 01 02 03\/\* 04\*\/<\/Keywords>/);
assert.match(notepadPlusPlus(), /Keywords3="yes".*\n[\s\S]*<Keywords name="Keywords3">gK<\/Keywords>/);
assert.equal(fs.readFileSync(new URL('../docs/Skynet_Process_Notepad++.xml', import.meta.url), 'utf8'), notepadPlusPlus(), 'docs file is up to date (node tools/notepadpp.js)');

// ---- Recycle Bin: delete moves, restore asks for a free name, purge erases
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'editor'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ elements: [] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
eng.write('Fill', 'print "one"'); eng.setClass('Fill', 'looper'); eng.setAutoRestart('Fill', true);
eng.remove('Fill');
assert.deepEqual(eng.names(), []);
let bin = eng.binList();
assert.equal(bin.length, 1); assert.equal(bin[0].name, 'Fill'); assert.equal(eng.binRead(bin[0].id), 'print "one"');
eng.write('Fill', 'print "two"');
assert.throws(() => eng.binRestore(bin[0].id), e => e.code === 409);
assert.equal(eng.binRestore(bin[0].id, 'Fill_old').name, 'Fill_old');
assert.equal(eng.read('Fill_old'), 'print "one"');
assert.equal(eng.classOf('Fill_old'), 'looper'); assert.equal(eng.autoRestart('Fill_old'), true);
assert.deepEqual(eng.binList(), []);
eng.remove('Fill'); bin = eng.binList();
eng.binPurge(bin[0].id);
assert.deepEqual(eng.binList(), []);
assert.throws(() => eng.binRead('../c'), /Bad Recycle Bin item/);
// ISO 8601 names (2026-10-23): new items are <name>.yyyymmddThhmmss; items from before keep their old names and still show
eng.write('Mash', 'print "m"'); eng.remove('Mash');
assert.match(eng.binList()[0].id, /^Mash\.\d{8}T\d{6}$/);
for (const old of ['Sparge.2026-10-21-14-05-03', 'Boil.20261023T113005-2']) fs.writeFileSync(path.join(eng.binDir(), old + '.txt'), 'print "x"');
assert.deepEqual(eng.binList().map(b => b.name).sort(), ['Boil', 'Mash', 'Sparge']);
assert.deepEqual(eng.names(), ['Fill_old'], 'the Recycle_Bin folder is not a Process');
fs.rmSync(d, { recursive: true, force: true });
console.log('process editor tests passed');
