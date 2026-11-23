// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Pre and Post Boil hop alerts (OakBarn Brewery, 2026-11-23, Rule 17.20): one Post Boil Pre Warning 10 minutes before the end of the boil
// with every Post Boil hop; each Hop Stand its own drop alert; the Fermenter hops after every Fermenter is filled; for All Grain, a Pre
// Boil Pre Warning at Strike, the Mash drop just after the Mash Timer starts and the 1st Wort drop just after the First Run.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hopSchedule, POST_BOIL_WARN_MINUTES } from '../public/recipecalc.js';
import { readRecipeFile, HopAlerts, hopAlertWhich, HOP_ALERT_WHICH } from '../lib/recipe.js';
import { compile, KEYWORDS } from '../lib/engine.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { SKYNET_SPECIAL } from '../public/procinsert.js';

// a BeerSmith file like the OakBarn Brewery hop test: Mash, Boil, two Whirlpool hops at 154 °F and 174 °F, two Dry Hops
const hop = (n, use, t, f = 194.44, dry = 0) => `<Hops><F_H_NAME>${n}</F_H_NAME><F_H_ALPHA>5</F_H_ALPHA><F_H_AMOUNT>1</F_H_AMOUNT><F_H_BOIL_TIME>${t}</F_H_BOIL_TIME><F_H_DRY_HOP_TIME>${dry}</F_H_DRY_HOP_TIME><F_H_WHIRLPOOL_TEMP>${f}</F_H_WHIRLPOOL_TEMP><F_H_USE>${use}</F_H_USE><F_H_IN_RECIPE>1</F_H_IN_RECIPE></Hops>`;
const file = type => `<Recipe><F_R_NAME>Hop Test</F_R_NAME><F_R_TYPE>${type}</F_R_TYPE><F_R_EQUIPMENT><F_E_BOIL_TIME>90</F_E_BOIL_TIME></F_R_EQUIPMENT><Ingredients><Data>
${hop('Hallertauer', 2, 90)}${hop('Fuggle', 3, 90)}${hop('African Queen', 0, 31)}${hop('Naga', 4, 60, 154.4)}${hop('Banner', 4, 10, 174.4)}${hop('Goldings', 1, 0, 194.44, 5)}${hop('Spalter', 1, 0)}
</Data></Ingredients></Recipe>`;
const rc = readRecipeFile(Buffer.from(file(2), 'latin1'), 'HopTest.bsmx').recipe;
const s = hopSchedule(rc, { units: 'US' });

// 1. one Pre Warning 10 minutes before the end of the boil with every Post Boil hop (the stands, the Dry Hops)
assert.equal(POST_BOIL_WARN_MINUTES, 10);
const pre = s.alerts.find(a => a.at === 80);
assert.ok(pre, 'an alert 10 minutes before the end of a 90 minute boil');
assert.match(pre.text, /10 minutes left in the boil: get the Post Boil hops ready: Hop Stand High \(174 °F, 10 min\): 1 oz Banner; Hop Stand Middle \(154 °F, 60 min\): 1 oz Naga; Dry Hop: 1 oz Spalter; Dry Hop \(5 days\): 1 oz Goldings/);
assert.ok(!s.alerts.some(a => /Flame out/.test(a.text)), 'hops in a ready Hop Stand get no flame out drop');
assert.ok(!s.alerts.some(a => /get the Whirlpool hops ready/.test(a.text)), 'no second warning for them');

// 2. each Hop Stand its own drop alert, sent by the Process (hop_alert "Hop Stand High")
const which = s.processAlerts.map(a => a.which);
assert.deepEqual(which, ['Pre Boil', 'Mash', '1st Wort', 'Hop Stand High', 'Hop Stand Middle', 'Fermenter']);
const by = w => s.processAlerts.find(a => a.which === w);
assert.match(by('Hop Stand High').text, /^Hop Stand High: the wort is at 174 °F\. Add the Hop Stand High hops now: 1 oz Banner\. Cooling water off for 10 minutes\.$/);
assert.match(by('Hop Stand Middle').text, /154 °F.*1 oz Naga.*60 minutes/);
assert.equal(by('Hop Stand High').kind, 'drop'); assert.match(by('Hop Stand High').audio, /^Audio\/Hops\/Hop_Alert_.*\.mp3$/);
// 3. the Fermenter hops after every Fermenter is filled, to set a reminder on a phone
assert.match(by('Fermenter').text, /The Fermenters are filled\. Set a reminder on your phone for the Fermenter hops: Dry Hop: 1 oz Spalter; Dry Hop \(5 days\): 1 oz Goldings/);
// 4. All Grain: the Pre Boil Pre Warning at Strike, the Mash drop, the 1st Wort drop
assert.equal(by('Pre Boil').kind, 'warn');
assert.match(by('Pre Boil').text, /The Strike Water is at Strike\. Get the Pre Boil hops ready: Top of Mash: 1 oz Hallertauer; 1st Wort: 1 oz Fuggle/);
assert.match(by('Mash').text, /The Mash Timer has started\. Add the Top of Mash hops now: 1 oz Hallertauer/);
assert.match(by('1st Wort').text, /The First Run is complete\. Add the 1st Wort hops now: 1 oz Fuggle/);
// ... only for All Grain: an Extract or Partial Mash Recipe has none of the three ("the other lower levels have none")
for (const t of [0, 1]) assert.deepEqual(hopSchedule(readRecipeFile(Buffer.from(file(t), 'latin1'), 'X.bsmx').recipe, {}).processAlerts.map(a => a.which), ['Hop Stand High', 'Hop Stand Middle', 'Fermenter'], `type ${t}: no Pre Boil alerts`);

