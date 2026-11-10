// Alarms and sound: node test/alarms.test.js
// alm_Name = true, play / stop SoundPlayer, one sound at a time by priority, Hop and Pre-Hop alarms on a timer,
// and the importer folding stacked look-alikes (gblS_Brewery_Top_1/2/3) into one.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store, SOUND_PLAYER, orderChain } from '../lib/store.js'; import { Engine, compile } from '../lib/engine.js';
import { TimeVal } from '../lib/values.js';
import { foldStacked, guessAlarmKind, rewriteAlarmLines } from '../lib/fold.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'alm'));
fs.mkdirSync(path.join(d, 'media', 'sounds'), { recursive: true });
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({
  mediaRoots: [path.join(d, 'media')],
  elements: [
    { name: 'alm_Hop1', type: 'alarm', kind: 'hop', sound: 'sounds/hop.wav', timer: 'tm_Boil', at: '00:15:00' },
    { name: 'alm_PreHop1', type: 'alarm', kind: 'prehop', sound: 'sounds/pre.wav', hopAlarm: 'alm_Hop1' },
    { name: 'alm_Boil', type: 'alarm', kind: 'brewflow', sound: 'sounds/boil.wav' },
    { name: 'alm_Note', type: 'alarm', kind: 'general', sound: 'sounds/note.wav' },
    { name: 'alm_Quiet', type: 'alarm', kind: 'hop', soundMode: 'none' },
    { name: 'tm_Boil', type: 'timer', timerType: 'countdown', initial: '00:30:00' },
    { name: 'vB_Flag', type: 'gGlobal', kind: 'bool' },
  ],
}));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const playing = () => store.list().filter(e => ['alarm', 'soundPlayer'].includes(e.type) && store.getProp(e.name, 'playing') === true).map(e => e.name);
const on = n => store.getProp(n, 'active');

// ---- the built-in Sound Player is always there (not on any tab)
assert.ok(store.has(SOUND_PLAYER)); assert.equal(store.get(SOUND_PLAYER).type, 'soundPlayer'); assert.equal(store.get(SOUND_PLAYER).workspace, undefined);

// ---- syntax: alm_Name = true, wait alm_Name == false, play / stop SoundPlayer
const run = async (name, text) => {
  engine.write(name, text);
  const r = engine.start(name); assert.equal(r.ok, true, `${name}: ${JSON.stringify(r)}`);
  for (let i = 0; i < 50 && engine.running.has(name); i++) await new Promise(r => setTimeout(r, 20));
  const st = engine.list().find(s => s.name === name);
  assert.notEqual(st.state, 'error', st.error);
};
await run('a', 'new bool vB\nalm_Note = true\nvB = alm_Note\n"vB_Flag" value = vB');
assert.equal(on('alm_Note'), true); assert.equal(store.getProp('vB_Flag', 'value'), true);
await run('b', 'if alm_Note == true\n  alm_Note = false\nendif\n"alm_Boil" = true');
assert.equal(on('alm_Note'), false); assert.equal(on('alm_Boil'), true);
await run('c', '"alm_Boil" active = false');                       // the old BruControl way still works
assert.equal(on('alm_Boil'), false);
await run('d', 'SoundPlayer path = "sounds/music.mp3"\nplay SoundPlayer');
assert.equal(store.getProp(SOUND_PLAYER, 'path'), 'sounds/music.mp3'); assert.equal(on(SOUND_PLAYER), true);
assert.deepEqual(playing(), [SOUND_PLAYER]);

// wait alm_Name == false: waits until the brewer taps the alarm off
engine.write('w', 'alm_Boil = true\nwait alm_Boil == false\n"vB_Flag" value = false');
store.setProp('vB_Flag', 'value', true);
engine.start('w'); await new Promise(r => setTimeout(r, 150));
assert.equal(engine.running.has('w'), true, 'still waiting');
store.setProp('alm_Boil', 'active', false, 'ui'); await new Promise(r => setTimeout(r, 150));
assert.equal(engine.running.has('w'), false); assert.equal(store.getProp('vB_Flag', 'value'), false);

