// gGlobals on a Tab become normal Widgets (Fritz, 2026-11-26: "There is no such thing as a gGlobal Widget";
// "All gblS and the gGS get changed to a Text Widget"; "gblT_SetTimer_Water to a Time Widget"). Rule 16.5.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const OLD = ['gblS_Step_Text', 'gblS_Advance_Label', 'gblS_Water_Text_1_Water', 'gGS_Brew_Notes', 'gblT_SetTimer_Water'];
const TEXTS = { 'wgt_TXT_Step~text_BH': 'Brew House', 'wgt_TXT_Advance~label_BH': 'Brew House', 'wgt_TXT_Water~message_BH': 'Brew House', 'wgt_TXT_Notes_RE': 'Reporting' };
for (const [cfg, procs] of [['config/brewery.json', 'processes'], ['samples/configs/three-vessel-one-pump/config.json', 'samples/configs/three-vessel-one-pump/processes']]) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, cfg), 'utf8'));
  for (const n of OLD) assert.ok(![...c.elements, ...c.graphics].some(e => e.name === n), `${cfg}: ${n} is gone`);
  for (const [n, ws] of Object.entries(TEXTS)) {
    const g = c.graphics.find(x => x.name === n);
    assert.ok(g && g.kind === 'text' && g.workspace === ws, `${cfg}: ${n} is a Text Widget on ${ws}`);
  }
  const tm = c.elements.find(e => e.name === 'wgt_TM_Set~Timer_BH');
  assert.ok(tm && tm.type === 'timeWidget' && tm.visibility === 'hidden', `${cfg}: Set Timer is a hidden Time Widget`);
  const ids = c.graphics.map(g => g.id).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `${cfg}: graphic ids are unique`);
  for (const f of fs.readdirSync(path.join(ROOT, procs)).filter(f => f.endsWith('.txt'))) {
    const src = fs.readFileSync(path.join(ROOT, procs, f), 'utf8');
    for (const n of OLD) assert.ok(!new RegExp(`\\b${n}\\b`).test(src), `${procs}/${f} no longer uses ${n}`);
    for (const n of Object.keys(TEXTS)) assert.ok(!src.includes(n + '.background'), `${procs}/${f}: a Text Widget has no .background`);
  }
}
console.log('gglobalwidgets: ok');