// a Whirlpool hop with no ready Hop Stand (a BeerXML file has no whirlpool temperature) keeps its drop at flame out, and is in the Pre Warning
const x = JSON.parse(JSON.stringify(rc)); for (const h of x.ingredients.hops) { delete h.stand; delete h.wpTempC; } x.hopStands = {};
const sx = hopSchedule(x, { units: 'US' });
assert.ok(sx.alerts.some(a => a.at === 90 && /Flame out\. Add the Whirlpool hops now: 1 oz Naga/.test(a.text)));
assert.match(sx.alerts.find(a => a.at === 80).text, /Whirlpool \(flame out\): 1 oz Naga/);
assert.ok(!sx.processAlerts.some(a => a.stand), 'no Hop Stand alert');
// a stand whose numbers come from the Boil Profile (as the Process reads them) is ready too
const bp = { units: 'US', hsLowTemp: 70, hsLowMin: 30 };
const y = JSON.parse(JSON.stringify(x)); y.ingredients.hops.find(h => h.name === 'Naga').stand = 'Low';
assert.deepEqual(hopSchedule(y, { units: 'US' }, bp).processAlerts.filter(a => a.stand).map(a => a.which), ['Hop Stand Low']);
assert.deepEqual(hopSchedule(y, { units: 'US' }).processAlerts.filter(a => a.stand).map(a => a.which), [], 'without its numbers it is not stopped at: flame out');

// the Process command: hop_alert "Mash" (quotes or not); "High" alone is Hop Stand High
for (const w of HOP_ALERT_WHICH) assert.deepEqual(compile(`hop_alert "${w}"\n`).errors, [], w);
assert.deepEqual(compile('hop_alert Mash\nhop_alert Fermenter\n').errors, []);
assert.match(compile('hop_alert\n').errors[0].msg, /hop_alert needs which alert/);
assert.equal(hopAlertWhich('high'), 'Hop Stand High'); assert.equal(hopAlertWhich('First Wort'), '1st Wort'); assert.equal(hopAlertWhich('pre_boil'), 'Pre Boil'); assert.equal(hopAlertWhich('Boil'), null);
assert.ok(KEYWORDS.has('hop_alert') && PROCESS_WORDS.has('hop_alert') && COMMANDS.includes('hop_alert') && SKYNET_SPECIAL.includes('hop_alert'));

// HopAlerts.sendAlert: sends that alert to every screen; nothing to send (or no Recipe) is no error, so a Process Template always runs
let got = [], cur = rc;
const ha = new HopAlerts({ store: { has: () => false }, send: a => got.push(a), recipe: () => cur });
assert.equal(ha.sendAlert('Hop Stand Middle'), 'Hop Stand Middle hop alert sent'); assert.equal(got[0].which, 'Hop Stand Middle'); assert.equal(got[0].recipe, 'Hop Test');
assert.match(ha.sendAlert('Hop Stand Low'), /No Hop Stand Low hops/); assert.equal(got.length, 1);
assert.throws(() => ha.sendAlert('Whirlpool'), /hop_alert needs one of/);
cur = null; assert.match(ha.sendAlert('Mash'), /No Recipe is loaded/);

// the Skynet Process Templates and the 3 Vessel sample send them at the right moments
const T = p => fs.readFileSync(p, 'utf8');
for (const f of ['Skynet_Heat_Strike', 'Skynet_Heat_Strike_1_Vessel', 'Skynet_Heat_Strike_2_Vessel']) assert.match(T(`templates/process/Heat_Strike/${f}.txt`), /(wait \{\{HLT_Probe\}\} >= skn_rcp_Strike_Temp|reaches)[\s\S]*hop_alert "Pre Boil"\nprint "Strike water at/);
for (const f of ['Skynet_Mash', 'Skynet_Mash_1_Vessel', 'Skynet_Mash_2_Vessel']) {
  assert.match(T(`templates/process/Mash/${f}.txt`), /start \{\{Mash_Timer\}\}\n  if \{\{n\}\} == 1\n    hop_alert "Mash"/);
  assert.match(T(`templates/process/Mash/${f}.txt`), /hop_alert "1st Wort"/);
}
for (const f of ['Chill/Skynet_Chill', 'Whirlpool_and_Chill/Skynet_Whirlpool_and_Chill']) for (const k of ['High', 'Middle', 'Low'])
  assert.match(T(`templates/process/${f}.txt`), new RegExp(`wait \\{\\{Wort_Probe\\}\\} <= skn_rcp_Hop_Stand_${k}_Temp[\\s\\S]*?hop_alert "Hop Stand ${k}"[\\s\\S]*?skn_Whirlpool_Timer = skn_rcp_Hop_Stand_${k}_Minutes \\* 60\\n  start skn_Whirlpool_Timer\\n  wait skn_Whirlpool_Timer <= 00:00:00`));
assert.match(T('templates/process/Transfer_to_Fermentor/Skynet_Transfer_to_Fermentor.txt'), /close_all_valves\nhop_alert "Fermenter"/);
const flow = T('samples/configs/three-vessel-one-pump/processes/BrewDay_Flow.txt');
assert.match(flow, /wait HLT_Vessel\.BM1w1_1_HLT_BH >= skn_rcp_Strike_Temp\n[^\n]*\nhop_alert "Pre Boil"/);
assert.match(flow, /start "wgt_TMR_Step~timer_BH"\nhop_alert "Mash"\nvSMsg = "Mash step 1/);
assert.match(flow, /wait gblV_Brew_Status == 303\nhop_alert "1st Wort"/);
assert.match(flow, /wait gblV_Brew_Status == 603\nhop_alert "Fermenter"/);
assert.deepEqual(compile(flow).errors, [], 'the 3 Vessel sample still compiles');
console.log('prepostboil ok');