// errors are caught before a Process starts
const errs = t => { engine.write('x', t); return engine.check(t).errors.map(e => e.msg); };
assert.match(errs('alm_Nope = true')[0], /Unknown name alm_Nope/);
assert.deepEqual(errs('vB_Flag = true'), [], 'every element works by name alone since the Process language change (PR #25)');
assert.match(errs('play tm_Boil')[0], /no alarm or sound player named "tm_Boil"/);
assert.match(compile('pause SoundPlayer').errors[0].msg, /pause is automatic/);
assert.throws(() => store.setProp('alm_Note', 'playing', true), /set by the panel/);

// ---- one sound at a time: the music pauses for an alarm and goes on after
store.setProp('alm_Note', 'active', true);
assert.deepEqual(playing(), ['alm_Note'], 'General alarm (4) beats the Sound Player (5)');
assert.equal(on(SOUND_PLAYER), true, 'the music is still on, only paused');
store.setProp('alm_Boil', 'active', true);
assert.deepEqual(playing(), ['alm_Boil'], 'Brew Flow (2) beats General (4)');
store.setProp('alm_PreHop1', 'active', true);
assert.deepEqual(playing(), ['alm_Boil'], 'Pre-Hop (3) waits for Brew Flow (2)');
store.setProp('alm_Hop1', 'active', true);
assert.deepEqual(playing(), ['alm_Hop1'], 'Hop (1) beats everything');
store.setProp('alm_Quiet', 'active', true);
assert.deepEqual(playing(), ['alm_Hop1'], 'an alarm with Sound = None makes no sound, so it never takes the speaker');
store.setProp('alm_Hop1', 'active', false);
assert.deepEqual(playing(), ['alm_Boil'], 'the waiting Brew Flow alarm sounds as soon as the Hop alarm is off');
store.setProp('alm_Boil', 'active', false);
assert.deepEqual(playing(), ['alm_PreHop1']);
store.setProp('alm_PreHop1', 'active', false); store.setProp('alm_Note', 'active', false);
assert.deepEqual(playing(), [SOUND_PLAYER], 'the music goes on when nothing higher is left');
await run('e', 'stop SoundPlayer');
assert.deepEqual(playing(), []);
// Alarm Priority (Rule 7.18): the same Priority never cuts in; the one playing goes on, and the other follows
assert.equal(store.getProp('alm_Note', 'priority'), 4, 'its Kind\'s number to start'); assert.equal(store.getProp('alm_Hop1', 'priority'), 1);
store.setProp('alm_Boil', 'active', true); store.setProp(SOUND_PLAYER, 'active', true);
store.rt.get('alm_Boil')._on -= 5000;      // Boil went On 5 seconds ago (not "at the same time")
store.setProp('alm_Note', 'priority', 2); store.setProp('alm_Note', 'active', true);
assert.deepEqual(playing(), ['alm_Boil'], 'the same Priority: the one already playing goes on');
store.setProp('alm_Boil', 'active', false); assert.deepEqual(playing(), ['alm_Note'], 'then the other follows');
store.setProp('alm_Boil', 'active', true); store.setProp('alm_Boil', 'priority', 1.9);
assert.deepEqual(playing(), ['alm_Boil'], '1.9 goes before 2.0');
store.setProp('alm_Boil', 'priority', 1.954); assert.equal(store.getProp('alm_Boil', 'priority'), 1.95, 'two decimal places');
assert.deepEqual(playing(), ['alm_Boil'], '1.95 slots in before 2 without renumbering');
assert.throws(() => store.setProp('alm_Boil', 'priority', 'high'), /two decimal places/);
store.setProp('alm_Boil', 'priority', ''); assert.equal(store.getProp('alm_Boil', 'priority'), 2, '"" puts back its Kind\'s number');
// a sound that does not repeat and has played to its end lets the next one play
store.setProp('alm_Boil', 'priority', 1); assert.deepEqual(playing(), ['alm_Boil']);
store.setProp('alm_Boil', 'finished', true, 'ui'); assert.deepEqual(playing(), ['alm_Note'], 'Boil played to its end: Note plays while Boil still shows');
assert.throws(() => store.setProp('alm_Boil', 'finished', true), /set by the panel/);
for (const n of ['alm_Boil', 'alm_Note', SOUND_PLAYER, 'alm_Quiet']) store.setProp(n, 'active', false);
store.setProp('alm_Note', 'priority', ''); store.setProp('alm_Boil', 'priority', '');
// two of the same Priority at the same moment: one is picked at random, then the other
{
  const won = new Set();
  for (let i = 0; i < 40; i++) {
    store.setProp('alm_Boil', 'priority', 2); store.setProp('alm_Note', 'priority', 2);
    store.setProp('alm_Boil', 'active', true); store.setProp('alm_Note', 'active', true);
    const first = playing()[0]; won.add(first);
    store.setProp(first, 'active', false); assert.deepEqual(playing(), [first === 'alm_Boil' ? 'alm_Note' : 'alm_Boil'], 'the other follows');
    for (const n of ['alm_Boil', 'alm_Note']) store.setProp(n, 'active', false);
  }
  assert.equal(won.size, 2, 'either one can be picked');
  store.setProp('alm_Note', 'priority', ''); store.setProp('alm_Boil', 'priority', '');
}

