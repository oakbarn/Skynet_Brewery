// The Pump dialog is the model (OakBarn Brewery, 2026-11-10, Rule 18.34): Label Hover Help, Title Case, Label Attributes
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const tc = app.slice(app.indexOf('const TITLE_SMALL'), app.indexOf('const TITLED'));
const titleCase = new Function(tc + '; return titleCase;')();
assert.equal(titleCase('Fore color'), 'Fore Color');
assert.equal(titleCase('Label attributes'), 'Label Attributes');
assert.equal(titleCase('Database and .API'), 'Database and .API');
assert.equal(titleCase('Width (pixels)'), 'Width (pixels)');
assert.equal(titleCase('pH meter'), 'pH Meter');
assert.equal(titleCase('Clone: put a copy of this thing next to it'), 'Clone: put a copy of this thing next to it', 'a sentence is left alone');
assert.doesNotMatch(app, /Default \(Centered\)/, 'no Default (Centered) choice');
assert.match(app, /const ALIGN_LCR = \[\['MiddleLeft', 'Left'\], \['', 'Centered', 'MiddleCenter'\], \['MiddleRight', 'Right'\]\]/);
assert.match(app, /title: 'Label Attributes'/);
assert.match(app, /nm\.style\.textAlign = \(nal \|\| 'Center'\)/, 'a Label is really Centered when nothing is set');
assert.match(app, /How do You refer to this Pump\. Brewing Pump, Mash Pump, HLT Pump \.\.\.\? Use your name for the Pump as the Label\. OakBarn Brewery Sample Schema has several Pumps and they are Color Coded with a Cover\./, 'the Red Pump text word for word');
assert.match(app, /⟪img:help_pictures\/Label_Visible_Switch\.png⟫/, 'with its pictures');
assert.match(app, /⟪img:help_pictures\/Red_Pump_Label\.png⟫/);
for (const f of ['Label_Visible_Switch.png', 'Red_Pump_Label.png']) assert.ok(fs.existsSync(new URL('../media/help_pictures/' + f, import.meta.url)), f);
assert.match(app, /\['label', n\(\) \+ 'Label', 'text', null, false, false, \{ tip: T\.label, \.\.\.\(dd \? \{ up: 2, attr: LABEL_POP \}/, 'the ⬆ in the Add box');
assert.match(app, /\['hideName', 'Label Visible', 'show', null, false, false, \{ tip: isPumpDev\(e\) \? LABEL_VISIBLE_PUMP_TIP/, 'Label Visible stays in the Add box');
assert.match(app, /Suggested Name Format: INTERFACEid_Port_Type_Label_TABid/);
assert.match(app, /with: \['channel', 'Available Ports', 'pinsel', 'digital', false, false, \{ tip: T\.port \}\]/, 'Available Ports has its own balloon');
assert.match(fs.readFileSync(new URL('../help/115-pump-device-properties.md', import.meta.url), 'utf8'), /## The Label/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /^18\.34 \*\*The Pump dialog is the model/m);
// the second part of the Add box (2026-11-11)
assert.match(app, /\['User', 'User Add'\]\]/, 'User Add');
assert.match(app, /async function pickCoverColor\(obj\)/, 'its Color Picker');
assert.match(app, /cancelText: '◀ Back'/, 'Back sets None');
// the Color Picker (Rule 2.48): Pickr in every color box, the Cover Color field just below the Cover
assert.match(app, /import \{ openColorPicker, hexToRgb, rgbText, rgbNums, parseRgb \} from '\.\/colorpick\.js'/, 'the Color Picker');
assert.match(app, /\['coverColor', 'Color \(RGB\)', 'rgb'/, 'the Color (RGB) field waits below the Cover');
assert.match(app, /txt\.addEventListener\('dblclick'/, 'double-click brings up the Color Picker again');
// the Pump dialog to OakBarn Brewery's drawing (2026-11-11): KISS names, Use greyed, X Y Width Height on one line, PWM pumps only,
// known values greyed out, the electrical warning in the Power Hover Help
assert.doesNotMatch(app, /`From the drawing \(/, 'no From the drawing (...)');
assert.match(app, /const pumpUseText = it => useOf\(it\) === 'cold' \? 'Cold \(glycol, ice water\)' : 'Hot & Cool'/);
assert.match(app, /const PUMP_XYWH = /);
assert.match(app, /showIf: pumpPwmShown/);
assert.match(app, /pumpPower: '⚠ Electricity can kill\./);
assert.doesNotMatch(app, /\['_pwarn'/, 'no warning line in the dialog');
assert.match(app, /live\.value = 'None'; live\.dispatchEvent/);
assert.match(app, /The Picture itself cannot be changed\./);
assert.match(app, /i\.disabled = true; i\.title = 'Set: the board and pin it is wired to\. Cancel to change it\.'/, 'the Interface line greyed out');
assert.match(app, /select\.orientSel'\) \|\| body\.querySelector\('\.afterStep select, \.afterStep input'\)\)\?\.focus\(\)/, 'focus to Orientation');
assert.match(app, /\['cover', 'coverColor', \.\.\.PUMP_TYPE_KEYS\]/, 'the picked color is kept');
console.log('pump model tests passed');
