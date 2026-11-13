// The Alarm attributes (Rule 7.21, OakBarn Brewery's Alarm spec in the README markup): node --no-warnings test/alarmattrs.test.js
// .path, .label_fore / .label_back, .x .y .w .h, the automatic .visible, the hidden .toggle, .loop, .state, .skynet_Layer_2,
// .string, .playtime, a Pre-Hop Alarm's three Skynet watermarks (.background), and a Brew Flow Alarm's hidden wait.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import assert from 'node:assert/strict';
import { Store, attrsOf, PREHOP_MARKS } from '../lib/store.js'; import { Engine } from '../lib/engine.js'; import { skynetPicId } from '../lib/skynetpicids.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'almattr'));
fs.mkdirSync(path.join(d, 'media', 'sounds'), { recursive: true });
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({
  mediaRoots: [path.join(d, 'media')],
  elements: [
    { name: 'alm_Flow', type: 'alarm', kind: 'brewflow', alarmClass: 'basic', sound: 'sounds/flow.wav', label: 'Flow' },
    { name: 'alm_Pre', type: 'alarm', kind: 'prehop', alarmClass: 'prehop', string: 'Get the hops ready', playTime: 1, background: '2' },
    { name: 'alm_User', type: 'alarm', kind: 'general', alarmClass: 'user', string: 'Hello' },
    { name: 'alm_Old', type: 'alarm', kind: 'general' },
    { name: 'vB_Done', type: 'gGlobal', kind: 'bool' },
  ],
}));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const engine = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const get = (n, p) => store.getProp(n, p), set = (n, p, v) => store.setProp(n, p, v, 'script');