// ---- Hop Alarm on the boil timer at 15:00 left; its Pre-Hop Alarm 10 minutes earlier (25:00 left)
store.setProp('tm_Boil', 'value', new TimeVal(26 * 60)); store.setProp('tm_Boil', 'running', true);
store.tickTimers(0);
store.tickTimers(59); assert.equal(on('alm_PreHop1'), false, '25:01 left');
store.tickTimers(2); assert.equal(on('alm_PreHop1'), true, '24:59 left: pre-hop'); assert.equal(on('alm_Hop1'), false);
store.setProp('alm_PreHop1', 'active', false, 'ui');
store.tickTimers(5); assert.equal(on('alm_PreHop1'), false, 'fires once, not again every tick');
store.tickTimers(9 * 60 + 55); assert.equal(on('alm_Hop1'), true, '15:00 left: hop drop');
store.setProp('alm_Hop1', 'active', false, 'ui');
// a Process can move the times
store.setProp('tm_Boil', 'value', new TimeVal(30 * 60)); store.tickTimers(0);
await run('f', '"alm_PreHop1" before = 00:05:00\n"alm_Hop1" at = 00:20:00');
store.tickTimers(4 * 60 + 58); assert.equal(on('alm_PreHop1'), false);
store.tickTimers(4); assert.equal(on('alm_PreHop1'), true, '25:00 left = 5 minutes before 20:00');
store.setProp('tm_Boil', 'running', false);

// ---- importer: alarm kinds and the new syntax
assert.equal(guessAlarmKind('alm_Hops_1_ALARM'), 'hop');
assert.equal(guessAlarmKind('alm_Hidden_Hop_15min_Warning_ALARM'), 'prehop');
assert.equal(guessAlarmKind('alm_StrikeSpargeMash_ALARM'), 'brewflow');
assert.equal(guessAlarmKind('alm_Hidden_Beer_Music_1'), 'sound');
assert.equal(guessAlarmKind('alm_Hidden1_ALARM'), 'general');
assert.equal(rewriteAlarmLines('"alm_A" active = true\nwait   "alm_A"  active ==  false\nv = "alm_A" Active\n"alm_A" activeText = "x"\n"alm_AB" active = true', ['alm_AB', 'alm_A']).text,
  'alm_A = true\nwait   alm_A ==  false\nv = alm_A\n"alm_A" activeText = "x"\nalm_AB = true');

