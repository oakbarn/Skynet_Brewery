// delay <seconds> (OakBarn Brewery, 2026-11-21, Rule 16.12): a sleep in seconds. delay 7 = sleep 7000.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js'; import { Engine, compile, KEYWORDS } from '../lib/engine.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { suggest } from '../public/autofill.js';

const stmt = src => compile(src).stmts.find(s => s.op === 'sleep');
const d7 = stmt('delay 7'), s7 = stmt('sleep 7000');
assert.ok(d7 && d7.delay, 'delay 7 is a sleep');
assert.ok(s7, 'sleep 7000 still works');
assert.ok(stmt('Delay 0.5'), 'upper case and decimals');
assert.ok(stmt('new value vV_Secs = 2\ndelay vV_Secs'), 'a variable');
assert.match(compile('delay').errors[0]?.msg ?? '', /delay needs a number/, 'delay alone is an error');
assert.ok(KEYWORDS.has('delay') && PROCESS_WORDS.has('delay') && COMMANDS.includes('delay'), 'a reserved word, colored as a command');
const pick = suggest('del', { elements: [], processes: [], tabs: [] }, 'del', 'del', true)?.list.find(i => i.text.trim() === 'delay');
assert.ok(pick && pick.text.endsWith(' '), 'Autofill offers delay, and a number follows it');

// it really waits: delay 0.3 holds the Process about 300 ms
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'skd-'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
fs.mkdirSync(path.join(d, 'scripts'), { recursive: true });
const out = [];
eng.on('print', p => out.push([Date.now(), String(p.text)]));
fs.writeFileSync(path.join(d, 'scripts', 'dl.txt'), 'print "a"\ndelay 0.3\nprint "b"\n');
eng.start('dl');
setTimeout(() => {
  const a = out.find(x => x[1] === 'a'), b = out.find(x => x[1] === 'b');
  assert.ok(a && b, 'both lines ran: ' + JSON.stringify(out));
  const ms = b[0] - a[0];
  assert.ok(ms >= 250 && ms < 1500, `delay 0.3 waited ${ms} ms`);
  console.log('delay tests passed');
  process.exit(0);
}, 1500);
