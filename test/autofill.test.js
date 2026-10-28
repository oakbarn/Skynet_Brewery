// Predictive text in the Process editor (Fritz, 2026-10-28): what is offered for the line before the cursor
import assert from 'node:assert/strict';
import { suggest, fit } from '../public/autofill.js';
import { boolAttrs } from '../lib/store.js';

const words = {
  elements: [
    { name: 'MB_06_Pump_Wort__HS', type: 'digitalOut', main: 'state', attrs: ['enabled', 'visible'], bools: ['', 'visible', 'enabled'] },
    { name: 'tm_Mash', type: 'timer', main: 'value', attrs: ['countdown', 'running', 'type'], bools: ['running', 'countdown'] },
    { name: 'alm_Hops', type: 'alarm', main: 'active', attrs: [], bools: [''] },
    { name: 'vKV_Strike', type: 'vKonstant', main: 'value', attrs: [], bools: [] },
    { name: 'vAV_HLT', type: 'vAPI', main: 'value', attrs: [], bools: [] },
    { name: 'Stir', type: 'stepper', main: 'value', attrs: [], bools: [] },
  ],
  processes: ['sub_Fill', 'scr_Mash'],
  tabs: ['Brewery', 'Batch Hops'],
};
const get = (line, above = line, all = above, forced = false) => suggest(line, words, above, all, forced);
const texts = (...a) => get(...a)?.list.map(i => i.text) ?? null;
const ctrl = (line, all = line) => texts(line, line, all, true);       // Ctrl+Space or the Suggest button

// matching: the start of a name, or a part after a _
assert.equal(fit('MB_06_Pump_Wort__HS', 'mb'), 0);
assert.equal(fit('MB_06_Pump_Wort__HS', 'pump'), 1);
assert.equal(fit('MB_06_Pump_Wort__HS', 'p'), -1, 'one letter only matches the start');
assert.ok(texts('if Pump').includes('MB_06_Pump_Wort__HS '));

// at the start of a line the commands come first, with a note; a command that takes more ends in a space
const s = get('wa');
assert.equal(s.list[0].text, 'wait '); assert.equal(s.list[0].label, 'wait'); assert.ok(s.list[0].hint);
assert.equal(s.typed, 2);
assert.ok(texts('en').includes('endif'), 'endif takes nothing after it: no space');
assert.deepEqual(texts('  new '), ['value ', 'string ', 'bool ', 'time ', 'datetime ']);

// after the first word the list fits it
assert.deepEqual(texts('start '), ['sub_Fill', 'scr_Mash', 'tm_Mash', 'alm_Hops']);
assert.deepEqual(texts('stop s'), ['sub_Fill', 'scr_Mash', 'Stir']);
assert.deepEqual(texts('reset '), ['tm_Mash', 'Stir']);
assert.deepEqual(texts('play '), ['alm_Hops']);
assert.deepEqual(texts('show tab '), ['Brewery', '"Batch Hops"'], 'a Tab name with a space gets quotes');
assert.deepEqual(texts('show "Ba'), ['"Batch Hops"']);
assert.deepEqual(texts('goto ', 'goto ', '[Mash]\nx = 1\n  [Boil]\ngoto '), ['Mash', 'Boil']);

// after = or == on something on/off: true, false, on, off
assert.deepEqual(texts('MB_06_Pump_Wort__HS = '), ['true', 'false', 'on', 'off']);
assert.deepEqual(texts('if tm_Mash.countdown == f'), ['false'], 'a value ends the line: no space after it');
assert.deepEqual(texts('if MB_06_Pump_Wort__HS.state == '), ['true', 'false', 'on', 'off'], '.state is the same as the name alone');
assert.equal(texts('vKV_Strike = '), null, 'a number gets no list before a letter is typed');

// Ctrl+Space: after if only what can stand in a condition, in Fritz's order (no commands, no and / or yet)
const afterIf = get('if ', 'new value count\nif ', 'new value count\nif ', true).list;
assert.deepEqual(afterIf.map(i => i.text.trim()), ['count', 'tm_Mash', 'vAV_HLT', 'vKV_Strike', 'MB_06_Pump_Wort__HS', 'Stir', 'alm_Hops', 'sub_Fill', 'scr_Mash', 'true', 'false', 'now', 'not']);
assert.match(afterIf[0].hint, /variable/); assert.match(afterIf[4].hint, /Device/); assert.match(afterIf[6].hint, /Widget/);
assert.equal(texts('if '), null, 'without Ctrl+Space nothing pops up before a letter');
assert.equal(ctrl('')[0], 'if ', 'Ctrl+Space on an empty line: the commands');
assert.ok(ctrl('if (x > 3) ').includes('stop '), 'after a one-line if a command can come');

// a whole line by picking: if -> name -> == or an attribute -> true -> and / or
const n = get('if MB_06_Pump_Wort__HS ', '', '', true);
assert.equal(n.typed, 0);
assert.deepEqual(n.list.slice(0, 6).map(i => i.text), ['== ', '!= ', '> ', '< ', '>= ', '<= ']);
const st = n.list.find(i => i.text === '.state ');
assert.equal(st.back, 1, '.state takes the place of the space'); assert.match(st.hint, /name alone/);
assert.ok(n.list.some(i => i.text === '.visible '));
assert.deepEqual(ctrl('if MB_06_Pump_Wort__HS == true '), ['and ', 'or ']);
assert.deepEqual(ctrl('if tm_Mash == 00:10:00 '), ['and ', 'or ']);
assert.ok(texts('if alm_Hops == true an').includes('and '));
assert.ok(!(texts('if a') ?? []).includes('and '), 'no and right after if');
// right after the name with no space yet, Ctrl+Space puts the space in
const tight = get('if MB_06_Pump_Wort__HS', '', '', true);
assert.equal(tight.list[0].text, ' == '); assert.equal(tight.list.find(i => i.text === '.state ').back, 0);
// at the start of a line: set it
assert.deepEqual(ctrl('MB_06_Pump_Wort__HS ').slice(0, 4), ['= ', '+= ', '-= ', '++']);
assert.ok(ctrl('MB_06_Pump_Wort__HS ').includes('.visible = '));
assert.deepEqual(ctrl('sub_Fill '), [], 'a Process is read only: nothing to set');
assert.ok(ctrl('if sub_Fill ').includes('.running '));
// a variable made in this Process
assert.deepEqual(ctrl('if ok == ', 'new bool ok\nif ok == ').slice(0, 2), ['true', 'false']);
assert.deepEqual(ctrl('if MB_06_Pump_Wort__HS == true'), [' and ', ' or '], 'Ctrl+Space after the value: and / or');
assert.deepEqual(ctrl('if tm_Mash > 3'), [' and ', ' or ']);
assert.ok(ctrl('x = ').includes('tm_Mash'), 'a value after = ends the line');

// the true/false list comes from the Store
assert.deepEqual(boolAttrs({ name: 'P', type: 'digitalOut' }).slice(0, 1), ['']);
assert.ok(!boolAttrs({ name: 'T', type: 'temperature' }).includes(''), 'a temperature is not on/off');
assert.ok(boolAttrs({ name: 'B', type: 'vKonstant', kind: 'bool' }).includes(''));
assert.ok(boolAttrs({ name: 'T', type: 'timer' }).includes('countdown'));
console.log('autofill ok');
