// "Recheck dialogs" pass, part 1 (OakBarn Brewery, 2026-11-18, Rules 18.47, 18.50, Help 148): the Alarm Widgets follow the Hose Bib Model
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const fn = app.slice(app.indexOf('function alarmWidgetFields('), app.indexOf('function chainFields('));
const order = ["['locked', '', 'lock'", "['hidden', 'Hidden Locked'", "['label', '1. Label'", "['hideName', 'Label Visible'", "['workspace', '2. Tab'",
  "['name', '3. Name'", "['_gb', 'Graphic', 'box']", "['_ab', 'Alarm', 'box']", '...chainFields(it)', '...wgtPlace()', 'wgtType('].map(k => fn.indexOf(k));
assert.ok(order.every((x, i) => x > 0 && (i === 0 || x > order[i - 1])), 'the Hose Bib order: title line, Label, Tab, Name, Graphic, Alarm, Chain, place, Widget Type');
assert.match(fn, /inTitle: true/, 'lock and Hidden Locked in the title line');
assert.match(fn, /'Active overlay \(Layer 1, on top while it is active\)', kind, list, false, 'b', \{ dbPop: true \}/, 'Database and .API on the Active overlay line');
assert.match(app, /if \(it\.type === 'alarm' && it\.alarmClass\) return alarmWidgetFields\(it\);/, 'no separate Database box below');
// nothing taken away (Design Rule 1)
for (const k of ['bell', 'backColor', 'foreColor', 'setGraphic', 'backpath', 'kind', 'timer', 'hopAlarm', 'before', 'priority', 'string', 'playTime', 'EMAIL_FIELDS', 'ALARM_OUT_FIELDS', 'A.sound', 'A.loop'])
  assert.ok(fn.includes(k), k);
assert.match(fs.readFileSync(new URL('../help/148-every-device-dialog.md', import.meta.url), 'utf8'), /\*\*Alarm Widgets\*\* \(Skynet Rule 18\.50/);
console.log('recheck part 1 (Alarm Widgets) ok');
