// 🔓 Unlock its IPs in Properties (OakBarn Brewery, 2026-11-21: "Need unlock IPs on property dialog for things that have IPs";
// Rule 5.37, Help 153): the title line of the Properties of anything with IPs has the grab pop-up's Unlock, done at once.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const fn = app.slice(app.indexOf('function propsUnlockIps('), app.indexOf('// an item dropped where something let go of its pipes'));
assert.ok(fn.length > 100, 'propsUnlockIps is there');
assert.match(fn, /it\.kind === 'pipe' \|\| grabIpIds\(it\)\.length/, 'only on things with IPs, and pipes / hoses');
assert.match(fn, /'🔓 Unlock its ends' : '🔓 Unlock its IPs'/, 'the same words as the grab pop-up');
assert.match(fn, /pushUndo\(`unlock \$\{who\}`\); unlockJoins\(now\)/, 'the same unlock, and ↩ Put back undoes it');
assert.match(fn, /profileFrozen\(it\)[\s\S]*it\.locked[\s\S]*!n/, 'greyed out for lock_Equipment, a locked item (Rule 2.12) and nothing joined');
assert.match(fn, /class: 'ttlExtra', 'data-for': '_unlockIps'/, 'in the title line');
assert.match(app, /propsUnlockIps\(item, \(\) => \{ if \(item\.kind === 'pipe'\) \{ work\.from = item\.from; work\.to = item\.to; \} \}\);[^\n]*\n  let r = await dialog\(/, 'every Properties dialog; a pipe keeps its let-go ends on Save');
assert.match(app, /propsUnlockIps\(v\);[^\n]*\n  const r = await dialog\(`\$\{v\.label \|\| v\.name\} \(bundled\)`/, 'a bundled vessel too');
const help = fs.readFileSync(new URL('../help/153-move-alone-swap-put-back.md', import.meta.url), 'utf8');
const fr = fs.readFileSync(new URL('../help/fr/153-move-alone-swap-put-back.md', import.meta.url), 'utf8');
assert.match(help, /## Unlock its IPs from Properties/);
assert.match(fr, /\{#unlock-its-ips-from-properties\}/);
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /\*\*🔓 Unlock its IPs in Properties\*\*/);
console.log('propsunlockips ok');
// Small IP dots (OakBarn Brewery, 2026-11-23, Rule 5.20): in Edit layout a round IP marker is a small red dot that only the dot can be
// pointed at; hovered or selected it is the full circle with its letters and name tag again
const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
assert.match(css, /#ws\.editing \.gfx\.ip:not\(\.fit\):not\(\.has-img\):not\(:hover\):not\(\.sel\) \{[^}]*pointer-events: none/, 'only the dot takes the mouse');
assert.match(css, /#ws\.editing \.gfx\.ip:not\(\.fit\):not\(\.has-img\)::before \{[^}]*background: #e01b12[^}]*pointer-events: auto/, 'a small red dot');
assert.match(css, /:is\(:hover, \.sel\)::before \{ display: none; \}/, 'hovered or selected: the full circle');
assert.match(css, /:not\(:hover\):not\(\.sel\) > \.iplbl \{ display: none; \}/, 'its name tag waits for the hover');
assert.match(fs.readFileSync(new URL('../docs/Skynet_Rules.md', import.meta.url), 'utf8'), /round IP marker is drawn as a \*\*small red dot\*\*/);
console.log('small IP dots ok');
// ↔ Move with pipes beside it (OakBarn Brewery, 2026-11-23): the grab pop-up's other choice, not on a pipe or hose
assert.match(fn, /grabWith\.add\(it\.id \|\| it\.name\); w\.disabled = b\.disabled = true/, 'the next drag moves it with its pipes, without asking');
assert.match(fn, /const riders = pipe \? \[\] : lockedRiders\(it\)/, 'greyed out when a locked pipe or fitting would move with it');
assert.match(fn, /'↔ Move with pipes'/);
console.log('move with pipes ok');
// 🔍 Zoom box (OakBarn Brewery, 2026-11-23, picked A: the Z key): 200 screen pixels around the mouse, 3 times bigger, look only
assert.match(app, /const ZOOM_SRC = 200, ZOOM_X = 3;/);
assert.match(app, /if \(zb\.down && !zb\.down\.isConnected\) zb\.down = under;/, 'a pipe drawn again on press still gets the drag (grab it again and again)');
assert.match(app, /host\.attachShadow\(\{ mode: 'open' \}\)/, 'its copy of the Tab is closed off, so nothing else finds it');
assert.match(app, /ev\.key\.toLowerCase\(\) !== 'z'\) return;\n[^\n]*closest\?\.\('input, textarea, select, \[contenteditable="true"\], dialog'\)[^\n]*\n  ev\.preventDefault\(\); zoomBox \? zoomClose\(\) : zoomOpen\(\);/, 'Z opens and closes it, never in a text box');
// it stays put and what is done in it goes to the Tab (OakBarn Brewery, 2026-11-23: "It needs to stay fixed and move the joins
// together inside the Dialog"; "have a close button upper right corner")
assert.match(app, /for \(const type of \['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'click', 'dblclick', 'contextmenu'\]\) frame\.addEventListener\(type, zoomPass\);/, 'presses, drags and clicks pass to the Tab');
assert.match(app, /if \(ev\.type === 'pointerdown'\) try \{ zb\.frame\.setPointerCapture\(ev\.pointerId\); \} catch \{ \}/, 'the box takes the pointer back after the Tab\'s own press');
assert.match(app, /zoomBox = \{ host, frame, copy: null, t: 0, size, lx: \(mx - r\.left\) \/ z, ly: \(my - r\.top\) \/ z/, 'it keeps showing the spot it opened on');
assert.match(app, /Esc or ✕ closes it\.`\),\n    h\('button', \{ type: 'button', title: 'Close the zoom box \(Esc\)'/, 'a ✕ in its upper right corner');
console.log('zoom box ok');
// 🔗 Trace + 🔧 Auto configure, only in the Zoom box (OakBarn Brewery, 2026-11-23, picked A, "has to trace back so no breaks in Ips")
assert.match(app, /if \(zoomTracePass\(ev, x, y\)\) return;/, 'the box looks at the trace first');
assert.match(app, /if \(ev\.type === 'dblclick' && \(!tr \|\| tr\.b\)\) \{\n    const ip = zoomIpAt\(x, y\); if \(!ip\) return false;/, 'a double-click on an IP starts it; anywhere else it is a double-click as before');
assert.match(app, /const one = ma \? zoomTraceBack\(ma, \[b\[0\] - a\[0\], b\[1\] - a\[1\]\], mb\)/, 'what is joined behind is traced back');
assert.match(app, /const two = one\.fail && mb \? zoomTraceBack\(mb, \[a\[0\] - b\[0\], a\[1\] - b\[1\]\], ma\) : null;/, 'then the other way round');
assert.match(app, /can't be done automatically without breaking a join or adding a pipe, hose or fitting/, 'else it says to do it by hand');
assert.match(app, /if \(it === endItem\) return \{ fail:/, 'never moves both ends');
assert.match(app, /function zoomPipeMoves\(p, k, v, zero\)/, 'a pipe takes the part along its line, a bent pipe takes it at its bend');
assert.match(app, /if \(ma && ma === mb\) return toast\(/, 'two IPs on one thing: says so');
assert.match(app, /if \(jp\) return toast\(`🔗 \$\{tr\.a\.label\} and \$\{tr\.b\.label\} are already joined by/, 'already joined by a pipe: left as it is');
assert.match(app, /pushUndo\(`auto configure \$\{tr\.a\.label\}`\);/, 'Put back undoes it');
assert.match(app, /if \(zoomBox && ev\.key === 'Escape'\) \{ if \(zoomBox\.trace\) zoomTraceEnd\(\); else zoomClose\(\); return; \}/, 'Esc stops the trace first');
console.log('zoom trace ok');
// Delete with no "Delete this item?" box; ↩ Put back (Ctrl+Z) brings it back (OakBarn Brewery, 2026-11-23)
assert.ok(!app.includes("skyConfirm('Delete this item?'"), 'no nanny box on an item\'s Properties Delete');
assert.match(app, /const delWho = item\.label \|\| item\.name \|\| lockName\(item\); pushUndo\(`delete \$\{delWho\}`\);/, 'Put back has it');
assert.match(app, /if \(r === 'delete'\) return deleteItem\(kind, item\);/, 'Properties Delete and the Delete key share one delete');
assert.match(app, /if \(ev\.key !== 'Delete' \|\| !editing \|\| !sel/, 'the Delete key, only in Edit layout with something picked');
assert.match(app, /if \(ev\.target\.closest\?\.\('input, textarea, select, \[contenteditable="true"\], dialog'\) \|\| document\.querySelector\('dialog\[open\]'\)\) return;\n  let kind = sel\.kind/, 'never while typing or with a dialog open');
console.log('delete put back ok');