// ---- importer: stacked look-alikes fold into one item with all their pictures
const els = [
  { name: 'gblS_Top_1', type: 'gGlobal', kind: 'string', workspace: 'B1', x: 0, y: 30, w: 520, h: 470, images: ['a1', 'a2', 'a3'], background: 2, visibility: 'hidden' },
  { name: 'gblS_Top_2', type: 'gGlobal', kind: 'string', workspace: 'B1', x: 0, y: 0, w: 520, h: 460, images: ['b1', 'b2', 'b3'], background: 1, visibility: 'visible', initial: 'Hello' },
  { name: 'gblS_Top_3', type: 'gGlobal', kind: 'string', workspace: 'B1', x: 0, y: 0, w: 520, h: 470, images: ['c1', 'c2', 'c3'], background: 1, visibility: 'hidden' },
  { name: 'tm_Mash_1', type: 'timer', workspace: 'B1', x: 900, y: 0, w: 100, h: 60 },
  { name: 'tm_Mash_2', type: 'timer', workspace: 'B1', x: 900, y: 0, w: 100, h: 60 },
  { name: 'gblV_Hop1', type: 'gGlobal', kind: 'value', workspace: 'B1', x: 0, y: 600, w: 100, h: 60 },
  { name: 'gblV_Hop2', type: 'gGlobal', kind: 'value', workspace: 'B1', x: 300, y: 600, w: 100, h: 60 },
  { name: 'pic', type: 'picture', workspace: 'B1', x: 0, y: 0, w: 10, h: 10, follow: 'gblS_Top_3' },
];
const script = [
  '"gblS_Top_1" visibility = hidden',
  '"gblS_Top_2" visibility = hidden',
  '"gblS_Top_3" value = "Mash in"',
  '"gblS_Top_3" background = 2',
  '"gblS_Top_3" visibility = visible',
  'wait "sw_Go" state == true',
  '"gblS_Top_3" visibility = hidden',
  '"gblS_Top_1" background = vNum',
  'new value vNum',
].join('\n');
const f = foldStacked({ elements: els, graphics: [] }, [{ name: 's', text: script }]);
const top = f.cfg.elements.find(e => e.name === 'gblS_Top');
assert.ok(top, 'folded into gblS_Top');
assert.deepEqual(top.images, ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']);
assert.equal(top.background, 4, 'shows what the visible copy (Top_2, picture 1) showed');
assert.equal(top.initial, 'Hello'); assert.equal(top.visibility, 'visible');
assert.deepEqual([top.x, top.y, top.w, top.h], [0, 0, 520, 500]);
assert.deepEqual(top.bru.foldedFrom.map(x => x.name), ['gblS_Top_1', 'gblS_Top_2', 'gblS_Top_3']);
assert.ok(f.cfg.elements.some(e => e.name === 'tm_Mash_1') && f.cfg.elements.some(e => e.name === 'tm_Mash_2'), 'timers never fold');
assert.ok(f.cfg.elements.some(e => e.name === 'gblV_Hop1') && f.cfg.elements.some(e => e.name === 'gblV_Hop2'), 'different spots never fold');
assert.equal(f.cfg.elements.find(e => e.name === 'pic').follow, 'gblS_Top', 'settings pointing at a copy follow the fold');
assert.equal(f.scripts[0].text, [
  '// folded into "gblS_Top": "gblS_Top_1" visibility = hidden',
  '// folded into "gblS_Top": "gblS_Top_2" visibility = hidden',
  '"gblS_Top" value = "Mash in"',
  '"gblS_Top" background = 8',
  '"gblS_Top" visibility = visible',
  'wait "sw_Go" state == true',
  '"gblS_Top" visibility = hidden',
  '"gblS_Top" background = vNum',
  'new value vNum',
].join('\n'));
assert.equal(f.report[0].hidesDropped, 2);

// ---- the Alarm Chain (Rule 7.16): .step gives the Alarm a step's look and sound; No Change (left out) skips that choice
{
  const cd = fs.mkdtempSync(path.join(os.tmpdir(), 'almch'));
  fs.writeFileSync(path.join(cd, 'c.json'), JSON.stringify({ elements: [
    { name: 'alm_Brew', type: 'alarm', kind: 'brewflow', alarmClass: 'basic', sound: 'sounds/a.wav', foreColor: '#8bcf18', setGraphic: 'Images/Skynet/Alarms/Alarm_Set_Hop.svg',
      chain: [{ label: 'Strike', backColor: '#e74c3c', sound: 'sounds/strike.wav' }, { label: 'Mash', foreColor: '#f1c40f', setGraphic: '' }, { imageOverlay: 'Images/Skynet/Alarms/Alarm_Active_Red.svg' }] },
    { name: 'alm_Plain', type: 'alarm', kind: 'general' },
  ] }));
  const st = new Store(path.join(cd, 'c.json'), path.join(cd, 'data')); st.load();
  const g = p => st.getProp('alm_Brew', p);
  assert.equal(g('step'), 0); assert.equal(g('setgraphic'), '');
  st.setProp('alm_Brew', 'step', 1);
  assert.deepEqual([g('step'), g('backcolor'), g('forecolor'), g('sound'), g('soundmode'), g('setgraphic')], [1, '#e74c3c', '', 'sounds/strike.wav', 'custom', '']);
  st.setProp('alm_Brew', 'step', 'mash');      // by its name; Back color and sound were No Change, so they stay
  assert.deepEqual([g('step'), g('backcolor'), g('forecolor'), g('sound'), g('setgraphic')], [2, '#e74c3c', '#f1c40f', 'sounds/strike.wav', 'none']);
  st.setProp('alm_Brew', 'step', 'Step 3');    // a step with no name is Step 3
  assert.equal(g('imageoverlay'), 'Images/Skynet/Alarms/Alarm_Active_Red.svg'); assert.equal(g('forecolor'), '#f1c40f');
  st.setProp('alm_Brew', 'step', 0);           // back to its Properties
  assert.deepEqual([g('step'), g('backcolor'), g('forecolor'), g('sound'), g('setgraphic'), g('imageoverlay')], [0, '', '', 'sounds/a.wav', '', '']);
  assert.throws(() => st.setProp('alm_Brew', 'step', 4), /0 to 3/);
  assert.throws(() => st.setProp('alm_Brew', 'step', 'Boil'), /no Alarm Chain step named "Boil"/);
  assert.throws(() => st.setProp('alm_Plain', 'step', 1), /0 to 0/);
  st.setProp('alm_Brew', 'setgraphic', 'Images/Skynet/Alarms/Alarm_Set_Hop.svg'); assert.equal(g('setgraphic'), 'Images/Skynet/Alarms/Alarm_Set_Hop.svg');
  // a timer's Alarm Chain: ordered by when each step goes On; a timed step goes to that step and sounds the Alarm
  assert.deepEqual(orderChain([{ label: 'a', at: '00:05:00' }, { label: 'b' }, { label: 'c', at: '01:00:00' }]).map(x => x.label), ['c', 'a', 'b']);
  assert.deepEqual(orderChain([{ label: 'a', at: '00:05:00' }, { label: 'c', at: '01:00:00' }], false).map(x => x.label), ['a', 'c']);
  const hd = fs.mkdtempSync(path.join(os.tmpdir(), 'almht'));
  fs.writeFileSync(path.join(hd, 'c.json'), JSON.stringify({ elements: [
    { name: 'alm_Hops', type: 'alarm', kind: 'hop', alarmClass: 'basic', timer: 'tm_B', chain: [{ label: 'Bittering', at: '00:20:00', foreColor: '#e74c3c' }, { label: 'Aroma', at: '00:05:00', foreColor: '#f1c40f' }] },
    { name: 'tm_B', type: 'timer', timerType: 'countdown', initial: '00:21:00' },
  ] }));
  const hs = new Store(path.join(hd, 'c.json'), path.join(hd, 'data')); hs.load();
  hs.setProp('tm_B', 'running', true); hs.tickTimers(0);
  hs.tickTimers(59); assert.equal(hs.getProp('alm_Hops', 'active'), false, '20:01 left');
  hs.tickTimers(2); assert.deepEqual([hs.getProp('alm_Hops', 'active'), hs.getProp('alm_Hops', 'step'), hs.getProp('alm_Hops', 'forecolor')], [true, 1, '#e74c3c'], '19:59 left: Bittering');
  hs.setProp('alm_Hops', 'active', false, 'ui'); hs.tickTimers(5); assert.equal(hs.getProp('alm_Hops', 'active'), false, 'once');
  // a step that comes due while the last one still sounds waits its turn (Rule 7.18)
  hs.setProp('alm_Hops', 'active', true, 'ui');
  hs.tickTimers(15 * 60); assert.deepEqual([hs.getProp('alm_Hops', 'step'), hs.getProp('alm_Hops', 'waiting')], [1, 1], '05:00 left: Aroma waits, Bittering still sounds');
  hs.setProp('alm_Hops', 'active', false, 'ui');
  assert.deepEqual([hs.getProp('alm_Hops', 'active'), hs.getProp('alm_Hops', 'step'), hs.getProp('alm_Hops', 'forecolor'), hs.getProp('alm_Hops', 'waiting')], [true, 2, '#f1c40f', 0], 'tapped off: Aroma follows at once');
}
// the import's choice of style (Rule 16.9): alm = true (default), alm = On, or keep the old "alm" active = true
assert.equal(rewriteAlarmLines('"alm_X" active = true\nwait "alm_X" active == false', ['alm_X'], 'on').text, 'alm_X = On\nwait alm_X == Off');
assert.equal(rewriteAlarmLines('"alm_X" active = true', ['alm_X'], 'true').text, 'alm_X = true');
assert.equal(rewriteAlarmLines('"alm_X" active = true', ['alm_X'], 'keep').text, 'alm_X = true', 'the old style is never kept');

console.log('alarms tests passed');
process.exit(0);
