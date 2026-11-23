// Step by Step guides (OakBarn Brewery, 2026-11-11, Rule 11.9): a section of Help listed first, guides titled "Step by Step: ...",
// a picture of the real screen at each step. The first guide is Add a Schema (Help 188), with ☰ Menu > 🗂 Schema > Add new Schema ... to begin.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const page = read('help/188-step-by-step-add-a-schema.md');
assert.match(page, /^# Step by Step: Add a Schema\n/, 'the title puts it in the Step by Step section');
const pics = [...page.matchAll(/!\[[^\]]*\]\((help_pictures\/[^)]+)\)/g)].map(m => m[1]);
assert.ok(pics.length >= 8, 'a picture at each step');
for (const p of pics) assert.ok(fs.existsSync(new URL('../media/' + p, import.meta.url)), p + ' is there');
for (const l of [...page.matchAll(/\]\((\d+-[\w-]+)\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), 'link ' + l);
assert.doesNotMatch(page, /Fritz|BruControl/, 'Rules 11.3 and 11.5');

const help = read('public/help.js');
assert.match(help, /export const isStep = p => \/\^step by step\\s\*:\/i/, 'a Step by Step guide is found by its title');
assert.match(help, /'👣 Step by Step'/, 'the section heading in the page list');
assert.match(help, /optgroup', \{ label: 'Step by Step' \}/, 'and in the page dropdown on a phone');

const app = read('public/app.js');
assert.match(app, /const sel = schemaSelect\(\), was = sel\.onchange;/, '☰ Menu > 🗂 Schema dropdown > Add new Schema (Panel Update 12, item 2c)');
assert.match(app, /'➕ New Schema'\),/, 'the New Schema button on the Schema tab');
assert.match(app, /if \(v === '__new'\) return addNewSchema\(\);/, 'the Schema dropdown opens the same box');
assert.match(app, /openHelp\(\['step-by-step-add-a-schema'\]\)/, 'Step by step opens the guide');
console.log('stepbystep ok');

// Step by Step: Add a Device (Help 207) and Add a Widget (Help 208), OakBarn Brewery 2026-11-19: the step that is easy to miss is
// ✅ Finish Build ... > Move to Tab (a new Device or Widget stays on the 🔨 Build Tab until then), so each guide says so at the top.
for (const [f, title, n] of [['help/207-step-by-step-add-a-device.md', 'Add a Device', 12], ['help/208-step-by-step-add-a-widget.md', 'Add a Widget', 11]]) {
  const g = read(f);
  assert.match(g, new RegExp(`^# Step by Step: ${title}\\n`), f + ' is a Step by Step guide');
  assert.match(g.split('## Step 1.')[0], /Finish Build \.\.\. > Move to Tab/, f + ' warns about Finish Build before Step 1');
  const gp = [...g.matchAll(/!\[[^\]]*\]\((help_pictures\/[^)]+)\)/g)].map(m => m[1]);
  assert.ok(gp.length >= n, f + ': a picture at each step');
  for (const p of gp) assert.ok(fs.existsSync(new URL('../media/' + p, import.meta.url)), p + ' is there');
  for (const l of [...g.matchAll(/\]\((\d+-[\w-]+)(#[\w-]+)?\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), 'link ' + l);
  assert.doesNotMatch(g, /Fritz|BruControl/, 'Rules 11.3 and 11.5');
  assert.ok(fs.existsSync(new URL('../help/fr/' + f.split('/')[1], import.meta.url)), f + ' in French (Rule 11.11)');
}
for (const f of ['help/13-glossary.md', 'help/55-build-tab.md', 'help/01-getting-started.md', 'help/03-devices.md'])
  assert.match(read(f), /207-step-by-step-add-a-device/, f + ' links the Add a Device guide');
// Finish Build > Move to Tab to the Tab picked for it: the note says it kept its spot, not "the middle"
assert.match(app, /went\[0\]\.kept/, 'the Move to Tab note says when the build kept its spot');
console.log('stepbystep add device/widget ok');

// Wiring guides (OakBarn Brewery 2026-11-19, Rule 11.15): one Step by Step guide per part that needs more than a bare Port, the
// electrical warning and "You are responsible for your own safety." first, the Mega as the example, a Skynet drawing (MIT), French too.
for (const [f, pic] of [['209-step-by-step-wire-a-dac', 'DAC'], ['210-step-by-step-wire-a-10k-ntc-probe', 'NTC'], ['211-step-by-step-wire-an-ssr', 'SSR'],
  ['212-step-by-step-wire-1-wire-probes', 'OneWire'], ['213-step-by-step-wire-a-pt100-probe', 'PT100'], ['214-step-by-step-wire-a-pt1000-probe', 'PT1000'],
  ['215-step-by-step-wire-a-relay-board', 'Relay'], ['216-step-by-step-wire-a-contactor', 'Contactor'], ['217-step-by-step-wire-a-motorized-ball-valve', 'MBV'],
  ['218-step-by-step-wire-a-water-solenoid-valve', 'Solenoid'], ['219-step-by-step-wire-a-gas-solenoid-and-igniter', 'Gas'], ['220-step-by-step-wire-a-dc-pump-speed-control', 'DCPump'],
  ['221-step-by-step-wire-a-thermocouple', 'Thermocouple'], ['222-step-by-step-wire-an-lm35-or-tmp36', 'LM35'], ['223-step-by-step-wire-a-flow-meter', 'FlowMeter'],
  ['224-step-by-step-wire-a-pressure-transducer', 'Pressure'], ['225-step-by-step-wire-a-4-20-ma-level-transmitter', 'Level'], ['226-step-by-step-wire-a-0-10-v-sensor', 'ZeroTen'],
  ['227-step-by-step-wire-an-ads1115', 'ADS1115'], ['228-step-by-step-wire-a-vessel-scale', 'Scale'], ['229-step-by-step-wire-a-stepper-motor', 'Stepper'],
  ['230-step-by-step-wire-a-ph-probe', 'pH'], ['231-step-by-step-wire-an-e-stop', 'EStop'], ['232-step-by-step-wire-a-fan-buzzer-or-led', 'FanLED'],
  ['233-step-by-step-wire-switches-and-float-switches', 'Switch']]) {
  const g = read(`help/${f}.md`), top = g.split('## You need')[0];
  assert.match(g, /^# Step by Step: Wire /, f + ' is a Step by Step wiring guide');
  assert.match(top, /⚠ Electricity can kill\. OakBarn Brewery and Skynet are not electricians and can give no electrical advice\. Consult a Licensed Electrician\./, f + ': Rule 6.20 first');
  assert.match(top, /You are responsible for your own safety\.\*\* This guide shows a simple, very general way .* It cannot know your wiring, your parts or your electrical layout\./, f + ': the safety note first');
  assert.match(top, /Arduino Mega 2560\*\*, the standard Skynet board\. Other boards are wired the same way/, f + ': the Mega is the example');
  assert.match(g, /## Other boards/, f + ': other boards');
  const svg = `help_pictures/Step_Wire_${pic}_01_Wiring.svg`;
  assert.ok(g.includes(`](${svg})`), f + ' shows its drawing');
  const s = fs.readFileSync(new URL('../media/' + svg, import.meta.url), 'utf8');
  assert.match(s, /Skynet drawing \(MIT/, svg + ' is a Skynet drawing'); assert.match(s, /Electricity can kill/, svg + ' carries the warning');
  assert.match(read('docs/Media_Licenses.csv'), new RegExp(`Step_Wire_${pic}_01_Wiring\\.svg,media/help_pictures,.*MIT`), svg + ' in Media_Licenses.csv');
  for (const l of [...g.matchAll(/\]\((\d+-[\w-]+)(#[\w-]+)?\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), 'link ' + l);
  assert.doesNotMatch(g, /Fritz|BruControl/, 'Rules 11.3 and 11.5');
  assert.match(read(`help/fr/${f}.md`), /Vous êtes responsable de votre propre sécurité/, f + ' in French (Rule 11.11)');
}
// the SSR guide wires the Mega's active-low Ports the right way round: 5V to the SSR's +, the Port to its -
assert.match(read('help/211-step-by-step-wire-an-ssr.md'), /\*\*5V\*\* to the SSR's \*\*3 \(\+\)\*\*[\s\S]*Port \*\*D23\*\* to the SSR's \*\*4 \(-\)\*\*/);
assert.match(read('firmware/Mega_BrewPanel/Mega_BrewPanel.ino'), /const bool RELAY_ACTIVE_LOW = true;/, 'the Mega turns a Port On by pulling it LOW');
// the gas guide puts the gas warning first, on the page and on its drawing
assert.match(read('help/219-step-by-step-wire-a-gas-solenoid-and-igniter.md').split('## You need')[0], /⚠ Gas can explode or kill\./, 'the gas guide warns about gas first');
assert.match(fs.readFileSync(new URL('../media/help_pictures/Step_Wire_Gas_01_Wiring.svg', import.meta.url), 'utf8'), /Gas can explode or kill/);
console.log('stepbystep wiring guides ok');
// the 1-Wire guide (OakBarn Brewery 2026-11-19: "No Parasite Mode. Best to have external PWR but would work with board power ... The
// Pull up explained in the Step by step in details")
{
  const g = read('help/212-step-by-step-wire-1-wire-probes.md');
  assert.match(g, /never uses parasite mode/, 'no parasite mode');
  assert.match(g, /best is its own 5 V DC power supply\.\*\* The Mega's 5V works too/, 'its own supply best, board power works');
  assert.match(g, /## What the pull-up does[\s\S]*4\.7k ohm is the standard[\s\S]*2\.2k ohm/, 'the pull-up explained');
}
console.log('stepbystep 1-Wire ok');

// Step by Step: Add a Process (Help 240, Panel Updates entry 39): the Process editor, ➕ Add New Process..., a wait, a sleep with a Skynet
// Constant (skn_), temperatures typed in Units, Check, Save, Start and the Override pop-up, then a Process Widget; French too.
{
  const f = 'help/240-step-by-step-add-a-process.md', g = read(f);
  assert.match(g, /^# Step by Step: Add a Process\n/, f + ' is a Step by Step guide');
  for (const w of ['➕ Add New Process...', '📐 Constants', 'skn_const_Ms_p_Min', 'Settings > Units', '66.6667°C', 'Override pop-up', 'show_Override', 'Process Widget', 'Finish Build ... > Move to Tab'])
    assert.ok(g.includes(w), f + ' covers ' + w);
  assert.match(g, /^wait HLT_Vessel\.BM1w1_1_HLT_BH >= 152$/m, 'the wait uses the 3 Vessel sample HLT probe (Rule 11.7)');
  assert.match(g, /^HLT_Vessel\.BM_8_DO@H_Element_HLT~element_BH\.setpoint = 152$/m, 'and its HLT element');
  const gp = [...g.matchAll(/!\[[^\]]*\]\((help_pictures\/[^)]+)\)/g)].map(m => m[1]);
  assert.ok(gp.length >= 12, f + ': a picture at each step');
  for (const p of gp) assert.ok(fs.existsSync(new URL('../media/' + p, import.meta.url)), p + ' is there');
  for (const l of [...g.matchAll(/\]\((\d+-[\w-]+)(#[\w-]+)?\)/g)].map(m => m[1])) assert.ok(fs.existsSync(new URL(`../help/${l}.md`, import.meta.url)), 'link ' + l);
  assert.doesNotMatch(g, /Fritz|BruControl/, 'Rules 11.3 and 11.5');
  const fr = read('help/fr/240-step-by-step-add-a-process.md');
  assert.match(fr, /\{#step-by-step-add-a-process\}/, f + ' in French (Rule 11.11)');
  assert.deepEqual([...fr.matchAll(/!\[[^\]]*\]\((help_pictures\/[^)]+)\)/g)].map(m => m[1]), gp, 'the French page has the same pictures');
  for (const p of ['help/30-process-editor.md']) assert.match(read(p), /240-step-by-step-add-a-process/, p + ' links the guide');
  console.log('stepbystep add process ok');
}
