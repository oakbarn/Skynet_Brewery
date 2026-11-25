// Rule 4.1 (OakBarn Brewery, 2026-11-12): every new Device and Widget starts on the 🔨 Build Tab and Finish Build ... moves it to the Tab
// picked in its Add box; its spot there is its spot on that Tab; the Watermark; the red glow until clicked; 📁 Templates in the Tab list.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8');
const help = fs.readFileSync(new URL('../help/55-build-tab.md', import.meta.url), 'utf8');

assert.doesNotMatch(app, /if \(e\.workspace && e\.workspace !== wsName\) \{ wsName = e\.workspace; renderTabs\(\); \}/, 'no new Device goes straight on its Tab any more');
const add = app.slice(app.indexOf('async function addThing('), app.indexOf('function elemVesselBuild('));
assert.match(add, /useTabProfile\(e\);[^\n]*\n\s*keepOnBuild\(e\);/, 'addThing keeps it on the Build Tab, after taking its Tab\'s look');
assert.equal((app.match(/useTabProfile\(e\); keepOnBuild\(e\);/g) || []).length, 2, 'Thermowell and Probe Tee too');
assert.match(app, /const parts = breakMf\(g\) \|\| \[\];\n\s*for \(const x of parts\) keepOnBuild\(x\);/, 'a Valve Tee: its Long Tees, valves and IPs too (Rule 5.35)');
const keep = app.slice(app.indexOf('function keepOnBuild('), app.indexOf('function keepOnBuild(') + 700);
assert.match(keep, /x\.buildTo = to\.name/, 'the picked Tab is remembered');
assert.match(keep, /b\.width = Math\.max/, 'the Build Tab is at least as big as that Tab');
assert.match(app, /tab: tabIdOf\(nameTab\(e\)\)/, 'its Suggested Name keeps the picked Tab\'s ID');
const mv = app.slice(app.indexOf('function moveBuildTo('), app.indexOf('function centerOn('));
assert.match(mv, /if \(!list\.some\(x => buildToOf\(host\(x\) \|\| x\) === to\.name\)\) centerOn\(list, to\);/, 'its spot is kept on the Tab picked for it');
assert.match(mv, /delete x\.buildTo/, 'buildTo goes when it is moved');
assert.match(mv, /freshMoved\.add\(freshKey\(x\)\)/, 'it glows once moved');
assert.match(app, /for \(const x of \[\.\.\.draft\.elements, \.\.\.draft\.graphics\]\) if \(x && !onB\.has\(x\)\) delete x\.buildTo;/, 'buildTo is never saved on a regular Tab (only in the kept Build)');
assert.match(app, /const first = picked\[0\] \|\| b\.from;/, 'Finish Build offers the picked Tab first');
assert.match(html, /<button id="buildMark" class="hidden"/, 'the Watermark switch on the Edit layout bar');
assert.match(app, /localStorage\.setItem\('bp\.buildMark'/, 'the switch is remembered');
assert.match(css, /#ws \.buildMark \{[^}]*pointer-events: none/, 'the watermark can\'t be clicked');
// the water paper is the Tab itself (OakBarn Brewery, 2026-11-19: "should not be an equipment profile but the tab with all the widgets")
assert.match(css, /#ws \.buildMark \* \{ pointer-events: none !important; \}/, 'nothing in the copy can be clicked');
assert.match(app, /function buildMarkCopy\(to\) \{[\s\S]*?editing = false; previewing = true;[\s\S]*?drawWs\(\);/, 'the Tab is drawn the Brew Day way and copied');
assert.match(app, /x\.removeAttribute\('data-name'\); x\.removeAttribute\('data-gid'\);/, 'nothing in the copy has a name');
assert.match(app, /if \(!t && buildFor\(b\) !== 'template'\) t = buildGoesTo\(b\.name\);/, 'it shows as soon as the Build Tab opens (not for a Template)');
assert.match(app, /if \(!n\.closest\('\.buildMark'\)\) n\.remove\(\);/, 'drawing the Build Tab keeps the copy');
assert.match(css, /@keyframes freshPulse/, 'a slow red pulse');
assert.match(css, /#ws \.freshMoved \{ animation: freshPulse 2\.4s/, 'slow');
assert.match(app, /const n = ev\.target\.closest\('\.freshMoved'\); if \(!n\) return;\s*freshMoved\.delete/, 'a click ends the glow');
assert.match(app, /'📁 Templates \(Finish Build \.\.\. saves it as a Template\)'/, '📁 Templates in the Tab list');
assert.match(app, /const tplOk = onBuildTab\(item\) && item\.kind === 'vessel'/, 'only for what can be a Template');
assert.match(rules, /4\.1 \*\*Every new Device, Widget or copy of a Template starts on the 🔨 Build Tab, never on a regular Tab\*\*/, 'Rule 4.1');
assert.match(help, /## Where it goes/, 'Help 55');
assert.match(help, /### The Watermark/, 'Help 55 Watermark');
// an open Build is never thrown away (OakBarn Brewery, 2026-11-16: "Need to keep adding to the open Build tab and never leave with out
// a Warning that you will lose the work if not saved"): Edit layout opened again keeps its draft; every Add goes to the open Build Tab
{
  const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(src, /function setEditing\(on\) \{\n(  \/\/[^\n]*\n)+  if \(on && editing && draft\) \{ renderTabs\(\); renderWs\(\); return; \}/, 'Edit layout opened again keeps the open Build');
  assert.equal((src.match(/draft = on \? clone\(S\.config\) : null;/g) || []).length, 1, 'only setEditing starts a draft');
  assert.match(src, /function toBuild\(\) \{\n  if \(!editing\) return;\n  let b = buildWs\(\);/, 'the open Build Tab is used, a new one only when there is none');
  for (const f of ['addTcFit', 'addThing', 'addIpFit', 'addEquipment', 'addText']) {
    const i = src.indexOf(`function ${f}(`); assert.ok(i > 0, f);
    assert.ok(/toBuild\(\)|keepOnBuild\(/.test(src.slice(i, i + 2500)), `${f} puts the new item on the open Build Tab`);
  }
  assert.match(src, /window\.addEventListener\('beforeunload', e => \{ if \(dirty \|\| \(editing && JSON\.stringify\(draft\) !== JSON\.stringify\(S\.config\)\)\)/, 'closing the page with an unsaved Build warns');
}
// Saving never ends the Build (Rule 4.1, OakBarn Brewery 2026-11-16: "I want to add things to an existing Build and leave in Build
// Mode"; "Lets do A"): Save layout sends the regular Tabs and keeps the Build on the Brain (buildDraft); it comes back next time
{
  const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8'), srv = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const i = src.indexOf('const saveLayout = guard('), sl = src.slice(i, i + 3000);
  assert.ok(!/saveBuild\(\)/.test(sl), 'Save layout never opens Finish Build');
  assert.match(sl, /workspaces: draft\.workspaces\.filter\(w => !w\.build\)/, 'the Build Tab is not saved as a Tab');
  assert.match(sl, /buildDraft: snap/, 'the unfinished Build is kept on the Brain');
  assert.match(sl, /if \(snap && !leave\) \{ setEditing\(true\);/, 'after Save layout the Build stays open in Edit layout');
  assert.match(src, /if \(draft && restoreBuild\(\)\) setTimeout\(buildBackNote, 300\);/, 'a kept Build comes back when Edit layout opens');
  assert.match(src, /'🗑 Discard Build'/, 'one click to Discard a kept Build');
  assert.match(src, /'↩ Undo'/, 'Undo after Discard (Rule 2.53)');
  assert.match(src, /if \(r === 'discard'\) \{ const snap = buildSnap\(\); if \(snap\) \{ await keepBuild\(snap\);/, 'Exit without Saving keeps the Build');
  assert.match(src, /dropBuild\(\); await keepBuild\(null\);/, 'Throw it away lets the kept Build go');
  assert.match(src, /moveBuildTo\(r\.tab\)/, 'Move to Tab: one Tab for the whole Build');
  assert.match(src, /freePins\(w, \(draft \|\| S\.config\)\.elements/, 'Available Ports leaves out the Ports of Devices in the Build (they are in the draft)');
  assert.match(srv, /p === '\/ui\/build' && m === 'PUT'/, 'the Brain keeps the Build');
  assert.match(srv, /if \('buildDraft' in body\) setBuildDraft\(body\.buildDraft\);/, 'Save layout keeps or lets go of the Build');
  assert.ok(!/Save Build/.test(src), 'the button is ✅ Finish Build ...');
}
console.log('buildfirst ok');
