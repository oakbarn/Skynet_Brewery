// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Panel Update 9 (OakBarn Brewery, 2026-11-22), Part 1: the Skynet Audio folders and an Audio Widget that shows only while it plays
// (Rule 7.27), the Process Widget Group (Rule 1.31), the Hop Groups, Drop as a time, Pull Date, AAU 0.01 and the Adjunct dropdown
// (Rule 17.19), and the Help Name column (Rule 11.17).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store } from '../lib/store.js';
import { AUDIO_FOLDERS, AUDIO_PATRON, audioPicFor, audioFolderPic } from '../public/mediapaths.js';
import { searchTab, searchHelp, snippet } from '../public/skysearch.js';
import { ON_TOP } from '../public/ontop.js';
import { hopGroupOf, HOP_GROUPS, minutesHms, pullDate, importedActual, COMMON_ADJUNCTS, OTHER_ADJUNCT, MISC_TYPES, MISC_USES, MISC_LINE_UNITS, MISC_TIME_UNITS } from '../public/recipecalc.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// ---- items 1 and 2: six Audio folders (and Patron), each with its drawing; the Audio Widget's picture follows its sound's folder
assert.deepEqual([...AUDIO_FOLDERS], ['Songs', 'Text_to_voice', 'Fanfare', 'Beep', 'Nature', 'Go_to_work']);
assert.equal(AUDIO_PATRON, 'Patron');
for (const f of AUDIO_FOLDERS) {
  assert.ok(fs.existsSync(path.join(ROOT, 'media', audioFolderPic(f))), `drawing for ${f}`);
  assert.ok(fs.existsSync(path.join(ROOT, 'media/sounds/Skynet', f)) || f !== 'Songs', 'Songs is in the release');
}
assert.equal(audioPicFor('sounds/Skynet/Fanfare/x.mp3'), audioFolderPic('Fanfare'));
assert.equal(audioPicFor('sounds/Skynet/Patron/Nature/x.mp3'), audioFolderPic('Nature'));
assert.equal(audioPicFor('sounds/Mine/x.mp3'), audioFolderPic('Songs'), 'not a Skynet folder: Songs');
assert.equal(fs.readdirSync(path.join(ROOT, 'media/sounds/Skynet')).filter(f => /\.mp3$/i.test(f)).length, 0, 'no loose Skynet sounds');

// ---- a store with an Audio Widget and a Water Group of Process Widgets
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pu9-'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [
  { name: 'wgt_AUD_Music_BH', type: 'soundPlayer', path: 'sounds/Skynet/Songs/a.mp3' },
  { name: 'wgt_PSW_A_WA', type: 'processWidget', group: 'Water' }, { name: 'wgt_PSW_B_WA', type: 'processWidget', group: 'water' },
  { name: 'wgt_PSW_Off_WA', type: 'processWidget' }] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
assert.equal(store.getProp('wgt_AUD_Music_BH', 'visible'), false, 'stopped: hidden');
store.setProp('wgt_AUD_Music_BH', 'play', true, 'script');
assert.equal(store.getProp('wgt_AUD_Music_BH', 'visible'), true, 'playing: shown');
assert.throws(() => store.setProp('wgt_AUD_Music_BH', 'visible', true, 'script'), /\.play/, 'no .visible for a Process');

assert.equal(store.pressGroup('wgt_PSW_A_WA'), true);
assert.equal(store.rt.get('wgt_PSW_B_WA').phase, 'delay', 'the whole Group (any letter case) is in delay');
assert.equal(store.rt.get('wgt_PSW_A_WA').pressed, true);
assert.equal(store.rt.get('wgt_PSW_B_WA').pressed, false);
assert.equal(store.pressGroup('wgt_PSW_B_WA'), false, 'a busy Group refuses another press');
assert.equal(store.pressGroup('wgt_PSW_Off_WA'), true, 'no Group: always works');
store.setProp('wgt_PSW_B_WA', 'phase', 'running', 'script');
assert.equal(store.rt.get('wgt_PSW_A_WA').phase, 'running');
assert.equal(store.rt.get('wgt_PSW_A_WA').pressed, true, 'the pressed one stays the pressed one');
store.setProp('wgt_PSW_A_WA', 'phase', 'stopped', 'script');
assert.equal(store.rt.get('wgt_PSW_B_WA').phase, '');
assert.throws(() => store.setProp('wgt_PSW_A_WA', 'phase', 'sideways', 'script'));
fs.rmSync(d, { recursive: true, force: true });