// .state is the same as the Alarm alone; .path is its sound
set('alm_User', 'state', 'On'); assert.equal(get('alm_User', 'active'), true); assert.equal(get('alm_User', 'state'), true);
set('alm_User', 'state', false);
set('alm_Flow', 'path', 'sounds/other.wav'); assert.equal(get('alm_Flow', 'sound'), 'sounds/other.wav'); assert.equal(get('alm_Flow', 'path'), 'sounds/other.wav');
// .label_fore / .label_back color its Label
set('alm_Flow', 'label_fore', 'Red'); assert.equal(get('alm_Flow', 'namecolor'), 'Red'); assert.equal(get('alm_Flow', 'label_fore'), 'Red');
set('alm_Flow', 'label_back', '#000000'); assert.equal(get('alm_Flow', 'namebg'), '#000000');
// .fore / .back
set('alm_Flow', 'fore', '#112233'); assert.equal(get('alm_Flow', 'forecolor'), '#112233');
// .x .y .w .h
set('alm_Flow', 'x', 40); set('alm_Flow', 'y', 50); set('alm_Flow', 'w', 160); set('alm_Flow', 'h', 120);
assert.deepEqual([get('alm_Flow', 'xposition'), get('alm_Flow', 'yposition'), get('alm_Flow', 'width'), get('alm_Flow', 'height')], [40, 50, 160, 120]);
assert.equal(get('alm_Flow', 'w'), 160);
// .skynet_Layer_2 is its Layer 2 picture (its Set Graphic)
set('alm_Flow', 'skynet_Layer_2', 'Images/Skynet/Alarms/Alarm_Set_Hop.svg'); assert.equal(get('alm_Flow', 'setgraphic'), 'Images/Skynet/Alarms/Alarm_Set_Hop.svg');
// ... or by its Skynet Picture number (Rule 7.22), with .path and .file (Rule 7.23)
set('alm_Flow', 'skynet_Layer_2', ''); set('alm_Flow', 'skynet_Layer_2', 6); assert.equal(get('alm_Flow', 'setgraphic'), 'Images/Skynet/Alarms/Alarm_Set_Hop.svg');
assert.equal(store.getProp('alm_Flow.skynet_Layer_2', 'file'), 'Alarm_Set_Hop.svg');
assert.equal(store.getProp('alm_Flow.path', 'file'), 'other.wav');
// a Pre-Hop Alarm's watermarks have Skynet Picture numbers
assert.ok(PREHOP_MARKS.every(p => skynetPicId(p) > 0));
// .loop
set('alm_Flow', 'loop', true); assert.equal(get('alm_Flow', 'loop'), true);
// .visible follows On / Off and is never set by a Process; .toggle is the click
assert.equal(get('alm_User', 'visible'), false);
set('alm_User', 'state', true); assert.equal(get('alm_User', 'visible'), true); set('alm_User', 'state', false);
assert.throws(() => set('alm_User', 'visible', true), /is set by itself/);
assert.throws(() => set('alm_User', 'toggle', true), /click/);
assert.throws(() => get('alm_User', 'toggle'), /click/);
// an Alarm made before the Alarm Widgets keeps its own .visible
set('alm_Old', 'visible', false); assert.equal(get('alm_Old', 'visible'), false);
// .string
assert.equal(get('alm_User', 'string'), 'Hello'); set('alm_User', 'string', 'Add the \\b Flavor Hops'); assert.equal(get('alm_User', 'string'), 'Add the \\b Flavor Hops');
// a Pre-Hop Alarm: three Skynet watermarks, .background picks one; its pictures can't be changed by a Process
assert.equal(get('alm_Pre', 'backpath'), PREHOP_MARKS[0]); assert.equal(get('alm_Pre', 'backpath_3'), PREHOP_MARKS[2]); assert.equal(get('alm_Pre', 'background'), '2');
set('alm_Pre', 'background', 3); assert.equal(get('alm_Pre', 'background'), '3');
assert.throws(() => set('alm_Pre', 'backpath', 'Images/Mine.svg'), /Skynet pictures/);
assert.throws(() => set('alm_Pre', 'image', 'Images/Mine.svg'), /Skynet pictures/);
// .playtime: it turns itself Off after that many seconds
assert.equal(get('alm_Pre', 'playtime'), 1);
assert.throws(() => set('alm_Pre', 'playtime', -2), /seconds/);
set('alm_Pre', 'playtime', 0.2); set('alm_Pre', 'state', true); assert.equal(get('alm_Pre', 'state'), true);
await new Promise(r => setTimeout(r, 400)); assert.equal(get('alm_Pre', 'state'), false, 'Play time turned it Off');
// the words offered in the Process editor: OakBarn Brewery's, without the hidden ones
const offered = attrsOf(store.get('alm_Flow'));
for (const a of ['path', 'label_fore', 'label_back', 'skynet_Layer_2', 'string', 'playtime', 'loop', 'state', 'x', 'y', 'w', 'h']) assert.ok(offered.includes(a), a);
for (const a of ['visible', 'toggle', 'setgraphic', 'sound']) assert.ok(!offered.includes(a), a);

// a Brew Flow Alarm: alm_Flow = On holds the Process until it is tapped Off
engine.write('flow', 'alm_Flow = On\n"vB_Done" value = true');
assert.equal(engine.start('flow').ok, true);
await new Promise(r => setTimeout(r, 400));
assert.equal(get('vB_Done', 'value'), false, 'still waiting for the Brew Flow Alarm');
assert.equal(engine.running.get('flow')?.waiting, true);
store.setProp('alm_Flow', 'active', false, 'ui');      // tapped Off
for (let i = 0; i < 50 && engine.running.has('flow'); i++) await new Promise(r => setTimeout(r, 20));
assert.equal(get('vB_Done', 'value'), true);
// alm_Flow.state = On waits too; any other Alarm does not
engine.write('flow2', 'alm_Flow.state = On\nalm_User = On\n"vB_Done" value = false');
engine.start('flow2'); await new Promise(r => setTimeout(r, 300)); assert.equal(get('vB_Done', 'value'), true); assert.equal(get('alm_User', 'state'), false);
store.setProp('alm_Flow', 'active', false, 'ui');
for (let i = 0; i < 50 && engine.running.has('flow2'); i++) await new Promise(r => setTimeout(r, 20));
assert.equal(get('vB_Done', 'value'), false); assert.equal(get('alm_User', 'state'), true);
console.log('alarm attribute tests passed');
process.exit(0);