// ---- the sample's Water buttons are one Group, FireHose Off is not
const sample = JSON.parse(read('samples/configs/three-vessel-one-pump/config.json'));
const pw = sample.elements.filter(e => e.type === 'processWidget' && e.tab === sample.elements.find(x => x.name === 'wgt_PSW_FireHose~Off_WA')?.tab);
assert.ok(pw.filter(e => e.group === 'Water').length >= 10, 'ten Water buttons');
assert.ok(!sample.elements.find(e => /FireHose~Off/.test(e.name) && e.type === 'processWidget')?.group, 'FireHose Off always works');

// ---- items 24 and 25: Hop Groups, Drop as hh:mm:ss, Pull Date, AAU 0.01
assert.equal(hopGroupOf(60), 'bitter'); assert.equal(hopGroupOf(21), 'bitter'); assert.equal(hopGroupOf(20), 'flavor');
assert.equal(hopGroupOf(6), 'flavor'); assert.equal(hopGroupOf(5), 'aroma'); assert.equal(hopGroupOf(0), 'aroma');
assert.deepEqual(Object.values(HOP_GROUPS).map(g => g.title), ['Bitter Hops', 'Flavor Hops', 'Aroma Hops']);
assert.equal(minutesHms(75), '01:15:00'); assert.equal(minutesHms(0), '00:00:00'); assert.equal(minutesHms(null), '');
assert.equal(pullDate('2026-12-05', 4), '2026-12-09'); assert.equal(pullDate('2026-12-30', 3), '2027-01-02'); assert.equal(pullDate('', 4), '');
assert.equal(importedActual(0), 0.01, 'Recipe AAU 0: Actual 0.01'); assert.equal(importedActual(12.5), 0);

// ---- item 28: the Adjunct dropdown, every pick uses the select-only lists
assert.ok(['Whirlfloc', 'Irish Moss', 'Yeast Nutrient'].every(n => COMMON_ADJUNCTS.some(a => a.name === n)));
for (const a of [...COMMON_ADJUNCTS, OTHER_ADJUNCT]) {
  assert.ok(MISC_TYPES.includes(a.type) && a.use in MISC_USES && MISC_LINE_UNITS.includes(a.unit) && a.timeUnit in MISC_TIME_UNITS, a.name || 'Other');
}

// ---- item 10a: a Help Name column never wraps (Rule 11.17)
assert.match(read('public/style.css'), /\.hpTable td:first-child:has\(> code:only-child\)[^{]*\{[^}]*nowrap/);
// ---- item 8: the Skynet search box (Rule 2.65 changed): this Tab plus Help, every word, title hits first, on top (Rule 18.53)
const items = [{ name: 'BM_5_DO@Pump_Red_BH', label: 'Red pump', kind: 'Pump' }, { name: 'wgt_TMR_Mash_BH', label: 'Mash timer', kind: 'Timer' }];
assert.deepEqual(searchTab(items, 'red PUMP').map(i => i.name), ['BM_5_DO@Pump_Red_BH']);
assert.deepEqual(searchTab(items, ''), []);
const pages = [{ name: '1', title: 'Pumps', text: 'a mash pump' }, { name: '2', title: 'Mash tun', text: 'the tun' }];
assert.deepEqual(searchHelp(pages, 'mash').map(p => p.name), ['2', '1'], 'a title match first');
assert.match(snippet('lots of words before the mash pump here', 'mash'), /mash pump/);
assert.ok(ON_TOP.includes('#skySearch'));
const appSrc = read('public/app.js');
assert.match(appSrc, /ev\.defaultPrevented[^\n]*key\.toLowerCase\(\) !== 'f'/, 'an editor keeps its own Find');
// ---- the second hop tab is Pre and Post Boil Hops (OakBarn Brewery, 2026-11-22)
assert.match(appSrc, /\['posthops', 'Pre and Post Boil Hops'/);
console.log('panel update 9 tests passed');
